import { topic, lesson, lines } from './curated-course-authoring.mjs';

topic('travel', 'Around town and travel', 'Find your way, use transport, and arrange a simple trip.');
lesson('going-places', 'Going somewhere', [46,47,48,57,59,140], '駅 に 行きます', 'に marks a destination. 行きます means go; 来ます means come toward the speaker’s viewpoint; 帰ります means return. The dictionary forms 行く, 来る and 帰る have different polite forms.', [
 ...lines([[57,'the station'],[59,'the hotel'],[140,'the park']], [['$ に 46~行きます~いきます','I go to $.'],['71 は $ に 47~来ます~きます','My friend comes to $.']]),
 ['59 に 48~帰ります~かえります','I return to the hotel.'],['71 は 48~帰ります~かえります','My friend goes back.']]);
lesson('finding-places', 'Where is it?', [22,26,27,28,58], 'Nはどこですか / Nはここです', 'ここ is here near the speaker; そこ is there near the listener; あそこ is over there away from both. どこ asks where. Use です to locate an identified place.', [
 ['57 は 22 です か','Where is the station?'],['59 は 22 です か','Where is the hotel?'],['58 は 22 です か','Where is the toilet?'],['58 は 26 です','The toilet is here.'],['58 は 27 です','The toilet is there.'],['58 は 28 です','The toilet is over there.'],['57 は 26 です','The station is here.'],['59 は 27 です','The hotel is there.'],['140 は 28 です','The park is over there.']]);
lesson('local-shops', 'Places in town', [56,60,139,317,318,655], 'Nに行きます / Nはどこですか', 'Use the destination pattern for shops and services. スーパー is a supermarket, コンビニ a convenience store, and デパート a department store. 町 is a town or neighborhood.', [
 ...lines([[56,'shop'],[60,'convenience store'],[139,'bank'],[317,'department store'],[655,'supermarket']], [['$ に 46~行きます~いきます','I go to the $.'],['$ は 22 です か','Where is the $?']]),
 ['23 は 1 の 318 です','This is my town.'],['318 の 57 に 46~行きます~いきます','I go to the town’s station.']]);
lesson('services', 'Public services', [692,693,694,695,699], 'Nはどこですか / Nの受付', '交番 is a neighborhood police box, while 警察 is the police organization. 受付 is a reception desk. の links a place to its reception area.', [
 ...lines([[692,'post office'],[693,'police box'],[695,'library']], [['$ は 22 です か','Where is the $?'],['$ に 46~行きます~いきます','I go to the $.']]),
 ['694 は 22 です か','Where are the police?'],['694 に 46~行きます~いきます','I go to the police.'],['59 の 699 は 22 です か','Where is the hotel reception?'],['699 に 46~行きます~いきます','I go to reception.']]);
lesson('near-far', 'Near and far', [316,319,158,159,416], '場所から近い / 場所から遠い', 'から gives a reference point: 駅から近い means near the station. 地図 is a map; 道 is a road or way. 所 is a place and can follow a describing word.', [
 ['59 は 57 から 316 です','The hotel is near the station.'],['140 は 57 から 316 です','The park is near the station.'],['59 は 57 から 319 です','The hotel is far from the station.'],['140 は 57 から 319 です','The park is far from the station.'],['158 を ください','A map, please.'],['23 は 318 の 158 です','This is a map of the town.'],['23 は 57 まで の 159 です','This is the road to the station.'],['159 は 22 です か','Where is the road?'],['316 416 に 46~行きます~いきます','I go somewhere nearby.'],['319 416 に 46~行きます~いきます','I go somewhere far away.']]);
