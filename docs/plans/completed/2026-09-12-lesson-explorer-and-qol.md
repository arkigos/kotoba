# Lesson explorer, playback, and usability

The owner requested a substantial development pass: a bilingual sentence page for
every lesson with start-at-sentence navigation, working sentence playback for
frozen and procedural content, a richer builder, and fewer awkward dropdowns and
obsolete controls. Preserve existing local progress, curriculum IDs, and all
unrelated work already present in this checkout.

## Work streams

- Add addressable course lesson pages and an explorer for the active generated or
  Library session: search, translations, save, playback, and exact-card launch.
- Repair sentence playback with existing whole-sentence recordings where valid,
  exact pronunciation clips in sequence otherwise, and cancellable device speech
  fallback. Restore generated listening mode and simplify player controls.
- Rework the builder around visible patterns, searchable word selection, useful
  supported controls, and a much more complete preview.
- Polish Library/dictionary selection, filters, review actions, shell navigation,
  saved-sentence behavior, and responsive presentation.

## Verification

Use focused behavior tests and the Next build, then the existing root checks as
appropriate. Check the main routes at desktop and mobile widths. The owner asked
to prioritize implementation over exhaustive verification. No curriculum rebuild
or paid audio batch is required.

## Completed

- Added full bilingual lesson pages, searchable by Japanese, reading, English,
  and sentence number, with word filters, optional readings/change highlights,
  bookmarks, playback, copy, and text export. Course, Today, grammar, global
  search, and the player lead to these pages.
- Added exact-index launch for full course decks and stored generated/review
  sessions. Saved generated sentences replay from their materialized content.
- Replaced generated word-only playback with full sentence playback through exact
  pronunciation clips. Frozen recordings remain the first choice; missing clips
  use device speech. No paid audio generation was performed.
- Added stop/loading feedback, token highlighting, playback speed, script chips,
  simultaneous translation, nearby-card navigation, and pauseable automatic flow.
- Counted distinct viewed cards so jumping ahead does not create false completion.
- Rebuilt the builder with eight patterns, 53 explicitly reviewed word senses,
  length and grammar controls, full preview, search, and compatibility cleanup.
- Reworked Library/dictionary filtering, selection, bulk save/prioritize/copy,
  review actions, discovery, and taught-form choices. A newly saved authored word
  can use its existing course sentences before its first encounter.
- Replaced native dropdowns, added Build navigation, removed unavailable course
  tabs and the obsolete unit sheet, and corrected saved-sentence row actions.

## Verification results

- `npm run test`: 195 passed across 41 reported suites, including both apps,
  practice flow, dictionary, procedural grammar, and new integration checks.
- `npm run build` and `npm run next:build`: passed. Existing large-bundle warning
  remains; no new dependencies were added.
- Browser checked course/explorer, generated player and sequence browser, builder,
  populated Library, light/dark themes, and phone layout. Confirmed exact sentence
  20 launch, search filtering, full generated playback state, and no horizontal
  overflow in the phone player. Compact desktop player controls stay visible.
- Existing curriculum IDs/content and unrelated checkout work were retained.

## Practical limits

September 13 correction: the owner reported mismatched legacy sentence audio in
early lessons. Next playback now bypasses all card-level recording refs and paths,
always sequencing current tokens with highlights. Single-word inspection also
avoids card recordings; verified dictionary/kana clips remain reusable. Regression
coverage includes both inferred and explicit old sentence refs and actual Unit 1.

- Word sequences preserve exact readings but have individual-word prosody.
  Missing recordings depend on the device's speech capabilities.
- The broader dictionary remains a reference source; only the 53 reviewed senses
  are admitted to procedural construction. Frozen course reviews support the
  wider authored vocabulary without relaxing grammar eligibility.
