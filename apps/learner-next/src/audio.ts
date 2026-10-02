import type { CardToken, PracticeCard } from "./types";
import { recordingForToken, speechForToken } from "../../../packages/dictionary/audio";

export type AudioSource = "recording" | "words" | "device";
export type AudioCallbacks = {
  onLoading?: () => void;
  onPlaying?: () => void;
  onUnavailable?: () => void;
  onEnded?: () => void;
  onStopped?: () => void;
  onSource?: (source: AudioSource) => void;
  onToken?: (index: number) => void;
};
export type AudioOptions = { rate?: number };
let activeAudio: HTMLAudioElement | undefined;
let activeCallbacks: AudioCallbacks | undefined;
let activeCleanup: (() => void) | undefined;
let generation = 0;
type PreparedClip = { buffer: AudioBuffer; offset: number; duration: number };
let playbackContext: AudioContext | undefined;
const decodedClips = new Map<string, Promise<PreparedClip | undefined>>();
const clipCacheLimit = 96;
const recordingUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

/** Start/resume synchronously with the play gesture, before resolving word paths. */
function prepareAudioContext(): Promise<AudioContext | undefined> {
  const Context = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return Promise.resolve(undefined);
  try {
    if (!playbackContext || playbackContext.state === "closed") {
      playbackContext = new Context();
      decodedClips.clear();
    }
    const context = playbackContext;
    if (context.state === "running") return Promise.resolve(context);
    // Autoplay policies can leave resume pending until the next user gesture.
    // Let the ordinary media/device fallback handle that case without hanging.
    return new Promise(resolve => {
      const timer = setTimeout(() => resolve(undefined), 900);
      void context.resume().then(() => {
        clearTimeout(timer);
        resolve(context.state === "running" ? context : undefined);
      }, () => { clearTimeout(timer); resolve(undefined); });
    });
  } catch { return Promise.resolve(undefined); }
}

/** Remove only quiet clip edges. Keep padding around low-volume consonants;
 * internal pauses and the original recording speed remain untouched. */
function trimClip(buffer: AudioBuffer): PreparedClip {
  // Short RMS windows ignore isolated MP3/noise spikes in otherwise quiet tails.
  const windowSize = Math.max(1, Math.round(buffer.sampleRate * 0.01));
  const levels = new Float32Array(Math.ceil(buffer.length / windowSize));
  let peakLevel = 0;
  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    const samples = buffer.getChannelData(channel);
    for (let start = 0, block = 0; start < samples.length; start += windowSize, block += 1) {
      const end = Math.min(samples.length, start + windowSize);
      let energy = 0;
      for (let sample = start; sample < end; sample += 1) energy += samples[sample] ** 2;
      levels[block] = Math.max(levels[block], Math.sqrt(energy / (end - start)));
      peakLevel = Math.max(peakLevel, levels[block]);
    }
  }
  // Scale down for a quiet recording instead of erasing its quieter syllables.
  const threshold = Math.min(0.003, peakLevel * 0.02);
  let first = levels.length;
  let last = -1;
  for (let block = 0; block < levels.length; block += 1) {
    if (levels[block] < threshold) continue;
    first = Math.min(first, block);
    last = block;
  }
  if (peakLevel < 0.0015 || last < first) return { buffer, offset: 0, duration: buffer.duration };
  const offset = Math.max(0, first * windowSize / buffer.sampleRate - 0.035);
  const end = Math.min(buffer.duration, (last + 1) * windowSize / buffer.sampleRate + 0.045);
  return { buffer, offset, duration: end - offset };
}

function prepareClip(context: AudioContext, path: string | undefined): Promise<PreparedClip | undefined> {
  if (!path || typeof fetch === "undefined") return Promise.resolve(undefined);
  const existing = decodedClips.get(path);
  if (existing) {
    decodedClips.delete(path);
    decodedClips.set(path, existing);
    return existing;
  }
  const prepared = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    try {
      const response = await fetch(recordingUrl(path), { signal: controller.signal });
      if (!response.ok) return undefined;
      return trimClip(await context.decodeAudioData(await response.arrayBuffer()));
    } catch { return undefined; }
    finally { clearTimeout(timer); }
  })();
  decodedClips.set(path, prepared);
  while (decodedClips.size > clipCacheLimit) decodedClips.delete(decodedClips.keys().next().value!);
  void prepared.then(clip => { if (!clip && decodedClips.get(path) === prepared) decodedClips.delete(path); });
  return prepared;
}

