# A1 Rebuild Rules Pass

Status: Historical. The command name `npm run curriculum:rebuild-a1` remains
current, but it now points at the Marugoto Starter A1 rebuild path rather than
the earlier 1-20 A1 generation pipeline.

## Goal

Regenerate the full A1 band with the current curriculum rules:

- Unit 1 stays on vocab atoms, `です`, `か`, and simple `AはBです` previews.
- `と` enters through fuller topic-comment pair frames, not bare pronoun fragments.
- Productive question particles remain visible as separate tokens.
- Legacy learner-facing names stay out of cards after the Unit 1 pronoun recast.
- A1 card output remains source/generated, not one-off JSON surgery.

## Scope

- Tighten A1 authoring scripts.
- Add one rebuild command for the whole A1 band.
- Regenerate A1 units and manifests.
- Add tests/audits for the new invariants.
- Run validation, tests, and build.

## Result

Completed. A1 now rebuilds through `npm run curriculum:rebuild-a1`, with a
post-generation enforcement pass for visible question markers, early current
vocabulary, early due-review vocabulary, and pre-60 grammar/previews.
