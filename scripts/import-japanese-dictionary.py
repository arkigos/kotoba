#!/usr/bin/env python3
"""Import the complete official English JMdict into deterministic runtime shards.

No package installation is required. Default invocation downloads the latest official
export; use --source and --expect-sha256 to reproduce a previously archived export.
The derived dictionary data retains JMdict's CC BY-SA 4.0 license.
"""

from __future__ import annotations

import argparse
import gzip
import hashlib
import html
import io
import json
from pathlib import Path
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from lib.dictionary_browse import dictionary_index_row


ROOT = Path(__file__).resolve().parents[1]
SOURCE_URL = "https://www.edrdg.org/pub/Nihongo/JMdict_e.gz"
LICENSE_URL = "https://www.edrdg.org/edrdg/licence.html"
CC_LICENSE_URL = "https://creativecommons.org/licenses/by-sa/4.0/legalcode.txt"
DOCUMENTATION_URL = "https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project"
SHARD_COUNT = 64
LANG = "{http://www.w3.org/XML/1998/namespace}lang"
COMMON_PRIORITIES = {"news1", "ichi1", "spec1", "spec2", "gai1"}


def download(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Kotoba-JMdict-Importer/1.0"})
    with urllib.request.urlopen(request, timeout=90) as response:
        return response.read()


def texts(element: ET.Element, tag: str) -> list[str]:
    return ["".join(child.itertext()) for child in element.findall(tag)]


def optional_lists(target: dict, element: ET.Element, mapping: dict[str, str]) -> None:
    for field, tag in mapping.items():
        values = texts(element, tag)
        if values:
            target[field] = values


def convert_entry(element: ET.Element) -> dict:
    sequence = element.findtext("ent_seq")
    if not sequence or not sequence.isdigit():
        raise ValueError("JMdict entry has no valid upstream sequence")
    entry_id = f"jmdict:{sequence}"
    spelling_forms = []
    for spelling in element.findall("k_ele"):
        form = {"text": spelling.findtext("keb")}
        optional_lists(form, spelling, {"info": "ke_inf", "priority": "ke_pri"})
        spelling_forms.append(form)
    reading_forms = []
    for reading in element.findall("r_ele"):
        form = {"text": reading.findtext("reb")}
        if reading.find("re_nokanji") is not None:
            form["noKanji"] = True
        optional_lists(form, reading, {
            "appliesToSpellings": "re_restr", "info": "re_inf", "priority": "re_pri",
        })
        reading_forms.append(form)
    if not reading_forms or any(not form["text"] for form in reading_forms + spelling_forms):
        raise ValueError(f"{entry_id}: empty spelling or reading")
    spellings = [form["text"] for form in spelling_forms]
    readings = [form["text"] for form in reading_forms]
    headword = spellings[0] if spellings else readings[0]
    applicable = [form for form in reading_forms if not form.get("noKanji") and (
        not form.get("appliesToSpellings") or headword in form["appliesToSpellings"]
    )]
    reading = applicable[0]["text"] if applicable else readings[0]
    if spellings and not applicable:
        # Never present a spelling/reading pair explicitly disallowed upstream.
        headword = reading

    senses = []
    inherited_pos: list[str] = []
    for index, sense in enumerate(element.findall("sense"), start=1):
        explicit_pos = texts(sense, "pos")
        if explicit_pos:
            inherited_pos = explicit_pos
        gloss_details = []
        for gloss in sense.findall("gloss"):
            language = gloss.get(LANG, "eng")
            if language != "eng":
                raise ValueError("Expected the English-only JMdict_e export")
            detail = {"text": "".join(gloss.itertext()), "language": language}
            for output, attribute in (("type", "g_type"), ("gender", "g_gend")):
                if gloss.get(attribute):
                    detail[output] = gloss.get(attribute)
            preferred = texts(gloss, "pri")
            if preferred:
                detail["preferredTerms"] = preferred
            gloss_details.append(detail)
        record = {
            "id": f"{entry_id}:sense:{index}",
            "glosses": [gloss["text"] for gloss in gloss_details],
            "partsOfSpeech": list(inherited_pos),
        }
        if not explicit_pos and inherited_pos:
            record["partsOfSpeechInherited"] = True
        optional_lists(record, sense, {
            "appliesToSpellings": "stagk", "appliesToReadings": "stagr",
            "fields": "field", "misc": "misc", "notes": "s_inf", "dialects": "dial",
            "crossReferences": "xref", "antonyms": "ant",
        })
        # Keep marked gloss attributes without repeating ordinary English glosses.
        if any(set(gloss) != {"text", "language"} for gloss in gloss_details):
            record["glossDetails"] = gloss_details
        source_languages = []
        for source in sense.findall("lsource"):
            source_languages.append({
                "text": "".join(source.itertext()), "language": source.get(LANG, "eng"),
                "type": source.get("ls_type", "full"), "wasei": source.get("ls_wasei") == "y",
            })
        if source_languages:
            record["sourceLanguages"] = source_languages
        # JMdict_e normally has no examples. Fail rather than silently discard them
        # if someone passes the separately licensed example-sentence distribution.
        if sense.find("example") is not None:
            raise ValueError("Use JMdict_e, not the example-sentence distribution")
        for restriction in record.get("appliesToSpellings", []):
            if restriction not in spellings:
                raise ValueError(f"{record['id']}: unknown spelling restriction")
        for restriction in record.get("appliesToReadings", []):
            if restriction not in readings:
                raise ValueError(f"{record['id']}: unknown reading restriction")
        senses.append(record)
    for form in reading_forms:
        if any(value not in spellings for value in form.get("appliesToSpellings", [])):
            raise ValueError(f"{entry_id}: unknown reading/spelling restriction")
    if not senses:
        raise ValueError(f"{entry_id}: no senses")
    record = {
        "id": entry_id, "headword": headword, "reading": reading,
        "spellings": spellings, "readings": readings, "senses": senses,
        "common": any(COMMON_PRIORITIES.intersection(form.get("priority", []))
                      for form in spelling_forms + reading_forms),
        "source": "jmdict", "readingForms": reading_forms,
    }
    if spelling_forms:
        record["spellingForms"] = spelling_forms
    return record


def write_json(path: Path, value: object, *, pretty: bool = False) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2 if pretty else None,
                               separators=None if pretty else (",", ":")) + "\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", "--input", dest="input", type=Path, help="Use an archived official JMdict_e.gz or XML export")
    parser.add_argument("--expect-sha256", help="Require the source payload to have this SHA-256")
    parser.add_argument("--output", type=Path, default=ROOT / "public/dictionary/jp")
    parser.add_argument("--source-metadata", type=Path, default=ROOT / "data/jp/dictionary/source.json")
    parser.add_argument("--allow-small", action="store_true", help="Allow tiny fixtures for importer checks")
    args = parser.parse_args()
    payload = args.input.read_bytes() if args.input else download(SOURCE_URL)
    source_hash = hashlib.sha256(payload).hexdigest()
    if args.expect_sha256 and source_hash != args.expect_sha256.lower():
        raise ValueError(f"Source SHA-256 differs: {source_hash}")
    xml = (gzip.decompress(payload) if payload.startswith(b"\x1f\x8b") else payload).decode("utf-8")
    date_match = re.search(r"JMdict created:\s*(\d{4}-\d{2}-\d{2})", xml)
    if not date_match and not args.allow_small:
        raise ValueError("The official source creation date is missing")
    source_date = date_match.group(1) if date_match else "fixture"
    archived_source = None
    if not args.allow_small:
        extension = ".xml.gz" if payload.startswith(b"\x1f\x8b") else ".xml"
        archive_directory = ROOT / "data/jp/dictionary/upstream"
        archive_directory.mkdir(parents=True, exist_ok=True)
        archive_path = archive_directory / f"JMdict_e-{source_date}{extension}"
        if archive_path.exists() and hashlib.sha256(archive_path.read_bytes()).hexdigest() != source_hash:
            archive_path = archive_directory / f"JMdict_e-{source_date}-{source_hash[:12]}{extension}"
        if not archive_path.exists():
            archive_path.write_bytes(payload)
        archived_source = archive_path.relative_to(ROOT).as_posix()
    entities = {name: html.unescape(label) for name, label in re.findall(r'<!ENTITY\s+([\w-]+)\s+"([^"]*)"\s*>', xml)}
    dtd_end = xml.find("]>")
    if dtd_end < 0:
        raise ValueError("Expected official JMdict DTD and entity definitions")
    dtd = xml[:dtd_end + 2]
    body = xml[dtd_end + 2:]
    # Preserve entity codes. Labels live once in tags.json rather than being
    # expanded into every entry (which also makes conjugation codes usable).
    body = re.sub(r"&([\w-]+);", lambda match: match.group(1) if match.group(1) in entities else match.group(0), body)
    shards: list[dict] = [{} for _ in range(SHARD_COUNT)]
    index = []
    sense_count = 0
    restricted_entries = 0
    for _event, element in ET.iterparse(io.StringIO(body), events=("end",)):
        if element.tag != "entry":
            continue
        entry = convert_entry(element)
        shard = shards[int(entry["id"].split(":")[1]) % SHARD_COUNT]
        if entry["id"] in shard:
            raise ValueError(f"Duplicate upstream sequence: {entry['id']}")
        shard[entry["id"]] = entry
        index.append(dictionary_index_row(entry))
        sense_count += len(entry["senses"])
        restricted_entries += int(any(form.get("appliesToSpellings") or form.get("noKanji") for form in entry["readingForms"])
                                  or any(sense.get("appliesToSpellings") or sense.get("appliesToReadings") for sense in entry["senses"]))
        element.clear()
    if len(index) < 100_000 and not args.allow_small:
        raise ValueError(f"Only {len(index)} entries: refusing to replace the comprehensive dictionary")
    index.sort(key=lambda row: int(row[0].split(":")[1]))
    shard_files = []
    for number, shard in enumerate(shards):
        ordered = dict(sorted(shard.items(), key=lambda pair: int(pair[0].split(":")[1])))
        destination = args.output / "entries" / f"{number:02x}.json"
        write_json(destination, ordered)
        contents = destination.read_bytes()
        shard_files.append({"path": f"/dictionary/jp/entries/{number:02x}.json", "entries": len(shard),
                            "bytes": len(contents), "sha256": hashlib.sha256(contents).hexdigest()})
    write_json(args.output / "index.json", index)
    write_json(args.output / "tags.json", dict(sorted(entities.items())), pretty=True)
    source = {
        "id": "jmdict", "name": "JMdict (Japanese-English)", "publisher": "Electronic Dictionary Research and Development Group",
        "url": SOURCE_URL, "documentationUrl": DOCUMENTATION_URL,
        "sourceDate": source_date, "sha256": source_hash, "payloadBytes": len(payload),
        "archivePath": archived_source,
        "license": "CC-BY-SA-4.0", "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
        "noticeUrl": LICENSE_URL,
        "attribution": "This application uses JMdict dictionary data, copyright James William Breen and the Electronic Dictionary Research and Development Group (EDRDG), under CC BY-SA 4.0.",
        "modifications": "English-only export converted to JSON shards; entity codes retained with labels; effective inherited POS expanded; compact search index added. No proficiency levels inferred.",
        "updateCommand": "python scripts/import-japanese-dictionary.py",
        "updatePolicy": "Refresh before releases and at least monthly for a deployed dictionary service; preserve local authored IDs and reviewed sense mappings across updates.",
        "reproduction": "Original source payloads are archived in data/jp/dictionary/upstream. Use --source ARCHIVE_PATH --expect-sha256 SHA256 to reproduce this export. The upstream daily URL is not a historical archive.",
    }
    manifest = {
        "schemaVersion": 1, "language": "jp", "source": source,
        "entryCount": len(index), "senseCount": sense_count,
        "shardCount": SHARD_COUNT, "shardAlgorithm": "numeric JMdict sequence modulo 64, formatted as two lowercase hexadecimal digits",
        "shardPath": "/dictionary/jp/entries/{shard}.json", "indexPath": "/dictionary/jp/index.json",
        "indexColumns": ["id", "headword", "reading", "firstGloss", "additionalSearchText", "common(0|1)", "partsOfSpeech(pipe-delimited)", "fields(pipe-delimited)"],
        "tagLabelsPath": "/dictionary/jp/tags.json", "attributionPath": "/dictionary/jp/ATTRIBUTION.md",
        "identityPolicy": "JMdict sequence IDs are durable entry identities. Sense IDs use source-order positions and are scoped to sourceDate; never use them alone as permanent learner-history keys.",
        "shards": shard_files,
    }
    write_json(args.output / "manifest.json", manifest, pretty=True)
    write_json(args.source_metadata, {"schemaVersion": 1, **source, "entryCount": len(index), "senseCount": sense_count}, pretty=True)
    (args.output / "JMdict-DTD.txt").write_text(dtd + "\n", encoding="utf-8")
    # Keep complete upstream notices alongside redistributed data, independent
    # of whether users have network access when inspecting the dictionary.
    if not args.allow_small:
        for name, url in (("EDRDG-LICENSE.html", LICENSE_URL), ("CC-BY-SA-4.0.txt", CC_LICENSE_URL)):
            (args.output / name).write_bytes(download(url))
    (args.output / "ATTRIBUTION.md").write_text(
        "# Dictionary data attribution\n\n" + source["attribution"] + "\n\n"
        f"Source: [official JMdict English export]({SOURCE_URL}), dated {source_date}.\n\n"
        f"[JMdict documentation]({DOCUMENTATION_URL}) · [EDRDG notice]({LICENSE_URL}) · "
        "[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Complete notices and the source DTD are included in this directory.\n\n"
        + source["modifications"] + " This attribution does not imply endorsement by EDRDG. "
        "Derived dictionary data in this directory is distributed under CC BY-SA 4.0; it is separate from Kotoba application code.\n\n"
        "Entry IDs retain upstream sequence numbers. Sense numbers can shift between source versions. "
        "Spelling/reading restrictions and all sense metadata must be considered before using dictionary data to generate language. "
        "Dictionary inclusion alone does not make a word safe for procedural lesson generation.\n\n"
        "## Updating\n\nRun `python scripts/import-japanese-dictionary.py` to refresh from the official source. "
        + source["updatePolicy"] + " The importer records source and shard checksums in manifest.json. "
        + source["reproduction"] + "\n", encoding="utf-8")
    print(json.dumps({"entries": len(index), "senses": sense_count, "restrictedEntries": restricted_entries,
                      "sourceDate": source_date, "sha256": source_hash,
                      "shardBytes": sum(item["bytes"] for item in shard_files),
                      "indexBytes": (args.output / "index.json").stat().st_size}, indent=2))


if __name__ == "__main__":
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    main()
