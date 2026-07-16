import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jp = {
  arimasen: "\u3042\u308a\u307e\u305b\u3093",
  arimasu: "\u3042\u308a\u307e\u3059",
  de: "\u3067",
  dewa: "\u3067\u306f",
  dewaArimasen: "\u3067\u306f\u3042\u308a\u307e\u305b\u3093",
  deshita: "\u3067\u3057\u305f",
  desu: "\u3067\u3059",
  imasen: "\u3044\u307e\u305b\u3093",
  imasu: "\u3044\u307e\u3059",
  jaArimasen: "\u3058\u3083\u3042\u308a\u307e\u305b\u3093",
  mashita: "\u307e\u3057\u305f",
  masen: "\u307e\u305b\u3093",
  masenDeshita: "\u307e\u305b\u3093\u3067\u3057\u305f",
  masu: "\u307e\u3059",
  tai: "\u305f\u3044",
  te: "\u3066",
};

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

function levelForUnit(levels, unitId) {
  return levels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd);
}

function hasFunction(word, target) {
  return String(word.function ?? "")
    .split(/[-_\s/]+/)
    .includes(target);
}

function lineText(card) {
  return (card.line ?? []).join("");
}

function tokenSurfaces(card) {
  return (card.tokens ?? []).map((token) => token.surface ?? "");
}

function tokenParts(card) {
  return card.tokens ?? [];
}

function hasDesuFamily(card) {
  const text = lineText(card);
  const surfaces = tokenSurfaces(card);
  return text.includes(jp.desu) || text.includes(jp.deshita) || text.includes(jp.jaArimasen) || text.includes(jp.dewaArimasen) || surfaces.some((surface, index) => surface === jp.arimasen && surfaces[index - 1] === jp.dewa);
}

function hasExistence(card) {
  const surfaces = tokenSurfaces(card);
  return surfaces.some((surface, index) => {
    if (surface === jp.arimasu || surface === jp.imasu || surface === jp.imasen) return true;
    return surface === jp.arimasen && surfaces[index - 1] !== jp.dewa;
  });
}

function hasMasuFamily(card) {
  return tokenSurfaces(card).some((surface) => surface.endsWith(jp.masu) || surface.endsWith(jp.mashita) || surface.endsWith(jp.masen) || surface.endsWith(jp.masenDeshita));
}

function hasProductiveMasu(card) {
  return hasMasuFamily(card) && !hasExistence(card) && !hasDesuFamily(card);
}

function hasVerbLane(card) {
  return hasExistence(card) || hasProductiveMasu(card);
}

function hasTeForm(card) {
  const tags = card.grammarTags ?? [];
  if (tags.some((tag) => /te-form/i.test(tag) || tag.includes(`V${jp.te}`))) return true;
  return tokenParts(card).some((token) => {
    const surface = token.surface ?? "";
    const explain = token.explain ?? "";
    return (surface.endsWith(jp.te) || (surface.length > 1 && surface.endsWith(jp.de))) && /\band\b/.test(explain);
  });
}

function hasTai(card) {
  return lineText(card).includes(jp.tai) || (card.grammarTags ?? []).some((tag) => tag.includes(jp.tai));
}

function percentage(cards, predicate) {
  if (cards.length === 0) return 0;
  return Math.round((cards.filter(predicate).length / cards.length) * 100);
}

