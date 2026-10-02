// Frozen additions to the daily-life track. Each section follows the existing
// source chapter, so its earlier vocabulary and grammar are already available.
export function authorDailyDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 859:'detergent; cleaning agent',1161:'to wet; to dampen',615:'bubbles; foam; suds',
 849:'to pull',1021:'to lift; to raise',1058:'to hold down; to hold in place',
 876:'to chip; to be chipped',907:'to come off; to become detached',999:'to replace; to change',
 808:'to stack; to put on top of another',877:'to overlap; to lie on top of one another',765:'bundle; bunch',
 331:'fresh',1005:'to rot; to spoil',599:'shell; husk',665:'shellfish',985:'pepper',286:'degree; adjustment',
 330:'fat',820:'fat; grease',1012:'to chill; to cool',1068:'to cool down',1192:'to let cool; to cool something down',
 1020:'to warm up; to heat up',1120:'to get warm; to warm up',905:'dining table',148:'tea',569:'lunch; noon',575:'sweets; confectionery',
 580:'to pay',773:'small change; coins',904:'bill; payment of a bill',1002:'settlement of an account; exact calculation',
 987:'to leave in someone’s care; to deposit',1082:'to look after; to keep for someone',846:'safe; strongbox',
 1145:'to accumulate; to store up',781:'expenditure; expenses',668:'economic conditions',456:'business; trade',692:'merchant; trader',
 417:'luxury; extravagance',262:'luxurious; lavish',104:'precious; valuable',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('household');
