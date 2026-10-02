export function authorAnimals({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{920:'keep; raise (an animal)',341:'animal food; feed','@上げる':'give (food to an animal)',727:'wave; swing; wag',1707:'livestock farm; ranch',158:'careful observation',2383:'stroke; pet gently',2259:'let escape; set free',1166:'release; let loose'});
topic('animals','Animal care and observation','Explain caring for an animal, describe what it does, and recount a visit to a farm.');
lesson('pets','Keeping and feeding animals',[920,341,627], 'Nを飼っています / Nに餌をあげます', '飼う means keep or raise an animal; it differs from buying one. 餌 is food for animals. Keep the animal as the recipient with に in 餌をあげる. A うさぎ is a rabbit.', [
 ['@家 で @犬 を 920~飼っています~かっています','I keep a dog at home.'],
 ['@小さい @時 に 627 を 920~飼っていました~かっていました','I kept a rabbit when I was little.'],
 ['@毎朝 @犬 に 341 を @上げる~あげます~あげます','I feed the dog every morning.'],
 ['341 の @袋 を @開ける~開けました~あけました','I opened the bag of animal food.'],
 ['627 は @耳 が @長い です','Rabbits have long ears.'],
 ['@白い 627 が @草 を @食べる~食べています~たべています','A white rabbit is eating grass.'],
]);
lesson('behavior','What the dog is doing',[1630,727,1097,2383], '尻尾を振ります / Nを撫でます', '尻尾 is the everyday word for an animal’s tail. 振る describes waving, swinging or wagging. 吠える is barking; 撫でる is stroking gently. The noun tells you whether 振る means waving a hand or wagging a tail.', [
 ['@犬 が 1630 を 727~振っています~ふっています','The dog is wagging its tail.'],
 ['@この @犬 の 1630 は @短い です','This dog’s tail is short.'],
 ['@友達 に @手 を 727~振りました~ふりました','I waved to my friend.'],
 ['@犬 が 1097~吠えています~ほえています','The dog is barking.'],
 ['@大きい @音 で @犬 が 1097~吠えました~ほえました','The dog barked at a loud noise.'],
 ['@犬 の @頭 を 2383~撫でました~なでました','I stroked the dog’s head.'],
 ['@友達 が @猫 を 2383~撫でています~なでています','My friend is stroking the cat.'],
]);
lesson('farm','Visiting a livestock farm',[1707,826,1024], 'Nを柵で囲みます', '牧場 is a livestock farm or ranch. 柵 is a fence. 囲む means surround or enclose something: 柵で囲む means enclose it with a fence. This describes the place before the animals inside it.', [
 ['1707 で @牛 と @馬 を @見る~見ました~みました','I saw cows and horses at the farm.'],
 ['@この 1707 で は @牛 を 920~飼っています~かっています','Cows are raised on this farm.'],
 ['826 の @中 に @馬 が @いる~います~います','There is a horse inside the fence.'],
 ['@木 の 826 を @直す~直しました~なおしました','I repaired the wooden fence.'],
 ['292 を 826 で 1024~囲みます~かこみます','I enclose the field with a fence.'],
 ['@木 が @家 を 1024~囲んでいます~かこんでいます','Trees surround the house.'],
]);
lesson('watching','Looking closely',[158,258,2731], 'Nを観察します / Nの形', '観察 means looking carefully to learn something. 尾 is another word for a tail, common in descriptions of birds, fish and other animals. It refers to the same body part as 尻尾, but is useful in more descriptive language. 動き means movement or motion.', [
 ['@池 の @魚 を 158 @する~します~します','I observe the fish in the pond.'],
 ['@鳥 の 2731 を 158 @する~しました~しました','I observed the bird’s movements.'],
 ['@この @魚 は 258 が @長い です','This fish has a long tail.'],
 ['258 の @形 を @絵 に @描く~描きました~かきました','I drew the shape of the tail.'],
 ['@魚 と @鳥 の 2731 を @比べる~比べます~くらべます','I compare the movements of fish and birds.'],
]);
lesson('monkeys-tigers','Watching monkeys and tigers',[195,299], 'NがVています / VているN', 'A description can come before an animal’s name: 木の下で寝ている虎 identifies the tiger by what it is doing. Use 観察する when you watch carefully to learn about its behavior.', [
 ['@動物園 で 195 を @見る~見ました~みました','I saw a monkey at the zoo.'],
 ['195 の @手 は @小さい です','The monkey’s hands are small.'],
 ['195 が 341 を @食べる~食べていました~たべていました','The monkey was eating its food.'],
 ['195 の 2731 を 158 @する~しました~しました','I observed the monkey’s movements.'],
 ['299 が @歩く~歩いています~あるいています','The tiger is walking.'],
 ['299 の @足 は @大きい です','The tiger has large paws.'],
 ['299 の @写真 を @撮る~撮りました~とりました','I took a photograph of a tiger.'],
 ['@木 の @下 で @寝る~寝ている~ねている 299 を @見る~見ました~みました','I saw a tiger sleeping under a tree.'],
]);
course.lessons.at(-1).notes[0].title='Identify the animal you mean';
lesson('mosquitoes','Mosquitoes in the room',[745], '蚊が入る / 蚊がいる', '入る describes coming inside; いる says that an animal is present. 蚊が入るので gives a reason to close the window.', [
 ['@部屋 に 745 が @いる~います~います','There is a mosquito in the room.'],
 ['745 が @入る ので @窓 を @閉める~閉めました~しめました','I closed the window because mosquitoes were coming in.'],
 ['@夏 は 745 が @多い です','There are many mosquitoes in summer.'],
 ['@寝る @前 に @部屋 の 745 を @探す~探しました~さがしました','Before going to bed, I looked for the mosquito in the room.'],
]);
course.lessons.at(-1).notes[0].title='Coming in or already there';
lesson('birds','Wings, feathers and nests',[204,822,778,470], '翼を広げます / Nに巣を作ります', '翼 names a wing. 広げる means spread or open something out; compare earlier 広がる, something spreading. 羽 can mean a feather or a wing; the fallen 羽 here is a feather. 巣 is a nest. Use the object marker を for what is spread or built.', [
 ['@鳥 が 204 を 822~広げました~ひろげました','The bird spread its wings.'],
 ['@この @鳥 の 204 は @大きい です','This bird has large wings.'],
 ['@地図 を 822~広げて~ひろげて @鳥 が @いる @場所 を @探す~探します~さがします','I open the map and look for places where there are birds.'],
 ['778 が 1514 に @落ちる~落ちています~おちています','A feather is lying on the ground.'],
 ['@白い 778 を @見つける~見つけました~みつけました','I found a white feather.'],
 ['@鳥 が @木 に 470 を @作る~作っています~つくっています','A bird is building a nest in the tree.'],
 ['470 を @遠い @所 から 158 @する~します~します','I observe the nest from a distance.'],
]);
lesson('handling','Touching and letting go',[398,2259,1166], 'Nに触れます / Nを逃がします', '触れる means touch or come into contact with something, commonly with に. 逃がす means let something escape or set it free; 放す means release something you have been holding or keeping confined. 逃げる, already learned, describes the animal escaping on its own.', [
 ['@犬 に 398~触れる~ふれる @前 に 920~飼っている~かっている @人 に @聞く~聞いてください~きいてください','Before touching a dog, please ask the person who keeps it.'],
 ['@子供 が @馬 に 398~触れました~ふれました','The child touched the horse.'],
 ['@窓 を @開ける~開けて~あけて @虫 を 2259~逃がしました~にがしました','I opened the window and let the insect out.'],
 ['@捕まえる~捕まえた~つかまえた @虫 を 2259~逃がします~にがします','I release the insect I caught.'],
 ['@鳥 を @空 に 1166~放しました~はなしました','I released the bird into the sky.'],
 ['@ここ で @犬 を 1166~放さないでください~はなさないでください','Please do not let the dog loose here.'],
]);
lesson('visit','An afternoon at the farm',[], 'Describe a visit in order', 'These sentences form one account of a visit. First say where you went, then describe the animals and what you did. The final sentence uses earlier てから to make the order clear.', [
 ['@午後 @家族 と 1707 に @行く~行きました~いきました','In the afternoon, I went to a farm with my family.'],
 ['826 の @中 で @馬 が @草 を @食べる~食べていました~たべていました','Inside the fence, horses were eating grass.'],
 ['@馬 の 2731 を 158 @する~しました~しました','We observed the horses’ movements.'],
 ['1707 の @人 に @聞く~聞いて~きいて から @馬 に 341 を @上げる~あげました~あげました','After asking someone at the farm, we fed the horses.'],
 ['@家 に @帰る~帰って~かえって から @馬 の @絵 を @描く~描きました~かきました','After returning home, I drew a picture of a horse.'],
]);
lesson('zoo-account','Remembering a day at the zoo',[], 'Observations followed by a reason', 'Use ていました for what was happening when you watched. ので gives the reason for an action.', [
 ['@動物園 で 195 と 299 の 2731 を 158 @する~しました~しました','At the zoo, I observed the movements of monkeys and tigers.'],
 ['195 は 341 を @食べる~食べていました~たべていました 。 299 は @木 の @下 で @寝る~寝ていました~ねていました','The monkeys were eating. The tigers were sleeping under a tree.'],
 ['@夜 @部屋 に 745 が @入る~入りました~はいりました','That night, a mosquito came into my room.'],
 ['@外 に 745 が @いる ので @窓 を @閉める~閉めました~しめました','I closed the window because there were mosquitoes outside.'],
]);
course.lessons.at(-1).notes[0].title='Describe what you noticed';

}
