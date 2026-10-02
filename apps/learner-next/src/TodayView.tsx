import { ArrowRight, BookOpen, Bookmark, Check, Flame, Gamepad2, Play, RotateCcw, Sprout } from "lucide-react";
import { daysBack, localDay } from "./state";
import { suggestReviewWords } from "./review";
import { lessonId, recentLessons } from "./session-history";
import { storedLessonTitle, type LessonActions } from "./SessionShelf";
import { streakSummary } from "./goals";
import { curatedLevelProgress } from "./curated-course";
import type { CurriculumUnit, LearnerState, LessonMode, LibraryReviewRequest, NavigationKey } from "./types";
import "./home.css";
import { nextStarter } from "./starter-lessons";

type TodayProps = LessonActions & {
  state: LearnerState; unit: CurriculumUnit; mode: Exclude<LessonMode, "mixed">;
  onMode: (mode: Exclude<LessonMode, "mixed">) => void;
  onStart: (unitId?: number) => void; onResume: () => void;
  onNavigate: (view: NavigationKey) => void; onBuild: () => void; onBrowse: () => void;
  onReview: (request: LibraryReviewRequest) => void;
};

export function TodayView({ state, onResume, onNavigate, onReview, onOpenLesson }: TodayProps) {
  const pendingStarter = nextStarter(state);
  const history = recentLessons(state);
  const active = state.activeSession;
  const activeUnfinished = active && active.items.length > 0 && active.cursor < active.items.length;
  const nextLesson = activeUnfinished
    ? { ...history.find(lesson => lesson.id === lessonId(active)), id: lessonId(active), session: active, lastOpenedAt: active.startedAt }
    : history.find(lesson => lesson.savedAt && lesson.session.items.length > 0 && lesson.session.cursor < lesson.session.items.length);
  const starter = nextLesson ? undefined : pendingStarter;
  const progress = curatedLevelProgress(state,"A1");
  const streak = streakSummary(state.practiceDays);
  const days = daysBack(7);
  const practiced = new Set(state.practiceDays);
  const reviewIds: string[] = []; // Review is selected inside its owning topic.
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return <div className="view home-view">
    <header className="home-heading">
      <div><p>{greeting}</p><h1>Home</h1></div>
      <div className={`home-streak${streak.practicedToday ? " is-active" : ""}`} aria-label={`${streak.current} day streak`}><Flame size={19} /><strong>{streak.current}</strong><span>day streak</span></div>
    </header>
    <section className="home-next" aria-label="Your next step">
      <div className="home-next-copy"><h2>{starter ? starter.title : nextLesson ? storedLessonTitle(nextLesson) : "Your next lesson"}</h2>{!starter && nextLesson && <p>Card {nextLesson.session.cursor + 1} of {nextLesson.session.items.length}</p>}</div>
      <div className="home-card-art" aria-hidden="true"><span className="home-art-back">あ</span><span className="home-art-front"><i>言葉</i><small>ことば</small></span><span className="home-art-leaf"><Sprout size={23} /></span></div>
      <button className="home-primary" type="button" onClick={() => starter ? onNavigate("course") : nextLesson ? activeUnfinished ? onResume() : onOpenLesson(nextLesson.id) : onNavigate("course")}>
        {nextLesson ? <Play size={17} fill="currentColor" /> : <BookOpen size={18} />}<span>{starter ? "Start foundations" : nextLesson ? "Resume lesson" : "Continue course"}</span><ArrowRight size={18} />
      </button>
    </section>
    <section className="home-progress" aria-label="Your progress">
      <div className="home-a1"><div><span><Sprout size={17} />A1 words</span><small><strong>{progress.learned}</strong> / {progress.total} completed</small></div><div className="home-a1-track" role="progressbar" aria-label="A1 course words completed" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.learned}><span style={{ width: `${progress.percent}%` }} /></div></div>
      <div className="home-week" role="group" aria-label="Last 7 days">
        {days.map(day => { const didPractice = practiced.has(day); const date = new Date(`${day}T12:00:00Z`); const label = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", weekday: "long", timeZone: "UTC" }).format(date); return <span key={day} className={`${didPractice ? "is-practiced" : ""}${day === localDay() ? " is-today" : ""}`} aria-label={`${label}: ${didPractice ? "Practiced" : "No practice"}`} title={`${label}: ${didPractice ? "Practiced" : "No practice"}`}><small>{new Intl.DateTimeFormat("en", { weekday: "narrow", timeZone: "UTC" }).format(date)}</small><i>{didPractice && <Check size={13} strokeWidth={2.7} />}</i></span>; })}
      </div>
    </section>
    <nav className={`home-shortcuts${reviewIds.length ? " has-review" : ""}`} aria-label="More ways to practice">
      {!!reviewIds.length && <button type="button" className="home-shortcut home-review" onClick={() => onReview({ wordIds: reviewIds, mode: "mixed", count: 10, label: "Quick review" })}><span className="home-shortcut-icon"><RotateCcw size={23} /></span><strong>Review</strong><small>{reviewIds.length} {reviewIds.length === 1 ? "word" : "words"}</small></button>}
      <button type="button" className="home-shortcut home-activities" onClick={() => onNavigate("games")}><span className="home-shortcut-icon"><Gamepad2 size={24} /></span><strong>Activities</strong></button>
      <button type="button" className="home-shortcut home-lessons" onClick={() => onNavigate("lessons")}><span className="home-shortcut-icon"><Bookmark size={22} /></span><strong>My lessons</strong></button>
    </nav>
  </div>;
}
