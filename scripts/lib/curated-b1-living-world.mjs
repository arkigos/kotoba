export function authorLivingWorld({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@顕微鏡':'microscope','B1@細胞':'cell (in a living organism)','B1@膜':'membrane; thin film',
 'B1@器官':'organ','B1@構造':'structure; how parts are arranged',
 'B1@生理':'physiology; bodily functions','B1@視覚':'sense of sight; vision',
 'B1@知能':'intelligence','B1@刺激':'stimulus; stimulation; irritation',
 'B1@発達':'development; growth','B1@作用':'effect; action; function',
 'B1@有機':'organic (chemistry)','B1@酸化':'oxidation','B1@酸性':'acidity; acidic',
 'B1@養分':'nutrients; nourishment','B1@地下水':'groundwater',
 'B1@形成':'formation; taking shape','B1@起源':'origin; beginning',
 'B1@文明':'civilization','B1@緯度':'latitude','B1@経度':'longitude',
 'B1@温帯':'temperate zone','B1@寒帯':'polar climate zone; frigid zone',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('weather');
lesson('temperate-and-polar-climates','Temperate and polar climates',['B1@温帯','B1@寒帯'],
 '温帯 / 寒帯','温帯 names the temperate climate zone. 寒帯 names the cold polar zone. They describe climate regions rather than the weather on a single day.',[
 ['B1@温帯 の B1@気候 について @勉強 @する~しました~しました','I studied the climate of the temperate zone.'],
 ['@この @地域 は B1@温帯 です','This region is in the temperate zone.'],
 ['B1@温帯 の @冬 と @夏 の @違い を @調べる~調べました~しらべました','I examined the differences between winter and summer in the temperate zone.'],
 ['B1@寒帯 の @地域 を @地図 で @見る~見ました~みました','I looked at polar regions on a map.'],
 ['B1@寒帯 の B1@気候 は B1@温帯 の B1@気候 と @違う~違います~ちがいます','The polar climate differs from the temperate climate.'],
 ['B1@寒帯 で @生活 @する @人 の @話 を @聞く~聞きました~ききました','I listened to someone who lives in a polar region.'],
]);
useTopic('landscape');
lesson('latitude-and-longitude','Latitude and longitude',['B1@緯度','B1@経度'],
 '緯度 / 経度','緯度 locates a place north or south of the equator. 経度 locates it east or west of the prime meridian. A pair of coordinates uses both.',[
 ['@地図 で @町 の B1@緯度 を @調べる~調べました~しらべました','I looked up the town’s latitude on a map.'],
 ['@二つ の @町 は @同じ B1@緯度 に @ある~あります~あります','The two towns are at the same latitude.'],
 ['B1@緯度 が @高い @地域 の B1@気候 を @調べる~調べました~しらべました','I studied the climate in a high-latitude region.'],
 ['@町 の B1@経度 を @ノート に @書く~書きました~かきました','I wrote the town’s longitude in my notebook.'],
 ['@二つ の @島 の B1@経度 を @比べる~比べました~くらべました','I compared the longitudes of the two islands.'],
 ['B1@緯度 と B1@経度 で @場所 を @示す~示します~しめします','We specify a location using latitude and longitude.'],
]);
lesson('climate-map-account','Comparing places on a map',[],
 '緯度 / 経度 / 温帯 / 寒帯','Follow the map readings and the climate comparison.',[
 ['@授業 で @二つ の @町 の @場所 を @調べる~調べました~しらべました','In class, we looked up the locations of two towns.'],
 ['@地図 から B1@緯度 と B1@経度 を @読む~読みました~よみました','We read the latitude and longitude from the map.'],
 ['@一つ の @町 は B1@温帯 に @ある~あります~あります','One town is in the temperate zone.'],
 ['@別 の @町 は B1@寒帯 に @ある~あります~あります','The other town is in the polar zone.'],
 ['@二つ の @町 の @冬 の B1@気温 を @比べる~比べました~くらべました','We compared the towns’ winter air temperatures.'],
]);
useTopic('science');
lesson('cells-membranes-organs','Cells, membranes and organs',['B1@顕微鏡','B1@細胞','B1@膜','B1@器官','B1@構造'],
 '顕微鏡 / 細胞 / 膜 / 器官 / 構造','顕微鏡 is a microscope. 細胞 is a cell in a living organism. 膜 is a membrane or thin film. 器官 is an organ with a particular function; 構造 describes how parts are arranged.',[
 ['B1@顕微鏡 で @小さい @物 を @見る~見ます~みます','We look at small things through a microscope.'],
 ['B1@顕微鏡 を @使う @練習 を @する~しました~しました','We practiced using the microscope.'],
 ['B1@顕微鏡 の @位置 を @変える~変えました~かえました','We changed the position of the microscope.'],
 ['@植物 の B1@細胞 を B1@顕微鏡 で @見る~見ました~みました','I looked at plant cells through a microscope.'],
 ['B1@細胞 の @形 を @ノート に @描く~描きました~かきました','I drew the cell’s shape in my notebook.'],
 ['@二つ の B1@細胞 の @大きい~大きさ~おおきさ を @比べる~比べました~くらべました','I compared the sizes of two cells.'],
 ['B1@細胞 の B1@膜 について @勉強 @する~しました~しました','I learned about cell membranes.'],
 ['@水 の @上 に @薄い B1@膜 が @できる~できました~できました','A thin film formed on the water’s surface.'],
 ['@この B1@膜 の @厚い~厚さ~あつさ を B1@測定 @する~しました~しました','We measured the thickness of this membrane.'],
 ['@体 の B1@器官 の @名前 を @覚える~覚えました~おぼえました','I learned the names of the body’s organs.'],
 ['B1@器官 の @役割 を @調べる~調べました~しらべました','I studied the organ’s role.'],
 ['@この @図 は @体 の B1@器官 を @示す~示しています~しめしています','This diagram shows the body’s organs.'],
 ['B1@細胞 の B1@構造 を @図 で @見る~見ました~みました','I looked at the cell’s structure in a diagram.'],
 ['@この @機械 の B1@構造 は @簡単 です','This machine has a simple structure.'],
 ['@二つ の @植物 の B1@構造 を @比べる~比べました~くらべました','I compared the structures of two plants.'],
]);
lesson('physiology-and-senses','Physiology, sight and intelligence',['B1@生理','B1@視覚','B1@知能'],
 '生理 / 視覚 / 知能','生理 here means how living bodies function. In everyday conversation it can also mean menstruation. 視覚 is the sense of sight; 知能 is intelligence.',[
 ['@大学 で @植物 の B1@生理 を @研究 @する~しています~しています','I research plant physiology at university.'],
 ['@動物 の B1@生理 について @本 を @読む~読みました~よみました','I read a book about animal physiology.'],
 ['@植物 の B1@生理 を @調べる @ため に @実験 を @する~しました~しました','We conducted an experiment to investigate plant physiology.'],
 ['@目 は B1@視覚 に @関係 が @ある~あります~あります','The eyes are involved in vision.'],
 ['B1@視覚 で @色 の @違い が @わかる~わかります~わかります','We distinguish colors through sight.'],
 ['@動物 の B1@視覚 について @調べる~調べました~しらべました','I studied animals’ vision.'],
 ['@動物 の B1@知能 を @研究 @する~しています~しています','We research animal intelligence.'],
 ['B1@知能 の @検査 について @説明 @する~しました~しました','I explained the intelligence test.'],
 ['@この @本 は @子供 の B1@知能 について @書く~書かれています~かかれています','This book is about children’s intelligence.'],
]);
lesson('looking-at-a-plant-account','Looking at a plant in class',[],
 '細胞 / 構造 / 生理','Follow the class from the microscope to the explanation.',[
 ['@授業 で @植物 の B1@細胞 を @見る~見ました~みました','We looked at plant cells in class.'],
 ['@先生 が B1@細胞 の B1@構造 を @図 に @描く~描きました~かきました','The teacher drew the cell’s structure in a diagram.'],
 ['B1@細胞 の B1@膜 の @位置 を @確認 @する~しました~しました','We identified the position of the cell membrane.'],
 ['@植物 の B1@器官 の @役割 について @質問 @する~しました~しました','We asked about the roles of the plant’s organs.'],
 ['@最後 に @先生 が @植物 の B1@生理 を @説明 @する~しました~しました','Finally, the teacher explained the plant’s physiology.'],
]);
lesson('stimuli-and-development','Stimuli, effects and development',['B1@刺激','B1@発達','B1@作用'],
 '刺激 / 発達します / 作用','刺激 can be a physical stimulus or something that prompts interest or activity. 発達 describes development. 作用 is an effect or action that something has.',[
 ['@強い @光 は @目 に B1@刺激 を @与える~与えます~あたえます','Strong light stimulates the eyes.'],
 ['@体 に @与える B1@刺激 について @調べる~調べました~しらべました','We studied stimulation of the body.'],
 ['@新しい @本 は @私 に B1@刺激 を @与える~与えました~あたえました','The new book inspired me.'],
 ['@子供 の @言葉 の B1@発達 を @研究 @する~しています~しています','We study children’s language development.'],
 ['@植物 の B1@器官 が B1@発達 @する~しています~しています','The plant has well-developed organs.'],
 ['@技術 の B1@発達 について @話す~話しました~はなしました','We talked about technological development.'],
 ['@光 の B1@作用 を @調べる @実験 を @する~しました~しました','We conducted an experiment on the effects of light.'],
 ['@この @物質 は @水 に @どんな B1@作用 を @する~します~します か','What effect does this substance have on water?'],
 ['@二つ の @物質 の B1@作用 を @比べる~比べました~くらべました','We compared the effects of two substances.'],
]);
lesson('organic-materials-and-oxidation','Organic materials, oxidation and acidity',['B1@有機','B1@酸化','B1@酸性'],
 '有機物質 / 酸化します / 酸性','有機 here is used in chemistry, as in 有機物質, an organic substance. 酸化 names oxidation, a chemical process. 酸性 describes acidity; it is not the name of a particular acid.',[
 ['B1@有機 @物質 の B1@構造 を @調べる~調べました~しらべました','We studied the structure of an organic substance.'],
 ['@二つ の B1@有機 @物質 を @比べる~比べました~くらべました','We compared two organic substances.'],
 ['B1@有機 @物質 を @含む @水 を @検査 @する~しました~しました','We tested water containing organic substances.'],
 ['@鉄 が B1@酸化 @する~しました~しました','The iron oxidized.'],
 ['B1@酸化 の @前 と @後 で @色 を @比べる~比べました~くらべました','We compared the color before and after oxidation.'],
 ['@条件 を @変える~変えて~かえて B1@酸化 の @速度 を @調べる~調べました~しらべました','We changed the conditions and examined the rate of oxidation.'],
 ['@この B1@液体 は B1@酸性 です','This liquid is acidic.'],
 ['B1@酸性 の @強い~強さ~つよさ を @調べる~調べました~しらべました','We examined the degree of acidity.'],
 ['@この @土 は @少し B1@酸性 です','This soil is slightly acidic.'],
]);
lesson('materials-in-the-lab-account','Comparing materials in the laboratory',[],
 '有機 / 酸性 / 酸化 / 作用','Keep track of the different samples and the comparisons.',[
 ['@授業 で B1@有機 @物質 を @含む B1@液体 を @調べる~調べました~しらべました','In class, we examined a liquid containing organic substances.'],
 ['@この B1@液体 は @少し B1@酸性 でした','The liquid was slightly acidic.'],
 ['@別 の @実験 で @鉄 の B1@酸化 を @調べる~調べました~しらべました','In a separate experiment, we examined the oxidation of iron.'],
 ['@条件 の @違い と B1@作用 の @違い を @記録 @する~しました~しました','We recorded differences in the conditions and their effects.'],
 ['@最後 に @実験 の @結果 を @比べる~比べました~くらべました','Finally, we compared the results of the experiments.'],
]);
lesson('nutrients-water-and-formation','Nutrients, groundwater and formation',['B1@養分','B1@地下水','B1@形成'],
 '養分 / 地下水 / 形成します','養分 is nourishment used by a living thing. 地下水 is water below the ground. 形成する describes something taking shape or being formed.',[
 ['@植物 は @土 から B1@養分 を @吸う~吸います~すいます','Plants absorb nutrients from the soil.'],
 ['@土 に @含む~含まれる~ふくまれる B1@養分 を @調べる~調べました~しらべました','We examined the nutrients contained in the soil.'],
 ['@成長 に @必要 な B1@養分 について @勉強 @する~しました~しました','I learned about the nutrients needed for growth.'],
 ['B1@地下水 の @量 を @調べる~調べました~しらべました','We examined the amount of groundwater.'],
 ['@この @地域 で は B1@地下水 を @利用 @する~しています~しています','Groundwater is used in this region.'],
 ['B1@地下水 の B1@成分 を @検査 @する~しました~しました','We tested the composition of the groundwater.'],
 ['@山 の B1@形成 について @勉強 @する~しました~しました','I studied the formation of mountains.'],
 ['@水 の @上 に @薄い B1@膜 が B1@形成 @する~されました~されました','A thin film formed on the water’s surface.'],
 ['@山 の B1@形成 について @図 で @説明 @する~しました~しました','We explained the formation of mountains with a diagram.'],
]);
lesson('origins-and-civilizations','Origins and civilizations',['B1@起源','B1@文明'],
 '起源 / 文明','起源 is the beginning or source of something. 文明 describes a civilization and its developed social or material culture.',[
 ['@生命 の B1@起源 について @本 を @読む~読みました~よみました','I read a book about the origin of life.'],
 ['@この @言葉 の B1@起源 を @調べる~調べました~しらべました','I investigated the origin of this word.'],
 ['@先生 に @言葉 の B1@起源 について @質問 @する~しました~しました','I asked the teacher about the origins of words.'],
 ['@古い B1@文明 の @歴史 を @勉強 @する~しました~しました','I studied the history of an ancient civilization.'],
 ['@二つ の B1@文明 の @技術 を @比べる~比べました~くらべました','I compared the technologies of two civilizations.'],
 ['@川 と B1@文明 の @関係 について @話す~話しました~はなしました','We talked about the relationship between rivers and civilizations.'],
]);
lesson('water-and-plant-growth-account','Water and plant growth',[],
 '地下水 / 養分 / 発達','Follow the investigation of water and growing plants.',[
 ['@学校 で B1@地下水 を @使う @実験 を @する~しました~しました','At school, we conducted an experiment using groundwater.'],
 ['@最初 に @水 の B1@成分 を @調べる~調べました~しらべました','First, we examined the water’s composition.'],
 ['@植物 の @成長 に @必要 な B1@養分 を @確認 @する~しました~しました','We identified the nutrients needed for the plant’s growth.'],
 ['@植物 の B1@器官 の B1@発達 を @記録 @する~しました~しました','We recorded the development of the plant’s organs.'],
 ['@最後 に @植物 の B1@構造 を @図 に @描く~描きました~かきました','Finally, we drew a diagram of the plant’s structure.'],
]);
}
