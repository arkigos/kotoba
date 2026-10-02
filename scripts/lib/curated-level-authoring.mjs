import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { forms as foundationForms } from './curated-course-authoring.mjs';
import { applyCourseOrder } from './curated-course-order.mjs';
import { applyGrammarInstruction } from './curated-grammar-instruction.mjs';
import { applyCuratedRevisits } from './curated-revisits.mjs';
import {applyA2Tracks,a2SourceChapters} from './curated-a2-tracks.mjs';
import {applyB1Tracks,b1SourceChapters} from './curated-b1-tracks.mjs';

const levels = ['A1','A2','B1','B2','C1','C2'];
const hashes = {
 A2:'f44d9efae9bc6328fac2fcc13b15bf2810b82518bd64edc6a192a48213bc5e2f',
 B1:'2d0e02af85852c82a728779c13fa2b9acc8ab218f7e8e3e8d9dc56b4c094aa54',
 B2:'52fbc2cc85a52ae7cace742c28c08bfd0acdac67ae34843dd1b2815fc173e2c7',
 C1:'bd404add066f79a3a4c0e03faaab26015fba15f537d4010f9c550159253241b0',
 C2:'3a63e5e8f7f487803ec4373d3a4e99190f59830546e07f621ad27a73cebb0814',
};
const index = JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8'));
const wordsByLevel = Object.fromEntries(levels.map(level=>[level,index.filter(r=>r[8]===level).map((r,i)=>({rank:i+1,id:r[0],surface:r[1],reading:r[2],meaning:r[3],level}))]));
const byId=new Map(Object.values(wordsByLevel).flat().map(word=>[word.id,word]));
// A published source rank is an authoring address, never a mutable frequency
// rank. Preserve it when a reviewed level placement changes.
for(const level of levels) {
 const path=`data/jp/curriculum/curated/${level.toLowerCase()}-authoring-ids.json`;
 if(fs.existsSync(path)) {
  const manifest=JSON.parse(fs.readFileSync(path,'utf8'));
  wordsByLevel[level]=manifest.ids.map((id,i)=>{
   const word=byId.get(id) ?? manifest.retiredEntries?.[id];
   if(!word)throw new Error(`Missing authoring identity ${id}; retire it explicitly if it is now reference-only.`);
   if(!byId.has(id) && word.level!=='reference')throw new Error(`Invalid retired authoring identity ${id}`);
   return {...word,rank:i+1};
  });
 }
}

/** Offline authoring only. Every sentence, translation and lexical inflection is
 * explicit. @surface resolves a unique completed lower-level word; LEVEL:rank
 * disambiguates it. LEVEL@surface explicitly names a current/lower-level word.
 * Bare ranks always refer to the current level. Published identities stay fixed. */
