import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookmarkPlus, Check, Clock3, Eye, EyeOff, Layers3, Plus, RefreshCw, Search, SlidersHorizontal, X } from "lucide-react";
import { proficiencyLevels, type Lexeme, type ProficiencyLevel, type SessionSnapshot } from "../../../packages/learning-engine";
import { buildLessonPlan, builderLexicon, builderRecipes, builderSupportedSenseCount, compatibleSenses, generationMessage, templatesForLevel, type BuilderFocus } from "./generated";
import { wordById } from "./curriculum";
import type { LearnerState } from "./types";
import "./lesson-builder.css";

const emptyContext = { wordHistory: {} };
const patterns: Record<string, { label: string; example: string; translation: string; tag: string }> = {
  classroom: { label: "Reading and writing", example: "私は日本語を読みます", translation: "I read Japanese", tag: "Actions · を" },
  actions: { label: "Actions", example: "私は本を使います", translation: "I use the book", tag: "Subject · object · verb" },
  meals: { label: "Eating", example: "私はパンを食べます", translation: "I eat bread", tag: "Food · を" },
  drinks: { label: "Drinking", example: "私はコーヒーを飲みます", translation: "I drink coffee", tag: "Drinks · を" },
  movement: { label: "Going and returning", example: "学生は学校に行きました", translation: "The student went to the school", tag: "Movement · に" },
  existence: { label: "People and things", example: "公園に学生がいます", translation: "There is a student in the park", tag: "Existence · が" },
  adjectives: { label: "い-adjectives", example: "本は大きいです", translation: "The book is big", tag: "Descriptions" },
  identity: { label: "People and identities", example: "私は学生です", translation: "I am a student", tag: "Identity · です" },
  places: { label: "な-adjectives", example: "公園はきれいです", translation: "The park is clean", tag: "Descriptions" },
};
const focuses: Array<{ id: BuilderFocus; label: string; description: string }> = [
  { id: "balanced", label: "Template sequence", description: "Use the template's grammar forms in their listed order." },
  { id: "present", label: "Present", description: "Stay with affirmative present and habitual sentences." },
  { id: "negative", label: "Negative", description: "Affirmative sentences followed by negative forms." },
  { id: "past", label: "Past", description: "Present forms followed by past forms." },
  { id: "questions", label: "Questions", description: "Statements followed by yes/no questions." },
];
const lexemeById = new Map(builderLexicon.entries.map(entry => [entry.id, entry]));
const normalize = (value: string) => value.normalize("NFKC").toLocaleLowerCase().trim();
function selectedSenses(words: string[]) {
  return [...new Set(words)].map(wordId => {
    const matches = builderLexicon.entries.filter(entry => entry.wordId === wordId);
    return matches.length === 1 ? matches[0].id : `unsupported:${wordId}`;
  });
}
function bestPattern(words: string[]) {
  const senses = selectedSenses(words);
  return Object.keys(patterns).sort((a, b) => {
    const matches = (key: string) => senses.filter(id => compatibleSenses(key).includes(id)).length;
    return matches(b) - matches(a);
  })[0];
}
function wordLabel(id: string) {
  return lexemeById.get(id)?.lemma.surface ?? (id.startsWith("unsupported:") ? wordById(id.slice(12))?.surface : undefined) ?? id;
}
function wordKind(entry: Lexeme) { return entry.kind === "noun" ? "Nouns" : entry.kind === "verb" ? "Verbs" : "Adjectives"; }
function phaseLabel(id: string) {
  return ({ warmup: "Present", negative: "Negative", past: "Past", questions: "Questions", present: "Present", "past-negative": "Past negative", movement: "Past" } as Record<string, string>)[id] ?? id;
}

