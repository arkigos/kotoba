# Canonical Japanese dictionary and pronunciation assets

Status: implemented. Replaces the curriculum-only word lookup model.

The owner wants a durable word source shared by lessons, Library, custom reviews,
and audio generation. Comprehensive lookup is useful; it does not mean every
dictionary word belongs in the course or needs a paid recording immediately.

## Reference dictionary

Import the official English JMdict export from EDRDG. The initial pinned edition
is September 12, 2026: 218,765 entries and 253,581 senses. Preserve upstream
sequence IDs as `jmdict:<sequence>`, spelling and reading restrictions, effective
parts of speech, all English senses, and usage notes. Sense positions are scoped
to the source edition; do not use them alone as permanent learner-history IDs.

The exact gzip, SHA256, conversion script, attribution, CC BY-SA 4.0 license,
upstream notice, and source DTD are retained. See `data/jp/dictionary/source.json`
and `public/dictionary/jp/ATTRIBUTION.md`. Reference data is distributed under its
source license; preserve attribution and the applicable share-alike obligations
when distributing modified dictionary data.

The browser loads the small course subset synchronously. Full dictionary lookup
loads a search index only when requested; entry details load one of 64 JSON shards.
Search includes alternate spellings, readings, and English meanings. The full
reference corpus is not bundled into the JavaScript application. Visited data is
cached by the production service worker; dictionary JSON refreshes online rather
than being pinned forever to an old browser cache.

The Dictionary destination now browses the full pinned index even with an empty
search. Its compact rows retain the original five search columns and append a
common flag (`0 | 1`), pipe-delimited effective parts of speech, and pipe-delimited
specialist fields. These three columns are browse metadata, excluded from lexical
text search, proficiency placement, and generation eligibility. Common/type/field
filters combine with authored level, topic, and Core A1 filters. Counts refer to
dictionary entries; the distinct 450-word A1 completion denominator belongs to
the authored scope, with reviewed aliases counted once there.

`python scripts/sync-dictionary-browse.py` recreates browse metadata from installed
shards without fetching another edition or requesting audio. The ordinary importer
writes the same columns for future editions. Any entry can be prioritized directly
or selected for personal word practice. It resolves its canonical shard before
entering the learning pool; failed downloads remain retryable. Prioritizing does
not require bookmarking and does not record practice. Sentence generation retains
its separate reviewed grammar gates.

## Entry, learning word, realized form

These are distinct references:

- **Dictionary entry:** lexical identity, spellings, readings, senses, and POS.
- **Learning word ID:** the existing stable course/profile ID plus a binding to an
  entry, selected taught form/gloss, course placement, and optional sense refs.
- **Realized token:** exact contextual surface, reading, explanation, and word ID;
  procedural tokens additionally carry the dictionary entry ID.

`teaching_words.json` owns the selected teaching form, gloss, level, and introducing
unit. It was extracted once from the curriculum; ordinary dictionary binding
never reads the old curriculum word definitions. Edit this file for future word
authoring. `course_bindings.json` materializes its canonical links. Teaching forms
and glosses are intentional pedagogical overrides, not copies of every dictionary definition.
`course_entries.json` is the fast subset of imported entries plus explicit local
`kotoba:<id>` entries. Uncertain source matches, phrases, recognition symbols,
and grammar retain local entries rather than being forced onto a wrong JMdict
sense. The binding report exposes unmatched and ambiguous records for review.
Reviewed aliases live in `overrides.json`, surviving deterministic rebuilds.

Run `npm run dictionary:bind`, `npm run dictionary:curate`, and
`npm run curriculum:sync-runtime-lexicon` after authoring changes, then run
`npm run dictionary:validate-pools` and refresh audio forms/inventory as needed.
Binding recreates local entries; curation restores their frequency and placement
metadata without changing the frozen pool assignments. The explicit
`--bootstrap-from-curriculum` option only creates a missing teaching source; it
refuses to overwrite one. Preserve already-authored frozen snapshots deliberately.

The initial bindings cover 825 course items and 24 grammar entries, with 53
shared-entry groups and 26 reviewed polite-form aliases. All 28 procedural-engine
words link to JMdict. Existing learning IDs/history remain intact: for example,
`iku` and `ikimasu` refer to one entry but select different taught forms. Recognition
items remain distinct from words even when their characters look identical.

