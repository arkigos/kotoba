import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, BookmarkPlus, Check, ChevronDown, Coffee, MapPin, Plus, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { courseDictionaryWords, dictionaryWord, loadDictionaryEntry, loadDictionaryIndex, searchDictionary, type SearchRow } from "../../../packages/dictionary";
import { buildCustomLesson, MAX_CUSTOM_CARDS, MAX_CUSTOM_WORDS, type CustomLesson } from "./custom-lesson";
import { isPrioritized } from "./review";
import type { ActiveSession, LearnerState } from "./types";
import "./custom-lesson-builder.css";

type SearchChoice = { id: string; surface: string; reading: string; meaning: string };

export function CustomLessonBuilder({ state, initialWordIds, onStart, onSave, onBack }: {
  state: LearnerState; initialWordIds?: string[]; onStart: (session: ActiveSession) => void;
  onSave?: (session: ActiveSession) => void; onBack?: () => void;
}) {
  const priority = Object.values(state.wordHistory).filter(isPrioritized).map(word => word.wordId);
  const initialKey = initialWordIds === undefined ? undefined : JSON.stringify(initialWordIds);
  const [wordIds, setWordIds] = useState(() => [...new Set(initialWordIds ?? priority.slice(0, 12))]);
  const [query, setQuery] = useState("");
  const term = useDeferredValue(query.trim());
  const [index, setIndex] = useState<SearchRow[]>();
  const [searchError, setSearchError] = useState("");
  const [searchRetry, setSearchRetry] = useState(0);
  const [loadingIndex, setLoadingIndex] = useState(false);
  const [labels, setLabels] = useState<Record<string, SearchChoice>>({});
  const [cardCount, setCardCount] = useState("");
  const [customCount, setCustomCount] = useState(false);
  const [title, setTitle] = useState("My custom lesson");
  const [preview, setPreview] = useState<{ key: string; lesson: CustomLesson }>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [includeReview, setIncludeReview] = useState(true);
  const selectionKey = JSON.stringify(wordIds);
  const requestKey = JSON.stringify([wordIds, customCount ? cardCount : null, includeReview, retry]);
  const current = preview?.key === requestKey ? preview.lesson : undefined;
  const validSelection = wordIds.length > 0 && wordIds.length <= MAX_CUSTOM_WORDS;
  const validCount = !customCount || (Number.isInteger(Number(cardCount)) && Number(cardCount) >= 1 && Number(cardCount) <= MAX_CUSTOM_CARDS);
  const course = useMemo(() => courseDictionaryWords().sort((a, b) => Number(a.level === "Kana") - Number(b.level === "Kana")), []);
  const courseRows = useMemo<SearchRow[]>(() => course.map(word => [word.id, word.surface, word.reading, word.meaning]), [course]);

  useEffect(() => { if (initialKey !== undefined) setWordIds([...new Set(JSON.parse(initialKey) as string[])]); }, [initialKey]);
  useEffect(() => {
    const ids = [...new Set([...wordIds, ...priority.slice(0, 30)])];
    if (!ids.length) return;
    let cancelled = false;
    void Promise.all(ids.map(async id => {
      await loadDictionaryEntry(id, import.meta.env.BASE_URL);
      return dictionaryWord(id);
    })).then(words => {
      if (!cancelled) setLabels(currentLabels => ({ ...currentLabels, ...Object.fromEntries(words.filter(Boolean).map(word => [word!.id, word!])) }));
    }).catch(() => { /* The lesson preview reports an actionable selected-word error. */ });
    return () => { cancelled = true; };
  }, [selectionKey, priority.join("|")]);
  useEffect(() => {
    if (!term || index) return;
    let cancelled = false;
    setLoadingIndex(true); setSearchError("");
    void loadDictionaryIndex(import.meta.env.BASE_URL).then(rows => { if (!cancelled) setIndex(rows); })
      .catch(() => { if (!cancelled) setSearchError("The full dictionary could not load. Installed words are still available."); })
      .finally(() => { if (!cancelled) setLoadingIndex(false); });
    return () => { cancelled = true; };
  }, [Boolean(term), index, searchRetry]);
  useEffect(() => {
    let cancelled = false;
    setPreview(undefined); setError(""); setBusy(false);
    if (!wordIds.length) return;
    if (!validSelection) { setError(`Choose up to ${MAX_CUSTOM_WORDS} words for one lesson. Remove a few words to continue.`); return; }
    if (!validCount) { setError(`Choose between 1 and ${MAX_CUSTOM_CARDS} cards.`); return; }
    setBusy(true);
    void buildCustomLesson(state, wordIds, { cardCount: customCount ? Number(cardCount) : undefined, includeReview })
      .then(lesson => { if (!cancelled) setPreview({ key: requestKey, lesson }); })
      .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : "This lesson could not load. Please try again."); })
      .finally(() => { if (!cancelled) setBusy(false); });
    return () => { cancelled = true; };
  }, [state, requestKey, validSelection, validCount]);

  const choices = useMemo(() => {
    if (!term) return [];
    const seen = new Set<string>();
    const local: SearchChoice[] = [];
    for (const row of searchDictionary(courseRows, term, 40)) {
      const word = dictionaryWord(row[0])!;
      if (seen.has(word.dictionaryEntryId)) continue;
      seen.add(word.dictionaryEntryId); local.push(word);
    }
    const reference = searchDictionary(index ?? [], term, 40).filter(row => !seen.has(row[0]))
      .map(row => ({ id: row[0], surface: row[1], reading: row[2], meaning: row[3] }));
    return [...local, ...reference].slice(0, 10);
  }, [term, index, courseRows]);
  const addWord = (choice: SearchChoice) => {
    if (wordIds.includes(choice.id) || wordIds.length >= MAX_CUSTOM_WORDS) return;
    setLabels(currentLabels => ({ ...currentLabels, [choice.id]: choice }));
    setWordIds(currentIds => currentIds.includes(choice.id) ? currentIds : [...currentIds, choice.id]);
  };
  const labelFor = (id: string) => dictionaryWord(id) ?? labels[id];
  const finish = (callback: (session: ActiveSession) => void) => {
    if (!current || busy || error) return;
    callback({ ...current.session, title: title.trim() || "My custom lesson" });
  };
  const shownCount = customCount ? cardCount : current ? String(current.session.items.length) : "";
  const suggested = priority.filter(id => !wordIds.includes(id)).slice(0, 8);

  return <section className="custom-lesson" aria-label="Custom lesson">
    <div className="custom-lesson-intro">{onBack && <button type="button" className="custom-back" aria-label="Back to topics" onClick={onBack}><ArrowLeft size={18} /></button>}<p>Choose words for your next conversation.</p><span>{wordIds.length}/{MAX_CUSTOM_WORDS}</span></div>
    <label className="custom-search"><Search size={19} /><input aria-label="Find words for your lesson" type="search" placeholder="Find a word in Japanese or English" value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" aria-label="Clear word search" onClick={() => setQuery("")}><X size={17} /></button>}</label>
    {term && <div className="custom-results" aria-label="Word search results" aria-busy={term !== query.trim()}>{choices.map(choice => {
      const selected = wordIds.includes(choice.id);
      return <button type="button" key={choice.id} aria-label={`${selected ? "Selected" : "Add"} ${choice.surface}`} disabled={selected || wordIds.length >= MAX_CUSTOM_WORDS} onClick={() => addWord(choice)}><span lang="ja"><strong>{choice.surface}</strong><small>{choice.reading}</small></span><span className="custom-result-meaning">{choice.meaning}</span>{selected ? <Check size={17} /> : <Plus size={17} />}</button>;
    })}{loadingIndex && <p role="status">Searching the full dictionary…</p>}{!loadingIndex && !choices.length && <p>No words found. Try another reading or meaning.</p>}</div>}
    {searchError && term && <p className="custom-search-error">{searchError} <button type="button" onClick={() => setSearchRetry(value => value + 1)}>Retry</button></p>}
    {!wordIds.length && !term && <div className="custom-starter-tiles" aria-label="Word ideas">{[{ id: "koohii", Icon: Coffee, tone: "coral" }, { id: "hon", Icon: BookOpen, tone: "teal" }, { id: "eki", Icon: MapPin, tone: "violet" }].map(({ id, Icon, tone }) => { const word = dictionaryWord(id)!; return <button type="button" key={id} className={`custom-starter-tile tone-${tone}`} aria-label={`Add ${word.surface}`} onClick={() => addWord(word)}><span className="custom-starter-art" aria-hidden="true"><Icon size={31} strokeWidth={1.2} /></span><strong lang="ja">{word.surface}</strong><small>{word.meaning}</small><Plus size={13} /></button>; })}</div>}
    <div className="custom-selected" aria-label="Selected words">{wordIds.map(id => { const word = labelFor(id); return <button type="button" key={id} aria-label={`Remove ${word?.surface ?? id}`} title={word?.meaning} onClick={() => setWordIds(currentIds => currentIds.filter(value => value !== id))}><span lang="ja">{word?.surface ?? "Loading…"}</span><X size={14} /></button>; })}</div>
    <label><input type="checkbox" checked={includeReview} onChange={event => setIncludeReview(event.target.checked)} />Include scheduled and recent review cards</label>
    {!!current?.session.lessonPlan?.reviewWordIds.filter(id => !wordIds.includes(id)).length && <p aria-label="Added review words">Review: {current.session.lessonPlan.reviewWordIds.filter(id => !wordIds.includes(id)).map(id => dictionaryWord(id)?.surface ?? id).join("、")}</p>}
    {!!suggested.length && <div className="custom-priority"><span><Star size={14} />Priority</span>{suggested.map(id => { const word = labelFor(id); return word && <button type="button" key={id} disabled={wordIds.length >= MAX_CUSTOM_WORDS} onClick={() => addWord(word)}><span lang="ja">{word.surface}</span><Plus size={12} /></button>; })}</div>}
    <div className="custom-launch-row"><div className="custom-count"><label htmlFor="custom-card-count">Card limit<input id="custom-card-count" type="number" min={1} max={MAX_CUSTOM_CARDS} disabled={!wordIds.length} placeholder="—" value={shownCount} onChange={event => { setCustomCount(true); setCardCount(event.target.value); }} /></label>{customCount && <button type="button" onClick={() => setCustomCount(false)}>Use recommended</button>}</div><button type="button" className="custom-start" disabled={!current || busy || !!error} onClick={() => finish(onStart)}>Start lesson <ArrowRight size={18} /></button></div>
    <div className="custom-status" aria-live="polite">{busy && <p>Finding your examples…</p>}</div>
    {error && <p role="alert" className="custom-error">{error} {validSelection && validCount && <button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button>}</p>}
    <details className="custom-details"><summary><SlidersHorizontal size={16} />Lesson options <ChevronDown size={16} /></summary><div className="custom-details-body"><label>Lesson name<input value={title} maxLength={100} onChange={event => setTitle(event.target.value)} /></label>{current && <>
      <p>{current.session.lessonPlan?.sections?.lesson ?? current.contextCount} lesson cards · {current.session.lessonPlan?.sections?.dueReview ?? 0} due review · {current.session.lessonPlan?.sections?.recentReview ?? 0} recent review. No repeated sentences.</p>
      <div className="custom-coverage">{wordIds.map(id => <span key={id}><strong lang="ja">{labelFor(id)?.surface}</strong><small>{current.appearances[id]} cards</small></span>)}</div>
      <details className="custom-card-preview"><summary>Preview {current.session.items.length} cards</summary><ol>{current.session.savedCards?.map((card, index) => <li key={`${card.id}-${index}`}>{current.session.items[index].section !== "lesson" && <small>{current.session.items[index].section === "due-review" ? "Scheduled review" : "Recent practice"} · {current.session.items[index].reviewSource?.title}</small>}<span lang="ja">{card.line.join("")}</span><small>{card.english}</small></li>)}</ol></details>
    </>}{onSave && <button type="button" className="custom-save" disabled={!current || busy || !!error} onClick={() => finish(onSave)}><BookmarkPlus size={16} />Save for later</button>}</div></details>
  </section>;
}
