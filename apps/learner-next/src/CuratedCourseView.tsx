import { useEffect, useState, useRef, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, LockKeyhole, RotateCcw } from "lucide-react";
import { buildCuratedLesson, buildCuratedReview, curatedAvailable, curatedComplete, curatedLesson, curatedLevelProgress, curatedLevels, curatedReviewCards, independentCuratedLevel, curatedTopics, curatedPrerequisite, curatedWordId, nextCuratedLesson, loadCuratedTopic, type LoadedCuratedLesson, type CuratedLevel } from "./curated-course";
import { isSessionComplete, recentLessons } from "./session-history";
import { StarterLessons, StarterTrackCard } from "./StarterLessons";
import { startersComplete, starterTrackId } from "./starter-lessons";
import type { ActiveSession, LearnerState } from "./types";
import "./learn.css";
import "./topic-course.css";
import "./curated-course.css";

export function CuratedProgress({ state, onOpen }: { state: LearnerState; onOpen?: () => void }) {
  const progress = curatedLevelProgress(state,"A1");
  return <section className="a1-goal compact-a1-goal" aria-label="A1 course progress"><span className="a1-goal-symbol">A1</span><div className="a1-goal-copy"><h2>{progress.complete ? "A1 completed" : `${progress.learned} of ${progress.total} A1 words completed`}</h2><p>Complete the foundations, then choose any A1 track. Return to each track for review.</p><div className="a1-track" role="progressbar" aria-label="A1 course words completed" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.learned}><i style={{ width:`${progress.percent}%` }} /></div></div>{onOpen && <button className="build-entry" type="button" onClick={onOpen}>Learn <ArrowRight size={16}/></button>}</section>;
}
type Props = { state: LearnerState; onSession: (session: ActiveSession) => void; onMarkKnown?: (session: ActiveSession) => void; lessonShelf?: ReactNode; focusWordIds?: string[]; initialTopic?: string; onTopicClose?: () => void };
export function CuratedCourseView({ state, onSession, onMarkKnown, lessonShelf, focusWordIds, initialTopic, onTopicClose }: Props) {
  const [level, setLevel] = useState<CuratedLevel>("A1"), [selected, setSelected] = useState<string>(), [error, setError] = useState("");
  useEffect(() => { if (initialTopic === starterTrackId) { setSelected(starterTrackId); setLevel("A1"); } else if (initialTopic && curatedTopics.some(t=>t.id===initialTopic)) { setSelected(initialTopic); setLevel(curatedTopics.find(t=>t.id===initialTopic)!.level); } }, [initialTopic]);
  const [loaded, setLoaded] = useState<LoadedCuratedLesson[]>([]), [busy, setBusy] = useState(false);
  const actionNonce = useRef(0);
  useEffect(() => {
    let active=true; setLoaded([]); setError(""); setBusy(false);
    if(selected && selected !== starterTrackId) void loadCuratedTopic(selected).then(lessons => { if(active) setLoaded(lessons); }).catch(cause => { if(active) setError(cause instanceof Error ? cause.message : "This topic could not load."); });
    return () => { active=false; actionNonce.current++; };
  },[selected]);
  const nextInCourse = nextCuratedLesson(state);
  const ready = startersComplete(state), progress = curatedLevelProgress(state,level);
  const topic = curatedTopics.find(t=>t.id===selected);
  const focused = new Set(focusWordIds?.map(curatedWordId));
  const topics = curatedTopics.filter(t=>t.level===level);
  const act = async (id: string, action: "start"|"known"|"review") => {
    const request=++actionNonce.current; setBusy(true);
    try {
      setError("");
      if (action === "review") { const review=await buildCuratedReview(state,id); if(request===actionNonce.current) onSession(review); return; }
      const prior = recentLessons(state).find(row=>row.session.curatedLessonId===id && row.session.curatedVersion===curatedLesson(id)?.version && !isSessionComplete(row.session));
      const session = prior?.session ?? await buildCuratedLesson(state,id);
      if(request!==actionNonce.current) return;
      if (action === "known") onMarkKnown?.(session); else onSession(session);
    } catch (cause) { if(request===actionNonce.current) setError(cause instanceof Error ? cause.message : "This lesson could not open."); }
    finally { if(request===actionNonce.current) setBusy(false); }
  };
  return <div className="view learn-view curated-view">
    <header className="view-heading learn-heading"><h1>Learn Japanese</h1><label className="curated-level">Level <select aria-label="Course level" value={level} onChange={e=>{setLevel(e.target.value as CuratedLevel);setSelected(undefined);setError("");onTopicClose?.();}}>{curatedLevels.map(code=><option key={code}>{code}</option>)}</select></label></header>
    <p className="curated-intro">{level === "A1" ? "Start with the foundations, then choose a track. Each track builds on its own earlier lessons." : independentCuratedLevel(level) ? "Choose a track and build on the language you know. Each track follows its own sequence." : "Build on the language you already know, one chapter at a time."}</p>
    <p className="curated-level-count">{progress.learned} / {progress.total} words completed</p>
    {ready && !selected && nextInCourse && curatedAvailable(state,nextInCourse.id) && <div className="curated-continue"><button className="build-entry" type="button" disabled={busy} onClick={()=>act(nextInCourse.id,"start")}><ArrowRight size={16}/> Continue: {nextInCourse.title}</button></div>}
    {error && <p role="alert">{error}</p>}
    {selected === starterTrackId ? <StarterLessons state={state} onStart={onSession} onMarkKnown={onMarkKnown} onBack={()=>{setSelected(undefined);onTopicClose?.();}}/> : topic ? <section className="curated-topic-detail" aria-label={topic.title}>
      <button className="text-button" type="button" onClick={()=>{setSelected(undefined);onTopicClose?.();}}><ArrowLeft size={16}/> All {level} {independentCuratedLevel(level) ? "tracks" : "chapters"}</button>
      <header><div><h2>{topic.title}</h2><p>{topic.description}</p></div><button className="build-entry" type="button" disabled={busy || !curatedReviewCards(state,topic.id).length} onClick={()=>act(topic.id,"review")}><RotateCcw size={16}/> Review this {independentCuratedLevel(level) ? "track" : "chapter"}</button></header>
      {!loaded.length && !error && <p role="status">Loading authored sentences…</p>}
      <ol className="curated-lesson-list">{topic.lessonIds.map((id,index)=>{
        const lesson = curatedLesson(id)!, complete = curatedComplete(state,id), available = curatedAvailable(state,id);
        const resume = recentLessons(state).some(row=>row.session.curatedLessonId===id && row.session.curatedVersion===lesson.version && !isSessionComplete(row.session));
        return <li key={id}><span className="curated-step" aria-hidden="true">{complete ? <Check size={18}/> : index+1}</span><div className="curated-lesson-copy"><h3>{lesson.title}</h3><p>{lesson.kind === "review" ? "Recall familiar words" : lesson.targets.length ? `${lesson.targets.length} focus word${lesson.targets.length === 1 ? "" : "s"}` : "Grammar practice"} · {lesson.cardIds.length} cards</p><p lang={lesson.kind === "review" ? undefined : "ja"}>{lesson.pattern}</p><CuratedLessonPreview lesson={loaded.find(row=>row.id===id)} review={lesson.kind === "review"}/>{available && !complete && onMarkKnown && <button className="text-button curated-known" type="button" disabled={busy} onClick={()=>act(id,"known")}>I already know this lesson</button>}</div><button className="build-entry" type="button" disabled={!available || busy} aria-label={`${resume ? "Resume" : complete ? "Replay" : "Start"} ${lesson.title}`} onClick={()=>act(id,"start")}>{available ? resume ? "Resume" : complete ? "Replay" : "Start" : <><LockKeyhole size={14}/> {!ready ? "After foundations" : !curatedLevels.slice(0, curatedLevels.indexOf(level)).every(prior => curatedLevelProgress(state, prior).complete) ? `After ${curatedLevels[curatedLevels.indexOf(level)-1]}` : curatedPrerequisite(id)?.topicId !== topic.id ? `After ${curatedTopics.find(t=>t.id===curatedPrerequisite(id)?.topicId)?.title ?? "earlier chapters"}` : `After lesson ${index}`}</>}</button></li>;
      })}</ol>
    </section> : <section aria-label={`${level} topics`}><div className="learn-topic-grid">{level === "A1" && <StarterTrackCard state={state} onOpen={()=>setSelected(starterTrackId)}/>}{topics.map((t,chapterIndex)=>{
      const completed = t.lessonIds.filter(id=>curatedComplete(state,id)).length;
      const next = nextCuratedLesson(state,t.id);
      return <article className={`learn-topic${t.wordIds.some(id=>focused.has(id)) ? " is-active" : ""}`} key={t.id}><button className="learn-topic-main" type="button" onClick={()=>setSelected(t.id)}><span className="curated-topic-mark" aria-hidden="true"><BookOpen size={25}/><span>{level}</span></span><small>{independentCuratedLevel(level) ? "Track" : "Chapter"} {chapterIndex+1}{next && !curatedAvailable(state,next.id) ? " · Coming up" : ""}</small><h2>{t.title}</h2><p>{t.description}</p><div className="learn-topic-count"><span>{completed} / {t.lessonIds.length} lessons · {t.wordIds.length} words</span><ArrowRight size={16}/></div><span className="learn-topic-track" role="progressbar" aria-label={`${t.title} lessons completed`} aria-valuemin={0} aria-valuemax={t.lessonIds.length} aria-valuenow={completed}><i style={{width:`${100*completed/t.lessonIds.length}%`}}/></span><small>{next ? `Next: ${next.title}` : "Completed · review anytime"}</small></button></article>;
    })}</div>{!topics.length && <section className="curated-coming"><h2>{level} lessons are being authored</h2><p>The {progress.total.toLocaleString()}-word scope is reserved. Lessons will appear when their sentences and progression have been reviewed.</p></section>}</section>}
    {topics.length > 0 && progress.assigned < progress.total && <p className="curated-authoring">{progress.assigned} of {progress.total} {level} words have authored lessons so far. The course is still being completed.</p>}
    {lessonShelf}
  </div>;
}

function CuratedLessonPreview({lesson,review}:{lesson?:LoadedCuratedLesson;review:boolean}) {
  const [open,setOpen]=useState(false);
  return <details onToggle={event=>setOpen(event.currentTarget.open)}>
    <summary>Grammar and lesson preview</summary>
    {open && <>{lesson?.notes.map(note=><div key={note.start}><h4>{note.title}</h4><p lang={review?undefined:"ja"}>{note.pattern}</p><p>{note.explanation}</p></div>)}
    <ol>{lesson?.cards.map(card=><li key={card.id}><span lang="ja">{card.line.join("")}</span><small>{card.english}</small></li>)}</ol></>}
  </details>;
}
