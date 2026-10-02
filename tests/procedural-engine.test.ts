import { describe, expect, it } from "vitest";
import { changedSlots, generateSession, GenerationError, grammarIds, inflectAdjective, inflectVerb, LIMITS, realizeSentence, resolveWordPool, validateLexicon, wordAudioPlan, type Adjective, type ConstructionId, type Features, type Lexicon, type Noun, type Recipe, type Sentence, type Verb } from "../packages/learning-engine";
import { exampleLexicon, exampleRecipes, exampleReviewRecipe } from "../packages/learning-engine/examples";
import type { PracticeCard as CurrentCard } from "../src/types";
import type { PracticeCard as NextCard } from "../apps/learner-next/src/types";

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const positive: Features = { tense: "nonpast", polarity: "positive", question: false };
const pool = exampleLexicon.entries.map(entry => entry.id);
const sense = (wordId: string) => resolveWordPool([wordId], exampleLexicon)[0];
const lexicalVerb = (wordId: string) => exampleLexicon.entries.find(entry => entry.wordId === wordId) as Verb;
const lexicalAdjective = (wordId: string) => exampleLexicon.entries.find(entry => entry.wordId === wordId) as Adjective;
function sentence(construction: ConstructionId, bindings: Record<string, string>, features = positive): Sentence {
  return { construction, bindings: Object.fromEntries(Object.entries(bindings).map(([slot, id]) => [slot, sense(id)])), features };
}
const realize = (value: Sentence) => realizeSentence(value, exampleLexicon, pool, [...grammarIds]);
function codeOf(run: () => unknown): string {
  try { run(); } catch (error) {
    expect(error).toBeInstanceOf(GenerationError);
    return (error as GenerationError).code;
  }
  throw new Error("Expected generation to reject this input");
}
const nounFixture = (id: string, existence: "animate" | "inanimate" = "inanimate"): Noun => ({ id, wordId: id, lemma: { surface: "木", reading: "き" }, meaning: "tree", kind: "noun", roles: ["subject", "object", "entity"], existence, english: { subject: "the tree", object: "the tree", predicate: "a tree", existential: "a tree", existentialNegative: "no tree", agreement: "third-singular" } });

