import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import { curatedAudioForms } from '../scripts/lib/curated-audio.mjs';
import { deduplicatePronunciations, pronunciationKeySync } from '../scripts/lib/dictionary-audio.mjs';
import { recordingForToken, speechForToken } from '../packages/dictionary/audio';
import audioJson from '../data/jp/dictionary/audio.json';

const card = tokens => [{cards:[{id:'example',tokens}]}];
const options = {bindings:{},entries:{},functionEntries:{}};

describe('authored course audio inventory', () => {
  it('collects an exact inflection without requiring a legacy learning binding', () => {
    const token={surface:'剃りました',reading:'そりました',wordId:'jmdict:1581900',dictionaryEntryId:'jmdict:1581900'};
    const result=curatedAudioForms(card([token]),options);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({entryId:'jmdict:1581900',reading:'そりました',text:'そりました'});
    expect(result[0].text).not.toBe('そる');
  });
  it('shares one pronunciation across original and later recall cards', () => {
    const token={surface:'本',reading:'ほん',dictionaryEntryId:'jmdict:1522150'};
    const lessons=[...card([token]),...card([{...token,surface:'ほん'}])];
    expect(deduplicatePronunciations(curatedAudioForms(lessons,options))).toHaveLength(1);
  });
  it('preserves historical grammar identities and explicitly registers other authored forms', () => {
    const result=curatedAudioForms(card([
      {surface:'を',reading:'お'}, {surface:'ながら',reading:'ながら'}, {surface:'。',reading:'。'},
    ]),{...options,bindings:{particle:{entryId:'kotoba:object',surface:'を',reading:'お'}},
      functionEntries:{'を':{entryId:'kotoba:curated-form:を'},'ながら':{entryId:'kotoba:curated-form:ながら'}}});
    expect(result.map(f=>[f.entryId,f.text])).toEqual([['kotoba:object','お'],['kotoba:curated-form:ながら','ながら']]);
  });
  it('keeps authored base prompts without applying them to inflected forms', () => {
    const bindings={word:{entryId:'jmdict:1',reading:'よい',audioText:'いい'}};
    const result=curatedAudioForms(card([
      {wordId:'word',surface:'良い',reading:'よい'},
      {wordId:'word',surface:'良かった',reading:'よかった'},
    ]),{...options,bindings});
    expect(result.map(f=>f.text)).toEqual(['いい','よかった']);
  });
  it('fails visibly for an unregistered token instead of claiming complete coverage', () => {
    expect(()=>curatedAudioForms(card([{surface:'未登録',reading:'みとうろく'}]),options)).toThrow('no audio identity');
  });
  it('includes every spoken starter and curated token using the real registry', () => {
    const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
    const bindings=read('data/jp/dictionary/course_bindings.json').words;
    const entries={...read('data/jp/dictionary/course_entries.json').entries,...read('data/jp/dictionary/starter_entries.json').entries};
    const functionEntries=read('data/jp/dictionary/audio_function_forms.json').forms;
    const dir='data/jp/curriculum/curated';
    const lessons=fs.readdirSync(dir).filter(n=>/^(a[12]|b[12]|c[12])\.json$/.test(n)).flatMap(n=>read(`${dir}/${n}`).lessons);
    lessons.push(...read('data/jp/curriculum/starter_lessons.json').lessons);
    const forms=curatedAudioForms(lessons,{bindings,entries,functionEntries});
    const spoken=lessons.flatMap(l=>l.cards).flatMap(c=>c.tokens).filter(t=>!/^\s*[\p{P}\s]+$/u.test(t.surface));
    expect(forms).toHaveLength(spoken.length);
    expect(forms.every(f=>f.entryId&&f.reading&&f.text)).toBe(true);
    expect(forms.some(f=>f.entryId==='jmdict:1581900'&&f.reading==='そりました')).toBe(true);
    const mismatches = [];
    const checkedTokens = new Set();
    for (let i = 0; i < spoken.length; i++) {
      const token = spoken[i], form = forms[i];
      const tokenIdentity = JSON.stringify([token.surface, token.reading, token.audioText, token.wordId, token.dictionaryEntryId]);
      if (checkedTokens.has(tokenIdentity)) continue;
      checkedTokens.add(tokenIdentity);
      const recording = audioJson.pronunciations[pronunciationKeySync(form)];
      const expectedRef = recording?.status === 'complete' ? recording.ref : undefined;
      if (speechForToken(token) !== form.text || recordingForToken(token) !== expectedRef) {
        mismatches.push({token, expectedSpeech:form.text, expectedRef, actualRef:recordingForToken(token)});
      }
    }
    expect(mismatches).toEqual([]);
  });
});
