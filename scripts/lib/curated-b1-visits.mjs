export function authorVisits({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{37:'meeting or picking someone up',2501:'meet and welcome someone arriving',2607:'Hello? Is anyone home? (calling at an entrance)',2642:'please do not go to any trouble',354:'celebration; a congratulatory gift'});
topic('visits','Meeting, visiting and celebrating','Arrange a visit, welcome someone, and take part in a gathering or celebration.');
lesson('meeting','Meeting people and visiting',[448,596,99], '人に出会います / 人と握手します', '出会う describes meeting someone, often for the first time or by chance. 握手 is a handshake; と marks the other person. 訪問 is a visit, and 訪問する is more formal than everyday 訪ねる. It does not mean a telephone call here.', [
 ['@旅行 で @今 の 244 に 448~出会いました~であいました','I met the person who is now my close friend while traveling.'],
 ['@駅 で @昔 の @友達 に 448~出会いました~であいました','I ran into an old friend at the station.'],
 ['@初めて @会う~会った~あった @人 と 596 @する~しました~しました','I shook hands with someone I had just met.'],
 ['596 の @後 で 976 に @名前 を @教える~教えました~おしえました','We told each other our names after the handshake.'],
 ['@先生 の @家 を 99 @する~しました~しました','I visited my teacher’s home.'],
 ['99 の @時間 を @電話 で @確認 @する~しました~しました','I confirmed the time of the visit by phone.'],
]);
authorLesson('chance-meetings','Recent events and chance encounters',[137,238,296], '先日のN / 偶然 / たまたま', '先日 refers to a recent past day without specifying its date. 偶然 names a coincidence and can also describe a chance event. たまたま means by chance or happened to; it describes something that was not planned.', [
 ['137 @駅 で @先生 に @会う~会いました~あいました','I met my teacher at the station the other day.'],
 ['137 @話す~話した~はなした @友達 が @今日 @家 に @来る~来ます~きます','The friend I spoke to the other day is coming to my house today.'],
 ['137 の @旅行 は @楽しい~楽しかった~たのしかった です','The trip the other day was fun.'],
 ['137 の @話 を @もう一度 @聞く~聞きたい~ききたい です','I would like to hear that story from the other day again.'],
 ['238 @友達 と @同じ @電車 に @乗る~乗りました~のりました','By chance, I took the same train as my friend.'],
 ['@駅 で 238 @先生 に @会う~会いました~あいました','I ran into my teacher at the station by chance.'],
 ['@これ は 238 です','This is a coincidence.'],
 ['@私たち は 238 @同じ @本 を @選ぶ~選びました~えらびました','By coincidence, we chose the same book.'],
 ['296 @その @日 は @家 に @いる~いました~いました','I happened to be at home that day.'],
 ['296 @駅 の @近く で @先生 を @見る~見ました~みました','I happened to see my teacher near the station.'],
 ['@電話 を @かける~かけた~かけた @時 296 @友達 が @家 に @いる~いました~いました','When I called, my friend happened to be at home.'],
 ['296 @近く に @来る~来た~きた ので @友達 の @家 を @訪ねる~訪ねました~たずねました','I happened to be nearby, so I visited my friend’s home.'],
],{137:'the other day; a recent past day',238:'coincidence; by chance',296:'by chance; happen to','@かける':'make a phone call (with 電話を)'});
course.lessons.at(-1).notes[0].title='When a meeting was not planned';
authorLesson('out-or-home','Going out and looking after the house',[270,2041], '外出します / 留守番をします', '外出する means to go out. 外出中 means someone is out at the moment. 留守番する means staying to look after the home while other people are away; it does not mean simply being at home.', [
 ['@明日 は @朝 から 270 @する~します~します','I will be out from the morning tomorrow.'],
 ['270 @する @前 に @家族 に @帰る @時間 を @伝える~伝えます~つたえます','Before going out, I tell my family what time I will return.'],
 ['@母 は @今 270 中 です','My mother is out at the moment.'],
 ['@雨 な ので @今日 は 270 @する~しません~しません','It is raining, so I will not go out today.'],
 ['@今日 は @私 が 2041 を @する~します~します','Today I will stay home and look after the house.'],
 ['@弟 は @一人 で 2041 を @する~しています~しています','My younger brother is looking after the house on his own.'],
 ['2041 を @する~している~している @間 に @電話 が @ある~ありました~ありました','A phone call came while I was looking after the house.'],
 ['@家族 が @帰る まで 2041 を @する~しました~しました','I looked after the house until my family returned.'],
],{270:'going out; being away from home',2041:'staying home to look after the house while others are away'});
course.lessons.at(-1).notes[0].title='Being out and staying behind';
lesson('respectful-home','Visiting someone else’s home',[3007], 'お宅に伺います', 'お宅 respectfully names someone else’s home: 先生のお宅 is your teacher’s home; お宅 on its own can mean the home of the person you are speaking to. Use 家 or うち for your own home. Recall 伺います for your own visit and いただきます for receiving food or drink from your host. Here お宅 names a home, not a general replacement for “you.”', [
 ['3007 は @駅 から @近い です か','Is your home near the station?'],
 ['@先生 の 3007 に A2:611~伺いました~うかがいました','I visited my teacher’s home.'],
 ['@明日 3007 に A2:611~伺います~うかがいます','I will visit your home tomorrow.'],
 ['@先生 の 3007 で @お茶 を A2:1257~いただきました~いただきました','I had tea at my teacher’s home.'],
]);
authorLesson('respectful-presence','Asking whether someone is there',[3008], '先生はいらっしゃいますか', 'いらっしゃいます respectfully describes someone else being somewhere, coming or going. The situation tells you which: 今学校に is a present location; 明日こちらに is coming here; 来週外国に is going abroad. The polite form is いらっしゃいます, not いらっしゃります. Do not use it for your own action: recall 伺います for your visit and おります for your presence. When speaking to an outsider, do not elevate your own family or company colleagues with this verb. In these examples you are asking or talking about your teacher.', [
 ['@先生 は @今 @学校 に 3008~いらっしゃいます~いらっしゃいます か','Is the teacher at school now?'],
 ['@先生 は @明日 @こちら に 3008~いらっしゃいます~いらっしゃいます','The teacher will come here tomorrow.'],
 ['@先生 は @来週 @外国 に 3008~いらっしゃいます~いらっしゃいます','The teacher will go abroad next week.'],
 ['@先生 は @昨日 @学校 に 3008~いらっしゃいませんでした~いらっしゃいませんでした','The teacher was not at school yesterday.'],
],{'@こちら':'here (polite)'});
lesson('celebrating','Gatherings and celebrations',[305,354,831], 'Nの祝い / Nを祝います', '集まり is a gathering. 祝い can mean a celebration or something given in congratulations; 祝う is the verb, to celebrate or congratulate. Use を for the event being celebrated.', [
 ['@週末 に @友達 の 305 が @ある~あります~あります','There is a gathering of friends at the weekend.'],
 ['305 の @場所 を @皆さん に @知らせる~知らせます~しらせます','I tell everyone where the gathering will be.'],
 ['@卒業 の 354 に @本 を @もらう~もらいました~もらいました','I received a book as a graduation gift.'],
 ['514 の 354 に @家族 で @食事 を @する~しました~しました','We had a family meal to celebrate the engagement.'],
 ['@友達 の @誕生日 を 831~祝います~いわいます','We celebrate our friend’s birthday.'],
 ['@家族 で @卒業 を 831~祝いました~いわいました','We celebrated the graduation as a family.'],
]);
lesson('welcoming','Inviting and meeting someone',[733,37,2501], '人を招きます / 人を出迎えます', '招く means to invite; the person takes を and the event or place に. お迎え here means going to meet or pick someone up. 出迎える means meeting and welcoming someone who is arriving. It differs from simply encountering someone by chance.', [
 ['@友達 を @家 に 733~招きました~まねきました','I invited my friend to my home.'],
 ['@卒業 の 354 に @先生 を 733~招きます~まねきます','We invite our teacher to the graduation celebration.'],
 ['@駅 まで 37 に @行く~行きます~いきます','I will go to the station to pick you up.'],
 ['37 の @時間 を @教える~教えてください~おしえてください','Please tell me the pickup time.'],
 ['@空港 で 494 を 2501~出迎えました~でむかえました','I met my relatives at the airport.'],
 ['@玄関 で @客 を 2501~出迎えます~でむかえます','I welcome guests at the entrance.'],
]);
authorLesson('respectful-arrival','Another respectful way to speak about a visit',[3009], '先生がおいでになります', 'おいでになります is another respectful expression for being somewhere, coming or going. Learn the whole expression; it does not mean “become.” As with いらっしゃいます, use it for the person you are treating respectfully, not for your own action or your own colleague when talking to an outsider. Here you speak about your teacher: location and time distinguish presence from a visit. The past is おいでになりました.', [
 ['@先生 は @今 @学校 に 3009~おいでになります~おいでになります か','Is the teacher at school now?'],
 ['@先生 は @明日 @私 の @家 に 3009~おいでになります~おいでになります','The teacher will come to my home tomorrow.'],
 ['@先生 は @来月 @外国 に 3009~おいでになります~おいでになります','The teacher will go abroad next month.'],
 ['@先生 は @昨日 @こちら に 3009~おいでになりました~おいでになりました','The teacher came here yesterday.'],
],{'@こちら':'here (polite)'});
lesson('at-the-door','Useful expressions during a visit',[2607,2642], 'ごめんください / お構いなく', 'ごめんください is a call at someone’s entrance to announce your arrival; it is not an apology for something you did. お構いなく tells a host not to go to trouble for you, often in response to an offer of tea. Learn the complete expressions in these situations.', [
 ['2607 @今 @大丈夫 です か','Hello? Is now a good time?'],
 ['@友達 の @家 の @前 で 2607 と @言う~言いました~いいました','I called “Hello?” outside my friend’s home.'],
 ['@どうぞ 2642','Please do not go to any trouble.'],
 ['2642 @すぐ に @帰る~帰ります~かえります','Please do not trouble yourself; I will be leaving soon.'],
]);
authorLesson('unexpected-visit','An unexpected visit',[], 'A chance encounter at home', 'Follow a chance encounter from noticing someone outside to inviting them in.', [
 ['137 @私 は 2041 を @する~していました~していました','The other day, I was looking after the house.'],
 ['@友達 は 270 中 に 296 @私 の @家 の @前 を @通る~通りました~とおりました','While out, my friend happened to pass my house.'],
 ['@その @時 @私 は 238 @窓 から @友達 を @見る~見ました~みました','Just then, I happened to see my friend through the window.'],
 ['@友達 を @家 に 733~招いて~まねいて @一緒 に @お茶 を @飲む~飲みました~のみました','I invited my friend in, and we had tea together.'],
],{137:'the other day; a recent past day',238:'coincidence; by chance',296:'by chance; happen to',270:'going out; being away from home',2041:'staying home to look after the house while others are away'});
lesson('account','Welcoming a friend for a celebration',[], 'A connected account of a visit', 'Follow the invitation, arrival, welcome and celebration. Reuse the earlier distinction between an invitation and going to meet an arriving visitor. This account introduces no new language.', [
 ['@卒業 の 354 に 244 を @家 に 733~招きました~まねきました','I invited my close friend home to celebrate the graduation.'],
 ['@駅 まで 37 に @行く~行きました~いきました','I went to the station to pick up my friend.'],
 ['@家族 は @玄関 で @友達 を 2501~出迎えました~でむかえました','My family welcomed my friend at the entrance.'],
 ['305 で は @昔 の @写真 を @見る~見て~みて @話す~話しました~はなしました','At the gathering, we looked at old photographs and talked.'],
 ['@一緒 に @卒業 を 831~祝いました~いわいました','We celebrated the graduation together.'],
]);
}
