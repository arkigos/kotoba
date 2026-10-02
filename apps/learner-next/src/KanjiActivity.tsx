import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, ExternalLink, Eye, Grid2X2, RotateCcw, Search, Volume2, X } from "lucide-react";
import { playWord, stopAudio } from "./audio";
import { coreKanji, kanjiArtStyle, kanjiGroups, kanjiQuestions, kanjiSourceNote, originLabels, type KanjiEntry, type KanjiQuestion } from "./kanji-data";
import type { ToastMessage } from "./types";
import "./kanji-activity.css";

export type KanjiQuizResult = { id: string; kind: "kanji"; correct: number; total: number; kanjiIds: string[]; at: string; durationSeconds: number };
type Props = {
  visitedIds: string[];
  onStudy: (id: string) => void;
  onBack: () => void;
  onToast?: (message: Omit<ToastMessage, "id">) => void;
  onQuizComplete?: (result: KanjiQuizResult) => void;
};
type Round = { id: string; startedAt: number; questions: KanjiQuestion[]; answers: { id: string; correct: boolean }[] };

export function KanjiActivity({ visitedIds, onStudy, onBack, onToast, onQuizComplete }: Props) {
  const [group, setGroup] = useState("all");
  const [query, setQuery] = useState("");
  const [unseenOnly, setUnseenOnly] = useState(false);
  const [selectedId, setSelectedId] = useState(() => coreKanji.find(entry => !visitedIds.includes(entry.id))?.id ?? coreKanji[0].id);
  const [round, setRound] = useState<Round>();
  const [answer, setAnswer] = useState<string>();
  const [imageHints, setImageHints] = useState(true);
  const [playing, setPlaying] = useState(false);
  const completedRounds = useRef(new Set<string>());
  const visited = useMemo(() => new Set(visitedIds), [visitedIds]);
  const normalizedQuery = query.normalize("NFKC").trim().toLowerCase();
  const filtered = coreKanji.filter(entry => (group === "all" || entry.group === group) && (!unseenOnly || !visited.has(entry.id)) && `${entry.character} ${entry.meaning} ${entry.reading} ${entry.readings} ${entry.example.surface} ${entry.example.reading}`.normalize("NFKC").toLowerCase().includes(normalizedQuery));
  const selected = coreKanji.find(entry => entry.id === selectedId)!;
  const selectedIndex = filtered.findIndex(entry => entry.id === selectedId);
  const studiedCount = coreKanji.filter(entry => visited.has(entry.id)).length;
  const question = round?.questions[round.answers.length];
  const finished = !!round && round.answers.length === round.questions.length;

  useEffect(() => () => stopAudio(), []);
  useEffect(() => {
    if (round && !navigator.userAgent.includes("jsdom")) window.scrollTo({ top: 0, behavior: "instant" });
  }, [round?.id, finished]);
  useEffect(() => {
    if (!finished || !round || completedRounds.current.has(round.id)) return;
    completedRounds.current.add(round.id);
    onQuizComplete?.({ id: round.id, kind: "kanji", correct: round.answers.filter(item => item.correct).length, total: round.answers.length, kanjiIds: round.questions.map(item => item.entry.id), at: new Date().toISOString(), durationSeconds: Math.max(1, Math.round((Date.now() - round.startedAt) / 1000)) });
  }, [finished, round, onQuizComplete]);

  const select = (entry: KanjiEntry) => { stopAudio(); setPlaying(false); setSelectedId(entry.id); document.getElementById("kanji-detail")?.scrollIntoView?.({ block: "start", behavior: "instant" }); };
  const changeGroup = (value: string) => {
    setGroup(value);
    if (value !== "all" && selected.group !== value) {
      const entries = coreKanji.filter(entry => entry.group === value);
      const first = entries.find(entry => !visited.has(entry.id)) ?? entries[0];
      if (first) select(first);
    }
  };
  const move = (direction: number) => {
    if (!filtered.length) return;
    const position = selectedIndex < 0 ? 0 : (selectedIndex + direction + filtered.length) % filtered.length;
    select(filtered[position]);
  };
  const listen = (entry: KanjiEntry) => {
    if (playing) { stopAudio(); setPlaying(false); return; }
    // The example is a complete word, which avoids presenting bound readings
    // such as おお or キュウ as independent vocabulary.
    void playWord({ surface: entry.example.surface, reading: entry.example.reading, explain: "example word" }, {
      onLoading: () => setPlaying(true), onEnded: () => setPlaying(false), onStopped: () => setPlaying(false),
      onUnavailable: () => { setPlaying(false); onToast?.({ tone: "warning", message: "Audio is unavailable on this device." }); },
    });
  };
  const startQuiz = (pool = filtered) => {
    if (!pool.length) return;
    stopAudio(); setPlaying(false); setAnswer(undefined);
    setRound({ id: crypto.randomUUID(), startedAt: Date.now(), questions: kanjiQuestions(pool), answers: [] });
  };
  const choose = (id: string) => {
    if (answer || !question) return;
    setAnswer(id);
  };
  const nextQuestion = () => {
    if (!round || !question || !answer) return;
    setRound({ ...round, answers: [...round.answers, { id: question.entry.id, correct: answer === question.entry.id }] });
    setAnswer(undefined);
  };
  const leaveQuiz = () => { stopAudio(); setAnswer(undefined); setRound(undefined); };

  useEffect(() => {
    if (!question) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      const index = Number(event.key) - 1;
      if (!answer && index >= 0 && index < 4 && question.choices[index]) { event.preventDefault(); choose(question.choices[index].id); }
      if (answer && event.key === "Enter") { event.preventDefault(); nextQuestion(); }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [question, answer]);

  return <div className="view kanji-view">
    <button className="kanji-back" type="button" onClick={round ? leaveQuiz : onBack}><ArrowLeft size={16} />{round ? "Kanji atlas" : "Activities"}</button>
    <header className="kanji-heading"><div><p className="kicker">50 core characters</p><h1>Kanji atlas</h1><p>Meanings, word readings, and the shapes behind the characters.</p></div><div className="kanji-total"><strong>{studiedCount}<span> / 50</span></strong><small>studied</small><div className="kanji-progress" role="progressbar" aria-label="Kanji studied" aria-valuenow={studiedCount} aria-valuemin={0} aria-valuemax={50}><span style={{ width: `${studiedCount * 2}%` }} /></div></div></header>

    {round ? <section className="kanji-quiz" aria-label="Kanji quiz">
      {finished ? <><p className="kicker">Round complete</p><h2>{round.answers.filter(item => item.correct).length} / {round.questions.length}</h2><p>{round.answers.every(item => item.correct) ? "Every character recognized." : "Review the missed characters, then try them again."}</p><div className="kanji-round-results">{round.questions.map((item, index) => <button type="button" key={item.entry.id} className={round.answers[index].correct ? "correct" : "missed"} aria-label={`Review ${item.entry.character}: ${item.entry.meaning}`} onClick={() => { select(item.entry); leaveQuiz(); }}><span lang="ja">{item.entry.character}</span><small>{item.entry.meaning.split(";")[0]}</small>{round.answers[index].correct ? <Check size={14} /> : <RotateCcw size={14} />}</button>)}</div><div className="kanji-quiz-actions">{round.answers.some(item => !item.correct) && <button type="button" className="kanji-primary" onClick={() => startQuiz(round.questions.filter((_, index) => !round.answers[index].correct).map(item => item.entry))}><RotateCcw size={16} />Retry missed</button>}<button type="button" className="kanji-secondary" onClick={() => startQuiz()}>New round</button><button type="button" className="kanji-secondary" onClick={leaveQuiz}>Explore characters</button></div></> : question && <>
        <div className="kanji-quiz-top"><span>Question {round.answers.length + 1} of {round.questions.length}</span><span>{round.answers.filter(item => item.correct).length} correct</span><button type="button" aria-pressed={imageHints} onClick={() => setImageHints(value => !value)}><Eye size={16} />Image hints {imageHints ? "on" : "off"}</button></div>
        {imageHints && <div className="kanji-quiz-art" role="img" aria-label={`Watercolor illustration: ${question.entry.meaning}`} style={kanjiArtStyle(question.entry)} />}
        <h2>Which character means <em>{question.entry.meaning.split(";")[0]}</em>?</h2>
        <div className="kanji-choices">{question.choices.map((entry, index) => <button type="button" key={entry.id} aria-label={`Answer ${entry.character}`} aria-pressed={answer === entry.id} disabled={!!answer} className={answer ? entry.id === question.entry.id ? "correct" : answer === entry.id ? "missed" : "" : ""} onClick={() => choose(entry.id)}><small>{index + 1}</small><span lang="ja">{entry.character}</span>{answer && entry.id === question.entry.id && <Check size={18} />}</button>)}</div>
        <div className="kanji-answer" aria-live="polite">{answer ? <><strong>{answer === question.entry.id ? "Correct." : `The answer is ${question.entry.character}.`}</strong><p>{question.entry.mnemonic}</p><button className="kanji-primary" type="button" onClick={nextQuestion}>{round.answers.length + 1 === round.questions.length ? "See results" : "Next character"}<ArrowRight size={16} /></button></> : <p>Choose a character. There is no timer.</p>}</div>
      </>}
    </section> : <>
      <div className="kanji-groups" aria-label="Kanji groups"><button type="button" aria-pressed={group === "all"} onClick={() => setGroup("all")}><Grid2X2 size={15} />All 50</button>{kanjiGroups.map(item => <button key={item.id} type="button" aria-pressed={group === item.id} onClick={() => changeGroup(item.id)}>{item.title}<small>{coreKanji.filter(entry => entry.group === item.id && visited.has(entry.id)).length}/10</small></button>)}</div>
      <section id="kanji-detail" className="kanji-detail" aria-label={`Study ${selected.character}`}>
        <div className={`kanji-painting kanji-painting-${selected.group}`}><div className="kanji-atlas-art" role="img" aria-label={`Watercolor illustration: ${selected.meaning}`} style={kanjiArtStyle(selected)} /><span className="kanji-painting-glyph" lang="ja">{selected.character}</span><small>Illustrated memory aid</small></div>
        <div className="kanji-notes"><div className="kanji-entry-top"><span>{kanjiGroups.find(item => item.id === selected.group)?.title}</span><span>{selected.strokes} strokes</span></div><h2>{selected.meaning}</h2><div className="kanji-reading"><span lang="ja">{selected.readings}</span><small>Common on readings / kun readings · dots mark kana endings</small></div><div className="kanji-example"><div><span lang="ja"><ruby>{selected.example.surface}<rt>{selected.example.reading}</rt></ruby></span><small>{selected.example.meaning}</small></div><button type="button" aria-label={playing ? "Stop example audio" : `Listen to ${selected.example.surface}`} aria-pressed={playing} onClick={() => listen(selected)}><Volume2 size={18} /></button></div><div className="kanji-origin"><h3>Origin <span>{originLabels[selected.origin.kind]}</span></h3><p>{selected.origin.text}</p><a href={selected.origin.source} target="_blank" rel="noreferrer">Dictionary source <ExternalLink size={11} /></a></div><div className="kanji-memory"><h3>Memory note</h3><p>{selected.mnemonic}</p></div><div className="kanji-study-actions"><button type="button" className={visited.has(selected.id) ? "kanji-secondary studied" : "kanji-primary"} aria-pressed={visited.has(selected.id)} onClick={() => { onStudy(selected.id); move(1); }}><Check size={16} />{visited.has(selected.id) ? "Review & next" : "Mark studied & next"}</button><button className="kanji-secondary kanji-arrow" type="button" aria-label="Previous kanji" disabled={!filtered.length} onClick={() => move(-1)}><ChevronLeft size={18} /></button><button className="kanji-secondary kanji-arrow" type="button" aria-label="Next kanji" disabled={!filtered.length} onClick={() => move(1)}><ChevronRight size={18} /></button></div></div>
      </section>
      <div className="kanji-toolbar"><label className="kanji-search"><Search size={16} /><input type="search" aria-label="Search kanji" placeholder="Kanji, meaning, or reading" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear kanji search" onClick={() => setQuery("")}><X size={14} /></button>}</label><button type="button" className="kanji-secondary" aria-pressed={unseenOnly} onClick={() => setUnseenOnly(value => !value)}>Not studied{unseenOnly && <Check size={14} />}</button><button type="button" className="kanji-primary" disabled={!filtered.length} onClick={() => startQuiz()}>Quiz these {filtered.length}<ArrowRight size={15} /></button></div>
      <div className="kanji-grid" aria-label="Character collection">{filtered.map(entry => <button className={selectedId === entry.id ? "selected" : ""} type="button" key={entry.id} aria-label={`Study ${entry.character}: ${entry.meaning}`} aria-pressed={selectedId === entry.id} onClick={() => select(entry)}><div className="kanji-thumb" style={kanjiArtStyle(entry)} /><span className="kanji-tile-character" lang="ja">{entry.character}</span><strong>{entry.meaning.split(";")[0]}</strong>{visited.has(entry.id) && <Check className="kanji-studied-mark" size={14} aria-label="Studied" />}</button>)}</div>
      {!filtered.length && <div className="kanji-empty"><h2>No characters match</h2><p>Try another search or show the characters already studied.</p><button type="button" className="kanji-secondary" onClick={() => { setQuery(""); setUnseenOnly(false); setGroup("all"); }}>Show all 50</button></div>}
      <details className="kanji-about"><summary>About the illustrations and origins</summary><p>{kanjiSourceNote}</p><p>Kanji can have several readings. Learn readings in complete words, like the examples here. This atlas shows selected common readings, not every possible reading. The character recognition deck uses one prompt reading per character.</p></details>
    </>}
  </div>;
}
