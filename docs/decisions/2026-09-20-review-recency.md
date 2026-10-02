# New words, older review, and incidental practice

The learner requested clearing the lesson shelf and repeatedly generating and
completing lessons, with older review preceding recently learned/reviewed words.
The engine version is now 1.8.0. Frozen lessons keep their exact existing cards.

## Selection and credit

- All actually practiced words remain eligible vocabulary. Eligibility does not
  invent grammatical support for an arbitrary reference-dictionary entry.
- Unknown lexical helpers remain forbidden. A required unfamiliar word must be
  a visible selected target; authored function forms follow the existing rules.
- Topic selection reserves roughly one quarter of targets for review when new
  words remain. Custom automatic additions are due-only, at most three, bounded
  by the explicit selection size and the existing 30-target limit.
- Both use one ranking: due first, then oldest actual practice. Priority and
  seeded ordering break equal-age ties; a new-word bonus cannot boost fresh review.
  Existing due intervals remain 2/4/8/16/32 days or practiced sessions.
- Due additions may use their own safe contextual sentence. Sharing a sentence
  with a new target is useful but no longer mandatory.
- When the exact target coverage and grammatical frame can be preserved, older
  interchangeable helpers are preferred. Recent helpers stay available when
  needed. Equal review times receive equal helper ranks; retain the original
  planner choice unless another helper is strictly older in the review ranking.
- Every lexical word on an actually practiced card refreshes `lastPracticedAt`
  and `lastPracticeSequence`, whether new target, review target, or helper.
  Previewing, saving, looking up and bookmarking do not refresh those fields.
  A completed card revisit does not earn another exposure. Spaced occasions
  still require the existing session and elapsed-day conditions.
- Reviewed aliases such as `tabemasu` and `taberu` share effective recency. Use
  the latest genuinely practiced alias, never a saved-only alias. Keep durable
  IDs and original history; no speculative dictionary-wide alias inference.

## Sequence quality

Eight appearances need not mean an impossible five-card interval. The repeat
planner computes a feasible interval from each sentence's count and deck length,
and avoids adjacent identical sentences when another remaining choice exists.
All substitutions and reordering preserve target coverage and vocabulary gates.

## Shelf management

Clear all lessons removes active and saved/recent snapshots from the visible
shelf. A persistent `clearedLessons` backup permits Restore cleared lessons.
Neither action changes learning history. The same compressed storage codec
handles both collections. Restore merges by lesson ID, favoring current records.

## Evidence

`node scripts/review-recency-cycles.mjs` exercises eight fixed-date generation and
completion rounds through production functions, writing full lesson cards and
before/after queues to `docs/reviews/2026-09-20-recency/`. The review report records
the personal bilingual read-through and four additional real-browser lessons.
Dates are controlled in the isolated experiment, not forged into the live profile.
