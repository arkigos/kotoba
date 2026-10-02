import { describe, expect, it } from "vitest";
import { a1WordMetadata } from "../../../packages/dictionary/a1";
import { dictionaryWord } from "../../../packages/dictionary";
import { loadUnit, standardUnits } from "../src/curriculum";
import { findTopicCoverage } from "../src/topic-coverage";
import { sequenceTopicCards, type TopicCandidate } from "../src/topic-sequence";
import type { PracticeCard } from "../src/types";

const canonical = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;
const cardWords = (card: PracticeCard) => [...new Set(card.tokens.flatMap(token => token.wordId ? [canonical(token.wordId)] : []))];
function wordCandidate(id: string, unknown: string[] = []): TopicCandidate {
  const word = dictionaryWord(id)!;
  const token = { wordId: id, surface: word.surface, reading: word.reading, explain: word.meaning };
  return { card: { id: `word-${id}`, tokens: [token], line: [token.surface], tts: [token.reading], explain: [token.explain], english: token.explain }, targets: [id], unknown };
}
function countsFor(targets: string[], result: TopicCandidate[]) {
  const counts = Object.fromEntries(targets.map(id => [id, 0]));
  result.forEach(candidate => new Set(candidate.targets).forEach(id => { if (id in counts) counts[id] += 1; }));
  return counts;
}

describe("bounded topic coverage fallback", () => {
  it("fits a real twelve-card greetings selection that local greedy variants overestimate", async () => {
    const targets = ["enjinia", "kuni", "sumu", "kaishain", "nihon", "hataraku"];
    const units = await Promise.all(standardUnits.filter(unit => unit.id < 100).map(unit => loadUnit(unit.id)));
    const sourceCards = [...new Map(units.flatMap(unit => unit.cards).filter(card => card.tokens.length > 1)
      .map(card => [JSON.stringify([card.tokens, card.english]), card])).values()];
    const candidates = sourceCards.map(card => ({ card,
      targets: cardWords(card).filter(id => targets.includes(id)),
      unknown: cardWords(card).filter(id => !targets.includes(id)),
    })).filter(candidate => candidate.targets.length && candidate.unknown.length <= 2);
    candidates.push(...targets.map(id => wordCandidate(id)));
    // These two reviewed sentences alone construct a fit: six copies of each
    // give every target six appearances, with no supporting vocabulary.
    const engineer = candidates.find(candidate => candidate.card.id === "u002-c013")!;
    const employee = candidates.find(candidate => candidate.card.id === "u002-c067")!;
    expect(engineer.targets).toEqual(targets.slice(0, 3));
    expect(employee.targets).toEqual(targets.slice(3));
    expect([...engineer.unknown, ...employee.unknown]).toEqual([]);
    const before = JSON.stringify(candidates);
    const result = findTopicCoverage(targets, candidates, 6, 12)!;
    expect(result).toBeDefined();
    expect(result.length).toBeLessThanOrEqual(12);
    expect(Math.min(...Object.values(countsFor(targets, result)))).toBeGreaterThanOrEqual(6);
    expect(Math.max(...Object.values(countsFor(targets, result)))).toBeLessThanOrEqual(10);
    expect(new Set(result.flatMap(candidate => candidate.unknown)).size).toBeLessThanOrEqual(6);
    expect(result.every(candidate => candidates.includes(candidate))).toBe(true);
    expect(JSON.stringify(candidates)).toBe(before);
    expect(findTopicCoverage(targets, candidates, 6, 11)).toBeUndefined();
    const lesson = sequenceTopicCards(targets, candidates, { cardCount: 12 });
    expect(lesson.cards.length).toBeLessThanOrEqual(12);
    expect(Object.values(lesson.appearances).every(count=>count>=1)).toBe(true);
    expect(lesson.steps).toHaveLength(lesson.cards.length);
    const actual = Object.fromEntries(targets.map(id => [id, 0]));
    lesson.cards.forEach(card => cardWords(card).forEach(id => { if (id in actual) actual[id] += 1; }));
    expect(lesson.appearances).toEqual(actual);
  });

  it("rejects insufficient isolated-word slots and counts each target once per card", () => {
    const hon = wordCandidate("hon");
    const isu = wordCandidate("isu");
    expect(findTopicCoverage(["hon", "isu"], [hon, isu], 6, 11)).toBeUndefined();
    expect(findTopicCoverage(["hon"], [{ ...hon, targets: ["hon", "hon"] }], 6, 3)).toBeUndefined();
  });

  it("respects the upper exposure cap when a shared hub is unavoidable", () => {
    const first = { ...wordCandidate("hon"), targets: ["hon", "isu"] };
    const second = { ...wordCandidate("heya"), targets: ["heya", "isu"] };
    // Six appearances each of hon/heya force twelve isu appearances, beyond ten.
    expect(findTopicCoverage(["hon", "isu", "heya"], [first, second], 6, 12)).toBeUndefined();
  });

  it("can select a shared helper set and rejects incompatible helper unions", () => {
    const first = wordCandidate("hon", ["a", "b", "c", "d"]);
    const conflicting = wordCandidate("isu", ["e", "f", "g"]);
    const compatible = wordCandidate("isu", ["a", "b"]);
    expect(findTopicCoverage(["hon", "isu"], [first, conflicting], 6, 12)).toBeUndefined();
    const result = findTopicCoverage(["hon", "isu"], [first, conflicting, compatible], 6, 12)!;
    expect(result).toHaveLength(12);
    expect(result.includes(conflicting)).toBe(false);
    expect(countsFor(["hon", "isu"], result)).toEqual({ hon: 6, isu: 6 });
  });
});
