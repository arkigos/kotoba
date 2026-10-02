export function authorPlacesDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@新幹線':'Shinkansen; bullet train','B1@終点':'last stop; terminus',
 'B1@満員':'full of people; at capacity','B1@通路':'aisle; passage',
 'B1@待合室':'waiting room','B1@ロビー':'lobby','B1@税関':'customs',
 'B1@出迎え':'going to meet someone arriving; pickup',
 'B1@有料':'requiring a fee; paid','B1@定員':'capacity; maximum number of people',
 'B1@深夜':'late at night','B1@夜間':'nighttime',
 'B1@平野':'plain; flat open land','B1@半島':'peninsula','B1@列島':'chain of islands; archipelago',
 'B1@火山':'volcano','B1@噴火':'volcanic eruption','B1@灯台':'lighthouse',
 'B1@地平線':'horizon over land','B1@水面':'surface of the water',
 'B1@周辺':'surrounding area; vicinity','B1@広場':'public square; plaza',
 'B1@都心':'city center; downtown','B1@手前':'this side of; just before reaching',
 'B1@両側':'both sides','B1@通り過ぎる':'to go past; to pass by',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('travel');
lesson('trains-and-terminus','Trains and the last stop',['B1@新幹線','B1@終点'],
 '新幹線 / 終点','終点 is the final stop on a route. It can refer to a train or bus route.',[
 ['B1@新幹線 で @遠い @町 に @行く~行きました~いきました','I went to a distant town by Shinkansen.'],
 ['B1@新幹線 の @切符 を @予約 @する~しました~しました','I reserved a Shinkansen ticket.'],
 ['B1@新幹線 の @窓 から @山 が @見える~見えました~みえました','I could see mountains from the Shinkansen window.'],
 ['@この @バス の B1@終点 は @駅 です','The last stop on this bus route is the station.'],
 ['B1@終点 で @電車 を @降りる~降りました~おりました','I got off the train at the last stop.'],
 ['B1@終点 まで の @時間 を @聞く~聞きました~ききました','I asked how long it would take to reach the last stop.'],
]);
lesson('crowding-and-aisles','Crowded vehicles and clear aisles',['B1@満員','B1@通路'],
 '満員です / 通路','満員 describes a vehicle or place full of people. 通路 is a passage or aisle that people use to move through a space.',[
 ['@朝 の @バス は B1@満員 でした','The morning bus was full.'],
 ['B1@満員 の @電車 で @立つ~立っていました~たっていました','I stood in the crowded train.'],
 ['@バス が B1@満員 でした から @次 の @バス を @待つ~待ちました~まちました','The bus was full, so I waited for the next one.'],
 ['B1@通路 に @荷物 を @置く~置かないで~おかないで ください','Please do not leave luggage in the aisle.'],
 ['B1@通路 を @歩く~歩いて~あるいて @出口 に @向かう~向かいました~むかいました','I walked along the passage toward the exit.'],
 ['@この @電車 の B1@通路 は @狭い です','The aisle on this train is narrow.'],
]);
lesson('waiting-places','Waiting rooms and lobbies',['B1@待合室','B1@ロビー'],
 '待合室 / ロビー','待合室 is a room for waiting, for example at a station or clinic. ロビー is a larger entrance or reception area, often in a hotel or theater.',[
 ['@駅 の B1@待合室 で @電車 を @待つ~待ちました~まちました','I waited for the train in the station waiting room.'],
 ['B1@待合室 に は @椅子 が @たくさん @ある~あります~あります','There are many chairs in the waiting room.'],
 ['@寒い から B1@待合室 に @入る~入りました~はいりました','I went into the waiting room because it was cold.'],
 ['@ホテル の B1@ロビー で @友達 に @会う~会いました~あいました','I met a friend in the hotel lobby.'],
 ['B1@ロビー の @時計 を @見る~見て~みて @時間 を @確認 @する~しました~しました','I checked the time on the lobby clock.'],
 ['@朝 は B1@ロビー で @集まる~集まりましょう~あつまりましょう','Let’s meet in the lobby in the morning.'],
]);
lesson('customs-and-pickup','Arrival and meeting someone',['B1@税関','B1@出迎え'],
 '税関 / 出迎えに行きます','税関 is customs, where goods entering a country may be checked. 出迎え is going to meet someone who is arriving; 出迎えに行く is a useful combination.',[
 ['B1@税関 で @荷物 を @開ける~開けました~あけました','I opened my luggage at customs.'],
 ['@空港 の B1@税関 で @質問 に @答える~答えました~こたえました','I answered questions at airport customs.'],
 ['B1@税関 を @通る~通って~とおって から @出口 に @向かう~向かいました~むかいました','After going through customs, I headed toward the exit.'],
 ['@父 の B1@出迎え に @空港 まで @行く~行きました~いきました','I went to the airport to meet my father.'],
 ['@友達 が @駅 まで B1@出迎え に @来る~来て~きて @くれる~くれました~くれました','My friend came to the station to meet me.'],
 ['B1@出迎え の @車 は @出口 の @前 で @待つ~待っています~まっています','The car coming to pick us up is waiting outside the exit.'],
]);
lesson('fees-and-capacity','Fees and capacity',['B1@有料','B1@定員'],
 '有料です / 定員','有料 means there is a fee. 定員 is the maximum number of people a vehicle, room or activity is intended to hold.',[
 ['@この @駐車場 は B1@有料 です','There is a charge for using this car park.'],
 ['B1@有料 の @道路 を @使う~使いました~つかいました','I used a toll road.'],
 ['@ホテル の @朝ごはん は B1@有料 です か','Is there a charge for breakfast at the hotel?'],
 ['@船 の B1@定員 を @確認 @する~しました~しました','I checked the boat’s passenger capacity.'],
 ['@この @車 の B1@定員 は @五 @人~人~にん です','This vehicle has a capacity of five people.'],
 ['B1@定員 が @少ない @バス を @予約 @する~しました~しました','I booked a bus with a small passenger capacity.'],
]);
lesson('nighttime-travel','Travel at night',['B1@深夜','B1@夜間'],
 '深夜 / 夜間','深夜 means late at night. 夜間 covers nighttime more generally and often appears in schedules and service information.',[
 ['@飛行機 は B1@深夜 に @着く~着きました~つきました','The plane arrived late at night.'],
 ['B1@深夜 の @駅 は @静か でした','The station was quiet late at night.'],
 ['B1@深夜 に @ホテル に @電話 @する~しました~しました','I phoned the hotel late at night.'],
 ['B1@夜間 は @この @入り口 を @使う~使って~つかって ください','Please use this entrance at night.'],
 ['B1@夜間 の @バス の @時間 を @調べる~調べました~しらべました','I checked the nighttime bus schedule.'],
 ['@この @道 は B1@夜間 @暗い です','This road is dark at night.'],
]);
lesson('late-arrival-account','Arriving late',[],
 '深夜 / 税関 / 出迎え','Follow the journey from the airport to the hotel.',[
 ['@私たち の @飛行機 は B1@深夜 に @空港 に @着く~着きました~つきました','Our plane arrived at the airport late at night.'],
 ['B1@税関 を @通る~通った~とおった @後 で @出口 に @行く~行きました~いきました','After going through customs, we went to the exit.'],
 ['B1@出迎え の @車 を @出口 の @近く で @待つ~待ちました~まちました','We waited near the exit for the car picking us up.'],
 ['@ホテル に @着く~着いて~ついて から B1@ロビー の @椅子 に @座る~座りました~すわりました','After arriving at the hotel, we sat on chairs in the lobby.'],
 ['@ホテル の @朝ごはん は B1@有料 でした','Breakfast at the hotel cost extra.'],
]);
useTopic('landscape');
lesson('plains-and-coastlines','Plains, peninsulas and island chains',['B1@平野','B1@半島','B1@列島'],
 '平野 / 半島 / 列島','平野 is a broad area of flat land. A 半島 extends into the sea while remaining connected to land. 列島 describes a chain of islands.',[
 ['@広い B1@平野 に @村 が @ある~あります~あります','There are villages on the broad plain.'],
 ['@山 の @上 から B1@平野 が @見える~見えました~みえました','I could see the plain from the mountaintop.'],
 ['B1@平野 を @電車 で @通る~通りました~とおりました','I traveled across the plain by train.'],
 ['B1@半島 の @先 に @小さい @町 が @ある~あります~あります','There is a small town at the tip of the peninsula.'],
 ['@地図 で B1@半島 の @形 を @見る~見ました~みました','I looked at the shape of the peninsula on the map.'],
 ['@車 で B1@半島 の @海 に @近い @道 を @走る~走りました~はしりました','I drove along a road near the sea on the peninsula.'],
 ['@地図 で B1@列島 の @形 を @調べる~調べました~しらべました','I studied the shape of the island chain on the map.'],
 ['@船 で B1@列島 の @島 を @訪ねる~訪ねました~たずねました','I visited an island in the archipelago by boat.'],
 ['@この B1@列島 に は @人 が @住む~住んでいる~すんでいる @島 も @ある~あります~あります','This island chain also includes inhabited islands.'],
]);
lesson('volcano-and-eruption','Volcanoes and eruptions',['B1@火山','B1@噴火'],
 '火山 / 噴火します','火山 names the volcano. 噴火 is an eruption and also combines with する.',[
 ['@遠く に B1@火山 が @見える~見えました~みえました','I could see a volcano in the distance.'],
 ['@地図 で B1@火山 の @位置 を @確認 @する~しました~しました','I checked the volcano’s location on the map.'],
 ['@この @本 は B1@火山 について @説明 @する~しています~しています','This book explains volcanoes.'],
 ['@昔 @この B1@火山 が B1@噴火 @する~しました~しました','This volcano erupted long ago.'],
 ['B1@噴火 の @後 で @道 が @通る~通れなくなりました~とおれなくなりました','The road became impassable after the eruption.'],
 ['B1@噴火 について の @ニュース を @聞く~聞きました~ききました','I heard news about the eruption.'],
]);
lesson('lights-and-horizons','Lighthouses, horizons and water',['B1@灯台','B1@地平線','B1@水面'],
 '灯台 / 地平線 / 水面','灯台 is a lighthouse. 地平線 is the horizon over land. 水面 is the surface of water, such as a lake or sea.',[
 ['@海 の @近く に @白い B1@灯台 が @ある~あります~あります','There is a white lighthouse near the sea.'],
 ['@船 から B1@灯台 の @光 が @見える~見えました~みえました','I could see the lighthouse’s light from the boat.'],
 ['B1@灯台 の @前 で @写真 を @撮る~撮りました~とりました','I took a photo in front of the lighthouse.'],
 ['B1@平野 の @向こう に B1@地平線 が @見える~見えます~みえます','The horizon is visible beyond the plain.'],
 ['B1@地平線 の @近く の @空 が @赤い~赤く~あかく @なる~なりました~なりました','The sky near the horizon turned red.'],
 ['@広い B1@平野 で B1@地平線 を B1@眺める~眺めました~ながめました','I gazed at the horizon across the broad plain.'],
 ['@湖 の B1@水面 が @光る~光っています~ひかっています','The surface of the lake is shining.'],
 ['@葉 が B1@水面 に B1@浮く~浮いています~ういています','A leaf is floating on the water’s surface.'],
 ['B1@水面 の @近く に @魚 が @いる~いました~いました','There was a fish near the surface of the water.'],
]);
lesson('peninsula-trip-account','Around a peninsula',[],
 '半島 / 灯台 / 水面','Follow the changes in the view during a short trip.',[
 ['@朝 @車 で B1@平野 を @通る~通りました~とおりました','In the morning, we drove across the plain.'],
 ['@遠く の B1@火山 を @見る~見ながら~みながら B1@半島 に @向かう~向かいました~むかいました','We headed toward the peninsula while looking at the distant volcano.'],
 ['B1@半島 の @先 に @ある B1@灯台 に @着く~着きました~つきました','We arrived at the lighthouse at the tip of the peninsula.'],
 ['B1@灯台 の @前 から B1@列島 の @小さい @島 が @見える~見えました~みえました','From in front of the lighthouse, we could see small islands in the archipelago.'],
 ['@帰る @前 に @静か な B1@水面 を B1@眺める~眺めました~ながめました','Before going home, we gazed at the calm surface of the water.'],
]);
useTopic('directions');
lesson('city-places','Around the city',['B1@周辺','B1@広場','B1@都心'],
 '駅の周辺 / 広場 / 都心','周辺 is the area around a place. 広場 is an open public space or square. 都心 is the central part of a city, often used when talking about Tokyo.',[
 ['@駅 の B1@周辺 に @店 が @たくさん @ある~あります~あります','There are many shops around the station.'],
 ['@ホテル の B1@周辺 を @歩く~歩きました~あるきました','I walked around the area near the hotel.'],
 ['@この B1@周辺 に @病院 は @ある~あります~あります か','Is there a hospital around here?'],
 ['@駅 の @前 の B1@広場 で @友達 を @待つ~待ちました~まちました','I waited for a friend in the square outside the station.'],
 ['B1@広場 に @大きい @木 が @ある~あります~あります','There is a large tree in the square.'],
 ['@子供 が B1@広場 で @遊ぶ~遊んでいます~あそんでいます','Children are playing in the square.'],
 ['B1@都心 の @ホテル に @泊まる~泊まりました~とまりました','I stayed at a hotel in the city center.'],
 ['@ここ から B1@都心 まで @電車 で @行く~行きます~いきます','I will take the train from here to the city center.'],
 ['B1@都心 は @車 が @多い です','There are many cars in the city center.'],
]);
lesson('passing-and-position','Before it, beside it, past it',['B1@手前','B1@両側','B1@通り過ぎる'],
 '橋の手前 / 道の両側 / 通り過ぎます','手前 describes the nearer side or a point before reaching something. 両側 means both sides. 通り過ぎる means going past a place or person.',[
 ['@橋 の B1@手前 で @待つ~待って~まって ください','Please wait on this side of the bridge.'],
 ['@駅 の @少し B1@手前 に @店 が @ある~あります~あります','There is a shop a little before you reach the station.'],
 ['@交差点 の B1@手前 で @車 を @止める~止めました~とめました','I stopped the car before the intersection.'],
 ['@道 の B1@両側 に @木 が @ある~あります~あります','There are trees on both sides of the road.'],
 ['@川 の B1@両側 に @家 が @並ぶ~並んでいます~ならんでいます','Houses line both sides of the river.'],
 ['@入り口 の B1@両側 に @花 を @置く~置きました~おきました','We put flowers on both sides of the entrance.'],
 ['@店 を B1@通り過ぎる~通り過ぎて~とおりすぎて から B1@気づく~気づきました~きづきました','I noticed the shop after I had passed it.'],
 ['@バス が @私 の @前 を B1@通り過ぎる~通り過ぎました~とおりすぎました','A bus went past in front of me.'],
 ['@急ぐ~急いで~いそいで @歩く~歩いていた~あるいていた から @駅 を B1@通り過ぎる~通り過ぎました~とおりすぎました','I was walking in a hurry, so I walked past the station.'],
]);
lesson('city-walk-account','Walking to the square',[],
 '周辺 / 手前 / 両側','Follow the route from the hotel to the meeting place.',[
 ['B1@都心 の @ホテル の B1@周辺 を @歩く~歩きました~あるきました','I walked around the area near my hotel in the city center.'],
 ['@道 の B1@両側 に @小さい @店 が @並ぶ~並んでいました~ならんでいました','Small shops lined both sides of the street.'],
 ['@橋 の B1@手前 で @地図 を @見る~見ました~みました','I looked at the map before crossing the bridge.'],
 ['@駅 を B1@通り過ぎる~通り過ぎて~とおりすぎて @大きい B1@広場 に @着く~着きました~つきました','I went past the station and reached a large square.'],
 ['B1@広場 の @木 の @下 で @友達 に @会う~会いました~あいました','I met my friend under a tree in the square.'],
]);
}
