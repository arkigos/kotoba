export function authorJourneysDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 474:'passenger',731:'crowding; congestion',755:'to give a ride; to take on board',
 522:'pilot',381:'piloting; steering; operating a vehicle',624:'sea voyage; sailing',491:'offshore; the open sea',874:'to sink; to set (of the sun)',
 275:'national capital',308:'Europe',328:'national border',379:'nationality; citizenship',403:'continent',
 256:'spring; natural source of water',414:'mud',543:'dew',553:'shade; a shaded place',847:'summit; peak',903:'the whole area',914:'the tropics',
 617:'to lose one’s way; to get lost',752:'lost child; lost person',509:'here and there; various places',589:'to catch sight of; to happen to see',878:'going to Tokyo',
 866:'crops; agricultural produce',100:'field; open countryside',332:'living thing; creature',412:'extinction',772:'mouse; rat',788:'to be caught',647:'to chase; to follow after',210:'hunting',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('travel');
lesson('passengers-and-crowds','Passengers and crowded services',[474,731,755], '乗客 / 混雑しています / 人を乗せます', '乗客 is a passenger. 混雑 describes crowding or congestion. 乗せる means giving someone a ride or taking them aboard; the person takes を and the vehicle takes に.', [
 ['@バス の 474 は @ほとんど @学生 でした','Most of the bus passengers were students.'],
 ['474 が @駅 で @電車 を @待つ~待っています~まっています','Passengers are waiting for the train at the station.'],
 ['@最後 の 474 が @降りる~降りて~おりて から @運転手 と @話す~話しました~はなしました','I spoke with the driver after the last passenger got off.'],
 ['@朝 の @駅 は 731 @する~しています~しています','The station is crowded in the morning.'],
 ['731 で @バス が @遅れる~遅れました~おくれました','The bus was delayed by traffic congestion.'],
 ['@休日 の @道路 は 731 @する こと が @多い です','The roads are often congested on holidays.'],
 ['@友達 を @車 に 755~乗せて~のせて @駅 まで @行く~行きました~いきました','I gave my friend a ride to the station.'],
 ['@この @船 は 474 を 755~乗せて~のせて @島 まで @行く~行きます~いきます','This boat carries passengers to the island.'],
 ['@子供 を @バス に 755~乗せる~のせる @前 に @切符 を @確認 @する~しました~しました','I checked the tickets before putting the children on the bus.'],
]);
lesson('pilots-and-voyages','Pilots, controls and voyages',[522,381,624], 'パイロット / 操縦します / 航海に出ます', '操縦 is controlling a vehicle such as an aircraft or boat. 航海 is a voyage at sea; use it for travel by ship, rather than a flight.', [
 ['@将来 522 に @なる~なりたい~なりたい です','I want to become a pilot in the future.'],
 ['522 が @天気 を @確認 @する~しています~しています','The pilot is checking the weather.'],
 ['@この 522 は @若い @時 から @飛行機 を 381 @する~しています~しています','This pilot has been flying aircraft since they were young.'],
 ['522 が @飛行機 を 381 @する~しています~しています','The pilot is flying the aircraft.'],
 ['@船 の 381 を @習う~習っています~ならっています','I am learning to pilot a boat.'],
 ['@この @飛行機 の 381 は @難しい です','This aircraft is difficult to fly.'],
 ['@船 は @長い 624 に @出る~出ました~でました','The ship set out on a long voyage.'],
 ['624 の @途中 で @島 に @寄る~寄りました~よりました','We stopped at an island during the voyage.'],
 ['624 の @前 に @船 を @調べる~調べました~しらべました','We inspected the boat before the voyage.'],
]);
lesson('offshore-and-sinking','Offshore and below the surface',[491,874], '沖に船が見えます / 水に沈みます / 太陽が沈みます', '沖 is the sea away from the shore. 沈む describes something sinking, and also the sun going down. The subject is the thing that sinks or sets.', [
 ['491 に @大きい @船 が @見える~見えます~みえます','A large ship is visible offshore.'],
 ['@小さい @船 で 491 に @出る~出ました~でました','We went out to sea in a small boat.'],
 ['491 から @風 が @吹く~吹いています~ふいています','The wind is blowing from out at sea.'],
 ['@石 が @水 に 874~沈みました~しずみました','The stone sank in the water.'],
 ['@海 に 874~沈んだ~しずんだ @船 の @写真 を @見る~見ました~みました','I saw a photograph of a ship that had sunk in the sea.'],
 ['@太陽 が @海 に 874~沈む~しずむ の を @見る~見ました~みました','I watched the sun set over the sea.'],
 ['@水 の @中 に 874~沈んでいる~しずんでいる @物 は @何 です か','What is that thing submerged in the water?'],
 ['@太陽 が 874~沈む~しずむ @前 に @港 に @戻る~戻りました~もどりました','We returned to the port before sunset.'],
]);
lesson('island-boat-account','Taking a boat to an island',[], 'Boarding, traveling and coming back', 'Follow a trip from a busy port to an island and back in the evening.', [
 ['@朝 の @港 は 474 で 731 @する~していました~していました','The port was crowded with passengers in the morning.'],
 ['@船 は 474 を 755~乗せて~のせて 491 に @出る~出ました~でました','The boat took the passengers aboard and headed out to sea.'],
 ['@船 を 381 @する @人 に @島 まで の @時間 を @聞く~聞きました~ききました','I asked the person piloting the boat how long it would take to reach the island.'],
 ['@短い 624 でした が @大きい @波 が @ある~ありました~ありました','It was a short voyage, but there were large waves.'],
 ['@島 に @着く~着いて~ついて から @海 の @近く を @歩く~歩きました~あるきました','After arriving on the island, we walked near the sea.'],
 ['@帰り の @船 から @太陽 が 874~沈む~しずむ の を @見る~見ました~みました','We watched the sun set from the boat on the way back.'],
]);
useTopic('landscape');
lesson('countries-and-borders','Countries, continents and borders',[275,308,403,328,379], '首都 / ヨーロッパ / 大陸 / 国境 / 国籍', '首都 is a country’s capital city; 国境 is the border between countries. 大陸 is a continent. 国籍 is nationality or citizenship, rather than the place someone lives.', [
 ['@この @国 の 275 の @名前 を @知る~知っています~しっています か','Do you know the name of this country’s capital?'],
 ['@その @国 の 275 に @行く~行った~いった こと が @ある~あります~あります','I have been to that country’s capital.'],
 ['@地図 で 275 の @位置 を @調べる~調べました~しらべました','I checked the location of the capital on a map.'],
 ['@来年 308 を @旅行 @する @予定 です','I plan to travel around Europe next year.'],
 ['308 の @古い @町 の @写真 を @見る~見ました~みました','I saw photographs of old towns in Europe.'],
 ['@友達 は 308 に @住む~住んでいます~すんでいます','My friend lives in Europe.'],
 ['@この @島 は 403 から @遠い です','This island is far from the continent.'],
 ['@地図 に 403 の @名前 を @書く~書きました~かきました','I wrote the names of the continents on the map.'],
 ['@船 で 403 から @島 に @渡る~渡りました~わたりました','We crossed from the continent to the island by boat.'],
 ['@川 が @二つ の @国 の 328 に @なる~なっています~なっています','A river forms the border between the two countries.'],
 ['@車 で 328 を @越える~越えました~こえました','We crossed the border by car.'],
 ['328 の @近く の @町 に @泊まる~泊まりました~とまりました','We stayed in a town near the border.'],
 ['@紙 に @名前 と 379 を @書く~書きました~かきました','I wrote my name and nationality on the paper.'],
 ['@住む~住んでいる~すんでいる @国 と 379 は @違う~違います~ちがいます','The country I live in is different from the country of my nationality.'],
 ['@その @選手 の 379 を @調べる~調べました~しらべました','I looked up the athlete’s nationality.'],
]);
lesson('mountain-path-details','Along a mountain path',[256,414,543,553,847], '泉 / 泥 / 露 / 木の陰 / 頂上', '泉 is a natural spring. 泥 is mud; 露 is dew. 陰 is a shaded or hidden place, such as the shade of a tree. 頂上 is the top of a mountain or another high place.', [
 ['@山 の @中 に 256 が @ある~ありました~ありました','There was a spring in the mountains.'],
 ['256 の @水 は @冷たい~冷たかった~つめたかった です','The spring water was cold.'],
 ['@地図 で 256 の @場所 を @確認 @する~しました~しました','I checked the spring’s location on the map.'],
 ['@雨 の @後 で @道 に 414 が @多い~多かった~おおかった です','There was a lot of mud on the path after the rain.'],
 ['@靴 に 414 が @つく~ついてしまいました~ついてしまいました','Mud got on my shoes.'],
 ['@帰る~帰って~かえって から @靴 の 414 を @落とす~落としました~おとしました','I cleaned the mud off my shoes after getting home.'],
 ['@朝 @草 に 543 が @つく~ついていました~ついていました','There was dew on the grass in the morning.'],
 ['543 で @靴 が @濡れる~濡れました~ぬれました','My shoes got wet from the dew.'],
 ['@葉 の @上 の 543 を @写真 に @撮る~撮りました~とりました','I photographed the dew on the leaves.'],
 ['@暑い から @木 の 553 で @休む~休みましょう~やすみましょう','It is hot, so let’s rest in the shade of a tree.'],
 ['@大きい 172 の 553 に @座る~座りました~すわりました','I sat in the shade of a large rock.'],
 ['@木 の 553 を @選ぶ~選んで~えらんで @歩く~歩きました~あるきました','I chose to walk in the shade of the trees.'],
 ['@昼 @前 に @山 の 847 に @着く~着きました~つきました','We reached the summit before noon.'],
 ['847 から @町 が @見える~見えました~みえました','We could see the town from the summit.'],
 ['847 まで @まだ @遠い です か','Is it still far to the summit?'],
]);
lesson('regions-and-tropics','Regions and tropical places',[903,914], 'この一帯 / 熱帯の森林', '一帯 refers to a whole surrounding area. 熱帯 is the tropical climate zone; 熱帯の describes something in or associated with the tropics.', [
 ['@この 903 に は @湖 が @多い です','There are many lakes throughout this area.'],
 ['@山 の 903 は @雪 で @白い~白く~しろく @なる~なっていました~なっていました','The whole mountain area was white with snow.'],
 ['@川 の @近く の 903 を @歩く~歩きました~あるきました','I walked around the whole area near the river.'],
 ['914 の 1760 の @写真 を @見る~見ました~みました','I saw photographs of tropical forests.'],
 ['@この @植物 は 914 に @多い です','This plant is common in the tropics.'],
 ['914 の @国 を @旅行 @する~しました~しました','I traveled in a tropical country.'],
 ['@先生 は 914 の @雨 について @説明 @する~しました~しました','The teacher explained rainfall in the tropics.'],
]);
lesson('morning-climb-account','An early climb',[], 'From the wet grass to the summit', 'Follow a morning walk up a mountain, with observations along the path and a rest on the way.', [
 ['@朝 @山 の @近く の @ホテル を @出る~出ました~でました','In the morning, we left the hotel near the mountain.'],
 ['@草 に 543 が @つく~ついていて~ついていて @靴 が @濡れる~濡れました~ぬれました','There was dew on the grass, and our shoes got wet.'],
 ['@道 の 414 を @見る~見て~みて @ゆっくり @歩く~歩きました~あるきました','We saw the mud on the path and walked slowly.'],
 ['@途中 で 256 を @見つける~見つけました~みつけました','We found a spring along the way.'],
 ['@木 の 553 に @座る~座って~すわって @少し @休む~休みました~やすみました','We sat in the shade of a tree and rested for a while.'],
 ['847 に @着く~着いて~ついて から 903 の @景色 を 842~眺めました~ながめました','After reaching the summit, we gazed at the scenery all around.'],
 ['@帰る @前 に @靴 の 414 を @落とす~落としました~おとしました','We cleaned the mud off our shoes before going home.'],
]);
useTopic('directions');
lesson('lost-and-looking','Getting lost and looking around',[617,752,509,589], '道に迷います / 迷子 / あちこち / 見かけます', '道に迷う means losing your way. 迷子 is a lost child or person. 見かける means catching sight of someone or something, often by chance. あちこち describes several different places.', [
 ['@初めて の @町 で @道 に 617~迷いました~まよいました','I lost my way in an unfamiliar town.'],
 ['617~迷わない~まよわない ように @地図 を @持つ~持って~もって @行く~行きます~いきます','I take a map so I will not get lost.'],
 ['@駅 まで の @道 に 617~迷って~まよって @人 に @聞く~聞きました~ききました','I lost my way to the station and asked someone for directions.'],
 ['@駅 で 752 の @子供 を @見つける~見つけました~みつけました','I found a lost child at the station.'],
 ['@店 で 752 に @なる~なった~なった @子供 が @泣く~泣いていました~ないていました','A child who had become lost in the shop was crying.'],
 ['752 の @子供 と @一緒 に @親 を @待つ~待ちました~まちました','I waited with the lost child for their parent.'],
 ['@町 の 509 を @歩く~歩きました~あるきました','I walked around different parts of town.'],
 ['@鍵 を @探す~探して~さがして 509 @見る~見ました~みました','I looked here and there for my key.'],
 ['@この 903 の 509 に @花 が @咲く~咲いています~さいています','Flowers are blooming here and there throughout this area.'],
 ['@駅 で @友達 を 589~見かけました~みかけました','I happened to see a friend at the station.'],
 ['@近く で @赤い @車 を 589~見かけませんでした~みかけませんでした か','Did you happen to see a red car nearby?'],
 ['@この @道 で は @猫 を @よく 589~見かけます~みかけます','I often see cats along this road.'],
]);
lesson('going-to-tokyo','Going to Tokyo',[878], '上京します', '上京 usually means going to Tokyo from another part of Japan. The visit can be short, or it can be a move for work or study.', [
 ['@大学 に @入る @ため に 878 @する~しました~しました','I moved to Tokyo to attend university.'],
 ['@来週 @仕事 で 878 @する @予定 です','I plan to go to Tokyo for work next week.'],
 ['@母 が 878 @する~した~した @時 に @一緒 に @食事 を @する~しました~しました','When my mother came to Tokyo, we had a meal together.'],
 ['@初めて 878 @する~した~した @日 は @駅 の 731 に @驚く~驚きました~おどろきました','On my first day in Tokyo, I was surprised by the crowds at the station.'],
]);
lesson('finding-the-hotel-account','Finding a hotel in a new city',[], 'A wrong turn and some help', 'Follow a visitor asking for directions and finding the hotel after getting lost.', [
 ['@仕事 で 878 @する~して~して @大きい @駅 を @出る~出ました~でました','I went to Tokyo for work and came out of a large station.'],
 ['@道 に 617~迷って~まよって @町 の 509 を @歩く~歩いてしまいました~あるいてしまいました','I lost my way and ended up walking all around town.'],
 ['@小さい @店 の @前 で @地図 を @見る~見ました~みました','I looked at the map in front of a small shop.'],
 ['@店 の @人 に @ホテル まで の 2470 を @聞く~聞きました~ききました','I asked someone at the shop for directions to the hotel.'],
 ['@駅 で 589~見かけた~みかけた @赤い @車 が @ホテル の @前 に @ある~ありました~ありました','The red car I had seen at the station was in front of the hotel.'],
 ['@次 は 617~迷わない~まよわない ように @道 を @覚える~覚えました~おぼえました','I learned the route so I would not get lost next time.'],
]);
useTopic('plants');
lesson('fields-and-crops','Open fields and crops',[100,866], '野の花 / 作物を育てます', '野 refers to open fields or countryside and often appears in descriptions of nature, such as 野の花. 作物 means plants grown for food or other agricultural use.', [
 ['100 の @花 を @写真 に @撮る~撮りました~とりました','I photographed wildflowers in the open fields.'],
 ['@広い 100 を @風 が @吹く~吹いています~ふいています','The wind is blowing across the wide fields.'],
 ['@朝 の 100 に @鳥 の @声 が @聞こえる~聞こえました~きこえました','Birdsong could be heard in the fields in the morning.'],
 ['@この @土地 で は @多い~多く~おおく の @種類 の 866 を @育てる~育てています~そだてています','They grow many kinds of crops on this land.'],
 ['@雨 が @少ない~少なかった~すくなかった から 866 が 2292~枯れました~かれました','There was little rain, and the crops withered.'],
 ['@今年 の 866 は @いい~よく~よく 738~育ちました~そだちました','This year’s crops grew well.'],
 ['100 を @歩く~歩いて~あるいて から @近く の 866 を @見る~見ました~みました','After walking through the fields, I looked at the crops nearby.'],
 ['@風 が @強い~強かった~つよかった です が 866 は @大丈夫 でした','The wind was strong, but the crops were all right.'],
]);
useTopic('animals');
lesson('creatures-and-extinction','Living things and extinction',[332,412], '生き物 / 絶滅の危険', '生き物 means a living thing or creature. 絶滅 describes an entire kind of living thing dying out, rather than the death of one animal.', [
 ['@川 に は @小さい 332 が @たくさん @いる~います~います','There are many small creatures in the river.'],
 ['@海 の 332 について @調べる~調べています~しらべています','I am learning about sea creatures.'],
 ['332 を @見る~見る~みる の が @好き です','I like watching living creatures.'],
 ['@この @動物 は 412 の @危険 が @ある~あります~あります','This animal is at risk of extinction.'],
 ['@昔 412 @する~した~した @動物 の @骨 を @見る~見ました~みました','I saw the bones of an animal that became extinct long ago.'],
 ['412 の @原因 を @研究 @する~しています~しています','We are studying the causes of extinction.'],
 ['@森 を @守る こと は @多い~多く~おおく の 332 を @守る こと です','Protecting forests means protecting many living things.'],
 ['@鳥 の 412 について @本 を @読む~読みました~よみました','I read a book about birds becoming extinct.'],
]);
lesson('chasing-and-catching','Chasing and being caught',[772,647,788,210], 'ネズミ / 追います / 捕まります / 狩り', 'ネズミ can refer to mice or rats. 追う means chasing or following after something. 捕まる describes the one being caught. 狩り is hunting, whether done by people or other animals.', [
 ['@小さい 772 が @走る~走っていました~はしっていました','A small mouse was running along.'],
 ['772 が @食べ物 を @探す~探しています~さがしています','A mouse is looking for food.'],
 ['@昨日 @家 の @近く で 772 を 589~見かけました~みかけました','I saw a mouse near my house yesterday.'],
 ['@猫 が 772 を 647~追っています~おっています','The cat is chasing a mouse.'],
 ['@犬 が @鳥 を 647~追って~おって @走る~走りました~はしりました','The dog ran after a bird.'],
 ['@カメラ で @飛ぶ~飛んでいる~とんでいる @鳥 を 647~追いました~おいました','I followed the flying bird with my camera.'],
 ['772 が @猫 に 788~捕まりました~つかまりました','The mouse was caught by the cat.'],
 ['@小さい @魚 は @簡単 に 788~捕まりません~つかまりません','The small fish are not easy to catch.'],
 ['@虫 は 788~捕まらない~つかまらない ように @逃げる~逃げました~にげました','The insect fled to avoid being caught.'],
 ['@猫 の 210 を @遠い~遠く~とおく から @見る~見ました~みました','I watched the cat hunting from a distance.'],
 ['299 が 210 に @出る~出ました~でました','The tiger went out hunting.'],
 ['@昔 の @人 の 210 について @本 で @読む~読みました~よみました','I read about how people hunted in the past.'],
]);
lesson('river-wildlife-account','Watching life beside a river',[], 'Looking closely at small creatures', 'Follow what a visitor notices beside a river, then reads about at home.', [
 ['@朝 @川 の @近く の 100 を @歩く~歩きました~あるきました','In the morning, I walked through the fields near the river.'],
 ['@草 に 543 が @つく~ついていました~ついていました','There was dew on the grass.'],
 ['@木 の 553 で @小さい 332 を @探す~探しました~さがしました','I looked for small creatures in the shade of a tree.'],
 ['772 が @走る~走って~はしって @草 の @中 に @入る~入りました~はいりました','A mouse ran into the grass.'],
 ['@川 の @上 を @飛ぶ~飛ぶ~とぶ @鳥 を @カメラ で 647~追いました~おいました','I followed a bird flying above the river with my camera.'],
 ['@家 に @帰る~帰って~かえって から @川 の 332 と 412 の @危険 について @読む~読みました~よみました','After returning home, I read about river creatures and the risk of extinction.'],
]);
}
