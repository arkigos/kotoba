import { topic, lesson, lines, useTopic, course } from './curated-course-authoring.mjs';

topic('conversation', 'Meeting people and conversation', 'Greet people, introduce yourself, and keep a conversation going.');
lesson('hello', 'Greetings and introductions', [12,15,16,389,19,394], 'Social expressions', 'こんにちは is a daytime greeting; こんばんは is for the evening. おはよう is casual; おはようございます is polite. はじめまして and どうぞよろしく are used when first meeting someone. A complete greeting can stand on its own.', [
 ['12','Hello.'],['12 、 4','Hello, teacher.'],['15','Good morning.'],['15 。 1 は 5 です','Good morning. I am a student.'],['16','Good evening.'],['16 、 4','Good evening, teacher.'],['389','Good morning.'],['389 、 4','Good morning, teacher.'],['19','Nice to meet you.'],['394','I look forward to getting to know you.'],['19 。 1 は 5 です 。 394','Nice to meet you. I am a student. I look forward to getting to know you.']]);
lesson('name', 'Asking who and what', [2,20,21,10,11], '誰ですか / 何ですか / はい・いいえ', '誰 asks who; 何 asks what. 何 is read なん before です. Keep か at the end of the question.', [
 ['71 は 20 です か','Who is your friend?'],['4 は 20 です か','Who is the teacher?'],['2 は 21~何~なん です か','What is your name?'],['23 は 21~何~なん です か','What is this?'],['23 は 1 の 2 です','This is my name.'],['10 、 1 は 5 です','Yes, I am a student.'],['11 、 1 は 5 ではありません','No, I am not a student.'],['10 、 4 です','Yes, I am a teacher.'],['11 、 4 ではありません','No, I am not a teacher.']]);
course.lessons.at(-1).notes[0].title = 'Ask who or what';
course.lessons.at(-1).notes[0].pattern = '誰ですか / 何ですか';
course.lessons.at(-1).notes.push({ start: 6, title: 'Answer yes or no', pattern: 'はい / いいえ / Nではありません', explanation: 'はい means yes; いいえ means no. For a negative statement about who someone is, replace です with ではありません.' });
lesson('belongings', 'Whose book is that?', [], 'それ・あれ / NのN / adjective + です', 'の links an owner to an object. Use か when you need to check who it belongs to.', [
 ['24 は 1 の 32 です','That is my book.'],
 ['25 は 1 の 136 です','That over there is my car.'],
 ['24 は 4 の 53 です','That is the teacher’s chair.'],
 ['25 は 71 の 136 です','That over there is my friend’s car.'],
 ['24 は 295 の 53 です か','Is that your chair?'],
 ['25 は 4 の 136 です か','Is that over there the teacher’s car?'],
 ['1 の 32 は 69 です','My book is new.'],
 ['4 の 32 は 70 です','The teacher’s book is old.'],
 ['1 の 53 は 68 です','My chair is small.'],
 ['4 の 53 は 67 です','The teacher’s chair is big.'],
 ['71 の 136 は 69 です','My friend’s car is new.'],
 ['295 の 136 は 70 です か','Is your car old?'],
]);
course.lessons.at(-1).notes[0].title = 'Check who it belongs to';
lesson('countries', 'Countries and nationalities', [8,9,571,572,573], '国はNです / N人 / NのN', '日本 is Japan, read にほん here. 日本人 is a Japanese person. 外国 is a foreign country and 外国人 a foreign person. Nationality words describe people, not languages.', [
 ['1 の 8 は 9 です','My country is Japan.'],['71 の 8 は 9 です','My friend’s country is Japan.'],['1 は 571 です','I am Japanese.'],['4 は 571 です','The teacher is Japanese.'],['572 の 4 です','They are a teacher from another country.'],['572 の 71 です','They are a friend from another country.'],['1 は 573 です','I am a foreigner.'],['4 は 573 です','The teacher is a foreigner.']]);
