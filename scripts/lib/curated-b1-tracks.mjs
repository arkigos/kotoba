export const b1SourceChapters=["B1-household", "B1-cooking", "B1-travel", "B1-housing", "B1-sports", "B1-education", "B1-health", "B1-language", "B1-technology", "B1-work", "B1-post", "B1-money", "B1-clothing", "B1-shopping", "B1-relationships", "B1-visits", "B1-feelings", "B1-music", "B1-theatre", "B1-art", "B1-reading", "B1-weather", "B1-news", "B1-discussion", "B1-paperwork", "B1-time", "B1-landscape", "B1-directions", "B1-driving", "B1-safety", "B1-leisure", "B1-materials", "B1-plants", "B1-animals", "B1-rules", "B1-science"];
// Explicit chapter and grammar ownership for the B1 editorial conversion.
export const b1Tracks=[
  {
    "id": "B1-daily",
    "title": "Home, choices, and practical tasks",
    "chapters": [
      "household",
      "cooking",
      "housing",
      "money",
      "clothing",
      "shopping",
      "materials"
    ],
    "rules": [
      "resourceFor",
      "adjectiveTe",
      "withoutDoing",
      "conditionalTo",
      "prepare",
      "whileStill",
      "whether",
      "standingArrangement",
      "nounConcession",
      "excess"
    ]
  },
  {
    "id": "B1-travel-nature",
    "title": "Journeys and the natural world",
    "chapters": [
      "travel",
      "weather",
      "landscape",
      "directions",
      "driving",
      "leisure",
      "plants",
      "animals"
    ],
    "rules": [
      "only",
      "depending",
      "byMeans"
    ]
  },
  {
    "id": "B1-work-learning",
    "title": "Work, study, and administration",
    "chapters": [
      "education",
      "technology",
      "work",
      "post",
      "paperwork"
    ],
    "rules": [
      "duringActivity",
      "role",
      "notOnly",
      "sometimes",
      "accordingTo",
      "preparedState",
      "occasion",
      "advice",
      "deadline",
      "arrangement"
    ]
  },
  {
    "id": "B1-people",
    "title": "People, experiences, and time",
    "chapters": [
      "relationships",
      "visits",
      "feelings",
      "time"
    ],
    "rules": [
      "respectfulPresence",
      "suddenSequence",
      "immediateAfter"
    ]
  },
  {
    "id": "B1-culture",
    "title": "Language, reading, and the arts",
    "chapters": [
      "language",
      "music",
      "theatre",
      "art",
      "reading"
    ],
    "rules": [
      "definition",
      "relativeSubjectNo"
    ]
  },
  {
    "id": "B1-public",
    "title": "News, discussion, and public life",
    "chapters": [
      "news",
      "discussion",
      "rules"
    ],
    "rules": [
      "explanation",
      "informationSource",
      "hearsay"
    ]
  },
  {
    "id": "B1-body",
    "title": "Health, activity, and safety",
    "chapters": [
      "sports",
      "health",
      "safety"
    ],
    "rules": [
      "eachTime",
      "parallelChange",
      "recommendation"
    ]
  },
  {
    "id": "B1-science",
    "title": "Science and the environment",
    "chapters": [
      "science"
    ],
    "rules": [
      "adjectiveQuantity"
    ]
  }
];
const descriptions={
 'B1-daily':'Care for your home, prepare food, manage money, and compare everyday choices.',
 'B1-travel-nature':'Plan journeys, find your way, and describe weather, plants, and animals.',
 'B1-work-learning':'Discuss study and work, exchange information, and handle forms and correspondence.',
 'B1-people':'Describe relationships, feelings, shared experiences, and how events unfold.',
 'B1-culture':'Discuss language, books, performances, and visual art.',
 'B1-public':'Read reports, explain reasons, compare figures, and discuss decisions.',
 'B1-body':'Describe physical activity, health, recovery, and practical precautions.',
 'B1-science':'Describe experiments, measurements, materials, and changes in the natural world.',
};
export const b1GrammarOwners=Object.fromEntries(b1Tracks.flatMap(track=>track.rules.map(rule=>[rule,track.id])));

