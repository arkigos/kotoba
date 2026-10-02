# Bounded vocabulary pools by level

## Decision

Use disjoint curriculum pools of 753 A1, 1,264 A2, 3,005 B1, 5,000 B2,
6,999 C1, and 7,998 C2 entries: 25,019 cumulative words and expressions.
These are product budgets, not validated Japanese CEFR thresholds. The
[JF Standard](https://www.jfstandard.jpf.go.jp/summaryen/ja/render.do) describes
communicative ability rather than word-count thresholds.

The initial B1/C2 budgets were 3,000/8,000. A reviewed transfer may adjust
the affected budgets while preserving the total dictionary membership. Do not
push unrelated words into later levels just to preserve round counts. The
[vocabulary transfer review](2026-09-26-reviewed-level-transfers.md) records
the overnight and distance changes, the musical-verb correction, and their
compatibility checks.

The original 25,000 total is an editorial baseline, not a reason to omit a
demonstrably missing everyday word or evict an unrelated existing identity.
Reviewed additions may increase the bound explicitly, with a recorded reason,
exact membership comparison, appended authoring addresses and complete teaching
coverage at any already-authored level. This does not authorize bulk expansion
to the reference dictionary. The first additions under this rule are 先 and 石 in A2, followed by 一日
（いちにち）and ゼロ in A1; all 25,000 preceding identities retain their levels.

A1 membership is explicitly authored. Its 104 introductory, 190 foundation, and
459 topic-expansion entries distinguish first encounters from the whole level.
Later pools use pinned community learning-order evidence, source frequency,
usage flags, and reviewed priorities. Their placements remain provisional.
Ranks describe selection order, not a complete lesson sequence.

Prefer ordinary vocabulary before redundant borrowed alternatives. Retain
practical loans such as ホテル and コンビニ; do not substitute superficially
similar words that describe different things. Apply a mild ranking penalty to
nonessential katakana entries and a stronger penalty to explicitly reviewed
redundant alternatives. Cap katakana entries at 15% per level. This is an initial
editorial guardrail, not a linguistic finding. Overflow stays in the reference
library rather than being assigned a falsely advanced level. Katakana detection
does not identify every loanword or prove English origin.

## Ownership and compatibility

- `data/jp/dictionary/study-pool-policy.json`: budgets, exact reviewed identities,
  priorities, exclusions, display choices, and contextual synonym preferences.
- `scripts/build-study-pools.py`: deterministic builder, with source checksum
  verification and fail-closed identity/count checks.
- `data/jp/dictionary/study-pools.json`: canonical membership by level.
- `public/dictionary/jp/study-index.json`: independently lazy-loaded browse rows.
- `docs/reviews/2026-09-21-level-pools/`: all selections, reasons, full A1 review,
  and reproducible samples of later levels.

This curriculum scope is separate from historical dictionary estimated levels
and the existing 450-concept A1 course. Keep their identifiers, frozen lessons,
practice history, and generation eligibility unchanged. Dictionary → Study pools
exposes the new placements explicitly; ordinary reference browsing keeps its
existing labels. Pool membership never makes an unknown word an allowed helper.
Sentence support must still be authored and verified independently.

Regenerate with `npm run dictionary:pools`; verify reproducibility with
`npm run dictionary:validate-pools`. Rebuild after dictionary curation or rebinding.
Do not silently rewrite policy exceptions after source identity changes.


### Explicit reference-only nurse term

Keep 看護婦 `jmdict:1213870` in the full reference dictionary and explicitly
exclude it from the functional pool. The source marks the gendered term as
obsolete/deprecated; existing A2 看護師 `jmdict:1928100` is the general course
term. This makes the selection policy explicit without removing a selected
identity or changing any level budget. Source evidence and the completed
shortlist disposition are recorded in
[the dictionary review](../reviews/2026-09-26-curated-course/dictionary-shortlist-review.md).


### Three standalone everyday omissions

Add この頃 `jmdict:1004710`, 力 `jmdict:1554820` and 心 `jmdict:1360480`
to A2 with explicit priorities and reviewed glosses. These independent words
were omitted by the capped source shortlist; compounds do not teach their
standalone use. Teach recent ongoing situations, physical strength/force and
ordinary feelings first. A1 grammar and membership stay unchanged. A2 becomes
1,261 and the total 25,012; exact comparison preserves all previous identities
and level assignments. All three have authored lessons and two later recalls.
See the shortlist review and reviewed-placement decision for evidence and IDs.
