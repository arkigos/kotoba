#!/usr/bin/env python3
"""Build bounded curriculum pools; source dictionary IDs and course history stay intact.

No runtime AI. A1 is selected explicitly; later pools use recorded frequency,
source usage flags and reviewed exceptions. Pool placement is editorial guidance,
not a CEFR certification or permission to generate sentences.
"""
import argparse
import csv
import hashlib
import json
import re
import sys
import unicodedata
from collections import Counter, defaultdict
from pathlib import Path
from lib.dictionary_browse import dictionary_index_row

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data/jp/dictionary'
PUBLIC = ROOT / 'public/dictionary/jp'
OUT = ROOT / 'docs/reviews/2026-09-21-level-pools'
LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
read = lambda p: json.loads(p.read_text(encoding='utf-8'))
norm = lambda s: unicodedata.normalize('NFKC', s).strip()

def kana(s):
    return ''.join(chr(ord(c) - 0x60) if '\u30a1' <= c <= '\u30f6' else c for c in norm(s))

def katakana(s):
    return bool(re.search('[\u30a1-\u30fa\u31f0-\u31ff]', norm(s)))

def senses(entry):
    return [s for s in entry['senses'] if
            (not s.get('appliesToSpellings') or entry['headword'] in s['appliesToSpellings']) and
            (not s.get('appliesToReadings') or entry['reading'] in s['appliesToReadings'])]

