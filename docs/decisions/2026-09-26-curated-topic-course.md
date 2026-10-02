# One curated course replaces live generation

A1 progression is superseded by [independent A1 tracks](2026-10-01-independent-a1-tracks.md). The frozen-content and bounded-dictionary principles remain.

The September 26 user direction supersedes the procedural topic/custom learning
path, overlapping 450-word core, runtime helper selection, and global review
mixins. Existing snapshots, dictionary identities, word history, and frozen-unit
links remain intact. New main-path lessons use checked-in cards exclusively.

## Course contract

The bounded study pools are the coverage source: A1 753, A2 1,264, B1 3,005,
B2 5,000, C1 6,999, C2 7,998 disjoint entries. These editorial budgets reflect
[reviewed level transfers](2026-09-26-reviewed-level-transfers.md), not official
CEFR quotas. A level is complete only when
every pool entry belongs to an authored lesson and every required lesson is
completed or explicitly declared known. An incomplete catalog cannot complete
a level. These are product scope counts, not official CEFR vocabulary thresholds.

The user's later September 26 decision supersedes free topic selection: there is
one linear course. Five required introductory lessons precede A1 chapters,
including shared instruction in の and も. Topic names now organize chapters;
they do not create independent knowledge tracks. `course-order.json` fixes the
chapter sequence. A new lesson requires every preceding lesson and complete
lower levels. Completed lessons remain replayable, including older completions
that predate the new order. Existing practice history is preserved.

Current targets, shared foundations, and all earlier completed lessons may
supply vocabulary. Grammar carries forward only after explicit instruction.
Chapter-local review and saved recall checkpoints remain available. A level
requires every authored vocabulary and grammar lesson, plus all its dictionary
entries; coverage alone does not complete an unfinished catalog.

Follow [the A1 scope and pacing policy](2026-09-26-a1-scope-and-pacing.md).
The 753-word A1 pool is a product coverage budget, not a CEFR certification.

Grammar belongs to the lesson: an explanation and model appear before practice.
The checked-in authoring compiler expands explicitly selected, reviewed drills
offline. It never picks words by POS, searches for examples, or generates cards
in the browser. Read the actual resulting Japanese and English, including every
substitution: a valid vocabulary budget alone does not establish naturalness.

Greeting/parting expressions may be single complete utterances, explicitly marked
`kind: social-expression`. This narrow curated-content exception replaces the
old blanket ban on isolated cards for those expressions; it does not permit
ordinary dictionary-word fallback cards. A slash marks a change of speaker in
short greeting exchanges. All other cards need sentence context.

## Progress and review

`curatedProgress.completions` stores versioned completion independently of the
recent lesson shelf. Every actual card position must be consumed; moving the
cursor to the end is insufficient. Previewing and saving earn nothing. A known
declaration advances course knowledge without manufacturing encounters, XP,
streaks, review cards, or correct answers. Clearing lessons preserves progress.

`curatedProgress.cards` stores actual consumed curated card IDs, content versions, timestamps and separate-day counts.
Review selects exact cards from the selected topic only, including its learned
social expressions. Review never introduces targets or advances a new lesson. Intervals are 1, 3, 7, 14, 30 and 60 days, advancing only on a separate local study date. Changed versions cannot reuse old review eligibility.

Grammar consolidation lessons remain required even when vocabulary coverage is already 751/751.
Current course progress counts completed vocabulary coverage, not demonstrated
retention. Can-do self-checks remain a separate reflection tool.

## Ownership and checks

- `scripts/lib/curated-course-authoring.mjs`: development-only compiler.
- `scripts/author-curated-a1.mjs`, `scripts/lib/curated-a1-*.mjs`: authored source.
- `scripts/lib/curated-level-authoring.mjs`: later-level authoring with explicit lower-level helpers.
- `scripts/author-curated-a2.mjs`, `scripts/lib/curated-a2-*.mjs`: A2 authored source.
- `data/jp/curriculum/curated/{a1,a2}.json`: frozen level masters.
- `catalog.json` and `topics/*.json`: lightweight metadata and lazy topic bundles, built by `scripts/compile-curated-catalog.mjs`.
- `apps/learner-next/src/curated-course.ts`: course availability and completion.
- `CuratedCourseView.tsx`: topics, internal lessons, grammar preview, topic review.
- `scripts/validate-curated-course.mjs --complete=A1,A2`: full A1 and A2 coverage, unique
  ownership, vocabulary prerequisites, dictionary links, aligned tokens, and
  contextual exposure checks.
