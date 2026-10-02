import { wordBindings } from "../../../packages/dictionary";
import { a1WordMetadata } from "../../../packages/dictionary/a1";
import { wasPracticed } from "./session-history";
import type { LearnerState, PracticeCard } from "./types";

export const lessonConceptId = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;
const grammarForms = new Set(Object.values(wordBindings)
  .filter(binding => typeof binding.introducedInUnit !== "number")
  .flatMap(binding => [binding.reading, binding.audioText].filter(Boolean).map(reading => JSON.stringify([binding.surface, reading]))));

export function practicedLessonWords(state: Pick<LearnerState, "wordHistory">): Set<string> {
  return new Set(Object.keys(state.wordHistory).filter(id => wasPracticed(state.wordHistory[id])).map(lessonConceptId));
}

/** Explicit learner declarations authorize vocabulary without fabricating practice. */
export function knownLessonWords(state: Pick<LearnerState, "wordHistory">): Set<string> {
  return new Set(Object.keys(state.wordHistory).filter(id => wasPracticed(state.wordHistory[id]) || !!state.wordHistory[id].declaredKnownAt).map(lessonConceptId));
}

/** The only new lexical concepts permitted are the learner's selected targets.
 * Function words require an explicit authored binding, not a guessed POS.
 * Unlinked/unrecognized content fails closed instead of escaping the word budget. */
export function unknownLessonWords(card: PracticeCard, selected: ReadonlySet<string>, known: ReadonlySet<string>): string[] {
  return [...new Set(card.tokens.flatMap(token => {
    if (/^[\p{P}\p{Z}\s]+$/u.test(token.surface)) return [];
    if (!token.wordId) return grammarForms.has(JSON.stringify([token.surface, token.reading])) ? [] : [`untracked:${token.surface}:${token.reading}`];
    const concept = lessonConceptId(token.wordId);
    if (selected.has(concept) || known.has(concept)) return [];
    const binding = wordBindings[token.wordId];
    if (binding && typeof binding.introducedInUnit !== "number" && grammarForms.has(JSON.stringify([token.surface, token.reading]))) return [];
    return [concept];
  }))];
}

export function assertLessonVocabulary(cards: PracticeCard[], targetIds: readonly string[], state: Pick<LearnerState, "wordHistory">): void {
  const selected = new Set(targetIds.map(lessonConceptId));
  const known = knownLessonWords(state);
  if (cards.some(card => unknownLessonWords(card, selected, known).length)) {
    throw new Error("This lesson contains unfamiliar words outside its selected vocabulary. Build a new lesson from your selected words.");
  }
}
