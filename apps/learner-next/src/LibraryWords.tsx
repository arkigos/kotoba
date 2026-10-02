import { curatedOwnedWordIds, curatedWordId } from "./curated-course";
import { useEffect, useRef, useState } from "react";
import { ArrowDownWideNarrow, ArrowRight, Bookmark, CheckSquare2, CirclePlay, Copy, Layers3, SlidersHorizontal, Star, Volume2, X } from "lucide-react";
import { reviewSourceUnitIds, wordById } from "./curriculum";
import { isPrioritized, reviewStatus } from "./review";
import { DictionaryEntryPanel } from "./DictionaryView";
import { playWord, stopAudio } from "./audio";
import type { LearnerState, LibraryReviewMode, LibraryReviewRequest, WordInteractionKind } from "./types";
import { metadataLabel, wordMetadata } from "./word-metadata";
import { cardExposureLabel } from "./word-exposure";
import "./library-words.css";

const reviewModes: { value: LibraryReviewMode; label: string }[] = [
  { value: "mixed", label: "Mixed" }, { value: "listening", label: "Listen" }, { value: "recall", label: "Recall" },
];
const filterNames = { all: "All words", due: "Due for review", prioritized: "Prioritized words", stale: "Not practiced in two weeks", saved: "Saved words" };
type WordFilter = keyof typeof filterNames;
type WordSort = "suggested" | "recent" | "reading";

function reviewWhen(status: ReturnType<typeof reviewStatus>) {
  if (status.due) return "Due for review";
  const days = Math.max(1, Math.ceil((status.dueAt - Date.now()) / 86_400_000));
  return `Review in ${days} day${days === 1 ? "" : "s"}`;
}

