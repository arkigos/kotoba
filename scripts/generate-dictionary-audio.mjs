import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { characterCount, deduplicatePronunciations, estimatedCredits, legacyTokenRef, selectWithinBudget, spokenIdentity, unambiguousLegacyRefs, uniqueSpeechRequests, unresolvedSpeechIdentities } from "./lib/dictionary-audio.mjs";
import { curatedAudioForms } from "./lib/curated-audio.mjs";
import { runAudioRequestQueue } from "./lib/audio-request-queue.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = "data/jp/dictionary/audio.json";
const requestsPath = "data/jp/dictionary/audio_requests.json";
const lockPath = path.join(root, "data/jp/dictionary/.audio-generation.lock");
let writerLock;

async function loadEnv() {
  const contents = await fs.readFile(path.join(root, ".env.local"), "utf8").catch(() => "");
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
}

async function readJson(relative, fallback) {
  try { return JSON.parse(await fs.readFile(path.join(root, relative), "utf8")); }
  catch (error) { if (error.code === "ENOENT" && fallback !== undefined) return fallback; throw error; }
}

async function writeJson(relative, value) {
  const destination = path.join(root, relative);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const temporary = `${destination}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  // Windows watchers can briefly hold the destination open. Retry only this local
  // replacement; a completed paid request must never be sent a second time.
  for (let attempt = 0; ; attempt++) {
    try { await fs.rename(temporary, destination); break; }
    catch (error) {
      if (!["EPERM", "EACCES", "EBUSY"].includes(error.code) || attempt >= 9) throw error;
      await new Promise((resolve) => setTimeout(resolve, 100 * (attempt + 1)));
    }
  }
}

function assetPath(ref) {
  if (typeof ref !== "string" || !ref.startsWith("/media/jp/audio/")) throw new Error(`Invalid audio ref: ${ref}`);
  const base = path.resolve(root, "public/media/jp/audio");
  const absolute = path.resolve(root, "public", ref.slice(1));
  if (!absolute.startsWith(`${base}${path.sep}`)) throw new Error("Audio path leaves the audio directory.");
  return absolute;
}

async function hasAudio(ref) {
  try { return (await fs.stat(assetPath(ref))).size > 0; }
  catch (error) { if (error.code === "ENOENT") return false; throw error; }
}

function parseArgs(argv) {
  const args = { generate: false, sync: false, status: false, curatedOnly: false, skipUnresolved: false, maxCharacters: Infinity, maxRequests: Infinity, words: null, concurrency: 1,
    voiceId: process.env.ELEVENLABS_VOICE_ID, modelId: process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2",
    outputFormat: process.env.ELEVENLABS_OUTPUT_FORMAT ?? "mp3_44100_128", speed: Number(process.env.ELEVENLABS_SPEED ?? "0.85") };
  for (const arg of argv) {
    if (arg === "--generate") args.generate = true;
    else if (arg === "--sync") args.sync = true;
    else if (arg === "--dry-run") { /* The default; never enables generation. */ }
    else if (arg === "--status") args.status = true;
    else if (arg === "--curated-only") args.curatedOnly = true;
    else if (arg === "--skip-unresolved") args.skipUnresolved = true;
    else if (arg.startsWith("--max-characters=")) args.maxCharacters = Number(arg.split("=")[1]);
    else if (arg.startsWith("--max-requests=")) args.maxRequests = Number(arg.split("=")[1]);
    else if (arg.startsWith("--concurrency=")) args.concurrency = Number(arg.split("=")[1]);
    else if (arg.startsWith("--words=")) args.words = new Set(arg.slice(8).split(",").filter(Boolean));
    else if (arg.startsWith("--model-id=")) args.modelId = arg.slice(11);
    else if (arg.startsWith("--voice-id=")) args.voiceId = arg.slice(11);
    else if (arg.startsWith("--speed=")) args.speed = Number(arg.slice(8));
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (args.generate && (!Number.isSafeInteger(args.maxCharacters) || args.maxCharacters < 1 || !Number.isSafeInteger(args.maxRequests) || args.maxRequests < 1)) {
    throw new Error("Paid generation requires explicit positive --max-characters and --max-requests caps. Run the default dry run first.");
  }
  if (!Number.isFinite(args.speed) || args.speed < 0.7 || args.speed > 1.2) throw new Error("Speed must be between 0.7 and 1.2.");
  if (!Number.isInteger(args.concurrency) || args.concurrency < 1 || args.concurrency > 3) throw new Error("Concurrency must be an integer from 1 to 3.");
  if (!["eleven_multilingual_v2", "eleven_flash_v2_5"].includes(args.modelId)) throw new Error("Use a supported Japanese model: eleven_multilingual_v2 or eleven_flash_v2_5.");
  if (!args.outputFormat.startsWith("mp3_")) throw new Error("Dictionary catalog currently requires MP3 output.");
  if (argv.includes("--dry-run") && (args.generate || args.sync)) throw new Error("--dry-run cannot be combined with --generate or --sync.");
  return args;
}

async function subscriptionStatus() {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) throw new Error("ELEVENLABS_API_KEY is not configured in the shell or ignored .env.local.");
  const response = await fetch(new URL("/v1/user/subscription", process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io"), {
    headers: { "xi-api-key": key }, signal: AbortSignal.timeout(30000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Subscription check failed (${response.status}, ${data.detail?.status ?? "unknown"}). ${data.detail?.status === "api_key_id_used_as_api_key" ? "The configured value is a key ID, not a secret API key. Replace it in ignored .env.local; do not paste it into chat." : "Verify key permissions in ElevenLabs."}`);
  if (!Number.isFinite(data.character_limit) || !Number.isFinite(data.character_count)) throw new Error("Subscription did not report a usable credit balance; refusing paid generation.");
  return { tier: data.tier, used: data.character_count, limit: data.character_limit, remaining: Math.max(0, data.character_limit - data.character_count), nextReset: data.next_character_count_reset_unix };
}

