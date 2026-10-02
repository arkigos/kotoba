import { beforeEach, describe, expect, it } from "vitest";
import { generateSession, validateCardLevel, type Lexicon } from "../../../packages/learning-engine";
import { exampleLexicon, exampleRecipes } from "../../../packages/learning-engine/examples";
import { buildLessonPlan, createGeneratedSession, generateLesson } from "../src/generated";
import { isPrioritized, recordWordPractice, reviewStatus, setWordPriority, suggestReviewWords } from "../src/review";
import { readState, touchWordHistory, writeState } from "../src/state";
import type { LearnerState, WordHistory } from "../src/types";
import { wordById } from "../src/curriculum";

const now = Date.parse("2026-09-12T12:00:00Z");
const DAY = 86_400_000;
const iso = (days: number) => new Date(now + days * DAY).toISOString();
const targets = exampleRecipes.classroom.targetSenseIds;
function history(id: string, days = -5, prioritized = false): WordHistory {
  return { wordId: id, firstSeenAt: iso(days - 1), lastSeenAt: iso(days), unitIds: [], encounters: 1, correct: 0, misses: 0, rating: "learning", interactionKinds: ["reading"], prioritized };
}
function start(state: LearnerState, id: string): LearnerState {
  return { ...state, activeSession: { ...createGeneratedSession(generateLesson("classroom", targets, 42), state), id } };
}
beforeEach(() => localStorage.clear());

describe("simple word review", () => {
  it("derives due status from recorded practice, with a single priority override", () => {
    const word = history("yomu", -1.5);
    const state = { ...readState(), wordHistory: { yomu: word } };
    expect(reviewStatus(word, state, now)).toMatchObject({ due: false, interval: 2 });
    const priority = setWordPriority(state, "yomu", true);
    expect(reviewStatus(priority.wordHistory.yomu, priority, now)).toMatchObject({ due: true, interval: 1 });
    expect(priority.wordHistory.yomu.lastSeenAt).toBe(word.lastSeenAt);
  });

  it("preserves old Hard intent while allowing an explicit priority opt-out", () => {
    const state = { ...readState(), wordHistory: { yomu: { ...history("yomu"), prioritized: undefined, rating: "hard" as const } } };
    expect(isPrioritized(state.wordHistory.yomu)).toBe(true);
    const next = setWordPriority(state, "yomu", false);
    writeState(next);
    expect(isPrioritized(readState().wordHistory.yomu)).toBe(false);
    expect(readState().wordHistory.yomu.rating).toBe("hard");
  });

  it("does not postpone a legacy word when its detail is opened or it is saved", () => {
    let state: LearnerState = { ...readState(), wordHistory: { yomu: history("yomu", -10) } };
    for (const kind of ["token", "saved"] as const) {
      state = { ...state, wordHistory: touchWordHistory(state, { wordIds: ["yomu"], kind, at: iso(0) }) };
    }
    expect(state.wordHistory.yomu.lastSeenAt).toBe(iso(0));
    expect(reviewStatus(state.wordHistory.yomu, state, now)).toMatchObject({ due: true, daysAgo: 10 });
  });

  it("counts one spaced occasion across repeated cards and short repeat sessions", () => {
    let state = start({ ...readState(), wordHistory: { yomu: history("yomu") } }, "first");
    state = recordWordPractice(state, ["yomu", "yomu"], iso(0));
    state = recordWordPractice(state, ["yomu"], iso(0.01));
    expect(state.practiceSessionCount).toBe(1);
    expect(state.wordHistory.yomu.review?.occasions).toBe(1);
    state = start(state, "second");
    state = recordWordPractice(state, ["yomu"], iso(0.1));
    expect(state.practiceSessionCount).toBe(2);
    expect(state.wordHistory.yomu.review?.occasions).toBe(1);
    state = start(state, "third");
    state = recordWordPractice(state, ["yomu"], iso(2));
    expect(state.wordHistory.yomu.review?.occasions).toBe(2);
    expect(reviewStatus(state.wordHistory.yomu, state, now + DAY * 3)).toMatchObject({ due: false, interval: 4, sessionsAgo: 0 });
  });

  it("does not make a word due from same-day lesson counts; actual practice resets distance", () => {
    let state = start({ ...readState(), wordHistory: { yomu: history("yomu"), kaku: history("kaku") } }, "first");
    state = recordWordPractice(state, ["yomu"], iso(0));
    state = recordWordPractice(start(state, "second"), ["kaku"], iso(0.01));
    state = recordWordPractice(start(state, "third"), ["kaku"], iso(0.02));
    expect(reviewStatus(state.wordHistory.yomu, state, now + 0.03 * DAY)).toMatchObject({ due: false, sessionsAgo: 2 });
    state = recordWordPractice(state, ["yomu"], iso(0.03));
    expect(reviewStatus(state.wordHistory.yomu, state, now + 0.04 * DAY)).toMatchObject({ due: false, sessionsAgo: 0 });
    expect(state.wordHistory.yomu.review?.occasions).toBe(1);
  });

  it("ranks due old words before fresh priority and recent words reproducibly", () => {
    const context = { wordHistory: { old: history("old", -30), recent: history("recent", 0), priority: history("priority", 0, true) } };
    expect(suggestReviewWords(context, 42, now).map(item => item.wordId)).toEqual(["old", "priority", "recent"]);
    expect(suggestReviewWords(context, 42, now)).toEqual(suggestReviewWords(context, 42, now));
  });

  it("ranks optional review by last practice, never by a new-word bonus or fresh priority", () => {
    const context = { wordHistory: { older: history("older", -1.5), recent: history("recent", -.5), fresh: history("fresh", 0, true) } };
    for (let seed=0; seed<20; seed++) expect(suggestReviewWords(context, seed, now).map(row=>row.wordId)).toEqual(["older", "recent", "fresh"]);
  });

  it("refreshes the same concept when a practiced polite form was reviewed", () => {
    const context = { wordHistory: { taberu: history("taberu", -20), tabemasu: history("tabemasu", 0) } };
    expect(reviewStatus(context.wordHistory.taberu, context, now)).toMatchObject({ due: false, daysAgo: 0 });
    expect(suggestReviewWords(context, 0, now).map(row => row.score)).toEqual([0, 0]);
  });

  it("does not let a saved-only alias postpone an actually practiced word", () => {
    const context = { wordHistory: { taberu: history("taberu", -20), tabemasu: { ...history("tabemasu", 0), interactionKinds: ["saved" as const], review: { occasions: 0, lastPracticedAt: iso(0) } } } };
    expect(reviewStatus(context.wordHistory.taberu, context, now)).toMatchObject({ due: true, daysAgo: 20 });
  });
});

