import { topic, lesson, lines, finish, course } from './lib/curated-course-authoring.mjs';
import { placeA1Chapters } from './lib/curated-a1-chapters.mjs';

topic('food', 'Food and drink', 'Order a meal, talk about tastes, and prepare simple food.');
lesson('first-meal', 'Something to eat and drink', [34,35,36,37,38], 'NをVます / Vますか', 'を marks what you eat or drink. 食べる becomes 食べます; 飲む becomes 飲みます in polite speech. Add か for a question; replace ます with ません for a negative. は in the negative singles out the food or drink. Japanese often leaves out an obvious “I” or “you”.', [
 ['34 を 38~飲みます~のみます','I drink water.'],['35 を 38~飲みます~のみます','I drink tea.'],['36 を 37~食べます~たべます','I eat rice.'],
 ['34 を 38~飲みます~のみます か','Do you drink water?'],['35 を 38~飲みます~のみます か','Do you drink tea?'],['36 を 37~食べます~たべます か','Do you eat rice?'],
 ['34 は 38~飲みません~のみません','I do not drink water.'],['35 は 38~飲みません~のみません','I do not drink tea.'],['36 は 37~食べません~たべません','I do not eat rice.']]);
course.lessons.at(-1).notes = [
 {start:1,title:'Eating and drinking',pattern:'水を飲みます',explanation:'を marks what you eat or drink. 食べる becomes 食べます; 飲む becomes 飲みます in polite speech. Japanese often leaves out an obvious “I” or “you”.'},
 {start:4,title:'Ask a question',pattern:'水を飲みますか',explanation:'Add か to the polite statement to ask a question. The object still takes を. Context tells you whether the question asks about a habit or what someone will have now.'},
 {start:7,title:'Say what you do not eat or drink',pattern:'水は飲みません',explanation:'Replace ます with ません for the polite negative. は singles out this drink or food: “As for water, I do not drink it.”'}
];
lesson('at-the-table', 'At the table', [121,122,123,124,125,127], 'これはNです / Nを食べます', 'Use これは to identify something in front of you. 食べます is polite “eat”; its question ends in か. 食べ物 and 飲み物 name the categories food and drink.', [
 ...lines([[121,'food'],[122,'a drink']], [['23 は $ です','This is $.'],['23 は $ です か','Is this $?']]),
 ...lines([[123,'vegetables'],[124,'meat'],[125,'fish'],[127,'bread']], [['$ を 37~食べます~たべます','I eat $.'],['$ を 37~食べます~たべます か','Do you eat $?'],['$ は 37~食べません~たべません','I do not eat $.']])]);
lesson('pointing-to-food', 'Pointing to food and drinks', [], 'それ・あれ / NをVますか / NはVません', 'Use それ for something near the listener and あれ for something away from both of you. You can use either word in place of a food or drink name.', [
 ['24 は 34 です か','Is that water?'],
 ['25 は 35 です か','Is that over there tea?'],
 ['24 は 36 です か','Is that rice?'],
 ['25 は 127 です か','Is that over there bread?'],
 ['24 も 121 です','That is food too.'],
 ['25 も 122 です','That over there is a drink too.'],
 ['24 は 1 の 127 です','That is my bread.'],
 ['25 は 4 の 35 です','That over there is the teacher’s tea.'],
 ['24 を 37~食べます~たべます か','Will you eat that?'],
 ['24 は 37~食べません~たべません','I will not eat that.'],
 ['25 を 38~飲みます~のみます か','Will you drink that over there?'],
 ['25 は 38~飲みません~のみません','I will not drink that over there.'],
]);
course.lessons.at(-1).notes[0].title = 'Point to a choice';
lesson('drinks', 'Choosing a drink', [126,128,399,400,402], 'Nをください / Nは飲みません', 'Nをください is a practical way to ask for an item. With は in the negative, you single out that drink: “As for coffee, I do not drink it.”', lines([[126,'milk'],[128,'coffee'],[399,'juice'],[400,'black tea'],[402,'cola']], [['$ を ください','Please give me $.'],['$ を 38~飲みます~のみます か','Do you drink $?'],['$ は 38~飲みません~のみません','I do not drink $.']]));
lesson('taste', 'How does it taste?', [97,261,262,606,607,608,609], 'い-adjective + です', 'い-adjectives keep their final い before です. 熱い and 冷たい describe the temperature of food and objects. Match the adjective to what you are tasting.', [
 ['36 は 97 です','The rice is delicious.'],['35 は 97 です','The tea is delicious.'],['35 は 261 です','The tea is hot.'],['36 は 261 です','The rice is hot.'],['34 は 262 です','The water is cold.'],['126 は 262 です','The milk is cold.'],['399 は 606 です','The juice is sweet.'],['402 は 606 です','The cola is sweet.'],['124 は 607 です','The meat is spicy.'],['125 は 607 です','The fish is spicy.'],['124 は 608 です','The meat is salty.'],['125 は 608 です','The fish is salty.'],['128 は 609 です','The coffee is bitter.'],['35 は 609 です','The tea is bitter.']]);
