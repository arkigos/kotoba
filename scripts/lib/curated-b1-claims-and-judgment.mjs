export function authorClaimsAndJudgment({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@矛盾':'contradiction; inconsistency','B1@肯定':'affirmation; accepting as true',
 'B1@断定':'stating something categorically; definite judgment',
 'B1@確信':'conviction; firm belief','B1@真実':'truth; what really happened',
 'B1@認識':'recognition; awareness; understanding of a situation',
 'B1@意図':'intention; intended purpose','B1@狙い':'aim; intended result',
 'B1@関与':'involvement; participation','B1@説得':'persuasion',
 'B1@呼びかける':'to call out to; to appeal to','B1@訴え':'complaint; lawsuit',
 'B1@利害':'interests; advantages and disadvantages for those involved',
 'B1@妥当':'reasonable; appropriate; well-founded','B1@的確':'accurate; to the point',
 'B1@総合':'combining information into an overall view',
 'B1@多様':'diverse; varied','B1@独自':'one’s own; distinctive; independently developed',
 'B1@権力':'power; authority, especially political','B1@正義':'justice; what is right',
 'B1@名誉':'honour; distinction; good reputation',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('rules');
lesson('contradiction-affirmation-and-definite-claims','Contradictions, affirmation and definite claims',['B1@矛盾','B1@肯定','B1@断定'],
 '矛盾します / 肯定します / 断定します',
 '矛盾 (mujun) means that statements do not fit together. 肯定 (kōtei) accepts something as true. 断定 (dantei) states a conclusion firmly, without leaving it uncertain.',[
 ['@二つ の @説明 が B1@矛盾 @する~しています~しています','The two explanations contradict each other.'],
 ['@この @話 は @事実 と B1@矛盾 @する~しています~しています','This account contradicts the facts.'],
 ['@報告 の @中 に B1@矛盾 が @ある~ありました~ありました','There was a contradiction in the report.'],
 ['@彼 は @その @事実 を B1@肯定 @する~しました~しました','He affirmed that fact.'],
 ['@相手 の @意見 を B1@肯定 @する~しました~しました','I accepted the other person’s view.'],
 ['@この @説明 を B1@肯定 @する @人 も @いる~います~います','Some people accept this explanation.'],
 ['B1@証拠 が @ある~ない~ない ので B1@断定 は @できる~できません~できません','We cannot make a definite judgment because there is no evidence.'],
 ['@それ は @間違い だ と B1@断定 @する~しました~しました','I stated definitively that it was a mistake.'],
 ['B1@断定 @する @前 に @情報 を @確認 @する~しました~しました','We checked the information before making a definite judgment.'],
]);
lesson('conviction-truth-and-awareness','Conviction, truth and awareness',['B1@確信','B1@真実','B1@認識'],
 '確信 / 真実 / 認識',
 '確信 (kakushin) is a firm belief. 真実 (shinjitsu) concerns what is true, not how certain someone feels. 認識 (ninshiki) is awareness or an understanding of a situation.',[
 ['@成功 @する と B1@確信 @する~しています~しています','I am convinced that we will succeed.'],
 ['@まだ B1@確信 が @ある~ない~ない ので @もう一度 @調べる~調べます~しらべます','I am not certain yet, so I will check again.'],
 ['@話 を @聞く~聞いて~きいて B1@確信 を @持つ~持ちました~もちました','After hearing the account, I became convinced.'],
 ['@私 は B1@真実 を @知る~知りたい~しりたい です','I want to know the truth.'],
 ['B1@真実 を @伝える~伝える~つたえる こと が @大切 です','It is important to tell the truth.'],
 ['@後 で B1@真実 が @わかる~分かりました~わかりました','We learned the truth later.'],
 ['@問題 を B1@認識 @する~しています~しています','We are aware of the problem.'],
 ['@私たち の B1@認識 は @同じ ではありません','We do not understand the situation in the same way.'],
 ['@話 を @聞く~聞いて~きいて B1@認識 が @変わる~変わりました~かわりました','Hearing the account changed my understanding.'],
]);
lesson('intentions-aims-and-involvement','Intentions, aims and involvement',['B1@意図','B1@狙い','B1@関与'],
 '意図 / 狙い / 関与します',
 '意図 (ito) is what someone intends. 狙い (nerai) focuses on the intended result. 関与 (kan’yo) describes involvement in a matter, without itself saying whether that involvement is good or bad.',[
 ['@相手 の B1@意図 を @確認 @する~しました~しました','I checked what the other person intended.'],
 ['@この @質問 の B1@意図 が @わかる~分かりません~わかりません','I do not understand the intention behind this question.'],
 ['B1@意図 を @説明 @する~した~した @後 で B1@誤解 が @なくなる~なくなりました~なくなりました','The misunderstanding disappeared after I explained my intention.'],
 ['@計画 の B1@狙い を @説明 @する~しました~しました','I explained the aim of the plan.'],
 ['@この @活動 の B1@狙い は @町 を @安全 に @する こと です','The aim of this activity is to make the town safe.'],
 ['B1@狙い と @結果 が @違う~違いました~ちがいました','The intended result and the actual result were different.'],
 ['@私 は @この @計画 に B1@関与 @する~していません~していません','I am not involved in this plan.'],
 ['@二つ の @会社 が @町 の @計画 に B1@関与 @する~しています~しています','Two companies are involved in the town’s plan.'],
 ['@どの @組織 が B1@関与 @する~した~した か @調べる~調べました~しらべました','We investigated which organization was involved.'],
]);
lesson('persuading-calling-and-appealing','Persuasion, calls and complaints',['B1@説得','B1@呼びかける','B1@訴え'],
 '説得します / 呼びかけます / 訴え',
 '説得 (settoku) tries to change someone’s mind through reasons. 呼びかける (yobikakeru) can call to a person or appeal to a group. 訴え (uttae) here is a complaint asking others to respond.',[
 ['@理由 を @説明 @する~して~して @相手 を B1@説得 @する~しました~しました','I explained my reasons and persuaded the other person.'],
 ['@父 を B1@説得 @する の は @難しい です','It is difficult to persuade my father.'],
 ['@時間 を @かける~かけて~かけて B1@説得 @する~しました~しました','I spent time persuading them.'],
 ['@遠く の @友達 に B1@呼びかける~呼びかけました~よびかけました','I called out to my friend in the distance.'],
 ['@町 の @人 に @協力 を B1@呼びかける~呼びかけました~よびかけました','We called on the townspeople to cooperate.'],
 ['@学校 は @参加 を B1@呼びかける~呼びかけています~よびかけています','The school is calling for people to participate.'],
 ['@町 に @住む @人 の B1@訴え を @聞く~聞きました~ききました','We listened to the residents’ complaints.'],
 ['@その B1@訴え を @新聞 で @読む~読みました~よみました','I read that complaint in the newspaper.'],
 ['B1@訴え の @内容 を @確認 @する~しました~しました','We checked the contents of the complaint.'],
]);
lesson('interests-reasonableness-and-accuracy','Interests, reasonable judgments and accuracy',['B1@利害','B1@妥当','B1@的確'],
 '利害 / 妥当 / 的確',
 '利害 (rigai) concerns what people stand to gain or lose. 妥当 (datō) is reasonable or appropriate to the situation. 的確 (tekikaku) accurately identifies what matters.',[
 ['@二つ の @会社 の B1@利害 は @同じ ではありません','The two companies do not have the same interests.'],
 ['@それぞれ の B1@利害 を @考える~考えました~かんがえました','We considered each party’s interests.'],
 ['B1@利害 が @違う~違っても~ちがっても @話 は @できる~できます~できます','We can talk even when our interests differ.'],
 ['@この @判断 は B1@妥当 だ と @思う~思います~おもいます','I think this judgment is reasonable.'],
 ['B1@妥当 な @方法 を @選ぶ~選びました~えらびました','We chose an appropriate method.'],
 ['@その @説明 は B1@妥当 ではありません','That explanation is not reasonable.'],
 ['@先生 が B1@的確 な @質問 を @する~しました~しました','The teacher asked a question that went straight to the point.'],
 ['@問題 を B1@的確 に @説明 @する~しました~しました','I explained the problem accurately.'],
 ['B1@的確 な @判断 が @必要 です','An accurate judgment is needed.'],
]);
lesson('combining-diverse-and-independent-views','Combining diverse and independent views',['B1@総合','B1@多様','B1@独自'],
 '総合します / 多様 / 独自',
 '総合 (sōgō) brings several things together to consider the whole. 多様 (tayō) includes varied kinds or views. 独自 (dokuji) belongs to someone’s own approach or is developed independently.',[
 ['@情報 を B1@総合 @する~して~して @判断 @する~しました~しました','We combined the information and made a judgment.'],
 ['@二つ の @報告 を B1@総合 @する~しました~しました','We combined the two reports.'],
 ['@結果 を B1@総合 @する~して~して B1@結論 を @出す~出しました~だしました','We considered the results together and reached a conclusion.'],
 ['B1@多様 な @意見 が @出る~出ました~でました','A variety of views were expressed.'],
 ['@この @地域 に は B1@多様 な @文化 が @ある~あります~あります','There are diverse cultures in this region.'],
 ['B1@多様 な @立場 の @人 が @参加 @する~しました~しました','People with different perspectives took part.'],
 ['@その @会社 は B1@独自 の @方法 を @使う~使っています~つかっています','That company uses its own method.'],
 ['B1@独自 の @考え を @説明 @する~しました~しました','I explained my own distinctive idea.'],
 ['@私たち は B1@独自 に @調べる~調べました~しらべました','We investigated independently.'],
]);
lesson('power-justice-and-honour','Power, justice and honour',['B1@権力','B1@正義','B1@名誉'],
 '権力 / 正義 / 名誉',
 '権力 (kenryoku) is the power to direct or control others, especially in politics. 正義 (seigi) concerns justice or what is right. 名誉 (meiyo) is honour, distinction or a good reputation.',[
 ['B1@権力 を @持つ @人 の @判断 について @話す~話しました~はなしました','We discussed the judgments of people in power.'],
 ['@この @組織 に は @大きな B1@権力 が @ある~あります~あります','This organization has considerable power.'],
 ['B1@権力 が @どう @使う~使われている~つかわれている か @調べる~調べました~しらべました','We examined how power was being used.'],
 ['@授業 で B1@正義 について @考える~考えました~かんがえました','We thought about justice in class.'],
 ['@彼 は B1@正義 の ために @働く~働いている~はたらいている と @言う~言いました~いいました','He said that he was working for justice.'],
 ['B1@正義 の @意味 を @自分 の @言葉 で @説明 @する~しました~しました','I explained the meaning of justice in my own words.'],
 ['@この @場 で @話す こと は @私 の B1@名誉 です','It is an honour for me to speak here.'],
 ['@学校 の B1@名誉 を @守る~守りたい~まもりたい です','I want to protect the school’s good name.'],
 ['@その @仕事 を @する こと は B1@名誉 だ と @思う~思います~おもいます','I think doing that job is an honour.'],
]);
lesson('checking-an-account','Checking an account',[],
 '矛盾 / 断定 / 認識 / 総合 / 真実',
 'Follow the checking of two different accounts.',[
 ['@二つ の @報告 に B1@矛盾 が @ある~ありました~ありました','There was a contradiction between the two reports.'],
 ['@私たち は @すぐ に B1@断定 は @する~しませんでした~しませんでした','We did not make a definite judgment straight away.'],
 ['B1@資料 を @読む~読んで~よんで @それぞれ の B1@認識 を @確認 @する~しました~しました','We read the material and checked how each side understood the situation.'],
 ['B1@的確 な @質問 を @する~して~して @新しい @情報 を @集める~集めました~あつめました','We asked precise questions and gathered new information.'],
 ['@情報 を B1@総合 @する~した~した @後 で B1@結論 を @出す~出しました~だしました','After considering the information together, we reached a conclusion.'],
 ['B1@真実 を @伝える ために @説明 を @書く~書きました~かきました','We wrote an explanation to communicate the truth.'],
]);
lesson('a-community-proposal-account','Discussing a community proposal',[],
 '訴え / 多様 / 意図 / 利害 / 狙い / 呼びかける',
 'Follow a discussion from hearing complaints to asking for cooperation.',[
 ['@町 に @住む @人 の B1@訴え を @聞く~聞いて~きいて @会議 を A2@開く~開きました~ひらきました','We heard residents’ complaints and held a meeting.'],
 ['@会議 に は B1@多様 な @立場 の @人 が @来る~来ました~きました','People with different perspectives came to the meeting.'],
 ['@最初 に @計画 の B1@意図 を @説明 @する~しました~しました','First, we explained the intention behind the plan.'],
 ['@それぞれ の B1@利害 を @考える~考えて~かんがえて @方法 を @選ぶ~選びました~えらびました','We considered each party’s interests and chose a method.'],
 ['@町 を @安全 に @する B1@狙い は @変わる~変わりませんでした~かわりませんでした','The aim of making the town safe did not change.'],
 ['@最後 に @町 の @人 に @協力 を B1@呼びかける~呼びかけました~よびかけました','Finally, we called on the townspeople to cooperate.'],
]);
}
