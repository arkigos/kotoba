# Goals, activities, kanji, and watercolor

User-directed expansion of the active Next app, preserving the established type and layout while adding useful practice activities and a softer visual palette.

- [x] Explain/expand the builder's reviewed vocabulary and expose clear known/new/all word filters.
- [x] Add editable goals and real progress on Goals and Today; emphasize current/best streaks without inventing activity.
- [x] Limit explicit lesson saving to built lessons; retain Course continuation through normal recent/progress behavior.
- [x] Expand First Kanji Symbols to 50 core characters while preserving existing learning/card identities.
- [x] Research and implement two substantial playable vocabulary activities with feedback, retries, sensible distractors, and persisted activity.
- [x] Add a 50-character illustrated kanji activity with cited origins or explicitly identified mnemonics.
- [x] Generate project-owned watercolor imagery and subtle paper/ink/button textures; preserve fonts and core layout.
- [x] Integrate, check desktop/phone behavior and relevant tests/build, document durable choices.

Independent ownership: root goals/state/routing/Today/save policy/visual assets/theme; games agent game modules; kanji agent researched content/course expansion/activity; builder agent reviewed word pool and controls. Existing checkout changes are preserved.


## Delivered

- Builder: 241 supported reviewed senses; All compatible/My words/New words; broader Actions template; per-template compatible-word counts and cross-template search suggestions.
- Goals: daily, weekly, and lifetime targets; current/best streaks; calendar-aware real practice; Today integration; local persistence/export.
- Activities: Word pairs and Listening with word-source controls, first-try scoring, hints/retries, keyboard controls, optional stopwatch, completed-round history, and accurate per-word practice.
- Kanji: 50 researched entries, direct origin sources, separate memory aids, five original watercolor atlases, study/review controls and quizzes. Course 103 grows from 20 to 50 with stable original IDs and one-time progress migration.
- Continuity: only generated/built lessons expose Save; Course recent/resume remains. Kanji Course links to the atlas. Recognition decks are labeled cards rather than sentences.
- Appearance: original fonts retained; cream paper, sage/indigo/clay palette, watercolor buttons and ink accents, dark theme, mobile More navigation.

## Verification

All 276 tests pass, including 144 Next tests and the practice-flow check. Both app builds pass. Canonical dictionary, curriculum and asset checks pass. Builder audits cover every supported sense (2,892 cards) and 108 seeded lessons (2,676 cards). Level alignment passes. The non-strict pacing audit retains existing curriculum backlog warnings; no unrelated Course rebuild was attempted.

Browser checks used a separate localhost profile, preserving the user's 127.0.0.1 tabs and data. Checked desktop/390px layouts, goal creation and live Today progress, atlas images and study progression, builder pool controls, games catalog/board, mobile navigation, and dark-theme readability. Fixed activity-start and selected-kanji scroll position from that pass; reset viewport and closed the temporary tab.

Durable decisions: `2026-09-13-goals-and-activity-progress.md`, `2026-09-13-builder-vocabulary.md`, `2026-09-13-games-and-activities.md`, `2026-09-13-kanji-atlas.md`, and `2026-09-13-watercolor-artwork.md` (all in `docs/decisions/`). Imagegen originals were copied to `public/art/`; full generation prompts are retained.
