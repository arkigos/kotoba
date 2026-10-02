"""One-time reviewed scope authoring; never run as part of dictionary binding.

The checked-in a1_scope.json is the runtime authority. This records the curation
inputs; future edits should preserve the versioned core denominator deliberately.
"""
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
words = {k: v for k, v in json.loads((root / 'data/jp/dictionary/teaching_words.json').read_text(encoding='utf-8'))['words'].items() if v.get('level') == 'A1' and isinstance(v.get('introducedInUnit'), int)}
groups = '''ageru agemasu
au aimasu
aru arimasu
asagohan asa-gohan
asobu asobimasu
byouin byooin
eiga eega
gakkou gakkoo
gakusei gakusee
getsuyoubi getsuyoobi
ginkou ginkoo
hairu hairimasu
hikouki hikooki
iku ikimasu
iru imasu
imouto imooto
jugyou jugyoo
kaeru kaerimasu
kayoubi kayoobi
kiku kikimasu
kuru kimasu
kinou kinoo
kouen kooen
kyuu ku
kuukou kuukoo
kyou kyoo
kyouto kyooto
miru mimasu
nana shichi
neru nemasu
niau niaimasu
nomu nomimasu
noru norimasu
ocha ocha-cha
okiru okimasu
oriru orimasu
otouto otooto
raku raku-na
sadou sadoo
sensei sensee
suru shimasu
sumu sumimasu
sumou sumoo
taberu tabemasu
taihen taihen-na
tanjoubi tanjoobi otanjoobi-tanjoobi baasudee
tomaru tomarimasu
toru torimasu
tsukareru tsukaremasu
tsuku tsukimasu
utau utaimasu
yasumu yasumimasu
yuumei yuumee-na
benri benri-na
daijoubu daijoobu-na
issho issho-ni
omiyage omiyage-miyage
tiishatsu thii-shatsu
nihon japan
shigoto oshigoto-shigoto
namae onamae-namae
mouichido moo-ichido
sensouji sensooji
toukyou_tower tookyoo-tawaa'''
alias = {}
for line in groups.splitlines():
    ids = line.split()
    assert all(i in words for i in ids), ids
    for i in ids:
        alias[i] = ids[0]

# These optional choices enrich interests without inflating the required scope.
extension = set('''akihabara asakusa biitoruzu firipin ginza harajuku hiroshima hokkaidoo kankoku kankokugo kankokujin kyouto okinawa oosaka oosutoraria roshia sensouji shibuya shinjuku sooru sukaitsuri supein tai tookyoo toukyou_tower ueno
akushon esuefu fantajii horaa komedhi misuterii ren-ai jei-poppu haiku ikebana kabuki shuriken ninja mimikaki hashioki monoreeru kuusha nihonteki-na
chiizu-baagaa hottodoggu furaido-poteto nenjuu-mukyuu teekyuubi hanabi-taikai
bungaku fasshon jazu kurashikku poppusu rokku juudoo sumou sadou taiko origami ningyoo'''.split())
assert extension <= words.keys(), extension - words.keys()

# Frozen introduction units are authoring context, not runtime topic inference.
primary = {1:'school',2:'greetings',3:'family',4:'food',5:'food',6:'home',7:'travel',8:'routine',9:'routine',10:'leisure',11:'culture',12:'travel',13:'travel',14:'shopping',15:'shopping',16:'shopping',17:'travel',18:'leisure',19:'routine',20:'greetings',21:'school',22:'school',23:'greetings',24:'greetings',25:'family',26:'family',27:'food',28:'food',29:'food',30:'home',31:'home',32:'home',33:'routine',34:'routine',35:'routine',36:'leisure',37:'leisure',38:'leisure',39:'leisure',40:'leisure',41:'travel',42:'travel',43:'travel',44:'shopping',45:'shopping',46:'shopping',47:'leisure',48:'travel',49:'travel'}
tags = {k: {primary[v['introducedInUnit']]} for k, v in words.items()}

