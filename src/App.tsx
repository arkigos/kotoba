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
  Sparkles,
  Volume2,
} from "lucide-react";
import { courseLevels, getUnit, initialUnit, unitIndex } from "./data";
import { toRomaji } from "./japanese";
import { defaultProgress, readProgress, writeProgress } from "./progress";
import type { CourseLevel, JapaneseDisplayMode, PracticeCard, PracticeSettings, Progress, UnitIndexEntry } from "./types";

const studyPresets: Array<{ id: string; label: string; settings: Partial<PracticeSettings> }> = [
  {
    id: "reading",
    label: "Reading",
    settings: {
      showPromptText: true,
      cardFront: "japanese",
      revealByDefault: false,
      showFact: true,
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
      showFact: false,
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
      showFact: false,
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
      showFact: false,
      autoPlayAudio: true,
      audioLanguage: "japanese",
      autoAdvance: true,
      autoAdvanceOrder: "sequential",
      autoAdvanceDelayMs: 5000,
    },
  },
];

function clampCardIndex(index: number, cards: PracticeCard[]) {
  if (cards.length === 0) return 0;
  return Math.min(Math.max(index, 0), cards.length - 1);
}

function isFormTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return ["BUTTON", "INPUT", "SELECT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable;
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

function JapaneseLine({
  card,
  mode,
  muted = false,
  onSpeakPart,
}: {
  card: PracticeCard;
  mode: JapaneseDisplayMode;
  muted?: boolean;
  onSpeakPart: (text: string) => void;
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
          onClick={() => onSpeakPart(card.tts[index] ?? part.reading ?? part.surface)}
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
  const [expandedLevels, setExpandedLevels] = useState<Record<string, boolean>>(() => ({ A1: true }));
  const [showBack, setShowBack] = useState(() => progress.settings.revealByDefault);
  const [settingsOpen, setSettingsOpen] = useState(false);
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

    return Math.min(99, Math.max(1, Math.round(((savedPosition + 1) / unit.cards.length) * 100)));
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

  const playJapaneseAudio = useCallback(() => {
    if (card.audioRef) {
      const audio = new Audio(card.audioRef);
      audio.play().catch(() => setMessage("Audio could not play"));
      return;
    }

    speakText(card.line.join(""), "ja-JP", "Japanese audio");
  }, [card, speakText]);

  const playEnglishAudio = useCallback(() => {
    speakText(card.english, "en-US", "English audio");
  }, [card.english, speakText]);

  const playJapanesePart = useCallback(
    (text: string) => {
      speakText(text, "ja-JP", "Japanese audio");
    },
    [speakText]
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
              <input type="checkbox" checked={settings.showFact} onChange={(event) => updateSettings({ showFact: event.target.checked })} />
              Notes
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

          <div key={`note-${card.id}`} className={`stage-slot note-slot ${settings.showFact ? "" : "is-hidden"}`} aria-label="Card note area">
            {settings.showFact ? <p className="fact-note">{card.fact}</p> : <span> </span>}
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
          <button title="Next card" onClick={nextCard} disabled={cardIndex === unit.cards.length - 1 && !settings.autoAdvanceLoop}>
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
