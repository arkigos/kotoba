import { dictionaryEntry } from "../../../packages/dictionary";
import { a1MetadataForWord, a1Topics } from "../../../packages/dictionary/a1";
import { builderLexicon } from "./generated";
import type { WordEntry } from "./types";

const reviewed = new Map(builderLexicon.entries.map(entry => [entry.wordId, entry]));
const labels: Record<string, string> = {
  person: "People", animal: "Animals", food: "Food", drink: "Drinks", text: "Reading material",
  writing: "Writing", language: "Languages", place: "Places", physical: "Physical objects", common: "Common word",
  n: "Noun", "n-pr": "Proper noun", pn: "Pronoun", prt: "Particle", num: "Number",
  "adj-i": "い-adjective", "adj-na": "な-adjective", "adj-ix": "いい / よい adjective",
  v1: "Ichidan verb", vt: "Transitive verb", vi: "Intransitive verb", adv: "Adverb", exp: "Expression",
};

export function metadataLabel(tag: string, dictionaryLabels: Record<string, string> = {}) {
  return tag === "core-a1" ? "Core A1" : a1Topics.find(topic => `topic:${topic.id}` === tag)?.title ?? dictionaryLabels[tag] ?? labels[tag] ?? tag.replaceAll("-", " ");
}

/** Imported tags are display/search metadata only. They never enable generation. */
export function wordMetadata(word: WordEntry) {
  const entry = dictionaryEntry(word.id);
  const senses = entry?.senses.filter(sense => !word.dictionarySenseIds?.length || word.dictionarySenseIds.includes(sense.id)) ?? [];
  const parts = [...new Set(senses.flatMap(sense => sense.partsOfSpeech))];
  const kinds = [...new Set(parts.flatMap(part => {
    if (part === "n" || part.startsWith("n-")) return ["Nouns"];
    if (part === "pn") return ["Pronouns"];
    if (part.startsWith("v")) return ["Verbs"];
    if (part.startsWith("adj")) return ["Adjectives"];
    if (part.startsWith("adv")) return ["Adverbs"];
    if (part === "prt") return ["Particles"];
    if (part === "num" || part === "ctr") return ["Numbers & counters"];
    if (part === "exp" || part === "int") return ["Expressions"];
    return [];
  }))];
  const lexeme = reviewed.get(word.id);
  const semantics = lexeme?.kind === "noun" ? lexeme.semanticTags ?? [] : [];
  const placement = a1MetadataForWord(word.id);
  if (!kinds.length && lexeme) kinds.push(lexeme.kind === "noun" ? "Nouns" : lexeme.kind === "verb" ? "Verbs" : "Adjectives");
  return {
    kinds: kinds.length ? kinds : ["Other"],
    tags: [...new Set([...parts, ...semantics, ...(placement?.core ? ["core-a1"] : []), ...(placement?.topicIds.map(id => `topic:${id}`) ?? []), ...(entry?.common ? ["common"] : []), ...senses.flatMap(sense => [...(sense.fields ?? []), ...(sense.misc ?? [])])])],
    common: entry?.common ?? false,
  };
}
