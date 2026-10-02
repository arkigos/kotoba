import { orderDrillCards } from "./drill-order";
import { cardFrame, measureCardTransition } from "./lesson-transitions";
import { assertLessonCardQuality, uniqueContextCards } from "./lesson-card-quality";
import type { PracticeCard } from "./types";

export type TopicCandidate = { card: PracticeCard; targets: string[]; unknown: string[] };
export type TopicStep = { kind: "start" | "neighbor" | "boundary" | "repeat"; lexicalChanges: number; grammarChanged: boolean; basis: "tokens" | "slots" };
export type TopicPacing = { appearanceGoal: number; minimumAppearances: number; targetDensity: number; baselineCards: number; singleChanges: number; doubleChanges: number; boundaries: number; repeats: number; targetCountSpread?: number; limitedTargets?: string[] };
export const LESSON_CARD_LIMIT = 24;
export const TOTAL_CARD_LIMIT = 48;

/** Balance selected vocabulary, then drill each frame in a small-change run. */
export function sequenceTopicCards(targets: string[], candidates: TopicCandidate[], options: { cardCount?: number; appearanceGoal?: number; minimumAppearances?: number; baselineCards?: number; grammarGoals?: Record<string, number>; helperRanks?: Record<string, number> } = {}) {
  if (options.cardCount !== undefined && (!Number.isInteger(options.cardCount) || options.cardCount < 1 || options.cardCount > TOTAL_CARD_LIMIT)) throw new Error(`Choose a whole number of cards between 1 and ${TOTAL_CARD_LIMIT}.`);
  const limit = Math.min(options.cardCount ?? LESSON_CARD_LIMIT, LESSON_CARD_LIMIT);
  const pool = uniqueContextCards(candidates.filter(row => row.targets.length && row.unknown.length === 0)).sort((a, b) => a.card.id.localeCompare(b.card.id));
  const missing = targets.filter(id => !pool.some(row => row.targets.includes(id)));
  if (!targets.length || missing.length) throw new Error(`No supported sentence context for: ${missing.join(", ") || "this selection"}. Add compatible target words or choose another selection. One-word cards are not allowed.`);
  const goal = Math.max(1, Math.min(8, options.appearanceGoal ?? 4));
  const counts: Record<string, number> = Object.fromEntries(targets.map(id => [id, 0]));
  const supply = Object.fromEntries(targets.map(id => [id, pool.filter(row => row.targets.includes(id)).length]));
  const penalty = (n: number) => (n === 0 ? 100000 : 0) + Math.max(0, goal - n) ** 2 + 2 * Math.max(0, n - goal) ** 2;
  const chosen: TopicCandidate[] = [], frames = new Map<string, number>();
  while (pool.length && chosen.length < limit) {
    let best = -1, gain = -Infinity, continuity = -Infinity;
    pool.forEach((row, index) => {
      const improvement = row.targets.reduce((sum, id) => sum + penalty(counts[id]) - penalty(counts[id] + 1), 0);
      const matchingFrame = frames.get(cardFrame(row.card)) ?? 0;
      if (improvement > gain || improvement === gain && matchingFrame > continuity) { best = index; gain = improvement; continuity = matchingFrame; }
    });
    if (gain <= 0 && targets.every(id => counts[id] > 0)) break;
    const row = pool.splice(best, 1)[0];
    chosen.push(row); row.targets.forEach(id => counts[id]++);
    const frame = cardFrame(row.card); frames.set(frame, (frames.get(frame) ?? 0) + 1);
  }
  if (targets.some(id => !counts[id])) throw new Error(`Not every selected word fits within ${limit} unique sentence cards. Select fewer words or raise the card limit.`);
  // Repair greedy imbalance without changing coverage or the card ceiling.
  for (let pass = 0; pass < 12; pass++) {
    let bestGain = 0, outgoing = -1, incoming = -1;
    chosen.forEach((old, a) => pool.forEach((next, b) => {
      const changes = new Map<string, number>();
      old.targets.forEach(id => changes.set(id, -1));
      next.targets.forEach(id => changes.set(id, (changes.get(id) ?? 0) + 1));
      if ([...changes].some(([id, delta]) => counts[id] + delta <= 0)) return;
      const gain = [...changes].reduce((sum, [id, delta]) => sum + penalty(counts[id]) - penalty(counts[id] + delta), 0);
      if (gain > bestGain) { bestGain = gain; outgoing = a; incoming = b; }
    }));
    if (outgoing < 0) break;
    const old = chosen[outgoing], next = pool[incoming];
    old.targets.forEach(id => counts[id]--); next.targets.forEach(id => counts[id]++);
    chosen[outgoing] = next; pool[incoming] = old;
  }
  const cards = orderDrillCards(chosen).map(row => row.card);
  assertLessonCardQuality(cards);
  const steps: TopicStep[] = cards.map((card, index) => index ? measureCardTransition(cards[index - 1], card) : { kind: "start", lexicalChanges: 0, grammarChanged: false, basis: "tokens" });
  const values = Object.values(counts);
  const pacing: TopicPacing = { appearanceGoal: goal, minimumAppearances: Math.min(...values), targetDensity: values.reduce((a, b) => a + b, 0) / cards.length,
    baselineCards: limit, singleChanges: steps.filter(s => s.kind === "neighbor" && s.lexicalChanges === 1).length,
    doubleChanges: steps.filter(s => s.kind === "neighbor" && s.lexicalChanges === 2).length, boundaries: steps.filter(s => s.kind === "boundary").length, repeats: 0,
    targetCountSpread: Math.max(...values) - Math.min(...values), limitedTargets: targets.filter(id => supply[id] < goal) };
  return { cards, appearances: counts, helperWordIds: [...new Set(cards.flatMap(card => card.tokens.flatMap(token => token.wordId && !targets.includes(token.wordId) ? [token.wordId] : [])))], steps, pacing };
}
