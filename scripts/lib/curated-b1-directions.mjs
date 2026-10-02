export function authorDirections({topic,lesson:authorLesson}) {
const lesson=(...args)=>authorLesson(...args,{728:'lead to; connect with',709:'passage; traffic',1964:'crossing; intersection',1133:'cross; go over'});
topic('directions','Routes, streets and directions','Explain a route, describe an interruption, and help someone find another way through town.');
lesson('route','Explaining the route',[2470,2152,2567], 'Nまでの道順 / Nを曲がります', '道順 is the route to follow; 方角 is a direction. 突き当たり is the end of a street or passage where you cannot continue straight ahead. Use the familiar route pattern with を: 突き当たりを右に曲がります.', [
 ['@駅 まで の 2470 を @教える~教えてください~おしえてください','Please tell me the way to the station.'],
 ['@ホテル の @人 に 2470 を @聞く~聞きました~ききました','I asked someone at the hotel for directions.'],
 ['@駅 は @どちら の 2152 です か','Which direction is the station in?'],
 ['@地図 で @山 の 2152 を @確認 @する~しました~しました','I checked the direction of the mountain on the map.'],
 ['2567 を @右 に @曲がる~曲がってください~まがってください','Please turn right at the end of the street.'],
 ['@店 は @この @道 の 2567 に @ある~あります~あります','The shop is at the end of this street.'],
]);
lesson('streets','Along the main street',[2007,2123,2077], 'Nに出ます / Nの下を歩きます', '大通り is a main street, 街角 a street corner, and 並木 a row or avenue of trees. Use them as landmarks. 道に出ます describes coming out onto a road; it does not mean leaving that road.', [
 ['@この @道 を @行く と 2007 に @出る~出ます~でます','If you take this street, you come out onto the main street.'],
 ['2007 を @まっすぐ @歩く~歩きました~あるきました','I walked straight along the main street.'],
 ['2123 に @小さい @店 が @ある~あります~あります','There is a small shop on the street corner.'],
 ['2123 で @友達 と @会う~会いました~あいました','I met my friend on the street corner.'],
 ['2077 の @下 を @歩く~歩きました~あるきました','I walked beneath the row of trees.'],
 ['2007 の 2077 は @秋 に @黄色い~黄色く~きいろく @なる~なります~なります','The trees lining the main street turn yellow in autumn.'],
]);
lesson('walking','On foot and by bus',[721,2430,1127], 'Nを歩きます / Nが多い', '歩道 is the pavement or sidewalk for pedestrians. 人通り means the flow of people passing along a street: 人通りが多い describes a busy street. 停留所 is a stop for a bus or tram, rather than a railway station.', [
 ['721 を @歩く~歩いてください~あるいてください','Please walk on the sidewalk.'],
 ['2007 に は @広い 721 が @ある~あります~あります','The main street has a wide sidewalk.'],
 ['@駅 の @前 は 2430 が @多い です','There are many people passing in front of the station.'],
 ['@夜 は 2430 が @少ない です','Few people pass along here at night.'],
 ['@次 の 1127 で @降りる~降ります~おります','I get off at the next stop.'],
 ['@バス の 1127 は 2567 に @ある~あります~あります','The bus stop is at the end of the street.'],
]);
lesson('crossings','Where routes cross',[687,1964,2013,1098], 'Nを横断します / Nが交差します', '横断する means crossing from one side to the other. 交差する describes two lines or routes crossing each other. A 踏切 is a railway crossing. 横切る is an everyday verb for going across something or passing across someone’s path.', [
 ['@信号 が @青い~青く~あおく @なる~なって~なって から @道路 を 687 @する~します~します','I cross the road after the light turns green.'],
 ['@この @道路 の 687 は @危険 です','Crossing this road is dangerous.'],
 ['@二つ の @道 が @ここ で 1964 @する~しています~しています','Two roads cross here.'],
 ['@川 と @道路 が 1964 @する @所 に @橋 が @ある~あります~あります','There is a bridge where the river and the road cross.'],
 ['2013 の @前 で @待つ~待ちました~まちました','I waited before the railway crossing.'],
 ['2013 を @渡る と @駅 が @見える~見えます~みえます','After you cross the railway crossing, you can see the station.'],
 ['@猫 が @道 を 1098~横切りました~よこぎりました','A cat crossed the road.'],
 ['@公園 を 1098~横切って~よこぎって @駅 に @向かう~向かいました~むかいました','I crossed the park and headed for the station.'],
]);
lesson('disruption','Finding another way',[1299,709,2488,625], 'Nのため / 回り道をします', 'Use the earlier reason pattern のため to explain a disruption. 工事 is construction work, 通行 passage or traffic, 回り道 a detour, and 渋滞 a traffic jam.', [
 ['2007 で @道路 の 1299 を @する~しています~しています','Road construction is taking place on the main street.'],
 ['1299 は @来月 まで @続く~続きます~つづきます','The construction work continues until next month.'],
 ['1299 の ため @車 の 709 は @禁止 です','Vehicles are not allowed through because of the construction work.'],
 ['@この @道 は @車 の 709 が @多い です','This road carries a lot of vehicle traffic.'],
 ['1299 の ため 2488 を @する~しました~しました','I took a detour because of the construction work.'],
 ['2488 を @する と @時間 が 3004~かかります~かかります','Taking the detour takes time.'],
 ['625 の ため @バス が @遅れる~遅れました~おくれました','The bus was late because of a traffic jam.'],
 ['@朝 は @この @道 で @よく 625 が @起こる~起こります~おこります','Traffic jams often occur on this road in the morning.'],
]);
lesson('connections','Through and over',[638,728,1133], 'Nを通ります / Nに通じています', '通じる here means that a road leads to or connects with a place. 越す means going over or beyond something; here it describes crossing a mountain pass. These senses help connect several parts of a route without adding a new grammar pattern.', [
 ['638 を @通る と @海 が @見える~見えます~みえます','When you go through the tunnel, you can see the sea.'],
 ['@この 638 は @約 @二 @キロメートル @ある~あります~あります','This tunnel is about two kilometers long.'],
 ['@この @道 は @駅 に 728~通じています~つうじています','This road leads to the station.'],
 ['638 は @隣 の @町 に 728~通じています~つうじています','The tunnel leads to the neighboring town.'],
 ['1807 を 1133~越す~こす と @村 が @見える~見えます~みえます','When you cross the mountain pass, you can see a village.'],
 ['@雪 が @降る @前 に 1807 を 1133~越しました~こしました','I crossed the mountain pass before it snowed.'],
]);
lesson('account','A different route to the station',[], 'Explaining a change of route', 'Follow this short account from the request for directions to the arrival. Earlier landmarks make the detour understandable. The reason comes before the changed plan, and the final sentence gives the result.', [
 ['@ホテル の @人 に @駅 まで の 2470 を @聞く~聞きました~ききました','I asked someone at the hotel for directions to the station.'],
 ['2007 は 1299 の ため @通る~通れません~とおれません でした','I could not use the main street because of construction work.'],
 ['2077 の @下 を @歩く~歩いて~あるいて 2488 を @する~しました~しました','I walked beneath the row of trees and took a detour.'],
 ['2567 を @左 に @曲がる と 2013 が @見える~見えました~みえました','When I turned left at the end of the street, I saw a railway crossing.'],
 ['2013 を @渡る~渡って~わたって @駅 に @着く~着きました~つきました','I crossed the railway crossing and arrived at the station.'],
]);
}
