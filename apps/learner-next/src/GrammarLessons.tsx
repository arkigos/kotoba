import { useMemo, useState } from "react";
import { ArrowRight, BookmarkPlus } from "lucide-react";
import { dictionaryWord } from "../../../packages/dictionary";
import { learningGrammar, type LearningGrammarId } from "../../../packages/learning-engine/learning-grammar";
import { buildGrammarLesson, grammarWordChoices } from "./grammar-lesson";
import { grammarStatus } from "./grammar-progress";
import { knownLessonWords } from "./lesson-vocabulary";
import type { ActiveSession, LearnerState } from "./types";
import "./grammar-lessons.css";

export function GrammarLessons({ state, onStart, onSave }: { state: LearnerState; onStart: (session: ActiveSession) => void; onSave?: (session: ActiveSession) => void }) {
  const [selected, setSelected] = useState<LearningGrammarId>();
  const [words, setWords] = useState<string[]>([]);
  const grammar = learningGrammar.find(row => row.id === selected);
  const choices = useMemo(() => selected ? grammarWordChoices(state, selected) : undefined, [state, selected]);
  const preview = useMemo(() => {
    if (!selected) return {};
    try { return { session: buildGrammarLesson(state, selected, words) }; }
    catch (cause) { return { error: cause instanceof Error ? cause.message : "Choose compatible words." }; }
  }, [state, selected, words]);
  const known = knownLessonWords(state);
  return <section className="grammar-lessons" aria-label="Grammar lessons">
    <p>Practice a pattern, then use it in your word lessons. Review returns when it is due.</p>
    <div className="grammar-grid">{learningGrammar.map(row => {
      const status = grammarStatus(state, row.id);
      return <button type="button" key={row.id} aria-pressed={selected === row.id} onClick={() => { setSelected(row.id); setWords(grammarWordChoices(state, row.id).selected); }}><small>{row.level} · {status.due ? "Due for review" : status.known ? "Available in lessons" : status.encounters ? "Practicing" : "New pattern"}</small><strong>{row.title}</strong><span lang="ja">{row.pattern}</span><ArrowRight size={18} /></button>;
    })}</div>
    {grammar && <div className="grammar-preview" aria-label={`${grammar.title} preview`}>
      <h2>{grammar.title}</h2><p>{grammar.explanation}</p>
      <details><summary>Words for this lesson · {words.length} selected</summary><div className="grammar-word-choices">{choices?.choices.map(id => <label key={id}><input type="checkbox" checked={words.includes(id)} onChange={() => setWords(previous => previous.includes(id) ? previous.filter(word => word !== id) : [...previous, id])} /><span lang="ja">{dictionaryWord(id)?.surface}</span><small>{known.has(id) ? "Review" : "New"}</small></label>)}</div></details>
      {preview.error && <p role="alert">{preview.error}</p>}
      {preview.session && <><div className="grammar-actions"><button type="button" className="build-entry" onClick={() => onStart(preview.session!)}>Start grammar lesson <ArrowRight size={17} /></button>{onSave && <button type="button" onClick={() => onSave(preview.session!)}><BookmarkPlus size={17} />Save grammar lesson</button>}</div><details open><summary>Preview {preview.session.items.length} cards</summary><ol>{preview.session.savedCards?.map((card, index) => <li key={index}>{preview.session!.items[index].section !== "lesson" && <small>{preview.session!.items[index].section === "due-review" ? "Scheduled review" : "Recent practice"} · {preview.session!.items[index].reviewSource?.title}</small>}<span lang="ja">{card.line.join("")}</span><small>{card.english}</small></li>)}</ol></details></>}
    </div>}
  </section>;
}
