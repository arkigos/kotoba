export function authorPeopleDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 855:'close; on familiar terms',68:'ally; supporter; someone on your side',771:'to rely on; to turn to for help',
 301:'to believe; to trust',310:'to love',352:'love; affection',
 784:'to give as a gift',598:'kindness received; a debt of gratitude',426:'thanks; gratitude; a bow',
 393:'to hope for; to desire',502:'to wish for; to hope for',662:'hope; wish',
 685:'frustrated; bitterly disappointed',306:'shock; an emotional blow',321:'poor; pitiable',763:'unfortunate; deserving sympathy',
 466:'mood; temper',693:'chatting; chatter; talkative',779:'to dislike; to hate',
 487:'deliberately; on purpose',346:'involuntarily; without thinking',572:'carelessly; inadvertently',318:'reflection on one’s conduct; regret',
 703:'good luck; good fortune',925:'humor',465:'strange; peculiar',217:'odd; strange',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('relationships');
lesson('close-and-supportive','Close friends and support',[855,68,771], '親しい友人 / 味方 / 人に頼ります', '親しい describes a close relationship. 味方 is someone on your side, especially in a disagreement or difficulty. 頼る means turning to someone or something for help; に marks that source of support.', [
 ['855 @友人 に @家族 の こと を @話す~話しました~はなしました','I told a close friend about my family.'],
 ['@隣 の @家族 と は 855~親しく~したしく @する~しています~しています','We are on friendly terms with the family next door.'],
 ['@彼女 と は @大学 の @時 から 855 です','She and I have been close since university.'],
 ['@皆さん が @反対 @する~して~して も @私 は @あなた の 68 です','Even if everyone objects, I am on your side.'],
 ['@姉 が @私 の 68 に @なる~なって~なって @くれる~くれました~くれました','My older sister took my side.'],
 ['@彼 に は @会社 に 68 が @いる~います~います','He has an ally at the company.'],
 ['@困る~困った~こまった @時 は @家族 に 771~頼ります~たよります','When I am in trouble, I turn to my family.'],
 ['@地図 に 771~頼って~たよって @知る~知らない~しらない @町 を @歩く~歩きました~あるきました','I relied on a map as I walked around an unfamiliar town.'],
 ['@いつも @親 に 771~頼って~たよって @生活 @する~しています~しています','I always rely on my parents to support me.'],
]);
lesson('trust-and-affection','Trust and affection',[301,310,352], '人を信じます / 愛します / 愛情', '信じる can mean believing a statement or trusting a person. 愛する expresses deep love; 好き is more usual for everyday likes. 愛情 is affection, including the care shown in close relationships.', [
 ['@私 は @彼 の @言葉 を 301~信じています~しんじています','I believe what he says.'],
 ['855 @友人 を 301~信じて~しんじて @相談 @する~しました~しました','I trusted a close friend and asked for advice.'],
 ['@その @話 は 301~信じられません~しんじられません','I cannot believe that story.'],
 ['@彼 は @家族 を 310~愛しています~あいしています','He loves his family.'],
 ['@祖母 は @生まれる~生まれた~うまれた @町 を 310~愛していました~あいしていました','My grandmother loved the town where she was born.'],
 ['@彼女 は @音楽 を @深い~深く~ふかく 310~愛しています~あいしています','She has a deep love of music.'],
 ['@母 の @手紙 から 352 を @感じる~感じました~かんじました','I felt my mother’s affection in her letter.'],
 ['@祖父 は @子供 に @深い 352 を @持つ~持っています~もっています','My grandfather has deep affection for the children.'],
 ['352 を @言葉 で @伝える~伝える~つたえる の は @難しい です','It is difficult to express affection in words.'],
]);
lesson('support-account','A friend’s support',[], 'A difficult decision', 'Follow someone asking a trusted friend for help with a decision.', [
 ['@仕事 を @変える こと について @考える~考えていました~かんがえていました','I was thinking about changing jobs.'],
 ['855 @友人 に @自分 の @考え を @話す~話しました~はなしました','I told a close friend what I was thinking.'],
 ['@友人 は @私 の @話 を @最後 まで @聞く~聞いて~きいて @くれる~くれました~くれました','My friend listened to everything I had to say.'],
 ['@私 の 68 が @いる と @感じる~感じました~かんじました','I felt that someone was on my side.'],
 ['@友人 を 301~信じて~しんじて @自分 の @不安 も @話す~話しました~はなしました','I trusted my friend and also talked about my anxieties.'],
 ['@人 に 771~頼る~たよる の は @悪い こと ではありません','It is not wrong to turn to others for help.'],
]);
useTopic('visits');
lesson('gifts-and-gratitude','Gifts and gratitude',[784,598,426], '贈ります / 恩 / 礼を言います', '贈る is giving something as a gift. 恩 is kindness you have received and feel grateful for. 礼 can mean thanks or a bow; the verb makes the meaning clear, as in 礼を言う and 礼をする.', [
 ['@卒業 の 354 に @妹 に @時計 を 784~贈りました~おくりました','I gave my younger sister a watch as a graduation gift.'],
 ['@友人 の @結婚 に @花 を 784~贈ります~おくります','I will give my friend flowers for their wedding.'],
 ['@父 に @本 を 784~贈ったら~おくったら @喜ぶ~喜んで~よろこんで @くれる~くれました~くれました','When I gave my father a book, he was pleased.'],
 ['@教える~教えて~おしえて @くれる~くれた~くれた @先生 の 598 は @忘れる~忘れません~わすれません','I will not forget the kindness of the teacher who taught me.'],
 ['@困る~困った~こまった @時 に @お金 を @貸す~貸して~かして @くれる~くれた~くれた @友人 に は 598 が @ある~あります~あります','I owe a debt of gratitude to the friend who lent me money when I was in trouble.'],
 ['@今度 は @私 が @手伝う~手伝って~てつだって 598 を @返す~返したい~かえしたい です','This time I want to repay that kindness by helping.'],
 ['@手伝う~手伝って~てつだって @くれる~くれた~くれた @友達 に 426 を @言う~言いました~いいました','I thanked the friend who helped me.'],
 ['@発表 の @後 で @皆さん に 426 を @する~しました~しました','I bowed to everyone after my presentation.'],
 ['@先生 に @深い~深く~ふかく 426 を @する~して~して @部屋 を @出る~出ました~でました','I bowed deeply to the teacher and left the room.'],
]);
lesson('gratitude-account','Visiting a former teacher',[], 'Remembering someone’s kindness', 'A visit gives a former student a chance to thank a teacher in person.', [
 ['@昔 の @先生 の @家 を 99 @する~しました~しました','I visited my former teacher’s home.'],
 ['@学生 の @時 に @教える~教えて~おしえて @もらう~もらった~もらった 598 を @今 も @覚える~覚えています~おぼえています','I still feel grateful for what the teacher taught me as a student.'],
 ['@先生 が @好き な @花 を 784~贈りました~おくりました','I gave the teacher flowers they liked.'],
 ['@昔 の @話 を @する~して~して 976 に @笑う~笑いました~わらいました','We talked about the old days and laughed together.'],
 ['@帰る @前 に @もう一度 426 を @言う~言いました~いいました','Before leaving, I thanked the teacher again.'],
]);
useTopic('feelings');
lesson('hopes-and-wishes','Hopes and wishes',[393,502,662], '望みます / 願います / 望み', '望む often expresses a desired result. 願う expresses a wish, hope or request; 幸せを願う is wishing someone happiness. 望み is the noun: a wish, or hope that something can happen.', [
 ['@家族 は @静か な @生活 を 393~望んでいます~のぞんでいます','The family wants a quiet life.'],
 ['@私たち は @平和 を 393~望んでいます~のぞんでいます','We hope for peace.'],
 ['@彼女 は @外国 で @働く こと を 393~望んでいました~のぞんでいました','She hoped to work abroad.'],
 ['@友達 の @幸せ を 502~願っています~ねがっています','I wish my friend happiness.'],
 ['@家族 の @健康 を 502~願いました~ねがいました','I wished for my family’s good health.'],
 ['@皆さん の @無事 を 502~願っています~ねがっています','I hope everyone is safe.'],
 ['@私 の 662 は @家族 と @住む こと です','My wish is to live with my family.'],
 ['@まだ 662 を @捨てる~捨てていません~すてていません','I have not given up hope yet.'],
 ['@試合 に @勝つ 662 は @ある~あります~あります','There is hope of winning the match.'],
]);
lesson('disappointment-and-sympathy','Disappointment and sympathy',[685,306,321,763], '悔しい / ショックを受けます / かわいそう / 気の毒', '悔しい often follows losing or failing at something you care about. ショック is a sudden emotional blow. かわいそう and 気の毒 express sympathy, but saying them directly to someone can sound pitying; these examples describe a situation to another listener.', [
 ['@試合 に @負ける~負けて~まけて 685~悔しかった~くやしかった です','I was bitterly disappointed that I lost the match.'],
 ['@答え が @わかる~わからなくて~わからなくて 685~悔しかった~くやしかった です','I was frustrated that I did not know the answer.'],
 ['@練習 @する~して~して も @勝つ~勝てませんでした~かてませんでした 。 685 です','Even with practice, I could not win. I am frustrated.'],
 ['@急 な @ニュース に 306 を @受ける~受けました~うけました','The sudden news came as a shock.'],
 ['@大切 な @写真 を @なくす~なくした~なくした 306 は @大きい~大きかった~おおきかった です','Losing those precious photographs was a big blow.'],
 ['@友達 の @言葉 が 306 でした','What my friend said shocked me.'],
 ['@雨 の @中 で @濡れる~濡れた~ぬれた @犬 が 321 でした','I felt sorry for the dog that had got wet in the rain.'],
 ['@一人 で @泣く~泣いている~ないている @子 が 321 です','I feel sorry for the child crying alone.'],
 ['@楽しみ に @する~していた~していた @旅行 に @行く~行けなかった~いけなかった @妹 が 321 です','I feel sorry for my younger sister, who could not go on the trip she had been looking forward to.'],
 ['@事故 で @怪我 を @する~した~した @人 は 763 です','I feel sorry for the person injured in the accident.'],
 ['@病気 で @卒業 の @パーティー に @出る~出られなかった~でられなかった @友人 を 763 に @思う~思いました~おもいました','I felt sorry for my friend, who missed the graduation party because of illness.'],
 ['@彼 が @大切 な @物 を @なくす~なくした~なくした と @聞く~聞いて~きいて 763 に @思う~思いました~おもいました','I felt sorry for him when I heard he had lost something important.'],
]);
lesson('moods-and-conversation','Moods and conversation',[466,693,779], '機嫌がいい / おしゃべり / 嫌います', '機嫌 is someone’s mood or temper. おしゃべり can name chatting or describe a talkative person. 嫌う is disliking someone or something; it is stronger than simply not choosing it.', [
 ['@今日 の @父 は 466 が @いい です','My father is in a good mood today.'],
 ['@何 か @ある~あった~あった の です か 。 466 が @悪い です ね','Did something happen? You seem to be in a bad mood.'],
 ['@赤ちゃん は @よく @寝る~寝て~ねて 466 が @いい です','The baby has slept well and is in a good mood.'],
 ['@友達 と @喫茶店 で 693 を @楽しむ~楽しみました~たのしみました','I enjoyed a chat with my friend at a café.'],
 ['@妹 は 693 で @いつも @学校 の @話 を @する~します~します','My younger sister is talkative and always tells us about school.'],
 ['@授業 が @始まる~始まった~はじまった から 693 を @やめる~やめました~やめました','We stopped chatting because class had started.'],
 ['@彼 は @嘘 を 779~嫌います~きらいます','He dislikes lies.'],
 ['@彼女 は @人 を @長い @間 @待つ こと を 779~嫌います~きらいます','She dislikes waiting a long time for people.'],
 ['@猫 は @大きい @音 を 779~嫌います~きらいます','Cats dislike loud noises.'],
]);
lesson('intentions-and-mistakes','Intentions and mistakes',[487,346,572,318], 'わざと / 思わず / うっかり / 反省します', 'わざと marks a deliberate action. 思わず describes a spontaneous reaction, while うっかり points to a careless mistake or lapse of attention. 反省 is thinking back on your conduct, often to do better next time.', [
 ['@弟 は 487 @変 な @声 で @話す~話しました~はなしました','My younger brother deliberately spoke in a strange voice.'],
 ['487 @負ける~負けた~まけた の ではありません','I did not lose on purpose.'],
 ['@友達 を @驚く~驚かせる~おどろかせる @ため に 487 @部屋 を @暗い~暗く~くらく @する~しました~しました','I deliberately made the room dark to surprise my friend.'],
 ['@その @話 を @聞く~聞いて~きいて 346 @笑う~笑いました~わらいました','I could not help laughing when I heard that story.'],
 ['@大きい @音 に 346 @声 を @出す~出しました~だしました','I cried out instinctively at the loud noise.'],
 ['1388 @写真 を @見る~見て~みて 346 @涙 が @出る~出ました~でました','Looking at the nostalgic photographs, I found myself in tears.'],
 ['572 @鍵 を @家 に @忘れる~忘れました~わすれました','I absent-mindedly left my keys at home.'],
 ['572 @友達 の @手紙 を @捨てる~捨ててしまいました~すててしまいました','I accidentally threw away my friend’s letter.'],
 ['572 @約束 の @時間 を @間違える~間違えました~まちがえました','I carelessly got the time of our appointment wrong.'],
 ['@友達 に @ひどい こと を @言う~言った~いった と 318 @する~しています~しています','I regret having said something hurtful to my friend.'],
 ['@自分 の @行動 を 318 @する~しました~しました','I reflected on my behavior.'],
 ['318 @する~して~して @次 は @同じ @間違い を @する~しない~しない と @決める~決めました~きめました','I reflected on what I had done and decided not to make the same mistake next time.'],
]);
lesson('luck-and-humor','Luck and humor',[703,925], '幸運 / ユーモア', '幸運 is good fortune. ユーモア is humor, as a quality in a person, a remark or a piece of writing.', [
 ['@こんな @友達 に @会う~会えた~あえた の は 703 でした','I was fortunate to meet a friend like this.'],
 ['@皆さん の 703 を 502~願っています~ねがっています','I wish you all good luck.'],
 ['703 に も @最後 の @切符 を @買う~買えました~かえました','Fortunately, I was able to buy the last ticket.'],
 ['@彼 の @話 に は 925 が @ある~あります~あります','There is humor in what he says.'],
 ['925 が @ある @先生 の @授業 は @楽しい です','The lessons of a teacher with a sense of humor are enjoyable.'],
 ['925 が @ある @文章 を @書く~書きたい~かきたい です','I want to write something with humor in it.'],
]);
lesson('odd-impressions','Odd impressions',[465,217], '奇妙な音 / 妙な感じ', '奇妙 and 妙 both describe something that seems strange or unusual. 妙 is also common in ordinary conversation, as in 妙な感じ. Neither word by itself says that something is dangerous.', [
 ['@外 から 465 な @音 が @聞こえる~聞こえました~きこえました','A peculiar sound came from outside.'],
 ['@昨日 は 465 な @夢 を @見る~見ました~みました','I had a strange dream yesterday.'],
 ['@彼 の @話 は @少し 465 です','His story is a little strange.'],
 ['@誰 も @いる~いない~いない @教室 は 217 な @感じ が @する~しました~しました','The classroom with no one in it felt odd.'],
 ['@友達 が 217 な @顔 で @私 を @見る~見ていました~みていました','My friend was looking at me with an odd expression.'],
 ['@いつも と @声 が @違う~違います~ちがいます 。 217 です ね','Your voice sounds different from usual. That is odd.'],
]);
lesson('repairing-a-mistake-account','Putting a mistake right',[], 'A forgotten promise', 'Follow a misunderstanding, an apology and a change in mood.', [
 ['@友達 と @会う @約束 を 572 @忘れる~忘れてしまいました~わすれてしまいました','I absent-mindedly forgot my arrangement to meet a friend.'],
 ['@友達 は 466 が @悪い~悪く~わるく @なる~なりました~なりました','My friend became upset.'],
 ['487 ではありませんでした が @私 が @悪い~悪かった~わるかった です','It was not deliberate, but it was my fault.'],
 ['@自分 の @行動 を 318 @する~して~して @電話 で @謝る~謝りました~あやまりました','I reflected on my behavior and apologized by phone.'],
 ['@友達 は @次 の @約束 は @忘れる~忘れないで~わすれないで ください と @言う~言いました~いいました','My friend said, “Please do not forget our next appointment.”'],
 ['@次 の @日 @喫茶店 で @会う~会って~あって @楽しい~楽しく~たのしく 693 を @する~しました~しました','The next day we met at a café and enjoyed chatting.'],
]);
}
