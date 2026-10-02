export function authorPracticalDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@抱える':'to carry in one’s arms','B1@握る':'to grip; to hold firmly',
 'B1@つかむ':'to grab; to catch hold of','B1@離す':'to let go of; to move apart',
 'B1@掃く':'to sweep','B1@散らす':'to scatter','B1@たまる':'to accumulate; to collect',
 'B1@隠す':'to hide something','B1@隠れる':'to hide oneself; to be hidden',
 'B1@収める':'to put away; to store','B1@ノック':'knocking','B1@眩しい':'dazzling; glaringly bright',
 'B1@ジーンズ':'jeans','B1@足袋':'tabi; traditional split-toe socks','B1@織る':'to weave',
 'B1@裂く':'to tear something','B1@裂ける':'to tear; to split',
 'B1@作り':'construction; the way something is made','B1@粗末':'poor-quality; shabby','B1@器用':'skillful with one’s hands; dexterous',
 'B1@ラベル':'label','B1@特長':'strong point; merit','B1@欠点':'drawback; weak point',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('household');
lesson('holding-and-releasing','Holding and letting go',['B1@抱える','B1@握る','B1@つかむ','B1@離す'],
 '抱えます / 握ります / つかみます / 離します','抱える describes carrying something in your arms. 握る emphasizes a firm grip; つかむ is catching hold of something. 手を離す means letting go.',[
 ['@大きい @箱 を B1@抱える~抱えて~かかえて @部屋 に @入る~入りました~はいりました','I carried a large box in my arms into the room.'],
 ['@弟 は @本 を B1@抱える~抱えています~かかえています','My younger brother is holding books in his arms.'],
 ['@大きい @荷物 を B1@抱える~抱えました~かかえました','I held a large package in my arms.'],
 ['@子供 が @母 の @手 を B1@握る~握っています~にぎっています','The child is holding their mother’s hand.'],
 ['@ペン を @しっかり B1@握る~握りました~にぎりました','I took a firm grip on the pen.'],
 ['@傘 を B1@握る~握って~にぎって @外 に @出る~出ました~でました','I went outside holding my umbrella firmly.'],
 ['@風 で @飛ぶ~飛んだ~とんだ @紙 を B1@つかむ~つかみました~つかみました','I grabbed the paper that had blown away.'],
 ['@子供 が @私 の @服 を B1@つかむ~つかみました~つかみました','The child grabbed my clothes.'],
 ['@落ちる @前 に @袋 を B1@つかむ~つかみました~つかみました','I caught hold of the bag before it fell.'],
 ['@箱 を @机 に @置く~置いて~おいて から @手 を B1@離す~離しました~はなしました','I put the box on the desk and then let go.'],
 ['@二つ の @椅子 を @少し B1@離す~離して~はなして ください','Please move the two chairs a little farther apart.'],
 ['@子供 の @手 を B1@離す~離さないで~はなさないで ください','Please do not let go of the child’s hand.'],
]);
lesson('sweeping-and-scattering','Sweeping and clearing up',['B1@掃く','B1@散らす','B1@たまる'],
 '掃きます / 散らします / たまります','掃く is sweeping a surface. 散らす means scattering things; たまる describes things collecting or building up.',[
 ['@朝 @玄関 を B1@掃く~掃きました~はきました','I swept the entrance in the morning.'],
 ['@床 を B1@掃く~掃いて~はいて から B1@拭く~拭きました~ふきました','I swept the floor and then wiped it.'],
 ['@庭 を B1@掃く の に B1@ほうき を @使う~使います~つかいます','I use a broom to sweep the garden.'],
 ['@子供 が @紙 を @床 に B1@散らす~散らしました~ちらしました','The child scattered paper on the floor.'],
 ['@風 が @庭 の @葉 を B1@散らす~散らしました~ちらしました','The wind scattered the leaves in the garden.'],
 ['@机 の @上 に @物 を B1@散らす~散らさないで~ちらさないで ください','Please do not scatter things over the desk.'],
 ['@雨 の @後 で @庭 に @水 が B1@たまる~たまりました~たまりました','Water collected in the garden after the rain.'],
 ['@机 に @古い @紙 が B1@たまる~たまっています~たまっています','Old papers have piled up on the desk.'],
 ['B1@ゴミ が B1@たまる @前 に @捨てる~捨てます~すてます','I throw out the rubbish before it builds up.'],
]);
lesson('hiding-and-storing','Hiding and putting away',['B1@隠す','B1@隠れる','B1@収める'],
 '隠します / 隠れます / 収めます','隠す describes hiding something. 隠れる describes someone hiding or something going out of sight. 収める here means putting something away in its place.',[
 ['@子供 は @小さい @箱 を @ベッド の @下 に B1@隠す~隠しました~かくしました','The child hid a small box under the bed.'],
 ['@友達 の @プレゼント を @袋 に @入れる~入れて~いれて B1@隠す~隠しました~かくしました','I put my friend’s present in a bag and hid it.'],
 ['@猫 は @おもちゃ を @椅子 の @下 に B1@隠す~隠しました~かくしました','The cat hid its toy under a chair.'],
 ['@子供 は @カーテン の @後ろ に B1@隠れる~隠れています~かくれています','The child is hiding behind the curtain.'],
 ['@猫 は @箱 の @中 に B1@隠れる~隠れました~かくれました','The cat hid in the box.'],
 ['@太陽 が @雲 に B1@隠れる~隠れました~かくれました','The sun disappeared behind a cloud.'],
 ['@道具 を @箱 に B1@収める~収めました~おさめました','I put the tools away in the box.'],
 ['@使う~使った~つかった @本 を @棚 に B1@収める~収めます~おさめます','I put the books I have used back on the shelf.'],
 ['@大切 な @手紙 を B1@引き出し に B1@収める~収めました~おさめました','I stored the important letter in a drawer.'],
]);
lesson('knocking-and-light','At the door and window',['B1@ノック','B1@眩しい'],
 'ドアをノックします / 眩しい','ノックする is knocking, often on a door. 眩しい describes light that feels too bright for your eyes.',[
 ['@部屋 に @入る @前 に @ドア を B1@ノック @する~しました~しました','I knocked on the door before entering the room.'],
 ['@外 から B1@ノック の @音 が @聞こえる~聞こえました~きこえました','I heard a knock from outside.'],
 ['@ドア を B1@ノック @する~して~して @少し @待つ~待ちました~まちました','I knocked on the door and waited a little.'],
 ['@朝 の @光 が B1@眩しい です','The morning light is dazzling.'],
 ['B1@眩しい から @カーテン を @閉める~閉めました~しめました','I closed the curtain because the light was too bright.'],
 ['@この @部屋 の @電気 は B1@眩しい~眩しくない~まぶしくない です','The light in this room is not glaring.'],
]);
lesson('clearing-room-account','Clearing a room',[],
 'たまる / 抱える / 収める','Follow the order of the jobs as the room is cleared.',[
 ['@机 に @紙 が B1@たまる~たまっていた~たまっていた から @片付ける~片付けました~かたづけました','Papers had piled up on the desk, so I tidied them away.'],
 ['@古い @本 を B1@抱える~抱えて~かかえて @棚 の @前 に @運ぶ~運びました~はこびました','I carried the old books in my arms to the shelf.'],
 ['@本 を @棚 に B1@収める~収めて~おさめて から @床 を B1@掃く~掃きました~はきました','I put the books on the shelf and then swept the floor.'],
 ['@猫 は @椅子 の @後ろ に B1@隠れる~隠れていました~かくれていました','The cat was hiding behind a chair.'],
 ['@窓 の @光 が B1@眩しい~眩しかった~まぶしかった から @カーテン を @閉める~閉めました~しめました','The light from the window was dazzling, so I closed the curtain.'],
 ['@最後 に @家族 が @ドア を B1@ノック @する~しました~しました','Finally, a family member knocked on the door.'],
]);
useTopic('clothing');
lesson('jeans-and-tabi','Jeans and tabi',['B1@ジーンズ','B1@足袋'],
 'ジーンズ / 足袋','足袋 are traditional socks with a separate space for the big toe. They are often worn with a kimono.',[
 ['@休日 は B1@ジーンズ を @履く~履きます~はきます','I wear jeans on my days off.'],
 ['@この B1@ジーンズ は @少し @長い です','These jeans are a little too long.'],
 ['B1@ジーンズ を @洗う~洗って~あらって @外 に B1@干す~干しました~ほしました','I washed the jeans and hung them outside to dry.'],
 ['@着物 と @一緒 に @白い B1@足袋 を @履く~履きました~はきました','I wore white tabi with my kimono.'],
 ['B1@足袋 の @サイズ を @確認 @する~しました~しました','I checked the size of the tabi.'],
 ['@店 で @新しい B1@足袋 を @買う~買いました~かいました','I bought new tabi at the shop.'],
]);
lesson('weaving-and-handwork','Cloth and skillful hands',['B1@織る','B1@器用'],
 '布を織ります / 器用な人','織る means making cloth by crossing threads. 器用 describes skill with the hands, and can describe someone who handles tasks deftly.',[
 ['@母 は @家 で B1@布 を B1@織る~織っています~おっています','My mother weaves cloth at home.'],
 ['@赤い @糸 で B1@布 を B1@織る~織りました~おりました','I wove cloth with red thread.'],
 ['@手 で B1@織る~織った~おった B1@布 を @店 で @見る~見ました~みました','I saw handwoven cloth at the shop.'],
 ['@姉 は B1@器用 で @服 も @作る こと が @できる~できます~できます','My older sister is good with her hands and can make clothes too.'],
 ['B1@器用 な @友達 が B1@ボタン を @つける~つけて~つけて @くれる~くれました~くれました','A friend who is good with their hands sewed the button on for me.'],
 ['@祖母 は B1@針 を B1@器用 に @使う~使っています~つかっています','My grandmother is handling the needle skillfully.'],
]);
lesson('tearing-cloth','Tearing and torn cloth',['B1@裂く','B1@裂ける','B1@粗末','B1@作り'],
 '布を裂きます / 布が裂けます / 粗末なN','裂く describes tearing something apart; 裂ける describes the material tearing. 粗末な can describe something shabby or poorly made, so it is a critical description. 作り refers to how something is made.',[
 ['@古い B1@布 を @細い~細く~ほそく B1@裂く~裂きました~さきました','I tore the old cloth into narrow strips.'],
 ['@紙 を @手 で B1@裂く~裂きました~さきました','I tore the paper by hand.'],
 ['@この B1@布 は @手 で B1@裂く こと が @できる~できます~できます','This cloth can be torn by hand.'],
 ['@古い @シャツ が B1@裂ける~裂けました~さけました','The old shirt tore.'],
 ['@袋 が B1@裂ける~裂けて~さけて @中 の @物 が @落ちる~落ちました~おちました','The bag tore and the things inside fell out.'],
 ['B1@裂ける~裂けた~さけた B1@布 を @使う の は @やめる~やめました~やめました','I stopped using the torn cloth.'],
 ['@この @袋 は B1@粗末 な B1@布 で @作る~作られています~つくられています','This bag is made from poor-quality cloth.'],
 ['@安い です が B1@作り は B1@粗末 ではありません','It is inexpensive, but it is not poorly made.'],
 ['@この @袋 は B1@作り が @しっかり @する~しています~しています','This bag is well made.'],
 ['@二つ の @服 の B1@作り を @比べる~比べました~くらべました','I compared how the two garments were made.'],
 ['B1@粗末 な @箱 を @丈夫 な @箱 に @変える~変えました~かえました','I replaced the flimsy box with a sturdy one.'],
]);
lesson('cloth-shop-account','At a cloth shop',[],
 '織る / 器用 / 裂ける','Follow a visit to a shop that sells handmade cloth and clothing.',[
 ['@店 に は @赤い @糸 で B1@織る~織った~おった B1@布 が @ある~ありました~ありました','The shop had cloth woven with red thread.'],
 ['@店 の @人 は B1@器用 に B1@針 を @使う~使っていました~つかっていました','The person at the shop was using a needle skillfully.'],
 ['@古い @袋 が B1@裂ける~裂けた~さけた から @新しい @物 を @探す~探していました~さがしていました','My old bag had torn, so I was looking for a new one.'],
 ['@この @袋 の B1@布 は B1@粗末 ではありません','The cloth used for this bag is not poor quality.'],
 ['@白い B1@足袋 も @買う~買いました~かいました','I also bought white tabi.'],
]);
useTopic('shopping');
lesson('labels-and-merits','Labels, strengths and drawbacks',['B1@ラベル','B1@特長','B1@欠点'],
 'ラベル / 特長 / 欠点','特長 is a strong point or merit. 欠点 is a drawback. A ラベル provides information attached to a product or container.',[
 ['B1@瓶 の B1@ラベル を @読む~読みました~よみました','I read the label on the bottle.'],
 ['B1@ラベル に @名前 と @値段 を @書く~書きました~かきました','I wrote a name and a price on the label.'],
 ['@水 で B1@ラベル の @字 が @消える~消えました~きえました','Water erased the writing on the label.'],
 ['@この @かばん の B1@特長 は @軽い こと です','A strong point of this bag is that it is light.'],
 ['@店 の @人 に @この @商品 の B1@特長 を @聞く~聞きました~ききました','I asked someone at the shop about this product’s strengths.'],
 ['@丈夫 で @使う~使いやすい~つかいやすい の が @この @椅子 の B1@特長 です','This chair’s strengths are its sturdiness and ease of use.'],
 ['@この @かばん の B1@欠点 は @重い こと です','A drawback of this bag is that it is heavy.'],
 ['@買う @前 に @商品 の B1@欠点 も @調べる~調べました~しらべました','I also checked the product’s drawbacks before buying it.'],
 ['@この @時計 は @音 が @大きい の が B1@欠点 です','A drawback of this clock is that it is loud.'],
]);
lesson('choosing-bag-account','Choosing a new bag',[],
 '特長 / 欠点 / ラベル','Compare the two bags before following the choice.',[
 ['@店 で @二つ の @かばん を @比べる~比べました~くらべました','I compared two bags at the shop.'],
 ['@黒い @かばん の B1@特長 は @丈夫 な こと です','The black bag’s strong point is its sturdiness.'],
 ['@黒い @かばん は @少し @重い の が B1@欠点 です','A drawback of the black bag is that it is a little heavy.'],
 ['@青い @かばん の B1@ラベル を @読む~読んで~よんで @値段 を @確認 @する~しました~しました','I read the blue bag’s label and checked the price.'],
 ['@青い @かばん は @軽い から @こちら を @選ぶ~選びました~えらびました','The blue bag is light, so I chose this one.'],
]);
}
