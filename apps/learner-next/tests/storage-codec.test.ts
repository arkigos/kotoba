import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { decodeStoredState, encodeStoredState, serializeStoredState } from "../src/storage-codec";
import { exportState, readState, stateKey, stateStorageMessage, touchWordHistory, writeState } from "../src/state";
import type { ActiveSession, LearnerState, PracticeCard } from "../src/types";

const at = "2026-09-13T16:00:00.000Z";
const plain = <T,>(value: T): T => JSON.parse(JSON.stringify(value));
type Wire = {
  lessonHistory: Array<{ session: { _materializedRows: Array<[string, number, number]> } }>;
  _materializedPool: { version: number; cards: Array<[Record<string, unknown>, number[], number]>; tokens: unknown[]; items: unknown[] };
};

function card(id: string, meaning = "Family"): PracticeCard {
  return { id, line: ["家族"], tts: ["かぞく"], explain: ["family"], english: meaning,
    tokens: [{ surface: "家族", reading: "かぞく", explain: "family", wordId: "kazoku", dictionaryEntryId: "jmdict:123", audioRef: "dictionary/kazoku.mp3", audioText: "かぞく" }],
    audioRef: "sentences/family.mp3", audioText: "家族", grammarTags: ["noun"] };
}

function session(id: string, cards: PracticeCard[]): ActiveSession {
  return { id, title: `My ${id}`, source: "topic", topicId: "family", length: "quick", startedAt: at, cursor: 1,
    savedCards: cards, items: cards.map(item => ({ cardId: item.id, prompt: "meaning", reason: "Reading", unitId: 1 })),
    scores: [true], practicedIndices: [0], targetWordIds: ["kazoku"], practiceSequence: 2 };
}

function profile(sessions = [session("first", [card("same"), card("other"), card("same", "Different content")]), session("second", [card("second-card")])]): LearnerState {
  const fresh = readState();
  return { ...fresh, displayName: "Kept learner", xp: 123, savedWordIds: ["kazoku"],
    wordHistory: touchWordHistory(fresh, { wordIds: ["kazoku"], kind: "reading", at }),
    activeSession: sessions[0], lessonHistory: sessions.map(item => ({ id: item.id, session: item, lastOpenedAt: at, savedAt: at })) };
}

const packed = (state: LearnerState) => plain(encodeStoredState(state)) as Wire;

