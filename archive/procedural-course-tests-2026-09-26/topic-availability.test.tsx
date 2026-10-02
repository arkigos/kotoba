import {beforeEach,expect,it,vi} from "vitest";
import {fireEvent,render,screen} from "@testing-library/react";
import {a1CoreWordIdsForTopic,a1Topics} from "../../../packages/dictionary/a1";
import {availableTopicMode,buildTopicLesson,canBuildTopicLesson,DEFAULT_TOPIC_WORDS} from "../src/topic-course";
import {readState,touchWordHistory} from "../src/state";
import {assertLessonCardQuality} from "../src/lesson-card-quality";
import {assertLessonVocabulary} from "../src/lesson-vocabulary";
import {App} from "../src/App";
import {TopicCourseView} from "../src/TopicCourseView";

beforeEach(()=>{localStorage.clear();window.location.hash="#learn";});
it("offers only actually buildable default topics without modifying a fresh or practiced profile",async()=>{
 const fresh=readState();
 const practiced={...fresh,wordHistory:touchWordHistory(fresh,{wordIds:["watashi","anata","gakusei","sensei","hito","nihongo","eigo","yomu","kaku","nomu","taberu","resutoran","mizu","pan"],kind:"reading"})};
 expect(DEFAULT_TOPIC_WORDS).toBe(12);
 for(const state of [fresh,practiced]) {
  const before=structuredClone(state);let available=0;
  for(const topic of a1Topics) {
   if(canBuildTopicLesson(state,topic.id)) {
    const {session}=await buildTopicLesson(state,topic.id);
    expect(()=>assertLessonCardQuality(session.savedCards!)).not.toThrow();
    expect(()=>assertLessonVocabulary(session.savedCards!,session.targetWordIds!,state)).not.toThrow();
    expect(session.items.length).toBeLessThanOrEqual(48);available++;
   } else await expect(buildTopicLesson(state,topic.id)).rejects.toThrow();
  }
  expect(available).toBeGreaterThan(0);expect(state).toEqual(before);
 }
 expect(availableTopicMode(fresh,"greetings")).toBeUndefined();
});
it("recomputes availability for changed practice history while retaining topic preferences",()=>{
 const state=readState();expect(canBuildTopicLesson(state,"food")).toBe(true);
 const next={...state,wordHistory:touchWordHistory(state,{wordIds:a1CoreWordIdsForTopic("food"),kind:"reading"})};
 expect(canBuildTopicLesson(next,"food")).toBe(false);
 expect(canBuildTopicLesson(state,"food")).toBe(true);
 expect(next.a1Journey).toEqual(state.a1Journey);
});
it("hides blocked starter topics in both Learn and topic search",()=>{
 render(<App/>);
 expect(screen.queryByRole("button",{name:"Practice Greetings & pleasantries"})).not.toBeInTheDocument();
 expect(screen.getByRole("button",{name:"Practice Food & eating out"})).toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Search Kotoba"}));
 fireEvent.change(screen.getByRole("textbox",{name:"Search topics and lessons"}),{target:{value:"greetings"}});
 expect(screen.queryByRole("button",{name:"Greetings & pleasantries"})).not.toBeInTheDocument();
 expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it("does not open an invalid starter preview from a stale topic focus",()=>{
 render(<TopicCourseView state={readState()} initialTopic="greetings" onToggleTopic={vi.fn()} onSession={vi.fn()} onBuild={vi.fn()}/>);
 expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
 expect(screen.getByRole("button",{name:"Practice Food & eating out"})).toBeInTheDocument();
});
