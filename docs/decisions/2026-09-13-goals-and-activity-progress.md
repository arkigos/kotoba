# Goals and activity progress

The learner has a Goals page and a compact Goals/streak panel on Today. Targets
can measure lesson cards, new words, reviewed words, completed lessons, practice
days, studied kanji, or completed activity rounds. Each target is daily, weekly,
or total. There is one editable target per metric/period combination. No target
or activity is invented for a new profile.

Daily/weekly windows use local calendar days. Weeks start Monday. Total targets
include previously recorded work. Current streaks may end yesterday until today
finishes; longest streaks are computed from distinct valid practice dates. Date
arithmetic uses calendar boundaries, not elapsed 24-hour durations. The app
refreshes calendar-dependent displays when returning to the page and each minute.

Completing a game round records its stable ID, first-try accuracy, attempted word
IDs, missed word IDs, date, and active duration. Skipped/unavailable audio earns no
question or word credit. Abandoned rounds and page visits earn none. A bounded
200-result history powers Recent results; daily aggregates keep compact round IDs
so an old completion cannot be counted again after leaving that display history.
Games update word encounters, correct/miss counters and review occasions, while
preserving active lessons and Course progress. Review occasions remain spaced by
24 hours; repeating a round does not simulate several spaced reviews.

New/reviewed word counters combine lesson and game activity by distinct learning
ID. A word first practiced today is not also labeled reviewed on that same day.
Card counts remain actual lesson-card practice; games have their own round count.
Kanji study records require the explicit study/review button or an answered quiz.
Viewing the collection alone does not count. A previously studied character can
be reviewed on another day without increasing the distinct lifetime total.

All fields are additive to local learner schema version 3: `learningGoals`,
`activityResults`, `activityDays`, `kanjiProgress`, and `courseRevisions`. They are
included in the existing backup export. Browser storage failures use the existing
visible warning and export action.

Only built/generated lessons expose explicit saving. Course lessons remain in
Course and recent practice; their old bookmark flags are removed on read without
removing the session or its progress. The first kanji deck has a one-time revision
migration from 20 to 50 cards: stable original items, scores and positions remain,
the new 30 are appended, and existing coverage is rebased. Historical 20-card
completion remains a valid historical activity; the expanded current deck opens
at its remaining material.

Activities and Goals appear in desktop navigation. Phone navigation keeps five
usable destinations; More contains Build, Library, Lessons, and Settings. Font
families and the established page structure remain unchanged.

Related decisions: [games](2026-09-13-games-and-activities.md),
[kanji](2026-09-13-kanji-atlas.md), [word pools](2026-09-13-builder-vocabulary.md),
and [generated watercolor assets and prompts](2026-09-13-watercolor-artwork.md).
