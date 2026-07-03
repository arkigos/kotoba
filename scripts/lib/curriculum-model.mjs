import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export function padUnit(value) {
  return String(value).padStart(3, "0");
}

export async function readJson(relativePath) {
  return JSON.parse(await fs.readFile(path.join(root, relativePath), "utf8"));
}

export async function readUnitSpecs() {
  return readJson("data/jp/curriculum/source/unit_specs.json");
}

export async function readPacingRules() {
  return readJson("data/jp/curriculum/source/pacing.json");
}

export async function readUnitIndex() {
  return readJson("data/jp/curriculum/unit_index.json");
}

export async function readAuthoredUnit(unitId) {
  return readJson(`data/jp/curriculum/units/unit_${padUnit(unitId)}.json`);
}

export async function readAuthoredUnits() {
  const index = await readUnitIndex();
  return Promise.all(index.units.map((entry) => readJson(entry.path)));
}

export function reviewVocabularyUnitIds(unitId) {
  const unitIds = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) {
    unitIds.push(unitId - offset);
  }
  return unitIds;
}

export function lexiconVocabularyUnitIds(unitId, authoredUnitIds) {
  const reviewUnitIds = new Set(reviewVocabularyUnitIds(unitId));
  return authoredUnitIds.filter((sourceUnitId) => sourceUnitId < unitId && !reviewUnitIds.has(sourceUnitId));
}

export function knownVocabularyUnitIds(unitId, authoredUnitIds) {
  return authoredUnitIds.filter((sourceUnitId) => sourceUnitId <= unitId);
}

export function unitSpecById(source) {
  return new Map(source.units.map((unit) => [unit.id, unit]));
}

export function authoredUnitIds(source) {
  return source.units.map((unit) => unit.id).sort((a, b) => a - b);
}

export function wordsForUnits(source, unitIds) {
  const byId = unitSpecById(source);
  return unitIds.flatMap((unitId) => byId.get(unitId)?.newWords ?? []);
}

export function vocabularyPoolsForUnit(source, unitId) {
  const ids = authoredUnitIds(source);
  return {
    current: wordsForUnits(source, [unitId]),
    reviewDue: wordsForUnits(source, reviewVocabularyUnitIds(unitId)),
    lexicon: wordsForUnits(source, lexiconVocabularyUnitIds(unitId, ids)),
    helpers: wordsForUnits(source, knownVocabularyUnitIds(unitId, ids)),
  };
}

export function availableGrammarForUnit(source, unitId) {
  return source.units
    .filter((unit) => unit.id <= unitId)
    .map((unit) => ({
      unitId: unit.id,
      grammarFocus: unit.grammarFocus,
    }));
}

export function cardBandForPosition(pacing, cardNumber) {
  return pacing.cardBands.find((band) => cardNumber >= band.start && cardNumber <= band.end) ?? null;
}

export function firstWordPositions(unit) {
  const positions = new Map();
  for (const [cardIndex, card] of unit.cards.entries()) {
    for (const token of card.tokens ?? []) {
      if (token.wordId && !positions.has(token.wordId)) {
        positions.set(token.wordId, cardIndex + 1);
      }
    }
  }
  return positions;
}

export function wordAppearanceCounts(unit) {
  const counts = new Map();
  for (const card of unit.cards ?? []) {
    const wordIds = new Set();
    for (const token of card.tokens ?? []) {
      if (token.wordId) wordIds.add(token.wordId);
    }
    for (const wordId of wordIds) {
      counts.set(wordId, (counts.get(wordId) ?? 0) + 1);
    }
  }
  return counts;
}

export function firstGrammarTagPositions(unit) {
  const positions = new Map();
  for (const [cardIndex, card] of unit.cards.entries()) {
    for (const tag of card.grammarTags ?? []) {
      if (!positions.has(tag)) positions.set(tag, cardIndex + 1);
    }
  }
  return positions;
}

export function wordKey(word) {
  return `${word.id}|${word.surface}|${word.reading}|${word.meaning}|${word.function}`;
}
