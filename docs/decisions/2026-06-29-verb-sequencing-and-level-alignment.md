# Verb Sequencing And Level Alignment

## Status

Accepted.

## Context

The authored A1 units lean heavily on `です` while they teach identity,
questions, adjectives, and static description. That can make the opening feel
less alive, but adding productive action verbs to Unit 1 would introduce verb
grammar before the learner has the particles and sentence frames needed to use
it well.

Kotoba uses CEFR-inspired / JF-aligned level labels as learner-facing signposts,
not official certification claims. The useful test is whether the unit sequence
supports the intended Can-do shape for each level.

## Decision

Keep Unit 1 simple and do not add productive action verbs there as a cosmetic
fix. A1 should move from identity and description into existence, location,
time, and counting. A2 should carry the productive everyday action load through
polite verbs, objects, destinations, time, frequency, wants, requests,
permission, te-form, and ongoing/resulting state.

Use `npm run audit:level-alignment` to inspect authored level bands for verb
distribution, `です` reliance, existence practice, and form sequencing.

## Consequences

- Early A1 may remain intentionally `です`-heavy.
- Late A1 should feel less static because existence and location patterns enter.
- A2 should remain verb-rich and should not drift back into static vocabulary
  grids unless the unit focus intentionally calls for it.
