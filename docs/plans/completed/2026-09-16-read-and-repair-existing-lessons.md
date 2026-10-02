# Read and repair existing lessons

Read the actual saved Family & people lesson (83 cards), the preceding custom lesson (83 cards), and their frozen source sequences as Japanese/English teaching material. Passing coverage checks is not evidence of teaching quality.

Observed: long isolated-word alternation, immediate exact repeats, 60+ card return gaps, dictionary alternatives inside sentences, unsuitable generic predicates, spouse-reference ambiguity, and no useful contexts for determiners/counts. The running development app also retains loaded unit objects across hot updates, so new lessons can use obsolete source cards.

Work:
- Use the existing snapshots as evidence. Per the owner's clarification, fix the shared runtime engine and remake the lessons; do not patch frozen or saved lesson cards. Replace frozen-card mining with constrained candidate generation from explicit reviewed word senses and constructions; maintain selected/practiced vocabulary admission.
- Schedule revisits throughout a lesson, while retaining short substitution runs and exact coverage; prevent continuity smoothing from recreating long gaps and isolated-word blocks.
- Invalidate development source caches when curriculum modules change.
- Rebuild the same selections, read the complete results, and record both improvements and limits. Run focused regressions, builds, and relevant curriculum checks.

Status: complete. Both personalized adapters now use shared licensed construction
generation; explicit Remake replaces the saved session through the engine while
preserving targets/history. The sole existing saved family lesson was remade,
read in full, and verified saved after reload at 52 cards. Both same-target
fixtures were read. 419 tests and both builds passed; 249 generated audit lessons
contained zero unfamiliar extras. See `docs/reviews/engine-remake/REPORT.md` for
the actual findings, manual-review scope, and remaining construction limits.
