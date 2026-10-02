import fs from 'node:fs';

// Only expand a saved placement plan. Sentence selection never runs in the app
// or implicitly during compilation; every reference is an existing fixed card.
export function applyCuratedRevisits(course, savedPlan) {
  const path='data/jp/curriculum/curated/topic-revisits.json';
  if(!savedPlan&&!fs.existsSync(path))return;
  const plan=savedPlan??JSON.parse(fs.readFileSync(path,'utf8'));
  const original=new Map(course.lessons.map(lesson=>[lesson.id,lesson]));
  const cards=new Map(course.lessons.flatMap(lesson=>lesson.cards.map(card=>[card.id,{card,lesson}])));
  const ordered=[];
  for(const topic of course.topics) {
    const placements=plan.topics[topic.id]??[];
    const pending=new Set(placements.map(p=>p.id));
    const sequence=[];
    for(const id of topic.lessonIds) {
      sequence.push(id);ordered.push(original.get(id));
      for(const placement of placements.filter(p=>p.afterLessonId===id)) {
        const sources=placement.cardIds.map(cardId=>{
          const source=cards.get(cardId);
          if(!source || source.lesson.topicId!==topic.id || !sequence.includes(source.lesson.id))throw new Error(`${placement.id}: invalid or future review source ${cardId}`);
          return source;
        });
        const selected=sources.map(source=>structuredClone(source.card));
        const lesson={id:placement.id,topicId:topic.id,version:placement.version??1,kind:'review',title:placement.title,targets:[],
          reviewOf:[...new Set(sources.map(source=>source.lesson.id))],
          helpers:[...new Set(selected.flatMap(card=>card.tokens.flatMap(token=>token.wordId?[token.wordId]:[])))],
          notes:[{start:1,title:'Recall earlier learning',pattern:'Familiar words and grammar',explanation:'Recall the meaning before revealing the English. Listen, then say the Japanese yourself. These sentences revisit earlier lessons in this topic.'}],
          cards:selected};
        sequence.push(lesson.id);ordered.push(lesson);pending.delete(placement.id);
      }
    }
    if(pending.size)throw new Error(`${topic.id}: review plan has missing placement anchors: ${[...pending].join(', ')}`);
    topic.lessonIds=sequence;
  }
  course.lessons=ordered;
}
