# Kotoba Next: Product, Learning, and Platform Research

Date: 2026-08-11

Status: Research brief for the proposed Kotoba Next rebuild

Companion plan: docs/plans/active/2026-08-11-kotoba-next-rebuild.md

## Executive synthesis

Kotoba should not try to win by becoming a larger collection of disconnected
exercise types. The strongest opportunity is to become the continuity layer
between four things that Japanese learners currently assemble from separate
products:

1. a trustworthy, structured course;
2. efficient personal review;
3. comprehensible reading and listening;
4. safe, guided production.

Kotoba already owns the hardest and least visible part of that proposition: an
inspectable curriculum model, stable content identities, long authored sentence
streams, token-level explanations, cumulative vocabulary and grammar, semantic
quality checks, and an offline audio pipeline. The next app should turn those
assets into a learner model and a fluid mobile experience rather than discarding
them for generic quizzes.

The market repeatedly separates curriculum from memory, memory from context,
and context from speaking. Community discussion repeatedly asks for one place
that knows what the learner knows, makes every word inspectable, connects study
to real content, and does not make the learner manage a pile of decks and apps.
At the same time, experienced learners warn that an all-in-one product becomes
shallow or overwhelming when every feature is equally prominent. The design
answer is not feature maximalism. It is a small number of coherent surfaces
powered by one shared knowledge graph.

The proposed product thesis is therefore:

> Kotoba is the Japanese learning app that remembers what you know, surrounds
> every new idea with comprehensible sentence worlds, and steadily turns
> recognition into real understanding and usable Japanese.

## Method

This brief combines:

- a repository audit of the active Vite app, curriculum source model, frozen
  units, validators, quality rules, tests, and completed product decisions;
- a visual audit of the running app at desktop and 390 by 844 mobile sizes;
- official product material from broad language apps and Japanese specialists;
- recent learner discussions, used as qualitative signals rather than a
  representative survey;
- primary research, meta-analyses, and standards material;
- current official platform and web-standard documentation.

Community posts are anecdotes and can be selection-biased. Vendor efficacy
claims are treated as product signals, not independent proof. Research findings
are translated into design principles conservatively; no single paper dictates
the product.

## Current Kotoba audit

### Durable advantages

- The product is sentence-first, not an isolated word list.
- Curriculum is frozen, versionable, locally inspectable data.
- Stable word and card identities support durable progress and media links.
- New vocabulary, due review vocabulary, and free helper vocabulary are
  explicitly separated.
- Grammar and vocabulary are cumulative.
- Current-unit material has authored pacing and exposure bands.
- The relative review-bin rule guarantees that old material returns in authored
  units even without personal scheduling.
- Tokens align surface, reading, explanation, vocabulary identity, and optional
  audio.
- Semantic checks go beyond schema validity and reject duplicates, fake variety,
  sterile identity frames, implausible pairings, and review tails.
- Production audio is offline-capable and falls back gracefully.
- The current interface is unusually calm for the category. Desktop practice is
  readable, direct, and not crowded by images, ads, currencies, or leaderboards.

### Current constraints

- src/App.tsx is 1,110 lines and src/styles.css is 1,279 lines. Product domains,
  navigation, audio, settings, dictionary, progress, and practice orchestration
  are concentrated in one component and one stylesheet.
- Progress is localStorage state centered on unit and card positions,
  completions, and display settings. It does not record attempts, recall
  quality, latency, hints, skill dimensions, or personal due dates.
- A card position is treated as progress even when no retrieval occurred.
- The curriculum-level bin schedule is valuable authoring discipline, but it
  cannot react to an individual learner.
- Practice is primarily exposure and reveal. It offers limited evidence that a
  learner can retrieve, discriminate, listen, or produce.
- The test named end-to-end is a jsdom component flow, not a real browser test.
- There is no route-level architecture, offline application shell, installation
  flow, account sync, event model, or observability contract.
- The current app loads as a tool but has no strong daily entry decision: resume
  a unit, clear due work, repair a weak skill, or bridge into a story.

### Visual audit

Desktop strengths:

- strong Japanese hierarchy;
- a quiet visual field;
- obvious next, previous, reveal, and audio actions;
- a compact course summary;
- useful token click targets and supporting information;
- no marketing-page detour.

Mobile findings at a 390 by 844 viewport:

