# Rebuild Foundation Units 1-5

Completed: 2026-06-29

## Summary

Rebuilt Units 1-5 from a deterministic generator so the foundation band follows
the new source-model workflow and pacing contract.

## Shipped

- Added `scripts/rebuild-foundation-units.mjs`.
- Regenerated Units 1-5 to 80 cards each.
- Removed hidden `Vます` action previews from Units 1-5.
- Split `です` + `か` in foundation questions.
- Kept `ではありません`, `じゃありません`, and `ではありませんでした` as early
  set-phrase chunks with clearer negative-identity glosses.
- Synced Unit 1-5 audio manifests.
- Updated tests and docs for foundation tokenization.

## Notes

The existing pacing debt now starts at Unit 6. Units 6-14 still carry old action
preview behavior until the next rebuild band.
