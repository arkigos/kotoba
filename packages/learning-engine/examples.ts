import { dictionaryWord } from "../dictionary";
import { resolveWordPool } from "./sequence";
import type { Adjective, Features, Lexicon, Noun, Recipe, SemanticTag, Verb } from "./types";
import { reviewedVocabulary } from "./reviewed-vocabulary";

// Sense-specific affordances, reviewed independently of dictionary POS labels.
const nounTags: Record<string, SemanticTag[]> = {
  watashi: ["person"], anata: ["person"], gakusei: ["person"], sensei: ["person"], tomodachi: ["person"], kodomo: ["person"],
  hon: ["physical", "countable", "text", "writing"], shinbun: ["physical", "countable", "text"],
  mizu: ["physical", "drink"], ocha: ["physical", "drink"], koohii: ["physical", "drink"], gyuunyuu: ["physical", "drink"],
  pan: ["physical", "food"], gohan: ["physical", "food"], tamago: ["physical", "food"], niku: ["physical", "food"], kudamono: ["physical", "food"], yasai: ["physical", "food"],
  isu: ["physical", "countable"], terebi: ["physical", "countable"],
  nihongo: ["language", "text", "writing"], eigo: ["language", "text", "writing"], hiragana: ["text", "writing"], kanji: ["text", "writing"],
  gakkou: ["place"], kouen: ["place"], ie: ["place"], eki: ["place"], mise: ["place"], heya: ["place"], byouin: ["place"], resutoran: ["place"],
};
const verbObjectTags: Record<string, SemanticTag[]> = { yomu: ["text"], kaku: ["writing"], nomu: ["drink"], taberu: ["food"] };

// Reviewed metadata overlay: the legacy display/category fields are not used to
// infer grammar. wordId continues to address the existing learner vocabulary.
function base(wordId: string, sense: string, surface?: string, reading?: string) {
  const word = dictionaryWord(wordId);
  if (!word) throw new Error(`Example overlay references missing curriculum word ${wordId}`);
  if (word.level !== "A1") throw new Error(`Reviewed pilot word ${wordId} needs A1 placement.`);
  return { id: `${wordId}.${sense}`, wordId, dictionaryEntryId: word.dictionaryEntryId, level: word.level, lemma: { surface: surface ?? word.surface, reading: reading ?? word.reading }, meaning: word.meaning };
}
function noun(wordId: string, roles: Noun["roles"], english: Noun["english"], existence?: Noun["existence"]): Noun {
  if (!nounTags[wordId]) throw new Error(`Reviewed noun ${wordId} needs semantic properties.`);
  return { ...base(wordId, "default"), kind: "noun", roles, semanticTags: nounTags[wordId], english, ...(existence ? { existence } : {}) };
}
function verb(wordId: string, conjugation: Verb["conjugation"], frames: Verb["frames"], english: Verb["english"], exception?: Verb["exception"]): Verb {
  return { ...base(wordId, "default"), kind: "verb", conjugation, frames, english, ...(verbObjectTags[wordId] ? { objectTags: verbObjectTags[wordId] } : {}), ...(exception ? { exception } : {}) };
}
const personRoles: Noun["roles"] = ["subject", "actor", "identity", "object", "entity"];
const objectRoles: Noun["roles"] = ["subject", "identity", "object", "entity"];
function commonNoun(wordId: string, phrase: string, predicate: string, existentialNegative: string, existence: Noun["existence"] = "inanimate"): Noun {
  return noun(wordId, existence === "animate" ? personRoles : objectRoles, { subject: phrase, object: phrase, predicate, agreement: "third-singular", existential: predicate, existentialNegative }, existence);
}

