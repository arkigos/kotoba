export function authorScienceProcesses({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@標準':'standard; norm','B1@一定':'constant; fixed','B1@未満':'less than; below a stated limit',
 'B1@確率':'probability; likelihood','B1@推定':'estimation based on evidence',
 'B1@無限':'infinite; without a limit','B1@光線':'ray; beam of light',
 'B1@望遠鏡':'telescope','B1@真空':'vacuum','B1@分解':'taking apart; decomposition',
 'B1@摩擦':'friction','B1@歯車':'gear; cogwheel','B1@球':'sphere; ball',
 'B1@軸':'axis; shaft','B1@塊':'lump; mass','B1@淡水':'fresh water; non-salt water',
 'B1@採集':'collecting specimens','B1@生存':'survival; being alive',
 'B1@無数':'countless; innumerable','B1@増減':'increase and decrease',
 'B1@系統':'lineage; related group; system',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('science');
lesson('standards-constants-and-limits','Standards, constants and limits',['B1@標準','B1@一定','B1@未満'],
 '標準 / 一定 / 未満',
 '標準 (hyōjun) is a standard used for comparison. 一定 (ittei) keeps something fixed or constant. 未満 (miman) means less than a stated amount: the limit itself is excluded.',[
 ['B1@標準 の @方法 で B1@測定 @する~しました~しました','We measured it using the standard method.'],
 ['@この @装置 は B1@標準 より @小さい です','This device is smaller than the standard size.'],
 ['B1@標準 の @長い~長さ~ながさ を @図 に @書く~書きました~かきました','I wrote the standard length on the diagram.'],
 ['@実験 の @間 は @水 の @量 を B1@一定 に @する~します~します','We keep the amount of water constant during the experiment.'],
 ['@機械 は B1@一定 の @速度 で @動く~動いています~うごいています','The machine is moving at a constant speed.'],
 ['@結果 は @いつも B1@一定 ではありません','The results are not always the same.'],
 ['@この @線 の @長い~長さ~ながさ は @一 @メートル B1@未満 です','This line is less than one metre long.'],
 ['@深い~深さ~ふかさ が @二 @メートル B1@未満 の @場所 を @調べる~調べました~しらべました','We examined places less than two metres deep.'],
 ['B1@直径 が @一 @メートル B1@未満 の @物 を @使う~使います~つかいます','We use objects with a diameter of less than one metre.'],
]);
lesson('probabilities-estimates-and-limits','Probabilities, estimates and infinity',['B1@確率','B1@推定','B1@無限'],
 '確率 / 推定します / 無限',
 '確率 (kakuritsu) expresses how likely something is. 推定 (suitei) estimates something from the available evidence. 無限 (mugen) means having no limit.',[
 ['@成功 @する B1@確率 を @計算 @する~しました~しました','We calculated the probability of success.'],
 ['@この @条件 で は @成功 の B1@確率 が @高い です','Under these conditions, the probability of success is high.'],
 ['B1@確率 は @五 @十 B1@パーセント B1@未満 でした','The probability was less than fifty percent.'],
 ['@古い @記録 から @人口 を B1@推定 @する~しました~しました','We estimated the population from old records.'],
 ['@魚 の @年齢 を B1@推定 @する~しています~しています','We are estimating the fish’s age.'],
 ['B1@推定 @する~した~した @結果 を @先生 に @説明 @する~しました~しました','We explained our estimated results to the teacher.'],
 ['@時間 は B1@無限 ではありません','Time is not unlimited.'],
 ['B1@無限 の @世界 を @想像 @する~しました~しました','I imagined an infinite world.'],
 ['@宇宙 は B1@無限 だ と @思う~思います~おもいます か','Do you think the universe is infinite?'],
]);
lesson('light-telescopes-and-vacuums','Light, telescopes and vacuums',['B1@光線','B1@望遠鏡','B1@真空'],
 '光線 / 望遠鏡 / 真空',
 '光線 (kōsen) is a ray or beam of light. 望遠鏡 (bōenkyō) is a telescope for seeing distant objects. 真空 (shinkū) describes a space without air or other matter.',[
 ['@窓 から B1@光線 が @入る~入ってきました~はいってきました','A beam of light came in through the window.'],
 ['B1@光線 の @方向 を @図 に @書く~書きました~かきました','I drew the direction of the light ray on the diagram.'],
 ['@鏡 で B1@光線 の @方向 を @変える~変えました~かえました','We changed the direction of the light beam with a mirror.'],
 ['B1@望遠鏡 で @月 を @見る~見ました~みました','I looked at the moon through a telescope.'],
 ['@学校 の B1@望遠鏡 は @大きい です','The school’s telescope is large.'],
 ['B1@望遠鏡 を @使う @方法 を @先生 に @教える~教えてもらいました~おしえてもらいました','My teacher showed me how to use the telescope.'],
 ['@この @装置 で B1@真空 を @作る~作ります~つくります','We create a vacuum with this device.'],
 ['B1@真空 の @中 で @実験 を @する~しました~しました','We carried out an experiment in a vacuum.'],
 ['B1@真空 に @する @方法 を @本 で @調べる~調べました~しらべました','I looked up how to create a vacuum in a book.'],
]);
lesson('disassembly-friction-and-gears','Taking things apart, friction and gears',['B1@分解','B1@摩擦','B1@歯車'],
 '分解します / 摩擦 / 歯車',
 '分解 (bunkai) takes something apart into its components. 摩擦 (masatsu) is friction between surfaces. 歯車 (haguruma) is a gear that passes movement between parts.',[
 ['@授業 で @古い @時計 を B1@分解 @する~しました~しました','We took apart an old clock in class.'],
 ['B1@分解 @する~する~する @前 に @機械 の @写真 を @撮る~撮りました~とりました','I photographed the machine before taking it apart.'],
 ['B1@分解 @する~した~した @物 を @机 に @並べる~並べました~ならべました','I arranged the disassembled pieces on the desk.'],
 ['@二つ の @物 の @間 の B1@摩擦 を @調べる~調べました~しらべました','We examined the friction between the two objects.'],
 ['B1@摩擦 の @力 を B1@測定 @する~しました~しました','We measured the force of friction.'],
 ['B1@摩擦 を @小さい~小さく~ちいさく @する @方法 を @考える~考えています~かんがえています','We are thinking about how to reduce friction.'],
 ['@時計 の @中 に @小さい B1@歯車 が @ある~あります~あります','There are small gears inside the clock.'],
 ['@この B1@歯車 は @ゆっくり @動く~動いています~うごいています','This gear is moving slowly.'],
 ['@壊れる~壊れた~こわれた B1@歯車 を @新しい @物 に @変える~変えました~かえました','We replaced the broken gear with a new one.'],
]);
lesson('spheres-shafts-and-lumps','Spheres, shafts and lumps',['B1@球','B1@軸','B1@塊'],
 '球 / 軸 / 塊',
 '球 (kyū) is a sphere or ball. 軸 (jiku) is an axis or the shaft around which something turns. 塊 (katamari) is a lump or solid mass.',[
 ['@ガラス の B1@球 を @机 に @置く~置きました~おきました','I placed a glass sphere on the desk.'],
 ['@二つ の B1@球 の @重い~重さ~おもさ を @比べる~比べました~くらべました','We compared the weights of the two spheres.'],
 ['B1@球 の B1@直径 を B1@測定 @する~しました~しました','We measured the sphere’s diameter.'],
 ['B1@軸 が @曲がる~曲がっている~まがっている から @動く~動きません~うごきません','It does not move because the shaft is bent.'],
 ['B1@軸 の @位置 を @確認 @する~しました~しました','We checked the position of the shaft.'],
 ['@図 に B1@軸 を @示す~示しました~しめしました','I marked the axis on the diagram.'],
 ['@土 の B1@塊 を @手 に @持つ~持ちました~もちました','I held a lump of earth in my hand.'],
 ['@鉄 の B1@塊 は @重い です','The lump of iron is heavy.'],
 ['@この B1@塊 は @中 が @柔らかい です','This lump is soft inside.'],
]);
lesson('fresh-water-collection-and-survival','Fresh water, collecting and survival',['B1@淡水','B1@採集','B1@生存'],
 '淡水 / 採集します / 生存',
 '淡水 (tansui) is fresh water rather than salt water. 採集 (saishū) collects specimens for study. 生存 (seizon) concerns being alive or surviving.',[
 ['B1@淡水 の @魚 を @学校 で @調べる~調べました~しらべました','We studied freshwater fish at school.'],
 ['B1@淡水 の @中 の @生物 を @調べる~調べています~しらべています','We are studying organisms in fresh water.'],
 ['@実験 の ために B1@淡水 を @用意 @する~しました~しました','We prepared fresh water for the experiment.'],
 ['@川 の @近く で @植物 を B1@採集 @する~しました~しました','We collected plants near the river.'],
 ['B1@採集 @する~した~した @場所 を @地図 に @書く~書きました~かきました','We marked the collection site on the map.'],
 ['@小さい @石 を B1@採集 @する~して~して B1@分類 @する~しました~しました','We collected small stones and classified them.'],
 ['@魚 の B1@生存 を @確認 @する~しました~しました','We confirmed that the fish were alive.'],
 ['@この @生物 の B1@生存 に @必要 な @条件 を @調べる~調べました~しらべました','We investigated the conditions this organism needs to survive.'],
 ['B1@生存 @する~している~している B1@個体 を @記録 @する~しました~しました','We recorded the individuals that were still alive.'],
]);
lesson('countless-things-changes-and-lineages','Countless things, changes and related groups',['B1@無数','B1@増減','B1@系統'],
 '無数 / 増減 / 系統',
 '無数 (musū) means too many to count; it does not claim literal infinity. 増減 (zōgen) is increase and decrease. 系統 (keitō) groups things by a shared origin or connection.',[
 ['@夜 の @空 に B1@無数 の @星 が @見える~見えました~みえました','Countless stars were visible in the night sky.'],
 ['@砂 の @中 に B1@無数 の @小さい @石 が @ある~ありました~ありました','There were countless small stones in the sand.'],
 ['B1@無数 の @光 が @遠く に @見える~見えました~みえました','Countless lights were visible in the distance.'],
 ['@人口 の B1@増減 を @去年 の @記録 で @確認 @する~しました~しました','We checked population increases and decreases in last year’s records.'],
 ['@水 の @量 の B1@増減 を @記録 @する~しています~しています','We are recording changes in the amount of water.'],
 ['@毎月 の @人口 の B1@増減 を @図 で @示す~示しました~しめしました','We showed monthly population increases and decreases on a diagram.'],
 ['@同じ B1@系統 の @植物 を @集める~集めました~あつめました','We gathered plants from the same related group.'],
 ['@この @二つ の @植物 は @別 の B1@系統 です','These two plants belong to different lineages.'],
 ['@植物 の B1@系統 を @図 で @説明 @する~しました~しました','We explained the plant lineages with a diagram.'],
]);
lesson('clock-investigation-account','Investigating an old clock',[],
 '分解 / 歯車 / 軸 / 摩擦 / 一定',
 'Follow the investigation from opening a clock to checking its movement.',[
 ['@授業 で @古い @時計 の @中 を @調べる~調べました~しらべました','We examined the inside of an old clock in class.'],
 ['@写真 を @撮る~撮って~とって から @先生 と @一緒 に B1@分解 @する~しました~しました','We took photographs and then took it apart with the teacher.'],
 ['B1@歯車 と B1@軸 の @位置 を @図 に @書く~書きました~かきました','We drew the positions of the gears and shafts on a diagram.'],
 ['B1@摩擦 が @大きい @場所 を @見つける~見つけました~みつけました','We found a place where there was a lot of friction.'],
 ['@先生 は @一つ @一つ の @部分 を @確認 @する~して~して @時計 を @直す~直しました~なおしました','The teacher checked each part and repaired the clock.'],
 ['@直す~直した~なおした @時計 は B1@一定 の @速度 で @動く~動いていました~うごいていました','The repaired clock was running at a constant speed.'],
]);
lesson('water-study-account','Studying life in fresh water',[],
 '淡水 / 生存 / 採集 / 系統 / 推定 / 増減',
 'Follow a study from collecting plants to recording changes.',[
 ['B1@淡水 の @中 で B1@生存 @する~している~している @植物 を @調べる~調べました~しらべました','We studied plants living in fresh water.'],
 ['@先生 と @一緒 に @植物 を B1@採集 @する~しました~しました','We collected plants with the teacher.'],
 ['@同じ B1@系統 の @物 を @一緒 に @並べる~並べました~ならべました','We arranged those from the same lineage together.'],
 ['@写真 から @植物 の @量 を B1@推定 @する~しました~しました','We estimated the amount of vegetation from photographs.'],
 ['@毎週 @同じ @場所 で @写真 を @撮る~撮りました~とりました','We took photographs in the same place every week.'],
 ['@記録 を @比べる~比べて~くらべて @植物 の @量 の B1@増減 を @調べる~調べました~しらべました','We compared the records and examined increases and decreases in the vegetation.'],
]);
}
