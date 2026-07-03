import { describe, expect, it } from "vitest";
import unit001 from "../data/jp/curriculum/units/unit_001.json";
import unit002 from "../data/jp/curriculum/units/unit_002.json";

type TestCard = {
  id: string;
  line: string[];
  english: string;
  tokens: Array<{ surface: string; wordId?: string }>;
};

function card(id: string, wordId: string, surface: string, noun = "student"): TestCard {
  return {
    id,
    line: [surface, "wa", noun, "desu"],
    english: `${wordId} is ${noun}`,
    tokens: [
      { surface, wordId },
      { surface: "wa" },
      { surface: noun, wordId: noun },
      { surface: "desu" },
    ],
  };
}

describe("unit variety guardrails", () => {
  it("flags exact duplicate Japanese and English cards over the cap", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { exactDuplicateFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 99,
      cards: [
        { id: "c001", line: ["hon", "o", "yomimasu"], english: "I read a book", tokens: [] },
        { id: "c002", line: ["hon", "o", "yomimasu"], english: "I read a book", tokens: [] },
        { id: "c003", line: ["hon", "o", "yomimasu"], english: "I read a book", tokens: [] },
      ],
    };

    expect(exactDuplicateFindings(unit, { maxExactLineRepeats: 2, maxExactEnglishRepeats: 2 })).toEqual(
      expect.arrayContaining([
        { kind: "japanese-line", text: "honoyomimasu", count: 3, ids: ["c001", "c002", "c003"] },
        { kind: "english", text: "I read a book", count: 3, ids: ["c001", "c002", "c003"] },
      ]),
    );
  });

  it("flags predictable single-slot learner-axis cycles", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { lockstepAxisFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 1,
      cards: [
        card("c001", "watashi", "watashi"),
        card("c002", "sakura", "anata"),
        card("c003", "yuki", "kare"),
        card("c004", "tanaka", "kanojo"),
      ],
    };

    expect(lockstepAxisFindings(unit)).toMatchObject([
      {
        kind: "lockstep-axis",
        startCard: 1,
        endCard: 4,
        slot: 0,
        values: ["watashi", "sakura", "yuki", "tanaka"],
        ids: ["c001", "c002", "c003", "c004"],
      },
    ]);
  });

  it("allows scrambled one-slot substitution drills", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { lockstepAxisFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 1,
      cards: [
        card("c001", "watashi", "watashi"),
        card("c002", "yuki", "kare"),
        card("c003", "sakura", "anata"),
        card("c004", "tanaka", "kanojo"),
      ],
    };

    expect(lockstepAxisFindings(unit)).toEqual([]);
  });

  it("keeps rebuilt Units 1 and 2 inside the variety guardrails", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { assertUnitVariety } = await import("../scripts/lib/unit-variety-guardrails.mjs");

    expect(() => assertUnitVariety(unit001)).not.toThrow();
    expect(() => assertUnitVariety(unit002)).not.toThrow();
  });
});
