export function authorQuantity({topic,useTopic,lesson,lines,forms}) {
forms['くらい']=['くらい','about; approximately'];
forms['より']=['より','than; comparison baseline'];
useTopic('shopping');
lesson('price-changes','Prices going up and down',[384,481], '値段が上がります / 値段が下がります', '上がる and 下がる describe a quantity rising or falling. The price takes が because it is what changes. These are different from 上げる and 下げる, which describe someone raising or lowering something.', [
 ['337 が 384~上がりました~あがりました','The price went up.'],['825 は 384~上がっています~あがっています','The price is rising.'],
 ['337 が 481~下がりました~さがりました','The price went down.'],['825 は 481~下がっています~さがっています','The price is falling.'],
]);
topic('quantity','Amounts, shapes and comparisons','Describe measurements, compare alternatives, and explain what is enough.');
lesson('measure','Measuring',[153,180,677,213,248,894], '百 メートル 歩きます', '約 means approximately and goes before a number. メートル measures length and グラム mass. 零 is zero. 形 is a shape; 丸 names a circle or round mark. The adjective 丸い from A1 is related but has a different grammatical role.', [
 ['@百 153 @歩く~歩きます~あるきます','I walk one hundred meters.'],['@五 153 @泳ぐ~泳ぎます~およぎます','I swim five meters.'],
 ['@百 180 の @砂糖 です','It is one hundred grams of sugar.'],['@肉 を @五 @百 180 @買う~買いました~かいました','I bought five hundred grams of meat.'],
 ['677 @一 @時間 @待つ~待ちました~まちました','I waited approximately an hour.'],['677 @十 @人~人~にん です','There are approximately ten people.'],
 ['@答え は 213 です','The answer is zero.'],['213 を @書く~書いてください~かいてください','Please write zero.'],
 ['248 が @違う~違います~ちがいます','The shapes are different.'],['@この 248 は 894 です','This shape is a circle.'],
 ['894 を @書く~書いてください~かいてください','Please draw a circle.'],
]);
lesson('distance','Distances in kilometers',[1267], 'number + キロメートル', 'キロメートル measures distance: one kilometer is one thousand meters. Put the number before the unit. Use から for a starting point and まで for a destination; the distance can also come directly before 歩きます or 走ります.', [
 ['@一 1267 は @千 153 です','One kilometer is one thousand meters.'],
 ['@駅 まで @二 1267 @歩く~歩きます~あるきます','I walk two kilometers to the station.'],
 ['@学校 は @家 から 677 @一 1267 です','The school is about one kilometer from my house.'],
 ['@友達 と @三 1267 @走る~走りました~はしりました','I ran three kilometers with my friend.'],
]);
lesson('amounts','Amounts and enough',[749,446,567,1067,992,360], 'Nが足ります / Nが残っています', '量 is an amount. 十分 means enough; 足りる means be sufficient. 不足 is a shortage. 残り names what remains, while 残る is the verb. Use が for the resource that is sufficient or remains.', [
 ['@水 の 749 は @少ない です','The amount of water is small.'],['749 は @同じ です','The amount is the same.'],
 ['@時間 は 446 です','There is enough time.'],['@これ で 446 です','This is enough.'],
 ['@お金 が 567~足ります~たります','I have enough money.'],['@時間 が 567~足りません~たりません','There is not enough time.'],
 ['@水 が 1067~不足しています~ふそくしています','Water is in short supply.'],['@時間 の 1067 です','It is a shortage of time.'],
 ['992 は @少し です','There is only a little left.'],['992 の @ご飯 を @食べる~食べます~たべます','I eat the remaining rice.'],
 ['@ご飯 が 360~残っています~のこっています','There is rice left over.'],['@時間 は @まだ 360~残っています~のこっています','There is still time left.'],
]);
lesson('changing-amounts','Adding and increasing',[583,376,1108,963,425], 'Nを足します / Nが増えます / 平均', '足す adds something, while 増える describes a quantity increasing. 増加 is a formal noun or する-verb for an increase. 平均 is an average; 割合 is a proportion or share. An average is not necessarily the amount for every individual.', [
 ['@水 を @少し 583~足します~たします','I add a little water.'],['@一 と @二 を 583~足します~たします','I add one and two.'],
 ['@人 が 376~増えました~ふえました','The number of people increased.'],['@仕事 が 376~増えています~ふえています','The amount of work is increasing.'],
 ['@車 が 1108~増加しています~ぞうかしています','The number of cars is increasing.'],['1108 は @少し です','The increase is small.'],
 ['@毎日 @ここ に @来る~来る~くる @人 は 963 @十 @人~人~にん です','An average of ten people come here each day.'],['963 より @多い です','It is more than the average.'],
 ['@学生 の 425 は @高い です','The proportion of students is high.'],['@この 425 は @同じ です','This proportion is the same.'],
]);
lesson('comparison','Comparing alternatives',[1029,829,276,273,1264,224], 'AよりBの方が… / Aほど…ない', '方, read ほう, identifies an alternative in a comparison. AよりBの方が大きいです means B is larger than A. Aほど大きくありません means not as large as A. 倍 multiplies an amount; 最も is a formal most.', [
 ['@二つ の @家 を 1029~比較します~ひかくします','I compare two houses.'],['1029 は @簡単 です','The comparison is easy.'],
 ['829 は @大きい です','The difference is large.'],['@二つ の @答え に 829 が @ある~あります~あります','There is a difference between the two answers.'],
 ['749 は @二 276 です','The amount is double.'],['@水 の 749 は @昨日 の @三 276 です','The amount of water is three times yesterday’s amount.'],
 ['@これ が 273 @大きい です','This is the largest.'],['273 @安い @店 です','It is the least expensive shop.'],
 ['@これ より @それ の 1264 が @大きい です','That one is larger than this one.'],['@私 は @お茶 の 1264 が @好き です','I prefer tea.'],
 ['@これ は @あれ 224 @高い~高くありません~たかくありません','This is not as expensive as that.'],['@今日 は @昨日 224 @寒い~寒くありません~さむくありません','Today is not as cold as yesterday.'],
]);
lesson('rough-amounts','Approximate amounts',[399,748,345,256,695,772], 'だいたい / N程度 / N以内', 'だいたい is roughly or generally. 程度 can mean degree or about that amount. 以内 means within a stated limit. ほとんど means almost all or most; with a negative, hardly any. すべて is all and 全体 the whole.', [
 ['399 @一 @時間 です','It is roughly an hour.'],['399 @わかる~わかります~わかります','I understand most of it.'],
 ['@一 @時間 748 @待つ~待ちます~まちます','I wait about an hour.'],['@この 748 で @大丈夫 です','This much is fine.'],
 ['@一 @時間 345 に @来る~来てください~きてください','Please come within an hour.'],['@百 @円 345 です','It is no more than one hundred yen.'],
 ['256 @終わる~終わりました~おわりました','It is almost finished.'],['@人 は 256 @いる~いません~いません','There is hardly anyone.'],
 ['695 @読む~読みました~よみました','I read all of it.'],['695 @正しい です','Everything is correct.'],
 ['772 を @見る~見ます~みます','I look at the whole thing.'],['772 は @大きい です','It is large overall.'],
]);
lesson('details','Sizes and details',[434,257,231,703,383,848], '細かいN / Nの部分 / Nの制限', '細かい describes something small or detailed. 線 is a line, 点 a point or mark, and 部分 a part. 規則 is a rule; 制限 is a restriction or limit. These words help you read a form or explain a specific part of something.', [
 ['434 @字 を @読む~読みます~よみます','I read small print.'],['434 @仕事 です','It is detailed work.'],
 ['257 を @書く~書きます~かきます','I draw a line.'],['@この 257 は @長い です','This line is long.'],
 ['@ここ に 231 を @書く~書きます~かきます','I put a dot here.'],['@赤い 231 が @ある~あります~あります','There is a red dot.'],
 ['@この 703 を @読む~読んでください~よんでください','Please read this part.'],['703 が @違う~違います~ちがいます','The parts are different.'],
 ['383 を @読む~読みます~よみます','I read the rules.'],['383 は @大切 です','Rules are important.'],
 ['@時間 の 848 が @ある~あります~あります','There is a time limit.'],['848 は @一 @時間 です','The limit is one hour.'],
]);
}
