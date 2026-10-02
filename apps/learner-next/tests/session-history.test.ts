import { beforeEach, describe, expect, it } from "vitest";
import { builderRecipes, createGeneratedSession, generateLesson, prepareSession, resolveSessionCard } from "../src/generated";
import { recordWordPractice, setWordPriority } from "../src/review";
import { lessonId, recentLessons, recordDailyPractice, restartLesson, saveLesson, saveLessonSession, trackSessionChange, wasPracticed } from "../src/session-history";
import { localDay, readState, touchWordHistory, writeState } from "../src/state";
import type { ActiveSession, LearnerState } from "../src/types";

const at = "2026-09-13T16:00:00.000Z";
const later = "2026-09-13T17:00:00.000Z";
const tomorrow = "2026-09-14T16:00:00.000Z";
const day = localDay(new Date(at));
const snapshot = generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42);

function built(id: string): ActiveSession {
  return { ...createGeneratedSession(snapshot, readState()), id, startedAt: at, cursor: 4, scores: [true, true, false, true], practicedIndices: [0, 1, 2, 3] };
}

function course(id: string): ActiveSession {
  return { id, unitId: 1, source: "course", length: "quick", startedAt: at, cursor: 0, scores: [], practicedIndices: [],
    items: [0, 1, 2].map(index => ({ cardId: `card-${index}`, prompt: "meaning", reason: "Reading" })) };
}

function practice(previous: LearnerState, wordIds: string[], when = at, practicedIndices?: number[]): LearnerState {
  const active = previous.activeSession ?? course("practice");
  const next = recordWordPractice({
    ...previous,
    wordHistory: touchWordHistory(previous, { wordIds, kind: "reading", at: when }),
    activeSession: { ...active, practicedIndices: practicedIndices ?? active.practicedIndices },
  }, wordIds, when);
  return recordDailyPractice(previous, next, wordIds, when);
}

beforeEach(() => localStorage.clear());

