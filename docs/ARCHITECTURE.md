# Architecture

This document defines the greenfield Kotoba app architecture.

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
