import fs from 'node:fs';
export function applyCourseOrder(course, sourceIds){
 const order=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/course-order.json','utf8'));
 const ids=sourceIds??Object.values(order.levels).flat();
 for(const topic of course.topics)if(!ids.includes(topic.id))throw new Error(`${topic.id}: assign this chapter an explicit course position before compiling`);
 course.progression='linear';
 course.topics.sort((a,b)=>ids.indexOf(a.id)-ids.indexOf(b.id));
 const lessons=new Map(course.lessons.map(l=>[l.id,l]));
 course.lessons=course.topics.flatMap(t=>t.lessonIds.map(id=>lessons.get(id)));
 const revisions=JSON.parse(fs.readFileSync('data/jp/curriculum/curated/lesson-revisions.json','utf8')).lessons;
 for(const lesson of course.lessons){
  const version=revisions[lesson.id];
  if(version){lesson.version=version;for(const card of lesson.cards)card.id=card.id.replace(/-v\d+-/g,`-v${version}-`);}
 }
}
