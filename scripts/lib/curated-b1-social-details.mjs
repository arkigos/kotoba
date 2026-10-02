export function authorSocialDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@賢い':'wise; clever','B1@利口':'clever; sensible','B1@おとなしい':'quiet; gentle; well-behaved',
 'B1@ハンサム':'handsome','B1@若々しい':'youthful; young-looking',
 'B1@お辞儀':'bow; bowing','B1@わざわざ':'going out of one’s way; taking the trouble',
 'B1@少々':'a little; a short while','B1@一人一人':'each person; one by one','B1@めいめい':'each; individually',
 'B1@のんき':'easygoing; carefree','B1@そそっかしい':'careless; hasty',
 'B1@滅多に':'rarely; seldom (with a negative predicate)',
 'B1@にっこり':'with a warm or broad smile','B1@微笑む':'to smile','B1@にらむ':'to glare at',
 'B1@いらいら':'irritation; becoming annoyed','B1@ためらう':'to hesitate',
 'B1@意地悪':'mean; unkind','B1@からかう':'to tease; to make fun of',
 'B1@甘やかす':'to spoil; to pamper','B1@威張る':'to act arrogantly; to throw one’s weight around',
 'B1@図々しい':'shameless; presumptuous','B1@厚かましい':'presumptuous; shameless',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('relationships');
