import { a1WordMetadata } from "../../../packages/dictionary/a1";
import type { PracticeCard } from "./types";

type SelectionOptions = {
  rankedNewWordIds: readonly string[];
  rankedReviewWordIds: readonly string[];
  newCount: number;
  reviewCount: number;
  priorityWordIds: Iterable<string>;
  cards: readonly PracticeCard[];
};

const canonical = (id: string) => a1WordMetadata[id]?.coreWordId ?? id;
const popcount = (value: number) => { let count = 0; for (; value; value &= value - 1) count += 1; return count; };

/** Pairing is a selection heuristic, not a promise about final lesson length.
 * Matching rewards useful object/action pairs over one hub with many nouns.
 * The small default pool is solved exactly; larger custom pools use a bounded
 * greedy matching so selection never creates an exponential UI delay. */
function pairedCount(adjacency: number[]) {
  if (adjacency.length > 16) {
    let remaining = (2 ** adjacency.length - 1) >>> 0, pairs = 0;
    while (remaining) {
      const vertices = adjacency.map((_, index) => index).filter(index => remaining & (1 << index));
      const first = vertices.sort((a, b) => popcount(adjacency[a] & remaining) - popcount(adjacency[b] & remaining))[0];
      remaining &= ~(1 << first);
      const neighbor = vertices.filter(index => remaining & adjacency[first] & (1 << index))
        .sort((a, b) => popcount(adjacency[a] & remaining) - popcount(adjacency[b] & remaining))[0];
      if (neighbor !== undefined) { remaining &= ~(1 << neighbor); pairs += 1; }
    }
    return pairs;
  }
  const memo = new Map<number, number>();
  const solve = (mask: number): number => {
    if (!mask) return 0;
    const cached = memo.get(mask);
    if (cached !== undefined) return cached;
    const first = 31 - Math.clz32(mask & -mask);
    const rest = mask & ~(1 << first);
    const upperBound = Math.floor(popcount(mask) / 2);
    let best = 0;
    for (let neighbors = adjacency[first] & rest; neighbors; neighbors &= neighbors - 1) {
      const neighbor = neighbors & -neighbors;
      best = Math.max(best, 1 + solve(rest & ~neighbor));
      if (best === upperBound) { memo.set(mask, best); return best; }
    }
    best = Math.max(best, solve(rest));
    memo.set(mask, best);
    return best;
  };
  return solve(2 ** adjacency.length - 1);
}

/** Select only from the supplied topic queues. The locked new-word prefix makes
 * even isolated expressions reachable; connected words cannot postpone it.
 * Call only for automatic selection, never for an explicit learner selection. */
export function selectConnectedTopicWords(options: SelectionOptions): string[] {
  const { newCount, reviewCount, cards } = options;
  const queues = [[...new Set(options.rankedNewWordIds)], [...new Set(options.rankedReviewWordIds)]];
  const quotas = [newCount, reviewCount];
  if (quotas.some((count, index) => !Number.isInteger(count) || count < 0 || count > queues[index].length)
    || newCount + reviewCount > 30 || queues[0].some(id => queues[1].includes(id))) {
    throw new Error("Topic word quotas must fit distinct new and review pools, up to 30 targets.");
  }
  const baseline = queues.flatMap((queue, index) => queue.slice(0, quotas[index]));
  if (!baseline.length) return [];
  const pool = new Set(queues.flat());
  const graph = new Map([...pool].map(id => [id, new Set<string>()]));
  for (const card of cards) {
    const ids = [...new Set(card.tokens.flatMap(token => token.wordId ? [canonical(token.wordId)] : []))];
    // With at most four lexical identities, any scored pair can occur with at
    // most two other unknown words. Larger contexts can still be used by the
    // planner; they simply do not establish a safe fresh-profile pairing here.
    if (ids.length > 4) continue;
    const targets = ids.filter(id => pool.has(id));
    for (const a of targets) for (const b of targets) if (a !== b) graph.get(a)!.add(b);
  }
  if (![...graph.values()].some(neighbors => neighbors.size)) return baseline;

  const priority = new Set([...options.priorityWordIds].map(canonical));
  const locked = queues.map((queue, index) => new Set([
    ...queue.slice(0, Math.min(index === 0 ? 3 : 1, quotas[index])),
    ...queue.slice(0, quotas[index]).filter(id => priority.has(canonical(id))),
  ]));
  const belongsToNew = new Set(queues[0]);
  const groupFor = (id: string) => belongsToNew.has(id) ? 0 : 1;
  const rank = new Map(queues.flat().map((id, index) => [id, index]));
  const score = (ids: string[]) => {
    const adjacency = ids.map(a => ids.reduce((mask, b, index) => graph.get(a)!.has(b) ? mask | (1 << index) : mask, 0));
    const degrees = adjacency.map(popcount);
    return pairedCount(adjacency) * 100000 + degrees.filter(Boolean).length * 1000 + degrees.reduce((sum, degree) => sum + degree, 0);
  };
  let selected = locked.flatMap(group => [...group]);
  const available = () => queues.flat().filter(id => !selected.includes(id)
    && selected.filter(chosen => groupFor(chosen) === groupFor(id)).length < quotas[groupFor(id)]);
  while (selected.length < baseline.length) {
    const candidates = available();
    const scores = new Map(candidates.map(id => [id, score([...selected, id])]));
    candidates.sort((a, b) => scores.get(b)! - scores.get(a)! || graph.get(b)!.size - graph.get(a)!.size || rank.get(a)! - rank.get(b)!);
    selected.push(candidates[0]);
  }
  if (score(baseline) > score(selected)) selected = [...baseline];

  // Limit swaps and candidates independently of dictionary size. This is a
  // heuristic improvement, not an expensive search for a global optimum.
  let bestScore = score(selected);
  for (let pass = 0; pass < 2; pass += 1) {
    let improvement: string[] | undefined;
    for (let position = 0; position < selected.length; position += 1) {
      const group = groupFor(selected[position]);
      if (locked[group].has(selected[position])) continue;
      const candidates = queues[group].filter(id => !selected.includes(id))
        .sort((a, b) => selected.filter(id => graph.get(b)!.has(id)).length - selected.filter(id => graph.get(a)!.has(id)).length
          || graph.get(b)!.size - graph.get(a)!.size || rank.get(a)! - rank.get(b)!).slice(0, 40);
      for (const alternative of candidates) {
        const candidate = selected.map((id, index) => index === position ? alternative : id);
        const candidateScore = score(candidate);
        if (candidateScore > bestScore) { bestScore = candidateScore; improvement = candidate; }
      }
    }
    if (!improvement) break;
    selected = improvement;
  }
  const selectedSet = new Set(selected);
  return queues.flatMap(queue => queue.filter(id => selectedSet.has(id)));
}
