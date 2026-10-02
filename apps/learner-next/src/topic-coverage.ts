import type { TopicCandidate } from "./topic-sequence";

const MAX_SEARCH_STATES = 20_000;
const MAX_CANDIDATE_CHECKS = 1_000_000;

/**
 * A bounded fallback for a requested card count. Coverage is independent of
 * ordering: callers may reorder these exact candidates and mark the resulting
 * transitions. Undefined means no fit was found within this search budget.
 */
export function findTopicCoverage(targets: string[], candidates: TopicCandidate[], goal: number, cardLimit: number): TopicCandidate[] | undefined {
  if (!targets.length || targets.length > 30 || new Set(targets).size !== targets.length
    || !Number.isInteger(goal) || goal < 1 || goal > 480
    || !Number.isInteger(cardLimit) || cardLimit < 1 || cardLimit > 480) return undefined;
  const targetIndices = new Map(targets.map((id, index) => [id, index]));
  const cap = goal + 4;
  const unique = new Map<string, { candidate: TopicCandidate; indices: number[]; unknown: string[] }>();
  for (const candidate of candidates) {
    const indices = [...new Set(candidate.targets.flatMap(id => {
      const index = targetIndices.get(id);
      return index === undefined ? [] : [index];
    }))].sort((a, b) => a - b);
    const unknown = [...new Set(candidate.unknown)].sort();
    if (!indices.length || unknown.length > 6) continue;
    const key = JSON.stringify([indices, unknown]);
    if (!unique.has(key)) unique.set(key, { candidate, indices, unknown });
  }
  const choices = [...unique.values()];
  if (targets.some((_, index) => !choices.some(choice => choice.indices.includes(index)))) return undefined;
  const counts = targets.map(() => 0);
  const helpers = new Set<string>();
  const chosen: TopicCandidate[] = [];
  // A failed state with more remaining cards subsumes the same state with fewer.
  const failed = new Map<string, number>();
  let states = 0, checks = 0, exhausted = false;

  const visit = (): boolean => {
    if (++states > MAX_SEARCH_STATES) { exhausted = true; return false; }
    const deficits = counts.map(count => Math.max(0, goal - count));
    const totalDeficit = deficits.reduce((sum, count) => sum + count, 0);
    if (!totalDeficit) return true;
    const remaining = cardLimit - chosen.length;
    if (Math.max(...deficits) > remaining) return false;
    const key = JSON.stringify([counts, [...helpers].sort()]);
    if ((failed.get(key) ?? -1) >= remaining) return false;
    const eligible = [];
    const availableCounts = targets.map(() => 0);
    let maximumGain = 0;
    for (const choice of choices) {
      if (++checks > MAX_CANDIDATE_CHECKS) { exhausted = true; return false; }
      if (choice.indices.some(index => counts[index] >= cap)) continue;
      const gain = choice.indices.filter(index => deficits[index] > 0).length;
      if (!gain) continue;
      const additions = choice.unknown.filter(id => !helpers.has(id));
      if (helpers.size + additions.length > 6) continue;
      eligible.push({ choice, gain, additions, surplus: choice.indices.length - gain });
      maximumGain = Math.max(maximumGain, gain);
      for (const index of choice.indices) availableCounts[index] += 1;
    }
    if (!maximumGain || Math.ceil(totalDeficit / maximumGain) > remaining) return false;
    let nextTarget = -1;
    for (let index = 0; index < targets.length; index += 1) {
      if (!deficits[index]) continue;
      if (!availableCounts[index]) return false;
      if (nextTarget < 0 || availableCounts[index] < availableCounts[nextTarget]
        || (availableCounts[index] === availableCounts[nextTarget] && deficits[index] > deficits[nextTarget])) nextTarget = index;
    }
    // Any solution can place a card covering this unmet target next: counts and
    // helper unions only grow, so this reordering cannot break a valid solution.
    const branches = eligible.filter(item => item.choice.indices.includes(nextTarget))
      .sort((a, b) => b.gain - a.gain || a.surplus - b.surplus || a.additions.length - b.additions.length);
    for (const { choice, additions } of branches) {
      choice.indices.forEach(index => { counts[index] += 1; });
      additions.forEach(id => helpers.add(id));
      chosen.push(choice.candidate);
      if (visit()) return true;
      chosen.pop();
      additions.forEach(id => helpers.delete(id));
      choice.indices.forEach(index => { counts[index] -= 1; });
      if (exhausted) return false;
    }
    failed.set(key, Math.max(remaining, failed.get(key) ?? -1));
    return false;
  };

  return visit() ? [...chosen] : undefined;
}
