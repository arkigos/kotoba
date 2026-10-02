import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const jp = {
  ka: "\u304b",
  q: "\uff1f",
  ne: "\u306d",
  no: "\u306e",
  yo: "\u3088",
  desu: "\u3067\u3059",
  arimasu: "\u3042\u308a\u307e\u3059",
  imasu: "\u3044\u307e\u3059",
  masu: "\u307e\u3059",
  mashita: "\u307e\u3057\u305f",
  masen: "\u307e\u305b\u3093",
};

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

function cardLine(card) {
  return (card.line ?? []).join("");
}

function cardWordIds(card) {
  return new Set((card.tokens ?? []).flatMap((token) => (token.wordId ? [token.wordId] : [])));
}

function hasMasuFamily(card) {
  return (card.line ?? []).some((part) => part.endsWith(jp.masu) || part.endsWith(jp.mashita) || part.endsWith(jp.masen));
}

function hasExistence(card) {
  const line = card.line ?? [];
  return line.includes(jp.arimasu) || line.includes(jp.imasu);
}

function hasAdjectivePredicate(card) {
  return (card.grammarTags ?? []).some((tag) => /adjective predicate/i.test(tag));
}

function hasPossessive(card) {
  const line = card.line ?? [];
  return line.includes(jp.no) && line.includes(jp.desu);
}

function isSemanticCombination(card) {
  const trackedWordCount = cardWordIds(card).size;
  if (trackedWordCount < 2) return false;
  return hasMasuFamily(card) || hasExistence(card) || hasAdjectivePredicate(card) || hasPossessive(card);
}

function isBareDesu(card) {
  const tokens = card.tokens ?? [];
  return tokens.length === 2 && tokens[0]?.wordId && tokens[1]?.surface === jp.desu;
}

function questionBase(line) {
  if (!line.endsWith(`${jp.ka}${jp.q}`)) return undefined;
  return line.slice(0, -2);
}

function duplicateJapaneseLines(unit) {
  const seen = new Map();
  for (const card of unit.cards ?? []) {
    const line = cardLine(card);
    seen.set(line, [...(seen.get(line) ?? []), card.id]);
  }
  return [...seen.entries()].filter(([, ids]) => ids.length > 1);
}

function summarizeUnit(unit) {
  const currentWordIds = new Set((unit.newWords ?? []).map((word) => word.id));
  const phraseWordIds = new Set((unit.newWords ?? []).filter((word) => word.function === "phrase").map((word) => word.id));
  const nonPhraseWordIds = [...currentWordIds].filter((wordId) => !phraseWordIds.has(wordId));
  const cards = unit.cards ?? [];
  const lines = new Set(cards.map(cardLine));
  const duplicateLines = duplicateJapaneseLines(unit);
  const finalToneCards = cards.filter((card) => [jp.ne, jp.yo].includes(card.line?.at(-1)));
  const bareDesuCards = cards.filter(isBareDesu);
  const semanticCards = cards.filter(isSemanticCombination);
  const semanticCurrentWordIds = new Set();
  const currentWordActionIds = new Set();
  const questionOnlyPairs = [];

  for (const card of cards) {
    const ids = cardWordIds(card);
    const line = cardLine(card);
    const base = questionBase(line);
    if (base && lines.has(base)) questionOnlyPairs.push(card.id);

    for (const wordId of ids) {
      if (!currentWordIds.has(wordId)) continue;
      if (isSemanticCombination(card)) semanticCurrentWordIds.add(wordId);
      if (hasMasuFamily(card) || hasExistence(card)) currentWordActionIds.add(wordId);
    }
  }

  const nonPhraseSemanticCoverage =
    nonPhraseWordIds.length === 0 ? 1 : nonPhraseWordIds.filter((wordId) => semanticCurrentWordIds.has(wordId)).length / nonPhraseWordIds.length;
  const nonPhraseActionCoverage =
    nonPhraseWordIds.length === 0 ? 1 : nonPhraseWordIds.filter((wordId) => currentWordActionIds.has(wordId)).length / nonPhraseWordIds.length;
  const phraseRatio = currentWordIds.size === 0 ? 0 : phraseWordIds.size / currentWordIds.size;
  const flags = [];

  if (duplicateLines.length > 0) flags.push(`duplicate Japanese lines: ${duplicateLines.length}`);
  if (finalToneCards.length > 0) flags.push(`final ne/yo generated cards: ${finalToneCards.length}`);
  if (phraseRatio < 0.7 && nonPhraseSemanticCoverage < 0.75) flags.push(`low semantic combination coverage: ${Math.round(nonPhraseSemanticCoverage * 100)}%`);
  if (phraseRatio < 0.7 && nonPhraseActionCoverage < 0.45) flags.push(`low action/existence coverage for current words: ${Math.round(nonPhraseActionCoverage * 100)}%`);
  if (unit.id > 5 && bareDesuCards.length > 4) flags.push(`bare desu drift: ${bareDesuCards.length}`);
  if (questionOnlyPairs.length > 8) flags.push(`many question-only variants: ${questionOnlyPairs.length}`);

  return {
    id: unit.id,
    title: unit.title,
    cards: cards.length,
    newWords: currentWordIds.size,
    phraseWords: phraseWordIds.size,
    duplicateLines,
    finalToneCards,
    bareDesuCards,
    semanticCards,
    semanticCoverage: nonPhraseSemanticCoverage,
    actionCoverage: nonPhraseActionCoverage,
    questionOnlyPairs,
    flags,
  };
}

