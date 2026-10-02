import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { repairStarterUnit, reviewedStarterWords } from "./lib/starter-semantic-repairs.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "data/jp/curriculum/units");
const write = process.argv.includes("--write");
const units = await Promise.all((await fs.readdir(directory)).filter(file => /^unit_\d+\.json$/.test(file)).map(async file => ({ file, unit: JSON.parse(await fs.readFile(path.join(directory, file), "utf8")) })));
const standard = units.filter(({ unit }) => !["kana", "kanji"].includes(unit.kind) && unit.id < 100).sort((a, b) => a.unit.id - b.unit.id);
const words = standard.flatMap(({ unit }) => unit.newWords.map(word => ({ ...word, unitId: unit.id })));
const corrected = [];
const fragments = [];
const unsafe = [];
for (const { file, unit } of standard) {
  const result = repairStarterUnit(unit, words.filter(word => word.unitId <= unit.id));
  corrected.push(...result.changes.map(change => ({ unitId: unit.id, ...change })));
  const audited = write ? result.unit : unit;
  if (write && result.repaired) await fs.writeFile(path.join(directory, file), `${JSON.stringify(result.unit, null, 2)}\n`, "utf8");
  for (const card of audited.cards) {
    const lexical = card.tokens.filter(token => token.wordId);
    if (card.tokens.length === 1 && lexical.length === 1) {
      const sourceWord = words.find(word => word.id === lexical[0].wordId);
      if (sourceWord && sourceWord.function !== "phrase" && reviewedStarterWords[sourceWord.id]?.function !== "phrase") fragments.push({ unitId: unit.id, id: card.id, english: card.english, wordId: sourceWord.id });
    }
    const object = card.tokens[card.tokens.findIndex(token => token.surface === "を") - 1];
    const reviewed = reviewedStarterWords[object?.wordId];
    if (reviewed && ["adverb", "time", "quantity", "adjective", "phrase"].includes(reviewed.function)) unsafe.push({ unitId: unit.id, id: card.id, english: card.english, wordId: object.wordId });
  }
}
const report = { units: standard.length, cards: standard.reduce((count, { unit }) => count + unit.cards.length, 0), [write ? "repairedCards" : "repairableCards"]: corrected.length, unsafeObjects: unsafe.length, isolatedNonPhraseCards: fragments.length, examples: corrected.slice(0, 14), remainingUnsafeExamples: unsafe.slice(0, 12), fragmentExamples: fragments.slice(0, 12) };
console.log(JSON.stringify(report, null, 2));
if (process.argv.includes("--strict") && unsafe.length) process.exitCode = 1;
