# A1 Every-Unit Verb Lane

## Status

Accepted. Supersedes the early-A1 caution in
`2026-06-29-verb-sequencing-and-level-alignment.md`.

## Context

The first A1 rebuild leaned too hard on identity sentences and negative copula
practice. That made some units feel like long noun-labeling drills, and it left
simple action language feeling artificially delayed.

## Decision

Every A1 unit must include a small verb lane.

- Units 1-7 are the foundation baseline and include a denser block of early
  whole-sentence action cards using real current-unit verb vocabulary. Each of
  these units carries two verb `newWords`, and their `V??` forms keep the same
  `wordId` so review history does not split.
- Units 8-14 include at least two early whole-sentence action bridge cards.
- Units 15-20 may satisfy the lane through the unit grammar itself when it is
  rich in `あります` / `います` existence practice.
- Action cards should be short and modular. They are allowed to preview useful
  forms before a full verb-conjugation unit, but they should not become the main
  grammar payload of a noun, adjective, question, or location unit.

## Consequences

- A1 should feel more alive earlier, with at least a couple of concrete actions
  in every lesson.
- The level-alignment audit should fail if an authored unit loses both action
  cards and existence practice.
- Core verbs now live in A1 `newWords` deliberately. A2 verb units must use
  replacement verb identities rather than reintroducing those same concepts as
  new words.
