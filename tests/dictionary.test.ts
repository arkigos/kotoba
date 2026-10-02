import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import bindingsJson from "../data/jp/dictionary/course_bindings.json";
import sourceJson from "../data/jp/dictionary/source.json";
import audioJson from "../data/jp/dictionary/audio.json";
import {
  containsKatakana, courseDictionaryWords, dictionaryEntry, dictionaryWord, dictionaryWordTypesForRow, entryIdForWord, filterDictionaryRows,
  grammarEntryForForm, learningIdsForEntry, loadDictionaryEntry,
  placementForEntry, searchDictionary, searchRowForEntry,
} from "../packages/dictionary";
import type { DictionaryEntry, SearchRow } from "../packages/dictionary";
import { recordingForToken, speechForToken } from "../packages/dictionary/audio";

afterEach(() => vi.unstubAllGlobals());
let pinnedIndex: Map<string, SearchRow>;

describe("canonical dictionary compatibility", () => {
  it("shares the reviewed です gloss across teaching bindings and dictionary details", () => {
    const meaning = "am; is; are (polite)";
    expect(dictionaryWord("fw_desu")?.meaning).toBe(meaning);
    expect(dictionaryWord(grammarEntryForForm("です")!)?.meaning).toBe(meaning);
    expect(dictionaryEntry("fw_desu")?.senses[0].glosses).toEqual([meaning]);
    const teaching = JSON.parse(readFileSync("data/jp/dictionary/teaching_words.json", "utf8"));
    expect(teaching.words.fw_desu.meaning).toBe(meaning);
  });
  it("resolves authored grammar audio without changing a historical particle identity", () => {
    expect(grammarEntryForForm("を")).toBe("kotoba:fw_o_object");
    expect(grammarEntryForForm("ながら")).toBe("kotoba:curated-form:ながら");
    expect(grammarEntryForForm("。")).toBeUndefined();
    expect(speechForToken({surface:"ながら",reading:"ながら"})).toBe("ながら");
  });
  it("keeps learning IDs and taught verb forms while sharing pinned source identity", () => {
    const lemma = dictionaryWord("iku")!;
    const polite = dictionaryWord("ikimasu")!;
    expect(lemma).toMatchObject({ id: "iku", surface: "行く", reading: "いく", level: "A1" });
    expect(polite).toMatchObject({ id: "ikimasu", surface: "いきます", reading: "いきます", level: "A1" });
    expect(lemma.dictionaryEntryId).toBe("jmdict:1578850");
    expect(polite.dictionaryEntryId).toBe(lemma.dictionaryEntryId);
    expect(dictionaryEntry("ikimasu")).toBe(dictionaryEntry("iku"));
    expect(learningIdsForEntry(lemma.dictionaryEntryId)).toEqual(expect.arrayContaining(["iku", "ikimasu"]));
    expect(bindingsJson.dictionarySourceSha256).toBe(sourceJson.sha256);
    expect(bindingsJson.dictionarySourceDate).toBe(sourceJson.sourceDate);
  });

  it("keeps recognition learning separate and excludes grammar from the 855 course words", () => {
    const course = courseDictionaryWords();
    expect(course).toHaveLength(855);
    expect(new Set(course.map(word => word.id)).size).toBe(855);
    expect(course.filter(word => word.introducedInUnit === 103)).toHaveLength(50);
    expect(dictionaryWord("kanji_mizu")).toMatchObject({ id: "kanji_mizu", level: "Kana", introducedInUnit: 103 });
    expect(entryIdForWord("kanji_mizu")).not.toBe(entryIdForWord("mizu"));
    expect(dictionaryWord("fw_o_object")).not.toHaveProperty("introducedInUnit");
    expect(course.some(word => word.id === "fw_o_object")).toBe(false);
    expect(grammarEntryForForm("を")).toBe("kotoba:fw_o_object");
    expect(speechForToken({ wordId: "fw_o_object", surface: "を", reading: "を" })).toBe("お");
    expect(speechForToken({ wordId: "hiragana_wo", surface: "を", reading: "を" })).toBe("を");
  });

  it("loads an unplaced dictionary entry without inventing an A1 course placement", async () => {
    const unplaced: DictionaryEntry = {
      id: "jmdict:900000001", headword: "試験語", reading: "しけんご",
      spellings: ["試験語"], readings: ["しけんご"], common: true, source: "jmdict",
      senses: [{ id: "jmdict:900000001:sense:1", glosses: ["fixture word"], partsOfSpeech: ["n"] }],
    };
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ [unplaced.id]: unplaced }) });
    vi.stubGlobal("fetch", fetch);
    expect(await loadDictionaryEntry(unplaced.id, "/preview/")).toEqual(unplaced);
    expect(fetch).toHaveBeenCalledWith("/preview/dictionary/jp/entries/01.json");
    expect(dictionaryWord(unplaced.id)).toMatchObject({ id: unplaced.id, surface: "試験語" });
    expect(dictionaryWord(unplaced.id)).not.toHaveProperty("level");
    expect(dictionaryWord(unplaced.id)).not.toHaveProperty("introducedInUnit");
    expect(placementForEntry(unplaced.id)).toEqual([]);
  });

  it.each([
    ["jmdict:1542550", "おんどり", "おんどり", "cock; rooster", "male bird"],
    ["jmdict:2220440", "八万四千", "はちまんよんせん", "84,000", "many"],
    ["jmdict:1583260", "避ける", "さける", "to avoid (situation); to evade (question, subject); to shirk (one's responsibilities)", "to avoid (physical contact with)"],
  ])("respects pinned spelling and reading restrictions for %s", async (id, surface, reading, meaning, excluded) => {
    const shard = (Number(id.slice(7)) % 64).toString(16).padStart(2, "0");
    const data = JSON.parse(readFileSync(`public/dictionary/jp/entries/${shard}.json`, "utf8")) as Record<string, DictionaryEntry>;
    const entry = data[id];
    expect(entry.senses[0].glosses.join("; ")).toBe(excluded);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ [id]: entry }) }));
    await loadDictionaryEntry(id);
    expect(dictionaryWord(id)).toMatchObject({ surface, reading, meaning });
    expect(dictionaryWord(id)?.meaning).not.toBe(excluded);
    expect(searchRowForEntry(entry)[3]).toBe(meaning);
    pinnedIndex ??= new Map((JSON.parse(readFileSync("public/dictionary/jp/reference-index.json", "utf8")) as SearchRow[]).map(row => [row[0], row]));
    expect(pinnedIndex.get(id)?.slice(1, 4)).toEqual([surface, reading, meaning.split("; ")[0]]);
  });

  it("preserves every authored form, reading, gloss, and function override", () => {
    for (const [id, binding] of Object.entries(bindingsJson.words)) {
      expect(dictionaryWord(id)).toMatchObject({ surface: binding.surface, reading: binding.reading, meaning: binding.meaning, function: binding.function });
    }
  });

  it("never falls back to a restricted sense when no sense permits the reference form", async () => {
    const entry: DictionaryEntry = {
      id: "jmdict:900000061", headword: "表示形", reading: "ひょうじけい", spellings: ["表示形", "別形"], readings: ["ひょうじけい"], common: false, source: "jmdict",
      senses: [{ id: "jmdict:900000061:sense:1", glosses: ["inapplicable meaning"], partsOfSpeech: ["n"], appliesToSpellings: ["別形"] }],
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({ [entry.id]: entry }) }));
    await loadDictionaryEntry(entry.id);
    expect(dictionaryWord(entry.id)).toMatchObject({ meaning: "", function: "word" });
    expect(searchRowForEntry(entry)[3]).toBe("");
  });

  it("searches alternate spellings, readings, and glosses in the fifth index field", () => {
    const rows: SearchRow[] = [
      ["jmdict:1", "学校", "がっこう", "school", "學校 academy educational institution"],
      ["jmdict:2", "港", "みなと", "harbor"],
    ];
    expect(searchDictionary(rows, "學校")).toEqual([rows[0]]);
    expect(searchDictionary(rows, "ＡＣＡＤＥＭＹ")).toEqual([rows[0]]);
    expect(searchDictionary(rows, "みなと")).toEqual([rows[1]]);
    expect(searchDictionary(rows, "unmatched")).toEqual([]);
  });

  it("browses the supplied full index without inventing a course-only empty search", () => {
    const rows: SearchRow[] = [
      ["jmdict:1", "学校", "がっこう", "school", "學校", 1, "n", ""],
      ["jmdict:2", "処方", "しょほう", "prescription", "", 0, "n|vs", "med"],
      ["jmdict:3", "描く", "えがく", "draw", "", 1, "v5k|vt", "art"],
    ];
    expect(searchDictionary(rows, "")).toEqual(rows);
    expect(searchDictionary(rows, "", 1)).toEqual([rows[0]]);
    expect(filterDictionaryRows(rows, { common: true, wordType: "Nouns" })).toEqual([rows[0]]);
    expect(filterDictionaryRows(rows, { field: "med" })).toEqual([rows[1]]);
    expect(dictionaryWordTypesForRow(rows[1])).toEqual(["Nouns", "Verbs"]);
    expect(searchDictionary(rows, "med")).toEqual([]);
  });
});

