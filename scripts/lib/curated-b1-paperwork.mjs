export function authorPaperwork({topic,lesson:authorLesson}) {
const lesson=(...args)=>authorLesson(...args,{1465:'procedure; steps for completing an application or other business',1580:'service counter; point of contact',792:'filling in; entering information',1040:'apply for; sign up for',2298:'cancel; withdraw',1414:'notification; notice',669:'declaration; formally reporting information',2801:'written notification; notice submitted to an office',192:'acting on someone’s behalf; a representative',375:'allow; permit; forgive',234:'arrive; reach the recipient'});
topic('paperwork','Paperwork, applications and requests','Ask about a procedure, fill in information, sign up or cancel, and explain whose behalf you are acting on.');
lesson('counter','At the counter and on the form',[1465,1580,792], '手続きを確認します / 欄に記入します', '手続き is the set of steps for completing an application or other business. 窓口 is a service counter or point of contact, not the window of a room. 記入する means filling in information; に marks the space or document and を the information entered.', [
 ['2696 の 1465 を @確認 @する~します~します','I check the registration procedure.'],
 ['@受付 で 1465 について @聞く~聞きました~ききました','I asked about the procedure at reception.'],
 ['1580 で @番号 が @呼ぶ~呼ばれる~よばれる まで @待つ~待ちました~まちました','I waited at the counter until my number was called.'],
 ['@この 1580 で @申し込み が @できる~できます~できます か','Can I apply at this counter?'],
 ['1409 に @名前 を 792 @する~してください~してください','Please enter your name in the space.'],
 ['117 に @住所 を 792 @する~しました~しました','I entered my address on the document.'],
]);
lesson('applications','Signing up, canceling and receiving a notice',[1040,2298,1414,234], '教室に申し込みます / 申し込みを取り消します', '申し込む means to apply or sign up; に marks the activity or service. 取り消す means to cancel or withdraw something already arranged. 通知 is a notice or notification, often sent by a school, company or office. 届く describes something reaching its recipient; the item that arrives takes が.', [
 ['@日本語 の @教室 に 1040~申し込みました~もうしこみました','I signed up for a Japanese class.'],
 ['@旅行 に 1040~申し込む~もうしこむ @前 に @日 を @確認 @する~しました~しました','I checked the date before signing up for the trip.'],
 ['@予定 が @変わる~変わった~かわった ので @予約 を 2298~取り消しました~とりけしました','I canceled the reservation because my plans changed.'],
 ['@申し込み を 2298~取り消す~とりけす @方法 を @聞く~聞きました~ききました','I asked how to cancel my application.'],
 ['@学校 から 1414 が 234~届きました~とどきました','A notice arrived from the school.'],
 ['1365 の 117 は @昨日 234~届きました~とどきました','The application documents arrived yesterday.'],
 ['1414 に @書く~書いてある~かいてある @日 を @確認 @する~してください~してください','Please check the date written in the notice.'],
]);
lesson('notices','Declarations and written notices',[669,2801], '収入を申告します / 届を出します', '申告 is formally reporting information, for example one’s income or something being brought into a country. 届 is a written notification submitted to an office. These differ from an application asking for approval.', [
 ['1580 で @収入 を 669 @する~しました~しました','I declared my income at the counter.'],
 ['669 の @内容 を @もう @一度 @確認 @する~しました~しました','I checked the contents of the declaration once more.'],
 ['@住所 の @変更 の 2801 を @出す~出しました~だしました','I submitted a notice of change of address.'],
 ['2801 の 367 を @確認 @する~しました~しました','I checked the signature on the notice.'],
]);
lesson('on-behalf','Acting for someone and asking permission',[192,375], '人の代理で / Nを許します', '代理 means acting in someone else’s place. 人の代理で identifies whose behalf you are acting on. 許す can mean allowing an action or forgiving someone. The surrounding words tell you which meaning applies.', [
 ['@父 の 192 で 117 を 645~受け取りました~うけとりました','I received the documents on my father’s behalf.'],
 ['192 の @人 が @来る @予定 です','A representative is expected to come.'],
 ['@先生 は @教室 の @使用 を 375~許しました~ゆるしました','The teacher allowed us to use the classroom.'],
 ['@友達 の @間違い を 375~許しました~ゆるしました','I forgave my friend’s mistake.'],
]);
lesson('account','Signing up for a class',[], 'A connected account of an application', 'Follow the inquiry, form and notice. Reuse 窓口, 手続き, 記入 and 申し込む in a single sequence, then check the result.', [
 ['@町 の @日本語 @教室 に 1040~申し込みたい~もうしこみたい と @思う~思いました~おもいました','I thought I would like to sign up for the town’s Japanese class.'],
 ['1580 で 1465 の @説明 を @聞く~聞きました~ききました','I listened to an explanation of the procedure at the counter.'],
 ['117 に @名前 と @住所 を 792 @する~して~して 88 @する~しました~しました','I filled in my name and address on the document and submitted it.'],
 ['@学校 から の 1414 は @メール で 234~届きました~とどきました','The notice from the school arrived by email.'],
 ['@教室 が @始まる @日 を @確認 @する~して~して @ノート に @書く~書きました~かきました','I checked the date the class would start and wrote it in my notebook.'],
]);
}
