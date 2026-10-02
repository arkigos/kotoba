import { beforeEach, describe, expect, it } from "vitest";
import { goalProgress, goalValue, goalWindow, recordActivity, recordKanjiStudy, streakSummary, validGoal } from "../src/goals";
import { recordDailyPractice } from "../src/session-history";
import { localDay, readState, touchWordHistory, writeState } from "../src/state";
import type { ActivityResult, DailyPractice, LearnerState, LearningGoal } from "../src/types";

const date = (day: string) => new Date(`${day}T12:00:00`);
const at = date("2026-09-13").toISOString();
const today = localDay(date("2026-09-13"));
const tomorrow = date("2026-09-14").toISOString();
const day = (cards = 0, newWordIds: string[] = [], reviewedWordIds: string[] = [], completedLessonIds: string[] = []): DailyPractice => ({ cards, newWordIds, reviewedWordIds, completedLessonIds });
const result = (id = "round-1", extra: Partial<ActivityResult> = {}): ActivityResult => ({ id, kind: "pairs", correct: 2, total: 3, wordIds: ["yomu", "hon", "yomu"], at, durationSeconds: 30, ...extra });

beforeEach(() => localStorage.clear());

describe("streaks and goal calendar windows", () => {
  it("keeps yesterday's streak alive, includes today once, and breaks on a missing day", () => {
    const days = ["2026-09-10", "2026-09-11", "2026-09-12", "2026-09-12", "2026-09-15"];
    expect(streakSummary(days, date(today))).toMatchObject({ current: 3, longest: 3, practicedToday: false, nextMilestone: 7 });
    expect(streakSummary([...days, today], date(today))).toMatchObject({ current: 4, longest: 4, practicedToday: true });
    expect(streakSummary(days, date("2026-09-14"))).toMatchObject({ current: 0, longest: 3, practicedToday: false });
    expect(streakSummary([], date(today))).toMatchObject({ current: 0, longest: 0, nextMilestone: 3 });
  });

  it("counts calendar days across both DST boundaries and leap days", () => {
    expect(streakSummary(["2026-03-07", "2026-03-08", "2026-03-09"], date("2026-03-09")).current).toBe(3);
    expect(streakSummary(["2026-10-31", "2026-11-01", "2026-11-02"], date("2026-11-02")).current).toBe(3);
    expect(streakSummary(["2024-02-28", "2024-02-29", "2024-03-01"], date("2024-03-01")).current).toBe(3);
    expect(goalWindow("weekly", date("2026-03-08"))).toEqual({ start: "2026-03-02", end: "2026-03-08" });
  });

  it("ignores impossible and malformed calendar days", () => {
    expect(streakSummary(["2026-02-30", "2026-03-03", "nonsense", "2026-13-01"], date("2026-03-03"))).toMatchObject({ current: 1, longest: 1 });
  });

  it("uses Monday weeks, resets daily totals, and excludes later dates", () => {
    const state: LearnerState = { ...readState(), practiceDays: ["2026-09-06", "2026-09-07", today, today, "2026-09-14"], dailyPractice: {
      "2026-09-06": day(20, ["before"], [], ["old"]), "2026-09-07": day(10, ["one"], ["old"], ["lesson-1"]),
      [today]: day(3, ["two"], ["old", "one"], ["lesson-2", "lesson-2"]), "2026-09-14": day(200, ["future"], [], ["future"]),
    } };
    expect(goalWindow("weekly", date(today))).toEqual({ start: "2026-09-07", end: today });
    expect(goalValue(state, "cards", "daily", date(today))).toBe(3);
    expect(goalValue(state, "cards", "weekly", date(today))).toBe(13);
    expect(goalValue(state, "cards", "total", date(today))).toBe(33);
    expect(goalValue(state, "words", "weekly", date(today))).toBe(2);
    expect(goalValue(state, "reviews", "weekly", date(today))).toBe(2);
    expect(goalValue(state, "lessons", "weekly", date(today))).toBe(2);
    expect(goalValue(state, "days", "weekly", date(today))).toBe(2);
    expect(goalValue(state, "cards", "daily", date("2026-09-15"))).toBe(0);
  });
});

