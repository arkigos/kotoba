# Data Contracts

Current direction: [independent A1 tracks](decisions/2026-10-01-independent-a1-tracks.md) and
[independent A2 tracks](decisions/2026-10-01-independent-a2-tracks.md). New learning uses frozen,
authored lessons. Shared starters precede A1; completed A1 opens every A2 track.
Completing A2 opens eight [independent B1 tracks](decisions/2026-10-01-independent-b1-tracks.md).
Lessons and review stay local to each track. This supersedes the older linear A1–B1 and
procedural topic/custom completion rules below.

## Explicit curated lexical variants

`data/jp/curriculum/curated/lexical-variant-instruction.json` records reviewed
forms that share a functional learning word but have a separate reference entry.
Each declaration specifies `wordId`, `referenceEntryId`, exact `surface` and
`reading`, `lessonId`, instructional `evidence`, and the editorial `reason`.
The reference entry stays separate and outside the functional pool. This is
not a general alias table, prefix-stripping rule, or authorization for other
senses. Existing token fields and saved progress identities remain unchanged.

The form also needs explicit approval in `reviewed-forms.json`. Curated
validation requires the base word before the variant lesson, an explanation
before first use, no earlier use anywhere in the course, correct token identity,
and at least two original examples and six placements across instruction and
two later recalls in that chapter. Lower-level completion does not waive the
instruction check. Audio must match the realized form and reading.

## Curated card meanings (September 26)

Frozen cards retain dictionary identity in both `wordId` and
`dictionaryEntryId`. A token’s `explain` may give the explicitly reviewed sense
used in that sentence, rather than the dictionary’s first short gloss. Its
parallel `card.explain` entry must stay identical. This does not create another
learning word, change level membership, or license a new surface/reading.

The offline level authoring helper accepts a final `glosses` argument keyed by
its existing word address (rank or resolved helper). Resolve and review the
actual dictionary sense first. Invalid identities and empty glosses fail
compilation. The runtime field shapes and historical saved cards are unchanged.

## Dictionary and grammar additions (September 20)

Dictionary entries add `placement: { level: A1|A2|B1|B2|C1|C2,
method: reviewed|estimated, basis, confidence: high|medium|low }`,
`frequency: { band: very-common|common|uncommon|rare|unranked, source, zipf? }`
and `studyCollection`. Search rows append level, method and frequency band at
columns 8–10. Older 8-column rows remain accepted. `index.json` is the curated
50,000-entry imported collection; `reference-index.json` retains the complete
source. The manifest records both counts and `placementVersion`. The 474 local
entries are merged by the client. Course binding levels remain authoritative for
course words and Kana items. Labels never grant generation eligibility.

Cards optionally carry `practiceGrammar: string[]`. Sessions optionally carry
`grammarLessonId`; `lessonPlan.grammarReview` contains requested, practiced and
deferred pattern IDs. Frozen cards preserve their exact forms on replay.
`LearnerState.grammarHistory[id]` contains encounters, distinct practicedForms,
occasions, lastPracticedAt, lastOccasionAt, lastOccasionSessionId and
lastPracticeSequence. The additive storage codec accepts old saves without any
grammar state. Preview/save does not populate history. Actual consumption follows
the same practiced-position guard as word history; six distinct consumed examples
unlock availability. See the
[decision](decisions/2026-09-20-curated-dictionary-and-adaptive-grammar.md).

## Topic A1 additions (Next learner, September 13)

`data/jp/dictionary/a1_scope.json` owns versioned core membership, overlapping
topics, reviewed progress aliases, and source-linked practical milestones. Stable
learning IDs and audio bindings remain unchanged. Core progress uses the unique
representatives, never summed topic totals. The 450-word denominator is Kotoba's
authored scope; it is not an official CEFR quota.

