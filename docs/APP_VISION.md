# App Vision

Current direction: [independent A1 tracks](decisions/2026-10-01-independent-a1-tracks.md) and
[independent A2 tracks](decisions/2026-10-01-independent-a2-tracks.md). Shared starters
lead to A1 tracks; completed A1 opens all five A2 tracks. Frozen authored lessons
and review stay local to each track. Completing A2 opens eight
[independent B1 tracks](decisions/2026-10-01-independent-b1-tracks.md).
Older procedural/custom rules below are historical.

## September 2026 direction

The visual identity draws from Japanese ink and Edo-inspired prints: warm washi,
deep indigo, charcoal, and restrained dark vermilion. Light and dark themes use
separate paper artwork. Keep headers and actions high contrast, with ivory on
dark pigment; avoid rainbow pastel categories. Ink marks belong around quiet
reading surfaces. Activities remains the loose guide for compact visual cards.
See `docs/decisions/2026-09-13-japanese-ink-themes.md` for assets and theme tokens.

The Next learner centers on **Home → Learn → practice**. Home has one prominent
next action: resume the current unfinished lesson, resume an unfinished saved
lesson, or choose a topic. Actual A1 coverage, a small practice-week display, and
compact Activities/My lessons shortcuts support that action. Review appears only
when due or prioritized words are available; there is no empty-dashboard task list.

Learn combines Topics and Custom in one place. Topics select from overlapping A1
pools. Custom starts with up to twelve Priority words, or an empty selection, and
accepts 1–30 explicitly chosen words from the full dictionary. It recommends a
size from actual appearances, reuses reviewed contexts, and keeps unsupported
reference words as exact word cards. Names, full previews, saving, and coverage
details sit behind a small options disclosure. The old recipe/template catalog
is absent from the main UI; existing saved generated lessons still replay.

Progress holds A1 practical milestones, detailed coverage, and personal goals.
My lessons holds saved and recent practice, with resume and bookmark visible and
less frequent management actions in a menu. Topic and custom lesson launches
save exact snapshots automatically. The implementation and compatibility policy
are in `docs/decisions/2026-09-13-focused-home-and-learn.md`.

Japanese word lookup now has a comprehensive JMdict reference layer. The course
remains curated and levelled; imported words do not become lesson content merely
because they exist in the dictionary. Lessons, Dictionary, and pronunciation share
canonical entry references and immutable recordings. See
`docs/decisions/2026-09-12-canonical-dictionary.md` for word ownership and audio.

The reviewed procedural grammar/sequence engine remains available for compatible
generated lessons and future authoring. Its recipes declare vocabulary, grammar,
and pacing; they are no longer the learner's required starting point. Generated practice
uses reusable word recordings, sequenced for full-sentence playback when a sentence
recording is unavailable. Every lesson also has a bilingual sentence explorer with
direct start-at-sentence navigation. See
`docs/decisions/2026-09-12-procedural-lessons.md` for the accepted direction and
migration boundaries. The frozen-unit descriptions below remain content-authoring
and reference-player contracts; they do not define the primary topic/custom journey.

Words have authored progression placement, automatic review timing from actual
practice, and one learner preference: Prioritize. Lessons carry a JF/CEFR-inspired
complexity ceiling, and review additions must obey the lesson's available grammar
and exposure requirements. Dictionary exposes due/recent practice suggestions;
its New lesson action carries the complete selected pool into Custom. Reviewed
procedural generation continues to enforce its own narrower compatibility rules.
See `docs/decisions/2026-09-12-word-review-and-levels.md` for the implemented policy.

Kotoba is a curriculum-driven practice app for learning Japanese through
repeated, naturalistic exposure in manageable lessons.

The app moves learners through a carefully controlled stream of sentences. Each
new word and grammar pattern appears inside a living sentence world, then gets
recombined through small modular changes until it feels familiar in context.

## Core Experience

A learner chooses or resumes a lesson and practices short cards.

Each card presents:

- a Japanese sentence or phrase
- aligned reading/pronunciation hints
- aligned word-part explanations
- English meaning
- audio when available

The learner repeatedly sees small modular changes:

- one word changes while the sentence mold stays familiar
- one grammar structure appears after the words are familiar
- older words return naturally inside new sentence contexts
- sentence length and complexity grow gradually

The product makes repetition feel fluent, not mechanical.

## Curriculum Shape

Frozen authored units provide the reviewed example corpus and remain accessible
through existing lesson links. The current A1 learner path uses overlapping topics
and a bounded core rather than requiring a long fixed unit list.

The planned Japanese path is CEFR-inspired / JF-aligned from A1 through B2, but
it is not an official certification claim. Levels are defined by practical
Can-do outcomes and supported by grammar sequencing.

A short pre-A1 Kana level can precede the core path. These recognition units
teach hiragana, katakana, and a small set of common kanji symbols without
counting against the 96-unit A1-B2 grammar map.

Each standard unit has:

- one grammar focus
- 10 new words selected to support that grammar focus
- 80-100 cards for rebuilt standard units, with crowded-review units allowed up
  to 115 when every extra card is doing real SRS work

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

- choose a topic or custom word pool, then start or resume its saved lesson
- drill cards
- reveal/toggle meaning and explanations
- switch the main card display between Japanese and English
- play/replay audio when available
- advance, backtrack, choose sequential or random order, or continue

Supporting modes:

- Home's single next action
- Learn's Topics and Custom tabs
- full Dictionary lookup, Priority, and My words
- My lessons for exact saved/recent practice
- Activities and illustrated kanji study
- Progress for A1 milestones and personal goals
- frozen sentence reference and existing unit deep links
- audio generation workflow
- local progress tracking

The practice player also has lightweight presets over the same settings:

- Reading: Japanese shown by default with audio.
- Listening: audio-first with text hidden until the learner switches the card display.
- Recall: English shown by default.
- Rapid: compact Japanese-first review with auto advance.

## Progress Model

The curriculum itself provides spacing through the word-bin rule.

Learner progress stores:

- current unit
- current card
- completed units
- display preferences

These frozen-unit fields coexist with the Next learner's actual card encounters,
word review schedule, shared A1 concept history, saved snapshots, and daily
practice. Curriculum spacing and learner practice records remain distinct.

## Design Feel

Kotoba is focused and immersive:

- sentence first
- fast card movement
- visible but unobtrusive controls
- strong readability for Japanese text
- easy inspection of word-level explanations

Use Activities as a loose visual guide across destinations: softly tinted cards,
simple illustrations and icons, readable type, and space around the next action.
Reduce simultaneous controls and repeated prose. A disclosure should reveal
useful detail, not hide a required step. Icons retain accessible action names;
color and decorative artwork never carry the only meaning.

The app is a practice instrument, not a marketing site.

## Product Voice and Evidence

Learner-facing copy should name the action, content, or recorded result directly.
Use short labels such as Start lesson, Saved sentences, and Prioritize. Avoid
motivational slogans, unsolicited reassurance, artificial familiarity, and
claims about how the learner feels or what their brain is doing.

Show only implemented features and statistics supported by saved data. Course
exposure is not mastery; due status is a practice recommendation. Do not fabricate
due counts, skill percentages, activity intensity, or progress for an empty
profile. New profiles start empty in development as well as production. Sample
data belongs in explicit test fixtures, not the normal app initialization path.

Preserve existing saved profiles when removing preview behavior. Do not silently
erase mixed sample and user history. Hide unfinished actions until they work,
including placeholder notifications, dialogue links, downloads, and reports.
