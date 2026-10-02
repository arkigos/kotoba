import { markLessonAlreadyKnown } from "./known-lesson";
import { ThemeButton } from "./ThemeButton";
import { buildStarterLesson, nextStarter, startersComplete, starterTrackId } from "./starter-lessons";
import { useEffect, useRef, useState, type SetStateAction } from "react";
import { Check, Info, ChevronRight, Command, GraduationCap, Home, LibraryBig, Bookmark, Play, ArrowRight, Search, BookOpen, Settings2, WifiOff, X, Target, Gamepad2, Menu } from "lucide-react";
import { LibraryView, SettingsView, TodayView } from "./DashboardViews";
import { LessonsView, storedLessonTitle } from "./SessionShelf";
import { CuratedCourseView } from "./CuratedCourseView";
import { curatedTopics, curatedWordId } from "./curated-course";
import { GoalsView, type GoalDraft } from "./GoalsView";
import { GamesView } from "./GamesView";
import { KanjiActivity } from "./KanjiActivity";
import { coreKanji } from "./kanji-data";
import { recordActivity, recordKanjiStudy, validGoal } from "./goals";
import { expandCourseSession, migrateExpandedCourses } from "./expanded-course";
import { canSaveLesson, isSessionComplete, clearLessonShelf, restoreClearedLessons, lessonId, recentLessons, restartLesson, saveLesson, saveLessonSession, trackSessionChange } from "./session-history";
import { setMilestone } from "./topic-course";
import { PracticeSession } from "./PracticeSession";
import { LessonExplorer } from "./LessonExplorer";
import { savedSentencesSession } from "./saved-session";
import { canContinueTopic, nextTopicLesson } from "./next-topic-lesson";
import { isCourseSession, prepareSession, toggleSavedSentence } from "./generated";
import { cleanUnitTitle, getUnit, loadUnit, reviewSourceUnitIds, unitForCard } from "./curriculum";
import { createSession, lessonPresets } from "./engine";
import { exportState, readState, resetState, stateStorageMessage, touchWordHistory, writeState } from "./state";
import { isPrioritized, setWordPriority } from "./review";
import { loadDictionaryEntry } from "../../../packages/dictionary";
import type { ActiveSession, ActivityResult, CurriculumUnit, LearnerSettings, LearnerState, LessonMode, LibraryReviewMode, LibraryReviewRequest, NavigationKey, PracticeCard, ToastMessage } from "./types";
import "./shell-polish.css";
import "./watercolor.css";

const navigation: Array<{ key: NavigationKey; label: string; icon: React.ReactNode }> = [
  { key: "today", label: "Home", icon: <Home size={20} /> },
  { key: "course", label: "Learn", icon: <GraduationCap size={20} /> },
  { key: "dictionary", label: "Dictionary", icon: <LibraryBig size={20} /> },
  { key: "lessons", label: "My lessons", icon: <BookOpen size={20} /> },
  { key: "games", label: "Activities", icon: <Gamepad2 size={20} /> },
  { key: "goals", label: "Progress", icon: <Target size={20} /> },
];

function initialView(): NavigationKey {
  const raw = window.location.hash.replace("#", "");
  const hash = raw === "home" ? "today" : raw === "learn" ? "course" : raw;
  if (hash === "library") return "dictionary";
  if (hash.startsWith("lesson/")) return "lesson";
  return hash === "build" || hash === "settings" || hash === "kanji" || navigation.some((item) => item.key === hash) ? hash as NavigationKey : "today";
}

