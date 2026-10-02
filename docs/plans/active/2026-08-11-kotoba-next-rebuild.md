# Kotoba Next Rebuild Plan

Date: 2026-08-11

Status: Active implementation; polished vertical slice and learner-memory Library complete

Research basis: docs/references/2026-08-11-kotoba-next-research.md

## Implementation checkpoint — 2026-08-12

The side-by-side Vite application now exists under `apps/learner-next/` with a
responsive Today, Course, Library, Me, and Practice experience; local-first
state migration; lazy curriculum loading; installable PWA assets; and tested
multi-prompt practice sessions.

The second product pass replaced the Library showcase with a working
learner-memory system. Persistent state v3 records every word encounter with
first and last seen dates, encounter and outcome counts, memory status, source
units, and interaction lanes. Compound filters can now generate real mixed,
listening, or recall sessions across multiple units. A dated returning-learner
fixture covers Units 1–3 so the product can be judged in a believable state
before final lesson content is authored. The fixture is automatic in
development, available through `?demo` for production previews, and absent from
a genuine production first launch.

The current build remains deliberately local-first. Account sync, a production
personal scheduler, authored bridge content, and wider curriculum editorial
work remain later milestones; they are not prerequisites for validating the
current application and review interaction design.

Practice uses one canonical learner-memory vocabulary everywhere: Hard,
Learning, and Easy. These are explicit word-level Library statuses, available
only after opening a specific token in the language inspector. Sentence-level
success or failure records evidence but never silently tags every word.
Single-character Kana and first-symbol units never receive sentence-arrangement
prompts; their lanes are exploration, recognition, listening, and character
recall. Recall responses are touch-first Japanese choices, with a large 2×2
character pad for symbol units and readable word or sentence tiles elsewhere;
core lessons never require a Japanese IME or free-form Kana entry. Deliberate
production can be tested later through romaji or a purpose-built on-screen
keyboard. Listening resolves checked-in production audio before attempting a
device speech fallback.

Practice treats the learner's tap as the answer; there is no separate Check
answer step. A correct tap advances after a brief acknowledgement. A miss never
advances on its own: the learner sees the answer contrast and confirms Continue.
Explore prompts reveal their meaning and then advance without a footer rating.

Practice audio has one global replay control in the bottom action bar. The
header does not duplicate it. Token-level pronunciation belongs in the open
language inspector, where Play resolves checked-in card or shared token audio
before speech fallback.

## The decision in one page

Build a genuinely new application generation, but keep it in this repository.

Do not create a separate repository now. Kotoba's curriculum, stable IDs,
authoring scripts, semantic audits, media pipeline, decisions, and git history
are the product's moat. Splitting the learner app from those assets would create
coordination and versioning problems without creating meaningful independence.

Implement Kotoba Next beside the current app as a workspace application. Keep
the current app runnable until the new vertical slice passes its own acceptance
gates. Cut over only after progress migration, offline behavior, responsive
practice, and the first complete learning loop have been proven.

Recommended shape:

    apps/
      learner-next/
    packages/
      content-schema/
      content-runtime/
      learning-engine/
      ui/
    data/
      jp/
        curriculum/
    scripts/
    tests/
    archive/

The result is a new project in the architectural sense, not a new repository in
the operational sense. A separate repository should be reconsidered only if
ownership, licensing, release cadence, or a distinct content team later demands
it.

## What survives, evolves, and ends

### Preserve

- stable vocabulary, card, unit, and media identities;
- authored source data and frozen runtime artifacts;
- sentence-first pedagogy and cumulative grammar;
- new, review-due, and helper vocabulary distinctions;
- the curriculum-level exponential review-bin rule;
- token-aligned surface, reading, explanation, identity, and audio;
- semantic audits and taste rules;
- the offline production-audio pipeline and shared token cache;
- graceful fallback when media is missing;
- the calm, text-led product character;
- guest and local-first usability.

### Evolve

- cards become reusable sentence encounters with multiple prompt families;
- one 80 to 100 card march becomes short scene chapters and adaptive sessions;
- authored review bins gain a separate personal memory scheduler;
- card position becomes exposure history, while attempts become mastery evidence;
- one grammar spine gains explicit Can-dos, scenes, skill lanes, and bridges;
- localStorage progress becomes an event log and IndexedDB projections;
- a desktop-first rail becomes Today-first mobile navigation;
- a dictionary panel becomes a knowledge-aware lookup shared across the app;
- browser fallback audio becomes a managed offline audio service;
- jsdom flow coverage gains real-browser, accessibility, visual, offline, and
  performance acceptance.

### Retire

- the 1,110-line application component as an architectural center;
- the 1,279-line global stylesheet as the design system;
- unit completion based only on reaching the last card;
- treating every exposure as equal evidence;
- the full curriculum rail before practice on mobile;
- settings and keyboard affordances occupying prime phone space;
- a test called end-to-end that never launches a browser;
- hidden data-shape assumptions inside UI code;
- any requirement that a learner sign in, stay online, or tolerate punishment
  mechanics to keep learning.

## Product thesis

Kotoba Next is a mobile-first, local-first Japanese learning system that knows
what the learner knows and turns authored sentence worlds into durable,
usable language.

It connects four stages that learners normally assemble from separate apps:

1. learn through a coherent, practical course;
2. remember through personal, transparent spacing;
3. understand through graded reading and listening;
4. use Japanese through guided retrieval, shadowing, and bounded production.

The concise promise:

> Learn Japanese in context. Remember it personally. Use it with confidence.

The deeper differentiator is contextual mastery. Kotoba schedules a learning
object, not a frozen flashcard. When a word or grammar point is due, the session
composer selects a suitable authored sentence and response mode, giving the
learner retrieval practice without severing the item from meaning and use.

## Goal

Deliver a sleek, trustworthy, installable Japanese learning app that feels at
home on a phone, remains excellent on desktop, works offline, adapts to learner
evidence, and preserves Kotoba's high-quality curriculum pipeline.

The first production-worthy release should let a learner:

- begin as a guest in under one minute;
- choose a goal, script comfort, and daily intensity;
- enter an immediate useful session;
- learn one unit through a coherent sentence world;
- answer through reading, listening, recall, and light production;
- receive precise, non-punitive feedback;
- leave and resume safely across reloads and offline use;
- complete personally scheduled reviews;
- finish the unit with a short comprehensible bridge scene;
- understand what is strong, weak, due, and newly available;
- optionally create an account and sync without losing local progress.

## North-star outcome and success measures

North-star outcome:

> Learners repeatedly complete meaningful sessions and demonstrate delayed
> understanding of Japanese in new contexts.

Primary product measures:

- activation: completes the first meaningful session within the first visit;
- return: completes another meaningful session within seven days;
- learning: succeeds on delayed retrieval of previously introduced targets;
- transfer: understands a bridge sentence not seen verbatim during instruction;
- continuity: starts the next recommended activity without navigation confusion.

Supporting measures:

- median time from launch to first prompt;
- due-work completion rate;
- proportion of attempts using listening, reading, and production;
- hint and reveal rates by target and prompt kind;
- unit-to-bridge completion rate;
- weekly meaningful-practice days;
- voluntary audio use and replay behavior;
- offline session success and sync recovery;
- self-reported confidence on Can-do checkpoints.

Guardrail measures:

- no increase in false mastery caused by passive reveals;
- no review backlog spiral after time away;
- no incentive to farm easy activity;
- no raw learner audio retained by default;
- no degradation of current curriculum validity or stable IDs;
- no core task hidden behind account creation;
- no feature that makes mistakes reduce access to learning.

