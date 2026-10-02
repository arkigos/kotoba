# Procedural lesson kernel

An initial, deliberately limited implementation of the
[shared lesson/review design](../../docs/decisions/2026-09-12-procedural-lessons.md).
It powers the Next app's lesson/review builder and materialized session storage.

## Try it

Run `npm run next:dev` and open `http://127.0.0.1:4175/#build`. Choose a pattern,
adjust its target words, preview a sequence, and start the lesson. From Library,
filter encountered words and select **Build new sentences** for an ad hoc review.
The builder has eight starting patterns: reading/writing, meals, drinks, movement,
existence, i-adjective descriptions, identities, and na-adjective descriptions.
Choose quick, balanced, or deep practice and a guided mix or focused grammar form.
Every sentence is previewed in Japanese and English and can launch its exact
encounter position. Word selection uses searchable tiles instead of dropdowns.

```sh
npm run lessons:preview
npm run lessons:preview -- --recipe existence --seed 42
npm run lessons:preview -- --recipe adjectives
npm run lessons:preview -- --recipe movement
npm run lessons:preview -- --recipe review --words yomu,kaku --seed 8
npx vitest run tests/procedural-engine.test.ts
```

The CLI writes a Markdown review and a materialized JSON snapshot under
`docs/reviews/procedural/`. These are ignored working outputs. A recipe name
selects a curated example; `review` demonstrates an ad hoc target-word adapter
within the reviewed classroom construction. It is not a general grammar selector
for arbitrary vocabulary.

```ts
import { generateSession, wordAudioPlan } from "./index";
import { exampleLexicon, exampleRecipes } from "./examples";

const snapshot = generateSession(exampleRecipes.classroom, exampleLexicon, 42);
const card = snapshot.cards[0];
const wordPrompts = wordAudioPlan(card);
```

## Responsibilities

- `types.ts`: reviewed lexical metadata, recipes, snapshots, diagnostics.
- `morphology.ts`: explicit verb classes, irregularities, adjective forms.
- `grammar.ts`: slot eligibility, grammar gates, Japanese/English realization.
- `levels.ts`: authored JF/CEFR-inspired word/grammar ceilings and sentence bounds.
- `sequence.ts`: recipe validation, bounded candidate planning, seeded neighboring
  substitutions, coverage, stable sentence IDs, word-audio plans.
- `examples.ts`: 53 reviewed senses resolving canonical dictionary entries
  through stable learning IDs, four example lesson recipes, and an ad hoc review
  adapter. Reviewed conjugation, argument roles, and English realization remain
  explicit engine metadata.

The engine is browser-safe TypeScript. It never calls an LLM, network, speech API,
or storage API. Generated cards structurally satisfy both current player types,
with additional derivation and audio-policy metadata. The Next app's
`generated.ts` adapter resolves stored cards directly; the original root player
still consumes frozen units. Both players resolve word metadata and pronunciation
through the shared dictionary, preserving authored card surfaces and readings.

## Dictionary boundary

The shared dictionary contains the complete imported English JMdict: 218,765
entries and 253,581 senses in the pinned September 12, 2026 edition. It supports
reference lookup, alternate spellings/readings, and definitions. That breadth
does not authorize every entry for sentence generation: only the 53 reviewed
senses in `examples.ts` have the required grammar and semantic metadata.

`data/jp/dictionary/teaching_words.json` owns authored teaching forms, glosses,
levels, and stable learning IDs. Derived bindings connect those selections to
JMdict or explicit local entries. A spelling alias or polite form can share a
canonical entry while retaining its learning ID and exact pronunciation.
Unplaced reference entries receive no automatic A1 classification. Word and
construction levels remain authored JF/CEFR-inspired limits; imported POS alone
cannot determine a word's course placement or license its grammatical use.

## Current limits

- Six constructions: identity, i/na-adjective predicates, を-object actions,
  に-destination motion, and location/existence. All sentence predicates are polite.
