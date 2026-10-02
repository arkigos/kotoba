export function authorStudyDetails({useTopic,lesson:authorLesson,course}) {
const glosses={
 407:'note; memo',891:'ink',863:'notice; posting a notice',825:'absence; non-attendance',519:'dormitory',
 277:'grades; results',437:'progress; improvement',601:'error; mistake',818:'to check; to make sure',841:'to count',
 219:'research paper; thesis',222:'process; course of development',716:'to use; to employ',
 276:'to exclude; to remove',370:'exception',606:'the same; identical',686:'individual; each',
 538:'level; standard',643:'to raise; to improve',648:'capable; competent',269:'easy; simple',
 132:'contribution; contributing to a goal',547:'provision; supply; payment',871:'cooperation; coordination',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('education');
lesson('notes-and-notices','Notes, ink and notices',[407,891,863], 'メモを取ります / インク / 掲示を見ます', 'メモを取る means taking notes. 掲示 can refer to a displayed notice or to posting one for people to read.', [
 ['@先生 の @話 を @聞く~聞きながら~ききながら 407 を @取る~取ります~とります','I take notes while listening to the teacher.'],
 ['@大切 な @日 を 407 に @書く~書きました~かきました','I wrote the important date in a note.'],
 ['@昨日 の 407 を @見る~見ながら~みながら @説明 @する~します~します','I will explain while looking at yesterday’s notes.'],
 ['@ペン の 891 が @なくなる~なくなりました~なくなりました','The pen ran out of ink.'],
 ['@青い 891 で @名前 を @書く~書きました~かきました','I wrote my name in blue ink.'],
 ['@新しい 891 を @買う @必要 が @ある~あります~あります','I need to buy new ink.'],
 ['@入り口 の 863 を @読む~読んで~よんで ください','Please read the notice at the entrance.'],
 ['@試験 の @日 は 863 で @確認 @する~しました~しました','I checked the exam date on the notice.'],
 ['@教室 の @前 に @新しい @予定 を 863 @する~しました~しました','We posted the new schedule outside the classroom.'],
]);
lesson('dorm-and-absence','Dormitory life and missing class',[519,825], '寮に住みます / 授業を欠席します', '寮 is a dormitory, often for students or employees. 欠席する means being absent from an event or class; the event can be marked with を.', [
 ['@大学 の 519 に @住む~住んでいます~すんでいます','I live in the university dormitory.'],
 ['519 から @教室 まで @歩く~歩きます~あるきます','I walk from the dormitory to the classroom.'],
 ['519 の @食堂 で @友達 に @会う~会いました~あいました','I met a friend in the dormitory dining hall.'],
 ['@風邪 で @授業 を 825 @する~しました~しました','I missed class because of a cold.'],
 ['@明日 825 @する こと を @先生 に @伝える~伝えました~つたえました','I told the teacher I would be absent tomorrow.'],
 ['825 @する @場合 は @学校 に @連絡 @する~して~して ください','Please contact the school if you will be absent.'],
]);
lesson('grades-and-progress','Grades and progress',[277,437], '成績が上がります / 進歩します', '成績 refers to results or grades. 進歩 is improvement or progress over time; it can describe someone’s learning as well as advances in a field.', [
 ['@この 712 の 277 は @いい~よかった~よかった です','My grades were good this term.'],
 ['@毎日 @勉強 @する~して~して 277 が @上がる~上がりました~あがりました','I studied every day, and my grades improved.'],
 ['@試験 の 277 について @先生 と @話す~話しました~はなしました','I discussed my exam results with the teacher.'],
 ['@毎日 @練習 @する~して~して @少し 437 @する~しました~しました','I practiced every day and made a little progress.'],
 ['@日本語 の 437 を @先生 が @喜ぶ~喜んでくださいました~よろこんでくださいました','The teacher was pleased with my progress in Japanese.'],
 ['@昔 の @ノート を @見る~見て~みて @自分 の 437 が @わかる~わかりました~わかりました','Looking at my old notebooks showed me how much I had improved.'],
]);
lesson('checking-and-counting','Checking an answer carefully',[601,818,841], '誤りを直します / 答えを確かめます / 数えます', '誤り is an error, especially in writing, information or a calculation. 確かめる is checking something to make sure. 数える means counting individual items or people.', [
 ['@計算 に 601 が @ある~ありました~ありました','There was an error in the calculation.'],
 ['@文章 の 601 を @直す~直しました~なおしました','I corrected the errors in the text.'],
 ['@この @答え に は 601 が @ある~ありません~ありません','There are no errors in this answer.'],
 ['@答え が @正しい か 818~確かめました~たしかめました','I checked whether the answer was correct.'],
 ['@送る @前 に @名前 を 818~確かめて~たしかめて ください','Please check the name before sending it.'],
 ['@本 で @言葉 の @意味 を 818~確かめます~たしかめます','I check the meaning of the word in a book.'],
 ['@教室 に @いる @人 を 841~数えました~かぞえました','I counted the people in the classroom.'],
 ['@紙 を 841~数えて~かぞえて から @先生 に @渡す~渡します~わたします','I count the sheets of paper before handing them to the teacher.'],
 ['@正しい @答え を @もう一度 841~数えました~かぞえました','I counted the correct answers again.'],
]);
lesson('research-process','Describing a research process',[219,222,716], '論文を書きます / 研究の過程 / 方法を用います', '論文 is a research paper or thesis. 過程 is the process through which something develops. 用いる means using something and is common in formal explanations and writing.', [
 ['@日本 の @歴史 について 219 を @書く~書いています~かいています','I am writing a paper about Japanese history.'],
 ['@先生 の 219 を @図書館 で @読む~読みました~よみました','I read the teacher’s paper at the library.'],
 ['219 の @最後 に @結果 を @説明 @する~しました~しました','I explained the results at the end of the paper.'],
 ['@研究 の 222 を @詳しい~詳しく~くわしく @書く~書きました~かきました','I wrote about the research process in detail.'],
 ['@子供 が @言葉 を @覚える 222 に @興味 が @ある~あります~あります','I am interested in the process by which children learn language.'],
 ['@作品 が @できる まで の 222 を @記録 @する~しました~しました','I recorded the process of creating the work.'],
 ['@この @研究 で は @新しい @方法 を 716~用います~もちいます','This study uses a new method.'],
 ['@図 を 716~用いて~もちいて @結果 を @説明 @する~しました~しました','I explained the results using a diagram.'],
 ['219 で 716~用いた~もちいた @言葉 の @意味 を @調べる~調べました~しらべました','I looked up the meanings of the words used in the paper.'],
]);
lesson('scope-and-exceptions','Groups, individuals and exceptions',[276,370,606,686], '除きます / 例外 / 同一のN / 個々のN', '除く can mean leaving something out of a group or calculation. 例外 is an exception. 同一 emphasizes that things are the same; 個々 focuses on each separate member of a group.', [
 ['@先生 を 276~除いて~のぞいて @全員 が @学生 です','Everyone except the teacher is a student.'],
 ['@名前 を 276~除いて~のぞいて @結果 を @報告 @する~しました~しました','We reported the results without including names.'],
 ['@古い @本 を 276~除いて~のぞいて @机 に @並べる~並べました~ならべました','I left out the old books and arranged the rest on the desk.'],
 ['370 について は @先生 に @聞く~聞いて~きいて ください','Please ask the teacher about the exceptions.'],
 ['@先生 は 370 を @説明 @する~しました~しました','The teacher explained the exception.'],
 ['370 を @ノート に @書く~書いて~かいて @覚える~覚えました~おぼえました','I wrote the exceptions in my notebook and learned them.'],
 ['@二つ の @教室 で 606 の 344 を @使う~使っています~つかっています','Both classrooms use the same textbook.'],
 ['@全員 が 606 の @問題 に @答える~答えました~こたえました','Everyone answered the same questions.'],
 ['@この @二つ の @文章 は 606 ではありません','These two texts are not identical.'],
 ['686 の @学生 に @合う @練習 を @考える~考えます~かんがえます','I think of exercises suited to each student.'],
 ['686 の @答え を @詳しい~詳しく~くわしく @見る~見ます~みます','I examine each answer closely.'],
 ['686 の @問題 について @先生 と @話す~話しました~はなしました','I talked with the teacher about each problem.'],
]);
lesson('study-week-account','A week of studying',[], 'Notices, notes and a corrected draft', 'Follow a student checking a notice, working on a paper and correcting a draft.', [
 ['@月曜日 に 519 の 863 を @読む~読みました~よみました','On Monday, I read a notice in the dormitory.'],
 ['@試験 の @日 を 407 に @書く~書きました~かきました','I wrote the exam date in a note.'],
 ['@授業 の @後 で 219 の @最初 の @部分 を @書く~書きました~かきました','After class, I wrote the first part of my paper.'],
 ['@研究 の 222 を @図 に @する~して~して @説明 を @書く~書きました~かきました','I made a diagram of the research process and wrote an explanation.'],
 ['@先生 は @文章 の 601 を @教える~教えてくださいました~おしえてくださいました','The teacher pointed out the errors in my text.'],
 ['@本 を @読む~読みながら~よみながら @言葉 の @意味 を 818~確かめました~たしかめました','I checked the meanings of the words while reading a book.'],
 ['@最後 に @紙 を 841~数えて~かぞえて @先生 に @渡す~渡しました~わたしました','Finally, I counted the pages and handed them to the teacher.'],
 ['@前 より @上手 に @書く~書ける~かける ように @なる~なって~なって @自分 の 437 を @感じる~感じました~かんじました','I could write better than before and felt I had made progress.'],
]);
useTopic('work');
lesson('standards-and-ability','Standards, ability and ease',[538,643,648,269], '水準を高めます / 有能なN / 容易なN', '水準 is a level or standard. 高める means raising or improving it. 有能 describes someone capable at their work. 容易 means easy and is more formal than 簡単.', [
 ['@この @会社 の @技術 は 538 が @高い です','The company’s technology is at a high level.'],
 ['@仕事 の 538 を @同じ に @する の は @難しい です','It is difficult to keep the standard of work the same.'],
 ['@去年 と @今年 の 538 を @比べる~比べました~くらべました','We compared last year’s level with this year’s.'],
 ['@仕事 の 2851 を 643~高める~たかめる @必要 が @ある~あります~あります','We need to improve efficiency at work.'],
 ['@練習 で @自分 の @能力 を 643~高めます~たかめます','I improve my ability through practice.'],
 ['@店 の @サービス の 538 を 643~高めました~たかめました','We raised the standard of service at the shop.'],
 ['@会社 は 648 な @人 を @探す~探しています~さがしています','The company is looking for capable people.'],
 ['@彼女 は @とても 648 です','She is very capable.'],
 ['648 な 77 に @仕事 の @方法 を @聞く~聞きました~ききました','I asked a capable colleague how to do the work.'],
 ['@この @問題 に @答える の は 269 ではありません','This question is not easy to answer.'],
 ['@説明 が @詳しい から @操作 は 269 です','The instructions are detailed, so operating it is easy.'],
 ['269 な @仕事 から @始める~始めました~はじめました','I started with the easy tasks.'],
]);
lesson('contributions-and-support','Contributing and working together',[132,547,871], '貢献します / 支給します / 協調します', '貢献する means contributing to a goal or cause. 支給する means supplying something or paying an allowance. 協調する emphasizes working in harmony with other people or groups.', [
 ['@新しい @技術 が @町 の @発展 に 132 @する~しました~しました','The new technology contributed to the town’s development.'],
 ['@自分 の @仕事 で @社会 に 132 @する~したい~したい です','I want to contribute to society through my work.'],
 ['@小さい @会社 も @地域 に 132 @する~しています~しています','Small companies also contribute to the local community.'],
 ['@会社 は @仕事 に @必要 な @服 を 547 @する~します~します','The company provides clothes needed for work.'],
 ['@仕事 で @使う @お金 が 547 @する~されました~されました','Money for use at work was provided.'],
 ['547 @する~された~された @道具 を @大切 に @使う~使います~つかいます','I take good care of the tools I was provided with.'],
 ['@他 の @会社 と 871 @する~して~して @計画 を 436~進めます~すすめます','We will work with other companies to move the plan forward.'],
 ['@仕事 で は 871 が @大切 です','Working together is important at work.'],
 ['@仕事 を 815~終える~おえる @ため に @全員 が 871 @する~しました~しました','Everyone worked together to finish the work.'],
]);
lesson('training-improvement-account','Improving work through training',[], 'From a shared goal to better results', 'Follow a team as they choose a goal, compare methods and put their training into practice.', [
 ['@会議 で @サービス の 538 を 643~高める~たかめる @方法 について @話す~話しました~はなしました','At the meeting, we discussed ways to raise our standard of service.'],
 ['648 な 77 が @新しい @方法 を @説明 @する~してくれました~してくれました','A capable colleague explained a new method to us.'],
 ['@前 の @方法 と 606 の @部分 も @ある~ありました~ありました','Some parts were the same as in the previous method.'],
 ['686 の @仕事 に @合う @練習 を @する~しました~しました','We did exercises suited to each task.'],
 ['@始め は 269 ではありませんでした が @だんだん @できる ように @なる~なりました~なりました','It was not easy at first, but gradually we became able to do it.'],
 ['@会社 から 547 @する~された~された @道具 も @役に立つ~役に立ちました~やくにたちました','The tools provided by the company also helped.'],
 ['@全員 が 871 @する~して~して @仕事 を 815~終えました~おえました','Everyone worked together and finished the work.'],
]);
}
