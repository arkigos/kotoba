# App Vision

Kotoba is a curriculum-driven sentence drilling app for learning Japanese
through long, repetitive, naturalistic exposure.

The app moves learners through a carefully controlled stream of sentences. Each
new word and grammar pattern appears inside a living sentence world, then gets
recombined through small modular changes until it feels familiar in context.

## Core Experience

A learner enters a unit and drills many short cards.

Each card presents:

- a Japanese sentence or phrase
- aligned reading/pronunciation hints
- aligned word-part explanations
- English meaning
- an image or image prompt
- audio when available
- a short usage, grammar, or cultural note when useful

The learner repeatedly sees small modular changes:

- one word changes while the sentence mold stays familiar
- one grammar structure appears after the words are familiar
- older words return naturally inside new sentence contexts
- sentence length and complexity grow gradually

The product makes repetition feel fluent, not mechanical.

## Curriculum Shape

Kotoba's Japanese course is made from frozen authored units.

The planned Japanese path is CEFR-inspired / JF-aligned from A1 through B2, but
it is not an official certification claim. Levels are defined by practical
Can-do outcomes and supported by grammar sequencing.

Each standard unit has:

- one grammar focus
- 10 new words selected to support that grammar focus
- 80-150 cards

The unit title is learner-facing, such as `Unit 6: This And That`.
The grammar focus remains visible as supporting text, such as:

- `AはBです`
- `NをVます`
- `場所でVます`
- `Vたいです`

Vocabulary is cumulative. For unit `N`, all words from units `1...N` are
available as known helper vocabulary, so later lessons can build richer,
more natural sentences instead of artificially forgetting useful words.

Spaced repetition follows the relative word-bin rule. For unit `N`, words from
these units are review-due and must return:

```text
N
N-2
N-4
N-8
N-16
N-32
...
```

Only positive unit numbers that exist are included. Review-due words are woven
into natural cards; they are not separate review prompts and they are not counted
as the current unit's new drilled vocabulary.

This is curriculum-level spaced repetition. It guarantees that authored units
bring earlier vocabulary back on schedule. It does not yet track individual
learner memory, missed cards, ease, or personal due dates.

Grammar is cumulative. Once a grammar focus has been introduced, later units use
it freely. The current unit's new grammar appears late, after the unit's new
words have been introduced through older grammar.

## Unit Rhythm

A unit follows this rhythm:

1. Establish the unit's new words with familiar grammar.
2. Drill the new words through modular substitutions.
3. Blend in older known helper words, especially review-due words.
4. Introduce the unit's grammar focus using familiar words.
5. Apply the grammar focus to the unit's new words.
6. End with dense mixed sentence churn using known vocabulary and cumulative grammar.

This rhythm is an authoring rule, not learner-facing text.

## Codex Authoring System

Codex authors, checks, and revises units ahead of time. The shipped curriculum is
frozen data that can be inspected, validated, edited, and versioned.

The documentation gives Codex enough context to rebuild the app and continue the
curriculum without unwritten project lore.

Authoring data includes:

- grammar by unit
- word selection rules
- unit word lists
- generated card data
- validation reports

For the implementation operating manual, see `docs/CODEX_BUILD_GUIDE.md`.
For the checks Codex runs after building, see `docs/ACCEPTANCE_TESTS.md`.

## Product Modes

Kotoba centers on one excellent learning loop:

- choose/resume a unit
- drill cards
- reveal/toggle meaning and explanations
- play/replay audio when available
- advance, backtrack, randomize, or continue

Supporting modes:

- unit overview
- curriculum map
- word lookup from introduced words
- grammar focus summary
- audio generation workflow
- local progress tracking

The practice player also has lightweight presets over the same settings:

- Reading: Japanese-first with notes and audio.
- Listening: audio-first with prompt text hidden.
- Recall: English-first with notes hidden.
- Rapid: compact Japanese-first review with auto advance.

## Progress Model

The curriculum itself provides spacing through the word-bin rule.

Learner progress stores:

- current unit
- current card
- completed units
- display preferences

Future learner-level SRS would add per-card outcomes, due dates, and review
queues. That is intentionally outside the current curriculum-level spacing
system.

## Design Feel

Kotoba is focused and immersive:

- sentence first
- fast card movement
- visible but unobtrusive controls
- strong readability for Japanese text
- easy inspection of word-level explanations

The app is a practice instrument, not a marketing site.
