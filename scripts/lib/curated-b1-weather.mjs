export function authorWeather({topic,lesson:authorLesson,forms,course}) {
forms['によると']=['によると','according to (an information source)'];
const glosses={358:'thunder; lightning',155:'intense; heavy; violent',677:'mild; warm (climate)',2482:'be chilled to the bone',2142:'become rough or stormy'};
const lesson=(...args)=>authorLesson(...args,glosses);
topic('weather','Forecasts and changing weather','Report a forecast, describe changing conditions, and explain how the weather affects a plan.');
lesson('forecast','Passing on a forecast',[115,446,759], 'Nによると、plain clause + そうです', 'によると names an information source. Put a complete plain clause before そうです to report what you heard or read: 降るそうです means they say it will rain. A noun or な-adjective takes だ: 雨だそうです. Compare 降りそうです, which means it looks likely to rain from what you can see. 気温 is air temperature; 天候 is a more formal word for weather.', [
 ['@明日 の 446 を @確認 @する~します~します','I check tomorrow’s forecast.'],
 ['446 によると @明日 は @雨 が @降る そうです','According to the forecast, it will rain tomorrow.'],
 ['446 によると @明日 は @雨 だ そうです','According to the forecast, tomorrow will be rainy.'],
 ['@今日 は 115 が @高い です','The air temperature is high today.'],
 ['@夜 に 115 が @下がる~下がります~さがります','The air temperature drops at night.'],
 ['759 によって @予定 を @変える~変えます~かえます','I change the plan depending on the weather.'],
 ['@山 の 759 は @変わる~変わります~かわります','The weather in the mountains changes.'],
]);
lesson('climate','Climate and seasons',[577,629,677], 'Nの気候 / 温暖なN', '気候 describes the usual climate of a region, rather than today’s weather. 四季 refers to the four seasons. 温暖 is a な-adjective used for a mild or warm climate. Use familiar comparisons to describe a place over the year.', [
 ['@この @地方 の 577 は 677 です','This region has a mild climate.'],
 ['@二つ の @国 の 577 を @比べる~比べます~くらべます','I compare the climates of the two countries.'],
 ['@日本 の 629 について 84~学びます~まなびます','I learn about Japan’s four seasons.'],
 ['629 の @変化 を @写真 で @見る~見ます~みます','I look at the changes through the four seasons in photographs.'],
 ['677 な @地方 で 472~暮らしたい~くらしたい です','I would like to live in a region with a mild climate.'],
 ['@冬 も 677 です が @雨 が @多い です','It is mild even in winter, but it rains a lot.'],
]);
lesson('rain','During the rainy season',[817,2481], '梅雨に入ります / Nを着ます', '梅雨 is the early-summer rainy season in much of Japan. 梅雨に入る means the rainy season begins. A レインコート is a raincoat: use 着る, as with other coats. Climate and dates vary by region.', [
 ['@この @地方 は 817 に @入る~入りました~はいりました','The rainy season has begun in this region.'],
 ['817 は 764 が @高い です','Humidity is high during the rainy season.'],
 ['@雨 が @降る~降っている~ふっている ので 2481 を @着る~着ます~きます','I put on a raincoat because it is raining.'],
 ['2481 を @着る~着て~きて @犬 と @散歩 @する~しました~しました','I put on a raincoat and took a walk with my dog.'],
 ['446 によると @明日 も @雨 が @降る そうです','According to the forecast, it will rain tomorrow too.'],
]);
lesson('sunlight','Sunshine and shade',[2182,659,2052,2162], '快晴です / 日陰で休みます', '快晴 means clear skies. 日光 is sunlight; 日差し describes the sun’s rays, often their strength. 日陰 is a place sheltered from direct sunlight. Choose the word that matches whether you mean the weather, the light or a place to rest.', [
 ['@今日 は 2182 です','The sky is clear today.'],
 ['2182 の @日 に @山 に @行く~行きました~いきました','I went to the mountains on a clear day.'],
 ['659 が @部屋 に @入る~入ります~はいります','Sunlight enters the room.'],
 ['@植物 に は 659 が @必要 です','Plants need sunlight.'],
 ['@午後 は 2052 が @強い です','The sun is strong in the afternoon.'],
 ['@窓 から 2052 が @入る~入ってきます~はいってきます','Sunlight comes in through the window.'],
 ['2162 で @休む~休みましょう~やすみましょう','Let’s rest in the shade.'],
 ['2162 は @涼しい です','It is cool in the shade.'],
]);
lesson('visibility','Fog and thunderstorms',[616,358,155], '霧で見えません / 激しいN', '霧 is fog. 雷 can refer to thunder and lightning: 雷が鳴る describes the sound of thunder. 激しい describes great intensity, such as heavy rain or a violent storm. Explain what you can see or hear and why you are changing your plans.', [
 ['616 で @山 が @見える~見えません~みえません','I cannot see the mountain because of the fog.'],
 ['@今朝 は 616 が @出る~出ていました~でていました','There was fog this morning.'],
 ['358 が @鳴る~鳴っています~なっています','Thunder is rumbling.'],
 ['358 の @音 を @聞く~聞きました~ききました','I heard the sound of thunder.'],
 ['155 @雨 が @降る~降っています~ふっています','Heavy rain is falling.'],
 ['@雨 が 155 ので @家 に @帰る~帰りました~かえりました','I went home because the rain was heavy.'],
]);
authorLesson('strong-descriptions','Strong descriptions in forecasts',[], '非常に + description', '非常に means very or extremely. It strengthens the description that follows, as in 非常に強い風. This is a different use from 非常 meaning an emergency. You will hear it in forecasts and formal reports; とても is a familiar everyday alternative. Here we practice the complete adverb 非常に, not the emergency noun.', [
 ['@風 が A2:764~非常に~ひじょうに @強い です','The wind is extremely strong.'],
 ['A2:764~非常に~ひじょうに 155 @雨 が @降る~降っています~ふっています','Extremely heavy rain is falling.'],
 ['@今日 の 115 は A2:764~非常に~ひじょうに @低い です','The air temperature is extremely low today.'],
 ['@この @道 は A2:764~非常に~ひじょうに @危険 です','This road is extremely dangerous.'],
],{'A2:764':'extremely; very (the intensifier 非常に)'});
course.lessons.at(-1).notes[0].title='A different meaning';
lesson('snow','Snow and severe cold',[1905,1150,2482], '雪が積もります / 凍えそうです', '吹雪 is a snowstorm or blizzard. 積もる describes snow or other material accumulating. 凍える describes a person becoming extremely cold; 凍えそうです means I feel as if I am freezing. This uses the stem + そう appearance pattern, unlike a reported forecast with a full clause + そうです.', [
 ['1905 で @電車 が @止まる~止まりました~とまりました','The train stopped because of the blizzard.'],
 ['446 によると @今夜 は 1905 だ そうです','According to the forecast, there will be a blizzard tonight.'],
 ['@道 に @雪 が 1150~積もっています~つもっています','Snow has accumulated on the road.'],
 ['@夜 の @間 に @雪 が 1150~積もりました~つもりました','Snow accumulated during the night.'],
 ['@手 が 2482~凍えそう~こごえそう です','My hands feel as if they are freezing.'],
 ['@外 で @長い @間 @待つ~待って~まって 2482~凍えました~こごえました','I was chilled to the bone after waiting outside for a long time.'],
]);
lesson('ice','Freezing and melting',[129,1075,967], '水が凍ります / 氷が溶けます', '凍る means a liquid freezes; it differs from 凍える, being painfully cold. 溶ける means something melts or dissolves. Here ice is the subject of melting, so use 氷が溶ける. Reuse と for a predictable result.', [
 ['@池 の @水 が 1075~凍りました~こおりました','The water in the pond froze.'],
 ['@道 が 1075~凍っている~こおっている ので @注意 @する~してください~してください','Please be careful because the road is frozen.'],
 ['129 を @コップ に @入れる~入れます~いれます','I put ice in the glass.'],
 ['129 の @上 を @歩く~歩かないでください~あるかないでください','Please do not walk on the ice.'],
 ['189 が @上がる と 129 が 967~溶けます~とけます','When the temperature rises, the ice melts.'],
 ['@春 に @雪 が 967~溶けます~とけます','The snow melts in spring.'],
]);
lesson('sea','Calm and rough seas',[2142,481], '海が荒れています / 穏やかなN', '荒れる describes rough or stormy conditions. 穏やか is a な-adjective meaning calm or gentle. Use known reasons and contrasts to explain whether conditions suit an outing.', [
 ['@台風 で @海 が 2142~荒れています~あれています','The sea is rough because of the typhoon.'],
 ['@海 が 2142~荒れている~あれている ので @船 は @出る~出ません~でません','The boat will not leave because the sea is rough.'],
 ['@今日 の @海 は 481 です','The sea is calm today.'],
 ['481 な @日 に @海 に @行く~行きたい~いきたい です','I would like to go to the sea on a calm day.'],
 ['446 によると @明日 の 115 は @高い そうです','According to the forecast, the air temperature will be high tomorrow.'],
 ['759 を @確認 @する~して~して @予定 を @決める~決めます~きめます','I check the weather and decide on a plan.'],
]);
lesson('plans','A change of plan',[], 'A forecast, a reason and a new arrangement', 'These sentences form one short account. First explain the plan, then report the forecast and explain the change. そうです passes on the forecast; ので gives the reason; ことになりました states the new arrangement.', [
 ['@明日 は @友達 と @山 に @行く @予定 です','Tomorrow I plan to go to the mountains with my friend.'],
 ['446 によると @明日 は 155 @雨 が @降る そうです','According to the forecast, there will be heavy rain tomorrow.'],
 ['@山 の 759 が @悪い ので @予定 を @変える~変えました~かえました','I changed the plan because the weather in the mountains is bad.'],
 ['@友達 に @電話 @する~して~して @来週 @行く ことになりました','I called my friend, and we arranged to go next week.'],
 ['@行く @前 に 446 を @確認 @する~します~します','I will check the forecast before we go.'],
]);
}
