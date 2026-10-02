import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function argValue(name, fallback) {
  const exact = process.argv.find((arg) => arg.startsWith(`--${name}=`));
  if (exact) return exact.slice(name.length + 3);
  const index = process.argv.indexOf(`--${name}`);
  if (index >= 0) return process.argv[index + 1] ?? fallback;
  return fallback;
}

function hasArg(name) {
  return process.argv.includes(`--${name}`);
}

async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

function cardLine(card) {
  return Array.isArray(card.line) ? card.line.join("") : "";
}

function tokenSummary(card) {
  return (card.tokens ?? [])
    .map((token) => {
      const id = token.wordId ? ` {${token.wordId}}` : "";
      return `${token.surface}${id}`;
    })
    .join(" ");
}

function countBy(cards, predicate) {
  return cards.filter(predicate).length;
}

async function writeUnitPacket(unitId) {
const unit = await readJson(`data/jp/curriculum/units/unit_${String(unitId).padStart(3, "0")}.json`);
const lineCounts = new Map();
for (const card of unit.cards) {
  const line = cardLine(card);
  lineCounts.set(line, (lineCounts.get(line) ?? 0) + 1);
}

const duplicateLines = [...lineCounts.entries()].filter(([, count]) => count > 1);
const toneCards = unit.cards.filter((card) => ["\u306d", "\u3088"].includes(card.line.at(-1) ?? ""));
const questionCards = unit.cards.filter((card) => card.line.includes("\u304b") && card.line.includes("\uff1f"));

const lines = [
  `# Semantic Review Packet: ${unit.title}`,
  "",
  `Grammar focus: ${unit.grammarFocus}`,
  `Cards: ${unit.cards.length}`,
  `New words: ${unit.newWords.map((word) => `${word.surface} (${word.id}: ${word.meaning})`).join(", ")}`,
  `Review word ids: ${unit.reviewWordIds.join(", ") || "none"}`,
  "",
  "## Mechanical Signals",
  "",
  `- Duplicate Japanese lines: ${duplicateLines.length}`,
  `- Final ne/yo cards: ${toneCards.length}`,
  `- Question cards: ${questionCards.length}`,
  "",
  "## Review Questions For Codex",
  "",
  "- Are the cards useful Japanese, or are they legal-but-pointless substitutions?",
  "- Are particles such as ne, yo, and ka introduced because the unit teaches them, or only to fake variety?",
  "- Are review words integrated with known words in meaningful ways?",
  "- Are there exact repeats, near repeats, or lockstep patterns a learner would feel immediately?",
  "- Are any sentences unnatural, misleading, overly complex, or too abstract for this unit?",
  "",
  "## Cards",
  "",
  ...unit.cards.flatMap((card, index) => [
    `### ${index + 1}. ${card.id}`,
    "",
    `Japanese: ${cardLine(card)}`,
    `English: ${card.english}`,
    `Tokens: ${tokenSummary(card)}`,
    `Tags: ${(card.grammarTags ?? []).join(" / ")}`,
    "",
  ]),
];

const outDir = path.join(root, "docs", "reviews");
await fs.mkdir(outDir, { recursive: true });
const outPath = path.join(outDir, `unit_${String(unitId).padStart(3, "0")}_semantic_review.md`);
await fs.writeFile(outPath, `${lines.join("\n")}\n`, "utf8");
console.log(`Wrote ${path.relative(root, outPath)}`);
}

if (hasArg("all")) {
  const index = await readJson("data/jp/curriculum/unit_index.json");
  for (const entry of index.units) {
    if (entry.kind === "kana" || entry.kind === "kanji" || entry.id >= 100) continue;
    await writeUnitPacket(entry.id);
  }
} else {
  const unitId = Number(argValue("unit", "1"));
  if (!Number.isInteger(unitId) || unitId <= 0) {
    throw new Error("Pass a positive integer unit id, for example: npm run review:unit -- --unit 1");
  }
  await writeUnitPacket(unitId);
}
