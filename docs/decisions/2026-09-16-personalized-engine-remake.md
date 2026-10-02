# Personalized engine and explicit remake

Reading actual saved lessons exposed defects that coverage tests missed: long
standalone-word runs, immediate repeats, long return gaps, dictionary glosses in
sentences, and generic subject/verb combinations without sensible meanings.
The requested repair is to the engine, followed by regeneration of the lessons.

Topics and Custom now share `packages/learning-engine/personalized.ts`. Candidates
come from reviewed lexical senses and grammatical realization, plus explicit
argument frames in `personalized-frames.ts`. Frozen curriculum cards are no longer
mined as if they were individually reviewed context. Imported dictionary POS does
not license a new sense or grammatical use. Unsupported targets remain exact word
cards. Required unfamiliar supporting words must first be explicit targets.

Verb arguments and adjective subjects need semantic restrictions beyond syntax.
For example, understanding a language uses が; working in a country uses で;
きれい with a person uses the beautiful sense, while its clean sense has an explicit
subject domain. New/old senses exclude food and drink. Candidate enumeration keeps
simple contexts alongside combinations covering several targets.

The scheduler retains actual coverage and the introduction prefix, then spreads
revisits through the lesson with short substitution runs. Continuous one-word
changes are not worth a long absence of another target. Review the resulting
sequence rather than treating a transition percentage as teaching quality.

My lessons > More > Remake reruns the engine with the same selected IDs and title.
It keeps shelf identity, saved status, source/topic/mode, and all practice history;
the new session starts at card zero with no earned credit and a fresh recommended
length. Failure keeps the old lesson. Loading/resuming never mutates an existing
snapshot. New lesson plans record the generator version for diagnosis.

Verification combines mechanical admission/coverage/replay checks, regression
fixtures derived from observed defects, and a complete bilingual reading of the
actual remade lesson. Synthetic fixtures record their own known-word sets and must
not be described as exact replicas of a fuller user profile. The engine's reviewed
construction coverage is finite; a passing audit cannot certify all possible
language combinations.

## Follow-up: the next actual family selection

The next saved family lesson selected `doko` and `dochira-kara`, exposing repeated
phrase/word alternation. Different standalone entries now form boundaries, never
inferred sentence substitutions. The engine supplies licensed `doko` questions
(including locating family members) with only available words and authored grammar.
Scheduling tracks exact bilingual-card recency as well as target recency, and
reserves room for remaining copies so a fixed phrase cannot pile up at the end.
Generator version 1.1.0 records this change. The new regression exercises both
Topic creation and Custom/remake with the actual target set.

## Follow-up: Food and Work

Reading two other actual topic lessons exposed missing sentence coverage for food
nouns and temporal/work vocabulary. Version 1.2.0 adds reviewed food identification,
questions, buying/wanting, and time/day work/rest/return constructions. These use
reviewed sense phrases and authored adverbials; a new verb is never silently
introduced. Generic 国 is not used as an unspecified motion destination.

Introduction ties prefer fewer already introduced targets, preventing a shared
verb from consuming its allowance while noun targets are introduced. Revisit
scheduling penalizes targets far ahead of their expected share, increases urgency
for overdue returns, and discourages more than four successive cards in one frame
when alternatives exist. Target counts and selected IDs remain unchanged.

## Follow-up: Around town and travel

Version 1.3.0 retains compact construction keys when materializing grammar-engine
cards, and labels reviewed identity/photo/place frames explicitly. A shared token
shape does not prove a shared construction: `place は near です` and `country-name
は country です` must not be rewarded as one substitution exercise. Old snapshots
still replay without acquiring inferred metadata.

The nearby sense and landmark question/identification generation share an explicit
reviewed landmark domain. Generic country is outside that domain. Photograph-of-
place frames connect photo vocabulary to landmarks; identification/question frames
give place nouns contexts without exhausting selected motion verbs. Known personal
pronouns can support country-identification statements/questions, with factual
category statements retained only when the personal frame is unavailable.

Learning: strict vocabulary admission, syntactic validity, useful context coverage,
and honest transition structure are separate requirements. Passing any one is not
evidence that the other three are satisfied. Full sequence reading remains needed.
