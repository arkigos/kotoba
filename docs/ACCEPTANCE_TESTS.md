# Acceptance Tests

Current primary acceptance is the [curated course contract](decisions/2026-09-26-curated-topic-course.md) and [Quality](QUALITY.md). The frozen-unit expectations below remain compatibility checks. New main-path lessons must pass `npm run validate:curated` and `npm run next:test`.

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
- A standard unit has fewer than 10 SRS words, or exceeds the word-count allowance documented in `docs/DATA_CONTRACTS.md`.
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
- about 10 core new words are declared, with documented exceptions for lexical grammar words or generated Marugoto Starter supplemental units
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
- random-order card navigation
- reveal/hide English
- show/hide Japanese text
- complete authored unit order is preserved rather than sampled into a quiz
- an interrupted unit resumes at the exact saved card
- Reading, Listening, Recall, and Rapid are presentation modes over one deck
- Japanese display switches between surface, kana, and romaji
- lesson settings are accessible directly inside the player and persist
- audio autoplay can be disabled independently of the selected preset
- audio language supports Japanese, English, same-as-card, and opposite-card
- auto advance has independent on/off, sequential/random, and delay controls
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
10. A Course unit exposes its complete authored card count and order.
11. No typed-Japanese or generated multiple-choice gate blocks card navigation.

The e2e test fails on blank screens, uncaught runtime errors, broken core
navigation, or cards with missing required text.

## Visual/UX Acceptance

The implementation should be checked at desktop and mobile widths after layout
or interaction changes.

Codex verifies:

- Japanese text is readable and central.
- Controls do not overlap content.
- Long English meanings do not break layout.
- Tooltips or explanation panels remain within the viewport.
- The app remains text-first with no image panel or image controls.
- The primary screen is the practice tool, not a marketing page.

The current automated e2e suite is jsdom-based interaction coverage. Manual or
browser screenshot checks should be documented in the final response when visual
layout changes are made.

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
