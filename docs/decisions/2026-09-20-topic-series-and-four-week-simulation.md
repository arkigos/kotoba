# Numbered topic continuation and longitudinal lesson checks

Date: 2026-09-20

Completed topic lessons offer **Next lesson**. It builds from current actual practice history, keeps the topic, core/extra pool and target count, and requires unseen targets. The new lesson receives an independent ID, frozen cards and a numbered title. It opens in the full preview before practice. Replay retains the old cards; Remake retains the old selection. Neither silently advances a series.

Optional `ActiveSession.topicSeries` stores `{ rootId, baseTitle, number }`. The initial unnumbered topic lesson acts as number 1. Subsequent numbers use the highest family number in active/recent and recoverably cleared lessons. Existing version-3 profiles need no migration. Preview/save never grants practice credit. Eligibility requires actual completion and at least one unintroduced word in the same pool.

The automatic topic selector now builds pairing candidates from up to 30 ranked new words and 10 ranked review words, rather than only the first final quota. This lets it see complementary verbs while retaining the first three new queue priorities and normal target/review limits. The final generation vocabulary gate is unchanged: selected targets, actual practiced words, and explicitly authored function forms only. School response frames provide clean yes/no senses and understanding contexts. Personalized engine version is 1.9.0.

`scripts/simulate-learner-weeks.mjs` exercises ten lessons over 28 simulated days using production practice and storage functions. It classifies lexical appearances at lesson start as new, older familiar (at least seven days since actual practice), or recent familiar. Age groups are distinct from due status. Count one canonical word per card; report card mix separately. Read entire generated sequences in addition to running invariant checks.

The final run produced 314 cards, 52 introduced words, 443 new / 141 older / 92 recent appearances, and 28 familiar-only cards. All eight selected review targets were due and appeared eight times. Thirty-three words remained due afterward: mixed topic lessons alone did not service the complete review queue. Exposure is not evidence of retention or mastery. Lesson 9 remained the weakest for topic cohesion and variety; preserve that qualification with the results.

Evidence: `docs/reviews/2026-09-20-ten-lessons/REPORT.md`, final per-card packets/CSV/JSON, and the editable twelve-slide presentation. Generated evidence is locally retained under the existing ignored reviews directory. Durable regression coverage is in `apps/learner-next/tests/next-topic-lesson.test.tsx`, including actual player consumption across all ten lessons and UI continuation/persistence.
