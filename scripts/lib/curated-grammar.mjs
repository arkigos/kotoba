import fs from 'node:fs';

// These checks inspect already-authored tokens. They never create or license a
// lexical form. The independent dictionary/form validator remains authoritative.
const index=new Map(JSON.parse(fs.readFileSync('public/dictionary/jp/study-index.json','utf8')).map(r=>[r[0],{surface:r[1],pos:r[6]}]));
const pointsInside = token => ['この','その','あの','どの'].includes(token?.surface);
const endsTeClause = token => /(^|\|)v[1-5sknr]/.test(index.get(token?.dictionaryEntryId??token?.wordId)?.pos??'') && /[てで]$/.test(token?.surface??'');
// A reviewed word form can still make an invalid sentence with its neighbour.
// Keep this narrow: noun derivatives such as 高さ and な-adjectives are different.
export function grammarFormErrors(card) {
  return card.tokens.flatMap((token,i)=>{
    const word=index.get(token.wordId);
    const next=card.tokens[i+1];
    const previous=card.tokens[i-1];
    // Keep clause particles visible to the ordering/ownership audit. A lexical
    // approval must not hide e.g. 入る + と inside a supposed verb inflection.
    if(token.surface!==word?.surface && token.surface.endsWith('と') &&
       /(^|\|)v[1-5sknr]/.test(word?.pos??'') &&
       isPlainPredicate({...token,surface:token.surface.slice(0,-1)}))
      return [`${token.surface}: author と as a separate particle so its grammar can be checked`];
    if(/(^|\|)adv(?:\||$)/.test(word?.pos??'') && token.surface.endsWith('に') && next?.surface==='に')
      return [`${token.surface}に: this adverb already includes に; do not add it again`];
    if(token.surface==='万' && next?.surface==='円' && (!previous || /^(?:は|が|を|の|と)$/.test(previous.surface)))
      return ['Use 一万円 for ten thousand yen; 万円 alone is a unit without an amount'];
    if(token.surface==='九'&&next?.surface==='時'&&next.reading==='じ'&&token.reading!=='く')
      return ['九 before the clock counter 時 must be read く, not the standalone number reading'];
    if(token.surface==='中'&&token.reading==='なか'&&(previous?.wordId||previous?.dictionaryEntryId)&&!pointsInside(previous)&&!endsTeClause(previous))
      return ['中 after an activity noun must use the authored suffix reading, not the location noun なか'];
    return /(^|\|)adj-i(?:x)?(?:\||$)/.test(word?.pos??'') && /(?:い|かった)$/.test(token.surface) && next?.surface==='でした'
      ? [`${token.surface}でした: use the い-adjective past form followed by です`]
      : [];
  });
}
export const grammarRules={
  topic:['は','は marks the topic: the person or thing the sentence is about. It is pronounced wa.'],
  copula:['Nです','です makes a polite statement identifying or describing something. Japanese often leaves out an obvious subject.'],
  question:['…か','Add か at the end of a polite statement to ask a question.'],
  subject:['Nが…','が marks the person or thing that exists, acts, or has the quality being described.'],
  adjective:['い-adjective + です','An い-adjective keeps its final い before です. It can describe a thing without another verb.'],
  polite:['Vます','A polite verb normally ends in ます. Learn each verb with its polite form, since the dictionary ending changes differently for different verbs.'],
  politeNegative:['Vません','Replace the polite ending ます with ません for a negative.'],
  object:['NをV','を marks what the action acts on. It is pronounced o. Keep the object before the verb.'],
  nounLink:['NのN','の connects two nouns. The first identifies whose thing it is or what kind of thing the second noun refers to.'],
  adverbNi:['Nに + V','Some expressions use に to describe how something is done: 一緒に means together, 別々に separately, and 本当に really. Treat these as complete expressions rather than destinations.'],
  ni:['NにV','に identifies the point an action relates to: a destination, a position with an existence verb, a recipient, or a specific time. The verb determines its role; it does not always mean “to”.'],
  de:['NでV','で marks where an action takes place or the means, tool, or material used to do it. It differs from に with a destination or an existence verb.'],
  to:['NとN / NとV','と joins nouns in a list, or marks a person you do something with. It does not join two complete sentences in this use.'],
  also:['Nも…','も means also or too. It can replace は or が when the same statement applies to another person or thing.'],
  agreement:['…ね','ね invites agreement or checks that the listener shares your understanding.'],
  information:['…よ','よ presents information to the listener, often something they may not know.'],
  origin:['Nから','から after a noun marks a starting point, source, or reference point.'],
  until:['Nまで','まで marks an endpoint in time or space: until or as far as.'],
  untilClause:['Vるまで','A plain non-past verb before まで identifies the event that ends a continuing action or state. Keep the main clause after it: バスが来るまで待ちます means wait until the bus comes.'],
  suddenSequence:['Vた途端に','Put a plain past verb before 途端に for a sudden event at the instant the first action occurs. The next event is usually unexpected, rather than an intentional next step.'],
  immediateAfter:['Vた直後に / Nの直後に','直後に locates an event immediately after another one, without implying surprise. Use a plain past verb before it, or の after an event noun.'],
  past:['Vました / Vませんでした','Change the polite ending ます to ました for a completed or past action. The past negative is ませんでした.'],
  copulaPast:['Nでした','For a past noun or な-adjective statement, change です to でした.'],
  copulaNegative:['Nではありません','For a negative noun or な-adjective statement, use ではありません.'],
  copulaPastNegative:['Nではありませんでした','ではありませんでした is the polite past negative after a noun or な-adjective.'],
  naPredicate:['な-adjective + です','A な-adjective takes です at the end of a polite sentence. Do not add な there; な is used before a noun.'],
  naAttribute:['な-adjective + な + N','Put な between a な-adjective and the noun it describes.'],
  iAttribute:['い-adjective + N','An い-adjective comes directly before the noun it describes; do not add な or の.'],
  adjectivePast:['…かったです','For the past of an い-adjective, replace the final い with かった and keep です.'],
  adjectiveNegative:['…くないです','For the negative of an い-adjective, replace its final い with くない and keep です.'],
  adjectiveFormalNegative:['…くありません','For a more formal negative of an い-adjective, replace the final い with くありません. This has the same basic meaning as くないです.'],
  adjectiveAdverb:['…く + V','Replace an い-adjective’s final い with く to describe how an action happens.'],
  adjectiveQuantity:['い-adjective → …さ','Replace the final い with さ to name a quality as a noun: 深い becomes 深さ, depth, and 大きい becomes 大きさ, size.'],
  suru:['verbal noun + します','Some activity nouns combine with する, politely します, to make a verb. This is a property of these particular words, not a rule for every noun.'],
  progressive:['Vています','The verb’s て-form plus います can describe an action in progress or a continuing state after a change. Learn the meaning with the verb: it does not always mean “is doing”.'],
  itemRequest:['Nをください','Use an item followed by をください to ask politely for it.'],
  request:['Vてください','Use the verb’s て-form followed by ください to ask someone to do something. Learn the て-form with its verb; it is not made by simply adding て to the dictionary form.'],
  negativeRequest:['Vないでください','To ask someone not to do something, use its plain negative form followed by でください. The negative ending changes with the verb.'],
  permission:['Vてもいいですか','To ask permission, use the verb’s て-form followed by もいいですか.'],
  invitation:['Vませんか','A polite negative question can invite someone to do something together. Context distinguishes an invitation from an ordinary negative question.'],
  suggestion:['Vましょう','Replace ます with ましょう to suggest doing something together: “Let us …”.'],
  desire:['Vたいです / Vたくないです','Remove ます and add たいです to express your own wish to do something. The negative is たくないです.'],
  pastDesire:['Vたかったです','Change the wish ending たい to たかった for a past wish. This describes what you wanted, not whether it happened.'],
  changingDesire:['Vたくなる','Change たい to たく before なる to describe coming to want something or developing a wish.'],
  ease:['Vます-stem + やすい / にくい','Remove ます and add やすい for easy to do or にくい for difficult to do. These combinations behave like い-adjectives and can also describe how readily something happens.'],
  excess:['Verb stem / adjective + すぎます','Add すぎます to a verb’s stem before ます to describe doing too much. Remove the final い from an い-adjective, or add it directly to a な-adjective without な, to describe an excessive degree.'],
  reportedSpeech:['words / clause + と + speech verb','と can mark the words someone says. It works with 言う and its respectful or humble equivalents. A reported statement uses a plain clause, as in 学生だと申しました; an exact quotation keeps the words as spoken, including polite endings. 何とおっしゃいましたか asks what the person said.'],
  quote:['plain clause + と思います','と introduces the content of a thought. Use a plain clause before it: nouns and な-adjectives take だ, while an い-adjective keeps its ordinary ending.'],
  reason:['clause + から','から after a clause gives a reason. In the polite pattern, keep です or the polite verb ending before から.'],
  teAfter:['Vてから、V','The て-form followed by から means after doing that action. The next action follows it in time. This から is different from から after a complete clause giving a reason.'],
  benefactiveRespect:['Vてくださいます','After a て-form, くださいます respectfully describes someone doing something for you or your group. It is the respectful counterpart of くれます.'],
  respectfulPresence:['いらっしゃいます / おいでになります','These expressions respectfully describe someone else being somewhere, coming or going. Context distinguishes the three meanings. Do not use them for your own action or to elevate your own family or colleagues when speaking to an outsider.'],
  respectfulAuxiliary:['Vていらっしゃいます / Nでいらっしゃいます','After a verb’s て-form, いらっしゃいます can respectfully express an ongoing action or state, or movement with that action. After a noun and で, it can respectfully identify or describe someone. These uses need instruction beyond the standalone be, come and go meanings.'],
  ability:['Vることができます','A dictionary-form verb followed by ことができます expresses being able to do that action. こと turns the action into a noun-like expression.'],
  nounAbility:['Nができます','With an activity noun, ができます means can do that activity. This is the basic noun pattern, before learning potential verb forms or ことができます.'],
  teSequence:['Vて、V','The て-form can connect actions in order or connect closely related actions. The final verb gives the tense and politeness of the whole sequence.'],
  plainClause:['plain verb + N / clause','A plain verb form can describe the following noun or form part of a larger clause. Keep its objects and particles before it; Japanese does not insert an English-style “that” or “which”.'],
  verbAppearance:['verb stem + そうです','Attach そうです to the stem before ます to describe an event that looks likely to happen: 降ります → 降りそうです. This differs from hearsay after a whole plain clause.'],
  hearsay:['plain clause + そうです','Put a complete plain clause before そうです to report information you heard or read. 降るそうです reports rain; 降りそうです describes how things look. A noun or な-adjective takes だ before hearsay そうです.'],
  plainNegative:['plain negative verb','The plain negative ends in ない. Use it before a noun or inside a larger clause: しからない人 is a person who does not scold. It differs from the polite ending ません.'],
  plainPastNegative:['Vなかった','For the plain past negative, change ない to なかった: 来ない → 来なかった. The reading is こなかった.'],
  plainProgressive:['Vている + N','Inside a noun-modifying clause, use ている instead of polite ています. 勉強している者 is someone who is studying.'],
  explanatoryNo:['plain clause + のですか','のですか asks for an explanation or background to a situation. Use a plain clause before の, including a plain negative or past form.'],
  contrast:['clause + が、clause','が after a complete clause connects contrasting statements, like but. Keep the clause ending before it: 負けでしたが means we lost, but. This is different from が marking a subject.'],
  concession:['Vても、clause','The て-form followed by も means even if or even though. 失敗しても means even if I fail. Here も follows a verb clause, rather than marking an additional person or thing.'],
  intention:['Vる / Vない + つもりです','つもりです expresses an intention. Put a plain positive or negative verb before it.'],
  expectation:['plain verb / Nの + はずです','はずです gives an expectation based on a reason. It does not express an obligation.'],
  unchanged:['Vた / Nの + まま','まま describes a state left unchanged while something else happens.'],
  conditionalTo:['plain verb + と、result','と after a plain verb can connect a condition to its regular or predictable result. Here, turning on the lighting leads to a brighter room. This is different from と joining nouns or quoting speech.'],
  withoutDoing:['Vずに','Replace ない in a plain negative with ずに to mean without doing: 使わない → 使わずに. The irregular form of する is せずに.'],
  resourceFor:['Vるのに + time / money + かかる','の turns the action into a noun-like phrase; に links it to the time or money needed. 洗うのに三時間かかりました means washing took three hours. This is not the concessive のに meaning although.'],
  standingArrangement:['Vることになっています','ことになっています describes an existing arrangement or rule. The focus is on what has been arranged, rather than the speaker’s personal intention.'],
  relativeSubjectNo:['Nのある + N','Inside a clause describing a noun, の can sometimes replace the subject marker が. 意義のある話 is equivalent to 意義がある話: a talk that has significance. This の does not mean that the following verb belongs to someone.'],
  preparedState:['transitive Vてあります','A transitive verb’s て-form plus あります describes a state left by a deliberate action, often a preparation. 置いてあります means someone has placed the item there. It differs from an action in progress with ています.'],
  plainPast:['plain past verb + N / clause','The plain past form can describe a completed action before a noun or inside a clause. It differs from polite ました. Learn the change with the verb, such as 買う → 買った.'],
  nominalize:['clause + の','の can turn a plain clause into a noun-like expression, so it can take particles such as が or を.'],
  adjectiveTe:['い-adjective → くて','Replace the final い with くて to connect an い-adjective to another description or give a related reason. いい uses よくて.'],
  try:['Vてみます','The て-form plus みます means try doing something to see what it is like.'],
  regretted:['Vてしまいました','The て-form plus しまいました can express completion, often with regret or an unintended result.'],
  approaching:['Vてきました','The て-form plus きました can describe a change developing up to now. With movement it can also mean doing something and coming back; context decides.'],
  prepare:['Vておきます','The て-form plus おきます means do something in advance or leave it ready for a later purpose.'],
  benefactive:['Vてくれます / Vてもらいます','The て-form plus くれます describes someone doing something for you or your group. With もらいます, the subject receives someone’s help. Keep track of who acts and who benefits.'],
  potential:['potential form','A potential verb expresses being able to do something. Its form depends on the verb group; learn the exact form shown with the dictionary verb. With many potential verbs, the thing one can do may take が or を.'],
  passive:['passive form','A passive verb describes the subject receiving an action. The form depends on the verb group; する becomes される. The actor can be left out when it is unknown or unimportant.'],
  change:['adjective + なります','Use く before なります with an い-adjective, and に with a な-adjective or noun, to describe becoming something or a change in state.'],
  condition:['Vたら / Nだったら','A たら clause gives a condition or a point after which something happens. Form it from the plain past plus ら; after a noun use だったら.'],
  necessity:['Vなくてもいい','The plain negative stem followed by なくてもいい says that doing the action is not necessary. It does not mean that the action is forbidden.'],
  obligation:['Vなければなりません','Replace ない in a plain negative with なければなりません to say must or need to do something. する becomes しなければなりません. The complete expression states a positive obligation, despite its negative ending.'],
};
const functionGrammar={は:'topic',が:'subject',を:'object',に:'ni',で:'de',の:'nounLink',と:'to',も:'also',か:'question',ね:'agreement',よ:'information',から:'origin',まで:'until',です:'copula',でした:'copulaPast',な:'naAttribute',だ:'quote',ではありません:'copulaNegative',ではありませんでした:'copulaPastNegative',ませんか:'invitation',ましょう:'suggestion',たいです:'desire',てもいいですか:'permission',もいいですか:'permission',ないでください:'negativeRequest'};
const additional={
  '中':['duringActivity','Activity noun + 中（ちゅう）','Attach 中（ちゅう） directly to an activity or state noun to describe it as in progress. This suffix differs from the location noun 中（なか） after の.'],
  'でも':['nounConcession','Nでも、clause','After a noun, でも can mean even if it is or even though it is. 中古でも綺麗です means it is in good condition even though it is secondhand.'],
  'ほうがいいです':['recommendation','Vたほうがいいです','Use the plain past form followed by ほうがいいです to recommend an action. It describes what would be better to do, not an action that has already happened.'],
  'ために':['purpose','Nのために / Vるために','ために expresses purpose or benefit. A noun takes の before it; a verb uses its dictionary form.'],
  'ながら':['simultaneous','V-stem + ながら','Attach ながら to the stem before ます to describe two actions by the same person happening at the same time. The main action comes last.'],
  'について':['about','Nについて','について introduces the subject being discussed or studied: about something.'],
  'とも':['both','quantity or group + とも','とも includes the whole stated group: 二人とも means both people, and 両方とも means both alternatives.'],
  'より':['comparison','AはBより…','より marks the baseline in a comparison. The item being described comes with は or が.'],
  'ほう':['comparisonSide','Aのほうが…','ほう identifies one alternative in a comparison. A noun takes の before ほう.'],
  'そうです':['appearance','adjective stem + そうです','After an adjective stem, そうです means looks or seems. Drop the final い of an い-adjective; a な-adjective does not take な here. This is different from hearsay そうです after a whole plain clause.'],
  'そう':['so','そうです','そう can refer back to what someone has said: “That is so.”'],
  'くらい':['approximation','amount + くらい','くらい after an amount makes it approximate: about that much.'],
  'ように':['goal','Vる / Vない + ように','ように can express a goal or desired result. Use a plain form before it, often a potential or negative verb.'],
  'だったら':['condition',null,null],
  'として':['role','Nとして','として marks the role or capacity in which someone acts: as something.'],
  'かどうか':['whether','plain clause + かどうか','かどうか embeds a yes/no question: whether or not. It can be followed by a verb such as check or ask.'],
  'ので':['explanation','clause + ので','ので introduces an explanatory reason. A plain noun or な-adjective takes な before ので; a verb or い-adjective keeps its plain form.'],
  'だけ':['only','Nだけ','だけ limits the scope: only this person, thing, or amount.'],
  'にあたって':['occasion','Nにあたって','にあたって introduces the occasion of undertaking an important action, often in formal contexts.'],
  'よう':['advice','Vる + よう + advice verb','よう can introduce what someone is advised or asked to do. The action before it uses a dictionary or plain negative form.'],
  'ため':['causePurpose','Nのため','ため after a noun plus の can give a cause or a purpose. Use the context to distinguish “because of” from “for”.'],
  'までに':['deadline','time + までに','までに sets a deadline: complete the action no later than that time. まで alone means continuing until that time.'],
  'ことになりました':['arrangement','Vることになりました','A dictionary-form verb followed by ことになりました describes an arrangement or decision that has been made.'],
  'こと':['nominalThing','plain clause + こと','こと turns an action or a fact into a noun-like expression. The resulting expression can take a particle such as が or を.'],
  'たびに':['eachTime','Vるたびに / Nのたびに','たびに means each time something happens. A verb uses its dictionary form; a noun takes の.'],
  'につれて':['parallelChange','Vるにつれて','につれて connects developing changes: as one thing changes, another changes with it.'],
  'だけでなく':['notOnly','AだけでなくBも','だけでなく adds another item: not only A but also B. The second item normally takes も.'],
  'に応じて':['accordingTo','Nに応じて','に応じて means according to or in response to a particular level, need, or situation.'],
  'によって':['depending','Nによって','によって can describe variation depending on a person or situation. In other contexts it can mark a means or an agent; follow the relation in the sentence.'],
  'ことがあります':['sometimes','Vることがあります','After a dictionary-form verb, ことがあります means something sometimes happens. After a past form, it instead describes experience.'],
  'という':['namedTerm','NというN','という links a name or quoted word to a following noun that identifies its category: a thing called N, or the word N. This use does not report someone speaking.'],
  'とは':['definition','Nとは…','とは introduces a term that will be defined or explained.'],
  'うちに':['whileStill','state + うちに','うちに means while a condition still holds, often before it changes. A noun takes の; a な-adjective takes な; verbs and い-adjectives use plain forms.'],
  'による':['byMeans','NによるN','による links a means, source, or cause to a following noun.'],
  'によると':['informationSource','Nによると、report','によると identifies where information comes from, such as a forecast or news report. It often introduces a report ending in そうです.'],
};
for(const [surface,[id,pattern,explanation]] of Object.entries(additional)){functionGrammar[surface]=id;if(pattern)grammarRules[id]=[pattern,explanation];}
const potentialForms={飲む:['飲めません'],使う:['使えます','使えません','使える'],話す:['話せません'],行く:['行けます'],食べる:['食べられません','食べられます'],覚える:['覚えられません'],帰る:['帰れました'],決める:['決められません'],勝つ:['勝てる'],通る:['通れません']};
const passiveForms={盗む:['盗まれました'],含む:['含まれていません','含まれています','含まれます'],使う:['使われています'],聞く:['聞かれました'],言う:['言われました'],作る:['作られます','作られています'],追い越す:['追い越されました'],読む:['読まれています'],呼ぶ:['呼ばれる']};
const ignored=new Set(['。','、','／','時','月','日']);
function isPlainPredicate(token){
  if(!token)return false;
  if(['だ','だった'].includes(token.surface))return true;
  const word=index.get(token.dictionaryEntryId??token.wordId),pos=word?.pos??'',s=token.surface;
  if(/(^|\|)adj-i(?:\||$)/.test(pos))return /い$|かった$/.test(s);
  if(!/(^|\|)v[1-5sknr]/.test(pos)||/ます$|ました$|ません$|ませんでした$/.test(s))return false;
  // Verbal nouns alone are not a full plain predicate: 接続 needs する/だ.
  // Reviewed passive, potential and causative forms may have a different plain
  // ending from the lemma (開く -> 開かれる). A verb stem before そう lacks る.
  return (s===word.surface&&!/(^|\|)n(?:\||$)/.test(pos))||/る$|ない$|なかった$|た$|んだ$/.test(s);
}
export function requiredGrammar(card){
  const required=new Set(),unknown=[];
  const tokens=card.tokens;
  for(let i=0;i<tokens.length;i++){
    const t=tokens[i],s=t.surface,next=tokens[i+1],prev=tokens[i-1],word=index.get(t.dictionaryEntryId??t.wordId);
    const pos=word?.pos??'',verb=/(^|\|)v(?:[1-5]|s|k|n|r)/.test(pos),adj=/(^|\|)adj-i(?:\||$)/.test(pos);
    // Excess is an auxiliary construction, not a permission granted by an
    // approved lexical inflection. Passing by (過ぎる/通り過ぎる) is different.
    if(word && s!==word.surface && (verb||/(^|\|)adj-(?:i|na)(?:\||$)/.test(pos)) &&
       !/(?:すぎ|過ぎ)/.test(word.surface) && /(?:すぎ|過ぎ)(?:る|ます|ました|て|た|ない|ません|ませんでした)$/.test(s))required.add('excess');
    if(adj && word.surface.endsWith('い') && s===word.surface.slice(0,-1)+'さ')required.add('adjectiveQuantity');
    if(word?.surface==='ため')required.add(next?.surface==='に'?'purpose':'causePurpose');
    if(!t.wordId&&!t.dictionaryEntryId){
      if(s==='ください')required.add(prev&&/[てで]$/.test(prev.surface)?(/ないで$/.test(prev.surface)?'negativeRequest':'request'):'itemRequest');
      else if(functionGrammar[s]){
        let id=functionGrammar[s];
        if((s==='そうです'||(s==='そう'&&next?.surface==='です'))&&isPlainPredicate(prev))id='hearsay';
        if(s==='に'&&['一緒','別々','本当'].includes(prev?.surface))id='adverbNi';
        if(s==='でも'&&!prev)id='contrast';
        if(s==='から'&&prev&&/[てで]$/.test(prev.surface))id='teAfter';
        if(s==='から'&&prev&&(prev.surface==='です'||/ます$|ません$/.test(prev.surface)))id='reason';
        if(s==='と'&&prev&&/(^|\|)v[1-5sknr]/.test(index.get(prev.dictionaryEntryId??prev.wordId)?.pos??'')&&/[るうくぐすつぬぶむた]$/.test(prev.surface)&&!(prev.surface===index.get(prev.dictionaryEntryId??prev.wordId)?.surface&&/(^|\|)n(?:\||$)/.test(index.get(prev.dictionaryEntryId??prev.wordId)?.pos??'')))id='conditionalTo';
        // A quotation may include its subject or destination before the reporting verb.
        if(s==='と'){
          const predicate=tokens.slice(i+1).find(token=>/(^|\|)v[1-5sknr]/.test(index.get(token.dictionaryEntryId??token.wordId)?.pos??''));
          const reporting=index.get(predicate?.dictionaryEntryId??predicate?.wordId)?.surface;
          if(['言う','おっしゃる','申す','申し上げる','予測'].includes(reporting)||(['書く','答える'].includes(reporting)&&/(?:ます|ません|ました|です|でした|」)$/.test(prev?.surface??'')))id='reportedSpeech';
          // Content can also be felt, reflected on or held with conviction. An intervening object
          // keeps the conditional reading: 窓を開けると風を感じます.
          if(isPlainPredicate(prev)&&['感じる','反省','確信'].includes(reporting)&&
             !tokens.slice(i+1,tokens.indexOf(predicate)).some(token=>token.surface==='を'))id='quote';
        }
        if(s==='と'&&tokens.slice(i+1).some(token=>/思/.test(token.surface)))id='quote';
        if(s==='の'&&prev&&/(^|\|)v[1-5knr]/.test(index.get(prev.wordId)?.pos??'')&&/[るうくぐすつぬぶむた]$/.test(prev.surface))id='nominalize';
        if(s==='が'&&prev&&/^(?:です|でした)$|ます$|ました$|ません$/.test(prev.surface))id='contrast';
        if(s==='も'&&prev&&/[てで]$/.test(prev.surface)&&/(^|\|)v[1-5sknr]/.test(index.get(prev.dictionaryEntryId??prev.wordId)?.pos??''))id='concession';
        if(s==='の'&&next?.surface==='です'&&prev&&/(^|\|)(?:v[1-5sknr]|adj-i)/.test(index.get(prev.dictionaryEntryId??prev.wordId)?.pos??''))id='explanatoryNo';
        if(s==='の'&&next&&tokens[i+2]?.wordId&&
          (next.surface==='ある'||(/(^|\|)v[1-5knr]/.test(index.get(next.dictionaryEntryId??next.wordId)?.pos??'')&&/[るうくぐすつぬぶむた]$/.test(next.surface))))id='relativeSubjectNo';
        if(s==='の'&&next?.surface==='に'&&tokens.slice(i+2).some(t=>t.wordId==='jmdict:1207590'))required.add('resourceFor');
        required.add(id);
      }else if(!ignored.has(s))unknown.push(s);
    }
    const previousPos=index.get(prev?.dictionaryEntryId??prev?.wordId)?.pos??'';
    if(word?.surface==='できる' && /(^|\|)vs(?:-i)?(?:\||$)/.test(previousPos))required.add('potential');
    // Knowing the main verb must not silently unlock its auxiliary senses.
    // Check split tokens and fused reviewed forms independently of POS labels.
    const homeGreeting=(t.dictionaryEntryId??t.wordId)==='jmdict:1000920' &&
      s==='いらっしゃい' && i===0 && (!next || next.surface==='、' || next.surface==='。');
    const respectfulVerb=!homeGreeting && /^(?:いらっしゃ|居らっしゃ|おいでにな)/.test(s);
    const splitAuxiliary=respectfulVerb && (prev?.surface==='で' ||
      (/(^|\|)v[1-5sknr]/.test(previousPos) && /[てで]$/.test(prev?.surface??'')));
    const fusedAuxiliary=/[てで](?:いらっしゃ|居らっしゃ|おいでにな)/.test(s);
    if(splitAuxiliary||fusedAuxiliary)required.add('respectfulAuxiliary');
    else if(respectfulVerb)required.add('respectfulPresence');
    if(s==='まで'&&/(^|\|)v[1-5sknr]/.test(previousPos)&&/[るうくぐすつぬぶむ]$/.test(prev.surface))required.add('untilClause');
    if(s==='途端'&&/(^|\|)v[1-5sknr]/.test(previousPos)&&/[ただ]$/.test(prev.surface))required.add('suddenSequence');
    if(s==='直後'&&(prev?.surface==='の'||/(^|\|)v[1-5sknr]/.test(previousPos)))required.add('immediateAfter');
    // A lexical なか token must not hide an activity suffix from the audit.
    if(s==='中'&&(prev?.wordId||prev?.dictionaryEntryId)&&!pointsInside(prev)&&!endsTeClause(prev))required.add('duringActivity');
    if(s==='こと'&&/(^|\|)(?:v[1-5sknr]|adj-i)/.test(previousPos))required.add('nominalThing');
    if(word&&['つもり','はず','まま'].includes(s))required.add({つもり:'intention',はず:'expectation',まま:'unchanged'}[s]);
    if(adj){
      if(s.endsWith('かった'))required.add('adjectivePast');
      else if(s.endsWith('くない'))required.add('adjectiveNegative');
      else if(s.endsWith('くて'))required.add('adjectiveTe');
      else if(s.endsWith('く'))required.add('adjectiveAdverb');
      else if(next?.surface==='です')required.add('adjective');
      else if(next?.wordId&&/(^|\|)n(?:\||$)/.test(index.get(next.wordId)?.pos??''))required.add('iAttribute');
    }
    if(potentialForms[word?.surface]?.includes(s))required.add('potential');
    if(/(^|\|)vs(?:-i)?(?:\||$)/.test(pos) && word?.surface &&
       s.startsWith(word.surface) && /^でき(?:る|ます|ません|ました|ない)/.test(s.slice(word.surface.length)))required.add('potential');
    if(passiveForms[word?.surface]?.includes(s)||(/(^|\|)vs(?:-i)?(?:\||$)/.test(pos)&&/され/.test(s)))required.add('passive');
    if(word?.surface==='なる'&&prev&&(prev.surface==='に'||prev.surface.endsWith('く')))required.add('change');
    if(verb&&s!==word?.surface){
      if(/ない$/.test(s)&&!/たくない$/.test(s))required.add('plainNegative');
      if(/なかった$/.test(s))required.add('plainPastNegative');
      if(/[てで]いる$/.test(s))required.add('plainProgressive');
      if(/[てで](?:ある|あり(?:ます|ました))$/.test(s))required.add('preparedState');
      if(/ずに$/.test(s)||(/ず$/.test(s)&&next?.surface==='に'))required.add('withoutDoing');
      if(/そう(?:です)?$/.test(s))required.add('verbAppearance');
      if(/た$/.test(s)&&!/ました$|ませんでした$/.test(s))required.add('plainPast');
      if(/ます$/.test(s))required.add('polite');
      if(/ません$/.test(s))required.add('politeNegative');
      if(/ました$|ませんでした$/.test(s))required.add('past');
      if(/てい|でい/.test(s))required.add('progressive');
      if(/たい$|たくない$/.test(s))required.add('desire');
      if(/たかった$|たくなかった$/.test(s)){required.add('desire');required.add('pastDesire');}
      if(/たく$/.test(s)&&index.get(next?.wordId)?.surface==='なる'){required.add('desire');required.add('changingDesire');}
      if(/(?:やすい|にくい|やすく|にくく|やすかった|にくかった)$/.test(s))required.add('ease');
      if(/ましょう$/.test(s))required.add('suggestion');
      if(/ながら$/.test(s))required.add('simultaneous');
      if(/ませんか$/.test(s)||(/ません$/.test(s)&&next?.surface==='か'))required.add('invitation');
      if(/ないでください$/.test(s))required.add('negativeRequest');
      else if(/[てで]くださ(?:る|いま|ら)/.test(s))required.add('benefactiveRespect');
      else if(/[てで]ください$/.test(s))required.add('request');
      if(/[てで]み/.test(s))required.add('try');
      if(/[てで]しま/.test(s))required.add('regretted');
      if(/.+[てで]きま/.test(s))required.add('approaching');
      if(/[てで]おき/.test(s))required.add('prepare');
      if(/[てで](くれ|もら)/.test(s))required.add('benefactive');
      if(/てもいい/.test(s))required.add('permission');
      if(/なくてもいい/.test(s))required.add('necessity');
      if(/なければなりません$/.test(s))required.add('obligation');
      if(/[たっ]ら$/.test(s))required.add('condition');
      if(/[てで]$/.test(s)&&next&&next.surface!=='ください'){
        if(/^くださ/.test(next.surface))required.add('benefactiveRespect');
        else if(/くれ|もら/.test(next.surface))required.add('benefactive');
        else if(!['もいいですか','から','も'].includes(next.surface))required.add('teSequence');
      }
      if(/[たるうくぐすつぬぶむ]$/.test(s)&&next?.wordId)required.add('plainClause');
    }else if(verb&&!/(^|\|)(?:n|adv)(?:\||$)/.test(pos)&&next?.wordId)required.add('plainClause');
    if(/(^|\|)vs(?:\||$)/.test(pos)&&s!==word?.surface&&/し/.test(s))required.add('suru');
  }
  if(card.line.join('').includes('ことができます')||card.line.join('').includes('ことができません'))required.add('ability');
  else if(/ができ(?:ます|ません)/.test(card.line.join('')))required.add('nounAbility');
  if(card.line.join('').includes('ことになっています'))required.add('standingArrangement');
  if(/くありません/.test(card.line.join('')))required.add('adjectiveFormalNegative');
  return {required:[...required],unknown};
}
