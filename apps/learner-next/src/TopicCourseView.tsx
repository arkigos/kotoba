import { useEffect, useState, type ReactNode } from "react";
import { ArrowRight, BookOpen, Briefcase, Check, Compass, Headphones, House, MapPin, MessageCircle, Package, Plus, ShoppingBag, Sparkles, Sun, Users, Utensils, type LucideIcon } from "lucide-react";
import { a1Topics } from "../../../packages/dictionary/a1";
import { a1Progress, activeTopicIds, availableTopicMode, canBuildTopicLesson } from "./topic-course";
import type { ActiveSession, LearnerState } from "./types";
import { TopicLessonDialog } from "./TopicLessonDialog";
import { GrammarLessons } from "./GrammarLessons";
import "./topic-course.css";
import "./learn.css";
import { StarterLessons } from "./StarterLessons";
import { startersComplete } from "./starter-lessons";

const topicMarks: Record<string, string> = { greetings: "あ", family: "人", food: "食", home: "家", routine: "日", school: "学", work: "仕", travel: "旅", shopping: "買", leisure: "楽", culture: "祭", "everyday-objects": "本" };
const topicIcons: Record<string, LucideIcon> = { greetings: MessageCircle, family: Users, food: Utensils, home: House, routine: Sun, school: BookOpen, work: Briefcase, travel: MapPin, shopping: ShoppingBag, leisure: Headphones, culture: Sparkles, "everyday-objects": Package };

export function A1Goal({ state, onOpen }: { state: LearnerState; onOpen?: () => void }) {
  const progress = a1Progress(state);
  return <section className="a1-goal compact-a1-goal" aria-label="A1 learning goal"><span className="a1-goal-symbol">A1</span><div className="a1-goal-copy"><h2>{progress.percent}% of core vocabulary learned</h2><p>{progress.learned} / {progress.total} words · {progress.checked} / {progress.milestoneTotal} milestones</p><p>{progress.practiced} practiced at least once · {progress.declaredKnown} marked known</p><div className="a1-track" role="progressbar" aria-label="Core A1 words learned" aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.learned}><i style={{ width: `${progress.percent}%` }} /></div></div>{onOpen && <button className="build-entry" type="button" onClick={onOpen}>Learn <ArrowRight size={16} /></button>}</section>;
}

type Props = {
  state: LearnerState; onToggleTopic: (id: string) => void; onSession: (session: ActiveSession) => void;
  onBuild: () => void; onTopics?: () => void; onProgress?: () => void;
  onMarkKnown?: (session: ActiveSession) => void;
  lessonShelf?: ReactNode; onSaveSession?: (session: ActiveSession) => void;
  custom?: ReactNode; initialTopic?: string; onTopicClose?: () => void;
};

