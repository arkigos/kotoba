# Curated topic course

User direction: replace live sentence generation with an authored Japanese course.
The bounded functional dictionary is the coverage source (750/1,250/3,000/5,000/
7,000/8,000 words, A1–C2). Every entry has one owning topic within its level.
Topics are freely selectable after shared foundations; their lessons are ordered.
Review replays exact cards within the selected topic. Completing every topic must
cover every word in the level. Grammar is taught inside lessons before use.

## Work and acceptance

- [x] Audit A1 identities, meanings, essential coverage and topic ownership.
- [ ] Author level-specific topic maps, preserving canonical and learning IDs.
- [ ] Author fixed lesson targets, notes, token-aligned bilingual cards and review.
      Do not call a slot expansion or an unreviewed dictionary example curated.
- [x] Add versioned durable completion independent of the recent lesson shelf.
      Preview/save/skip-ahead never earns completion. Explicit known declarations
      remain separate from practice. Preserve existing snapshots and history.
- [x] Replace primary Learn, Home progression and continuation with the course.
      Keep historical lesson playback. Remove live generation from the main path.
- [ ] Validate every target, grammar note, token identity and helper prerequisite;
      simulate topic orders, completion, review isolation, reload and continuation.
- [ ] Read all shipped sentences, inspect desktop/mobile UI, run tests/builds.

## Content contract

An A1 topic may depend only on the shared starter lessons and its own earlier
lessons. Later levels may use completed lower-level vocabulary freely. Other
same-level topic words cannot be hidden prerequisites. Current targets are taught
in the lesson. Function forms must be explicitly authored. New grammar gets a
plain-language explanation and a clear model before its first practice block.
Lessons contain frozen cards: no runtime substitution, synthesis or global mixins.
Incomplete authoring is visibly incomplete and cannot confer level completion.

JF levels describe communicative tasks, not official word quotas. The bounded
list is Kotoba's curriculum scope, checked against practical beginner functions.
References: https://marugoto.jpf.go.jp/en/teacher/feature/ and
https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do .

## Resource budget

Starting weekly usage: 39% used / 61% remaining. Preserve meaningful headroom
for tomorrow; do not redeem reset credits or make paid audio requests. Check
usage at milestones. Repository already contains extensive uncommitted work;
preserve it and do not reset or bulk stage it.

## September 26 checkpoint

Implemented: four foundations, 13 A1 topics, 138 topic lessons and 1,507 topic
cards covering 750/750 words. Each topic includes required grammar consolidation.
Reviewed the authored Japanese/English and inflected surface/reading variants;
corrected articles, unnatural examples, date/time readings, selected dictionary
glosses and legacy identity aliases. Exported a full bilingual review packet.

The primary learner uses fixed lessons and topic-local, separate-day review.
Content loads in per-topic bundles. Completion survives clearing the shelf;
legacy snapshots preserve their exact content. Mobile QA caught and fixed a
cramped grammar explanation in the player header. Default dev/build commands now
open/build the active learner; reference commands preserve the old unit surface.

Checks: active suite 240/240; combined suite 392/392; active and reference builds;
legacy curriculum/assets validation; full A1 validator; reproducible study pools.
No resets or paid audio. Latest weekly usage: 49% used, 51% remaining.

Still required for the full user request: A2–C2 topic ownership and reviewed
sentences over the remaining 24,250 entries, with level-specific grammar and
lower-level helper rules. These levels are visibly unavailable, not completed or
filled with generic fallback cards. Continue authoring while preserving credit
headroom for tomorrow. The overall goal is not complete.

## A2 authoring checkpoint (05:10 UTC)

A2 now has eight independently selectable topics, 70 lessons, 782 fixed cards,
and 397/1,250 uniquely owned words. Topics: cooking, care, home, travel, shopping,
study, people, changes. Added explicit grammar tied to contexts, including
transitive/intransitive pairs, states, sequences, comparisons, ability,
intentions, conditions, expectations, giving toward the speaker and まま.

Generalized catalog compilation, validation and review-packet export across
levels. Partial coverage is visible in the UI; A2 first lessons correctly say
“After A1”. Tests exercise the lower-level prerequisite and each A2 topic in
isolation after A1 completion. A1-only dictionary filtering remains A1-only.

Fixed 16 foundational level placements and ambiguous glosses; preserved A1
membership/order and pinned existing A2 source ranks to canonical IDs. **When
continuing A2 source, use `createLevelAuthoring('A2').words` or the authoring ID
manifest for ranks, never the reordered study-index positions.** Sixteen old,
unwritten A2 tail ranks now belong to B1 and cannot be authored as A2 targets.

Latest verification: full combined suite 395/395; default production build;
reproducible dictionary pools; complete-A1 and all-authored-content validator.
Reviewed added inflections against source identities/readings and extended the
explicit reviewed-forms allowlist. The review packet now lists ownership gaps
for every level. Later-level completeness remains unfinished; do not mark the
overall goal complete or manufacture generic fallback lessons.

### Further A2 content

Added work/projects and technology/media: A2 now has 10 topics, 86 lessons,
989 cards and 507/1,250 words. All current inflections have been read and added
to the explicit reviewed allowlist; vocabulary/identity/coverage validation
passes. Latest full suite/build was at the earlier 397-word checkpoint, so run
it again after the next substantial content batch. Latest usage: 52% used,
48% remaining; three reset credits untouched.

### Outdoors and time checkpoint

A2: 12 topics, 105 lessons, 1,234 cards, 635/1,250 words. Added nature and time,
with season/weather readings, duration versus calendar readings, noun-modifying
clauses, event order, ongoing versus completed states and transitive pairs.
Corrected future/past example mismatches and day counters during readthrough.
All current lexical forms have been reviewed; complete-A1/all-content validation
and the expanded review export pass. 615 A2 words and all B1–C2 content remain.

### Conversation, quantity and safety checkpoint

A2: 15 topics, 128 lessons, 1,490 cards, 766/1,250 words. Added conversation,
quantity and safety, plus a price-change lesson in shopping. Explicitly separated
respectful versus humble verbs, added passive/negative/plain-form explanations,
and corrected cross-topic helpers before compiling. Checked the new lexical
forms and updated the reviewed allowlist. Validator and review export pass.

An active-app-only test run exposed a jsdom selector failure from the grammar
note layout's `:has(> .starter-note)`. Replaced it with an explicit
`has-lesson-note` component class. Active suite 242/242 and production build
passed at the 635-word checkpoint. Latest content and a harmless dictionary
label/variable rename still need the next full test pass. Combined suite last
passed 395/395 at 397 words. Latest credit check: 55% used / 45% remaining.
Three reset credits are untouched; no paid audio requests.

### Complete A2 checkpoint (06:30 UTC)

A2 now covers every one of its 1,250 current pool identities: 23 topics, 209
ordered lessons, 2,451 fixed cards. All 750 A1 identities remain covered by the
four foundations and 13 topics. The total published scope is 2,000 words, 347
topic lessons and 3,958 topic cards, plus 69 foundation cards.

Added culture, sports, places, society, feelings, reasoning, practical tasks and
descriptions; integrated the remaining words into suitable existing topics.
Reviewed all added lexical forms and corrected first-sense glosses for context
(e.g. 核 as core, 計 as total, 起こす as wake/cause, 差別 as discrimination).
The normal validator now requires complete A1 AND A2. A2 progression tests
independently walk every topic from completed A1, then verify that only all A2
topics together complete the level. Declared-known lessons still earn no review.

Checks at full A2: combined suite 395/395; active suite 242/242; production build;
complete-A1/A2 validator; dictionary pool reproduction; bilingual packet export.
Desktop and phone QA verified the A2 catalog, locked prerequisites and exact
bilingual preview. Phone QA found a squeezed preview column; changing the mobile
lesson row to a two-column grid moves its button below the text. Visual recheck
passed, with no horizontal overflow. Rebuild after subsequent work to include
this final CSS change. Browser viewport restored; existing QA lesson paused
without advancing. Original user profile remains untouched.

B1–C2 still have 23,000 words to author. Their lack of authored content remains
visible; do not mark the overall goal complete. No reset credits or paid audio
requests have been used.

### B1 start and course scaling (06:55 UTC)

B1 has 3 topics (housing, household, money), 24 lessons, 244 cards and 145/3,000
words. Every current new form has been read and approved in reviewed-forms;
strict A1/A2 plus all-authored-content validation and packet export pass.

Catalog metadata now carries the grammar pattern, not every explanation/helper
list. Those load with the topic. Lesson/card/level indexes avoid repeated full
array scans for completion and review. Active tests 242/242 and build passed
after that change; entry chunk fell from 2,684 kB to 2,532 kB raw (still a known
large initial bundle). Added a B1 lower-level-gating and independent-topic test.
Combined suite 396/396 passed at B1 99 words; current 145-word batch needs the
next appropriate runtime check. Dictionary reproduction passed after the repair.

Further dictionary correction: explicitly prioritized the sports ball ボール,
ボタン, 破れる and the general time/money かかる at B1. The previous bounded
かかる slot selected the disease homophone instead. That old ID is retained in
reference and historical data, and explicitly retired in the B1 source manifest,
not reinterpreted. A1 and A2 membership/order hashes are unchanged. Quotas still
contain 25,000 distinct words. B1 authoring IDs are pinned separately from pool
ranks, with the four additions appended as 3001–3004. 3001 ボール is not authored
yet; 3002 ボタン / 3003 破れる / 3004 かかる are in household lessons.

B1 source rank 1202 is the retired disease homophone and MUST NOT be used.
Other inactive source ranks now belong to later levels; filter words by level.
B2–C2 hashes have been updated to their current, still-unwritten pools. The
factory inherits only already-authored lower-level function forms, while new
functions must be explicitly introduced in the topic’s grammar notes.

Latest credit check before B1 work: 59% used / 41% remaining. Reset credits and
paid audio remain untouched. Overall goal remains incomplete.

### B1 work, sport, education and language (07:18 UTC)

B1 now has 7 topics, 59 lessons, 590 cards and 323/3,000 words. Added work
(65 words), sport (34), education (46) and language (33). Grammar includes
reported advice, preparations with にあたって, deadlines, arranged decisions,
passive notices, たびに, につれて, だけでなく, に応じて, definitions and
interpretations. Topics remain independently startable after complete A1/A2.

Reviewed every new lexical form before adding it to the editorial allowlist.
Verified selected dictionary secondary senses before improving glosses for
work, money, education and communication. Replaced attempted uses of the
light-turning-on つく with vocabulary matching the intended meanings; the two
published A2 uses of that identity correctly describe lights/appliances.
Corrected 15 explicit authoring tokens before です to 何 / なん. No pool identity
or level membership changed in this batch. B1 source rank 3001 ボール is now
authored in sport; all four previously promoted B1 words have lessons.

Checks: full suite 396/396 at B1 210 words; active app 243/243 and production
build at B1 323 words; complete-A1/A2/all-authored validator; dictionary pool
reproduction; bilingual review export. Desktop QA verified all seven B1 topics,
the honest 323/3,000 authoring notice, After A2 gates and lazy-loaded exact
ten-card sports preview. No practice progress was changed. Initial build chunk
is 2,574 kB raw / 489 kB gzip and retains the known Vite size warning.

Latest allowance: 65% used / 35% remaining. Three reset credits and paid audio
remain untouched. B1 has 2,677 unassigned words; B2–C2 remain unwritten. Do not
mark the complete 25,000-word goal achieved. Next planned topic is B1 cooking
and food, with verb distinctions explicitly checked against dictionary IDs.

### B1 cooking and travel checkpoint

B1 now covers 410/3,000 words in 9 topics, 77 lessons and 759 fixed cards.
Cooking adds 55 words in 12 lessons; travel adds 32 in six lessons. Cooking
explicitly distinguishes simmering, boiling in water, steaming, stir-frying,
deep-frying and dry-roasting, as well as action/result verb pairs and homophone
bowls. New grammar includes preparation with ておく and a continuing condition
with うちに. Travel covers tickets, station announcements, rail routes, stays,
aircraft and boats, including the railway-specific meaning of 下り.

All new lexical forms have been reviewed. Cooking gloss refinements were checked
against source senses. Complete-A1/A2 plus all-authored validator and bilingual
export pass at 410 words. Runtime tests/build last passed at 323 words; the
next build must include the cooking and travel bundles. No further runtime code
has changed. Dictionary pool reproduction last passed before the cooking gloss
refinements and should be rerun at the next larger checkpoint. No IDs moved.

Potential next topic: B1 roads, directions and driving, using the unassigned
words from the travel query (81 免許, 102 エンジン, 337 ドライブ, 619 ブレーキ,
625 渋滞, 687 横断, 709 通行, 1098 横切る, 1826 時速, 1842 車輪,
1876 モーター, 1964 交差, 2007 大通り, 2013 踏切, 2077 並木,
2123 街角, 2152 方角, 2430 人通り, 2470 道順, 2498 速力,
2567 突き当たり). B1 source ranks are stable authoring addresses, not pool ranks.

### User's additional acceptance requirements

Before continuing broad content expansion, strengthen the audit for grammar
sequencing, target recurrence across lessons, balanced exposure and beginner
difficulty. The user explicitly requires every authored lesson to be reviewed
for vocabulary legality, sentence quality and appropriate grammar introductions;
every A1 word must be covered and words must recur later within their topic.
Mechanical vocabulary validation is not a substitute for this review. Preserve
the overall all-level objective and perform a final pass over the finished set.

ElevenLabs spending is now explicitly authorized for missing audio AFTER the
quality review/fixes. Use existing exact-form recordings and request deduplication
before paying for new audio. The original instruction to preserve account
headroom for tomorrow still applies; no reset-credit redemption is authorized.


### Linear course and A1 standards checkpoint

The user's latest direction supersedes independent topic selection: one authored
course, topics as ordered chapters, earlier vocabulary/grammar carried forward.
Five shared starters now include の and も. A zero-target grammar starter is
required for A1 completion. X/Escape return to the launching screen or the
curated chapter after a refreshed practice link, preserving the saved cursor.

Implemented global prerequisite gating, a Continue course action, cross-chapter
Next lesson, and replay of already-completed content. `course-order.json` fixes
the sequence; both compilation and validation use it. The original goal-tool
text still describes free selection, but this later user direction is authoritative.

The first A1 chapter now contains greetings, names, nationalities and courtesy.
Their existing lesson IDs are preserved. Phone calls, repair and reasons remain
in the final conversation chapter. Food, people, home and descriptions precede
time and shopping; the time chapter supplies number helpers for prices.

Checked official JF Standard, Marugoto A1/A2 and Irodori A1 scope. Productive
thought clauses and negative requests now begin in A2. A1 retains a narrow
borrowing formula and an opinion question without embedding a clause. New A2
explanations appear before those broader patterns. The explicit A1 scope audit
rejects tracked grammar outside the reviewed boundary. See the separate A1
scope/pacing decision for sources, rationale and limits.

Split the two twelve-target clock/date lessons into groups of five to seven.
Revised lessons and affected recall placements have explicit versions; old
saved cards are not rewritten. Regenerated and inspected the greeting and
conversation recall references after the chapter split. All compiled cards
remain frozen and exact review copies retain a single source memory.

Current totals: A1 750/750 in 14 chapters, 140 instructional lessons + 263 recall
checkpoints, 1,511 distinct cards / 3,899 placements, plus five shared starters
with 84 cards. A2 remains 1,250/1,250; B1 410/3,000; B2–C2 unwritten.
Distributed-exposure checks pass for all 2,410 assigned words, including the
18 foundation words: at least six appearances across three lessons, including
two later lessons. This measures course spacing, not proven retention.

Verification: 407/407 tests across 44 files; production TypeScript/Vite build;
full A1/A2 and all-authored vocabulary validation; 81 tracked grammar
introductions with zero before-instruction errors; A1 scope check; bilingual
review packet. Build still reports the known initial-chunk size warning
(approximately 3.08 MB raw / 519 kB gzip). Browser inspection confirms five
foundations and the new fourteen-chapter order on the desktop course screen.
The local preview was restarted on port 4389 (exec session 8784); user progress
at localhost was not changed. QA used the separate 127.0.0.1 origin read-only.

Still pending: finish the bilingual editorial pass over every original lesson,
review remaining dense lesson pacing and the lexical suitability of the whole
A1 pool, then extend the unfinished upper levels. Current pass has read A1
food, people, home, learning, health, travel, shopping and the changed greeting,
time and opinion material. Routine, leisure, nature, quantities and the remaining
conversation/time material need a systematic complete pass. Mechanical checks
are not an editorial sign-off. No paid audio or reset credit was used. Generate
missing exact-form ElevenLabs recordings only after the requested quality review.


### Follow-through: complete A1 sentence and pacing pass

Read the remaining A1 nature, time, routine, leisure, quantity and conversation
sentences in Japanese and English. Corrected the sea translation, replaced weak
year/birthday fragments, used already-learned television for watch and 読みます
for manga. Added tracked noun ability Nができます separately from A2's
Vることができます. Grammar ordering now tracks 82 explicit introductions.

Split all remaining groups above eight new words at conceptual boundaries:
color adjectives/nouns, walking/landmarks, head and face/other body parts,
feelings/responses, and linking/why/opinion question. A1 now has 146 instructional
lessons and 263 recall checkpoints (409 chapter lessons plus five foundations).
No original sentence was lost in these splits; 1,511 distinct topic cards and
3,899 placements remain. All 750 words still have ownership and adequate later
exposure. The eight-target ceiling is an editorial rule, not an official CEFR
threshold. Updated explicit content versions and recall references prevent old
completion records from silently crediting changed lessons.

The A1 bilingual sentence/pacing pass is complete at this checkpoint, with
mechanical validation of all fixed recall copies. This is not a claim that
CEFR prescribes the 750-word dictionary or that all upper levels are finished.
Remaining primary review work is A2 and authored B1, followed by upper-level
expansion and the requested final whole-catalog pass before paid audio.


### Follow-through: complete A2 bilingual pass and grammar audit gaps

Read all 209 original A2 lessons across the 23 ordered chapters, including the
Japanese sentences, English translations and instructional notes. Fixed weak
collocations, mismatched translations, an English article error, a reversed
word-order explanation, and an implied clothing action that the Japanese had
omitted. Replaced the repetitive body-system template with varied, legal
examples. Removed production/legalistic disclaimers from learner-facing notes;
retained relevant register, meaning and usage distinctions.

The audit now checks 95 explicit grammar introductions. Added distinctions for
plain past, plain negative and past negative, plain progressive clauses,
explanatory のですか, contrastive が, concessive ても, quoted speech, verb-stem
そうです, formal adjective negatives, lexical こと nominalization, intentions,
expectations and unchanged states. Existing explanations are declared where
sufficient; missing explanations are placed at the exact first relevant card.
A1 stays within its existing reviewed boundary. In particular, negative desire
たくない is not misclassified as introducing the full plain-negative verb system.

Fourteen revised A2 lessons have explicit version increments, with their grammar
anchors and every affected recall checkpoint updated. Reviewed the additional
無視しないでください form against its existing dictionary identity. Dictionary
membership, ownership and the overall chapter sequence are unchanged.

Validation passes for all 1,366 chapter lessons. Coverage remains A1 750/750,
A2 1,250/1,250 and authored B1 410/3,000. Every assigned word has at least six
appearances across three lessons with two later lessons. Pool reproducibility,
grammar-before-use, exact-form legality, A1 grammar/pacing scope and refreshed
bilingual review exports pass. Root suite passed 419 tests across 44 files;
the final quoted-speech addition passed all 21 focused grammar tests. Final
learner suite passes 246/246 tests across 30 files and the production build
passes with the existing large-bundle warning. See the A2 editorial review note.

No paid audio or reset credit was used. The account check showed 11% of the
weekly Codex allowance used and three reset credits available; preserve that
headroom. This is a review of the authored A2 sentences, not a claim that the
ranked A2–C2 dictionary candidates are an official CEFR inventory. Authored B1
still needs its complete bilingual pass. B1 completion and B2–C2 authoring,
level-placement review and final whole-catalog QA remain before paid audio.


### Follow-through: B1 review and health chapter

The previous goal turn made concrete progress: all A2 originals were reviewed,
corrected and revalidated. This turn read all 77 previously authored B1 lessons
(759 original cards) across household, cooking, travel, housing, sports,
education, language, work and money. Added first-use grammar declarations or
explanations for conditional と, ずに, time/cost のに, standing arrangements with
ことになっています, nominal concession でも, and relative-clause subject の.
The verb-appearance check now handles a separately tokenized です. Regression
checks distinguish a verbal noun list such as 研究と技術 from conditional と.

Replaced bare 住 examples with explicit use of the component in 衣食住. Preserved
the target identity and incremented both changed housing lesson versions and
all affected recall references. Corrected two pattern headings and removed
unhelpful process disclaimers from learner notes.

Authored B1-health: 38 words, nine instructional lessons, 76 original cards and
16 inspected frozen recall checkpoints. It follows education and precedes the
formal language/work/money material. Earlier household, cooking, housing,
sports and education chapters provide its helpers. Changed one new example to
use the already-known 遅れる instead of borrowing later 遅刻. Recommendations
with Vたほうがいいです are introduced in the rest lesson before use. Explicitly
reviewed nine new inflection surface/reading pairs; no dictionary IDs or level
memberships changed. Read all 76 expanded cards and the saved recall choices.

Checked the official Marugoto B1 contents and level guidance. The intended
progression is toward connected explanations and handling familiar situations;
it is not an official 3,000-new-word quota. See B1-editorial-review.md for sources,
review findings and verification. Current B1 coverage is 448/3,000 across ten
chapters (86 instructional + 174 recall lessons, 835 distinct cards and 2,473
placements). Full authored catalog: 1,391 chapter lessons; all 2,448 assigned
words pass recurrence; 102 tracked grammar introductions pass; A1 scope stays
unchanged. Root suite passed 429/429 tests across 44 files. Final targeted
course/grammar tests pass 45/45 after the ordering adjustment; the final build
passes with the existing large initial-bundle warning (3.09 MB raw / 521 kB gzip).

