export function authorPublicResponses({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@盗難':'theft','B1@詐欺':'fraud; scam','B1@過失':'fault; negligent error',
 'B1@争い':'dispute; conflict','B1@騒ぎ':'commotion; disturbance','B1@騒動':'uproar; public disturbance',
 'B1@暴力':'violence','B1@非難':'criticism; blame','B1@緊急':'urgent; emergency',
 'B1@危機':'crisis','B1@災害':'disaster','B1@防犯':'crime prevention',
 'B1@警備':'security; guarding','B1@巡査':'police officer; constable',
 'B1@監視':'monitoring; surveillance','B1@警戒':'vigilance; being on guard',
 'B1@防止':'prevention','B1@対策':'countermeasure; plan for dealing with a problem',
 'B1@対処':'dealing with; responding to','B1@措置':'measure; action taken',
 'B1@要請':'request; appeal','B1@宣言':'declaration; announcement',
 'B1@拒否':'refusal; rejection','B1@強制':'compulsion; forcing',
 'B1@禁煙':'no smoking; abstaining from smoking','B1@解除':'lifting; cancellation; release',
 'B1@解放':'liberation; setting free','B1@開放':'opening; making accessible',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('discussion');
lesson('theft-fraud-and-fault','Theft, fraud and fault',['B1@盗難','B1@詐欺','B1@過失'],
 '盗難 / 詐欺 / 過失','盗難 is theft. 詐欺 deceives someone for gain. 過失 concerns a fault or negligent error, rather than an intentional act.',[
 ['@駅 で @自転車 の B1@盗難 が @ある~ありました~ありました','There was a bicycle theft at the station.'],
 ['@車 の B1@盗難 を @警察 に @届ける~届けました~とどけました','I reported the theft of the car to the police.'],
 ['@この @地域 の B1@盗難 について @記事 を @読む~読みました~よみました','I read an article about theft in this area.'],
 ['@その @話 は B1@詐欺 でした','That story was a scam.'],
 ['B1@詐欺 の @手紙 が @来る~来ました~きました','A fraudulent letter arrived.'],
 ['@警察 は B1@詐欺 の @事件 を @調べる~調べています~しらべています','The police are investigating a fraud case.'],
 ['@事故 について @自分 の B1@過失 を B1@認める~認めました~みとめました','I acknowledged that I was at fault in the accident.'],
 ['B1@過失 の @原因 を @調べる~調べています~しらべています','They are investigating the cause of the error.'],
 ['@会社 は B1@過失 を B1@認める~認めて~みとめて @謝る~謝りました~あやまりました','The company acknowledged its fault and apologized.'],
]);
lesson('disputes-and-disturbances','Disputes and disturbances',['B1@争い','B1@騒ぎ','B1@騒動'],
 '争い / 騒ぎ / 騒動','争い is a dispute or conflict. 騒ぎ is a commotion. 騒動 often describes a disturbance or controversy that involves a wider group.',[
 ['@土地 について B1@争い が @ある~ありました~ありました','There was a dispute over land.'],
 ['@長い B1@争い が @終わる~終わりました~おわりました','The long dispute ended.'],
 ['@二つ の @町 の B1@争い について @読む~読みました~よみました','I read about the dispute between the two towns.'],
 ['@外 で @大きい B1@騒ぎ が @ある~ありました~ありました','There was a big commotion outside.'],
 ['B1@騒ぎ の @原因 を @聞く~聞きました~ききました','I asked what caused the commotion.'],
 ['@警察 が @来る~来た~きた @後 B1@騒ぎ は @静か に @なる~なりました~なりました','The commotion died down after the police came.'],
 ['@新聞 が @町 の B1@騒動 を @伝える~伝えています~つたえています','The newspaper is reporting the disturbance in town.'],
 ['B1@騒動 は @一つ の @間違い から @始まる~始まりました~はじまりました','The uproar began with one mistake.'],
 ['@この B1@騒動 について @住民 が @話す~話しました~はなしました','The residents talked about this disturbance.'],
]);
lesson('violence-and-criticism','Violence and criticism',['B1@暴力','B1@非難'],
 '暴力 / 非難します','暴力 names violence. 非難 expresses criticism or blame; it does not mean physical violence.',[
 ['@学校 は B1@暴力 を B1@認める~認めません~みとめません','The school does not accept violence.'],
 ['B1@暴力 の @ある~ない~ない @社会 について @考える~考えました~かんがえました','We thought about a society without violence.'],
 ['@記事 は B1@暴力 の @問題 を @説明 @する~しています~しています','The article explains the problem of violence.'],
 ['@住民 は @会社 の B1@対応 を B1@非難 @する~しました~しました','The residents criticized the company’s response.'],
 ['@彼 は @説明 を @する~しなかった~しなかった ので B1@非難 @する~されました~されました','He was criticized because he did not explain.'],
 ['@相手 を B1@非難 @する @前 に @話 を @聞く~聞きました~ききました','I listened before criticizing the other person.'],
]);
lesson('emergencies-and-crises','Emergencies, crises and disasters',['B1@緊急','B1@危機','B1@災害'],
 '緊急の / 危機 / 災害','緊急 calls for immediate attention. 危機 is a critical situation. 災害 names a disaster such as one caused by a flood or earthquake.',[
 ['B1@緊急 の @会議 が A2@開く~開かれました~ひらかれました','An emergency meeting was held.'],
 ['@これ は B1@緊急 の @連絡 です','This is an urgent message.'],
 ['@病院 から B1@緊急 の @電話 が @来る~来ました~きました','An urgent call came from the hospital.'],
 ['@会社 は @大きい B1@危機 に @ある~あります~あります','The company is in a major crisis.'],
 ['B1@危機 の @原因 を @考える~考えました~かんがえました','We thought about the cause of the crisis.'],
 ['@この B1@危機 は @まだ @終わる~終わっていません~おわっていません','This crisis is not over yet.'],
 ['B1@災害 の @後 @多い~多く~おおく の @人 が @協力 @する~しました~しました','Many people worked together after the disaster.'],
 ['@学校 で B1@災害 について @勉強 @する~しました~しました','We learned about disasters at school.'],
 ['@この @地図 に B1@災害 の @記録 が @ある~あります~あります','This map contains records of disasters.'],
]);
lesson('reading-a-town-report-account','Reading a report about a town',[],
 '災害 / 緊急 / 危機 / 騒ぎ','Follow the report and separate what happened from how people reacted.',[
 ['@新聞 で @町 の B1@災害 について @読む~読みました~よみました','I read about a disaster in a town in the newspaper.'],
 ['@水 が @道 に @入る~入った~はいった ので @交通 が @止まる~止まりました~とまりました','Water entered the roads, so traffic stopped.'],
 ['@市 は B1@緊急 の @会議 を A2@開く~開きました~ひらきました','The city held an emergency meeting.'],
 ['@駅 の @前 で @小さい B1@騒ぎ が @ある~ありました~ありました','There was a small commotion in front of the station.'],
 ['@住民 は @情報 を @聞く~聞いて~きいて @家 に @帰る~帰りました~かえりました','The residents heard the information and returned home.'],
 ['@記事 は B1@危機 の @中 の @協力 を @伝える~伝えていました~つたえていました','The article described cooperation during the crisis.'],
]);
useTopic('rules');
lesson('security-and-police','Crime prevention, security and police',['B1@防犯','B1@警備','B1@巡査'],
 '防犯 / 警備 / 巡査','防犯 aims to prevent crime. 警備 guards a place or event. 巡査 is a police officer, and also names a rank in the Japanese police.',[
 ['@地域 で B1@防犯 について @話す~話しました~はなしました','We discussed crime prevention in the community.'],
 ['@入り口 に B1@防犯 の @カメラ が @ある~あります~あります','There is a security camera at the entrance.'],
 ['B1@防犯 の @ため に @鍵 を @確認 @する~しました~しました','I checked the lock to help prevent theft.'],
 ['@会場 の B1@警備 が @始まる~始まりました~はじまりました','Security duties at the venue began.'],
 ['@建物 を B1@警備 @する~している~している @人 に @道 を @聞く~聞きました~ききました','I asked the person guarding the building for directions.'],
 ['@祭り の B1@警備 について @説明 が @ある~ありました~ありました','There was an explanation of security arrangements for the festival.'],
 ['B1@巡査 が @道 を @教える~教えてくれました~おしえてくれました','A police officer gave me directions.'],
 ['@交番 の @前 に B1@巡査 が @いる~いました~いました','There was a police officer in front of the police box.'],
 ['B1@巡査 に @拾う~拾った~ひろった @財布 を @渡す~渡しました~わたしました','I handed a wallet I had found to a police officer.'],
]);
lesson('watching-and-being-alert','Monitoring and being on guard',['B1@監視','B1@警戒'],
 '監視します / 警戒します','監視 keeps watch on something. 警戒 is alertness toward a possible danger, whether or not it has happened.',[
 ['@川 の @水 を B1@監視 @する~しています~しています','They are monitoring the river water.'],
 ['@この @部屋 から @入り口 を B1@監視 @する~します~します','We monitor the entrance from this room.'],
 ['@機械 で B1@監視 を @続ける~続けています~つづけています','We continue monitoring with machines.'],
 ['@強い @雨 に B1@警戒 @する~しています~しています','They are on alert for heavy rain.'],
 ['@犬 は @知る~知らない~しらない @人 を B1@警戒 @する~しています~しています','The dog is wary of strangers.'],
 ['@市 は @川 の @水 に B1@警戒 を @続ける~続けています~つづけています','The city remains alert to the river water.'],
]);
lesson('prevention-plans-and-responses','Prevention, plans and responses',['B1@防止','B1@対策','B1@対処'],
 '防止 / 対策 / 対処します','防止 tries to stop something from happening. 対策 is a plan or measure against a problem. 対処 deals with the situation that needs attention.',[
 ['@事故 の B1@防止 について @考える~考えました~かんがえました','We thought about preventing accidents.'],
 ['@同じ @間違い を B1@防止 @する @方法 を @探す~探しています~さがしています','We are looking for a way to prevent the same mistake.'],
 ['B1@盗難 の B1@防止 の @ため に @新しい @鍵 を @買う~買いました~かいました','I bought a new lock to help prevent theft.'],
 ['@強い @雨 の B1@対策 を @考える~考えました~かんがえました','We considered measures for heavy rain.'],
 ['B1@防犯 の B1@対策 を @地域 で B1@話し合う~話し合いました~はなしあいました','We discussed crime-prevention measures in the community.'],
 ['@新しい B1@対策 の @効果 を @調べる~調べました~しらべました','We examined the effect of the new measures.'],
 ['@問題 に @すぐ B1@対処 @する~しました~しました','We dealt with the problem immediately.'],
 ['B1@対処 の @方法 を @全員 に @伝える~伝えました~つたえました','I told everyone how to respond.'],
 ['@私たち は @協力 @する~して~して B1@対処 @する~しました~しました','We worked together to deal with the situation.'],
]);
lesson('official-actions-and-requests','Official measures, requests and declarations',['B1@措置','B1@要請','B1@宣言'],
 '措置 / 要請します / 宣言します','措置 is an action taken to deal with a situation. 要請 is a formal request. 宣言 publicly states an intention, decision or position.',[
 ['@市 は B1@緊急 の B1@措置 を @取る~取りました~とりました','The city took emergency measures.'],
 ['@この B1@措置 の @理由 を @説明 @する~しました~しました','They explained the reason for this measure.'],
 ['@安全 の @ため の B1@措置 が @必要 です','Measures for safety are necessary.'],
 ['@市 は @住民 に @協力 を B1@要請 @する~しました~しました','The city requested residents’ cooperation.'],
 ['@医者 の B1@要請 で @部屋 を @用意 @する~しました~しました','We prepared a room at the doctor’s request.'],
 ['@学校 から B1@要請 が @来る~来ました~きました','A request arrived from the school.'],
 ['@代表 は @会議 の @開始 を B1@宣言 @する~しました~しました','The representative declared the meeting open.'],
 ['@代表 は @計画 を @実行 @する @こと を B1@宣言 @する~しました~しました','The representative declared their intention to carry out the plan.'],
 ['@この B1@宣言 は @新聞 に @出る~出ました~でました','This declaration appeared in the newspaper.'],
]);
lesson('refusal-compulsion-and-no-smoking','Refusal, compulsion and no-smoking notices',['B1@拒否','B1@強制','B1@禁煙'],
 '拒否します / 強制します / 禁煙','拒否 refuses or rejects something. 強制 forces someone to do something. 禁煙 on a notice means no smoking; for a person, it can mean abstaining from smoking.',[
 ['@彼 は @質問 に @答える @こと を B1@拒否 @する~しました~しました','He refused to answer the question.'],
 ['@会社 は @その @要求 を B1@拒否 @する~しました~しました','The company rejected the demand.'],
 ['B1@拒否 の @理由 を @聞く~聞きました~ききました','I asked why it had been refused.'],
 ['@参加 を B1@強制 @する~しないで~しないで ください','Please do not force people to participate.'],
 ['@これ は B1@強制 ではありません','This is not compulsory.'],
 ['@自分 の @意見 を @相手 に B1@強制 @する~したくありません~したくありません','I do not want to force my opinion on the other person.'],
 ['@この @部屋 は B1@禁煙 です','This room is non-smoking.'],
 ['B1@禁煙 の @席 を @お願い @する~しました~しました','I asked for a non-smoking seat.'],
 ['@父 は B1@禁煙 を @始める~始めました~はじめました','My father started giving up smoking.'],
]);
lesson('lifting-releasing-and-opening','Lifting a restriction, releasing and opening',['B1@解除','B1@解放','B1@開放'],
 '解除 / 解放 / 開放','解除 removes a restriction, obligation or lock. 解放 sets someone or something free. 開放 opens a place or makes it accessible. The last two share the reading かいほう.',[
 ['@交通 の @制限 が B1@解除 @する~されました~されました','The traffic restrictions were lifted.'],
 ['@市 は @公園 の @制限 を B1@解除 @する~しました~しました','The city lifted the restrictions in the park.'],
 ['@制限 の B1@解除 について @発表 が @ある~ありました~ありました','There was an announcement about lifting the restriction.'],
 ['@捕まえる~捕まえた~つかまえた @鳥 を B1@解放 @する~しました~しました','We released the bird we had caught.'],
 ['@長い @仕事 が @終わる~終わって~おわって @責任 から B1@解放 @する~されました~されました','The long job ended, and I was freed from the responsibility.'],
 ['@その @人 は @昨日 B1@解放 @する~されました~されました','That person was released yesterday.'],
 ['@学校 は @庭 を @地域 の @人 に B1@開放 @する~しました~しました','The school opened its garden to local people.'],
 ['@窓 を B1@開放 @する~して~して @空気 を @入れる~入れました~いれました','I opened the windows and let air in.'],
 ['@この @建物 は @週末 に B1@開放 @する~されます~されます','This building is open to the public on weekends.'],
]);
lesson('a-community-security-meeting-account','Discussing community security',[],
 '盗難 / 防犯 / 対策 / 要請','Follow the discussion after a reported theft.',[
 ['@町 で @自転車 の B1@盗難 が @続く~続いていました~つづいていました','Bicycle thefts had been continuing in the town.'],
 ['@住民 が @集まる~集まって~あつまって B1@防犯 について @話す~話しました~はなしました','The residents gathered and discussed crime prevention.'],
 ['B1@巡査 は @最近 の @事件 を @説明 @する~しました~しました','A police officer explained the recent incidents.'],
 ['@市 は @住民 に @協力 を B1@要請 @する~していました~していました','The city had requested residents’ cooperation.'],
 ['@私たち は @新しい B1@対策 の @必要 を @感じる~感じました~かんじました','We felt the need for new measures.'],
 ['@次 の @会議 で B1@対策 の @効果 を @確認 @する @予定 です','We plan to check the effects of the measures at the next meeting.'],
]);
lesson('after-a-weather-warning-account','After heavy rain',[],
 '警戒 / 監視 / 措置 / 解除 / 開放','Follow the response to heavy rain and the reopening of public spaces.',[
 ['@強い @雨 が @降る~降った~ふった ので @市 は B1@警戒 を @始める~始めました~はじめました','Heavy rain fell, so the city went on alert.'],
 ['@川 の @水 を B1@監視 @する~している~している @人 が @情報 を @伝える~伝えました~つたえました','The people monitoring the river water provided information.'],
 ['@市 は @道 を @閉める B1@措置 を @取る~取りました~とりました','The city took the measure of closing the road.'],
 ['@住民 は @協力 @する~して~して B1@対処 @する~しました~しました','The residents worked together to respond.'],
 ['@次 の @日 @交通 の @制限 が B1@解除 @する~されました~されました','The traffic restrictions were lifted the next day.'],
 ['@公園 は @再び @住民 に B1@開放 @する~されました~されました','The park was opened to residents again.'],
]);
}
