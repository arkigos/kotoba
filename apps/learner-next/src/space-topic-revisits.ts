import { cardFrame, measureCardTransition } from "./lesson-transitions";
import type { TopicCandidate } from "./topic-sequence";

/** Keep short substitution runs, but distribute ALL occurrences, not just the
 * first and last. A quarter-deck span alone allowed 70-card holes in practice. */
export function spaceTopicRevisits(cards: TopicCandidate[], introductionLength: number): TopicCandidate[] {
  const remaining = cards.slice(introductionLength);
  const ordered = cards.slice(0, introductionLength);
  const total = new Map<string, number>();
  const used = new Map<string, number>();
  const last = new Map<string, number>();
  const identity = (card: TopicCandidate) => JSON.stringify([card.card.line, card.card.tts, card.card.english]);
  const lastCard = new Map<string, number>();
  const cardTotal = new Map<string, number>();
  cards.forEach(card => cardTotal.set(identity(card), (cardTotal.get(identity(card)) ?? 0) + 1));
  const frameTotal = new Map<string, number>();
  const frameUsed = new Map<string, number>();
  cards.forEach(card => { const frame = cardFrame(card.card); frameTotal.set(frame, (frameTotal.get(frame) ?? 0) + 1); });
  cards.forEach(card => card.targets.forEach(id => total.set(id, (total.get(id) ?? 0) + 1)));
  const record = (card: TopicCandidate, index: number) => {
    const frame = cardFrame(card.card);
    frameUsed.set(frame, (frameUsed.get(frame) ?? 0) + 1);
    lastCard.set(identity(card), index);
    card.targets.forEach(id => { used.set(id, (used.get(id) ?? 0) + 1); last.set(id, index); });
  };
  ordered.forEach(record);
  let run = 0;
  while (remaining.length) {
    const index = ordered.length, previous = ordered.at(-1)!;
    const previousFrame = cardFrame(previous.card);
    let frameRun = 0;
    for (let i = ordered.length - 1; i >= 0 && cardFrame(ordered[i].card) === previousFrame; i--) frameRun++;
    const copiesLeft = new Map<string, number>();
    remaining.forEach(card => copiesLeft.set(identity(card), (copiesLeft.get(identity(card)) ?? 0) + 1));
    const urgency = (id: string) => {
      const count = total.get(id)!, seen = used.get(id) ?? 0;
      const interval = cards.length / count;
      // Both an overdue return and a lag behind the overall lesson matter.
      return (index - (last.get(id) ?? -interval)) / interval
        + (index / cards.length * count - seen) * .7;
    };
    const scores = remaining.map(card => {
      const needs = card.targets.map(urgency);
      const step = measureCardTransition(previous.card, card.card);
      const repeat = step.kind === "repeat";
      const cardDistance = index - (lastCard.get(identity(card)) ?? -cards.length);
      // A-B-A is still a loop even when A and B are valid substitutions.
      // Prefer an unseen/distant example; retain a fallback for tiny pools.
      const recentRepeat = Math.max(0, 5 - cardDistance) * 4;
      // Reserve room for later copies now; a local cooldown alone can defer a
      // fixed phrase until the remaining deck consists only of that phrase.
      const copies = copiesLeft.get(identity(card))!;
      // Five-card spacing is impossible when one safe sentence occurs eight
      // times in a 24-card lesson. Use its feasible interval; an impossible
      // deadline otherwise forces a burst of identical sentences up front.
      const gap = Math.max(1, Math.min(5, Math.floor(cards.length / cardTotal.get(identity(card))!)));
      const deadline = cards.length - 1 - (copies - 1) * gap;
      const mustPlace = copies > 1 && index >= deadline ? 100 + index - deadline : 0;
      const continuity = step.kind === "neighbor" && run < 3 ? step.lexicalChanges === 1 ? 4 : .6 : 0;
      // Do not exhaust a word early just to complete a local pattern run.
      const earlyFinish = card.targets.filter(id => (used.get(id) ?? 0) === total.get(id)! - 1 && index < cards.length * .8).length;
      // A shared action can run far ahead of the noun targets. Do not spend its
      // whole allowance in two substitution runs and leave half the deck empty.
      const ahead = Math.max(...card.targets.map(id => Math.max(0,
        (used.get(id) ?? 0) + 1 - (index + 1) / cards.length * total.get(id)! - 1.5)));
      const overdue = Math.max(...card.targets.map(id => Math.max(0,
        (index - (last.get(id) ?? 0)) / (cards.length / total.get(id)!) - 2)));
      const longRun = frameRun >= 4 && cardFrame(card.card) === previousFrame ? 8 : 0;
      // Preserve pattern variety near the end too. Target spacing alone can
      // leave ten different nouns all waiting for the same possession frame.
      const frame = cardFrame(card.card);
      const frameDeficit = (index + 1) / cards.length * frameTotal.get(frame)! - (frameUsed.get(frame) ?? 0);
      return Math.max(...needs) + needs.reduce((a, b) => a + b, 0) / needs.length * .3
        + continuity + mustPlace + overdue * 8 + frameDeficit * 1.5 - (repeat ? 10 : 0) - recentRepeat - earlyFinish * 2 - ahead * 5 - longRun;
    });
    const different = remaining.flatMap((card, i) => identity(card) !== identity(previous) ? [i] : []);
    const eligible = different.length ? different : scores.map((_, i) => i);
    let best = eligible[0];
    for (const i of eligible) if (scores[i] > scores[best]) best = i;
    const next = remaining.splice(best, 1)[0];
    run = measureCardTransition(previous.card, next.card).kind === "neighbor" && run < 3 ? run + 1 : 0;
    ordered.push(next); record(next, index);
  }
  return ordered;
}
