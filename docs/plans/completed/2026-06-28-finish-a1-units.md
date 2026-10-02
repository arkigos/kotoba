# Finish A1 Units

Date: 2026-06-28

Status: Historical. This completed the first 20-unit A1 pass. Current A1 was
later rebuilt as a 49-unit Marugoto Starter-inspired level.

## Goal

Author the remaining A1 units from the CEFR-inspired 96-unit map:

- Unit 8 through Unit 20
- 10 new words per unit
- 80-150 cards per unit
- asset manifests
- app/test wiring for the authored-unit index

## Outcome

Completed. At the time, Kotoba had authored Units 1-20, covering the first A1:
Survival Foundations level. This was later superseded by the 49-unit Marugoto
Starter A1 rebuild.

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
