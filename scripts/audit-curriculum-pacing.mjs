import {
  firstGrammarTagPositions,
  firstWordPositions,
  readAuthoredUnits,
  readPacingRules,
  readUnitSpecs,
  reviewVocabularyUnitIds,
  vocabularyPoolsForUnit,
} from "./lib/curriculum-model.mjs";

const strict = process.argv.includes("--strict");
const verbose = process.argv.includes("--verbose");
const source = await readUnitSpecs();
const pacing = await readPacingRules();
const authoredUnits = await readAuthoredUnits();
const unitById = new Map(authoredUnits.map((unit) => [unit.id, unit]));
const warnings = [];
const seenGrammarTags = new Set();

for (const unitSpec of source.units) {
  const unit = unitById.get(unitSpec.id);
  if (!unit) continue;

  const firstWords = firstWordPositions(unit);
  const firstTags = firstGrammarTagPositions(unit);
  const pools = vocabularyPoolsForUnit(source, unit.id);

  for (const word of pools.current) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen || firstSeen > pacing.cutoffs.currentWordFirstSeenBy) {
      warnings.push(`unit ${unit.id}: current word ${word.id} first appears at ${firstSeen ?? "never"}, after cutoff ${pacing.cutoffs.currentWordFirstSeenBy}`);
    }
  }

  for (const word of pools.reviewDue) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen || firstSeen > pacing.cutoffs.reviewWordFirstSeenBy) {
      warnings.push(`unit ${unit.id}: review-due word ${word.id} first appears at ${firstSeen ?? "never"}, after cutoff ${pacing.cutoffs.reviewWordFirstSeenBy}`);
    }
  }

  for (const [tag, firstSeen] of firstTags) {
    if (!seenGrammarTags.has(tag) && firstSeen > pacing.cutoffs.grammarFocusFirstSeenBy) {
      warnings.push(`unit ${unit.id}: grammar tag "${tag}" first appears at ${firstSeen}, after cutoff ${pacing.cutoffs.grammarFocusFirstSeenBy}`);
    }
  }

  for (const tag of firstTags.keys()) seenGrammarTags.add(tag);

  const dueUnitIds = reviewVocabularyUnitIds(unit.id);
  if (dueUnitIds.length > 0 && pools.reviewDue.length === 0) {
    warnings.push(`unit ${unit.id}: expected review pool from units ${dueUnitIds.join(", ")} but found no words`);
  }
}

if (warnings.length > 0) {
  const visibleWarnings = verbose ? warnings : warnings.slice(0, 40);
  for (const warning of visibleWarnings) console.warn(`${strict ? "FAIL" : "WARN"} ${warning}`);
  if (!verbose && warnings.length > visibleWarnings.length) {
    console.warn(`WARN ${warnings.length - visibleWarnings.length} additional pacing warnings hidden; rerun with --verbose to list every warning.`);
  }
  console.warn(`${warnings.length} curriculum pacing ${strict ? "failure" : "warning"}${warnings.length === 1 ? "" : "s"}.`);
  if (strict) process.exit(1);
} else {
  console.log("Curriculum pacing audit passed.");
}
