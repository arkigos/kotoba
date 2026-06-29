# Finish A1 Units

Date: 2026-06-28

## Goal

Author the remaining A1 units from the CEFR-inspired 96-unit map:

- Unit 8 through Unit 20
- 10 new words per unit
- 80-150 cards per unit
- asset manifests and placeholder images
- app/test wiring for the authored-unit index

## Outcome

Completed. Kotoba now has authored Units 1-20, covering the full A1: Survival
Foundations level.

## Verification

- `npm run validate:curriculum`
- `npm run lint:unit-content`
- `npm run validate:assets`
- `npm run test -- --run`
- `npm run build`

## Follow-Up

The production bundle grew because all authored unit JSON is statically imported.
Future work should lazy-load unit JSON by selected unit id before authoring many
more units.
