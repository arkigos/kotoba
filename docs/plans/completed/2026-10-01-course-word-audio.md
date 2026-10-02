# Course word audio completion

The user authorized ElevenLabs recordings for the remaining course vocabulary,
provided usage stays reasonable. The initial inventory contained 3,717 missing
exact pronunciations, estimated at 16,964 credits; the account had 291,055 credits
remaining. This pass covers authored starter, A1, A2, and B1 tokens, including
their exact inflections. It does not expand into the large reference dictionary.

## Execution

- [x] Audit missing pronunciations and check account quota.
- [x] Generate the three missing 勉強 pronunciations (21 characters).
- [x] Generate remaining eligible course recordings in course order, using the
  existing dictionary audio command and a combined 20,000-character ceiling.
- [x] Verify exact-token coverage, file integrity, runtime serving, and billing.
- [x] Run relevant audio tests and the application build; record final results.

Existing recordings remained immutable and were reused. One catalog writer ran
at a time. The interrupted September 30 request for つよかった
(`7b4e21105a9e1e676ccbdc94`) was protected until its original recording was
recovered. Lesson content and learner progression were not changed.

## Production notes

- Added optional concurrency (1 by default, at most 3) with serialized durable
  checkpoints. Tests cover concurrent requests, checkpoint failure, stopping new
  admissions on failure, saving in-flight results, and no automatic retries.
- Added explicit `--skip-unresolved`, which preserves and reports protected
  requests, including all aliases of the same exact spoken identity.
- During the runner switch, Windows terminated a child writer along with its
  coordinator. One new interrupted request, すくなくて, was preserved for recovery.
- The restricted API key lacks `speech_history_read`. The existing authenticated
  ElevenLabs browser session allowed both pending recordings to be downloaded
  without synthesis: つよかった (`wxhusQB6e6WsU8s5wzab`) and すくなくて
  (`WzBulw70QTZFp68HbA2h`). Text, voice, model, speed and timestamps were verified
  against the requests. Both files were imported after the active writer exited;
  both request receipts are reconciled and retain their recovery provenance.

## Final coverage and cost

| Course scope | Recorded exact pronunciations | Missing |
| --- | ---: | ---: |
| Starters | 52 / 52 | 0 |
| A1 | 861 / 861 | 0 |
| A2 | 2,205 / 2,205 | 0 |
| Authored B1 | 4,721 / 4,721 | 0 |

These scopes overlap. Across the current course, all 6,071 distinct pronunciation
identities resolve to 6,069 valid MP3 files. The 3,717 initial gaps were filled
through 3,715 successful synthesis saves and two recovered history recordings.
Two additional existing clips were adopted by the initial sync. Unresolved
requests remaining: zero. A fresh curated dry run plans zero paid requests.

Account usage rose from 8,945 to 25,904 credits: **16,959 credits used** and
**274,096 remaining**. This matches the spoken-character journal total; the
older recovered recording had already been charged before this pass.

All course file headers and references passed. FFmpeg fully decoded 4,068 clips,
including every new/recovered recording, with no failures, silent files or
duration outliers (0.51–3.99 seconds). Runtime tests verify every distinct authored
token's speech and recording selection against the offline inventory. The live
app served 勉強, both recovered clips and the final B1 recording with HTTP 200 and
byte-for-byte matches. The final test run passed all 538 tests in 53 files;
curated-course and dictionary-pool checks also passed. The production build
passed, retaining the existing large-chunk warning for curriculum bundles.
