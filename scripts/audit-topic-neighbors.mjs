import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Read-only corpus feasibility audit. No grammatical eligibility is inferred.
// Optional slower investigations: --experimental-connected --cover-proof.
// The experimental selector is only a comparison; the app's actual selector
// is exercised by topic-word-selection.test.ts.
const experimental = process.argv.includes("--experimental-connected");
const coverProof = process.argv.includes("--cover-proof");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = name => JSON.parse(fs.readFileSync(path.join(root, name), "utf8"));
const scope = read("data/jp/dictionary/a1_scope.json");
const canonical = id => scope.words[id]?.coreWordId ?? id;
const cards = [...new Map(Array.from({ length: 49 }, (_, index) => read(`data/jp/curriculum/units/unit_${String(index + 1).padStart(3, "0")}.json`).cards).flat()
  .map(card => [JSON.stringify([card.line, card.tts, card.english]), card])).values()]
  .map(card => ({ card, ids: [...new Set(card.tokens.flatMap(token => token.wordId ? [canonical(token.wordId)] : []))] }));

// Experimental comparison only: preserve the first three intended new words,
// then select from the same topic using actual reviewed co-occurrence. Restrict
// scoring edges to cards with <=4 lexical IDs so either endpoint pair always
// meets the per-card two-unknown-helper ceiling on a fresh profile.
function connectedSelection(pool) {
  const graph = new Map(pool.map(id => [id, new Set()]));
  for (const item of cards.filter(item => item.ids.length <= 4)) {
    const targets = item.ids.filter(id => graph.has(id));
    for (const a of targets) for (const b of targets) if (a !== b) graph.get(a).add(b);
  }
  const edge = (a, b) => graph.get(a).has(b);
  const chosen = pool.slice(0, 3);
  while (chosen.length < Math.min(pool.length, 12)) {
    const remaining = pool.filter(id => !chosen.includes(id));
    remaining.sort((a, b) => chosen.filter(id => edge(b, id)).length - chosen.filter(id => edge(a, id)).length
      || graph.get(b).size - graph.get(a).size || pool.indexOf(a) - pool.indexOf(b));
    chosen.push(remaining[0]);
  }
  const score = ids => {
    const pairs = [];
    for (let a = 0; a < ids.length; a += 1) for (let b = a + 1; b < ids.length; b += 1) if (edge(ids[a], ids[b])) pairs.push({ targets: [ids[a], ids[b]] });
    const independent = independentSet(ids, pairs).length;
    const isolated = ids.filter(a => !ids.some(b => a !== b && edge(a, b))).length;
    return independent * 10000 + isolated * 100 - pairs.length;
  };
  let bestScore = score(chosen);
  for (let pass = 0; pass < 3; pass += 1) {
    let improvement;
    for (let position = 3; position < chosen.length; position += 1) for (const alternative of pool.filter(id => !chosen.includes(id))) {
      const candidate = chosen.map((id, index) => index === position ? alternative : id);
      const candidateScore = score(candidate);
      if (candidateScore < bestScore) { bestScore = candidateScore; improvement = candidate; }
    }
    if (!improvement) break;
    chosen.splice(0, chosen.length, ...improvement);
  }
  return chosen;
}

function independentSet(ids, candidates) {
  let largest = [];
  const adjacency = ids.map(() => 0);
  for (const { targets } of candidates) for (const a of targets) for (const b of targets) if (a !== b) adjacency[ids.indexOf(a)] |= 1 << ids.indexOf(b);
  for (let mask = 1; mask < 2 ** ids.length; mask += 1) {
    const selected = ids.map((_, index) => index).filter(index => mask & (1 << index));
    if (selected.length > largest.length && selected.every(index => !(adjacency[index] & mask))) largest = selected;
  }
  return largest.map(index => ids[index]);
}

