import type { TopicCandidate } from "./topic-sequence";

type Requirement = { helpers: number[]; coverage: number; multiple: number; examples: number[] };
type Score = [number, number, number, number, number];
const popcount = (value: number) => { let count = 0; for (; value; value &= value - 1) count += 1; return count; };
const compare = (left: Score, right: Score) => {
  for (let index = 0; index < left.length; index += 1) {
    const difference = left[index] - right[index];
    if (Math.abs(difference) > 1e-10) return difference;
  }
  return 0;
};

/** Pick a shared helper allowance before sentence ordering consumes it. Context
 * coverage comes first, then scarce targets, multi-target contexts, and variety.
 * Known words have already been removed from candidate.unknown by the caller.
 * Uses authored co-occurrences only; no POS or grammatical eligibility inference. */
export function chooseTopicHelpers(targets: string[], candidates: TopicCandidate[]): string[] {
  if (targets.length > 30) throw new Error("Helper planning supports up to 30 selected targets.");
  const targetIndex = new Map(targets.map((id, index) => [id, index]));
  const helperIds: string[] = [];
  const helperIndex = new Map<string, number>();
  const requirements = new Map<string, Requirement>();
  const seenCards = new Set<string>();
  for (const candidate of candidates) {
    if (candidate.card.tokens.length <= 1) continue;
    const unknown = [...new Set(candidate.unknown)];
    // The caller's per-card allowance is two unknown supporting concepts.
    if (unknown.length > 2) continue;
    const indices = [...new Set(candidate.targets.flatMap(id => targetIndex.has(id) ? [targetIndex.get(id)!] : []))];
    if (!indices.length) continue;
    const identity = JSON.stringify([candidate.card.line, candidate.card.tts, candidate.card.english, indices, unknown]);
    if (seenCards.has(identity)) continue;
    seenCards.add(identity);
    const helpers = unknown.map(id => {
      if (!helperIndex.has(id)) { helperIndex.set(id, helperIds.length); helperIds.push(id); }
      return helperIndex.get(id)!;
    }).sort((a, b) => a - b);
    const key = helpers.join(",");
    const group = requirements.get(key) ?? { helpers, coverage: 0, multiple: 0, examples: Array(targets.length).fill(0) };
    for (const index of indices) {
      group.coverage |= 1 << index;
      if (indices.length > 1) group.multiple |= 1 << index;
      group.examples[index] = Math.min(4, group.examples[index] + 1);
    }
    requirements.set(key, group);
  }
  const groups = [...requirements.values()];
  const options = groups.filter(group => group.helpers.length).map(group => group.helpers);
  if (!options.length) return [];
  const rarity = targets.map((_, index) => 1 / Math.max(1, groups.filter(group => group.coverage & (1 << index)).length));
  const scoreCache = new Map<string, Score>();
  const score = (helpers: number[]): Score => {
    const key = helpers.join(",");
    const cached = scoreCache.get(key);
    if (cached) return cached;
    // Requirements have at most two IDs, so only 22 map lookups are needed
    // for a complete six-helper set, independent of corpus size.
    const enabled = [requirements.get(""), ...helpers.map(id => requirements.get(String(id)))];
    for (let first = 0; first < helpers.length; first += 1) for (let second = first + 1; second < helpers.length; second += 1) enabled.push(requirements.get(`${helpers[first]},${helpers[second]}`));
    let coverage = 0, multiple = 0;
    const examples = Array(targets.length).fill(0) as number[];
    for (const group of enabled) if (group) {
      coverage |= group.coverage;
      multiple |= group.multiple;
      group.examples.forEach((count, index) => { examples[index] = Math.min(4, examples[index] + count); });
    }
    const result: Score = [popcount(coverage), rarity.reduce((sum, weight, index) => sum + (coverage & (1 << index) ? weight : 0), 0),
      popcount(multiple), examples.reduce((sum, count) => sum + count, 0), -helpers.length];
    scoreCache.set(key, result);
    return result;
  };
  const union = (helpers: number[], additions: number[]) => [...new Set([...helpers, ...additions])].sort((a, b) => a - b);
  const greedy = (seed: number[]) => {
    let current = seed;
    while (current.length < 6) {
      let next = current;
      for (const addition of options) {
        const proposal = union(current, addition);
        if (proposal.length <= 6 && compare(score(proposal), score(next)) > 0) next = proposal;
      }
      if (next === current) break;
      current = next;
    }
    return current;
  };
  // A few different starts keep a strong early helper pair from permanently
  // crowding out a rare target. The search remains bounded and deterministic.
  const seeds = [...options].sort((a, b) => compare(score(b), score(a))).slice(0, 4);
  let best = [greedy([]), ...seeds.map(greedy)].sort((a, b) => compare(score(b), score(a)))[0];
  for (let pass = 0; pass < 2; pass += 1) {
    let improvement = best;
    const removals: number[][] = [[]];
    for (let first = 0; first < best.length; first += 1) {
      removals.push([best[first]]);
      for (let second = first + 1; second < best.length; second += 1) removals.push([best[first], best[second]]);
    }
    for (const removal of removals) {
      const retained = best.filter(id => !removal.includes(id));
      for (const addition of options) {
        const proposal = union(retained, addition);
        if (proposal.length <= 6 && compare(score(proposal), score(improvement)) > 0) improvement = proposal;
      }
    }
    if (improvement === best) break;
    best = greedy(improvement);
  }
  return best.map(index => helperIds[index]);
}
