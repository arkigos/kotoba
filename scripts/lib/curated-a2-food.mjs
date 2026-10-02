export function authorFood({topic,lesson,lines,forms}) {
forms['という']=['という','called; identifies a name or a word before a noun'];
topic('cooking','Food and cooking','Describe flavors, prepare a meal, and explain how you like your food.');
lesson('cafe','At a café',[74,75,76,77,78,79,80], 'Nにします / Nはありませんか', 'At a café, Nにします announces your choice. ありませんか politely asks whether something is available. These patterns use words and endings already encountered in A1.', [
 ...lines([[74,'chocolate'],[75,'ice cream'],[76,'cake'],[77,'cookies']], [['$ が @好き です','I like $.'],['$ は @ある~ありません~ありません か','Do you have any $?']]),
 ...lines([[78,'a sandwich'],[79,'a salad'],[80,'soup']], [['$ に @する~します~します','I will have $.'],['$ は @ある~ありません~ありません か','Do you have $?']]),
]);
lesson('breakfast','Breakfast and drinks',[81,82,83,84,85,120], 'Nを入れます / Nは飲みません', 'を marks what you add, and に marks what you add it to. Choose natural combinations: butter on bread, fruit in yogurt, and ice in a drink. Negative は can contrast the drink you avoid.', [
 ['81 に @果物 を @入れる~入れます~いれます','I put fruit in my yogurt.'],['@朝 は 81 を @食べる~食べます~たべます','I eat yogurt in the morning.'],
 ['82 の @パン を @作る~作ります~つくります','I make cheese bread.'],['82 が @好き です','I like cheese.'],
 ['83 を @買う~買います~かいます','I will buy butter.'],['@この @パン は 83 が @多い です','This bread has a lot of butter in it.'],
 ...lines([[84,'beer'],[85,'wine'],[120,'soda']], [['$ は @飲む~飲みません~のみません','I do not drink $.'],['$ を @少し @飲む~飲みました~のみました','I drank a little $.']]),
]);
lesson('ingredients','Ingredients and snacks',[6,15,16,17,172,553], 'Nが入っています / Nは入っていません', '入っています describes what is already inside something. This is useful for asking about ingredients. The question Nが入っていますか asks whether a dish contains N; it does not guarantee that the dish is safe for an allergy.', [
 ['6 を @少し @食べる~食べました~たべました','I ate a few snacks.'],['@この 6 は @甘い です','These sweets are sweet.'],
 ['15 が 80 に @入る~入っています~はいっています','There is daikon in the soup.'],['15 の @味噌汁 を @作る~作ります~つくります','I make miso soup with daikon.'],
 ['16 が 79 に @入る~入っています~はいっています か','Does the salad contain shrimp?'],['@この 79 に 16 は @入る~入っていません~はいっていません','This salad does not contain shrimp.'],
 ['17 は @入る~入っていません~はいっていません','There is no wasabi in it.'],['17 を @少し @入れる~入れます~いれます','I add a little wasabi.'],
 ['172 は @とても @甘い です','The candy is very sweet.'],['172 を @一つ ください','Please give me one piece of candy.'],
 ['553 を @買う~買いました~かいました','I bought jam.'],['@この 553 は @いちご の 553 です','This jam is strawberry jam.'],
]);
lesson('naming-food','Introducing a dish by name',[], 'NというN', 'Put a name before という and its category after it: 天ぷらという料理 means a dish called tempura. Imagine introducing familiar dishes to someone who does not know their Japanese names. The whole phrase can take が or を, just like an ordinary noun. Here という identifies a name; it does not report that someone said something.', [
 ['@これ は @天ぷら という @料理 です','This is a dish called tempura.'],
 ['@寿司 という @料理 を @知る~知っています~しっています か','Do you know the dish called sushi?'],
 ['@うどん という @食べ物 を @食べる~食べました~たべました','I ate a food called udon.'],
 ['@カレー という @料理 を @作る~作りました~つくりました','I made a dish called curry.'],
 ['@天ぷら という @料理 が @好き です','I like the dish called tempura.'],
 ['@ラーメン という @料理 を @食べる~食べたい~たべたい です','I want to eat the dish called ramen.'],
]);
lesson('cutting','Cutting and wrapping',[5,169,641,1151], 'VてからV / Vないでください', 'A て-form followed by から puts actions in order: cut first, then put it in the pot. 切る becomes 切って; 包む becomes 包んで. The negative request 切らないでください means “please do not cut it”.', [
 ['@野菜 を 5~切って~きって から @鍋 に @入れる~入れます~いれます','I cut the vegetables and then put them in the pot.'],
 ['@この @パン は 5~切らないでください~きらないでください','Please do not cut this bread.'],
 ['169 で @パン を 5~切ります~きります','I cut the bread with a knife.'],['169 を @洗う~洗ってください~あらってください','Please wash the knife.'],
 ['78 を 641~包みます~つつみます','I wrap the sandwich.'],['78 を 641~包んで~つつんで から 1151 に @入れる~入れます~いれます','I wrap the sandwich and then put it in a bag.'],
 ['@この 1151 に @パン を @入れる~入れてください~いれてください','Please put the bread in this bag.'],
]);
lesson('heating','Cooking and boiling',[500,587,604,615,423], '焼きます・焼けます / 沸かします・沸きます', 'Compare an action you do with a change that happens: 魚を焼きます means “I grill the fish”; 魚が焼けました means “the fish is cooked”. 水を沸かします means “I boil water”; 湯が沸きました means “the water has boiled”. 焼く covers grilling, baking or roasting depending on the food; it is not the general word for every way of cooking. Keep を for the object of your action and が for what changes.', [
 ['@魚 を 500~焼きます~やきます','I grill the fish.'],['@肉 を 500~焼いて~やいて から @野菜 を 500~焼きます~やきます','I grill the meat and then the vegetables.'],
 ['@魚 が 587~焼けました~やけました','The fish is cooked.'],['@パン が 587~焼けました~やけました','The bread is baked.'],
 ['@水 を 615~沸かします~わかします','I boil water.'],['@鍋 で @水 を 615~沸かしてください~わかしてください','Please boil water in a pot.'],
 ['423 が 604~沸きました~わきました','The water has boiled.'],['423 が 604~沸いています~わいています','The water is boiling.'],
]);
lesson('texture','Texture and temperature',[512,514,586,656], 'い-adjective + N / Vています', 'An い-adjective goes directly before a noun: 柔らかいパン. 冷えています describes something that has become cold. 生の uses の because 生 here is a noun meaning raw or uncooked.', [
 ['@この @パン は 512 です','This bread is hard.'],['512 @肉 は @食べる~食べません~たべません','I do not eat tough meat.'],
 ['514 @パン が @好き です','I like soft bread.'],['@この @肉 は 514 です','This meat is tender.'],
 ['84 は 586~冷えています~ひえています','The beer is cold.'],['85 も 586~冷えています~ひえています','The wine is chilled too.'],
 ['656 の @魚 は @食べる~食べません~たべません','I do not eat raw fish.'],['656 の @卵 が @入る~入っています~はいっています か','Does it contain raw egg?'],
]);
lesson('main-meals','Meals and tastes',[175,525,548,279,370,751,126], 'Nの味 / Nの匂い / Nにします', '味 is taste and 匂い is smell. の links the food or drink to that quality. 夕飯 is an everyday word for the evening meal. 酒 can refer to alcohol generally; 日本酒 specifically means sake.', [
 ['175 は 525 に @する~します~します','I will have steak for dinner.'],['175 の @時間 です','It is dinnertime.'],
 ['@この 525 は 514 です','This steak is tender.'],['548 を @作る~作りました~つくりました','I made a hamburger steak.'],['548 が @好き です','I like hamburger steak.'],
 ['@この 80 の 279 が @好き です','I like the taste of this soup.'],['@この 279 は @少し @違う~違います~ちがいます','This flavor is a little different.'],
 ['@コーヒー の 370 が @する~します~します','It smells of coffee.'],['@いい 370 です','It smells good.'],
 ['751 は 126 @飲む~飲みません~のみません','I do not drink much alcohol.'],['85 は 126 @飲む~飲みません~のみません','I do not drink much wine.'],['751 の 370 が @する~します~します','It smells of alcohol.'],
]);
lesson('finishing','Finishing a meal',[541,620,939,569], 'Vてみます / Vてください', 'The て-form plus みます means try doing something. 漬けてみます means “I will try pickling it”. 噛んでください asks someone to chew. 一切れ is one slice or piece; the reading is ひときれ.', [
 ['@よく 541~噛んでください~かんでください','Please chew well.'],['@ゆっくり 541~噛んで~かんで @食べる~食べます~たべます','I chew slowly as I eat.'],
 ['15 を 620~漬けてみます~つけてみます','I will try pickling daikon.'],['@野菜 を @塩 に 620~漬けます~つけます','I pickle vegetables in salt.'],
 ['76 を @一~一~ひと 939 @食べる~食べました~たべました','I ate one slice of cake.'],['@パン を @一~一~ひと 939 ください','Please give me one slice of bread.'],
 ['@今日 は 569 です','We are having a feast today.'],['569 を @作る~作りました~つくりました','I prepared a special meal.'],
]);
lesson('food-words','Everyday food words',[630,1149,485,1203], 'Nの店 / Nはありません', '食料品 and 食品 both refer to food products. アルコール names alcohol as a substance as well as alcoholic drinks. 飯 is a casual, sometimes rough word for a meal or cooked rice; use ご飯 in neutral polite conversation.', [
 ['630 の @店 で @買い物 を @する~します~します','I shop at a grocery store.'],['630 を @買う~買います~かいます','I buy groceries.'],
 ['@この 1149 は @安い です','This food product is inexpensive.'],['1149 を @売る~売っています~うっています','They sell food products.'],
 ['@この @飲み物 に 485 は @入る~入っていません~はいっていません','This drink does not contain alcohol.'],['485 は @飲む~飲めません~のめません','I cannot drink alcohol.'],
 ['1203 を @食べる~食べる~たべる','I eat a meal.'],['1203 は @まだ です か','Is the meal ready yet?'],
]);
}