No paid audio used. Continue B1 curation and level-placement review, then B2–C2;
finish the final catalog-wide editorial/coverage/audio-readiness audit before
paid recording. Neither complete B1 nor complete upper-level coverage is claimed.

### Follow-through: devices, media and post

Added and reviewed B1 technology (40 words, twelve instructional lessons) and
post (twelve words, four lessons). Technology follows language and precedes
work; post follows work and reuses its document and duration vocabulary.
Read all 102 expanded Japanese/English cards and 27 new frozen recall
checkpoints. Corrected the postal duration question and added a second
prepared-state example plus a later recall. Vてあります is explicitly taught
before use in printing; no A1 boundary was expanded.

Added optional offline contextual glosses to the authoring factory. File,
configuration, handout and image senses now match their sentences while
preserving dictionary IDs and independently reviewed morphology. Reviewed 26
new surface/reading pairs. Added tests for identity-preserving glosses, invalid
gloss rejection, and prepared-state grammar classification.

Current B1: 500/3,000 words, twelve chapters, 102 instructional lessons and 201
recall checkpoints, 937 distinct cards and 2,778 practice placements. The
complete authored catalog has 49 chapters and 1,434 chapter lessons, plus five
shared foundations. All 2,500 assigned words pass recurrence, all 103 tracked
grammar introductions pass ordering, and the 414 A1 foundation/instructional/
recall lessons pass the reviewed beginner boundary. Review exports regenerated.

Validation passed; all 433 tests in 45 files passed; production build passed
with the existing large initial-bundle warning (3.11 MB raw / 523 kB gzip).
No paid audio generated. B1's remaining 2,500 identities, all B2–C2 content,
level-placement review and final catalog-wide QA remain outstanding.

### Follow-through: forecasts and landscapes

The previous turn made progress: reviewed device/post content and contextual
gloss support were saved and verified. This turn added B1-weather and
B1-landscape after money: 47 new words, sixteen vocabulary lessons, two
connected-account consolidation lessons and 108 distinct cards. Weather comes
first so mountain routes can use forecasts, snow accumulation and temperature.
The final accounts explain a weather-related change of plan and recount a
mountain walk; neither introduces new targets.

Introduced hearsay そうです and source によると through forecasts, with noun,
verb and adjective examples later in the chapter. Checked the Japan Foundation
grammar reference and recorded it in B1-editorial-review.md. Grammar checks
distinguish hearsay, visual appearance and referential そうです; four additional
tests cover these distinctions and missing instructional declarations.

Reviewed every expanded card, note and all 23 new recall checkpoints after
final compilation. Corrected a rock-surface description, improved the cold
example, and replaced unlearned 宿 with ホテル. Explicitly reviewed 30 morphology
pairs, without granting forms from validator output. No existing published
cards or dictionary memberships changed.

Current coverage: A1 750/750, A2 1,250/1,250, B1 547/3,000; B2–C2 remain
unwritten. B1 now has fourteen chapters, 120 instructional lessons and 224
recall checkpoints, 1,045 cards and 3,064 placements. All 2,547 assigned words
pass recurrence and all 105 tracked grammar introductions pass ordering.
A1's 414 foundation/instructional/recall lessons retain the reviewed boundary.
Dictionary pool consistency and curated validation pass. Full suite: 437 tests
in 45 files pass. Production build passes with the existing bundle-size warning
(3.13 MB raw / 525 kB gzip). Review exports regenerated. No paid audio used.

Continue with coherent B1 chapters and level-placement review. A candidate
placement outlier noticed during authoring is 一晩, currently in C2; it was not
used as an unlearned helper. Review such lexical placements before claiming
the entire six-level pool is appropriate. Remaining B1, B2–C2, final editorial
QA and audio readiness are still unfinished.

### Follow-through: growing plants and observing animals

The preceding turn made concrete progress through the weather and landscape
chapters. Rechecked the authoritative catalog at this turn's start: B1 was
547/3,000. Account usage reported 17% of the weekly window used (83% remaining),
with all three reset credits available; no reset was used.

Added B1-plants and B1-animals after landscape. The two chapters own 53 new
words: 33 in plants and 20 in animals. They contain sixteen vocabulary lessons
and two connected accounts (113 distinct cards), plus 26 frozen recall
checkpoints. Plants develops a garden through seeds, growth, soil/water, crops
and farming communities. Animals builds from pets and feeding to behavior,
farms, observation, birds and handling animals. New lessons use earlier weather,
landscape and plant vocabulary explicitly rather than borrowing unfamiliar
helpers. Consolidation stories add no new targets.

Read every expanded sentence, translation, note and recall placement. Improved
the causal tense for a withered plant, natural word order for surrounding trees,
and the farm account's subject continuity. Reviewed 55 exact spelling/reading
pairs. Dictionary meanings/readings were checked for 描く, まく, 触れる and
feeding with あげる. No grammar inventory expansion or level membership change
was needed. Contextual glosses preserve the existing canonical identities.

Current B1: 600/3,000 words, sixteen chapters, 138 instructional lessons and
250 recall checkpoints, 1,158 distinct cards / 3,374 placements. Full authored
catalog: 53 chapters / 1,519 chapter lessons plus five foundations. All 2,600
assigned words pass recurrence; all 105 tracked grammar introductions pass
ordering. A1's reviewed grammar boundary stays unchanged. Curated validation,
dictionary pool consistency and all 246 learner-app tests across 30 files pass.
Production build passes with the existing bundle-size warning (3.15 MB raw /
528 kB gzip). Review exports are current; no paid audio was generated.

Still outstanding: 2,400 B1 words, all B2–C2 content, further lexical placement
review (including the previously noted 一晩 outlier), final whole-catalog QA
and audio readiness. Keep the goal active; this checkpoint is partial progress.

### Follow-through: reviewed overnight vocabulary transfers

The preceding turn made progress by authoring/reviewing plants and animals.
This turn investigated the previously recorded 一晩 outlier before expanding
the course further. Its C2 placement came from missing imported learning-order
evidence and a low frequency score. Also reviewed ルームメイト in C2. Both are
ordinary accommodation vocabulary and now belong to B1. This is an editorial
placement for Kotoba, not a claim that CEFR assigns those words exclusively
to B1. See `docs/decisions/2026-09-26-reviewed-level-transfers.md`.

Updated only their reviewed B1 priorities/floors and the two affected budgets:
B1 3,002, C2 7,998. The total remains 25,000. The complete before/after membership
comparison proved exactly two transfers, with no other additions, removals or
level moves. Round budgets must not force unrelated demotions. Preserved the
B1 authoring-ID sequence and appended addresses 3005/3006. Saved the original
C2 sequence in a manifest after a regression test caught that it had not yet
been frozen; its old expected identity hash is preserved. Old C2 addresses for
the moved words reject use as C2 targets but their B1 identities resolve for
completed lower-level vocabulary.

Added `B1-travel-overnight` after the existing staying lesson: five targets
(宿, 一晩, 泊める, 過ごす, ルームメイト), ten bilingual cards, three explicitly
reviewed inflection pairs and two ten-card recall checkpoints. Read every
sentence, reading, translation and note. The lesson distinguishes staying from
hosting and explains duration without に. New recall rounds are interleaved
with existing travel review, without replacing old checkpoints. Their titles
describe the content instead of presenting out-of-order sequence numbers.

The final before/after comparison preserves every version and exact card in
the 388 preexisting B1 lessons. Existing completions retain replay behavior;
the new lesson is an additional progression requirement. No A1/A2 memberships
or grammar boundaries changed. Current B1 coverage is 605/3,002, with sixteen
chapters, 139 instructional lessons and 252 recalls, 1,168 distinct cards and
3,404 placements. Full catalog: 53 chapters / 1,522 chapter lessons plus five
foundations. All 2,605 assigned words pass recurrence, all 105 tracked grammar
introductions pass, and A1 scope passes.

Dictionary reproducibility passes; all 440 root tests in 45 files pass. Final
production build passes with the existing 3.15 MB raw / 528 kB gzip initial
bundle warning. Review exports and both course/pool decisions are updated.
No paid audio generated. Remaining: 2,397 B1 words, all B2–C2 content, continuing
placement review, final whole-catalog editorial QA and audio readiness.

### Follow-through: correct A2 prerequisites before B1 roads

The previous turn made progress through reviewed overnight vocabulary transfers
and a new lodging lesson. This turn began B1 roads/driving planning, then fixed
two earlier prerequisites exposed by the standards and dictionary checks.

Irodori Elementary 1 lesson 14 explicitly teaches なければなりません. Added
`A2-work-obligations` immediately after roles/responsibilities, rather than
introducing it for the first time in B1 driving. Six frozen cards use familiar
work/time vocabulary and godan, ichidan and する forms. The explanation states
that the complete construction means must do, not must not do. Added the
tracked obligation rule, an exact first-use declaration, six reviewed form/
reading pairs, and tests for detection and missing instruction. Two later
four-card recalls repeat the six examples with familiar work cards.

メートル was already an A2 target, but キロメートル was in C1. Moved the latter
identity to A2, added `A2-quantity-distance` after measuring, and saved two
four-card recalls. Read all four new distance sentences, the six obligation
sentences, readings, translations, notes and the four recall checkpoints.
The policy rebuild comparison proves exactly one transfer and no unrelated
membership changes; the same 25,000 identities remain. A2/C1 budgets are now
1,251/6,999. B1/C2 stay 3,002/7,998. Appended A2 source address 1267 and preserved
the old C1 address sequence in a manifest matching its original hash. Regression
checks reject the retired C1 target address and preserve lower-level resolution.

All 1,113 preexisting A2/B1 lessons retain their versions and exact cards.
A1 content and boundaries are unchanged. A2 is fully covered at 1,251/1,251:
211 instructional lessons, 517 recalls, 2,461 distinct cards and 7,387 placements.
B1 remains 605/3,002. Total authored catalog is 1,528 chapter lessons plus five
foundations; 2,606 assigned words pass recurrence and 106 tracked grammar
introductions pass ordering. Dictionary pool reproducibility and final build
pass (existing initial-bundle warning: 3.16 MB raw / 528 kB gzip).
The final root suite passes all 444 tests in 45 files. Updated two stale test
assertions from 1,250 to the reviewed 1,251 A2 targets; runtime progress and the
UI already used the canonical pool correctly.

Next authoring work remains B1 roads, directions and driving. Candidate stable
addresses already inspected: 2470 道順, 2152 方角, 2567 突き当たり, 2007 大通り,
2123 街角, 2077 並木, 721 歩道, 2430 人通り, 1127 停留所, 687 横断, 1964 交差,
2013 踏切, 1098 横切る, 1299 工事, 709 通行, 2488 回り道, 625 渋滞, 638 トンネル,
728 通じる, 1133 越す; then 81 免許, 337 ドライブ, 53 義務, 102 エンジン,
1876 モーター, 2861 燃料, 1600 タイヤ, 1781 ハンドル, 1842 車輪, 1324 回転,
2992 走行, 619 ブレーキ, 1297 停止, 1335 整備, 1957 車庫, 1826 時速,
2498 速力 and 2531 追い越す. These are candidates, not authored lessons yet.
Kilometers and obligation can now be reused as completed A2 prerequisites.
Do not force unlearned 回す, 故障 or compound vocabulary into the examples.
No paid audio generated; all-level completion and final catalog review remain.


### Follow-through: B1 directions and driving; repair activity-suffix readings

Authored the two planned road chapters after landscapes and before plants.
Directions has twenty targets, seven instructional lessons and nine recalls;
driving has eighteen targets, eight instructional lessons and ten recalls.
There are 86 original cards and 224 placements. Read every original Japanese /
reading / English triple and note, and inspected every saved recall selection
and anchor. New targets have two original contexts and later retrieval. The
connected final accounts reuse the earlier route vocabulary and grammar.
A1 and A2 content and dictionary memberships are unchanged.

Draft review removed unlearned 沿う, 広場, 余計 and 泥 rather than silently
licensing them. Reused known 交換 and 付く by stable B1 address; avoided the
wrong 十分 identity for ten minutes. Reviewed 21 explicit inflection pairs.

The expanded reading pass caught 走行中 read incorrectly as そうこうなか and
found six equivalent errors in earlier travel, university and work sentences.
Corrected the activity suffix with a separate authored 中（ちゅう） form and
first-use teaching at B1-travel-air-and-water card 2. Preserved 中（なか） in
location phrases. Added grammar detection even for an incorrectly lexicalized
suffix, and explicit potential/passive detection for 通れません / 追い越されました.
This repair required versions on five existing instructional lessons and thirteen
recalls, plus grammar-anchor/reference updates. Compared the before snapshot
`.codex-b1-roads-before-reading-fix.json` with the result: only these eighteen
published lessons and three new draft driving lessons changed cards/versions.

Validation passes for 55 chapters / 1,562 chapter lessons plus five foundations.
A1 is 750/750, A2 1,251/1,251, B1 643/3,002; all 2,644 assigned words pass
recurrence and all 107 tracked grammar introductions pass. B1 has 154 original
lessons + 271 recalls, 1,254 distinct cards and 3,628 placements. Root tests pass
447/447 in 45 files; production build passes with the existing 3.17 MB raw /
530 kB gzip initial-bundle warning. Review exports and B1 editorial report updated.
No paid audio generated. All-level coverage and final catalog QA remain open:
2,359 B1 words and all B2–C2 content remain unauthored. Continue grouping
unassigned B1 words into coherent chapters using their stable source addresses.


### Follow-through: B1 clothing and shopping

The preceding turn made progress by publishing reviewed directions/driving and
repairing the activity-suffix reading. This turn added clothing and shopping
after money and before weather. Clothing owns 35 targets in twelve instructional
lessons; shopping owns 24 in nine. There are 128 new original cards, two connected
accounts with no new words, and 27 saved recall checkpoints. Read every original
Japanese sentence, reading, English translation and note, then all recall choices
and placement anchors. The current course is still linear; free-choice-topic
wording in the original stored goal is superseded by the user's later instruction.

Fixed the draft wool-care phrase to ウールの服を洗う方法. Removed unavailable
helpers and reused already-taught measuring, drying and giving words by their
canonical identities. Thirty lexical surface/reading pairs were individually
reviewed. Added exact grammar detection for 使える and 作られています with
regression assertions. No new productive grammar, no dictionary level moves,
and no changes to earlier card source or lesson versions in this pass.

Clothing words recur across 3–8 lessons / 6–10 placements; shopping words across
3–6 lessons / 6–9 placements. All 2,703 currently assigned words pass exposure;
107 tracked grammar introductions pass; A1's 414 foundation/chapter/recall lessons
remain within the reviewed boundary. Full catalog: 57 chapters / 1,610 chapter
lessons plus five foundations. B1 is 702/3,002, with 175 instructional lessons,
298 recalls, 1,382 distinct cards and 3,984 placements. A1 remains 750/750 and A2
1,251/1,251. Root suite passes 447 tests in 45 files, and build passes with the
existing 3.20 MB raw / 532 kB gzip initial-bundle warning. Logs:
`.codex-b1-clothing-tests.log`, `.codex-b1-clothing-build.log`.

No paid audio generated. The goal remains open: 2,300 B1 words and all B2–C2
lessons remain to be authored and reviewed. Possible next grouping: B1 people,
relationships and visits. Verified unassigned stable addresses: 244 親友,
479 友情, 203 付き合い, 420 交際, 130 デート, 2756 恋愛, 514 婚約,
82 離婚, 494 親戚, 264 孫, 356 双子, 541 独身, 544 一家, 433 主婦,
247 夫人, 476 婦人, 114 嫁, 2682 主人, 2860 旦那, 448 出会う,
596 握手, 99 訪問, 305 集まり, 354 祝い, 733 招く, 37 お迎え,
2501 出迎える, 2607 ごめんください, 2642 お構いなく; also age/life stages
518 幼い, 2678 幼児, 401 青年, 211 成人, 91 老人, 554 年寄り,
2745 世代, 2989 青春. These are candidates only. Handle register and relationship
terms thoughtfully rather than treating all dictionary first glosses as
interchangeable. Keep respectful neutral phrasing and introduce helpers before use.


### Follow-through: B1 relationships, life stages and visits

The previous turn made progress through clothing and shopping. This turn authored
relationships (32 targets / 12 instructional lessons) and visits (11 targets /
5 instructional lessons), positioned after shopping and before weather. Added
96 original cards and 22 recall checkpoints, two of the instructional lessons
being connected accounts with no new vocabulary. Notes distinguish family-term
register and perspective, homophones 夫人/婦人, reciprocal forms, and expressions
used while visiting. The government-hosted residents' textbook was consulted
for family vocabulary variants; it is not evidence of exact CEFR word assignments.
See the B1 editorial report for the source and scope of that check.

Read every Japanese sentence, reading, translation and note. Removed draft helpers
that had not been introduced, and replaced 遊びに来ました because the general
verb-stem purpose pattern had no explicit prior instruction in this catalog.
Twenty exact lexical surface/reading pairs were checked and added. Reused the
already-taught activity suffix in 仕事中 with the correct ちゅう reading.
No new tracked grammar, level transfers or runtime changes. All 473 earlier B1
lessons compare exactly with the saved `.codex-b1-people-before.json` snapshot,
including notes, cards and versions.

Reviewed the 22 saved recall choices and anchors: relationships targets have
3–4 lessons / 6–7 placements; visits targets 3–6 lessons / 6–8 placements.
Current coverage: A1 750/750, A2 1,251/1,251, B1 745/3,002. B1 now has 22 chapters,
192 instructional lessons + 320 recalls, 1,478 distinct cards and 4,252 placements.
Full catalog has 59 chapters / 1,649 chapter lessons plus five foundations.
All 2,746 assigned words pass recurrence; 107 grammar introductions pass ordering;
A1's reviewed boundary still passes. Root tests pass 447/447 in 45 files and the
production build passes (existing 3.22 MB raw / 535 kB gzip initial-bundle warning).
Logs are `.codex-b1-people-tests.log` and `.codex-b1-people-build.log`.

Account usage check at turn start: 24% weekly used / 76% remaining, three reset
credits still available and untouched. No paid audio generated. The goal remains
open: 2,257 B1 words, all B2–C2 content and final whole-catalog editorial QA remain.
Potential next chapters are arts, music and performance, possibly preceded by
emotions/reactions vocabulary for discussing what one saw or heard. Unassigned
addresses inspected include 166 俳優, 208 劇, 237 演技, 271 楽器, 329 作曲,
418 歌手, 653 クラシック, 1036 バイオリン, 1332 バンド, 1363 ステージ,
1364 プログラム, 1498 鑑賞, 1618 演劇, 1631 役者, 2372 オルガン,
562 絵画, 2507 写生, 2793 展示, 2694 開催, 1269 詩, 2748 主人公,
413 著者, 1547 原稿, 1923 文芸, 806 刊行, 2729 掲載. These are candidates,
not authored lessons. Use current membership/ownership and stable authoring ranks
before proceeding. Preserve the linear course despite stale free-choice wording
in the original stored goal.


### Follow-through: repair the missing A1 musical verb before B1 music

The previous turn made progress through relationships and visits. This turn
started emotions/music planning, then investigated a foundational dictionary gap:
弾く（ひく） was absent from the functional pool. Reference identity
jmdict:1419370 is the musical verb; 引く（ひく） and はじく are different
identities and cannot be substituted. The official Marugoto Starter A1 wordbook
explicitly includes ひきます for playing guitar/piano. Corrected the prerequisite
instead of writing around it with 演奏する alone.

Added the musical identity as A1 address 751; removed only jmdict:1036170 カー
from the functional pool, retaining it in reference and reserving its former B1
source address 252 as reference-only. 車 is already A1. Budgets are now A1 751,
B1 3,001; all other budgets unchanged. Full membership comparison proves exactly
one addition / one removal / zero other level moves, preserving a total of 25,000.
The old 750 A1 IDs remain an identical prefix. Updated the A1 hash guard to
3bf4222db9885f2639c08999d7271ace96fe7c883eb7487b099e2b527d340d51.
B1's authoring manifest sequence/hash is unchanged; its retiredEntries keeps カー.

Added A1-leisure-playing-instruments directly after music, with four short,
explicitly reviewed beginner sentences. Existing helpers and grammar only.
Two mixed recalls after quiet-hobbies and skills reuse all four new examples
and familiar listening/concert cards. The new word has eight appearances in
three lessons. Reviewed only 弾きます / ひきます and 弾きません / ひきません.
No new grammar or paid audio. All 1,649 preexisting A1/A2/B1 chapter lessons compare
exactly against `.codex-a1-hiku-before.json` (cards, notes, versions). Existing
history/replay remains; the additions are new course requirements.

Added identity-separation and reserved-address regressions, and updated stale
A1 total assertions. All 449 tests in 45 files pass. Pool reproduction, curated
legality/exposure/grammar/A1 scope and production build pass; initial bundle
remains about 3.22 MB raw / 535 kB gzip. Logs: `.codex-a1-hiku-tests.log`,
`.codex-a1-hiku-build.log`, `.codex-a1-hiku-pool-check.log`. Updated review exports,
A1 scope, bounded-pool and course decisions, reviewed transfers and B1 report.

Current catalog: 59 chapters / 1,652 chapter lessons plus five foundations.
A1 751/751 (147 instruction + 265 recalls, 1,515 distinct / 3,911 placements),
A2 1,251/1,251, B1 745/3,001 (192 instruction + 320 recalls, 1,478 distinct /
4,252 placements). All 2,747 assigned words recur; 107 grammar introductions
pass; 417 A1 foundation/instruction/recall lessons remain within the reviewed
boundary. Remaining: 2,256 B1 words, all B2–C2, final complete-catalog QA and audio.

