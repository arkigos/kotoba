export function authorHealthRoutines({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@起床':'getting up; rising from bed','B1@日課':'daily routine','B1@不規則':'irregular',
 'B1@適度':'moderate; appropriate in amount','B1@目安':'rough guide; approximate standard',
 'B1@カロリー':'calorie','B1@活力':'vitality; energy','B1@消耗':'using up; exhaustion',
 'B1@頭脳':'brain; intellect','B1@苦しむ':'to suffer','B1@重体':'critical condition',
 'B1@青白い':'pale; bluish-white','B1@効く':'to take effect; to work',
 'B1@寿命':'lifespan; useful life','B1@マスク':'face mask','B1@菌':'germ; bacterium; fungus',
 'B1@伝染':'transmission of infection; contagion','B1@嗅ぐ':'to sniff; to smell',
 'B1@匂う':'to give off a smell','B1@かく':'to scratch; to perspire',
 'B1@もむ':'to massage; to rub','B1@脇':'armpit; side','B1@股':'groin; crotch',
 'B1@裸':'naked; uncovered','B1@小便':'urine; pee; peeing',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('health');
lesson('getting-up-and-routines','Getting up and daily routines',['B1@起床','B1@日課','B1@不規則'],
 '起床します / 日課 / 不規則な','起床 is a formal word for getting out of bed, often used in schedules or records. 日課 is something done every day. 不規則 describes an irregular pattern.',[
 ['@毎朝 @六 時 に B1@起床 @する~します~します','I get up at six every morning.'],
 ['B1@起床 の @時間 を @ノート に @書く~書きました~かきました','I wrote my waking time in my notebook.'],
 ['@今日 は @いつも より @早い~早く~はやく B1@起床 @する~しました~しました','Today I got up earlier than usual.'],
 ['@朝 の @散歩 は @私 の B1@日課 です','A morning walk is part of my daily routine.'],
 ['@寝る @前 に @日記 を @書く の が B1@日課 です','Writing in my diary before bed is a daily habit.'],
 ['@新しい B1@日課 を @一つ @決める~決めました~きめました','I chose one new daily habit.'],
 ['@最近 @生活 が B1@不規則 に @なる~なりました~なりました','My daily schedule has become irregular recently.'],
 ['B1@不規則 な @仕事 の @時間 に @困る~困っています~こまっています','The irregular working hours are causing me difficulty.'],
 ['@この @記録 で は B1@睡眠 の @時間 が B1@不規則 です','In this record, the sleeping hours are irregular.'],
]);
lesson('moderation-and-rough-guides','Moderate amounts and rough guides',['B1@適度','B1@目安','B1@カロリー'],
 '適度な / 目安 / カロリー','適度 means an amount suited to the situation. 目安 is a rough guide, not an exact requirement. カロリー measures energy, including the energy in food.',[
 ['@この @運動 は @私 に は B1@適度 です','This amount of exercise is moderate for me.'],
 ['B1@適度 な @休み を @取る~取りました~とりました','I took a suitable amount of rest.'],
 ['B1@適度 な @運動 を @毎日 @続ける~続けています~つづけています','I keep up a moderate amount of exercise every day.'],
 ['@時間 の B1@目安 を @聞く~聞きました~ききました','I asked for a rough idea of how long it would take.'],
 ['@この @数字 は B1@目安 です','This number is a rough guide.'],
 ['@前 の @記録 を B1@目安 に @する~しました~しました','I used my earlier record as a guide.'],
 ['@食品 の B1@カロリー を @調べる~調べました~しらべました','I checked the calories in the food.'],
 ['@この @紙 に B1@カロリー が @書く~書かれています~かかれています','The calories are written on this paper.'],
 ['@二つ の @食事 の B1@カロリー を @比べる~比べました~くらべました','I compared the calories in two meals.'],
]);
lesson('energy-and-mental-work','Energy and mental work',['B1@活力','B1@消耗','B1@頭脳'],
 '活力 / 消耗します / 頭脳','活力 is energy or vitality. 消耗 is using something up, such as physical energy or a battery. 頭脳 often refers to thinking ability rather than the physical organ.',[
 ['@彼女 は B1@活力 が @ある~あります~あります','She has energy and vitality.'],
 ['@朝 の @散歩 は @私 の B1@活力 の @元 です','My morning walk is a source of energy for me.'],
 ['@休む~休んだ~やすんだ @後 は B1@活力 が @戻る~戻りました~もどりました','My energy returned after I rested.'],
 ['@長い @試合 で B1@体力 を B1@消耗 @する~しました~しました','I used up my physical energy in the long match.'],
 ['@電池 の B1@消耗 が @早い です','The battery runs down quickly.'],
 ['B1@体力 の B1@消耗 について @選手 に @聞く~聞きました~ききました','I asked the athlete about the drain on their physical energy.'],
 ['B1@頭脳 を @使う @仕事 が @好き です','I like work that uses my brain.'],
 ['@彼 の B1@頭脳 は @優秀 です','He has an excellent mind.'],
 ['@この @ゲーム は B1@頭脳 を @使う~使います~つかいます','This game requires mental effort.'],
]);
lesson('recording-a-week-account','Keeping a record for a week',[],
 '起床 / 日課 / 不規則 / 目安','Follow the changes the writer notices in a week of records.',[
 ['@私 は @今週 @生活 の @記録 を @つける~つけました~つけました','This week, I kept a record of my daily life.'],
 ['@毎日 B1@起床 の @時間 を @書く~書きました~かきました','I wrote down my waking time every day.'],
 ['@仕事 が @忙しい~忙しかった~いそがしかった @日 は @食事 の @時間 が B1@不規則 でした','On the days when work was busy, my mealtimes were irregular.'],
 ['@朝 の @散歩 は @毎日 @続ける~続けました~つづけました','I continued my morning walk every day.'],
 ['@この B1@日課 は @私 の B1@活力 の @元 です','This daily habit is a source of energy for me.'],
 ['@来週 の @予定 を @考える @時~とき~とき に @この @記録 を B1@目安 に @する~します~します','I will use this record as a guide when planning next week.'],
]);
lesson('describing-serious-illness','Describing physical condition',['B1@苦しむ','B1@重体','B1@青白い'],
 '苦しみます / 重体 / 青白い','苦しむ describes suffering. 重体 means a critical condition, not an ordinary illness. 青白い can describe a pale face or a bluish-white color.',[
 ['@彼 は @長い @間 @病気 に B1@苦しむ~苦しんでいました~くるしんでいました','He suffered from an illness for a long time.'],
 ['@痛み で B1@苦しむ~苦しんでいる~くるしんでいる @人 が @いる~います~います','Someone is suffering from pain.'],
 ['@その @選手 は @怪我 に B1@苦しむ~苦しんでいます~くるしんでいます','The athlete is struggling with an injury.'],
 ['@事故 の @後 @彼 は B1@重体 でした','He was in critical condition after the accident.'],
 ['B1@重体 の @患者 が @病院 に @運ぶ~運ばれました~はこばれました','A patient in critical condition was taken to the hospital.'],
 ['@医者 は @患者 が B1@重体 だ と @説明 @する~しました~しました','The doctor explained that the patient was in critical condition.'],
 ['@彼女 の @顔 は B1@青白い~青白かった~あおじろかった です','Her face was pale.'],
 ['@窓 から B1@青白い @光 が @入る~入ってきました~はいってきました','Bluish-white light came in through the window.'],
 ['@絵 の @人物 は B1@青白い @顔 を @する~しています~しています','The person in the picture has a pale face.'],
]);
lesson('effects-and-lifespans','Taking effect and lasting',['B1@効く','B1@寿命'],
 '効きます / 寿命','効く describes something working or taking effect. 寿命 is a lifespan; it also describes the useful life of an object.',[
 ['@薬 が B1@効く~効いて~きいて @痛み が @弱い~弱く~よわく @なる~なりました~なりました','The medicine took effect and the pain decreased.'],
 ['@昨日 の @薬 は @私 に は B1@効く~効きませんでした~ききませんでした','Yesterday’s medicine did not work for me.'],
 ['@冷房 が B1@効く~効いています~きいています','The air conditioning is working.'],
 ['@この @動物 の B1@寿命 を @調べる~調べました~しらべました','I looked up the lifespan of this animal.'],
 ['@二つ の @電池 の B1@寿命 を @比べる~比べました~くらべました','I compared the useful lives of two batteries.'],
 ['@本 で @人 の B1@寿命 について @読む~読みました~よみました','I read about the human lifespan in a book.'],
]);
lesson('masks-and-infection','Masks, germs and infection',['B1@マスク','B1@菌','B1@伝染'],
 'マスク / 菌 / 伝染します','マスク here is a face mask. 菌 can refer to bacteria or fungi; the context tells you which. 伝染 describes an infection passing between living things.',[
 ['@病院 の @入り口 で B1@マスク を @つける~つけました~つけました','I put on a mask at the hospital entrance.'],
 ['@新しい B1@マスク を @かばん に @入れる~入れました~いれました','I put a new mask in my bag.'],
 ['@彼女 は @白い B1@マスク を @する~しています~しています','She is wearing a white mask.'],
 ['@この @本 は B1@菌 について @説明 @する~しています~しています','This book explains bacteria and fungi.'],
 ['@研究 で B1@菌 の @種類 を @調べる~調べました~しらべました','In the study, we examined the types of bacteria.'],
 ['@食品 に @使う~使われる~つかわれる B1@菌 について @読む~読みました~よみました','I read about microorganisms used in food.'],
 ['@病気 が B1@伝染 @する~した~した @原因 を @調べる~調べました~しらべました','We investigated why the illness spread.'],
 ['@授業 で @病気 の B1@伝染 について @勉強 @する~しました~しました','We studied the transmission of illness in class.'],
 ['@この @病気 は @人 から @人 に B1@伝染 @する~します~します','This illness spreads from person to person.'],
]);
lesson('reporting-at-a-clinic-account','Explaining a visit to a clinic',[],
 'マスク / 苦しむ / 効く','Follow the patient’s account of their symptoms and the visit.',[
 ['@昨日 @私 は @腹 の @痛み で B1@苦しむ~苦しんでいました~くるしんでいました','Yesterday I was suffering from abdominal pain.'],
 ['B1@マスク を @つける~つけて~つけて @病院 に @入る~入りました~はいりました','I put on a mask and entered the hospital.'],
 ['@医者 に @痛み が @始まる~始まった~はじまった @時間 を @伝える~伝えました~つたえました','I told the doctor when the pain had started.'],
 ['@医者 は @私 の @話 を @聞く~聞いて~きいて @診察 @する~しました~しました','The doctor listened to me and examined me.'],
 ['@後 で @薬 が B1@効く~効いて~きいて @痛み が @弱い~弱く~よわく @なる~なりました~なりました','Later, the medicine took effect and the pain decreased.'],
 ['@今日 は @仕事 を @休む~休んで~やすんで @家 に @いる~います~います','Today I have taken the day off work and am at home.'],
]);
lesson('smelling-and-scents','Smelling and giving off a scent',['B1@嗅ぐ','B1@匂う'],
 '匂いを嗅ぎます / 花が匂います','嗅ぐ is actively smelling or sniffing something. 匂う describes the source giving off a smell; this can be pleasant or unpleasant.',[
 ['@花 の @匂い を B1@嗅ぐ~嗅ぎました~かぎました','I smelled the flower.'],
 ['@犬 が @かばん の @匂い を B1@嗅ぐ~嗅いでいます~かいでいます','The dog is sniffing the bag.'],
 ['@コーヒー の @匂い を B1@嗅ぐ の が @好き です','I like smelling coffee.'],
 ['@庭 の @花 が B1@匂う~匂います~においます','The flowers in the garden give off a scent.'],
 ['@この @靴 は @少し B1@匂う~匂います~においます','These shoes smell a little.'],
 ['@雨 の @後 は @土 が @強い~強く~つよく B1@匂う~匂います~においます','After rain, the soil has a strong smell.'],
]);
lesson('scratching-and-massaging','Scratching, sweating and massaging',['B1@かく','B1@もむ'],
 '肌をかきます / 汗をかきます / 肩をもみます','かく means scratching in 肌をかく and sweating in 汗をかく. もむ means massaging or rubbing with the hands in these examples.',[
 ['@彼 は @腕 を B1@かく~かいています~かいています','He is scratching his arm.'],
 ['B1@かゆい @首 を @少し B1@かく~かきました~かきました','I scratched my itchy neck a little.'],
 ['@走る~走って~はしって @汗 を B1@かく~かきました~かきました','I ran and worked up a sweat.'],
 ['@自分 の @肩 を B1@もむ~もみました~もみました','I massaged my own shoulder.'],
 ['@母 は @手 を B1@もむ~もんでいました~もんでいました','My mother was rubbing her hands.'],
 ['@彼 は @足 を @軽い~軽く~かるく B1@もむ~もんでいます~もんでいます','He is gently massaging his feet.'],
]);
lesson('body-areas-and-private-words','Body areas and plain expressions',['B1@脇','B1@股','B1@裸','B1@小便'],
 '脇 / 股 / 裸 / 小便','脇 can mean the armpit or the side of something. 股 names the groin or crotch. 裸 means naked or uncovered. 小便 is a blunt everyday word for urine or peeing; it is not a polite way to ask for the toilet.',[
 ['@右 の B1@脇 が @痛い です','My right armpit hurts.'],
 ['B1@脇 に @本 を @持つ~持っています~もっています','I am holding a book under my arm.'],
 ['@道 の B1@脇 に @自転車 を @置く~置きました~おきました','I put the bicycle at the side of the road.'],
 ['B1@股 の @近く が @痛い です','It hurts near my groin.'],
 ['@医者 に B1@股 の @痛み を @伝える~伝えました~つたえました','I told the doctor about the pain in my groin.'],
 ['@ズボン の B1@股 に @穴 が A1@開く~開きました~あきました','A hole opened in the crotch of my trousers.'],
 ['@お風呂 に @入る @前 に B1@裸 に @なる~なりました~なりました','I undressed before getting into the bath.'],
 ['@絵 の @人物 は B1@裸 です','The person in the picture is naked.'],
 ['B1@裸 で @外 に @出る~出ないで~でないで ください','Please do not go outside naked.'],
 ['@犬 が @外 で B1@小便 を @する~しました~しました','The dog peed outside.'],
 ['B1@小便 の @色 について @医者 に @聞く~聞きました~ききました','I asked the doctor about the color of my urine.'],
 ['@この @言葉 は B1@小便 を @意味 @する~します~します','This word means pee.'],
]);
lesson('after-a-hot-day-account','After a hot day',[],
 '汗をかく / 匂う / 裸 / もむ','Follow the return home after a day outside.',[
 ['@暑い @日 に @外 を @歩く~歩いて~あるいて @汗 を B1@かく~かきました~かきました','I walked outside on a hot day and sweated.'],
 ['@家 に @帰る~帰った~かえった @時~とき~とき @服 が @少し B1@匂う~匂いました~においました','When I got home, my clothes smelled a little.'],
 ['@お風呂 の @前 に @服 を @脱ぐ~脱いで~ぬいで B1@裸 に @なる~なりました~なりました','Before my bath, I took off my clothes.'],
 ['@お風呂 の @後 で @足 を @軽い~軽く~かるく B1@もむ~もみました~もみました','After the bath, I gently massaged my feet.'],
 ['@その @夜 は @早い~早く~はやく @寝る~寝ました~ねました','I went to bed early that night.'],
]);
}
