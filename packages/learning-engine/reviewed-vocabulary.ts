import { dictionaryWord } from "../dictionary";
import type { Adjective, Lexeme, Noun, SemanticTag, Verb } from "./types";

// Authored word senses, not a POS import. Each row was selected for the literal
// roles and English phrases below. The canonical dictionary still owns identity,
// level, spellings, and pronunciation; this overlay owns generation eligibility.
function base(wordId: string, form?: [string, string], meaning?: string) {
  const word = dictionaryWord(wordId);
  if (!word || word.level !== "A1") throw new Error(`Reviewed A1 sense is missing canonical placement: ${wordId}`);
  return { id: `${wordId}.default`, wordId, dictionaryEntryId: word.dictionaryEntryId, level: word.level,
    lemma: { surface: form?.[0] ?? word.surface, reading: form?.[1] ?? word.reading }, meaning: meaning ?? word.meaning };
}
const objects: Noun["roles"] = ["subject", "object", "entity"];
const people: Noun["roles"] = ["subject", "actor", "identity", "object", "entity"];
function count(wordId: string, phrase: string, indefinite: string, tags: SemanticTag[] = [], form?: [string, string]): Noun {
  return { ...base(wordId, form), kind: "noun", roles: objects, semanticTags: ["physical", "countable", ...tags], existence: "inanimate",
    english: { subject: phrase, object: phrase, predicate: indefinite, agreement: "third-singular", existential: indefinite, existentialNegative: `no ${indefinite.replace(/^(a|an) /, "")}` } };
}
function mass(wordId: string, phrase: string, tags: SemanticTag[], form?: [string, string], meaning?: string): Noun {
  return { ...base(wordId, form, meaning), kind: "noun", roles: objects, semanticTags: ["physical", ...tags], existence: "inanimate",
    english: { subject: phrase, object: phrase, predicate: phrase, agreement: "third-singular", existential: phrase, existentialNegative: `no ${phrase}` } };
}
function plural(wordId: string, phrase: string, tags: SemanticTag[], form?: [string, string]): Noun {
  return { ...base(wordId, form), kind: "noun", roles: objects, semanticTags: ["physical", "countable", ...tags], existence: "inanimate",
    english: { subject: `the ${phrase}`, object: phrase, predicate: phrase, agreement: "other", existential: phrase, existentialNegative: `no ${phrase}` } };
}
function person(wordId: string, phrase: string, predicate: string, definite = false): Noun {
  return { ...base(wordId), kind: "noun", roles: people, semanticTags: ["person"], existence: "animate",
    english: { subject: phrase, object: phrase, predicate, agreement: "third-singular", existential: predicate,
      existentialNegative: `no ${predicate.replace(/^(a|an) /, "")}`, ...(definite ? { existentialSubject: true } : {}) } };
}
function place(wordId: string, phrase: string, predicate: string, location: string, form?: [string, string]): Noun {
  return { ...base(wordId, form), kind: "noun", roles: ["place", "subject"], semanticTags: ["place"],
    english: { subject: phrase, object: phrase, predicate, agreement: "third-singular", location } };
}
function content(wordId: string, phrase: string, tags: SemanticTag[], form?: [string, string]): Noun {
  return { ...base(wordId, form), kind: "noun", roles: ["object"], semanticTags: tags,
    english: { subject: phrase, object: phrase, predicate: phrase, agreement: "third-singular" } };
}
function verb(wordId: string, conjugation: Verb["conjugation"], forms: [string, string, string], objectTags: SemanticTag[], meaning?: string): Verb {
  return { ...base(wordId, undefined, meaning), kind: "verb", conjugation, frames: ["object-wo"], objectTags,
    english: { base: forms[0], third: forms[1], past: forms[2] } };
}
function adjective(wordId: string, english: string, subjectTags: SemanticTag[], form?: [string, string], na = false): Adjective {
  return { ...base(wordId, form), kind: na ? "na-adjective" : "i-adjective", english, subjectTags };
}

/** Literal nearby-landmark sense; not every geographical/category noun. */
export const nearbyLandmarkWordIds = ["byouin", "depaato", "eki", "gakkou", "ginkou", "kouen", "machi", "ie", "mise", "hoteru", "kuukou", "kaisha", "toire", "bijutsukan", "hakubutsukan", "jinja", "koohii-shoppu", "otera-tera"];

