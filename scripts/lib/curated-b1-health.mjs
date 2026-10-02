export function authorHealth({topic,lesson,forms,course}) {
forms['ほうがいいです']=['ほうがいいです','it would be better to; recommendation after a past plain verb'];
topic('health','Health, rest and care','Explain symptoms, discuss an examination, and talk about rest and caring for someone.');
lesson('symptoms','Explaining how you feel',[164,98,431,535], '症状を説明します / Nがつらいです', '症状 names the symptoms of an illness. つらい describes something hard to bear, physically or emotionally. 苦しい can describe difficulty breathing or other distress; 苦痛 is the noun pain or suffering. Give the particular symptom as well as a general description.', [
 ['164 を @医師 に @説明~説明します~せつめいします','I explain my symptoms to the doctor.'],
 ['164 は @昨日 と @同じ です','The symptoms are the same as yesterday.'],
 ['@咳 が 98 です','The cough is hard to bear.'],
 ['@昨日 の @夜 は 98~つらかった~つらかった です','Last night was difficult.'],
 ['1246 が 431 です','I am having difficulty breathing.'],
 ['431 @時 は @看護師 を @呼ぶ~呼びます~よびます','I call the nurse when I feel distressed.'],
 ['535 を @言葉 に @する~します~します','I put the pain into words.'],
 ['@患者 の 535 について @話す~話しました~はなしました','We talked about the patient’s suffering.'],
]);
lesson('clinic','At the clinic',[882,1453,1174,1320], 'Nで診てもらいます / 診断を聞きます', '医院 is a doctor’s clinic. 外科 is the surgical specialty or department; it does not mean the operation itself. 診る is examine medically, distinct in spelling and purpose from 見る. 診てもらう describes receiving that examination. 診断 is a diagnosis.', [
 ['@近く の 882 を @探す~探しています~さがしています','I am looking for a nearby clinic.'],
 ['882 に @電話 を @かける~かけました~かけました','I called the clinic.'],
 ['1453 で @傷 を 1174~診てもらいました~みてもらいました','I had my wound examined in the surgical department.'],
 ['1453 の @医師 に @相談~相談しました~そうだんしました','I consulted a doctor in the surgical department.'],
 ['@医師 が @患者 を 1174~診ます~みます','The doctor examines the patient.'],
 ['1320 の @説明 を @聞く~聞きました~ききました','I listened to the explanation of the diagnosis.'],
 ['1320 の @結果 を @家族 に @伝える~伝えました~つたえました','I told my family the diagnostic result.'],
]);
lesson('body','Describing the body',[76,109,340,674,1112,1477], 'Nの働き / 全身が…', '全身 means the whole body. 心臓 is the heart, 胃 the stomach as an organ, and 肺 the lungs. 血管 are blood vessels. 皮膚 is skin as a body tissue; 肌 is common for the skin’s feel or appearance. の connects an organ to its function or examination.', [
 ['76 が @痛い です','My whole body hurts.'],
 ['@運動 の @後 で 76 に @汗 が @出る~出ました~でました','I sweated all over after exercising.'],
 ['109 の @働き を @勉強 @する~しています~しています','I am studying how the heart works.'],
 ['109 の @検査 を @受ける~受けました~うけました','I had a heart examination.'],
 ['340 が @痛い です','My stomach hurts.'],
 ['340 の @検査 は @明日 です','The stomach examination is tomorrow.'],
 ['674 の @写真 を @見せる~見せてもらいました~みせてもらいました','I was shown an image of my lungs.'],
 ['674 の @病気 について @説明 を @聞く~聞きました~ききました','I heard an explanation about the lung disease.'],
 ['1112 に @血液 が 236~流れています~ながれています','Blood flows through blood vessels.'],
 ['1112 の @働き を @調べる~調べます~しらべます','I study how blood vessels work.'],
 ['1477 に @傷 が @ある~あります~あります','There is a wound on the skin.'],
 ['1477 を @医師 に @見せる~見せました~みせました','I showed the skin to the doctor.'],
]);
lesson('knees-and-elbows','Knees and elbows',[216,1772], '右の膝 / 左の肘 / Nに傷があります', '膝 is the knee and 肘 the elbow. Add 右の or 左の to say which side you mean. In 膝に傷があります, に marks where the wound is.', [
 ['@右 の 216 が @痛い です','My right knee hurts.'],
 ['216 に @手 を @置く~置いてください~おいてください','Please put your hands on your knees.'],
 ['@昨日 216 を @怪我 @する~しました~しました','I injured my knee yesterday.'],
 ['216 を @医師 に @見せる~見せました~みせました','I showed my knee to the doctor.'],
 ['1772 に @小さな @傷 が @ある~あります~あります','There is a small wound on my elbow.'],
 ['@左 の 1772 が @痛い です','My left elbow hurts.'],
 ['1772 を @少し 392~動かしました~うごかしました','I moved my elbow a little.'],
 ['@昨日 より 1772 が @痛い~痛くない~いたくない です','My elbow hurts less than yesterday.'],
],{216:'knee',1772:'elbow',392:'move (something)'});
course.lessons.at(-1).notes[0].title='Naming the place that hurts';
lesson('wrists-and-bending','Wrists and bending a joint',[1703,2235], '手首 / Nを曲げます', '手首 means wrist; 首 on its own means neck. 曲げる means bend something and takes を for the body part or object you bend. 曲げると痛いです describes pain when bending it.', [
 ['1703 が @痛い です','My wrist hurts.'],
 ['@右 の 1703 に @時計 を @する~しています~しています','I am wearing a watch on my right wrist.'],
 ['1703 を @医師 に 1174~診てもらいました~みてもらいました','I had a doctor examine my wrist.'],
 ['1703 の @怪我 で @仕事 を @休む~休みました~やすみました','I took time off work because of a wrist injury.'],
 ['216 を @ゆっくり 2235~曲げてください~まげてください','Please bend your knees slowly.'],
 ['1772 を 2235~曲げる~まげる と @痛い です','It hurts when I bend my elbow.'],
 ['@腕 を 2235~曲げて~まげて @写真 を @撮る~撮ってもらいました~とってもらいました','I bent my arm and had my photo taken.'],
 ['@痛い ので 1703 を 2235~曲げません~まげません','I do not bend my wrist because it hurts.'],
],{1703:'wrist',2235:'bend (something)','@休む':'take time off (here)'});
course.lessons.at(-1).notes[0].title='A body part and its movement';
lesson('tongue-and-cheeks','Tongue and cheeks',[230,1211], '舌 / 頬', '舌 means tongue and is read した, just like 下, below. The situation and the written character distinguish them. 頬 means cheek and is read ほお in these examples. 舌の先 is the tip of the tongue.', [
 ['230 を @出す~出してください~だしてください','Please stick out your tongue.'],
 ['230 の @先 が @痛い です','The tip of my tongue hurts.'],
 ['@鏡 で 230 を @見る~見ました~みました','I looked at my tongue in the mirror.'],
 ['230 を @少し 392~動かしてください~うごかしてください','Please move your tongue a little.'],
 ['@子供 の 1211 が @赤い です','The child’s cheeks are red.'],
 ['@冷たい @手 で 1211 に @触る~触りました~さわりました','I touched my cheek with a cold hand.'],
 ['1211 に @小さな @傷 が @ある~あります~あります','There is a small wound on my cheek.'],
 ['1211 に @涙 が 236~流れました~ながれました','Tears ran down my cheeks.'],
],{230:'tongue',1211:'cheek (of the face)',392:'move (something)'});
course.lessons.at(-1).notes[0].title='Reading 舌 and 頬';
lesson('nails','Fingernails and toenails',[1419], '手の爪 / 足の爪 / 爪を短く切ります', '爪 can mean a fingernail or a toenail. 手の爪 and 足の爪 specify which. In 爪を短く切ります, 短く describes the result: the nails are short after cutting.', [
 ['@手 の 1419 を @短い~短く~みじかく @切る~切りました~きりました','I cut my fingernails short.'],
 ['1419 の @間 に @土 が @ある~あります~あります','There is dirt under my nails.'],
 ['1419 の @色 を @看護師 に @見せる~見せました~みせました','I showed the color of my nails to the nurse.'],
 ['@足 の 1419 を @切る~切って~きって から @手 を @洗う~洗いました~あらいました','I washed my hands after cutting my toenails.'],
],{1419:'fingernail; toenail','@土':'soil; dirt'});
course.lessons.at(-1).notes[0].title='Which nails?';
lesson('measurements','Temperature and blood pressure',[750,1767], '体温 を 調べます / 血圧 が 高い です', '体温 is body temperature; 血圧 is blood pressure. 調べます (shirabemasu) means check here. 高い describes a high reading without specifying the number or its cause.', [
 ['750 を 973~測ります~はかります','I take my temperature.'],
 ['750 を @紙 に @書く~書きました~かきました','I wrote my temperature on the paper.'],
 ['@看護師 が 1767 を 973~測ります~はかります','The nurse measures my blood pressure.'],
 ['@今日 は 1767 が @高い です','My blood pressure is high today.'],
]);
lesson('prevention','Prevention and hygiene',[386,2774,1796,1801,1535], '感染の予防 / Nを消毒します', '予防 is preventing illness or another unwanted event. 感染 is infection. 消毒 is disinfection, and 薬品 can mean medicines or chemical preparations; context matters. 保健 concerns maintaining health. It differs from 保険, insurance.', [
 ['@病気 の 386 について 84~学びます~まなびます','I learn about preventing illness.'],
 ['2774 の 386 は @大切 です','Preventing infection is important.'],
 ['2774 の @原因 を @調べる~調べています~しらべています','They are investigating the cause of the infection.'],
 ['@医師 に 2774 について @質問~質問しました~しつもんしました','I asked the doctor about the infection.'],
 ['1796 の @方法 を @看護師 に @聞く~聞きました~ききました','I asked the nurse about the disinfection method.'],
 ['@看護師 が @手 を 1796 @する~しています~しています','The nurse is disinfecting their hands.'],
 ['1801 の @名前 を @確認~確認します~かくにんします','I check the name of the preparation.'],
 ['@この 1801 は 1796 に @使う~使います~つかいます','This preparation is used for disinfection.'],
 ['@学校 で 1535 を 84~学びます~まなびます','We study health at school.'],
 ['1535 の @本 で 386 について @読む~読みました~よみました','I read about prevention in a health book.'],
]);
lesson('nutrition','Food and nutrition',[297,1785,177], '栄養を吸収します / Nが含まれています', '栄養 means nutrition or nourishment. ビタミン are vitamins. 吸収する means absorb, including the body absorbing nutrients. 食物 supplies nourishment; 消化 is digestion, a related but different process.', [
 ['@食事 の 297 について @勉強 @する~しています~しています','I am studying the nutritional value of meals.'],
 ['297 が @足りる~足りません~たりません','There is not enough nourishment.'],
 ['@この @野菜 に は 1785 が @含む~含まれています~ふくまれています','This vegetable contains vitamins.'],
 ['1785 の @働き を @調べる~調べます~しらべます','I study what vitamins do.'],
 ['@体 は 297 を 177 @する~します~します','The body absorbs nutrients.'],
 ['177 と 1456 の @違い を 84~学びます~まなびます','I learn the difference between absorption and digestion.'],
]);
lesson('sleep','Sleep and daytime tiredness',[118,926,945,2534], '睡眠の時間 / Nで居眠りをします', '睡眠 is sleep as a state or activity. ぐっすり describes sleeping soundly. 居眠り is dozing off, often while seated. 朝寝坊 is oversleeping or sleeping late in the morning. It differs from going to bed late.', [
 ['118 の @時間 が @短い です','I do not sleep for long.'],
 ['118 は @体 に @大切 です','Sleep is important for the body.'],
 ['@昨日 は 926 @眠る~眠りました~ねむりました','I slept soundly yesterday.'],
 ['926 @寝る~寝て~ねて @元気 に @なる~なりました~なりました','I slept well and felt better.'],
 ['@電車 で 945 を @する~しました~しました','I dozed off on the train.'],
 ['@電車 で 945 を @する~して~して @降りる @駅 を @間違える~間違えました~まちがえました','I dozed off on the train and got off at the wrong station.'],
 ['@今日 は 2534 を @する~しました~しました','I overslept this morning.'],
 ['2534 @する~して~して @学校 に @遅れる~遅れました~おくれました','I overslept and was late for school.'],
]);
lesson('rest','Rest and recovery',[934,1972,1843,2342,156], 'Vたほうがいいです / Nを取ります', 'Use the plain past form followed by ほうがいいです to recommend an action. The action need not be in the past: 休息を取ったほうがいいです means it would be better to take a rest. 休息 is a break from effort, while 休養 often emphasizes recovery. 一休み is a short break; 心身 is mind and body; ストレス is stress.', [
 ['934 を @取る~取った~とった ほうがいいです','It would be better to take a rest.'],
 ['@仕事 の @後 で 934 を @取る~取ります~とります','I rest after work.'],
 ['1972 の ために @家 に @いる~います~います','I am staying home to recuperate.'],
 ['@医師 と 1972 について @話す~話しました~はなしました','I talked with the doctor about rest and recovery.'],
 ['1843 の @健康 を @大切 に @する~しています~しています','I take care of my physical and mental health.'],
 ['1843 の @疲れ を @感じる~感じます~かんじます','I feel mentally and physically tired.'],
 ['@ここ で 2342 @する~しましょう~しましょう','Let’s take a short break here.'],
 ['2342 の @後 で @また @歩く~歩きます~あるきます','After a short break, I walk again.'],
 ['@仕事 の 156 について @相談~相談しました~そうだんしました','I discussed the stress from my work.'],
 ['156 で 118 の @時間 が @短い です','Stress is making me sleep less.'],
 ['@少し @休む~休んだ~やすんだ ほうがいいです','It would be better to rest a little.'],
]);
lesson('care','Visiting and caring for someone',[756,2155,2844,2195,680], 'Nの見舞い / Nを看病します', '見舞い is a visit to someone who is ill or has suffered misfortune, often with お. 看病 is caring for someone who is ill. 妊娠 is pregnancy and 輸血 a blood transfusion. 克服する means overcome a difficulty or illness. 友達の見舞いに行く means go to visit a sick friend; に marks the purpose of going. With 看病する, を marks the person cared for.', [
 ['@友達 の 756 に @行く~行きました~いきました','I went to visit my sick friend.'],
 ['756 の @時間 を @病院 に @聞く~聞きました~ききました','I asked the hospital about visiting hours.'],
 ['@家 で @母 を 2155 @する~しました~しました','I cared for my sick mother at home.'],
 ['@家族 で 2155 を @する~しています~しています','The family is caring for the sick person together.'],
 ['2844 の @検査 を @受ける~受けました~うけました','I had a pregnancy test.'],
 ['2844 について @医師 に @相談~相談しました~そうだんしました','I consulted the doctor about pregnancy.'],
 ['2195 の @前 に @説明 を @聞く~聞きました~ききました','I listened to an explanation before the blood transfusion.'],
 ['2195 が @必要 かどうか @医師 に @聞く~聞きました~ききました','I asked the doctor whether a blood transfusion was needed.'],
 ['@病気 を 680 @する~して~して @仕事 に @戻る~戻りました~もどりました','I overcame the illness and returned to work.'],
 ['@困難 を 680 @する~した~した @人 の @話 を @聞く~聞きました~ききました','I listened to someone who had overcome difficulties.'],
]);

lesson('polite-visit','Visiting someone who is ill',[], '見舞い / お見舞い', 'お見舞い is the common polite form of 見舞い. Here it means a visit to someone who is ill, not an ordinary social visit. Use 人のお見舞いに行きます for going to visit that person. Learn お見舞い as a whole expression. The sentence about a friend coming uses the familiar てくれました to show the visit was welcome.', [
 ['@友達 の 756~お見舞い~おみまい に @行く~行きました~いきました','I went to visit my sick friend.'],
 ['756~お見舞い~おみまい の @前 に @病院 に @電話 @する~しました~しました','I called the hospital before visiting the sick person.'],
 ['756~お見舞い~おみまい の @時間 を @看護師 に @聞く~聞きました~ききました','I asked the nurse about visiting hours.'],
 ['@友達 が 756~お見舞い~おみまい に @来る~来てくれました~きてくれました','My friend came to visit me when I was ill.'],
],{756:'visit to someone who is ill (here)'});
course.lessons.at(-1).notes[0].title='Words you will hear';
lesson('bandages','Talking about a bandage',[2121], 'Nをしています / Nを変えます', '包帯 is a bandage. 腕に包帯をしています describes having a bandage on your arm; に marks the body part. 変える means change; 看護師が包帯を変えました tells who changed the bandage.', [
 ['@腕 に 2121 を @する~しています~しています','I have a bandage on my arm.'],
 ['@看護師 が 2121 を @変える~変えました~かえました','The nurse changed the bandage.'],
 ['@新しい 2121 を @買う~買いました~かいました','I bought a new bandage.'],
 ['2121 を @看護師 に @見せる~見せました~みせました','I showed the bandage to the nurse.'],
]);
lesson('sneezing','Describing sneezing',[2087], 'くしゃみが出ます / くしゃみをします', 'くしゃみ means a sneeze or sneezing. Both くしゃみが出ます and くしゃみをします describe sneezing. 止まりません says that it will not stop; it does not name a cause. Use the words to describe what you experience.', [
 ['2087 が @出る~出ます~でます','I sneeze.'],
 ['@朝 から 2087 が @止まる~止まりません~とまりません','I have not been able to stop sneezing since this morning.'],
 ['@大きな 2087 を @する~しました~しました','I gave a big sneeze.'],
 ['2087 を @する~した~した @後 で @手 を @洗う~洗います~あらいます','I wash my hands after sneezing.'],
],{'@止まる':'to stop; cease (here)'});
lesson('recovering-account','An injury and a visit',[], 'A short account of care and recovery', 'Follow one speaker from an injury to a medical visit and rest at home. Past forms tell what happened; ています describes the situation now. Familiar てくれました highlights help the speaker received.', [
 ['@昨日 @料理 中 に @手 を @怪我 @する~しました~しました','Yesterday I injured my hand while cooking.'],
 ['@病院 で @医師 に 1174~診てもらいました~みてもらいました','I had a doctor examine me at the hospital.'],
 ['@看護師 が 2121 を @変える~変えてくれました~かえてくれました','The nurse changed my bandage for me.'],
 ['@今日 は @家 で @休む~休んでいます~やすんでいます','Today I am resting at home.'],
 ['@昨日 より @痛い~痛くない~いたくない です','It hurts less than yesterday.'],
 ['@夕方 @友達 が 756~お見舞い~おみまい に @来る~来てくれました~きてくれました','In the evening, my friend came to visit me while I was recovering.'],
],{756:'visit to someone who is ill or injured (here)','@休む':'to rest (here)'});
lesson('symptoms-account','Explaining symptoms and arranging a visit',[], 'A connected account using earlier health words', 'The speaker describes a symptom, checks their temperature, and contacts the clinic. Explain the sequence with familiar past and present forms.', [
 ['@朝 から 2087 が @続く~続いています~つづいています','I have been sneezing since this morning.'],
 ['750 を 973~測りました~はかりました','I took my temperature.'],
 ['@今 は @熱 が @ある~ありません~ありません','I do not have a fever now.'],
 ['882 に @電話 で @相談 @する~しました~しました','I consulted the clinic by phone.'],
 ['@医師 に 164 を @説明~説明しました~せつめいしました','I explained my symptoms to the doctor.'],
 ['@明日 @もう一度 1174~診てもらいます~みてもらいます','I will have another medical examination tomorrow.'],
]);
}
