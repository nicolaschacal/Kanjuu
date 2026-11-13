// KANJŪ — currículo del entrenamiento: etapas → secciones → rondas.
// Especificación: docs/CURRICULO.md. Solo datos y su chequeo: el motor de rondas es otra tarea (A-03).
//
// Convenciones:
// - `words` = palabras núcleo de la sección (ids de LEX en js/lang.js). Son las que se evalúan.
// - `phrases` = ids de PHRASES (js/lang.js) o de EXTRA (abajo). Una frase solo usa palabras de su
//   sección o de secciones anteriores.
// - EXTRA son frases propias del currículo: no entran en los hallazgos de viaje.
// - `ja` va segmentada con espacios, como en js/lang.js: cada ficha es una palabra de `ids`
//   (o una conjugación de un verbo) o una partícula de PARTICLES.
// - `reward` = KANJŪ que regala la sección al completarse (o null). `rewardWord` = la palabra que lo
//   contiene: la entrega depende de su dominio. `egg: true` = se entrega como huevo (etapa 0).
// - `rival` = los 3 KANJŪ rivales del combate de examen (docs/CURRICULO.md §6).
// - `intro` = la frase con la que la criatura presenta la sección (en tú).
import { LEX, PHRASES, PATTERNS, PARTICLES } from './lang.js';
import { KANJI } from './data.js';

export const STAGES = [
  { id: 'e0', title: { es: 'Sonidos y kana', en: 'Sounds and kana' }, level: 'kana' },
  { id: 'e1', title: { es: 'Primeros pasos', en: 'First steps' }, level: 'N5' },
  { id: 'e2', title: { es: 'Vida diaria', en: 'Daily life' }, level: 'N5' },
  { id: 'e3', title: { es: 'Ampliar el mundo', en: 'A wider world' }, level: 'N5–N4' },
  { id: 'e4', title: { es: 'Conversación cotidiana', en: 'Everyday conversation' }, level: 'N4' },
];

