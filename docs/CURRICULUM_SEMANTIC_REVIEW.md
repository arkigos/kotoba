# Curriculum Semantic Review

Mechanical validation is necessary but not sufficient. After generation and
scripted audits pass, Codex should perform a language-model review pass on a
human-readable unit packet before the curriculum is considered accepted.

## Command

Generate a review packet for a unit:

```sh
npm run review:unit -- --unit 1
```

The packet is written to `docs/reviews/unit_001_semantic_review.md`.

Generate review packets for every standard authored unit:

```sh
npm run review:all
```

Run the semantic smoke-test audit and write the aggregate report:

```sh
npm run audit:curriculum-semantics
```

The aggregate report is written to `docs/reviews/semantic_audit_summary.md`.

`docs/reviews/` is generated review output and is ignored by default. Commit a
review packet only when it captures a durable editorial decision that should be
kept with the project docs.

## Codex Review Prompt

Ask Codex to review the generated packet with this standard:

> Review this unit as a Japanese curriculum editor, not as a schema validator.
> Find exact repeats, near repeats, fake variety, unnatural pairings, weak
> sentences, bad pacing, overuse of particles, and places where SRS words are
> technically covered but not meaningfully integrated. Suggest concrete card or
> generator changes, not just comments.

## What Codex Must Judge

- Whether each card is useful Japanese, not merely valid Japanese.
- Whether `ka`, `ne`, and `yo` are taught intentionally rather than used to
  disguise repeated sentences.
- Whether repeated practice changes the semantic work: subject, object, action,
  place, time, polarity, role, or discourse purpose.
- Whether first exposures are gentle without becoming inert glossary rows.
- Whether review words are integrated with known helper words in natural
  constructions.
- Whether the unit has a coherent scene or micro-world.
- Whether the unit has obvious learner fatigue points, such as long runs of the
  same frame.

## Hard Rules

- Exact duplicate Japanese card lines inside a unit are not allowed.
- Do not fix duplicate lines by appending `ne`, `yo`, `ka`, or punctuation.
- Final particles may appear when the unit or source phrase actually teaches
  them, but they do not count as semantic variety by themselves.
- A review card should be bolder than a first exposure card, because the learner
  already knows the due word.