## Product principles

### 1. The sentence is the center

Japanese text, audio, meaning, and the learner's response are the visual and
instructional center. Maps, streaks, settings, mascots, and analytics remain
supporting layers.

### 2. Mastery is evidence, not position

Reaching card 80 is exposure. Correct delayed retrieval, comprehension in a new
sentence, and successful production are evidence. The UI may celebrate both,
but it must not confuse them.

### 3. One learner model, many focused experiences

Course, review, reader, listening, dictionary, and speaking all use the same
stable objects and attempt history. The app can feel simple because knowledge is
not duplicated into separate systems.

### 4. Authored truth, adaptive delivery

Canonical Japanese, explanations, translations, task answers, and progression
rules remain frozen and reviewable. Adaptation selects and sequences validated
material; it does not silently invent the curriculum.

### 5. Support fades, control remains

Furigana, romaji, captions, translation, token explanations, and speed controls
can fade as evidence improves. The learner can always restore them.

### 6. Effort should be useful, never punitive

Retrieval should be challenging enough to learn from. Mistakes create better
feedback and another attempt, not lost hearts, locked study, public shame, or
artificial debt.

### 7. Quiet motivation

Kotoba should feel warm, polished, and alive. It may celebrate progress, but it
does not need a casino economy. Use a rolling weekly rhythm, meaningful
milestones, gentle recovery, and optional reminders.

### 8. Mobile is the reference environment

Design first at 390 by 844 with safe areas, one-handed reach, interruptions,
audio permissions, slow networks, and short sessions. Expand to tablet and
desktop; do not collapse desktop onto mobile after the fact.

### 9. Offline is normal

Downloaded course content, recent units, due work, attempts, and audio should
continue without a network. Sync is a background enhancement.

### 10. Explain the system

The learner can see why a prompt appeared: new for this unit, due from a prior
unit, recently missed in listening, or needed for a Can-do. Personalization
should feel helpful, not mysterious.

## Target learners

### Primary: committed beginner

- knows little or some kana;
- wants a real course, not a phrasebook;
- has 5 to 20 minutes most days;
- values explanation but does not want a textbook wall;
- expects a polished phone experience;
- needs early listening and usable action language.

### Secondary: returning late beginner

- has used Duolingo, a textbook, Anki, or WaniKani;
- knows uneven vocabulary and grammar;
- wants to skip familiar material without losing structure;
- struggles to convert recognition into comprehension and output;
- wants a bridge to reading and native material.

### Later: early intermediate

- can read controlled Japanese;
- needs richer scenes, longer listening, graded reading, and production;
- wants knowledge-aware content and efficient maintenance;
- may import or mine personal content in a future phase.

Kotoba Next should not initially optimize for JLPT cramming, classroom
administration, young children, advanced literary study, or a social network.

## The product model

Kotoba has four mutually reinforcing loops.

### Learn

Structured units introduce a Can-do, a coherent micro-world, vocabulary, and
grammar through controlled sentences. The learner notices patterns, retrieves
targets, and applies them with increasing independence.

### Remember

A personal scheduler tracks due learning objects and skill evidence. Reviews
reuse varied authored contexts and avoid presenting the same sentence sibling
too soon.

### Understand

Short bridge scenes, dialogues, and graded readings use overwhelmingly known
material. Audio, captions, token explanations, and translation are available on
demand. This is the transition from drills to meaning.

### Use

Guided output begins with ordering, cloze, typing, dictation, shadowing, and
record-and-compare. Later it grows into constrained role-play grounded in the
same Can-dos and known vocabulary.

The learner should perceive one journey, not four products.

### Unit structure

Keep the current 80 to 100 authored encounters as a rich content pool, not as
one mandatory 80-card march. Compile a standard unit into four to six short
scene chapters plus a bridge:

1. enter the situation and meet the first useful language;
2. expand the vocabulary while keeping familiar structure;
3. notice and use the new grammar;
4. mix current and due material;
5. demonstrate the Can-do;
6. understand the bridge scene.

A scene should usually fit a 3 to 8 minute session. The personal composer may
draw due encounters across scenes, but first exposure respects chapter order.
Learners can stop after any chapter without feeling they abandoned a unit.
Unit completion is no longer a synonym for visiting every encounter exactly
once.

## Information architecture

### Mobile primary navigation

Use four bottom destinations:

1. Today
2. Course
3. Library
4. Me

Practice is a focused route launched from Today, Course, Library, or Me. It is
not a fifth tab. When practice opens, global navigation recedes and the session
controls own the screen.

Reference mobile Today composition:

    ┌──────────────────────────────────┐
    │ Kotoba                 3 of 4 days│
    │                                  │
    │ Good evening                     │
    │ Keep Unit 3 moving               │
    │                                  │
    │ 10-minute session                │
    │ 6 due · 4 new · 2 listening      │
    │                                  │
    │        Start practice            │
    │                                  │
    │ Resume interrupted session       │
    │ Recently unlocked: At the café   │
    ├──────────────────────────────────┤
    │ Today    Course    Library    Me  │
    └──────────────────────────────────┘

### Desktop adaptation

Use the same destinations in a compact left navigation rail. The active
practice stage stays centered with optional contextual panels on the right.
Do not restore the current full curriculum rail before the session.

### Today

Today answers one question: what is the best useful thing to do now?

It contains:

- a primary Start session action;
- the proposed recipe, such as 8 due, 1 new scene, 2-minute bridge;
- a duration chooser: Quick, Standard, Deep;
- a calm weekly rhythm;
- one recent strength and one useful focus;
- a resume chip if a session was interrupted;
- download or sync status only when action is needed.

No dashboard grid of twelve metrics. Details belong in Me.

### Course

Course contains:

- level and topic map;
- current Can-do and next unit;
- unit states: available, in progress, ready to demonstrate, maintained;
- placement and skip controls;
- unit detail with outcomes, scene, target words, grammar, audio download, and
  estimated active time;
- clear separation of course exposure and personal mastery.

### Library

Library is the learner's reviewable language memory, not a generic dictionary
or a shelf of promotional content. It contains every word the learner has
interacted with through practice, listening, recall, sentence building, token
inspection, or saving.

The first production slice includes:

- first seen, last seen, encounter count, outcome signal, memory status, source
  units, and interaction lanes for every encountered word;
- compound filters for recency, hard/learning/easy status, interaction type,
  search, and lesson range;
- direct hard, learning, and easy controls plus independent bookmarking;
- mixed, listening-only, and recall-only lesson generation from the exact
  filtered word set;
- dynamic review mixes for the full Library, hard words, stale words, and unit
  ranges;
- saved sentences and grammar lookup as secondary tabs.

Later it can add graded content, imports, downloads, and richer scheduler
forecasts. Those surfaces must remain downstream of real learner history rather
than becoming disconnected content silos.

### Me

Me contains:

- Can-do evidence and skill profile;
- vocabulary, grammar, kanji, reading, listening, and production trends;
- review forecast and load controls;
- weekly history and milestones;
- display, audio, accessibility, reminders, privacy, export, and account;
- a quiet-mode toggle that removes celebratory motion and habit surfaces.

## Onboarding

Onboarding must be reversible, skippable, and no longer than needed to create a
useful first session.

### Required flow

1. Welcome with a plain product promise and Start as guest.
2. Goal: travel, conversation, media, living in Japan, structured foundation,
   or custom.