// Frases propias del currículo.
export const EXTRA = [
  // ── etapa 0 ──
  { id: 'c_ocha', ja: 'おちゃ を ください', ids: ['ocha', 'kudasai'], pat: null, es: 'Un té, por favor.', en: 'Tea, please.' },
  { id: 'c_mizu', ja: 'みず を おねがいします', ids: ['mizu', 'onegaishimasu'], pat: null, es: 'Agua, por favor.', en: 'Water, please.' },
  { id: 'c_kazu1', ja: 'いち に さん', ids: ['ichi', 'ni', 'sankazu'], pat: null, es: 'Uno, dos, tres.', en: 'One, two, three.' },
  { id: 'c_kazu2', ja: 'よん ご ろく なな', ids: ['yon', 'go', 'roku', 'nana'], pat: null, es: 'Cuatro, cinco, seis, siete.', en: 'Four, five, six, seven.' },
  { id: 'c_kazu3', ja: 'はち きゅう じゅう', ids: ['hachi', 'kyuu', 'juu'], pat: null, es: 'Ocho, nueve, diez.', en: 'Eight, nine, ten.' },
  { id: 'c_itadakimasu', ja: 'いただきます', ids: ['itadakimasu'], pat: null, es: '¡Buen provecho!', en: 'Thanks for the meal!' },
  { id: 'c_niku', ja: 'にく を たべます', ids: ['niku', 'tabemasu'], pat: 'masu', es: 'Como carne.', en: 'I eat meat.' },
  { id: 'c_gyuunyuu', ja: 'ぎゅうにゅう を のみます', ids: ['gyuunyuu', 'nomimasu'], pat: 'masu', es: 'Tomo leche.', en: 'I drink milk.' },
  { id: 'c_koohii', ja: 'コーヒー を ください', ids: ['koohii', 'kudasai'], pat: null, es: 'Un café, por favor.', en: 'A coffee, please.' },
  { id: 'c_juusu', ja: 'ジュース を のみます', ids: ['juusu', 'nomimasu'], pat: 'masu', es: 'Tomo jugo.', en: 'I drink juice.' },
  { id: 'c_keeki', ja: 'ケーキ は おいしい です', ids: ['keeki', 'oishii'], pat: 'adj', es: 'El pastel está rico.', en: 'The cake is tasty.' },
  { id: 'c_kafe', ja: 'カフェ で コーヒー を のみます', ids: ['kafe', 'koohii', 'nomimasu'], pat: 'de', es: 'Tomo café en la cafetería.', en: 'I drink coffee at the café.' },
  { id: 'c_uruguai', ja: 'わたし は ウルグアイ の がくせい です', ids: ['watashi', 'uruguai', 'gakusei'], pat: 'no', es: 'Soy estudiante de Uruguay.', en: 'I am a student from Uruguay.' },
  { id: 'c_burajiru', ja: 'おがわ さん は ブラジル の がくせい です', ids: ['ogawa', 'san', 'burajiru', 'gakusei'], pat: 'no', es: 'Ogawa es estudiante de Brasil.', en: 'Ogawa is a student from Brazil.' },
  // ── etapa 1 ──
  { id: 'c_nihonjin', ja: 'たなか さん は にほんじん です', ids: ['tanaka', 'san', 'nihonjin'], pat: 'desu', es: 'El señor Tanaka es japonés.', en: 'Mr. Tanaka is Japanese.' },
  { id: 'c_hito', ja: 'あの ひと は せんせい です', ids: ['ano', 'hito', 'sensei'], pat: 'desu', es: 'Esa persona es profesora.', en: 'That person is a teacher.' },
  { id: 'c_are', ja: 'あれ は なん です か', ids: ['are', 'nan'], pat: 'ka', es: '¿Qué es aquello?', en: 'What is that over there?' },
  { id: 'c_kuchi', ja: 'それ は くち です か', ids: ['sore', 'kuchi'], pat: 'ka', es: '¿Eso es una boca?', en: 'Is that a mouth?' },
  { id: 'c_kaban', ja: 'これ は わたし の かばん です', ids: ['kore', 'watashi', 'kaban'], pat: 'kore', es: 'Esta es mi mochila.', en: 'This is my bag.' },
  { id: 'c_gogo', ja: 'いま ごご に じ はん です', ids: ['ima', 'gogo', 'ni', 'ji', 'han'], pat: 'jikan', es: 'Ahora son las dos y media de la tarde.', en: 'It is half past two in the afternoon.' },
  { id: 'c_man', ja: 'それ は いち まん えん です', ids: ['sore', 'ichi', 'man', 'en'], pat: 'kore', es: 'Eso cuesta diez mil yenes.', en: 'That is ten thousand yen.' },
  { id: 'c_sakana', ja: 'さかな を たべます', ids: ['sakana', 'tabemasu'], pat: 'masu', es: 'Como pescado.', en: 'I eat fish.' },
  { id: 'c_kayoubi', ja: 'きょう は かようび です', ids: ['kyou', 'kayoubi'], pat: 'desu', es: 'Hoy es martes.', en: 'Today is Tuesday.' },
  { id: 'c_kinyoubi', ja: 'あした は きんようび です か', ids: ['ashita', 'kinyoubi'], pat: 'ka', es: '¿Mañana es viernes?', en: 'Is tomorrow Friday?' },
  { id: 'c_densha', ja: 'でんしゃ で がっこう へ いきます', ids: ['densha', 'gakkou', 'ikimasu'], pat: 'de', es: 'Voy a la escuela en tren.', en: 'I go to school by train.' },
  { id: 'c_kuruma', ja: 'くるま で えき へ いきます', ids: ['kuruma', 'eki', 'ikimasu'], pat: 'de', es: 'Voy a la estación en auto.', en: 'I go to the station by car.' },
  { id: 'c_kimasu', ja: 'ともだち が いえ に きます', ids: ['tomodachi', 'ie', 'kimasu'], pat: 'ni', es: 'Un amigo viene a casa.', en: 'A friend comes to my house.' },
  { id: 'c_ookii', ja: 'いぬ は とても おおきい です', ids: ['inu', 'totemo', 'ookii'], pat: 'adj', es: 'El perro es muy grande.', en: 'The dog is very big.' },
  { id: 'c_chiisai', ja: 'ねこ は ちいさい です', ids: ['neko', 'chiisai'], pat: 'adj', es: 'El gato es pequeño.', en: 'The cat is small.' },
  { id: 'c_shita', ja: 'つくえ の した に いぬ が います', ids: ['tsukue', 'shita', 'inu', 'imasu'], pat: 'arimasu', es: 'Debajo del escritorio hay un perro.', en: 'There is a dog under the desk.' },
  { id: 'c_mae', ja: 'えき の まえ に みせ が あります', ids: ['eki', 'mae', 'mise', 'arimasu'], pat: 'arimasu', es: 'Delante de la estación hay una tienda.', en: 'There is a shop in front of the station.' },
  { id: 'c_ushiro', ja: 'いえ の うしろ に にわ が あります', ids: ['ie', 'ushiro', 'niwa', 'arimasu'], pat: 'arimasu', es: 'Detrás de la casa hay un jardín.', en: 'There is a garden behind the house.' },
];

