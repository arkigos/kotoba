import { describe, expect, it } from "vitest";
import { smoothTopicOrder } from "../src/smooth-topic-order";
import { measureCardTransition } from "../src/lesson-transitions";
import type { TopicCandidate } from "../src/topic-sequence";

function sentence(id: string, person: string, alternate = false): TopicCandidate {
  const words = alternate ? [person, "は", id, "が", "suki-na", "です"] : [person, "は", id, "を", "taberu"];
  const fixed = new Set(["は", "を", "が", "です"]);
  const tokens = words.map(word => ({ surface: word, reading: word, explain: word, ...(fixed.has(word) ? {} : { wordId: word }) }));
  return { targets: [id], unknown: [person], card: { id: words.join("-"), line: words, tts: words, explain: words, english: words.join(" "), tokens } };
}
const continuityCost = (cards: TopicCandidate[]) => cards.slice(1).reduce((sum, card, index) => {
  const step = measureCardTransition(cards[index].card, card.card);
  return sum + (step.kind === "repeat" ? 8 : step.kind === "boundary" ? 6 : step.lexicalChanges === 2 ? 1 : 0);
}, 0);
const spans = (cards: TopicCandidate[]) => {
  const positions = new Map<string, number[]>();
  cards.forEach((card, index) => card.targets.forEach(id => positions.set(id, [...(positions.get(id) ?? []), index])));
  return Object.fromEntries([...positions].map(([id, indices]) => [id, indices.at(-1)! - indices[0]]));
};
const multiplicities = (cards: TopicCandidate[]) => {
  const result = new Map<TopicCandidate, number>();
  cards.forEach(card => result.set(card, (result.get(card) ?? 0) + 1));
  return result;
};

describe("smooth topic ordering", () => {
  it("repairs eight consecutive appearances while retaining the opening and exact candidate multiset", () => {
    const cards = ["gohan", "pan", "niku", "sakana"].flatMap(id => Array.from({ length: 8 }, (_, index) => sentence(id, index % 2 ? "watashi" : "ane")));
    const before = JSON.stringify(cards);
    expect(Object.values(spans(cards))).toEqual([7, 7, 7, 7]);
    const ordered = smoothTopicOrder(cards);
    expect(ordered[0]).toBe(cards[0]);
    expect(multiplicities(ordered)).toEqual(multiplicities(cards));
    expect(JSON.stringify(cards)).toBe(before);
    expect(Math.min(...Object.values(spans(ordered)))).toBeGreaterThanOrEqual(8);
    expect(continuityCost(ordered)).toBeLessThanOrEqual(continuityCost(cards));
  });

  it("reduces pattern changes while preserving an existing quarter-deck spread", () => {
    const ids = ["gohan", "pan", "niku", "sakana"];
    const cards = Array.from({ length: 8 }, (_, repeat) => ids.map((id, index) => sentence(id, repeat % 2 ? "watashi" : "ane", index % 2 === 1))).flat();
    const ordered = smoothTopicOrder(cards);
    expect(continuityCost(ordered)).toBeLessThan(continuityCost(cards));
    expect(Math.min(...Object.values(spans(ordered)))).toBeGreaterThanOrEqual(cards.length / 4);
    expect(multiplicities(ordered)).toEqual(multiplicities(cards));
    expect(ordered[0]).toBe(cards[0]);
  });

  it("counts all target identities in multi-target cards when protecting their spread", () => {
    const cards = Array.from({ length: 40 }, (_, index) => {
      const item = sentence(index % 2 ? "gohan" : "pan", "watashi", index % 5 === 0);
      return { ...item, targets: [index % 2 ? "gohan" : "pan", ...(index % 4 === 0 ? ["taberu"] : [])] };
    });
    const ordered = smoothTopicOrder(cards);
    expect(multiplicities(ordered)).toEqual(multiplicities(cards));
    expect(Math.min(...Object.values(spans(ordered)))).toBeGreaterThanOrEqual(10);
  });

  it("handles a maximum-size custom lesson within a bounded search and preserves every occurrence", () => {
    const choices = ["gohan", "pan", "niku", "sakana"].flatMap(id => [sentence(id, "watashi"), sentence(id, "ane", true)]);
    const cards = Array.from({ length: 480 }, (_, index) => choices[index % choices.length]);
    const ordered = smoothTopicOrder(cards);
    expect(ordered).toHaveLength(480);
    expect(ordered[0]).toBe(cards[0]);
    expect(multiplicities(ordered)).toEqual(multiplicities(cards));
    expect(Math.min(...Object.values(spans(ordered)))).toBeGreaterThanOrEqual(120);
  }, 10_000);
});
