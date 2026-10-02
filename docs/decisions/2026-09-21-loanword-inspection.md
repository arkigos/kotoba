# Inspect loanword concentration without changing lesson selection

User requested counts and inspectable flags before deciding whether loanword-heavy
lessons need balancing. This is an audit and browse change only.

Dictionary rows now expose a Katakana writing badge and a Writing filter:
Contains katakana / No katakana. `containsKatakana` tests the displayed spelling
with NFKC normalization, including mixed Latin/katakana and half-width forms.
It never labels a word English-derived or grants generation eligibility. Filters
combine with Core A1, topic, level and frequency and preserve selected words.

The offline audit `scripts/audit-loanword-concentration.py` counts:
- all 50,474 default library rows, including local recognition entries;
- the 50,000 imported study entries;
- the entry-based Core A1 library filter;
- the 450 canonical A1 teaching concepts, using actual binding surfaces;
- topic overlap and lexical appearances in the saved ten-lesson simulation.

Explicit compatible-sense `sourceLanguages` evidence is reported separately.
Absence of that evidence is unknown, not native origin. Katakana is only a
screen: native Japanese, names and non-English borrowings can use it. Conversely,
borrowings can be written in hiragana or kanji. The app and report say this clearly.
No English-only total is asserted from incomplete origin metadata.

Outputs and candidate CSVs: docs/reviews/2026-09-21-loanwords/REPORT.md.
Browser Core A1 results are entry-based (73 flagged/462 entries); teaching totals
use unique core learning concepts (71/450). They are different denominators.
No new caps, priorities, lesson quotas, dictionary culling or review changes.
