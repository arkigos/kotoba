import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookmarkPlus, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { a1CoreWordIdsForTopic, a1Topics } from "../../../packages/dictionary/a1";
import { dictionaryWord } from "../../../packages/dictionary";
import { buildTopicLesson, DEFAULT_TOPIC_WORDS, extraTopicWordIds, MAX_TOPIC_CARDS, MAX_TOPIC_WORDS, selectTopicWords, type TopicLesson } from "./topic-course";
import type { ActiveSession, LearnerState } from "./types";
import { TopicBoundaryCue } from "./TopicBoundaryCue";

export function TopicLessonDialog({ state, topicId, extras, onClose, onStart, onSave }: {
  state: LearnerState; topicId: string; extras: boolean; onClose: () => void;
  onStart: (session: ActiveSession) => void; onSave?: (session: ActiveSession) => void;
}) {
  const topic = a1Topics.find(item => item.id === topicId)!;
  const pool = extras ? extraTopicWordIds(topicId) : a1CoreWordIdsForTopic(topicId);
  const [wordIds, setWordIds] = useState(() => selectTopicWords(state, topicId, extras).wordIds);
  const [automaticWords, setAutomaticWords] = useState(true);
  const [wordCount, setWordCount] = useState(String(Math.min(DEFAULT_TOPIC_WORDS, pool.length)));
  const [cardCount, setCardCount] = useState("");
  const [customCardCount, setCustomCardCount] = useState(false);
  const [title, setTitle] = useState(`${topic.title} · ${extras ? "Explore more" : "A1"}`);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<TopicLesson>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(true);
  const [retry, setRetry] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const validWordCount = Number.isInteger(Number(wordCount)) && Number(wordCount) >= 1 && Number(wordCount) <= Math.min(MAX_TOPIC_WORDS, pool.length);
  const validCardCount = !customCardCount || (Number.isInteger(Number(cardCount)) && Number(cardCount) >= 1 && Number(cardCount) <= MAX_TOPIC_CARDS);
  const displayedCardCount = customCardCount ? cardCount : String(preview?.session.items.length ?? MAX_TOPIC_CARDS);
  const explicitWordIds = automaticWords ? undefined : wordIds;
  useEffect(() => { dialog.current?.showModal?.(); }, []);
  useEffect(() => {
    let cancelled = false;
    setPreview(undefined); setBusy(true); setError("");
    if (!validWordCount) {
      setError(`Choose between 1 and ${Math.min(MAX_TOPIC_WORDS, pool.length)} words.`); setBusy(false); return;
    }
    if (!validCardCount) {
      setError(`Choose between 1 and ${MAX_TOPIC_CARDS} cards.`); setBusy(false); return;
    }
    void buildTopicLesson(state, topicId, extras, { ...(automaticWords ? { wordCount: Number(wordCount) } : { wordIds: explicitWordIds }), cardCount: customCardCount ? Number(cardCount) : undefined })
      .then(result => {
        if (!cancelled) {
          if (automaticWords && result.session.targetWordIds) setWordIds(result.session.targetWordIds);
          setPreview(result);
        }
      })
      .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : "This lesson could not be built. Please try again."); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [state, topicId, extras, automaticWords, explicitWordIds, wordCount, cardCount, customCardCount, validWordCount, validCardCount, retry]);

  const changeWords = (ids: string[]) => {
    setAutomaticWords(false); setWordIds(ids); setWordCount(String(ids.length));
  };
  const changeWordCount = (value: string) => {
    setWordCount(value); setAutomaticWords(true);
    const count = Number(value);
    if (Number.isInteger(count) && count >= 1 && count <= Math.min(MAX_TOPIC_WORDS, pool.length)) setWordIds(selectTopicWords(state, topicId, extras, Date.now(), count).wordIds);
  };
  const finish = (callback: (session: ActiveSession) => void) => {
    if (!preview || busy || error) return;
    callback({ ...preview.session, title: title.trim() || preview.session.title });
  };
  const counts = Object.values(preview?.appearances ?? {});
  const minimum = Math.min(...counts), maximum = Math.max(...counts);
  const visiblePool = pool.filter(id => { const word = dictionaryWord(id)!; return `${word.surface} ${word.reading} ${word.meaning}`.toLowerCase().includes(query.trim().toLowerCase()); });

  return <dialog ref={dialog} open={typeof HTMLDialogElement.prototype.showModal !== "function" || undefined} className="topic-preview compact-topic-preview" aria-labelledby="topic-preview-title" onCancel={event => { event.preventDefault(); onClose(); }}>
    <header><div><p className="kicker">Your lesson</p><h2 id="topic-preview-title">{topic.title}</h2></div><button type="button" className="session-icon" aria-label="Close topic preview" onClick={onClose}><X size={22} /></button></header>
    <div className="topic-preview-body"><div className="topic-lesson-controls">
      <label>Words<input aria-label="Words to practice" type="number" min={1} max={Math.min(MAX_TOPIC_WORDS, pool.length)} value={wordCount} onChange={event => changeWordCount(event.target.value)} /></label>
      <label>Card limit<div className="topic-card-input"><input aria-label="Cards in this lesson" type="number" min={1} max={MAX_TOPIC_CARDS} value={displayedCardCount} onChange={event => { setCustomCardCount(true); setCardCount(event.target.value); }} />{customCardCount && <button type="button" aria-label="Use recommended size" title="Use recommended size" onClick={() => setCustomCardCount(false)}><RotateCcw size={15} /></button>}</div></label>
    </div>
    <div className="topic-selected-words" aria-label="Selected words">{wordIds.map(id => { const word = dictionaryWord(id)!; return <div key={id} title={`${word.surface} · ${word.meaning}`}><strong lang="ja">{word.surface}</strong><span>{word.meaning}</span></div>; })}</div>
    {busy && <p className="topic-build-status" role="status">Preparing…</p>}
    {error && <p className="topic-builder-error" role="alert">{error} {validWordCount && validCardCount && <button type="button" className="text-button" onClick={() => setRetry(value => value + 1)}>Try again</button>}</p>}
    {preview && <p className="topic-build-status">{preview.newWordIds.length} new words · {preview.session.lessonPlan?.sections?.lesson ?? 0} lesson cards · {preview.session.lessonPlan?.sections?.dueReview ?? 0} due review · {preview.session.lessonPlan?.sections?.recentReview ?? 0} recent review</p>}
    <details className="topic-word-picker"><summary>Edit words <span>{wordIds.length} / {pool.length}</span></summary><input type="search" aria-label="Find words in this topic" placeholder="Find a word" value={query} onChange={event => setQuery(event.target.value)} /><div>{visiblePool.map(id => { const word = dictionaryWord(id)!; return <label key={id}><input type="checkbox" checked={wordIds.includes(id)} disabled={!wordIds.includes(id) && wordIds.length >= MAX_TOPIC_WORDS} onChange={() => changeWords(wordIds.includes(id) ? wordIds.filter(value => value !== id) : [...wordIds, id])} /><strong lang="ja">{word.surface}</strong><span>{word.meaning}</span></label>; })}</div>{!visiblePool.length && <p>No matches</p>}</details>
    <details className="topic-options"><summary><SlidersHorizontal size={15} />Lesson options</summary>
      <label className="topic-title-field">Lesson name<input value={title} maxLength={100} onChange={event => setTitle(event.target.value)} /></label>
      {preview && <><p className="topic-build-status">{minimum === maximum ? minimum : `${minimum}–${maximum}`} appearances per word · {preview.contextCount} cards in context</p>
        <details><summary>Preview {preview.session.items.length} cards</summary><ol className="topic-preview-cards">{preview.session.savedCards?.map((card, index) => <li key={`${card.id}-${index}`}><TopicBoundaryCue session={preview.session} index={index} />{preview.session.items[index].section !== "lesson" && <small>{preview.session.items[index].section === "due-review" ? "Scheduled review" : "Recent practice"} · {preview.session.items[index].reviewSource?.title}</small>}<span lang="ja">{card.line.join("")}</span><small>{card.english}</small></li>)}</ol></details>
      </>}
    </details>
    </div><footer className="topic-builder-actions">{onSave && <button className="build-entry" type="button" aria-label="Save for later" disabled={!preview || busy || !!error} onClick={() => finish(onSave)}><BookmarkPlus size={17} />Save</button>}<button type="button" className="topic-launch" aria-label={`Start ${preview?.session.items.length ?? displayedCardCount}-card lesson`} disabled={!preview || busy || !!error} onClick={() => finish(onStart)}>Start lesson <ArrowRight size={17} /></button></footer>
  </dialog>;
}
