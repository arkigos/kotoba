# Shared procedural lesson engine

Status: initial kernel and requested Next builder/player integration complete.

## Player integration — September 12

The owner requested the engine implemented in the app and demonstrated. Add a
builder in the Next app with curated patterns, selectable target pools, preview,
reshuffle, and a launch into the existing flashcard player. Use the same builder
from Library for selected words. Existing course units remain available until
their grammar/content migration is ready.

- [x] Add snapshot-backed sessions and exact card resolution; preserve legacy v3
  profiles with additive optional storage fields.
- [x] Record generated encounters without invented unit attribution/completion;
  retain generated saved-sentence content independently of active sessions.
- [x] Add curated/custom-pool builder, Course/Today entry points, and a Library
  entry using its selected vocabulary. Show incompatible selections explicitly.
- [x] Play one realized Japanese word with cache/speech fallback, cancellation,
  and no sentence-audio claims. Keep reading/recall/rapid available.
- [x] Verify resume, saved sentences, ratings, next/previous/random, complete,
  regenerated previews, and audio races in tests and desktop/mobile browsers.
- [x] Document implemented behavior and provide the working local app link.

### Player verification results

- `npm run test`: 149 tests passed, including 15 new persistence, integration,
  and audio checks. Root jsdom setup now mocks scrolling/media pause, matching
  the Next setup; the final run has no unimplemented-browser warnings.
- `npm run next:test`: 41 passed. Both `npm run build` and
  `npm run next:build` passed. `npm run test:e2e`: passed.
- Tests cover exact materialized reload/resume, saved content surviving session
  replacement/completion, recipe attribution without course progress changes,
  filtered Library review input, unsupported targets, corrupt snapshots, audio
  cache compatibility, pending-hash cancellation, stale media failures, and
  individual-word speech fallback.
- Browser QA at the default desktop viewport and 390 × 844 checked preview,
  all four patterns, start, next/previous, random navigation, translation reveal,
  script display, snapshot reload, word ratings, saved sentences, and Library
  review. Adjusted generated card height so the word-audio hint fits above the
  phone controls. Restored the viewport after verification.
- Confirmed actual word playback reached the browser's playing event; inspected
  generated text and matching English. No browser console errors were observed.
  Device-speech fallback and cancellation are covered by automated tests.
- Demo runs at `http://127.0.0.1:4176/#build` on a separate local origin so existing
  preview profiles remain untouched. Standard startup remains `npm run next:dev`
  at port 4175. No dependencies, paid audio generation, or curriculum edits.

## Goal

Design the shared lesson/review architecture and implement its first tested slice,
as requested on September 12. Follow
`docs/decisions/2026-09-12-procedural-lessons.md`.

## Context

Both the original app and `apps/learner-next/` consume frozen cards. Library
reviews select existing cards. Vocabulary labels do not yet capture grammatical
classes, senses, argument frames, or dependable English inflection. The working
tree contains substantial earlier work that must be preserved.

## Steps

- [x] Inspect both players, source generator, contracts, and existing progress.
- [x] Record architecture, migration order, and audio policy.
- [x] Implement explicit lexemes, morphology, reviewed constructions, and errors.
- [x] Implement shared recipes, deterministic sequence planning, grammar gates,
  bounded generation, coverage, snapshot provenance, and word-audio plans.
- [x] Add example vocabulary/recipes, preview command, and inspect actual output.
- [x] Test morphology exceptions, invalid bindings, bounded failures, translation,
  deterministic output, one-slot changes, coverage, and existing app compatibility.
- [x] Update contract entry points and record validation/results and remaining work.

## Acceptance

- Course examples and ad hoc review requests use the same generation function.
- Unsupported words, grammar, forms, and combinations fail explicitly.
- No sentence/reading/English alignment drift from independent string generation.
- One independent slot changes between neighboring cards within a phase by default.
- Repeated appearances count once per vocabulary/sense per card.
- Generation returns the requested length and exposure floors, or a diagnostic.
- Snapshots include realized cards and versioned provenance for future persistence.
- Word audio uses the realized word only and the existing shared-cache convention.
- Existing curriculum and saved state are not rewritten by this slice.

## Initial kernel verification

Run focused engine tests, `npm run test`, `npm run build`, `npm run next:test`,
and `npm run next:build`. Run the preview recipes and inspect transitions and
coverage. No production player behavior changes are planned in this slice.

Results:

- `npm run test`: 134 tests passed, including 41 new engine tests and existing
  practice-flow coverage. Root test discovery still emits existing jsdom
  `window.scrollTo` warnings from the Next app; they are not test failures.
- `npm run next:test`: 26 passed.
- `npm run build` and `npm run next:build`: passed.
- `npm run audit:curriculum-pacing`: exited successfully and reported 300 warnings
  in existing frozen units (including late Unit 1 grammar and recognition-unit
  exposure cutoffs). This audit does not consume procedural output.
- After output inspection, refined phase boundaries to preserve vocabulary when
  introducing a grammar change, and made negative-existence English explicit.
  Reran the 41 focused tests and root build successfully.
- Output review also separated action/movement actors from descriptive noun
  subjects, preventing ordinary places from randomly becoming people who travel.
  The final full test run (134 passed) and root build passed after that change.
- Exported and inspected all five example runs: classroom 36 cards, existence
  28, adjectives 21, movement 21, ad hoc review 16. All target floors passed.
- Engine tests exercise four recipes over twelve seeds each, deterministic
  regeneration, invalid inputs, closed pools, lexical exceptions, word-audio
  plans, and sentence compatibility with both app card types.
- No browser/UI QA was needed: this slice changes neither production player.
- No new dependencies, paid services, curriculum rebuild, or progress migration.

## Follow-ups

Broader lexical/grammar review, deliberate curriculum migration, learner grammar
tracking, and a freeform recipe editor remain future milestones. The delivered
builder edits target pools over reviewed recipes; it does not accept arbitrary
unreviewed vocabulary or claim complete Japanese grammar coverage.
