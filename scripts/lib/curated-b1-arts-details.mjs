export function authorArtsDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@オーケストラ':'orchestra','B1@指揮':'conducting; musical direction',
 'B1@笛':'flute; pipe','B1@太鼓':'drum','B1@民謡':'folk song','B1@童謡':'children’s song',
 'B1@マイク':'microphone','B1@スピーカー':'speaker; loudspeaker','B1@カセット':'cassette tape',
 'B1@ゲスト':'guest','B1@習字':'calligraphy; practicing handwriting',
 'B1@生け花':'ikebana; Japanese flower arrangement','B1@扇子':'folding fan',
 'B1@モダン':'modern in style','B1@見事':'splendid; superb',
 'B1@全集':'complete collected works','B1@目次':'table of contents','B1@あらすじ':'plot summary; outline',
 'B1@百科事典':'encyclopedia','B1@下書き':'draft; rough copy','B1@原作':'original work',
 'B1@名作':'great work; masterpiece','B1@傑作':'masterpiece; outstanding work',
 'B1@ジャンル':'genre; category','B1@伝説':'legend; folklore',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('music');
lesson('orchestra-and-conducting','An orchestra and its conductor',['B1@オーケストラ','B1@指揮'],
 'オーケストラ / 指揮します','指揮 here means conducting a musical performance. It also has the broader sense of directing a group.',[
 ['@町 の B1@オーケストラ の @演奏 を @聞く~聞きました~ききました','I listened to the town orchestra’s performance.'],
 ['B1@オーケストラ で B1@バイオリン を @弾く~弾いています~ひいています','I play the violin in an orchestra.'],
 ['B1@オーケストラ が @舞台 に @集まる~集まりました~あつまりました','The orchestra assembled on the stage.'],
 ['@先生 が B1@オーケストラ を B1@指揮 @する~しました~しました','The teacher conducted the orchestra.'],
 ['@私 は B1@指揮 の @練習 を @見る~見ました~みました','I watched conducting practice.'],
 ['B1@指揮 を @する @人 の @手 を @見る~見ながら~みながら @演奏 @する~しました~しました','I played while watching the conductor’s hands.'],
]);
lesson('instruments-and-songs','Drums, flutes and familiar songs',['B1@笛','B1@太鼓','B1@民謡','B1@童謡'],
 '笛を吹きます / 太鼓をたたきます / 民謡 / 童謡','A 笛 is blown; a 太鼓 is struck. 民謡 is a folk song, often linked to a region. 童謡 is a song for children.',[
 ['@子供 が B1@笛 を @吹く~吹いています~ふいています','A child is playing a flute.'],
 ['@木 の B1@笛 を @買う~買いました~かいました','I bought a wooden flute.'],
 ['@遠く から B1@笛 の @音 が @聞こえる~聞こえました~きこえました','I heard the sound of a flute from far away.'],
 ['@祭り で B1@太鼓 を B1@叩く~叩きました~たたきました','I played a drum at the festival.'],
 ['B1@太鼓 の @音 を @聞く~聞きながら~ききながら @踊る~踊りました~おどりました','I danced while listening to the drum.'],
 ['@大きい B1@太鼓 を @二人 で @運ぶ~運びました~はこびました','Two of us carried the large drum.'],
 ['@祖母 は @この @地方 の B1@民謡 を @歌う~歌います~うたいます','My grandmother sings folk songs from this region.'],
 ['@古い B1@民謡 の @言葉 を @調べる~調べました~しらべました','I looked up the words of an old folk song.'],
 ['@祭り で B1@民謡 を @聞く~聞きました~ききました','I heard folk songs at the festival.'],
 ['@子供 と @一緒 に B1@童謡 を @歌う~歌いました~うたいました','I sang children’s songs with the children.'],
 ['@この B1@童謡 は @花 について の @歌 です','This children’s song is about flowers.'],
 ['@母 が @教える~教えて~おしえて @くれる~くれた~くれた B1@童謡 を @覚える~覚えています~おぼえています','I remember the children’s song my mother taught me.'],
]);
lesson('sound-and-recordings','Sound equipment and old recordings',['B1@マイク','B1@スピーカー','B1@カセット','B1@ゲスト'],
 'マイク / スピーカー / カセット / ゲスト','A マイク picks up sound; a スピーカー plays it. カセット here means an audio cassette. ゲスト is an invited guest or performer.',[
 ['B1@マイク を @使う~使って~つかって @歌う~歌いました~うたいました','I sang using a microphone.'],
 ['B1@マイク が @ある @場所 を @確認 @する~しました~しました','I checked where the microphone was.'],
 ['@歌う @前 に B1@マイク の @音 を @確認 @する~しました~しました','I checked the microphone sound before singing.'],
 ['B1@スピーカー から @音楽 が @聞こえる~聞こえます~きこえます','Music is coming from the speakers.'],
 ['B1@スピーカー の @音 を @小さい~小さく~ちいさく @する~しました~しました','I turned down the speaker volume.'],
 ['@舞台 の @近く に B1@スピーカー を @置く~置きました~おきました','We put speakers near the stage.'],
 ['@父 の @古い B1@カセット を @見つける~見つけました~みつけました','I found my father’s old cassette tapes.'],
 ['B1@カセット に は @家族 の @歌 が @入る~入っています~はいっています','The cassette contains the family’s singing.'],
 ['@古い B1@カセット を @聞く ために @機械 を @借りる~借りました~かりました','I borrowed a machine to listen to the old cassette.'],
 ['@今日 の B1@ゲスト は @町 の B1@歌手 です','Today’s guest is a singer from our town.'],
 ['B1@ゲスト が @舞台 で @歌う~歌いました~うたいました','The guest sang on the stage.'],
 ['B1@ゲスト に @好き な @歌 を @聞く~聞きました~ききました','I asked the guest what songs they liked.'],
]);
lesson('festival-music-account','Music at a festival',[],
 '民謡 / 笛 / 太鼓','Follow the performance from the first song to the audience’s response.',[
 ['@祭り の B1@ゲスト は @町 の B1@歌手 でした','The festival’s guest was a local singer.'],
 ['B1@ゲスト は B1@マイク を @使う~使って~つかって B1@民謡 を @歌う~歌いました~うたいました','The guest sang a folk song into the microphone.'],
 ['B1@笛 と B1@太鼓 の @演奏 も @ある~ありました~ありました','There was also a performance with flutes and drums.'],
 ['B1@ゲスト は @子供 が @知る~知っている~しっている B1@童謡 も @歌う~歌いました~うたいました','The guest also sang children’s songs that the children knew.'],
 ['@最後 に @全員 で B1@拍手 @する~しました~しました','At the end, we all applauded.'],
]);
useTopic('art');
lesson('brushes-and-flowers','Calligraphy and flower arrangement',['B1@習字','B1@生け花','B1@扇子'],
 '習字 / 生け花 / 扇子','習字 is practicing writing, often with a brush and ink. 生け花 is the Japanese art of flower arrangement. 扇子 is a fan that folds closed.',[
 ['@子供 の @時 に B1@習字 を @習う~習いました~ならいました','I learned calligraphy as a child.'],
 ['B1@習字 で @自分 の @名前 を @書く~書きました~かきました','I wrote my name in calligraphy practice.'],
 ['B1@習字 の @道具 を @机 に @置く~置きました~おきました','I put the calligraphy tools on the desk.'],
 ['@祖母 から B1@生け花 を @習う~習っています~ならっています','I am learning flower arrangement from my grandmother.'],
 ['B1@生け花 の @教室 で @花 を @選ぶ~選びました~えらびました','I chose flowers in my flower-arranging class.'],
 ['@入り口 に B1@生け花 の @作品 が @ある~あります~あります','There is a flower arrangement at the entrance.'],
 ['@暑い @日 に B1@扇子 を @使う~使います~つかいます','I use a folding fan on hot days.'],
 ['@この B1@扇子 に は @花 の @絵 が @ある~あります~あります','This folding fan has a picture of flowers on it.'],
 ['B1@扇子 を @使う~使った~つかった @後 で @かばん に @入れる~入れました~いれました','After using the folding fan, I put it in my bag.'],
]);
lesson('style-and-admiration','Style and admiration',['B1@モダン','B1@見事'],
 'モダンなN / 見事なN','モダン describes a modern style. 見事 expresses strong admiration for something impressive or well done.',[
 ['@この @建物 は B1@モダン な @形 を @する~しています~しています','This building has a modern shape.'],
 ['B1@モダン な @デザイン の @椅子 を @見る~見ました~みました','I saw a chair with a modern design.'],
 ['@古い @家 の @中 に B1@モダン な @テーブル が @ある~あります~あります','There is a modern table inside the old house.'],
 ['B1@見事 な @絵 の @前 で @立つ~立っていました~たっていました','I stood in front of a magnificent painting.'],
 ['@子供 の @作品 は B1@見事 でした','The child’s work was superb.'],
 ['@この B1@生け花 は @本当 に B1@見事 です','This flower arrangement is truly magnificent.'],
]);
lesson('art-class-account','A small exhibition',[],
 '習字 / 生け花 / 見事','Notice the different works displayed in the room.',[
 ['@教室 に B1@習字 と B1@生け花 の @作品 を @飾る~飾りました~かざりました','We displayed calligraphy and flower arrangements in the classroom.'],
 ['@入り口 の @花 は B1@見事 でした','The flowers at the entrance were magnificent.'],
 ['@机 の @上 に @絵 の @ある B1@扇子 も @置く~置きました~おきました','We also placed a folding fan with a picture on it on the desk.'],
 ['@部屋 に は B1@モダン な @椅子 が @並ぶ~並んでいました~ならんでいました','Modern chairs were arranged in the room.'],
 ['@友達 と @作品 を @見る~見ながら~みながら @話す~話しました~はなしました','I talked with a friend while we looked at the works.'],
]);
useTopic('reading');
lesson('finding-book-information','Finding your way through books',['B1@全集','B1@目次','B1@百科事典'],
 '全集 / 目次 / 百科事典','全集 collects a writer’s complete works. 目次 lists a book’s sections and their locations. 百科事典 explains subjects across many fields.',[
 ['@好き な @作家 の B1@全集 を @図書館 で @見つける~見つけました~みつけました','I found my favorite writer’s collected works at the library.'],
 ['@父 は @本棚 に B1@全集 を @並べる~並べています~ならべています','My father is arranging the collected works on the bookshelf.'],
 ['B1@全集 に @入る~入っている~はいっている @短い @小説 を @読む~読みました~よみました','I read a short novel included in the collected works.'],
 ['@本 の B1@目次 を @読む~読みました~よみました','I read the book’s table of contents.'],
 ['B1@目次 で @読む~読みたい~よみたい @部分 を @探す~探しました~さがしました','I used the table of contents to find the section I wanted to read.'],
 ['@この @本 の B1@目次 は @最初 の @ページ に @ある~あります~あります','This book’s table of contents is on the first page.'],
 ['B1@百科事典 で @動物 について @調べる~調べました~しらべました','I looked up animals in an encyclopedia.'],
 ['@子供 の @ため の B1@百科事典 を @借りる~借りました~かりました','I borrowed an encyclopedia for children.'],
 ['@この B1@百科事典 に は @写真 が @たくさん @ある~あります~あります','This encyclopedia has many photographs.'],
]);
lesson('drafts-and-outlines','Drafts and plot summaries',['B1@下書き','B1@あらすじ'],
 '下書き / あらすじ','下書き is a draft that can still be revised. あらすじ gives the main events of a story without telling every detail.',[
 ['@作文 の B1@下書き を @書く~書きました~かきました','I wrote a draft of my composition.'],
 ['B1@下書き を @読む~読んで~よんで @間違い を @直す~直しました~なおしました','I read the draft and corrected the mistakes.'],
 ['@先生 に B1@下書き を @見る~見て~みて @もらう~もらいました~もらいました','I had the teacher look at my draft.'],
 ['@小説 の B1@あらすじ を @友達 に @話す~話しました~はなしました','I told a friend the outline of the novel.'],
 ['@映画 の B1@あらすじ を @読む~読んで~よんで @興味 を @持つ~持ちました~もちました','Reading the film’s plot summary made me interested in it.'],
 ['B1@あらすじ を @短い~短く~みじかく @書く~書きました~かきました','I wrote a short plot summary.'],
]);
lesson('originals-and-legends','Original works, genres and legends',['B1@原作','B1@ジャンル','B1@伝説'],
 '原作 / ジャンル / 伝説','原作 is the work an adaptation is based on. ジャンル is a category of works. 伝説 is a story handed down as a legend.',[
 ['@この @映画 の B1@原作 は @小説 です','The original work behind this film is a novel.'],
 ['@映画 を @見る @前 に B1@原作 を @読む~読みました~よみました','I read the original work before watching the film.'],
 ['B1@原作 と @映画 の @終わり は @違う~違います~ちがいます','The original work and the film have different endings.'],
 ['@いろいろ な B1@ジャンル の @本 を @読む~読みます~よみます','I read books in various genres.'],
 ['@この @映画 は @どんな B1@ジャンル です か','What genre is this film?'],
 ['@好き な B1@ジャンル の @音楽 を @選ぶ~選びました~えらびました','I chose music in my favorite genre.'],
 ['@この @村 に は @古い B1@伝説 が @ある~あります~あります','This village has an old legend.'],
 ['@祖父 が @山 の B1@伝説 を @話す~話して~はなして @くれる~くれました~くれました','My grandfather told me a legend about the mountain.'],
 ['B1@伝説 を @集める~集めた~あつめた @本 を @読む~読みました~よみました','I read a book of collected legends.'],
]);
lesson('praising-works','Talking about great works',['B1@名作','B1@傑作'],
 '名作 / 傑作','名作 and 傑作 both praise the quality of a work. 傑作 is especially strong praise: a masterpiece or outstanding achievement. Their uses overlap.',[
 ['@昔 の @映画 の B1@名作 を @見る~見ました~みました','I watched a great old film.'],
 ['@この @小説 は @日本 の @文学 の B1@名作 です','This novel is a great work of Japanese literature.'],
 ['@先生 が @小説 の B1@名作 を @紹介 @する~して~して @くれる~くれました~くれました','The teacher introduced us to a great novel.'],
 ['@この @絵 は @彼 の B1@傑作 です','This painting is his masterpiece.'],
 ['@私 は @この @映画 を B1@傑作 だ と @思う~思います~おもいます','I consider this film a masterpiece.'],
 ['@彼女 の B1@傑作 を @もう一度 @読む~読みたい~よみたい です','I want to read her masterpiece again.'],
]);
lesson('reading-to-review-account','From a book to a short review',[],
 '原作 / あらすじ / 下書き','Follow the reader’s steps before writing about the film.',[
 ['@映画 の B1@原作 を @図書館 で @借りる~借りました~かりました','I borrowed the original work behind the film from the library.'],
 ['B1@目次 を @見る~見て~みて から @本 を @最後 まで @読む~読みました~よみました','I looked at the table of contents and then read the whole book.'],
 ['@映画 を @見る~見た~みた @後 で B1@原作 と @比べる~比べました~くらべました','After watching the film, I compared it with the original work.'],
 ['B1@あらすじ を @短い~短く~みじかく @書く~書いて~かいて @自分 の @意見 も @書く~書きました~かきました','I wrote a brief plot summary and my own opinion.'],
 ['@友達 に B1@下書き を @読む~読んで~よんで @もらう~もらいました~もらいました','I had a friend read my draft.'],
]);
}
