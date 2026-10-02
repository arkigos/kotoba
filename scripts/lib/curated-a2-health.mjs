export function authorHealth({topic,lesson,lines,forms}) {
forms['ために']=['ために','for the sake of; for the purpose of'];
topic('care','Health and medical care','Explain symptoms, understand a medical visit, and describe changes in your health.');
lesson('symptoms','Explaining symptoms',[21,46,47,57,58,389,340], 'Nがあります / Nがします / Nはどうですか', 'Use 熱があります for a fever and 咳が出ます for a cough. 頭痛がします and 腹痛があります describe a headache and stomachache. 気分 is how you feel; 具合 is your condition.', [
 ['21 が @悪い です','I feel unwell.'],['21 は @どう です か','How are you feeling?'],
 ['46 が @ある~あります~あります','I have a fever.'],['46 は @ある~ありません~ありません','I do not have a fever.'],
 ['47 が @出る~出ます~でます','I have a cough.'],['47 は @出る~出ません~でません','I do not have a cough.'],['47 が 340 です','My cough is bad.'],
 ['57 が @する~します~します','I have a headache.'],['@今日 は 57 が 340 です','My headache is bad today.'],
 ['58 が @ある~あります~あります','I have a stomachache.'],['58 は @ある~ありません~ありません','I do not have a stomachache.'],
 ['389 は @どう です か','How are you doing?'],['@今日 は 389 が @悪い です','I am feeling unwell today.'],
]);
lesson('body','Describing the body',[323,328,339,381,424,895,1165], 'Nが痛いです / Nは大丈夫ですか', 'Use が痛いです to identify where it hurts. 背中 is the back of the body; 肩 is the shoulder and 腕 is the arm. English usually says “my”; Japanese can omit the owner when it is obvious.',
 lines([[323,'neck'],[328,'finger'],[339,'arm'],[381,'back'],[424,'throat'],[895,'chest'],[1165,'shoulder']], [['$ が @痛い です','My $ hurts.'],['$ は @大丈夫 です か','Is your $ okay?']]));
lesson('injuries','Explaining an injury',[49,1218,1098,48,842], 'Vました / Nがあります', '怪我をしました reports an injury. 傷 is a wound or injury mark, while 痛み names pain itself. 吐きました means vomited. 疲れ is the noun “fatigue”; it differs from the verb 疲れる.', [
 ['@足 に 49 を @する~しました~しました','I injured my foot.'],['49 は @大丈夫 です か','Is your injury okay?'],
 ['@手 に 1218 が @ある~あります~あります','I have a wound on my hand.'],['@この 1218 が @痛い です','This wound hurts.'],
 ['1098 が @ある~あります~あります','I have pain.'],['1098 は @少し です','The pain is mild.'],
 ['@昨日 48~吐きました~はきました','I vomited yesterday.'],['@今日 は 48~吐いていません~はいていません','I have not vomited today.'],
 ['842 が @ある~あります~あります','I feel fatigued.'],['@今日 は 842 が 340 です','I am very fatigued today.'],
]);
lesson('appointments','At the clinic',[45,59,60,61,1076,316], 'Nを受けます / 人に聞きます', '受けます means receive or undergo: 診察を受けます and 検査を受けます describe seeing a doctor and having a test. 医師 is a formal word for doctor. に marks the person you ask.', [
 ['45 に @聞く~聞きます~ききます','I ask the nurse.'],['45 を @呼ぶ~呼んでください~よんでください','Please call the nurse.'],
 ['59 が @ある~あります~あります','I have insurance.'],['59 の @カード です','This is my insurance card.'],
 ['60 を 316~受けます~うけます','I will see the doctor for an examination.'],['@明日 60 を 316~受けます~うけます','I will have a medical examination tomorrow.'],
 ['61 を 316~受けました~うけました','I had a medical test.'],['@明日 61 が @ある~あります~あります','I have a medical test tomorrow.'],
 ['1076 に @聞く~聞きます~ききます','I ask the doctor.'],['1076 は @どこ に @いる~います~います か','Where is the doctor?'],
]);
lesson('departments','Finding the right department',[53,54,55,56,965], 'Nで診察を受けます / Nの患者', 'These department names identify eye care, internal medicine, dermatology and dentistry. Use で for where the examination happens. 患者 means a patient; it is a noun, not a verb meaning to be patient.', [
 ...lines([[53,'ophthalmology'],[54,'internal medicine'],[55,'dermatology'],[56,'dentistry']], [['$ で 60 を 316~受けます~うけます','I will have an examination in $.'],['$ は @どこ です か','Where is $?']]),
 ['965 は @待つ~待っています~まっています','The patient is waiting.'],['965 は @部屋 に @いる~います~います','The patient is in the room.'],
]);
lesson('treatment','Talking about treatment',[482,881,1103,865,1224], 'Nを受けます / Nの説明', '治療 is treatment; 注射 is an injection and 手術 is surgery. 医療 is the broader field of medical care. がん means cancer.', [
 ['482 を 316~受けました~うけました','I had an injection.'],['482 は @明日 です','The injection is tomorrow.'],['881 を 316~受けました~うけました','I received treatment.'],['881 は @明日 です','The treatment is tomorrow.'],['1103 を 316~受けました~うけました','I had surgery.'],['1103 は @明日 です','The surgery is tomorrow.'],
 ['865 の @仕事 を @する~しています~しています','I work in medical care.'],['@この @町 の 865 は @大切 です','Medical care in this town is important.'],
 ['1224 の 881 を 316~受けています~うけています','I am receiving treatment for cancer.'],['1224 の @薬 です','This is cancer medication.'],
]);
lesson('recovery','Recovering and resting',[486,974,853,503], 'Vてきました / Nのために', '治りました means recovered or healed. 回復してきました describes recovery developing up to now. 健康 means health; 健康のために means “for the sake of my health”. 眠る means sleep and emphasizes being asleep.', [
 ['@風邪 が 486~治りました~なおりました','I have recovered from my cold.'],['49 は @まだ 486~治っていません~なおっていません','My injury has not healed yet.'],
 ['@少し 974~回復してきました~かいふくしてきました','I have started to recover a little.'],['974 は @ゆっくり です','Recovery is slow.'],
 ['853 は @大切 です','Health is important.'],['853 の ために @毎日 @歩く~歩きます~あるきます','I walk every day for my health.'],
 ['@昨日 は @よく 503~眠りました~ねむりました','I slept well yesterday.'],['@赤ちゃん は 503~眠っています~ねむっています','The baby is sleeping.'],
]);
lesson('measurements','Height and weight',[1132,1150,524,554,305,342,1074], 'Nを書いてください / Vました', '身長 and 体重 mean height and body weight. 痩せました and 太りました report losing or gaining weight. 髪 is head hair, 毛 is hair or fur more generally, and 肌 is skin.', [
 ['1132 を @書く~書いてください~かいてください','Please write down your height.'],['@子供 は 1132 が @高い です','My child is tall.'],
 ['1150 を @書く~書いてください~かいてください','Please write down your weight.'],['1150 は @同じ です','My weight is the same.'],
 ['@少し 524~痩せました~やせました','I lost a little weight.'],['@去年 524~痩せました~やせました','I lost weight last year.'],
 ['@少し 554~太りました~ふとりました','I gained a little weight.'],['@去年 554~太りました~ふとりました','I gained weight last year.'],
 ['305 は @長い です','My hair is long.'],['305 を @洗う~洗います~あらいます','I wash my hair.'],
 ['@猫 の 342 は @白い です','The cat has white fur.'],['@犬 の 342 は @短い です','The dog has short fur.'],
 ['1074 が @痛い です','My skin hurts.'],['1074 を @見せる~見せてください~みせてください','Please show me your skin.'],
]);
lesson('inside-body','Inside the body',[334,1209,1143,1236,841,1131,1139], 'Nの検査 / Nの病気', '血 and 血液 both mean blood; 血液 is common in medical descriptions. 骨, 筋肉, 脳 and 神経 name bones, muscles, the brain and nerves. 汗 means sweat. Use の to link a body system to a test.', [
 ['334 が @出る~出ています~でています','It is bleeding.'],['@この 1218 から 334 が @出る~出ています~でています','This wound is bleeding.'],
 ['1209 の 61 を 316~受けます~うけます','I will have a blood test.'],['1209 の 61 は @明日 です','The blood test is tomorrow.'],
 ['1143 の @写真 を @見る~見ます~みます','I look at an image of the bones.'],['1143 の 61 を 316~受けます~うけます','I will have a test to examine my bones.'],
 ['1236 を @使う~使います~つかいます','I use my muscles.'],['@足 の 1236 が @痛い です','The muscles in my legs hurt.'],
 ['841 の 1185 を @勉強 @する~しています~しています','I am studying how the brain works.'],['841 の @病気 の 881 を 316~受けています~うけています','I am receiving treatment for a disease affecting the brain.'],
 ['1131 の @病気 です','It is a disease affecting the nerves.'],['@手 の 1131 の 61 を 316~受けます~うけます','I will have a test to examine the nerves in my hand.'],
 ['1139 が @出る~出ています~でています','I am sweating.'],['1139 が @たくさん @出る~出ます~でます','I sweat a lot.'],
]);
lesson('casual-body','Everyday body expressions',[984,1020,982,578], 'Nが痛い / Vてしまいました', '腹 is a casual word for the abdomen; お腹 is more neutral in a medical conversation. 尻 means buttocks. 我慢する means put up with something. 寝坊してしまいました expresses regret about oversleeping; しまいました can add a sense of an unfortunate completed action.', [
 ['984 が @痛い です','My buttocks hurt.'],['984 に 1218 が @ある~あります~あります','I have a wound on my buttocks.'],
 ['1020 が @痛い です','My stomach hurts.'],['1020 に 1218 が @ある~あります~あります','I have a wound on my abdomen.'],
 ['1098 を 982~我慢していました~がまんしていました','I was putting up with the pain.'],['@少し 982~我慢しました~がまんしました','I put up with it for a little while.'],
 ['@今日 は 578~寝坊してしまいました~ねぼうしてしまいました','I overslept today, unfortunately.'],['@昨日 も 578~寝坊しました~ねぼうしました','I overslept yesterday too.'],
]);
}