lesson('menu', 'Reading a menu', [131,303,304,305,306,307,308,404], 'NのN / Nをください', 'の links nouns: レストランのメニュー is a restaurant’s menu. Use をください when ordering. These are specific dishes, so you do not need an extra “food” word.', [
 ['23 は 304 です','This is the menu.'],['23 は 131 の 304 です','This is the restaurant’s menu.'],['304 を ください','The menu, please.'],['131 の 36 は 97 です','The restaurant’s rice is delicious.'],
 ...lines([[303,'curry'],[305,'pizza'],[306,'ramen'],[307,'sushi'],[308,'udon'],[404,'soba']], [['$ を ください','I would like $, please.'],['$ は 97 です','The $ is delicious.'],['$ を 37~食べます~たべます か','Would you like to eat $?']])]);
lesson('more-dishes', 'A simple meal', [130,403,406,512,671,444], 'NとN / Nを食べます', 'と joins nouns in a list. A meal can have several parts. は marks the dish you are commenting on; these statements do not require an explicit subject pronoun.', [
 ...lines([[130,'eggs'],[403,'miso soup'],[406,'a hamburger'],[512,'tempura'],[671,'a bento']], [['$ を 37~食べます~たべます','I eat $.'],['$ を ください','I would like $, please.']]),
 ['36 と 403 を 37~食べます~たべます','I eat rice and miso soup.'],['444 は 97 です','The meal is delicious.'],['131 の 444 は 97 です','The restaurant’s food is delicious.']]);
lesson('fruit', 'Fruit for dessert', [129,677,678,679,680], 'これはNです / Nは甘いです', 'Use は with a taste description. これは identifies a fruit in front of you. Japanese nouns do not change between singular and plural; choose an English article from the situation.', lines([[129,'fruit'],[677,'an apple'],[678,'a banana'],[679,'a mandarin'],[680,'a strawberry']], [['23 は $ です','This is $.'],['$ を 37~食べます~たべます','I eat $.'],['$ は 606 です','$ tastes sweet.']]));
lesson('ingredients', 'Ingredients for cooking', [657,658,659,660,666,674,675,676], 'NとNをください', 'と joins the ingredients before a single を. 米 means uncooked rice; ご飯 is cooked rice or a meal. Do not use 米 as the ordinary name of the rice on your plate.', [
 ...lines([[657,'beef'],[658,'pork'],[659,'chicken'],[660,'uncooked rice'],[666,'hot water'],[674,'an onion'],[675,'a carrot'],[676,'a potato']], [['$ を ください','Please give me $.'],['23 は $ です','This is $.']]),
 ['657 と 674 を ください','Please give me beef and an onion.'],['659 と 676 を ください','Please give me chicken and a potato.']]);
lesson('seasoning', 'Seasonings', [661,662,663,664,665], 'Nをください / Nは…です', 'Ask for a seasoning using をください. 味噌 is the paste; 味噌汁 is the soup. 塩辛い describes a salty taste.', [
 ...lines([[661,'sugar'],[662,'salt'],[663,'soy sauce'],[664,'miso'],[665,'oil']], [['$ を ください','Please give me $.'],['23 は $ です','This is $.']]),
 ['661 は 606 です','Sugar is sweet.'],['663 は 608 です','Soy sauce is salty.'],['664 は 608 です','Miso is salty.']]);
