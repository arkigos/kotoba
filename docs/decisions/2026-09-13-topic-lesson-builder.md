# A topic supplies words to a lesson builder

The card sizing and strict per-card balancing described below were superseded by
[coverage-based sizing](2026-09-13-density-aware-topic-lessons.md). The editable
lesson layer, saving, and progress rules still apply.

This corrects the initial topic-driven A1 implementation. A topic is an overlapping
vocabulary pool, not a lesson deck. Choosing a topic opens an editable lesson draft.

## Selection and size

- Auto-select 12 target concepts, or the pool size if smaller. Learners can select
  1–30 words, replace individual selections, and name their lesson.
- Prefer unintroduced words, reserving up to a quarter of places for review when
  available. Fill every remaining place; a nearly exhausted topic still offers
  its remaining new words alongside useful review. Priority affects selection.
- Default to eight cards per selected word (12 words → 96 cards). Card count is
  editable from six times the selected count through 480. An invalid count blocks
  creation with an actionable message, rather than silently shortening practice.
- Automatic card count follows word-count changes. A custom count is retained
  while it can satisfy the floor, and learners can restore the recommendation.
- Full selected-word practice from Dictionary also defaults to eight cards per
  word. Explicit short review sets keep their requested quick-review length.

## Construction and honest coverage

The planner draws complete reviewed examples from the frozen A1 corpus and exact
dictionary word forms. It does not infer grammar eligibility for the 450-word
scope from imported parts of speech. Word introductions, contextual passes where
available, and direct recall are interleaved. Scarce examples may repeat; selected
words without an eligible reviewed context remain word/phrase practice.

Every card contains at least one selected target. Every actual target on a card
counts once, including reviewed aliases, while original token IDs, forms,
translations, readings, and audio keys remain intact. The planner chooses targets
with the fewest appearances and permits a multi-target example only when its
targets share that minimum. This keeps the running exposure spread within one.
Consequently 96 cards guarantee at least eight appearances for each of 12 targets;
sentences containing several targets can raise the displayed totals further.

Unknown supporting vocabulary is limited to two concepts per example and six per
lesson. Supporting vocabulary is clearly separate from the selected target count.
The explorer filters aliases correctly and reports actual appearances, not merely
an assigned focus word. There is no additional paid audio generation.

## Saved lessons and progress

Creation materializes the exact sequence and coverage plan. Start saves the lesson
automatically; Save for later creates it without opening practice. Saved lessons
survive the recent-history limit, retain their exact cards and cursor, and appear
in the shared shelf on Today and Topics, as well as My lessons. Existing hashes
remain compatible: `#course` now displays Topics and `#lessons` displays My lessons.
Existing sessions are not silently regenerated to use the new size.

`ActiveSession.lessonPlan` is additive: version 1, cardCount, appearances keyed by
selected target ID, helperWordIds, newWordIds, and reviewWordIds. It accompanies
targetWordIds and savedCards. Building, saving, browsing, and selecting topics earn
no learning credit. Actual word practice continues to advance every relevant
topic and the finite A1 core, using the existing spaced-occasion criterion.
See `2026-09-13-word-card-exposures.md` for the separate persistent count of cards
practiced per word, including conservative handling of older profiles.

## Verification

Planner tests cover every core and optional topic batch, exact length, alias-aware
coverage, balance after every card, helper limits, and valid frozen snapshots.
UI tests cover size edits, invalid counts, no credit for building/saving, automatic
save on launch, and exact resume from all three locations and after reload.
