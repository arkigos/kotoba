import { cardFrame } from "./lesson-transitions";
import { lessonConceptId } from "./lesson-vocabulary";
import type { TopicCandidate } from "./topic-sequence";

/** Equal target coverage and grammar, but older familiar helpers win where
 * interchangeable. A recent word remains available when it is needed. */
export function preferOlderContexts(chosen: TopicCandidate[], candidates: TopicCandidate[], ranks: Record<string, number>) {
  const selected = new Set(chosen.flatMap(row => row.targets).map(lessonConceptId));
  const key = (row: TopicCandidate) => JSON.stringify([[...row.targets].sort(), cardFrame(row.card)]);
  const score = (row: TopicCandidate) => {
    const helpers = [...new Set(row.card.tokens.flatMap(token => token.wordId && !selected.has(lessonConceptId(token.wordId)) ? [lessonConceptId(token.wordId)] : []))];
    return helpers.length ? helpers.reduce((sum, id) => sum + (ranks[id] ?? Object.keys(ranks).length), 0) / helpers.length : -1;
  };
  const groups = new Map<string, TopicCandidate[]>();
  for (const row of candidates) if (!row.unknown.length) { const group = key(row); groups.set(group, [...(groups.get(group) ?? []), row]); }
  const uses = new Map<string, number>();
  return chosen.map(row => {
    const options = groups.get(key(row)) ?? [row];
    const currentScore = score(row);
    // Equal recency is not a reason to discard the planner's selected variety.
    const choice = [...options].filter(option => score(option) < currentScore && (uses.get(option.card.id) ?? 0) < 3)
      .sort((a, b) => score(a) - score(b) || (uses.get(a.card.id) ?? 0) - (uses.get(b.card.id) ?? 0))[0] ?? row;
    uses.set(choice.card.id, (uses.get(choice.card.id) ?? 0) + 1);
    return choice;
  });
}