export const reviewedVocabulary: Lexeme[] = [
  { ...base("boku"), kind: "noun", roles: ["subject", "actor", "object"], semanticTags: ["person"], english: { subject: "I", object: "me", predicate: "me", agreement: "first-singular" } },
  { ...base("watashitachi"), kind: "noun", roles: ["subject", "actor", "object"], semanticTags: ["person"], english: { subject: "we", object: "us", predicate: "us", agreement: "other" } },
  person("chichi", "my father", "my father", true),
  person("haha", "my mother", "my mother", true),
  person("ani", "my older brother", "my older brother", true),
  person("ane", "my older sister", "my older sister", true),
  person("otouto", "my younger brother", "my younger brother", true),
  person("imouto", "my younger sister", "my younger sister", true),
  person("otto", "my husband", "my husband", true),
  person("tsuma", "my wife", "my wife", true),
  person("obaachan", "grandma", "a grandmother", true),
  person("hito", "the person", "a person"),
  person("kaishain", "the company employee", "a company employee"),
  person("enjinia", "the engineer", "an engineer"),
  person("shufu", "the homemaker", "a homemaker"),
  person("koomuin", "the civil servant", "a civil servant"),
  person("kyooshi", "the teacher", "a teacher"),
  person("ninja", "the ninja", "a ninja"),
  person("okyakusan", "the customer", "a customer"),

  mass("asagohan", "breakfast", ["food"]),
  mass("ban-gohan", "dinner", ["food"]),
  mass("hiru-gohan", "lunch", ["food"]),
  count("chiizu-baagaa", "the cheeseburger", "a cheeseburger", ["food"]),
  plural("furaido-poteto", "French fries", ["food"]),
  count("hanbaagaa", "the hamburger", "a hamburger", ["food"]),
  count("hottodoggu", "the hot dog", "a hot dog", ["food"]),
  mass("karee", "curry", ["food"]),
  mass("piza", "pizza", ["food"]),
  mass("raamen", "ramen", ["food"]),
  mass("sakana", "fish", ["food"], undefined, "fish (food)"),
  plural("soba", "soba noodles", ["food"]),
  mass("sushi", "sushi", ["food"]),
  mass("tenpura", "tempura", ["food"]),
  plural("udon", "udon noodles", ["food"]),
  mass("tabemono", "food", ["food"]),
  count("shokuji", "the meal", "a meal", ["food"]),
  count("ryoori", "the dish", "a dish", ["food"]),
  count("orenji", "the orange", "an orange", ["food"]),
  mass("misoshiru", "miso soup", ["drink"]),
  mass("juusu", "juice", ["drink"]),
  mass("koocha", "black tea", ["drink"]),
  mass("koora", "cola", ["drink"]),
  count("nomimono", "the drink", "a drink", ["drink"]),
  mass("osake-sake", "alcohol", ["drink"], ["おさけ", "おさけ"], "alcohol"),

  ...([
    ["baggu", "bag"], ["beddo", "bed"], ["eakon", "air conditioner"], ["gitaa", "guitar"],
    ["hako", "box"], ["hankachi", "handkerchief"], ["kappu", "cup"], ["kasa", "umbrella"],
    ["ningyoo", "doll"], ["omiyage", "souvenir"], ["piano", "piano"], ["shashin", "photograph"],
    ["sofa", "sofa"], ["taiko", "taiko drum"], ["tana", "shelf"], ["teeburu", "table"],
    ["tokee", "clock"], ["shuriken", "throwing star"], ["shawaa", "shower"], ["e_2", "picture"], ["mimikaki", "earpick"],
  ] as const).map(([id, english]) => count(id, `the ${english}`, `${/^[aeiou]/.test(english) ? "an" : "a"} ${english}`)),
  ...([
    ["baiku", "motorcycle"], ["basu", "bus"], ["chikatetsu", "subway"], ["densha", "train"],
    ["fune", "boat"], ["hikouki", "airplane"], ["jitensha", "bicycle"], ["kuruma", "car"],
    ["takushii", "taxi"], ["monoreeru", "monorail"], ["norimono", "vehicle"],
  ] as const).map(([id, english]) => count(id, `the ${english}`, `${/^[aeiou]/.test(english) ? "an" : "a"} ${english}`, ["transport"])),
  ...([
    ["jaketto", "jacket"], ["kimono", "kimono"], ["kooto", "coat"], ["shatsu", "shirt"],
    ["sukaato", "skirt"], ["tiishatsu", "T-shirt"], ["wanpiisu", "dress"],
  ] as const).map(([id, english]) => count(id, `the ${english}`, `a ${english}`, id === "sukaato" ? ["clothing"] : ["clothing", "upper-body-clothing"])),
  plural("jiinzu", "jeans", ["clothing"]), plural("pantsu", "trousers", ["clothing"]),
  plural("kutsu", "shoes", ["clothing"]), plural("kutsushita", "socks", ["clothing"]),
  plural("hashi", "chopsticks", []), mass("nimotsu", "luggage", []), mass("origami", "origami", []),
  count("kaado", "the card", "a card", ["text"]), count("karendaa", "the calendar", "a calendar", ["text"]),

  ...([
    ["ankeeto", "questionnaire"], ["ehagaki", "picture postcard"], ["burogu", "blog"],
    ["haiku", "haiku"], ["manga", "manga book"], ["meeshi", "business card"], ["menyuu", "menu"],
    ["nikki", "diary"], ["risuto", "list"], ["shoosetsu", "novel"], ["zasshi", "magazine"],
  ] as const).map(([id, english]) => count(id, `the ${english}`, `a ${english}`, id === "manga" ? ["text"] : ["text", "writing"])),
  content("bungaku", "literature", ["text"]),
  content("gaikokugo", "a foreign language", ["language", "text", "writing"]),
  content("kankokugo", "Korean", ["language", "text", "writing"]),
  content("katakana", "katakana", ["text", "writing"]),
  content("roomaji", "romaji", ["text", "writing"]),
  content("uta", "the song", ["audio"]), content("ongaku", "music", ["audio"]),
  content("jazu", "jazz", ["audio"]), content("kurashikku", "classical music", ["audio"]),
  content("poppusu", "pop music", ["audio"]), content("rokku", "rock music", ["audio"]),
  content("jei-poppu", "J-pop", ["audio"], ["ジェイポップ", "ジェイポップ"]),
  content("eiga", "the movie", ["visual"]), content("anime", "anime", ["visual"]),

  ...([
    ["apaato", "apartment"], ["bijutsukan", "art museum"], ["biru", "building"], ["daidokoro", "kitchen"],
    ["depaato", "department store"], ["genkan", "entrance"], ["ginkou", "bank"], ["hakubutsukan", "museum"],
    ["hoteru", "hotel"], ["ikkodate", "detached house"], ["jinja", "shrine"], ["kaisha", "company"],
    ["koohii-shoppu", "coffee shop"], ["kuni", "country"], ["kuukou", "airport"], ["kyooshitsu", "classroom"],
    ["machi", "town"], ["manshon", "apartment building"], ["niwa", "garden"], ["toire", "restroom"],
  ] as const).map(([id, english]) => place(id, `the ${english}`, `${/^[aeiou]/.test(english) ? "an" : "a"} ${english}`, `in the ${english}`)),
  place("biichi", "the beach", "a beach", "on the beach"),
  place("otera-tera", "the temple", "a temple", "at the temple", ["おてら", "おてら"]),
  place("toori", "the street", "a street", "on the street"),
  place("uchi", "the home", "a home", "at home"),
  ...([
    ["akihabara", "Akihabara"], ["asakusa", "Asakusa"], ["ginza", "Ginza"], ["shinjuku", "Shinjuku"],
    ["shibuya", "Shibuya"], ["harajuku", "Harajuku"], ["ueno", "Ueno"], ["nihon", "Japan"],
    ["kyouto", "Kyoto"], ["hiroshima", "Hiroshima"], ["okinawa", "Okinawa"], ["kankoku", "South Korea"],
    ["roshia", "Russia"], ["supein", "Spain"], ["oosutoraria", "Australia"], ["firipin", "the Philippines"],
    ["sooru", "Seoul"], ["tai", "Thailand"],
  ] as const).map(([id, english]) => place(id, english, english, `in ${english}`)),

  verb("ageru", "ichidan", ["give", "gives", "gave"], ["physical"]),
  verb("erabu", "godan", ["choose", "chooses", "chose"], ["physical"]),
  verb("miseru", "ichidan", ["show", "shows", "showed"], ["physical", "visual"]),
  verb("tsukau", "godan", ["use", "uses", "used"], ["physical"]),
  // Japanese distinguishes 着る for these garments from 履く for shoes/trousers.
  verb("kiru", "ichidan", ["wear", "wears", "wore"], ["upper-body-clothing"]),
  verb("hanasu", "godan", ["speak", "speaks", "spoke"], ["language"]),
  verb("kiku", "godan", ["listen to", "listens to", "listened to"], ["audio", "language"], "listen to"),
  verb("miru", "ichidan", ["watch", "watches", "watched"], ["visual"], "watch"),

  adjective("akarui", "bright", ["physical", "place"]),
  { ...adjective("chikai", "nearby", ["place"]), subjectWordIds: nearbyLandmarkWordIds },
  adjective("hiroi", "spacious", ["place"]),
  adjective("isogashii", "busy", ["person"]),
  { ...adjective("kakkoii", "good-looking", ["person", "clothing"]), inflectionStem: { surface: "かっこよ", reading: "かっこよ" } },
  adjective("kawaii", "cute", ["person", "countable"]),
  adjective("kurai", "dark", ["physical", "place"]),
  adjective("nagai", "long", ["countable"]),
  adjective("semai", "cramped", ["place"]),
  adjective("subarashii", "wonderful", ["person", "physical", "place"]),
  adjective("tanoshii", "fun", ["place"]),
  adjective("tooi", "far away", ["place"]),
  // Direct statements of inner feeling use the speaker. Third-person reports
  // need an evidential construction that this beginner frame does not teach.
  { ...adjective("ureshii", "happy", ["person"]), subjectWordIds: ["watashi", "boku", "watashitachi"] } as Adjective,
  adjective("wakai", "young", ["person"]),
  adjective("hayai", "early", ["person"]),
  adjective("osoi", "late", ["person"]),
  adjective("raku", "comfortable", ["clothing", "transport"], undefined, true),
  adjective("suteki", "lovely", ["person", "physical", "place"], undefined, true),
  adjective("yuumei", "famous", ["person", "place"], undefined, true),
  adjective("nigiyaka-na", "lively", ["place"], ["にぎやか", "にぎやか"], true),
  adjective("oshare-na", "stylish", ["person", "clothing", "place"], ["おしゃれ", "おしゃれ"], true),
  adjective("daijoubu", "okay", ["person"], undefined, true),
];
