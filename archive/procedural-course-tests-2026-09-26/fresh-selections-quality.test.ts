import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { beforeEach, describe, expect, it } from "vitest";
import { a1Topics } from "../../../packages/dictionary/a1";
import { personalizedCandidates } from "../../../packages/learning-engine/personalized";
import { buildCustomLesson } from "../src/custom-lesson";
import { buildTopicLesson } from "../src/topic-course";
import { assertLessonVocabulary } from "../src/lesson-vocabulary";
import { cardFrame } from "../src/lesson-transitions";
import { readState, touchWordHistory } from "../src/state";

const cases = [
  { topic: "Food & eating out", ids: ["taberu", "erabu", "karee", "menyuu", "oishii", "raamen", "resutoran", "onegaishimasu"], known: ["watashi", "anata", "sensei", "gakusei", "yomu", "kaku", "hoshii", "kaimasu", "hankachi", "hashi", "shashin"] },
  { topic: "Daily life & plans", ids: ["mainichi", "neru", "yoru", "ashita", "yasumu", "kin-yoobi", "doyoobi", "nichiyoobi"], known: ["watashi", "hataraku"] },
  { topic: "Around town & travel", ids: ["basu", "chikatetsu", "densha", "noru", "oriru", "eki", "kuukou", "tsuku"], known: ["watashi", "shashin"] },
  { topic: "Shopping & clothes", ids: ["kiru", "shatsu", "jaketto", "kutsu", "kutsushita", "saizu", "ookii", "chiisai"], known: ["watashi", "anata", "sensei", "gakusei", "hoshii", "kaimasu"] },
];

describe("fresh target combinations from the second September 20 read-through", () => {
  beforeEach(() => localStorage.clear());
  it.each(cases)("keeps $topic focused, contextual and spaced", async ({ topic, ids, known }) => {
    const state = readState();
    state.wordHistory = touchWordHistory(state, { wordIds: known, kind: "reading" });
    const before = JSON.stringify(state);
    const topicId = a1Topics.find(row => row.title === topic)!.id;
    for (const session of [(await buildTopicLesson(state, topicId, false, { wordIds: ids })).session, (await buildCustomLesson(state, ids)).session]) {
      const cards = session.savedCards!;
      expect(() => assertLessonCardQuality(cards)).not.toThrow();
      expect(cards.length).toBeLessThanOrEqual(40);
      expect(() => assertLessonVocabulary(cards, ids, state)).not.toThrow();
      expect(cards.every(card => card.tokens.length > 1)).toBe(true);
      for (const id of ids) {
        const positions = cards.flatMap((card, index) => card.tokens.some(token => token.wordId === id) ? [index] : []);
        expect(positions.length, id).toBeGreaterThanOrEqual(1);
        expect(positions.length, id).toBeLessThanOrEqual(24);
        expect(new Set(positions.map(index => cards[index].line.join(""))).size, id).toBeGreaterThanOrEqual(2);
        expect(Math.max(...positions.slice(1).map((p, i) => p - positions[i])), id).toBeLessThanOrEqual(24);
      }
      let run = 0, previous = "";
      const counts = new Map<string, number>();
      for (const card of cards) {
        const frame = cardFrame(card);
        run = frame === previous ? run + 1 : 1;
        expect(run).toBeLessThanOrEqual(4);
        previous = frame;
        const text = card.line.join("");
        counts.set(text, (counts.get(text) ?? 0) + 1);
      }
      expect(Math.max(...counts.values())).toBe(1);
      if (topic.startsWith("Food")) {
        expect(cards.some(card => card.english === "A menu, please")).toBe(true);
        expect(cards.some(card => card.tokens.some(token => token.wordId === "hankachi" || token.wordId === "shashin"))).toBe(false);
      }
    }
    expect(JSON.stringify(state)).toBe(before);
  });
  it("licenses boarding, alighting and wearing by exact argument sense", () => {
    const cards = personalizedCandidates(["basu", "noru", "oriru", "eki", "kiru", "kutsu", "shatsu"], new Set(["watashi"]));
    expect(cards.some(card => card.line.join("") === "バスに乗ります")).toBe(true);
    expect(cards.some(card => card.line.join("") === "バスを降ります")).toBe(true);
    expect(cards.some(card => card.tokens.some(token => token.wordId === "kutsu") && card.tokens.some(token => token.wordId === "kiru"))).toBe(false);
    expect(cards.some(card => card.line.join("").includes("駅に乗ります"))).toBe(false);
  });
  it("does not add a missing food, vehicle or work verb to sparse selections", () => {
    for (const ids of [["onegaishimasu", "resutoran"], ["noru", "oriru"], ["mainichi", "ashita"]]) {
      expect(personalizedCandidates(ids, new Set()).flatMap(card => card.tokens).every(token => !token.wordId || ids.includes(token.wordId))).toBe(true);
    }
  });
});