The additive v3 `a1Journey` state stores `activeTopicIds` and `milestoneChecks`
(milestone ID to self-assessment timestamp). Missing preferences start with First
conversations; an explicitly empty active list stays empty. Learned core progress
requires three spaced practice occasions; actual practiced history supplies
introduced coverage. Priority and bookmarks alone cannot earn progress.
`a1CoreHistory` stores shared core practice occasions and the last occasion's
timestamp/session identity, allowing alternate learning forms to accumulate one
concept's progress without counting same-day forms twice. Legacy aggregates seed
the ledger conservatively from the maximum known alias occasion count.

Active sessions accept `topic` and `vocabulary` sources with materialized
`savedCards`, optional `topicId`, and explicit `targetWordIds`. No unit ID is
invented. They reuse the shared card resolver, validator, daily practice log,
audio adapter, and exact snapshot persistence. Individual saves are retained in
`savedMaterializedCards`. Activity results additionally accept `reading` for
Kana builder and retain the same first-try result contract.

## Learn Custom and navigation compatibility

Learn Custom (`#build`) replaces the main recipe/template catalog without
changing the learner schema version. Home/Progress labels retain the internal
`today`/`goals` keys; Learn Topics retains `course`. Existing frozen
`#lesson/<unitId>` links, saved `#lesson/session` snapshots, and generated sessions
remain readable and replayable. This is a presentation change, not a data reset.

`buildCustomLesson(state, wordIds, { cardCount?, title? })` in
`apps/learner-next/src/custom-lesson.ts` accepts 1–30 distinct explicit learning
or reference IDs. It preserves their order and identities in `targetWordIds`.
Dictionary and My words forward the complete selected pool to this builder;
unsupported words are not filtered through legacy procedural eligibility.
Oversized selections fail visibly rather than being truncated.

Custom returns `source: "vocabulary"`, exact aligned `savedCards`, ordered `items`,
and version-one `lessonPlan`. It has no invented `unitId`, recipe, or generated
`snapshot`. A planned vocabulary session is saved automatically on launch just
like a topic session; Save for later persists the same preview without starting
practice. Older vocabulary reviews without a plan remain valid.

Reviewed senses produce context cards through the shared personalized engine;
frozen cards are not candidate sources. A sole selected
reviewed concept can receive an appearance through an approved alias. When
multiple aliases of that concept are explicitly selected, each target instead
requires its exact ID in the card. Unsupported reference selections use exact word
cards with their selected surface, reading, meaning, dictionary entry, and any
`audioText`; dictionary POS alone never authorizes new sentence generation.
Missing forms/readings/meanings or failed entry downloads block the preview.

New plans carry optional `lessonPlan.engineVersion` identifying the personalized
generator; absent versions remain valid legacy snapshots. Candidate `pc-` IDs
derive from exact bilingual content. Cards are materialized without recipe-editor
derivations to keep shelf storage bounded. Explicit Remake uses the same target
IDs and title, retains shelf identity/source/topic/mode, and creates a new session
at cursor zero with no practice credit. Resume never silently regenerates.

Materialized cards may retain `constructionKey`, a compact reviewed construction
identifier (for example `motion`, `i-predicate`, or `identity`). Transition frame
comparison includes this key, so stripping a full derivation cannot conflate noun
identity with an adjective predicate. Absence remains valid for old snapshots and
authored frames without this metadata; no structure is inferred from imported POS.

Reviewed adjective senses may declare `subjectTags`, `excludedSubjectTags`, and
an exact `subjectWordIds` domain. All present restrictions must pass; broad tags
alone cannot admit a noun excluded by a narrower sense domain.

Custom uses the shared unique-sentence planner: up to 24 core cards, every target
covered, no padding; explicit sizes are ceilings. Unknown content
helpers outside selected targets are forbidden. A word is known only through
actual practice, with reviewed A1 alias equivalence. `helperWordIds` remains for
snapshot compatibility and is empty on newly built topic/custom lessons.
Required new words must be explicitly selected. The vocabulary admission and
planned appearance counts do not award practice credit. See
`docs/decisions/2026-09-13-focused-home-and-learn.md` for the product boundary.

## Procedural prototype contract

This compatibility contract continues to govern reviewed procedural callers and
saved generated snapshots. Its recipe-specific selection gates do not apply to
the current Learn Custom word selector.