export function stopAudio() {
  generation += 1;
  activeCleanup?.();
  activeCleanup = undefined;
  if (activeAudio) { activeAudio.pause(); activeAudio = undefined; }
  window.speechSynthesis?.cancel();
  const callbacks = activeCallbacks;
  activeCallbacks = undefined;
  callbacks?.onStopped?.();
}

const begin = (callbacks: AudioCallbacks) => {
  stopAudio();
  activeCallbacks = callbacks;
  callbacks.onLoading?.();
  return generation;
};
const current = (run: number) => run === generation;
const rateFor = (options: AudioOptions) => Math.max(0.5, Math.min(1.5, options.rate ?? 1));

function finish(run: number, unavailable = false) {
  if (!current(run)) return;
  activeCleanup?.();
  activeCleanup = undefined;
  activeAudio = undefined;
  const callbacks = activeCallbacks;
  activeCallbacks = undefined;
  if (unavailable) callbacks?.onUnavailable?.();
  else callbacks?.onEnded?.();
}

function speak(text: string, lang: string, run: number, callbacks: AudioCallbacks, options: AudioOptions, ended: () => void) {
  if (!current(run)) return false;
  if (!text.trim() || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    finish(run, true);
    return false;
  }
  try {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = (lang.startsWith("ja") ? 0.84 : 0.95) * rateFor(options);
    const voice = window.speechSynthesis.getVoices?.().find(candidate => candidate.lang.startsWith(lang.slice(0, 2)));
    if (voice) utterance.voice = voice;
    const timer = setTimeout(() => {
      if (!current(run)) return;
      window.speechSynthesis.cancel();
      finish(run, true);
    }, 5000);
    const cleanup = () => { clearTimeout(timer); utterance.onstart = null; utterance.onend = null; utterance.onerror = null; };
    activeCleanup = cleanup;
    utterance.onstart = () => { clearTimeout(timer); if (current(run)) callbacks.onPlaying?.(); };
    utterance.onend = () => { cleanup(); if (current(run)) ended(); };
    utterance.onerror = () => { if (current(run)) finish(run, true); };
    callbacks.onSource?.("device");
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    finish(run, true);
    return false;
  }
}

export function playSpeech(text: string, lang = "ja-JP", callbacks: AudioCallbacks = {}, options: AudioOptions = {}) {
  const run = begin(callbacks);
  return speak(text, lang, run, callbacks, options, () => finish(run));
}

/** A failed recording advances into its exact fallback; cancelled media never do. */
function playRecording(path: string | undefined, run: number, callbacks: AudioCallbacks, options: AudioOptions, ended: () => void, fallback: () => void) {
  if (!current(run)) return;
  if (!path || typeof Audio === "undefined") { fallback(); return; }
  const audio = new Audio(recordingUrl(path));
  audio.playbackRate = rateFor(options);
  activeAudio = audio;
  let settled = false;
  // Missing/stalled media must not leave an audio-first card silent indefinitely.
  let timer: ReturnType<typeof setTimeout> | undefined = setTimeout(fail, 5000);
  const cleanup = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    audio.removeEventListener("playing", playing);
    audio.removeEventListener("ended", end);
    audio.removeEventListener("error", fail);
  };
  function fail() {
    if (settled || !current(run)) return;
    settled = true;
    cleanup();
    audio.pause();
    if (activeAudio === audio) activeAudio = undefined;
    fallback();
  }
  function playing() {
    if (!current(run) || settled) return;
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
    callbacks.onPlaying?.();
  }
  function end() {
    if (!current(run) || settled) return;
    settled = true;
    cleanup();
    if (activeAudio === audio) activeAudio = undefined;
    ended();
  }
  activeCleanup = cleanup;
  audio.addEventListener("playing", playing);
  audio.addEventListener("ended", end);
  audio.addEventListener("error", fail);
  try { void audio.play()?.catch(fail); } catch { fail(); }
}

export function cardAudioPath(unitId: number, cardId: string) {
  return `/media/jp/audio/unit_${String(unitId).padStart(3, "0")}/${cardId}.mp3`;
}

export async function sharedTokenAudioPath(token: CardToken): Promise<string | undefined> {
  if (!globalThis.crypto?.subtle) return undefined;
  const speech = speechForToken(token);
  const key = `${token.surface}|${token.reading ?? token.surface}|${speech}`;
  const digest = await globalThis.crypto.subtle.digest("SHA-1", new TextEncoder().encode(key));
  const hash = [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 12);
  return `/media/jp/audio/tokens/${hash}.mp3`;
}

async function tokenPath(token: CardToken) {
  const recorded = recordingForToken(token) ?? token.audioRef;
  if (recorded) return recorded;
  try { return await sharedTokenAudioPath(token); } catch { return undefined; }
}

