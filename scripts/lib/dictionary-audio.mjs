import crypto from "node:crypto";
import { pronunciationIdentity } from "../../packages/dictionary/audio-key.mjs";

export function pronunciationKeySync(input) {
  return crypto.createHash("sha256").update(pronunciationIdentity(input)).digest("hex").slice(0, 24);
}

export function legacyTokenRef(token) {
  const key = `${token.surface}|${token.reading ?? token.surface}|${token.audioText ?? token.reading ?? token.surface}`;
  return `/media/jp/audio/tokens/${crypto.createHash("sha1").update(key).digest("hex").slice(0, 12)}.mp3`;
}

export function deduplicatePronunciations(forms) {
  const result = new Map();
  for (const form of forms) {
    const key = pronunciationKeySync(form);
    const previous = result.get(key);
    if (previous && pronunciationIdentity(previous) !== pronunciationIdentity(form)) throw new Error(`Audio key collision: ${key}`);
    if (!previous) result.set(key, { ...form, key, variant: form.variant ?? "default", wordIds: [], existingRefs: [] });
    const item = result.get(key);
    for (const id of [...(form.wordIds ?? []), form.wordId].filter(Boolean)) if (!item.wordIds.includes(id)) item.wordIds.push(id);
    for (const ref of form.existingRefs ?? []) if (!item.existingRefs.includes(ref)) item.existingRefs.push(ref);
  }
  return [...result.values()].sort((a, b) => a.key.localeCompare(b.key));
}

export function characterCount(text) { return Array.from(text).length; }

/** Explicit audioText resolves display-only reading aliases within the same entry/variant. */
export function spokenIdentity(form) {
  return JSON.stringify([form.entryId.normalize("NFC").trim(), form.text.normalize("NFC").trim(), form.variant ?? "default"]);
}

export function uniqueSpeechRequests(forms) {
  const groups = new Map();
  for (const form of forms) {
    const identity = spokenIdentity(form);
    const prior = groups.get(identity);
    if (!prior || (form.reading === form.text && prior.reading !== prior.text)) groups.set(identity, form);
  }
  return [...groups.values()];
}

/** A pending receipt protects every display alias of that exact spoken identity. */
export function unresolvedSpeechIdentities(forms, journal, previousPronunciations = {}) {
  const known = new Map(Object.entries(previousPronunciations));
  for (const form of forms) known.set(form.key, form);
  const protectedSpeech = new Set();
  for (const [key, receipt] of Object.entries(journal.requests)) {
    if (receipt.status === 'complete') continue;
    const form = known.get(key) ?? (receipt.entryId ? receipt : undefined);
    if (form) protectedSpeech.add(spokenIdentity(form));
  }
  return protectedSpeech;
}

/** A legacy clip cannot prove which homograph/accent it intended if several identities claim it. */
export function unambiguousLegacyRefs(forms) {
  const owners = new Map();
  for (const form of forms) {
    for (const ref of form.existingRefs ?? []) {
      if (!owners.has(ref)) owners.set(ref, new Set());
      owners.get(ref).add(pronunciationKeySync(form));
    }
  }
  return new Set([...owners].filter(([, keys]) => keys.size === 1).map(([ref]) => ref));
}

export function selectWithinBudget(forms, { maxCharacters = Infinity, maxRequests = Infinity } = {}) {
  for (const [name, value] of Object.entries({ maxCharacters, maxRequests })) {
    if (value !== Infinity && (!Number.isSafeInteger(value) || value < 0)) throw new Error(`${name} must be a nonnegative integer.`);
  }
  const selected = [], deferred = [];
  let characters = 0;
  for (const form of forms) {
    const count = characterCount(form.text);
    if (selected.length >= maxRequests || characters + count > maxCharacters) deferred.push(form);
    else { selected.push(form); characters += count; }
  }
  return { selected, deferred, characters, requests: selected.length };
}

export function estimatedCredits(characters, modelId) {
  return Math.ceil(characters * (modelId === "eleven_flash_v2_5" ? 0.5 : 1));
}