lesson('courtesy', 'Please, thank you, and sorry', [13,14,17,18,716,717], 'Polite requests and responses', 'すみません can attract attention, apologize, or express thanks for trouble taken. ごめんなさい is an apology. どうぞ invites someone to take something or go ahead. お願いします asks politely; お願い is the noun request.', [
 ['13','Thank you.'],['4 、 13~ありがとうございます~ありがとうございます','Thank you, teacher.'],['14','Excuse me.'],['14 、 23 は 21~何~なん です か','Excuse me, what is this?'],['17','Please.'],['23 を 17','This one, please.'],['18','Please, go ahead.'],['10 、 18','Yes, go ahead.'],['716 が 49~あります~あります','I have a request.'],['1 の 716 です','It is my request.'],['717','I am sorry.'],['4 、 717','Teacher, I am sorry.']]);
lesson('home-greetings', 'Coming and going', [719,720,721,722,718], 'ただいま / お帰りなさい', 'ただいま announces that you are home; お帰りなさい welcomes someone home. 行ってきます means “I am off and will be back”, answered with いってらっしゃい. おやすみなさい is a good-night greeting. A slash marks a change of speaker in the short exchanges.', [
 ['719','I am home!'],['720','Welcome home!'],['719 ／ 720','I am home! — Welcome home!'],['721','I am off.'],['722','Have a good day.'],['721 ／ 722','I am off. — Have a good day.'],['718','Good night.'],['718 、 4','Good night, teacher.']]);
lesson('goodbyes', 'Partings and congratulations', [380,746,747,748,390,375], 'Friendly and formal partings', 'またね is a friendly “see you”; また明日 specifies tomorrow. さようなら can sound like a longer separation. 失礼します is useful when entering or leaving a formal setting. おめでとう congratulates someone; add ございます for politeness.', [
 ['380','Goodbye.'],['380 、 4','Goodbye, teacher.'],['746','See you.'],['13 。 746','Thanks. See you.'],['747','See you tomorrow.'],['718 。 747','Good night. See you tomorrow.'],['748','Congratulations!'],['748~おめでとうございます~おめでとうございます','Congratulations!'],['390','Excuse me.'],['4 、 390','Teacher, excuse me.'],['375 17','Please help me again.'],['4 、 375 17','Teacher, please help me again.']]);
lesson('phone', 'On the phone', [154,155,156,157,468,585], 'もしもし / Nの番号 / 人を呼んでください', 'もしもし is used on the telephone. 電話 is a telephone or phone call; 携帯電話 a mobile phone. 番号 is a number. 呼んでください asks someone to call a person over.', [
 ['468','Hello?'],['468 、 4 です か','Hello, is that the teacher?'],['154 の 157 は 21~何~なん です か','What is the telephone number?'],['155 の 157 です','It is my mobile phone number.'],['23 は 155 です','This is a mobile phone.'],['23 は 154 です','This is a telephone.'],['156 は 21~何~なん です か','What is your address?'],['23 は 1 の 156 です','This is my address.'],['4 を 585~呼んで~よんで ください','Please call the teacher over.'],['71 を 585~呼んで~よんで ください','Please call my friend over.']]);
lesson('zero', 'Checking digits on the phone', [753], 'ゼロ / …ですか / はい・いいえ', 'ゼロ is zero. These short exchanges check groups of digits from a phone number, not complete numbers. For individual digits, use よん for four, なな for seven and きゅう for nine. Repeat what you heard with ですか; use はい to confirm or いいえ before the correction.', [
 ['753 、 93 、 753 です か','Is that zero, nine, zero?'],
 ['10 、 753 、 93 、 753 です','Yes, zero, nine, zero.'],
 ['753 、 91~七~なな です か','Is that zero, seven?'],
 ['11 、 753 、 88~四~よん です','No, zero, four.'],
]);
lesson('repair', 'Keeping a conversation going', [103,104,189,187,201], 'Vてください / 知っています・知りません', '言ってください means please say it. もう一度 asks for once more, and ゆっくり for slowly. 知っています expresses knowing something; its normal negative is 知りません. 手伝ってください asks for practical help.', [
 ['103 189~言って~いって ください','Please say it again.'],['104 189~言って~いって ください','Please say it slowly.'],['2 を 189~言って~いって ください','Please tell me your name.'],['103 2 を 189~言って~いって ください','Please tell me your name again.'],['104 2 を 189~言って~いって ください','Please tell me your name slowly.'],['2 を 187~知っています~しっています','I know the name.'],['2 は 187~知りません~しりません','I do not know the name.'],['1 を 201~手伝って~てつだって ください','Please help me.'],['71 を 201~手伝います~てつだいます','I help my friend.']]);