def set_tags(topic, ids, replace=False):
    for i in ids.split():
        assert i in tags, i
        if replace:
            tags[i] = {topic}
        else:
            tags[i].add(topic)

set_tags('family', 'anata boku watashi watashitachi hito tomodachi kazoku chichi haha ani ane otouto imouto otto tsuma kodomo obaachan hitori futari namae onamae-namae oikutsu-desu-ka wakai shufu shashin tanjoubi omedetoo au ageru ureshii')
set_tags('food', 'taberu nomu erabu hairu hayai mise menyuu resutoran oishii suki-na itsumo yoku tabemono nomimono gohan asagohan ban-gohan hiru-gohan ryoori shokuji koohii-shoppu osake-sake kappu hashi hotto aisu tamago kudamono niku sakana yasai pan mizu koohii ocha juusu koora koocha gyuunyuu sushi udon soba tenpura piza karee raamen hanbaagaa misoshiru itadakimasu gochisousama kekkoo-desu irasshaimase ikura ikura-desu-ka onegaishimasu douzo')
set_tags('home', 'apaato manshon ie uchi heya daidokoro genkan ofuro-furo niwa arimasu imasu sumu hairu beddo eakon teeburu isu terebi sofa tana hako tokee shawaa sentaku sooji abimasu ojamashimasu irasshai doozo-agatte-kudasai gomenkudasai ookii chiisai hiroi semai akarui kurai kiree-na atarashii furui ue shita naka soto yoko tonari mae ushiro koko kore kochira')
set_tags('routine', 'asa hiru yoru gozen gogo mainichi kyou kinou ashita getsuyoubi kayoubi suiyoobi mokuyoobi kin-yoobi doyoobi nichiyoobi itsu ima nan-ji yasumi shukujitsu heejitsu senshuu konshuu raishuu kotoshi kyonen hi karendaa itsumo tokidoki yoku okiru neru kaeru suru isogashii osoi hayai kaisha shigoto jugyou asagohan ban-gohan hiru-gohan shokuji abimasu shawaa sentaku sooji yasumu hajimemasu owarimasu okuremasu ichinichime futsukame mikkame yokkame itsu-de-mo-iidesu')
set_tags('school', 'gakkou gakusei sensei kyooshi kyooshitsu jugyou nihongo eigo gaikokugo kanji hiragana katakana roomaji kaku yomu wakaru hanasu kiku hon zasshi shinbun ankeeto risuto namae pea benkyoo-chuu benkyooshimasu dekimasu hajimemasu owarimasu yasumu okuremasu mouichido moo-sukoshi sukoshi moo mada yukkuri wakarimashita wakarimasen')
set_tags('work', 'hataraku shigoto kaisha kaishain enjinia koomuin kyooshi sensei arubaito meeshi isogashii yasumi yasumu getsuyoubi kayoubi suiyoobi mokuyoobi kin-yoobi heejitsu gozen gogo asa kaeru okuremasu hajimemasu owarimasu osaki-ni-shitsureeshimasu otsukaresama shitsureeshimasu namae au kaku yomu hanasu kiku tsukau')
set_tags('travel', 'iku kuru noru oriru tsuku tomaru basu densha chikatetsu takushii jitensha baiku kuruma fune hikouki hoteru eki kuukou byouin ginkou depaato gakkou kouen jinja toire machi biru toori otera-tera biichi nimotsu aruite norimono doo-yatte dochira doko koko kochira mae ushiro hidari migi massugu-na tonari chikai tooi benri raku soto tokoro sumimasen ki-o-tsukete moshimoshi ima kyou ashita shukujitsu heejitsu eegyoo-jikan kaerimasu okyakusan tsukareru nagai yuki_snow shashin toru')
set_tags('shopping', 'kaimasu kaemasu kaimono kaimonoshimasu mise depaato hoshii erabu ageru saizu iro ookii chiisai takai yasui atarashii furui ii suteki kawaii kakkoii omoshiroi oshare-na en ichi ni san yon go roku nana kyuu hachi juu hyaku-byaku-pyaku sen-zen man hitotsu futatsu mittsu yottsu itsutsu muttsu ikutsu ikura ikura-desu-ka baggu jaketto jiinzu shatsu sukaato kutsu kutsushita pantsu wanpiisu kooto emu eru esu aka ao shiro kuro chairo kiiro midori orenji pinku guree kaado kasa hankachi hashi')
set_tags('leisure', 'asobu au matsu issho mata sorekara demo watashitachi tanoshii omoshiroi subarashii ureshii taihen daijoubu anime manga eiga ongaku gitaa piano uta utau kiku shumi dokusho hon shoosetsu supootsu sakkaa yakyuu tenisu juudoo sumou dansu sanpo karaoke yukkurishimasu yasumi tanjoubi paatii konsaato ibento matsuri hanabi fesuthibaru karendaa itsu itsu-de-mo-iidesu mata-kondo tanoshimi-desu tabun mochiron muryoo zannen-na doo-deshita-ka nani-mo-shimasendeshita doko-nimo-ikimasendeshita burogu nikki')
set_tags('culture', 'anime manga matsuri hanabi hanabi-taikai fesuthibaru jinja otera-tera kabuki ikebana origami sadou sumou juudoo taiko kimono haiku omiyage hashi ningyoo ninja shuriken nihon nihonteki-na bijutsukan hakubutsukan yuumei shoo')
set_tags('everyday-objects', 'hon shinbun zasshi nikki karendaa risuto ankeeto meeshi ehagaki kaado baggu nimotsu kasa hankachi kappu hashi hashioki hako tana tokee isu teeburu beddo sofa terebi eakon shawaa shashin ningyoo gitaa piano tsukau kore are kono ano iro ookii chiisai furui atarashii nagai erabu miseru')

