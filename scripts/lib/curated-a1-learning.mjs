import { topic, lesson, lines } from './curated-course-authoring.mjs';

topic('learning', 'Japanese and learning', 'Study Japanese, ask questions, and talk about school.');
lesson('languages', 'Speaking Japanese', [6,7,41,44], 'Nを話します / Nがわかります', '話します uses を for the language you speak. わかります uses が for what you understand. The negative polite form ends in ません. A language noun does not need a word meaning “language” after it.', [
 ['6 を 41~話します~はなします','I speak Japanese.'],['7 を 41~話します~はなします','I speak English.'],['6 を 41~話します~はなします か','Do you speak Japanese?'],['7 を 41~話します~はなします か','Do you speak English?'],['6 が 44~わかります~わかります','I understand Japanese.'],['7 が 44~わかります~わかります','I understand English.'],['6 は 44~わかりません~わかりません','I do not understand Japanese.'],['7 は 44~わかりません~わかりません','I do not understand English.']]);
lesson('reading-writing', 'Reading and writing', [42,43,166,167,33,168], 'Nを読みます / Nで書きます', '読みます means read; 書きます means write. を marks what you read or write. で marks a writing tool, while に marks the surface you write on.', [
 ['32 を 42~読みます~よみます','I read a book.'],['6 を 42~読みます~よみます','I read Japanese.'],['7 を 42~読みます~よみます','I read English.'],['6 を 43~書きます~かきます','I write Japanese.'],['7 を 43~書きます~かきます','I write English.'],['166 に 43~書きます~かきます','I write on paper.'],['167 で 43~書きます~かきます','I write with a pencil.'],['33 で 43~書きます~かきます','I write with a pen.'],['168 を 42~読みます~よみます','I read the dictionary.'],['23 は 6 の 168 です','This is a Japanese dictionary.'],['167 で 166 に 43~書きます~かきます','I write on paper with a pencil.'],['33 で 166 に 43~書きます~かきます','I write on paper with a pen.']]);
lesson('scripts', 'Japanese writing', [296,297,298,382,570,569], 'Nで書きます / Nを読みます', 'ひらがな and カタカナ are syllabic scripts; 漢字 are characters that also carry meaning. ローマ字 uses the Latin alphabet. で can mark the writing system. 字 is a character; 文 is a sentence.', [
 ...lines([[296,'hiragana'],[297,'kanji'],[298,'katakana'],[382,'romaji']], [['$ を 42~読みます~よみます','I read $.'],['$ で 43~書きます~かきます','I write in $.']]),
 ['23 は 6 の 570 です','This is a Japanese character.'],['570 を 43~書きます~かきます','I write a character.'],['6 の 569 を 42~読みます~よみます','I read a Japanese sentence.'],['6 の 569 を 43~書きます~かきます','I write a Japanese sentence.']]);
lesson('questions', 'Questions and answers', [169,170,172,173,174,586], 'Nに答えます / Nの意味', '答えます uses に for the question answered. の links a word to its meaning: 言葉の意味. 質問 and 答え are the nouns “question” and “answer”. 会話 is a conversation.', [
 ['169 を 42~読みます~よみます','I read the question.'],['170 を 43~書きます~かきます','I write the answer.'],['169 に 586~答えます~こたえます','I answer the question.'],['6 で 586~答えます~こたえます','I answer in Japanese.'],['170 は 44~わかりません~わかりません','I do not know the answer.'],['173 の 172 が 44~わかります~わかります','I understand the meaning of the word.'],['173 の 172 は 44~わかりません~わかりません','I do not understand the meaning of the word.'],['6 の 174 が 44~わかります~わかります','I understand the Japanese conversation.'],['174 の 172 が 44~わかります~わかります','I understand what the conversation means.']]);
lesson('school', 'At school', [55,386,322,171,566,567,568], '場所で勉強します / verbal noun + します', 'で marks where an action takes place. 勉強, 練習 and 質問 can combine with します to form verbs. 授業 is a lesson or class; 宿題 is homework, and 試験 is an examination.', [
 ['55 で 171~勉強します~べんきょうします','I study at school.'],['386 で 171~勉強します~べんきょうします','I study in the classroom.'],['6 を 171~勉強します~べんきょうします','I study Japanese.'],['6 の 322 です','This is a Japanese class.'],['322 で 169~質問します~しつもんします','I ask a question in class.'],['566 を 43~書きます~かきます','I write my homework.'],['55 の 566 です','This is homework from school.'],['567 の 170 を 43~書きます~かきます','I write an exam answer.'],['6 の 567 です','This is a Japanese exam.'],['297 を 568~練習します~れんしゅうします','I practice kanji.'],['174 を 568~練習します~れんしゅうします','I practice conversation.'],['386 で 6 を 41~話します~はなします','I speak Japanese in the classroom.']]);
