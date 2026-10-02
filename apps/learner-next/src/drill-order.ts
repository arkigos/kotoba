import { cardFrame, measureCardTransition } from "./lesson-transitions";
import type { TopicCandidate } from "./topic-sequence";

/** Keep frames together. Space separate practice occasions, not every card. */
export function orderDrillCards(candidates: TopicCandidate[]): TopicCandidate[] {
  const blocks = new Map<string, TopicCandidate[]>();
  for (const row of candidates) { const key = cardFrame(row.card); blocks.set(key, [...(blocks.get(key) ?? []), row]); }
  const ordered: TopicCandidate[] = [];
  const pending = [...blocks.values()].sort((a, b) => b.length - a.length || a[0].card.id.localeCompare(b[0].card.id));
  while (pending.length) {
    const block = pending.shift()!;
    const cost = block.map(a => block.map(b => { const step = measureCardTransition(a.card, b.card); return step.kind === "neighbor" ? step.lexicalChanges - 1 : 100 + step.lexicalChanges; }));
    let best: number[] = [], bestCost = Infinity;
    for (let start = 0; start < block.length; start++) {
      const path = [start], remaining = new Set(block.map((_, i) => i).filter(i => i !== start));
      while (remaining.size) {
        const last = path.at(-1)!;
        const next = [...remaining].sort((a, b) => cost[last][a] - cost[last][b] || a - b)[0];
        path.push(next); remaining.delete(next);
      }
      const score = path.slice(1).reduce((sum, id, i) => sum + cost[path[i]][id], 0);
      const entrance = ordered.length ? measureCardTransition(ordered.at(-1)!.card, block[start].card).lexicalChanges : start * .001;
      if (score + entrance * .01 < bestCost) { best = path; bestCost = score + entrance * .01; }
    }
    for (let pass = 0; pass < 12; pass++) {
      let improved = false;
      for (let a = 1; a < best.length - 1; a++) for (let b = a + 1; b < best.length; b++) {
        const before = cost[best[a - 1]][best[a]] + (b + 1 < best.length ? cost[best[b]][best[b + 1]] : 0);
        const after = cost[best[a - 1]][best[b]] + (b + 1 < best.length ? cost[best[a]][best[b + 1]] : 0);
        if (after < before) { best.splice(a, b - a + 1, ...best.slice(a, b + 1).reverse()); improved = true; }
      }
      if (!improved) break;
    }
    ordered.push(...best.map(index => block[index]));
    if (pending.length > 1) pending.sort((a, b) => {
      const previous = ordered.at(-1)!.card;
      return Math.min(...a.map(row => measureCardTransition(previous, row.card).lexicalChanges)) - Math.min(...b.map(row => measureCardTransition(previous, row.card).lexicalChanges)) || b.length - a.length;
    });
  }
  return ordered;
}
