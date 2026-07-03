import { describe, expect, it } from "vitest";
import { courseLevels, unitIndex } from "../src/data";
import { helperVocabularyUnitIds, knownVocabularyUnitIds, lexiconVocabularyUnitIds, reviewVocabularyUnitIds, vocabularyPoolsForUnit } from "../src/curriculum/bin";
import pacingRules from "../data/jp/curriculum/source/pacing.json";
import unitSpecs from "../data/jp/curriculum/source/unit_specs.json";

const unitModules = import.meta.glob<{
  default: {
    cards: Array<{
      english: string;
      grammarTags?: string[];
      line: string[];
      tokens?: Array<{ surface: string; reading: string; explain?: string; wordId?: string }>;
      tts: string[];
    }>;
    newWords: Array<{ id: string; function?: string }>;
    reviewWordIds: string[];
    lexiconWordIds: string[];
  };
}>("../data/jp/curriculum/units/unit_*.json", {
  eager: true,
});

function levelForUnit(unitId: number) {
  return courseLevels.levels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd);
}

function unitModulePath(unitId: number) {
  return `../data/jp/curriculum/units/unit_${String(unitId).padStart(3, "0")}.json`;
}

function wordsForUnitIds(unitIds: number[]) {
  return unitSpecs.units.flatMap((unit) => (unitIds.includes(unit.id) ? unit.newWords : []));
}

function firstWordPositions(unitId: number) {
  const unit = unitModules[unitModulePath(unitId)].default;
  const positions = new Map<string, number>();
  for (const [cardIndex, card] of unit.cards.entries()) {
    for (const token of card.tokens ?? []) {
      if (token.wordId && !positions.has(token.wordId)) positions.set(token.wordId, cardIndex + 1);
    }
  }
  return positions;
}

function wordAppearanceCounts(unitId: number) {
  const unit = unitModules[unitModulePath(unitId)].default;
  const counts = new Map<string, number>();
  for (const card of unit.cards) {
    const wordIds = new Set((card.tokens ?? []).flatMap((token) => (token.wordId ? [token.wordId] : [])));
    for (const wordId of wordIds) counts.set(wordId, (counts.get(wordId) ?? 0) + 1);
  }
  return counts;
}