export function createLevelAuthoring(level) {
 const words=wordsByLevel[level], lower=[...byId.values()].filter(word=>levels.indexOf(word.level)<levels.indexOf(level));
 if(!hashes[level] || createHash('sha256').update(JSON.stringify(words.map(w=>w.id))).digest('hex')!==hashes[level])throw new Error(`${level} identities/order changed; migrate the authored source first.`);
 const forms={...foundationForms};
 for(const prior of levels.slice(0,levels.indexOf(level))) {
  const path=`data/jp/curriculum/curated/${prior.toLowerCase()}.json`;
  if(fs.existsSync(path))Object.assign(forms,JSON.parse(fs.readFileSync(path,'utf8')).functionForms);
 }
 const course={version:1,poolVersion:'kotoba-study-pools-2026-09-21-v1',levels,foundationIds:[],topics:[],lessons:[],functionForms:forms};
 let current;
 function resolve(spec) {
  const named=spec.match(/^([ABC][12])@(.+)$/);
  if(named){
   const [,source,surface]=named;
   if(levels.indexOf(source)>levels.indexOf(level))throw new Error(`${level}: higher-level word ${spec} is unavailable.`);
   const matches=[...byId.values()].filter(w=>w.level===source && w.surface===surface);
   if(matches.length!==1)throw new Error(`${level}: named word ${spec} has ${matches.length} matches; use a source rank.`);
   return matches[0];
  }
  if(spec.startsWith('@')) {
   const matches=lower.filter(w=>w.surface===spec.slice(1));
   if(matches.length!==1)throw new Error(`${level}: lower-level word ${spec} has ${matches.length} matches; use LEVEL:rank.`);
   return matches[0];
  }
  if(/^\d+$/.test(spec)) {
   const word=words[Number(spec)-1];
   if(word && word.level!==level)throw new Error(`${level}: source rank ${spec} (${word.surface}) now belongs to ${word.level}; author it there.`);
   return word;
  }
  const match=spec.match(/^([ABC][12]):(\d+)$/);
  if(match && levels.indexOf(match[1])<levels.indexOf(level)) {
   const word=wordsByLevel[match[1]][Number(match[2])-1];
   if(word && word.level!==match[1])throw new Error(`Inactive source rank ${spec}; use the word's current level.`);
   return word;
  }
 }
 function token(spec) {
  const [key,surface,reading]=spec.split('~'),word=resolve(key);
  if(word)return {wordId:word.id,dictionaryEntryId:word.id,surface:surface??word.surface,reading:reading??word.reading,explain:word.meaning};
  if(!forms[spec])throw new Error(`${level}: undeclared token ${spec}`);
  return {surface:spec,reading:forms[spec][0],explain:forms[spec][1]};
 }
 function topic(id,title,description){current={id:`${level}-${id}`,level,title,description,wordIds:[],lessonIds:[]};course.topics.push(current);}
 function useTopic(id){current=course.topics.find(t=>t.id===`${level}-${id}`);if(!current)throw new Error(`Unknown topic ${id}`);}
 function lesson(slug,title,targets,pattern,explanation,sentences,glosses={}){
  if(!current)throw new Error('Select a topic before authoring a lesson.');
  // Authored contextual meanings, never new identities or morphology permits.
  const contextualGlosses=new Map(Object.entries(glosses).map(([key,gloss])=>{
   const word=resolve(key);
   if(!word||typeof gloss!=='string'||!gloss.trim())throw new Error(`Invalid contextual gloss: ${key}`);
   return [word.id,gloss];
  }));
  const id=`${current.id}-${slug}`,targetIds=targets.map(spec=>{
   const word=resolve(String(spec));
   if(!word || word.level!==level)throw new Error(`${level}: invalid current-level target ${spec}`);
   return word.id;
  });
  if(course.lessons.some(existing=>existing.id===id))throw new Error(`Duplicate authored lesson id: ${id}`);
  const cards=sentences.map(([line,english],i)=>{
   const tokens=line.trim().split(/\s+/).map(token).map(t=>contextualGlosses.has(t.wordId)?{...t,explain:contextualGlosses.get(t.wordId)}:t);
   return {id:`${id}-v1-${String(i+1).padStart(3,'0')}`,line:tokens.map(t=>t.surface),tts:tokens.map(t=>t.reading),explain:tokens.map(t=>t.explain),tokens,english,constructionKey:id,grammarTags:[pattern]};
  });
  const helpers=[...new Set(cards.flatMap(c=>c.tokens.flatMap(t=>t.wordId&&!targetIds.includes(t.wordId)?[t.wordId]:[])))];
  course.lessons.push({id,topicId:current.id,version:1,title,targets:targetIds,helpers,notes:[{start:1,title:'Grammar in this lesson',pattern,explanation}],cards});
  current.wordIds.push(...targetIds);current.lessonIds.push(id);
 }
 function finish(){
  applyCourseOrder(course,level==='A2'?a2SourceChapters:level==='B1'?b1SourceChapters:undefined);
  applyGrammarInstruction(course);
  if(level==='A2')applyA2Tracks(course,token,words);
  if(level==='B1')applyB1Tracks(course,token,words);
  if(level==='B1' && process.argv.includes('--tracks-draft')){
   fs.writeFileSync('.codex-b1-track-draft.json',JSON.stringify(course,null,2)+'\n');
   console.log('Wrote B1 track draft without publishing.');
   return;
  }
  if(level==='A2' && process.argv.includes('--tracks-draft')){
   fs.writeFileSync('.codex-a2-track-draft.json',JSON.stringify(course,null,2)+'\n');
   console.log('Wrote A2 track draft without publishing.');
   return;
  }
  applyCuratedRevisits(course);
  const assigned=new Set(course.topics.flatMap(t=>t.wordIds));
  fs.writeFileSync(`data/jp/curriculum/curated/${level.toLowerCase()}.json`,JSON.stringify(course,null,2)+'\n');
  fs.writeFileSync(`data/jp/curriculum/curated/${level.toLowerCase()}-words.json`,JSON.stringify(words,null,2)+'\n');
  console.log(`${level}: ${course.topics.length} topics, ${course.lessons.length} lessons, ${course.lessons.reduce((n,l)=>n+l.cards.length,0)} cards; ${assigned.size}/${index.filter(row=>row[8]===level).length} words.`);
 }
 const lines=(entries,patterns)=>patterns.flatMap(([jp,en])=>entries.map(([id,meaning])=>[jp.replaceAll('$',String(id)),en.replaceAll('$',meaning)]));
 return {course,words,forms,resolve,token,topic,useTopic,lesson,lines,finish};
}
