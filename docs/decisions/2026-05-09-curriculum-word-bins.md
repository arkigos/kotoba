# Curriculum Word Bins

Date: 2026-05-09

## Context

Kotoba is moving toward frozen, long-form sentence-drilling units. The goal is to make learning feel naturalistic and repetitive without turning vocabulary into isolated flashcards.

## Decision

Vocabulary availability is determined by a simple relative unit rule.

Each standard unit introduces one grammar focus and 10 new words. The new words
support that grammar focus, work together in modular sentence drilling, and
avoid duplicates from earlier units.

For unit `N`, the review-due word bin contains words introduced in:

```text
N
N-2
N-4
N-8
N-16
N-32
...
```

Only positive unit numbers that exist are included.

Later revision: this bin is a minimum return schedule, not a hard vocabulary
wall. Once a word has been introduced, it is available as helper vocabulary in
later units when it makes a sentence clearer or more natural. Current-unit words
and review-due words should still dominate the authored cards.

This is not a separate review system. Older words are simply part of the sentence palette available to the unit.

Grammar is cumulative. A unit uses all grammar introduced up through that unit, and its new grammar focus appears late, after new vocabulary has been introduced through older grammar.

## Consequences

- Units can be authored ahead of time with deterministic vocabulary constraints.
- Lesson boundaries become blurry because older words return as natural sentence material.
- The app does not need learner-specific SRS to get curriculum-level spacing.
- Future validators can check a unit's word sources against the bin rule.
