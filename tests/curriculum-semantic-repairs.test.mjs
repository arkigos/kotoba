import { describe, expect, it } from "vitest";
import { repairStarterUnit, reviewedSelectableObject } from "../scripts/lib/starter-semantic-repairs.mjs";

const words = [
  ["gakusei", "学生", "がくせい", "student", "person"],
  ["watashi", "私", "わたし", "I", "person"],
  ["shatsu", "シャツ", "しゃつ", "shirt", "noun"],
  ["eki", "駅", "えき", "station", "place"],
  ["kiiro", "黄色", "きいろ", "yellow", "noun"],
  ["migi", "右", "みぎ", "right", "adverb"],
  ["erabu", "選ぶ", "えらぶ", "choose", "verb"],
].map(([id, surface, reading, meaning, fn]) => ({ id, surface, reading, meaning, function: fn }));
const lexical = id => { const word = words.find(word => word.id === id); return { surface: word.surface, reading: word.reading, explain: word.meaning, wordId: id }; };
const card = (tokens, english, extra = {}) => ({ id: "u045-c019", tokens, line: tokens.map(token => token.surface), tts: tokens.map(token => token.reading), explain: tokens.map(token => token.explain), english, grammarTags: ["cumulative review"], ...extra });
const unit = card => ({ id: 45, cards: [card] });

describe("reviewed legacy sentence contexts", () => {
  it("attaches a color to an actual object in both languages without changing the card ID", () => {
    const before = card([lexical("gakusei"), { surface: "は", reading: "わ", explain: "topic" }, lexical("kiiro"), { surface: "を", reading: "を", explain: "object" }, { ...lexical("erabu"), surface: "選びます", reading: "えらびます" }], "The student chooses the yellow", { audioRef: "/stale-sentence.mp3", audioText: "wrong sentence" });
    const result = repairStarterUnit(unit(before), words);
    const after = result.unit.cards[0];
    expect(after.id).toBe(before.id);
    expect(after.line.join("")).toBe("学生は黄色のシャツを選びます");
    expect(after.english).toBe("The student chooses the yellow shirt");
    expect(after.audioRef).toBeUndefined();
    expect(after.audioText).toBeUndefined();
    expect(after.tts).toEqual(after.tokens.map(token => token.reading));
    expect(result.repaired).toBe(1);
  });
  it("puts an isolated direction into a location sentence", () => {
    const result = repairStarterUnit(unit(card([lexical("migi")], "Right")), words);
    expect(result.unit.cards[0].line.join("")).toBe("駅は右です");
    expect(result.unit.cards[0].english).toBe("The station is on the right");
  });
  it("does not infer choose/show eligibility from noun or proper labels", () => {
    expect(reviewedSelectableObject({ id: "kiiro", function: "noun" })).toBe(false);
    expect(reviewedSelectableObject({ id: "unreviewed", function: "noun" })).toBe(false);
    expect(reviewedSelectableObject({ id: "tookyoo", function: "proper" })).toBe(false);
    expect(reviewedSelectableObject({ id: "isu", function: "noun" })).toBe(true);
  });
  it("does not introduce helpers that are absent from the unit's allowed vocabulary", () => {
    const before = unit(card([lexical("migi")], "Right"));
    expect(repairStarterUnit(before, words.filter(word => word.id !== "eki")).unit).toEqual(before);
  });
  it("leaves already repaired content unchanged on another authoring pass", () => {
    const repaired = repairStarterUnit(unit(card([lexical("migi")], "Right")), words).unit;
    expect(repairStarterUnit(repaired, words)).toMatchObject({ unit: repaired, repaired: 0, changes: [] });
  });
  it("uses different known lexical contexts when repeated review targets would duplicate a sentence", () => {
    const school = { id: "gakkou", surface: "学校", reading: "がっこう", meaning: "school", function: "place" };
    const first = card([lexical("migi")], "Right");
    const repeated = { ...first, id: "u045-c020" };
    const before = { id: 45, cards: [first, repeated] };
    const result = repairStarterUnit(before, [...words, school]).unit;
    expect(result.cards.map(card => card.id)).toEqual(before.cards.map(card => card.id));
    expect(new Set(result.cards.map(card => card.line.join(""))).size).toBe(2);
    expect(result.cards.every(card => card.tokens.some(token => token.wordId === "migi"))).toBe(true);
  });
  it("keeps an unseen current-unit word out of another word's first context", () => {
    const extra = [
      { id: "hako", surface: "箱", reading: "はこ", meaning: "box", function: "noun" },
      { id: "naka", surface: "中", reading: "なか", meaning: "inside", function: "adverb" },
      { id: "kasa", surface: "傘", reading: "かさ", meaning: "umbrella", function: "noun" },
      { id: "ie", surface: "家", reading: "いえ", meaning: "house", function: "place" },
    ];
    const part = id => { const word = extra.find(word => word.id === id); return { surface: word.surface, reading: word.reading, explain: word.meaning, wordId: id }; };
    const before = card([part("kasa"), { surface: "は", reading: "わ", explain: "topic" }, part("hako"), { surface: "の", reading: "の", explain: "modifier" }, part("naka"), { surface: "です", reading: "です", explain: "ending" }], "The umbrella is inside the box", { grammarTags: ["reviewed context"] });
    const result = repairStarterUnit({ id: 32, newWords: extra.slice(0, 2), cards: [before] }, [...words, ...extra]);
    expect(result.unit.cards[0].line.join("")).toBe("傘は家の中です");
    expect(result.unit.cards[0].tokens.some(token => token.wordId === "naka")).toBe(true);
    expect(result.unit.cards[0].tokens.some(token => token.wordId === "hako")).toBe(false);
  });
});
