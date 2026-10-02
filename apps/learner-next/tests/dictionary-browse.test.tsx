import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryView } from "../src/DictionaryView";
import { readState } from "../src/state";
import { dictionaryEntry, dictionaryWord, loadDictionaryIndex, loadStudyPoolIndex, searchRowForEntry, type DictionaryEntry, type SearchRow } from "../../../packages/dictionary";
import { a1MetadataForWord } from "../../../packages/dictionary/a1";

vi.mock("../../../packages/dictionary", async importOriginal => ({
  ...await importOriginal<typeof import("../../../packages/dictionary")>(),
  loadDictionaryIndex: vi.fn(),
  loadStudyPoolIndex: vi.fn(),
}));

const reference: DictionaryEntry = {
  id: "jmdict:900000031", headword: "専門語", reading: "せんもんご", spellings: ["専門語"], readings: ["せんもんご"],
  source: "jmdict", common: false, senses: [{ id: "jmdict:900000031:sense:1", glosses: ["specialist word"], partsOfSpeech: ["n"], fields: ["med"] }],
};
const common: SearchRow = ["jmdict:900000032", "日常語", "にちじょうご", "everyday word", "", 1, "exp", ""];
const rows: SearchRow[] = [searchRowForEntry(dictionaryEntry("watashi")!), searchRowForEntry(reference), common];

function props() { return { query: "", state: readState(), onAddWord: vi.fn(), onPrioritize: vi.fn(), onPractice: vi.fn() }; }

describe("full dictionary browsing", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.mocked(loadDictionaryIndex).mockResolvedValue(rows);
    const starter = searchRowForEntry(dictionaryEntry("watashi")!);
    starter[8] = "A1"; starter[11] = 1; starter[12] = "introductory";
    const later = searchRowForEntry(dictionaryEntry("meeshi")!);
    later[8] = "A2"; later[11] = 1; later[12] = "expansion";
    vi.mocked(loadStudyPoolIndex).mockResolvedValue([starter, later]);
    vi.stubGlobal("fetch", vi.fn(async (url: string) => ({ ok: true, json: async () => url.endsWith("tags.json") ? { med: "Medicine" } : { [reference.id]: reference } })));
  });

  it("browses explicit study levels independently of old course labels, without awarding credit", async () => {
    const callbacks = props();
    render(<DictionaryView {...callbacks} />);
    fireEvent.click(screen.getByRole("button", { name: "Study pools" }));
    await screen.findByRole("button", { name: "Open dictionary entry for 名刺" });
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary level" }), { target: { value: "A1" } });
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 名刺" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary level" }), { target: { value: "A2" } });
    expect(screen.getByRole("button", { name: "Open dictionary entry for 名刺" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 私" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox", { name: "A1 teaching stage" }), { target: { value: "introductory" } });
    expect(screen.getByRole("button", { name: "Open dictionary entry for 私" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 名刺" })).not.toBeInTheDocument();
    expect(callbacks.state.wordHistory).toEqual({});
    expect(callbacks.onAddWord).not.toHaveBeenCalled();
    expect(callbacks.onPractice).not.toHaveBeenCalled();
  });

  it("reports a failed study-pool download and retries without silently using the old index", async () => {
    vi.mocked(loadStudyPoolIndex).mockRejectedValueOnce(new Error("Pool download failed"));
    render(<DictionaryView {...props()} />);
    fireEvent.click(screen.getByRole("button", { name: "Study pools" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Pool download failed");
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 専門語" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Retry study pools" }));
    await screen.findByRole("button", { name: "Open dictionary entry for 名刺" });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows unplaced entries without a search and combines common, type, and category filters", async () => {
    render(<DictionaryView {...props()} />);
    await screen.findByRole("button", { name: "Open dictionary entry for 専門語" });
    expect(screen.getByRole("combobox", { name: "Dictionary topic" })).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Dictionary category" })).not.toBeVisible();
    expect(screen.queryByRole("button", { name: "Find lessons for selected words" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Select shown" }));
    expect(screen.getByText("3 selected")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Find lessons for selected words" })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary category" }), { target: { value: "med" } });
    expect(screen.getByRole("button", { name: "Open dictionary entry for 専門語" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 日常語" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Common words" }));
    expect(screen.getByText("No matching entries")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Filters"));
    expect(screen.getByText("2 active")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset filters" }));
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary word type" }), { target: { value: "Expressions" } });
    expect(screen.getByRole("button", { name: "Open dictionary entry for 日常語" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 専門語" })).not.toBeInTheDocument();
  });

  it("resolves an unseen unplaced entry before prioritizing it, without requiring a bookmark", async () => {
    const callbacks = props();
    render(<DictionaryView {...callbacks} />);
    fireEvent.click(await screen.findByRole("button", { name: "Prioritize 専門語" }));
    await waitFor(() => expect(callbacks.onPrioritize).toHaveBeenCalledWith(reference.id));
    expect(dictionaryWord(reference.id)?.surface).toBe("専門語");
    expect(dictionaryWord(reference.id)?.level).toBeUndefined();
    expect(callbacks.onAddWord).not.toHaveBeenCalled();
    expect(callbacks.state.wordHistory).toEqual({});
  });

  it("keeps explicit selections across filters and launches word practice with every selected reference word", async () => {
    const callbacks = props();
    render(<DictionaryView {...callbacks} />);
    fireEvent.click(await screen.findByRole("checkbox", { name: "Select 専門語" }));
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.click(screen.getByRole("checkbox", { name: "A1 course" }));
    fireEvent.click(screen.getByRole("button", { name: "Find lessons for selected words" }));
    await waitFor(() => expect(callbacks.onPractice).toHaveBeenCalledWith([reference.id]));
  });

  it("keeps a failed reference download actionable without adding an unresolved priority word", async () => {
    vi.mocked(loadDictionaryIndex).mockResolvedValue([["jmdict:900000041", "未読語", "みどくご", "unloaded word", "", 0, "n", ""]]);
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false })));
    const callbacks = props();
    render(<DictionaryView {...callbacks} />);
    fireEvent.click(await screen.findByRole("button", { name: "Prioritize 未読語" }));
    await screen.findByRole("alert");
    expect(callbacks.onPrioritize).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Prioritize 未読語" })).toBeEnabled();
  });

  it("uses authored A1 topic and core placement rather than inferring it for common reference entries", async () => {
    render(<DictionaryView {...props()} />);
    await screen.findByRole("button", { name: "Open dictionary entry for 専門語" });
    const topicId = "A1-foundations";
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary topic" }), { target: { value: topicId } });
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.click(screen.getByRole("checkbox", { name: "A1 course" }));
    expect(screen.getByRole("button", { name: "Open dictionary entry for 私" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 日常語" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 専門語" })).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Dictionary collection" })).getByRole("button", { name: /Priority/ }));
    expect(screen.getByText("Build your priority pool")).toBeInTheDocument();
  });

  it("combines estimated level and frequency without treating commonness as A1 permission", async () => {
    vi.mocked(loadDictionaryIndex).mockResolvedValue([
      ["jmdict:900000051", "校閲", "こうえつ", "revision", "", 1, "n", "", "C1", "estimated", "common"],
      ["jmdict:900000052", "空疎", "くうそ", "empty argument", "", 0, "adj-na", "", "C1", "estimated", "rare"],
      ["jmdict:900000053", "気分", "きぶん", "feeling", "", 1, "n", "", "A2", "reviewed", "common"],
    ]);
    render(<DictionaryView {...props()} />);
    await screen.findByRole("button", { name: "Open dictionary entry for 校閲" });
    fireEvent.click(screen.getByText("Filters"));
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary level" }), { target: { value: "C1" } });
    fireEvent.change(screen.getByRole("combobox", { name: "Dictionary frequency" }), { target: { value: "common" } });
    expect(screen.getByRole("button", { name: "Open dictionary entry for 校閲" })).toBeInTheDocument();
    expect(screen.getByText("C1 · estimated · Common")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 空疎" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 気分" })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "A1 course" }));
    expect(screen.getByText("No matching entries")).toBeInTheDocument();
  });

  it("retains a saved reference entry removed from the study collection", async () => {
    vi.mocked(loadDictionaryIndex).mockResolvedValue([common]);
    const callbacks = props();
    callbacks.state.savedWordIds = [reference.id];
    render(<DictionaryView {...callbacks} />);
    await screen.findByRole("button", { name: "Open dictionary entry for 日常語" });
    expect(screen.queryByRole("button", { name: "Open dictionary entry for 専門語" })).not.toBeInTheDocument();
    fireEvent.click(within(screen.getByRole("group", { name: "Dictionary collection" })).getByRole("button", { name: /Saved/ }));
    await screen.findByRole("button", { name: "Open dictionary entry for 専門語" });
    expect(callbacks.state.wordHistory).toEqual({});
  });
});

