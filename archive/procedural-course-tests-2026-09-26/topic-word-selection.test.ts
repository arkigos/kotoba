import { describe, expect, it } from "vitest";
import { selectConnectedTopicWords } from "../src/topic-word-selection";
import { loadUnit, standardUnits } from "../src/curriculum";
import { a1CoreWordIdsForTopic, a1Topics, a1WordMetadata } from "../../../packages/dictionary/a1";
import type { PracticeCard } from "../src/types";

const card = (...ids: string[]): PracticeCard => ({
  id: ids.join("-"), line: ids, tts: ids, explain: ids, english: ids.join(" "),
  tokens: ids.map(wordId => ({ wordId, surface: wordId, reading: wordId, explain: wordId })),
});
const queue = ["a", "b", "c", "d", "e", "f", "g", "h", "action-a", "action-b", "action-c", "action-d"];
const cards = [card("a", "action-a"), card("b", "action-b"), card("c", "action-c"), card("d", "action-d")];

describe("automatic topic word selection", () => {
  it("keeps the next three new words and chooses complementary reviewed pairs over isolated nouns", () => {
    const options = { rankedNewWordIds: queue, rankedReviewWordIds: [], newCount: 8, reviewCount: 0, priorityWordIds: [], cards };
    const before = JSON.stringify(options);
    expect(selectConnectedTopicWords(options)).toEqual(["a", "b", "c", "d", "action-a", "action-b", "action-c", "action-d"]);
    expect(JSON.stringify(options)).toBe(before);
    expect(selectConnectedTopicWords(options)).toEqual(selectConnectedTopicWords(options));
  });

  it("preserves exact new/review quotas, the first due review, and priority targets inside the original quota", () => {
    const review = ["due", "priority-review", "connected-review"];
    const result = selectConnectedTopicWords({ rankedNewWordIds: queue, rankedReviewWordIds: review,
      newCount: 8, reviewCount: 2, priorityWordIds: new Set(["h", "priority-review"]),
      cards: [...cards, card("a", "connected-review")] });
    expect(result).toEqual(expect.arrayContaining(["a", "b", "c", "h", "due", "priority-review"]));
    expect(result.filter(id => queue.includes(id))).toHaveLength(8);
    expect(result.filter(id => review.includes(id))).toHaveLength(2);
    expect(new Set(result).size).toBe(10);
  });

  it("eventually reaches isolated new words instead of permanently preferring connected words", () => {
    let unseen = [...queue, "isolated-expression"];
    const reached = new Set<string>();
    while (unseen.length) {
      const result = selectConnectedTopicWords({ rankedNewWordIds: unseen, rankedReviewWordIds: [],
        newCount: Math.min(6, unseen.length), reviewCount: 0, priorityWordIds: [], cards });
      expect(result).toEqual(expect.arrayContaining(unseen.slice(0, Math.min(3, unseen.length))));
      result.forEach(id => reached.add(id));
      unseen = unseen.filter(id => !reached.has(id));
    }
    expect([...reached].sort()).toEqual([...queue, "isolated-expression"].sort());
  });

  it("does not pull in helpers or infer eligibility from unrelated large contexts", () => {
    const result = selectConnectedTopicWords({ rankedNewWordIds: ["a", "b", "c", "d", "e"], rankedReviewWordIds: [],
      newCount: 4, reviewCount: 0, priorityWordIds: [], cards: [card("a", "e", "outside", "another", "third")] });
    expect(result).toEqual(["a", "b", "c", "d"]);
  });

  it("uses reviewed canonical aliases and does not reward duplicated example frequency", () => {
    const options = { rankedNewWordIds: ["a", "b", "c", "d", "au"], rankedReviewWordIds: [],
      newCount: 4, reviewCount: 0, priorityWordIds: [], cards: [card("a", "aimasu")] };
    expect(selectConnectedTopicWords(options)).toEqual(["a", "b", "c", "au"]);
    expect(selectConnectedTopicWords({ ...options, cards: Array(100).fill(options.cards[0]) })).toEqual(selectConnectedTopicWords(options));
  });

  it("retains queue order when no reviewed pair connects the topic and handles empty quotas", () => {
    const options = { rankedNewWordIds: queue, rankedReviewWordIds: [], newCount: 8, reviewCount: 0, priorityWordIds: [], cards: [] };
    expect(selectConnectedTopicWords(options)).toEqual(queue.slice(0, 8));
    expect(selectConnectedTopicWords({ ...options, newCount: 0 })).toEqual([]);
  });

  it("rejects impossible or overlapping quota inputs instead of silently changing the requested targets", () => {
    const options = { rankedNewWordIds: ["a"], rankedReviewWordIds: [], newCount: 2, reviewCount: 0, priorityWordIds: [], cards: [] };
    expect(() => selectConnectedTopicWords(options)).toThrow(/quotas/);
    expect(() => selectConnectedTopicWords({ ...options, newCount: 1, rankedReviewWordIds: ["a"], reviewCount: 1 })).toThrow(/quotas/);
  });

  it("can cover the real first food selection in six reviewed cards while retaining the new-word queue prefix", async () => {
    const source = (await Promise.all(standardUnits.filter(unit => unit.id < 100).map(unit => loadUnit(unit.id)))).flatMap(unit => unit.cards);
    const started = performance.now();
    const selections = a1Topics.map(topic => {
      const pool = a1CoreWordIdsForTopic(topic.id);
      const selected = selectConnectedTopicWords({ rankedNewWordIds: pool, rankedReviewWordIds: [],
        newCount: Math.min(12, pool.length), reviewCount: 0, priorityWordIds: [], cards: source });
      expect(selected).toHaveLength(Math.min(12, pool.length));
      expect(selected).toEqual(expect.arrayContaining(pool.slice(0, 3)));
      expect(selected.every(id => pool.includes(id))).toBe(true);
      return { topic: topic.id, selected };
    });
    const food = selections.find(selection => selection.topic === "food")!.selected;
    const masks = new Set(source.flatMap(item => {
      const ids = [...new Set(item.tokens.flatMap(token => token.wordId ? [a1WordMetadata[token.wordId]?.coreWordId ?? token.wordId] : []))];
      if (ids.filter(id => !food.includes(id)).length > 2) return [];
      return [ids.reduce((mask, id) => food.includes(id) ? mask | (1 << food.indexOf(id)) : mask, 0)];
    }));
    const complete = (1 << food.length) - 1;
    const minimum = new Array(complete + 1).fill(Infinity);
    minimum[0] = 0;
    for (let mask = 0; mask <= complete; mask += 1) for (const option of masks) minimum[mask | option] = Math.min(minimum[mask | option], minimum[mask] + 1);
    expect(minimum[complete]).toBeLessThanOrEqual(6);
    if (import.meta.env.VITE_TOPIC_AUDIT_REPORT) console.info("CONNECTED_SELECTION", JSON.stringify({ milliseconds: performance.now() - started, selections }));
  });
});
