# Marugoto Starter A1 Rebuild

## Goal

Rebuild the active A1 level as a Marugoto Starter-inspired course while keeping
Kotoba's validated unit data contract intact.

## Scope

- Update A1 level metadata to identify the level as Marugoto Starter-inspired.
- Replace the 20 active A1 standard units with a full Starter topic level.
- Use vocabulary drawn from Marugoto Starter topics, including specific places,
  culture nouns, and travel/shopping nouns when pedagogically useful.
- Keep no production audio generation in this pass.
- Update durable authoring guidance so review words can appear in richer,
  multi-known-word constructions instead of cautious one-word review frames.

## Unit Shape

- Use Units 1-49 for the rebuilt A1 level after collapsing duplicate spelling
  and romaji variants into one SRS vocabulary key.
- Keep each standard unit within the current 10-12 tracked new-word validator
  limit when possible. Generated Marugoto supplemental units may carry up to 13
  words when that preserves coherent source-topic buckets instead of creating
  underloaded orphan units.
- Generate enough cards per unit to cover new, review-due, and contextual helper
  words without turning review into isolated vocabulary rows.
- Keep current words gentle on first contact.
- Make scheduled review cards bolder by freely combining review words with
  other known vocabulary and cumulative grammar.
- Build cards from semantic affordances: scripts/languages with understand,
  read, write, and study; food with eat, drink, buy, like, and want; places with
  go, arrive, live, stay, and meet; media with watch, listen, read, and choose;
  people with meet, speak, ask, work, and live.

## Current Outcome

- A1 contains 49 units, 578 unique tracked Starter words, and 4236 cards.
- Units 21-49 carry the supplemental Starter Activities index words in
  Marugoto lesson-topic buckets after duplicate kana, kanji, and romaji variants
  are collapsed.
- Unit 1 now introduces useful language-learning actions such as understand,
  read, and write instead of relying on bare `N desu` repetition.
- The full-level semantic audit writes `docs/reviews/semantic_audit_summary.md`,
  and `npm run review:all` exports one review packet per standard unit.

## Verification

- `npm run validate:curriculum`
- `npm run audit:curriculum-source`
- `npm run audit:curriculum-semantics`
- `npm run audit:level-alignment`
- `npm run test`
