#!/usr/bin/env python3
"""Place every pinned entry and build a bounded study dictionary without losing IDs.

Run after dictionary import/binding. Frequency extraction alone requires msgpack;
subsequent builds use the pinned, compact JSON frequency source (stdlib only).
Levels are Kotoba study estimates, not official CEFR/JLPT equivalences.
"""
from __future__ import annotations
import gzip
import hashlib
import json
from collections import Counter, defaultdict
from pathlib import Path
import sys
import unicodedata
import re
from lib.dictionary_browse import dictionary_index_row

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data/jp/dictionary'
PUBLIC = ROOT / 'public/dictionary/jp'
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
VERSION = 'kotoba-placement-2026-09-20-v1'
RARE = {'arch', 'obs', 'obsc', 'rare', 'hist'}
BAD_FORM = {'oK', 'rK', 'sK', 'ik', 'ok', 'rk', 'sk'}
NAMED_ENTITY = {'company', 'organization', 'product', 'work', 'person', 'place', 'station', 'given', 'surname'}

def read(path):
    return json.loads(path.read_text(encoding='utf-8'))

def write(path, value, pretty=False):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2 if pretty else None,
                               separators=None if pretty else (',', ':')) + '\n', encoding='utf-8')

def source_frequencies():
    path = DATA / 'upstream/wordfreq-3.1.1-ja.json.gz'
    if not path.exists():
        sys.path.insert(0, str(ROOT / '.cache/dictionary-tools/runtime'))
        import msgpack
        packed = msgpack.unpackb(gzip.decompress((DATA / 'upstream/wordfreq-3.1.1-ja.msgpack.gz').read_bytes()), raw=False)
        assert packed[0] == {'format': 'cB', 'version': 1}
        values = {word: round(9 - index / 100, 2) for index, group in enumerate(packed[1:]) for word in group}
        path.write_bytes(gzip.compress(json.dumps(values, ensure_ascii=False, separators=(',', ':')).encode(), mtime=0))
    return json.loads(gzip.decompress(path.read_bytes()))

def allowed_senses(entry, surface=None, reading=None):
    surface, reading = surface or entry['headword'], reading or entry['reading']
    return [s for s in entry['senses'] if (not s.get('appliesToSpellings') or surface in s['appliesToSpellings'])
            and (not s.get('appliesToReadings') or reading in s['appliesToReadings']) and s.get('glosses')]

def repair_display(entry):
    """Prefer source-marked usual kana; retain every original spelling and sense."""
    if re.fullmatch(r'[\d０-９,，.．]+', entry['headword']):
        for surface in entry['spellings']:
            if re.search(r'[一-龯ぁ-んァ-ン]', surface) and allowed_senses(entry, surface):
                entry['headword'] = surface
                break
    current = allowed_senses(entry)
    if current and 'uk' in current[0].get('misc', []) and entry['headword'] not in entry['readings']:
        forms = sorted(entry.get('readingForms', []), key=lambda form: (not bool(form.get('priority')), entry['readings'].index(form['text'])))
        for form in forms:
            senses = allowed_senses(entry, form['text'], form['text'])
            if senses and 'uk' in senses[0].get('misc', []) and not BAD_FORM.intersection(form.get('info', [])):
                entry['headword'] = entry['reading'] = form['text']
                return True
    if allowed_senses(entry):
        return False
    for form in entry.get('readingForms', []):
        surfaces = [form['text']] if form.get('noKanji') else form.get('appliesToSpellings') or entry['spellings'] or [form['text']]
        for surface in surfaces:
            if allowed_senses(entry, surface, form['text']):
                entry['headword'], entry['reading'] = surface, form['text']
                return True
    raise ValueError(f"No displayable spelling/reading/sense: {entry['id']}")

