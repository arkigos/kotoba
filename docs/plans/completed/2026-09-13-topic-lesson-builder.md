# Topic lesson construction and continuity

The topic is a word pool, not a lesson. Replace the short topic preview deck with an editable custom lesson built from a bounded subset.

- Default to 12 selected words (or the remaining pool), adjustable before creation.
- Default to eight cards per target, with adjustable card count and at least six meaningful appearances per target. Spread appearances across the lesson and report real coverage, including contextual occurrences.
- Use reviewed examples and exact dictionary forms; preserve grammar eligibility and existing audio identity.
- Save the resulting frozen lesson for launch/resume from Today, Topics, and My lessons. Opening a builder or saving a lesson earns no learning credit.
- Keep topic/level progress derived from actual word practice, and record an honest separate total of practiced cards per word.
- Preserve existing saved lessons and routes. Verify construction, coverage, persistence, exposure semantics, and responsive UI.

Completed. Topic selection now opens a configurable 12-word/96-card lesson draft,
with exact materialization, automatic saving, shared resume shelves, balanced
actual appearances, and separate per-word card exposure history. Course is Topics;
Lessons is My lessons. Supporting vocabulary is distinct from selected targets.

The full-scope audit additionally found that autosaving full decks could exceed
localStorage capacity before the core was finished. Lossless card/token/item
pooling preserves 150 saved 96-card lessons in 2.54 MiB; the full restored state
matches the original. Invalid storage references preserve the original snapshot
and unaffected progress under an explicit recovery lock.

Validation: all full root and Next suites passed, plus 13 focused storage tests;
root and Next production builds and the practice-flow e2e passed. Final Next
TypeScript check passed. Audits cover all core/extra batches, late selections,
150 saved lessons, stale preview races, launch/save/resume, and exposure semantics.
Desktop and 390px mobile preview controls were visually checked with no browser
errors. Existing build-size warnings and one existing React act warning remain.

Decisions: `docs/decisions/2026-09-13-topic-lesson-builder.md` and
`docs/decisions/2026-09-13-saved-lesson-storage.md`.
