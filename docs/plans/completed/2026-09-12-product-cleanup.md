# Product cleanup — September 12, 2026

The owner wants a quieter, credible practice app: remove forced coaching,
placeholder features, and unsupported learning claims while preserving the
current visual identity and complete authored lesson player.

## Scope

- Simplify Today, Course, Library, profile, and lesson copy.
- Remove pretend dialogue, notifications, placement, download, and report actions.
- Show recorded progress and word ratings instead of invented memory scores,
  padded review counts, and motivational points.
- Start new profiles empty, including in development; preserve existing saved
  profiles and clearly identify earlier sample history when present.
- Keep lesson settings that actually affect the player; remove setup questions
  whose answers do not affect anything.
- Reduce decorative surfaces and oversized headings, then check desktop/mobile.

## Verification

- `npm run next:test`, `npm run next:build`
- `npm run test`, `npm run test:e2e`, `npm run build`
- Browser checks for Today, Course search/detail, Library, profile, and practice
  navigation/settings at desktop and mobile widths; dark theme.
- Preserve existing dirty work and curriculum IDs/content.

## Status

- Initial audit found automatic development sample history, fabricated skill
  percentages, padded due counts, and several controls with no implementation.
- Local server started on port 4175.

## Completed

- Replaced coaching slogans with short, literal copy throughout the shell and
  lesson player. Kept the cream/plum/coral identity with smaller headings,
  reduced decoration, more readable labels, and fewer panels.
- Today has one course start/resume action, mode choices, exact saved position,
  recorded weekly activity, and links to Course/Library.
- Removed invented due/skill scores, points displays, fake activity intensity,
  pretend dialogues/notifications, and unimplemented placement/download/report
  buttons. Removed unused setup questions and inactive adaptive settings.
- Moved demo state into explicit test fixtures. New profiles and migrations no
  longer inject history; existing version-three snapshots are preserved. A
  notice identifies snapshots containing recognizable demo attempt IDs. Older
  mixed history cannot always be separated reliably and is not erased.
- Fixed empty Course search results, unfiltered course totals, current saved-word
  filtering, empty review actions, mode selection before resume, mobile search
  labeling, and scroll position when opening the lesson player.
- Added a factual dated practice calendar and plain word-rating counts.
- Removed 120 obsolete CSS rules and unused scene/skill helpers.

## Verification results

- `npm run next:test`: 26 passed (including fresh profile, storage preservation,
  empty Library, search state, full-deck resume, and preset persistence).
- `npm run test`: 93 passed across both apps.
- `npm run test:e2e`: passed (jsdom practice-flow coverage).
- `npm run build` and `npm run next:build`: passed.
- Browser checked at the desktop viewport and 390×844: Today, Library, Course,
  unit details, profile, Japanese/English lesson faces, exact-card resume, and
  lesson settings; light and dark themes. Mobile Library document width equals
  the viewport width (375 CSS pixels excluding the scrollbar).
- Existing local lesson remained at card 4 of 80, with saved items intact.
- Curriculum content and IDs were not changed.