def evidence(entry, frequencies, owners):
    spellings = [f['text'] for f in entry.get('spellingForms', []) if not BAD_FORM.intersection(f.get('info', []))]
    # Never use a bare phonetic reading to transfer a common homophone's frequency
    # onto an unrelated kanji word. Kana-only entries necessarily remain uncertain.
    forms = spellings or ([entry['headword']] if not entry['spellings'] else [])
    if entry['headword'] in entry['readings'] and 'uk' in allowed_senses(entry)[0].get('misc', []): forms.append(entry['headword'])
    forms = [form for form in forms if owners.get(form, entry['id']) == entry['id']]
    frequency = max((frequencies.get(form, frequencies.get(unicodedata.normalize('NFKC', form), 0)) for form in forms), default=0)
    pri = set(p for form in entry.get('spellingForms', []) + entry.get('readingForms', []) for p in form.get('priority', []))
    senses = allowed_senses(entry)
    rare = all(RARE.intersection(s.get('misc', [])) or s.get('dialects') for s in senses)
    specialist = all(s.get('fields') for s in senses)
    proper = all('n-pr' in s['partsOfSpeech'] or NAMED_ENTITY.intersection(s.get('misc', [])) for s in senses)
    nf = min((int(p[2:]) for p in pri if p.startswith('nf')), default=99)
    return frequency, pri, rare, specialist, proper, nf

def estimate(entry, facts):
    frequency, pri, rare, specialist, proper, nf = facts
    if frequency >= 4.6: level = 'A2'
    elif frequency >= 4.0: level = 'B1'
    elif frequency >= 3.3: level = 'B2'
    elif frequency >= 2.5: level = 'C1'
    else: level = 'C2'
    basis = 'wordfreq-exact-form' if frequency else 'limited-evidence'
    # JMdict common marks are supporting evidence, not an official level mapping.
    if not frequency and entry['common']:
        level, basis = ('B1' if nf <= 20 or 'ichi1' in pri else 'B2'), 'jmdict-priority'
    if rare: level, basis = 'C2', 'rare-or-historical'
    if specialist and LEVELS.index(level) < 2: level = 'B1'
    if proper and LEVELS.index(level) < 2: level = 'B1'
    if all(any(p.startswith('aux') or p in {'suf', 'pref'} for p in s['partsOfSpeech']) for s in allowed_senses(entry)) and LEVELS.index(level) < 2:
        level = 'B1'
    return {'level': level, 'method': 'estimated', 'basis': basis,
            'confidence': 'medium' if frequency and not (rare or proper) else 'low'}

