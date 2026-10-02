# Architecture

Current direction: [independent A1 tracks](decisions/2026-10-01-independent-a1-tracks.md) and
[independent A2 tracks](decisions/2026-10-01-independent-a2-tracks.md). Shared starters
lead to A1 tracks; completed A1 opens all five A2 tracks. Frozen authored lessons
and review stay local to each track. Completing A2 opens eight
[independent B1 tracks](decisions/2026-10-01-independent-b1-tracks.md).
Older procedural/custom rules below are historical.

## Focused Home and Learn

`apps/learner-next/` is the active learner surface. `App.tsx` presents Home, Learn,
Dictionary, My lessons, Activities, and Progress; Settings is separate. Historical
internal keys remain: Home uses `today`, Learn Topics uses `course`, Learn Custom
uses `build`, and Progress uses `goals`. `#home` and `#learn` are accepted aliases.
Removing a navigation label does not invalidate stored sessions or unit links.

Settings includes a confirmed **Reset all data** action for a true new-learner
start. `state.ts::resetState` replaces the complete profile with fresh defaults
and removes both older migration snapshots. This clears vocabulary and grammar
practice, review cards, saved/cleared lessons, activities, goals, and preferences;
removing lessons alone is not a fresh profile. The app reloads on Home to discard
in-memory session state. Unrelated browser storage and dictionary content remain.
`reset-profile.test.tsx` covers complete replacement, legacy migration, storage
failure, and cancellation/confirmation.

`TodayView.tsx` implements Home's single next action, actual coverage/week/streak,
and compact shortcuts. `TopicCourseView.tsx` hosts Learn's Topics/Custom switch.
`CustomLessonBuilder.tsx` owns explicit selection, dictionary search, Priority
suggestions, card count, and a collapsed name/preview/save panel. `GoalsView.tsx`
hosts `A1Milestones.tsx`; detailed standards and self-checks no longer crowd Learn.
`SessionShelf.tsx` supplies My lessons and compact continuity surfaces, with
resume/bookmark actions and a menu for browse/remake/rename/remove. See the
[focused learner decision](decisions/2026-09-13-focused-home-and-learn.md).

## Topic-driven A1 and full Dictionary

The Next app now opens A1 as overlapping, independently active topics. Authored
`data/jp/dictionary/a1_scope.json` and `packages/dictionary/a1.ts` define 450 core
concepts, aliases for progress, 12 topics, and 10 practical self-checks.
`topic-course.ts` projects progress from actual word history and composes bounded
personal sessions. `TopicCourseView.tsx` owns topic selection and launches
`TopicLessonDialog.tsx`; complete preview and word selection live in disclosures.
Home and Learn show compact A1 signals, with the full goal and self-checks on
Progress. Original frozen units remain available through existing reference links.

Topics supply overlapping pools with 1–30 exact targets (default 12). Automatic
selection chooses fresh targets. `topic-sequence.ts` chooses unique contextual
cards with complete target coverage, up to 24 core cards. Requested lengths are
ceilings; repeated sentences and one-word fallback cards are forbidden.
`lesson-card-quality.ts` enforces this across the entire assembled lesson.
`lesson-vocabulary.ts` admits only selected targets, actual practiced vocabulary,
and explicitly authored function forms. Topic cores use scenario-relevant familiar
scaffolding; review urgency never changes their vocabulary selection.

`custom-lesson.ts` shares the planner for exact user selections. Both adapters use
reviewed senses/frames from `packages/learning-engine/personalized.ts`; unsupported
reference entries fail with a contextual-support error. `sentence-review.ts` then
appends exact previously consumed cards: at most 16 due and 8 recent, 48 total.
It owns the persistent review bank, original provenance, and cross-section dedup.
`review.ts` ranks relative interval urgency using actual encounters and spaced
occasions. Consumption updates dates; preview and navigation never grant credit.
The separation supports future curated cores without changing review assembly.
See `docs/decisions/2026-09-21-unique-sentences-and-card-review.md`.

Topic and planned custom launches save exact snapshots automatically. Home can
resume them, Learn offers a compact saved-lesson shortcut, and My lessons manages
the collection. Existing `#course`, `#build`, `#lessons`, and `#lesson/...` routes
remain compatible. Old snapshots keep their original size until the explicit
Remake action calls the current engine with the same targets. Remake preserves
the shelf identity, title, saved status, and practice history, resets the lesson
cursor, and uses a fresh recommended size. It awards no credit. See the
[engine/remake decision](decisions/2026-09-16-personalized-engine-remake.md).

`topic` and `vocabulary` session sources own `savedCards` and are resolved and
validated by the shared player adapter. Both retain exact resume, saved lesson
support, and word-practice credit without inventing frozen-unit progress.
`savedMaterializedCards` preserves individual saved cards independently of Recent.