lesson("feelings", "Responding to news", [378, 602, 603, 465, 466, 624], "い-adjectives / 本当に", "嬉しい means happy about something, 寂しい lonely, and 悲しい sad. 本当に adds “really”. 残念 expresses disappointment; いいですね is a positive response to someone’s news.", [
 ["1 は 378 です", "I am happy."],
 ["624 378 です", "I am really happy."],
 ["1 は 602 です", "I am lonely."],
 ["624 602 です", "I am really lonely."],
 ["1 は 603 です", "I am sad."],
 ["624 603 です", "I am really sad."],
 ["465 です ね", "That is disappointing."],
 ["624 465 です", "That is really disappointing."],
 ["466", "That is nice."],
 ["10 、 466", "Yes, that is nice."]
]);
lesson("responses", "Short everyday responses", [373, 467, 470], "本当ですか / もちろん / 多分", "本当ですか asks whether something is true. もちろん means of course. 多分 makes a simple statement less certain: “probably”. Use 私も when the same thing is true for you.", [
 ["373 です か", "Is that true?"],
 ["10 、 373 です", "Yes, it is true."],
 ["467 、 1 も", "Of course, me too."],
 ["467 、 17", "Of course, please do."],
 ["470 4 です", "They are probably a teacher."],
 ["470 5 です", "They are probably a student."]
]);

lesson("linking", "Linking short sentences", [372, 376, 479, 488], "でも / それから / そして / じゃあ", "でも contrasts two statements. それから gives the next item or step; you can leave out a repeated request when it is clear. そして adds information. じゃあ means “then” in a response.", [
 ["1 は 5 です 。 372 4 ではありません", "I am a student, but I am not a teacher."],
 ["378 です 。 372 602 です", "I am happy, but I am lonely."],
 ["2 を 189~言って~いって ください 。 376 156 を", "Please say your name, and then your address."],
 ["154 の 157 を 189~言って~いって ください 。 376 2 を", "Please say your phone number, and then your name."],
 ["4 です 。 479 1 の 71 です", "They are a teacher and also my friend."],
 ["4 です 。 479 571 です", "They are a teacher, and they are Japanese."],
 ["488 、 746", "Well then, see you."],
 ["488 、 390", "Well then, excuse me."]
]);
lesson("why", "Asking why", [225, 625], "どうして / なぜ + question", "どうして and なぜ ask why. These questions respond to someone who has just said they feel lonely or sad. なぜ can sound more formal or direct; どうして is common in conversation.", [
 ["225 602 です か", "Why are you lonely?"],
 ["225 603 です か", "Why are you sad?"],
 ["625 602 です か", "Why are you lonely?"],
 ["625 603 です か", "Why are you sad?"]
]);
lesson("opinion-question", "Asking what someone thinks", [188, 213, 218, 447], "どう思いますか", "Learn どう思いますか as the short question “What do you think?” A person followed by は says whose opinion you are asking about. Answer with a familiar description such as 大切です. Building an “I think…” sentence around another clause comes in A2.", [
 ["213 です ね", "That is bad, isn’t it?"],
 ["213 です 。 507 188~思います~おもいます か", "It is bad. What do you think?"],
 ["218 です", "It is important."],
 ["218 です 。 4 は 507 188~思います~おもいます か", "It is important. What does the teacher think?"],
 ["447 です", "It is no good."],
 ["447 です 。 71 は 507 188~思います~おもいます か", "It is no good. What does my friend think?"]
]);