async function collectForms(curatedOnly = false) {
  const { words } = await readJson("data/jp/dictionary/course_bindings.json");
  const { entries } = await readJson("data/jp/dictionary/course_entries.json");
  const { units } = await readJson("data/jp/curriculum/unit_index.json");
  const forms = [], sourceWords = new Map(), loadedUnits = [];
  for (const entry of units) {
    const unit = await readJson(entry.path);
    const manifest = await readJson(`data/jp/media/manifests/unit_${String(unit.id).padStart(3, "0")}.assets.json`, {});
    loadedUnits.push({ unit, manifest });
    for (const word of unit.newWords ?? []) if (!sourceWords.has(word.id)) sourceWords.set(word.id, word);
  }
  const addForm = (wordId, data) => {
    const binding = words[wordId];
    if (!binding) return;
    const canonical = entries[binding.entryId];
    if (!canonical) throw new Error(`Dictionary entry missing for ${wordId}: ${binding.entryId}`);
    const sourceWord = sourceWords.get(wordId);
    const reading = data.reading ?? binding.reading ?? canonical.reading;
    const text = data.text ?? binding.audioText ?? sourceWord?.audioText ?? reading;
    forms.push({ entryId: binding.entryId, reading, text, wordId, variant: data.variant ?? "default", existingRefs: data.existingRefs ?? [] });
  };
  for (const [wordId, binding] of Object.entries(words)) {
    const canonical = entries[binding.entryId];
    const reading = binding.reading ?? canonical?.reading;
    const surface = binding.surface ?? canonical?.headword;
    const audioText = binding.audioText ?? sourceWords.get(wordId)?.audioText ?? reading;
    addForm(wordId, { reading, text: audioText, existingRefs: [legacyTokenRef({ surface, reading, audioText })] });
  }
  for (const { unit, manifest } of loadedUnits) {
    const manifestCards = new Map((manifest.audio ?? []).map((item) => [item.cardId, item]));
    for (const card of unit.cards ?? []) {
      for (const token of card.tokens ?? []) {
        if (!token.wordId || !words[token.wordId]) continue;
        const binding = words[token.wordId];
        const reading = token.reading ?? token.surface;
        const text = token.audioText ?? (reading === binding.reading ? binding.audioText : undefined) ?? reading;
        const existingRefs = [legacyTokenRef({ ...token, audioText: text })];
        if (token.audioRef) existingRefs.unshift(token.audioRef);
        const cardText = card.audioText ?? (card.tts?.length ? card.tts : card.line).join("");
        const asset = manifestCards.get(card.id);
        // Never reuse a sentence clip, or an old card whose manifest disagrees.
        if (card.tokens.length === 1 && cardText === text && asset?.speechText === text) {
          existingRefs.push(card.audioRef ?? asset.path);
        }
        addForm(token.wordId, { reading, text, existingRefs });
      }
    }
  }
  const extra = await readJson("data/jp/dictionary/audio_forms.json", { forms: [] });
  for (const form of extra.forms) {
    const reading = form.reading, text = form.text ?? form.audioText ?? reading;
    addForm(form.wordId, { ...form, reading, text, existingRefs: form.surface ? [legacyTokenRef({ surface: form.surface, reading, audioText: text })] : [] });
  }
  const starters = await readJson("data/jp/curriculum/starter_lessons.json");
  const starterEntries = await readJson("data/jp/dictionary/starter_entries.json");
  const functionEntries = await readJson("data/jp/dictionary/audio_function_forms.json");
  const curatedFiles = (await fs.readdir(path.join(root, "data/jp/curriculum/curated")))
    .filter(name => /^(a[12]|b[12]|c[12])\.json$/.test(name));
  const curatedLessons = [...starters.lessons];
  for (const name of curatedFiles) curatedLessons.push(...(await readJson(`data/jp/curriculum/curated/${name}`)).lessons);
  const curatedForms = curatedAudioForms(curatedLessons, {
    bindings: words, entries: { ...entries, ...starterEntries.entries }, functionEntries: functionEntries.forms,
  });
  return deduplicatePronunciations(curatedOnly ? curatedForms : [...forms, ...curatedForms]);
}

