export function authorDiscussion({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{968:'talk something over; discuss together',1608:'discussion; talking something over',1357:'answer; response to a question',353:'view; interpretation; considered opinion',169:'agreement; matching',224:'conclusion',226:'misunderstanding; misinterpretation',1392:'mistake in one’s understanding; mistaken assumption',2516:'nod',655:'shout; call out',2390:'whisper',2416:'shout angrily; yell',940:'respond to; accept a request',2695:'response; handling a situation',2739:'main point; important detail',161:'viewpoint; perspective',142:'taking into account; consideration',191:'attaching importance to',343:'emphasis; stressing a point',193:'acknowledge; admit; recognize',298:'distinguish; tell apart','@立てる':'make; draw up (a plan)'});
topic('discussion','Talking things through','Discuss a plan, clarify a misunderstanding, and recognize how voice and response affect a conversation.');
lesson('talking','Discussion and answers',[968,1608,1357], '人と話し合います / 質問に回答します', '話し合う is to talk something over with other people, rather than speak in only one direction. 話し合い is the discussion itself. 回答 is an answer or response to a question; it is common in surveys and more formal exchanges.', [
 ['@家族 と @旅行 の @予定 を 968~話し合いました~はなしあいました','I discussed the travel plans with my family.'],
 ['@問題 について @皆さん と 968~話し合います~はなしあいます','I will discuss the problem with everyone.'],
 ['1608 の @前 に @自分 の @意見 を @考える~考えました~かんがえました','I thought about my own opinion before the discussion.'],
 ['1608 は @午後 に @始まる~始まります~はじまります','The discussion begins in the afternoon.'],
 ['@質問 に 1357 @する~してください~してください','Please answer the question.'],
 ['@先生 から 1357 を @もらう~もらいました~もらいました','I received an answer from my teacher.'],
]);
lesson('agreement','Views, agreement and conclusions',[353,169,224], '見解を聞きます / 意見が一致します / 結論を出します', '見解 is a considered view or interpretation, often in a formal discussion. 一致 means agreement or matching; 意見が一致する means the opinions agree. 結論 is the conclusion reached through discussion or thought. Agreement and reaching a conclusion are separate ideas.', [
 ['@この @問題 について @先生 の 353 を @聞く~聞きました~ききました','I asked for my teacher’s view on this issue.'],
 ['@私 の 353 は @友達 の 353 と @違う~違います~ちがいます','My view differs from my friend’s view.'],
 ['@皆さん の @意見 が 169 @する~しました~しました','Everyone’s opinions agreed.'],
 ['@二つ の 1559 の @数字 が 169 @する~しています~しています','The figures in the two reports match.'],
 ['1608 の @後 で 224 を @出す~出しました~だしました','We reached a conclusion after the discussion.'],
 ['224 を @急ぐ~急がず~いそがず に @もう @少し @考える~考えましょう~かんがえましょう','Let’s think a little more without rushing to a conclusion.'],
]);
lesson('perspectives','Considering another viewpoint',[161,142], 'Nの視点から / Nを考慮します', '視点 is the viewpoint from which you consider something. から marks that starting point. 考慮する means taking a factor into account when making a decision; を marks that factor.', [
 ['@子供 の 161 から @町 を @見る~見ました~みました','I looked at the town from a child’s viewpoint.'],
 ['@別 の 161 から @この @問題 を @考える~考えました~かんがえました','I considered this problem from another perspective.'],
 ['@先生 の 161 は @私 の 161 と @違う~違います~ちがいます','My teacher’s perspective differs from mine.'],
 ['@客 の 161 から @店 の @説明 を @読む~読みました~よみました','I read the shop’s explanation from a customer’s viewpoint.'],
 ['@外国 の @友達 の 161 から @日本 の @生活 を @考える~考えました~かんがえました','I thought about life in Japan from my foreign friend’s perspective.'],
 ['@二つ の 161 から @計画 を @比べる~比べました~くらべました','I compared the plans from two perspectives.'],
 ['111 を 142 @する~して~して @旅行 の @計画 を @立てる~立てました~たてました','I took the cost into account when planning the trip.'],
 ['@子供 の @年齢 を 142 @する @必要 が @ある~あります~あります','We need to take the children’s ages into account.'],
 ['@時間 を 142 @する~して~して @駅 の @近く の @店 を @選ぶ~選びました~えらびました','Considering the time available, I chose a shop near the station.'],
 ['@天気 も 142 @する~して~して @予定 を @決める~決めます~きめます','I will decide the schedule after considering the weather too.'],
 ['@家族 の @意見 を 142 @する~しました~しました','I took my family’s opinions into account.'],
 ['@健康 を 142 @する~して~して @仕事 の @時間 を @変える~変えました~かえました','I changed my working hours with my health in mind.'],
]);
course.lessons.at(-1).notes[0].title='A viewpoint and a factor to consider';
lesson('understanding','Misunderstandings and nodding',[226,1392,2516], '誤解があります / 勘違いでした / 頷きます', '誤解 often involves misinterpreting someone’s words or intentions. 勘違い is a mistaken assumption or confusion, such as the wrong time or date. 頷く means to nod. A nod can show that someone is listening; it does not always mean agreement.', [
 ['@私 の @説明 が @短い~短かった~みじかかった ので 226 が @生まれる~生まれました~うまれました','My brief explanation led to a misunderstanding.'],
 ['226 @する~した~した @理由 を @聞く~聞きました~ききました','I asked why the misunderstanding had happened.'],
 ['@会議 の @日 を 1392 @する~していました~していました','I had mistaken the date of the meeting.'],
 ['@すみません @私 の 1392 でした','Sorry, I was mistaken.'],
 ['@友達 は @私 の @話 を @聞く~聞いて~きいて 2516~頷きました~うなずきました','My friend listened to what I said and nodded.'],
 ['@先生 は 2516~頷きながら~うなずきながら @話 を @聞く~聞いて~きいて @くれる~くれました~くれました','The teacher nodded while listening to me.'],
]);
lesson('voices','Calling out, whispering and angry voices',[655,2390,2416], '大きな声で叫びます / 小さな声でささやきます', '叫ぶ means to shout or call out, for example across a distance. ささやく is to whisper. 怒鳴る is yelling, often with anger or force. The volume and tone affect how someone experiences the same words.', [
 ['@遠く の @友達 の @名前 を 655~叫びました~さけびました','I called out the name of my friend in the distance.'],
 ['@子供 が @大きな @声 で 655~叫んでいます~さけんでいます','A child is shouting loudly.'],
 ['@子供 が @寝る~寝ている~ねている ので @小さな @声 で 2390~ささやきました~ささやきました','I whispered because the child was sleeping.'],
 ['@隣 の @人 に @答え を 2390~ささやきました~ささやきました','I whispered the answer to the person next to me.'],
 ['@相手 が 2416~怒鳴った~どなった ので @驚く~驚きました~おどろきました','I was startled when the other person yelled.'],
 ['2416~怒鳴らず~どならず に 218 に @話す~話しましょう~はなしましょう','Let’s speak calmly without yelling.'],
]);
lesson('responding','Responding and keeping to the point',[940,2695,2739], '依頼に応じます / 問題に対応します', '応じる means responding to or accepting a request, offer or invitation; に marks what you respond to. 対応する means handling a situation or responding to someone’s needs. ポイント here is the main point or an important detail, not a score.', [
 ['@先生 は 187 の @依頼 に 940~応じました~おうじました','The teacher agreed to the interview request.'],
 ['@急 な @注文 に も 940~応じます~おうじます','We also accept orders at short notice.'],
 ['@店 は @客 の @質問 に @丁寧 に 2695 @する~しています~しています','The shop responds politely to customers’ questions.'],
 ['@問題 が @起きる~起きた~おきた @時 の 2695 を 968~話し合いました~はなしあいました','We discussed how to respond when a problem occurs.'],
 ['@説明 の 2739 を @ノート に @書く~書きました~かきました','I wrote the main points of the explanation in my notebook.'],
 ['2739 を @確認 @する~して~して から @質問 @する~しました~しました','I checked the main points before asking a question.'],
]);
lesson('priorities','Explaining what matters',[191,343], 'Nを重視します / …と強調します', '重視する means attaching importance to something when deciding or acting. 強調する means stressing a point in what you say or write. Use を for the point itself, or と after a statement you emphasize.', [
 ['@会社 は @安全 を 191 @する~しています~しています','The company places importance on safety.'],
 ['@学校 は @学生 の @意見 を 191 @する~しています~しています','The school values students’ opinions.'],
 ['@店 を @選ぶ @時 は @値段 より @味 を 191 @する~します~します','When choosing a restaurant, I value taste more than price.'],
 ['@家 を @選ぶ @時 は @便利 な @場所 を 191 @する~します~します','When choosing a home, I place importance on a convenient location.'],
 ['@この @会社 は @働く @人 の @健康 を 191 @する~しています~しています','This company places importance on its employees’ health.'],
 ['@友達 は @デザイン を 191 @する~して~して @時計 を @選ぶ~選びました~えらびました','My friend chose a watch with emphasis on its design.'],
 ['@先生 は @練習 が @大切 だ と 343 @する~しました~しました','The teacher emphasized that practice is important.'],
 ['@説明 で は @安全 を 343 @する~しました~しました','I emphasized safety in the explanation.'],
 ['@話 の 2739 を 343 @する~しました~しました','I emphasized the main points of the talk.'],
 ['343 @する~した~した @言葉 を @ノート に @書く~書きました~かきました','I wrote the words that were emphasized in my notebook.'],
 ['@会議 で @自分 の @意見 を 343 @する~しました~しました','I stressed my opinion at the meeting.'],
 ['@声 を @大きい~大きく~おおきく @する~して~して @大事 な @言葉 を 343 @する~しました~しました','I raised my voice to emphasize the important words.'],
]);
course.lessons.at(-1).notes[0].title='Value something or emphasize a point';
lesson('acknowledging','Acknowledging and distinguishing',[193,298], 'Nを認めます / NとNを区別します', '認める can acknowledge something positive, such as effort, or admit something unwelcome, such as a mistake. 区別する means telling things apart. Use と between the things you distinguish, followed by を.', [
 ['@自分 の @間違い を 193~認めました~みとめました','I admitted my mistake.'],
 ['@数字 が @違う @こと を 193~認めました~みとめました','I acknowledged that the figures were different.'],
 ['@失敗 を 193~認めて~みとめて @友達 に @謝る~謝りました~あやまりました','I admitted the failure and apologized to my friend.'],
 ['@先生 は @私 の @努力 を 193~認めて~みとめて @くれる~くれました~くれました','The teacher acknowledged my efforts.'],
 ['@皆さん が @彼 の @努力 を 193~認めています~みとめています','Everyone recognizes his efforts.'],
 ['@意見 が @違う @こと を 193~認めて~みとめて から 968~話し合いました~はなしあいました','We acknowledged that our opinions differed before discussing the matter.'],
 ['@この @二つ の @音 を 298 @できる~できます~できます','I can distinguish these two sounds.'],
 ['@事実 と @意見 を 298 @する~します~します','I distinguish facts from opinions.'],
 ['@色 で @箱 を 298 @する~しました~しました','I distinguished the boxes by their colors.'],
 ['@似る~似た~にた @言葉 を 298 @する @練習 を @する~します~します','I practice distinguishing similar words.'],
 ['@この @二つ の @意味 は 298 @する~しにくい~しにくい です','These two meanings are difficult to distinguish.'],
 ['@仕事 の @メール と @友達 の @メール を 298 @する~しています~しています','I distinguish work emails from emails from friends.'],
]);
course.lessons.at(-1).notes[0].title='Admitting and telling apart';
lesson('decision-account','Reconsidering a travel plan',[], 'Consider a viewpoint, explain a priority, acknowledge a mistake', 'When discussing a plan, distinguish what you know from your own view. 認める lets you acknowledge a mistake; 考慮する describes the factors you take into account.', [
 ['@家族 と @旅行 の @計画 を 968~話し合いました~はなしあいました','I discussed the travel plan with my family.'],
 ['@子供 の 161 から @予定 を @考える~考えました~かんがえました','I considered the schedule from the children’s viewpoint.'],
 ['@家族 は @安全 を 191 @する~しています~しています','My family places importance on safety.'],
 ['111 と @時間 も 142 @する~しました~しました','I also took the cost and time into account.'],
 ['@私 は @駅 が @近い と 343 @する~しました~しました','I emphasized that the station was nearby.'],
 ['@でも @駅 まで @一 @時間 3004~かかる~かかる @こと が @わかる~分かりました~わかりました','But I found out that reaching the station would take an hour.'],
 ['@自分 の @間違い を 193~認めて~みとめて @計画 を @変える~変えました~かえました','I acknowledged my mistake and changed the plan.'],
 ['@事実 と @自分 の @意見 を 298 @する~して~して @家族 に @説明 @する~しました~しました','I explained things to my family, distinguishing facts from my own opinions.'],
]);
course.lessons.at(-1).notes[0].title='Explaining a decision';
lesson('account','Clearing up a meeting date',[], 'A connected account of a misunderstanding', 'Follow the mistaken date, the check and the response. Reuse the difference between a mistaken assumption and a misunderstanding between people.', [
 ['@会議 は @金曜日 だ と @思う~思っていました~おもっていました','I thought the meeting was on Friday.'],
 ['@友達 と @予定 を 968~話し合って~はなしあって @間違い に 480~気づきました~きづきました','I discussed the schedule with my friend and noticed the mistake.'],
 ['@先生 に @質問 を @送る~送って~おくって 1357 を @待つ~待ちました~まちました','I sent my teacher a question and waited for the answer.'],
 ['@先生 の @丁寧 な 2695 は @とても 1375~ありがたかった~ありがたかった です','I was very grateful for the teacher’s considerate response.'],
 ['@正しい @日 を @確認 @する~して~して 639 @する~しました~しました','I checked the correct date and felt relieved.'],
]);
}