describe("saved and recent lessons", () => {
  it("preserves exact built cards and cursors when switching lessons and reloading", async () => {
    const initial = readState();
    const first = built("first");
    let state = trackSessionChange(initial, { ...initial, activeSession: first }, at);
    const second = { ...built("second"), snapshot: generateLesson("movement", builderRecipes.movement.targetSenseIds, 81), cursor: 0, scores: [], practicedIndices: [] };
    second.items = second.snapshot.cards.map(card => ({ cardId: card.id, prompt: "meaning", reason: "Reading" }));
    state = trackSessionChange(state, { ...state, activeSession: second }, later);
    const firstRecord = recentLessons(state).find(lesson => lesson.id === first.id)!;
    expect(firstRecord.session).toEqual(first);
    expect(recentLessons(state).map(lesson => lesson.id)).toEqual(["second", "first"]);

    state = trackSessionChange(state, { ...state, activeSession: firstRecord.session }, tomorrow);
    expect(writeState(state)).toBe(true);
    const restored = readState();
    await expect(prepareSession(restored.activeSession!)).resolves.toBeUndefined();
    expect(restored.activeSession).toEqual(first);
    expect(resolveSessionCard(restored.activeSession!)).toEqual(snapshot.cards[4]);
    expect(recentLessons(restored).find(lesson => lesson.id === "second")?.session.snapshot).toEqual(second.snapshot);
  });

  it("keeps explicitly saved lessons while trimming older unsaved recents", () => {
    let state = readState();
    const saved = built("saved-lesson");
    state = trackSessionChange(state, { ...state, activeSession: saved }, at);
    state = saveLesson(state, saved.id, true);
    for (let index = 0; index < 18; index += 1) {
      state = trackSessionChange(state, { ...state, activeSession: course(`recent-${index}`) }, new Date(Date.parse(at) + (index + 1) * 60_000).toISOString());
    }
    const records = recentLessons(state);
    expect(records.find(lesson => lesson.id === saved.id)?.savedAt).toBeTruthy();
    expect(records.filter(lesson => !lesson.savedAt)).toHaveLength(12);
    expect(records.map(lesson => lesson.id)).not.toContain("recent-0");
    expect(records[0].id).toBe("recent-17");
  });

  it("can save the current lesson before a history record exists", () => {
    const activeSession = built("active");
    const saved = saveLesson({ ...readState(), activeSession }, activeSession.id, true);
    expect(saved.lessonHistory?.[0]).toMatchObject({ id: activeSession.id, session: activeSession, savedAt: expect.any(String) });
    expect(saveLesson(saved, activeSession.id, false).lessonHistory?.[0].savedAt).toBeUndefined();
  });

  it("saves materialized topic previews without launching, counting practice, or replacing an existing session", () => {
    const active = built("existing-lesson");
    const initial = { ...readState(), activeSession: active };
    const topic: ActiveSession = { ...built("topic-preview"), source: "topic", snapshot: undefined, savedCards: snapshot.cards, cursor: 0, scores: [], practicedIndices: [] };
    const saved = saveLessonSession(initial, topic, at);
    expect(saved.activeSession).toBe(active);
    expect(saved.dailyPractice).toEqual(initial.dailyPractice);
    expect(saved.wordHistory).toEqual(initial.wordHistory);
    expect(saved.unitProgress).toEqual(initial.unitProgress);
    expect(saved.lessonHistory?.find(lesson => lesson.id === topic.id)).toMatchObject({ session: topic, savedAt: at });
    expect(saveLessonSession(saved, topic, later).lessonHistory?.filter(lesson => lesson.id === topic.id)).toHaveLength(1);
  });

  it("retains saved topic cards and the latest cursor after stale previews and recent-history eviction", () => {
    const topic: ActiveSession = { ...built("topic-keep"), source: "topic", snapshot: undefined, savedCards: snapshot.cards, cursor: 0, scores: [], practicedIndices: [] };
    const initial = readState();
    let state = saveLessonSession(initial, topic, at);
    const progressed = { ...topic, cursor: 2, practicedIndices: [0, 1] };
    state = trackSessionChange(state, { ...state, activeSession: progressed }, later);
    state = saveLessonSession(state, topic, tomorrow);
    expect(state.lessonHistory?.find(lesson => lesson.id === topic.id)?.session).toEqual(progressed);
    for (let index = 0; index < 18; index += 1) state = trackSessionChange(state, { ...state, activeSession: course(`new-${index}`) }, new Date(Date.parse(tomorrow) + index * 60_000).toISOString());
    writeState(state);
    const restored = recentLessons(readState()).find(lesson => lesson.id === topic.id)!;
    expect(restored.savedAt).toBe(at);
    expect(restored.session.cursor).toBe(2);
    expect(restored.session.savedCards).toEqual(topic.savedCards);
  });

  it("keeps Course lessons resumable without retaining a saved bookmark", () => {
    const session = course("course-bookmark");
    const initial = { ...readState(), activeSession: session, lessonHistory: [{ id: session.id, session, savedAt: at, lastOpenedAt: at }] };
    writeState(initial);
    const restored = readState();
    expect(restored.activeSession).toEqual(session);
    expect(recentLessons(restored)[0].savedAt).toBeUndefined();
    expect(saveLesson(restored, session.id, true).lessonHistory?.[0].savedAt).toBeUndefined();
  });

  it("replays the same lesson snapshot under a fresh practice ID and keeps its saved status", () => {
    const initial = readState();
    const finished = { ...built("original-run"), cursor: snapshot.cards.length, practicedIndices: snapshot.cards.map((_, index) => index), practiceSequence: 9 };
    let state = trackSessionChange(initial, { ...initial, activeSession: finished }, at);
    state = saveLesson(state, finished.id, true);
    expect(state.lessonHistory?.[0].completedAt).toBe(at);
    const replay = restartLesson(finished);
    expect(replay.id).not.toBe(finished.id);
    expect(lessonId(replay)).toBe(finished.id);
    expect(replay.snapshot).toBe(finished.snapshot);
    expect(replay.items).toEqual(finished.items);
    expect(replay).toMatchObject({ cursor: 0, scores: [], practicedIndices: [] });
    expect(replay.practiceSequence).toBeUndefined();

    state = trackSessionChange(state, { ...state, activeSession: replay }, later);
    expect(state.lessonHistory).toHaveLength(1);
    expect(state.lessonHistory?.[0].savedAt).toBeTruthy();
    expect(state.lessonHistory?.[0].completedAt).toBeUndefined();
    expect(restartLesson(replay).lessonId).toBe(finished.id);
  });
});

