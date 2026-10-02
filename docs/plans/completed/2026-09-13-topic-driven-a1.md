# Topic-driven A1, Dictionary, and activities

Status: completed. Owner authorized implementation on September 13.

## Outcome

Replace the Next app's A1 lesson list with independently selectable, overlapping
topics. A finite authored core vocabulary pool supplies a clear denominator;
separate practical can-do milestones anchor the path to CEFR/JF A1. Preserve
existing word IDs, progress, frozen lessons, and exact saved sessions. Rename
Library to Dictionary, browse the entire pinned reference dictionary with filters,
and allow any word into Priority and personal vocabulary practice. Add a distinct
activity and replace Instrument Serif. Reuse existing audio without paid requests.

## Work

- [x] Audit existing A1 vocabulary; author core/topic metadata and cite standards.
- [x] Implement shared topic progress, preferences, and bounded dynamic sessions.
- [x] Add topic course and A1 goal/milestone UI; keep legacy units accessible.
- [x] Full Dictionary browsing/filtering and unrestricted Priority selection.
- [x] Additional activity and typography refresh.
- [x] Persistence, overlap, completion, and practice regression tests.
- [x] Build/tests/data checks and desktop/mobile browser verification.

## Ownership

Root: course UI, state/session integration, goals, final validation.
Dictionary agent: browse/filter/priority UI and reference indexing.
A1 agent: authored core/topics, data audit, standards and tests.
Activity agent: game, typography, and focused checks.

## Constraints

The repository has extensive pre-existing changes; do not discard or reset them.
CEFR/JF does not define an official vocabulary quota. Course vocabulary completion
must be distinguished from proficiency and from self-assessed practical skills.
Unreviewed dictionary words can enter vocabulary practice, but cannot acquire
sentence-generation eligibility through imported POS. No paid audio generation.

## Delivered

- Replaced Instrument Serif with a local humanist sans font system.
- Added Kana builder with keyboard/touch controls and honest first-try scoring.
- Dictionary browses 218,765 JMdict entries plus local authored entries; filters
  combine level, core, topics, commonness, word type, and specialist categories.
  Any resolved entry can be prioritized without bookmarking or prior practice.
- 450 core concepts drawn from 578 authored A1 learning IDs; all 450 already have
  source cards and exact base recordings. Twelve overlapping topics and ten
  source-linked can-do self-assessments supply the course and goal experience.
- Dynamic topic lessons select up to six new and ten total target words, introduce
  bounded supporting vocabulary, and reuse reviewed authored examples. Universal
  word practice covers any explicit selection up to 120 words. The full sentence
  generator remains constrained to its reviewed vocabulary/grammar overlay.
- Shared core occasion ledger combines practice across alternate forms without
  double-counting same-day encounters. Original progress and saved decks survive.
- Independent review fixed empty extra-word paths and dictionary sense selection
  restricted to specific spellings/readings.

## Verification

- `npm run test`: 304 tests passed across 30 files, including practice-flow e2e.
- `npm run next:test`: 161 tests passed across 19 files.
- `npm run build` and `npm run next:build`: passed. Existing large-bundle warnings
  remain; Next also reports the pre-existing mixed static/dynamic Unit 103 import.
- `npm run validate:curriculum`: passed.
- `npm run audit:level-alignment`: passed; existing low late-A1 existence coverage
  advisory remains. The new topic model does not claim to resolve grammar coverage
  merely by counting words.
- Real browser: desktop course typography, topic preview, full dictionary index,
  and specialist filtering. At 390×844: course/preview/Dictionary fit with no
  horizontal overflow. Kana builder was played and its feedback verified; temporary
  viewport overrides were reset. No browser runtime errors observed.
- Additional focused checks cover exact corpus sense restrictions, every core
  word's source/audio, all topic pools' reachability, preferences, and saved replay.
- Final listening-mode correction additionally passed all nine topic/session
  tests and a fresh Next build. Compact index sense assertions pass; deterministic
  regeneration produced identical bytes.
- No paid audio, network provider requests, or frozen unit rewrites.