Both players hydrate unit vocabulary from the shared resolver. The old runtime
lexicon becomes a generated compatibility artifact. Frozen sentence text and saved
generated snapshots remain materialized: dictionary updates must not silently
change an in-progress sentence or its contextual pronunciation. Old authored
vocabulary copies are compatibility snapshots, not the runtime lookup authority.

## Levels and grammar

Course placement stays authored and separate from lexical facts. Current course
content is 578 A1 words and 247 Kana/recognition items. As of September 20, all
entries have a separate Kotoba A1–C2 study placement and commonness label. Bulk
placements are explicitly estimated; JLPT, frequency and CEFR are not equivalent.
The browse collection contains 50,000 imported entries plus 474 local entries.
Full source shards remain available by ID for saved-word compatibility. See
[the curation and adaptive grammar decision](2026-09-20-curated-dictionary-and-adaptive-grammar.md).
Saving a word does not grant generation eligibility.

The grammar overlay still supplies reviewed conjugation classes, semantic roles,
frames, exceptions, and English realization. JMdict POS can assist authoring; it
cannot replace those checks. Existing recipe level ceilings and grammar gates
continue to apply. New desire and ability patterns use separate actual-practice
history; dictionary placement and frequency never unlock them.

## Reusable pronunciation identity

`packages/dictionary/audio-key.mjs` defines a stable identity from canonical entry,
reading, spoken text, and accent/voice variant. Spelling is excluded, so spelling
aliases need no per-unit copies. A deliberate reading alias may share a file when
entry, exact spoken text, and variant all match. Different entries, heteronyms,
or explicit accent variants are not merged merely because their kana resembles.

`audio.json` maps pronunciation keys to immutable assets and provider receipts.
Existing exact token recordings and verified single-token card recordings are
referenced in place. No old clips are copied to a new folder just for consistency.
New clips live in `public/media/jp/audio/dictionary/` and are written exclusively.

Lessons resolve the exact realized pronunciation. 読みます never substitutes the
dictionary-form よむ recording. Binding `audioText` removes display notation such
as parenthesized alternatives only when the token is the matching base form.
Small kana recognition prompts and particle pronunciation overrides are preserved.
Contextual sentence audio remains separate from the dictionary word registry.

Library rows, dictionary readings, and lesson word controls share this resolver.
Missing reference-word recordings use an explicitly labeled device voice in the
dictionary; no browser code calls a paid provider or receives credentials.

## Generation and spending

Use the existing Japanese voice, Multilingual v2 model, Japanese language code,
and 0.85 speed for consistency. Flash v2.5 is available at a lower nominal rate,
but changing the established voice/model for this modest batch is unnecessary.
Generate the launch words, frozen lexical forms, and supported procedural forms;
do not synthesize the entire 218,765-entry corpus speculatively.

The tool defaults to dry-run. Paid runs need explicit character/request caps and
check remaining subscription credits. An exclusive writer lock prevents races.
Every successful clip is persisted immediately; request receipts survive restarts.
An uncertain paid result stops the batch for reconciliation instead of retrying
and potentially charging twice. Local transient Windows file-lock errors may be
retried without repeating the provider request. Secrets stay in ignored `.env.local`.

Provider documentation:

- [JMdict project](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project)
- [EDRDG licensing](https://www.edrdg.org/edrdg/licence.html)
- [ElevenLabs models](https://elevenlabs.io/docs/overview/models)
- [ElevenLabs authentication](https://elevenlabs.io/docs/api-reference/authentication)
- [Subscription quota endpoint](https://elevenlabs.io/docs/api-reference/user/subscription/get)

Batch counts, actual credit usage, and verification are recorded in the completed
implementation plan. Future dictionary/audio updates use the same IDs and registry.


## September 30: curated pronunciation inventory

Dictionary audio now includes exact authored tokens from all compiled curated
levels and the starter suite. Canonical lexical IDs work without a legacy word
binding; their actual token reading is recorded, never an inferred lemma form.
The compiler writes dictionary-owned audio_function_forms.json for authored
function forms. Historical grammar bindings take precedence; other forms use
stable kotoba:curated-form identities. Punctuation has no recording identity.
The runtime resolver and offline collector share this registry.

Use --curated-only for a production plan limited to pronunciations actually
present in the authored course. It excludes unused legacy/procedural forms,
deduplicates originals and recalls, and retains previously completed recordings.
The default continues to include all authored sources. A dry run never writes
recordings or sends paid requests. Source forms are curated, not generated by
morphological inference. The inventory does not establish linguistic quality.
