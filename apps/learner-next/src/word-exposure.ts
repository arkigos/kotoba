import type { LearnerState, WordHistory, PracticeCard } from "./types";
import { rememberReviewCard } from "./sentence-review";

/** Unlike legacy encounters, these counts never include lookups or saved words. */
export function cardExposureCount(word?: WordHistory): number | undefined {
  const value = word?.cardEncounters;
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : undefined;
}

export function cardExposureLabel(word?: WordHistory): string {
  const count = cardExposureCount(word);
  return count === undefined ? "Card exposures not tracked yet" : `${count} recorded card exposure${count === 1 ? "" : "s"}`;
}

/**
 * Called only after PracticeSession consumes a position and creates word history.
 * A repeated sentence at another position is another exposure. Revisiting a
 * consumed position is not; restarting the lesson creates a fresh practice run.
 */
export function recordCardExposures(previous: LearnerState, next: LearnerState, wordIds: readonly string[], position: number, consumedCard?: PracticeCard): LearnerState {
  const session = previous.activeSession;
  if (!session || next.activeSession?.id !== session.id || session.cursor !== position ||
    !Number.isInteger(position) || position < 0 || position >= session.items.length ||
    session.practicedIndices?.includes(position) || next.activeSession.cursor === position ||
    !next.activeSession.practicedIndices?.includes(position)) return next;

  const wordHistory = { ...next.wordHistory };
  let changed = false;
  for (const wordId of new Set(wordIds.filter(Boolean))) {
    const word = wordHistory[wordId];
    if (!word) continue;
    wordHistory[wordId] = { ...word, cardEncounters: (cardExposureCount(word) ?? 0) + 1 };
    changed = true;
  }
  const updated = changed ? { ...next, wordHistory } : next;
  const card = consumedCard ?? session.savedCards?.[position];
  return card ? rememberReviewCard(updated, card, new Date().toISOString()) : updated;
}
