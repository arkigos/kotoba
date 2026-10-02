import { a1WordMetadata } from "../../../packages/dictionary/a1";
import { loadDictionaryEntry } from "../../../packages/dictionary";
import { assertLessonVocabulary, knownLessonWords, unknownLessonWords } from "./lesson-vocabulary";
import { sequenceTopicCards, type TopicCandidate } from "./topic-sequence";
import { personalizedCandidates, PERSONALIZED_ENGINE_VERSION } from "../../../packages/learning-engine/personalized";
import type { ActiveSession, LearnerState, PracticeCard } from "./types";
import { knownGrammar } from "./grammar-progress";
import { grammarReviewReport } from "./adaptive-lesson";
import { appendSentenceReviews } from "./sentence-review";

export const MAX_CUSTOM_WORDS = 30;
export const MAX_CUSTOM_CARDS = 48;
export type CustomLesson = { session: ActiveSession; contextCount: number; appearances: Record<string, number>; wordOnlyIds: string[] };
const canonical = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;

/** Keeps every explicit selection, requiring reviewed sentence support for each. */
export async function buildCustomLesson(state: LearnerState, wordIds: string[], options: { cardCount?: number; title?: string; includeReview?: boolean } = {}): Promise<CustomLesson> {
  const explicitIds = [...new Set(wordIds)];
  const ids = explicitIds;
  if (!ids.length || ids.length > MAX_CUSTOM_WORDS || ids.some(id => !id.trim())) throw new Error(`Choose between 1 and ${MAX_CUSTOM_WORDS} words.`);
  await Promise.all(ids.map(id => loadDictionaryEntry(id, import.meta.env.BASE_URL)));
  const reviewedIds = ids;
  const selectedGroups = new Map<string, string[]>();
  reviewedIds.forEach(id => selectedGroups.set(canonical(id), [...(selectedGroups.get(canonical(id)) ?? []), id]));
  const known = knownLessonWords(state);
  const selected = new Set(ids.map(canonical));
  const contexts = personalizedCandidates(ids, known, knownGrammar(state));
  const candidates: TopicCandidate[] = contexts.map(card => {
    const exact = new Set(card.tokens.flatMap(token => token.wordId ? [token.wordId] : []));
    const words = new Set([...exact].map(canonical));
    const targets = reviewedIds.filter(id => (selectedGroups.get(canonical(id))?.length === 1 ? words.has(canonical(id)) : exact.has(id)));
    const unknown = unknownLessonWords(card, selected, known);
    return { card, targets, unknown };
  }).filter(candidate => candidate.targets.length && candidate.unknown.length === 0);
  const plan = sequenceTopicCards(ids, candidates, { cardCount: options.cardCount });
  assertLessonVocabulary(plan.cards, ids, state);
  const practiced = (id: string) => known.has(canonical(id));
  let session: ActiveSession = {
    id: `custom-${crypto.randomUUID()}`, source: "vocabulary", title: options.title?.trim() || "My custom lesson",
    targetWordIds: ids, savedCards: structuredClone(plan.cards), startedAt: new Date().toISOString(), length: "standard",
    mode: state.settings.lessonMode, cursor: 0, scores: [], practicedIndices: [],
    items: plan.cards.map((card, index) => ({ cardId: card.id, prompt: "explore", reason: plan.steps[index].kind === "boundary"
      ? "New sentence pattern or phrase" : plan.steps[index].kind === "neighbor"
        ? `${plan.steps[index].lexicalChanges} word change${plan.steps[index].lexicalChanges === 1 ? "" : "s"}`
        : "Words in context" })),
    lessonPlan: { version: 1, engineVersion: PERSONALIZED_ENGINE_VERSION, cardCount: plan.cards.length, appearances: plan.appearances, helperWordIds: plan.helperWordIds,
      newWordIds: ids.filter(id => !practiced(id)), reviewWordIds: ids.filter(practiced), grammarReview: grammarReviewReport(state, plan.cards), pacing: plan.pacing, transitions: plan.steps },
  };
  session = appendSentenceReviews(state, session, {enabled:options.includeReview ?? true, cardLimit:options.cardCount});
  const contextualIds = new Set(plan.cards.flatMap(card => candidates.find(candidate => candidate.card === card && card.tokens.length > 1)?.targets ?? []));
  return { session, appearances: session.lessonPlan!.appearances, contextCount: session.items.length,
    wordOnlyIds: ids.filter(id => !contextualIds.has(id)) };
}
