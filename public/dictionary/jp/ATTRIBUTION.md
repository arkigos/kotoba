# Dictionary data attribution

This application uses JMdict dictionary data, copyright James William Breen and the Electronic Dictionary Research and Development Group (EDRDG), under CC BY-SA 4.0.

Source: [official JMdict English export](https://www.edrdg.org/pub/Nihongo/JMdict_e.gz), dated 2026-09-12.

[JMdict documentation](https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project) · [EDRDG notice](https://www.edrdg.org/edrdg/licence.html) · [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Complete notices and the source DTD are included in this directory.

English-only export converted to JSON shards; entity codes retained with labels; effective inherited POS expanded; compact search index added. Kotoba study placements and exact-form frequency metadata added; placements are estimates, not official CEFR labels. This attribution does not imply endorsement by EDRDG. Derived dictionary data in this directory is distributed under CC BY-SA 4.0; it is separate from Kotoba application code.

Entry IDs retain upstream sequence numbers. Sense numbers can shift between source versions. Spelling/reading restrictions and all sense metadata must be considered before using dictionary data to generate language. Dictionary inclusion alone does not make a word safe for procedural lesson generation.

## Updating

Run `python scripts/import-japanese-dictionary.py` to refresh from the official source. Refresh before releases and at least monthly for a deployed dictionary service; preserve local authored IDs and reviewed sense mappings across updates. The importer records source and shard checksums in manifest.json. Original source payloads are archived in data/jp/dictionary/upstream. Use --source ARCHIVE_PATH --expect-sha256 SHA256 to reproduce this export. The upstream daily URL is not a historical archive.

## Frequency and study collection

Frequency data: [wordfreq 3.1.1, Robyn Speer](https://pypi.org/project/wordfreq/3.1.1/), redistributed under CC BY-SA 4.0. See [WORDFREQ-NOTICE.md](WORDFREQ-NOTICE.md) for the full source credits. Kotoba adds estimated A1–C2 study placements and frequency labels, cleans preferred display forms, and selects 50,000 imported study entries. These modifications remain CC BY-SA 4.0. Placements are not official CEFR labels. Removed browse entries remain resolvable for saved words. After importing or rebinding, run `npm run dictionary:curate` and `npm run dictionary:validate`.
