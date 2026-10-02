# Canonical Japanese dictionary and reusable word audio

Status: complete.

The owner requests a durable shared dictionary from an online source, stable word
references throughout lessons/Library, authored progression and grammar limits,
and ElevenLabs word audio generated without duplicate or unbounded spending.
Comprehensive dictionary coverage is preferred; audio should fully cover launch
vocabulary and actual lesson word forms. Reasonable targeted verification only.

- [x] Import complete English JMdict with upstream entry IDs, spelling/reading
  restrictions, meanings/POS, pinned provenance/license, and reproducible updates.
- [x] Introduce canonical entry/form bindings for existing vocabulary IDs without
  losing learner history. Ambiguous matches remain explicit local teaching entries.
- [x] Resolve current lessons, generated lexemes, Library, and lookup through the
  shared dictionary. Preserve contextual/inflected surfaces and frozen snapshots.
- [x] Expose searchable comprehensive dictionary and local entry detail/audio.
  Course level is reviewed placement; unplaced entries do not become A1 by default.
- [x] Adopt a shared pronunciation registry and migrate exact existing recordings.
  Generate missing launch words/forms with explicit budget, resumable receipts,
  deduplication, and no automatic retry of ambiguous paid requests.
- [x] Verify identity/audio variants, compatibility, builds, and a short browser
  flow. Record costs, coverage, limitations, and operational docs.

Keep broad reference lookup separate from generation eligibility: JMdict POS
alone is insufficient to authorize arbitrary grammar/semantic frames. Grammar
levels remain construction policy, not inferred from word frequency or JLPT.
Never put provider credentials in browser bundles or print secrets.

## Delivered

- Imported 218,765 JMdict entries and 253,581 senses with pinned source data,
  source restrictions, attribution, and reproducible sharding.
- Established `data/jp/dictionary/teaching_words.json` as the primary authoring
  source. Its 849 bindings retain 825 course items (578 A1 and 247 recognition)
  plus 24 grammar entries, resolving to 796 canonical entries. Normal binding
  never reloads teaching content from legacy curriculum. Explicit bootstrap
  refuses to replace existing authoring data.
- Connected both players, generated lessons, Library, and searchable dictionary
  to canonical identity and pronunciation while preserving legacy learning IDs,
  inflected card forms, and stored snapshots. Full reference coverage remains
  distinct from the 28 reviewed senses eligible for the current A1 generator.
- Completed 879 pronunciation lookups using 873 distinct recorded files:
  293 existing clips reused and 580 new clips generated. A fresh dry run reports
  zero pending generation in this launch inventory. Unselected comprehensive
  dictionary entries remain outside the paid batch.
- Actual ElevenLabs consumption was 2,294 credits, leaving 267,878 after this
  batch. Resumable receipts and immutable recordings prevent normal reruns from
  buying the same completed clip again.

## Verification

- All 174 tests passed.
- Root and Next production builds passed.
- Practice-flow checks and curriculum validation passed.
- Targeted binder checks preserved all legacy teaching fields, canonical alias
  distinctions, recognition identities, safe pronunciation selection, and
  byte-identical derived output after the authoring-source migration.
- Browser verification on an isolated production-preview profile confirmed
  recorded 読む playback and saving. Unplaced 天文学 could be searched, saved,
  and restored after reload without acquiring an invented level or practice
  history. Priority controls and native entry dialogs fit desktop and 375px
  mobile layouts without overflow.
- An unplaced word was rejected from a generated review with a clear alert;
  removing it allowed the review to start. Inflected 読みます played and opened
  the same canonical 読む entry. Browser console checks found no errors.

Operational contracts are in `docs/ASSET_PIPELINE.md`, `docs/DATA_CONTRACTS.md`,
and `docs/decisions/2026-09-12-canonical-dictionary.md`.
