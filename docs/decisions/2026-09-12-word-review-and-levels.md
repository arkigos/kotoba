# Word review and lesson progression

Status: implemented in Kotoba Next. Supplements the procedural lesson decision.

The owner wants three concepts: where a word belongs in progression, whether it
is due for practice, and whether the learner wants to prioritize it. Placement
is authored content. Review timing is automatic. Prioritize is the single
learner-controlled word preference; the Hard/Learning/Easy controls are removed.
Bookmarks still save content and do not affect review timing.

## Word-based practice history

Course cards and generated cards update the same word history. Advancing after
practice records the card's unique vocabulary IDs. Merely opening a word's
details, saving it, or changing its priority does not postpone review.

Each practiced session gets one monotonically increasing sequence number on its
first practiced card. Each word records its most recent practice timestamp and
session sequence. Repeated cards in that session update recency but do not count
as separate spaced occasions. A new occasion requires a different session and
at least 24 hours since the previous occasion. Restarting creates a fresh session
identity but cannot bypass that time requirement.

The initial policy is intentionally inspectable: a word returns after 2, 4, 8,
16, then 32 days **or** other practiced sessions, whichever comes first. Its
interval grows with spaced occasions. Priority halves the interval and increases
selection preference. These are adjustable product heuristics based on exposure,
not a fitted memory model or a measurement of mastery. Calendar and lesson counts
remain separate stored facts, so the policy can change without rewriting history.

Existing profiles remain valid. Old Hard marks supply initial priority unless
the learner explicitly overrides it. Other old ratings are retained as history
but do not drive a second learner preference. For old records with no practice
timestamp, the old last-seen timestamp provides an approximate initial anchor;
inspection then preserves that anchor. Historical encounters are not converted
into invented spaced occasions.

## Review suggestions and additions

Library shows Due, Prioritized, and not-recently-practiced filters, with the
timing explanation available in place. The builder's Include review words option
is on by default and saved as a preference. It adds at most two known words:

1. Due words come first, ordered by relative overdue amount.
2. Prioritized words precede other optional additions.
3. Seeded variety favors recently introduced words among the remaining choices;
   older words still have a chance. Recency never outranks a due word.

Every candidate must fit the selected level, reviewed sense metadata, and recipe
slots. The whole sequence is generated and validated again before admitting it.
Core targets retain their original exposure floors; each review addition must
appear on at least four cards. At most twelve candidates are attempted. Words
that cannot fit remain in the pool, with due/priority deferrals explained.
Previewing or selecting a review word never records it as practiced.

The snapshot stores accepted words, reasons, selection time, and deferrals along
with the actual recipe and cards. Starting/resuming uses that exact snapshot.
The current frozen course cards retain their authored review vocabulary; the
automatic additions are available in the procedural builder.

## Authored levels and grammar ceilings

New generated recipes carry one A1–C2 level. Reviewed senses also carry placement;
both targets and helpers must be classified at or below the recipe ceiling.
Unknown or unclassified inputs fail closed. A word's level is not a learner's
personal difficulty rating. Current runtime word placement comes from the course
level of its introducing unit, with Kana as a separate preparatory category.

`packages/learning-engine/levels.ts` owns the ordered levels and limits:

| Ceiling | Content words | Clauses | Embedded clause depth |
| --- | ---: | ---: | ---: |
| A1 | 4 | 1 | 0 |
| A2 | 6 | 2 | 1 |
| B1 | 9 | 3 | 1 |
| B2 | 12 | 4 | 2 |
| C1 | 16 | 5 | 3 |
| C2 | 20 | 6 | 3 |

These are Kotoba's JF/CEFR-inspired authoring policies, not official word lists
or official numerical CEFR criteria. Content-word length counts lexical token
occurrences rather than Japanese characters. Each realized card must also pass
the construction level, grammar-tag levels, declared clause count, and depth.
Grammar prerequisites and ordered introduction phases continue to apply.

All six implemented constructions and 28 reviewed senses are currently A1.
Selecting A2–C2 permits simpler material and stores a higher ceiling; it does
not supply unimplemented advanced constructions. The builder states this. Future
clause constructions must declare and test their actual complexity before use;
new grammar families also require realization rules and linguistic review.
Legacy recipes without a level still work; all new builder recipes declare one.

## Dictionary boundary

The runtime lexicon contains 825 curriculum entries with readings, meanings,
functions, introducing units, and course placement. It is not a comprehensive
Japanese dictionary. Generation uses the separate 28-sense reviewed overlay,
whose verb classes, frames, noun roles, and exceptions make legal substitution
possible. A broad reference dictionary can later provide lookup coverage;
importing a definition must not silently authorize that sense for generation.

## Verification

Tests cover time/session due dates, spaced-occasion counting, inspection and
bookmark isolation, old-profile priority compatibility, deterministic selection,
core/review coverage, unsupported words, word and grammar ceilings, UI priority,
level selection, and persisted snapshots. Browser QA uses a separate local origin
so testing does not change the owner's practice history.