The initial shared lesson/review engine uses the types in
`packages/learning-engine/types.ts`; its design and migration policy are in
`docs/decisions/2026-09-12-procedural-lessons.md`. Separate sense IDs reference
existing vocabulary `wordId` values. Recipes declare target/helper pools, available
grammar, ordered phases, substitution limits, and exposure floors. Generation
returns a versioned snapshot of fully realized cards, derivations, transitions,
and both sense-level and word-level coverage. Generated cards use `audioPolicy:
"words"` and never inherit a frozen unit's card audio reference.

These contracts coexist with the frozen contracts below. Existing curriculum
unit JSON remains unchanged. The Next app adds optional fields to its v3 profile
(`kotoba.next.state.v3`), preserving existing profiles:

- `activeSession.source: "generated"` carries the complete `snapshot` and ordered
  card-ID `items`, but has no unit ID. Cursor indexes the materialized array;
  repeated sentence IDs remain distinct encounters. Resume validates shape and
  aligned token arrays, and never substitutes a frozen card or regenerates.
- `wordHistory[wordId].recipeIds` records generated recipe attribution. A word
  encountered only in generated practice has `unitIds: []`. Dictionary still shows
  it; generated practice cannot advance or complete a course unit.
- `savedGeneratedCards[cardId]` stores `{ card, title, recipeId }` alongside
  `savedSentenceIds`. Content survives replacing or completing the active session.
- Generated playback uses realized token surface/reading, recorded word audio or
  device speech for that word. Sentence-listening and hidden-face controls are
  unavailable for these sessions. Existing global preferences remain readable.

The legacy recipe builder accepts only the reviewed vocabulary supported by its selected
recipe and level. Standard lesson targets removed by the learner are omitted
unless independently selected by the enabled review-addition policy. Reviews
may use the template's other words as explicitly listed helpers;
unsupported target selections are shown and block generation, never dropped.

### Levels and automatic word review

- `Lexeme.level` and `Recipe.level` use A1–C2. They remain optional for legacy
  engine callers; new app recipes and the reviewed overlay always declare them.
  A declared recipe level requires every target/helper sense to have placement
  at or below it. Construction/grammar levels and content-word/clause/depth limits
  apply to every candidate card. The policy is authored, JF/CEFR-inspired metadata.
- `Recipe.targetExposures` optionally overrides the global minimum per target
  sense. Keys must name targets and values must be positive integer floors. Review
  additions use four appearances; original targets retain the recipe minimum.
- `SessionSnapshot.reviewSelection` stores `selectedAt`, accepted `additions`
  with `{ wordId, senseId, reason }`, and `deferred` words with reasons. This is
  selection evidence, not practice history. Resuming never recalculates it.
- `wordHistory[wordId].prioritized?: boolean` is the sole new word preference.
  If absent, an old `rating: "hard"` acts as priority; explicit false overrides
  it. Other legacy rating data is retained without a rating UI.
- `wordHistory[wordId].review` optionally stores `lastPracticedAt`, `occasions`,
  `lastOccasionAt`, `lastOccasionSessionId`, and `lastPracticeSequence`. Card
  practice updates recency; a new spaced occasion needs a different session and
  24 hours. Inspect/save/priority actions do not advance or reset this schedule.
- `practiceSessionCount` and `activeSession.practiceSequence` count sessions
  with actual card practice. Missing fields mean no recorded sequence history,
  not a made-up count derived from old card encounters.
- `settings.reviewMixins?: boolean` defaults to true in the builder. At most two
  compatible known words are admitted after full sequence validation, with due
  words ahead of optional priority/recent suggestions. Generating the preview
  never changes word practice history.

The policy and legacy timestamp fallback are documented in
`docs/decisions/2026-09-12-word-review-and-levels.md`. These fields are additive
within the v3 profile; no profile wipe or frozen-unit ID migration is required.

Curriculum data is a core part of Kotoba. The app consumes checked-in JSON under `data/`, and validators enforce the structural rules before content reaches the learner.

## Languages

