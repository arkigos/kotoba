# Quality

Current direction: [independent A1 tracks](decisions/2026-10-01-independent-a1-tracks.md) and
[independent A2 tracks](decisions/2026-10-01-independent-a2-tracks.md). New learning uses frozen,
authored lessons. Shared starters precede A1; completed A1 opens every A2 track.
Completing A2 opens eight [independent B1 tracks](decisions/2026-10-01-independent-b1-tracks.md).
Lessons and review stay local to each track. This supersedes the older linear A1–B1 and
procedural topic/custom completion rules below.

Use this as the lightweight verification bar for Kotoba changes.

For the greenfield rebuild, `docs/ACCEPTANCE_TESTS.md` is the stricter source
of truth. This file remains the everyday quality checklist.

## Current curated-course acceptance

Run `npm run validate:curated`, `npm run dictionary:validate-pools`,
`npm run next:test`, and `npm run build`. Shared dictionary/player changes also
require `npm run test`; the original unit surface uses `npm run reference:build`
and `npm run validate:all`.

Walk each A1 track independently from a fresh starter-only profile. Other A1
tracks cannot supply vocabulary or grammar. Verify all tracks open after the
starters, steps remain ordered inside a track, Next lesson stays in that track,
and A2 remains locked until all A1 tracks are complete. Check preview, declaration,
actual consumption, reload, shelf clear, and local review. Grammar ownership and
first-use checks run in `validate:curated`, together with the A1 scope audit.
Repeat the independent walk for every A2 track from completed A1 alone. All five
must open without A2 starters, Next must stay local, and B1 must wait for every
A2 lesson and recall. Sibling completion and unrelated word history cannot
license A2 helpers. Repeat the independent walk and local Next checks for every
B1 track after completed A1/A2. Incomplete B1 coverage must keep the level incomplete. Check obsolete lesson versions do not grant completion.
Read the bilingual editorial packet and every changed surface/reading variant.
Before adding an authoring module, check that its filename and export are unused.
Compare every prior original lesson against the pre-batch snapshot, including
missing IDs as well as changed objects; a comparison over surviving IDs alone
cannot detect an accidentally removed authoring module. Draft checks must exit
unsuccessfully on errors so shell pipelines cannot publish a failed draft.
Run `npm run curriculum:audit-dependencies` before changing higher-level topic
availability. Its first-use report separates missing same-level vocabulary from
missing grammar. A valid ordered course is not proof of independent topics.
Grammar declarations must not reintroduce inherited or already taught rules;
retain useful lexical usage notes without labeling familiar grammar as new.
`reviewed-forms.json` is a reviewed allowlist, not an automatically refreshed
permit for new forms. Declared lexical variants also need their explicit
instruction and variant-specific recurrence checks in
`lexical-variant-instruction.json`; knowing a base word does not establish that
a polite or sense-changing form has been taught. The catalog and lazy topic bundles must match authored data.
The vocabulary recall planner preserves grammar, lexical-variant and other
authored checkpoints automatically. It replaces only its own numbered
`<topic>-revisit-` entries. Do not manually append those preserved checkpoints
again; inspect the plan and rerun exposure/grammar audits after replanning.
Grammar checks must inspect lexical inflections and clause context as well as
function tokens. A dictionary-linked こと can nominalize a clause, が can join
contrasting clauses, and も after a て-form is not the beginner “also” pattern.
A passing audit covers its declared rules; it never replaces the bilingual pass.
Keep learner notes about usage, form and meaning; omit production disclaimers.
Write directly to the learner without forced slang, hype, or references to
author/user discussions. Do not repeat the card's full translation in a helper
or announce that familiar grammar is new. Name starter lessons for what they
teach, and add a helper only when it explains a useful distinction or form.
Keep each helper focused on its immediate teaching point. Explanations must not
depend on vocabulary, kanji readings, verb forms or grammar the learner has not
met. Reuse familiar examples or the current card; if a new term is essential,
give its reading and meaning rather than assuming the learner can decipher it.
Do not attach a conjugation lesson to a particle explanation. For example, the
first を helper explains its position and object-marking role, without adding
unintroduced dictionary forms or another verb.
Apply the same rule to the note's pattern heading. Prefer a concrete example
using available words to Japanese placeholders such as 場所, 数字 or 頻度の副詞.
When replacing a cross-track word in a card, check its notes and pattern labels
too; they must not retain the removed word as an unexplained example.

