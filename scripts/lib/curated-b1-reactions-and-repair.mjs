export function authorReactionsAndRepair({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@そっくり':'strikingly similar; exactly alike','B1@頼もしい':'reassuring; dependable',
 'B1@懸命':'with great effort; earnestly','B1@不平':'complaint; dissatisfaction',
 'B1@悪口':'speaking ill of someone; insulting remarks','B1@責める':'to blame; to reproach',
 'B1@逆らう':'to go against; to disobey','B1@反抗':'resistance; defiance',
 'B1@ずるい':'unfair; sneaky','B1@卑怯':'cowardly; unfair; underhanded',
 'B1@生意気':'cheeky; impertinent','B1@しつこい':'persistently bothersome; insistent',
 'B1@嫌がる':'to show dislike; to be unwilling','B1@みっともない':'unseemly; embarrassing; disgraceful',
 'B1@動揺':'feeling shaken; agitation','B1@平気':'fine; untroubled; calm',
 'B1@呆れる':'to be exasperated; to be stunned by something unreasonable',
 'B1@恨み':'resentment; a grudge','B1@仲直り':'making up after a quarrel',
 'B1@口実':'excuse; pretext','B1@心当たり':'an idea or clue about something',
 'B1@不運':'bad luck; misfortune',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('feelings');
lesson('resemblance-and-reassurance','Resemblance, reassurance and effort',['B1@そっくり','B1@頼もしい','B1@懸命'],
 'そっくり / 頼もしい / 懸命に',
 'そっくり describes a strong resemblance. 頼もしい (tanomoshii) describes someone or something that gives you confidence. 懸命に (kenmei ni) means working with great effort.',[
 ['@弟 は @父 に B1@そっくり です','My younger brother looks just like my father.'],
 ['@この @写真 の @人 は @友達 に B1@そっくり です','The person in this photograph looks just like my friend.'],
 ['@二人 の @声 は B1@そっくり です','Their voices sound very much alike.'],
 ['@困る~困った~こまった @時 に @手伝う~手伝ってくれる~てつだってくれる @友達 は B1@頼もしい です','A friend who lends a hand when I am in trouble is reassuring.'],
 ['@兄 の @言葉 を B1@頼もしい と @思う~思いました~おもいました','I found my older brother’s words reassuring.'],
 ['B1@頼もしい @仲間 と @一緒 に @働く~働いています~はたらいています','I work with dependable colleagues.'],
 ['@子供 は B1@懸命 に @走る~走っていました~はしっていました','The child was running with all their effort.'],
 ['@友達 は B1@懸命 に @私 を @手伝う~手伝ってくれました~てつだってくれました','My friend made a great effort to help me.'],
 ['B1@懸命 に @練習 @する~した~した @後 で @少し @休む~休みました~やすみました','I rested a little after practicing hard.'],
]);
lesson('complaints-and-blame','Complaints and blame',['B1@不平','B1@悪口','B1@責める'],
 '不平 / 悪口 / 責めます',
 '不平 (fuhei) expresses dissatisfaction. 悪口 (waruguchi) speaks badly of a person. 責める (semeru) blames or reproaches someone; it can sound accusatory.',[
 ['@長い @時間 @待つ~待った~まった @人 が B1@不平 を @言う~言っています~いっています','People who waited a long time are complaining.'],
 ['@友達 の B1@不平 を @聞く~聞きました~ききました','I listened to my friend’s complaints.'],
 ['@何 に B1@不平 が @ある~あります~あります か','What are you unhappy about?'],
 ['@人 の B1@悪口 を @言う~言わないでください~いわないでください','Please do not speak badly of other people.'],
 ['@私 は @友達 の B1@悪口 を @聞く~聞きたくない~ききたくない です','I do not want to hear people speaking badly of my friend.'],
 ['B1@悪口 を @言う~言った~いった @こと を @謝る~謝りました~あやまりました','I apologized for the insulting things I had said.'],
 ['@彼 は @私 を B1@責める~責めました~せめました','He blamed me.'],
 ['@失敗 @する~した~した @友達 を B1@責める~責めないでください~せめないでください','Please do not blame the friend who made a mistake.'],
 ['@自分 を B1@責める~責めている~せめている @友達 の @話 を @聞く~聞きました~ききました','I listened to a friend who was blaming themselves.'],
]);
lesson('opposition-and-fairness','Opposition and fairness',['B1@逆らう','B1@反抗','B1@ずるい','B1@卑怯'],
 '逆らいます / 反抗します / ずるい / 卑怯',
 '逆らう (sakarau) goes against a person or direction. 反抗 (hankō) is active resistance or defiance. ずるい calls something unfair or sneaky; 卑怯 (hikyō) is stronger and can mean cowardly or underhanded.',[
 ['@子供 が @親 に B1@逆らう~逆らっています~さからっています','The child is defying their parents.'],
 ['@彼 の @意見 に B1@逆らう~逆らう~さからう の は @難しい です','It is difficult to go against his opinion.'],
 ['@風 に B1@逆らう~逆らって~さからって @歩く~歩きました~あるきました','I walked against the wind.'],
 ['@弟 は @先生 に B1@反抗 @する~しました~しました','My younger brother defied the teacher.'],
 ['@なぜ B1@反抗 @する~した~した の か @理由 を @聞く~聞きました~ききました','I asked why they had resisted.'],
 ['@子供 の B1@反抗 について @親 と @話す~話しました~はなしました','I talked with the parents about the child’s defiance.'],
 ['@その @方法 は B1@ずるい です','That method is unfair.'],
 ['@私 は @彼 の @方法 を B1@ずるい と @思う~思いました~おもいました','I thought his way of doing things was unfair.'],
 ['B1@ずるい @方法 で @勝つ~勝ちたくない~かちたくない です','I do not want to win by unfair means.'],
 ['@相手 が @いる~いない~いない @所 で B1@悪口 を @言う の は B1@卑怯 です','Speaking badly of someone behind their back is cowardly.'],
 ['@その @行動 は B1@卑怯 だ と @言う~言われました~いわれました','I was told that the action was underhanded.'],
 ['@彼 は B1@卑怯 な @方法 を @選ぶ~選びませんでした~えらびませんでした','He did not choose an underhanded method.'],
]);
lesson('persistence-and-discomfort','Persistence and discomfort',['B1@生意気','B1@しつこい','B1@嫌がる','B1@みっともない'],
 '生意気 / しつこい / 嫌がります / みっともない',
 '生意気 (namaiki) criticizes someone as cheeky or impertinent. しつこい describes unwanted persistence. 嫌がる (iyagaru) shows dislike or unwillingness. みっともない calls behaviour or appearance unseemly; it can sound harsh.',[
 ['@その @返事 は B1@生意気 に @聞こえる~聞こえます~きこえます','That reply sounds cheeky.'],
 ['B1@生意気 な @言葉 を @使う~使った~つかった @こと を @謝る~謝りました~あやまりました','I apologized for using impertinent language.'],
 ['B1@生意気 な B1@態度 に @先生 が @怒る~怒りました~おこりました','The teacher became angry at the impertinent attitude.'],
 ['B1@しつこい と @友達 に @言う~言われました~いわれました','My friend told me I was being pushy.'],
 ['@この @人 の @電話 は B1@しつこい です','This person’s repeated calls are bothersome.'],
 ['B1@しつこい @質問 に @困る~困りました~こまりました','The persistent questions troubled me.'],
 ['@子供 は @写真 を @撮る~撮られる~とられる の を B1@嫌がる~嫌がっています~いやがっています','The child does not want to be photographed.'],
 ['@友達 は @同じ @話 を @聞く の を B1@嫌がる~嫌がりました~いやがりました','My friend was unwilling to listen to the same story again.'],
 ['B1@嫌がる~嫌がっている~いやがっている @人 に は @頼む~頼みません~たのみません','I do not ask people who are showing reluctance.'],
 ['@人 の @前 で @大きい @声 で @怒る の は B1@みっともない です','Getting angry in a loud voice in front of others is embarrassing.'],
 ['B1@みっともない @こと を @する~した~した と @思う~思いました~おもいました','I felt that I had behaved disgracefully.'],
 ['@自分 の B1@態度 が B1@みっともない と @わかる~わかりました~わかりました','I realized that my attitude was unseemly.'],
]);
lesson('feeling-shaken-or-fine','Feeling shaken or untroubled',['B1@動揺','B1@平気','B1@呆れる'],
 '動揺します / 平気です / 呆れます',
 '動揺 (dōyō) can describe feeling emotionally shaken. 平気 (heiki) means being fine or untroubled by something. 呆れる (akireru) expresses exasperation or disbelief at something unreasonable.',[
 ['@突然 の @電話 に B1@動揺 @する~しました~しました','The unexpected phone call shook me.'],
 ['@友達 は B1@動揺 @する~して~して @何 も @言う~言えませんでした~いえませんでした','My friend was so shaken that they could not say anything.'],
 ['B1@動揺 @する~している~している @人 の @話 を @静か に @聞く~聞きました~ききました','I listened quietly to the person who was feeling shaken.'],
 ['@私 は @一人 で @帰る~帰っても~かえっても B1@平気 です','I am fine with going home on my own.'],
 ['@少し @寒い~寒くても~さむくても B1@平気 です か','Are you all right even if it is a little cold?'],
 ['@少し @失敗 @する~しても~しても B1@平気 です','I do not mind making a small mistake.'],
 ['@彼 の @話 に B1@呆れる~呆れました~あきれました','I was exasperated by what he said.'],
 ['@また @同じ @失敗 を @する~した~した @人 に B1@呆れる~呆れています~あきれています','I am fed up with the person who made the same mistake again.'],
 ['@先生 は B1@呆れる~呆れた~あきれた @顔 で @私 を @見る~見ました~みました','The teacher looked at me with an exasperated expression.'],
]);
lesson('resentment-and-making-up','Resentment and making up',['B1@恨み','B1@仲直り'],
 '恨み / 仲直りします',
 '恨み (urami) is lasting resentment or a grudge. 仲直り (nakanaori) restores a relationship after a quarrel; と names the person you make up with.',[
 ['@私 は @彼 に B1@恨み が @ある~ありません~ありません','I hold no grudge against him.'],
 ['@昔 の @こと で B1@恨み を @持つ~持っています~もっています','They hold a grudge over something from long ago.'],
 ['B1@恨み の @理由 を @聞く~聞いて~きいて @初めて @わかる~わかりました~わかりました','I understood only after hearing the reason for the resentment.'],
 ['@昨日 @友達 と B1@仲直り @する~しました~しました','I made up with my friend yesterday.'],
 ['@弟 と B1@仲直り @する~したい~したい です','I want to make up with my younger brother.'],
 ['B1@仲直り @する~した~した @二人 は @一緒 に @帰る~帰りました~かえりました','After making up, the two went home together.'],
]);
lesson('excuses-clues-and-luck','Excuses, clues and bad luck',['B1@口実','B1@心当たり','B1@不運'],
 '口実 / 心当たりがあります / 不運',
 '口実 (kōjitsu) is an excuse or pretext. 心当たり (kokoroatari) is having an idea or clue about something. 不運 (fuun) is bad luck.',[
 ['@忙しい @こと を B1@口実 に @する~しました~しました','I used being busy as an excuse.'],
 ['@それ は @来る~来なかった~こなかった B1@口実 です か','Is that an excuse for not coming?'],
 ['@それ は B1@口実 だ と @友達 に @言う~言われました~いわれました','My friend told me that was an excuse.'],
 ['@この @名前 に B1@心当たり が @ある~あります~あります か','Does this name ring a bell?'],
 ['@友達 の @話 に は B1@心当たり が @ある~ありました~ありました','I had an idea what my friend was talking about.'],
 ['@原因 に B1@心当たり が @ある~ありません~ありません','I have no idea what the cause might be.'],
 ['@大切 な @日 に @雨 が @降る~降った~ふった の は B1@不運 でした','It was bad luck that it rained on the important day.'],
 ['@彼 は @自分 の B1@不運 を @笑う~笑いました~わらいました','He laughed at his own bad luck.'],
 ['B1@不運 が @続く~続いても~つづいても @友達 は @希望 を @持つ~持っていました~もっていました','Even through continued bad luck, my friend remained hopeful.'],
]);
lesson('repairing-friendship-account','Repairing a friendship',[],
 '悪口 / 責める / 動揺 / 口実 / 仲直り',
 'Follow two friends as they work through an argument.',[
 ['@友達 の B1@悪口 を @言う~言ってしまいました~いってしまいました','I said something unkind about my friend.'],
 ['@友達 は @それ を @聞く~聞いて~きいて @私 を B1@責める~責めました~せめました','My friend heard it and reproached me.'],
 ['@私 は B1@動揺 @する~して~して @すぐ に は @謝る~謝れませんでした~あやまれませんでした','I was shaken and could not apologize straight away.'],
 ['@後 で B1@口実 を @作る~作った~つくった @こと も @謝る~謝りました~あやまりました','Later, I also apologized for having made excuses.'],
 ['@友達 の @気持ち も @聞く~聞いて~きいて @謝る~謝りました~あやまりました','I listened to my friend’s feelings too and apologized.'],
 ['@私たち は B1@仲直り @する~して~して @また @一緒 に @歩く~歩きました~あるきました','We made up and walked together again.'],
]);
lesson('support-after-disappointment-account','Support after disappointment',[],
 '不運 / 懸命 / 平気 / 頼もしい',
 'Follow a disappointing day and a friend’s response.',[
 ['@大切 な @試合 の @日 に @風邪 で @家 に @いる~いました~いました','I was at home with a cold on the day of an important match.'],
 ['B1@懸命 に @練習 @する~していた~していた から @悲しい~悲しかった~かなしかった です','I was sad because I had been practicing hard.'],
 ['@この B1@不運 に B1@不平 を @言う~言いたくなりました~いいたくなりました','I felt like complaining about this bad luck.'],
 ['@友達 は @私 の @話 を @最後 まで @聞く~聞いてくれました~きいてくれました','My friend listened to me until I had finished.'],
 ['@今 は B1@平気 だ と @友達 に @伝える~伝えました~つたえました','I told my friend I was all right now.'],
 ['@その @友達 を @本当に B1@頼もしい と @思う~思いました~おもいました','I felt that I could really rely on that friend.'],
]);
}
