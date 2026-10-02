# Selected or practiced vocabulary only

The owner explicitly requires code-enforced vocabulary boundaries. This decision
supersedes the former two-unknown-helpers-per-card/six-per-lesson allowance in the
topic, density, and connected-selection decisions. An edge case may require more
words, but those words must be selected as lesson targets before use.

`lesson-vocabulary.ts` owns admission for Custom and Topics. Every content token
must resolve to an explicit target or a word with actual practice history.
Reviewed A1 aliases retain their established equivalence; individually selected
aliases retain separate counts. Priority, saving, and dictionary inspection do
not make words known. Authored function forms and punctuation are admitted
separately. Unlinked lexical tokens are rejected rather than escaping accounting.
The complete resulting sequence is checked again before materialization.

If no safe sentence exists, the exact selected word remains usable as a word
card. The builder does not invent a sentence or insert a pronoun to fill a slot.
Oversized Custom counts that repeat any bilingual card more than eight times
produce an actionable request to reduce the count or select more words.

App replay preparation checks the same vocabulary rule for older topic/custom
snapshots against current practice history. Unsafe snapshots remain stored, but
cannot be launched; rebuilding from the selected words creates a safe lesson.

Planning is deterministic code. A bounded pair exchange reduces repeated
sentence pairs without changing per-target occurrence counts or adding helpers.
An introduction pass brings every target into the first target-count cards.
Continuity smoothing preserves those introduction deadlines and later revisits.

Frozen context defects are repaired at the shared authoring layer, not hidden by
editing only Custom's English. Supplemental authoring now takes word roles,
teaching forms, and meanings from canonical teaching metadata; it no longer
guesses adjectives from an `い` ending (which misclassified `とけい`). Reviewed
repairs fix predicate notation, liking constructions, shopping agreement,
implausible adjective pairings, missing English objects, and imported gloss text.
Learning IDs, unit ordering, and card positions remain stable. Exact audio is
reused via the dictionary audio command, including a reviewed local-to-JMdict
binding correction, without substituting a lemma recording for an inflection.

`node scripts/audit-custom-lessons.mjs --strict-content` exercises every authored
A1 ID across fresh, partly practiced, and fully practiced profiles. The audit
requires zero unfamiliar extras, accurate coverage, early introductions, exact
saved replay, and zero known content regression patterns. The 480-card single-word
stress cases must fail rather than produce repetition floods.
