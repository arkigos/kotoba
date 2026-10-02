#!/usr/bin/env python3
"""Rebuild compact browse rows from the installed, pinned JMdict shards.

This never refreshes the source dictionary, alters word placement, or requests audio.
The ordinary importer produces the same columns for future editions.
"""
import json
from pathlib import Path
from lib.dictionary_browse import dictionary_index_row

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public/dictionary/jp"
rows = []
reference_rows = []
for path in sorted((PUBLIC / "entries").glob("*.json")):
    for entry in json.loads(path.read_text(encoding="utf-8")).values():
        row = dictionary_index_row(entry)
        reference_rows.append(row)
        if entry.get('studyCollection', True): rows.append(row)
rows.sort(key=lambda row: int(row[0].split(":")[1]))
manifest = json.loads((PUBLIC / "manifest.json").read_text(encoding="utf-8"))
if len(reference_rows) != manifest["entryCount"] or len({row[0] for row in reference_rows}) != len(reference_rows):
    raise ValueError("Installed shards do not match the pinned manifest; refusing to replace the index")
(PUBLIC / "index.json").write_text(json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + "\n", encoding="utf-8")
if manifest.get('placementVersion'):
    manifest['studyEntryCount'] = len(rows)
    reference_rows.sort(key=lambda row: int(row[0].split(':')[1]))
    (PUBLIC / 'reference-index.json').write_text(json.dumps(reference_rows, ensure_ascii=False, separators=(',', ':'))+'\n', encoding='utf-8')
else:
    manifest["indexColumns"] = ["id", "headword", "reading", "firstGloss", "additionalSearchText", "common(0|1)", "partsOfSpeech(pipe-delimited)", "fields(pipe-delimited)"]
(PUBLIC / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"Rebuilt browse rows for {len(rows):,} pinned dictionary entries.")