3. Current experience: new, know kana, studied some basics, returning learner.
4. Script comfort: kana status, romaji preference, furigana preference.
5. Daily intensity: 5, 10, or 20 minutes with an adjustable weekly rhythm.
6. Audio check and silent-mode fallback.
7. Immediate first session.

### Calibration

Do not force a long placement test on true beginners. Returning learners can
choose a short adaptive calibration that samples kana, vocabulary, grammar,
reading, and listening separately. It should produce an uneven profile rather
than one false level number.

Calibration rules:

- allow Not sure;
- stop a lane after repeated misses;
- do not schedule tested-out content as mastered forever;
- seed memory state with lower confidence than real delayed review;
- explain every skip and allow undo.

### First-session success

Within three minutes the learner should:

- hear native Japanese;
- understand one complete sentence;
- interact with one token;
- retrieve one small target;
- see a concrete Can-do;
- finish with a sense of forward motion.

Do not ask for notification, microphone, install, or account permission before
the learner experiences value.

## The practice experience

### Session contract

A session has a declared goal, target duration, recipe, and resumable state.
Examples:

- Quick: 5 due items, one listening check, roughly 3 minutes;
- Standard: warm-up, due review, current scene, bridge, roughly 10 minutes;
- Deep: full review queue, new scene, listening, production, roughly 20 minutes.

The recipe adapts to evidence but remains understandable. The header may say:

    12 prompts
    6 due · 4 from Unit 3 · 2 listening

### Session rhythm

A default standard session:

1. Arrival: one easy successful retrieval from recent material.
2. Due work: interleaved personal reviews in varied contexts.
3. Current scene: a small number of new targets with familiar scaffolding.
4. Retrieval: remove support and vary the response.
5. Integration: combine current and due material in the unit micro-world.
6. Bridge: understand a short new sentence or dialogue turn.
7. Reflection: concise result, next due horizon, and one optional continuation.

Do not place a result screen between every micro-step.

### Prompt families

Ship prompt families in a deliberate order.

Foundation set:

- listen and choose meaning;
- Japanese to meaning recall;
- meaning to Japanese supported recall;
- token tap and inspect;
- cloze with constrained choices;
- sentence ordering;
- choose the missing word or phrase from an on-screen bank;
- audio dictation with replay;
- identify the grammar contrast;
- read and answer a micro-comprehension question.

Production set:

- read aloud and self-check;
- paced shadowing;
- record and compare;
- constrained spoken substitution;
- optional romaji-assisted response, outside the core lesson loop;
- bounded role response.

Each prompt declares:

- the learning objects it targets;
- the skill evidence it can produce;
- allowed hints;
- answer normalization;
- expected difficulty;
- whether it is instruction, retrieval, transfer, or reflection.

Multiple choice is for early discrimination and listening, not the default proof
of mastery.

### Feedback ladder

Correct:

- confirm quickly;
- emphasize the relevant token or contrast;
- avoid a blocking celebration;
- optionally show why the response works.

Incorrect:

1. preserve the learner's response;
2. show the smallest useful cue;
3. allow another attempt;
4. reveal a token or grammar explanation if needed;
5. show the full answer;
6. schedule a nearby transfer prompt, not an immediate exact clone.

The learner can always choose I knew this, Typo, Too hard, or Report content.
These are auditable events, not secret scheduler overrides.

### Mobile layout

Reference layout:

- top bar: close or pause, session progress, sound;
- context line: why this prompt or current scene;
- central stage: Japanese or response UI;
- expandable support: reading, meaning, token detail;
- bottom action zone: primary response or reveal, audio, and next;
- safe-area padding and 44px minimum primary targets;
- swipe may advance only when it cannot cause accidental answer submission and
  always has visible button equivalents.

The Japanese sentence must appear in the first viewport. Unit browsing never
precedes it during a session.

Reference mobile practice composition:

    ┌──────────────────────────────────┐
    │ Pause       4 of 12         Sound│
    │ Due now · listening              │
    │                                  │
    │             audio                │
    │                                  │
    │      Which meaning fits?         │
    │                                  │
    │     response choices / tiles     │
    │                                  │
    │ Reading · Meaning · Explain      │
    ├──────────────────────────────────┤
    │ Replay                 Check      │
    └──────────────────────────────────┘

### Desktop layout

- compact global rail;
- centered practice stage with a bounded reading width;
- optional right inspector for token, grammar, or session queue;
- full keyboard workflow;
- no mobile bottom sheet stretched into a giant desktop modal.

### Interruptions and recovery

- persist after every meaningful attempt;
- resume an interrupted prompt without double-counting it;
- handle audio interruption and tab backgrounding;
- offer End now and save without shame;
- on return after a long absence, rebalance workload rather than dumping every
  overdue item into one queue.

## The Known-State Engine

This is the conceptual center of Kotoba Next.

### Learning objects

Track stable objects, not display strings:

- lexeme;
- grammar concept or construction;
- kana symbol;
- kanji identity and reading where introduced;
- fixed expression;
- Can-do outcome.

Sentence encounters reference these objects. Surface forms and conjugations do
not create accidental duplicate identities.

### Skill dimensions

Do not assign one universal mastery score. Store evidence in a small set of
meaningful lanes:

- reading recognition;
- listening recognition;
- meaning recall;
- form or production recall;
- contextual comprehension.

Grammar adds:

- construction recognition;
- constrained production.

Kana and kanji may use:

- visual recognition;
- reading recall;
- writing later, if implemented.

The UI can summarize these lanes, but the underlying evidence stays separate.

### Personal spacing

Use a proven, version-pinned FSRS implementation as the base scheduler for
atomic memory states. Preserve its review log and deterministic test vectors.
Do not present FSRS jargon in the normal UI.

Important boundaries:

- the current curriculum review-bin formula remains an authoring requirement;
- personal FSRS scheduling decides when the learner needs a target;
- the session composer chooses which authored encounter and prompt family will
  test it;
- exposure without retrieval does not receive the same grade as retrieval;
- multiple skill lanes for one object are siblings and should be dispersed;
- recent sentence siblings are suppressed to prevent answer-shape memorization;
- scheduler version, parameters, desired retention, and migration behavior are
  stored explicitly;
- algorithm changes require replay tests against captured attempt histories.

Start with pass or fail plus evidence metadata. Do not require learners to make
subtle Again, Hard, Good, Easy judgments after every prompt. The system already
knows response type, latency, hints, retries, and correctness. Provide manual
correction when the automatic result was wrong.

### Session composition

The composer receives:

- due memory states;
- active unit and scene;
- current Can-do;
- available encounters;
- prompt-family eligibility;
- recent encounter and response history;
- session duration and mode;
- learner display and accessibility preferences;
- downloaded content and network state.

It returns a deterministic, persisted session plan with room for bounded
replanning after errors.

Selection priorities:

1. protect truly due items;
2. keep the current Can-do coherent;
3. prefer one-unknown or mostly known contexts;
4. vary context and response mode;
5. respect first-exposure pacing;
6. avoid sibling clustering;
7. finish within the promised duration;
8. include a likely success after a difficult run;
9. never use unavailable audio in an audio-required prompt.

Every selection should carry a reason code for debugging and optional learner
explanation.

### Course progress versus memory

Show two related states:

- Course: what has been introduced and demonstrated in the curriculum path.
- Memory: what is currently retrievable and needs maintenance.

Unit states:

- Not started
- Learning
- Ready to demonstrate
- Demonstrated
- Maintaining

Completion requires a short Can-do checkpoint with transfer items, but it does
not demand that every target be mature in SRS. Maintenance continues naturally.

