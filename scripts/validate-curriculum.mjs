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

function isPreludeLevel(level) {
  return level?.courseStage === "prelude" || level?.code === "Kana";
}

function isSpecialCurriculumUnit(unit) {
  return unit?.kind === "kana" || unit?.kind === "kanji" || unit?.id >= 100;
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

function collectWordIdList(unit, unitById, unitIds) {
  return [...collectWordIds(unit, unitById, unitIds)];
}

function knownVocabularyUnitIds(unit, unitById) {
  if (isSpecialCurriculumUnit(unit)) return [unit.id];
  return [...unitById.keys()].filter((sourceUnitId) => sourceUnitId >= 1 && sourceUnitId <= unit.id && sourceUnitId < 100).sort((a, b) => a - b);
}

function lexiconVocabularyUnitIds(unit, unitById) {
  if (isSpecialCurriculumUnit(unit)) return [];
  const reviewUnitIds = new Set(reviewVocabularyUnitIds(unit.id));
  return [...unitById.keys()].filter((sourceUnitId) => sourceUnitId >= 1 && sourceUnitId < unit.id && sourceUnitId < 100 && !reviewUnitIds.has(sourceUnitId)).sort((a, b) => a - b);
}

function sameList(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function isAllowedFunctionWordKind(kind) {
  return ["particle", "copula", "sentence ending", "grammar"].includes(kind);
}

function isAllowedGrammarTokenKind(kind) {
  return ["existence verb", "predicate adjective", "question word", "request phrase", "permission phrase", "prohibition phrase", "ongoing action phrase", "grammar"].includes(kind);
}

function looksLikeLexicalPoliteVerb(word) {
  const surface = word.surface ?? "";
  const reading = word.reading ?? "";
  const blockedExistenceForms = new Set(["あります", "ありません", "います", "いません"]);
  if (blockedExistenceForms.has(surface) || blockedExistenceForms.has(reading)) return true;
  return (surface.endsWith("ます") || reading.endsWith("ます")) && word.function !== "copula";
}

function tokenKey(token) {
  return `${token.surface}|${token.reading}`;
}

const punctuationTokenKeys = new Set(["\uFF1F|\uFF1F", "\u3001|\u3001"]);

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
  assert(Array.isArray(courseLevels.levels) && courseLevels.levels.length === 5, "course levels must contain one prelude plus four core levels", failures);

  const expectedLevelCodes = ["Kana", "A1", "A2", "B1", "B2"];
  const coveredPlannedUnits = new Set();
  let expectedNextUnit = 1;
  for (const [levelIndex, level] of (courseLevels.levels ?? []).entries()) {
    assert(level.code === expectedLevelCodes[levelIndex], `course level ${levelIndex + 1}: expected code ${expectedLevelCodes[levelIndex]}, found ${level.code}`, failures);
    assert(level.title && typeof level.title === "string", `course level ${level.code ?? levelIndex + 1}: missing title`, failures);
    assert(level.canDoSummary && typeof level.canDoSummary === "string", `course level ${level.code ?? levelIndex + 1}: missing canDoSummary`, failures);
    assert(Number.isInteger(level.unitEnd) && level.unitEnd >= level.unitStart, `course level ${level.code}: invalid unit range`, failures);

    if (isPreludeLevel(level)) {
      assert(level.unitStart >= 100, `prelude level ${level.code}: unitStart should use the 100+ special range`, failures);
      continue;
    }

    assert(level.unitStart === expectedNextUnit, `course level ${level.code}: expected unitStart ${expectedNextUnit}, found ${level.unitStart}`, failures);
    for (let unitId = level.unitStart; unitId <= level.unitEnd; unitId += 1) {
      assert(!coveredPlannedUnits.has(unitId), `planned unit ${unitId} appears in multiple levels`, failures);
      coveredPlannedUnits.add(unitId);
    }
    expectedNextUnit = level.unitEnd + 1;
  }
  assert(coveredPlannedUnits.size === courseLevels.plannedUnitCount, `course levels cover ${coveredPlannedUnits.size} planned units, expected ${courseLevels.plannedUnitCount}`, failures);
  assert(expectedNextUnit === courseLevels.plannedUnitCount + 1, `course levels must end at planned unit ${courseLevels.plannedUnitCount}`, failures);

  const functionWords = await readJson("data/jp/curriculum/function_words.json");
  assert(Array.isArray(functionWords), "function_words.json must be an array", failures);
  const functionWordIds = new Set();
  const functionWordKeys = new Set();
  for (const word of functionWords ?? []) {
    const label = `function word ${word?.id ?? "(missing id)"}`;
    assert(word.id && word.surface && word.reading && word.meaning && word.function, `${label}: needs id, surface, reading, meaning, function`, failures);
    assert(!functionWordIds.has(word.id), `${label}: duplicate id`, failures);
    functionWordIds.add(word.id);

    const key = `${word.surface}|${word.reading}`;
    assert(!functionWordKeys.has(key), `${label}: duplicate surface/reading ${key}`, failures);
    functionWordKeys.add(key);

    assert(isAllowedFunctionWordKind(word.function), `${label}: invalid function kind ${word.function}`, failures);
    assert(!looksLikeLexicalPoliteVerb(word), `${label}: lexical polite verbs such as あります/います must be tracked as vocabulary, not function words`, failures);
  }

  const grammarTokens = await readJson("data/jp/curriculum/grammar_tokens.json");
  assert(Array.isArray(grammarTokens), "grammar_tokens.json must be an array", failures);
  const grammarTokenIds = new Set();
  const grammarTokenKeys = new Set();
  for (const word of grammarTokens ?? []) {
    const label = `grammar token ${word?.id ?? "(missing id)"}`;
    assert(word.id && word.surface && word.reading && word.meaning && word.function, `${label}: needs id, surface, reading, meaning, function`, failures);
    assert(!grammarTokenIds.has(word.id), `${label}: duplicate id`, failures);
    grammarTokenIds.add(word.id);

    const key = `${word.surface}|${word.reading}`;
    assert(!grammarTokenKeys.has(key), `${label}: duplicate surface/reading ${key}`, failures);
    assert(!functionWordKeys.has(key), `${label}: duplicates function word surface/reading ${key}`, failures);
    grammarTokenKeys.add(key);

    assert(isAllowedGrammarTokenKind(word.function), `${label}: invalid function kind ${word.function}`, failures);
  }
  const documentedAnonymousTokenKeys = new Set([...functionWordKeys, ...grammarTokenKeys, ...punctuationTokenKeys]);

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
  const vocabularySurfaceReadings = new Map();
  for (const unit of units) {
    if (isSpecialCurriculumUnit(unit)) continue;
    for (const word of unit.newWords ?? []) {
      vocabularySurfaceReadings.set(`${word.surface}|${word.reading}`, `unit ${unit.id} word ${word.id}`);
    }
  }
  for (const word of functionWords ?? []) {
    const vocabularyOwner = vocabularySurfaceReadings.get(`${word.surface}|${word.reading}`);
    assert(!vocabularyOwner, `function word ${word.id}: ${word.surface}/${word.reading} duplicates tracked vocabulary in ${vocabularyOwner}`, failures);
  }
  for (const word of grammarTokens ?? []) {
    const vocabularyOwner = vocabularySurfaceReadings.get(`${word.surface}|${word.reading}`);
    assert(!vocabularyOwner, `grammar token ${word.id}: ${word.surface}/${word.reading} duplicates tracked vocabulary in ${vocabularyOwner}; use wordId on card tokens instead`, failures);
  }

  const introducedWords = new Map();

  for (const unit of units) {
    const isSpecialUnit = isSpecialCurriculumUnit(unit);
    assert(unit.grammarFocus && typeof unit.grammarFocus === "string", `unit ${unit.id}: missing grammarFocus`, failures);
    assert(Array.isArray(unit.newWords), `unit ${unit.id}: newWords must be an array`, failures);
    if (isSpecialUnit) {
      assert(unit.newWords.length > 0, `unit ${unit.id}: special units must define recognition items`, failures);
      assert(unit.kind === "kana" || unit.kind === "kanji", `unit ${unit.id}: special units must declare kind kana or kanji`, failures);
    } else {
      assert(unit.newWords.length >= 10, `unit ${unit.id}: expected at least 10 SRS words, found ${unit.newWords?.length ?? 0}`, failures);
      assert(unit.newWords.length <= 12, `unit ${unit.id}: expected no more than 12 SRS words without a documented exception, found ${unit.newWords?.length ?? 0}`, failures);
    }

    const unitWordIds = new Set();
    for (const word of unit.newWords ?? []) {
      assert(word.id && word.surface && word.reading && word.meaning && word.function, `unit ${unit.id}: word ${word.id ?? "(missing id)"} needs id, surface, reading, meaning, function`, failures);
      assert(!unitWordIds.has(word.id), `unit ${unit.id}: duplicate new word id ${word.id}`, failures);
      unitWordIds.add(word.id);

      const duplicateKey = `${word.surface}|${word.reading}|${word.meaning}`;
      if (!isSpecialUnit) {
        assert(!introducedWords.has(duplicateKey), `unit ${unit.id}: word ${word.surface} duplicates earlier unit ${introducedWords.get(duplicateKey)}`, failures);
        introducedWords.set(duplicateKey, unit.id);
      }
    }

    if (!Array.isArray(unit.cards) || unit.cards.length === 0) {
      failures.push(`unit ${unit.id}: cards must be a non-empty array`);
      continue;
    }

    if (!isSpecialUnit && (unit.cards.length < 80 || unit.cards.length > 150)) {
      warnings.push(`unit ${unit.id}: expected 80-150 cards for a standard unit, found ${unit.cards.length}`);
    }

    const currentWordIds = collectWordIds(unit, unitById, [unit.id]);
    const requiredReviewWordIds = isSpecialUnit ? new Set() : collectWordIds(unit, unitById, reviewVocabularyUnitIds(unit.id));
    const expectedReviewWordIds = isSpecialUnit ? [] : collectWordIdList(unit, unitById, reviewVocabularyUnitIds(unit.id));
    const expectedLexiconWordIds = collectWordIdList(unit, unitById, lexiconVocabularyUnitIds(unit, unitById));
    const allowedWordIds = collectWordIds(unit, unitById, knownVocabularyUnitIds(unit, unitById));
    const usedWordIds = new Set();

    assert(Array.isArray(unit.reviewWordIds), `unit ${unit.id}: reviewWordIds must be an array`, failures);
    assert(Array.isArray(unit.lexiconWordIds), `unit ${unit.id}: lexiconWordIds must be an array`, failures);
    if (Array.isArray(unit.reviewWordIds)) {
      assert(sameList(unit.reviewWordIds, expectedReviewWordIds), `unit ${unit.id}: reviewWordIds must match SRS due words ${expectedReviewWordIds.join(", ")}`, failures);
    }
    if (Array.isArray(unit.lexiconWordIds)) {
      assert(sameList(unit.lexiconWordIds, expectedLexiconWordIds), `unit ${unit.id}: lexiconWordIds must match non-due helper words ${expectedLexiconWordIds.join(", ")}`, failures);
    }

    for (const [cardIndex, card] of unit.cards.entries()) {
      const label = `unit ${unit.id} card ${card.id ?? cardIndex + 1}`;
      assert(card.id, `${label}: missing id`, failures);
      assert(card.english, `${label}: missing English meaning`, failures);
      assert(Array.isArray(card.line), `${label}: line must be an array`, failures);
      assert(Array.isArray(card.tts), `${label}: tts must be an array`, failures);
      assert(Array.isArray(card.explain), `${label}: explain must be an array`, failures);
      assert(card.line?.length === card.tts?.length && card.line?.length === card.explain?.length, `${label}: line/tts/explain length mismatch`, failures);
      assert(Array.isArray(card.tokens) && card.tokens.length === card.line?.length, `${label}: tokens must align to line`, failures);
      assert(!card.line?.includes("\u3002"), `${label}: omit Japanese full stops on single-card sentences`, failures);
      assert(!card.tokens?.some((part) => part.surface === "\u3002"), `${label}: omit Japanese full-stop tokens`, failures);
      assert(!/\.+$/.test(card.english), `${label}: omit terminal English periods on single-card translations`, failures);

      for (const part of card.tokens ?? []) {
        if (part.wordId) {
          usedWordIds.add(part.wordId);
          assert(allowedWordIds.has(part.wordId), `${label}: wordId ${part.wordId} has not been introduced yet`, failures);
        } else {
          assert(documentedAnonymousTokenKeys.has(tokenKey(part)), `${label}: anonymous token ${part.surface}/${part.reading} is not documented as a function word, grammar token, or punctuation`, failures);
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