function repeatedCoverUpperBound(ids, candidates) {
  // This constructs one complete target cover, then repeats it eight times.
  // It proves coverage only, not acceptable variety or sequencing quality.
  const patterns = new Map();
  for (const item of candidates) {
    const mask = item.targets.reduce((value, id) => value | (1 << ids.indexOf(id)), 0);
    const helpers = [...item.unknown].sort();
    const key = `${mask}:${helpers.join(",")}`;
    if (!patterns.has(key)) patterns.set(key, { mask, helpers, card: item.card.id });
  }
  const patternsByMask = new Map();
  for (const pattern of patterns.values()) patternsByMask.set(pattern.mask, [...(patternsByMask.get(pattern.mask) ?? []), pattern]);
  const options = [...patternsByMask.values()].flatMap(group => group.sort((a, b) => a.helpers.length - b.helpers.length).slice(0, 10));
  const complete = (1 << ids.length) - 1;
  const states = Array.from({ length: complete + 1 }, () => new Map());
  states[0].set("", { helpers: [], cards: [] });
  for (let mask = 0; mask <= complete; mask += 1) {
    const best = [...states[mask].values()].sort((a, b) => a.cards.length - b.cards.length || a.helpers.length - b.helpers.length).slice(0, 12);
    for (const state of best) for (const option of options) {
      const nextMask = mask | option.mask;
      if (nextMask === mask) continue;
      const helpers = [...new Set([...state.helpers, ...option.helpers])].sort();
      if (helpers.length > 6) continue;
      const key = helpers.join(",");
      const existing = states[nextMask].get(key);
      if (!existing || state.cards.length + 1 < existing.cards.length) states[nextMask].set(key, { helpers, cards: [...state.cards, option.card] });
    }
  }
  const best = [...states[complete].values()].sort((a, b) => a.cards.length - b.cards.length || a.helpers.length - b.helpers.length)[0];
  return best ? { cards: best.cards.length * 8, helpers: best.helpers, cover: best.cards } : null;
}

function audit(topic, ids, label) {
  const selected = new Set(ids);
  const candidates = cards.map(item => ({ ...item, targets: item.ids.filter(id => selected.has(id)), unknown: item.ids.filter(id => !selected.has(id)) }))
    .filter(item => item.targets.length && item.unknown.length <= 2);
  const independent = independentSet(ids, candidates);
  const density = {};
  for (const card of candidates) density[card.targets.length] = (density[card.targets.length] ?? 0) + 1;
  const context = candidates.filter(item => item.card.tokens.length > 1);
  const groups = new Map();
  for (const item of context) {
    const skeleton = JSON.stringify(item.card.tokens.map(token => token.wordId ? "_" : [token.surface, token.reading]));
    groups.set(skeleton, [...(groups.get(skeleton) ?? []), item]);
  }
  let oneChangeEdges = 0, twoChangeEdges = 0;
  const connectedIds = new Set();
  for (const group of groups.values()) for (let a = 0; a < group.length; a += 1) for (let b = a + 1; b < group.length; b += 1) {
    let lexical = 0, forms = 0;
    group[a].card.tokens.forEach((token, index) => {
      const other = group[b].card.tokens[index];
      if (!token.wordId) return;
      if (canonical(token.wordId) !== canonical(other.wordId)) lexical += 1;
      else if (token.surface !== other.surface || token.reading !== other.reading) forms += 1;
    });
    if (!forms && lexical >= 1 && lexical <= 2) {
      if (lexical === 1) oneChangeEdges += 1; else twoChangeEdges += 1;
      group[a].targets.concat(group[b].targets).forEach(id => connectedIds.add(id));
    }
  }
  return { topic, selection: label, ids, eligibleCards: candidates.length, density,
    soloOnlyTargets: ids.filter(id => !candidates.some(card => card.targets.includes(id) && card.targets.length >= 2)),
    independentTargets: independent, hardMinimumCardsForEightEach: independent.length * 8,
    ...(coverProof ? { repeatedCoverUpperBound: repeatedCoverUpperBound(ids, candidates) } : {}),
    oneChangeEdges, twoChangeEdges, contextTargetsWithNoNeighbor: ids.filter(id => !connectedIds.has(id)) };
}

const results = scope.topics.flatMap(topic => {
  const ids = scope.coreWordIds.filter(id => scope.words[id].topicIds.includes(topic.id));
  return [audit(topic.id, ids.slice(0, 12), "first12"), audit(topic.id, ids.slice(-12), "last12"),
    ...(experimental ? [audit(topic.id, connectedSelection(ids), "first3-plus-connected")] : [])];
});
console.log(JSON.stringify(results, null, 2));