function summarizeFunctions(words) {
  return words.reduce((counts, word) => {
    const key = word.function ?? "unknown";
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

function printTable(rows) {
  console.table(
    rows.map((row) => ({
      id: row.id,
      level: row.level,
      verbs: row.newVerbCount,
      desu: `${row.desuPct}%`,
      exist: `${row.existencePct}%`,
      action: `${row.productiveMasuPct}%`,
      lane: row.verbLaneCount,
      te: `${row.tePct}%`,
      tai: `${row.taiPct}%`,
      title: row.title,
    })),
  );
}

const index = await readJson("data/jp/curriculum/unit_index.json");
const courseLevels = await readJson("data/jp/curriculum/course_levels.json");

const failures = [];
const warnings = [];
const levels = courseLevels.levels ?? [];

if (courseLevels.certificationClaim !== false) {
  failures.push("course_levels.json must keep certificationClaim false; Kotoba is CEFR-inspired / JF-aligned, not certified.");
}

const rows = [];
for (const entry of index.units) {
  const unit = await readJson(entry.path);
  const level = levelForUnit(levels, unit.id)?.code ?? "unknown";
  const newVerbs = (unit.newWords ?? []).filter((word) => hasFunction(word, "verb"));
  const cards = unit.cards ?? [];

  rows.push({
    id: unit.id,
    level,
    title: unit.title.replace(/^Unit \d+: /, ""),
    grammarFocus: unit.grammarFocus,
    cards: cards.length,
    newVerbCount: newVerbs.length,
    newVerbIds: newVerbs.map((word) => word.id),
    functionCounts: summarizeFunctions(unit.newWords ?? []),
    desuPct: percentage(cards, hasDesuFamily),
    existencePct: percentage(cards, hasExistence),
    productiveMasuPct: percentage(cards, hasProductiveMasu),
    verbLaneCount: cards.filter(hasVerbLane).length,
    verbLanePct: percentage(cards, hasVerbLane),
    tePct: percentage(cards, hasTeForm),
    taiPct: percentage(cards, hasTai),
  });
}

const byLevel = new Map();
for (const row of rows) {
  if (!byLevel.has(row.level)) {
    byLevel.set(row.level, {
      units: 0,
      cards: 0,
      verbs: 0,
      desuWeighted: 0,
      existenceWeighted: 0,
      productiveMasuWeighted: 0,
      verbLaneWeighted: 0,
      teWeighted: 0,
      taiWeighted: 0,
    });
  }

  const level = byLevel.get(row.level);
  level.units += 1;
  level.cards += row.cards;
  level.verbs += row.newVerbCount;
  level.desuWeighted += row.desuPct * row.cards;
  level.existenceWeighted += row.existencePct * row.cards;
  level.productiveMasuWeighted += row.productiveMasuPct * row.cards;
  level.verbLaneWeighted += row.verbLanePct * row.cards;
  level.teWeighted += row.tePct * row.cards;
  level.taiWeighted += row.taiPct * row.cards;
}

const levelSummaries = [...byLevel.entries()].map(([level, summary]) => ({
  level,
  units: summary.units,
  cards: summary.cards,
  newVerbs: summary.verbs,
  desu: `${Math.round(summary.desuWeighted / summary.cards)}%`,
  existence: `${Math.round(summary.existenceWeighted / summary.cards)}%`,
  productiveMasu: `${Math.round(summary.productiveMasuWeighted / summary.cards)}%`,
  verbLane: `${Math.round(summary.verbLaneWeighted / summary.cards)}%`,
  te: `${Math.round(summary.teWeighted / summary.cards)}%`,
  tai: `${Math.round(summary.taiWeighted / summary.cards)}%`,
}));

const a1Rows = rows.filter((row) => row.level === "A1");
const a2Rows = rows.filter((row) => row.level === "A2");
const lateA1Rows = a1Rows.filter((row) => row.id >= 15);
const a2ActionRows = a2Rows.filter((row) => row.id >= 21 && row.id <= 30);

for (const row of a1Rows) {
  const minimumVerbLaneCards = row.id <= 7 ? 10 : 2;
  if (row.verbLaneCount < minimumVerbLaneCards) {
    failures.push(`unit ${row.id}: A1 units need at least ${minimumVerbLaneCards} action/existence lane cards; found ${row.verbLaneCount}.`);
  }
}

const lateA1ExistenceAverage = lateA1Rows.length === 0 ? 0 : Math.round(lateA1Rows.reduce((sum, row) => sum + row.existencePct, 0) / lateA1Rows.length);
if (lateA1ExistenceAverage < 25) {
  warnings.push(`late A1 existence/location practice is only ${lateA1ExistenceAverage}%; keep Units 15-20 from collapsing back into pure desu drills.`);
}

if (a2Rows.length > 0) {
  const a2VerbCount = a2Rows.reduce((sum, row) => sum + row.newVerbCount, 0);
  if (a2VerbCount < 80) {
    failures.push(`A2 has only ${a2VerbCount} new verb words; expected at least 80 across the authored A2 everyday-action band.`);
  }

  const a2ActionMasuAverage = a2ActionRows.length === 0 ? 0 : Math.round(a2ActionRows.reduce((sum, row) => sum + row.productiveMasuPct, 0) / a2ActionRows.length);
  if (a2ActionMasuAverage < 45) {
    failures.push(`A2 Units 21-30 average only ${a2ActionMasuAverage}% productive polite-verb cards; A2 should visibly shift into everyday actions.`);
  }

  const staticA2Units = new Set([31, 32, 33, 34, 38, 40]);
  for (const row of a2Rows) {
    if (row.desuPct >= 65 && row.productiveMasuPct < 25 && !staticA2Units.has(row.id)) {
      warnings.push(`unit ${row.id}: high desu-family use (${row.desuPct}%) after A2 action forms are available; check for sterile static drift.`);
    }
  }
}

console.log("Level alignment audit");
console.table(levelSummaries);
printTable(rows);

console.log("\nAlignment notes:");
console.log("- A1 starts simple, but every unit needs a verb lane: Units 1-7 are the denser foundation baseline, later A1 uses action previews or existence practice.");
console.log("- Units 1-7 carry two real current-unit verb words each; later A1 action previews reuse those known verb identities as bridges.");
console.log("- A2 should carry the everyday action load: polite verbs, objects, destinations, time, frequency, wants, requests, permission, te-form, and ongoing state.");

for (const warning of warnings) console.warn(`WARN ${warning}`);
if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Level alignment audit passed.");
