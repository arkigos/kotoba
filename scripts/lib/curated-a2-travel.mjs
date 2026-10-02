export function authorTravel({topic,lesson,lines,forms}) {
forms['について']=['について','about; concerning'];
topic('travel','Travel and arrangements','Plan a trip, handle reservations, and describe a journey.');
lesson('plans','Making travel plans',[25,26,29,30,108], 'Vる予定です / Nを変更します', 'Put the plain dictionary form before 予定です to state a plan. 出発する予定です means “I plan to depart”. 変更する changes an arrangement; キャンセルする cancels it. 出発 and 到着 can also be nouns.', [
 ['@明日 29~出発する~しゅっぱつする 25 です','I plan to depart tomorrow.'],['25 は @まだ @わかる~わかりません~わかりません','I do not know the plans yet.'],
 ['29 は @明日 の @朝 です','Departure is tomorrow morning.'],['@夜 に 30~到着する~とうちゃくする 25 です','I plan to arrive at night.'],['30 は @何時 です か','What time is arrival?'],
 ['25 を 26~変更します~へんこうします','I will change the plan.'],['@予約 を 26~変更しました~へんこうしました','I changed the reservation.'],
 ['@予約 を 108~キャンセルしました~キャンセルしました','I canceled the reservation.'],['@旅行 を 108~キャンセルします~キャンセルします','I will cancel the trip.'],
]);
lesson('documents','Travel documents',[103,104,27,28,160], 'Nを持っています / Nを見せてください', 'Passports and visas are different documents. 申し込み is an application; 申込書 is the form you fill in. Use Nを見せてください to ask to see a document, and Nについて to identify the subject of a question.', [
 ['103 を @見せる~見せてください~みせてください','Please show your passport.'],['103 を @持つ~持っています~もっています','I have my passport.'],
 ['104 を @見せる~見せてください~みせてください','Please show your visa.'],['104 について @聞く~聞きます~ききます','I will ask about the visa.'],
 ['@旅行 の 27 を @する~します~します','I apply for the trip.'],['27 は @今日 @する~します~します','I will submit the application today.'],
 ['28 に @名前 を @書く~書きます~かきます','I write my name on the application form.'],['28 を @送る~送ります~おくります','I send the application form.'],
 ['160 に @行く~行きます~いきます','I will go to the embassy.'],['160 で 104 について @聞く~聞きます~ききます','I will ask about the visa at the embassy.'],
]);
lesson('fares','Tickets and fares',[31,32,105,1023,1031,1080], 'Nはいくらですか / Nを予約します', '運賃 is a transport fare; 料金 is a broader charge or fee. チケット is a ticket, while 券 is often used in compounds such as 入場券. 便 names a scheduled flight or service. 高速 means high speed; 高速バス is an intercity express bus.', [
 ['@バス の 31 は @いくら です か','How much is the bus fare?'],['@電車 の 31 は @高い です','The train fare is expensive.'],
 ['@ホテル の 32 は @いくら です か','How much is the hotel charge?'],['32 を @払う~払いました~はらいました','I paid the fee.'],
 ['105 を @予約 @する~しました~しました','I booked a ticket.'],['105 を @見せる~見せてください~みせてください','Please show your ticket.'],
 ['@この 1023 を @使う~使います~つかいます','I will use this ticket.'],['1023 を @買う~買いました~かいました','I bought a ticket.'],
 ['@朝 の 1031 を @予約 @する~します~します','I will book the morning flight.'],['@次 の 1031 は @何時 です か','What time is the next flight?'],
 ['1080 @バス に @乗る~乗ります~のります','I take an express bus.'],['1080 @バス の 105 を @買う~買いました~かいました','I bought a ticket for the express bus.'],
]);
lesson('trains','Traveling by rail',[475,520,577,1204,1247,626], 'Nに乗ります / Nの運転手', '特急 and 急行 are categories of faster train services; exact fares and stops depend on the railway. 列車 is a train, while 鉄道 is the railway system. 汽車 originally means a steam train and is also used regionally for a train.', [
 ...lines([[475,'the limited express'],[520,'the express'],[577,'the steam train'],[1204,'the train']], [['$ に @乗る~乗りました~のりました','I took $.'],['$ の 105 を @買う~買いました~かいました','I bought a ticket for $.']]),
 ['@この 1247 は @古い です','This railway is old.'],['1247 の @地図 を @見る~見ます~みます','I look at a railway map.'],
 ['@タクシー の 626 に @聞く~聞きます~ききます','I ask the taxi driver.'],['626 は @駅 の @前 で @待つ~待っています~まっています','The driver is waiting in front of the station.'],
]);
lesson('roads','On the road',[331,1040,633,1201,414,375,377,174], '場所を通ります / 場所に向かいます', 'を can mark a route: 道路を通ります means go along a road. 向かう means head toward a destination. 進む is move forward; 上る is go up. 駐車する means park a vehicle, and 駐車場 is a parking area.', [
 ['@この @町 は 331 が @便利 です','This town has convenient transport.'],['@日本 の 331 は @便利 です','Transport in Japan is convenient.'],
 ['@この 1040 を 414~通ります~とおります','I go along this road.'],['1040 は @広い です','The road is wide.'],
 ['@駅 の @前 を 414~通りました~とおりました','I passed in front of the station.'],
 ['633 は @どこ です か','Where is the parking lot?'],['633 に @車 を 1201~駐車します~ちゅうしゃします','I park the car in the parking lot.'],['@ここ に 1201~駐車してもいいですか~ちゅうしゃしてもいいですか','May I park here?'],
 ['@まっすぐ 375~進んでください~すすんでください','Please go straight ahead.'],['@少し 375~進みます~すすみます','I move forward a little.'],
 ['@駅 に 377~向かいます~むかいます','I head toward the station.'],['@空港 に 377~向かっています~むかっています','I am heading to the airport.'],
 ['@階段 を 174~上ります~のぼります','I go up the stairs.'],['@階段 を @ゆっくり 174~上りました~のぼりました','I went up the stairs slowly.'],
]);
lesson('stopping','Stopping and parking a car',[1270], '車が止まります / 車を止めます', '止まる describes something stopping; 止める（とめる）describes someone stopping it. Compare 車が止まります with 車を止めます. 止める also means park when you leave a vehicle in a place such as a parking lot. Its request form is 止めてください.', [
 ['@駅 の @前 で @車 が @止まる~止まりました~とまりました','The car stopped in front of the station.'],
 ['@駅 の @前 で @車 を 1270~止めました~とめました','I stopped the car in front of the station.'],
 ['633 に @車 を 1270~止めます~とめます','I park the car in the parking lot.'],
 ['@ここ で @タクシー を 1270~止めてください~とめてください','Please stop the taxi here.'],
 ['@ホテル の @前 で @車 を 1270~止めました~とめました','I stopped the car in front of the hotel.'],
]);
lesson('uncrowded','Finding a quieter journey',[1271], 'Nは空いています', '空く（すく）describes a place becoming less crowded. 空いています describes the resulting state: a train, road or shop is not crowded. It does not have to be completely empty. Compare the familiar 混んでいます, crowded. Keep the reading すいて together.', [
 ['@今 @電車 は 1271~空いています~すいています','The train is not crowded now.'],
 ['@午後 の @バス は 1271~空いています~すいています','The afternoon bus is not crowded.'],
 ['@この @道 は 1271~空いていました~すいていました','There was little traffic on this road.'],
 ['@この @店 は 1271~空いています~すいています','This shop is not crowded.'],
]);
lesson('ahead','Going ahead and going first',[1268], 'この先にNがあります / 先にVます', '先（さき）can describe what is ahead in space or time. この先 means farther along from here. 先に before an action means doing it first or before someone else. The examples use familiar location statements and polite requests.', [
 ['@この 1268 に @駅 が @ある~あります~あります','There is a station farther ahead.'],
 ['@この 1268 の @道 は @狭い です','The road ahead is narrow.'],
 ['1268 に @帰る~帰ります~かえります','I will go home first.'],
 ['1268 に @食べる~食べてください~たべてください','Please go ahead and eat.'],
], {1268:'ahead; first (先に)'});
lesson('journey','The journey there and back',[671,319,299,385,165,563], 'Nの途中 / Vてから / Nに寄ります', '行き is the outward journey and 帰り is the return. 途中 means partway through or on the way. 戻る means return to a place. 寄る means stop by somewhere; it differs from merely passing it.', [
 ['671 は @電車 です','I am taking the train on the way there.'],['671 の 105 を @買う~買いました~かいました','I bought a ticket for the outward journey.'],
 ['319 は @バス です','I am taking the bus on the way back.'],['319 の @時間 は @まだ @わかる~わかりません~わかりません','I do not yet know what time I will return.'],
 ['@学校 に @行く~行く~いく 299 です','I am on my way to school.'],['@旅行 の 299 で @友達 に @会う~会いました~あいました','I met a friend during the trip.'],
 ['@ホテル に 385~戻ります~もどります','I will return to the hotel.'],['@駅 に 385~戻りました~もどりました','I went back to the station.'],
 ['@朝 165~出かけます~でかけます','I go out in the morning.'],['@友達 と 165~出かけました~でかけました','I went out with a friend.'],
 ['@コンビニ に 563~寄ります~よります','I stop by the convenience store.'],['@銀行 に 563~寄って~よって から @帰る~帰ります~かえります','I will stop by the bank and then go home.'],
]);
lesson('staying','Staying away from home',[106,107,490,19,200,101], 'Nは何時ですか / Nに泊まります', 'Check-in and check-out times are usually asked with は何時ですか. 旅館 is a Japanese-style inn and 温泉 a hot spring. お手洗い is a polite word for a toilet or washroom. エスカレーター is an escalator, distinct from an elevator.', [
 ['106 は @何時 です か','What time is check-in?'],['106 を @する~します~します','I will check in.'],
 ['107 は @何時 です か','What time is check-out?'],['107 を @する~しました~しました','I checked out.'],
 ['490 に @泊まる~泊まります~とまります','I will stay at an inn.'],['490 の @部屋 を @予約 @する~します~します','I will book a room at the inn.'],
 ['19 に @入る~入りました~はいりました','I bathed in the hot spring.'],['@この 19 は @熱い です','This hot spring is hot.'],
 ['200 は @どこ です か','Where is the washroom?'],['200 は @あそこ です','The washroom is over there.'],
 ['101 に @乗る~乗ります~のります','I take the escalator.'],['101 は @入り口 の @右 に @ある~あります~あります','The escalator is to the right of the entrance.'],
]);
lesson('luggage','Luggage and companions',[582,556,624,588,504], 'Nを連れて行きます / Nに間に合います', '連れる is used for taking a person along, as in 子供を連れて行きます. 訪ねる means visit a person or place. 間に合う means be in time for something; に marks the departure or event.', [
 ['582 に @服 を @入れる~入れます~いれます','I put clothes in the suitcase.'],['582 は @重い です','The suitcase is heavy.'],
 ['556 を @探す~探しています~さがしています','I am looking for something I left behind.'],['@ホテル に 556 を @する~しました~しました','I left something behind at the hotel.'],
 ['@子供 を 624~連れて~つれて @行く~行きます~いきます','I will take my child along.'],['@友達 を 624~連れて~つれて @来る~来ました~きました','I brought a friend along.'],
 ['@友達 の @家 を 588~訪ねます~たずねます','I visit my friend at home.'],['@母 を 588~訪ねました~たずねました','I visited my mother.'],
 ['29 に 504~間に合いました~まにあいました','I was in time for departure.'],['1204 に 504~間に合いませんでした~まにあいませんでした','I did not catch the train in time.'],
]);
lesson('sightseeing','Enjoying a trip',[857,874,557,470,18,405,566,1238], 'Nを観光します / Nを見物します', '旅 is a journey or trip; 観光 is sightseeing. 見物 means going to see something, often an event or attraction. 景色 means scenery. 港 is a harbor and 飛行場 an airfield. 航空 refers to aviation.', [
 ['857 は @楽しい です','The journey is enjoyable.'],['857 の @写真 を @見る~見ます~みます','I look at photos from the trip.'],
 ['@町 を 874~観光します~かんこうします','I go sightseeing around the town.'],['874 の @バス に @乗る~乗ります~のります','I take a sightseeing bus.'],
 ['@祭り を 557~見物します~けんぶつします','I go to see the festival.'],['@花火 を 557~見物しました~けんぶつしました','I went to see the fireworks.'],
 ['470 が @綺麗 です','The scenery is beautiful.'],['@山 の 470 が @好き です','I like mountain scenery.'],
 ['18 を @歩く~歩きます~あるきます','I walk along the coast.'],['18 の @近く に @ホテル が @ある~あります~あります','There is a hotel near the coast.'],
 ['405 に @船 が @ある~あります~あります','There is a ship in the harbor.'],['405 で @待つ~待ちます~まちます','I wait at the harbor.'],
 ['566 に @行く~行きます~いきます','I go to the airfield.'],['566 は @町 の @外 に @ある~あります~あります','The airfield is outside town.'],
 ['1238 の @仕事 を @する~しています~しています','I work in aviation.'],['1238 の @会社 です','It is an aviation company.'],
]);
}
