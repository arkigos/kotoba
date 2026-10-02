import kanjiUnit from "../../../data/jp/curriculum/units/unit_103.json";
import type { ActiveSession, LearnerState, UnitProgress } from "./types";

const unitId = 103;
const revision = 2;
const previousCount = 20;
const cardIds = kanjiUnit.cards.map(card => card.id);
const previousIds = cardIds.slice(0, previousCount);
const validIds = new Set(cardIds);
const oldIds = new Set(previousIds);
const isCourse = (session: ActiveSession) => session.unitId === unitId &&
  (session.source === "course" || session.source === undefined) && !session.snapshot && !session.savedCards;

/** Extend the old complete deck in place. Review subsets and materialized cards
 * have their own source and must retain their original contents. */
export function expandCourseSession(session: ActiveSession): ActiveSession {
  if (!isCourse(session) || session.items.length !== previousCount ||
    session.items.some((item, index) => item.cardId !== previousIds[index] || item.unitId !== undefined && item.unitId !== unitId)) return session;
  return {
    ...session,
    items: [...session.items, ...cardIds.slice(previousCount).map((cardId, offset) => ({
      cardId, unitId,
      prompt: session.items[offset % previousCount].prompt,
      reason: `Authored encounter ${previousCount + offset + 1} of ${cardIds.length}`,
    }))],
  };
}

function practicedCardIds(session: ActiveSession): string[] {
  if (!isCourse(session)) return [];
  return (session.practicedIndices ?? []).flatMap(index => {
    if (!Number.isInteger(index) || index < 0 || index >= session.items.length) return [];
    const id = session.items[index]?.cardId;
    return id && validIds.has(id) ? [id] : [];
  });
}

/** One-time denominator migration. Subsequent visits use the revised deck size,
 * so a partial new deck is never repeatedly reduced from 50 back to 20. */
export function migrateExpandedCourses(state: LearnerState): LearnerState {
  const activeSession = state.activeSession && expandCourseSession(state.activeSession);
  let changedHistory = false;
  const lessonHistory = state.lessonHistory?.map(lesson => {
    const session = expandCourseSession(lesson.session);
    if (session === lesson.session) return lesson;
    changedHistory = true;
    // Completing the old 20 was legitimate. It remains in dailyPractice; this
    // resumable deck now has 30 unpracticed additions, so its current badge clears.
    return { ...lesson, session, completedAt: undefined };
  });
  const sessionsChanged = activeSession !== state.activeSession || changedHistory;
  if ((state.courseRevisions?.[String(unitId)] ?? 0) >= revision) {
    return sessionsChanged ? { ...state, activeSession, ...(changedHistory ? { lessonHistory } : {}) } : state;
  }

  const previous = state.unitProgress[String(unitId)];
  const wasComplete = state.completedUnits.includes(unitId);
  const practiced = [state.activeSession, ...(state.lessonHistory ?? []).map(lesson => lesson.session)]
    .flatMap(session => session ? practicedCardIds(session) : []);
  let progress: UnitProgress | undefined;
  let completedUnits = state.completedUnits;
  if (previous || wasComplete || practiced.length) {
    const viewed = new Set((previous?.viewedCardIds ?? []).filter(id => validIds.has(id)));
    if (!previous?.viewedCardIds) {
      const oldExposure = Number.isFinite(previous?.exposure) ? Math.max(0, Math.min(1, previous!.exposure)) : 0;
      const inferredCount = wasComplete ? previousCount : Math.min(previousCount - 1, Math.round(oldExposure * previousCount));
      previousIds.slice(0, inferredCount).forEach(id => viewed.add(id));
    } else if (wasComplete && ![...viewed].some(id => !oldIds.has(id))) {
      // Preserve completion credited against the original deck even if its old
      // profile had only partial per-card records during the earlier migration.
      previousIds.forEach(id => viewed.add(id));
    }
    practiced.forEach(id => viewed.add(id));
    const expandedComplete = viewed.size === cardIds.length;
    if (!expandedComplete) completedUnits = completedUnits.filter(id => id !== unitId);
    const lastCardIndex = Math.max(0, Math.min(cardIds.length - 1, Number.isInteger(previous?.lastCardIndex) ? previous!.lastCardIndex : 0));
    progress = {
      ...previous,
      exposure: viewed.size / cardIds.length,
      mastery: previous?.mastery ?? 0,
      viewedCardIds: [...viewed],
      lastCardIndex: wasComplete && !expandedComplete && ![...viewed].some(id => !oldIds.has(id)) ? Math.max(previousCount, lastCardIndex) : lastCardIndex,
    };
  }
  return {
    ...state, activeSession, completedUnits,
    ...(changedHistory ? { lessonHistory } : {}),
    ...(progress ? { unitProgress: { ...state.unitProgress, [String(unitId)]: progress } } : {}),
    courseRevisions: { ...state.courseRevisions, [String(unitId)]: revision },
  };
}
