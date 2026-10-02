import { BookOpen, Check, ChevronDown, ExternalLink, Flag } from "lucide-react";
import { a1CompletionPolicy, a1Milestones, type A1Skill } from "../../../packages/dictionary/a1";
import type { LearnerState } from "./types";

const skills: Record<A1Skill, string> = { listening: "Listening", reading: "Reading", "spoken-interaction": "Conversation", "spoken-production": "Speaking", writing: "Writing" };

export function A1Milestones({ state, onMilestone }: { state: LearnerState; onMilestone?: (id: string, checked: boolean) => void }) {
  const checks = state.a1Journey?.milestoneChecks ?? {};
  const checked = a1Milestones.filter(item => checks[item.id]).length;
  return <>
    <details className="progress-details a1-checks">
      <summary><Flag size={18} /><strong>A1 milestones</strong><span>{checked} / {a1Milestones.length}</span><ChevronDown size={16} /></summary>
      <div className="progress-details-body"><p className="progress-note">Try the task, then check what you can do.</p>
        <div className="a1-check-list">{a1Milestones.map(milestone => <details className={`a1-check${checks[milestone.id] ? " is-checked" : ""}`} key={milestone.id}>
          <summary><span className="a1-check-mark" aria-label={checks[milestone.id] ? "Achieved" : "Not yet checked"}>{checks[milestone.id] && <Check size={13} />}</span><strong>{milestone.title}</strong><ChevronDown size={14} /></summary>
          <div className="a1-check-task"><p>{milestone.task}</p><small>{milestone.skills.map(skill => skills[skill]).join(" · ")}</small>
            <label><input type="checkbox" aria-label={`${milestone.title} achieved`} checked={!!checks[milestone.id]} disabled={!onMilestone} onChange={event => onMilestone?.(milestone.id, event.target.checked)} />I can do this</label>
            <a className="a1-source-link" href={milestone.sourceUrl} target="_blank" rel="noreferrer">{milestone.sourceCanDoIds.length ? `Marugoto Can-do ${milestone.sourceCanDoIds.join(", ")}` : "CEFR self-assessment grid"}<ExternalLink size={12} /></a>
          </div>
        </details>)}</div>
      </div>
    </details>
    <details className="progress-details progress-standards">
      <summary><BookOpen size={18} /><strong>About this progress</strong><ChevronDown size={16} /></summary>
      <div className="progress-details-body">
        <p>A1 course completion covers all 750 words in the curated foundations and topic lessons. Completing or explicitly marking a lesson known advances the course; previewing it does not. These practical self-checks are separate from course completion.</p>
        <p>CEFR and JF A1 describe practical language skills, not a fixed word count. Vocabulary practice and self-checks do not certify proficiency. Try the tasks with slow speech and repetition as needed.</p>
        <div className="progress-standard-links"><a href="https://www.coe.int/en/web/common-european-framework-reference-languages/table-2-cefr-3.3-common-reference-levels-self-assessment-grid" target="_blank" rel="noreferrer">CEFR self-assessment grid <ExternalLink size={12} /></a><a href="https://www.jfstandard.jpf.go.jp/pdf/CEFR_Cando_Level_list.pdf" target="_blank" rel="noreferrer">JF Can-do levels <ExternalLink size={12} /></a><a href="https://marugoto.jpf.go.jp/assets/docs/download/starter_a/MarugotoStarterActivitiesCan-doCheck_EN.pdf" target="_blank" rel="noreferrer">Marugoto Starter A1 checks <ExternalLink size={12} /></a></div>
        <p>Streaks count practiced cards, completed activities, and kanji study. Daily goals reset at local midnight; weeks start on Monday. Total goals use recorded practice. Progress is saved in this browser.</p>
      </div>
    </details>
  </>;
}
