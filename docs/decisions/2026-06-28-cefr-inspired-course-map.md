# CEFR-Inspired Course Map

Date: 2026-06-28

## Context

Kotoba needs a learner-facing course shape that feels coherent at full size. The
previous grammar map was a long internal spine, but it did not explain how the
course should be presented as levels.

The JF Standard uses CEFR-style levels through Can-do statements: levels are
about what learners can do with language, not a direct claim that a grammar list
equals a certified level.

## Decision

Kotoba uses a CEFR-inspired, JF-aligned four-level path:

- A1: Survival Foundations, units 001-020
- A2: Everyday Control, units 021-044
- B1: Connected Japanese, units 045-072
- B2: Flexible Social Japanese, units 073-096

These are learner-facing signposts and planning boundaries. They are not an
official certification claim.

The canonical planned map is `data/jp/curriculum/grammar_by_unit.md`. The active
authored-unit index remains limited to units that have actual JSON files. The
previous 136-unit map remains available as archived reference material under
`archive/prototype-cra-express-2026-06-27/server/data/jp/curriculum/grammar_by_unit.md`.

## Consequences

- New units should be authored against Can-do outcomes first, with grammar and
  vocabulary chosen to support those outcomes.
- Validators can check level ranges and authored-unit placement without requiring
  all 96 planned units to exist.
- Future UI work can group authored units by level, but locked or planned future
  units need a separate design pass.
