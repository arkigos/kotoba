export function authorLanguageDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 1900:'context; surrounding text',835:'phrase; verse',540:'explanatory note; annotation',
 2331:'to abbreviate; to shorten',734:'omission; abbreviation',1118:'to omit; to leave out',
 722:'question; query',737:'to ask; to question',2023:'questions and answers; dialogue',
 962:'to spread; to popularize',1043:'to spread; to become widespread',
 180:'creation',723:'association of ideas',923:'to think of; to hit upon an idea',
 843:'sumi ink; an ink stick',516:'decoration; ornament',482:'to shine; to sparkle',
 347:'distinctive; unique',1748:'elegant; refined',
 488:'title; subject; theme',836:'title of a work',751:'critique; review; commentary',1680:'critical essay; criticism',1247:'most; the greater part',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('language');
lesson('context-phrases-and-notes','Context, phrases and notes',[1900,835,540], '文脈 / 句 / 注', '文脈 is the surrounding text that helps you understand a word or passage. 句 can be a phrase or a verse. 注 here is a written note explaining something in the main text.', [
 ['284 の @意味 を 1900 から @考える~考えました~かんがえました','I considered the word’s meaning in context.'],
 ['@この @言葉 は 1900 で @意味 が @変わる~変わります~かわります','The meaning of this word changes with the context.'],
 ['@前 と @後 の @文 を @読む~読んで~よんで 1900 を @確認 @する~しました~しました','I read the preceding and following sentences to check the context.'],
 ['@短い 835 を @声 に @出す~出して~だして @読む~読みました~よみました','I read the short phrase aloud.'],
 ['@この 835 の @意味 を @先生 に @聞く~聞きました~ききました','I asked the teacher what this phrase meant.'],
 ['@覚える~覚えたい~おぼえたい 835 を @ノート に @書く~書きました~かきました','I wrote the phrase I wanted to remember in my notebook.'],
 ['@ページ の @下 に 540 が @ある~あります~あります','There is an explanatory note at the bottom of the page.'],
 ['540 を @読む~読んで~よんで @言葉 の @意味 が @わかる~わかりました~わかりました','I understood the word’s meaning after reading the note.'],
 ['@難しい @言葉 に 540 を @つける~付けました~つけました','I added an explanatory note to the difficult word.'],
]);
lesson('shortening-and-leaving-out','Shortening and leaving things out',[2331,734,1118], '略します / 省略します / 省きます', '略す often shortens a name or expression. 省略 and 省く can leave out information or a step. Check what remains: a shorter expression still needs to convey the intended meaning.', [
 ['@長い @名前 を 2331~略して~りゃくして @書く~書きました~かきました','I abbreviated the long name when writing it.'],
 ['@この @言葉 は 2331~略さないで~りゃくさないで ください','Please do not abbreviate this expression.'],
 ['@会社 の @名前 を 2331~略す~りゃくす @前 に @確認 @する~しました~しました','I checked before abbreviating the company’s name.'],
 ['@時間 が @ある~ない~ない から @説明 を 734 @する~します~します','I will leave out the explanation because there is no time.'],
 ['@同じ @意味 の @言葉 を 734 @する~しました~しました','I omitted words with the same meaning.'],
 ['734 @する~した~した @部分 を @後 で @読む~読みました~よみました','I read the omitted part later.'],
 ['@長い @説明 を 1118~省いて~はぶいて @答え を @書く~書きました~かきました','I left out the long explanation and wrote the answer.'],
 ['@大切 な @情報 は 1118~省きません~はぶきません','I will not leave out important information.'],
 ['1118~省いた~はぶいた @言葉 を @もう一度 @入れる~入れました~いれました','I put the omitted words back in.'],
]);
lesson('questions-and-dialogue','Questions and dialogue',[722,737,2023], '問い / 問います / 問答', '問い is a question, often one being considered in writing or discussion. 問う is a formal way to ask or question. 問答 is an exchange of questions and answers.', [
 ['@この 722 に @答える~答えて~こたえて ください','Please answer this question.'],
 ['722 を @読む~読んで~よんで から @文章 を @読む~読みました~よみました','I read the question before reading the passage.'],
 ['@新しい 722 を @考える~考えました~かんがえました','I thought of a new question.'],
 ['@先生 は @その @言葉 の @意味 を 737~問いました~といました','The teacher asked what the word meant.'],
 ['@本 の @中 で @生きる @意味 を 737~問う~とう @人 が @いる~います~います','There is a person in the book who questions the meaning of life.'],
 ['@理由 を 737~問われて~とわれて @少し @考える~考えました~かんがえました','When asked the reason, I thought for a moment.'],
 ['@先生 と @学生 の 2023 を @読む~読みました~よみました','I read the questions and answers between the teacher and the student.'],
 ['2023 の @形 で @説明 が @書く~書かれています~かかれています','The explanation is written in a question-and-answer format.'],
 ['@短い 2023 を @二人 で @練習 @する~しました~しました','The two of us practiced a short question-and-answer exchange.'],
]);
lesson('words-that-spread','Words that spread',[962,1043], '広めます / 広まります', '広める describes someone spreading something. 広まる describes it becoming widespread. Here the things spreading are words, stories and knowledge.', [
 ['@新しい @言葉 を 962~広めました~ひろめました','We popularized a new expression.'],
 ['@本 を @書く~書いて~かいて @知識 を 962~広めます~ひろめます','We spread knowledge by writing books.'],
 ['@友達 に @話す~話して~はなして @この @物語 を 962~広めたい~ひろめたい です','I want to spread this story by telling friends about it.'],
 ['@新しい @言葉 が 1043~広まっています~ひろまっています','The new expression is becoming widespread.'],
 ['@その @話 は @学校 で 1043~広まりました~ひろまりました','That story spread at school.'],
 ['@若い @人 の @間 で 1043~広まった~ひろまった @言葉 を @調べる~調べました~しらべました','I investigated an expression that had spread among young people.'],
]);
lesson('reading-a-short-exchange-account','Reading a short exchange',[], 'Understanding what the words leave unsaid', 'Follow students reading an exchange and checking its wording.', [
 ['@先生 と @学生 の @短い 2023 を @読む~読みました~よみました','We read a short exchange between a teacher and a student.'],
 ['@学生 の 722 に は @短い 835 が @ある~ありました~ありました','There was a short phrase in the student’s question.'],
 ['@その 835 の @意味 を 1900 から @考える~考えました~かんがえました','We considered the phrase’s meaning from its context.'],
 ['@ページ の 540 に @名前 を 2331~略した~りゃくした @理由 が @書く~書かれていました~かかれていました','A note on the page explained why the name had been abbreviated.'],
 ['734 @する~された~された @言葉 を @入れる~入れて~いれて @文 を @読む~読みました~よみました','We put the omitted words back in and read the sentence.'],
]);
useTopic('art');
lesson('creation-and-association','Creation and association',[180,723,923], '創造 / 連想します / 思いつきます', '創造 is bringing something new into being. 連想 connects one idea with another. 思いつく describes an idea coming to mind, rather than a long process of thinking it through.', [
 ['@新しい @芸術 の 180 について @話す~話しました~はなしました','We talked about creating new art.'],
 ['@物語 の 180 に @時間 を @使う~使いました~つかいました','I spent time creating a story.'],
 ['@子供 に 180 の @楽しみ を @伝える~伝えました~つたえました','I told the children about the joy of creation.'],
 ['@青い @色 から @海 を 723 @する~しました~しました','The blue color made me think of the sea.'],
 ['@この @音 から @雨 を 723 @する~します~します','This sound brings rain to mind.'],
 ['@絵 を @見る~見て~みて 723 @する~した~した @言葉 を @書く~書きました~かきました','I wrote the words that came to mind when I looked at the picture.'],
 ['@新しい @物語 を 923~思いつきました~おもいつきました','I thought of a new story.'],
 ['@歩く~歩いている~あるいている @時 に @いい @方法 を 923~思いつきました~おもいつきました','I thought of a good method while walking.'],
 ['923~思いついた~おもいついた @こと を @ノート に @書く~書きました~かきました','I wrote the idea that came to mind in my notebook.'],
]);
lesson('details-in-an-art-display','Describing a work on display',[843,516,482,347,1748], '墨 / 飾り / 輝きます / 独特 / 上品', '墨 is the ink used in calligraphy and ink painting. 飾り is an ornament or decoration. 輝く describes shining or sparkling. 独特 points to a distinctive quality; 上品 describes an elegant or refined impression.', [
 ['843 で @山 の @絵 を @描く~描きました~かきました','I painted a mountain in sumi ink.'],
 ['586 に 843 を @つける~付けました~つけました','I put sumi ink on the brush.'],
 ['843 の @色 は @水 の @量 で @変わる~変わります~かわります','The color of the ink changes with the amount of water.'],
 ['@木 の 516 を @壁 に @かける~掛けました~かけました','I hung a wooden ornament on the wall.'],
 ['@この 516 は @手 で @作る~作りました~つくりました','I made this ornament by hand.'],
 ['@小さい 516 を @絵 の @横 に @置く~置きました~おきました','I placed a small ornament beside the picture.'],
 ['@光 の @中 で 516 が 482~輝いています~かがやいています','The ornament is shining in the light.'],
 ['@窓 から @入る @光 で @水 が 482~輝きました~かがやきました','The water sparkled in the light coming through the window.'],
 ['@星 の @よう に 482~輝く~かがやく 516 を @見る~見ました~みました','I saw an ornament sparkling like a star.'],
 ['@この @絵 に は 347 な @雰囲気 が @ある~あります~あります','This picture has a distinctive atmosphere.'],
 ['@その @人 は 347 な @色 を @使う~使います~つかいます','That person uses distinctive colors.'],
 ['@その @人 は 347 な @形 の 516 を @作る~作ります~つくります','That person makes ornaments with distinctive shapes.'],
 ['@この @絵 の @色 は 1748 です','The colors in this picture are elegant.'],
 ['1748 な 516 を @選ぶ~選びました~えらびました','I chose an elegant ornament.'],
 ['1748 な @雰囲気 の @部屋 に @絵 を @置く~置きました~おきました','I placed the picture in a room with a refined atmosphere.'],
]);
lesson('making-an-ink-picture-account','Making an ink picture',[], 'An idea becomes a picture', 'Follow a student making an ink picture and choosing where to display it.', [
 ['@雨 の @音 から @山 を 723 @する~しました~しました','The sound of rain brought mountains to mind.'],
 ['@山 の @絵 を @描く @方法 を 923~思いつきました~おもいつきました','I thought of a way to paint the mountains.'],
 ['586 に 843 を @つける~付けて~つけて @紙 に @描く~描きました~かきました','I put ink on the brush and painted on the paper.'],
 ['@紙 に @描く~描いた~かいた @山 は 347 な @形 です','The mountains I painted on the paper have distinctive shapes.'],
 ['@絵 の @横 に 1748 な 516 を @置く~置きました~おきました','I placed an elegant ornament beside the picture.'],
]);
useTopic('reading');
lesson('titles-and-subjects','Titles and subjects',[488,836], '題 / 題名', '題 can be a title or a subject to write about. 題名 is the title of a work. The surrounding words distinguish a chosen subject from the name printed on a book or picture.', [
 ['@作文 の 488 は @私 の @町 です','The subject of the composition is “My Town.”'],
 ['@この @絵 に 488 を @つける~付けました~つけました','I gave this picture a title.'],
 ['@先生 が @決める~決めた~きめた 488 で @作文 を @書く~書きました~かきました','I wrote a composition on the subject the teacher had chosen.'],
 ['@本 の 836 を @ノート に @書く~書きました~かきました','I wrote the book’s title in my notebook.'],
 ['836 を @見る~見て~みて @この @本 を @選ぶ~選びました~えらびました','I chose this book after seeing its title.'],
 ['@物語 の 836 を @もう一度 @考える~考えました~かんがえました','I thought again about the story’s title.'],
]);
lesson('reviews-and-the-whole-work','Reviews and the whole work',[751,1680,1247], '批評 / 評論 / 大部分', '批評 is a review or assessment, which can include praise as well as criticism. 評論 often develops that discussion into an essay. 大部分 means most or the greater part.', [
 ['@本 の 751 を @雑誌 で @読む~読みました~よみました','I read a review of the book in a magazine.'],
 ['@友達 は @私 の @絵 を 751 @する~しました~しました','My friend reviewed my picture.'],
 ['751 を @聞く~聞いて~きいて @文章 を @直す~直しました~なおしました','I revised the writing after hearing the critique.'],
 ['@芸術 について の 1680 を @読む~読みました~よみました','I read a critical essay about art.'],
 ['@この 1680 は @短い です が @内容 は @深い です','This critical essay is short, but its content is profound.'],
 ['1680 の @中 で @二つ の @作品 を @比べる~比べています~くらべています','The critical essay compares two works.'],
 ['@本 の 1247 を @読む~読みました~よみました','I read most of the book.'],
 ['@参加 @する~した~した @人 の 1247 が @学生 でした','Most of the participants were students.'],
 ['@時間 の 1247 は @本 を @読む~読んでいました~よんでいました','I spent most of the time reading.'],
]);
lesson('writing-a-book-review-account','Writing a book review',[], 'Reading, responding and revising', 'Follow a reader preparing and revising a review of a book.', [
 ['836 に @興味 を @持つ~持って~もって @本 を @借りる~借りました~かりました','I became interested in the title and borrowed the book.'],
 ['@本 の 1247 は @短い @話 でした','Most of the book consisted of short stories.'],
 ['@最後 まで @読む~読んで~よんで から 751 を @書く~書きました~かきました','I read to the end before writing a review.'],
 ['@難しい 835 は 1900 と 540 を @確認 @する~しました~しました','For the difficult phrases, I checked the context and the notes.'],
 ['@友達 が @私 の 751 を @読む~読んで~よんで @意見 を @言う~言いました~いいました','My friend read my review and gave an opinion.'],
 ['@大切 な @説明 を @入れる~入れて~いれて @短い @文章 に @する~しました~しました','I included the important explanations in a short piece of writing.'],
]);
}