describe("curriculum word bins", () => {
  it("keeps editable unit specs aligned with the authored unit index", () => {
    expect(unitSpecs.language).toBe("jp");
    expect(unitSpecs.units.map((unit) => [unit.id, unit.slug, unit.title, unit.grammarFocus])).toEqual(
      unitIndex.units.map((unit) => [unit.id, unit.slug, unit.title, unit.grammarFocus]),
    );
  });

  it("defines the no-first-exposure pacing cutoff before late review cards", () => {
    expect(pacingRules.cutoffs.currentWordFirstSeenBy).toBeLessThanOrEqual(40);
    expect(pacingRules.cutoffs.grammarFocusFirstSeenBy).toBeLessThanOrEqual(60);
    expect(pacingRules.cutoffs.reviewWordPreferredFirstSeenAfter).toBeGreaterThanOrEqual(30);
    expect(pacingRules.cutoffs.noFirstExposureAfter).toBe(60);
    expect(pacingRules.cardBands.at(-1)?.id).toBe("review-and-mix");
  });

  it("can generate a card-position candidate from the curriculum model", async () => {
    // @ts-expect-error Node authoring scripts live outside the app TypeScript module graph.
    const { generateCardCandidate } = await import("../scripts/lib/curriculum-card-generator.mjs");
    const card = generateCardCandidate({
      source: unitSpecs,
      pacing: pacingRules,
      unitId: 2,
      cardNumber: 50,
      variant: 0,
    });

    expect(card.meta.band).toBe("new-grammar-drill");
    expect(card.meta.introducedWordIds).toEqual([]);
    expect(card.line).toHaveLength(card.tts.length);
    expect(card.line).toHaveLength(card.explain.length);
    expect(card.tokens).toHaveLength(card.line.length);
    expect(card.grammarTags).toContain(unitSpecs.units[1].grammarFocus);
  });

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
    expect(lexiconVocabularyUnitIds(5)).toEqual([2, 4]);
    expect(helperVocabularyUnitIds(5)).toEqual([1, 2, 3, 4, 5]);
    expect(vocabularyPoolsForUnit(5)).toEqual({
      current: [5],
      reviewDue: [3, 1],
      lexicon: [2, 4],
      helpers: [1, 2, 3, 4, 5],
    });
  });

  it("stores SRS review words separately from free lexicon helpers", () => {
    const unit = unitModules[unitModulePath(4)].default;

    expect(unit.reviewWordIds).toEqual(wordsForUnitIds([2]).map((word) => word.id));
    expect(unit.lexiconWordIds).toEqual(wordsForUnitIds([1, 3]).map((word) => word.id));
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

  it("keeps an action or existence lane in every A1 unit", () => {
    const previewTag = "early masu action preview";
    const foundationActionTag = "early V\u307e\u3059 action";
    const existenceForms = new Set(["\u3042\u308a\u307e\u3059", "\u3044\u307e\u3059", "\u3042\u308a\u307e\u305b\u3093", "\u3044\u307e\u305b\u3093"]);
    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const currentVerbs = unit.newWords.filter((word) => word.function === "verb");
      expect(currentVerbs, `unit ${unitId} current verbs`).toHaveLength(2);
      for (const verb of currentVerbs) {
        const verbActionCards = unit.cards.filter(
          (card) => card.grammarTags?.includes(foundationActionTag) && card.tokens?.some((token) => token.wordId === verb.id),
        );
        expect(verbActionCards.length, `unit ${unitId} verb ${verb.id}`).toBeGreaterThanOrEqual(7);
      }
    }

    for (let unitId = 8; unitId <= 14; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      expect(unit.cards.filter((card) => card.grammarTags?.includes(previewTag))).toHaveLength(2);
    }

    for (let unitId = 15; unitId <= 20; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const existenceCards = unit.cards.filter((card) => card.line.some((part) => existenceForms.has(part)));
      expect(existenceCards.length, `unit ${unitId}`).toBeGreaterThanOrEqual(2);
    }
  });

  it("opens Unit 1 in sentence context before one-slot sentence swaps", () => {
    const unit = unitModules[unitModulePath(1)].default;
    expect(unit.cards.slice(0, 10).every((card) => card.line.length > 1)).toBe(true);
    expect(unit.cards.slice(0, 10).map((card) => card.english)).toEqual([
      "It's me",
      "It's a student",
      "It's a teacher",
      "It's a name",
      "It's you",
      "It's him",
      "It's her",
      "It's a friend",
      "I eat",
      "You drink",
    ]);
    expect(unit.cards.slice(10, 14).map((card) => card.english)).toEqual([
      "I am a student",
      "You are a student",
      "He is a student",
      "She is a student",
    ]);
  });

  it("keeps rebuilt foundation units off cold vocabulary intro cards", () => {
    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      expect(unit.cards.some((card) => card.grammarTags?.includes("vocabulary introduction")), `unit ${unitId}`).toBe(false);
      expect(unit.cards.some((card) => card.line.length === 1), `unit ${unitId}`).toBe(false);
    }
  });

  it("interleaves Unit 4 negative identity with movement verbs", () => {
    const unit = unitModules[unitModulePath(4)].default;
    const firstSeen = firstWordPositions(4);
    const firstMovementCards = unit.cards.slice(0, 40).filter((card) => card.tokens?.some((token) => token.wordId === "iku" || token.wordId === "kuru"));

    expect(firstSeen.get("iku")).toBeLessThanOrEqual(20);
    expect(firstSeen.get("kuru")).toBeLessThanOrEqual(20);
    expect(firstMovementCards.length).toBeGreaterThanOrEqual(4);
    expect(unit.cards.slice(0, 40).some((card) => card.english.includes("not"))).toBe(true);
  });

  it("keeps Unit 4 current vocabulary in a tight 8-12 appearance band", () => {
    const unit = unitModules[unitModulePath(4)].default;
    const counts = wordAppearanceCounts(4);

    expect(unit.cards.length).toBeLessThan(100);
    for (const word of unit.newWords) {
      expect(counts.get(word.id), `unit 4 current word ${word.id}`).toBeGreaterThanOrEqual(8);
      expect(counts.get(word.id), `unit 4 current word ${word.id}`).toBeLessThanOrEqual(12);
    }
  });

  it("keeps Unit 4 SRS review vocabulary in a strict 5-8 appearance band", () => {
    const unit = unitModules[unitModulePath(4)].default;
    const counts = wordAppearanceCounts(4);

    for (const wordId of unit.reviewWordIds) {
      expect(counts.get(wordId), `unit 4 review word ${wordId}`).toBeGreaterThanOrEqual(5);
      expect(counts.get(wordId), `unit 4 review word ${wordId}`).toBeLessThanOrEqual(8);
    }
  });

  it("keeps foundation current words and due review out of late-only positions", () => {
    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const firstSeen = firstWordPositions(unitId);
      const currentWordIds = new Set(unit.newWords.map((word) => word.id));
      const currentCardsInTail = unit.cards
        .slice(-20)
        .filter((card) => card.tokens?.some((token) => typeof token.wordId === "string" && currentWordIds.has(token.wordId))).length;

      for (const word of unit.newWords) {
        expect(firstSeen.get(word.id) ?? Number.POSITIVE_INFINITY, `unit ${unitId} current word ${word.id}`).toBeLessThanOrEqual(60);
      }

      for (const word of wordsForUnitIds(reviewVocabularyUnitIds(unitId))) {
        expect(firstSeen.get(word.id) ?? Number.POSITIVE_INFINITY, `unit ${unitId} review word ${word.id}`).toBeLessThanOrEqual(80);
      }

      expect(currentCardsInTail, `unit ${unitId}`).toBeGreaterThanOrEqual(8);
    }
  });

  it("rejects obvious foundation review-tail nonsense and broken verb pairings", () => {
    const badIdentityPattern =
      /\b(I am|You are|He is|She is|The teacher is|The student is|The friend is|The doctor is|My mother is|My father is)\b (a cat|a dog|an animal|a book|a photo|a bag|a chair|a desk|a place|a house|a school|a shop|a hospital|a station|a company|a name|me|you|him|her|my mother|my father|my older sister|my younger brother|yesterday|last month|last year|morning|night|day off|a trip|work)$/;
    const brokenVerbPattern = /listen a|looks at$|look at$|study at a station|study at a hospital|use tea|use a photo/;

    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const [cardIndex, card] of unit.cards.entries()) {
        expect(card.english, `unit ${unitId} card ${cardIndex + 1}`).not.toMatch(badIdentityPattern);
        expect(card.english, `unit ${unitId} card ${cardIndex + 1}`).not.toMatch(brokenVerbPattern);
      }
    }
  });

  it("keeps Unit 1 off bare to-and-choice fragments", () => {
    const unit = unitModules[unitModulePath(1)].default;
    for (const card of unit.cards) {
      expect(card.line).not.toContain("と");
      expect(card.grammarTags ?? []).not.toContain("AとB");
      expect(card.grammarTags ?? []).not.toContain("AかB");
    }
  });

  it("keeps early to-compound drills on concrete nouns instead of pronoun pairs", () => {
    const pronounIds = new Set(["watashi", "sakura", "yuki", "tanaka"]);
    for (let unitId = 2; unitId <= 5; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const card of unit.cards.filter((entry) => entry.grammarTags?.includes("AとBはCです"))) {
        expect(
          card.tokens?.some((token) => {
            const wordId = "wordId" in token && typeof token.wordId === "string" ? token.wordId : undefined;
            return wordId ? pronounIds.has(wordId) : false;
          }),
        ).toBe(false);
      }
    }
  });

  it("keeps legacy name vocabulary out of authored learner-facing text", () => {
    const visibleNamePattern = /Sakura|Yuki|Tanaka|さくら|ユキ|田中/;
    for (const unit of Object.values(unitModules).map((module) => module.default)) {
      for (const card of unit.cards) {
        expect(card.english).not.toMatch(visibleNamePattern);
        expect(card.line.join("")).not.toMatch(visibleNamePattern);
        expect(card.tokens?.map((token) => `${token.surface}${token.explain}`).join(" ")).not.toMatch(visibleNamePattern);
      }
    }
  });

  it("splits desu and ka in rebuilt foundation questions", () => {
    const allQuestionCards = [];
    for (let unitId = 1; unitId <= 5; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const card of unit.cards) {
        expect(card.tokens?.some((token) => token.surface === "ですか")).toBe(false);
      }

      const questionCards = unit.cards.filter((card) => card.line.length > 1 && card.line.includes("か"));
      allQuestionCards.push(...questionCards);

      for (const card of questionCards) {
        const desuIndex = card.line.indexOf("です");
        const kaIndex = card.line.indexOf("か", Math.max(desuIndex, 0));
        expect(desuIndex).toBeGreaterThanOrEqual(0);
        expect(kaIndex).toBeGreaterThan(desuIndex);
      }
    }
    expect(allQuestionCards.length).toBeGreaterThan(0);
  });

  it("keeps productive question markers visible across A1", () => {
    for (let unitId = 1; unitId <= 20; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const card of unit.cards) {
        expect(card.line).not.toContain("ですか");
        expect(card.line).not.toContain("ありますか");
        expect(card.line).not.toContain("いますか");

        const questionIndex = card.line.indexOf("？");
        if (questionIndex >= 0) {
          expect(card.line.indexOf("か")).toBeGreaterThanOrEqual(0);
          expect(card.line.indexOf("か")).toBeLessThan(questionIndex);
        }
      }
    }
  });

  it("keeps productive question markers visible across A2", () => {
    const questionMark = "\uff1f";
    const questionMarker = "\u304b";
    const hiddenQuestionEndings = [
      "\u3042\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u304b",
      "\u3042\u308a\u307e\u305b\u3093\u304b",
      "\u3042\u308a\u307e\u3059\u304b",
      "\u3044\u307e\u305b\u3093\u3067\u3057\u305f\u304b",
      "\u3044\u307e\u305b\u3093\u304b",
      "\u3044\u307e\u3059\u304b",
      "\u307e\u305b\u3093\u3067\u3057\u305f\u304b",
      "\u307e\u3057\u305f\u304b",
      "\u307e\u305b\u3093\u304b",
      "\u307e\u3057\u3087\u3046\u304b",
      "\u307e\u3059\u304b",
      "\u3067\u3057\u305f\u304b",
      "\u3067\u3059\u304b",
    ];

    for (let unitId = 21; unitId <= 44; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const card of unit.cards) {
        expect(card.line.some((part) => hiddenQuestionEndings.some((ending) => part.endsWith(ending)))).toBe(false);

        const questionIndex = card.line.indexOf(questionMark);
        if (questionIndex >= 0) {
          const kaIndex = card.line.indexOf(questionMarker);
          expect(kaIndex).toBeGreaterThanOrEqual(0);
          expect(kaIndex).toBeLessThan(questionIndex);
        }
      }
    }
  });

  it("keeps A2 current vocabulary early and review-due vocabulary present", () => {
    for (let unitId = 21; unitId <= 44; unitId += 1) {
      const firstSeen = firstWordPositions(unitId);
      const unitSpec = unitSpecs.units.find((unit) => unit.id === unitId);
      expect(unitSpec).toBeDefined();

      for (const word of unitSpec?.newWords ?? []) {
        expect(firstSeen.get(word.id) ?? Number.POSITIVE_INFINITY, `unit ${unitId} current word ${word.id}`).toBeLessThanOrEqual(
          pacingRules.cutoffs.currentWordFirstSeenBy,
        );
      }

      for (const word of wordsForUnitIds(reviewVocabularyUnitIds(unitId))) {
        expect(firstSeen.get(word.id), `unit ${unitId} review word ${word.id}`).toBeDefined();
      }
    }
  });

  it("does not use intro cards for review-due vocabulary", () => {
    for (const unit of Object.values(unitModules).map((module) => module.default)) {
      for (const card of unit.cards) {
        expect(card.grammarTags ?? []).not.toContain("a1 review vocabulary intro");
        expect(card.grammarTags ?? []).not.toContain("a2 review vocabulary intro");
      }
    }
  });

  it("does not first-introduce multiple current-unit words on one card", () => {
    for (const entry of unitIndex.units) {
      const unit = unitModules[unitModulePath(entry.id)].default;
      const firstSeen = firstWordPositions(entry.id);
      for (const [cardIndex, card] of unit.cards.entries()) {
        const newWordsFirstSeenHere = (card.tokens ?? []).filter((token) => {
          const wordId = token.wordId;
          return wordId && unit.newWords.some((word) => word.id === wordId) && firstSeen.get(wordId) === cardIndex + 1;
        });
        expect(newWordsFirstSeenHere.length, `unit ${entry.id} card ${cardIndex + 1}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("balances Unit 3 new and review word exposure around the curriculum targets", () => {
    const counts = wordAppearanceCounts(3);
    const unit = unitModules[unitModulePath(3)].default;
    const reviewWords = unitModules[unitModulePath(1)].default.newWords;

    for (const word of unit.newWords) {
      expect(counts.get(word.id), `new word ${word.id}`).toBeGreaterThanOrEqual(pacingRules.distributionTargets.currentWordAppearances);
      expect(counts.get(word.id), `new word ${word.id}`).toBeLessThanOrEqual(18);
    }

    for (const word of reviewWords) {
      expect(counts.get(word.id), `review word ${word.id}`).toBeGreaterThanOrEqual(3);
    }
  });

  it("keeps pronouns out of generic A1 where/existence question slots", () => {
    const pronounIds = new Set(["watashi", "sakura", "yuki", "tanaka"]);
    for (let unitId = 8; unitId <= 20; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      for (const card of unit.cards) {
        const hasPronoun = card.tokens?.some((token) => {
          const wordId = "wordId" in token && typeof token.wordId === "string" ? token.wordId : undefined;
          return wordId ? pronounIds.has(wordId) : false;
        });
        const isWhereOrExistenceQuestion =
          card.line.includes("どこ") || card.line.includes("あります") || card.line.includes("います");

        if (hasPronoun && isWhereOrExistenceQuestion && card.line.includes("？")) {
          expect(card.grammarTags ?? []).toContain("review vocabulary");
        }
      }
    }
  });

  it("uses pronunciation readings for negative copula particles", () => {
    for (const unit of Object.values(unitModules).map((module) => module.default)) {
      for (const card of unit.cards) {
        card.tokens?.forEach((token, index) => {
          if (token.surface === "ではありません") {
            expect(token.reading).toBe("でわありません");
            expect(token.explain).toMatch(/polite negative/);
            expect(card.tts[index]).toBe("でわありません");
          }

          if (token.surface === "ではありませんでした") {
            expect(token.reading).toBe("でわありませんでした");
            expect(token.explain).toMatch(/polite past negative/);
            expect(card.tts[index]).toBe("でわありませんでした");
          }
        });
      }
    }
  });
});
