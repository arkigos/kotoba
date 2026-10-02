import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Copy, Download, List, Play, Search, Square, X, Leaf } from "lucide-react";
import { cleanUnitTitle, levelForUnit, unitNumberLabel, wordById } from "./curriculum";
import { resolveSessionCard } from "./generated";
import { lessonPresets } from "./engine";
import { playCard, stopAudio } from "./audio";
import { a1MetadataForWord } from "../../../packages/dictionary/a1";
import { learningGrammar } from "../../../packages/learning-engine/learning-grammar";
import type { ActiveSession, CurriculumUnit, LearnerState, LessonMode, PracticeCard, ToastMessage, WordEntry } from "./types";
import "./lesson-explorer.css";
import { LessonWordAudit } from "./LessonWordAudit";

type Props = {
  unit?: CurriculumUnit;
  session?: ActiveSession;
  state: LearnerState;
  onBack: () => void;
  onStart: (index: number, mode: Exclude<LessonMode, "mixed">) => void;
  onSave: (card: PracticeCard) => void;
  onToast: (message: Omit<ToastMessage, "id">) => void;
  onOpenKanji?: () => void;
};

const canonicalWordId = (id: string) => a1MetadataForWord(id)?.coreWordId ?? id;

export function LessonExplorer({ unit, session, state, onBack, onStart, onSave, onToast, onOpenKanji }: Props) {
  const grammar = learningGrammar.find(row => row.id === session?.grammarLessonId);
  const personalLesson = !unit && (session?.source === "topic" || session?.source === "vocabulary");
  const hasTargets = personalLesson && !!session?.targetWordIds?.length;
  const itemName = personalLesson || unit?.kind === "kanji" || unit?.kind === "kana" ? "card" : "sentence";
  const cards = useMemo(() => unit?.cards ?? session?.items.map((_, index) => resolveSessionCard(session, index)) ?? [], [unit, session]);
  const [query, setQuery] = useState("");
  const [savedOnly, setSavedOnly] = useState(false);
  const [readings, setReadings] = useState(false);
  const [english, setEnglish] = useState(true);
  const [changes, setChanges] = useState(false);
  const [word, setWord] = useState<string>();
  const [playing, setPlaying] = useState<number>();
  const [copied, setCopied] = useState<string>();
  const [mode, setMode] = useState<Exclude<LessonMode, "mixed">>(() => session?.mode && session.mode !== "mixed" ? session.mode : state.settings.lessonMode);
  const matchingSession = unit && state.activeSession?.source !== "generated" && state.activeSession?.source !== "library" && state.activeSession?.unitId === unit.id ? state.activeSession : session;
  const savedPosition = matchingSession ? matchingSession.cursor < cards.length ? matchingSession.cursor : 0 : unit && state.completedUnits.includes(unit.id) ? 0 : state.unitProgress[String(unit?.id)]?.lastCardIndex ?? 0;
  const position = Math.min(savedPosition, Math.max(0, cards.length - 1));
  const title = cleanUnitTitle(unit?.title ?? session?.title ?? "Lesson");
  const savedCount = cards.filter(card => state.savedSentenceIds.includes(card.id)).length;
  const allWordIds = [...new Set(cards.flatMap(card => card.tokens.flatMap(token => token.wordId ? [token.wordId] : [])))];
  const wordIds = unit?.newWords.map(item => item.id) ?? (hasTargets ? session!.targetWordIds! : allWordIds);
  const resolveWord = (id: string): WordEntry | undefined => {
    const current = wordById(id);
    if (current) return current;
    // A materialized reference lesson can resume while its dictionary shard is offline.
    const token = cards.flatMap(card => card.tokens).find(token => token.wordId === id);
    return token ? { id, surface: token.surface, reading: token.reading, meaning: token.explain, function: "word" } : undefined;
  };
  const words = wordIds.map(resolveWord).filter(item => !!item);
  const targetIdentities = new Set(wordIds.map(canonicalWordId));
  const supportingWords = hasTargets ? [...new Map(allWordIds.filter(id => !targetIdentities.has(canonicalWordId(id))).map(id => [canonicalWordId(id), id])).values()].map(resolveWord).filter(item => !!item) : [];
  const appearances = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const card of cards) {
      for (const id of new Set(card.tokens.flatMap(token => token.wordId ? [canonicalWordId(token.wordId)] : []))) counts[id] = (counts[id] ?? 0) + 1;
    }
    return counts;
  }, [cards]);
  const wordAppearanceCount = (id: string) => session?.lessonPlan?.appearances[id] ?? appearances[canonicalWordId(id)] ?? 0;
  const filtered = cards.map((card, index) => ({ card, index })).filter(({ card, index }) => {
    const text = `${index + 1} ${card.line.join("")} ${card.tts.join("")} ${card.english}`.normalize("NFKC").toLowerCase();
    return text.includes(query.trim().normalize("NFKC").toLowerCase()) && (!savedOnly || state.savedSentenceIds.includes(card.id)) && (!word || card.tokens.some(token => token.wordId && (hasTargets ? canonicalWordId(token.wordId) === canonicalWordId(word) : token.wordId === word)));
  });

  useEffect(() => () => stopAudio(), []);

  const listen = (card: PracticeCard, index: number) => {
    if (playing === index) { stopAudio(); setPlaying(undefined); return; }
    void playCard(card, unit?.id ?? session?.items[index]?.unitId ?? session?.unitId, {
      onLoading: () => setPlaying(index),
      onStopped: () => setPlaying(undefined),
      onEnded: () => setPlaying(undefined),
      onUnavailable: () => { setPlaying(undefined); onToast({ tone: "warning", message: `Audio is unavailable for this ${itemName} on this device.` }); },
    });
  };
  const copy = async (card: PracticeCard) => {
    try {
      await navigator.clipboard.writeText(`${card.line.join("")}\n${card.english}`);
      setCopied(card.id);
      window.setTimeout(() => setCopied(undefined), 1800);
    } catch { onToast({ tone: "warning", message: "Copy is unavailable in this browser." }); }
  };
  const download = () => {
    const text = `${title}\n${unit?.grammarFocus ?? (personalLesson ? "Word and context practice" : "Sentence practice")}\n\n${filtered.map(({ card, index }) => `${index + 1}. ${card.line.join("")}\n${card.tts.join("")}\n${card.english}`).join("\n\n")}`;
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = `kotoba-${unit ? `unit-${unit.id}` : "lesson"}.txt`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const goToPosition = () => document.getElementById(`sentence-${position + 1}`)?.scrollIntoView({ behavior: state.settings.quietMode ? "auto" : "smooth", block: "center" });

  return <div className="view explorer-view">
    <button className="explorer-back" type="button" onClick={onBack}><ArrowLeft size={16} /> {unit ? "All lessons" : "Back to My lessons"}</button>
    <header className="explorer-hero">
      <div className="explorer-title"><p className="kicker">{unit ? `${levelForUnit(unit.id).code} · ${unitNumberLabel(unit)}` : session?.source === "generated" ? "Built lesson" : session?.source === "topic" ? "Topic lesson" : session?.source === "vocabulary" ? "Word practice" : "Dictionary review"}</p><h1>{title}</h1><p>{unit?.grammarFocus ?? `Browse, listen, or start at any ${itemName}.`}</p><div className="explorer-facts"><span><List size={15} /> {cards.length} {itemName}s</span><span>{words.length} {hasTargets ? "target words" : unit ? "new words" : "words"}</span><span><Bookmark size={14} /> {savedCount} saved</span></div></div>
      <div className="explorer-launch"><button className="explorer-primary" type="button" onClick={() => onStart(position, mode)}><Play size={18} fill="currentColor" /> {position ? `Continue at ${itemName} ${position + 1}` : "Start lesson"}<ArrowRight size={17} /></button><button className="explorer-restart" type="button" onClick={() => onStart(0, mode)}>Start from the beginning</button></div>
    </header>
    {session?.lessonNotes?.map(note => <aside className="starter-note" key={note.start}><strong>From card {note.start}: {note.title}</strong><p lang="ja">{note.pattern}</p><p>{note.explanation}</p></aside>)}
    {grammar && <aside className="explorer-vocabulary" aria-label="Grammar pattern"><h2>{grammar.title}</h2><p lang="ja">{grammar.pattern}</p><p>{grammar.explanation}</p></aside>}
    {unit?.id === 103 && onOpenKanji && <button type="button" className="explorer-kanji-link" onClick={onOpenKanji}><Leaf size={22} /><span><strong>Illustrated kanji study</strong><small>Watercolor illustrations, meanings, origins, and quizzes for these 50 characters.</small></span><ArrowRight size={17} /></button>}
    <div className="explorer-modes" role="group" aria-label="Practice mode">{(Object.keys(lessonPresets) as Exclude<LessonMode, "mixed">[]).map(key => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key)}><strong>{lessonPresets[key].label}</strong><small>{lessonPresets[key].detail}</small></button>)}</div>
    {!!words.length && <details className="explorer-vocabulary" aria-label={hasTargets ? "Target vocabulary" : "Lesson vocabulary"}><summary>{hasTargets ? "Target words" : unit ? "Lesson vocabulary" : "Words in this sequence"}<span>{words.length} words · select one to find its {itemName}s</span></summary><div className="explorer-word-chips">{words.map(item => <button key={item.id} type="button" aria-pressed={word === item.id} onClick={() => setWord(current => current === item.id ? undefined : item.id)}><strong lang="ja">{item.surface}</strong><small>{item.meaning}</small>{hasTargets && <small>{wordAppearanceCount(item.id)} {wordAppearanceCount(item.id) === 1 ? "appearance" : "appearances"}</small>}</button>)}</div></details>}
    {!!supportingWords.length && <details className="explorer-vocabulary" aria-label="Supporting vocabulary"><summary>Supporting words and grammar<span>{supportingWords.length} supporting items · separate from your targets</span></summary><div className="explorer-word-chips">{supportingWords.map(item => <button key={item.id} type="button" aria-pressed={word === item.id} onClick={() => setWord(current => current === item.id ? undefined : item.id)}><strong lang="ja">{item.surface}</strong><small>{item.meaning}</small></button>)}</div></details>}
    <LessonWordAudit cards={cards} session={session} />
    <section aria-label={`All lesson ${itemName}s`} className="explorer-sentences">
      <div className="explorer-toolbar">
        <label className="explorer-search"><Search size={17} /><input aria-label={`Search lesson ${itemName}s`} value={query} placeholder={`Search Japanese, English, or ${itemName} number`} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label={`Clear ${itemName} search`} onClick={() => setQuery("")}><X size={16} /></button>}</label>
        <div className="explorer-options" role="group" aria-label={itemName === "card" ? "Card display" : "Sentence display"}><button type="button" aria-pressed={english} onClick={() => setEnglish(value => !value)}>English</button><button type="button" aria-pressed={readings} onClick={() => setReadings(value => !value)}>Readings</button><button type="button" aria-pressed={changes} onClick={() => setChanges(value => !value)}>Show changes</button><button type="button" aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Bookmark size={13} /> Saved</button></div>
      </div>
      <div className="explorer-list-heading"><span>{filtered.length === cards.length ? `Every ${itemName}, in order` : `${filtered.length} of ${cards.length} ${itemName}s`}{word && <button type="button" onClick={() => setWord(undefined)}>{resolveWord(word)?.surface}<X size={12} /></button>}</span><div>{!query && !savedOnly && !word && <button type="button" onClick={goToPosition}>Your place <ArrowRight size={13} /></button>}<button type="button" onClick={download} disabled={!filtered.length} aria-label={`Download these ${itemName}s`}><Download size={15} /><span>Export</span></button></div></div>
      {!filtered.length && <div className="explorer-empty"><Search size={25} /><h2>No matching {itemName}s</h2><p>Try another word, or show the full lesson.</p><button type="button" onClick={() => { setQuery(""); setSavedOnly(false); setWord(undefined); }}>Show all {itemName}s</button></div>}
      <ol className="explorer-list">{filtered.map(({ card, index }) => <li key={`${card.id}-${index}`} id={`sentence-${index + 1}`} className={index === position ? "is-position" : ""}>
        <span className="explorer-number">{String(index + 1).padStart(2, "0")}{index === position && <i title="Your saved position" />}</span>
        <button type="button" className="explorer-sentence" aria-label={`Practice from ${itemName} ${index + 1}: ${card.english}`} onClick={() => onStart(index, mode)}>
          {session?.items[index]?.section && session.items[index].section !== "lesson" && <span className="explorer-english">{session.items[index].section === "due-review" ? "Scheduled review" : "Recent practice"}{session.items[index].reviewSource?.title ? ` · ${session.items[index].reviewSource!.title}` : ""}</span>}
          <span className="explorer-japanese" lang="ja">{card.tokens.map((token, tokenIndex) => <span key={tokenIndex} className={changes && index > 0 && (token.surface !== cards[index - 1].tokens[tokenIndex]?.surface || token.reading !== cards[index - 1].tokens[tokenIndex]?.reading) ? "changed-word" : undefined}>{token.surface}</span>)}</span>
          {readings && <span className="explorer-reading" lang="ja">{card.tts.join(" ")}</span>}
          {english && <span className="explorer-english">{card.english}</span>}
        </button>
        <div className="explorer-row-actions"><button type="button" className={playing === index ? "is-playing" : ""} aria-label={`${playing === index ? "Stop" : "Play"} ${itemName} ${index + 1}`} onClick={() => listen(card, index)}>{playing === index ? <Square size={16} fill="currentColor" /> : <Play size={17} />}</button><button type="button" aria-pressed={state.savedSentenceIds.includes(card.id)} aria-label={`${state.savedSentenceIds.includes(card.id) ? "Unsave" : "Save"} ${itemName} ${index + 1}`} onClick={() => onSave(card)}><Bookmark size={17} fill={state.savedSentenceIds.includes(card.id) ? "currentColor" : "none"} /></button><button type="button" aria-label={`Copy ${itemName} ${index + 1}`} onClick={() => void copy(card)}>{copied === card.id ? <Check size={17} /> : <Copy size={16} />}</button></div>
      </li>)}</ol>
    </section>
    <p className="explorer-footnote">Select a {itemName} to practice from that point. Your place is saved as you go.</p>
  </div>;
}