def main():
    frequencies = source_frequencies()
    bindings = read(DATA / 'course_bindings.json')['words']
    authored = defaultdict(set)
    for binding in bindings.values():
        if binding.get('level') in LEVELS:
            authored[binding['entryId']].add(binding['level'])
    overrides_path = DATA / 'level_overrides.json'
    overrides = read(overrides_path).get('entries', {}) if overrides_path.exists() else {}
    shards = [(p, read(p)) for p in sorted((PUBLIC / 'entries').glob('*.json'))]
    entries = {key: entry for _, shard in shards for key, entry in shard.items()}
    # A surface corpus cannot disambiguate homographs. Attribute it to the
    # strongest dictionary-supported entry, never every same-spelling entry.
    owners = {}
    owner_scores = {}
    for entry in entries.values():
        original_surface = (entry['spellings'] or entry['readings'])[0]
        original_readings = [f['text'] for f in entry.get('readingForms', []) if not f.get('noKanji') and (not f.get('appliesToSpellings') or original_surface in f['appliesToSpellings'])]
        original_reading = (original_readings or entry['readings'])[0]
        if entry['spellings'] and not original_readings: original_surface = original_reading
        repair_display(entry)
        if [original_surface, original_reading] != [entry['headword'], entry['reading']]:
            entry['displayCorrection'] = {'before': [original_surface, original_reading], 'after': [entry['headword'], entry['reading']], 'basis': 'source-marked-usual-form'}
        pri = set(p for form in entry.get('spellingForms', []) + entry.get('readingForms', []) for p in form.get('priority', []))
        score = (entry['id'] in authored, entry['common'], bool(pri))
        forms = list(entry['spellings'] or entry['readings'])
        if entry['headword'] in entry['readings'] and 'uk' in allowed_senses(entry)[0].get('misc', []): forms.append(entry['headword'])
        for form in forms:
            if form not in owners or score > owner_scores[form]:
                owners[form], owner_scores[form] = entry['id'], score
            elif score == owner_scores[form] and owners[form] != entry['id']:
                # A smaller source ID is not evidence for a meaning's frequency.
                owners[form] = None
    local = read(DATA / 'course_entries.json')
    repairs, ranking, level_counts, methods = [], [], Counter(), Counter()
    for entry in entries.values():
        before = (entry['headword'], entry['reading'])
        if repair_display(entry): entry['displayCorrection'] = {'before': before, 'after': [entry['headword'], entry['reading']], 'basis': 'valid-sense-form'}
        if entry.get('displayCorrection'): repairs.append({'id': entry['id'], **entry['displayCorrection']})
        facts = evidence(entry, frequencies, owners)
        if entry['id'] in authored:
            placement = {'level': min(authored[entry['id']], key=LEVELS.index), 'method': 'reviewed', 'basis': 'authored-course', 'confidence': 'high'}
        elif entry['id'] in overrides:
            placement = {**overrides[entry['id']], 'method': 'reviewed', 'confidence': 'high'}
        else: placement = estimate(entry, facts)
        entry['placement'] = placement
        frequency = facts[0]
        entry['frequency'] = {'band': 'very-common' if frequency >= 5 else 'common' if frequency >= 4 else 'uncommon' if frequency >= 3 else 'rare' if frequency else 'common' if entry['common'] else 'unranked',
                              'source': 'wordfreq-3.1.1-exact-form' if frequency else 'jmdict-priority' if entry['common'] else 'insufficient-evidence',
                              **({'zipf': frequency} if frequency else {})}
        level_counts[placement['level']] += 1
        methods[placement['method']] += 1
        frequency, pri, rare, specialist, proper, nf = facts
        score = frequency + (1.2 if entry['common'] else 0) + (0.4 if nf < 99 else 0) - (3 if rare else 0) - (0.6 if specialist else 0) - (1 if proper else 0)
        protected = entry['id'] in authored or entry['id'] in overrides
        if not protected and (rare or (proper and not entry['common'] and frequency < 3.5)):
            continue
        ranking.append((entry['id'] not in authored and entry['id'] not in overrides, -score, int(entry['id'][7:]), entry))
    ranking.sort(key=lambda row: row[:3])
    retained, identities = set(), set()
    for row in ranking:
        entry = row[3]
        identity = (unicodedata.normalize('NFKC', entry['headword']), entry['reading'], json.dumps([(s['glosses'], s['partsOfSpeech']) for s in entry['senses']], ensure_ascii=False))
        if identity in identities and entry['id'] not in authored: continue
        identities.add(identity)
        retained.add(entry['id'])
        if len(retained) == 50_000: break
    rows, all_rows = [], []
    for entry in entries.values():
        entry['studyCollection'] = entry['id'] in retained
        row = dictionary_index_row(entry)
        all_rows.append(row)
        if entry['studyCollection']: rows.append(row)
    rows.sort(key=lambda row: (LEVELS.index(row[8]), -int(row[5]), int(row[0][7:])))
    all_rows.sort(key=lambda row: int(row[0][7:]))
    write(PUBLIC / 'index.json', rows)
    write(PUBLIC / 'reference-index.json', all_rows)
    for key, entry in local['entries'].items():
        if key in entries:
            entry['placement'] = entries[key]['placement']
            entry['frequency'] = entries[key]['frequency']
            entry['headword'], entry['reading'] = entries[key]['headword'], entries[key]['reading']
        else:
            entry['placement'] = {'level': min(authored.get(key, {'A1'}), key=LEVELS.index), 'method': 'reviewed',
                                  'basis': 'authored-course' if key in authored else 'authored-foundation', 'confidence': 'high'}
            frequency = frequencies.get(entry['headword'], 0)
            entry['frequency'] = {'band': 'very-common' if frequency >= 5 else 'common' if frequency >= 4 else 'uncommon' if frequency >= 3 else 'rare' if frequency else 'unranked',
                                  'source': 'wordfreq-3.1.1-exact-form' if frequency else 'insufficient-evidence', **({'zipf': frequency} if frequency else {})}
        entry['studyCollection'] = True
    write(DATA / 'course_entries.json', local, True)
    manifest = read(PUBLIC / 'manifest.json')
    manifest['indexColumns'] = ['id', 'headword', 'reading', 'firstGloss', 'additionalSearchText', 'common(0|1)', 'partsOfSpeech(pipe-delimited)', 'fields(pipe-delimited)', 'kotobaLevel', 'placementMethod', 'frequencyBand']
    manifest['studyEntryCount'] = len(rows)
    manifest['referenceIndexPath'] = '/dictionary/jp/reference-index.json'
    manifest['placementVersion'] = VERSION
    for path, shard in shards:
        write(path, shard)
        record = next(s for s in manifest['shards'] if s['path'].endswith('/' + path.name))
        payload = path.read_bytes()
        record.update(bytes=len(payload), sha256=hashlib.sha256(payload).hexdigest())
    write(PUBLIC / 'manifest.json', manifest, True)
    notice = DATA / 'upstream/wordfreq-3.1.1-NOTICE.md'
    (PUBLIC / 'WORDFREQ-NOTICE.md').write_text(notice.read_text(encoding='utf-8'), encoding='utf-8')
    attribution = PUBLIC / 'ATTRIBUTION.md'
    original = attribution.read_text(encoding='utf-8').split('## Frequency and study collection')[0].rstrip()
    attribution.write_text(original + '\n\n## Frequency and study collection\n\n'
        'Frequency data: [wordfreq 3.1.1, Robyn Speer](https://pypi.org/project/wordfreq/3.1.1/), '
        'redistributed under CC BY-SA 4.0. See [WORDFREQ-NOTICE.md](WORDFREQ-NOTICE.md) for the full source credits. '
        'Kotoba adds estimated A1–C2 study placements and frequency labels, cleans preferred display forms, '
        'and selects 50,000 imported study entries. These modifications remain CC BY-SA 4.0. '
        'Placements are not official CEFR labels. Removed browse entries remain resolvable for saved words. '
        'After importing or rebinding, run `npm run dictionary:curate` and `npm run dictionary:validate`.\n', encoding='utf-8')
    report = {'version': VERSION, 'sourceEntryCount': len(entries), 'studyEntryCount': len(rows), 'archivedFromBrowse': len(entries)-len(rows),
              'localEntries': sum(key not in entries for key in local['entries']), 'levelsAllReference': dict(level_counts), 'methods': dict(methods),
              'levelsStudyDictionary': dict(Counter(row[8] for row in rows)), 'displayRepairs': repairs,
              'frequencySource': {'name': 'wordfreq', 'version': '3.1.1', 'url': 'https://pypi.org/project/wordfreq/3.1.1/',
                                  'sha256': hashlib.sha256((DATA / 'upstream/wordfreq-3.1.1-ja.msgpack.gz').read_bytes()).hexdigest()},
              'frequencyBandsStudy': dict(Counter(entries[row[0]]['frequency']['band'] for row in rows)),
              'policy': 'Kotoba estimated study placement, not official CEFR/JLPT. Exact-form corpus frequency and JMdict flags supplement reviewed course placements. C2 includes a low-confidence long-tail bucket. All upstream IDs remain resolvable.'}
    write(DATA / 'placement-report.json', report, True)
    sample = []
    for level in LEVELS:
        eligible = [entry for entry in entries.values() if entry['placement']['level'] == level and entry['studyCollection']]
        ordered = sorted(eligible, key=lambda e: hashlib.sha256(e['id'].encode()).hexdigest())
        sample.append(f'## {level}\n\n| Word | Reading | Meaning | Basis |\n| --- | --- | --- | --- |')
        sample += [f"| {e['headword']} | {e['reading']} | {allowed_senses(e)[0]['glosses'][0]} | {e['placement']['basis']} |" for e in ordered[:30]]
    dest = ROOT / 'docs/reviews/2026-09-20-adaptive'
    dest.mkdir(parents=True, exist_ok=True)
    (dest / 'dictionary-sample.md').write_text('\n'.join(sample) + '\n', encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'): sys.stdout.reconfigure(encoding='utf-8')
    main()
