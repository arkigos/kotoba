# Focus Home and merge lesson creation

User request: remove redundant interface/copy, make Today a focused Home, merge
Topics and Lesson builder, remove the template catalog and default frozen lesson
promotions, and make the first topic genuinely greetings/pleasantries.

- Home: one next step, compact streak/A1 progress, a few useful visual shortcuts.
- Learn: one topic/custom creation hub, compact topic tiles, concise lesson setup.
- Remove template and frozen course catalogs from primary navigation/Home/search.
  Preserve existing lesson snapshots, IDs, progress, and direct saved replay.
- Keep A1 milestones/standards accessible in Progress, outside the lesson-choice flow.
- Curate greetings by intent; keep professions elsewhere in A1 rather than
  assigning a false higher level from the English word's perceived difficulty.
- Reuse the shared density/coverage engine for custom targets and reviewed
  sentence examples; full dictionary entries retain exact standalone practice.
- Verify fresh/returning Home, merged routes, manual choices, save/resume,
  keyboard/accessibility, desktop/phone layout, and substantially reduced copy.

Ownership: root owns hub/navigation/topic dialog/integration; Home agent owns
TodayView; content agent owns greeting metadata; custom agent owns custom builder.

Status: completed September 13, 2026.

Implemented Home, unified Learn, compact topic setup, Dictionary/My words,
My lessons, and Progress using Activities as the visual reference. The opening
scenario is now Greetings & pleasantries; the finite 450-word core and all ten
milestone identities remain intact. No paid audio was requested.

Verification:
- Full root suite: 401 tests passed, including the complete topic pool/storage
  audit. A subsequent topic-search reopen fix passed all 28 relevant shell,
  continuity, and topic tests, including its new regression test.
- Root build and final Next build passed. Existing Vite large-chunk and Unit 103
  mixed-import advisories remain; no new build errors.
- Explicit practice-flow e2e and curriculum validation passed.
- Desktop and 390×844 visual review covered Home, Learn, topic setup, custom
  empty/selected states, Dictionary filters/selection, My lessons, and Progress.
  Checked dark-theme contrast and repeated topic search. Fixed a mobile search
  width, clipped count placeholder, and modal actions falling below the viewport.
- Exact manual IDs, per-target coverage, stale preview cancellation, automatic
  save, and resume from Home/Learn/My lessons remain verified. Frozen snapshots
  and old links remain replayable without exposing the old template catalog.

Decision: [Focus Home and unify Learn](../../decisions/2026-09-13-focused-home-and-learn.md).
