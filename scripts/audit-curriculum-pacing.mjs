import {
  firstGrammarTagPositions,
  firstWordPositions,
  readAuthoredUnits,
  readPacingRules,
  readUnitSpecs,
  reviewVocabularyUnitIds,
  vocabularyPoolsForUnit,
  wordAppearanceCounts,
} from "./lib/curriculum-model.mjs";

const strict = process.argv.includes("--strict");
const showDistribution = process.argv.includes("--distribution");
const strictDistribution = process.argv.includes("--strict-distribution");
const verbose = process.argv.includes("--verbose");
const source = await readUnitSpecs();
const pacing = await readPacingRules();
const authoredUnits = await readAuthoredUnits();
const unitById = new Map(authoredUnits.map((unit) => [unit.id, unit]));
const pacingWarnings = [];
const distributionWarnings = [];
const seenGrammarTags = new Set();

for (const unitSpec of source.units) {
  const unit = unitById.get(unitSpec.id);
  if (!unit) continue;

  const firstWords = firstWordPositions(unit);
  const firstTags = firstGrammarTagPositions(unit);
  const wordCounts = wordAppearanceCounts(unit);
  const pools = vocabularyPoolsForUnit(source, unit.id);

  for (const word of pools.current) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen || firstSeen > pacing.cutoffs.currentWordFirstSeenBy) {
      pacingWarnings.push(`unit ${unit.id}: current word ${word.id} first appears at ${firstSeen ?? "never"}, after cutoff ${pacing.cutoffs.currentWordFirstSeenBy}`);
    }

    const appearances = wordCounts.get(word.id) ?? 0;
    if ((showDistribution || strictDistribution) && appearances < pacing.distributionTargets.currentWordAppearances) {
      distributionWarnings.push(`unit ${unit.id}: current word ${word.id} appears ${appearances} times, below floor ${pacing.distributionTargets.currentWordAppearances}`);
    }
    if ((showDistribution || strictDistribution) && pacing.distributionTargets.currentWordMaxAppearances && appearances > pacing.distributionTargets.currentWordMaxAppearances) {
      distributionWarnings.push(`unit ${unit.id}: current word ${word.id} appears ${appearances} times, above ceiling ${pacing.distributionTargets.currentWordMaxAppearances}`);
    }
  }

  for (const word of pools.reviewDue) {
    const firstSeen = firstWords.get(word.id);
    if (!firstSeen) {
      pacingWarnings.push(`unit ${unit.id}: review-due word ${word.id} does not return in this unit`);
      continue;
    }

    const appearances = wordCounts.get(word.id) ?? 0;
    if ((showDistribution || strictDistribution) && appearances < pacing.distributionTargets.reviewWordAppearances) {
      distributionWarnings.push(`unit ${unit.id}: review-due word ${word.id} appears ${appearances} times, below target ${pacing.distributionTargets.reviewWordAppearances}`);
    }
    if ((showDistribution || strictDistribution) && pacing.distributionTargets.reviewWordMaxAppearances && appearances > pacing.distributionTargets.reviewWordMaxAppearances) {
      distributionWarnings.push(`unit ${unit.id}: review-due word ${word.id} appears ${appearances} times, above ceiling ${pacing.distributionTargets.reviewWordMaxAppearances}`);
    }
  }

  for (const [tag, firstSeen] of firstTags) {
    if (!seenGrammarTags.has(tag) && firstSeen > pacing.cutoffs.grammarFocusFirstSeenBy) {
      pacingWarnings.push(`unit ${unit.id}: grammar tag "${tag}" first appears at ${firstSeen}, after cutoff ${pacing.cutoffs.grammarFocusFirstSeenBy}`);
    }
  }

  for (const tag of firstTags.keys()) seenGrammarTags.add(tag);

  const dueUnitIds = reviewVocabularyUnitIds(unit.id);
  if (dueUnitIds.length > 0 && pools.reviewDue.length === 0) {
    pacingWarnings.push(`unit ${unit.id}: expected review pool from units ${dueUnitIds.join(", ")} but found no words`);
  }
}

const blockingWarnings = [...pacingWarnings, ...(strictDistribution ? distributionWarnings : [])];
const advisoryWarnings = strictDistribution ? [] : distributionWarnings;

if (blockingWarnings.length > 0 || advisoryWarnings.length > 0) {
  const visibleBlockingWarnings = verbose ? blockingWarnings : blockingWarnings.slice(0, 40);
  const visibleAdvisoryWarnings = verbose ? advisoryWarnings : advisoryWarnings.slice(0, 40);

  for (const warning of visibleBlockingWarnings) console.warn(`${strict || strictDistribution ? "FAIL" : "WARN"} ${warning}`);
  for (const warning of visibleAdvisoryWarnings) console.warn(`WARN ${warning}`);

  if (!verbose && blockingWarnings.length > visibleBlockingWarnings.length) {
    console.warn(`WARN ${blockingWarnings.length - visibleBlockingWarnings.length} additional pacing warnings hidden; rerun with --verbose to list every warning.`);
  }
  if (!verbose && advisoryWarnings.length > visibleAdvisoryWarnings.length) {
    console.warn(`WARN ${advisoryWarnings.length - visibleAdvisoryWarnings.length} additional distribution warnings hidden; rerun with --verbose to list every warning.`);
  }

  if (blockingWarnings.length > 0) {
    console.warn(`${blockingWarnings.length} curriculum pacing ${strict || strictDistribution ? "failure" : "warning"}${blockingWarnings.length === 1 ? "" : "s"}.`);
  }
  if (advisoryWarnings.length > 0) {
    console.warn(`${advisoryWarnings.length} curriculum distribution warning${advisoryWarnings.length === 1 ? "" : "s"}.`);
  }

  if ((strict || strictDistribution) && blockingWarnings.length > 0) process.exit(1);
} else {
  console.log("Curriculum pacing audit passed.");
}
