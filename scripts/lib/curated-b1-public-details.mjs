export function authorPublicDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 49:'state; appearance; what is happening',839:'to state; to express in words',1311:'exchange; interaction',
 47:'arrest',79:'culprit; offender',578:'robber; robbery',513:'criminal sentence; punishment',274:'restraint; detention',176:'wrongdoing; dishonesty; irregularity',
 149:'vote; ballot',207:'legislative assembly; parliament',285:'prefectural governor',364:'chairperson; speaker of an assembly',567:'opposition party',373:'bureaucrat; government official',
 593:'ambassador',190:'diplomacy',743:'friendly relations; friendship',564:'formal statement; declaration',590:'the mass media',521:'demonstration; protest',684:'controversy; dispute',
 350:'donation; contribution',311:'aid; assistance',661:'compensation',698:'to appeal; to bring a concern to someone’s attention',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('news');
lesson('observing-a-situation','Describing what is happening',[49], '様子を見ます / 様子を伝えます', '様子 can mean what a situation looks like or how someone seems. It often points to what you can observe, rather than a conclusion about the cause.', [
 ['@町 の 49 を @写真 に @撮る~撮りました~とりました','I photographed what the town looked like.'],
 ['@記者 が @現場 の 49 を @伝える~伝えました~つたえました','The reporter described what was happening at the scene.'],
 ['@いつも と 49 が @違う~違います~ちがいます','Things look different from usual.'],
 ['@窓 から @外 の 49 を @見る~見ました~みました','I looked out of the window to see what was happening outside.'],
]);
lesson('crime-reports','Understanding a crime report',[578,79,47], '強盗 / 犯人 / 逮捕します', '強盗 can mean a robbery or the robber. 犯人 means the person who committed the offense, rather than someone merely suspected of it. 逮捕 is an arrest.', [
 ['@近く の @店 に 578 が @入る~入りました~はいりました','A robber entered a nearby shop.'],
 ['578 の @事件 について @新聞 で @読む~読みました~よみました','I read about the robbery in the newspaper.'],
 ['@警察 は 578 の @被害 を @調べる~調べています~しらべています','The police are investigating the damage caused by the robbery.'],
 ['79 は @店 から @逃げる~逃げました~にげました','The culprit fled from the shop.'],
 ['@警察 が 79 を @探す~探しています~さがしています','The police are looking for the culprit.'],
 ['79 の @顔 を @見る~見た~みた @人 が @警察 に @話す~話しました~はなしました','Someone who saw the culprit’s face spoke to the police.'],
 ['@警察 は 79 を 47 @する~しました~しました','The police arrested the culprit.'],
 ['@新聞 によると 578 が 47 @する~された~された そうです','According to the newspaper, a robber has been arrested.'],
 ['47 の @理由 を @警察 に @聞く~聞きました~ききました','I asked the police the reason for the arrest.'],
]);
lesson('restraint-and-wrongdoing','Detention, punishment and wrongdoing',[274,513,176], '拘束します / 刑を受けます / 不正を調べます', '拘束 is restraint or detention. 刑 is a criminal sentence or punishment. 不正 refers to wrongdoing, dishonesty or an irregularity; the context identifies what happened.', [
 ['@警察 は @男 を 274 @する~しました~しました','The police detained the man.'],
 ['274 の @理由 は @まだ @わかる~わかりません~わかりません','The reason for the detention is not yet known.'],
 ['@長い 274 の @後 で @家族 に @会う~会いました~あいました','After a long detention, the person met their family.'],
 ['79 は @重い 513 を @受ける~受けました~うけました','The offender received a heavy sentence.'],
 ['@その 513 は @重い と @思う~思います~おもいます','I think that sentence is severe.'],
 ['@記事 に は 513 の @内容 が @書く~書かれていました~かかれていました','The article described the details of the sentence.'],
 ['@選挙 の 176 を @調べる~調べています~しらべています','They are investigating irregularities in the election.'],
 ['@会社 の 176 が @問題 に @なる~なりました~なりました','Wrongdoing at the company became an issue.'],
 ['@計算 に 176 が @ある~ない~ない か @確認 @する~しました~しました','We checked whether there was any dishonesty in the calculations.'],
]);
lesson('assemblies-and-votes','Assemblies, chairs and votes',[207,364,149], '議会 / 議長 / 票を集めます', '議会 is a legislative assembly or parliament. 議長 is the person who chairs an assembly or meeting. 票 means a vote or ballot.', [
 ['207 で @新しい @法律 について @話す~話しています~はなしています','They are discussing a new law in the assembly.'],
 ['207 の @議員 に @手紙 を @書く~書きました~かきました','I wrote a letter to a member of the assembly.'],
 ['207 の 49 を @テレビ で @見る~見ました~みました','I watched the proceedings of the assembly on television.'],
 ['364 が @会議 を @始める~始めました~はじめました','The chairperson opened the meeting.'],
 ['@質問 の @前 に 364 に @名前 を @伝える~伝えました~つたえました','I told the chairperson my name before asking a question.'],
 ['@新しい 364 を @選ぶ~選びました~えらびました','We elected a new chairperson.'],
 ['@その @候補 は @多い~多く~おおく の 149 を @集める~集めました~あつめました','That candidate won many votes.'],
 ['149 の 1262 を @確認 @する~しました~しました','We checked the number of votes.'],
 ['@選挙 で @誰 に 149 を @入れる~入れました~いれました か','Who did you vote for in the election?'],
]);
lesson('officials-and-opposition','Officials and their views',[285,373,567,839], '知事 / 官僚 / 野党 / 意見を述べます', '知事 is a prefectural governor in Japan. 官僚 refers to a government official or the bureaucracy, rather than an elected representative. 野党 is a party outside the governing administration. 述べる means expressing something in words, often an opinion or a reason.', [
 ['285 が @県 の @計画 を @説明 @する~しました~しました','The governor explained the prefecture’s plan.'],
 ['@新しい 285 の @名前 を @新聞 で @知る~知りました~しりました','I learned the new governor’s name from the newspaper.'],
 ['285 に @学校 の @問題 について @手紙 を @書く~書きました~かきました','I wrote to the governor about a problem at the school.'],
 ['373 が @新しい @制度 を @説明 @する~しています~しています','A government official is explaining the new system.'],
 ['@政府 の 373 に @質問 @する~しました~しました','I asked a government official a question.'],
 ['373 の @仕事 について @記事 を @読む~読みました~よみました','I read an article about the work of government officials.'],
 ['567 は @政府 の @計画 に @反対 @する~しています~しています','The opposition party opposes the government’s plan.'],
 ['567 の @代表 が @意見 を 839~述べました~のべました','The opposition representative stated their opinion.'],
 ['567 の @議員 に @話 を @聞く~聞きました~ききました','I spoke with an opposition member of the assembly.'],
 ['@政府 の @代表 は @計画 の @目的 を 839~述べました~のべました','The government representative stated the purpose of the plan.'],
 ['@反対 の @理由 を @簡単 に 839~述べて~のべて ください','Please briefly state your reason for opposing it.'],
]);
lesson('diplomacy-and-friendship','Diplomacy and friendly relations',[190,593,743,1311], '外交 / 大使 / 友好関係 / 交流', '外交 concerns relations between countries. 大使 is an ambassador. 友好 describes friendly relations, often between countries or other groups. 交流 is interaction or exchange between people or groups.', [
 ['190 の @歴史 を @大学 で @勉強 @する~しました~しました','I studied the history of diplomacy at university.'],
 ['@政府 は 190 について @会議 を A2:1272~開きました~ひらきました','The government held a meeting about diplomacy.'],
 ['@二つ の @国 の 190 について @記事 を @読む~読みました~よみました','I read an article about diplomacy between the two countries.'],
 ['593 が @学校 に @来る~来ました~きました','The ambassador came to the school.'],
 ['@新しい 593 は @日本語 が @話す~話せます~はなせます','The new ambassador can speak Japanese.'],
 ['593 の @話 を @聞く~聞いて~きいて から @質問 @する~しました~しました','I asked a question after listening to the ambassador.'],
 ['@二つ の @国 は @長い @間 743 @関係 に @ある~あります~あります','The two countries have had friendly relations for a long time.'],
 ['743 の @ため に @音楽 の 1311 を @続ける~続けています~つづけています','We continue musical exchanges to promote friendly relations.'],
 ['@町 の @人 は 743 について @話す~話しました~はなしました','The townspeople spoke about friendly relations.'],
 ['@外国 の @学生 と 1311 @する~しました~しました','We interacted with students from abroad.'],
 ['@二つ の @町 の 1311 は @今 も @続く~続いています~つづいています','Exchanges between the two towns are still continuing.'],
]);
lesson('statements-and-media','Formal statements and the media',[564,590], '声明を出します / マスコミ', '声明 is a formal public statement. マスコミ refers to the mass media, such as newspapers and broadcasters, especially the organizations reporting the news.', [
 ['@政府 は 564 を @出す~出しました~だしました','The government issued a statement.'],
 ['564 の @内容 を @新聞 で @読む~読みました~よみました','I read the contents of the statement in the newspaper.'],
 ['564 によると @会議 は @来週 A2:1272~開かれる~ひらかれる そうです','According to the statement, the meeting will be held next week.'],
 ['590 が @その @事件 を 2738 @する~しました~しました','The mass media reported the incident.'],
 ['590 の @人 が @入り口 で @待つ~待っていました~まっていました','Members of the media were waiting at the entrance.'],
 ['590 は @問題 を @詳しい~詳しく~くわしく @伝える~伝えました~つたえました','The media reported the issue in detail.'],
 ['564 を @出す @前 に 590 から @質問 が @来る~来ました~きました','Questions came from the media before the statement was issued.'],
]);
lesson('protests-and-disputes','Protests and public debate',[521,684], 'デモに参加します / 論争が起きます', 'デモ here means a public demonstration or protest. 論争 is a dispute or controversy involving opposing views, rather than an ordinary exchange of information.', [
 ['@町 で 521 が @ある~ありました~ありました','There was a demonstration in town.'],
 ['@多い~多く~おおく の @人 が 521 に @参加 @する~しました~しました','Many people took part in the protest.'],
 ['521 の @ため に @道路 が @使う~使えませんでした~つかえませんでした','The road could not be used because of the demonstration.'],
 ['@新しい @計画 について 684 が @起きる~起きました~おきました','A controversy arose over the new plan.'],
 ['684 の @原因 を @調べる~調べました~しらべました','I investigated the cause of the dispute.'],
 ['@新聞 で 684 の @両方 の @意見 を @読む~読みました~よみました','I read the views of both sides of the dispute in the newspaper.'],
 ['@長い 684 の @後 で @計画 が @変わる~変わりました~かわりました','After a lengthy dispute, the plan changed.'],
]);
lesson('public-report-account','Reporting a local debate',[], 'A statement and different responses', 'Follow a report about a local plan, from its announcement to the response in the assembly and the streets.', [
 ['285 が @県 の @新しい @計画 について 564 を @出す~出しました~だしました','The governor issued a statement about a new plan for the prefecture.'],
 ['590 は 564 の @内容 を 2738 @する~しました~しました','The media reported the contents of the statement.'],
 ['567 の @議員 は @計画 に @反対 @する~しました~しました','Opposition members of the assembly opposed the plan.'],
 ['207 で 364 が @両方 の @意見 を @聞く~聞きました~ききました','In the assembly, the chairperson heard the views of both sides.'],
 ['@町 で は @計画 に @反対 @する 521 が @ある~ありました~ありました','There was a protest against the plan in the town.'],
 ['@新聞 は 684 の @理由 を @詳しい~詳しく~くわしく @説明 @する~しました~しました','The newspaper explained the reasons for the controversy in detail.'],
 ['@違う @記事 を @読む~読んで~よんで @問題 を @考える~考えました~かんがえました','I read different articles and thought about the issue.'],
]);
useTopic('rules');
lesson('aid-and-compensation','Donations, aid and compensation',[350,311,661], '寄付します / 援助を受けます / 補償', '寄付 is a voluntary donation. 援助 is aid or assistance. 補償 is compensation for a loss or harm; it is different from a gift or donation.', [
 ['@学校 に @本 を 350 @する~しました~しました','I donated books to the school.'],
 ['@町 の @人 から 350 を @集める~集めました~あつめました','We collected donations from townspeople.'],
 ['350 の @お金 で @新しい @道具 を @買う~買いました~かいました','We bought new tools with the donated money.'],
 ['@被害 を @受ける~受けた~うけた @町 に 311 が @必要 です','The town that suffered damage needs assistance.'],
 ['@外国 から 311 を @受ける~受けました~うけました','We received aid from abroad.'],
 ['@食べ物 を @送る~送って~おくって 311 @する~しました~しました','We helped by sending food.'],
 ['@事故 の @被害 の 661 は @まだ @決まる~決まっていません~きまっていません','Compensation for the damage from the accident has not yet been decided.'],
 ['661 の @内容 について @会社 と @話す~話しました~はなしました','I discussed the details of the compensation with the company.'],
 ['661 の @条件 を @確認 @する~しました~しました','I checked the conditions for the compensation.'],
]);
lesson('appealing-for-change','Bringing a concern to others',[698], '援助が必要だと訴えます / 人に訴えます', '訴える can mean appealing to someone or bringing a concern to their attention. It can also mean taking a legal case to court; these examples use the broader meaning of making an appeal.', [
 ['@町 の @人 は @道 が @危ない と 698~訴えました~うったえました','The townspeople raised concerns that the road was dangerous.'],
 ['311 が @必要 だ と @政府 に 698~訴えました~うったえました','They appealed to the government, saying that aid was needed.'],
 ['@家族 は 661 が @必要 だ と @会社 に 698~訴えました~うったえました','The family appealed to the company, saying that compensation was needed.'],
 ['@手紙 で @自分 の @考え を 698~訴えました~うったえました','I made my case in a letter.'],
 ['@学校 の @問題 を @親 に 698~訴えました~うったえました','I brought a problem at school to my parents’ attention.'],
]);
lesson('community-aid-account','A town asks for support',[], 'Explaining damage and organizing help', 'Follow a town explaining its needs and receiving practical help after a storm.', [
 ['@台風 で @町 の @学校 が @被害 を @受ける~受けました~うけました','The town’s school was damaged by a typhoon.'],
 ['@町 の @人 は 311 が @必要 だ と 698~訴えました~うったえました','The townspeople appealed for assistance.'],
 ['@新聞 が @被害 の 49 を 2738 @する~しました~しました','The newspaper reported on the damage.'],
 ['@近く の @町 から @本 と @道具 の 350 が @来る~来ました~きました','Donations of books and tools came from a nearby town.'],
 ['@集める~集めた~あつめた @お金 を @何 に @使う か @皆さん に @説明 @する~しました~しました','We explained to everyone what the collected money would be used for.'],
 ['311 を @受ける~受けて~うけて @学校 は @また @授業 を @始める~始めました~はじめました','With the assistance it received, the school resumed classes.'],
 ['@最後 に 350 @する~した~した @人 に @お礼 を @言う~言いました~いいました','Finally, we thanked the people who had donated.'],
]);
}
