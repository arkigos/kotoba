# Project

Kotoba is a curriculum-driven Japanese sentence drilling app.

Its purpose is to teach vocabulary and grammar through long, repetitive,
naturalistic sentence streams. Words are not learned as isolated list items; they
live inside controlled sentence worlds where modular substitutions make meaning
and grammar gradually obvious.

For the bigger product picture, see `docs/APP_VISION.md`.

## Product Intent

- Make sentence exposure feel fast, visual, repeatable, and contextual.
- Teach through long, naturalistic sentence drilling where words live in context rather than isolated memorization.
- Keep unit vocabulary cumulative, while using a simple relative bin rule to guarantee older words return.
- Build frozen authored curriculum units with Codex as the curriculum author.
- Keep curriculum data easy to inspect, validate, and edit directly in the repository.
- Prefer simple, predictable behavior over elaborate personalization.

## Current Shape

- The CRA/Express prototype is archived under `archive/prototype-cra-express-2026-06-27/`.
- The active app is a Vite React TypeScript practice player.
- Existing lesson data and media conventions are reference material in the archive.
- Planning docs under `data/jp/curriculum/` define the curriculum model.
- The planned Japanese course is a CEFR-inspired / JF-aligned 96-unit A1-B2 path;
  the authored `unit_index.json` contains only units that already have JSON files.

## Durable Priorities

- Lesson data quality matters as much as code quality.
- Default curriculum units introduce one grammar focus and 10 new words chosen to support that grammar focus.
- New words follow the Japanese word-selection rules in `data/jp/curriculum/word_selection_rules.md`: useful functional spread, strong sentence compatibility, and no duplicates from earlier units.
- Vocabulary spacing is curriculum-level, not learner-specific: for unit `N`, words from units `N`, `N-2`, `N-4`, `N-8`, `N-16`, `N-32`, and so on are review-due and must return.
- Any already introduced word may be used as known helper vocabulary, but only the current unit's `newWords` are the unit's drilled vocabulary.
- Grammar is cumulative: a unit uses grammar introduced in previous units, while its new grammar focus appears only after the unit's new words have been warmed up with familiar grammar.
- Changes preserve a lightweight, inspectable, single-user/small-project feel.
- Structure exists to help Codex continue authoring and to help humans skim the project.
