import { describe, expect, it } from "vitest";
import { chooseTopicHelpers } from "../src/topic-helper-selection";
import { selectConnectedTopicWords } from "../src/topic-word-selection";
import { loadUnit, standardUnits } from "../src/curriculum";
import { a1CoreWordIdsForTopic, a1Topics, a1WordMetadata } from "../../../packages/dictionary/a1";
import type { TopicCandidate } from "../src/topic-sequence";

function candidate(targets: string[], unknown: string[], suffix = ""): TopicCandidate {
  const ids = [...targets, ...unknown];
  return { targets, unknown, card: { id: ids.join("-") + suffix, line: [...ids, suffix], tts: [...ids, suffix], explain: [...ids, suffix], english: ids.join(" ") + suffix,
    tokens: [...ids.map(wordId => ({ wordId, surface: wordId, reading: wordId, explain: wordId })), { surface: "です", reading: "です", explain: "is" }] } };
}
const covered = (cards: TopicCandidate[], helpers: string[]) => new Set(cards.filter(item => item.card.tokens.length > 1 && item.unknown.every(id => helpers.includes(id))).flatMap(item => item.targets));

describe("contextual helper selection", () => {
  it("reserves complete helper pairs and covers scarce targets instead of spending the allowance on early examples", () => {
    const cards = [candidate(["common"], ["early-one"]), candidate(["common"], ["early-two"]), candidate(["common"], ["early-three"]),
      candidate(["common", "second"], ["shared"]), candidate(["rare"], ["pair-one", "pair-two"]), candidate(["last"], ["last-helper"])];
    const before = JSON.stringify(cards);
    const result = chooseTopicHelpers(["common", "second", "rare", "last"], cards);
    expect(result.length).toBeLessThanOrEqual(6);
    expect(covered(cards, result)).toEqual(new Set(["common", "second", "rare", "last"]));
    expect(result).toEqual(expect.arrayContaining(["pair-one", "pair-two", "shared"]));
    expect(JSON.stringify(cards)).toBe(before);
    expect(chooseTopicHelpers(["common", "second", "rare", "last"], cards)).toEqual(result);
  });

  it("prefers scarce targets when the six-helper allowance cannot cover everything", () => {
    const targets = ["a", "b", "c", "d", "e", "f", "flexible"];
    const cards = targets.slice(0, 6).map(id => candidate([id], [`helper-${id}`]));
    for (let index = 0; index < 10; index += 1) cards.push(candidate(["flexible"], [`optional-${index}`]));
    const result = chooseTopicHelpers(targets, cards);
    expect(result).toHaveLength(6);
    expect(covered(cards, result)).toEqual(new Set(targets.slice(0, 6)));
  });

  it("does not count isolated word cards as contextual coverage or reintroduce known-word requirements", () => {
    const standalone = candidate(["isolated"], ["irrelevant"]);
    standalone.card.tokens = [standalone.card.tokens[0]];
    expect(chooseTopicHelpers(["isolated"], [standalone])).toEqual([]);
    const known = candidate(["known-context"], []);
    expect(chooseTopicHelpers(["known-context"], [known])).toEqual([]);
    expect(covered([known], [])).toEqual(new Set(["known-context"]));
  });

  it("supports every context-available target in initial topics within six helper concepts", async () => {
    const source = (await Promise.all(standardUnits.filter(unit => unit.id < 100).map(unit => loadUnit(unit.id)))).flatMap(unit => unit.cards);
    const started = performance.now();
    const results = a1Topics.map(topic => {
      const targets = selectConnectedTopicWords({ rankedNewWordIds: a1CoreWordIdsForTopic(topic.id), rankedReviewWordIds: [],
        newCount: 12, reviewCount: 0, priorityWordIds: [], cards: source });
      const cards = source.filter(card => card.tokens.length > 1).map(card => {
        const ids = [...new Set(card.tokens.flatMap(token => token.wordId ? [a1WordMetadata[token.wordId]?.coreWordId ?? token.wordId] : []))];
        return { card, targets: ids.filter(id => targets.includes(id)), unknown: ids.filter(id => !targets.includes(id)) };
      }).filter(item => item.targets.length && item.unknown.length <= 2);
      const helpers = chooseTopicHelpers(targets, cards);
      expect(helpers.length).toBeLessThanOrEqual(6);
      expect(helpers.every(id => cards.some(item => item.unknown.includes(id)))).toBe(true);
      const supported = covered(cards, helpers);
      const contextAvailable = new Set(cards.flatMap(item => item.targets));
      // Greetings intentionally contains complete authored one-token phrases.
      // Helpers cannot manufacture longer contexts for those phrases.
      if (topic.id !== "greetings") expect(contextAvailable.size).toBe(12);
      expect(supported).toEqual(contextAvailable);
      return { topic: topic.id, helpers, supported: supported.size };
    });
    if (import.meta.env.VITE_TOPIC_AUDIT_REPORT === "1") console.info("TOPIC_HELPERS", JSON.stringify({ milliseconds: performance.now() - started, results }));
  });
});
