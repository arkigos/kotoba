import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function loadLocalEnv(relativePath) {
  try {
    const text = await fs.readFile(path.join(root, relativePath), "utf8");
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const [rawKey, ...rawValue] = line.split("=");
      const key = rawKey.trim();
      const value = rawValue.join("=").trim().replace(/^["']|["']$/g, "");
      if (key && process.env[key] === undefined) process.env[key] = value;
    }
  } catch {
    // Local env files are optional; CI and shells can provide env directly.
  }
}

await loadLocalEnv(".env.local");

const apiBaseUrl = process.env.ELEVENLABS_BASE_URL ?? "https://api.elevenlabs.io";
const apiKey = process.env.ELEVENLABS_API_KEY;
const defaultModelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const defaultOutputFormat = process.env.ELEVENLABS_OUTPUT_FORMAT ?? "mp3_44100_128";
const defaultVoiceId = process.env.ELEVENLABS_VOICE_ID;
const defaultSpeed = Number(process.env.ELEVENLABS_SPEED ?? "0.85");
const defaultLanguageCode = process.env.ELEVENLABS_LANGUAGE_CODE ?? "ja";

function parseArgs(argv) {
  const args = {
    force: false,
    dryRun: false,
    listVoices: false,
    tokens: false,
    units: null,
    cardIds: null,
    limit: Number.POSITIVE_INFINITY,
    voiceId: defaultVoiceId,
    modelId: defaultModelId,
    outputFormat: defaultOutputFormat,
    speed: defaultSpeed,
    languageCode: defaultLanguageCode,
  };

  for (const arg of argv) {
    if (arg === "--force") args.force = true;
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--list-voices") args.listVoices = true;
    else if (arg === "--tokens") args.tokens = true;
    else if (arg.startsWith("--units=")) args.units = new Set(arg.slice("--units=".length).split(",").map((value) => Number(value.trim())));
    else if (arg.startsWith("--cards=")) args.cardIds = new Set(arg.slice("--cards=".length).split(",").map((value) => value.trim()).filter(Boolean));
    else if (arg.startsWith("--limit=")) args.limit = Number(arg.slice("--limit=".length));
    else if (arg.startsWith("--voice-id=")) args.voiceId = arg.slice("--voice-id=".length);
    else if (arg.startsWith("--model-id=")) args.modelId = arg.slice("--model-id=".length);
    else if (arg.startsWith("--output-format=")) args.outputFormat = arg.slice("--output-format=".length);
    else if (arg.startsWith("--speed=")) args.speed = Number(arg.slice("--speed=".length));
    else if (arg.startsWith("--language-code=")) args.languageCode = arg.slice("--language-code=".length);
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isFinite(args.limit) || args.limit < 1) args.limit = Number.POSITIVE_INFINITY;
  if (!Number.isFinite(args.speed) || args.speed < 0.7 || args.speed > 1.2) {
    throw new Error("--speed must be a number between 0.7 and 1.2");
  }
  return args;
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

async function writeJson(relativePath, value) {
  const filePath = path.join(root, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function exists(absolutePath) {
  try {
    await fs.access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function unitSlug(unitId) {
  return `unit_${String(unitId).padStart(3, "0")}`;
}

function audioRefForCard(unitId, cardId) {
  return `/media/jp/audio/${unitSlug(unitId)}/${cardId}.mp3`;
}

function tokenAudioKey(token) {
  return `${token.surface}|${token.reading ?? token.surface}|${speechTextForToken(token)}`;
}

function audioRefForToken(token) {
  const hash = crypto.createHash("sha1").update(tokenAudioKey(token)).digest("hex").slice(0, 12);
  return `/media/jp/audio/tokens/${hash}.mp3`;
}

function publicPathFromRef(ref) {
  return path.join(root, ref.replace(/^\//, "public/"));
}

function speechTextForCard(card) {
  return card.audioText ?? (card.tts?.length ? card.tts : card.line).join("");
}

function speechTextForToken(token) {
  return token.audioText ?? token.reading ?? token.surface;
}

function shouldGenerateTokenAudio(token) {
  return Boolean(token.surface && !/^[\s、。！？!?]+$/.test(token.surface));
}

async function listVoices() {
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is required to list voices.");
  const response = await fetch(`${apiBaseUrl}/v1/voices`, {
    headers: { "xi-api-key": apiKey },
  });

  if (!response.ok) {
    throw new Error(`Could not list voices: ${response.status} ${await response.text()}`);
  }

  const payload = await response.json();
  for (const voice of payload.voices ?? []) {
    const labels = Object.entries(voice.labels ?? {}).map(([key, value]) => `${key}:${value}`).join(", ");
    console.log(`${voice.voice_id}\t${voice.name}${labels ? `\t${labels}` : ""}`);
  }
}

async function synthesizeSpeech({ text, voiceId, modelId, outputFormat, speed, languageCode }) {
  const url = new URL(`/v1/text-to-speech/${voiceId}`, apiBaseUrl);
  url.searchParams.set("output_format", outputFormat);

  const payload = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: 0.55,
      similarity_boost: 0.75,
      speed,
      style: 0,
      use_speaker_boost: true,
    },
  };
  if (languageCode) payload.language_code = languageCode;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "xi-api-key": apiKey,
      "content-type": "application/json",
      accept: "audio/mpeg",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`ElevenLabs request failed: ${response.status} ${await response.text()}`);
  }

  return {
    audio: Buffer.from(await response.arrayBuffer()),
    headers: Object.fromEntries([...response.headers.entries()].filter(([key]) => key.toLowerCase().startsWith("x-"))),
  };
}

function syncManifest(unit, existingManifest) {
  const slug = unitSlug(unit.id);
  const tokenAudioByKey = new Map();
  for (const card of unit.cards) {
    for (const token of card.tokens ?? []) {
      if (!token.audioRef) continue;
      const key = tokenAudioKey(token);
      tokenAudioByKey.set(key, {
        key,
        status: "complete",
        path: token.audioRef,
        text: token.surface,
        speechText: speechTextForToken(token),
        provider: "elevenlabs",
      });
    }
  }

  return {
    unitId: unit.id,
    unitSlug: slug,
    generatedAt: existingManifest?.generatedAt ?? new Date().toISOString(),
    audioPolicy: "production audio is generated for cards with audioRef; app uses browser speech fallback otherwise",
    audio: unit.cards.map((card) => ({
      cardId: card.id,
      status: card.audioRef ? "complete" : "queued",
      path: card.audioRef ?? audioRefForCard(unit.id, card.id),
      text: card.line.join(""),
      speechText: speechTextForCard(card),
      provider: card.audioRef ? "elevenlabs" : undefined,
    })),
    tokenAudio: [...tokenAudioByKey.values()],
  };
}

async function readJsonOrNull(relativePath) {
  try {
    return await readJson(relativePath);
  } catch {
    return null;
  }
}

async function copyExistingTokenAudio(existingRef, audioRef) {
  if (!existingRef || existingRef === audioRef) return false;
  const existingPath = publicPathFromRef(existingRef);
  if (!(await exists(existingPath))) return false;

  const outputPath = publicPathFromRef(audioRef);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.copyFile(existingPath, outputPath);
  return true;
}

async function generateAudio(args) {
  if (!apiKey && !args.dryRun) throw new Error("ELEVENLABS_API_KEY is required. Set it in your shell or .env.local before generating audio.");
  if (!args.voiceId && !args.dryRun) throw new Error("ELEVENLABS_VOICE_ID is required. Run `npm run audio:elevenlabs -- --list-voices` to inspect available voices.");

  const index = await readJson("data/jp/curriculum/unit_index.json");
  const targetEntries = index.units.filter((entry) => {
    if (args.units) return args.units.has(entry.id);
    return entry.kind === "kana" || entry.kind === "kanji";
  });
  let generated = 0;
  let skipped = 0;
  let stamped = 0;
  let generatedTokenAudio = 0;
  let skippedTokenAudio = 0;
  let generatedCharacters = 0;
  const responseHeaders = [];

  for (const entry of targetEntries) {
    const slug = unitSlug(entry.id);
    const unitPath = `data/jp/curriculum/units/${slug}.json`;
    const manifestPath = `data/jp/media/manifests/${slug}.assets.json`;
    const unit = await readJson(unitPath);

    for (const card of unit.cards) {
      if (args.cardIds && !args.cardIds.has(card.id)) continue;

      const audioRef = audioRefForCard(unit.id, card.id);
      const outputPath = publicPathFromRef(audioRef);
      const hasFile = await exists(outputPath);

      if (hasFile && !card.audioRef) {
        card.audioRef = audioRef;
        stamped += 1;
      }

      if (hasFile && !args.force) {
        skipped += 1;
        continue;
      }

      if (generated >= args.limit) continue;

      const text = speechTextForCard(card);
      if (args.dryRun) {
        console.log(`[dry-run] ${card.id}: ${text} -> ${audioRef} speed=${args.speed} language=${args.languageCode || "auto"}`);
        generated += 1;
        generatedCharacters += Array.from(text).length;
        continue;
      }

      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      const result = await synthesizeSpeech({
        text,
        voiceId: args.voiceId,
        modelId: args.modelId,
        outputFormat: args.outputFormat,
        speed: args.speed,
        languageCode: args.languageCode,
      });
      await fs.writeFile(outputPath, result.audio);
      card.audioRef = audioRef;
      generated += 1;
      generatedCharacters += Array.from(text).length;
      if (Object.keys(result.headers).length > 0) responseHeaders.push(result.headers);
      console.log(`generated ${card.id}: ${text}`);
    }

    if (args.tokens) {
      const seenTokenKeys = new Set();
      for (const card of unit.cards) {
        for (const token of card.tokens ?? []) {
          if (!shouldGenerateTokenAudio(token)) continue;

          const key = tokenAudioKey(token);
          const existingRef = token.audioRef;
          const audioRef = audioRefForToken(token);
          const outputPath = publicPathFromRef(audioRef);
          const hasFile = await exists(outputPath);

          token.audioRef = audioRef;
          if (seenTokenKeys.has(key)) continue;
          seenTokenKeys.add(key);

          if (hasFile && !args.force) {
            skippedTokenAudio += 1;
            continue;
          }

          if (!args.force && !args.dryRun && (await copyExistingTokenAudio(existingRef, audioRef))) {
            skippedTokenAudio += 1;
            continue;
          }

          const text = speechTextForToken(token);
          if (args.dryRun) {
            console.log(`[dry-run] token ${key}: ${text} -> ${audioRef} speed=${args.speed}`);
            generatedTokenAudio += 1;
            generatedCharacters += Array.from(text).length;
            continue;
          }

          await fs.mkdir(path.dirname(outputPath), { recursive: true });
          const result = await synthesizeSpeech({
            text,
            voiceId: args.voiceId,
            modelId: args.modelId,
            outputFormat: args.outputFormat,
            speed: args.speed,
            languageCode: args.languageCode,
          });
          await fs.writeFile(outputPath, result.audio);
          generatedTokenAudio += 1;
          generatedCharacters += Array.from(text).length;
          if (Object.keys(result.headers).length > 0) responseHeaders.push(result.headers);
          console.log(`generated token ${key}: ${text}`);
        }
      }
    }

    await writeJson(unitPath, unit);
    const existingManifest = await readJsonOrNull(manifestPath);
    await writeJson(manifestPath, syncManifest(unit, existingManifest));
  }

  console.log(
    `ElevenLabs audio pass complete. generated=${generated} skipped=${skipped} stamped=${stamped} tokenGenerated=${generatedTokenAudio} tokenSkipped=${skippedTokenAudio} characters=${generatedCharacters} estimatedCredits=${generatedCharacters}`,
  );
  if (responseHeaders.length > 0) {
    console.log(`ElevenLabs response headers from last request: ${JSON.stringify(responseHeaders.at(-1))}`);
  }
}

const args = parseArgs(process.argv.slice(2));
if (args.listVoices) {
  await listVoices();
} else {
  await generateAudio(args);
}
