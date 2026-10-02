import type { TopicCandidate } from "./topic-sequence";

const identity = (candidate: TopicCandidate) => JSON.stringify([candidate.card.line, candidate.card.tts, candidate.card.english]);
const pairKey = (a: TopicCandidate, b: TopicCandidate) => JSON.stringify([...a.targets, ...b.targets].sort());

/** A bounded pair exchange escapes repeated two-sentence coverage solutions.
 * Each exchange preserves the exact per-target occurrence vector and introduces
 * no helper vocabulary. Ordering/spacing is applied after this coverage step. */
export function diversifyTopicCoverage(chosen: TopicCandidate[], candidates: TopicCandidate[]): TopicCandidate[] {
  const result = [...chosen];
  const groups = new Map<string, TopicCandidate[]>();
  const permittedHelpers = new Set(chosen.flatMap(item => item.unknown));
  for (const item of candidates) {
    if (item.unknown.some(id => !permittedHelpers.has(id))) continue;
    const key = JSON.stringify([...item.targets].sort());
    if (!groups.has(key) && groups.size >= 128) continue;
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  const options = [...groups.values()];
  const pairs = new Map<string, Array<[TopicCandidate[], TopicCandidate[]]>>();
  for (let a = 0; a < options.length; a++) for (let b = a; b < options.length; b++) {
    const key = pairKey(options[a][0], options[b][0]);
    const entries = pairs.get(key) ?? [];
    if (entries.length < 12) { entries.push([options[a], options[b]]); pairs.set(key, entries); }
  }
  const uses = new Map<string, number>();
  for (const item of result) uses.set(identity(item), (uses.get(identity(item)) ?? 0) + 1);
  const count = (item: TopicCandidate) => uses.get(identity(item)) ?? 0;
  let proposals = 0;
  for (let pass = 0; pass < 3; pass++) {
    let improved = false;
    for (let i = 0; i < result.length && proposals < 20_000; i++) {
      if (count(result[i]) < 3) continue;
      for (let j = i + 1; j < result.length && proposals < 20_000; j++) {
        if (count(result[j]) < 3) continue;
        for (const [left, right] of pairs.get(pairKey(result[i], result[j])) ?? []) {
          if (++proposals > 20_000) break;
          const a = left.reduce((best, item) => count(item) < count(best) ? item : best);
          const b = right.reduce((best, item) => count(item) + Number(identity(item) === identity(a)) < count(best) + Number(identity(best) === identity(a)) ? item : best);
          const changes = new Map<string, number>();
          for (const [item, delta] of [[result[i], -1], [result[j], -1], [a, 1], [b, 1]] as const) {
            const key = identity(item); changes.set(key, (changes.get(key) ?? 0) + delta);
          }
          const difference = [...changes].reduce((sum, [key, delta]) => { const current = uses.get(key) ?? 0; return sum + (current + delta) ** 2 - current ** 2; }, 0);
          if (difference >= 0) continue;
          result[i] = a; result[j] = b;
          for (const [key, delta] of changes) uses.set(key, (uses.get(key) ?? 0) + delta);
          improved = true;
          break;
        }
      }
    }
    if (!improved) break;
  }
  return result;
}
