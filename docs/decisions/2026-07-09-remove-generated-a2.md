# Remove Generated A2 From Authored Curriculum

Date: 2026-07-09

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

- The live authored curriculum is Kana 101-103 and A1 Units 1-20.
- Unit IDs 21-44 are available for a future A2 rebuild from the current rules.
- Old A2 authoring scripts are removed from the active toolchain.
- Future A2 work should start from rules, vocabulary choices, and acceptance
  checks rather than from deleted frozen card JSON.
