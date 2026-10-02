# Curated dictionary and reusable grammar

The user asked for A1–C2 and commonness tags on every entry, a roughly 50,000-word
dictionary, and on-demand lessons containing new words and due review. They
clarified: exclude unknown helpers; prioritize due words for review.

## Dictionary

All 219,239 unique entries receive placement and frequency metadata. The normal
browse index contains exactly 50,000 imported entries plus 474 local entries.
168,765 imported entries leave normal browsing, but their original IDs, senses,
restrictions and shards remain resolvable. Saved/priority collections load their
retained entries even when absent from the curated index. Existing learning IDs,
course bindings, pronunciation keys and frozen lessons remain intact.

Placement is a Kotoba study estimate, not an official CEFR word list. Authored
course placement wins; 89 additional exact spelling/reading corrections were
reviewed during this work. Other entries use deterministic frequency thresholds,
JMdict priority and rare/specialist evidence. Every estimate includes its basis
and confidence. C2 includes a low-confidence long tail where evidence is limited;
it is not a claim that every obscure word is necessary for C2 proficiency.
Kana recognition bindings retain their separate course classification.

Frequency is independent: Very common (Zipf >=5), Common (>=4), Uncommon (>=3),
Rare (lower observed frequency), or Limited data (no adequate evidence). With no
exact-form corpus evidence, JMdict common flags can support Common. Pinned
wordfreq 3.1.1 Japanese data is joined on exact written forms; phonetic readings
are not used to assign a common homophone's frequency to a different kanji word.
Shared written forms need a unique strongest authored/priority owner; unresolved
ties receive no corpus attribution. These are corpus estimates, not a live
spoken-language ranking or a sense-disambiguated corpus.

The cull protects authored/reviewed entries, ranks frequency and JMdict priority,
demotes specialist/proper entries, and removes unprotected all-rare/historical
entries and low-frequency named entities. Exact duplicate form/reading/sense
records share one browse slot; legitimate homonyms are preserved in the source.
Source-marked usual kana replaces unusual display kanji, and Japanese number
forms replace bare decimal headwords where valid. Original source arrays and
sense restrictions are preserved.

Rebuild after import/binding with `npm run dictionary:curate`, then
`npm run dictionary:validate`. The pinned JSON frequency source makes ordinary
rebuilds standard-library-only. The initial msgpack conversion is documented in
the script. Curation regenerates checksums, both indexes, the report and frequency
attribution. Do not run a fresh raw import as the final release step.

## Review vocabulary

Custom UI defaults to including compatible due words. The API remains explicit
through `includeReview`; up to three due words are admitted within 30 total
targets. They must have real practice history and a legal contextual sentence;
they may have a short review context of their own. Requiring a shared sentence
with a new target starved unrelated old vocabulary in repeated-cycle testing.
Due additions are shown before starting/saving. Automatic topic
pairing preserves its ranked due selection. Saved/priority-only entries do not
become known helpers. No placement, commonness or imported POS grants admission.

See [recency cycles](2026-09-20-review-recency.md) for oldest-practice ranking,
incidental helper credit, alternate word forms, and the repeated-cycle evidence.

## Grammar

Three independent lessons teach wanting objects, wanting actions and ability.
Each shows the word selection, explanation and full generated preview. Unknown
required words are visible selected targets, never silently added helpers.
Default lessons have 24 cards: positive, negative and question blocks followed
by mixed retrieval. Conjugation, semantic compatibility, particles and English
realization are implemented in the shared TypeScript engine, without runtime AI.
Only exact reviewed verbs/senses are supported. Shoes cannot use 着る; manga
reading does not license writing/drawing; third-person inner wishes are avoided.

Grammar becomes available after six actually consumed examples covering six
distinct Japanese lines. Saving, previewing, jumping and revisiting an already
consumed position give no new credit. Review spacing is 2/4/8/16/32 days or
practice sessions, with separate spaced occasions. This is exposure-based
availability, not a tested claim of mastery. Existing basic ほしい frames remain
available when that lexical word is selected/practiced, and can now earn grammar
credit; new action-desire and potential frames require their grammar history.

Known grammar is offered to future custom/topic lessons. Due grammar asks for
six appearances; maintenance asks for two. Planning caps excess grammar when
ordinary alternatives exist, balances positive/negative/question forms, and
protects word coverage. Equivalent swaps preserve target counts. An ordinary
context may add another selected word within the usual appearance ceiling;
counts are recomputed afterward. Incompatible/insufficient grammar is reported
as deferred, never repaired with an unknown helper. Standalone grammar lessons
remain the direct way to practice a pattern when the word selection cannot.

## Evidence

See [the iteration report](../reviews/2026-09-20-adaptive/REPORT.md), complete
generated lesson packets and logs. Mechanical passes do not replace reading the
complete Japanese/English sequences or checking the real learner's saved output.