`data/languages.json` is an array of language entries.

Expected fields:

- `code`: short language code used by indexes, such as `jp`.
- `language`: display name shown in the app.

## Unit Index

`data/{lang}/curriculum/unit_index.json` contains the ordered unit list.
This index contains authored units only. Planned future units live in the
course map and level metadata until their JSON files exist.

Expected unit index fields:

- `id`: numeric unit id.
- `slug`: stable URL/file-friendly name.
- `title`: learner-visible unit title.
- `grammarFocus`: the grammar focus for the unit.
- `path`: path to the unit JSON file.
- `kind`: optional unit kind. Omit or use `standard` for sentence-drill
  units. Use `kana` or `kanji` for pre-A1 recognition units.

## Course Levels

`data/{lang}/curriculum/course_levels.json` contains learner-facing level
metadata for the planned course.

Expected course level file fields:

- `language`: language code, such as `jp`.
- `framework`: label for the course framing, such as `CEFR-inspired / JF-aligned`.
- `certificationClaim`: must be `false`; Kotoba levels are not official certification claims.
- `plannedUnitCount`: total planned units in the canonical course map.
- `levels`: ordered level entries.

Each level entry has:

- `code`: learner-facing level code, such as `Kana`, `A1`, `A2`, `B1`, or `B2`.
- `title`: learner-facing level title.
- `unitStart`: first planned unit id in this level.
- `unitEnd`: final planned unit id in this level.
- `canDoSummary`: short Can-do outcome summary for the level.
- `courseStage`: optional stage marker. Use `prelude` for pre-A1 recognition
  levels and `core` for A1-B2 course levels.

Core A1-B2 level ranges must be contiguous, non-overlapping, and cover every
planned unit exactly once. The authored unit index may contain only a prefix of
these planned units. Prelude levels live outside the canonical 1-96 course map
and use the 100+ unit id range so they can appear before A1 without changing
the A1-B2 grammar sequence.

## Unit Files

`data/{lang}/curriculum/units/unit_NNN.json` contains an authored unit.
These frozen unit files are the app-facing artifact. The editable curriculum
intent lives in `data/{lang}/curriculum/source/`, and source metadata should
match the frozen unit metadata until a generator rebuild updates the artifacts.

Expected unit fields:

- `id`: numeric unit id.
- `slug`: stable unit slug.
- `title`: learner-visible unit title.
- `grammarFocus`: one grammar focus or tightly bundled focus.
- `kind`: optional `standard`, `kana`, or `kanji`.
- `newWords`: usually 10 core vocabulary entries for a standard unit, plus any
  learner-facing lexical grammar words introduced by that unit. Every learned
  non-function word must be SRS vocabulary.
  Generated Marugoto Starter supplemental units may carry up to 13 words when a
  topic-bucket boundary would otherwise create an underloaded orphan unit.
- `cards`: 80-100 sentence cards is the target for rebuilt standard units.
  Units with very crowded review pools may extend to 115 cards, or 135 in late
  A1 units with 40 due review words, when needed to
  keep current words in the 8-12 band while still returning every due review
  word. Older units may remain above this until they are regenerated under the
  newer pacing rules.

Prelude recognition units are intentionally different: `kind: "kana"` or
`kind: "kanji"`, any useful number of recognition items, no review/lexicon
obligations, and cards that can be single-symbol prompts rather than full
sentences.

## New Words

Each `newWords` entry has:

- `id`: stable vocabulary id.
- `surface`: Japanese surface form.
- `reading`: kana reading.
- `meaning`: English meaning.
- `function`: broad function/category used by authoring checks.

New words must not duplicate any earlier unit word by obvious surface, reading, and meaning.

Vocabulary `id` values are durable curriculum keys. If an early word is renamed
or recast for learner-facing quality, prefer preserving the existing id and
updating its `surface`, `reading`, and `meaning` so review scheduling and saved
card references do not split across two vocabulary identities. Unit 1 currently
keeps the legacy ids `sakura`, `yuki`, and `tanaka` as stable keys for the
learner-facing pronouns `あなた`, `彼`, and `彼女`.

