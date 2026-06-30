# A2 Rebuild Rules Pass

## Goal

Regenerate A2 as a durable level artifact instead of hand-patching frozen cards.

## Scope

- Rebuild Units 21-44 from the A2 authoring scripts.
- Add an A2 enforcement pass for current vocabulary, review-due vocabulary, grammar pacing, and visible question markers.
- Keep the frozen unit JSON and audio manifests in sync after enforcement.
- Add tests that lock A2 pacing and question tokenization.

## Acceptance

- A2 current vocabulary first appears by the current-word cutoff.
- A2 review-due vocabulary first appears by the review cutoff.
- Productive A2 questions keep `か` visible as its own token.
- `npm run validate:all`, `npm run test -- --run`, and `npm run build` pass.

## Result

Completed 2026-06-29.

- Added `curriculum:rebuild-a2` and `curriculum:enforce-a2`.
- Rebuilt frozen A2 Units 21-44 with vocabulary landing cards and early review-due returns.
- Split productive A2 question endings so `か` remains visible.
- Synced A2 audio manifests after enforcement.
- Added tests for A2 pacing and visible question markers.
