# Simple word review and lesson levels

Status: complete. Implemented and verified in Kotoba Next.

The learner controls only whether a word is prioritized. Curriculum placement
is authored metadata; review eligibility comes from recorded practice recency.
Preserve old profiles/ratings as history, without retaining a multi-rating UI.

- [x] Add deterministic word-based review timing and session-level practice
  tracking. Count spaced occasions separately from adjacent card encounters.
- [x] Replace word rating controls with one priority toggle; expose due and
  prioritized words in Library and keep suggestions understandable.
- [x] Add optional, bounded review additions to the procedural builder. Respect
  selected grammar/level, preserve core targets, explain excluded/deferred words,
  and retain the exact pool and reasons in saved snapshots.
- [x] Add authored JF/CEFR-inspired placement and level policies to generation.
  Reject unclassified/out-of-level input and enforce available constructions and
  sentence bounds. Do not imply that higher-level grammar is already implemented.
- [x] Expose curriculum vocabulary placement without claiming the 825-entry
  curriculum lexicon is a comprehensive dictionary or certifying CEFR levels.
- [x] Verify scheduling, old profile compatibility, generation boundaries,
  UI flows, saved snapshots, and desktop/mobile layouts; update durable docs.

Keep known-word practice local and word-based across course/generated sessions.
New review occasions require a new session and elapsed time; inspecting/saving
a word cannot indefinitely postpone its review. Calendar and practice-session
spacing are recommendations, not estimates of tested mastery.

The broader dictionary remains a separate reference-data layer. Only senses with
reviewed generation metadata may enter generated sentences. This pass establishes
that boundary and progression metadata rather than importing an unchecked corpus.

## Verification evidence

- `npm run test`: 163 tests passed across 11 files.
- `npm run next:test`: 55 tests passed after final UI copy changes.
- `npm run build` and `npm run next:build`: passed.
- `npm run test:e2e`: end-to-end practice-flow check passed.
- `npm run validate:curriculum`: passed.
- `npm run audit:curriculum-pacing`: passed with the existing 300 frozen-content
  warnings; this change does not rewrite those units.
- `npm run audit:level-alignment`: passed with the existing late-A1
  existence/location distribution warning.
- Browser QA on isolated port 4177: selected A2, added 学生 as a target, launched
  the exact preview, prioritized 学生, practiced a card, reloaded and resumed on
  card 2 with the same level/content. Library retained the priority and practice
  timing. A subsequent builder run admitted 学生 automatically with the reason
  "You prioritized this word" and four-appearance minimum. Toggling review
  additions regenerated the preview as expected. No browser console errors.
- Desktop and 390×844 phone layouts inspected, including Library priority cards
  and builder additions. No horizontal document overflow. Final desktop evidence:
  `docs/reviews/procedural/word-review-builder-desktop.png` (ignored QA output).

Durable policy: `docs/decisions/2026-09-12-word-review-and-levels.md`.

The existing 4176 preview needed a server restart to discard a stale external
engine-module cache. After restart and reload, its builder displayed the new
level controls and review additions from the preserved profile. The isolated
4177 QA server was stopped after testing; 4176 remains available for the owner.
