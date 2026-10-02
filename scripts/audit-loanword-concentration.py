#!/usr/bin/env python3
"""Read-only vocabulary audit; katakana is a screen, never an English-origin claim."""
import csv
import json
import re
import unicodedata
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/reviews/2026-09-21-loanwords'
OUT.mkdir(parents=True, exist_ok=True)


def read(path):
    return json.loads(path.read_text(encoding='utf-8'))


def katakana(text):
    return bool(re.search('[\u30a1-\u30fa\u31f0-\u31ff]', unicodedata.normalize('NFKC', text)))


def sources(entry, surface, reading):
    return [origin for sense in entry['senses']
            if (not sense.get('appliesToSpellings') or surface in sense['appliesToSpellings'])
            and (not sense.get('appliesToReadings') or reading in sense['appliesToReadings'])
            for origin in sense.get('sourceLanguages', [])]


def csv_file(name, rows):
    with (OUT / name).open('w', encoding='utf-8-sig', newline='') as file:
        writer = csv.DictWriter(file, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


entries = {}
for shard in sorted((ROOT / 'public/dictionary/jp/entries').glob('*.json')):
    entries.update(read(shard))
entries.update(read(ROOT / 'data/jp/dictionary/course_entries.json')['entries'])
bindings = read(ROOT / 'data/jp/dictionary/course_bindings.json')['words']
scope = read(ROOT / 'data/jp/dictionary/a1_scope.json')
index = read(ROOT / 'public/dictionary/jp/index.json')


def row(id, entry_id, surface, reading, meaning):
    origin = sources(entries[entry_id], surface, reading)
    return {'id': id, 'entry_id': entry_id, 'word': surface, 'reading': reading, 'meaning': meaning,
            'contains_katakana': katakana(surface),
            'english_source_recorded': any(value['language'] == 'eng' for value in origin),
            'source_languages': '|'.join(sorted({value['language'] for value in origin})),
            'source_forms': ' | '.join(value['text'] for value in origin),
            'wasei_recorded': any(value.get('wasei') for value in origin)}


study = [row(r[0], r[0], r[1], r[2], r[3]) for r in index]
core = [row(id, bindings[id]['entryId'], bindings[id]['surface'], bindings[id]['reading'], bindings[id]['meaning'])
        for id in scope['coreWordIds']]
by_id = {r['id']: r for r in core}
local = [row(e['id'], e['id'], e['headword'], e['reading'], e['senses'][0]['glosses'][0] if e['senses'] and e['senses'][0]['glosses'] else '')
         for e in entries.values() if e['source'] != 'jmdict']
full_library = study + local
library_core_ids = {b['entryId'] for id, b in bindings.items()
                    if b.get('introducedInUnit') is not None and scope['words'].get(id, {}).get('core')}
library_core = [r for r in full_library if r['entry_id'] in library_core_ids]


def totals(rows):
    return {'total': len(rows), 'katakana': sum(r['contains_katakana'] for r in rows),
            'english_recorded': sum(r['english_source_recorded'] for r in rows),
            'katakana_without_source': sum(r['contains_katakana'] and not r['source_languages'] for r in rows),
            'source_recorded': sum(bool(r['source_languages']) for r in rows)}


topics = []
for topic in scope['topics']:
    selected = [r for r in core if topic['id'] in scope['words'][r['id']]['topicIds']]
    count = totals(selected)
    topics.append({'topic': topic['title'], **count, 'percent': round(100 * count['katakana'] / count['total'], 1)})

lessons = []
exposures = Counter()
packets = ROOT / 'docs/reviews/2026-09-20-ten-lessons/unique-card-srs-final'
for path in sorted(packets.glob('[0-9][0-9].json')):
    packet = read(path)
    session = packet['session']
    counts = Counter({key: 0 for key in ["core_words", "core_katakana", "review_words", "review_katakana"]})
    for i, card in enumerate(session['savedCards']):
        # Count each lexical concept once per card, excluding unlinked particles.
        words = {scope['words'].get(token['wordId'], {}).get('coreWordId', token['wordId']): token
                 for token in card['tokens'] if token.get('wordId')}
        flagged = {id for id, token in words.items() if by_id.get(id, {}).get('contains_katakana', katakana(token['surface']))}
        section = 'core' if session['items'][i].get('section') == 'lesson' else 'review'
        counts[section + '_words'] += len(words)
        counts[section + '_katakana'] += len(flagged)
        exposures.update(flagged)
    targets = session.get('targetWordIds', [])
    lessons.append({'lesson': packet['result']['number'], 'title': packet['result']['title'],
                    'targets': len(targets), 'katakana_targets': sum(by_id.get(id, {}).get('contains_katakana', False) for id in targets), **counts})

csv_file('a1-core-words.csv', core)
csv_file('library-candidates.csv', [r for r in full_library if r['contains_katakana'] or r['source_languages']])
csv_file('topics.csv', topics)
if lessons:
    csv_file('lesson-exposures.csv', lessons)
summary = {'method': 'Katakana in displayed forms; explicit source-language tags are separate and incomplete.',
           'full_library': totals(full_library), 'library_core_filter': totals(library_core), 'study': totals(study), 'a1_core': totals(core), 'topics': topics, 'lessons': lessons,
           'top_simulated_exposures': [{'id': id, 'word': by_id.get(id, {}).get('word', id), 'cards': n} for id, n in exposures.most_common(15)]}
(OUT / 'summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

lines = ['# Loanword screening audit', '',
         'Pinned local dictionary and A1 inventory, September 21, 2026. No vocabulary, lesson selection, priority or review rules changed.', '',
         '## What these flags mean', '',
         '**Contains katakana** describes the displayed spelling, including mixed forms such as Tシャツ. It is a useful loanword screening aid, not an English-origin classification. Native words, names and non-English borrowings can use katakana; borrowed words can also use hiragana or kanji.', '',
         '**English source recorded** requires explicit English source-language metadata in a sense compatible with the displayed spelling and reading. Missing tags mean unknown origin, not native Japanese. This edition leaves many obvious English-derived words untagged; the explicit-English count is not an estimate of all English loanwords. Wasei flags and mixed-language source forms are retained in the CSV.', '',
         '## Inventory counts', '', '| Inventory | Entries/concepts | Contains katakana | Share | Explicit English source |', '|---|---:|---:|---:|---:|']
for label, rows in [('Full default library (including local/recognition entries)', full_library), ('Imported study dictionary', study), ('Library Core A1 filter (entry-based)', library_core), ('Unique A1 core learning concepts', core)]:
    t = totals(rows)
    lines.append(f"| {label} | {t['total']:,} | {t['katakana']:,} | {100*t['katakana']/t['total']:.1f}% | {t['english_recorded']:,} |")
lines += ['', 'The full library includes local authored/recognition entries (including individual kana), so its flag count is not a loanword count. The imported dictionary denominator excludes those local entries. A1 uses the 450 canonical learning IDs, so polite-form aliases are not counted twice. Browser result counts are entry-based and can differ because entries may have multiple learning concepts or display forms.', '',
          '## A1 topic pools', '', 'Topics overlap; do not sum their rows. These are available pools, not selection quotas.', '',
          '| Topic | Katakana concepts | Total concepts | Share |', '|---|---:|---:|---:|']
for t in sorted(topics, key=lambda t: -t['percent']):
    lines.append(f"| {t['topic']} | {t['katakana']} | {t['total']} | {t['percent']:.1f}% |")
lines += ['', '## Existing ten-lesson simulation', '',
          'This is the saved 28-day simulation, not the user’s personal practice history. A word appearance means one canonical concept on one card. Particles without lexical IDs are excluded. Target share measures the new selection; core exposure also includes familiar scaffolding. Review is counted separately.', '',
          '| Lesson | Topic | Katakana new targets | Core word appearances | Review word appearances |', '|---|---|---:|---:|---:|']
for lesson in lessons:
    def ratio(part):
        a, b = lesson.get(part + '_katakana', 0), lesson.get(part + '_words', 0)
        return f'{a}/{b} ({100*a/b:.1f}%)' if b else '—'
    lines.append(f"| {lesson['lesson']} | {lesson['title']} | {lesson['katakana_targets']}/{lesson['targets']} | {ratio('core')} | {ratio('review')} |")
if lessons:
    flagged = sum(l['core_katakana'] + l['review_katakana'] for l in lessons)
    total = sum(l['core_words'] + l['review_words'] for l in lessons)
    lines += ['', f'Across all ten lessons: {flagged}/{total} lexical appearances ({100*flagged/total:.1f}%) and {sum(l["katakana_targets"] for l in lessons)}/60 new targets contain katakana. This is unevenly distributed; the third Food selection has 3/6 flagged targets (bread, curry and pizza).']
lines += ['', '## Inspect the flagged core words', '', '| Word | Meaning | Recorded source languages |', '|---|---|---|']
for r in core:
    if r['contains_katakana'] or r['source_languages']:
        lines.append(f"| {r['word']} | {r['meaning'].replace('|', '/')} | {r['source_languages'] or 'not tagged'} |")
lines += ['', '## Files and reproduction', '',
          '- [All A1 core words and flags](a1-core-words.csv)', '- [Full library candidates](library-candidates.csv)',
          '- [Topic counts](topics.csv)', '- [Lesson exposure counts](lesson-exposures.csv)', '- [Machine-readable summary](summary.json)', '',
          'Run `python -X utf8 scripts/audit-loanword-concentration.py`. The [JMdict description](https://www.edrdg.org/~jwb/paperdir/jmdictart.pdf) notes that katakana also represents onomatopoeic words; it is not an English-origin tag. Origin evidence comes from the installed JMdict sense records, restricted to the displayed form; the audit performs no online lookup or origin inference. The lesson section is included when its saved simulation packets exist.']
(OUT / 'REPORT.md').write_text('\n'.join(lines) + '\n', encoding='utf-8')
print(json.dumps({key: summary[key] for key in ['full_library', 'library_core_filter', 'study', 'a1_core', 'topics', 'lessons']}, ensure_ascii=False, indent=2))