Inspect Learn and a grammar card at desktop and phone sizes. Old snapshots may be reset under the explicit October 1 authorization. Dictionary actions find existing lessons;
there is no free-form builder, remake control, or global review mix in the UI.

The following sections describe historical requirements where they conflict with
this contract. Retired procedural tests live in
`archive/procedural-course-tests-2026-09-26/` and are excluded from test discovery.

## Historical procedural acceptance

Engine 2.0.0 follows `docs/decisions/2026-09-21-unique-sentences-and-card-review.md`.
Historical repeated-appearance targets and unsupported word-card fallbacks below
are superseded for personalized lessons. Run `sentence-review.test.ts`: duplicate
Japanese anywhere, one-word rejection, exact review copies, no preview credit,
consumption-only timers, normalized urgency, full 24+16+8 cap, pending overflow,
pooled persistence/corruption and invalid snapshot replay all have direct tests.
Run `scripts/simulate-learner-weeks.mjs` and personally read the full Japanese and
English output; numbers alone cannot establish topic fit or naturalness.
Broad cold-start coverage currently exposes unsupported selections; do not claim
that every dictionary word or topic batch is ready. Add authored contexts before
making those selections playable.

## Default Checks

- Saved word-use audits must use the complete stored card order, unaffected by
  search filters or current learner history. Run `lesson-word-audit.test.tsx` and
  `lesson-explorer.test.tsx`; test distinct-card uses versus token counts,
  consecutive groups, intervening gaps, aliases, missing targets and unrecorded
  provenance. Grammar exceptions must match authored forms, not guessed POS.

- For Home/Learn/navigation changes, run the relevant Next tests and
  `npm run next:build`. Focused coverage includes `home.test.tsx`,
  `custom-lesson-builder.test.tsx`, `custom-lesson.test.ts`,
  `session-shelf.test.tsx`, `continuity-ui.test.tsx`, `goals-view.test.tsx`,
  `library-words.test.tsx`, and `dictionary-browse.test.tsx` under
  `apps/learner-next/tests/`. Verify one primary Home action, Topics/Custom inside
  Learn, A1 self-checks on Progress, and exact saved resume from Home, Learn,
  and My lessons. The template catalog must stay absent from main navigation;
  generated snapshots and frozen-unit deep links must still open.
  New lesson from Dictionary/My words must carry all selected IDs, including
  reference entries with no procedural grammar support. Check the 30-word limit,
  stale asynchronous preview rejection, and that saving/previewing adds no credit.

- For topic A1 changes, run `tests/dictionary-a1.test.ts` plus
  `apps/learner-next/tests/topic-course.test.tsx` and `topic-planner-audit.test.ts`.
  Verify 12-word selection, actual density-based recommended size, configurable
  size ceilings, unique contextual sentences and full target coverage,
  one/two-word runs and explicit pattern boundaries,
  and saved resume on Home, Learn, and My lessons. Verify alias/overlap counting,
  complete pool reachability, spaced credit, practical self-check separation,
  preferences, exact saved/restarted sessions, and unchanged frozen-unit progress.
  Browse Learn and Dictionary at desktop and phone widths. Any reference word
  must be prioritizable and usable in vocabulary practice without grammar inference.

- For shared lesson pacing or ordering, include `lesson-transitions.test.ts`,
  `topic-sequence.test.ts`, `topic-sequence-feasibility.test.ts`,
  `topic-helper-selection.test.ts`, `smooth-topic-order.test.ts`, and
  `topic-boundary-ui.test.tsx`. The real greetings fixture demonstrates a feasible
  12-card/six-target plan that greedy sequencing previously overestimated.
  Check actual token/alias appearances, helper union, exposure caps, and exact
  multiset preservation. Search exhaustion must not claim a proven minimum.

- For the procedural kernel, run `npx vitest run tests/procedural-engine.test.ts`
  plus the normal tests/build. Preview affected recipes with
  `npm run lessons:preview -- --recipe <name>` and inspect actual Japanese,
  English, phase transitions, and exposure reports. The frozen curriculum audits
  below do not validate procedural snapshots.

- For the Next lesson/player integration, run `npm run next:test` and
  `npm run next:build`. Verify custom pools, explicit unsupported-reference errors, exact resume,
  saved generated sentences, Priority, unchanged course progress, and audio
  cancellation. Check the builder and player at desktop and phone widths.