## Bridge scenes and the content ladder

Every standard unit should eventually include a payoff that is not a drill.

### Bridge scene

A bridge scene is a 30-second to 3-minute dialogue, message thread, announcement,
mini-story, or practical reading that:

- demonstrates the unit Can-do;
- uses predominantly known vocabulary and grammar;
- includes at least one new combination not memorized verbatim;
- has native audio when audio is relevant;
- supports sentence-level replay;
- provides contextual token definitions and grammar notes;
- can hide or show furigana, captions, and translation;
- ends with one or two comprehension actions, not ten quiz interruptions.

### Difficulty contract

Each scene compiles a knownness report against the unit boundary:

- percentage of lexical tokens already introduced;
- new lexical items and why they are allowed;
- grammar availability;
- sentence length and clause depth;
- kanji display eligibility;
- audio rate and register;
- required cultural context.

The initial target is at least 90 percent known lexical tokens for early bridge
scenes, with explicit support for the remainder. Tune through learner testing.

### Longer-term ladder

1. sentence streams;
2. unit bridge scenes;
3. multi-scene graded stories;
4. topic collections;
5. supported authentic excerpts;
6. optional personal imports and sentence mining.

Do not build stage six before stages one through three are excellent.

## Curriculum and content architecture

### Preserve the current source of truth

The current data and validators remain valid during the transition. Do not
rewrite 49 A1 units into a speculative schema by hand.

Create a versioned compiler boundary:

    current source model and frozen units
             |
             v
      content adapter and enrichments
             |
             v
      versioned runtime packages
             |
             v
         learner app

The first adapter should ingest existing units without loss. New fields live in
sidecar source data or a version-two source schema. Generated runtime output is
checked in or reproducibly built according to one documented policy.

### Version-two domain objects

Course:

- id, language, title, framework, levels, version, release channel.

Unit:

- stable id and slug;
- topic and micro-world;
- learner title;
- Can-do references;
- grammar references;
- new, review-due, and helper object references;
- scene ordering;
- bridge references;
- prerequisites;
- authoring notes and content version.

Can-do:

- stable id;
- learner-facing statement;
- situation;
- skill mode;
- success rubric;
- evidence requirements;
- framework alignment without certification claim.

Scene:

- stable id;
- setting, roles, register, and narrative purpose;
- encounter ordering or selection pools;
- target and allowed helper objects;
- audio and bridge references.

Encounter:

- stable id;
- Japanese token sequence;
- readings and explanations;
- natural English meaning;
- target learning-object references;
- grammar tags;
- scene, role, register, and semantic-axis tags;
- difficulty metadata;
- audio references and timings when available;
- prompt eligibility.

Prompt specification:

- stable or derivable id;
- encounter reference;
- prompt family;
- target objects and evidence lane;
- answer specification and normalization;
- hint ladder;
- distractor rules or fixed authored distractors;
- accessibility alternative;
- quality and version metadata.

Learning object:

- stable id;
- type;
- canonical Japanese and readings;
- meanings and sense identifiers;
- part of speech or grammar category;
- forms and relationships;
- curriculum introduction;
- optional pitch or pronunciation metadata;
- dictionary and cultural notes.

### Map current data without breaking identity

- newWords entries become lexeme learning objects.
- Current wordId values remain the durable keys.
- Cards become encounters; current card IDs remain stable encounter IDs.
- line, tts, explain, tokens, english, grammarTags, and audioRef are preserved.
- grammarFocus becomes one or more explicit grammar objects plus Can-do support.
- reviewWordIds remain authoring metadata and validator inputs.
- function words and grammar tokens remain inspectable non-lexeme objects.
- current unit ordering and course-level boundaries remain stable unless an
  explicit curriculum decision changes them.

### Authoring quality gates

Retain every current validator and add:

- JSON Schema or equivalent runtime schema validation;
- stable reference and version validation;
- Can-do presence and evidence coverage;
- scene coherence fields;
- prompt answer and hint completeness;
- prompt eligibility and audio availability;
- transfer-item separation from training siblings;
- bridge knownness report;
- register and role consistency;
- accessibility alternatives;
- runtime package size and chunk boundaries;
- migration snapshots proving no content loss.

AI may draft authoring candidates, but canonical output still passes human or
expert review, semantic audits, and all structural validators.

## Learner data model

Use an event log as the durable learning record and derive projections from it.
This makes scheduler changes, sync conflicts, analytics, and debugging safer
than mutating one opaque progress blob.

### Core local tables

Profile:

- local profile id;
- optional remote user id;
- goal, level framing, locale, timezone;
- onboarding and consent state.

Settings:

- display, furigana, romaji, theme, motion, audio, haptics;
- session defaults;
- accessibility and quiet mode;
- sync version.

Attempt event:

- globally unique sortable id;
- profile, session, prompt, encounter, and target references;
- occurred-at and local timezone;
- response mode;
- correctness and normalized result;
- latency;
- hints, reveal, retries, and audio use;
- self-correction or content-report flags;
- scheduler grade derived from the event;
- content and engine versions;
- sync state.

Memory state:

- profile, learning object, and skill lane;
- FSRS state and due date;
- last evidence;
- scheduler version and parameters;
- projection version.

Session:

- id, recipe, reason, planned prompts, start and end;
- current index;
- interruption state;
- duration target;
- summary projection.

Course projection:

- unit and Can-do states;
- exposure and checkpoint evidence;
- unlocked bridges;
- source event watermark.

Content cache:

- course package versions;
- downloaded units and audio;
- integrity hashes;
- last used and storage size.

Outbox:

- append-only unsynced events;
- retry and acknowledgement metadata;
- no secrets.

### Event taxonomy

Learning events:

- session_planned
- session_started
- prompt_presented
- answer_submitted
- hint_requested
- answer_revealed
- answer_corrected
- audio_played
- token_inspected
- prompt_skipped
- session_paused
- session_completed
- checkpoint_completed

Product events:

- onboarding_completed
- goal_changed
- unit_opened
- bridge_opened
- content_downloaded
- account_linked
- sync_failed
- content_reported

Analytics receives privacy-filtered projections, not necessarily the raw event
record. Never send raw response text or audio by default.

## Local-first and sync architecture

### Local database

Use IndexedDB through Dexie for learner state, attempts, sessions, cache
metadata, and the outbox. Do not keep learning history in localStorage.
localStorage may hold only tiny boot preferences if necessary.

### Offline application

- service worker caches the application shell and versioned content packages;
- default download includes the active unit, immediate review dependencies, and
  required audio within a size budget;
- explicit controls manage additional downloads;
- the Today screen works offline from the local learner projection;
- all learning writes go local first;
- network-only features show a useful local alternative.

### Optional account and backend

Use Supabase as the initial backend recommendation:

- Postgres for durable event sync and profile metadata;
- Auth with accessible email link or passkey-capable flows when supported;
- row-level security on every exposed learner table;
- migrations and seed data stored in the repository;
- storage for private optional learner artifacts only if required;
- edge functions for privileged operations and future AI mediation.

Keep backend access behind repository interfaces so local-only operation and a
future provider change remain possible.

### Guest-to-account merge

Account creation must link the existing local profile:

1. authenticate;
2. upload unsynced immutable events;
3. fetch remote events after the local watermark;
4. deduplicate by event id;
5. recompute projections deterministically;
6. resolve settings by field-level latest timestamp;
7. show a merge summary only if meaningful conflicts occurred;
8. retain a recoverable local backup until sync success is confirmed.