type CatalogRecording = { entryId: string; reading: string; text: string; variant?: string; status: string; ref?: string };
const catalog = Object.values(audioJson.pronunciations) as CatalogRecording[];

describe("dictionary pronunciation resolution", () => {
  it("reuses an available recording independently of displayed spelling", () => {
    const recording = catalog.find(item => item.status === "complete" && item.ref && (!item.variant || item.variant === "default"))!;
    expect(recording).toBeDefined();
    const token = { dictionaryEntryId: recording.entryId, surface: recording.reading, reading: recording.reading, audioText: recording.text };
    expect(recordingForToken(token)).toBe(recording.ref);
    expect(recordingForToken({ ...token, surface: dictionaryEntry(recording.entryId)?.headword ?? token.surface })).toBe(recording.ref);
  });

  it("keeps inflected speech and selects only an exact recording, never the lemma clip", () => {
    const entryId = entryIdForWord("yomu")!;
    const forms = [
      { surface: "読みます", reading: "よみます" },
      { surface: "読みませんでした", reading: "よみませんでした" },
    ];
    for (const form of forms) {
      const token = { ...form, wordId: "yomu" };
      expect(speechForToken(token)).toBe(form.reading);
      const exact = catalog.find(recording => recording.entryId === entryId && recording.reading === form.reading &&
        recording.text === form.reading && (!recording.variant || recording.variant === "default") && recording.status === "complete");
      expect(recordingForToken(token)).toBe(exact?.ref);
    }
    expect(speechForToken({ wordId: "kiree-na", surface: "きれい（な）", reading: "きれい（な）" })).toBe("きれい");
    expect(speechForToken({ wordId: "ii", surface: "よくなかった", reading: "よくなかった" })).toBe("よくなかった");
  });
});

it("flags displayed katakana without claiming loanword origin",()=>{
  expect(containsKatakana("コーヒー")).toBe(true);
  expect(containsKatakana("ｺｰﾋｰ")).toBe(true);
  expect(containsKatakana("Tシャツ")).toBe(true);
  expect(containsKatakana("マンガ")).toBe(true); // Native word, same writing signal.
  expect(containsKatakana("珈琲")).toBe(false); // Borrowing, different writing signal.
  expect(containsKatakana("てんぷら")).toBe(false);
  expect(containsKatakana("学校")).toBe(false);
  expect(containsKatakana("ー・")).toBe(false);
});
