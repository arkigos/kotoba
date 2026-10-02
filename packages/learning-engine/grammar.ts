import { inflectAdjective, inflectVerb, politeCopula, politeVerbForm } from "./morphology";
import { constructionIds, grammarIds, semanticTags, GenerationError, type Agreement, type CardToken, type ConstructionId, type Features, type Form, type GeneratedCard, type GrammarId, type Lexeme, type Lexicon, type Noun, type Sentence, type Verb } from "./types";

export const slots: Record<ConstructionId, string[]> = {
  identity: ["subject", "predicate"],
  "i-predicate": ["subject", "predicate"],
  "na-predicate": ["subject", "predicate"],
  action: ["subject", "object", "verb"],
  motion: ["subject", "destination", "verb"],
  existence: ["location", "entity"],
};
const baseGrammar: Record<ConstructionId, GrammarId[]> = {
  identity: ["topic-wa", "copula-polite"],
  "i-predicate": ["topic-wa", "i-adjective"],
  "na-predicate": ["topic-wa", "na-adjective", "copula-polite"],
  action: ["topic-wa", "object-wo", "verb-polite"],
  motion: ["topic-wa", "destination-ni", "verb-polite"],
  existence: ["existence", "verb-polite"],
};

export function requiredGrammar(construction: ConstructionId, features: Features): GrammarId[] {
  if (!constructionIds.includes(construction)) throw new GenerationError("UNSUPPORTED_CONSTRUCTION", `Unsupported construction: ${construction}`);
  if (!features || Object.keys(features).length !== 3 || Object.keys(features).some(key => !["tense", "polarity", "question"].includes(key)) || !["nonpast", "past"].includes(features.tense) || !["positive", "negative"].includes(features.polarity) || typeof features.question !== "boolean") throw new GenerationError("UNSUPPORTED_FEATURES", "Supported features are nonpast/past, positive/negative, and a boolean question");
  return [...baseGrammar[construction], ...(features.tense === "past" ? ["past" as const] : []), ...(features.polarity === "negative" ? ["negative" as const] : []), ...(features.question ? ["question-ka" as const] : [])];
}

export function validateLexicon(lexicon: Lexicon): Map<string, Lexeme> {
  if (!lexicon?.version || !Array.isArray(lexicon.entries)) throw new GenerationError("LEXEME_METADATA", "A versioned lexicon is required");
  const entries = new Map<string, Lexeme>();
  for (const entry of lexicon.entries) {
    const bad = (reason: string): never => { throw new GenerationError("LEXEME_METADATA", `${entry.id ?? "unknown sense"}: ${reason}`); };
    if (!entry.id || !entry.wordId || !entry.lemma?.surface || !entry.lemma.reading || !entry.meaning) bad("missing sense/word identity, lemma, reading, or meaning");
    if (entries.has(entry.id)) bad("duplicate sense ID");
    const tags = entry.kind === "noun" ? entry.semanticTags : entry.kind === "verb" ? entry.objectTags : entry.subjectTags;
    if (tags && (!Array.isArray(tags) || !tags.length || tags.some(tag => !semanticTags.includes(tag)) || new Set(tags).size !== tags.length)) bad("semantic tags must be a nonempty list of distinct reviewed properties");
    if (entry.kind === "noun") {
      if (!Array.isArray(entry.roles) || !entry.roles.length || entry.roles.some(role => !["subject", "actor", "identity", "object", "place", "entity"].includes(role))) bad("explicit noun roles are required");
      if (!entry.english?.subject || !entry.english.object || !entry.english.predicate || !["first-singular", "third-singular", "other"].includes(entry.english.agreement)) bad("English phrases and agreement are required");
      if (entry.english.existentialSubject !== undefined && typeof entry.english.existentialSubject !== "boolean") bad("English existence style must be explicit");
      if (entry.roles.includes("place") && !entry.english.location) bad("places need an English location phrase");
      if (entry.roles.includes("entity") && (!entry.existence || !["animate", "inanimate"].includes(entry.existence) || !entry.english.existential || !entry.english.existentialNegative)) bad("existential entities need an existence class and affirmative/negative English phrases");
      if (entry.roles.includes("entity") && entry.english.agreement === "first-singular") bad("existential noun phrases cannot use first-person verb agreement");
    } else if (entry.kind === "verb") {
      inflectVerb(entry, "polite");
      if (!Array.isArray(entry.frames) || entry.frames.some(frame => !["object-wo", "destination-ni", "existence-animate", "existence-inanimate"].includes(frame))) bad("unsupported verb argument frame");
      if (entry.frames.includes("object-wo") && !entry.objectTags?.length) bad("object-taking verbs need reviewed object compatibility tags");
      if (!entry.english?.base || !entry.english.third || !entry.english.past) bad("English verb forms are required");
      if (entry.frames.includes("existence-animate") && (entry.lemma.reading !== "いる" || entry.conjugation !== "ichidan")) bad("animate existence requires the reviewed いる sense");
      if (entry.frames.includes("existence-inanimate") && entry.exception !== "aru") bad("inanimate existence requires the reviewed ある sense");
    } else if (entry.kind === "i-adjective" || entry.kind === "na-adjective") {
      inflectAdjective(entry, "negative");
      if (!entry.english) bad("English adjective required");
      if (entry.excludedSubjectTags && (!Array.isArray(entry.excludedSubjectTags) || entry.excludedSubjectTags.some(tag => !semanticTags.includes(tag)))) bad("Unknown excluded adjective subject property");
      if (entry.subjectWordIds && (!Array.isArray(entry.subjectWordIds) || !entry.subjectWordIds.length || entry.subjectWordIds.some(id => typeof id !== "string" || !id.trim()))) bad("Adjective subject identities must be a nonempty list");
    } else bad("unsupported lexical class");
    entries.set(entry.id, entry);
  }
  return entries;
}

