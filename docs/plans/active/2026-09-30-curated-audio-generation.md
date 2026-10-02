# Record missing authored-course pronunciations

The user authorized missing audio after quality checks and has explicitly
removed the earlier compute reserve constraint. The inventory fix is verified.
Generate only actual starter/curated tokens, using the existing configured voice
and exact reviewed readings. Existing assets and request journal remain intact.

Current dry run: 4,152 requests /18,471 characters after exact recording reuse.
Read-only provider status: 300,000 credits available. Cap the run at those
counts; do not enable overage or repeat an uncertain paid request. Inspect the
terminal result, reconcile any unresolved result, verify every cataloged file,
rerun the dry run for remaining coverage, and rebuild/test the runtime catalog.

These recordings support the already-authored course. They do not complete
B1-B2-C1-C2 authoring or certify learner retention. Future authored forms may
require additional recordings. Existing success journal entries must never be
cleared to force regeneration.


### September 30: user-requested pause for testing

The user reported repeated sentence playback, then explicitly asked to finish
that fix and stop for the night. No further curriculum expansion is authorized
until resumed. Preserve this checkpoint for their testing.

Root cause confirmed in the live localhost:4389 browser: every paid recording
writes audio.json, which propagated through React Fast Refresh, restarted lesson
autoplay and accumulated unavailable-audio notices. packages/dictionary/audio.ts
now accepts catalog hot updates at its own boundary and refreshes the lookup map
without refreshing the player. After one reload, the browser showed successive
catalog-only updates while the same card remained idle with no warning pile-up.
No learner progress was reset. Audio tests (18) and final app build pass; the
full 492/248 suites above also pass. Existing large bundle warning remains.

Stopped paid generation session 37128 /PID13048 at the user's request after
1,991 completed new requests. The process is confirmed terminated; its stale
writer lock was removed only after verifying that exact PID was dead. All 2,920
complete catalog pronunciations have nonempty files. One in-flight request,
7b4e21105a9e1e676ccbdc94 (つよかった), has no local asset and is marked
needs-reconciliation in audio_requests.json. No repeat request was sent.
ElevenLabs history lookup returned 401 missing_permissions: speech_history_read.
Recover/check that one request using provider history before any retry. The
journal is intact and deliberately blocks accidental duplicate payment.

Next work, only after the user resumes: respond to their starter/course feedback;
reconcile the interrupted audio result; dry-run missing recordings with fresh
caps; consider a compact audio runtime manifest to reduce bundle weight. Do not
continue filling B1/B2/C1/C2 before that feedback. The wider goal is paused,
not complete. No overnight automation or background authoring was started.
