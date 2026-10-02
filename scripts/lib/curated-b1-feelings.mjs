export function authorFeelings({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{38:'dream of; aspire to',55:'opportunity; chance to do something',90:'courage',92:'desperate; trying with all one’s strength',93:'unexpected; surprising',95:'wish; hope',122:'hardship; difficulty and effort',135:'serious; earnest',145:'joke; something said in jest',175:'subtle; a fine distinction',178:'talent; ability',181:'as before; as usual',51:'excitement; being excited',1756:'being deeply moved',565:'enthusiasm; absorption in an activity',425:'being absorbed; being engrossed',1422:'a real feeling; a felt realization',463:'refreshed; clear of an unpleasant feeling',133:'boasting; something one is proud of',410:'pride; a sense of pride',576:'admiration; being impressed',812:'cheerful; lively',2478:'cheerful; bright in disposition'});
topic('feelings','Feelings and reactions','Describe an experience, explain your reaction, and talk about how your feelings changed.');
lesson('impressions','Impressions and strong reactions',[46,51,1756], '印象に残ります / Nに感激します', '印象 is an impression; 印象に残る means to stay in your memory. 興奮 describes excitement or agitation, so it does not always mean happiness. 感激 is a strong emotional response to something touching or generous. に marks what moved you.', [
 ['@旅行 で @会う~会った~あった @人 の @優しい @言葉 が 46 に @残る~残っています~のこっています','I still remember the kind words of the people I met on my trip.'],
 ['@初めて @会う~会った~あった @時 の 46 と @今 の 46 は @違う~違います~ちがいます','My first impression and my impression now are different.'],
 ['@子供 は @試合 の @前 から 51 @する~していました~していました','The children were excited even before the match.'],
 ['@試合 の @後 も 51 が @続く~続きました~つづきました','The excitement continued after the match.'],
 ['@友達 から の @手紙 に 1756 @する~しました~しました','I was deeply moved by my friend’s letter.'],
 ['@皆さん の @優しい @言葉 に 1756 @する~しました~しました','I was deeply moved by everyone’s kind words.'],
]);
lesson('absorbed','Being absorbed and feeling a change',[565,425,1422], 'Nに熱中します / Nに夢中です', '熱中する and 夢中になる describe being absorbed in something. With 夢中, you can also say Nに夢中です. 実感 is a feeling based on actual experience, rather than merely knowing a fact.', [
 ['@弟 は @最近 @料理 に 565 @する~しています~しています','My younger brother has recently become absorbed in cooking.'],
 ['@読書 に 565 @する~して~して @時間 を @忘れる~忘れました~わすれました','I became so absorbed in reading that I lost track of time.'],
 ['@子供 の @時 は @野球 に 425 でした','When I was a child, I was crazy about baseball.'],
 ['@妹 は @今 @写真 に 425 です','My younger sister is really into photography now.'],
 ['@毎日 @歩く~歩いて~あるいて @体 の @変化 を 1422 @する~しています~しています','Walking every day, I can really feel a change in my body.'],
 ['@初めて 21 を @もらう~もらった~もらった @時 は @まだ 1422 が @ある~ありませんでした~ありませんでした','Even when I received my first salary, it still did not feel real.'],
]);
lesson('hopes-opportunities','Dreams, wishes and opportunities',[38,95,55], 'Vことを夢見ています / 願い / Vチャンス', '夢見る here means imagine and hope for a future life or achievement. A verb phrase can take こと before を: 外国で働くことを夢見る. 願い is the hope itself. チャンス is an opportunity to act, not a probability expressed as a percentage. The examples move from imagining a future to having a chance to try it.', [
 ['@外国 で @働く @こと を 38~夢見ています~ゆめみています','I dream of working abroad.'],
 ['@子供 の @時 から @先生 に @なる @こと を 38~夢見ていました~ゆめみていました','Since childhood, I had dreamed of becoming a teacher.'],
 ['38~夢見ていた~ゆめみていた @生活 が @始まる~始まりました~はじまりました','The life I had dreamed of has begun.'],
 ['@私 の 95 は @家族 と @一緒 に 472~暮らす~くらす @こと です','My wish is to live together with my family.'],
 ['@将来 の 95 を @手紙 に @書く~書きました~かきました','I wrote my hopes for the future in a letter.'],
 ['@友達 の 95 を @聞く~聞きました~ききました','I listened to my friend’s wishes.'],
 ['@日本語 で @話す 55 が @ある~ありました~ありました','I had an opportunity to speak Japanese.'],
 ['@この 55 を @大切 に @する~したい~したい です','I want to make the most of this opportunity.'],
 ['@もう一度 55 を ください','Please give me another chance.'],
]);
authorLesson('aspiration','People and lives you aspire to',[1845,2977], 'Nに憧れています / 憧れのN', '憧れる means admiring someone or longing for a life or experience. Use に for the person or thing you admire or long for. 憧れ is the related noun; 憧れの人 is someone you admire, and 憧れの仕事 is a job you have dreamed of doing.', [
 ['@子供 の @時 から @医者 に 1845~憧れていました~あこがれていました','I had admired doctors since I was a child.'],
 ['@外国 で の @生活 に 1845~憧れています~あこがれています','I long for a life abroad.'],
 ['@私 は @あの @選手 に 1845~憧れています~あこがれています','I admire that athlete.'],
 ['1845~憧れていた~あこがれていた @仕事 を @始める~始めました~はじめました','I started the job I had dreamed of doing.'],
 ['2977 の @選手 に @会う~会いました~あいました','I met the athlete I admire.'],
 ['@彼女 は @私 の 2977 の @人 です','She is someone I admire.'],
 ['@この @仕事 は @子供 の @時 から の 2977 です','I have dreamed of doing this job since childhood.'],
 ['2977 の @人 と @同じ @仕事 を @する~したい~したい です','I want to do the same kind of work as the person I admire.'],
],{1845:'admire; long for; aspire to',2977:'admiration; longing; aspiration'});
course.lessons.at(-1).notes[0].title='Admiring someone or longing for a different life';
lesson('disappointed','Disappointment and sadness',[609,748,1022], 'がっかりします / Nに失望します', 'がっかりする is an everyday way to express disappointment. 失望する often conveys a stronger loss of hope or confidence. 悲しむ is the verb for feeling or expressing sadness; 悲しい describes the feeling itself.', [
 ['@楽しみ に @する~していた~していた @旅行 が @中止 に @なる~なって~なって 609 @する~しました~しました','I was disappointed when the trip I had been looking forward to was canceled.'],
 ['@店 が @休み な ので 609 @する~しました~しました','I was disappointed because the shop was closed.'],
 ['@約束 を @守る~守らなかった~まもらなかった @友達 に 748 @する~しました~しました','I was disappointed in my friend for not keeping a promise.'],
 ['@結果 に は 748 @する~しました~しました が @もう @一度 @挑戦 @する~したい~したい です','I was disappointed with the result, but I want to try again.'],
 ['@友達 は @犬 が @死ぬ~死んだ~しんだ @こと を 1022~悲しんでいます~かなしんでいます','My friend is grieving over the death of their dog.'],
 ['@別れ を 1022~悲しみました~かなしみました が @また @会う @約束 を @する~しました~しました','We were sad to part, but we promised to meet again.'],
]);
lesson('worries','Talking through worries',[384,2887,218], 'Nについて悩んでいます / 冷静に考えます', '悩む is to worry or struggle over something; 悩み is a worry or problem you are troubled by. について introduces the matter. 冷静 describes being calm enough to think or act carefully, rather than being emotionally cold.', [
 ['@将来 の @仕事 について 384~悩んでいます~なやんでいます','I am worried about my future work.'],
 ['@一人 で 384~悩まず~なやまず に @先生 に @相談 @する~しました~しました','Instead of worrying alone, I talked to my teacher.'],
 ['@友達 に 2887 を @話す~話しました~はなしました','I told my friend what was worrying me.'],
 ['@仕事 の 2887 は @家族 に も @相談 @できる~できます~できます','I can also talk to my family about worries at work.'],
 ['@問題 が @起きる~起きた~おきた @時 は 218 に @考える~考えましょう~かんがえましょう','When a problem occurs, let’s think calmly.'],
 ['@急ぐ~急いでいました~いそいでいました が @姉 は 218 でした','Although she was in a hurry, my older sister remained calm.'],
]);
authorLesson('will-and-decision','Determination and making up your mind',[339,864], '意志が強い / Vる決心をしました', '意志 and 意思 are both read いし. 意志 emphasizes the will or determination to act; 意志が強い describes strong willpower. 意思 describes what someone intends or wishes, as in 意思を伝える. 決心する means making up your mind. A plain verb phrase before 決心 names what you have decided to do.', [
 ['@最後 まで @続ける 339 が @ある~あります~あります','I am determined to keep going to the end.'],
 ['@彼 は 339 が @強い @人 です','He is a strong-willed person.'],
 ['@彼女 の @言葉 から @強い 339 を @感じる~感じました~かんじました','I sensed strong determination in her words.'],
 ['339 が @弱い~弱くて~よわくて 、 @すぐ に @練習 を @やめる~やめてしまいました~やめてしまいました','I lacked willpower and soon gave up practicing.'],
 ['@日本 で @働く 864 を @する~しました~しました','I made up my mind to work in Japan.'],
 ['@家族 と @話す~話して~はなして から 864 @する~しました~しました','I made up my mind after talking with my family.'],
 ['@自分 の 864 を @友達 に @伝える~伝えました~つたえました','I told my friend what I had decided.'],
 ['@一度 864 @する~した~した @こと は @最後 まで @続ける~続けます~つづけます','Once I have decided to do something, I keep going to the end.'],
],{339:'will; determination to act',864:'resolution; making up one’s mind'});
course.lessons.at(-1).notes[0].title='意思 and 意志';
lesson('courage-hardship','Finding courage through difficulty',[90,122], '勇気を出します / 苦労します', '勇気を出す means gather the courage to do something; 勇気が出る describes courage arising. 苦労する means experience difficulty or put in hard effort. 苦労して followed by an action shows that it took effort, not that the action was impossible.', [
 ['90 を @出す~出して~だして @質問 @する~しました~しました','I gathered my courage and asked a question.'],
 ['@新しい @仕事 を @始める 90 が @ある~ありませんでした~ありませんでした','I did not have the courage to start a new job.'],
 ['@友達 の @言葉 で 90 が @出る~出ました~でました','My friend’s words gave me courage.'],
 ['@新しい @仕事 で 122 @する~しました~しました','I had difficulties in my new job.'],
 ['@家族 の 122 を @知る~知りました~しりました','I learned about the hardships my family faced.'],
 ['122 @する~して~して @覚える~覚えた~おぼえた @日本語 を @使う~使いました~つかいました','I used the Japanese I had worked hard to learn.'],
]);
lesson('serious-effort','Taking something seriously and trying desperately',[135,92], '真剣に考えます / 必死に探します', '真剣 describes earnest attention or a serious attitude. 必死 describes desperate effort, often under pressure. Both can take に before an action, but 必死 is stronger than simply working carefully.', [
 ['@将来 の @仕事 について 135 に @考える~考えています~かんがえています','I am thinking seriously about my future work.'],
 ['@先生 は 135 に @話 を @聞く~聞いてくださいました~きいてくださいました','My teacher listened to me attentively.'],
 ['135 な @顔 で @練習 @する~していました~していました','They were practicing with a serious expression.'],
 ['@なくす~なくした~なくした @鍵 を 92 に @探す~探しました~さがしました','I searched desperately for the key I had lost.'],
 ['@電車 に @間に合う ように 92 に @走る~走りました~はしりました','I ran as hard as I could to catch the train.'],
 ['@試合 の @最後 まで 92 に @頑張る~頑張りました~がんばりました','I gave it everything I had until the end of the match.'],
]);
authorLesson('giving-up','Continuing or giving up a plan',[651], 'Nを諦めます / 諦めないでください', '諦める means giving up a hope, aim or plan. Use を for what you give up. 諦めないでください encourages someone not to give up; 諦めました describes a decision to stop pursuing something.', [
 ['@まだ 651~諦めていません~あきらめていません','I have not given up yet.'],
 ['@一度 @失敗 @する~した~した だけ で 651~諦めないでください~あきらめないでください','Please do not give up just because you failed once.'],
 ['@雨 が @ひどい ので @旅行 を 651~諦めました~あきらめました','I gave up on the trip because the rain was so heavy.'],
 ['@その @仕事 を 651~諦めて~あきらめて @別 の @仕事 を @探す~探しました~さがしました','I gave up on that job and looked for another one.'],
],{651:'give up; abandon a hope or plan'});
course.lessons.at(-1).notes[0].title='Giving up an aim or a plan';
lesson('relief','Calming down and feeling relieved',[1591,639,463], '落ち着きます / ほっとします / さっぱりします', '落ち着く is to become calm or settled. ほっとする describes relief when tension or worry eases. さっぱりする here is a refreshed feeling, for example after a shower; it has other uses in other contexts.', [
 ['@静か な @場所 で @少し 1591~落ち着きました~おちつきました','I calmed down a little in a quiet place.'],
 ['1591~落ち着いて~おちついて から @話す~話しましょう~はなしましょう','Let’s talk after we have calmed down.'],
 ['@無事 に @家 に @着く~着いて~ついて 639 @する~しました~しました','I was relieved to arrive home safely.'],
 ['@試験 が @終わる~終わって~おわって 639 @する~しています~しています','I feel relieved now that the exam is over.'],
 ['@シャワー を @浴びる~浴びて~あびて 463 @する~しました~しました','I felt refreshed after taking a shower.'],
 ['2887 を @話す~話したら~はなしたら @気持ち が 463 @する~しました~しました','After talking about my worries, I felt a weight off my mind.'],
]);
lesson('happiness','Happiness and good fortune',[327,267,255], '幸福を感じます / 幸い、…', '幸福 is happiness or well-being; it can also modify a noun with な. 不幸 can describe unhappiness or misfortune. 幸い introduces a fortunate circumstance. Do not confuse the noun 幸い（さいわい）with the adjective 幸せ（しあわせ）.', [
 ['@家族 と @食事 を @する @時 に 327 を @感じる~感じます~かんじます','I feel happiness when I eat with my family.'],
 ['@皆さん の 327 を @祈る~祈っています~いのっています','I wish everyone happiness.'],
 ['@友達 は @その @時 @不安 で 267 でした','My friend was anxious and unhappy at that time.'],
 ['@友達 の 267 を @知る~知って~しって @悲しい @気持ち に @なる~なりました~なりました','I felt sad when I learned of my friend’s misfortune.'],
 ['255 @事故 で @怪我 を @する~した~した @人 は @いる~いませんでした~いませんでした','Fortunately, no one was injured in the accident.'],
 ['255 @電車 は @まだ @出発 @する~していませんでした~していませんでした','Fortunately, the train had not departed yet.'],
]);
lesson('surprise-subtlety','Unexpected results and subtle differences',[93,175], '意外な結果 / 微妙な違い', '意外 describes something different from what you expected. 微妙 here describes a small or delicate difference that is hard to notice or explain. In conversation 微妙 can also express doubt or a lukewarm reaction; the examples here use its fine-difference sense, so do not translate every occurrence as bad.', [
 ['@試験 の @結果 は 93 でした','The exam result was unexpected.'],
 ['93 な @場所 で @友達 に @会う~会いました~あいました','I met a friend in an unexpected place.'],
 ['@この @料理 は 93 に @簡単 でした','This dish was surprisingly easy to make.'],
 ['@言葉 の 175 な @違い を @先生 に @聞く~聞きました~ききました','I asked my teacher about a subtle difference between words.'],
 ['@色 の 175 な @違い が @わかる~分かりません~わかりません','I cannot tell the subtle difference in color.'],
 ['@友達 の @声 の 175 な @変化 に 480~気づきました~きづきました','I noticed a subtle change in my friend’s voice.'],
]);
lesson('pride','Pride and admiration',[133,410,576], 'Nを誇りに思います / Nに感心します', '自慢 can be boasting, but 自慢のN can simply describe something one is proud of. 誇り is a sense of pride; Nを誇りに思う means to feel proud of N. 感心する expresses being impressed by someone’s conduct or ability. Use it thoughtfully when speaking directly to someone senior, because it can sound like an evaluation.', [
 ['@父 は @自分 の @料理 を @よく 133 @する~します~します','My father often boasts about his cooking.'],
 ['@この @庭 は @祖母 の 133 です','This garden is my grandmother’s pride and joy.'],
 ['@自分 の @仕事 に 410 を @持つ~持っています~もっています','I take pride in my work.'],
 ['@最後 まで @続ける~続けた~つづけた @こと を 410 に @思う~思います~おもいます','I feel proud that I kept going to the end.'],
 ['@友達 の @努力 に 576 @する~しました~しました','I was impressed by my friend’s efforts.'],
 ['@子供 が @自分 で @弁当 を @作る~作った~つくった ので 576 @する~しました~しました','I was impressed because the child made a packed lunch independently.'],
]);
lesson('talent','Recognizing a talent',[178], 'Nの才能があります / 才能と努力', '才能 is an ability or talent. Nの才能 identifies an area such as art or music. The examples connect ability with practice and noticing what someone does well.', [
 ['@妹 に は @絵 の 178 が @ある~あります~あります','My younger sister has a talent for drawing.'],
 ['@音楽 の 178 を @持つ @友達 が @いる~います~います','I have a friend with musical talent.'],
 ['178 が @ある~あっても~あっても @練習 は @必要 です','Even with talent, practice is necessary.'],
 ['@先生 は @子供 の 178 を @見つける~見つけました~みつけました','The teacher discovered the child’s talent.'],
]);
lesson('envy','Envy and gratitude',[458,2629,1375], 'Nが羨ましいです / Nを羨みます', '羨ましい describes wanting something good that someone else has; が marks that person or thing. 羨む is the related verb and takes を. ありがたい expresses appreciation for help or a welcome circumstance. It is not used exactly like the greeting ありがとう.', [
 ['@長い @休み が @ある @友達 が 458 です','I envy my friend for having a long holiday.'],
 ['@海 の @近く に @住む~住んでいる~すんでいる @人 が 458 です','I envy people who live near the sea.'],
 ['@兄 の @自由 な @生活 を 2629~羨んでいました~うらやんでいました','I used to envy my older brother’s free lifestyle.'],
 ['@他 の @人 を 2629~羨む~うらやむ @こと も @ある~あります~あります','Sometimes I envy other people too.'],
 ['@友達 が @手伝う~手伝って~てつだって @くれる~くれた~くれた ので 1375~ありがたかった~ありがたかった です','I was grateful that my friend helped me.'],
 ['@困る~困った~こまった @時 に @相談 @できる @人 が @いる の は 1375 です','I am grateful to have someone I can turn to when I am in trouble.'],
]);
lesson('cheerful','Describing a cheerful person',[812,2478], '陽気な人 / 朗らかな人', '陽気 and 朗らか can both describe cheerful people. 陽気 often suggests a lively, outgoing manner; 朗らか suggests a bright, pleasant disposition. Both use な before a noun. These are descriptions, not fixed judgments about how a person always feels.', [
 ['@父 は 812 な @人 で @よく @笑う~笑います~わらいます','My father is a cheerful person who laughs a lot.'],
 ['812 な @友達 と @いる と @楽しい です','It is fun being with my cheerful friend.'],
 ['@祖母 は 2478 な @人 です','My grandmother is a cheerful person.'],
 ['@先生 は 2478 に @笑う~笑いました~わらいました','The teacher laughed cheerfully.'],
]);
lesson('jokes','Understanding when someone is joking',[145], '冗談を言います / 冗談ではありません', '冗談 is a joke or something said in jest. 冗談を言う means joke with someone. The relationship and tone help the listener decide whether a remark is serious.', [
 ['@友達 が 145 を @言う~言って~いって @全員 が @笑う~笑いました~わらいました','My friend made a joke, and everyone laughed.'],
 ['@それ は 145 です か','Are you joking?'],
 ['145 ではありません ので 135 に @聞く~聞いてください~きいてください','I am not joking, so please listen seriously.'],
 ['@友達 の 145 が @わかる~分からなくて~わからなくて @意味 を @聞く~聞きました~ききました','I did not understand my friend’s joke, so I asked what it meant.'],
]);
lesson('still-the-same','Describing what has stayed the same',[181], '相変わらず + description or action', '相変わらず means something is still as it was before. It can describe a welcome continuity or a continuing problem, depending on what follows. Use it when you know the earlier situation; it is not simply a replacement for always.', [
 ['@祖母 は 181 @元気 です','My grandmother is as well as ever.'],
 ['@友達 は 181 @よく @笑う~笑います~わらいます','My friend still laughs a lot, just as before.'],
 ['@仕事 は 181 @忙しい です','Work is still busy as usual.'],
 ['@弟 は 181 @料理 に 565 @する~しています~しています','My younger brother is still absorbed in cooking.'],
]);
lesson('account','From nerves to pride',[], 'A connected account of changing feelings', 'Follow how the speaker feels before, during and after a presentation. The reasons and changes use patterns already taught; read the sentences as one short account.', [
 ['@初めて の @発表 の @前 は @緊張 @する~していました~していました','I was nervous before my first presentation.'],
 ['@友達 と @話す~話して~はなして @少し 1591~落ち着きました~おちつきました','I talked with a friend and calmed down a little.'],
 ['@友達 の @優しい @言葉 は @とても 1375~ありがたかった~ありがたかった です','I was very grateful for my friend’s kind words.'],
 ['@発表 が @終わる~終わった~おわった @時 は 639 @する~しました~しました','When the presentation was over, I felt relieved.'],
 ['@最後 まで @話す~話した~はなした @こと を @今 も 410 に @思う~思っています~おもっています','I still feel proud that I spoke to the end.'],
]);
lesson('opportunity-account','Taking a chance to work abroad',[], 'From a hope to action under pressure', 'A learner talks about the wish to work abroad, the effort it required and the courage to speak. Earlier feelings and newly learned words explain the same experience from several angles.', [
 ['@外国 で @働く @こと を @長い @間 38~夢見ていました~ゆめみていました','I had dreamed of working abroad for a long time.'],
 ['@その 95 を @家族 に @話す~話しました~はなしました','I told my family about that wish.'],
 ['@日本語 の @勉強 で 122 @する~しました~しました が @毎日 @続ける~続けました~つづけました','Studying Japanese was difficult, but I continued every day.'],
 ['@日本 の @会社 で @働く 55 が @ある~ありました~ありました','I had an opportunity to work at a Japanese company.'],
 ['@仕事 について 135 に @考える~考えて~かんがえて 2865 @する~しました~しました','I thought seriously about the job and applied.'],
 ['23 で @質問 の @意味 を 92 に @考える~考えました~かんがえました','During the interview, I tried desperately to understand what the question meant.'],
 ['90 を @出す~出して~だして @日本語 で @答える~答えました~こたえました','I gathered my courage and answered in Japanese.'],
]);
authorLesson('becoming-a-teacher','From admiration to a decision',[], '意思を伝えます / 強い意志を持って', '意思を伝える tells someone what you intend to do. 強い意志を持って describes doing something with determination.', [
 ['@子供 の @時 から @先生 に 1845~憧れていました~あこがれていました','I had admired teachers since I was a child.'],
 ['@大人 に @なる~なっても~なっても @先生 に @なる @夢 は 651~諦めませんでした~あきらめませんでした','Even as an adult, I did not give up my dream of becoming a teacher.'],
 ['@日本語 の @先生 に @なる 864 を @する~しました~しました','I made up my mind to become a Japanese teacher.'],
 ['@家族 に @自分 の 83 を @伝える~伝えました~つたえました','I told my family what I intended to do.'],
 ['@強い 339 を @持つ~持って~もって @勉強 を @続ける~続けました~つづけました','I continued studying with strong determination.'],
 ['@今 は 2977 の @仕事 を @する~しています~しています','Now I am doing the job I dreamed of.'],
],{1845:'admire; aspire to',651:'give up; abandon a hope or plan',864:'resolution; making up one’s mind',83:'intention; wish',339:'will; determination to act',2977:'admiration; longing; aspiration'});
course.lessons.at(-1).notes[0].title='An intention and the will to act';
lesson('reunion-account','Noticing a friend’s reaction',[], 'A familiar friend and an unexpected response', 'Two friends meet again. Familiar laughter, a talent and an unexpected reaction lead to a conversation about a joke. Pay attention to small changes in voice rather than assuming laughter explains every feeling.', [
 ['@久しぶり に @会う~会った~あった @友達 は 181 @よく @笑う~笑いました~わらいました','A friend I met after a long time still laughed a lot, just as before.'],
 ['@友達 の @絵 を @見る~見て~みて 178 に 576 @する~しました~しました','I saw my friend’s drawing and was impressed by their talent.'],
 ['@私 が 145 を @言う~言った~いった @時 に @友達 は @静か に @なる~なりました~なりました','When I made a joke, my friend became quiet.'],
 ['@友達 が @静か に @なる~なった~なった @こと は 93 でした','It was unexpected that my friend became quiet.'],
 ['@声 の 175 な @変化 に 480~気づいて~きづいて @理由 を @聞く~聞きました~ききました','I noticed a subtle change in their voice and asked why.'],
 ['@友達 の @気持ち を 135 に @聞く~聞いて~きいて @謝る~謝りました~あやまりました','I listened seriously to my friend’s feelings and apologized.'],
]);
}
