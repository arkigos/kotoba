import audioJson from "../../data/jp/dictionary/audio.json";
import { pronunciationIdentity } from "./audio-key.mjs";
import { dictionaryEntry, entryIdForWord, grammarEntryForForm, wordBindings } from "./index";

type PronouncedToken = {surface: string; reading?: string; audioText?: string; wordId?: string; dictionaryEntryId?: string};
type Recording = {entryId: string; reading: string; text: string; variant?: string; status: string; ref?: string};
const recordings = new Map<string, string>();
function updateRecordings(catalog: { pronunciations: Record<string, unknown> }) {
  recordings.clear();
  for (const recording of Object.values(catalog.pronunciations) as Recording[]) {
    if (recording.status === "complete" && recording.ref) recordings.set(pronunciationIdentity(recording), recording.ref);
  }
}
updateRecordings(audioJson);

// Offline recording writes this catalog after every successful request. Accept
// those additions here so Fast Refresh cannot restart an active lesson's audio.
if (import.meta.hot) import.meta.hot.accept("../../data/jp/dictionary/audio.json", module => {
  if (module) updateRecordings(module.default);
});

/** Preserve exact inflected readings; only base display notation uses its authored prompt. */
export function speechForToken(token: PronouncedToken) {
  if (token.audioText) return token.audioText;
  const binding = token.wordId ? wordBindings[token.wordId] : undefined;
  const reading = token.reading ?? token.surface;
  if (binding?.audioText && reading === binding.reading) return binding.audioText;
  // Older saved cards may still carry the authored dictionary display suffix.
  // Only normalize it when the result is this exact binding's base reading.
  if (binding?.audioText && reading.replace(/[（(]な[）)]/g, "") === binding.reading) return binding.audioText;
  const lookupId = token.dictionaryEntryId ?? (!token.wordId ? grammarEntryForForm(token.surface) : undefined);
  const entry = lookupId ? dictionaryEntry(lookupId) : undefined;
  if (entry?.source === "kotoba" && reading === entry.reading && "audioText" in entry && typeof entry.audioText === "string") return entry.audioText;
  return reading;
}
export function recordingForToken(token: PronouncedToken): string | undefined {
  const entryId = token.dictionaryEntryId ?? (token.wordId ? entryIdForWord(token.wordId) : grammarEntryForForm(token.surface));
  if (!entryId) return undefined;
  return recordings.get(pronunciationIdentity({ entryId, reading: token.reading ?? token.surface, text: speechForToken(token) }));
}