- All implemented grammar and the 53 reviewed senses are A1. The builder exposes
  that available level honestly. The engine still accepts A1–C2 ceilings, which
  constrain words, grammar, content-word length, clauses, and depth. Higher
  ceilings do not enable missing constructions. Unknown/unclassified words are
  rejected when a level is declared.
- Nonpast/past, affirmative/negative, and yes/no questions. Plain and te morphology
  has tests but does not enable those sentence constructions.
- One-slot changes preferred inside each phase. Two-slot fallback can be allowed
  by a recipe, but the initial independent-slot constructions rarely need it.
  Declared phase boundaries can change the construction/features; preceding
  lexical bindings are preserved wherever the next construction allows them.
- Every card must contain at least one target. Every target must meet its exposure
  floor before a run succeeds, and must appear before new grammar is introduced.
- Per-target `targetExposures` may override the default floor. Next's automatic
  review adapter uses this for up to two known-word additions, with four exposures
  each, without lowering the core target requirements. The pure kernel does not
  read learner history; `apps/learner-next/src/review.ts` owns review scheduling.
- Builder length choices adjust declared phase lengths and exposure floors.
  Larger explicit target pools grow the phase budget rather than silently losing
  selected words. A new grammar focus retains an affirmative warmup first.
  Automatic review additions fit inside that chosen lesson budget or are deferred.
  Unsupported imported selections stay visible until the learner removes them or
  explicitly chooses **Use compatible words**.
- Maximum 80 senses, 30 phases, 300 cards, and 20,000 Cartesian candidates per
  phase. Generation fails before enumeration when a phase exceeds its budget.
- A greedy bounded walk can report a coverage shortfall even when another walk
  could meet the target. It returns no partial session as a successful result.
- Semantics can be unusual. Slot/frame restrictions remain mandatory. Metadata is
  reviewed authoring input; schema validation is not proof that arbitrary supplied
  lexical metadata or English glosses are linguistically correct.

`coverage` counts each sense once per card. `wordCoverage` counts each existing
vocabulary ID once per card even if multiple senses/tokens use it. Helpers and
derived existence predicates are included. Helpers have no exposure quota.

Snapshot IDs contain engine/lexicon versions and losslessly encoded sentence
choices. They are independent of recipe/seed and may repeat at separate encounter
positions. Treat the array position as the encounter; preserve the snapshot to
resume it. Bump lexicon or engine versions when their behavior changes.

The builder release uses engine `0.3.0` and lexicon `dictionary-2`. Old stored
snapshots resume their original cards. Review snapshots additionally carry the
selected words, reasons, and deferred words. See the
[word-review decision](../../docs/decisions/2026-09-12-word-review-and-levels.md)
for the exposure-based timing policy and the
[canonical dictionary decision](../../docs/decisions/2026-09-12-canonical-dictionary.md)
for authoring, identity, and source attribution.

## Word audio

Generated lexical tokens carry their stable learning ID and canonical dictionary
entry ID beside the realized surface and reading. The player first resolves an
exact recording through `packages/dictionary/audio.ts` and the shared
`data/jp/dictionary/audio.json` catalog. Pronunciation identity includes the entry,
reading, spoken text, and variant; repeated spellings and lesson uses reuse files.
The lemma 読む and an inflected token 読みます share an entry but require different
recordings. Missing inflected audio must never become the lemma recording.

`wordAudioPlan` still exposes realized word prompts and legacy cache keys for
compatibility. The Next player retains explicit token audio references and the
old SHA-1 token cache as fallbacks after canonical resolution. If no recording is
available, it speaks **that individual word** using its realized reading.
Authored `audioText` handles display notation and recognition labels; it does not
replace the pronunciation of an inflected form.

The Next player also assembles sentence playback from the exact realized tokens,
in order, including particles. This enables sentence-listening practice without
inventing generated-card recording paths. Missing recordings use device speech
for the affected token. Navigation cancels pending pronunciation lookups and
playback. No paid audio is generated here.
