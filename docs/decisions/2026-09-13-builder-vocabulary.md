# Builder vocabulary and word-pool filters

The builder's vocabulary is not limited to learner history. Its limit is the
explicit reviewed lexicon and the sentence roles supported by a template.
Dictionary membership or an imported part-of-speech tag does not independently
make a word eligible for generated sentences.

The builder now defaults to **All compatible words**, with **My words** and
**New words** as optional filters. My words means saved or previously encountered;
it does not claim mastery. Changing filters preserves target selections and shows
when selected words are hidden.

Engine 0.5.0 and lexicon `dictionary-4-reviewed-expansion` use
`packages/learning-engine/reviewed-vocabulary.ts` for authored canonical senses
for family members, occupations, locations, food, drinks, objects, clothing,
reading material, media, verbs, and adjectives. The versioned engine lexicon has
242 entries; 241 currently participate in builder templates. The plain する entry
remains available to morphology tests but has no unsupported free-form frame.
The general Actions template supplies compatible helper types for a broader
selection than the specialized Reading, Eating, and Drinking templates.

Each added noun has explicit semantic properties, sentence roles, existence class
where needed, and English agreement and phrase forms. Each verb has an authored
argument frame and object constraints. The English renderer handles definite
family references as ordinary location statements: 公園に父がいます becomes
“My father is in the park,” rather than a literal indefinite “there is” sentence.
Clothing used with 着る is distinguished from trousers, skirts, and footwear;
size adjectives do not treat an unbounded mass such as water as a countable item.

No learner IDs, frozen course cards, or dictionary placements are replaced by
this expansion. New recordings are not fabricated: existing exact form clips
and the existing device-pronunciation fallback remain responsible for audio.

Run `node scripts/audit-builder-vocabulary.mjs` to build a short review for every
advertised sense and check actual exposure and semantic compatibility. It
currently covers 2,892 generated cards. This establishes supported literal uses,
not comprehensive Japanese grammar or world knowledge.
