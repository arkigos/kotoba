import { exampleLexicon } from "./examples";
import { createFrameAuthor } from "./frame-author";
import { inflectVerb } from "./morphology";
import type { Noun, Verb, PracticeCard } from "./types";

export const learningGrammar = [
  { id: "want-object", title: "Wanting something", level: "A1", pattern: "Noun が ほしいです", example: "水がほしいです", meaning: "I want water", explanation: "Use が with the thing you want. ほしい describes your own wishes; add か to ask about someone else's. ほしくないです means you do not want it.", defaults: ["mizu", "koohii", "hon", "kasa", "hoshii"] },
  { id: "want-action", title: "Wanting to do something", level: "A2", pattern: "Verb stem + たいです", example: "本を読みたいです", meaning: "I want to read a book", explanation: "Remove ます from the polite verb and add たいです. Keep the action's object or destination particle. たくないです means you do not want to do it; たいですか asks about a wish. These examples speak about your own wishes or ask another person.", defaults: ["yomu", "hon", "nomu", "mizu", "taberu", "pan"] },
  { id: "can-action", title: "Being able to do something", level: "A2", pattern: "Potential verb + ます", example: "日本語が話せます", meaning: "I can speak Japanese", explanation: "For a godan verb, change its final u sound to e and add ます. For an ichidan verb, replace る with られます. Here が marks what you can read, eat or speak. ません makes it negative; か makes it a question. These forms express ability or possibility, not a permission request.", defaults: ["yomu", "hon", "hanasu", "nihongo", "taberu", "pan"] },
] as const;
export type LearningGrammarId = typeof learningGrammar[number]["id"];
export const isLearningGrammarId = (id: string): id is LearningGrammarId => learningGrammar.some(row => row.id === id);

// Exact reviewed senses only. Involuntary perception (見える/聞こえる), passive,
// honorific and permission meanings need their own constructions.
const actionIds = new Set(["yomu", "kaku", "nomu", "taberu", "hanasu", "kiru"]);
const motionIds = new Set(["iku"]);
const potentialEndings: Record<string, string> = { "う": "え", "く": "け", "ぐ": "げ", "す": "せ", "つ": "て", "ぬ": "ね", "ぶ": "べ", "む": "め", "る": "れ" };
export function learnedVerbForm(verb: Verb, grammar: "want-action" | "can-action", negative = false) {
  if (grammar === "want-action") {
    const polite = inflectVerb(verb, "polite");
    const suffix = negative ? "たくないです" : "たいです";
    return [polite.surface.slice(0, -2) + suffix, polite.reading.slice(0, -2) + suffix] as [string, string];
  }
  const suffix = negative ? "ません" : "ます";
  if (verb.conjugation === "ichidan") return [verb.lemma.surface.slice(0, -1) + "られ" + suffix, verb.lemma.reading.slice(0, -1) + "られ" + suffix] as [string, string];
  if (verb.conjugation !== "godan") throw new Error("This ability sense needs a reviewed potential form.");
  const end = potentialEndings[verb.lemma.reading.slice(-1)];
  if (!end) throw new Error("This ability sense has no reviewed ending.");
  return [verb.lemma.surface.slice(0, -1) + end + suffix, verb.lemma.reading.slice(0, -1) + end + suffix] as [string, string];
}

