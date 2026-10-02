import { describe, expect, it } from "vitest";
import { courseLevels, unitIndex } from "../src/data";
import { helperVocabularyUnitIds, knownVocabularyUnitIds, lexiconVocabularyUnitIds, reviewVocabularyUnitIds, vocabularyPoolsForUnit } from "../src/curriculum/bin";
import functionWords from "../data/jp/curriculum/function_words.json";
import grammarTokens from "../data/jp/curriculum/grammar_tokens.json";
import runtimeLexicon from "../data/jp/curriculum/runtime_lexicon.json";
import pacingRules from "../data/jp/curriculum/source/pacing.json";
import unitSpecs from "../data/jp/curriculum/source/unit_specs.json";

const unitModules = import.meta.glob<{
  default: {
    cards: Array<{
      id: string;
      english: string;
      grammarTags?: string[];
      line: string[];
      tokens?: Array<{ surface: string; reading: string; explain?: string; wordId?: string }>;
      tts: string[];
    }>;
    newWords: Array<{ id: string; surface: string; function?: string }>;
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

  it("keeps the dictionary-derived runtime lexicon compatible with authored vocabulary", () => {
    const sourceWords = unitSpecs.units.flatMap((unit) =>
      unit.newWords.map((word) => ({
        id: word.id,
        surface: word.surface,
        reading: word.reading,
        meaning: word.meaning,
        function: word.function,
        introducedInUnit: unit.id,
        level: levelForUnit(unit.id)?.code ?? null,
      })),
    );
    sourceWords.sort((a, b) => a.id.localeCompare(b.id));

    expect(runtimeLexicon.generatedFrom).toBe("data/jp/dictionary/course_bindings.json");
    expect(runtimeLexicon.words.map(({id, surface, reading, meaning, function: kind, introducedInUnit, level}) => ({id, surface, reading, meaning, function: kind, introducedInUnit, level}))).toEqual(sourceWords);
    expect(runtimeLexicon.words.every(word => word.dictionaryEntryId)).toBe(true);
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

  it("keeps prelude recognition units out of standard SRS bins", () => {
    expect(reviewVocabularyUnitIds(101)).toEqual([]);
    expect(knownVocabularyUnitIds(101)).toEqual([101]);
    expect(lexiconVocabularyUnitIds(101)).toEqual([]);
    expect(vocabularyPoolsForUnit(101)).toEqual({
      current: [101],
      reviewDue: [],
      lexicon: [],
      helpers: [101],
    });
  });

  it("tracks particles and copula chunks as function words while keeping existence verbs in SRS vocabulary", () => {
    expect(functionWords.map((word) => word.surface)).toEqual(expect.arrayContaining(["は", "が", "を", "に", "か", "です"]));
    expect(functionWords.map((word) => word.surface)).not.toEqual(expect.arrayContaining(["あります", "います", "ありません", "いません"]));
    expect(grammarTokens.map((word) => word.surface)).not.toEqual(expect.arrayContaining(["あります", "います", "ありません", "いません"]));
    expect(wordsForUnitIds([6]).map((word) => word.id)).toEqual(expect.arrayContaining(["aru", "iru"]));
  });

  it("documents every anonymous learner-facing token as function, grammar, or punctuation", () => {
    const documentedTokenKeys = new Set([...functionWords, ...grammarTokens].map((word) => `${word.surface}|${word.reading}`));
    const punctuationTokenKeys = new Set(["\uFF1F|\uFF1F", "\u3001|\u3001"]);
    const offenders: string[] = [];

    for (const [modulePath, module] of Object.entries(unitModules)) {
      for (const card of module.default.cards) {
        for (const token of card.tokens ?? []) {
          if (token.wordId) continue;

          const key = `${token.surface}|${token.reading}`;
          if (!documentedTokenKeys.has(key) && !punctuationTokenKeys.has(key)) {
            offenders.push(`${modulePath} ${card.id}: ${key}`);
          }
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("does not repeat exact Japanese card lines inside a unit", () => {
    for (const [modulePath, module] of Object.entries(unitModules)) {
      const seen = new Map<string, string[]>();
      for (const card of module.default.cards) {
        const japaneseLine = card.line.join("");
        seen.set(japaneseLine, [...(seen.get(japaneseLine) ?? []), card.id]);
      }

      const duplicates = [...seen.entries()]
        .filter(([, cardIds]) => cardIds.length > 1)
        .map(([japaneseLine, cardIds]) => `${japaneseLine} [${cardIds.join(", ")}]`);
      expect(duplicates, modulePath).toEqual([]);
    }
  });

  it("keeps kana recognition units complete and non-repeating", () => {
    const hiragana = unitModules[unitModulePath(101)].default;
    const katakana = unitModules[unitModulePath(102)].default;
    const hiraganaSurfaces = new Set(hiragana.newWords.map((word) => word.surface));
    const katakanaSurfaces = new Set(katakana.newWords.map((word) => word.surface));

    expect(hiragana.cards).toHaveLength(hiragana.newWords.length);
    expect(katakana.cards).toHaveLength(katakana.newWords.length);
    expect(hiragana.newWords).toHaveLength(113);
    expect(katakana.newWords).toHaveLength(114);
    expect(new Set(hiragana.cards.map((card) => card.tokens?.[0]?.wordId)).size).toBe(hiragana.cards.length);
    expect(new Set(katakana.cards.map((card) => card.tokens?.[0]?.wordId)).size).toBe(katakana.cards.length);

    for (const surface of ["\u304c", "\u3071", "\u304d\u3083", "\u3058\u3083", "\u3063"]) {
      expect(hiraganaSurfaces.has(surface), `missing hiragana ${surface}`).toBe(true);
    }
    for (const surface of ["\u30ac", "\u30d1", "\u30ad\u30e3", "\u30b8\u30e3", "\u30c3", "\u30fc"]) {
      expect(katakanaSurfaces.has(surface), `missing katakana ${surface}`).toBe(true);
    }
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
    expect(courseLevels.levels.map((level) => level.code)).toEqual(["Kana", "A1", "A2", "B1", "B2"]);

    expect(unitIndex.units.filter((entry) => entry.id >= 101 && entry.id <= 103).every((entry) => levelForUnit(entry.id)?.code === "Kana")).toBe(true);
    expect(unitIndex.units.filter((entry) => entry.id <= 49).every((entry) => levelForUnit(entry.id)?.code === "A1")).toBe(true);
    expect(unitIndex.units.some((entry) => entry.id >= 50 && entry.id < 100)).toBe(false);
  });

  it("keeps current authored unit IDs and slugs stable", () => {
    expect(unitIndex.units.slice(0, 20).map((unit) => [unit.id, unit.slug])).toEqual([
      [1, "starter-classroom-japanese"],
      [2, "starter-countries-jobs"],
      [3, "starter-family-people"],
      [4, "starter-food-drink"],
      [5, "starter-restaurants-taste"],
      [6, "starter-home-rooms"],
      [7, "starter-neighborhood-places"],
      [8, "starter-daily-life-time"],
      [9, "starter-calendar-events"],
      [10, "starter-hobbies-entertainment"],
      [11, "starter-culture-festivals"],
      [12, "starter-transport-directions"],
      [13, "starter-tokyo-landmarks"],
      [14, "starter-shopping-souvenirs"],
      [15, "starter-clothes-colors"],
      [16, "starter-size-money"],
      [17, "starter-travel-weather"],
      [18, "starter-feelings-conversation"],
      [19, "starter-numbers-counters"],
      [20, "starter-social-phrases"],
    ]);
    expect(unitIndex.units.filter((unit) => unit.id >= 21 && unit.id <= 49).every((unit) => /^starter-full-index-\d{2}$/.test(unit.slug))).toBe(true);
    expect(unitIndex.units.slice(-3).map((unit) => [unit.id, unit.slug])).toEqual([
      [101, "hiragana"],
      [102, "katakana"],
      [103, "first-kanji-symbols"],
    ]);
  });

  it("keeps an action or existence lane in every A1 unit", () => {
    const previewTag = "early masu action preview";
    const phraseActionTag = "V\u307e\u3059 phrase";
    const foundationActionTag = "early V\u307e\u3059 action";
    const objectActionTag = "N\u3092V\u307e\u3059";
    const understoodObjectActionTag = "N\u304c\u5206\u304b\u308a\u307e\u3059";
    const locationActionTag = "\u5834\u6240\u306bV\u307e\u3059";
    const personActionTags = ["人に会います", "人と話します"];
    const existenceForms = new Set(["\u3042\u308a\u307e\u3059", "\u3044\u307e\u3059", "\u3042\u308a\u307e\u305b\u3093", "\u3044\u307e\u305b\u3093"]);
    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const currentVerbs = unit.newWords.filter((word) => word.function === "verb" && !["aru", "iru"].includes(word.id));
      if (unitId === 6) {
        expect(unit.newWords.map((word) => word.id)).toEqual(expect.arrayContaining(["aru", "iru"]));
        expect(
          unit.cards.filter((card) => card.line.some((part) => existenceForms.has(part))).length,
          `unit ${unitId} existence cards`,
        ).toBeGreaterThanOrEqual(10);
        continue;
      }
      expect(currentVerbs, `unit ${unitId} current verbs`).toHaveLength(unitId === 1 ? 3 : 2);
      for (const verb of currentVerbs) {
        const verbActionCards = unit.cards.filter(
          (card) =>
            card.grammarTags?.some((tag) => [foundationActionTag, objectActionTag, understoodObjectActionTag, locationActionTag, ...personActionTags].includes(tag)) &&
            card.tokens?.some((token) => token.wordId === verb.id),
        );
        const phraseActionCards = unitId === 1 ? unit.cards.filter((card) => card.grammarTags?.includes(phraseActionTag) && card.tokens?.some((token) => token.wordId === verb.id)) : [];
        expect(verbActionCards.length + phraseActionCards.length, `unit ${unitId} verb ${verb.id}`).toBeGreaterThanOrEqual(unitId <= 7 ? 2 : 6);
      }
    }

    for (let unitId = 8; unitId <= 14; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const actionOrExistenceCards = unit.cards.filter(
        (card) =>
          card.grammarTags?.some((tag) => [previewTag, foundationActionTag, objectActionTag, understoodObjectActionTag, locationActionTag].includes(tag)) ||
          card.line.some((part) => existenceForms.has(part)),
      );
      expect(actionOrExistenceCards.length, `unit ${unitId}`).toBeGreaterThanOrEqual(2);
    }

    for (let unitId = 15; unitId <= 20; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const existenceCards = unit.cards.filter((card) => card.line.some((part) => existenceForms.has(part)));
      const actionCards = unit.cards.filter((card) =>
        card.grammarTags?.some((tag) => [previewTag, foundationActionTag, objectActionTag, understoodObjectActionTag, locationActionTag].includes(tag)),
      );
      expect(existenceCards.length + actionCards.length, `unit ${unitId}`).toBeGreaterThanOrEqual(1);
    }
  });

  it("opens Starter Unit 1 in sentence context before mixed review", () => {
    const unit = unitModules[unitModulePath(1)].default;
    expect(unit.cards.slice(0, 10).every((card) => card.line.length > 1)).toBe(true);
    expect(unit.cards.slice(0, 12).flatMap((card) => card.tokens?.map((token) => token.wordId) ?? [])).toEqual(
      expect.arrayContaining(unit.newWords.map((word) => word.id)),
    );
    expect(unit.cards.slice(0, 12).some((card) => card.tokens?.some((token) => token.surface.endsWith("\u307e\u3059")))).toBe(true);
  });

  it("opens Starter Unit 2 with current material in familiar frames", () => {
    const unit = unitModules[unitModulePath(2)].default;
    const currentWordIds = new Set(unit.newWords.map((word) => word.id));

    expect(unit.cards[0].tokens?.some((token) => token.wordId && currentWordIds.has(token.wordId))).toBe(true);
    expect(unit.cards.slice(0, 14).every((card) => card.tokens?.some((token) => token.wordId && currentWordIds.has(token.wordId)))).toBe(true);
    expect(unit.cards.slice(0, 14).flatMap((card) => card.tokens?.map((token) => token.wordId) ?? [])).toEqual(
      expect.arrayContaining(["nihon", "oosutoraria", "kaishain", "hataraku", "sumu"]),
    );
  });

  it("keeps rebuilt foundation units off cold vocabulary intro cards", () => {
    for (let unitId = 1; unitId <= 7; unitId += 1) {
      const unit = unitModules[unitModulePath(unitId)].default;
      const wordFunctionById = new Map(unit.newWords.map((word) => [word.id, word.function]));
      const hasColdOneTokenCard = unit.cards.some(
        (card) => card.line.length === 1 && !card.tokens?.some((token) => token.wordId && wordFunctionById.get(token.wordId) === "verb"),
      );
      expect(unit.cards.some((card) => card.grammarTags?.includes("vocabulary introduction")), `unit ${unitId}`).toBe(false);
      expect(hasColdOneTokenCard, `unit ${unitId}`).toBe(false);
    }
  });

  it("introduces Starter existence verbs in the home unit", () => {
    const unit = unitModules[unitModulePath(6)].default;
    const firstSeen = firstWordPositions(6);
    const existenceCards = unit.cards.filter((card) => card.tokens?.some((token) => token.surface === "\u3042\u308a\u307e\u3059" || token.surface === "\u3044\u307e\u3059"));

    expect(firstSeen.get("aru")).toBeLessThanOrEqual(20);
    expect(firstSeen.get("iru")).toBeLessThanOrEqual(20);
    expect(existenceCards.length).toBeGreaterThanOrEqual(10);
    expect(unit.cards.some((card) => card.tokens?.some((token) => token.surface === "\u3058\u3083\u3042\u308a\u307e\u305b\u3093"))).toBe(false);
  });

  it("keeps Unit 4 ordinary current vocabulary inside starter exposure bands", () => {
    const unit = unitModules[unitModulePath(4)].default;
    const counts = wordAppearanceCounts(4);
    const grammarFocusWordIds = new Set(["aru", "iru"]);

    expect(unit.cards.length).toBeLessThan(100);
    for (const word of unit.newWords) {
      if (grammarFocusWordIds.has(word.id)) {
        expect(counts.get(word.id), `unit 4 grammar word ${word.id}`).toBeGreaterThanOrEqual(8);
        continue;
      }
      expect(counts.get(word.id), `unit 4 current word ${word.id}`).toBeGreaterThanOrEqual(3);
      expect(counts.get(word.id), `unit 4 current word ${word.id}`).toBeLessThanOrEqual(word.function === "verb" ? 35 : 24);
    }
  });

  it("keeps Unit 4 SRS review vocabulary inside starter exposure bands", () => {
    const unit = unitModules[unitModulePath(4)].default;
    const counts = wordAppearanceCounts(4);

    for (const wordId of unit.reviewWordIds) {
      expect(counts.get(wordId), `unit 4 review word ${wordId}`).toBeGreaterThanOrEqual(1);
      expect(counts.get(wordId), `unit 4 review word ${wordId}`).toBeLessThanOrEqual(12);
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
        if (desuIndex >= 0) {
          expect(kaIndex).toBeGreaterThan(desuIndex);
        } else {
          expect(card.line.indexOf("か")).toBeGreaterThanOrEqual(0);
        }
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

  it("does not use intro cards for review-due vocabulary", () => {
    for (const unit of Object.values(unitModules).map((module) => module.default)) {
      for (const card of unit.cards) {
        expect(card.grammarTags ?? []).not.toContain("a1 review vocabulary intro");
        expect(card.grammarTags ?? []).not.toContain("a2 review vocabulary intro");
      }
    }
  });

  it("does not first-introduce multiple current-unit words on one card", () => {
    const grammarFocusSrsWordIds = new Set(["aru", "iru", "suki", "kirai", "jouzu", "heta", "hoshii", "hitsuyou", "dou", "ukeru"]);
    const allowedNaturalPairIds = new Set(["suru", "shimasu"]);
    for (const entry of unitIndex.units) {
      const unit = unitModules[unitModulePath(entry.id)].default;
      const firstSeen = firstWordPositions(entry.id);
      for (const [cardIndex, card] of unit.cards.entries()) {
        const newWordsFirstSeenHere = (card.tokens ?? []).filter((token) => {
          const wordId = token.wordId;
          return wordId && unit.newWords.some((word) => word.id === wordId) && firstSeen.get(wordId) === cardIndex + 1;
        });
        const ordinaryNewWords = newWordsFirstSeenHere.filter((token) => token.wordId && !grammarFocusSrsWordIds.has(token.wordId));
        const grammarNewWords = newWordsFirstSeenHere.filter((token) => token.wordId && grammarFocusSrsWordIds.has(token.wordId));
        const ordinaryIds = new Set(ordinaryNewWords.map((token) => token.wordId).filter(Boolean));
        const isNaturalCurrentVerbPair =
          ordinaryNewWords.length === 2 &&
          [...ordinaryIds].some((wordId) => allowedNaturalPairIds.has(String(wordId))) &&
          (card.grammarTags ?? []).includes("N\u3092V\u307e\u3059");
        expect(isNaturalCurrentVerbPair ? 1 : ordinaryNewWords.length, `unit ${entry.id} card ${cardIndex + 1}`).toBeLessThanOrEqual(1);
        expect(grammarNewWords.length, `unit ${entry.id} card ${cardIndex + 1}`).toBeLessThanOrEqual(1);
      }
    }
  });

  it("balances Unit 3 new and review word exposure around the curriculum targets", () => {
    const counts = wordAppearanceCounts(3);
    const unit = unitModules[unitModulePath(3)].default;
    const reviewWords = unitModules[unitModulePath(1)].default.newWords;

    for (const word of unit.newWords) {
      expect(counts.get(word.id), `new word ${word.id}`).toBeGreaterThanOrEqual(3);
      expect(counts.get(word.id), `new word ${word.id}`).toBeLessThanOrEqual(24);
    }

    for (const word of reviewWords) {
      expect(counts.get(word.id), `review word ${word.id}`).toBeGreaterThanOrEqual(2);
      expect(counts.get(word.id), `review word ${word.id}`).toBeLessThanOrEqual(45);
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
