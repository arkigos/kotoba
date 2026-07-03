# Quality

Use this as the lightweight verification bar for Kotoba changes.

For the greenfield rebuild, `docs/ACCEPTANCE_TESTS.md` is the stricter source
of truth. This file remains the everyday quality checklist.

## Default Checks

- Run `npm run build` after code changes.
- Run `npm run test` after behavior or validation changes.
- Run `npm run test:e2e` after card-flow, persistence, layout, or navigation changes.
- Run `npm run validate:curriculum` after curriculum data changes.
- Run `npm run audit:level-alignment` after changing authored unit sequencing,
  level ranges, or large vocabulary batches.
- Run `npm run audit:curriculum-pacing` after generator or curriculum pacing
  changes; use `npm run audit:word-distribution:strict` when a rebuilt level
  is expected to satisfy the current-word exposure floor.
- For data-only changes, inspect the edited JSON for valid syntax and aligned arrays.
- When changing UI behavior, exercise unit selection, next, previous, random, replay audio, explanation display, reveal toggles, and display toggles.

## Code Expectations

- Keep components readable and focused.
- Keep app behavior aligned with `docs/APP_VISION.md` and `docs/ARCHITECTURE.md`.
- Avoid hidden data-shape assumptions. When a required field is introduced, document it in `docs/DATA_CONTRACTS.md`.
- Prefer clear error handling for missing files, invalid lesson data, or blocked audio playback.

## Content Expectations

- Lesson item IDs remain stable once referenced by media.
- Lesson order is intentional.
- Target-language text, pronunciation hints, explanations, and translations agree with each other.
- Curriculum planning docs explain sequencing decisions well enough for Codex to continue the work.
- For authored curriculum units, confirm the unit has one grammar focus and 10 new words.
- Check the unit's new words against `data/jp/curriculum/word_selection_rules.md`.
- For authored curriculum units, confirm current words from `N` are drilled and review-due words from `N-2`, `N-4`, `N-8`, `N-16`, `N-32`, and so on return.
- Do not treat older vocabulary bins as isolated review prompts; they should be woven into natural sentence drilling.
- All introduced vocabulary is available as helper vocabulary, but current-unit and review-due words should dominate the unit.
- Current-unit words need enough contact to stick: balanced or regenerated units should give each current word at least 8 card appearances, usually landing in an 8-12 appearance band.
- Review-due words should usually return 5-8 times. Lexicon/helper words have no appearance quota and may vary freely.
- Guard against exact duplicate-card floods and predictable slot cycles such as `I -> you -> he -> she` with every other sentence element frozen.
- Check that new grammar appears after the unit's new words have been introduced with previously available grammar.
- Check for sterile card drift: too many `X is an object/person/place` cards means the unit needs more possession, contrast, time, social context, or practical questions.
- After the foundation units, avoid introducing every word with bare `Xです`; use cumulative grammar to make the first encounter more meaningful.
- Use `docs/CURRICULUM_QUALITY.md` as the taste bar before adding more units.

## Rebuild Expectations

- Codex implements the acceptance checks in `docs/ACCEPTANCE_TESTS.md`.
- Failing tests drive iteration until the app and curriculum satisfy the documented contract.
- If a test cannot be run, Codex documents why and states the risk.
