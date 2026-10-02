export function authorOutdoorsDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 911:'to load; to pile up',954:'to give up a seat; to give way',654:'space; interval',
 935:'signal; cue',658:'immediately; without delay',966:'interruption of service; closure',
 2008:'derailment',2115:'shipbuilding',1003:'frost',887:'to cover',
 1076:'rolling hills; hills',2389:'basin surrounded by higher ground',2234:'river basin; catchment area',
 1549:'joining; confluence',2858:'source; river source',483:'scene; sight',
 323:'tower',460:'moat',374:'flag',1000:'to be built; to be erected',1947:'traditional commercial and residential district in the low-lying part of a city',
 683:'to make fly; to send flying',948:'to peek; to look into',991:'to rush out; to jump out',
 1515:'grain; small particle',1130:'cotton plant',1969:'landmark; identifying mark',1491:'shop; store',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('travel');
lesson('loading-seats-and-spacing','Loading, seats and spacing',[911,954,654], '積みます / 譲ります / 間隔', '積む loads or stacks things. 譲る can give up a seat or give way to someone. 間隔 is the space or time between things, such as seats or departures.', [
 ['@車 に @荷物 を 911~積みました~つみました','We loaded the luggage into the car.'],
 ['@船 に @箱 を 911~積む~つむ @人 を @見る~見ました~みました','I saw people loading boxes onto a ship.'],
 ['@重い @箱 を @下 に 911~積んで~つんで ください','Please stack the heavy boxes at the bottom.'],
 ['@電車 で @席 を 954~譲りました~ゆずりました','I gave up my seat on the train.'],
 ['@後 から @来る~来た~きた @人 に @道 を 954~譲りました~ゆずりました','I made way for someone who came from behind.'],
 ['@私 は @友達 に @窓 の @近く の @席 を 954~譲ります~ゆずります','I will let my friend have the seat near the window.'],
 ['@この @バス の @席 の 654 は @広い です','The seats on this bus are spaced far apart.'],
 ['@電車 が @来る 654 を @確認 @する~しました~しました','I checked the intervals between trains.'],
 ['@箱 の 654 を @少し @広い~広く~ひろく @する~しました~しました','We increased the space between the boxes a little.'],
]);
lesson('signals-and-interrupted-service','Signals and interrupted service',[935,658,966], '合図 / 直ちに / 不通', '合図 is a signal or cue. 直ちに means immediately and often appears in formal announcements. 不通 describes an interrupted route or service; the surrounding words identify which one.', [
 ['2108 の 935 で @電車 が @動く~動きました~うごきました','The train moved at the conductor’s signal.'],
 ['@出発 の 935 を @待つ~待ちました~まちました','We waited for the departure signal.'],
 ['@手 で 935 を @送る~送りました~おくりました','I gave a signal with my hand.'],
 ['@放送 を @聞く~聞いて~きいて 658 @駅 の @人 に @連絡 @する~しました~しました','I heard the announcement and immediately contacted a station worker.'],
 ['@問題 に 480~気づいて~きづいて 658 @報告 @する~しました~しました','I noticed the problem and reported it immediately.'],
 ['@運転手 は 658 @車 を @止める~止めました~とめました','The driver stopped the vehicle immediately.'],
 ['@雪 で @電車 が 966 に @なる~なりました~なりました','Train service was suspended because of snow.'],
 ['@この @道 は @昨日 から 966 です','This road has been closed since yesterday.'],
 ['966 に @なる~なった~なった @理由 を @駅 で @聞く~聞きました~ききました','I asked at the station why the service had been interrupted.'],
]);
lesson('rail-accidents-and-shipbuilding','Transport in the news',[2008,2115], '脱線 / 造船', '脱線 here means a train leaving its rails. 造船 is the building of ships.', [
 ['@新聞 で @電車 の 2008 について @読む~読みました~よみました','I read about a train derailment in the newspaper.'],
 ['2008 の @原因 を @調べる~調べています~しらべています','They are investigating the cause of the derailment.'],
 ['2008 の @後 、 @電車 は @止まる~止まっていました~とまっていました','The trains were stopped after the derailment.'],
 ['@この @町 で は 2115 が @盛ん です','Shipbuilding is a major activity in this town.'],
 ['2115 の @工場 に @行く~行きました~いきました','We went to a shipbuilding factory.'],
 ['@港 の @博物館 で 2115 の @歴史 を @知る~知りました~しりました','I learned about the history of shipbuilding at the harbor museum.'],
]);
lesson('a-changed-departure-account','A changed departure',[], 'Adjusting a journey', 'Follow travelers changing their route after a service interruption.', [
 ['@駅 で @電車 が 966 に @なる~なった~なった こと を @聞く~聞きました~ききました','At the station, we heard that train service had been interrupted.'],
 ['658 @友達 に @電話 @する~して~して @バス で @行く こと を @決める~決めました~きめました','We called our friend immediately and decided to go by bus.'],
 ['@バス に @荷物 を 911~積んで~つんで @席 に @座る~座りました~すわりました','We loaded our luggage onto the bus and sat down.'],
 ['@友達 に @窓 の @近く の @席 を 954~譲りました~ゆずりました','I let my friend have the seat near the window.'],
 ['@運転手 の 935 で @出発 @する~しました~しました','We departed at the driver’s signal.'],
]);
useTopic('weather');
lesson('frost-and-a-covering-of-snow','Frost and a covering of snow',[1003,887], '霜 / 覆います', '霜 is frost. 覆う means covering something; its object can be a mountain, a field or the sky. 覆われる describes what is covered.', [
 ['@朝 、 @庭 に 1003 が @ある~ありました~ありました','There was frost in the garden in the morning.'],
 ['1003 で @葉 が @白い~白く~しろく @なる~なりました~なりました','The leaves turned white with frost.'],
 ['@日 が @出る~出て~でて 1003 が 967~溶けました~とけました','The sun came out and the frost melted.'],
 ['@雪 が @山 を 887~覆っています~おおっています','Snow covers the mountains.'],
 ['@黒い @雲 が @空 を 887~覆いました~おおいました','Dark clouds covered the sky.'],
 ['616 に 887~覆われた~おおわれた @町 を @見る~見ました~みました','I saw the town covered in fog.'],
]);
useTopic('landscape');
lesson('hills-basins-and-rivers','Hills, basins and rivers',[1076,2389,2234], '丘陵 / 盆地 / 流域', '丘陵 refers to hills or rolling hilly land. 盆地 is a basin surrounded by higher ground. 流域 is the area whose water drains into a river, rather than just the riverbank.', [
 ['@町 の @北 に 1076 が 449~広がっています~ひろがっています','Hills stretch north of the town.'],
 ['1076 を @歩く~歩いて~あるいて @景色 を @見る~見ました~みました','We walked through the hills and looked at the scenery.'],
 ['@地図 で 1076 の @位置 を @確認 @する~しました~しました','We checked the location of the hills on the map.'],
 ['@この @町 は 2389 に @ある~あります~あります','This town is in a basin.'],
 ['@山 から 2389 の @町 を 842~眺めました~ながめました','We looked over the town in the basin from the mountain.'],
 ['2389 の @中 に @川 が @ある~あります~あります','There is a river in the basin.'],
 ['@この @川 の 2234 に @住む~住んでいます~すんでいます','I live in this river basin.'],
 ['2234 の @地図 を @見る~見ました~みました','We looked at a map of the river basin.'],
 ['@川 の 2234 で @雨 が @降る~降りました~ふりました','It rained in the river’s catchment area.'],
]);
lesson('joining-rivers-and-their-sources','Joining rivers and their sources',[1549,2858,483], '合流 / 源 / 光景', '合流 is joining together: rivers can meet, and so can groups of people. 源 is a source or origin. 光景 is a scene you see, including what is happening there.', [
 ['@二つ の @川 が @ここ で 1549 @する~します~します','The two rivers meet here.'],
 ['@川 が 1549 @する @場所 に @橋 が @ある~あります~あります','There is a bridge where the rivers join.'],
 ['@駅 で @友達 の @グループ と 1549 @する~しました~しました','We joined our friends’ group at the station.'],
 ['@川 の 2858 は @山 の @中 に @ある~あります~あります','The river’s source is in the mountains.'],
 ['@地図 で @川 の 2858 を @探す~探しました~さがしました','We looked for the river’s source on the map.'],
 ['@この 256 は @町 の @水 の 2858 です','This spring is a source of the town’s water.'],
 ['@朝 の @港 の 483 を @写真 に @撮る~撮りました~とりました','I photographed the scene at the harbor in the morning.'],
 ['@山 から @見る 483 は @美しい です','The view from the mountain is beautiful.'],
 ['@祭り の 483 を @今 も @覚える~覚えています~おぼえています','I still remember the scene at the festival.'],
]);
lesson('a-walk-above-a-river-account','A walk above a river',[], 'Following the landscape', 'Follow walkers comparing a map with the rivers and land around them.', [
 ['@友達 と 1076 の @道 を @歩く~歩きました~あるきました','I walked along a path in the hills with a friend.'],
 ['@下 に 2389 の @町 が @見える~見えました~みえました','We could see the town in the basin below.'],
 ['@二つ の @川 が 1549 @する @場所 を @地図 で @確認 @する~しました~しました','We checked the place where the two rivers meet on the map.'],
 ['@川 の 2858 が @ある @山 は @雪 に 887~覆われていました~おおわれていました','The mountain where the river begins was covered in snow.'],
 ['@その 483 を @写真 に @撮る~撮って~とって から @町 に @戻る~戻りました~もどりました','We photographed the scene before returning to town.'],
]);
useTopic('directions');
lesson('landmarks-in-an-old-town','Landmarks in an old town',[323,460,374,1969], '塔 / 堀 / 旗 / 目印', '塔 is a tower, and 堀 here is a moat around a castle. 旗 is a flag. 目印 is a landmark or identifying mark that helps you find a person or place.', [
 ['@高い 323 を 1969 に @歩く~歩きました~あるきました','We used the tall tower as a landmark while walking.'],
 ['323 の @上 から @町 を @見る~見ました~みました','We looked over the town from the top of the tower.'],
 ['@教会 の 323 が @遠く に @見える~見えます~みえます','The church tower is visible in the distance.'],
 ['@城 の @周り に 460 が @ある~あります~あります','There is a moat around the castle.'],
 ['460 の @上 の @橋 を @渡る~渡りました~わたりました','We crossed a bridge over the moat.'],
 ['460 の @水 は @雨 の @後 で @増える~増えました~ふえました','The water in the moat increased after the rain.'],
 ['@駅 の @前 に @赤い 374 が @ある~あります~あります','There is a red flag in front of the station.'],
 ['@子供 が @小さい 374 を @持つ~持っていました~もっていました','A child was holding a small flag.'],
 ['374 の @下 で @友達 を @待つ~待ちました~まちました','I waited for my friend under the flag.'],
 ['1969 の @建物 を @写真 に @撮る~撮りました~とりました','I photographed the landmark building.'],
 ['@赤い 374 を 1969 に @店 を @探す~探しました~さがしました','We looked for the shop using the red flag as a landmark.'],
]);
lesson('buildings-and-old-shopping-streets','Buildings and old shopping streets',[1000,1947,1491], '建ちます / 下町 / 商店', '建つ describes a building being erected. 下町 often suggests a city’s older commercial and residential districts, traditionally in low-lying areas. 商店 is a shop or store.', [
 ['@駅 の @近く に @新しい @ホテル が 1000~建ちました~たちました','A new hotel was built near the station.'],
 ['@川 の @横 に @家 が 1000~建っています~たっています','A house stands beside the river.'],
 ['@ここ に @学校 が 1000~建つ~たつ @予定 です','A school is planned to be built here.'],
 ['1947 の 1491 を @見る~見て~みて @歩く~歩きました~あるきました','We walked around looking at the shops in the old downtown district.'],
 ['@祖母 は 1947 に @住む~住んでいました~すんでいました','My grandmother used to live in the old downtown district.'],
 ['1947 の @生活 について @本 を @読む~読みました~よみました','I read a book about life in the old downtown district.'],
 ['@この 1491 で 415 を @買う~買いました~かいました','I bought a souvenir at this shop.'],
 ['@駅 の @前 の 1491 に @入る~入りました~はいりました','I went into the shop in front of the station.'],
]);
lesson('a-town-walk-account','A walk through town',[], 'Meeting and finding the way', 'Follow two friends meeting by a flag and exploring an older district.', [
 ['@駅 の @前 の 374 の @下 で @友達 と 1549 @する~しました~しました','I met up with my friend under the flag in front of the station.'],
 ['@遠く に @見える 323 を 1969 に @歩く~歩きました~あるきました','We walked using the tower visible in the distance as a landmark.'],
 ['@城 の 460 の @上 の @橋 を @渡る~渡りました~わたりました','We crossed the bridge over the castle moat.'],
 ['@新しい @店 が 1000~建った~たった @場所 を @通る~通りました~とおりました','We passed the place where a new shop had been built.'],
 ['1947 で @食事 を @する~して~して @駅 に @戻る~戻りました~もどりました','We ate in the old downtown district and returned to the station.'],
]);
useTopic('leisure');
lesson('flying-peeking-and-jumping-out','Flying, peeking and jumping out',[683,948,991], '飛ばします / 覗きます / 飛び出します', '飛ばす makes something fly, such as a paper plane. 覗く is looking into or through something. 飛び出す describes sudden movement out of a place; watch which thing or person is moving.', [
 ['@子供 が @紙 の @飛行機 を 683~飛ばしました~とばしました','The child flew a paper airplane.'],
 ['@紙 の @飛行機 を @遠く まで 683~飛ばしました~とばしました','I flew the paper airplane a long way.'],
 ['@風 が @帽子 を 683~飛ばしました~とばしました','The wind blew the hat away.'],
 ['@窓 から @庭 を 948~覗きました~のぞきました','I looked into the garden through the window.'],
 ['@小さい @店 を 948~覗いて~のぞいて から @帰る~帰りました~かえりました','I took a quick look inside the small shop before going home.'],
 ['@箱 の @中 を 948~覗く~のぞく @子供 が @いる~います~います','There is a child peeking into the box.'],
 ['@猫 が @部屋 から 991~飛び出しました~とびだしました','The cat dashed out of the room.'],
 ['@道 に 991~飛び出さないで~とびださないで ください','Please do not run out into the road.'],
 ['@部屋 から 991~飛び出した~とびだした @犬 を @呼ぶ~呼びました~よびました','I called the dog that had dashed out of the room.'],
]);
useTopic('plants');
lesson('grains-and-cotton-plants','Grains and cotton plants',[1515,1130], '粒 / わた', '粒 names a small grain or particle, such as a grain of rice. わた here is the cotton plant. The examples concern growing the plant, rather than cotton cloth.', [
 ['@米 の 1515 を @よく @見る~見ました~みました','I looked closely at the grains of rice.'],
 ['@大きい 1515 と @小さい 1515 を @比べる~比べました~くらべました','I compared large grains with small ones.'],
 ['@白い 1515 が @袋 の @中 に @ある~あります~あります','There are white grains in the bag.'],
 ['292 で 1130 を @育てる~育てています~そだてています','We grow cotton plants in the field.'],
 ['1130 の @花 を @写真 に @撮る~撮りました~とりました','I photographed a cotton flower.'],
 ['@学校 で 1130 が 738 @場所 を @調べる~調べました~しらべました','At school, we investigated where cotton plants grow.'],
]);
}
