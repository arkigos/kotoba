import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleMinus,
  Eye,
  Layers3,
  List,
  RotateCcw,
  Settings,
  Sparkles,
  Volume2,
  X,
} from "lucide-react";
import functionWordsJson from "../data/jp/curriculum/function_words.json";
import { courseDictionaryWords, dictionaryWord } from "../packages/dictionary";
import { recordingForToken, speechForToken } from "../packages/dictionary/audio";
import { courseLevels, getUnit, initialUnit, unitIndex } from "./data";
import { toRomaji } from "./japanese";
import { defaultProgress, readProgress, writeProgress } from "./progress";
import type { CardToken, CourseLevel, FunctionWordEntry, JapaneseDisplayMode, PracticeCard, PracticeSettings, Progress, PromptDisplay, UnitIndexEntry, WordEntry } from "./types";

const studyPresets: Array<{ id: string; label: string; settings: Partial<PracticeSettings> }> = [
  {
    id: "reading",
    label: "Reading",
    settings: {
      defaultDisplay: "japanese",
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "listening",
    label: "Listening",
    settings: {
      defaultDisplay: "hidden",
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "recall",
    label: "Recall",
    settings: {
      defaultDisplay: "english",
      autoPlayAudio: false,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "rapid",
    label: "Rapid",
    settings: {
      defaultDisplay: "japanese",
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: true,
      autoAdvanceOrder: "sequential",
      autoAdvanceDelayMs: 5000,
    },
  },
];

const promptDisplayOptions: Array<{ value: PromptDisplay; label: string }> = [
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
  { value: "hidden", label: "Hidden" },
];

const japaneseDisplayOptions: Array<{ value: JapaneseDisplayMode; label: string }> = [
  { value: "surface", label: "Kanji/kana" },
  { value: "kana", label: "Hiragana" },
  { value: "romaji", label: "Romaji" },
];

const audioLanguageOptions: Array<{ value: PracticeSettings["audioLanguage"]; label: string }> = [
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
  { value: "same", label: "Same" },
  { value: "opposite", label: "Opposite" },
];

const autoAdvanceOrderOptions: Array<{ value: PracticeSettings["autoAdvanceOrder"]; label: string }> = [
  { value: "sequential", label: "Sequential" },
  { value: "random", label: "Random" },
];

type VocabularyTab = "dictionary" | "new" | "review" | "known" | "function";
const functionWords = (functionWordsJson as FunctionWordEntry[]).map(word => dictionaryWord(word.id) ?? word);
const sourceWordsById = new Map<string, WordEntry>(courseDictionaryWords().map(word => [word.id, word]));
const functionWordsByToken = new Map(functionWords.map((word) => [`${word.surface}|${word.reading}`, word]));
const functionWordTypes = new Set(["particle", "sentence ending"]);

const vocabularyTabs: Array<{ id: VocabularyTab; label: string }> = [
  { id: "dictionary", label: "Dictionary" },
  { id: "new", label: "New" },
  { id: "review", label: "Review" },
  { id: "known", label: "Known" },
  { id: "function", label: "Function" },
];

function clampCardIndex(index: number, cards: PracticeCard[]) {
  if (cards.length === 0) return 0;
  return Math.min(Math.max(index, 0), cards.length - 1);
}

function isFormTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
}

function nextJapaneseDisplayMode(mode: JapaneseDisplayMode): JapaneseDisplayMode {
  if (mode === "surface") return "kana";
  if (mode === "kana") return "romaji";
  return "surface";
}

function nextOption<T>(options: Array<{ value: T }>, currentValue: T) {
  const currentIndex = options.findIndex((option) => option.value === currentValue);
  return options[(currentIndex + 1) % options.length].value;
}

function optionLabel<T>(options: Array<{ value: T; label: string }>, currentValue: T) {
  return options.find((option) => option.value === currentValue)?.label ?? String(currentValue);
}

function displayedPart(card: PracticeCard, index: number, mode: JapaneseDisplayMode) {
  if (mode === "surface") return card.line[index] ?? "";
  const reading = card.tts[index] ?? card.line[index] ?? "";
  if (mode === "kana") return reading;
  return toRomaji(reading);
}

function phoneticPart(card: PracticeCard, index: number) {
  return toRomaji(card.tts[index] ?? card.tokens[index]?.reading ?? card.line[index] ?? "");
}

function sentenceLengthClass(card: PracticeCard) {
  const length = card.line.join("").length;
  if (length >= 18) return "dense-line";
  if (length >= 13) return "long-line";
  return "";
}

function levelForUnit(unitId: number) {
  return courseLevels.levels.find((level) => unitId >= level.unitStart && unitId <= level.unitEnd);
}

function groupedUnitsByLevel() {
  return courseLevels.levels.map((level) => ({
    level,
    units: unitIndex.units.filter((entry) => entry.id >= level.unitStart && entry.id <= level.unitEnd),
  }));
}

function Keycap({ children }: { children: string }) {
  return (
    <kbd className="keycap" aria-hidden="true">
      {children}
    </kbd>
  );
}

function progressColorForPercent(percent: number) {
  const clamped = Math.min(100, Math.max(0, percent));
  const hue = clamped <= 50 ? 4 + (clamped / 50) * 44 : 48 + ((clamped - 50) / 50) * 88;
  const lightness = clamped < 50 ? 47 : 43;
  return `hsl(${Math.round(hue)} 70% ${lightness}%)`;
}

function mediaUrl(path: string) {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}

function lexicalWordsUsedInUnit(unit: { cards: PracticeCard[] }) {
  const words = new Map<string, WordEntry>();
  for (const card of unit.cards) {
    for (const token of card.tokens ?? []) {
      if (!token.wordId) continue;
      const word = sourceWordsById.get(token.wordId);
      if (word) words.set(word.id, word);
    }
  }
  return [...words.values()];
}

function knownWordsForUnit(unit: { newWords: WordEntry[]; reviewWordIds: string[]; cards: PracticeCard[] }) {
  const currentIds = new Set(unit.newWords.map((word) => word.id));
  const reviewIds = new Set(unit.reviewWordIds);
  return lexicalWordsUsedInUnit(unit).filter((word) => !currentIds.has(word.id) && !reviewIds.has(word.id));
}

function reviewWordsForUnit(unit: { reviewWordIds: string[] }) {
  return unit.reviewWordIds.map((wordId) => sourceWordsById.get(wordId)).filter((word): word is WordEntry => Boolean(word));
}

function uniqueWords(words: WordEntry[]) {
  return words.filter((word, index) => words.findIndex((candidate) => candidate.id === word.id) === index);
}

function functionWordsForUnit(unit: { cards: PracticeCard[] }) {
  const words = new Map<string, FunctionWordEntry>();
  for (const card of unit.cards) {
    for (const token of card.tokens ?? []) {
      if (token.wordId) continue;
      const functionWord = functionWordsByToken.get(`${token.surface}|${token.reading}`);
      if (functionWord && functionWordTypes.has(functionWord.function)) words.set(functionWord.id, functionWord);
    }
  }
  return [...words.values()];
}

function VocabularyPanel({
  unitId,
  dictionaryWords,
  newWords,
  reviewWords,
  knownWords,
  functionWords,
}: {
  unitId: number;
  dictionaryWords: WordEntry[];
  newWords: WordEntry[];
  reviewWords: WordEntry[];
  knownWords: WordEntry[];
  functionWords: FunctionWordEntry[];
}) {
  const [activeTab, setActiveTab] = useState<VocabularyTab>("dictionary");
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
  const wordsByTab = {
    dictionary: dictionaryWords,
    new: newWords,
    review: reviewWords,
    known: knownWords,
    function: functionWords,
  };
  const activeWords = wordsByTab[activeTab];

  useEffect(() => {
    setActiveTab("dictionary");
    setSelectedWord(null);
  }, [unitId]);

  return (
    <section className="vocabulary-panel" aria-label="Unit vocabulary">
      <div className="vocabulary-topline">
        <div>
          <p className="eyebrow">Vocabulary</p>
          <strong>{dictionaryWords.length} unit dictionary entries</strong>
          <span>
            {newWords.length} new / {reviewWords.length} review / {knownWords.length} known here / {functionWords.length} function
          </span>
        </div>
      </div>

      <div className="vocabulary-tabs" role="tablist" aria-label="Vocabulary groups">
        {vocabularyTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span>{wordsByTab[tab.id].length}</span>
          </button>
        ))}
      </div>

      {activeWords.length > 0 ? (
        <div className="word-grid">
          {activeWords.map((word) => (
            <button
              key={`${activeTab}-${word.id}`}
              type="button"
              className="word-tile"
              onClick={() => setSelectedWord(word)}
              aria-label={`Open ${word.surface}`}
            >
              <span className="word-surface">{word.surface}</span>
              <span className="word-reading">{word.reading}</span>
              <span className="word-function">{word.function}</span>
              <strong>{word.meaning}</strong>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-vocabulary">No words in this group yet.</p>
      )}

      {selectedWord && (
        <div className="word-modal-backdrop" role="presentation" onClick={() => setSelectedWord(null)}>
          <article
            className="word-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedWord.surface} dictionary entry`}
            onClick={(event) => event.stopPropagation()}
          >
            <span className="word-surface">{selectedWord.surface}</span>
            <span className="word-reading">{selectedWord.reading}</span>
            <span className="word-function">{selectedWord.function}</span>
            <strong>{selectedWord.meaning}</strong>
          </article>
        </div>
      )}
    </section>
  );
}

function JapaneseLine({
  card,
  mode,
  muted = false,
  onSpeakPart,
}: {
  card: PracticeCard;
  mode: JapaneseDisplayMode;
  muted?: boolean;
  onSpeakPart: (part: CardToken, fallbackText: string) => void;
}) {
  if (muted) return <div className="japanese-line muted-line">Japanese hidden</div>;

  return (
    <div
      className={["japanese-line", mode !== "surface" ? "reading-mode" : "", sentenceLengthClass(card)].filter(Boolean).join(" ")}
      aria-label="Japanese sentence"
      data-sentence={card.line.join("")}
    >
      {card.tokens.map((part, index) => (
        <button
          key={`${card.id}-${index}`}
          type="button"
          className={part.wordId ? "token lexical" : "token grammar"}
          aria-label={`Play ${part.surface}`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => onSpeakPart(part, card.tts[index] ?? part.reading ?? part.surface)}
        >
          {displayedPart(card, index, mode)}
          <span className="token-tip">
            <b>{part.surface}</b>
            <small>{phoneticPart(card, index)}</small>
            <small>{part.explain}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

export function App() {
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === "undefined") return defaultProgress;
    return readProgress();
  });
  const [unit, setUnit] = useState(initialUnit);
  const [loadingUnitId, setLoadingUnitId] = useState<number | null>(null);
  const [unitLoadError, setUnitLoadError] = useState("");
  const [unitMapOpen, setUnitMapOpen] = useState(false);
  const [activeBrowseLevel, setActiveBrowseLevel] = useState("A1");
  const [currentDisplay, setCurrentDisplay] = useState<PromptDisplay>(() => progress.settings.defaultDisplay);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [vocabularyOpen, setVocabularyOpen] = useState(false);
  const [message, setMessage] = useState("");
  const queuedAudioTimeout = useRef<number | undefined>();
  const audioRunId = useRef(0);

  const levelGroups = useMemo(groupedUnitsByLevel, []);
  const currentLevel = levelForUnit(progress.unitId);
  const activeBrowseGroup = levelGroups.find(({ level }) => level.code === activeBrowseLevel) ?? levelGroups.find(({ level }) => level.code === currentLevel?.code) ?? levelGroups[0];
  const cardIndex = clampCardIndex(progress.cardIndex, unit.cards);
  const card = unit.cards[cardIndex];
  const settings = progress.settings;
  const completed = progress.completedUnits.includes(unit.id);
  const progressPercent = unit.cards.length > 0 ? Math.round(((cardIndex + 1) / unit.cards.length) * 100) : 0;
  const progressColor = progressColorForPercent(progressPercent);
  const reviewWords = useMemo(() => reviewWordsForUnit(unit), [unit.id, unit.reviewWordIds]);
  const knownWords = useMemo(() => knownWordsForUnit(unit), [unit.id, unit.cards, unit.newWords, unit.reviewWordIds]);
  const dictionaryWords = useMemo(() => uniqueWords([...unit.newWords, ...reviewWords, ...knownWords]), [knownWords, reviewWords, unit.newWords]);
  const activeFunctionWords = useMemo(() => functionWordsForUnit(unit), [unit.id, unit.cards]);

  useEffect(() => {
    if (unit.id === progress.unitId) {
      return undefined;
    }

    let cancelled = false;
    setLoadingUnitId(progress.unitId);
    setUnitLoadError("");

    getUnit(progress.unitId)
      .then((loadedUnit) => {
        if (cancelled) return;
        setUnit(loadedUnit);
        setLoadingUnitId(null);
        setProgress((current) => {
          if (current.unitId !== loadedUnit.id) return current;
          const nextCardIndex = clampCardIndex(current.cardIndex, loadedUnit.cards);
          return {
            ...current,
            cardIndex: nextCardIndex,
            cardPositions: { ...current.cardPositions, [String(loadedUnit.id)]: nextCardIndex },
            cardCounts: { ...current.cardCounts, [String(loadedUnit.id)]: loadedUnit.cards.length },
          };
        });
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setLoadingUnitId(null);
        setUnitLoadError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [progress.unitId, unit.id]);

  useEffect(() => {
    if (unit.id !== progress.unitId) return;
    const nextProgress = {
      ...progress,
      cardIndex,
      cardPositions: { ...progress.cardPositions, [String(unit.id)]: cardIndex },
      cardCounts: { ...progress.cardCounts, [String(unit.id)]: unit.cards.length },
    };
    writeProgress(nextProgress);
  }, [cardIndex, progress, unit.id]);

  useEffect(() => {
    if (!currentLevel || unitMapOpen) return;
    setActiveBrowseLevel(currentLevel.code);
  }, [currentLevel?.code, unitMapOpen]);

  const updateProgress = useCallback((patch: Partial<Progress>) => {
    setProgress((current) => ({ ...current, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<PracticeSettings>) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, []);

  const updateDefaultDisplay = useCallback(
    (defaultDisplay: PromptDisplay) => {
      updateSettings({ defaultDisplay });
      setCurrentDisplay(defaultDisplay);
    },
    [updateSettings]
  );

  const toggleDisplayLanguage = useCallback(() => {
    setCurrentDisplay((display) => (display === "japanese" ? "english" : "japanese"));
  }, []);

  const applyStudyPreset = useCallback(
    (preset: (typeof studyPresets)[number]) => {
      updateSettings(preset.settings);
      setCurrentDisplay(preset.settings.defaultDisplay ?? "japanese");
      setMessage(`${preset.label} mode`);
    },
    [updateSettings]
  );

  const goToCard = useCallback(
    (nextIndex: number) => {
      const clampedIndex = clampCardIndex(nextIndex, unit.cards);
      setProgress((current) => ({
        ...current,
        cardIndex: clampedIndex,
        cardPositions: { ...current.cardPositions, [String(unit.id)]: clampedIndex },
        cardCounts: { ...current.cardCounts, [String(unit.id)]: unit.cards.length },
      }));
      setCurrentDisplay(settings.defaultDisplay);
    },
    [settings.defaultDisplay, unit.cards, unit.id]
  );

  const randomCard = useCallback(() => {
    if (unit.cards.length <= 1) return;
    let nextIndex = cardIndex;
    while (nextIndex === cardIndex) {
      nextIndex = Math.floor(Math.random() * unit.cards.length);
    }
    goToCard(nextIndex);
  }, [cardIndex, goToCard, unit.cards.length]);

  const nextCard = useCallback(() => {
    if (settings.autoAdvanceOrder === "random") {
      randomCard();
      return true;
    }
    if (cardIndex < unit.cards.length - 1) {
      goToCard(cardIndex + 1);
      return true;
    }
    setMessage("End of unit");
    return false;
  }, [cardIndex, goToCard, randomCard, settings.autoAdvanceOrder, unit.cards.length]);

  const previousCard = useCallback(() => {
    if (cardIndex > 0) goToCard(cardIndex - 1);
  }, [cardIndex, goToCard]);

  const selectUnit = (unitId: number) => {
    const resumedIndex = progress.cardPositions[String(unitId)] ?? 0;
    updateProgress({ unitId, cardIndex: resumedIndex });
    setCurrentDisplay(settings.defaultDisplay);
    setActiveBrowseLevel(levelForUnit(unitId)?.code ?? activeBrowseLevel);
    setUnitMapOpen(false);
    setMessage(`Loading unit ${String(unitId).padStart(3, "0")}`);
  };

  const getUnitProgressPercent = (entry: UnitIndexEntry) => {
    if (progress.completedUnits.includes(entry.id)) return 100;
    if (entry.id === unit.id) return progressPercent;

    const savedPosition = progress.cardPositions[String(entry.id)];
    if (typeof savedPosition !== "number") return 0;
    const cardCount = entry.id === unit.id ? unit.cards.length : progress.cardCounts[String(entry.id)];
    if (typeof cardCount !== "number" || cardCount <= 0) return 0;

    return Math.min(99, Math.max(1, Math.round(((savedPosition + 1) / cardCount) * 100)));
  };

  const renderUnitButton = (entry: UnitIndexEntry) => {
    const unitProgressPercent = getUnitProgressPercent(entry);

    return (
      <button
        key={entry.id}
        className={[
          "unit-button",
          entry.id === progress.unitId ? "active" : "",
          progress.completedUnits.includes(entry.id) ? "completed" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={
          {
            "--unit-progress": `${unitProgressPercent}%`,
            "--progress-color": progressColorForPercent(unitProgressPercent),
          } as CSSProperties
        }
        onClick={() => selectUnit(entry.id)}
        type="button"
      >
        <span className="unit-number">{String(entry.id).padStart(3, "0")}</span>
        <strong>{entry.title}</strong>
        <small>{progress.cardPositions[String(entry.id)] ? `Card ${progress.cardPositions[String(entry.id)] + 1}` : "Start"}</small>
        {progress.completedUnits.includes(entry.id) && (
          <span className="complete-pill">
            <CheckCircle2 aria-hidden="true" />
            Complete
          </span>
        )}
      </button>
    );
  };

  const levelStats = (level: CourseLevel, units: UnitIndexEntry[]) => {
    const completedInLevel = units.filter((entry) => progress.completedUnits.includes(entry.id)).length;
    const levelTotal = units.length || level.unitEnd - level.unitStart + 1;
    const levelProgressPercent = levelTotal > 0 ? Math.round((completedInLevel / levelTotal) * 100) : 0;
    return { completedInLevel, levelTotal, levelProgressPercent };
  };

  const openUnitMap = (levelCode = currentLevel?.code ?? activeBrowseLevel) => {
    setActiveBrowseLevel(levelCode);
    setUnitMapOpen(true);
  };

  const restartUnit = () => {
    goToCard(0);
    setMessage("Restarted this unit");
  };

  const toggleComplete = () => {
    const completedUnits = completed
      ? progress.completedUnits.filter((id) => id !== unit.id)
      : Array.from(new Set([...progress.completedUnits, unit.id])).sort((a, b) => a - b);
    updateProgress({ completedUnits });
    setMessage(completed ? "Unit marked incomplete" : "Unit marked complete");
  };

  const clearQueuedAudio = useCallback(() => {
    if (queuedAudioTimeout.current !== undefined) {
      window.clearTimeout(queuedAudioTimeout.current);
      queuedAudioTimeout.current = undefined;
    }
  }, []);

  const speakText = useCallback((text: string, lang: string, messageText: string, options?: { cancel?: boolean; afterEnd?: () => void; runId?: number }) => {
    if ("speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function") {
      const shouldCancel = options?.cancel ?? true;
      const runId = options?.runId ?? audioRunId.current;

      if (shouldCancel) {
        audioRunId.current += 1;
        clearQueuedAudio();
        window.speechSynthesis.cancel();
      }

      const utterance = new window.SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      if (options?.afterEnd) {
        utterance.onend = () => {
          if (runId !== audioRunId.current) return;
          queuedAudioTimeout.current = window.setTimeout(() => {
            queuedAudioTimeout.current = undefined;
            if (runId === audioRunId.current) options.afterEnd?.();
          }, 450);
        };
      }
      window.speechSynthesis.speak(utterance);
      setMessage(messageText);
      return;
    }

    setMessage("Audio queued");
  }, [clearQueuedAudio]);

  const playAudioRef = useCallback((audioRef: string, messageText = "Japanese audio") => {
    try {
      const audio = new Audio(mediaUrl(audioRef));
      const playResult = audio.play();
      if (playResult && "catch" in playResult) {
        playResult.catch(() => setMessage("Audio could not play"));
      }
      setMessage(messageText);
      return true;
    } catch {
      setMessage("Audio could not play");
      return false;
    }
  }, []);

  const playJapaneseAudio = useCallback(() => {
    if (card.audioRef) {
      playAudioRef(card.audioRef);
      return;
    }

    speakText(card.line.join(""), "ja-JP", "Japanese audio");
  }, [card, playAudioRef, speakText]);

  const playEnglishAudio = useCallback(() => {
    speakText(card.english, "en-US", "English audio");
  }, [card.english, speakText]);

  const playJapanesePart = useCallback(
    (part: CardToken, fallbackText: string) => {
      const recording = recordingForToken(part) ?? part.audioRef;
      if (recording && playAudioRef(recording)) return;
      speakText(speechForToken(part) || fallbackText, "ja-JP", "Japanese audio");
    },
    [playAudioRef, speakText]
  );

  const resolvedAudioLanguage = useMemo(() => {
    if (settings.audioLanguage === "same") {
      return currentDisplay === "english" ? "english" : "japanese";
    }

    if (settings.audioLanguage === "opposite") {
      return currentDisplay === "japanese" ? "english" : "japanese";
    }

    return settings.audioLanguage;
  }, [currentDisplay, settings.audioLanguage]);

  const replayAudio = useCallback(() => {
    if (resolvedAudioLanguage === "english") {
      playEnglishAudio();
      return;
    }

    playJapaneseAudio();
  }, [playEnglishAudio, playJapaneseAudio, resolvedAudioLanguage]);

  useEffect(() => {
    if (settings.autoPlayAudio) replayAudio();
  }, [card.id, replayAudio, settings.autoPlayAudio]);

  useEffect(() => {
    if (!settings.autoAdvance) return undefined;

    const timeout = window.setTimeout(() => {
      nextCard();
    }, settings.autoAdvanceDelayMs);

    return () => window.clearTimeout(timeout);
  }, [card.id, nextCard, settings.autoAdvance, settings.autoAdvanceDelayMs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isFormTarget(event.target)) return;

      if (event.key === " " && event.shiftKey) {
        event.preventDefault();
        previousCard();
      } else if (event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        nextCard();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        previousCard();
      } else if (event.key === "1") {
        event.preventDefault();
        toggleDisplayLanguage();
      } else if (event.key === "2") {
        event.preventDefault();
        replayAudio();
      } else if (event.key.toLowerCase() === "s") {
        setSettingsOpen((open) => !open);
      } else if (event.key.toLowerCase() === "j") {
        updateSettings({ japaneseDisplay: nextJapaneseDisplayMode(settings.japaneseDisplay) });
      } else if (event.key === "Escape") {
        setUnitMapOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextCard, previousCard, replayAudio, settings.japaneseDisplay, toggleDisplayLanguage, updateSettings]);

  const cardContent = currentDisplay === "hidden" ? (
    <div className="prompt-placeholder" aria-label="Prompt text hidden">
      Listen and guess
    </div>
  ) : currentDisplay === "japanese" ? (
    <JapaneseLine card={card} mode={settings.japaneseDisplay} onSpeakPart={playJapanesePart} />
  ) : (
    <p className="english-front">{card.english}</p>
  );
  const languageToggleLabel = currentDisplay === "japanese" ? "Show English" : "Show Japanese";

  return (
    <main
      className="app-shell"
      data-theme={settings.theme}
      style={{ "--app-background-image": `url("${mediaUrl("kotoba-background.png")}")` } as CSSProperties}
    >
      <aside className="unit-rail" aria-label="Curriculum map">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <BookOpen />
            <Sparkles />
          </span>
          <span>
            Kotoba
            <small>ことば</small>
          </span>
        </div>

        <div className="rail-heading">
          <Layers3 aria-hidden="true" />
          <span>Course</span>
        </div>

        <button type="button" className="current-unit-card" onClick={() => openUnitMap(currentLevel?.code)}>
          <span className="eyebrow">Current unit</span>
          <strong>{String(unit.id).padStart(3, "0")}</strong>
          <span>{unit.title}</span>
          <em>{progressPercent}% complete</em>
        </button>

        <div className="level-summary-list">
          {levelGroups.map(({ level, units }) => {
            const isCurrentLevel = currentLevel?.code === level.code;
            const { completedInLevel, levelTotal, levelProgressPercent } = levelStats(level, units);
            return (
              <button
                key={level.code}
                type="button"
                className={isCurrentLevel ? "level-summary active" : "level-summary"}
                style={
                  {
                    "--level-progress": `${levelProgressPercent}%`,
                    "--progress-color": progressColorForPercent(levelProgressPercent),
                  } as CSSProperties
                }
                onClick={() => openUnitMap(level.code)}
              >
                <strong>{level.code}</strong>
                <span>{level.title}</span>
                <em>
                  {completedInLevel}/{levelTotal}
                </em>
              </button>
            );
          })}
        </div>

        <button type="button" className="browse-units-button" onClick={() => openUnitMap()}>
          <List aria-hidden="true" />
          <span>Browse units</span>
        </button>
      </aside>

      {unitMapOpen && (
        <div className="unit-map-backdrop" role="presentation" onClick={() => setUnitMapOpen(false)}>
          <section
            className="unit-map-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Choose unit"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="unit-map-header">
              <div>
                <p className="eyebrow">Curriculum map</p>
                <h2>Choose a unit</h2>
              </div>
              <button type="button" className="icon-button" title="Close unit browser" onClick={() => setUnitMapOpen(false)}>
                <X aria-hidden="true" />
                <span>Close</span>
              </button>
            </header>

            <div className="level-tabs" role="tablist" aria-label="Course levels">
              {levelGroups.map(({ level, units }) => {
                const { completedInLevel, levelTotal, levelProgressPercent } = levelStats(level, units);
                const selected = activeBrowseGroup?.level.code === level.code;
                return (
                  <button
                    key={level.code}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveBrowseLevel(level.code)}
                    style={
                      {
                        "--level-progress": `${levelProgressPercent}%`,
                        "--progress-color": progressColorForPercent(levelProgressPercent),
                      } as CSSProperties
                    }
                  >
                    <strong>{level.code}</strong>
                    <span>
                      {completedInLevel}/{levelTotal}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeBrowseGroup && (
              <div className="unit-map-content">
                <div className="unit-map-intro">
                  <div>
                    <strong>{activeBrowseGroup.level.title}</strong>
                    <span>{activeBrowseGroup.level.canDoSummary}</span>
                  </div>
                  <em>{activeBrowseGroup.units.length || `${activeBrowseGroup.level.unitStart}-${activeBrowseGroup.level.unitEnd}`} units</em>
                </div>

                {activeBrowseGroup.units.length > 0 ? (
                  <div className="unit-grid" aria-label={`${activeBrowseGroup.level.code} units`}>
                    {activeBrowseGroup.units.map(renderUnitButton)}
                  </div>
                ) : (
                  <div className="planned-level large">
                    <strong>Planned</strong>
                    <small>{activeBrowseGroup.level.canDoSummary}</small>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      <section className="practice-panel" aria-label="Practice player">
        {unitLoadError && <div className="load-state error">{unitLoadError}</div>}
        {loadingUnitId !== null && loadingUnitId !== unit.id && (
          <div className="load-state">Loading unit {String(loadingUnitId).padStart(3, "0")}</div>
        )}

        <header className="practice-header">
          <div>
            <p className="eyebrow">Unit {String(unit.id).padStart(3, "0")}</p>
            <h1>{unit.title}</h1>
            <p>{unit.grammarFocus}</p>
          </div>
          <div className="header-actions">
            <label className="card-jump">
              <span>Card</span>
              <select
                aria-label="Card number"
                value={cardIndex + 1}
                onChange={(event) => goToCard(Number(event.target.value) - 1)}
              >
                {unit.cards.map((entry, index) => (
                  <option key={entry.id} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
              <span>/ {unit.cards.length}</span>
            </label>
            <button
              className={`icon-button ${completed ? "incomplete-action" : "complete-action"}`}
              title={completed ? "Mark unit incomplete" : "Mark unit complete"}
              onClick={toggleComplete}
            >
              {completed ? <CircleMinus aria-hidden="true" /> : <CheckCircle2 aria-hidden="true" />}
              <span>{completed ? "Mark Incomplete" : "Mark Unit Complete"}</span>
            </button>
            <button
              className="icon-button"
              title="Open vocabulary"
              onClick={() => setVocabularyOpen((open) => !open)}
              aria-expanded={vocabularyOpen}
            >
              <BookOpen aria-hidden="true" />
              <span>Words</span>
            </button>
            <button className="icon-button" title="Open settings" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
              <Settings aria-hidden="true" />
              <span>Settings</span>
              <Keycap>S</Keycap>
            </button>
          </div>
        </header>

        <div className="unit-progress" aria-label={`Unit progress ${progressPercent}%`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPercent}>
          <span
            style={
              {
                width: `${progressPercent}%`,
                "--progress-color": progressColor,
              } as CSSProperties
            }
          />
        </div>

        <div className="vocabulary-slot">
          {vocabularyOpen && (
            <VocabularyPanel
              unitId={unit.id}
              dictionaryWords={dictionaryWords}
              newWords={unit.newWords}
              reviewWords={reviewWords}
              knownWords={knownWords}
              functionWords={activeFunctionWords}
            />
          )}
        </div>

        {settingsOpen && (
          <section className="settings-panel" aria-label="Practice settings">
            <div className="settings-section settings-section-wide">
              <h2>Modes</h2>
              <div className="mode-strip" aria-label="Study modes">
                {studyPresets.map((preset) => (
                  <button key={preset.id} type="button" onClick={() => applyStudyPreset(preset)}>
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="settings-section">
              <h2>Card</h2>
              <button
                className="setting-button"
                type="button"
                aria-label={`Default shown: ${optionLabel(promptDisplayOptions, settings.defaultDisplay)}`}
                onClick={() => updateDefaultDisplay(nextOption(promptDisplayOptions, settings.defaultDisplay))}
              >
                {optionLabel(promptDisplayOptions, settings.defaultDisplay)}
              </button>
              <button
                className="setting-button"
                type="button"
                aria-label={`Japanese display: ${optionLabel(japaneseDisplayOptions, settings.japaneseDisplay)}`}
                onClick={() => updateSettings({ japaneseDisplay: nextOption(japaneseDisplayOptions, settings.japaneseDisplay) })}
              >
                {optionLabel(japaneseDisplayOptions, settings.japaneseDisplay)}
              </button>
            </div>

            <div className="settings-section">
              <h2>Audio</h2>
              <button
                className="setting-button"
                type="button"
                aria-label={`Audio: ${optionLabel(audioLanguageOptions, settings.audioLanguage)}`}
                onClick={() => updateSettings({ audioLanguage: nextOption(audioLanguageOptions, settings.audioLanguage) })}
              >
                {optionLabel(audioLanguageOptions, settings.audioLanguage)}
              </button>
              <button
                className={settings.autoPlayAudio ? "setting-button active" : "setting-button"}
                type="button"
                aria-pressed={settings.autoPlayAudio}
                aria-label={`Auto audio ${settings.autoPlayAudio ? "on" : "off"}`}
                onClick={() => updateSettings({ autoPlayAudio: !settings.autoPlayAudio })}
              >
                Auto
              </button>
            </div>

            <div className="settings-section">
              <h2>Flow</h2>
              <button
                className={settings.autoAdvance ? "setting-button active" : "setting-button"}
                type="button"
                aria-pressed={settings.autoAdvance}
                aria-label={`Auto advance ${settings.autoAdvance ? "on" : "off"}`}
                onClick={() => updateSettings({ autoAdvance: !settings.autoAdvance })}
              >
                Auto
              </button>
              <button
                className="setting-button"
                type="button"
                aria-label={`Order: ${optionLabel(autoAdvanceOrderOptions, settings.autoAdvanceOrder)}`}
                onClick={() => updateSettings({ autoAdvanceOrder: nextOption(autoAdvanceOrderOptions, settings.autoAdvanceOrder) })}
              >
                {optionLabel(autoAdvanceOrderOptions, settings.autoAdvanceOrder)}
              </button>
              <div className="setting-stepper" role="group" aria-label={`Delay: ${settings.autoAdvanceDelayMs / 1000} seconds`}>
                <button
                  type="button"
                  aria-label="Decrease delay"
                  onClick={() => updateSettings({ autoAdvanceDelayMs: Math.max(2000, settings.autoAdvanceDelayMs - 1000) })}
                >
                  -
                </button>
                <span>{settings.autoAdvanceDelayMs / 1000}s</span>
                <button
                  type="button"
                  aria-label="Increase delay"
                  onClick={() => updateSettings({ autoAdvanceDelayMs: Math.min(30000, settings.autoAdvanceDelayMs + 1000) })}
                >
                  +
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h2>Display</h2>
              <button
                className={settings.theme === "dark" ? "setting-button active" : "setting-button"}
                type="button"
                aria-pressed={settings.theme === "dark"}
                aria-label={`Dark mode ${settings.theme === "dark" ? "on" : "off"}`}
                onClick={() => updateSettings({ theme: settings.theme === "dark" ? "light" : "dark" })}
              >
                Dark
              </button>
            </div>
          </section>
        )}

        <article className="card-stage">
          <div
            key={`card-${card.id}-${currentDisplay}-${settings.japaneseDisplay}`}
            className={`stage-slot card-slot ${currentDisplay === "hidden" ? "is-hidden" : ""}`}
            aria-label="Card display area"
          >
            {cardContent}
          </div>

        </article>

        <footer className="practice-controls">
          <button title="Previous card" onClick={previousCard} disabled={cardIndex === 0}>
            <ChevronLeft aria-hidden="true" />
            <span>Previous</span>
            <Keycap>Shift Space</Keycap>
          </button>
          <button title={languageToggleLabel} onClick={toggleDisplayLanguage}>
            <Eye aria-hidden="true" />
            <span>{languageToggleLabel}</span>
            <Keycap>1</Keycap>
          </button>
          <button title="Play audio" onClick={replayAudio}>
            <Volume2 aria-hidden="true" />
            <span>Play Audio</span>
            <Keycap>2</Keycap>
          </button>
          <button title="Next card" onClick={nextCard} aria-disabled={cardIndex === unit.cards.length - 1}>
            <ChevronRight aria-hidden="true" />
            <span>Next</span>
            <Keycap>Space</Keycap>
          </button>
          <button title="Restart this unit" onClick={restartUnit}>
            <RotateCcw aria-hidden="true" />
            <span>Restart</span>
          </button>
        </footer>

        <div className="status-row" aria-live="polite">
          <span>{`Card ${cardIndex + 1} / ${unit.cards.length} · ${progressPercent}% complete`}</span>
          <span>{completed ? "Completed" : `${unit.cards.length - cardIndex - 1} cards left`}</span>
          {message && <span>{message}</span>}
        </div>
      </section>
    </main>
  );
}
