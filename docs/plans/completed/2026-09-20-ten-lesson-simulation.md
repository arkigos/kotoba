# Ten lessons across four weeks

Request: generate and complete ten fresh lessons, assess tasteful review, measure
new/older/recent vocabulary appearances, personally inspect every card, and deliver
a presentation. The user clarified the second part: continue completed topics with
fresh words and numbered lesson titles. Implemented and tested as Next lesson.

1. Start an isolated empty profile. Generate automatic six-target topic lessons
   on days 0, 1, 3, 6, 9, 12, 16, 19, 24 and 28, returning to interests across weeks.
2. Complete each materialized card using production practice functions, with
   elapsed time per card. Verify persistence, unknown-word gates and timer changes.
3. Classify at lesson start: new, older familiar (at least seven days since last
   practice), recent familiar (under seven days). Separately report due status,
   selected review versus incidental helpers, and first-introduction age.
4. Read every full bilingual sequence. Fix demonstrated engine defects, retain
   baseline evidence and rerun the same schedule from scratch after changes.
5. Report per-lesson and per-word appearances, card mix, saturation, deferred due
   words and practical limits. Create and visually inspect an editable presentation.

Do not replace real learner history with simulation data or call exposure mastery.

Completed:

- Preserved baseline and two intermediate runs; repaired automatic pairing scope
  and authored contextual school responses in engine 1.9.0.
- Final ten-lesson run: 314 cards, 52 introduced words, 28 simulated days. Read
  every final bilingual card. 91.1% of cards contain new words; eight appearances
  per selected review target. Reported the remaining 33 due words and lesson 9's
  weaker variety without treating exposure as mastery.
- Added separate numbered Next lesson behavior to completed topic lessons, with
  fresh targets, preview, independent saved identity and no preview practice credit.
- All 463 learner tests passed, including ten lessons through the actual React
  player. Both learner-next and root production builds passed.
- Live isolated browser: completed Food study, generated/read Food study 2,
  verified both persisted after reload. Existing user profile left intact.
- Produced and visually checked all 12 editable presentation slides. Full results:
  `docs/reviews/2026-09-20-ten-lessons/REPORT.md` and `output/Kotoba-ten-lessons.pptx`.
