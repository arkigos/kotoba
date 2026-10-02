# Kotoba Agent Guide

Current direction: [independent A1 tracks](docs/decisions/2026-10-01-independent-a1-tracks.md) and
[independent A2 tracks](docs/decisions/2026-10-01-independent-a2-tracks.md). New learning uses frozen,
authored lessons. Shared starters precede A1; completed A1 opens every A2 track.
Completing A2 opens eight [independent B1 tracks](docs/decisions/2026-10-01-independent-b1-tracks.md).
Lessons and review stay local to each track. This supersedes the older linear A1–B1 and
procedural topic/custom completion rules below.

Use this file as the map, not the manual. Start here, then open the referenced docs that match the task.

## First Stops

- Project shape and goals: `docs/PROJECT.md`
- Product vision: `docs/APP_VISION.md`
- Greenfield rebuild guide: `docs/CODEX_BUILD_GUIDE.md`
- Architecture and file ownership: `docs/ARCHITECTURE.md`
- Current unique-sentence/card-SRS rules: `docs/decisions/2026-09-21-unique-sentences-and-card-review.md`
- Procedural lesson/review direction: `docs/decisions/2026-09-12-procedural-lessons.md`
- Shared word source and dictionary audio: `docs/decisions/2026-09-12-canonical-dictionary.md`
- Topic-driven A1 core and can-do completion: `docs/decisions/2026-09-13-topic-driven-a1.md`
- Lesson and curriculum data contracts: `docs/DATA_CONTRACTS.md`
- Verification expectations: `docs/QUALITY.md`
- Rebuild acceptance tests: `docs/ACCEPTANCE_TESTS.md`
- Offline asset/audio pipeline: `docs/ASSET_PIPELINE.md`
- Active multi-step work: `docs/plans/active/`
- Completed plans and decisions: `docs/plans/completed/`, `docs/decisions/`

## Working Norms

- The Create React App plus Express prototype is archived under `archive/prototype-cra-express-2026-06-27/`.
- The active app is Vite, React, and TypeScript.
- Treat curriculum data as product content, not throwaway fixtures. Preserve IDs, unit ordering, and field shapes.
- Preserve sustained practice flow: long, coherent runs of distinct sentences are welcome. Do not shorten lessons merely because they use controlled substitutions. Starters establish grammar, helpers and some vocabulary; they do not each need a communicative task or consolidation checkpoint. Follow the September 30 clarification in the A1 scope/pacing decision.
- Personalized lessons may use only selected targets and words with actual practice history, plus explicitly authored function forms. Required new words must be selected as lesson targets; never silently add unfamiliar helpers. Fix demonstrated lesson-quality defects and verify the result instead of stopping at recommendations.
- Prefer updating the relevant doc when a new durable rule, convention, or product decision appears.
- Word identity and placement belong to `data/jp/dictionary/` and its shared resolver. Keep existing learning IDs; never substitute lemma audio for an inflected token or infer generation eligibility from imported POS alone. Use the dictionary audio command for new word recordings so clips and paid requests are deduplicated.
- For small edits, a short in-chat plan is enough. For multi-file or multi-session work, create a plan in `docs/plans/active/`.
- Codex authors and validates curriculum during development. New lessons use frozen curated cards. A1 tracks are independent after shared starters; A2 and B1 tracks open after completing all lower levels. Additional grammar has one owning track within its level and may not appear in sibling tracks; completed lower-level grammar is shared. Follow `docs/decisions/2026-09-26-a1-scope-and-pacing.md` for the A1 boundary. Procedural files describe historical behavior, not the current learning path.

## Common Commands

- Dev server: `npm run dev`
- Build app: `npm run build`
- Run tests: `npm run test`
- Run practice-flow checks: `npm run test:e2e`
- Validate curriculum: `npm run validate:curriculum`
- Sync asset manifests: `npm run assets:sync`
- Validate assets: `npm run validate:assets`
- Validate curriculum and assets: `npm run validate:all`
- Sync runtime vocabulary lexicon: `npm run curriculum:sync-runtime-lexicon`
- Preview procedural lessons: `npm run lessons:preview`
- Rebuild dictionary bindings: `npm run dictionary:bind`
- Reuse/generate dictionary audio: `npm run dictionary:audio -- --dry-run`

## Repo Map

- `src/`: Vite React TypeScript practice app.
- `packages/learning-engine/`: initial shared procedural grammar and lesson engine.
- `data/`: checked-in language and curriculum data consumed by the app.
- `scripts/`: validation and authoring scripts.
- `tests/`: app, curriculum, and practice-flow checks.
- `docs/`: product, architecture, rebuild, quality, and decision docs.
- `archive/`: old prototype source and build output.
