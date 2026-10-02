import { personalizedCandidates } from "../../../packages/learning-engine/personalized";
import { grammarReviewGoals, knownGrammar } from "./grammar-progress";
import { lessonConceptId, knownLessonWords } from "./lesson-vocabulary";
import { suggestReviewWords } from "./review";
import type { LearnerState, PracticeCard } from "./types";

export function knownHelperRanks(state: LearnerState) {
  const known = knownLessonWords(state), ranks: Record<string, number> = {};
  let previousScore: number | undefined, rank = -1;
  for (const row of suggestReviewWords(state, 0)) {
    const id = lessonConceptId(row.wordId);
    if (!known.has(id) || id in ranks) continue;
    if (previousScore !== row.score) { rank++; previousScore = row.score; }
    ranks[id] = rank;
  }
  return ranks;
}

export function dueReviewAdditions(state: LearnerState, targets: string[], limit = Math.min(3, Math.max(1, Math.floor(targets.length / 3)))) {
  const known = knownLessonWords(state), selected = new Set(targets.map(lessonConceptId));
  const queue = suggestReviewWords(state, 0).filter(row => row.due && known.has(lessonConceptId(row.wordId)) && !selected.has(lessonConceptId(row.wordId)));
  const selectedDue: string[] = [];
  // Due words may have their own short review context. Requiring the old word
  // to share one sentence with a new target starves older unrelated vocabulary.
  // All other lexical material must still be selected or actually practiced.
  const pool = queue.slice(0, 40).map(row => row.wordId);
  const contexts = personalizedCandidates([...targets, ...pool].slice(0, 60), known, knownGrammar(state));
  for (const { wordId } of queue) {
    const concept = lessonConceptId(wordId);
    if (selectedDue.some(id => lessonConceptId(id) === concept)) continue;
    if (!contexts.some(card => card.tokens.length > 1 && card.tokens.some(t => t.wordId && lessonConceptId(t.wordId) === concept)
      && card.tokens.every(t => !t.wordId || selected.has(lessonConceptId(t.wordId)) || known.has(lessonConceptId(t.wordId))))) continue;
    selectedDue.push(wordId);
    if (selectedDue.length >= Math.min(limit, 30 - targets.length)) break;
  }
  return limit <= 0 || targets.length >= 30 ? [] : selectedDue;
}
export function grammarReviewReport(state: LearnerState, cards: PracticeCard[]) {
  const goals = grammarReviewGoals(state);
  const requested = Object.keys(goals);
  const practiced = [...new Set(cards.flatMap(card => card.practiceGrammar ?? []))];
  return { requested, practiced, deferred: requested.filter(id => cards.filter(card => card.practiceGrammar?.includes(id)).length < goals[id]) };
}
