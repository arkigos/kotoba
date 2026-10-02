import { describe, expect, it } from "vitest";
import teachingJson from "../data/jp/dictionary/teaching_words.json";
import indexJson from "../data/jp/curriculum/unit_index.json";
import {
  a1CompletionPolicy, a1CoreWordIds, a1CoreWordIdsForTopic,
  a1LearningIdsForCoreWord, a1MetadataForWord, a1Milestones,
  a1Topics, a1WordMetadata,
} from "../packages/dictionary/a1";
import { dictionaryWord } from "../packages/dictionary";
import { recordingForToken } from "../packages/dictionary/audio";

describe("authored A1 scope", () => {
  it("tags exactly the authored A1 teaching items, excluding grammar and raw reference entries", () => {
    const authored = Object.entries(teachingJson.words)
      .filter(([, word]) => word.level === "A1" && typeof word.introducedInUnit === "number")
      .map(([id]) => id).sort();
    expect(authored).toHaveLength(578);
    expect(Object.keys(a1WordMetadata).sort()).toEqual(authored);
    expect(a1MetadataForWord("fw_desu")).toBeUndefined();
    expect(a1MetadataForWord("jmdict:1578850")).toBeUndefined();
    expect(a1MetadataForWord("hiragana_a")).toBeUndefined();
  });

  it("keeps a fixed 450-item scope and counts reviewed aliases once", () => {
    expect(a1CoreWordIds).toHaveLength(450);
    expect(new Set(a1CoreWordIds).size).toBe(450);
    expect(a1CompletionPolicy.coreWordCount).toBe(450);
    const core = new Set(a1CoreWordIds);
    for (const [id, word] of Object.entries(a1WordMetadata)) {
      expect(word.level).toBe("A1");
      if (!word.core) {
        expect(word.coreWordId).toBeUndefined();
        expect(core.has(id)).toBe(false);
        continue;
      }
      expect(core.has(word.coreWordId!)).toBe(true);
      expect(a1MetadataForWord(word.coreWordId!)?.coreWordId).toBe(word.coreWordId);
      expect(word.topicIds).toEqual(a1MetadataForWord(word.coreWordId!)?.topicIds);
    }
    expect(a1MetadataForWord("ikimasu")?.coreWordId).toBe("iku");
    expect(a1LearningIdsForCoreWord("iku")).toEqual(["ikimasu", "iku"]);
    expect(a1MetadataForWord("asagohan")?.coreWordId).toBe("asagohan");
    expect(a1MetadataForWord("asa-gohan")?.coreWordId).toBe("asagohan");
    expect(a1MetadataForWord("shuriken")?.core).toBe(false);
  });

  it("covers every item with valid topics and shares progress pools across interests", () => {
    const ids = new Set(a1Topics.map(topic => topic.id));
    expect(ids.size).toBe(a1Topics.length);
    for (const word of Object.values(a1WordMetadata)) {
      expect(word.topicIds.length).toBeGreaterThan(0);
      expect(new Set(word.topicIds).size).toBe(word.topicIds.length);
      expect(word.topicIds.every(id => ids.has(id))).toBe(true);
    }
    for (const topic of a1Topics) expect(a1CoreWordIdsForTopic(topic.id).length).toBeGreaterThan(0);
    expect(a1CoreWordIdsForTopic("family")).toContain("namae");
    expect(a1CoreWordIdsForTopic("work")).toContain("namae");
    expect(a1CoreWordIdsForTopic("home")).toContain("hon");
    expect(a1CoreWordIdsForTopic("school")).toContain("hon");
    expect(a1CoreWordIdsForTopic("unknown-topic")).toEqual([]);
  });

  it("can pronounce every core representative from existing exact recordings", () => {
    const missing = a1CoreWordIds.filter(id => {
      const word = dictionaryWord(id);
      return !word || !recordingForToken({ ...word, wordId: id });
    });
    expect(missing).toEqual([]);
  });

  it("opens Greetings with everyday pleasantries and keeps professions in Work", () => {
    const topic = a1Topics.find(item => item.id === "greetings")!;
    const pool = a1CoreWordIdsForTopic("greetings");
    expect(topic.title).toBe("Greetings & pleasantries");
    expect(pool.slice(0, 6)).toEqual(["konnichiwa", "arigatou", "sumimasen", "ohayou", "konbanwa", "sayounara"]);
    expect(pool).toEqual(expect.arrayContaining(["hajimemashite", "onegaishimasu", "doomo-arigatoo-gozaimasu", "doozo-yoroshiku"]));
    for (const id of ["enjinia", "kaishain", "koomuin", "kyooshi", "hataraku", "shigoto", "shufu"]) {
      expect(pool).not.toContain(id);
      expect(a1CoreWordIdsForTopic("work")).toContain(id);
      expect(a1MetadataForWord(id)?.core).toBe(true);
      expect(a1MetadataForWord(id)?.level).toBe("A1");
    }
    for (const id of ["kuni", "nihon", "watashi", "anata", "sumu", "namae"]) expect(pool).not.toContain(id);
    for (const item of a1Topics) {
      expect(new Set(item.introductionWordIds ?? []).size).toBe(item.introductionWordIds?.length ?? 0);
      expect((item.introductionWordIds ?? []).every(id => a1CoreWordIdsForTopic(item.id).includes(id))).toBe(true);
    }
    expect(a1Milestones).toHaveLength(10);
    const introduction = a1Milestones.find(item => item.id === "introductions")!;
    expect(introduction.task).toMatch(/Greet someone/);
    expect(introduction.task).not.toMatch(/job|engineer|profession/);
    expect(introduction.sourceCanDoIds).toEqual([1, 5]);
    expect(a1Milestones.filter(item => item.topicIds.includes("greetings")).map(item => item.id)).toEqual(["introductions"]);
  });

  it("anchors self-checks to real source practice and all five CEFR skills", () => {
    const unitIds = new Set(indexJson.units.filter(unit => !unit.kind).map(unit => unit.id));
    const topicIds = new Set(a1Topics.map(topic => topic.id));
    const milestoneIds = new Set(a1Milestones.map(milestone => milestone.id));
    expect(milestoneIds.size).toBe(a1Milestones.length);
    expect(new Set(a1Milestones.flatMap(milestone => milestone.skills))).toEqual(new Set([
      "reading", "writing", "listening", "spoken-interaction", "spoken-production",
    ]));
    for (const milestone of a1Milestones) {
      expect(milestone.task.length).toBeGreaterThan(30);
      expect(milestone.practiceUnitIds.length).toBeGreaterThan(0);
      expect(milestone.practiceUnitIds.every(id => unitIds.has(id))).toBe(true);
      expect(milestone.topicIds.every(id => topicIds.has(id))).toBe(true);
      expect(new URL(milestone.sourceUrl).protocol).toBe("https:");
      expect(milestone.evidenceNote).toContain("Self-assessment");
    }
    for (const topic of a1Topics) expect(topic.milestoneIds.every(id => milestoneIds.has(id))).toBe(true);
    expect(a1CompletionPolicy.certificationClaim).toBe(false);
    expect(a1CompletionPolicy.requiresAllMilestones).toBe(true);
    expect(a1CompletionPolicy.learnedPracticeOccasions).toBe(3);
    expect(a1CompletionPolicy.minimumHoursBetweenOccasions).toBe(24);
  });
});
