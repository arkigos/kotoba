export function authorStoriesBeliefs({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@架空':'fictional; imaginary','B1@神話':'myth; mythology',
 'B1@王様':'king','B1@女王':'queen','B1@侍':'samurai',
 'B1@刀':'sword; katana','B1@盾':'shield','B1@矢':'arrow',
 'B1@宝':'treasure; something precious','B1@宝石':'gemstone; jewel','B1@英雄':'hero; heroine',
 'B1@現れる':'to appear; to come into view','B1@去る':'to leave; to go away',
 'B1@恐れる':'to fear','B1@失う':'to lose','B1@正体':'true identity; true nature',
 'B1@争う':'to compete; to dispute; to fight over','B1@闇':'darkness',
 'B1@天':'sky; heaven','B1@魂':'soul; spirit','B1@地獄':'hell',
 'B1@信仰':'religious faith; belief','B1@僧':'monk; Buddhist priest',
 'B1@哲学':'philosophy','B1@善':'good; goodness; virtue','B1@道徳':'morality; morals',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('reading');
lesson('imaginary-kingdoms','Imaginary places and rulers',['B1@架空','B1@神話','B1@王様','B1@女王'],
 '架空の / 神話 / 王様 / 女王','架空の describes something invented. 神話 is a traditional myth, often involving gods or the origins of things. 王様 and 女王 name a king and a queen.',[
 ['@この @物語 の @国 は B1@架空 の @国 です','The country in this story is imaginary.'],
 ['B1@架空 の @町 の @地図 を @描く~描きました~かきました','I drew a map of an imaginary town.'],
 ['B1@作者 は B1@架空 の @人物 を @作る~作りました~つくりました','The author created a fictional character.'],
 ['@古い B1@神話 を @読む~読みました~よみました','I read an old myth.'],
 ['@この B1@神話 に は @神 が @出る~出てきます~でてきます','A god appears in this myth.'],
 ['@二つ の @国 の B1@神話 を @比べる~比べました~くらべました','I compared myths from two countries.'],
 ['@物語 の B1@王様 は @年 を @取る~取っています~とっています','The king in the story is elderly.'],
 ['B1@王様 が @町 の @人 の @話 を @聞く~聞きました~ききました','The king listened to the townspeople.'],
 ['@絵 の @中 に B1@王様 が @いる~います~います','There is a king in the picture.'],
 ['B1@女王 は @大きい @城 に @住む~住んでいます~すんでいます','The queen lives in a large castle.'],
 ['@物語 の B1@女王 が @手紙 を @書く~書きました~かきました','The queen in the story wrote a letter.'],
 ['B1@作者 は B1@女王 の @生活 を @描く~描いています~えがいています','The author portrays the queen’s life.'],
]);
lesson('samurai-and-old-weapons','Samurai and objects in historical stories',['B1@侍','B1@刀','B1@盾','B1@矢'],
 '侍 / 刀 / 盾 / 矢','侍 is a samurai. 刀 here is a sword; 盾 is a shield, and 矢 an arrow. The objects below appear in different pictures and stories.',[
 ['@この @物語 の B1@主人公 は B1@侍 です','The main character of this story is a samurai.'],
 ['B1@侍 が @町 を @歩く~歩いています~あるいています','A samurai is walking through the town.'],
 ['@昔 の B1@侍 の @生活 について @読む~読みました~よみました','I read about the lives of samurai in the past.'],
 ['@博物館 で @古い B1@刀 を @見る~見ました~みました','I saw an old sword at a museum.'],
 ['@この B1@刀 は @重い です','This sword is heavy.'],
 ['@本 に B1@刀 の @絵 が @ある~あります~あります','There is a picture of a sword in the book.'],
 ['@絵 の @人 は B1@盾 を @持つ~持っています~もっています','The person in the picture is holding a shield.'],
 ['B1@盾 の @形 を @ノート に @描く~描きました~かきました','I drew the shield’s shape in my notebook.'],
 ['@二つ の B1@盾 の @色 は @違う~違います~ちがいます','The two shields are different colors.'],
 ['@絵 の @中 で B1@矢 が @飛ぶ~飛んでいます~とんでいます','An arrow is flying in the picture.'],
 ['B1@矢 が @木 に @当たる~当たりました~あたりました','The arrow hit a tree.'],
 ['@古い B1@矢 を @博物館 で @見る~見ました~みました','I saw an old arrow at a museum.'],
]);
lesson('treasure-and-heroes','Treasure, jewels and heroes',['B1@宝','B1@宝石','B1@英雄'],
 '宝 / 宝石 / 英雄','宝 is treasure and can also mean something deeply valued. 宝石 specifically names a gemstone or jewel. 英雄 is a person admired for exceptional deeds.',[
 ['@物語 の @子供 が B1@宝 を @探す~探しています~さがしています','The child in the story is looking for treasure.'],
 ['@箱 の @中 に B1@宝 が @ある~ありました~ありました','There was treasure in the box.'],
 ['@この @写真 は @私 の B1@宝 です','This photograph is a treasure to me.'],
 ['@青い B1@宝石 が @光る~光っています~ひかっています','The blue jewel is shining.'],
 ['@小さい B1@宝石 の @指輪 を @見る~見ました~みました','I saw a ring with a small gemstone.'],
 ['@店 で @二つ の B1@宝石 を @比べる~比べました~くらべました','I compared two gemstones at the shop.'],
 ['@この @本 は B1@英雄 の @物語 です','This book tells the story of a hero.'],
 ['@町 の @人 は @彼 を B1@英雄 と @呼ぶ~呼びました~よびました','The townspeople called him a hero.'],
 ['B1@英雄 も @時々 @失敗 @する~します~します','Even heroes sometimes make mistakes.'],
]);
lesson('treasure-story-account','A story about a treasured gift',[],
 '架空 / 女王 / 宝石 / 宝','Follow the gift from the queen to the child.',[
 ['B1@架空 の @国 に @優しい B1@女王 が @いる~いました~いました','In an imaginary country, there was a kind queen.'],
 ['@春 の @朝 @子供 が B1@女王 に @手紙 を @書く~書きました~かきました','One spring morning, a child wrote a letter to the queen.'],
 ['@手紙 に は @町 を @守る~守った~まもった B1@英雄 の @話 が @ある~ありました~ありました','The letter told of a hero who had protected the town.'],
 ['B1@女王 は @子供 に @小さい @箱 を @送る~送りました~おくりました','The queen sent the child a small box.'],
 ['@箱 の @中 に は @青い B1@宝石 が @ある~ありました~ありました','Inside the box was a blue jewel.'],
 ['@子供 は B1@女王 に @お礼 の @手紙 を @書く~書きました~かきました','The child wrote a thank-you letter to the queen.'],
 ['B1@女王 から の B1@宝石 は @子供 の B1@宝 に @なる~なりました~なりました','The jewel from the queen became the child’s treasure.'],
]);
lesson('appearing-leaving-fearing','Appearing, leaving and fearing',['B1@現れる','B1@去る','B1@恐れる'],
 '現れます / 去ります / 恐れます','現れる comes into view or becomes apparent. 去る means leaving; it can also describe a season or time passing. 恐れる expresses fear, including fear of something that might happen.',[
 ['@森 から @人 が B1@現れる~現れました~あらわれました','A person appeared from the forest.'],
 ['@月 が @雲 の @間 から B1@現れる~現れました~あらわれました','The moon appeared from between the clouds.'],
 ['@物語 の @最後 に B1@王様 が B1@現れる~現れます~あらわれます','The king appears at the end of the story.'],
 ['@彼 は @朝 @町 を B1@去る~去りました~さりました','He left the town in the morning.'],
 ['B1@侍 は @一人 で @村 を B1@去る~去りました~さりました','The samurai left the village alone.'],
 ['@冬 が B1@去る~去って~さって @春 が @来る~来ました~きました','Winter passed, and spring came.'],
 ['@子供 は @暗い @森 を B1@恐れる~恐れています~おそれています','The child is afraid of the dark forest.'],
 ['@失敗 を B1@恐れる~恐れないで~おそれないで ください','Please do not be afraid of failure.'],
 ['@物語 の B1@王様 は @何 を B1@恐れる~恐れています~おそれています か','What is the king in the story afraid of?'],
]);
lesson('identity-loss-and-conflict','Identity, loss and conflict',['B1@失う','B1@正体','B1@争う'],
 '失います / 正体 / 争います','失う can describe losing a possession, a chance or something less tangible. 正体 is a hidden or true identity. 争う can mean competing, disputing or fighting over something.',[
 ['B1@主人公 は @大切 な @物 を B1@失う~失いました~うしないました','The main character lost something important.'],
 ['@彼 は @仕事 を B1@失う~失いました~うしないました','He lost his job.'],
 ['@機会 を B1@失う~失わない~うしなわない ように @早い~早く~はやく @答える~答えました~こたえました','I replied quickly so I would not lose the opportunity.'],
 ['@物語 の @最後 に @男 の B1@正体 が @わかる~わかりました~わかりました','At the end of the story, the man’s true identity became clear.'],
 ['@誰 も @彼 の B1@正体 を @知る~知りません~しりません','Nobody knows his true identity.'],
 ['@その @音 の B1@正体 を @調べる~調べました~しらべました','I investigated what was really making that sound.'],
 ['@二人 は B1@宝 を B1@争う~争いました~あらそいました','The two people fought over the treasure.'],
 ['@二つ の @チーム が @優勝 を B1@争う~争っています~あらそっています','The two teams are competing for the championship.'],
 ['@小さい @こと で B1@争う~争わないで~あらそわないで ください','Please do not quarrel over small things.'],
]);
lesson('stranger-at-the-gate-account','A stranger at the town gate',[],
 '現れる / 恐れる / 正体 / 去る','Follow the stranger’s arrival and the discovery of his identity.',[
 ['@夜 @町 の @門 に @一人 の @男 が B1@現れる~現れました~あらわれました','One night, a man appeared at the town gate.'],
 ['@町 の @人 は @男 を B1@恐れる~恐れていました~おそれていました','The townspeople were afraid of the man.'],
 ['@男 は @古い @手紙 を @見せる~見せました~みせました','The man showed an old letter.'],
 ['@手紙 を @読む~読んだ~よんだ @人 は @男 の B1@正体 を @知る~知りました~しりました','Someone who read the letter learned the man’s true identity.'],
 ['@男 は @町 を @守る~守った~まもった B1@英雄 でした','The man was the hero who had protected the town.'],
 ['@男 は B1@失う~失った~うしなった B1@宝 を @探す~探していました~さがしていました','The man was searching for the treasure he had lost.'],
 ['@朝 @男 は @町 を B1@去る~去りました~さりました','In the morning, the man left the town.'],
]);
lesson('darkness-heaven-spirit','Darkness, heaven and the soul',['B1@闇','B1@天','B1@魂'],
 '闇 / 天 / 魂','闇 is darkness. 天 can mean the sky or heaven, depending on context. 魂 names a soul or spirit; stories and beliefs describe it in different ways.',[
 ['@森 は B1@闇 に @包む~包まれています~つつまれています','The forest is wrapped in darkness.'],
 ['B1@闇 の @中 で @小さい @光 が @見える~見えました~みえました','A small light was visible in the darkness.'],
 ['@物語 は B1@闇 の @中 から @始まる~始まります~はじまります','The story begins in darkness.'],
 ['@鳥 が B1@天 @高い~高く~たかく @飛ぶ~飛んでいます~とんでいます','A bird is flying high in the sky.'],
 ['@物語 の @神 は B1@天 に @いる~います~います','The god in the story is in heaven.'],
 ['@絵 の @人物 は B1@天 を @見る~見ています~みています','The person in the painting is looking toward heaven.'],
 ['@この B1@神話 は B1@魂 の @旅 の @話 です','This myth tells of a soul’s journey.'],
 ['B1@魂 について の @考え を @比べる~比べました~くらべました','I compared ideas about the soul.'],
 ['B1@詩 の @中 で B1@魂 が @光 に @なる~なります~なります','In the poem, the soul becomes light.'],
]);
lesson('faith-and-religious-stories','Faith and religious stories',['B1@地獄','B1@信仰','B1@僧'],
 '地獄 / 信仰 / 僧','地獄 means hell in religious stories, and can also describe terrible suffering figuratively. 信仰 is religious faith. 僧 here names a Buddhist monk or priest.',[
 ['@古い @絵 に B1@地獄 が @描く~描かれています~えがかれています','Hell is depicted in the old painting.'],
 ['@本 で B1@地獄 の @物語 を @読む~読みました~よみました','I read a story about hell in a book.'],
 ['B1@作者 は B1@地獄 の @暗い @景色 を @描く~描いています~えがいています','The author portrays the dark scenery of hell.'],
 ['@人 の B1@信仰 について @話 を @聞く~聞きました~ききました','I listened to someone talk about their faith.'],
 ['@この @本 は @地域 の B1@信仰 について @書く~書かれています~かかれています','This book is about the region’s religious beliefs.'],
 ['@彼女 は B1@信仰 を @大切 に @する~しています~しています','Her faith is important to her.'],
 ['@寺 で B1@僧 の @話 を @聞く~聞きました~ききました','I listened to a monk speak at the temple.'],
 ['@物語 の B1@僧 は @山 に @住む~住んでいます~すんでいます','The monk in the story lives in the mountains.'],
 ['B1@僧 が @古い @本 を @読む~読んでいます~よんでいます','A monk is reading an old book.'],
]);
lesson('reading-a-religious-tale-account','Reading a religious tale',[],
 '僧 / 魂 / 天 / 地獄 / 信仰','Distinguish what the tale describes from the reader’s questions about it.',[
 ['@寺 の B1@僧 が @古い @物語 を @紹介 @する~しました~しました','A monk at the temple introduced an old tale.'],
 ['@その @物語 は B1@魂 の @旅 を @描く~描いています~えがいています','The tale describes a soul’s journey.'],
 ['@本 の @絵 に は B1@天 と B1@地獄 が @描く~描かれていました~えがかれていました','The book’s illustrations showed heaven and hell.'],
 ['@私 は B1@魂 について @質問 @する~しました~しました','I asked about the soul.'],
 ['B1@僧 は @物語 と B1@信仰 の @関係 を @説明 @する~しました~しました','The monk explained the relationship between the tale and religious belief.'],
]);
lesson('philosophy-and-goodness','Philosophy, goodness and morality',['B1@哲学','B1@善','B1@道徳'],
 '哲学 / 善 / 道徳','哲学 examines fundamental questions about knowledge, existence and values. 善 is goodness or what is right; 道徳 concerns moral conduct and judgments.',[
 ['@大学 で B1@哲学 を @勉強 @する~しています~しています','I study philosophy at university.'],
 ['B1@哲学 の @本 を @友人 と @読む~読みました~よみました','I read a philosophy book with a friend.'],
 ['@この @問題 は B1@哲学 に @関係 が @ある~あります~あります','This question concerns philosophy.'],
 ['B1@善 と @悪 について @話す~話しました~はなしました','We talked about good and evil.'],
 ['B1@作者 の B1@善 について の @考え を @調べる~調べました~しらべました','I examined the author’s idea of goodness.'],
 ['@この @物語 で は B1@善 を @行う の は @難しい です','In this story, doing good is difficult.'],
 ['@学校 で B1@道徳 について @考える~考えました~かんがえました','We thought about morality at school.'],
 ['@二つ の @時代 の B1@道徳 を @比べる~比べました~くらべました','I compared the moral values of two periods.'],
 ['B1@道徳 の @問題 について @自分 の @意見 を @書く~書きました~かきました','I wrote my opinion on a moral issue.'],
]);
lesson('discussing-a-story-account','Discussing a story in class',[],
 '哲学 / 善 / 道徳 / 英雄','Follow the questions that arise from the story.',[
 ['@授業 で B1@英雄 の @物語 を @読む~読みました~よみました','We read a story about a hero in class.'],
 ['@先生 は B1@善 と @悪 について @質問 @する~しました~しました','The teacher asked about good and evil.'],
 ['@学生 は @物語 の B1@道徳 の @問題 を @考える~考えました~かんがえました','The students considered the moral issues in the story.'],
 ['@私 は B1@英雄 の @失敗 について @意見 を @言う~言いました~いいました','I gave my opinion about the hero’s mistake.'],
 ['@友人 は @違う @意見 を @持つ~持っていました~もっていました','My friend had a different opinion.'],
 ['@先生 は @最後 に B1@哲学 の @本 を @紹介 @する~しました~しました','At the end, the teacher introduced a philosophy book.'],
]);
}
