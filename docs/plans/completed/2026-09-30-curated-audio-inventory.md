# Include curated lessons in dictionary audio

The audio collector currently reads old units, course bindings and procedural
forms only. Curated lexical inflections and unbound authored grammar forms can
therefore be missing from both its inventory and the runtime recording lookup.

1. Compile stable audio identities for explicitly authored function forms into
   a small dictionary-owned registry, excluding punctuation.
2. Collect exact token readings from starters and every compiled curated level;
   preserve existing canonical identities, prompts, recordings and deduplication.
3. Use the same function identities in runtime lookup. Never replace an inflected
   token with lemma audio or use an unverified full-sentence recording.
4. Test identity/reading behavior and real-course coverage, run a no-write dry
   run, and verify dictionary/player regressions and build. No paid generation
   in this implementation pass.


Implementation and focused tests complete. Real-course coverage test accounts
for every spoken token; punctuation is excluded. Exact inflections, historical
particle identity, local grammar identity, unchanged base prompts and duplicate
recall reuse are covered. An initial test fixture incorrectly treated null
introducedInUnit as absent; corrected it to assert the known object-particle ID.
All 25 focused tests pass. Build passes; full tests and learner suite running.

Dry-run --curated-only: 4,538 unique pronunciations; 354 already complete,
23 reusable exact recordings, nine reusable reading aliases, and 4,152 missing
requests totaling 18,471 characters. The broader all-authored plan has 4,192
missing requests /18,564 characters. No audio catalog write or paid request was
made. Read-only ElevenLabs status: Creator, 0/300,000 credits used, 300,000
remaining. These are point-in-time estimates; recheck before paid generation.


Completed verification: 491 full-suite tests /47 files, 248 learner tests /30 files and production build pass. All processes terminal. No audio was generated during implementation. Paid generation is a separate, explicitly capped pass under the user’s existing ElevenLabs authorization.
