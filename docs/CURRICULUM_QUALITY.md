# Curriculum Quality

Kotoba units should feel repetitive, not mechanical. Repetition is useful only
when the sentence still has a reason to exist.

## Vocabulary Buckets

For unit `N`, author with three vocabulary pools:

- `current`: the 10 new words introduced by unit `N`; these get the spotlight.
- `reviewDue`: words from `N-2`, `N-4`, `N-8`, `N-16`, and so on; these must return.
- `helpers`: all words from units `1...N`; these may appear when they make the card clearer or more natural.

The spaced repetition system is curriculum-level. It is a minimum return
schedule for authored units, not adaptive learner scheduling. Learner-level SRS
would require card scoring, due dates, review queues, and missed-card practice.

## Taste Rules

Prefer sentences that do at least one useful job:

- identify something a person would actually ask about
- show possession, contrast, time, or social context
- make the current grammar pattern easier to feel
- bring back review-due words in a natural setting
- create a small scene with visible roles or objects
- introduce only one genuinely new learner-facing element at a time; known
  review words are the cushion that makes new vocabulary or grammar feel safe

Avoid overusing:

- bare `Xです` vocabulary introductions after the foundation units
- sterile category cards such as `X is an object/person/place`
- review-due vocabulary cards that behave like new-word introductions
- long chains that exist only because the generator can make them
- repeated English cards with only tiny noun swaps
- English translations that add missing answers or scene facts instead of
  translating the Japanese line semantically
- notes that describe the lesson sequence instead of teaching the learner

When generating drill-heavy units, rotate sentence axes independently. Subject,
target word, polarity, time, and place should not all advance in the same
lockstep cycle, because that creates repeated English with only hidden template
machinery underneath.

## Verb And Level Balance

Kotoba's level labels are CEFR-inspired / JF-aligned signposts, not official
certification claims. Treat them as Can-do alignment checks:

- A1 should make simple identification, questions, description, existence,
  location, time, counting, and basic action sentences feel usable. It may lean
  on `です` early, but no unit should become pure noun-labeling.
- Every A1 unit needs a small verb lane. Units 1-14 include at least two early
  whole-sentence action cards using `Vます` / `Vました`; Units 15-20 may satisfy
  the lane with `あります` / `います` existence practice when that is the grammar
  focus.
- A2 should visibly shift into everyday action control: polite verbs, objects,
  destinations, action location, time, frequency, wants, requests, permission,
  prohibition, te-form, and ongoing/resulting state.
- Early action cards are a bridge, not a dump. Keep them short, concrete, and
  modular, and do not let them crowd out the current unit's main grammar work.
- Keep action previews modular. Prefer a stable sentence frame where only the
  noun, person, place, adjective, or verb slot changes.
- Use `npm run audit:level-alignment` after authoring or regenerating a level
  band to check verb distribution, `です` reliance, existence practice, and form
  sequencing.

## Unit Shape

A strong unit usually has:

1. A short landing zone for new words with familiar grammar.
2. Practical cards that use current words with older grammar.
3. Required review-due words woven into real sentence contexts.
4. The new grammar focus after the learner has enough nouns to use it.
5. Mixed cards that feel like questions, claims, memories, ownership, or contrast.

Do not add more units by volume alone. Units 1-7 are the taste baseline: new
units should be at least as natural as Unit 6 after its polish pass.
