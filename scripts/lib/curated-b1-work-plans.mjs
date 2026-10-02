export function authorWorkPlans({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@プラン':'plan','B1@段階':'stage; step','B1@採る':'to adopt a method or course of action',
 'B1@指定':'specifying; designation','B1@特定':'identifying; particular; specific',
 'B1@複数':'more than one; multiple','B1@正規':'official; regular; formally established',
 'B1@体制':'organizational structure; arrangements for carrying out work',
 'B1@本部':'headquarters','B1@外部':'outside an organization or place',
 'B1@相互':'mutual; reciprocal','B1@成立':'coming into effect; reaching an agreement',
 'B1@強化':'strengthening','B1@普及':'spread; widespread adoption',
 'B1@低下':'decline; lowering','B1@比較的':'relatively; comparatively',
 'B1@箇所':'part; spot; location','B1@用途':'purpose; intended use',
 'B1@拡張':'expansion; extension','B1@改造':'modification; remodelling',
 'B1@交代':'taking turns; replacement on a task','B1@売り上げ':'sales; sales revenue',
 'B1@商業':'commerce; trade','B1@過剰':'excessive; more than needed',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('paperwork');
lesson('plans-stages-and-methods','Plans, stages and adopting methods',['B1@プラン','B1@段階','B1@採る'],
 'プラン / 段階 / 方法を採ります',
 'プラン is a plan. 段階 (dankai) names a stage in a process. 採る (toru) here means adopting a method or course of action, rather than physically picking something up.',[
 ['@会議 で @新しい B1@プラン を @説明 @する~しました~しました','I explained a new plan at the meeting.'],
 ['@二つ の B1@プラン を @比べる~比べています~くらべています','We are comparing two plans.'],
 ['@来月 の B1@プラン を @部長 に @見せる~見せました~みせました','I showed next month’s plan to the department head.'],
 ['@今 は @計画 の B1@段階 です','We are at the planning stage now.'],
 ['@次 の B1@段階 に @進む @前 に @結果 を @確認 @する~します~します','We check the results before moving to the next stage.'],
 ['@それぞれ の B1@段階 で @必要 な @時間 を @調べる~調べました~しらべました','We checked how much time was needed at each stage.'],
 ['@安全 な @方法 を B1@採る~採りました~とりました','We adopted a safe method.'],
 ['@前 と @同じ @方法 を B1@採る~採ります~とります','We will use the same method as before.'],
 ['@どの @方法 を B1@採る か @会議 で @決める~決めました~きめました','We decided at the meeting which method to adopt.'],
]);
lesson('specifying-and-identifying','Specifying and identifying',['B1@指定','B1@特定','B1@複数'],
 '指定します / 特定します / 複数の',
 '指定 (shitei) selects or specifies something in advance. 特定 (tokutei) can identify something precisely; 特定の means particular or specific. 複数 (fukusū) means more than one.',[
 ['@会社 は @集まる @場所 を B1@指定 @する~しました~しました','The company specified where to meet.'],
 ['B1@指定 @する~された~された @時間 に @来る~来てください~きてください','Please come at the specified time.'],
 ['@使う @紙 を B1@指定 @する~してください~してください','Please specify which paper to use.'],
 ['@問題 の @原因 を B1@特定 @する~しました~しました','We identified the cause of the problem.'],
 ['B1@特定 の @人 に @仕事 が @集まる~集まっています~あつまっています','The work is concentrated on particular people.'],
 ['@原因 を B1@特定 @する~する~する ために @記録 を @調べる~調べました~しらべました','We examined the records to identify the cause.'],
 ['B1@複数 の @会社 に @連絡 @する~しました~しました','I contacted several companies.'],
 ['@この @仕事 は B1@複数 の @人 で @する~します~します','Several people do this work together.'],
 ['B1@複数 の @方法 から @一つ を @選ぶ~選びました~えらびました','We chose one of several methods.'],
]);
lesson('formal-arrangements-and-headquarters','Official arrangements and headquarters',['B1@正規','B1@体制','B1@本部'],
 '正規の / 体制 / 本部',
 '正規 (seiki) means official, regular or formally established. 体制 (taisei) is the way an organization arranges its work. 本部 (honbu) is its headquarters.',[
 ['B1@正規 の B1@手続き で B1@申し込む~申し込みました~もうしこみました','I applied through the official procedure.'],
 ['@これ は B1@正規 の @料金 です か','Is this the standard fee?'],
 ['B1@正規 の B1@職員 に @なる~なりました~なりました','I became a regular staff member.'],
 ['@新しい B1@体制 で @仕事 を @始める~始めました~はじめました','We started working under the new arrangements.'],
 ['@今 の B1@体制 を B1@見直す~見直しています~みなおしています','We are reviewing the current organizational arrangements.'],
 ['@夜 も @電話 で @話す~話せる~はなせる B1@体制 を @作る~作りました~つくりました','We set up a system that allows us to talk by phone at night too.'],
 ['B1@本部 に B1@書類 を @送る~送りました~おくりました','I sent the documents to headquarters.'],
 ['B1@本部 は @駅 の @近く に @ある~あります~あります','Headquarters is near the station.'],
 ['B1@本部 の @人 と @電話 で @話す~話しました~はなしました','I spoke on the phone with someone at headquarters.'],
]);
lesson('outside-cooperation-and-agreements','Outside cooperation and agreements',['B1@外部','B1@相互','B1@成立'],
 '外部 / 相互 / 成立します',
 '外部 (gaibu) is outside the organization in these examples. 相互 (sōgo) means mutual or reciprocal. 成立 (seiritsu) describes an agreement or arrangement being reached or established.',[
 ['@この B1@書類 は B1@外部 に @出す~出せません~だせません','We cannot release these documents outside the organization.'],
 ['B1@外部 の @人 に @意見 を @聞く~聞きました~ききました','We asked someone outside the organization for their opinion.'],
 ['B1@外部 から @新しい @情報 が @入る~入りました~はいりました','New information came from outside.'],
 ['B1@相互 の @理解 が @大切 です','Mutual understanding is important.'],
 ['@二つ の @会社 は B1@相互 に @協力 @する~しています~しています','The two companies cooperate with each other.'],
 ['B1@相互 の @利益 について @話す~話しました~はなしました','We discussed our mutual interests.'],
 ['@長い @相談 の @後 で B1@取引 が B1@成立 @する~しました~しました','The deal was concluded after a long discussion.'],
 ['@条件 が @合う~合わない~あわない から B1@取引 は B1@成立 @する~しませんでした~しませんでした','The deal did not go through because the terms did not match.'],
 ['B1@取引 が B1@成立 @する~した~した @日 を @記録 @する~しました~しました','I recorded the date the deal was concluded.'],
]);
lesson('agreement-account','Reaching an agreement',[],
 'プラン / 複数 / 指定 / 外部 / 相互 / 成立',
 'Follow a plan from an initial meeting to an agreement.',[
 ['@最初 に B1@複数 の @会社 に B1@プラン を @見せる~見せました~みせました','First, we showed the plan to several companies.'],
 ['@一つ の @会社 が @相談 の @日 を B1@指定 @する~しました~しました','One company specified a date for discussions.'],
 ['@私たち は B1@外部 の @意見 も @聞く~聞きました~ききました','We also listened to views from outside our organization.'],
 ['@相談 で B1@相互 の @利益 を @確認 @する~しました~しました','In the discussion, we confirmed our mutual interests.'],
 ['@条件 を @確認 @する~した~した @後 で B1@取引 が B1@成立 @する~しました~しました','The deal was concluded after we checked the terms.'],
 ['B1@本部 に @結果 を @報告 @する~しました~しました','We reported the result to headquarters.'],
]);
lesson('strengthening-spread-and-decline','Strengthening, adoption and decline',['B1@強化','B1@普及','B1@低下'],
 '強化します / 普及します / 低下します',
 '強化 (kyōka) makes something stronger. 普及 (fukyū) is the spread of something into wider use. 低下 (teika) is a decline in a level, amount or quality.',[
 ['@会社 は @安全 について の B1@教育 を B1@強化 @する~しました~しました','The company strengthened its safety training.'],
 ['@確認 の B1@体制 を B1@強化 @する~しています~しています','We are strengthening our checking procedures.'],
 ['@何 を B1@強化 @する~する~する か @会議 で @決める~決めました~きめました','We decided at the meeting what to strengthen.'],
 ['@新しい @技術 が B1@普及 @する~しています~しています','The new technology is becoming widely used.'],
 ['@この @機械 は @まだ B1@普及 @する~していません~していません','This machine is not widely used yet.'],
 ['@会社 は @製品 の B1@普及 に @力 を @入れる~入れています~いれています','The company is putting effort into making its product more widely used.'],
 ['@製品 の @質 が B1@低下 @する~しました~しました','Product quality declined.'],
 ['@仕事 の @速度 が B1@低下 @する~しています~しています','The pace of work is slowing down.'],
 ['@質 の B1@低下 の @原因 を @調べる~調べました~しらべました','We investigated the cause of the decline in quality.'],
]);
lesson('parts-purposes-and-comparison','Parts, purposes and comparisons',['B1@比較的','B1@箇所','B1@用途'],
 '比較的 / 箇所 / 用途',
 '比較的 (hikakuteki) means relatively. 箇所 (kasho) points to a particular part or spot. 用途 (yōto) is what something is intended to be used for.',[
 ['@この @方法 は B1@比較的 @簡単 です','This method is relatively simple.'],
 ['@今週 は B1@比較的 @暇 です','We are relatively free this week.'],
 ['B1@比較的 @小さい @会社 で @働く~働いています~はたらいています','I work at a relatively small company.'],
 ['@問題 が @ある B1@箇所 を @確認 @する~しました~しました','We checked the part where there was a problem.'],
 ['@この B1@箇所 を @もう一度 @読む~読んでください~よんでください','Please read this part again.'],
 ['@直す B1@箇所 を @紙 に @書く~書きました~かきました','I wrote down the parts that needed fixing.'],
 ['@この @道具 の B1@用途 を @教える~教えてください~おしえてください','Please tell me what this tool is used for.'],
 ['B1@用途 に @合う @製品 を @選ぶ~選びます~えらびます','We choose a product that suits the intended use.'],
 ['@別 の B1@用途 で @同じ @道具 を @使う~使っています~つかっています','We use the same tool for a different purpose.'],
]);
lesson('expanding-modifying-and-rotating','Expanding, modifying and taking turns',['B1@拡張','B1@改造','B1@交代'],
 '拡張します / 改造します / 交代します',
 '拡張 (kakuchō) expands a space or capacity. 改造 (kaizō) changes how something is built or works. 交代 (kōtai) replaces one person with another on an activity or duty.',[
 ['@会社 は @工場 を B1@拡張 @する~しました~しました','The company expanded the factory.'],
 ['@来年 @店 を B1@拡張 @する~する~する @予定 です','We plan to expand the shop next year.'],
 ['B1@拡張 の @前 に @必要 な @お金 を @調べる~調べました~しらべました','We checked how much money we needed before expanding.'],
 ['@古い @機械 を B1@改造 @する~しました~しました','We modified an old machine.'],
 ['B1@改造 @する~した~した @機械 の @安全 を @確認 @する~しました~しました','We checked the safety of the modified machine.'],
 ['@別 の B1@用途 の ために @道具 を B1@改造 @する~しました~しました','We modified the tool for a different purpose.'],
 ['@昼 に B1@同僚 と B1@交代 @する~しました~しました','I took over from my colleague at noon.'],
 ['B1@交代 の @時間 を @確認 @する~してください~してください','Please check the handover time.'],
 ['@二人 で B1@交代 @する~しながら~しながら @仕事 を @続ける~続けました~つづけました','The two of us took turns continuing the work.'],
]);
lesson('commerce-sales-and-excess','Commerce, sales and excess',['B1@商業','B1@売り上げ','B1@過剰'],
 '商業 / 売り上げ / 過剰な',
 '商業 (shōgyō) concerns buying and selling goods. 売り上げ (uriage) is sales revenue, before subtracting costs. 過剰 (kajō) means more than is needed or appropriate.',[
 ['@学校 で B1@商業 について @勉強 @する~しています~しています','I am studying commerce at school.'],
 ['@この @町 は @地域 の B1@商業 の @中心 です','This town is the region’s commercial centre.'],
 ['@町 の B1@商業 の @歴史 を @調べる~調べました~しらべました','I researched the history of commerce in the town.'],
 ['@今月 の B1@売り上げ を @確認 @する~しました~しました','We checked this month’s sales.'],
 ['@店 の B1@売り上げ が @増える~増えました~ふえました','The shop’s sales increased.'],
 ['B1@売り上げ と @利益 は @同じ ではありません','Sales revenue and profit are not the same.'],
 ['B1@過剰 な @注文 を @受ける~受けない~うけない ように @する~しています~しています','We make sure not to accept more orders than we can handle.'],
 ['@その @サービス は B1@過剰 だ と @思う~思いました~おもいました','I thought that service was excessive.'],
 ['B1@過剰 な @期待 を @持つ~持たない~もたない ように @する~しています~しています','I try not to have excessive expectations.'],
]);
lesson('machine-improvement-account','Improving a machine at work',[],
 '低下 / 特定 / 箇所 / 改造 / 強化',
 'Follow a team as it investigates a problem and changes its equipment.',[
 ['@製品 の @質 が B1@低下 @する~していました~していました','Product quality had been declining.'],
 ['@私たち は @記録 を @調べる~調べて~しらべて @原因 を B1@特定 @する~しました~しました','We examined the records and identified the cause.'],
 ['@問題 が @ある B1@箇所 を B1@本部 に @報告 @する~しました~しました','We reported the problem area to headquarters.'],
 ['@私たち は @古い @機械 を B1@改造 @する @方法 を B1@採る~採りました~とりました','We chose the approach of modifying the old machine.'],
 ['B1@改造 の @後 で @確認 の B1@体制 も B1@強化 @する~しました~しました','After the modification, we also strengthened our checking procedures.'],
 ['@最後 に @製品 の @質 を @もう一度 @確認 @する~しました~しました','Finally, we checked the product quality once more.'],
]);
lesson('shop-planning-account','Planning the next stage of a shop',[],
 '売り上げ / 拡張 / プラン / 段階 / 交代',
 'Follow a shop’s discussion of its next steps.',[
 ['@店 の B1@売り上げ が @増える~増えていた~ふえていた から B1@拡張 を @考える~考えました~かんがえました','Sales had been increasing, so we considered expanding the shop.'],
 ['B1@複数 の B1@プラン を @作る~作って~つくって @必要 な @お金 を @比べる~比べました~くらべました','We drew up several plans and compared how much money each required.'],
 ['@私たち は B1@比較的 @安い B1@プラン を @選ぶ~選びました~えらびました','We chose a relatively inexpensive plan.'],
 ['@計画 の B1@段階 で B1@交代 の @時間 も @決める~決めました~きめました','During the planning stage, we also decided the handover times.'],
 ['@私たち は B1@過剰 な @期待 を @持つ~持たない~もたない ように @気 を @つける~つけました~つけました','We took care not to have excessive expectations.'],
 ['@次 の @会議 で @結果 を @確認 @する~する~する @予定 です','We plan to check the results at the next meeting.'],
]);
}
