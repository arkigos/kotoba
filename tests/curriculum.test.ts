import { describe, expect, it } from "vitest";
import { courseLevels, unitIndex } from "../src/data";
import { helperVocabularyUnitIds, knownVocabularyUnitIds, reviewVocabularyUnitIds, vocabularyPoolsForUnit } from "../src/curriculum/bin";

function levelForUnit(unitId: number) {
  return courseLevels.levels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd);
}

describe("curriculum word bins", () => {
  it("computes exponential review bins without immediate N-1 obligation", () => {
    expect([1, ...reviewVocabularyUnitIds(1)]).toEqual([1]);
    expect([2, ...reviewVocabularyUnitIds(2)]).toEqual([2]);
    expect([3, ...reviewVocabularyUnitIds(3)]).toEqual([3, 1]);
    expect([4, ...reviewVocabularyUnitIds(4)]).toEqual([4, 2]);
    expect([5, ...reviewVocabularyUnitIds(5)]).toEqual([5, 3, 1]);
    expect([6, ...reviewVocabularyUnitIds(6)]).toEqual([6, 4, 2]);
    expect([7, ...reviewVocabularyUnitIds(7)]).toEqual([7, 5, 3]);
    expect([17, ...reviewVocabularyUnitIds(17)]).toEqual([17, 15, 13, 9, 1]);
  });

  it("allows all introduced vocabulary as helper vocabulary", () => {
    expect(knownVocabularyUnitIds(1)).toEqual([1]);
    expect(knownVocabularyUnitIds(2)).toEqual([1, 2]);
    expect(knownVocabularyUnitIds(5)).toEqual([1, 2, 3, 4, 5]);
    expect(helperVocabularyUnitIds(5)).toEqual([1, 2, 3, 4, 5]);
    expect(vocabularyPoolsForUnit(5)).toEqual({
      current: [5],
      reviewDue: [3, 1],
      helpers: [1, 2, 3, 4, 5],
    });
  });

  it("maps authored units into their CEFR-inspired levels", () => {
    expect(courseLevels.framework).toBe("CEFR-inspired / JF-aligned");
    expect(courseLevels.certificationClaim).toBe(false);
    expect(courseLevels.plannedUnitCount).toBe(96);
    expect(courseLevels.levels.map((level) => level.code)).toEqual(["A1", "A2", "B1", "B2"]);

    expect(unitIndex.units.filter((entry) => entry.id <= 20).every((entry) => levelForUnit(entry.id)?.code === "A1")).toBe(true);
    expect(unitIndex.units.filter((entry) => entry.id >= 21 && entry.id <= 44).every((entry) => levelForUnit(entry.id)?.code === "A2")).toBe(true);
  });

  it("keeps current authored unit IDs and slugs stable", () => {
    expect(unitIndex.units.map((unit) => [unit.id, unit.slug])).toEqual([
      [1, "simple-identity"],
      [2, "topic-comment"],
      [3, "possession-and-also"],
      [4, "negative-identity"],
      [5, "past-identity"],
      [6, "basic-demonstratives"],
      [7, "basic-question-words"],
      [8, "where-and-when"],
      [9, "sentence-endings"],
      [10, "i-adjectives-present"],
      [11, "i-adjectives-negative-past"],
      [12, "na-adjectives-present"],
      [13, "na-adjectives-negative-past"],
      [14, "degree-words"],
      [15, "existence-for-things"],
      [16, "existence-for-living-things"],
      [17, "existence-in-a-place"],
      [18, "location-words"],
      [19, "basic-numbers-counters"],
      [20, "a1-scene-review"],
      [21, "polite-verbs-non-past"],
      [22, "polite-verb-negatives"],
      [23, "polite-verbs-past"],
      [24, "direct-objects"],
      [25, "going-to-places"],
      [26, "action-location"],
      [27, "time-point"],
      [28, "from-and-until"],
      [29, "with-someone"],
      [30, "frequency"],
      [31, "likes-and-dislikes"],
      [32, "skill-as-description"],
      [33, "wanting-things"],
      [34, "wanting-to-do"],
      [35, "suggestions"],
      [36, "please-do"],
      [37, "please-do-not"],
      [38, "permission"],
      [39, "prohibition"],
      [40, "need-and-suggestions"],
      [41, "te-form-ichidan-irregular"],
      [42, "te-form-godan"],
      [43, "connecting-actions"],
      [44, "ongoing-resulting-state"],
    ]);
  });
});
