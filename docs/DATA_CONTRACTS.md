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

- `code`: learner-facing level code, such as `A1`, `A2`, `B1`, or `B2`.
- `title`: learner-facing level title.
- `unitStart`: first planned unit id in this level.
- `unitEnd`: final planned unit id in this level.
- `canDoSummary`: short Can-do outcome summary for the level.

Level ranges must be contiguous, non-overlapping, and cover every planned unit
exactly once. The authored unit index may contain only a prefix of these planned
units.

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
- `newWords`: exactly 10 new vocabulary entries for a standard unit.
- `cards`: 80-150 sentence cards for a standard unit.

## New Words

Each `newWords` entry has:

- `id`: stable vocabulary id.
- `surface`: Japanese surface form.
- `reading`: kana reading.
- `meaning`: English meaning.
- `function`: broad function/category used by authoring checks.

New words must not duplicate any earlier unit word by obvious surface, reading, and meaning.

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
- `fact`: short usage, grammar, or cultural note.
- `grammarTags`: grammar patterns used by the card.

## Alignment Rule

For every card, `line`, `tts`, `explain`, and `tokens` must have the same length.
Cards are authored as one sentence or phrase. Do not include Japanese full-stop
tokens (`。`) in `line`, `tts`, `explain`, or `tokens`; the practice UI gives the
sentence its visual boundary.

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
vocabulary.

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

These fields must match the app-facing unit index and frozen unit files. Use
`npm run audit:curriculum-source` to catch drift.

`data/{lang}/curriculum/source/pacing.json` contains generation pacing rules:

- current-unit vocabulary first appears by card 40
- the unit grammar focus first appears by card 60
- review-due vocabulary first returns by card 60
- no learner-facing first exposure appears after card 60

Existing frozen units may temporarily violate these pacing rules while the
generator is being adopted. Use `npm run audit:curriculum-pacing` to see that
rebuild debt, and `npm run audit:curriculum-pacing:strict` once generated units
are expected to conform.

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
