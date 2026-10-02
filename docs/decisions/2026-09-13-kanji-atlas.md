# Core kanji atlas and expanded recognition course

The Activities atlas and First Kanji Symbols course share fifty reviewed entries
in `data/jp/kanji/core_kanji.json`. The atlas groups them into Nature, People & Body,
Size & Position, Trees & Weather, and Daily Life. The course preserves the first
twenty word IDs, card IDs, readings, and card positions and appends thirty symbols.
Rebuild only this unit with `node scripts/author-prelude-units.mjs --unit 103`.

Each entry has an explicit recognition-word ID, meanings, a prompt reading,
selected on/kun readings, stroke count, a complete example word and its reading,
an origin note with a direct source, and a separately authored memory note.
Recognition entries are also authored in the canonical `teaching_words.json` and
bound as local recognition items. They do not become sentence-generation senses.
New recordings were not purchased; playback uses existing exact-form audio or
device speech through the shared audio path.

## Sources and illustration policy

All fifty origin notes were researched against the corresponding **Kanjipedia**
entry, published by the Japan Kanji Aptitude Testing Foundation and citing
Kadokawa's *Shinjigen*, and paraphrased in English. Every entry links directly to
its source; no source illustrations or ancient glyph artwork were copied.
Examples include [水](https://www.kanjipedia.jp/kanji/0003723800),
[力](https://www.kanjipedia.jp/kanji/0007192800),
[金](https://www.kanjipedia.jp/kanji/0001604700), and
[本](https://www.kanjipedia.jp/kanji/0006505700).

These are the dictionary's interpretations, not a claim that every etymology is
settled. The app distinguishes pictographs, signs, compound meanings, and
sound/meaning formations. In particular, 力 is explained as a plow shape, 金 as
a sound/meaning formation, and 本 as a mark at the root of a tree, even though the
modern watercolor images depict strength, gold, and a book. Fish's lower marks
are not explained as fire. The Japan Foundation's
[kanji structure resource](https://classroomresources.sydney.jpf.go.jp/resources/kanji-radicals/)
also informs the distinction between word readings and character components.

The five watercolor sheets are original modern memory aids. They are not
historical reconstructions or stroke-order diagrams. Each sheet has ten cells
in a five-column, two-row layout; `group` and `artIndex` select its cell. All
Japanese characters, readings, labels, and sources remain actual accessible text.

## Practice and progress

Opening or searching the atlas does not count as studying. The explicit study
button records a stable character ID. The eight-question recognition quiz uses
same-group distractors, optional image hints, immediate feedback, a result sheet,
and a retry queue containing only missed characters. Even a one-character retry
still has four distinct choices. There is no speed penalty.

Quiz results carry a stable round ID, correct/total counts, attempted character
IDs, completion timestamp, and elapsed seconds. The parent app records completion
once and includes it in activity/goal progress. Abandoned rounds do not pretend
to be completed. Saved progress reflects recognition and study, not handwriting
mastery. The atlas intentionally has no unverified stroke-order game.

The learner-state migration records `courseRevisions["103"] = 2`. Completion
of the original twenty-card course becomes twenty of fifty cards viewed (40%),
with the next new card at index 20. Explicit viewed-card IDs remain authoritative;
older partial profiles without them infer coverage using the old twenty-card
denominator. That conversion runs once. Existing full fifty-card progress remains
complete, and historical daily completion totals are retained.

An active or stored Course 103 session containing the original twenty ordered
card IDs keeps those items, its cursor, scores, mode, and practiced indices, then
receives the thirty additional items. Its current completion badge clears until
the expanded deck is complete. Library subsets and saved/generated snapshots
retain their original contents.
