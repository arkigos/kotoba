import { wordBindings } from "../../../packages/dictionary";
import { changedSlots } from "../../../packages/learning-engine/sequence";
import type { Sentence } from "../../../packages/learning-engine/types";
import type { CardToken, PracticeCard } from "./types";

type TransitionCard = PracticeCard & { derivation?: Sentence };
export type CardTransition = {
  kind: "repeat" | "neighbor" | "boundary";
  changedTokenIndices: number[];
  /** Frozen cards count changed content positions, not inferred grammatical slots. */
  lexicalChanges: number;
  grammarChanged: boolean;
  basis: "tokens" | "slots";
};

function sameForm(previous: CardToken | undefined, next: CardToken | undefined) {
  return previous?.surface === next?.surface && previous?.reading === next?.reading;
}

function isContent(token: CardToken | undefined, standalone = false) {
  if (!token?.wordId) return false;
  const binding = wordBindings[token.wordId];
  // Imported POS never grants a grammatical role. A standalone word needs none.
  return binding ? typeof binding.introducedInUnit === "number" : true;
}

function lemmaId(token: CardToken) {
  return token.wordId ? wordBindings[token.wordId]?.entryId ?? token.dictionaryEntryId ?? token.wordId : undefined;
}

/** A conservative grouping key, not a claim that a frozen card has a reviewed AST. */
export function cardFrame(card: PracticeCard): string {
  return JSON.stringify([card.constructionKey ?? null, card.tokens.map(token => isContent(token, card.tokens.length === 1)
    ? ["word"] : ["fixed", token.surface, token.reading])]);
}

/**
 * Reviewed derivations measure independent choices. Frozen cards only measure
 * their authored token positions: particles, order, and inflection changes must
 * not disappear through a set difference or canonical vocabulary alias mapping.
 */
export function measureCardTransition(previous: TransitionCard, next: TransitionCard): CardTransition {
  const changedTokenIndices = Array.from({ length: Math.max(previous.tokens.length, next.tokens.length) }, (_, index) => index)
    .filter(index => !sameForm(previous.tokens[index], next.tokens[index]));
  const before = previous.derivation;
  const after = next.derivation;
  if (before && after) {
    const grammarChanged = before.construction !== after.construction
      || before.features.tense !== after.features.tense
      || before.features.polarity !== after.features.polarity
      || before.features.question !== after.features.question;
    const lexicalChanges = changedSlots(before, after).length;
    return { kind: grammarChanged ? "boundary" : !changedTokenIndices.length ? "repeat"
      : lexicalChanges >= 1 && lexicalChanges <= 2 ? "neighbor" : "boundary",
    changedTokenIndices, lexicalChanges, grammarChanged, basis: "slots" };
  }
  if (!previous.tokens.length || !next.tokens.length) {
    return { kind: "boundary", changedTokenIndices, lexicalChanges: 0, grammarChanged: true, basis: "tokens" };
  }
  // Identity metadata may differ between two snapshots of the same visible card.
  if (!changedTokenIndices.length) {
    return { kind: "repeat", changedTokenIndices, lexicalChanges: 0, grammarChanged: false, basis: "tokens" };
  }
  const standalone = previous.tokens.length === 1 && next.tokens.length === 1;
  const lexicalChanges = changedTokenIndices.filter(index =>
    isContent(previous.tokens[index], standalone) || isContent(next.tokens[index], standalone)).length;
  const sameLemmaFormChange = changedTokenIndices.some(index => {
    const prior = previous.tokens[index];
    const following = next.tokens[index];
    return prior && following && lemmaId(prior) && lemmaId(prior) === lemmaId(following);
  });
  // A dictionary entry can be an entire phrase. Two one-token cards do not
  // establish a shared sentence frame (e.g. どこ and どちらから？).
  const danglingParticle = [previous, next].some(card => /^(は|が|を|に|へ|で|と|の|も)$/.test(card.tokens.at(-1)?.surface ?? ""));
  const grammarChanged = standalone || danglingParticle || cardFrame(previous) !== cardFrame(next) || sameLemmaFormChange;
  return { kind: !grammarChanged && lexicalChanges >= 1 && lexicalChanges <= 2 ? "neighbor" : "boundary",
    changedTokenIndices, lexicalChanges, grammarChanged, basis: "tokens" };
}
