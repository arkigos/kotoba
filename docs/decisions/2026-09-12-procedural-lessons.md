# Procedural lessons and reviews

Status: accepted direction; kernel and Next builder/player integration implemented
and tested. Broader grammar coverage and curriculum migration remain subsequent
milestones.

The subsequent simplified word-review and level implementation is specified in
`2026-09-12-word-review-and-levels.md`. It replaces the earlier rating-oriented
input adapter with automatic practice recency and a single priority preference.
References below to the initial slice lacking a scheduler describe that earlier
milestone; Next now supplies a bounded, exposure-based review adapter.

The owner wants lessons, reviews, and eventually custom lessons to be recipes
over the same sentence generator. A course supplies curated recipes; a review
supplies a pool selected from learner history. Both produce the same uninterrupted
flashcard stream. Usually one independent vocabulary choice changes per card;
occasionally two may change. Unusual meanings are acceptable within limits.
Grammar, readings, and translations must remain correct.

This direction supersedes the requirement that *future* course content be frozen
hand-authored card sequences. Existing units, saved sessions, IDs, and audio remain
valid during migration. The August player correction still applies: no quiz gate,
sampling away a lesson's intended practice, or forced self-grading.

## Architecture

```text
Curated course recipe   Library selection   Custom recipe
             \               |               /
              vocabulary + grammar + pacing
                             |
                  recipe validation / planning
                             |
                 constrained sentence structures
                             |
                  Japanese + English realization
                             |
               deterministic sequence and coverage
                             |
                   materialized session snapshot
                             |
                    shared flashcard player
```

The grammar library and word metadata are deliberately authored and reviewed.
The combinations and lesson sequences are procedural. An arbitrary vocabulary
list is not enough: every selected sense needs verified grammatical metadata.
Runtime generation must not depend on an LLM, a network, or guessing from spelling.

### 1. Lexical senses

Keep existing vocabulary IDs as the learner-history identity. Introduce separate
sense IDs for grammatical entries. One word can have multiple senses, each with
its own permissible constructions, readings, and English realization.

Metadata includes dictionary surface and reading, explicit part of speech,
conjugation class, lexical exceptions, noun roles, existence class, and verb
argument frames (the participants and particles that a particular use permits).
English metadata supplies actual noun phrases and verb inflections rather than
concatenating dictionary glosses. Irregularities belong to identified lexemes;
never assume every word ending in る is ichidan or every word ending in い is
an i-adjective.

Initial metadata is a small reviewed overlay, not an automatic conversion of the
whole runtime lexicon. Existing `function` labels are insufficient for this job.
Selecting an unknown or ambiguous sense returns a diagnostic.

### 2. Grammar constructions

A construction describes grammatical roles and dependencies, not a raw text
template with interchangeable blanks. It accepts a structured sentence and
realizes Japanese tokens, readings, explanations, English, and used grammar
together. The same structure is their common source of truth.

Hard requirements include conjugation, case frames, adjective attachment,
polarity, tense, permitted word senses, and explicitly available grammar. Later
construction families must also model aspect, counting, relative clauses,
perspective, ellipsis, politeness, and discourse conditions where relevant.
Do not claim a general Japanese grammar proof from a successful schema check.
The guarantee is limited to reviewed constructions, reviewed lexical entries,
and tested combinations of those rules.

