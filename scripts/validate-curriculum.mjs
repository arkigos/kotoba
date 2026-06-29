import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export function reviewVocabularyUnitIds(unitId) {
  const units = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) {
    units.push(unitId - offset);
  }
  return units;
}

async function readJson(relativePath) {
  const filePath = path.join(root, relativePath);
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${relativePath}: invalid JSON or unreadable file: ${error.message}`);
  }
}

async function readText(relativePath) {
  const filePath = path.join(root, relativePath);
  try {
    return await fs.readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`${relativePath}: unreadable file: ${error.message}`);
  }
}

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

function levelForUnit(levels, unitId) {
  return levels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd);
}

function plannedUnitIdsFromGrammarMap(markdown) {
  return [...markdown.matchAll(/^(\d{3})\.\s+/gm)].map((match) => Number(match[1]));
}

function collectWordIds(unit, unitById, unitIds) {
  const ids = new Set();
  for (const sourceUnitId of unitIds) {
    const sourceUnit = unitById.get(sourceUnitId);
    if (!sourceUnit) continue;
    for (const word of sourceUnit.newWords ?? []) ids.add(word.id);
  }
  return ids;
}

function knownVocabularyUnitIds(unit, unitById) {
  return [...unitById.keys()].filter((sourceUnitId) => sourceUnitId <= unit.id).sort((a, b) => a - b);
}

export async function validateCurriculum() {
  const failures = [];
  const warnings = [];

  const languages = await readJson("data/languages.json");
  assert(Array.isArray(languages) && languages.length > 0, "languages.json must contain at least one language", failures);

  const index = await readJson("data/jp/curriculum/unit_index.json");
  assert(index.language === "jp", "Japanese unit index must declare language jp", failures);
  assert(Array.isArray(index.units) && index.units.length > 0, "Japanese unit index must contain units", failures);

  const courseLevels = await readJson("data/jp/curriculum/course_levels.json");
  assert(courseLevels.language === "jp", "Japanese course levels must declare language jp", failures);
  assert(courseLevels.certificationClaim === false, "course levels must not claim official certification", failures);
  assert(courseLevels.plannedUnitCount === 96, `expected 96 planned units, found ${courseLevels.plannedUnitCount}`, failures);
  assert(Array.isArray(courseLevels.levels) && courseLevels.levels.length === 4, "course levels must contain four levels", failures);

  const expectedLevelCodes = ["A1", "A2", "B1", "B2"];
  const coveredPlannedUnits = new Set();
  let expectedNextUnit = 1;
  for (const [levelIndex, level] of (courseLevels.levels ?? []).entries()) {
    assert(level.code === expectedLevelCodes[levelIndex], `course level ${levelIndex + 1}: expected code ${expectedLevelCodes[levelIndex]}, found ${level.code}`, failures);
    assert(level.title && typeof level.title === "string", `course level ${level.code ?? levelIndex + 1}: missing title`, failures);
    assert(level.canDoSummary && typeof level.canDoSummary === "string", `course level ${level.code ?? levelIndex + 1}: missing canDoSummary`, failures);
    assert(level.unitStart === expectedNextUnit, `course level ${level.code}: expected unitStart ${expectedNextUnit}, found ${level.unitStart}`, failures);
    assert(Number.isInteger(level.unitEnd) && level.unitEnd >= level.unitStart, `course level ${level.code}: invalid unit range`, failures);

    for (let unitId = level.unitStart; unitId <= level.unitEnd; unitId += 1) {
      assert(!coveredPlannedUnits.has(unitId), `planned unit ${unitId} appears in multiple levels`, failures);
      coveredPlannedUnits.add(unitId);
    }
    expectedNextUnit = level.unitEnd + 1;
  }
  assert(coveredPlannedUnits.size === courseLevels.plannedUnitCount, `course levels cover ${coveredPlannedUnits.size} planned units, expected ${courseLevels.plannedUnitCount}`, failures);
  assert(expectedNextUnit === courseLevels.plannedUnitCount + 1, `course levels must end at planned unit ${courseLevels.plannedUnitCount}`, failures);

  const grammarMap = await readText("data/jp/curriculum/grammar_by_unit.md");
  const plannedUnitIds = plannedUnitIdsFromGrammarMap(grammarMap);
  const seenPlannedUnitIds = new Set();
  for (const [index, unitId] of plannedUnitIds.entries()) {
    const expectedUnitId = index + 1;
    assert(unitId === expectedUnitId, `grammar map unit sequence must be contiguous: expected ${String(expectedUnitId).padStart(3, "0")}, found ${String(unitId).padStart(3, "0")}`, failures);
    assert(!seenPlannedUnitIds.has(unitId), `grammar map duplicate planned unit ${unitId}`, failures);
    seenPlannedUnitIds.add(unitId);
    assert(Boolean(levelForUnit(courseLevels.levels ?? [], unitId)), `grammar map planned unit ${unitId} is not assigned to a course level`, failures);
  }
  assert(plannedUnitIds.length === courseLevels.plannedUnitCount, `grammar map must contain ${courseLevels.plannedUnitCount} planned units, found ${plannedUnitIds.length}`, failures);

  const expectedBins = new Map([
    [1, [1]],
    [2, [2]],
    [3, [3, 1]],
    [4, [4, 2]],
    [5, [5, 3, 1]],
    [9, [9, 7, 5, 1]],
    [17, [17, 15, 13, 9, 1]],
    [33, [33, 31, 29, 25, 17, 1]],
  ]);

  for (const [unitId, expected] of expectedBins) {
    const actual = [unitId, ...reviewVocabularyUnitIds(unitId)];
    assert(JSON.stringify(actual) === JSON.stringify(expected), `word-bin formula failed for unit ${unitId}: expected ${expected.join(", ")} got ${actual.join(", ")}`, failures);
  }

  const units = [];
  const seenUnitIds = new Set();
  let previousUnitId = 0;
  for (const entry of index.units) {
    assert(Number.isInteger(entry.id), `unit index entry ${entry.slug} must have integer id`, failures);
    assert(entry.id > previousUnitId, `unit ids must be strictly ordered: ${entry.id} follows ${previousUnitId}`, failures);
    assert(!seenUnitIds.has(entry.id), `duplicate unit id ${entry.id}`, failures);
    assert(Boolean(levelForUnit(courseLevels.levels ?? [], entry.id)), `authored unit ${entry.id} is not assigned to a course level`, failures);
    seenUnitIds.add(entry.id);
    previousUnitId = entry.id;
    units.push(await readJson(`data/jp/curriculum/units/unit_${String(entry.id).padStart(3, "0")}.json`));
  }

  const unitById = new Map(units.map((unit) => [unit.id, unit]));
  const introducedWords = new Map();

  for (const unit of units) {
    assert(unit.grammarFocus && typeof unit.grammarFocus === "string", `unit ${unit.id}: missing grammarFocus`, failures);
    assert(Array.isArray(unit.newWords), `unit ${unit.id}: newWords must be an array`, failures);
    assert(unit.newWords.length === 10, `unit ${unit.id}: expected exactly 10 new words, found ${unit.newWords?.length ?? 0}`, failures);

    const unitWordIds = new Set();
    for (const word of unit.newWords ?? []) {
      assert(word.id && word.surface && word.reading && word.meaning && word.function, `unit ${unit.id}: word ${word.id ?? "(missing id)"} needs id, surface, reading, meaning, function`, failures);
      assert(!unitWordIds.has(word.id), `unit ${unit.id}: duplicate new word id ${word.id}`, failures);
      unitWordIds.add(word.id);

      const duplicateKey = `${word.surface}|${word.reading}|${word.meaning}`;
      assert(!introducedWords.has(duplicateKey), `unit ${unit.id}: word ${word.surface} duplicates earlier unit ${introducedWords.get(duplicateKey)}`, failures);
      introducedWords.set(duplicateKey, unit.id);
    }

    if (!Array.isArray(unit.cards) || unit.cards.length === 0) {
      failures.push(`unit ${unit.id}: cards must be a non-empty array`);
      continue;
    }

    if (unit.cards.length < 80 || unit.cards.length > 150) {
      warnings.push(`unit ${unit.id}: expected 80-150 cards for a standard unit, found ${unit.cards.length}`);
    }

    const currentWordIds = collectWordIds(unit, unitById, [unit.id]);
    const requiredReviewWordIds = collectWordIds(unit, unitById, reviewVocabularyUnitIds(unit.id));
    const allowedWordIds = collectWordIds(unit, unitById, knownVocabularyUnitIds(unit, unitById));
    const usedWordIds = new Set();
    for (const [cardIndex, card] of unit.cards.entries()) {
      const label = `unit ${unit.id} card ${card.id ?? cardIndex + 1}`;
      assert(card.id, `${label}: missing id`, failures);
      assert(card.english, `${label}: missing English meaning`, failures);
      assert(card.imagePrompt || card.imageRef, `${label}: needs imagePrompt or imageRef`, failures);
      assert(Array.isArray(card.line), `${label}: line must be an array`, failures);
      assert(Array.isArray(card.tts), `${label}: tts must be an array`, failures);
      assert(Array.isArray(card.explain), `${label}: explain must be an array`, failures);
      assert(card.line?.length === card.tts?.length && card.line?.length === card.explain?.length, `${label}: line/tts/explain length mismatch`, failures);
      assert(Array.isArray(card.tokens) && card.tokens.length === card.line?.length, `${label}: tokens must align to line`, failures);

      for (const part of card.tokens ?? []) {
        if (part.wordId) {
          usedWordIds.add(part.wordId);
          assert(allowedWordIds.has(part.wordId), `${label}: wordId ${part.wordId} has not been introduced yet`, failures);
        }
      }
    }

    for (const wordId of currentWordIds) {
      assert(usedWordIds.has(wordId), `unit ${unit.id}: current new word ${wordId} is never drilled`, failures);
    }
    for (const wordId of requiredReviewWordIds) {
      assert(usedWordIds.has(wordId), `unit ${unit.id}: scheduled review word ${wordId} does not return`, failures);
    }
  }

  return { failures, warnings };
}

if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}` || process.argv[1]?.endsWith("validate-curriculum.mjs")) {
  const { failures, warnings } = await validateCurriculum();

  for (const warning of warnings) console.warn(`WARN ${warning}`);
  if (failures.length > 0) {
    for (const failure of failures) console.error(`FAIL ${failure}`);
    process.exit(1);
  }

  console.log("Curriculum validation passed.");
}
