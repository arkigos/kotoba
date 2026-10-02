import { beforeEach, describe, expect, it } from "vitest";
import { buildCustomLesson } from "../src/custom-lesson";
import { buildTopicLesson } from "../src/topic-course";
import { assertLessonVocabulary, unknownLessonWords } from "../src/lesson-vocabulary";
import { readState, touchWordHistory } from "../src/state";
import { setWordPriority } from "../src/review";
import { prepareSession } from "../src/generated";
import { loadUnit } from "../src/curriculum";

describe("selected or practiced vocabulary only", () => {
  beforeEach(() => localStorage.clear());
  it("does not turn a single new book into a lesson about unknown people and verbs", async () => {
    const state = readState();
    const result = await buildCustomLesson(state, ["hon"]);
    expect(result.contextCount).toBeGreaterThan(0); // 本です needs no extra lexical word.
    expect(result.session.lessonPlan!.helperWordIds).toEqual([]);
    expect(result.session.savedCards!.every(card => card.tokens.every(token => !token.wordId || token.wordId === "hon"))).toBe(true);
    expect(() => assertLessonVocabulary(result.session.savedCards!, ["hon"], state)).not.toThrow();
    expect(result.appearances).toEqual({ hon: 2 });
  });
  it("admits a sentence only once every extra lexical word has actual practice", async () => {
    const fresh = readState();
    const state = { ...fresh, wordHistory: touchWordHistory(fresh, { wordIds: ["ani", "yomu"], kind: "reading" }) };
    const result = await buildCustomLesson(state, ["hon"]);
    expect(result.contextCount).toBeGreaterThan(0);
    expect(() => assertLessonVocabulary(result.session.savedCards!, ["hon"], state)).not.toThrow();
    expect(result.session.savedCards!.flatMap(card => card.tokens.filter(token => token.wordId).map(token => token.wordId))).not.toContain("anata");
    expect(result.session.lessonPlan!.helperWordIds.sort()).toEqual(["ani","yomu"]);
  });
  it("does not treat priority, saving, or dictionary inspection as knowing a helper", async () => {
    let state = readState();
    for (const id of ["ani", "yomu", "anata"]) state = setWordPriority(state, id, true);
    state = { ...state, savedWordIds: ["ani", "yomu"], wordHistory: touchWordHistory(state, { wordIds: ["ani", "yomu"], kind: "token" }) };
    const result = await buildCustomLesson(state, ["hon"]);
    expect(result.session.savedCards!.flatMap(card => card.tokens.filter(token => token.wordId).map(token => token.wordId))).not.toEqual(expect.arrayContaining(["ani", "yomu"]));
    expect(result.session.savedCards!.every(card => card.tokens.every(token => !token.wordId || token.wordId === "hon"))).toBe(true);
    expect(() => assertLessonVocabulary(result.session.savedCards!, ["hon"], state)).not.toThrow();
  });
  it("applies the same restriction to topic lessons", async () => {
    const state = readState();
    const result = await buildTopicLesson(state, "food");
    expect(result.helperWordIds).toEqual([]);
    expect(() => assertLessonVocabulary(result.session.savedCards!, result.session.targetWordIds!, state)).not.toThrow();
  });
  it("rejects hundreds of repetitions instead of filling an oversized deck", async () => {
    await expect(buildCustomLesson(readState(), ["hon"], { cardCount: 480 })).rejects.toThrow(/between 1 and 48/);
  });
  it("cannot conceal an unknown word by removing its word ID", async () => {
    const unit = await loadUnit(32);
    const source = unit.cards.find(card => card.tokens.some(token => token.wordId === "hon") && card.tokens.some(token => token.wordId === "yomu"))!;
    const malformed = { ...source, tokens: source.tokens.map(token => token.wordId === "yomu" ? { ...token, wordId: undefined } : token) };
    expect(unknownLessonWords(malformed, new Set(["hon", "ani"]), new Set()).some(id => id.startsWith("untracked:"))).toBe(true);
  });
  it("blocks unsafe old personalized snapshots without rewriting the saved cards", async () => {
    const state = readState();
    const result = await buildCustomLesson(state, ["hon"]);
    const unsafe = (await loadUnit(32)).cards.find(card => card.tokens.some(token => token.wordId === "hon") && card.tokens.some(token => token.wordId === "yomu"))!;
    result.session.savedCards![0] = structuredClone(unsafe);
    result.session.items[0].cardId = unsafe.id;
    const before = JSON.stringify(result.session);
    await expect(prepareSession(result.session, state)).rejects.toThrow(/unfamiliar words/);
    expect(JSON.stringify(result.session)).toBe(before);
  });
});
