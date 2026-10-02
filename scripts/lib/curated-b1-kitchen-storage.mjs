export function authorKitchenStorage({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@冷凍':'freezing; keeping frozen','B1@貯蔵':'storage; keeping a supply',
 'B1@保管':'safekeeping; storage','B1@餅':'mochi; a rice cake',
 'B1@釜':'a heavy cooking pot; an iron pot','B1@盆':'tray',
 'B1@刻む':'to chop finely; to carve','B1@絞る':'to squeeze; to wring out',
 'B1@潰す':'to crush; to squash','B1@潰れる':'to be crushed; to get squashed',
 'B1@余る':'to be left over; to remain unused','B1@出来上がり':'completion; the finished result',
 'B1@蛍光灯':'fluorescent light','B1@灯油':'kerosene; paraffin fuel',
 'B1@ろうそく':'candle','B1@芯':'core; wick; pencil lead',
 'B1@錆':'rust','B1@調節':'adjustment; control',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('materials');
lesson('freezing-and-keeping-supplies','Freezing and keeping supplies',['B1@冷凍','B1@貯蔵','B1@保管'],
 '冷凍 / 貯蔵 / 保管',
 '冷凍 (reitō) keeps food frozen. 貯蔵 (chozō) keeps a supply for later use. 保管 (hokan) means storing something safely; it also applies to things such as keys and documents.',[
 ['@肉 を B1@冷凍 @する~しました~しました','I froze the meat.'],
 ['B1@冷凍 @する~した~した @魚 を @使う~使います~つかいます','I will use frozen fish.'],
 ['@残る~残った~のこった @スープ を B1@冷凍 @する~しておきました~しておきました','I froze the remaining soup for later.'],
 ['B1@倉庫 に @米 を B1@貯蔵 @する~しています~しています','We keep a supply of rice in the storehouse.'],
 ['@冬 の ために @食品 を B1@貯蔵 @する~しました~しました','We stored food for winter.'],
 ['B1@貯蔵 @する @場所 の B1@温度 を @確認 @する~しました~しました','We checked the temperature of the storage area.'],
 ['@大切 な @手紙 を @ここ に B1@保管 @する~しています~しています','I keep important letters here.'],
 ['@鍵 を @安全 な @場所 に B1@保管 @する~してください~してください','Please keep the key in a safe place.'],
 ['@この @箱 は @道具 の B1@保管 に @使う~使っています~つかっています','I use this box to store tools.'],
]);
lesson('rice-cakes-pots-and-trays','Rice cakes, pots and trays',['B1@餅','B1@釜','B1@盆'],
 '餅 / 釜 / 盆',
 '餅 (mochi) is a rice cake. 釜 (kama) is a heavy cooking pot, traditionally used for rice. 盆 (bon) here means a tray for carrying or serving things.',[
 ['B1@餅 を @焼く~焼きました~やきました','I grilled some mochi.'],
 ['@この B1@餅 は @柔らかい です','This mochi is soft.'],
 ['@母 と B1@餅 を @作る~作りました~つくりました','I made mochi with my mother.'],
 ['B1@釜 で @ご飯 を B1@炊く~炊きました~たきました','I cooked rice in a heavy pot.'],
 ['@この B1@釜 は @鉄 で @できる~できています~できています','This cooking pot is made of iron.'],
 ['B1@釜 を @洗う~洗った~あらった @後 で @よく B1@乾かす~乾かしました~かわかしました','I dried the cooking pot well after washing it.'],
 ['B1@盆 に @お茶 を @置く~置きました~おきました','I put the tea on a tray.'],
 ['@木 の B1@盆 を @使う~使っています~つかっています','I use a wooden tray.'],
 ['B1@盆 を @机 の @上 に @置く~置きました~おきました','I put the tray on the desk.'],
]);
lesson('chopping-squeezing-and-crushing','Chopping, squeezing and crushing',['B1@刻む','B1@絞る','B1@潰す'],
 '刻みます / 絞ります / 潰します',
 '刻む (kizamu) cuts something into small pieces. 絞る (shiboru) squeezes liquid out. 潰す (tsubusu) presses something until its shape breaks down.',[
 ['@野菜 を @細かい~細かく~こまかく B1@刻む~刻みました~きざみました','I finely chopped the vegetables.'],
 ['@包丁 で @肉 を B1@刻む~刻みます~きざみます','I chop the meat with a kitchen knife.'],
 ['B1@刻む~刻んだ~きざんだ @野菜 を @スープ に @入れる~入れました~いれました','I put the chopped vegetables in the soup.'],
 ['@濡れる~濡れた~ぬれた @タオル を B1@絞る~絞りました~しぼりました','I wrung out the wet towel.'],
 ['@みかん を B1@絞る~絞って~しぼって B1@汁 を @入れる~入れました~いれました','I squeezed a mandarin orange and added the juice.'],
 ['@タオル は @強い~強く~つよく B1@絞る~絞らないでください~しぼらないでください','Please do not wring the towel too hard.'],
 ['@じゃがいも を B1@潰す~潰しました~つぶしました','I mashed the potatoes.'],
 ['@スプーン で B1@潰す と @簡単 です','It is easy if you mash them with a spoon.'],
 ['@箱 を B1@潰す~潰して~つぶして @小さい~小さく~ちいさく @する~しました~しました','I flattened the box to make it smaller.'],
]);
lesson('squashed-left-over-and-finished','Squashed, left over and finished',['B1@潰れる','B1@余る','B1@出来上がり'],
 '潰れます / 余ります / 出来上がり',
 '潰れる (tsubureru) describes something getting squashed, without naming who did it. 余る (amaru) describes what remains after enough has been used. 出来上がり (dekiagari) is the finished result or the point of completion.',[
 ['@袋 の @中 で @パン が B1@潰れる~潰れました~つぶれました','The bread got squashed in the bag.'],
 ['@重い @荷物 で @箱 が B1@潰れる~潰れていました~つぶれていました','The box had been crushed by the heavy luggage.'],
 ['B1@潰れる~潰れた~つぶれた @箱 は @使う~使いません~つかいません','I will not use the crushed box.'],
 ['@ご飯 が @少し B1@余る~余りました~あまりました','There was a little rice left over.'],
 ['B1@余る~余った~あまった @肉 を B1@冷凍 @する~しました~しました','I froze the leftover meat.'],
 ['@時間 が B1@余る~余ったら~あまったら @台所 を @片付ける~片付けます~かたづけます','If I have time left, I will tidy the kitchen.'],
 ['@料理 の B1@出来上がり を @待つ~待っています~まっています','I am waiting for the food to be ready.'],
 ['B1@出来上がり の @写真 を @撮る~撮りました~とりました','I took a photo of the finished result.'],
 ['@パン の B1@出来上がり は @明日 の @朝 です','The bread will be ready tomorrow morning.'],
]);
lesson('household-lights-and-fuel','Household lights and fuel',['B1@蛍光灯','B1@灯油','B1@ろうそく'],
 '蛍光灯 / 灯油 / ろうそく',
 '灯油 (tōyu) is fuel for some heaters. ストーブ (sutōbu) here means a room heater.',[
 ['@台所 の B1@蛍光灯 を @つける~つけました~つけました','I turned on the fluorescent light in the kitchen.'],
 ['@この B1@蛍光灯 は @明るい です','This fluorescent light is bright.'],
 ['@古い B1@蛍光灯 を @新しい @物 に B1@替える~替えました~かえました','I replaced the old fluorescent light with a new one.'],
 ['@ストーブ に @使う B1@灯油 を @買う~買いました~かいました','I bought kerosene for the heater.'],
 ['B1@灯油 は @安全 な @場所 に B1@保管 @する~しています~しています','I store the kerosene in a safe place.'],
 ['B1@灯油 の @値段 を @確認 @する~しました~しました','I checked the price of kerosene.'],
 ['B1@ろうそく に @火 を @つける~つけました~つけました','I lit a candle.'],
 ['@寝る @前 に B1@ろうそく の @火 を @消す~消しました~けしました','I put out the candle before going to bed.'],
 ['B1@ろうそく の @光 で @部屋 が @明るい~明るく~あかるく @なる~なりました~なりました','The candlelight brightened the room.'],
]);
lesson('cores-rust-and-adjustment','Cores, rust and adjustment',['B1@芯','B1@錆','B1@調節'],
 '芯 / 錆 / 調節',
 '芯 (shin) is the inner part: pencil lead, a fruit’s core or a candle’s wick. 錆 (sabi) is rust on metal. 調節 (chōsetsu) changes a setting or amount to make it suitable.',[
 ['@鉛筆 の B1@芯 が @折れる~折れました~おれました','The pencil lead broke.'],
 ['@りんご の B1@芯 を @取る~取りました~とりました','I removed the apple core.'],
 ['B1@ろうそく の B1@芯 が @長い~長すぎます~ながすぎます','The candle’s wick is too long.'],
 ['@古い @道具 に B1@錆 が @ある~あります~あります','There is rust on the old tools.'],
 ['B1@錆 を @落とす~落として~おとして から @使う~使います~つかいます','I will use it after removing the rust.'],
 ['@水 に @濡れる~濡れた~ぬれた @まま だ と B1@錆 が @出る~出ます~でます','Rust develops if it is left wet.'],
 ['@部屋 の B1@温度 を B1@調節 @する~しました~しました','I adjusted the room temperature.'],
 ['@ラジオ の @音 を B1@調節 @する~してください~してください','Please adjust the radio volume.'],
 ['B1@調節 @する~した~した @後 は @使う~使いやすい~つかいやすい です','It is easy to use after the adjustment.'],
]);
lesson('preparing-and-saving-a-meal','Preparing a meal and saving some for later',[],
 '刻む / 潰す / 出来上がり / 余る / 冷凍',
 'Follow the cooking from preparing the ingredients to keeping the leftovers.',[
 ['@最初 に @野菜 を B1@刻む~刻んで~きざんで @鍋 に @入れる~入れました~いれました','First, I chopped the vegetables and put them in a pan.'],
 ['@柔らかい~柔らかく~やわらかく B1@煮る~煮た~にた @じゃがいも を B1@潰す~潰しました~つぶしました','I mashed the potatoes after boiling them until soft.'],
 ['@みかん を B1@絞る~絞って~しぼって @飲み物 も @作る~作りました~つくりました','I also made a drink by squeezing mandarin oranges.'],
 ['@家族 は @料理 の B1@出来上がり を @待つ~待っていました~まっていました','My family was waiting for the food to be ready.'],
 ['@食事 の @後 で B1@余る~余った~あまった @料理 を B1@容器 に @入れる~入れました~いれました','After the meal, I put the leftover food in a container.'],
 ['@明日 @使う ために B1@冷凍 @する~しておきました~しておきました','I froze it to use tomorrow.'],
]);
lesson('putting-the-kitchen-in-order','Putting the kitchen in order',[],
 '蛍光灯 / 釜 / 錆 / 盆 / 保管 / 潰す',
 'Follow the tasks around a kitchen before everything is put away.',[
 ['@台所 に @入る~入って~はいって B1@蛍光灯 を @つける~つけました~つけました','I went into the kitchen and turned on the fluorescent light.'],
 ['@古い B1@釜 に B1@錆 が @ある~あった~あった から @磨く~磨きました~みがきました','The old cooking pot had rust on it, so I polished it.'],
 ['B1@盆 を B1@拭く~拭いて~ふいて @棚 に B1@戻す~戻しました~もどしました','I wiped the tray and put it back on the shelf.'],
 ['@道具 は @乾く~乾いた~かわいた @場所 に B1@保管 @する こと に @する~しました~しました','I decided to store the tools in a dry place.'],
 ['@使う~使わない~つかわない @箱 を B1@潰す~潰しました~つぶしました','I flattened the boxes I was not using.'],
 ['@最後 に B1@蛍光灯 を @消す~消して~けして @台所 を @出る~出ました~でました','Finally, I switched off the fluorescent light and left the kitchen.'],
]);
}
