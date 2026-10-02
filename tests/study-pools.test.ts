import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { containsKatakana } from "../packages/dictionary";
import type { SearchRow } from "../packages/dictionary";
import pools from "../data/jp/dictionary/study-pools.json";

const rows = JSON.parse(readFileSync("public/dictionary/jp/study-index.json", "utf8")) as SearchRow[];
const byId = new Map(rows.map(row => [row[0], row]));
const find = (word: string) => rows.find(row => row[1] === word)!;

describe("bounded curriculum vocabulary pools", () => {
  it("places the home-welcome greeting in A2 with its greeting sense", () => {
    expect(byId.get("jmdict:1000920")?.slice(1,4)).toEqual(["いらっしゃい", "いらっしゃい", "welcome (greeting a guest)"]);
    expect(byId.get("jmdict:1000920")?.[8]).toBe("A2");
    expect(find("いらっしゃる")?.[8]).toBe("B1");
  });
  it("teaches the polite person reading and a kana conversation transition in A2", () => {
    expect(byId.get("jmdict:1516925")?.slice(1,4)).toEqual(["方","かた","person (polite; かた)"]);
    expect(byId.get("jmdict:1516925")?.[8]).toBe("A2");
    expect(byId.get("jmdict:1516930")?.[2]).toBe("ほう");
    expect(byId.get("jmdict:1406050")?.slice(1,3)).toEqual(["それでは","それでは"]);
    expect(byId.get("jmdict:1406050")?.[8]).toBe("A2");
  });
  it("restores the elementary stopping, uncrowded and book-opening verbs as separate identities", () => {
    for (const [id,word,reading] of [["jmdict:1310670","止める","とめる"],["jmdict:1586265","空く","すく"],["jmdict:1202440","開く","ひらく"]]) {
      expect(byId.get(id)?.slice(0,3)).toEqual([id,word,reading]);
      expect(byId.get(id)?.[8]).toBe("A2");
    }
    expect(byId.get("jmdict:1586270")?.slice(1,3)).toEqual(["開く","あく"]);
    expect(byId.get("jmdict:1586270")?.[8]).toBe("A1");
    expect(find("止まる")?.[8]).toBe("A1");
  });
  it("distinguishes a one-day duration from a calendar date and zero from rei", () => {
    expect(byId.get("jmdict:1576260")?.slice(0, 3)).toEqual(["jmdict:1576260", "一日", "いちにち"]);
    expect(byId.get("jmdict:1576260")?.[8]).toBe("A1");
    expect(byId.get("jmdict:2225040")?.slice(1, 3)).toEqual(["１日", "ついたち"]);
    expect(byId.get("jmdict:2839962")?.slice(1, 3)).toEqual(["ゼロ", "ゼロ"]);
    expect(byId.get("jmdict:2839962")?.[8]).toBe("A1");
    expect(byId.get("jmdict:1557630")?.slice(1, 3)).toEqual(["零", "れい"]);
    expect(byId.get("jmdict:1557630")?.[8]).toBe("A2");
  });
  it("restores reviewed readings omitted from the capped source shortlist", () => {
    const sourceIds = new Set((JSON.parse(readFileSync("public/dictionary/jp/index.json", "utf8")) as SearchRow[]).map(row => row[0]));
    const gaps = JSON.parse(readFileSync("docs/reviews/2026-09-21-level-pools/source-shortlist-gaps.json", "utf8"));
    for (const [id, word, reading] of [["jmdict:1387210", "先", "さき"], ["jmdict:1382440", "石", "いし"]]) {
      expect(sourceIds.has(id)).toBe(false);
      expect(byId.get(id)?.slice(0, 3)).toEqual([id, word, reading]);
      expect(byId.get(id)?.[8]).toBe("A2");
      expect(gaps).toContainEqual(expect.objectContaining({id, word, reading, selectedLevel: "A2"}));
    }
    expect(byId.has("jmdict:1382450")).toBe(false); // 石 / こく is a different word.
  });
  it("keeps the musical playing verb distinct from pull and the flicking homograph", () => {
    expect(find("弾く")?.slice(0, 4)).toEqual(["jmdict:1419370", "弾く", "ひく", "to play (a stringed or keyboard instrument)"]);
    expect(find("弾く")?.[8]).toBe("A1");
    expect(find("引く")?.[0]).toBe("jmdict:1169250");
    expect(find("はじく")?.[0]).toBe("jmdict:1419360");
    expect(byId.has("jmdict:1036170")).toBe(false);
    expect(pools.budgets.A1).toBe(753);
  });
  it("places ordinary overnight-stay vocabulary before advanced study without changing the total pool", () => {
    expect(find("一晩")?.slice(0, 3)).toEqual(["jmdict:1165960", "一晩", "ひとばん"]);
    expect(find("一晩")?.[8]).toBe("B1");
    expect(find("ルームメイト")?.[8]).toBe("B1");
    expect(pools.budgets.B1).toBe(3004);
    expect(pools.budgets.C2).toBe(7998);
    expect(Object.values(pools.budgets).reduce((sum, count) => sum + count, 0)).toBe(25019);
  });
  it("keeps meters and kilometers together in elementary distance vocabulary", () => {
    expect(find("メートル")?.[8]).toBe("A2");
    expect(find("キロメートル")?.[0]).toBe("jmdict:1042650");
    expect(find("キロメートル")?.[8]).toBe("A2");
    expect(pools.budgets.A2).toBe(1267);
    expect(pools.budgets.C1).toBe(6999);
  });
  it("teaches everyday grammar vocabulary by A2 rather than deferring it by raw frequency", () => {
    for (const word of ["くれる", "なる", "やる", "もし", "まま", "つもり", "いただく", "おる", "さっき", "まず", "あんな", "時", "はず", "方", "おにぎり", "もう少し"]) {
      expect(find(word)?.[8], word).toBe("A2");
    }
    expect(find("あまり")[3]).toMatch(/not much/);
  });
  it("contains the reviewed 25,012 distinct entries with disjoint level budgets and consecutive ranks", () => {
    expect(rows).toHaveLength(25019);
    expect(byId.size).toBe(25019);
    const all: string[] = [];
    for (const [level, ids] of Object.entries(pools.pools)) {
      expect(ids).toHaveLength(pools.budgets[level as keyof typeof pools.budgets]);
      ids.forEach((id, i) => expect(byId.get(id)?.slice(8)).toEqual([level, level === "A1" ? "reviewed" : "estimated", expect.any(String), i + 1, expect.any(String)]));
      all.push(...ids);
      expect(ids.filter(id => containsKatakana(byId.get(id)![1])).length / ids.length).toBeLessThanOrEqual(.15);
    }
    expect(new Set(all).size).toBe(rows.length);
  });

  it("keeps practical loans early and defers redundant alternatives without changing their spelling", () => {
    for (const word of ["ホテル", "コンビニ", "トイレ", "バス", "コーヒー", "パン", "パソコン", "スマホ"]) expect(find(word)?.[8], word).toBe("A1");
    for (const word of ["スリッパ", "チョコレート", "パスポート", "ベビーカー"]) expect(find(word)?.[8], word).toBe("A2");
    expect(find("誕生日")[8]).toBe("A1");
    expect(find("バースデー")?.[8]).not.toBe("A1");
    expect(find("カレー")[8]).toBe("A1");
    expect(find("名刺")[8]).toBe("A2");
    expect(find("ソーダ")[8]).toBe("A2");
    expect(find("引き戸")[8]).toBe("B1");
    expect(find("お迎え")[8]).toBe("B1");
    expect(find("ボール")?.[8]).toBe("B1");
    expect(find("ボタン")?.[8]).toBe("B1");
    expect(find("破れる")?.[8]).toBe("B1");
    expect(find("かかる")?.[0]).toBe("jmdict:1207590"); // takes time/money, not the disease homophone
    expect(byId.has("jmdict:1609500")).toBe(false); // reference identity remains available outside the bounded pool
    expect(find("脳みそ")[8]).toBe("B2");
    expect(byId.has("jmdict:2740620")).toBe(false); // Korean pronoun in quoted contexts
    expect(byId.has("jmdict:2843386")).toBe(false); // imperial report term
  });

  it("uses the reviewed sense identities rather than common homophones or rare readings", () => {
    expect(find("上")?.[8]).toBe("A1");
    expect(find("飢え")?.[8]).not.toBe("A1");
    expect(find("洗濯")?.[8]).toBe("A1");
    expect(find("選択")?.[8]).not.toBe("A1");
    expect(find("りんご")?.slice(1, 3)).toEqual(["りんご", "りんご"]);
    expect(find("メガネ")?.[2]).toBe("メガネ");
    expect(byId.get("jmdict:1000420")?.[8]).toBe("A1"); // that, not the hesitation あの
    expect(byId.get("jmdict:1000430")?.[8]).not.toBe("A1");
    expect(find("２０歳")?.[2]).toBe("はたち");
    expect(byId.get("jmdict:1505090")?.[2]).toBe("ぶん");
    expect(byId.get("jmdict:1157000")?.[8]).toBe("A1"); // easy, not merely kind
    expect(rows.some(row => row[1] === "Ω")).toBe(false);
    expect(byId.has("jmdict:2028990")).toBe(false); // particle に is grammar, not a quota filler
  });

  it("keeps introductory membership explicit and supports all selected identities in the reference store", () => {
    expect(find("私")[12]).toBe("introductory");
    expect(find("ホテル")[12]).toBe("introductory");
    expect(rows.filter(row => row[12] === "introductory")).toHaveLength(104);
    const shards = new Map<string, Record<string, { spellings: string[]; readings: string[]; senses: Array<{ appliesToSpellings?: string[]; appliesToReadings?: string[] }> }>>();
    const local = JSON.parse(readFileSync("data/jp/dictionary/course_entries.json", "utf8")).entries;
    for (const row of rows) {
      let entry = local[row[0]];
      if (!entry) {
        const shard = (Number(row[0].slice(7)) % 64).toString(16).padStart(2, "0");
        if (!shards.has(shard)) shards.set(shard, JSON.parse(readFileSync(`public/dictionary/jp/entries/${shard}.json`, "utf8")));
        entry = shards.get(shard)![row[0]];
      }
      expect(entry, row[0]).toBeDefined();
      expect(entry.readings, row[0]).toContain(row[2]);
      expect(entry.senses.some((s: { appliesToSpellings?: string[]; appliesToReadings?: string[] }) => (!s.appliesToSpellings?.length || s.appliesToSpellings.includes(row[1])) && (!s.appliesToReadings?.length || s.appliesToReadings.includes(row[2]))), row[0]).toBe(true);
    }
  });
});
