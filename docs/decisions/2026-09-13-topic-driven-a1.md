# A1 through overlapping topics and a bounded core

Status: accepted and implemented for the Next learner. Existing frozen unit and
learning-word IDs remain valid.

## The scope

`data/jp/dictionary/a1_scope.json` owns version `a1-core-2026-09-13`: **450 core
words and expressions**, selected from the existing 578 authored A1 teaching
items. This is Kotoba's manageable foundation, not a claim that an official CEFR
vocabulary list contains 450 words. The denominator includes useful expressions
and counts explicitly reviewed forms of the same teaching concept once.

The inventory audit found:

- 578 authored A1 learning IDs, excluding function/grammar entries and Kana.
- 66 redundant form or label identities across the full inventory: for example,
  `iku` / `ikimasu`, `asagohan` / `asa-gohan`, and birthday label variants.
- 512 teaching concepts after those reviewed equivalences, of which 450 are core
  and 62 remain optional. There are 511 core-associated learning IDs, because 61
  alternate forms belong to core concepts.
- All 450 core representatives already occur in the 4,236 existing A1 sentence
  cards, and all 450 have an exact base-pronunciation recording in the dictionary
  registry. This change adds no recordings or paid requests.

Optional material includes specific cities and landmarks, entertainment genres,
and specialist cultural or souvenir vocabulary. These are still A1 *course
placement* items; optional does not mean harder or less valuable to a particular
learner. They remain searchable and can be prioritized. A learner can choose
their own countries, interests, and work vocabulary without changing the core
completion denominator.

There is enough existing vocabulary for this bounded A1 foundation. Adding more
preset units would not solve the more important remaining issue: demonstrating
communicative ability across language skills. Counting exposures alone cannot
establish that ability.

## Standards and milestones

The [Council of Europe's CEFR self-assessment grid](https://www.coe.int/en/web/common-european-framework-reference-languages/table-2-cefr-3.3-common-reference-levels-self-assessment-grid)
separates listening, reading, interaction, spoken production, and writing. A1
involves familiar personal and everyday situations with considerable support,
such as slower speech and repetition. Kotoba's vocabulary total does not replace
those performance dimensions.

The [Japan Foundation's CEFR Can-do list](https://www.jfstandard.jpf.go.jp/pdf/CEFR_Cando_Level_list.pdf)
describes A1 vocabulary qualitatively: concrete needs and situations. It does
not establish a numerical Japanese vocabulary threshold. CEFR, JLPT level, and
JMdict common-word markers must not be treated as interchangeable placements.

The [Marugoto Starter A1 Can-do Check](https://marugoto.jpf.go.jp/assets/docs/download/starter_a/MarugotoStarterActivitiesCan-doCheck_EN.pdf)
provides the Japanese scenario reference. Kotoba groups related goals into nine
scenario checks: introductions, classroom help, family, food, home, scheduling,
outings, local travel, and shopping. A tenth check addresses short written
messages and personal information under the CEFR grid. The JSON links each check
to its source and, for Marugoto, the relevant numbered Can-dos. The short task
prompts are Kotoba adaptations rather than reproductions of the workbook.

Each milestone also names related existing `practiceUnitIds`. Those sentence
lessons prepare the language for a task; completing a lesson does **not** mark a
milestone achieved. A learner should attempt the stated task, using a partner
or a realistic role-play where appropriate, and then record their self-check.
Slower speech, repetition, and simple language are compatible with A1. The
current app does not independently score live conversation, writing, or sustained
listening. It therefore labels these outcomes as self-assessment and never issues
an official proficiency or certification claim.

The [Marugoto teacher overview](https://marugoto.jpf.go.jp/en/teacher/feature/)
also distinguishes communicative activities from the vocabulary, script, and
grammar competences that support them. This is why a large word counter alone
cannot become an A1 certificate.

Sources reviewed September 13, 2026. Existing vocabulary provenance remains in
`teaching_words.json`, the dictionary source records, and the Marugoto Starter
index extract under `data/jp/curriculum/source/`.

## Topics and shared credit

Twelve authored topics cover first conversations, family, food, home, routine,
school, work, travel, shopping, leisure, culture, and everyday objects. All 578 A1
items have at least one explicit topic. Topic tags express the intended practice
situations and are not a grammatical-generation permission.

Words can belong to several topics. For example, `hon` belongs to home, school,
leisure, and everyday objects; `namae` belongs to family, school, work, and first
conversations. Topic denominators are the **intersection of that topic with the
450 core representatives**, not independent lessons or copies of history.
Adding a topic may therefore reveal existing progress immediately. Summing topic
totals overcounts the shared scope and must never determine level completion.

`coreWordId` is a progress link only. It never rewrites learning IDs, dictionary
bindings, realized tokens, pronunciation keys, or saved snapshots. The complete
core denominator is the explicit `coreWordIds` array. The shared TypeScript API
is `packages/dictionary/a1.ts`.

For this version, introduced means actual word practice. Learned is a conservative
practice-progress label requiring at least three spaced practice occasions, with
the existing scheduler's 24-hour interval and distinct-session requirement.
Existing profiles seed shared progress from the maximum occasion count across
equivalent learning IDs, since legacy aggregates cannot identify distinct dates.
The additive `a1CoreHistory` ledger then combines future practice across forms:
two occasions for `iku` plus a third-day `ikimasu` occasion count as three. The
ledger uses shared 24-hour and session boundaries so same-day aliases count once.
Saving, prioritizing,
previewing, or simply opening a word provides no learning credit.

Completing all core vocabulary **and** all practical self-checks marks the
**Kotoba A1 foundation** complete. The vocabulary counter remains independently
visible so learners can finish their word goal without implying assessed mastery.
Changing future core membership requires a new reviewed scope version; optional
dictionary expansion must not silently move a learner's completion target.

## Authoring and verification

The scope is additive to `teaching_words.json`: no word forms, placements,
introducing units, existing snapshots, or audio bindings were altered. The
one-time authoring record `scripts/author-a1-scope.py` documents the reviewed
equivalences and selection. Its initial unit mapping is authoring context only;
the runtime reads the final explicit tags. Ordinary dictionary binding never
runs this authoring script or infers topics/CEFR placement from imported POS.

`tests/dictionary-a1.test.ts` verifies complete authored coverage, the fixed
denominator, alias integrity, overlapping topic pools, all 450 existing exact
recordings, valid milestone references, and coverage of all five skill areas.
Learner progress and session behavior have their own application tests.

## Personalized lesson composition

The corrected topic-to-lesson layer is specified in
[Topic lesson builder](2026-09-13-topic-lesson-builder.md). A topic opens an
editable 12-word draft with a default 96-card lesson, actual balanced exposure
counts, and automatic saving for exact resume. Learners can change the word and
card counts or select their own subset. Complete reviewed examples and word/phrase
practice preserve existing audio without implying full procedural grammar
coverage for all 450 concepts.

Optional topic expansion is offered only when that topic has extra words.
Dictionary remains available for arbitrary personal interests at any time.
All explicit personal targets are included in word practice (up to 120 per lesson);
larger selections produce a clear request to reduce the lesson size. Priority
has no such limit. The sentence builder retains reviewed eligibility checks.

Topic and personal word lessons save their actual cards. Resume and replay never
recompose them against changed progress or dictionary content. Individual saved
cards and saved lessons survive removal from the bounded recent-session list.
