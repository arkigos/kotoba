export function authorRelationshipsDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 1587:'acquaintance; someone one knows',2247:'relative; kin',959:'manners; etiquette',
 746:'respect; esteem',2463:'to respect; to honor',805:'stubbornness; pride',950:'to betray; to let down',960:'to deceive; to trick',
 834:'cute; lovely; sweet',1504:'smiling; with a friendly smile',1725:'toast; cheers',2095:'joyous; auspicious',
 1940:'feeling obliged; gratitude or embarrassment at troubling someone',1007:'unfortunately; sorry, but',
 1790:'regrettable; a close miss; too good to lose',597:'unexpectedly; surprisingly',
 1943:'heartbreak; disappointed love',2033:'hateful; detestable',2173:'to hate; to detest',
 790:'pitiful; pitiable',2362:'brave; valiant',427:'increasingly; more and more',824:'even more',585:'greatly; very much',
 852:'recently; lately',856:'frequently; repeatedly',1001:'still; continuing as before',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('relationships');
lesson('acquaintances-relatives-and-manners','Acquaintances, relatives and manners',[1587,2247,959], '知人 / 親類 / 作法', '知人 is someone you know, without necessarily being close friends. 親類 means relatives. 作法 is the customary way to behave in a setting, such as at a meal.', [
 ['@駅 で 1587 に @会う~会いました~あいました','I met an acquaintance at the station.'],
 ['1587 から @手紙 が @来る~来ました~きました','A letter came from an acquaintance.'],
 ['@その @人 は @父 の 1587 です','That person is an acquaintance of my father.'],
 ['2247 が @家 に @集まる~集まりました~あつまりました','Our relatives gathered at the house.'],
 ['@近く に 2247 が @住む~住んでいます~すんでいます','Some relatives live nearby.'],
 ['@休日 に 2247 を @訪ねる~訪ねました~たずねました','I visited relatives on my day off.'],
 ['@食事 の 959 を @教える~教えて~おしえて ください','Please teach me the table manners.'],
 ['@客 と @会う @時 の 959 を @練習 @する~しました~しました','We practiced the etiquette for meeting guests.'],
 ['@日本 と @私 の @国 で は 959 が @違う~違います~ちがいます','Manners differ between Japan and my country.'],
]);
lesson('respect-in-words-and-actions','Respect in words and actions',[746,2463], '敬意 / 敬います', '敬意 is a feeling of respect. 敬う is the verb: the person respected takes を. Respect can be expressed through words and actions.', [
 ['@先生 に 746 を @持つ~持っています~もっています','I have respect for my teacher.'],
 ['@相手 に 746 を @持つ~持って~もって @話す~話しました~はなしました','I spoke to the other person with respect.'],
 ['@言葉 で 746 を @伝える~伝えました~つたえました','I expressed my respect in words.'],
 ['@祖父 を 2463~敬っています~うやまっています','I respect my grandfather.'],
 ['@私たち は @その @先生 を 2463~敬います~うやまいます','We respect that teacher.'],
 ['747 を 2463~敬う~うやまう @気持ち が @大切 です','A feeling of mutual respect is important.'],
]);
lesson('pride-trust-and-deception','Pride, trust and deception',[805,950,960], '意地 / 裏切ります / 騙します', '意地 can be stubbornness or pride, often in 意地を張る. 裏切る breaks someone’s trust or expectations. 騙す deceives someone; the examples describe deception, not an honest mistake.', [
 ['@小さい @こと で 805 を @張る~張りました~はりました','I stubbornly dug in over a small matter.'],
 ['805 を @張る~張って~はって @話 を @聞く~聞きませんでした~ききませんでした','I stubbornly refused to listen.'],
 ['805 を @捨てる~捨てて~すてて @友達 に @謝る~謝りました~あやまりました','I put aside my pride and apologized to my friend.'],
 ['@友達 の @信頼 を 950~裏切りたくない~うらぎりたくない です','I do not want to betray my friend’s trust.'],
 ['@約束 を @守る~守りませんでした~まもりませんでした 。 @友達 を 950~裏切りました~うらぎりました','I did not keep my promise. I betrayed my friend.'],
 ['950~裏切られた~うらぎられた @人 の @気持ち を @考える~考えました~かんがえました','I thought about the feelings of the person who had been betrayed.'],
 ['@物語 の @男 は @人 を 960~騙しました~だましました','The man in the story deceived people.'],
 ['@その @話 に 960~騙されました~だまされました','I was taken in by that story.'],
 ['@人 を 960~騙す~だます @言葉 を @使う~使わないで~つかわないで ください','Please do not use words that deceive people.'],
]);
useTopic('visits');
lesson('smiles-and-celebrations','Smiles and celebrations',[834,1504,1725,2095], '可愛らしい / にこにこ / 乾杯 / めでたい', '可愛らしい describes something cute or sweet. にこにこ suggests a friendly, happy smile. 乾杯 is a toast, and めでたい describes an occasion worth celebrating.', [
 ['834 @花 を @机 に @置く~置きました~おきました','I placed some lovely flowers on the table.'],
 ['@子供 の @服 は 834 です','The child’s clothes are adorable.'],
 ['834 @猫 の @写真 を @見る~見ました~みました','I saw a photograph of a cute cat.'],
 ['@祖母 は 1504~にこにこ~にこにこ @する~しています~しています','My grandmother is smiling happily.'],
 ['@子供 が 1504~にこにこ~にこにこ @笑う~笑っています~わらっています','The child is smiling brightly.'],
 ['1504~にこにこ~にこにこ @する~して~して @客 を @迎える~迎えました~むかえました','We greeted our guests with smiles.'],
 ['@全員 で 1725 @する~しました~しました','We all made a toast together.'],
 ['@ジュース で 1725 @する~しましょう~しましょう','Let’s make a toast with juice.'],
 ['1725 の @前 に @父 が @話す~話しました~はなしました','My father spoke before the toast.'],
 ['@今日 は 2095 @日 です','Today is a day to celebrate.'],
 ['2095 こと が @ある~ありました~ありました','There was something to celebrate.'],
 ['@卒業 は 2095 こと です','Graduation is something to celebrate.'],
]);
lesson('polite-regrets-and-gratitude','Polite regrets and gratitude',[1007,1940], 'あいにく / 恐縮です', 'あいにく introduces an unfortunate circumstance, often when a request cannot be met. 恐縮 expresses gratitude or awareness that someone is going to trouble for you; it is more formal than everyday thanks.', [
 ['1007 @明日 は @家 に @いる~いません~いません','Unfortunately, I will not be at home tomorrow.'],
 ['1007 @雨 で @外 に @出る~出られません~でられません','Unfortunately, I cannot go outside because of the rain.'],
 ['1007 @今日 は @時間 が @ある~ありません~ありません','Unfortunately, I have no time today.'],
 ['@遠く から @来る~来てくださって~きてくださって 1940 です','I am much obliged to you for coming from so far away.'],
 ['@また @電話 @する~して~して 1940 です','I am sorry to trouble you by calling again.'],
 ['@突然 の @電話 で 1940 です','I am sorry to trouble you with this unexpected phone call.'],
]);
lesson('a-family-celebration-account','A family celebration',[], 'Welcoming and celebrating', 'Follow a family gathering for a graduation celebration.', [
 ['@卒業 を 831 @ため に 2247 が @集まる~集まりました~あつまりました','Relatives gathered to celebrate a graduation.'],
 ['@祖母 は 1504~にこにこ~にこにこ @する~して~して @客 を @迎える~迎えました~むかえました','My grandmother welcomed the guests with a smile.'],
 ['@机 の @上 に 834 @花 が @ある~ありました~ありました','There were lovely flowers on the table.'],
 ['@父 は 2095 @日 だ と @言う~言いました~いいました','My father said it was a day to celebrate.'],
 ['@全員 が @ジュース で 1725 @する~しました~しました','We all made a toast with juice.'],
]);
useTopic('feelings');
lesson('close-misses-and-surprises','Close misses and surprises',[1790,597], '惜しい / 案外', '惜しい can express a close miss or something too good to lose. 案外 means the result differs from what you expected; it can describe a pleasant or an unpleasant surprise.', [
 ['@試合 は 1790 @結果 でした','The match ended in a disappointing near miss.'],
 ['@この @本 を @捨てる の は 1790 です','It would be a shame to throw this book away.'],
 ['@答え は @少し @違う~違います~ちがいます が 1790 です','The answer is slightly off, but it is close.'],
 ['@仕事 は 597 @早い~早く~はやく @終わる~終わりました~おわりました','The work finished unexpectedly early.'],
 ['@道 は 597 @静か でした','The street was surprisingly quiet.'],
 ['@この @問題 は 597 @難しい です','This problem is harder than expected.'],
]);
lesson('heartbreak-and-strong-feelings','Heartbreak and strong feelings',[1943,2033,2173], '失恋 / 憎い / 憎みます', '失恋 is heartbreak or disappointed love. 憎い and 憎む express strong hatred, much stronger than simply disliking something. The surrounding situation matters.', [
 ['1943 @する~して~して @友達 に @話 を @聞く~聞いて~きいて @もらう~もらいました~もらいました','After heartbreak, I had a friend listen to me.'],
 ['@その @歌 は 1943 の @歌 です','That is a song about heartbreak.'],
 ['1943 の @後 、 @気持ち が @少し 1591~落ち着きました~おちつきました','After the heartbreak, I began to feel a little calmer.'],
 ['@物語 の @男 は @相手 が 2033 と @言う~言いました~いいました','The man in the story said he hated the other person.'],
 ['@あの @人 が 2033 と @思う~思った~おもった @時 も @ある~ありました~ありました','There were times when I thought I hated that person.'],
 ['@自分 を 960~騙した~だました @人 が 2033 です','I hate the person who deceived me.'],
 ['@戦争 を 2173~憎んでいます~にくんでいます','I hate war.'],
 ['@相手 を 2173~憎む~にくむ @気持ち を @友達 に @話す~話しました~はなしました','I told a friend about my feelings of hatred toward the other person.'],
 ['@長い @間 @その @人 を 2173~憎んでいました~にくんでいました','I hated that person for a long time.'],
]);
lesson('pity-and-bravery-in-a-story','Pity and bravery in a story',[790,2362], '哀れ / 勇ましい', '哀れ describes someone viewed with pity and can sound judgmental when said directly to them. It often appears in stories. 勇ましい describes a brave or valiant manner.', [
 ['@物語 の @中 の 790 な @子供 は @最後 に @家族 と @会う~会いました~あいました','The pitiable child in the story met their family at the end.'],
 ['@その @話 の @男 を 790 に @思う~思いました~おもいました','I felt pity for the man in that story.'],
 ['790 な @姿 を @見せる~見せたくない~みせたくない と @言う~言いました~いいました','The person said they did not want to appear pitiful.'],
 ['2362 @声 で @名前 を @呼ぶ~呼びました~よびました','The person called the name in a bold voice.'],
 ['@子供 は 2362 @人 の @絵 を @描く~描きました~かきました','The child drew a picture of a brave person.'],
 ['@その @人 の 2362 @姿 を @覚える~覚えています~おぼえています','I remember that person’s valiant appearance.'],
]);
lesson('growing-feelings-and-enthusiasm','Growing feelings and enthusiasm',[427,824,585], 'ますます / 一層 / 大いに', 'ますます describes a continuing increase or change. 一層 means even more than before or than another case. 大いに emphasizes degree: greatly or very much.', [
 ['@日本語 が 427 @好き に @なる~なりました~なりました','I came to like Japanese more and more.'],
 ['@雨 が 427 @強い~強く~つよく @なる~なっています~なっています','The rain is getting stronger and stronger.'],
 ['@友達 の @話 を @聞く~聞いて~きいて 427 @興味 が @出る~出ました~でました','Hearing my friend’s story made me increasingly interested.'],
 ['@その @言葉 で 824 @嬉しい~嬉しく~うれしく @なる~なりました~なりました','Those words made me even happier.'],
 ['@練習 @する~して~して 824 90 が @出る~出ました~でました','Practice gave me even more courage.'],
 ['@友達 と @行く~行ったら~いったら 824 @楽しい です','It will be even more fun if you go with a friend.'],
 ['@先生 の @話 に 585 @感動 @する~しました~しました','I was deeply moved by the teacher’s story.'],
 ['@休日 を 585 @楽しむ~楽しみました~たのしみました','I thoroughly enjoyed my day off.'],
 ['@この @問題 について 585 @考える~考えました~かんがえました','I thought a great deal about this issue.'],
]);
lesson('after-a-disappointing-match-account','After a disappointing match',[], 'A friend listens', 'Follow a conversation after a close loss.', [
 ['@試合 は 1790 @結果 に @終わる~終わりました~おわりました','The match ended in a disappointing near miss.'],
 ['@私 は 597 218 でした','I was surprisingly calm.'],
 ['@友達 が @話 を @聞く~聞いて~きいて @くれる~くれました~くれました','My friend listened to me.'],
 ['@友達 の @言葉 で @練習 @する~したい~したい @気持ち が 824 @強い~強く~つよく @なる~なりました~なりました','My friend’s words strengthened my desire to practice even more.'],
 ['@次 の @試合 を 427 @楽しみ に @する~しています~しています','I am looking forward to the next match more and more.'],
]);
useTopic('time');
lesson('lately-often-and-still','Lately, often and still',[852,856,1001], '近頃 / たびたび / 依然', '近頃 means lately. たびたび describes something happening repeatedly. 依然 describes a situation continuing as before and often appears as 依然として.', [
 ['852 @友達 と @会う~会っています~あっています','I have been seeing my friend lately.'],
 ['852 @朝 @早い~早く~はやく @起きる~起きています~おきています','Lately, I have been getting up early in the morning.'],
 ['852 の @生活 について @話す~話しました~はなしました','We talked about our lives lately.'],
 ['856 @同じ @店 に @行く~行きます~いきます','I often go to the same shop.'],
 ['@その @人 と は 856 @会う~会います~あいます','I see that person frequently.'],
 ['856 @連絡 を @取る~取っています~とっています','We are in frequent contact.'],
 ['@天気 は 1001~依然として~いぜんとして @悪い です','The weather is still bad.'],
 ['@答え は 1001~依然として~いぜんとして @わかる~わかりません~わかりません','The answer is still not known.'],
 ['@友達 は 1001~依然として~いぜんとして @忙しい です','My friend is still busy.'],
]);
lesson('keeping-in-touch-account','Keeping in touch',[], 'Recent news and a visit', 'Follow two acquaintances arranging to meet again.', [
 ['852 1587 から 856 @手紙 が @来る~来ます~きます','Lately, letters have often come from an acquaintance.'],
 ['@その @人 は 1001~依然として~いぜんとして @同じ @町 に @住む~住んでいます~すんでいます','That person still lives in the same town.'],
 ['@訪ねる @日 は 1007 @雨 でした','Unfortunately, it rained on the day of the visit.'],
 ['@家 に @入る~入ったら~はいったら @相手 が 1504~にこにこ~にこにこ @する~していました~していました','When I entered the house, the other person was smiling.'],
 ['@話す~話して~はなして 824 855~親しく~したしく @なる~なりました~なりました','Talking brought us even closer.'],
]);
}
