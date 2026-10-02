import { localDay, touchWordHistory } from "./state";
import { wasPracticed } from "./session-history";
import { recordA1Practice } from "./a1-progress";
import type { ActivityDay, ActivityResult, GoalMetric, GoalPeriod, LearnerState, LearningGoal } from "./types";

const DAY = 86_400_000;
const dayNumber = (day: string) => Date.parse(`${day}T00:00:00Z`) / DAY;
const shiftedDay = (day: string, offset: number) => new Date((dayNumber(day) + offset) * DAY).toISOString().slice(0, 10);
const validDay = (day: string) => /^\d{4}-\d{2}-\d{2}$/.test(day) && Number.isFinite(dayNumber(day)) && shiftedDay(day, 0) === day;

export function streakSummary(days: string[], now = new Date()) {
  const today = localDay(now);
  const unique = [...new Set(days.filter(day => validDay(day) && day <= today))].sort();
  const practiced = new Set(unique);
  let longest = 0, length = 0, previous = -Infinity;
  for (const day of unique) { const number = dayNumber(day); length = number === previous + 1 ? length + 1 : 1; longest = Math.max(longest, length); previous = number; }
  let current = 0;
  let anchor = practiced.has(today) ? today : shiftedDay(today, -1);
  while (practiced.has(anchor)) { current += 1; anchor = shiftedDay(anchor, -1); }
  const nextMilestone = [3, 7, 14, 30, 60, 100, 180, 365].find(value => value > current) ?? Math.ceil((current + 1) / 100) * 100;
  return { current, longest, practicedToday: practiced.has(today), nextMilestone, today };
}

export const goalMetrics: Record<GoalMetric, { label: string; unit: string; description: string; defaults: Record<GoalPeriod, number>; max: number }> = {
  cards: { label: "Lesson cards", unit: "cards", description: "Cards practiced in Course, built lessons, and reviews.", defaults: { daily: 20, weekly: 100, total: 1000 }, max: 100000 },
  words: { label: "New words", unit: "new words", description: "Distinct words first practiced in lessons or games.", defaults: { daily: 5, weekly: 20, total: 100 }, max: 10000 },
  reviews: { label: "Words reviewed", unit: "words reviewed", description: "Previously practiced words revisited in lessons or games.", defaults: { daily: 10, weekly: 40, total: 200 }, max: 10000 },
  lessons: { label: "Lessons completed", unit: "lessons", description: "Lessons or reviews completed through actual card practice.", defaults: { daily: 1, weekly: 5, total: 25 }, max: 1000 },
  days: { label: "Practice days", unit: "days", description: "Days with card practice, a finished game, or kanji study.", defaults: { daily: 1, weekly: 5, total: 30 }, max: 3650 },
  kanji: { label: "Kanji studied", unit: "kanji", description: "Distinct characters studied or practised in the Kanji activity.", defaults: { daily: 3, weekly: 10, total: 50 }, max: 50 },
  activities: { label: "Activity rounds", unit: "rounds", description: "Completed matching, reading, listening, or kanji quiz rounds.", defaults: { daily: 2, weekly: 10, total: 50 }, max: 10000 },
};
export const periodLabels: Record<GoalPeriod, string> = { daily: "Daily", weekly: "Weekly", total: "Total" };

export function goalWindow(period: GoalPeriod, now = new Date()) {
  const end = localDay(now);
  const weekday = new Date(`${end}T00:00:00Z`).getUTCDay();
  return { start: period === "daily" ? end : period === "weekly" ? shiftedDay(end, -((weekday + 6) % 7)) : "0000-01-01", end };
}

export function goalValue(state: LearnerState, metric: GoalMetric, period: GoalPeriod, now = new Date()): number {
  const { start, end } = goalWindow(period, now);
  const inRange = (day: string) => day >= start && day <= end;
  const practice = Object.entries(state.dailyPractice ?? {}).filter(([day]) => inRange(day)).map(([, value]) => value);
  const activity = Object.entries(state.activityDays ?? {}).filter(([day]) => inRange(day)).map(([, value]) => value);
  if (metric === "cards") return practice.reduce((sum, day) => sum + day.cards, 0);
  if (metric === "days") return new Set(state.practiceDays.filter(inRange)).size;
  if (metric === "lessons") return new Set(practice.flatMap(day => day.completedLessonIds)).size;
  if (metric === "activities") return activity.reduce((sum, day) => sum + day.rounds, 0);
  if (metric === "kanji") return period === "total" ? Object.keys(state.kanjiProgress ?? {}).length : new Set(activity.flatMap(day => day.kanjiIds)).size;
  if (metric === "words" && period === "total") return Object.values(state.wordHistory).filter(wasPracticed).length;
  return new Set([...practice, ...activity].flatMap(day => metric === "words" ? day.newWordIds : day.reviewedWordIds)).size;
}

