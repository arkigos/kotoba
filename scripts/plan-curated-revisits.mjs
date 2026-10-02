import fs from 'node:fs';

// An offline proposal tool, deliberately separate from authoring and playback.
// Inspect the expanded bilingual packet and audit before accepting its result.
const dir='data/jp/curriculum/curated';
const path=`${dir}/topic-revisits.json`;
const plan=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,'utf8')):{version:1,policy:{minimumLessons:3,minimumCardAppearances:6,idealInterveningLessons:[2,5],maximumCards:12},topics:{}};
plan.policy.minimumCards=4;
const requested=process.argv.find(arg=>arg.startsWith('--topics='))?.split('=')[1].split(',');
const source=process.argv.find(arg=>arg.startsWith('--source='))?.slice('--source='.length);
const courses=source?[JSON.parse(fs.readFileSync(source,'utf8'))]:fs.readdirSync(dir).filter(name=>/^[abc][12]\.json$/.test(name)).map(name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')));
const norm=card=>card.tts.join('').normalize('NFKC').replace(/[\p{P}\p{Z}\s]/gu,'');
let added=0;
let preserved=0;
for(const course of courses)for(const topic of course.topics) {
  if(requested&&!requested.includes(topic.id))continue;
  if(!requested&&plan.topics[topic.id])continue;
  const lessons=topic.lessonIds.map(id=>course.lessons.find(l=>l.id===id)).filter(l=>l.kind!=='review');
  const slots=new Map();
  for(const [index,lesson] of lessons.entries())for(const wordId of lesson.targets) {
    const uses=lessons.map(l=>l.cards.filter(c=>c.tokens.some(t=>t.wordId===wordId)));
    const later=uses.slice(index+1).filter(cards=>cards.length).length;
    const total=uses.reduce((sum,cards)=>sum+cards.length,0);
    const rounds=Math.max(0,2-later,Math.ceil((6-total)/2));
    if(rounds>2||uses[index].length<2)throw new Error(`${lesson.id}: fix introductory coverage before planning review.`);
    for(const delay of rounds===2?[2,5]:rounds===1?[5]:[]) {
      const slot=index+delay;
      if(!slots.has(slot))slots.set(slot,new Map());
      // Two already-authored contexts for the word; references stay inspectable.
      for(const card of uses[index].slice(0,2))slots.get(slot).set(card.id,card);
    }
  }
  const placements=[];
  let serial=0;
  for(const [slot,selected] of [...slots].sort(([a],[b])=>a-b)) {
    const batches=[];let batch=[],seen=new Set();
    for(const card of selected.values()) {
      if(batch.length===12||seen.has(norm(card))){batches.push(batch);batch=[];seen=new Set();}
      batch.push(card.id);seen.add(norm(card));
    }
    if(batch.length)batches.push(batch);
    for(const cardIds of batches) {
      serial++;
      placements.push({id:`${topic.id}-revisit-${String(serial).padStart(2,'0')}`,title:`Review ${serial} · ${topic.title}`,afterLessonId:lessons[Math.min(slot,lessons.length-1)].id,cardIds});
    }
  }
  const byId=new Map(lessons.flatMap(lesson=>lesson.cards.map(card=>[card.id,card])));
  const owned=new Set(topic.wordIds);
  const counts=new Map(topic.wordIds.map(id=>[id,0]));
  const countCard=card=>{for(const id of new Set(card.tokens.map(token=>token.wordId).filter(id=>owned.has(id))))counts.set(id,counts.get(id)+1);};
  for(const lesson of lessons)for(const card of lesson.cards)countCard(card);
  for(const placement of placements)for(const id of placement.cardIds)countCard(byId.get(id));
  // Avoid one-card detours. Fill a short checkpoint from already taught cards,
  // prioritizing the least-exposed topic words, then save the exact choices.
  for(const placement of placements) {
    const anchor=lessons.findIndex(lesson=>lesson.id===placement.afterLessonId);
    const seen=new Set(placement.cardIds.map(id=>norm(byId.get(id))));
    const candidates=lessons.slice(0,anchor+1).flatMap(lesson=>lesson.cards).filter(card=>card.tokens.some(token=>owned.has(token.wordId)));
    while(placement.cardIds.length<4) {
      const score=card=>Math.min(...card.tokens.filter(token=>owned.has(token.wordId)).map(token=>counts.get(token.wordId)));
      const next=candidates.filter(card=>!seen.has(norm(card))).sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id))[0];
      if(!next)throw new Error(`${placement.id}: cannot fill a short review with previously taught material.`);
      placement.cardIds.push(next.id);seen.add(norm(next));countCard(next);
    }
  }
  const prior=new Map((plan.topics[topic.id]??[]).map(placement=>[placement.id,placement]));
  for(const placement of placements){
    const previous=prior.get(placement.id);
    if(previous){
      const same=previous.afterLessonId===placement.afterLessonId &&
        JSON.stringify(previous.cardIds)===JSON.stringify(placement.cardIds);
      placement.version=(previous.version??1)+(same?0:1);
    }else placement.version=1;
  }
  // This planner owns only its numbered vocabulary checkpoints. Grammar,
  // lexical-variant and other authored reviews keep their exact references,
  // anchors and versions when vocabulary coverage is rebuilt.
  const authored=(plan.topics[topic.id]??[]).filter(placement=>!placement.id.startsWith(`${topic.id}-revisit-`));
  plan.topics[topic.id]=[...placements,...authored];
  added+=placements.length;preserved+=authored.length;
}
fs.writeFileSync(path,JSON.stringify(plan,null,2)+'\n');
console.log(`Saved ${added} vocabulary review placements; preserved ${preserved} authored checkpoints. Recompile, inspect the bilingual packet, and run the exposure audit.`);