export function TopicCourseView({ state, onToggleTopic, onSession, onMarkKnown, onBuild, onTopics, onProgress, lessonShelf, onSaveSession, custom, initialTopic, onTopicClose }: Props) {
  const [selected, setSelected] = useState<string>();
  const [selectedExtras, setSelectedExtras] = useState(false);
  const [grammarOpen, setGrammarOpen] = useState(false);
  const active = activeTopicIds(state);
  const progress = a1Progress(state);
  const ready = startersComplete(state);
  useEffect(() => { if (initialTopic && ready) { const mode = availableTopicMode(state, initialTopic); if (mode) { setSelected(initialTopic); setSelectedExtras(mode === "extras"); } } }, [initialTopic, state, ready]);
  const matches = a1Topics.filter(topic => availableTopicMode(state, topic.id));
  const prepare = (id: string, extras = availableTopicMode(state, id) === "extras") => { if (!canBuildTopicLesson(state, id, extras)) return; setSelected(id); setSelectedExtras(extras); };
  const close = () => { setSelected(undefined); onTopicClose?.(); };
  const finish = (session: ActiveSession, saveOnly = false) => {
    if (selected && !active.includes(selected)) onToggleTopic(selected);
    if (saveOnly) onSaveSession?.(session); else onSession(session);
    close();
  };
  const topicCard = (id: string) => {
    const topic = a1Topics.find(value => value.id === id)!;
    const result = a1Progress(state, id);
    const joined = active.includes(id);
    const Icon = topicIcons[id] ?? Compass;
    return <article className={`learn-topic ${joined ? "is-active" : ""}`} key={id}>
      <button type="button" className="learn-topic-main" aria-label={`Practice ${topic.title}`} onClick={() => prepare(id)}>
        <span className={`learn-topic-art tone-${id}`} aria-hidden="true"><Icon size={36} strokeWidth={1.5} /><i>{topicMarks[id]}</i><b /><em /></span>
        <h3>{topic.title}</h3>
        <div className="learn-topic-count"><span>{result.learned} / {result.total} words</span><ArrowRight size={16} /></div>
        <span className="learn-topic-track" role="progressbar" aria-label={`${topic.title} words learned`} aria-valuemin={0} aria-valuemax={result.total} aria-valuenow={result.learned}><i style={{width:`${result.percent}%`}} /></span>
      </button>
      <button type="button" className="learn-topic-pin" aria-label={`${joined ? "Pause" : "Add"} ${topic.title}`} aria-pressed={joined} title={joined ? "Active topic" : "Add to your topics"} onClick={() => onToggleTopic(id)}>{joined ? <Check size={15} /> : <Plus size={15} />}</button>
      {result.vocabularyComplete && availableTopicMode(state, id) === "core" && canBuildTopicLesson(state, id, true) && <button className="learn-topic-extra" type="button" onClick={() => prepare(id, true)}>More words <Plus size={13} /></button>}
    </article>;
  };
  return <div className="view learn-view">
    <header className="view-heading learn-heading"><h1>Learn</h1><button className="learn-level" type="button" onClick={onProgress} aria-label="View A1 progress"><strong>A1</strong><span>{progress.percent}%</span><ArrowRight size={14} /></button></header>
    {ready && <div className="learn-tabs" role="tablist" aria-label="Lesson type"><button type="button" role="tab" aria-selected={!custom && !grammarOpen} onClick={() => { setGrammarOpen(false); onTopics?.(); }}>Topics</button><button type="button" role="tab" aria-selected={!!custom && !grammarOpen} onClick={() => { setGrammarOpen(false); onBuild(); }}>Custom</button><button type="button" role="tab" aria-selected={grammarOpen} onClick={() => setGrammarOpen(true)}>Grammar</button></div>}
    {!ready ? <StarterLessons state={state} onStart={onSession} onMarkKnown={onMarkKnown} /> : grammarOpen ? <GrammarLessons state={state} onStart={onSession} onSave={onSaveSession} /> : custom || <>
      {lessonShelf}
      {!matches.length && <p>No new topic lessons are ready yet. You can revisit a saved lesson or practice Grammar.</p>}
      {matches.some(topic => active.includes(topic.id)) && <section className="learn-topic-section" aria-label="Active A1 topics"><h2>Your topics</h2><div className="learn-topic-grid">{matches.filter(topic => active.includes(topic.id)).map(topic => topicCard(topic.id))}</div></section>}
      {matches.some(topic => !active.includes(topic.id)) && <section className="learn-topic-section" aria-label="More A1 topics"><h2>Explore</h2><div className="learn-topic-grid">{matches.filter(topic => !active.includes(topic.id)).map(topic => topicCard(topic.id))}</div></section>}
      <details><summary>Revisit starter lessons</summary><StarterLessons state={state} onStart={onSession} onMarkKnown={onMarkKnown} /></details>
    </>}
    {selected && ready && <TopicLessonDialog key={`${selected}-${selectedExtras}`} state={state} topicId={selected} extras={selectedExtras} onClose={close} onStart={session => finish(session)} onSave={onSaveSession ? session => finish(session, true) : undefined} />}
  </div>;
}
