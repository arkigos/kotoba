export function authorCivicDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 510:'questionnaire; survey',157:'quotation; citation',873:'to take up a topic; to cover a story',
 708:'to account for; to make up',725:'to increase; to grow stronger',749:'to increase; to grow',774:'to reach',
 1734:'government office; public office',1759:'government official',2191:'government agency; government office',
 2669:'prime minister',2877:'cabinet of a government',2876:'director; chief of a government agency',
 1351:'public; communal',2878:'social welfare; well-being',1440:'self-government; local autonomy',
 1345:'policy; course of action',1912:'more than half; majority',
 632:'the former; the first of two',468:'the latter; the second of two',879:'contrast; comparison',
 362:'advantageous; favorable',566:'disadvantageous; unfavorable',810:'equal; the same in quantity or degree',
 1096:'to discuss; to deal with a topic',2771:'evidence; proof',666:'to doubt; to suspect',705:'assumption; hypothesis',
 595:'presence or absence; whether something exists',909:'to include',819:'to exert; to have an effect on',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('news');
lesson('surveys-and-quotations','Surveys and quotations',[510,157,873], 'アンケート / 引用します / 取り上げます', 'アンケート can be a questionnaire or the survey using it. 引用 is quoting another text or person. 取り上げる here means taking up a topic or covering it in a report.', [
 ['@町 の @交通 について 510 を @する~しました~しました','We conducted a survey about transport in the town.'],
 ['510 に @答える~答えて~こたえて ください','Please answer the questionnaire.'],
 ['510 の @結果 を @図 に @する~しました~しました','We put the survey results in a diagram.'],
 ['@記事 から @短い @文 を 157 @する~しました~しました','I quoted a short sentence from the article.'],
 ['157 @する~した~した @言葉 を @もう一度 @確認 @する~しました~しました','I checked the quoted words again.'],
 ['@本 の @名前 を @書く~書いて~かいて から @文 を 157 @する~しました~しました','I wrote the book’s title and then quoted a sentence.'],
 ['@新聞 は @町 の @問題 を 873~取り上げました~とりあげました','The newspaper covered a problem in the town.'],
 ['@会議 で @この @意見 を 873~取り上げます~とりあげます','We will take up this opinion at the meeting.'],
 ['@番組 が 873~取り上げた~とりあげた @話題 について @話す~話しました~はなしました','We talked about the topic featured in the program.'],
]);
lesson('proportions-and-growing-interest','Proportions and growing interest',[708,725,749,774], '占めます / 高まります / 増します / 達します', '占める describes a share of a whole. 高まる often describes interest, expectations or importance growing stronger. 増す is increasing; 達する marks the point or amount reached.', [
 ['@学生 は 、 @参加 @する~した~した @人 の @半分 を 708~占めています~しめています','Students make up half of the participants.'],
 ['@この @町 で は @森 が @広い @部分 を 708~占めています~しめています','Forests occupy a large part of this town.'],
 ['@反対 の @意見 が @全体 の @半分 を 708~占めました~しめました','Opposing opinions accounted for half of the total.'],
 ['@市民 の @関心 が 279 725~高まっています~たかまっています','Public interest is gradually growing.'],
 ['@新しい @計画 の @発表 で @期待 が 725~高まりました~たかまりました','Expectations grew with the announcement of the new plan.'],
 ['@市民 の @関心 が 725~高まった~たかまった @理由 を @調べる~調べました~しらべました','We investigated why public interest had grown.'],
 ['@交通 の @量 が 749~増しています~ましています','The amount of traffic is increasing.'],
 ['@雨 が @強い ので @交通 の @危険 が 749~増しました~ましました','The danger on the roads increased because the rain was heavy.'],
 ['@風 の @力 が 749~増して~まして @来る~きました~きました','The wind has been growing stronger.'],
 ['@参加 @する @人 の 1262 が @百 @人~人~にん に 774~達しました~たっしました','The number of participants reached one hundred.'],
 ['@会議 の @時間 が @三 @時間 に 774~達しました~たっしました','The meeting’s duration reached three hours.'],
 ['@必要 な 1262 に 774~達する~たっする まで @活動 を @続ける~続けます~つづけます','We will continue our activities until we reach the required number.'],
]);
lesson('reporting-a-local-survey-account','Reporting a local survey',[], 'From answers to a report', 'Follow a report about transport, from collecting answers to discussing the results.', [
 ['@市民 が @交通 について の 510 に @答える~答えました~こたえました','Residents answered a survey about transport.'],
 ['510 に @答える~答えた~こたえた @人 の 1262 が @百 @人~人~にん に 774~達しました~たっしました','The number of people who answered the survey reached one hundred.'],
 ['@学生 は 、 @答える~答えた~こたえた @人 の @半分 を 708~占めていました~しめていました','Students made up half of the people who answered.'],
 ['@記者 は @答え を 157 @する~して~して @記事 を @書く~書きました~かきました','The reporter quoted the answers in an article.'],
 ['@記事 が 873~取り上げた~とりあげた @問題 について @会議 で @話す~話しました~はなしました','We discussed the issue covered by the article at a meeting.'],
]);
lesson('public-offices-and-officials','Public offices and officials',[1734,1759,2191], '役所 / 役人 / 官庁', '役所 is a public office, often a local one in everyday conversation. 役人 is a government official. 官庁 refers to a government office or agency in more formal descriptions.', [
 ['@近く の 1734 で @住所 を @確認 @する~しました~しました','I checked the address at a nearby public office.'],
 ['1734 に @電話 @する~して~して @質問 @する~しました~しました','I called the public office and asked a question.'],
 ['1734 の @前 で @友達 と @会う~会いました~あいました','I met a friend in front of the public office.'],
 ['1759 が @新しい @制度 を @説明 @する~しました~しました','An official explained the new system.'],
 ['@町 の 1759 に @手紙 を @書く~書きました~かきました','I wrote a letter to a town official.'],
 ['1759 の @仕事 について @記事 を @読む~読みました~よみました','I read an article about the work of government officials.'],
 ['2191 が @新しい 1417 を 1405 @する~しました~しました','A government agency published new statistics.'],
 ['@その 2191 の @名前 を @確認 @する~しました~しました','I checked the name of that government agency.'],
 ['2191 の @発表 を @新聞 で @読む~読みました~よみました','I read a government agency’s announcement in the newspaper.'],
]);
lesson('cabinet-and-agency-leadership','A cabinet and its leaders',[2669,2877,2876], '総理大臣 / 内閣 / 長官', '総理大臣 is the prime minister. 内閣 is the cabinet. 長官 is the chief or director of an agency or organization; the agency’s name tells you which office is meant.', [
 ['2669 が 2961 で @質問 に @答える~答えました~こたえました','The prime minister answered questions at a press conference.'],
 ['@新聞 に 2669 の @写真 が @出る~出ていました~でていました','A photograph of the prime minister appeared in the newspaper.'],
 ['2669 の @言葉 について @記事 を @読む~読みました~よみました','I read an article about the prime minister’s words.'],
 ['@新聞 によると 、 2877 が @新しい @計画 を @決める~決めた~きめた そうです','According to the newspaper, the cabinet has decided on a new plan.'],
 ['2877 の @仕事 について @学校 で @勉強 @する~しました~しました','We studied the work of the cabinet at school.'],
 ['2877 の @会議 について @記者 が @伝える~伝えました~つたえました','A reporter described the cabinet meeting.'],
 ['2876 が @計画 の @目的 を 839~述べました~のべました','The agency chief stated the purpose of the plan.'],
 ['@記者 は 2876 に @質問 @する~しました~しました','The reporter asked the agency chief a question.'],
 ['@新しい 2876 の @名前 が 1405 @する~されました~されました','The new agency chief’s name was announced.'],
]);
lesson('public-services-and-local-government','Public services and local government',[1351,2878,1440], '公共 / 福祉 / 自治', '公共 concerns things shared by or serving the public. 福祉 is social welfare or well-being. 自治 means governing a community’s own affairs, rather than having every decision made elsewhere.', [
 ['1351 の @建物 を @大切 に @使う~使いましょう~つかいましょう','Let’s take good care of public buildings.'],
 ['1351 の @交通 について 510 を @する~しました~しました','We conducted a survey about public transport.'],
 ['@この @図書館 は 1351 の @建物 です','This library is a public building.'],
 ['2878 の @仕事 に @関心 が @ある~あります~あります','I am interested in social welfare work.'],
 ['@町 の 2878 について 1734 で @聞く~聞きました~ききました','I asked at the public office about the town’s social welfare services.'],
 ['@子供 の 2878 が @会議 の @話題 に @なる~なりました~なりました','Children’s welfare became a topic at the meeting.'],
 ['@授業 で @地方 の 1440 について @勉強 @する~しました~しました','We studied local self-government in class.'],
 ['1440 の @歴史 について @本 を @読む~読みました~よみました','I read a book about the history of self-government.'],
 ['@住民 は 1440 の @制度 について @質問 @する~しました~しました','Residents asked questions about the system of local self-government.'],
]);
lesson('policy-and-a-majority','Policy and a majority',[1345,1912], '方針 / 過半数', '方針 is a policy or course of action. 過半数 means more than half; exactly half is not a majority.', [
 ['@町 の 1345 が @変わる~変わりました~かわりました','The town’s policy changed.'],
 ['@新しい 1345 を @住民 に @説明 @する~しました~しました','We explained the new policy to residents.'],
 ['@新聞 が @政府 の 1345 を 873~取り上げました~とりあげました','The newspaper covered the government’s policy.'],
 ['@参加 @する~した~した @人 の 1912 が 240 @する~しました~しました','A majority of the participants agreed.'],
 ['1912 の 149 を @集める~集めた~あつめた @候補 が @選ぶ~選ばれました~えらばれました','The candidate who won a majority of the votes was elected.'],
 ['@反対 の @意見 は 1912 に 774~達しませんでした~たっしませんでした','Opposing opinions did not reach a majority.'],
]);
lesson('a-public-service-meeting-account','A meeting about public services',[], 'A proposal and the response', 'Follow a town meeting about its public buildings and welfare services.', [
 ['1734 で 1351 の @建物 について @会議 が @ある~ありました~ありました','There was a meeting about public buildings at the public office.'],
 ['1759 が 2878 の @仕事 に @使う @場所 を 361 @計画 を @説明 @する~しました~しました','An official explained a plan to increase the spaces used for welfare work.'],
 ['@住民 が @新しい 1345 について @質問 @する~しました~しました','Residents asked questions about the new policy.'],
 ['@会議 に @来る~来た~きた @人 の 1912 が 240 @する~しました~しました','A majority of the people who came to the meeting agreed.'],
 ['@町 の @新聞 が @会議 の 49 を @伝える~伝えました~つたえました','The town newspaper reported on the meeting.'],
]);
useTopic('discussion');
lesson('former-latter-and-contrast','The former, the latter and a contrast',[632,468,879], '前者 / 後者 / 対照', '前者 and 後者 refer to the first and second of two things already mentioned. 対照 brings their differences into view. Keep the pair in mind as you read.', [
 ['@電車 と @バス を @比べる~比べました~くらべました 。 632 の ほう が @安い です','We compared the train and the bus. The former is cheaper.'],
 ['@紙 と @画面 で @読む~読みました~よみました 。 632 の ほう が @読む~読みやすい~よみやすい です','I read on paper and on a screen. The former is easier to read.'],
 ['@白い @箱 と @黒い @箱 が @ある~あります~あります 。 632 は @軽い です','There are a white box and a black box. The former is light.'],
 ['@電車 と @バス を @比べる~比べました~くらべました 。 468 の ほう が @便利 です','We compared the train and the bus. The latter is more convenient.'],
 ['@紙 と @画面 で @読む~読みました~よみました 。 468 は @明るい です','I read on paper and on a screen. The latter is bright.'],
 ['@白い @箱 と @黒い @箱 が @ある~あります~あります 。 468 は @重い です','There are a white box and a black box. The latter is heavy.'],
 ['@二つ の @町 の 879 が @写真 から @わかる~わかります~わかります','The contrast between the two towns is apparent from the photographs.'],
 ['@静か な @朝 と @賑やか な @夜 の 879 が @面白い です','The contrast between the quiet morning and the lively evening is interesting.'],
 ['@二つ の 1345 を 879 @する~して~して @違い を @説明 @する~しました~しました','We compared the two policies and explained their differences.'],
]);
lesson('advantages-and-equal-conditions','Advantages and equal conditions',[362,566,810], '有利 / 不利 / 等しい', '有利 and 不利 describe an advantage or disadvantage in a particular situation. 等しい means equal in amount, degree or another stated measure; it does not mean two things look alike.', [
 ['@駅 に @近い @店 は 362 です','A shop near the station has an advantage.'],
 ['@この @条件 は @学生 に 362 です','These conditions are favorable to students.'],
 ['@私たち に 362 な @方法 を @考える~考えました~かんがえました','We considered a method that would give us an advantage.'],
 ['@雨 は @外 で @働く @人 に 566 です','Rain puts people working outside at a disadvantage.'],
 ['@その @規則 は @小さい @会社 に 566 です','That rule is unfavorable to small companies.'],
 ['566 な @条件 について 968~話し合いました~はなしあいました','We discussed the unfavorable conditions.'],
 ['@二つ の @商品 の @値段 は 810 です','The two products are equal in price.'],
 ['@二つ の @グループ の @人 の 1262 は 810 です','The two groups have equal numbers of people.'],
 ['@全員 に 810 @機会 が @ある~あります~あります','Everyone has an equal opportunity.'],
]);
lesson('evidence-and-assumptions','Evidence and assumptions',[2771,666,705,1096], '証拠 / 疑います / 仮定 / 論じます', '証拠 supports a claim. 疑う means doubting or suspecting; it does not itself establish that a claim is false. 仮定 is an assumption. 論じる is discussing a subject or developing an argument about it.', [
 ['@その @説明 の 2771 を @見せる~見せて~みせて ください','Please show the evidence for that explanation.'],
 ['@新しい 2771 が @見つかる~見つかりました~みつかりました','New evidence was found.'],
 ['@記事 に @書く~書かれた~かかれた 2771 を @確認 @する~しました~しました','We checked the evidence described in the article.'],
 ['@私 は @その @説明 を 666~疑っています~うたがっています','I doubt that explanation.'],
 ['@情報 が @正しい か 666~疑いました~うたがいました','I doubted whether the information was correct.'],
 ['@相手 を 666~疑う~うたがう @前 に @話 を @聞く~聞きました~ききました','I listened to the other person before becoming suspicious of them.'],
 ['@この @計画 は @一つ の 705 から @始まる~始まりました~はじまりました','This plan began with an assumption.'],
 ['@最初 の 705 が @正しい か @調べる~調べました~しらべました','We checked whether the initial assumption was correct.'],
 ['705 を @変える~変えて~かえて @結果 を @比べる~比べました~くらべました','We changed the assumption and compared the results.'],
 ['@会議 で @環境 の @問題 を 1096~論じました~ろんじました','We discussed environmental issues at the meeting.'],
 ['@この @本 は @学校 の @歴史 を 1096~論じています~ろんじています','This book discusses the history of schools.'],
 ['2771 を @確認 @する~して~して から @原因 を 1096~論じます~ろんじます','We will discuss the cause after checking the evidence.'],
]);
lesson('scope-presence-and-effects','Scope, presence and effects',[595,909,819], '有無 / 含めます / 影響を及ぼします', '有無 asks whether something is present or absent. 含める means including something within a group or scope. 及ぼす commonly pairs with 影響 to describe an effect on someone or something.', [
 ['2771 の 595 を @確認 @する~しました~しました','We checked whether there was any evidence.'],
 ['@問題 の 595 を 510 で @調べる~調べました~しらべました','We used a survey to find out whether there were any problems.'],
 ['@記者 は @変更 の 595 について @質問 @する~しました~しました','The reporter asked whether there had been any changes.'],
 ['@子供 も 510 に 909~含めました~ふくめました','We included children in the survey too.'],
 ['@反対 の @意見 を 1559 に 909~含めます~ふくめます','We will include opposing views in the report.'],
 ['@私 を 909~含めて~ふくめて @五 @人~人~にん です','There are five people, including me.'],
 ['@新しい 1345 が @生活 に @影響 を 819~及ぼしました~およぼしました','The new policy affected people’s lives.'],
 ['@強い @雨 が @交通 に @影響 を 819~及ぼしています~およぼしています','Heavy rain is affecting transport.'],
 ['@環境 に @影響 を 819~及ぼす~およぼす @問題 を 1096~論じました~ろんじました','We discussed an issue that affects the environment.'],
]);
lesson('comparing-two-proposals-account','Comparing two proposals',[], 'Who benefits from each proposal?', 'Follow a discussion comparing travel by train and by bus.', [
 ['@電車 で @行く @方法 と @バス で @行く @方法 を @比べる~比べました~くらべました','We compared going by train and going by bus.'],
 ['@電車 と @バス で は 、 632 は @時間 が @短い から @私たち に 362 です','Of the train and the bus, the former is advantageous for us because it takes less time.'],
 ['@電車 と @バス で は 、 468 は @安い です が @荷物 が @多い @人 に は 566 です','Of the train and the bus, the latter is cheaper, but puts people with a lot of luggage at a disadvantage.'],
 ['@荷物 の @料金 も @全体 の @料金 に 909~含めました~ふくめました','We included the baggage charge in the total fare too.'],
 ['@二つ の @方法 が @旅行 に 819~及ぼす~およぼす @影響 を 968~話し合いました~はなしあいました','We discussed how the two options would affect the trip.'],
]);
lesson('checking-a-report-account','Checking a report',[], 'A claim, its evidence and its limits', 'Follow readers checking how a report reaches its conclusion.', [
 ['@記事 は @新しい 1345 を 873~取り上げていました~とりあげていました','The article covered a new policy.'],
 ['@私たち は @記事 の @説明 を 666~疑っていました~うたがっていました','We doubted the article’s explanation.'],
 ['@記者 が 157 @する~した~した 510 と 2771 の 595 を @確認 @する~しました~しました','We checked the survey the reporter had cited and whether there was evidence.'],
 ['705 と @事実 を 298 @する~して~して @原因 を 1096~論じました~ろんじました','We distinguished assumptions from facts and discussed the cause.'],
 ['@まだ @わかる~わからない~わからない @点 も 1559 に 909~含めました~ふくめました','We included the points that were still unclear in our report too.'],
]);
}
