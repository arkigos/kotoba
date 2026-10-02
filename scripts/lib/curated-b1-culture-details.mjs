export function authorCultureDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 1205:'particle (grammar)',2471:'honorific and polite language',2493:'kana showing how kanji are read',
 503:'to express; to represent',2452:'to divide into sections; to insert pauses',628:'in short; to sum up',
 600:'koto (Japanese stringed instrument)',955:'to ring; to sound',1598:'sound; resonance',
 62:'scene; situation in a story or event',548:'play; drama',444:'tragedy; tragic drama',1341:'performing arts; entertainment',2960:'show; performance',
 1378:'creative work; creating an original work',1400:'creator; author; artist of a work',1476:'idea; way of thinking',2258:'to be finished; to be completed',
 1050:'study; room for reading or working',1114:'to turn a page; to leaf through',
 1764:'short story; short work',1916:'children’s story; fairy tale',1921:'haiku',2467:'essay; literary reflections',
 2228:'biography; life story',2417:'to recount; to tell a story',
 2097:'print; printed words',1008:'to appear in print; to be included in a publication',2789:'reading; consulting material; browsing',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('language');
lesson('reading-aids-and-register','Reading aids and polite language',[1205,2471,2493], '助詞 / 敬語 / ふりがな', '助詞 is the Japanese label for a particle such as は or を. 敬語 refers to language that expresses politeness or respect. ふりがな gives a kanji’s reading in kana; it does not explain the meaning.', [
 ['@この @文 の 1205 を @確認 @する~しましょう~しましょう','Let’s check the particles in this sentence.'],
 ['@文 の 1205 について @辞書 で @調べる~調べました~しらべました','I looked up the particle in the sentence in a dictionary.'],
 ['1205 を @変える~変えて~かえて @文 を @書く~書きました~かきました','I changed the particle and wrote a sentence.'],
 ['2471 を @使う~使って~つかって @先生 に @質問 @する~しました~しました','I used polite language to ask my teacher a question.'],
 ['@仕事 で @使う 2471 を @練習 @する~しています~しています','I am practicing the polite language I use at work.'],
 ['@この @手紙 の 2471 は @正しい です か','Is the polite language in this letter correct?'],
 ['@難しい @漢字 に 2493 を @つける~つけました~つけました','I added furigana to the difficult kanji.'],
 ['2493 が @ある から @一人 で @読む~読めます~よめます','I can read it on my own because it has furigana.'],
 ['@名前 の 2493 を @見せる~見せて~みせて ください','Please show me the furigana for the name.'],
]);
lesson('expressing-and-summarizing','Expressing and summarizing',[503,2452,628], '表します / 区切ります / 要するに', '表す can mean expressing a feeling or representing an idea. 区切る separates a text or speech into sections or pauses. 要するに signals a summary or the main point.', [
 ['@自分 の @気持ち を @言葉 で 503~表しました~あらわしました','I expressed my feelings in words.'],
 ['@この @色 は @何 を 503~表しています~あらわしています か','What does this color represent?'],
 ['@同じ @考え を @別 の @言葉 で 503~表して~あらわして ください','Please express the same idea in different words.'],
 ['@長い @文 を @短い~短く~みじかく 2452~区切って~くぎって @読む~読みました~よみました','I read the long sentence in short sections.'],
 ['@話 を 2452~区切って~くぎって @相手 の @返事 を @待つ~待ちました~まちました','I paused in my explanation and waited for the other person’s response.'],
 ['@文章 を @三つ に 2452~区切りました~くぎりました','I divided the text into three sections.'],
 ['@値段 も @時間 も @大切 です 。 628 @両方 を @考える @必要 が @ある~あります~あります','Price and time both matter. In short, we need to consider both.'],
 ['@この @説明 は 628 @何 を @伝える~伝えたい~つたえたい の です か','What is the main point of this explanation?'],
 ['628 @私 も @同じ @意見 です','In short, I have the same opinion.'],
]);
lesson('preparing-a-reading-account','Preparing a text to read aloud',[], 'A clear reading', 'Follow a learner checking a text before reading it to other people.', [
 ['@先生 に @見せる @文章 を @書く~書きました~かきました','I wrote a text to show my teacher.'],
 ['@まず @文 の 1205 を @確認 @する~しました~しました','First I checked the particles in the sentences.'],
 ['@読む~読めない~よめない @漢字 に は 2493 を @つける~つけました~つけました','I added furigana to the kanji I could not read.'],
 ['@長い @文 を 2452~区切って~くぎって @声 に @出す~出して~だして @読む~読みました~よみました','I broke the long sentences into sections and read them aloud.'],
 ['@自分 の @考え を @わかる~わかりやすく~わかりやすく 503~表したい~あらわしたい です','I want to express my ideas clearly.'],
]);
useTopic('music');
lesson('strings-and-resonance','Strings and resonance',[600,955,1598], '琴を弾きます / 音を鳴らします / 響き', '琴 here is the Japanese stringed instrument, the koto. 鳴らす means making something sound, unlike 鳴る, which describes the sound occurring. 響き can describe resonance or the distinctive quality of a sound.', [
 ['@祖母 は 600 を @弾く~弾きます~ひきます','My grandmother plays the koto.'],
 ['@初めて 600 の @演奏 を @聞く~聞きました~ききました','I listened to a koto performance for the first time.'],
 ['@母 は 600 を @習う~習っています~ならっています','My mother is learning to play the koto.'],
 ['@ピアノ で @低い @音 を 955~鳴らしました~ならしました','I played a low note on the piano.'],
 ['@子供 が @おもちゃ を 955~鳴らしています~ならしています','The child is making a sound with a toy.'],
 ['271 を @大きい @音 で 955~鳴らさないで~ならさないで ください','Please do not play the instrument loudly.'],
 ['@この 600 の 1598 が @好き です','I like the sound of this koto.'],
 ['@大きい @部屋 で @音 の 1598 を @確認 @する~しました~しました','We checked the resonance of the sound in the large room.'],
 ['@彼女 の @声 に は @美しい 1598 が @ある~あります~あります','Her voice has a beautiful resonance.'],
]);
lesson('listening-to-koto-account','Listening to a koto',[], 'Trying an instrument', 'A visitor listens to an instrument, then tries making a sound.', [
 ['@友人 の @家 で 600 を @見せる~見せて~みせて @もらう~もらいました~もらいました','A friend showed me a koto at their home.'],
 ['@友人 の @演奏 を @近く で @聞く~聞きました~ききました','I listened to my friend playing at close range.'],
 ['@私 も @少し @音 を 955~鳴らしてみました~ならしてみました','I tried making a little sound myself.'],
 ['@静か な @部屋 で 600 の 1598 を @楽しむ~楽しみました~たのしみました','I enjoyed the sound of the koto in the quiet room.'],
]);
useTopic('theatre');
lesson('plays-and-shows','Plays and shows',[548,444,1341,2960,62], '芝居 / 悲劇 / 芸能 / ショー / 場面', '芝居 is a play or drama. 悲劇 can name a tragic drama or a real tragedy; here it describes a work. 芸能 covers entertainment and performing arts. ショー is a show or performance, including one built around music or dance. 場面 is a scene or situation in a story or event.', [
 ['@友達 と @日本 の 548 を @見る~見ました~みました','I watched a Japanese play with a friend.'],
 ['@その 548 に は @知る~知っている~しっている 166 が @出る~出ています~でています','An actor I know of is appearing in that play.'],
 ['@学校 で @短い 548 を @作る~作りました~つくりました','We created a short play at school.'],
 ['@この 548 は 444 です','This play is a tragedy.'],
 ['@授業 で @古い 444 を @読む~読みました~よみました','We read an old tragedy in class.'],
 ['444 の @最後 の 62 が @忘れる~忘れられません~わすれられません','I cannot forget the final scene of the tragedy.'],
 ['@日本 の 1341 に @興味 が @ある~あります~あります','I am interested in Japanese performing arts.'],
 ['@地域 の 1341 を @紹介 @する @番組 を @見る~見ました~みました','I watched a program introducing local performing arts.'],
 ['1341 の @歴史 について @本 を @読む~読みました~よみました','I read a book about the history of the performing arts.'],
 ['@ホテル で @音楽 の 2960 を @見る~見ました~みました','I watched a music show at the hotel.'],
 ['2960 は @夕方 @始まる~始まります~はじまります','The show starts in the evening.'],
 ['2960 の @切符 を @友達 に @上げる~あげました~あげました','I gave my friend a ticket to the show.'],
 ['@最後 の 62 で 2748 が @帰る~帰って~かえって @来る~来ます~きます','In the final scene, the main character comes home.'],
 ['@好き な 62 を @もう一度 @見る~見ました~みました','I watched my favorite scene again.'],
]);
lesson('weekend-performance-account','A weekend performance',[], 'A program of local arts', 'Follow a visit to a performance, from choosing a show to discussing it afterward.', [
 ['@週末 に @地域 の 1341 の 2960 が @ある~ありました~ありました','There was a show of local performing arts at the weekend.'],
 ['1364 に は @音楽 と @短い 548 が @ある~ありました~ありました','The program included music and a short play.'],
 ['@友達 と @切符 を @買う~買って~かって @会場 に @入る~入りました~はいりました','My friend and I bought tickets and entered the venue.'],
 ['548 の @最後 に @皆さん が 634 @する~しました~しました','Everyone applauded at the end of the play.'],
 ['@帰る @時 に @好き な 62 について @話す~話しました~はなしました','On the way home, we talked about the scenes we liked.'],
]);
useTopic('art');
lesson('ideas-and-creators','Creating and finishing a work',[1378,1400,1476,2258], '創作 / 作者 / 発想 / 出来上がります', '創作 is making an original work. 作者 names its creator, whether the work is a painting, a play or a text. 発想 is an idea or an approach to thinking about something. 出来上がる describes the work becoming finished; the finished thing takes が.', [
 ['@毎週 1378 の @時間 を @作る~作っています~つくっています','I make time for creative work every week.'],
 ['@この @話 は @私 の 1378 です','This story is my own creation.'],
 ['@学生 の 1378 @活動 を @紹介 @する~します~します','We introduce the students’ creative activities.'],
 ['@この @絵 の 1400 は @誰 です か','Who is the artist who created this painting?'],
 ['1400 に @作品 の @意味 を @聞く~聞きました~ききました','I asked the creator what the work meant.'],
 ['@作品 の @下 に 1400 の @名前 が @ある~あります~あります','The creator’s name is below the work.'],
 ['@友達 の 1476 は @面白い です','My friend’s idea is interesting.'],
 ['@新しい 1476 で @絵 を @描く~描きました~かきました','I painted a picture using a new idea.'],
 ['@子供 の 1476 から @作品 が @生まれる~生まれました~うまれました','The work grew out of a child’s idea.'],
 ['@新しい @作品 が 2258~出来上がりました~できあがりました','The new work is finished.'],
 ['@絵 が 2258~出来上がる~できあがる まで @見せる~見せません~みせません','I will not show the picture until it is finished.'],
 ['2258~出来上がった~できあがった @作品 を @家族 に @見せる~見せました~みせました','I showed my family the finished work.'],
 ['@この @作品 は @来月 2258~出来上がる~できあがる @予定 です','This work is due to be finished next month.'],
]);
lesson('making-an-original-account','Making an original work',[], 'From an idea to a finished piece', 'Follow an artist choosing an idea, making a work and showing it to someone.', [
 ['@公園 で @見る~見た~みた @色 から @新しい 1476 が @生まれる~生まれました~うまれました','The colors I saw in the park gave me a new idea.'],
 ['@その @色 を @使う~使って~つかって 1378 を @始める~始めました~はじめました','I began creating a work using those colors.'],
 ['@自分 の @気持ち を 503~表す~あらわす @絵 に @する~したい~したい と @思う~思いました~おもいました','I wanted to make it a picture that expressed my feelings.'],
 ['@作品 が 2258~出来上がった~できあがった @後 で @友達 に @見せる~見せました~みせました','After the work was finished, I showed it to a friend.'],
 ['@友達 は @絵 の @色 が @好き だ と @言う~言いました~いいました','My friend said they liked the colors in the picture.'],
]);
useTopic('reading');
lesson('a-place-to-read','A place to read',[1050,1114], '書斎 / ページをめくります', '書斎 is a room used for reading or working at home. めくる means turning a page or leafing through a book; it describes the physical action, not necessarily reading the words.', [
 ['@父 は 1050 で @本 を @読む~読んでいます~よんでいます','My father is reading a book in his study.'],
 ['1050 の @窓 から @庭 が @見える~見えます~みえます','The garden is visible from the study window.'],
 ['1050 に @新しい @本棚 を @置く~置きました~おきました','I put a new bookcase in the study.'],
 ['@次 の @ページ を 1114~めくって~めくって ください','Please turn to the next page.'],
 ['@古い @本 の @ページ を @ゆっくり 1114~めくりました~めくりました','I slowly turned the pages of the old book.'],
 ['@雑誌 を 1114~めくって~めくって @写真 を @見る~見ました~みました','I leafed through a magazine and looked at the photographs.'],
]);
lesson('short-literary-forms','Short literary forms',[1764,1916,1921,2467], '短編 / 童話 / 俳句 / 随筆', '短編 is a short work, often a short story. 童話 is a children’s story or fairy tale. 俳句 names haiku, a form of short Japanese poetry. 随筆 is an essay or literary reflection, often based on the writer’s observations and experiences.', [
 ['@電車 の @中 で 1764 を @読む~読みました~よみました','I read a short story on the train.'],
 ['@この @本 に は @三つ の 1764 が @入る~入っています~はいっています','This book contains three short stories.'],
 ['@初めて 1764 を @書く~書きました~かきました','I wrote a short story for the first time.'],
 ['@寝る @前 に @子供 に 1916 を @読む~読みました~よみました','I read a children’s story to my child before bed.'],
 ['@子供 の @時 に @読む~読んだ~よんだ 1916 を 1444 で @見つける~見つけました~みつけました','I found a children’s story I had read as a child at a bookshop.'],
 ['@この 1916 に は @動物 が @出る~出てきます~でてきます','Animals appear in this children’s story.'],
 ['@秋 の 1921 を @授業 で @読む~読みました~よみました','We read an autumn haiku in class.'],
 ['@庭 の @花 を @見る~見て~みて 1921 を @書く~書きました~かきました','I wrote a haiku after looking at the flowers in the garden.'],
 ['@祖父 が @書く~書いた~かいた 1921 を @覚える~覚えています~おぼえています','I remember the haiku my grandfather wrote.'],
 ['@旅 について の 2467 を @読む~読みました~よみました','I read an essay about travel.'],
 ['@この 2467 の 1922 は @自分 の @家族 について @書く~書いています~かいています','The writer of this essay writes about their own family.'],
 ['@短い 2467 を @雑誌 に @書く~書きました~かきました','I wrote a short essay for a magazine.'],
]);
lesson('lives-and-stories','Lives and stories',[2228,2417], '伝記 / 物語ります', '伝記 tells a person’s life story. 物語る means recounting a story or experience; it can also mean that something reveals or tells us about a situation. Here it is used for recounting events.', [
 ['@有名 な @作家 の 2228 を @読む~読みました~よみました','I read a biography of a famous writer.'],
 ['2228 で @その @作家 の @子供 の @時 の @生活 を @知る~知りました~しりました','I learned about that writer’s childhood in the biography.'],
 ['@図書館 で 418 の 2228 を @探す~探しています~さがしています','I am looking for a singer’s biography at the library.'],
 ['@祖母 は @昔 の @生活 を 2417~物語りました~ものがたりました','My grandmother recounted life in the old days.'],
 ['@彼 は @長い @旅 の @話 を 2417~物語りました~ものがたりました','He recounted the story of his long journey.'],
 ['@この @本 は @日本 の @家族 の @歴史 を 2417~物語っています~ものがたっています','This book tells the history of a Japanese family.'],
]);
lesson('print-and-consultation','Print and consulting sources',[2097,1008,2789], '活字 / 雑誌に載ります / 閲覧します', '活字 can mean printed words or printing type; here it is the print you read. 載る describes something appearing in a publication. 閲覧 means reading or consulting material, and is common in library rules and services.', [
 ['@この @本 は 2097 が @大きい です','The print in this book is large.'],
 ['@細かい 2097 は @読む~読みにくい~よみにくい です','Small print is difficult to read.'],
 ['@自分 の @名前 を 2097 で @見る~見て~みて @嬉しい~嬉しかった~うれしかった です','I was pleased to see my name in print.'],
 ['@私 の 1269 が @雑誌 に 1008~載りました~のりました','My poem appeared in a magazine.'],
 ['@新聞 に @学校 の @写真 が 1008~載っています~のっています','There is a photograph of the school in the newspaper.'],
 ['@この @辞書 に は @その 284 が 1008~載っていません~のっていません','That word is not in this dictionary.'],
 ['@図書館 で @古い @新聞 を 2789 @する~しました~しました','I consulted old newspapers at the library.'],
 ['@この 1808 は @図書館 の @中 で 2789 @できる~できます~できます','These materials can be consulted inside the library.'],
 ['2789 の @時間 を @受付 で @確認 @する~しました~しました','I checked the hours for consulting the materials at reception.'],
]);
lesson('reading-and-writing-account','Reading and writing at home',[], 'An afternoon with books', 'Follow a reader moving from a book to their own writing, then seeing that writing in print.', [
 ['@休日 に 1050 で 2467 を @読む~読みました~よみました','On my day off, I read an essay in my study.'],
 ['@ページ を 1114~めくって~めくって @面白い @言葉 を @探す~探しました~さがしました','I turned the pages and looked for interesting expressions.'],
 ['@その @後 @自分 も @短い 2467 を @書く~書きました~かきました','Afterward, I wrote a short essay of my own.'],
 ['2258~出来上がった~できあがった @文章 を @雑誌 に @送る~送りました~おくりました','I sent the finished piece to a magazine.'],
 ['@私 の 2467 が @雑誌 に 1008~載って~のって @家族 が @喜ぶ~喜びました~よろこびました','My family was pleased when my essay appeared in the magazine.'],
]);
}