import {b1TrackRevisions} from './curated-b1-track-content.mjs';
import {b1TrackPractice} from './curated-b1-track-practice.mjs';
import {b1TrackNoteRevisions} from './curated-b1-track-notes.mjs';
export function applyB1Tracks(course,token,words){
 const resolve=spec=>{
  const [key,...rest]=spec.split('~');
  if(key.startsWith('@')){
   const matches=words.filter(word=>word.level==='B1'&&word.surface===key.slice(1));
   if(matches.length===1)return token([String(matches[0].rank),...rest].join('~'));
  }
  return token(spec);
 };
 const owners=new Map(b1Tracks.flatMap(track=>track.chapters.map(chapter=>[`B1-${chapter}`,track.id])));
 const used=new Set();
 for(const lesson of course.lessons){
  lesson.chapterId=lesson.topicId;lesson.topicId=owners.get(lesson.topicId);
  if(!lesson.topicId)throw new Error(`No B1 track for ${lesson.chapterId}`);
  for(const card of lesson.cards){
   const revision=b1TrackRevisions[card.id];
   if(!revision)continue;
   used.add(card.id);
   const [line,english]=revision,tokens=line.split(' ').map(resolve);
   Object.assign(card,{tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english});
  }
  for(const [line,english] of b1TrackPractice[lesson.id]??[]){
   const tokens=line.split(' ').map(resolve);
   lesson.cards.push({id:`${lesson.id}-track-${lesson.cards.length+1}`,tokens,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),english,constructionKey:lesson.id,grammarTags:['Practice']});
  }
  lesson.notes=lesson.notes.filter(note=>note.start===1||!note.teaches?.length||note.teaches.some(rule=>b1GrammarOwners[rule]===lesson.topicId));
  for(const note of lesson.notes){
   note.teaches=(note.teaches??[]).filter(rule=>b1GrammarOwners[rule]===lesson.topicId);
   if(note.title==='A new sentence pattern')note.title='Grammar in this lesson';
  }
  const note=lesson.notes.find(n=>n.start===1);
  if(lesson.id==='B1-household-laundry')note.explanation=note.explanation.replace(' A plain clause followed by ので gives an explanatory reason, often more gently than から.','');
  if(lesson.id==='B1-housing-dwellings'){
   note.pattern='住まい / 住居 / 家屋';note.explanation=note.explanation.replace(' として marks the role something serves.','');
  }
  if(lesson.id==='B1-housing-agreement')note.explanation=note.explanation.replace(' かどうか embeds a yes/no question inside a sentence, such as checking whether renewal is possible.','');
  if(lesson.id==='B1-education-school-day'){
   note.pattern='通学の時間 / NだけでなくNも';note.explanation=note.explanation.replace(' Nによって違う means differ depending on N.','');
  }
  if(lesson.id==='B1-weather-forecast'){
   note.pattern='明日の予報 / 気温 / 天候';note.explanation='予報 is a forecast. 気温 is air temperature; 天候 is a more formal word for weather, often used when discussing conditions over a period or for an activity.';
  }
  if(lesson.id==='B1-education-university'){
   note.explanation=note.explanation.replace(' かどうか embeds a yes-or-no question: whether to do something.','');
   lesson.notes.push({start:9,title:'While an activity is in progress',pattern:'Activity noun + 中（ちゅう）',explanation:'Add 中（ちゅう） directly to an activity or state noun: 在学中 means currently enrolled at school. This suffix differs from 中（なか）, inside.',teaches:['duringActivity']});
  }
  if(lesson.id==='B1-work-people')note.teaches.push('role');
  if(lesson.id==='B1-news-sources')lesson.notes.push({start:4,title:'Reporting information',pattern:'Nによると、plain clause + そうです',explanation:'によると names the source. A complete plain clause followed by そうです reports what you heard or read. Nouns and な-adjectives take だ: 元気だそうです. Compare the shorter verb-stem pattern 降りそうです, which describes how likely rain looks.',teaches:['informationSource','hearsay']});
  if(lesson.id==='B1-news-supply-demand')lesson.notes.push({start:6,title:'Giving an explanation',pattern:'plain clause + ので',explanation:'ので connects a situation to its reason. Use a plain clause before it; nouns and な-adjectives take な. It often gives a gentler explanation than から.',teaches:['explanation']});
  const revision=b1TrackNoteRevisions[lesson.id];
  if(revision)[note.pattern,note.explanation]=revision;
  for(const helper of lesson.notes)if(helper.title==='Grammar in this lesson'&&!helper.teaches?.length)helper.title=lesson.targets.length?'Word usage':'In this passage';
  lesson.notes.sort((a,b)=>a.start-b.start);
  lesson.helpers=[...new Set(lesson.cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId&&!lesson.targets.includes(t.wordId)?[t.wordId]:[])))];
  lesson.version+=1;
 }
 for(const id of Object.keys(b1TrackRevisions))if(!used.has(id))throw new Error(`Unapplied B1 revision ${id}`);
 course.topics=b1Tracks.map(({chapters,rules,...track})=>{
  const lessons=course.lessons.filter(l=>l.topicId===track.id).sort((a,b)=>chapters.indexOf(a.chapterId.slice(3))-chapters.indexOf(b.chapterId.slice(3)));
  return {...track,level:'B1',description:descriptions[track.id],wordIds:lessons.flatMap(l=>l.targets),lessonIds:lessons.map(l=>l.id)};
 });
 const byId=new Map(course.lessons.map(l=>[l.id,l]));
 course.lessons=course.topics.flatMap(t=>t.lessonIds.map(id=>byId.get(id)));
 course.progression='independent-tracks';course.grammarOwners=b1GrammarOwners;
}