- Visually inspect fresh and populated Home, Learn Custom with empty/selected
  words, My lessons, and Progress at desktop and phone widths. Use Activities as
  the loose visual guide. Look for clipped inputs, crowded action rows, hidden
  primary actions, horizontal overflow, and decorative icons without accessible
  names. Keep names, preview lists, diagnostics, and less frequent management
  actions in disclosures/menus; do not restore removed explanatory copy walls.
  Exercise keyboard focus and the shelf's browse/rename/remove menu as well as
  resume/bookmark. Restore temporary browser viewport overrides after QA.

- Run `npm run build` after code changes.
- Run `npm run test` after behavior or validation changes.
- Run `npm run test:e2e` after card-flow, persistence, layout, or navigation changes.
- Run `npm run validate:curriculum` after curriculum data changes.
- Run `npm run curriculum:sync-runtime-lexicon` after source vocabulary changes
  unless a rebuild command already does it.
- Run `npm run audit:level-alignment` after changing authored unit sequencing,
  level ranges, or large vocabulary batches.
- Run `npm run audit:curriculum-pacing` after generator or curriculum pacing
  changes; use `npm run audit:word-distribution:strict` when a rebuilt level
  is expected to satisfy the current-word exposure floor.
- Run `npm run audit:foundation-semantics` after changing Units 1-7. This is
  the human-taste audit for repetition, broad category cards, clustered grammar
  runs, early multi-current overload, and foundation word distribution.
- For data-only changes, inspect the edited JSON for valid syntax and aligned arrays.
- When changing UI behavior, exercise unit selection, next, previous, random, replay audio, explanation display, reveal toggles, and display toggles.

## Code Expectations

- Keep components readable and focused.
- Keep app behavior aligned with `docs/APP_VISION.md` and `docs/ARCHITECTURE.md`.
- Avoid hidden data-shape assumptions. When a required field is introduced, document it in `docs/DATA_CONTRACTS.md`.
- Prefer clear error handling for missing files, invalid lesson data, or blocked audio playback.

## Content Expectations

- After dictionary import/binding, run `npm run dictionary:curate` and
  `npm run dictionary:validate`. Review samples across every level and commonness
  band. In particular check homographs, source-marked usual kana, restricted
  senses, obscure named entities and saved entries absent from the study index.
  Estimated levels are not an official CEFR vocabulary certification.
- For adaptive word/grammar changes, run `node scripts/review-adaptive-lessons.mjs`
  and read the complete resulting Japanese/English lessons. Exercise fresh,
  actually practiced, due and saved-only profiles; check both single-pattern
  lessons and mixed topic/custom lessons. Include `adaptive-grammar.test.ts` and
  `grammar-ui.test.tsx` for actual-consumption credit, persistence, morphology,
  unknown-helper exclusion, due-word retention and balanced grammar review.
  Check actual exposure counts after any context substitution.

- Audit the actual Custom adapter with `node scripts/audit-custom-lessons.mjs`.
  It exports 252 synthetic-profile lessons (all 578 authored A1 IDs, topic and
  mixed selections, aliases, reference entries, short and long counts) to
  `docs/reviews/custom-lessons/index.md`. Inspect `content-findings.json` and the
  bilingual lesson reports as well as mechanical failures. The current adapter
  requires zero unselected, unpracticed helpers and introduces every target within
  the opening target-count cards. Excessive repetition requests must fail clearly.
  Include `lesson-vocabulary.test.ts` and `diversify-topic-coverage.test.ts` when
  changing admission or planning. Add `--strict-content` to fail on known content
  defects. Read complete generated Japanese/English sequences, including a real
  saved profile in the app, after changing generation. Fix the engine and remake
  the affected lesson, rather than editing saved cards. Include
  `personalized-engine-quality.test.ts` for sense constraints and spaced revisits.
  Coverage and correct transition labels cannot certify sensible Japanese, clean
  English, or useful progression. Synthetic profile passes are not a substitute
  for reading the user's actual output.
  Check contextual practice per target, not just total sentence count: a lesson
  can pass vocabulary and coverage checks while repeating several bare dictionary
  entries eight times each. Inspect `pedagogy-findings.json` from the broad audit;
  its flags require human review even when mechanical checks pass. Distinguish
  multi-token sentences from forbidden one-word cards. Add regressions for
  actual failing selections through both topic generation and custom/remake.
  Judge pattern variety across the ending as well as the introduction: spacing
  target words can still leave a long tail of one sentence construction. Check
  sense permissions separately (reading manga does not license writing/drawing
  it; listening to a guitar does not license an unknown play verb). Explanations
  must match the construction, including coordinating と versus companion と.
  Vocabulary admission alone does not establish relevance: when selected objects
  can support a choice drill, use those objects before unrelated familiar ones.
  Exercise different selections within a topic, not only its default batch.
  Keep transport argument particles and clothing verb senses explicitly authored;
  a vehicle can be boarded, and 着る does not license shoes or socks. Include
  `fresh-selections-quality.test.ts` for restaurant, routine, transport and size
  combinations, through both topic generation and custom/remake.

