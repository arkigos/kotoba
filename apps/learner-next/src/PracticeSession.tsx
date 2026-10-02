import "./starter-lessons.css";
import { ThemeButton } from "./ThemeButton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Keyboard,
  MoreHorizontal,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  Shuffle,
  Square,
  BookOpen,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { toRomaji } from "../../../src/japanese";
import { cleanUnitTitle, getUnit, wordById } from "./curriculum";
import { isCourseSession, resolveSessionCard, toggleSavedSentence } from "./generated";
import { playCard, playSpeech, playToken, stopAudio, type AudioCallbacks, type AudioSource } from "./audio";
import "./practice-polish.css";
export { cardAudioPath } from "./audio";
import { lessonPresets } from "./engine";
import { localDay, touchWordHistory } from "./state";
import { canSaveLesson, isSessionComplete, lessonId, recentLessons, recordDailyPractice, restartLesson, saveLesson } from "./session-history";
import { isPrioritized, recordWordPractice, reviewStatus, setWordPriority } from "./review";
import { cardExposureLabel, recordCardExposures } from "./word-exposure";
import { recordGrammarPractice } from "./grammar-progress";
import { DictionaryEntryPanel } from "./DictionaryView";
import { WordTooltip } from "./WordTooltip";
import { starterLessons, starterNotes } from "./starter-lessons";
import { dictionaryWord, entryIdForWord, grammarEntryForForm } from "../../../packages/dictionary";
import { a1MetadataForWord } from "../../../packages/dictionary/a1";
import type {
  AudioLanguage,
  AutoAdvanceOrder,
  CardToken,
  JapaneseDisplayMode,
  LearnerSettings,
  LearnerState,
  LessonCardFace,
  LessonMode,
  PracticeCard,
  ToastMessage,
  WordInteractionKind,
} from "./types";

type PracticeProps = {
  state: LearnerState;
  onState: (updater: (current: LearnerState) => LearnerState) => void;
  onExit: () => void;
  onDone: () => void;
  onBrowse?: () => void;
  onNextTopic?: () => void;
  nextTopicPending?: boolean;
  nextTopicLabel?: string;
  onToast: (toast: Omit<ToastMessage, "id">) => void;
};

type CardFace = LessonCardFace;

const modeDetails: Record<LessonMode, { label: string; detail: string }> = {
  reading: { label: "Reading", detail: "Japanese first" },
  listening: { label: "Listening", detail: "Audio first" },
  recall: { label: "Recall", detail: "English first" },
  rapid: { label: "Rapid", detail: "Timed card stream" },
  mixed: { label: "Mixed review", detail: "Reading, listening, and recall" },
};

function defaultFace(mode: LessonMode, cursor: number, preferred?: CardFace): CardFace {
  if (mode === "mixed") return (["japanese", "hidden", "english"] as CardFace[])[cursor % 3];
  if (preferred) return preferred;
  if (mode === "listening") return "hidden";
  if (mode === "recall") return "english";
  return "japanese";
}

const faceDetails: Record<CardFace, { label: string; detail: string }> = {
  japanese: { label: "Japanese", detail: "Read first" },
  english: { label: "English", detail: "Recall first" },
  hidden: { label: "Audio only", detail: "Listen first" },
};

const audioDetails: Record<AudioLanguage, { label: string; detail: string }> = {
  japanese: { label: "Japanese", detail: "Always play Japanese" },
  english: { label: "English", detail: "Always play English" },
  same: { label: "Same as card", detail: "Match the visible face" },
  opposite: { label: "Opposite", detail: "Play the other language" },
};

function interactionFor(mode: LessonMode, face: CardFace): WordInteractionKind {
  if (mode === "listening" || face === "hidden") return "listening";
  if (mode === "recall" || face === "english") return "recall";
  return "reading";
}

function tokenText(token: CardToken, mode: JapaneseDisplayMode) {
  if (mode === "kana") return token.reading || token.surface;
  if (mode === "romaji") return toRomaji(token.reading || token.surface);
  return token.surface;
}

function tokenMeaning(token: CardToken) {
  const id = token.wordId ?? token.dictionaryEntryId ?? grammarEntryForForm(token.surface);
  return (id ? dictionaryWord(id)?.meaning : undefined) || token.explain;
}

function JapaneseCard({ card, display, onToken, previous, playingToken }: { card: PracticeCard; display: JapaneseDisplayMode; onToken: (token: CardToken) => void; previous?: PracticeCard; playingToken?: number }) {
  return (
    <div className={`lesson-japanese display-${display}`} lang={display === "romaji" ? "en" : "ja"}>
      {card.tokens.map((token, index) => (
        <WordTooltip key={`${card.id}-${token.surface}-${index}`} className={playingToken === index ? "speaking-token" : undefined} onClick={() => onToken(token)} label={token.surface} romaji={toRomaji(token.reading || token.surface)} meaning={tokenMeaning(token)}>
          <span className={previous && token.surface !== previous.tokens[index]?.surface ? "changed-word" : undefined}>{tokenText(token, display)}</span>
        </WordTooltip>
      ))}
    </div>
  );
}

