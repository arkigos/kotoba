import {describe, it, expect} from 'vitest';
import {lexicalVariantErrors} from '../scripts/lib/curated-lexical-variants.mjs';

const variant = {wordId:'plate',referenceEntryId:'polite-plate',surface:'お皿',reading:'おさら',lessonId:'intro',evidence:'Learn this whole expression.'};
const token = {wordId:'plate',dictionaryEntryId:'plate',surface:'お皿',reading:'おさら'};
const cards = [1,2].map(n=>({id:`card-${n}`,tokens:[token]}));
const makeCourse = () => ({foundationIds:[],lessons:[
  {id:'base',topicId:'food',targets:['plate'],cards:[],notes:[]},
  {id:'intro',topicId:'food',targets:[],cards:structuredClone(cards),notes:[{start:1,explanation:variant.evidence}]},
  ...[1,2].map(n=>({id:`recall-${n}`,topicId:'food',kind:'review',targets:[],cards:structuredClone(cards),notes:[]})),
]});
const audit = (course, variants=[variant], pool=new Set(['plate']), forms={plate:[['お皿','おさら']]}) => lexicalVariantErrors(course,variants,pool,forms);

describe('explicit lexical variant instruction',()=>{
  it('allows an instructed form with its own repeated chapter exposure',()=>{
    expect(audit(makeCourse())).toEqual([]);
  });
  it('does not treat a known base or a completed earlier level as variant instruction',()=>{
    const course=makeCourse();
    course.foundationIds=['plate'];
    course.lessons[0].cards=structuredClone(cards);
    expect(audit(course).join('\n')).toContain('used before instruction in base');
  });
  it('requires a previously taught base, form approval and an explanation before first use',()=>{
    const course=makeCourse();course.lessons[0].targets=[];
    course.lessons[1].notes[0].start=2;
    const errors=audit(course,[variant],new Set(['plate']),{}).join('\n');
    expect(errors).toContain('base word must be taught');
    expect(errors).toContain('lacks an explicit form approval');
    expect(errors).toContain('instruction before first use');
  });
  it('rejects duplicate progress targets and incorrect token identity bindings',()=>{
    const course=makeCourse();course.lessons[1].cards[0].tokens[0].wordId='polite-plate';
    const errors=audit(course,[variant],new Set(['plate','polite-plate'])).join('\n');
    expect(errors).toContain('reference-only entry');
    expect(errors).toContain('wrong identity');
  });
  it('requires two later recalls within the teaching chapter',()=>{
    const course=makeCourse();course.lessons.at(-1).topicId='later-chapter';
    expect(audit(course).join('\n')).toContain('two later chapter recalls');
  });
  it('rejects duplicate declarations and a missing or review-only teaching lesson',()=>{
    expect(audit(makeCourse(),[variant,variant]).join('\n')).toContain('duplicate variant');
    expect(audit(makeCourse(),[{...variant,lessonId:'missing'}]).join('\n')).toContain('missing instructional lesson');
    expect(audit(makeCourse(),[{...variant,lessonId:'recall-1'}]).join('\n')).toContain('missing instructional lesson');
  });
});
