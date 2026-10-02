import { describe, expect, it } from "vitest";
import { repairStarterContent, starterTeachingCorrections } from "../scripts/lib/starter-content-quality.mjs";

const words = [
  { id: "tokee", surface: "とけい", reading: "とけい", meaning: "clock", function: "adjective" },
  { id: "watashi", surface: "私", reading: "わたし", meaning: "I", function: "person" },
  { id: "koohii", surface: "コーヒー", reading: "こーひー", meaning: "coffee", function: "noun" },
  { id: "kaimonoshimasu", surface: "かいものします", reading: "かいものします", meaning: "do shopping", function: "verb" },
  { id: "kazoku", surface: "家族", reading: "かぞく", meaning: "family", function: "person" },
  { id: "suki-na", surface: "すき（な）", reading: "すき（な）", meaning: "like/favorite", function: "adjective" },
];
const token = id => { const word = words.find(word => word.id === id); return { wordId: id, surface: word.surface, reading: word.reading, explain: word.meaning }; };
const wa = { surface: "は", reading: "わ", explain: "topic marker" };
const desu = { surface: "です", reading: "です", explain: "ending" };
const card = (tokens, english) => ({ id: "u032-c005", tokens, line: tokens.map(t => t.surface), tts: tokens.map(t => t.reading), explain: tokens.map(t => t.explain), english, audioRef: "stale.mp3", grammarTags: [] });
const repair = before => repairStarterContent({ id: 32, grammarFocus: "review", cards: [before] }, words).cards[0];
describe("deterministic curriculum content repair", () => {
  it("classifies clock explicitly as a noun and replaces invalid adjective use", () => {
    expect(starterTeachingCorrections.tokee.function).toBe("noun");
    const after = repair(card([token("koohii"), wa, token("tokee"), desu], "The coffee is clock"));
    expect(after.line.join("")).toBe("私のとけいです");
    expect(after.english).toBe("It is my clock");
    expect(after.id).toBe("u032-c005");
    expect(after.audioRef).toBeUndefined();
    expect(repair(after)).toEqual(after);
  });
  it("realizes liking with ga and a clean predicate instead of dictionary notation", () => {
    const after = repair(card([token("koohii"), wa, token("suki-na"), desu], "The coffee is like/favorite"));
    expect(after.line.join("")).toBe("コーヒーがすきです");
    expect(after.tts.join("")).toBe("こーひーがすきです");
    expect(after.english).toBe("I like coffee");
  });
  it("inflects the shopping phrase in English at the verb, not the final noun", () => {
    expect(repair(card([token("kazoku"), wa, token("kaimonoshimasu")], "The family do shoppings")).english).toBe("The family goes shopping");
    expect(repair(card([token("watashi"), wa, token("kaimonoshimasu")], "I do shopping")).english).toBe("I go shopping");
  });
});