lesson('too-much','Too much',[], 'Verb stem / adjective + すぎます', 'Add すぎます to the stem before ます to say an action goes too far: 入れます becomes 入れすぎます. For an い-adjective, remove the final い; for a な-adjective, add すぎます directly, without な. The result describes an excessive amount or degree, not just a large one.', [
 ['@水 を @入れる~入れすぎました~いれすぎました','I put in too much water.'],
 ['@窓 を @開ける~開けすぎました~あけすぎました','I opened the window too far.'],
 ['@本 を @買う~買いすぎました~かいすぎました','I bought too many books.'],
 ['@部屋 が @暑い~暑すぎます~あつすぎます','The room is too hot.'],
 ['@この @箱 は @大きい~大きすぎて~おおきすぎて @棚 に @入る~入りません~はいりません','This box is too big to fit on the shelf.'],
 ['@説明 が @長い~長すぎます~ながすぎます','The explanation is too long.'],
 ['@誰 も @話す~話しません~はなしません 。 @部屋 が @静か~静かすぎます~しずかすぎます','Nobody speaks. The room is too quiet.'],
 ['@私 に は @この @問題 は @簡単~簡単すぎます~かんたんすぎます','This problem is too easy for me.'],
]);
course.lessons.at(-1).notes[0].title='Grammar in this lesson';
lesson('detergent-and-suds','Washing and wiping',[859,1161,615], '洗剤を使います / 布を濡らします / 泡を流します', '濡らす describes making something wet. 泡 can mean a single bubble or a mass of bubbles, such as the suds made by detergent.', [
 ['@皿 を @洗う の に 859 を @使う~使います~つかいます','I use detergent to wash the dishes.'],
 ['859 を @少し @水 に @入れる~入れました~いれました','I put a little detergent in the water.'],
 ['@この 859 は @台所 で @使う~使っています~つかっています','I use this detergent in the kitchen.'],
 ['2285 を @水 で 1161~濡らして~ぬらして @机 を 1010~拭きました~ふきました','I dampened a cleaning cloth with water and wiped the desk.'],
 ['@紙 を 1161~濡らさない~ぬらさない ように @気 を @つける~つけて~つけて ください','Please be careful not to get the paper wet.'],
 ['@掃除 の @前 に 2285 を 1161~濡らします~ぬらします','I wet the cleaning cloth before cleaning.'],
 ['@水 で 615 を 473~流しました~ながしました','I rinsed away the suds with water.'],
 ['1960 の @中 に 615 が @残る~残っています~のこっています','There are still suds in the bucket.'],
 ['859 を @入れる~入れすぎて~いれすぎて 615 が @多い~多く~おおく @なる~なりました~なりました','I added too much detergent, and there were a lot of suds.'],
]);
lesson('lifting-and-holding','Pulling, lifting and holding steady',[849,1021,1058], '引っ張ります / 持ち上げます / 押さえます', '引っ張る is pulling; 持ち上げる is lifting something upward. 押さえる can describe holding an object down or keeping it steady.', [
 ['@ドア を 849~引っ張って~ひっぱって @開ける~開けました~あけました','I pulled the door open.'],
 ['@子供 が @私 の @服 を 849~引っ張りました~ひっぱりました','The child tugged at my clothes.'],
 ['@強い~強く~つよく 849~引っ張る~ひっぱる と @壊れる~壊れます~こわれます','It will break if you pull hard.'],
 ['@重い @箱 を @二人 で 1021~持ち上げました~もちあげました','The two of us lifted the heavy box.'],
 ['@掃除 @する @ため に @椅子 を 1021~持ち上げます~もちあげます','I lift the chair to clean.'],
 ['@この @机 は @一人 で 1021~持ち上げられます~もちあげられます','I can lift this desk on my own.'],
 ['@紙 を @手 で 1058~押さえて~おさえて ください','Please hold the paper down with your hand.'],
 ['@箱 を 1058~押さえている~おさえている @間 に @友達 が @中 の @物 を @取る~取りました~とりました','While I held the box steady, my friend took the things out of it.'],
 ['@風 で @飛ぶ~飛ばない~とばない ように @新聞 を 1058~押さえました~おさえました','I held the newspaper down so it would not blow away.'],
]);
lesson('chips-and-replacements','When a part comes off',[876,907,999], '皿が欠けます / ボタンが外れます / 電池を替えます', '欠ける describes a piece breaking off. 外れる describes something becoming detached. 替える means replacing one thing with another, such as putting in fresh batteries.', [
 ['@この @皿 は @少し 876~欠けています~かけています','This plate is slightly chipped.'],
 ['@コップ が 876~欠けた~かけた から @使う の を @やめる~やめました~やめました','I stopped using the glass because it was chipped.'],
 ['@洗う~洗っている~あらっている @時 に @皿 が 876~欠けました~かけました','The plate chipped while I was washing it.'],
 ['@服 の 3002 が 907~外れました~はずれました','A button came off my clothes.'],
 ['@窓 を @開ける~開けたら~あけたら @カーテン が 907~外れました~はずれました','When I opened the window, the curtain came off.'],
 ['@この 3002 は @簡単 に 907~外れます~はずれます','This button comes off easily.'],
 ['@時計 の @電池 を 999~替えました~かえました','I replaced the clock’s battery.'],
 ['@水 が @汚い から 999~替えます~かえます','The water is dirty, so I will change it.'],
 ['@寝る @前 に @服 を 999~替えました~かえました','I changed my clothes before bed.'],
]);
lesson('stacks-and-bundles','Putting things in order',[808,877,765], '皿を重ねます / 紙が重なります / 新聞の束', '重ねる is the action of putting things on top of one another. 重なる describes things overlapping or lying on top of one another. 束 is a bundle or bunch.', [
 ['@小さい @皿 を @大きい @皿 の @上 に 808~重ねました~かさねました','I stacked the small plate on top of the large one.'],
 ['@箱 を 808~重ねる~かさねる @前 に @中 を @確認 @する~しました~しました','I checked inside the boxes before stacking them.'],
 ['@机 の @上 に @本 を 808~重ねて~かさねて @置く~置きました~おきました','I stacked the books on the desk.'],
 ['@紙 が 877~重なって~かさなって @下 の @字 が @見える~見えません~みえません','The papers overlap, so I cannot see the writing underneath.'],
 ['@二つ の @絵 が @少し 877~重なっています~かさなっています','The two pictures overlap a little.'],
 ['@机 の @上 で @本 が 877~重なっています~かさなっています','There are books piled on top of one another on the desk.'],
 ['@新聞 の 765 を @持つ~持って~もって @外 に @出る~出ました~でました','I went outside carrying a bundle of newspapers.'],
 ['@紙 の 765 を @机 に @置く~置きました~おきました','I put a bundle of paper on the desk.'],
 ['@花 の 765 を @母 に @渡す~渡しました~わたしました','I gave my mother a bunch of flowers.'],
]);
lesson('cleaning-drawer-account','Cleaning a drawer',[], 'Getting everything out and putting it back', 'Follow the order of a small cleaning job, from emptying a drawer to replacing its contents.', [
 ['@まず 26 の @中 の @物 を @全部 @出す~出しました~だしました','First, I took everything out of the drawer.'],
 ['@古い @紙 の 765 を @机 に @置く~置きました~おきました','I put a bundle of old papers on the desk.'],
 ['@小さい @箱 を 1021~持ち上げる~もちあげる と @下 に 928 が @ある~ありました~ありました','When I lifted a small box, there was dust underneath.'],
 ['2285 を 1161~濡らして~ぬらして 26 を 1010~拭きました~ふきました','I dampened a cloth and wiped the drawer.'],
 ['@汚い @水 を 999~替えて~かえて @もう一度 1010~拭きました~ふきました','I changed the dirty water and wiped it again.'],
 ['@紙 を 808~重ねて~かさねて @箱 に @入れる~入れました~いれました','I stacked the papers and put them in a box.'],
 ['@最後 に @必要 な @物 を 26 に 552~戻しました~もどしました','Finally, I put the things I needed back in the drawer.'],
]);
lesson('accumulation','Things that pile up',[1145], '溜めます', '溜める means allowing something to accumulate or storing it up, such as water or unfinished work.', [
 ['1960 に @水 を 1145~溜めました~ためました','I stored water in a bucket.'],
 ['@洗濯 @物 を 1145~溜めない~ためない ように @毎日 @洗う~洗っています~あらっています','I wash clothes every day so the laundry does not pile up.'],
 ['@仕事 を 1145~溜めてしまいました~ためてしまいました','I let my work pile up.'],
 ['@古い @新聞 を 1145~溜めすぎて~ためすぎて @部屋 が @狭い~狭く~せまく @なる~なりました~なりました','I accumulated so many old newspapers that the room became cramped.'],
 ['@紙 を 1145~溜めない~ためない ように @使う~使わない~つかわない @紙 は @捨てる~捨てます~すてます','I throw away papers I do not use so they do not pile up.'],
]);
useTopic('cooking');
lesson('freshness-and-shells','Fresh ingredients and shells',[331,1005,599,665], '新鮮な魚 / 果物が腐ります / 卵の殻 / 貝を洗います', '新鮮 describes fresh food. 腐る means food spoiling or rotting. 殻 is the shell or outer covering; 貝 refers to shellfish, and can also mean a seashell in other contexts.', [
 ['@朝 @店 で 331 な @魚 を @買う~買いました~かいました','I bought fresh fish at the shop in the morning.'],
 ['@この @野菜 は 331 で @おいしい です','These vegetables are fresh and delicious.'],
 ['331 な @牛乳 を @使う~使って~つかって @料理 @する~しました~しました','I cooked with fresh milk.'],
 ['@果物 が 1005~腐っていました~くさっていました','The fruit had gone rotten.'],
 ['@暑い @部屋 に @置く~置いた~おいた @肉 が 1005~腐りました~くさりました','The meat left in the hot room spoiled.'],
 ['1005~腐った~くさった @野菜 を @捨てる~捨てました~すてました','I threw away the rotten vegetables.'],
 ['@卵 の 599 を @捨てる~捨てました~すてました','I threw away the eggshells.'],
 ['@白い 599 の @卵 を @買う~買いました~かいました','I bought eggs with white shells.'],
 ['@皿 に @小さい 599 が @残る~残っていました~のこっていました','A small piece of shell was left on the plate.'],
 ['@料理 の @前 に 665 を @洗う~洗いました~あらいました','I washed the shellfish before cooking.'],
 ['@この @スープ に は 665 が @入る~入っています~はいっています','This soup contains shellfish.'],
 ['@店 で 331 な 665 を @買う~買いました~かいました','I bought fresh shellfish at the shop.'],
]);
lesson('seasoning-and-fat','Adjusting flavor and fat',[985,286,330,820], 'こしょうを加えます / 火加減 / 脂肪が少ない肉 / 脂を取ります', '加減 concerns the degree or adjustment of something: 火加減 is how high or low the heat is. 脂肪 is fat as a substance or component of food. 脂 often refers to visible animal fat or grease.', [
 ['@スープ に 985 を 573~加えました~くわえました','I added pepper to the soup.'],
 ['@塩 と 985 で @味 を @つける~つけます~つけます','I season it with salt and pepper.'],
 ['985 が @多い~多すぎて~おおすぎて @辛い です','There is too much pepper, and it is spicy.'],
 ['@火 286 に @気 を @つける~つけて~つけて @料理 @する~します~します','I pay attention to the heat when I cook.'],
 ['@この @スープ は @塩 286 が @いい です','This soup has just the right amount of salt.'],
 ['@味 を @見る~見て~みて 985 の @量 を 286 @する~しました~しました','I tasted it and adjusted the amount of pepper.'],
 ['@この @肉 は 330 が @少ない です','This meat is low in fat.'],
 ['@牛乳 の 330 の @量 を @比べる~比べました~くらべました','I compared the amount of fat in the milk.'],
 ['330 が @多い @肉 より @魚 が @好き です','I prefer fish to fatty meat.'],
 ['@肉 の @白い 820 を @少し @取る~取りました~とりました','I removed a little of the white fat from the meat.'],
 ['@スープ の @上 に @白い 820 が @見える~見えます~みえます','You can see white fat on top of the soup.'],
 ['@この @肉 は 820 が @多い です','This meat has a lot of fat on it.'],
]);
lesson('cooling-food','Chilling and letting food cool',[1012,1068,1192], '冷やします / 冷めます / 冷まします', '冷やす often means actively chilling something, for example in a refrigerator. 冷める describes hot food or drink becoming cooler. 冷ます describes letting or making it cool down.', [
 ['@飲み物 を @冷蔵庫 で 1012~冷やしておきます~ひやしておきます','I will chill the drinks in the refrigerator beforehand.'],
 ['@暑い @日 は @水 を 1012~冷やして~ひやして @持つ~持って~もって @行く~行きます~いきます','On hot days, I chill some water and take it with me.'],
 ['@暑い @日 は 1012~冷やした~ひやした @果物 を @食べる~食べます~たべます','On hot days, I eat chilled fruit.'],
 ['@スープ が 1068~冷めました~さめました','The soup has cooled down.'],
 ['@料理 が 1068~冷めない~さめない うちに @食べる~食べましょう~たべましょう','Let’s eat before the food gets cold.'],
 ['@電話 で @話す~話している~はなしている @間 に @コーヒー が 1068~冷めました~さめました','My coffee got cold while I was talking on the phone.'],
 ['@熱い @スープ を @少し 1192~冷まして~さまして から @飲む~飲みました~のみました','I let the hot soup cool a little before drinking it.'],
 ['@子供 の @ご飯 を 1192~冷ましています~さましています','I am letting the child’s rice cool down.'],
 ['@お茶 を 1192~冷ます~さます @ため に @別 の @コップ に @入れる~入れました~いれました','I poured the tea into another cup to cool it down.'],
]);
lesson('warming-food','Warming up food',[1020,1120], 'スープを温めます / スープが温まります', 'Use 温める when someone warms something up. Use 温まる when something becomes warm: the thing being warmed is marked with が.', [
 ['@昨日 の @スープ を 1020~温めました~あたためました','I warmed up yesterday’s soup.'],
 ['@牛乳 を @少し 1020~温めて~あたためて から @飲む~飲みます~のみます','I warm the milk a little before drinking it.'],
 ['@食べる @前 に @料理 を 1020~温めて~あたためて ください','Please heat the food before eating it.'],
 ['@スープ が 1120~温まりました~あたたまりました','The soup has warmed up.'],
 ['@牛乳 が 1120~温まる~あたたまる まで @待つ~待ちます~まちます','I will wait until the milk gets warm.'],
 ['@熱い @お茶 を @飲む~飲んで~のんで @体 が 1120~温まりました~あたたまりました','Drinking hot tea warmed me up.'],
 ['@朝 は @パン を 1020~温めながら~あたためながら @コーヒー を @作る~作ります~つくります','In the morning, I make coffee while warming up bread.'],
 ['@お風呂 に @入る と @体 が 1120~温まります~あたたまります','Taking a bath warms you up.'],
]);
lesson('around-the-table','Lunch and tea at the table',[905,148,569,575], '食卓に並べます / 茶の香り / お昼を食べます / 菓子を買います', 'お昼 can mean midday or lunch. 茶 and 菓子 are also familiar as お茶 and お菓子; the forms without お occur in product descriptions and more formal wording. 食卓 is the table where people eat.', [
 ['905 に @皿 を @並べる~並べました~ならべました','I arranged the plates on the dining table.'],
 ['@家族 が 905 に @集まる~集まりました~あつまりました','The family gathered at the dining table.'],
 ['905 の @上 の @花 を 999~替えました~かえました','I replaced the flowers on the dining table.'],
 ['@この 148 は 154 が @いい です','This tea has a pleasant aroma.'],
 ['@日本 の 148 を @外国 に @送る~送ります~おくります','We send Japanese tea abroad.'],
 ['148 の @種類 を @店 の @人 に @聞く~聞きました~ききました','I asked someone at the shop about the types of tea.'],
 ['@今日 の 569 は @うどん です','We are having udon for lunch today.'],
 ['569 に @友達 と @会う~会いました~あいました','I met a friend at noon.'],
 ['569 を @食べる~食べて~たべて から @買い物 に @行く~行きます~いきます','I will go shopping after lunch.'],
 ['@この @店 は @日本 の 575 を @売る~売っています~うっています','This shop sells Japanese sweets.'],
 ['575 の @箱 を @開ける~開けました~あけました','I opened the box of sweets.'],
 ['@米 から @作る~作った~つくった 575 を @買う~買いました~かいました','I bought sweets made from rice.'],
]);
lesson('lunch-preparation-account','Getting lunch ready',[], 'From shopping to the table', 'Follow the preparation of a simple lunch and the tea served afterwards.', [
 ['@朝 331 な 665 を @買う~買って~かって @帰る~帰りました~かえりました','In the morning, I bought fresh shellfish and came home.'],
 ['665 と @野菜 で @スープ を @作る~作りました~つくりました','I made soup with shellfish and vegetables.'],
 ['@味 を @見る~見ながら~みながら @塩 と 985 の @量 を 286 @する~しました~しました','I adjusted the amount of salt and pepper as I tasted it.'],
 ['@友達 が @来る @前 に 905 に @皿 を @並べる~並べました~ならべました','I arranged the plates on the dining table before my friend came.'],
 ['@スープ が 1068~冷めた~さめた から @もう一度 1020~温めました~あたためました','The soup had cooled down, so I warmed it up again.'],
 ['@友達 と @一緒 に 569 を @食べる~食べました~たべました','I ate lunch with my friend.'],
 ['@食事 の @後 に 148 の 154 を @楽しむ~楽しみながら~たのしみながら 575 を @食べる~食べました~たべました','After the meal, we ate sweets while enjoying the aroma of the tea.'],
]);
useTopic('money');
lesson('paying-and-settling','Paying a bill',[580,773,904,1002], '代金を支払います / 小銭 / 勘定をお願いします / 精算します', '勘定 can mean the bill at a restaurant. 精算 concerns settling the exact amount owed, such as paying a fare difference or balancing travel expenses. 小銭 means coins or small change.', [
 ['@カード で 799 を 580~支払いました~しはらいました','I paid for it by card.'],
 ['620 は @毎月 @銀行 で 580~支払います~しはらいます','I pay the rent at the bank every month.'],
 ['@今日 @銀行 で 580~支払う~しはらう こと に @する~しました~しました','I decided to pay at the bank today.'],
 ['@財布 に 773 が @ある~ありません~ありません','There is no small change in my wallet.'],
 ['773 が @ある か @確認 @する~して~して から 580~支払いました~しはらいました','I checked whether I had small change before paying.'],
 ['@バス に @乗る @前 に 773 を @用意 @する~しました~しました','I got some change ready before getting on the bus.'],
 ['904 を @お願い @する~します~します','The bill, please.'],
 ['904 は @私 が 580~支払います~しはらいます','I will pay the bill.'],
 ['@店 を @出る @前 に 904 を @確認 @する~しました~しました','I checked the bill before leaving the restaurant.'],
 ['@駅 で @運賃 を 1002 @する~しました~しました','I settled the fare difference at the station.'],
 ['@旅行 の 111 を 1002 @する~します~します','We will settle the travel expenses.'],
 ['1002 が @終わる~終わって~おわって から @残る~残った~のこった @お金 を @返す~返しました~かえしました','After settling the accounts, I returned the money left over.'],
]);
lesson('leaving-things-in-care','Leaving valuables in someone’s care',[987,1082,846], '預けます / 預かります / 金庫に入れます', '預ける describes leaving something with someone; 預かる describes looking after it for that person. 金庫 is a safe or strongbox.', [
 ['@ホテル に @荷物 を 987~預けました~あずけました','I left my luggage with the hotel.'],
 ['@銀行 に @お金 を 987~預けます~あずけます','I deposit money at the bank.'],
 ['@出かける @前 に @鍵 を @友達 に 987~預けました~あずけました','I left my key with a friend before going out.'],
 ['@友達 の @荷物 を 1082~預かっています~あずかっています','I am looking after my friend’s luggage.'],
 ['@鍵 は @私 が 1082~預かります~あずかります','I will keep the key for you.'],
 ['@昨日 1082~預かった~あずかった @お金 を @返す~返しました~かえしました','I returned the money I was given to look after yesterday.'],
 ['@店 の @お金 を 846 に @入れる~入れました~いれました','I put the shop’s money in the safe.'],
 ['846 の @鍵 を @探す~探しています~さがしています','I am looking for the key to the safe.'],
 ['@小さい 846 を @買う~買って~かって @家 に @置く~置きました~おきました','I bought a small safe and put it at home.'],
]);
lesson('recording-expenses','Keeping track of expenses',[781], '支出を記録します', '支出 is money spent. It can refer to spending on one item or to expenditure over a period of time.', [
 ['@毎月 の 781 を @ノート に @書く~書いています~かいています','I write down my expenses each month in a notebook.'],
 ['@今月 は 781 が @多い~多かった~おおかった です','My expenses were high this month.'],
 ['@家 で @料理 @する ように @なる~なって~なって 781 が 536~減りました~へりました','Since I started cooking at home, my expenses have decreased.'],
 ['781 の 96 を @確認 @する~しました~しました','I checked the total expenditure.'],
]);
lesson('trade-and-conditions','Business and the economy',[668,456,692], '景気がいい / 商売を始めます / 商人', '景気 refers to economic or business conditions. 商売 is doing business, especially buying and selling. 商人 means a merchant or trader and often appears in descriptions of trade or history.', [
 ['@この @町 は 668 が @いい です','Business is good in this town.'],
 ['668 が @悪い~悪く~わるく @なる~なって~なって @店 が 536~減りました~へりました','Economic conditions worsened, and the number of shops decreased.'],
 ['668 と 869 の @関係 について @読む~読みました~よみました','I read about the relationship between economic conditions and prices.'],
 ['@父 は @小さい @店 で 456 を @する~しています~しています','My father runs a business in a small shop.'],
 ['@この @町 で 456 を @始める~始めました~はじめました','I started a business in this town.'],
 ['456 を @長い @間 @続ける~続けている~つづけている @人 に @相談 @する~しました~しました','I consulted someone who has been in business for a long time.'],
 ['@昔 @この @町 に 692 が @多い~多く~おおく @住む~住んでいました~すんでいました','In the past, many merchants lived in this town.'],
 ['692 が @船 で @品物 を @運ぶ~運びました~はこびました','The merchants transported goods by ship.'],
 ['@外国 の 692 と 456 を @する~していました~していました','They used to trade with merchants from abroad.'],
]);
lesson('luxury-and-value','Luxury and things worth keeping',[417,262,104], '贅沢な食事 / 豪華な部屋 / 貴重な時間', '贅沢 describes luxury or indulgence. 豪華 emphasizes a lavish or impressive appearance. 貴重 means valuable or precious and can describe time or an experience as well as an object.', [
 ['@旅行 の @最後 に @少し 417 を @する~しました~しました','I indulged a little at the end of the trip.'],
 ['@毎日 @レストラン で @食べる の は 417 だ と @思う~思います~おもいます','I think eating at restaurants every day is a luxury.'],
 ['@誕生日 に 417 な @食事 を @楽しむ~楽しみました~たのしみました','I enjoyed a luxurious meal on my birthday.'],
 ['@ホテル の @部屋 は 262 でした','The hotel room was luxurious.'],
 ['262 な @服 を @着る~着た~きた @人 が @来る~来ました~きました','Someone wearing lavish clothes arrived.'],
 ['@写真 で @見る~見た~みた @船 は @大きい~大きくて~おおきくて 262 でした','The ship I saw in the photo was large and luxurious.'],
 ['@家族 と @一緒 に @いる @時間 は 104 です','The time I spend with my family is precious.'],
 ['@この @古い @本 は 104 な @物 です','This old book is a valuable item.'],
 ['@博物館 で 104 な @絵 を @見る~見ました~みました','I saw a valuable painting at the museum.'],
]);
lesson('shop-closing-account','Closing a small shop',[], 'Checking the day’s money', 'Follow a shop owner as they close for the day and check what they have spent.', [
 ['@店 を @閉める @前 に 773 の 96 を @確認 @する~しました~しました','I checked how much small change there was before closing the shop.'],
 ['@今日 の 781 を @ノート に @書く~書きました~かきました','I wrote today’s expenses in a notebook.'],
 ['@昼 に @買う~買った~かった @品物 の 799 は @もう 580~支払いました~しはらいました','I had already paid for the goods I bought at lunchtime.'],
 ['@明日 @銀行 に 987~預ける~あずける @お金 を 846 に @入れる~入れました~いれました','I put the money I will deposit at the bank tomorrow in the safe.'],
 ['@友達 から 1082~預かった~あずかった @鍵 も @忘れる~忘れない~わすれない ように @確認 @する~しました~しました','I also checked the key I was keeping for a friend so I would not forget it.'],
 ['668 は @あまり @いい~よく~よく @ある~ありません~ありません が 456 を @続ける~続けたい~つづけたい です','Economic conditions are not very good, but I want to keep the business going.'],
 ['@家 に @帰る~帰って~かえって から の @家族 と の @時間 も 104 です','The time with my family after I get home is precious, too.'],
]);
}
