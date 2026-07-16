import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleMinus,
  Eye,
  EyeOff,
  List,
  RotateCcw,
  Settings,
  Shuffle,
  Sparkles,
  Volume2,
} from "lucide-react";
import functionWordsJson from "../data/jp/curriculum/function_words.json";
import grammarTokensJson from "../data/jp/curriculum/grammar_tokens.json";
import unitSpecsJson from "../data/jp/curriculum/source/unit_specs.json";
import { courseLevels, getUnit, initialUnit, unitIndex } from "./data";
import { toRomaji } from "./japanese";
import { defaultProgress, readProgress, writeProgress } from "./progress";
import type { CardToken, CourseLevel, FunctionWordEntry, GrammarTokenEntry, JapaneseDisplayMode, PracticeCard, PracticeSettings, Progress, UnitIndexEntry, WordEntry } from "./types";

const studyPresets: Array<{ id: string; label: string; settings: Partial<PracticeSettings> }> = [
  {
    id: "reading",
    label: "Reading",
    settings: {
      showPromptText: true,
      cardFront: "japanese",
      revealByDefault: false,
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "listening",
    label: "Listening",
    settings: {
      showPromptText: false,
      cardFront: "japanese",
      revealByDefault: false,
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "recall",
    label: "Recall",
    settings: {
      showPromptText: true,
      cardFront: "english",
      revealByDefault: false,
      autoPlayAudio: false,
      audioLanguage: "japanese",
      autoAdvance: false,
    },
  },
  {
    id: "rapid",
    label: "Rapid",
    settings: {
      showPromptText: true,
      cardFront: "japanese",
      revealByDefault: false,
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: true,
      autoAdvanceOrder: "sequential",
      autoAdvanceDelayMs: 5000,
    },
  },
];

type VocabularyTab = "new" | "review" | "known" | "function" | "grammar";
type SourceUnitSpec = { id: number; newWords: WordEntry[] };
const unitSpecs = unitSpecsJson as { units: SourceUnitSpec[] };
const functionWords = functionWordsJson as FunctionWordEntry[];
const grammarTokens = grammarTokensJson as GrammarTokenEntry[];
const sourceWordsById = new Map(unitSpecs.units.flatMap((spec) => spec.newWords.map((word) => [word.id, word])));
const functionWordsByToken = new Map(functionWords.map((word) => [`${word.surface}|${word.reading}`, word]));
const grammarTokensByToken = new Map(grammarTokens.map((word) => [`${word.surface}|${word.reading}`, word]));

const vocabularyTabs: Array<{ id: VocabularyTab; label: string }> = [
  { id: "new", label: "New" },
  { id: "review", label: "Review" },
  { id: "known", label: "Known" },
  { id: "function", label: "Function" },
  { id: "grammar", label: "Grammar" },
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

function knownWordsForUnit(unitId: number) {
  if (unitId >= 100) {
    return unitSpecs.units.find((spec) => spec.id === unitId)?.newWords ?? [];
  }
  return unitSpecs.units.filter((spec) => spec.id >= 1 && spec.id <= unitId && spec.id < 100).flatMap((spec) => spec.newWords);
}

function reviewWordsForUnit(unit: { reviewWordIds: string[] }) {
  return unit.reviewWordIds.map((wordId) => sourceWordsById.get(wordId)).filter((word): word is WordEntry => Boolean(word));
}

function functionWordsForUnit(unit: { cards: PracticeCard[] }) {
  const words = new Map<string, FunctionWordEntry>();
  for (const card of unit.cards) {
    for (const token of card.tokens ?? []) {
      if (token.wordId) continue;
      const functionWord = functionWordsByToken.get(`${token.surface}|${token.reading}`);
      if (functionWord) words.set(functionWord.id, functionWord);
    }
  }
  return [...words.values()];
}

function grammarTokensForUnit(unit: { cards: PracticeCard[] }) {
  const words = new Map<string, GrammarTokenEntry>();
  for (const card of unit.cards) {
    for (const token of card.tokens ?? []) {
      if (token.wordId) continue;
      const grammarToken = grammarTokensByToken.get(`${token.surface}|${token.reading}`);
      if (grammarToken) words.set(grammarToken.id, grammarToken);
    }
  }
  return [...words.values()];
}

function VocabularyPanel({
  unitId,
  newWords,
  reviewWords,
  knownWords,
  functionWords,
  grammarTokens,
}: {
  unitId: number;
  newWords: WordEntry[];
  reviewWords: WordEntry[];
  knownWords: WordEntry[];
  functionWords: FunctionWordEntry[];
  grammarTokens: GrammarTokenEntry[];
}) {
  const [activeTab, setActiveTab] = useState<VocabularyTab>("new");
  const [showTranslations, setShowTranslations] = useState(false);
  const [revealedWordIds, setRevealedWordIds] = useState<Set<string>>(() => new Set());
  const [drillActive, setDrillActive] = useState(false);
  const [drillIndex, setDrillIndex] = useState(0);
  const [drillRevealed, setDrillRevealed] = useState(false);
  const drillWords = useMemo(() => {
    const words = [...newWords, ...reviewWords];
    return words.filter((word, index) => words.findIndex((candidate) => candidate.id === word.id) === index);
  }, [newWords, reviewWords]);
  const drillWord = drillWords[drillIndex] ?? drillWords[0];
  const wordsByTab = {
    new: newWords,
    review: reviewWords,
    known: knownWords,
    function: functionWords,
    grammar: grammarTokens,
  };
  const activeWords = wordsByTab[activeTab];

  useEffect(() => {
    setActiveTab("new");
    setShowTranslations(false);
    setRevealedWordIds(new Set());
    setDrillActive(false);
    setDrillIndex(0);
    setDrillRevealed(false);
  }, [unitId]);

  useEffect(() => {
    if (drillIndex >= drillWords.length) {
      setDrillIndex(0);
      setDrillRevealed(false);
    }
  }, [drillIndex, drillWords.length]);

  const toggleWord = (wordId: string) => {
    setRevealedWordIds((current) => {
      const next = new Set(current);
      if (next.has(wordId)) next.delete(wordId);
      else next.add(wordId);
      return next;
    });
  };

  const startDrill = () => {
    setDrillActive(true);
    setDrillIndex(0);
    setDrillRevealed(false);
  };

  const moveDrill = (step: number) => {
    if (drillWords.length === 0) return;
    setDrillIndex((current) => (current + step + drillWords.length) % drillWords.length);
    setDrillRevealed(false);
  };

  return (
    <section className="vocabulary-panel" aria-label="Unit vocabulary">
      <div className="vocabulary-topline">
        <div>
          <p className="eyebrow">Vocabulary</p>
          <strong>{newWords.length} new words</strong>
          <span>
            {reviewWords.length} scheduled review · {functionWords.length} function · {grammarTokens.length} grammar · {knownWords.length} known total
          </span>
        </div>
        <button type="button" className="translation-toggle" onClick={() => setShowTranslations((visible) => !visible)}>
          {showTranslations ? "Hide translations" : "Show translations"}
        </button>
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

      {drillWords.length > 0 && (
        <div className="vocabulary-drill" aria-label="Vocabulary drill">
          {!drillActive || !drillWord ? (
            <button type="button" className="drill-start" onClick={startDrill}>
              Drill new + review
              <span>{drillWords.length} words</span>
            </button>
          ) : (
            <>
              <div className="drill-card">
                <span>
                  Word {drillIndex + 1} / {drillWords.length}
                </span>
                <strong>{drillWord.surface}</strong>
                <small>{drillWord.reading}</small>
                {drillRevealed ? <em>{drillWord.meaning}</em> : <em className="drill-hidden">English hidden</em>}
              </div>
              <div className="drill-controls">
                <button type="button" onClick={() => moveDrill(-1)}>
                  Previous
                </button>
                <button type="button" onClick={() => setDrillRevealed((revealed) => !revealed)}>
                  {drillRevealed ? "Hide English" : "Show English"}
                </button>
                <button type="button" onClick={() => moveDrill(1)}>
                  Next
                </button>
                <button type="button" onClick={() => setDrillActive(false)}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {activeWords.length > 0 ? (
        <div className="word-grid">
          {activeWords.map((word) => {
            const isRevealed = showTranslations || revealedWordIds.has(word.id);
            return (
              <button
                key={`${activeTab}-${word.id}`}
                type="button"
                className="word-tile"
                onClick={() => toggleWord(word.id)}
                aria-expanded={isRevealed}
                aria-label={`${isRevealed ? "Hide" : "Reveal"} translation for ${word.surface}`}
              >
                <span className="word-surface">{word.surface}</span>
                <span className="word-reading">{word.reading}</span>
                <span className="word-function">{word.function}</span>
                {isRevealed ? <strong>{word.meaning}</strong> : <em>Tap for English</em>}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="empty-vocabulary">No scheduled review words for this unit.</p>
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
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(() => ({ Kana: true, A1: true }));
  const [showBack, setShowBack] = useState(() => progress.settings.revealByDefault);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [vocabularyOpen, setVocabularyOpen] = useState(false);
  const [message, setMessage] = useState("");
  const queuedAudioTimeout = useRef<number | undefined>();
  const audioRunId = useRef(0);

  const levelGroups = useMemo(groupedUnitsByLevel, []);
  const currentLevel = levelForUnit(progress.unitId);
  const cardIndex = clampCardIndex(progress.cardIndex, unit.cards);
  const card = unit.cards[cardIndex];
  const settings = progress.settings;
  const completed = progress.completedUnits.includes(unit.id);
  const progressPercent = unit.cards.length > 0 ? Math.round(((cardIndex + 1) / unit.cards.length) * 100) : 0;
  const progressColor = progressColorForPercent(progressPercent);
  const reviewWords = useMemo(() => reviewWordsForUnit(unit), [unit.id, unit.reviewWordIds]);
  const knownWords = useMemo(() => knownWordsForUnit(unit.id), [unit.id]);
  const activeFunctionWords = useMemo(() => functionWordsForUnit(unit), [unit.id, unit.cards]);
  const activeGrammarTokens = useMemo(() => grammarTokensForUnit(unit), [unit.id, unit.cards]);

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
    if (!currentLevel) return;
    setExpandedLevels((current) => ({ ...current, [currentLevel.code]: true }));
  }, [currentLevel?.code]);

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

  const updateProgress = useCallback((patch: Partial<Progress>) => {
    setProgress((current) => ({ ...current, ...patch }));
  }, []);

  const updateSettings = useCallback((patch: Partial<PracticeSettings>) => {
    setProgress((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  }, []);

  const applyStudyPreset = useCallback(
    (preset: (typeof studyPresets)[number]) => {
      updateSettings(preset.settings);
      setShowBack(Boolean(preset.settings.revealByDefault));
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
      setShowBack(settings.revealByDefault);
    },
    [settings.revealByDefault, unit.cards, unit.id]
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
    if (settings.autoAdvanceLoop && unit.cards.length > 0) {
      goToCard(0);
      return true;
    }
    setMessage("End of unit");
    return false;
  }, [cardIndex, goToCard, randomCard, settings.autoAdvanceLoop, settings.autoAdvanceOrder, unit.cards.length]);

  const previousCard = useCallback(() => {
    if (cardIndex > 0) goToCard(cardIndex - 1);
  }, [cardIndex, goToCard]);

  const selectUnit = (unitId: number) => {
    const resumedIndex = progress.cardPositions[String(unitId)] ?? 0;
    updateProgress({ unitId, cardIndex: resumedIndex });
    setShowBack(settings.revealByDefault);
    setMessage(`Loading unit ${String(unitId).padStart(3, "0")}`);
  };

  const toggleLevel = (level: CourseLevel) => {
    setExpandedLevels((current) => ({ ...current, [level.code]: !current[level.code] }));
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
      if (part.audioRef && playAudioRef(part.audioRef)) return;
      speakText(fallbackText, "ja-JP", "Japanese audio");
    },
    [playAudioRef, speakText]
  );

  const replayAudio = useCallback(() => {
    if (settings.audioLanguage === "english") {
      playEnglishAudio();
      return;
    }

    if (settings.audioLanguage === "both") {
      const runId = audioRunId.current + 1;
      audioRunId.current = runId;
      clearQueuedAudio();
      window.speechSynthesis?.cancel();
      speakText(card.line.join(""), "ja-JP", "Japanese audio", {
        cancel: false,
        runId,
        afterEnd: () => speakText(card.english, "en-US", "English audio", { cancel: false, runId }),
      });
      return;
    }

    playJapaneseAudio();
  }, [card.english, card.line, clearQueuedAudio, playEnglishAudio, playJapaneseAudio, settings.audioLanguage, speakText]);

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
        setShowBack((visible) => !visible);
      } else if (event.key === "2") {
        event.preventDefault();
        replayAudio();
      } else if (event.key.toLowerCase() === "s") {
        setSettingsOpen((open) => !open);
      } else if (event.key.toLowerCase() === "j") {
        updateSettings({ japaneseDisplay: nextJapaneseDisplayMode(settings.japaneseDisplay) });
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [nextCard, previousCard, replayAudio, settings.japaneseDisplay, updateSettings]);

  const primaryIsJapanese = settings.cardFront === "japanese";
  const frontContent = !settings.showPromptText ? (
    <div className="prompt-placeholder" aria-label="Prompt text hidden">
      Listen and guess
    </div>
  ) : primaryIsJapanese ? (
    <JapaneseLine card={card} mode={settings.japaneseDisplay} onSpeakPart={playJapanesePart} />
  ) : (
    <p className="english-front">{card.english}</p>
  );
  const backContent = primaryIsJapanese ? (
    <p className="english-meaning">{card.english}</p>
  ) : (
    <JapaneseLine card={card} mode={settings.japaneseDisplay} onSpeakPart={playJapanesePart} />
  );
  const revealLabel = primaryIsJapanese
    ? showBack
      ? "Hide English"
      : "Show English"
    : showBack
      ? "Hide Japanese"
      : "Show Japanese";

  return (
    <main className="app-shell" data-theme={settings.theme}>
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
          <List aria-hidden="true" />
          <span>Levels</span>
        </div>

        <div className="level-list">
          {levelGroups.map(({ level, units }) => {
            const isExpanded = Boolean(expandedLevels[level.code]);
            const isCurrentLevel = currentLevel?.code === level.code;
            const completedInLevel = units.filter((entry) => progress.completedUnits.includes(entry.id)).length;
            const levelTotal = units.length || level.unitEnd - level.unitStart + 1;
            const levelProgressPercent = levelTotal > 0 ? Math.round((completedInLevel / levelTotal) * 100) : 0;
            return (
              <section key={level.code} className="level-section">
                <button
                  type="button"
                  className={isCurrentLevel ? "level-toggle active" : "level-toggle"}
                  style={
                    {
                      "--level-progress": `${levelProgressPercent}%`,
                      "--progress-color": progressColorForPercent(levelProgressPercent),
                    } as CSSProperties
                  }
                  onClick={() => toggleLevel(level)}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? <ChevronDown aria-hidden="true" /> : <ChevronRight aria-hidden="true" />}
                  <span>
                    <strong>{level.code}</strong>
                    <small>{level.title}</small>
                  </span>
                  <em>
                    {completedInLevel}/{levelTotal} complete
                  </em>
                </button>

                {isExpanded && (
                  <div className="level-body">
                    {units.length > 0 ? (
                      units.map(renderUnitButton)
                    ) : (
                      <div className="planned-level">
                        <strong>Planned</strong>
                        <small>{level.canDoSummary}</small>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </aside>

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
              newWords={unit.newWords}
              reviewWords={reviewWords}
              knownWords={knownWords}
              functionWords={activeFunctionWords}
              grammarTokens={activeGrammarTokens}
            />
          )}
        </div>

        {settingsOpen && (
          <section className="settings-panel" aria-label="Practice settings">
            <div className="mode-strip" aria-label="Study modes">
              {studyPresets.map((preset) => (
                <button key={preset.id} type="button" onClick={() => applyStudyPreset(preset)}>
                  {preset.label}
                </button>
              ))}
            </div>
            <label>
              <input
                type="checkbox"
                checked={settings.showPromptText}
                onChange={(event) => updateSettings({ showPromptText: event.target.checked })}
              />
              Prompt text
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.revealByDefault}
                onChange={(event) => {
                  updateSettings({ revealByDefault: event.target.checked });
                  setShowBack(event.target.checked);
                }}
              />
              Start revealed
            </label>
            <label>
              <input
                type="checkbox"
                checked={settings.theme === "dark"}
                onChange={(event) => updateSettings({ theme: event.target.checked ? "dark" : "light" })}
              />
              Dark mode
            </label>
            <label>
              Front side
              <select value={settings.cardFront} onChange={(event) => updateSettings({ cardFront: event.target.value as PracticeSettings["cardFront"] })}>
                <option value="japanese">Japanese</option>
                <option value="english">English</option>
              </select>
            </label>
            <label>
              Japanese display
              <select
                value={settings.japaneseDisplay}
                onChange={(event) => updateSettings({ japaneseDisplay: event.target.value as JapaneseDisplayMode })}
              >
                <option value="surface">Kanji/kana</option>
                <option value="kana">Hiragana</option>
                <option value="romaji">Romaji</option>
              </select>
            </label>
            <label>
              Audio
              <select
                value={settings.audioLanguage}
                onChange={(event) => updateSettings({ audioLanguage: event.target.value as PracticeSettings["audioLanguage"] })}
              >
                <option value="japanese">Japanese</option>
                <option value="english">English</option>
                <option value="both">Japanese + English</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={settings.autoPlayAudio} onChange={(event) => updateSettings({ autoPlayAudio: event.target.checked })} />
              Auto audio
            </label>
            <label>
              <input type="checkbox" checked={settings.autoAdvance} onChange={(event) => updateSettings({ autoAdvance: event.target.checked })} />
              Auto advance
            </label>
            <label>
              Order
              <select
                value={settings.autoAdvanceOrder}
                onChange={(event) => updateSettings({ autoAdvanceOrder: event.target.value as PracticeSettings["autoAdvanceOrder"] })}
              >
                <option value="sequential">Sequential</option>
                <option value="random">Random</option>
              </select>
            </label>
            <label>
              <input type="checkbox" checked={settings.autoAdvanceLoop} onChange={(event) => updateSettings({ autoAdvanceLoop: event.target.checked })} />
              Loop
            </label>
            <label>
              Delay seconds
              <input
                type="number"
                min="2"
                max="30"
                value={settings.autoAdvanceDelayMs / 1000}
                onChange={(event) => updateSettings({ autoAdvanceDelayMs: Number(event.target.value) * 1000 })}
              />
            </label>
          </section>
        )}

        <article className="card-stage">
          <div key={`front-${card.id}-${settings.cardFront}-${settings.japaneseDisplay}`} className="stage-slot front-slot" aria-label="Front card area">
            {frontContent}
          </div>

          <div
            key={`back-${card.id}-${settings.cardFront}-${settings.japaneseDisplay}-${showBack ? "shown" : "hidden"}`}
            className={`stage-slot back-slot ${showBack ? "is-revealed" : "is-hidden"}`}
            aria-label="Reveal card area"
          >
            {showBack ? backContent : <span> </span>}
          </div>

        </article>

        <footer className="practice-controls">
          <button title="Previous card" onClick={previousCard} disabled={cardIndex === 0}>
            <ChevronLeft aria-hidden="true" />
            <span>Previous</span>
            <Keycap>Shift Space</Keycap>
          </button>
          <button title={revealLabel} onClick={() => setShowBack((visible) => !visible)}>
            {showBack ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            <span>{revealLabel}</span>
            <Keycap>1</Keycap>
          </button>
          <button title="Play audio" onClick={replayAudio}>
            <Volume2 aria-hidden="true" />
            <span>Play Audio</span>
            <Keycap>2</Keycap>
          </button>
          <button title="Next card" onClick={nextCard} aria-disabled={cardIndex === unit.cards.length - 1 && !settings.autoAdvanceLoop}>
            <ChevronRight aria-hidden="true" />
            <span>Next</span>
            <Keycap>Space</Keycap>
          </button>
          <button title="Random card" onClick={randomCard} disabled={unit.cards.length <= 1}>
            <Shuffle aria-hidden="true" />
            <span>Randomize</span>
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