## Function Words

`data/{lang}/curriculum/function_words.json` contains particles, copula chunks,
and sentence endings that learners should be able to inspect separately from
new/review/known vocabulary. These entries use the same basic fields as
`newWords`: `id`, `surface`, `reading`, `meaning`, and `function`.

Function words are not counted as the unit's 10 new vocabulary words and do not
participate in SRS vocabulary bins. The practice UI derives the active unit's
Function list from grammar tokens whose `surface` and `reading` match this
central file.

Do not put lexical verbs, nouns, adjectives, or pronouns in the function-word
file. In particular, polite existence verbs such as `あります`, `います`,
`ありません`, and `いません` should be modeled as vocabulary or grammar focus
material, not as function words.

## Grammar Tokens

`data/{lang}/curriculum/grammar_tokens.json` contains documented grammar-focus
chunks that are learner-facing but not part of the unit's SRS vocabulary. Use
this for phrase-level connectors such as `ください`, `もいいです`,
`はいけません`, and `しています`.

Grammar tokens use the same basic fields as `newWords`: `id`, `surface`,
`reading`, `meaning`, and `function`. A card token without `wordId` must match
either `function_words.json`, `grammar_tokens.json`, or an allowed punctuation
mark. If a learner-facing lexical item should participate in SRS, give it a
`wordId` instead of placing it here. Lexical grammar words such as `ある`,
`いる`, `好き`, `必要`, and `どう` are SRS vocabulary, not grammar tokens.

## Cards

Each card has:

- `id`: stable card id.
- `line`: target-language parts rendered in order.
- `tts`: reading/pronunciation parts aligned to `line`.
- `explain`: explanation parts aligned to `line`.
- `tokens`: structured token objects aligned to `line`.
- `english`: semantic English translation of the target-language `line`.
  It should be natural English, but it must not add an answer, object, owner,
  tense, relationship, or scene detail that is not present in the Japanese.
  Single-card translations do not end with a plain period.
- `audioRef`: optional audio reference.
- `audioText`: optional production-TTS override when the displayed text or
  aligned `tts` text is visually correct but too ambiguous for an external TTS
  model. This is mainly for recognition cards such as standalone kana.
- `grammarTags`: grammar patterns used by the card.

Each `tokens` entry has:

- `surface`: the displayed Japanese token.
- `reading`: the kana reading used for token playback fallback.
- `explain`: short learner-facing explanation.
- `wordId`: optional vocabulary id when the token represents a tracked word.
- `audioRef`: optional production token audio reference. Token audio refs should
  point at the shared `/media/jp/audio/tokens/` cache so repeated elements reuse
  one file across units.
- `audioText`: optional production-TTS override when the token reading is not
  explicit enough for external TTS.

## Alignment Rule

For every card, `line`, `tts`, `explain`, and `tokens` must have the same length.
Cards are authored as one sentence or phrase. Do not include Japanese full-stop
tokens (`。`) in `line`, `tts`, `explain`, or `tokens`; the practice UI gives the
sentence its visual boundary.

## Tokenization Rule

Productive particles should remain visible as their own tokens. In foundation
questions, write `です` and `か` as separate parts rather than a single `ですか`
chunk so learners can recognize `か` as the question marker.

Negative copula forms are intentionally chunked when they appear:

- `ではありません`: reading `でわありません`, explained as polite negative identity
- `じゃありません`: explained as contracted polite negative identity
- `ではありませんでした`: reading `でわありませんでした`, explained as polite past
  negative identity

These chunks can be decomposed in a later grammar unit, but early units should
not force learners to scrutinize the internal `は` in `ではありません`.

## Vocabulary Availability And Review

For unit `N`, usable helper vocabulary comes from every unit already introduced:

```text
1, 2, 3, ... N
```

The current unit's `newWords` are the drilled vocabulary. Earlier words are known
helper vocabulary and may appear whenever they make a sentence clearer, more
natural, or more educational.

Spaced repetition is enforced as a minimum return schedule. For unit `N`,
review-due vocabulary comes from words introduced in:

