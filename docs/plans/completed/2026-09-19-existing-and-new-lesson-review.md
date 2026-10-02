# Existing lessons and new selections: manual review against tests

Inventory the actual browser shelf, read every existing saved lesson in full,
and rerun automated tests. Use the readings to judge the tests, not the reverse.
Repair demonstrated defects in the shared engine and add regression coverage;
remake affected saved lessons and reread them. Once existing lessons pass that
review, generate at least two additional topics and repeat the same process.
Record exact manual scope, mechanical checks, and any remaining limitations.

Completed: inspected the sole existing saved lesson (Daily life), repaired the
engine and remade it; created, read, repaired and remade Home and School. Read
all 173 final cards in the browser. Added per-target contextual regression tests
and explicit broad-audit teaching review flags. Full results and manual findings:
`docs/reviews/2026-09-19/REPORT.md`. Full suite 428/428, both builds pass;
broad audit has zero mechanical failures across 249 generated lessons.