export const exampleLexicon: Lexicon = {
  version: "dictionary-4-reviewed-expansion",
  entries: [
    noun("watashi", ["subject", "actor", "object"], { subject: "I", object: "me", predicate: "me", agreement: "first-singular" }),
    noun("anata", ["subject", "actor", "object"], { subject: "you", object: "you", predicate: "you", agreement: "other" }),
    commonNoun("gakusei", "the student", "a student", "no student", "animate"),
    commonNoun("sensei", "the teacher", "a teacher", "no teacher", "animate"),
    commonNoun("tomodachi", "the friend", "a friend", "no friend", "animate"),
    commonNoun("kodomo", "the child", "a child", "no child", "animate"),
    commonNoun("hon", "the book", "a book", "no book"),
    commonNoun("mizu", "water", "water", "no water"),
    commonNoun("ocha", "tea", "tea", "no tea"),
    commonNoun("koohii", "coffee", "coffee", "no coffee"),
    commonNoun("gyuunyuu", "milk", "milk", "no milk"),
    commonNoun("pan", "bread", "bread", "no bread"),
    { ...commonNoun("gohan", "rice", "rice", "no rice"), id: "gohan.rice", meaning: "rice" },
    commonNoun("tamago", "the egg", "an egg", "no egg"),
    commonNoun("niku", "meat", "meat", "no meat"),
    commonNoun("kudamono", "fruit", "fruit", "no fruit"),
    noun("yasai", objectRoles, { subject: "the vegetables", object: "vegetables", predicate: "vegetables", agreement: "other", existential: "vegetables", existentialNegative: "no vegetables" }, "inanimate"),
    commonNoun("isu", "the chair", "a chair", "no chair"),
    commonNoun("shinbun", "the newspaper", "a newspaper", "no newspaper"),
    commonNoun("terebi", "the television", "a television", "no television"),
    ...[["nihongo", "Japanese"], ["eigo", "English"], ["hiragana", "hiragana"], ["kanji", "kanji"]].map(([id, english]) =>
      noun(id, ["object", "identity"], { subject: english, object: english, predicate: english, agreement: "third-singular" })),
    noun("gakkou", ["place", "subject", "identity"], { subject: "the school", object: "the school", predicate: "a school", agreement: "third-singular", location: "at the school" }),
    noun("kouen", ["place", "subject", "identity"], { subject: "the park", object: "the park", predicate: "a park", agreement: "third-singular", location: "in the park" }),
    noun("ie", ["place", "subject", "identity"], { subject: "the house", object: "the house", predicate: "a house", agreement: "third-singular", location: "in the house" }),
    noun("eki", ["place", "subject", "identity"], { subject: "the station", object: "the station", predicate: "a station", agreement: "third-singular", location: "at the station" }),
    { ...noun("mise", ["place", "subject", "identity"], { subject: "the shop", object: "the shop", predicate: "a shop", agreement: "third-singular", location: "in the shop" }), id: "mise.shop", meaning: "shop" },
    noun("heya", ["place", "subject", "identity"], { subject: "the room", object: "the room", predicate: "a room", agreement: "third-singular", location: "in the room" }),
    noun("byouin", ["place", "subject", "identity"], { subject: "the hospital", object: "the hospital", predicate: "a hospital", agreement: "third-singular", location: "at the hospital" }),
    noun("resutoran", ["place", "subject", "identity"], { subject: "the restaurant", object: "the restaurant", predicate: "a restaurant", agreement: "third-singular", location: "in the restaurant" }),
    verb("yomu", "godan", ["object-wo"], { base: "read", third: "reads", past: "read" }),
    verb("kaku", "godan", ["object-wo"], { base: "write", third: "writes", past: "wrote" }),
    verb("nomu", "godan", ["object-wo"], { base: "drink", third: "drinks", past: "drank" }),
    verb("taberu", "ichidan", ["object-wo"], { base: "eat", third: "eats", past: "ate" }),
    verb("iku", "godan", ["destination-ni"], { base: "go", third: "goes", past: "went" }, "iku"),
    verb("kaeru", "godan", ["destination-ni"], { base: "return", third: "returns", past: "returned" }),
    verb("kuru", "kuru", ["destination-ni"], { base: "come", third: "comes", past: "came" }),
    verb("suru", "suru", [], { base: "do", third: "does", past: "did" }),
    verb("aru", "godan", ["existence-inanimate"], { base: "exist", third: "exists", past: "existed" }, "aru"),
    verb("iru", "ichidan", ["existence-animate"], { base: "exist", third: "exists", past: "existed" }),
    { ...base("ookii", "default"), kind: "i-adjective", english: "big", subjectTags: ["person", "countable", "place"] } as Adjective,
    { ...base("chiisai", "default"), kind: "i-adjective", english: "small", subjectTags: ["person", "countable", "place"] } as Adjective,
    { ...base("ii", "default"), kind: "i-adjective", english: "good", inflectionStem: { surface: "よ", reading: "よ" } } as Adjective,
    { ...base("atarashii", "default"), kind: "i-adjective", english: "new", subjectTags: ["countable", "clothing", "place"], excludedSubjectTags: ["food", "drink"] } as Adjective,
    { ...base("furui", "default"), kind: "i-adjective", english: "old", subjectTags: ["countable", "clothing", "place"], excludedSubjectTags: ["food", "drink"] } as Adjective,
    { ...base("takai", "expensive"), meaning: "expensive", kind: "i-adjective", english: "expensive", subjectTags: ["physical", "place"] } as Adjective,
    { ...base("yasui", "default"), kind: "i-adjective", english: "inexpensive", subjectTags: ["physical", "place"] } as Adjective,
    { ...base("oishii", "default"), kind: "i-adjective", english: "delicious", subjectTags: ["food", "drink"] } as Adjective,
    { ...base("omoshiroi", "interesting"), meaning: "interesting", kind: "i-adjective", english: "interesting" } as Adjective,
    { ...base("kiree-na", "clean", "きれい", "きれい"), meaning: "clean", kind: "na-adjective", english: "clean",
      subjectWordIds: ["hankachi", "isu", "heya", "ie", "gakkou", "eki", "mise", "byouin", "resutoran", "kouen", "toire", "shatsu", "kutsu"] } as Adjective,
    { ...base("benri-na", "default", "べんり", "べんり"), kind: "na-adjective", english: "convenient", subjectTags: ["physical", "place"] } as Adjective,
    ...reviewedVocabulary,
  ],
};

