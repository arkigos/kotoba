import { assertLessonCardQuality } from "../src/lesson-card-quality";
import { describe, expect, it } from "vitest";
import { dictionaryWord } from "../../../packages/dictionary";
import { measureCardTransition } from "../src/lesson-transitions";
import { sequenceTopicCards, type TopicCandidate } from "../src/topic-sequence";

// Exact, natural noun/adjective cards form a reviewed test grid. Every sentence
// carries two targets; one noun or adjective can remain through several steps.
const nouns = ["hon", "isu", "kuruma", "jitensha", "ie", "heya"];
const adjectives = ["ookii", "chiisai", "atarashii", "furui", "takai", "yasui"];
function word(id: string) { const value = dictionaryWord(id)!; return { wordId: id, surface: value.surface, reading: value.reading, explain: value.meaning }; }
function grid(): TopicCandidate[] {
  const cards = nouns.flatMap(noun => adjectives.map(adjective => {
    const tokens = [word(noun), { surface: "は", reading: "わ", explain: "topic" }, word(adjective), { surface: "です", reading: "です", explain: "polite" }];
    return { card: { id: `${noun}-${adjective}`, tokens, line: tokens.map(token => token.surface), tts: tokens.map(token => token.reading), explain: tokens.map(token => token.explain), english: `${dictionaryWord(noun)!.meaning}: ${dictionaryWord(adjective)!.meaning}`, grammarTags: ["adjective predicate"] }, targets: [noun, adjective], unknown: [] };
  }));
  return [...cards, ...[...nouns, ...adjectives].map(id => { const token = word(id); return { card: { id, tokens: [token], line: [token.surface], tts: [token.reading], explain: [token.explain], english: token.explain, grammarTags: [] }, targets: [id], unknown: [] }; })];
}

describe("target-density and small-change topic sequencing", () => {
  it("fits all targets into unique bounded sentences with honest appearance counts", () => {
    const ids = [...nouns, ...adjectives];
    const result = sequenceTopicCards(ids, grid());
    expect(result.cards.length).toBeLessThanOrEqual(54);
    expect(result.cards.length).toBeGreaterThanOrEqual(1);
    expect(Math.min(...Object.values(result.appearances))).toBeGreaterThanOrEqual(1);
    expect(Math.max(...Object.values(result.appearances)) - Math.min(...Object.values(result.appearances))).toBeLessThanOrEqual(4);
    expect(result.pacing.targetDensity).toBeGreaterThan(1.7);
    // Spaced revisits take precedence over clustering every matching frame.
    expect(()=>assertLessonCardQuality(result.cards)).not.toThrow();
    const counts = Object.fromEntries(ids.map(id => [id, 0]));
    for (const card of result.cards) for (const id of new Set(card.tokens.flatMap(token => token.wordId && ids.includes(token.wordId) ? [token.wordId] : []))) counts[id] += 1;
    expect(counts).toEqual(result.appearances);
    result.steps.slice(1).forEach((step, index) => {
      const measured = measureCardTransition(result.cards[index], result.cards[index + 1]);
      expect(step.kind).toBe(measured.kind);
      if (step.kind === "neighbor") expect([1, 2]).toContain(step.lexicalChanges);
    });
  });

  it("treats a custom count as a ceiling and rejects omission of targets", () => {
    const ids = [...nouns, ...adjectives];
    const shortened = sequenceTopicCards(ids, grid(), { cardCount: 42 });
    expect(shortened.cards.length).toBeLessThanOrEqual(24);
    expect(Math.min(...Object.values(shortened.appearances))).toBeGreaterThanOrEqual(1);
    expect(() => sequenceTopicCards(ids, grid(), { cardCount: 1 })).toThrow(/Not every selected word/);
  });

  it("rejects a requested size beyond the hard cap", () => {
    expect(()=>sequenceTopicCards([...nouns,...adjectives],grid(),{cardCount:49})).toThrow(/between 1 and 48/);
  });

  it("rejects isolated word pools instead of filling them with repetitions", () => {
    expect(()=>sequenceTopicCards([...nouns,...adjectives],grid().filter(row=>row.targets.length===1))).toThrow(/One-word/);
  });
});
