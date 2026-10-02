import { useState } from "react";
import { ArrowRight, Bookmark, BookOpen, Check, Compass, List, MoreHorizontal, Pencil, Play, Search, Trash2 } from "lucide-react";
import { availableUnits, cleanUnitTitle } from "./curriculum";
import { canSaveLesson, recentLessons } from "./session-history";
import type { LearnerState, StoredLesson } from "./types";
import "./continuity.css";
import "./session-shelf.css";

export type LessonActions = {
  onMarkKnown?: (id: string) => void;
  onOpenLesson: (id: string, browse?: boolean) => void;
  onSaveLesson: (id: string, saved: boolean) => void;
  onRenameLesson: (id: string, title: string) => void;
  onRemoveLesson: (id: string) => void;
  onRemakeLesson?: (id: string) => void;
  onNextLesson?: (id: string) => void;
  buildingNextLesson?: boolean;
  nextLessonIds?: ReadonlySet<string>;
  onClearLessons?: () => void;
  onRestoreLessons?: () => void;
};
export function storedLessonTitle(lesson: StoredLesson) {
  return cleanUnitTitle(lesson.session.title ?? availableUnits.find(unit => unit.id === lesson.session.unitId)?.title ?? "Lesson");
}

export function LessonRows({ lessons, onOpenLesson, onSaveLesson, onRenameLesson, onRemoveLesson, onRemakeLesson, onMarkKnown, onNextLesson, buildingNextLesson, nextLessonIds, compact = false }: LessonActions & { lessons: StoredLesson[]; compact?: boolean }) {
  const [editing, setEditing] = useState<string>();
  const [name, setName] = useState("");
  const [menu, setMenu] = useState<string>();
  return <div className={`session-list ${compact ? "compact" : ""}`}>{lessons.map(lesson => {
    const session = lesson.session;
    const finished = session.cursor >= session.items.length;
    const title = storedLessonTitle(lesson);
    const practiced = Math.min(session.items.length, session.practicedIndices?.length ?? session.scores.length);
    return <article key={lesson.id} className="session-row">
      <span className={`session-type ${session.source ?? "course"}`}>{finished ? <Check size={20} /> : <Play size={20} />}</span>
      <div className="session-row-main">
        {editing === lesson.id ? <form className="session-rename" onSubmit={event => { event.preventDefault(); if (name.trim()) onRenameLesson(lesson.id, name.trim()); setEditing(undefined); }}><input autoFocus aria-label="Lesson name" maxLength={80} value={name} onChange={event => setName(event.target.value)} /><button type="submit">Save</button><button type="button" onClick={() => setEditing(undefined)}>Cancel</button></form> : <button type="button" className="session-title-button" onClick={() => onOpenLesson(lesson.id)}><strong>{title}</strong></button>}
        <small>{session.completedByDeclarationAt ? "Marked known · " : ""}{practiced}/{session.items.length} cards practiced · {new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(lesson.lastOpenedAt))}</small>
        <span className="session-coverage" role="progressbar" aria-label={`${title} cards practiced`} aria-valuemin={0} aria-valuemax={session.items.length} aria-valuenow={practiced}><i style={{ width: `${session.items.length ? practiced / session.items.length * 100 : 0}%` }} /></span>
      </div>
      <div className="session-row-actions">
        <button type="button" className="session-open" aria-label={`${finished ? "Replay" : "Resume"} ${title}`} onClick={() => onOpenLesson(lesson.id)}>{finished ? "Replay" : "Resume"}<ArrowRight size={14} /></button>
        {nextLessonIds?.has(lesson.id) && onNextLesson && <button type="button" className="session-open" aria-label={`Next lesson after ${title}`} disabled={buildingNextLesson} onClick={() => onNextLesson(lesson.id)}>Next lesson<ArrowRight size={14} /></button>}
        {canSaveLesson(session) && <button type="button" className={`session-icon ${lesson.savedAt ? "saved" : ""}`} title={lesson.savedAt ? "Remove from saved lessons" : "Save lesson"} aria-label={`${lesson.savedAt ? "Unsave" : "Save"} lesson: ${title}`} aria-pressed={!!lesson.savedAt} onClick={() => onSaveLesson(lesson.id, !lesson.savedAt)}><Bookmark size={17} fill={lesson.savedAt ? "currentColor" : "none"} /></button>}
        <div className="session-more" onKeyDown={event => { if (event.key === "Escape") setMenu(undefined); }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setMenu(undefined); }}><button type="button" className="session-icon" aria-label={`More options for ${title}`} aria-expanded={menu === lesson.id} onClick={() => setMenu(current => current === lesson.id ? undefined : lesson.id)}><MoreHorizontal size={18} /></button>{menu === lesson.id && <div className="session-more-actions"><button type="button" aria-label={`Browse ${title}`} onClick={() => { setMenu(undefined); onOpenLesson(lesson.id, true); }}><List size={16} />Browse cards</button>{onMarkKnown && !session.completedByDeclarationAt && !!(session.savedCards?.length || session.snapshot?.cards.length) && <button type="button" aria-label={`Mark ${title} as already known`} onClick={() => { setMenu(undefined); onMarkKnown(lesson.id); }}>Mark complete · words already known</button>}{onRemakeLesson && ["topic", "vocabulary"].includes(session.source ?? "") && !!session.targetWordIds?.length && <button type="button" aria-label={`Remake ${title}`} onClick={() => { setMenu(undefined); onRemakeLesson(lesson.id); }}><BookOpen size={16} />Remake lesson</button>}{!compact && <>{canSaveLesson(session) && <button type="button" aria-label={`Rename ${title}`} onClick={() => { setMenu(undefined); setEditing(lesson.id); setName(title); }}><Pencil size={15} />Rename</button>}<button type="button" aria-label={`Remove lesson: ${title}`} onClick={() => { setMenu(undefined); onRemoveLesson(lesson.id); }}><Trash2 size={15} />Remove</button></>}</div>}</div>
      </div>
    </article>;
  })}</div>;
}

