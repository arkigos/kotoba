# Sentence semantic quality

Status: implemented September 13, 2026.

The owner reported “I read you”, “chooses the yellow”, and abrupt single-word
cards such as “Right”. The first came from the runtime engine's deliberately
permissive object slots. The latter problems came from a separate legacy
curriculum authoring script. Both required correction.

## Runtime lessons

`packages/learning-engine/` generates a sentence structure from reviewed lexical
senses and construction rules. Japanese and English are independently realized
from that same structure. There is no runtime model call or sentence-bank lookup.

For example, `{ subject: watashi, object: hon, verb: yomu }` in a positive past
action produces `私はほんを読みました` and `I read the book`. Japanese conjugation
produces 読みました; the English renderer selects the independently stored past
form `read`. A different subject can change English agreement without adding an
unrelated Japanese word. Grammar rules and lexical inflection metadata are
authored; combinations and seeded practice sequences are generated.

Engine 0.4.0 and lexicon `dictionary-3-semantics` add explicit semantic properties:

| Reviewed property | Example senses | Licensed ordinary action |
| --- | --- | --- |
| text | books, newspapers, Japanese, hiragana | read |
| writing | books, Japanese, hiragana | write |
| food | rice, bread, vegetables | eat |
| drink | water, tea, coffee, milk | drink |

The text/writing distinction prevents “write the newspaper” from being assumed
merely because a newspaper is readable. People remain syntactically capable of
being objects; the particular verb sense decides whether they are appropriate.
Describing someone as delicious or expensive is excluded from the ordinary
literal senses. 古い's “old” sense applies to things/places, not a person's age.
Identity sentences cannot equate people with objects, use “me”/“you” as generic
occupation predicates, or repeat the same sense on both sides.

These properties are reviewed metadata keyed by stable word/sense identity.
Imported part-of-speech labels never imply generation eligibility. Missing object
compatibility metadata rejects a transitive verb. Incompatible combinations are
filtered before sequencing and rejected when directly realizing a structure.
The builder can query `fitsConstructionPool` to show usable word choices.

Restricted candidate graphs may require a smaller vocabulary selection or a
different template. The planner must report that instead of inserting an invalid
sentence, dropping a target, or substituting a different word.

All eight current builder templates were inspected and exercised at twelve seeds:
96 generated sessions, 2,340 cards. The audit checks literal compatibility,
isolated fragments, and tautological identity; it is not a proof of universal
Japanese grammar. These constructions remain A1; selecting a higher vocabulary
ceiling does not create B2 grammar.

## Frozen Course content

The existing 49 A1 units contain 4,236 materialized cards. They were authored by
`scripts/rebuild-marugoto-starter-a1.mjs` and are served as stored JSON. They are
not produced by the runtime builder on each visit.

That legacy script guessed broad categories from imported glosses and defaulted
unclassified entries to nouns. A second fallback licensed every noun/proper name
for “choose” and “show”. Thus colors, discourse markers, questions, quantities,
and imported adjective notation all became objects. Another fallback forced
review words into isolated glossary cards, regardless of their surrounding
sentences. Syntactic schema checks could not catch these meaning errors.

The generic choose/show fallback now requires reviewed object eligibility.
`scripts/lib/starter-semantic-repairs.mjs` supplies explicit reviewed contexts
for affected senses and runs after future rebuilds as well as existing repairs.
This is a bounded correction to the old authoring path, not a claim that all
legacy senses have been migrated to the new engine.

The pass repaired 420 cards while preserving every card ID and position. Examples:

- “The teacher chooses the yellow” → “The teacher chooses the yellow kimono”,
  with きいろの着物 in Japanese.
- “Right” → “The restaurant is on the right”, with レストランはみぎです.
- “The engineer shows the yes” → “Yes, I understand Japanese”.
- “The student chooses the hundred” → an explicit price in yen.
- “There is two people…” → “There are two students”, using 二人 and います.

A sequence pass varies reviewed lexical bindings when repeated targets would
produce duplicate sentences. It only uses helpers already introduced before that
card. This also prevents a location context from first teaching both “box” and
“inside” together; the first “inside” example can use the already familiar house.
The same pass runs during future rebuilds and rejects an exhausted context pool.

149 isolated nonphrase cards now have sentence context. The audit still reports
125 isolated nonphrase cards, chiefly number/counter drills and early time-word
cards. They have not been quietly reclassified as sentences. Early “yesterday”
cards are left for a deliberate grammar/pacing revision rather than silently
introducing the past tense before its course lesson. Remaining imported senses
and old English glosses still need review.

Changed sentence audio references are discarded. Word tokens retain exact
realized readings. Audio manifests were synchronized after the repairs. Existing
materialized custom-session snapshots intentionally retain their original content;
newly built sessions use the corrected engine.

## Verification and authoring commands

- `node scripts/audit-procedural-naturalness.mjs`: regenerate the eight templates
  across fixed seeds and check the reviewed compatibility/pacing rules.
- `node scripts/audit-sentence-naturalness.mjs --strict`: report remaining unsafe
  reviewed object uses and isolated nonphrase cards in frozen content.
- `node scripts/audit-sentence-naturalness.mjs --write --strict`: apply the bounded
  reviewed corrections without renumbering or rearranging cards.
- `node scripts/sync-assets.mjs`: refresh manifests after content edits.

The final repair pass is idempotent. The 43 engine tests and seven legacy-context
regression tests passed, including malformed inputs, exact bilingual color
attachment, absence of undeclared helper words, stale sentence audio removal,
stable card identity, unique sentence contexts, and one new word per introduction.
All 33 curriculum tests passed, including both sequence invariants across every
unit. Curriculum and asset schema validation passed.
