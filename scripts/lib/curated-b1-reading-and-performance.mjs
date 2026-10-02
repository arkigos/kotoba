export function authorReadingAndPerformance({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@テーマ':'theme; subject','B1@シリーズ':'series','B1@パターン':'pattern',
 'B1@用語':'term; terminology','B1@記号':'symbol; sign','B1@かっこ':'brackets; parentheses',
 'B1@形式':'form; format','B1@モデル':'model; subject or inspiration for a work',
 'B1@サンプル':'sample','B1@実物':'the actual object; the real thing',
 'B1@要旨':'main points; summary','B1@空想':'fantasy; imagining things',
 'B1@例える':'to compare something to; to liken',
 'B1@皮肉':'sarcasm; irony','B1@洒落':'wordplay; pun; joke',
 'B1@特色':'distinctive feature','B1@一流':'first-rate; leading',
 'B1@功績':'achievement; contribution','B1@弟子':'apprentice; pupil of a master',
 'B1@稽古':'practice; training in an art','B1@コンクール':'competition; contest',
 'B1@ポスター':'poster','B1@スライド':'presentation slide','B1@催し':'event; gathering',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('reading');
lesson('themes-series-patterns','Themes, series and patterns',['B1@テーマ','B1@シリーズ','B1@パターン'],
 'テーマ / シリーズ / パターン',
 'テーマ is a subject or theme. シリーズ groups related works into a series. パターン is a recurring arrangement or way something develops.',[
 ['@この @小説 の B1@テーマ は @家族 です','The theme of this novel is family.'],
 ['@同じ B1@テーマ の @映画 を @二つ @見る~見ました~みました','I watched two films on the same theme.'],
 ['@作品 の B1@テーマ について @友達 と @話す~話しました~はなしました','I talked with a friend about the work’s theme.'],
 ['@この B1@シリーズ の @最初 の @本 を @読む~読みました~よみました','I read the first book in this series.'],
 ['@子供 の @時 から @好き な B1@シリーズ です','It is a series I have liked since childhood.'],
 ['@図書館 で B1@シリーズ の @続き を @借りる~借りました~かりました','I borrowed the next part of the series from the library.'],
 ['@彼 の @話 は @いつも @同じ B1@パターン です','His stories always follow the same pattern.'],
 ['B1@パターン を @変える~変えて~かえて @新しい @作品 を @作る~作りました~つくりました','I changed the pattern to make a new work.'],
 ['@三つ の @絵 の B1@パターン を @比べる~比べました~くらべました','I compared the patterns in three pictures.'],
]);
lesson('terms-symbols-and-brackets','Terms, symbols and brackets',['B1@用語','B1@記号','B1@かっこ'],
 '用語 / 記号 / かっこ',
 '用語 (yōgo) is a term used in a field or activity. 記号 (kigō) is a symbol. かっこ (kakko) encloses text, as in parentheses or brackets.',[
 ['@音楽 の B1@用語 を @辞典 で @調べる~調べました~しらべました','I looked up a musical term in a dictionary.'],
 ['@この B1@用語 を @簡単 な @言葉 で @説明 @する~してください~してください','Please explain this term in simple words.'],
 ['@この B1@用語 は @絵 の @説明 に @よく @出る~出ます~でます','This term often appears in descriptions of paintings.'],
 ['@地図 の B1@記号 の @意味 を @確認 @する~しました~しました','I checked the meanings of the symbols on the map.'],
 ['@音楽 の @本 に @新しい B1@記号 が @出る~出てきました~でてきました','A new symbol appeared in the music book.'],
 ['@同じ B1@記号 を @ノート に @書く~書きました~かきました','I wrote the same symbol in my notebook.'],
 ['B1@かっこ の @中 に @名前 を @書く~書いてください~かいてください','Please write your name inside the brackets.'],
 ['@言葉 の @後 に B1@かっこ で @意味 を @書く~書きました~かきました','I wrote the meaning in parentheses after the word.'],
 ['@読む @時 は B1@かっこ の @中 も @見る~見てください~みてください','When reading, please look at the text in parentheses too.'],
]);
lesson('format-and-main-points','Format and main points',['B1@形式','B1@要旨'],
 '形式 / 要旨',
 '形式 (keishiki) is the form or format of a work. 要旨 (yōshi) gives its main points, leaving out the smaller details.',[
 ['@この @作品 は @手紙 の B1@形式 で @書く~書かれています~かかれています','This work is written in the form of letters.'],
 ['@同じ @内容 を @別 の B1@形式 で @書く~書きました~かきました','I wrote the same content in a different format.'],
 ['@発表 の B1@形式 を @先生 と @相談 @する~しました~しました','I discussed the presentation format with the teacher.'],
 ['@文章 の B1@要旨 を @短い @言葉 で @書く~書いてください~かいてください','Please write the main points of the text briefly.'],
 ['@最初 に B1@要旨 を @読む~読んで~よんで @内容 を @確認 @する~しました~しました','I read the summary first to check the content.'],
 ['@先生 に B1@要旨 を @読む~読んでもらいました~よんでもらいました','I had the teacher read my summary.'],
 ['@友達 に B1@要旨 を @説明 @する~してもらいました~してもらいました','I had a friend explain the main points to me.'],
]);
lesson('book-discussion-account','Preparing to discuss a book',[],
 'シリーズ / テーマ / 用語 / 要旨',
 'Follow a reader’s preparation for a discussion of a book.',[
 ['@図書館 で @好き な B1@シリーズ の @本 を @借りる~借りました~かりました','I borrowed a book from a favourite series at the library.'],
 ['@この @本 の B1@テーマ は @町 の @歴史 です','The theme of this book is the history of a town.'],
 ['@知る~知らない~しらない B1@用語 を @ノート に @書く~書きました~かきました','I wrote unfamiliar terms in my notebook.'],
 ['@意味 は @言葉 の @後 の B1@かっこ に @書く~書きました~かきました','I wrote the meanings in parentheses after the words.'],
 ['@最後 に @自分 の @言葉 で B1@要旨 を @書く~書きました~かきました','Finally, I wrote the main points in my own words.'],
 ['B1@要旨 を @見せる~見せながら~みせながら @友達 と @本 について @話す~話しました~はなしました','I showed my summary as I discussed the book with a friend.'],
]);
lesson('models-samples-real-things','Models, samples and the real thing',['B1@モデル','B1@サンプル','B1@実物'],
 'モデル / サンプル / 実物',
 'モデル can be a person who poses for an artist or the inspiration for a character. サンプル is a sample. 実物 (jitsubutsu) is the actual object, rather than its picture or a copy.',[
 ['@友達 に @絵 の B1@モデル に @なる~なってもらいました~なってもらいました','I asked a friend to model for a picture.'],
 ['@この @小説 の @先生 の B1@モデル は @私 の @父 です','My father was the inspiration for the teacher in this novel.'],
 ['B1@画家 は B1@モデル の @顔 を @よく @見る~見ています~みています','The painter is looking closely at the model’s face.'],
 ['@色 の B1@サンプル を @見せる~見せてください~みせてください','Please show me the colour samples.'],
 ['@紙 の B1@サンプル を @二つ @比べる~比べました~くらべました','I compared two paper samples.'],
 ['B1@サンプル と @同じ @色 を @選ぶ~選びました~えらびました','I chose the same colour as the sample.'],
 ['@写真 で @見る~見た~みた @作品 の B1@実物 を @見る~見ました~みました','I saw the actual work that I had seen in a photograph.'],
 ['B1@実物 は @写真 より @大きい~大きかった~おおきかった です','The real thing was bigger than it looked in the photograph.'],
 ['@美術館 で B1@実物 を @近く から @見る~見ることができます~みることができます','You can see the actual object up close at the museum.'],
]);
lesson('imagining-and-comparing','Imagining and making comparisons',['B1@空想','B1@例える'],
 '空想します / AをBに例えます',
 '空想 (kūsō) imagines things beyond the present reality. 例える (tatoeru) likens one thing to another: the thing being described comes before を, and the comparison comes before に.',[
 ['@子供 の @時 は @空 を @飛ぶ @こと を @よく B1@空想 @する~しました~しました','As a child, I often imagined flying through the sky.'],
 ['@この @物語 は B1@空想 の @世界 の @話 です','This story takes place in an imaginary world.'],
 ['B1@空想 @する~した~した @町 を @絵 に @描く~描きました~えがきました','I drew a town that I had imagined.'],
 ['@雲 を @白い @動物 に B1@例える~例えました~たとえました','I compared the clouds to white animals.'],
 ['@作家 は @人生 を @旅 に B1@例える~例えています~たとえています','The author likens life to a journey.'],
 ['@この @音 を @何 に B1@例える~例えます~たとえます か','What would you compare this sound to?'],
 ['@友達 は @私 の @絵 を @夢 に B1@例える~例えました~たとえました','My friend compared my picture to a dream.'],
]);
lesson('irony-and-wordplay','Irony and wordplay',['B1@皮肉','B1@洒落'],
 '皮肉 / 洒落',
 '皮肉 (hiniku) can mean sarcasm or an ironic contrast. 洒落 (share) can be wordplay or a pun. In this sense, it concerns the play on words, not stylish clothing.',[
 ['@その @言葉 は B1@皮肉 です か','Was that remark sarcastic?'],
 ['@この @小説 に は B1@皮肉 が @多い です','There is a lot of irony in this novel.'],
 ['@友達 は B1@皮肉 を @言う~言った~いった @後 で @笑う~笑いました~わらいました','My friend laughed after making a sarcastic remark.'],
 ['@父 の B1@洒落 を @聞く~聞いて~きいて @笑う~笑いました~わらいました','I laughed at my father’s pun.'],
 ['@この B1@洒落 は @同じ @音 の @言葉 を @使う~使っています~つかっています','This pun uses words that sound the same.'],
 ['@日本語 の B1@洒落 の @意味 を @友達 に @聞く~聞きました~ききました','I asked a friend what the Japanese pun meant.'],
]);
lesson('features-and-achievements','Distinctive features and achievements',['B1@特色','B1@一流','B1@功績'],
 '特色 / 一流の画家 / 功績',
 '特色 (tokushoku) is a feature that gives something its particular character. 一流 (ichiryū) means first-rate or leading. 功績 (kōseki) is a significant achievement or contribution.',[
 ['@明るい @色 が @この @作品 の B1@特色 です','Bright colours are a distinctive feature of this work.'],
 ['@二つ の @作品 の B1@特色 を @比べる~比べました~くらべました','I compared the distinctive features of two works.'],
 ['@この @音楽 の B1@特色 を @説明 @する~してください~してください','Please explain the distinctive features of this music.'],
 ['@彼 は B1@一流 の B1@画家 です','He is a first-rate painter.'],
 ['B1@一流 の @演奏 を @近く で @聞く~聞きました~ききました','I heard a first-rate performance from close by.'],
 ['B1@一流 の @作家 の @作品 を @集める~集めています~あつめています','I collect works by leading authors.'],
 ['@この @作家 の B1@功績 について @読む~読みました~よみました','I read about this author’s achievements.'],
 ['@町 の @文化 を @守る~守った~まもった B1@功績 は @大きい です','Their contribution to preserving the town’s culture is significant.'],
 ['@先生 の B1@功績 を @紹介 @する~する~する @本 です','It is a book introducing the teacher’s achievements.'],
]);
lesson('apprentices-and-practice','Apprentices, practice and competitions',['B1@弟子','B1@稽古','B1@コンクール'],
 '弟子 / 稽古 / コンクール',
 '弟子 (deshi) learns under a particular master or teacher. 稽古 (keiko) is practice in an art or skill. コンクール is a competition, often in music or another art.',[
 ['@有名 な B1@画家 の B1@弟子 に @なる~なりました~なりました','I became a pupil of a famous painter.'],
 ['B1@弟子 は @先生 の @絵 を @よく @見る~見ています~みています','The pupil is studying the teacher’s painting closely.'],
 ['@先生 は B1@弟子 に @新しい @技術 を @教える~教えました~おしえました','The teacher taught the pupil a new technique.'],
 ['@毎週 @土曜日 に @踊り の B1@稽古 が @ある~あります~あります','There is dance practice every Saturday.'],
 ['@舞台 に @出る @前 に B1@稽古 を @する~しました~しました','We rehearsed before going on stage.'],
 ['B1@稽古 の @後 で @先生 と @話す~話しました~はなしました','I talked with the teacher after practice.'],
 ['@音楽 の B1@コンクール に @出る~出ます~でます','I will enter a music competition.'],
 ['B1@コンクール の ために @毎日 @練習 @する~しています~しています','I am practicing every day for the competition.'],
 ['B1@コンクール で @友達 の @演奏 を @聞く~聞きました~ききました','I heard my friend perform at the competition.'],
]);
lesson('posters-slides-events','Posters, slides and events',['B1@ポスター','B1@スライド','B1@催し'],
 'ポスター / スライド / 催し',
 'ポスター advertises or displays information. スライド is one page of a projected or digital presentation. 催し (moyooshi) is an organized event.',[
 ['@展覧会 の B1@ポスター を @作る~作りました~つくりました','I made a poster for the exhibition.'],
 ['@駅 で @映画 の B1@ポスター を @見る~見ました~みました','I saw a film poster at the station.'],
 ['B1@ポスター に @大きい @字 で @時間 を @書く~書きました~かきました','I wrote the time in large characters on the poster.'],
 ['@発表 の B1@スライド に @絵 を @入れる~入れました~いれました','I put a picture into a presentation slide.'],
 ['@次 の B1@スライド を @見せる~見せてください~みせてください','Please show the next slide.'],
 ['B1@スライド の @字 が @小さい から @読む~読みにくい~よみにくい です','The slide is hard to read because the letters are small.'],
 ['@図書館 で @子供 の @ため の B1@催し が @ある~あります~あります','There is an event for children at the library.'],
 ['@週末 の B1@催し に @家族 と @行く~行きました~いきました','I went to the weekend event with my family.'],
 ['B1@催し の @時間 を B1@ポスター で @確認 @する~しました~しました','I checked the event time on the poster.'],
]);
lesson('arts-event-account','An afternoon at an arts event',[],
 '催し / ポスター / スライド / モデル / 実物',
 'Follow a visitor through a short presentation and an exhibition.',[
 ['@図書館 の B1@ポスター で @美術館 の B1@催し を @知る~知りました~しりました','I learned about an event at the art museum from a poster in the library.'],
 ['@最初 に @先生 が B1@スライド で @作品 を @紹介 @する~しました~しました','First, a teacher introduced the works using slides.'],
 ['@先生 は @作品 の B1@テーマ と B1@特色 を @説明 @する~しました~しました','The teacher explained the works’ themes and distinctive features.'],
 ['@絵 の B1@モデル は @近く の @村 の @人 です','The model for the picture is a person from a nearby village.'],
 ['@説明 の @後 で @作品 の B1@実物 を @見る~見ました~みました','After the explanation, I saw the actual works.'],
 ['@帰る @前 に @好き な @作品 の B1@ポスター を @買う~買いました~かいました','Before leaving, I bought a poster of a work I liked.'],
]);
lesson('competition-day-account','A day at a music competition',[],
 'コンクール / 稽古 / 弟子 / 一流',
 'Follow a pupil from practice to a performance.',[
 ['@朝 は @先生 の @家 で B1@稽古 を @する~しました~しました','In the morning, we practiced at the teacher’s house.'],
 ['@午後 は @先生 と B1@コンクール に @行く~行きました~いきました','In the afternoon, I went to the competition with the teacher.'],
 ['@先生 の @別 の B1@弟子 も @出る~出ました~でました','Another pupil of the teacher also took part.'],
 ['@自分 の @演奏 が @終わる~終わって~おわって から @他 の @人 の @演奏 を @聞く~聞きました~ききました','After my own performance, I listened to the other people perform.'],
 ['B1@一流 の @演奏 を @聞く~聞いて~きいて @もっと @練習 @する~したい~したい と @思う~思いました~おもいました','Hearing a first-rate performance made me want to practice more.'],
 ['@帰り に @先生 と @次 の B1@稽古 について @話す~話しました~はなしました','On the way home, I talked with the teacher about our next practice.'],
]);
}