```text
N
N-2
N-4
N-8
N-16
N-32
...
```

Only positive unit numbers that exist are included. Review-due words must return
in that unit, but they are not counted as the current unit's new drilled
vocabulary. They should not receive vocabulary introduction cards. They are the
preferred scaffolding for new material when they fit the same card naturally.
Already introduced lexicon words may fill the same role when they make the
sentence clearer. Do not use review-only runs to delay current-unit material.

## Source Curriculum Model

`data/{lang}/curriculum/source/unit_specs.json` contains the editable authored
unit plan:

- `schemaVersion`: source schema version.
- `language`: language code, such as `jp`.
- `units`: ordered unit specs.

Each source unit spec has:

- `id`
- `slug`
- `title`
- `grammarFocus`
- `newWords`
- `reviewWordIds`: SRS-due vocabulary ids for this unit, computed from `N-2`,
  `N-4`, `N-8`, and so on.
- `lexiconWordIds`: already introduced, non-due helper vocabulary ids available
  for sentence scaffolding.

These fields must match the app-facing unit index and frozen unit files. Use
`npm run audit:curriculum-source` to catch drift.

## Runtime Lexicon

`data/{lang}/curriculum/runtime_lexicon.json` is a compatibility artifact generated
from `data/jp/dictionary/course_bindings.json` and `course_entries.json`. New runtime
lookups use `packages/dictionary/` directly. It preserves the old vocabulary fields:

- `id`
- `surface`
- `reading`
- `meaning`
- `function`
- `introducedInUnit`: introducing curriculum unit ID
- `level`: that unit's course level, including the separate Kana category
- `dictionaryEntryId`: canonical lexical identity
- optional `audioText`: authored pronunciation without display notation

The top-level `placementFramework` identifies these as Kotoba curriculum
placements inspired by JF/CEFR, not official word-level certification. The 825
entries support curriculum lookup; only the separate reviewed sense overlay is
eligible for sentence generation. Unknown future course placement must not be
treated as A1 by default.

Regenerate it with:

```sh
npm run curriculum:sync-runtime-lexicon
```

`teaching_words.words[legacyId]` is the canonical authoring source for selected
teaching forms/glosses, course placement, and pronunciation overrides. The binder
reads this source, not legacy unit word definitions; one-time bootstrap is explicit.
`course_bindings.words[legacyId]` stores entry ID, selected surface/reading/gloss,
function, authored level/introduction, optional sense IDs/audioText, and matching
provenance. Grammar bindings have no introducing unit (`null`).
`course_entries.entries[entryId]` contains canonical lexical records. Imported
`jmdict:<sequence>` IDs are stable; uncertain matches and recognition/grammar
entries use `kotoba:<id>`. Full entries live in 64 lazy-loaded public shards;
index rows contain ID, display headword/reading/gloss, and optional search-only
alternate forms/meanings. Full dictionary entries do not default to an A1 level.

`audio.pronunciations[key]` owns exact entry/reading/spoken-text/variant identity,
status, immutable ref, and provenance. Paid records include voice/model/settings,
request receipt, and billed character metadata. Reading aliases carry a direct
ref to the shared file. Word forms and grammar endings must use their realized
readings; a canonical lemma reference never authorizes lemma audio substitution.

See `docs/decisions/2026-09-12-canonical-dictionary.md` for ownership, preservation
of learning IDs/snapshots, source licensing, and update rules.

`data/{lang}/curriculum/source/pacing.json` contains generation pacing rules:

- current-unit vocabulary first appears by card 40
- the unit grammar focus first appears by card 60
- every A1 unit includes a small verb/existence lane; Units 1-7 use real
  current-unit verbs, and later action previews or existence practice should
  appear before the late review band
- review-due vocabulary returns somewhere in the unit without fake intro cards
- no learner-facing first exposure appears after card 60
- current-unit words should appear at least 8 times in a balanced or regenerated unit, with 8-12 appearances as the usual target band
- scheduled review-due words should aim for 5-8 appearances in a standard unit,
  bending when the due review pool gets crowded: 4-8 for roughly 18-27 due
  words, 1-8 for 28+ due words, and up to 12 for naturally repeated late-A1
  existence/location/quantity scaffolding