export function RecentLessonShelf({ state, onAllLessons, ...actions }: LessonActions & { state: LearnerState; onAllLessons: () => void }) {
  const lessons = recentLessons(state).slice(0, 4);
  if (!lessons.length) return null;
  return <section className="today-recent" aria-label="Saved and recent lessons"><div className="today-section-heading"><h2>Your lessons</h2><button className="text-button" type="button" onClick={onAllLessons}>My lessons <ArrowRight size={14} /></button></div><LessonRows lessons={lessons} {...actions} compact /></section>;
}

export function LessonsView({ state, onBuild, onClearLessons, onRestoreLessons, ...actions }: LessonActions & { state: LearnerState; onBuild: () => void }) {
  const [filter, setFilter] = useState<"all" | "saved" | "unfinished">("all");
  const [query, setQuery] = useState("");
  const all = recentLessons(state);
  const lessons = all.filter(lesson => (filter !== "saved" || lesson.savedAt) && (filter !== "unfinished" || lesson.session.cursor < lesson.session.items.length) && storedLessonTitle(lesson).toLowerCase().includes(query.toLowerCase()));
  return <div className="view lessons-view"><header className="view-heading"><h1>My lessons</h1><button type="button" className="build-entry" onClick={onBuild}><BookOpen size={16} />New lesson <ArrowRight size={16} /></button></header>
    {!!all.length && <div className="session-tools"><div className="session-filters" role="group" aria-label="Filter lessons">{([['all', 'Recent'], ['saved', 'Saved'], ['unfinished', 'In progress']] as const).map(([id, label]) => <button type="button" key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}{id === "saved" && ` · ${all.filter(lesson => lesson.savedAt).length}`}</button>)}</div><label className="search-field"><Search size={17} /><input aria-label="Search saved and recent lessons" placeholder="Search lessons" value={query} onChange={event => setQuery(event.target.value)} /></label></div>}
    {(onClearLessons || onRestoreLessons) && <details className="session-tools"><summary>Manage lessons</summary>{!!all.length && onClearLessons && <button type="button" onClick={onClearLessons}>Clear all lessons</button>}{!!state.clearedLessons?.length && onRestoreLessons && <button type="button" onClick={onRestoreLessons}>Restore cleared lessons ({state.clearedLessons.length})</button>}</details>}
    <LessonRows lessons={lessons} {...actions} />
    {!lessons.length && <section className="sessions-empty"><span className="sessions-empty-art"><BookOpen size={39} strokeWidth={1.2} /></span><h2>{all.length ? "No matching lessons" : "No lessons yet"}</h2>{all.length ? <button type="button" className="build-entry" onClick={() => { setFilter("all"); setQuery(""); }}>Show all lessons</button> : <button type="button" className="build-entry" onClick={onBuild}><Compass size={16} />Open the course <ArrowRight size={15} /></button>}</section>}
  </div>;
}
