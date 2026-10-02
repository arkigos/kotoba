export function authorBodyDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 613:'to cross (arms or legs); to join together',972:'to stand up; to rise to one’s feet',1408:'movement; action of the body',1529:'sumo wrestling',
 996:'to lower; to put down',2450:'to carry on one’s shoulder',2455:'to twist; to turn; to twist a body part',2358:'to shorten; to draw in; to reduce',
 1108:'to hurt; to injure',2401:'to go numb; to tingle',2532:'hiccup; hiccups',
 2633:'to get tired; to grow weary',758:'still; without moving; intently',2637:'to endure; to hold back',1668:'daytime nap',1672:'refreshed; clear; relieved',
 916:'to wake up (with 目が)',1073:'to wake up (with 目を)',1994:'alarm clock',
 2842:'nursing; care of a sick person',2901:'caregiving; assistance with everyday living',2816:'burden; load; cost borne',1806:'to interact with; to treat someone; to come into contact with',2559:'to visit someone who is ill or in difficulty',
 1639:'carelessness; letting one’s guard down',2359:'to neglect; to fail to do',742:'to sustain (an injury); to bear',2829:'impact; shock',1855:'rough; violent; rough treatment',221:'to handle; to treat',2760:'handling; treatment',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('sports');
lesson('watching-movements','Watching and copying movements',[613,972,1408,1529], '腕を組みます / 立ち上がります / 動作 / 相撲', '組む can describe crossing your arms or legs. 立ち上がる is rising to your feet. 動作 names a movement or action of the body; it can also describe a machine’s operation in other contexts. 相撲 is sumo wrestling.', [
 ['@腕 を 613~組んで~くんで @話 を @聞く~聞きました~ききました','I listened with my arms crossed.'],
 ['@椅子 に @座る~座って~すわって @足 を 613~組みました~くみました','I sat on the chair and crossed my legs.'],
 ['@友達 と @腕 を 613~組んで~くんで @歩く~歩きました~あるきました','I walked arm in arm with my friend.'],
 ['@名前 を @呼ぶ~呼ばれて~よばれて 972~立ち上がりました~たちあがりました','I stood up when my name was called.'],
 ['@椅子 から @ゆっくり 972~立ち上がりました~たちあがりました','I rose slowly from the chair.'],
 ['@選手 が 972~立ち上がる~たちあがる の を @見る~見ました~みました','We watched the athlete get to their feet.'],
 ['511 の 1408 を @よく @見る~見ました~みました','I watched the coach’s movements carefully.'],
 ['@同じ 1408 を @もう一度 @練習 @する~しました~しました','I practiced the same movement again.'],
 ['@体 の 1408 を @写真 に @撮る~撮りました~とりました','I photographed the body movements.'],
 ['@祖父 は @テレビ で 1529 を @見る~見ます~みます','My grandfather watches sumo on television.'],
 ['@初めて 1529 を @近く で @見る~見ました~みました','I watched sumo up close for the first time.'],
 ['1529 の @選手 の 1408 を @写真 で @見る~見ました~みました','I looked at the movements of a sumo wrestler in photographs.'],
]);
lesson('carrying-and-changing-position','Carrying and changing position',[2450,996,2455,2358], '担ぎます / 下ろします / ひねります / 縮めます', '担ぐ is carrying something on your shoulder. 下ろす brings something down or puts it down. ひねる is twisting or turning; with a body part it can also describe an injury. 縮める makes something shorter or smaller, including drawing your legs in or reducing a gap.', [
 ['@大きい @袋 を @肩 に 2450~担ぎました~かつぎました','I carried a large bag on my shoulder.'],
 ['@荷物 を 2450~担いで~かついで @坂 を @上る~上りました~のぼりました','I carried the load on my shoulder up the slope.'],
 ['@父 は @小さな @子供 を @肩 に 2450~担いで~かついで @歩く~歩きました~あるきました','The father walked carrying his small child on his shoulder.'],
 ['@荷物 を @床 に 996~下ろしました~おろしました','I put the load down on the floor.'],
 ['@上げる~上げた~あげた @手 を @ゆっくり 996~下ろしました~おろしました','I slowly lowered my raised hand.'],
 ['@肩 から @袋 を 996~下ろして~おろして @休む~休みました~やすみました','I took the bag off my shoulder and rested.'],
 ['@体 を @少し 2455~ひねりました~ひねりました','I twisted my body a little.'],
 ['@走る~走っている~はしっている @時 に @足 を 2455~ひねりました~ひねりました','I twisted my foot while running.'],
 ['@首 を 2455~ひねって~ひねって @後ろ を @見る~見ました~みました','I turned my head to look behind me.'],
 ['@足 を 2358~縮めて~ちぢめて @狭い @場所 に @座る~座りました~すわりました','I drew my legs in and sat in the narrow space.'],
 ['@前 の @選手 と の @差 を 2358~縮めました~ちぢめました','I narrowed the gap with the athlete ahead.'],
 ['@説明 の @時間 を 2358~縮めて~ちぢめて @練習 を @始める~始めました~はじめました','We shortened the explanation and began practicing.'],
]);
lesson('watching-practice-account','Watching a practice session',[], 'Movements and practice', 'Follow someone watching an athlete, then trying the movements under a coach’s direction.', [
 ['511 と @一緒 に @選手 の 1408 を @見る~見ました~みました','I watched the athlete’s movements with the coach.'],
 ['@選手 は @椅子 から 972~立ち上がって~たちあがって @腕 を @上げる~上げました~あげました','The athlete stood up from the chair and raised their arms.'],
 ['@私 も @同じ 1408 を @ゆっくり @練習 @する~しました~しました','I also practiced the same movement slowly.'],
 ['@上げる~上げた~あげた @腕 を 996~下ろして~おろして @少し @休む~休みました~やすみました','I lowered my raised arms and rested for a moment.'],
 ['@練習 の @後 で 511 に @質問 @する~しました~しました','After practice, I asked the coach a question.'],
]);
useTopic('health');
lesson('describing-discomfort','Describing discomfort',[1108,2401,2532], '痛めました / しびれます / しゃっくり', '痛める describes hurting or injuring a body part; 痛い describes how it feels. しびれる is going numb or tingling. しゃっくり means hiccups. These words describe what someone experiences without identifying its cause.', [
 ['@練習 で @肩 を 1108~痛めました~いためました','I hurt my shoulder during practice.'],
 ['@右 の 216 を 1108~痛めて~いためて @試合 を @休む~休みました~やすみました','I injured my right knee and missed the match.'],
 ['1108~痛めた~いためた @腕 を @医師 に @見せる~見せました~みせました','I showed the doctor the arm I had hurt.'],
 ['@足 が 2401~しびれています~しびれています','My foot feels numb.'],
 ['@昨日 から @指 が 2401~しびれます~しびれます','My fingers have been tingling since yesterday.'],
 ['@手 が 2401~しびれる~しびれる こと を @看護師 に @伝える~伝えました~つたえました','I told the nurse that my hand felt numb.'],
 ['2532 が @出る~出ました~でました','I got the hiccups.'],
 ['2532 が @まだ @止まる~止まりません~とまりません','My hiccups still have not stopped.'],
 ['@電話 で @話す~話している~はなしている @時 に 2532 が @出る~出ました~でました','I got the hiccups while talking on the phone.'],
]);
lesson('rest-and-relief','Rest and relief',[2633,758,2637,1668,1672], 'くたびれます / じっと / こらえます / 昼寝 / すっきり', 'くたびれる is getting tired or weary. じっと means staying still or paying close attention. こらえる is enduring something or holding back a reaction. 昼寝 is a daytime nap, and すっきり can describe feeling refreshed or clear-headed.', [
 ['@長い @道 を @歩く~歩いて~あるいて 2633~くたびれました~くたびれました','I got tired from walking a long way.'],
 ['@今日 は @本当に 2633~くたびれました~くたびれました','I am really worn out today.'],
 ['@長い @時間 @待つ~待って~まって 2633~くたびれました~くたびれました','I got tired from waiting a long time.'],
 ['@椅子 に 758 @座る~座っていました~すわっていました','I sat still in the chair.'],
 ['@子供 は @私 の @顔 を 758 @見る~見ていました~みていました','The child was staring at my face.'],
 ['@検査 の @間 は 758 @する~していました~していました','I kept still during the examination.'],
 ['@痛み を 2637~こらえて~こらえて @医師 に @話す~話しました~はなしました','I spoke to the doctor while enduring the pain.'],
 ['@泣く~泣きたい~なきたい の を 2637~こらえました~こらえました','I held back the urge to cry.'],
 ['@笑う~笑いたい~わらいたい の を 2637~こらえる~こらえる の は @難しい~難しかった~むずかしかった です','It was hard to hold back my laughter.'],
 ['@昼ご飯 の @後 で 1668 を @する~しました~しました','I took a nap after lunch.'],
 ['@子供 は @今 1668 を @する~しています~しています','The child is having a nap now.'],
 ['@休日 に @短い 1668 を @楽しむ~楽しみました~たのしみました','I enjoyed a short nap on my day off.'],
 ['@よく @寝る~寝て~ねて @頭 が 1672 @する~しました~しました','After sleeping well, my head felt clear.'],
 ['@朝 、 @顔 を @洗う~洗ったら~あらったら 1672 @する~しました~しました','I felt refreshed after washing my face in the morning.'],
 ['@友達 に @不安 を @話す~話して~はなして @気持ち が 1672 @する~しました~しました','I felt relieved after telling a friend about my anxieties.'],
]);
lesson('waking-and-alarms','Waking and alarms',[916,1073,1994], '目が覚めます / 目を覚まします / 目覚まし', 'Use 目が覚める or 目を覚ます for waking up. The particle and verb go together: が with 覚める, を with 覚ます. 目覚まし is an alarm clock.', [
 ['@今朝 は @早い~早く~はやく @目 が 916~覚めました~さめました','I woke up early this morning.'],
 ['@夜 、 @目 が 916~覚めて~さめて @時計 を @見る~見ました~みました','I woke in the night and looked at the clock.'],
 ['@大きい @音 で @目 が 916~覚めました~さめました','A loud noise woke me up.'],
 ['@赤ちゃん が @目 を 1073~覚ましました~さましました','The baby woke up.'],
 ['1668 から @目 を 1073~覚まして~さまして @水 を @飲む~飲みました~のみました','I woke from my nap and drank some water.'],
 ['@母 が @目 を 1073~覚ます~さます @前 に @家 を @出る~出ました~でました','I left home before my mother woke up.'],
 ['1994 を @六 時 に 504~合わせました~あわせました','I set the alarm clock for six.'],
 ['1994 が @鳴る~鳴って~なって @目 が 916~覚めました~さめました','The alarm clock rang and I woke up.'],
 ['@旅行 に @小さい 1994 を @持つ~持って~もって @行く~行きます~いきます','I will take a small alarm clock on the trip.'],
]);
lesson('care-and-visits','Care and visits',[2842,2901,2816,1806,2559], '看護 / 介護 / 負担 / 接します / 見舞います', '看護 centers on caring for someone who is ill. 介護 often concerns help with everyday living. 負担 is a burden or a cost someone bears. 人に接する describes how you interact with someone. 見舞う is visiting someone who is ill or in difficulty; the person takes を.', [
 ['@病院 で 2842 の @仕事 を @する~しています~しています','I work in nursing at a hospital.'],
 ['@病気 の @母 を 2842 @する~しました~しました','I nursed my mother when she was ill.'],
 ['2842 について @学校 で @勉強 @する~しています~しています','I am studying nursing at school.'],
 ['@父 の 2901 を @家族 で @する~しています~しています','Our family shares the care of my father.'],
 ['2901 に @詳しい @人 に @質問 @する~しました~しました','I asked someone knowledgeable about caregiving a question.'],
 ['2901 の @仕事 に @興味 が @ある~あります~あります','I am interested in care work.'],
 ['@家族 の 2816 を @少ない~少なく~すくなく @する~したい~したい です','I want to reduce the burden on my family.'],
 ['2901 の 2816 について @相談 @する~しました~しました','I asked for advice about the burden of caregiving.'],
 ['@病院 に @払う @お金 を @私 が 2816 @する~しました~しました','I covered the hospital costs.'],
 ['@患者 に @優しい~優しく~やさしく 1806~接する~せっする @看護師 です','This nurse treats patients kindly.'],
 ['@子供 に @丁寧 に 1806~接しました~せっしました','I treated the child with care and respect.'],
 ['@毎日 @違う @人 に 1806~接する~せっする @仕事 です','It is a job where I interact with different people every day.'],
 ['@病院 に @いる @友達 を 2559~見舞いました~みまいました','I visited my friend in hospital.'],
 ['@祖母 を 2559~見舞う~みまう @ため に @病院 に @行く~行きました~いきました','I went to the hospital to visit my grandmother.'],
 ['@友人 を 2559~見舞って~みまって から @家 に @帰る~帰りました~かえりました','I went home after visiting my sick friend.'],
]);
lesson('a-restful-day-account','A day of rest',[], 'Waking, resting and feeling better', 'Follow someone spending a quiet day at home after a tiring week.', [
 ['@今週 は @仕事 で 2633~くたびれました~くたびれました','Work has worn me out this week.'],
 ['@休日 の @朝 は 1994 を @使う~使いませんでした~つかいませんでした','I did not use an alarm clock on my day off.'],
 ['@目 が 916~覚めた~さめた @後 も @少し @布団 の @中 に @いる~いました~いました','I stayed in bed for a little while after waking up.'],
 ['@昼ご飯 の @後 で @短い 1668 を @する~しました~しました','After lunch, I took a short nap.'],
 ['@目 を 1073~覚まして~さまして @頭 が 1672 @する~しました~しました','I woke up and felt clear-headed.'],
 ['@夕方 は @窓 の @近く に 758 @座る~座って~すわって @本 を @読む~読みました~よみました','In the evening, I sat quietly near the window and read a book.'],
]);
useTopic('safety');
lesson('attention-and-neglect','Attention and neglect',[1639,2359], '油断します / 確認を怠ります', '油断 is letting your attention or guard slip. 怠る means neglecting something you should do; を marks the task or responsibility left undone.', [
 ['@慣れる~慣れた~なれた @道 で 1639 @する~して~して 1091~転びました~ころびました','I let my guard down on a familiar road and fell.'],
 ['@試合 の @最後 まで 1639 @する~しませんでした~しませんでした','I did not let my guard down until the match was over.'],
 ['@少し の 1639 で @事故 が @起きる~起きました~おきました','A moment of carelessness led to an accident.'],
 ['@安全 の @確認 を 2359~怠りました~おこたりました','I neglected to check safety.'],
 ['@毎日 の @練習 を 2359~怠って~おこたって @技術 が @落ちる~落ちました~おちました','My skills declined after I neglected daily practice.'],
 ['@道具 の @確認 を 2359~怠らない~おこたらない ように @する~しています~しています','I make sure not to neglect checking the tools.'],
]);
lesson('impacts-and-injuries','Impacts and injuries',[2829,742], '衝撃 / 傷を負います', '衝撃 can be a physical impact or a psychological shock. 負う has several senses; here 傷を負う and 怪我を負う mean sustaining an injury.', [
 ['957~ぶつかった~ぶつかった @時 の 2829 は @大きい~大きかった~おおきかった です','The impact of the collision was strong.'],
 ['1091~転んだ~ころんだ @時 に @腕 に 2829 を @感じる~感じました~かんじました','I felt an impact in my arm when I fell.'],
 ['@その @ニュース に 2829 を @受ける~受けました~うけました','The news came as a shock.'],
 ['@事故 で @大きな @傷 を 742~負いました~おいました','I sustained a serious wound in the accident.'],
 ['@足 に @怪我 を 742~負った~おった @人 が @病院 に @来る~来ました~きました','Someone with an injured foot came to the hospital.'],
 ['@重い @怪我 を 742~負って~おって @病院 で @治療 を @受ける~受けました~うけました','I received treatment in hospital after sustaining a serious injury.'],
]);
lesson('handling-with-care','Handling with care',[221,2760,1855], '丁寧に扱います / 道具の扱い / 乱暴に', '扱う is handling an object or dealing with a person or matter. 扱い is the noun. 乱暴 describes rough or violent behavior. These examples contrast careful and rough handling.', [
 ['@壊れる~壊れやすい~こわれやすい @物 を @丁寧 に 221~扱います~あつかいます','I handle fragile objects carefully.'],
 ['@この @機械 を 221~扱う~あつかう @前 に @説明 を @読む~読みました~よみました','I read the instructions before operating this machine.'],
 ['@大切 な @道具 を 1855 に 221~扱わないで~あつかわないで ください','Please do not handle the important tools roughly.'],
 ['@新しい @道具 の 2760 を @習う~習いました~ならいました','I learned how to handle the new tools.'],
 ['@この @機械 の 2760 に は @注意 が @必要 です','Care is needed when handling this machine.'],
 ['@荷物 の 2760 が @丁寧 でした','The luggage was handled carefully.'],
 ['@弟 が @ドア を 1855 に @閉める~閉めました~しめました','My younger brother shut the door roughly.'],
 ['1855 な @運転 は @危険 です','Reckless driving is dangerous.'],
]);
lesson('learning-from-a-fall-account','Learning from a fall',[], 'An accident and a later check', 'Follow a person describing a fall, getting care and reviewing what happened.', [
 ['@道具 を @運ぶ~運んでいる~はこんでいる @時 に 1639 @する~して~して @足 を @滑る~滑らせました~すべらせました','I let my guard down while carrying tools and lost my footing.'],
 ['@床 に 957~ぶつかった~ぶつかった 2829 で @腕 が @痛い~痛く~いたく @なる~なりました~なりました','My arm began to hurt from the impact of hitting the floor.'],
 ['@腕 に @傷 を 742~負った~おった から @医師 に @見せる~見せました~みせました','I showed my arm to a doctor because I had wounded it.'],
 ['@後 で @安全 の @確認 を 2359~怠った~おこたった こと を @家族 に @話す~話しました~はなしました','Afterward, I told my family that I had neglected the safety check.'],
 ['@次 の @作業 の @前 に @道具 の 2760 を @もう一度 @確認 @する~しました~しました','Before the next task, I checked how to handle the tools again.'],
]);
}
