import { topic, lesson, lines } from './curated-course-authoring.mjs';

topic('shopping', 'Shopping and clothing', 'Choose things, compare prices, and buy clothes that fit.');
lesson('buying', 'Buying something', [61,62,63,64,65,152], 'Nを買います / Nはいくらですか', '買います means buy. いくら asks a price and 円 is yen. 高い can mean expensive or high; here it refers to price. 安い means inexpensive. お金 is money in general.', [
 ['32 を 61~買います~かいます','I buy a book.'],['53 を 61~買います~かいます','I buy a chair.'],['32 は 63 です か','How much is the book?'],['53 は 63 です か','How much is the chair?'],['32 は 64 です','The book is expensive.'],['53 は 64 です','The chair is expensive.'],['32 は 65 です','The book is inexpensive.'],['53 は 65 です','The chair is inexpensive.'],['23 は 152 です','This is money.'],['152 は 62 です','The money is in yen.'],['62 です か','Is that in yen?'],['1 の 152 です','This is my money.']]);
lesson('choosing', 'This one or that one?', [29,30,31,226,227,301,98], 'このN / どのN / Nが欲しいです', 'この, その and あの must come before a noun; これ, それ and あれ stand alone. どの also needs a noun, while どれ stands alone. 欲しい uses が for the object you want. 選びます means choose.', [
 ...lines([[29,'this'],[30,'that'],[31,'that']], [['$ 32 を 61~買います~かいます','I buy $ book.'],['$ 53 は 64 です','$ chair is expensive.']]),
 ['226 が 98 です か','Which one do you want?'],['227 32 が 98 です か','Which book do you want?'],['227 53 を 301~選びます~えらびます か','Which chair will you choose?'],['226 を 301~選びます~えらびます か','Which one will you choose?'],['29 32 が 98 です','I want this book.'],['23 を 301~選びます~えらびます','I choose this one.']]);
lesson('clothes', 'Clothes to wear', [117,354,360,490,500,682,689], 'Nを着ます / Nを買います', '着ます is used for clothing on the upper body and full-body garments. It does not cover shoes or trousers. 服 and 洋服 mean clothes; 洋服 distinguishes Western-style clothing.', [
 ...lines([[354,'a T-shirt'],[360,'a shirt'],[490,'a coat'],[500,'a dress']], [['$ を 117~着ます~きます','I wear $.'],['$ を 61~買います~かいます','I buy $.']]),
 ['69 682 を 117~着ます~きます','I wear new clothes.'],['682 を 61~買います~かいます','I buy clothes.'],['689 を 117~着ます~きます','I wear Western-style clothes.'],['689 は 64 です','The clothes are expensive.']]);
lesson('lower-body', 'Shoes, trousers, and socks', [582,358,359,362,681,498,688,581], 'Nを履きます / Nを脱ぎます', '履きます is used for shoes, socks, and lower-body clothes. 脱ぎます means take off either upper- or lower-body clothing. パンツ often means underpants in everyday Japanese; ズボン unambiguously means trousers.', [
 ...lines([[358,'shoes'],[359,'socks'],[362,'a skirt'],[681,'trousers'],[498,'underpants']], [['$ を 582~履きます~はきます','I put on $.'],['$ を 581~脱ぎます~ぬぎます','I take off $.']]),
 ['688 を 61~買います~かいます','I buy underwear.'],['688 は 64 です','The underwear is expensive.'],['490 を 581~脱ぎます~ぬぎます','I take off my coat.']]);
lesson('accessories', 'Accessories', [683,684,685,686,687,357,352,177], 'Nを持っています', '持っています can mean that you have something with you or own it. The neutral noun かばん and the loanword バッグ both mean bag. 帽子, メガネ and 指輪 have their own wearing verbs; this lesson practices buying and having them.', [
 ...lines([[683,'a jacket'],[684,'a hat'],[685,'glasses'],[686,'a ring'],[687,'a bag'],[357,'a bag'],[352,'an umbrella']], [['$ を 61~買います~かいます','I buy $.'],['$ を 177~持っています~もっています','I have $.']])]);
lesson('colors', 'Colors', [363,355,356,361,491,487,489,496], '色はNです / 色のN', 'These color words are nouns. Use の to connect them to another noun: 赤のシャツ. Some also have an い-adjective form, taught in the next lesson. 色 asks about or identifies color.', [
 ['360 の 363 です','It is the shirt’s color.'],['363 を 301~選びます~えらびます','I choose a color.'],
 ...lines([[355,'red'],[356,'blue'],[361,'white'],[491,'black'],[487,'brown'],[489,'yellow'],[496,'green']], [['360 の 363 は $ です','The shirt is $.'],['$ の 360 を 61~買います~かいます','I buy a $ shirt.']])]);
