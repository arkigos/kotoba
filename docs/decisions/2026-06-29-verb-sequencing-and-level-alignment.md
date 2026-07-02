# Verb Sequencing And Level Alignment

## Status

Accepted.

Superseded in part by `2026-07-01-a1-every-unit-verb-lane.md`: A1 now requires
a small verb/existence lane in every unit, including early Unit 1 action
previews.

## Context

The authored A1 units lean heavily on `です` while they teach identity,
questions, adjectives, and static description. That can make the opening feel
less alive. Adding a full verb system to Unit 1 would be too much, but waiting
until Unit 21 for any action predicate makes early Japanese feel like labeling
instead of doing.

Kotoba uses CEFR-inspired / JF-aligned level labels as learner-facing signposts,
not official certification claims. The useful test is whether the unit sequence
supports the intended Can-do shape for each level.

## Decision

Keep Unit 1 simple and do not add productive action verbs there as a cosmetic
fix. Add a small fixed-action preview lane after Unit 1: Units 2-14 may include
one or two modular `Vます` cards that use familiar people, things, places, and
descriptors. A1 should still move from identity and description into existence,
location, time, and counting. A2 should carry the formal everyday action load
through polite verbs, objects, destinations, time, frequency, wants, requests,
permission, te-form, and ongoing/resulting state.

Preview cards are whole-sentence exposure, not full verb lessons. Keep the frame
stable and swap only the useful noun, person, place, adjective, or verb slot.

Use `npm run audit:level-alignment` to inspect authored level bands for verb
distribution, `です` reliance, existence practice, and form sequencing.

## Consequences

- Early A1 remains intentionally `です`-heavy, but learners see a few useful
  polite action sentences before Unit 21.
- Late A1 should feel less static because existence and location patterns enter.
- A2 should remain verb-rich and should not drift back into static vocabulary
  grids unless the unit focus intentionally calls for it.