describe("activity persistence and truthful metrics", () => {
  it("persists goals and completed rounds without creating Course advances or card counts", () => {
    const initial = readState();
    initial.learningGoals = [{ id: "daily-cards", metric: "cards", period: "daily", target: 20, createdAt: at }];
    initial.currentUnitId = 3;
    initial.unitProgress["3"] = { exposure: .2, mastery: .1, lastCardIndex: 7, viewedCardIds: ["u003-c002"] };
    initial.activeSession = { id: "course-session", source: "course", unitId: 3, length: "standard", startedAt: at, cursor: 1, scores: [true], practicedIndices: [0], items: [{ cardId: "u003-c001", prompt: "explore", reason: "Reading" }, { cardId: "u003-c002", prompt: "explore", reason: "Reading" }] };
    const recorded = recordActivity(initial, result());
    expect(recorded.activeSession).toBe(initial.activeSession);
    expect(recorded.unitProgress).toBe(initial.unitProgress);
    expect(recorded.completedUnits).toEqual([]);
    expect(recorded.currentUnitId).toBe(3);
    expect(recorded.wordHistory.yomu.unitIds).toEqual([]);
    expect(goalValue(recorded, "cards", "daily", date(today))).toBe(0);
    expect(goalValue(recorded, "lessons", "total", date(today))).toBe(0);
    expect(goalValue(recorded, "days", "daily", date(today))).toBe(1);
    expect(goalValue(recorded, "activities", "daily", date(today))).toBe(1);
    expect(recordActivity(recorded, result())).toBe(recorded);
    expect(writeState(recorded)).toBe(true);
    const restored = readState();
    expect(restored.learningGoals).toEqual(initial.learningGoals);
    expect(restored.activityDays).toEqual(recorded.activityDays);
    expect(restored.activityResults).toEqual(recorded.activityResults);
    expect(recordActivity(restored, result())).toBe(restored);
  });

  it("does not double count a completed round after its detailed result leaves the recent log", () => {
    let state = recordActivity(readState(), result("old-round", { wordIds: ["yomu"] }));
    for (let index = 0; index < 201; index += 1) state = recordActivity(state, result(`later-${index}`, { wordIds: ["hon"] }));
    const recorded = goalValue(state, "activities", "total", date(today));
    const replayed = recordActivity(state, result("old-round", { wordIds: ["yomu"] }));
    expect(goalValue(replayed, "activities", "total", date(today))).toBe(recorded);
    expect(replayed.wordHistory.yomu.encounters).toBe(state.wordHistory.yomu.encounters);
  });

  it("counts distinct new/review words consistently when moving between games and lessons", () => {
    const initial = readState();
    initial.wordHistory = touchWordHistory(initial, { wordIds: ["old", "card_new"], kind: "reading", at });
    initial.wordHistory = touchWordHistory(initial, { wordIds: ["saved_only"], kind: "saved", at });
    initial.dailyPractice = { [today]: day(1, ["card_new"]) };
    const played = recordActivity(initial, result("game", { wordIds: ["card_new", "game_new", "saved_only", "old", "old"] }));
    expect(goalValue(played, "words", "daily", date(today))).toBe(3);
    expect(goalValue(played, "reviews", "daily", date(today))).toBe(1);
    expect(goalValue(played, "words", "total", date(today))).toBe(4);
    const next = { ...played, wordHistory: touchWordHistory(played, { wordIds: ["game_new", "old"], kind: "reading", at }) };
    const lesson = recordDailyPractice(played, next, ["game_new", "old", "old"], at);
    expect(goalValue(lesson, "words", "daily", date(today))).toBe(3);
    expect(goalValue(lesson, "reviews", "daily", date(today))).toBe(1);
    const reviewedTomorrow = recordActivity(lesson, result("tomorrow", { at: tomorrow, wordIds: ["game_new", "old"] }));
    expect(goalValue(reviewedTomorrow, "words", "daily", date("2026-09-14"))).toBe(0);
    expect(goalValue(reviewedTomorrow, "reviews", "daily", date("2026-09-14"))).toBe(2);
  });

  it("tracks actual kanji study and quiz attempts without adding fictional lessons or word encounters", () => {
    const initial = readState();
    const once = recordKanjiStudy(initial, "kanji_hi", at);
    const twice = recordKanjiStudy(once, "kanji_hi", at);
    expect(goalValue(twice, "kanji", "daily", date(today))).toBe(1);
    expect(goalValue(twice, "kanji", "total", date(today))).toBe(1);
    expect(twice.kanjiProgress?.kanji_hi).toMatchObject({ firstStudiedAt: at, lastStudiedAt: at, visits: 2 });
    const quiz = recordActivity(twice, result("kanji", { kind: "kanji", wordIds: undefined, kanjiIds: ["kanji_hi", "kanji_mizu", "kanji_mizu"] }));
    expect(goalValue(quiz, "kanji", "daily", date(today))).toBe(2);
    expect(goalValue(quiz, "activities", "daily", date(today))).toBe(1);
    expect(goalValue(quiz, "words", "total", date(today))).toBe(0);
    expect(quiz.wordHistory).toEqual({});
    expect(quiz.completedUnits).toEqual([]);
    expect(quiz.practiceSessionCount).toBeUndefined();
    const nextDay = recordKanjiStudy(quiz, "kanji_hi", tomorrow);
    expect(goalValue(nextDay, "kanji", "daily", date("2026-09-14"))).toBe(1);
    expect(goalValue(nextDay, "kanji", "total", date("2026-09-14"))).toBe(2);
  });

  it("rejects incomplete or invalid round results and caps elapsed time", () => {
    const initial = readState();
    for (const extra of [{ total: 0 }, { total: 1.5 }, { correct: -1 }, { correct: 4 }, { at: "invalid" }, { id: "" }]) expect(recordActivity(initial, result("invalid", extra))).toBe(initial);
    expect(recordActivity(initial, result("long", { durationSeconds: Infinity })).activityDays?.[today].seconds).toBe(0);
    expect(recordActivity(initial, result("long", { durationSeconds: 99_999 })).activityDays?.[today].seconds).toBe(3600);
  });

  it("uses new spaced occasions after a day and keeps same-day replay from inflating review intervals", () => {
    const first = recordActivity(readState(), result("first"));
    const second = recordActivity(first, result("second"));
    expect(second.wordHistory.yomu.review?.occasions).toBe(1);
    expect(second.wordHistory.yomu.review?.lastPracticeSequence).toBe(2);
    const third = recordActivity(second, result("third", { at: tomorrow }));
    expect(third.wordHistory.yomu.review?.occasions).toBe(2);
    expect(third.wordHistory.yomu.review?.lastOccasionSessionId).toBe("third");
  });

  it("records per-word game mistakes once and does not infer them from an aggregate score", () => {
    const first = recordActivity(readState(), result("mistakes", { correct: 1, total: 2, missedWordIds: ["hon", "not-attempted"] }));
    expect(first.wordHistory.yomu).toMatchObject({ encounters: 1, correct: 1, misses: 0 });
    expect(first.wordHistory.hon).toMatchObject({ encounters: 1, correct: 0, misses: 1 });
    expect(first.wordHistory["not-attempted"]).toBeUndefined();
    const second = recordActivity(first, result("retry", { correct: 2, total: 2, missedWordIds: [] }));
    expect(second.wordHistory.yomu).toMatchObject({ encounters: 2, correct: 2, misses: 0 });
    expect(second.wordHistory.hon).toMatchObject({ encounters: 2, correct: 1, misses: 1 });
    const aggregateOnly = recordActivity(second, result("aggregate", { correct: 0, total: 2 }));
    expect(aggregateOnly.wordHistory.hon).toMatchObject({ encounters: 3, correct: 1, misses: 1 });
  });
});

describe("goal targets and progress", () => {
  it("validates realistic target bounds and reports over-target progress without exceeding the bar", () => {
    expect(validGoal("days", "daily", 1)).toBe(true);
    expect(validGoal("days", "daily", 2)).toBe(false);
    expect(validGoal("days", "weekly", 8)).toBe(false);
    expect(validGoal("kanji", "total", 51)).toBe(false);
    expect(validGoal("cards", "daily", 2.5)).toBe(false);
    expect(validGoal("cards", "daily", 0)).toBe(false);
    expect(validGoal("cards", "daily", Infinity)).toBe(false);
    const goal: LearningGoal = { id: "goal", metric: "cards", period: "daily", target: 5, createdAt: at };
    expect(goalProgress({ ...readState(), dailyPractice: { [today]: day(8) } }, goal, date(today))).toEqual({ value: 8, ratio: 1, reached: true, remaining: 0 });
  });
});
