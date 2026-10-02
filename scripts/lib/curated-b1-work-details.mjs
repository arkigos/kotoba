export function authorWorkDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@黒板':'blackboard','B1@チャイム':'chime; bell','B1@要点':'main point; key points',
 'B1@前もって':'beforehand; in advance','B1@揃える':'to gather what is needed; to put in order',
 'B1@揃う':'to be all present; to be complete','B1@工夫':'finding a useful way; ingenuity',
 'B1@志望':'choice; ambition','B1@目指す':'to aim for; to work toward',
 'B1@上級':'advanced level','B1@国立':'national; run by the central government',
 'B1@私立':'privately run','B1@職場':'workplace','B1@給与':'pay; salary',
 'B1@ボーナス':'bonus','B1@月末':'end of the month','B1@募集':'recruitment; taking applications',
 'B1@問い合わせ':'inquiry','B1@移転':'relocation','B1@調整':'adjustment; coordination',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('education');
lesson('classroom-signals','Following a lesson',['B1@黒板','B1@チャイム','B1@要点'],
 '黒板 / チャイム / 要点','要点 refers to the main points of a talk or text. It focuses attention on the most important information.',[
 ['@先生 は B1@黒板 に @今日 の @予定 を @書く~書きました~かきました','The teacher wrote today’s schedule on the blackboard.'],
 ['B1@黒板 の @字 が @小さい から @読む~読めません~よめません','The writing on the blackboard is too small for me to read.'],
 ['@授業 の @後 で B1@黒板 を @消す~消しました~けしました','I erased the blackboard after class.'],
 ['B1@チャイム が @鳴る~鳴って~なって @授業 が @始まる~始まりました~はじまりました','The bell rang and class began.'],
 ['@廊下 で B1@チャイム を @聞く~聞きました~ききました','I heard the bell in the hallway.'],
 ['B1@チャイム が @鳴る @前 に @席 に @座る~座りました~すわりました','I sat down before the bell rang.'],
 ['@説明 の B1@要点 を @ノート に @書く~書きました~かきました','I wrote the main points of the explanation in my notebook.'],
 ['@先生 は @話 の B1@要点 を @短い~短く~みじかく @説明 @する~しました~しました','The teacher briefly explained the main points of the talk.'],
 ['B1@要点 を @三つ @教える~教えて~おしえて ください','Please tell me three key points.'],
]);
lesson('getting-things-together','Getting everything ready',['B1@前もって','B1@揃える','B1@揃う'],
 '前もって / 揃えます / 揃います','揃える describes someone gathering or arranging things. 揃う describes the result: everything or everyone is present.',[
 ['@授業 で @使う @本 を B1@前もって @読む~読みました~よみました','I read the book we would use in class beforehand.'],
 ['@必要 な @物 を B1@前もって @先生 に @聞く~聞きました~ききました','I asked the teacher beforehand what I would need.'],
 ['@休む @場合 は B1@前もって @連絡 @する~して~して ください','Please let us know in advance if you will be absent.'],
 ['@授業 で @使う @道具 を B1@揃える~揃えました~そろえました','I gathered the tools we would use in class.'],
 ['@必要 な @本 を @図書館 で B1@揃える~揃えました~そろえました','I collected the books I needed at the library.'],
 ['@必要 な @物 を @今日 B1@揃える~揃えて~そろえて ください','Please get everything you need together today.'],
 ['@必要 な @道具 が B1@揃う~揃いました~そろいました','All the tools we need are ready.'],
 ['@学生 が @全員 B1@揃う~揃って~そろって から @説明 @する~します~します','I will explain once all the students are here.'],
 ['@まだ @本 が B1@揃う~揃っていません~そろっていません','We do not have all the books yet.'],
]);
lesson('study-ambitions','Choosing a goal',['B1@工夫','B1@志望','B1@目指す'],
 '工夫します / 志望します / 目指します','工夫する means finding a useful way to do something. 志望する expresses a choice or ambition, often for a school or job; 目指す focuses on the goal you work toward.',[
 ['@言葉 を @覚える @方法 を B1@工夫 @する~しました~しました','I worked out a better way to remember words.'],
 ['@ノート を @読む~読みやすく~よみやすく @する ために B1@工夫 @する~しています~しています','I am finding ways to make my notes easier to read.'],
 ['@この B1@教科書 に は @説明 を @わかる~わかりやすく~わかりやすく @する B1@工夫 が @ある~あります~あります','This textbook uses thoughtful ways to make its explanations easy to understand.'],
 ['@私 は @この @大学 を B1@志望 @する~しています~しています','This is the university I hope to attend.'],
 ['B1@志望 の @理由 を @先生 に @話す~話しました~はなしました','I told the teacher the reason for my choice.'],
 ['@弟 は @医者 を B1@志望 @する~しています~しています','My younger brother hopes to become a doctor.'],
 ['@私 は @日本語 の @先生 を B1@目指す~目指しています~めざしています','I am working toward becoming a Japanese teacher.'],
 ['@次 の @試験 で B1@合格 を B1@目指す~目指します~めざします','I am aiming to pass the next exam.'],
 ['@友達 と @同じ @大学 を B1@目指す~目指しています~めざしています','I am aiming for the same university as my friend.'],
]);
lesson('school-options','Levels and school choices',['B1@上級','B1@国立','B1@私立'],
 '上級のクラス / 国立の大学 / 私立の学校','国立 describes an institution run by the national government. 私立 describes a privately run institution. 上級 describes an advanced level.',[
 ['@来年 は B1@上級 の @クラス で @勉強 @する~したい~したい です','Next year I want to study in the advanced class.'],
 ['B1@上級 の @問題 は @難しい~難しかった~むずかしかった です','The advanced-level questions were difficult.'],
 ['B1@上級 の @学生 と @日本語 で @話す~話しました~はなしました','I spoke Japanese with an advanced student.'],
 ['@姉 は B1@国立 の @大学 で @勉強 @する~しています~しています','My older sister studies at a national university.'],
 ['B1@国立 の @大学 の @図書館 に @行く~行きました~いきました','I went to a national university’s library.'],
 ['B1@国立 の @大学 を B1@志望 @する~しています~しています','I hope to attend a national university.'],
 ['@弟 は B1@私立 の @学校 に @通う~通っています~かよっています','My younger brother attends a private school.'],
 ['B1@私立 の @大学 の @試験 を @受ける~受けました~うけました','I took the entrance exam for a private university.'],
 ['@この B1@私立 の @学校 に は @大きい @図書館 が @ある~あります~あります','This private school has a large library.'],
]);
lesson('ready-for-class-account','Before the first class',[],
 '前もって / 揃う / 要点','Follow the preparations and then the start of the lesson.',[
 ['B1@上級 の @授業 で @使う @本 を B1@前もって B1@揃える~揃えました~そろえました','I gathered the books for the advanced class beforehand.'],
 ['@教室 の B1@黒板 に @先生 の @名前 が @ある~ありました~ありました','The teacher’s name was on the classroom blackboard.'],
 ['B1@チャイム が @鳴る @前 に @全員 が B1@揃う~揃いました~そろいました','Everyone was there before the bell rang.'],
 ['@先生 は @授業 の B1@要点 を @短い~短く~みじかく @説明 @する~しました~しました','The teacher briefly explained the main points of the lesson.'],
 ['@私 は @ノート を @書く @方法 を B1@工夫 @する~しました~しました','I tried to improve the way I took notes.'],
]);
useTopic('work');
lesson('workplace-and-pay','Workplaces and pay',['B1@職場','B1@給与','B1@ボーナス','B1@月末'],
 '職場 / 給与 / ボーナス / 月末','給与 is pay for work. A ボーナス is an additional payment. 月末 means the end of the month.',[
 ['@新しい B1@職場 は @駅 の @近く です','My new workplace is near the station.'],
 ['B1@職場 で @日本語 を @使う~使っています~つかっています','I use Japanese at work.'],
 ['@家 から B1@職場 まで @バス で @行く~行きます~いきます','I take the bus from home to work.'],
 ['B1@給与 について @会社 に @質問 @する~しました~しました','I asked the company about pay.'],
 ['@新しい @仕事 の B1@給与 を @確認 @する~しました~しました','I checked the pay for the new job.'],
 ['@去年 より B1@給与 が @上がる~上がりました~あがりました','My salary has risen compared with last year.'],
 ['@今年 は B1@ボーナス を @もらう~もらいました~もらいました','I received a bonus this year.'],
 ['B1@ボーナス で @新しい @机 を @買う~買いました~かいました','I bought a new desk with my bonus.'],
 ['@この @会社 に は B1@ボーナス が @ある~ありません~ありません','This company does not pay bonuses.'],
 ['B1@月末 に B1@給与 を @もらう~もらいます~もらいます','I get paid at the end of the month.'],
 ['B1@月末 まで に @報告 を @送る~送って~おくって ください','Please send the report by the end of the month.'],
 ['B1@月末 は @仕事 が @忙しい です','Work is busy at the end of the month.'],
]);
lesson('recruitment-enquiries','Recruitment and inquiries',['B1@募集','B1@問い合わせ'],
 '募集します / 問い合わせ','募集する means inviting applications or looking for participants. 問い合わせ is a request for information.',[
 ['@会社 は @新しい @人 を B1@募集 @する~しています~しています','The company is recruiting new employees.'],
 ['B1@研修 に @参加 @する @人 を B1@募集 @する~します~します','We are inviting people to join the training session.'],
 ['B1@募集 は @来週 @終わる~終わります~おわります','Applications close next week.'],
 ['B1@問い合わせ は @メール で @お願い @する~します~します','Please send inquiries by email.'],
 ['B1@給与 について の B1@問い合わせ が @ある~ありました~ありました','There was an inquiry about pay.'],
 ['@担当 の @人 が B1@問い合わせ に @答える~答えました~こたえました','The person in charge answered the inquiry.'],
]);
lesson('relocation-coordination','Moving an office',['B1@移転','B1@調整'],
 '移転します / 時間を調整します','移転する describes relocating an office or shop. 調整する means making adjustments so things fit or work together, such as coordinating times.',[
 ['@会社 は @来月 @駅 の @近く に B1@移転 @する~します~します','The company will relocate near the station next month.'],
 ['B1@移転 の @日 を @全員 に @伝える~伝えました~つたえました','I told everyone the moving date.'],
 ['B1@移転 の @後 も @電話 @番号 は @同じ です','The phone number will stay the same after the move.'],
 ['@会議 の @時間 を B1@調整 @する~しています~しています','I am coordinating the meeting times.'],
 ['@椅子 の @位置 を B1@調整 @する~しました~しました','I adjusted the position of the chair.'],
 ['@仕事 の @時間 を B1@同僚 と B1@調整 @する~しました~しました','I coordinated my working hours with a colleague.'],
]);
lesson('office-move-account','A workplace is moving',[],
 '移転 / 調整 / 問い合わせ','Follow how the office shares information about its move.',[
 ['@私 の B1@職場 は B1@月末 に B1@移転 @する~します~します','My workplace is moving at the end of the month.'],
 ['@会議 の @時間 を B1@調整 @する~して~して @全員 に @知らせる~知らせました~しらせました','We adjusted the meeting times and informed everyone.'],
 ['@新しい @人 の B1@募集 は @続ける~続けています~つづけています','We are continuing to recruit new employees.'],
 ['B1@問い合わせ に は @メール で @答える~答えています~こたえています','We are answering inquiries by email.'],
 ['B1@給与 と B1@ボーナス について の @説明 も @送る~送りました~おくりました','We also sent information about pay and bonuses.'],
]);
}