function queuedRecord(form) {
  return { entryId: form.entryId, reading: form.reading, text: form.text, variant: form.variant, status: "queued", wordIds: form.wordIds };
}

async function prepareCatalog(forms, existing) {
  const currentKeys = new Set(forms.map((form) => form.key));
  // Retain completed assets permanently; obsolete ungenerated requests cost nothing to discard.
  const pronunciations = Object.fromEntries(Object.entries(existing.pronunciations).filter(([key, value]) => currentKeys.has(key) || value.status === "complete"));
  const reusableRefs = unambiguousLegacyRefs(forms);
  let reused = 0, alreadyComplete = 0;
  for (const form of forms) {
    const prior = pronunciations[form.key];
    if (prior?.status === "complete" && prior.ref && await hasAudio(prior.ref)) { alreadyComplete++; continue; }
    // A reviewed correction can link a formerly local learning entry to JMdict.
    // Reuse only that same stable word's exact pronunciation, never a homophone
    // search or a lemma fallback for a different inflected reading.
    const rebound = Object.entries(existing.pronunciations).find(([, record]) => record.status === "complete"
      && form.wordIds.some(id => record.entryId === `kotoba:${id}` && record.wordIds?.includes(id))
      && form.entryId.startsWith("jmdict:") && record.reading === form.reading && record.text === form.text
      && (record.variant ?? "default") === (form.variant ?? "default"));
    if (rebound && await hasAudio(rebound[1].ref)) {
      pronunciations[form.key] = { ...rebound[1], ...queuedRecord(form), status: "complete", ref: rebound[1].ref,
        aliasOf: rebound[0], provenance: "Reviewed local-to-JMdict binding correction for the same learning ID and exact reading, spoken text, and accent variant." };
      reused++; continue;
    }
    const existingRef = await firstAvailable(form.existingRefs.filter((ref) => reusableRefs.has(ref)));
    if (existingRef) {
      pronunciations[form.key] = { ...queuedRecord(form), status: "complete", ref: existingRef, provider: "legacy-cache", provenance: "Exact spoken-token cache key or matching single-token card manifest; original voice/model metadata unavailable." };
      reused++;
    } else pronunciations[form.key] = prior?.status === "complete" ? { ...prior, status: "missing" } : queuedRecord(form);
  }
  const aliased = shareCompletedReadingAliases(pronunciations);
  return { catalog: { schemaVersion: 1, identityVersion: "kotoba-pronunciation-v1", pronunciations }, reused, alreadyComplete, aliased };
}

