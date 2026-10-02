import bindingsJson from "../../data/jp/dictionary/course_bindings.json";
import entriesJson from "../../data/jp/dictionary/course_entries.json";
import starterEntriesJson from "../../data/jp/dictionary/starter_entries.json";
import curatedAliases from "../../data/jp/dictionary/curated-course-aliases.json";
import audioFunctionForms from "../../data/jp/dictionary/audio_function_forms.json";
import type { DictionaryEntry, DictionaryWord, SearchRow, WordBinding } from "./types";
export type * from "./types";

export const wordBindings = bindingsJson.words as Record<string, WordBinding>;
const entries = new Map<string, DictionaryEntry>(Object.entries({ ...entriesJson.entries, ...starterEntriesJson.entries } as Record<string, DictionaryEntry>));
const words = new Map<string, DictionaryWord>();
const pendingEntries = new Map<string, Promise<DictionaryEntry>>();
let searchIndex: Promise<SearchRow[]> | undefined;
let studyPoolIndex: Promise<SearchRow[]> | undefined;

/** Explicit curriculum pools are separate from reference estimates and frozen
 * course placements. Loading them never creates practice history or support. */
export async function loadStudyPoolIndex(baseUrl = "/"): Promise<SearchRow[]> {
  if (!studyPoolIndex) studyPoolIndex = (async () => {
    const response = await fetch(`${baseUrl}dictionary/jp/study-index.json`);
    if (!response.ok) throw new Error("Study pools could not load. Please try again.");
    const rows = await response.json() as SearchRow[];
    if (!Array.isArray(rows) || rows.some(row => !Array.isArray(row) || !row[8] || !row[11] || !row[12])) throw new Error("Study pool data is incomplete. Please try again.");
    return rows;
  })().catch(error => { studyPoolIndex = undefined; throw error; });
  return studyPoolIndex;
}

/** JMdict sense restrictions apply to the exact displayed form and reading. */
function senseForForm(entry: DictionaryEntry, surface = entry.headword, reading = entry.reading) {
  return entry.senses.find(sense => (!sense.appliesToSpellings?.length || sense.appliesToSpellings.includes(surface))
    && (!sense.appliesToReadings?.length || sense.appliesToReadings.includes(reading)));
}

/** A legacy learning ID selects a form/gloss; the entry owns lexical identity. */
export function dictionaryWord(id: string): DictionaryWord | undefined {
  const cached = words.get(id);
  if (cached) return cached;
  const binding = wordBindings[id];
  const entry = entries.get(binding?.entryId ?? id);
  if (!entry) return undefined;
  const surface = binding?.surface ?? entry.headword;
  const reading = binding?.reading ?? entry.reading;
  const sense = senseForForm(entry, surface, reading);
  const word: DictionaryWord = {
    id, dictionaryEntryId: entry.id,
    surface, reading,
    meaning: binding?.meaning ?? sense?.glosses.join("; ") ?? "",
    function: binding?.function ?? sense?.partsOfSpeech.join("; ") ?? "word",
    ...(binding?.level || entry.placement ? { level: binding?.level ?? entry.placement!.level } : {}),
    ...(entry.placement ? { placement: entry.placement } : {}),
    ...(entry.frequency ? { frequency: entry.frequency } : {}),
    ...(typeof binding?.introducedInUnit === "number" ? { introducedInUnit: binding.introducedInUnit } : {}),
    ...(binding?.audioText ? { audioText: binding.audioText } : {}),
    ...(binding?.senseIds?.length ? { dictionarySenseIds: binding.senseIds } : {}),
  };
  words.set(id, word);
  return word;
}
export function courseDictionaryWords() {
  return Object.keys(wordBindings).filter(id => typeof wordBindings[id].introducedInUnit === "number").map(id => dictionaryWord(id)!);
}
export function dictionaryEntry(id: string) { return entries.get(wordBindings[id]?.entryId ?? id); }
export function learningIdsForEntry(entryId: string) {
  return Object.keys(wordBindings).filter(id => wordBindings[id].entryId === entryId);
}
export function placementForEntry(entryId: string) {
  const authored = [...new Set(learningIdsForEntry(entryId).map(id => wordBindings[id].level).filter(Boolean))];
  return authored.length ? authored : entries.get(entryId)?.placement ? [entries.get(entryId)!.placement!.level] : [];
}
export function entryIdForWord(wordId: string) { return wordBindings[wordId]?.entryId ?? (wordId.startsWith("jmdict:") ? wordId : undefined); }
/** Reviewed links reconcile historical local IDs with the bounded study pools. */
export function studyEntryIdForWord(wordId: string) {
  const id = entryIdForWord(wordId) ?? wordId;
  return (curatedAliases.aliases as Record<string, string>)[id] ?? id;
}

export function grammarEntryForForm(surface: string) {
  return Object.values(wordBindings).find(binding => typeof binding.introducedInUnit !== "number" && binding.surface === surface)?.entryId
    ?? (audioFunctionForms.forms as Record<string, {entryId: string}>)[surface]?.entryId;
}

