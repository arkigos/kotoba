import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Bookmark, BookOpen, Check, ChevronDown, CirclePlay, Copy, SlidersHorizontal, Star, X } from "lucide-react";
import {
  courseDictionaryWords, dictionaryEntry, dictionaryWord, dictionaryWordTypes, filterDictionaryRows, learningIdsForEntry, loadDictionaryEntry,
  loadDictionaryIndex, loadStudyPoolIndex, placementForEntry, searchDictionary, searchRowForEntry, frequencyLabels, containsKatakana,
  type DictionaryEntry, type SearchRow,
} from "../../../packages/dictionary";
import { curatedDictionaryTopics as courseTopics, curatedWordId } from "./curated-course";
import { isPrioritized } from "./review";
import { recordingForToken } from "../../../packages/dictionary/audio";
import { playWord, stopAudio } from "./audio";
import type { CardToken, LearnerState } from "./types";
import "./dictionary.css";

const baseUrl = import.meta.env.BASE_URL;
const levels = ["A1", "A2", "B1", "B2", "C1", "C2", "Kana"];
const commonTags: Record<string, string> = {
  n: "noun", "n-pr": "proper noun", pn: "pronoun", prt: "particle", num: "number",
  "adj-i": "i-adjective", "adj-ix": "i-adjective · ii/yoi exception", "adj-na": "na-adjective",
  v1: "ichidan verb", "v5k-s": "godan verb · iku exception", vk: "kuru verb", vs: "suru verb",
  "vs-i": "suru verb", vt: "transitive", vi: "intransitive", adv: "adverb", exp: "expression",
};

function SourceCredit({ local = false }: { local?: boolean }) {
  return <p className="dictionary-source">{local ? "Course entries are authored in Kotoba. " : ""}Dictionary data: <a href="https://www.edrdg.org/wiki/index.php/JMdict-EDICT_Dictionary_Project" target="_blank" rel="noreferrer">JMdict / EDRDG</a> · <a href={`${baseUrl}dictionary/jp/ATTRIBUTION.md`} target="_blank" rel="noreferrer">CC BY-SA 4.0 &amp; sources</a></p>;
}

function addIdForEntry(entryId: string, savedWordIds: string[] = []) {
  const ids = learningIdsForEntry(entryId);
  return savedWordIds.find(id => id === entryId || ids.includes(id)) ?? ids[0] ?? entryId;
}

