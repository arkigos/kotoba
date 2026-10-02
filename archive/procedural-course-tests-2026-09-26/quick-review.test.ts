import { describe, expect, it } from "vitest";
import { buildQuickReview } from "../src/quick-review";

describe("quick procedural review", () => {
  it("builds an exact short review and reports every omitted requested word", () => {
    const wordIds = ["yomu", "nihongo", "pan", "gohan", "nomu", "unknown-word", "yomu"];
    const plan = buildQuickReview({ wordIds, label: "Due words", mode: "recall", count: 6 }, 123)!;
    expect(plan.snapshot.cards).toHaveLength(6);
    expect(plan.includedWordIds.length).toBeLessThanOrEqual(2);
    expect(new Set([...plan.includedWordIds, ...plan.excludedWordIds])).toEqual(new Set(wordIds));
    expect(plan.excludedWordIds).toContain("unknown-word");
    expect(plan.snapshot.recipe.title).toBe("Due words");
    for (const wordId of plan.includedWordIds) expect(plan.snapshot.wordCoverage[wordId]).toBeGreaterThanOrEqual(plan.snapshot.recipe.minTargetExposures);
    expect(plan.snapshot.recipe.targetSenseIds.length).toBe(plan.includedWordIds.length);
  });

  it("uses the request order to retain priority and repeats deterministically", () => {
    const request = { wordIds: ["nihongo", "yomu", "eigo", "kaku", "hiragana", "kanji", "shinbun"], label: "Reading review", mode: "mixed" as const, count: 12 };
    const plan = buildQuickReview(request, 42)!;
    expect(plan.includedWordIds).toEqual(request.wordIds.slice(0, 4));
    expect(buildQuickReview(request, 42)).toEqual(plan);
    expect(plan.snapshot.cards).toHaveLength(12);
  });

  it("does not invent generation metadata for unsupported dictionary words", () => {
    expect(buildQuickReview({ wordIds: ["abimasu", "jmdict:unknown"], label: "Saved words", mode: "mixed", count: 10 }, 7)).toBeUndefined();
    expect(buildQuickReview({ wordIds: ["yomu"], label: "Review", mode: "mixed", count: 3 }, 7)).toBeUndefined();
  });
});