export function LessonBuilder({ reviewWords, onStart, onSave, initialCount, onBack, state, onReviewMixins }: {
  reviewWords?: string[];
  onStart: (snapshot: SessionSnapshot, startingIndex?: number) => void;
  onSave?: (snapshot: SessionSnapshot) => void;
  initialCount?: number;
  onBack: () => void;
  state?: LearnerState;
  onReviewMixins?: (enabled: boolean) => void;
}) {
  const [pattern, setPattern] = useState(() => reviewWords ? bestPattern(reviewWords) : "classroom");
  const [selected, setSelected] = useState(() => reviewWords ? selectedSenses(reviewWords) : [...builderRecipes.classroom.targetSenseIds]);
  const [seed, setSeed] = useState(42);
  const [level, setLevel] = useState<ProficiencyLevel>("A1");
  const [includeEarlier, setIncludeEarlier] = useState(false);
  const [cardCount, setCardCount] = useState(() => initialCount ?? 36);
  const [lessonTitle, setLessonTitle] = useState("");
  const [focus, setFocus] = useState<BuilderFocus>("balanced");
  const [includeReview, setIncludeReview] = useState(state?.settings.reviewMixins ?? true);
  const [wordQuery, setWordQuery] = useState("");
  const [wordFilter, setWordFilter] = useState("All words");
  const [wordPool, setWordPool] = useState<"all" | "mine" | "new">("all");
  const [sentenceQuery, setSentenceQuery] = useState("");
  const [showReading, setShowReading] = useState(false);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showAllSelected, setShowAllSelected] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const [now] = useState(Date.now);
  const context = state ?? emptyContext;
  const availableTemplates = templatesForLevel(level, includeEarlier);
  const templateAvailable = availableTemplates.includes(pattern);
  const compatible = compatibleSenses(pattern, level);
  const template = builderRecipes[pattern];
  const unsupported = selected.filter(id => !compatible.includes(id));
  const result = useMemo(() => {
    if (!templateAvailable) return {};
    try { return { snapshot: buildLessonPlan(pattern, selected, seed, context, { level, includeReview, review: !!reviewWords, now, cardCount, focus }) }; }
    catch (error) { return { error: generationMessage(error) }; }
  }, [pattern, selected, seed, reviewWords, context, includeReview, now, level, cardCount, focus, templateAvailable]);
  const helpers = result.snapshot?.recipe.helperSenseIds ?? template.helperSenseIds.filter(id => !selected.includes(id));
  const reviewSelection = result.snapshot?.reviewSelection;
  const wordChoices = builderLexicon.entries.filter(entry => compatible.includes(entry.id)).sort((a, b) => Number(template.targetSenseIds.includes(b.id)) - Number(template.targetSenseIds.includes(a.id)));
  const myWords = new Set([...Object.keys(context.wordHistory), ...(state?.savedWordIds ?? [])]);
  const wordPoolCounts = { all: wordChoices.length, mine: wordChoices.filter(entry => myWords.has(entry.wordId)).length, new: wordChoices.filter(entry => !myWords.has(entry.wordId)).length };
  const filters = ["All words", ...["Nouns", "Verbs", "Adjectives"].filter(kind => wordChoices.some(entry => wordKind(entry) === kind))];
  const visibleWords = wordChoices.filter(entry => (wordPool === "all" || (wordPool === "mine" ? myWords.has(entry.wordId) : !myWords.has(entry.wordId))) && (wordFilter === "All words" || wordKind(entry) === wordFilter) && normalize(`${entry.lemma.surface} ${entry.lemma.reading} ${entry.meaning} ${entry.wordId}`).includes(normalize(wordQuery)));
  const hiddenSelected = selected.filter(id => !visibleWords.some(entry => entry.id === id) && compatible.includes(id)).length;
  const otherTemplateMatches = wordQuery.trim() && !visibleWords.length ? availableTemplates.filter(key => key !== pattern).flatMap(key => {
    const permitted = new Set(compatibleSenses(key, level));
    const matches = builderLexicon.entries.filter(entry => permitted.has(entry.id) && normalize(`${entry.lemma.surface} ${entry.lemma.reading} ${entry.meaning}`).includes(normalize(wordQuery)));
    return matches.length ? [{ key, count: matches.length }] : [];
  }).sort((a, b) => b.count - a.count).slice(0, 3) : [];
  const visibleCards = result.snapshot?.cards.map((card, index) => ({ card, index })).filter(({ card }) => normalize(`${card.line.join("")} ${card.tts.join("")} ${card.english}`).includes(normalize(sentenceQuery))) ?? [];
  const selectPattern = (key: string) => {
    setPattern(key);
    setWordFilter("All words");
    setWordQuery("");
    setSentenceQuery("");
    if (!reviewWords) setSelected([...builderRecipes[key].targetSenseIds]);
  };
  const toggle = (id: string) => setSelected(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const namedSnapshot = (snapshot: SessionSnapshot): SessionSnapshot => lessonTitle.trim()
    ? { ...snapshot, recipe: { ...snapshot.recipe, title: lessonTitle.trim() } } : snapshot;

  return <div className="view lesson-studio">
    <button type="button" className="studio-back" onClick={onBack}><ArrowLeft size={16} /> {reviewWords ? "Back to Dictionary" : "Back to Course"}</button>
    <header className="view-heading studio-heading">
      <div><h1>{reviewWords ? "Build a review" : "Build a lesson"}</h1><p className="view-intro">Choose a template, words, and card count. Preview each sentence before starting.</p></div>
      <div className="studio-heading-actions"><button type="button" className="studio-preview-jump" onClick={() => previewRef.current?.scrollIntoView({ block: "start" })}>Preview {result.snapshot ? `${result.snapshot.cards.length} sentences` : "lesson"} <ArrowRight size={14} /></button></div>
    </header>

    <section className="studio-pattern-section" aria-label="Lesson templates">
      <div className="studio-section-heading"><h2>Templates</h2><p>{availableTemplates.length} available</p></div>
      <div className="studio-template-filters"><div className="studio-chips" role="group" aria-label="Template level">{proficiencyLevels.map(value => <button key={value} type="button" aria-pressed={level === value} onClick={() => { setLevel(value); setIncludeEarlier(false); }}>{value}</button>)}</div>{level !== "A1" && <label><input type="checkbox" checked={includeEarlier} onChange={event => setIncludeEarlier(event.target.checked)} />Include earlier levels</label>}</div>
      {!availableTemplates.length && <div className="studio-template-empty"><h3>No {level} templates yet</h3><p>The available sentence structures are A1. Choosing a higher level does not make those structures more advanced.</p><button type="button" onClick={() => setIncludeEarlier(true)}>Show earlier templates</button></div>}
      {level !== "A1" && includeEarlier && <p className="studio-level-note">Earlier templates retain their original grammar level. Words are limited to {level} or below.</p>}
      <div className="studio-pattern-grid">{Object.entries(patterns).filter(([key]) => availableTemplates.includes(key)).map(([key, value]) => <button key={key} type="button" aria-pressed={pattern === key} onClick={() => selectPattern(key)}>
        <span className="studio-pattern-top"><small>{builderRecipes[key].level ?? "A1"} · {value.tag}</small>{pattern === key ? <Check size={16} /> : <Plus size={15} />}</span>
        <strong>{value.label}</strong><span lang="ja" className="studio-pattern-example">{value.example}</span><span className="studio-pattern-translation">{value.translation}</span>
      </button>)}</div>
    </section>

    {templateAvailable && <div className="studio-layout">
      <div className="studio-controls">
        <section className="studio-panel" aria-label="Lesson recipe">
          <div className="studio-section-heading"><h2>Lesson settings</h2><SlidersHorizontal size={17} /></div>
          <div className="studio-field"><h3>Cards</h3><div className="studio-card-count"><div className="studio-chips" role="group" aria-label="Card count">{[12, 24, 36, 60].map(value => <button key={value} type="button" aria-pressed={cardCount === value} onClick={() => setCardCount(value)}>{value}</button>)}</div><label>Custom<input type="number" min={6} max={120} step={1} aria-label="Custom card count" value={cardCount} onChange={event => setCardCount(Number(event.target.value))} /></label></div><p className="studio-hint">6–120 cards. Larger word selections may need more cards to repeat each word.</p></div>
          <div className="studio-field"><h3>Grammar forms</h3><div className="studio-chips" role="group" aria-label="Grammar forms">{focuses.map(option => <button key={option.id} type="button" aria-pressed={focus === option.id} onClick={() => setFocus(option.id)}>{option.label}</button>)}</div><p className="studio-hint">{focuses.find(option => option.id === focus)?.description}</p></div>
        </section>

        <section className="studio-panel studio-word-panel" aria-label="Choose target words">
          <div className="studio-section-heading"><h2>Target words</h2><span className="studio-count-pill">{selected.length} selected</span></div>
          <p className="studio-hint">Selected words repeat throughout the lesson. Search by Japanese, reading, or English.</p>
          <div className="studio-selected-words" aria-label="Selected words">{(showAllSelected ? selected : selected.slice(0, 12)).map(id => <button key={id} type="button" className={unsupported.includes(id) ? "unavailable" : ""} onClick={() => toggle(id)} aria-label={`Remove ${wordLabel(id)}`}><span lang="ja">{wordLabel(id)}</span><X size={12} /></button>)}{selected.length > 12 && <button type="button" onClick={() => setShowAllSelected(value => !value)}>{showAllSelected ? "Show fewer" : `+ ${selected.length - 12} more`}</button>}{!selected.length && <span className="studio-hint">Pick a few words below to get started.</span>}</div>
          <div className="studio-word-actions"><button type="button" onClick={() => setSelected([...template.targetSenseIds])}>Use suggested words</button>{selected.length > 0 && <button type="button" onClick={() => setSelected([])}>Clear selection</button>}</div>
          <div className="studio-word-pool" role="group" aria-label="Word pool">{([["all", "All compatible words"], ["mine", "My words"], ["new", "New words"]] as const).map(([value, label]) => <button key={value} type="button" aria-pressed={wordPool === value} onClick={() => setWordPool(value)}>{label}<span>{wordPoolCounts[value]}</span></button>)}</div>
          <p className="studio-pool-explanation">All compatible words includes vocabulary you haven’t learned. My words contains practiced or saved words. Each template still requires words that fit its grammar and meaning.</p>
          <label className="studio-search"><Search size={17} /><input type="search" aria-label="Search compatible words" placeholder="Find a word…" value={wordQuery} onChange={event => setWordQuery(event.target.value)} />{wordQuery && <button type="button" onClick={() => setWordQuery("")} aria-label="Clear word search"><X size={14} /></button>}</label>
          <div className="studio-word-filters studio-chips" role="group" aria-label="Word categories">{filters.map(filter => <button key={filter} type="button" aria-pressed={wordFilter === filter} onClick={() => setWordFilter(filter)}>{filter}</button>)}</div>
          {unsupported.length > 0 && <div className="studio-unavailable"><strong>Some words aren't available here</strong><p>Choose another template, or remove incompatible words from this lesson.</p>{selected.length > unsupported.length && <button type="button" onClick={() => setSelected(current => current.filter(id => compatible.includes(id)))}>Use compatible words · {selected.length - unsupported.length}</button>}<details open={unsupported.length <= 6}><summary>{unsupported.length} unavailable word{unsupported.length === 1 ? "" : "s"}</summary>{unsupported.map(id => <label key={id}><input type="checkbox" checked onChange={() => toggle(id)} aria-label={`Practice ${wordLabel(id)}`} /><span lang="ja">{wordLabel(id)}</span></label>)}</details></div>}
          <div className="studio-word-grid">{visibleWords.map(entry => <label key={entry.id} className={selected.includes(entry.id) ? "selected" : ""}>
            <input type="checkbox" checked={selected.includes(entry.id)} onChange={() => toggle(entry.id)} aria-label={`Practice ${entry.lemma.surface}`} />
            <span className="studio-word-check">{selected.includes(entry.id) ? <Check size={13} /> : <Plus size={13} />}</span>
            <span className="studio-word-info"><strong lang="ja">{entry.lemma.surface}</strong>{entry.lemma.reading !== entry.lemma.surface && <span lang="ja">{entry.lemma.reading}</span>}<small>{entry.meaning}</small><span className="studio-word-knowledge">{myWords.has(entry.wordId) ? "In my words" : "New word"}</span></span>
          </label>)}</div>
          {!visibleWords.length && <p className="studio-empty">{wordPool === "mine" ? "No practiced or saved words match. Choose All compatible words to include new vocabulary." : "No matching words. Change the search, category, or template."}</p>}
          {!!otherTemplateMatches.length && <div className="studio-other-matches"><span>Matching words in other templates</span>{otherTemplateMatches.map(({ key, count }) => <button key={key} type="button" onClick={() => { const query = wordQuery; selectPattern(key); setWordQuery(query); setWordPool("all"); }}>{patterns[key].label}<small>{count} word{count === 1 ? "" : "s"}</small><ArrowRight size={12} /></button>)}</div>}
          {hiddenSelected > 0 && <p className="studio-hidden-selection">{hiddenSelected} selected word{hiddenSelected === 1 ? " is" : "s are"} hidden by these filters. <button type="button" onClick={() => { setWordPool("all"); setWordFilter("All words"); setWordQuery(""); }}>Show all compatible words</button></p>}
          <p className="studio-availability">{wordChoices.length} compatible words in this template · {builderSupportedSenseCount} supported word senses across the builder.</p>
          <details className="studio-support"><summary>Supporting words · {helpers.length}</summary><p>These complete the sentences. Select one above to include it in the repetition targets.</p><div>{helpers.map(id => <span key={id} lang="ja">{wordLabel(id)}</span>)}</div></details>
        </section>

        <section className="studio-panel studio-review" aria-label="Review additions">
          <label className="studio-toggle"><span><strong>Include review words</strong></span><input aria-label="Include review words" type="checkbox" checked={includeReview} onChange={event => { setIncludeReview(event.target.checked); onReviewMixins?.(event.target.checked); }} /></label>
          <p className="studio-hint">Up to two words from your history, with due and prioritized words first.</p>
          {includeReview && reviewSelection && <>{reviewSelection.additions.length ? <ul>{reviewSelection.additions.map(word => <li key={word.wordId}><strong lang="ja">{wordById(word.wordId)?.surface ?? word.wordId}</strong><span>{word.reason} · at least 4 appearances</span></li>)}</ul> : <small className="studio-hint">{Object.keys(context.wordHistory).length ? "No extra review words fit this lesson." : "Your practice history will supply review words here."}</small>}{reviewSelection.deferred.length > 0 && <details><summary>{reviewSelection.deferred.length} review word{reviewSelection.deferred.length === 1 ? "" : "s"} not included</summary><ul>{reviewSelection.deferred.slice(0, 8).map(word => <li key={word.wordId}><strong lang="ja">{wordById(word.wordId)?.surface ?? word.wordId}</strong><span>{word.reason}</span></li>)}</ul></details>}</>}
        </section>
      </div>

      <section ref={previewRef} className="studio-preview" aria-label="Lesson preview">
        <div className="studio-preview-top"><div><h2>Preview</h2></div><button type="button" className="studio-shuffle" onClick={() => setSeed(value => (value + 1) >>> 0)} disabled={!result.snapshot}><RefreshCw size={15} /><span>New sequence</span></button></div>
        {result.error && <div className="studio-build-error"><Layers3 size={27} /><h3>Lesson could not be built</h3><p role="alert">{result.error}</p><div><button type="button" onClick={() => setSelected([...template.targetSenseIds])}>Use suggested words</button>{cardCount < 120 && unsupported.length === 0 && selected.length > 0 && <button type="button" onClick={() => setCardCount(value => Math.min(120, Math.max(36, value + 12)))}>Add more cards</button>}</div></div>}
        {result.snapshot && <>
          <div className="studio-preview-stats"><span><Layers3 size={14} /> {result.snapshot.cards.length} sentences</span><span><Clock3 size={14} /> About {Math.max(2, Math.round(result.snapshot.cards.length / 5))} min</span></div>
          <label className="studio-lesson-name"><span>Lesson name <small>optional</small></span><input type="text" aria-label="Lesson name" placeholder={result.snapshot.recipe.title} value={lessonTitle} maxLength={100} onChange={event => setLessonTitle(event.target.value)} /></label>
          <div className="studio-launch-actions"><button type="button" className="studio-start" onClick={() => onStart(namedSnapshot(result.snapshot!))}>Start this lesson <ArrowRight size={17} /></button>{onSave && <button type="button" className="studio-save" onClick={() => onSave(namedSnapshot(result.snapshot!))}><BookmarkPlus size={16} />Save lesson</button>}</div>
          <p className="studio-preview-caption">Or start anywhere below. This exact sequence is kept when you pause.</p>
          <div className="studio-preview-controls"><label className="studio-search"><Search size={15} /><input type="search" aria-label="Search preview sentences" placeholder="Find a sentence…" value={sentenceQuery} onChange={event => setSentenceQuery(event.target.value)} /></label><div className="studio-chips" role="group" aria-label="Preview display"><button type="button" aria-pressed={showReading} onClick={() => setShowReading(value => !value)}>Readings</button><button type="button" aria-pressed={showEnglish} onClick={() => setShowEnglish(value => !value)}>{showEnglish ? <Eye size={13} /> : <EyeOff size={13} />} English</button></div></div>
          <ol className="studio-sentence-list">{visibleCards.map(({ card, index }) => {
            const snapshot = result.snapshot!;
            const phase = snapshot.transitions[index];
            const previous = snapshot.cards[index - 1];
            return <li key={index}>{phase.kind !== "substitution" && <div className="studio-phase"><span>{phaseLabel(phase.phaseId)}</span><i /></div>}<button type="button" onClick={() => onStart(namedSnapshot(snapshot), index)} aria-label={`Start at sentence ${index + 1}: ${card.english}`}>
              <span className="studio-sentence-number">{String(index + 1).padStart(2, "0")}</span><div><p lang="ja">{card.tokens.map((token, tokenIndex) => <span key={tokenIndex} className={previous && phase.kind === "substitution" && token.surface !== previous.tokens[tokenIndex]?.surface ? "studio-changed-word" : ""}>{showReading && token.surface !== token.reading ? <ruby>{token.surface}<rt>{token.reading}</rt></ruby> : token.surface}</span>)}</p>{showEnglish && <small>{card.english}</small>}</div><ArrowRight size={14} className="studio-sentence-go" />
            </button></li>;
          })}</ol>
          {!visibleCards.length && <p className="studio-empty">No sentences match that search.</p>}
          <div className="studio-preview-footer"><span>{sentenceQuery ? `${visibleCards.length} matches` : `${result.snapshot.cards.length} sentences`}</span><span><i /> Word changed</span></div>
          <details className="studio-coverage"><summary>Practice per word</summary><div>{selected.map(id => <span key={id}><strong lang="ja">{wordLabel(id)}</strong><small>{result.snapshot!.coverage[id] ?? 0} appearances</small></span>)}</div></details>
        </>}
      </section>
    </div>}
  </div>;
}
