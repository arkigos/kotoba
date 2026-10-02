import { createGeneratedSession } from "./generated";
import { assertLessonCardQuality } from "./lesson-card-quality";
import { TOTAL_CARD_LIMIT } from "./topic-sequence";
import type { ActiveSession, LearnerState, LibraryReviewMode, PracticeCard, PromptKind } from "./types";

/** A handpicked review queue owns its card text, even if source lessons change. */
export function savedSentencesSession(cards: PracticeCard[], _state: LearnerState, mode: LibraryReviewMode = "mixed"): ActiveSession {
  if (!cards.length) throw new Error("Save a sentence before starting a saved-sentence review.");
  assertLessonCardQuality(cards);
  if (cards.length > TOTAL_CARD_LIMIT) throw new Error(`Choose up to ${TOTAL_CARD_LIMIT} saved sentences for one review.`);
  const savedCards = structuredClone(cards);
  const prompts: PromptKind[] = ["listening", "meaning", "recall", "arrange", "listening", "recall"];
  return {
    id: `saved-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`}`,
    source: "saved", savedCards, title: cards.length === 1 ? "Saved sentence" : "Saved sentences",
    length: cards.length <= 6 ? "quick" : cards.length <= 10 ? "standard" : "deep",
    startedAt: new Date().toISOString(), cursor: 0, scores: [], practicedIndices: [], mode,
    items: savedCards.map((card, index) => {
      const prompt = mode === "mixed" ? prompts[index % prompts.length] : mode;
      return { cardId: card.id, prompt: prompt === "arrange" && card.tokens.length < 2 ? "meaning" : prompt, reason: "Saved sentence" };
    }),
  };
}

/** Replay the saved materialized sentence without regenerating its content. */
export function savedSentenceSession(saved: NonNullable<LearnerState["savedGeneratedCards"]>[string], state: LearnerState) {
  const { card } = saved;
  assertLessonCardQuality([card]);
  return createGeneratedSession({
    schemaVersion: 1, engineVersion: "saved-replay", lexiconVersion: "saved-replay", seed: 0,
    recipe: {
      schemaVersion: 1, id: saved.recipeId, revision: 1, title: saved.title,
      targetSenseIds: card.senseIds, helperSenseIds: [], knownGrammar: [],
      phases: [{ id: "saved", construction: card.derivation.construction, features: card.derivation.features, count: 1 }],
      maxChangedSlots: 1, minTargetExposures: 1,
    },
    cards: [card], transitions: [{ kind: "start", changedSlots: [], phaseId: "saved" }],
    coverage: Object.fromEntries(card.senseIds.map(id => [id, 1])),
    wordCoverage: Object.fromEntries(card.tokens.flatMap(token => token.wordId ? [[token.wordId, 1]] : [])),
  }, state);
}