export function learningGrammarCandidates(available: ReadonlySet<string>, allowed: ReadonlySet<string>): PracticeCard[] {
  const { cards, lex, g, add } = createFrameAuthor(available);
  const nouns = exampleLexicon.entries.filter((entry): entry is Noun => entry.kind === "noun" && available.has(entry.wordId));
  const verbs = exampleLexicon.entries.filter((entry): entry is Verb => entry.kind === "verb" && available.has(entry.wordId));
  const nounForms = (noun: Noun) => {
    const base = { tokens: [lex(noun.wordId)], object: noun.english.object, predicate: noun.english.predicate, suffix: "" };
    const forms = [base];
    if (["shatsu", "jaketto", "tiishatsu", "kimono", "kutsu", "kutsushita"].includes(noun.wordId)) {
      for (const [id, adjective] of [["ookii", "big"], ["chiisai", "small"]]) if (available.has(id)) {
        const describe = (phrase: string) => /^(a|an) /.test(phrase) ? `a ${adjective} ${phrase.replace(/^(a|an) /, "")}` : phrase.startsWith("the ") ? `the ${adjective} ${phrase.slice(4)}` : `${adjective} ${phrase}`;
        forms.push({ tokens: [lex(id), lex(noun.wordId)], object: describe(noun.english.object), predicate: describe(noun.english.predicate), suffix: `-${id}` });
      }
    }
    return forms;
  };
  const modes = ["positive", "negative", "question"] as const;
  const append = (grammar: LearningGrammarId, id: string, english: string, tokens: Parameters<typeof add>[2], mode: string) => {
    const before = cards.length;
    add(id, english, tokens, `${grammar}-${mode}`);
    if (cards.length > before) cards.at(-1)!.practiceGrammar = [grammar];
  };
  if (allowed.has("want-object")) for (const noun of nouns.filter(noun => noun.roles.includes("object") && noun.semanticTags?.includes("physical") && noun.wordId !== "nimotsu")) {
    for (const nounForm of nounForms(noun)) for (const mode of modes) {
      const negative = mode === "negative", question = mode === "question";
      append("want-object", `want-object-${noun.wordId}${nounForm.suffix}-${mode}`, `${question ? "Do you want" : negative ? "I don't want" : "I want"} ${nounForm.predicate}${question ? "?" : ""}`,
        [...nounForm.tokens, g("が", "thing wanted"), lex("hoshii", negative ? ["ほしくない", "ほしくない"] : ["ほしい", "ほしい"]), g("です"), ...(question ? [g("か")] : [])], mode);
    }
  }
  for (const grammar of ["want-action", "can-action"] as const) {
    if (!allowed.has(grammar)) continue;
    for (const verb of verbs) {
      const motion = motionIds.has(verb.wordId);
      if (!motion && !actionIds.has(verb.wordId)) continue;
      const objects = nouns.filter(noun => motion ? noun.roles.includes("place") && noun.wordId !== "kuni"
        : noun.roles.includes("object") && verb.objectTags?.some(tag => noun.semanticTags?.includes(tag)));
      for (const object of objects) for (const nounForm of nounForms(object)) for (const mode of modes) {
        const negative = mode === "negative", question = mode === "question";
        const englishObject = motion ? object.wordId === "ie" ? "home" : `to ${nounForm.object}` : nounForm.object;
        const start = grammar === "want-action" ? question ? "Do you want to" : negative ? "I don't want to" : "I want to"
          : question ? "Can you" : negative ? "I can't" : "I can";
        const form = learnedVerbForm(verb, grammar, negative);
        const token = lex(verb.wordId, form);
        if (token) token.explain = `${grammar === "want-action" ? negative ? "do not want to" : "want to" : negative ? "cannot" : "can"} ${verb.english.base} · ${grammar === "want-action" ? "たい form" : "potential form"}`;
        append(grammar, `${grammar}-${verb.wordId}-${object.wordId}${nounForm.suffix}-${mode}`, `${start} ${verb.english.base} ${englishObject}${question ? "?" : ""}`,
          [...nounForm.tokens, g(motion ? "に" : grammar === "can-action" ? "が" : "を", motion ? "destination" : grammar === "can-action" ? "object of ability" : "object marker"), token, ...(question ? [g("か")] : [])], mode);
        if (["taberu", "nomu"].includes(verb.wordId) && available.has("resutoran")) {
          append(grammar, `${grammar}-restaurant-${verb.wordId}-${object.wordId}${nounForm.suffix}-${mode}`, `${start} ${verb.english.base} ${englishObject} at the restaurant${question ? "?" : ""}`,
            [lex("resutoran"), g("で", "place of the action"), ...nounForm.tokens, g(grammar === "can-action" ? "が" : "を", grammar === "can-action" ? "object of ability" : "object marker"), token, ...(question ? [g("か")] : [])], mode);
        }
      }
    }
  }
  return cards;
}
