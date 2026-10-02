export function authorMoney({topic,lesson,forms,course}) {
forms['だけ']=['だけ','only; limits the amount or scope'];
topic('money','Money and everyday finances','Use banking vocabulary, explain a payment, and discuss income, prices and financial changes.');
lesson('accounts','Accounts and transfers',[25,27,28,2635,525,197], '口座を作ります / Nに払い込みます / Nで払います', '口座 is a bank account; 預金 money deposited at a bank; 振込 a bank transfer. 払い込む means pay an amount into an account or toward an obligation. 金銭 is a formal word for money. 金額 is an amount of money. The examples describe ordinary payment conversations.', [
 ['@銀行 で 27 を @作る~作りました~つくりました','I opened an account at the bank.'],
 ['27 の @番号 を @確認~確認してください~かくにんしてください','Please check the account number.'],
 ['25 で @払う~払います~はらいます','I pay by bank transfer.'],
 ['25 の @前 に @名前 を @確認~確認します~かくにんします','I check the name before making the transfer.'],
 ['28 は @別 の 27 に @ある~あります~あります','The savings are in another account.'],
 ['28 の 197 を @見る~見ます~みます','I check the amount deposited.'],['25 の 197 が @違う~違います~ちがいます','The transfer amount is wrong.'],
 ['@お金 を 27 に 2635~払い込みます~はらいこみます','I pay money into the account.'],
 ['@昨日 2635~払い込みました~はらいこみました が @まだ @連絡 は @ある~ありません~ありません','I paid yesterday, but I have not heard anything yet.'],
 ['525 の @問題 について @話す~話します~はなします','We discuss a money problem.'],
 ['525 より @時間 を @大切 に @する~しています~しています','I value time more than money.'],
]);
lesson('income','Income and support',[21,1981,19,253,1697], 'Nをもらいます / Vために / 月給はいくら', '給料 is pay or salary; 月給 specifically a monthly salary. 年金 is a pension or annuity, not a yearly salary. 稼ぐ means earn income, and 小遣い spending money or an allowance.', [
 ['21 は @毎月 @銀行 の 27 に @入る~入ります~はいります','My salary goes into my bank account every month.'],
 ['21 から @生活 の @お金 を @払う~払います~はらいます','I pay living expenses from my salary.'],
 ['1981 は @いくら です か','How much is the monthly salary?'],
 ['1981 は @前 の @仕事 と @同じ です','The monthly salary is the same as in my previous job.'],
 ['19 を @もらう~もらっています~もらっています','I receive a pension.'],
 ['19 について @説明~説明してください~せつめいしてください','Please explain the pension.'],
 ['@生活 の ために @お金 を 253~稼ぎます~かせぎます','I earn money to live on.'],
 ['@夏 の @アルバイト で 253~稼ぎました~かせぎました','I earned money at a summer part-time job.'],
 ['1697 で @本 を @買う~買いました~かいました','I bought a book with my allowance.'],
 ['@毎月 の 1697 は @自分 で @決める~決めます~きめます','I decide my monthly spending money myself.'],
]);
lesson('budget','Saving and amounts',[422,539,18], 'Nを節約します / Nのために貯金します', '貯金 is saving or money saved; 節約 reducing what you spend or use. 金額 is an amount of money. 税金 is tax. Use のために for the purpose of saving, and distinguish a total amount from the money available to spend.', [
 ['@旅行 の ために 422 @する~しています~しています','I am saving for a trip.'],
 ['422 は @まだ @少ない です','My savings are still small.'],
 ['@電気 を 539 @する~しています~しています','I am saving electricity.'],
 ['539~節約して~せつやくして @本 を @買う~買いたい~かいたい です','I want to save money so I can buy a book.'],
 ['197 を @もう一度 @確認~確認します~かくにんします','I check the amount again.'],
 ['@この 197 に は 18 が @含む~含まれています~ふくまれています','This amount includes tax.'],
 ['18 を @払う~払いました~はらいました','I paid the tax.'],
]);
lesson('totals-and-shares','Totals and the larger share',[96,165], '合計で / Nの大半', '合計 is the total after amounts are added together; 合計する means add them up. 合計で introduces the total amount. Nの大半 means most of N, without giving an exact percentage.', [
 ['96 は @いくら です か','How much is the total?'],
 ['96 の 197 を @確認 @する~しました~しました','I checked the total amount.'],
 ['@買い物 の 96 を @計算 @する~しました~しました','I calculated the total for my shopping.'],
 ['96 で @千 @円 @払う~払いました~はらいました','I paid one thousand yen in total.'],
 ['21 の 165 を 620 に @使う~使います~つかいます','I spend most of my salary on rent.'],
 ['422 の 165 を @旅行 に @使う~使いました~つかいました','I spent most of my savings on a trip.'],
 ['@買い物 の 165 は @この @店 で @する~します~します','I do most of my shopping at this store.'],
 ['@お金 の 165 は @銀行 の 27 に @ある~あります~あります','Most of the money is in a bank account.'],
],{96:'total; sum',165:'most of; the greater part'});
course.lessons.at(-1).notes[0].title='A total and a share of it';
lesson('small-amounts','Some, a little, and very little',[87,58], '多少のN / わずかなN', '多少 describes some amount or a modest degree without specifying how much. Use 多少の before a noun. わずか emphasizes that an amount is very small; use わずかな before a noun. Compare 多少のお金, some money, with わずかなお金, very little money.', [
 ['87 @お金 が @残る~残りました~のこりました','I had some money left.'],
 ['87 の @違い が @ある~あります~あります','There is a slight difference.'],
 ['@値段 は 87 @高い です','The price is somewhat high.'],
 ['87 @時間 が 3004~かかります~かかります','It takes a little time.'],
 ['@残る~残った~のこった @お金 は 58 です','Very little money is left.'],
 ['58 な 197 を 422 @する~しました~しました','I saved a very small amount of money.'],
 ['@値段 の @差 は 58 でした','The price difference was very small.'],
 ['58 な @お金 で @旅行 @する~しました~しました','I traveled on very little money.'],
],{87:'some; somewhat; to a small degree',58:'very little; a very small amount',3004:'take (time)'});
course.lessons.at(-1).notes[0].title='How small is the amount?';
lesson('extra-money','Extra money and unnecessary purchases',[844], '余分なN / 余分にV', '余分 means extra or more than needed. 余分な modifies a noun, such as 余分なお金. 余分に describes an extra amount involved in an action. Depending on the situation, something extra may be useful or unnecessary.', [
 ['844 な @お金 は @持つ~持っていません~もっていません','I do not have any extra money with me.'],
 ['@旅行 の ために 844 に @お金 を @用意 @する~しました~しました','I prepared extra money for the trip.'],
 ['844 な @物 は @買う~買いません~かいません','I do not buy unnecessary things.'],
 ['844 に @払う~払った~はらった @お金 が @戻る~戻ってきました~もどってきました','The extra money I had paid was returned.'],
],{844:'extra; more than needed'});
course.lessons.at(-1).notes[0].title='Useful extra or unnecessary extra';
lesson('currency','Currencies and cash',[213,883,1795,1164,1640,1636], 'Nが通用します / Nの為替 / 紙幣と硬貨', '通貨 is a currency, 紙幣 a banknote, and 硬貨 a coin. 銅貨 is a copper coin. 為替 can refer to exchange between currencies; 通用する means be accepted or have currency in a place.', [
 ['@この @国 の 213 は @何~何~なん です か','What is this country’s currency?'],
 ['@外国 の 213 を @持つ~持っています~もっています','I have some foreign currency.'],
 ['883 と 1795 を @別々 に @する~します~します','I separate the coins and banknotes.'],
 ['883 は @重い です が 1795 は @軽い です','Coins are heavy, while banknotes are light.'],
 ['@古い 1164 を @見る~見ました~みました','I saw an old copper coin.'],
 ['1164 は @博物館 に @ある~あります~あります','The copper coin is in the museum.'],
 ['1640 の @情報 を @調べる~調べます~しらべます','I look up foreign-exchange information.'],
 ['1640 は @毎日 @変わる~変わります~かわります','Exchange rates change every day.'],
 ['@この 213 は @ここ で 1636~通用します~つうようします','This currency is accepted here.'],
 ['@古い 1795 は 1636~通用しません~つうようしません','The old banknote is not accepted.'],
]);
lesson('lending','Lending and assets',[182,242,2076,227,173], 'Nに貸しがあります / Nの貸出 / Nを集めます', '貸し is a loan or a favor owed to you, while 借金 is borrowed money or debt. 貸出 names the lending service or action. 資本 is capital used for business, and 財産 property or assets. A bank deposit, a loan and a business’s capital are different concepts.', [
 ['@彼 に 182 が @ある~あります~あります','He owes me a favor.'],
 ['@彼 に 182 は @もう @ある~ありません~ありません','He no longer owes me a favor.'],
 ['242 を @返す~返しています~かえしています','I am repaying the debt.'],
 ['242 の 197 を @確認~確認しました~かくにんしました','I checked the amount of the debt.'],
 ['@本 の 2076 は @無料 です','Book lending is free.'],
 ['2076 の @期間 を @聞く~聞きました~ききました','I asked about the lending period.'],
 ['@店 の ために 227 を @集める~集めます~あつめます','I raise capital for the shop.'],
 ['227 は @十分 です か','Is there enough capital?'],
 ['@家族 の 173 を @守る~守ります~まもります','I protect the family’s assets.'],
 ['173 に は 28 も @含む~含まれます~ふくまれます','Assets include bank deposits.'],
]);
lesson('prices','Prices and values',[799,869,603,1637,2721], 'Nの代金 / 定価で / Nの値', '代金 is the amount paid for something. 定価 is its listed price; 物価 refers to prices in the economy generally. 高価 means expensive or valuable. 値 here is read あたい and means a value; it can be numerical as well as monetary.', [
 ['@本 の 799 を @払う~払いました~はらいました','I paid for the book.'],
 ['799 は @まだ @払う~払っていません~はらっていません','I have not paid the amount yet.'],
 ['869 が @高い です','Prices are high.'],
 ['869 の @変化 を @調べる~調べます~しらべます','I study changes in prices.'],
 ['603 な @時計 を @見せる~見せてもらいました~みせてもらいました','I was shown an expensive watch.'],
 ['@この @本 は 603 です が @価値 が @ある~あります~あります','This book is expensive but has value.'],
 ['1637 で @買う~買いました~かいました','I bought it at the listed price.'],
 ['1637 は @いくら です か','What is the list price?'],
 ['2721 を @計算~計算します~けいさんします','I calculate the value.'],
 ['2721 は @同じ です','The values are the same.'],
]);
lesson('profit','Profit, loss and damage',[232,1907,2163,2355,289], 'Nで儲けます / Nが儲かります / 損をします', '儲ける is make a profit; 儲かる means be profitable. 損 is a loss or disadvantage; 損得 gains and losses considered together. 損害 is damage or loss caused by an event. These differences help you describe a result without confusing it with sales revenue. だけ limits the scope: 損得だけでは means on gains and losses alone.', [
 ['@この @仕事 で 2163~儲けました~もうけました','I made a profit from this work.'],
 ['2163~儲ける~もうける の は @簡単 ではありません','Making a profit is not easy.'],
 ['@この @店 は 1907~儲かっています~もうかっています','This shop is making a profit.'],
 ['@去年 は 1907~儲かりませんでした~もうかりませんでした','It was not profitable last year.'],
 ['232 を @する~しました~しました','I made a loss.'],
 ['@時間 の 232 です','It is a loss of time.'],
 ['2355 を @考える~考えます~かんがえます','I consider the gains and losses.'],
 ['2355 だけ で は @決める~決められません~きめられません','I cannot decide on gains and losses alone.'],
 ['@雨 で 289 が @出る~出ました~でました','The rain caused damage.'],
 ['289 の 197 を @調べる~調べます~しらべます','I investigate the amount of the damage.'],
]);
lesson('changes','Financial change',[607,673,741,1230,2782,42], 'Nに投資します / Nが倒産しました / Nについて勉強します', '投資 is investment and 株 a share of stock. 経済 is the economy. 倒産 describes a business failure; 破産 bankruptcy, a more specific concept. 貧しい describes a lack of material resources here.', [
 ['@その @会社 の 1230 を @持つ~持っています~もっています','I own shares in that company.'],
 ['1230 の @価格 を @確認~確認します~かくにんします','I check the share price.'],
 ['2782 について @勉強 @する~しています~しています','I am studying investment.'],
 ['@新しい @店 に 2782~投資しました~とうししました','I invested in the new shop.'],
 ['42 の @情報 を @読む~読みます~よみます','I read economic information.'],
 ['42 の @変化 は @生活 に @影響 @する~します~します','Economic changes affect everyday life.'],
 ['@会社 が 673~倒産しました~とうさんしました','The company went out of business.'],
 ['673 の @原因 を @調べる~調べます~しらべます','I investigate the cause of the business failure.'],
 ['607 について @説明~説明します~せつめいします','I explain bankruptcy.'],
 ['607 の @後 の @生活 について @話す~話しました~はなしました','They talked about life after bankruptcy.'],
 ['@子供 の @時 は 741~貧しかった~まずしかった です','I was poor as a child.'],
 ['741 @村 に @学校 を @作る~作ります~つくります','We build a school in a poor village.'],
]);
lesson('taxes','Tax and payment records',[1728,2268,2218,1937,125], 'Nに課税されます / Nの領収 / Nを請求します', '課税 is imposing tax; 免税 exemption from tax. 請求 requests an amount due; 集金 collects payments; 領収 acknowledges receipt of money. 課税されます is passive, is taxed. かどうか embeds a question: whether or not something is the case.', [
 ['@この @商品 に は 1728~課税されます~かぜいされます','This product is taxed.'],
 ['1728 の @条件 を @確認~確認します~かくにんします','I check the conditions for taxation.'],
 ['2268 に @なる~なる~なる かどうか @店 で @聞く~聞きます~ききます','I ask at the shop whether it is tax-exempt.'],
 ['2268 の 197 を @確認~確認してください~かくにんしてください','Please check the tax-exempt amount.'],
 ['@午後 に 2218 に @行く~行きます~いきます','I go to collect the payments in the afternoon.'],
 ['2218~集金した~しゅうきんした @お金 を 27 に @入れる~入れます~いれます','I deposit the money collected into the account.'],
 ['799 の 1937 を @確認~確認します~かくにんします','I confirm that the payment was received.'],
 ['1937~領収した~りょうしゅうした 197 を @書く~書きます~かきます','I write the amount received.'],
 ['799 を 125~請求します~せいきゅうします','I request payment of the amount due.'],
 ['125 の @内容 を @読む~読みました~よみました','I read the details of the bill.'],
]);
lesson('trip-expenses','Looking back at travel expenses',[], '合計します / 大半 / わずかに残ります', '大半 describes most of the total. わずかに残る describes only a very small amount remaining.', [
 ['@旅行 の 111 を 96 @する~しました~しました','I added up the expenses for the trip.'],
 ['165 は @ホテル に @払う~払った~はらった @お金 でした','Most of it was money paid to the hotel.'],
 ['@買い物 に も 87 @お金 を @使う~使いました~つかいました','I also spent some money on shopping.'],
 ['844 に @用意 @する~した~した @お金 が 58 に @残る~残りました~のこりました','A very small amount of the extra money I had prepared was left.'],
],{111:'expense; cost',96:'total; add up',165:'most of; the greater part',87:'some; a small amount',844:'extra; more than needed',58:'very little; a very small amount'});
course.lessons.at(-1).notes[0].title='Adding up what you spent';
}