export function fitsSlot(construction: ConstructionId, slot: string, lexeme: Lexeme): boolean {
  if (slot === "verb") return lexeme.kind === "verb" && lexeme.frames.includes(construction === "action" ? "object-wo" : "destination-ni");
  if (slot === "predicate") {
    if (construction === "i-predicate") return lexeme.kind === "i-adjective";
    if (construction === "na-predicate") return lexeme.kind === "na-adjective";
    return lexeme.kind === "noun" && lexeme.roles.includes("identity");
  }
  if (lexeme.kind !== "noun") return false;
  if (slot === "subject" && (construction === "action" || construction === "motion")) return lexeme.roles.includes("actor");
  const role = slot === "location" || slot === "destination" ? "place" : slot;
  return lexeme.roles.includes(role as Noun["roles"][number]);
}

export function existenceVerb(entity: Noun, pool: Lexeme[]): Verb {
  const candidates = pool.filter((entry): entry is Verb => entry.kind === "verb" && entry.frames.includes(entity.existence === "animate" ? "existence-animate" : "existence-inanimate"));
  if (candidates.length !== 1) throw new GenerationError("EXISTENCE_PREDICATE", `Pool needs exactly one ${entity.existence} existence sense for ${entity.id}`, { entity: entity.id, candidates: candidates.map(entry => entry.id) });
  return candidates[0];
}

/** Checks relationships between already licensed slots, separately from syntax. */
export function semanticCompatibility(construction: ConstructionId, bound: Record<string, Lexeme>): string | undefined {
  if (construction === "action") {
    const verb = bound.verb as Verb;
    const object = bound.object as Noun;
    if (!verb.objectTags?.some(tag => object.semanticTags?.includes(tag))) return `${object.id} is not a reviewed object for ${verb.id}`;
  }
  if (construction === "i-predicate" || construction === "na-predicate") {
    const subject = bound.subject as Noun;
    const predicate = bound.predicate;
    if ((predicate.kind === "i-adjective" || predicate.kind === "na-adjective") && predicate.subjectTags && !predicate.subjectTags.some(tag => subject.semanticTags?.includes(tag))) return `${subject.id} is not a reviewed subject for ${predicate.id}`;
    if ((predicate.kind === "i-adjective" || predicate.kind === "na-adjective") && predicate.excludedSubjectTags?.some(tag => subject.semanticTags?.includes(tag))) return `${subject.id} is excluded from this sense of ${predicate.id}`;
    if ((predicate.kind === "i-adjective" || predicate.kind === "na-adjective") && predicate.subjectWordIds && !predicate.subjectWordIds.includes(subject.wordId)) return `${subject.id} is outside the reviewed subject domain for ${predicate.id}`;
  }
  if (construction === "identity") {
    const subject = bound.subject as Noun;
    const predicate = bound.predicate as Noun;
    if (subject.id === predicate.id) return `An identity sentence cannot repeat the same sense on both sides`;
    if (Boolean(subject.semanticTags?.includes("person")) !== Boolean(predicate.semanticTags?.includes("person"))) return `Identity cannot equate a person with ${subject.semanticTags?.includes("person") ? predicate.id : subject.id}`;
  }
  return undefined;
}

