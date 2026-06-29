# Codex Build Guide

This document is the operating manual for Codex rebuilding Kotoba from scratch.

Codex builds the app, authors seed curriculum, writes validators, writes tests,
runs the checks, and iterates until the documented contract passes.

## Required Reading Order

Codex reads:

1. `AGENTS.md`
2. `docs/PROJECT.md`
3. `docs/APP_VISION.md`
4. `docs/ARCHITECTURE.md`
5. `docs/DATA_CONTRACTS.md`
6. `docs/QUALITY.md`
7. `docs/CURRICULUM_QUALITY.md`
8. `docs/ACCEPTANCE_TESTS.md`
9. `data/jp/curriculum/grammar_by_unit.md`
10. `data/jp/curriculum/word_selection_rules.md`

## Rebuild Contract

The greenfield app has:

- frozen authored curriculum units
- a fast card-drilling player
- local progress
- file-backed data
- validation scripts
- automated app tests
- end-to-end practice-flow tests

The app consumes checked-in curriculum data. Codex authors that data during
development.

## Codex Responsibilities

Codex:

- keeps the archived prototype intact
- creates the Vite React TypeScript app
- defines the final unit/card data contracts
- authors seed Japanese curriculum units
- creates image prompts and media references
- preserves audio references
- writes curriculum validators
- writes automated tests
- runs verification commands
- fixes failures and reruns checks

## Implementation Sequence

### 1. Archive the Prototype

The CRA/Express prototype is archived under `archive/prototype-cra-express-2026-06-27/`.

The archive keeps:

- old lesson JSON
- old React components
- old server routes
- old media conventions

### 2. Create the New App

Maintain the Vite React TypeScript app.

The app supports:

- loading curriculum data
- selecting/resuming a unit
- drilling cards
- next/previous/random navigation
- reveal/toggle English
- show/hide Japanese text
- show aligned word explanations
- display image or placeholder
- replay audio when present
- save local progress

### 3. Define Curriculum Contracts

Create JSON contracts for:

- language index
- unit index
- unit files
- cards
- words
- media references

Update `docs/DATA_CONTRACTS.md` before wiring the frontend to required fields.

### 4. Build Curriculum Validators

Add validators for:

- valid JSON
- ordered unit ids
- one grammar focus per standard unit
- 10 new words per standard unit
- duplicate new words across earlier units
- known-vocabulary compliance
- required spaced-review return compliance
- card vocabulary compliance
- sterile category-card and late bare-identity overuse checks
- aligned `line`, `tts`, and `explain`
- required card fields
- image prompt or image reference
- media reference shape

Expose the validator through:

```text
npm run validate:curriculum
```

### 5. Author Seed Curriculum

Author 3-5 real Japanese units.

Each seed unit:

- follows `grammar_by_unit.md`
- has one grammar focus
- has 10 new words
- follows `word_selection_rules.md`
- contains enough cards to demonstrate long repetitive modular flow
- includes image prompts or image references

### 6. Build App Tests

Implement the tests in `docs/ACCEPTANCE_TESTS.md`.

Expose:

```text
npm run test
npm run test:e2e
```

### 7. Verify and Iterate

Run:

```text
npm run validate:curriculum
npm run test
npm run test:e2e
npm run build
```

Fix failures. Rerun checks. Continue until the contract passes.

## Curriculum Authoring Rules

Each standard unit:

- has one grammar focus from `grammar_by_unit.md`
- introduces 10 new words
- chooses words according to `word_selection_rules.md`
- may use any already introduced vocabulary as known helper vocabulary
- must bring back review-due vocabulary from the spaced repetition bins
- must keep category drills and bare `Xです` introductions bounded after the foundation units
- uses all previously introduced grammar
- introduces the unit's grammar focus late
- contains long, repetitive, modular sentence drilling

The review-due word bin for unit `N` is:

```text
N
N-2
N-4
N-8
N-16
N-32
...
```

This is a minimum return schedule, not the whole vocabulary palette. Older words
outside the current review bin may still be used when they make the card better.

## App Rules

- The primary screen is the practice experience.
- The app uses local checked-in curriculum data.
- Missing audio or images never break the card flow.
- Japanese text is large, readable, and central.
- Controls are fast and obvious.
- Progress persists locally.
- Runtime code trusts validated unit data.

## Done Means

The rebuild is done when:

- the app builds
- curriculum validation passes
- app tests pass
- end-to-end tests pass
- a real Japanese unit drills end to end
- local progress survives reload
- missing media is handled gracefully
- docs match the implemented data shape
