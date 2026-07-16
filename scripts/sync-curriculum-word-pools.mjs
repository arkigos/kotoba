import { root, readJson, authoredUnitIds, lexiconVocabularyUnitIds, reviewVocabularyUnitIds, wordsForUnits } from "./lib/curriculum-model.mjs";
import fs from "node:fs/promises";
import path from "node:path";

function pad(value) {
  return String(value).padStart(3, "0");
}

async function writeJson(relativePath, value) {
  await fs.writeFile(path.join(root, relativePath), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

const source = await readJson("data/jp/curriculum/source/unit_specs.json");
const index = await readJson("data/jp/curriculum/unit_index.json");
const authoredIds = authoredUnitIds(source);

function isSpecialCurriculumUnit(unit) {
  return unit?.kind === "kana" || unit?.kind === "kanji" || unit?.id >= 100;
}

for (const entry of index.units) {
  const unit = await readJson(`data/jp/curriculum/units/unit_${pad(entry.id)}.json`);
  const reviewWordIds = isSpecialCurriculumUnit(unit) ? [] : wordsForUnits(source, reviewVocabularyUnitIds(entry.id)).map((word) => word.id);
  const lexiconWordIds = isSpecialCurriculumUnit(unit) ? [] : wordsForUnits(source, lexiconVocabularyUnitIds(entry.id, authoredIds)).map((word) => word.id);
  await writeJson(`data/jp/curriculum/units/unit_${pad(entry.id)}.json`, { ...unit, reviewWordIds, lexiconWordIds });
}

console.log(`Synced reviewWordIds and lexiconWordIds for ${index.units.length} units.`);
