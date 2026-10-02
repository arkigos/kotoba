# Learn, review, and recency cycles

User requested clearing all existing lesson snapshots, then repeatedly generating
and completing lessons to verify that new words lead, all practiced words remain
available, older review outranks recent practice, and actual review resets time.

1. [x] Clear the live lesson shelf with a recoverable backup; preserve learning history.
2. [x] Audit review ranking and practice credit, including incidental helper words,
   aliases, recent versus overdue words, and preview versus actual consumption.
3. [x] Run multiple controlled-clock generation/completion cycles through production
   functions; inspect every Japanese/English lesson and repair demonstrated defects.
4. [x] Exercise live lesson creation/completion, run regressions/builds, and write the
   chronology, selection evidence and limits in a review report.

Completed: four live saved lessons / 168 cards, eight controlled-date lessons /
212 cards, all personally read. Fixed review ranking, alias recency, older helper
preference, safe standalone due contexts and infeasible repetition spacing.
459 tests pass; both builds and the final learner typecheck pass.
Report: `docs/reviews/2026-09-20-recency/REPORT.md`.
Decision: `docs/decisions/2026-09-20-review-recency.md`.