lesson('clever-and-quiet','Clever and quiet',['B1@賢い','B1@利口','B1@おとなしい'],
 '賢い / 利口な / おとなしい','賢い and 利口 can both describe intelligence or good sense. おとなしい describes quiet or gentle behavior; it does not necessarily mean shy.',[
 ['@彼女 は B1@賢い @人 です','She is a wise person.'],
 ['B1@賢い @選択 を @する~しました~しました','I made a wise choice.'],
 ['@この @犬 は B1@賢い です','This dog is clever.'],
 ['@弟 は @子供 の @時 から B1@利口 でした','My younger brother was bright even as a child.'],
 ['@これ は B1@利口 な @選択 です','This is a sensible choice.'],
 ['B1@利口 な @犬 が @ドア を @開ける~開けました~あけました','A clever dog opened the door.'],
 ['@この @猫 は B1@おとなしい です','This cat is gentle.'],
 ['@普段 は B1@おとなしい @友達 が @大きい @声 で @笑う~笑いました~わらいました','My usually quiet friend laughed loudly.'],
 ['@子供 は @部屋 で B1@おとなしい~おとなしく~おとなしく @本 を @読む~読んでいます~よんでいます','The child is quietly reading a book in the room.'],
]);
lesson('appearance-and-vitality','Appearance and a youthful impression',['B1@ハンサム','B1@若々しい'],
 'ハンサムな / 若々しい','ハンサム describes a handsome appearance. 若々しい describes a youthful impression, which can come from someone’s looks, voice or behavior.',[
 ['@写真 の @人 は B1@ハンサム です','The person in the photograph is handsome.'],
 ['B1@ハンサム な @友人 が @結婚 @する~しました~しました','My handsome friend got married.'],
 ['@彼 は @若い @時 も B1@ハンサム でした','He was handsome when he was young, too.'],
 ['@祖母 の @声 は B1@若々しい です','My grandmother’s voice sounds youthful.'],
 ['@彼 は @年齢 より B1@若々しい~若々しく~わかわかしく @見える~見えます~みえます','He looks younger than his age.'],
 ['B1@若々しい @祖父 と @公園 を @歩く~歩きました~あるきました','I walked through the park with my youthful grandfather.'],
]);
lesson('family-photograph-account','Looking through family photographs',[],
 '若々しい / ハンサム / おとなしい','Compare the people in the photographs with how they are now.',[
 ['@祖母 と @古い @写真 を @見る~見ました~みました','I looked at old photographs with my grandmother.'],
 ['@若い @時 の @祖父 は B1@ハンサム でした','My grandfather was handsome when he was young.'],
 ['@祖母 は @今 も B1@若々しい です','My grandmother is still youthful.'],
 ['@写真 の @中 の @弟 は B1@おとなしい @子供 でした','My younger brother in the photograph was a quiet child.'],
 ['@祖母 は @弟 の B1@賢い @選択 について @話す~話しました~はなしました','My grandmother talked about my younger brother’s wise choice.'],
]);
useTopic('visits');
lesson('welcoming-with-care','Welcoming a visitor',['B1@お辞儀','B1@わざわざ','B1@少々'],
 'お辞儀します / わざわざ / 少々','お辞儀する means bowing. わざわざ acknowledges an extra effort. 少々 is a slightly formal way to say a little or a short while.',[
 ['@入り口 で @お客さん に B1@お辞儀 を @する~しました~しました','I bowed to the visitor at the entrance.'],
 ['@二人 は B1@お辞儀 を @する~して~して @挨拶 @する~しました~しました','The two people bowed and greeted each other.'],
 ['@帰る @前 に @もう一度 B1@お辞儀 を @する~しました~しました','I bowed once more before leaving.'],
 ['B1@わざわざ @家 まで @来る~来て~きて @くれる~くれました~くれました','They went out of their way to come to my home.'],
 ['@友達 が B1@わざわざ @電話 で @予定 を @教える~教えて~おしえて @くれる~くれました~くれました','My friend took the trouble to phone and tell me the plans.'],
 ['B1@わざわざ @来る~来て~きて @くれる~くれて~くれて @ありがとう','Thank you for coming all this way.'],
 ['B1@少々 @待つ~待って~まって ください','Please wait a moment.'],
 ['@お茶 に B1@少々 @砂糖 を @入れる~入れました~いれました','I put a little sugar in the tea.'],
 ['@お茶 は @まだ B1@少々 @熱い です','The tea is still a little hot.'],
]);
lesson('each-visitor','Each person in the group',['B1@一人一人','B1@めいめい'],
 '一人一人 / めいめい','一人一人 draws attention to each person. めいめい describes people acting individually or each having their own share; it does not require a particular order.',[
 ['@お客さん B1@一人一人 に @挨拶 @する~しました~しました','I greeted each visitor.'],
 ['B1@一人一人 の @名前 を @確認 @する~しました~しました','I checked each person’s name.'],
 ['@先生 は B1@一人一人 の @話 を @聞く~聞きました~ききました','The teacher listened to each person’s story.'],
 ['B1@めいめい が @好き な @席 に @座る~座りました~すわりました','Everyone sat in a seat of their own choosing.'],
 ['B1@めいめい の @お茶 を @テーブル に @置く~置きました~おきました','I put each person’s tea on the table.'],
 ['@食事 の @後 B1@めいめい が @自分 の @皿 を @洗う~洗いました~あらいました','After the meal, everyone washed their own plate.'],
]);
lesson('small-gathering-account','A small gathering at home',[],
 'わざわざ / 一人一人 / めいめい','Follow the welcome, the wait and the meal.',[
 ['@友達 が B1@わざわざ @遠い @町 から @来る~来ました~きました','My friends came all the way from a distant town.'],
 ['@玄関 で B1@一人一人 に @挨拶 @する~しました~しました','I greeted each person at the front door.'],
 ['@料理 は @まだ です から B1@少々 @待つ~待って~まって ください','The food is not ready yet, so please wait a moment.'],
 ['B1@めいめい が @好き な @料理 を @選ぶ~選びました~えらびました','Everyone chose the dishes they liked.'],
 ['@帰る @時 に @皆さん が B1@お辞儀 を @する~しました~しました','Everyone bowed as they left.'],
]);
useTopic('feelings');
lesson('temperament-and-frequency','Temperament and habits',['B1@のんき','B1@そそっかしい','B1@滅多に'],
 'のんきな / そそっかしい / 滅多に…ない','のんき can be approving or critical, depending on the situation. そそっかしい suggests hasty mistakes. 滅多に normally pairs with a negative ending to mean rarely.',[
 ['@兄 は B1@のんき な @人 です','My older brother is easygoing.'],
 ['@明日 は @試験 です が @弟 は B1@のんき に @歌う~歌っています~うたっています','My younger brother is singing carefree, although his exam is tomorrow.'],
 ['@休み の @日 は B1@のんき に @本 を @読む~読みました~よみました','On my day off, I read without a care.'],
 ['@私 は B1@そそっかしい です','I tend to be careless.'],
 ['B1@そそっかしい @弟 が @違う @電車 に @乗る~乗りました~のりました','My hasty younger brother got on the wrong train.'],
 ['@今日 の @私 は @いつも より B1@そそっかしい です','I am more careless than usual today.'],
 ['@彼女 は B1@滅多に @怒る~怒りません~おこりません','She rarely gets angry.'],
 ['@最近 は @友達 と B1@滅多に @会う~会いません~あいません','I rarely see my friends these days.'],
 ['@この @店 は B1@滅多に @休む~休みません~やすみません','This shop rarely closes for a day off.'],
]);
lesson('smiles-and-glances','Smiles and unfriendly looks',['B1@にっこり','B1@微笑む','B1@にらむ'],
 'にっこり笑います / 微笑みます / 人をにらみます','にっこり describes a warm or broad smile. 微笑む is to smile. にらむ here describes a hostile look, with を marking the person looked at.',[
 ['@友達 が B1@にっこり @笑う~笑いました~わらいました','My friend gave a warm smile.'],
 ['@子供 は @お母さん を @見る~見て~みて B1@にっこり @する~しました~しました','The child smiled warmly on seeing their mother.'],
 ['@店 の @人 が B1@にっこり @笑う~笑って~わらって @挨拶 @する~しました~しました','The person at the shop greeted me with a smile.'],
 ['@祖母 が @静か に B1@微笑む~微笑みました~ほほえみました','My grandmother smiled quietly.'],
 ['@赤ちゃん の @顔 を @見る~見て~みて B1@微笑む~微笑みました~ほほえみました','I smiled when I saw the baby’s face.'],
 ['@写真 の @中 で @母 は B1@微笑む~微笑んでいます~ほほえんでいます','My mother is smiling in the photograph.'],
 ['@彼 は @私 を B1@にらむ~にらみました~にらみました','He glared at me.'],
 ['@怒る~怒った~おこった @客 が @店 の @人 を B1@にらむ~にらんでいます~にらんでいます','An angry customer is glaring at the person working in the shop.'],
 ['@そんな に B1@にらむ~にらまないで~にらまないで ください','Please do not glare at me like that.'],
]);
lesson('irritation-and-hesitation','Irritation and hesitation',['B1@いらいら','B1@ためらう'],
 'いらいらします / ためらいます','いらいらする describes irritation or impatience. ためらう is pausing because of uncertainty or reluctance, even when the next action is possible.',[
 ['@長い @時間 @待つ~待って~まって B1@いらいら @する~しました~しました','I grew impatient after waiting a long time.'],
 ['@仕事 が @進む~進みません~すすみません 。 B1@いらいら @する~しています~しています','My work is not moving forward. I am getting irritated.'],
 ['B1@いらいら @する~している~している @時 は @少し @休む~休みます~やすみます','When I feel irritated, I take a short break.'],
 ['@質問 @する @前 に @少し B1@ためらう~ためらいました~ためらいました','I hesitated a little before asking a question.'],
 ['@彼 は @部屋 に @入る の を B1@ためらう~ためらっています~ためらっています','He is hesitating to enter the room.'],
 ['@私 は B1@ためらう~ためらいました~ためらいました が @答える~答えました~こたえました','I hesitated, but answered.'],
]);
lesson('how-we-treat-others','How people treat others',['B1@意地悪','B1@からかう','B1@甘やかす','B1@威張る'],
 '意地悪な / からかいます / 甘やかします / 威張ります','意地悪 is unkindness. からかう ranges from playful teasing to hurtful mockery. 甘やかす suggests excessive indulgence. 威張る is acting as though one is more important than others.',[
 ['@友達 に B1@意地悪 を @する~しないで~しないで ください','Please do not be mean to your friend.'],
 ['@彼 の @言葉 は B1@意地悪 でした','His words were unkind.'],
 ['B1@意地悪 な @質問 に @困る~困りました~こまりました','I was troubled by a mean-spirited question.'],
 ['@子供 が @弟 を B1@からかう~からかいました~からかいました','A child teased my younger brother.'],
 ['@人 の @名前 を B1@からかう~からかわないで~からかわないで ください','Please do not make fun of people’s names.'],
 ['@友達 は @私 を B1@からかう~からかった~からかった @後 で @謝る~謝りました~あやまりました','My friend apologized after teasing me.'],
 ['@子供 を B1@甘やかす~甘やかしました~あまやかしました','I spoiled the child.'],
 ['@弟 を B1@甘やかす~甘やかして~あまやかして @お菓子 を @上げる~あげました~あげました','I indulged my younger brother and gave him sweets.'],
 ['B1@甘やかす @こと と @優しい @こと は @違う~違います~ちがいます','Indulging someone and being kind are different things.'],
 ['@彼 は @弟 の @前 で B1@威張る~威張っています~いばっています','He acts important in front of his younger brother.'],
 ['@そんな に B1@威張る~威張らないで~いばらないで ください','Please do not act so arrogantly.'],
 ['B1@威張る~威張っている~いばっている @人 と は @話す~話したくない~はなしたくない です','I do not want to talk to someone who is acting arrogant.'],
]);
lesson('presumptuous-requests','Presumptuous requests',['B1@図々しい','B1@厚かましい'],
 '図々しい / 厚かましい','Both words criticize a lack of consideration or shame. 厚かましいお願いですが can soften the opening of a large request. It acknowledges the imposition rather than removing it.',[
 ['@人 の @お菓子 を @全部 @食べる の は B1@図々しい です','Eating all of someone else’s sweets is shameless.'],
 ['@彼 の B1@態度 は B1@図々しい と @思う~思いました~おもいました','I thought his attitude was presumptuous.'],
 ['B1@図々しい @要求 に @驚く~驚きました~おどろきました','I was surprised by the presumptuous demand.'],
 ['B1@厚かましい @お願い です が @駅 まで @車 で @送る~送って~おくって ください','It is a lot to ask, but please drive me to the station.'],
 ['@いつも @無料 で @頼む の は B1@厚かましい です','It is presumptuous to always ask for it for free.'],
 ['B1@厚かましい @人 だ と @思う~思われたくない~おもわれたくない です','I do not want to be seen as a shameless person.'],
]);
lesson('resolving-a-hurtful-joke-account','After a hurtful joke',[],
 'からかう / にらむ / 微笑む','Notice how each person responds before and after the apology.',[
 ['@友達 が @私 の @名前 を B1@からかう~からかいました~からかいました','My friend made fun of my name.'],
 ['@私 は B1@いらいら @する~して~して @友達 を B1@にらむ~にらみました~にらみました','I became annoyed and glared at my friend.'],
 ['@友達 は B1@意地悪 な @言葉 について @謝る~謝りました~あやまりました','My friend apologized for the unkind words.'],
 ['@私 は @少し B1@ためらう~ためらいました~ためらいました が @また @話す~話しました~はなしました','I hesitated a little, but then spoke again.'],
 ['@最後 に は @二人 が B1@微笑む~微笑みました~ほほえみました','By the end, we were both smiling.'],
]);
lesson('a-difficult-request-account','Making a difficult request',[],
 'ためらう / 厚かましい / にっこり','Follow the request and the friend’s response.',[
 ['@私 は @普段 @友達 に B1@滅多に @頼む~頼みません~たのみません','I rarely ask friends for favors.'],
 ['@今日 は @荷物 が @重い です から @電話 @する~しました~しました','Today my luggage is heavy, so I called.'],
 ['B1@厚かましい @お願い です が @駅 まで @迎え に @来る~来て~きて ください','It is a lot to ask, but please come and pick me up at the station.'],
 ['@友達 は @すぐ @来る~来て~きて @くれる~くれました~くれました','My friend came right away.'],
 ['@私 は @ありがとう と @言う~言って~いって @友達 と @一緒 に B1@にっこり @笑う~笑いました~わらいました','I said thank you, and my friend and I smiled warmly together.'],
]);
}