export async function loadDictionaryEntry(id: string, baseUrl = "/"): Promise<DictionaryEntry> {
  const entryId = wordBindings[id]?.entryId ?? id;
  const cached = entries.get(entryId);
  if (cached) return cached;
  const existing = pendingEntries.get(entryId);
  if (existing) return existing;
  if (!/^jmdict:\d+$/.test(entryId)) throw new Error("This dictionary entry is unavailable.");
  const promise = (async () => {
    const shard = (Number(entryId.slice(7)) % 64).toString(16).padStart(2, "0");
    const response = await fetch(`${baseUrl}dictionary/jp/entries/${shard}.json`);
    if (!response.ok) throw new Error("Dictionary download failed. Please try again when connected.");
    const data = await response.json() as Record<string, DictionaryEntry>;
    for (const [key, entry] of Object.entries(data)) entries.set(key, entry);
    const entry = entries.get(entryId);
    if (!entry) throw new Error("This dictionary entry was not found in the installed edition.");
    return entry;
  })();
  pendingEntries.set(entryId, promise);
  try { return await promise; } finally { pendingEntries.delete(entryId); }
}
export async function loadDictionaryIndex(baseUrl = "/"): Promise<SearchRow[]> {
  if (!searchIndex) searchIndex = (async () => {
    const response = await fetch(`${baseUrl}dictionary/jp/index.json`);
    if (!response.ok) throw new Error("Dictionary search download failed. Please try again.");
    const imported = await response.json() as SearchRow[];
    const local: SearchRow[] = [...entries.values()].filter(entry => entry.source !== "jmdict").map(searchRowForEntry);
    return [...local, ...imported];
  })().catch(error => { searchIndex = undefined; throw error; });
  return searchIndex;
}
export function searchDictionary(rows: SearchRow[], query: string, limit = 60): SearchRow[] {
  const term = query.normalize("NFKC").trim().toLocaleLowerCase();
  if (!term) return rows.slice(0, limit);
  const matches: SearchRow[][] = [[], [], [], []];
  for (const row of rows) {
    const fields = [row[1], row[2], row[3], row[4] ?? ""].map(value => value.normalize("NFKC").toLocaleLowerCase());
    if (!fields.some(value => value.includes(term))) continue;
    const rank = fields.slice(0, 2).includes(term) ? 0 : fields.some(value => value === term) ? 1 : fields.some(value => value.startsWith(term)) ? 2 : 3;
    if (matches[rank].length < limit) matches[rank].push(row);
  }
  return matches.flat().slice(0, limit);
}

export function searchRowForEntry(entry: DictionaryEntry): SearchRow {
  return [entry.id, entry.headword, entry.reading, senseForForm(entry)?.glosses.join("; ") ?? "", "", entry.common ? 1 : 0,
    [...new Set(entry.senses.flatMap(sense => sense.partsOfSpeech))].join("|"),
    [...new Set(entry.senses.flatMap(sense => sense.fields ?? []))].join("|"), entry.placement?.level, entry.placement?.method, entry.frequency?.band];
}

export const frequencyLabels = { "very-common": "Very common", common: "Common", uncommon: "Uncommon", rare: "Rare", unranked: "Limited data" } as const;

export const dictionaryWordTypes = ["Nouns", "Verbs", "Adjectives", "Adverbs", "Pronouns", "Particles", "Numbers & counters", "Expressions", "Other"] as const;
export type DictionaryWordType = typeof dictionaryWordTypes[number];
export function dictionaryWordTypesForRow(row: SearchRow): DictionaryWordType[] {
  const kinds = new Set<DictionaryWordType>();
  for (const part of (row[6] ?? "").split("|")) {
    if (part === "n" || part.startsWith("n-")) kinds.add("Nouns");
    else if (part.startsWith("v") && part !== "vt" && part !== "vi") kinds.add("Verbs");
    else if (part.startsWith("adj")) kinds.add("Adjectives");
    else if (part.startsWith("adv")) kinds.add("Adverbs");
    else if (part === "pn") kinds.add("Pronouns");
    else if (part === "prt") kinds.add("Particles");
    else if (part === "num" || part === "ctr") kinds.add("Numbers & counters");
    else if (part === "exp" || part === "int") kinds.add("Expressions");
  }
  return kinds.size ? [...kinds] : ["Other"];
}

export function filterDictionaryRows(rows: SearchRow[], filters: { common?: boolean; wordType?: string; field?: string }): SearchRow[] {
  return rows.filter(row => (!filters.common || row[5] === 1)
    && (!filters.wordType || dictionaryWordTypesForRow(row).includes(filters.wordType as DictionaryWordType))
    && (!filters.field || (row[7] ?? "").split("|").includes(filters.field)));
}

/** Unit files and old snapshots keep authored card text; metadata resolves centrally. */
export function hydrateUnitWords<T extends {newWords: Array<{id: string}>}>(unit: T): T {
  return { ...unit, newWords: unit.newWords.map(word => dictionaryWord(word.id) ?? word) };
}

/** Writing-system signal only: katakana does not establish English origin. */
export function containsKatakana(text: string): boolean {
  return /[\u30a1-\u30fa\u31f0-\u31ff]/u.test(text.normalize("NFKC"));
}
