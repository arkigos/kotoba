# Kotoba Word Selection Rules

This file guides Codex when choosing the 10 new words for a Japanese curriculum
unit. It is authoring guidance, not app-consumed data.

## Core Rule

Each unit introduces:

- one new grammar concept or tightly bundled grammar focus
- 10 new words selected to support that grammar concept

The new words must work well together in many short, natural sentences. They
should not be a random theme list, and they should not duplicate words already
introduced in earlier units.

Unit vocabulary belongs in the source curriculum model, not hidden inside a card
as a grammar preview. If a learner-facing word appears in a card, it must either
already be known, be part of the current unit's `newWords`, or be due review
from an earlier source unit.

## Selection Process

Before choosing words for unit `N`:

1. Read the grammar focus for unit `N`.
2. Read previous unit word lists, especially all earlier units, to avoid
   introducing duplicates.
3. Compute the review-due bins for unit `N`: words from units `N`, `N-2`,
   `N-4`, `N-8`, `N-16`, `N-32`, and so on.
4. Treat all previously introduced words as available helper vocabulary, while
   strongly prioritizing current-unit words and review-due words.
5. Choose 10 new words that pair naturally with the grammar focus and with the
   known helper words.
5. Prefer words that can appear in multiple sentence molds, not words that only
   work in one example.
6. Prefer common, concrete, reusable words unless the grammar concept requires
   a more specific word.

## Default Functional Mix

Use this as the default distribution for 10 new words:

- 3 nouns
- 2 verbs
- 2 adjectives or adjectival nouns
- 1 adverb, time word, location word, or quantity word
- 1 pronoun, person word, social role, or relational word
- 1 flexible slot chosen for the grammar concept

The flexible slot may be another noun, verb, adjective, time word, counter,
place word, phrase, or grammar-supporting expression.

This default mix applies once productive verb grammar is available. Early A1 is
allowed to be intentionally static while the learner is still getting identity,
topic marking, questions, adjectives, and existence. Do not add action verbs to
Unit 1 just to satisfy a mix target; introduce productive verbs where the grammar
map can support real use.

Early A1 may include one or two fixed `Vます` action-preview cards per unit after
Unit 1. These are whole-sentence previews, not full verb lessons. Keep them
modular: one stable frame, one swapped noun/person/place/adjective slot, and one
familiar high-value verb.

## Grammar-Driven Adjustments

The default mix is not sacred. Adjust it when the grammar concept demands a
different distribution.

For object/action grammar such as `NをVます`:

- use more concrete nouns and transitive verbs
- example mix: 4 nouns, 4 verbs, 1 adjective, 1 adverb/time/place word

For existence/location grammar such as `場所にNがあります`:

- use more place words, concrete nouns, and location nouns
- example mix: 4 nouns, 3 places/location words, 1 verb, 1 adjective, 1 flexible

For adjective grammar:

- use more adjectives and concrete nouns they naturally describe
- example mix: 4 adjectives, 4 nouns, 1 adverb, 1 flexible

For preference/want grammar such as `Nが好きです` or `Vたいです`:

- use desirable nouns, common activities, and useful opinion words
- example mix: 4 nouns, 3 verbs/activity words, 2 adjectives, 1 flexible

For request/permission/prohibition grammar:

- use action verbs that make natural requests and prohibitions
- example mix: 5 verbs, 2 nouns, 1 place word, 1 time/adverb word, 1 flexible

For conditionals, reasons, and clause-linking grammar:

- use words that create cause/effect, contrast, time sequence, or choice
- example mix: 3 verbs, 3 adjectives, 2 nouns, 1 time/adverb word, 1 flexible

For keigo/formality grammar:

- use social roles, service contexts, movement/eating/speaking verbs, and
  polite set expressions
- example mix: 3 social-role/person words, 3 verbs, 2 nouns, 2 set expressions

## Word Compatibility Rules

The 10 new words should form a small sentence ecosystem.

Good word sets allow many combinations:

- noun + adjective: `大きい家`, `静かな店`
- noun + verb object: `水を飲みます`, `本を読みます`
- person + action: `先生が来ます`, `友達と行きます`
- place + action: `学校で勉強します`, `店で買います`
- time/adverb + action: `毎日行きます`, `よく飲みます`

Avoid word sets where each word only supports one isolated sentence.

## Exclusion Rules

Do not introduce a word if it has already been introduced in any earlier unit.

Before finalizing a unit, scan earlier units for:

- same kanji/kana surface form
- same reading with the same meaning
- obvious spelling variants
- loanword/kana variants
- inflected forms of an already introduced lemma

If a word is needed again, use it as known helper vocabulary; do not list it as
new.

## Function Word Rule

Particles, copulas, inflection endings, and grammar markers are grammar, not new
vocabulary words.

Examples that should usually count as grammar rather than new words:

- `は`
- `が`
- `を`
- `に`
- `で`
- `です`
- `ます`
- `て`
- `ない`

Set phrases may count as words when they are taught as usable lexical chunks:

- `お願いします`
- `すみません`
- `ありがとう`
- `大丈夫`

## Quality Checklist

Before authoring cards for a unit, confirm:

- The unit has one grammar focus.
- The unit has 10 new words.
- The words are not duplicates of earlier unit words.
- The words fit the grammar focus.
- The words work together in many modular sentence substitutions.
- The set has a useful spread of nouns, verbs, descriptors, and support words.
- Older known helper words can combine naturally with the new words.
- Current-unit and review-due words have enough repetition to feel intentionally drilled.
- The set is common and useful enough for a beginner-to-intermediate journey.
- Current-unit words are introduced before card 40.
- New grammar and due SRS returns appear before card 60.
- Late cards mix known material rather than introducing new learner-facing words
  or grammar.
