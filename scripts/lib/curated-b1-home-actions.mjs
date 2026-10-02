export function authorHomeActions({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@日用品':'everyday supplies; daily necessities','B1@入れ物':'container',
 'B1@かぶせる':'to cover something with something else','B1@くるむ':'to wrap up in',
 'B1@ほどく':'to untie; to undo','B1@糊':'glue; paste',
 'B1@のこぎり':'saw','B1@ペンチ':'pliers','B1@はめる':'to fit into or onto; to insert',
 'B1@吊るす':'to hang up','B1@ぶら下げる':'to hang; to dangle',
 'B1@ねじる':'to twist','B1@散らかす':'to make a mess; to leave things scattered',
 'B1@散らかる':'to be scattered; to become untidy','B1@錆びる':'to rust',
 'B1@昼食':'lunch; midday meal','B1@湯のみ':'teacup','B1@おかわり':'another helping; a refill',
 'B1@薄める':'to dilute; to make less concentrated','B1@あぶる':'to toast; to grill over heat',
 'B1@かじる':'to bite into; to nibble','B1@しゃぶる':'to suck on',
 'B1@砕く':'to crush; to break into pieces','B1@砕ける':'to break into pieces',
 'B1@ひっくり返す':'to turn over; to tip over','B1@ひっくり返る':'to turn over; to tip over',
 'B1@風呂敷':'wrapping cloth','B1@手ぬぐい':'thin cotton towel',
 'B1@ナイロン':'nylon','B1@ファスナー':'zipper','B1@裏返す':'to turn inside out; to turn over',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('materials');
lesson('supplies-and-wrapping','Everyday supplies and wrapping',['B1@日用品','B1@入れ物','B1@かぶせる','B1@くるむ','B1@ほどく'],
 '入れ物 / かぶせます / くるみます / ほどきます','入れ物 is a container. かぶせる puts a cover over something; くるむ wraps something up in material. ほどく undoes a tie or wrapping.',[
 ['@店 で B1@日用品 を @買う~買いました~かいました','I bought everyday supplies at the shop.'],
 ['@必要 な B1@日用品 を @紙 に @書く~書きました~かきました','I wrote down the everyday supplies I needed.'],
 ['B1@日用品 は @この @棚 に @置く~置いています~おいています','We keep everyday supplies on this shelf.'],
 ['@大きい B1@入れ物 に @水 を @入れる~入れました~いれました','I put water in a large container.'],
 ['@この B1@入れ物 は @軽い です','This container is light.'],
 ['B1@空 の B1@入れ物 を @洗う~洗いました~あらいました','I washed the empty container.'],
 ['@箱 に B1@布 を B1@かぶせる~かぶせました~かぶせました','I covered the box with a cloth.'],
 ['@子供 に @帽子 を B1@かぶせる~かぶせました~かぶせました','I put a hat on the child.'],
 ['@使う~使わない~つかわない @机 に B1@布 を B1@かぶせる~かぶせます~かぶせます','I cover the desk with a cloth when it is not in use.'],
 ['@皿 を @紙 で B1@くるむ~くるみました~くるみました','I wrapped the plate in paper.'],
 ['@小さい @箱 を B1@布 で B1@くるむ~くるんで~くるんで @運ぶ~運びました~はこびました','I wrapped the small box in cloth and carried it.'],
 ['@赤ちゃん を @毛布 で B1@くるむ~くるみました~くるみました','I wrapped the baby in a blanket.'],
 ['B1@ひも を B1@ほどく~ほどきました~ほどきました','I untied the string.'],
 ['@靴 の B1@ひも を B1@ほどく~ほどいて~ほどいて から @脱ぐ~脱ぎました~ぬぎました','I untied my shoelaces before taking off my shoes.'],
 ['@荷物 の B1@ひも を B1@ほどく~ほどいて~ほどいて @中 を @確認 @する~しました~しました','I untied the string around the parcel and checked inside.'],
]);
lesson('wrapped-dishes-account','Packing dishes',[],
 'くるむ / 入れ物 / ほどく','Follow the dishes as they are packed and unpacked.',[
 ['@小さい @皿 を @紙 で B1@くるむ~くるみました~くるみました','I wrapped the small plates in paper.'],
 ['B1@くるむ~くるんだ~くるんだ @皿 を @大きい B1@入れ物 に @入れる~入れました~いれました','I put the wrapped plates in a large container.'],
 ['B1@入れ物 に B1@布 を B1@かぶせる~かぶせました~かぶせました','I covered the container with a cloth.'],
 ['@荷物 を B1@ひも で B1@結ぶ~結びました~むすびました','I tied up the parcel with string.'],
 ['@新しい @家 で @荷物 の B1@ひも を B1@ほどく~ほどきました~ほどきました','At the new home, I untied the string around the parcel.'],
 ['@皿 を @出す~出して~だして @棚 に @置く~置きました~おきました','I took out the plates and put them on a shelf.'],
]);
lesson('hand-tools-and-fitting','Hand tools and fitting parts',['B1@糊','B1@のこぎり','B1@ペンチ','B1@はめる'],
 '糊 / のこぎり / ペンチ / はめます','糊 is glue or paste here. のこぎり cuts by sawing; ペンチ grips, bends or cuts wire. はめる fits something into or onto its place.',[
 ['@紙 に B1@糊 を @つける~つけました~つけました','I put glue on the paper.'],
 ['B1@糊 が @乾く~乾く~かわく まで @待つ~待ちます~まちます','I will wait until the glue dries.'],
 ['@この B1@糊 は @紙 に @使う~使います~つかいます','We use this glue on paper.'],
 ['B1@のこぎり で @木 を @切る~切りました~きりました','I cut the wood with a saw.'],
 ['B1@のこぎり を @道具 の @箱 に B1@戻す~戻しました~もどしました','I put the saw back in the toolbox.'],
 ['@古い B1@のこぎり を @新しい B1@のこぎり に B1@替える~替えました~かえました','I replaced the old saw with a new one.'],
 ['B1@ペンチ で B1@針金 を @切る~切りました~きりました','I cut the wire with pliers.'],
 ['@小さい B1@ペンチ を @使う~使いました~つかいました','I used small pliers.'],
 ['B1@ペンチ を @机 の @上 に @置く~置きました~おきました','I put the pliers on the desk.'],
 ['@箱 に B1@蓋 を B1@はめる~はめました~はめました','I fitted the lid onto the box.'],
 ['@小さい B1@部品 を @穴 に B1@はめる~はめました~はめました','I fitted the small part into the hole.'],
 ['B1@蓋 を B1@はめる @前 に @中 を @確認 @する~しました~しました','I checked inside before fitting the lid.'],
]);
lesson('hanging-and-twisting','Hanging and twisting',['B1@吊るす','B1@ぶら下げる','B1@ねじる'],
 '吊るします / ぶら下げます / ねじります','吊るす and ぶら下げる both suspend something. ぶら下げる often suggests an object hanging down or dangling. ねじる applies a twisting motion.',[
 ['@窓 の @近く に @小さい @袋 を B1@吊るす~吊るしました~つるしました','We hung a small bag near the window.'],
 ['B1@布 を B1@吊るす~吊るして~つるして B1@乾かす~乾かしました~かわかしました','I hung the cloth up to dry.'],
 ['@壁 に @道具 を B1@吊るす~吊るします~つるします','We hang the tools on the wall.'],
 ['@かばん に @小さい @袋 を B1@ぶら下げる~ぶら下げました~ぶらさげました','I hung a small pouch from my bag.'],
 ['@首 から @カメラ を B1@ぶら下げる~ぶら下げています~ぶらさげています','I have a camera hanging from my neck.'],
 ['@手 に @袋 を B1@ぶら下げる~ぶら下げて~ぶらさげて @帰る~帰りました~かえりました','I went home carrying a bag hanging from my hand.'],
 ['B1@布 を @手 で B1@ねじる~ねじりました~ねじりました','I twisted the cloth with my hands.'],
 ['B1@針金 を B1@ねじる~ねじって~ねじって @形 を @変える~変えました~かえました','I twisted the wire to change its shape.'],
 ['B1@ひも を B1@ねじる~ねじらないで~ねじらないで ください','Please do not twist the cord.'],
]);
lesson('crushing-and-breaking','Crushing and breaking',['B1@砕く','B1@砕ける'],
 '石を砕きます / 石が砕けます','砕く acts on something and breaks it into pieces. 砕ける describes the breaking.',[
 ['@石 を @小さい~小さく~ちいさく B1@砕く~砕きました~くだきました','I crushed the stone into small pieces.'],
 ['B1@砕く~砕いた~くだいた @石 を B1@入れ物 に @入れる~入れました~いれました','I put the crushed stone in a container.'],
 ['@大きい @石 を B1@砕く の に @道具 を @使う~使いました~つかいました','I used a tool to break up the large stone.'],
 ['@石 が @細かい~細かく~こまかく B1@砕ける~砕けました~くだけました','The stone broke into small pieces.'],
 ['@落とす~落とした~おとした @皿 が B1@砕ける~砕けました~くだけました','The plate I dropped shattered.'],
 ['B1@砕ける~砕けた~くだけた @石 を @集める~集めました~あつめました','I collected the broken pieces of stone.'],
]);
lesson('mess-and-rust','Mess and rust',['B1@散らかす','B1@散らかる','B1@錆びる'],
 '部屋を散らかします / 物が散らかります / 錆びます','散らかす describes someone making a mess. 散らかる describes the untidy result, without naming who caused it. 錆びる describes metal becoming rusty.',[
 ['@子供 が @部屋 を B1@散らかす~散らかしました~ちらかしました','The child made a mess of the room.'],
 ['@机 の @上 を B1@散らかす~散らかさないで~ちらかさないで ください','Please do not make a mess on the desk.'],
 ['@紙 を @床 に B1@散らかす~散らかしてしまいました~ちらかしてしまいました','I scattered papers all over the floor.'],
 ['@部屋 が B1@散らかる~散らかっています~ちらかっています','The room is untidy.'],
 ['@机 の @上 に @本 が B1@散らかる~散らかっています~ちらかっています','Books are scattered across the desk.'],
 ['@掃除 の @後 で @また B1@散らかる~散らかりました~ちらかりました','It became untidy again after cleaning.'],
 ['@古い @道具 が B1@錆びる~錆びています~さびています','The old tools are rusty.'],
 ['@雨 で @自転車 が B1@錆びる~錆びました~さびました','The bicycle became rusty in the rain.'],
 ['B1@錆びる~錆びた~さびた @鉄 を @見つける~見つけました~みつけました','I found some rusty iron.'],
]);
lesson('tidying-the-tools-account','Putting the tools away',[],
 '散らかる / 錆びる / 吊るす','Follow the tools from the untidy desk to their storage places.',[
 ['@机 の @上 に @道具 が B1@散らかる~散らかっていました~ちらかっていました','Tools were scattered across the desk.'],
 ['B1@のこぎり と B1@ペンチ を @見つける~見つけました~みつけました','I found the saw and the pliers.'],
 ['B1@ペンチ は @少し B1@錆びる~錆びていました~さびていました','The pliers were a little rusty.'],
 ['@道具 を @壁 に B1@吊るす~吊るしました~つるしました','I hung the tools on the wall.'],
 ['@最後 に @小さい B1@部品 を B1@入れ物 に @入れる~入れました~いれました','Finally, I put the small parts in a container.'],
]);
useTopic('cooking');
lesson('lunch-teacups-seconds','Lunch, teacups and second helpings',['B1@昼食','B1@湯のみ','B1@おかわり'],
 '昼食 / 湯のみ / おかわり','昼食 is a more formal word for lunch. 湯のみ is a cup for tea. おかわり is another serving of food or a refill of a drink.',[
 ['@友達 と B1@昼食 を @食べる~食べました~たべました','I had lunch with a friend.'],
 ['B1@昼食 の @後 で @少し @歩く~歩きました~あるきました','I walked a little after lunch.'],
 ['@今日 の B1@昼食 は @弁当 です','Today’s lunch is a boxed lunch.'],
 ['B1@湯のみ に @お茶 を @入れる~入れました~いれました','I poured tea into a teacup.'],
 ['@白い B1@湯のみ を @二つ @買う~買いました~かいました','I bought two white teacups.'],
 ['@使う~使った~つかった B1@湯のみ を @洗う~洗いました~あらいました','I washed the used teacups.'],
 ['@ご飯 の B1@おかわり を @お願い @する~しました~しました','I asked for another helping of rice.'],
 ['@お茶 の B1@おかわり は @いかが です か','Would you like more tea?'],
 ['@子供 は @スープ を B1@おかわり @する~しました~しました','The child had another helping of soup.'],
]);
lesson('diluting-toasting-biting','Preparing and tasting food',['B1@薄める','B1@あぶる','B1@かじる','B1@しゃぶる'],
 '薄めます / あぶります / かじります / しゃぶります','薄める makes a liquid or flavor less concentrated. あぶる here means heating food over a fire. かじる takes a bite from something, rather than eating it all at once. しゃぶる means sucking on something in the mouth.',[
 ['@ジュース を @水 で B1@薄める~薄めました~うすめました','I diluted the juice with water.'],
 ['@スープ を @少し B1@薄める~薄めます~うすめます','I will dilute the soup a little.'],
 ['B1@薄める~薄めた~うすめた @ジュース を @コップ に @入れる~入れました~いれました','I poured the diluted juice into a glass.'],
 ['@魚 を @火 で B1@あぶる~あぶりました~あぶりました','I grilled the fish over a fire.'],
 ['@パン を @少し B1@あぶる~あぶりました~あぶりました','I lightly toasted the bread.'],
 ['B1@あぶる~あぶった~あぶった @魚 を @皿 に @置く~置きました~おきました','I put the grilled fish on a plate.'],
 ['@りんご を B1@かじる~かじりました~かじりました','I took a bite of an apple.'],
 ['@子供 が @パン を B1@かじる~かじっています~かじっています','The child is nibbling on bread.'],
 ['@パン を B1@かじる~かじった~かじった @後 で @お茶 を @飲む~飲みました~のみました','I drank tea after taking a bite of bread.'],
 ['@飴 を B1@しゃぶる~しゃぶっています~しゃぶっています','I am sucking on a piece of candy.'],
 ['@赤ちゃん が @指 を B1@しゃぶる~しゃぶっています~しゃぶっています','The baby is sucking their finger.'],
 ['@飴 を B1@しゃぶる~しゃぶった~しゃぶった @後 で @水 を @飲む~飲みました~のみました','I drank water after sucking on a piece of candy.'],
]);
lesson('turning-and-tipping','Turning something over and tipping over',['B1@ひっくり返す','B1@ひっくり返る'],
 '物をひっくり返します / 物がひっくり返ります','ひっくり返す turns something over, deliberately or accidentally. ひっくり返る describes the object turning or tipping over.',[
 ['@卵 を B1@ひっくり返す~ひっくり返しました~ひっくりかえしました','I turned the egg over.'],
 ['@箱 を B1@ひっくり返す~ひっくり返して~ひっくりかえして @中 の @物 を @出す~出しました~だしました','I turned the box upside down and emptied it.'],
 ['@コップ を B1@ひっくり返す~ひっくり返してしまいました~ひっくりかえしてしまいました','I accidentally knocked over the glass.'],
 ['@コップ が B1@ひっくり返る~ひっくり返りました~ひっくりかえりました','The glass tipped over.'],
 ['@風 で @軽い @箱 が B1@ひっくり返る~ひっくり返りました~ひっくりかえりました','The light box blew over in the wind.'],
 ['B1@ひっくり返る~ひっくり返った~ひっくりかえった @皿 を B1@戻す~戻しました~もどしました','I turned the overturned plate back over.'],
]);
lesson('lunch-at-home-account','Lunch at home',[],
 '昼食 / あぶる / 薄める / おかわり','Follow the preparation and the meal.',[
 ['@家 で B1@昼食 を @作る~作りました~つくりました','I made lunch at home.'],
 ['@パン を @少し B1@あぶる~あぶって~あぶって @皿 に @置く~置きました~おきました','I lightly toasted the bread and put it on a plate.'],
 ['@ジュース を @水 で B1@薄める~薄めて~うすめて @コップ に @入れる~入れました~いれました','I diluted the juice with water and poured it into a glass.'],
 ['@食事 の @後 で B1@湯のみ に @お茶 を @入れる~入れました~いれました','After the meal, I poured tea into a teacup.'],
 ['@友達 は @お茶 の B1@おかわり を @頼む~頼みました~たのみました','My friend asked for more tea.'],
]);
useTopic('clothing');
lesson('cloths-and-nylon','Wrapping cloths, towels and nylon',['B1@風呂敷','B1@手ぬぐい','B1@ナイロン'],
 '風呂敷 / 手ぬぐい / ナイロン','風呂敷 is a cloth used to wrap and carry things. 手ぬぐい is a thin cotton towel with several everyday uses. ナイロン is nylon, a synthetic material.',[
 ['B1@風呂敷 で @箱 を @包む~包みました~つつみました','I wrapped the box in a wrapping cloth.'],
 ['@青い B1@風呂敷 を @机 に @置く~置きました~おきました','I put a blue wrapping cloth on the desk.'],
 ['@使う~使わない~つかわない B1@風呂敷 を B1@たたむ~畳みました~たたみました','I folded the wrapping cloth that was not in use.'],
 ['B1@手ぬぐい で @手 を B1@拭く~拭きました~ふきました','I dried my hands with a thin cotton towel.'],
 ['@白い B1@手ぬぐい を @洗う~洗いました~あらいました','I washed the white cotton towel.'],
 ['B1@手ぬぐい を @首 に @かける~かけました~かけました','I draped the towel around my neck.'],
 ['@この @袋 は B1@ナイロン です','This bag is made of nylon.'],
 ['B1@ナイロン の @糸 を @使う~使いました~つかいました','I used nylon thread.'],
 ['@二つ の B1@ナイロン の @袋 を @比べる~比べました~くらべました','I compared two nylon bags.'],
]);
lesson('zippers-and-inside-out','Zippers and turning things inside out',['B1@ファスナー','B1@裏返す'],
 'ファスナー / 裏返します','ファスナー is a zipper. 裏返す brings the other side out or up: a garment can be turned inside out, and a card can be turned over.',[
 ['@かばん の B1@ファスナー を @閉める~閉めました~しめました','I closed the bag’s zipper.'],
 ['B1@ファスナー が @壊れる~壊れました~こわれました','The zipper broke.'],
 ['@上着 の B1@ファスナー を @開ける~開けました~あけました','I unzipped the jacket.'],
 ['@シャツ を B1@裏返す~裏返して~うらがえして @洗う~洗いました~あらいました','I turned the shirt inside out and washed it.'],
 ['@カード を B1@裏返す~裏返しました~うらがえしました','I turned the card over.'],
 ['B1@裏返す~裏返した~うらがえした @服 を @元 に B1@戻す~戻しました~もどしました','I turned the inside-out clothes back the right way.'],
]);
lesson('cloths-after-a-visit-account','Putting away cloths and clothes',[],
 '風呂敷 / 手ぬぐい / 裏返す / ファスナー','Follow the cloths and clothes as they are put away.',[
 ['@箱 を @包む~包んでいた~つつんでいた B1@風呂敷 を B1@たたむ~畳みました~たたみました','I folded the wrapping cloth that had been around the box.'],
 ['@使う~使った~つかった B1@手ぬぐい と @シャツ を @洗う~洗いました~あらいました','I washed the used towel and shirt.'],
 ['@シャツ を B1@裏返す~裏返して~うらがえして B1@干す~干しました~ほしました','I turned the shirt inside out and hung it to dry.'],
 ['@乾く~乾いた~かわいた B1@手ぬぐい を B1@ナイロン の @袋 に @入れる~入れました~いれました','I put the dry cotton towel in a nylon bag.'],
 ['@最後 に @かばん の B1@ファスナー を @閉める~閉めました~しめました','Finally, I closed the bag’s zipper.'],
]);
}
