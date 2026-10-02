import { isLearningGrammarId, learningGrammar } from "../../../packages/learning-engine/learning-grammar";
import type { LearnerState, PracticeCard } from "./types";

const DAY = 86_400_000;
export function grammarStatus(state: LearnerState, id: string, now = Date.now()) {
  const history = state.grammarHistory?.[id];
  const known = !!state.declaredGrammar?.[id] || !!history && history.encounters >= 6 && new Set(history.practicedForms).size >= 6;
  const interval = [2, 4, 8, 16, 32][Math.min(4, Math.max(0, (history?.occasions ?? 0) - 1))];
  const due = known && !!history && (now >= Date.parse(history.lastPracticedAt) + interval * DAY || (state.practiceSessionCount ?? 0) - history.lastPracticeSequence >= interval);
  return { known, due, occasions: history?.occasions ?? 0, encounters: history?.encounters ?? 0 };
}
export function knownGrammar(state: LearnerState) { return new Set(learningGrammar.filter(row => grammarStatus(state, row.id).known).map(row => row.id)); }
export function grammarReviewGoals(state: LearnerState) { return Object.fromEntries(learningGrammar.filter(row => grammarStatus(state, row.id).known).map(row => [row.id, grammarStatus(state, row.id).due ? 6 : 2])); }

/** Only an actually consumed, previously unconsumed card can earn grammar credit. */
export function recordGrammarPractice(previous: LearnerState, next: LearnerState, card: PracticeCard, position: number, at: string): LearnerState {
  const session = previous.activeSession;
  if (!session || session.id !== next.activeSession?.id || position !== session.cursor || session.practicedIndices?.includes(position)
    || !next.activeSession.practicedIndices?.includes(position) || position === next.activeSession.cursor) return next;
  const ids = (card.practiceGrammar ?? []).filter(isLearningGrammarId);
  if (!ids.length) return next;
  const grammarHistory = { ...next.grammarHistory };
  for (const id of new Set(ids)) {
    const prior = grammarHistory[id];
    const newOccasion = !prior || (prior.lastOccasionSessionId !== session.id && Date.parse(at) - Date.parse(prior.lastOccasionAt) >= DAY);
    grammarHistory[id] = { encounters: (prior?.encounters ?? 0) + 1,
      practicedForms: [...new Set([...(prior?.practicedForms ?? []), card.line.join("")])].slice(-24),
      occasions: (prior?.occasions ?? 0) + (newOccasion ? 1 : 0), lastPracticedAt: at,
      lastOccasionAt: newOccasion ? at : prior!.lastOccasionAt, lastOccasionSessionId: newOccasion ? session.id : prior!.lastOccasionSessionId,
      lastPracticeSequence: next.activeSession.practiceSequence ?? next.practiceSessionCount ?? 0 };
  }
  return { ...next, grammarHistory };
}