it("lets the learner inspect katakana candidates without changing learning state",async()=>{
 const coffee=searchRowForEntry(dictionaryEntry("koohii")!);
 const rice=searchRowForEntry(dictionaryEntry("gohan")!);
 vi.mocked(loadDictionaryIndex).mockResolvedValue([coffee,rice]);
 const callbacks=props(),before=structuredClone(callbacks.state);
 render(<DictionaryView {...callbacks}/>);
 await screen.findByRole("button",{name:`Open dictionary entry for ${coffee[1]}`});
 fireEvent.click(screen.getByText("Filters"));
 fireEvent.change(screen.getByRole("combobox",{name:"Dictionary writing"}),{target:{value:"katakana"}});
 expect(screen.getByRole("button",{name:`Open dictionary entry for ${coffee[1]}`})).toHaveTextContent("Katakana");
 expect(screen.queryByRole("button",{name:`Open dictionary entry for ${rice[1]}`})).not.toBeInTheDocument();
 expect(screen.getByText(/Katakana flags spelling, not English origin/)).toBeInTheDocument();
 fireEvent.click(screen.getByRole("checkbox",{name:"A1 course"}));
 expect(screen.getByRole("button",{name:`Open dictionary entry for ${coffee[1]}`})).toBeInTheDocument();
 fireEvent.change(screen.getByRole("combobox",{name:"Dictionary writing"}),{target:{value:"no-katakana"}});
 expect(screen.getByRole("button",{name:`Open dictionary entry for ${rice[1]}`})).toBeInTheDocument();
 expect(screen.queryByRole("button",{name:`Open dictionary entry for ${coffee[1]}`})).not.toBeInTheDocument();
 fireEvent.click(screen.getByRole("button",{name:"Reset filters"}));
 expect(screen.getByRole("button",{name:`Open dictionary entry for ${coffee[1]}`})).toBeInTheDocument();
 expect(callbacks.state).toEqual(before);
 expect(callbacks.onPrioritize).not.toHaveBeenCalled();expect(callbacks.onPractice).not.toHaveBeenCalled();
});
