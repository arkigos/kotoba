# Unique lesson sentences and scheduled saved-card review

User decision: no repeated sentences within a lesson, no one-word cards, separate
review cards copied from prior practice rather than forcing review words into new
topic sentences. Recent learning also needs review; urgency depends on exposure
and elapsed time rather than oldest-first. A hard cap with shorter early lessons.

Implementation policy: up to 24 lesson cards, 16 due cards, 8 recent cards, 48 total.
No padding. Explicit card counts are upper bounds. Preserve every explicit target
or fail with a useful unsupported-context message. Existing frozen snapshots and
their history are retained; generation/remake uses the new validation contract.
Previously consumed unique contextual cards form the review bank. Practice, not
preview, updates encounters and schedule. Reusing a sentence across lessons for
review is intended; reusing it twice within one lesson is forbidden.

1. Replace repeated multicover planning with bounded unique sentence selection.
2. Add shared hard validation to topic/custom/grammar/quick-review creation.
3. Build separate due/recent saved-card review sections with provenance and caps.
4. Rank words by exposure-adjusted due urgency; preserve aliases and actual credit.
5. Update learner copy and direct tests, exercise production player and persistence.
6. Rerun the multiweek simulation, personally read results, document exact limits
   and update architecture/contracts. Curated content can feed the same assembly;
   do not wholesale replace the curriculum without evidence it meets the new bar.

Completed September 21: engine 2.0.0 implements all six steps. 472 tests pass,
full/learner builds and practice-flow checks pass. Ten fresh lessons across 28
simulated days produced 300 personally reviewed cards (213 core, 87 review).
Browser review provenance/completion/reload verified in isolated profile.
Evidence: docs/reviews/2026-09-20-ten-lessons/UNIQUE-CARD-SRS.md.
Limits: unsupported context selections now fail clearly; curated curriculum
replacement remains future content work; frozen curriculum audit has 310 warnings.
