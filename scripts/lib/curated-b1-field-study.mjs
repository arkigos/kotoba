export function authorFieldStudy({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@標本':'specimen; sample','B1@分類':'classification; sorting into groups',
 'B1@個体':'individual organism','B1@分布':'distribution across an area',
 'B1@原産':'place of origin; being native to a place','B1@鉱物':'mineral',
 'B1@地質':'geological features; composition of the ground',
 'B1@溶岩':'lava','B1@地盤':'ground; foundation beneath a building',
 'B1@赤道':'equator','B1@南極':'South Pole; the Antarctic',
 'B1@北極':'North Pole; the Arctic',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('science');
lesson('specimens-and-classification','Specimens and classification',['B1@標本','B1@分類','B1@個体'],
 '標本 / 分類 / 個体',
 '標本 (hyōhon) is a specimen kept for study. 分類 (bunrui) sorts things into groups. 個体 (kotai) refers to one individual organism, such as one animal or plant.',[
 ['@学校 で @植物 の B1@標本 を @見る~見ました~みました','I saw plant specimens at school.'],
 ['B1@標本 の @名前 を @ノート に @書く~書きました~かきました','I wrote the specimen’s name in my notebook.'],
 ['@古い B1@標本 を @大切 に @保存 @する~しています~しています','We carefully preserve the old specimens.'],
 ['@石 を @色 で B1@分類 @する~しました~しました','I sorted the stones by colour.'],
 ['@植物 の B1@分類 について @勉強 @する~しています~しています','I am studying the classification of plants.'],
 ['@同じ @方法 で B1@標本 を B1@分類 @する~してください~してください','Please classify the specimens using the same method.'],
 ['@この B1@個体 は @他 の B1@個体 より @小さい です','This individual is smaller than the others.'],
 ['@二つ の B1@個体 の @大きい~大きさ~おおきさ を @比べる~比べました~くらべました','We compared the sizes of two individual organisms.'],
 ['@一つ の B1@個体 を @長い @間 @調べる~調べています~しらべています','We have been studying one individual organism for a long time.'],
]);
lesson('distribution-and-origins','Where plants occur and where they come from',['B1@分布','B1@原産'],
 '分布 / 日本原産の植物',
 '分布 (bunpu) describes where something occurs across an area. 原産 (gensan) names its place of origin: 日本原産の植物 is a plant native to Japan.',[
 ['@この @植物 の B1@分布 を @地図 で @調べる~調べました~しらべました','I checked the distribution of this plant on a map.'],
 ['@魚 の B1@分布 が @変わる~変わっています~かわっています','The distribution of the fish is changing.'],
 ['@先生 は B1@分布 の @違い を @図 で @説明 @する~しました~しました','The teacher used a diagram to explain the difference in distribution.'],
 ['@これ は @日本 B1@原産 の @植物 です','This is a plant native to Japan.'],
 ['@外国 B1@原産 の @花 を @庭 で @育てる~育てています~そだてています','I am growing flowers native to another country in my garden.'],
 ['@この @木 は @どこ B1@原産 です か','Where is this tree originally from?'],
]);
lesson('minerals-and-the-ground','Minerals and the ground',['B1@鉱物','B1@地質','B1@溶岩','B1@地盤'],
 '鉱物 / 地質 / 溶岩 / 地盤',
 '鉱物 (kōbutsu) is a mineral. 地質 (chishitsu) concerns the rocks and materials making up the ground. 溶岩 (yōgan) is lava. 地盤 (jiban) is the ground beneath a place or building.',[
 ['@この @山 で @珍しい B1@鉱物 が @見つかる~見つかりました~みつかりました','A rare mineral was found on this mountain.'],
 ['B1@鉱物 の @名前 を @本 で @調べる~調べました~しらべました','I looked up the mineral’s name in a book.'],
 ['B1@鉱物 の B1@標本 を @箱 に @入れる~入れました~いれました','I put the mineral specimen in a box.'],
 ['@この @地域 の B1@地質 を @調べる~調べています~しらべています','We are investigating the geology of this area.'],
 ['@二つ の @場所 の B1@地質 を @比べる~比べました~くらべました','We compared the geological features of two places.'],
 ['B1@地質 の @違い が @わかる @地図 です','This map shows differences in the geology.'],
 ['B1@溶岩 の @色 について @先生 に @質問 @する~しました~しました','I asked the teacher about the colour of lava.'],
 ['B1@溶岩 の @写真 を @授業 で @見る~見ました~みました','We looked at a photograph of lava in class.'],
 ['B1@溶岩 が @冷える~冷えた~ひえた @後 の @石 を @調べる~調べました~しらべました','We examined the rock left after lava had cooled.'],
 ['@この @土地 の B1@地盤 は @弱い です','The ground on this land is weak.'],
 ['@家 を @建てる @前 に B1@地盤 を @調べる~調べます~しらべます','We examine the ground before building a house.'],
 ['@雨 の @後 の B1@地盤 の @変化 を @確認 @する~しました~しました','We checked changes in the ground after the rain.'],
]);
lesson('school-specimen-account','Studying specimens at school',[],
 '標本 / 分類 / 分布 / 原産 / 鉱物',
 'Follow a class as it studies plant and mineral specimens.',[
 ['@先生 は @植物 の B1@標本 を @机 に @並べる~並べました~ならべました','The teacher arranged plant specimens on the desk.'],
 ['@私たち は @葉 の @形 で B1@標本 を B1@分類 @する~しました~しました','We classified the specimens by the shape of their leaves.'],
 ['@次 に @それぞれ の @植物 の B1@分布 を @地図 で @見る~見ました~みました','Next, we looked at each plant’s distribution on a map.'],
 ['@外国 B1@原産 の @植物 も @ある~ありました~ありました','There were also plants native to other countries.'],
 ['@最後 に @先生 は B1@鉱物 の B1@標本 を @見せる~見せてくれました~みせてくれました','Finally, the teacher showed us mineral specimens.'],
 ['@私 は B1@鉱物 の @名前 と @色 を @ノート に @書く~書きました~かきました','I wrote the minerals’ names and colours in my notebook.'],
]);
lesson('equator-and-polar-regions','The equator and polar regions',['B1@赤道','B1@南極','B1@北極'],
 '赤道 / 南極 / 北極',
 '赤道 (sekidō) is the equator. 南極 (nankyoku) can name the South Pole or the Antarctic region; 北極 (hokkyoku) can name the North Pole or the Arctic region. Context distinguishes the points from the wider regions.',[
 ['@地図 で B1@赤道 の @場所 を @確認 @する~しました~しました','I checked the position of the equator on a map.'],
 ['@この @島 は B1@赤道 の @近く に @ある~あります~あります','This island is near the equator.'],
 ['B1@赤道 が @通る @国 の @名前 を @調べる~調べました~しらべました','I looked up the names of countries that the equator passes through.'],
 ['B1@南極 について @本 で @調べる~調べました~しらべました','I looked up information about Antarctica in a book.'],
 ['B1@南極 で @研究 @する~している~している @人 の @話 を @聞く~聞きました~ききました','I listened to someone who is doing research in the Antarctic.'],
 ['B1@南極 の @写真 を @家族 に @見せる~見せました~みせました','I showed my family a photograph of Antarctica.'],
 ['B1@北極 の @海 の @写真 です','This is a photograph of the Arctic sea.'],
 ['B1@北極 に @近い @地域 の @天気 を @調べる~調べました~しらべました','I checked the weather in a region near the North Pole.'],
 ['B1@北極 と B1@南極 の @違い を @先生 に @聞く~聞きました~ききました','I asked the teacher about the differences between the Arctic and Antarctic.'],
]);
lesson('maps-after-class-account','Comparing maps after class',[],
 '赤道 / 北極 / 南極 / 地質 / 分布',
 'Follow two learners as they use maps to investigate different questions.',[
 ['@授業 の @後 で @友達 と @世界 の @地図 を @見る~見ました~みました','After class, I looked at a world map with a friend.'],
 ['@まず B1@赤道 と B1@北極 と B1@南極 の @場所 を @確認 @する~しました~しました','First, we checked where the equator and the two poles were.'],
 ['@次 に @近く の @山 の B1@地質 の @地図 を A2@開く~開きました~ひらきました','Next, we opened a geological map of the nearby mountains.'],
 ['@そこ で @見つかる~見つかった~みつかった B1@鉱物 について @読む~読みました~よみました','We read about the minerals found there.'],
 ['@別 の @地図 で は @植物 の B1@分布 を @調べる~調べました~しらべました','On another map, we checked the distribution of plants.'],
 ['@同じ @場所 の @地図 です が @内容 は @違う~違いました~ちがいました','They were maps of the same place, but the information was different.'],
]);
}
