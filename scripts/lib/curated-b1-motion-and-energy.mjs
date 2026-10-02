export function authorMotionAndEnergy({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@背負う':'to carry on one’s back','B1@腰掛ける':'to sit down on a seat',
 'B1@振り向く':'to turn and look back','B1@這う':'to crawl',
 'B1@またぐ':'to step over; to straddle','B1@近づける':'to bring something closer',
 'B1@勢い':'force; momentum; energy','B1@力強い':'powerful; vigorous',
 'B1@前進':'moving forward; progress','B1@弱まる':'to become weaker',
 'B1@強まる':'to become stronger','B1@弱める':'to make weaker',
 'B1@強める':'to make stronger','B1@慣らす':'to get someone or something accustomed to',
 'B1@長引く':'to be prolonged; to last longer than expected','B1@荒い':'rough; heavy or irregular',
 'B1@不自由':'difficulty; restricted use; inconvenience','B1@補う':'to make up for; to supplement',
 'B1@生き生き':'lively; full of life','B1@ドキドキ':'heart pounding; thumping',
 'B1@張り切る':'to be eager; to be full of enthusiasm',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('safety');
lesson('carrying-sitting-and-looking-back','Carrying, sitting and looking back',['B1@背負う','B1@腰掛ける','B1@振り向く'],
 '背負います / 腰掛けます / 振り向きます',
 '背負う (seou) carries something on the back. 腰掛ける (koshikakeru) sits down on a seat. 振り向く (furimuku) turns the head or body to look behind.',[
 ['@父 は @子供 を B1@背負う~背負っています~せおっています','My father is carrying a child on his back.'],
 ['@軽い @荷物 を B1@背負う~背負って~せおって @歩く~歩きました~あるきました','I walked carrying a light load on my back.'],
 ['B1@背負う~背負っていた~せおっていた @荷物 を @床 に @置く~置きました~おきました','I put down the load I had been carrying on my back.'],
 ['@公園 の @椅子 に B1@腰掛ける~腰掛けました~こしかけました','I sat down on a chair in the park.'],
 ['@ここ に B1@腰掛ける~腰掛けてください~こしかけてください','Please sit down here.'],
 ['@椅子 に B1@腰掛ける~腰掛けて~こしかけて @靴 を @履く~履きました~はきました','I sat on a chair and put on my shoes.'],
 ['@名前 を @呼ぶ~呼ばれて~よばれて B1@振り向く~振り向きました~ふりむきました','I turned around when my name was called.'],
 ['B1@振り向く~振り向いた~ふりむいた @時 @友達 が @見える~見えました~みえました','When I turned around, I saw my friend.'],
 ['@後ろ で @音 が @する~した~した から B1@振り向く~振り向きました~ふりむきました','I turned around because I heard a sound behind me.'],
]);
lesson('crawling-stepping-over-and-bringing-near','Crawling, stepping over and bringing closer',['B1@這う','B1@またぐ','B1@近づける'],
 '這います / またぎます / 近づけます',
 '這う (hau) moves close to the ground by crawling. またぐ steps over something. 近づける (chikazukeru) brings one thing closer to another.',[
 ['@赤ちゃん が @床 を B1@這う~這っています~はっています','The baby is crawling across the floor.'],
 ['@小さい @虫 が @葉 の @上 を B1@這う~這っていました~はっていました','A small insect was crawling across the leaf.'],
 ['B1@這う~這っている~はっている @赤ちゃん を @父 が @見る~見ています~みています','My father is watching the crawling baby.'],
 ['@床 の @荷物 を B1@またぐ~またぎました~またぎました','I stepped over the luggage on the floor.'],
 ['@小さい @川 を B1@またぐ~またいで~またいで @渡る~渡りました~わたりました','I crossed the small stream by stepping over it.'],
 ['@足 を @上げる~上げて~あげて @箱 を B1@またぐ~またぎました~またぎました','I raised my foot and stepped over the box.'],
 ['@椅子 を @机 に B1@近づける~近づけました~ちかづけました','I moved the chair closer to the desk.'],
 ['@本 を @目 に B1@近づける~近づけて~ちかづけて @読む~読みました~よみました','I brought the book closer to my eyes to read it.'],
 ['@手 を @顔 に @ゆっくり B1@近づける~近づけます~ちかづけます','I slowly bring my hand closer to my face.'],
]);
lesson('momentum-strength-and-progress','Momentum, strength and moving forward',['B1@勢い','B1@力強い','B1@前進'],
 '勢い / 力強い / 前進します',
 '勢い (ikioi) is force or momentum. 力強い (chikarazuyoi) describes a powerful movement or voice. 前進 (zenshin) moves forward, physically or through progress.',[
 ['@水 の B1@勢い が @強い です','The water is flowing with considerable force.'],
 ['B1@勢い を @つける~つけて~つけて B1@ボール を @投げる~投げました~なげました','I built up momentum and threw the ball.'],
 ['@最初 の B1@勢い が @なくなる~なくなりました~なくなりました','The initial momentum faded.'],
 ['B1@力強い @声 で @返事 を @する~しました~しました','I answered in a strong voice.'],
 ['@選手 は B1@力強い~力強く~ちからづよく @走る~走っていました~はしっていました','The athlete was running powerfully.'],
 ['@その @人 は B1@力強い @声 で @歌う~歌っていました~うたっていました','That person was singing in a strong voice.'],
 ['@列 は @少し B1@前進 @する~しました~しました','The line moved forward a little.'],
 ['@止まる~止まっていた~とまっていた @人 が B1@前進 @する~しました~しました','The person who had stopped moved forward.'],
 ['@練習 の @結果 @少し B1@前進 @する~した~した と @感じる~感じました~かんじました','After practising, I felt I had made a little progress.'],
]);
lesson('getting-and-making-stronger','Becoming stronger and changing strength',['B1@弱まる','B1@強まる','B1@弱める','B1@強める'],
 '弱まります / 強まります / 弱めます / 強めます',
 '弱まる (yowamaru) and 強まる (tsuyomaru) describe a change in strength. 弱める (yowameru) and 強める (tsuyomeru) describe making something weaker or stronger.',[
 ['@雨 の B1@勢い が B1@弱まる~弱まりました~よわまりました','The force of the rain weakened.'],
 ['@痛み が @少し B1@弱まる~弱まりました~よわまりました','The pain eased a little.'],
 ['@風 が B1@弱まる~弱まった~よわまった @後 で @外 に @出る~出ました~でました','We went outside after the wind weakened.'],
 ['@夕方 に @風 が B1@強まる~強まりました~つよまりました','The wind grew stronger in the evening.'],
 ['@練習 を @続ける~続けたい~つづけたい @気持ち が B1@強まる~強まりました~つよまりました','My desire to keep practising grew stronger.'],
 ['@雨 の B1@勢い が B1@強まる~強まっています~つよまっています','The rain is getting heavier.'],
 ['@押す @力 を B1@弱める~弱めました~よわめました','I reduced the force of my push.'],
 ['@水 の B1@勢い を B1@弱める~弱めました~よわめました','I reduced the force of the water.'],
 ['@力 を B1@弱める~弱めて~よわめて @ゆっくり @動く~動きました~うごきました','I used less force and moved slowly.'],
 ['@少し @押す @力 を B1@強める~強めました~つよめました','I pushed a little harder.'],
 ['@水 の B1@勢い を B1@強める~強めました~つよめました','I increased the force of the water.'],
 ['@押す @力 を B1@強める~強めました~つよめました が @箱 は @動く~動きませんでした~うごきませんでした','I pushed harder, but the box did not move.'],
]);
lesson('getting-used-to-activity-and-lasting-symptoms','Getting accustomed and describing duration',['B1@慣らす','B1@長引く','B1@荒い'],
 '慣らします / 長引きます / 荒い',
 '慣らす (narasu) gets someone or something accustomed to new conditions. 長引く (nagabiku) lasts longer than expected. 荒い (arai) describes rough behaviour or heavy, irregular breathing here.',[
 ['@新しい @靴 に @足 を B1@慣らす~慣らしています~ならしています','I am getting my feet used to the new shoes.'],
 ['@体 を @だんだん @運動 に B1@慣らす~慣らしました~ならしました','I gradually got my body used to exercise.'],
 ['@少し @練習 @する~して~して @手 を B1@慣らす~慣らしました~ならしました','I practised a little to get my hands used to it.'],
 ['@風邪 が B1@長引く~長引いています~ながびいています','My cold is lingering.'],
 ['@練習 が B1@長引く~長引いた~ながびいた から @帰る @時間 が @遅い~遅く~おそく @なる~なりました~なりました','Practice ran long, so I got home later.'],
 ['@痛み が B1@長引く~長引いた~ながびいた から @医者 に @相談 @する~しました~しました','I consulted a doctor because the pain persisted.'],
 ['@走る~走った~はしった @後 は B1@息 が B1@荒い です','My breathing is heavy after running.'],
 ['@その @人 の @言葉 は B1@荒い です','That person’s language is rough.'],
 ['B1@荒い @運転 が @怖い です','Rough driving frightens me.'],
]);
lesson('limitations-and-making-up-a-shortfall','Difficulty and making up a shortfall',['B1@不自由','B1@補う'],
 '不自由 / 補います',
 '不自由 (fujiyū) describes difficulty or restricted use. 補う (oginau) supplies something that is lacking or makes up for a shortfall.',[
 ['@怪我 を @する~して~して @手 が B1@不自由 です','I have difficulty using my hand because of an injury.'],
 ['@この @道具 で @生活 の B1@不自由 が @少ない~少なく~すくなく @なる~なりました~なりました','This tool reduced the difficulties in my daily life.'],
 ['@友達 が @手伝う~手伝って~てつだって @くれる~くれた~くれた から @あまり B1@不自由 を @感じる~感じませんでした~かんじませんでした','I did not feel much inconvenience because my friend helped me.'],
 ['@不足 @する~している~している @部分 を B1@補う~補います~おぎないます','We make up for the part that is lacking.'],
 ['@足りる~足りない~たりない @力 を @道具 で B1@補う~補いました~おぎないました','I used a tool to make up for insufficient strength.'],
 ['@足りる~足りない~たりない B1@体力 を @技術 で B1@補う~補いました~おぎないました','I made up for my lack of physical strength with skill.'],
]);
lesson('lively-eager-and-heart-pounding','Lively, eager and heart pounding',['B1@生き生き','B1@ドキドキ','B1@張り切る'],
 '生き生き / ドキドキ / 張り切ります',
 '生き生き (ikiiki) looks or feels full of life. ドキドキ describes a pounding heart, including excitement or nervousness. 張り切る (harikiru) approaches something with eagerness and energy.',[
 ['@子供 は B1@生き生き と @遊ぶ~遊んでいます~あそんでいます','The children are playing with lively energy.'],
 ['@好き な @運動 を @する @時 @彼 は B1@生き生き と @する~しています~しています','He is full of life when doing the exercise he enjoys.'],
 ['@友達 は B1@生き生き と @話す~話しました~はなしました','My friend spoke animatedly.'],
 ['@試合 の @前 は @胸 が B1@ドキドキ @する~します~します','My heart pounds before a match.'],
 ['@名前 を @呼ぶ~呼ばれた~よばれた @時 B1@ドキドキ @する~しました~しました','My heart pounded when my name was called.'],
 ['B1@ドキドキ @する~しながら~しながら @結果 を @待つ~待ちました~まちました','I waited for the result with my heart pounding.'],
 ['@今日 は B1@張り切る~張り切って~はりきって @練習 @する~しています~しています','I am practising enthusiastically today.'],
 ['B1@張り切る~張り切って~はりきって @早い~早く~はやく @家 を @出る~出ました~でました','Full of enthusiasm, I left home early.'],
 ['@友達 も B1@張り切る~張り切って~はりきって @練習 に @来る~来ました~きました','My friend also came to practice full of enthusiasm.'],
]);
lesson('first-day-of-practice-account','A first day of practice',[],
 '張り切る / 背負う / 腰掛ける / 慣らす / ドキドキ / 前進',
 'Follow someone through a first practice session.',[
 ['@初めて の @練習 だ から B1@張り切る~張り切っていました~はりきっていました','It was my first practice session, so I was full of enthusiasm.'],
 ['@荷物 を B1@背負う~背負って~せおって @早い~早く~はやく @出る~出ました~でました','I put my load on my back and left early.'],
 ['@会場 で @椅子 に B1@腰掛ける~腰掛けて~こしかけて @靴 を @履く~履きました~はきました','At the venue, I sat on a chair and put on my shoes.'],
 ['@だんだん @体 を @運動 に B1@慣らす~慣らしました~ならしました','I gradually got my body used to the exercise.'],
 ['@最初 は B1@ドキドキ @する~しました~しました が @友達 と @話す~話して~はなして @安心 @する~しました~しました','At first my heart pounded, but talking with my friend reassured me.'],
 ['@練習 の @後 で @少し B1@前進 @する~した~した と @思う~思いました~おもいました','After practice, I thought I had made a little progress.'],
]);
lesson('coming-home-after-practice-account','Coming home after practice',[],
 '長引く / 荒い / 弱まる / 背負う / 振り向く / 力強い',
 'Follow the end of a practice session and the journey home.',[
 ['@練習 が B1@長引く~長引いて~ながびいて @外 は @もう @暗い~暗かった~くらかった です','Practice ran long, and it was already dark outside.'],
 ['@走る~走った~はしった @後 で @まだ B1@息 が B1@荒い~荒かった~あらかった です','My breathing was still heavy after running.'],
 ['@椅子 に B1@腰掛ける~腰掛けて~こしかけて @少し @休む~休みました~やすみました','I sat down on a chair and rested for a while.'],
 ['@雨 の B1@勢い が B1@弱まる~弱まった~よわまった @後 で @荷物 を B1@背負う~背負いました~せおいました','After the rain eased, I put my load on my back.'],
 ['@友達 に @名前 を @呼ぶ~呼ばれて~よばれて B1@振り向く~振り向きました~ふりむきました','I turned around when my friend called my name.'],
 ['B1@力強い @声 で @返事 を @する~して~して @一緒 に @帰る~帰りました~かえりました','I answered in a strong voice, and we went home together.'],
]);
}
