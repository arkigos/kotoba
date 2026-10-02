export function authorRuralLandscapes({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@漁師':'fisher; fisherman','B1@漁業':'fishing industry; fishing as an occupation',
 'B1@水産':'fisheries; aquatic products','B1@農産物':'agricultural produce',
 'B1@牧畜':'livestock farming','B1@耕地':'cultivated land; arable land',
 'B1@運河':'canal; artificial waterway','B1@ダム':'dam','B1@地帯':'zone; belt; region',
 'B1@各地':'various places; places throughout an area','B1@地点':'point; specific location',
 'B1@区域':'defined area; zone','B1@境界':'boundary','B1@陸':'land, as opposed to water',
 'B1@貨物':'cargo; freight','B1@ヘリコプター':'helicopter','B1@足跡':'footprints; tracks',
 'B1@群れ':'flock; herd; group of animals','B1@獣':'beast; wild animal',
 'B1@湧く':'to spring up; to well up','B1@澄む':'to become clear',
 'B1@あふれる':'to overflow; to be overflowing','B1@険しい':'steep; rugged; difficult to climb',
 'B1@凸凹':'uneven; bumpy',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('animals');
lesson('fishing-people-and-industry','Fishing communities and their work',['B1@漁師','B1@漁業','B1@水産'],
 '漁師 / 漁業 / 水産',
 '漁師 (ryōshi) is a person who catches fish for a living. 漁業 (gyogyō) is fishing as an industry. 水産 (suisan) concerns products and industries connected with aquatic life.',[
 ['@港 で B1@漁師 に @話 を @聞く~聞きました~ききました','I listened to a fisher talk at the harbour.'],
 ['B1@漁師 は @朝 @早い~早く~はやく @船 で @出る~出ました~でました','The fisher went out by boat early in the morning.'],
 ['@父 は @この @町 の B1@漁師 です','My father is a fisher in this town.'],
 ['@この @地域 で は B1@漁業 が @大切 な @仕事 です','Fishing is important work in this region.'],
 ['B1@漁業 の @歴史 を @博物館 で @勉強 @する~しました~しました','I learned about the history of fishing at the museum.'],
 ['@若い @人 も B1@漁業 の @仕事 を @する~しています~しています','Young people also work in the fishing industry.'],
 ['@学校 で B1@水産 について @勉強 @する~しています~しています','I am studying fisheries at school.'],
 ['B1@水産 の @仕事 に @興味 が @ある~あります~あります','I am interested in work in fisheries.'],
 ['B1@水産 に @関係 が @ある @会社 を @訪ねる~訪ねました~たずねました','I visited a company connected with fisheries.'],
]);
lesson('produce-livestock-and-fields','Farm produce, livestock and cultivated land',['B1@農産物','B1@牧畜','B1@耕地'],
 '農産物 / 牧畜 / 耕地',
 '農産物 (nōsanbutsu) is produce grown through farming. 牧畜 (bokuchiku) raises farm animals. 耕地 (kōchi) is land used or suitable for growing crops.',[
 ['@この @地域 の B1@農産物 を @買う~買いました~かいました','I bought locally grown produce.'],
 ['B1@農産物 を @町 の @店 に @運ぶ~運びます~はこびます','We take farm produce to shops in town.'],
 ['@地域 によって B1@農産物 の @種類 が @違う~違います~ちがいます','The kinds of farm produce vary by region.'],
 ['@この @村 で は B1@牧畜 が @行う~行われています~おこなわれています','Livestock farming is carried out in this village.'],
 ['B1@牧畜 の @仕事 で @牛 を @育てる~育てています~そだてています','I raise cattle as part of my livestock-farming work.'],
 ['B1@牧畜 について @書く~書かれた~かかれた @本 を @読む~読みました~よみました','I read a book about livestock farming.'],
 ['@村 の @周り に B1@耕地 が B1@広がる~広がっています~ひろがっています','Cultivated land stretches around the village.'],
 ['B1@耕地 の @土 を @調べる~調べました~しらべました','We examined the soil in the cultivated land.'],
 ['@古い @地図 で B1@耕地 の @位置 を @確認 @する~しました~しました','I checked the location of the cultivated land on an old map.'],
]);
lesson('canals-dams-and-zones','Canals, dams and geographical zones',['B1@運河','B1@ダム','B1@地帯'],
 '運河 / ダム / 地帯',
 '運河 (unga) is an artificial waterway. ダム holds back water. 地帯 (chitai) describes an area with a shared geographical feature or use.',[
 ['@小さい @船 が B1@運河 を @通る~通りました~とおりました','A small boat passed through the canal.'],
 ['B1@運河 に B1@沿う~沿って~そって @歩く~歩きました~あるきました','I walked along the canal.'],
 ['@この B1@運河 は @町 の @中心 を @通る~通っています~とおっています','This canal runs through the centre of town.'],
 ['@山 の @中 に @大きい B1@ダム が @ある~あります~あります','There is a large dam in the mountains.'],
 ['B1@ダム の @水 の @量 を @調べる~調べました~しらべました','We checked the amount of water in the dam.'],
 ['@バス で B1@ダム を @訪ねる~訪ねました~たずねました','We visited the dam by bus.'],
 ['@この B1@地帯 に は @工場 が @多い です','There are many factories in this zone.'],
 ['@海岸 の B1@地帯 を @地図 で @確認 @する~しました~しました','We checked the coastal zone on the map.'],
 ['@山 が @多い B1@地帯 に @住む~住んでいます~すんでいます','I live in a mountainous area.'],
]);
lesson('places-points-areas-and-boundaries','Places, points, areas and boundaries',['B1@各地','B1@地点','B1@区域','B1@境界'],
 '各地 / 地点 / 区域 / 境界',
 '各地 (kakuchi) refers to various places. 地点 (chiten) pinpoints a location. 区域 (kuiki) defines an area; 境界 (kyōkai) is the boundary between areas.',[
 ['B1@各地 の @料理 を @食べる~食べました~たべました','I tried food from various regions.'],
 ['B1@各地 から @人 が @集まる~集まりました~あつまりました','People gathered from various places.'],
 ['@旅行 の @前 に B1@各地 の @天気 を @調べる~調べました~しらべました','I checked the weather in various places before the trip.'],
 ['@地図 の @この B1@地点 で @会う~会いましょう~あいましょう','Let’s meet at this point on the map.'],
 ['@事故 が @起こる~起こった~おこった B1@地点 を @確認 @する~しました~しました','We checked the location where the accident happened.'],
 ['@同じ B1@地点 から @写真 を @撮る~撮りました~とりました','I took photographs from the same point.'],
 ['@この B1@区域 に は @車 で @入る~入れません~はいれません','Cars cannot enter this area.'],
 ['@新しい B1@区域 の @地図 を @見る~見ました~みました','I looked at a map of the new area.'],
 ['B1@区域 の @外 に @駐車場 が @ある~あります~あります','There is a car park outside the area.'],
 ['@二つ の @町 の B1@境界 に @橋 が @ある~あります~あります','There is a bridge on the boundary between the two towns.'],
 ['B1@境界 を @地図 に @書く~書きました~かきました','I marked the boundary on the map.'],
 ['@川 が @国 と @国 の B1@境界 に @なる~なっています~なっています','The river forms the boundary between the countries.'],
]);
lesson('land-cargo-and-helicopters','Land, cargo and helicopters',['B1@陸','B1@貨物','B1@ヘリコプター'],
 '陸 / 貨物 / ヘリコプター',
 '陸 is read riku here and contrasts land with water. 貨物 (kamotsu) is cargo carried by a vehicle or ship. ヘリコプター is a helicopter.',[
 ['@船 から B1@陸 が @見える~見えました~みえました','We could see land from the ship.'],
 ['@長い B1@航海 の @後 で B1@陸 に @上がる~上がりました~あがりました','We went ashore after a long sea voyage.'],
 ['B1@陸 は @まだ @遠い です','Land is still far away.'],
 ['B1@貨物 を @船 に B1@積む~積みました~つみました','We loaded cargo onto the ship.'],
 ['B1@貨物 を @運ぶ @列車 を @見る~見ました~みました','I saw a train carrying freight.'],
 ['@港 で B1@貨物 の @内容 を @確認 @する~しました~しました','We checked the contents of the cargo at the harbour.'],
 ['@空 に B1@ヘリコプター が @見える~見えました~みえました','I saw a helicopter in the sky.'],
 ['B1@ヘリコプター の @音 が @聞こえる~聞こえました~きこえました','I heard the sound of a helicopter.'],
 ['B1@ヘリコプター で @島 に @荷物 を @運ぶ~運びました~はこびました','We carried supplies to the island by helicopter.'],
]);
lesson('tracks-flocks-and-wild-animals','Tracks, flocks and wild animals',['B1@足跡','B1@群れ','B1@獣'],
 '足跡 / 群れ / 獣',
 '足跡 (ashiato) are marks left by feet. 群れ (mure) is a group such as a flock or herd. 獣 (kemono) is a beast or wild animal, usually a land mammal.',[
 ['@雪 の @上 に @動物 の B1@足跡 が @ある~ありました~ありました','There were animal tracks in the snow.'],
 ['@海岸 の B1@足跡 を @写真 に @撮る~撮りました~とりました','I photographed footprints on the shore.'],
 ['B1@泥 に @残る~残った~のこった B1@足跡 を @調べる~調べました~しらべました','We examined the tracks left in the mud.'],
 ['@鳥 の B1@群れ が @空 を @飛ぶ~飛んでいました~とんでいました','A flock of birds was flying through the sky.'],
 ['@牛 の B1@群れ が @遠く に @見える~見えました~みえました','A herd of cattle was visible in the distance.'],
 ['@魚 の B1@群れ を @船 から @見る~見ました~みました','We saw a school of fish from the boat.'],
 ['@森 の @中 で B1@獣 の @声 が @聞こえる~聞こえました~きこえました','We heard a wild animal in the forest.'],
 ['B1@獣 の B1@足跡 を @見つける~見つけました~みつけました','We found the tracks of a wild animal.'],
 ['@この @山 に @住む B1@獣 について @本 で @調べる~調べました~しらべました','I read about the wild animals living on this mountain.'],
]);
lesson('water-welling-clearing-and-overflowing','Water springing up, clearing and overflowing',['B1@湧く','B1@澄む','B1@あふれる'],
 '湧きます / 澄みます / あふれます',
 '湧く (waku) comes up from below, like spring water. 澄む (sumu) becomes clear, as water or air can. あふれる spills beyond the space available.',[
 ['B1@地面 から @水 が B1@湧く~湧いています~わいています','Water is springing up from the ground.'],
 ['@山 の @中 で @水 が B1@湧く @場所 を @見つける~見つけました~みつけました','We found a place in the mountains where water springs up.'],
 ['@ここ から @温泉 が B1@湧く~湧いています~わいています','Hot spring water wells up here.'],
 ['@朝 の @空気 は B1@澄む~澄んでいます~すんでいます','The morning air is clear.'],
 ['B1@澄む~澄んだ~すんだ @川 の @水 を @見る~見ました~みました','I looked at the clear river water.'],
 ['@雨 の @後 で @空 が B1@澄む~澄みました~すみました','The sky cleared after the rain.'],
 ['@コップ から @水 が B1@あふれる~あふれました~あふれました','Water overflowed from the glass.'],
 ['@強い @雨 で @川 の @水 が B1@あふれる~あふれました~あふれました','The river overflowed because of heavy rain.'],
 ['@祭り の @日 は @道 に @人 が B1@あふれる~あふれていました~あふれていました','The street was overflowing with people on the day of the festival.'],
]);
lesson('steep-and-uneven-ground','Steep and uneven ground',['B1@険しい','B1@凸凹'],
 '険しい / 凸凹',
 '険しい (kewashii) describes steep or rugged terrain. 凸凹 (dekoboko) is unevenness, with bumps and hollows.',[
 ['B1@険しい @山 の @道 を @歩く~歩きました~あるきました','We walked along a steep mountain path.'],
 ['@この @道 は @思う~思った~おもった より B1@険しい です','This path is more rugged than I expected.'],
 ['@道 が B1@険しい から @別 の @道 を @選ぶ~選びました~えらびました','We chose another path because this one was steep.'],
 ['@雨 の @後 で @道 が B1@凸凹 に @なる~なりました~なりました','The road became uneven after the rain.'],
 ['B1@凸凹 の @道 を @ゆっくり @進む~進みました~すすみました','We went slowly along the bumpy road.'],
 ['B1@地面 が B1@凸凹 だ から @歩く~歩きにくい~あるきにくい です','The ground is uneven, so it is difficult to walk on.'],
]);
lesson('harbour-visit-account','Visiting a working harbour',[],
 '漁師 / 漁業 / 水産 / 貨物 / 運河 / 陸',
 'Follow a visit through a harbour and along its waterway.',[
 ['@朝 @早い~早く~はやく @港 に @着く~着きました~つきました','We arrived at the harbour early in the morning.'],
 ['B1@漁師 が @この @地域 の B1@漁業 について @話す~話して~はなして @くれる~くれました~くれました','A fisher told us about fishing in the region.'],
 ['B1@水産 に @関係 が @ある @会社 も @訪ねる~訪ねました~たずねました','We also visited a company connected with fisheries.'],
 ['@船 に B1@貨物 を B1@積む~積んでいる~つんでいる @人 が @見える~見えました~みえました','We could see people loading cargo onto a ship.'],
 ['@小さい @船 で B1@運河 を @通る~通りました~とおりました','We went through the canal in a small boat.'],
 ['B1@陸 に @上がる~上がった~あがった @後 で @この @地域 の @料理 を @食べる~食べました~たべました','After going ashore, we ate local food.'],
]);
lesson('rural-area-account','Exploring a farming area',[],
 '区域 / 耕地 / 牧畜 / 群れ / 境界 / 農産物',
 'Follow a trip through cultivated land and a village.',[
 ['@地図 で @今日 @歩く B1@区域 を @確認 @する~しました~しました','We checked on the map the area we would walk through today.'],
 ['@村 の @周り の B1@耕地 を @見る~見ました~みました','We looked at the cultivated land around the village.'],
 ['B1@牧畜 の @仕事 を @する @人 が @牛 の B1@群れ を @見せる~見せて~みせて @くれる~くれました~くれました','Someone who raises livestock showed us a herd of cattle.'],
 ['@川 が @隣 の @村 と の B1@境界 でした','The river was the boundary with the neighbouring village.'],
 ['@村 の @店 で B1@農産物 を @買う~買いました~かいました','We bought farm produce at the village shop.'],
 ['@帰る @前 に @川 が @見える B1@地点 から @写真 を @撮る~撮りました~とりました','Before leaving, we took a photograph from a point overlooking the river.'],
]);
lesson('mountain-path-account','Following a mountain path',[],
 '険しい / 凸凹 / 足跡 / 獣 / 湧く / 澄む',
 'Follow a walk from a rough path to a spring.',[
 ['@山 の @道 は B1@険しい から @ゆっくり @歩く~歩きました~あるきました','We walked slowly because the mountain path was steep.'],
 ['B1@凸凹 の B1@地面 に B1@足跡 が @残る~残っていました~のこっていました','Tracks remained on the uneven ground.'],
 ['@一緒 に @来る~来た~きた @人 が B1@獣 の B1@足跡 だ と @説明 @する~しました~しました','Someone who came with us explained that they were the tracks of a wild animal.'],
 ['@少し @進む~進んだ~すすんだ @場所 で @水 が B1@湧く~湧いていました~わいていました','Water was springing up a little further along the path.'],
 ['B1@澄む~澄んだ~すんだ @水 の @近く で @写真 を @撮る~撮りました~とりました','We took photographs near the clear water.'],
 ['@帰り は B1@険しい @道 を @通る~通りませんでした~とおりませんでした','We did not take the steep path on the way back.'],
]);
}