describe("reviewed Japanese morphology", () => {
  it.each([
    ["買う", "かう", "買います", "かわない", "買って", "買った"],
    ["書く", "かく", "書きます", "かかない", "書いて", "書いた"],
    ["泳ぐ", "およぐ", "泳ぎます", "およがない", "泳いで", "泳いだ"],
    ["話す", "はなす", "話します", "はなさない", "話して", "話した"],
    ["待つ", "まつ", "待ちます", "またない", "待って", "待った"],
    ["死ぬ", "しぬ", "死にます", "しなない", "死んで", "死んだ"],
    ["遊ぶ", "あそぶ", "遊びます", "あそばない", "遊んで", "遊んだ"],
    ["読む", "よむ", "読みます", "よまない", "読んで", "読んだ"],
    ["帰る", "かえる", "帰ります", "かえらない", "帰って", "帰った"],
  ])("handles the godan paradigm for %s", (surface, reading, polite, negativeReading, te, past) => {
    const verb: Verb = { ...lexicalVerb("yomu"), lemma: { surface, reading } };
    expect(inflectVerb(verb, "polite").surface).toBe(polite);
    expect(inflectVerb(verb, "negative").reading).toBe(negativeReading);
    expect(inflectVerb(verb, "te").surface).toBe(te);
    expect(inflectVerb(verb, "past").surface).toBe(past);
  });
  it("covers ichidan, する compounds, kanji and kana 来る", () => {
    expect(inflectVerb(lexicalVerb("taberu"), "negative-past")).toEqual({ surface: "食べなかった", reading: "たべなかった" });
    expect(inflectVerb(lexicalVerb("taberu"), "polite-negative-past").reading).toBe("たべませんでした");
    const suru = { ...lexicalVerb("suru"), lemma: { surface: "勉強する", reading: "べんきょうする" } };
    expect(inflectVerb(suru, "te")).toEqual({ surface: "勉強して", reading: "べんきょうして" });
    expect(inflectVerb(suru, "negative").surface).toBe("勉強しない");
    expect(inflectVerb(lexicalVerb("kuru"), "negative")).toEqual({ surface: "来ない", reading: "こない" });
    expect(inflectVerb(lexicalVerb("kuru"), "polite")).toEqual({ surface: "来ます", reading: "きます" });
    expect(inflectVerb({ ...lexicalVerb("kuru"), lemma: { surface: "くる", reading: "くる" } }, "te")).toEqual({ surface: "きて", reading: "きて" });
  });
  it("implements 行く and ある exceptions without applying them to other verbs", () => {
    expect(inflectVerb(lexicalVerb("iku"), "te")).toEqual({ surface: "行って", reading: "いって" });
    expect(inflectVerb(lexicalVerb("iku"), "past").surface).toBe("行った");
    expect(inflectVerb(lexicalVerb("aru"), "negative")).toEqual({ surface: "ない", reading: "ない" });
    expect(inflectVerb(lexicalVerb("aru"), "negative-past").surface).toBe("なかった");
    expect(inflectVerb(lexicalVerb("aru"), "polite-negative").surface).toBe("ありません");
    expect(codeOf(() => inflectVerb({ ...lexicalVerb("iku"), exception: undefined }, "te"))).toBe("LEXEME_METADATA");
    expect(codeOf(() => inflectVerb({ ...lexicalVerb("yomu"), exception: "iku" }, "te"))).toBe("LEXEME_METADATA");
  });
  it("uses いい's reviewed stem, regular かわいい, and explicit compound stems", () => {
    const good = lexicalAdjective("ii");
    expect(inflectAdjective(good, "nonpast").surface).toBe("いい");
    expect(inflectAdjective(good, "negative").surface).toBe("よくない");
    expect(inflectAdjective(good, "past").surface).toBe("よかった");
    expect(inflectAdjective(good, "negative-past").surface).toBe("よくなかった");
    expect(inflectAdjective({ ...good, lemma: { surface: "かわいい", reading: "かわいい" }, inflectionStem: undefined }, "negative").surface).toBe("かわいくない");
    expect(inflectAdjective({ ...good, lemma: { surface: "かっこいい", reading: "かっこいい" }, inflectionStem: { surface: "かっこよ", reading: "かっこよ" } }, "past").surface).toBe("かっこよかった");
    expect(codeOf(() => inflectAdjective({ ...good, inflectionStem: undefined }, "negative"))).toBe("LEXEME_METADATA");
  });
  it("keeps きれい in the na-adjective paradigm despite its spelling", () => {
    const clean = lexicalAdjective("kiree-na");
    expect(inflectAdjective(clean, "attributive").surface).toBe("きれいな");
    expect(inflectAdjective(clean, "negative").surface).toBe("きれいではない");
    expect(inflectAdjective(clean, "te").surface).toBe("きれいで");
    expect(inflectAdjective(lexicalAdjective("ookii"), "attributive").surface).toBe("大きい");
  });
  it("rejects missing classes and unsupported forms", () => {
    expect(codeOf(() => inflectVerb({ ...lexicalVerb("kaeru"), conjugation: undefined } as unknown as Verb, "past"))).toBe("LEXEME_METADATA");
    expect(codeOf(() => inflectVerb(lexicalVerb("yomu"), "passive" as never))).toBe("UNSUPPORTED_FORM");
    expect(codeOf(() => inflectAdjective(lexicalAdjective("ii"), "potential" as never))).toBe("UNSUPPORTED_FORM");
  });
});

