import type { LearnerState, WordHistory } from "./types";
import { recordA1Practice } from "./a1-progress";
import { a1WordMetadata } from "../../../packages/dictionary/a1";

const DAY = 86_400_000;
const intervals = [2, 4, 8, 16, 32, 64, 128];
export type ReviewContext = Pick<LearnerState, "wordHistory" | "practiceSessionCount" | "a1CoreHistory">;
/** Old Hard marks retain their intent until the learner explicitly toggles priority. */
export const isPrioritized = (word?: WordHistory) => word?.prioritized ?? word?.rating === "hard";
export function setWordPriority(state: LearnerState, wordId: string, prioritized: boolean): LearnerState {
  if (!wordId || (!prioritized && !state.wordHistory[wordId])) return state;
  const at = new Date().toISOString();
  const word = state.wordHistory[wordId] ?? {
    wordId, unitIds: [], firstSeenAt: at, lastSeenAt: at, encounters: 0,
    correct: 0, misses: 0, rating: "learning" as const, interactionKinds: [],
    review: { lastPracticedAt: at, occasions: 0 },
  };
  return { ...state, wordHistory: { ...state.wordHistory, [wordId]: { ...word, prioritized } } };
}

export function reviewStatus(word: WordHistory, context: ReviewContext, now = Date.now(), related?: WordHistory[]) {
  const concept = a1WordMetadata[word.wordId]?.coreWordId ?? word.wordId;
  const linked = related ?? Object.values(context.wordHistory).filter(row => (a1WordMetadata[row.wordId]?.coreWordId ?? row.wordId) === concept);
  // A practiced alias is the same reviewed concept. Never let a stale canonical
  // record keep it due after its polite/dictionary form was just practiced.
  const practiced = [word, ...linked].filter(row => (row.review?.occasions ?? 0) > 0 || row.interactionKinds.some(kind => ["reading", "listening", "recall", "arrange"].includes(kind)));
  const latest = practiced.sort((a, b) => (Date.parse(b.review?.lastPracticedAt ?? b.lastSeenAt) || 0) - (Date.parse(a.review?.lastPracticedAt ?? a.lastSeenAt) || 0)
    || (b.review?.lastPracticeSequence ?? 0) - (a.review?.lastPracticeSequence ?? 0))[0] ?? word;
  const review = latest.review;
  const parsed = Date.parse(review?.lastPracticedAt ?? latest.lastSeenAt);
  const practicedAt = Number.isFinite(parsed) ? parsed : now;
  const occasions = Math.max(context.a1CoreHistory?.[concept]?.occasions ?? 0, ...[word, ...linked].map(row => row.review?.occasions ?? 0));
  // Card encounters count actual consumption, not lookups. Spaced occasions
  // drive growth; mass exposure in one sitting can at most double the interval.
  const exposures = Math.max(0, ...practiced.map(row => row.cardEncounters ?? 0));
  const exposureFactor = 1 + Math.min(1, Math.max(0, Math.log2(Math.max(1, exposures / 4))) / 4);
  const interval = Math.max(1, intervals[Math.min(intervals.length - 1, Math.max(0, occasions - 1))] * exposureFactor / (isPrioritized(word) ? 2 : 1));
  const daysAgo = Math.max(0, Math.floor((now - practicedAt) / DAY));
  const sessionsAgo = review?.lastPracticeSequence === undefined ? undefined : Math.max(0, (context.practiceSessionCount ?? 0) - review.lastPracticeSequence);
  const dueAt = practicedAt + interval * DAY;
  const declarationOnly = !practiced.length && !!word.declaredKnownAt;
  const due = !declarationOnly && now >= dueAt;
  const overdue = Math.max(0, (now - practicedAt) / DAY / interval);
  const reason = due ? (now >= dueAt ? `${daysAgo} days since ${review?.occasions === 0 ? "adding this word" : "practice"}` : `${sessionsAgo} lessons since practice`) : isPrioritized(word) ? "You prioritized this word" : "Recent vocabulary";
  return { due, dueAt, interval, daysAgo, sessionsAgo, overdue, reason: declarationOnly ? "Marked known · not practiced yet" : reason, practicedAt, occasions, exposures, declarationOnly };
}

/** Called on card practice, never merely on inspection, bookmarking, or prioritizing. */
export function recordWordPractice(state: LearnerState, wordIds: string[], at: string): LearnerState {
  const session = state.activeSession;
  if (!session) return state;
  const a1State = recordA1Practice(state, wordIds, at, session.id);
  const sequence = session.practiceSequence ?? (state.practiceSessionCount ?? 0) + 1;
  const wordHistory = { ...state.wordHistory };
  for (const id of new Set(wordIds)) {
    const word = wordHistory[id];
    if (!word) continue;
    const previous = word.review;
    const lastOccasion = Date.parse(previous?.lastOccasionAt ?? "");
    const newOccasion = !previous?.occasions || (previous.lastOccasionSessionId !== session.id && Date.parse(at) - lastOccasion >= DAY);
    wordHistory[id] = { ...word, review: {
      ...previous,
      lastPracticedAt: at,
      occasions: (previous?.occasions ?? 0) + (newOccasion ? 1 : 0),
      ...(newOccasion ? { lastOccasionAt: at, lastOccasionSessionId: session.id } : {}),
      lastPracticeSequence: sequence,
    } };
  }
  return { ...a1State, wordHistory, practiceSessionCount: Math.max(state.practiceSessionCount ?? 0, sequence), activeSession: { ...session, practiceSequence: sequence } };
}

export type ReviewSuggestion = { wordId: string; reason: string; due: boolean; priority: boolean; score: number };
function stableNoise(id: string, seed: number) {
  let value = seed >>> 0;
  for (const char of id) value = Math.imul(value ^ char.charCodeAt(0), 16777619) >>> 0;
  return (value + 1) / 4294967297;
}
export function suggestReviewWords(context: ReviewContext, seed: number, now = Date.now()): ReviewSuggestion[] {
  const groups = new Map<string, WordHistory[]>();
  for (const word of Object.values(context.wordHistory)) { const id = a1WordMetadata[word.wordId]?.coreWordId ?? word.wordId; const group = groups.get(id) ?? []; group.push(word); groups.set(id, group); }
  return Object.values(context.wordHistory).filter(word => !word.declaredKnownAt || !!word.review?.occasions || word.interactionKinds.some(kind => ["reading", "listening", "recall", "arrange"].includes(kind))).map(word => {
    const status = reviewStatus(word, context, now, groups.get(a1WordMetadata[word.wordId]?.coreWordId ?? word.wordId));
    const priority = isPrioritized(word);
    const age = Math.max(0, (now - status.practicedAt) / DAY);
    const recent = age < status.interval;
    // Relative lateness lets fragile recent learning outrank well-established
    // older words. Actual practice refreshes this score; preview never does.
    const score = (status.due ? 1_000_000 : 0) + Math.min(9999, status.overdue) * 100;
    return { wordId: word.wordId, due: status.due, priority, score,
      reason: status.due ? `Due · ${status.reason}` : recent ? "Recently practiced" : "Occasional refresher" };
  }).sort((a, b) => b.score - a.score || Number(b.priority) - Number(a.priority) || stableNoise(a.wordId, seed) - stableNoise(b.wordId, seed) || a.wordId.localeCompare(b.wordId));
}
