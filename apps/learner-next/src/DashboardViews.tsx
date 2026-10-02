import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bookmark, Download, Heart, Languages, Play, Search, Settings2, Square, Volume2 } from "lucide-react";
import { allCards, unitForCard, wordById } from "./curriculum";
import { LibraryWords } from "./LibraryWords";
import { DictionaryView } from "./DictionaryView";
import { playCard, stopAudio } from "./audio";
import type { LearnerSettings, LearnerState, LibraryReviewMode, LibraryReviewRequest, PracticeCard, ToastMessage } from "./types";

export { TodayView } from "./TodayView";

type LibraryProps = {
  onOpenSentence: (card: PracticeCard) => void;
  onReviewSentences: (cards: PracticeCard[], mode: LibraryReviewMode) => void;
  onToast: (message: Omit<ToastMessage, "id">) => void;
  onAddDictionaryWord: (id: string) => void;
  onBuild: (words: string[]) => void;
  state: LearnerState;
  revision: number;
  onToggleWord: (id: string) => void;
  onToggleSentence: (id: string) => void;
  onStart: (id: number) => void;
  onReview: (request: LibraryReviewRequest) => void;
  onPrioritizeWord: (id: string) => void;
  onPracticeWords?: (ids: string[]) => void;
};

type LibraryTab = "review" | "dictionary" | "sentences";
export function LibraryView({ state, revision, onToggleWord, onToggleSentence, onStart, onReview, onPrioritizeWord, onBuild, onAddDictionaryWord, onOpenSentence, onReviewSentences, onToast, onPracticeWords }: LibraryProps) {
  const [tab, setTab] = useState<LibraryTab>("dictionary");
  const [query, setQuery] = useState("");
  const records = useMemo(() => Object.values(state.wordHistory).map(history => ({ history, word: wordById(history.wordId) })).filter(record => !!record.word), [revision, state.wordHistory]);
  const savedCards = [...new Map([...allCards(), ...Object.values(state.savedGeneratedCards ?? {}).map(saved => saved.card), ...Object.values(state.savedMaterializedCards ?? {})].map(card => [card.id, card])).values()].filter(card => state.savedSentenceIds.includes(card.id) && `${card.line.join("")} ${card.english}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="view library-view">
    <header className="view-heading library-heading"><div><h1>Dictionary</h1></div><label className="search-field library-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Japanese or English" /></label></header>
    <nav className="library-tabs" aria-label="Dictionary sections">{([['dictionary', 'Browse'], ['review', `My words · ${records.length}`], ['sentences', `Sentences · ${state.savedSentenceIds.length}`]] as Array<[LibraryTab, string]>).map(([key, label]) => <button key={key} type="button" className={tab === key ? "active" : ""} onClick={() => setTab(key)}>{label}</button>)}</nav>

    {tab === "review" && <LibraryWords state={state} query={query} onPrioritize={onPrioritizeWord} onBookmark={onToggleWord} onReview={onReview} onBuild={onBuild} onPractice={onPracticeWords} />}
    {tab === "dictionary" && <DictionaryView query={query} state={state} onAddWord={onAddDictionaryWord} onQueryChange={setQuery} onPrioritize={onPrioritizeWord} onPractice={onPracticeWords} />}

    {tab === "sentences" && <SavedSentences cards={savedCards} hasSaved={!!state.savedSentenceIds.length} onOpen={onOpenSentence} onReview={onReviewSentences} onRemove={onToggleSentence} onToast={onToast} />}
  </div>;
}

function EmptyLibrary({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return <div className="empty-library"><span>{icon}</span><h3>{title}</h3><p>{copy}</p></div>;
}

function SavedSentences({ cards, hasSaved, onOpen, onReview, onRemove, onToast }: { cards: PracticeCard[]; hasSaved: boolean; onOpen: (card: PracticeCard) => void; onReview: (cards: PracticeCard[], mode: LibraryReviewMode) => void; onRemove: (id: string) => void; onToast: (message: Omit<ToastMessage, "id">) => void }) {
  const [playing, setPlaying] = useState<string>();
  const [mode, setMode] = useState<LibraryReviewMode>("mixed");
  useEffect(() => () => stopAudio(), []);
  const listen = (card: PracticeCard) => {
    if (playing === card.id) { stopAudio(); setPlaying(undefined); return; }
    void playCard(card, unitForCard(card.id)?.id, { onLoading: () => setPlaying(card.id), onStopped: () => setPlaying(undefined), onEnded: () => setPlaying(undefined), onUnavailable: () => { setPlaying(undefined); onToast({ tone: "warning", message: "Audio is unavailable for this sentence on this device." }); } });
  };
  return <section className="library-content"><div className="library-section-heading"><div><h2>Saved sentences</h2></div><span>{cards.length} saved</span></div>{!!cards.length && <p>Open a saved sentence to practice it again. Full reviews are available within each topic.</p>}{!cards.length && <EmptyLibrary icon={<Heart />} title={hasSaved ? "No matching sentences" : "No saved sentences"} copy="Bookmark a sentence during practice." />}<div className="saved-sentence-list">{cards.map(card => <article key={card.id}><button type="button" className="saved-sentence-open" aria-label={`Practice saved sentence: ${card.english}`} onClick={() => onOpen(card)}><strong lang="ja">{card.line.join("")}</strong><small>{card.english}</small><span aria-hidden="true"><ArrowRight size={14} /></span></button><div><button type="button" aria-label={`${playing === card.id ? "Stop" : "Play"} saved sentence: ${card.english}`} onClick={() => listen(card)}>{playing === card.id ? <Square size={17} /> : <Play size={18} />}</button><button type="button" aria-label={`Remove saved sentence: ${card.english}`} onClick={() => onRemove(card.id)}><Bookmark size={17} fill="currentColor" /></button></div></article>)}</div></section>;
}

type SettingsProps = {
  state: LearnerState;
  onSettings: (patch: Partial<LearnerSettings>) => void;
  onExport: () => void;
  onReset: () => void;
};

export function SettingsView({ state, onSettings, onExport, onReset }: SettingsProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  return <div className="view settings-view">
    <header className="view-heading"><div><h1>Settings</h1><p className="view-intro">Default display, audio, and browser data.</p></div></header>
    <section className="settings-card">
      <div className="settings-card-heading"><h2>Practice settings</h2></div>
      <div className="settings-list">
        <SettingRow icon={<Languages />} title="Japanese display" copy="Text shown on lesson cards"><div className="profile-display-options" role="group" aria-label="Japanese display">{([['surface', 'Kanji + kana'], ['kana', 'Kana'], ['romaji', 'Romaji']] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={state.settings.japaneseDisplay === value} onClick={() => onSettings({ japaneseDisplay: value })}>{label}</button>)}</div></SettingRow>
        <SettingRow icon={<Volume2 />} title="Audio" copy="Enable pronunciation playback"><Toggle checked={state.settings.sound} onChange={sound => onSettings({ sound })} label="Sound" /></SettingRow>
        <SettingRow icon={<Play />} title="Automatic audio" copy="Play pronunciation when a card opens"><Toggle checked={state.settings.autoplay} onChange={autoplay => onSettings({ autoplay })} label="Automatic audio" /></SettingRow>
        <SettingRow icon={<Settings2 />} title="Reduce motion" copy="Turn off interface animations"><Toggle checked={state.settings.quietMode} onChange={quietMode => onSettings({ quietMode })} label="Reduce motion" /></SettingRow>
      </div>
    </section>
    <section className="data-card"><span><Download size={20} /></span><div><h3>Export progress</h3><p>Download your practice history, saved lessons, words, and settings.</p></div><button type="button" onClick={onExport}>Export data</button></section>
    <section className="data-card"><span><Settings2 size={20} /></span><div><h3>Start over</h3><p>{confirmReset ? "This permanently deletes your lessons, saved words and sentences, vocabulary and grammar history, review schedules, activity progress, and settings in this browser. Export first if you want a backup." : "Reset all learning data and settings to start as a new learner."}</p></div>{confirmReset ? <div><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button type="button" onClick={onReset}>Delete all data and start over</button></div> : <button type="button" onClick={() => setConfirmReset(true)}>Reset all data</button>}</section>
    <p className="settings-storage-note">Your data is stored in this browser on this device. Topic lessons are saved when you start. Saved lessons preserve their exact cards and your place; export a backup to keep another copy.</p>
  </div>;
}

function SettingRow({ icon, title, copy, children }: { icon: React.ReactNode; title: string; copy: string; children: React.ReactNode }) {
  return <div className="setting-row"><span>{icon}</span><div><strong>{title}</strong><small>{copy}</small></div>{children}</div>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? "on" : ""}`} onClick={() => onChange(!checked)}><span /></button>;
}

