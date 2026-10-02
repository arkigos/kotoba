import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, Delete, Eye, Headphones, Layers3, Pause, Play, RotateCcw, Timer, Volume2, X } from "lucide-react";
import { playWord, stopAudio } from "./audio";
import { activityRecords, distinctGameWords, gameDuration, gamePool, makeListeningQuestions, makeReadingQuestions, shuffleGameWords, type GameKind, type GamePoolSource, type GameResult, type GameWord, type ListeningQuestion, type ReadingQuestion } from "./games";
import type { LearnerState, ToastMessage } from "./types";
import "./games.css";

type GamesProps = {
  state: LearnerState;
  onToast: (message: string, tone?: ToastMessage["tone"]) => void;
  onOpenKanji: () => void;
  onComplete: (result: GameResult) => void;
};
type GameRun = { id: string; kind: GameKind; words: GameWord[]; pool: GameWord[]; seed: number; stopwatch: boolean; readings: boolean; audio: boolean; poolLabel: string };
type RunSummary = { result: GameResult; words: GameWord[]; skipped: number };
const sources: { value: GamePoolSource; label: string }[] = [
  { value: "library", label: "My words" }, { value: "starter", label: "Starter words" }, { value: "course", label: "All course words" },
  { value: "due", label: "Due for review" }, { value: "priority", label: "Prioritized" },
];
const titles: Record<GameKind, string> = { pairs: "Word pairs", listening: "Listening", reading: "Kana builder" };
const uid = () => typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `game-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function GamesView({ state, onToast, onOpenKanji, onComplete }: GamesProps) {
  const initialLibrary = useMemo(() => distinctGameWords(gamePool(state, "library")), []);
  const [source, setSource] = useState<GamePoolSource>(initialLibrary.length >= 4 ? "library" : "starter");
  const [count, setCount] = useState(10);
  const [stopwatch, setStopwatch] = useState(false);
  const [readings, setReadings] = useState(true);
  const [run, setRun] = useState<GameRun>();
  const [summary, setSummary] = useState<RunSummary>();
  const completed = useRef(new Set<string>());
  // Re-read the canonical cache on a parent render: imported saved words can
  // finish loading without changing the learner's persisted word IDs.
  const pools = Object.fromEntries(sources.map(({ value }) => [value, distinctGameWords(gamePool(state, value))])) as Record<GamePoolSource, GameWord[]>;
  const pool = pools[source];
  const listeningCount = useMemo(() => makeListeningQuestions(pool, pool, 41).length, [pool]);
  const readingCount = makeReadingQuestions(pool, 41).length;

  useEffect(() => () => stopAudio(), []);
  useEffect(() => {
    if ((run || summary) && !navigator.userAgent.includes("jsdom")) window.scrollTo({ top: 0, behavior: "instant" });
  }, [run?.id, summary?.result.id]);

  const start = (kind: GameKind, retry?: GameWord[]) => {
    stopAudio();
    const seed = Math.floor(Math.random() * 0x7fffffff);
    const available = retry && run ? run.pool : pool;
    const eligible = kind === "reading" ? makeReadingQuestions(available, seed).map(question => question.word) : available;
    let words = retry ? [...retry] : shuffleGameWords(eligible, seed).slice(0, count);
    // A single missed pair needs other tiles to remain a matching task.
    if (kind === "pairs" && words.length < 4) words = distinctGameWords([...words, ...shuffleGameWords(available, seed)], Math.min(4, available.length));
    if (kind === "listening") words = makeListeningQuestions(words, available, seed).map(question => question.word);
    if (words.length < (kind === "pairs" ? 2 : 1)) { onToast("This selection needs more distinct words. Choose Starter words or All course words.", "warning"); return; }
    setSummary(undefined);
    setRun({ id: uid(), kind, words, pool: available, seed, stopwatch, readings, audio: state.settings.sound && !state.settings.quietMode, poolLabel: retry ? `Retry ${retry.length} missed word${retry.length === 1 ? "" : "s"}${kind === "pairs" && words.length > retry.length ? ` + ${words.length - retry.length} review words` : ""}` : sources.find(item => item.value === source)!.label });
  };
  const finish = (result: GameResult, skipped = 0) => {
    stopAudio();
    if (!completed.current.has(result.id)) {
      completed.current.add(result.id);
      if (result.total > 0) onComplete(result);
    }
    setSummary({ result, words: run!.words, skipped });
  };
  const close = () => { stopAudio(); setRun(undefined); setSummary(undefined); };

  if (run && summary) {
    const { result } = summary;
    const missed = summary.words.filter(word => result.missedWordIds.includes(word.id));
    return <div className="view games-view"><button type="button" className="game-back" onClick={close}><ArrowLeft size={17} />Games &amp; activities</button><section className="game-summary">
      <span className="game-summary-mark" aria-hidden="true">{result.correct === result.total && result.total > 0 ? "◎" : "○"}</span>
      <p className="kicker">{titles[run.kind]}</p><h1>{result.total ? "Round complete" : "Audio unavailable"}</h1>
      <p>{result.total ? `${result.correct} of ${result.total} words correct on the first try.` : "No answers were recorded. Try Word pairs or check this device’s audio."}{summary.skipped > 0 && ` ${summary.skipped} audio question${summary.skipped === 1 ? " was" : "s were"} skipped.`}</p>
      <div className="game-result-stats"><div><strong>{result.total ? Math.round(result.correct / result.total * 100) : 0}%</strong><span>first-try accuracy</span></div><div><strong>{result.wordIds.length}</strong><span>words practiced</span></div><div><strong>{gameDuration(result.durationSeconds)}</strong><span>active time</span></div></div>
      {missed.length > 0 && <section className="game-missed"><h2>Words to retry</h2><p>Revisit these after the other questions, with a new arrangement.</p><div>{missed.map(word => <button type="button" key={word.id} onClick={() => void pronounce(word)} aria-label={`Hear ${word.surface}: ${word.meaning}`}><span lang="ja"><strong>{word.surface}</strong><small>{word.reading}</small></span><span>{word.meaning}</span><Volume2 size={16} /></button>)}</div></section>}
      <div className="game-summary-actions">{missed.length > 0 && <button type="button" className="game-primary" onClick={() => start(run.kind, missed)}><RotateCcw size={17} />Retry missed words</button>}<button type="button" className={missed.length ? "game-secondary" : "game-primary"} onClick={() => start(run.kind)}><Play size={17} />New round</button><button type="button" className="game-secondary" onClick={close}>Change activity</button></div>
    </section></div>;
  }

  if (run) return <GameSession key={run.id} run={run} onFinish={finish} onClose={close} />;

  return <div className="view games-view">
    <header className="view-heading"><div><p className="kicker">Practice</p><h1>Games &amp; activities</h1><p className="view-intro">Short rounds for word recognition, reading, listening, and kanji.</p></div></header>
    <section className="game-setup" aria-label="Game settings"><div className="game-pool-heading"><div><h2>Vocabulary</h2><p>{pool.length} distinct words available{source === "starter" ? " · beginner vocabulary from Units 1–7" : source === "course" ? " · including words you haven’t studied" : ""}.</p></div></div>
      <div className="game-chips" role="group" aria-label="Vocabulary source">{sources.map(({ value, label }) => <button type="button" key={value} aria-pressed={source === value} onClick={() => setSource(value)}>{label}<span>{pools[value].length}</span></button>)}</div>
      {!pool.length && <p className="game-pool-empty">{source === "priority" ? "Prioritize words in your Dictionary to use them here." : source === "due" ? "No words are due for review. Choose another vocabulary source." : "Your word collection is empty. Starter words are ready to play."}</p>}
      <div className="game-settings-row"><div role="group" aria-label="Words per round"><span>Words per round</span>{[10, 20].map(value => <button type="button" key={value} aria-pressed={count === value} onClick={() => setCount(value)}>{value}</button>)}</div><label><input type="checkbox" checked={stopwatch} onChange={event => setStopwatch(event.target.checked)} /><Timer size={16} />Show stopwatch</label><label><input type="checkbox" checked={readings} onChange={event => setReadings(event.target.checked)} />Show readings in pairs</label></div>
    </section>
    <div className="game-catalog">
      <article className="game-entry game-entry-pairs"><div className="game-entry-art pairs-art" aria-hidden="true"><i>山</i><i>mountain</i><span>↔</span></div><div className="game-entry-copy"><span className="game-entry-icon"><Layers3 size={19} />Word recognition</span><h2>Word pairs</h2><p>Match Japanese words to their meanings. Clear each board and keep a chain of correct matches.</p><div className="game-entry-meta"><span>2–4 minutes</span><span>Tap or use keyboard</span></div><button type="button" className="game-primary" disabled={pool.length < 2} onClick={() => start("pairs")}>Play word pairs <ArrowRight size={17} /></button></div></article>
      <article className="game-entry game-entry-listening"><div className="game-entry-art listening-art" aria-hidden="true"><Headphones size={66} strokeWidth={1.1} /><div><i /><i /><i /><i /><i /><i /><i /></div></div><div className="game-entry-copy"><span className="game-entry-icon"><Headphones size={19} />Sound recognition</span><h2>Listening</h2><p>Hear a word and choose its meaning. Replay at normal or slower speed, then retry the ones you missed.</p><div className="game-entry-meta"><span>2–4 minutes</span><span>Audio required</span></div><button type="button" className="game-primary" disabled={listeningCount < 1} onClick={() => start("listening")}>Play listening <ArrowRight size={17} /></button>{pool.length > 0 && listeningCount < 1 && <small className="game-entry-note">Needs at least four words with distinct meanings and readings.</small>}</div></article>
      <article className="game-entry game-entry-reading"><div className="game-entry-art reading-art" aria-hidden="true"><strong>学校</strong><div><i>が</i><i>っ</i><i>こ</i><i>う</i></div></div><div className="game-entry-copy"><span className="game-entry-icon"><BookOpen size={19} />Reading recall</span><h2>Kana builder</h2><p>See a word, then build its reading from kana tiles. Practice small sounds and long vowels at your own pace.</p><div className="game-entry-meta"><span>2–4 minutes</span><span>No audio needed</span></div><button type="button" className="game-primary" disabled={readingCount < 1} onClick={() => start("reading")}>Play kana builder <ArrowRight size={17} /></button>{readingCount < 1 && <small className="game-entry-note">Choose a pool with kanji words and readings of 2–8 tiles.</small>}</div></article>
      <article className="game-entry game-entry-kanji"><div className="game-entry-art kanji-art" aria-hidden="true"><span>木</span><i>林</i><small>森</small></div><div className="game-entry-copy"><span className="game-entry-icon"><Eye size={19} />Visual study</span><h2>Kanji study</h2><p>Explore 50 core characters through watercolor illustrations, meanings, and notes on their forms.</p><div className="game-entry-meta"><span>50 characters</span><span>Study &amp; practice</span></div><button type="button" className="game-primary" onClick={onOpenKanji}>Explore kanji <ArrowRight size={17} /></button></div></article>
    </div>
    <ActivityHistory state={state} />
    <details className="game-help"><summary>How these activities work</summary><p>Games use stand-alone words, so they can use a larger pool than the sentence builder. Similar meanings, identical readings, and alternate forms of the same dictionary entry are kept out of the same board or question.</p><p>Completed rounds count as practice. Answers shown with a hint count as words to retry. There is no time limit, and the stopwatch is optional.</p></details>
  </div>;
}

function ActivityHistory({ state }: { state: LearnerState }) {
  const [expanded, setExpanded] = useState(false);
  const { recent, best } = activityRecords(state.activityResults);
  if (!recent.length) return null;
  const names = { pairs: "Word pairs", listening: "Listening", reading: "Kana builder", kanji: "Kanji quiz" };
  const icons = { pairs: <Layers3 size={17} />, listening: <Headphones size={17} />, reading: <BookOpen size={17} />, kanji: <Eye size={17} /> };
  const allRounds = Math.max(recent.length, Object.values(state.activityDays ?? {}).reduce((sum, day) => sum + day.rounds, 0));
  const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  return <section className="game-history" aria-label="Activity results"><header><div><h2>Recent results</h2><p>{allRounds} round{allRounds === 1 ? "" : "s"} completed</p></div>{recent.length > 4 && <button type="button" className="game-secondary" onClick={() => setExpanded(value => !value)} aria-expanded={expanded}>{expanded ? "Show fewer" : "Show more"}</button>}</header>
    <div className="game-personal-bests" aria-label="Best recent accuracy">{best.map(result => <div key={result.kind}><span>{icons[result.kind]}{names[result.kind]}</span><strong>{Math.round(result.correct / result.total * 100)}%<small>{result.correct}/{result.total} correct</small></strong><p>Best recent accuracy</p></div>)}</div>
    <div className="game-history-list">{recent.slice(0, expanded ? 20 : 4).map(result => <div key={result.id}><span className="game-history-icon">{icons[result.kind]}</span><div><strong>{names[result.kind]}</strong><time dateTime={result.at}>{formatter.format(new Date(result.at))}</time></div><span className="game-history-score"><strong>{result.correct}/{result.total}</strong><small>first try</small></span><span className="game-history-percent">{Math.round(result.correct / result.total * 100)}%</span></div>)}</div>
    {expanded && recent.length > 20 && <p className="game-history-note">Showing your 20 most recent rounds.</p>}
  </section>;
}

async function pronounce(word: GameWord, callbacks: Parameters<typeof playWord>[1] = {}, rate = 1) {
  return playWord({ surface: word.surface, reading: word.reading, explain: word.meaning, wordId: word.id, dictionaryEntryId: word.dictionaryEntryId, audioText: word.audioText }, callbacks, { rate });
}

function useGameClock(paused: boolean) {
  const accumulated = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    const timer = setInterval(() => setElapsed(Math.floor((accumulated.current + Date.now() - start) / 1000)), 250);
    return () => { accumulated.current += Date.now() - start; clearInterval(timer); };
  }, [paused]);
  return elapsed;
}

function GameSession({ run, onFinish, onClose }: { run: GameRun; onFinish: (result: GameResult, skipped?: number) => void; onClose: () => void }) {
  const [paused, setPaused] = useState(false);
  const elapsed = useGameClock(paused);
  useEffect(() => {
    const hidden = () => { if (document.hidden) { stopAudio(); setPaused(true); } };
    document.addEventListener("visibilitychange", hidden);
    return () => { stopAudio(); document.removeEventListener("visibilitychange", hidden); };
  }, []);
  const finish = (correct: number, words: GameWord[], missed: string[], skipped = 0) => onFinish({ id: run.id, kind: run.kind, correct, total: words.length, wordIds: [...new Set(words.map(word => word.id))], missedWordIds: [...new Set(missed)], at: new Date().toISOString(), durationSeconds: elapsed }, skipped);
  return <div className={`view games-view game-session game-session-${run.kind}`}><header className="game-session-heading"><div><button type="button" className="game-back" onClick={onClose}><ArrowLeft size={16} />Exit activity</button><h1>{titles[run.kind]}</h1><p>{run.poolLabel}</p></div><div className="game-session-controls">{run.stopwatch && <span className="game-clock" aria-label="Elapsed time"><Timer size={16} />{gameDuration(elapsed)}</span>}<button type="button" className="game-secondary" aria-pressed={paused} onClick={() => { stopAudio(); setPaused(current => !current); }}>{paused ? <Play size={17} /> : <Pause size={17} />}{paused ? "Resume" : "Pause"}</button></div></header>
    {paused && <div className="game-paused" role="status"><Pause size={22} /><strong>Paused</strong><span>Resume when you’re ready.</span></div>}
    <div className={paused ? "game-play-area is-paused" : "game-play-area"} aria-hidden={paused} hidden={paused}>{run.kind === "pairs" ? <PairGame run={run} paused={paused} onFinish={finish} /> : run.kind === "reading" ? <ReadingGame run={run} paused={paused} onFinish={finish} /> : <ListeningGame run={run} paused={paused} onFinish={finish} />}</div>
  </div>;
}

function PairGame({ run, paused, onFinish }: { run: GameRun; paused: boolean; onFinish: (correct: number, words: GameWord[], missed: string[]) => void }) {
  const roundCount = Math.ceil(run.words.length / 5);
  const roundSize = Math.ceil(run.words.length / roundCount);
  const [round, setRound] = useState(0);
  const [matched, setMatched] = useState<string[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [selectedJapanese, setSelectedJapanese] = useState<string>();
  const [selectedMeaning, setSelectedMeaning] = useState<string>();
  const [chain, setChain] = useState(0);
  const [bestChain, setBestChain] = useState(0);
  const [showAnswers, setShowAnswers] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; word?: GameWord }>({ correct: true });
  const words = useMemo(() => run.words.slice(round * roundSize, (round + 1) * roundSize), [run, round, roundSize]);
  const japanese = useMemo(() => shuffleGameWords(words, run.seed + round * 51), [words, run.seed, round]);
  const meanings = useMemo(() => shuffleGameWords(words, run.seed + round * 93 + 718), [words, run.seed, round]);
  const roundDone = words.every(word => matched.includes(word.id));
  const pick = (side: "japanese" | "meaning", id: string) => {
    if (paused || matched.includes(id)) return;
    const jp = side === "japanese" ? (selectedJapanese === id ? undefined : id) : selectedJapanese;
    const en = side === "meaning" ? (selectedMeaning === id ? undefined : id) : selectedMeaning;
    setSelectedJapanese(jp); setSelectedMeaning(en);
    if (!jp || !en) return;
    if (jp === en) {
      const word = words.find(item => item.id === jp)!;
      setMatched(current => [...current, jp]);
      setChain(current => current + 1); setBestChain(current => Math.max(current, chain + 1));
      setSelectedJapanese(undefined); setSelectedMeaning(undefined);
      setFeedback({ correct: true, word });
      if (run.audio) void pronounce(word);
    } else {
      setMissed(current => [...new Set([...current, jp])]);
      setChain(0); setSelectedMeaning(undefined); setFeedback({ correct: false });
    }
  };
  const advance = () => {
    stopAudio();
    if (round + 1 === roundCount) { onFinish(run.words.length - missed.length, run.words, missed); return; }
    setRound(value => value + 1); setShowAnswers(false); setFeedback({ correct: true });
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (paused || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName)) return;
      const number = Number(event.key) - 1;
      const letter = "abcde".indexOf(event.key.toLowerCase());
      if (event.key === "Enter" && roundDone && !((event.target as HTMLElement)?.tagName === "BUTTON")) { event.preventDefault(); advance(); }
      else if (/^[1-5]$/.test(event.key) && japanese[number]) { event.preventDefault(); pick("japanese", japanese[number].id); }
      else if (letter >= 0 && meanings[letter]) { event.preventDefault(); pick("meaning", meanings[letter].id); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  });
  return <><div className="game-scorebar"><span>Board <strong>{round + 1} / {roundCount}</strong></span><span><strong>{matched.length} / {run.words.length}</strong> pairs</span><span>Chain <strong>{chain}</strong><small>best {bestChain}</small></span></div><div className="game-progress" role="progressbar" aria-label="Pairs matched" aria-valuenow={matched.length} aria-valuemin={0} aria-valuemax={run.words.length}><i style={{ width: `${matched.length / run.words.length * 100}%` }} /></div>
    <p className="game-instruction">Select a Japanese word and its English meaning.</p>
    <div className="pair-board"><div className="pair-column"><h2>Japanese <small>1–{words.length}</small></h2>{japanese.map((word, index) => <button type="button" key={word.id} disabled={matched.includes(word.id)} aria-pressed={selectedJapanese === word.id} aria-label={`Japanese ${word.surface}`} className={`pair-tile pair-tile-japanese ${matched.includes(word.id) ? "is-matched" : ""}`} onClick={() => pick("japanese", word.id)}><kbd>{index + 1}</kbd><span lang="ja"><strong>{word.surface}</strong>{run.readings && word.surface !== word.reading && <small>{word.reading}</small>}{showAnswers && !matched.includes(word.id) && <em lang="en">{word.meaning}</em>}</span>{matched.includes(word.id) && <Check size={16} />}</button>)}</div>
      <div className="pair-column"><h2>English <small>A–{"ABCDE"[words.length - 1]}</small></h2>{meanings.map((word, index) => <button type="button" key={word.id} disabled={matched.includes(word.id)} aria-pressed={selectedMeaning === word.id} aria-label={`Meaning ${word.meaning}`} className={`pair-tile pair-tile-meaning ${matched.includes(word.id) ? "is-matched" : ""}`} onClick={() => pick("meaning", word.id)}><kbd>{"ABCDE"[index]}</kbd><span>{word.meaning}</span>{matched.includes(word.id) && <Check size={16} />}</button>)}</div></div>
    <div className={`pair-feedback ${feedback.correct ? "" : "is-incorrect"}`} role="status">{feedback.word ? <><Check size={17} /><span lang="ja">{feedback.word.surface}</span><span>{feedback.word.meaning}</span></> : !feedback.correct ? <><X size={17} /><span>Not a match. Try another meaning.</span></> : <span>{showAnswers ? "Answers are shown. These words will be included in your retry list." : "Match all the pairs to clear this board."}</span>}</div>
    <div className="game-round-footer">{roundDone ? <button type="button" className="game-primary" onClick={advance}>{round + 1 === roundCount ? "See results" : "Next board"}<ArrowRight size={17} /></button> : <button type="button" className="game-secondary" disabled={showAnswers} onClick={() => { setShowAnswers(true); setMissed(current => [...new Set([...current, ...words.filter(word => !matched.includes(word.id)).map(word => word.id)])]); setChain(0); setFeedback({ correct: true }); }}><Eye size={16} />{showAnswers ? "Answers shown" : "Show answers"}</button>}<small>Keyboard: numbers for Japanese, letters for English.</small></div>
  </>;
}

function ReadingGame({ run, paused, onFinish }: { run: GameRun; paused: boolean; onFinish: (correct: number, words: GameWord[], missed: string[]) => void }) {
  const questions = useMemo(() => makeReadingQuestions(run.words, run.seed), [run]);
  const [index, setIndex] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const advance = (wasMissed: boolean) => {
    stopAudio();
    const nextMissed = wasMissed ? [...missed, questions[index].word.id] : missed;
    if (index + 1 === questions.length) {
      onFinish(questions.length - nextMissed.length, questions.map(question => question.word), nextMissed);
      return;
    }
    setMissed(nextMissed); setIndex(current => current + 1);
  };
  return <><div className="game-scorebar"><span>Word <strong>{index + 1} / {questions.length}</strong></span><span><strong>{index - missed.length}</strong> first try</span><span><BookOpen size={15} /> Build the reading</span></div>
    <div className="game-progress" role="progressbar" aria-label="Reading progress" aria-valuenow={index} aria-valuemin={0} aria-valuemax={questions.length}><i style={{ width: `${index / questions.length * 100}%` }} /></div>
    <ReadingTiles key={index} question={questions[index]} paused={paused} audio={run.audio} last={index + 1 === questions.length} onNext={advance} />
  </>;
}

function ReadingTiles({ question, paused, audio, last, onNext }: { question: ReadingQuestion; paused: boolean; audio: boolean; last: boolean; onNext: (missed: boolean) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const [missed, setMissed] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState("");
  const advanced = useRef(false);
  const reading = selected.map(index => question.tiles[index]).join("");
  const choose = (tile: number) => {
    if (paused || solved || selected.includes(tile)) return;
    setSelected(current => [...current, tile]); setFeedback("");
  };
  const check = () => {
    if (paused || solved || selected.length !== question.tiles.length) return;
    if (reading !== question.reading) { setMissed(true); setFeedback("Not quite. Reorder the tiles and try again."); return; }
    setSolved(true); setFeedback(missed ? "Correct. Keep this word in your retry list." : "Correct on the first try.");
    if (audio) void pronounce(question.word);
  };
  const reveal = () => {
    if (paused || solved) return;
    setMissed(true); setSolved(true); setFeedback("Reading revealed. Added to your retry list.");
    if (audio) void pronounce(question.word);
  };
  const next = () => {
    if (paused || !solved || advanced.current) return;
    advanced.current = true; onNext(missed);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (paused || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(target?.tagName) || target?.isContentEditable) return;
      if (/^[1-8]$/.test(event.key) && question.tiles[Number(event.key) - 1]) { event.preventDefault(); choose(Number(event.key) - 1); }
      else if (event.key === "Backspace" && !solved) { event.preventDefault(); setSelected(current => current.slice(0, -1)); setFeedback(""); }
      else if (event.key === "Enter" && target?.tagName !== "BUTTON") { event.preventDefault(); if (solved) next(); else check(); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  });
  return <section className="reading-round" aria-label="Build the kana reading">
    <div className="reading-prompt"><p className="kicker">How do you read this word?</p><h2 lang="ja">{question.word.surface}</h2><p>{question.word.meaning}</p></div>
    {!solved ? <>
      <p className="game-instruction">Tap the kana tiles in order, then check your reading.</p>
      <div className="reading-answer" role="group" aria-label="Your reading">{selected.map((tile, position) => <button type="button" key={tile} lang="ja" aria-label={`Remove ${question.tiles[tile]} at position ${position + 1}`} onClick={() => { setSelected(current => current.filter(index => index !== tile)); setFeedback(""); }}>{question.tiles[tile]}</button>)}{Array.from({ length: question.tiles.length - selected.length }, (_, index) => <span key={`empty-${index}`} aria-hidden="true" />)}</div>
      <div className="reading-bank" role="group" aria-label="Available kana tiles">{question.tiles.map((tile, index) => <button type="button" key={index} disabled={selected.includes(index)} aria-label={`Tile ${index + 1}: ${tile}`} onClick={() => choose(index)}><kbd>{index + 1}</kbd><span lang="ja">{tile}</span></button>)}</div>
      <div className="reading-tools"><button type="button" className="game-secondary" disabled={!selected.length} onClick={() => { setSelected(current => current.slice(0, -1)); setFeedback(""); }}><Delete size={16} />Undo</button><button type="button" className="game-secondary" disabled={!selected.length} onClick={() => { setSelected([]); setFeedback(""); }}>Clear</button><button type="button" className="game-secondary" onClick={reveal}><Eye size={16} />Show reading</button></div>
    </> : <div className="reading-solution"><span lang="ja">{question.reading}</span><button type="button" className="game-secondary" onClick={() => void pronounce(question.word)} aria-label={`Hear ${question.word.surface}`}><Volume2 size={18} />Hear word</button></div>}
    <p className={`reading-feedback ${feedback.startsWith("Not quite") ? "is-incorrect" : ""}`} role="status">{feedback || "Your first attempt counts toward your score. Revealing a reading adds it to your retry list."}</p>
    <div className="reading-submit">{solved ? <button type="button" className="game-primary" onClick={next}>{last ? "See results" : "Next word"}<ArrowRight size={17} /></button> : <button type="button" className="game-primary" disabled={selected.length !== question.tiles.length} onClick={check}>Check reading <Check size={17} /></button>}</div>
    <p className="game-keyboard-note">1–8 to choose a tile · Backspace to undo · Enter to check or continue</p>
  </section>;
}

function ListeningGame({ run, paused, onFinish }: { run: GameRun; paused: boolean; onFinish: (correct: number, words: GameWord[], missed: string[], skipped: number) => void }) {
  const questions = useMemo(() => makeListeningQuestions(run.words, run.pool, run.seed), [run]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string>();
  const [answered, setAnswered] = useState<GameWord[]>([]);
  const [missed, setMissed] = useState<string[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [audio, setAudio] = useState<"idle" | "loading" | "playing" | "unavailable">("idle");
  const [heard, setHeard] = useState(false);
  const [slow, setSlow] = useState(false);
  const request = useRef(0);
  const question: ListeningQuestion = questions[index];
  const play = (rate = slow ? .8 : 1) => {
    if (paused) return;
    const token = ++request.current;
    void pronounce(question.word, {
      onLoading: () => { if (token === request.current) setAudio("loading"); },
      onPlaying: () => { if (token === request.current) { setAudio("playing"); setHeard(true); } },
      onEnded: () => { if (token === request.current) setAudio("idle"); },
      onStopped: () => { if (token === request.current) setAudio("idle"); },
      onUnavailable: () => { if (token === request.current) setAudio("unavailable"); },
    }, rate);
  };
  useEffect(() => { setHeard(false); play(); return () => { request.current += 1; stopAudio(); }; }, [index]);
  const choose = (id: string) => {
    if (paused || answer || !heard) return;
    stopAudio(); setAnswer(id); setAnswered(current => [...current, question.word]);
    if (id !== question.word.id) setMissed(current => [...current, question.word.id]);
  };
  const advance = (skip = false) => {
    stopAudio();
    if (skip) setSkipped(current => current + 1);
    if (index + 1 === questions.length) { onFinish(answered.length - missed.length, answered, missed, skipped + Number(skip)); return; }
    setAnswer(undefined); setIndex(current => current + 1);
  };
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (paused || event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test((event.target as HTMLElement)?.tagName)) return;
      if (event.code === "Space") { event.preventDefault(); play(); }
      else if (/^[1-4]$/.test(event.key)) { event.preventDefault(); choose(question.choices[Number(event.key) - 1].id); }
      else if (event.key === "Enter" && answer && (event.target as HTMLElement)?.tagName !== "BUTTON") { event.preventDefault(); advance(); }
    };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  });
  return <><div className="game-scorebar"><span>Word <strong>{index + 1} / {questions.length}</strong></span><span><strong>{answered.length - missed.length}</strong> correct</span><span><Headphones size={15} /> Listen → choose</span></div><div className="game-progress" role="progressbar" aria-label="Listening progress" aria-valuenow={index} aria-valuemin={0} aria-valuemax={questions.length}><i style={{ width: `${index / questions.length * 100}%` }} /></div>
    <section className="listening-prompt"><button type="button" className={`listening-play ${audio === "playing" ? "is-playing" : ""}`} onClick={() => play()} aria-label={audio === "loading" ? "Audio loading. Tap to retry" : "Play word"}><Volume2 size={40} strokeWidth={1.4} /><span>{audio === "loading" ? "Loading…" : audio === "playing" ? "Playing…" : "Play word"}</span></button><div className="listening-speed" role="group" aria-label="Playback speed"><button type="button" aria-pressed={!slow} onClick={() => { setSlow(false); play(1); }}>Normal</button><button type="button" aria-pressed={slow} onClick={() => { setSlow(true); play(.8); }}>Slower</button></div><p>{heard ? "Choose the meaning of the word you heard." : "Play the audio, then choose its meaning."}</p></section>
    {audio === "unavailable" && <div className="game-audio-error" role="status"><p>{answer ? "The audio could not replay. Your answer has been recorded." : "The audio could not play. Try replaying, or skip this question without affecting your score."}</p>{!answer && <button type="button" className="game-secondary" onClick={() => advance(true)}>Skip unavailable audio <ArrowRight size={15} /></button>}</div>}
    <div className="listening-choices" role="group" aria-label="Choose the word meaning">{question.choices.map((word, choice) => <button type="button" key={word.id} disabled={!heard || !!answer} className={`${answer && word.id === question.word.id ? "is-correct" : ""} ${answer === word.id && word.id !== question.word.id ? "is-incorrect" : ""}`} onClick={() => choose(word.id)}><kbd>{choice + 1}</kbd><span>{word.meaning}</span>{answer && word.id === question.word.id ? <Check size={20} /> : answer === word.id ? <X size={20} /> : null}</button>)}</div>
    {answer && <div className={`listening-feedback ${answer === question.word.id ? "is-correct" : "is-incorrect"}`} role="status"><div>{answer === question.word.id ? <Check size={22} /> : <RotateCcw size={22} />}<span><strong>{answer === question.word.id ? "Correct" : "Added to your retry list"}</strong><span lang="ja">{question.word.surface} <small>{question.word.reading}</small></span><span>{question.word.meaning}</span></span></div><button type="button" className="game-primary" onClick={() => advance()}>{index + 1 === questions.length ? "See results" : "Next word"}<ArrowRight size={17} /></button></div>}
    <p className="game-keyboard-note">Space to replay · 1–4 to answer · Enter to continue</p>
  </>;
}