lesson('directions', 'Directions', [238,239,240,241,420,471,646,647], 'Nの東 / こちら・そちら・あちら', '東, 西, 南 and 北 are east, west, south and north. こちら, そちら and あちら can politely indicate this way, that way near you, and over there. どちら asks which way or which of two.', [
 ...lines([[238,'east'],[239,'west'],[240,'south'],[241,'north']], [['59 は 57 の $ です','The hotel is $ of the station.'],['$ に 46~行きます~いきます','I go $.']]),
 ...lines([[420,'this way'],[646,'that way'],[647,'over that way']], [['57 は $ です','The station is $.'],['$ に 46~行きます~いきます','I go $.']]),
 ['57 は 471 です か','Which way is the station?'],['59 は 471 です か','Which way is the hotel?']]);
lesson('transport', 'Taking transport', [109,110,132,133,134,135,137,345], '乗り物に乗ります / 乗り物を降ります', 'Use に with 乗ります to board a vehicle. Use を with 降ります to get off it. で marks the means of travel: 電車で行きます means go by train.', [
 ...lines([[132,'bus'],[134,'train'],[345,'subway'],[137,'plane']], [['$ に 109~乗ります~のります','I board the $.'],['$ を 110~降ります~おります','I get off the $.']]),
 ...lines([[133,'taxi'],[135,'bicycle']], [['$ で 57 に 46~行きます~いきます','I go to the station by $.']]),['133 に 109~乗ります~のります','I get into the taxi.'],['135 に 109~乗ります~のります','I get on the bicycle.']]);
lesson('travel-details', 'A journey', [111,346,366,473,475,472], '空港 に 行きます', 'どうやって asks how an action is done. 着きます uses に for the place you arrive at. A 船 is a boat or ship, バイク is a motorcycle, and 乗り物 is the general word for a vehicle.', [
 ['346 に 46~行きます~いきます','I go to the airport.'],['346 に 111~着きます~つきます','I arrive at the airport.'],['57 に 111~着きます~つきます','I arrive at the station.'],['366 に 109~乗ります~のります','I board a boat.'],['366 を 110~降ります~おります','I get off a boat.'],['475 に 109~乗ります~のります','I ride a motorcycle.'],['475 で 46~行きます~いきます','I go by motorcycle.'],['23 は 473 です','This is a vehicle.'],['473 は 22 です か','Where is the vehicle?'],['57 まで 472 46~行きます~いきます か','How do I get to the station?'],['346 まで 472 46~行きます~いきます か','How do I get to the airport?']]);
lesson("streets", "Walking around", [176, 480, 483, 484], "道を歩きます / まっすぐ行きます", "を can mark a route followed, not just a direct object: 通りを歩きます. まっすぐ means straight ahead. 賑やか describes a lively or bustling place.", [
 ["480 を 176~歩きます~あるきます", "I walk along the street."],
 ["159 を 176~歩きます~あるきます", "I walk along the road."],
 ["483 46~行きます~いきます", "I go straight ahead."],
 ["483 176~歩きます~あるきます", "I walk straight ahead."],
 ["480 は 484 です", "The street is lively."],
 ["318 は 484 です", "The town is lively."]
]);
lesson("landmarks", "Landmarks along the way", [481, 548, 549, 550, 551], "Nまで歩きます / Nはどこですか", "Reuse 歩きます with まで to say how far you will walk. Name a landmark before はどこですか to ask where it is. No new verb pattern is needed.", [
 ["481 まで 176~歩きます~あるきます", "I walk as far as the building."],
 ["548 まで 176~歩きます~あるきます", "I walk as far as the bridge."],
 ["549 まで 176~歩きます~あるきます", "I walk as far as the intersection."],
 ["550 まで 176~歩きます~あるきます", "I walk as far as the traffic light."],
 ["551 まで 176~歩きます~あるきます", "I walk as far as the stairway."],
 ["481 は 22 です か", "Where is the building?"],
 ["548 は 22 です か", "Where is the bridge?"],
 ["549 は 22 です か", "Where is the intersection?"],
 ["550 は 22 です か", "Where is the traffic light?"],
 ["551 は 22 です か", "Where is the stairway?"]
]);

