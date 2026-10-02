# Lossless storage for materialized lessons

The topic flow saves each built lesson's exact cards so it can be resumed even
after the learner's progress or word selection changes. Removing old saved
lessons to fit browser storage would break that promise.

The real planner audit introduced all 450 core words in 45 default 96-card
lessons. Plain JSON required 5,485,912 UTF-16 bytes, crossing a 5 MiB budget at
lesson 43. Continuing with 105 freshly built review lessons reached 150 saved
lessons and required 16,995,092 bytes. A lossless pool reduces those profiles to
1,783,868 and 2,658,452 bytes respectively. The audit decodes the actual storage
format and compares the entire restored profile with the original.

## Wire format

`apps/learner-next/src/storage-codec.ts` provides `encodeStoredState`,
`serializeStoredState`, and `decodeStoredState`. The learner state remains v3;
the optional `_materializedPool` is independently versioned at 1. Existing
plain v3 snapshots remain readable. Profiles below 256 KiB keep plain JSON;
larger profiles use the pool only when it reduces their stored size.

Only materialized `lessonHistory` sessions with aligned saved cards and items
are packed. Each position keeps its exact card ID, card-body reference, and
item-body reference. Card identity includes all body fields; matching IDs never
justify collapsing different content. Tokens are pooled with every field intact,
including learning and dictionary identity and audio paths/text. The `line`,
`tts`, and `explain` arrays are derived from tokens only when exactly equal;
all exceptions are retained. Restored objects are independent copies.

Runtime sessions, the active session in localStorage, and ordinary exported
backups retain full cards. Titles, order, cursors, practice records, and saved
status are unchanged. Compaction does not delete lessons or exposure history.

## Recovery

An invalid card, token, or item reference makes only its affected lesson
unplayable. Valid lessons and unrelated progress remain available. Malformed
history containers or records are excluded from the runtime shelf because they
cannot safely be rendered. In every such case the exact original snapshot is
kept in memory, writes are blocked, and the UI explains that saving is paused.
Export produces that original snapshot under a recovery filename, preserving
the damaged data for repair instead of overwriting it with a fresh profile.

The recovery marker survives immutable state updates. Storage quota failures
continue to leave earlier localStorage untouched and show the ordinary backup
action. No finite browser quota can hold an unlimited saved collection; this
format provides measured room for the expected A1 progression and review pool.

## Verification

`storage-codec.test.ts` verifies legacy v3 compatibility, exact round trips,
duplicate IDs with different content, audio identity, array exceptions, a large
saved profile, original/full backup exports, and recovery with blocked writes.
`topic-planner-audit.test.ts` verifies the 150 real planner sessions and enforces
a stored-size budget below 5 MiB without losing any profile data.
