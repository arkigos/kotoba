import { describe, expect, it } from "vitest";
import { dictionaryWord } from "../packages/dictionary";
import { grammarIds, realizeSentence, validateLexicon, type ConstructionId, type Features } from "../packages/learning-engine";
import { exampleLexicon } from "../packages/learning-engine/examples";
import { reviewedVocabulary } from "../packages/learning-engine/reviewed-vocabulary";

const entries = new Map(exampleLexicon.entries.map(entry => [entry.wordId, entry]));
const pool = exampleLexicon.entries.map(entry => entry.id);
const positive: Features = { tense: "nonpast", polarity: "positive", question: false };
function realize(construction: ConstructionId, bindings: Record<string, string>, features = positive) {
  return realizeSentence({ construction, bindings: Object.fromEntries(Object.entries(bindings).map(([slot, word]) => [slot, entries.get(word)!.id])), features }, exampleLexicon, pool, [...grammarIds]);
}

describe("expanded reviewed vocabulary", () => {
  it("retains canonical word identities and explicit reviewed metadata", () => {
    expect(reviewedVocabulary.length).toBeGreaterThan(150);
    expect(validateLexicon(exampleLexicon).size).toBe(exampleLexicon.entries.length);
    for (const entry of reviewedVocabulary) {
      const canonical = dictionaryWord(entry.wordId)!;
      expect(entry.dictionaryEntryId).toBe(canonical.dictionaryEntryId);
      expect(entry.level).toBe(canonical.level);
      expect(entry.lemma.surface).not.toMatch(/[／（）()]/);
    }
  });

  it("uses singular, plural, and first-person English independently of Japanese inflection", () => {
    expect(realize("action", { subject: "watashitachi", object: "juusu", verb: "nomu" }).english).toBe("We drink juice");
    expect(realize("i-predicate", { subject: "kutsu", predicate: "ookii" }).english).toBe("The shoes are big");
    expect(realize("action", { subject: "boku", object: "sushi", verb: "taberu" }, { ...positive, tense: "past" }).english).toBe("I ate sushi");
  });

  it("renders definite family members naturally in English location statements", () => {
    expect(realize("existence", { location: "nihon", entity: "chichi" }).english).toBe("My father is in Japan");
    expect(realize("existence", { location: "nihon", entity: "chichi" }, { ...positive, question: true }).english).toBe("Is my father in Japan?");
    expect(realize("existence", { location: "nihon", entity: "chichi" }, { ...positive, polarity: "negative", tense: "past" }).english).toBe("My father was not in Japan");
  });

  it("distinguishes garments used with 着る from footwear and blocks new nonsense pairings", () => {
    expect(realize("action", { subject: "anata", object: "shatsu", verb: "kiru" }).english).toBe("You wear the shirt");
    expect(() => realize("action", { subject: "anata", object: "kutsu", verb: "kiru" })).toThrow(/reviewed object/);
    expect(() => realize("action", { subject: "anata", object: "pantsu", verb: "kiru" })).toThrow(/reviewed object/);
    expect(() => realize("action", { subject: "boku", object: "haha", verb: "yomu" })).toThrow(/reviewed object/);
    expect(() => realize("action", { subject: "boku", object: "nihon", verb: "taberu" })).toThrow();
    expect(() => realize("i-predicate", { subject: "mizu", predicate: "ookii" })).toThrow(/reviewed subject/);
  });
});
