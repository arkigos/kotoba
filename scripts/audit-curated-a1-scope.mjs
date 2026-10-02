import fs from 'node:fs';
import {auditA1Scope} from './lib/curated-a1-scope.mjs';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const policy=read('data/jp/curriculum/curated/a1-grammar-scope.json');
const lessons=[...read('data/jp/curriculum/starter_lessons.json').lessons,...read('data/jp/curriculum/curated/a1.json').lessons];
const errors=auditA1Scope(lessons,policy);
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
else console.log(`A1 scope: ${lessons.length} foundation, instructional and recall lessons within the reviewed grammar boundary. Editorial review still required.`);
