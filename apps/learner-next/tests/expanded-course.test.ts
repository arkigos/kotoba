import { beforeEach, describe, expect, it } from "vitest";
import unit from "../../../data/jp/curriculum/units/unit_103.json";
import { expandCourseSession, migrateExpandedCourses } from "../src/expanded-course";
import { readState, stateKey, writeState } from "../src/state";
import type { ActiveSession, LearnerState } from "../src/types";

const ids = unit.cards.map(card => card.id);
const originalIds = ids.slice(0, 20);
const at = "2026-09-12T15:00:00.000Z";
function legacyState(): LearnerState {
  const state = readState();
  delete state.courseRevisions;
  return state;
}
function oldSession(): ActiveSession {
  return { id: "kanji-before-expansion", lessonId: "kanji-lesson", unitId: 103, source: "course", length: "deep", startedAt: at,
    cursor: 9, scores: [true, false, true], practicedIndices: [0, 3, 8], mode: "listening", practiceSequence: 7,
    items: originalIds.map(cardId => ({ cardId, unitId: 103, prompt: "listening", reason: "Kanji practice" })) };
}
beforeEach(() => localStorage.clear());

describe("expanded Kanji course migration", () => {
  it("extends active and stored course decks while keeping their original work", () => {
    const session = oldSession();
    const original = structuredClone(session);
    const state: LearnerState = { ...legacyState(), activeSession: session,
      lessonHistory: [{ id: "kanji-lesson", session: { ...session, source: undefined, cursor: 20 }, lastOpenedAt: at, completedAt: at }] };
    const next = migrateExpandedCourses(state);
    expect(next.activeSession?.items.map(item => item.cardId)).toEqual(ids);
    expect(next.activeSession?.items.slice(0, 20)).toEqual(session.items);
    expect(next.activeSession?.items.slice(20).every(item => item.prompt === "listening")).toBe(true);
    expect(next.activeSession).toMatchObject({ id: session.id, lessonId: session.lessonId, cursor: 9, scores: session.scores, practicedIndices: session.practicedIndices, mode: session.mode, practiceSequence: 7 });
    expect(next.lessonHistory?.[0].session.cursor).toBe(20);
    expect(next.lessonHistory?.[0].session.items).toHaveLength(50);
    expect(next.lessonHistory?.[0].completedAt).toBeUndefined();
    expect(session).toEqual(original);
  });

  it("reopens completed20-card progress at40percent without erasing historical completion", () => {
    const state: LearnerState = { ...legacyState(), completedUnits: [1, 103],
      unitProgress: { "103": { exposure: 1, mastery: 0.85, lastCardIndex: 19, lastStudiedAt: at } },
      dailyPractice: { "2026-09-12": { cards: 20, newWordIds: [], reviewedWordIds: [], completedLessonIds: ["old-completion"] } } };
    const next = migrateExpandedCourses(state);
    expect(next.completedUnits).toEqual([1]);
    expect(next.unitProgress["103"]).toEqual({ exposure: 0.4, mastery: 0.85, lastCardIndex: 20, lastStudiedAt: at, viewedCardIds: originalIds });
    expect(next.dailyPractice).toBe(state.dailyPractice);
    expect(next.courseRevisions?.["103"]).toBe(2);
  });

  it("rescales explicit and legacy partial progress against the old denominator", () => {
    const partial: LearnerState = { ...legacyState(), unitProgress: { "103": { exposure: 0.5, mastery: 0.6, lastCardIndex: 13 } } };
    const next = migrateExpandedCourses(partial);
    expect(next.unitProgress["103"]).toMatchObject({ exposure: 0.2, mastery: 0.6, lastCardIndex: 13, viewedCardIds: originalIds.slice(0, 10) });
    expect(migrateExpandedCourses(next)).toBe(next);
    const exact = migrateExpandedCourses({ ...partial, unitProgress: { "103": { ...partial.unitProgress["103"], viewedCardIds: [ids[3], ids[17]] } } });
    expect(exact.unitProgress["103"].viewedCardIds).toEqual([ids[3], ids[17]]);
    expect(exact.unitProgress["103"].exposure).toBe(2 / 50);
    const oldInflatedExposure = migrateExpandedCourses({ ...partial, unitProgress: { "103": { ...partial.unitProgress["103"], exposure: 1 } } });
    expect(oldInflatedExposure.unitProgress["103"].viewedCardIds).toHaveLength(19);
  });

  it("preserves work completed on the expanded deck before the marker existed", () => {
    const complete: LearnerState = { ...legacyState(), completedUnits: [103], unitProgress: { "103": { exposure: 1, mastery: 1, lastCardIndex: 49, viewedCardIds: ids } } };
    const next = migrateExpandedCourses(complete);
    expect(next.completedUnits).toEqual([103]);
    expect(next.unitProgress["103"]).toEqual(complete.unitProgress["103"]);
    const partial: LearnerState = { ...legacyState(), unitProgress: { "103": { exposure: 3 / 50, mastery: 0.5, lastCardIndex: 30, viewedCardIds: [ids[2], ids[20], ids[30]] } } };
    expect(migrateExpandedCourses(partial).unitProgress["103"]).toEqual(partial.unitProgress["103"]);
  });

  it("never rewrites Library, saved, generated, unrelated or custom subset decks", () => {
    for (const source of ["library", "saved", "generated"] as const) {
      const session = { ...oldSession(), source };
      expect(expandCourseSession(session)).toBe(session);
      const state = { ...legacyState(), activeSession: session, lessonHistory: [{ id: session.id, session, lastOpenedAt: at, completedAt: at }] };
      expect(migrateExpandedCourses(state).lessonHistory?.[0]).toBe(state.lessonHistory[0]);
    }
    const subset = { ...oldSession(), items: oldSession().items.slice(0, 6) };
    expect(expandCourseSession(subset)).toBe(subset);
    const other = { ...oldSession(), unitId: 1 };
    expect(expandCourseSession(other)).toBe(other);
  });

  it("runs on persisted reads, retains save-policy normalization, and marks fresh profiles", () => {
    const state = { ...legacyState(), completedUnits: [103], activeSession: oldSession(), lessonHistory: [{ id: "old", session: oldSession(), lastOpenedAt: at, savedAt: at }] };
    localStorage.setItem(stateKey, JSON.stringify(state));
    const loaded = readState();
    expect(loaded.activeSession?.items).toHaveLength(50);
    expect(loaded.lessonHistory?.[0].savedAt).toBeUndefined();
    expect(loaded.unitProgress["103"].exposure).toBe(0.4);
    writeState(loaded);
    expect(readState()).toEqual(loaded);
    localStorage.clear();
    expect(readState().courseRevisions?.["103"]).toBe(2);
    expect(readState().unitProgress["103"]).toBeUndefined();
  });
});
