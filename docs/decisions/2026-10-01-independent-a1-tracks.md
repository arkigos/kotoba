# Shared foundations and independent A1 tracks

The user's October 1 direction supersedes the September 26 linear A1 course.
Tracks may combine vocabulary and grammar themes and may be long. They must
contain varied lesson blocks, not one construction repeated throughout.

Eight ordered starters teach shared statements, questions, descriptions,
existence, possession, also, actions, places, companions, and basic negative and
past forms. Their 28 vocabulary identities are actual taught targets. The first
five starters retain their polished 15/18/24/18/15-card sequences; the three
bridges each contain 24 cards. There is no separate A2 starter course.

Foundations appears as one stack beside the A1 tracks. Opening it shows the
eight ordered lessons with the same progress, preview, start/resume and replay
conventions as a topic track. Completion advances to the next starter; the final
starter offers the track chooser. Closing a starter returns to Foundations,
including after a refreshed practice link. The content and completion rules
remain unchanged; other A1 tracks still require every starter.

After foundations, all three A1 tracks are freely selectable:

| Track | Main subject blocks | Additional grammar |
|---|---|---|
| People and communication | Greetings, family, learning, conversation, sharing | Continuing states and actions, action requests, permission, reasons, ね and よ |
| Things, food, and choices | Food, home, nature, shopping, health, quantities | Item requests, wishes, adjective past and negative forms, adjectives before nouns |
| Everyday actions and time | Time, routines, hobbies, travel | Starting/ending points, invitations, suggestions, manner, activity ability |

Within a track, a lesson can use its own targets, previously taught track words,
and starter vocabulary. It cannot rely on another A1 track, even if this specific
learner completed it. Additional grammar has one owner and cannot be taught or
used in another A1 track. The owner may reuse it without explaining it again.
Vocabulary-specific notes can explain a new verb's usage or reading without
reintroducing a previously taught construction.

A1 completion requires every one of the bounded dictionary's 753 identities and
every required lesson/checkpoint. A2 inherits all completed A1 vocabulary and
grammar. Higher-level progression remains as currently authored; this change
does not add an A2 foundation course or expand B1–C2.

## Authoring and verification

The original subject files remain useful source blocks. The explicit track
compiler in `scripts/lib/curated-a1-tracks.mjs` groups them, applies reviewed
sentence and helper revisions, and places the saved grammar declarations.
It does not invent sentences. Recall choices are saved in `topic-revisits.json`;
the offline proposal tool is separate from normal compilation and playback.
Runtime review uses the exact consumed cards and their date-based SRS records.

`validate:curated` checks starters independently, vocabulary from each track's
own start, exclusive grammar ownership, first-use instruction, approved forms,
coverage, recurrence, and the A1 grammar boundary. Read all originals as well:
the checks are not a complete Japanese parser or an editorial judgment.
Notes may be absent when an explanation would add nothing.

The user explicitly authorized discarding old saved cards, lessons and progress
as needed. Old snapshot compatibility is not a requirement for this revamp.

## Pacing references

The communicative scope remains informed by the Japan Foundation's
[Irodori Starter A1 contents](https://www.irodori.jpf.go.jp/assets/data/starter/pdf/X_contents_en.pdf)
and [Marugoto's teaching approach](https://marugoto.jpf.go.jp/en/teacher/feature/).
They support using grammar for everyday communicative tasks. The exact track
partition, starter length and 753-word budget are Kotoba editorial choices,
not an official CEFR grammar or vocabulary checklist.
