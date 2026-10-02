import { measureCardTransition } from "./lesson-transitions";
import type { TopicCandidate } from "./topic-sequence";

const REPAIR_LIMIT = 20_000;
const IMPROVEMENT_LIMIT = 60_000;

/** Improve continuity without changing the first card or the exact multiset.
 * Repeated words may form local bursts, but their first-to-last span should
 * cover at least a quarter of the deck. Existing shorter spans can improve;
 * continuity optimization may never shorten them further. */
export function smoothTopicOrder(candidates: TopicCandidate[], options: { preserveIntroductions?: boolean } = {}): TopicCandidate[] {
  const order = [...candidates];
  if (order.length < 3) return order;
  const desiredSpan = Math.floor(order.length / 4);
  const cache = new Map<TopicCandidate, Map<TopicCandidate, number>>();
  const cost = (from: TopicCandidate, to: TopicCandidate) => {
    let row = cache.get(from);
    if (!row) { row = new Map(); cache.set(from, row); }
    const cached = row.get(to);
    if (cached !== undefined) return cached;
    const step = measureCardTransition(from.card, to.card);
    const value = step.kind === "repeat" ? 8 : step.kind === "boundary" ? 6 : step.lexicalChanges === 2 ? 1 : 0;
    row.set(to, value);
    return value;
  };
  let positions = new Map<string, number[]>();
  let forward: number[] = [], backward: number[] = [];
  const refresh = () => {
    positions = new Map();
    order.forEach((candidate, index) => {
      for (const id of new Set(candidate.targets)) {
        const list = positions.get(id) ?? [];
        list.push(index); positions.set(id, list);
      }
    });
    forward = [0]; backward = [0];
    for (let index = 1; index < order.length; index += 1) {
      forward[index] = forward[index - 1] + cost(order[index - 1], order[index]);
      backward[index] = backward[index - 1] + cost(order[index], order[index - 1]);
    }
  };
  refresh();
  const introductionDeadlines = options.preserveIntroductions ? new Map([...positions].map(([id, list]) => [id, list[0]])) : undefined;
  const pairCost = (first: number, second: number) => {
    const edges = [...new Set([first, first + 1, second, second + 1])].filter(index => index < order.length);
    const at = (index: number) => order[index === first ? second : index === second ? first : index];
    return edges.reduce((sum, index) => sum + cost(at(index - 1), at(index)) - cost(order[index - 1], order[index]), 0);
  };
  const pairSpread = (first: number, second: number): number | undefined => {
    let gain = 0;
    const affected = new Set([...order[first].targets, ...order[second].targets]);
    for (const id of affected) {
      const list = positions.get(id)!;
      if (list.length < 2) {
        const movedTo = order[first].targets.includes(id) ? second : first;
        if (introductionDeadlines && movedTo > introductionDeadlines.get(id)!) return undefined;
        continue;
      }
      const inFirst = order[first].targets.includes(id), inSecond = order[second].targets.includes(id);
      if (inFirst === inSecond) continue;
      const removed = inFirst ? first : second, added = inFirst ? second : first;
      const oldSpan = list.at(-1)! - list[0];
      const nextFirst = Math.min(added, list[0] === removed ? list[1] : list[0]);
      const nextLast = Math.max(added, list.at(-1) === removed ? list.at(-2)! : list.at(-1)!);
      const nextSpan = nextLast - nextFirst;
      if (introductionDeadlines && nextFirst > introductionDeadlines.get(id)!) return undefined;
      if (nextSpan < Math.min(oldSpan, desiredSpan)) return undefined;
      gain += Math.max(0, desiredSpan - oldSpan) - Math.max(0, desiredSpan - nextSpan);
    }
    return gain;
  };
  const lowerBound = (list: number[], value: number) => {
    let low = 0, high = list.length;
    while (low < high) { const middle = (low + high) >>> 1; if (list[middle] < value) low = middle + 1; else high = middle; }
    return low;
  };
  const reversalAllowed = (first: number, last: number) => {
    for (const [id, list] of positions) {
      if (list.length < 2 || list.at(-1)! < first || list[0] > last) continue;
      const oldSpan = list.at(-1)! - list[0];
      const nextFirst = list[0] < first ? list[0] : first + last - list[lowerBound(list, last + 1) - 1];
      const nextLast = list.at(-1)! > last ? list.at(-1)! : first + last - list[lowerBound(list, first)];
      if (introductionDeadlines && nextFirst > introductionDeadlines.get(id)!) return false;
      if (nextLast - nextFirst < Math.min(oldSpan, desiredSpan)) return false;
    }
    return true;
  };
  const reversalCost = (first: number, last: number) => {
    let difference = cost(order[first - 1], order[last]) - cost(order[first - 1], order[first]);
    if (last + 1 < order.length) difference += cost(order[first], order[last + 1]) - cost(order[last], order[last + 1]);
    // Include internal directional costs rather than assuming symmetry.
    return difference + backward[last] - backward[first] - forward[last] + forward[first];
  };
  const swap = (first: number, second: number) => { [order[first], order[second]] = [order[second], order[first]]; refresh(); };
  // Repair an existing single burst before optimizing transitions. Consider
  // endpoint occurrences, and prefer the least transition cost for equal gain.
  let repairs = 0;
  for (let pass = 0; pass < 30 && repairs < REPAIR_LIMIT; pass += 1) {
    const endpoints = [...new Set([...positions.values()].filter(list => list.length > 1 && list.at(-1)! - list[0] < desiredSpan)
      .flatMap(list => [list[0], list.at(-1)!]).filter(index => index > 0))];
    if (!endpoints.length) break;
    let best: { first: number; second: number; gain: number; change: number } | undefined;
    for (const first of endpoints) for (let second = 1; second < order.length && repairs < REPAIR_LIMIT; second += 1) {
      if (first === second) continue;
      repairs += 1;
      const gain = pairSpread(first, second);
      if (!gain) continue;
      const change = pairCost(first, second);
      if (!best || gain > best.gain || gain === best.gain && change < best.change) best = { first, second, gain, change };
    }
    if (!best) break;
    swap(best.first, best.second);
  }
  // Default lessons examine every position. Long custom lessons sample evenly
  // and share a hard proposal budget, so 480 cards cannot cause unbounded work.
  const stride = Math.max(1, Math.ceil(order.length / 160));
  const movable = [...new Set([1, ...Array.from({ length: order.length - 1 }, (_, index) => index + 1).filter(index => index % stride === 0), order.length - 1])].sort((a, b) => a - b);
  let checked = 0;
  for (let pass = 0; pass < 3 && checked < IMPROVEMENT_LIMIT; pass += 1) {
    let improved = false;
    for (let a = 0; a < movable.length && checked < IMPROVEMENT_LIMIT; a += 1) for (let b = a + 1; b < movable.length && checked < IMPROVEMENT_LIMIT; b += 1) {
      const first = movable[a], second = movable[b];
      checked += 1;
      if (pairCost(first, second) < 0 && pairSpread(first, second) !== undefined) { swap(first, second); improved = true; }
      if (second - first < 2 || checked >= IMPROVEMENT_LIMIT) continue;
      checked += 1;
      if (reversalCost(first, second) < 0 && reversalAllowed(first, second)) {
        const reversed = order.slice(first, second + 1).reverse();
        order.splice(first, reversed.length, ...reversed); refresh(); improved = true;
      }
    }
    if (!improved) break;
  }
  return order;
}