Return to emotions/music next. Inspected unassigned B1 emotion candidates:
46 印象, 51 興奮, 1756 感激, 565 熱中, 425 夢中, 1422 実感,
609 がっかり, 748 失望, 1022 悲しむ, 384 悩む, 2887 悩み, 218 冷静,
1591 落ち着く, 639 ほっと, 463 さっぱり, 327 幸福, 267 不幸, 255 幸い,
133 自慢, 410 誇り, 576 感心, 458 羨ましい, 2629 羨む, 1375 ありがたい,
812 陽気 and 2478 朗らか. Music candidates from prior turn remain unassigned;
add 1609 リズム, 2462 テンポ, 2520 コーラス, 634 拍手, 445 幕,
455 座席, 317 入場, 2704 出演, 2984 主演, 2802 演出, 2913 主催.
観客 is already B1-sports rank 395, 合わせる rank 504, 演奏 is A2.
The musical verb can now resolve as completed A1 @弾く. Avoid @曲 and @歌詞
as unlearned helpers (both currently B2); do not invent or silently license them.
No emotions or music chapters have been authored yet.


### Checkpoint: B1 feelings and music

Authored `scripts/lib/curated-b1-feelings.mjs` and `curated-b1-music.mjs`,
inserted after visits and before weather. Feelings: 26 words, ten instructional
lessons (including a connected account), 57 originals and twelve recalls.
Music: 19 words, seven instructional lessons (including a connected account),
43 originals and ten recalls. Read every compiled bilingual/reading triple
and every note. No new grammar; reuse earlier relative clauses, conditions,
reasons, ability, ずに, favors and prepared-state てあります. Topic-local exact
recalls are explicitly saved; changed one pair of filler cards to avoid an
immediate repeat and connected the final feelings recall to early impressions.

Removed draft helpers unavailable at this point, bound 大きな to its own A2
identity and できる to its own learned identity, and avoided untaught adjective
nominalization and narrative と. Reviewed forty explicit lexical form pairs,
including the new musical 弾く past/progressive forms. No pool changes or audio.
A bilingual review caught and fixed ありがたいでした → ありがたかったです;
added a narrow invalid adjective/copula check and two meaningful regressions.
Also fixed a venue translation that incorrectly specified a town hall.
NINJAL 感心 usage consulted and linked in the B1 editorial report.

`npm run validate:curated` passes; 2,792 assigned words meet recurrence rules,
107 grammar introductions pass and the 417-lesson A1 scope remains unchanged.
All 512 existing B1 lessons compare exactly with `.codex-b1-feelings-before.json`.
No A1/A2 source edits. Root suite: 451/451 in 45 files. Learner suite: 246/246
in 30 files; initial concurrent run had two five-second UI timeouts, and the
standalone rerun passed without configuration changes. Pool reproduction and
production build pass; existing bundle warning is 3.24 MB raw / 538 kB gzip.
Logs: `.codex-b1-feelings-tests.log`, `.codex-b1-feelings-next-tests-retry.log`,
`.codex-b1-feelings-build.log`, `.codex-b1-feelings-pools.log`.
Review exports and B1 editorial report updated.

Current catalog: 61 chapters / 1,691 chapter lessons, plus five foundations.
A1 751/751 and A2 1,251/1,251 remain complete. B1 790/3,001 across 24 chapters,
209 instructional + 342 recall lessons, 1,578 originals / 4,532 placements.
Remaining: 2,211 B1 words and all B2/C1/C2, complete-catalog final review, audio.
Goal stays active. No paid requests.

Next natural content: theatre/film, then visual arts and reading, keeping
familiar experiences and short connected accounts at B1. Music deliberately
leaves actor/performance roles for that next chapter. Previously inspected B1
candidates (recheck ownership before authoring): 166 俳優, 208 劇, 237 演技,
445 幕, 1618 演劇, 1631 役者, 1274 登場, 2748 主人公, 2802 演出,
2704 出演, 2984 主演, 2706 企画, 562 絵画, 2507 写生, 2793 展示,
1269 詩, 413 著者, 1547 原稿, 1923 文芸, 806 刊行, 2729 掲載.
Do not borrow later-level 曲, 歌詞, 音色 or メロディー as helpers.


### Checkpoint: theatre, visual art, reading and earlier grammar prerequisites

Previous goal turn made verified progress: feelings/music chapters and checks.
This turn authored three more B1 modules after music, before weather:
- Theatre: 14 words, six instructional lessons, 33 original cards, eight recalls,
  83 placements. Distinguishes characters, actors, leading roles, appearances,
  direction and planning; ends with a school-play account.
- Visual art: eight words, four instructional lessons, 21 originals, six recalls,
  51 placements. Paintings, painters, paint, sketching, displays, collections,
  crafts and pottery; ends with an art-class account.
- Reading: eighteen words, seven instructional lessons, 41 originals, nine
  recalls, 111 placements. Authors/poetry, literature/style, publication,
  books, illustrated guides/indexes and reference sources; a flower-name account.

Read all 95 compiled B1 Japanese/reading/English triples and all notes, and all
23 explicit recalls. Named the recalls and replaced a just-taught starring
filler in the first theatre recall with an earlier actor example. Helpers use
only earlier B1 or completed lower-level words. The three chapters add 40
identities, not new dictionary membership.

Found missing explicit earlier instruction in やすい / にくい, たかった and
たくなる. Added A2-shopping-ease after goods, and A2-changes-changing-wishes
after becoming; six authored cards each, no new words. Four saved four-card
recalls after later lessons revisit all twelve examples. Ease belongs with
shopping: verified against Marugoto Elementary 2 A2 topic 6 lesson 12
https://a2-2.marugotoweb.jp/en/grammar/detail/topic6-sec12-1/ . Consulted CAUL’s
Japanese Introductory 1 section 12.5 for past-wish morphology, without claiming
that source specifies a CEFR level. Read all twelve A2 triples and explanations.
A1 is unchanged. Avoided adding adjective て-form before its later introduction.

Added three tracked grammar rules and explicit first-card instructions;
classifier also detects 読まれています and passive する with POS vs-i.
Two regression tests verify missing instruction fails and publication passives
are recognized; adjective ありがたかった does not trigger the wish rule.
Thirty-six explicit lexical surface/reading variants were individually checked,
including あく / ひらく and かく / えがく in context. No automatic allowlist.

All 728 old A2 lessons and 551 old B1 lessons compare exactly with snapshots
`.codex-b1-arts-a2-before.json` and `.codex-b1-arts-before.json`. Cards, notes and
versions are unchanged; new grammar lessons become required going forward.
Root tests: 453/453 in 45 files. Learner tests: 246/246 in 30 files. Pool
reproduction, curated validation and production build pass. Logs:
`.codex-b1-arts-tests.log`, `.codex-b1-arts-next-tests.log`,
`.codex-b1-arts-build.log`, `.codex-b1-arts-pools.log`. Build warning remains
3.25 MB raw / 541 kB gzip initial bundle. Review exports and both A2/B1
editorial reports updated. No paid audio or other external writes.

Current totals: 64 chapters / 1,737 chapter lessons plus five foundations.
A1 751/751 remains at 147 instructional + 265 recall lessons.
A2 1,251/1,251: 213 instructional + 521 recalls, 2,473 originals / 7,415 placements.
B1 830/3,001: 27 chapters, 226 instructional + 365 recalls, 1,673 originals /
4,777 placements. All 2,832 assigned words recur, 110 grammar introductions
pass, 417 A1 foundation/instruction/recall lessons pass the beginner boundary.
Remaining: 2,171 B1 words, all B2–C2, final complete-catalog QA and audio.
Goal remains active, not achieved.

Next candidate: news and reports, preferably after weather so the weather
chapter’s source/hearsay instruction can be reused naturally. Verified unassigned
B1 candidates: 124 出来事, 187 インタビュー, 1090 便り, 1303 作成,
1409 欄, 1559 レポート, 1720 ジャーナリスト, 2158 夕刊,
2738 報道, 2820 メディア, 2828 取材, 2837 特集, 2961 会見.
Keep 669 申告 and 2801 届 for an administrative context rather than forcing
all English-gloss “report” words into news. Recheck ownership before authoring.


### Checkpoint: news, discussion and actual ながら instruction

Previous turn made verified progress with arts chapters and A2 prerequisites.
This turn added `curated-b1-news.mjs` after weather and
`curated-b1-discussion.mjs` after news, before landscape. News reuses the weather
chapter’s source/hearsay instruction and introduces twenty words in six
vocabulary lessons plus an account: 43 originals, ten recalls, 118 placements.
Discussion introduces fifteen words in five vocabulary lessons plus an account:
35 originals, eight recalls, 93 placements. Contextual notes distinguish
personal news/reporting/opinion, gathering information/interviewing, reports and
headlines, discussion/answers/conclusions, misunderstanding/mistaken assumption,
voice/tone and responding. Target words never enter as unlearned helpers.

Read all 78 compiled B1 Japanese/reading/English triples, notes and eighteen
saved recalls. Named recalls; replaced three immediately repeated filler cards
in the split opinion checkpoint with earlier source/interview/newspaper cards.
No duplicate original B1 readings introduced. Corrected the draft lexical
旅行 + 中（なか） to explicit activity suffix 中（ちゅう）. Extended the
sentence-form validator to reject this reading misuse, with a regression that
still accepts the location noun in its proper context.

Fused 頷きながら exposed that ながら existed in function-form metadata but had
no actual introduction. Classifier now recognizes fused lexical ながら. Added
A2-home-simultaneous after tidying: six authored examples and an explicit
same-person/main-action explanation contrasting prior てから. Two four-card
recalls after breakages/moving use all six examples. Read all six compiled
triples and the note. Four A1 stems have explicitly reviewed forms. This brings
new reviewed variants to 23 for this pass. No dictionary membership changes.
Marugoto A2 can-do tasks include speaking while looking at notes; the A2 report
links that primary reference and distinguishes it from our exact lesson choice.

All 734 preexisting A2 lessons and 591 preexisting B1 lessons remain exactly
unchanged (cards, notes, versions), proved against
`.codex-b1-news-a2-before.json` and `.codex-b1-news-before.json`.
New grammar instruction is an additional requirement; historical snapshots
retain replay. A1 content and boundary are unchanged.

Verification: 454/454 root tests in 45 files, 246/246 learner tests in 30 files,
curated validation, dictionary pool reproduction and build pass. Logs:
`.codex-b1-news-tests.log`, `.codex-b1-news-next-tests.log`,
`.codex-b1-news-build.log`, `.codex-b1-news-pools.log`.
Initial bundle warning remains, 3.27 MB raw / 544 kB gzip. Updated review exports
and A2/B1 editorial reports. No paid audio. Usage check: weekly 30% used / 70%
remaining, all three reset credits still available. Leave headroom; do not spend
resets or generate audio before the final catalog review.

Current catalog: 66 chapters / 1,771 chapter lessons plus five foundations.
A1 751/751, unchanged. A2 1,251/1,251: 214 instructional + 523 recalls,
2,479 originals / 7,429 placements. B1 865/3,001: 29 chapters,
239 instructional + 383 recalls, 1,751 originals / 4,988 placements.
All 2,867 assigned words meet recurrence, all 111 tracked grammar introductions
pass, and the 417-lesson A1 beginner audit passes. Remaining: 2,136 B1 words,
all B2/C1/C2 content, final complete-catalog QA and audio. Goal remains active.

Next possible chapter: practical paperwork and requests, using the earlier
work chapter’s 1365 申請, 88 提出, 117 書類, 367 署名, 134 承認,
1902 締め切り and 103 期限, plus post’s 1072 印 and technology’s
2696 登録. Verified unassigned B1 candidates: 669 申告, 2801 届,
1465 手続き, 792 記入, 1580 窓口, 1040 申し込む, 2298 取り消す,
375 許す, 192 代理, 1414 通知. Keep examples as language scenarios, not
jurisdiction-specific legal instructions. Avoid borrowing 用紙/印鑑/無効/代理人
(all B2), 届け出 (C1), or absent 証明書 as helpers. A1 受付 and A2 許可,
申し込み, 有効, 本人, 証明 are available. Recheck ownership before authoring.


### Checkpoint: paperwork, rules and verb endpoints

Previous turn made concrete progress with news/discussion and A2 ながら.
Added `curated-b1-paperwork.mjs` after discussion: eleven targets, four
vocabulary lessons plus a class-application account, 26 original cards,
seven recalls, 66 total placements. 届く was added explicitly as a target,
not borrowed as an unlearned helper. Reuses work/post/news vocabulary.
Added `curated-b1-rules.mjs` after animals at the end of currently authored B1:
eighteen targets, six vocabulary lessons plus an exhibition-selection account,
41 originals, nine recalls, 109 placements. It builds on earlier discussion
and practical contexts before asking learners to describe criteria, equality,
assumptions and conclusions. No pool membership changes.

Read all 67 compiled B1 Japanese/reading/English triples, their notes and all
sixteen exact recall selections; named the recalls. Corrected an awkward
鍵を閉める draft to ドアを閉める and its translation. Reordered the logic of
the selection account: it now starts selecting, discusses criteria, evaluates,
reaches a conclusion and announces the result. Translated 思いました as a
thought rather than a decision. No new B1 duplicate original readings.
Individually reviewed 21 surface/reading variants.

Grammar inspection found Vるまで in old B1-sports-progress as well as the new
counter sentence, while only Nまで was instructed. Added six-card
A2-time-until after order, with four-card recalls after timing and eras.
All six examples read and reviewed. Uses learned A1 vocabulary; no new A2
form permissions. Explains the event endpoint and non-past subordinate verb
with past main clause. Primary reference: Marugoto A2 lesson 11,
https://a2-2.marugotoweb.jp/en/grammar/detail/topic6-sec11-4/ .
Classifier now distinguishes untilClause, detects 呼ばれる, and recognizes
plain てある before a noun. Two new regression tests cover prerequisite
removal and the passive/prepared-state forms. Earlier sports content unchanged.

All 737 existing A2 lessons and 622 existing B1 lessons compare exactly to
`.codex-b1-paperwork-a2-before.json` and `.codex-b1-paperwork-before.json`.
Cards, notes and versions are preserved. A1 and dictionary membership unchanged.
New A2 grammar remains required going forward; historic sessions stay frozen.
Root: 456/456 tests in 45 files. Learner: 246/246 in 30 files. Curated validation,
pool reproduction and build pass. Logs: `.codex-b1-paperwork-tests.log`,
`.codex-b1-paperwork-next-tests.log`, `.codex-b1-paperwork-build.log`,
`.codex-b1-paperwork-pools.log`. Bundle warning: 3.28 MB raw / 546 kB gzip.
Review exports and A2/B1 editorial reports updated. No paid audio.

Current catalog: 68 chapters / 1,802 chapter lessons plus five foundations.
A1 751/751 unchanged. A2 1,251/1,251: 215 instructional + 525 recalls,
2,485 originals / 7,443 placements. B1 894/3,001: 31 chapters,
251 instructional + 399 recalls, 1,818 originals / 5,163 placements.
All 2,896 assigned words recur; 112 grammar declarations pass; 417 A1 lessons
stay within the reviewed beginner boundary. Remaining 2,107 B1 words and all
B2/C1/C2, final complete-catalog QA and audio. Goal remains active.
Last account check in prior turn: 30% weekly used, 70% left, three resets unused.

Next possible topic: time and planning. Verified unassigned B1 candidates:
139 同時, 288 時刻, 315 手間, 440 日付, 546 経つ, 555 途端,
676 スケジュール, 936 生年月日, 1039 今にも, 1249 日中,
1358 改めて, 1361 直後, 1387 回数, 1404 シーズン, 1486 日程,
1626 臨時, 1628 一斉, 1733 毎度, 2053 日にち, 2654 月日,
2951 経過. Recheck ownership, level fit and exact helpers before selecting the
chapter position. 途端 and 今にも need deliberate grammatical treatment if
used; do not treat a dictionary target as blanket permission for a construction.
Do not silently pull in later-level counters or lexicalize 中 with the wrong
reading. 日中 is a separate lexical identity, not the standalone activity suffix.


### Checkpoint: B1 time and planning; A1 boundary maintained

Rechecked the primary Marugoto Starter A1 and Irodori Starter tables of contents
against the existing A1 scope decision. Wants with たい and noun-based ability
fit Starter; fuller potential systems and complex clauses remain later. No
A1/A2 lessons, word memberships or existing grammar declarations changed.

Added `curated-b1-time.mjs`, after paperwork and before landscape. Twenty-one
previously unassigned B1 targets, nine instructional lessons, 49 originals,
twelve named recalls and 133 placements. Topics progress from forms and dates
to schedules, availability, effort/frequency, elapsed time, simultaneous events,
sudden events, imminent events and one coherent trip-replanning account.
Reviewed every Japanese/reading/English triple, note and recall choice; manually
approved sixteen new surface/reading variants. No duplicate original readings.

途端に receives first-use instruction distinguishing unexpected sudden events
from planned actions, supported by the Japan Foundation explanation:
https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/200906.html .
直後に gets a separate note at card three with Vた and Nの attachment. Both
now have tracked prerequisites and tests for missing instruction and A1 scope
rejection. 今にも reuses previously taught verb-stem そう; its later recall
uses different original contexts. Replaced an ambiguous stopped-bus draft
with heavy rain as the clear reason for changing the trip date.

Compared every one of the 650 old B1 lessons against
`.codex-b1-time-before.json`: cards, notes and versions identical. Existing
saved sessions keep exact replay. New chapter prerequisites apply going forward.

Root test assertions initially all passed, but a toast timeout fired after
App unmount and produced an unhandled window error. Fixed the demonstrated
lifecycle bug by owning, deleting and clearing toast timer handles. The
existing topic-review UI test now verifies its actual timer is canceled on
unmount. The complete root suite then passed cleanly: 459 tests / 45 files.
Learner suite: 246 tests / 30 files. Production build and dictionary pool
reproduction pass; existing bundle warning 3.293 MB raw / 547 kB gzip. Logs:
`.codex-b1-time-tests.log`, `.codex-b1-time-next-tests.log`,
`.codex-b1-time-build.log`, `.codex-b1-time-pools.log`.

Updated review exports and B1 editorial report. Current catalog: 69 chapters /
1,823 chapter lessons plus five foundations. A1 751/751 and A2 1,251/1,251
unchanged. B1 915/3,001: 32 chapters, 260 instructional + 411 recalls,
1,867 originals / 5,296 placements. All 2,917 assigned words recur;
114 explicit grammar introductions pass ordering and all 417 A1 lessons pass
the beginner boundary. Remaining: 2,086 B1 words, all B2/C1/C2, final catalog
review and optional audio. Goal remains active. No paid audio generated.

Account check: 35% weekly used, 65% remaining; all three reset credits unused.
Preserve headroom for tomorrow; no reset or paid-credit action taken.


### Checkpoint: B1 safety, accidents and getting help

Previous goal turn made verified progress (time/planning chapter and timer
cleanup). This turn adds the next authored chapter rather than restating status.
Added `curated-b1-safety.mjs` after driving and before plants. Thirty-three
previously unassigned words; twelve instructional lessons, 67 originals and
fifteen named recalls. Progression covers preparation, warnings, fire,
evacuation, injuries, rescue, urgent messages, prevention and severity, ending
in a coherent six-card evacuation-drill account without new targets.

Read every Japanese/reading/English triple and note. Contextual helpers explain
燃える/燃やす, ぶつかる/ぶつける, 助かる/助ける/救う and 溺れる without
implying a fatal outcome. Added explicit instruction for plain-clause comparison
思ったより in the severity note. No new function forms or tracked grammar
rules; all earlier grammar prerequisites precede the new chapter. Three needed
helpers (離れる, 見学, 求める) were made targets with two original uses each.
Manually reviewed 34 new spelling/reading pairs. No duplicate original readings.

Read and named all fifteen recalls. Regrouped a twelve-card block and a
four-card filler block into focused seven-card rescue/prevention and six-card
harm-avoidance blocks. Final chapter: 117 recall placements, 184 total. Each
target meets recurrence. Snapshot `.codex-b1-safety-before.json` proves all
671 old B1 lessons unchanged, including notes, versions and exact cards.
A1, A2 and dictionary memberships unchanged. No runtime code changes this turn.

Checks: 459 root tests / 45 files, 246 learner tests / 30 files, curated
validation, pool reproduction and build pass. The final note-only refinements
were followed by recompilation, validation, learner tests and build. Existing
bundle warning: 3.305 MB raw / 549 kB gzip. Logs `.codex-b1-safety-tests.log`,
`.codex-b1-safety-next-tests.log`, `.codex-b1-safety-pools.log`,
`.codex-b1-safety-build.log`. Updated review exports and B1 editorial report.

Current catalog: 70 chapters / 1,850 chapter lessons plus five foundations.
A1 751/751, A2 1,251/1,251, B1 948/3,001. B1 has 33 chapters,
272 instructional + 426 recalls, 1,934 originals / 5,480 placements.
All 2,950 assigned words recur; 114 explicit grammar introductions pass;
417 A1 lessons pass the beginner boundary. Remaining 2,053 B1 words and
all B2/C1/C2 content, final whole-catalog QA and optional audio. Goal active;
no paid audio. Last account check in prior turn: 35% weekly used, 65% left,
three reset credits unused.


### Checkpoint: B1 outings, hobbies and free time

The preceding goal turn made verified progress on safety. Added
`curated-b1-leisure.mjs`, after safety and before plants, using the earlier
travel, landscape, weather, story and safety vocabulary. Twenty-four targets,
eleven instructional lessons and 54 original cards. The sequence starts with
invitations/preferences, then outdoor meals, rest, camping, fishing/adventures,
winter activities, games, entertainment/reactions and one hiking account.

Read every compiled Japanese/reading/English triple, note and contextual gloss.
Specific helpers explain 人を活動に誘う, 気軽に, 好む versus 好き, テントを張る,
碁を打つ, and playing-card トランプ. The six-card final account teaches no new
words; its note clarifies 午前中（ごぜんちゅう）. The token uses the correct
function suffix ちゅう, not the location noun なか. Replaced a weak grass-is-
green draft with grass wet after rain. Five new lexical forms explicitly
reviewed: 誘いました, 決めています, 好みます, 過ごしたい, 楽しみました.

