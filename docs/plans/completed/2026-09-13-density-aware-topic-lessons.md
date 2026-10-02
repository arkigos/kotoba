# Shorter topic lessons with controlled progression

Correct the assumption that eight target appearances require eight cards per
target. Multiple targets on a sentence contribute to coverage together.

- Aim near 48 cards for 12 targets, deriving the actual recommendation from
  available target co-occurrence and achievable coverage.
- Keep an eight-appearance default goal and a six-appearance floor for shortened
  custom lessons. Count each selected target once per card, including aliases.
- Prefer one authored word change between neighboring cards, allow two when
  needed, and make genuine phrase/grammar practice boundaries explicit.
- Plan reasonable distribution across the whole lesson, allowing a word to remain
  in several neighboring sentences instead of forcing every count equal always.
- Preserve exact custom count when feasible, with clear coverage diagnostics when
  it is not; avoid arbitrary density assumptions or silently missing targets.
- Keep existing saved snapshots and card-exposure tracking intact.

Status: complete.

Implemented connected automatic target selection, a shared helper allowance,
actual appearance-based sizing, bounded custom-count coverage recovery, and
one/two-word progression with visible phrase/pattern boundaries. Final ordering
preserves exact coverage and gives words later revisits instead of one isolated
burst. Existing saved sessions keep their exact snapshots and exposure history.

Verification:

- Root suite: 375 tests in 41 files pass.
- Dedicated learner suite: 232 tests in 30 files pass.
- Root and learner production builds pass; existing large-chunk and Unit 103
  mixed-import warnings remain.
- Practice-flow end-to-end check passes.
- All initial 12-word topics give every target at least eight appearances and
  at least one reviewed context. Most use 48–65 cards; culture requires 96
  because these targets do not co-occur. Every initial target's first-to-last
  appearance spans at least a quarter of its lesson.
- Full core/extra batches, exact manual selections, alias-aware exposure counts,
  Priority, and old session compatibility pass. All 450 core concepts remain
  reachable (46 successive topic lessons introduce the core in the audit).
- 150 saved lessons round-trip exactly in 3,771,256 UTF-16 storage bytes, below
  5 MiB. Planned counts remain separate from real card encounters and spaced
  learning credit.
- Desktop and phone preview verified, including count edits, recommended sizing,
  actual word coverage, and boundary cues. No horizontal overflow at phone width.

See `docs/decisions/2026-09-13-density-aware-topic-lessons.md` and
`docs/decisions/2026-09-13-connected-topic-selections.md` for the durable rules.
