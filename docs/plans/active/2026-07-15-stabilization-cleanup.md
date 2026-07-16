# Stabilization Cleanup

Goal: turn the current large local worktree into a coherent, validated,
deploy-ready state.

## Scope

- Preserve intentional curriculum, app, audio, script, and doc work.
- Remove local run noise from version control consideration.
- Make GitHub Pages/static hosting work for the Vite app.
- Run the repository quality checks and fix actionable failures.
- Leave a clear publish path for friends to try the app.

## Buckets

- Curriculum/content: rebuilt authored units, prelude units, source model,
  level/index docs, and curriculum tests.
- Media/audio: generated public audio files and asset manifests.
- App behavior: vocabulary panel, audio playback, progress tracking, and unit
  navigation.
- Scripts: current validation/authoring scripts; obsolete A2 generator scripts
  removed from the active surface.
- Docs: contracts, quality, asset pipeline, and decisions updated to match the
  new app/content shape.
- Deploy: Vite/GitHub Pages settings and workflow.

## Cleanup Checklist

- [x] Ignore local Vite LAN logs.
- [x] Add static hosting support for GitHub Pages.
- [x] Make audio/media URLs work under a project subpath.
- [x] Run curriculum and asset validation.
- [x] Run tests and build.
- [x] Fix failures that block a clean publish.
- [x] Summarize remaining product/content decisions.

## Results

- Added GitHub Pages workflow and Vite base-path support for `/kotoba/`.
- Normalized browser audio URLs so `/media/...` references work under project
  subpath hosting.
- Fixed test isolation by explicitly cleaning up rendered React trees after
  each test.
- Aligned foundation semantic audit with the deterministic builder for
  grammar-focus SRS verbs.
- Fixed deterministic Unit 4/6 rebuild edge cases, refreshed affected card
  audio, and verified the cleanup suite.

## Verification

- `npm run audit:foundation-semantics`
- `npm run validate:all`
- `npm run test`
- `npm run test:e2e`
- `VITE_BASE_PATH=/kotoba/ npm run build`