Reviewed and named thirteen exact recall checkpoints: 96 later placements,
150 placements including originals. All targets have two distinct originals
and meet recurrence. No duplicate new original readings. Snapshot
`.codex-b1-leisure-before.json` proves all 698 preexisting B1 lessons retain
their exact cards, notes and versions. A1, A2 and dictionary memberships are
unchanged. No runtime or shared validation changes.

Validation passes: 246 learner tests / 30 files, curated legality, grammar order,
exposure, A1 scope, pool reproduction and build. Root suite last passed 459 tests
at the safety checkpoint; not repeated for this content-only change. Existing
bundle warning: 3.315 MB raw / 550 kB gzip. Logs
`.codex-b1-leisure-next-tests.log`, `.codex-b1-leisure-pools.log`,
`.codex-b1-leisure-build.log`. Review exports and B1 editorial report updated.

Current catalog: 71 chapters / 1,874 chapter lessons plus five foundations.
A1 751/751, A2 1,251/1,251, B1 972/3,001. B1: 34 chapters,
283 instructional + 439 recalls, 1,988 originals / 5,630 placements.
All 2,974 assigned words recur; 114 grammar introductions and 417 A1 scope
lessons pass. Remaining 2,029 B1 words, all B2/C1/C2, final full-course QA
and optional audio. Goal remains active. No paid audio. Last account check
(two turns ago) was 35% weekly used / 65% remaining, three reset credits unused.

A possible next chapter is materials and making things: investigate unassigned
材料, 金属, プラスチック, 容器, 缶, 棒, ひも, 縄, 天然/人工 and 製造.
Verify identities, ownership and needed helpers before fixing its position.


### Checkpoint: B1 materials; common-word selection gap found

Previous goal turn made verified progress (leisure chapter). Added
`curated-b1-materials.mjs` after leisure, before plants. Twenty-eight new targets,
ten instructional lessons, 61 originals and thirteen named recalls. The sequence
covers raw materials, wood/metals, plastic/rubber, stretching, containers,
strings/ropes, properties, natural/artificial resources, manufacture and assembly.
A six-card bench-making account combines familiar words with no new targets.

Read all triples, notes, hints and recall selections. Fixed the draft 空の缶
from the sky identity/reading to explicit B1 空（から）`jmdict:1245280`;
added a second original and a meaning/reading note. Clarified materials versus
raw materials, manufacture versus making an object, and 伸びる/伸ばす. Eleven
new lexical forms were explicitly reviewed. Edited early recalls to revisit
whole ingredient/metal groups instead of new-card filler, split rubber and
property recalls coherently, and varied the later tying examples. Final
recall placements 98; chapter placements 159. All target recurrence checks pass.

Snapshot `.codex-b1-materials-before.json` proves all 722 old B1 lessons
unchanged (notes, cards, versions). No duplicate new originals. A1/A2, dictionary
membership, runtime and shared validators unchanged. Tests: 246 learner tests /
30 files; curated validation, exposure, grammar, A1 scope, pool reproduction and
build all pass. Root suite last passed 459 at the safety checkpoint, not rerun
for this content-only change. Logs `.codex-b1-materials-next-tests.log`,
`.codex-b1-materials-pools.log`, `.codex-b1-materials-build.log`. Existing bundle
warning 3.327 MB raw / 551 kB gzip. Review exports/editorial report updated.

Current: 72 chapters / 1,897 chapter lessons plus five foundations. A1 751/751;
A2 1,251/1,251; B1 1,000/3,001 (35 chapters, 293 instructional + 452 recalls,
2,049 originals / 5,789 placements). All 3,002 assigned words recur; 114 grammar
introductions and 417 A1 scope lessons pass. Remaining 2,001 B1 words and all
B2/C1/C2, final full-catalog review and optional audio. Goal active; no paid audio.
Account check this turn: 39% weekly used / 61% remaining; three reset credits
still unused. Preserve headroom for tomorrow.

Next priority: repair a demonstrated common-word omission, with reviewed level
placement and stable IDs. 石（いし）`jmdict:1382440` and 先（さき）
`jmdict:1387210` exist as common entries in `public/dictionary/jp/entries/`
and `reference-index.json` (218,765 rows), but not in `index.json` (50,000 rows)
or the functional `study-index.json` (25,000). The capped `index.json` instead
contains 石（こく）`jmdict:1382450`. `build-study-pools.py` constructs its
ranked candidates only from `source_ids` in that capped index, so it never
considers the omitted common readings. The materials chapter avoids these
unknown helpers; no fix has been applied yet. Verify primary Marugoto/Irodori
level/meaning evidence, read prior reviewed-transfer decisions and identity
contracts, then make a narrow, reproducible correction. Do not simply replace
the candidate source and reshuffle all level memberships. Inspect whether other
common beginner anchors are omitted for the same reason before claiming the
functional dictionary is fully sound.


### Checkpoint: restore missing common readings without widening A1

Reviewed the capped-source defect found after materials. The pinned community
N5/N4 joins expose 56 identities absent from the 50,000-row source shortlist;
32 now have explicit functional placement and 24 remain unresolved. Added a
reproducible `source-shortlist-gaps.json` diagnostic to the pool builder and a
candidate-by-candidate editorial triage in
`docs/reviews/2026-09-26-curated-course/dictionary-shortlist-review.md`.
Community anchors are discovery evidence, not CEFR or official JLPT assignments.

Added 先（さき）`jmdict:1387210` and 石（いし）`jmdict:1382440` to A2 with
explicit priorities/floors. Irodori Elementary 1 supports 先に and この先; 石
is an editorial concrete-outdoors placement. Revised the bounded-pool decision:
reviewed omissions may expand the original round total without evicting unrelated
words. A2 1,253, total 25,002; all other budgets unchanged. Exactly two additions,
no removals or other moves. A1 still 751. All 1,267 A2 source addresses preserved;
appended 1268/1269, updated hash to
`0c818916593e42705b3c2bb4f5f5bab1a622a4c78fab7eadb0bd51a2477e76bd`.

Added two short lessons after travel roads and nature lakes/rivers. Eight new
originals, four six-card recalls. Read every new triple/hint/note/recall. The
validator caught an early contrastive が in the stone draft; simplified it to
この石は重いです. No new grammar or lexical forms. Each new word has twelve
exposures over three lessons. All 1,897 old chapter lessons are exactly preserved
in `.codex-basic-gap-before.json`. Dictionary UI now displays the loaded pool
size instead of hard-coding 25,000.

Full source regeneration, curated coverage/exposure/grammar/A1-scope checks,
pool reproduction, 461 root tests / 45 files, 246 learner tests / 30 files and
production build pass. Initial root failures were two expected A2 count fixtures,
updated from 1,251 to 1,253; final rerun passes. Logs `.codex-basic-gap-*-tests.log`,
`-build.log`, `-pools-check.log`, `-validation.log`, `-regenerate.log`.
Existing bundle warning: 3.329 MB raw / 552 kB gzip. Review exports and A2
editorial report refreshed. No paid audio. Goal remains active.

Current catalog: 72 chapters, 1,903 chapter lessons plus five foundations.
A1 751/751, A2 1,253/1,253, B1 1,000/3,001. A2 has 217 instructional lessons,
529 recalls, 2,493 originals / 7,475 placements. B1 unchanged: 293 instructional,
452 recalls, 2,049 originals / 5,789 placements. All 3,004 assigned words pass
recurrence, 114 grammar introductions ordered, 417 A1 scope lessons pass.
Remaining: 2,001 B1 words, all B2/C1/C2, dictionary omissions, final catalog QA
and optional audio. Last account observation was 39% weekly used / 61% remaining,
three resets unused; not rechecked this turn.

Next priority: finish the basic-omission review before more B1 expansion. Start
with 一日（いちにち）and ゼロ: inspect primary beginner material and current
numeric forms, distinguish duration from calendar ついたち and ゼロ from れい,
then choose narrow teaching/identity repairs. Neither exact surface/reading was
found in compiled A1–B1 cards in this audit. Other candidates include 開く／ひらく,
止める／とめる and 空く／すく; do not substitute different homographs. The
review table lists all 24 pending dispositions, including polite variants and
outdated vocabulary which must not be added automatically. Current dictionary
coverage is not a claim that this lexical audit is finished. Preserve credit
headroom and all previous lesson/source identities.


### Checkpoint: A1 day-duration and zero repairs

Previous goal turn was verified progress: restored two A2 readings and added the
shortlist diagnostic. This turn restores 一日（いちにち）`jmdict:1576260` and
ゼロ `jmdict:2839962` in A1, following the pending beginner audit. Marugoto
Starter A1 wordbook printed page 79 explicitly includes the day duration. ゼロ
is an editorial addition for checking phone digits, not a claimed official
word-level CEFR mandate. Distinguish existing １日／ついたち and A2 零／れい.

A1 source addresses 752/753 are appended after the unchanged first 751 entries.
New A1 hash `c31656bad01c7201f1a0212a7ae915ad79f9fbe84e6961fe4df65fe11422f624`.
Budget A1 753, total 25,004. Exact pool diff: two additions, no removals or other
level changes. Snapshot `.codex-a1-day-zero-before.json` preserves all 1,903
preexisting chapter lessons (412 A1, 746 A2, 745 B1) exactly.

Added `A1-time-one-day` after irregular dates: four examples distinguish a day’s
duration, a day off and being at home all day. Added `A1-conversation-zero` after
phone vocabulary: two short question/answer exchanges check phone-digit groups.
The note explains that these are number fragments and gives よん／なな／きゅう
for individual digits. Explicitly reviewed 四／よん and 七／なな after checking
the underlying dictionary readings. No other forms added. Read all eight
original triples, hints, notes and four six-card recall selections. Two recalls
per new word; both occur on twelve card placements over three lessons. The
zero target occurs twice on each of two source cards, which is not counted as
extra card coverage. No later-level grammar introduced.

Full source regeneration, curated vocabulary coverage, exposure, grammar order,
A1 scope, pool reproduction, 463 root tests / 45 files, 246 learner tests / 30
files and build pass. Logs `.codex-a1-day-zero-root-tests.log`, `-next-tests.log`,
`-build.log`, `-pools-check.log`, `-validation.log`, `-author.log`. Existing bundle
warning 3.332 MB raw / 552 kB gzip. Refreshed review exports and the scope,
transfer and bounded-pool decisions. Gap review now has 34 selected / 22 pending
of 56 shortlist omissions. No paid audio. Goal remains active.

Current catalog: 72 chapters, 1,909 chapter lessons plus five foundations.
A1 753/753: 149 instructional + 269 recalls, 1,523 originals / 3,943 placements.
A2 1,253/1,253: 217 instructional + 529 recalls, 2,493 originals / 7,475 placements.
B1 1,000/3,001: 293 instructional + 452 recalls, 2,049 originals / 5,789 placements.
All 3,006 assigned words pass recurrence, 114 grammar introductions are ordered,
423 A1 scope lessons pass. Remaining: dictionary candidates, 2,001 B1 words,
all B2/C1/C2, final full-catalog QA and optional audio. Account check this turn:
42% weekly used / 58% remaining, three reset credits still unused. Preserve
headroom for tomorrow; do not consume resets.

Next priority remains the 22 missing-basic candidates in
`docs/reviews/2026-09-26-curated-course/dictionary-shortlist-review.md`.
Investigate 開く／ひらく, 止める／とめる and 空く／すく against primary elementary
materials and their distinct identities. Also settle the remaining N5 matches
方／かた and それでは, and decide which polite variants belong as explicitly
reviewed forms rather than separate word targets. Do not bulk-add outdated or
register-sensitive list entries. Complete recorded dispositions before claiming
the functional dictionary is sound; current coverage counts only prove that
selected A1/A2 identities have authored instruction and distributed exposure.


### Checkpoint: elementary verb gaps and a B1 identity defect

Previous turn made verified progress with the A1 day/zero additions. This turn
restores three missing reference identities in A2: 止める／とめる
`jmdict:1310670`, 空く／すく `jmdict:1586265`, 開く／ひらく `jmdict:1202440`.
These are editorial placements in elementary travel/study tasks, not a community
N4-to-CEFR conversion. Irodori's elementary travel descriptions support the
crowding task; specific senses/forms were checked against the source entries.

A2 now 1,256, total 25,007. Exactly three pool additions, no removals or other
level changes. All 1,269 existing A2 source addresses preserved; append 1270
止める, 1271 空く, 1272 開く／ひらく. A2 hash:
`5b14365023a4b110f7a0131b35c8046ad62b1a41b955d0fa3bc87ed18853427b`.
Added stopping/uncrowded lessons after travel roads and opening-books after study
materials. Thirteen originals, six six-card recalls; four target originals and
twelve card placements per new word. Eight reviewed lexical form pairs. Read
all triples, hints, notes and recall selections. Fixed the notebook helper to
prior A2 rank 94; it is not A1. Chose ordinary express trains rather than steam
trains for the quiet-transport recall, and textbook reading rather than a second
older dictionary synonym in the last book recall.

Important audit correction: two old B1 cards had the correct ひらきました reading
but the wrong あく dictionary identity. Fix `B1-reading-finding` card 006 and
`B1-reading-account` card 004 to A2:1272. Advance both source lessons and their
two affected recalls (`B1-reading-revisit-05`, `B1-reading-revisit-08`) to version
2. Update recall references, remove the incorrectly approved ひらきました form
from `jmdict:1586270`, and add focused regression checks. Their Japanese,
readings and English remain identical; vocabulary binding/hint are corrected.
Keep three valid B1 theatre/news あく uses explicit as A1:578 because bare
`@開く` is now ambiguous. All 1,905 other preexisting chapter lessons are exactly
preserved in `.codex-a2-basic-verbs-before.json`. A1 and all older A2 lessons
are unchanged. No grammar-instruction anchors needed updating for these revisions.

Full source regeneration, curated coverage/exposure/grammar/A1 scope, dictionary
reproduction, 465 root tests / 45 files, 246 learner tests / 30 files and build
pass. Logs `.codex-a2-basic-verbs-root-tests.log`, `-next-tests.log`, `-build.log`,
`-pools-check.log`, `-validation.log`, `-author.log`, `-author-final.log`.
Existing bundle warning 3.335 MB raw / 552 kB gzip. Review exports, A2/B1
editorial reports, shortlist audit, transfer and pool decisions updated.
No paid audio. Goal active. Last account check was the previous turn: 42% used /
58% remaining, three unused resets; not rechecked this turn.

Current catalog: 72 chapters / 1,918 chapter lessons plus five foundations.
A1 753/753: 149 instructional + 269 recalls, 1,523 originals / 3,943 placements.
A2 1,256/1,256: 220 instructional + 535 recalls, 2,506 originals / 7,524 placements.
B1 1,000/3,001: 293 instructional + 452 recalls, 2,049 originals / 5,789 placements.
All 3,009 assigned words pass recurrence, 114 tracked grammar introductions
ordered, 423 A1 scope lessons pass. Dictionary shortlist gaps: 37 selected /
19 pending out of 56. Still incomplete: 19 dispositions, 2,001 B1 targets, all
B2/C1/C2, full final catalog audit, optional audio. Keep credit headroom.

Next priority: settle the remaining N5-linked 方／かた and それでは with a
primary-source/sense review and a restrained placement; no automatic JLPT/CEFR
mapping. Then record explicit decisions for polite variants (お皿, お弁当,
ご主人, お見舞い), register-sensitive words and remaining common standalone
words in the shortlist report. Do not count a related existing identity as
coverage without actual reviewed form/sense instruction. The two B1 identity
errors demonstrate why correct-looking surface sentences alone do not prove
vocabulary bindings correct; include that in the final full-catalog audit.


### Checkpoint: polite reference and conversation transitions

Previous turn made verified progress with three A2 verbs and corrected two B1
identity bindings. This turn restores 方／かた `jmdict:1516925` and それでは
`jmdict:1406050` in A2. Primary evidence: Irodori Elementary 1 wordlist includes
～の方 (polite person) in lesson 15 and それでは in lesson 18. Their N5 community
anchors are not treated as A1 assignments. Keep A1's じゃあ and grammar boundary
unchanged; A2 provides the more formal transition. Use the ordinary kana display
それでは rather than 其れでは, and the polite-person gloss for かた rather than
the reference entry's first direction sense.

A2 now 1,258, total 25,009. Exactly two additions, no removals or other level
changes. All 1,272 A2 authoring addresses are an unchanged prefix; append 1273
方／かた and 1274 それでは. New A2 hash:
`47fd9cb5c42d5ad1484a3a7842a9585e8f1d207078cd4642a5e68b873248c847`.
Audit found no existing 方／ほう lexical token with an incorrect かた reading.
The B1 sports direction card changes only its authoring reference from `@方`
to A2:1264, so it stays unambiguous with identical compiled content. Regression
checks cover both 方 identities and ordinary kana display of the transition.

Added `A2-people-polite-person` after family and `A2-conversation-moving-on`
after asking. Four originals per target, two later six-card recalls each.
Read all eight triples, hints, notes and all four recall selections. Polite
family phrases accompany person-reference recalls; agreement on time/place,
passing a time and acknowledging understanding accompany the transition recalls.
No new lexical form approvals or grammar rules. Snapshot
`.codex-a2-politeness-before.json` proves all 1,918 prior chapter lessons are
identical (418 A1, 755 A2, 745 B1), including notes and versions.

Full source regeneration, curated coverage/exposure/grammar/A1 scope, pool
reproduction, 467 root tests / 45 files, 246 learner tests / 30 files and build
pass. Logs `.codex-a2-politeness-root-tests.log`, `-next-tests.log`, `-build.log`,
`-pools-check.log`, `-validation.log`, `-author.log`, `-author-final.log`.
Existing bundle warning 3.338 MB raw / 553 kB gzip. Review exports, A2 editorial
report, shortlist review, transfer and pool decisions updated. No paid audio.
Goal active; the latest explicit user direction remains one linear course with
ordered topic chapters, overriding the older freely selectable goal wording.

Current catalog: 72 chapters / 1,924 chapter lessons plus five foundations.
A1 753/753: 149 instructional + 269 recalls, 1,523 originals / 3,943 placements.
A2 1,258/1,258: 222 instructional + 539 recalls, 2,514 originals / 7,556 placements.
B1 1,000/3,001: 293 instructional + 452 recalls, 2,049 originals / 5,789 placements.
All 3,011 assigned words pass recurrence, 114 grammar introductions ordered,
423 A1 scope lessons pass. Source shortlist gaps: 39 selected / 17 pending of 56.
Still incomplete: those dispositions, 2,001 B1 targets, all B2/C1/C2, final
full-catalog QA and optional audio. Last account check two turns ago: 42% used /
58% remaining, three unused resets. Not rechecked this turn; preserve headroom.

Next useful batch: review お皿 / お弁当 / ご主人 / お見舞い against their existing
base identities, source senses and actual course usage. Decide whether explicit
reviewed polite variants can teach them without duplicate target identities;
never infer coverage from a prefix or from a related dictionary entry alone.
If forms are used, author their instruction/examples and recalls, with contextual
register guidance, and record the excluded-reference disposition explicitly.
Also settle 非常に against the existing emergency-focused 非常; shared spelling
does not prove its intensifier sense is taught. Remaining register-sensitive
words and contemporary usefulness decisions are listed in the shortlist review.


### Checkpoint: explicit A1 food variants and instruction guard

Previous turn made verified progress with polite-person 方 and それでは. This
turn reviewed local reference senses for お皿, お弁当, ご主人, お見舞い and 非常に;
implemented only the two food variants. Do not count the other three as settled.

お皿 `jmdict:1299685` and お弁当 `jmdict:1513065` remain reference-only entries.
Teach their plate/bento forms under the existing functional learning IDs
`jmdict:1299680` / A1 address 667 and `jmdict:1513060` / A1 address 671.
The full dictionary entries stay distinct; no global aliases, productive prefix
stripping, level changes, new target counts or authoring-address changes.
Local JMdict cross-references and shared object senses support this choice.
The Agency for Cultural Affairs historical usage survey provides primary
usage evidence; it does not establish current prevalence or an official A1 level.
Source and editorial rationale are in dictionary-shortlist-review.md.

Added `A1-food-polite-food-words` immediately after tableware, with six short
originals and a restrained “Words you will hear” note. Explain whole expressions,
not a general honorific system. Exact forms お皿／おさら and お弁当／おべんとう
explicitly added to reviewed-forms.json. Two six-card recalls after eating-out
and grammar-wants reuse four variant cards plus two familiar ordering/cooking
cards each. Each variant has three originals and seven placements across three
lessons. Read all six originals and both recall sets, readings, notes and hints.

New `lexical-variant-instruction.json` declares exact form, base identity,
reference identity, teaching lesson and evidence. New pure validator module
`curated-lexical-variants.mjs` is called by validate-curated-course: requires
one functional identity, explicit form approval, previously taught base,
instruction before first use, correct bindings and two later chapter recalls.
It checks prior uses even when a word is available from a completed lower level.
Six tests cover valid repeated instruction and failures for early use, missing
base/approval/instruction, wrong identity, duplicate functional targets,
wrong-chapter recalls and invalid declarations. This manifest is deliberately
limited to the reviewed variants; it does not certify arbitrary other senses.
Audio still uses the exact surface/reading and cannot substitute a plain-word
clip for the お-form. No audio requests made.

Snapshot `.codex-food-variants-before.json` proves all 1,924 prior chapter lessons
unchanged: 418 A1, 761 A2, 745 B1. Full source regeneration, curated coverage,
exposure, grammar and A1 scope, pool reproduction, 473 root tests / 46 files,
246 learner tests / 30 files and build pass. Logs `.codex-food-variants-author`,
`-validation`, `-root-tests`, `-next-tests`, `-build`, `-pools-check`, `-review`
(all .log). Existing bundle warning: 3.339 MB raw / 553 kB gzip. Updated contract,
quality guide, A1 scope review, shortlist dispositions and bilingual exports.

