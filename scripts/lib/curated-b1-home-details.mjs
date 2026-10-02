export function authorHomeDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@たんす':'chest of drawers','B1@座布団':'floor cushion','B1@シーツ':'bed sheet',
 'B1@敷く':'to lay out; to spread underneath','B1@取り出す':'to take out from inside',
 'B1@はがす':'to peel off; to remove something stuck on','B1@こする':'to rub',
 'B1@隙間':'gap; narrow space','B1@栓':'stopper; plug','B1@水筒':'water bottle; flask',
 'B1@エプロン':'apron','B1@浴衣':'light cotton kimono; yukata',
 'B1@縞':'stripe; striped pattern','B1@無地':'plain; without a pattern','B1@リボン':'ribbon',
 'B1@真っ白':'pure white; completely white','B1@真っ黒':'completely black',
 'B1@真っ暗':'pitch-dark','B1@薄暗い':'dim; poorly lit',
 'B1@ピカピカ':'shining; gleaming','B1@ふわふわ':'soft and fluffy',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('materials');
lesson('drawers-cushions-and-sheets','Drawers, cushions and sheets',['B1@たんす','B1@座布団','B1@シーツ'],
 'たんす / 座布団 / シーツ',
 'たんす stores clothes in drawers. 座布団 (zabuton) is a cushion for sitting on the floor. シーツ is a bed sheet.',[
 ['B1@たんす に @冬 の @服 を @入れる~入れました~いれました','I put my winter clothes in the chest of drawers.'],
 ['B1@たんす の B1@引き出し が A1@開く~開きません~あきません','The drawer in the chest will not open.'],
 ['@新しい B1@たんす は @前 の @物 より @軽い です','The new chest of drawers is lighter than the old one.'],
 ['@畳 の @上 に B1@座布団 が @ある~あります~あります','There is a floor cushion on the tatami.'],
 ['@客 の ために B1@座布団 を @用意 @する~しました~しました','I prepared floor cushions for the guests.'],
 ['@この B1@座布団 は @柔らかい です ね','This floor cushion is soft, isn’t it?'],
 ['@朝 B1@シーツ を @洗う~洗いました~あらいました','I washed the sheets in the morning.'],
 ['@新しい B1@シーツ を @ベッド に @かける~かけました~かけました','I put a new sheet on the bed.'],
 ['B1@シーツ が @乾く~乾いた~かわいた から @部屋 に @持つ~持って~もって @入る~入りました~はいりました','The sheets were dry, so I brought them inside.'],
]);
lesson('laying-out-taking-out-and-peeling','Laying out, taking out and peeling off',['B1@敷く','B1@取り出す','B1@はがす'],
 '敷きます / 取り出します / はがします',
 '敷く (shiku) lays something underneath, such as bedding on a floor. 取り出す (toridasu) takes something out from inside. はがす removes something stuck to a surface.',[
 ['@畳 に @布団 を B1@敷く~敷きました~しきました','I laid out a futon on the tatami.'],
 ['@床 に @新聞 を B1@敷く~敷いて~しいて から @作業 を @始める~始めます~はじめます','I put newspaper on the floor before starting the work.'],
 ['@寝る @前 に B1@シーツ を B1@敷く~敷きます~しきます','I lay out a sheet before going to bed.'],
 ['B1@たんす から @シャツ を B1@取り出す~取り出しました~とりだしました','I took a shirt out of the chest of drawers.'],
 ['@袋 の @中 から @鍵 を B1@取り出す~取り出しました~とりだしました','I took my keys out of the bag.'],
 ['@箱 から B1@取り出す~取り出した~とりだした @皿 を @洗う~洗いました~あらいました','I washed the plates I had taken out of the box.'],
 ['B1@瓶 の B1@ラベル を B1@はがす~はがしました~はがしました','I peeled the label off the bottle.'],
 ['@古い B1@ラベル を @箱 から B1@はがす~はがします~はがします','I will peel the old label off the box.'],
 ['B1@ラベル を B1@はがす~はがして~はがして から @箱 を @使う~使ってください~つかってください','Please remove the label before using the box.'],
]);
lesson('rubbing-gaps-and-stoppers','Rubbing, gaps and stoppers',['B1@こする','B1@隙間','B1@栓'],
 'こすります / 隙間 / 栓',
 'こする rubs a surface. 隙間 (sukima) is a narrow gap. 栓 (sen) closes an opening, as a stopper or plug does.',[
 ['B1@布 で @机 を B1@こする~こすりました~こすりました','I rubbed the desk with a cloth.'],
 ['@この @皿 は @強い~強く~つよく B1@こする~こすらないでください~こすらないでください','Please do not scrub this plate hard.'],
 ['B1@こする~こすっても~こすっても B1@汚れ が @落ちる~落ちません~おちません','The dirt will not come off even when I rub it.'],
 ['@ドア の B1@隙間 から @風 が @入る~入ってきます~はいってきます','Wind comes in through the gap in the door.'],
 ['B1@たんす と @壁 の B1@隙間 に @紙 が @落ちる~落ちました~おちました','A piece of paper fell into the gap between the chest of drawers and the wall.'],
 ['@窓 の B1@隙間 を @調べる~調べています~しらべています','I am checking the gap in the window.'],
 ['B1@瓶 の B1@栓 を @取る~取りました~とりました','I removed the stopper from the bottle.'],
 ['B1@栓 を @する~して~して から B1@瓶 を @棚 に @置く~置きました~おきました','I put the stopper in and then placed the bottle on the shelf.'],
 ['@この B1@栓 は @別 の B1@瓶 に も @合う~合います~あいます','This stopper also fits another bottle.'],
]);
lesson('a-water-bottle-and-things-to-wear','A water bottle, apron and yukata',['B1@水筒','B1@エプロン','B1@浴衣'],
 '水筒 / エプロン / 浴衣',
 '水筒 (suitō) is a bottle or flask for carrying a drink. エプロン is an apron. 浴衣 (yukata) is a light cotton kimono, often worn in summer or at an inn.',[
 ['B1@水筒 に @冷たい @お茶 を @入れる~入れました~いれました','I filled my water bottle with cold tea.'],
 ['B1@水筒 を @洗う~洗って~あらって から @袋 に @入れる~入れます~いれます','I wash the water bottle before putting it in the bag.'],
 ['@子供 は @自分 の B1@水筒 を @学校 に @持つ~持って~もって @行く~行きます~いきます','My child takes their own water bottle to school.'],
 ['@料理 の @前 に B1@エプロン を @つける~つけました~つけました','I put on an apron before cooking.'],
 ['B1@エプロン の @ポケット に @紙 が @ある~ありました~ありました','There was a piece of paper in the apron pocket.'],
 ['@汚れる~汚れた~よごれた B1@エプロン を @洗濯 @する~しました~しました','I washed the dirty apron.'],
 ['@祭り に B1@浴衣 を @着る~着て~きて @行く~行きました~いきました','I wore a yukata to the festival.'],
 ['@この B1@浴衣 は @母 から @もらう~もらいました~もらいました','I received this yukata from my mother.'],
 ['B1@浴衣 を @脱ぐ~脱いで~ぬいで から B1@たんす に @入れる~入れました~いれました','I took off the yukata and then put it in the chest of drawers.'],
]);
lesson('stripes-plain-cloth-and-ribbons','Stripes, plain cloth and ribbons',['B1@縞','B1@無地','B1@リボン'],
 '縞 / 無地 / リボン',
 '縞 (shima) is a striped pattern. 無地 (muji) has no pattern; it does not have to be white. リボン is ribbon.',[
 ['@青い B1@縞 の @シャツ を @買う~買いました~かいました','I bought a shirt with blue stripes.'],
 ['@この B1@浴衣 の B1@縞 は @細い です','The stripes on this yukata are narrow.'],
 ['@白い B1@縞 が @ある B1@布 を @選ぶ~選びました~えらびました','I chose cloth with white stripes.'],
 ['B1@無地 の @シャツ は @この @ズボン に @合う~合います~あいます','A plain shirt goes well with these trousers.'],
 ['@この B1@エプロン は B1@無地 です','This apron is plain.'],
 ['B1@縞 の @物 より B1@無地 の @物 が @好き です','I prefer plain things to striped ones.'],
 ['@箱 に @赤い B1@リボン を B1@結ぶ~結びました~むすびました','I tied a red ribbon around the box.'],
 ['B1@リボン が @長い~長すぎる~ながすぎる から @切る~切りました~きりました','The ribbon was too long, so I cut it.'],
 ['@髪 に @小さい B1@リボン を @つける~つけています~つけています','She has a small ribbon in her hair.'],
]);
lesson('white-black-and-dark','Completely white, black and dark',['B1@真っ白','B1@真っ黒','B1@真っ暗'],
 '真っ白 / 真っ黒 / 真っ暗',
 '真っ白 (masshiro) is completely white; 真っ黒 (makkuro) is completely black. 真っ暗 (makkura) describes a place with almost no light.',[
 ['@洗う~洗った~あらった B1@シーツ は B1@真っ白 です','The washed sheets are pure white.'],
 ['B1@真っ白 な @壁 に @絵 を @かける~かけました~かけました','I hung a picture on the pure white wall.'],
 ['@外 は @雪 で B1@真っ白 に @なる~なりました~なりました','Everything outside turned white with snow.'],
 ['@鍋 の B1@底 が B1@真っ黒 に @なる~なりました~なりました','The bottom of the pot turned completely black.'],
 ['B1@真っ黒 な @猫 が @窓 の @近く に @いる~います~います','A completely black cat is near the window.'],
 ['@掃除 の @後 で @手 が B1@真っ黒 でした','My hands were black with dirt after cleaning.'],
 ['@電気 を @消す~消した~けした から @部屋 は B1@真っ暗 です','The room is pitch-dark because I turned off the light.'],
 ['B1@真っ暗 な @道 を @一人 で @歩く~歩きたくない~あるきたくない です','I do not want to walk alone along a pitch-dark road.'],
 ['@夜 に @なる~なる~なる と @庭 は B1@真っ暗 に @なる~なります~なります','The garden becomes pitch-dark when night falls.'],
]);
lesson('dim-shining-and-fluffy','Dim light, shiny surfaces and soft textures',['B1@薄暗い','B1@ピカピカ','B1@ふわふわ'],
 '薄暗い / ピカピカ / ふわふわ',
 '薄暗い (usugurai) means dim, with some light still present. ピカピカ describes a gleaming surface here. ふわふわ describes something soft and fluffy.',[
 ['@この @部屋 は @昼 も B1@薄暗い です','This room is dim even during the day.'],
 ['B1@薄暗い @廊下 の @電気 を @つける~つけました~つけました','I turned on the light in the dim hallway.'],
 ['@夕方 に @なる~なる~なる と @台所 が B1@薄暗い~薄暗く~うすぐらく @なる~なります~なります','The kitchen becomes dim in the evening.'],
 ['@掃除 の @後 で @床 が B1@ピカピカ に @なる~なりました~なりました','The floor was gleaming after cleaning.'],
 ['B1@ピカピカ の @靴 を @履く~履いています~はいています','He is wearing shiny shoes.'],
 ['@この @鍋 は @まだ B1@ピカピカ です','This pot is still gleaming.'],
 ['@新しい B1@座布団 は B1@ふわふわ です','The new floor cushion is soft and fluffy.'],
 ['B1@ふわふわ の @タオル で @手 を B1@拭く~拭きました~ふきました','I dried my hands with a fluffy towel.'],
 ['@洗う~洗った~あらった @毛布 が B1@ふわふわ に @なる~なりました~なりました','The blanket became fluffy after washing.'],
]);
lesson('preparing-a-room-account','Getting a room ready',[],
 '薄暗い / 隙間 / 取り出す / シーツ / 敷く / 座布団',
 'Follow the preparations as a room is made ready for a guest.',[
 ['@朝 の @部屋 は @まだ B1@薄暗い~薄暗かった~うすぐらかった です','The room was still dim in the morning.'],
 ['@カーテン の B1@隙間 から @光 が @入る~入っていました~はいっていました','Light was coming in through a gap in the curtains.'],
 ['B1@たんす から B1@真っ白 な B1@シーツ を B1@取り出す~取り出しました~とりだしました','I took a pure white sheet out of the chest of drawers.'],
 ['@畳 に @布団 を B1@敷く~敷いて~しいて B1@シーツ を @かける~かけました~かけました','I laid a futon on the tatami and put the sheet over it.'],
 ['@机 の @前 に B1@ふわふわ の B1@座布団 を @置く~置きました~おきました','I put a fluffy floor cushion in front of the desk.'],
 ['@客 が @来る @前 に @部屋 の @電気 を @つける~つけました~つけました','I turned on the room’s light before the guest arrived.'],
]);
lesson('kitchen-cleaning-account','Cleaning up in the kitchen',[],
 'エプロン / 栓 / 水筒 / はがす / こする / ピカピカ',
 'Follow the sequence of cleaning and putting things away.',[
 ['B1@無地 の B1@エプロン を @つける~つけて~つけて @掃除 を @始める~始めました~はじめました','I put on a plain apron and started cleaning.'],
 ['B1@瓶 の B1@栓 を @取る~取って~とって @中 を @洗う~洗いました~あらいました','I took the stopper out of the bottle and washed the inside.'],
 ['B1@水筒 も @洗う~洗って~あらって @棚 に @置く~置きました~おきました','I washed the water bottle too and put it on the shelf.'],
 ['@新しい @皿 から B1@ラベル を B1@はがす~はがしました~はがしました','I peeled the label off a new plate.'],
 ['@鍋 の B1@真っ黒 な B1@底 を B1@こする~こすりました~こすりました','I scrubbed the blackened bottom of the pot.'],
 ['@洗う~洗った~あらった @皿 は B1@ピカピカ でした','The plates I had washed were gleaming.'],
]);
lesson('summer-evening-account','Getting ready for a summer evening',[],
 '浴衣 / 縞 / リボン / 水筒 / 真っ暗',
 'Follow the preparations for an evening out.',[
 ['B1@たんす から B1@縞 の B1@浴衣 を B1@取り出す~取り出しました~とりだしました','I took a striped yukata out of the chest of drawers.'],
 ['B1@浴衣 を @着る~着て~きて @髪 に B1@リボン を @つける~つけました~つけました','I put on the yukata and attached a ribbon to my hair.'],
 ['B1@水筒 に @お茶 を @入れる~入れて~いれて @袋 に @入れる~入れました~いれました','I filled my water bottle with tea and put it in my bag.'],
 ['@玄関 で @友達 を @待つ~待っていました~まっていました','I was waiting for my friend at the entrance.'],
 ['@外 は @まだ B1@真っ暗 ではありませんでした','It was not completely dark outside yet.'],
 ['@友達 が @来る~来た~きた から @一緒 に @祭り に @行く~行きました~いきました','My friend arrived, so we went to the festival together.'],
]);
}
