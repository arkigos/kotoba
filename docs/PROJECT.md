# Project

Kotoba teaches Japanese through a fixed, curated course in `apps/learner-next/`.
Run `npm run dev` for the active learner. `npm run build` builds it. The original
unit player remains available with `npm run reference:dev` for compatibility checks.

The [independent A1 tracks decision](decisions/2026-10-01-independent-a1-tracks.md) and
[A2 extension](decisions/2026-10-01-independent-a2-tracks.md), with the
[B1 extension](decisions/2026-10-01-independent-b1-tracks.md), are the current
product contract. Earlier procedural/custom and overlapping 450-word-core
plans are historical. They must not reintroduce generation into the main flow.

## Learning path

- Shared foundations introduce stable sentence patterns and essential helpers.
- After the shared starters, learners freely choose an A1 track. Each contains
  fixed, ordered lessons, its own additional grammar and a finite completion point.
- Completing A1 opens five independent A2 tracks without a second starter suite.
  Completing A2 opens eight independent B1 tracks; B1 vocabulary coverage is still in progress.
- A word has one owning topic or foundation. Topic completion requires every
  lesson, including grammar consolidation. All topics complete means every word
  in the level has been covered; it is not a claim of tested language mastery.
- A1 sentences use current targets, earlier words in the same track, and shared
  foundations. Completed lower levels become available as helpers in later levels.
- Review replays only consumed cards from the selected topic. There is no global
  generated review mix. Previewing, bookmarking and skipping ahead earn no credit.
- Explicit declarations of prior knowledge advance the course without inventing
  practice, XP, streaks or review encounters.

The bounded dictionary contains 25,000 disjoint study entries across A1–C2.
The much larger JMdict reference remains available for lookup. Word identity,
readings, source attribution and audio belong to `packages/dictionary/` and
`data/jp/dictionary/`. Reviewed aliases reconcile old learning IDs without
rewriting saved cards or substituting lemma audio for an inflected form.

A1 currently has five foundations and 14 chapters, covering all 750 entries through
146 instructional lessons, 263 fixed recall checkpoints and 1,511 distinct topic cards. A2 covers 1,250 entries in 23 topics,
209 lessons and 2,451 cards. B1 is being authored; B2–C2 still need content. Only actual reviewed sentences
and progression are published. See the
[editorial packet](reviews/2026-09-26-curated-course/README.md) and
[active plan](plans/active/2026-09-26-curated-topic-course.md).

## Runtime and continuity

The browser loads a lightweight catalog, then the exact cards for the selected
topic. There is no sentence synthesis, word substitution or candidate search.
Completion and consumed-card history survive removal or clearing of the recent
lesson shelf. Started lessons save their content and cursor for exact replay.
Historical generated snapshots and old frozen-unit links remain readable.

Home provides one next action. Learn holds the course; Progress holds goals and
can-do reflection; Dictionary provides lookup and links to owning topics.
Activities remain optional practice. Old procedural code is retained only for
historical compatibility and authoring reference, not as a new-lesson fallback.
