export function authorConversation({topic,lesson,lines,forms,course}) {
forms['の']=['の','links nouns; turns a clause into a noun-like expression'];
forms['そう']=['そう','so; that way'];
topic('conversation','Conversation and politeness','Ask politely, pass on a message, and recognize differences in speaking style.');
lesson('polite-requests','Making a polite request',[12,13,142,429,125,127,135], 'Nをください / Nはいかがですか / よろしいですか', 'ください asks for something or follows a verb request. いかが is a polite alternative to どう. よろしい is a polite alternative to いい. 結構です can accept an arrangement or decline an offer; the situation and tone matter. ええ is a conversational yes.', [
 ['@水 を 12','Please give me water.'],['@メニュー を 12','Please give me the menu.'],
 ['13 は @どこ です か','Where is everyone?'],['13 、 @こんにちは','Hello, everyone.'],
 ['@お茶 は 142 です か','Would you like some tea?'],['@この @服 は 142 です か','How about these clothes?'],
 ['@ここ で 429 です か','Is this place all right?'],['@今 で 429 です か','Is now all right?'],
 ['@その @時間 で 125 です','That time is fine.'],['@ありがとう~ありがとうございます~ありがとうございます 、 @もう 125 です','Thank you, I do not need any more.'],
 ['127 、 @わかる~わかります~わかります','Yes, I understand.'],['127 、 @私 も @行く~行きます~いきます','Yes, I will go too.'],
 ['135 @ありがとう~ありがとうございます~ありがとうございます','Thank you very much.'],['135 @すみません','I am very sorry.'],
]);
lesson('greetings','Greeting people',[1282], '人に挨拶します / 挨拶の言葉', '挨拶（あいさつ） is a greeting used when meeting or parting from someone. Add する to describe greeting someone, and use に for the person you greet. 挨拶の言葉 means the words used in a greeting.', [
 ['166 349 の @人 に 1282 @する~します~します','I greet people in my neighborhood every morning.'],
 ['@初めて @会う @人 に も 1282 @する~します~します','I also greet people I am meeting for the first time.'],
 ['@先生 に @日本語 で 1282 @する~しました~しました','I greeted my teacher in Japanese.'],
 ['@朝 の 1282 を @練習 @する~しました~しました','I practiced morning greetings.'],
 ['@友達 に 1282 @する~して~して から @部屋 に @入る~入りました~はいりました','I greeted my friend before entering the room.'],
 ['165 @前 に @家族 に 1282 @する~します~します','I say goodbye to my family before going out.'],
], {'1282':'greeting; greeting someone'});
course.lessons.at(-1).notes[0].title='The word for a greeting';
lesson('home-welcome','Welcoming a guest',[1281], 'いらっしゃい', 'Say いらっしゃい when someone arrives at your home. You can follow it with an invitation to come in or an offer of tea. Shops often greet customers with the longer いらっしゃいませ.', [
 ['1281 、 @どうぞ @入る~入ってください~はいってください','Welcome! Please come in.'],
 ['1281 、 @ここ に @座る~座ってください~すわってください','Welcome! Please sit here.'],
 ['1281 、 @お茶 は 142 です か','Welcome! Would you like some tea?'],
 ['1281 、 @荷物 は @ここ に @置く~置いてください~おいてください','Welcome! Please put your bags here.'],
 ['1281 、 @外 は @寒い~寒かった~さむかった です か','Welcome! Was it cold outside?'],
], {'1281':'welcome (greeting a guest)'});
course.lessons.at(-1).notes[0].title='Welcoming someone into your home';
lesson('introductions','Introductions and respectful questions',[159,244,460,642,313,413], 'どなた / ご存知ですか / Nを紹介します', 'どなた is a polite who. ご存知ですか respectfully asks whether the listener knows something; do not use ご存知 to describe your own knowledge. 者, read もの here, is a formal way to refer to a person, often yourself in a self-description.', [
 ['159 です か','Who is it?'],['@あの @人 は 159 です か','Who is that person?'],
 ['@友達 を 244~紹介します~しょうかいします','I introduce my friend.'],['@家族 を 244~紹介しました~しょうかいしました','I introduced my family.'],
 ['@この @店 を 460 です か','Do you know this shop?'],['@先生 は 460 です','The teacher knows.'],
 ['@日本語 を @勉強 @する~している~している 642 です','I am someone studying Japanese.'],['@電話 を @する~した~した 642 です','I am the person who called.'],
 ['313 です が 、 159 です か','Excuse me, but who are you?'],['@それ は 313 です','That is impolite.'],
 ['413 に @話す~話します~はなします','I speak politely.'],['413 な @言葉 を @使う~使います~つかいます','I use polite language.'],
]);
lesson('asking','Asking someone to do something',[136,560,393,386,551,326], '人に頼みます / 人に尋ねます / Nを伝えます', '頼む asks someone to do something; 尋ねる asks for information. 返事 is a reply. 伝える conveys a message and 知らせる lets someone know. なるほど acknowledges that an explanation makes sense.', [
 ['@友達 に 136~頼みます~たのみます','I ask my friend for a favor.'],['@母 に @買い物 を 136~頼みました~たのみました','I asked my mother to do the shopping.'],
 ['@先生 に 560~尋ねます~たずねます','I ask the teacher.'],['@道 を 560~尋ねました~たずねました','I asked for directions.'],
 ['393 を @書く~書きます~かきます','I write a reply.'],['393 は @まだ です','There is no reply yet.'],
 ['@友達 に @時間 を 386~伝えます~つたえます','I tell my friend the time.'],['@日本語 で 386~伝えました~つたえました','I conveyed it in Japanese.'],
 ['@名前 を 551~知らせてください~しらせてください','Please let me know your name.'],['@家族 に 551~知らせました~しらせました','I let my family know.'],
 ['326 、 @わかる~わかりました~わかりました','I see, now I understand.'],['326 、 そう です か','I see, is that so?'],
]);
lesson('moving-on','Moving a conversation along',[1274], 'それでは、…', 'それでは introduces the next step after a discussion or agreement, or leads into a goodbye. It is more formal than the familiar じゃあ. The following statements use known words and grammar to confirm a plan or close a conversation.', [
 ['1274 、 @また明日','Well then, see you tomorrow.'],
 ['1274 、 @明日 の @三 時 に @会う~会いましょう~あいましょう','Then, let’s meet at three tomorrow.'],
 ['1274 、 @ここ で @待つ~待ちます~まちます','Then, I will wait here.'],
 ['1274 、 @一緒 に @行く~行きましょう~いきましょう','Well then, let’s go together.'],
]);
lesson('respect','Respectful verbs',[535,595,622,494], 'おっしゃいます / なさいます / 召し上がります / くださいます', 'These verbs respectfully describe the other person’s actions. おっしゃる replaces 言う, なさる replaces する, and 召し上がる replaces 食べる or 飲む. くださる describes someone giving to you respectfully. Its polite form is くださいます, not くださります.', [
 ['@先生 は そう 535~おっしゃいました~おっしゃいました','The teacher said so.'],['@何~何~なん と 535~おっしゃいました~おっしゃいました か','What did you say?'],
 ['@先生 は @何 を 595~なさいます~なさいます か','What will the teacher do?'],['@旅行 を 595~なさいました~なさいました か','Did you take a trip?'],
 ['@何 を 622~召し上がります~めしあがります か','What would you like to eat or drink?'],['@先生 は @お茶 を 622~召し上がりました~めしあがりました','The teacher had tea.'],
 ['@先生 が @本 を 494~くださいました~くださいました','The teacher gave me a book.'],['@先生 が @手伝う~手伝って~てつだって 494~くださいます~くださいます','The teacher will help me.'],
]);
lesson('humble','Humble verbs for your actions',[606,602,619,611,613,1257,1258,618], '申します / いたします / 伺います / いただきます', 'Humble forms lower the speaker’s side in respectful interaction. 申す and 申し上げる mean say; いたす means do; 伺う can mean ask or visit; まいる means go or come. いただく means receive, eat or drink humbly. おります is the humble polite form of いる. 差し上げる respectfully gives to someone.', [
 ['@先生 に そう 606~申しました~もうしました','I said so to the teacher.'],['@私 は @学生 だ と 606~申しました~もうしました','I said that I was a student.'],
 ['@ありがとう~ありがとうございます~ありがとうございます と 602~申し上げました~もうしあげました','I expressed my thanks.'],['@先生 に 602~申し上げます~もうしあげます','I will tell the teacher.'],
 ['@私 が 619~いたします~いたします','I will do it.'],['@予約 を 619~いたしました~いたしました','I made a reservation.'],
 ['@先生 に 611~伺います~うかがいます','I ask the teacher.'],['@明日 @会社 に 611~伺います~うかがいます','I will visit your company tomorrow.'],
 ['@明日 613~まいります~まいります','I will come tomorrow.'],['@駅 に 613~まいります~まいります','I will go to the station.'],
 ['@先生 に @本 を 1257~いただきました~いただきました','I received a book from the teacher.'],['@お茶 を 1257~いただきます~いただきます','I will have some tea.'],
 ['@私 は @会社 に 1258~おります~おります','I am at the office.'],['@ここ で @待つ~待って~まって 1258~おります~おります','I am waiting here.'],
 ['@先生 に @本 を 618~差し上げました~さしあげました','I gave the teacher a book.'],['@お茶 を 618~差し上げます~さしあげます','I will give you some tea.'],
]);
lesson('gifts','Thanks and gifts',[458,476,363,419,794,1048], 'Nのお礼 / Nの贈り物 / Nを歓迎します', 'お礼 is thanks or something given in thanks. 贈り物 and プレゼント both name a gift. お祝い celebrates an occasion. 感謝する expresses gratitude; 歓迎する welcomes someone.', [
 ['458 を @言う~言います~いいます','I say thank you.'],['@これ は 458 です','This is a token of my thanks.'],
 ['476 を @選ぶ~選びます~えらびます','I choose a gift.'],['476 を @もらう~もらいました~もらいました','I received a gift.'],
 ['363 を @買う~買いました~かいました','I bought a present.'],['@誕生日 の 363 です','It is a birthday present.'],
 ['@結婚 の 419 です','It is a wedding celebration.'],['419 の @手紙 を @書く~書きます~かきます','I write a congratulatory letter.'],
 ['@家族 に 794~感謝しています~かんしゃしています','I am grateful to my family.'],['794 の @言葉 を 386~伝えます~つたえます','I convey words of gratitude.'],
 ['@友達 を 1048~歓迎します~かんげいします','I welcome my friend.'],['1048 の @パーティー を @する~します~します','We hold a welcome party.'],
]);
lesson('apologies','Apologies and considerate speech',[523,570,596,585,912,1043,355], '人に謝ります / Nをほめます / Nは迷惑です', '謝る apologizes to someone; 褒める praises them. しかる is scold; いじめる is bully. 迷惑 describes trouble or inconvenience to someone. のは turns an action into the topic. 申し訳ありません is a formal apology.', [
 ['@友達 に 523~謝りました~あやまりました','I apologized to my friend.'],['@すぐ 523~謝ります~あやまります','I apologize right away.'],
 ['@先生 が @学生 を 570~褒めました~ほめました','The teacher praised the student.'],['@母 が @子供 を 570~褒めています~ほめています','The mother is praising the child.'],
 ['@父 が @子供 を 596~しかりました~しかりました','The father scolded the child.'],['@先生 は 596~しからない~しからない @人 です','The teacher is someone who does not scold.'],
 ['@子供 を 585~いじめないでください~いじめないでください','Please do not bully children.'],['@人 を 585~いじめる~いじめる の は @だめ です','It is not okay to bully people.'],
 ['912 @ある~ありません~ありません','I am very sorry.'],['@本当に 912 @ある~ありません~ありません','I am truly sorry.'],
 ['@それ は 1043 です','That is a nuisance.'],['@夜 の @電話 は 1043 です','Phone calls at night are a nuisance.'],
 ['355 を @する~しないでください~しないでください','Please do not get in the way.'],['@仕事 の 355 です','It gets in the way of the work.'],
]);
lesson('register','Recognizing informal and rough speech',[139,742,658,659,905,678], 'さあ / なんで / いや / plain endings', '行かない is the plain negative of 行く, and 来なかった the plain past negative of 来る; のですか asks for an explanation. さあ can encourage the next action; まあ can soften a reaction. なんで is conversational why, and いや can introduce a correction. お前 and ばか can be rude or insulting. Learn to recognize them in dialogue; use あなた, a name, or an omitted subject in polite interaction, and avoid calling people ばか.', [
 ['139 、 @行く~行きましょう~いきましょう','All right, let’s go.'],['139 、 @始める~始めましょう~はじめましょう','Now, let’s begin.'],
 ['742 @行く~行かない~いかない の です か','Why are you not going?'],['742 @来る~来なかった~こなかった の です か','Why did you not come?'],
 ['658 、 @違う~違います~ちがいます','No, that is not right.'],['658 、 @私 は @行く~行きません~いきません','No, I am not going.'],
 ['659 は @誰 だ','Who are you?'],['659 は @何 を @する~している~している','What are you doing?'],
 ['905 と @言う~言わないでください~いわないでください','Please do not call me an idiot.'],['@私 は 905 ではありません','I am not stupid.'],
 ['678 、 @大丈夫 です','Well, it will be all right.'],['678 、 @少し @待つ~待ってください~まってください','Well, please wait a little.'],
]);
}