lesson('learn-teach', 'Learning from someone', [183,184,185,186,574,456], '人に教えます / 人に習います', '教えます means teach; 習います means learn from someone or take lessons. Both can use に for the other person, but the direction is different. 覚えます means memorize and 忘れます means forget.', [
 ['71 に 6 を 183~教えます~おしえます','I teach Japanese to my friend.'],['71 に 7 を 183~教えます~おしえます','I teach English to my friend.'],['4 に 6 を 184~習います~ならいます','I learn Japanese from a teacher.'],['4 に 7 を 184~習います~ならいます','I learn English from a teacher.'],['173 を 185~覚えます~おぼえます','I memorize a word.'],['297 を 185~覚えます~おぼえます','I memorize kanji.'],['173 を 186~忘れます~わすれます','I forget a word.'],['297 を 186~忘れます~わすれます','I forget a kanji character.'],['574 を 568~練習します~れんしゅうします','I practice pronunciation.'],['574 を 184~習います~ならいます','I learn pronunciation.'],['456 を 171~勉強します~べんきょうします','I study a foreign language.'],['456 を 183~教えます~おしえます','I teach a foreign language.']]);
lesson('understanding', 'Easy and difficult', [212,219,596,597,214,215], 'い-adjective / な-adjective / 違います', '難しい and やさしい here describe difficulty. 簡単 is a な-adjective meaning simple. 正しい means correct. 同じ means the same; 違います is the polite form of 違う, “differ” or “be wrong”.', [
 ...lines([[212,'difficult'],[219,'simple'],[596,'easy']], [['169 は $ です','The question is $.'],['6 の 574 は $ です','Japanese pronunciation is $.']]),
 ['170 は 597 です','The answer is correct.'],['597 170 です','It is a correct answer.'],['170 は 214 です','The answers are the same.'],['574 は 214 です','The pronunciation is the same.'],['170 は 215~違います~ちがいます','The answer is wrong.'],['574 は 215~違います~ちがいます','The pronunciation is different.']]);
lesson('school-people', 'Students', [700,701,702,703,704], 'NはNです / Nに教えます', 'These words distinguish university, exchange, elementary, junior-high and high-school students. A noun before に can name the person you teach. University students are also 学生, but 大学生 is more specific.', lines([[700,'a university student'],[701,'an international student'],[702,'an elementary school student'],[703,'a junior high school student'],[704,'a high school student']], [['71 は $ です','My friend is $.'],['$ に 6 を 183~教えます~おしえます','I teach Japanese to $.']]));
lesson('study-tools', 'Using study tools', [105,564,383,385,384], 'Nを使います / Nを読みます', '使います means use. A dictionary and eraser are tools; newspapers and magazines are reading material. 数字 means numerals, as written symbols.', [
 ['168 を 105~使います~つかいます','I use a dictionary.'],['33 を 105~使います~つかいます','I use a pen.'],['564 を 105~使います~つかいます','I use an eraser.'],['23 は 564 です','This is an eraser.'],['383 を 42~読みます~よみます','I read a newspaper.'],['6 の 383 です','This is a Japanese newspaper.'],['385 を 42~読みます~よみます','I read a magazine.'],['6 の 385 です','This is a Japanese magazine.'],['384 を 43~書きます~かきます','I write a numeral.'],['384 を 42~読みます~よみます','I read the number.']]);
lesson('writing-messages', 'Writing messages', [565,436,439,651,652,653,656], 'NでNを書きます', 'で can describe a device used to write. メール means email; 手紙 is a physical letter. 日記 is a diary and ブログ is a blog. パソコン is a personal computer and スマホ is a smartphone.', [
 ...lines([[565,'a letter'],[436,'a blog post'],[439,'a diary entry'],[653,'an email']], [['$ を 43~書きます~かきます','I write $.'],['$ を 42~読みます~よみます','I read $.']]),
 ['651 で 653 を 43~書きます~かきます','I write an email on a computer.'],['651 を 105~使います~つかいます','I use a computer.'],['656 で 653 を 42~読みます~よみます','I read an email on a smartphone.'],['656 を 105~使います~つかいます','I use a smartphone.'],['652 を 105~使います~つかいます','I use the internet.'],['652 で 6 を 171~勉強します~べんきょうします','I study Japanese on the internet.']]);