- the course rail becomes a 516px-tall block before practice;
- the practice panel starts below the first viewport;
- the primary practice controls begin roughly 1,264px from the top;
- the page is roughly 1,648px tall before settings or vocabulary are opened;
- desktop keyboard hints survive into the constrained mobile layout;
- unit metadata and management controls win the first screen over the sentence.

This is why the next design must begin from the mobile session, safe areas, and
thumb zones. Reordering a few media queries will not solve the information
architecture.

## Product landscape

| Product or pattern | What it does especially well | What Kotoba should learn | What Kotoba should avoid |
| --- | --- | --- | --- |
| Duolingo | Extremely low-friction sessions, visible path, habit mechanics, polished interaction feedback, personalized practice | Make the next useful action obvious and make a two-minute start possible | Punitive hearts, anxiety-driven streaks, opaque course reshuffles, and optimizing easy XP over learning |
| Babbel | Adult tone, contextual dialogue, explicit review, active recall, speech feedback | Keep practice practical and explanations concise; connect review to situations | Generic multi-language pedagogy that ignores Japanese-specific script and grammar needs |
| Busuu | Goal and deadline planning, short lessons, community correction, level checkpoints | Let goals shape session recipes and use Can-do checkpoints | Making important study and review structures depend on social participation |
| LingoDeer | Japanese-aware curriculum, grammar notes, script-display choices, native audio, offline lessons, varied review | Preserve language-specific design and progressive script support | Stopping at a polished beginner course without a strong bridge to authentic content |
| WaniKani | Strong identity, reliable daily queue, memorable kanji decomposition, individual scheduling | Make due work legible and keep stable learning-object identities | Large review debt, isolated recall, and a rigid one-speed path |
| Bunpro | Grammar SRS, manual production, alternate-answer handling, many contextual examples, graded reading | Schedule grammar as well as words and rotate context on review | Turning the home screen into an intimidating review counter or exposing excessive configuration early |
| Renshuu | Exceptional Japanese depth, per-component mastery, knowledge-aware display, flexible paths, community, varied prompts | Track what the learner knows once and reuse it everywhere | Surface-area overload, settings sprawl, and older information architecture |
| MaruMori | Coherent world, handcrafted course, grammar homework, kanji in context, strong visual personality | A light narrative frame can make a serious course inviting | Letting the world map or collectibles obscure the sentence and the objective |
| Satori Reader | Human annotation, context-selected definitions, sentence audio, grammar notes, knowledge-aware kanji display | Build a controlled-to-graded reading bridge with explanations on demand | Static stories that do not respond to the learner or stories whose subject matter feels like homework |
| LingQ | Known-word tracking across content, import, context, content just above the learner | A shared known-state model can power discovery and difficulty | A noisy reader and premature dependence on user-imported content |
| Migaku and sentence mining | Turns personally meaningful media into study, tracks known words, links video context to cards | Later, let external encounters feed the same learner model | Making browser tooling, OCR fragility, and manual card management the beginner experience |
| Speak and AI tutors | Low-stakes voice practice, immediate response, flexible scenarios | Add bounded, curriculum-grounded role-play after the core is trustworthy | Treating unconstrained model conversation or a noisy pronunciation score as curriculum truth |
| Anki and FSRS | Efficient personal scheduling, portability, transparent history, algorithmic maturity | Use a proven scheduler and retain an append-only review log | Ask learners to author decks, grade every exposure manually, or study decontextualized fronts and backs |

## What learners are signaling

Recent Japanese-learning discussions converge on several needs.

### One knowledge state, not necessarily one giant app

Learners dislike re-teaching each app what they know. They want vocabulary,
kanji, grammar, reading, listening, and output to share a central state.
Experienced learners are skeptical that one product can be best at every
activity. Kotoba can reconcile these positions by being one coherent learning
system with focused modules, clean export, and future interoperability.

### Context is the difference between remembering and using

Repeated complaints about flashcards are not usually objections to spacing.
They are objections to learning a translation pair that never becomes usable.
Learners praise sentence audio, varied contexts, clickable tokens, and content
where known words reappear in new combinations. This aligns directly with
Kotoba's existing sentence-world approach.

### The beginner-to-real-content bridge is a major gap

Structured apps feel safe but eventually artificial. Native content feels
meaningful but arrives with too many unknowns. Graded stories, knowledge-aware
display, captions, contextual dictionaries, and a visible known-word percentage
are repeatedly valued. Kotoba can make each completed unit unlock a short
authored bridge scene that reuses its exact lexicon and grammar.