lesson('utensils', 'At the dining table', [350,419,667,668,669,670], 'Nをください / これはNです', 'Ask for tableware in a restaurant. 箸 is normally plural in English. The Japanese noun itself does not change for singular and plural.', lines([[350,'a pair of chopsticks'],[419,'a cup'],[667,'a plate'],[668,'a rice bowl'],[669,'a spoon'],[670,'a glass']], [['$ を ください','Please give me $.'],['23 は $ です','This is $.']]));
lesson('choosing-tableware', 'Choosing plates and cups', [], 'それ・あれ / NのN / adjective + です', 'When both people know which object you mean, それ or あれ can replace its name. Use the object’s name when you need to make the reference clear.', [
 ['24 は 667 です か','Is that a plate?'],
 ['25 は 668 です か','Is that over there a rice bowl?'],
 ['24 は 1 の 670 です','That is my glass.'],
 ['25 は 71 の 670 です','That over there is my friend’s glass.'],
 ['24 は 68 です','That is small.'],
 ['25 は 67 です','That over there is big.'],
 ['1 の 670 は 70 です','My glass is old.'],
 ['24 は 69 です か','Is that new?'],
 ['24 を ください','That one, please.'],
 ['25 も ください','That one over there too, please.'],
 ['1 の 667 は 67 です','My plate is big.'],
 ['71 の 667 は 68 です','My friend’s plate is small.'],
]);
course.lessons.at(-1).notes[0].title = 'Make your choice clear';
lesson('polite-food-words', 'Two familiar words with お', [], '皿 → お皿 / 弁当 → お弁当', 'You will often hear お皿 and お弁当 for the plate and bento you already know. The お makes these everyday expressions more polite without changing the object. Both the plain words and these forms are useful. Learn each expression as a whole; do not add お to every noun.', [
 ['667~お皿~おさら を ください','A plate, please.'],
 ['23 は 667~お皿~おさら です','This is a plate.'],
 ['667~お皿~おさら と 350 を ください','A plate and chopsticks, please.'],
 ['671~お弁当~おべんとう を ください','A bento, please.'],
 ['671~お弁当~おべんとう を 37~食べます~たべます','I eat a bento.'],
 ['671~お弁当~おべんとう は 97 です','The bento is delicious.'],
]);
course.lessons.at(-1).notes[0].title = 'Words you will hear';
lesson('cooking', 'Preparing food', [178,409,672,673], 'Nを作ります / Nで', '作る becomes 作ります. で can mark the tool used for an action. 料理 can mean cooking or a prepared dish. With おいしい it means the prepared food. A pan and a kitchen knife are tools, not things to eat.', [
 ['36 を 178~作ります~つくります','I make rice.'],['403 を 178~作ります~つくります','I make miso soup.'],['303 を 178~作ります~つくります','I make curry.'],['671 を 178~作ります~つくります','I make a bento.'],['23 は 672 です','This is a pan.'],['23 は 673 です','This is a kitchen knife.'],['673 を ください','Please give me a kitchen knife.'],['672 で 403 を 178~作ります~つくります','I make miso soup in a pan.'],['409 は 97 です','The food is delicious.'],['131 の 409 は 97 です','The restaurant’s dishes are delicious.']]);
lesson('eating-out', 'Eating out', [690,691,742,743,504,749,750], 'Nを一杯ください / fixed mealtime expressions', '一杯 counts one cup or glass. 注文 is an order. いただきます is said before eating; ごちそうさま is said after a meal. These expressions are complete social phrases. おいしかったです is the polite past of おいしいです: replace the final い with かった and keep です.', [
 ['23 は 690 です','This is the dining hall.'],['690 の 36 は 97 です','The dining hall’s rice is delicious.'],['23 は 691 です','This is a coffee shop.'],['691 の 128 は 97 です','The coffee shop’s coffee is delicious.'],['742 は 303 です','My order is curry.'],['742 は 307 です','My order is sushi.'],['34 を 743 ください','One glass of water, please.'],['128 を 743 ください','One cup of coffee, please.'],['504 は 38~飲みません~のみません','I do not drink alcohol.'],['504 を 38~飲みます~のみます か','Do you drink alcohol?'],['750','Thank you for the meal. (Before eating.)'],['750 。 307 を 37~食べます~たべます','Thank you for the meal. I will eat the sushi.'],['749','Thank you for the meal. (After eating.)'],['749 。 128 は 97~おいしかった~おいしかった です','Thank you. The coffee was delicious.']]);

await import('./lib/curated-a1-people.mjs');
await import('./lib/curated-a1-home.mjs');
await import('./lib/curated-a1-learning.mjs');
await import('./lib/curated-a1-travel.mjs');
await import('./lib/curated-a1-shopping.mjs');
await import('./lib/curated-a1-time.mjs');
await import('./lib/curated-a1-life.mjs');
await import('./lib/curated-a1-nature.mjs');
await import('./lib/curated-a1-social.mjs');
await import('./lib/curated-a1-grammar.mjs');
placeA1Chapters(course);
finish();
if(!process.argv.includes('--draft'))await import('./compile-curated-catalog.mjs');
