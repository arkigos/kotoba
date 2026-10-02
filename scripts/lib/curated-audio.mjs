import { legacyTokenRef } from './dictionary-audio.mjs';

/** Exact authored tokens only: no dictionary expansion or inferred inflections. */
export function curatedAudioForms(lessons, { bindings, entries, functionEntries }) {
  const forms = [];
  const grammarBindings = new Map();
  for (const binding of Object.values(bindings)) {
    if (typeof binding.introducedInUnit !== 'number' && !grammarBindings.has(binding.surface)) {
      grammarBindings.set(binding.surface, binding);
    }
  }
  for (const lesson of lessons) for (const card of lesson.cards) for (const token of card.tokens) {
    if (/^[\s\p{P}]+$/u.test(token.surface)) continue;
    const binding = token.wordId ? bindings[token.wordId] : undefined;
    const grammar = !token.wordId && !token.dictionaryEntryId
      ? grammarBindings.get(token.surface) ?? functionEntries[token.surface]
      : undefined;
    const entryId = token.dictionaryEntryId ?? binding?.entryId
      ?? (token.wordId?.startsWith('jmdict:') ? token.wordId : undefined) ?? grammar?.entryId;
    if (!entryId) throw new Error(`${card.id}: no audio identity for ${token.surface}`);
    const reading = token.reading ?? token.surface;
    const entry = entries[entryId];
    const basePrompt = binding?.audioText && (reading === binding.reading
      || reading.replace(/[（(]な[）)]/g, '') === binding.reading) ? binding.audioText : undefined;
    const localPrompt = entry?.source === 'kotoba' && reading === entry.reading ? entry.audioText : undefined;
    const text = token.audioText ?? basePrompt ?? localPrompt ?? reading;
    forms.push({ entryId, wordId: token.wordId ?? entryId, reading, text,
      existingRefs: [token.audioRef, legacyTokenRef({ ...token, reading, audioText: text })].filter(Boolean) });
  }
  return forms;
}