useTopic('food');
lesson('mealtimes','Breakfast, lunch, and dinner',[300,437,435], 'Nを食べます / Nは…です', '朝ごはん, 昼ご飯 and 晩御飯 name breakfast, lunch and dinner. ご飯 in these words means a meal, not necessarily rice.', lines([[300,'breakfast'],[437,'lunch'],[435,'dinner']], [['$ を 37~食べます~たべます','I eat $.'],['$ は 127 です','I have bread for $.'],['$ は 303 です','I have curry for $.']]));
useTopic('shopping');
lesson('prices','Prices and free items',[407,493,495,469], '百円・千円・一万円 / 無料', '百, 千 and 万 are one hundred, one thousand and ten thousand. Put 円 after the amount. Ten thousand needs 一 before 万: 一万円（いちまんえん）. 無料 means free of charge.', [
 ['32 は 407 62 です','The book costs one hundred yen.'],['23 は 407 62 です','This costs one hundred yen.'],['360 は 493 62 です','The shirt costs one thousand yen.'],['23 は 493 62 です','This costs one thousand yen.'],['490 は 495 62 です','The coat costs ten thousand yen.'],['23 は 495 62 です','This costs ten thousand yen.'],['23 は 469 です','This is free.'],['23 は 469 です か','Is this free?']]);
useTopic('health');
lesson('teeth','Looking after your teeth',[580], '歯を磨きます / Vてください', '磨きます means brush or polish. With 歯 it means brush your teeth. 磨いてください is a polite request.', [['276 を 580~磨きます~みがきます','I brush my teeth.'],['276 を 580~磨いて~みがいて ください','Please brush your teeth.'],['1 は 276 を 580~磨きました~みがきました','I brushed my teeth.']]);
useTopic('time');
lesson('nearby-days','Other nearby days',[521,522,462], '一昨日・明後日 / 日（ひ）', '一昨日 is the day before yesterday; 明後日 the day after tomorrow. 日 as a general noun is read ひ, unlike the date counter にち.', [
 ['521 は 328 でした','The day before yesterday was a day off.'],['521 71 に 114~会いました~あいました','I met my friend the day before yesterday.'],['522 は 328 です','The day after tomorrow is a day off.'],['522 71 に 114~会います~あいます','I will meet my friend the day after tomorrow.'],['328 の 462 です','It is a day off.'],['327 の 462 です','It is the day of my birthday.']]);
useTopic('conversation');
lesson('sending','Sending something',[179], '人にNを送ります', '送ります means send. に marks the recipient; を marks what is sent.', [['71 に 32 を 179~送ります~おくります','I send a book to my friend.'],['4 に 32 を 179~送ります~おくります','I send a book to the teacher.'],['71 に 155 を 179~送ります~おくります','I send a mobile phone to my friend.']]);

useTopic('home');
lesson('push-pull','Push or pull',[724,725], 'NをVてください', 'A polite request uses the て-form and ください. 押す becomes 押して; 引く becomes 引いて. These verbs commonly appear in instructions for doors.', [['163 を 724~押して~おして ください','Please push the door.'],['163 を 725~引いて~ひいて ください','Please pull the door.'],['163 を 724~押します~おします','I push the door.'],['163 を 725~引きます~ひきます','I pull the door.']]);
useTopic('time');
lesson('opening-hours','Opening hours',[476], 'Nは何時から何時までですか', 'から and まで give the start and end of a time range. 営業時間 names the hours when a business is open.', [['476 は 438 から 438 まで です か','What are the opening hours?'],['476 は 321 93~九~く 時 から 320 89 時 まで です','The opening hours are from nine a.m. to five p.m.']]);