- `curated-course.test.ts`, `curated-course-ui.test.tsx`: linear prerequisites and cross-chapter continuation,
  full-level completion, exact playback, player consumption, reload, and review.

Legacy procedural selection/quality tests describe a retired feature, not the
new course acceptance criteria. Snapshot playback, storage, audio, and player
tests remain applicable. Do not revive generation to satisfy superseded UI tests.

Reference: [JF Standard](https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do)
defines practical communicative ability; [Marugoto's design](https://marugoto.jpf.go.jp/en/teacher/feature/)
connects topic situations, grammar, and vocabulary. The new sentences are original
Kotoba content, not copied textbook exercises.

## Foundational vocabulary correction during A2 authoring

The frequency/learning-order pool placed everyday grammar vocabulary such as
くれる at B2 and なる at B1. That is unsuitable for the curated elementary track.
Sixteen explicitly reviewed identities now have A2 priority: くれる, なる, やる,
もし, まま, つもり, いただく, おる, さっき, まず, あんな, 時, はず, 方,
おにぎり and もう少し. A1 membership and order remain unchanged. The bounded
pool still contains 25,000 distinct identities; the reference dictionary and
historical learning IDs remain available. Advanced placements remain editorial
candidates, not a claim of official CEFR vocabulary certification.

A2 source ranks are frozen identity addresses in `a2-authoring-ids.json`, not
mutable pool/frequency ranks. A placement correction must never silently change
the words in already-authored sentences. New source identities are appended;
inactive ranks cannot be used as current-level targets. The compiler pins this
manifest by hash, and the validator checks the actual current level of targets.

`--complete=A1,A2` requires those named levels; `--complete` requires all six.
The normal validation command currently requires complete A1 and A2 while validating
all authored later-level content and reporting its remaining coverage openly.


## B1 identity audit and scalable loading

B1 prioritizes ボール (sports ball), ボタン, 破れる and the time/money sense of
かかる. The disease homophone formerly occupying the bounded かかる slot remains
in reference/history rather than being aliased to the general verb. Source
addresses in `b1-authoring-ids.json` are stable; the replaced source address is
explicitly reference-only and new entries are appended. Never author a retired
address or substitute one homophone’s ID for the other. A1/A2 pool order and
membership did not change.

Catalog metadata contains IDs, targets, card IDs and the first grammar pattern.
Full grammar notes, helpers and cards load together in the topic bundle. Maps
index lessons, levels and consumed-card ownership so larger levels do not make
completion checks repeatedly scan every lesson. This changes neither exact
playback nor the meaning of a stored versioned completion.

## Explicit editorial acceptance and continued exposure

The user's follow-up requires a full quality review after authoring: legal
vocabulary, natural and coherent Japanese/English, appropriate early difficulty,
balanced and sufficient target exposure, complete A1 coverage, and grammar
introduced before its first use. A function-form allowlist or an inflection
allowlist alone does not establish grammar prerequisites. Inspect every lesson's
actual constructions and the note/card position where they are taught.

Words must recur in later lessons of their own topic. Two appearances within an
introduction lesson are necessary but insufficient. The course sequence needs
distributed retrieval practice as well as the existing separate-day topic SRS.
Review must reuse approved sentences or explicitly authored new sentences;
never reintroduce on-the-fly generation to fill a recurrence quota. Exposure
should be reasonably balanced across targets, not exactly equal to naturally
frequent grammatical/helper words. Tail-of-topic targets need later review too.

After editorial checks and fixes are complete, the user authorizes missing
ElevenLabs audio. Inventory exact surfaces/readings and existing recordings
first, use the deduplicating dictionary-audio pipeline, and avoid duplicate paid
requests or substituting lemma audio for an inflected token. Do not spend on
recording sentences that are still undergoing editorial revision.
