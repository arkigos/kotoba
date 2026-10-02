# Repo Surface Consolidation

Completed: 2026-07-17

## Goal

Make the active project surface match the current Marugoto Starter A1 app and
curriculum in one intentional pass.

## Changes

- Moved finished active plans into `docs/plans/completed/`.
- Repointed `npm run curriculum:rebuild-a1` to the current Marugoto Starter A1
  rebuild wrapper.
- Archived pre-Marugoto A1/foundation generation scripts under
  `archive/pre-marugoto-a1-generation-2026-07-17/`.
- Archived the old root Cloudflare Pages config under
  `archive/cloudflare-pages-config-2026-07-17/`; GitHub Pages is the active
  static deploy path.
- Added a generated browser runtime lexicon so the app no longer imports the
  authoring source model directly.
- Ignored generated Codex/Vite logs and generated semantic review packets.
- Labeled historical decisions and plans whose unit ranges were superseded.
- Cleaned stale test imports and acceptance-test wording.

## Current Operating Rule

Use source-model scripts for authoring, frozen unit JSON plus generated runtime
JSON for the app, and `npm run curriculum:rebuild-a1` for the active A1 rebuild.
