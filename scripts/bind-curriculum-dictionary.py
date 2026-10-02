#!/usr/bin/env python3
"""Bind durable curriculum word IDs to conservative JMdict or explicit local entries.

The imported dictionary is reference data. teaching_words.json owns course
glosses, taught forms, levels, and learner-history IDs. Normal binding never
reloads those fields from frozen curriculum. No reading-only or automatic
deconjugation match is accepted without meaning/POS corroboration.
"""

from __future__ import annotations

import argparse
from collections import Counter, defaultdict
import json
from pathlib import Path
import re
import unicodedata

ROOT = Path(__file__).resolve().parents[1]
RECOGNITION = {"hiragana", "katakana", "kanji"}
GRAMMAR = {"particle", "copula", "sentence ending", "request phrase", "permission phrase", "prohibition phrase", "ongoing action phrase"}


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8-sig"))


def write_json(path: Path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def primary_form(value: str) -> str:
    """Authored convention: text before bracketed notes or slash alternatives.

    This never derives a lemma. かえます（かいます） remains かえます; きれい（な）
    becomes きれい. The original teaching text is retained in its binding.
    """
    normalized = unicodedata.normalize("NFKC", value).strip()
    normalized = re.split(r"[(/／]", normalized, maxsplit=1)[0]
    return re.sub(r"\s+", "", normalized).strip("？！?!。.,、…")


def glosses(value: str) -> set[str]:
    # Keep whole gloss phrases: "day" must not match "day after tomorrow".
    phrases = re.split(r"[;/]", value.lower())
    result = set()
    for phrase in phrases:
        # "English (language)" corroborates either "English" or the authored
        # "English language", without accepting arbitrary substring matches.
        for variant in [re.sub(r"\([^)]*\)", "", phrase), phrase.replace("(", " ").replace(")", " ")]:
            variant = re.sub(r"^(?:to |a |an |the )", "", variant.strip())
            variant = re.sub(r"[^a-z0-9' -]", " ", variant)
            variant = re.sub(r"\s+", " ", variant).strip()
            if variant:
                result.add(variant)
    return result


def pos_compatible(function: str, tags: list[str]) -> bool:
    if function == "verb":
        return any(tag.startswith("v") and tag not in {"vulg"} for tag in tags)
    if function == "adjective":
        return any(tag.startswith("adj-") for tag in tags)
    if function == "adverb":
        return any(tag in {"adv", "adv-to", "n-adv", "conj", "int"} for tag in tags)
    if function == "phrase":
        return any(tag in {"exp", "int", "adv", "conj", "n"} for tag in tags)
    if function == "person":
        return any(tag in {"n", "pn", "n-suf", "suf"} for tag in tags)
    if function == "proper":
        return any(tag in {"n", "n-pr"} for tag in tags)
    if function in {"noun", "place", "quantity", "time"}:
        return any(tag.startswith("n") or tag in {"ctr", "pn", "adv"} for tag in tags)
    return False


def compatible_senses(entry: dict, surface: str, reading: str, word: dict) -> list[str]:
    written = surface in entry["spellings"]
    if not written and surface not in entry["readings"]:
        return []
    readings = [form for form in entry["readingForms"] if form["text"] == reading]
    if written:
        readings = [form for form in readings if not form.get("noKanji") and (
            not form.get("appliesToSpellings") or surface in form["appliesToSpellings"])]
    if not readings:
        return []
    meanings = glosses(word["meaning"])
    matches = []
    for sense in entry["senses"]:
        # Ordinary starter vocabulary does not license dialect, archaic, or
        # marked-register senses, nor auxiliary constructions of a main verb.
        if sense.get("dialects") or set(sense.get("misc", [])) & {"arch", "obs", "rare", "sl", "derog", "vulg"}:
            continue
        if word["function"] == "verb" and "aux-v" in sense["partsOfSpeech"]:
            continue
        if sense.get("appliesToReadings") and reading not in sense["appliesToReadings"]:
            continue
        # A kana-only teaching form cannot establish a sense restricted to a
        # particular kanji spelling. Leave that selection for explicit review.
        if sense.get("appliesToSpellings") and (not written or surface not in sense["appliesToSpellings"]):
            continue
        if not pos_compatible(word["function"], sense["partsOfSpeech"]):
            continue
        if any(meanings.intersection(glosses(gloss)) for gloss in sense["glosses"]):
            matches.append(sense["id"])
    return matches


def local_entry(word: dict, binding: dict) -> dict:
    category = "recognition" if word["function"] in RECOGNITION else "grammar" if word["function"] in GRAMMAR else "course"
    entry_id = f"kotoba:{word['id']}"
    headword = primary_form(word["surface"]) or word["surface"]
    reading = primary_form(word["reading"]) or word["reading"]
    result = {
        "id": entry_id, "headword": headword, "reading": reading,
        "spellings": [headword], "readings": [reading],
        "readingForms": [{"text": reading}], "spellingForms": [{"text": headword}],
        "senses": [{"id": f"{entry_id}:sense:1", "glosses": [word["meaning"]], "partsOfSpeech": [word["function"]]}],
        "common": False, "source": "kotoba", "category": category,
    }
    if binding.get("audioText"):
        result["audioText"] = binding["audioText"]
    return result


def bootstrap_teaching_words(path: Path):
    """One-time migration, explicitly requested and never replacing authored data."""
    if path.exists():
        raise FileExistsError(f"Refusing to replace primary dictionary authoring data: {path}")
    source = read_json(ROOT / "data/jp/curriculum/source/unit_specs.json")
    levels = read_json(ROOT / "data/jp/curriculum/course_levels.json")["levels"]
    authored = {}
    for unit in source["units"]:
        for word in unit["newWords"]:
            if word["id"] in authored:
                raise ValueError(f"Duplicate course word ID: {word['id']}")
            level = next((level["code"] for level in levels if level["unitStart"] <= unit["id"] <= level["unitEnd"]), None)
            if level is None:
                raise ValueError(f"No reviewed course placement for {word['id']}")
            authored[word["id"]] = {**word, "level": level, "introducedInUnit": unit["id"]}
    for filename in ["function_words.json", "grammar_tokens.json"]:
        for word in read_json(ROOT / "data/jp/curriculum" / filename):
            if word["id"] in authored:
                raise ValueError(f"Grammar ID collides with course word: {word['id']}")
            authored[word["id"]] = {**word, "level": "A1", "introducedInUnit": None}
    payload = {
        "schemaVersion": 1,
        "bootstrapSource": "data/jp/curriculum/source/unit_specs.json",
        "bootstrapReferences": ["data/jp/curriculum/course_levels.json", "data/jp/curriculum/function_words.json", "data/jp/curriculum/grammar_tokens.json"],
        "description": "Primary authored teaching words, forms, glosses, progression, and stable learning IDs. Edit this file for dictionary teaching content; binding never refreshes it from legacy curriculum.",
        "words": dict(sorted(authored.items())),
    }
    path.parent.mkdir(parents=True, exist_ok=True)
    # Exclusive creation also prevents a concurrent bootstrap overwriting it.
    with path.open("x", encoding="utf-8", newline="\n") as target:
        target.write(json.dumps(payload, ensure_ascii=False, indent=2) + "\n")
    print(f"Bootstrapped {len(authored)} teaching words. Review {path}; run binding separately.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dictionary", type=Path, default=ROOT / "public/dictionary/jp")
    parser.add_argument("--output", type=Path, default=ROOT / "data/jp/dictionary")
    parser.add_argument("--bootstrap-from-curriculum", action="store_true",
                        help="Create the primary teaching_words.json once from legacy curriculum, then exit. Refuses to replace an existing file.")
    args = parser.parse_args()
    teaching_path = ROOT / "data/jp/dictionary/teaching_words.json"
    if args.bootstrap_from_curriculum:
        bootstrap_teaching_words(teaching_path)
        return
    if not teaching_path.exists():
        raise FileNotFoundError("Missing dictionary teaching_words.json. Use --bootstrap-from-curriculum only for an intentional initial legacy migration.")
    teaching = read_json(teaching_path)
    if teaching.get("schemaVersion") != 1 or not isinstance(teaching.get("words"), dict):
        raise ValueError("Invalid teaching_words.json schema")
    authored = teaching["words"]
    for word_id, word in authored.items():
        if word.get("id") != word_id or word.get("level") not in {"Kana", "A1", "A2", "B1", "B2", "C1", "C2"}:
            raise ValueError(f"Teaching word requires a matching stable ID and authored placement: {word_id}")

    wanted_readings = {primary_form(word["reading"]) for word in authored.values() if word["function"] not in RECOGNITION | GRAMMAR}
    by_reading = defaultdict(list)
    dictionary_entries = {}
    shard_paths = sorted((args.dictionary / "entries").glob("*.json"))
    if len(shard_paths) != 64:
        raise ValueError(f"Expected all 64 JMdict shards, found {len(shard_paths)}")
    scanned = 0
    for path in shard_paths:
        for entry in read_json(path).values():
            scanned += 1
            shared = wanted_readings.intersection(entry["readings"])
            if shared:
                dictionary_entries[entry["id"]] = entry
                for reading in shared:
                    by_reading[reading].append(entry)
    manifest = read_json(args.dictionary / "manifest.json")
    if scanned != manifest["entryCount"]:
        raise ValueError("JMdict shard entry count differs from manifest")

    overrides = read_json(args.output / "overrides.json")["words"]
    unknown_overrides = set(overrides) - set(authored)
    if unknown_overrides:
        raise ValueError(f"Unknown override IDs: {unknown_overrides}")
    bindings, entries, ambiguous, unmatched, audio_primary, audio_review = {}, {}, [], [], [], []
    for word_id, word in sorted(authored.items()):
        binding = {field: word[field] for field in ["surface", "reading", "meaning", "function", "level", "introducedInUnit"]}
        primary = primary_form(word["reading"])
        audio_text = word.get("audioText") or primary
        if word["function"] == "particle":
            audio_text = {"は": "わ", "へ": "え", "を": "お"}.get(word["surface"], audio_text)
        if not audio_text or re.search(r"[()（）/／]", audio_text):
            raise ValueError(f"No safe primary pronunciation for {word_id}: {audio_text!r}")
        binding["audioText"] = audio_text
        if audio_text != word["reading"]:
            audio_primary.append({"wordId": word_id, "authoredReading": word["reading"], "audioText": audio_text,
                                  "method": "particle-pronunciation" if word["function"] == "particle" else "authored-audio-override" if word.get("audioText") else "primary-display-form"})
        if re.search(r"[(/／]", unicodedata.normalize("NFKC", word["reading"])) and not re.search(r"[（(]な[）)]$", word["reading"]):
            audio_review.append({"wordId": word_id, "authoredReading": word["reading"], "audioText": audio_text,
                                 "note": "Only the primary displayed form is voiced; alternative forms need separate pronunciation records."})

        surface = primary_form(word["surface"])
        candidates = []
        if word["function"] not in RECOGNITION | GRAMMAR:
            for entry in by_reading.get(primary, []):
                sense_ids = compatible_senses(entry, surface, primary, word)
                if sense_ids:
                    candidates.append((entry, sense_ids))
        if len(candidates) == 1 and word_id not in overrides:
            entry, sense_ids = candidates[0]
            binding.update(entryId=entry["id"], senseIds=sense_ids,
                           match={"method": "spelling-reading-gloss-pos" if surface in entry["spellings"] else "kana-reading-gloss-pos", "status": "linked"})
            entries[entry["id"]] = entry
        else:
            entry = local_entry(word, binding)
            binding.update(entryId=entry["id"], senseIds=[entry["senses"][0]["id"]],
                           match={"method": "recognition" if word["function"] in RECOGNITION else "grammar" if word["function"] in GRAMMAR else "ambiguous" if len(candidates) > 1 else "unmatched", "status": "local"})
            entries[entry["id"]] = entry
            if word_id not in overrides and word["function"] not in RECOGNITION | GRAMMAR:
                report = {"wordId": word_id, "surface": word["surface"], "reading": word["reading"], "meaning": word["meaning"]}
                if len(candidates) > 1:
                    report["candidates"] = [{"entryId": item["id"], "headword": item["headword"], "senseIds": senses} for item, senses in candidates]
                    ambiguous.append(report)
                else:
                    report["readingCandidateCount"] = len(by_reading.get(primary, []))
                    unmatched.append(report)
        bindings[word_id] = binding

    for word_id, override in sorted(overrides.items()):
        target_id = override["targetWordId"]
        if target_id not in bindings or target_id in overrides:
            raise ValueError(f"Alias {word_id} must reference an existing non-alias binding")
        if authored[word_id]["function"] in RECOGNITION | GRAMMAR:
            raise ValueError(f"Recognition/grammar identity cannot be aliased: {word_id}")
        old_entry = bindings[word_id]["entryId"]
        target = bindings[target_id]
        bindings[word_id].update(entryId=target["entryId"], senseIds=target["senseIds"],
                                 match={"method": "reviewed-form-alias", "status": target["match"]["status"], "targetWordId": target_id, "reason": override["reason"]})
        if old_entry.startswith("kotoba:"):
            entries.pop(old_entry, None)

    referenced = {binding["entryId"] for binding in bindings.values()}
    entries = {key: entry for key, entry in entries.items() if key in referenced}
    groups = defaultdict(list)
    for word_id, binding in bindings.items():
        if binding["entryId"] not in entries:
            raise ValueError(f"Unresolved canonical entry for {word_id}")
        valid_senses = {sense["id"] for sense in entries[binding["entryId"]]["senses"]}
        if not set(binding["senseIds"]).issubset(valid_senses):
            raise ValueError(f"Unresolved sense for {word_id}")
        groups[binding["entryId"]].append(word_id)
    shared = [{"entryId": entry_id, "wordIds": ids} for entry_id, ids in groups.items() if len(ids) > 1]
    metadata = {"schemaVersion": 1, "dictionarySourceDate": manifest["source"]["sourceDate"],
                "dictionarySourceSha256": manifest["source"]["sha256"]}
    write_json(args.output / "course_bindings.json", {**metadata, "words": bindings})
    write_json(args.output / "course_entries.json", {**metadata, "entries": dict(sorted(entries.items()))})
    report = {**metadata, "policy": "Exact authored form and reading plus compatible POS and a matching complete English gloss; ambiguity stays local. Explicit reviewed form aliases preserve legacy word IDs. No proficiency level inferred from JMdict.",
              "audioPolicy": "Use authored audioText when present; otherwise voice only the primary form before parenthetical notation or slash alternatives. This does not deconjugate or combine alternate readings.",
              "counts": {"bindings": len(bindings), "curriculumWords": sum(word["function"] not in GRAMMAR for word in authored.values()),
                         "grammarEntries": sum(word["function"] in GRAMMAR for word in authored.values()), "canonicalEntries": len(entries),
                         "linkedBindings": sum(binding["match"]["status"] == "linked" for binding in bindings.values()),
                         "localBindings": sum(binding["match"]["status"] == "local" for binding in bindings.values()),
                         "sharedEntryGroups": len(shared), "methods": dict(Counter(binding["match"]["method"] for binding in bindings.values()))},
              "sharedEntries": shared, "ambiguous": ambiguous, "unmatched": unmatched,
              "primaryPronunciations": audio_primary, "alternativeFormsForReview": audio_review}
    write_json(args.output / "binding-report.json", report)
    print(json.dumps(report["counts"], ensure_ascii=True))


if __name__ == "__main__":
    main()
