export function authorWorkResponsibilities({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@ベテラン':'experienced worker; veteran in a field','B1@素人':'amateur; non-specialist',
 'B1@職人':'craftsperson; artisan','B1@技師':'engineer; technical specialist',
 'B1@採用':'hiring; adopting an idea or method','B1@育成':'training; developing people or skills',
 'B1@引き受ける':'to accept responsibility for; to take on','B1@受け持つ':'to be in charge of',
 'B1@務める':'to serve in a role','B1@努める':'to make an effort; to strive',
 'B1@成果':'result; achievement','B1@充実':'fulfillment; substantial content; enrichment',
 'B1@見直す':'to review; to look over again','B1@改める':'to revise; to correct',
 'B1@目立つ':'to stand out','B1@まとまる':'to come together; to be settled',
 'B1@整う':'to be ready; to be in order','B1@終了':'ending; completion',
 'B1@追加':'addition','B1@延長':'extension','B1@超過':'exceeding a limit',
 'B1@限度':'limit','B1@予備':'spare; reserve','B1@項目':'item; heading; entry',
 'B1@各自':'each person','B1@持参':'bringing something with you',
 'B1@辞退':'declining; withdrawing','B1@私用':'personal business; private use',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('work');
lesson('experience-and-skilled-work','Experience and skilled work',['B1@ベテラン','B1@素人','B1@職人','B1@技師'],
 'ベテラン / 素人 / 職人 / 技師','ベテラン has extensive experience in a field. 素人 is someone without specialist training in that field. 職人 emphasizes skilled craft, while 技師 names a technical professional.',[
 ['B1@ベテラン の @先生 に @相談 @する~しました~しました','I consulted an experienced teacher.'],
 ['@彼 は @この @仕事 の B1@ベテラン です','He is an old hand at this work.'],
 ['@新しい @人 と B1@ベテラン が @一緒 に @働く~働いています~はたらいています','New staff and experienced staff are working together.'],
 ['@私 は @写真 の B1@素人 です','I am an amateur at photography.'],
 ['B1@素人 に も @わかる @説明 でした','The explanation was understandable even to a non-specialist.'],
 ['@この @本 は B1@素人 の @ため に @書く~書かれています~かかれています','This book is written for non-specialists.'],
 ['B1@職人 が @木 の @椅子 を @作る~作っています~つくっています','A craftsperson is making a wooden chair.'],
 ['@若い B1@職人 に @仕事 の @話 を @聞く~聞きました~ききました','I asked a young craftsperson about their work.'],
 ['@この @町 に は B1@職人 の @店 が @多い です','This town has many artisans’ shops.'],
 ['B1@技師 が @機械 を @調べる~調べています~しらべています','An engineer is examining the machine.'],
 ['@新しい B1@技師 が @工場 に @来る~来ました~きました','A new engineer came to the factory.'],
 ['B1@技師 に @機械 の @問題 を @説明 @する~しました~しました','I explained the machine’s problem to an engineer.'],
]);
lesson('hiring-and-developing-people','Hiring and developing people',['B1@採用','B1@育成'],
 '採用します / 育成','採用 can mean hiring a person or adopting an idea or method. 育成 develops people or abilities over time.',[
 ['@会社 は @新しい B1@技師 を B1@採用 @する~しました~しました','The company hired a new engineer.'],
 ['@私 の @提案 が B1@採用 @する~されました~されました','My proposal was adopted.'],
 ['@新しい @方法 を B1@採用 @する~する~する @理由 を @聞く~聞きました~ききました','I asked why the new method would be adopted.'],
 ['@若い B1@職人 の B1@育成 に @力 を @入れる~入れています~いれています','We are putting effort into training young craftspeople.'],
 ['@会社 で @若い @人 の B1@育成 について @話す~話しました~はなしました','We discussed developing young staff at the company.'],
 ['B1@育成 の @計画 を @先生 と @考える~考えました~かんがえました','I worked on a training plan with the teacher.'],
]);
lesson('accepting-and-filling-roles','Accepting responsibility and filling a role',['B1@引き受ける','B1@受け持つ','B1@務める'],
 '引き受けます / 受け持ちます / 務めます','引き受ける accepts a task or responsibility. 受け持つ takes charge of a particular part. 務める fills a role or position.',[
 ['@私 が @この @仕事 を B1@引き受ける~引き受けます~ひきうけます','I will take on this job.'],
 ['@友達 の @代わり に @受付 を B1@引き受ける~引き受けました~ひきうけました','I agreed to handle reception in my friend’s place.'],
 ['@忙しい から @新しい @仕事 は B1@引き受ける~引き受けられません~ひきうけられません','I am busy, so I cannot take on new work.'],
 ['@先生 は @三つ の @クラス を B1@受け持つ~受け持っています~うけもっています','The teacher is in charge of three classes.'],
 ['@私 は @午後 の @受付 を B1@受け持つ~受け持ちます~うけもちます','I will handle reception in the afternoon.'],
 ['@二人 で @別 の @仕事 を B1@受け持つ~受け持ちました~うけもちました','The two of us each took charge of different work.'],
 ['@彼女 は @チーム の @代表 を B1@務める~務めています~つとめています','She serves as the team representative.'],
 ['@会議 で @私 が B1@司会 を B1@務める~務めました~つとめました','I chaired the meeting.'],
 ['@友達 は @学校 で @委員 を B1@務める~務めています~つとめています','My friend serves on a committee at school.'],
]);
lesson('effort-results-and-fulfillment','Effort, results and fulfillment',['B1@努める','B1@成果','B1@充実'],
 '努めます / 成果 / 充実しています','努める means making an effort; it is a different word from 務める despite the same reading. 成果 is what the work achieves. 充実 describes something rich in content or personally fulfilling.',[
 ['@仕事 を @早い~早く~はやく B1@終える~終える~おえる ように B1@努める~努めています~つとめています','I am making an effort to finish the work early.'],
 ['@わかる~わかりやすい~わかりやすい @説明 に B1@努める~努めました~つとめました','I made an effort to explain clearly.'],
 ['@全員 が @安全 に @働く~働ける~はたらける ように B1@努める~努めます~つとめます','We will strive to make it possible for everyone to work safely.'],
 ['@研究 の B1@成果 を @発表 @する~しました~しました','I presented the results of the research.'],
 ['@練習 の B1@成果 が @出る~出ました~でました','The practice paid off.'],
 ['@今年 の B1@成果 を @去年 と @比べる~比べました~くらべました','I compared this year’s results with last year’s.'],
 ['@今 の @生活 は B1@充実 @する~しています~しています','My life feels fulfilling now.'],
 ['@この @本 は @内容 が B1@充実 @する~しています~しています','This book is rich in content.'],
 ['B1@充実 @する~した~した @一日 でした','It was a fulfilling day.'],
]);
lesson('a-new-engineer-account','Working with a new engineer',[],
 '採用 / ベテラン / 受け持つ / 成果','Follow how the new engineer joins the work and shares a result.',[
 ['@会社 は @先月 @新しい B1@技師 を B1@採用 @する~しました~しました','The company hired a new engineer last month.'],
 ['B1@ベテラン が @機械 の @説明 を B1@引き受ける~引き受けました~ひきうけました','An experienced worker agreed to explain the machine.'],
 ['@私 は @午後 の @練習 を B1@受け持つ~受け持ちました~うけもちました','I took charge of the afternoon practice.'],
 ['@新しい B1@技師 は @毎日 @質問 を @する~しました~しました','The new engineer asked questions every day.'],
 ['@私たち は @わかる~わかりやすい~わかりやすい @説明 に B1@努める~努めました~つとめました','We made an effort to explain clearly.'],
 ['@金曜日 に @練習 の B1@成果 を @確認 @する~しました~しました','On Friday, we checked the results of the practice.'],
 ['@今週 の @仕事 は B1@充実 @する~していました~していました','Work was fulfilling this week.'],
]);
lesson('reviewing-and-correcting-work','Reviewing and correcting work',['B1@見直す','B1@改める','B1@目立つ'],
 '見直します / 改めます / 目立ちます','見直す takes another look and may lead to a revision. 改める changes or corrects something. 目立つ means standing out, whether positively or negatively.',[
 ['@書く~書いた~かいた @文章 を B1@見直す~見直しました~みなおしました','I looked over what I had written.'],
 ['@来月 の @計画 を B1@見直す~見直しています~みなおしています','We are reviewing next month’s plan.'],
 ['B1@提出 @する @前 に @答え を B1@見直す~見直して~みなおして ください','Please check your answers again before submitting them.'],
 ['@仕事 の @方法 を B1@改める~改めました~あらためました','I changed the way I work.'],
 ['@間違い が @ある @説明 を B1@改める~改めました~あらためました','I corrected the mistaken explanation.'],
 ['@時間 を @守る ように @生活 を B1@改める~改めました~あらためました','I changed my daily habits to be punctual.'],
 ['@この @紙 は @赤い @文字 が B1@目立つ~目立ちます~めだちます','The red lettering stands out on this paper.'],
 ['@彼女 の @丁寧 な @仕事 が B1@目立つ~目立ちます~めだちます','Her careful work stands out.'],
 ['@報告 に @間違い が B1@目立つ~目立ちました~めだちました','The mistakes in the report were noticeable.'],
]);
lesson('settling-plans-and-preparations','Plans coming together and preparations being ready',['B1@まとまる','B1@整う'],
 'まとまります / 整います','まとまる brings parts or opinions into a settled whole. 整う means preparations or conditions are in order.',[
 ['@会議 で @意見 が B1@まとまる~まとまりました~まとまりました','We reached agreement at the meeting.'],
 ['@旅行 の @計画 が B1@まとまる~まとまりました~まとまりました','The travel plan came together.'],
 ['@まだ @考え が B1@まとまる~まとまっていません~まとまっていません','My thoughts have not come together yet.'],
 ['@用意 が B1@整う~整いました~ととのいました','The preparations are complete.'],
 ['@仕事 を @始める @条件 が B1@整う~整いました~ととのいました','The conditions are in place to start work.'],
 ['@会議 の @用意 は @もう B1@整う~整っています~ととのっています','The preparations for the meeting are already complete.'],
]);
lesson('finishing-adding-and-extending','Finishing, adding and extending',['B1@終了','B1@追加','B1@延長'],
 '終了します / 追加します / 延長します','終了 marks an end. 追加 adds something, while 延長 makes a time period, route or other length longer.',[
 ['@会議 は @午後 @三 時 に B1@終了 @する~しました~しました','The meeting ended at three in the afternoon.'],
 ['@作業 の B1@終了 を @全員 に @伝える~伝えました~つたえました','I told everyone that the work was finished.'],
 ['@受付 は @今日 で B1@終了 です','Registration closes today.'],
 ['@説明 に @例 を @一つ B1@追加 @する~しました~しました','I added one example to the explanation.'],
 ['@部屋 に @椅子 を @二つ B1@追加 @する~しました~しました','I added two chairs to the room.'],
 ['B1@追加 の @仕事 を B1@引き受ける~引き受けました~ひきうけました','I took on the additional work.'],
 ['@会議 の @時間 を B1@延長 @する~しました~しました','We extended the meeting.'],
 ['@期間 の B1@延長 を @お願い @する~しました~しました','I requested an extension of the period.'],
 ['@今日 は @作業 の @時間 を B1@延長 @する~します~します','We are extending the working time today.'],
]);
lesson('limits-and-spares','Limits and spares',['B1@超過','B1@限度','B1@予備'],
 '超過します / 限度 / 予備の','超過 goes beyond an expected or allowed amount. 限度 is the limit itself. 予備の describes something kept as a spare.',[
 ['@予定 の @時間 を B1@超過 @する~しました~しました','We went over the planned time.'],
 ['@予算 を B1@超過 @する~しない~しない ように @確認 @する~しました~しました','I checked that we would not go over the budget.'],
 ['@説明 の @時間 が B1@限度 を B1@超過 @する~しています~しています','The explanation is going over the time limit.'],
 ['@使う~使える~つかえる @お金 に は B1@限度 が @ある~あります~あります','There is a limit to the money we can use.'],
 ['@時間 の B1@限度 を @決める~決めました~きめました','We set a time limit.'],
 ['@この @値段 が B1@限度 です','This price is the limit.'],
 ['B1@予備 の @電池 を @持つ~持っています~もっています','I have spare batteries.'],
 ['@会場 に B1@予備 の @椅子 を @用意 @する~しました~しました','I prepared spare chairs at the venue.'],
 ['B1@予備 の @鍵 は @ここ に @ある~あります~あります','The spare key is here.'],
]);
lesson('items-and-things-to-bring','Items to check and things to bring',['B1@項目','B1@各自','B1@持参'],
 '項目 / 各自 / 持参します','項目 is an item or heading in a list. 各自 assigns something to each person individually. 持参 means bringing something with you, often in written instructions.',[
 ['@名前 は @最初 の B1@項目 です','Name is the first item.'],
 ['@確認 @する B1@項目 を @三つ @決める~決めました~きめました','We chose three items to check.'],
 ['@新しい B1@項目 を @紙 に B1@追加 @する~しました~しました','I added a new item to the paper.'],
 ['B1@各自 で @答え を @考える~考えて~かんがえて ください','Please each think of your own answer.'],
 ['@昼ご飯 は B1@各自 で @用意 @する~します~します','Each person will arrange their own lunch.'],
 ['B1@各自 の @仕事 を @確認 @する~しました~しました','We checked each person’s work.'],
 ['@会議 に @ノート を B1@持参 @する~しました~しました','I brought a notebook to the meeting.'],
 ['@ペン を B1@持参 @する~して~して ください','Please bring a pen.'],
 ['B1@各自 で @昼ご飯 を B1@持参 @する~します~します','Each person will bring their own lunch.'],
]);
lesson('declining-and-personal-business','Declining and personal business',['B1@辞退','B1@私用'],
 '辞退します / 私用','辞退 turns down an offer or withdraws from participation. 私用 is personal business or private use, as opposed to official work.',[
 ['@今回 の @参加 を B1@辞退 @する~しました~しました','I withdrew from participating this time.'],
 ['@彼 は @仕事 の @依頼 を B1@辞退 @する~しました~しました','He declined the work request.'],
 ['B1@辞退 の @理由 を @メール で @伝える~伝えました~つたえました','I explained my reason for declining by email.'],
 ['@明日 は B1@私用 で @休む~休みます~やすみます','I will take tomorrow off for personal business.'],
 ['@これ は B1@私用 の @電話 です','This is a personal phone call.'],
 ['@会社 の @車 を B1@私用 で @使う~使わないで~つかわないで ください','Please do not use the company car for personal business.'],
]);
lesson('preparing-a-workshop-account','Preparing a meeting',[],
 '各自 / 項目 / 予備 / 整う','Follow the checks before the meeting begins.',[
 ['@私たち は @会議 の @用意 を B1@引き受ける~引き受けました~ひきうけました','We agreed to prepare the meeting.'],
 ['@私 は @確認 @する B1@項目 を @紙 に @書く~書きました~かきました','I wrote the items to check on paper.'],
 ['@友達 は @受付 を B1@受け持つ~受け持ちました~うけもちました','My friend took charge of reception.'],
 ['B1@各自 で @ノート を B1@持参 @する @予定 です','Each person plans to bring a notebook.'],
 ['@私 は B1@予備 の @紙 と @ペン を @用意 @する~しました~しました','I prepared spare paper and pens.'],
 ['@会場 の @椅子 を @二つ B1@追加 @する~しました~しました','I added two chairs at the venue.'],
 ['@予定 の @時間 より @前 に @用意 が B1@整う~整いました~ととのいました','The preparations were complete ahead of time.'],
]);
lesson('revising-a-meeting-plan-account','Revising a meeting plan',[],
 '見直す / 改める / まとまる / 終了','Follow the review of a meeting that ran late.',[
 ['@昨日 の @会議 は @予定 の @時間 を B1@超過 @する~しました~しました','Yesterday’s meeting ran beyond the planned time.'],
 ['@今日 は @会議 の @計画 を B1@見直す~見直しました~みなおしました','Today we reviewed the meeting plan.'],
 ['@一つ の B1@項目 に @使う @時間 の B1@限度 を @決める~決めました~きめました','We set a limit on the time spent on one item.'],
 ['@私 は @説明 の @方法 を B1@改める~改めました~あらためました','I revised the way I explain things.'],
 ['@最後 に @全員 の @意見 が B1@まとまる~まとまりました~まとまりました','In the end, everyone reached agreement.'],
 ['@今日 の @会議 は @予定 の @時間 に B1@終了 @する~しました~しました','Today’s meeting ended at the scheduled time.'],
]);
}
