export function authorHousing({topic,lesson,forms}) {
forms['ので']=['ので','because; gives an explanatory reason'];
forms['でも']=['でも','even if or even though, after a noun'];
forms['として']=['として','as; in the role of'];
forms['かどうか']=['かどうか','whether or not; embeds a yes/no question'];
topic('housing','Housing and tenancy','Compare homes, discuss a rental agreement, and plan a move.');
lesson('rental','Discussing a rental',[1,14,620,12,13,2,111], 'Nが含まれています / Nは別です / Nの前払い', '賃貸 means renting or letting, and 家賃 the rent. 間取り is a home’s layout. 敷金 is a security deposit and 礼金 a payment to the landlord often called key money. 費用 is a cost and 前払い payment in advance. Ask what is included rather than assuming a particular agreement’s terms.', [
 ['@この 14 の @部屋 は 1 が @いい です','This rental apartment has a good layout.'],
 ['1 を @見る~見て~みて から 14 の @部屋 を @選ぶ~選びます~えらびます','I choose a rental apartment after looking at the layout.'],
 ['620 に @水 の @料金 は @含む~含まれていません~ふくまれていません','Water charges are not included in the rent.'],
 ['620 は 2 です が @他 の 111 は @別 です','The rent is paid in advance, but other costs are separate.'],
 ['12 と 13 は @いくら です か','How much are the key money and security deposit?'],
 ['12 は @必要 です が 13 は @ある~ありません~ありません','Key money is required, but there is no security deposit.'],
 ['@最初 の 111 を @確認~確認します~かくにんします','I check the initial costs.'],
 ['2 が @必要 かどうか @聞く~聞きます~ききます','I ask whether payment in advance is necessary.'],
]);
lesson('agreement','Understanding an agreement',[15,16,17,29], 'Vことになっています / Vかどうか確認します', '契約 is a contract or agreement; 更新 its renewal; 解約 its cancellation. 保証 is a guarantee. Vことになっています describes an arrangement or rule already in place. かどうか embeds a yes/no question inside a sentence, such as checking whether renewal is possible.', [
 ['15 を @読む~読んで~よんで から @質問 @する~します~します','I read the agreement and then ask questions.'],
 ['15 の @期間 が @終わる~終わる~おわる @前 に 16 @する~する~する @こと に @なる~なっています~なっています','The arrangement is to renew before the contract period ends.'],
 ['16 が @可能 かどうか @確認~確認します~かくにんします','I check whether renewal is possible.'],
 ['17 の @条件 を @説明~説明してください~せつめいしてください','Please explain the cancellation terms.'],
 ['@来月 17 @する~する~する @場合 は @今月 @連絡~連絡してください~れんらくしてください','Please get in touch this month if you are canceling next month.'],
 ['29 の @内容 を @読む~読みます~よみます','I read the details of the guarantee.'],
 ['29 が @ある~ある~ある かどうか @確認~確認しました~かくにんしました','I checked whether there was a guarantee.'],
]);
lesson('landlords-vacancies','Landlords and available rooms',[1198,2277,545], '大家に聞きます / 家主のN / 空きがあります', '大家, read おおや, and 家主, read やぬし, can both refer to a landlord. They need not be different people. 大家さん is a common conversational way to refer to the landlord; these examples use the base noun. 空き names available space or a vacancy. 空きがある asks whether something is available, rather than whether the room contains furniture.', [
 ['1198 に 620 について @聞く~聞きました~ききました','I asked the landlord about the rent.'],
 ['1198 から 15 の @説明 を @聞く~聞きました~ききました','I heard an explanation of the agreement from the landlord.'],
 ['1198 に @電話 で @質問 @する~しました~しました','I asked the landlord questions over the phone.'],
 ['2277 に @修理 を @お願い @する~しました~しました','I asked the landlord to arrange repairs.'],
 ['2277 は @近く に @住む~住んでいます~すんでいます','The landlord lives nearby.'],
 ['2277 の @電話 @番号 を @教える~教えてください~おしえてください','Please tell me the landlord’s phone number.'],
 ['@この @アパート に 545 は @ある~あります~あります か','Are there any vacancies in this apartment building?'],
 ['545 が @ある~ある~ある かどうか 1198 に @聞く~聞きました~ききました','I asked the landlord whether there were any vacancies.'],
 ['545 が @ある~ない~ない ので @別 の @部屋 を @探す~探します~さがします','There are no vacancies, so I will look for another room.'],
],{1198:'landlord; landlady',2277:'landlord; landlady',545:'vacancy; available space'});
lesson('comparison','Comparing homes',[64,67,250,312,183,496,973], 'Nは…ですが / VてからV', '設備 is equipment or facilities; 幅 a width; 眺め a view. 快適 means comfortable, 中古 previously used, and 都会 a city or urban environment. 計る is the dictionary entry for measure; 測る is the spelling used for dimensions here. Compare a home’s features and explain what you like about it.', [
 ['64 は @古い です が @生活 は 312 です','The facilities are old, but life is comfortable.'],
 ['64 を @確認~確認して~かくにんして から @決める~決めます~きめます','I check the facilities before deciding.'],
 ['@ドア の 67 は @十分 です か','Is the doorway wide enough?'],
 ['67 を 973~測って~はかって から @机 を @買う~買います~かいます','I measure the width before buying a desk.'],
 ['@窓 の 67 を 973~測ります~はかります','I measure the width of the window.'],
 ['@この @窓 から の 250 が @好き です','I like the view from this window.'],
 ['250 が @いい~よくて~よくて 312 な @部屋 です','It is a comfortable room with a good view.'],
 ['183 の @家 を @買う~買いました~かいました','I bought a previously owned house.'],
 ['183 でも @綺麗 です','It is in good condition even though it is secondhand.'],
 ['496 に @住む~住んでいます~すんでいます が @静か な @所 が @好き です','I live in the city, but I like quiet places.'],
 ['496 は @便利 です が 620 が @高い です','The city is convenient, but rent is expensive.'],
]);
lesson('neighborhood','The area around a home',[150,1402,1791], 'この辺り / Nの付近 / 団地に住んでいます', 'この辺り means around here. Nの付近 locates something near a named place; both expressions describe a surrounding area without fixing an exact distance. 団地 is a housing complex, often with several apartment buildings. It does not mean an individual apartment.', [
 ['@この 150 は @夜 も @静か です','It is quiet around here even at night.'],
 ['@駅 の 150 で @部屋 を @探す~探しています~さがしています','I am looking for a room around the station.'],
 ['@この 150 に @スーパー は @ある~あります~あります か','Is there a supermarket around here?'],
 ['@駅 の 1402 を @歩く~歩きました~あるきました','I walked around the area near the station.'],
 ['@学校 の 1402 で @家 を @探す~探しています~さがしています','I am looking for a house near the school.'],
 ['1402 の @店 を @地図 で @調べる~調べました~しらべました','I looked up nearby shops on a map.'],
 ['@友達 は @この 1791 に @住む~住んでいます~すんでいます','My friend lives in this housing complex.'],
 ['1791 の @中 に @公園 が @ある~あります~あります','There is a park within the housing complex.'],
 ['1791 から @駅 まで @歩く~歩いて~あるいて @行く~行きます~いきます','I walk from the housing complex to the station.'],
],{150:'surrounding area; around here',1402:'vicinity; nearby area',1791:'housing complex'});
lesson('dwellings','Different kinds of homes',[1816,2691,1857,2543,1763,1804,2419], 'Nを探しています / 高層のN / Nとして使います', '住まい is a home; 住居 a dwelling in a more formal register; 家屋 a house as a building. 貸家 is a house offered for rent, 別荘 a holiday home, and 高層 high-rise. ビルディング is the full borrowed form of ビル. として marks the role something serves.', [
 ['@新しい 1816 を @探す~探しています~さがしています','I am looking for a new home.'],
 ['1816 は @駅 の @近く に @ある~あります~あります','My home is near the station.'],
 ['@この @建物 は 2691 として @使う~使われています~つかわれています','This building is used as a dwelling.'],
 ['2691 の @住所 を @書く~書いてください~かいてください','Please write your residential address.'],
 ['@古い 1857 を @修理~修理します~しゅうりします','We repair the old house.'],
 ['1857 の @屋根 を @見る~見ました~みました','I looked at the roof of the house.'],
 ['@この 2543 は 1 が @いい です','This rental house has a good layout.'],
 ['2543 の 620 を @聞く~聞きました~ききました','I asked about the rent for the house.'],
 ['@夏 は 1763 で @休む~休みます~やすみます','I rest at the holiday home in summer.'],
 ['1763 は @海 の @近く です','The holiday home is near the sea.'],
 ['1804 の 2419 に @住む~住んでいます~すんでいます','I live in a high-rise building.'],
 ['1804 の @建物 から 496 が @見える~見えます~みえます','The city can be seen from the high-rise building.'],
 ['@この 2419 は @新しい です','This building is new.'],
]);
lesson('grounds-entrances','The grounds and entrances',[1557,2287,2870], '敷地の中 / 裏口から / 扉を開けます', '敷地 is the plot or grounds belonging to a building. 裏口 is a rear entrance or exit; these examples use its physical meaning. 扉 names a door or gate. Use を with 開ける or 閉める for the door you open or close, and から with 裏口 for the entrance you pass through.', [
 ['@家 の 1557 は @広い です','The house has spacious grounds.'],
 ['1557 の @中 に @駐車場 が @ある~あります~あります','There is a parking area on the grounds.'],
 ['1557 の @入り口 で 1198 と @会う~会いました~あいました','I met the landlord at the entrance to the grounds.'],
 ['2287 から @庭 に @出る~出ました~でました','I went out into the garden through the rear entrance.'],
 ['2287 の @鍵 を @探す~探しています~さがしています','I am looking for the key to the back door.'],
 ['2287 は @建物 の @後ろ に @ある~あります~あります','The rear entrance is at the back of the building.'],
 ['2870 を @開ける~開ける~あける と @庭 が @見える~見えます~みえます','When you open the door, you can see the garden.'],
 ['2870 の @横 に @窓 が @ある~あります~あります','There is a window beside the door.'],
 ['@出かける~出かける~でかける @前 に 2870 を @閉める~閉めました~しめました','I closed the door before going out.'],
],{1557:'plot; grounds of a building',2287:'rear entrance; back door',2870:'door; gate'});
lesson('rooms','Rooms and storage',[610,1025,2133,2530,2213,1474,913], 'Nとして使います / Nに家具を置きます', '居間 is a living room, 座敷 a room with tatami flooring, and 客間 a room for guests. 家具 is furniture. 物置 is storage space or a shed, while 倉庫 is a warehouse or larger storage building. Use として to describe a room’s role. 向く means face or turn toward a direction; 向いた can modify a noun.', [
 ['1025 に 610 を @置く~置きます~おきます','I put furniture in the living room.'],
 ['1025 の 610 は @少ない です','There is little furniture in the living room.'],
 ['2133 を 2530 として @使う~使っています~つかっています','We use the tatami room as a guest room.'],
 ['2133 は @庭 に 913~向いています~むいています','The tatami room faces the garden.'],['@南 に 913~向いた~むいた @窓 です','It is a south-facing window.'],
 ['2530 を @掃除~掃除しました~そうじしました','I cleaned the guest room.'],
 ['2213 に @自転車 を @入れる~入れます~いれます','I put the bicycle in the shed.'],
 ['2213 の @中 は @暗い です','It is dark inside the shed.'],
 ['1474 に 610 が @ある~あります~あります','There is furniture in the warehouse.'],
 ['1474 の @鍵 を @持つ~持っています~もっています','I have the key to the warehouse.'],
]);
lesson('indoor-comfort','Air and sounds indoors',[1939,1998,1140], 'クーラーをつけます / 換気します / 物音がします', 'クーラー refers here to air conditioning used for cooling. 換気 means replacing indoor air with fresh air. Cooling a room and replacing its air are different actions. 物音 is a sound or noise made by something, such as movement in another room. 物音がする says there is a sound; 物音が聞こえる says you can hear it.', [
 ['@暑い ので 1939 を @つける~つけました~つけました','It was hot, so I turned on the air conditioning.'],
 ['1939 を @消す~消して~けして から @窓 を @開ける~開けました~あけました','I turned off the air conditioning and then opened the window.'],
 ['@この @部屋 に は 1939 が @ある~あります~あります','This room has air conditioning.'],
 ['@窓 を @開ける~開けて~あけて 1998 @する~します~します','I open the window to ventilate the room.'],
 ['@料理 の @後 で 1998 を @する~しました~しました','I aired the room after cooking.'],
 ['1998 の ために @窓 を @開ける~開けてください~あけてください','Please open the window for ventilation.'],
 ['@隣 の @部屋 から 1140 が @聞こえる~聞こえます~きこえます','I can hear a noise from the next room.'],
 ['@夜 に @大きな 1140 が @する~しました~しました','There was a loud noise during the night.'],
 ['1140 が @する~した~した ので 2870 を @開ける~開けました~あけました','I heard a noise, so I opened the door.'],
],{1939:'air conditioning for cooling',1998:'ventilation; airing a room',1140:'sound or noise made by something'});
lesson('moving','Moving and settling in',[360,472,404,2875,696,2403], 'Nで暮らしています / Vてから / 衣食住', '引っ越し is moving home. 暮らす focuses on how you live, whereas 住む focuses on where. 宅 is a formal word for a house, often in phrases referring to someone’s home. 実家 is your parents’ or family home. 住 is the housing part of the expression 衣食住: clothing, food and shelter. Learn 住 through this compound; 住まい is the ordinary standalone word for a home.', [
 ['360 の @前 に @荷物 を @整理~整理します~せいりします','I organize my belongings before moving.'],
 ['360~引っ越しして~ひっこしして から @一人 で 472~暮らしています~くらしています','I have been living alone since moving.'],
 ['@この @町 で @長い @間 472~暮らしました~くらしました','I lived in this town for a long time.'],
 ['@先生 404 を @訪ねる~訪ねました~たずねました','I visited my teacher’s home.'],
 ['@友人 404 に @荷物 を @送る~送ります~おくります','I send the luggage to my friend’s home.'],
 ['@週末 は 2875 に @帰る~帰ります~かえります','I go back to my family home at the weekend.'],
 ['2875 の @母 と @電話 で @話す~話しました~はなしました','I spoke on the phone with my mother at the family home.'],
 ['2403 の 696 は 1816 の @意味 です','The shelter part of food, clothing and shelter means the home.'],
 ['2403 の 696 について @話す~話します~はなします','We discuss the shelter part of food, clothing and shelter.'],
 ['2403 は @生活 の @基本 です','Food, clothing and shelter are the basics of life.'],['2403 の 111 を @計算~計算します~けいさんします','I calculate the costs of food, clothing and shelter.'],
]);
lesson('empty-rooms','Empty rooms and containers',[1973], 'Nは空っぽです / 空っぽのN / Nを空っぽにします', '空っぽ describes having nothing inside. 空っぽの箱 is an empty box, and 空っぽにする means empty something. A room can be 空っぽ because its furniture has been removed; that does not tell you whether it is available to rent. Use the earlier 空き for availability.', [
 ['610 を @外 に @運ぶ~運んだ~はこんだ ので @部屋 は 1973 です','I moved the furniture outside, so the room is empty.'],
 ['1973 の @箱 を 2213 に @入れる~入れました~いれました','I put an empty box in the shed.'],
 ['26 の @中 は 1973 でした','The drawer was empty.'],
 ['@荷物 を @出す~出して~だして @かばん を 1973 に @する~しました~しました','I took out my belongings and emptied the bag.'],
],{1973:'empty; containing nothing'});
lesson('local-home','Your local area and hometown',[2736,1682], '地元のN / ふるさとに帰ります', '地元 can mean the local area relevant to the conversation or the area you are from. 地元の店 is a local shop. ふるさと is the hometown or place you think of as your original home, often with a personal attachment. It is not simply any address where you currently live.', [
 ['1682 は @海 の @近く に @ある~あります~あります','My hometown is near the sea.'],
 ['@夏休み に 1682 に @帰る~帰りました~かえりました','I returned to my hometown during the summer holidays.'],
 ['1682 の @友達 と @電話 で @話す~話しました~はなしました','I spoke on the phone with a friend from my hometown.'],
 ['2736 の @店 で 610 を @買う~買いました~かいました','I bought furniture at a local shop.'],
 ['2736 の @祭り に @家族 と @行く~行きました~いきました','I went to the local festival with my family.'],
 ['2736 の @人 に @この 150 の @こと を @聞く~聞きました~ききました','I asked a local person about this area.'],
],{2736:'local area; local',1682:'hometown; original home'});
lesson('viewing-account','Looking at a place to live',[], 'Availability, surroundings and indoor facilities', 'Follow a search for a home from the station area to a viewing. 大家 and 家主 can name the same landlord. Check availability with 空き, then describe the grounds, entrance and cooling facilities before giving your reason for choosing the area.', [
 ['@駅 の 1402 で 14 の @部屋 を @探す~探しました~さがしました','I looked for a rental room near the station.'],
 ['1791 に 545 が @ある~あった~あった ので 2277 に @電話 @する~しました~しました','There was a vacancy in the housing complex, so I phoned the landlord.'],
 ['1198 と @一緒 に 1557 の @中 に @入る~入りました~はいりました','I entered the grounds with the landlord.'],
 ['2287 の 2870 を @開ける~開ける~あける と @庭 が @見える~見えました~みえました','When I opened the back door, I could see the garden.'],
 ['@部屋 に 1939 が @ある~ある~ある かどうか @確認 @する~しました~しました','I checked whether the room had air conditioning.'],
 ['@この 150 は @静か な ので @ここ で 472~暮らしたい~くらしたい です','This area is quiet, so I would like to live here.'],
],{1402:'vicinity; nearby area',545:'vacancy; available space',2277:'landlord; landlady',1198:'landlord; landlady',1557:'plot; grounds of a building',2287:'rear entrance; back door',2870:'door; gate',1939:'air conditioning for cooling',150:'surrounding area'});
lesson('settling-account','Settling into a new home',[], 'Emptying, airing and making a home', 'A new resident cleans the empty room, airs it and buys curtains locally. Later, a noise at the rear entrance turns out to be a cat. The final message connects the new home with a friend from the speaker’s hometown.', [
 ['610 を @入れる~入れる~いれる @前 に 1973 の @部屋 を @掃除 @する~しました~しました','I cleaned the empty room before bringing in the furniture.'],
 ['@窓 を @開ける~開けて~あけて 1998 を @する~しました~しました','I opened the window and aired the room.'],
 ['2736 の @店 で @カーテン を @買う~買いました~かいました','I bought curtains at a local shop.'],
 ['@夜 に 2287 から 1140 が @聞こえる~聞こえました~きこえました','At night, I heard a noise from the rear entrance.'],
 ['2870 を @開ける~開ける~あける と @猫 が @いる~いました~いました','When I opened the door, there was a cat.'],
 ['1682 の @友達 に @新しい 1816 の @写真 を @送る~送りました~おくりました','I sent a friend from my hometown a photograph of my new home.'],
],{1973:'empty; containing nothing',1998:'ventilation; airing a room',2736:'local area; local',2287:'rear entrance; back door',1140:'sound or noise made by something',2870:'door; gate',1682:'hometown; original home'});
}
