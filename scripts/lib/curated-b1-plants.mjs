export function authorPlants({topic,lesson:authorLesson,course}) {
const lesson=(...args)=>authorLesson(...args,{2208:'garden tree; ornamental plant',2435:'exposure to sunlight',1074:'sow (seeds); scatter',738:'grow; develop',821:'grow; sprout',1165:'plant growth',1513:'moisture; water content',2565:'wilt; shrivel',497:'farming household; farmer',829:'farmer; agricultural worker',1565:'Japanese cedar; sugi',2587:'maple tree (momiji)',2186:'large tree'});
topic('plants','Gardens, crops and farming','Describe how plants grow, explain garden work, and talk about crops and life in a farming community.');
lesson('garden','A place for plants',[2208,2435,282], '日当たりがいい / Nの根', '植木 usually means a tree or ornamental plant grown in a garden or pot. 日当たり describes how much sunlight a place receives. 根 is a plant’s root. Describe the plant and the place where you grow it before explaining the work.', [
 ['@庭 に 2208 を @植える~植えました~うえました','I planted an ornamental tree in the garden.'],
 ['@この 2208 は 2435 が @いい @場所 で @育てる~育てます~そだてます','I grow this plant in a place that gets plenty of sunlight.'],
 ['@庭 は 2435 が @いい です','The garden gets plenty of sunlight.'],
 ['@この @部屋 は 2435 が @悪い です','This room gets little sunlight.'],
 ['2208 の 282 を @見る~見ます~みます','I look at the roots of the garden tree.'],
 ['@この @植物 は 282 が @長い です','This plant has long roots.'],
]);
lesson('seeds','From seeds to shoots',[1074,524,738], '種をまきます / 芽が出ます / Nが育ちます', 'まく is used for sowing seeds or scattering something. 芽 is a new shoot or bud. 育つ describes the plant growing; 育てる describes someone growing or raising it. Compare 植物が育つ with 植物を育てる.', [
 ['@春 に @花 の @種 を 1074~まきます~まきます','I sow flower seeds in spring.'],
 ['@庭 に @種 を 1074~まきました~まきました','I sowed seeds in the garden.'],
 ['@小さい 524 が @出る~出ました~でました','A small shoot appeared.'],
 ['@毎日 524 を @見る の が @楽しみ です','I look forward to looking at the shoots every day.'],
 ['@植物 が 738~育っています~そだっています','The plants are growing.'],
 ['@この @花 は 2435 が @いい @場所 で 738~育ちます~そだちます','This flower grows in places with plenty of sunlight.'],
]);
lesson('growth','Watching growth',[1165,821,2556], 'Nが生えます / Nが茂っています', '生長 is used for plant growth; the already-known 成長 is more general and is common for people and development. 生える means something grows or sprouts in a place. 茂る describes dense growth, especially leaves or grass. Keep が with the plant that grows.', [
 ['@植物 の 1165 を @写真 で @記録 @する~します~します','I record the plant’s growth in photographs.'],
 ['1165 に は 659 が @必要 です','Sunlight is necessary for growth.'],
 ['@庭 に @草 が 821~生えています~はえています','Grass is growing in the garden.'],
 ['@春 に @新しい @葉 が 821~生えます~はえます','New leaves grow in spring.'],
 ['@木 の @葉 が 2556~茂っています~しげっています','The tree’s leaves are growing thickly.'],
 ['@道 の @近く に @草 が 2556~茂っています~しげっています','Grass grows thickly near the path.'],
]);
lesson('seasons','Leaves and flowers change',[947,2681,2292,2565], '葉が散ります / 花がしぼみます', '紅葉, read こうよう here, is leaves changing color in autumn. 散る describes blossoms or leaves falling. 枯れる means a plant withers or dies; しぼむ describes a flower wilting or closing and losing its full shape. These are different changes, not interchangeable words for falling.', [
 ['@風 で @桜 の @花 が 947~散りました~ちりました','The cherry blossoms fell in the wind.'],
 ['@秋 に @葉 が 947~散ります~ちります','Leaves fall in autumn.'],
 ['@山 の 2681 を @見る~見ました~みました','I saw the autumn colors in the mountains.'],
 ['2681 の @写真 を @友達 に @見せる~見せました~みせました','I showed my friend photographs of the autumn colors.'],
 ['@水 が @足りる~足りなかった~たりなかった ので @植物 が 2292~枯れました~かれました','The plant withered because it did not get enough water.'],
 ['2292~枯れた~かれた @葉 を @集める~集めます~あつめます','I collect the dead leaves.'],
 ['@花 が 2565~しぼみました~しぼみました','The flower wilted.'],
 ['2565~しぼんだ~しぼんだ @花 を @見る~見ました~みました','I looked at the wilted flower.'],
]);
lesson('trees','Pines, cedars and large trees',[97,1565,2186], 'Nの葉 / Nの下 / Nで作られています', '松 is a pine; 杉 is Japanese cedar, also called sugi. 大木 describes a large tree regardless of its species. Tree names can also refer to the wood used to make something.', [
 ['@庭 に 97 を @植える~植えました~うえました','I planted a pine in the garden.'],
 ['@この 97 は @冬 も @葉 が @緑 です','This pine has green leaves in winter too.'],
 ['@山 で 97 の @写真 を @撮る~撮りました~とりました','I took a photograph of a pine in the mountains.'],
 ['97 の @下 で @休む~休みました~やすみました','I rested under a pine.'],
 ['@山 に は 1565 が @多い です','There are many Japanese cedars in the mountains.'],
 ['1565 の @葉 を @近く で @見る~見ました~みました','I looked at the cedar leaves up close.'],
 ['@この @家 は 1565 で @作る~作られています~つくられています','This house is made of cedar.'],
 ['1565 の 154 が @好き です','I like the scent of cedar.'],
 ['@公園 に 2186 が @ある~あります~あります','There is a large tree in the park.'],
 ['2186 の @下 で @昼ご飯 を @食べる~食べました~たべました','I ate lunch under a large tree.'],
 ['2186 の @枝 に @鳥 が @いる~います~います','There is a bird on a branch of the large tree.'],
 ['2186 が @風 で @倒れる~倒れました~たおれました','A large tree fell in the wind.'],
]);
course.lessons.at(-1).notes[0].title='A tree’s name and its wood';
lesson('bamboo-maples','Bamboo and maple leaves',[1506,2587], '竹で作ったN / 紅葉（もみじ）', '竹 is bamboo. 紅葉 read もみじ can name a maple tree. The earlier 紅葉 read こうよう describes autumn leaf color. Check the reading and the context when you see the same spelling.', [
 ['@庭 で 1506 を @育てる~育てています~そだてています','I grow bamboo in the garden.'],
 ['1506 は @まっすぐ 583~伸びます~のびます','Bamboo grows straight upward.'],
 ['1506 で @作る~作った~つくった @箸 を @使う~使っています~つかっています','I use chopsticks made from bamboo.'],
 ['1506 を @切る~切って~きって @運ぶ~運びました~はこびました','I cut bamboo and carried it away.'],
 ['@庭 に 2587 を @植える~植えました~うえました','I planted a maple in the garden.'],
 ['@秋 に @なる と 2587 の @葉 が @赤い~赤く~あかく @なる~なります~なります','When autumn comes, the maple leaves turn red.'],
 ['2587 の @下 で @写真 を @撮る~撮りました~とりました','I took a photograph under a maple.'],
 ['@この 2587 は @まだ @小さい です','This maple is still small.'],
]);
course.lessons.at(-1).notes[0].title='Two readings of 紅葉';
lesson('soil','Working the ground',[1974,2492,490,1182], '穴を掘ります / 草を抜きます', '掘る means dig. 耕す means till soil for planting. 抜く means pull something out; 刈る means cut grass or a crop. 草を抜く removes grass by pulling, while 草を刈る cuts it. Reuse てから to put the work in order.', [
 ['@木 を @植える ために @穴 を 1974~掘ります~ほります','I dig a hole to plant a tree.'],
 ['@庭 の @土 を 1974~掘りました~ほりました','I dug the soil in the garden.'],
 ['@土 を 2492~耕して~たがやして から @種 を 1074~まきます~まきます','I till the soil and then sow seeds.'],
 ['@春 に @庭 を 2492~耕します~たがやします','I till the garden in spring.'],
 ['@草 を 282 から 490~抜きます~ぬきます','I pull the grass out by the roots.'],
 ['@庭 の @草 を 490~抜きました~ぬきました','I pulled out the grass in the garden.'],
 ['@長い @草 を 1182~刈ります~かります','I cut the long grass.'],
 ['@朝 @草 を 1182~刈って~かって から @休む~休みました~やすみました','I cut the grass in the morning and then rested.'],
]);
lesson('water','Water and moisture',[1775,1167,1513,2329], '井戸から水を汲みます / Nの水分', '井戸 is a well. 汲む means draw or scoop water. 水分 is moisture or water content; 水滴 is an individual drop. The same 水 appears in each, but the words describe different things.', [
 ['@村 に @古い 1775 が @ある~あります~あります','There is an old well in the village.'],
 ['1775 の @水 は @冷たい です','The well water is cold.'],
 ['1775 から @水 を 1167~汲みます~くみます','I draw water from the well.'],
 ['@水 を 1167~汲んで~くんで @庭 に @運ぶ~運びました~はこびました','I drew water and carried it to the garden.'],
 ['@土 の 1513 を @調べる~調べます~しらべます','I check the moisture in the soil.'],
 ['@植物 に は 1513 が @必要 です','Plants need moisture.'],
 ['@葉 に 2329 が @ある~あります~あります','There are drops of water on the leaf.'],
 ['2329 が 659 で @光る~光っています~ひかっています','The drops of water sparkle in the sunlight.'],
]);
lesson('fields','Crops in a field',[292,941], '畑で育てます / Nは穀物です', '畑 is a cultivated field for crops such as vegetables or grains. 穀物 means grain or cereal crops, including rice. Use earlier weather and price language to connect crops with daily life.', [
 ['292 で @野菜 を @育てる~育てています~そだてています','I grow vegetables in a field.'],
 ['@雨 の @後 に 292 の @土 を @調べる~調べました~しらべました','I checked the soil in the field after the rain.'],
 ['@米 は 941 です','Rice is a grain.'],
 ['941 の @値段 は 759 によって @変わる~変わります~かわります','Grain prices vary with the weather.'],
]);
lesson('rice','Rice plants and paddies',[333,1986,892], '田に水を入れます / 稲が育ちます', '田 is a rice paddy. 田んぼ is the everyday conversational word for it. 稲 is the growing rice plant; 米 is rice grain. These words describe the field, the plant and the harvested food separately.', [
 ['@春 に 333 に @水 を @入れる~入れます~いれます','Water is put into the rice paddies in spring.'],
 ['333 と 292 で は @育てる @植物 が @違う~違います~ちがいます','The plants grown in rice paddies and other fields are different.'],
 ['1986 で 892 が 738~育っています~そだっています','Rice plants are growing in the paddy.'],
 ['1986 の @近く を @歩く~歩きました~あるきました','I walked near the rice paddy.'],
 ['892 に は @水 と 659 が @必要 です','Rice plants need water and sunlight.'],
 ['892 の 1165 を @写真 で @記録 @する~しました~しました','I recorded the rice plants’ growth in photographs.'],
]);
lesson('harvest','Planting and harvesting',[2391,493,2439], '田植えをします / Nを収穫します', '田植え is planting young rice plants in a paddy. 収穫 is harvesting a crop. 実る means fruit or grain ripens. Follow the crop from planting to ripening and harvest, reusing the time expressions already learned.', [
 ['@春 に 2391 を @する~します~します','We plant rice in spring.'],
 ['@家族 と 2391 を @手伝う~手伝いました~てつだいました','I helped with rice planting together with my family.'],
 ['@秋 に @米 を 493 @する~します~します','We harvest rice in autumn.'],
 ['493 の @前 に 446 を @確認 @する~します~します','We check the forecast before the harvest.'],
 ['892 が 2439~実りました~みのりました','The rice has ripened.'],
 ['2439~実った~みのった 892 を 1182~刈ります~かります','We cut the ripe rice plants.'],
]);
lesson('community','Life in a farming community',[291,497,829,2018], '農家の人 / Nについて聞きます', '農業 is agriculture. 農家 usually refers to a farming household or a farmer; 農民 is a broader term for people engaged in farming, common in descriptions and reports. 農村 is a rural farming community. Use the more personal 農家の人 when recounting a conversation.', [
 ['@この @地方 は 291 が @盛ん です','Agriculture thrives in this region.'],
 ['291 について @学校 で 84~学びます~まなびます','I learn about agriculture at school.'],
 ['497 の @人 に @話 を @聞く~聞きました~ききました','I spoke with a farmer.'],
 ['@この @村 に は 497 が @多い です','There are many farming households in this village.'],
 ['829 の @生活 について の @本 を @読む~読みました~よみました','I read a book about farmers’ lives.'],
 ['829 は 759 の @変化 に @注意 @する~しています~しています','Farmers pay attention to changes in the weather.'],
 ['2018 の @小さい @家 に @泊まる~泊まりました~とまりました','I stayed in a small house in a farming village.'],
 ['2018 の @生活 と 496 の @生活 を @比べる~比べます~くらべます','I compare life in a farming village with life in the city.'],
]);
lesson('account','A season in the garden',[], 'A sequence from sowing to growth', 'These sentences form one account of growing flowers. Keep the order clear with 春に and てから. Here 育つ describes the flowers growing, with the flowers as its subject.', [
 ['@春 に @庭 の @土 を 2492~耕しました~たがやしました','In spring, I tilled the soil in my garden.'],
 ['@土 を 2492~耕して~たがやして から @花 の @種 を 1074~まきました~まきました','After tilling the soil, I sowed flower seeds.'],
 ['@小さい 524 が @出る~出て~でて @花 が 738~育ちました~そだちました','Small shoots appeared, and the flowers grew.'],
 ['@毎日 @土 の 1513 を @調べる~調べました~しらべました','Every day, I checked the moisture in the soil.'],
 ['@花 の 1165 を @写真 で @記録 @する~しました~しました','I recorded the flowers’ growth in photographs.'],
]);
lesson('park-trees','A walk among the trees',[], 'Location, description and sequence', 'Use の下 to locate an activity beneath a tree. で after a material says what an object is made from.', [
 ['@昨日 @家族 と @公園 に @行く~行きました~いきました','Yesterday, I went to the park with my family.'],
 ['2186 の @下 で @少し @休む~休みました~やすみました','We rested for a while under a large tree.'],
 ['@近く に は 97 と 1565 が @ある~ありました~ありました','There were pines and cedars nearby.'],
 ['@秋 の 2587 の @葉 を @写真 に @撮る~撮りました~とりました','I photographed the maple’s autumn leaves.'],
 ['1506 で @作る~作った~つくった @箸 を @使う~使って~つかって @昼ご飯 を @食べる~食べました~たべました','I ate lunch with chopsticks made from bamboo.'],
 ['@帰る~帰って~かえって から @見る~見た~みた @木 の @名前 を @調べる~調べました~しらべました','After returning home, I looked up the names of the trees I had seen.'],
]);
course.lessons.at(-1).notes[0].title='Describe what was around you';

}
