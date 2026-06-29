import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const unitDir = path.join(root, "data/jp/curriculum/units");
const manifestDir = path.join(root, "data/jp/media/manifests");

function pad(value) {
  return String(value).padStart(3, "0");
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function escapeXml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function bareMeaning(value) {
  return value.split(";")[0];
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const specs = [
  {
    id: 22,
    slug: "polite-verb-negatives",
    title: "Unit 22: Polite Verb Negatives",
    grammarFocus: "Vません",
    words: [
      ["hanasu", "話す", "はなす", "speak", "verb"],
      ["kau", "買う", "かう", "buy", "verb"],
      ["au", "会う", "あう", "meet", "verb"],
      ["matsu", "待つ", "まつ", "wait", "verb"],
      ["tsukau", "使う", "つかう", "use", "verb"],
      ["tsukuru", "作る", "つくる", "make", "verb"],
      ["neru", "寝る", "ねる", "sleep", "verb"],
      ["okiru", "起きる", "おきる", "wake up", "verb"],
      ["hataraku", "働く", "はたらく", "work", "verb"],
      ["yasumu_verb", "休む", "やすむ", "rest; take a day off", "verb"],
    ],
  },
  {
    id: 23,
    slug: "polite-verbs-past",
    title: "Unit 23: Polite Verbs, Past",
    grammarFocus: "Vました / Vませんでした",
    words: [
      ["aruku", "歩く", "あるく", "walk", "verb"],
      ["hashiru", "走る", "はしる", "run", "verb"],
      ["oyogu", "泳ぐ", "およぐ", "swim", "verb"],
      ["asobu", "遊ぶ", "あそぶ", "play", "verb"],
      ["hairu", "入る", "はいる", "enter", "verb"],
      ["deru", "出る", "でる", "leave; exit", "verb"],
      ["akeru", "開ける", "あける", "open", "verb"],
      ["shimeru", "閉める", "しめる", "close", "verb"],
      ["arau", "洗う", "あらう", "wash", "verb"],
      ["tatsu", "立つ", "たつ", "stand", "verb"],
    ],
  },
  {
    id: 24,
    slug: "direct-objects",
    title: "Unit 24: Direct Objects",
    grammarFocus: "NをVます",
    words: [
      ["gohan", "ご飯", "ごはん", "meal; rice", "noun"],
      ["pan", "パン", "ぱん", "bread", "noun"],
      ["niku", "肉", "にく", "meat", "noun"],
      ["yasai", "野菜", "やさい", "vegetables", "noun"],
      ["kudamono", "果物", "くだもの", "fruit", "noun"],
      ["tegami", "手紙", "てがみ", "letter", "noun"],
      ["shinbun", "新聞", "しんぶん", "newspaper", "noun"],
      ["ongaku", "音楽", "おんがく", "music", "noun"],
      ["eiga", "映画", "えいが", "movie", "noun"],
      ["koohii", "コーヒー", "こーひー", "coffee", "noun"],
    ],
  },
  {
    id: 25,
    slug: "going-to-places",
    title: "Unit 25: Going To Places",
    grammarFocus: "場所に行きます / 場所へ行きます",
    words: [
      ["jitaku", "自宅", "じたく", "home", "place"],
      ["jimusho", "事務所", "じむしょ", "office", "place"],
      ["daigaku", "大学", "だいがく", "university", "place"],
      ["hakubutsukan", "博物館", "はくぶつかん", "museum", "place"],
      ["honya", "本屋", "ほんや", "bookstore", "place"],
      ["konbini", "コンビニ", "こんびに", "convenience store", "place"],
      ["jinja", "神社", "じんじゃ", "shrine", "place"],
      ["tera", "寺", "てら", "temple", "place"],
      ["koujou", "工場", "こうじょう", "factory", "place"],
      ["taishikan", "大使館", "たいしかん", "embassy", "place"],
    ],
  },
  {
    id: 26,
    slug: "action-location",
    title: "Unit 26: Action Location",
    grammarFocus: "場所でVます",
    words: [
      ["taiikukan", "体育館", "たいいくかん", "gym", "place"],
      ["puuru", "プール", "ぷーる", "pool", "place"],
      ["kaigishitsu", "会議室", "かいぎしつ", "meeting room", "place"],
      ["hiroba", "広場", "ひろば", "plaza", "place"],
      ["sentou", "銭湯", "せんとう", "public bath", "place"],
      ["ryokan", "旅館", "りょかん", "inn", "place"],
      ["kaigan", "海岸", "かいがん", "beach", "place"],
      ["mori", "森", "もり", "forest", "place"],
      ["kissaten", "喫茶店", "きっさてん", "coffee shop", "place"],
      ["depaato", "デパート", "でぱーと", "department store", "place"],
    ],
  },
  {
    id: 27,
    slug: "time-point",
    title: "Unit 27: Time Point",
    grammarFocus: "時間にVます",
    words: [
      ["getsuyoubi", "月曜日", "げつようび", "Monday", "time"],
      ["kayoubi", "火曜日", "かようび", "Tuesday", "time"],
      ["suiyoubi", "水曜日", "すいようび", "Wednesday", "time"],
      ["mokuyoubi", "木曜日", "もくようび", "Thursday", "time"],
      ["kinyoubi", "金曜日", "きんようび", "Friday", "time"],
      ["doyoubi", "土曜日", "どようび", "Saturday", "time"],
      ["nichiyoubi", "日曜日", "にちようび", "Sunday", "time"],
      ["hiru", "昼", "ひる", "noon; daytime", "time"],
      ["gogo", "午後", "ごご", "afternoon; p.m.", "time"],
      ["gozen", "午前", "ごぜん", "morning; a.m.", "time"],
    ],
  },
  {
    id: 28,
    slug: "from-and-until",
    title: "Unit 28: From And Until",
    grammarFocus: "AからBまで",
    words: [
      ["ichiji", "一時", "いちじ", "one o'clock", "time"],
      ["niji", "二時", "にじ", "two o'clock", "time"],
      ["sanji", "三時", "さんじ", "three o'clock", "time"],
      ["yoji", "四時", "よじ", "four o'clock", "time"],
      ["goji", "五時", "ごじ", "five o'clock", "time"],
      ["rokuji", "六時", "ろくじ", "six o'clock", "time"],
      ["shichiji", "七時", "しちじ", "seven o'clock", "time"],
      ["hachiji", "八時", "はちじ", "eight o'clock", "time"],
      ["kuji", "九時", "くじ", "nine o'clock", "time"],
      ["juuji", "十時", "じゅうじ", "ten o'clock", "time"],
    ],
  },
  {
    id: 29,
    slug: "with-someone",
    title: "Unit 29: With Someone",
    grammarFocus: "人とVます",
    words: [
      ["senpai", "先輩", "せんぱい", "senior; mentor", "person"],
      ["kouhai", "後輩", "こうはい", "junior colleague", "person"],
      ["douryou", "同僚", "どうりょう", "coworker", "person"],
      ["joushi", "上司", "じょうし", "boss", "person"],
      ["ryoushin", "両親", "りょうしん", "parents", "person"],
      ["musuko", "息子", "むすこ", "son", "person"],
      ["musume", "娘", "むすめ", "daughter", "person"],
      ["koibito", "恋人", "こいびと", "partner; sweetheart", "person"],
      ["okusan", "奥さん", "おくさん", "wife", "person"],
      ["goshujin", "ご主人", "ごしゅじん", "husband", "person"],
    ],
  },
  {
    id: 30,
    slug: "frequency",
    title: "Unit 30: Frequency",
    grammarFocus: "毎日 / よく / 時々 / あまり...ません",
    words: [
      ["mainichi", "毎日", "まいにち", "every day", "adverb"],
      ["maiasa", "毎朝", "まいあさ", "every morning", "adverb"],
      ["maiban", "毎晩", "まいばん", "every night", "adverb"],
      ["yoku_adv", "よく", "よく", "often", "adverb"],
      ["tokidoki", "時々", "ときどき", "sometimes", "adverb"],
      ["itsumo", "いつも", "いつも", "always", "adverb"],
      ["taitei", "たいてい", "たいてい", "usually", "adverb"],
      ["tamani", "たまに", "たまに", "occasionally", "adverb"],
      ["hotondo", "ほとんど", "ほとんど", "almost never", "adverb"],
      ["mettani", "めったに", "めったに", "rarely", "adverb"],
    ],
  },
  {
    id: 31,
    slug: "likes-and-dislikes",
    title: "Unit 31: Likes And Dislikes",
    grammarFocus: "Nが好きです / Nが嫌いです",
    words: [
      ["sushi", "寿司", "すし", "sushi", "noun"],
      ["raamen", "ラーメン", "らーめん", "ramen", "noun"],
      ["manga", "漫画", "まんが", "manga", "noun"],
      ["anime", "アニメ", "あにめ", "anime", "noun"],
      ["supootsu", "スポーツ", "すぽーつ", "sports", "noun"],
      ["sakkaa", "サッカー", "さっかー", "soccer", "noun"],
      ["okashi", "お菓子", "おかし", "sweets; snacks", "noun"],
      ["ryouri", "料理", "りょうり", "cooking; cuisine", "noun"],
      ["nihongo", "日本語", "にほんご", "Japanese language", "noun"],
      ["shumi", "趣味", "しゅみ", "hobby", "noun"],
    ],
  },
  {
    id: 32,
    slug: "skill-as-description",
    title: "Unit 32: Skill As Description",
    grammarFocus: "Nが上手です / Nが下手です",
    words: [
      ["piano", "ピアノ", "ぴあの", "piano", "noun"],
      ["gitaa", "ギター", "ぎたー", "guitar", "noun"],
      ["uta", "歌", "うた", "singing; song", "noun"],
      ["dansu", "ダンス", "だんす", "dance", "noun"],
      ["e_drawing", "絵", "え", "drawing; picture", "noun"],
      ["unten", "運転", "うんてん", "driving", "noun"],
      ["souji", "掃除", "そうじ", "cleaning", "noun"],
      ["keisan", "計算", "けいさん", "calculation", "noun"],
      ["eigo", "英語", "えいご", "English language", "noun"],
      ["kanji", "漢字", "かんじ", "kanji", "noun"],
    ],
  },
  {
    id: 33,
    slug: "wanting-things",
    title: "Unit 33: Wanting Things",
    grammarFocus: "Nが欲しいです",
    words: [
      ["okane", "お金", "おかね", "money", "noun"],
      ["jikan", "時間", "じかん", "time", "noun"],
      ["kasa", "傘", "かさ", "umbrella", "noun"],
      ["fuku", "服", "ふく", "clothes", "noun"],
      ["kutsu", "靴", "くつ", "shoes", "noun"],
      ["keitai", "携帯", "けいたい", "mobile phone", "noun"],
      ["pasokon", "パソコン", "ぱそこん", "computer", "noun"],
      ["kusuri", "薬", "くすり", "medicine", "noun"],
      ["purezento", "プレゼント", "ぷれぜんと", "present; gift", "noun"],
      ["jouhou", "情報", "じょうほう", "information", "noun"],
    ],
  },
  {
    id: 34,
    slug: "wanting-to-do",
    title: "Unit 34: Wanting To Do",
    grammarFocus: "Vたいです / Vたくないです",
    words: [
      ["noru", "乗る", "のる", "ride; get on", "verb"],
      ["toru", "取る", "とる", "take", "verb"],
      ["shaberu", "しゃべる", "しゃべる", "chat", "verb"],
      ["suwaru", "座る", "すわる", "sit", "verb"],
      ["shiru", "知る", "しる", "know", "verb"],
      ["narau", "習う", "ならう", "learn", "verb"],
      ["erabu", "選ぶ", "えらぶ", "choose", "verb"],
      ["tasukeru", "助ける", "たすける", "help; save", "verb"],
      ["hakobu", "運ぶ", "はこぶ", "carry", "verb"],
      ["sagasu", "探す", "さがす", "search for", "verb"],
    ],
  },
  {
    id: 35,
    slug: "suggestions",
    title: "Unit 35: Suggestions",
    grammarFocus: "Vましょう / Vましょうか",
    words: [
      ["hajimeru", "始める", "はじめる", "begin", "verb"],
      ["owaru", "終わる", "おわる", "finish", "verb"],
      ["kaimono_suru", "買い物する", "かいものする", "shop", "verb"],
      ["sanpo_suru", "散歩する", "さんぽする", "take a walk", "verb"],
      ["renshuu_suru", "練習する", "れんしゅうする", "practice", "verb"],
      ["junbi_suru", "準備する", "じゅんびする", "prepare", "verb"],
      ["denwa_suru", "電話する", "でんわする", "call by phone", "verb"],
      ["yoyaku_suru", "予約する", "よやくする", "reserve", "verb"],
      ["annai_suru", "案内する", "あんないする", "guide; show around", "verb"],
      ["setsumei_suru", "説明する", "せつめいする", "explain", "verb"],
    ],
  },
  {
    id: 36,
    slug: "please-do",
    title: "Unit 36: Please Do",
    grammarFocus: "Vてください",
    words: [
      ["miseru", "見せる", "みせる", "show", "verb"],
      ["oshieru", "教える", "おしえる", "teach; tell", "verb"],
      ["kasu", "貸す", "かす", "lend", "verb"],
      ["tetsudau", "手伝う", "てつだう", "help", "verb"],
      ["yobu", "呼ぶ", "よぶ", "call", "verb"],
      ["hakaru", "測る", "はかる", "measure", "verb"],
      ["oku", "置く", "おく", "put; place", "verb"],
      ["dasu", "出す", "だす", "take out; submit", "verb"],
      ["ireru", "入れる", "いれる", "put in", "verb"],
      ["motsu", "持つ", "もつ", "hold; carry", "verb"],
    ],
  },
  {
    id: 37,
    slug: "please-do-not",
    title: "Unit 37: Please Do Not",
    grammarFocus: "Vないでください",
    words: [
      ["sawaru", "触る", "さわる", "touch", "verb"],
      ["wasureu", "忘れる", "わすれる", "forget", "verb"],
      ["nakusu", "なくす", "なくす", "lose", "verb"],
      ["okureru", "遅れる", "おくれる", "be late", "verb"],
      ["kowasu", "壊す", "こわす", "break", "verb"],
      ["suteru", "捨てる", "すてる", "throw away", "verb"],
      ["tomeru", "止める", "とめる", "stop", "verb"],
      ["akirameru", "諦める", "あきらめる", "give up", "verb"],
      ["shinpai_suru", "心配する", "しんぱいする", "worry", "verb"],
      ["muri_suru", "無理する", "むりする", "overdo it", "verb"],
    ],
  },
  {
    id: 38,
    slug: "permission",
    title: "Unit 38: Permission",
    grammarFocus: "Vてもいいですか / Vてもいいです",
    words: [
      ["kariru", "借りる", "かりる", "borrow", "verb"],
      ["kaburu", "かぶる", "かぶる", "wear on the head", "verb"],
      ["haku", "履く", "はく", "wear on the feet", "verb"],
      ["kiru_wear", "着る", "きる", "wear clothes", "verb"],
      ["nugu", "脱ぐ", "ぬぐ", "take off clothes", "verb"],
      ["ireru_perm", "入れる", "いれる", "put in; let in", "verb"],
      ["tsukeru", "つける", "つける", "turn on; attach", "verb"],
      ["kesu", "消す", "けす", "turn off; erase", "verb"],
      ["shitsumon_suru", "質問する", "しつもんする", "ask a question", "verb"],
      ["ryokou_suru", "旅行する", "りょこうする", "travel", "verb"],
    ],
  },
  {
    id: 39,
    slug: "prohibition",
    title: "Unit 39: Prohibition",
    grammarFocus: "Vてはいけません",
    words: [
      ["nageru", "投げる", "なげる", "throw", "verb"],
      ["sawagu", "騒ぐ", "さわぐ", "make noise", "verb"],
      ["tobikomu", "飛び込む", "とびこむ", "jump in", "verb"],
      ["noboru", "登る", "のぼる", "climb", "verb"],
      ["oriru", "降りる", "おりる", "get off; descend", "verb"],
      ["watashu", "渡す", "わたす", "hand over", "verb"],
      ["akiramenaide", "諦めない", "あきらめない", "not giving up", "phrase"],
      ["ruuru", "ルール", "るーる", "rule", "noun"],
      ["kinshi", "禁止", "きんし", "prohibition", "noun"],
      ["anzen_ni", "安全に", "あんぜんに", "safely", "adverb"],
    ],
  },
  {
    id: 40,
    slug: "need-and-suggestions",
    title: "Unit 40: Need And Suggestions",
    grammarFocus: "Nが必要です / Nはどうですか",
    words: [
      ["shorui", "書類", "しょるい", "documents", "noun"],
      ["menkyo", "免許", "めんきょ", "license", "noun"],
      ["jisho", "辞書", "じしょ", "dictionary", "noun"],
      ["shukudai", "宿題", "しゅくだい", "homework", "noun"],
      ["mondai", "問題", "もんだい", "problem", "noun"],
      ["kotae", "答え", "こたえ", "answer", "noun"],
      ["shitsumon", "質問", "しつもん", "question", "noun"],
      ["yotei", "予定", "よてい", "plan; schedule", "noun"],
      ["juusho", "住所", "じゅうしょ", "address", "noun"],
      ["setsumei", "説明", "せつめい", "explanation", "noun"],
    ],
  },
  {
    id: 41,
    slug: "te-form-ichidan-irregular",
    title: "Unit 41: Te-Form Shape, Ichidan And Irregular",
    grammarFocus: "食べて / 見て / して / 来て",
    words: [
      ["ageru", "あげる", "あげる", "give", "verb"],
      ["kangaeru", "考える", "かんがえる", "think", "verb"],
      ["oboeru", "覚える", "おぼえる", "remember; memorize", "verb"],
      ["dekakeru", "出かける", "でかける", "go out", "verb"],
      ["tsukameru", "つかめる", "つかめる", "grasp", "verb"],
      ["shiraberu", "調べる", "しらべる", "look up; investigate", "verb"],
      ["katazukeru", "片付ける", "かたづける", "tidy up", "verb"],
      ["tsutaeru", "伝える", "つたえる", "tell; convey", "verb"],
      ["yameru", "やめる", "やめる", "quit; stop", "verb"],
      ["tsuzukeru", "続ける", "つづける", "continue", "verb"],
    ],
  },
  {
    id: 42,
    slug: "te-form-godan",
    title: "Unit 42: Te-Form Shape, Godan",
    grammarFocus: "飲んで / 行って / 書いて / 話して",
    words: [
      ["isogu", "急ぐ", "いそぐ", "hurry", "verb"],
      ["kaesu", "返す", "かえす", "return something", "verb"],
      ["magaru", "曲がる", "まがる", "turn", "verb"],
      ["wataru", "渡る", "わたる", "cross", "verb"],
      ["fumu", "踏む", "ふむ", "step on", "verb"],
      ["ugoku", "動く", "うごく", "move", "verb"],
      ["naosu", "直す", "なおす", "fix", "verb"],
      ["morau", "もらう", "もらう", "receive", "verb"],
      ["sumu_finish", "済む", "すむ", "be finished", "verb"],
      ["yoru_stop", "寄る", "よる", "stop by", "verb"],
    ],
  },
  {
    id: 43,
    slug: "connecting-actions",
    title: "Unit 43: Connecting Actions",
    grammarFocus: "Vて、Vます",
    words: [
      ["sorekara", "それから", "それから", "and then", "adverb"],
      ["saisho", "最初", "さいしょ", "first", "adverb"],
      ["tsugi", "次", "つぎ", "next", "adverb"],
      ["saigo", "最後", "さいご", "last", "adverb"],
      ["ato", "あと", "あと", "afterward", "adverb"],
      ["shokuji", "食事", "しょくじ", "meal", "noun"],
      ["kaimono", "買い物", "かいもの", "shopping", "noun"],
      ["sanpo", "散歩", "さんぽ", "walk; stroll", "noun"],
      ["renshuu", "練習", "れんしゅう", "practice", "noun"],
      ["junbi", "準備", "じゅんび", "preparation", "noun"],
    ],
  },
  {
    id: 44,
    slug: "ongoing-resulting-state",
    title: "Unit 44: Ongoing And Resulting State",
    grammarFocus: "Vています",
    words: [
      ["kaigi", "会議", "かいぎ", "meeting", "noun"],
      ["jugyou", "授業", "じゅぎょう", "class; lesson", "noun"],
      ["shiken", "試験", "しけん", "exam", "noun"],
      ["sentaku", "洗濯", "せんたく", "laundry", "noun"],
      ["undou", "運動", "うんどう", "exercise", "noun"],
      ["kenkyuu", "研究", "けんきゅう", "research", "noun"],
      ["sagyou", "作業", "さぎょう", "task; work", "noun"],
      ["renraku", "連絡", "れんらく", "contact; message", "noun"],
      ["houkoku", "報告", "ほうこく", "report", "noun"],
      ["seikatsu", "生活", "せいかつ", "daily life", "noun"],
    ],
  },
];

const verbForms = new Map([
  ["taberu", { masu: ["食べます", "たべます", "eat", "eats"], masen: ["食べません", "たべません", "do not eat", "does not eat"], mashita: ["食べました", "たべました", "ate"], masendeshita: ["食べませんでした", "たべませんでした", "did not eat"], te: ["食べて", "たべて", "eat and"], nai: ["食べない", "たべない", "not eat"], tai: ["食べたい", "たべたい", "want to eat"], takunai: ["食べたくない", "たべたくない", "do not want to eat"], teiru: ["食べています", "たべています", "is eating"] }],
  ["nomu", { masu: ["飲みます", "のみます", "drink", "drinks"], masen: ["飲みません", "のみません", "do not drink", "does not drink"], mashita: ["飲みました", "のみました", "drank"], masendeshita: ["飲みませんでした", "のみませんでした", "did not drink"], te: ["飲んで", "のんで", "drink and"], nai: ["飲まない", "のまない", "not drink"], tai: ["飲みたい", "のみたい", "want to drink"], takunai: ["飲みたくない", "のみたくない", "do not want to drink"], teiru: ["飲んでいます", "のんでいます", "is drinking"] }],
  ["iku", { masu: ["行きます", "いきます", "go", "goes"], masen: ["行きません", "いきません", "do not go", "does not go"], mashita: ["行きました", "いきました", "went"], masendeshita: ["行きませんでした", "いきませんでした", "did not go"], te: ["行って", "いって", "go and"], nai: ["行かない", "いかない", "not go"], tai: ["行きたい", "いきたい", "want to go"], takunai: ["行きたくない", "いきたくない", "do not want to go"], teiru: ["行っています", "いっています", "has gone"] }],
  ["kuru", { masu: ["来ます", "きます", "come", "comes"], masen: ["来ません", "きません", "do not come", "does not come"], mashita: ["来ました", "きました", "came"], masendeshita: ["来ませんでした", "きませんでした", "did not come"], te: ["来て", "きて", "come and"], nai: ["来ない", "こない", "not come"], tai: ["来たい", "きたい", "want to come"], takunai: ["来たくない", "きたくない", "do not want to come"], teiru: ["来ています", "きています", "is here"] }],
  ["miru", { masu: ["見ます", "みます", "watch", "watches"], masen: ["見ません", "みません", "do not watch", "does not watch"], mashita: ["見ました", "みました", "watched"], masendeshita: ["見ませんでした", "みませんでした", "did not watch"], te: ["見て", "みて", "watch and"], nai: ["見ない", "みない", "not watch"], tai: ["見たい", "みたい", "want to watch"], takunai: ["見たくない", "みたくない", "do not want to watch"], teiru: ["見ています", "みています", "is watching"] }],
  ["benkyou_suru", { masu: ["勉強します", "べんきょうします", "study", "studies"], masen: ["勉強しません", "べんきょうしません", "do not study", "does not study"], mashita: ["勉強しました", "べんきょうしました", "studied"], masendeshita: ["勉強しませんでした", "べんきょうしませんでした", "did not study"], te: ["勉強して", "べんきょうして", "study and"], nai: ["勉強しない", "べんきょうしない", "not study"], tai: ["勉強したい", "べんきょうしたい", "want to study"], takunai: ["勉強したくない", "べんきょうしたくない", "do not want to study"], teiru: ["勉強しています", "べんきょうしています", "is studying"] }],
]);

const extraVerbRows = [
  ["kaeru_verb", ["帰ります", "帰りません", "帰りました", "帰りませんでした", "帰って", "帰らない", "帰りたい", "帰りたくない", "帰っています"], ["かえります", "かえりません", "かえりました", "かえりませんでした", "かえって", "かえらない", "かえりたい", "かえりたくない", "かえっています"], ["return", "returns", "returned", "is returning"]],
  ["kiku", ["聞きます", "聞きません", "聞きました", "聞きませんでした", "聞いて", "聞かない", "聞きたい", "聞きたくない", "聞いています"], ["ききます", "ききません", "ききました", "ききませんでした", "きいて", "きかない", "ききたい", "ききたくない", "きいています"], ["listen", "listens", "listened", "is listening"]],
  ["yomu", ["読みます", "読みません", "読みました", "読みませんでした", "読んで", "読まない", "読みたい", "読みたくない", "読んでいます"], ["よみます", "よみません", "よみました", "よみませんでした", "よんで", "よまない", "よみたい", "よみたくない", "よんでいます"], ["read", "reads", "read", "is reading"]],
  ["kaku", ["書きます", "書きません", "書きました", "書きませんでした", "書いて", "書かない", "書きたい", "書きたくない", "書いています"], ["かきます", "かきません", "かきました", "かきませんでした", "かいて", "かかない", "かきたい", "かきたくない", "かいています"], ["write", "writes", "wrote", "is writing"]],
  ["hanasu", ["話します", "話しません", "話しました", "話しませんでした", "話して", "話さない", "話したい", "話したくない", "話しています"], ["はなします", "はなしません", "はなしました", "はなしませんでした", "はなして", "はなさない", "はなしたい", "はなしたくない", "はなしています"], ["speak", "speaks", "spoke", "is speaking"]],
  ["kau", ["買います", "買いません", "買いました", "買いませんでした", "買って", "買わない", "買いたい", "買いたくない", "買っています"], ["かいます", "かいません", "かいました", "かいませんでした", "かって", "かわない", "かいたい", "かいたくない", "かっています"], ["buy", "buys", "bought", "is buying"]],
  ["au", ["会います", "会いません", "会いました", "会いませんでした", "会って", "会わない", "会いたい", "会いたくない", "会っています"], ["あいます", "あいません", "あいました", "あいませんでした", "あって", "あわない", "あいたい", "あいたくない", "あっています"], ["meet", "meets", "met", "is meeting"]],
  ["matsu", ["待ちます", "待ちません", "待ちました", "待ちませんでした", "待って", "待たない", "待ちたい", "待ちたくない", "待っています"], ["まちます", "まちません", "まちました", "まちませんでした", "まって", "またない", "まちたい", "まちたくない", "まっています"], ["wait", "waits", "waited", "is waiting"]],
  ["tsukau", ["使います", "使いません", "使いました", "使いませんでした", "使って", "使わない", "使いたい", "使いたくない", "使っています"], ["つかいます", "つかいません", "つかいました", "つかいませんでした", "つかって", "つかわない", "つかいたい", "つかいたくない", "つかっています"], ["use", "uses", "used", "is using"]],
  ["tsukuru", ["作ります", "作りません", "作りました", "作りませんでした", "作って", "作らない", "作りたい", "作りたくない", "作っています"], ["つくります", "つくりません", "つくりました", "つくりませんでした", "つくって", "つくらない", "つくりたい", "つくりたくない", "つくっています"], ["make", "makes", "made", "is making"]],
  ["neru", ["寝ます", "寝ません", "寝ました", "寝ませんでした", "寝て", "寝ない", "寝たい", "寝たくない", "寝ています"], ["ねます", "ねません", "ねました", "ねませんでした", "ねて", "ねない", "ねたい", "ねたくない", "ねています"], ["sleep", "sleeps", "slept", "is sleeping"]],
  ["okiru", ["起きます", "起きません", "起きました", "起きませんでした", "起きて", "起きない", "起きたい", "起きたくない", "起きています"], ["おきます", "おきません", "おきました", "おきませんでした", "おきて", "おきない", "おきたい", "おきたくない", "おきています"], ["wake up", "wakes up", "woke up", "is awake"]],
  ["hataraku", ["働きます", "働きません", "働きました", "働きませんでした", "働いて", "働かない", "働きたい", "働きたくない", "働いています"], ["はたらきます", "はたらきません", "はたらきました", "はたらきませんでした", "はたらいて", "はたらかない", "はたらきたい", "はたらきたくない", "はたらいています"], ["work", "works", "worked", "is working"]],
  ["yasumu_verb", ["休みます", "休みません", "休みました", "休みませんでした", "休んで", "休まない", "休みたい", "休みたくない", "休んでいます"], ["やすみます", "やすみません", "やすみました", "やすみませんでした", "やすんで", "やすまない", "やすみたい", "やすみたくない", "やすんでいます"], ["rest", "rests", "rested", "is resting"]],
  ["aruku", ["歩きます", "歩きません", "歩きました", "歩きませんでした", "歩いて", "歩かない", "歩きたい", "歩きたくない", "歩いています"], ["あるきます", "あるきません", "あるきました", "あるきませんでした", "あるいて", "あるかない", "あるきたい", "あるきたくない", "あるいています"], ["walk", "walks", "walked", "is walking"]],
  ["hashiru", ["走ります", "走りません", "走りました", "走りませんでした", "走って", "走らない", "走りたい", "走りたくない", "走っています"], ["はしります", "はしりません", "はしりました", "はしりませんでした", "はしって", "はしらない", "はしりたい", "はしりたくない", "はしっています"], ["run", "runs", "ran", "is running"]],
  ["oyogu", ["泳ぎます", "泳ぎません", "泳ぎました", "泳ぎませんでした", "泳いで", "泳がない", "泳ぎたい", "泳ぎたくない", "泳いでいます"], ["およぎます", "およぎません", "およぎました", "およぎませんでした", "およいで", "およがない", "およぎたい", "およぎたくない", "およいでいます"], ["swim", "swims", "swam", "is swimming"]],
  ["asobu", ["遊びます", "遊びません", "遊びました", "遊びませんでした", "遊んで", "遊ばない", "遊びたい", "遊びたくない", "遊んでいます"], ["あそびます", "あそびません", "あそびました", "あそびませんでした", "あそんで", "あそばない", "あそびたい", "あそびたくない", "あそんでいます"], ["play", "plays", "played", "is playing"]],
  ["hairu", ["入ります", "入りません", "入りました", "入りませんでした", "入って", "入らない", "入りたい", "入りたくない", "入っています"], ["はいります", "はいりません", "はいりました", "はいりませんでした", "はいって", "はいらない", "はいりたい", "はいりたくない", "はいっています"], ["enter", "enters", "entered", "is inside"]],
  ["deru", ["出ます", "出ません", "出ました", "出ませんでした", "出て", "出ない", "出たい", "出たくない", "出ています"], ["でます", "でません", "でました", "でませんでした", "でて", "でない", "でたい", "でたくない", "でています"], ["leave", "leaves", "left", "is out"]],
  ["akeru", ["開けます", "開けません", "開けました", "開けませんでした", "開けて", "開けない", "開けたい", "開けたくない", "開けています"], ["あけます", "あけません", "あけました", "あけませんでした", "あけて", "あけない", "あけたい", "あけたくない", "あけています"], ["open", "opens", "opened", "is opening"]],
  ["shimeru", ["閉めます", "閉めません", "閉めました", "閉めませんでした", "閉めて", "閉めない", "閉めたい", "閉めたくない", "閉めています"], ["しめます", "しめません", "しめました", "しめませんでした", "しめて", "しめない", "しめたい", "しめたくない", "しめています"], ["close", "closes", "closed", "is closing"]],
  ["arau", ["洗います", "洗いません", "洗いました", "洗いませんでした", "洗って", "洗わない", "洗いたい", "洗いたくない", "洗っています"], ["あらいます", "あらいません", "あらいました", "あらいませんでした", "あらって", "あらわない", "あらいたい", "あらいたくない", "あらっています"], ["wash", "washes", "washed", "is washing"]],
  ["tatsu", ["立ちます", "立ちません", "立ちました", "立ちませんでした", "立って", "立たない", "立ちたい", "立ちたくない", "立っています"], ["たちます", "たちません", "たちました", "たちませんでした", "たって", "たたない", "たちたい", "たちたくない", "たっています"], ["stand", "stands", "stood", "is standing"]],
];

for (const [id, surfaces, readings, english] of extraVerbRows) {
  verbForms.set(id, {
    masu: [surfaces[0], readings[0], english[0], english[1]],
    masen: [surfaces[1], readings[1], `do not ${english[0]}`, `does not ${english[0]}`],
    mashita: [surfaces[2], readings[2], english[2]],
    masendeshita: [surfaces[3], readings[3], `did not ${english[0]}`],
    te: [surfaces[4], readings[4], `${english[0]} and`],
    nai: [surfaces[5], readings[5], `not ${english[0]}`],
    tai: [surfaces[6], readings[6], `want to ${english[0]}`],
    takunai: [surfaces[7], readings[7], `do not want to ${english[0]}`],
    teiru: [surfaces[8], readings[8], english[3]],
  });
}

function addSimpleVerbForms(id, stemSurface, stemReading, english, type = "ichidan") {
  const masuSurface = type === "suru" ? `${stemSurface}します` : type === "ichidan" ? `${stemSurface}ます` : `${stemSurface}ます`;
  const masuReading = type === "suru" ? `${stemReading}します` : `${stemReading}ます`;
  const teSurface = type === "suru" ? `${stemSurface}して` : type === "ichidan" ? `${stemSurface}て` : `${stemSurface}って`;
  const teReading = type === "suru" ? `${stemReading}して` : type === "ichidan" ? `${stemReading}て` : `${stemReading}って`;
  const naiSurface = type === "suru" ? `${stemSurface}しない` : type === "ichidan" ? `${stemSurface}ない` : `${stemSurface}らない`;
  const naiReading = type === "suru" ? `${stemReading}しない` : type === "ichidan" ? `${stemReading}ない` : `${stemReading}らない`;
  const taiSurface = type === "suru" ? `${stemSurface}したい` : `${stemSurface}たい`;
  const taiReading = type === "suru" ? `${stemReading}したい` : `${stemReading}たい`;
  verbForms.set(id, {
    masu: [masuSurface, masuReading, english, `${english}s`],
    masen: [masuSurface.replace("ます", "ません"), masuReading.replace("ます", "ません"), `do not ${english}`, `does not ${english}`],
    mashita: [masuSurface.replace("ます", "ました"), masuReading.replace("ます", "ました"), `${english}ed`],
    masendeshita: [masuSurface.replace("ます", "ませんでした"), masuReading.replace("ます", "ませんでした"), `did not ${english}`],
    te: [teSurface, teReading, `${english} and`],
    nai: [naiSurface, naiReading, `not ${english}`],
    tai: [taiSurface, taiReading, `want to ${english}`],
    takunai: [taiSurface.replace("たい", "たくない"), taiReading.replace("たい", "たくない"), `do not want to ${english}`],
    teiru: [teSurface.replace(/て$/, "ています"), teReading.replace(/て$/, "ています"), `is ${english}ing`],
  });
}

for (const row of [
  ["kaimono_suru", "買い物", "かいもの", "shop", "suru"],
  ["sanpo_suru", "散歩", "さんぽ", "walk", "suru"],
  ["renshuu_suru", "練習", "れんしゅう", "practice", "suru"],
  ["junbi_suru", "準備", "じゅんび", "prepare", "suru"],
  ["denwa_suru", "電話", "でんわ", "call", "suru"],
  ["yoyaku_suru", "予約", "よやく", "reserve", "suru"],
  ["annai_suru", "案内", "あんない", "guide", "suru"],
  ["setsumei_suru", "説明", "せつめい", "explain", "suru"],
  ["shinpai_suru", "心配", "しんぱい", "worry", "suru"],
  ["muri_suru", "無理", "むり", "overdo it", "suru"],
  ["shitsumon_suru", "質問", "しつもん", "ask a question", "suru"],
  ["ryokou_suru", "旅行", "りょこう", "travel", "suru"],
]) addSimpleVerbForms(...row);

for (const row of [
  ["tasukeru", "助け", "たすけ", "help"],
  ["hajimeru", "始め", "はじめ", "begin"],
  ["miseru", "見せ", "みせ", "show"],
  ["oshieru", "教え", "おしえ", "teach"],
  ["okureru", "遅れ", "おくれ", "be late"],
  ["suteru", "捨て", "すて", "throw away"],
  ["tomeru", "止め", "とめ", "stop"],
  ["akirameru", "諦め", "あきらめ", "give up"],
  ["kariru", "借り", "かり", "borrow"],
  ["kiru_wear", "着", "き", "wear"],
  ["nageru", "投げ", "なげ", "throw"],
  ["oriru", "降り", "おり", "get off"],
  ["ageru", "あげ", "あげ", "give"],
  ["kangaeru", "考え", "かんがえ", "think"],
  ["oboeru", "覚え", "おぼえ", "remember"],
  ["dekakeru", "出かけ", "でかけ", "go out"],
  ["tsukameru", "つかめ", "つかめ", "grasp"],
  ["shiraberu", "調べ", "しらべ", "look up"],
  ["katazukeru", "片付け", "かたづけ", "tidy up"],
  ["tsutaeru", "伝え", "つたえ", "tell"],
  ["yameru", "やめ", "やめ", "quit"],
  ["tsuzukeru", "続け", "つづけ", "continue"],
]) addSimpleVerbForms(...row);

for (const row of [
  ["noru", "乗り", "のり", "ride", "godan"],
  ["toru", "取り", "とり", "take", "godan"],
  ["shaberu", "しゃべり", "しゃべり", "chat", "godan"],
  ["suwaru", "座り", "すわり", "sit", "godan"],
  ["shiru", "知り", "しり", "know", "godan"],
  ["narau", "習い", "ならい", "learn", "godan"],
  ["erabu", "選び", "えらび", "choose", "godan"],
  ["hakobu", "運び", "はこび", "carry", "godan"],
  ["sagasu", "探し", "さがし", "search", "godan"],
  ["owaru", "終わり", "おわり", "finish", "godan"],
  ["kasu", "貸し", "かし", "lend", "godan"],
  ["tetsudau", "手伝い", "てつだい", "help", "godan"],
  ["yobu", "呼び", "よび", "call", "godan"],
  ["hakaru", "測り", "はかり", "measure", "godan"],
  ["oku", "置き", "おき", "put", "godan"],
  ["dasu", "出し", "だし", "take out", "godan"],
  ["ireru", "入れ", "いれ", "put in", "ichidan"],
  ["motsu", "持ち", "もち", "hold", "godan"],
  ["sawaru", "触り", "さわり", "touch", "godan"],
  ["nakusu", "なくし", "なくし", "lose", "godan"],
  ["kowasu", "壊し", "こわし", "break", "godan"],
  ["kaburu", "かぶり", "かぶり", "wear", "godan"],
  ["haku", "履き", "はき", "wear", "godan"],
  ["nugu", "脱ぎ", "ぬぎ", "take off", "godan"],
  ["ireru_perm", "入れ", "いれ", "put in", "ichidan"],
  ["tsukeru", "つけ", "つけ", "turn on", "ichidan"],
  ["kesu", "消し", "けし", "turn off", "godan"],
  ["sawagu", "騒ぎ", "さわぎ", "make noise", "godan"],
  ["tobikomu", "飛び込み", "とびこみ", "jump in", "godan"],
  ["noboru", "登り", "のぼり", "climb", "godan"],
  ["watashu", "渡し", "わたし", "hand over", "godan"],
  ["isogu", "急ぎ", "いそぎ", "hurry", "godan"],
  ["kaesu", "返し", "かえし", "return", "godan"],
  ["magaru", "曲がり", "まがり", "turn", "godan"],
  ["wataru", "渡り", "わたり", "cross", "godan"],
  ["fumu", "踏み", "ふみ", "step", "godan"],
  ["ugoku", "動き", "うごき", "move", "godan"],
  ["naosu", "直し", "なおし", "fix", "godan"],
  ["morau", "もらい", "もらい", "receive", "godan"],
  ["sumu_finish", "済み", "すみ", "finish", "godan"],
  ["yoru_stop", "寄り", "より", "stop by", "godan"],
]) addSimpleVerbForms(...row);

// Correct common godan te/nai forms used in visible A2 grammar units.
for (const [id, teSurface, teReading, naiSurface, naiReading] of [
  ["noru", "乗って", "のって", "乗らない", "のらない"],
  ["toru", "取って", "とって", "取らない", "とらない"],
  ["shaberu", "しゃべって", "しゃべって", "しゃべらない", "しゃべらない"],
  ["suwaru", "座って", "すわって", "座らない", "すわらない"],
  ["shiru", "知って", "しって", "知らない", "しらない"],
  ["narau", "習って", "ならって", "習わない", "ならわない"],
  ["erabu", "選んで", "えらんで", "選ばない", "えらばない"],
  ["hakobu", "運んで", "はこんで", "運ばない", "はこばない"],
  ["sagasu", "探して", "さがして", "探さない", "さがさない"],
  ["owaru", "終わって", "おわって", "終わらない", "おわらない"],
  ["kasu", "貸して", "かして", "貸さない", "かさない"],
  ["tetsudau", "手伝って", "てつだって", "手伝わない", "てつだわない"],
  ["yobu", "呼んで", "よんで", "呼ばない", "よばない"],
  ["hakaru", "測って", "はかって", "測らない", "はからない"],
  ["oku", "置いて", "おいて", "置かない", "おかない"],
  ["dasu", "出して", "だして", "出さない", "ださない"],
  ["motsu", "持って", "もって", "持たない", "もたない"],
  ["sawaru", "触って", "さわって", "触らない", "さわらない"],
  ["nakusu", "なくして", "なくして", "なくさない", "なくさない"],
  ["kowasu", "壊して", "こわして", "壊さない", "こわさない"],
  ["kaburu", "かぶって", "かぶって", "かぶらない", "かぶらない"],
  ["haku", "履いて", "はいて", "履かない", "はかない"],
  ["nugu", "脱いで", "ぬいで", "脱がない", "ぬがない"],
  ["kesu", "消して", "けして", "消さない", "けさない"],
  ["sawagu", "騒いで", "さわいで", "騒がない", "さわがない"],
  ["tobikomu", "飛び込んで", "とびこんで", "飛び込まない", "とびこまない"],
  ["noboru", "登って", "のぼって", "登らない", "のぼらない"],
  ["watashu", "渡して", "わたして", "渡さない", "わたさない"],
  ["isogu", "急いで", "いそいで", "急がない", "いそがない"],
  ["kaesu", "返して", "かえして", "返さない", "かえさない"],
  ["magaru", "曲がって", "まがって", "曲がらない", "まがらない"],
  ["wataru", "渡って", "わたって", "渡らない", "わたらない"],
  ["fumu", "踏んで", "ふんで", "踏まない", "ふまない"],
  ["ugoku", "動いて", "うごいて", "動かない", "うごかない"],
  ["naosu", "直して", "なおして", "直さない", "なおさない"],
  ["morau", "もらって", "もらって", "もらわない", "もらわない"],
  ["sumu_finish", "済んで", "すんで", "済まない", "すまない"],
  ["yoru_stop", "寄って", "よって", "寄らない", "よらない"],
]) {
  const form = verbForms.get(id);
  if (!form) continue;
  form.te = [teSurface, teReading, form.te[2]];
  form.nai = [naiSurface, naiReading, form.nai[2]];
  form.teiru = [teSurface.replace(/て$|で$/, (match) => `${match}います`), teReading.replace(/て$|で$/, (match) => `${match}います`), form.teiru[2]];
}

const lexicon = new Map();
const wordsByUnit = new Map();
for (let unitId = 1; unitId <= 21; unitId += 1) {
  const unit = readJson(`data/jp/curriculum/units/unit_${pad(unitId)}.json`);
  wordsByUnit.set(unitId, unit.newWords.map((word) => word.id));
  for (const word of unit.newWords) lexicon.set(word.id, word);
}

const people = [
  ["watashi", "I", false],
  ["ken", "Ken", true],
  ["yuki", "Yuki", true],
  ["tanaka", "Tanaka", true],
  ["sensei", "The teacher", true],
  ["gakusei", "The student", true],
  ["tomodachi", "My friend", true],
  ["otokonohito", "The man", true],
  ["onnanohito", "The woman", true],
  ["tenin", "The shop clerk", true],
];

const helperObjects = ["gohan", "pan", "niku", "yasai", "kudamono", "tegami", "shinbun", "ongaku", "eiga", "koohii"];
const helperPlaces = ["gakkou", "ie", "heya", "mise", "eki", "kouen", "toshokan", "kyoushitsu"];
const helperTimes = ["kyou", "ashita", "asa", "yoru", "ima"];
const helperVerbs = ["taberu", "nomu", "iku", "kuru", "miru", "kiku", "yomu", "kaku", "benkyou_suru", "hanasu", "kau", "matsu"];

function word(id, surface, reading, explain) {
  const entry = lexicon.get(id);
  if (!entry) throw new Error(`Unknown word ${id}`);
  return { surface: surface ?? entry.surface, reading: reading ?? entry.reading, explain: explain ?? entry.meaning, wordId: id };
}

function grammar(surface, reading, explain) {
  return { surface, reading: reading ?? surface, explain };
}

const jp = {
  p: () => grammar("。", "。", "period"),
  q: () => grammar("？", "？", "question mark"),
  wa: () => grammar("は", "わ", "topic marker"),
  ga: () => grammar("が", "が", "subject marker"),
  wo: () => grammar("を", "を", "direct object marker"),
  ni: () => grammar("に", "に", "destination, time, or location marker"),
  he: () => grammar("へ", "え", "destination marker"),
  de: () => grammar("で", "で", "action location marker"),
  to: () => grammar("と", "と", "with; and"),
  kara: () => grammar("から", "から", "from"),
  made: () => grammar("まで", "まで", "until"),
  comma: () => grammar("、", "、", "comma"),
  desu: () => grammar("です", "です", "polite sentence ending"),
  desuKa: () => grammar("ですか", "ですか", "polite question ending"),
  arimasu: () => grammar("あります", "あります", "exists; there is"),
  ne: () => grammar("ね", "ね", "sentence ending seeking agreement"),
  yo: () => grammar("よ", "よ", "sentence ending giving emphasis"),
};

function cardParts(parts) {
  return parts.filter((part) => part.surface !== "\u3002");
}

function cardEnglish(english) {
  return english.replace(/\.+$/, "");
}

function verbToken(id, key = "masu") {
  const form = verbForms.get(id);
  if (!form?.[key]) throw new Error(`Missing ${key} form for ${id}`);
  const [surface, reading, explain] = form[key];
  return word(id, surface, reading, explain);
}

function makeCard(unitId, index, parts, english, grammarTags, _visualPrompt, fact) {
  const id = `u${pad(unitId)}-c${pad(index)}`;
  const visibleParts = cardParts(parts);
  return {
    id,
    line: visibleParts.map((part) => part.surface),
    tts: visibleParts.map((part) => part.reading),
    explain: visibleParts.map((part) => part.explain),
    tokens: visibleParts.map((part) => {
      const token = { surface: part.surface, reading: part.reading, explain: part.explain };
      if (part.wordId) token.wordId = part.wordId;
      return token;
    }),
    english: cardEnglish(english),
    fact,
    grammarTags,
  };
}

function add(cards, spec, parts, english, tags, prompt, fact) {
  cards.push(makeCard(spec.id, cards.length + 1, parts, english, tags, prompt, fact));
}

function subjectEnglish(person, lower = false) {
  const text = person[1];
  if (!lower) return text;
  if (["I", "Ken", "Yuki", "Tanaka"].includes(text)) return text;
  return text.replace(/^The /, "the ").replace(/^My /, "my ");
}

function actionEnglish(person, verbId, key = "masu") {
  const form = verbForms.get(verbId);
  if (key === "masen") return `${subjectEnglish(person)} ${person[2] ? form.masen[3] : form.masen[2]}.`;
  if (key === "mashita") return `${subjectEnglish(person)} ${form.mashita[2]}.`;
  if (key === "masendeshita") return `${subjectEnglish(person)} ${form.masendeshita[2]}.`;
  if (key === "teiru") return `${subjectEnglish(person)} ${form.teiru[2]}.`;
  return `${subjectEnglish(person)} ${person[2] ? form.masu[3] : form.masu[2]}.`;
}

function nounEnglish(id, definite = false) {
  const meaning = bareMeaning(lexicon.get(id).meaning);
  const uncountable = new Set([
    "water",
    "tea",
    "weather",
    "rain",
    "snow",
    "wind",
    "paper",
    "food",
    "bread",
    "meat",
    "fruit",
    "music",
    "coffee",
    "money",
    "time",
    "information",
    "homework",
    "sushi",
    "ramen",
    "manga",
    "anime",
    "soccer",
    "cooking",
    "Japanese language",
    "medicine",
    "home",
    "work",
  ]);
  if (meaning.startsWith("the ") || meaning.startsWith("my ")) return meaning;
  if (uncountable.has(meaning)) return definite ? `the ${meaning}` : meaning;
  if (meaning.endsWith("s")) return definite ? `the ${meaning}` : meaning;
  return `${definite ? "the" : /^[aeiou]/i.test(meaning) ? "an" : "a"} ${meaning}`;
}

function placeEnglish(id) {
  const meaning = bareMeaning(lexicon.get(id).meaning);
  if (["here", "there near you", "over there", "home"].includes(meaning)) return meaning;
  return nounEnglish(id, true);
}

function timePhrase(id) {
  const meaning = bareMeaning(lexicon.get(id).meaning);
  const phrases = new Map([
    ["today", "today"],
    ["tomorrow", "tomorrow"],
    ["morning", "in the morning"],
    ["night", "at night"],
    ["now", "now"],
    ["noon", "at noon"],
    ["daytime", "during the day"],
    ["afternoon", "in the afternoon"],
    ["p.m.", "in the afternoon"],
    ["a.m.", "in the morning"],
  ]);
  return phrases.get(meaning) ?? (meaning.endsWith("day") ? `on ${meaning}` : `at ${meaning}`);
}

function variedTime(i) {
  return helperTimes[Math.floor(i / people.length) % helperTimes.length];
}

function variedPlace(i) {
  return helperPlaces[Math.floor(i / (people.length * helperTimes.length)) % helperPlaces.length];
}

function timePlaceParts(i) {
  return [word(variedTime(i)), word(variedPlace(i)), jp.de()];
}

function timePlaceEnglish(i) {
  return `${timePhrase(variedTime(i))} at ${placeEnglish(variedPlace(i))}`;
}

function presentVerbEnglish(person, verbId) {
  const form = verbForms.get(verbId);
  return person[2] ? form.masu[3] : form.masu[2];
}

function movementEnglish(person, verbId, placeId) {
  const place = placeEnglish(placeId);
  const actions = {
    iku: person[2] ? "goes" : "go",
    kuru: person[2] ? "comes" : "come",
    kaeru_verb: person[2] ? "returns" : "return",
  };
  const action = actions[verbId];
  if (place === "home") return `${subjectEnglish(person)} ${action} home.`;
  if (["here", "there near you", "over there"].includes(place)) return `${subjectEnglish(person)} ${action} ${place}.`;
  return `${subjectEnglish(person)} ${action} to ${place}.`;
}

function frequencyPhrase(id) {
  const meaning = bareMeaning(lexicon.get(id).meaning);
  return meaning;
}

function frequencySentence(person, adverbId, verbId, negative) {
  const phrase = frequencyPhrase(adverbId);
  const form = verbForms.get(verbId);
  const subject = subjectEnglish(person);
  const action = presentVerbEnglish(person, verbId);
  if (adverbId === "zenzen") return `${subject} ${person[2] ? form.masen[3] : form.masen[2]} at all.`;
  if (["hotondo", "mettani"].includes(adverbId)) return `${subject} ${phrase} ${action}.`;
  if (["mainichi", "maiasa", "maiban"].includes(adverbId)) return `${subject} ${action} ${phrase}.`;
  if (adverbId === "chotto") return `${subject} ${action} a little.`;
  if (adverbId === "kanari") return `${subject} ${action} quite a bit.`;
  return `${subject} ${phrase} ${action}.`;
}

function objectActionEnglish(person, verbId, objectId) {
  const object = nounEnglish(objectId);
  const action = presentVerbEnglish(person, verbId);
  if (verbId === "kiku") return `${subjectEnglish(person)} ${action} to ${object}.`;
  return `${subjectEnglish(person)} ${action} ${object}.`;
}

function preferenceObjectEnglish(id) {
  const meaning = bareMeaning(lexicon.get(id).meaning);
  if (meaning === "Japanese language") return "the Japanese language";
  if (meaning === "hobby") return "my hobby";
  return nounEnglish(id);
}

function reviewVocabularyUnitIds(unitId) {
  const units = [];
  for (let offset = 2; unitId - offset >= 1; offset *= 2) units.push(unitId - offset);
  return units;
}

function usedWordIds(cards) {
  const ids = new Set();
  for (const card of cards) {
    for (const token of card.tokens) if (token.wordId) ids.add(token.wordId);
  }
  return ids;
}

function requiredWordIds(unitId) {
  const ids = new Set();
  for (const sourceUnitId of [unitId, ...reviewVocabularyUnitIds(unitId)]) {
    for (const wordId of wordsByUnit.get(sourceUnitId) ?? []) ids.add(wordId);
  }
  return ids;
}

function reviewCard(unitId, index, wordId) {
  const entry = lexicon.get(wordId);
  const tags = ["review vocabulary"];
  const prompt = `A focused review card for ${entry.surface}.`;
  const meaning = bareMeaning(entry.meaning);

  if (entry.function === "verb" && verbForms.has(wordId)) {
    const reviewEnglish = {
      kaburu: "I wear something on my head.",
      haku: "I wear something on my feet.",
      kiru_wear: "I wear clothes.",
    }[wordId] ?? `I ${verbForms.get(wordId).masu[2]}.`;
    return makeCard(unitId, index, [word("watashi"), jp.wa(), verbToken(wordId), jp.p()], reviewEnglish, tags, prompt, "Verb review keeps earlier A2 action words active.");
  }
  if (entry.function === "quantity") {
    const countLabels = new Map([
      ["hitotsu", "one"],
      ["futatsu", "two"],
      ["mittsu", "three"],
      ["yottsu", "four"],
      ["itsutsu", "five"],
      ["muttsu", "six"],
      ["nanatsu", "seven"],
      ["yattsu", "eight"],
      ["kokonotsu", "nine"],
      ["too", "ten"],
    ]);
    const count = countLabels.get(wordId) ?? meaning;
    return makeCard(unitId, index, [word("hon"), jp.ga(), word(wordId), jp.arimasu(), jp.p()], `There ${count === "one" ? "is" : "are"} ${count} ${count === "one" ? "book" : "books"}.`, tags, prompt, "Counter review keeps basic quantities active.");
  }
  if (["nan", "dare", "doko", "itsu", "dore"].includes(wordId)) {
    const english = { nan: "What is it?", dare: "Who is it?", doko: "Where is it?", itsu: "When is it?", dore: "Which one is it?" }[wordId];
    return makeCard(unitId, index, [word(wordId), jp.desuKa(), jp.q()], english, tags, prompt, "Question-word review keeps A1 questions available.");
  }
  if (wordId === "dono") {
    return makeCard(unitId, index, [word("dono"), word("hon"), jp.desuKa(), jp.q()], "Which book is it?", tags, prompt, "Determiner review stays attached to a noun.");
  }
  if (["kore", "sore", "are"].includes(wordId)) {
    return makeCard(unitId, index, [word(wordId), jp.wa(), word("hon"), jp.desu(), jp.p()], `This is ${wordId === "kore" ? "a" : "the"} book.`, tags, prompt, "Demonstrative review keeps reference words active.");
  }
  if (["kono", "sono", "ano"].includes(wordId)) {
    const english = wordId === "kono" ? "It is this book." : wordId === "sono" ? "It is that book near you." : "It is that book over there.";
    return makeCard(unitId, index, [word(wordId), word("hon"), jp.desu(), jp.p()], english, tags, prompt, "Determiner review stays attached to a noun.");
  }
  if (entry.function === "place") {
    return makeCard(unitId, index, [word(wordId), jp.he(), verbToken("iku"), jp.p()], movementEnglish(people[0], "iku", wordId), tags, prompt, "Place review returns inside an A2 movement sentence.");
  }
  if (entry.function === "time" || entry.function === "adverb") {
    const negative = ["zenzen", "hotondo", "mettani"].includes(wordId);
    if (entry.function === "adverb") {
      return makeCard(unitId, index, [word("watashi"), jp.wa(), word(wordId), negative ? verbToken("benkyou_suru", "masen") : verbToken("benkyou_suru"), jp.p()], frequencySentence(people[0], wordId, "benkyou_suru", negative), tags, prompt, "Adverb review modifies a familiar action.");
    }
    return makeCard(unitId, index, [word("watashi"), jp.wa(), word(wordId), verbToken("benkyou_suru"), jp.p()], `I study ${timePhrase(wordId)}.`, tags, prompt, "Time review modifies a familiar action.");
  }
  if (entry.function === "person") {
    return makeCard(unitId, index, [word("watashi"), jp.wa(), word(wordId), jp.to(), verbToken("hanasu"), jp.p()], `I speak with ${nounEnglish(wordId, true)}.`, tags, prompt, "Person review returns with `と`.");
  }
  if (entry.function === "adjective" || entry.function === "adjectival noun") {
    return makeCard(unitId, index, [word("koko"), jp.wa(), word(wordId), jp.desu(), jp.p()], `It is ${meaning} here.`, tags, prompt, "Description review stays attached to a simple scene.");
  }
  return makeCard(unitId, index, [word("watashi"), jp.wa(), word(wordId), jp.wo(), verbToken("miru"), jp.p()], `I look at ${nounEnglish(wordId)}.`, tags, prompt, "Noun review returns as an object of a familiar action.");
}

function ensureRequiredWords(spec, cards) {
  const present = usedWordIds(cards);
  for (const wordId of requiredWordIds(spec.id)) {
    if (!present.has(wordId)) {
      cards.push(reviewCard(spec.id, cards.length + 1, wordId));
      present.add(wordId);
    }
  }
  if (cards.length > 150) throw new Error(`${spec.title}: generated ${cards.length} cards, above the 150-card unit limit`);
}

function generateCards(spec) {
  const cards = [];
  const currentWords = spec.words.map(([id]) => id);
  const verbs = currentWords.filter((id) => lexicon.get(id)?.function === "verb" && verbForms.has(id));
  const nouns = currentWords.filter((id) => ["noun", "place", "person", "time", "adverb", "phrase"].includes(lexicon.get(id)?.function));

  const fact = `Unit ${spec.id} introduces ${spec.grammarFocus} while keeping earlier A2 action sentences active.`;

  if (spec.id === 22) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[i % people.length];
      const verbId = verbs[Math.floor(i / people.length) % verbs.length];
      const time = variedTime(i);
      const place = variedPlace(i);
      add(cards, spec, [word(person[0]), jp.wa(), word(time), word(place), jp.de(), verbToken(verbId, "masen"), jp.p()], `${subjectEnglish(person)} ${verbForms.get(verbId).masen[person[2] ? 3 : 2]} ${timePhrase(time)} at ${placeEnglish(place)}.`, ["Vません"], "A polite negative action.", fact);
    }
    return cards;
  }

  if (spec.id === 23) {
    for (let i = 0; i < 40; i += 1) {
      const person = people[i % people.length];
      const verbId = verbs[Math.floor(i / people.length) % verbs.length];
      const place = helperPlaces[Math.floor(i / people.length) % helperPlaces.length];
      add(cards, spec, [word(person[0]), jp.wa(), word("kinou"), word(place), jp.de(), verbToken(verbId, "mashita"), jp.p()], `${subjectEnglish(person)} ${verbForms.get(verbId).mashita[2]} yesterday at ${placeEnglish(place)}.`, ["Vました"], "A polite past action.", fact);
    }
    for (let i = 0; i < 40; i += 1) {
      const person = people[(i + 3) % people.length];
      const verbId = verbs[Math.floor(i / people.length) % verbs.length];
      const place = helperPlaces[(Math.floor(i / people.length) + 4) % helperPlaces.length];
      add(cards, spec, [word(person[0]), jp.wa(), word("kinou"), word(place), jp.de(), verbToken(verbId, "masendeshita"), jp.p()], `${subjectEnglish(person)} ${verbForms.get(verbId).masendeshita[2]} yesterday at ${placeEnglish(place)}.`, ["Vませんでした"], "A polite past negative action.", fact);
    }
    return cards;
  }

  if (spec.id === 24) {
    const objectVerbByWord = new Map([
      ["gohan", "taberu"],
      ["pan", "taberu"],
      ["niku", "taberu"],
      ["yasai", "taberu"],
      ["kudamono", "taberu"],
      ["tegami", "yomu"],
      ["shinbun", "yomu"],
      ["ongaku", "kiku"],
      ["eiga", "miru"],
      ["koohii", "nomu"],
    ]);
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const object = currentWords[i % currentWords.length];
      const verbId = objectVerbByWord.get(object);
      add(cards, spec, [word(person[0]), jp.wa(), word(object), jp.wo(), verbToken(verbId), jp.p()], objectActionEnglish(person, verbId, object), ["NをVます"], "A direct object before a polite action.", fact);
    }
    return cards;
  }

  if (spec.id === 25) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const place = currentWords[i % currentWords.length];
      const particle = i % 2 === 0 ? jp.ni() : jp.he();
      const verbId = i % 3 === 0 ? "iku" : i % 3 === 1 ? "kuru" : "kaeru_verb";
      add(cards, spec, [word(person[0]), jp.wa(), word(place), particle, verbToken(verbId), jp.p()], movementEnglish(person, verbId, place), ["場所に行きます", "場所へ行きます"], "Movement toward a place.", fact);
    }
    return cards;
  }

  if (spec.id === 26) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[i % people.length];
      const place = currentWords[i % currentWords.length];
      const verbId = ["benkyou_suru", "hanasu", "matsu", "yomu", "kaku", "asobu", "aruku", "hataraku"][i % 8];
      add(cards, spec, [word(person[0]), jp.wa(), word(place), jp.de(), verbToken(verbId), jp.p()], `${subjectEnglish(person)} ${verbForms.get(verbId).masu[person[2] ? 3 : 2]} at ${placeEnglish(place)}.`, ["場所でVます"], "Action happening at a place.", fact);
    }
    return cards;
  }

  if (spec.id === 27) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[i % people.length];
      const time = currentWords[i % currentWords.length];
      const verbId = helperVerbs[i % helperVerbs.length];
      add(cards, spec, [word(person[0]), jp.wa(), word(time), jp.ni(), verbToken(verbId), jp.p()], `${subjectEnglish(person)} ${presentVerbEnglish(person, verbId)} ${timePhrase(time)}.`, ["時間にVます"], "A time point before a polite action.", fact);
    }
    return cards;
  }

  if (spec.id === 28) {
    for (let i = 0; i < 80; i += 1) {
      const start = currentWords[i % currentWords.length];
      const end = currentWords[(i + 3) % currentWords.length];
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const verbId = ["hataraku", "benkyou_suru", "matsu", "yomu"][Math.floor(i / people.length) % 4];
      add(cards, spec, [word(person[0]), jp.wa(), word(start), jp.kara(), word(end), jp.made(), verbToken(verbId), jp.p()], `${subjectEnglish(person)} ${verbForms.get(verbId).masu[person[2] ? 3 : 2]} from ${bareMeaning(lexicon.get(start).meaning)} until ${bareMeaning(lexicon.get(end).meaning)}.`, ["AからBまで"], "A time span before an action.", fact);
    }
    return cards;
  }

  if (spec.id === 29) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const partner = currentWords[i % currentWords.length];
      const verbId = ["iku", "hanasu", "taberu", "benkyou_suru", "asobu", "aruku"][Math.floor(i / people.length) % 6];
      add(cards, spec, [word(person[0]), jp.wa(), word(partner), jp.to(), verbToken(verbId), jp.p()], `${subjectEnglish(person)} ${presentVerbEnglish(person, verbId)} with ${nounEnglish(partner, true)}.`, ["人とVます"], "An action done with someone.", fact);
    }
    return cards;
  }

  if (spec.id === 30) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[i % people.length];
      const adverb = currentWords[i % currentWords.length];
      const negative = ["hotondo", "mettani"].includes(adverb);
      const verbId = helperVerbs[i % helperVerbs.length];
      add(cards, spec, [word(person[0]), jp.wa(), word(adverb), negative ? verbToken(verbId, "masen") : verbToken(verbId), jp.p()], frequencySentence(person, adverb, verbId, negative), ["frequency", negative ? "Vません" : "Vます"], "Frequency before a polite action.", fact);
    }
    return cards;
  }

  if (spec.id === 31 || spec.id === 32 || spec.id === 33 || spec.id === 40) {
    const pattern = {
      31: [["好き", "すき", "likeable; liked"], ["嫌い", "きらい", "disliked"], "が", "です", (id, positive, person) => `${subjectEnglish(person)} ${positive ? (person[2] ? "likes" : "like") : (person[2] ? "dislikes" : "dislike")} ${preferenceObjectEnglish(id)}.`],
      32: [["上手", "じょうず", "skillful"], ["下手", "へた", "unskillful"], "が", "です", (id, positive, person) => `${subjectEnglish(person)} ${person[2] ? "is" : "am"} ${positive ? "good" : "bad"} at ${bareMeaning(lexicon.get(id).meaning)}.`],
      33: [["欲しい", "ほしい", "wanted"], ["欲しくない", "ほしくない", "not wanted"], "が", "です", (id, positive, person) => `${subjectEnglish(person)} ${positive ? (person[2] ? "wants" : "want") : (person[2] ? "does not want" : "do not want")} ${nounEnglish(id)}.`],
      40: [["必要", "ひつよう", "necessary"], ["どう", "どう", "how"], "が", "です", (id, positive, person) => positive ? `${subjectEnglish(person)} ${person[2] ? "needs" : "need"} ${nounEnglish(id)}.` : `How about ${nounEnglish(id)}?`],
    }[spec.id];
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const item = currentWords[i % currentWords.length];
      const positive = Math.floor(i / currentWords.length) % 2 === 0;
      if (spec.id === 40 && !positive) {
        const time = variedTime(i);
        add(cards, spec, [word(time), word(item), jp.wa(), grammar("どう", "どう", "how"), jp.desuKa(), jp.q()], `${pattern[4](item, false, person).replace("?", "")} ${timePhrase(time)}?`, ["Nはどうですか"], "A simple suggestion with `どうですか`.", fact);
      } else {
        add(cards, spec, [word(person[0]), jp.wa(), word(item), jp.ga(), grammar(positive ? pattern[0][0] : pattern[1][0], positive ? pattern[0][1] : pattern[1][1], positive ? pattern[0][2] : pattern[1][2]), jp.desu(), jp.p()], pattern[4](item, positive, person), [spec.id === 31 ? "Nが好きです" : spec.id === 32 ? "Nが上手です" : spec.id === 33 ? "Nが欲しいです" : "Nが必要です"], "A descriptive preference, skill, want, or need sentence.", fact);
      }
    }
    return cards;
  }

  if (spec.id === 34) {
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / verbs.length) % people.length];
      const verbId = verbs[i % verbs.length];
      const negative = Math.floor(i / verbs.length) % 4 === 0;
      const want = negative ? `does not want to ${verbForms.get(verbId).masu[2]}` : `wants to ${verbForms.get(verbId).masu[2]}`;
      const iWant = negative ? `do not want to ${verbForms.get(verbId).masu[2]}` : `want to ${verbForms.get(verbId).masu[2]}`;
      add(cards, spec, [word(person[0]), jp.wa(), negative ? verbToken(verbId, "takunai") : verbToken(verbId, "tai"), jp.desu(), jp.p()], `${subjectEnglish(person)} ${person[2] ? want : iWant}.`, [negative ? "Vたくないです" : "Vたいです"], "Wanting or not wanting to do an action.", fact);
    }
    return cards;
  }

  if (spec.id === 35) {
    for (let i = 0; i < 80; i += 1) {
      const verbId = verbs[i % verbs.length];
      const question = i % 2 === 1;
      const masu = verbForms.get(verbId).masu;
      const surface = masu[0].replace("ます", question ? "ましょうか" : "ましょう");
      const reading = masu[1].replace("ます", question ? "ましょうか" : "ましょう");
      add(cards, spec, [...timePlaceParts(i), word(verbId, surface, reading, question ? "shall we?" : "let's"), question ? jp.q() : jp.p()], question ? `Shall we ${masu[2]} ${timePlaceEnglish(i)}?` : `Let's ${masu[2]} ${timePlaceEnglish(i)}.`, [question ? "Vましょうか" : "Vましょう"], "A suggestion or offer to act together.", fact);
    }
    return cards;
  }

  if (spec.id === 36 || spec.id === 37 || spec.id === 38 || spec.id === 39 || spec.id === 41 || spec.id === 42) {
    for (let i = 0; i < 80; i += 1) {
      const verbId = verbs[i % verbs.length];
      const form = verbForms.get(verbId);
      const contextParts = timePlaceParts(i);
      const contextEnglish = timePlaceEnglish(i);
      if (spec.id === 36) add(cards, spec, [...contextParts, verbToken(verbId, "te"), grammar("ください", "ください", "please do"), jp.p()], `Please ${form.masu[2]} ${contextEnglish}.`, ["Vてください"], "A direct but polite request.", fact);
      else if (spec.id === 37) add(cards, spec, [...contextParts, verbToken(verbId, "nai"), grammar("でください", "でください", "please do not"), jp.p()], `Please do not ${form.masu[2]} ${contextEnglish}.`, ["Vないでください"], "A polite negative request.", fact);
      else if (spec.id === 38) add(cards, spec, [...contextParts, verbToken(verbId, "te"), grammar(i % 2 === 0 ? "もいいですか" : "もいいです", i % 2 === 0 ? "もいいですか" : "もいいです", "permission phrase"), i % 2 === 0 ? jp.q() : jp.p()], i % 2 === 0 ? `May I ${form.masu[2]} ${contextEnglish}?` : `You may ${form.masu[2]} ${contextEnglish}.`, ["Vてもいいですか", "Vてもいいです"], "Permission with a te-form verb.", fact);
      else if (spec.id === 39) add(cards, spec, [...contextParts, verbToken(verbId, "te"), grammar("はいけません", "はいけません", "must not"), jp.p()], `You must not ${form.masu[2]} ${contextEnglish}.`, ["Vてはいけません"], "A prohibition with te-form plus `はいけません`.", fact);
      else add(cards, spec, [...contextParts, verbToken(verbId, "te"), jp.p()], `${form.masu[2]} ${contextEnglish}, and...`, [spec.id === 41 ? "ichidan te-form" : "godan te-form"], "A te-form shape drill before connected actions.", fact);
    }
    return cards;
  }

  if (spec.id === 43) {
    const sequenceVerbs = ["taberu", "nomu", "benkyou_suru", "yomu", "kaku", "hanasu", "kaimono_suru", "sanpo_suru"];
    for (let i = 0; i < 80; i += 1) {
      const first = sequenceVerbs[i % sequenceVerbs.length];
      const second = sequenceVerbs[(i + 3) % sequenceVerbs.length];
      const person = people[i % people.length];
      const connector = currentWords[i % 5];
      const lead = connector === "sorekara" ? "Then" : capitalize(bareMeaning(lexicon.get(connector).meaning));
      add(cards, spec, [word(person[0]), jp.wa(), word(connector), verbToken(first, "te"), jp.comma(), verbToken(second), jp.p()], `${lead}, ${subjectEnglish(person, true)} ${presentVerbEnglish(person, first)} and ${presentVerbEnglish(person, second)}.`, ["Vて、Vます"], "Two actions connected by te-form.", fact);
    }
    return cards;
  }

  if (spec.id === 44) {
    const ongoing = new Map([
      ["kaigi", ["しています", "しています", "is having a meeting"]],
      ["jugyou", ["しています", "しています", "is in class"]],
      ["shiken", ["受けています", "うけています", "is taking an exam"]],
      ["sentaku", ["しています", "しています", "is doing laundry"]],
      ["undou", ["しています", "しています", "is exercising"]],
      ["kenkyuu", ["しています", "しています", "is doing research"]],
      ["sagyou", ["しています", "しています", "is working on a task"]],
      ["renraku", ["しています", "しています", "is contacting someone"]],
      ["houkoku", ["しています", "しています", "is giving a report"]],
      ["seikatsu", ["しています", "しています", "is living daily life"]],
    ]);
    for (let i = 0; i < 80; i += 1) {
      const person = people[Math.floor(i / currentWords.length) % people.length];
      const topic = currentWords[i % currentWords.length];
      const [surface, reading, english] = ongoing.get(topic);
      const ongoingEnglish = person[2] ? english : english.replace(/^is /, "am ");
      add(cards, spec, [word(person[0]), jp.wa(), ...timePlaceParts(i), word(topic), jp.wo(), grammar(surface, reading, "is doing now"), jp.p()], `${subjectEnglish(person)} ${ongoingEnglish} ${timePlaceEnglish(i)}.`, ["Vています"], "An ongoing action or resulting state.", fact);
    }
    return cards;
  }

  throw new Error(`No generator for unit ${spec.id}`);
}

