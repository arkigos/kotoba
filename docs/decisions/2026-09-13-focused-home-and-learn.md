# Focus Home and unify Learn

Date: September 13, 2026. Accepted and implemented for `apps/learner-next/`.

## Context

Home exposed too many competing paths and explanatory blocks. Topics and the
recipe-based lesson builder duplicated the decision to begin learning, while
the template catalog made personal word selection depend on grammar support.
The learner wanted a visual app with fewer words and controls, using Activities
as a loose style guide.

This decision changes the primary journey and presentation. It preserves the
[A1 core](2026-09-13-topic-driven-a1.md),
[density-aware pacing](2026-09-13-density-aware-topic-lessons.md),
[practice continuity](2026-09-13-practice-continuity.md), and existing word/audio
identity contracts.

## The learner journey

- **Home** has one prominent next action. Resume the unfinished active lesson
  using its current cursor; otherwise offer an unfinished saved lesson, then
  Choose a topic. Actual A1 words, a small practice week/streak, and compact
  Activities/My lessons shortcuts support that action. Review appears when due
  or prioritized words exist.
- **Learn** contains Topics and Custom. Topics keeps overlapping active A1
  scenarios. Custom is a compact word selector with a card count and Start.
  The old template catalog and separate Lesson builder navigation are removed.
- **Dictionary** retains the full reference corpus, filters, Priority, and
  My words. New lesson passes every selected ID into Learn Custom; it does not
  apply the old recipe eligibility gate.
- **My lessons** presents saved/recent lessons as quiet visual cards. Resume and
  bookmark stay visible; browse, rename, and remove use a compact menu. The empty
  state is No lessons yet and Choose a topic.
- **Progress** contains the detailed A1 goal, practical self-checks, and personal
  goals. Learn and Home can show compact progress without repeating the standards
  explanation or milestone list.

Activities guides the presentation: soft tinted cards, simple illustrations and
icons, readable type, and generous space. Keep action labels short. Put naming,
full previews, counts, and secondary options in disclosures. Do not add tutorial
paragraphs or algorithm diagnostics to the default creation flow. Essential
controls keep accessible names and keyboard behavior; color/art is supplementary.

## Custom lesson contract

`CustomLessonBuilder.tsx` receives the existing learner state and optional exact
initial word IDs. Without an incoming selection, it starts with up to twelve
Priority words or an empty selection. Dictionary search, removable word chips,
Priority suggestions, and functional illustrated starter-word tiles provide
entry points. Name, full preview, and Save for later sit under Lesson options.

`custom-lesson.ts` accepts 1–30 explicit IDs and returns a materialized session:
`source: "vocabulary"`, `targetWordIds`, aligned `savedCards`, ordered `items`, and
version-one `lessonPlan`. It does not require a procedural `SessionSnapshot` or
invent a frozen-unit ID. Requests above thirty remain visible with an error;
they are never silently shortened.

Reviewed authored words reuse complete frozen example cards. A single selected
reviewed concept may count its approved aliases. If several aliases are selected
explicitly, each keeps its ID and requires exact-ID appearances. Unplaced
dictionary entries retain their selected form, reading, meaning, and audio
identity through standalone cards. Imported POS and common markers never grant
permission to generate a sentence. An unavailable entry or incomplete lexical
record produces an actionable error instead of excluding the word.

The shared sequencer aims for eight actual appearances per target, with a
four-cards-per-target baseline. Shared contexts can make the lesson shorter than
eight cards per word. A feasible explicit count remains exact with at least six
appearances per target; helper and exposure caps remain enforced. Frozen cards
measure authored token changes, while reviewed derivations may measure slots.
Larger changes are visible boundaries, not disguised one-word substitutions.

`topic-coverage.ts` provides bounded coverage-first recovery when local greedy
ordering overestimates a requested size. It preserves candidate references,
counts a target once per card, limits exposure to the chosen goal plus four,
and limits the unknown helper union to six. It deduplicates coverage/helper
signatures and prunes a finite search. Failure means no fit was found within the
budget, not proof that the requested lesson is mathematically impossible.

## Persistence and compatibility

Launching a topic or planned custom lesson saves the exact snapshot automatically.
Save for later stores the same prepared cards without starting practice. Home,
Learn, My lessons, and the explorer resume those cards and their saved position.
Renaming, replaying, or changing future dictionary/topic data does not regenerate
the stored deck. Planned appearances remain separate from actual consumed-card
counts and spaced A1 credit.

Historical internal route keys remain stable:

| Surface | Route/compatibility |
| --- | --- |
| Home | `#today`, with `#home` accepted |
| Learn Topics | `#course`, with `#learn` accepted |
| Learn Custom | `#build` |
| Dictionary | `#dictionary`; `#library` remains an alias |
| Progress | `#goals` |
| My lessons | `#lessons` |
| Frozen/saved explorer | `#lesson/<unitId>` and `#lesson/session` |

`LessonBuilder.tsx`, the reviewed procedural kernel, and their compatibility
tests remain. Existing generated snapshots and frozen-unit links are replayable,
even though the old catalog is unreachable from primary navigation. There is no
profile wipe, ID migration, or paid audio request associated with this redesign.

## Verification evidence

Focused Next tests cover Home's single next action, stale preview rejection,
full custom target retention, raw dictionary fallback, aliases, six-appearance
shortening, shelf management, and exact snapshot resume. The reviewed cross-topic
fixture `[enjinia, kuni, sumu, kaishain, nihon, hataraku]` demonstrates a real
12-card fit: six copies each of `u002-c013` and `u002-c067` cover every target six
times without unknown helpers. The fallback tests also cover insufficient slots,
unavoidable overexposure, and incompatible helper unions.

Relevant tests are `home.test.tsx`, `custom-lesson.test.ts`,
`custom-lesson-builder.test.tsx`, `session-shelf.test.tsx`,
`continuity-ui.test.tsx`, `goals-view.test.tsx`, `lesson-transitions.test.ts`, and
`topic-sequence-feasibility.test.ts`, alongside the complete topic and persistence
audits. Desktop and 390×844 browser review checked custom empty/selected states
and shelf layouts; it caught and corrected a clipped count placeholder and a
mobile search field compressed beside filters. The normal full test/build bar
remains in [Quality](../QUALITY.md).