For example, changing an existence sentence's entity from a cat to a book changes
the required predicate too. It is one independent lexical change with a dependent
surface change. Plants also need explicit existence metadata; biological
"living/nonliving" is not an adequate classifier. See the
[TUFS existence grammar](https://www.coelang.tufs.ac.jp/mt/ja/gmod/contents/explanation/005.html).

The first morphology suite includes godan sound changes, ichidan, する, 来る,
行く's exceptional te/past forms, ある's plain negative, and いい's よい stem.
The [Japan Foundation grammar reference](https://www.jpf.go.jp/j/urawa/j_rsorcs/textbook/dl/setsumei/setsumei_all.pdf)
provides paradigms for checking the implementation; its printed pp. 264–267
cover adjective forms, including いい and な-adjective attachment.

### 3. Grammatical validity and meaning

Separate hard grammatical restrictions from optional semantic preferences.
For instance, an action construction must use a verb sense licensed for its
object particle even if the object is an unusual thing to act on. A whimsical
combination must not license malformed particles, wrong inflection, or a new
meaning invented only in English.

The initial engine allowed unusual combinations within syntactic roles. The
September 13 [semantic quality correction](2026-09-13-sentence-semantic-quality.md)
supersedes that behavior for ordinary literal senses. Reviewed object properties
now constrain verbs: reading takes text, writing takes writable text, eating takes
food, and drinking takes drinks. Selected adjective senses constrain their
subjects too. Ordinary action/movement frames require a reviewed actor sense,
while places can be subjects of descriptions without becoming actors.
Metaphor and personification require a separate reviewed sense/context. These
restrictions must never silently replace requested words or expand the pool.
Pragmatically specialized constructions remain unavailable until their context
requirements are modeled. NINJAL's
[resource catalogue](https://www.ninjal.ac.jp/english/resources/search/)
lists its Basic Verb Bank as a source for future sense/frame research.

### 4. One recipe contract

A recipe contains:

- schema version, stable recipe ID, and revision;
- target sense IDs and explicitly allowed helper sense IDs;
- grammar available at the start;
- ordered phases: construction, grammatical features, length, and optional new
  grammar introduced at that boundary;
- sequence policy: default one changed slot, optionally two as a fallback;
- minimum target exposure requirements and a deterministic seed supplied at run
  time.

Targets and helpers are roles within one vocabulary pool. Course builders may
derive priorities from current and due bins; review builders may derive priorities
from actual saved word ratings and recency. These are input adapters, not separate
sentence-generation systems. The initial slice accepts explicit targets/helpers;
it does not introduce a new memory scheduler.

Only declared words may appear, including lexical grammar predicates such as
ある and いる. Derived predicate tokens retain their existing vocabulary IDs and
count toward exposure. Grammar particles do not become SRS words.

Before introducing new grammar, every target must already have appeared in the
warmup phases. A recipe that cannot achieve this fails with missing targets.
Beginners can declare foundation grammar as initially available; later course
migration must explicitly author its introduction policy.

### 5. Sequence planning

Within a phase, choose legal neighboring sentence structures, preferring exactly
one changed independent slot. Do not count conjugation, English agreement, or
derived existence predicates as additional independent changes. Prefer unmet
target exposures and less repeated candidates; use the seed to break ties.

Phase boundaries are declared teaching transitions and may change more than one
surface element. Preserve the preceding lexical bindings wherever the next
construction allows them, especially when only tense or polarity changes.
Record boundaries explicitly so they cannot conceal failed within-phase
substitution. Changing tense or construction is a grammar transition, not a word
swap. First-slice sequences keep grammatical features fixed within each phase.

Bound candidate enumeration and all search work. If the pool has no legal next
card, insufficient coverage, unavailable grammar, or exceeds the supported search
budget, return an actionable failure. Do not silently repeat one card forever,
drop requested targets, or manufacture a fallback sentence. A bounded planner can
fail even when a different sequence might exist; diagnostics must say so.

### 6. Stable sessions and saved sentences

Materialize each run into a versioned snapshot containing the recipe, seed,
engine/lexicon versions, realized cards, derivations, transitions, and exposure
report. Resume this snapshot; never regenerate an in-progress session using the
latest engine. Save generated sentence content with its derivation, not just a
card ID that assumes a frozen unit file exists.

Recipe identity, generated sentence identity, and encounter position are distinct.
Existing unit/card references remain resolvable. Migration must add snapshot
storage and a card resolver shared by Course, Library, and saved sentences before
switching their entry points to the engine.

### 7. Audio

The owner's September 12 player refresh supersedes the initial word-only pilot:
generated practice now plays the whole sentence by sequencing word clips.
Token pronunciation refers to the **realized form and reading** (e.g. 読みました),
not the dictionary form of the vocabulary ID. Preserve the shared token-cache key
convention. Use each exact recording when present and device speech for that word
when unavailable. This is word-by-word delivery, labeled as word clips/device
voice rather than a continuous studio recording.

The September 13 correction applies word sequencing to every Japanese card.
Legacy authored-card recordings are bypassed because their stable card IDs do not
guarantee matching sentence text after curriculum rewrites. Exact single-token
recordings in the dictionary registry remain reusable. Playback tracks the actual media/speech lifetime, highlights the
spoken token, stops all pending work on navigation, and suspends automatic card
advance until playback ends. Listening and mixed modes support generated cards.

## First implementation boundary

Implement a pure TypeScript engine under `packages/learning-engine/`, with no
React, network, storage, or paid generation dependency. Cover polite identity,
i/na-adjective predicates, reviewed を-object actions, に-destination movement,
and location/existence; nonpast/past, affirmative/negative, and yes/no questions.
Keep i- and na-adjective phases distinct so substitutions cannot leak new grammar.
Morphological te/plain forms are independently testable; their existence does not
enable unimplemented sentence constructions.

Supply curated sample recipes and a CLI that exports inspectable JSON and a
sentence/coverage report. This proves shared recipe execution, exception handling,
single-slot sequencing, grammar gates, diagnostics, and word-audio planning.
It does not replace all A1 content or ship a freeform grammar/recipe editor.

## Implemented player pilot

The September 12 follow-up connects four example recipes to the Next app.
Today/Course expose **Build a lesson**; learners choose targets, inspect the first
four cards, reshuffle, and launch that exact snapshot. Library's **Build new
sentences** uses its filtered vocabulary as review targets. A selection containing
words with no frozen unit source instead uses **Build review** directly. Unsupported
targets remain visible and block generation until the learner adjusts them.

The v3 state format receives additive snapshot and saved-content fields. Generated
cards resolve by encounter position from the saved snapshot, including on reload.
Word history includes recipe attribution and contributes to Library ratings and
filters, without fabricated course progress. Saved generated sentence content
survives the active session. Corrupt snapshots produce a recovery message and are
kept rather than silently replaced with different cards.

The initial pilot offered reading, recall, and rapid with individual-word audio.
The player refresh above adds sentence sequencing, listening/mixed practice, speed
controls, explicit Stop, and token highlighting. Word inspection still plays one
selected word. Inflected surface/readings stay exact; stale media failures and
pending hashes are cancelled on navigation. The original root player and frozen
course content remain available. This is a vocabulary-pool editor over reviewed
recipes, not an arbitrary grammar or unreviewed-word authoring tool.

## Migration order and release gates

1. Kernel, metadata overlay, recipe contract, deterministic tests and preview.
2. Review generated paradigms and sentences; extend sense/frame coverage. Every
   added exception needs positive and deliberately invalid examples.
3. Snapshot persistence/resolution, generated word playback, and a preview entry
   in the existing flashcard player. Verify resume, saved sentences, navigation,
   token ratings, and audio cancellation before enabling real reviews.
4. Course and Library input adapters over the same engine. Pilot a few course
   recipes with authored warmup/grammar phases and measured coverage. Preserve
   legacy profiles and references.
5. Broaden grammar family by family, then migrate A1 deliberately. Do not infer
   that morphology support means all uses of a verb are supported.
6. A custom recipe editor selects reviewed vocabulary/constructions and previews
   coverage/compatibility. Arbitrary new words require metadata review first.

The hard work moves from thousands of individual sentences to the smaller but
more consequential grammar library, lexical metadata, and lesson algorithms.