export function DictionaryView({ query, state, onAddWord, onPrioritize, onPractice }: {
  query: string; state: LearnerState; onAddWord: (wordId: string) => void; onQueryChange?: (query: string) => void;
  onPrioritize?: (wordId: string) => void; onPractice?: (wordIds: string[]) => void;
}) {
  const [level, setLevel] = useState("All");
  const [scope, setScope] = useState("all");
  const [topic, setTopic] = useState("");
  const [coreOnly, setCoreOnly] = useState(false);
  const [commonOnly, setCommonOnly] = useState(false);
  const [wordType, setWordType] = useState("");
  const [field, setField] = useState("");
  const [frequency, setFrequency] = useState("");
  const [writing, setWriting] = useState("");
  const [limit, setLimit] = useState(40);
  const [index, setIndex] = useState<SearchRow[]>();
  const [studyIndex, setStudyIndex] = useState<SearchRow[]>();
  const [studyError, setStudyError] = useState("");
  const [stage, setStage] = useState("");
  const [retainedRows, setRetainedRows] = useState<SearchRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const [labels, setLabels] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string>();
  const [selection, setSelection] = useState<string[]>([]);
  const [working, setWorking] = useState<string[]>([]);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");
  const mounted = useRef(true);
  const workingIds = useRef(new Set<string>());
  const searchTerm = useDeferredValue(query.trim());
  const prioritizedWordIds = Object.values(state.wordHistory).filter(isPrioritized).map(word => word.wordId);
  const preferredIds = [...prioritizedWordIds, ...state.savedWordIds];
  const retainedKey = [...new Set(preferredIds)].sort().join("|");
  useEffect(() => {
    let cancelled = false;
    void Promise.allSettled(retainedKey.split("|").filter(Boolean).map(id => loadDictionaryEntry(id, baseUrl)))
      .then(results => { if (!cancelled) setRetainedRows([...new Map(results.flatMap(result => result.status === "fulfilled" ? [[result.value.id, searchRowForEntry(result.value)] as const] : [])).values()]); });
    return () => { cancelled = true; };
  }, [retainedKey]);
  const course = useMemo(() => {
    const words = courseDictionaryWords().sort((a, b) => Number(a.level === "Kana") - Number(b.level === "Kana") || (a.introducedInUnit ?? 0) - (b.introducedInUnit ?? 0));
    const rows = new Map<string, SearchRow>();
    const placements = new Map<string, Set<string>>();
    const topics = new Map<string, Set<string>>();
    const core = new Set<string>();
    for (const word of words) {
      if (!rows.has(word.dictionaryEntryId)) {
        const row = searchRowForEntry(dictionaryEntry(word.id)!);
        row[1] = word.surface; row[2] = word.reading; row[3] = word.meaning;
        rows.set(word.dictionaryEntryId, row);
      }
      if (word.level) {
        if (!placements.has(word.dictionaryEntryId)) placements.set(word.dictionaryEntryId, new Set());
        placements.get(word.dictionaryEntryId)!.add(word.level);
      }
    }
    for (const topic of courseTopics) for (const id of topic.wordIds) topics.set(id, new Set([topic.id]));
    for (const topic of courseTopics.filter(topic => topic.level === "A1")) for (const id of topic.wordIds) core.add(id);
    return { rows: [...rows.values()], placements, topics, core };
  }, []);

  useEffect(() => {
    mounted.current = true;
    const controller = new AbortController();
    void fetch(`${baseUrl}dictionary/jp/tags.json`, { signal: controller.signal })
      .then(response => response.ok ? response.json() : {})
      .then((value: Record<string, string>) => { if (!controller.signal.aborted) setLabels(value); })
      .catch(() => { /* Raw source category labels remain available offline. */ });
    return () => { mounted.current = false; controller.abort(); };
  }, []);

  useEffect(() => { setLimit(40); }, [searchTerm, level, scope, topic, coreOnly, commonOnly, wordType, field, frequency, writing, stage]);
  useEffect(() => {
    if (scope !== "study" || studyIndex) return;
    let cancelled = false;
    setStudyError("");
    void loadStudyPoolIndex(baseUrl).then(rows => { if (!cancelled) setStudyIndex(rows); })
      .catch(cause => { if (!cancelled) setStudyError(cause instanceof Error ? cause.message : "Study pools could not load."); });
    return () => { cancelled = true; };
  }, [scope, studyIndex, retry]);
  useEffect(() => {
    if (index) return;
    let cancelled = false;
    setLoading(true); setError("");
    void loadDictionaryIndex(baseUrl).then(rows => {
      if (!cancelled) {
        // Common and authored words are useful entry points; every entry remains browsable.
        setIndex([...rows].sort((a, b) => Number(course.core.has(b[0])) - Number(course.core.has(a[0])) || (b[5] ?? 0) - (a[5] ?? 0)));
        setLoading(false);
      }
    }).catch(cause => {
      if (!cancelled) { setLoading(false); setError(cause instanceof Error ? cause.message : "The full dictionary could not load."); }
    });
    return () => { cancelled = true; };
  }, [index, retry, course]);

  const sourceRows = useMemo(() => scope === "study" ? studyIndex ?? [] : scope === "all" ? index ?? course.rows : [...new Map([...(index ?? course.rows), ...retainedRows].map(row => [row[0], row])).values()], [index, studyIndex, course, scope, retainedRows]);
  const categories = useMemo(() => [...new Set(sourceRows.flatMap(row => row[7] ? row[7].split("|") : []))]
    .sort((a, b) => (labels[a] ?? a).localeCompare(labels[b] ?? b)), [sourceRows, labels]);
  const savedEntries = new Set(state.savedWordIds.map(id => dictionaryWord(id)?.dictionaryEntryId ?? id));
  const priorityEntries = new Set(prioritizedWordIds.map(id => dictionaryWord(id)?.dictionaryEntryId ?? id));
  const savedKey = [...savedEntries].sort().join(",");
  const priorityKey = [...priorityEntries].sort().join(",");
  const results = useMemo(() => {
    const scoped = sourceRows.filter(row => (scope !== "saved" || savedEntries.has(row[0]))
      && (scope !== "priority" || priorityEntries.has(row[0]))
      && (level === "All" || (scope === "study" ? row[8] === level : level === "Unplaced" ? !course.placements.has(row[0]) && !row[8] : course.placements.get(row[0])?.has(level) || row[8] === level))
      && (scope !== "study" || !stage || row[12] === stage)
      && (!frequency || row[10] === frequency)
      && (!writing || containsKatakana(row[1]) === (writing === "katakana"))
      && (!topic || course.topics.get(curatedWordId(row[0]))?.has(topic))
      && (!coreOnly || course.core.has(curatedWordId(row[0]))));
    return searchDictionary(filterDictionaryRows(scoped, { common: commonOnly, wordType, field }), searchTerm, Infinity);
  }, [sourceRows, course, level, scope, stage, topic, coreOnly, commonOnly, wordType, field, frequency, writing, searchTerm, savedKey, priorityKey]);
  const visibleResults = results.slice(0, limit);
  const hasMore = results.length > limit;
  const populatedLevels = levels.filter(value => sourceRows.some(row => row[8] === value) || scope !== "study" && [...course.placements.values()].some(values => values.has(value)));
  const filtered = level !== "All" || scope !== "all" || Boolean(topic || wordType || field || frequency || writing) || coreOnly || commonOnly;
  const secondaryFilterCount = [level !== "All", Boolean(wordType), Boolean(field), Boolean(frequency), Boolean(writing), coreOnly, commonOnly].filter(Boolean).length;
  const resetFilters = () => { setLevel("All"); setScope("all"); setStage(""); setTopic(""); setCoreOnly(false); setCommonOnly(false); setWordType(""); setField(""); setFrequency(""); setWriting(""); };

  const resolveAction = async (entryIds: string[], action: (wordIds: string[]) => void) => {
    if (entryIds.some(id => workingIds.current.has(id))) return;
    entryIds.forEach(id => workingIds.current.add(id));
    setWorking(current => [...current, ...entryIds]); setActionError("");
    try {
      await Promise.all(entryIds.map(id => loadDictionaryEntry(id, baseUrl)));
      if (mounted.current) action(entryIds.map(id => addIdForEntry(id, preferredIds)));
    } catch (cause) {
      if (mounted.current) setActionError(cause instanceof Error ? cause.message : "These words could not load. Please try again.");
    } finally {
      entryIds.forEach(id => workingIds.current.delete(id));
      if (mounted.current) setWorking(current => current.filter(id => !entryIds.includes(id)));
    }
  };
  const selectedRows = selection.length ? selection : [];
  const allVisibleSelected = visibleResults.length > 0 && visibleResults.every(row => selection.includes(row[0]));

  return <section className="dictionary-view" aria-label="Japanese dictionary">
    <div className="dictionary-toolbar">
    <div className="dictionary-levels" role="group" aria-label="Dictionary collection"><button type="button" aria-pressed={scope === "all"} onClick={() => setScope("all")}>All words</button><button type="button" aria-pressed={scope === "study"} onClick={() => { setScope("study"); setLevel("All"); setStage(""); setTopic(""); setCoreOnly(false); }}>Study pools</button><button type="button" aria-pressed={scope === "priority"} onClick={() => setScope("priority")}><Star size={13} />Priority <span>{priorityEntries.size}</span></button><button type="button" aria-pressed={scope === "saved"} onClick={() => setScope("saved")}><Bookmark size={13} />Saved <span>{savedEntries.size}</span></button></div>
    <label className="dictionary-topic-control">Topic<select aria-label="Dictionary topic" value={topic} onChange={event => setTopic(event.target.value)}><option value="">All topics</option>{courseTopics.map(value => <option key={value.id} value={value.id}>{value.title}</option>)}</select></label>
    </div>
    {scope === "study" && <div className="dictionary-pool-summary"><p>{studyIndex ? `${studyIndex.length.toLocaleString("en-US")} words and expressions` : "A curated vocabulary"} across A1–C2. Choose a level to explore its pool. These are Kotoba curriculum placements; later levels are provisional.</p><label>A1 teaching stage <select aria-label="A1 teaching stage" value={stage} onChange={event => { setStage(event.target.value); if (event.target.value) setLevel("A1"); }}><option value="">All stages</option><option value="introductory">Introductory</option><option value="foundation">Foundation</option><option value="topic-expansion">Topic expansion</option></select></label>{!studyIndex && !studyError && <p role="status">Loading study pools…</p>}{studyError && <p role="alert">{studyError} <button type="button" onClick={() => setRetry(value => value + 1)}>Retry study pools</button></p>}</div>}
    <div className="dictionary-filter-tools"><details className="dictionary-filter-panel"><summary><SlidersHorizontal size={15} /><span>Filters</span>{secondaryFilterCount > 0 && <span className="dictionary-filter-count">{secondaryFilterCount} active</span>}<ChevronDown size={14} /></summary>
    <div className="dictionary-browse-filters" role="group" aria-label="Dictionary filters">
      <label>Level<select aria-label="Dictionary level" value={level} onChange={event => { setLevel(event.target.value); setStage(""); }}><option value="All">Any level</option>{populatedLevels.map(value => <option key={value}>{value}</option>)}{scope !== "study" && <option value="Unplaced">No assigned level</option>}</select></label>
      <label>Word type<select aria-label="Dictionary word type" value={wordType} onChange={event => setWordType(event.target.value)}><option value="">Any word type</option>{dictionaryWordTypes.map(value => <option key={value}>{value}</option>)}</select></label>
      <label>Frequency<select aria-label="Dictionary frequency" value={frequency} onChange={event => setFrequency(event.target.value)}><option value="">Any frequency</option>{Object.entries(frequencyLabels).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
      <label>Writing<select aria-label="Dictionary writing" value={writing} onChange={event => setWriting(event.target.value)}><option value="">Any writing</option><option value="katakana">Contains katakana</option><option value="no-katakana">No katakana</option></select></label>
      <label>Category<select aria-label="Dictionary category" value={field} onChange={event => setField(event.target.value)}><option value="">All categories</option>{categories.map(value => <option key={value} value={value}>{labels[value] ?? value}</option>)}</select></label>
      <div className="dictionary-browse-toggles"><label><input type="checkbox" checked={coreOnly} onChange={event => setCoreOnly(event.target.checked)} />A1 course</label><label><input type="checkbox" checked={commonOnly} onChange={event => setCommonOnly(event.target.checked)} />Common words</label></div>
    </div></details>{filtered && <button className="dictionary-reset-filters" type="button" onClick={resetFilters}>Reset filters <X size={13} /></button>}</div>
    {writing && <p className="dictionary-status">Katakana flags spelling, not English origin. Use A1 course or Topic to inspect lesson vocabulary.</p>}
    {loading && <p role="status" className="dictionary-status">Loading the full dictionary… Browse installed course words while it loads.</p>}
    {error && <div className="dictionary-error" role="alert"><p>{error} Installed course words are shown below.</p><button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button></div>}
    {actionError && <p className="dictionary-error" role="alert">{actionError}</p>}
    {message && <p className="dictionary-save-message" role="status"><Check size={14} />{message}<button type="button" aria-label="Dismiss dictionary message" onClick={() => setMessage("")}><X size={14} /></button></p>}
    {(onPractice || onPrioritize) && <div className={`dictionary-selection-bar ${selection.length ? "has-selection" : ""}`}><label><input type="checkbox" checked={allVisibleSelected} disabled={!visibleResults.length} onChange={() => setSelection(current => allVisibleSelected ? current.filter(id => !visibleResults.some(row => row[0] === id)) : [...new Set([...current, ...visibleResults.map(row => row[0])])])} />Select shown</label>{!!selection.length && <><span>{selection.length} selected</span><div><button type="button" onClick={() => setSelection([])}>Clear</button>{onPrioritize && <button type="button" disabled={!!working.length} onClick={() => void resolveAction(selectedRows, ids => { ids.filter(id => !isPrioritized(state.wordHistory[id])).forEach(onPrioritize); setMessage(`${ids.length} words are in Priority.`); })}><Star size={14} />Add to Priority</button>}{onPractice && <button type="button" className="dictionary-practice-selection" aria-label="Find lessons for selected words" disabled={!!working.length} onClick={() => void resolveAction(selectedRows, onPractice)}>Find lessons <ArrowRight size={15} /></button>}</div></>}</div>}
    <div className="dictionary-result-heading"><strong>{searchTerm ? `Matches for “${searchTerm}”` : scope === "priority" ? "Your priority words" : scope === "saved" ? "Saved entries" : scope === "study" ? "A1–C2 study pools" : topic ? courseTopics.find(value => value.id === topic)?.title : coreOnly ? "A1 course vocabulary" : "Browse the dictionary"}</strong><span>{results.length.toLocaleString()} {results.length === 1 ? "entry" : "entries"}{hasMore ? ` · ${visibleResults.length} shown` : ""}</span></div>
    {!results.length && !loading && (scope !== "study" || studyIndex) && <div className="dictionary-empty"><SlidersHorizontal size={27} /><h3>{scope === "priority" ? "Build your priority pool" : "No matching entries"}</h3><p>{scope === "priority" ? "Add any word to Priority to tailor your practice to your needs." : "Change a filter, or try another reading or meaning."}</p>{filtered && <button type="button" onClick={resetFilters}>Show all words</button>}</div>}
    <div className="dictionary-results" aria-busy={query.trim() !== searchTerm}>{visibleResults.map(row => {
      const id = addIdForEntry(row[0], preferredIds);
      const saved = savedEntries.has(row[0]);
      const priority = priorityEntries.has(row[0]);
      const placements = scope === "study" ? [row[8]] : [...(course.placements.get(row[0]) ?? (row[8] ? [row[8]] : []))];
      const placementLabel = [scope === "study" ? `${row[8]} pool · ${row[12]?.replaceAll("-", " ")}${row[9] === "estimated" ? " · provisional" : ""}` : course.core.has(curatedWordId(row[0])) ? "A1 course" : `${placements.join(" · ")}${row[9] === "estimated" ? " · estimated" : ""}`, row[10] ? frequencyLabels[row[10]] : "", containsKatakana(row[1]) ? "Katakana" : ""].filter(Boolean).join(" · ");
      return <article className={`dictionary-result ${selection.includes(row[0]) ? "is-selected" : ""}`} key={row[0]}>
        {(onPractice || onPrioritize) && <input type="checkbox" className="dictionary-row-select" checked={selection.includes(row[0])} aria-label={`Select ${row[1]}`} onChange={() => setSelection(current => current.includes(row[0]) ? current.filter(id => id !== row[0]) : [...current, row[0]])} />}
        <button type="button" className="dictionary-open-entry" aria-label={`Open dictionary entry for ${row[1]}`} onClick={() => setSelected(row[0])}><span className="dictionary-japanese"><strong lang="ja">{row[1]}</strong><span lang="ja">{row[2]}</span></span><span className="dictionary-summary"><strong>{row[3] || "See dictionary entry"}</strong>{placementLabel && <small>{placementLabel}</small>}</span></button>
        <div className="dictionary-row-actions">{onPrioritize && <button type="button" className={`dictionary-priority ${priority ? "is-prioritized" : ""}`} disabled={working.includes(row[0])} aria-label={`Prioritize ${row[1]}`} aria-pressed={priority} title={priority ? "Remove from Priority" : "Add to Priority"} onClick={() => void resolveAction([row[0]], ids => onPrioritize(ids[0]))}><Star size={17} fill={priority ? "currentColor" : "none"} /></button>}<button type="button" className="dictionary-save" disabled={saved || working.includes(row[0])} title={saved ? "Saved to my words" : "Save to my words"} aria-label={saved ? `${row[1]} is saved` : `Save ${row[1]} to my words`} onClick={() => void resolveAction([row[0]], () => { onAddWord(id); setMessage(`${row[1]} saved to your words.`); })}>{saved ? <Check size={17} /> : <Bookmark size={17} />}</button></div>
      </article>;
    })}</div>
    {hasMore && <button type="button" className="dictionary-show-more" onClick={() => setLimit(value => value + 40)}>Show more entries<span>{visibleResults.length} of {results.length.toLocaleString()}</span></button>}
    <details className="dictionary-about"><summary>About the dictionary</summary><p>About 50,000 study entries, with spelling variants grouped together. Levels are Kotoba placements; estimated labels are study guidance, not official CEFR ratings. Frequency describes exact written forms in wordfreq, with JMdict common-word evidence where needed. Limited data means frequency is uncertain. Older saved reference entries remain available.</p></details>
    {scope === "study" && <p className="dictionary-source"><a href={`${baseUrl}dictionary/jp/STUDY-POOLS-NOTICE.md`} target="_blank" rel="noreferrer">Study pool methodology and source credits</a></p>}
    <SourceCredit local />
    {selected && <DictionaryEntryPanel entryId={selected} poolRow={scope === "study" ? studyIndex?.find(row => row[0] === selected) : undefined} onClose={() => setSelected(undefined)} onAddWord={onAddWord} savedWordIds={state.savedWordIds} prioritizedWordIds={prioritizedWordIds} onPrioritize={onPrioritize} onPractice={onPractice} />}
  </section>;
}

export function DictionaryEntryPanel({ entryId, poolRow, onClose, onAddWord, savedWordIds = [], prioritizedWordIds = [], onPrioritize, onPractice }: {
  entryId: string; poolRow?: SearchRow; onClose: () => void; onAddWord?: (wordId: string) => void; savedWordIds?: string[];
  prioritizedWordIds?: string[]; onPrioritize?: (wordId: string) => void; onPractice?: (wordIds: string[]) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [entry, setEntry] = useState<DictionaryEntry>();
  const [labels, setLabels] = useState<Record<string, string>>(commonTags);
  const [error, setError] = useState("");
  const [labelsError, setLabelsError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [audioStatus, setAudioStatus] = useState("");
  const [activeReading, setActiveReading] = useState("");
  const [chosenLearningId, setChosenLearningId] = useState<string>();
  const [copyStatus, setCopyStatus] = useState("");
  const mounted = useRef(true);
  const audioRequest = useRef(0);

  useEffect(() => {
    mounted.current = true;
    const element = dialog.current;
    if (element && !element.open) {
      if (typeof element.showModal === "function") element.showModal();
      else element.setAttribute("open", "");
    }
    return () => { mounted.current = false; audioRequest.current += 1; stopAudio(); };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    setEntry(undefined); setError(""); setLabelsError(false); setAudioStatus(""); setActiveReading(""); setChosenLearningId(undefined); setCopyStatus("");
    void loadDictionaryEntry(entryId, baseUrl).then(value => { if (!cancelled) setEntry(value); })
      .catch(cause => { if (!cancelled) setError(cause instanceof Error ? cause.message : "This entry could not load."); });
    void fetch(`${baseUrl}dictionary/jp/tags.json`, { signal: controller.signal })
      .then(response => { if (!response.ok) throw new Error("Labels unavailable"); return response.json(); })
      .then((value: Record<string, string>) => { if (!cancelled) setLabels(value); })
      .catch(() => { if (!cancelled) setLabelsError(true); });
    return () => { cancelled = true; controller.abort(); stopAudio(); };
  }, [entryId, retry]);

  const placements = entry ? placementForEntry(entry.id) : [];
  const learningForms = entry ? learningIdsForEntry(entry.id).map(dictionaryWord).filter(word => word !== undefined) : [];
  const learningId = chosenLearningId ?? (learningForms.some(word => word.id === entryId) ? entryId : entry ? addIdForEntry(entry.id, [...prioritizedWordIds, ...savedWordIds]) : entryId);
  const saved = savedWordIds.includes(learningId) || Boolean(entry && savedWordIds.includes(entry.id));
  const priority = prioritizedWordIds.includes(learningId);
  const ownedTopics = courseTopics.filter(topic => topic.wordIds.includes(curatedWordId(learningId)));
  const learningMetadata = { core: ownedTopics.some(topic => topic.level === "A1"), topicIds: ownedTopics.map(topic => topic.id) };
  const tokenFor = (reading: string): CardToken => ({
    wordId: entry!.id, dictionaryEntryId: entry!.id,
    surface: entry!.headword, reading, explain: entry!.senses[0]?.glosses[0] ?? "",
    ...(dictionaryWord(learningId)?.audioText && reading === dictionaryWord(learningId)?.reading
      ? { audioText: dictionaryWord(learningId)?.audioText } : {}),
  });
  const pronounce = (reading: string) => {
    const request = ++audioRequest.current;
    if (activeReading === reading) { stopAudio(); setActiveReading(""); setAudioStatus(""); return; }
    void playWord(tokenFor(reading), {
      onLoading: () => { if (mounted.current && request === audioRequest.current) { setActiveReading(reading); setAudioStatus("Preparing pronunciation…"); } },
      onPlaying: () => { if (mounted.current && request === audioRequest.current) setAudioStatus(`Playing ${reading}`); },
      onEnded: () => { if (mounted.current && request === audioRequest.current) { setAudioStatus(""); setActiveReading(""); } },
      onStopped: () => { if (mounted.current && request === audioRequest.current) { setAudioStatus(""); setActiveReading(""); } },
      onUnavailable: () => { if (mounted.current && request === audioRequest.current) { setAudioStatus("Pronunciation is unavailable on this device."); setActiveReading(""); } },
    });
  };
  const copyEntry = async () => {
    if (!entry) return;
    try {
      await navigator.clipboard.writeText(`${entry.headword}\n${entry.readings.join(" · ")}\n${entry.senses.map((sense, index) => `${index + 1}. ${sense.glosses.join("; ")}`).join("\n")}`);
      if (mounted.current) setCopyStatus("Entry copied");
    } catch { if (mounted.current) setCopyStatus("Could not copy on this device"); }
  };

  return <dialog ref={dialog} className="dictionary-dialog" aria-labelledby="dictionary-entry-title" onKeyDown={event => event.stopPropagation()} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <header className="dictionary-dialog-header"><span><BookOpen size={17} />Dictionary entry</span><div>{entry && <button type="button" aria-label="Copy dictionary entry" title="Copy word, readings, and meanings" onClick={() => void copyEntry()}><Copy size={16} /></button>}<button type="button" aria-label="Close dictionary entry" onClick={onClose}><X size={22} /></button></div></header>
    {copyStatus && <p className="dictionary-copy-status" role="status">{copyStatus}</p>}
    {error ? <div className="dictionary-error" role="alert"><h2 id="dictionary-entry-title">Entry unavailable</h2><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button></div> : !entry ? <h2 id="dictionary-entry-title" className="dictionary-loading" role="status">Loading entry…</h2> : <>
      <div className="dictionary-entry-heading"><h2 id="dictionary-entry-title" lang="ja">{entry.headword}</h2><div className="dictionary-entry-badges"><span>{learningMetadata?.core ? "A1 course" : placements.length ? placements.join(" · ") : "Unplaced"}{entry.placement?.method === "estimated" ? " · estimated" : ""}</span>{entry.frequency ? <span>{frequencyLabels[entry.frequency.band]}</span> : entry.common && <span>Common word</span>}{learningMetadata?.topicIds.map(id => <span key={id}>{courseTopics.find(topic => topic.id === id)?.title}</span>)}</div></div>
      {entry.placement?.method === "estimated" && <p className="dictionary-status">Estimated study level · {entry.placement.confidence} confidence. Frequency is supporting evidence, not a proficiency test.</p>}
      {poolRow && <p className="dictionary-status">Curriculum pool: {poolRow[8]} · {poolRow[12]?.replaceAll("-", " ")} · {poolRow[3]}. Pool placement is separate from the reference and original course labels above.</p>}
      {entry.spellings.length > 1 && <p className="dictionary-spellings"><strong>Spellings</strong><span lang="ja">{entry.spellings.join(" · ")}</span></p>}
      <div className="dictionary-pronunciations" aria-label="Readings and pronunciation">{entry.readings.map(reading => {
        const form = entry.readingForms?.find(value => value.text === reading);
        const recorded = Boolean(recordingForToken(tokenFor(reading)));
        return <div key={reading}><div><strong lang="ja">{reading}</strong>{form?.appliesToSpellings?.length ? <small>Used with {form.appliesToSpellings.join(" · ")}</small> : form?.noKanji ? <small>Kana form</small> : null}</div><button type="button" className={activeReading === reading ? "is-playing" : ""} aria-label={`${activeReading === reading ? "Stop" : "Play"} pronunciation ${reading}`} onClick={() => pronounce(reading)}><CirclePlay size={18} /><span>{activeReading === reading ? "Stop audio" : recorded ? "Recorded audio" : "Device voice"}</span></button></div>;
      })}</div>
      <p className="dictionary-audio-status" role="status">{audioStatus}</p>
      <ol className="dictionary-senses">{entry.senses.map(sense => <li key={sense.id}>
        <p className="dictionary-pos">{sense.partsOfSpeech.map(tag => labels[tag] ?? tag).join(" · ")}</p>
        <p>{sense.glosses.join("; ") || "See related dictionary entries."}</p>
        {(sense.appliesToSpellings?.length || sense.appliesToReadings?.length) ? <small className="dictionary-sense-restriction">Applies to {[...(sense.appliesToSpellings ?? []), ...(sense.appliesToReadings ?? [])].join(" · ")}</small> : null}
        {Boolean(sense.fields?.length || sense.misc?.length) && <small>{[...(sense.fields ?? []), ...(sense.misc ?? [])].map(tag => labels[tag] ?? tag).join(" · ")}</small>}
        {sense.notes?.map(note => <small key={note}>{note}</small>)}
      </li>)}</ol>
      {labelsError && <p className="dictionary-label-error">Some grammatical labels could not load. <button type="button" onClick={() => setRetry(value => value + 1)}>Try again</button></p>}
      {(onAddWord || onPrioritize || onPractice) && learningForms.length > 1 && <div className="dictionary-learning-forms"><strong>Choose your learning form</strong><div role="group" aria-label="Learning word form">{learningForms.map(word => <button key={word.id} type="button" aria-pressed={learningId === word.id} onClick={() => setChosenLearningId(word.id)}><span lang="ja">{word.surface}</span><small>{word.meaning}</small>{savedWordIds.includes(word.id) && <Check size={13} />}</button>)}</div></div>}
      {(onPrioritize || onPractice) && <div className="dictionary-entry-practice-actions">{onPrioritize && <button type="button" className={`dictionary-priority ${priority ? "is-prioritized" : ""}`} aria-pressed={priority} onClick={() => onPrioritize(learningId)}><Star size={17} fill={priority ? "currentColor" : "none"} />{priority ? "In Priority" : "Add to Priority"}</button>}{onPractice && <button type="button" className="dictionary-practice-selection" aria-label={`Find lessons for ${dictionaryWord(learningId)?.surface ?? entry.headword}`} onClick={() => { onPractice([learningId]); onClose(); }}>Find lessons <ArrowRight size={17} /></button>}</div>}
      {onAddWord && <button type="button" className="dictionary-add-word" disabled={saved} onClick={() => onAddWord(learningId)}>{saved ? <Check size={18} /> : <Bookmark size={18} />}{saved ? "Saved to my words" : "Save to my words"}</button>}
      <SourceCredit local={entry.source !== "jmdict"} />
    </>}
  </dialog>;
}