const positive: Features = { tense: "nonpast", polarity: "positive", question: false };
const negative: Features = { ...positive, polarity: "negative" };
const past: Features = { ...positive, tense: "past" };
const question: Features = { ...positive, question: true };
const senses = (words: string[]) => resolveWordPool(words, exampleLexicon);

export const exampleRecipes: Record<string, Recipe> = {
  classroom: {
    schemaVersion: 1, level: "A1", id: "example-classroom", revision: 1, title: "Reading and writing",
    targetSenseIds: senses(["nihongo", "eigo", "yomu", "kaku"]),
    helperSenseIds: senses(["watashi", "anata", "hiragana", "kanji"]),
    knownGrammar: ["topic-wa", "object-wo", "verb-polite"], maxChangedSlots: 1, minTargetExposures: 8,
    phases: [
      { id: "warmup", construction: "action", features: positive, count: 12 },
      { id: "negative", construction: "action", features: negative, count: 8, introduceGrammar: ["negative"] },
      { id: "past", construction: "action", features: past, count: 8, introduceGrammar: ["past"] },
      { id: "questions", construction: "action", features: question, count: 8, introduceGrammar: ["question-ka"] },
    ],
  },
  existence: {
    schemaVersion: 1, level: "A1", id: "example-existence", revision: 1, title: "People and things in places",
    targetSenseIds: senses(["gakusei", "sensei", "hon", "mizu"]),
    helperSenseIds: senses(["gakkou", "kouen", "ie", "aru", "iru"]),
    knownGrammar: ["existence", "verb-polite"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "existence", features: positive, count: 16 },
      { id: "negative", construction: "existence", features: negative, count: 12, introduceGrammar: ["negative"] },
    ],
  },
  adjectives: {
    schemaVersion: 1, level: "A1", id: "example-adjectives", revision: 1, title: "Describing things",
    targetSenseIds: senses(["ii", "ookii", "chiisai"]), helperSenseIds: senses(["hon", "ie", "kouen"]),
    knownGrammar: ["topic-wa", "i-adjective"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [
      { id: "warmup", construction: "i-predicate", features: positive, count: 9 },
      { id: "past-negative", construction: "i-predicate", features: { ...past, polarity: "negative" }, count: 12, introduceGrammar: ["negative", "past"] },
    ],
  },
  movement: {
    schemaVersion: 1, level: "A1", id: "example-movement", revision: 1, title: "Going and returning",
    targetSenseIds: senses(["iku", "kaeru", "kuru"]), helperSenseIds: senses(["gakusei", "sensei", "gakkou", "kouen", "ie"]),
    knownGrammar: ["topic-wa", "destination-ni", "verb-polite", "past"], maxChangedSlots: 1, minTargetExposures: 6,
    phases: [{ id: "movement", construction: "motion", features: past, count: 21 }],
  },
};

// An ad hoc review differs only in recipe inputs. It uses generateSession too.
export function exampleReviewRecipe(wordIds: string[]): Recipe {
  const targets = senses(wordIds);
  return {
    ...exampleRecipes.classroom,
    id: "ad-hoc-classroom-review", title: "Selected classroom words",
    targetSenseIds: targets,
    helperSenseIds: senses(["watashi", "anata", "nihongo", "eigo", "yomu", "kaku"]).filter(id => !targets.includes(id)),
    knownGrammar: ["topic-wa", "object-wo", "verb-polite"],
    minTargetExposures: 3,
    phases: [{ id: "review", construction: "action", features: positive, count: 16 }],
  };
}