Dictionary replaces the Library navigation label; old `#library` links resolve
to `#dictionary`. Full browsing lazily loads the complete index including common,
word type, and specialist metadata. Any entry can enter Priority without needing
a prior encounter. New lesson in both full Dictionary and My words passes the
complete selected IDs to Learn Custom, including unsupported reference words.
The current Custom limit is 30; an oversized incoming selection stays visible
with an error. The lower-level `vocabularySession` quick-review/compatibility
adapter still accepts up to 120 explicit targets, independently of that UI limit.
Priority itself has no size limit and grants no practice credit or permission to
generate unreviewed sentences. See the
[A1 decision](decisions/2026-09-13-topic-driven-a1.md) for standards and completion.

## Procedural engine transition

Word identity now comes from `packages/dictionary/`, backed by a pinned complete
JMdict edition and authored course bindings. Read
`docs/decisions/2026-09-12-canonical-dictionary.md` before editing word source or
audio identity. `index.ts` resolves teaching words/canonical entries and lazy full
lookup; `audio.ts` resolves exact pronunciation assets. Both players and the
procedural overlay use these adapters. `DictionaryView.tsx` owns full search and
entry detail; My words and practice reuse its entry panel.

The September 12 direction unifies future Course, Library, and custom lessons as
recipes over one grammar and sequence engine. Its initial pure TypeScript kernel
is `packages/learning-engine/`. Read
`docs/decisions/2026-09-12-procedural-lessons.md` before expanding generation or
migrating a player. The former curated recipe catalog and `LessonBuilder.tsx`
remain available to compatibility tests, not the main product navigation.
`#build` now opens Learn Custom and requires no `SessionSnapshot`. Previously
generated snapshots still use the reviewed engine's types and exact replay path.
The original app and existing reference entries still consume frozen units.

`LessonExplorer.tsx` owns the full bilingual sentence page at `#lesson/<unitId>`
and the active generated/review list at `#lesson/session`. App routing preserves
the snapshot and exact selected index. `saved-session.ts` materializes replay of
separately saved generated sentences. See
`docs/decisions/2026-09-12-lesson-exploration.md` for navigation and unique-view
progress rules. Library course reviews can resolve a saved authored word's
introducing unit even before it has an encounter history.

`session-history.ts` owns saved/recent lessons, stable lesson identity across
replays, and actual daily practice counts. `SessionShelf.tsx` provides the Lessons
destination, while `TodayView.tsx` presents the focused Home described above.
`saved-session.ts` also creates independent materialized saved-sentence decks;
`quick-review.ts` selects feasible procedural reviews with explicit exclusions.
Settings is separate from Home; Dictionary has no lesson-list Grammar facade.
Read `docs/decisions/2026-09-13-practice-continuity.md` for persistence rules and
`docs/decisions/2026-09-13-sentence-semantic-quality.md` for semantic constraints.

In `apps/learner-next/src/`, `generated.ts` owns input adapters, materialized
session creation/validation/resolution, and saved generated sentences;
`LessonBuilder.tsx` retains the legacy recipe selection/preview implementation.
`PracticeSession.tsx`
uses the shared resolver and records generated word encounters by recipe without
inventing unit progress. `audio.ts` owns cancellable cache lookup and device
speech. All Japanese card playback sequences exact realized word recordings,
with device speech for missing words and synchronized token highlights. Old
sentence recordings are bypassed because stable card IDs can outlive their text.
Generated and frozen practice use the same sequence. Reloads use the stored cards
without running the generator again.

`review.ts` owns automatic word review timing, spaced-occasion tracking, priority,
and seeded candidate ranking. `LibraryWords.tsx` presents the pool and its simple
priority control. `generated.ts` admits at most two suggested additions only
after checking the complete sequence. `packages/learning-engine/levels.ts` owns
authored word/grammar ceilings; it contains no learner history. See
`docs/decisions/2026-09-12-word-review-and-levels.md` for timing, compatibility,
and the current A1 grammar boundary.

The remaining sections describe the frozen curriculum/reference architecture
that the current learner continues to reuse.

The current CRA/Express prototype is archived for reference. The new app is
built from the product model in `docs/APP_VISION.md`.

## Architecture Goal

Kotoba is a small, local-first, curriculum-driven practice app.

The app serves frozen authored units, moves quickly through sentence cards,
stores progress locally, and validates curriculum data before it reaches the
learner.

## Stack

Kotoba uses:

- Vite
- React
- TypeScript
- file-backed JSON curriculum data
- browser local storage for progress
- static media assets
- npm scripts for validation and tests

## Core Modules

### Curriculum Data

Owns frozen authored content:

- language index
- unit index
- unit metadata
- unit word lists
- grammar focus references
- cards
- audio references

Curriculum files live in the repository and are validated by script.

### Practice Player

Owns the main drill loop:

