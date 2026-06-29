# Curriculum Model And Pacing Contract

Completed: 2026-06-29

## Summary

Added the first curriculum model layer so frozen unit JSON is no longer the only
source of truth. Unit metadata and vocabulary now live in
`data/jp/curriculum/source/unit_specs.json`, pacing rules live in
`data/jp/curriculum/source/pacing.json`, and authoring scripts can compute
current/review/helper pools from that model.

## Shipped

- Source unit specs for all currently authored units.
- Pacing bands and first-exposure cutoffs.
- Shared Node model utilities.
- Source consistency audit included in `validate:all`.
- Advisory pacing audit for existing rebuild debt.
- Card candidate generator for unit/card-position experiments.
- Draft unit generator for model-driven rebuild experiments.
- Tests and docs for the source/generated boundary.

## Notes

The pacing audit is advisory for now because the existing frozen units have
known first-exposure debt. Once regenerated units follow the pacing contract,
`audit:curriculum-pacing:strict` can become part of the hard validation path.
