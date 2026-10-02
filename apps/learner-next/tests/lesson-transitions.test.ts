import { describe, expect, it } from "vitest";
import { cardFrame, measureCardTransition } from "../src/lesson-transitions";
import type { CardToken, PracticeCard } from "../src/types";
import type { Sentence } from "../../../packages/learning-engine/types";

const token = (wordId: string | undefined, surface: string, reading = surface): CardToken => ({ wordId, surface, reading, explain: surface });
const card = (...tokens: CardToken[]): PracticeCard => ({ id: "fixture", tokens, line: tokens.map(t => t.surface), tts: tokens.map(t => t.reading), explain: tokens.map(t => t.explain), english: "Fixture" });
const watashi = token("watashi", "私", "わたし");
const anata = token("anata", "あなた");
const wa = token(undefined, "は", "わ");
const wo = token(undefined, "を", "お");
const hon = token("hon", "本", "ほん");
const shimbun = token("shinbun", "新聞", "しんぶん");
const yomu = token("yomu", "読みます", "よみます");
const kaku = token("kaku", "書きます", "かきます");

describe("lesson transitions", () => {
  it("retains construction boundaries after stripping full derivations for storage", () => {
    const adjective = { ...card(token("eki", "駅"), wa, token("chikai", "近い"), token(undefined, "です")), constructionKey: "i-predicate" };
    const category = { ...card(token("nihon", "日本"), wa, token("kuni", "国"), token(undefined, "です")), constructionKey: "identity" };
    expect(measureCardTransition(adjective, JSON.parse(JSON.stringify(category)))).toMatchObject({ kind: "boundary", grammarChanged: true });
    expect(cardFrame(adjective)).not.toBe(cardFrame(category));
  });
  it("groups frozen scaffolds and counts one or two changed positions", () => {
    const first = card(watashi, wa, hon, wo, yomu);
    const one = card(anata, wa, hon, wo, yomu);
    const two = card(anata, wa, shimbun, wo, yomu);
    expect(cardFrame(first)).toBe(cardFrame(two));
    expect(measureCardTransition(first, one)).toMatchObject({ kind: "neighbor", lexicalChanges: 1, changedTokenIndices: [0], grammarChanged: false, basis: "tokens" });
    expect(measureCardTransition(first, two)).toMatchObject({ kind: "neighbor", lexicalChanges: 2, changedTokenIndices: [0, 2] });
    expect(measureCardTransition(first, card(anata, wa, shimbun, wo, kaku))).toMatchObject({ kind: "boundary", lexicalChanges: 3, grammarChanged: false });
  });

  it("counts swapped and repeated word positions rather than word sets", () => {
    expect(measureCardTransition(card(watashi, wa, anata), card(anata, wa, watashi)))
      .toMatchObject({ kind: "neighbor", lexicalChanges: 2, changedTokenIndices: [0, 2] });
    expect(measureCardTransition(card(hon, wa, hon), card(shimbun, wa, shimbun)))
      .toMatchObject({ kind: "neighbor", lexicalChanges: 2 });
  });

  it("marks changed particles and inserted question endings as boundaries", () => {
    const first = card(watashi, wa, hon, wo, yomu);
    expect(measureCardTransition(first, card(watashi, token(undefined, "が"), hon, wo, yomu)))
      .toMatchObject({ kind: "boundary", grammarChanged: true, lexicalChanges: 0 });
    expect(measureCardTransition(first, card(...first.tokens, token(undefined, "か"))))
      .toMatchObject({ kind: "boundary", grammarChanged: true });
  });

  it("does not normalize away same-ID inflections or authored lemma aliases", () => {
    expect(measureCardTransition(card(yomu), card(token("yomu", "読みました", "よみました"))))
      .toMatchObject({ kind: "boundary", grammarChanged: true, lexicalChanges: 1 });
    expect(measureCardTransition(card(token("iku", "行く", "いく")), card(token("ikimasu", "行きます", "いきます"))))
      .toMatchObject({ kind: "boundary", grammarChanged: true });
  });

  it("recognizes the same visible card regardless of alias metadata", () => {
    expect(measureCardTransition(card(token("iku", "行きます", "いきます")), card(token("ikimasu", "行きます", "いきます"))))
      .toMatchObject({ kind: "repeat", lexicalChanges: 0, changedTokenIndices: [] });
  });

  it("does not call unrelated standalone vocabulary a sentence substitution", () => {
    const a = token("jmdict:unknown-a", "甲", "こう");
    const b = token("jmdict:unknown-b", "乙", "おつ");
    expect(measureCardTransition(card(a), card(b))).toMatchObject({ kind: "boundary", lexicalChanges: 1, basis: "tokens" });
    expect(measureCardTransition(card(token("doko", "どこ")), card(token("dochira-kara", "どちらから？")))).toMatchObject({ kind: "boundary" });
    expect(measureCardTransition(card(a, wa), card(b, wa))).toMatchObject({ kind: "boundary", grammarChanged: true });
    expect(measureCardTransition(card(), card())).toMatchObject({ kind: "boundary" });
  });

  it("uses reviewed independent slots for dependent existence predicates", () => {
    const derivation = (entity: string): Sentence => ({ construction: "existence", bindings: { location: "heya.default", entity }, features: { tense: "nonpast", polarity: "positive", question: false } });
    const first = { ...card(token("neko", "猫", "ねこ"), token(undefined, "が"), token("iru", "います")), derivation: derivation("neko.default") };
    const next = { ...card(hon, token(undefined, "が"), token("aru", "あります")), derivation: derivation("hon.default") };
    expect(measureCardTransition(first, next)).toMatchObject({ kind: "neighbor", lexicalChanges: 1, changedTokenIndices: [0, 2], basis: "slots" });
    expect(measureCardTransition(first, { ...next, derivation: { ...next.derivation, features: { ...next.derivation.features, tense: "past" } } }))
      .toMatchObject({ kind: "boundary", grammarChanged: true, lexicalChanges: 1, basis: "slots" });
  });
});