lesson("color-adjectives", "Colors that act as adjectives", [613, 614, 615, 616, 617], "い-adjective + N", "黒い, 白い, 赤い, 青い and 黄色い directly modify a noun. Keep the final い before シャツ. The same adjective can also end a sentence with です.", [
 ["613 360 を 61~買います~かいます", "I buy a black shirt."],
 ["614 360 を 61~買います~かいます", "I buy a white shirt."],
 ["615 360 を 61~買います~かいます", "I buy a red shirt."],
 ["616 360 を 61~買います~かいます", "I buy a blue shirt."],
 ["617 360 を 61~買います~かいます", "I buy a yellow shirt."],
 ["360 は 613 です", "The shirt is black."],
 ["360 は 614 です", "The shirt is white."],
 ["360 は 615 です", "The shirt is red."],
 ["360 は 616 です", "The shirt is blue."],
 ["360 は 617 です", "The shirt is yellow."]
]);
lesson("color-nouns", "More colors, with の", [618, 619, 492, 499], "color noun + の + N", "紫, 灰色, オレンジ and ピンク are color nouns here. Use の before the thing you describe: ピンクのシャツ. オレンジ can also mean the fruit, but these cards describe color.", [
 ["618 の 360 を 61~買います~かいます", "I buy a purple shirt."],
 ["619 の 360 を 61~買います~かいます", "I buy a gray shirt."],
 ["492 の 360 を 61~買います~かいます", "I buy an orange shirt."],
 ["499 の 360 を 61~買います~かいます", "I buy a pink shirt."],
 ["360 の 363 は 618 です", "The shirt’s color is purple."],
 ["360 の 363 は 619 です", "The shirt’s color is gray."],
 ["360 の 363 は 492 です", "The shirt’s color is orange."],
 ["360 の 363 は 499 です", "The shirt’s color is pink."]
]);

lesson('fit', 'Size and fit', [365,364,206,367,207,208], 'Nを見せてください / い-adjectives', '見せてください is a polite request to show something. サイズ is size; 長い and 短い describe length, while 重い and 軽い describe weight. These adjectives directly modify a noun or end a sentence with です.', [
 ['29 365 を 364~見せて~みせて ください','Please show me this size.'],['30 365 を 364~見せて~みせて ください','Please show me that size.'],['365 は 67 です','The size is large.'],['360 を 364~見せて~みせて ください','Please show me the shirt.'],['681 は 367 です','The trousers are long.'],['362 は 367 です','The skirt is long.'],['681 は 206 です','The trousers are short.'],['362 は 206 です','The skirt is short.'],['687 は 207 です','The bag is heavy.'],['490 は 207 です','The coat is heavy.'],['687 は 208 です','The bag is light.'],['490 は 208 です','The coat is light.']]);
lesson('checkout', 'At the checkout', [153,351,727,740,741,620], 'Nで払います / 別々に', '払います means pay. で marks a payment method, such as 現金で or カードで. お釣り is change returned after a purchase. 別々に means separately.', [
 ['741 で 727~払います~はらいます','I pay in cash.'],['351 で 727~払います~はらいます','I pay by card.'],['741 です か','Is it cash?'],['351 です か','Is it a card?'],['740 を ください','Please give me the change.'],['23 は 740 です','This is the change.'],['153 を 177~持っています~もっています','I have my wallet.'],['29 153 を 61~買います~かいます','I buy this wallet.'],['620 に 727~払います~はらいます','We pay separately.'],['620 です か','Is it separate?']]);
lesson('shop-people', 'In the shop', [698,735,734,175,353,494,497], 'Nを売っています / 他のN / もっと', '売っています describes what a shop sells. 店員 is a shop assistant; 客 is a customer. 売り場 is a sales area. 他の means other or another, and もっと means more.', [
 ['1 は 698 です','I am a shop assistant.'],['698 は 32 を 175~売っています~うっています','The shop assistant sells books.'],['1 は 735 です','I am a customer.'],['735 は 32 を 61~買います~かいます','The customer buys a book.'],['682 の 734 です','This is the clothing section.'],['353 の 734 です','This is the souvenir section.'],['353 を 61~買います~かいます','I buy a souvenir.'],['353 を 175~売っています~うっています','They sell souvenirs.'],['494 の 363 を 364~見せて~みせて ください','Please show me another color.'],['494 の 365 を 364~見せて~みせて ください','Please show me another size.'],['497 67 365 を 364~見せて~みせて ください','Please show me a larger size.'],['497 68 365 を 364~見せて~みせて ください','Please show me a smaller size.']]);
lesson('fashion', 'What you like to wear', [391,392,393,486,340], 'な-adjective + な + N', 'かっこいい and かわいい are い-adjectives. 綺麗 ends in the sound い but is a な-adjective: 綺麗な. おしゃれ is also a な-adjective. 着物 is traditional Japanese clothing and uses 着ます.', [
 ['360 は 391 です','The shirt looks cool.'],['391 490 です','It is a cool-looking coat.'],['362 は 392 です','The skirt is cute.'],['392 500 です','It is a cute dress.'],['393 な 340 です','It is a beautiful kimono.'],['340 は 393 です','The kimono is beautiful.'],['340 を 117~着ます~きます','I wear a kimono.'],['486 な 490 です','It is a stylish coat.'],['490 は 486 です','The coat is stylish.']]);

lesson('height', 'Describing height', [533], '私 は 背 が 高い です', 'In 背が高い, 背 means height or stature. は introduces the person and が marks the characteristic being described. This use of 高い means tall, rather than expensive.', [
 ['1 は 533 が 64 です','I am tall.'],['71 は 533 が 64 です','My friend is tall.'],['4 は 533 が 64 です か','Is the teacher tall?']]);
