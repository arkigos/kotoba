# Recorded word card exposures

`WordHistory.cardEncounters?: number` is an additive v3 field for actual word
appearances on consumed practice cards. The older `encounters` field also counts
dictionary lookups, bookmarks, and other touches, so it cannot provide this total.
Neither old touch counts nor spaced-review occasions are converted into exposures.
An absent field means that historical card totals were not recorded.

`PracticeSession` records one exposure per distinct learning-word ID when the
learner consumes a previously unpracticed session position. Repeated tokens in
the same card count once. The same card ID at another position counts again, as
does a new run created by restarting a lesson. Previous, direct browsing,
inspection, pronunciation playback, saving, priority, and previewing do not count.
Returning to a consumed position does not credit it again. The persisted session
`practicedIndices` list retains this rule through pause and reload.

The displayed label is **recorded card exposures**, with an explanation that
earlier practice is not included. This appears in the practice word-detail panel
and in the learner's dictionary word collection. Untracked history remains
explicitly untracked until new card practice occurs. Counts keep existing learning
IDs; they do not silently merge pronunciation forms or change the A1 review policy.

Topic and personal vocabulary lesson summaries separately intersect practiced
words with the explicitly selected targets. Reviewed `coreWordId` equivalents
count once in that summary, and supporting words do not inflate its target total.
The summary's card count uses unique consumed positions rather than all legacy
score events, so backward revisits do not inflate it either.

The focused `word-exposure.test.tsx` suite covers duplicate tokens, repeated
sentences at different positions, browsing and lookups, backward revisits,
reloads, restarts, legacy unknown counts, and selected-target summaries.