### Conflict rules

- attempts and sessions: set union by immutable event id;
- settings: field-level last writer with timestamps;
- saved items: add/remove events, not array replacement;
- content packages: server version wins only after integrity validation;
- derived memory and course projections: recompute from events;
- deletions: explicit tombstone or account-deletion workflow;
- clock skew: server receipt time is stored, but learner occurrence time is
  preserved.

## Technical architecture

### Recommended baseline

- Node 24 LTS
- npm workspaces initially, preserving the repository's existing package-manager
  expectations
- React 19.2 on the latest patched release
- TypeScript 6 in strict mode with deprecated options removed
- Vite 8.1
- TanStack Router for type-safe route and search state
- Dexie for IndexedDB
- a version-pinned TypeScript FSRS library behind a learning-engine adapter
- Zod or JSON Schema compilation for runtime data boundaries
- React Aria Components or equivalent accessible primitives where native HTML
  is insufficient
- CSS layers, design tokens, container queries, logical properties, and native
  view transitions only as progressive enhancement
- vite-plugin-pwa or an explicit Workbox configuration
- Supabase client behind an application repository
- Vitest and Testing Library for unit and component tests
- Playwright for real browser end-to-end and visual tests
- axe-core for automated accessibility checks
- MSW for network contracts
- Storybook only if the component inventory becomes large enough to justify
  its maintenance; do not make it a phase-zero dependency

Do not add Redux, a general UI framework, a full SSR framework, GraphQL, or
Turborepo without a demonstrated need. Cutting edge means using current stable
platform capabilities with clear boundaries, not maximizing dependencies.

### System flow

    authored source ──> validators ──> content compiler ──> runtime packages
          │                                                       │
          │                                                       v
          └──────────────────────────────────────────────> content runtime
                                                                  │
                                                                  v
    learner action ──> immutable attempt ──> local event log ──> projections
                                                │                 │
                                                │                 ├─> Today
                                                │                 ├─> progress
                                                │                 └─> scheduler
                                                │                         │
                                                └─> optional sync         v
                                                                  session composer
                                                                         │
                                                                         v
                                                                   next prompt plan

The arrows are one-way at domain boundaries. UI never edits memory state
directly; it records an attempt. Projections never rewrite canonical content;
they query it. Sync transports events and settings, then projections replay.

### Why Vite PWA rather than Next.js or immediate native

- The core product is an authenticated or guest application, not an SEO content
  site.
- Curriculum can be versioned static content.
- The critical experience must work locally and offline.
- Existing expertise and tooling are Vite and React.
- A client-first app avoids coupling the learning engine to a server rendering
  lifecycle.
- Capacitor can package the tested web app later.
- Marketing or public content can be a separate static surface if needed.

### Package responsibilities

apps/learner-next:

- routes, application shell, dependency composition, service worker, and
  platform adapters;
- feature folders for onboarding, today, course, practice, library, profile,
  settings, auth, and sync.

packages/content-schema:

- source and runtime types;
- schemas, migrations, validators, and content-version utilities.

packages/content-runtime:

- package loading, indexing, token lookup, knownness analysis, and encounter
  queries;
- no React dependencies.

packages/learning-engine:

- attempt grading;
- scheduler adapter;
- memory projections;
- session composition;
- Can-do evidence;
- deterministic reason codes and test fixtures;
- no React dependencies and no direct network access.

packages/ui:

- design tokens;
- accessible primitives;
- Japanese text and token components;
- layout, feedback, bottom sheet, progress, audio controls;
- no product data fetching.

### Feature folder contract

Each feature owns:

- route or entry component;
- application use cases;
- view models;
- UI composition;
- tests.

Domain logic lives in packages. Persistence is accessed through interfaces.
Components do not import raw curriculum JSON or call Supabase directly.

### State boundaries

- route state: URL and TanStack Router;
- server state: sync repository and narrowly scoped query cache if needed;
- local durable state: Dexie;
- ephemeral session UI: React state or a small feature-scoped store;
- domain projections: pure learning-engine functions;
- audio player: one application service with explicit state machine.

Avoid one global store containing everything.

### Content delivery

- compile curriculum into a small course index plus lazy versioned unit chunks;
- hash packages and verify before activating;
- prefetch the next likely unit while online;
- cache active and due dependencies;
- separate audio packages so text updates do not invalidate every MP3;
- retain one previous compatible content version during upgrade and migration;
- make stale content explicit only when it blocks correctness.

## Audio and speaking

### Audio foundation

Preserve the current production audio and shared token cache.

Add:

- a central audio queue and state machine;
- sentence, segment, and token playback;
- slow replay where a real alternate file or high-quality rate change is
  acceptable;
- waveform or progress only if it helps scrubbing;
- download size and availability status;
- browser speech fallback clearly distinguished from production audio;
- interruption recovery and no overlapping utterances;
- transcript timing as optional future metadata.

### Speaking sequence

Phase one:

- native model audio;
- record locally;
- play learner and model back-to-back;
- paced shadowing;
- self-rating and retry;
- no upload by default.

Phase two:

- speech-to-text for constrained expected phrases;
- tolerant normalization;
- feedback on missing or substituted content;
- clear confidence and manual override.

Phase three:

- validated pronunciation feedback using a Japanese learner test set;
- no single pseudo-scientific score;
- focus on actionable contrasts;
- do not claim pitch-accent mastery without reliable data and expert review.

Microphone permission is requested only at the moment the learner starts an
explicit speaking activity.

## AI policy and future coach

AI is optional infrastructure, not the product's source of truth.

### Good uses

- answer a learner question using retrieved Kotoba grammar, token, and scene
  sources;
- generate a bounded explanation at the learner's chosen depth;
- conduct a role-play constrained by a Can-do, known vocabulary, register, and
  scenario rubric;
- classify a free response for likely intent before deterministic checks;
- draft content candidates for offline author review;
- summarize learner errors without exposing raw data beyond the approved
  boundary.

### Prohibited uses

- silently generate canonical units at runtime;
- introduce unapproved vocabulary or grammar as if it were in the course;
- mark a Can-do mastered solely from an unconstrained model judgment;
- fabricate dictionary, cultural, or pronunciation facts;
- send private learner data without clear consent;
- retain voice recordings by default;
- block the core course behind model availability or cost.

### Implementation boundary

- server-mediated adapter with provider independence;
- strict structured input and output schemas;
- retrieved source identifiers included in every request and response;
- allowlist of learning objects and register;
- timeout, budget, and offline fallback;
- prompt and model version logging;
- adversarial and Japanese-quality evaluation set;
- learner-visible AI label;
- report and human-review path.

Do not build AI role-play until deterministic Learn, Remember, Understand, and
basic Use loops pass production acceptance.

## Visual and interaction direction

### Brand character

Aim for modern Japanese editorial craft rather than anime pastiche, corporate
SaaS, or children's gamification.

Qualities:

- calm confidence;
- tactile but restrained;
- dense information only when invited;
- typography-led;
- warm natural color with sharp functional accents;
- precise motion and audio feedback;
- unmistakably a practice instrument.

The current deep green, cream, and rust palette is a strong starting lineage.
Refine it into semantic tokens rather than discarding it for a generic neon
gradient.

Visual context is allowed in Kotoba Next when it carries instructional meaning:
a map, menu, sign, chat thread, room layout, gesture, or scene illustration can
make a Can-do concrete. Do not restore a required stock image to every sentence
or let decorative art compete with Japanese. Images and future video are
content types with accessibility text, provenance, licensing, download cost,
and pedagogical purpose.