function markdownSummary(rows) {
  const lines = [
    "# Curriculum Semantic Audit",
    "",
    "This report is generated by `npm run audit:curriculum-semantics`. It is a smoke test for curriculum-editor review, not a replacement for reading individual unit packets.",
    "",
    "| Unit | Cards | Words | Semantic | Action | Bare desu | Tone | Question-only | Assessment |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |",
  ];

  for (const row of rows) {
    lines.push(
      `| ${row.id}. ${row.title.replace(/^Unit \d+: /, "")} | ${row.cards} | ${row.newWords} | ${Math.round(row.semanticCoverage * 100)}% | ${Math.round(row.actionCoverage * 100)}% | ${row.bareDesuCards.length} | ${row.finalToneCards.length} | ${row.questionOnlyPairs.length} | ${row.flags.length ? `Review: ${row.flags.join("; ")}` : "Pass"} |`,
    );
  }

  const flagged = rows.filter((row) => row.flags.length > 0);
  lines.push("", "## Flagged Units", "");
  if (flagged.length === 0) {
    lines.push("No semantic smoke-test flags.");
  } else {
    for (const row of flagged) {
      lines.push(`- Unit ${row.id}: ${row.flags.join("; ")}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

const index = await readJson("data/jp/curriculum/unit_index.json");
const rows = [];
const failures = [];

for (const entry of index.units) {
  if (entry.kind === "kana" || entry.kind === "kanji" || entry.id >= 100) continue;
  const unit = await readJson(entry.path);
  const row = summarizeUnit(unit);
  rows.push(row);

  for (const [line, ids] of row.duplicateLines) {
    failures.push(`unit ${unit.id}: duplicate Japanese line ${line} [${ids.join(", ")}]`);
  }
  for (const card of row.finalToneCards) {
    failures.push(`unit ${unit.id} ${card.id}: generated card ends with standalone ne/yo: ${cardLine(card)}`);
  }
}

const outPath = path.join(root, "docs", "reviews", "semantic_audit_summary.md");
await fs.mkdir(path.dirname(outPath), { recursive: true });
await fs.writeFile(outPath, markdownSummary(rows), "utf8");

console.table(
  rows.map((row) => ({
    unit: row.id,
    words: row.newWords,
    cards: row.cards,
    semantic: `${Math.round(row.semanticCoverage * 100)}%`,
    action: `${Math.round(row.actionCoverage * 100)}%`,
    bareDesu: row.bareDesuCards.length,
    tone: row.finalToneCards.length,
    flags: row.flags.length,
  })),
);

console.log(`Wrote ${path.relative(root, outPath)}`);

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

const flaggedCount = rows.filter((row) => row.flags.length > 0).length;
console.log(`Curriculum semantic audit passed hard checks (${flaggedCount} units flagged for editorial review).`);
