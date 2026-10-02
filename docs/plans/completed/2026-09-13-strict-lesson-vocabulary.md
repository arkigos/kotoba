# Strict lesson vocabulary and content repairs

User directive: fix audit findings; never add unfamiliar words outside the selected lesson targets. Implement deterministic code rules, not advisory recommendations.

- Centralize selected/practiced vocabulary admission, fail closed on untracked lexical tokens, and apply it to Custom, Topics, and saved personalized replay.
- Remove the two/six unfamiliar-helper policy. Preserve exact requested target IDs, reviewed aliases, and exact word fallbacks.
- Repair demonstrated frozen-source semantic/form/translation defects in shared authoring code and materialized data; correct dictionary teaching metadata at its source.
- Improve introduction ordering without changing the chosen multiset or final coverage.
- Add regression tests and make the full 252-lesson audit require zero unfamiliar helpers and zero detected content defects. Run app, curriculum, asset, and build checks; resolve resulting failures.

Status: complete.

Implemented the shared zero-unknown gate for Custom, Topics, and app replay; explicit additional target selection is required for unfamiliar support words. Added canonical teaching metadata corrections and deterministic source repairs, preserved IDs/ordering, synchronized dictionary/runtime/assets, and reused exact existing audio without paid generation. Improved target introductions and coverage-preserving variety; excessive repetition requests now fail with an actionable message.

Verification: 249 generated lessons / 20,746 cards across all 578 A1 IDs and three profiles, zero unfamiliar extras or known content sentinel findings, and three expected repetition rejections. All 415 tests pass; both app builds and validate:all pass. An isolated full authoring rebuild produces 49 units / 4,236 cards with stable per-unit IDs/order and no original defect patterns. Detailed results and replayable exports are in docs/reviews/custom-lessons/REPORT.md.
