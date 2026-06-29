# Curriculum Sentence Inquisition

## Goal

Find and fix authored cards whose Japanese, English, or word pairing is technically valid but pedagogically poor.

## Completed Changes

- Reworked Unit 2 choice cards that compared names, roles, and broad categories such as "person" or "thing".
- Replaced weak mixed-category pairings such as living-being plus object, object plus place, and country plus local place.
- Reworded or repaired vague Unit 6 demonstrative cards using "thing" and time phrases.
- Repaired Unit 7 "company/school's person" and "whose thing" cards with concrete person/noun phrasing.
- Repaired Unit 12 adjective questions so person adjectives ask `who`, general adjectives ask `what`, and place-suitable adjectives keep `where`.
- Added hard audit checks for these offender classes.
- Updated the relevant source generators so regeneration keeps the fixes.

## Verification

- `npm run validate:all`
- `npm run test -- --run`
- `npm run build`
