export function authorFamilyLives({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@姓':'surname; family name','B1@苗字':'surname; family name',
 'B1@姓名':'family name and given name','B1@氏名':'full name',
 'B1@叔父':'uncle','B1@叔母':'aunt','B1@姪':'niece',
 'B1@長男':'eldest son','B1@長女':'eldest daughter','B1@末っ子':'youngest child',
 'B1@父母':'father and mother; parents','B1@夫妻':'married couple; husband and wife',
 'B1@女房':'wife (familiar expression)','B1@育児':'childcare; raising children',
 'B1@孝行':'showing care and devotion to one’s parents',
 'B1@先祖':'ancestor','B1@祖先':'ancestor','B1@子孫':'descendant',
 'B1@成年':'adulthood; legal majority','B1@中年':'middle age','B1@老い':'ageing; old age',
 'B1@生涯':'lifetime; entire life','B1@恋しい':'missed; longed for',
 'B1@花嫁':'bride','B1@儀式':'ceremony; ritual','B1@故人':'the deceased',
 'B1@葬式':'funeral','B1@墓':'grave; tomb','B1@亡くす':'to lose someone through death',
 'B1@相続':'inheritance; succession',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('relationships');
lesson('family-and-full-names','Family names and full names',['B1@姓','B1@苗字','B1@姓名','B1@氏名'],
 '姓 / 苗字 / 姓名 / 氏名','姓 and 苗字 name the family name. 姓名 explicitly includes family and given names; 氏名 is a full name, commonly requested on a form.',[
 ['@ここ に B1@姓 を @書く~書いて~かいて ください','Please write your family name here.'],
 ['@二人 の B1@姓 は @同じ です','The two people have the same surname.'],
 ['@彼女 の B1@姓 は @何~何~なん と @読む~読みます~よみます か','How do you read her surname?'],
 ['@友達 の B1@苗字 を @覚える~覚えました~おぼえました','I learned my friend’s surname.'],
 ['@この B1@苗字 は @珍しい です','This surname is unusual.'],
 ['@先生 は @私 の B1@苗字 を @間違える~間違えました~まちがえました','The teacher got my surname wrong.'],
 ['B1@姓名 を @紙 に @書く~書きました~かきました','I wrote my full name on the paper.'],
 ['@この @記録 に は B1@姓名 が @ある~あります~あります','This record includes the family and given names.'],
 ['B1@姓名 の @文字 を @確認 @する~しました~しました','I checked the characters in the full name.'],
 ['@受付 で B1@氏名 を @聞く~聞かれました~きかれました','I was asked for my full name at reception.'],
 ['@紙 に B1@氏名 が @書く~書かれています~かかれています','The full names are written on the paper.'],
 ['@電話 で B1@氏名 を @伝える~伝えました~つたえました','I gave my full name over the phone.'],
]);
lesson('aunts-uncles-and-nieces','Aunts, uncles and nieces',['B1@叔父','B1@叔母','B1@姪'],
 '叔父 / 叔母 / 姪','叔父 is read おじ and 叔母 is おば. 姪 is your brother’s or sister’s daughter. These sentences describe relatives from the speaker’s point of view.',[
 ['@母 の @弟 は @私 の B1@叔父 です','My mother’s younger brother is my uncle.'],
 ['B1@叔父 は @海 の @近く に @住む~住んでいます~すんでいます','My uncle lives near the sea.'],
 ['@先週 B1@叔父 と @映画 を @見る~見ました~みました','I watched a film with my uncle last week.'],
 ['@父 の @妹 は @私 の B1@叔母 です','My father’s younger sister is my aunt.'],
 ['B1@叔母 から @手紙 が @来る~来ました~きました','A letter came from my aunt.'],
 ['@休み の @日 に B1@叔母 の @家 に @行く~行きました~いきました','I went to my aunt’s house on my day off.'],
 ['@姉 の @娘 は @私 の B1@姪 です','My older sister’s daughter is my niece.'],
 ['B1@姪 に @本 を @読む~読みました~よみました','I read a book to my niece.'],
 ['@小さい B1@姪 が @私 の @名前 を @呼ぶ~呼びました~よびました','My little niece called my name.'],
]);
lesson('older-and-younger-children','The eldest son, eldest daughter and youngest child',['B1@長男','B1@長女','B1@末っ子'],
 '長男 / 長女 / 末っ子','長男 is the first-born son and 長女 the first-born daughter; neither has to be the oldest child overall. 末っ子 is the youngest child in the family.',[
 ['@私 は @家族 の B1@長男 です','I am the eldest son in my family.'],
 ['@彼女 の B1@長男 は @大学 で @勉強 @する~しています~しています','Her eldest son is studying at university.'],
 ['B1@長男 は @妹 と @同じ @学校 に @通う~通っています~かよっています','The eldest son goes to the same school as his younger sister.'],
 ['@写真 の @右 に @いる の が B1@長女 です','The one on the right in the photograph is the eldest daughter.'],
 ['B1@長女 は @弟 の @宿題 を @手伝う~手伝いました~てつだいました','The eldest daughter helped her younger brother with his homework.'],
 ['@彼 の B1@長女 は @外国 に @住む~住んでいます~すんでいます','His eldest daughter lives abroad.'],
 ['@私 は @三 @人~人~にん の @兄弟 の B1@末っ子 です','I am the youngest of three siblings.'],
 ['B1@末っ子 は @兄 の @服 を @着る~着ています~きています','The youngest child is wearing their older brother’s clothes.'],
 ['@家族 の B1@末っ子 も @大人 に @なる~なりました~なりました','The youngest in the family has grown up too.'],
]);
lesson('parents-and-married-couples','Parents and married couples',['B1@父母','B1@夫妻','B1@女房'],
 '父母 / 夫妻 / 女房','父母 names both parents, father and mother. 夫妻 refers to a husband and wife together. 女房 is a familiar expression for one’s wife; 妻 is more neutral.',[
 ['B1@父母 は @元気 です','My parents are well.'],
 ['B1@父母 が @学校 に @集まる~集まりました~あつまりました','The parents gathered at the school.'],
 ['B1@父母 と @子供 の @写真 を @撮る~撮りました~とりました','I took a photograph of the parents and child.'],
 ['@その B1@夫妻 は @隣 に @住む~住んでいます~すんでいます','That married couple lives next door.'],
 ['@先生 B1@夫妻 と @食事 を @する~しました~しました','I had a meal with the teacher and their spouse.'],
 ['@私たち は @その B1@夫妻 と @旅行 @する~しました~しました','We travelled with that married couple.'],
 ['@彼 は @自分 の @妻 を B1@女房 と @呼ぶ~呼んでいます~よんでいます','He refers to his wife as nyoubou.'],
 ['B1@女房 と @二人 で A2@開く~開いた~ひらいた @店 です','This is the shop my wife and I opened together.'],
 ['@これ は B1@女房 が @作る~作った~つくった @料理 です','This is a dish my wife made.'],
]);
lesson('caring-for-family','Caring for children and parents',['B1@育児','B1@孝行'],
 '育児 / 親に孝行します','育児 is the work of raising children. 孝行 describes showing care or devotion, especially toward parents. The examples show different ways people care for family members.',[
 ['@夫 と @一緒 に B1@育児 を @する~しています~しています','I am raising our child together with my husband.'],
 ['B1@育児 について @友達 に @相談 @する~しました~しました','I asked my friend for advice about childcare.'],
 ['@仕事 と B1@育児 で @忙しい です','I am busy with work and childcare.'],
 ['@親 に B1@孝行 @する~したい~したい です','I want to show care for my parents.'],
 ['@彼女 は @母 に B1@孝行 @する~しています~しています','She is devoted to her mother.'],
 ['@旅行 は @父 に B1@孝行 @する @機会 に @なる~なりました~なりました','The trip became an opportunity to show care for my father.'],
]);
lesson('a-family-visit-account','Visiting relatives',[],
 '叔母 / 叔父 / 長女 / 姪 / 育児','Follow the family introductions during the visit.',[
 ['@休み に B1@叔母 の @家 を @訪ねる~訪ねました~たずねました','I visited my aunt’s house during the holiday.'],
 ['B1@叔父 は @台所 で @料理 を @作る~作っていました~つくっていました','My uncle was cooking in the kitchen.'],
 ['@私 の B1@長女 も @一緒 に @行く~行きました~いきました','My eldest daughter came with me.'],
 ['B1@叔母 は @私 の B1@長女 に @学校 の @話 を @聞く~聞きました~ききました','My aunt asked my eldest daughter about school.'],
 ['@姉 と @姉 の @娘 も @来る~来ました~きました','My older sister and her daughter came too.'],
 ['@小さい B1@姪 は @庭 で @遊ぶ~遊びました~あそびました','My little niece played in the garden.'],
 ['@姉 と B1@育児 について @話す~話しました~はなしました','I talked with my older sister about raising children.'],
]);
lesson('ancestors-and-descendants','Ancestors and descendants',['B1@先祖','B1@祖先','B1@子孫'],
 '先祖 / 祖先 / 子孫','先祖 and 祖先 both refer to ancestors. 子孫 looks in the other direction: descendants in later generations.',[
 ['@私 の B1@先祖 は @この @村 に @住む~住んでいました~すんでいました','My ancestors lived in this village.'],
 ['B1@先祖 の @名前 を @古い @記録 で @調べる~調べました~しらべました','I looked up my ancestors’ names in old records.'],
 ['@祖母 は B1@先祖 の @話 を @する~してくれました~してくれました','My grandmother told me about our ancestors.'],
 ['@二つ の @家族 に は @共通 の B1@祖先 が @いる~います~います','The two families have a common ancestor.'],
 ['B1@祖先 の @生活 について @読む~読みました~よみました','I read about the lives of our ancestors.'],
 ['@この @記録 は B1@祖先 が @書く~書いた~かいた @物 です','This record was written by an ancestor.'],
 ['@私たち は @その @家族 の B1@子孫 です','We are descendants of that family.'],
 ['B1@子孫 に @昔 の @話 を @伝える~伝えたい~つたえたい です','I want to pass old stories on to our descendants.'],
 ['@その @人 の B1@子孫 が @今 も @この @町 に @いる~います~います','That person’s descendants still live in this town.'],
]);
lesson('stages-of-adult-life','Stages of adult life',['B1@成年','B1@中年','B1@老い'],
 '成年 / 中年 / 老い','成年 refers to being legally adult. 中年 means middle age without one fixed age boundary. 老い describes ageing or old age.',[
 ['B1@成年 に @なる~なって~なって から @生活 が @変わる~変わりました~かわりました','My life changed after I reached adulthood.'],
 ['B1@成年 の @年齢 について @先生 に @質問 @する~しました~しました','I asked the teacher about the age of legal adulthood.'],
 ['@本 で B1@成年 の @意味 を @調べる~調べました~しらべました','I looked up the meaning of legal adulthood in a book.'],
 ['@物語 の @男性 は B1@中年 です','The man in the story is middle-aged.'],
 ['@彼女 は B1@中年 に @なる~なって~なって から @絵 を @始める~始めました~はじめました','She took up painting in middle age.'],
 ['B1@中年 の @夫婦 が @店 を A2@開く~開きました~ひらきました','A middle-aged couple opened a shop.'],
 ['@祖父 は B1@老い について @話す~話しました~はなしました','My grandfather talked about ageing.'],
 ['@この @本 は B1@老い と @生活 を @描く~描いています~えがいています','This book portrays ageing and daily life.'],
 ['@彼 は @自分 の B1@老い を @感じる~感じています~かんじています','He feels himself growing old.'],
]);
lesson('a-lifetime-and-longing','A lifetime and things we miss',['B1@生涯','B1@恋しい'],
 '生涯 / 恋しい','生涯 covers a whole lifetime. 恋しい expresses missing or longing for someone, a place or something familiar; it is not limited to romantic love.',[
 ['@祖父 は B1@生涯 @この @村 に @住む~住んでいました~すんでいました','My grandfather lived in this village all his life.'],
 ['@有名 な @女性 の B1@生涯 について @読む~読みました~よみました','I read about the life of a famous woman.'],
 ['@この @写真 は B1@生涯 @大切 に @する~します~します','I will treasure this photograph all my life.'],
 ['@外国 に @いる @時 は @家族 が B1@恋しい です','I miss my family when I am abroad.'],
 ['@子供 の @時 に @住む~住んでいた~すんでいた @町 が B1@恋しい です','I miss the town where I lived as a child.'],
 ['@長い @旅行 の @間 は @家 の @食事 が B1@恋しい~恋しかった~こいしかった です','During the long trip, I missed meals at home.'],
]);
lesson('old-family-records-account','Reading old family records',[],
 '姓名 / 先祖 / 生涯 / 子孫','Follow the discovery of a family connection in the records.',[
 ['@祖母 と @家族 の @古い @記録 を @読む~読みました~よみました','I read old family records with my grandmother.'],
 ['@紙 に は B1@先祖 の B1@姓名 が @書く~書かれていました~かかれていました','Our ancestors’ full names were written on the paper.'],
 ['@その @中 に @私 と @同じ @名前 の @人 が @いる~いました~いました','Among them was someone with the same name as me.'],
 ['@祖母 は @その @人 の B1@生涯 について @話す~話しました~はなしました','My grandmother told me about that person’s life.'],
 ['@私たち は @その @人 の B1@子孫 でした','We were descendants of that person.'],
 ['@私 も @子供 に @この @話 を @伝える~伝えたい~つたえたい です','I want to pass this story on to my children too.'],
]);
useTopic('visits');
lesson('brides-and-ceremonies','Brides and ceremonies',['B1@花嫁','B1@儀式'],
 '花嫁 / 儀式','花嫁 is a bride. 儀式 is a ceremony or ritual with a recognized sequence of actions; the form varies with the occasion and community.',[
 ['B1@花嫁 は @白い @服 を @着る~着ていました~きていました','The bride was wearing white.'],
 ['B1@花嫁 が @家族 と @写真 を @撮る~撮りました~とりました','The bride took a photograph with her family.'],
 ['@私 の @姉 が B1@花嫁 に @なる~なりました~なりました','My older sister became a bride.'],
 ['@結婚 の B1@儀式 に @出る~出ました~でました','I attended a wedding ceremony.'],
 ['B1@儀式 が @始まる~始まって~はじまって @部屋 が @静か に @なる~なりました~なりました','The ceremony began and the room became quiet.'],
 ['@この @地域 の B1@儀式 について @聞く~聞きました~ききました','I asked about the ceremonies of this region.'],
]);
lesson('remembering-the-deceased','Remembering someone who has died',['B1@故人','B1@葬式','B1@墓'],
 '故人 / 葬式 / 墓','故人 refers respectfully to someone who has died. 葬式 is a funeral, while 墓 is a grave or tomb.',[
 ['B1@故人 の @写真 を @家族 と @見る~見ました~みました','I looked at photographs of the deceased with the family.'],
 ['B1@故人 は @音楽 が @好き でした','The deceased loved music.'],
 ['@集まる~集まった~あつまった @人 は B1@故人 の @話 を @する~しました~しました','The people who gathered talked about the deceased.'],
 ['@祖父 の B1@葬式 に @出る~出ました~でました','I attended my grandfather’s funeral.'],
 ['B1@葬式 は @明日 @行う~行われます~おこなわれます','The funeral will be held tomorrow.'],
 ['B1@葬式 の @後 @家族 と @食事 を @する~しました~しました','After the funeral, I had a meal with the family.'],
 ['@祖母 の B1@墓 に @花 を @置く~置きました~おきました','I placed flowers at my grandmother’s grave.'],
 ['@古い B1@墓 に @名前 が @書く~書かれています~かかれています','A name is written on the old grave.'],
 ['@家族 の B1@墓 は @山 の @近く に @ある~あります~あります','The family grave is near the mountain.'],
]);
lesson('loss-and-inheritance','Loss and inheritance',['B1@亡くす','B1@相続'],
 '家族を亡くします / 相続します','亡くす means losing someone through death. 相続 refers to inheritance or succession, such as receiving a house after a relative has died.',[
 ['@彼女 は @若い @時 に @父 を B1@亡くす~亡くしました~なくしました','She lost her father when she was young.'],
 ['@友人 を B1@亡くす~亡くして~なくして @悲しい~悲しかった~かなしかった です','I was sad after losing a friend.'],
 ['@夫 を B1@亡くす~亡くした~なくした @女性 の @話 を @聞く~聞きました~ききました','I listened to the story of a woman who had lost her husband.'],
 ['@祖父 の @家 を B1@相続 @する~しました~しました','I inherited my grandfather’s house.'],
 ['B1@相続 について @家族 と @話す~話しました~はなしました','I talked with my family about inheritance.'],
 ['@姉 が B1@相続 @する~した~した @土地 は @村 に @ある~あります~あります','The land my older sister inherited is in the village.'],
]);
lesson('remembering-a-grandfather-account','Remembering a grandfather',[],
 '亡くす / 葬式 / 故人 / 墓','Follow the family gathering and the memories shared afterward.',[
 ['@去年 @祖父 を B1@亡くす~亡くしました~なくしました','I lost my grandfather last year.'],
 ['B1@葬式 に は B1@叔父 と B1@叔母 も @来る~来ました~きました','My uncle and aunt came to the funeral too.'],
 ['@家族 は B1@故人 の @写真 を @部屋 に @置く~置きました~おきました','The family placed a photograph of the deceased in the room.'],
 ['B1@叔父 は @祖父 の @若い @時 の @話 を @する~しました~しました','My uncle told stories of my grandfather when he was young.'],
 ['@後 で @家族 と @祖父 の B1@墓 に @行く~行きました~いきました','Later, I went to my grandfather’s grave with the family.'],
 ['@今 も @祖父 の @優しい @声 が B1@恋しい です','I still miss my grandfather’s gentle voice.'],
]);
}
