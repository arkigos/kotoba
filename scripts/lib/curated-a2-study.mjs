export function authorStudy({topic,lesson,lines,forms}) {
topic('study','School and learning','Describe your studies, read instructions, and explain what you can do.');
lesson('school-life','School life',[3,4,88,351,442,1245,450,991], '場所で勉強しています / Nの先生', 'Use 勉強しています to describe ongoing studies. 生徒 commonly refers to a school pupil. 中学 is a shorter form of 中学校; 大学 is university. 校長 is a school principal and 教授 a professor.', [
 ['3 で @日本語 を @勉強 @する~しています~しています','I am studying Japanese at university.'],['3 の @先生 です','I am a university teacher.'],
 ['4 は @教室 に @いる~います~います','The pupils are in the classroom.'],['4 に @英語 を @教える~教えます~おしえます','I teach English to the pupils.'],
 ['88 は @十 @人~人~にん です','There are ten people in the class.'],['88 の @友達 と @話す~話します~はなします','I talk with my classmates.'],
 ...lines([[351,'elementary school'],[442,'junior high school'],[1245,'junior high school']], [['$ の @先生 です','I am a $ teacher.'],['$ は @家 の @近く です','The $ is near my house.']]).map(([jp,en])=>[jp,en.replace('a elementary','an elementary')]),
 ['450 に @質問 @する~します~します','I ask the principal a question.'],['450 は @学校 に @いる~います~います','The principal is at school.'],
 ['991 に @質問 @する~します~します','I ask the professor a question.'],['3 の 991 です','I am a university professor.'],
]);
lesson('materials','Study materials',[89,93,94,95,194,493,527,204], 'Nで書きます / Nを使います', 'で marks the writing tool. 辞典 names a reference dictionary, and 字引 is an older word for dictionary. テキスト can mean a course textbook. ページ is a page; do not confuse it with a physical sheet of paper.', [
 ['@この 89 を @読む~読んでください~よんでください','Please read this page.'],['@次 の 89 を @見る~見てください~みてください','Please look at the next page.'],
 ...lines([[93,'a ballpoint pen'],[194,'a fountain pen']], [['$ で @書く~書きます~かきます','I write with $.'],['$ を @使う~使います~つかいます','I use $.']]),
 ['94 に @書く~書きます~かきます','I write in a notebook.'],['94 を @見せる~見せてください~みせてください','Please show me your notebook.'],
 ['95 を @使う~使います~つかいます','I use scissors.'],['95 は @机 の @上 に @ある~あります~あります','The scissors are on the desk.'],
 ['493 を @読む~読みます~よみます','I read the textbook.'],['493 を @教室 に @持つ~持って~もって @来る~来てください~きてください','Please bring the textbook to class.'],
 ...lines([[527,'dictionary'],[204,'dictionary']], [['$ を @使う~使います~つかいます','I use a $.'],['@日本語 の $ です','It is a Japanese $.']]),
]);
lesson('opening-books','Opening books',[1272], '本を開きます / 開いてください', 'With books and notebooks, 開く is read ひらく and takes を for the object being opened. Its request form is 開いてください（ひらいてください）. You already know 窓が開く（あく）, a window opening: the same written form has a different reading in that pattern.', [
 ['@本 を 1272~開いてください~ひらいてください','Please open the book.'],
 ['@辞書 を 1272~開きます~ひらきます','I open the dictionary.'],
 ['94 を 1272~開きました~ひらきました','I opened my notebook.'],
 ['493 を 1272~開いてください~ひらいてください','Please open the textbook.'],
]);
lesson('subjects','Subjects and specializations',[287,396,447,532,265,1086,465,607], 'Nを勉強します / Nが専門です', 'Mark the subject of study with を before 勉強する, or with が in Nが専門です, “N is my specialty”. 講義 is a lecture and 講堂 an auditorium. 分野 names a field of study or work.', [
 ...lines([[287,'science'],[396,'mathematics'],[447,'literature'],[532,'geography']], [['$ を @勉強 @する~しています~しています','I am studying $.'],['$ の @本 を @読む~読みます~よみます','I read a book about $.']]),
 ['@日本語 が 265 です','Japanese is my specialty.'],['265 は 396 です','My specialty is mathematics.'],
 ['@この 1086 を @勉強 @する~しています~しています','I am studying this field.'],['1086 が @違う~違います~ちがいます','The fields are different.'],
 ['465 を @聞く~聞きます~ききます','I listen to the lecture.'],['@今日 の 465 は 287 です','Today’s lecture is about science.'],
 ['607 で 465 を @聞く~聞きます~ききます','I listen to a lecture in the auditorium.'],['607 は @広い です','The auditorium is spacious.'],
]);
lesson('reading','Reading and writing',[137,178,776,832,612,1105,1082], 'Nを写します / Nの読み', '文章 is a passage of writing; 作文 is a composition or essay. 読み means a reading or way of reading. 写す means copy something, such as text into a notebook. 章 is a chapter and 図 a diagram.', [
 ['137 を @読む~読んでください~よんでください','Please read the passage.'],['@この 137 は @短い です','This passage is short.'],
 ['178 を @書く~書きます~かきます','I write an essay.'],['178 を @先生 に @見せる~見せます~みせます','I show my essay to the teacher.'],
 ['776 を @大きい~大きく~おおきく @書く~書きます~かきます','I write the letters large.'],['776 は @小さい です','The letters are small.'],
 ['@この @漢字 の 832 は @何~何~なん です か','How is this kanji read?'],['832 を @覚える~覚えます~おぼえます','I memorize the reading.'],
 ['137 を 94 に 612~写します~うつします','I copy the passage into my notebook.'],['776 を 612~写してください~うつしてください','Please copy the letters.'],
 ['@次 の 1105 を @読む~読みます~よみます','I read the next chapter.'],['@この 1105 は @長い です','This chapter is long.'],
 ['1082 を @書く~書きます~かきます','I draw a diagram.'],['1082 を @見る~見てください~みてください','Please look at the diagram.'],
]);
lesson('language','How language works',[509,1070,361,790,1140,719], 'NにはNがあります / Nに翻訳します', '言語 means language and 文法 grammar. 翻訳する means translate; に marks the target language. 表現 is an expression or way of expressing something. 共通 means shared or common, often in 共通のN.', [
 ['509 を @勉強 @する~します~します','I study grammar.'],['@この 509 は @難しい です','This grammar is difficult.'],
 ['@どんな 1070 を @話す~話します~はなします か','What languages do you speak?'],['@二つ の 1070 を @話す~話します~はなします','I speak two languages.'],
 ['137 を @日本語 に 361~翻訳します~ほんやくします','I translate the passage into Japanese.'],['@この 361 は @正しい です','This translation is correct.'],
 ['@この 790 は @よく @使う~使います~つかいます','I often use this expression.'],['790 の @意味 が @わかる~わかりません~わかりません','I do not understand the meaning of the expression.'],
 ['1140 の 1070 は @英語 です','Our common language is English.'],['@私たち は 1140 の @趣味 が @ある~あります~あります','We have a hobby in common.'],
 ['719 を @勉強 @する~します~します','I study the basics.'],['@これ は 509 の 719 です','This is a basic point of grammar.'],
]);
lesson('ability','What you can do',[215,1121,1127,958], 'Vることができます / Nが得意・苦手です', 'A dictionary-form verb plus ことができます states ability. こと turns the action into a noun-like phrase. 得意 means a strength and 苦手 an area of difficulty; neither is an absolute statement that you can or cannot do it. 知識 means knowledge.', [
 ['@日本語 を @読む~読む~よむ 215 が @できる~できます~できます','I can read Japanese.'],['@英語 を @話す~話す~はなす 215 が @できる~できません~できません','I cannot speak English.'],
 ['396 が 1121 です','I am good at mathematics.'],['@漢字 を @覚える~覚える~おぼえる 215 が 1121 です','I am good at memorizing kanji.'],
 ['@英語 が 1127 です','English is not my strong point.'],['@人 の @前 で @話す~話す~はなす 215 が 1127 です','I find speaking in front of people difficult.'],
 ['958 が @ある~あります~あります','I have knowledge of it.'],['287 の 958 は @少ない です','I have little knowledge of science.'],
]);
lesson('assignments','Homework and tests',[87,122,1163,558,591,993,1039], 'Nを予習・復習します / Nを修正します', '予習 prepares material before class; 復習 goes over it afterward. 集中する means concentrate, with に for the task. 修正する means correct or revise. 課題 is an assigned task and 問題 a question or problem.', [
 ['87 は @明日 です','The test is tomorrow.'],['87 の @勉強 を @する~します~します','I study for the test.'],
 ['122 に @答える~答えます~こたえます','I answer the question.'],['@この 122 は @難しい です','This problem is difficult.'],
 ['1163 を @する~します~します','I do the assignment.'],['1163 は 178 です','The assignment is an essay.'],
 ['509 を 558~復習します~ふくしゅうします','I review grammar.'],['@毎日 558 を @する~します~します','I review every day.'],
 ['@次 の 1105 を 591~予習します~よしゅうします','I study the next chapter in preparation for class.'],['@家 で 591 を @する~します~します','I prepare for class at home.'],
 ['@勉強 に 993~集中します~しゅうちゅうします','I concentrate on studying.'],['@今 は 993~集中しています~しゅうちゅうしています','I am concentrating right now.'],
 ['178 を 1039~修正します~しゅうせいします','I revise the essay.'],['@答え を 1039~修正しました~しゅうせいしました','I corrected the answer.'],
]);
lesson('questions','Checking understanding',[1126,1091,814,219], 'Nが必要です / Nを参考にします', '必要 is a な-adjective meaning necessary; Nが必要です identifies what is needed. 正確 means accurate. 参考にします means use something as a reference. 疑問 is a question or doubt that you want to resolve.', [
 ['1126 が @ある~あります~あります','I have a question about it.'],['@この 1126 を @先生 に @話す~話します~はなします','I tell the teacher about this question.'],
 ['1091 な @答え です','It is an accurate answer.'],['1091 に @書く~書いてください~かいてください','Please write it accurately.'],
 ['@この @本 を 814 に @する~します~します','I use this book as a reference.'],['814 に @見る~見てください~みてください','Please look at it for reference.'],
 ['@辞書 が 219 です','I need a dictionary.'],['@もっと @時間 が 219 です','I need more time.'],
]);
lesson('research','Research and evidence',[628,967,995,1223,836,1164], 'Nで実験します / Nを証明します', '実験する means conduct an experiment and 証明する means demonstrate or prove. 学者 is a scholar or researcher. 学 is a formal word for learning or scholarship, often used in set expressions. 学習 is learning or study.', [
 ['628 で 967~実験します~じっけんします','I conduct an experiment in the laboratory.'],['628 は 3 に @ある~あります~あります','The laboratory is at the university.'],
 ['967 の @時間 です','It is time for the experiment.'],
 ['@答え が @正しい 215 を 995~証明します~しょうめいします','I prove that the answer is correct.'],['@この 995 は @難しい です','This proof is difficult.'],
 ['1223 は @本 を @書く~書いています~かいています','The scholar is writing a book.'],['1223 は 3 で @働く~働いています~はたらいています','The scholar works at the university.'],
 ['@あの @人 は 836 が @ある~あります~あります','That person is learned.'],['@父 も 836 が @ある~あります~あります','My father is learned too.'],
 ['@日本語 の 1164 を @する~しています~しています','I am studying Japanese.'],['1164 の @時間 は @毎日 @同じ です','My study time is the same every day.'],
]);
lesson('qualifications','Finishing a course',[293,1102,1109,884,1123,1226], 'Nを卒業します / Nを取りました', '卒業する uses を for the school you graduate from. 資格 is a qualification and 単位 a unit or an academic credit. 級 names a grade or class of proficiency; 三級 is level three. 優秀 describes someone or something as excellent.', [
 ['3 を 293~卒業しました~そつぎょうしました','I graduated from university.'],['293 は @来年 です','Graduation is next year.'],
 ['1102 を @取る~取りました~とりました','I obtained a qualification.'],['@この @仕事 に は 1102 が 219 です','This job requires a qualification.'],
 ['1109 を @取る~取りました~とりました','I earned a course credit.'],['@時間 の 1109 です','It is a unit of time.'],
 ['@三 884 の 87 です','It is a level-three test.'],['@二 884 の 87 は @難しい です','The level-two test is difficult.'],
 ['1123 な 4 です','The pupil is excellent.'],['1123 な @先生 です','The teacher is excellent.'],
 ['1226 は @学校 に @いる~います~います','The children are at school.'],['1226 に @本 を @読む~読みます~よみます','I read a book to the children.'],
]);
}
