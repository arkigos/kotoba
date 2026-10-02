# Independent A2 tracks

The October 1 direction extends the independent-track model from A1 into A2.
Complete A1, then choose any A2 track. A2 has no new starter suite. Lessons and
fixed recalls remain ordered inside each track; all A2 tracks are required before
B1. This supersedes A2's former linear chapter prerequisites, not B1's remaining
ordered prerequisites.

## Content and ownership

The five tracks partition all 1,267 bounded A2 identities exactly once:

| Track | Words | Instructional lessons | Fixed recalls | Original cards |
|---|---:|---:|---:|---:|
| People, stories, and plans | 379 | 73 | 175 | 799 |
| Home, food, and getting things done | 179 | 35 | 81 | 363 |
| Choices and comparisons | 168 | 30 | 69 | 346 |
| Work, interests, and technology | 220 | 38 | 95 | 439 |
| Travel, nature, and health | 321 | 57 | 132 | 638 |

There are 233 instructional lessons, 552 recall checkpoints, 2,585 original cards
and 7,661 total placements. These are fixed authored cards, not runtime templates.
The former chapters remain authoring groups within the tracks.

Grammar ownership is explicit in `scripts/lib/curated-a2-tracks.mjs`. Stories
handles plain clauses, reported speech, intentions and conditions. Daily tasks
handles action sequencing with てから, simultaneous actions, trying, completion
and concession. Choices handles comparisons, potential forms and absence of
necessity. Work handles goals, obligations and the passive. World handles
predictions from appearance, developing changes, purpose and cause with ため.
Completed A1 grammar is available in every A2 track. Additional A2 grammar is
used only in its owner until B1. Each owned pattern appears in at least three
lessons and six card placements, with instruction before its first use.

連れる moved into Stories because its authored 連れて行く / 連れて来る examples
use that track's て sequencing. ため moved to World, where recovery and public
service provide natural purpose and cause contexts. Other tracks use revised
sentences rather than silently importing those words or constructions.

## Runtime and saved progress

The compiler derives `catalog.independentLevels` from authored course metadata.
Availability, vocabulary checks, next-lesson navigation and Learn labels use
that list. No code should assume that only A1 is independent. B1 remains ordered
until its own vocabulary and grammar dependencies are resolved.

Independent-track vocabulary consists of the lesson's targets, completed earlier
lessons in that track, completed lower-level lessons, and completed starters.
Unrelated same-level completion or practice history cannot license helpers.
Previewing or opening a track adds no learning credit. Review remains local to
the selected track and uses the original card's one SRS memory record.

A2 instructional versions were advanced, and the new recall plans use version
2. Former chapter completions cannot bypass the revised sequence. Stable lesson
and dictionary identities remain. The user's fresh browser test profile was
not advanced or reset during this conversion.

## Review and verification

The conversion includes a bilingual review of 113 changed or new original cards,
all A2 instructional helpers, and 28 explicitly approved surface/reading pairs.
That is the scope of this conversion's manual review; it is not a claim that all
2,585 unchanged and changed A2 originals received a fresh independent editorial
pass in this batch. The exported review packet preserves that larger review
surface. Mechanical checks run across every card and recall.

Fixed word recalls were proposed offline and saved as explicit card references.
Thirty-five additional grammar checkpoints return to sparse constructions after
intervening instructional lessons. Neither authoring compilation nor runtime
selects new sentences. Grammar checks now include dictionary-linked ため and
compound する potential forms, including a split 理解 + できます.

The dependency audit reports 5/5 A2 tracks independent from completed A1 alone.
Runtime tests independently walk all five tracks, verify track-local Next,
reject sibling vocabulary, reject obsolete completions, and require all A2
recalls before opening B1. Desktop and phone preview checks preserve a fresh
0/753 A1 profile. See the active continuation plan for verification logs and
remaining B1–C2 work.
