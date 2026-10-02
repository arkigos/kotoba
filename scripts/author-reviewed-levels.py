"""Reviewed corrections from the dictionary sample; exact spelling + reading only."""
import json
from pathlib import Path
root = Path(__file__).resolve().parents[1]
entries = [e for p in (root/'public/dictionary/jp/entries').glob('*.json') for e in json.loads(p.read_text(encoding='utf-8')).values()]
reviewed = '''猫|ねこ|A1
耳|みみ|A1
父親|ちちおや|A1
兄弟|きょうだい|A1
親|おや|A2
左手|ひだりて|A2
お子さん|おこさん|A2
カメラマン|カメラマン|A2
セールスマン|セールスマン|A2
ビキニ|ビキニ|A2
サーカス|サーカス|A2
わさび|わさび|A2
ワオ|ワオ|A2
レモンスカッシュ|レモンスカッシュ|A2
港|みなと|A2
指輪|ゆびわ|A2
人間|にんげん|A2
例えば|たとえば|A2
女優|じょゆう|A2
商品|しょうひん|A2
気分|きぶん|A2
やり方|やりかた|A2
専門学校|せんもんがっこう|B1
課長|かちょう|B1
抱っこ|だっこ|B1
税|ぜい|B1
逮捕|たいほ|B1
印象|いんしょう|B1
求める|もとめる|B1
破壊|はかい|B1
展示|てんじ|B1
経済|けいざい|B1
教育|きょういく|B1
様子|ようす|B1
横向き|よこむき|B1
不参加|ふさんか|B1
演出|えんしゅつ|B2
統計|とうけい|B2
調達|ちょうたつ|B2
推論|すいろん|B2
社会保険|しゃかいほけん|B2
倍率|ばいりつ|B2
国歌|こっか|B2
牛革|ぎゅうかわ|B2
和歌|わか|B2
増発|ぞうはつ|B2
待ちわびる|まちわびる|B2
フラッグシップ|フラッグシップ|B2
校閲|こうえつ|C1
免責|めんせき|C1
切迫|せっぱく|C1
資する|しする|C1
空疎|くうそ|C1
酌み交わす|くみかわす|C1
晴耕雨読|せいこううどく|C1
急先鋒|きゅうせんぽう|C1
出世頭|しゅっせがしら|C1
風雅|ふうが|C1
球菌|きゅうきん|C2
チモール|チモール|C2
サイガ|サイガ|C2
非|ひ|B2
くらべ|くらべ|B1
コス|コス|B2
ハイ|ハイ|B1
ソーダ|ソーダ|A2
ビーニー|ビーニー|B1
ラフト|ラフト|B2
リクルーター|リクルーター|B2
コンダクター|コンダクター|B2
トイガン|トイガン|B2
ぼやっと|ぼやっと|B2
なぎ|なぎ|C2
あそこ|あそこ|A1
おにぎり|おにぎり|A1
お菓子|おかし|A1
お父さん|おとうさん|A1
お母さん|おかあさん|A1
お客様|おきゃくさま|A2
お疲れ様|おつかれさま|A2
おしゃれ|おしゃれ|A2
そちら|そちら|A2
この間|このあいだ|A2
だけど|だけど|A2
それとも|それとも|A2
それに|それに|A2
つまらない|つまらない|A2
きちんと|きちんと|A2
きつい|きつい|A2'''
path = root/'data/jp/dictionary/level_overrides.json'
result = json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'version':1,'entries':{}}
for line in reviewed.splitlines():
    surface, reading, level = line.split('|')
    matches = [e for e in entries if surface == e['headword'] and reading == e['reading']]
    if len(matches) != 1:
        raise ValueError((surface,reading,[e['id'] for e in matches]))
    result['entries'][matches[0]['id']] = {'level':level,'basis':'reviewed-study-placement-2026-09-20'}
path.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f"Recorded {len(result['entries'])} reviewed level corrections.")
