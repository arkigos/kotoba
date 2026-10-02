import { createHash, webcrypto } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { playCard, playSpeech, playToken, playWord, sharedTokenAudioPath, stopAudio } from "../src/audio";
import { builderRecipes, generateLesson, generatedAudioWord } from "../src/generated";
import { getUnit } from "../src/curriculum";
import type { CardToken, PracticeCard } from "../src/types";

class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  constructor(public src: string) { super(); FakeAudio.instances.push(this); }
  play = vi.fn(async () => {});
  pause = vi.fn();
}
class Utterance {
  constructor(public text: string) {}
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
}
class PreparedSource {
  buffer?: AudioBuffer;
  playbackRate = { value: 1 };
  onended: (() => void) | null = null;
  connect = vi.fn();
  disconnect = vi.fn();
  start = vi.fn();
  stop = vi.fn();
}
class PreparedContext {
  static instances: PreparedContext[] = [];
  state = "running";
  destination = {};
  sources: PreparedSource[] = [];
  epoch = Date.now();
  constructor() { PreparedContext.instances.push(this); }
  get currentTime() { return (Date.now() - this.epoch) / 1000; }
  resume = vi.fn(async () => {});
  decodeAudioData = vi.fn(async () => {
    const samples = new Float32Array(1000);
    samples.fill(0.0005);
    samples[40] = 0.004;
    samples[950] = 0.004;
    samples.fill(0.1, 200, 700);
    return { length: 1000, sampleRate: 1000, duration: 1, numberOfChannels: 1, getChannelData: () => samples } as unknown as AudioBuffer;
  });
  createBufferSource() { const source = new PreparedSource(); this.sources.push(source); return source; }
}
const speech = { speak: vi.fn(), cancel: vi.fn() };
const word: CardToken = { surface: "読みませんでした", reading: "よみませんでした", explain: "did not read", wordId: "yomu" };
const sequenceTokens: CardToken[] = [
  { surface: "私", reading: "わたし", explain: "I", audioRef: "/exact-person.mp3" },
  { surface: "は", reading: "わ", explain: "topic", audioRef: "/exact-particle.mp3" },
  { ...word },
];
const sentence: PracticeCard = { id: "generated-sentence", line: sequenceTokens.map(token => token.surface), tts: sequenceTokens.map(token => token.reading), explain: sequenceTokens.map(token => token.explain), tokens: sequenceTokens, english: "I did not read." };
const settle = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

beforeEach(() => {
  FakeAudio.instances = [];
  speech.speak.mockClear();
  speech.cancel.mockClear();
  vi.stubGlobal("Audio", FakeAudio);
  vi.stubGlobal("SpeechSynthesisUtterance", Utterance);
  vi.stubGlobal("speechSynthesis", speech);
  vi.stubGlobal("crypto", webcrypto);
});