export function LibraryWords({ state, query, onPrioritize, onBookmark, onReview, onBuild, onPractice }: {
  state: LearnerState; query: string; onPrioritize: (id: string) => void; onBookmark: (id: string) => void;
  onReview: (request: LibraryReviewRequest) => void; onBuild: (words: string[]) => void;
  onPractice?: (wordIds: string[]) => void;
}) {
  const [filter, setFilter] = useState<WordFilter>("all");
  const [dictionaryId, setDictionaryId] = useState<string>();
  const [mode, setMode] = useState<LibraryReviewMode>("mixed");
  const [count, setCount] = useState(10);
  const [source, setSource] = useState("all");
  const [interaction, setInteraction] = useState("all");
  const [level, setLevel] = useState("all");
  const [kind, setKind] = useState("all");
  const [tag, setTag] = useState("all");
  const [tagQuery, setTagQuery] = useState("");
  const [dictionaryLabels, setDictionaryLabels] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<WordSort>("suggested");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [limit, setLimit] = useState(60);
  const [message, setMessage] = useState("");
  const [playing, setPlaying] = useState<string>();
  const audioRequest = useRef(0);

  useEffect(() => { setLimit(60); }, [query, filter, source, interaction, sort, level, kind, tag]);
  useEffect(() => () => { audioRequest.current += 1; stopAudio(); }, []);
  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${import.meta.env.BASE_URL}dictionary/jp/tags.json`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : {})
      .then(labels => { if (!controller.signal.aborted) setDictionaryLabels(labels); })
      .catch(() => { /* Built-in labels and raw dictionary tags remain searchable. */ });
    return () => controller.abort();
  }, []);

  const records = Object.values(state.wordHistory).flatMap(history => {
    const word = wordById(history.wordId);
    return word ? [{ word, history, metadata: wordMetadata(word), status: reviewStatus(history, state), sourceUnitIds: reviewSourceUnitIds(word.id, history) }] : [];
  });
  const due = records.filter(record => record.status.due).length;
  const prioritized = records.filter(record => isPrioritized(record.history)).length;
  const counts: Record<WordFilter, number> = {
    all: records.length, due, prioritized,
    stale: records.filter(record => record.status.daysAgo >= 14).length,
    saved: records.filter(record => state.savedWordIds.includes(record.word.id)).length,
  };
  const term = query.normalize("NFKC").trim().toLowerCase();
  const availableLevels = ["Kana", "A1", "A2", "B1", "B2", "C1", "C2", "Unplaced"].filter(value => records.some(({ word }) => (word.level ?? "Unplaced") === value));
  const availableKinds = [...new Set(records.flatMap(({ metadata }) => metadata.kinds))].sort();
  const availableTags = [...new Set(records.flatMap(({ metadata }) => metadata.tags))].sort((a, b) => metadataLabel(a, dictionaryLabels).localeCompare(metadataLabel(b, dictionaryLabels)));
  const matchingTags = availableTags.filter(value => `${value} ${metadataLabel(value, dictionaryLabels)}`.toLowerCase().includes(tagQuery.toLowerCase().trim()));
  const filtered = records.filter(({ word, history, metadata, status, sourceUnitIds }) => {
    if (!`${word.surface} ${word.reading} ${word.meaning} ${metadata.kinds.join(" ")} ${metadata.tags.map(value => metadataLabel(value, dictionaryLabels)).join(" ")}`.normalize("NFKC").toLowerCase().includes(term)) return false;
    if (filter === "due" && !status.due || filter === "prioritized" && !isPrioritized(history) || filter === "stale" && status.daysAgo < 14 || filter === "saved" && !state.savedWordIds.includes(word.id)) return false;
    if (source === "course" && !sourceUnitIds.length || source === "reference" && sourceUnitIds.length > 0) return false;
    if (level !== "all" && (word.level ?? "Unplaced") !== level || kind !== "all" && !metadata.kinds.includes(kind) || tag !== "all" && !metadata.tags.includes(tag)) return false;
    return interaction === "all" || history.interactionKinds.includes(interaction as WordInteractionKind);
  }).sort((a, b) => sort === "reading" ? a.word.reading.localeCompare(b.word.reading, "ja") : sort === "recent"
    ? b.history.lastSeenAt.localeCompare(a.history.lastSeenAt) : Number(b.status.due) - Number(a.status.due) || Number(isPrioritized(b.history)) - Number(isPrioritized(a.history)) || b.status.overdue - a.status.overdue || a.word.id.localeCompare(b.word.id));
  const pool = selecting ? records.filter(({ word }) => selected.includes(word.id)) : filtered;
  const ids = pool.map(({ word }) => word.id);
  const courseIds = pool.filter(({ word }) => curatedOwnedWordIds.has(curatedWordId(word.id))).map(({ word }) => word.id);
  const allShownSelected = filtered.length > 0 && filtered.every(({ word }) => selected.includes(word.id));
  const label = selecting ? "Selected words" : filterNames[filter];
  const moreFilters = source !== "all" || interaction !== "all" || level !== "all" || kind !== "all" || tag !== "all";
  const resetFilters = () => { setSource("all"); setInteraction("all"); setLevel("all"); setKind("all"); setTag("all"); setTagQuery(""); };

  const chooseWord = (id: string) => {
    setSelecting(true);
    setSelected(current => current.includes(id) ? current.filter(wordId => wordId !== id) : [...current, id]);
  };
  const clearSelection = () => { setSelecting(false); setSelected([]); setMessage(""); };
  const copyWords = async () => {
    try {
      await navigator.clipboard.writeText(pool.map(({ word }) => `${word.surface}\t${word.reading}\t${word.meaning}`).join("\n"));
      setMessage(`Copied ${ids.length} word${ids.length === 1 ? "" : "s"}, with readings and meanings.`);
    } catch { setMessage("Your browser could not copy these words. Try again from a secure connection."); }
  };
  const pronounce = (id: string) => {
    const request = ++audioRequest.current;
    if (playing === id) { stopAudio(); setPlaying(undefined); return; }
    const word = wordById(id);
    if (!word) return;
    setMessage("");
    void playWord({ ...word, wordId: word.id, explain: word.meaning }, {
      onLoading: () => { if (request === audioRequest.current) setPlaying(id); },
      onEnded: () => { if (request === audioRequest.current) setPlaying(undefined); },
      onStopped: () => { if (request === audioRequest.current) setPlaying(undefined); },
      onUnavailable: () => { if (request === audioRequest.current) { setPlaying(undefined); setMessage(`Pronunciation for ${word.surface} is unavailable on this device.`); } },
    });
  };

  return <section className="memory-library word-library">
    <div className="word-pool-summary" aria-label="Dictionary memory summary">
      <button type="button" onClick={() => setFilter("all")}><span>Words</span><strong>{records.length}</strong></button>
      <button type="button" className="due-summary" onClick={() => setFilter("due")}><span>Due for review</span><strong>{due}</strong></button>
      <button type="button" onClick={() => setFilter("prioritized")}><span>Prioritized</span><strong>{prioritized}</strong></button>
    </div>
    <div className="word-library-controls">
      <div className="word-filter-chips" role="group" aria-label="Filter words">{(Object.keys(filterNames) as WordFilter[]).map(value => <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All words" : value === "stale" ? "14+ days" : value === "prioritized" ? "Prioritized" : value === "due" ? "Due" : "Saved"}<span>{counts[value]}</span></button>)}</div>
      <button type="button" className={`word-filter-toggle ${moreFilters ? "has-filters" : ""}`} aria-expanded={filtersOpen} aria-controls="word-extra-filters" onClick={() => setFiltersOpen(open => !open)}><SlidersHorizontal size={15} />Filters{moreFilters && <i />}</button>
    </div>
    {filtersOpen && <div className="word-extra-filters" id="word-extra-filters">
      {!!availableLevels.length && <div><strong>Level</strong><div role="group" aria-label="Word level"><button type="button" aria-pressed={level === "all"} onClick={() => setLevel("all")}>Any level</button>{availableLevels.map(value => <button key={value} type="button" aria-pressed={level === value} onClick={() => setLevel(value)}>{value}</button>)}</div></div>}
      {!!availableKinds.length && <div><strong>Word type</strong><div role="group" aria-label="Word type"><button type="button" aria-pressed={kind === "all"} onClick={() => setKind("all")}>Any type</button>{availableKinds.map(value => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)}>{value}</button>)}</div></div>}
      <div><strong>Available for</strong><div role="group" aria-label="Word source">{[["all", "Everything"], ["course", "Sentence examples"], ["reference", "Word cards"]].map(([value, title]) => <button key={value} type="button" aria-pressed={source === value} onClick={() => setSource(value)}>{title}</button>)}</div></div>
      <div><strong>Activity</strong><div role="group" aria-label="Practice type">{[["all", "Any activity"], ["reading", "Reading"], ["listening", "Listening"], ["recall", "Recall"], ["token", "Word details"], ["saved", "Saving"]].map(([value, title]) => <button key={value} type="button" aria-pressed={interaction === value} onClick={() => setInteraction(value)}>{title}</button>)}</div></div>
      {!!availableTags.length && <details className="word-tag-filter"><summary>Dictionary tags &amp; topics{tag !== "all" ? ` · ${metadataLabel(tag, dictionaryLabels)}` : ""}</summary><input type="search" aria-label="Search word tags" placeholder="Search tags…" value={tagQuery} onChange={event => setTagQuery(event.target.value)} /><div role="group" aria-label="Word tags"><button type="button" aria-pressed={tag === "all"} onClick={() => setTag("all")}>Any tag</button>{(tag !== "all" && !matchingTags.slice(0, 24).includes(tag) ? [tag, ...matchingTags.slice(0, 24)] : matchingTags.slice(0, 24)).map(value => <button key={value} type="button" aria-pressed={tag === value} onClick={() => setTag(value)}>{metadataLabel(value, dictionaryLabels)}</button>)}</div>{matchingTags.length > 24 && <p>Search to narrow {matchingTags.length} tags.</p>}</details>}
      <button type="button" className="word-reset-filters" onClick={resetFilters}>Reset extra filters</button>
    </div>}
    {!filtersOpen && moreFilters && <div className="word-active-filters"><span>Filtered by {[level !== "all" && level, kind !== "all" && kind, tag !== "all" && metadataLabel(tag, dictionaryLabels), source !== "all" && source, interaction !== "all" && interaction].filter(Boolean).join(" · ")}</span><button type="button" onClick={resetFilters}>Clear filters <X size={12} /></button></div>}
    <div className="word-practice-bar">
      <div className="word-practice-copy"><span className="word-practice-icon"><Layers3 size={22} /></span><div><strong>{selecting ? `${ids.length} selected words` : `Find topics for ${ids.length} words`}</strong></div></div>
      <button type="button" className="word-build-button" disabled={!ids.length} onClick={() => onBuild(ids)}>Find lessons <ArrowRight size={17} /></button>
      <details className="word-review-settings"><summary>Topic review</summary><div className="word-course-review"><p>Open the owning topic to review its practiced sentences.</p><button type="button" className="word-start-review" disabled={!courseIds.length} onClick={() => onReview({ wordIds: courseIds, mode: "mixed", count: 10, label })}><CirclePlay size={17} />Find review topic</button></div></details>

    </div>
    <div className="word-results-toolbar">
      <div><h2>{filterNames[filter]}</h2><span>{filtered.length} word{filtered.length === 1 ? "" : "s"}{query.trim() ? ` matching “${query.trim()}”` : ""}</span></div>
      <div className="word-list-actions"><div className="word-sort" role="group" aria-label="Sort words"><ArrowDownWideNarrow size={14} />{([["suggested", "Suggested"], ["recent", "Recent"], ["reading", "あ–ん"]] as const).map(([value, title]) => <button key={value} type="button" aria-pressed={sort === value} onClick={() => setSort(value)}>{title}</button>)}</div><button type="button" className="word-select-toggle" aria-pressed={selecting} onClick={() => selecting ? clearSelection() : setSelecting(true)}>{selecting ? <X size={15} /> : <CheckSquare2 size={15} />}{selecting ? "Done selecting" : "Select words"}</button></div>
    </div>
    {selecting && <div className="word-selection-bar"><label><input type="checkbox" checked={allShownSelected} disabled={!filtered.length} onChange={() => setSelected(current => allShownSelected ? current.filter(id => !filtered.some(({ word }) => word.id === id)) : [...new Set([...current, ...filtered.map(({ word }) => word.id)])])} />Select all {filtered.length} results</label><span>{ids.length} selected</span><div><button type="button" disabled={!ids.length} onClick={() => { pool.filter(({ history }) => !isPrioritized(history)).forEach(({ word }) => onPrioritize(word.id)); setMessage(`${ids.length} selected words are now prioritized.`); }}><Star size={14} />Prioritize</button><button type="button" disabled={!ids.length} onClick={() => { pool.filter(({ word }) => !state.savedWordIds.includes(word.id)).forEach(({ word }) => onBookmark(word.id)); setMessage(`${ids.length} selected words are saved.`); }}><Bookmark size={14} />Save</button><button type="button" disabled={!ids.length} onClick={() => void copyWords()}><Copy size={14} />Copy</button></div></div>}
    {message && <p className="word-library-message" role="status">{message}<button type="button" aria-label="Dismiss message" onClick={() => setMessage("")}><X size={14} /></button></p>}
    {!filtered.length && <div className="empty-library word-empty"><span>{records.length ? <SlidersHorizontal /> : <Bookmark />}</span><h3>{records.length ? "No words found" : "No words yet"}</h3><p>{records.length ? "Change a filter or search for another reading or meaning." : "Words appear here after practice or when saved from the dictionary."}</p>{records.length > 0 && (filter !== "all" || moreFilters) && <button type="button" onClick={() => { setFilter("all"); resetFilters(); }}>Show all words</button>}</div>}
    <div className="memory-word-list">{filtered.slice(0, limit).map(({ word, history, status }) => {
      const saved = state.savedWordIds.includes(word.id);
      const focused = isPrioritized(history);
      return <article className={`memory-word ${selecting && selected.includes(word.id) ? "is-selected" : ""}`} key={word.id}>
        {selecting && <label className="word-row-select"><input type="checkbox" checked={selected.includes(word.id)} aria-label={`Select ${word.surface}`} onChange={() => chooseWord(word.id)} /></label>}
        <button type="button" className="word-entry-open" onClick={() => { audioRequest.current += 1; stopAudio(); setPlaying(undefined); setDictionaryId(word.id); }} aria-label={`Open dictionary entry for ${word.surface}`}><span className="memory-word-jp"><strong lang="ja" className={word.surface.length > 5 ? "long" : ""}>{word.surface}</strong><span lang="ja">{word.reading}</span></span><span className="memory-word-meaning"><strong>{word.meaning}</strong><span title="Counts completed practice cards since tracking began; earlier practice is not included.">{word.level ?? "Reference"} · {cardExposureLabel(history)}</span></span></button>
        <div className="memory-word-history"><span className={status.due ? "is-due" : ""}><i />{reviewWhen(status)}</span><small>{history.review?.occasions === 0 ? "Saved for later" : status.daysAgo ? `Last practiced ${status.daysAgo} day${status.daysAgo === 1 ? "" : "s"} ago` : "Practiced today"}</small></div>
        <div className="memory-word-actions"><button type="button" className={`word-icon-button ${playing === word.id ? "is-playing" : ""}`} aria-label={`${playing === word.id ? "Stop pronunciation for" : "Hear"} ${word.surface}`} title={playing === word.id ? "Stop audio" : "Hear pronunciation"} onClick={() => pronounce(word.id)}><Volume2 size={17} /></button><button type="button" className={`word-icon-button ${focused ? "is-focused" : ""}`} aria-label={`Prioritize ${word.surface}`} title={focused ? "Remove priority" : "Prioritize this word"} aria-pressed={focused} onClick={() => onPrioritize(word.id)}><Star size={16} fill={focused ? "currentColor" : "none"} /></button><button className={`word-icon-button ${saved ? "is-saved" : ""}`} type="button" aria-label={`${saved ? "Remove" : "Save"} ${word.meaning}`} aria-pressed={saved} title={saved ? "Remove bookmark" : "Save word"} onClick={() => onBookmark(word.id)}><Bookmark size={16} fill={saved ? "currentColor" : "none"} /></button></div>
      </article>;
    })}</div>
    {filtered.length > limit && <button type="button" className="word-show-more" onClick={() => setLimit(value => value + 60)}>Show {Math.min(60, filtered.length - limit)} more words<span>{limit} of {filtered.length}</span></button>}
    {!!records.length && <details className="review-explanation word-review-explanation"><summary>About your review timing</summary><p>Words return after 2, 4, 8, 16, then 32 days or practiced lessons. Prioritizing a word halves its interval. Intervals grow after practice in a different session at least a day apart. Saving or opening a word keeps its review timing unchanged.</p></details>}
    {dictionaryId && <DictionaryEntryPanel entryId={dictionaryId} onClose={() => setDictionaryId(undefined)} savedWordIds={state.savedWordIds} prioritizedWordIds={Object.values(state.wordHistory).filter(isPrioritized).map(history => history.wordId)} onPrioritize={onPrioritize} onPractice={onPractice} onAddWord={id => { if (!state.savedWordIds.includes(id)) onBookmark(id); }} />}
  </section>;
}
