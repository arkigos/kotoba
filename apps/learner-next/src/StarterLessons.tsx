import { useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, LockKeyhole } from "lucide-react";
import { buildStarterLesson, nextStarter, starterAvailable, starterComplete, starterLessons, starterNotes } from "./starter-lessons";
import { isSessionComplete, recentLessons } from "./session-history";
import type { ActiveSession, LearnerState } from "./types";
const description = "Build simple sentences, ask questions, and learn the patterns shared by every A1 track.";

export function StarterTrackCard({ state, onOpen }: { state: LearnerState; onOpen: () => void }) {
  const completed = starterLessons.filter(lesson => starterComplete(state, lesson.id)).length;
  const next = nextStarter(state);
  const words = new Set(starterLessons.flatMap(lesson => lesson.targets)).size;
  return <article className="learn-topic"><button className="learn-topic-main" type="button" onClick={onOpen}>
    <span className="curated-topic-mark" aria-hidden="true"><BookOpen size={25}/><span>A1</span></span>
    <small>Start here</small><h2>Foundations</h2><p>{description}</p>
    <div className="learn-topic-count"><span>{completed} / {starterLessons.length} lessons · {words} words</span><ArrowRight size={16}/></div>
    <span className="learn-topic-track" role="progressbar" aria-label="Foundations lessons completed" aria-valuemin={0} aria-valuemax={starterLessons.length} aria-valuenow={completed}><i style={{width:`${100 * completed / starterLessons.length}%`}}/></span>
    <small>{next ? `Next: ${next.title}` : "Completed · practice anytime"}</small>
  </button></article>;
}

export function StarterLessons({ state, onStart, onMarkKnown, onBack }: { state: LearnerState; onStart: (session: ActiveSession) => void; onMarkKnown?: (session: ActiveSession) => void; onBack?: () => void }) {
  const [error, setError] = useState("");
  const resumable = (id: string) => recentLessons(state).find(row => row.session.starterLessonId === id && row.session.starterVersion === starterLessons.find(lesson => lesson.id === id)?.version && !isSessionComplete(row.session))?.session;
  const act = (id: string, known = false) => {
    try { const session = (!known && starterAvailable(state, id) && resumable(id)) || buildStarterLesson(state, id); setError(""); if (known) onMarkKnown?.(session); else onStart(session); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "This starter lesson is not ready."); }
  };
  return <section className="curated-topic-detail" aria-label="Foundations">
    {onBack && <button className="text-button" type="button" onClick={onBack}><ArrowLeft size={16}/> All A1 tracks</button>}
    <header><div><h2>Foundations</h2><p>{description} Complete these lessons in order to open the other tracks.</p></div></header>
    <ol className="curated-lesson-list">{starterLessons.map((lesson, index) => {
      const complete = starterComplete(state, lesson.id), available = starterAvailable(state, lesson.id), resume = !!resumable(lesson.id);
      const action = resume ? "Resume" : complete ? "Replay" : "Start";
      return <li key={lesson.id}>
        <span className="curated-step" aria-hidden="true">{complete ? <Check size={18}/> : index + 1}</span>
        <div className="curated-lesson-copy"><h3>{lesson.title}</h3><p>{lesson.description}</p>
          <p>{lesson.targets.length ? `${lesson.targets.length} focus word${lesson.targets.length === 1 ? "" : "s"}` : "Grammar with familiar words"} · {lesson.cards.length} cards</p>
          <details><summary>Grammar and lesson preview</summary>{starterNotes(lesson, state).map(note => <div key={note.start}><h4>{note.title}</h4><p lang="ja">{note.pattern}</p><p>{note.explanation}</p></div>)}<ol>{lesson.cards.map(card => <li key={card.id}><span lang="ja">{card.line.join("")}</span><small>{card.english}</small></li>)}</ol></details>
          {available && !complete && onMarkKnown && <button className="text-button curated-known" type="button" onClick={() => act(lesson.id, true)} aria-label={`Mark Starter ${index + 1} as already known`}>I already know this lesson</button>}
        </div>
        <button className="build-entry" type="button" disabled={!available} aria-label={`${action} ${lesson.title}`} onClick={() => act(lesson.id)}>{available ? action : <><LockKeyhole size={14}/> After lesson {index}</>}</button>
      </li>;
    })}</ol>{error && <p role="alert">{error}</p>}
  </section>;
}