### Design tokens

Define:

- color roles for canvas, surface, elevated, text, muted, accent, success,
  caution, error, focus, and Japanese token categories;
- type roles for display, Japanese sentence, Japanese support, body, label,
  numeric progress, and code or keycap;
- spacing and radius scales;
- elevation with borders before heavy shadows;
- motion duration and easing;
- touch-target and safe-area tokens;
- content widths and responsive breakpoints;
- audio and haptic feedback rules.

Bundle Japanese fonts or provide robust system stacks for offline behavior.
Avoid layout shifts from late font loading.

### Motion

Use motion to show continuity:

- prompt transition;
- token-to-explanation relationship;
- answer feedback;
- unit-to-bridge unlock;
- session completion.

Keep motion short, interruptible, and disabled under reduced motion. Do not
animate every tap or make completion wait on confetti.

### Progressive disclosure

- normal prompt: sentence and response;
- first support: reading or replay;
- second support: meaning;
- third support: token and grammar detail;
- deep link: full dictionary or grammar page.

Desktop hover is never the only path. Mobile tap and keyboard focus expose the
same information.

## Accessibility requirements

Target WCAG 2.2 AA from the first vertical slice.

Required:

- semantic landmarks and headings;
- complete keyboard flow;
- visible, unobscured focus;
- 44px target goal for primary mobile controls and never below WCAG minimum;
- no drag-only or swipe-only interaction;
- contrast validation in all themes and states;
- screen-reader labels that include Japanese and action meaning;
- page and language-part attributes for Japanese text;
- reduced motion and sound-independent feedback;
- captions or transcript for recorded content;
- large text through at least 200 percent without lost controls;
- color never carries correctness alone;
- accessible authentication;
- time limits adjustable or absent;
- audio controls never autoplay after a learner disables them;
- pronunciation support for uncommon instructional terms.

Automated checks are necessary but not sufficient. Run VoiceOver on iOS or
macOS, TalkBack on Android, and keyboard-only desktop checks before release.

## Performance budgets

Measure real devices and enforce budgets in CI where practical.

Targets:

- LCP at or below 2.5 seconds at the 75th percentile;
- INP at or below 200 milliseconds;
- CLS at or below 0.1;
- first route JavaScript target below 200KB compressed, excluding lazily loaded
  content and optional analytics;
- Today usable offline after first successful load;
- prompt-to-prompt transition under 100ms for locally available content;
- local attempt persist before visible navigation completes;
- no unbounded render of all 96 units or all vocabulary;
- no unit chunk that forces downloading unrelated audio;
- memory and storage budgets documented for a complete A1 download.

These are starting budgets. Capture baseline values and revise only with an
explicit decision.

## Privacy and security

### Privacy defaults

- guest use without identity;
- local-first learning record;
- analytics off or strictly minimal until consent policy is decided;
- no advertising identifiers;
- no raw audio upload without immediate task consent;
- export learner data in a documented format;
- delete account and remote data from inside the app;
- retain only what powers a named learner benefit;
- separate operational telemetry from learning content.

### Security baseline

- Content Security Policy;
- no secrets in client bundles or checked-in files;
- Supabase row-level security on every learner-owned table;
- generated database types and migration tests;
- rate limits and abuse controls on privileged or AI endpoints;
- input and output schemas at every trust boundary;
- dependency, secret, and license scanning;
- secure headers and HTTPS-only production;
- sanitized rendered explanations and no arbitrary HTML from curriculum;
- backup and restore test for remote learner events;
- threat model before account sync and before voice or AI upload;
- audit trail for content releases and scheduler migrations.

If the product is intentionally marketed to children, complete a separate legal
and privacy design for COPPA, age assurance, consent, and school use. Do not
infer that audience from a playful design.

## Analytics and experimentation

Instrument the learning engine before optimizing engagement.

### Event quality

- version every event schema;
- record deterministic reason codes;
- validate in development and test;
- prohibit personally identifying or raw content fields by default;
- support local debug export;
- maintain a data dictionary.

### Experiment principles

- experiments cannot alter canonical Japanese without content review;
- learning outcomes outrank click-through;
- never withhold accessibility, privacy, or core correction;
- define expected learning benefit and guardrails before launch;
- keep assignment stable and exportable;
- analyze by learner stage and activity mode;
- prefer delayed retrieval and transfer measures over same-session accuracy.

## Release scope

### P0: the defining release

- new workspace and app shell;
- guest onboarding;
- Today, Course, Library, Me navigation;
- mobile-first focused practice;
- current curriculum adapter and versioned runtime chunks;
- personal attempt log;
- personal scheduling and transparent session composer;
- foundation prompt families;
- token explanations and grammar detail;
- production and fallback audio;
- unit bridge for the vertical-slice units;
- course versus memory progress;
- IndexedDB persistence;
- installable offline PWA;
- real Playwright end-to-end tests;
- accessibility, performance, and error monitoring;
- import of current local progress with honest confidence.

### P1: production expansion

- optional account and sync;
- full A1 content migration;
- more bridge scenes and listening;
- calibration for returning learners;
- saved items and knowledge-aware dictionary;
- record-and-compare and shadowing;
- downloadable audio management;
- progress insights and review forecast;
- Capacitor feasibility spike and native beta if justified.

### P2: differentiated growth

- multi-scene graded stories;
- constrained speech recognition;
- grounded AI help and role-play;
- supported authentic excerpts;
- personal content import or sentence mining;
- optional cooperative or community features;
- additional Japanese levels;
- other languages only after the Japanese domain model proves portable.

### Explicit non-goals for P0

- social feed;
- leaderboards;
- virtual currency or energy;
- live tutoring marketplace;
- unconstrained AI chat;
- real-time collaborative practice;
- user-authored public decks;
- handwriting recognition;
- app-store release;
- full B2 content production;
- replacing the authoring pipeline with runtime generation;
- major curriculum resequencing unrelated to the vertical slice.

## Delivery strategy for Luna

Use vertical slices and reversible cutover. Do not begin by moving every file or
rewriting all content.

### Milestone 0: baseline and decisions

Size: Small

Work:

- read AGENTS.md, this plan, the research brief, and all current contract docs;
- capture current command results and app screenshots;
- record current content counts, IDs, runtime sizes, and audio coverage;
- create a short architecture decision confirming same-repo side-by-side build;
- establish Node 24 and workspace tooling;
- define feature flags and a cutover switch;
- add a no-regression test for current stable curriculum IDs.

Exit:

- old app and all current validators still run;
- workspace can install reproducibly;
- no current data has been moved or rewritten;
- decisions and baselines are committed.

### Milestone 1: contracts before screens

Size: Medium

Work:

- create content-schema, content-runtime, and learning-engine packages;
- define versioned encounter, prompt, Can-do, attempt, memory, session, and
  reason-code contracts;
- write the current-unit adapter;
- compile Unit 1 without data loss;
- define IndexedDB schema and migrations;
- build deterministic fixtures and scheduler test vectors.

Exit:

- Unit 1 round-trips through the adapter;
- every current field and stable id is accounted for;
- content and learning packages have no React dependency;
- schema, migration, and property tests pass.

### Milestone 2: mobile shell

Size: Medium

Work:

- build Today, Course, Library, and Me routes;
- build focused practice route;
- establish design tokens and light, dark, reduced-motion themes;
- implement bottom navigation and desktop rail;
- implement responsive Japanese stage and bottom action zone;
- add accessible primitives and error boundaries;
- add PWA manifest and application shell.