beforeEach(() => localStorage.clear());
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe("lossless saved-lesson storage", () => {
  it("preserves exact IDs, order, item exceptions and same-ID cards with different bodies", () => {
    const state = profile();
    state.lessonHistory![0].session.items[1] = { cardId: "other", prompt: "listening", reason: "My custom prompt" };
    const before = plain(state);
    const wire = packed(state);
    expect(wire._materializedPool.cards).toHaveLength(2);
    const rows = wire.lessonHistory[0].session._materializedRows;
    expect(rows[0][1]).toBe(rows[1][1]);
    expect(rows[0][1]).not.toBe(rows[2][1]);
    expect(decodeStoredState(wire)).toEqual({ value: before, errors: [] });
    expect(state).toEqual(before);
    expect((wire as unknown as LearnerState).activeSession).toEqual(before.activeSession);
  });

  it("retains non-derived line, tts and explain arrays plus dictionary/audio identities", () => {
    const special = { ...card("exception"), line: ["家", "族"], tts: ["custom reading"], explain: ["custom explanation"] };
    const state = profile([session("exceptions", [card("ordinary"), special])]);
    const decoded = decodeStoredState(packed(state));
    expect(decoded.errors).toEqual([]);
    expect(decoded.value).toEqual(plain(state));
    const restored = (decoded.value as LearnerState).lessonHistory![0].session.savedCards!;
    restored[0].tokens[0].audioRef = "changed";
    expect(restored[1].tokens[0].audioRef).toBe("dictionary/kazoku.mp3");
    expect(state.lessonHistory![0].session.savedCards![0].tokens[0].audioRef).toBe("dictionary/kazoku.mp3");
  });

  it("reads existing plain v3 snapshots and keeps small profiles in the original format", () => {
    const state = profile();
    const original = JSON.stringify(state);
    expect(serializeStoredState(state)).toBe(original);
    localStorage.setItem(stateKey, original);
    expect(readState()).toEqual(plain(state));
    expect(writeState(readState())).toBe(true);
  });

  it("writes and reloads a large saved profile without dropping lessons, cursors or progress", () => {
    const state = profile(Array.from({ length: 40 }, (_, lesson) => session(`lesson-${lesson}`,
      Array.from({ length: 96 }, (_, position) => card(`lesson-${lesson}-card-${position}`, `Meaning ${position % 20}`)))));
    expect(JSON.stringify(state).length * 2).toBeGreaterThan(256 * 1024);
    expect(writeState(state)).toBe(true);
    const stored = localStorage.getItem(stateKey)!;
    expect(JSON.parse(stored)._materializedPool.version).toBe(1);
    expect(stored.length).toBeLessThan(JSON.stringify(state).length / 3);
    expect(readState()).toEqual(plain(state));
    expect(readState().lessonHistory).toHaveLength(40);
  });

  it.each(["card", "word", "item"] as const)("preserves unaffected lessons and blocks overwrite after a bad %s reference", kind => {
    const state = profile();
    const wire = packed(state);
    const row = wire.lessonHistory[0].session._materializedRows[2];
    if (kind === "card") row[1] = 100_000;
    if (kind === "item") row[2] = -1;
    if (kind === "word") wire._materializedPool.cards[row[1]][1][0] = 100_000;
    const original = JSON.stringify(wire);
    localStorage.setItem(stateKey, original);
    const restored = readState();
    expect(restored.displayName).toBe(state.displayName);
    expect(restored.wordHistory).toEqual(state.wordHistory);
    expect(restored.unitProgress).toEqual(state.unitProgress);
    expect(restored.activeSession).toEqual(state.activeSession);
    expect(restored.lessonHistory).toHaveLength(2);
    expect(restored.lessonHistory![1]).toEqual(state.lessonHistory![1]);
    expect(restored.lessonHistory![0].session.savedCards).toEqual([]);
    expect(restored.lessonHistory![0].session.items).toEqual([]);
    expect(writeState({ ...restored, xp: restored.xp + 10 })).toBe(false);
    expect(localStorage.getItem(stateKey)).toBe(original);
    expect(stateStorageMessage()).toMatch(/saving is paused/);
  });

  it.each(["missing", "unsupported"])("keeps original progress when the card pool is %s", kind => {
    const state = profile();
    const wire = packed(state);
    if (kind === "missing") Reflect.deleteProperty(wire, "_materializedPool");
    else wire._materializedPool.version = 999;
    const original = JSON.stringify(wire);
    localStorage.setItem(stateKey, original);
    const restored = readState();
    expect(restored.wordHistory).toEqual(state.wordHistory);
    expect(restored.lessonHistory).toHaveLength(2);
    expect(writeState(restored)).toBe(false);
    expect(localStorage.getItem(stateKey)).toBe(original);
  });

  it.each(["container", "record", "session"])("recovers malformed history %s without resetting the learner", kind => {
    const state = profile();
    const wire = packed(state);
    if (kind === "container") Reflect.set(wire, "lessonHistory", { broken: true });
    if (kind === "record") Reflect.set(wire.lessonHistory, "0", null);
    if (kind === "session") Reflect.set(wire.lessonHistory[0], "session", null);
    const original = JSON.stringify(wire);
    localStorage.setItem(stateKey, original);
    const restored = readState();
    expect(restored.wordHistory).toEqual(state.wordHistory);
    expect(restored.xp).toBe(123);
    expect(restored.activeSession).toEqual(state.activeSession);
    expect(restored.lessonHistory).toEqual(kind === "container" ? [] : [state.lessonHistory![1]]);
    expect(writeState(restored)).toBe(false);
    expect(localStorage.getItem(stateKey)).toBe(original);
  });

  it("exports full runtime cards normally and the exact original snapshot during recovery", async () => {
    let blob: Blob | undefined;
    let filename = "";
    const OriginalURL = URL;
    vi.stubGlobal("URL", class extends OriginalURL {
      static createObjectURL(value: Blob) { blob = value; return "blob:test-export"; }
      static revokeObjectURL() {}
    });
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) { filename = this.download; });
    const exportedText = () => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsText(blob!);
    });
    const state = profile();
    exportState(state);
    expect(JSON.parse(await exportedText())).toEqual(plain(state));
    expect(filename).toMatch(/^kotoba-progress-/);
    const wire = packed(state);
    wire.lessonHistory[0].session._materializedRows[0][1] = -1;
    const original = JSON.stringify(wire);
    localStorage.setItem(stateKey, original);
    exportState(readState());
    expect(await exportedText()).toBe(original);
    expect(filename).toMatch(/^kotoba-recovery-/);
  });
});
