# Acceptance Tests

This file defines the checks Codex implements and runs after building the
greenfield Kotoba app.

The purpose is to make failure concrete. If the app or curriculum violates these
expectations, Codex fixes the problem and reruns the checks.

## Required Commands

The project exposes these commands:

```text
npm run build
npm run test
npm run test:e2e
npm run validate:curriculum
```

## Curriculum Validation Tests

`npm run validate:curriculum` fails when any of these are true:

- A unit file is invalid JSON.
- Unit ids are duplicated or out of order.
- A standard unit lacks a grammar focus.
- A standard unit has fewer or more than 10 new words.
- A new word duplicates a word introduced in any earlier unit.
- A card has missing required fields.
- A card's `line`, `tts`, and `explain` arrays have different lengths.
- A card has no English meaning.
- A card includes a Japanese full stop or a terminal English period.
- A unit uses vocabulary that has not been introduced yet.
- A unit fails to bring back review-due vocabulary from the spaced repetition bins.
- A unit introduces grammar that is not its own focus and was not introduced by an earlier unit.

The validator prints specific unit/card ids so Codex can fix the data
without guessing.

## Word-Bin Tests

The curriculum validator includes direct tests for the bin formula.

For unit `N`, review-due vocabulary source units are:

```text
N - 2^k, for k = 0, 1, 2, ...
```

Stop when the result is less than 1.

Examples:

- Unit 1: `1`
- Unit 2: `2`
- Unit 3: `3`, `1`
- Unit 4: `4`, `2`
- Unit 5: `5`, `3`, `1`
- Unit 9: `9`, `7`, `5`, `1`
- Unit 17: `17`, `15`, `13`, `9`, `1`
- Unit 33: `33`, `31`, `29`, `25`, `17`, `1`

Every helper function that computes review-due bins has unit tests for these
examples. All already introduced vocabulary is available as helper vocabulary,
but review-due words must return.

## Unit Authoring Tests

For each standard unit, tests or validators confirm:

- exactly one grammar focus is declared
- exactly 10 new words are declared
- new words have surface form, reading, meaning, and function/category
- the new word set follows the functional-spread rules in `word_selection_rules.md`
- the grammar focus appears after the unit has already introduced new words with older grammar
- cards include repeated modular substitutions, not only one-off sentences

Judgment-heavy checks are explicit warnings. Structural checks are hard
failures.

## App Unit Tests

Automated component or logic tests cover:

- loading a language/unit index
- loading a unit by id
- selecting first card by default
- next card navigation
- previous card navigation
- random card navigation
- reveal/hide English
- show/hide Japanese text
- aligned tooltip/explanation display
- missing audio fallback
- local progress read/write

## End-to-End Tests

`npm run test:e2e` launches the app and verifies:

1. The app opens to the practice experience or a resume/unit selection screen.
2. A learner can select or resume a Japanese unit.
3. The first card displays Japanese text.
4. English can be revealed and hidden.
5. Word-part explanations are accessible.
6. Next and previous navigation changes cards.
7. Random navigation changes or intentionally reselects a card without crashing.
8. Missing audio does not break replay.
9. Progress persists after reload.

The e2e test fails on blank screens, uncaught runtime errors, overlapping
critical controls, or cards with missing required text.

## Visual/UX Acceptance

The implementation is checked at desktop and mobile widths.

Codex verifies:

- Japanese text is readable and central.
- Controls do not overlap content.
- Long English meanings do not break layout.
- Tooltips or explanation panels remain within the viewport.
- The app remains text-first with no image panel or image controls.
- The primary screen is the practice tool, not a marketing page.

Automated screenshot testing is part of the e2e suite. Manual viewport checks
are documented in the final response when screenshot testing is unavailable.

## Build Acceptance

`npm run build` must pass without TypeScript, lint, or bundling errors.

The production build displays checked-in curriculum data without network access.

## Regression Policy

When Codex changes curriculum, run:

```text
npm run validate:curriculum
```

When Codex changes app behavior, run:

```text
npm run build
npm run test
```

When Codex changes navigation, layout, persistence, or card rendering, also run:

```text
npm run test:e2e
```

If a check cannot be run, Codex says why and identifies the remaining risk.