for (const spec of specs) {
  for (const [id, surface, reading, meaning, fn] of spec.words) {
    lexicon.set(id, { id, surface, reading, meaning, function: fn });
  }
  wordsByUnit.set(spec.id, spec.words.map(([id]) => id));

  const cards = generateCards(spec);
  ensureRequiredWords(spec, cards);

  const unitSlug = `unit_${pad(spec.id)}`;
  const unit = {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    grammarFocus: spec.grammarFocus,
    newWords: spec.words.map(([id, surface, reading, meaning, fn]) => ({ id, surface, reading, meaning, function: fn })),
    cards,
  };
  writeJson(path.join(unitDir, `${unitSlug}.json`), unit);


  const manifest = {
    unitId: spec.id,
    unitSlug,
    generatedAt: "2026-06-28T00:00:00.000Z",
    audioPolicy: "audio is queued; app uses browser speech fallback until production audio exists",
    audio: cards.map((card) => ({ cardId: card.id, status: "queued", path: `/media/jp/audio/${unitSlug}/${card.id}.mp3`, text: card.line.join("") })),
  };
  writeJson(path.join(manifestDir, `${unitSlug}.assets.json`), manifest);
}

const indexPath = path.join(root, "data/jp/curriculum/unit_index.json");
const index = readJson("data/jp/curriculum/unit_index.json");
const indexed = new Map(index.units.map((entry) => [entry.id, entry]));
for (const spec of specs) {
  indexed.set(spec.id, {
    id: spec.id,
    slug: spec.slug,
    title: spec.title,
    grammarFocus: spec.grammarFocus,
    path: `data/jp/curriculum/units/unit_${pad(spec.id)}.json`,
  });
}
index.units = [...indexed.values()].sort((a, b) => a.id - b.id);
writeJson(indexPath, index);

console.log("Authored A2 units 22-44 with manifests and placeholder scenes.");
