import fs from 'node:fs';

const path = 'data/jp/curriculum/starter_lessons.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const [identity, pointing, adjectives, existence, linking] = data.lessons;
identity.version = 2;
identity.acceptedCompletionVersions = [1];
identity.title = 'Starter 1 · Statements and questions';
identity.description = 'Use は and です to make a polite statement, then か to ask a question.';
identity.notes = [
  { start: 1, title: 'Statements with は and です', pattern: '私 は 学生 です', explanation: 'は marks who or what you are talking about. It is written は but pronounced wa. Put the person’s role next, then です. In this pattern, です makes the statement polite and corresponds to am, is or are.' },
  { start: 10, title: 'Questions with か', pattern: '友達 は 会社員 です か', explanation: 'Put か after です to ask a question. あなた means you, but in conversation people often use a name or leave out the person when it is clear who they mean.' },
];
// These six complete questions have an ordinary reason to be asked. Avoid
// padding the run with first-person questions about one's own occupation.
const originals = identity.cards.slice(0, 9);
const questionToken = pointing.cards[9].tokens.at(-1);
const questions = [8, 7, 4, 3, 2, 1].map((index, offset) => {
  const original = originals[index];
  const card = structuredClone(original);
  card.id = `starter-identity-v2-${String(10 + offset).padStart(2, '0')}`;
  card.tokens.push(structuredClone(questionToken));
  card.line.push(questionToken.surface);
  card.tts.push(questionToken.reading);
  card.explain.push(questionToken.explain);
  card.english = original.english.startsWith('You are ')
    ? `Are you ${original.english.slice(8)}?`
    : `Is your friend ${original.english.slice(13)}?`;
  card.constructionKey = 'starter-identity-question';
  card.grammarTags.push('か');
  return card;
});
identity.cards = [...originals, ...questions];

pointing.title = 'Starter 2 · This and that: これ・それ・あれ';
pointing.description = 'Use これ, それ and あれ to identify something by its distance from you and the listener.';
pointing.notes = pointing.notes.filter(note => note.start === 1);
adjectives.title = 'Starter 3 · Describing with い-adjectives';
adjectives.description = 'Describe size and age with 大きい, 小さい, 新しい and 古い.';
existence.title = 'Starter 4 · Presence and absence: あります・います';
existence.description = 'Say whether a thing or person is there, and ask about their presence.';
existence.notes = existence.notes.filter(note => ![4, 13].includes(note.start));
existence.notes.find(note => note.start === 10).title = 'People and animals: います';
linking.title = 'Starter 5 · Possession and “also”: の・も';
linking.description = 'Link an owner to a thing with の, and add another matching person or thing with も.';
linking.notes.find(note => note.start === 13).title = 'も after an ownership phrase';
fs.writeFileSync(path, JSON.stringify(data, null, 2) + '\n');

const grammarPath = 'data/jp/curriculum/curated/grammar-instruction.json';
const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
grammar.foundations[identity.id] = [
  { start: 1, teaches: ['topic', 'copula'], evidence: identity.notes[0].explanation },
  { start: 10, teaches: ['question'], evidence: identity.notes[1].explanation },
];
delete grammar.foundations[pointing.id];
fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2) + '\n');
