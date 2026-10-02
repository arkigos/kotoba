import { a1WordMetadata } from "../dictionary/a1";
import { dictionaryWord } from "../dictionary";
import { exampleLexicon } from "./examples";
import { fitsSlot, realizeSentence, requiredGrammar, semanticCompatibility, slots } from "./grammar";
import { personalConstructionCandidates } from "./personalized-frames";
import { dailyLifeCandidates } from "./daily-life-frames";
import { homeCandidates } from "./home-frames";
import { schoolCandidates } from "./school-frames";
import { shoppingCandidates } from "./shopping-frames";
import { leisureCandidates } from "./leisure-frames";
import { restaurantCandidates } from "./restaurant-frames";
import { transportCandidates } from "./transport-frames";
import { scheduleCandidates } from "./schedule-frames";
import { learningGrammarCandidates } from "./learning-grammar";
import type { ConstructionId, Lexeme, Noun, PracticeCard } from "./types";

export const PERSONALIZED_ENGINE_VERSION = "2.0.0";
const canonical = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;
const features = { tense: "nonpast", polarity: "positive", question: false } as const;
const constructions: ConstructionId[] = ["action", "motion", "i-predicate", "na-predicate"];
const actionVerbs = new Set(["yomu", "kaku", "nomu", "taberu", "kiru", "hanasu", "kiku", "miru"]);
function contentId(text: string): string {
  let a = 2166136261, b = 3339675911;
  for (let i = 0; i < text.length; i++) { a = Math.imul(a ^ text.charCodeAt(i), 16777619); b = Math.imul(b ^ text.charCodeAt(i), 2246822519); }
  return `pc-${(a >>> 0).toString(16)}${(b >>> 0).toString(16)}`;
}

/** Personalized lessons use licensed constructions and senses. Frozen curriculum
 * is not a source of new lesson candidates. Unsupported words remain
 * unsupported until a reviewed context exists; imported POS grants no role. */
export function personalizedCandidates(targetIds: readonly string[], knownIds: ReadonlySet<string>, knownGrammar: ReadonlySet<string> = new Set()): PracticeCard[] {
  const selected = new Set(targetIds.map(canonical));
  const allowed = new Set([...selected, ...knownIds].map(canonical));
  const availableExact = new Set([...targetIds, ...knownIds]);
  const entries: Lexeme[] = [];
  for (const entry of exampleLexicon.entries) {
    if (!allowed.has(canonical(entry.wordId))) continue;
    const selectedAliases = targetIds.filter(id => canonical(id) === canonical(entry.wordId));
    for (const id of selectedAliases.length ? selectedAliases : [entry.wordId]) {
      availableExact.add(entry.wordId);
      // Keep the reviewed lemma/conjugation. Only the explicit learning identity
      // changes for an approved alias; never conjugate an imported polite form.
      entries.push({ ...entry, id: `${entry.id}:${id}`, wordId: id, dictionaryEntryId: dictionaryWord(id)?.dictionaryEntryId } as Lexeme);
    }
  }
  const authors = [personalConstructionCandidates, dailyLifeCandidates, homeCandidates,
    schoolCandidates, (pool: ReadonlySet<string>) => shoppingCandidates(pool, selected),
    leisureCandidates, restaurantCandidates, transportCandidates, scheduleCandidates];
  const output: PracticeCard[] = [...authors.flatMap(author => author(availableExact)), ...learningGrammarCandidates(availableExact, knownGrammar)]
    .filter(card => card.tokens.some(token => token.wordId && selected.has(canonical(token.wordId))));
  const targets = entries.filter(entry => selected.has(canonical(entry.wordId)));
  for (const target of targets) for (const construction of constructions) {
    const names = slots[construction];
    for (const targetSlot of names.filter(slot => fitsSlot(construction, slot, target))) {
      const choices = names.map(slot => slot === targetSlot ? [target] : entries.filter(entry => fitsSlot(construction, slot, entry))
        .sort((a, b) => Number(selected.has(canonical(b.wordId))) - Number(selected.has(canonical(a.wordId)))).slice(0, 32));
      const bound: Record<string, Lexeme> = {};
      let accepted = 0;
      const coverageUses = new Map<string, number>();
      const visit = (depth: number) => {
        if (accepted >= 96) return;
        if (depth < names.length) { for (const entry of choices[depth]) { bound[names[depth]] = entry; visit(depth + 1); if (accepted >= 96) break; } return; }
        if (semanticCompatibility(construction, bound)) return;
        if (construction === "action" && !actionVerbs.has(canonical(bound.verb.wordId))) return;
        // 国 names a category, not a destination with a specified referent.
        if (construction === "motion" && bound.destination.wordId === "kuni") return;
        // Country-name fame is a vacuous teaching claim. Landmark/event fame
        // is licensed by reviewed exact senses in the personal frames.
        if (bound.predicate?.wordId === "yuumei" && ["nihon", "oosutoraria", "supein", "tai", "firipin", "roshia", "kuni"].includes(bound.subject.wordId)) return;
        // The clean sense of kirei is not the attractive-person sense. Keep the
        // latter in its explicit frame rather than translating people as tidy.
        if (bound.predicate?.wordId === "kiree-na" && (bound.subject as Noun).semanticTags?.includes("person")) return;
        const signature = [...new Set(Object.values(bound).filter(entry => selected.has(canonical(entry.wordId))).map(entry => entry.wordId))].sort().join("|");
        if ((coverageUses.get(signature) ?? 0) >= 4) return;
        const lexical = [...new Map(Object.values(bound).map(entry => [entry.id, entry])).values()];
        const bindings = Object.fromEntries(names.map(name => [name, bound[name].id]));
        const card = realizeSentence({ construction, bindings, features }, { version: exampleLexicon.version, entries: lexical }, lexical.map(entry => entry.id), requiredGrammar(construction, features));
        // Personalized snapshots replay exact tokens. They do not need the old
        // recipe editor's derivation tree or long sense IDs repeated per card.
        const { derivation, senseIds, audioPolicy, ...materialized } = card;
        materialized.constructionKey = construction;
        materialized.id = contentId(JSON.stringify([card.tokens, card.english]));
        output.push(materialized); accepted++; coverageUses.set(signature, (coverageUses.get(signature) ?? 0) + 1);
      };
      visit(0);
    }
  }
  // Existing basic ほしい contexts also give real grammar practice, never credit
  // from merely having the adjective in a saved/priority list.
  output.forEach(card => { if (card.tokens.some(token => token.wordId === "hoshii") && card.tokens.some(token => token.surface === "が")) card.practiceGrammar = ["want-object"]; });
  return [...new Map(output.map(card => [JSON.stringify([card.line, card.tts, card.english]), card])).values()]
    .map(card => ({ ...card, id: contentId(JSON.stringify([card.tokens, card.english])) }));
}
