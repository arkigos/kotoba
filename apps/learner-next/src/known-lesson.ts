import { isLearningGrammarId } from "../../../packages/learning-engine/learning-grammar";
import { lessonConceptId } from "./lesson-vocabulary";
import { lessonId, recentLessons } from "./session-history";
import type { ActiveSession, LearnerState, WordHistory } from "./types";
import { recordCuratedCompletion } from "./curated-course";

/** A user declaration is not a consumed card, correct answer or spaced occasion. */
export function markLessonAlreadyKnown(state: LearnerState, session: ActiveSession, at = new Date().toISOString()): LearnerState {
  const cards = session.savedCards ?? session.snapshot?.cards;
  if (!cards?.length) throw new Error("Open a complete saved lesson before marking it as known.");
  const id = lessonId(session);
  const ids = new Set([...(session.targetWordIds ?? []), ...cards.flatMap(card => card.tokens.flatMap(token => token.wordId ? [token.wordId] : []))].map(lessonConceptId));
  const wordHistory = { ...state.wordHistory };
  for (const wordId of ids) {
    const prior: WordHistory = wordHistory[wordId] ?? { wordId, unitIds: [], firstSeenAt: at, lastSeenAt: at, encounters: 0, cardEncounters: 0, correct: 0, misses: 0, rating: "learning", interactionKinds: [] };
    wordHistory[wordId] = { ...prior, declaredKnownAt: prior.declaredKnownAt ?? at, declaredKnownLessonId: prior.declaredKnownLessonId ?? id };
  }
  const declaredGrammar = { ...state.declaredGrammar };
  for (const grammar of cards.flatMap(card => card.practiceGrammar ?? []).filter(isLearningGrammarId)) declaredGrammar[grammar] ??= at;
  const completed = { ...session, cursor: session.items.length, completedByDeclarationAt: session.completedByDeclarationAt ?? at };
  const history = recentLessons(state);
  const existing = history.find(row => row.id === id);
  return recordCuratedCompletion({ ...state, wordHistory, declaredGrammar,
    ...(session.starterLessonId && session.starterVersion ? { starterCompletions: { ...state.starterCompletions, [session.starterLessonId]: (state.starterCompletions?.[session.starterLessonId]?.version ?? 0) >= session.starterVersion ? state.starterCompletions![session.starterLessonId] : { version: session.starterVersion, at, method: "declared" } } } : {}),
    activeSession: state.activeSession && lessonId(state.activeSession) === id ? completed : state.activeSession,
    lessonHistory: [{ ...existing, id, session: completed, lastOpenedAt: existing?.lastOpenedAt ?? at, savedAt: existing?.savedAt ?? at, completedAt: existing?.completedAt ?? at }, ...history.filter(row => row.id !== id)] }, completed, at);
}