### Speaking is desired but psychologically and technically difficult

Learners report that reading recognition does not automatically become
retrieval in conversation. Low-stakes shadowing, constrained responses, and
gentle correction are valuable. They also distrust incorrect Japanese TTS and
false-precision pronunciation scores. Kotoba should begin with native audio,
record-and-compare, paced shadowing, and constrained utterances before claiming
phoneme-level assessment.

### Trustworthy material matters more in the AI era

Learners distinguish expert-reviewed content from generic generated material.
AI can help explain, vary, or role-play, but canonical curriculum should remain
versioned, reviewed, and testable. Any generated learner-facing Japanese must be
grounded, labeled, and evaluated.

### Gamification helps some people and repels others

Habit cues and a pleasant sense of progress are useful. Punishing mistakes,
competitive leagues, energy systems, manipulative notifications, and fragile
streaks create anxiety or encourage low-effort maintenance. Learners should be
able to choose a quiet experience. Kotoba should reward meaningful effort and
recovery, not perfect attendance.

## Learning-science implications

### 1. Exposure must turn into retrieval

Practice testing and distributed practice have high utility across learners and
tasks. Repeated retrieval produces stronger long-term retention than repeated
study alone. Kotoba should retain fluent exposure, but each session needs
moments where the answer is not already visible.

Product rule:

- every important learning object moves through recognition, supported recall,
  independent recall, and contextual application;
- reveal is a hint or study event, not evidence of mastery;
- successful delayed retrieval carries more evidence than an immediate retry.

### 2. Spacing should be personal and retention-aware

Spacing has a medium-to-large effect in second-language learning, and longer
gaps matter more on delayed outcomes. The current review-bin rule should remain
an authoring guarantee, while a personal scheduler decides what each learner
needs today. The two systems solve different problems and should coexist.

Product rule:

- authored bins guarantee curricular recurrence;
- personal scheduling tracks learning objects and skill dimensions;
- a session composer chooses a fresh authored context for due objects;
- users see workload and may lower new material without losing progress.

### 3. Repetition needs semantic variation

Vocabulary encounters help, but effects depend on spacing, engagement, visual
support, and contextual range. Exact repeats and cosmetic particle swaps create
familiarity without flexible knowledge. Kotoba's existing variety rules are a
product advantage and should become runtime selection constraints.

Product rule:

- repeat the target, not necessarily the whole prompt;
- rotate role, polarity, place, time, register, modality, and response type;
- space sibling prompts so a single sentence is not memorized as a shape.

### 4. Feedback should be immediate enough to guide, not so eager that it
removes retrieval

Retrieval with corrective feedback outperforms unguided failure. Effective
feedback identifies the relevant contrast and gives another chance.

Product rule:

- first response: correctness plus the smallest useful cue;
- second response: token or grammar contrast;
- final response: full answer and one nearby transfer item;
- never punish the learner by removing access or adding debt for a mistake.

### 5. Listening benefits from captions and controlled fading

Captioned target-language video and audio show substantial benefits for
listening comprehension and vocabulary. The important product opportunity is
not simply an always-on transcript; it is support that fades as evidence grows.

Product rule:

- allow Japanese captions, token highlights, slow replay, segment replay, and
  transcript reveal;
- recommend fading furigana, romaji, and captions based on demonstrated skill;
- preserve learner control and never hide support as punishment.

### 6. Motivation should support autonomy, competence, and relatedness

Gamification can improve motivation, especially when it supports choice and a
sense of growth. Reward-only systems can create controlled motivation. Kotoba
should show competence and make consistency pleasant without coercion.

Product rule:

- replace a brittle daily streak with a rolling weekly rhythm and recovery;
- celebrate Can-dos, delayed recall, and completed meaningful sessions;
- make leaderboards and social pressure non-goals;
- let the learner choose time, intensity, modality, and quiet mode.

### 7. Can-dos should drive language content

The Japan Foundation's Marugoto model makes communication in real situations
the goal and selects language structures in service of those Can-dos. Kotoba's
current grammar map is useful, but the next data model should make Can-do,
scene, and skill outcomes first-class rather than learner-visible grammar being
the only spine.

Product rule:

- every unit has one or more observable Can-do outcomes;
- grammar and vocabulary support a situated task;
- unit completion means demonstrated evidence, not merely reaching the last
  sentence.

## Opportunity map

### Table stakes for a serious 2026 product

- account-optional onboarding and instant guest use;
- mobile-first navigation and touch targets;
- light, dark, reduced-motion, and large-text support;
- installable PWA with a useful offline state;
- reliable audio controls, background-safe state, and downloadable units;
- personal review queue and transparent progress;
- accessible keyboard and screen-reader paths;
- real browser end-to-end tests;
- sync, export, deletion, and privacy controls when accounts ship;
- performance and error observability.

### Differentiators Kotoba can credibly own

1. Contextual SRS: schedule the learning object, then retrieve it through varied
   authored sentences rather than one frozen flashcard.
2. Sentence worlds: a coherent micro-scene develops across a unit instead of a
   shuffled theme list.
3. Known-State Engine: the same learner state controls furigana, explanation
   depth, sentence difficulty, story eligibility, and review choice.
4. Bridge scenes: every unit culminates in a short dialogue or reading made
   overwhelmingly from known material.
5. Explainable personalization: a learner can ask why an item appeared and see
   due state, recent mistakes, or the Can-do it supports.
6. Mastery as evidence: progress separates exposure, reading, listening,
   recognition, and production rather than compressing everything into XP.
7. Quiet motivation: a beautiful, warm product that supports a weekly rhythm
   without guilt mechanics.
8. Trusted AI boundaries: optional role-play and help grounded in frozen
   curriculum, never invisible AI curriculum generation.

## Platform findings

- React 19.2 is the current stable React line and the React team publishes
  patched releases within that line.
- Vite 8.1 is the current supported Vite line and uses Rolldown as its unified
  bundler.
- Node 24 is the current LTS line; Node 20 is end-of-life.
- TypeScript 6.0 is current and is a transition toward the native TypeScript
  toolchain.
- A PWA can provide installability, offline assets, and IndexedDB-backed local
  data while remaining a normal web application.
- Capacitor can add iOS and Android store delivery and native APIs to a web-first
  application without forcing a second UI implementation.
- WCAG 2.2 adds important criteria for target size, unobscured focus, accessible
  authentication, and non-drag alternatives.
- Current Core Web Vitals targets remain LCP at or below 2.5 seconds, INP at or
  below 200 milliseconds, and CLS at or below 0.1 at the 75th percentile.

The implication is a PWA-first architecture with explicit native seams, not an
immediate React Native rewrite. Kotoba is primarily typography, audio, local
data, forms, and responsive interaction: a strong fit for the web platform.
Capacitor remains a later packaging option if background audio, notifications,
app-store discovery, or native speech APIs justify it.

## Source catalog

All sources were accessed on 2026-08-11.

### Product and curriculum sources

