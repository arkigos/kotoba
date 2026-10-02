import { describe, expect, it } from "vitest";
import { a1CoreWordIdsForTopic, a1Topics, a1WordMetadata } from "../../../packages/dictionary/a1";
import { buildTopicLesson, selectTopicWords } from "../src/topic-course";
import { readState, touchWordHistory } from "../src/state";

describe("greetings as an everyday social scenario", () => {
  it("begins with hello, thanks, and sorry and selects only reviewed pleasantries", async () => {
    localStorage.clear();
    const state = readState();
    const greetingIds = a1CoreWordIdsForTopic("greetings");
    const opening = a1Topics.find(topic => topic.id === "greetings")!.introductionWordIds!;
    expect(selectTopicWords(state, "greetings").wordIds).toEqual(opening);
    expect(opening.slice(0,3)).toEqual(["konnichiwa","arigatou","sumimasen"]);
    await expect(buildTopicLesson(state,"greetings")).rejects.toThrow(/One-word cards are not allowed/);
    expect(state.wordHistory).toEqual({});
  });

  it("keeps known occupations out of greeting examples as incidental helpers", async () => {
    localStorage.clear();
    const state = readState();
    const occupations = ["enjinia", "kaishain", "koomuin", "kyooshi", "shufu"];
    state.wordHistory = touchWordHistory(state, { wordIds: occupations, kind: "reading" });
    const before=JSON.stringify(state);
    await expect(buildTopicLesson(state,"greetings")).rejects.toThrow(/No supported sentence context/);
    expect(JSON.stringify(state)).toBe(before);
  });
});
