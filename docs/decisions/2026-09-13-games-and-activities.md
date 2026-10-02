# Games and activities

## Purpose

The Games page offers brief activities that can use the learner’s vocabulary
without requiring sentence-generation metadata. Sentence construction remains a
separate, more constrained feature. Games never turn imported dictionary tags
into authorization to generate sentences.

## Research and design

The Learning Scientists recommend attempting retrieval before looking at an
answer, checking the answer for feedback, and returning to the material later.
Their advice informed the hidden-answer listening questions, correction screens,
and separate retry rounds. Matching visible tiles primarily practices recognition;
we do not describe it as free recall or claim that either game replaces contextual
sentence practice. Source: [Megan Smith and Yana Weinstein, Retrieval Practice](https://www.learningscientists.org/blog/2016/6/23-1).

Anki’s own documentation distinguishes attempting to remember from simply
rereading, and explains that review scheduling depends on the learner’s previous
responses. That informs the separation between first-try results and assisted
answers here. We use the app’s existing review rules, not Anki’s scheduler.
Source: [Anki manual, Background](https://docs.ankiweb.net/background.html).

The following are product design decisions, not experimentally established claims
about these specific game implementations:

- **Word pairs:** Japanese and English tile columns, several small boards,
  randomized positions, a consecutive-match chain, and optional readings. A
  mismatch does not consume a life or end the game. Showing answers marks those
  words as assisted so that a cleared board cannot produce a false perfect score.
- **Listening:** hear an exact learning-word recording, select one of four
  meanings, inspect the revealed written form and reading, and retry missed words
  after the original round. Normal and slower playback are available throughout.
  Unavailable audio can be skipped without recording an incorrect answer.
- Both use small finite rounds, optional stopwatches without a deadline, pause
  controls, mobile-sized targets, and keyboard shortcuts. Leaving a browser tab
  pauses the activity and stops its audio.
- The Kanji activity is a separate visual study and retrieval experience. Its
  source notes and content decisions are documented with its dataset.

## Vocabulary and ambiguity

The page offers My words, Starter words (Units 1–7), All course words, Due for
review, and Prioritized words. A new learner starts with Starter words rather than
an empty activity. The pool and its size are visible before starting. These are
stand-alone recognition pools and can therefore exceed the sentence builder’s
reviewed grammar pool.

Candidate words require a usable Japanese form, reading, and concise English
meaning. Kana drills, function-word labels, particles, counters, and affixes that
need context are excluded. All word identity and recordings still resolve through
the canonical dictionary.

Pairs and multiple-choice answers exclude conflicting items: the same written
form, the same normalized reading, the same dictionary entry, or overlapping
English glosses. Selected dictionary-sense glosses supplement the learning gloss
to catch synonyms such as “house” and “home.” Listening distractors prefer a
comparable word type before drawing from other types. If four unambiguous choices
cannot be formed, the question is omitted rather than inventing choices.

This is a conservative lexical filter, not a semantic proof. Very broad dictionary
senses can reduce the pool; rare English paraphrases may still need content review.

## Results and persistence

`GamesView` emits a `GameResult` once when a round is completed. It includes a
stable round ID, kind, first-try correct and total counts, practiced IDs, missed
IDs, timestamp, and active time. The app owns persistence and goal/streak updates.
Opening an activity, replaying a recording, viewing a result, or skipping failed
audio does not independently earn practice credit. Retries have new round IDs.

The result screen retains the original round’s selected words. Retrying one
missed pair adds enough already-selected review words to keep a matching board
meaningful, and explicitly labels those additions. Listening retries keep their
original distractor pool and can focus on a single missed word.

The activity landing page reads the app’s persisted results to show recent rounds,
first-try counts, dates, and best recent accuracy for each activity. It does not
compare completion speeds because historical results do not capture equal pools,
reading support, or other settings. At equal accuracy, the larger answered round
is the displayed best result. Aggregate completed-round counts come from the
durable daily activity totals rather than assuming the bounded recent list is a
complete lifetime record.
