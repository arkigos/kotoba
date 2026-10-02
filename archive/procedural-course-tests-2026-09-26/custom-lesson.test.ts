import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { a1WordMetadata } from "../../../packages/dictionary/a1";
import { dictionaryWord, type DictionaryEntry } from "../../../packages/dictionary";
import { buildCustomLesson } from "../src/custom-lesson";
import { prepareSession, resolveSessionCard } from "../src/generated";
import { readState } from "../src/state";

const reference: DictionaryEntry = { id: "jmdict:900007001", headword: "専門用語", reading: "せんもんようご", spellings: ["専門用語"], readings: ["せんもんようご"], common: false, source: "jmdict",
  senses: [{ id: "jmdict:900007001:sense:1", glosses: ["specialist terminology"], partsOfSpeech: ["n"] }] };
const canonical = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;

describe("custom word lessons", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ [reference.id]: reference }) })));
  });

  it("rejects a count that needs unlicensed country filler and builds a feasible eighteen-card lesson", async () => {
    const ids = ["enjinia", "kuni", "sumu", "kaishain", "nihon", "hataraku"];
    const state = readState();
    const before = JSON.stringify(state);
    expect((await buildCustomLesson(state, ids, {cardCount:12})).session.items.length).toBeLessThanOrEqual(12);
    const result = await buildCustomLesson(state, ids, { cardCount: 18, title: "At work" });
    expect(result.session.targetWordIds).toEqual(ids);
    expect(result.session.items.length).toBeLessThanOrEqual(18);
    expect(()=>assertLessonCardQuality(result.session.savedCards!)).not.toThrow();
    expect(result.contextCount).toBeGreaterThan(0);
    expect(new Set(result.session.savedCards!.map(card => JSON.stringify([card.line, card.english]))).size).toBeGreaterThanOrEqual(4);
    expect(result.session.title).toBe("At work");
    const actual = Object.fromEntries(ids.map(id => [id, 0]));
    result.session.savedCards!.forEach(card => new Set(card.tokens.flatMap(token => token.wordId ? [canonical(token.wordId)] : [])).forEach(id => { if (id in actual) actual[id] += 1; }));
    expect(actual).toEqual(result.appearances);
    expect(Math.min(...Object.values(actual))).toBeGreaterThanOrEqual(1);
    expect(result.session.lessonPlan!.transitions).toHaveLength(result.session.items.length);
    expect(JSON.stringify(state)).toBe(before);
  });

  it("fails closed for unsupported reference entries without dropping them", async () => {
    await expect(buildCustomLesson(readState(),["hon",reference.id])).rejects.toThrow(/No supported sentence context/);
    expect(readState().wordHistory).toEqual({});
  });

  it("rejects two explicit alias identities when they require the same sentence", async () => {
    await expect(buildCustomLesson(readState(),["iku","ikimasu"])).rejects.toThrow(/No supported sentence context/);
  });

  it("rejects unsupported selections and silent truncation", async () => {
    await expect(buildCustomLesson(readState(),[reference.id],{cardCount:6})).rejects.toThrow(/One-word/);
    await expect(buildCustomLesson(readState(), [])).rejects.toThrow(/between 1 and 30/);
    await expect(buildCustomLesson(readState(), Array.from({ length: 31 }, (_, index) => `word-${index}`))).rejects.toThrow(/between 1 and 30/);
  });
});