def main():
    sys.stdout.reconfigure(encoding='utf-8')
    args = argparse.ArgumentParser()
    args.add_argument('--check', action='store_true')
    args = args.parse_args()
    policy = read(DATA / 'study-pool-policy.json')
    anchor_source = read(DATA/'upstream/open-anki-jlpt/source.json')
    for source in anchor_source['files']:
        assert hashlib.sha256((DATA/'upstream/open-anki-jlpt'/source['path']).read_bytes()).hexdigest() == source['sha256'], source['path']
    bindings = read(DATA / 'course_bindings.json')['words']
    scope = read(DATA / 'a1_scope.json')
    entries = {}
    for p in sorted((PUBLIC / 'entries').glob('*.json')):
        entries.update(read(p))
    entries.update(read(DATA / 'course_entries.json')['entries'])
    source_ids = {row[0] for row in read(PUBLIC / 'index.json')}
    by_form = defaultdict(list)
    for e in entries.values():
        if e['source'] == 'jmdict':
            for form in set(e['spellings'] + e['readings'] + [e['headword']]):
                by_form[norm(form)].append(e['id'])

    # Use independently assembled learning order as evidence, never as a CEFR
    # conversion. Ambiguous form+reading joins are deliberately left unmatched.
    anchors = {}
    anchor_unmatched = []
    for n in [5, 4, 3, 2, 1]:
        with (DATA/f'upstream/open-anki-jlpt/n{n}.csv').open(encoding='utf-8-sig', newline='') as f:
            for row in csv.DictReader(f):
                matched = set()
                for form in re.split(r';\s*', row['expression']):
                    ids = [id for id in by_form[norm(form)] if any(kana(r) == kana(row['reading']) for r in entries[id]['readings'])]
                    if len(ids) == 1: matched.add(ids[0])
                if not matched: anchor_unmatched.append({'level': n, 'word': row['expression'], 'reading': row['reading']})
                for id in matched: anchors.setdefault(id, n)

    def freq(e): return e.get('frequency', {}).get('zipf', 0)

    def resolve(form):
        if form in entries: return form
        surface, _, reading = form.partition('|')
        ids = by_form[norm(surface)]
        if reading: ids = [id for id in ids if reading in entries[id]['readings']]
        # Only a valid displayed form can be selected by a written-form policy.
        ids = [id for id in ids if entries[id]['headword'] == surface or entries[id]['reading'] == surface]
        ids.sort(key=lambda id: (-int(entries[id]['common']), -freq(entries[id]), id))
        if not ids: raise ValueError(f'Unresolved authored selection: {form}')
        if len(ids) > 1 and (entries[ids[0]]['common'], freq(entries[ids[0]])) == (entries[ids[1]]['common'], freq(entries[ids[1]])):
            raise ValueError(f'Ambiguous authored selection: {form}: {ids}')
        return ids[0]

    # Repair only pool identity for authored katakana whose historic course
    # binding used a hiragana reading. Keep those old learning/audio IDs intact.
    def canonical_course(id):
        if id in policy['courseIdentityOverrides']:
            return resolve(policy['courseIdentityOverrides'][id])
        b = bindings[id]
        e = entries[b['entryId']]
        return e['id']

    authored_forms = list(policy['courseIdentityOverrides'].values()) + list(policy['essentialLoans']) + list(policy['excludedEntries']) + list(policy['minimumLevels']) + policy['additionalA1'] + [f for f in policy['introductoryA1'] + policy.get('foundationA1', []) if f not in bindings] + [item[key] for item in policy['preferredAlternatives'] for key in ['loan', 'preferred']] + [form for forms in policy.get('priorityByLevel', {}).values() for form in forms]
    errors = []
    for form in dict.fromkeys(authored_forms):
        try: resolve(form)
        except ValueError as error: errors.append(str(error))
    if errors: raise ValueError('\n'.join(errors))
    for form, display in policy.get('displayOverrides', {}).items():
        e = entries[resolve(form)]
        assert display['word'] in e['spellings'] + e['readings'], form
        assert display['reading'] in e['readings'], form
        e['headword'], e['reading'] = display['word'], display['reading']
        assert senses(e), form
    essentials = {resolve(form): reason for form, reason in policy['essentialLoans'].items()}
    preferences = []
    deprioritized = {}
    for item in policy['preferredAlternatives']:
        loan, preferred = resolve(item['loan']), resolve(item['preferred'])
        deprioritized[loan] = item
        preferences.append({**item, 'loanId': loan, 'preferredId': preferred})
    excluded = {resolve(form): reason for form, reason in policy['excludedEntries'].items()}
    minimums = {resolve(form): level for form, level in policy['minimumLevels'].items()}
    priorities = {level: [resolve(form) for form in forms] for level, forms in policy.get('priorityByLevel', {}).items()}
    intro = [canonical_course(id) if id in bindings else resolve(id) for id in policy['introductoryA1']]
    foundation = [canonical_course(id) if id in bindings else resolve(id) for id in policy.get('foundationA1', [])]
    a1 = [canonical_course(id) for id in scope['coreWordIds'] if id not in policy['deferCourseWords']]
    a1 += [resolve(form) for form in policy['additionalA1']]
    a1 = list(dict.fromkeys(intro + foundation + a1))
    a1 = [id for id in a1 if id not in excluded and id not in deprioritized and minimums.get(id, 'A1') == 'A1']
    if len(a1) != policy['budgets']['A1']:
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT/'a1-candidates.txt').write_text('\n'.join(f"{id}\t{entries[id]['headword']}\t{entries[id]['reading']}\t{senses(entries[id])[0]['glosses'][0]}" for id in a1), encoding='utf-8')
        raise ValueError(f"Explicit A1 has {len(a1)} entries; expected {policy['budgets']['A1']}. Last entries: {[entries[i]['headword'] for i in a1[-30:]]}")

    def eligible(e):
        ss = senses(e)
        if not ss or e['id'] in excluded: return False
        if all(set(s.get('misc', [])) & {'arch', 'obs', 'obsc', 'rare', 'hist'} or s.get('dialects') for s in ss): return False
        if all('n-pr' in s['partsOfSpeech'] or set(s.get('misc', [])) & {'person', 'place', 'company', 'product', 'organization', 'surname', 'given', 'station'} for s in ss): return False
        parts = ss[0]['partsOfSpeech']
        if not any(p in {'n', 'pn', 'adv', 'adv-to', 'exp', 'int', 'adj-i', 'adj-ix', 'adj-na', 'adj-no', 'adj-pn', 'adj-t', 'adj-f'} or p.startswith('v') and p not in {'vi', 'vt'} for p in parts): return False
        if any(p in {'prt', 'aux', 'aux-v', 'aux-adj', 'pref', 'suf'} for p in parts): return False
        if len(e['headword']) == 1 and not re.search('[\u4e00-\u9fff]', e['headword']): return False
        if not re.search('[\u3041-\u30fa\u4e00-\u9fff]', e['headword']): return False
        gloss = ss[0]['glosses'][0]
        if re.search(r'(?:city|prefecture|province|county|stadium|capital|region) (?:in|of|comprising)|\((?:China|South Korea|USA|Russia|U\.S\.)\)', gloss, re.I): return False
        if gloss[0].isupper() and e['id'] not in anchors and not re.match(r'(Japanese|Chinese|Buddhist|Shinto|Internet|TV|DNA|RNA|USB|CD|DVD)\b', gloss): return False
        return True

    def score(e):
        ss = senses(e)
        pri = {p for f in e.get('spellingForms', []) + e.get('readingForms', []) for p in f.get('priority', [])}
        specialist = all(set(s.get('fields', [])) - {'food', 'cook', 'sports', 'comp'} for s in ss)
        return (freq(e) + 1.0 * e['common'] + 0.3 * bool(pri)
                - 0.25 * (katakana(e['headword']) and e['id'] not in essentials)
                - 1.5 * (e['id'] in deprioritized) - 0.9 * specialist)

    # Same displayed word and pronunciation must not consume multiple budgets.
    # Distinct readings/senses remain accessible through the reference dictionary.
    identity = lambda id: (norm(entries[id]['headword']), kana(entries[id]['reading']))
    used_identity = set()
    for id in a1:
        assert identity(id) not in used_identity, id
        used_identity.add(identity(id))
    selected = set(a1)
    ranked = sorted((id for id in source_ids if id not in selected and eligible(entries[id])),
                    key=lambda id: (5 - anchors.get(id, 0), -score(entries[id]), -freq(entries[id]), id))
    pools = {'A1': a1}
    quota_excluded = set()
    for level in LEVELS[1:]:
        chosen = []
        katakana_count = 0
        limit = policy['budgets'][level]
        for id in dict.fromkeys(priorities.get(level, []) + ranked):
            e = entries[id]
            if id in selected or id in quota_excluded or identity(id) in used_identity: continue
            reviewed = e.get('placement', {})
            floor = minimums.get(id, reviewed.get('level', 'A2') if reviewed.get('method') == 'reviewed' else 'A2')
            if LEVELS.index(floor) > LEVELS.index(level): continue
            if level == 'A2' and id not in anchors and all(set(s.get('fields', [])) - {'food', 'cook', 'sports', 'comp'} for s in senses(e)): continue
            is_katakana = katakana(e['headword'])
            if is_katakana and katakana_count >= int(limit * policy['maximumKatakanaShare']):
                # A concentration limit is not evidence of a harder level.
                # Keep overflow in the reference library, never dump it into C2.
                quota_excluded.add(id)
                continue
            chosen.append(id)
            katakana_count += int(is_katakana)
            selected.add(id)
            used_identity.add(identity(id))
            if len(chosen) == limit: break
        if len(chosen) != limit: raise ValueError(f'Insufficient candidates for {level}: {len(chosen)}')
        pools[level] = chosen

    OUT.mkdir(parents=True, exist_ok=True)
    outputs = {}
    def output(path, value, pretty=False):
        outputs[path] = (json.dumps(value, ensure_ascii=False, indent=2 if pretty else None, separators=None if pretty else (',', ':')) + '\n').encode('utf-8')
    rows, records, summary = [], [], {}
    cumulative = 0
    for level, ids in pools.items():
        cumulative += len(ids)
        n_kata = sum(katakana(entries[id]['headword']) for id in ids)
        assert n_kata <= int(len(ids) * policy['maximumKatakanaShare']), (level, n_kata)
        summary[level] = {'newEntries': len(ids), 'cumulativeEntries': cumulative, 'katakana': n_kata, 'katakanaPercent': round(100*n_kata/len(ids), 2)}
        for rank, id in enumerate(ids, 1):
            e = entries[id]
            stage = 'introductory' if level == 'A1' and id in intro else 'foundation' if level == 'A1' and id in foundation else 'topic-expansion' if level == 'A1' else 'expansion'
            reason = 'authored-A1-selection' if level == 'A1' else 'learning-order-frequency-and-usage-ranked'
            if id in anchors: reason += f'; community-N{anchors[id]}-ordering-evidence'
            if id in priorities.get(level, []): reason += '; reviewed-everyday-priority'
            if id in essentials: reason += '; essential-loan: ' + essentials[id]
            if id in deprioritized: reason += '; lower-priority-alternative: ' + deprioritized[id]['reason']
            row = dictionary_index_row(e)
            if id in policy.get('glossOverrides', {}): row[3] = policy['glossOverrides'][id]
            row[8:11] = [level, 'reviewed' if level == 'A1' else 'estimated', e['frequency']['band']]
            row += [rank, stage]
            rows.append(row)
            records.append({'id': id, 'level': level, 'rank': rank, 'stage': stage, 'word': e['headword'], 'reading': e['reading'],
                            'meaning': row[3], 'katakana': katakana(e['headword']), 'zipf': freq(e),
                            'common': e['common'], 'selectionReason': reason, 'score': round(score(e), 3)})
    report = {'version': policy['version'], 'policySha256': hashlib.sha256((DATA/'study-pool-policy.json').read_bytes()).hexdigest(),
              'orderingSourceRevision': anchor_source['revision'], 'matchedLearningAnchors': len(anchors),
              'a1Stages': dict(Counter(r['stage'] for r in records if r['level'] == 'A1')),
              'totalEntries': len(rows), 'levels': summary, 'katakanaEntries': sum(r['katakana'] for r in records),
              'preferredAlternatives': preferences, 'essentialLoans': essentials,
              'loanOverflowKeptInReference': len(quota_excluded),
              'limitations': ['Kotoba curriculum budgets, not official CEFR word counts.', 'A2–C2 placements are ranked candidates, not individually expert-validated.',
                              'Katakana is a writing proxy, not proof of foreign origin.', 'Pool membership grants no sentence-generation or known-word eligibility.']}
    output(DATA/'study-pools.json', {'version': policy['version'], 'budgets': policy['budgets'], 'pools': pools}, True)
    output(PUBLIC/'study-index.json', rows)
    output(OUT/'summary.json', report, True)
    output(OUT/'selections.json', records)
    output(OUT/'unmatched-learning-anchors.json', anchor_unmatched, True)
    # A unique anchor join is not evidence that the capped browse shortlist
    # contains the entry. Surface/reading splits can leave ordinary words out.
    # Expose these gaps for individual review; never bulk re-rank the course.
    selected_levels = {id: level for level, ids in pools.items() for id in ids}
    shortlist_gaps = [
        {'id': id, 'anchor': f'N{n}', 'word': entries[id]['headword'],
         'reading': entries[id]['reading'], 'meaning': senses(entries[id])[0]['glosses'][0] if senses(entries[id]) else '',
         'common': entries[id]['common'], 'eligible': eligible(entries[id]),
         'selectedLevel': selected_levels.get(id)}
        for id, n in sorted(anchors.items()) if n in (4, 5) and id not in source_ids
    ]
    output(OUT/'source-shortlist-gaps.json', shortlist_gaps, True)
    for path, payload in outputs.items():
        if args.check:
            assert path.read_bytes() == payload, f'Stale pool output: {path}'
        else: path.write_bytes(payload)
    if not args.check:
        with (OUT/'all-selections.csv').open('w', encoding='utf-8-sig', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(records[0])); w.writeheader(); w.writerows(records)
        for level in LEVELS:
            selected_records = [r for r in records if r['level'] == level]
            sample = selected_records if level == 'A1' else selected_records[:40] + sorted(selected_records[40:-20], key=lambda r: hashlib.sha256(r['id'].encode()).hexdigest())[:60] + selected_records[-20:]
            (OUT/f'{level}-review.md').write_text(f'# {level} review\n\n| Rank | Word | Reading | Meaning | Katakana |\n|---|---|---|---|---|\n' + ''.join(f"| {r['rank']} | {r['word']} | {r['reading']} | {r['meaning'].replace('|','/')} | {r['katakana']} |\n" for r in sample), encoding='utf-8')
    print(json.dumps(report, ensure_ascii=False, indent=2))

if __name__ == '__main__': main()