# Correct semantic spillovers at supplemental-unit boundaries.
for ids, topic in [
    ('akihabara asakusa ginza harajuku hiroshima hokkaidoo kyouto okinawa oosaka sensouji shibuya shinjuku sooru sukaitsuri tookyoo toukyou_tower ueno', 'travel'),
    ('nihon kuni anata watashi kankoku kankokugo kankokujin oosutoraria roshia supein tai firipin', 'greetings'),
    ('gakusee kyooshi', 'school'), ('arubaito kaishain koomuin enjinia', 'work'),
    ('byooin', 'travel'), ('imooto otto tsuma hitori futari oikutsu-desu-ka', 'family'),
    ('benkyooshimasu', 'school'), ('kaisha', 'work'), ('ku shichi baasudee tanjoobi', 'routine'),
    ('bijutsukan hakubutsukan tenisu', 'leisure'), ('nihonteki-na', 'culture')
]:
    set_tags(topic, ids, True)

for topic, ids in [
    ('home', 'a yuumei yuumee-na'),
    ('family', 'benkyoo-chuu doozo-yoroshiku doozo-yoroshiku-onegaishimasu'),
    ('food', 'ankeeto'),
    ('routine', 'doozo-agatte-kudasai gomenkudasai irasshai ojamashimasu'),
    ('travel', 'obaachan tenpura'),
    ('leisure', 'japan'),
]:
    for word_id in ids.split():
        tags[word_id].discard(topic)
set_tags('family', 'anata watashi')
set_tags('work', 'kyooshi')
set_tags('culture', 'nihon bijutsukan hakubutsukan yuumei')
set_tags('travel', 'yuumei')