export function PracticeSession({ state, onState, onExit, onDone, onBrowse, onToast, onNextTopic, nextTopicPending, nextTopicLabel = "Next lesson" }: PracticeProps) {
  const session = state.activeSession;
  if (!session) return null;
  const currentStarter = starterLessons.find(lesson => lesson.id === session.starterLessonId && lesson.version === session.starterVersion);
  const lessonNotes = currentStarter ? starterNotes(currentStarter, state) : session.lessonNotes;
  const complete = session.cursor >= session.items.length;
  const item = session.items[Math.min(session.cursor, session.items.length - 1)];
  const unitId = item.unitId ?? session.unitId;
  const generated = session.source === "generated";
  const unit = unitId === undefined ? undefined : getUnit(unitId);
  const card = resolveSessionCard(session);
  const mode = session.mode ?? state.settings.lessonMode ?? "reading";
  const japaneseDisplay = state.settings.japaneseDisplay ?? "surface";
  const lessonDefaultFace = state.settings.lessonDefaultFace ?? defaultFace(mode, session.cursor);
  const [face, setFace] = useState<CardFace>(() => defaultFace(mode, session.cursor, lessonDefaultFace));
  const [token, setToken] = useState<CardToken | null>(null);
  const [dictionaryId, setDictionaryId] = useState<string>();
  const title = currentStarter?.title ?? session.title ?? (unit ? cleanUnitTitle(unit.title) : "Built lesson");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [audioStatus, setAudioStatus] = useState<"idle" | "loading" | "playing">("idle");
  const [audioSource, setAudioSource] = useState<AudioSource>();
  const [playingToken, setPlayingToken] = useState<number>();
  const [audioRate, setAudioRate] = useState(1);
  const [flowPaused, setFlowPaused] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const audioPlaying = audioStatus !== "idle";
  const resetAudioStatus = useCallback(() => { setAudioStatus("idle"); setPlayingToken(undefined); }, []);
  const audioCallbacks = useMemo<AudioCallbacks>(() => ({
    onLoading: () => { setAudioStatus("loading"); setPlayingToken(undefined); setAudioSource(undefined); },
    onPlaying: () => setAudioStatus("playing"),
    onEnded: resetAudioStatus,
    onStopped: resetAudioStatus,
    onToken: setPlayingToken,
    onSource: setAudioSource,
    onUnavailable: () => {
      resetAudioStatus();
      onToast({ tone: "warning", message: "Audio couldn't play. Try again, or reveal the sentence to keep practicing." });
    },
  }), [onToast, resetAudioStatus]);

  const resolvedAudioLanguage: "japanese" | "english" = state.settings.audioLanguage === "english"
    ? "english"
    : state.settings.audioLanguage === "same"
      ? face === "english" ? "english" : "japanese"
      : state.settings.audioLanguage === "opposite"
        ? face === "japanese" ? "english" : "japanese"
        : "japanese";

  const requestCardAudio = useCallback(() => {
    if (!state.settings.sound) {
      onToast({ tone: "default", message: "Sound is turned off in practice settings" });
      return;
    }
    if (resolvedAudioLanguage === "english") {
      playSpeech(card.english, "en-US", audioCallbacks, { rate: audioRate });
      return;
    }
    playCard(card, generated ? undefined : unitId, audioCallbacks, { rate: audioRate });
  }, [audioCallbacks, audioRate, card, generated, onToast, resolvedAudioLanguage, state.settings.sound, unitId]);
  const toggleCardAudio = useCallback(() => { if (audioPlaying) stopAudio(); else requestCardAudio(); }, [audioPlaying, requestCardAudio]);
  const audioRequestRef = useRef(requestCardAudio);
  audioRequestRef.current = requestCardAudio;

  useEffect(() => {
    setFace(defaultFace(mode, session.cursor, lessonDefaultFace));
    setToken(null);
    setDictionaryId(undefined);
    setAudioSource(undefined);
    setMenuOpen(false);
  }, [card.id, lessonDefaultFace, mode, session.cursor]);

  useEffect(() => {
    if (complete || !state.settings.sound) return undefined;
    if (!state.settings.autoplay) return undefined;
    const timer = window.setTimeout(() => audioRequestRef.current(), 260);
    return () => window.clearTimeout(timer);
  }, [card.id, session.cursor, complete, resolvedAudioLanguage, state.settings.autoplay, state.settings.sound]);

  useEffect(() => {
    resetAudioStatus();
    stopAudio();
    return stopAudio;
  }, [session.id, session.cursor, complete, state.settings.sound, resolvedAudioLanguage, audioRate, resetAudioStatus]);

  const moveTo = useCallback((target: number, recordCurrent: boolean) => {
    stopAudio();
    onState((current) => {
      const active = current.activeSession;
      if (!active || (recordCurrent && active.cursor >= active.items.length)) return current;
      const currentIndex = Math.min(active.cursor, active.items.length - 1);
      const currentItem = active.items[currentIndex];
      const currentUnitId = currentItem.unitId ?? active.unitId;
      const currentUnit = currentUnitId === undefined ? undefined : getUnit(currentUnitId);
      const currentCard = resolveSessionCard(active);
      const bounded = Math.max(0, Math.min(target, active.items.length));
      // A second event from the old rendered position must not consume the next card.
      if (recordCurrent && bounded === active.cursor) return current;
      const at = new Date().toISOString();
      const wordIds = currentCard.tokens.map((cardToken) => cardToken.wordId).filter((wordId): wordId is string => !!wordId);
      const sourceIsCourse = isCourseSession(active) && currentUnitId !== undefined;
      const previous = current.unitProgress[String(currentUnitId)] ?? { exposure: 0, mastery: 0, lastCardIndex: 0, viewedCardIds: [] as string[] };
      // Older profiles recorded a sequential prefix. New browsing can jump freely,
      // so only an actual encounter may add a card to coverage from here onward.
      const viewedCardIds = sourceIsCourse ? new Set(previous.viewedCardIds ?? currentUnit!.cards.slice(0, Math.round(previous.exposure * currentUnit!.cards.length)).map(previousCard => previousCard.id)) : new Set<string>();
      if (recordCurrent && sourceIsCourse) viewedCardIds.add(currentCard.id);
      const exposure = recordCurrent && sourceIsCourse
        ? Math.max(previous.exposure, Math.min(1, viewedCardIds.size / currentUnit!.cards.length))
        : previous.exposure;
      const allCardsViewed = recordCurrent && sourceIsCourse && viewedCardIds.size >= currentUnit!.cards.length;
      const updated: LearnerState = {
        ...current,
        currentUnitId: sourceIsCourse ? currentUnitId : current.currentUnitId,
        completedUnits: allCardsViewed && !current.completedUnits.includes(currentUnitId)
          ? [...current.completedUnits, currentUnitId].sort((a, b) => a - b)
          : current.completedUnits,
        xp: current.xp + (recordCurrent ? 2 : 0),
        practiceDays: recordCurrent && !current.practiceDays.includes(localDay()) ? [...current.practiceDays, localDay()] : current.practiceDays,
        wordHistory: recordCurrent
          ? touchWordHistory(current, { wordIds, unitId: currentUnitId, recipeId: active.snapshot?.recipe.id, kind: interactionFor(active.source === "generated" ? mode : active.mode ?? current.settings.lessonMode ?? "reading", face), at })
          : current.wordHistory,
        unitProgress: sourceIsCourse ? {
          ...current.unitProgress,
          [String(currentUnitId)]: {
            exposure,
            viewedCardIds: [...viewedCardIds],
            mastery: previous.mastery,
            lastCardIndex: Math.min(currentUnit!.cards.length - 1, bounded),
            lastStudiedAt: recordCurrent ? at : previous.lastStudiedAt,
          },
        } : current.unitProgress,
        activeSession: { ...active, cursor: bounded, scores: recordCurrent ? [...active.scores, true] : active.scores, practicedIndices: recordCurrent ? [...new Set([...(active.practicedIndices ?? []), currentIndex])] : active.practicedIndices },
      };
      return recordCurrent ? recordDailyPractice(current, recordGrammarPractice(current, recordCardExposures(current, recordWordPractice(updated, wordIds, at), wordIds, currentIndex, currentCard), currentCard, currentIndex, at), wordIds, at) : updated;
    });
  }, [face, mode, onState]);

  const nextCard = useCallback(() => moveTo(session.cursor + 1, true), [moveTo, session.cursor]);
  const previousCard = useCallback(() => moveTo(session.cursor - 1, false), [moveTo, session.cursor]);
  const randomCard = useCallback(() => {
    if (session.items.length < 2) return;
    let next = session.cursor;
    while (next === session.cursor) next = Math.floor(Math.random() * session.items.length);
    moveTo(next, true);
  }, [moveTo, session.cursor, session.items.length]);

  useEffect(() => {
    if (complete || !state.settings.autoAdvance || flowPaused || audioPlaying || settingsOpen || token || dictionaryId) return undefined;
    const step = state.settings.autoAdvanceOrder === "random" ? randomCard : nextCard;
    const timer = window.setTimeout(step, state.settings.autoAdvanceDelayMs ?? 5000);
    return () => window.clearTimeout(timer);
  }, [audioPlaying, card.id, complete, dictionaryId, flowPaused, nextCard, randomCard, settingsOpen, state.settings.autoAdvance, state.settings.autoAdvanceDelayMs, state.settings.autoAdvanceOrder, token]);

  const inspectToken = (next: CardToken) => {
    setToken(next);
    if (next.wordId) {
      onState((current) => ({
        ...current,
        wordHistory: touchWordHistory(current, { wordIds: [next.wordId!], unitId, recipeId: session.snapshot?.recipe.id, kind: "token" }),
      }));
    }
    if (state.settings.sound) void playToken(next, card, generated ? undefined : unitId, audioCallbacks, { rate: audioRate });
  };

  const replayToken = () => {
    if (!state.settings.sound) {
      onToast({ tone: "default", message: "Sound is turned off in practice settings" });
      return;
    }
    if (token) void playToken(token, card, generated ? undefined : unitId, audioCallbacks, { rate: audioRate });
  };

  const prioritizeToken = () => {
    if (!token?.wordId) return;
    const wordId = token.wordId;
    onState(current => setWordPriority(current, wordId, !isPrioritized(current.wordHistory[wordId])));
  };

  const saveInspectedToken = () => {
    if (!token?.wordId) return;
    const wordId = token.wordId;
    const saved = state.savedWordIds.includes(wordId);
    onState((current) => ({
      ...current,
      savedWordIds: saved ? current.savedWordIds.filter((id) => id !== wordId) : [...current.savedWordIds, wordId],
      wordHistory: touchWordHistory(current, { wordIds: [wordId], unitId, recipeId: session.snapshot?.recipe.id, kind: "saved" }),
    }));
    onToast({ tone: "success", message: saved ? "Removed from saved words" : "Saved to your Dictionary" });
  };

  const saveSentence = () => {
    const saved = state.savedSentenceIds.includes(card.id);
    onState(current => toggleSavedSentence(current, card, session));
    onToast({ tone: "success", message: saved ? "Removed from saved sentences" : "Saved to Dictionary → Sentences" });
  };
  const lessonSaved = !!recentLessons(state).find(lesson => lesson.id === lessonId(session))?.savedAt;
  const toggleLessonSave = () => {
    onState(current => saveLesson(current, lessonId(session), !lessonSaved));
    setMenuOpen(false);
    onToast({ tone: "success", message: lessonSaved ? "Lesson remains in Recent." : "Lesson saved. Find it in Lessons." });
  };

  const updateLessonSettings = (patch: Partial<LearnerSettings>) => {
    onState((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  };

  const setMode = (next: LessonMode) => {
    const preset = next === "mixed" ? { autoplay: true, audioLanguage: "japanese" as const, autoAdvance: false } : lessonPresets[next].settings;
    onState((current) => !current.activeSession ? current : {
      ...current,
      settings: { ...current.settings, ...preset },
      activeSession: { ...current.activeSession, mode: next },
    });
    setFace(defaultFace(next, session.cursor, preset.lessonDefaultFace ?? lessonDefaultFace));
  };

  const setJapaneseDisplay = (display: JapaneseDisplayMode) => {
    updateLessonSettings({ japaneseDisplay: display });
  };

  const setDefaultFace = (next: CardFace) => {
    onState(current => ({ ...current, settings: { ...current.settings, lessonDefaultFace: next }, activeSession: current.activeSession && mode === "mixed" ? { ...current.activeSession, mode: "reading" } : current.activeSession }));
    setFace(next);
  };

  const restart = () => {
    onState((current) => {
      if (!current.activeSession) return current;
      const sourceIsCourse = isCourseSession(current.activeSession);
      const progress = current.unitProgress[String(current.activeSession.unitId)];
      return {
        ...current,
        unitProgress: sourceIsCourse && progress ? {
          ...current.unitProgress,
          [String(current.activeSession.unitId)]: { ...progress, lastCardIndex: 0 },
        } : current.unitProgress,
        activeSession: restartLesson(current.activeSession),
      };
    });
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target?.matches("input, textarea, select") || target?.isContentEditable || event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else if (token) setToken(null);
        else onExit();
      }
      if (settingsOpen || dictionaryId || event.key === "Escape") return;
      if (event.key === " " && target?.closest("button")) return;
      if (event.key === " " && event.shiftKey) {
        event.preventDefault();
        previousCard();
      } else if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextCard();
      }
      if (event.key === "ArrowLeft") previousCard();
      if (event.key.toLowerCase() === "a" || event.key === "2") toggleCardAudio();
      if (event.key.toLowerCase() === "r") randomCard();
      if (event.key === "1") setFace((current) => current === "english" ? "japanese" : "english");
      if (event.key.toLowerCase() === "s") setSettingsOpen(true);
      if (event.key.toLowerCase() === "j") {
        const modes: JapaneseDisplayMode[] = ["surface", "kana", "romaji"];
        setJapaneseDisplay(modes[(modes.indexOf(japaneseDisplay) + 1) % modes.length]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dictionaryId, japaneseDisplay, nextCard, onExit, previousCard, randomCard, toggleCardAudio, settingsOpen, token]);

  if (complete) {
    const practicedIndices = [...new Set((session.practicedIndices ?? []).filter(index => Number.isInteger(index) && index >= 0 && index < session.items.length))];
    const canonicalWordId = (id: string) => a1MetadataForWord(id)?.coreWordId ?? id;
    const targeted = (session.source === "topic" || session.source === "vocabulary") && session.targetWordIds !== undefined;
    const practicedWords = new Set(practicedIndices.flatMap(index => resolveSessionCard(session, index).tokens.flatMap(token => token.wordId ? [targeted ? canonicalWordId(token.wordId) : token.wordId] : [])));
    const targetIds = new Set((session.targetWordIds ?? []).map(canonicalWordId));
    const wordsPracticed = targeted ? [...targetIds].filter(id => practicedWords.has(id)).length : practicedWords.size;
    return (
      <main className="practice-shell summary-shell" data-theme={state.settings.theme}>
        <div className="summary-theme-control"><ThemeButton theme={state.settings.theme} onChange={theme => updateLessonSettings({ theme })} /></div>
        <section className="session-summary">
          <p className="practice-kicker">{session.source === "library" ? "Dictionary review" : title}</p>
          <h1>{isSessionComplete(session) ? (session.source === "library" || session.source === "saved") ? "Review complete" : "Lesson complete" : "End of lesson"}</h1>
          <p className="summary-copy">Progress saved. {isSessionComplete(session) ? "Every card practiced." : `${session.practicedIndices?.length ?? 0} of ${session.items.length} cards practiced in this session.`}</p>
          <div className="summary-score-grid lesson-summary-grid">
            <div><strong>{practicedIndices.length}</strong><span>cards practiced</span></div>
            <div><strong>{wordsPracticed}</strong><span>{targeted ? "target words practiced" : "words practiced"}</span></div>
          </div>
          <button className="summary-primary" type="button" onClick={onDone}>Back to Home <ArrowRight size={18} /></button>
          {onNextTopic && <button className="summary-secondary" type="button" disabled={nextTopicPending} onClick={onNextTopic}>{nextTopicPending ? "Opening next lesson…" : nextTopicLabel}</button>}
          {onBrowse && <button className="summary-secondary" type="button" onClick={onBrowse}>Browse all sentences</button>}
          {!isSessionComplete(session) && <button className="summary-secondary" type="button" onClick={() => moveTo(session.items.findIndex((_, index) => !session.practicedIndices?.includes(index)), false)}>Continue unpracticed cards</button>}
          {canSaveLesson(session) && <button className="summary-secondary" type="button" onClick={toggleLessonSave}>{lessonSaved ? "Remove from saved lessons" : "Save lesson"}</button>}
          <button className="summary-secondary" type="button" onClick={restart}>Review again</button>
        </section>
      </main>
    );
  }

  const progress = ((session.cursor + 1) / session.items.length) * 100;
  const flipLabel = face === "japanese" ? "Show English" : face === "english" ? "Show Japanese" : "Reveal Japanese";
  const inspectedWord = token?.wordId ? wordById(token.wordId) : undefined;
  const inspectedEntryId = token?.dictionaryEntryId ?? (token?.wordId ? entryIdForWord(token.wordId) : token ? grammarEntryForForm(token.surface) : undefined);
  const inspectedHistory = token?.wordId ? state.wordHistory[token.wordId] : undefined;
  const prioritized = isPrioritized(inspectedHistory);
  const savedToken = token?.wordId ? state.savedWordIds.includes(token.wordId) : false;

  return (
    <main className={`practice-shell lesson-shell${generated ? " generated-lesson" : ""}`} data-theme={state.settings.theme}>
      <header className="practice-topbar lesson-topbar">
        <button type="button" className="practice-icon-button" onClick={onExit} aria-label="Pause and leave lesson"><X size={21} /></button>
        <div className="session-progress">
          <div role="progressbar" aria-label="Lesson progress" aria-valuemin={1} aria-valuemax={session.items.length} aria-valuenow={session.cursor + 1}><span style={{ width: `${progress}%` }} /></div>
          <small>Card {session.cursor + 1} of {session.items.length}</small>
        </div>
        <div className="practice-top-actions">
          <ThemeButton theme={state.settings.theme} onChange={theme => updateLessonSettings({ theme })} className="practice-icon-button" />
          {onBrowse && <button type="button" className="practice-icon-button" aria-label="Browse lesson sentences" title="Browse all sentences" onClick={() => { stopAudio(); onBrowse(); }}><BookOpen size={19} /></button>}
          <button type="button" className={`practice-icon-button lesson-settings-trigger ${settingsOpen ? "active" : ""}`} aria-label="Lesson settings" aria-expanded={settingsOpen} onClick={() => setSettingsOpen(true)}><Settings2 size={19} /></button>
          <button type="button" className="practice-icon-button" aria-label="More lesson options" onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={21} /></button>
          {menuOpen && <div className="practice-menu">
            {canSaveLesson(session) && <button type="button" onClick={toggleLessonSave}><Bookmark size={16} fill={lessonSaved ? "currentColor" : "none"} /> {lessonSaved ? "Unsave lesson" : "Save lesson"}</button>}
            <button type="button" onClick={randomCard}><Shuffle size={16} /> Random card</button>
            <button type="button" onClick={onExit}><Pause size={16} /> Pause lesson</button>
            <button type="button" onClick={() => { setMenuOpen(false); onToast({ tone: "default", message: "Keys: ←/→ cards · 1 flip · A play/stop · J script · R random · S settings" }); }}><Keyboard size={16} /> Shortcuts</button>
          </div>}
        </div>
      </header>

      <div className="lesson-layout">
        <section className="lesson-stage">
          <div className="lesson-context">
            <span className={`lesson-mode mode-${mode}`}>{mode === "listening" ? <Headphones size={13} /> : mode === "rapid" ? <Play size={13} /> : <BookOpen size={13} />}{modeDetails[mode].label}</span>
            <span>{title}</span>
            <span>{generated ? `${session.snapshot?.recipe.level ?? "A1"} · Built lesson` : unit?.grammarFocus}</span>
          </div>

          <div className="lesson-quick-tools">
            <div className="lesson-script-chips" role="group" aria-label="Quick Japanese display">
              {(["surface", "kana", "romaji"] as JapaneseDisplayMode[]).map(display => <button key={display} type="button" aria-label={display === "surface" ? "Display original Japanese" : display === "kana" ? "Display kana readings" : "Display roman letters"} aria-pressed={japaneseDisplay === display} onClick={() => setJapaneseDisplay(display)}>{display === "surface" ? "日本語" : display === "kana" ? "かな" : "Romaji"}</button>)}
            </div>
            <div className="lesson-quick-actions">
              {state.settings.autoAdvance && <button type="button" aria-label={flowPaused ? "Resume automatic advance" : "Pause automatic advance"} onClick={() => setFlowPaused(paused => !paused)}>{flowPaused ? <Play size={14} /> : <Pause size={14} />}<span>{flowPaused ? "Resume auto advance" : "Pause auto advance"}</span></button>}
              <button type="button" aria-label={state.settings.sound ? "Mute lesson sound" : "Enable lesson sound"} title={state.settings.sound ? "Mute sound" : "Enable sound"} onClick={() => updateLessonSettings({ sound: !state.settings.sound })}>{state.settings.sound ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
            </div>
          </div>

          <article className={`lesson-card face-${face}${lessonNotes?.some(note => note.start === session.cursor + 1) ? " has-lesson-note" : ""}`}>
            <div className="lesson-card-head">
              <span>{face === "hidden" ? "Listen first" : face === "english" ? "Meaning" : japaneseDisplay === "surface" ? "Japanese" : japaneseDisplay}</span>
              {session.items[session.cursor]?.section && session.items[session.cursor].section !== "lesson" && <p className="lesson-review-label">{session.items[session.cursor].section === "due-review" ? "Scheduled review" : "Recent practice"}{session.items[session.cursor].reviewSource?.title ? ` · ${session.items[session.cursor].reviewSource!.title}` : ""}</p>}
              <button type="button" className={state.savedSentenceIds.includes(card.id) ? "saved" : ""} onClick={saveSentence} aria-label={state.savedSentenceIds.includes(card.id) ? "Remove saved sentence" : "Save sentence"}><Bookmark size={16} fill={state.savedSentenceIds.includes(card.id) ? "currentColor" : "none"} /></button>
            </div>

              {lessonNotes?.filter(note => note.start === session.cursor + 1).map(note => <aside className="starter-note" key={note.start}><strong>{note.title}</strong><p lang="ja">{note.pattern}</p><p>{note.explanation}</p></aside>)}

            <div className="lesson-card-body">
              {face === "japanese" && <><JapaneseCard card={card} display={japaneseDisplay} onToken={inspectToken} playingToken={playingToken} previous={generated && session.cursor > 0 ? resolveSessionCard(session, session.cursor - 1) : undefined} />{showTranslation && <p className="lesson-companion-translation">{card.english}</p>}</>}
              {face === "english" && <div className="lesson-english"><small>English</small><h2>{card.english}</h2></div>}
              {face === "hidden" && <button type="button" className={`lesson-listen ${audioPlaying ? "playing" : ""}`} onClick={toggleCardAudio} aria-label={audioPlaying ? "Stop listening audio" : `Play ${resolvedAudioLanguage} audio`}><span>{audioPlaying ? <Square size={28} fill="currentColor" /> : <Volume2 size={34} />}</span><i /><i /><strong>{audioStatus === "loading" ? "Preparing audio…" : audioPlaying ? "Playing · tap to stop" : "Listen to the sentence"}</strong><small>{resolvedAudioLanguage === "english" ? "English audio is selected." : "Show Japanese to reveal the sentence."}</small></button>}
            </div>

            <div className="lesson-card-foot">
              <span>{face === "japanese" ? "Select a word for its reading and meaning" : face === "hidden" ? "Replay as often as you need" : "Show Japanese to compare"}</span>
              {face === "japanese" && <button type="button" className="lesson-translation-toggle" aria-pressed={showTranslation} onClick={() => setShowTranslation(show => !show)}>{showTranslation ? "Hide meaning" : "Show meaning"}</button>}
            </div>
            {state.settings.autoAdvance && !flowPaused && !audioPlaying && !settingsOpen && !token && !dictionaryId && <i key={`${card.id}-${session.cursor}`} className="rapid-timer" style={{ animationDuration: `${state.settings.autoAdvanceDelayMs ?? 5000}ms` }} />}
          </article>

          <div className="lesson-below-card">
            <div className="lesson-position-dots" aria-label="Nearby sentences">
              {[-2, -1, 0, 1, 2].map(offset => session.cursor + offset >= 0 && session.cursor + offset < session.items.length ? <button type="button" key={offset} className={offset === 0 ? "active" : ""} aria-label={`Go to card ${session.cursor + offset + 1}`} aria-current={offset === 0 ? "step" : undefined} onClick={() => moveTo(session.cursor + offset, false)}>{session.cursor + offset + 1}</button> : <span key={offset} />)}
            </div>
            <div className="lesson-audio-tools">
              {audioSource && <span className="lesson-audio-source">{audioSource === "words" ? "Word clips" : audioSource === "device" ? "Device voice" : "Recording"}</span>}
              <div className="lesson-speed-chips" role="group" aria-label="Audio speed">{[0.75, 1, 1.15].map(rate => <button key={rate} type="button" aria-pressed={audioRate === rate} onClick={() => setAudioRate(rate)}>{rate}×</button>)}</div>
            </div>
          </div>
        </section>

        <aside className={`token-inspector lesson-inspector ${token ? "open" : ""}`} aria-live="polite">
          {!token ? <div className="inspector-empty"><span>語</span><strong>Select a word</strong><p>See its meaning, play its pronunciation,<br />or save it to your Dictionary.</p></div> : <>
            <div className="inspector-heading"><span>Word detail</span><button type="button" onClick={() => setToken(null)} aria-label="Close word detail"><X size={16} /></button></div>
            <div className="inspector-word"><strong lang="ja">{token.surface}</strong><span lang="ja">{token.reading}</span></div>
            <p>{tokenMeaning(token)}</p>
            {token.wordId && <p className="inspector-exposures"><strong>{cardExposureLabel(inspectedHistory)}</strong><br /><small>Completed practice cards since tracking began. Earlier practice is not included.</small></p>}
            {inspectedEntryId && <button type="button" className="dictionary-entry-link" onClick={() => { stopAudio(); setDictionaryId(token?.wordId ?? inspectedEntryId); }}>Open dictionary entry</button>}
            <button className="inspector-play" type="button" onClick={replayToken} aria-label={`Play pronunciation for ${token.surface}`}><span><Volume2 size={17} /></span><span><strong>Play pronunciation</strong><small>{token.reading || token.surface}</small></span></button>
            {token.wordId && <div className="inspector-rating"><span><strong>Review</strong><small>{inspectedHistory && reviewStatus(inspectedHistory, state).due ? "Due for review" : "Review timing is tracked automatically"}</small></span><button type="button" aria-pressed={prioritized} onClick={prioritizeToken} aria-label={`Prioritize ${token.surface}`} className={`word-priority ${prioritized ? "active" : ""}`}>{prioritized ? "★ Prioritized" : "☆ Prioritize this word"}</button><small>Course placement: {inspectedWord?.level ?? "Not classified"}</small></div>}
            {token.wordId && <button type="button" className={savedToken ? "saved" : ""} onClick={saveInspectedToken}><Bookmark size={15} fill={savedToken ? "currentColor" : "none"} /> {savedToken ? "Saved in Dictionary" : "Save to Dictionary"}</button>}
            <div className="inspector-context"><small>On this card</small><span lang="ja">{card.line.join("")}</span><small>{tokenMeaning(token)}</small></div>
          </>}
        </aside>
      </div>

      {settingsOpen && <div className="lesson-settings-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
        <section className="lesson-settings" role="dialog" aria-modal="true" aria-label="Lesson settings">
          <header><div><h2>Lesson settings</h2></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close lesson settings"><X size={18} /></button></header>
          <p className="lesson-settings-description">Changes apply now and are saved for your next lesson.</p>

          <div className="lesson-setting-block">
            <strong>Quick presets</strong><small>Choose a preset or adjust the settings below.</small>
            <div className="lesson-setting-options mode-options" role="group" aria-label="Lesson presets">{(["reading", "listening", "recall", "rapid", "mixed"] as LessonMode[]).map((option) => <button key={option} type="button" className={mode === option ? "active" : ""} aria-pressed={mode === option} onClick={() => setMode(option)}><span>{modeDetails[option].label}</span><small>{modeDetails[option].detail}</small></button>)}</div>
          </div>

          <div className="lesson-setting-block">
            <strong>Card starts on</strong><small>Choose the face shown whenever you move to a new card.</small>
            <div className="lesson-setting-options face-options" role="group" aria-label="Default card face">{(["japanese", "english", "hidden"] as CardFace[]).map((option) => <button key={option} type="button" className={lessonDefaultFace === option ? "active" : ""} aria-pressed={lessonDefaultFace === option} onClick={() => setDefaultFace(option)}><span>{faceDetails[option].label}</span><small>{faceDetails[option].detail}</small></button>)}</div>
          </div>

          <div className="lesson-setting-block">
            <strong>Japanese display</strong><small>Choose how Japanese text is displayed.</small>
            <div className="lesson-setting-options script-options" role="group" aria-label="Japanese display">{(["surface", "kana", "romaji"] as JapaneseDisplayMode[]).map((option) => <button key={option} type="button" className={japaneseDisplay === option ? "active" : ""} onClick={() => setJapaneseDisplay(option)}>{option === "surface" ? "日本語" : option === "kana" ? "かな" : "Romaji"}<small>{option === "surface" ? "Kanji / kana" : option}</small></button>)}</div>
          </div>

          <div className="lesson-setting-block setting-inline">
            <span><strong>Lesson sound</strong><small>Enable sentence playback and word pronunciation.</small></span>
            <button type="button" role="switch" aria-label="Lesson sound" aria-checked={state.settings.sound} className={`toggle ${state.settings.sound ? "on" : ""}`} onClick={() => updateLessonSettings({ sound: !state.settings.sound })}><span /></button>
          </div>

          <div className="lesson-setting-block setting-inline">
            <span><strong>Play audio automatically</strong><small>Play the selected audio whenever a new card opens.</small></span>
            <button type="button" role="switch" aria-label="Auto play audio" aria-checked={state.settings.autoplay} className={`toggle ${state.settings.autoplay ? "on" : ""}`} onClick={() => updateLessonSettings({ autoplay: !state.settings.autoplay })}><span /></button>
          </div>

          <div className="lesson-setting-block">
            <strong>Audio language</strong><small>Choose what autoplay and the bottom audio button play.</small>
            <div className="lesson-setting-options audio-options" role="group" aria-label="Audio language">{(["japanese", "english", "same", "opposite"] as AudioLanguage[]).map((option) => <button key={option} type="button" className={(state.settings.audioLanguage ?? "japanese") === option ? "active" : ""} onClick={() => updateLessonSettings({ audioLanguage: option })}><span>{audioDetails[option].label}</span><small>{audioDetails[option].detail}</small></button>)}</div>
          </div>

          <div className="lesson-setting-block setting-inline">
            <span><strong>Advance automatically</strong><small>Move on after the delay without touching the controls.</small></span>
            <button type="button" role="switch" aria-label="Auto advance" aria-checked={state.settings.autoAdvance} className={`toggle ${state.settings.autoAdvance ? "on" : ""}`} onClick={() => updateLessonSettings({ autoAdvance: !state.settings.autoAdvance })}><span /></button>
          </div>

          <div className={`lesson-setting-block flow-settings ${state.settings.autoAdvance ? "enabled" : ""}`}>
            <span className="flow-heading"><span><strong>Auto-advance order</strong><small>Order and time between cards</small></span><b>{(state.settings.autoAdvanceDelayMs ?? 5000) / 1000}s</b></span>
            <div className="lesson-setting-options order-options" role="group" aria-label="Auto advance order">{(["sequential", "random"] as AutoAdvanceOrder[]).map((option) => <button key={option} type="button" className={(state.settings.autoAdvanceOrder ?? "sequential") === option ? "active" : ""} onClick={() => updateLessonSettings({ autoAdvanceOrder: option })}>{option === "sequential" ? "Sequential" : "Random"}</button>)}</div>
            <div className="lesson-delay" role="group" aria-label={`Auto advance delay ${(state.settings.autoAdvanceDelayMs ?? 5000) / 1000} seconds`}>
              <button type="button" aria-label="Decrease auto advance delay" onClick={() => updateLessonSettings({ autoAdvanceDelayMs: Math.max(2000, (state.settings.autoAdvanceDelayMs ?? 5000) - 1000) })}>−</button>
              <span><strong>{(state.settings.autoAdvanceDelayMs ?? 5000) / 1000} seconds</strong><small>between cards</small></span>
              <button type="button" aria-label="Increase auto advance delay" onClick={() => updateLessonSettings({ autoAdvanceDelayMs: Math.min(30000, (state.settings.autoAdvanceDelayMs ?? 5000) + 1000) })}>+</button>
            </div>
          </div>

          <div className="lesson-setting-block setting-inline">
            <span><strong>Dark lesson</strong><small>Change the lesson appearance without leaving the deck.</small></span>
            <button type="button" role="switch" aria-label="Dark lesson" aria-checked={state.settings.theme === "dark"} className={`toggle ${state.settings.theme === "dark" ? "on" : ""}`} onClick={() => updateLessonSettings({ theme: state.settings.theme === "dark" ? "light" : "dark" })}><span /></button>
          </div>
          <button className="lesson-settings-done" type="button" onClick={() => setSettingsOpen(false)}>Return to card</button>
        </section>
      </div>}

      <footer className="lesson-actions">
        <button type="button" className="lesson-nav secondary" onClick={previousCard} disabled={session.cursor === 0} aria-label="Previous card"><ChevronLeft size={21} /><span>Previous</span></button>
        <button type="button" className={`lesson-audio ${audioPlaying ? "is-playing" : ""}`} onClick={toggleCardAudio} aria-label={audioPlaying ? "Stop audio" : "Play card audio"} title={`${resolvedAudioLanguage === "english" ? "English" : "Japanese"} sentence · A to play or stop`}>{audioPlaying ? <Square size={18} fill="currentColor" /> : <Volume2 size={21} />}<span>{audioStatus === "loading" ? "Loading…" : audioPlaying ? "Stop audio" : `Play ${resolvedAudioLanguage === "english" ? "English" : "sentence"}`}</span><kbd>A</kbd></button>
        <button type="button" className="lesson-flip" onClick={() => setFace(face === "japanese" ? "english" : "japanese")}><RotateCcw size={18} />{flipLabel}</button>
        <button type="button" className="lesson-nav primary" onClick={nextCard} aria-label={session.cursor === session.items.length - 1 ? "Complete lesson" : "Next card"}><span>{session.cursor === session.items.length - 1 ? "Finish" : "Next"}</span><ChevronRight size={21} /></button>
      </footer>
      {dictionaryId && <DictionaryEntryPanel entryId={dictionaryId} onClose={() => setDictionaryId(undefined)} />}
    </main>
  );
}
