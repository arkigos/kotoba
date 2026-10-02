import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { applyCourseOrder } from './curated-course-order.mjs';
import { applyGrammarInstruction } from './curated-grammar-instruction.mjs';
import { applyCuratedRevisits } from './curated-revisits.mjs';
import { applyA1Tracks } from './curated-a1-tracks.mjs';

// Development-only compiler. The browser receives frozen token-aligned cards.
// No POS inference, sentence search, or runtime substitutions are permitted.
const rows = JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json', 'utf8')).filter(row => row[8] === 'A1');
const bindings = JSON.parse(fs.readFileSync('data/jp/dictionary/course_bindings.json', 'utf8')).words;
const starters = JSON.parse(fs.readFileSync('data/jp/curriculum/starter_lessons.json', 'utf8')).lessons;
if (createHash('sha256').update(JSON.stringify(rows.map(row => row[0]))).digest('hex') !== 'c31656bad01c7201f1a0212a7ae915ad79f9fbe84e6961fe4df65fe11422f624') throw new Error('A1 identities/order changed: migrate and review the rank-based source before compiling.');
export const words = rows.map((r, i) => ({ rank: i + 1, id: r[0], surface: r[1], reading: r[2], meaning: r[3] }));
export const word = n => words[n - 1];
// These two historical local demonstratives predate the dictionary import.
export const aliases = JSON.parse(fs.readFileSync('data/jp/dictionary/curated-course-aliases.json', 'utf8')).aliases;
export const foundationIds = new Set(starters.flatMap(s => s.targets.map(id => aliases[bindings[id]?.entryId] ?? bindings[id]?.entryId ?? id)));
export const forms = {
  'は': ['わ', 'topic marker; pronounced wa'], 'が': ['が', 'subject marker'],
  'を': ['お', 'object marker; pronounced o'], 'に': ['に', 'destination, time, or location marker'],
  'で': ['で', 'place of an action or means'], 'の': ['の', 'links nouns; possession or description'],
  'と': ['と', 'and; with'], 'も': ['も', 'also; too'], 'か': ['か', 'question marker'],
  'ね': ['ね', 'invites agreement'], 'よ': ['よ', 'gives information'],
  'から': ['から', 'from; because'], 'まで': ['まで', 'until; as far as'],
  'です': ['です', 'polite statement ending'], 'でした': ['でした', 'polite past statement ending'],
  'な': ['な', 'links a な-adjective to a noun'],
  'だ': ['だ', 'plain copula; used before と in a quoted thought'],
  '／': ['／', 'change of speaker in a short dialogue'],
  '。': ['。', 'end of an utterance'],
  '、': ['、', 'short pause'],
  '時': ['じ', 'o’clock; follows an hour number'], '月': ['がつ', 'calendar month; follows a number'],
  '日': ['にち', 'day counter; special readings are taught separately'],
  'ではありませんでした': ['でわありませんでした', 'polite past negative: was not'],
  'ではありません': ['でわありません', 'polite negative: is not'],
  'ください': ['ください', 'please give me; please do'],
  'ませんか': ['ませんか', 'polite invitation'], 'ましょう': ['ましょう', 'let us'],
  'たいです': ['たいです', 'want to do'], 'てもいいですか': ['てもいいですか', 'may I do this?'],
  'ないでください': ['ないでください', 'please do not'],
};
export const course = { version: 1, poolVersion: 'kotoba-study-pools-2026-09-21-v1', levels: ['A1','A2','B1','B2','C1','C2'], aliases, foundationIds: [...foundationIds], topics: [], lessons: [], functionForms: forms };
let current;
export function useTopic(id) {
  current = course.topics.find(t => t.id === `A1-${id}`);
  if (!current) throw new Error(`Unknown topic ${id}`);
}
export function topic(id, title, description) {
  current = { id: `A1-${id}`, level: 'A1', title, description, wordIds: [], lessonIds: [] };
  course.topics.push(current);
}
/** Every lexical form refers to its explicit dictionary identity: rank~surface~reading.
 * Inflections are authored here, never guessed from a dictionary part of speech. */
export function token(spec) {
  const [rank, surface, reading] = spec.split('~');
  if (/^\d+$/.test(rank)) {
    const w = word(Number(rank));
    if (!w) throw new Error(`Unknown rank ${rank}`);
    return { wordId: w.id, dictionaryEntryId: w.id, surface: surface ?? w.surface, reading: reading ?? w.reading, explain: w.meaning };
  }
  if (!forms[spec]) throw new Error(`Undeclared function form ${spec}`);
  return { surface: spec, reading: forms[spec][0], explain: forms[spec][1] };
}
export function lesson(slug, title, targets, pattern, explanation, sentences) {
  const id = `${current.id}-${slug}`;
  const cards = sentences.map(([line, english], index) => {
    const tokens = line.trim().split(/\s+/).map(token);
    const expressions = [12,13,14,15,16,17,18,19,380,389,390,394,466,468,717,718,719,720,721,722,746,747,748,749,750].map(n=>word(n).id);
    const expression = tokens.length === 1 && expressions.includes(tokens[0].wordId);
    return { id: `${id}-v1-${String(index + 1).padStart(3, '0')}`, ...(expression ? { kind: 'social-expression' } : {}), line: tokens.map(t => t.surface), tts: tokens.map(t => t.reading), explain: tokens.map(t => t.explain), tokens, english: (english.charAt(0).toUpperCase() + english.slice(1)).replaceAll('a older', 'an older'), constructionKey: id, grammarTags: [pattern] };
  });
  const targetIds = targets.map(n => word(n).id);
  const helpers = [...new Set(cards.flatMap(c => c.tokens.flatMap(t => t.wordId && !targetIds.includes(t.wordId) ? [t.wordId] : [])))];
  course.lessons.push({ id, topicId: current.id, version: 1, title, targets: targetIds, helpers, notes: [{ start: 1, title: 'Grammar in this lesson', pattern, explanation }], cards });
  current.lessonIds.push(id); current.wordIds.push(...targetIds);
}
export function lines(entries, patterns) {
  return patterns.flatMap(([jp, en]) => entries.map(([id, meaning]) => [jp.replaceAll('$', String(id)), en.replaceAll('$', meaning)]));
}
export function finish() {
  applyCourseOrder(course, ['greetings','food','people','home','nature','time','learning','shopping','routine','leisure','travel','health','quantity','conversation'].map(id=>`A1-${id}`));
  applyGrammarInstruction(course);
  applyA1Tracks(course,token);
  if(process.argv.includes('--draft')){
    fs.writeFileSync('.codex-a1-track-draft.json',JSON.stringify(course,null,2)+'\n');
    console.log('Wrote instructional draft for offline recall planning.');
    return;
  }
  applyCuratedRevisits(course);
  const assigned = new Set([...foundationIds, ...course.topics.flatMap(t => t.wordIds)]);
  const missing = words.filter(w => !assigned.has(w.id));
  fs.mkdirSync('data/jp/curriculum/curated', { recursive: true });
  fs.writeFileSync('data/jp/curriculum/curated/a1.json', JSON.stringify(course, null, 2) + '\n');
  fs.writeFileSync('data/jp/curriculum/curated/a1-words.json', JSON.stringify(words, null, 2) + '\n');
  console.log(`${course.topics.length} topics, ${course.lessons.length} lessons, ${course.lessons.reduce((n,l)=>n+l.cards.length,0)} cards; ${assigned.size}/${words.length} words assigned`);
  console.log('Unassigned:', missing.map(w => `${w.rank} ${w.surface}`).join(', '));
}
