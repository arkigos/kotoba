"""Audit every dictionary entry, placement, frequency band and retained binding."""
import hashlib
import json
from pathlib import Path
from collections import Counter
root = Path(__file__).resolve().parents[1]
public = root/'public/dictionary/jp'
read = lambda path: json.loads(path.read_text(encoding='utf-8'))
manifest = read(public/'manifest.json')
entries = {}
for shard in manifest['shards']:
    path = root/'public'/shard['path'].lstrip('/')
    assert hashlib.sha256(path.read_bytes()).hexdigest() == shard['sha256'], path
    data = read(path)
    assert len(data) == shard['entries']
    assert not entries.keys() & data.keys()
    entries.update(data)
assert len(entries) == manifest['entryCount'] == 218765
local = read(root/'data/jp/dictionary/course_entries.json')['entries']
all_entries = {**entries, **local}
levels = Counter()
for id, entry in all_entries.items():
    assert id == entry['id']
    assert entry['placement']['level'] in ['A1','A2','B1','B2','C1','C2'], id
    assert entry['placement']['method'] in ['reviewed','estimated'], id
    assert entry['placement']['basis'] and entry['placement']['confidence'] in ['high','medium','low'], id
    assert entry['frequency']['band'] in ['very-common','common','uncommon','rare','unranked'], id
    assert entry['frequency']['source'], id
    if entry['frequency']['band'] == 'unranked': assert 'zipf' not in entry['frequency'], id
    assert entry['headword'] and entry['reading'] and entry['senses'], id
    assert any(s['glosses'] and (not s.get('appliesToSpellings') or entry['headword'] in s['appliesToSpellings'])
               and (not s.get('appliesToReadings') or entry['reading'] in s['appliesToReadings']) for s in entry['senses']), id
    levels[entry['placement']['level']] += 1
rows = read(public/'index.json')
reference = read(public/'reference-index.json')
assert len(rows) == len({r[0] for r in rows}) == manifest['studyEntryCount'] == 50000
assert len(reference) == len({r[0] for r in reference}) == len(entries)
assert {r[0] for r in rows} == {id for id,e in entries.items() if e['studyCollection']}
for row in reference:
    entry = entries[row[0]]
    assert row[8:11] == [entry['placement']['level'], entry['placement']['method'], entry['frequency']['band']], row[0]
    assert row[1:3] == [entry['headword'],entry['reading']], row[0]
    assert row[3], row[0]
bindings = read(root/'data/jp/dictionary/course_bindings.json')['words']
for id,b in bindings.items():
    assert b['entryId'] in all_entries, id
    entry = all_entries[b['entryId']]
    assert entry.get('studyCollection'), id
    if b.get('level') in ['A1','A2','B1','B2','C1','C2']:
        assert entry['placement']['method'] == 'reviewed', id
        assert entry['placement']['level'] == b['level'], id
# Critical ambiguity sentinel: the textile does not inherit soccer frequency.
soccer = [e for e in entries.values() if 'サッカー' in e['readings']]
textile = [e for e in soccer if any('seersucker' in gloss for s in e['senses'] for gloss in s['glosses'])]
assert textile and all(e['frequency']['band'] not in ['very-common','common'] and not e['studyCollection'] for e in textile)
assert any('karaoke' in s['glosses'] and e['headword'] in e['readings'] for e in entries.values() for s in e['senses'])
print(json.dumps({'entriesChecked':len(all_entries),'referenceEntries':len(entries),'studyEntries':len(rows),'localEntries':len(all_entries)-len(entries),'levels':dict(levels),'errors':[]},indent=2))