const T = (es, en) => ({ es, en });
export const SECTIONS = [
  // ───────── Etapa 0 · Sonidos y kana ─────────
  { id: '0.1', stage: 'e0', title: T('Saludar a tu KANJŪ', 'Greet your KANJŪ'), cando: T('Puedo saludar y agradecer', 'I can greet and say thanks'),
    intro: T('¡Hola! Quiero aprender a saludar como en Japón. ¿Me ayudas?', 'Hi! I want to learn to greet like in Japan. Will you help me?'),
    kana: 'あいうえおかきくけこ', words: ['konnichiwa', 'arigatou', 'ohayou', 'hai', 'iie', 'sumimasen', 'douzo', 'doumo', 'sayounara'],
    phrases: ['p_arigatou', 'p_ohayou', 'p_douzo', 'p_doumo'], pats: [], kanji: [], reward: null, rival: ['人', '口', '日'] },
  { id: '0.2', stage: 'e0', title: T('Pedir algo para tomar', 'Order a drink'), cando: T('Puedo pedir algo por favor', 'I can ask for something politely'),
    intro: T('Tengo sed… ¿Cómo se pide un té?', "I'm thirsty… How do you ask for tea?"),
    kana: 'さしすせそたちつてと', words: ['ocha', 'mizu', 'kudasai', 'onegaishimasu', 'kore', 'sore', 'nomimasu', 'oishii'],
    phrases: ['p_kudasai', 'p_mizu', 'c_ocha', 'c_mizu'], pats: [], kanji: [], reward: '茶', rewardWord: 'ocha', egg: true, rival: ['水', '木', '火'] },
  { id: '0.3', stage: 'e0', title: T('Decir tu nombre', 'Say your name'), cando: T('Puedo presentarme', 'I can introduce myself'),
    intro: T('Todavía no sé cómo te llamas. ¿Me lo dices en japonés?', "I still don't know your name. Will you tell me in Japanese?"),
    kana: 'なにぬねのはひふへほ', words: ['watashi', 'namae', 'san', 'hajimemashite', 'yoroshiku', 'ogawa', 'yamashita', 'gakusei'],
    phrases: ['p_hajimemashite', 'p_yoroshiku', 'p_konnichiwa', 'p_gakusei', 'p_namae'], pats: ['desu', 'no'], kanji: [], reward: '名', rewardWord: 'namae', egg: true, rival: ['女', '子', '人'] },
  { id: '0.4', stage: 'e0', title: T('Contar del 1 al 10', 'Count from 1 to 10'), cando: T('Puedo contar hasta diez', 'I can count to ten'),
    intro: T('¿Cuántas hojas hay en el santuario? Contemos juntos.', "How many leaves are in the sanctuary? Let's count together."),
    kana: 'まみむめもやゆよらりるれろわをん', words: ['ichi', 'ni', 'sankazu', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu', 'juu'],
    phrases: ['c_kazu1', 'c_kazu2', 'c_kazu3'], pats: [], kanji: [], reward: '一', rewardWord: 'ichi', egg: true, rival: ['二', '三', '四'] },
  { id: '0.5', stage: 'e0', title: T('Comida de casa', 'Home cooking'), cando: T('Puedo nombrar comidas de todos los días', 'I can name everyday foods'),
    intro: T('¡Huele rico! ¿Qué hay para comer hoy?', 'Something smells good! What is there to eat today?'),
    kana: 'がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽゃゅょっ', words: ['gohan', 'tabemasu', 'gyuunyuu', 'itadakimasu', 'sakana', 'niku', 'yasai', 'tamago'],
    phrases: ['p_gohan', 'c_itadakimasu', 'c_niku', 'c_gyuunyuu'], pats: ['masu'], kanji: [], reward: null, rival: ['米', '肉', '魚'] },
  { id: '0.6', stage: 'e0', title: T('El café del pueblo', 'The village café'), cando: T('Puedo leer un menú en katakana', 'I can read a menu in katakana'),
    intro: T('Abrieron una cafetería nueva. El menú está en katakana…', 'A new café opened. The menu is in katakana…'),
    kana: 'アイウエオカキクケコサシスセソタチツテトナニヌネノ', words: ['koohii', 'pan', 'juusu', 'keeki', 'kafe', 'oishii', 'kudasai', 'nomimasu'],
    phrases: ['p_oishii', 'c_koohii', 'c_juusu', 'c_keeki', 'c_kafe'], pats: ['adj', 'de'], kanji: [], reward: null, rival: ['品', '店', '円'] },
  { id: '0.7', stage: 'e0', title: T('Países y nombres', 'Countries and names'), cando: T('Puedo decir de dónde soy', 'I can say where I am from'),
    intro: T('Llegaron viajeros de muchos países. ¿De dónde vienen?', 'Travelers came from many countries. Where are they from?'),
    kana: 'ハヒフヘホマミムメモヤユヨラリルレロワヲンー', words: ['nihon', 'uruguai', 'amerika', 'supein', 'mekishiko', 'burajiru', 'kuni', 'namae'],
    phrases: ['c_uruguai', 'c_burajiru'], pats: [], kanji: [], reward: null, rival: ['国', '人', '名'] },
  { id: '0.8', stage: 'e0', title: T('Tu KANJŪ lee su primer cartel', 'Your KANJŪ reads its first sign'), cando: T('Puedo leer carteles en kana', 'I can read signs in kana'),
    intro: T('¡Mira ese cartel! Creo que ya podemos leerlo.', 'Look at that sign! I think we can read it now.'),
    review: true, kana: '', words: ['sumimasen', 'arigatou', 'ocha', 'koohii', 'pan', 'juusu', 'mizu', 'kudasai'],
    phrases: ['p_doumo', 'c_ocha', 'c_koohii', 'p_oishii'], pats: [], kanji: [], reward: null, rival: ['口', '日', '月'] },

  // ───────── Etapa 1 · Primeros pasos ─────────
  { id: '1.1', stage: 'e1', title: T('De dónde soy', 'Where I am from'), cando: T('Puedo decir quién soy y de dónde vengo', 'I can say who I am and where I come from'),
    intro: T('Quiero contarle a todos de dónde vienes.', 'I want to tell everyone where you come from.'),
    words: ['watashi', 'nihon', 'nihonjin', 'kuni', 'hito', 'gakusei', 'sensei', 'tomodachi', 'tanaka', 'ano'],
    phrases: ['p_gakusei', 'p_gakuseika', 'p_tomodachi', 'c_nihonjin', 'c_hito'], pats: ['desu', 'ka', 'no'],
    kanji: ['私', '人', '日', '本', '国'], reward: '本', rewardWord: 'nihon', rival: ['人', '日', '国'] },
  { id: '1.2', stage: 'e1', title: T('¿Qué es esto?', 'What is this?'), cando: T('Puedo preguntar qué es algo', 'I can ask what something is'),
    intro: T('Encontré cosas raras en el camino. ¿Qué son?', 'I found strange things on the way. What are they?'),
    words: ['kore', 'sore', 'are', 'nan', 'hon', 'kaban', 'me', 'kuchi'],
    phrases: ['p_senseinohon', 'c_are', 'c_kuchi', 'c_kaban'], pats: ['kore'],
    kanji: ['何', '口', '目'], reward: '口', rewardWord: 'kuchi', rival: ['目', '何', '見'] },
  { id: '1.3', stage: 'e1', title: T('Decir la hora', 'Tell the time'), cando: T('Puedo preguntar y decir la hora', 'I can ask and tell the time'),
    intro: T('¿Qué hora es? No quiero llegar tarde a entrenar.', "What time is it? I don't want to be late for training."),
    words: ['ima', 'ji', 'han', 'gozen', 'gogo', 'kyou', 'ashita', 'nan'],
    phrases: ['p_nanji', 'p_sanji', 'p_hachijihan', 'c_gogo'], pats: ['jikan'],
    kanji: ['時', '半', '二', '三', '四', '五', '六', '七', '八', '九', '十'], reward: '時', rewardWord: 'ji', rival: ['半', '分', '午'] },
  { id: '1.4', stage: 'e1', title: T('Precios en el mercado', 'Prices at the market'), cando: T('Puedo preguntar un precio', 'I can ask a price'),
    intro: T('¡Cuántos puestos! ¿Cuánto cuesta cada cosa?', 'So many stalls! How much is each thing?'),
    words: ['ikura', 'en', 'hyaku', 'sen', 'man', 'mise', 'okane', 'kudasai'],
    phrases: ['p_ikura', 'p_gohyaku', 'p_nisen', 'c_man'], pats: [],
    kanji: ['百', '千', '万', '円'], reward: '円', rewardWord: 'en', rival: ['百', '千', '万'] },
  { id: '1.5', stage: 'e1', title: T('Comer y beber', 'Eat and drink'), cando: T('Puedo decir qué como y qué bebo', 'I can say what I eat and drink'),
    intro: T('Después de entrenar me da hambre. ¿Qué comemos?', "Training makes me hungry. What shall we eat?"),
    words: ['tabemasu', 'nomimasu', 'nani', 'mizu', 'ocha', 'gohan', 'sakana', 'niku', 'pan'],
    phrases: ['p_gohan', 'p_mizu', 'p_nani', 'p_oishii', 'c_sakana'], pats: ['masu'],
    kanji: ['食', '飲', '水'], reward: '食', rewardWord: 'tabemasu', rival: ['飲', '水', '米'] },
  { id: '1.6', stage: 'e1', title: T('Los días de la semana', 'Days of the week'), cando: T('Puedo decir qué día es', 'I can say what day it is'),
    intro: T('¡Los días de la semana llevan nuestros nombres! Luna, fuego, agua, árbol…', 'The days of the week carry our names! Moon, fire, water, tree…'),
    words: ['nichiyoubi', 'getsuyoubi', 'kayoubi', 'suiyoubi', 'mokuyoubi', 'kinyoubi', 'doyoubi', 'kyou', 'ashita'],
    phrases: ['p_nichiyoubi', 'p_getsuyoubi', 'c_kayoubi', 'c_kinyoubi'], pats: [],
    kanji: ['月', '火', '木', '金', '土', '曜'], reward: null, rival: ['月', '火', '金'] },
  { id: '1.7', stage: 'e1', title: T('Ir y volver', 'Going and coming back'), cando: T('Puedo decir adónde voy y cómo', 'I can say where I am going and how'),
    intro: T('Hoy salimos de paseo. ¿Adónde vamos?', 'We are going out today. Where are we going?'),
    words: ['ikimasu', 'kimasu', 'kaerimasu', 'doko', 'gakkou', 'eki', 'densha', 'kuruma', 'ie', 'machi'],
    phrases: ['p_doko', 'p_gakkou', 'p_kaerimasu', 'c_densha', 'c_kuruma', 'c_kimasu'], pats: ['ni', 'de'],
    kanji: ['行', '来', '帰', '車'], reward: '車', rewardWord: 'kuruma', rival: ['行', '来', '道'] },
  { id: '1.8', stage: 'e1', title: T('Lo que me gusta', 'What I like'), cando: T('Puedo decir qué me gusta y describirlo', 'I can say what I like and describe it'),
    intro: T('A mí me gustan los gatos. ¿Y a ti?', 'I like cats. What about you?'),
    words: ['suki', 'ookii', 'chiisai', 'totemo', 'inu', 'neko', 'kawaii', 'doubutsu'],
    phrases: ['p_sakana', 'p_kawaii', 'p_doubutsu', 'c_ookii', 'c_chiisai'], pats: ['suki', 'adj'],
    kanji: ['好', '大', '小'], reward: '好', rewardWord: 'suki', rival: ['大', '小', '犬'] },
  { id: '1.9', stage: 'e1', title: T('Mi familia', 'My family'), cando: T('Puedo presentar a mi familia', 'I can introduce my family'),
    intro: T('Tengo hermanos KANJŪ por todo el mundo. ¿Y tu familia?', 'I have KANJŪ siblings all over the world. What about your family?'),
    words: ['kazoku', 'chichi', 'haha', 'ani', 'otouto', 'ane', 'imouto', 'kodomo', 'otousan', 'okaasan', 'futari'],
    phrases: ['p_kazoku', 'p_chichihaha', 'p_aniotouto', 'p_kodomo', 'p_ocha'], pats: ['mo'],
    kanji: ['父', '母', '兄', '弟', '姉', '妹'], reward: '弟', rewardWord: 'otouto', rival: ['兄', '姉', '妹'] },
  { id: '1.10', stage: 'e1', title: T('¿Dónde está?', 'Where is it?'), cando: T('Puedo decir qué hay y dónde', 'I can say what there is and where'),
    intro: T('Perdí mi pelota. ¿Me ayudas a buscarla?', 'I lost my ball. Will you help me find it?'),
    words: ['arimasu', 'imasu', 'ue', 'shita', 'naka', 'mae', 'ushiro', 'heya', 'tsukue', 'niwa'],
    phrases: ['p_heya', 'p_ue', 'p_kaban', 'p_neko', 'c_shita', 'c_mae', 'c_ushiro'], pats: ['arimasu'],
    kanji: ['上', '下', '中', '前', '後'], reward: '中', rewardWord: 'naka', rival: ['上', '下', '前'] },
];

// Situaciones con diálogo (propuesta A-02, pantalla 3): un KANJŪ vecino o de la familia dice algo y el jugador
// elige qué contestar. `opts[0]` es la respuesta correcta (se mezclan al mostrarse). Una por sección.
// Mismas reglas que las frases: fichas = palabras de `ids` (o su conjugación) o partículas; palabras ya vistas.
const O = (ja, ids) => ({ ja, ids });
export const TALKS = {
  '0.1': { who: '人', ja: 'こんにちは', ids: ['konnichiwa'], es: '¡Hola!', en: 'Hello!', hint: T('Te saluda al llegar.', 'They greet you as they arrive.'),
    opts: [O('こんにちは', ['konnichiwa']), O('さようなら', ['sayounara']), O('すみません', ['sumimasen'])] },
  '0.2': { who: '店', ja: 'どうぞ', ids: ['douzo'], es: 'Aquí tienes.', en: 'Here you are.', hint: T('Te alcanza un té.', 'They hand you a tea.'),
    opts: [O('ありがとう', ['arigatou']), O('さようなら', ['sayounara']), O('いいえ', ['iie'])] },
  '0.3': { who: '女', ja: 'はじめまして やました です', ids: ['hajimemashite', 'yamashita'], es: 'Mucho gusto, soy Yamashita.', en: 'Nice to meet you, I am Yamashita.', hint: T('Preséntate: hoy eres Ogawa.', 'Introduce yourself: today you are Ogawa.'),
    opts: [O('はじめまして おがわ です', ['hajimemashite', 'ogawa']), O('さようなら', ['sayounara']), O('おちゃ を ください', ['ocha', 'kudasai'])] },
  '0.4': { who: '子', ja: 'いち に さん', ids: ['ichi', 'ni', 'sankazu'], es: 'Uno, dos, tres…', en: 'One, two, three…', hint: T('Sigue contando.', 'Keep counting.'),
    opts: [O('よん', ['yon']), O('ろく', ['roku']), O('はち', ['hachi'])] },
  '0.5': { who: '母', ja: 'ごはん です', ids: ['gohan'], es: '¡A comer!', en: 'Dinner is ready!', hint: T('¿Qué se dice antes de comer?', 'What do you say before eating?'),
    opts: [O('いただきます', ['itadakimasu']), O('さようなら', ['sayounara']), O('おはよう', ['ohayou'])] },
  '0.6': { who: '店', ja: 'どうぞ ケーキ です', ids: ['douzo', 'keeki'], es: 'Aquí tienes, un pastel.', en: 'Here you are, a cake.', hint: T('Agradécele.', 'Thank them.'),
    opts: [O('ありがとう ございます', ['arigatou']), O('いいえ', ['iie']), O('こんにちは', ['konnichiwa'])] },
  '0.7': { who: '人', ja: 'ウルグアイ の がくせい です か', ids: ['uruguai', 'gakusei'], es: '¿Eres estudiante de Uruguay?', en: 'Are you a student from Uruguay?', hint: T('Contesta que sí.', 'Say yes.'),
    opts: [O('はい ウルグアイ の がくせい です', ['hai', 'uruguai', 'gakusei']), O('おちゃ を ください', ['ocha', 'kudasai']), O('いただきます', ['itadakimasu'])] },
  '0.8': { who: '店', ja: 'どうぞ ジュース です', ids: ['douzo', 'juusu'], es: 'Aquí tienes, un jugo.', en: 'Here you are, a juice.', hint: T('Agradécele mucho.', 'Thank them a lot.'),
    opts: [O('どうも ありがとう', ['doumo', 'arigatou']), O('おはよう', ['ohayou']), O('さようなら', ['sayounara'])] },
  '1.1': { who: '人', ja: 'たなか さん は にほんじん です か', ids: ['tanaka', 'san', 'nihonjin'], es: '¿El señor Tanaka es japonés?', en: 'Is Mr. Tanaka Japanese?', hint: T('Sí, lo es.', 'Yes, he is.'),
    opts: [O('はい にほんじん です', ['hai', 'nihonjin']), O('いいえ ケーキ です', ['iie', 'keeki']), O('おちゃ を ください', ['ocha', 'kudasai'])] },
  '1.2': { who: '目', ja: 'これ は なん です か', ids: ['kore', 'nan'], es: '¿Qué es esto?', en: 'What is this?', hint: T('Te muestra una mochila.', 'They show you a bag.'),
    opts: [O('それ は かばん です', ['sore', 'kaban']), O('いいえ がくせい です', ['iie', 'gakusei']), O('いただきます', ['itadakimasu'])] },
  '1.3': { who: '時', ja: 'いま なん じ です か', ids: ['ima', 'nan', 'ji'], es: '¿Qué hora es?', en: 'What time is it?', hint: T('Son las tres.', "It is three o'clock."),
    opts: [O('さん じ です', ['sankazu', 'ji']), O('はち じ はん です', ['hachi', 'ji', 'han']), O('ごぜん です', ['gozen'])] },
  '1.4': { who: '店', ja: 'それ は ご ひゃく えん です', ids: ['sore', 'go', 'hyaku', 'en'], es: 'Eso cuesta quinientos yenes.', en: 'That is five hundred yen.', hint: T('Te lo llevas.', 'You will take it.'),
    opts: [O('これ を ください', ['kore', 'kudasai']), O('おはよう ございます', ['ohayou']), O('それ は ほん です', ['sore', 'hon'])] },
  '1.5': { who: '母', ja: 'なに を たべます か', ids: ['nani', 'tabemasu'], es: '¿Qué vas a comer?', en: 'What will you eat?', hint: T('Quieres pescado.', 'You want fish.'),
    opts: [O('さかな を たべます', ['sakana', 'tabemasu']), O('みず を のみます', ['mizu', 'nomimasu']), O('ごはん です', ['gohan'])] },
  '1.6': { who: '月', ja: 'あした は きんようび です か', ids: ['ashita', 'kinyoubi'], es: '¿Mañana es viernes?', en: 'Is tomorrow Friday?', hint: T('Sí, lo es.', 'Yes, it is.'),
    opts: [O('はい きんようび です', ['hai', 'kinyoubi']), O('いいえ さん じ です', ['iie', 'sankazu', 'ji']), O('いただきます', ['itadakimasu'])] },
  '1.7': { who: '車', ja: 'どこ へ いきます か', ids: ['doko', 'ikimasu'], es: '¿Adónde vas?', en: 'Where are you going?', hint: T('Vas a la escuela.', 'You are going to school.'),
    opts: [O('がっこう へ いきます', ['gakkou', 'ikimasu']), O('でんしゃ です', ['densha']), O('いえ に かえりました', ['ie', 'kaerimasu'])] },
  '1.8': { who: '犬', ja: 'ねこ が すき です か', ids: ['neko', 'suki'], es: '¿Te gustan los gatos?', en: 'Do you like cats?', hint: T('Sí, te gustan.', 'Yes, you do.'),
    opts: [O('はい すき です', ['hai', 'suki']), O('いいえ おおきい です', ['iie', 'ookii']), O('さようなら', ['sayounara'])] },
  '1.9': { who: '姉', ja: 'あの ひと は あに です か', ids: ['ano', 'hito', 'ani'], es: '¿Esa persona es tu hermano mayor?', en: 'Is that person your older brother?', hint: T('No: es tu hermano menor.', 'No: it is your younger brother.'),
    opts: [O('いいえ おとうと です', ['iie', 'otouto']), O('はい あね です', ['hai', 'ane']), O('いもうと が すき です', ['imouto', 'suki'])] },
  '1.10': { who: '犬', ja: 'ねこ は どこ です か', ids: ['neko', 'doko'], es: '¿Dónde está el gato?', en: 'Where is the cat?', hint: T('Está debajo del escritorio.', 'It is under the desk.'),
    opts: [O('つくえ の した に います', ['tsukue', 'shita', 'imasu']), O('いえ の まえ に あります', ['ie', 'mae', 'arimasu']), O('さん じ です', ['sankazu', 'ji'])] },
};

export const sectionById = id => SECTIONS.find(s => s.id === id);
export const phraseById = id => PHRASES.find(p => p.id === id) || EXTRA.find(p => p.id === id);
export const nextSection = id => SECTIONS[SECTIONS.findIndex(s => s.id === id) + 1] || null;

// ---------- Chequeo (docs/CURRICULO.md §3). Devuelve la lista de errores. ----------
const VERB_ENDS = ['ます', 'ました', 'ません', 'ませんでした'];
export function checkCurriculum() {
  const errs = [];
  const lex = Object.fromEntries(LEX.map(w => [w.id, w]));
  const pats = new Set(PATTERNS.map(p => p.id)), stages = new Set(STAGES.map(s => s.id));
  const forms = w => w.kind === 'v' ? VERB_ENDS.map(e => w.kana.slice(0, -2) + e) : [w.kana];
  const ids = new Set(), extraIds = new Set(), rewards = {};

  for (const p of EXTRA) {
    if (extraIds.has(p.id) || PHRASES.some(q => q.id === p.id)) errs.push(`EXTRA ${p.id}: id repetido`);
    extraIds.add(p.id);
    if (!/^c_[a-z0-9]+$/.test(p.id)) errs.push(`EXTRA ${p.id}: el id debe empezar con c_`);
    if (!p.es || !p.en) errs.push(`EXTRA ${p.id}: falta traducción`);
    if (p.pat !== null && !pats.has(p.pat)) errs.push(`EXTRA ${p.id}: patrón desconocido ${p.pat}`);
    const words = p.ids.map(id => lex[id]);
    p.ids.forEach((id, i) => { if (!words[i]) errs.push(`EXTRA ${p.id}: la palabra ${id} no existe en LEX`); });
    const used = new Set();
    for (const tok of p.ja.split(' ')) {
      const hit = words.filter(w => w && forms(w).includes(tok));
      if (hit.length) hit.forEach(w => used.add(w.id));
      else if (!PARTICLES.includes(tok)) errs.push(`EXTRA ${p.id}: la ficha «${tok}» no es una palabra de ids ni una partícula`);
    }
    p.ids.forEach(id => { if (lex[id] && !used.has(id)) errs.push(`EXTRA ${p.id}: ${id} está en ids pero no en ja`); });
  }

  const seen = new Set(); // palabras de esta sección y de las anteriores
  let prevStage = -1;
  const usedExtra = new Set();
  for (const s of SECTIONS) {
    const where = `Sección ${s.id}`;
    if (ids.has(s.id)) errs.push(`${where}: id repetido`);
    ids.add(s.id);
    const si = STAGES.findIndex(x => x.id === s.stage);
    if (!stages.has(s.stage)) errs.push(`${where}: etapa desconocida ${s.stage}`);
    if (si < prevStage) errs.push(`${where}: fuera del orden de etapas`);
    prevStage = si;
    for (const f of ['title', 'cando', 'intro']) if (!s[f]?.es || !s[f]?.en) errs.push(`${where}: falta ${f}`);
    if (s.words.length < 8 || s.words.length > 20) errs.push(`${where}: ${s.words.length} palabras núcleo (se esperan 8–20)`);
    const minP = s.stage === 'e0' ? 2 : 3;
    if (s.phrases.length < minP) errs.push(`${where}: ${s.phrases.length} frases (mínimo ${minP})`);
    s.words.forEach(id => { if (!lex[id]) errs.push(`${where}: la palabra ${id} no existe en LEX`); else seen.add(id); });
    for (const pid of s.phrases) {
      const p = phraseById(pid);
      if (!p) { errs.push(`${where}: la frase ${pid} no existe`); continue; }
      if (extraIds.has(pid)) usedExtra.add(pid);
      const late = p.ids.filter(id => !seen.has(id));
      if (late.length) errs.push(`${where}: la frase ${pid} usa palabras de secciones posteriores (${late.join(', ')})`);
    }
    s.pats.forEach(pt => { if (!pats.has(pt)) errs.push(`${where}: patrón desconocido ${pt}`); });
    // Cada kanji se enseña dentro de una palabra de esta sección o de una anterior.
    const written = [...seen].map(id => lex[id]?.kanji || '').join('');
    s.kanji.forEach(k => { if (!written.includes(k)) errs.push(`${where}: el kanji ${k} no aparece en ninguna palabra hasta esta sección`); });
    if (s.reward) {
      if (!KANJI[s.reward]) errs.push(`${where}: la recompensa ${s.reward} no está en el roster (KANJI)`);
      if (!s.words.includes(s.rewardWord)) errs.push(`${where}: rewardWord ${s.rewardWord} no es una palabra núcleo de la sección`);
      else if (!(lex[s.rewardWord]?.kanji || '').includes(s.reward)) errs.push(`${where}: ${s.reward} no aparece en la forma escrita de ${s.rewardWord}`);
      if (rewards[s.reward]) errs.push(`${where}: ${s.reward} ya es recompensa de la sección ${rewards[s.reward]}`);
      rewards[s.reward] = s.id;
      if (s.egg && s.stage !== 'e0') errs.push(`${where}: los huevos son solo de la etapa 0`);
    }
    if (!Array.isArray(s.rival) || s.rival.length !== 3) errs.push(`${where}: se esperan 3 rivales`);
    else s.rival.forEach(k => { if (!KANJI[k]) errs.push(`${where}: el rival ${k} no está en el roster`); });
    if (s.stage === 'e0' && s.kana === undefined) errs.push(`${where}: falta kana`);
  }
  EXTRA.forEach(p => { if (!usedExtra.has(p.id)) errs.push(`EXTRA ${p.id}: ninguna sección la usa`); });

  // Diálogos: fichas válidas y solo palabras de su sección o de las anteriores
  const tokOk = (where, ja, ids) => {
    const ws = ids.map(id => lex[id]);
    ids.forEach((id, i) => { if (!ws[i]) errs.push(`${where}: la palabra ${id} no existe en LEX`); });
    const used = new Set();
    for (const tok of ja.split(' ')) {
      const hit = ws.filter(w => w && forms(w).includes(tok));
      if (hit.length) hit.forEach(w => used.add(w.id)); else if (!PARTICLES.includes(tok)) errs.push(`${where}: la ficha «${tok}» no es una palabra de ids ni una partícula`);
    }
    ids.forEach(id => { if (lex[id] && !used.has(id)) errs.push(`${where}: ${id} está en ids pero no en ja`); });
  };
  const upTo = new Set();
  for (const s of SECTIONS) {
    s.words.forEach(id => upTo.add(id));
    const d = TALKS[s.id], where = `Diálogo ${s.id}`;
    if (!d) { errs.push(`${where}: falta`); continue; }
    if (!KANJI[d.who]) errs.push(`${where}: ${d.who} no está en el roster`);
    if (!d.es || !d.en || !d.hint?.es || !d.hint?.en) errs.push(`${where}: falta traducción o pista`);
    if (!Array.isArray(d.opts) || d.opts.length !== 3) errs.push(`${where}: se esperan 3 respuestas`);
    [d, ...(d.opts || [])].forEach((x, i) => {
      tokOk(`${where}${i ? `, respuesta ${i}` : ''}`, x.ja, x.ids);
      const late = x.ids.filter(id => !upTo.has(id));
      if (late.length) errs.push(`${where}${i ? `, respuesta ${i}` : ''}: usa palabras de secciones posteriores (${late.join(', ')})`);
    });
    if (new Set(d.opts.map(o => o.ja)).size !== d.opts.length) errs.push(`${where}: respuestas repetidas`);
  }
  return errs;
}
