import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../src/App";
import { readState, stateKey, touchWordHistory, writeState } from "../src/state";
import { starterLessons, buildStarterLesson } from "../src/starter-lessons";
import { markLessonAlreadyKnown } from "../src/known-lesson";
import { curatedLessons, loadCuratedLesson } from "../src/curated-course";

const persisted = () => JSON.parse(localStorage.getItem(stateKey)!);
beforeEach(() => {
  localStorage.clear(); window.history.replaceState(null, "", "/#course");
  let state = readState();
  for (const lesson of starterLessons) state = markLessonAlreadyKnown(state, buildStarterLesson(state, lesson.id));
  writeState({ ...state, settings: { ...state.settings, autoplay: false, sound: false } });
});

describe("curated lesson continuity", () => {
  it("keeps legacy builder links on the fixed course without creating a lesson", () => {
    window.history.replaceState(null, "", "/#build");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Learn Japanese" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "A1 topics" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Custom" })).not.toBeInTheDocument();
    expect(readState().activeSession).toBeUndefined();
  });

  it("routes collected words to course selection without inventing sentences", async () => {
    const state=readState();writeState({...state,wordHistory:touchWordHistory(state,{wordIds:["fw_desu"],kind:"saved"})});
    window.history.replaceState(null,"","/#dictionary");render(<App/>);
    fireEvent.click(screen.getByRole("button",{name:/^My words/}));fireEvent.click(screen.getByRole("button",{name:"Find lessons"}));
    expect(await screen.findByRole("heading",{name:"Learn Japanese"})).toBeInTheDocument();
    expect(readState().activeSession).toBeUndefined();
  });

  it("resumes the same authored lesson through Learn, Home, and My lessons", async () => {
    const first=await loadCuratedLesson(curatedLessons[0].id), before=readState();
    const app=render(<App/>);
    fireEvent.click(screen.getByRole("button",{name:/People and communication Meet people/}));
    fireEvent.click(screen.getByRole("button",{name:`Start ${first.title}`}));
    fireEvent.click(await screen.findByRole("button",{name:"Next card"}));
    fireEvent.click(screen.getByRole("button",{name:"Pause and leave lesson"}));
    expect(persisted().activeSession.savedCards).toEqual(first.cards);
    expect(persisted().activeSession.cursor).toBe(1);
    fireEvent.click(screen.getAllByRole("button",{name:"Home"})[0]);
    fireEvent.click(screen.getByRole("button",{name:"Resume lesson"}));
    await screen.findByRole("button",{name:"Next card"});
    expect(screen.getByText(`Card 2 of ${first.cards.length}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Pause and leave lesson"}));
    fireEvent.click(screen.getAllByRole("button",{name:"Home"})[0]);
    fireEvent.click(screen.getAllByRole("button",{name:"Learn"})[0]);
    fireEvent.click(screen.getByRole("button",{name:/People and communication Meet people/}));
    fireEvent.click(screen.getAllByRole("button",{name:`Resume ${first.title}`})[0]);
    await screen.findByRole("button",{name:"Next card"});
    expect(screen.getByText(`Card 2 of ${first.cards.length}`)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button",{name:"Pause and leave lesson"}));
    fireEvent.click(screen.getAllByRole("button",{name:"My lessons"})[0]);
    expect(screen.getByRole("progressbar",{name:`${first.title} cards practiced`})).toHaveAttribute("aria-valuenow","1");
    expect(persisted().unitProgress).toEqual(before.unitProgress);
    app.unmount();window.history.replaceState(null,"","/#lessons");render(<App/>);
    fireEvent.click(screen.getAllByRole("button",{name:`Resume ${first.title}`})[0]);
    await screen.findByRole("button",{name:"Next card"});
    await waitFor(()=>expect(persisted().activeSession.savedCards).toEqual(first.cards));
    expect(persisted().curatedProgress.completions[first.id]).toBeUndefined();
  }, 15000); // Several full-app mounts and navigation paths run alongside the curriculum walks.
});
