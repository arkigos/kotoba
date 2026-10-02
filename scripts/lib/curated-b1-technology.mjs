export function authorTechnology({topic,lesson:authorLesson}) {
// These are the reviewed senses used in this chapter, not new dictionary entries.
const glosses={2857:'computer file',2697:'settings; configuration',1774:'printed handout',1436:'come with; be included with',796:'be displayed; appear on a screen',1077:'appear in a photograph',1290:'production of a creative work'};
const lesson=(...args)=>authorLesson(...args,glosses);
topic('technology','Devices, media and communication','Describe a connection, adjust a device, work with files, and explain a recording or printout.');
lesson('connections','Connecting devices',[396,807,1207,1309], 'NをNにつなぎます / Nがつながります', 'つなぐ and つなげる both connect things; を marks what you connect and に what it connects to. つながる describes the connection itself, including a telephone call getting through. 接続 is connection as a noun or with する.', [
 ['@電話 が 396~つながりません~つながりません','The call will not connect.'],
 ['@プリンタ と @パソコン が 396~つながっています~つながっています','The printer and computer are connected.'],
 ['@プリンタ を @パソコン に 807~つなぎます~つなぎます','I connect the printer to the computer.'],
 ['@パソコン に 807~つないで~つないで @印刷 @する~します~します','I connect it to the computer and print.'],
 ['@機械 を @パソコン に 1207~つなげます~つなげます','I connect the machine to the computer.'],
 ['1207~つなげて~つなげて @使う~使います~つかいます','I connect it and use it.'],
 ['1309 の @方法 を @教える~教えてください~おしえてください','Please tell me how to connect it.'],
 ['1309 を @確認 @する~しました~しました','I checked the connection.'],
]);
lesson('signals','Radio and signal strength',[2907,1429], '無線で連絡します / 電波が弱いです', '無線 means wireless or radio communication. 電波 are radio waves; in everyday device use, 電波が弱い means the signal is weak. This is about the signal reaching a device, not its sound volume.', [
 ['2907 で @連絡 @する~します~します','I communicate by radio.'],
 ['@船 の 2907 を @使う~使いました~つかいました','I used the ship’s radio.'],
 ['@ここ は 1429 が @弱い です','The signal is weak here.'],
 ['1429 が @弱い ので @電話 が 396~つながりません~つながりません','The signal is weak, so the call will not connect.'],
]);
lesson('settings','Settings and files',[2696,2697,2857,1369], 'Nを登録します / 設定を変えます', '登録 is registration; 設定 means a device or program’s settings here. ファイル is a computer file in these examples, though it can also mean a paper folder. 削除 means deleting something.', [
 ['@名前 を 2696 @する~します~します','I register my name.'],
 ['2696 の @内容 を @確認 @する~しました~しました','I checked the registration details.'],
 ['@パソコン の 2697 を @変える~変えます~かえます','I change the computer’s settings.'],
 ['2697 の @方法 が @わかる~わかりません~わかりません','I do not know how to configure it.'],
 ['2857 を @保存 @する~しました~しました','I saved the file.'],
 ['@この 2857 の @名前 を @変える~変えます~かえます','I change this file’s name.'],
 ['@古い 2857 を 1369 @する~しました~しました','I deleted the old file.'],
 ['1369 の @前 に @内容 を @確認 @する~します~します','I check the contents before deleting it.'],
]);
lesson('images','Pictures on a screen',[120,2703,1077,796,1078], 'Nが写ります / Nが映ります / Nを映します', 'ビデオ can mean video or a video recording. 映像 is a visual image, often moving images on a screen. 写る commonly describes appearing in a photograph; 映る appearing on a screen or in a reflection. 映す is the transitive verb for projecting or displaying the image.', [
 ['@旅行 の 120 を @見る~見ました~みました','I watched the video of the trip.'],
 ['120 を @もう一度 @見る~見たい~みたい です','I want to watch the video again.'],
 ['2703 は @はっきり @見える~見えます~みえます','The image is clearly visible.'],
 ['@この 2703 は @暗い です','This image is dark.'],
 ['@写真 に @家族 が 1077~写っています~うつっています','My family is in the photograph.'],
 ['@窓 も @写真 に 1077~写りました~うつりました','The window appeared in the photograph too.'],
 ['@画面 に @名前 が 796~映っています~うつっています','The name is displayed on the screen.'],
 ['@この @テレビ は 796~映りません~うつりません','This television does not show a picture.'],
 ['@写真 を @画面 に 1078~映します~うつします','I display the photograph on the screen.'],
 ['@大きい @スクリーン に 120 を 1078~映しました~うつしました','I projected the video onto a large screen.'],
]);
lesson('camera','Taking photographs',[1276,1693,1979], 'Nを撮影します / シャッターを押します', '撮影 is taking photographs or filming. レンズ is a lens. シャッター means the camera shutter here; シャッターを押す commonly refers to pressing its release button. It can mean a building shutter in other contexts.', [
 ['@公園 で 1276 を @する~しました~しました','I took photographs in the park.'],
 ['1276 の @前 に @カメラ を @確認 @する~します~します','I check the camera before taking photographs.'],
 ['1693 を 1010~拭きます~ふきます','I wipe the lens.'],
 ['@この 1693 は @小さい です','This lens is small.'],
 ['1979 を @押す~押しました~おしました','I pressed the shutter release.'],
 ['1979 の @音 が @聞こえる~聞こえました~きこえました','I heard the shutter sound.'],
]);
lesson('audio','Recording and unwanted sound',[1431,2183,735], 'Nを録音します / 録音に雑音が入ります', '録音 records sound, whereas 録画 records video. 雑音 is unwanted noise mixed with a sound or recording. 騒音 usually means loud or disturbing environmental noise. The same sound may be described differently depending on the situation.', [
 ['@会議 を 1431 @する~します~します','I record the meeting.'],
 ['@この 1431 を @聞く~聞いてください~きいてください','Please listen to this recording.'],
 ['1431 に 2183 が @入る~入っています~はいっています','There is unwanted noise in the recording.'],
 ['2183 で @声 が @聞こえる~聞こえません~きこえません','I cannot hear the voice because of the noise.'],
 ['@外 の 735 が @大きい です','The noise outside is loud.'],
 ['735 について @相談 @する~しました~しました','I discussed the noise problem.'],
]);
lesson('telephone','Calls and messages',[2445,2190,975], '受話器を取ります / 伝言をお願いします', '受話器 is the handset of a telephone. ダイヤル is a dial, such as a rotary dial on an older telephone. 伝言 is a message passed to someone, often through another person. These words are useful when describing a telephone or leaving a message.', [
 ['2445 を @取る~取りました~とりました','I picked up the handset.'],
 ['2445 を @置く~置きました~おきました','I put down the handset.'],
 ['@この @古い @電話 に は 2190 が @ある~あります~あります','This old telephone has a dial.'],
 ['2190 が @小さい ので @番号 が @見える~見えません~みえません','The dial is small, so I cannot see the numbers.'],
 ['975 を @お願い~お願いします~おねがいします','Could you pass on a message?'],
 ['@母 の 975 を @友達 に @伝える~伝えました~つたえました','I passed my mother’s message to my friend.'],
]);
lesson('power','Electricity and outages',[1344,1354,1750,650,557], 'Nに電力が必要です / 停電でVません', '発電 is generating electricity. 電力 is electrical power; 電流 is electric current. 停電 is a power outage. 減らす means reduce the amount of something. で can introduce the cause of a device not working, as in 停電で使えません.', [
 ['1344 の @方法 を 84~学びます~まなびます','I learn about ways of generating electricity.'],
 ['1344 に は @水 も @使う~使います~つかいます','Water is also used to generate electricity.'],
 ['@この @機械 に は 1354 が @必要 です','This machine needs electrical power.'],
 ['1354 の @使用 を 557~減らします~へらします','I reduce electricity use.'],
 ['@電気 の @使用 を 557~減らしたい~へらしたい です','I want to reduce my electricity use.'],
 ['1750 が 236~流れています~ながれています','An electric current is flowing.'],
 ['1750 について @説明 @する~してください~してください','Please explain electric current.'],
 ['@昨日 650 が @ある~ありました~ありました','There was a power outage yesterday.'],
 ['650 で @パソコン が @使う~使えません~つかえません','I cannot use the computer because of the power outage.'],
]);
lesson('lighting','Lights and replacements',[998,1950,32], '電球を交換します / 明かりをつけます', '明かり is light or a light source. 電球 is a light bulb. 交換する means exchange or replace an item. It differs from changing a setting with 変える: here one item is replaced with another.', [
 ['998 を @つける~つけてください~つけてください','Please turn on the light.'],
 ['@窓 から 998 が @見える~見えます~みえます','I can see a light through the window.'],
 ['@この 1950 は @明るい です','This light bulb is bright.'],
 ['@新しい 1950 を @買う~買いました~かいました','I bought a new light bulb.'],
 ['1950 を 32 @する~しました~しました','I replaced the light bulb.'],
 ['32 の 111 を @聞く~聞きました~ききました','I asked about the replacement cost.'],
]);
lesson('printing','Printing and prepared handouts',[1199,1774,2399], 'Nを刷ります / NがVてあります', '刷る is print; プリント here is a printed handout. 複写 is copying a document or image. A transitive verb’s て-form plus あります describes a state resulting from someone’s deliberate action: 置いてあります means someone has put it there. It often suggests something has been prepared.', [
 ['@学校 の @新聞 を 1199~刷ります~すります','I print the school newspaper.'],
 ['1199~刷る~する @前 に @内容 を @確認 @する~します~します','I check the contents before printing.'],
 ['1774 を @読む~読んでください~よんでください','Please read the handout.'],
 ['1774 は @机 に @置く~置いてあります~おいてあります','The handouts have been placed on the desk.'],
 ['@この @紙 を 2399 @する~します~します','I copy this sheet of paper.'],
 ['2399 の @前 に @ページ を @確認 @する~します~します','I check the page before copying.'],
 ['1774 に は @名前 が @書く~書いてあります~かいてあります','The name has been written on the handout.'],
]);
lesson('editing','Making and editing media',[1289,1290], 'Nを編集します / Nの制作', '編集する means edit or compile written, audio or visual material. 制作 is producing a creative work such as a video. It shares its reading with 製作, which often concerns making physical objects. The examples here use recordings and video.', [
 ['120 を 1289 @する~しています~しています','I am editing the video.'],
 ['1289 の @後 で 2857 を @保存 @する~します~します','I save the file after editing.'],
 ['@友達 と 120 を 1290 @する~しました~しました','I made a video with my friend.'],
 ['1290 の @時間 は @長い です','Production takes a long time.'],
]);
lesson('equipment','Included equipment and makers',[2819,1436,1714], 'Nに付属しています / Nのメーカー', 'メーカー is a manufacturer. 付属 describes something included with or attached to another item; 付属のN means an included item. 器具 is an implement or piece of equipment used for a particular purpose.', [
 ['@カメラ の 2819 を @調べる~調べます~しらべます','I look up the camera’s manufacturer.'],
 ['2819 に @修理 を @お願い~お願いします~おねがいします','I ask the manufacturer to repair it.'],
 ['@この 1714 は @カメラ に 1436 @する~しています~しています','This piece of equipment comes with the camera.'],
 ['1436 の 1714 を @確認 @する~します~します','I check the included equipment.'],
 ['1714 を @使う~使う~つかう @方法 を @教える~教えてください~おしえてください','Please tell me how to use the equipment.'],
]);
}
