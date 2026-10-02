# Count word appearances, then size the lesson

This replaces the eight-cards-per-word topic default in
[the original builder decision](2026-09-13-topic-lesson-builder.md).
Twelve targets with eight appearances require 96 target appearances. A card with
two selected targets contributes two appearances; unrelated supporting words do
not reduce that requirement.

## Selection and coverage

- Keep 12 targets by default, editable from one through 30. Automatic selection
  considers actual reviewed co-occurrence within the topic while preserving
  Priority, new/review quotas, and the queue prefix that ensures progress through
  the whole core. See [connected selection](2026-09-13-connected-topic-selections.md).
  Manual target selections remain exact.
- Recommend at least four cards per target (48 for 12), aiming for eight actual
  appearances of every target. Use more cards when reviewed examples cannot share
  enough selected words. A pool of isolated words still requires eight cards per
  word. Do not divide by an assumed density such as 2.5.
- Count distinct target concepts once per card, including approved aliases.
  Preserve exact authored token IDs, inflections, readings, meanings, and audio.
- Permit local repetition: a word may remain through neighboring substitutions.
  Default coverage is at least eight, with a final spread of at most four.
  There is no requirement to keep every running count equal after each card.
- A custom whole-number count between 6 and 480 remains exact when the planner
  can give each target at least six appearances. Try the eight-appearance goal
  first. Shortening can reduce it to six, shown in the actual coverage summary.
  If a bounded search cannot fit the count, explain this and offer the achieved
  size; do not describe a heuristic result as a proven minimum.

## Small steps and honest boundaries

The coverage planner favors one changed content position, then two, in short
runs of complete reviewed cards. After coverage is fixed, a bounded ordering pass
repairs targets whose appearances collapsed into one short burst, then uses local
swaps and segment reversals to improve continuity. It preserves the opening card,
exact card multiset, and appearance counts. A change may not reduce a target's
first-to-last span below its existing span or one quarter of the deck, whichever
is smaller. The real initial-topic audit requires every target to span at least
a quarter of its lesson. This permits local bursts without restoring equal
running counts; fixed search budgets also bound work for 480-card custom lessons.

`measureCardTransition` compares actual surfaces and readings. Frozen cards need
the same fixed particle/order scaffold to qualify as neighbors. A same-lemma
form change is a boundary; different lemmas do not prove identical grammatical
features, so the UI describes word changes rather than guaranteed grammar slots.
Reviewed derivations can compare explicit grammatical features and slots.

Other phrase or pattern changes are stored as boundaries and visibly labeled in
the player, explorer, and full-card preview. Exact repeated forms are measured
separately. A low change count on standalone vocabulary cards must not be mistaken
for rich sentence practice; the audit also measures contextual neighbor steps,
retained targets, distinct contexts, and first/last appearances.

Supporting vocabulary remains limited to two unknown concepts per card and six
per lesson. The helper allowance is selected across all targets before sentence ordering,
preserving contextual coverage instead of spending six places on early examples.
An available single-target context supplies the same coverage flexibility as an
isolated card. Exact word/phrase fallbacks remain when that context is unavailable. No new sentences
or paid audio requests are generated.

## Persistence and verification

New optional `lessonPlan.pacing` and `lessonPlan.transitions` store diagnostics
alongside exact materialized cards. Saved lessons retain their original sequence,
size, cursor, and exposure accounting; old plans need no migration. The count of
cards actually practiced per word remains separate from planned appearances.

Focused tests cover dense and isolated pools, custom counts, real reviewed-corpus
feasibility, helper selection, transition classification, asynchronous preview
edits, visible boundary cues, saving, and exact resume. The full-scope audit checks
every core/extra batch, actual alias-aware counts, all 450 core concepts remaining
reachable, and 150 saved sessions surviving a lossless storage round trip within
5 MiB. It reports density and sequence metrics from real authored examples rather
than assuming that synthetic fixtures represent every topic.