/** Used by editors to find words that can participate with a template's pool. */
export function fitsConstructionPool(construction: ConstructionId, candidate: Lexeme, pool: Lexeme[]): boolean {
  const slotNames = slots[construction];
  const choices = slotNames.map(slot => [...pool.filter(entry => entry.id !== candidate.id), candidate].filter(entry => fitsSlot(construction, slot, entry)));
  const bound: Record<string, Lexeme> = {};
  const visit = (index: number, used: boolean): boolean => {
    if (index === slotNames.length) return used && !semanticCompatibility(construction, bound);
    return choices[index].some(entry => { bound[slotNames[index]] = entry; return visit(index + 1, used || entry.id === candidate.id); });
  };
  return visit(0, false);
}

const grammarToken = (surface: string, reading: string, explain: string): CardToken => ({ surface, reading, explain });
const lexicalToken = (entry: Lexeme, form: Form = entry.lemma): CardToken => ({ ...form, explain: entry.meaning, wordId: entry.wordId, ...(entry.dictionaryEntryId ? { dictionaryEntryId: entry.dictionaryEntryId } : {}) });
const wa = () => grammarToken("は", "わ", "topic marker");
const capitalized = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
function englishBe(agreement: Agreement, tense: Features["tense"]) {
  return tense === "past" ? agreement === "other" ? "were" : "was" : agreement === "first-singular" ? "am" : agreement === "third-singular" ? "is" : "are";
}
function englishPredicate(subject: Noun, complement: string, features: Features) {
  const be = englishBe(subject.english.agreement, features.tense);
  const negative = features.polarity === "negative" ? " not" : "";
  return features.question ? `${be} ${subject.english.subject}${negative} ${complement}?` : `${subject.english.subject} ${be}${negative} ${complement}`;
}
function englishAction(subject: Noun, verb: Verb, complement: string, features: Features) {
  const auxiliary = features.tense === "past" ? "did" : subject.english.agreement === "third-singular" ? "does" : "do";
  if (features.question) return `${auxiliary} ${subject.english.subject}${features.polarity === "negative" ? " not" : ""} ${verb.english.base} ${complement}?`;
  const predicate = features.polarity === "negative" ? `${auxiliary} not ${verb.english.base}` : features.tense === "past" ? verb.english.past : subject.english.agreement === "third-singular" ? verb.english.third : verb.english.base;
  return `${subject.english.subject} ${predicate} ${complement}`;
}