lesson('navigation', 'Entering, leaving, and crossing', [108,190,160,161,590,591,592], 'ホテル に 入ります', '入ります uses に for entering a place; 出ます uses を for leaving it. で marks where you turn or stop. 渡ります uses を for what you cross.', [
 ['59 に 108~入ります~はいります','I enter the hotel.'],['56 に 108~入ります~はいります','I enter the shop.'],['59 を 190~出ます~でます','I leave the hotel.'],['56 を 190~出ます~でます','I leave the shop.'],['160 は 26 です','The entrance is here.'],['160 から 108~入ります~はいります','I enter through the entrance.'],['161 は 28 です','The exit is over there.'],['161 から 190~出ます~でます','I leave through the exit.'],['550 で 590~止まります~とまります','I stop at the traffic light.'],['57 で 590~止まります~とまります','It stops at the station.'],['549 で 591~曲がります~まがります','I turn at the intersection.'],['480 を 591~曲がります~まがります','I turn onto the street.'],['548 を 592~渡ります~わたります','I cross the bridge.'],['159 を 592~渡ります~わたります','I cross the road.']]);
lesson('tickets', 'Tickets and connections', [545,744,745,594], '電車を乗り換えます / 混んでいます', '乗り換えます means transfer from one service to another. The train changed is marked with を; the transfer location uses で. 混んでいます describes being crowded. 運転します means drive or operate a vehicle.', [
 ['545 を ください','A ticket, please.'],['57 まで の 545 を ください','A ticket to the station, please.'],['134 を 745~乗り換えます~のりかえます','I change trains.'],['57 で 134 を 745~乗り換えます~のりかえます','I change trains at the station.'],['134 は 744~混んでいます~こんでいます','The train is crowded.'],['159 は 744~混んでいます~こんでいます','The road is congested.'],['136 を 594~運転します~うんてんします','I drive a car.'],['132 を 594~運転します~うんてんします','I drive a bus.']]);
lesson('staying', 'Staying overnight', [546,547,368,347,474], 'ホテルに泊まります / 予約します', '泊まります uses に for the place you stay overnight. 予約します means make a reservation. 荷物 is luggage. お客さん can mean a guest or customer; here it means a hotel guest.', [
 ['59 に 368~泊まります~とまります','I stay at a hotel.'],['71 も 59 に 368~泊まります~とまります','My friend also stays at the hotel.'],['59 を 547~予約します~よやくします','I book a hotel.'],['133 を 547~予約します~よやくします','I reserve a taxi.'],['546 に 46~行きます~いきます','I go on a trip.'],['546 から 48~帰ります~かえります','I return from a trip.'],['347 は 22 です か','Where is the luggage?'],['347 は 26 です','The luggage is here.'],['1 は 59 の 474 です','I am a guest at the hotel.'],['474 は 26 です','The guest is here.']]);
lesson('sightseeing', 'Places to visit', [349,477,446,449,343], 'Nは有名です / Nに行きます', '神社 is a Shinto shrine and お寺 is a Buddhist temple. 美術館 displays art; 博物館 is a museum more generally. 有名 is a な-adjective meaning famous.', lines([[349,'shrine'],[477,'temple'],[446,'art museum'],[449,'museum']], [['$ に 46~行きます~いきます','I go to the $.'],['$ は 343 です','The $ is famous.'],['$ は 57 から 316 です','The $ is near the station.']]));
lesson('practical-signs', 'Signs and safety', [736,737,738,739], 'Vてください / Nは…です', 'A polite request uses a verb’s て-form followed by ください. 急ぐ becomes 急いで. 安全 is safety or safe; 危ない is dangerous. 困っています means “I am having trouble”.', [
 ['736~急いで~いそいで ください','Please hurry.'],['71 は 736~急いでいます~いそいでいます','My friend is hurrying.'],['1 は 737~困っています~こまっています','I am having trouble.'],['71 は 737~困っています~こまっています','My friend is having trouble.'],['159 は 738 です','The road is safe.'],['318 は 738 です','The town is safe.'],['159 は 739 です','The road is dangerous.'],['548 は 739 です','The bridge is dangerous.']]);