describe("structured Japanese and English realization", () => {
  it("realizes the expanded food, people, places and adjectives with explicit agreement and senses", () => {
    expect(realize(sentence("action", { subject: "kodomo", object: "gohan", verb: "taberu" })).english).toBe("The child eats rice");
    expect(realize(sentence("existence", { location: "heya", entity: "yasai" })).english).toBe("There are vegetables in the room");
    expect(realize(sentence("existence", { location: "eki", entity: "tomodachi" })).line.join("")).toBe("駅に友達がいます");
    expect(realize(sentence("na-predicate", { subject: "mise", predicate: "benri-na" })).line.join("")).toBe("店はべんりです");
    expect(realize(sentence("i-predicate", { subject: "koohii", predicate: "takai" }, { ...positive, tense: "past" })).english).toBe("Coffee was expensive");
    expect(realize(sentence("i-predicate", { subject: "pan", predicate: "oishii" }, { ...positive, polarity: "negative" })).line.join("")).toBe("パンはおいしくないです");
    expect(codeOf(() => realize(sentence("action", { subject: "pan", object: "gohan", verb: "taberu" })))).toBe("INVALID_BINDING");
    expect(codeOf(() => realize(sentence("motion", { subject: "kodomo", destination: "terebi", verb: "iku" })))).toBe("INVALID_BINDING");
    expect(codeOf(() => realize(sentence("i-predicate", { subject: "heya", predicate: "benri-na" })))).toBe("INVALID_BINDING");
  });
  const examples: Array<[Sentence, string, string]> = [
    [sentence("identity", { subject: "watashi", predicate: "gakusei" }), "私は学生です", "I am a student"],
    [sentence("identity", { subject: "anata", predicate: "sensei" }, { tense: "past", polarity: "negative", question: true }), "あなたは先生ではありませんでしたか", "Were you not a teacher?"],
    [sentence("i-predicate", { subject: "hon", predicate: "ii" }, { tense: "past", polarity: "negative", question: false }), "ほんはよくなかったです", "The book was not good"],
    [sentence("na-predicate", { subject: "ie", predicate: "kiree-na" }, { ...positive, tense: "past" }), "家はきれいでした", "The house was clean"],
    [sentence("action", { subject: "watashi", object: "nihongo", verb: "yomu" }), "私は日本語を読みます", "I read Japanese"],
    [sentence("action", { subject: "sensei", object: "nihongo", verb: "kaku" }, { ...positive, polarity: "negative", question: true }), "先生は日本語を書きませんか", "Does the teacher not write Japanese?"],
    [sentence("motion", { subject: "gakusei", destination: "gakkou", verb: "iku" }, { ...positive, tense: "past" }), "学生は学校に行きました", "The student went to the school"],
    [sentence("motion", { subject: "anata", destination: "ie", verb: "kuru" }, { ...positive, question: true }), "あなたは家に来ますか", "Do you come to the house?"],
    [sentence("existence", { location: "kouen", entity: "gakusei" }), "公園に学生がいます", "There is a student in the park"],
    [sentence("existence", { location: "ie", entity: "hon" }, { tense: "past", polarity: "negative", question: false }), "家にほんがありませんでした", "There was no book in the house"],
  ];
  it.each(examples)("realizes %j from one structure", (structure, japanese, english) => {
    const card = realize(structure);
    expect(card.line.join("")).toBe(japanese);
    expect(card.english).toBe(english);
    expect(card.tts).toEqual(card.tokens.map(token => token.reading));
    expect(card.explain).toEqual(card.tokens.map(token => token.explain));
    expect(card.line).toEqual(card.tokens.map(token => token.surface));
    const currentCompatible: CurrentCard = card;
    const nextCompatible: NextCard = currentCompatible;
    expect(nextCompatible.tokens.length).toBeGreaterThan(0);
  });
  it("keeps grammatical changes out of the independent word-swap count", () => {
    const first = realize(sentence("existence", { location: "ie", entity: "gakusei" }));
    const next = realize(sentence("existence", { location: "ie", entity: "hon" }));
    expect(changedSlots(first.derivation, next.derivation)).toEqual(["entity"]);
    expect(first.tokens[4].wordId).toBe("iru");
    expect(next.tokens[4].wordId).toBe("aru");
    expect(first.tokens.filter((token, index) => token.surface !== next.tokens[index].surface)).toHaveLength(2);
  });
  it("uses the inanimate existence sense for trees", () => {
    const tree = nounFixture("tree");
    const card = realizeSentence({ construction: "existence", bindings: { location: sense("ie"), entity: "tree" }, features: positive }, { ...exampleLexicon, entries: [...exampleLexicon.entries, tree] }, [...pool, "tree"], [...grammarIds]);
    expect(card.line.join("")).toBe("家に木があります");
  });
  it("requires reviewed literal verb-object compatibility as well as case frames", () => {
    expect(codeOf(() => realize(sentence("action", { subject: "gakusei", object: "hon", verb: "nomu" })))).toBe("SEMANTIC_MISMATCH");
    expect(codeOf(() => realize(sentence("action", { subject: "watashi", object: "anata", verb: "yomu" })))).toBe("SEMANTIC_MISMATCH");
    expect(codeOf(() => realize(sentence("action", { subject: "gakusei", object: "isu", verb: "taberu" })))).toBe("SEMANTIC_MISMATCH");
    expect(realize(sentence("action", { subject: "gakusei", object: "ocha", verb: "nomu" })).english).toBe("The student drinks tea");
    expect(codeOf(() => realize(sentence("action", { subject: "gakusei", object: "hon", verb: "iku" })))).toBe("INVALID_BINDING");
  });
  it("keeps adjective senses and person identities within their reviewed meanings", () => {
    expect(codeOf(() => realize(sentence("i-predicate", { subject: "gakusei", predicate: "oishii" })))).toBe("SEMANTIC_MISMATCH");
    expect(codeOf(() => realize(sentence("i-predicate", { subject: "sensei", predicate: "furui" })))).toBe("SEMANTIC_MISMATCH");
    expect(codeOf(() => realize(sentence("identity", { subject: "hon", predicate: "sensei" })))).toBe("SEMANTIC_MISMATCH");
    expect(realize(sentence("i-predicate", { subject: "hon", predicate: "furui" })).english).toBe("The book is old");
  });
  it("rejects unavailable grammar, outside vocabulary, missing predicates and wrong slots", () => {
    const structure = sentence("existence", { location: "ie", entity: "gakusei" });
    expect(codeOf(() => realizeSentence(structure, exampleLexicon, pool, []))).toBe("UNAVAILABLE_GRAMMAR");
    expect(codeOf(() => realizeSentence(structure, exampleLexicon, pool.filter(id => id !== sense("gakusei")), [...grammarIds]))).toBe("OUTSIDE_POOL");
    expect(codeOf(() => realizeSentence(structure, exampleLexicon, pool.filter(id => id !== sense("iru")), [...grammarIds]))).toBe("EXISTENCE_PREDICATE");
    expect(codeOf(() => realize({ ...structure, bindings: { ...structure.bindings, object: sense("hon") } }))).toBe("INVALID_BINDING");
    expect(codeOf(() => realize(sentence("motion", { subject: "gakusei", destination: "hon", verb: "iku" })))).toBe("INVALID_BINDING");
    expect(codeOf(() => realize(sentence("motion", { subject: "kouen", destination: "gakkou", verb: "iku" })))).toBe("INVALID_BINDING");
    expect(codeOf(() => realize(sentence("i-predicate", { subject: "ie", predicate: "kiree-na" })))).toBe("INVALID_BINDING");
  });
  it("preserves particle pronunciation and refuses unsupported sentence features", () => {
    const card = realize(sentence("action", { subject: "watashi", object: "hon", verb: "yomu" }));
    expect(card.tts[1]).toBe("わ");
    expect(card.tts[3]).toBe("お");
    expect(codeOf(() => realize({ ...card.derivation, features: { ...positive, tense: "future" as never } }))).toBe("UNSUPPORTED_FEATURES");
    expect(codeOf(() => realize({ ...card.derivation, features: { ...positive, register: "plain" } as Features }))).toBe("UNSUPPORTED_FEATURES");
    expect(codeOf(() => realize({ ...card.derivation, construction: "passive" as never }))).toBe("UNSUPPORTED_CONSTRUCTION");
  });
});