describe("review additions and level boundaries", () => {
  it("weaves compatible known words into a fixed lesson while meeting core and review floors", () => {
    const context = { wordHistory: { gakusei: history("gakusei", -20), sensei: history("sensei", -4, true), abimasu: history("abimasu", -50) } };
    const original = JSON.stringify(context);
    const snapshot = buildLessonPlan("classroom", targets, 42, context, { level: "A1", includeReview: true, now });
    expect(snapshot.cards).toHaveLength(36);
    expect(snapshot.reviewSelection!.additions.length).toBeGreaterThan(0);
    expect(snapshot.reviewSelection!.additions.length).toBeLessThanOrEqual(2);
    for (const id of targets) expect(snapshot.coverage[id]).toBeGreaterThanOrEqual(8);
    for (const addition of snapshot.reviewSelection!.additions) {
      expect(snapshot.coverage[addition.senseId]).toBeGreaterThanOrEqual(4);
      expect(addition.reason).toContain("Due");
    }
    expect(snapshot.reviewSelection!.deferred).toContainEqual({ wordId: "abimasu", reason: "Not supported by this template" });
    expect(JSON.stringify(context)).toBe(original);
    expect(buildLessonPlan("classroom", targets, 42, context, { level: "A1", includeReview: true, now })).toEqual(snapshot);
  });

  it("can turn additions off and never supplies words outside the selected/declared pool", () => {
    const snapshot = buildLessonPlan("classroom", targets, 42, { wordHistory: { gakusei: history("gakusei") } }, { level: "A1", includeReview: false, now });
    expect(snapshot.reviewSelection!.additions).toEqual([]);
    expect(snapshot.cards.flatMap(card => card.senseIds)).not.toContain("gakusei.default");
  });

  it("allows an explicitly added compatible word without bypassing the grammar rules", () => {
    const snapshot = generateLesson("classroom", ["yomu.default", "gakusei.default"], 8);
    expect(snapshot.coverage["gakusei.default"]).toBeGreaterThanOrEqual(8);
    expect(() => generateLesson("classroom", ["iku.default"], 8)).toThrow(/not supported/);
  });

  it("rejects unclassified or higher-level senses at a lower ceiling, including helpers", () => {
    const advanced: Lexicon = { ...exampleLexicon, entries: exampleLexicon.entries.map(entry => entry.wordId === "yomu" ? { ...entry, level: "B1" } : entry) };
    expect(() => generateSession(exampleRecipes.classroom, advanced, 42)).toThrow(/placement/);
    expect(generateSession({ ...exampleRecipes.classroom, level: "B1" }, advanced, 42).cards).toHaveLength(36);
    const missing: Lexicon = { ...exampleLexicon, entries: exampleLexicon.entries.map(entry => entry.wordId === "watashi" ? { ...entry, level: undefined } : entry) };
    expect(() => generateSession(exampleRecipes.classroom, missing, 42)).toThrow(/placement/);
  });

  it("checks the complexity ceiling and still refuses unknown constructions at C2", () => {
    const card = generateSession(exampleRecipes.classroom, exampleLexicon, 42).cards[0];
    const word = card.tokens.find(token => token.wordId)!;
    const long = { ...card, tokens: [word, word, word, word, word] };
    expect(() => validateCardLevel(long, "A1")).toThrow(/complexity/);
    expect(() => validateCardLevel(long, "A2")).not.toThrow();
    expect(() => generateSession({ ...exampleRecipes.classroom, level: "C2", phases: [{ ...exampleRecipes.classroom.phases[0], construction: "unimplemented" as never }] }, exampleLexicon, 42)).toThrow(/Unsupported construction/);
  });

  it("exposes curriculum placement without replacing durable vocabulary identities", () => {
    expect(wordById("yomu")).toMatchObject({ id: "yomu", level: "A1" });
    expect(wordById("hiragana_a")).toMatchObject({ level: "Kana", introducedInUnit: 101 });
  });
});
