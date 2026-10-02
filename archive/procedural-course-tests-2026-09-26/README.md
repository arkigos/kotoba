# Retired procedural course acceptance tests

These files were previously in `apps/learner-next/tests/`. They describe live
Custom/Grammar generation, overlapping topic pools, sentence slot sequencing,
dynamic target selection, and numbered generated series. The September 26 user
direction replaces those features with a frozen authored course.

They are retained as historical reference, with their original imports unchanged;
they are not part of the active test suite or independently runnable here.
The new acceptance tests are `curated-course.test.ts`,
`curated-course-ui.test.tsx`, `starter-lessons.test.tsx`, and the updated shell,
Home, continuity, and progress tests. Generic player, saved-snapshot, storage,
audio, dictionary, review-timing, and exposure tests remain active. The root
procedural kernel tests remain available for the historical snapshot format.

Do not restore on-the-fly generation just to satisfy a retired acceptance test.
