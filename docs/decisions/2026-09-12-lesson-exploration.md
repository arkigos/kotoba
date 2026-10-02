# Lesson exploration and direct sentence practice

The active learner app gives each frozen lesson a full page at `#lesson/<unitId>`.
Course rows, search, Today, and the player lead to this page.
Its ordered sentence list shows Japanese and English, optional readings and
changed tokens, search, word filtering, bookmarks, audio, and text export. Starting
from a row opens that exact index in the complete deck.

`#lesson/session` shows the active generated or Library review sequence. Its rows
reuse the stored session and snapshot; browsing, filtering, and starting at an
index never regenerate content. Saved generated sentences can also be replayed
as a one-card materialized session after their original full session is gone.

Clicking a saved sentence opens practice. Bookmark removal is a separate action.
Saving alone does not count as practice or advance review timing.

The optional `UnitProgress.viewedCardIds` records actual distinct sentence
encounters. Jumping to a late sentence does not mark skipped sentences as viewed
or complete a course unit. Previously stored exposure is preserved when migrating
older records without per-card history; explicitly completed units stay complete.

The lesson builder exposes reviewed templates, visible searchable word choices,
card counts and grammar forms, and the complete generated preview. The UI only offers
available grammar; reference dictionary membership still does not grant automatic
generation eligibility. Native dropdowns are replaced by visible choices where
selection benefits from comparison or search.

Audio handles full sentences for both content sources using exact realized token
clips and device speech fallback. Legacy sentence recordings are bypassed because
stable card IDs can outlive the text they once represented.
See the procedural decision and asset pipeline for pronunciation ownership.

The [practice continuity decision](2026-09-13-practice-continuity.md) adds saved and
recent lessons, activity counts, and independent saved-sentence review decks.