function playPronunciation(token: CardToken, path: string | undefined, run: number, callbacks: AudioCallbacks, options: AudioOptions, ended: () => void) {
  playRecording(path, run, callbacks, options, ended, () => speak(speechForToken(token), "ja-JP", run, callbacks, options, ended));
}

/** Schedule a run of ready clips on one clock, avoiding a media-player startup
 * between words. Highlights follow that same clock, including playback speed. */
function playPreparedClips(context: AudioContext, clips: { clip: PreparedClip; index: number }[], run: number, callbacks: AudioCallbacks, options: AudioOptions, ended: () => void) {
  const sources: AudioBufferSourceNode[] = [];
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let disposed = false;
  const cleanup = () => {
    disposed = true;
    for (const timer of timers) clearTimeout(timer);
    timers.clear();
    for (const source of sources) {
      source.onended = null;
      try { source.stop(); } catch { /* Already ended or not started. */ }
      source.disconnect();
    }
  };
  const atAudioTime = (time: number, callback: () => void) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      if (disposed || !current(run)) return;
      const remaining = time - context.currentTime;
      if (remaining > 0.006 || context.state !== "running") atAudioTime(time, callback);
      else callback();
    }, Math.max(8, Math.min(250, (time - context.currentTime) * 1000)));
    timers.add(timer);
  };
  try {
    const rate = rateFor(options);
    let startsAt = context.currentTime + 0.02;
    clips.forEach(({ clip, index }, position) => {
      const source = context.createBufferSource();
      sources.push(source);
      source.buffer = clip.buffer;
      source.playbackRate.value = rate;
      source.connect(context.destination);
      const start = startsAt;
      atAudioTime(start, () => {
        callbacks.onToken?.(index);
        if (position === 0) callbacks.onPlaying?.();
      });
      if (position === clips.length - 1) source.onended = () => {
        if (disposed || !current(run)) return;
        cleanup();
        ended();
      };
      source.start(start, clip.offset, clip.duration);
      // Edge padding supplies the articulation gap; only add 12 ms between clips.
      startsAt += (clip.duration + 0.012) / rate;
    });
    activeCleanup = cleanup;
    return true;
  } catch {
    cleanup();
    return false;
  }
}

/** Preserve realized inflections and particle readings, in sentence order. */
async function playWordSequence(card: PracticeCard, run: number, callbacks: AudioCallbacks, options: AudioOptions, contextReady: Promise<AudioContext | undefined>) {
  const tokens = card.tokens.map((token, index) => ({ token, index })).filter(({ token }) => /[\p{L}\p{N}]/u.test(speechForToken(token)));
  const paths = await Promise.all(tokens.map(({ token }) => tokenPath(token)));
  if (!current(run)) return;
  if (!tokens.length) { finish(run, true); return; }
  const context = await contextReady;
  if (!current(run)) return;
  const prepared = context ? await Promise.all(paths.map(path => prepareClip(context, path))) : [];
  if (!current(run)) return;
  callbacks.onSource?.("words");
  let position = 0;
  const next = () => {
    if (!current(run)) return;
    if (position >= tokens.length) { finish(run); return; }
    if (context?.state === "running" && prepared[position]) {
      const start = position;
      const clips: { clip: PreparedClip; index: number }[] = [];
      while (prepared[position]) {
        clips.push({ clip: prepared[position]!, index: tokens[position].index });
        position += 1;
      }
      callbacks.onSource?.("words");
      if (playPreparedClips(context, clips, run, callbacks, options, next)) return;
      position = start;
    }
    const { token, index } = tokens[position];
    const path = paths[position++];
    callbacks.onToken?.(index);
    playPronunciation(token, path, run, callbacks, options, next);
  };
  next();
}

/** Sentence IDs survived curriculum rewrites, so their old recordings can contain
 * different text. Always follow the current card's exact tokens and highlights. */
export function playCard(card: PracticeCard, _unitId: number | undefined, callbacks: AudioCallbacks = {}, options: AudioOptions = {}) {
  const run = begin(callbacks);
  void playWordSequence(card, run, callbacks, options, prepareAudioContext());
}

export async function playWord(token: CardToken, callbacks: AudioCallbacks = {}, options: AudioOptions = {}) {
  const run = begin(callbacks);
  const path = await tokenPath(token);
  if (!current(run)) return;
  if (path) callbacks.onSource?.("recording");
  playPronunciation(token, path, run, callbacks, options, () => finish(run));
}

export async function playToken(token: CardToken, _card: PracticeCard, _unitId: number | undefined, callbacks: AudioCallbacks = {}, options: AudioOptions = {}) {
  await playWord(token, callbacks, options);
}