- Lesson item IDs remain stable once referenced by media.
- Lesson order is intentional.
- Target-language text, pronunciation hints, explanations, and translations agree with each other.
- Curriculum planning docs explain sequencing decisions well enough for Codex to continue the work.
- For authored curriculum units, confirm the unit has one grammar focus, about 10 core new words, and SRS entries for any learner-facing lexical grammar words.
- Generated Marugoto Starter supplemental units may use the documented 10-13
  word allowance from `docs/DATA_CONTRACTS.md`.
- Check the unit's new words against `data/jp/curriculum/word_selection_rules.md`.
- For authored curriculum units, confirm current words from `N` are drilled and review-due words from `N-2`, `N-4`, `N-8`, `N-16`, `N-32`, and so on return.
- Do not treat older vocabulary bins as isolated review prompts; they should be woven into natural sentence drilling.
- All introduced vocabulary is available as helper vocabulary, but current-unit and review-due words should dominate the unit.
- Current-unit words need enough contact to stick: balanced or regenerated units should give each current word at least 8 card appearances, usually landing in an 8-12 appearance band.
- Review-due words should usually return 5-8 times. Crowded review units may
  use lower floors: 4-8 for roughly 18-27 due words and 1-8 for 28+ due words.
  Late-A1 existence, location, and quantity units may allow repeated scaffold
  words up to 12 appearances when the repeated grammar shape is the point.
  Lexicon/helper words have no appearance quota and may vary freely.
- Guard against exact duplicate-card floods and predictable slot cycles such as `I -> you -> he -> she` with every other sentence element frozen.
- Check that new grammar appears after the unit's new words have been introduced with previously available grammar.
- Check for sterile card drift: too many `X is an object/person/place` cards means the unit needs more possession, contrast, time, social context, or practical questions.
- After the foundation units, avoid introducing every word with bare `Xです`; use cumulative grammar to make the first encounter more meaningful.
- Use `docs/CURRICULUM_QUALITY.md` as the taste bar before adding more units.

## Rebuild Expectations

- For topic selection, continuation, or review-history changes, include
  `apps/learner-next/tests/next-topic-lesson.test.tsx`. It completes ten lessons
  through the actual player across four simulated weeks and checks saved previews,
  numbered fresh targets, precise word timers, and unchanged unused histories.
  Run `node scripts/simulate-learner-weeks.mjs <unique-run-name>` to export complete
  bilingual sequences and per-word frequency evidence. Read the sequences yourself.
  Report new/older/recent appearances separately from selected target/helper roles,
  and count familiar-only cards separately from mixed cards. Include the remaining
  due queue; a tasteful lesson mix does not establish complete review coverage or
  actual retention.

- Codex implements the acceptance checks in `docs/ACCEPTANCE_TESTS.md`.
- A1 rebuild work uses `npm run curriculum:rebuild-a1`; pre-Marugoto one-off
  generation scripts are archived reference material.
- Failing tests drive iteration until the app and curriculum satisfy the documented contract.
- If a test cannot be run, Codex documents why and states the risk.

## Loanword inspection

For bounded vocabulary pools, run `npm run dictionary:validate-pools` and
`npx vitest run tests/study-pools.test.ts tests/dictionary.test.ts`, plus the
learner dictionary browse tests. Exact counts, distinct IDs, source restrictions,
and the katakana cap are necessary but not sufficient. Read the full A1 export
and each later-level sample; record concrete placement/identity fixes and keep
unreviewed later placements provisional. Browsing must not award practice credit
or widen supported sentence vocabulary. Regenerate after source dictionary edits.

For dictionary writing flags, check half-width/mixed forms, filter intersections,
reset and unchanged selection/history. Run `scripts/audit-loanword-concentration.py`
to refresh counts; keep library entries distinct from canonical teaching concepts.
Katakana counts must not be presented as confirmed English-loanword counts.