function lessonFromHash(): number | "session" | undefined {
  const match = window.location.hash.match(/^#lesson\/(\d+|session)$/);
  return match?.[1] === "session" ? "session" : match ? Number(match[1]) : undefined;
}

export function App() {
  const [state, setRawState] = useState<LearnerState>(readState);
  useEffect(() => { setRawState(migrateExpandedCourses); }, []);
  const [, setCalendarDay] = useState(() => new Date().toDateString());
  useEffect(() => {
    const refreshDay = () => setCalendarDay(new Date().toDateString());
    const timer = window.setInterval(refreshDay, 60_000);
    document.addEventListener("visibilitychange", refreshDay);
    return () => { window.clearInterval(timer); document.removeEventListener("visibilitychange", refreshDay); };
  }, []);
  const setState = (updater: SetStateAction<LearnerState>) => setRawState(current => trackSessionChange(current, typeof updater === "function" ? updater(current) : updater));
  const [storageError, setStorageError] = useState(false);
  const nextLessonBusy = useRef(false);
  const [buildingNextLesson, setBuildingNextLesson] = useState(false);
  const [view, setView] = useState<NavigationKey>(initialView);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const lessonMode = state.settings.lessonMode ?? "reading";
  const [lessonTarget, setLessonTarget] = useState<number | "session" | undefined>(lessonFromHash);
  const [lessonUnit, setLessonUnit] = useState<CurriculumUnit>();
  const [lessonReady, setLessonReady] = useState(false);
  const [lessonError, setLessonError] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const toastTimers = useRef(new Set<number>());
  useEffect(() => () => {
    for (const timer of toastTimers.current) window.clearTimeout(timer);
    toastTimers.current.clear();
  }, []);
  const [libraryRevision, setLibraryRevision] = useState(0);
  const [builderWords, setBuilderWords] = useState<string[] | undefined>();
  const [topicFocus, setTopicFocus] = useState<string>();
  const navView = view === "lesson" ? lessonTarget === "session" ? "lessons" : "course" : view === "kanji" ? "games" : view === "build" ? "course" : view;

  const [currentUnit, setCurrentUnit] = useState<CurriculumUnit>(() => getUnit(1));
  const libraryUnitKey = [...new Set([...Object.values(state.wordHistory).flatMap((history) => history.unitIds), ...state.savedSentenceIds.flatMap(id => { const match = id.match(/^u(\d+)-/); return match ? [Number(match[1])] : []; })])].sort((a, b) => a - b).join(",");
  const referenceWordKey = Object.keys(state.wordHistory).filter(id => id.startsWith("jmdict:")).sort().join(",");

  useEffect(() => {
    if (!referenceWordKey) return;
    let cancelled = false;
    void Promise.allSettled(referenceWordKey.split(",").map(id => loadDictionaryEntry(id, import.meta.env.BASE_URL))).then(() => {
      if (!cancelled) setLibraryRevision(value => value + 1);
    });
    return () => { cancelled = true; };
  }, [referenceWordKey]);

  useEffect(() => { setStorageError(!writeState(state)); }, [state]);
  useEffect(() => {
    if (view !== "lesson") return;
    if (lessonTarget === undefined) { setLessonError(true); return; }
    let cancelled = false;
    setLessonReady(false);
    setLessonError(false);
    const load = async () => {
      if (lessonTarget === "session") {
        if (!state.activeSession) throw new Error("No active lesson");
        await prepareSession(state.activeSession, state);
        if (!cancelled) setLessonUnit(undefined);
      } else {
        const unit = await loadUnit(lessonTarget);
        if (!cancelled) setLessonUnit(unit);
      }
      if (!cancelled) setLessonReady(true);
    };
    void load().catch(() => { if (!cancelled) setLessonError(true); });
    return () => { cancelled = true; };
  }, [lessonTarget, view, state.activeSession?.id]);
  useEffect(() => {
    const title = practiceOpen ? state.activeSession?.title : view === "lesson" ? lessonTarget === "session" ? state.activeSession?.title : lessonUnit?.title : view === "kanji" ? "Kanji atlas" : view === "settings" ? "Settings" : view === "build" ? "Learn" : navigation.find(item => item.key === view)?.label;
    document.title = title ? `${cleanUnitTitle(title)} · Kotoba` : "Kotoba · Japanese practice";
  }, [practiceOpen, view, lessonTarget, lessonUnit?.title, state.activeSession?.title]);
  useEffect(() => {
    if (practiceOpen) window.scrollTo({ top: 0, behavior: "instant" });
  }, [practiceOpen]);
  useEffect(() => {
    if (currentUnit.id === state.currentUnitId) return;
    void loadUnit(state.currentUnitId).then(setCurrentUnit).catch(() => {
      setState((current) => ({ ...current, currentUnitId: 1 }));
      setCurrentUnit(getUnit(1));
    });
  }, [currentUnit.id, state.currentUnitId]);
  useEffect(() => {
    const ids = libraryUnitKey.split(",").map(Number).filter(Boolean);
    if (!ids.length) return;
    void Promise.all(ids.map(loadUnit)).then(() => setLibraryRevision((value) => value + 1)).catch(() => undefined);
  }, [libraryUnitKey]);
  useEffect(() => {
    let cancelled = false;
    if (window.location.hash === "#practice" && state.activeSession) {
        const initialSession = expandCourseSession(state.activeSession);
      void prepareSession(initialSession, state).then(() => {
        if (cancelled || window.location.hash !== "#practice") return;
        if (isCourseSession(initialSession) && initialSession.unitId !== undefined) {
          const unit = getUnit(initialSession.unitId);
          if (initialSession.items.length !== unit.cards.length) {
            setState((current) => ({ ...current, activeSession: { ...createSession(unit.id, "deep", current), mode: initialSession.mode ?? current.settings.lessonMode } }));
          }
        }
        setPracticeOpen(true);
      }).catch(() => {
        if (cancelled) return;
        toast({ tone: "warning", message: "Your saved session could not be restored. Your saved data has been kept." });
        window.location.hash = "today";
      });
    }
    return () => { cancelled = true; };
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
    document.documentElement.classList.toggle("quiet-mode", state.settings.quietMode);
  }, [state.settings.quietMode, state.settings.theme]);
  useEffect(() => {
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => { window.removeEventListener("online", onOnline); window.removeEventListener("offline", onOffline); };
  }, []);
  useEffect(() => {
    let cancelled = false;
    const onHash = () => {
      const rawHash = window.location.hash.replace("#", "");
      const hash = rawHash === "library" ? "dictionary" : rawHash === "home" ? "today" : rawHash === "learn" ? "course" : rawHash;
      if (hash.startsWith("lesson/")) {
        setPracticeOpen(false);
        setLessonTarget(lessonFromHash());
        setView("lesson");
        return;
      }
      if (hash === "practice" && state.activeSession) {
        void prepareSession(state.activeSession, state).then(() => {
          if (!cancelled && window.location.hash === "#practice") setPracticeOpen(true);
        }).catch(() => {
          if (cancelled) return;
          setPracticeOpen(false);
          toast({ tone: "warning", message: "Your saved session could not be restored. Your saved data has been kept." });
          window.location.hash = "today";
        });
      }
      else if (hash === "build" || hash === "settings" || hash === "kanji" || navigation.some((item) => item.key === hash)) { setPracticeOpen(false); setView(hash as NavigationKey); }
      else { setPracticeOpen(false); setView("today"); }
    };
    window.addEventListener("hashchange", onHash);
    return () => { cancelled = true; window.removeEventListener("hashchange", onHash); };
  }, [state.activeSession]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toast = (message: Omit<ToastMessage, "id">) => {
    const id = Date.now();
    setToasts((current) => [...current, { ...message, id }]);
    const timer = window.setTimeout(() => {
      toastTimers.current.delete(timer);
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 3300);
    toastTimers.current.add(timer);
  };

  const navigate = (next: NavigationKey) => {
    if (next === "library") next = "dictionary";
    setMoreOpen(false);
    if (next === "course") setTopicFocus(undefined);
    setView(next);
    setPracticeOpen(false);
    window.location.hash = next;
    if (!navigator.userAgent.includes("jsdom")) window.scrollTo({ top: 0, behavior: state.settings.quietMode ? "auto" : "smooth" });
  };

  const start = async (unitId = state.currentUnitId, requestedMode?: Exclude<LessonMode, "mixed">, index?: number) => {
    const mode = requestedMode ?? lessonMode;
    try {
      await loadUnit(unitId);
      setState((current) => {
        const next = { ...current, settings: { ...current.settings, ...(requestedMode ? lessonPresets[mode].settings : {}), lessonMode: mode } };
        const existing = current.activeSession && expandCourseSession(current.activeSession);
        const session = existing && isCourseSession(existing) && existing.unitId === unitId && existing.items.length === getUnit(unitId).cards.length && existing.cursor < existing.items.length ? existing : createSession(unitId, "deep", next);
        return { ...next, currentUnitId: unitId, activeSession: { ...session, cursor: index === undefined ? session.cursor : Math.max(0, Math.min(index, session.items.length - 1)), mode } };
      });
      setPracticeOpen(true);
      window.location.hash = "practice";
    } catch {
      toast({ tone: "warning", message: "Could not load this lesson. Try again." });
    }
  };

  const resume = async () => {
    if (!state.activeSession) return void start();
    try {
      await prepareSession(state.activeSession, state);
      if (isCourseSession(state.activeSession) && state.activeSession.unitId !== undefined) {
        const unit = getUnit(state.activeSession.unitId);
        if (state.activeSession.items.length !== unit.cards.length) {
          setState((current) => ({ ...current, activeSession: { ...createSession(unit.id, "deep", current), mode: state.activeSession?.mode ?? lessonMode } }));
        }
      }
      setPracticeOpen(true);
      window.location.hash = "practice";
    } catch {
      toast({ tone: "warning", message: "Your saved session could not be restored" });
    }
  };

  const openBuilder = (words?: string[]) => {
    setBuilderWords(words);
    navigate("build");
  };
  const launchMaterialized = (session: ActiveSession) => {
    if (!session.starterLessonId && !startersComplete(state)) { navigate("course"); toast({ tone: "default", message: "Complete the starter lessons or mark them as already known first." }); return; }
    const preset = session.source === "vocabulary" && session.mode && session.mode !== "mixed" ? lessonPresets[session.mode].settings : {};
    setState(current => {
      const keep = session.source === "topic" || !!session.lessonPlan;
      const saved = keep ? saveLessonSession(current, session) : current;
      const preserved = keep ? recentLessons(saved).find(lesson => lesson.id === lessonId(session))?.session : undefined;
      return { ...saved, settings: { ...current.settings, ...preset }, activeSession: preserved ?? session };
    });
    setPracticeOpen(true); window.location.hash = "practice";
  };
  const markKnownSession = (session: ActiveSession) => {
    setRawState(current => markLessonAlreadyKnown(current, session));
    toast({ tone: "success", message: "Lesson marked complete. Its words are available; no practice was recorded." });
  };
  const startLibraryReview = async (request: LibraryReviewRequest) => {
    const ids = new Set(request.wordIds.map(curatedWordId));
    const topic = curatedTopics.find(row => row.wordIds.some(id => ids.has(id)));
    navigate("course");
    setTopicFocus(topic?.id);
    toast({ tone: "default", message: topic ? "Open this topic’s review to practice its learned sentences." : "Choose a topic to review its learned sentences." });
  };

  const openUnit = (id: number) => {
    setLessonTarget(id);
    setView("lesson");
    setPracticeOpen(false);
    window.location.hash = `lesson/${id}`;
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const browseSession = () => {
    const session = state.activeSession;
    if (session && isCourseSession(session) && session.unitId !== undefined) { openUnit(session.unitId); return; }
    setLessonTarget("session"); setPracticeOpen(false); setView("lesson");
    window.location.hash = "lesson/session";
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const startAt = (index: number, mode: Exclude<LessonMode, "mixed">) => {
    if (lessonTarget !== "session" && lessonUnit) { void start(lessonUnit.id, mode, index); return; }
    setState(current => ({ ...current, settings: { ...current.settings, ...lessonPresets[mode].settings }, activeSession: current.activeSession ? { ...current.activeSession, cursor: index, mode } : undefined }));
    setPracticeOpen(true); window.location.hash = "practice";
  };
  const reviewSavedSentences = (cards: PracticeCard[], mode: LibraryReviewMode = "mixed") => {
    if (!cards.length) return;
    setState(current => ({ ...current, activeSession: savedSentencesSession(cards, current, mode), settings: { ...current.settings, ...(mode === "mixed" ? { autoplay: true, audioLanguage: "japanese" as const, autoAdvance: false } : lessonPresets[mode].settings) } }));
    setPracticeOpen(true); window.location.hash = "practice";
  };
  const openSavedSentence = (card: PracticeCard) => reviewSavedSentences([card], "mixed");

  const exitPractice = () => {
    const session = state.activeSession;
    const topic = curatedTopics.find(topic => topic.id === session?.topicId);
    // The underlying view survives normal practice. A refreshed practice link
    // has no origin view, so return to its topic or the saved-lesson shelf.
    const destination = view === "today" || view === "build"
      ? topic || session?.starterLessonId ? "course" : "lessons"
      : view;
    setPracticeOpen(false);
    setView(destination);
    if (destination === "course") setTopicFocus(session?.starterLessonId ? starterTrackId : topic?.id);
    window.location.hash = destination === "lesson" ? `lesson/${lessonTarget ?? "session"}` : destination;
    toast({ tone: "default", message: "Lesson paused. Progress saved." });
  };

  const donePractice = () => {
    setState((current) => ({ ...current, activeSession: undefined }));
    setPracticeOpen(false);
    setView("today");
    window.location.hash = "today";
    toast({ tone: "success", message: "Progress saved." });
  };

  const openStoredLesson = async (id: string, browse = false) => {
    const stored = recentLessons(state).find(lesson => lesson.id === id);
    if (!stored) return;
    try {
      await prepareSession(stored.session, state);
      const session = !browse && stored.session.cursor >= stored.session.items.length ? restartLesson(stored.session) : stored.session;
      setState(current => ({ ...current, activeSession: session, ...(isCourseSession(session) && session.unitId !== undefined ? { currentUnitId: session.unitId } : {}) }));
      if (browse) {
        setLessonTarget("session"); setPracticeOpen(false); setView("lesson"); window.location.hash = "lesson/session";
      } else { setPracticeOpen(true); window.location.hash = "practice"; }
    } catch (cause) { toast({ tone: "warning", message: cause instanceof Error ? cause.message : "This lesson could not be opened. Its saved data has been kept." }); }
  };
  const keepLesson = (id: string, saved: boolean) => {
    const lesson = recentLessons(state).find(item => item.id === id);
    if (!lesson || !canSaveLesson(lesson.session)) return;
    setState(current => saveLesson(current, id, saved));
    toast({ tone: "success", message: saved ? "Lesson saved. Find it in My lessons." : "Lesson remains in Recent." });
  };
  const renameLesson = (id: string, title: string) => setState(current => ({ ...current,
    lessonHistory: recentLessons(current).map(lesson => lesson.id === id ? { ...lesson, session: { ...lesson.session, title } } : lesson),
    activeSession: current.activeSession && lessonId(current.activeSession) === id ? { ...current.activeSession, title } : current.activeSession,
  }));
  const removeLesson = (id: string) => {
    setRawState(current => ({ ...current, lessonHistory: recentLessons(current).filter(lesson => lesson.id !== id), activeSession: current.activeSession && lessonId(current.activeSession) === id ? undefined : current.activeSession }));
    toast({ tone: "default", message: "Removed from My lessons. Practice history kept." });
  };
  const continueStarter = () => {
    const next = nextStarter(state);
    if (!next) { setPracticeOpen(false); setTopicFocus(undefined); navigate("course"); return; }
    const resume = recentLessons(state).find(row => row.session.starterLessonId === next.id && row.session.starterVersion === next.version && !isSessionComplete(row.session));
    launchMaterialized(resume?.session ?? buildStarterLesson(state, next.id));
  };
  const continueTopic = async (id: string) => {
    if (!startersComplete(state)) { navigate("course"); return; }
    if (nextLessonBusy.current) return;
    const previous = recentLessons(state).find(lesson => lesson.id === id)?.session;
    if (!previous) return;
    nextLessonBusy.current = true; setBuildingNextLesson(true);
    try {
      const session = await nextTopicLesson(state, previous);
      setState(current => ({ ...saveLessonSession(current, session), activeSession: session }));
      setLessonTarget("session"); setPracticeOpen(false); setView("lesson"); window.location.hash = "lesson/session";
      toast({ tone: "success", message: `${session.title} is ready.` });
    } catch (cause) { toast({ tone: "warning", message: cause instanceof Error ? cause.message : "The next lesson could not be built. Try again." }); }
    finally { nextLessonBusy.current = false; setBuildingNextLesson(false); }
  };
  const lessonActions = { onMarkKnown: (id: string) => { const lesson = recentLessons(state).find(row => row.id === id); if (lesson) markKnownSession(lesson.session); }, onOpenLesson: openStoredLesson, onSaveLesson: keepLesson, onRenameLesson: renameLesson, onRemoveLesson: removeLesson, 
    onNextLesson: (id: string) => void continueTopic(id), buildingNextLesson,
    nextLessonIds: new Set(recentLessons(state).filter(row => !!row.session.curatedLessonId && canContinueTopic(state, row.session)).map(row => row.id)),
    onClearLessons: () => { setRawState(clearLessonShelf); toast({ tone: "success", message: "Lesson shelf cleared. Practice history kept. You can restore the cleared lessons." }); },
    onRestoreLessons: () => { setRawState(restoreClearedLessons); toast({ tone: "success", message: "Cleared lessons restored." }); } };

  const toggleWord = (id: string) => setState((current) => {
    const saved = current.savedWordIds.includes(id);
    const unitId = current.wordHistory[id] ? current.wordHistory[id].unitIds[0] : current.currentUnitId;
    return {
      ...current,
      savedWordIds: saved ? current.savedWordIds.filter((wordId) => wordId !== id) : [...current.savedWordIds, id],
      wordHistory: touchWordHistory(current, { wordIds: [id], unitId, kind: "saved" }),
    };
  });
  const prioritizeWord = (id: string) => setState(current => setWordPriority(current, id, !isPrioritized(current.wordHistory[id])));
  const addDictionaryWord = (id: string) => setState(current => ({
    ...current,
    savedWordIds: current.savedWordIds.includes(id) ? current.savedWordIds : [...current.savedWordIds, id],
    wordHistory: touchWordHistory(current, {wordIds: [id], kind: "saved"}),
  }));
  const toggleSentence = (id: string) => setState((current) => {
    const savedGeneratedCards = { ...current.savedGeneratedCards };
    const savedMaterializedCards = { ...current.savedMaterializedCards };
    const saved = current.savedSentenceIds.includes(id);
    if (saved) delete savedGeneratedCards[id];
    if (saved) delete savedMaterializedCards[id];
    return { ...current, savedMaterializedCards, savedSentenceIds: saved ? current.savedSentenceIds.filter(cardId => cardId !== id) : [...current.savedSentenceIds, id], ...(current.savedGeneratedCards ? { savedGeneratedCards } : {}) };
  });
  const updateSettings = (patch: Partial<LearnerSettings>) => setState((current) => ({ ...current, settings: { ...current.settings, ...patch } }));
  const saveGoal = (draft: GoalDraft) => {
    if (!validGoal(draft.metric, draft.period, draft.target)) return;
    setState(current => {
      const goals = current.learningGoals ?? [];
      const existing = goals.find(goal => goal.id === draft.id) ?? goals.find(goal => goal.metric === draft.metric && goal.period === draft.period);
      const goal = { ...draft, id: existing?.id ?? crypto.randomUUID(), createdAt: existing?.createdAt ?? new Date().toISOString() };
      return { ...current, learningGoals: [...goals.filter(item => item.id !== goal.id && !(item.metric === goal.metric && item.period === goal.period)), goal] };
    });
    toast({ tone: "success", message: "Goal saved." });
  };
  const finishActivity = (result: ActivityResult) => setState(current => recordActivity(current, result));
  const chooseLessonMode = (mode: Exclude<LessonMode, "mixed">) => {
    setState((current) => ({
      ...current,
      settings: { ...current.settings, ...lessonPresets[mode].settings },
      activeSession: current.activeSession && isCourseSession(current.activeSession) && current.activeSession.unitId === current.currentUnitId
        ? { ...current.activeSession, mode }
        : current.activeSession,
    }));
  };

  if (practiceOpen && state.activeSession) {
    return <>{storageError && <div className="storage-error" role="alert">{stateStorageMessage()} <button type="button" onClick={() => exportState(state)}>Export a backup</button></div>}<PracticeSession state={state} onState={(updater) => setState(updater)} onExit={exitPractice} onDone={donePractice} onBrowse={browseSession} onToast={toast} onNextTopic={state.activeSession?.starterLessonId && isSessionComplete(state.activeSession) ? continueStarter : state.activeSession?.curatedLessonId && canContinueTopic(state, state.activeSession) ? () => void continueTopic(lessonId(state.activeSession!)) : undefined} nextTopicLabel={state.activeSession?.starterLessonId && startersComplete(state) ? "Choose a track" : "Next lesson"} nextTopicPending={buildingNextLesson} /><ToastStack toasts={toasts} /></>;
  }

  return (
    <div className="app" data-theme={state.settings.theme}>
      <a className="skip-link" href="#main-content" onClick={event => { event.preventDefault(); document.getElementById("main-content")?.focus(); }}>Skip to content</a>
      <aside className="desktop-sidebar">
        <Brand />
        <nav aria-label="Primary navigation">
          {navigation.map((item) => <button key={item.key} type="button" aria-current={navView === item.key ? "page" : undefined} className={navView === item.key ? "active" : ""} onClick={() => navigate(item.key)}>{item.icon}<span>{item.label}</span>{navView === item.key && <i />}</button>)}
        </nav>
        <div className="sidebar-spacer" />
        <button className="profile-mini" type="button" onClick={() => navigate("settings")}><Settings2 size={20} /><span><strong>Settings</strong></span><ChevronRight size={16} /></button>
      </aside>

      <div className="app-column">
        <header className="global-topbar">
          <div className="mobile-brand"><Brand /></div>
          <button className="command-search" type="button" aria-label="Search Kotoba" onClick={() => setPaletteOpen(true)}><Search size={17} /><span>Search</span><kbd><Command size={12} /> K</kbd></button>
          <div className="topbar-actions">
            {!online && <span className="network-state offline" title="No internet connection"><WifiOff size={15} /><small>Offline</small></span>}
            <ThemeButton theme={state.settings.theme} onChange={theme => updateSettings({ theme })} />
            <button type="button" className="theme-button" aria-label="Settings" onClick={() => navigate("settings")}><Settings2 size={19} /></button>
          </div>
        </header>

        <main className="app-content" id="main-content" tabIndex={-1}>
          {storageError && <div className="storage-error" role="alert">{stateStorageMessage()} <button type="button" onClick={() => exportState(state)}>Export a backup</button></div>}
          {state.attempts.some((attempt) => attempt.id.startsWith("demo-attempt-")) && <p className="sample-history-note">This browser includes sample history from the earlier preview. Saved lessons and settings have been kept.</p>}
          {view === "today" && <TodayView state={state} unit={currentUnit} mode={lessonMode} onMode={chooseLessonMode} onStart={start} onResume={resume} onNavigate={navigate} onBuild={() => openBuilder()} onBrowse={() => openUnit(currentUnit.id)} onReview={request => void startLibraryReview(request)} {...lessonActions} />}
          {view === "lesson" && (!lessonReady || lessonError) && <section className="view route-status"><h1>{lessonError ? "Lesson unavailable" : "Opening lesson…"}</h1><p>{lessonError ? "This lesson could not be opened. Your saved progress is still here." : "Loading the complete sentence list."}</p>{lessonError && <button type="button" onClick={() => navigate("course")}>Browse lessons</button>}</section>}
          {view === "lesson" && lessonReady && !lessonError && <LessonExplorer onOpenKanji={() => navigate("kanji")} key={String(lessonTarget)} unit={lessonTarget === "session" ? undefined : lessonUnit} session={lessonTarget === "session" ? state.activeSession : undefined} state={state} onBack={() => navigate(lessonTarget === "session" ? "lessons" : "course")} onStart={startAt} onSave={card => { if (lessonTarget === "session" && state.activeSession) setState(current => toggleSavedSentence(current, card, current.activeSession!)); else toggleSentence(card.id); }} onToast={toast} />}
          {(view === "course" || view === "build") && <CuratedCourseView state={state} onMarkKnown={markKnownSession} onSession={launchMaterialized} initialTopic={topicFocus} onTopicClose={() => setTopicFocus(undefined)} focusWordIds={view === "build" ? builderWords : undefined} lessonShelf={<LearnLessonShortcut state={state} onOpen={id => void openStoredLesson(id)} onAll={() => navigate("lessons")} />} />}

          {view === "dictionary" && <LibraryView state={state} revision={libraryRevision} onToggleWord={toggleWord} onToggleSentence={toggleSentence} onStart={openUnit} onOpenSentence={openSavedSentence} onReviewSentences={reviewSavedSentences} onToast={toast} onReview={(request) => void startLibraryReview(request)} onPrioritizeWord={prioritizeWord} onBuild={openBuilder} onAddDictionaryWord={addDictionaryWord} onPracticeWords={ids => openBuilder(ids)} />}
          {view === "lessons" && <LessonsView state={state} onBuild={() => navigate("course")} {...lessonActions} />}
          {view === "goals" && <GoalsView state={state} onMilestone={(id, checked) => setState(current => setMilestone(current, id, checked))} onSave={saveGoal} onRemove={id => setState(current => ({ ...current, learningGoals: current.learningGoals?.filter(goal => goal.id !== id) }))} onNavigate={navigate} />}
          {view === "games" && <GamesView state={state} onToast={(message, tone = "default") => toast({message, tone})} onOpenKanji={() => navigate("kanji")} onComplete={finishActivity} />}
          {view === "kanji" && <KanjiActivity visitedIds={Object.keys(state.kanjiProgress ?? {})} onStudy={id => { if (coreKanji.some(entry => entry.id === id)) setState(current => recordKanjiStudy(current, id)); }} onBack={() => navigate("games")} onToast={toast} onQuizComplete={finishActivity} />}
          {view === "settings" && <SettingsView state={state} onSettings={updateSettings} onExport={() => { exportState(state); toast({ tone: "success", message: "Kotoba data exported" }); }} onReset={() => {
            try {
              resetState();
              window.location.hash = "today";
              window.location.reload();
            } catch (error) { toast({ tone: "warning", message: error instanceof Error ? error.message : "Unable to reset browser data." }); }
          }} />}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Primary navigation">
        {navigation.filter(item => ["today", "course", "dictionary", "games"].includes(item.key)).map((item) => <button key={item.key} type="button" aria-current={navView === item.key ? "page" : undefined} className={navView === item.key ? "active" : ""} onClick={() => navigate(item.key)}>{item.icon}<span>{item.label}</span></button>)}
        <button type="button" className={["lessons", "goals", "settings"].includes(navView) ? "active" : ""} aria-expanded={moreOpen} aria-controls="mobile-more" onClick={() => setMoreOpen(open => !open)}>{moreOpen ? <X size={20} /> : <Menu size={20} />}<span>More</span></button>
      </nav>
      {moreOpen && <div className="mobile-more-wrap"><button type="button" className="mobile-more-dismiss" aria-label="Close navigation" onClick={() => setMoreOpen(false)} /><nav id="mobile-more" className="mobile-more" aria-label="More navigation">{navigation.filter(item => ["lessons", "goals"].includes(item.key)).map(item => <button key={item.key} type="button" onClick={() => navigate(item.key)}>{item.icon}<span>{item.label}</span><ChevronRight size={16} /></button>)}<button type="button" onClick={() => navigate("settings")}><Settings2 size={20} /><span>Settings</span><ChevronRight size={16} /></button></nav></div>}

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} onNavigate={(next) => { setPaletteOpen(false); navigate(next); }} state={state} onTopic={id => { setPaletteOpen(false); navigate("course"); setTopicFocus(id); }} onLesson={id => { setPaletteOpen(false); void openStoredLesson(id); }} />}
      <ToastStack toasts={toasts} />
    </div>
  );
}

function Brand() {
  return <div className="brand-lockup" aria-label="Kotoba"><span className="brand-symbol"><i /><b>こ</b></span><span className="brand-word"><strong>KOTOBA</strong></span></div>;
}

function LearnLessonShortcut({state, onOpen, onAll}: {state: LearnerState; onOpen: (id: string) => void; onAll: () => void}) {
  const lesson = recentLessons(state).find(item => item.session.cursor < item.session.items.length);
  return <section className="learn-lessons" aria-label="Saved and recent lessons">{lesson && <div className="learn-resume"><Bookmark size={20} /><div className="learn-resume-copy"><strong>{storedLessonTitle(lesson)}</strong><small>{lesson.session.cursor + 1} / {lesson.session.items.length} cards</small></div><button type="button" aria-label={`Resume ${storedLessonTitle(lesson)}`} onClick={() => onOpen(lesson.id)}><Play size={16} /></button></div>}<div className="learn-saved-link"><button type="button" onClick={onAll}>My lessons <ArrowRight size={14} /></button></div></section>;
}

function CommandPalette({ onClose, onNavigate, state, onTopic, onLesson }: { onClose: () => void; onNavigate: (view: NavigationKey) => void; state: LearnerState; onTopic: (id: string) => void; onLesson: (id: string) => void }) {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const term = query.trim().normalize("NFKC").toLowerCase();
  const topics = term ? curatedTopics.filter(topic => `${topic.title} ${topic.description}`.toLowerCase().includes(term)).slice(0, 6) : [];
  const lessons = term ? recentLessons(state).filter(lesson => storedLessonTitle(lesson).toLowerCase().includes(term)).slice(0, 4) : [];
  return <div className="command-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><section className="command-palette" role="dialog" aria-modal="true" aria-label="Search Kotoba"><label><Search size={20} /><input autoFocus aria-label="Search topics and lessons" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search topics and lessons" /><button type="button" className="command-close" onClick={onClose} aria-label="Close search"><X size={18} /></button></label><div className="command-section">{!term && navigation.map(item => <button key={item.key} type="button" onClick={() => onNavigate(item.key)}>{item.icon}<span><strong>{item.label}</strong></span><ChevronRight size={16} /></button>)}{topics.map(topic => <button type="button" key={topic.id} onClick={() => onTopic(topic.id)}><GraduationCap size={20} /><span><strong>{topic.title}</strong></span><ChevronRight size={16} /></button>)}{lessons.map(lesson => <button type="button" key={lesson.id} onClick={() => onLesson(lesson.id)}><BookOpen size={20} /><span><strong>{storedLessonTitle(lesson)}</strong></span><ChevronRight size={16} /></button>)}{term && !topics.length && !lessons.length && <p className="search-empty">No matches</p>}</div></section></div>;
}

function ToastStack({ toasts }: { toasts: ToastMessage[] }) {
  return <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <div key={toast.id} className={`toast ${toast.tone}`}><span>{toast.tone === "success" ? <Check size={16} /> : <Info size={16} />}</span>{toast.message}</div>)}</div>;
}
