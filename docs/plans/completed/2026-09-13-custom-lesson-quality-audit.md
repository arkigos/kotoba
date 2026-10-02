# Custom lesson quality audit

Request: generate many real custom lessons and inspect unselected/unfamiliar vocabulary, structure, and general content quality.

- Use the active `buildCustomLesson` adapter with isolated synthetic learner profiles; preserve the user's browser progress and existing working changes.
- Export reproducible selections, exact generated cards, independently counted vocabulary and coverage, repetition, spacing, and transition metrics.
- Cover fresh, partially practiced, and fully practiced profiles; topic batches, mixed selections, aliases, reference entries, and short/long counts.
- Distinguish the documented six-unknown-helper allowance from unreported leakage. Inspect tokens without learning IDs and sample Japanese/English manually.
- Fix demonstrated implementation defects, add focused regression checks, and run the repository's applicable tests/builds. Record remaining product/content limitations honestly.

Status: completed audit. Generated 252 sessions / 21,731 cards across all 578
authored A1 IDs and two reference entries. Exact results and the manual review
are in `docs/reviews/custom-lessons/REPORT.md` and `index.md`.

All mechanical assertions passed. Content review found 286 appearances of three
narrow semantic/translation defects in 58 lessons, plus widespread unselected
unknown helpers, poor variety in some selections, and late target introduction.
These are documented product/content corrections, not silently changed runtime
policy. Added a reproducible audit, bilingual exports, content sentinels, and an
optional strict-content failure mode. No curriculum or app behavior was edited.

Verification: 402 repository tests, 27 focused Custom/sequence tests, and root
production build passed. See the report for limitations and correction priorities.
