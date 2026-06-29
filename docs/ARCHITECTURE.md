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
- image and audio references

Curriculum files live in the repository and are validated by script.

### Practice Player

Owns the main drill loop:

- current unit
- current card
- next, previous, and random navigation
- reveal/toggle English
- show/hide Japanese text
- word-part explanation display
- image display
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

### Media Layer

Owns media lookup:

- image references
- image prompts
- audio references
- placeholder rendering for missing media

### Validation and Authoring

Owns curriculum quality:

- known-vocabulary validation
- review-bin return validation
- duplicate new-word detection
- grammar focus checks
- word function-distribution checks
- `line` / `tts` / `explain` alignment
- card field validation
- media reference checks

Codex authors the curriculum and uses validators to verify it.

## Curriculum Runtime Model

The app consumes finished unit data. Unit files already contain the card
sequence, word list, grammar focus, explanations, and media references.

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
      grammar_by_unit.md
      word_selection_rules.md
      unit_index.json
      units/
        unit_001.json
        unit_002.json
    media/
      images/
      audio/
```

## Unit Data

A standard unit defines:

- unit id
- title
- grammar focus
- 10 new words
- cards
- validation notes

Each card defines:

- Japanese line parts
- reading/pronunciation parts
- word-part explanations
- English meaning
- image prompt or image reference
- audio reference when available
- usage/fact note

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
