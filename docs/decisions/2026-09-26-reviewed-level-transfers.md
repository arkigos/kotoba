# Reviewed vocabulary transfers

## Placement takes precedence over round budgets

The bounded functional dictionary currently contains 25,009 identities. Level
counts are editorial budgets, not linguistic standards. When review finds a
misplaced word, adjust the affected budgets rather than move unrelated words
across a boundary to preserve the original round numbers. Inspect the complete
membership diff after rebuilding; a small policy change can otherwise cause a
ranking or katakana-quota cascade.

This follows the existing [bounded-pool decision](2026-09-21-bounded-level-pools.md).
The [JF Standard](https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do) describes
communicative competence rather than certifying a Japanese word inventory.
[Marugoto Intermediate 1](https://marugoto.jpf.go.jp/en/assets/docs/about/intermediate1_contents_en.pdf)
includes discussing travel arrangements and accommodation. The placements below
support those tasks; they do not claim that a word belongs exclusively to B1
or cannot be introduced earlier in another course.

## September 26: overnight stays

| Identity | Word | Transfer | Reason |
|---|---|---|---|
| jmdict:1165960 | 一晩 / ひとばん | C2 → B1 | Ordinary duration for staying somewhere or spending a night. It had no imported learning-order anchor and a low frequency score, neither of which establishes advanced difficulty. |
| jmdict:1143870 | ルームメイト | C2 → B1 | Ordinary shared-accommodation relationship, useful alongside arranging a stay and describing who shares a room. |

That review changed budgets to B1 3,002 and C2 7,998, leaving the other levels unchanged.
The rebuild comparison showed exactly these two transfers, no additions or
removals from the dictionary, and no other level-membership changes. Both
entries have explicit B1 priorities and floors in the policy so regeneration
does not silently undo the decision.

## Teaching and compatibility

Both words are taught in `B1-travel-overnight`, immediately after the existing
day-trip/overnight-accommodation lesson, alongside 宿, 泊める and 過ごす. Ten
authored cards distinguish a guest staying from someone hosting a guest, and
use 一晩 as a duration without に. Two saved ten-card recall checkpoints repeat
the exact cards with other travel checkpoints between them.

Existing word IDs, B1 authoring addresses and C2 authoring addresses remain
unchanged. Append the promoted identities at B1 source addresses 3005 and 3006.
The old C2 addresses remain reserved and reject use as C2 targets; resolving
the same identity as learned lower-level vocabulary remains valid. The B1
identity-manifest hash is deliberately updated after that append.

Before/after comparison preserved all 388 existing B1 lessons' versions and
exact card content. The new lesson and recall checkpoints are additional course
requirements; existing completed lessons retain their replay behavior.

## September 26: elementary distance

Move `jmdict:1042650` キロメートル from C1 to A2. メートル is already taught
in A2 measurements, and route descriptions should be able to combine familiar
numbers with both units. This is an editorial choice about useful elementary
communication, not a claim that CEFR mandates a particular vocabulary list.
The new `A2-quantity-distance` lesson follows measuring, explains 1 km = 1,000 m,
and gives four distance examples. Two later checkpoints reuse them alongside
the earlier meter examples.

A2 now contains 1,251 entries and C1 6,999. The rebuild membership comparison
showed exactly this one transfer; no other level assignments or dictionary
identities changed. Append the A2 source address at 1267 and preserve the old
C1 address in a new manifest matching the original C1 identity hash. Its old
target address is reserved and rejects use as a C1 target. The dictionary total
is still 25,000, and the original A1 selection is untouched.

In the same review, introduce なければなりません in A2 work after roles and
responsibilities, rather than waiting for the B1 driving chapter. This pattern
appears in [Irodori Elementary 1, lesson 14](https://www.irodori-online.jpf.go.jp/a2-1/learning/14-050-09-01/).
The [Japan Foundation's explanation of obligation](https://www.jpf.go.jp/j/project/japanese/teach/tsushin/grammar/201509.html)
also supports its positive-obligation meaning. Six authored examples use
already-taught vocabulary and different verb groups; two later recalls reuse
them. No new target words or A1 constructions are introduced by this grammar
lesson. Six exact spelling/reading pairs were independently reviewed.

Comparison before and after these additions preserved all 1,113 existing A2/B1
lesson versions and exact card content. New lessons and recalls add course
requirements; existing completed lessons remain replayable.


## September 26: restore the elementary musical verb

Add `jmdict:1419370` 弾く / ひく (play a stringed or keyboard instrument) to A1.
The reference dictionary contained the identity but the functional pool omitted
it. This is distinct from `jmdict:1169250` 引く / ひく (pull) and
`jmdict:1419360` はじく (flick or pluck). Neither can supply the missing identity
or its audio. [Marugoto Starter A1's wordbook](https://www.marugoto.org/assets/docs/download/starter_a/MarugotoStarterWordbook_EN.pdf),
printed page 48, includes the musical playing verb alongside guitar and piano.

Remove only `jmdict:1036170` カー from the functional pool, retaining it in the
reference dictionary and reserving its old B1 authoring address 252 as reference.
The ordinary word 車 is already in A1; standalone カー does not warrant the
functional slot ahead of the missing basic verb. The total remains 25,000.
Budgets are now A1 751 and B1 3,001; other budgets are unchanged. A complete
before/after comparison proves exactly one addition and one removal, with no
other level moves. No existing learning ID is repurposed.

Append the A1 source address 751 and update its identity-order guard to
`3bf4222db9885f2639c08999d7271ace96fe7c883eb7487b099e2b527d340d51`.
All preceding 750 addresses are identical. B1's manifest sequence and guard stay
unchanged, with the retired entry retained explicitly. The new A1 lesson uses
four frozen examples and two explicitly placed four-card recalls, mixing playing
with earlier listening/concert cards. Only 弾きます / ひきます and
弾きません / ひきません are added to the reviewed lexical form inventory.

All 1,649 preexisting chapter lessons across A1, A2 and B1 preserve their cards,
notes and versions. Existing replay and word history remain intact; the new
lesson and recalls are additional course requirements. Dictionary reproduction,
full curated validation, all 449 tests in 45 files, and the production build pass.
No paid audio generated.


## September 26: common readings missing from the browse shortlist

Add 先（さき）`jmdict:1387210` and 石（いし）`jmdict:1382440` to A2.
The capped browse index omitted both identities, even though the full reference
store contains them. Use explicit priorities and floors rather than reranking
all reference entries. The [shortlist review](../reviews/2026-09-26-curated-course/dictionary-shortlist-review.md)
records source evidence, teaching scope and the remaining unresolved candidates.

The [bounded-pool decision](2026-09-21-bounded-level-pools.md) now permits
explicit reviewed additions beyond the original round total. A2 becomes 1,253
and the functional dictionary 25,002. The complete membership comparison shows
exactly these two additions, no removals and no other level changes. A1 remains
751. Preserve every existing authoring address; append 先 at A2 1268 and 石 at
1269. The new A2 identity-order hash is
`0c818916593e42705b3c2bb4f5f5bab1a622a4c78fab7eadb0bd51a2477e76bd`.

Teach 先 after roads in A2 travel and 石 after lakes/rivers in A2 nature. Each
has four reviewed originals and two later recalls with familiar chapter cards.
All 1,897 existing chapter lessons retain their exact cards, notes and versions.
New lessons remain required for completion; historical completed lessons and
frozen sessions are preserved. No additional grammar or paid audio is introduced.

The pool builder also emits `source-shortlist-gaps.json` under the level-pool
review directory, including current selection status. Regeneration checks cover
this diagnostic. The dictionary screen reads its displayed size from the loaded
study index rather than carrying a hard-coded total.


## September 26: a day’s duration and zero

Add 一日（いちにち）`jmdict:1576260` and ゼロ `jmdict:2839962` to A1.
[Marugoto Starter A1’s wordbook](https://www.marugoto.org/assets/docs/download/starter_a/MarugotoStarterWordbook_EN.pdf),
printed page 79, explicitly includes いちにち as one day. Teach it after the
irregular calendar dates, with a direct distinction from １日（ついたち）
`jmdict:2225040`. Four short cards use days off and being at home all day. The
note explains the duration’s position without に and the noun phrase 一日の休み.

ゼロ is an editorial addition for a basic numerical communication task. Teach it
after the phone lesson through two short exchanges confirming or correcting
number fragments. State that these are parts of phone numbers, not complete
numbers. Explain 四／よん, 七／なな and 九／きゅう for individual digits;
explicitly review the first two spelling/reading pairs. The existing 零／れい
`jmdict:1557630` stays A2, with a distinct identity. No level standard is claimed
to mandate these exact lexical placements.

A1 becomes 753; the total becomes 25,004. Exactly these two identities are added,
with no removals or other level changes. All 751 previous A1 addresses are an
identical prefix; append 一日 at 752 and ゼロ at 753. Updated A1 hash:
`c31656bad01c7201f1a0212a7ae915ad79f9fbe84e6961fe4df65fe11422f624`.
All 1,903 existing chapter lessons retain exact content and versions, proven by
`.codex-a1-day-zero-before.json`. Each new lesson has four originals and two
later six-card recalls. The recalls retain the number exchanges in order and
mix duration cards with familiar calendar/plan cards. No paid audio.


## September 26: stopping, uncrowded transport and opening books

Add three distinct reference identities to A2: 止める（とめる）`jmdict:1310670`,
空く（すく）`jmdict:1586265`, and 開く（ひらく）`jmdict:1202440`.
These are editorial placements in concrete elementary travel and study tasks,
not an automatic conversion from their community N4 anchors. The existing
A1 止まる and 開く（あく）remain separately bound. Irodori Elementary 2's
[travel wordlist](https://www.irodori.jpf.go.jp/assets/data/wordlist_Z.pdf) teaches
crowded travel descriptions; the new 空く lesson supplies the contrasting state.
The dictionary senses support the authored uses; no official word-level CEFR
assignment is claimed.

Teach 止める and 空く after A2 travel roads, with requests, parking and crowd
states. Teach 開く after study materials, with opening books, a dictionary,
notebook and textbook. Eight explicit spelling/reading pairs were reviewed.
The lessons contain thirteen originals, including the known 止まる example that
contrasts が with を. Six later six-card recalls mix familiar chapter material.
Each target has four originals and twelve card placements across three lessons.

A2 becomes 1,256 and the total 25,007. Exact membership comparison: three
additions, no removals, no other level changes. All old A2 addresses remain an
identical prefix; append 1270 止める, 1271 空く, 1272 開く／ひらく. A2 hash:
`5b14365023a4b110f7a0131b35c8046ad62b1a41b955d0fa3bc87ed18853427b`.

This repair exposed two preexisting B1 reading cards with ひらきました incorrectly
bound to the あく identity. Correct them to `jmdict:1202440`; their written
Japanese, readings and translations stay the same. Bump `B1-reading-finding`
and `B1-reading-account` to version 2 and update `B1-reading-revisit-05` and
`B1-reading-revisit-08` to version 2 with new source references. Remove the
incorrect ひらきました permission from the あく reviewed-form inventory. A focused
regression checks the binding and prevents bare ambiguous `@開く` resolution.
Use A1:578 explicitly for the existing B1 theatre/news あく examples.

Snapshot `.codex-a2-basic-verbs-before.json` proves that all 1,905 other existing
chapter lessons are unchanged. Only these four B1 lessons are revised; all A1
and all previous A2 content is identical. Existing frozen sessions/history keep
their old card identities, while new instruction and recalls use version 2.


## September 26: polite reference and conversation transitions

Add 方（かた）`jmdict:1516925` and それでは `jmdict:1406050` to A2. The
[Irodori Elementary 1 wordlist](https://www.irodori.jpf.go.jp/assets/data/wordlist_Y.pdf)
includes polite ～の方 in lesson 15 (L15-2) and それでは in lesson 18 (L18-2).
This supports elementary placement without equating their community N5 anchors
with CEFR A1. A1 already teaches じゃあ; keep the more formal transition in A2.
Use the ordinary kana display それでは, rather than the reference headword 其れでは.

Teach polite-person 方 after A2 family, before children: four examples refer to
other people with familiar introductions. The note distinguishes かた from 方／ほう
and explains respectful reference rather than self-reference. Teach それでは after
asking in conversation/politeness: four examples move into a plan or a goodbye.
Its note explains the response to an agreement and relationship to known じゃあ.
Both receive two later mixed six-card recalls. No new lexical forms or grammar
rules are required; A1 scope and content stay unchanged.

A2 becomes 1,258, total 25,009. Membership comparison proves exactly two additions,
no removals and no other level changes. Append 1273 方／かた and 1274 それでは after
the unchanged first 1,272 A2 source addresses. New A2 hash:
`47fd9cb5c42d5ad1484a3a7842a9585e8f1d207078cd4642a5e68b873248c847`.
The one B1 sports use of bare `@方` now explicitly addresses A2:1264, preserving
its ほう reading and exact compiled content. Bare lower-level `@方` is correctly
ambiguous once both readings exist; regression checks require explicit identity.
No existing 方／ほう token had an incorrectly assigned かた reading in the audit.

Snapshot `.codex-a2-politeness-before.json` proves all 1,918 preexisting chapter
lessons remain identical in cards, notes and versions. No history IDs are reused.
Each new target has four originals and twelve card placements across three
lessons. All new triples, hints, notes and recall choices were read. No paid audio.


### Common standalone words: recent life, strength and feelings

Restore three independent identities omitted by the 50,000-entry source shortlist:
この頃 `jmdict:1004710`, 力 `jmdict:1554820`, 心 `jmdict:1360480`. Source
senses respectively name a recent period, strength/force, and heart/mind/spirit.
The source inventory review, with NINJAL usage evidence for the temporal and
feeling senses, is in dictionary-shortlist-review.md. A2 placement is editorial,
using familiar everyday descriptions; community N5/N4 anchors are not a CEFR map.

Teach この頃 after A2-time-recent, 力 after sports-activities, and 心 after the
first feelings lesson. Each has four originals and two later mixed six-card
recalls, with twelve target placements across three lessons. New helper use
must follow the linear course: revised time drafts to avoid later A2 降る and
あまり. Explicitly approved 見ません／みません for existing 見る. The 心 lesson
explains 心から and 心に残る, and gives 優しい its kind/gentle contextual hint.
No new tracked grammar rules or changes to A1.

A2 grows from 1,258 to 1,261, total from 25,009 to 25,012. Exactly three additions;
no removals or other level moves. All 1,274 previous A2 authoring addresses stay
an unchanged prefix. Append 1275 この頃,1276 力,1277 心. New A2 source hash:
`9251f4aa09839fc485f87a791996e81a5b516f7e4e47d8af47eb4a94c48cd34f`.
Snapshot `.codex-a2-core-nouns-before.json` proves all 1,947 prior lessons exact,
including every card, note and version. The final 心 recall refers to existing
expression-v2 cards; no historical card is edited or given a recycled identity.


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


## September 30: greeting a guest at home

Move `jmdict:1000920` いらっしゃい from B1 to A2. The second JMdict sense
is the greeting “welcome”; the first polite-imperative come/go/stay sense does
not describe these cards. The pool gloss now says “welcome (greeting a guest).”
[Irodori Elementary 1 lesson 17](https://www.irodori.jpf.go.jp/assets/data/elementary01/pdf/Y_L17.pdf),
page L17-2, uses the greeting when a guest arrives at a home. This supports the
A2 placement; it is not an official assignment of every sense to one level.

Append A2 source address 1281, preserving all 1,280 previous addresses. Keep B1
address 206 reserved; it resolves to A2 and cannot be authored as a B1 target.
A2 identity hash: `3167d2c7fdfb8610e306bbf1cbb486bebceafaa33f3ea22aaa8e5fac001608e5`.
Budgets become A2 1,265 and B1 3,004. The rebuilt membership comparison changes
exactly this identity's level, with no additions, removals or other transfers.
The total remains 25,019.

`A2-conversation-home-welcome` follows polite requests. Five distinct cards
welcome a guest, invite them inside or to sit, offer tea, indicate where to put
bags, and ask about the cold outside. All helpers and constructions precede this
lesson. Two five-card recalls follow respectful verbs and apologies, separated
by other lessons. All five originals have been read in Japanese, kana and English;
none duplicates a preceding original. The note explains the home greeting and
contrasts shop staff's いらっしゃいませ without presenting a full-card translation.

Manually approved 入ってください／はいってください (入る, godan te-form plus
request) and 置いてください／おいてください (置く, godan te-form plus request).
The grammar detector now exempts only the exact greeting identity and surface
at the beginning of a card, followed by punctuation or card end. It still
requires instruction for the respectful verb and auxiliary constructions;
mutation tests cover missing identity, verb identity, changed surface and a
preceding で. No new grammar construction is taught by this lexical greeting.

Snapshot `.codex-home-welcome-before.json` confirms all 2,220 prior complete
chapter lesson objects are unchanged. A1 and starter content and learner state
are untouched. This transfer and lesson complete A2's expanded 1,265-word pool;
B1 remains 1,161/3,004. Higher-level authoring and the final whole-course review
remain incomplete.


## September 30: the everyday greeting noun

Move `jmdict:1151120` 挨拶／あいさつ from B2 to A2. The canonical entry's
first sense names a greeting when meeting or parting. The other senses include
formal speeches, courtesy visits and historical or figurative uses; these cards
teach only the everyday greeting sense.

[Marugoto Elementary 1 (A2) Rikai's vocabulary index](https://marugoto.jpf.go.jp/assets/docs/download/elementary1_c/MarugotoElementary1CompetencesVocabularyIndex_EN.pdf),
page 1, lists あいさつ /greetings in lesson 13. This is direct elementary-course
evidence supporting the placement, not an official requirement for every sense
or for unaided recognition of the kanji spelling. The app retains its normal
reading support and the lesson note explicitly supplies あいさつ.

Append A2 source address 1282, preserving the complete previous 1,281-address
prefix. New A2 identity hash:
`e02c84f1653e37fd8b4380f9917b71e261faa08fbaa0f1a796ddf3a99cb03bbb`.
Save the original 5,000 B2 addresses in b2-authoring-ids.json before rebuilding;
they match the pre-existing pinned B2 hash. Address 2403 remains reserved and
rejects use as a B2 target. A B2 author can resolve the same dictionary identity
as learned A2 vocabulary. A regression test exercises both paths.

Budgets become A2 1,266 and B2 4,999. The complete membership comparison shows
exactly this one transfer, with no identity additions, removals or other level
changes. The dictionary remains 25,019 entries. Source regeneration preserves
all previous cards, versions, targets, notes and completion identities.

`A2-conversation-greetings` follows polite requests and precedes home-welcome.
Six distinct originals use greetings with neighbors, first meetings, a teacher,
morning practice, entering a room and leaving home. The plain language helper
explains 挨拶する and 人に; all grammatical patterns are already introduced.
毎朝,近所 and 出かける are earlier A2 targets, referenced by their stable source
addresses rather than silently treated as A1 helpers. Two six-card recalls
follow asking and gifts, with other chapter lessons between encounters.

Read all six Japanese/phonetic-kana/English triples and the usage note. The
parting example is translated naturally as saying goodbye before going out.
Every original is distinct from all previous chapter cards. No lexical-form
approvals or new grammatical permissions were required. The greeting has six
distinct sentences and eighteen placements across three lessons.

Snapshot .codex-greeting-noun-before.json proves all 2,239 prior complete chapter
lesson objects and every prior A2/B2 source address unchanged. A1, B1 and starter
content and learner state are untouched. The expanded A2 is fully authored at
1,266/1,266; B1 remains 1,173/3,004. Full tests/build/pool reproduction and review
export are running under .codex-greeting-noun-* logs after passing curated audits.


Greeting-noun final verification: all 484 full-suite tests /46 files and all
248 learner tests /30 files pass. An initial UI expectation still used B2's old
5,000-word count; it now checks the reviewed 4,999-word scope. Both full suites
were rerun successfully, and all processes are terminal. Build, pool reproduction,
source generation, vocabulary/exposure, grammar ordering, A1 scope and review
export pass. Existing bundle-size warning remains. All 2,239 old chapter lessons
and all prior source addresses are preserved. A2:1,266/1,266; B1:1,173/3,004.
The full course remains active and incomplete. Latest allowance:84% weekly used
/16% remaining; no reset credits or paid audio used.


### September 30: 計画 belongs before B1 statistics

Transferred only 計画/けいかく (jmdict:1252090) from B2 to A2. The official
[Marugoto Elementary 2 A2 vocabulary index](https://marugoto.jpf.go.jp/assets/docs/download/elementary2_c/MarugotoElementary2CompetencesVocabularyIndex_ES.pdf)
lists けいかく in lesson 13 (PDF page 8), and the official
[Elementary 1 A2 picnic activity](https://a2.marugotoweb.jp/ja/challenge_drama/detail/topic6.html)
uses 計画を立てて. This supports an editorial A2 placement; it is not a claim
that CEFR certifies individual word lists.

The entire pool comparison contains exactly one membership change, B2 → A2,
with the same 25,019 identities. Budgets: A2 1,267, B2 4,998. Appended A2 source
address 1283; every earlier source address remains unchanged. B2 address 2207
stays reserved and rejects target authoring; the identity resolves as a lower
A2 helper. Added a regression covering both sides of that migration.

A2-work-making-plans follows meetings, after all helpers including 立てる,
変える, ノート, 上司 and 相談. Six distinct sentences teach 計画を立てる and
計画する, with two later six-card recalls after roles and design. The note
contrasts a plan with 予定, and the contextual hint for 立てる is make/draw up
a plan. Reviewed 計画しています/けいかくしています and
立てています/たてています. This word can subsequently support B1 long- and
short-term plans without leaking a B2 helper.
