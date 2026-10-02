export function authorObservationDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 1439:'observation; measurement',1372:'altitude; height above a reference level',1502:'area; surface or floor area',
 2245:'ruler',2477:'measuring ruler; measuring stick',2460:'scales; weighing device',
 2243:'volume; space occupied',2313:'capacity; internal volume',2119:'amount; quantity',
 2412:'net amount; net weight',2125:'heavy',2222:'gravity; gravitational pull',
 1263:'to pour',1654:'to float; to be afloat',2361:'to set afloat; to float something',
 2180:'to expand; to swell',2548:'to inflate; to expand something',2357:'to shrink; to contract',
 2204:'to harden; to solidify',2261:'to stick to; to adhere',2536:'to become cloudy; to become muddy',
 2824:'material; raw material',2327:'to lean; to tilt',2396:'to be dented; to cave in',
 1586:'reduction; scaling down',762:'to be added; to join',2716:'reaction; response',
 1871:'agricultural chemical; pesticide',2705:'occurrence; generation; production',2949:'spreading; diffusion',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('science');
lesson('observing-height-and-area','Observing height and area',[1439,1372,1502], '観測します / 高度 / 面積', '観測 is observing or measuring a phenomenon. 高度 here is altitude, rather than the height of an ordinary object. 面積 measures a surface or an area, such as a room’s floor.', [
 ['@毎朝 @同じ @場所 で 1439 を @する~しています~しています','We make observations in the same place every morning.'],
 ['@星 の 1439 に @参加 @する~しました~しました','I took part in observations of the stars.'],
 ['1439 の @結果 を @ノート に @書く~書きました~かきました','I wrote the observations in my notebook.'],
 ['@飛行機 の 1372 を @確認 @する~しました~しました','We checked the airplane’s altitude.'],
 ['1372 が @高い @場所 で @空気 を @調べる~調べました~しらべました','We examined the air at a high altitude.'],
 ['@この @装置 は 1372 を 1471 @する~します~します','This device measures altitude.'],
 ['@部屋 の 1502 を @計算 @する~しました~しました','I calculated the area of the room.'],
 ['@二つ の @土地 の 1502 を @比べる~比べました~くらべました','We compared the areas of the two plots of land.'],
 ['@地図 に @公園 の 1502 が @書く~書かれています~かかれています','The park’s area is written on the map.'],
]);
lesson('rulers-and-scales','Rulers and scales',[2245,2477,2460], '定規 / 物差し / 秤', '定規 is a ruler, often used to draw straight lines. 物差し emphasizes measuring length. 秤 measures weight.', [
 ['2245 で @線 を @引く~引きました~ひきました','I drew a line with a ruler.'],
 ['@机 の @上 に 2245 を @置く~置きました~おきました','I put the ruler on the desk.'],
 ['@この 2245 は @短い です','This ruler is short.'],
 ['2477 で @箱 の @長い~長さ~ながさ を @調べる~調べました~しらべました','I checked the length of the box with a measuring ruler.'],
 ['@木 の 2477 を @使う~使っています~つかっています','I use a wooden measuring ruler.'],
 ['2477 で @紙 の @長い~長さ~ながさ を @調べる~調べました~しらべました','I checked the length of the paper with a ruler.'],
 ['2460 に @袋 を @置く~置きました~おきました','I put the bag on the scales.'],
 ['@この 2460 で @重い~重さ~おもさ を 1471 @する~します~します','We measure weight with these scales.'],
 ['@実験 の @前 に 2460 を @確認 @する~しました~しました','We checked the scales before the experiment.'],
]);
lesson('measuring-a-box-account','Measuring a box',[], 'Different tools, different measurements', 'Follow a student measuring a box and weighing it.', [
 ['@先生 と @箱 の 1471 を @する~しました~しました','I took measurements of a box with the teacher.'],
 ['2477 で @箱 の @長い~長さ~ながさ を @確認 @する~しました~しました','I checked the length of the box with a ruler.'],
 ['2245 で @箱 の @図 を @紙 に @書く~書きました~かきました','I used a ruler to draw a diagram of the box on paper.'],
 ['@次 に @箱 を 2460 に @置く~置きました~おきました','Next, I placed the box on the scales.'],
 ['1471 の @結果 を @ノート に @書く~書きました~かきました','I wrote the measurement results in my notebook.'],
]);
lesson('volume-and-quantity','Volume and quantity',[2243,2313,2119], '体積 / 容積 / 分量', '体積 is the space occupied by something. 容積 often means how much a container can hold. 分量 is an amount or quantity; the context tells you whether it concerns a liquid, a solid or something else.', [
 ['@石 の 2243 を 1471 @する~しました~しました','We measured the volume of the stone.'],
 ['@二つ の @物 の 2243 を @比べる~比べました~くらべました','We compared the volumes of the two objects.'],
 ['@箱 の 2243 を @計算 @する~しました~しました','I calculated the volume of the box.'],
 ['@この @コップ の 2313 を @調べる~調べました~しらべました','We checked the capacity of this cup.'],
 ['2313 が @大きい @コップ を @選ぶ~選びました~えらびました','I chose a cup with a large capacity.'],
 ['@同じ 2313 の @箱 を @二つ @用意 @する~しました~しました','We prepared two boxes with the same capacity.'],
 ['@水 の 2119 を @間違える~間違えました~まちがえました','I got the amount of water wrong.'],
 ['@塩 の 2119 を @紙 に @書く~書きました~かきました','I wrote down the quantity of salt.'],
 ['@二つ の @コップ に @同じ 2119 の @水 を @入れる~入れました~いれました','I put the same quantity of water into the two cups.'],
]);
lesson('weight-and-gravity','Weight and gravity',[2412,2125,2222], '正味 / 重たい / 重力', '正味 is the net amount, with packaging or other extras excluded. 重たい is another common way to say heavy. 重力 names gravity, the physical pull discussed in these examples.', [
 ['@袋 の @中 の @米 は 2412 @百 @グラム です','There is a net weight of one hundred grams of rice in the bag.'],
 ['2412 の @重い~重さ~おもさ を 2460 で @調べる~調べました~しらべました','We checked the net weight with scales.'],
 ['@この @商品 に は 2412 @百 @グラム と @書く~書かれています~かかれています','This product is marked “net weight: one hundred grams.”'],
 ['@この @箱 は @思う~思った~おもった より 2125 です','This box is heavier than I expected.'],
 ['2125 @荷物 を @床 に @置く~置きました~おきました','I put the heavy luggage on the floor.'],
 ['@水 を @入れる~入れたら~いれたら @袋 が 2125~重たく~おもたく @なる~なりました~なりました','The bag became heavy when I put water in it.'],
 ['@授業 で 2222 について @勉強 @する~しました~しました','We learned about gravity in class.'],
 ['2222 の @働き を @図 で @説明 @する~しました~しました','I explained how gravity acts using a diagram.'],
 ['@地球 の 2222 について @先生 に @質問 @する~しました~しました','I asked the teacher about Earth’s gravity.'],
]);
lesson('pouring-and-floating','Pouring and floating',[1263,1654,2361], '注ぎます / 浮かびます / 浮かべます', '注ぐ is pouring. 浮かぶ describes something floating; 浮かべる describes someone setting it afloat. Pair が with the thing floating and を with the thing someone puts on the water.', [
 ['@コップ に @水 を 1263~注ぎました~そそぎました','I poured water into the cup.'],
 ['@小さい @コップ に @少し 1544 を 1263~注ぎました~そそぎました','I poured a little liquid into the small cup.'],
 ['@水 を 1263~注ぐ~そそぐ @前 に @コップ を @洗う~洗いました~あらいました','I washed the cup before pouring in the water.'],
 ['@池 に @葉 が 1654~浮かんでいます~うかんでいます','Leaves are floating on the pond.'],
 ['@水 に 1654~浮かぶ~うかぶ @木 を @見る~見ました~みました','I saw a piece of wood floating in the water.'],
 ['@小さい @船 が @静か に 1654~浮かんでいました~うかんでいました','A small boat was floating quietly.'],
 ['@子供 が @紙 の @船 を @水 に 2361~浮かべました~うかべました','The child set a paper boat afloat on the water.'],
 ['@大きい @コップ に @花 を 2361~浮かべました~うかべました','I floated flowers in a large cup.'],
 ['@葉 を 2361~浮かべて~うかべて @水 の @流れ を @見る~見ました~みました','We floated a leaf and watched the flow of the water.'],
]);
lesson('a-water-observation-account','Watching a leaf on water',[], 'Preparing and observing', 'Follow a simple observation, from filling a cup to recording its position.', [
 ['@大きい @コップ を @机 の @上 に @置く~置きました~おきました','We placed a large cup on the desk.'],
 ['@決める~決めた~きめた 2119 の @水 を 1263~注ぎました~そそぎました','We poured in the chosen amount of water.'],
 ['@水 に @小さい @葉 を 2361~浮かべました~うかべました','We floated a small leaf on the water.'],
 ['@葉 が 1654~浮かんでいる~うかんでいる @場所 を @確認 @する~しました~しました','We checked where the leaf was floating.'],
 ['1439 の @後 で @葉 の @位置 を @図 に @書く~書きました~かきました','After the observation, we drew the leaf’s position in a diagram.'],
]);
lesson('expanding-and-shrinking','Expanding and shrinking',[2180,2548,2357], '膨らみます / 膨らます / 縮みます', '膨らむ describes something becoming larger or inflated. 膨らます is making it expand or inflating it. 縮む describes something becoming smaller or shorter.', [
 ['1743 が @少し 2180~膨らみました~ふくらみました','The balloon expanded a little.'],
 ['@空気 を @入れる~入れたら~いれたら @袋 が 2180~膨らみました~ふくらみました','The bag expanded when we put air into it.'],
 ['2180~膨らんだ~ふくらんだ 1743 の @大きい~大きさ~おおきさ を @比べる~比べました~くらべました','We compared the sizes of the inflated balloons.'],
 ['@子供 が 1743 を 2548~膨らましました~ふくらましました','The child inflated a balloon.'],
 ['@袋 を @空気 で 2548~膨らまします~ふくらまします','We inflate the bag with air.'],
 ['1743 を 2548~膨らます~ふくらます @前 に @穴 が @ある~ない~ない か @見る~見ました~みました','I checked for holes before inflating the balloon.'],
 ['@洗う~洗ったら~あらったら @シャツ が 2357~縮みました~ちぢみました','My shirt shrank when I washed it.'],
 ['@この @シャツ は @水 に @入れる~入れて~いれて も 2357~縮みませんでした~ちぢみませんでした','This shirt did not shrink even when put in water.'],
 ['@少し 2357~縮んだ~ちぢんだ @服 を @子供 に @上げる~あげました~あげました','I gave the clothes that had shrunk a little to my child.'],
]);
lesson('hardening-sticking-cloudiness','Hardening, sticking and cloudiness',[2204,2261,2536], '固まります / くっつきます / 濁ります', '固まる describes something becoming firm or solid. くっつく means sticking to something, with に marking the surface. 濁る describes a liquid becoming cloudy or muddy.', [
 ['1544 が 2204~固まる~かたまる まで @待つ~待ちました~まちました','We waited for the liquid to solidify.'],
 ['2204~固まった~かたまった @土 を @調べる~調べました~しらべました','We examined the hardened soil.'],
 ['1544 が @冷える~冷えて~ひえて 2204~固まりました~かたまりました','The liquid cooled and solidified.'],
 ['@紙 が @手 に 2261~くっつきました~くっつきました','The paper stuck to my hand.'],
 ['@二つ の @物 が 2261~くっついています~くっついています','The two objects are stuck together.'],
 ['@濡れる~濡れた~ぬれた @葉 が @靴 に 2261~くっつきました~くっつきました','A wet leaf stuck to my shoe.'],
 ['@雨 の @後 で @川 の @水 が 2536~濁りました~にごりました','The river water became muddy after the rain.'],
 ['2536~濁った~にごった @水 の 1445 を @調べる~調べました~しらべました','We examined the composition of the cloudy water.'],
 ['@この @池 の @水 は @昨日 より 2536~濁っています~にごっています','The water in this pond is cloudier than yesterday.'],
]);
lesson('materials-and-shapes','Materials and shapes',[2824,2327,2396], '素材 / 傾きます / 凹みます', '素材 is the material something is made from. 傾く is leaning or tilting. 凹む describes a dent or a surface sinking inward; here it concerns an object’s shape.', [
 ['@この @服 の 2824 を @確認 @する~しました~しました','I checked the material of these clothes.'],
 ['@軽い 2824 を @選ぶ~選びました~えらびました','We chose a lightweight material.'],
 ['@形 は @同じ です が 2824 が @違う~違います~ちがいます','The shapes are the same, but the materials are different.'],
 ['@棚 が @少し 2327~傾いています~かたむいています','The shelf is leaning a little.'],
 ['@箱 が @右 に 2327~傾きました~かたむきました','The box tilted to the right.'],
 ['2327~傾いた~かたむいた @板 を @写真 に @撮る~撮りました~とりました','We photographed the tilted board.'],
 ['@箱 の @角 が 2396~凹んでいます~へこんでいます','The corner of the box is dented.'],
 ['@落とす~落とした~おとした @箱 が @少し 2396~凹みました~へこみました','The box I dropped became slightly dented.'],
 ['2396~凹んだ~へこんだ @場所 を @写真 に @撮る~撮りました~とりました','We photographed the dented area.'],
]);
lesson('comparing-materials-account','Comparing two shirts',[], 'Before and after', 'Follow students comparing how two shirts change in water.', [
 ['@違う 2824 の @白い @シャツ と @青い @シャツ を @用意 @する~しました~しました','We prepared a white shirt and a blue shirt made from different materials.'],
 ['2477 で @シャツ の @長い~長さ~ながさ を @調べる~調べました~しらべました','We checked the lengths of the shirts with a ruler.'],
 ['@同じ 2119 の @水 で @白い @シャツ と @青い @シャツ を @洗う~洗いました~あらいました','We washed the white shirt and the blue shirt using the same amount of water.'],
 ['@洗う~洗った~あらった @白い @シャツ が 2357~縮みました~ちぢみました','The white shirt we washed shrank.'],
 ['@実験 の @前 と @後 の @長い~長さ~ながさ を @比べる~比べました~くらべました','We compared the lengths before and after the experiment.'],
]);
lesson('changes-and-responses','Changes and responses',[1586,762,2716], '縮小します / 加わります / 反応', '縮小 is making something smaller or reducing its scale. 加わる describes something being added or someone joining. 反応 is a reaction or response; the surrounding words tell you what is responding.', [
 ['@図 を 1586 @する~して~して @紙 に @印刷 @する~しました~しました','I reduced the diagram and printed it on paper.'],
 ['@実験 の @計画 を 1586 @する~しました~しました','We scaled down the experimental plan.'],
 ['1586 @する~した~した @写真 は @少し @見る~見にくい~みにくい です','The reduced photograph is a little difficult to see.'],
 ['@水 に @塩 が 762~加わりました~くわわりました','Salt was added to the water.'],
 ['@研究 に @新しい @人 が 762~加わりました~くわわりました','A new person joined the research.'],
 ['@この @装置 に は @大きい @力 が 762~加わります~くわわります','A large force acts on this device.'],
 ['@実験 で @小さな 2716 が @起きる~起きました~おきました','A small reaction occurred in the experiment.'],
 ['@光 に 2716 @する @物質 を @調べる~調べました~しらべました','We examined a substance that reacts to light.'],
 ['2716 が @起きる まで の @時間 を 1471 @する~しました~しました','We measured the time until the reaction occurred.'],
]);
lesson('environmental-observations','Environmental observations',[1871,2705,2949], '農薬 / 発生 / 拡散', '農薬 names agricultural chemicals, including pesticides. 発生 means something occurring or being produced, such as gas or heat. 拡散 is spreading or diffusion; here it describes substances spreading through air or water.', [
 ['@先生 に 1871 の @使用 について @聞く~聞きました~ききました','We asked the teacher about the use of agricultural chemicals.'],
 ['@川 の @水 に @残る~残った~のこった 1871 を @調べる~調べました~しらべました','We investigated agricultural chemicals remaining in the river water.'],
 ['1871 が @環境 に @与える @影響 を @研究 @する~しています~しています','We are researching the effects of agricultural chemicals on the environment.'],
 ['@装置 で @熱 が 2705 @する~しました~しました','Heat was produced in the device.'],
 ['1125 の 2705 を @確認 @する~しました~しました','We confirmed that gas was being produced.'],
 ['@問題 の 2705 を @先生 に @伝える~伝えました~つたえました','We told the teacher that a problem had occurred.'],
 ['@空気 の @中 で 1125 が 2949 @する~しています~しています','The gas is diffusing through the air.'],
 ['@物質 の 2949 を @調べる @実験 を @する~しました~しました','We carried out an experiment investigating the diffusion of a substance.'],
 ['@水 の @中 の 1445 の 2949 を @図 で @説明 @する~しました~しました','We explained the diffusion of a component through water using a diagram.'],
]);
lesson('recording-an-investigation-account','Recording an investigation',[], 'Observations and a report', 'Follow a group observing river water, recording results and discussing the limits of their observations.', [
 ['@川 の @水 が 2536~濁っていた~にごっていた から 1445 を @調べる~調べました~しらべました','We examined the river water’s composition because it was cloudy.'],
 ['@同じ @場所 で 1439 を @続ける~続けました~つづけました','We continued making observations at the same location.'],
 ['1871 が @ある~ある~ある か @調べる @実験 も @する~しました~しました','We also carried out a test for agricultural chemicals.'],
 ['@結果 を @図 に @する~して~して 1871 の @影響 について @話す~話しました~はなしました','We put the results in a diagram and discussed the effects of agricultural chemicals.'],
 ['@まだ @わかる~わからない~わからない こと を @先生 に @質問 @する~しました~しました','We asked the teacher about what we still did not understand.'],
]);
}