- [Duolingo home-screen and Practice Hub design](https://blog.duolingo.com/new-duolingo-home-screen-design/)
- [Duolingo streak experiment](https://blog.duolingo.com/improving-the-streak/)
- [Babbel method](https://www.babbel.com/how-babbel-works)
- [LingoDeer official product page](https://www.lingodeer.com/)
- [Bunpro features and pricing](https://bunpro.jp/pricing)
- [Bunpro graded reading practice](https://bunpro.jp/support/using-bunpro/Reading-Practice)
- [WaniKani method](https://www.wanikani.com/)
- [Renshuu Google Play product description](https://play.google.com/store/apps/details?id=com.renshuu.renshuu_org)
- [MaruMori product and method](https://marumori.io/)
- [Satori Reader intelligent features](https://www.satorireader.com/features)
- [LingQ Japanese](https://www.lingq.com/en/learn-japanese-online/)
- [Migaku features](https://migaku.com/faq/features)
- [Speak curriculum quality process](https://help.speak.com/en/articles/11396732-how-does-speak-curate-its-content-and-curriculum)
- [Japan Foundation Marugoto concept and features](https://marugoto.jpf.go.jp/en/teacher/feature/)
- [Japan Foundation JF Standard](https://www.jfstandard.jpf.go.jp/pdf/web_whole_en.pdf)

### Learning research

- [Dunlosky et al., effective learning techniques](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html)
- [Cepeda et al., spacing and retention intervals](https://pubmed.ncbi.nlm.nih.gov/19076480/)
- [Karpicke and Roediger, critical importance of retrieval](https://doi.org/10.1126/science.1152408)
- [Kim and Webb, spaced practice in second-language learning](https://onlinelibrary.wiley.com/doi/abs/10.1111/lang.12479)
- [Uchihara et al., repetition and incidental vocabulary learning](https://onlinelibrary.wiley.com/doi/10.1111/lang.12343)
- [Montero Perez et al., captioned video for listening and vocabulary](https://www.sciencedirect.com/science/article/pii/S0346251X13001012)
- [Retrieval practice with corrective feedback in vocabulary learning](https://www.tandfonline.com/doi/abs/10.1080/14790718.2022.2102172)
- [Gamification, intrinsic motivation, autonomy, and relatedness meta-analysis](https://link.springer.com/article/10.1007/s11423-023-10337-7)
- [Self-determination interventions in education meta-analysis](https://selfdeterminationtheory.org/wp-content/uploads/2024/06/2024_WangWangEtAl_MetaEdu.pdf)
- [FSRS open-source project and research links](https://github.com/open-spaced-repetition/fsrs4anki)
- [Open spaced-repetition benchmark](https://github.com/open-spaced-repetition/srs-benchmark)

### Community signals

- [All-in-one Japanese app discussion, June 2026](https://www.reddit.com/r/LearnJapanese/comments/1u86utj/is_there_an_allinone_app/)
- [Ideal Japanese study app discussion](https://www.reddit.com/r/LearnJapanese/comments/18ajri7/what_would_be_your_ideal_study_app/)
- [Dream Japanese app and central learner model discussion](https://www.reddit.com/r/LearnJapanese/comments/1jm3czp/what_is_your_dream_nonexistent_japanese_learning/)
- [Japanese app recommendations and beginner-to-immersion discussion](https://www.reddit.com/r/LearnJapaneseNovice/comments/1knxi92/best_apps_to_learn_japanese_in_2025/)
- [Immersion for beginners](https://www.reddit.com/r/LearnJapanese/comments/1ppyhzl/immersion_for_beginners/)
- [Japanese app frustrations, audio, and output](https://www.reddit.com/r/Japaneselanguage/comments/1sflaed/what_app_are_you_using_to_learn_japanese_and_what/)
- [Renshuu appreciation and workflow](https://www.reddit.com/r/LearnJapanese/comments/1b3p3en/appreciation_post_and_quick_guide_to_renshuu/)
- [Gamified-app motivation tradeoffs](https://www.reddit.com/r/languagelearning/comments/14a2pze/gamified_language_learning_apps_do_they_truly/)
- [Streaks versus meaningful study](https://www.reddit.com/r/languagelearning/comments/1pe0qsj/i_dont_think_gamification_and_streaks_helps_with/)

### Platform and standards

- [React 19.2](https://react.dev/blog/2025/10/01/react-19-2)
- [React current versions](https://react.dev/versions)
- [Vite 8.1 announcement](https://vite.dev/blog/announcing-vite8-1)
- [Node release status](https://nodejs.org/en/about/previous-releases)
- [TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)
- [Progressive Web Apps](https://web.dev/learn/pwa/welcome)
- [Capacitor official documentation](https://capacitorjs.com/docs)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [Apple 44-point touch-target guidance](https://developer.apple.com/design/tips/)
- [Dexie React and IndexedDB](https://dexie.org/docs/Tutorial/React)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase local migrations](https://supabase.com/docs/guides/local-development/overview)

## Research questions to validate with real learners

The research narrows the product, but it does not replace user testing. Before
large-scale implementation, test these assumptions with five to eight learners
spanning true beginner, late beginner, and early intermediate:

1. Does a Today screen reduce decision fatigue compared with opening directly
   into the last unit?
2. Do learners understand the difference between course progress and personal
   memory strength?
3. Is a rolling weekly rhythm motivating without feeling evasive or vague?
4. Which answer modes feel effortful in a useful way on a phone?
5. When should furigana and captions fade, and how much learner control is
   required?
6. Does the bridge scene feel like a payoff or another test?
7. Can learners understand why a sentence was selected without reading
   scheduling jargon?
8. Is record-and-compare useful before automatic pronunciation scoring?
9. Which current visual traits feel distinctly Kotoba and should survive?
10. What would make a learner trust or distrust an optional AI role-play mode?
