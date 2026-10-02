# Practice continuity and sentence quality

User-directed product pass: make actual practice easy to resume, show useful activity, remove decorative copy and misleading controls, and improve sentence/audio quality.

- [x] Schedule word audio with shorter, natural pauses and synchronized highlighting.
- [x] Audit procedural and frozen sentence semantics; constrain incompatible word combinations and document generation honestly.
- [x] Make builder templates/level availability explicit, add card counts, improve word filters and plain labels.
- [x] Preserve multiple built/review sessions and their exact cards; provide saved and recent lessons with resume/replay.
- [x] Rebuild Today around actual practice counts, recent sessions, and review sets.
- [x] Move settings to a dedicated destination; remove meaningless profile editing and Library grammar facade.
- [x] Make saved sentence utility explicit and clean up remaining interface copy.
- [x] Run focused tests and production build, fix integration issues, document durable behavior.

Keep Course lessons curated and frozen. Review additions belong to procedural lessons and review sessions, prominently accessible from Today. Preserve existing progress and content IDs. Existing checkout changes are retained.


## Outcome

- Implemented scheduled, trimmed exact-word playback; full cancellation and highlighting retained.
- Saved and recent lessons preserve exact generated/saved-sentence materialization and cursors; builder previews can be named/saved before starting.
- Today shows actual practice counts, prominent review sets, recent work, and activity. Settings is separate; Library Grammar/name-edit artifacts are gone.
- Builder has actual-level Templates, exact 6–120 card counts, and direct grammar/word controls. Library supports metadata filters and consistent Prioritize controls.
- Saved sentences form independent review decks. Cross-unit reviews cover selected words and deduplicate bilingual sentences; quick procedural reviews disclose omitted targets.
- Added explicit semantic compatibility rules; repaired 420 frozen cards with stable IDs/positions, contextualizing 149 fragments and preserving curriculum introduction/uniqueness invariants.

## Verification

- Full `npm run test`: 242 passed, including practice-flow, session continuity, audio, builder, curriculum, and semantic regressions.
- Production builds passed for both active Next and original app. Existing large-chunk advisories remain.
- Curriculum and asset validation passed; repaired manifests synchronized.
- Level alignment passed. Pacing audit reports existing broader authoring debt (300 warnings), rather than pretending those constraints are universally resolved.
- Procedural naturalness audit: 96 sessions / 2,340 cards across eight templates.
- Browser checked save-before-start, exact resume, actual daily counts, desktop/phone layout; phone has no horizontal overflow. QA used localhost, separate from the user's 127.0.0.1 profile.

## Limits carried forward

All current runtime constructions remain A1. Higher-level template filters state availability honestly. 125 isolated number/counter/early-time cards remain for a deliberate grammar/pacing revision. Existing saved custom snapshots preserve their prior content. Detailed daily card/word counts begin with this implementation; earlier practice days and progress are retained.

Durable decisions: `docs/decisions/2026-09-13-practice-continuity.md` and `docs/decisions/2026-09-13-sentence-semantic-quality.md`.