export function goalProgress(state: LearnerState, goal: LearningGoal, now = new Date()) {
  const value = goalValue(state, goal.metric, goal.period, now);
  return { value, ratio: Math.min(1, value / goal.target), reached: value >= goal.target, remaining: Math.max(0, goal.target - value) };
}

export function validGoal(metric: GoalMetric, period: GoalPeriod, target: number) {
  return metric in goalMetrics && period in periodLabels && Number.isInteger(target) && target >= 1 && target <= Math.min(goalMetrics[metric].max, metric === "days" && period !== "total" ? period === "daily" ? 1 : 7 : Infinity);
}

const emptyActivityDay = (): ActivityDay => ({ rounds: 0, correct: 0, questions: 0, seconds: 0, newWordIds: [], reviewedWordIds: [], kanjiIds: [] });

export function recordKanjiStudy(state: LearnerState, id: string, at = new Date().toISOString()): LearnerState {
  if (!id || !Number.isFinite(Date.parse(at))) return state;
  const day = localDay(new Date(at));
  const activity = state.activityDays?.[day] ?? emptyActivityDay();
  const prior = state.kanjiProgress?.[id];
  return { ...state,
    practiceDays: [...new Set([...state.practiceDays, day])].sort(),
    kanjiProgress: { ...state.kanjiProgress, [id]: { firstStudiedAt: prior?.firstStudiedAt ?? at, lastStudiedAt: at, visits: (prior?.visits ?? 0) + 1 } },
    activityDays: { ...state.activityDays, [day]: { ...activity, kanjiIds: [...new Set([...activity.kanjiIds, id])] } },
  };
}

/** Completed rounds are idempotent; page visits and abandoned rounds never count. */
export function recordActivity(state: LearnerState, result: ActivityResult): LearnerState {
  if (!result.id || !Number.isFinite(Date.parse(result.at)) || !Number.isInteger(result.total) || result.total <= 0 || !Number.isInteger(result.correct) || result.correct < 0 || result.correct > result.total || state.activityResults?.some(item => item.id === result.id) || Object.values(state.activityDays ?? {}).some(day => day.roundIds?.includes(result.id))) return state;
  const day = localDay(new Date(result.at));
  const activity = state.activityDays?.[day] ?? emptyActivityDay();
  const newWords = new Set([...activity.newWordIds, ...(state.dailyPractice?.[day]?.newWordIds ?? [])]);
  const reviewed = new Set(activity.reviewedWordIds);
  const wordIds = [...new Set(result.wordIds ?? [])];
  const missed = new Set(result.missedWordIds ?? []);
  let practicedHistory = state.wordHistory;
  for (const id of wordIds) practicedHistory = touchWordHistory({ ...state, wordHistory: practicedHistory }, { wordIds: [id], kind: result.kind === "listening" ? "listening" : "recall", at: result.at, ...(result.missedWordIds ? { correct: !missed.has(id) } : {}) });
  for (const id of wordIds) { if (!wasPracticed(state.wordHistory[id])) newWords.add(id); else if (!newWords.has(id)) reviewed.add(id); }
  let next: LearnerState = { ...recordA1Practice(state, wordIds, result.at, result.id),
    activityResults: [...(state.activityResults ?? []), result].slice(-200),
    practiceDays: [...new Set([...state.practiceDays, day])].sort(),
    wordHistory: practicedHistory,
    activityDays: { ...state.activityDays, [day]: { ...activity, rounds: activity.rounds + 1, roundIds: [...(activity.roundIds ?? []), result.id], correct: activity.correct + result.correct, questions: activity.questions + result.total, seconds: activity.seconds + Math.max(0, Math.min(3600, Number.isFinite(result.durationSeconds) ? result.durationSeconds : 0)), newWordIds: [...newWords], reviewedWordIds: [...reviewed] } },
  };
  // Games are review occasions too, but they never acquire a course unit/session.
  const sequence = (state.practiceSessionCount ?? 0) + 1;
  for (const id of wordIds) {
    const history = next.wordHistory[id];
    const prior = state.wordHistory[id]?.review;
    const newOccasion = !prior?.occasions || Date.parse(result.at) - Date.parse(prior.lastOccasionAt ?? prior.lastPracticedAt) >= DAY;
    next.wordHistory[id] = { ...history, review: { ...prior, lastPracticedAt: result.at, occasions: (prior?.occasions ?? 0) + (newOccasion ? 1 : 0), ...(newOccasion ? { lastOccasionAt: result.at, lastOccasionSessionId: result.id } : {}), lastPracticeSequence: sequence } };
  }
  if (wordIds.length) next.practiceSessionCount = sequence;
  for (const id of new Set(result.kanjiIds ?? [])) next = recordKanjiStudy(next, id, result.at);
  return next;
}