- current unit
- current card
- next, previous, and random navigation
- reveal/toggle English
- show/hide Japanese text
- word-part explanation display
- audio replay
- persistent in-lesson controls for default card face, Japanese display, audio
  autoplay and language, auto-advance order and timing, and appearance

The practice player is the primary screen.

### Curriculum Map

Owns unit navigation:

- unit list
- grammar titles
- current unit marker
- completed unit markers

### Local Progress

Owns learner state:

- selected language
- current unit
- current card
- completed units
- display preferences

Progress persists in browser storage.

### Audio Layer

Owns audio lookup:

- audio references
- browser speech fallback for missing audio files

### Validation and Authoring

Owns curriculum quality:

- known-vocabulary validation
- review-bin return validation
- duplicate new-word detection
- grammar focus checks
- word function-distribution checks
- `line` / `tts` / `explain` alignment
- card field validation
- audio manifest checks

Codex authors the curriculum and uses validators to verify it.

## Curriculum Source Model

Kotoba now keeps a curriculum source layer under
`data/jp/curriculum/source/`. This layer is the editable model that future
generators should use before writing frozen unit JSON:

- `unit_specs.json`: unit metadata, grammar focus, the planned core new words,
  and any lexical grammar words that must participate in SRS
  for each authored unit
- `pacing.json`: card-band rules and first-exposure cutoffs

Frozen files under `data/jp/curriculum/units/` are still what the app consumes,
but they should increasingly be treated as generated artifacts. If a unit's
vocabulary, grammar focus, or SRS rules change, rebuild affected units from the
source model instead of hand-editing downstream JSON card by card.

The browser app should not import the authoring source model directly. Runtime
lookup data that the app needs, such as vocabulary metadata for the dictionary
panel, is generated into checked-in runtime JSON.

Authoring scripts should compute:

- current vocabulary from the unit spec
- review-due vocabulary from the SRS formula
- helper vocabulary from already introduced unit specs
- available grammar from the grammar sequence through the current unit
- the pacing band for the requested card position

Useful scripts:

- `npm run audit:curriculum-source`: verifies the source model matches the
  current frozen units and index
- `npm run audit:curriculum-pacing`: reports existing first-exposure pacing debt
- `npm run curriculum:card -- --unit 2 --card 50 --count 5`: generates card
  candidates for a unit position from the source model
- `npm run curriculum:unit-draft -- --unit 2 --cards 80`: generates a full draft
  unit from the source model without overwriting production JSON

Semantic checks are guardrails for obvious bad pairings and inaccurate English.
They should not prevent goofy-but-valid sentences when the grammar and word
practice are useful.

Foundation tokenization favors visible productive particles. `ですか` should be
authored as `です` + `か`, while early negative copula chunks such as
`ではありません` stay together with pronunciation readings like `でわありません`.

## Curriculum Runtime Model

The app consumes finished unit data. Unit files already contain the card
sequence, word list, grammar focus, explanations, and optional audio references.

For unit `N`, available vocabulary includes all words introduced in units `1...N`.
The review-due vocabulary that must return is determined from:

```text
N
N-2
N-4
N-8
N-16
N-32
...
```

Only positive unit numbers that exist are included.

Review-due words are a minimum return schedule. They do not prevent other known
words from appearing as helper vocabulary.

Grammar is cumulative. Each unit has one grammar focus. Later units use earlier
grammar freely.

## Data Layout

Use this structure:

```text
data/
  languages.json
  jp/
    curriculum/
      source/
        unit_specs.json
        pacing.json
      grammar_by_unit.md
      word_selection_rules.md
      unit_index.json
      runtime_lexicon.json
      units/
        unit_001.json
        unit_002.json
    media/
      audio/
```

## Unit Data

A standard unit defines:

- unit id
- title
- grammar focus
- about 10 core new words, plus any learned lexical grammar words that need SRS
- cards
- validation notes

Each card defines:

- Japanese line parts
- reading/pronunciation parts
- word-part explanations
- English meaning
- audio reference when available
- grammar tags

## Build Outputs

Dictionary study pools are a separate, versioned content artifact. The policy in
`data/jp/dictionary/study-pool-policy.json` and deterministic Python builder
produce 25,000 disjoint A1–C2 entries and a lazy-loaded public index. Pool levels
do not overwrite historical course scope, reference placement, or generation
eligibility. See `docs/decisions/2026-09-21-bounded-level-pools.md`.

The app exposes these checks:

```text
npm run build
npm run test
npm run test:e2e
npm run validate:curriculum
```

The acceptance contract lives in `docs/ACCEPTANCE_TESTS.md`.

## Legacy Prototype

Archive the current prototype before rebuilding:

- `src/`
- `server/`
- existing lesson JSON
- existing media conventions

The archive is reference material. The new app follows this architecture.