topic('health', 'Health and the body', 'Describe discomfort and handle a simple medical visit.');
lesson('feeling-well', 'How you feel', [279,280,283,284,100,534], 'Nが痛いです / Nは元気です', 'が can mark the body part that hurts. 元気 means well or energetic; 大丈夫 means okay. 病気 is illness, while 風邪 is a cold. They are nouns, so use です.', [
 ['279 が 283 です','My body hurts.'],['279 が 283 です か','Does your body hurt?'],['279 は 100 です','My body is okay.'],['1 は 284 です','I am well.'],['4 は 284 です か','Is the teacher well?'],['71 は 280 です','My friend is ill.'],['1 は 280 です','I am ill.'],['1 は 534 です','I have a cold.'],['71 は 534 です','My friend has a cold.'],['100 です か','Are you okay?'],['1 は 100 です','I am okay.']]);
lesson("body-parts", "Your head and face", [270, 271, 272, 273, 274], "頭 が 痛い です", "Name the body part before が痛いです to say where it hurts. Japanese usually leaves out “my” when describing your own symptoms. The questions with 大丈夫ですか check on a body part, for example after a bump or injury.", [
 ["270 が 283 です", "My head hurts."],
 ["271 が 283 です", "My face hurts."],
 ["272 が 283 です", "My eye hurts."],
 ["273 が 283 です", "My ear hurts."],
 ["274 が 283 です", "My nose hurts."],
 ["270 は 100 です か", "Is your head okay?"],
 ["271 は 100 です か", "Is your face okay?"],
 ["272 は 100 です か", "Is your eye okay?"],
 ["273 は 100 です か", "Is your ear okay?"],
 ["274 は 100 です か", "Is your nose okay?"]
]);
lesson("body-more", "Other places that hurt", [275, 276, 277, 278, 532], "Nが痛いです / Nは大丈夫ですか", "Keep the same symptom and checking patterns. Add mouth, tooth, hand, foot and stomach. 足 can mean foot or leg; context tells you which.", [
 ["275 が 283 です", "My mouth hurts."],
 ["276 が 283 です", "My tooth hurts."],
 ["277 が 283 です", "My hand hurts."],
 ["278 が 283 です", "My foot hurts."],
 ["532 が 283 です", "My stomach hurts."],
 ["275 は 100 です か", "Is your mouth okay?"],
 ["276 は 100 です か", "Is your tooth okay?"],
 ["277 は 100 です か", "Is your hand okay?"],
 ["278 は 100 です か", "Is your foot okay?"],
 ["532 は 100 です か", "Is your stomach okay?"]
]);

lesson('medical-care', 'Getting medical care', [138,281,282,696,697], 'NのN / Nをください', '医者 is a doctor, 歯医者 a dentist, and 薬局 a pharmacy. 薬をください asks for medicine. A pharmacist or doctor needs more information about symptoms; these cards practice a simple opening request.', [
 ['138 の 282 です','I am a doctor at the hospital.'],['138 の 282 です か','Are you a doctor at the hospital?'],['1 は 282 です','I am a doctor.'],['281 を ください','Please give me medicine.'],['534 の 281 を ください','Please give me medicine for a cold.'],['23 は 696 です','This is a pharmacy.'],['696 の 281 です','This is medicine from the pharmacy.'],['1 は 697 です','I am a dentist.'],['697 です か','Are you a dentist?']]);
lesson('rest', 'Resting and recovering', [118,369,604,535], 'Vました / Nで休みます', '疲れました means “I am tired”, literally “became tired”. 眠い means sleepy. 休みます means rest or take time off. 丈夫 can describe a healthy, robust body; it does not mean exactly the same as 大丈夫.', [
 ['1 は 369~疲れました~つかれました','I am tired.'],['71 は 369~疲れました~つかれました','My friend is tired.'],['1 は 604 です','I am sleepy.'],['71 は 604 です','My friend is sleepy.'],['1 は 118~休みます~やすみます','I will rest.'],['71 も 118~休みます~やすみます','My friend will rest too.'],['1 の 279 は 535 です','I have a strong, healthy body.'],['535 な 279 です','It is a healthy body.']]);