# Greetings is a communicative scenario, not the old countries/jobs unit.
# Keep a reviewed pleasantry allowlist so legacy unit placement cannot leak
# professions, countries, or general verbs back into this topic on regeneration.
greeting_opening = '''konnichiwa arigatou sumimasen ohayou konbanwa sayounara
hajimemashite onegaishimasu douzo ohayoo-gozaimasu
doomo-arigatoo-gozaimasu doozo-yoroshiku'''.split()
greeting_words = greeting_opening + '''doozo-yoroshiku-onegaishimasu doomo
shitsureeshimasu moshimoshi omedetoo hai iie daijoubu kekkoo-desu
irasshai irasshaimase ojamashimasu gomenkudasai doozo-agatte-kudasai
itadakimasu gochisousama osaki-ni-shitsureeshimasu otsukaresama
ii-desu-ne soo-desu-ka soo-desu-ne kanpai'''.split()
for word_tags in tags.values():
    word_tags.discard('greetings')
set_tags('greetings', ' '.join(greeting_words))
set_tags('travel', 'kuni firipin kankoku oosutoraria roshia supein tai')
set_tags('school', 'kankokugo a anoo e')
set_tags('family', 'kankokujin')
set_tags('work', 'shufu')

# Equivalent forms share the same topic union and progress representative.
for representative in set(alias.values()):
    members = [i for i, r in alias.items() if r == representative]
    merged = set().union(*(tags[i] for i in members))
    for i in members:
        tags[i] = merged.copy()

core_ids = sorted({alias.get(i, i) for i in words} - {alias.get(i, i) for i in extension}, key=lambda i: (words[i]['introducedInUnit'], i))
metadata = {}
for i in words:
    rep = alias.get(i, i)
    core = rep in core_ids
    metadata[i] = {'level': 'A1', 'core': core, 'topicIds': sorted(tags[i])}
    if core:
        metadata[i]['coreWordId'] = rep