Exit:

- 390 by 844 opens with useful practice or Today content above the fold;
- desktop remains first-class;
- keyboard and screen-reader landmarks work;
- route-level chunks and performance budgets are measured;
- no curriculum behavior is faked in UI state.

### Milestone 3: one complete learning loop

Size: Large

Work:

- implement session plan persistence;
- add audio service;
- add Japanese-to-meaning, listening choice, reveal, cloze, ordering, and
  constrained tile-bank missing-target prompts;
- add feedback ladder and attempt events;
- update memory projections;
- explain why a prompt appeared;
- implement interruption recovery;
- author or adapt one Unit 1 bridge scene.

Exit:

- a guest can start, learn, retrieve, bridge, finish, reload, and resume;
- delayed retry changes personal due state;
- exact sentence siblings are dispersed;
- reveal does not count as mastery;
- the whole path works offline after caching;
- real-browser mobile and desktop tests pass.

This is the first owner demo gate. Do not migrate all units before it is
accepted.

### Milestone 4: curriculum and learner-model validation

Size: Medium

Work:

- extend the vertical slice to Units 1 through 3 and one kana unit;
- compare personal scheduling with authored review bins;
- tune response grading and session duration estimates;
- build course and memory progress views;
- implement bridge knownness reports;
- run five to eight learner sessions if possible;
- revise contracts based on evidence, with migrations.

Exit:

- beginner, returning learner, and offline flows are tested;
- session recipes finish close to their promised duration;
- learners can explain course versus memory state;
- no schema-breaking ambiguity remains before bulk migration.

### Milestone 5: A1 migration

Size: Large

Work:

- compile all authored A1 units;
- add Can-do and scene sidecars;
- add prompt eligibility and bridge coverage incrementally;
- preserve all current validators;
- lazy-load unit and audio packages;
- add content release manifests and compatibility checks;
- migrate current local progress.

Exit:

- all 49 current A1 units and all current prelude recognition units load and
  practice;
- stable IDs and unit order match the accepted source;
- content budgets and offline download sizes are known;
- no current curriculum quality check regresses;
- progress migration is idempotent and recoverable.

Do not claim every A1 unit has rich adaptive prompts until its metadata and
bridge are actually authored. Use visible content maturity states.

### Milestone 6: offline production hardening

Size: Medium

Work:

- service-worker update and rollback UX;
- content and audio download manager;
- storage quota and eviction behavior;
- offline error states;
- sync-ready immutable outbox;
- application telemetry and content-report path;
- install experience after demonstrated value.

Exit:

- airplane-mode acceptance passes;
- content updates never strand an active session;
- storage exhaustion has a recoverable path;
- no attempt is lost under reload, update, or interrupted audio.

### Milestone 7: optional accounts and sync

Size: Large

Work:

- Supabase local stack, migrations, generated types, and seeds;
- accessible auth;
- RLS policies and tests;
- guest-to-account merge;
- multi-device event sync and projection recompute;
- export, deletion, and privacy settings;
- threat model and recovery runbook.

Exit:

- account remains optional;
- two devices converge without duplicate attempts;
- offline edits sync after reconnection;
- every exposed learner row is protected by tested RLS;
- delete and export work end to end.

### Milestone 8: understanding and speaking expansion

Size: Large

Work:

- bridge library and graded story sequences;
- segment replay and caption fading;
- record-and-compare;
- shadowing;
- constrained speech-to-text spike;
- Japanese quality test corpus;
- tune knownness recommendations.

Exit:

- learners can move from a unit into a meaning-focused activity;
- audio support works without misleading scoring;
- support fading is recommended, never forced;
- accessibility alternatives exist for voice activities.

### Milestone 9: AI and native experiments

Size: Separate gated initiatives

AI gate:

- deterministic core is healthy;
- content retrieval and structured schemas exist;
- Japanese eval set and cost limits exist;
- privacy review is complete.

Native gate:

- PWA usage proves demand;
- concrete native gaps are documented;
- Capacitor spike validates audio, microphone, notifications, offline storage,
  and accessibility on iOS and Android.

Neither experiment may delay P0.

## Luna's first pull requests

Keep the first changes reviewable.

PR 1: workspace and baselines

- Node and workspace configuration;
- apps/learner-next placeholder;
- packages with empty public APIs;
- current app unchanged;
- baseline scripts and documentation.

PR 2: version-two contracts and Unit 1 adapter

- schemas and types;
- data adapter;
- lossless snapshot;
- learning event and memory contracts;
- tests only, no polished UI.

PR 3: mobile shell and design tokens

- routes;
- navigation;
- focused practice layout;
- themes and accessibility foundation;
- fixture data only behind a development adapter.

PR 4: real Unit 1 vertical slice

- content runtime;
- local database;
- session composer;
- prompt families;
- audio;
- feedback and resume.

PR 5: bridge and first production gate

- bridge scene;
- course and memory progress;
- offline cache;
- real browser acceptance and visual snapshots;
- owner demo notes and measured budgets.

Do not combine these into one giant PR.

## Quality and verification

### Required command groups

Preserve current commands while adding workspace equivalents.

Current protection:

    npm run validate:all
    npm run test
    npm run test:e2e
    npm run build

Kotoba Next target commands:

    npm run next:lint
    npm run next:typecheck
    npm run next:test
    npm run next:test:e2e
    npm run next:test:a11y
    npm run next:test:visual
    npm run next:validate:content
    npm run next:build

Final names may be simplified at cutover.

### Unit and property tests

- bin formula and current validators;
- content migration and stable IDs;
- answer normalization;
- attempt-to-grade mapping;
- scheduler test vectors;
- projection replay;
- session recipe duration and caps;
- sibling dispersion;
- knownness calculation;
- conflict merge;
- content package integrity;
- database migrations.

Use property-based tests for queue invariants, event deduplication, and
projection idempotence.

### Component tests

- onboarding paths;
- Today recipes;
- all prompt families;
- feedback ladder;
- token inspector;
- audio unavailable and permission states;
- settings and support fading;
- course and memory distinctions;
- download and update states;
- auth merge explanations.

### Real-browser end-to-end tests

Run Chromium plus representative WebKit coverage:

1. guest first session;
2. reload and resume;
3. complete a Unit 1 session;
4. delayed review seed and due session;
5. bridge unlock and comprehension;
6. offline launch and attempt;
7. content update during an inactive session;
8. keyboard-only practice;
9. screen-reader semantic smoke checks;
10. guest-to-account merge when sync ships.

### Visual matrix

At minimum:

- 390 by 844 mobile;
- 768 by 1024 tablet;
- 1440 by 900 desktop;
- light and dark;
- default and 200 percent text;
- reduced motion;
- long Japanese and English;
- open token detail;
- open bottom sheet;
- offline and error states.

### Content acceptance

- every current unit still passes legacy validation;
- every migrated encounter is lossless;
- prompt answers are deterministic;
- bridge knownness is measured;
- native or expert review signs off on new canonical Japanese;
- AI-generated drafts never bypass review;
- production audio and fallback status are explicit;
- content reports include version and exact object ids.

## Definition of done for P0

P0 is done only when:

- the new app, not a prototype screen, is the default production path;
- current A1 and prelude content loads through the new runtime without identity
  loss;
