import { describe, expect, it } from "vitest";
import { diversifyTopicCoverage } from "../src/diversify-topic-coverage";
import type { TopicCandidate } from "../src/topic-sequence";

const candidate = (targets: string[], unknown: string[] = []): TopicCandidate => {
  const tokens = targets.map(wordId => ({ wordId, surface: wordId, reading: wordId, explain: wordId }));
  return { targets, unknown, card: { id: targets.join("-"), tokens, line: targets, tts: targets, explain: targets, english: targets.join(" ") } };
};
const counts = (cards: TopicCandidate[]) => cards.reduce((result, card) => { card.targets.forEach(id => { result[id] = (result[id] ?? 0) + 1; }); return result; }, {} as Record<string, number>);
describe("coverage-preserving variety", () => {
  it("replaces the two-sentence loop with balanced alternative target combinations", () => {
    const a = candidate(["engineer", "japan", "live"]), b = candidate(["employee", "country", "work"]);
    const c = candidate(["engineer", "country", "live"]), d = candidate(["employee", "japan", "work"]);
    const before = Array.from({ length: 12 }, (_, i) => i % 2 ? a : b);
    const result = diversifyTopicCoverage(before, [a, b, c, d]);
    expect(counts(result)).toEqual(counts(before));
    expect(new Set(result).size).toBe(4);
    expect(result).toHaveLength(12);
  });
  it("does not buy variety with unknown helpers", () => {
    const a = candidate(["book"]), b = candidate(["read"]);
    const unsafe = candidate(["book"], ["you"]);
    const before = [a, b, a, b, a, b];
    const result = diversifyTopicCoverage(before, [a, b, unsafe]);
    expect(result).not.toContain(unsafe);
    expect(counts(result)).toEqual(counts(before));
  });
});
