export function authorScienceDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 105:'powerful; strong',281:'mechanism; mechanical structure',804:'percent',867:'magnetism',
 1125:'gas; gaseous substance',1507:'acceleration; speeding up',1508:'hydrogen',1523:'underlying principle',
 1544:'liquid',1647:'compression',1664:'air pressure; atmospheric pressure',1743:'balloon',1942:'magnet',
 2003:'chemically neutral',2272:'concentration of a substance',1472:'transparent; clear',2335:'even number',2340:'attraction; gravitational pull',
 2457:'rounding off',2504:'decimal; decimal fraction',2553:'acceleration; rate of change in velocity',
 2578:'fraction',2781:'evolution',2884:'deterioration; getting worse',2892:'concept; notion',
 2966:'pressure',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('science');
lesson('principles','How something works',[1523,281,2892], '原理を説明します / 機構の図 / 概念を理解します', '原理 is an underlying principle explaining how something works. 機構 refers to a mechanism or structure; here it concerns machines. 概念 is a concept or general idea.', [
 ['@この @機械 の 1523 を @説明 @する~します~します','I will explain the principle behind this machine.'],
 ['@実験 で 1523 を @確認 @する~しました~しました','We checked the principle through an experiment.'],
 ['1523 が @わかる まで @先生 に @質問 @する~しました~しました','I kept asking the teacher questions until I understood the principle.'],
 ['@時計 の 281 を @図 で @見る~見ました~みました','I looked at a diagram of the clock mechanism.'],
 ['@この @装置 は 281 が @複雑 です','This device has a complex mechanism.'],
 ['281 を @変える @前 に @安全 を @確認 @する~します~します','We check safety before changing the mechanism.'],
 ['@授業 で @新しい 2892 を @知る~知りました~しりました','We learned about a new concept in class.'],
 ['@先生 は 2892 を @簡単 な @言葉 で @説明 @する~しました~しました','The teacher explained the concept in simple words.'],
 ['@二つ の 2892 の @違い を @ノート に @書く~書きました~かきました','I wrote the difference between the two concepts in my notebook.'],
]);
lesson('gases','Gases and liquids',[1125,1544,1508], '気体と液体 / 水素の量', '気体 is a gas as a state of matter; 液体 is a liquid. 水素 is hydrogen. These words name substances or their states, while 酸素 names oxygen.', [
 ['@空気 は 1125 です','Air is a gas.'],
 ['1125 の @種類 を @調べる~調べています~しらべています','We are investigating the types of gas.'],
 ['@この @装置 で 1125 の @量 を 1471 @する~します~します','We measure the amount of gas with this device.'],
 ['@コップ に @少し 1544 が @入る~入っています~はいっています','There is a little liquid in the cup.'],
 ['1544 の 1445 を @確認 @する~しました~しました','We checked the liquid’s composition.'],
 ['1125 と 1544 の @違い を @説明 @する~してください~してください','Please explain the difference between a gas and a liquid.'],
 ['1508 について @科学 の @本 で @調べる~調べました~しらべました','I looked up hydrogen in a science book.'],
 ['@先生 は 1508 と 314 の @関係 を @図 で @説明 @する~しました~しました','The teacher used a diagram to explain the relationship between hydrogen and oxygen.'],
 ['1508 の @利用 について @研究 @する~しています~しています','We are researching uses of hydrogen.'],
]);
lesson('pressure','Pressure and compression',[2966,1647,1664], '圧力を測定します / 気体を圧縮します / 気圧の変化', '圧力 is pressure. 圧縮 means compression and becomes a verb with する. 気圧 specifically means air pressure. Keep the physical sense of 圧力 separate from social or political pressure.', [
 ['@装置 の @中 の 2966 を 1471 @する~します~します','We measure the pressure inside the device.'],
 ['2966 が @高い~高かった~たかかった です から @実験 を @中止 @する~しました~しました','We stopped the experiment because the pressure was high.'],
 ['2966 の @変化 を @図 に @書く~書きました~かきました','We recorded the pressure change on a diagram.'],
 ['@この @機械 は 1125 を 1647 @する~します~します','This machine compresses gas.'],
 ['1647 の 1523 を @勉強 @する~しました~しました','We studied the principle of compression.'],
 ['1125 の 1647 に は 54 が @必要 です','Compressing gas requires energy.'],
 ['@今日 は 1664 が @低い です','The air pressure is low today.'],
 ['1664 の @変化 と @天気 の @関係 を @調べる~調べました~しらべました','We investigated the relationship between changes in air pressure and the weather.'],
 ['@毎日 @同じ @時間 に 1664 を 1471 @する~しています~しています','We measure air pressure at the same time every day.'],
]);
lesson('balloon','A balloon and the air inside',[1743], '風船に空気を入れます', '風船 is a balloon. It can refer to a toy balloon or a larger balloon used for flight; these examples concern the small kind you hold.', [
 ['1743 に @空気 を @入れる~入れました~いれました','I put air into the balloon.'],
 ['1743 の @大きい~大きさ~おおきさ を @比べる~比べます~くらべます','We compare the sizes of the balloons.'],
 ['@青い 1743 に は @赤い 1743 より @多い~多く~おおく の @空気 が @入る~入っています~はいっています','The blue balloon contains more air than the red one.'],
 ['@子供 が @小さい 1743 を @持つ~持っています~もっています','The child is holding a small balloon.'],
]);
lesson('measurement-report','Recording a simple investigation',[], 'Measurements and comparisons', 'Follow what a class measures, compares and records during an investigation.', [
 ['@まず 1125 と 1544 の @違い を @勉強 @する~しました~しました','First, we learned the difference between gases and liquids.'],
 ['@先生 は 1743 を @使う~使って~つかって @空気 の @量 を @説明 @する~しました~しました','The teacher used a balloon to explain the amount of air.'],
 ['1743 の @大きい~大きさ~おおきさ と @中 の 2966 の @関係 を @調べる~調べました~しらべました','We investigated the relationship between the balloon’s size and the pressure inside it.'],
 ['@次 に @教室 の 1664 を 1471 @する~しました~しました','Next, we measured the air pressure in the classroom.'],
 ['1647 の 1523 が @わかる ように @図 を @書く~書きました~かきました','We drew a diagram to help us understand the principle of compression.'],
 ['@最後 に @装置 の 281 について @質問 @する~しました~しました','Finally, we asked questions about the device’s mechanism.'],
 ['@新しい 2892 の @説明 を @家 で @読む~読みました~よみました','I read the explanation of the new concept at home.'],
]);
lesson('magnetism','Magnets and magnetic force',[1942,867,105], '磁石の力 / 磁気を利用します / 強力なN', '磁石 is a magnet; 磁気 is magnetism, the phenomenon rather than the object. 強力 describes something as powerful and takes な before a noun.', [
 ['1942 が @鉄 を @引く~引いています~ひいています','The magnet is pulling the iron.'],
 ['@小さい 1942 を @机 に @置く~置きました~おきました','I put a small magnet on the desk.'],
 ['@二つ の 1942 の @力 を @比べる~比べます~くらべます','We compare the strength of two magnets.'],
 ['@この @装置 は 867 を @利用 @する~しています~しています','This device uses magnetism.'],
 ['867 の @影響 を @調べる @実験 です','This is an experiment to investigate the effects of magnetism.'],
 ['@先生 に 867 の 1523 を @聞く~聞きました~ききました','I asked the teacher about the principles of magnetism.'],
 ['105 な 1942 を @使う~使っています~つかっています','We are using a powerful magnet.'],
 ['@この @機械 は @小さい です が 105 です','This machine is small but powerful.'],
 ['105 な @装置 の @使用 に は @注意 が @必要 です','Care is needed when using powerful equipment.'],
]);
lesson('motion','Motion and acceleration',[1507,2553,2340], '加速します / 加速度を測定します / 地球の引力', '加速 is speeding up; 加速度 is the measurable rate of change in velocity. 引力 is an attractive force, including gravitational pull. 地球の引力 refers to Earth’s gravity.', [
 ['@電車 が 1507 @する~しています~しています','The train is speeding up.'],
 ['1507 の @後 で @速度 を @確認 @する~しました~しました','We checked the speed after accelerating.'],
 ['@車 の 1507 を @図 で @説明 @する~します~します','I will explain the car’s acceleration with a diagram.'],
 ['@実験 で 2553 を 1471 @する~しました~しました','We measured acceleration in the experiment.'],
 ['2553 と @速度 は @同じ ではありません','Acceleration and speed are not the same.'],
 ['@この @装置 で 2553 の @変化 が @わかる~わかります~わかります','This device shows changes in acceleration.'],
 ['@地球 の 2340 について @勉強 @する~しています~しています','We are learning about Earth’s gravity.'],
 ['2340 と 2899 の @関係 を @調べる~調べました~しらべました','We investigated the relationship between gravity and planets.'],
 ['@先生 は 2340 を @簡単 な @言葉 で @説明 @する~してくださいました~してくださいました','The teacher kindly explained gravity in simple words.'],
]);
lesson('concentration','Concentration and appearance',[2272,2003,1472], '濃度を測定します / 中性の液体 / 透明なコップ', '濃度 is the concentration of a substance in a mixture. 中性 means neutral in this chemistry context. 透明 describes something you can see through; it takes な before a noun. These words describe different properties of a liquid.', [
 ['1544 の 2272 を 1471 @する~します~します','We measure the concentration of the liquid.'],
 ['@この 1544 は 2272 が @高い です','This liquid has a high concentration.'],
 ['2272 の @違い を @図 で @説明 @する~しました~しました','We explained the difference in concentration with a diagram.'],
 ['@この 1544 は 2003 です','This liquid is neutral.'],
 ['2003 の 1544 を @実験 に @使う~使いました~つかいました','We used a neutral liquid in the experiment.'],
 ['2003 の @意味 を @科学 の @辞典 で @調べる~調べました~しらべました','I looked up the meaning of neutral in a science dictionary.'],
 ['1472 な @コップ に 1544 を @入れる~入れました~いれました','I put the liquid in a transparent cup.'],
 ['@この 1544 は 1472 です','This liquid is clear.'],
 ['1472 な @ガラス の @向こう に @先生 が @見える~見えます~みえます','I can see the teacher through the clear glass.'],
]);
lesson('lab-report','Comparing two investigations',[], 'What changed and how it was measured', 'Follow a comparison of investigations into magnetic force and liquids.', [
 ['@私たち は 1942 を @使う @実験 を @見る~見ました~みました','We watched an experiment using a magnet.'],
 ['867 の @研究 の ために 105 な @装置 を @使う~使いました~つかいました','We used powerful equipment for research into magnetism.'],
 ['@別 の @実験 で は 1472 な @コップ に 2003 の 1544 を @入れる~入れました~いれました','In another experiment, we put a neutral liquid in a transparent cup.'],
 ['1544 の 2272 を @変える~変えて~かえて @結果 を @比べる~比べました~くらべました','We changed the concentration of the liquid and compared the results.'],
 ['@最後 に @先生 と @実験 の @規則 を @確認 @する~しました~しました','Finally, we checked the general rules for experiments with the teacher.'],
 ['@帰る @前 に 1508 について @質問 @する~しました~しました','Before leaving, I asked a question about hydrogen.'],
]);
lesson('fractions','Fractions, decimals and percentages',[2578,2504,804], '分数で書きます / 小数で書きます / パーセントで書きます', '分数 is a fraction, such as 1/2. 小数 is a decimal, such as 0.5. パーセント expresses a proportion out of one hundred, so 50パーセント is half.', [
 ['@答え を 2578 で @書く~書いてください~かいてください','Please write your answer as a fraction.'],
 ['2578 の @計算 を @練習 @する~しています~しています','I am practicing calculations with fractions.'],
 ['@この 2578 の @意味 を @図 で @説明 @する~します~します','I will explain the meaning of this fraction with a diagram.'],
 ['@答え を 2504 で @書く~書きます~かきます','I write the answer as a decimal.'],
 ['2578 と 2504 の @関係 を @勉強 @する~しました~しました','We studied the relationship between fractions and decimals.'],
 ['@先生 は @紙 に 2504 を @書く~書きました~かきました','The teacher wrote a decimal on paper.'],
 ['@割合 を 804 で @書く~書いてください~かいてください','Please write the proportion as a percentage.'],
 ['@五 @十 804 は @半分 です','Fifty percent is half.'],
 ['@百 804 ではありません','It is not one hundred percent.'],
]);
lesson('even-rounding','Even numbers and rounding',[2335,2457], '偶数を選びます / 四捨五入します', '偶数 is an even number: 二, 四 and 六 are examples. 四捨五入 is rounding. With positive numbers, a discarded digit of 0–4 rounds down and 5–9 rounds up. Add する to use it as a verb.', [
 ['@二 と @四~四~よん は 2335 です','Two and four are even numbers.'],
 ['@六 も 2335 です','Six is an even number too.'],
 ['@この @中 から 2335 を @選ぶ~選んでください~えらんでください','Please choose an even number from these.'],
 ['@計算 の @最後 に 2457 @する~します~します','We round off at the end of the calculation.'],
 ['2457 の @方法 を @先生 に @聞く~聞きました~ききました','I asked the teacher how to round numbers.'],
 ['2457 @する @前 の @答え も @書く~書いてください~かいてください','Please also write the answer before rounding.'],
]);
lesson('numerical-report','Explaining numerical results',[], 'Write, compare and explain the results', 'Follow how a student records and checks numerical answers.', [
 ['@最初 に @答え を 2578 で @書く~書きました~かきました','First, I wrote the answer as a fraction.'],
 ['@次 に 2504 で も @書く~書きました~かきました','Next, I wrote it as a decimal too.'],
 ['@割合 は 804 で @書く~書きました~かきました','I wrote the proportion as a percentage.'],
 ['2457 @する @方法 を @もう一度 @確認 @する~しました~しました','I checked how to round numbers once more.'],
 ['@最後 に 2335 を @全部 @選ぶ~選びました~えらびました','Finally, I selected all the even numbers.'],
 ['@友達 に @計算 の @結果 を @説明 @する~しました~しました','I explained the results of the calculation to a friend.'],
]);
lesson('evolution','Evolution and environmental change',[2781,2884], '進化の歴史 / 状態が悪化します', '進化 is evolution, or the development of something over time. In biology it concerns changes across generations, not an individual growing up. 悪化 means a condition getting worse.', [
 ['@生物 の 2781 について @勉強 @する~しています~しています','We are learning about the evolution of living things.'],
 ['@この @本 は 2781 の @歴史 を @説明 @する~しています~しています','This book explains the history of evolution.'],
 ['2781 と @環境 の @関係 を @調べる~調べました~しらべました','We investigated the relationship between evolution and the environment.'],
 ['@川 の @水 の @状態 が 2884 @する~しました~しました','The condition of the river water worsened.'],
 ['2884 の @原因 を @調べる~調べています~しらべています','We are investigating the cause of the deterioration.'],
 ['2884 の @原因 を @なくす @方法 を @考える~考えます~かんがえます','We will consider how to eliminate the cause of the deterioration.'],
]);
lesson('science-exhibition','Explaining a science display',[], 'Connect a model, a measurement and an explanation', 'Follow a visitor asking how a display connects several scientific ideas.', [
 ['@最初 に @地球 の 2340 の @説明 を @読む~読みました~よみました','First, I read the explanation of Earth’s gravity.'],
 ['@次 に @車 の 1507 を @見る~見ました~みました','Next, I watched a car accelerate.'],
 ['2553 と @速度 の @違い が @わかる~わかりました~わかりました','I understood the difference between acceleration and speed.'],
 ['@別 の @部屋 で は @生物 の 2781 について @勉強 @する~しました~しました','In another room, I learned about the evolution of living things.'],
 ['@先生 が @環境 の 2884 について @説明 @する~してくださいました~してくださいました','The teacher kindly explained the deterioration of the environment.'],
 ['@最後 に @大切 な 2892 を @ノート に @書く~書きました~かきました','Finally, I wrote the important concepts in my notebook.'],
]);
}