Current catalog: 72 chapters / 1,927 chapter lessons plus five foundations.
A1 753/753: 150 instructional + 271 recalls, 1,529 originals / 3,961 placements.
A2 1,258/1,258: 222 instructional + 539 recalls, 2,514 originals / 7,556 placements.
B1 1,000/3,001: 293 instructional + 452 recalls, 2,049 originals / 5,789 placements.
All 3,011 assigned words pass recurrence; 114 grammar introductions ordered;
426 A1 foundation/instructional/recall lessons pass scope. Pool remains 25,009.
Source shortlist diagnostic remains 39 selected / 17 unselected of 56;
editorial disposition is now 39 selected + 2 explicitly taught variants + 15
pending. Do not conflate selected identity counts with taught-variant coverage.
Goal remains active and incomplete: remaining dictionary dispositions, 2,001 B1
targets, all B2/C1/C2, final full-catalog quality audit and optional audio.
Last account observation now three completed turns old: 42% used /58% remaining,
three unused resets. No usage check or resets this turn; preserve headroom.

Next useful work: ご主人 and お見舞い need more careful register/context handling.
B1 source address 2682 主人 is taught in relationships-spouse-words with a local
wrapper gloss “my husband (traditional usage here)”; do NOT reuse that hint for
ご主人 (someone else’s husband). Reference `jmdict:1270390` is honorific spouse
reference; use a contextual override if choosing a shared variant. B1 address
756 見舞い is taught in health-care; that lesson is currently the last original
in its chapter, so thoughtful spacing needs more than two immediate tail recalls.
Reference お見舞い `jmdict:1001870` includes the same visit/gift senses and an
unrelated dealing-a-blow sense; only the visit sense is appropriate here.

非常 A2 address 764 / `jmdict:1484920` has emergency as its taught noun sense.
Reference 非常に `jmdict:1484930` cross-references the base's second adjectival
sense “extreme”; do not claim intensifier instruction from the emergency lesson.
Other 12 pending candidates and source IDs remain in dictionary-shortlist-review.
Do not allow this dictionary audit to silently expand A1 grammar. New explicit
user direction stays one linear course; the active goal's older freely
selectable-topic wording is superseded.


### Checkpoint: B1 polite reference, illness visits and health coverage

Previous goal turn made verified progress: two A1 food variants, explicit
instruction guard and passing checks. This turn settles ご主人 and お見舞い
and teaches two previously unassigned B1 health targets. The later user decision
for one linear course still overrides free-topic wording in the active goal.

Source review: JMdict `jmdict:1270390` ご主人 specifies someone else's husband;
`jmdict:1579780` 主人 includes one's own husband among its senses. Nihongo de
Care-Navi explicitly teaches the own/other distinction. Teach ご主人 under
existing B1 address 2682, after relationships-spouse-words, with contextual hint
“someone else’s husband (respectful reference)”. Call authorLesson directly to
avoid the chapter wrapper's own-husband gloss. Existing 主人 hints stay exact.
New usage note includes person preference/name and does not teach productive ご.
Four originals and two later recalls after growing/account: twelve placements.

JMdict 見舞い / お見舞い share the illness-visit sense. Teach お見舞い under
B1 address 756 / `jmdict:1604690`, retaining reference `jmdict:1001870` separately.
Exclude the reference entry's unrelated dealing-a-blow sense from this disposition.
Primary JF teaching newsletter confirms the hospital-visit usage. Add polite-visit
after care, four originals plus a later account example and two recalls after
sneezing/symptoms-account: thirteen placements. Both variants added to the
explicit instruction manifest, now four declarations. Neither reference entry
becomes a new target or global alias. All pool memberships/addresses unchanged.
Shortlist remains 39 selected / 17 unselected; editorial status now 39 selected,
four taught-variant dispositions, thirteen pending (including 非常に).

Added B1 包帯 address 2121 / `jmdict:1603360` and くしゃみ address 2087 /
`jmdict:1003710`, already selected but previously unassigned. Four originals each,
plus an account and two recalls yield five distinct originals and fourteen
placements across four lessons per word. Do not use 巻く as an unexplained helper
here: its current B1 ownership is later in clothing. Use 包帯をしています and
変えます instead, with explicit instruction. Added two six-card accounts: an
injury/medical visit/rest/visitor, then a separate speaker describing sneezing,
a temperature check and clinic contact. No additional tracked grammar rules.

Reviewed and approved eight exact forms: ご主人／ごしゅじん, お見舞い／おみまい,
来てくれました／きてくれました, 止まりません／とまりません,
変えてくれました／かえてくれました, 休んでいます／やすんでいます,
測りました／はかりました, 診てもらいます／みてもらいます.
Contextual hints fix 休む to rest rather than absence and 止まる to ceasing,
not just physical movement. Read all 28 new originals and 48 recalled placements,
including readings, English, notes and token hints. Rewrote two duplicate drafts:
a repeated visit sentence and a draft identical to an existing A2 fever card.
Normalized-reading comparison finds none of the 28 new originals duplicates any
preceding chapter original. Added regression test for preserved own-husband vs
new other-husband hints and aligned token/card explanations.

Snapshot `.codex-care-variants-before.json` proves all 1,927 preceding lessons
identical: 421 A1, 761 A2, 745 B1. Six new instructional/consolidation lessons and
eight six-card recalls. Source regeneration, complete A1/A2 coverage, all authored
vocabulary/grammar/exposure checks, A1 scope and pool reproduction pass. Build
passes with existing size warning: 3.345 MB raw /554 kB gzip. Review exports,
B1 editorial report and shortlist dispositions updated. Corrected stale current
A1/A2 budget numbers in curated-topic-course decision to 753/1,258.

Test caveat: two default parallel root runs failed while loading dictionary
exports, first in five files and then only src/app. No dictionary source changes
occurred; file timestamp unchanged. Targeted dictionary + authoring tests pass
(24 tests). Full root suite with --no-file-parallelism passes 474 tests /46 files.
This suggests runner concurrency involvement but does not prove the cause or
fix the default parallel failure. No production workaround or weakened assertion
was introduced. Keep the failure logs for follow-up, and use the full serial root
command if this intermittent issue recurs. Learner suite result recorded below.
Logs `.codex-care-variants-{author,validation,review,root-tests,root-tests-retry,
root-tests-serial,targeted-tests,next-tests,build,pools-check}.log`.

Current catalog: 72 chapters /1,941 chapter lessons +five shared foundations.
A1 753/753: 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2 1,258/1,258: 222 instructional +539 recalls, 2,514 originals /7,556 placements.
B1 1,002/3,001: 299 instructional +460 recalls, 2,077 originals /5,865 placements.
All 3,013 assigned words pass recurrence; 114 tracked grammar introductions ordered;
426 A1 lessons pass scope. Thirteen dictionary dispositions remain; B1 still has
1,999 unassigned targets, B2/C1/C2 unauthored, final full-catalog QA/audio pending.
Goal active and incomplete. Account checked this turn: 46% weekly used,54%
remaining,three unused reset credits. No resets or paid audio used.

Next useful batch: settle 非常に separately from emergency-focused A2 非常
(address 764 / `jmdict:1484920`). The reference adverb `jmdict:1484930` points to
its second adjectival sense, extreme. Consider a B1 formal description/notice
lesson with explicit sense/register instruction and later recalls; don't infer
intensifier coverage from the A2 emergency noun. Other candidates are in the
shortlist report (この頃, 力, 心, register-sensitive terms, administrative suffixes,
FAX, 君, 看護婦). Keep decisions grounded in source senses and practical use,
without mapping community JLPT anchors automatically onto CEFR or widening A1.

Learner verification completed: default `npm run next:test -- --reporter=dot`
passes 246 tests /30 files. All tool sessions from this checkpoint are terminal.


### Checkpoint: formal reading, intensifier and deprecated-term disposition

Previous turn made verified progress with two B1 lexical variants, health
coverage and connected accounts. This turn settles three more shortlist entries.
Read all thirteen remaining candidates' local JMdict senses before making these
choices. No A1 expansion and no automatic JLPT/CEFR mapping.

Teach 非常に `jmdict:1484930` under existing A2 非常 `jmdict:1484920`, address
A2:764. The reference cross-references the base's second adjectival sense,
extreme intensity. The A2 emergency-noun lesson cannot license the new adverb.
`B1-weather-strong-descriptions` follows visibility, with four examples using
familiar wind, heavy rain, temperature and a dangerous road. Explicit note and
hint distinguish very/extremely from an emergency. Direct authorLesson call
avoids the weather wrapper's fixed gloss object. Primary JMA wind/rain pages
support the genre/wording, not the CEFR placement or any invented category
threshold. Two six-card recalls after ice and plans yield twelve placements.

Teach 私／わたくし `jmdict:2842390` under A1 私／わたし `jmdict:1311110`.
Same first-person meaning; do not claim coverage of the reference entry's
private-affairs/selfishness senses. JF teaching notes support the formal-register
reading. `B1-language-formal-self` follows translation and earlier register
instruction. Four examples use schedule explanation, interpreting work,
specialty and joining a meeting. Note keeps わたし for ordinary polite speech;
pronoun choice does not silently grant honorific verbs. Two six-card recalls
after kanji and writing yield twelve placements. Hint explicitly says formal
reading わたくし. The full reference entries remain separate, not global aliases.

Two exact reviewed forms added: 非常に／ひじょうに and 私／わたくし. Explicit
variant-instruction manifest now has six declarations; its exact reading match
correctly distinguishes earlier 私／わたし uses from the later formal reading.
No additional tracked grammar introductions. Read all eight new original triples,
24 recalled placements, notes and hints. Normalized-reading comparison finds no
new original duplicate of a prior chapter original.

看護婦 `jmdict:1213870` is now explicitly excluded by study-pool-policy. Its sole
source sense is deprecated/obsolete; the Japanese Nursing Association historical
review confirms the move to 看護師, already A2 `jmdict:1928100`. Retain the older
entry for reference reading; no required synonym lesson or progress target.
Builder reproduction passes. Snapshot `.codex-formal-variants-before.json`
proves the full study index and all pool memberships unchanged, plus all 1,941
preceding lessons exact (421 A1,761 A2,759 B1). Existing histories/versions and
all numeric authoring addresses are intact.

Dictionary shortlist now: 39 selected, six explicit taught-variant dispositions,
one explicit reference-only exclusion, ten still pending. Raw gap diagnostic
remains 39 selected /17 unselected. The review includes a source-sense check and
proposed direction for each remaining entry. No pending entry is claimed taught.
Next priority: restore standalone この頃 (current-period usage), 力 (physical
strength/force first), and 心 (mind/feelings) with a restrained A2 placement and
complete instruction/recalls. Their independent meanings are not covered by
compounds. Future honorific words require subject/register instruction; 市／し
and 都／と need place-name/suffix policy; FAX needs a normal display choice;
君 must be recognition in an appropriate relationship, not neutral “you.”

Source regeneration, full curated coverage/exposure/grammar/A1 scope and pool
reproduction pass. Full root suite run serially from the outset due to last
turn's documented parallel loader failures: 474 tests /46 files pass. Build
passes; existing bundle warning 3.348 MB raw /554 kB gzip. No production/test
runner changes or new test assertions this turn. Learner suite result below.
Logs `.codex-formal-variants-{pools,pools-check,author,validation,review,root-tests,
next-tests,build}.log`. Updated shortlist review, B1 editorial review, bounded
pool decision, policy and bilingual exports. No paid audio generated.

Current catalog: 72 chapters /1,947 chapter lessons +five foundations.
A1 753/753: 150 instructional +271 recalls,1,529 originals /3,961 placements.
A2 1,258/1,258: 222 instructional +539 recalls,2,514 originals /7,556 placements.
B1 1,002/3,001: 301 instructional +464 recalls,2,085 originals /5,897 placements.
3,013 assigned words pass recurrence;114 tracked grammar introductions ordered;
426 A1 lessons within scope. Pool remains 25,009. Goal active and incomplete:
ten dictionary dispositions, 1,999 B1 targets, all B2/C1/C2, final full-catalog QA
and optional audio remain. Default parallel-root loader issue also remains
unresolved. Last account check one turn ago: 46% used /54% remaining, three unused
resets. No account check or resets this turn; preserve tomorrow's headroom.

Learner verification: default next:test passes 246 tests /30 files. All tool
sessions from this checkpoint are terminal; no work is waiting in a process.


### Checkpoint: three missing standalone A2 words

Previous goal turn made verified progress with 非常に, 私／わたくし and the
reference-only 看護婦 disposition. This turn adds この頃 `jmdict:1004710`,
力 `jmdict:1554820`, and 心 `jmdict:1360480` to A2. Read local JMdict senses;
NINJAL entries support current-period and heart/mind usage. These sources do not
assign CEFR levels. A2 placement is editorial around familiar daily routines,
physical effort and ordinary feelings. Compound entries cannot stand in for
these independent lexemes. A1 scope/membership/content remain unchanged.

Pool A2 grows 1,258 →1,261; total 25,009 →25,012. Explicit priorities and concise
gloss overrides: these days/lately, strength/force, heart/mind/feelings. Exact
membership comparison proves only these three additions, no removals or other
level moves. All 1,274 A2 source addresses remain an unchanged prefix. Append
1275 この頃, 1276 力, 1277 心. New A2 hash:
`9251f4aa09839fc485f87a791996e81a5b516f7e4e47d8af47eb4a94c48cd34f`.
Budget fixtures changed to 1261/25012; no test requirements relaxed.

Added A2-time-these-days after recent, A2-sports-strength after activities,
and A2-feelings-heart after the first feelings lesson. Four originals each.
Time distinguishes recent ongoing circumstances from a moment-ago event.
Strength teaches physical force and 力を入れる; heart explicitly teaches its
feeling sense and phrases 心から / 心に残る. 優しい has a kind/gentle contextual
hint. Initial time drafts used later A2 降る and あまり; replaced them with
already available 雨が多い and a straightforward television negative. One exact
form approval: 見ません／みません for `jmdict:1259290` 見る. No new tracked grammar.

Six mixed six-card recalls: time after daily/continuing, sports after
matches/condition, feelings after relationships/memory. Each target has four
originals and twelve placements across three lessons. Read all twelve original
Japanese/reading/English triples, notes and hints, and all 36 recalled placements.
The final heart recall uses existing expression-v2 cards; validator caught the
v1 draft reference, so the reference was corrected without editing old content.
All new originals distinct from prior chapter originals by normalized reading.

Snapshot `.codex-a2-core-nouns-before.json` proves all 1,947 previous lessons exact:
421 A1,761 A2,765 B1. All cards, notes, versions and historical learning IDs stay
intact. Source regeneration, curated A1/A2 completion/legality/exposure/grammar,
A1 scope and pool reproduction pass. Root suite run serially due to previously
documented parallel module-loading failures: 474 tests /46 files pass. Build
passes with existing 3.351 MB raw /554 kB gzip entry-bundle warning. Default
parallel-root issue remains unresolved; no runner config change this turn.
Learner-suite result recorded below. Logs `.codex-a2-core-nouns-{pools,pools-check,
author,validation,review,root-tests,next-tests,build}.log`. Updated current
budgets in bounded-pool/course decisions, appended reviewed-placement rationale,
updated A2 editorial review and shortlist status, regenerated bilingual packets.
No paid audio generated.

Current catalog: 72 chapters /1,956 chapter lessons +five shared foundations.
A1 753/753:150 instructional +271 recalls,1,529 originals /3,961 placements.
A2 1,261/1,261:225 instructional +545 recalls,2,526 originals /7,604 placements.
B1 1,002/3,001:301 instructional +464 recalls,2,085 originals /5,897 placements.
All 3,016 assigned words pass recurrence;114 grammar introductions ordered;
426 A1 lessons pass scope. Raw shortlist gaps:42 selected /14 unselected of 56.
Editorial dispositions:42 selected,six taught variants,one reference-only,
seven pending. Remaining seven: お宅,いらっしゃる,おいでになる,市／し,都／と,FAX,君／きみ.
B1 still needs 1,999 targets;B2/C1/C2 unauthored;final full-catalog audit and optional
audio incomplete. Goal stays active. The user's single linear course direction
continues to override the older free-topic wording in the goal object.

Next useful batch: respectful visiting language (お宅,いらっしゃる,おいでになる)
with explicit whose-action/register instruction. Review the existing grammar
map and B1 language/visits chapter sequence before introducing them, and do not
silently allow auxiliary ていらっしゃる from a main-verb lesson. Source evidence:
Marugoto Pre-Intermediate index includes いらっしゃいます in visit/work contexts;
all three source senses are recorded in the shortlist review. Separate lexical
expressions are not automatically one progress identity. Also still need to
settle administrative suffix/place-name tokenization, ordinary ファックス display,
and recognition-only register guidance for 君.

Account last checked two turns ago: 46% weekly used /54% remaining,three unused
resets. Not rechecked this turn; preserve tomorrow's headroom. No live process
should be assumed after this checkpoint's final verification is recorded.

Final verification for this checkpoint: default learner suite passes 246 tests
/30 files. All tool sessions are terminal. No paid audio or resets used.


### Respectful visits: three independent B1 expressions

Selected お宅 `jmdict:1002400`, いらっしゃる `jmdict:1000940` and
おいでになる `jmdict:1001180` explicitly. Stable B1 addresses 3007–3009 append
without shifting the previous 3,006 source addresses. The bounded pool increases
by exactly three: B1 3,004, total 25,015. All 25,012 prior identities retain their
levels; none are evicted. いらっしゃる has an explicit kana display override.
The words keep separate learning identities. お宅 teaches someone else's home,
not its pronoun, organization or other senses.

The Japan Foundation's [respectful-verb teaching resource](https://www.kyozai.jpf.go.jp/kyozai/material/BMA00088/ja/render.do)
separates standalone be/come/go from auxiliary uses and explains the subject and
inside/outside distinction. This supports the lesson's usage guidance; B1 is our
editorial placement, not an official CEFR assignment of these dictionary IDs.
Earlier A2 humble forms provide a contrast: the learner visits with 伺います;
the teacher comes or is present with いらっしゃいます / おいでになります.
A1 remains byte-for-byte equivalent as parsed lesson content.

Three new instructional lessons sit within the existing visits chapter:
respectful-home and respectful-presence after meeting, respectful-arrival after
welcoming. Four later mixed recalls reuse their exact cards after celebrating,
at-the-door and account. Each word has four original sentences and twelve
placements across three lessons. Read all twelve Japanese/reading/English triples,
usage notes and hints, plus all 28 recalled placements. New originals are distinct
from preceding chapter originals by normalized reading. The teacher context
keeps the subject clear; location, destination and time support the intended
be/come/go meaning. こちら has the contextual hint “here (polite).”

Reviewed forms: いらっしゃいます, いらっしゃいませんでした,
おいでになります, おいでになりました, and 伺いました／うかがいました.
A draft used undeclared へ; the final sentences use already taught に.
One new grammar introduction, respectfulPresence, is anchored before first use.
The separate respectfulAuxiliary rule remains untaught: split Vて + respectful
verb, Nで + respectful verb, and fused auxiliary forms must not pass solely
because the main verb is known. Mutation tests cover this boundary and ensure
these constructions remain outside the reviewed A1 scope. The finite detector
supplements editorial review; it does not establish all possible honorific usage.

Snapshot `.codex-respectful-visits-before.json` proves all 1,956 prior lessons
unchanged:421 A1,770 A2,765 B1. Current B1:1,005/3,004 words,304 instructional
lessons +468 recalls,2,097 originals /5,937 placements. Shortlist dispositions:
45 selected,six taught variants,one reference-only,four pending. Pending:
市／し,都／と,ＦＡＸ,君／きみ. No paid audio generated.

Validation checkpoint: source regeneration, curated completion/legality/exposure,
grammar sequence, A1 scope, exact pool reproduction and production build pass.
Current catalog:72 chapters /1,963 chapter lessons +five shared foundations.
A1:753/753,150 instructional +271 recalls,1,529 originals /3,961 placements.
A2:1,261/1,261,225 instructional +545 recalls,2,526 originals /7,604 placements.
B1:1,005/3,004,304 instructional +468 recalls,2,097 originals /5,937 placements.
All3,019 assigned words pass recurrence;115 tracked grammar introductions;
426 A1 lessons pass scope. Remaining B1 targets:1,999;B2/C1/C2 unauthored.
Full-catalog final audit and optional audio remain incomplete. Goal stays active.
Root and learner test results will be recorded below after completion.
Build warning remains:3.354 MB raw /555 kB gzip entry bundle. Root tests run
serially because of the previously observed default-parallel module-loading
failure; its cause remains unresolved. No runner configuration changed.
Account usage was checked earlier in this turn:50% weekly used /50% remaining,
three unused resets. No paid audio or reset credits used. Preserve tomorrow's
headroom. Next batch: resolve administrative suffix/place-name prerequisites,
ordinary ファックス display, and contextually careful recognition of 君.

Final verification for respectful visits: 476 tests /46 files pass in the root
suite with --no-file-parallelism; the default learner suite passes 246 /30.
The default-parallel root issue remains an existing unresolved limitation.
All sessions are terminal. Logs: .codex-respectful-visits-{pools,pools-check,
author,validation,review,root-tests,next-tests,build}.log. No paid audio used.


### Final four shortlist dispositions: fax, civic names and familiar address

- `jmdict:1108180` ＦＡＸ: A2 technology after tools, source address 1278.
  Display ファックス／ファックス is checked against the source reading. The
  lesson explains the FAX label, machine, number and transmission uses.
- `jmdict:1308090` 市／し: A2 society after regions, address 1279. Teach the
  administrative city and its services, distinguishing 都市 and 市／いち.
- `jmdict:1621470` 都／と: A2 society after people, address 1280. The note
  establishes Tokyo as context; examples concern metropolitan public services.
  It remains separate from 都／みやこ, whose later history lesson is unchanged.
- `jmdict:1247250` 君／きみ: B1 language after variation, address 3010.
  Four reported quotations establish a close classmate's familiar usage. The
  note distinguishes きみ from the name suffix くん, warns about condescension,
  and offers a name with さん or omission of an obvious pronoun as alternatives.
  This does not license other dictionary senses or a neutral default “you.”

