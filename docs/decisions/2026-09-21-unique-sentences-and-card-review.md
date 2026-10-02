# Unique sentences and separate card review

Engine 2.0.0 supersedes the earlier repeated-appearance and due-word-injection policies.

## Lesson assembly

A lesson has up to 24 new-material cards, then up to 16 due review cards and 8 recent review cards, at most 48 total. A requested card count is a ceiling (1–48). Sparse lessons stay shorter; never pad them. Every explicit target needs at least one supported contextual sentence. Unsupported selections fail clearly instead of silently dropping targets or using dictionary cards.

`lesson-card-quality.ts` rejects single lexical-token cards, punctuation-only extensions, and duplicate Japanese anywhere in the entire assembled lesson. Identity uses normalized readings and written forms, ignoring whitespace and punctuation. Different IDs, glosses, kana/kanji spelling and nonadjacent placement cannot evade the check. A noun plus copula or verb plus question particle is a sentence; an isolated word is not. Homophonic sentences are conservatively deduplicated. Reusing an exact sentence in a later lesson is intentional spaced review.

Automatic topic targets are new words. New-topic helper vocabulary is restricted to actually practiced words in the scenario, with explicit familiar scaffolds (pronouns, menu reading, household people, workplace languages and learned grammar). Review urgency cannot inject vocabulary into the core. Custom selections remain exact and may deliberately drill familiar words. Grammar lessons use their authored target set. All paths preserve the zero-unknown-helper gate.

## Review source and credit

Consumed contextual cards enter a persistent review bank with their original lesson provenance. Migration considers only `practicedIndices` from saved sessions. Merely previewed or saved lessons cannot supply reviews. Cards are copied unchanged, visibly labeled Scheduled review or Recent practice. Review words must still pass the actual-history vocabulary gate. Review selection covers words not already appearing in the core, then avoids redundant coverage between review cards. Due cards come first; recent practice favors less-established words relative to their interval. Overflow stays pending.

Only consuming a new card position updates every word's last-practiced time and card encounter count. Preview, save, backward navigation and merely assembling a review do not. Spaced occasions grow at most once per day in a different session; aliases share core progress. More cards in one sitting do not masquerade as many spaced sessions.

The base intervals are 2, 4, 8, 16, 32, 64 and 128 days by spaced occasion. An encounter multiplier grows from 1 to at most 2; priority halves the interval (minimum one day). Urgency is elapsed time divided by interval, not raw age. Same-day lesson counts no longer manufacture due status. This is an explicit exposure-based scheduling heuristic, not calibrated retention prediction or a claim that reading equals successful recall.

## Persistence and compatibility

`LearnerState.reviewCards` stores exact cards plus sourceLessonId, sourceTitle, lastPracticedAt and encounters. Large profiles intern this bank into the existing materialized-card pool; normal exports retain complete cards. Corrupt pool references trigger existing recovery/write blocking rather than overwriting damage.

Session items add optional section (`lesson`, `due-review`, `recent-review`) and reviewSource. Lesson plans add sections (lesson, dueReview, recentReview, cap) and deferredDueWordIds. Pacing/transitions describe the core; appearances describe the whole assembled lesson. Actual practice credit is separate from both.

Existing originals are preserved. Materialized topic/custom/saved lessons that violate the new sentence contract are blocked on open with a Remake instruction. Archived frozen curriculum and legacy recipe snapshots are separate compatibility surfaces; this change does not rewrite their content or progress.

## Curated cores

The assembly boundary deliberately permits a curated, versioned core followed by dynamic review. That is the preferred direction for thoroughly reviewed sequences; it removes pressure to generate awkward sentences for due vocabulary. The current cores still use reviewed deterministic frames. A full baked-in replacement has not been authored or certified. Greetings and unsupported reference entries need authored sentence contexts before they can pass this stricter contract; failing clearly is preferable to manufacturing filler.

## Starter availability follow-up

Learn and topic search show only topics whose default selection passes the same
core planner and vocabulary/quality checks used by creation. Eligibility is a pure
check: no lesson snapshot, helper credit or progress is created. It is cached per
immutable learner state and recalculated after practice changes. Hidden topics
retain their selected-topic preferences and progress. A stale unavailable topic
focus cannot open the failing preview. Extra vocabulary retains the learned-core
gate and must itself be buildable. Manual Custom selections still report specific
unsupported contexts.

The September 21 starter fix changes neither the default twelve target words nor
the 24/16/8 limits, review source or continuation behavior. On the tested empty
profile eleven starter topics build, while Greetings is hidden until its required
sentence coverage exists.
