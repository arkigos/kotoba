import { readAuthoredUnits, readJson, readUnitIndex, readUnitSpecs, wordKey } from "./lib/curriculum-model.mjs";

function assert(condition, message, failures) {
  if (!condition) failures.push(message);
}

function sameWords(left, right) {
  return JSON.stringify(left.map(wordKey)) === JSON.stringify(right.map(wordKey));
}

function runtimeWord(word) {
  return {
    id: word.id,
    surface: word.surface,
    reading: word.reading,
    meaning: word.meaning,
    function: word.function,
  };
}

function isSpecialUnit(unit) {
  return unit?.kind === "kana" || unit?.kind === "kanji" || unit?.id >= 100;
}

const failures = [];
const source = await readUnitSpecs();
const index = await readUnitIndex();
const runtimeLexicon = await readJson("data/jp/curriculum/runtime_lexicon.json");
const bindings = (await readJson("data/jp/dictionary/course_bindings.json")).words;
const authoredUnits = await readAuthoredUnits();
const sourceUnits = new Map(source.units.map((unit) => [unit.id, unit]));

assert(source.schemaVersion === 1, "source/unit_specs.json must use schemaVersion 1", failures);
assert(source.language === "jp", "source/unit_specs.json must declare language jp", failures);
assert(source.units.length === index.units.length, `source has ${source.units.length} units, index has ${index.units.length}`, failures);

const seenUnitIds = new Set();
const seenWordIds = new Map();
const seenWordKeys = new Map();
const expectedRuntimeWords = [];

for (const entry of index.units) {
  const unit = authoredUnits.find((candidate) => candidate.id === entry.id);
  const spec = sourceUnits.get(entry.id);
  assert(Boolean(spec), `unit ${entry.id}: missing source spec`, failures);
  if (!spec || !unit) continue;

  assert(!seenUnitIds.has(spec.id), `unit ${spec.id}: duplicate source unit id`, failures);
  seenUnitIds.add(spec.id);
  assert(spec.slug === entry.slug, `unit ${spec.id}: source slug ${spec.slug} does not match index ${entry.slug}`, failures);
  assert(spec.title === entry.title, `unit ${spec.id}: source title does not match index title`, failures);
  assert(spec.grammarFocus === entry.grammarFocus, `unit ${spec.id}: source grammarFocus does not match index grammarFocus`, failures);
  assert(spec.slug === unit.slug, `unit ${spec.id}: source slug does not match frozen unit`, failures);
  assert(spec.title === unit.title, `unit ${spec.id}: source title does not match frozen unit`, failures);
  assert(spec.grammarFocus === unit.grammarFocus, `unit ${spec.id}: source grammarFocus does not match frozen unit`, failures);
  assert(sameWords(spec.newWords, unit.newWords), `unit ${spec.id}: source newWords do not match frozen unit`, failures);

  for (const word of spec.newWords) {
    const binding = bindings[word.id];
    assert(Boolean(binding), `word ${word.id}: missing dictionary binding`, failures);
    if (binding) expectedRuntimeWords.push({ ...runtimeWord({ id: word.id, ...binding }), introducedInUnit: binding.introducedInUnit,
      level: binding.level, dictionaryEntryId: binding.entryId, ...(binding.audioText ? { audioText: binding.audioText } : {}) });
    assert(word.id && word.surface && word.reading && word.meaning && word.function, `unit ${spec.id}: word ${word.id ?? "(missing id)"} needs id, surface, reading, meaning, function`, failures);
    assert(!seenWordIds.has(word.id), `word id ${word.id} appears in both unit ${seenWordIds.get(word.id)} and unit ${spec.id}`, failures);
    seenWordIds.set(word.id, spec.id);

    const duplicateKey = `${word.surface}|${word.reading}|${word.meaning}`;
    if (!isSpecialUnit(spec)) {
      assert(!seenWordKeys.has(duplicateKey), `word ${word.surface}/${word.reading}/${word.meaning} appears in both unit ${seenWordKeys.get(duplicateKey)} and unit ${spec.id}`, failures);
      seenWordKeys.set(duplicateKey, spec.id);
    }
  }
}

expectedRuntimeWords.sort((a, b) => a.id.localeCompare(b.id));
assert(runtimeLexicon.language === source.language, "runtime_lexicon.json language must match source language", failures);
assert(runtimeLexicon.generatedFrom === "data/jp/dictionary/course_bindings.json", "runtime_lexicon.json generatedFrom must point at dictionary/course_bindings.json", failures);
assert(JSON.stringify(runtimeLexicon.words) === JSON.stringify(expectedRuntimeWords), "runtime_lexicon.json is out of sync; run npm run curriculum:sync-runtime-lexicon", failures);

if (failures.length > 0) {
  for (const failure of failures) console.error(`FAIL ${failure}`);
  process.exit(1);
}

console.log("Curriculum source audit passed.");