/** Realize only licensed structures. Callers cannot supply free-form Japanese. */
export function realizeSentence(sentence: Sentence, lexicon: Lexicon, allowedSenseIds: string[], allowedGrammar: GrammarId[]): GeneratedCard {
  const entries = validateLexicon(lexicon);
  const usedGrammar = requiredGrammar(sentence.construction, sentence.features);
  if (allowedGrammar.some(id => !grammarIds.includes(id))) throw new GenerationError("UNKNOWN_GRAMMAR", "Unknown grammar ID in allowed grammar");
  const missingGrammar = usedGrammar.filter(id => !allowedGrammar.includes(id));
  if (missingGrammar.length) throw new GenerationError("UNAVAILABLE_GRAMMAR", `Unavailable grammar: ${missingGrammar.join(", ")}`, { missingGrammar });
  const pool = allowedSenseIds.map(id => {
    const entry = entries.get(id);
    if (!entry) throw new GenerationError("UNKNOWN_SENSE", `Unknown sense: ${id}`);
    return entry;
  });
  const expectedSlots = slots[sentence.construction];
  if (!sentence.bindings || Object.keys(sentence.bindings).length !== expectedSlots.length || Object.keys(sentence.bindings).some(key => !expectedSlots.includes(key))) throw new GenerationError("INVALID_BINDING", "Sentence bindings must match the construction's exact slots");
  const bound: Record<string, Lexeme> = {};
  for (const slot of expectedSlots) {
    const id = sentence.bindings[slot];
    const entry = entries.get(id);
    if (!entry || !allowedSenseIds.includes(id)) throw new GenerationError("OUTSIDE_POOL", `Slot ${slot} uses a sense outside the pool: ${id}`);
    if (!fitsSlot(sentence.construction, slot, entry)) throw new GenerationError("INVALID_BINDING", `${id} is not licensed for ${sentence.construction}.${slot}`);
    bound[slot] = entry;
  }
  const semanticIssue = semanticCompatibility(sentence.construction, bound);
  if (semanticIssue) throw new GenerationError("SEMANTIC_MISMATCH", semanticIssue, { construction: sentence.construction, bindings: sentence.bindings });
  const { features, construction } = sentence;
  const subject = bound.subject as Noun;
  const predicate = bound.predicate;
  const senseIds = Object.values(sentence.bindings);
  let tokens: CardToken[];
  let english: string;
  if (construction === "identity" || construction === "na-predicate") {
    const copula = politeCopula(features);
    tokens = [lexicalToken(subject), wa(), lexicalToken(predicate), grammarToken(copula.surface, copula.reading, "polite predicate ending")];
    english = englishPredicate(subject, predicate.kind === "noun" ? predicate.english.predicate : (predicate as Extract<Lexeme, { kind: "i-adjective" | "na-adjective" }>).english, features);
  } else if (construction === "i-predicate") {
    if (predicate.kind !== "i-adjective") throw new GenerationError("INVALID_BINDING", "An i-adjective is required");
    const form = features.polarity === "negative" ? features.tense === "past" ? "negative-past" : "negative" : features.tense;
    tokens = [lexicalToken(subject), wa(), lexicalToken(predicate, inflectAdjective(predicate, form)), grammarToken("です", "です", "polite ending")];
    english = englishPredicate(subject, predicate.english, features);
  } else if (construction === "action" || construction === "motion") {
    const verb = bound.verb as Verb;
    const complement = bound[construction === "action" ? "object" : "destination"] as Noun;
    tokens = [lexicalToken(subject), wa(), lexicalToken(complement), construction === "action" ? grammarToken("を", "お", "object marker") : grammarToken("に", "に", "destination marker"), lexicalToken(verb, inflectVerb(verb, politeVerbForm(features)))];
    english = englishAction(subject, verb, construction === "action" ? complement.english.object : `to ${complement.english.object}`, features);
  } else {
    const entity = bound.entity as Noun;
    const location = bound.location as Noun;
    const verb = existenceVerb(entity, pool);
    senseIds.push(verb.id);
    tokens = [lexicalToken(location), grammarToken("に", "に", "existence location marker"), lexicalToken(entity), grammarToken("が", "が", "subject marker"), lexicalToken(verb, inflectVerb(verb, politeVerbForm(features)))];
    const be = englishBe(entity.english.agreement, features.tense);
    const remainder = ` ${features.polarity === "negative" ? entity.english.existentialNegative : entity.english.existential} ${location.english.location}`;
    english = entity.english.existentialSubject
      ? englishPredicate(entity, location.english.location!, features)
      : features.question ? `${be} there${remainder}?` : `there ${be}${remainder}`;
  }
  if (features.question) tokens.push(grammarToken("か", "か", "question marker"));
  return {
    id: "unassigned", line: tokens.map(token => token.surface), tts: tokens.map(token => token.reading),
    explain: tokens.map(token => token.explain), tokens, english: capitalized(english),
    grammarTags: usedGrammar, derivation: { ...sentence, bindings: { ...sentence.bindings }, features: { ...features } },
    senseIds: [...new Set(senseIds)], audioPolicy: "words",
  };
}
