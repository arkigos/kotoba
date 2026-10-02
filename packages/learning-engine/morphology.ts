import { GenerationError, type Adjective, type Features, type Form, type Verb, type VerbForm } from "./types";

const godan: Record<string, { i: string; a: string; te: string; past: string }> = {
  う: { i: "い", a: "わ", te: "って", past: "った" },
  く: { i: "き", a: "か", te: "いて", past: "いた" },
  ぐ: { i: "ぎ", a: "が", te: "いで", past: "いだ" },
  す: { i: "し", a: "さ", te: "して", past: "した" },
  つ: { i: "ち", a: "た", te: "って", past: "った" },
  ぬ: { i: "に", a: "な", te: "んで", past: "んだ" },
  ぶ: { i: "び", a: "ば", te: "んで", past: "んだ" },
  む: { i: "み", a: "ま", te: "んで", past: "んだ" },
  る: { i: "り", a: "ら", te: "って", past: "った" },
};
const append = (stem: Form, suffix: string): Form => ({ surface: stem.surface + suffix, reading: stem.reading + suffix });
const cut = (value: Form, length: number): Form => ({ surface: value.surface.slice(0, -length), reading: value.reading.slice(0, -length) });

export function validateVerb(verb: Verb): void {
  const { lemma, conjugation, exception } = verb;
  const bad = (reason: string): never => { throw new GenerationError("LEXEME_METADATA", `${verb.id}: ${reason}`); };
  if (!lemma?.surface || !lemma.reading) bad("a dictionary surface and reading are required");
  if (exception && !["iku", "aru"].includes(exception)) bad("unsupported exception");
  if (exception && (conjugation !== "godan" || lemma.reading !== (exception === "iku" ? "いく" : "ある"))) bad("exception does not match this dictionary form");
  if (lemma.reading === "いく" && exception !== "iku") bad("行く requires its explicit exception");
  if (lemma.reading === "ある" && exception !== "aru") bad("ある requires its explicit exception");
  if (conjugation === "godan") {
    const ending = lemma.reading.slice(-1);
    if (!godan[ending] || !lemma.surface.endsWith(ending)) bad("unsupported godan dictionary ending");
  } else if (conjugation === "ichidan") {
    if (!lemma.surface.endsWith("る") || !lemma.reading.endsWith("る")) bad("ichidan dictionary forms must end in る");
  } else if (conjugation === "suru") {
    if (!lemma.surface.endsWith("する") || !lemma.reading.endsWith("する")) bad("する-class dictionary forms must end in する");
  } else if (conjugation === "kuru") {
    if (!["来る", "くる"].includes(lemma.surface) || lemma.reading !== "くる") bad("this slice supports bare 来る/くる only");
  } else bad("explicit supported conjugation class required");
}

export function inflectVerb(verb: Verb, form: VerbForm): Form {
  validateVerb(verb);
  let politeStem: Form;
  let negative: Form;
  let te: Form;
  let past: Form;
  if (verb.conjugation === "kuru") {
    const surfaceStem = verb.lemma.surface === "来る" ? "来" : "き";
    politeStem = { surface: surfaceStem, reading: "き" };
    negative = { surface: verb.lemma.surface === "来る" ? "来ない" : "こない", reading: "こない" };
    te = append(politeStem, "て");
    past = append(politeStem, "た");
  } else if (verb.conjugation === "suru") {
    const stem = append(cut(verb.lemma, 2), "し");
    politeStem = stem;
    negative = append(stem, "ない");
    te = append(stem, "て");
    past = append(stem, "た");
  } else if (verb.conjugation === "ichidan") {
    politeStem = cut(verb.lemma, 1);
    negative = append(politeStem, "ない");
    te = append(politeStem, "て");
    past = append(politeStem, "た");
  } else {
    const row = godan[verb.lemma.reading.slice(-1)];
    const stem = cut(verb.lemma, 1);
    politeStem = append(stem, row.i);
    negative = verb.exception === "aru" ? { surface: "ない", reading: "ない" } : append(stem, row.a + "ない");
    te = append(stem, verb.exception === "iku" ? "って" : row.te);
    past = append(stem, verb.exception === "iku" ? "った" : row.past);
  }
  const forms: Record<VerbForm, Form> = {
    dictionary: { ...verb.lemma }, negative, past, te,
    "negative-past": append(cut(negative, 1), "かった"),
    polite: append(politeStem, "ます"),
    "polite-negative": append(politeStem, "ません"),
    "polite-past": append(politeStem, "ました"),
    "polite-negative-past": append(politeStem, "ませんでした"),
  };
  if (!Object.prototype.hasOwnProperty.call(forms, form)) throw new GenerationError("UNSUPPORTED_FORM", `Unsupported verb form: ${form}`);
  return forms[form];
}

export function politeVerbForm(features: Features): VerbForm {
  return features.polarity === "negative"
    ? features.tense === "past" ? "polite-negative-past" : "polite-negative"
    : features.tense === "past" ? "polite-past" : "polite";
}

export type AdjectiveForm = "nonpast" | "negative" | "past" | "negative-past" | "attributive" | "te";
export function inflectAdjective(adjective: Adjective, form: AdjectiveForm): Form {
  const { lemma } = adjective;
  if (!lemma?.surface || !lemma.reading) throw new GenerationError("LEXEME_METADATA", `${adjective.id}: missing adjective lemma`);
  let forms: Record<AdjectiveForm, Form>;
  if (adjective.kind === "i-adjective") {
    if (!lemma.surface.endsWith("い") || !lemma.reading.endsWith("い")) throw new GenerationError("LEXEME_METADATA", `${adjective.id}: i-adjective must end in い`);
    if (lemma.reading === "いい" && !adjective.inflectionStem) throw new GenerationError("LEXEME_METADATA", `${adjective.id}: an explicit inflecting stem is required for いい`);
    const stem = adjective.inflectionStem ?? cut(lemma, 1);
    if (!stem.surface || !stem.reading) throw new GenerationError("LEXEME_METADATA", `${adjective.id}: missing inflecting stem`);
    forms = {
      nonpast: { ...lemma }, attributive: { ...lemma },
      negative: append(stem, "くない"), past: append(stem, "かった"),
      "negative-past": append(stem, "くなかった"), te: append(stem, "くて"),
    };
  } else if (adjective.kind === "na-adjective") {
    forms = {
      nonpast: append(lemma, "だ"), attributive: append(lemma, "な"),
      negative: { surface: lemma.surface + "ではない", reading: lemma.reading + "でわない" },
      past: append(lemma, "だった"),
      "negative-past": { surface: lemma.surface + "ではなかった", reading: lemma.reading + "でわなかった" },
      te: append(lemma, "で"),
    };
  } else throw new GenerationError("LEXEME_METADATA", "Unsupported adjective class");
  if (!Object.prototype.hasOwnProperty.call(forms, form)) throw new GenerationError("UNSUPPORTED_FORM", `Unsupported adjective form: ${form}`);
  return forms[form];
}

export function politeCopula(features: Features): Form {
  const surface = features.polarity === "negative"
    ? features.tense === "past" ? "ではありませんでした" : "ではありません"
    : features.tense === "past" ? "でした" : "です";
  return { surface, reading: surface.replace("では", "でわ") };
}
