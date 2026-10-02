# Kotoba

A local-first Japanese course with fixed, curated topic lessons, integrated grammar,
and review inside each topic. Choose a topic, work through its ordered lessons,
and return to its exact practiced sentences.

The active app is `apps/learner-next/`. A1 covers all 750 words in its bounded
study pool through five foundations and 14 ordered chapters. A2 covers all 1,250 words in 23 topics;
B1 is in progress; B2–C2 remain to be authored. Unfinished levels cannot be marked complete. The
review packet records current coverage and every remaining vocabulary gap.

```sh
npm run dev
npm run build
npm run test
npm run next:test
npm run validate:curated
npm run dictionary:validate-pools
npm run curriculum:review-curated
```

[Course contract](docs/decisions/2026-09-26-curated-topic-course.md) ·
[Curriculum review packet](docs/reviews/2026-09-26-curated-course/README.md) ·
[Architecture](docs/ARCHITECTURE.md) · [Quality checks](docs/QUALITY.md)

The 25,000-entry bounded study dictionary is separate from the full JMdict
reference. Existing learning IDs, saved cards and pronunciation recordings are
preserved. See [dictionary architecture](docs/decisions/2026-09-12-canonical-dictionary.md)
and [audio operations](docs/ASSET_PIPELINE.md). New recordings use the dictionary
audio command to deduplicate paid requests.

The original frozen-unit player runs with `npm run reference:dev` and builds with
`npm run reference:build`. The old CRA/Express prototype and retired procedural
course acceptance tests are archived under `archive/`.
