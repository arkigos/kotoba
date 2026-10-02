export function authorWorkplaceSystems({useTopic,lesson:authorLesson,course}) {
const glosses={
 'B1@システム':'system','B1@仕組み':'workings; mechanism; structure',
 'B1@導入':'introduction; bringing into use','B1@運用':'operation; putting into practical use',
 'B1@オンライン':'online','B1@専用':'dedicated use; exclusive use',
 'B1@勤務':'work; service at a workplace','B1@人事':'personnel affairs; human resources',
 'B1@新人':'newcomer; new member','B1@部下':'subordinate; someone who reports to you',
 'B1@派遣':'dispatch; sending personnel','B1@配置':'arrangement; assignment of people or equipment',
 'B1@資金':'funds; capital','B1@資産':'assets; property',
 'B1@確保':'securing; ensuring availability','B1@業者':'vendor; contractor; business',
 'B1@取引':'business dealings; transaction','B1@報酬':'payment or reward for work',
 'B1@提供':'providing; making available','B1@配布':'distribution',
 'B1@入手':'obtaining; getting hold of','B1@了解':'understanding; agreement',
 'B1@事前':'beforehand; in advance','B1@詳細':'details; detailed',
 'B1@通常':'usual; normally','B1@各種':'various kinds; all sorts',
 'B1@不明':'unknown; unclear','B1@事項':'item; matter',
 'B1@まとめ':'summary','B1@優先':'priority; giving precedence',
};
const lesson=(...args)=>{
 authorLesson(...args,glosses);
 course.lessons.at(-1).notes[0].title=args[2].length?'Word usage':'In this passage';
};
useTopic('technology');
lesson('systems-in-use','Understanding and operating a system',['B1@システム','B1@仕組み','B1@導入','B1@運用'],
 '仕組み / システムを導入します / 運用します','仕組み is how something is organized or works. 導入 brings a system into use; 運用 concerns using and managing it in practice.',[
 ['@学校 で @新しい B1@システム を @使う~使っています~つかっています','We use a new system at school.'],
 ['B1@システム の @問題 を @担当 の @人 に @伝える~伝えました~つたえました','I told the person in charge about a problem with the system.'],
 ['@この B1@システム は @毎日 @使う~使われています~つかわれています','This system is used every day.'],
 ['@機械 の B1@仕組み を @調べる~調べました~しらべました','I studied how the machine works.'],
 ['@この B1@仕組み は @簡単 です','The way this works is simple.'],
 ['@図 で B1@仕組み を @説明 @する~します~します','I will explain how it works using a diagram.'],
 ['@会社 は @新しい B1@システム を B1@導入 @する~しました~しました','The company introduced a new system.'],
 ['B1@導入 の @前 に @使う @練習 を @する~しました~しました','We practiced using it before its introduction.'],
 ['B1@システム の B1@導入 は @来月 です','The system will be introduced next month.'],
 ['@学校 で B1@システム を B1@運用 @する~しています~しています','We operate the system at school.'],
 ['B1@運用 の @方法 を @確認 @する~しました~しました','I checked the operating procedures.'],
 ['B1@システム の B1@運用 に @必要 な @お金 を @計算 @する~しました~しました','We calculated the costs needed to operate the system.'],
]);
lesson('online-and-dedicated','Online and dedicated services',['B1@オンライン','B1@専用'],
 'オンラインで / N専用の','オンライン describes an internet connection or activity. 専用 identifies a particular user or purpose; it does not necessarily mean that something is private.',[
 ['B1@オンライン で @会議 に @参加 @する~しました~しました','I joined the meeting online.'],
 ['@この @授業 は B1@オンライン です','This class is online.'],
 ['B1@オンライン で @本 を @注文 @する~しました~しました','I ordered a book online.'],
 ['@学生 B1@専用 の @部屋 が @ある~あります~あります','There is a room for students only.'],
 ['@この @パソコン は @仕事 B1@専用 です','This computer is used only for work.'],
 ['@お客さん B1@専用 の @電話 @番号 を @教える~教えました~おしえました','I gave them the telephone number reserved for customers.'],
]);
lesson('school-system-account','A school system goes into use',[],
 '導入 / 仕組み / 運用','Follow the preparation and use of the school’s system.',[
 ['@学校 は @新しい B1@システム を B1@導入 @する~しました~しました','The school introduced a new system.'],
 ['@最初 に @先生 が B1@仕組み を @説明 @する~しました~しました','First, the teacher explained how it works.'],
 ['@学生 は B1@オンライン で @質問 @する~しました~しました','Students asked questions online.'],
 ['@学校 は B1@システム B1@専用 の @パソコン を @用意 @する~しました~しました','The school prepared a computer dedicated to the system.'],
 ['@今 は @学校 で B1@システム を B1@運用 @する~しています~しています','The school now operates the system.'],
]);
useTopic('work');
lesson('staff-and-responsibilities','Staff and responsibilities',['B1@勤務','B1@人事','B1@新人','B1@部下'],
 '勤務します / 人事 / 新人 / 部下','勤務する describes working at a workplace. 人事 here concerns personnel. 新人 is someone new to a group; 部下 describes a person’s position in relation to a supervisor.',[
 ['@私 は @市 の @病院 に B1@勤務 @する~しています~しています','I work at the city hospital.'],
 ['@明日 の B1@勤務 は @朝 から です','My shift tomorrow begins in the morning.'],
 ['B1@勤務 @時間 を @確認 @する~しました~しました','I checked my working hours.'],
 ['@会社 で B1@人事 の @仕事 を @する~しています~しています','I work in human resources at a company.'],
 ['B1@人事 の @担当 の @人 に @相談 @する~しました~しました','I consulted the person responsible for personnel matters.'],
 ['B1@人事 について @会議 を @する~しました~しました','We held a meeting about personnel matters.'],
 ['@今日 @二人 の B1@新人 が @来る~来ました~きました','Two new members arrived today.'],
 ['B1@新人 に @仕事 の @流れ を @説明 @する~しました~しました','I explained the work process to the newcomer.'],
 ['@私 も @去年 は B1@新人 でした','I was new last year, too.'],
 ['@上司 が B1@部下 の @話 を @聞く~聞いています~きいています','The supervisor is listening to a team member.'],
 ['B1@部下 に @仕事 を @頼む~頼みました~たのみました','I asked someone who reports to me to do a task.'],
 ['B1@部下 と @一緒 に @計画 を @考える~考えました~かんがえました','I worked on the plan with a member of my staff.'],
]);
lesson('sending-and-placing-staff','Sending and assigning staff',['B1@派遣','B1@配置'],
 '人を派遣します / 配置します','派遣する sends people somewhere for a task. 配置する assigns people or equipment to positions. The place takes に.',[
 ['@会社 は @外国 に @先生 を B1@派遣 @する~しました~しました','The company sent teachers abroad.'],
 ['B1@派遣 の @期間 は @来年 の @三 月 まで です','The assignment lasts until March next year.'],
 ['@病院 に @医者 が B1@派遣 @する~されました~されました','Doctors were sent to the hospital.'],
 ['@入り口 に @説明 を @する @人 を B1@配置 @する~しました~しました','We stationed someone at the entrance to explain things.'],
 ['@机 の B1@配置 を @変える~変えました~かえました','We changed the arrangement of the desks.'],
 ['B1@新人 を @二つ の @グループ に B1@配置 @する~しました~しました','We assigned the new members to two groups.'],
]);
lesson('funds-assets-and-suppliers','Funds, assets and suppliers',['B1@資金','B1@資産','B1@確保','B1@業者'],
 '資金 / 資産 / 確保します / 業者','資金 is money available for a purpose. 資産 includes property and other assets, not only cash. 確保する secures something needed; 業者 identifies a business or contractor in a trade.',[
 ['@新しい @計画 の B1@資金 を @集める~集めています~あつめています','We are raising funds for a new project.'],
 ['B1@資金 が @足りる~足りません~たりません','We do not have enough funds.'],
 ['B1@資金 を @使う @方法 を @説明 @する~しました~しました','We explained how the funds would be used.'],
 ['@会社 の B1@資産 を @調べる~調べました~しらべました','We examined the company’s assets.'],
 ['@土地 も B1@資産 の @一つ です','Land is one type of asset.'],
 ['B1@資産 の @価値 を @計算 @する~しました~しました','We calculated the value of the assets.'],
 ['@会議 の @部屋 を B1@確保 @する~しました~しました','We secured a room for the meeting.'],
 ['@研究 の B1@資金 を B1@確保 @する~しました~しました','We secured funds for the research.'],
 ['@仕事 に @必要 な @時間 を B1@確保 @する~します~します','I will make sure I have the time needed for the work.'],
 ['@修理 の B1@業者 に @電話 @する~しました~しました','I called a repair contractor.'],
 ['@二つ の B1@業者 の @料金 を @比べる~比べました~くらべました','I compared the prices of two service providers.'],
 ['B1@業者 と @作業 の @日 を @決める~決めました~きめました','We agreed on a work date with the contractor.'],
]);
lesson('transactions-and-payment','Business dealings and payment',['B1@取引','B1@報酬'],
 '取引します / 報酬','取引 concerns business dealings or transactions. 報酬 is payment or a reward for work; it can be a fee for a particular task rather than a regular salary.',[
 ['@外国 の @会社 と B1@取引 @する~しています~しています','We do business with an overseas company.'],
 ['B1@取引 の @条件 を @確認 @する~しました~しました','We checked the terms of the transaction.'],
 ['@この B1@業者 と の B1@取引 は @初めて です','This is our first transaction with this supplier.'],
 ['@仕事 の B1@報酬 を @もらう~もらいました~もらいました','I received payment for the work.'],
 ['B1@報酬 は @会社 と @相談 @する~して~して @決める~決めました~きめました','We agreed on the payment after discussing it with the company.'],
 ['@作業 の @前 に B1@報酬 について @話す~話しました~はなしました','We discussed payment before starting the work.'],
]);
lesson('office-reorganization-account','Organizing a new team',[],
 '新人 / 配置 / 資金 / 業者','Follow the people, funds and equipment needed for the new team.',[
 ['B1@人事 の @担当 の @人 が B1@新人 に @会う~会いました~あいました','The person responsible for personnel matters met the new members.'],
 ['B1@新人 を @グループ に B1@配置 @する~して~して @役割 を @説明 @する~しました~しました','We assigned the new members to groups and explained their roles.'],
 ['@会社 は @機械 を @買う @ため の B1@資金 を B1@確保 @する~しました~しました','The company secured funds to buy equipment.'],
 ['B1@業者 と B1@取引 の @条件 を @確認 @する~しました~しました','We checked the terms of the transaction with the supplier.'],
 ['@機械 の B1@配置 を @決める~決めて~きめて @仕事 を @始める~始めました~はじめました','We decided where to put the equipment and started work.'],
]);
useTopic('post');
lesson('sharing-and-acknowledging','Sharing and acknowledging information',['B1@提供','B1@配布','B1@入手','B1@了解'],
 '提供します / 配布します / 入手します / 了解しました','提供 makes something available; 配布 distributes it to people. 入手 means obtaining it. 了解しました acknowledges understanding or agreement; it can sound brisk in a formal exchange.',[
 ['@会社 が @必要 な @情報 を B1@提供 @する~しました~しました','The company provided the information we needed.'],
 ['@この @サービス は @無料 で B1@提供 @する~されています~されています','This service is provided free of charge.'],
 ['@学校 に @パソコン を B1@提供 @する~しました~しました','We provided computers to the school.'],
 ['@会議 の @前 に B1@書類 を B1@配布 @する~しました~しました','We distributed the documents before the meeting.'],
 ['@全員 に @地図 を B1@配布 @する~します~します','We will hand out maps to everyone.'],
 ['B1@配布 @する~された~された @紙 に @名前 を @書く~書きました~かきました','I wrote my name on the sheet that had been handed out.'],
 ['@必要 な @本 を B1@入手 @する~しました~しました','I obtained the book I needed.'],
 ['@この @情報 は @どこ で B1@入手 @する~しました~しました か','Where did you get this information?'],
 ['B1@入手 @する~した~した B1@書類 を @上司 に @見せる~見せました~みせました','I showed my supervisor the documents I had obtained.'],
 ['@予定 の @変更 を B1@了解 @する~しました~しました','I acknowledged the change in plans.'],
 ['@全員 が @条件 を B1@了解 @する~しました~しました','Everyone accepted the terms.'],
 ['@相手 の B1@了解 を @確認 @する~しました~しました','I confirmed the other person’s agreement.'],
]);
lesson('information-for-a-meeting-account','Preparing information for a meeting',[],
 '提供 / 入手 / 配布 / 了解','Follow the information from the source to the meeting participants.',[
 ['B1@業者 が B1@システム の @情報 を B1@提供 @する~しました~しました','The supplier provided information about the system.'],
 ['@私 は @必要 な B1@書類 を B1@入手 @する~しました~しました','I obtained the documents we needed.'],
 ['@会議 に @参加 @する @人 に B1@書類 を B1@配布 @する~しました~しました','I distributed the documents to the people attending the meeting.'],
 ['@上司 が @予定 の @変更 を @説明 @する~しました~しました','The supervisor explained the change in plans.'],
 ['@私 は B1@了解 @する~しました~しました と @答える~答えました~こたえました','I replied that I understood.'],
]);
useTopic('paperwork');
lesson('details-and-routine','Details and routine procedures',['B1@事前','B1@詳細','B1@通常','B1@各種'],
 '事前に / 詳細 / 通常 / 各種の','事前に means beforehand. 詳細 names the details or describes something as detailed. 通常 is what normally happens; 各種 groups several kinds together.',[
 ['@会議 の @予定 を B1@事前 に @確認 @する~しました~しました','I checked the meeting schedule in advance.'],
 ['B1@事前 の @連絡 が @必要 です','Advance notice is required.'],
 ['B1@事前 に B1@書類 を @読む~読みました~よみました','I read the documents beforehand.'],
 ['@計画 の B1@詳細 を @聞く~聞きました~ききました','I asked for details of the plan.'],
 ['B1@詳細 な @説明 を @読む~読みました~よみました','I read a detailed explanation.'],
 ['B1@詳細 は @後 で @メール で @送る~送ります~おくります','I will email the details later.'],
 ['B1@通常 は @朝 に @会議 を @する~します~します','We normally hold meetings in the morning.'],
 ['@明日 は B1@通常 の @時間 に @始める~始めます~はじめます','We will start at the usual time tomorrow.'],
 ['B1@通常 と @違う @方法 で B1@申し込む~申し込みました~もうしこみました','I applied using a different method from the usual one.'],
 ['B1@各種 の B1@書類 を @用意 @する~しました~しました','I prepared various kinds of documents.'],
 ['B1@各種 の @サービス を @紹介 @する~します~します','We will introduce various services.'],
 ['@この @店 は B1@各種 の @商品 を @売る~売っています~うっています','This shop carries various kinds of products.'],
]);
lesson('unclear-items-and-priorities','Unclear items and priorities',['B1@不明','B1@事項','B1@まとめ','B1@優先'],
 '不明な点 / 事項 / まとめ / 優先します','不明 describes what is unknown or unclear. 事項 is a matter or item to address. A まとめ gathers the main points; 優先する gives one thing precedence over another.',[
 ['@原因 は @まだ B1@不明 です','The cause is still unknown.'],
 ['B1@不明 な @点 を @質問 @する~しました~しました','I asked about the points that were unclear.'],
 ['B1@書類 の @一つ は @場所 が B1@不明 です','The location of one of the documents is unknown.'],
 ['@必要 な B1@事項 を @書く~書いて~かいて ください','Please fill in the required items.'],
 ['@注意 B1@事項 を @読む~読みました~よみました','I read the points to note.'],
 ['@確認 @する B1@事項 を @紙 に @書く~書きました~かきました','I wrote down the items to check.'],
 ['@会議 の B1@まとめ を @読む~読みました~よみました','I read the meeting summary.'],
 ['@最後 に @今日 の @話 の B1@まとめ を @する~します~します','At the end, I will summarize today’s discussion.'],
 ['@この B1@まとめ は @短い です が @大切 な こと が @全部 @入る~入っています~はいっています','This summary is short but includes all the important points.'],
 ['@急ぐ @仕事 を B1@優先 @する~します~します','I will give urgent work priority.'],
 ['@安全 を B1@優先 @する~して~して @計画 を @変える~変えました~かえました','We put safety first and changed the plan.'],
 ['@どの @注文 を B1@優先 @する~します~します か','Which order will you give priority to?'],
]);
lesson('checking-the-paperwork-account','Checking the paperwork',[],
 '事前 / 不明 / 詳細 / まとめ','Follow the checks and the questions that remain.',[
 ['@会議 の @前 に B1@各種 の B1@書類 を @読む~読みました~よみました','I read the different kinds of documents before the meeting.'],
 ['B1@不明 な B1@事項 を @紙 に @書く~書きました~かきました','I wrote down the items that were unclear.'],
 ['@担当 の @人 に B1@事前 に @質問 を @送る~送りました~おくりました','I sent my questions to the person in charge in advance.'],
 ['@会議 で @計画 の B1@詳細 を @確認 @する~しました~しました','We confirmed the details of the plan at the meeting.'],
 ['@私 は @会議 の B1@まとめ を @全員 に @送る~送りました~おくりました','I sent the meeting summary to everyone.'],
]);
}
