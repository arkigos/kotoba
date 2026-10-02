import type { ActiveSession, DailyPractice, LearnerState, StoredLesson, WordHistory } from "./types";
import { localDay } from "./state";
import { recordCuratedCompletion } from "./curated-course";

const RECENT_LIMIT = 12;
// Reserve browser storage for progress and explicitly saved lessons. Old 300-card
// snapshots can otherwise exhaust localStorage before reaching the count limit.
const RECENT_BYTES = 2_000_000;
export const lessonId = (session: ActiveSession) => session.lessonId ?? session.id;
export const canSaveLesson = (session: ActiveSession) => session.source === "topic" || session.source === "vocabulary" || (session.source === "generated" && session.snapshot?.engineVersion !== "saved-replay");
export const isSessionComplete = (session: ActiveSession) => session.items.length > 0 && (!!session.completedByDeclarationAt || new Set((session.practicedIndices ?? []).filter(index => Number.isInteger(index) && index >= 0 && index < session.items.length)).size === session.items.length);
export const wasPracticed = (word?: WordHistory) => !!word && ((word.review?.occasions ?? 0) > 0 || word.interactionKinds.some(kind => ["reading", "listening", "recall", "arrange"].includes(kind)));
export const emptyDay = (): DailyPractice => ({ cards: 0, newWordIds: [], reviewedWordIds: [], completedLessonIds: [] });

/** Clear playable snapshots, with a persistent restore path; learning survives. */
export function clearLessonShelf(state: LearnerState): LearnerState {
  return { ...state, clearedLessons: [...new Map([...(state.clearedLessons ?? []), ...recentLessons(state)].map(lesson => [lesson.id, lesson])).values()], lessonHistory: [], activeSession: undefined };
}
export function restoreClearedLessons(state: LearnerState): LearnerState {
  return { ...state, lessonHistory: [...new Map([...(state.clearedLessons ?? []), ...recentLessons(state)].map(lesson => [lesson.id, lesson])).values()], clearedLessons: [] };
}

export function recentLessons(state: LearnerState): StoredLesson[] {
  const lessons = (state.lessonHistory ?? []).map(lesson => lesson.savedAt && !canSaveLesson(lesson.session) ? { ...lesson, savedAt: undefined } : lesson);
  const active = state.activeSession;
  if (active && !lessons.some(lesson => lesson.id === lessonId(active))) lessons.push({ id: lessonId(active), session: active, lastOpenedAt: active.startedAt });
  return lessons.sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt));
}

/** Keep exact generated cards, and update positions without losing other lessons. */
export function trackSessionChange(previous: LearnerState, next: LearnerState, at = new Date().toISOString()): LearnerState {
  if (previous.activeSession === next.activeSession) return next;
  let history = recentLessons(next);
  const starterCompletions = { ...next.starterCompletions };
  const remember = (session: ActiveSession, openedAt: string) => {
    next = recordCuratedCompletion(next, session, at);
    const id = lessonId(session);
    const existing = history.find(lesson => lesson.id === id);
    const complete = isSessionComplete(session);
    if (complete && session.starterLessonId && session.starterVersion && (starterCompletions[session.starterLessonId]?.version ?? 0) < session.starterVersion) starterCompletions[session.starterLessonId] = { version: session.starterVersion, at, method: session.completedByDeclarationAt ? "declared" : "practiced" };
    const record: StoredLesson = {
      ...existing, id, session, lastOpenedAt: openedAt,
      completedAt: complete ? existing?.completedAt ?? at : session.id !== existing?.session.id ? undefined : existing?.completedAt,
    };
    history = [record, ...history.filter(lesson => lesson.id !== id)];
  };
  if (previous.activeSession) remember(previous.activeSession, history.find(lesson => lesson.id === lessonId(previous.activeSession!))?.lastOpenedAt ?? previous.activeSession.startedAt);
  if (next.activeSession) remember(next.activeSession, at);
  let recent = 0;
  let bytes = 0;
  history.sort((a, b) => b.lastOpenedAt.localeCompare(a.lastOpenedAt));
  return { ...next, starterCompletions, lessonHistory: history.filter(lesson => {
    if (lesson.savedAt) return true;
    const size = JSON.stringify(lesson).length * 2;
    if (recent >= RECENT_LIMIT || (recent > 0 && bytes + size > RECENT_BYTES)) return false;
    recent += 1; bytes += size; return true;
  }) };
}

export function restartLesson(session: ActiveSession): ActiveSession {
  return { ...session, lessonId: lessonId(session), id: crypto.randomUUID(), startedAt: new Date().toISOString(), cursor: 0, scores: [], practicedIndices: [], practiceSequence: undefined, completedByDeclarationAt: undefined };
}

export function saveLesson(state: LearnerState, id: string, saved: boolean): LearnerState {
  return { ...state, lessonHistory: recentLessons(state).map(lesson => lesson.id === id && canSaveLesson(lesson.session) ? { ...lesson, savedAt: saved ? new Date().toISOString() : undefined } : lesson) };
}

/** Save a materialized preview without opening it or replacing a newer cursor.
 * Saved entries are exempt from both recent-session retention limits. */
export function saveLessonSession(state: LearnerState, session: ActiveSession, at = new Date().toISOString()): LearnerState {
  if (!canSaveLesson(session)) return state;
  const id = lessonId(session);
  const history = recentLessons(state);
  const existing = history.find(lesson => lesson.id === id);
  const active = state.activeSession && lessonId(state.activeSession) === id ? state.activeSession : undefined;
  const record: StoredLesson = { ...existing, id, session: active ?? existing?.session ?? session,
    lastOpenedAt: existing?.lastOpenedAt ?? at, savedAt: existing?.savedAt ?? at };
  return { ...state, lessonHistory: [record, ...history.filter(lesson => lesson.id !== id)] };
}

/** Counts only actual practice. Bookmarking, inspecting and jumping do not count. */
export function recordDailyPractice(previous: LearnerState, next: LearnerState, wordIds: string[], at: string): LearnerState {
  const day = localDay(new Date(at));
  const daily = previous.dailyPractice?.[day] ?? emptyDay();
  const newWords = new Set([...daily.newWordIds, ...(previous.activityDays?.[day]?.newWordIds ?? [])]);
  const reviewed = new Set(daily.reviewedWordIds);
  for (const id of new Set(wordIds)) {
    if (!wasPracticed(previous.wordHistory[id])) newWords.add(id);
    else if (!newWords.has(id)) reviewed.add(id);
  }
  const completed = new Set(daily.completedLessonIds);
  const session = next.activeSession;
  if (session && (isSessionComplete(session) || next.completedUnits.some(id => !previous.completedUnits.includes(id)))) completed.add(session.id);
  return { ...next, dailyPractice: { ...next.dailyPractice, [day]: { cards: daily.cards + 1, newWordIds: [...newWords], reviewedWordIds: [...reviewed], completedLessonIds: [...completed] } } };
}
