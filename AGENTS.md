# Kotoba Agent Guide

Use this file as the map, not the manual. Start here, then open the referenced docs that match the task.

## First Stops

- Project shape and goals: `docs/PROJECT.md`
- Product vision: `docs/APP_VISION.md`
- Greenfield rebuild guide: `docs/CODEX_BUILD_GUIDE.md`
- Architecture and file ownership: `docs/ARCHITECTURE.md`
- Lesson and curriculum data contracts: `docs/DATA_CONTRACTS.md`
- Verification expectations: `docs/QUALITY.md`
- Rebuild acceptance tests: `docs/ACCEPTANCE_TESTS.md`
- Offline image/audio pipeline: `docs/ASSET_PIPELINE.md`
- Active multi-step work: `docs/plans/active/`
- Completed plans and decisions: `docs/plans/completed/`, `docs/decisions/`

## Working Norms

- The Create React App plus Express prototype is archived under `archive/prototype-cra-express-2026-06-27/`.
- The active app is Vite, React, and TypeScript.
- Treat curriculum data as product content, not throwaway fixtures. Preserve IDs, unit ordering, and field shapes.
- Prefer updating the relevant doc when a new durable rule, convention, or product decision appears.
- For small edits, a short in-chat plan is enough. For multi-file or multi-session work, create a plan in `docs/plans/active/`.
- Codex authors and validates frozen curriculum units during development. Use `data/jp/curriculum/grammar_by_unit.md` and `data/jp/curriculum/word_selection_rules.md`.

## Common Commands

- Dev server: `npm run dev`
- Build app: `npm run build`
- Run tests: `npm run test`
- Run practice-flow checks: `npm run test:e2e`
- Validate curriculum: `npm run validate:curriculum`
- Sync asset manifests/placeholders: `npm run assets:sync`
- Validate assets: `npm run validate:assets`
- Validate curriculum and assets: `npm run validate:all`

## Repo Map

- `src/`: Vite React TypeScript practice app.
- `data/`: checked-in language and curriculum data consumed by the app.
- `scripts/`: validation and authoring scripts.
- `tests/`: app, curriculum, and practice-flow checks.
- `docs/`: product, architecture, rebuild, quality, and decision docs.
- `archive/`: old prototype source and build output.