function shareCompletedReadingAliases(pronunciations) {
  const completed = new Map();
  for (const [key, record] of Object.entries(pronunciations)) {
    if (record.status === "complete") completed.set(spokenIdentity(record), { key, record });
  }
  let aliased = 0;
  for (const [key, record] of Object.entries(pronunciations)) {
    if (record.status === "complete") continue;
    const source = completed.get(spokenIdentity(record));
    if (!source) continue;
    pronunciations[key] = { ...source.record, reading: record.reading, wordIds: record.wordIds, aliasOf: source.record.aliasOf ?? source.key,
      provenance: "Same dictionary entry, exact spoken text and accent variant; display reading alias shares the existing recording." };
    aliased++;
  }
  return aliased;
}

async function firstAvailable(refs) {
  for (const ref of refs) if (ref && await hasAudio(ref)) return ref;
  return null;
}

async function synthesize(form, args) {
  const url = new URL(`/v1/text-to-speech/${encodeURIComponent(args.voiceId)}`, process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io");
  url.searchParams.set("output_format", args.outputFormat);
  const settings = { stability: 0.55, similarity_boost: 0.75, speed: args.speed, style: 0, use_speaker_boost: true };
  const response = await fetch(url, {
    method: "POST", headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text: form.text, model_id: args.modelId, language_code: "ja", voice_settings: settings }),
    signal: AbortSignal.timeout(90000),
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`TTS failed (${response.status}, ${error.detail?.status ?? "unknown"}); no automatic retry.`);
  }
  const audio = Buffer.from(await response.arrayBuffer());
  const isMp3 = audio.length >= 3 && (audio.subarray(0, 3).toString("ascii") === "ID3" || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0));
  if (!isMp3) throw new Error("TTS response was not a valid MP3 header; request may have been charged, no automatic retry.");
  return { audio, settings, requestId: response.headers.get("request-id") ?? response.headers.get("x-request-id"), billedCharacters: response.headers.get("character-cost") };
}