describe("one recipe engine for lessons and ad hoc reviews", () => {
  it.each(Object.entries(exampleRecipes))("generates deterministic aligned %s streams over many seeds", (_, recipe) => {
    const untouched = clone(recipe);
    for (let seed = 0; seed < 12; seed += 1) {
      const result = generateSession(recipe, exampleLexicon, seed);
      expect(result.cards).toHaveLength(recipe.phases.reduce((sum, phase) => sum + phase.count, 0));
      expect(result.transitions).toHaveLength(result.cards.length);
      for (const target of recipe.targetSenseIds) {
        expect(result.coverage[target]).toBeGreaterThanOrEqual(recipe.minTargetExposures);
        expect(result.coverage[target]).toBe(result.cards.filter(card => card.senseIds.includes(target)).length);
      }
      result.cards.forEach((card, index) => {
        expect(card.line).toEqual(card.tokens.map(token => token.surface));
        expect(card.tts).toEqual(card.tokens.map(token => token.reading));
        expect(card.explain).toEqual(card.tokens.map(token => token.explain));
        expect(card.english.endsWith(".")).toBe(false);
        if (result.transitions[index].kind === "substitution") {
          expect(changedSlots(result.cards[index - 1].derivation, card.derivation)).toHaveLength(1);
          expect(result.transitions[index].changedSlots).toHaveLength(1);
          expect(card.derivation.features).toEqual(result.cards[index - 1].derivation.features);
        } else if (result.transitions[index].kind === "phase") {
          expect(card.derivation.bindings).toEqual(result.cards[index - 1].derivation.bindings);
        }
      });
    }
    expect(recipe).toEqual(untouched);
    expect(generateSession(recipe, exampleLexicon, 42)).toEqual(generateSession(recipe, exampleLexicon, 42));
    expect(generateSession(recipe, exampleLexicon, 1).cards.map(card => card.id)).not.toEqual(generateSession(recipe, exampleLexicon, 42).cards.map(card => card.id));
  });
  it("runs review inputs through the identical snapshot/card contract", () => {
    const review = generateSession(exampleReviewRecipe(["yomu", "kaku"]), exampleLexicon, 8);
    expect(review.cards).toHaveLength(16);
    expect(review.coverage[sense("yomu")]).toBeGreaterThanOrEqual(3);
    expect(review.coverage[sense("kaku")]).toBeGreaterThanOrEqual(3);
    expect(review.cards.every(card => card.audioPolicy === "words")).toBe(true);
  });
  it("keeps snapshots self-contained, serializable and independent of caller mutation", () => {
    const recipe = clone(exampleRecipes.classroom);
    const snapshot = generateSession(recipe, exampleLexicon, 42);
    expect(clone(snapshot)).toEqual(snapshot);
    recipe.title = "changed";
    recipe.phases[0].features.polarity = "negative";
    expect(snapshot.recipe.title).toBe("Reading and writing");
    expect(snapshot.cards[0].derivation.features.polarity).toBe("positive");
    const reordered = { ...exampleRecipes.classroom, targetSenseIds: [...exampleRecipes.classroom.targetSenseIds].reverse() };
    expect(generateSession(reordered, { ...exampleLexicon, entries: [...exampleLexicon.entries].reverse() }, 42).cards).toEqual(snapshot.cards);
    const newLexicon = { ...exampleLexicon, version: `${exampleLexicon.version}-next` };
    expect(generateSession(exampleRecipes.classroom, newLexicon, 42).cards[0].id).not.toBe(snapshot.cards[0].id);
  });
  it("rejects pools that can only produce tautological identity sentences", () => {
    const recipe: Recipe = { ...exampleRecipes.classroom, targetSenseIds: [sense("gakusei")], helperSenseIds: [], knownGrammar: ["topic-wa", "copula-polite"], minTargetExposures: 1, phases: [{ id: "one", construction: "identity", features: positive, count: 1 }] };
    expect(codeOf(() => generateSession(recipe, exampleLexicon, 1))).toBe("NO_TARGET_CANDIDATES");
  });
  it("rejects inadequate coverage and premature grammar introductions", () => {
    const recipe = clone(exampleRecipes.classroom);
    recipe.phases[0].count = 1;
    expect(codeOf(() => generateSession(recipe, exampleLexicon, 1))).toBe("WARMUP_INCOMPLETE");
    expect(codeOf(() => generateSession({ ...exampleRecipes.classroom, minTargetExposures: 100 }, exampleLexicon, 1))).toBe("COVERAGE_SHORTFALL");
    expect(codeOf(() => generateSession({ ...exampleRecipes.classroom, knownGrammar: [] }, exampleLexicon, 1))).toBe("UNAVAILABLE_GRAMMAR");
  });
  it("fails explicitly for unknown/ambiguous words and metadata errors", () => {
    expect(codeOf(() => resolveWordPool(["unreviewed"], exampleLexicon))).toBe("UNKNOWN_WORD");
    expect(codeOf(() => resolveWordPool(["yomu"], { ...exampleLexicon, entries: [...exampleLexicon.entries, { ...lexicalVerb("yomu"), id: "yomu.other" }] }))).toBe("AMBIGUOUS_WORD");
    expect(codeOf(() => validateLexicon({ ...exampleLexicon, entries: [...exampleLexicon.entries, exampleLexicon.entries[0]] }))).toBe("LEXEME_METADATA");
    expect(codeOf(() => generateSession({ ...exampleRecipes.classroom, targetSenseIds: ["missing"] }, exampleLexicon, 1))).toBe("UNKNOWN_SENSE");
    expect(codeOf(() => generateSession({ ...exampleRecipes.classroom, targetSenseIds: [] }, exampleLexicon, 1))).toBe("INVALID_RECIPE");
    expect(codeOf(() => generateSession(exampleRecipes.classroom, exampleLexicon, -1))).toBe("INVALID_SEED");
    expect(codeOf(() => generateSession(exampleRecipes.classroom, exampleLexicon, NaN))).toBe("INVALID_SEED");
  });
  it("bounds large Cartesian pools before enumerating them", () => {
    const entries = [...Array.from({ length: 40 }, (_, index): Noun => ({ ...nounFixture(`noun-${index}`), level: "A1", roles: ["subject", "actor", "object", "entity"] })), ...Array.from({ length: 20 }, (_, index) => ({ ...lexicalVerb("yomu"), id: `verb-${index}` }))];
    const lexicon: Lexicon = { version: "test", entries };
    const recipe: Recipe = { ...exampleRecipes.classroom, targetSenseIds: [entries[0].id], helperSenseIds: entries.slice(1).map(entry => entry.id), phases: [exampleRecipes.classroom.phases[0]] };
    expect(codeOf(() => generateSession(recipe, lexicon, 1))).toBe("SEARCH_LIMIT");
    expect(codeOf(() => generateSession({ ...recipe, phases: [{ ...recipe.phases[0], count: LIMITS.totalCards + 1 }] }, lexicon, 1))).toBe("INVALID_RECIPE");
  });
  it("never silently drops targets or fills empty slots with guessed vocabulary", () => {
    const recipe: Recipe = { ...exampleRecipes.classroom, targetSenseIds: [sense("ii")], helperSenseIds: [sense("watashi"), sense("yomu"), sense("hon")], phases: [exampleRecipes.classroom.phases[0]] };
    expect(codeOf(() => generateSession(recipe, exampleLexicon, 1))).toBe("NO_TARGET_CANDIDATES");
    expect(codeOf(() => generateSession({ ...recipe, helperSenseIds: [sense("watashi"), sense("hon")] }, exampleLexicon, 1))).toBe("EMPTY_SLOT");
  });
  it("plans audio for realized words only, never a whole generated sentence", () => {
    const card = realize(sentence("action", { subject: "watashi", object: "nihongo", verb: "yomu" }, { ...positive, tense: "past" }));
    const plan = wordAudioPlan(card);
    expect(plan).toHaveLength(3);
    expect(plan[2]).toMatchObject({ wordId: "yomu", surface: "読みました", reading: "よみました", speech: "よみました", cacheKey: "読みました|よみました|よみました" });
    expect(plan.map(item => item.tokenIndex)).toEqual([0, 2, 4]);
    expect(card.audioRef).toBeUndefined();
    expect(plan.every(item => item.speech !== card.tts.join(""))).toBe(true);
  });
});
