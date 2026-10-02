# Independent A1 tracks and complete editorial review

Status: completed October 1. Ready for user testing; no further curriculum or
paid audio expansion is running.

## Delivered and verified

- Eight shared starters: 162 cards and 28 taught vocabulary identities. The
  polished first five remain intact; three bridges supply shared action,
  location, companion, negative and past patterns.
- Three independent tracks cover the remaining 725 identities: People and
  communication (174 words, 114 lessons), Things, food, and choices (312 words,
  177 lessons), Everyday actions and time (239 words, 135 lessons). Their 426
  steps comprise 153 instructional lessons and 273 fixed recall checkpoints.
- Read every original A1 Japanese/English pair and all starter content; revised
  cross-track constructions, awkward sentences, readings and redundant helpers.
  Corrected bare ten-thousand-yen prices, forecast phrasing, soup usage, and
  starter writing examples. Expanded two short vocabulary lessons with distinct
  uses. The grammar checks cover declared constructions, not all Japanese.
- Each additional A1 grammar concept has one owner. All 19 return in at least
  three lessons and six card placements, enforced by a regression test. Word
  exposure audits also pass. Recall choices remain fixed authoring data.
- Runtime integration walks each complete track from starter knowledge alone;
  other tracks cannot supply helpers. Next stays local and A2 requires all A1.
- Full root suite: 49 files / 496 tests passed. The added recurrence regression
  subsequently passed (3 boundary tests). Learner suite: 31 files / 250 tests
  passed. Its multi-screen continuity test uses a 15-second budget after a
  parallel-run timeout; no assertions were removed.
- Build, curated validation and dictionary pool validation passed. Existing
  bundle-size warning remains. Refreshed the bilingual review packet under
  `docs/reviews/2026-09-26-curated-course/`.
- Browser: cleared old saved lessons and reset local profile through Settings.
  Confirmed 0/753, Starter 1 ready, later starters gated, and all three track
  previews. Inspected starter helpers at desktop/mobile widths; no horizontal
  overflow at the mobile width. Restored desktop and left Learn ready to test.
- Prior audio request remains protected in its reconciliation journal; no paid
  audio was retried or generated during this curriculum pass.

Evidence: `.codex-oct1-root-tests-final.log`,
`.codex-oct1-grammar-recurrence-tests.log`, `.codex-oct1-next-tests-final.log`,
`.codex-oct1-build-final.log`, `.codex-oct1-pools-final.log`,
`.codex-oct1-review-final.log`, `.codex-oct1-fresh-course.png`.

## User direction (October 1)

This supersedes the linear-course decision for A1. Shared starters precede freely
selectable topic tracks. Each track has an ordered internal sequence and owns
its additional A1 grammar: it may reuse that grammar locally, but another A1
track may neither introduce nor use it. Completed A1 supplies all vocabulary and
grammar to A2; no separate A2 starter course. Tracks can combine vocabulary and
grammar themes and can be long, with varied lesson blocks rather than one motif.
Use clear examples and brief useful notes. Preserve good content, but the user
explicitly waived saved-card, saved-lesson and old-curriculum compatibility.
Clear or reset what is needed. The old ten-lesson shelf has been cleared via UI.

## Baseline

Five starters: 15/18/24/18/15 cards, 90 total and eighteen lexical targets.
All 90 Japanese/reading/English triples and notes read; the sequence is sound.
A1: 753/753 entries, 153 instruction and 277 recall lessons. Existing checks pass
but assume linear cross-topic knowledge and do not establish track independence.
A2: 1,267/1,267, B1: 1,238/3,004. Advanced expansion is outside this request.
Paid audio remains stopped with the prior single unresolved request protected
by its journal; do not retry it or start unrelated paid generation.

## Work

1. Map the smallest useful shared foundation and non-overlapping grammar owners.
   Candidate tracks: people/communication, things/food/choices, actions/time.
   Keep the five good starters; author a small bridge for shared basic action,
   location and conjunction patterns. Make every new shared lexical helper an
   actual taught starter target. Do not silently promote unknown vocabulary.
2. Regroup and revise existing A1 material. Assign every dictionary identity once;
   check each track from starter knowledge alone. Retain coherent sentences that
   meet the rules. Rewrite violations explicitly, with accurate readings/glosses.
   Distribute varied grammar blocks and local recurrence throughout each track.
3. Enforce independent grammar and vocabulary boundaries in offline validation
   and runtime progression. Freely select a track, proceed in its internal order,
   and require all A1 tracks before A2. Review stays local. Reset stale progress
   and snapshots as needed under the user's explicit authorization.
4. Read every starter and original A1 sentence, all helpers and recall placement.
   Audit coverage, distinct contextual uses, grammar-before-use, single grammar
   ownership, duplicates, dictionary senses/readings and level scope. Correct
   actual defects; no automatic morphology approval or synthetic padding.
5. Run relevant/full tests, pools, build and browser checks. Verify fresh-user
   access to every track, independent progress, proper A2 gating, completion and
   review. Export a current review packet and report limits honestly.

No subagents are authorized. Do not claim official CEFR vocabulary certification.