async function main() {
  await loadEnv();
  const args = parseArgs(process.argv.slice(2));
  if (args.status && !args.generate) { console.log(JSON.stringify(await subscriptionStatus(), null, 2)); return; }
  if (args.generate || args.sync) {
    await fs.mkdir(path.dirname(lockPath), { recursive: true });
    try { writerLock = await fs.open(lockPath, "wx"); }
    catch (error) {
      if (error.code === "EEXIST") throw new Error("Another dictionary audio writer owns .audio-generation.lock. If a previous process crashed, reconcile audio_requests.json and ElevenLabs history before removing the stale lock.");
      throw error;
    }
    await writerLock.writeFile(JSON.stringify({ pid: process.pid, startedAt: new Date().toISOString() }));
  }
  const forms = await collectForms(args.curatedOnly);
  const existing = await readJson(catalogPath, { schemaVersion: 1, pronunciations: {} });
  if (existing.schemaVersion !== 1) throw new Error("Unsupported dictionary audio catalog schema.");
  const { catalog, reused, alreadyComplete, aliased } = await prepareCatalog(forms, existing);
  const eligible = forms.filter((form) => !args.words || form.wordIds.some((id) => args.words.has(id)));
  const missing = eligible.filter((form) => catalog.pronunciations[form.key].status !== "complete");
  const journal = await readJson(requestsPath, { schemaVersion: 1, requests: {} });
  const protectedSpeech = unresolvedSpeechIdentities(forms, journal, existing.pronunciations);
  const skippedUnresolved = args.skipUnresolved ? missing.filter(form => protectedSpeech.has(spokenIdentity(form))) : [];
  const requests = uniqueSpeechRequests(args.skipUnresolved ? missing.filter(form => !protectedSpeech.has(spokenIdentity(form))) : missing);
  const plan = selectWithinBudget(requests, args);
  console.log(JSON.stringify({ mode: args.generate ? "generate" : args.sync ? "sync-existing-only" : "dry-run", scope: args.curatedOnly ? "curated-course" : "all-authored", uniquePronunciations: forms.length,
    alreadyComplete, reusableExisting: reused, readingAliasesReused: aliased, missing: missing.length, skippedUnresolved: skippedUnresolved.map(form => ({ key: form.key, text: form.text })), sharedPendingReadingAliases: missing.length - skippedUnresolved.length - requests.length, plannedRequests: plan.requests, plannedCharacters: plan.characters,
    estimatedCredits: estimatedCredits(plan.characters, args.modelId), conservativeCredits: plan.characters, model: args.modelId, concurrency: args.concurrency,
    deferredByCaps: plan.deferred.length, estimateNote: "Nominal model rate; voice/account modifiers can change billing. No sentence generation, no automatic retries." }, null, 2));
  if (!args.generate) {
    if (args.sync) await writeJson(catalogPath, catalog);
    return;
  }
  if (!args.voiceId) throw new Error("ELEVENLABS_VOICE_ID is required.");
  if (plan.requests === 0) { await writeJson(catalogPath, catalog); return; }
  const subscription = await subscriptionStatus();
  console.log(JSON.stringify({ subscription }));
  if (plan.characters > subscription.remaining) throw new Error("Planned characters exceed remaining subscription credits at the conservative 1:1 rate. Lower the cap; overage is never enabled by this tool.");
  const plannedSpeech = new Set(plan.selected.map(spokenIdentity));
  if ([...plannedSpeech].some(identity => protectedSpeech.has(identity))) throw new Error("Unresolved prior paid request for a planned pronunciation. Reconcile it with ElevenLabs history before another attempt; this script will not repeat it.");
  for (const form of forms.filter((candidate) => plannedSpeech.has(spokenIdentity(candidate)))) {
    if (journal.requests[form.key] && journal.requests[form.key].status !== "complete") throw new Error(`Unresolved prior paid request for ${form.key}. Reconcile it with ElevenLabs history before another attempt; this script will not repeat it.`);
  }
  for (const form of plan.selected) {
    const ref = `/media/jp/audio/dictionary/${form.key}.mp3`;
    if (await hasAudio(ref)) throw new Error(`Uncatalogued existing clip ${ref}; reconcile its prior request rather than overwrite or regenerate.`);
  }
  await writeJson(catalogPath, catalog);
  let generated = 0, characters = 0;
  await runAudioRequestQueue(plan.selected, {
    concurrency: args.concurrency,
    prepare: async (form) => {
      journal.requests[form.key] = { status: "requesting", startedAt: new Date().toISOString(), entryId: form.entryId, reading: form.reading, variant: form.variant, text: form.text, voiceId: args.voiceId, modelId: args.modelId };
      await writeJson(requestsPath, journal);
    },
    request: (form) => synthesize(form, args),
    complete: async (form, result) => {
      const ref = `/media/jp/audio/dictionary/${form.key}.mp3`;
      const destination = assetPath(ref);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      // Exclusive creation makes existing paid assets immutable.
      await fs.writeFile(destination, result.audio, { flag: "wx" });
      const completedAt = new Date().toISOString();
      catalog.pronunciations[form.key] = { ...queuedRecord(form), status: "complete", ref, provider: "elevenlabs", voiceId: args.voiceId, modelId: args.modelId,
        settings: { ...result.settings, languageCode: "ja", outputFormat: args.outputFormat }, generatedAt: completedAt, requestId: result.requestId,
        billedCharacters: result.billedCharacters, provenance: "Generated once for the canonical dictionary pronunciation." };
      shareCompletedReadingAliases(catalog.pronunciations);
      await writeJson(catalogPath, catalog);
      journal.requests[form.key] = { ...journal.requests[form.key], status: "complete", completedAt, requestId: result.requestId, ref };
      await writeJson(requestsPath, journal);
      generated++; characters += characterCount(form.text);
      console.log(`Generated ${generated}/${plan.requests}: ${form.text} (${form.key})`);
    },
    fail: async (form, error) => {
      journal.requests[form.key] = { ...journal.requests[form.key], status: "needs-reconciliation", stoppedAt: new Date().toISOString(), reason: error.message };
      await writeJson(requestsPath, journal);
    },
  });
  console.log(JSON.stringify({ generated, characters, estimatedCredits: estimatedCredits(characters, args.modelId), catalog: catalogPath }));
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  if (writerLock) { await writerLock.close(); await fs.unlink(lockPath); }
});
