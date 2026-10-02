export function authorAdministrationDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@政策':'public policy','B1@行政':'government administration','B1@県庁':'prefectural government office',
 'B1@当選':'being elected','B1@民間':'private; non-governmental','B1@施設':'facility',
 'B1@設置':'installation; setting up','B1@規模':'scale; size',
 'B1@設立':'founding; establishment of an organization','B1@協会':'association; society',
 'B1@所属':'belonging to an organization; affiliation','B1@部門':'department; division',
 'B1@連合':'alliance; union of groups','B1@連邦':'federation of states',
 'B1@公式':'official','B1@発言':'statement; speaking at a meeting','B1@指摘':'pointing out',
 'B1@支持':'support; backing','B1@対立':'opposition; conflict','B1@交渉':'negotiation',
 'B1@合同':'joint; combined','B1@権限':'authority; power to act','B1@規定':'rule; provision',
 'B1@廃止':'abolition; discontinuation','B1@閉鎖':'closure; shutdown',
 'B1@改正':'revision; amendment','B1@改革':'reform; reorganization',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('news');
lesson('policy-and-administration','Policy and local administration',['B1@政策','B1@行政','B1@県庁','B1@当選'],
 '政策 / 行政 / 県庁 / 当選します','政策 is a public policy; 行政 is the work of government administration. 県庁 is a prefectural government office. 当選する here means being elected.',[
 ['@市 の @新しい B1@政策 について @読む~読みました~よみました','I read about the city’s new policy.'],
 ['@交通 の B1@政策 を @市民 に @説明 @する~しました~しました','We explained the transport policy to residents.'],
 ['@二つ の B1@政策 の @違い を @調べる~調べました~しらべました','I examined the differences between the two policies.'],
 ['@大学 で B1@行政 について @勉強 @する~しています~しています','I study government administration at university.'],
 ['@市 の B1@行政 の @仕事 を @紹介 @する~します~します','I will introduce the work of the city administration.'],
 ['B1@行政 と @市民 が @一緒 に @問題 を @考える~考えました~かんがえました','The authorities and residents considered the problem together.'],
 ['@朝 B1@県庁 に @行く~行きました~いきました','I went to the prefectural government office in the morning.'],
 ['B1@県庁 の @前 で @友達 と @会う~会いました~あいました','I met a friend in front of the prefectural government office.'],
 ['B1@県庁 に @電話 で @質問 @する~しました~しました','I called the prefectural government office with a question.'],
 ['@市 の @選挙 で @若い @候補 が B1@当選 @する~しました~しました','A young candidate was elected in the city election.'],
 ['B1@当選 @する~した~した @候補 の @名前 を @新聞 で @読む~読みました~よみました','I read the names of the elected candidates in the newspaper.'],
 ['B1@当選 @する~した~した @人 が @市民 に @話す~話しました~はなしました','The person elected spoke to the residents.'],
]);
lesson('facilities-and-installation','Facilities and installation',['B1@民間','B1@施設','B1@設置','B1@規模'],
 '民間のN / 施設 / 設置します / 規模','民間 describes something outside government, such as a private company. 施設 is a facility. 設置する means installing or setting something up; 規模 describes its scale.',[
 ['B1@民間 の @会社 が @建物 を @管理 @する~しています~しています','A private company manages the building.'],
 ['@市 と B1@民間 の @団体 が @協力 @する~しました~しました','The city and a non-governmental organization worked together.'],
 ['B1@民間 の @サービス について @調べる~調べました~しらべました','I researched services offered by the private sector.'],
 ['@子供 の @ため の B1@施設 が @できる~できました~できました','A facility for children has opened.'],
 ['@この B1@施設 は @駅 の @近く に @ある~あります~あります','This facility is near the station.'],
 ['B1@施設 の @入り口 で @名前 を @書く~書きました~かきました','I wrote my name at the facility’s entrance.'],
 ['@入り口 に @新しい @カメラ を B1@設置 @する~しました~しました','We installed a new camera at the entrance.'],
 ['@公園 に @椅子 を B1@設置 @する~しました~しました','We installed chairs in the park.'],
 ['@機械 の B1@設置 の @日 を @確認 @する~しました~しました','I checked the machine’s installation date.'],
 ['@新しい B1@施設 の B1@規模 は @大きい です','The new facility is large in scale.'],
 ['@二つ の @町 の B1@規模 を @比べる~比べました~くらべました','I compared the sizes of the two towns.'],
 ['B1@規模 が @小さい @団体 が @参加 @する~しました~しました','A small organization took part.'],
]);
lesson('founding-associations','Founding and joining associations',['B1@設立','B1@協会','B1@所属'],
 '協会を設立します / 団体に所属します','設立する means founding an organization. 協会 is an association with a shared purpose or field. 所属する identifies the organization someone belongs to.',[
 ['@町 に @新しい B1@協会 を B1@設立 @する~しました~しました','We founded a new association in the town.'],
 ['@会社 の B1@設立 は @去年 です','The company was founded last year.'],
 ['B1@設立 の @目的 を @説明 @する~しました~しました','We explained the purpose of founding the organization.'],
 ['B1@協会 の @代表 に @会う~会いました~あいました','I met the association’s representative.'],
 ['@この B1@協会 は @町 の @歴史 を @研究 @する~しています~しています','This association researches the town’s history.'],
 ['B1@協会 の @会議 に @出る~出ました~でました','I attended the association’s meeting.'],
 ['@私 は @この B1@協会 に B1@所属 @する~しています~しています','I belong to this association.'],
 ['B1@所属 @する~している~している @団体 の @名前 を @書く~書きました~かきました','I wrote the name of the organization I belong to.'],
 ['@友達 と @同じ @組織 に B1@所属 @する~しています~しています','I belong to the same organization as my friend.'],
]);
lesson('divisions-and-unions','Divisions, alliances and federations',['B1@部門','B1@連合','B1@連邦'],
 '部門 / 連合 / 連邦','部門 is a division within a larger organization. 連合 joins groups in an alliance or union. 連邦 is a federation made up of states or similar political units.',[
 ['@この @組織 に は @三つ の B1@部門 が @ある~あります~あります','This organization has three divisions.'],
 ['@私 は @研究 の B1@部門 に B1@所属 @する~しています~しています','I belong to the research division.'],
 ['B1@部門 の @代表 が @会議 に @集まる~集まりました~あつまりました','Representatives of the divisions gathered for a meeting.'],
 ['@二つ の @団体 が B1@連合 を @作る~作りました~つくりました','Two organizations formed an alliance.'],
 ['B1@連合 の @代表 が @計画 を @説明 @する~しました~しました','The alliance’s representative explained the plan.'],
 ['@この B1@連合 に は @小さい @団体 も @参加 @する~しています~しています','Small organizations also participate in this alliance.'],
 ['B1@連邦 の @歴史 について @本 で @読む~読みました~よみました','I read about the federation’s history in a book.'],
 ['B1@連邦 の @政府 と @州 の @政府 の @役割 を @比べる~比べました~くらべました','I compared the roles of the federal and state governments.'],
 ['@地図 で B1@連邦 の @州 の @位置 を @確認 @する~しました~しました','I checked the locations of the federation’s states on a map.'],
]);
lesson('community-facility-account','A new community facility',[],
 '施設 / 協会 / 設置','Follow the organizations involved in opening the facility.',[
 ['@市 は @子供 の @ため の B1@施設 を @作る~作りました~つくりました','The city built a facility for children.'],
 ['B1@民間 の B1@協会 も @計画 に @参加 @する~しました~しました','A non-governmental association also took part in the project.'],
 ['B1@協会 の @研究 B1@部門 が @活動 を @考える~考えました~かんがえました','The association’s research division planned the activities.'],
 ['@入り口 の @近く に @椅子 を B1@設置 @する~しました~しました','We installed chairs near the entrance.'],
 ['@市民 に B1@施設 を @使う @方法 を @説明 @する~しました~しました','We explained to residents how to use the facility.'],
]);
useTopic('discussion');
lesson('official-statements','Statements and corrections',['B1@公式','B1@発言','B1@指摘'],
 '公式のN / 発言します / 指摘します','公式 here means official. 発言 is speaking or making a statement, often at a meeting. 指摘する means pointing something out, such as an error or issue.',[
 ['B1@協会 の B1@公式 の @発表 を @読む~読みました~よみました','I read the association’s official announcement.'],
 ['B1@公式 の @結果 は @明日 @出る~出ます~でます','The official results will be released tomorrow.'],
 ['@これ は B1@公式 の @記録 です','This is the official record.'],
 ['@会議 で @短い B1@発言 を @する~しました~しました','I made a brief statement at the meeting.'],
 ['@彼女 の B1@発言 を @ノート に @書く~書きました~かきました','I wrote down her statement in my notebook.'],
 ['B1@発言 @する @前 に @手 を @上げる~上げました~あげました','I raised my hand before speaking.'],
 ['B1@資料 の @間違い を B1@指摘 @する~しました~しました','I pointed out an error in the document.'],
 ['@市民 が @計画 の @問題 を B1@指摘 @する~しました~しました','Residents pointed out a problem with the plan.'],
 ['B1@指摘 @する~された~された @部分 を @直す~直しました~なおしました','I corrected the section that had been pointed out.'],
]);
lesson('agreement-and-negotiation','Support, conflict and negotiation',['B1@支持','B1@対立','B1@交渉','B1@合同'],
 '支持します / 対立します / 交渉します / 合同のN','支持する means backing an idea or person. 対立 is opposition or conflict. 交渉 seeks agreement between parties; 合同 describes a joint activity.',[
 ['@私 は @この @計画 を B1@支持 @する~します~します','I support this plan.'],
 ['@多い~多く~おおく の @市民 が @新しい B1@政策 を B1@支持 @する~しています~しています','Many residents support the new policy.'],
 ['B1@支持 の @理由 を @説明 @する~しました~しました','I explained the reason for my support.'],
 ['@二つ の @団体 の @意見 が B1@対立 @する~しています~しています','The two organizations have opposing views.'],
 ['B1@対立 の @原因 を @調べる~調べました~しらべました','I examined the cause of the conflict.'],
 ['@長い B1@対立 の @後 で B1@話し合い が @始まる~始まりました~はじまりました','Talks began after a long conflict.'],
 ['@会社 と @条件 について B1@交渉 @する~しました~しました','I negotiated the terms with the company.'],
 ['B1@交渉 は @来週 @始まる~始まります~はじまります','Negotiations will begin next week.'],
 ['B1@交渉 の @結果 を @全員 に @伝える~伝えました~つたえました','I told everyone the outcome of the negotiations.'],
 ['@二つ の @学校 が B1@合同 で @活動 @する~しました~しました','The two schools held a joint activity.'],
 ['B1@合同 の @会議 に @参加 @する~しました~しました','I attended the joint meeting.'],
 ['@市 と B1@協会 の B1@合同 の @計画 を @読む~読みました~よみました','I read the city and association’s joint plan.'],
]);
lesson('joint-meeting-account','A joint meeting',[],
 '合同 / 発言 / 交渉','Follow the discussion as the groups work toward an agreement.',[
 ['@市 と B1@協会 が B1@合同 で @会議 を @する~しました~しました','The city and the association held a joint meeting.'],
 ['@市 の @代表 が @最初 に B1@発言 @する~しました~しました','The city’s representative spoke first.'],
 ['B1@協会 は @計画 を B1@支持 @する~しました~しました が @問題 も B1@指摘 @する~しました~しました','The association supported the plan but also pointed out a problem.'],
 ['@条件 について B1@交渉 @する~して~して @意見 が B1@一致 @する~しました~しました','We negotiated the terms and reached agreement.'],
 ['B1@公式 の @記録 を @全員 に @送る~送りました~おくりました','We sent the official record to everyone.'],
]);
useTopic('rules');
lesson('authority-and-provisions','Authority and rules',['B1@権限','B1@規定'],
 '権限があります / 規定','権限 is the authority to make a decision or take an action. 規定 is a rule or provision, often written down.',[
 ['@私 に は @計画 を @変更 @する B1@権限 が @ある~ありません~ありません','I do not have the authority to change the plan.'],
 ['@担当 の @人 の B1@権限 を @確認 @する~しました~しました','I checked the authority of the person in charge.'],
 ['B1@権限 と @責任 を @明らか に @する~しました~しました','We clarified the authority and responsibilities.'],
 ['B1@施設 の @利用 について の B1@規定 を @読む~読みました~よみました','I read the rules about using the facility.'],
 ['B1@規定 に @ある @時間 を @守る~守って~まもって ください','Please observe the hours stated in the rules.'],
 ['@この B1@規定 の @意味 を @質問 @する~しました~しました','I asked what this rule meant.'],
]);
lesson('abolition-and-closure','Ending a system and closing a place',['B1@廃止','B1@閉鎖'],
 '廃止します / 閉鎖します','廃止する ends a system or rule. 閉鎖する closes a place or operation. A building can be closed while the organization continues elsewhere.',[
 ['@古い @制度 を B1@廃止 @する~しました~しました','We abolished the old system.'],
 ['B1@廃止 の @理由 を @市民 に @説明 @する~しました~しました','We explained to residents why it was being discontinued.'],
 ['@この @規則 は @来年 B1@廃止 @する~されます~されます','This rule will be abolished next year.'],
 ['@古い B1@施設 を B1@閉鎖 @する~しました~しました','We closed the old facility.'],
 ['@入り口 に B1@閉鎖 の @理由 を @書く~書いた~かいた @紙 を @置く~置きました~おきました','We put a notice explaining the closure at the entrance.'],
 ['@公園 の @北 の @入り口 が B1@閉鎖 @する~されています~されています','The north entrance to the park is closed.'],
]);
lesson('amendment-and-reform','Amendments and reforms',['B1@改正','B1@改革'],
 '規則を改正します / 改革','改正 is amending a rule or law. 改革 is a broader reform of how an institution or system works.',[
 ['B1@協会 の @規則 を B1@改正 @する~しました~しました','We amended the association’s rules.'],
 ['B1@改正 の @前 と @後 の @違い を @説明 @する~しました~しました','I explained the differences before and after the amendment.'],
 ['B1@改正 @する~された~された @部分 を @読む~読みました~よみました','I read the sections that had been amended.'],
 ['@市 の B1@行政 B1@改革 の @計画 を @読む~読みました~よみました','I read the city’s plan for administrative reform.'],
 ['B1@改革 の @目的 は @市民 の @生活 を @いい~よく~よく @する こと です','The aim of the reform is to improve residents’ lives.'],
 ['B1@改革 について @市民 の @意見 を @聞く~聞きました~ききました','We asked residents for their views on the reform.'],
]);
lesson('revised-rules-account','Explaining revised rules',[],
 '権限 / 改正 / 規定','Follow the explanation given after the rules change.',[
 ['B1@協会 は @規則 を B1@改正 @する~しました~しました','The association amended its rules.'],
 ['@担当 の @人 の B1@権限 を @明らか に @する~しました~しました','We clarified the authority of the person in charge.'],
 ['@古い B1@規定 を @一つ B1@廃止 @する~しました~しました','We abolished one old provision.'],
 ['@新しい B1@規定 の @意味 を @全員 に @説明 @する~しました~しました','We explained the meaning of the new provisions to everyone.'],
 ['B1@公式 の @記録 に @変更 を @書く~書きました~かきました','We recorded the changes in the official record.'],
]);
}