describe("actual daily practice", () => {
  it("does not treat bookmarks, pronunciation inspection, or prioritizing as practiced words", () => {
    const initial = readState();
    let state = { ...initial, wordHistory: touchWordHistory(initial, { wordIds: ["hon"], kind: "saved", at }) };
    state = { ...state, wordHistory: touchWordHistory(state, { wordIds: ["hon"], kind: "token", at: later }) };
    state = setWordPriority(state, "hon", true);
    expect(wasPracticed(state.wordHistory.hon)).toBe(false);
    expect(state.dailyPractice).toBeUndefined();

    const practiced = practice(state, ["hon"]);
    expect(practiced.dailyPractice?.[day]).toMatchObject({ cards: 1, newWordIds: ["hon"], reviewedWordIds: [] });
    expect(wasPracticed(practiced.wordHistory.hon)).toBe(true);
  });

  it("counts a new word once and does not also label same-day repetitions as reviews", () => {
    const first = practice(readState(), ["hon", "hon"]);
    const second = practice(first, ["hon", "yomu"], later);
    const third = practice(second, ["hon", "yomu"], later);
    expect(third.dailyPractice?.[day]).toEqual({ cards: 3, newWordIds: ["hon", "yomu"], reviewedWordIds: [], completedLessonIds: [] });

    const nextDay = practice(third, ["hon"], tomorrow);
    expect(nextDay.dailyPractice?.[localDay(new Date(tomorrow))]).toMatchObject({ cards: 1, newWordIds: [], reviewedWordIds: ["hon"] });
    expect(nextDay.dailyPractice?.[day]).toEqual(third.dailyPractice?.[day]);
  });

  it("recognizes actual practice from older profiles that predate review counters", () => {
    const initial = readState();
    const history = touchWordHistory(initial, { wordIds: ["hon"], kind: "listening", at });
    delete history.hon.review;
    const practiced = practice({ ...initial, wordHistory: history }, ["hon"]);
    expect(practiced.dailyPractice?.[day]).toMatchObject({ newWordIds: [], reviewedWordIds: ["hon"] });
  });

  it("does not complete a lesson merely by reaching its last card", () => {
    const initial = { ...readState(), activeSession: { ...course("jumped"), cursor: 3 } };
    const practiced = practice(initial, ["hon"], at, [2]);
    const tracked = trackSessionChange(initial, practiced, at);
    expect(tracked.dailyPractice?.[day].completedLessonIds).toEqual([]);
    expect(tracked.lessonHistory?.[0].completedAt).toBeUndefined();
  });

  it.each([[0, 1, 1], [0, 1, 3], [-1, 0, 1]])("does not accept repeated or out-of-range indices as full coverage: %j", (...indices) => {
    const initial = { ...readState(), activeSession: course("incomplete") };
    const practiced = practice(initial, ["hon"], at, indices);
    const tracked = trackSessionChange(initial, practiced, at);
    expect(tracked.dailyPractice?.[day].completedLessonIds).toEqual([]);
    expect(tracked.lessonHistory?.[0].completedAt).toBeUndefined();
  });

  it("counts completion once after every actual card index was practiced, in any order", () => {
    const initial = { ...readState(), activeSession: course("completed") };
    const completed = practice(initial, ["hon"], at, [2, 0, 1]);
    const repeated = practice(completed, ["hon"], later, [2, 0, 1]);
    const tracked = trackSessionChange(initial, repeated, at);
    expect(tracked.dailyPractice?.[day]).toMatchObject({ cards: 2, completedLessonIds: ["completed"] });
    expect(tracked.lessonHistory?.[0].completedAt).toBe(at);
  });
});
