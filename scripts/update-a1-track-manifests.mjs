import fs from 'node:fs';
import { a1Tracks } from './lib/curated-a1-tracks.mjs';
const dir='data/jp/curriculum/curated';
const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}.json`,'utf8'));
const write=(name,data)=>fs.writeFileSync(`${dir}/${name}.json`,JSON.stringify(data,null,2)+'\n');
const order=read('course-order');order.levels.A1=a1Tracks.map(t=>t.id);order.progression='independent-tracks-within-reviewed-levels';write('course-order',order);
const forms=read('reviewed-forms'),words=read('a1-words');
// Individually reviewed dictionary identities, polite inflections and readings.
for(const [rank,surface,reading] of [[179,'送りません','おくりません'],[32,'ほん','ほん'],[53,'いす','いす'],[43,'書きません','かきません'],[42,'読みません','よみません'],[42,'読みませんでした','よみませんでした'],[495,'一万','いちまん'],[107,'住みます','すみます'],[724,'押しません','おしません'],[725,'引きません','ひきません'],[204,'消しました','けしました'],[175,'売ります','うります'],[736,'急ぎましょう','いそぎましょう'],[736,'急ぎました','いそぎました'],[737,'困りました','こまりました']]){
 const id=words.find(w=>w.rank===rank).id;forms.forms[id]??=[];
 if(!forms.forms[id].some(([s,r])=>s===surface&&r===reading))forms.forms[id].push([surface,reading]);
}
write('reviewed-forms',forms);
const scope=read('a1-grammar-scope');if(!scope.allowedRules.includes('information'))scope.allowedRules.push('information');scope.restrictedUses.permission='Practical borrowing questions introduce permission once in A1. A2 may extend its use without reteaching the construction.';write('a1-grammar-scope',scope);
// These polite lexical variants need their own spaced exposure even when the
// underlying ordinary form has already reached its target exposure count.
const revisits=read('topic-revisits');
const placements=revisits.topics['A1-things-choices'];
for(const [suffix,afterLessonId] of [['a','A1-food-eating-out'],['b','A1-home-moving-things']]){
 const id=`A1-things-choices-polite-words-${suffix}`;
 const placement={id,title:'Recall · At the table',afterLessonId,cardIds:[1,2,4,5].map(n=>`A1-food-polite-food-words-v1-${String(n).padStart(3,'0')}`)};
 const index=placements.findIndex(p=>p.id===id);if(index<0)placements.push(placement);else placements[index]=placement;
}
write('topic-revisits',revisits);
const grammarRecalls=[
 ['A1-people-communication','borrowing-a','A1-conversation-repair',['A1-quantity-grammar-borrowing-v2-001','A1-quantity-grammar-borrowing-v2-002','A1-learning-grammar-classroom-v2-003','A1-learning-grammar-classroom-v2-004']],
 ['A1-people-communication','borrowing-b','A1-conversation-opinion-question',['A1-quantity-grammar-borrowing-v2-001','A1-quantity-grammar-borrowing-v2-002','A1-quantity-sharing-v1-009','A1-quantity-sharing-v1-010']],
 ['A1-people-communication','information-a','A1-conversation-opinion-question',['A1-conversation-responses-track-7','A1-conversation-responses-track-8','A1-conversation-feelings-v2-007','A1-conversation-feelings-v2-008']],
 ['A1-people-communication','information-b','A1-conversation-sending',['A1-conversation-responses-track-7','A1-conversation-responses-track-8','A1-conversation-linking-v3-005','A1-conversation-linking-v3-006']],
 ['A1-people-communication','reasons','A1-conversation-sending',['A1-conversation-grammar-reasons-v1-001','A1-conversation-grammar-reasons-v1-004','A1-conversation-why-v1-001','A1-conversation-why-v1-002']],
 ['A1-things-choices','wishes-a','A1-home-housing',['A1-food-grammar-wants-v1-001','A1-food-grammar-wants-v1-003','A1-food-grammar-wants-v1-005','A1-food-grammar-wants-v1-007']],
 ['A1-things-choices','wishes-b','A1-home-more-locations',['A1-food-grammar-wants-v1-002','A1-food-grammar-wants-v1-004','A1-food-grammar-wants-v1-006','A1-food-grammar-wants-v1-008']],
];
for(const [track,suffix,afterLessonId,cardIds] of grammarRecalls){
 const list=revisits.topics[track],id=`${track}-grammar-recall-${suffix}`;
 const placement={id,title:'Recall · Useful sentences',afterLessonId,cardIds};
 const index=list.findIndex(p=>p.id===id);if(index<0)list.push(placement);else list[index]=placement;
}
write('topic-revisits',revisits);
