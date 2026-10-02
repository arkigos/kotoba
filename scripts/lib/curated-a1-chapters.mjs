// Preserve learning IDs while placing basic exchanges before the subject chapters.
// Later conversation lessons need requests, actions and reasons learned elsewhere.
export function placeA1Chapters(course){
 const ids=['hello','name','belongings','countries','courtesy','home-greetings','goodbyes'].map(slug=>`A1-conversation-${slug}`);
 const lessons=ids.map(id=>course.lessons.find(lesson=>lesson.id===id));
 if(lessons.some(lesson=>!lesson))throw new Error('Missing authored greeting lesson');
 const chapter={id:'A1-greetings',level:'A1',title:'Greetings and introductions',description:'Say hello, introduce yourself, and use everyday courtesy.',wordIds:lessons.flatMap(lesson=>lesson.targets),lessonIds:ids};
 const original=course.topics.find(topic=>topic.id==='A1-conversation');
 original.title='Keeping a conversation going';
 original.description='Handle a phone call, ask for help, and give a short reason.';
 original.lessonIds=original.lessonIds.filter(id=>!ids.includes(id));
 original.wordIds=course.lessons.filter(lesson=>original.lessonIds.includes(lesson.id)).flatMap(lesson=>lesson.targets);
 for(const lesson of lessons)lesson.topicId=chapter.id;
 course.topics.push(chapter);
}
