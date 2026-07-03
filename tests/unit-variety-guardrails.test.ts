import { describe, expect, it } from "vitest";
import unit001 from "../data/jp/curriculum/units/unit_001.json";
import unit002 from "../data/jp/curriculum/units/unit_002.json";
import unit003 from "../data/jp/curriculum/units/unit_003.json";

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

  it("disallows exact duplicate cards by default", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { exactDuplicateFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 99,
      cards: [
        { id: "c001", line: ["watashi", "wa", "tabemasu"], english: "I eat", tokens: [] },
        { id: "c002", line: ["watashi", "wa", "tabemasu"], english: "I eat", tokens: [] },
      ],
    };

    expect(exactDuplicateFindings(unit)).toEqual(
      expect.arrayContaining([
        { kind: "japanese-line", text: "watashiwatabemasu", count: 2, ids: ["c001", "c002"] },
        { kind: "english", text: "I eat", count: 2, ids: ["c001", "c002"] },
      ]),
    );
  });

  it("flags long gaps between current-word exposures", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { wordExposureGapFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 99,
      newWords: [{ id: "taberu" }],
      cards: [
        { id: "c001", line: ["watashi", "wa", "tabemasu"], english: "I eat", tokens: [{ surface: "tabemasu", wordId: "taberu" }] },
        ...Array.from({ length: 30 }, (_, index) => ({
          id: `f${index + 1}`,
          line: ["gakusei", "desu"],
          english: `student filler ${index + 1}`,
          tokens: [{ surface: "gakusei", wordId: "gakusei" }],
        })),
        { id: "c032", line: ["sensei", "wa", "tabemasu"], english: "The teacher eats", tokens: [{ surface: "tabemasu", wordId: "taberu" }] },
      ],
    };

    expect(wordExposureGapFindings(unit)).toMatchObject([
      {
        kind: "word-exposure-gap",
        wordId: "taberu",
        startCard: 1,
        endCard: 32,
        gap: 31,
      },
    ]);
  });

  it("flags bare noun desu frames", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { bareDesuStatementFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 99,
      cards: [
        {
          id: "c001",
          line: ["hon", "desu"],
          english: "It's a book",
          tokens: [
            { surface: "hon", wordId: "hon" },
            { surface: "desu", explain: "polite identity marker" },
          ],
        },
        {
          id: "c002",
          line: ["hon", "desu", "ka", "?"],
          english: "Is it a book?",
          tokens: [
            { surface: "hon", wordId: "hon" },
            { surface: "desu", explain: "polite identity marker" },
            { surface: "ka", explain: "question marker" },
            { surface: "?", explain: "question mark" },
          ],
        },
      ],
    };

    expect(bareDesuStatementFindings(unit)).toMatchObject([
      { kind: "bare-desu-statement", wordId: "hon", text: "hondesu", id: "c001" },
      { kind: "bare-desu-statement", wordId: "hon", text: "hondesuka?", id: "c002" },
    ]);
    expect(bareDesuStatementFindings(unit, { allowedBareDesuWordIds: ["hon"] })).toEqual([]);
  });

  it("flags tautological identity frames", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { tautologicalIdentityFindings } = await import("../scripts/lib/unit-variety-guardrails.mjs");
    const unit = {
      id: 99,
      cards: [
        {
          id: "c001",
          line: ["gakusei", "wa", "gakusei", "desu"],
          english: "The student is a student",
          tokens: [
            { surface: "gakusei", wordId: "gakusei" },
            { surface: "wa", explain: "topic marker" },
            { surface: "gakusei", wordId: "gakusei" },
            { surface: "desu", explain: "polite identity marker" },
          ],
        },
        {
          id: "c002",
          line: ["sensei", "wa", "sensei", "desu", "ka", "?"],
          english: "Is the teacher a teacher?",
          tokens: [
            { surface: "sensei", wordId: "sensei" },
            { surface: "wa", explain: "topic marker" },
            { surface: "sensei", wordId: "sensei" },
            { surface: "desu", explain: "polite identity marker" },
            { surface: "ka", explain: "question marker" },
            { surface: "?", explain: "question mark" },
          ],
        },
      ],
    };

    expect(tautologicalIdentityFindings(unit)).toMatchObject([
      { kind: "tautological-identity", wordId: "gakusei", text: "gakuseiwagakuseidesu", id: "c001" },
      { kind: "tautological-identity", wordId: "sensei", text: "senseiwasenseidesuka?", id: "c002" },
    ]);
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

  it("keeps rebuilt Units 1 through 3 inside the variety guardrails", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { assertUnitVariety } = await import("../scripts/lib/unit-variety-guardrails.mjs");

    expect(() => assertUnitVariety(unit001, { allowedBareDesuWordIds: ["watashi", "sakura", "yuki", "tanaka"] })).not.toThrow();
    expect(() => assertUnitVariety(unit002)).not.toThrow();
    expect(() => assertUnitVariety(unit003)).not.toThrow();
  });
});
