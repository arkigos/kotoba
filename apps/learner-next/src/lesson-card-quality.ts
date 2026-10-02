import type { PracticeCard } from "./types";

const normalize = (value: string) => value.normalize("NFKC").replace(/[\p{P}\p{Z}\s]/gu, "");
export const sentenceIdentity = (card: PracticeCard) => normalize(card.tokens.map(token => token.reading || token.surface).join(""));
export const sentenceSurface = (card: PracticeCard) => normalize(card.line.join(""));
export const isContextCard = (card: PracticeCard) => card.tokens.filter(token => normalize(token.surface)).length > 1;

export function uniqueContextCards<T extends { card: PracticeCard }>(rows: readonly T[]): T[] {
  const readings = new Set<string>(), surfaces = new Set<string>();
  return rows.filter(({card}) => {
    const reading = sentenceIdentity(card), surface = sentenceSurface(card);
    if (!isContextCard(card) || !reading || !surface || readings.has(reading) || surfaces.has(surface)) return false;
    readings.add(reading); surfaces.add(surface); return true;
  });
}

/** Hard generation boundary: no ID/translation/punctuation loopholes. */
export function assertLessonCardQuality(cards: readonly PracticeCard[], allowSocialExpressions = false) {
  if (!cards.length) throw new Error("This selection has no supported sentence cards. Choose compatible words.");
  if (cards.some(card => !isContextCard(card) && !(allowSocialExpressions && card.kind === "social-expression"))) throw new Error("One-word cards are not allowed. Choose words with supported sentence contexts.");
  if (new Set(cards.map(sentenceIdentity)).size !== cards.length || new Set(cards.map(sentenceSurface)).size !== cards.length) throw new Error("Repeated sentences are not allowed in a lesson, including review cards.");
}