- a guest can learn, review, bridge, leave, return, and continue;
- attempts drive personal due state;
- curriculum bins still validate authored recurrence;
- course progress and personal memory are distinct and understandable;
- mobile practice starts above the fold and primary actions remain reachable;
- the active session works offline;
- current and new automated checks pass;
- real browser tests cover mobile and desktop;
- WCAG 2.2 AA checks have no known critical failure;
- performance budgets are met or exceptions are documented and approved;
- content update, migration, and rollback paths are tested;
- privacy, export, and deletion match the features actually shipped;
- current app is archived only after migration confidence;
- documentation matches the implementation.

## Migration and cutover

### Current progress import

Current state provides unit id, card positions, completed units, and settings.
Import it once into a migration event set:

- preserve the last active unit and approximate exposure position;
- mark prior cards as Seen, not remembered;
- treat completed units as curriculum exposure;
- seed personal memory with low-confidence availability, not mature mastery;
- ask whether the learner wants a short calibration or normal review;
- preserve display and audio preferences where mappings are unambiguous;
- keep the original localStorage payload as a recoverable backup until the user
  confirms the new app works.

### Cutover stages

1. Development-only next route.
2. Owner and tester opt-in.
3. Default for new guest profiles; existing users remain on current.
4. Migration prompt for existing users.
5. New app default with legacy escape hatch.
6. Archive legacy application after a defined stability window.

Every stage has rollback. Do not overwrite the current app at the start.

## Risks and mitigations

### Feature richness becomes feature soup

Mitigation:

- four primary destinations;
- one recommended Today action;
- progressive disclosure;
- P0 non-goals;
- each new feature must consume the shared learner model and improve a named
  loop.

### Personal SRS fights authored pedagogy

Mitigation:

- keep authored bins as content coverage;
- cap review share in new-learning sessions;
- session composer respects scene and first-exposure rules;
- separate Course and Review entry points while allowing a blended Today recipe;
- test learning outcomes, not only scheduler metrics.

### Too many skill dimensions create sparse data

Mitigation:

- begin with five evidence lanes;
- share priors carefully;
- show broad summaries;
- add dimensions only when they change selection or feedback;
- keep raw attempts so projections can evolve.

### Curriculum migration stalls product work

Mitigation:

- lossless adapter first;
- sidecar enrichment;
- Units 1 through 3 vertical slice;
- bulk migration only after contracts stabilize;
- visible maturity levels rather than pretending every unit has every feature.

### Offline and sync complexity overwhelms the build

Mitigation:

- local-only P0 core before remote sync;
- append-only events;
- deterministic projections;
- explicit outbox;
- account optional;
- provider boundary.

### AI reduces trust

Mitigation:

- ship after the deterministic core;
- label it;
- retrieve frozen sources;
- constrain vocabulary and scenario;
- log versions;
- evaluate Japanese;
- never make it required.

### Pronunciation scoring misleads learners

Mitigation:

- record-and-compare first;
- constrained recognition second;
- expert-reviewed test corpus before scoring;
- show actionable observations and confidence, not a magic percentage.

### Mobile polish harms desktop power

Mitigation:

- shared information architecture with distinct responsive composition;
- keyboard-first desktop acceptance;
- optional inspector panels;
- container-based components rather than one breakpoint stack.

### Existing dirty work is overwritten

Mitigation:

- start on a dedicated codex-prefixed branch or Luna worktree;
- preserve all current uncommitted curriculum and documentation changes;
- add side-by-side paths;
- never use destructive git cleanup;
- baseline and commit ownership before large moves.

## Decisions to approve before Luna starts

Recommended defaults are given so implementation can proceed unless the owner
chooses differently.

1. Repository: same repo, side-by-side next app. Recommended.
2. Platform: PWA first, Capacitor only after a validated need. Recommended.
3. Backend: local-only core, Supabase for optional sync. Recommended.
4. Motivation: rolling weekly rhythm, no punitive daily streak. Recommended.
5. AI: post-P0, grounded and optional. Recommended.
6. Visual lineage: evolve the current editorial green, cream, and rust identity.
   Recommended.
7. Monetization: deliberately undecided. Do not insert paywalls into the
   architecture; define entitlements only when a business model exists.
8. Analytics: minimal privacy-preserving product and learning events. Recommended.
9. Account: guest first and always usable without sign-in. Recommended.
10. Curriculum: preserve current ordering and IDs through the first vertical
    slice; evaluate sequencing separately. Recommended.

No answer is required to begin Milestones 0 through 2 if the recommended
defaults are accepted by silence. Any change to repository, platform, or
curriculum identity should be decided before contract implementation.

## Open product questions

These should be tested, not argued indefinitely:

- What is the right weekly-rhythm visualization?
- How many response types belong in a standard ten-minute session?
- Which support should fade automatically and which only by recommendation?
- How much deliberate production is appropriate in early A1?
- Should bridge scenes be unlocked by exposure, checkpoint evidence, or both?
- Is one long sentence stream still desirable on mobile, or should units expose
  smaller scene chapters while preserving the total authored repetitions?
- Which current A1 units have sufficiently coherent micro-worlds for bridges
  without editorial revision?
- When does kanji become a first-class scheduled object rather than a display
  attribute?
- Which analytics are essential before consent and account design are settled?
- What native capability, if any, is important enough to justify an app-store
  package?

## Handoff brief for Luna

Luna should treat this document as the implementation map and the research brief
as its rationale.

Before editing:

1. Read AGENTS.md and every current contract document referenced there.
2. Read this plan and the companion research brief.
3. Inspect git status and preserve the owner's extensive existing changes.
4. Run and record the current checks that are safe in the dirty tree.
5. Create or use a dedicated branch or worktree only with the owner's expected
   workflow.

During implementation:

- follow the milestone order;
- keep the current app runnable;
- protect stable curriculum IDs;
- put domain logic outside React;
- write migrations and tests with every persistent contract;
- show real mobile screenshots at the vertical-slice gate;
- document any departure from the recommended stack or product principles;
- pause for owner review after Milestone 3 before bulk A1 migration;
- do not add AI, social, or native scope early;
- do not interpret cutting edge as permission for unstable dependencies.

The first visible demo must be a real Unit 1 learning loop with persisted
attempts, varied retrieval, native audio, mobile-first practice, and a bridge
scene. A polished dashboard without that loop is not progress against this plan.

## 2026-08-12 lesson-player correction

Owner review established that the rebuild had drifted from Kotoba's core product
by turning an authored unit into a sampled ten-prompt quiz. That experiment is
retired for Course lessons. The shell remains, but the original lesson model is
the binding implementation contract:

- a Course lesson is the complete frozen authored card sequence;
- card order and IDs are preserved exactly;
- progress resumes at the exact saved card;
- Japanese, English, and hidden/audio-first are card faces, not separate quiz
  generators;
- Reading, Listening, Recall, and Rapid are presets over the same deck;
- those presets remain editable inside every lesson: default face, Japanese
  display, autoplay, audio language, auto-advance, order, delay, and appearance
  are persistent first-class controls;
- surface, kana, and romaji are live Japanese display modes;
- previous, next, random, flip/reveal, audio, and keyboard movement stay fast;
- word explanations, pronunciation, saving, and Hard/Learning/Easy tagging live
  in the token inspector;
- there is no typed-Japanese requirement, answer-check gate, or required
  self-grade in the core Course stream;
- Library filters may compose shorter cross-unit decks, but those decks use the
  same flashcard player.

This decision supersedes the Quick/Standard/Deep sampled-session design for the
Course entry point and the handoff sentence above that required varied retrieval
inside the first visible Unit 1 demo. Retrieval exercises may return later as
optional tools, but they cannot replace or interrupt the authored card stream.
