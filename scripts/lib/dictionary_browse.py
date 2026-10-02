"""Shared compact dictionary rows for import and offline index rebuilds."""


def dictionary_index_row(entry: dict) -> list:
    # Select a sense allowed for both displayed spelling and displayed reading.
    # The compact label uses its first gloss; full word practice retains all of
    # that sense's glosses. Other forms and meanings remain text-searchable.
    sense = next((sense for sense in entry["senses"] if (
        not sense.get("appliesToSpellings") or entry["headword"] in sense["appliesToSpellings"]
    ) and (not sense.get("appliesToReadings") or entry["reading"] in sense["appliesToReadings"])), None)
    gloss = next(iter(sense["glosses"]), "") if sense else ""
    primary_terms = {entry["headword"], entry["reading"], gloss}
    extra_terms = dict.fromkeys(entry["spellings"] + entry["readings"] + [
        gloss for sense in entry["senses"] for gloss in sense["glosses"]
    ])
    search_text = "\n".join(term for term in extra_terms if term not in primary_terms)
    row = [entry["id"], entry["headword"], entry["reading"], gloss, search_text, int(entry["common"]),
            "|".join(dict.fromkeys(part for sense in entry["senses"] for part in sense["partsOfSpeech"])),
            "|".join(dict.fromkeys(field for sense in entry["senses"] for field in sense.get("fields", [])))]
    if entry.get('placement'):
        row += [entry['placement']['level'], entry['placement']['method'], entry.get('frequency', {}).get('band', 'unranked')]
    return row
