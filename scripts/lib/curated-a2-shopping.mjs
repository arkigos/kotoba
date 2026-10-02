export function authorShopping({topic,lesson,lines,forms}) {
forms['とも']=['とも','both; all of the stated number'];
forms['より']=['より','than; comparison baseline'];
forms['ほう']=['ほう','side or alternative in a comparison'];
topic('shopping','Shopping and clothing','Compare purchases, explain a preference, and handle payments and deliveries.');
lesson('prices','Comparing prices',[337,825,34,453,362], 'この 店 は 値段 が 安い です', 'より marks the comparison baseline. AよりBのほうが安いです means B is cheaper than A. 値段 is the everyday word for price; 価格 is common in price information. 両方 means both alternatives.', [
 ['@この @店 は 337 が @安い です','Prices at this shop are low.'],['337 を @聞く~聞きます~ききます','I ask the price.'],
 ['825 を 453~比べます~くらべます','I compare prices.'],['825 は @同じ です','The prices are the same.'],
 ['34 が @ある~あります~あります か','Is there a discount?'],['@学生 の 34 が @ある~あります~あります','There is a student discount.'],
 ['@二つ の @店 を 453~比べます~くらべます','I compare two shops.'],['@これ より @それ の ほう が @安い です','That one is cheaper than this one.'],
 ['362 とも @安い です','Both are inexpensive.'],['362 を @買う~買います~かいます','I will buy both.'],
]);
lesson('checkout','Paying at the checkout',[33,35,36,37,102,109], 'Nで支払いをします / Nをください', 'で can mark a method of payment: クレジットカードで支払いをします. 会計 is settling the bill; 支払い is payment. 両替 is exchanging money, and 領収書 is a receipt suitable for keeping a record of a payment.', [
 ['33 を ください','Please give me a receipt.'],['33 は @メール で @送る~送ります~おくります','I will send the receipt by email.'],
 ['35 を @する~します~します','I will pay the bill.'],['35 は @ここ です か','Do I pay here?'],
 ['36 は 109 で @する~します~します','I will pay by credit card.'],['@現金 で 36 を @する~します~します','I make a payment in cash.'],
 ['37 を @する~します~します','I exchange money.'],['@銀行 で 37 を @する~しました~しました','I exchanged money at the bank.'],
 ['102 で @払う~払います~はらいます','I pay at the register.'],['102 は @入り口 の @近く です','The register is near the entrance.'],
 ['109 は @使う~使えます~つかえます か','Can I use a credit card?'],
]);
lesson('goods','Choosing goods',[581,759,952,694,885,988], 'Nを選びます / Nを販売しています', '品物 is a general word for an item or goods. 商品 emphasizes an item for sale; 製品 emphasizes a manufactured product. 販売する means sell. A セット is a set of items sold or used together.', [
 ['581 を @選ぶ~選びます~えらびます','I choose an item.'],['@この 581 は @安い です','This item is inexpensive.'],
 ['759 を @見せる~見せてください~みせてください','Please show me the product.'],['@新しい 759 が @ある~あります~あります','There is a new product.'],
 ['@日本 の 952 です','It is a Japanese product.'],['@この 952 を @使う~使っています~つかっています','I use this product.'],
 ['@この @店 は @靴 を 694~販売しています~はんばいしています','This shop sells shoes.'],['694 の @仕事 を @する~しています~しています','I work in sales.'],
 ['885 は @いい です','The service is good.'],['@この 885 は @無料 です','This service is free.'],
 ['@この 988 を @買う~買います~かいます','I will buy this set.'],['@カップ の 988 です','It is a set of cups.'],
]);
lesson('ease','Easy or difficult to use',[], 'Vます-stem + やすい / にくい', 'Remove ます and add やすい for easy to do, or にくい for difficult to do: 書きます → 書きやすい / 書きにくい. These endings describe how an action feels or how readily it happens. They do not mean cheap or expensive. The result behaves like an い-adjective.', [
 ['@この @ペン は @書く~書きやすい~かきやすい です','This pen is easy to write with.'],
 ['@この @靴 は @歩く~歩きやすい~あるきやすい です','These shoes are easy to walk in.'],
 ['@この @本 の @大きい @字 は @読む~読みやすい~よみやすい です','The large print in this book is easy to read.'],
 ['@この @ペン は @書く~書きにくい~かきにくい です','This pen is difficult to write with.'],
 ['@この @靴 は @歩く~歩きにくい~あるきにくい です','These shoes are difficult to walk in.'],
 ['@この @本 の @小さい @字 は @読む~読みにくい~よみにくい です','The small print in this book is difficult to read.'],
]);
lesson('shirts','Shirts and formal clothing',[96,97,98,197,198,99], 'Nを着ています / Nをしています', '着ています describes what someone is wearing. A tie uses ネクタイをしています. 背広 is an older everyday word for a suit; ワイシャツ is a dress shirt. クリーニング commonly means professional dry cleaning.', [
 ...lines([[96,'sweater'],[98,'suit'],[197,'dress shirt'],[198,'suit']], [['$ を @着る~着ています~きています','I am wearing a $.'],['@新しい $ を @買う~買いました~かいました','I bought a new $.']]),
 ['97 を @する~しています~しています','I am wearing a tie.'],['@青い 97 を @買う~買いました~かいました','I bought a blue tie.'],
 ['98 を 99 に @出す~出します~だします','I send my suit to the dry cleaner.'],['99 の @店 は @どこ です か','Where is the dry-cleaning shop?'],
]);
lesson('accessories','Shoes and accessories',[505,576,547,480,155,176,191,192], 'Nをします / Nをかぶります / Nを差します', 'Japanese chooses different verbs for things you wear or carry: 帽子をかぶる for a hat, ネクタイを締める for a tie, 傘を差す for opening and holding an umbrella. オーバー is an older word for an overcoat; learners may also hear コート.', [
 ['505 を @する~します~します','I put on gloves.'],['505 は 155 に @ある~あります~あります','The gloves are in my pocket.'],
 ['576 を @履く~履きます~はきます','I put on sandals.'],['@この 576 は @軽い です','These sandals are light.'],
 ['547 を @買う~買いました~かいました','I bought an accessory.'],['547 は @箱 の @中 に @ある~あります~あります','The accessories are inside the box.'],
 ['480 を @着る~着ます~きます','I put on an overcoat.'],['@この 480 は @暖かい です','This overcoat is warm.'],
 ['155 に @鍵 が @ある~あります~あります','There is a key in my pocket.'],['@この @服 は 155 が @多い です','These clothes have many pockets.'],
 ['@帽子 を 176~かぶっています~かぶっています','I am wearing a hat.'],['@白い @帽子 を 176~かぶります~かぶります','I put on a white hat.'],
 ['97 を 191~締めます~しめます','I tie my necktie.'],['97 を 191~締めました~しめました','I tied my necktie.'],
 ['@傘 を 192~差します~さします','I open my umbrella and hold it over me.'],['@傘 を 192~差して~さして @歩く~歩きます~あるきます','I walk with my umbrella up.'],
]);
lesson('materials','Materials and patterns',[565,600,145,177,1075,1112,1215], 'NのN / い-adjective + N', '絹 is silk and 木綿 is cotton. 銀 and 鉄 are silver and iron. Use の to state a material, as in 銀の指輪. Thin and thick are 薄い and 厚い; both go directly before a noun.', [
 ['565 の @服 です','These are silk clothes.'],['565 は @高い です','Silk is expensive.'],
 ['600 の @シャツ です','It is a cotton shirt.'],['600 の @服 が @好き です','I like cotton clothes.'],
 ['145 @服 を @着る~着ます~きます','I wear thin clothes.'],['@この @シャツ は 145 です','This shirt is thin.'],
 ['177 @コート を @着る~着ます~きます','I wear a thick coat.'],['@この @服 は 177 です','These clothes are thick.'],
 ['@この 1075 が @好き です','I like this pattern.'],['@花 の 1075 です','It is a floral pattern.'],
 ['1112 の @指輪 を @買う~買いました~かいました','I bought a silver ring.'],['@この @指輪 は 1112 です','This ring is made of silver.'],
 ['1215 の @鍋 を @使う~使います~つかいます','I use an iron pot.'],['1215 は @重い です','Iron is heavy.'],
]);
lesson('preferences','Explaining your choice',[1061,897,1099,830,837,347], 'Nのほうが好きです / Nに合います', '好み is a preference. Nによります means depends on N: 人によります, it depends on the person. 中身 is the contents inside something, while 広告 is an advertisement. 消費 means consumption. State your own preference with 私はNのほうが好きです; this does not claim one choice is better for everyone.', [
 ['@これ は @私 の 1061 です','This is to my taste.'],['1061 は @人 に 837~よります~よります','Preferences depend on the person.'],
 ['337 は @店 に 837~よります~よります','The price depends on the shop.'],['@この @服 は @私 に 347~合います~あいます','These clothes suit me.'],['@この @靴 は @私 に 347~合いません~あいません','These shoes do not fit me.'],['897 を @見る~見ます~みます','I look at an advertisement.'],['@店 の 897 です','It is an advertisement for the shop.'],
 ['@箱 の 1099 を @見る~見ます~みます','I look at the contents of the box.'],['1099 は @服 です','The contents are clothes.'],
 ['@水 の 830 が @多い です','Water consumption is high.'],['@電気 の 830 が @少ない です','Electricity consumption is low.'],
 ['@私 は @青い @シャツ の ほう が @好き です','I prefer the blue shirt.'],
]);
lesson('post','Sending mail',[40,41,42,43,147,161], 'NにNを入れます / 人にNを渡します', 'Put a letter in an envelope with 封筒に手紙を入れます. 渡す means hand something to someone; に marks that person. 郵便 is mail, ポスト a mailbox, and はがき a postcard.', [
 ['40 が @来る~来ました~きました','The mail has arrived.'],['40 で @送る~送ります~おくります','I will send it by mail.'],
 ['41 を @買う~買います~かいます','I buy a stamp.'],['41 は @いくら です か','How much is a stamp?'],
 ['42 に @手紙 を @入れる~入れます~いれます','I put the letter in an envelope.'],['42 に @住所 を @書く~書きます~かきます','I write the address on the envelope.'],
 ['43 を @書く~書きます~かきます','I write a postcard.'],['43 を @友達 に @送る~送ります~おくります','I send a postcard to my friend.'],
 ['147 に @手紙 を @入れる~入れます~いれます','I put the letter in the mailbox.'],['147 は @駅 の @前 に @ある~あります~あります','There is a mailbox in front of the station.'],
 ['@手紙 を @友達 に 161~渡します~わたします','I hand the letter to my friend.'],['42 を @母 に 161~渡しました~わたしました','I handed the envelope to my mother.'],
]);
lesson('delivery','Receiving deliveries',[38,39,536,542,943], 'Nを届けます / Nは留守です', '配達 is delivery and 宅配便 a parcel-delivery service. 届ける means deliver something. 留守 means being away from home; なし means without or absent, as in 割引なし, “no discount”.', [
 ['38 は @明日 です','Delivery is tomorrow.'],['@店 は 38 を @する~します~します か','Does the shop make deliveries?'],
 ['39 で @荷物 を @送る~送ります~おくります','I send the package by parcel service.'],['39 が @来る~来ました~きました','The parcel delivery has arrived.'],
 ['@荷物 を 536~届けます~とどけます','I deliver the package.'],['@家 に 536~届けてください~とどけてください','Please deliver it to my home.'],
 ['@明日 は 542 です','I will be out tomorrow.'],['@私 は 542 でした','I was away from home.'],
 ['34 は 943 です','There is no discount.'],['897 943 の 885 です','It is a service without advertising.'],
]);
}
