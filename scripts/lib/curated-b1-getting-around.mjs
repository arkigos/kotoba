export function authorGettingAround({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@徒歩':'going on foot','B1@直通':'direct connection; through service',
 'B1@定期券':'commuter pass; season ticket','B1@ラッシュアワー':'rush hour',
 'B1@まもなく':'soon; shortly','B1@直前':'just before','B1@当日':'the day of an event',
 'B1@先頭':'front of a line or group','B1@行列':'queue; line of people',
 'B1@人ごみ':'crowd of people','B1@売店':'kiosk; small shop','B1@看板':'signboard; shop sign',
 'B1@標識':'sign; marker','B1@番地':'lot number; address number','B1@地名':'place name',
 'B1@電柱':'utility pole','B1@四つ角':'crossroads','B1@沿う':'to run along; to follow',
 'B1@下る':'to go down; to descend','B1@通りかかる':'to happen to pass by',
 'B1@立ち止まる':'to stop walking; to stand still','B1@引き返す':'to turn back',
 'B1@近寄る':'to approach; to draw near','B1@見上げる':'to look up at',
 'B1@見下ろす':'to look down at; to overlook','B1@巡る':'to travel around; to tour',
 'B1@すれ違う':'to pass each other; to miss meeting each other',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('travel');
lesson('commuting-and-connections','Commuting and direct connections',['B1@徒歩','B1@直通','B1@定期券','B1@ラッシュアワー'],
 '徒歩で / 直通 / 定期券 / ラッシュアワー','徒歩で means on foot. A 直通 service reaches a destination without a transfer; it may still stop on the way. 定期券 is a pass for repeated journeys over a set period.',[
 ['@駅 から @会社 まで B1@徒歩 で @行く~行きます~いきます','I go from the station to the office on foot.'],
 ['@この @道 は B1@徒歩 で @通る~通れます~とおれます','You can travel along this road on foot.'],
 ['@家 から @公園 まで は B1@徒歩 で @十~十~じゅっ @分~分~ぷん です','The park is ten minutes from my home on foot.'],
 ['@空港 まで B1@直通 の @電車 が @ある~あります~あります','There is a direct train to the airport.'],
 ['@この @バス は @駅 まで B1@直通 です','This bus goes directly to the station.'],
 ['B1@直通 の @電車 に @乗る~乗った~のった から @途中 で @乗り換える @必要 が @ある~ありませんでした~ありませんでした','I took a direct train, so I did not need to transfer along the way.'],
 ['@駅 で B1@定期券 を @買う~買いました~かいました','I bought a commuter pass at the station.'],
 ['B1@定期券 を @毎日 @使う~使っています~つかっています','I use my commuter pass every day.'],
 ['B1@定期券 の @値段 を @確認 @する~しました~しました','I checked the price of my commuter pass.'],
 ['@朝 の B1@ラッシュアワー は @電車 が @混む~混みます~こみます','The trains are crowded during the morning rush hour.'],
 ['B1@ラッシュアワー の @前 に @出発 @する~しました~しました','I left before rush hour.'],
 ['@この @駅 の B1@ラッシュアワー は @短い です','Rush hour at this station is short.'],
]);
lesson('the-day-and-the-last-moment','The day itself and the last moment',['B1@当日','B1@直前','B1@まもなく'],
 '当日 / 直前 / まもなく','当日 refers to the day of the event already being discussed. 直前 is immediately before something. まもなく means soon and is common in announcements.',[
 ['@旅行 の B1@当日 は @晴れる~晴れました~はれました','It was sunny on the day of the trip.'],
 ['@切符 は B1@当日 に @買う~買えます~かえます','You can buy a ticket on the day itself.'],
 ['@大会 の B1@当日 に @友達 と @会う~会いました~あいました','I met my friend on the day of the event.'],
 ['@出発 の B1@直前 に @電話 が @来る~来ました~きました','A call came just before departure.'],
 ['@電車 が @出る B1@直前 に @駅 に @着く~着きました~つきました','I arrived at the station just before the train left.'],
 ['@試合 の B1@直前 は @静か でした','It was quiet just before the match.'],
 ['B1@まもなく @電車 が @到着 @する~します~します','The train will arrive shortly.'],
 ['@受付 は B1@まもなく @始まる~始まります~はじまります','Registration will begin shortly.'],
 ['B1@まもなく @ホテル に @着く~着きます~つきます','We will reach the hotel soon.'],
]);
lesson('queues-and-crowds','Queues and crowds',['B1@先頭','B1@行列','B1@人ごみ'],
 '先頭 / 行列 / 人ごみ','先頭 is the front of a moving group or a line. 行列 is an ordered line of people; 人ごみ is a crowd without that implication.',[
 ['@先生 が @グループ の B1@先頭 を @歩く~歩いています~あるいています','The teacher is walking at the front of the group.'],
 ['@列 の B1@先頭 に @友達 が @いる~います~います','My friend is at the front of the line.'],
 ['B1@先頭 の @人 が @地図 を @持つ~持っています~もっています','The person at the front is holding a map.'],
 ['@店 の @前 に @長い B1@行列 が @できる~できています~できています','A long queue has formed in front of the shop.'],
 ['@切符 を @買う @人 の B1@行列 に @並ぶ~並びました~ならびました','I joined the queue of people buying tickets.'],
 ['B1@行列 は @ゆっくり @進む~進んでいます~すすんでいます','The queue is moving forward slowly.'],
 ['@駅 の @前 の B1@人ごみ から @出る~出ました~でました','I came out of the crowd in front of the station.'],
 ['B1@人ごみ の @中 で @友達 を @探す~探しました~さがしました','I looked for my friend in the crowd.'],
 ['@私 は B1@人ごみ が @苦手 です','I do not do well in crowds.'],
]);
lesson('a-trip-on-event-day-account','Travelling on the day of an event',[],
 '当日 / 徒歩 / 直通 / 行列','Follow the journey from home to the event entrance.',[
 ['@大会 の B1@当日 @私 は @早い~早く~はやく @家 を @出る~出ました~でました','On the day of the event, I left home early.'],
 ['@駅 まで B1@徒歩 で @行く~行って~いって B1@定期券 を @使う~使いました~つかいました','I walked to the station and used my commuter pass.'],
 ['B1@ラッシュアワー の @前 で @電車 は @混む~混んでいませんでした~こんでいませんでした','It was before rush hour, and the train was not crowded.'],
 ['@会場 の @近く まで B1@直通 の @電車 で @行く~行きました~いきました','I took a direct train that brought me close to the venue.'],
 ['@入り口 に は @切符 を @買う @人 の B1@行列 が @ある~ありました~ありました','There was a queue at the entrance for tickets.'],
 ['@私 は @前 の @日 に @切符 を @買う~買っていました~かっていました','I had bought my ticket the day before.'],
 ['@中 に @入る~入った~はいった @後 B1@まもなく @大会 が @始まる~始まりました~はじまりました','The event began shortly after I went inside.'],
]);
useTopic('directions');
lesson('shops-and-signs','Small shops and signs',['B1@売店','B1@看板','B1@標識'],
 '売店 / 看板 / 標識','売店 is a small shop or kiosk, often inside a larger place. 看板 identifies or advertises a place; 標識 marks a route, location or rule.',[
 ['@駅 の B1@売店 で @水 を @買う~買いました~かいました','I bought water at the station kiosk.'],
 ['@公園 の B1@売店 は @今日 @休み です','The park’s kiosk is closed today.'],
 ['@病院 の @中 に @小さい B1@売店 が @ある~あります~あります','There is a small shop inside the hospital.'],
 ['@青い B1@看板 の @店 を @探す~探しています~さがしています','I am looking for the shop with the blue sign.'],
 ['@店 の B1@看板 に @名前 が @書く~書かれています~かかれています','The name is written on the shop’s sign.'],
 ['@大きい B1@看板 が @遠い~遠く~とおく から @見える~見えます~みえます','The large sign can be seen from far away.'],
 ['@道 の B1@標識 を @見る~見ました~みました','I looked at the road sign.'],
 ['B1@標識 に @駅 の @方向 が @書く~書かれています~かかれています','The sign shows the direction of the station.'],
 ['@この B1@標識 の @意味 を @教える~教えて~おしえて ください','Please tell me what this sign means.'],
]);
lesson('addresses-and-landmarks','Addresses and landmarks',['B1@番地','B1@地名','B1@電柱'],
 '番地 / 地名 / 電柱','番地 is a number used in an address. 地名 names a place, while 電柱 is a utility pole that may serve as a landmark.',[
 ['@住所 の B1@番地 を @確認 @する~しました~しました','I checked the number in the address.'],
 ['@この B1@番地 は @地図 で @見つかる~見つかりません~みつかりません','I cannot find this address number on the map.'],
 ['B1@番地 を @間違える~間違えて~まちがえて @違う @家 に @行く~行きました~いきました','I got the address number wrong and went to the wrong house.'],
 ['@この B1@地名 は @何~何~なん と @読む~読みます~よみます か','How do you read this place name?'],
 ['@古い B1@地名 が @地図 に @ある~あります~あります','An old place name appears on the map.'],
 ['@二つ の @町 は @同じ B1@地名 を @使う~使っています~つかっています','The two towns use the same place name.'],
 ['@家 の @前 に B1@電柱 が @立つ~立っています~たっています','A utility pole stands in front of the house.'],
 ['@鳥 が B1@電柱 の @上 に @いる~います~います','A bird is on top of the utility pole.'],
 ['B1@電柱 の @横 で @友達 を @待つ~待ちました~まちました','I waited for my friend beside the utility pole.'],
]);
lesson('crossroads-and-river-routes','Crossroads, river routes and slopes',['B1@四つ角','B1@沿う','B1@下る'],
 '四つ角 / 川に沿って / 坂を下ります','四つ角 is where two streets cross. 沿う follows the line of something. 下る describes movement down a slope or along a river toward its lower reaches.',[
 ['@次 の B1@四つ角 を @右 に @曲がる~曲がって~まがって ください','Please turn right at the next crossroads.'],
 ['B1@四つ角 に @小さい B1@売店 が @ある~あります~あります','There is a small shop at the crossroads.'],
 ['@友達 と B1@四つ角 で @会う~会いました~あいました','I met my friend at the crossroads.'],
 ['@川 に B1@沿う~沿って~そって @歩く~歩きました~あるきました','I walked along the river.'],
 ['@海 に B1@沿う @道 を @選ぶ~選びました~えらびました','I chose a road that runs along the sea.'],
 ['B1@線路 に B1@沿う~沿って~そって @家 が @並ぶ~並んでいます~ならんでいます','Houses are lined up along the railway.'],
 ['@長い @坂 を B1@下る~下りました~くだりました','I went down a long slope.'],
 ['@船 で @川 を B1@下る~下りました~くだりました','I travelled downstream by boat.'],
 ['@山 を B1@下る~下って~くだって から @駅 に @向かう~向かいました~むかいました','After descending the mountain, I headed for the station.'],
]);
lesson('finding-a-small-shop-account','Finding a shop by the river',[],
 '番地 / 看板 / 四つ角 / 沿う','Use the address and landmarks to follow the route.',[
 ['@友達 に @店 の @住所 と B1@番地 を @聞く~聞きました~ききました','I asked my friend for the shop’s address and number.'],
 ['@友達 は @青い B1@看板 が @ある と @言う~言いました~いいました','My friend said there was a blue sign.'],
 ['@駅 から @歩く~歩いて~あるいて @最初 の B1@四つ角 を @左 に @曲がる~曲がりました~まがりました','I walked from the station and turned left at the first crossroads.'],
 ['@短い @坂 を B1@下る~下って~くだって @川 に @出る~出ました~でました','I went down a short slope and came to the river.'],
 ['@川 に B1@沿う~沿って~そって @少し @歩く~歩きました~あるきました','I walked a little way along the river.'],
 ['B1@電柱 の @近く に @青い B1@看板 の @店 が @ある~ありました~ありました','Near a utility pole was the shop with the blue sign.'],
]);
lesson('passing-stopping-and-turning-back','Passing, stopping and turning back',['B1@通りかかる','B1@立ち止まる','B1@引き返す'],
 '通りかかります / 立ち止まります / 引き返します','通りかかる means happening to pass a place. 立ち止まる stops your walking; 引き返す turns back along the way you came.',[
 ['@店 の @前 を B1@通りかかる~通りかかりました~とおりかかりました','I happened to pass in front of the shop.'],
 ['@公園 を B1@通りかかる~通りかかった~とおりかかった @時 に @友達 を @見る~見ました~みました','I saw my friend when I happened to pass the park.'],
 ['B1@通りかかる~通りかかった~とおりかかった @人 に @道 を @聞く~聞きました~ききました','I asked a passerby for directions.'],
 ['@橋 の @上 で B1@立ち止まる~立ち止まりました~たちどまりました','I stopped on the bridge.'],
 ['B1@標識 を @読む @ため に B1@立ち止まる~立ち止まりました~たちどまりました','I stopped to read the sign.'],
 ['@友達 が @急 に B1@立ち止まる~立ち止まった~たちどまった から @私 も @止まる~止まりました~とまりました','My friend stopped suddenly, so I stopped too.'],
 ['@道 を @間違える~間違えて~まちがえて B1@引き返す~引き返しました~ひきかえしました','I took the wrong road and turned back.'],
 ['@雨 が @強い~強く~つよく @なる~なった~なった から @家 に B1@引き返す~引き返しました~ひきかえしました','The rain became heavy, so I turned back toward home.'],
 ['@ここ から @駅 まで B1@引き返す~引き返しましょう~ひきかえしましょう','Let’s go back to the station from here.'],
]);
lesson('approaching-and-looking','Approaching and looking up or down',['B1@近寄る','B1@見上げる','B1@見下ろす'],
 '近寄ります / 見上げます / 見下ろします','近寄る draws closer to something. 見上げる looks upward; 見下ろす looks downward from a higher position in these examples.',[
 ['@小さい @文字 を @読む @ため に B1@看板 に B1@近寄る~近寄りました~ちかよりました','I moved closer to the sign to read the small letters.'],
 ['@犬 が @私 に B1@近寄る~近寄ってきました~ちかよってきました','The dog came closer to me.'],
 ['@危ない @場所 に B1@近寄る~近寄らないで~ちかよらないで ください','Please do not approach the dangerous area.'],
 ['@高い @建物 を B1@見上げる~見上げました~みあげました','I looked up at the tall building.'],
 ['@空 を B1@見上げる~見上げて~みあげて @雲 を @見る~見ました~みました','I looked up at the sky and watched the clouds.'],
 ['@子供 は @大きい @木 を B1@見上げる~見上げています~みあげています','The child is looking up at the large tree.'],
 ['@橋 から @川 を B1@見下ろす~見下ろしました~みおろしました','I looked down at the river from the bridge.'],
 ['@山 の @上 から @町 を B1@見下ろす~見下ろしました~みおろしました','I looked down over the town from the mountain.'],
 ['@この @部屋 から は @庭 を B1@見下ろす @こと が @できる~できます~できます','You can look down over the garden from this room.'],
]);
lesson('touring-and-passing-people','Touring places and passing people',['B1@巡る','B1@すれ違う'],
 '町を巡ります / 人とすれ違います','巡る visits places in a sequence. すれ違う can mean passing one another or missing an intended meeting.',[
 ['@バス で @古い @町 を B1@巡る~巡りました~めぐりました','I toured old towns by bus.'],
 ['@三つ の @寺 を B1@巡る @予定 です','We plan to visit three temples.'],
 ['@自転車 で @島 を B1@巡る~巡っています~めぐっています','I am touring the island by bicycle.'],
 ['@狭い @道 で @友達 と B1@すれ違う~すれ違いました~すれちがいました','I passed my friend on a narrow road.'],
 ['@廊下 で @先生 と B1@すれ違う~すれ違って~すれちがって @挨拶 @する~しました~しました','I passed my teacher in the corridor and greeted them.'],
 ['@友達 と は @駅 で B1@すれ違う~すれ違って~すれちがって @会う~会えませんでした~あえませんでした','My friend and I missed each other at the station and could not meet.'],
]);
lesson('a-walk-and-a-return-account','A walk beside the river',[],
 '巡る / 通りかかる / 見下ろす / 引き返す','Follow the walk, the pause on the bridge and the return route.',[
 ['@私たち は @古い @町 を B1@徒歩 で B1@巡る~巡りました~めぐりました','We toured the old town on foot.'],
 ['@小さい B1@売店 の @前 を B1@通りかかる~通りかかりました~とおりかかりました','We happened to pass a small shop.'],
 ['@川 に B1@沿う~沿って~そって @歩く~歩いて~あるいて @橋 に @着く~着きました~つきました','We walked along the river and reached a bridge.'],
 ['@橋 の @上 で B1@立ち止まる~立ち止まって~たちどまって @水 を B1@見下ろす~見下ろしました~みおろしました','We stopped on the bridge and looked down at the water.'],
 ['@帰る @途中 で @先生 と B1@すれ違う~すれ違いました~すれちがいました','We passed our teacher on the way back.'],
 ['@友達 は B1@売店 で @水 を @買う~買いたい~かいたい と @言う~言いました~いいました','My friend said they wanted to buy water at the small shop.'],
 ['@私たち は B1@売店 まで B1@引き返す~引き返しました~ひきかえしました','We went back to the shop.'],
]);
}
