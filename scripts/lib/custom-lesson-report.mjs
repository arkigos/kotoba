import fs from "node:fs/promises";
import path from "node:path";

const escape = value => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");

/** Known content regressions are findings, separate from snapshot/coverage errors. */
export async function writeCustomLessonReport(directory) {
  const metrics = JSON.parse(await fs.readFile(path.join(directory, "metrics.json"), "utf8"));
  const findings = [];
  const pedagogyFindings = [];
  const rows = [];
  for (const metric of metrics) {
    if (metric.error) { rows.push(`| ${metric.key} | ${metric.expectedRejection ? "Expected rejection" : "FAILED"}: ${escape(metric.error)} | | | | |`); continue; }
    const lesson = JSON.parse(await fs.readFile(path.join(directory, `${metric.key}.json`), "utf8"));
    // A vocabulary-safe fallback is not evidence of useful practice. These are
    // review flags, not universal failures: greetings can be complete utterances.
    for (const id of metric.wordOnlyIds) {
      const appearances = lesson.cards.filter(card => card.targets.includes(id)).length;
      if (appearances >= 4) pedagogyFindings.push({ lesson: metric.key, target: id, appearances,
        reason: "repeated target without contextual practice; manually assess whether this is a complete useful utterance or a glossary loop" });
    }
    for (const card of lesson.cards) {
      const flags = [];
      // Deliberately narrow reviewed sentinels; not a universal semantic checker.
      if (/はとけいです$/.test(card.japanese)) flags.push("implausible clock identity");
      if (!card.id.startsWith("custom-word-") && /[（(]な[）)]/.test(card.japanese)) flags.push("dictionary adjective notation inside sentence");
      if (/\bdo shoppings\b/.test(card.english)) flags.push("malformed shopping translation");
      if (flags.length) findings.push({ lesson: metric.key, ...card, flags });
    }
    const text = [`# ${metric.key}`, "", `Targets: ${metric.selection.ids.join(", ")}.`, "",
      `Unselected, unpracticed supporting concepts: ${metric.unknown.join(", ") || "none"}.`, "",
      `${metric.cards} cards; ${metric.uniqueCards} distinct bilingual cards; ${metric.contexts} multi-token contexts.`, "",
      "These are review output from synthetic profiles. The corresponding JSON retains exact tokens, readings, explanations, known IDs, and the replayable session.", "",
      "| # | Source card | Japanese | English | Targets present | Unfamiliar extras | Transition |",
      "| --- | --- | --- | --- | --- | --- | --- |",
      ...lesson.cards.map(card => `| ${card.index} | ${card.id} | ${escape(card.japanese)} | ${escape(card.english)} | ${card.targets.join(", ")} | ${card.unknown.join(", ")} | ${card.transition.kind} |`), ""].join("\n");
    await fs.writeFile(path.join(directory, `${metric.key}.md`), text);
    rows.push(`| [${metric.key}](${metric.key}.md) | ${metric.cards} | ${metric.uniqueCards} | ${metric.unknown.length} | ${metric.wordOnlyIds.length} | ${metric.errors.join(", ") || "pass"} |`);
  }
  await fs.writeFile(path.join(directory, "content-findings.json"), JSON.stringify(findings, null, 2) + "\n");
  await fs.writeFile(path.join(directory, "pedagogy-findings.json"), JSON.stringify(pedagogyFindings, null, 2) + "\n");
  const summary = ["# Generated custom lesson inventory", "",
    "Run `node scripts/audit-custom-lessons.mjs` from the repository root to regenerate. Add `--strict-content` to fail on the known semantic/translation findings as well as mechanical errors. Only lessons listed here belong to the current run.", "",
    "Synthetic profiles: no practice; actual reading practice of units 1–10 vocabulary; actual reading practice of all authored A1 vocabulary. ‘Known’ here means previously practiced under the current app rule, not demonstrated mastery. No browser data is read or changed.", "",
    "Each profile receives first/last selections from all 12 topics, complete 12-word batches of the 578 authored A1 IDs, seeded mixed selections (1/2/6/12/30 targets), explicit aliases, 18-card work practice, single-word and 480-card stress cases, and two actual unplaced dictionary entries alone and with book. Seed 913 fixes mixed selections. Session UUIDs/timestamps are intentionally fresh.", "",
    `Attempts: ${metrics.length}. Generated: ${metrics.filter(row => !row.error).length}. Cards: ${metrics.reduce((sum, row) => sum + (row.cards ?? 0), 0)}. Expected repetition rejections: ${metrics.filter(row => row.expectedRejection).length}. Mechanical failures: ${metrics.filter(row => row.error ? !row.expectedRejection : row.errors.length).length}.`, "",
    "Mechanical checks cover exact target accounting, eight appearances by default/six for shortened lessons, final spread at most four, actual requested size, zero unselected unfamiliar words, early target introduction, full helper reporting, token alignment, unlinked token classification, licensed generated context provenance, transition metadata, unmodified learner state, and exact JSON-roundtrip replay. Oversized word-repetition requests must be rejected. These checks do not certify all natural language or teaching quality.", "",
    `Narrow content sentinels found ${findings.length} flagged appearances across ${new Set(findings.map(row => row.lesson)).size} lessons. See [content findings](content-findings.json) and the manually reviewed [report](REPORT.md). Counts can overlap; the sentinels are not an exhaustive semantic audit.`, "",
    `Teaching-quality review required: ${pedagogyFindings.length} repeated targets have no contextual practice across ${new Set(pedagogyFindings.map(row => row.lesson)).size} lessons. See [pedagogy findings](pedagogy-findings.json). Mechanical pass does not clear these flags. Some are valid standalone phrases; others expose missing constructions.`, "",
    "| Lesson | Cards | Distinct cards | Unknown extras | Targets without context | Mechanical checks |",
    "| --- | --- | --- | --- | --- | --- |", ...rows, ""].join("\n");
  await fs.writeFile(path.join(directory, "index.md"), summary);
  return { flaggedAppearances: findings.length, flaggedLessons: new Set(findings.map(row => row.lesson)).size,
    pedagogyFlags: pedagogyFindings.length, pedagogyLessons: new Set(pedagogyFindings.map(row => row.lesson)).size };
}
