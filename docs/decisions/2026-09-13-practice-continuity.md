# Practice continuity, activity, and direct controls

Implemented in the active `apps/learner-next` app.

## Topic lessons and shared access

The primary destinations are now **Topics**, **My lessons**, and **Lesson
builder**. Topics chooses what to study; My lessons holds the exact lessons the
learner created or practiced. Existing `#course`, `#lessons`, and `#build` URLs
and internal navigation keys stay valid, preserving saved links and progress.

Materialized topic lessons are saved automatically when launched. Topic previews
can also be saved for later without opening practice, replacing the current
session, or adding learning credit. Saving the same lesson identity again keeps
its existing cards and latest cursor. Topic lessons use the same bookmark
retention rule as explicitly saved built lessons and are not evicted by the
recent-session count or byte limits.

Today and Topics share `RecentLessonShelf`, with the same `LessonRows` used by
My lessons. It includes the current lesson, resume/replay, card browsing, and
saved status, plus a direct My lessons link. `CourseView` forwards the optional
`lessonShelf` node and `onSaveSession` callback into `TopicCourseView`; App owns
storage and navigation. The original authored units remain the sentence
reference, with their existing course progress.

## Lessons and saving

Every started course, built, Library, or saved-sentence session is remembered in
`LearnerState.lessonHistory`. The Lessons destination provides resume/replay,
sentence browsing, rename, save/unsave, search, and removal. The builder also
saves its named preview without starting practice. Starting that same saved
preview reuses its lesson identity rather than creating a second saved entry.

An `ActiveSession.lessonId` is the stable shelf identity; each replay gets a new
practice-session ID and review occasion sequence. Generated snapshots preserve
their exact cards and seed. Saved-sentence reviews use `source: "saved"` and
`savedCards`, never fake generated derivations or a different course card. Course
and ordinary Library reviews keep their source card IDs.

Up to 12 unsaved recent sessions are retained, bounded to about 2 MB of serialized
UTF-16 data. Explicitly saved lessons are not evicted by this limit. Storage errors
are visible with a backup export action; they do not silently erase earlier data.
All data remains local to the browser origin. Export includes saved sessions.
Large materialized lesson histories use a lossless card/token pool while
runtime sessions and backups retain full cards. The [storage decision](2026-09-13-saved-lesson-storage.md)
documents measured capacity, compatibility, and recovery without overwriting
unrelated progress.

## Activity and review

Today contains actual daily card practice, distinct new words, distinct reviewed
words, completed sessions, recent sessions, Course continuation, review sets,
and seven-day/five-week activity. Settings has its own destination; there is no
profile-name editor or separate decorative profile page.

`dailyPractice` is recorded only when practicing a card. Inspection, bookmarks,
priority changes, and sentence-list jumps do not count. Repeating a new word on
its first day does not also count it as a reviewed word. Earlier daily card totals
are not invented from XP or word encounters; detailed counts start with this
feature while existing practice days and Course completion remain intact.

`practicedIndices` tracks distinct positions within the exact session. Reaching
the last card after skipping shows “End of lesson” and offers unpracticed cards;
it does not claim the entire lesson was completed. Elapsed time including an
overnight pause is no longer presented as study time.

Review sets live on Today. Library remains words, dictionary, and saved sentences;
the former Grammar tab merely linked to Course and has been removed. Saved
sentences are a handpicked review queue: play one or practice the filtered set
in mixed, listening, or recall mode without moving Course progress.

Course lessons remain curated sequences. Library reviews prefer coverage of the
selected vocabulary and avoid duplicate bilingual sentences across units. For
words without course examples, quick procedural reviews try compatible reviewed
templates, preserve the requested card count/mode, and disclose omitted words.
Unsupported selections can still be opened in the builder for editing.

## Controls and copy

Builder templates filter by their actual grammar level. Current templates are
A1; B2 does not silently receive an A1 template with a new label. Card counts are
explicit (6–120) and constrained previews explain when more room is required.
Grammar forms, supporting words, and automatic review additions are visible.

Library filters include available level, word type, dictionary/reviewed topic
tags, practice source, interaction history, and saved/priority/due status.
Prioritize is the consistent action and means a shorter review interval.
Imported tags help search/filter; they never grant sentence-generation eligibility.

Labels describe the action or content. Promotional copy has been removed from
functional pages; encouragement belongs on Today and uses actual activity.

## Sentence audio

Playback always follows current realized tokens; stable legacy card IDs cannot
select a stale sentence recording. Ready word clips are decoded and scheduled
on one audio clock. Short energy windows detect quiet edges with conservative
speech padding, plus 12 ms between clips. Highlights follow that clock and speed.
The cache is bounded, cancellation clears scheduled sources/timers, and exact
word recording/device-voice fallback remains available.

See [sentence semantic quality](2026-09-13-sentence-semantic-quality.md) for the
separate runtime and frozen-content audit, repairs, and remaining limitations.
