# Remove Generated A2 From Authored Curriculum

Date: 2026-07-09

Status: Superseded in part by the 2026-07-16 Marugoto Starter A1 rebuild. The
old generated A2 removal decision still stands, but Units 21-49 are now active
Marugoto Starter A1 supplemental units. Future A2 currently starts at Unit 50 in
`data/jp/curriculum/course_levels.json`.

## Decision

Remove authored Units 21-44 from the active curriculum and source specs.
Keep A2 as a planned course level, but do not ship or use the old generated A2
unit JSON as examples for future authoring.

## Rationale

The old A2 band was validator-clean but not built to the current Kotoba lesson
standards: sentence context, one new learner-facing element at a time, tight
distribution, semantic review, and deliberate pacing. Keeping those units live
risks letting their patterns color future rebuilds.

## Consequences

- The old generated A2 Units 21-44 remain removed as A2 material.
- Unit IDs 21-49 are now active A1 supplemental units from the Marugoto Starter
  rebuild.
- Future A2 work should use the current planned A2 range from
  `data/jp/curriculum/course_levels.json`.
- Old A2 authoring scripts are removed from the active toolchain.
- Future A2 work should start from rules, vocabulary choices, and acceptance
  checks rather than from deleted frozen card JSON.