topic_specs = [
    ('greetings', 'Greetings & pleasantries', 'Say hello, thank someone, apologize, say goodbye, and use everyday polite phrases.', ['introductions']),
    ('family', 'Family & people', 'Describe the people in your life and share a little about yourself.', ['people']),
    ('food', 'Food & eating out', 'Meals, preferences, menus, and ordering something you enjoy.', ['food']),
    ('home', 'Home & surroundings', 'Rooms, belongings, and welcoming someone into your home.', ['home']),
    ('routine', 'Daily life & plans', 'Your day, the time, and making simple plans together.', ['plans']),
    ('school', 'School & learning', 'Classroom language, reading, writing, and asking for help.', ['classroom', 'messages']),
    ('work', 'Work & introductions', 'Your job, working hours, and everyday workplace greetings.', ['introductions', 'plans']),
    ('travel', 'Around town & travel', 'Places, transport, directions, and simple travel experiences.', ['travel']),
    ('shopping', 'Shopping & clothes', 'Find things you need and ask about prices, colors, and sizes.', ['shopping']),
    ('leisure', 'Hobbies & time off', 'Share interests, arrange an outing, and talk about a day off.', ['leisure']),
    ('culture', 'Culture & events', 'Explore festivals, familiar cultural activities, and things to see.', ['leisure']),
    ('everyday-objects', 'Everyday objects', 'Books, household items, useful belongings, and where to find them.', ['home', 'shopping']),
]
topics = [dict(id=i, title=t, description=d, milestoneIds=m) for i, t, d, m in topic_specs]
topics[0]['introductionWordIds'] = greeting_opening
marugoto = 'https://marugoto.jpf.go.jp/assets/docs/download/starter_a/MarugotoStarterActivitiesCan-doCheck_EN.pdf'
cefr = 'https://www.coe.int/en/web/common-european-framework-reference-languages/table-2-cefr-3.3-common-reference-levels-self-assessment-grid'
evidence_note = 'Self-assessment after trying the task. Related sentence practice prepares vocabulary; it does not assess this complete communicative skill.'
milestone_specs = [
    ('introductions', 'Meet someone', 'Exchange greetings and introduce yourself simply.', 'Greet someone, give your name, respond politely, and say goodbye.', ['greetings','work'], ['listening','spoken-interaction','spoken-production'], [1,5], [20,23,26]),
    ('classroom', 'Ask for help', 'Keep a simple exchange going.', 'Ask someone to repeat slowly, then follow their short instruction.', ['school'], ['listening','spoken-interaction'], [2,3], [1,20,21,22,23]),
    ('people', 'Introduce your family', 'Talk about familiar people.', 'Use a photo to introduce two relatives and answer simple questions.', ['family'], ['listening','spoken-interaction','spoken-production'], [7,8], [3,25,26]),
    ('food', 'Order a meal', 'Handle a simple food order.', 'Choose from a menu, order a drink, and check the price.', ['food'], ['reading','listening','spoken-interaction'], [9,10,14,15], [4,5,27,28,29]),
    ('home', 'Welcome a visitor', 'Describe your immediate surroundings.', 'Welcome a friend; describe your room and locate three belongings.', ['home','everyday-objects'], ['spoken-interaction','spoken-production'], [16,17,19,20,21], [6,30,31,32,34]),
    ('plans', 'Arrange a time', 'Explain your day and availability.', 'Describe your morning, then agree on a day and meeting time.', ['routine','work'], ['listening','spoken-interaction','spoken-production'], [23,24,25,26], [8,9,33,34,35,36]),
    ('leisure', 'Make an outing', 'Share interests and simple plans.', 'Name an interest, invite a friend, and describe yesterday briefly.', ['leisure','culture'], ['reading','spoken-interaction','spoken-production'], [28,29,30,31,32,45,46], [10,11,18,37,38,39,40,47,48]),
    ('travel', 'Find your way', 'Navigate a familiar local journey.', 'Read a station sign; ask how to reach a nearby destination.', ['travel'], ['reading','listening','spoken-interaction'], [33,34,35,36,37,38], [7,12,13,17,41,42,43]),
    ('shopping', 'Buy something', 'Complete a small purchase.', 'Find your size, read the price, and request the item.', ['shopping','everyday-objects'], ['reading','listening','spoken-interaction'], [39,40,41,42,43], [14,15,16,19,44,45,46]),
    ('messages', 'Read & write basics', 'Use brief everyday written language.', 'Read a short personal message, fill in your name and country on a form, and write a simple greeting or invitation.', ['school','routine'], ['reading','writing'], [], [1,2,9,20,24,34,35]),
]
milestones = [dict(id=i, title=t, description=d, task=task, topicIds=topic_ids, skills=skills, sourceUrl=cefr if i=='messages' else marugoto, sourceCanDoIds=source_ids, practiceUnitIds=units, evidenceNote=evidence_note) for i,t,d,task,topic_ids,skills,source_ids,units in milestone_specs]
output = root / 'data/jp/dictionary/a1_scope.json'
scope = {
    'schemaVersion': 1, 'version': 'a1-core-2026-09-13',
    'description': 'Authored Kotoba A1 scope: stable learning IDs, reviewed overlapping topics, and an explicit bounded denominator. CEFR/JF alignment is based on communicative tasks, never an official word quota.',
    'completion': {'coreWordCount': len(core_ids), 'learnedPracticeOccasions': 3, 'minimumHoursBetweenOccasions': 24, 'requiresAllMilestones': True, 'certificationClaim': False, 'label': 'Kotoba A1 foundation', 'explanation': 'Core vocabulary practice plus practical Can-do self-checks. Three spaced practice occasions are a progress signal, not proof of recall or an official CEFR result.'},
    'topics': topics, 'milestones': milestones,
    'coreWordIds': core_ids, 'words': metadata,
}
output.write_text(json.dumps(scope, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Authored:', len(words), 'Core:', len(core_ids), 'Alias reductions:', len(words) - len({alias.get(i, i) for i in words}))
print('Core topic sizes:', {t: sum(t in metadata[i]['topicIds'] for i in core_ids) for t in sorted(set().union(*tags.values()))})
