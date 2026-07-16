# Data Contracts

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


## Content Sense Checks

Schema validity is not enough. Unit cards must avoid technically valid but pedagogically weak content:

- no bare English fragments such as "name." or "student." when a fuller meaning is available
- no English helper answers or captions inserted into a translation, such as translating
  `これは何ですか？` as "What is this? It is water."
- no yes/no cards where the only useful change is `はい` or `いいえ`
- no contradictions such as "No, the cat is an animal"
- no category sentences that feel philosophically possible but educationally unhelpful
- prefer compounds and paired contrasts when they make repetition more meaningful