[Marugoto Elementary 1's vocabulary index](https://marugoto.jpf.go.jp/assets/docs/download/elementary1_c/MarugotoElementary1CompetencesVocabularyIndex_ID.pdf)
includes ファックス in topic 14. The [Tokyo government's explanation of the
metropolitan and municipal system](https://www.metro.tokyo.lg.jp/tosei/tokyoto/profile/gaiyo/shikumi/shikumi09)
establishes the administrative distinction between 都 and 市. These support
word use; the placements are editorial choices, not official level assignments.
君's familiar/register restriction comes from the local JMdict entry's first
sense, explicitly marked familiar and equal/lower-status address. The old
1952 language-policy recommendation found during research is not treated as
a present-day universal rule about pronouns or gender.

Address notes explain suffix readings, but sentence cards use independent nouns
and already learned helpers. No unintroduced proper name is silently granted as
a helper. Knowing these entries does not mark every city name as learned.

Read all sixteen new Japanese/reading/English triples, notes and hints and all
48 recalled placements. Each target has four originals and twelve placements
across three lessons, with two later mixed recalls separated by other instruction.
市 recalls follow people/elections; 都 follows government/history; fax follows
data/sound; 君 follows examples/speaking. All new originals are distinct from
preceding chapter originals by normalized reading. The only new inflection
approval is 借りた／かりた for 借りる `jmdict:1323560`, its regular plain past.
No new grammar is introduced; quoted clauses reuse the existing speech pattern.

Snapshot `.codex-shortlist-final-before.json` proves all 1,963 prior lessons
unchanged and preserves all previous A2/B1 source addresses. Exactly four
identities are added, with no eviction or level changes among the prior 25,015:
A2 becomes 1,264; B1 becomes 3,005; total 25,019. This closes the 56-entry
shortlist review at 49 selected +six taught variants +one reference-only.
It does not close the remaining B1/B2/C1/C2 authoring or final full-course audit.


Continuation classification: previous turn was verified progress (three B1
respectful-visit additions and passing verification). This turn closes four
remaining shortlist dispositions. Current catalog:72 chapters /1,975 chapter
lessons +five foundations. A1 unchanged:753/753;150 instructional +271 recalls;
1,529 originals /3,961 placements. A2:1,264/1,264;228 instructional +551 recalls;
2,538 originals /7,652 placements. B1:1,006/3,005;305 instructional +470 recalls;
2,101 originals /5,953 placements. All3,023 assigned words pass recurrence;
115 grammar introductions remain ordered;426 A1 lessons pass the scope audit.
Source regeneration, curriculum validation, exact pool reproduction and build
pass. Root/learner final test results will be appended below. Build retains the
existing large-entry warning:3.359 MB raw /555 kB gzip. No paid audio used.
B1 has1,999 unassigned identities; B2/C1/C2 authoring and final full-catalog audit
remain incomplete. Goal stays active; user's later linear-course direction
continues to supersede its original freely selectable topic wording.

Next authoring work is no longer the shortlist repair. Resume broader B1
coverage from the stable unassigned source list, grouping useful contexts before
writing cards. A fresh read found 1,999 unassigned B1 entries; early practical
gaps include 3 集荷,8 手渡し (extend Documents and post),5 やり方,
4 近づく,6 左手,7 右手,26 引き出し and40 横向き. These are candidate
groups, not approved lessons or automatically licensed helpers. Inspect their
source senses and chapter prerequisites before authoring. Continue to preserve
old lesson objects and add meaningful later recalls, not generated templates.
Root verification:476 tests /46 files pass serially. The previously observed
parallel-root loading issue remains unresolved; no runner configuration changed.
Logs use .codex-shortlist-final-{pools,pools-check,author,validation,review,
root-tests,next-tests,build}.log. Learner result follows after completion.

Final verification: learner suite passes246 tests /30 files under its default
runner. Every process session is terminal. All1,963 prior lessons preserved;
four additions and their recalls reviewed. No paid audio or reset credits used.
Account usage was last checked before the preceding respectful-visits batch at
50% weekly used; not rechecked this turn. Preserve tomorrow's headroom.


### Parcels: preparation, collection and handover

Nine previously unassigned B1 identities now belong to Documents and post:
小包1157,宛名2424,詰める1037,重量1450,集荷3,自宅1317,済ませる990,
手渡し8 and受け取り1574. Numbers are stable source addresses. Pool membership,
level budgets and all old authoring addresses stay unchanged.

Authored five instructional lessons and one connected account: parcels after
sending; packing before preparing; collection, finishing and handover before
sorting; parcel-account after sorting. The sequence reuses postal services,
known verbs and noun-modifying clauses before introducing a longer account.
A draft finishing sentence mentioned 受け取り before its lesson; changed it
to already-known 用意 before generation. No unfamiliar helper was added.

The [Japan Post parcel instructions](https://www.post.japanpost.jp/service/send/domestic/delivery/yu-pack/)
confirm the real task context: addressing an item and arranging collection from
home. These are language examples, not a claim that every service has identical
collection options or weight-based prices. Source JMdict senses were inspected
for all nine identities. Contextual hints keep 詰める to packing, 集荷 to
carrier pickup, 宛名 to recipient details, and 受け取り to receiving an item.
The last is not a payment receipt in these examples. 済ませる takes the task
with を and contrasts with earlier 済む taking が; existing てから orders tasks.

Read all34 new Japanese/reading/English triples and usage notes. Checkpoints
reuse60 exact card placements; ten recalls give every target two later revisits
with other instruction between introduction and recall. The six-card account
follows books from packing and addressing through collection and receipt.
All new originals differ from preceding chapter originals by normalized reading.
All nine targets have at least three originals and nine placements. 小包 is
naturally more frequent across the connected task (29 placements); other targets
have9–15. This is deliberate recurrence, not mechanically equal sentence counts.

Five new regular ichidan form approvals: 詰めます／つめます,
詰めました／つめました,済ませます／すませます,済ませて／すませて,
済ませました／すませました. Dictionary-form 詰める already has its lexical
identity; no productive morphology or unrelated sense is automatically granted.
No new tracked grammar. A1 and A2 lesson objects are unchanged.

Snapshot `.codex-b1-parcels-before.json` proves all1,975 prior lessons unchanged:
421 A1,779 A2,775 B1. Current B1:1,015/3,005 words;311 instructional lessons
+480 recalls;2,135 originals /6,047 placements. Remaining B1 targets:1,990.


Continuation audit: previous turn was verified progress (the last four shortlist
dispositions, authored lessons/recalls and passing checks). This turn resumes
broader B1 coverage with nine existing targets; no dictionary expansion.
Source regeneration, curriculum legality/completion/exposure, grammar ordering,
A1 scope and exact pool reproduction pass. Current catalog:72 chapters /1,991
chapter lessons +five foundations. A1:753/753,150 instructional +271 recalls,
1,529 originals /3,961 placements. A2:1,264/1,264,228 instructional +551 recalls,
2,538 originals /7,652 placements. B1:1,015/3,005,311 instructional +480 recalls,
2,135 originals /6,047 placements. All3,032 assigned words pass recurrence;
115 tracked grammar introductions;426 A1 lessons within the scope boundary.
Root tests/build launched and final results will be recorded below, followed by
the learner suite. Logs use .codex-b1-parcels-{author,validation,review,pools-check,
root-tests,next-tests,build}.log. No paid audio generated. Goal remains active:
B1 still1,990 targets short;B2/C1/C2 unauthored;final full-catalog audit incomplete.

Next coherent B1 candidate batch: household care, storage and handling. Fresh
unassigned scan:5 やり方,6 左手,7 右手,26 引き出し,40 横向き,928 ほこり,
1032 片付け,1034 汚す,1148 こぼす,1168 片付く,1757 手入れ,1892 引き出す,
2328 干す,2414 戸棚,2979 汚れ. Inspect existing household lessons and source
senses before deciding exact grouping. Household is B1's first chapter, so none
of the later B1 targets may be used as helpers there. These are candidates only.
Current allowance check:52% weekly used /48% remaining,three reset credits still
available. No reset used. Preserve tomorrow's headroom. Production build passes
with the existing large-entry warning (3.365 MB raw /556 kB gzip).

Final parcel-batch verification:476 root tests /46 files pass serially;
246 learner tests /30 files pass with the default runner. Source validation,
pool reproduction and build pass. Existing parallel-root module-loading failure
remains unresolved; no runner configuration changed. All live sessions are now
terminal. No paid audio generated. Broader goal remains active and incomplete.


### Household care, storage and handling

Sixteen existing B1 targets are now authored: やり方5,左手6,右手7,引き出し26,
横向き40,戻す552,ほこり928,片付け1032,汚す1034,こぼす1148,片付く1168,
手入れ1757,引き出す1892,干す2328,戸棚2414,汚れ2979. Numbers are stable
source addresses. No dictionary membership or level budget changes.

Five instructional lessons fit between existing household lessons, followed by
two accounts after materials. Dust/stains follows cleaning; storage follows
laundry; spills/tidying follows water; handling follows doors; care/airing follows
repairs. Ten recalls are placed after later instruction, with the final handling
and airing recalls after their connected accounts. The household chapter is
first in B1: only completed lower levels or earlier household targets may help.

Reviewed local JMdict senses for every target. Explicit contextual hints keep
引き出し to a drawer, 引き出す to physical pulling out, 手入れ to maintenance,
左手/右手 to hands rather than map directions, and 汚す to よごす / making dirty.
Notes distinguish task nouns from result verbs (片付け /片付く), and returning
an object from returning oneself (戻す /戻る). 干す is putting something out to
dry or air, rather than asserting the result 乾く. No new grammar is introduced.

The first draft used 戻す as a supposedly known helper; the resolver rejected
it. It is now a target in storage, with three examples before reuse in tidying.
The later B1 word 手前 was also unavailable; a sentence now uses 少し instead.
開きません explicitly binds to A1 開く／あく, not A2 開く／ひらく.
These fixes teach actual prerequisites rather than expanding a helper exception.

Read all53 original Japanese/reading/English triples, contextual hints and
notes. Ten recalls reuse80 placements from those reviewed originals. Each new
target has at least three originals and seven placements across later practice.
The storage and cleaning accounts reuse the actions in coherent sequences.
A final editorial pass replaced a repetitive tidy-result ending with finishing
the task and having tea with family, and made the ので translation explicitly
causal. All new originals are distinct from earlier chapter originals by reading.

Manually reviewed21 new exact forms: thirteen for 汚す,こぼす,片付く,引き出す,
干す and戻す; eight earlier-word forms (落とします,落ちません,遊んで,
開きません／あきません,持ちます,洗った,晴れた,拭きました). These approvals
cover only listed surface/reading pairs, not automatic morphology or other senses.

Snapshot `.codex-b1-household-extra-before.json` preserves all1,991 prior lessons:
421 A1,779 A2,791 B1. Current B1:1,031/3,005;318 instructional lessons +490
recalls;2,188 originals /6,180 placements. Remaining B1 targets:1,974.


Continuation classification: previous turn was verified progress (nine parcel
words, authored lessons and checks). This turn adds sixteen existing household
targets. Current catalog:72 chapters /2,008 chapter lessons +five foundations.
A1 remains753/753,150 instructional +271 recalls,1,529 originals /3,961 placements.
A2 remains1,264/1,264,228 instructional +551 recalls,2,538 originals /7,652 placements.
B1:1,031/3,005,318 instructional +490 recalls,2,188 originals /6,180 placements.
All3,048 assigned words pass recurrence;115 grammar introductions remain ordered;
426 A1 lessons pass the scope boundary. Pool reproduction passes. Build and root
suite ran before the final account copyedit; regenerate final outputs, rerun
curriculum checks/build and run the learner suite before finishing this checkpoint.
Logs use .codex-b1-household-extra-{author,validation,review,pools-check,root-tests,
next-tests,build}.log. No paid audio. Goal remains active:1,974 B1 targets and all
B2/C1/C2 authoring remain, plus final full-catalog audit and optional audio.

Final-copyedit source regeneration, full curated checks and build pass. Re-read
the two changed triples and rechecked all1,991 prior lesson objects exactly.
Root suite passed476 tests /46 files before those two copyedits; learner suite
runs against the regenerated final catalog. Existing parallel-root loading issue
remains unresolved; no runner configuration changed. Bundle warning remains
3.374 MB raw /557 kB gzip. No paid audio or reset credits used. Account allowance
last checked in the previous parcel turn:52% weekly used /48% remaining.

Next useful B1 candidate group is cooking:9 煮込み,11 魚市場,154 香り,167 皮,
1865 食器,2146 溶かす,2311 献立,2473 瓶詰め,2510 焦げる,2515 焦がす,
2671 調味料, plus1976 蒸発/2206 水蒸気 if a coherent heat/water sequence
warrants them. These remain unauthored candidates; inspect source senses and
the existing cooking chapter before assigning. Beware conflating fish skin with
leather, planned meals with restaurant menus, and burning something with it
burning by itself. Cooking follows household, so the new household helpers are
available there, but later B1 chapter vocabulary is not.

Final learner suite passes246 tests /30 files against the regenerated catalog.
All process sessions are terminal. This checkpoint is verified progress; the
full-course goal remains active and incomplete. No paid audio generated.


### Meal planning, preparation and changes caused by heat

Fifteen existing B1 targets now have instruction and later practice: 煮込み (9),
魚市場 (11), 香り (154), 皮 (167), 減る (536), むく (1054), 食器 (1865),
蒸発 (1976), 溶かす (2146), 水蒸気 (2206), 献立 (2311), 瓶詰め (2473),
焦げる (2510), 焦がす (2515), 調味料 (2671). Numbers are stable source addresses;
no pool or level-budget change. B1 cooking follows household and can now reuse
戸棚 and 戻す after their actual instruction.

Eight instructional lessons are interleaved with existing cooking lessons:
meal planning after ingredients; seasoning/aroma after plant foods; peels after
bowls; tableware/jars after tools; stew after simmering; scorching after frying;
melting after mixing; evaporation after steam. Two connected accounts follow
existing tasting: planning and serving dinner, then observations of heated water.
Sixteen later recalls reuse 102 exact placements. All fifteen targets have at
least three distinct originals and nine placements; shared ingredients naturally
reappear more frequently in the meal account.

Reviewed local JMdict senses for all fifteen identities. Contextual hints restrict
皮 to natural skin/peel (not processed leather), 瓶詰め to jarred food, and 香り
to aroma. Notes distinguish a planned meal (献立), scorching itself (焦げる),
causing the scorching (焦がす), and melting versus dissolving (溶かす). 溶ける
already has its introduction in a later weather chapter and is not silently used
here. むく and 減る were unassigned prerequisites and are now explicit targets.
A draft used B2 夕食; final cards use the completed A2 word 夕飯. The tableware
sentence uses テーブル, and the serving account uses the natural 器に盛る.

The [school textbook's water-state explanation](https://r7-kagaku.gakuto-plus.jp/2-4/1-2/2p202/)
supports distinguishing invisible gaseous 水蒸気 from visible liquid droplets
called 湯気. This is a factual word-use check, not a claim that a science textbook
assigns these words to CEFR B1. The course examples use already taught clauses,
changes, reasons and descriptions. No new tracked grammar is introduced.

Read all 56 original Japanese/reading/English triples, hints and notes before
running final tests. All new originals differ from earlier chapter originals
by normalized reading. Reviewed seventeen exact forms: fourteen forms for
むく, 焦げる, 焦がす, 溶かす and 減る, plus 加えました／くわえました,
盛りました／もりました and 熱しました／ねっしました. No general morphology
permission is inferred from a dictionary POS tag.

Snapshot `.codex-b1-cooking-extra-before.json` proves all 2,008 prior lessons
unchanged: 421 A1, 779 A2, 808 B1. Current B1: 1,046/3,005 words, 328 instructional
lessons +506 recalls, 2,244 originals /6,338 placements. Remaining B1 targets: 1,959.


Continuation classification: the previous turn was verified progress (sixteen
household words and passing final checks). This turn adds fifteen cooking words.
Current catalog: 72 chapters /2,034 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 228 instructional +551 recalls, 2,538 originals /7,652 placements.
B1: 1,046/3,005, 328 instructional +506 recalls, 2,244 originals /6,338 placements.
All 3,063 assigned words pass recurrence; 115 grammar introductions remain ordered;
426 A1 lessons pass the scope audit. Source generation, curated validation and
pool reproduction pass. Build and root suite are running; learner suite follows.
Logs use .codex-b1-cooking-extra-{author,validation,review,pools-check,root-tests,
next-tests,build}.log. No paid audio or reset used. Last allowance check was in
the parcel batch: 52% weekly used /48% remaining. Preserve tomorrow's headroom.
Goal stays active: B1 remains 1,959 targets short; B2/C1/C2 and the final full-course
audit remain incomplete. The user's single-track decision still supersedes the
older freely selectable topic wording in the goal object.

Verification so far: root suite passes 476 tests /46 files serially. Existing
parallel-root loading failure remains unresolved; no runner configuration change.
Build passes, retaining the large-entry warning (3.386 MB raw /558 kB gzip).
The learner suite runs against the final catalog; its result follows below.

Next B1 candidate sequence: travel, meeting and departure. Fresh unassigned scan
found 4 近づく, 212 滞在, 223 経由, 272 帰宅, 910 見送り, 1373 集合,
1681 名物, 1809 名所, 2226 見送る, 2248 送別. Review the existing travel
chapter before deciding placements. Teach 見送り and 見送る as distinct noun
and verb identities; use the travel sense of 見送る before other senses such as
postponing a proposal. 名所 is a notable place; 名物 a local specialty. These are
candidates, not already approved lessons. Later B1 visits/relationships words
cannot be borrowed as helpers by the earlier travel chapter.

Final verification: learner suite passes 246 tests /30 files. Source generation,
curated validation, pool reproduction, root suite (serial) and production build
all pass for this checkpoint. All process sessions are terminal. No paid audio
or reset credits used. Full goal remains active and incomplete.


### Checkpoint: travel meeting, routes, stays and farewells

Continuation classification: the previous turn was verified progress (fifteen
cooking words and passing checks). This turn adds ten existing B1 travel targets,
five instructional lessons and two connected accounts (41 originals), plus ten
later recalls (66 placements). See the B1 editorial review for all target IDs,
placements, sense distinctions and the corrected 九時 contextual reading.

Current catalog: 72 chapters /2,051 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 228 instructional +551 recalls, 2,538 originals /7,652 placements.
B1: 1,056/3,005, 335 instructional +516 recalls, 2,285 originals /6,445 placements.
All 3,073 assigned words pass recurrence; 115 grammar introductions remain ordered;
426 A1 lessons pass the scope audit. All 2,034 prior full lesson objects remain
exactly unchanged. New words have at least four originals and ten placements.

Source generation, curated validation, review export and pool reproduction pass.
Root tests run serially because the earlier parallel loading defect is unresolved;
learner tests follow. A regression test now rejects standalone きゅう before the
clock counter 時, without rejecting standalone 九 elsewhere. No pool membership
or grammar introduction change. Logs use .codex-b1-travel-extra-{author,validation,
review,pools-check,root-tests,next-tests,build}.log. No paid audio or reset used.
The last allowance check remains the parcel batch (52% weekly used /48% remaining).
Preserve tomorrow's headroom. Full goal remains active: 1,949 B1 targets plus
B2/C1/C2 and the final full-course review are unfinished. The single ordered track
supersedes the older freely selectable topic wording in the goal object.


Final travel verification: root suite passes 477 tests /46 files serially,
including the new contextual clock-reading regression. Learner suite passes
246 tests /30 files. Curated validation, pool reproduction, review export and
production build pass. The existing large-entry warning remains (3.393 MB raw /
559 kB gzip), and the earlier parallel-root loading defect is still unresolved.
All process sessions are terminal. Final allowance check: 57% weekly used /43%
remaining, three reset credits available. No paid audio or reset credits used.
This is verified progress, not completion of the six-level goal.


### Checkpoint: housing availability, surroundings and settling in

Continuation classification: the previous turn was verified progress (ten travel
words, reviewed sentences and passing checks). This turn adds fifteen existing
B1 housing identities with six instructional lessons and two connected accounts
(58 originals), plus twelve recalls (92 placements). See the B1 editorial review
for target addresses, anchors, meanings, readings and final copy edits.

Current catalog: 72 chapters /2,071 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 228 instructional +551 recalls, 2,538 originals /7,652 placements.
B1: 1,071/3,005, 343 instructional +528 recalls, 2,343 originals /6,595 placements.
All 3,088 assigned words pass recurrence; 115 grammar introductions remain ordered;
426 A1 lessons pass the scope audit. All 2,051 prior full lesson objects remain
exactly unchanged. New targets have at least four originals and ten placements;
all 58 new readings differ from each other and prior A1/A2/B1 originals.

Source generation, curated validation, review export and pool reproduction pass.
Full root tests run serially; learner tests follow. No membership or tracked
grammar changes. Logs use .codex-b1-housing-extra-{author,validation,review,
pools-check,root-tests,next-tests,build}.log. Last allowance check was at the
travel checkpoint: 57% weekly used /43% remaining, three reset credits available.
No paid audio or reset used. Preserve tomorrow's headroom. The full single-track
course goal is active and incomplete: 1,934 B1 words and all B2/C1/C2 lessons,
plus the final comprehensive audit, remain unfinished. The user’s single-track
choice still supersedes the older goal wording about freely selectable topics.


Final housing verification: root suite passes 477 tests /46 files serially;
learner suite passes 246 tests /30 files. Source generation, curated validation,
review export, pool reproduction and production build all pass. Build retains
the existing large-entry warning (3.404 MB raw /559 kB gzip). The preexisting
parallel-root loading defect remains unresolved. All process sessions are
terminal. No paid audio or reset credits used. The last allowance observation
remains the travel checkpoint (57% weekly used /43% remaining); it was not polled
again for this batch. Full goal remains active and incomplete.


Next candidate review: existing B1 education may support 895 暗記, 1331 コース,
1448 研修, 1632 満点, 1658 教養, 2701 覚え and possibly 875 器用. They were
unassigned in a fresh scan, but meanings, lesson fit and prerequisites have not
yet been reviewed. Read the current education source before choosing placements;
研修 may belong with work, and 器用 with practical skills. These are candidates,
not authored content or approved senses. Do not borrow helpers from later B1
chapters. Sports has fewer remaining obvious targets; a scan also found 793 争う
and 2633 くたびれる, which need contextual assessment before assignment.


### Checkpoint: education methods, courses, scores and practical learning

Continuation classification: previous turn was verified progress (fifteen
housing targets and all checks passing). This turn adds twenty existing B1
education identities, nine vocabulary lessons and two connected accounts
(72 originals), plus eighteen recall lessons (120 placements). See the B1
editorial review for IDs, placement, senses and reviewed forms.

Current catalog: 72 chapters /2,100 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 228 instructional +551 recalls, 2,538 originals /7,652 placements.
B1: 1,091/3,005, 354 instructional +546 recalls, 2,415 originals /6,787 placements.
All 3,108 assigned words pass recurrence; 115 grammar introductions remain ordered;
426 A1 lessons pass scope. All 2,071 previous full lesson objects are unchanged.
New targets have at least three originals and nine placements. All new readings
are distinct from one another and prior A1/A2/B1 originals.

Source generation, curated validation, review export and pool reproduction pass.
Root tests run serially; learner tests follow. There are no pool membership or
tracked-grammar changes. Logs use .codex-b1-education-extra-{author,validation,
review,pools-check,root-tests,next-tests,build}.log. Last allowance observation
is the travel checkpoint: 57% weekly used /43% remaining, three resets available.
No paid audio or resets used; preserve tomorrow’s headroom. The single-track goal
remains active and incomplete: 1,914 B1 words, all B2/C1/C2 lessons and the final
whole-course review still require work.


Final education verification: the full root suite passed 477 tests /46 files
serially before a final contextual-hint edit. That edit changes only 言葉 to
“word; expression” in the three new word-study lessons. Regenerated sources and
review packets, revalidated the course, and ran the relevant curated authoring,
grammar and lexical-variant tests (71 tests /3 files); all pass. The final learner
suite passes 246 tests /30 files and the final production build passes. All
2,071 previous full lesson objects remain unchanged after the final edit.

Pool reproduction passes. The build retains the existing entry-size warning
(3.419 MB raw /561 kB gzip); the expanded lazy education chapter is 504 kB raw /
75 kB gzip. The earlier parallel-root loading issue remains unresolved. All
process sessions are terminal. New allowance observation: 60% weekly used /40%
remaining, three reset credits available. No paid audio or reset used. This is
verified progress; the full course goal stays active and incomplete.


Next candidate review: the fresh work-related scan still leaves 1448 研修,
1528 就任, 2971 退職, 958 継ぐ and 2672 定期券 unassigned. Read the complete
work source and dictionary senses before choosing lessons. A commuter pass might
fit travel better, and taking over a role differs from inheriting property.
Public-administration candidates 1734 役所, 1992 県庁, 2048 公務 and 2191 官庁
may fit paperwork or news instead. These candidates have not yet been authored
or approved; do not force them into one lesson solely because the search matched.


### Checkpoint: workplace training, roles and succession

Continuation classification: previous turn was verified progress (twenty education
words and final checks passing). This turn adds twenty existing B1 work targets,
eight vocabulary lessons and two connected accounts (72 originals), plus sixteen
later recalls (120 placements). The B1 editorial review records target addresses,
lesson positions, semantic sources and corrected drafts.

Current catalog: 72 chapters /2,126 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 228 instructional +551 recalls, 2,538 originals /7,652 placements.
B1: 1,111/3,005, 364 instructional +562 recalls, 2,487 originals /6,979 placements.
All 3,128 assigned words pass recurrence; 115 grammar introductions remain ordered;
426 A1 lessons pass scope. All 2,100 previous full lesson objects are unchanged.
Each new target has at least three originals and nine placements. New sentence
readings are distinct from all earlier A1/A2/B1 originals and from one another.

Source generation, curated validation, review export and pool reproduction pass.
Root tests run serially; the learner suite follows. No pool or tracked-grammar
changes. Logs use .codex-b1-work-extra-{author,validation,review,pools-check,
root-tests,next-tests,build}.log. No paid audio or reset used. The last allowance
observation was after education: 60% weekly used /40% remaining, three resets
available. Preserve tomorrow’s headroom. The single-track goal remains active:
1,894 B1 targets, B2/C1/C2 lessons and final whole-course review are unfinished.


Final work verification: root suite passes 477 tests /46 files serially, learner
suite passes 246 tests /30 files, and the production build passes. Source
generation, curated validation, review export and pool reproduction pass. The
existing large-entry warning remains (3.432 MB raw /563 kB gzip); the lazy work
chapter is 582 kB raw /90 kB gzip. The earlier parallel-root loading issue remains
unresolved. All process sessions are terminal. No paid audio or reset credits
used. Last allowance check remains the education checkpoint (60% weekly used /
40% remaining); it was not polled again for this batch. The full goal remains
active and incomplete.


Next candidate review: language has unassigned 646 しゃべる, 1026 ことわざ,
1173 動詞, 1179 名詞, 1293 解説, 2002 代名詞, 2143 早口, 2456 句読点,
2560 形容詞, 2613 副詞 and 2881 参照. Read the existing language source and
dictionary senses before selecting positions. Japanese grammatical labels can
name structures already familiar to a B1 learner; introducing those labels need
not push technical terminology into A1. Some remaining writing words (1218 著す,
1623 執筆, 1922 筆者) may fit reading/publishing instead. Telephone candidates
2382 内線 and 2099 呼び出す may fit work or language, while 2131 ご無沙汰 belongs
with contact/register. These are fresh unassigned candidates, not yet approved
lessons or senses. Keep the single ordered course and actual earlier-helper rule.


### Checkpoint: A2 naming and B1 language labels

Continuation classification: previous turn was verified progress (twenty work
words and checks passing). This turn adds one A2 naming lesson with six originals
and two later recalls, plus twelve B1 language targets in seven vocabulary lessons
and two connected accounts (49 originals), with fourteen later recalls. A1 is
unchanged. The A2/B1 editorial records and A1 pacing decision document the primary
Marugoto A2 reference, exact placement, sentence review, and corrected drafts.

Current catalog: 72 chapters /2,152 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 229 instructional +553 recalls, 2,544 originals /7,670 placements.
B1: 1,123/3,005, 373 instructional +576 recalls, 2,536 originals /7,106 placements.
All 3,140 assigned words pass recurrence; 116 explicit grammar introductions are
ordered; 426 A1 lessons pass scope. All 2,126 previous full lesson objects remain
unchanged. The 55 combined new originals have distinct normalized readings from
all prior originals and each other. Each new B1 target has at least four originals
and ten placements, with two later recall sessions.

Added namedTerm for NというN, taught on the first A2 naming card and automatically
excluded by A1's allowlist. One regression test checks missing instruction, A1
exclusion and separation from reported speech /conditional と. Moved the existing
variation lesson ahead of the new labels because によって must be taught first.
Reviewed thirteen exact surface/reading variants manually; no pool changes.

Source generation, curated validation, review export and pool reproduction pass.
Root tests pass 478 tests /46 files serially. Production build passes with the
existing large-entry warning (3.444 MB raw /565 kB gzip). Logs use
.codex-language-naming-{author,validation,review,pools-check,root-tests,next-tests,
build}.log; snapshot .codex-language-naming-before.json. No paid audio or reset
credits used. Latest allowance observation remains the education checkpoint:
60% weekly used /40% remaining, three resets available. Preserve tomorrow's
headroom. The single-track goal remains active: 1,882 B1 targets, all B2/C1/C2
lessons and the final whole-course audit/audio remain unfinished.

Next candidate review: reading/publishing candidates 1218 著す, 1623 執筆 and
1922 筆者 still need individual sense and placement review. The existing reading
chapter already covers authors, literature, manuscripts, publishing and finding
sources, so choose positions based on the communication task. Telephone
candidates 2382 内線 and 2099 呼び出す may fit work or language; 2131 ご無沙汰
belongs with contact/register. These are unapproved candidates, not an instruction
to force a shared lesson. Do not expand A1 for later technical labels.


Final language/naming verification: root suite passes 478 tests /46 files;
learner suite passes 246 tests /30 files. Source generation, curated validation,
review export, pool reproduction and production build pass. The existing bundle
size warning remains. No new UI changes or fresh browser walkthrough in this
batch. All process sessions are terminal. No paid audio or reset credits used;
the full course goal remains active and incomplete.


### Checkpoint: writing, letters and office calls

Continuation classification: previous turn was verified progress (A2 naming,
twelve B1 language words, all checks passing). This turn adds ten existing B1
identities in work, post and reading. Six vocabulary lessons and four connected
accounts add fifty originals; twelve later recalls add sixty-six placements.
A1 and A2 are unchanged. The B1 editorial record documents every target address,
placement, sense choice, source and draft correction.

Current catalog: 72 chapters /2,174 chapter lessons +five shared foundations.
A1: 753/753, 150 instructional +271 recalls, 1,529 originals /3,961 placements.
A2: 1,264/1,264, 229 instructional +553 recalls, 2,544 originals /7,670 placements.
B1: 1,133/3,005, 383 instructional +588 recalls, 2,586 originals /7,222 placements.
All 3,150 assigned words pass recurrence; 116 grammar introductions remain ordered;
426 A1 lessons pass scope. All 2,152 prior full lesson objects remain identical.
Every new target has at least four distinct originals and ten placements. All
fifty new sentence readings are distinct from prior originals and one another.

Six surface/reading pairs were manually approved after checking their lemmas:
呼び出しました, 呼び出されました, 著しました, 著した, 閉じて and 閉じました.
No new grammar rules or pool changes. Source generation, curated validation,
review export, pool reproduction and production build pass. Build retains the
large-entry warning (3.453 MB raw /566 kB gzip; lazy work chapter608 kB /94 kB).
Logs use .codex-b1-reading-extra-{author,validation,review,pools-check,root-tests,
next-tests,build}.log. Snapshot .codex-b1-reading-extra-before.json. No paid audio
or reset credits used. Allowance checked this turn:63% weekly used /37% remaining,
three reset credits available. Preserve tomorrow's headroom. The full single-track
goal remains active:1,872 B1 targets, B2/C1/C2 lessons and final whole-course review
and audio remain unfinished.

Next candidate review: feelings/personal experience still has 38夢見る,55チャンス,
90勇気,92必死,93意外,95願い,122苦労,135真剣,145冗談,175微妙,178才能 and181相変わらず
unassigned. These are candidates only. Inspect dictionary senses and the current
feelings chapter, then select coherent groups and positions. Abstract words need
concrete situations; do not treat surface similarity or a frequency rank as
sufficient level or topic evidence. Keep actual earlier-helper and grammar rules.


Final writing/correspondence verification:478 root tests /46 files pass serially;
246 learner tests /30 files pass. Source generation, curated validation, review
export, pool reproduction and production build pass. The existing bundle-size
warning remains. No UI code changed and no fresh browser walkthrough was done
in this batch. All process sessions are terminal. No paid audio or reset credits
used. Last allowance check this turn:63% weekly used /37% remaining. The full goal
remains active and incomplete.


### Checkpoint: resumed work on feelings and personal experience

The preceding goal work was verified progress:ten writing/correspondence words,
all checks passing. The user then requested a pause to try the app; the goal was
marked paused. Only read-only candidate inspection and a baseline snapshot had
started at that stopping point. At the user's separate request, the browser's
learning data and settings were reset and Starter1 /0 A1 words was verified.
The user subsequently asked to continue while busy for about an hour. That
revokes the work pause; do not touch the newly reset learner profile. The goal
tool still reported paused when inspected; update_goal has no resume operation.

This resumed batch adds twelve existing B1 feelings targets in seven vocabulary
lessons and two accounts (52 originals), plus fourteen later recalls (78 placements).
The B1 editorial record gives source addresses, placement, senses, helper fixes,
manual form approvals and review evidence. A1 and A2 remain unchanged.

Current catalog:72 chapters /2,197 chapter lessons +five shared foundations.
A1:753/753,150 instructional +271 recalls,1,529 originals /3,961 placements.
A2:1,264/1,264,229 instructional +553 recalls,2,544 originals /7,670 placements.
B1:1,145/3,005,392 instructional +602 recalls,2,638 originals /7,352 placements.
All 3,162 assigned words pass recurrence;116 tracked grammar introductions are
ordered;426 A1 lessons pass scope. Every new target has at least four originals
and ten placements. All 2,174 previous full lesson objects remain identical;
all fifty-two new sentence readings are distinct from prior originals and each
other. No new grammar or pool changes. Twelve exact forms were manually reviewed.

Source generation, curated validation, review export and pool reproduction pass.
Logs use .codex-b1-feelings-extra-{author,validation,review,pools-check,root-tests,
next-tests,build}.log; snapshot .codex-b1-feelings-extra-before.json. No paid audio
or reset credits used. Last allowance check remains the writing/correspondence
batch:63% weekly used /37% remaining,three reset credits available. Preserve
headroom for tomorrow. The full course is incomplete:1,860 B1 targets, all
B2/C1/C2 lessons and final whole-course audit/audio remain unfinished.


### Checkpoint: sports sequence and competition stages

Continued directly from the feelings batch while the user was busy. Feelings
root suite478 tests passed; build, validation, export and pool checks passed.
The parallel learner run timed out once in the starter UI test;245 tests passed.
The isolated starter suite then passed all five tests. No test timeout was raised
and no test logic was relaxed. Final learner verification will run serially.

Sports adds seven existing targets in three vocabulary lessons and one account,
28 originals and six later recalls /44 placements. Details and draft corrections
are recorded in the B1 editorial review. All2,197 prior full lessons are unchanged;
new readings are distinct; each target has at least four originals and ten
placements. Five exact forms were manually reviewed. No new grammar or pool changes.

Current catalog:72 chapters /2,207 chapter lessons +five shared foundations.
A1:753/753,150 instructional +271 recalls,1,529 originals /3,961 placements.
A2:1,264/1,264,229 instructional +553 recalls,2,544 originals /7,670 placements.
B1:1,152/3,005,396 instructional +608 recalls,2,666 originals /7,424 placements.
All3,169 assigned targets pass recurrence;116 grammar introductions are ordered;
426 A1 lessons pass scope. A1/A2 and the freshly reset browser profile are unchanged.

Source generation, curated validation, review export and pool reproduction pass.
Logs use .codex-b1-sports-extra-{author,validation,review,pools-check,root-tests,
next-tests,build}.log; snapshot .codex-b1-sports-extra-before.json. The resumed
work total is19 new B1 words,80 original sentences and20 later recalls. The full
course remains incomplete:1,853 B1 words,all B2/C1/C2 lessons and final whole-course
audit/audio remain unfinished. No paid audio or reset credits used. Preserve
credit headroom; latest allowance observation remains63% weekly used /37% remaining.


Combined resume audit:all2,174 full lesson objects from before the break remain
identical. This session adds33 lessons (13 instructional/accounts +20 recalls),
19 B1 targets,80 distinct originals and202 total practice placements. Root suite
passes478 tests /46 files on the final sports catalog. Build passes with the
existing large-entry warning (3.469 MB raw /568 kB gzip). Final learner suite is
being run serially after the earlier parallel starter timeout; record its result
before ending the work checkpoint.

Next candidate review:the relationships chapter has unassigned65態度,1155わがまま,
1852謙虚 and2312謙遜. Sense and placement review is still needed. Distinguish an
attitude from an action, and modest conduct from verbal self-deprecation. Search
also surfaced805意地,981粗末 and2058くれぐれも; do not automatically group these
with personality. 意地 commonly needs idiomatic constructions, 粗末 may concern
objects or treatment, and くれぐれも belongs with a considered request. Check actual
earlier helpers before authoring, especially since feelings follows relationships.
These remain candidates only, not approved lessons or claims of CEFR placement.


Allowance after both resumed batches:67% weekly used /33% remaining; three reset
credits remain available. No reset credits or paid audio requests were used.


Final combined verification:478 root tests /46 files and246 learner tests /30
files pass on the final catalog. Both suites ran serially; the learner suite
completed in105.78s and the earlier starter timeout did not recur. No timeout
thresholds or assertions were changed. Source generation, curated validation,
review export, dictionary pool reproduction and production build pass. The
existing bundle-size warning remains (3.469 MB raw /568 kB gzip entry). No UI code
changed and no new browser walkthrough was performed. All process sessions are
terminal. Current allowance:67% weekly used /33% remaining,three reset credits
available. No paid audio or reset credits were used. The full course remains
incomplete; the user's freshly reset learner progress remains untouched.


### September 28: starter helper copy from learner feedback

The user liked practical grammar helpers but found complete translations of the
current card redundant and comments about what changes in the deck addressed
to the author. They also asked why Starter1 has nine cards. Inspected all five
starter note groups and verified that Starter1 is the nine combinations of three
subjects and three roles, with each of six words appearing three times.

Updated seven explanations across Starters1,2,3 and5. Removed full-card answers
and deck-construction commentary, retained the demonstrative distance distinction,
question-marker placement, adjective form, pronoun usage and possession/also
phrase boundaries. Kept short phrase glosses where they teach a construction.
Recorded the durable learner-facing helper rule in the A1 scope/pacing decision.
Updated foundation grammar evidence and the Starter5 authoring source so future
rebuilds preserve the reviewed wording. Starter4 notes already explain usage
without repeating a complete card translation and were retained.

Compared every starter lesson with .codex-starter-helper-copy-before.json:
all cards, IDs, versions, target/helper lists, titles, ordering and lengths remain
identical; only the seven explanations changed. No progression or browser-state
mutation. Saved sessions preserve their snapshots as before. No new content tests
were added for this copy edit. Curated validation, review export and dictionary
pool reproduction pass. Learner suite passes all 246 tests in 30 files; production
build passes with the existing bundle-size warning. Verification logs:
.codex-starter-helper-copy-{validation,review,pools,next-tests,build}.log.
The whole curriculum goal remains incomplete; this turn addresses the feedback.

### September 28: keep familiar question practice quiet

User clarified that Starter 3 should simply reuse ka without announcing it.
Removed its card-13 reminder and the generic pattern-boundary badge from the
practice player and lesson explorer. Actual instructional helpers remain.
For matching starter IDs/versions the player displays current editorial notes,
so this correction also applies to already-saved sessions without modifying
cards, cursor, practice history or completion. Other snapshots retain their
stored notes. Added a regression for an already-saved Starter 3 question card.
Validation and production build pass; final learner-suite result follows.
Final verification: 247 learner tests in 30 files pass. Production build passes after correcting a test-query TypeScript option; curated audits and dictionary pool checks pass. Logs: .codex-quiet-starter-{tests,build,validation,review}.log and .codex-pattern-cue-pools.log.

### September 28: review the purpose of starters

Read all 84 starter cards, their notes and opening chapter handoff against the
JF Standard and Marugoto Starter outline. Recorded the editorial assessment in
../reviews/2026-09-28-starter-purpose-review.md (relative to docs). They provide
initial form exposure but overuse permutation grids and underprovide situated
use and cumulative retrieval; Starter 4's grammar load is hidden by its small
vocabulary count. This review changes no curriculum or learner state. Redesign
priorities and limitations are explicit in the review.

### September 30: resume bounded B1 coverage after starter polish

Previous turn was progress: starter content/copy, version compatibility and tests
were completed. Current goal text still mentions free topic selection; the user's
later explicit single-course decision remains authoritative. Starter polish is
recorded separately in completed/2026-09-30-starter-polish.md.

Allowance before continuation: 78% weekly used, 22% remaining, four reset credits
available. No reset or paid audio used. Keep the next batch limited to preserve
headroom. Added four reviewed B1 relationship words in two vocabulary lessons
and four recalls (16 originals /48 total placements). Details and sense review
are in the B1 editorial review. All 2,207 prior chapter lessons remain identical.
Current coverage B1 1,156/3,005; A1/A2 unchanged; full course remains incomplete.


Final conduct-batch verification: all 480 full-suite tests /46 files and all
248 learner tests /30 files pass. Both suites ran sequentially. Production build,
curated audits, review export and dictionary pool reproduction pass. The existing
bundle-size warning remains. All checks are terminal. B1 now has 398 instructional
lessons +612 recalls, 2,682 originals /7,472 placements, covering 1,156/3,005 words.
The whole catalog has 72 chapters /2,213 chapter lessons plus five foundations.
No existing chapter lesson objects, A1/A2 content, starter content, or learner
progress changed in this batch. Remaining scope: 1,849 B1 words, all B2/C1/C2
lessons, and the eventual whole-course editorial/audio completion pass.
Allowance at checkpoint: 79% weekly used /21% remaining; four reset credits
available. No reset or paid audio used. Preserve headroom while continuing the
active goal; do not declare the full course complete from this batch's checks.


### September 30: visits vocabulary expansion

Previous goal turn was progress (four B1 conduct words, six lessons, all checks).
Added five more B1 targets in the visits chapter, 24 original sentences and four
later recalls (64 total placements). All 2,213 prior full chapter lesson objects
remain unchanged. No A1/A2/starter or user-profile mutations. Source, sense,
inflection and prerequisite review is recorded in the B1 editorial review.
Current B1 coverage 1,161/3,005; 1,844 remain. All B2/C1/C2 authoring and the final
whole-course content/audio review remain outstanding. Source and audits pass;
full tests/build are running under .codex-b1-visiting-extra-*.log.

Next concrete placement review: home-welcome いらっしゃい (B1 rank206) appears in
Irodori Elementary1 lesson17. Review transfer to A2 while preserving identity,
existing source addresses, saved cards and prior completions. Do not conflate it
with the existing shop greeting いらっしゃいませ or the respectful verbいらっしゃる.
See B1 editorial review for exact primary links and dictionary sense findings.


Visits expansion final verification: 480 full-suite tests /46 files and248 learner
tests /30 files pass, run sequentially. Build, source generation, vocabulary and
recurrence audits, grammar ordering, A1 scope, pool reproduction and review export
pass. Existing bundle-size warning remains. All verification sessions terminal.
B1 now has401 instructional lessons +616 recalls,2,706 originals /7,536 placements;
1,161/3,005 targets covered. No prior lesson object or learner progress changed.
Latest allowance:80% weekly used /20% remaining; four reset credits available.
No reset credits or paid audio used. Full goal remains active and incomplete.


### September 30: home-welcome placement and instruction

Previous goal turn was progress: the five-word B1 visiting batch was authored,
reviewed and verified. This continuation moves one misplaced everyday greeting
from B1 to A2 and supplies five originals and two spaced recalls. Exact identity,
sense, primary source, grammar-detector repair, compatibility audit and source
address details are in the reviewed-level-transfers decision's September 30
home-welcome entry. All 2,220 prior chapter lesson objects remain unchanged.

Current coverage: A1 753/753, A2 1,265/1,265, B1 1,161/3,004; 1,843 B1 words
and all B2/C1/C2 lesson authoring remain. Catalog: 72 chapters /2,223 lessons
plus five starters. A2:230 instructional lessons +555 recalls,2,549 originals
and7,685 placements. B1 content unchanged. Curated audits pass; test/build/pool
and review-export processes are being checked under .codex-home-welcome-* logs.
No user progress, paid audio, or reset credit changes. Initial allowance this
turn:81% weekly used /19% remaining. Continue with bounded batches and preserve
headroom; this is not completion of the full course.


Home-welcome final verification: all483 full-suite tests /46 files pass and
all248 learner tests /30 files pass. The initial run exposed two stale A2-count
expectations and an incomplete synthetic grammar-test card; these were repaired,
and the full suites rerun successfully. All processes are terminal. Build,
dictionary pool reproduction, authored-source generation, vocabulary/exposure,
grammar ordering, A1 scope and review export pass. Existing bundle-size warning
remains. No prior lesson content or learner progress changed. Credit checkpoint:
81% weekly used /19% remaining; no paid audio or reset credits used. The full
course remains active and incomplete.


### September 30: B1 social behavior coverage

Previous goal turn was progress: one reviewed A2 vocabulary transfer, five
original cards, two recalls, a precise grammar-detector fix and passing tests.
This continuation adds twelve B1 words through 52 authored originals and ten
later recall lessons. The B1 editorial review records each identity, sense,
placement, reviewed inflection and the complete before/after audit. All2,223
prior chapter lessons remain unchanged. No starter, A1, A2 or learner-state
mutations. Current B1 coverage 1,173/3,004; 1,831 words remain, followed by all
B2/C1/C2 authoring and final full-course editorial/audio review. Validation passes;
full tests/build are underway. Initial allowance 82% used /18% remaining; no
paid audio or reset credits used. Keep the full goal active and preserve credit
headroom. Next candidate for placement review: the B2 entry挨拶, not used here.


Social-behavior batch final verification: all 483 full-suite tests /46 files
and 248 learner tests /30 files pass. Suites ran sequentially; all verification
processes are terminal. Production build, pool reproduction, review export and
curated vocabulary, recurrence, grammar-order and A1-scope audits pass. Existing
bundle-size warning remains. All 2,223 prior chapter lesson objects unchanged.
B1: 1,173/3,004 words; 407 instructional lessons +626 recalls; 2,758 originals
and 7,684 placements. Full catalog: 2,239 chapter lessons plus five foundations.
Latest allowance: 83% weekly used /17% remaining; four reset credits remain
unused. No paid audio used. The full course is still incomplete and active.


### September 30: move the greeting noun to elementary study

Previous goal turn was progress: twelve reviewed B1 social-behavior targets,
52 originals and ten recalls, with all checks passing. This turn completes the
placement review of 挨拶 and transfers its everyday greeting sense from B2 to A2.
The reviewed-level-transfers decision records primary evidence, stable manifest
migration, six authored cards, two later recalls and the complete membership and
prior-lesson comparison. All 2,239 old chapter lessons remain unchanged.

A2 is now 1,266/1,266, with 231 instructional lessons +557 recalls,2,555 originals
and 7,703 placements. Whole catalog:72 chapters /2,242 chapter lessons plus five
foundations. B1 remains 1,173/3,004; B2 pool now4,999. No other pool memberships
changed. All 3,192 authored targets pass recurrence; grammar and A1 scope pass.
Full tests/build/pool reproduction/review export are underway. Starting allowance
83% weekly used /17% remaining. No paid audio or reset credits used. Full goal
remains active; 1,831 B1 words, all B2/C1/C2 authoring and the final whole-course
editorial/audio pass are still outstanding.


Next B1 candidate group found in the current unassigned list: 意志 (339),
諦める (651),決心 (864),憧れる (1845),憧れ (2977). Review their senses and
collocations before authoring a feelings-chapter extension. The newly taught
意思 in the preceding relationships chapter can support an explicit distinction
from 意志, if the examples and note make that useful. No content for this group
has been added yet. Current credit checkpoint:84% weekly used /16% remaining.


Greeting-noun final verification: all 484 full-suite tests /46 files and all
248 learner tests /30 files pass. An initial UI expectation still used B2's old
5,000-word count; it now checks the reviewed 4,999-word scope. Both full suites
were rerun successfully, and all processes are terminal. Build, pool reproduction,
source generation, vocabulary/exposure, grammar ordering, A1 scope and review
export pass. Existing bundle-size warning remains. All 2,239 old chapter lessons
and all prior source addresses are preserved. A2:1,266/1,266; B1:1,173/3,004.
The full course remains active and incomplete. Latest allowance:84% weekly used
/16% remaining; no reset credits or paid audio used.


### September 30: extend the B1 feelings chapter

Previous goal turn was progress: the elementary greeting noun transfer, six
originals, two recalls and complete verification. This turn adds five B1 words
about aspiration, determination, making up one's mind and giving up a plan.
The B1 editorial review records all identities, senses, prerequisite decisions,
exact form approvals, Japanese/reading/English review, recurrence and preservation
checks. All 2,242 prior lesson objects are unchanged. New:26 originals, six
recalls and one closing account; each target has five distinct sentences and
thirteen placements. B1 now 1,178/3,004; 1,826 words remain. All B2/C1/C2 authoring
and the final course-wide editorial/audio pass remain outstanding. Audits pass;
full tests/build/pools/review export are running. Initial weekly allowance:
84% used /16% remaining. No paid audio or reset credits used. Full goal active.


Next unassigned B1 cluster located for review: 膝216,舌230,頬1211 (ほお),爪1419,
手首1703,肘1772. These may fit the existing health/body chapter after checking
its current sequence and senses. Exclude rank1229 額／がく from this anatomical
cluster: its bounded identity is a picture frame, not 額／ひたい. No lessons or
placement changes for these candidates have been made yet.


Determination batch final verification: all 484 full-suite tests /46 files and
248 learner tests /30 files pass, run sequentially. All verification processes
are terminal. Source authoring, vocabulary/exposure, grammar ordering, A1 scope,
production build, pool reproduction and review export pass. Existing bundle-size
warning remains. All 2,242 previous full lesson objects are unchanged. B1 now
1,178/3,004, with 411 instructional lessons +632 recalls,2,784 originals /7,750
placements. Latest allowance85% weekly used /15% remaining. No reset credits or
paid audio used. The full course remains active and incomplete.


### September 30: B1 body vocabulary and movement

Previous goal turn was progress: five aspiration/determination targets with
26 reviewed originals, six recalls and full passing verification. This turn adds
seven B1 targets in four body/movement lessons and eight recalls (28 originals,
84 placements). The B1 editorial review records sense/reading checks, the limited
placement-source review, prerequisites, form approvals and all-card review.
All 2,252 previous full lesson objects remain unchanged; no level memberships or
learner progress changed. B1 now 1,185/3,004; 1,819 words remain, then all
B2/C1/C2 authoring and final whole-course editorial/audio review. Curated audits
pass; full tests/build/pools/review export are running. Initial allowance:
85% used /15% remaining. No paid audio or reset credits used. Full goal active.


Body-word batch final verification: all 484 full-suite tests /46 files and all
248 learner tests /30 files pass, run sequentially. All verification processes
are terminal. Source generation, vocabulary/exposure, grammar ordering, A1 scope,
production build, dictionary pool reproduction and review export pass. Existing
bundle-size warning remains. All 2,252 prior full chapter lessons are unchanged.
Current B1:1,185/3,004;415 instructional lessons +640 recalls;2,812 originals
and 7,834 placements. Full catalog:2,264 chapter lessons plus five foundations.
Latest allowance86% weekly used /14% remaining. No paid audio or reset credits
used. Full goal active and incomplete.


### September 30: B1 art details and sculpture

Previous goal turn was progress: seven B 1 body/movement targets with 28 originals,
eight recalls and completed verification. This turn adds eight B 1 art targets
in 38 originals and eight recalls, including a six-sentence museum account.
Sense choices, homograph identity, exact form review and all-card editorial
review are recorded in the B 1 editorial review. All 2,264 prior full lessons are
unchanged. B 1 now 1,193/3,004;1,811 remain, followed by all B 2/C 1/C 2 authoring and
final course-wide editorial/audio review. Curated audits pass; tests/build/pool
reproduction/review export are running. Initial allowance 87% used /13% remaining;
no paid audio or resets used. Full goal remains active and incomplete.


Credit-headroom interpretation communicated to the user: preserve roughly10% of
the weekly allowance for tomorrow. This is an agent planning assumption applying
the user's explicit headroom request, not a numeric limit the user supplied.
Do not spend reset credits or buy credits. Finish the current reviewed batch and
recheck actual limits before starting more substantive work near that reserve.


Art-details final verification: all 484 full-suite tests /46 files and all
248 learner tests /30 files pass, run sequentially. All verification processes
are terminal. Source authoring, vocabulary/exposure, grammar order, A1 scope,
production build, pool reproduction and review export pass. Existing bundle-size
warning remains. All 2,264 prior full lesson objects unchanged. Current B1:
1,193/3,004;420 instructional lessons +648 recalls;2,850 originals /7,936 placements.
Full catalog:2,277 chapter lessons plus five foundations. Latest allowance88%
weekly used /12% remaining; no paid audio or reset credits used. Full goal active
and incomplete. Only a small allowance remains above the communicated roughly
10% reserve; recheck before more substantive authoring.


### September 30: B1 amounts batch verified

Added five targets (合計, 大半, 多少, わずか, 余分), three vocabulary lessons,
a connected trip-expenses account, and six later recalls. The 24 original
sentences produce 64 placements; each target has five distinct sentences and
13 placements. All 2,277 prior full lesson objects are unchanged. Reviewed every
new Japanese sentence, reading, translation and helper; four lexical forms were
approved individually. Replaced an untaught draft construction with taught
grammar. No new grammar permissions or pool transfers were needed.

Verification logs now show 484 full-suite tests /46 files and 248 learner tests
/30 files passing. Build, dictionary pool reproduction, review export, vocabulary,
recurrence, grammar ordering and A1-scope audits pass. Existing bundle-size
warning remains. B1 covers 1,198/3,004 words with 424 instructional lessons,
654 recalls, 2,874 originals and 8,000 placements. Full catalog: 2,287 chapter
lessons plus five foundations. A1 and A2 coverage remains complete; 1,806 B1
words and all B2-C2 authoring remain. No paid audio or reset credits were used.
The overall course is incomplete.


### September 30: starter-to-chapter transition review

Completed the scoped helper polish and its verification; see completed plan
2026-09-30-starter-transition.md and the starter-transition editorial review.
All 421 A1 lesson card arrays/targets/versions/order remain unchanged. Names
lesson instruction now arrives in two parts, with the negative copula before
its first use. Removed the courtesy helper's redundant full-card gloss.

Foundation recurrence audit: all 18 starter targets return in later A1, but
それ and あれ each appear in only two later lessons. Many starter object and
adjective words first return in the home chapter. This is a concrete next
quality task: natural earlier practice with appropriate progress compatibility.
Do not force あなた usage solely to equalize counts. The previous goal turn
was progress; this turn also changes learner-facing content and records new
recurrence evidence. Initial allowance 89% weekly used /11% remaining. No
paid audio or reset credits used. Course remains incomplete.

Latest authoritative allowance after verification: 90% weekly used /10% remaining. This reaches the previously communicated approximate reserve for tomorrow. Do not start another substantive authoring batch without rechecking allowance and the user headroom constraint. This turn made concrete progress; no three-turn blocked audit has occurred. Goal remains active and incomplete.

Headroom audit, first reserve-limited continuation: authoritative usage remains
90% weekly used /10% remaining. The previous turn was progress (transition fixes,
verification and recurrence findings). This turn cannot start substantial work
while preserving the communicated reserve. An asynchronous preference question
asks whether to preserve it or continue into it; no answer yet. No additional
lesson authoring, paid audio or reset-credit use. This is the first consecutive
reserve-blocked turn, not a completed three-turn audit. Goal remains active.

Headroom audit, second consecutive reserve-limited continuation: fresh usage
read still reports 90% used /10% remaining. The previous turn was no progress,
not a verified wait; its status note and usage check did not advance the course.
No reply to the pending reserve preference question has arrived. The same
headroom constraint prevents a substantive authoring batch. No paid audio or
reset credits used. Goal remains active and incomplete; the three-turn blocked
threshold has not yet been met.

Headroom audit, third consecutive reserve-limited continuation: fresh usage
still reports 90% used /10% remaining. Previous turn was no progress, not a
verified wait. No reserve preference reply has arrived. The same constraint has
now persisted for three consecutive goal turns. Further substantive work needs
replenished allowance or a user decision to spend into the remaining reserve.
Marking the goal blocked, not complete or user-paused. No reset credits or paid
audio used. Next action when resumed: recheck allowance/preference, address the
recorded early foundation recurrence gaps, and continue full course authoring.


User resumed September 30: “I have a refresh.. go to exhaustion”. This explicitly removes the previous reserve constraint. Usage tool still reports 90% used, ordinary usage allowed; no reset has been invoked by the agent. Continue substantive authoring while available. Start with the documented foundation-reuse gaps, preserving all existing lesson objects and saved progress.


### September 30: personal care and clothing combinations

Added nine B1 targets: 化粧, 髪の毛, 白髪, 櫛, 剃る, かみそり, 口紅,
香水 and 組み合わせ. Four target lessons and a six-sentence getting-ready account
provide 42 originals; eight later recalls produce 114 placements. Each target
has 4–6 distinct sentences and 12–16 placements. Confirmed dictionary senses
and readings against raw JMdict entries; bounded study membership, rather than
raw reference level estimates, supplies course placement. No pool transfers.

Approved five reviewed forms: 乾かしました/かわかしました, 剃ります/そります,
剃りました/そりました, 塗りました/ぬりました and 落として/おとして.
These are regular polite or te forms of their explicit identities. Removed a
future helper 濡らす rather than widening vocabulary permission. Used contextual
glosses for removing makeup, applying lipstick/perfume and light makeup.
Revised a tautological outfit example into asking a friend for advice. Read all
42 original Japanese sentences, readings, translations and helper notes, and
checked the connected account's action order. All 2,296 previous full lesson
objects remain unchanged. New originals are distinct from prior course cards.

Curated vocabulary/exposure/grammar/A1-scope checks, 484 full-suite tests /46 files,
248 learner tests /30 files, build, pool reproduction and review export pass.
B1 now covers 1,207/3,004 words; 1,797 remain. B1: 429 instructional lessons,
662 recalls, 2,916 originals /8,114 placements. Full catalog: 2,309 chapter lessons
plus five foundations. No paid audio requests. Overall course still incomplete.


### September 30: trees, maples and animals

Eight new B1 targets (松, 杉, 大木, 竹, 紅葉/もみじ, さる, 虎, 蚊)
have 42 distinct originals, 106 placements and eight later chapter recalls.
Each target appears in 5–6 distinct sentences and 13–14 placements. All 2,309
previous complete lesson objects are unchanged. Checked the tree/maple senses
against raw JMdict: もみじ can name a maple tree; こうよう is a separate entry
for autumn leaf color. Japanese cedar is 杉. Reviewed the two added forms
歩いています/あるいています and 寝ていました/ねていました. Removed an
undeclared particle from the draft; the mosquito helper distinguishes 入る
from いる. Read all Japanese, readings, English and notes, including the park
and zoo accounts. No new grammar permissions or pool changes.

All 491 root tests /47 files, 248 learner tests /30 files, build, pool
reproduction, curated audits and review export pass. B1 after this batch:
1,215/3,004 targets; 435 instructional lessons, 670 recalls, 2,958 originals
and 8,220 placements. Evidence: .codex-b1-trees-animals-*.


### September 30: statistics, changes and predictions

Added seventeen B1 targets across seven instructional lessons and an eight-card
connected report: 統計, 率, 数, まとめる, 減少, 徐々に, 増やす, 急速, 急激,
長期, 短期, 供給, 需要, 予測, 主要, およそ and ごく. There are 76 distinct
originals and 212 placements, including sixteen later recalls. The sixteen-card
statistics lesson is split into eight-card recall sets so review stays bounded.
Each target has 5–6 distinct cards and 13–16 placements, with earlier recalls
between lessons and later recalls at the chapter accounts. Sentence reuse is
explicit review, not duplicate padding in new instruction.

Read every Japanese/phonetic-kana/English triple and helper. Found and removed
a homograph error in the draft: @表 resolved to おもて, not a statistical table
ひょう. Replaced it with the already learned ノート and checked the rest of the
course for the same English table/chart mismatch (none found). Lowering a
price and making a plan receive contextual hints instead of unrelated primary
JMdict senses. The connected report now has demand rising before supply rises.
No unlearned production vocabulary was retained. 数, まとめる and 増やす are
explicit targets rather than silently allowed helpers. 気温 and 減る resolve
to earlier B1 instruction; 計画 receives the separately documented A2 lesson.

Reviewed regular forms individually: まとめました, まとめています, まとめて,
集めた/あつめた, 明るく/あかるく, 増やしました/ふやしました,
変わっています/かわっています, 下げました/さげました and
増えます/ふえます. No grammar permissions were added.

Together with the A2 plan lesson, all 2,323 existing full lesson objects are
unchanged; 82 new originals are distinct from prior cards and one another.
A2 is complete at 1,267/1,267. B1 is 1,232/3,004, with 443 instructional lessons,
686 recalls, 3,034 originals and 8,432 placements. Curated vocabulary, exposure,
grammar ordering (116 introductions) and A1 scope audits pass. Full root/learner
tests, build and pool reproduction are in progress under .codex-b1-statistics-*.
The course remains incomplete; advanced levels have not yet been authored.


### September 30: viewpoints, priorities and acknowledgment

Six targets (視点, 考慮, 重視, 強調, 認める, 区別), 44 distinct originals,
116 placements and six twelve-card recalls. Instruction follows existing
agreement/response vocabulary and ends with a connected travel-plan correction.
Reviewed all Japanese, readings, translations and notes against raw JMdict senses.
認める includes acknowledging effort and admitting a mistake; it is not flattened
into a single English gloss. 区別 distinguishes facts/opinions and similar sounds.
Removed the future B2 helper 社員 and used 働く人. 費用 uses its earlier B1
housing address. The にくい form was introduced in A2-shopping-ease.
Approved five forms individually: 認めました/みとめました, 認めて/みとめて,
認めています/みとめています, 似た/にた, しにくい/しにくい.
All 2,350 previous full lesson objects remain unchanged; new originals have no
exact reading duplicates against earlier cards or one another.

Statistics/planning and this final batch pass all 492 root tests /47 files and
248 learner tests /30 files, build, pool reproduction, curated vocabulary,
exposure, grammar ordering and A1 scope audits, plus review export. The B1
full-course test deliberately walks more than 2,300 lessons; its 20-second limit
was exceeded at 23.86 seconds even in isolation. Raised only that exhaustive
test to 60 seconds and retained all checks. Fixed stale A2 word-count assertions.
Current scope: A1 753/753; A2 1,267/1,267; B1 1,238/3,004; advanced levels
unauthored. The full goal remains incomplete.


### September 30: user-requested pause for testing

The user reported repeated sentence playback, then explicitly asked to finish
that fix and stop for the night. No further curriculum expansion is authorized
until resumed. Preserve this checkpoint for their testing.

Root cause confirmed in the live localhost:4389 browser: every paid recording
writes audio.json, which propagated through React Fast Refresh, restarted lesson
autoplay and accumulated unavailable-audio notices. packages/dictionary/audio.ts
now accepts catalog hot updates at its own boundary and refreshes the lookup map
without refreshing the player. After one reload, the browser showed successive
catalog-only updates while the same card remained idle with no warning pile-up.
No learner progress was reset. Audio tests (18) and final app build pass; the
full 492/248 suites above also pass. Existing large bundle warning remains.

Stopped paid generation session 37128 /PID13048 at the user's request after
1,991 completed new requests. The process is confirmed terminated; its stale
writer lock was removed only after verifying that exact PID was dead. All 2,920
complete catalog pronunciations have nonempty files. One in-flight request,
7b4e21105a9e1e676ccbdc94 (つよかった), has no local asset and is marked
needs-reconciliation in audio_requests.json. No repeat request was sent.
ElevenLabs history lookup returned 401 missing_permissions: speech_history_read.
Recover/check that one request using provider history before any retry. The
journal is intact and deliberately blocks accidental duplicate payment.

Next work, only after the user resumes: respond to their starter/course feedback;
reconcile the interrupted audio result; dry-run missing recordings with fresh
caps; consider a compact audio runtime manifest to reduce bundle weight. Do not
continue filling B1/B2/C1/C2 before that feedback. The wider goal is paused,
not complete. No overnight automation or background authoring was started.
