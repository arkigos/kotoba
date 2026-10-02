export function authorArt({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{562:'painting; paintings as art',739:'painter; artist who paints',2253:'paint; painting colors',2507:'sketching from observation',2793:'display; exhibition',1516:'collection of objects or artworks',1789:'crafts; craftwork',2594:'ceramic ware; pottery'});
topic('art','Painting, exhibitions and crafts','Describe making a picture, visiting an exhibition and noticing the materials and shapes of craftwork.');
lesson('painting','Paintings, painters and paint',[562,739,2253], '絵画を鑑賞します / 絵の具で描きます', '絵画 refers to paintings as works of art; 絵 is the familiar everyday word for a picture. 画家 is a painter. 絵の具 is paint used for making pictures, rather than the finished picture.', [
 ['@美術館 で 562 を 1498 @する~しました~しました','I enjoyed the paintings at an art museum.'],
 ['@この 562 は @海 の @色 が @美しい です','The colors of the sea are beautiful in this painting.'],
 ['@有名 な 739 の 562 を @見る~見ました~みました','I saw a painting by a famous painter.'],
 ['739 は @庭 の @花 を @描く~描いています~えがいています','The painter is painting the flowers in the garden.'],
 ['2253 を @使う~使って~つかって @絵 を @描く~描きます~かきます','I paint a picture using paints.'],
 ['@赤い 2253 と @青い 2253 を 919~混ぜました~まぜました','I mixed red and blue paint.'],
]);
authorLesson('scenery-and-beauty','Scenery and beauty',[278,2715], '風景を描きます / 自然の美', '風景 is the scenery or scene you see, including views of a town or the countryside. 美 is the noun beauty, often used when discussing art or nature. 美しい describes something as beautiful; 美 names the quality itself.', [
 ['@公園 で 278 を @描く~描きました~かきました','I painted the scenery in the park.'],
 ['@この @絵 は @昔 の @町 の 278 です','This picture shows a scene of the town in the past.'],
 ['@窓 から @見える 278 を @写真 に @撮る~撮りました~とりました','I photographed the view from the window.'],
 ['@旅行 で @見る~見た~みた 278 を @覚える~覚えています~おぼえています','I remember the scenery I saw on my trip.'],
 ['@自然 の 2715 を @感じる~感じました~かんじました','I felt the beauty of nature.'],
 ['@自然 の 2715 を @写真 で @伝える~伝えたい~つたえたい です','I want to convey the beauty of nature through photographs.'],
 ['@この @作品 の 2715 について @先生 と @話す~話しました~はなしました','I talked with my teacher about the beauty of this work.'],
 ['@この 739 は @花 の 2715 を @描く~描いています~えがいています','This painter portrays the beauty of flowers.'],
],{278:'scenery; a scene or view',2715:'beauty'});
course.lessons.at(-1).notes[0].title='Describing a view and its beauty';
authorLesson('color-and-background','Color depth and backgrounds',[406,2794], '濃い色 / 絵の背景', '濃い色 is a deep or intense color. 濃い describes the color here, not the physical thickness of the paint. 背景 is the background behind the main subject of a picture or photograph.', [
 ['@この @絵 は @色 が 406 です','The colors in this picture are deep.'],
 ['2794 に は 406 @青 を @使う~使いました~つかいました','I used a deep blue for the background.'],
 ['406 @色 の 2253 に @水 を @少し @入れる~入れました~いれました','I added a little water to the dark paint.'],
 ['@花 に は 406 @色 を @使う~使いました~つかいました','I used intense colors for the flowers.'],
 ['@この @絵 の 2794 は @山 です','The background of this picture is mountains.'],
 ['@写真 の 2794 に @家 が @見える~見えます~みえます','A house is visible in the background of the photograph.'],
 ['2794 の @色 を @変える~変えました~かえました','I changed the background color.'],
 ['@明るい 2794 の @前 で @写真 を @撮る~撮ってもらいました~とってもらいました','I had my photo taken against a bright background.'],
],{406:'deep; intense (color)',2794:'background (of a picture or photograph)'});
course.lessons.at(-1).notes[0].title='Color and background';
authorLesson('frames','Choosing and displaying a frame',[1229], '絵を額に入れます', '額, read がく, means a picture frame. 絵を額に入れる means putting a picture in a frame. This is a different word from 額 read ひたい, forehead.', [
 ['@木 の 1229 に @絵 を @入れる~入れました~いれました','I put the picture in a wooden frame.'],
 ['@この 1229 は @写真 に @合う~合います~あいます','This frame suits the photograph.'],
 ['1229 の @色 を @選ぶ~選びました~えらびました','I chose the color of the frame.'],
 ['@壁 に 1229 を @飾る~飾りました~かざりました','I displayed the frame on the wall.'],
],{1229:'picture frame'});
course.lessons.at(-1).notes[0].title='額 is read がく';
lesson('exhibiting','Sketching, exhibiting and collecting',[2507,2793,1516], '写生をします / 作品を展示します', '写生 means drawing or painting while observing the actual subject. 展示 is putting something on display. コレクション is a collection; in this lesson it is a group of paintings or other objects someone has collected.', [
 ['@公園 で @木 の 2507 を @する~しました~しました','I sketched a tree from observation in the park.'],
 ['2507 の @時 は @形 を @よく @見る~見ます~みます','When sketching from life, I look carefully at the shapes.'],
 ['@学校 に @学生 の @作品 を 2793 @する~します~します','We display the students’ work at school.'],
 ['@写真 の 2793 を @見る~見て~みて @旅行 に @行く~行きたく~いきたく @なる~なりました~なりました','Seeing the photography exhibition made me want to travel.'],
 ['@祖父 の 1516 に は @古い @写真 が @たくさん @ある~あります~あります','My grandfather’s collection contains many old photographs.'],
 ['@この @美術館 は 562 の 1516 で @有名 です','This museum is famous for its collection of paintings.'],
]);
authorLesson('sculpture','Sculpture, statues and carving',[1715,126,2494], '彫刻 / 像 / 木を彫ります', '彫刻 names sculpture or carving as an art form, and also a sculpted work. 像 names a statue or figure in these examples. 彫る is the action of carving. 木に名前を彫る carves a name into wood; 木を彫る carves the wood itself.', [
 ['@美術館 で 1715 を @見る~見ました~みました','I saw sculptures at the art museum.'],
 ['@この 1715 は @石 で @できる~できています~できています','This sculpture is made of stone.'],
 ['1715 の @形 を @よく @見る~見てください~みてください','Please look carefully at the shape of the sculpture.'],
 ['1715 の @教室 に @通う~通っています~かよっています','I attend a sculpture class.'],
 ['@公園 に 739 の 126 が @ある~あります~あります','There is a statue of a painter in the park.'],
 ['@駅 の @前 の 126 の @写真 を @撮る~撮りました~とりました','I took a photograph of the statue in front of the station.'],
 ['@この 126 は @木 で @できる~できています~できています','This statue is made of wood.'],
 ['126 の @顔 を @近く で @見る~見ました~みました','I looked closely at the statue’s face.'],
 ['@木 に @名前 を 2494~彫りました~ほりました','I carved a name into the wood.'],
 ['@石 を 2494~彫って~ほって 126 を @作る~作りました~つくりました','I carved stone to make a statue.'],
 ['@木 に @花 の @形 を 2494~彫っています~ほっています','I am carving a flower shape into the wood.'],
 ['@先生 が 2494~彫った~ほった 126 を @見る~見ました~みました','I saw the statue my teacher had carved.'],
],{1715:'sculpture; carving',126:'statue; sculpted figure',2494:'carve; engrave','@できる':'be made (of)'});
course.lessons.at(-1).notes[0].title='The artwork and the act of carving';
lesson('crafts','Craftwork and pottery',[1789,2594], '工芸 を 習っています / 瀬戸物 の 皿', '工芸 is making useful or decorative objects with skilled handwork. 瀬戸物 is a word for ceramic ware, such as cups and plates. It is a general everyday name here, not a claim that every item was made in one particular place.', [
 ['@町 の @教室 で 1789 を 84~学んでいます~まなんでいます','I am learning crafts in a class in town.'],
 ['1789 の @作品 は @形 が @美しい です','The craftwork has beautiful shapes.'],
 ['@この @店 に は 2594 の @皿 が @たくさん @ある~あります~あります','This shop has many ceramic plates.'],
 ['2594 は @割れる~割れやすい~われやすい ので @ゆっくり @運ぶ~運びます~はこびます','Ceramic ware breaks easily, so I carry it slowly.'],
]);
lesson('account','Making and showing a picture',[], 'A connected account of an art class', 'Follow a picture from observing a tree to showing the finished work. The account reuses words from the painting and exhibition lessons.', [
 ['@教室 の @皆さん と @公園 で 2507 を @する~しました~しました','I sketched from life in the park with the other people in my class.'],
 ['@木 の @形 を @よく @見る~見て~みて 2253 で @描く~描きました~かきました','I looked carefully at the shape of the tree and painted it.'],
 ['@先生 は @私 の @絵 の @色 が @好き だ と @言う~言いました~いいました','The teacher said they liked the colors in my picture.'],
 ['@後 で @学校 に @作品 を 2793 @する~しました~しました','Later, we displayed our work at school.'],
 ['@自分 の @絵 を @見せる @時 は @少し @緊張 @する~しました~しました','I felt a little nervous when showing my picture.'],
]);
authorLesson('gallery-details','Noticing details at an art museum',[], 'A museum visit and a carving practice', '石でできた describes what something is made of. 印象に残る describes a detail that stays in your memory.', [
 ['@週末 に @美術館 で 1715 を @見る~見ました~みました','I saw sculptures at the art museum at the weekend.'],
 ['@石 で @できる~できた~できた 126 の @形 が @面白い~面白かった~おもしろかった です','The shape of the stone statue was interesting.'],
 ['@隣 の @部屋 で @海 の 278 を @描く~描いた~えがいた @絵 を @見る~見ました~みました','In the next room, I saw a painting of a seascape.'],
 ['406 @色 の 2794 と @白い 1229 が 46 に @残る~残りました~のこりました','The dark background and white frame stayed in my memory.'],
 ['@私 は @その @絵 に @自然 の 2715 を @感じる~感じました~かんじました','I felt the beauty of nature in that painting.'],
 ['@帰る~帰って~かえって から @木 に @花 の @形 を 2494~彫る~ほる @練習 を @する~しました~しました','After returning home, I practiced carving a flower shape into wood.'],
],{1715:'sculpture; carving',126:'statue; sculpted figure',278:'scenery; a scene or view',406:'deep; intense (color)',2794:'background (of a picture or photograph)',1229:'picture frame',2715:'beauty',2494:'carve; engrave','@できる':'be made (of)'});
course.lessons.at(-1).notes[0].title='Material and a lasting impression';
}