- lexicon helper words have no appearance quota

Foundation units should stay under 100 cards when the 8-12 current-word band
and review obligations can both be met without rushing new material. Crowded
review units may reach 115 cards, or 135 for late-A1 40-word review pools, but
should still close with current-unit material and avoid detached review tails.

Existing frozen units may temporarily violate these pacing rules while the
generator is being adopted. Use `npm run audit:curriculum-pacing` for
first-exposure pacing, `npm run audit:word-distribution` to see rebuild debt,
and `npm run audit:word-distribution:strict` when a rebuilt level is expected
to satisfy the 8-12 current / 5-8 review distribution target.

## Grammar Rule

Grammar availability is cumulative. A unit may use grammar introduced in previous units, and it introduces exactly one new grammar focus unless the grammar map explicitly bundles tiny companion pieces.

The canonical planned Japanese course map is `data/jp/curriculum/grammar_by_unit.md`.
It contains 96 CEFR-inspired / JF-aligned planned units from A1 through B2.

## Legacy Data

The old lesson JSON, Express routes, static files, and media conventions are archived under `archive/prototype-cra-express-2026-06-27/`. They are reference material, not the active app contract.


## Learner Session Continuity

Topic and planned custom sessions add optional `ActiveSession.lessonPlan`:
version 1, `cardCount`, `appearances` keyed by the session's target IDs,
`helperWordIds`, `newWordIds`, and `reviewWordIds`. Topic keys are reviewed core
representatives; Custom retains its explicit selected IDs as described above.
The frozen `savedCards` remain authoritative on resume. Optional `pacing` records
the appearance goal, actual minimum appearances, mean target density, baseline
card count, and totals of single changes, double changes, boundaries, and repeats.
Optional `transitions` has one entry per card: `kind` (`start`, `neighbor`,
`boundary`, or `repeat`), `lexicalChanges`, `grammarChanged`, and `basis`
(`tokens` for frozen examples, `slots` for reviewed derivations). Older plans
without these fields remain valid. These diagnostics are not learning credit;
the default builder view keeps them inside its details disclosure.

Topic lessons default to 12 fresh targets and at most 24 unique core sentences.
Every explicit target requires contextual coverage. Explicit counts are ceilings
from 1–48; the final assembly adds at most 16 due and 8 recent review cards.
Duplicate Japanese and one-word cards are rejected across all sections.
`SessionItem.section?` identifies lesson/due-review/recent-review; `reviewSource?`
stores lessonId/title. `lessonPlan.sections?` records lesson/dueReview/recentReview/
cap counts, and `deferredDueWordIds?` records due overflow. Core pacing diagnostics
remain core-only; appearances count the complete session.
`LearnerState.reviewCards?` maps normalized sentence identity to {card,
sourceLessonId, sourceTitle?, lastPracticedAt, encounters}. The storage codec
interns this bank in `_reviewCardBank` using existing card/token pools; malformed
references block writes through the existing recovery mechanism. See
`docs/decisions/2026-09-21-unique-sentences-and-card-review.md`.

`WordHistory.cardEncounters?: number` records actual consumed card positions from
this version onward, separately from legacy `encounters` (which includes lookups).
An absent field means untracked, not zero historical exposure. See
`docs/decisions/2026-09-13-word-card-exposures.md`.

The active learner's additive version-3 session fields are documented in
`docs/decisions/2026-09-13-practice-continuity.md`: `lessonHistory`,
`dailyPractice`, `ActiveSession.lessonId`, `practicedIndices`, and the `saved`
session source with materialized `savedCards`. Existing profiles remain readable.

Browser storage may compact saved materialized lessons into independently
versioned card, token, and item pools. Runtime sessions and normal exports retain
full cards. Exact payloads, IDs, order, and cursor round-trip without regenerating
content. See `docs/decisions/2026-09-13-saved-lesson-storage.md` for the wire format
and corruption recovery rules.