describe("sentence playback", () => {
  it("plays every realized word in order and ends once after the last word", async () => {
    const onToken = vi.fn();
    const onEnded = vi.fn();
    const onSource = vi.fn();
    playCard(sentence, undefined, { onToken, onEnded, onSource }, { rate: 0.75 });
    await settle();
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0].src).toBe("/exact-person.mp3");
    expect(FakeAudio.instances[0]).toMatchObject({ playbackRate: 0.75 });
    expect(onSource).toHaveBeenCalledWith("words");
    FakeAudio.instances[0].dispatchEvent(new Event("ended"));
    expect(FakeAudio.instances[1].src).toBe("/media/jp/audio/tokens/72a1cd6703a6.mp3");
    expect(onEnded).not.toHaveBeenCalled();
    FakeAudio.instances[1].dispatchEvent(new Event("ended"));
    expect(FakeAudio.instances[2].src).toMatch(/\/dictionary\//);
    FakeAudio.instances[2].dispatchEvent(new Event("ended"));
    expect(onToken.mock.calls.map(([index]) => index)).toEqual([0, 1, 2]);
    expect(onEnded).toHaveBeenCalledOnce();
    expect(speech.speak).not.toHaveBeenCalled();
    expect(FakeAudio.instances.every(audio => !audio.src.includes("unit_"))).toBe(true);
  });

  it.each([undefined, "/media/jp/audio/unit_001/u001-c001.mp3"])("ignores legacy sentence recordings, including explicit ref %s", async (audioRef) => {
    const onToken = vi.fn();
    playCard({ ...sentence, id: "u001-c001", audioRef }, 1, { onToken });
    await settle();
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0].src).toBe("/exact-person.mp3");
    FakeAudio.instances[0].dispatchEvent(new Event("ended"));
    FakeAudio.instances[1].dispatchEvent(new Event("ended"));
    expect(onToken.mock.calls.map(([index]) => index)).toEqual([0, 1, 2]);
    expect(FakeAudio.instances.every(audio => !audio.src.includes("unit_001"))).toBe(true);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("plays and highlights the actual first course card rather than its old sentence file", async () => {
    const card = getUnit(1).cards[0];
    const onToken = vi.fn();
    const onEnded = vi.fn();
    playCard(card, 1, { onToken, onEnded });
    await settle();
    for (let index = 0; index < card.tokens.length; index++) {
      expect(onToken).toHaveBeenLastCalledWith(index);
      expect(FakeAudio.instances[index].src).not.toMatch(/\/unit_001\//);
      FakeAudio.instances[index].dispatchEvent(new Event("ended"));
    }
    expect(onEnded).toHaveBeenCalledOnce();
  });

  it("fills a missing clip with that exact inflected reading, then continues", async () => {
    const onEnded = vi.fn();
    playCard({ ...sentence, tokens: [word, sequenceTokens[0]] }, undefined, { onEnded });
    await settle();
    FakeAudio.instances[0].dispatchEvent(new Event("error"));
    const spoken = speech.speak.mock.calls[0][0] as Utterance;
    expect(spoken.text).toBe("よみませんでした");
    expect(FakeAudio.instances).toHaveLength(1);
    spoken.onend?.();
    expect(FakeAudio.instances[1].src).toBe("/exact-person.mp3");
    FakeAudio.instances[1].dispatchEvent(new Event("ended"));
    expect(onEnded).toHaveBeenCalledOnce();
  });

  it("stopping a sequence cancels future clips and stale speech callbacks", async () => {
    const onStopped = vi.fn();
    const onEnded = vi.fn();
    playCard(sentence, undefined, { onStopped, onEnded });
    await settle();
    const first = FakeAudio.instances[0];
    first.dispatchEvent(new Event("error"));
    const spoken = speech.speak.mock.calls[0][0] as Utterance;
    stopAudio();
    spoken.onend?.();
    first.dispatchEvent(new Event("ended"));
    expect(FakeAudio.instances).toHaveLength(1);
    expect(onStopped).toHaveBeenCalledOnce();
    expect(onEnded).not.toHaveBeenCalled();
  });

  it("tracks English playback until the device voice finishes", () => {
    const onPlaying = vi.fn();
    const onEnded = vi.fn();
    expect(playSpeech(sentence.english, "en-US", { onPlaying, onEnded })).toBe(true);
    const spoken = speech.speak.mock.calls[0][0] as Utterance;
    spoken.onstart?.();
    expect(onPlaying).toHaveBeenCalledOnce();
    expect(onEnded).not.toHaveBeenCalled();
    spoken.onend?.();
    expect(onEnded).toHaveBeenCalledOnce();
  });
});
afterEach(() => {
  stopAudio();
  PreparedContext.instances.forEach(context => { context.state = "closed"; });
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("continuous recorded sentence audio", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    PreparedContext.instances = [];
    vi.stubGlobal("AudioContext", PreparedContext);
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) })));
  });

  it("trims quiet clip edges and schedules words together with highlights at the selected speed", async () => {
    const onToken = vi.fn();
    const onPlaying = vi.fn();
    const onEnded = vi.fn();
    playCard(sentence, 1, { onToken, onPlaying, onEnded }, { rate: 0.75 });
    await vi.advanceTimersByTimeAsync(0);
    const context = PreparedContext.instances[0];
    expect(context.sources).toHaveLength(3);
    expect(FakeAudio.instances).toHaveLength(0);
    const [first, second, last] = context.sources;
    const [firstStart, offset, duration] = first.start.mock.calls[0] as number[];
    const secondStart = second.start.mock.calls[0][0] as number;
    expect(offset).toBeCloseTo(0.165);
    expect(duration).toBeCloseTo(0.58);
    expect(secondStart - firstStart - duration / 0.75).toBeCloseTo(0.012 / 0.75);
    expect(context.sources.every(source => source.playbackRate.value === 0.75)).toBe(true);
    expect(onToken).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(21);
    expect(onToken).toHaveBeenLastCalledWith(0);
    expect(onPlaying).toHaveBeenCalledOnce();
    await vi.advanceTimersByTimeAsync((secondStart - context.currentTime) * 1000 + 1);
    expect(onToken).toHaveBeenLastCalledWith(1);
    expect(onEnded).not.toHaveBeenCalled();
    const lastStart = last.start.mock.calls[0][0] as number;
    await vi.advanceTimersByTimeAsync((lastStart - context.currentTime) * 1000 + 1);
    expect(onToken.mock.calls.map(([index]) => index)).toEqual([0, 1, 2]);
    last.onended?.();
    expect(onEnded).toHaveBeenCalledOnce();
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("reuses decoded clips and cancels all scheduled audio and future highlights on Stop", async () => {
    const onToken = vi.fn();
    const onEnded = vi.fn();
    playCard(sentence, undefined, { onToken, onEnded });
    await vi.advanceTimersByTimeAsync(21);
    const context = PreparedContext.instances[0];
    expect(onToken).toHaveBeenLastCalledWith(0);
    stopAudio();
    await vi.advanceTimersByTimeAsync(3000);
    expect(onToken).toHaveBeenCalledTimes(1);
    expect(onEnded).not.toHaveBeenCalled();
    expect(context.sources.every(source => source.stop.mock.calls.length > 0 && source.disconnect.mock.calls.length > 0)).toBe(true);
    playCard(sentence, undefined);
    await vi.advanceTimersByTimeAsync(0);
    expect(context.sources).toHaveLength(6);
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it("falls back for a missing exact word and continues with the remaining prepared clips", async () => {
    vi.stubGlobal("fetch", vi.fn(async (path: string) => ({ ok: !path.includes("72a1cd6703a6"), arrayBuffer: async () => new ArrayBuffer(8) })));
    const onEnded = vi.fn();
    const onToken = vi.fn();
    playCard(sentence, undefined, { onEnded, onToken });
    await vi.advanceTimersByTimeAsync(21);
    const context = PreparedContext.instances[0];
    expect(context.sources).toHaveLength(1);
    context.sources[0].onended?.();
    expect(onToken).toHaveBeenLastCalledWith(1);
    FakeAudio.instances[0].dispatchEvent(new Event("error"));
    const spoken = speech.speak.mock.calls[0][0] as Utterance;
    expect(spoken.text).toBe("わ");
    spoken.onend?.();
    expect(context.sources).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(21);
    expect(onToken).toHaveBeenLastCalledWith(2);
    context.sources[1].onended?.();
    expect(onEnded).toHaveBeenCalledOnce();
  });

  it("does not play decoded results that arrive after navigation", async () => {
    let resolve!: (value: { ok: boolean; arrayBuffer: () => Promise<ArrayBuffer> }) => void;
    const response = new Promise<{ ok: boolean; arrayBuffer: () => Promise<ArrayBuffer> }>(done => { resolve = done; });
    vi.stubGlobal("fetch", vi.fn(() => response));
    const onToken = vi.fn();
    playCard(sentence, undefined, { onToken });
    await vi.advanceTimersByTimeAsync(0);
    stopAudio();
    resolve({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
    await vi.advanceTimersByTimeAsync(100);
    expect(PreparedContext.instances[0].sources).toHaveLength(0);
    expect(FakeAudio.instances).toHaveLength(0);
    expect(speech.speak).not.toHaveBeenCalled();
    expect(onToken).not.toHaveBeenCalled();
  });
});

describe("individual word audio", () => {
  it("never substitutes a single-token card's legacy sentence recording for a word", async () => {
    const token = { surface: "試験", reading: "しけん", explain: "test", wordId: "unrecorded-single-token" };
    await playToken(token, { ...sentence, tokens: [token], audioRef: "/wrong-legacy-sentence.mp3" }, 1);
    expect(FakeAudio.instances).toHaveLength(1);
    expect(FakeAudio.instances[0].src).toMatch(/^\/media\/jp\/audio\/tokens\//);
  });

  it("uses the existing shared cache key for the realized inflected form", async () => {
    const hash = createHash("sha1").update("読みませんでした|よみませんでした|よみませんでした").digest("hex").slice(0, 12);
    expect(await sharedTokenAudioPath(word)).toBe(`/media/jp/audio/tokens/${hash}.mp3`);
  });

  it("plays only a generated word and falls back to its reading, once", async () => {
    const snapshot = generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42);
    const card = snapshot.cards[0];
    await playToken(word, card, undefined);
    const audio = FakeAudio.instances[0];
    expect(audio.src).toMatch(/^\/media\/jp\/audio\/dictionary\/.*\.mp3$/);
    audio.dispatchEvent(new Event("error"));
    audio.dispatchEvent(new Event("error"));
    expect(speech.speak).toHaveBeenCalledTimes(1);
    expect(speech.speak.mock.calls[0][0]).toMatchObject({ text: word.reading, lang: "ja-JP" });
    expect(speech.speak.mock.calls[0][0].text).not.toBe(card.tts.join(""));
  });

  it("does not start audio or speech when navigation cancels a pending cache lookup", async () => {
    let resolve!: (buffer: ArrayBuffer) => void;
    vi.stubGlobal("crypto", { subtle: { digest: () => new Promise<ArrayBuffer>(done => { resolve = done; }) } });
    const playing = playWord({ ...word, wordId: "unrecorded-test-word" });
    stopAudio();
    resolve(new ArrayBuffer(20));
    await playing;
    expect(FakeAudio.instances).toHaveLength(0);
    expect(speech.speak).not.toHaveBeenCalled();
  });

  it("ignores late errors from a word superseded by another pronunciation", async () => {
    const unavailable = vi.fn();
    await playWord(word, { onUnavailable: unavailable });
    const first = FakeAudio.instances[0];
    await playWord({ ...word, surface: "本", reading: "ほん" });
    first.dispatchEvent(new Event("error"));
    expect(first.pause).toHaveBeenCalled();
    expect(speech.speak).not.toHaveBeenCalled();
    expect(unavailable).not.toHaveBeenCalled();
    FakeAudio.instances[1].dispatchEvent(new Event("error"));
    expect(speech.speak.mock.calls[0][0].text).toBe("ほん");
  });

  it("reports unavailable speech after a missing word recording", async () => {
    vi.stubGlobal("speechSynthesis", undefined);
    const unavailable = vi.fn();
    await playWord(word, { onUnavailable: unavailable });
    FakeAudio.instances[0].dispatchEvent(new Event("error"));
    expect(unavailable).toHaveBeenCalledOnce();
  });

  it("selects the changed lexical word, including an inflection-only change", () => {
    const snapshot = generateLesson("classroom", builderRecipes.classroom.targetSenseIds, 42);
    const first = snapshot.cards[0];
    const second = snapshot.cards[1];
    expect(generatedAudioWord(second, first)?.surface).toBe("読みます");
    const inflected = { ...second, tokens: second.tokens.map(token => token.wordId === "yomu" ? word : token) };
    expect(generatedAudioWord(inflected, second)).toEqual(word);
  });
});
