import { useState } from "react";
import { ArrowRight, BookOpen, CalendarDays, Check, Flame, Gamepad2, Leaf, Pencil, Plus, RotateCcw, Target, Trash2, Trophy, X } from "lucide-react";
import { goalMetrics, goalProgress, periodLabels, streakSummary, validGoal } from "./goals";
import { CuratedProgress as A1Goal } from "./CuratedCourseView";
import { A1Milestones } from "./A1Milestones";
import type { GoalMetric, GoalPeriod, LearnerState, LearningGoal, NavigationKey } from "./types";
import "./goals.css";

export type GoalDraft = Pick<LearningGoal, "metric" | "period" | "target"> & { id?: string };
const presets: GoalDraft[] = [{ metric: "cards", period: "daily", target: 20 }, { metric: "days", period: "weekly", target: 5 }, { metric: "kanji", period: "total", target: 50 }];
const goalTitle = (goal: GoalDraft) => `${goal.target} ${goal.target === 1 ? goalMetrics[goal.metric].unit.replace("cards", "card").replace("new words", "new word").replace("words reviewed", "word reviewed").replace("lessons", "lesson").replace("days", "day").replace("rounds", "round") : goalMetrics[goal.metric].unit}${goal.period === "daily" ? " a day" : goal.period === "weekly" ? " a week" : " in total"}`;
const goalIcons = { cards: BookOpen, words: BookOpen, reviews: RotateCcw, lessons: Trophy, days: CalendarDays, kanji: Leaf, activities: Gamepad2 };

type Props = { state: LearnerState; onSave: (goal: GoalDraft) => void; onRemove: (id: string) => void; onNavigate: (view: NavigationKey) => void; onMilestone?: (id: string, checked: boolean) => void };

export function GoalsView({ state, onSave, onRemove, onNavigate, onMilestone }: Props) {
  const [draft, setDraft] = useState<GoalDraft>();
  const [error, setError] = useState("");
  const goals = state.learningGoals ?? [];
  const streak = streakSummary(state.practiceDays);
  const edit = (goal?: LearningGoal) => { setDraft(goal ?? { metric: "cards", period: "daily", target: 20 }); setError(""); };
  const save = () => {
    if (!draft || !validGoal(draft.metric, draft.period, draft.target)) { setError("Enter a whole-number target within the shown range."); return; }
    onSave(draft); setDraft(undefined); setError("");
  };
  const max = draft ? Math.min(goalMetrics[draft.metric].max, draft.metric === "days" && draft.period !== "total" ? draft.period === "daily" ? 1 : 7 : Infinity) : 1;
  return <div className="view goals-view">
    <header className="view-heading progress-heading"><h1>Progress</h1></header>
    <A1Goal state={state} onOpen={() => onNavigate("course")} />
    <section className="progress-streak" aria-label="Practice streak"><span className={`progress-flame${streak.practicedToday ? " is-lit" : ""}`}><Flame size={30} strokeWidth={1.5} /></span><div><strong>{streak.current}</strong><span>day streak</span></div><div className="progress-streak-best"><Trophy size={16} /><span>Best <strong>{streak.longest}</strong></span></div>{streak.practicedToday && <Check size={18} className="progress-today-check" aria-label="Practiced today" />}</section>
    <section className="personal-goals" aria-label="Your goals">
      <header><h2>Your goals</h2><button type="button" className="progress-add" onClick={() => edit()}><Plus size={16} />Add goal</button></header>
      {draft && <form className="goal-editor" noValidate aria-label={draft.id ? "Edit goal" : "New goal"} onSubmit={event => { event.preventDefault(); save(); }}>
        <div className="goal-editor-heading"><h3>{draft.id ? "Edit goal" : "New goal"}</h3><button type="button" className="session-icon" aria-label="Cancel goal editing" onClick={() => setDraft(undefined)}><X size={18} /></button></div>
        <div className="goal-fields"><label className="goal-measure">Measure<select aria-label="Goal measure" value={draft.metric} onChange={event => { const metric = event.target.value as GoalMetric; setDraft({ ...draft, metric, target: goalMetrics[metric].defaults[draft.period] }); }}>{(Object.keys(goalMetrics) as GoalMetric[]).map(metric => <option key={metric} value={metric}>{goalMetrics[metric].label}</option>)}</select></label>
          <label>Period<select aria-label="Goal period" value={draft.period} onChange={event => { const period = event.target.value as GoalPeriod; setDraft({ ...draft, period, target: goalMetrics[draft.metric].defaults[period] }); }}>{(Object.keys(periodLabels) as GoalPeriod[]).map(period => <option key={period} value={period}>{periodLabels[period]}</option>)}</select></label>
          <label>Target<input type="number" aria-label="Goal target" min={1} max={max} step={1} value={draft.target || ""} onChange={event => setDraft({ ...draft, target: Number(event.target.value) })} /><small>1–{max.toLocaleString()}</small></label>
        </div>
        {error && <p role="alert" className="goal-error">{error}</p>}
        <button type="submit" className="goal-save">Save goal <Check size={16} /></button>
      </form>}
      {!!goals.length && <div className="goal-cards">{goals.map(goal => {
        const progress = goalProgress(state, goal);
        const Icon = goalIcons[goal.metric];
        return <article key={goal.id} className={progress.reached ? "goal-reached" : ""}>
          <div className="goal-card-top"><span className="goal-card-icon"><Icon size={21} /></span><div><small>{periodLabels[goal.period]}</small><h3>{goalMetrics[goal.metric].label}</h3></div><button type="button" className="session-icon" aria-label={`Edit ${goalTitle(goal)}`} onClick={() => edit(goal)}><Pencil size={15} /></button><button type="button" className="session-icon" aria-label={`Remove ${goalTitle(goal)}`} onClick={() => onRemove(goal.id)}><Trash2 size={15} /></button></div>
          <div className="goal-value"><strong>{progress.value}</strong><span>/ {goal.target}</span>{progress.reached && <Check size={18} aria-label="Goal reached" />}</div>
          <div className="goal-track" role="progressbar" aria-label={goalTitle(goal)} aria-valuemin={0} aria-valuemax={goal.target} aria-valuenow={Math.min(progress.value, goal.target)}><i style={{ width: `${progress.ratio * 100}%` }} /></div>
          <button type="button" className="goal-practice" onClick={() => onNavigate(goal.metric === "kanji" ? "kanji" : goal.metric === "activities" ? "games" : "today")}>{goal.metric === "kanji" ? "Study kanji" : goal.metric === "activities" ? "Activities" : "Practice"}<ArrowRight size={15} /></button>
        </article>;
      })}</div>}
      {!goals.length && !draft && <details className="goal-presets"><summary><Target size={16} />Quick goals<Plus size={15} /></summary><div>{presets.map(preset => { const Icon = goalIcons[preset.metric]; return <button type="button" key={preset.metric} onClick={() => onSave(preset)}><Icon size={20} /><span>{goalTitle(preset)}</span><Plus size={16} /></button>; })}</div></details>}
    </section>
    <A1Milestones state={state} onMilestone={onMilestone} />
  </div>;
}