My lessons manages the stored sequence rather than a new recipe invocation.
Resume preserves the actual cursor and cards; replay resets encounter position
while keeping the same lesson content/identity link. Renaming and bookmarking do
not recompose content, and changing the topic pool or dictionary later does not
rewrite existing saved cards.

`LearnerState.clearedLessons?: StoredLesson[]` holds recoverable snapshots removed
by Clear all lessons. Clearing empties the active session and shelf only; word,
grammar, course and activity progress remain. Restore merges by lesson ID, keeping
any current shelf record over its backup. The storage codec packs and validates
this field with the same lossless card pool as `lessonHistory`.

Word review ranking uses actual last practice, including lexical helpers on a
consumed card. Reviewed core aliases share their most recent practice for due
status; saved-only aliases cannot advance it. Preview/save does not reset time.
See `docs/decisions/2026-09-20-review-recency.md`.

Optional `ActiveSession.topicSeries` contains `rootId`, `baseTitle`, and `number`.
Completed topic lessons can generate a separate next lesson with genuinely new
targets, using current practice history and the same target count and core/extra
pool. The initial unnumbered lesson is number 1; subsequent titles append the next
family number, considering current and recoverably cleared lessons. Replay and
Remake keep their existing meanings. See
`docs/decisions/2026-09-20-topic-series-and-four-week-simulation.md`.

## Goals and Activities

Goals and activity tracking add optional `learningGoals`, `activityResults`,
`activityDays`, `kanjiProgress`, and `courseRevisions` to learner schema version 3.
See `docs/decisions/2026-09-13-goals-and-activity-progress.md` for calendar windows,
round deduplication, real-practice counting, and the Unit 103 denominator migration.
The researched 50-character content source is `data/jp/kanji/core_kanji.json`;
origin citations and modern memory notes are separate fields.

## Bounded vocabulary study pools

`data/jp/dictionary/study-pools.json` holds `version`, per-level `budgets`, and
disjoint `pools` of dictionary entry IDs (25,000 total). The matching public
`study-index.json` uses `SearchRow`: indices 8/9 are pool level and confidence,
10 retains frequency band, 11 is a one-based per-level rank, and 12 is stage
(`introductory`, `foundation`, `topic-expansion`, or `expansion`). A1 confidence
is reviewed; later levels remain estimated. Existing index rows need not contain
11/12. Load pools independently with `loadStudyPoolIndex`; a failed fetch must
not substitute historical dictionary placements. Membership grants neither
practice credit nor sentence support. See
`docs/decisions/2026-09-21-bounded-level-pools.md`.

## Content Sense Checks

Offline level authoring accepts `LEVEL@surface` (for example `B1@互い`) for
targets, sentence tokens and contextual gloss keys. The name must resolve to
exactly one active dictionary identity at the stated current or lower level.
Only current-level identities may be lesson targets. Ambiguous names require
the existing stable source-rank reference; `@surface` still means a unique
lower-level helper. These conveniences do not grant prior knowledge or bypass
track dependencies, grammar ownership or reviewed-form checks. Published cards
keep the same dictionary IDs and schema. Prefer explicit names in new authored
content to make accidental word substitutions visible during review.

An authored lesson ID must be unique within the course. The offline authoring
API rejects a duplicate before appending the lesson or changing topic membership;
ordering must never silently replace an earlier lesson with a later namesake.

Keep clause particles such as と separate from lexical verb forms. A reviewed
surface/reading pair must not conceal a construction from the grammar audit.

Schema validity is not enough. Unit cards must avoid technically valid but pedagogically weak content:

- no bare English fragments such as "name." or "student." when a fuller meaning is available
- no English helper answers or captions inserted into a translation, such as translating
  `これは何ですか？` as "What is this? It is water."
- no yes/no cards where the only useful change is `はい` or `いいえ`
- no contradictions such as "No, the cat is an animal"
- no category sentences that feel philosophically possible but educationally unhelpful
- prefer compounds and paired contrasts when they make repetition more meaningful
