// KANJŪ — contenido de lengua japonesa (etapas E0–E1 de la biblia pedagógica).
// Especificación: docs/APRENDIZAJE.md §1. Solo datos: sin romaji (sale de romaji() en js/help.js).
//
// Convenciones:
// - Los verbos se guardan en forma ます (la forma cortés es la primera que se enseña).
// - `ja` va segmentada con espacios: cada ficha es una palabra de LEX (su `kana` exacto),
//   una forma conjugada de un verbo de LEX (ました · ません) o una partícula de PARTICLES.
// - Dentro de cada situación las palabras van en el orden en que se hallan, y las frases
//   van ordenadas por su palabra más tardía: cuando el jugador halla esa palabra, el resto
//   de la frase ya está en su diario (una sola novedad por frase).

// Una situación por región de REGIONS (js/data.js), mismo id y mismo orden.
export const SITUATIONS = [
  { id: 'forest', title: { es: 'Saludar', en: 'Greetings' }, cando: { es: 'Puedo saludar, agradecer y disculparme', en: 'I can greet, thank and apologize' } },
  { id: 'hill', title: { es: 'Presentarse y la hora', en: 'Introductions and time' }, cando: { es: 'Puedo presentarme y decir la hora y el día', en: 'I can introduce myself and tell the time and the day' } },
  { id: 'valley', title: { es: 'Familia y personas', en: 'Family and people' }, cando: { es: 'Puedo hablar de mi familia y presentar a alguien', en: 'I can talk about my family and introduce someone' } },
  { id: 'spring', title: { es: 'Comida y gustos', en: 'Food and likes' }, cando: { es: 'Puedo decir qué como, qué bebo y qué me gusta', en: 'I can say what I eat, what I drink and what I like' } },
  { id: 'post', title: { es: 'Compras y ciudad', en: 'Shopping and town' }, cando: { es: 'Puedo preguntar un precio, comprar y decir adónde voy', en: 'I can ask a price, buy something and say where I am going' } },
  { id: 'ruins', title: { es: 'Objetos y estudio', en: 'Things and study' }, cando: { es: 'Puedo decir qué hay y dónde, y hablar de estudio y trabajo', en: 'I can say what there is and where, and talk about study and work' } },
  { id: 'ranch', title: { es: 'Animales y campo', en: 'Animals and the countryside' }, cando: { es: 'Puedo decir qué animales hay y hablar del campo', en: 'I can say which animals there are and talk about the countryside' } },
  { id: 'lake', title: { es: 'Clima y direcciones', en: 'Weather and directions' }, cando: { es: 'Puedo hablar del clima y decir dónde queda un lugar', en: 'I can talk about the weather and say where a place is' } },
  { id: 'shrine', title: { es: 'Rutina diaria', en: 'Daily routine' }, cando: { es: 'Puedo contar mi día y lo que hice ayer', en: 'I can describe my day and what I did yesterday' } },
];

// Palabras, en el orden en que se hallan dentro de su situación.
// kind: 'expr' | 'n' | 'v' | 'adj' | 'num' | 'q'  (adverbios y conectores van como 'expr')
export const LEX = [
  // ── forest · Saludar ──
  { id: 'konnichiwa', kana: 'こんにちは', kanji: null, es: 'hola · buenas tardes', en: 'hello · good afternoon', sit: 'forest', kind: 'expr' },
  { id: 'arigatou', kana: 'ありがとう', kanji: null, es: 'gracias', en: 'thank you', sit: 'forest', kind: 'expr' },
  { id: 'ohayou', kana: 'おはよう', kanji: null, es: 'buenos días', en: 'good morning', sit: 'forest', kind: 'expr' },
  { id: 'hai', kana: 'はい', kanji: null, es: 'sí', en: 'yes', sit: 'forest', kind: 'expr' },
  { id: 'iie', kana: 'いいえ', kanji: null, es: 'no', en: 'no', sit: 'forest', kind: 'expr' },
  { id: 'sumimasen', kana: 'すみません', kanji: null, es: 'disculpa · perdón', en: 'excuse me · sorry', sit: 'forest', kind: 'expr' },
  { id: 'san', kana: 'さん', kanji: null, es: 'señor · señora (tras el nombre)', en: 'Mr. · Ms. (after a name)', sit: 'forest', kind: 'expr' },
  { id: 'yamashita', kana: 'やました', kanji: '山下', es: 'Yamashita (apellido)', en: 'Yamashita (surname)', sit: 'forest', kind: 'n' },
  { id: 'douzo', kana: 'どうぞ', kanji: null, es: 'adelante · aquí tienes', en: 'go ahead · here you are', sit: 'forest', kind: 'expr' },
  { id: 'doumo', kana: 'どうも', kanji: null, es: 'muchas (gracias) · de veras', en: 'very much · really', sit: 'forest', kind: 'expr' },
  { id: 'hajimemashite', kana: 'はじめまして', kanji: null, es: 'mucho gusto', en: 'nice to meet you', sit: 'forest', kind: 'expr' },
  { id: 'ogawa', kana: 'おがわ', kanji: '小川', es: 'Ogawa (apellido)', en: 'Ogawa (surname)', sit: 'forest', kind: 'n' },
  { id: 'yoroshiku', kana: 'よろしく', kanji: null, es: 'encantado · cuento contigo', en: 'pleased to meet you', sit: 'forest', kind: 'expr' },
  { id: 'onegaishimasu', kana: 'おねがいします', kanji: 'お願いします', es: 'por favor', en: 'please', sit: 'forest', kind: 'expr' },
  { id: 'jaa', kana: 'じゃあ', kanji: null, es: 'bueno · entonces', en: 'well then', sit: 'forest', kind: 'expr' },
  { id: 'mata', kana: 'また', kanji: null, es: 'otra vez · hasta luego', en: 'again · see you', sit: 'forest', kind: 'expr' },
  { id: 'genki', kana: 'げんき', kanji: '元気', es: 'bien · con energía', en: 'well · energetic', sit: 'forest', kind: 'adj' },
  { id: 'konbanwa', kana: 'こんばんは', kanji: null, es: 'buenas noches (al llegar)', en: 'good evening', sit: 'forest', kind: 'expr' },
  { id: 'sayounara', kana: 'さようなら', kanji: null, es: 'adiós', en: 'goodbye', sit: 'forest', kind: 'expr' },
  { id: 'oyasuminasai', kana: 'おやすみなさい', kanji: null, es: 'buenas noches (al ir a dormir)', en: 'good night', sit: 'forest', kind: 'expr' },
  { id: 'itadakimasu', kana: 'いただきます', kanji: null, es: 'buen provecho (antes de comer)', en: 'thanks for the meal (before eating)', sit: 'forest', kind: 'expr' },
  { id: 'gomennasai', kana: 'ごめんなさい', kanji: null, es: 'lo siento', en: 'I am sorry', sit: 'forest', kind: 'expr' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'sou', kana: 'そう', kanji: null, es: 'así (はい そう です: sí, así es)', en: 'so · that way (はい そう です: yes, that is right)', sit: 'forest', kind: 'expr' },
  { id: 'dochira', kana: 'どちら', kanji: null, es: 'dónde · cuál (cortés)', en: 'where · which (polite)', sit: 'forest', kind: 'q' },
  { id: 'kono', kana: 'この', kanji: null, es: 'este · esta (antes de un nombre)', en: 'this (before a noun)', sit: 'forest', kind: 'n' },
  { id: 'sono', kana: 'その', kanji: null, es: 'ese · esa (antes de un nombre)', en: 'that (before a noun)', sit: 'forest', kind: 'n' },
  { id: 'gochisousama', kana: 'ごちそうさま', kanji: null, es: 'gracias por la comida (al terminar)', en: 'thanks for the meal (after eating)', sit: 'forest', kind: 'expr' },
  { id: 'koko', kana: 'ここ', kanji: null, es: 'aquí', en: 'here', sit: 'forest', kind: 'n' },
  { id: 'soko', kana: 'そこ', kanji: null, es: 'ahí', en: 'there (near you)', sit: 'forest', kind: 'n' },
  { id: 'asoko', kana: 'あそこ', kanji: null, es: 'allá', en: 'over there', sit: 'forest', kind: 'n' },
  { id: 'tonari', kana: 'となり', kanji: '隣', es: 'al lado · vecino', en: 'next to', sit: 'forest', kind: 'n' },
  { id: 'chikaku', kana: 'ちかく', kanji: '近く', es: 'cerca', en: 'nearby', sit: 'forest', kind: 'n' },
  // Etapa 2 del currículo (P-08a)
  { id: 'donna', kana: 'どんな', kanji: null, es: 'qué tipo de · cómo es', en: 'what kind of', sit: 'forest', kind: 'q' },
  { id: 'demo', kana: 'でも', kanji: null, es: 'pero (al empezar la frase)', en: 'but (at the start of a sentence)', sit: 'forest', kind: 'expr' },
  { id: 'dou', kana: 'どう', kanji: null, es: 'cómo · qué tal (どう です か)', en: 'how (どう です か: how about…?)', sit: 'forest', kind: 'q' },
  { id: 'ee', kana: 'ええ', kanji: null, es: 'sí (más suave que はい)', en: 'yes (softer than はい)', sit: 'forest', kind: 'expr' },
  { id: 'chotto', kana: 'ちょっと', kanji: null, es: 'un poco (〜は ちょっと: para decir que no con suavidad)', en: 'a little (〜は ちょっと: a soft way to say no)', sit: 'forest', kind: 'expr' },
  { id: 'zannen', kana: 'ざんねん', kanji: '残念', es: 'qué lástima (ざんねん です)', en: 'what a pity (ざんねん です)', sit: 'forest', kind: 'expr' },
  { id: 'kondo', kana: 'こんど', kanji: '今度', es: 'la próxima vez', en: 'next time', sit: 'forest', kind: 'n' },
  { id: 'tabun', kana: 'たぶん', kanji: null, es: 'quizás · probablemente', en: 'probably · maybe', sit: 'forest', kind: 'expr' },
  { id: 'sukoshi', kana: 'すこし', kanji: '少し', es: 'un poco', en: 'a little', sit: 'forest', kind: 'expr' },
  { id: 'dore', kana: 'どれ', kanji: null, es: 'cuál (entre varias cosas)', en: 'which one (of several)', sit: 'forest', kind: 'q' },
  { id: 'dono', kana: 'どの', kanji: null, es: 'qué · cuál (antes de un nombre)', en: 'which (before a noun)', sit: 'forest', kind: 'q' },
  // Etapa 3 del currículo
  { id: 'hou', kana: 'ほう', kanji: '方', es: 'lado (〜の ほう が: «es más…»)', en: "side (〜の ほう が: «more…»)", sit: 'forest', kind: 'n' },
  { id: 'ichiban', kana: 'いちばん', kanji: '一番', es: 'el más · número uno', en: "the most · number one", sit: 'forest', kind: 'expr' },
  { id: 'ooi', kana: 'おおい', kanji: '多い', es: 'mucho · muchos', en: "many · a lot", sit: 'forest', kind: 'adj' },
  { id: 'sukunai', kana: 'すくない', kanji: '少ない', es: 'poco · pocos', en: "few · little", sit: 'forest', kind: 'adj' },
  // Etapa 3 del currículo (parte 2)
  { id: 'toki', kana: 'とき', kanji: '時', es: 'cuando · momento', en: "when · time", sit: 'forest', kind: 'n' },
  { id: 'riyuu', kana: 'りゆう', kanji: '理由', es: 'razón · motivo', en: "reason", sit: 'forest', kind: 'n' },
  // Etapa 4 del currículo (parte 2)
  { id: 'okuremasu', kana: 'おくれます', kanji: '遅れます', te: 'おくれて', tek: '遅れて', dict: 'おくれる', dictk: '遅れる', es: 'llegar tarde · atrasarse', en: "to be late", sit: 'forest', kind: 'v' },
  { id: 'komarimasu', kana: 'こまります', kanji: '困ります', te: 'こまって', tek: '困って', dict: 'こまる', dictk: '困る', es: 'estar en apuros', en: "to be in trouble", sit: 'forest', kind: 'v' },
  { id: 'dame', kana: 'だめ', kanji: null, es: 'no está bien · no se puede', en: "no good · not allowed", sit: 'forest', kind: 'adj' },

  // Etapa 2 del currículo (P-08d: 2.19, 2.20, 2.23 y 2.24)
  { id: 'hontou', kana: 'ほんとう', kanji: '本当', es: 'verdad (ほんとう です か: ¿en serio?; ほんとう に: de verdad)', en: 'truth (ほんとう です か: really?; ほんとう に: really)', sit: 'forest', kind: 'n' },
  { id: 'mada', kana: 'まだ', kanji: null, es: 'todavía · aún (まだ 〜て いません: todavía no)', en: 'still · (not) yet', sit: 'forest', kind: 'expr' },
  { id: 'mousugu', kana: 'もうすぐ', kanji: null, es: 'pronto · ya casi', en: 'soon · almost', sit: 'forest', kind: 'expr' },
  { id: 'ureshii', kana: 'うれしい', kanji: '嬉しい', es: 'contento · feliz (por algo que pasa)', en: 'glad · happy', sit: 'forest', kind: 'adj' },
  { id: 'tanoshimi', kana: 'たのしみ', kanji: '楽しみ', es: 'ilusión · ganas (たのしみ です: ¡qué ganas!)', en: 'something to look forward to (たのしみ です: I am looking forward to it)', sit: 'forest', kind: 'n' },
  { id: 'yukkuri', kana: 'ゆっくり', kanji: null, es: 'despacio · con calma (ゆっくり します: descansar, tomárselo con calma)', en: 'slowly · at ease (ゆっくり します: to relax)', sit: 'forest', kind: 'expr' },
  { id: 'mazu', kana: 'まず', kanji: null, es: 'primero · antes que nada', en: 'first of all', sit: 'forest', kind: 'expr' },
  { id: 'saigo', kana: 'さいご', kanji: '最後', es: 'el final · lo último (さいご に: al final)', en: 'the end · the last (さいご に: finally)', sit: 'forest', kind: 'n' },
  { id: 'omedetou', kana: 'おめでとう', kanji: null, es: '¡felicidades! (おめでとう ございます: más formal)', en: 'congratulations!', sit: 'forest', kind: 'expr' },
  { id: 'kanpai', kana: 'かんぱい', kanji: '乾杯', es: '¡salud! (al brindar)', en: 'cheers! (a toast)', sit: 'forest', kind: 'expr' },
  { id: 'itsu', kana: 'いつ', kanji: null, es: 'cuándo', en: 'when', sit: 'forest', kind: 'q' },
  { id: 'konkai', kana: 'こんかい', kanji: '今回', es: 'esta vez · esta edición', en: 'this time', sit: 'forest', kind: 'n' },
  // ── hill · Presentarse y la hora ──
  { id: 'watashi', kana: 'わたし', kanji: '私', es: 'yo', en: 'I', sit: 'hill', kind: 'n' },
  { id: 'gakusei', kana: 'がくせい', kanji: '学生', es: 'estudiante', en: 'student', sit: 'hill', kind: 'n' },
  { id: 'ichi', kana: 'いち', kanji: '一', es: 'uno', en: 'one', sit: 'hill', kind: 'num' },
  { id: 'ni', kana: 'に', kanji: '二', es: 'dos', en: 'two', sit: 'hill', kind: 'num' },
  { id: 'sankazu', kana: 'さん', kanji: '三', es: 'tres', en: 'three', sit: 'hill', kind: 'num' },
  { id: 'ima', kana: 'いま', kanji: '今', es: 'ahora', en: 'now', sit: 'hill', kind: 'n' },
  { id: 'nan', kana: 'なん', kanji: '何', es: 'qué (antes de です o de un contador)', en: 'what (before です or a counter)', sit: 'hill', kind: 'q' },
  { id: 'ji', kana: 'じ', kanji: '時', es: 'hora en punto (las…)', en: "o'clock", sit: 'hill', kind: 'n' },
  { id: 'yon', kana: 'よん', kanji: '四', es: 'cuatro', en: 'four', sit: 'hill', kind: 'num' },
  { id: 'go', kana: 'ご', kanji: '五', es: 'cinco', en: 'five', sit: 'hill', kind: 'num' },
  { id: 'roku', kana: 'ろく', kanji: '六', es: 'seis', en: 'six', sit: 'hill', kind: 'num' },
  { id: 'nana', kana: 'なな', kanji: '七', es: 'siete', en: 'seven', sit: 'hill', kind: 'num' },
  { id: 'hachi', kana: 'はち', kanji: '八', es: 'ocho', en: 'eight', sit: 'hill', kind: 'num' },
  { id: 'kyuu', kana: 'きゅう', kanji: '九', es: 'nueve', en: 'nine', sit: 'hill', kind: 'num' },
  { id: 'juu', kana: 'じゅう', kanji: '十', es: 'diez', en: 'ten', sit: 'hill', kind: 'num' },
  { id: 'han', kana: 'はん', kanji: '半', es: 'y media', en: 'half past', sit: 'hill', kind: 'n' },
  { id: 'gozen', kana: 'ごぜん', kanji: '午前', es: 'de la mañana (a. m.)', en: 'a.m.', sit: 'hill', kind: 'n' },
  { id: 'gogo', kana: 'ごご', kanji: '午後', es: 'de la tarde (p. m.)', en: 'p.m.', sit: 'hill', kind: 'n' },
  { id: 'kyou', kana: 'きょう', kanji: '今日', es: 'hoy', en: 'today', sit: 'hill', kind: 'n' },
  { id: 'nichiyoubi', kana: 'にちようび', kanji: '日曜日', es: 'domingo', en: 'Sunday', sit: 'hill', kind: 'n' },
  { id: 'ashita', kana: 'あした', kanji: '明日', es: 'mañana (el día siguiente)', en: 'tomorrow', sit: 'hill', kind: 'n' },
  { id: 'getsuyoubi', kana: 'げつようび', kanji: '月曜日', es: 'lunes', en: 'Monday', sit: 'hill', kind: 'n' },
  { id: 'namae', kana: 'なまえ', kanji: '名前', es: 'nombre', en: 'name', sit: 'hill', kind: 'n' },
  { id: 'nihon', kana: 'にほん', kanji: '日本', es: 'Japón', en: 'Japan', sit: 'hill', kind: 'n' },
  // Agregadas para el currículo (docs/CURRICULO.md, etapa 1)
  { id: 'kayoubi', kana: 'かようび', kanji: '火曜日', es: 'martes', en: "Tuesday", sit: 'hill', kind: 'n' },
  { id: 'suiyoubi', kana: 'すいようび', kanji: '水曜日', es: 'miércoles', en: "Wednesday", sit: 'hill', kind: 'n' },
  { id: 'mokuyoubi', kana: 'もくようび', kanji: '木曜日', es: 'jueves', en: "Thursday", sit: 'hill', kind: 'n' },
  { id: 'kinyoubi', kana: 'きんようび', kanji: '金曜日', es: 'viernes', en: "Friday", sit: 'hill', kind: 'n' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'sai', kana: 'さい', kanji: '歳', es: 'años de edad (〜さい)', en: 'years old (〜さい)', sit: 'hill', kind: 'n' },
  { id: 'yo', kana: 'よ', kanji: '四', es: 'cuatro (en よじ y よにん)', en: 'four (in よじ: four o’clock)', sit: 'hill', kind: 'num' },
  { id: 'shichi', kana: 'しち', kanji: '七', es: 'siete (en しちじ: las siete)', en: 'seven (in しちじ: seven o’clock)', sit: 'hill', kind: 'num' },
  { id: 'ku', kana: 'く', kanji: '九', es: 'nueve (en くじ: las nueve)', en: 'nine (in くじ: nine o’clock)', sit: 'hill', kind: 'num' },
  { id: 'fun', kana: 'ふん', kanji: '分', es: 'minutos (con 2, 5, 7, 9: に ふん · ご ふん)', en: 'minutes (after 2, 5, 7, 9: に ふん · ご ふん)', sit: 'hill', kind: 'n' },
  { id: 'pun', kana: 'ぷん', kanji: '分', es: 'minutos (con 1, 3, 4, 6, 8, 10 y なん: いっぷん · さんぷん · なんぷん)', en: 'minutes (after 3, 4 and なん: さん ぷん · なん ぷん)', sit: 'hill', kind: 'n' },
  { id: 'goro', kana: 'ごろ', kanji: null, es: 'alrededor de (una hora)', en: 'around (a time)', sit: 'hill', kind: 'expr' },
  { id: 'konban', kana: 'こんばん', kanji: '今晩', es: 'esta noche', en: 'tonight', sit: 'hill', kind: 'n' },
  { id: 'tokei', kana: 'とけい', kanji: '時計', es: 'reloj', en: 'clock · watch', sit: 'hill', kind: 'n' },
  { id: 'nanyoubi', kana: 'なんようび', kanji: '何曜日', es: 'qué día de la semana', en: 'what day of the week', sit: 'hill', kind: 'q' },
  { id: 'asatte', kana: 'あさって', kanji: null, es: 'pasado mañana', en: 'the day after tomorrow', sit: 'hill', kind: 'n' },
  { id: 'ototoi', kana: 'おととい', kanji: null, es: 'anteayer', en: 'the day before yesterday', sit: 'hill', kind: 'n' },
  // Etapa 2 del currículo (P-08a)
  { id: 'maiasa', kana: 'まいあさ', kanji: '毎朝', es: 'todas las mañanas', en: 'every morning', sit: 'hill', kind: 'n' },
  { id: 'maiban', kana: 'まいばん', kanji: '毎晩', es: 'todas las noches', en: 'every night', sit: 'hill', kind: 'n' },
  { id: 'yuugata', kana: 'ゆうがた', kanji: '夕方', es: 'atardecer · al caer la tarde', en: 'early evening', sit: 'hill', kind: 'n' },
  { id: 'kesa', kana: 'けさ', kanji: '今朝', es: 'esta mañana', en: 'this morning', sit: 'hill', kind: 'n' },
  { id: 'yuube', kana: 'ゆうべ', kanji: null, es: 'anoche', en: 'last night', sit: 'hill', kind: 'n' },
  { id: 'sengetsu', kana: 'せんげつ', kanji: '先月', es: 'el mes pasado', en: 'last month', sit: 'hill', kind: 'n' },
  { id: 'kyonen', kana: 'きょねん', kanji: '去年', es: 'el año pasado', en: 'last year', sit: 'hill', kind: 'n' },
  { id: 'tanjoubi', kana: 'たんじょうび', kanji: '誕生日', es: 'cumpleaños', en: 'birthday', sit: 'hill', kind: 'n' },
  { id: 'raigetsu', kana: 'らいげつ', kanji: '来月', es: 'el mes que viene', en: 'next month', sit: 'hill', kind: 'n' },
  { id: 'rainen', kana: 'らいねん', kanji: '来年', es: 'el año que viene', en: 'next year', sit: 'hill', kind: 'n' },
  // Etapa 4 del currículo
  { id: 'kagi', kana: 'かぎ', kanji: '鍵', es: 'llave', en: "key", sit: 'hill', kind: 'n' },
  { id: 'shimaimasu', kana: 'しまいます', kanji: null, te: 'しまって', dict: 'しまう', es: 'terminar · (〜て しまう: sin querer)', en: "to finish · (〜て しまう: by accident)", sit: 'hill', kind: 'v' },
  { id: 'wasuremasu', kana: 'わすれます', kanji: '忘れます', te: 'わすれて', tek: '忘れて', dict: 'わすれる', dictk: '忘れる', es: 'olvidar', en: "to forget", sit: 'hill', kind: 'v' },
  { id: 'otoshimasu', kana: 'おとします', kanji: '落とします', te: 'おとして', tek: '落として', dict: 'おとす', dictk: '落とす', es: 'dejar caer · perder', en: "to drop · lose", sit: 'hill', kind: 'v' },
  { id: 'kowashimasu', kana: 'こわします', kanji: '壊します', te: 'こわして', tek: '壊して', dict: 'こわす', dictk: '壊す', es: 'romper', en: "to break", sit: 'hill', kind: 'v' },
  { id: 'oku', kana: 'おきます', kanji: '置きます', te: 'おいて', tek: '置いて', dict: 'おく', dictk: '置く', es: 'dejar · poner (〜て おく: dejar listo)', en: "to put · leave (〜て おく: do in advance)", sit: 'hill', kind: 'v' },
  // Etapa 4 del currículo (parte 2)
  { id: 'shikarimasu', kana: 'しかります', kanji: '叱ります', te: 'しかって', tek: '叱って', dict: 'しかる', dictk: '叱る', pass: 'しかられます', passk: '叱られます', es: 'regañar', en: "to scold", sit: 'hill', kind: 'v' },
  { id: 'torimasu', kana: 'とります', kanji: '取ります', te: 'とって', tek: '取って', dict: 'とる', dictk: '取る', pass: 'とられます', passk: '取られます', es: 'tomar · agarrar · robar', en: "to take", sit: 'hill', kind: 'v' },
  { id: 'fumimasu', kana: 'ふみます', kanji: '踏みます', te: 'ふんで', tek: '踏んで', dict: 'ふむ', dictk: '踏む', pass: 'ふまれます', passk: '踏まれます', es: 'pisar', en: "to step on", sit: 'hill', kind: 'v' },
  { id: 'saifu', kana: 'さいふ', kanji: '財布', es: 'billetera', en: "wallet", sit: 'hill', kind: 'n' },

  // Etapa 2 del currículo (P-08c: 2.14 y 2.16)
  { id: 'juppun', kana: 'じゅっぷん', kanji: '十分', es: 'diez minutos (さん じゅっぷん: treinta minutos)', en: 'ten minutes (さん じゅっぷん: thirty minutes)', sit: 'hill', kind: 'n' },
  { id: 'shuu', kana: 'しゅう', kanji: '週', es: 'semana (しゅう に: por semana)', en: 'week (しゅう に: per week)', sit: 'hill', kind: 'n' },
  { id: 'ikkai', kana: 'いっかい', kanji: '一回', es: 'una vez', en: 'once', sit: 'hill', kind: 'num' },
  { id: 'kaikazu', kana: 'かい', kanji: '回', es: 'veces (に かい: dos veces)', en: 'times (に かい: twice)', sit: 'hill', kind: 'n' },
  { id: 'yottsu', kana: 'よっつ', kanji: '四つ', es: 'cuatro (cosas)', en: 'four (things)', sit: 'hill', kind: 'num' },
  { id: 'itsutsu', kana: 'いつつ', kanji: '五つ', es: 'cinco (cosas)', en: 'five (things)', sit: 'hill', kind: 'num' },
  { id: 'ikko', kana: 'いっこ', kanji: '一個', es: 'uno (cosa pequeña: un pastel, una manzana)', en: 'one (small item)', sit: 'hill', kind: 'num' },
  { id: 'ko', kana: 'こ', kanji: '個', es: 'contador de cosas pequeñas (さん こ: tres)', en: 'counter for small items (さん こ: three)', sit: 'hill', kind: 'n' },
  { id: 'mai', kana: 'まい', kanji: '枚', es: 'contador de cosas planas: hojas, platos, boletos (に まい: dos)', en: 'counter for flat things: sheets, plates, tickets (に まい: two)', sit: 'hill', kind: 'n' },
  { id: 'ippon', kana: 'いっぽん', kanji: '一本', es: 'uno (cosa larga: una botella, una vela)', en: 'one (long item: a bottle, a candle)', sit: 'hill', kind: 'num' },
  { id: 'honkazu', kana: 'ほん', kanji: '本', es: 'contador de cosas largas (に ほん · ご ほん: dos · cinco)', en: 'counter for long things (に ほん · ご ほん: two · five)', sit: 'hill', kind: 'n' },
  { id: 'bon', kana: 'ぼん', kanji: '本', es: 'contador de cosas largas tras さん y なん (さん ぼん: tres)', en: 'counter for long things after さん and なん (さん ぼん: three)', sit: 'hill', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.22 y 2.24)
  { id: 'heijitsu', kana: 'へいじつ', kanji: '平日', es: 'día de semana (de lunes a viernes)', en: 'weekday', sit: 'hill', kind: 'n' },
  { id: 'maishuu', kana: 'まいしゅう', kanji: '毎週', es: 'todas las semanas', en: 'every week', sit: 'hill', kind: 'n' },
  { id: 'maitsuki', kana: 'まいつき', kanji: '毎月', es: 'todos los meses', en: 'every month', sit: 'hill', kind: 'n' },
  { id: 'jikyuu', kana: 'じきゅう', kanji: '時給', es: 'pago por hora', en: 'hourly wage', sit: 'hill', kind: 'n' },
  { id: 'gatsu', kana: 'がつ', kanji: '月', es: 'mes, tras un número (し がつ: abril; なん がつ: qué mes)', en: 'month, after a number (し がつ: April; なん がつ: which month)', sit: 'hill', kind: 'n' },
  { id: 'shi', kana: 'し', kanji: '四', es: 'cuatro (en し がつ: abril)', en: 'four (in し がつ: April)', sit: 'hill', kind: 'num' },
  { id: 'nichi', kana: 'にち', kanji: '日', es: 'día del mes, del 11 en adelante (じゅう いち にち: el 11)', en: 'day of the month, from the 11th on (じゅう いち にち: the 11th)', sit: 'hill', kind: 'n' },
  { id: 'tsuitachi', kana: 'ついたち', kanji: '一日', es: 'el día 1 (del mes)', en: 'the 1st (of the month)', sit: 'hill', kind: 'n' },
  { id: 'futsuka', kana: 'ふつか', kanji: '二日', es: 'el día 2 · dos días', en: 'the 2nd · two days', sit: 'hill', kind: 'n' },
  { id: 'mikka', kana: 'みっか', kanji: '三日', es: 'el día 3 · tres días', en: 'the 3rd · three days', sit: 'hill', kind: 'n' },
  { id: 'yokka', kana: 'よっか', kanji: '四日', es: 'el día 4 · cuatro días', en: 'the 4th · four days', sit: 'hill', kind: 'n' },
  { id: 'itsuka', kana: 'いつか', kanji: '五日', es: 'el día 5 · cinco días', en: 'the 5th · five days', sit: 'hill', kind: 'n' },
  { id: 'muika', kana: 'むいか', kanji: '六日', es: 'el día 6 · seis días', en: 'the 6th · six days', sit: 'hill', kind: 'n' },
  { id: 'nanoka', kana: 'なのか', kanji: '七日', es: 'el día 7 · siete días', en: 'the 7th · seven days', sit: 'hill', kind: 'n' },
  { id: 'youka', kana: 'ようか', kanji: '八日', es: 'el día 8 · ocho días', en: 'the 8th · eight days', sit: 'hill', kind: 'n' },
  { id: 'kokonoka', kana: 'ここのか', kanji: '九日', es: 'el día 9 · nueve días', en: 'the 9th · nine days', sit: 'hill', kind: 'n' },
  { id: 'tooka', kana: 'とおか', kanji: '十日', es: 'el día 10 · diez días', en: 'the 10th · ten days', sit: 'hill', kind: 'n' },
  { id: 'hatsuka', kana: 'はつか', kanji: '二十日', es: 'el día 20 · veinte días', en: 'the 20th · twenty days', sit: 'hill', kind: 'n' },
  // ── valley · Familia y personas ──
  { id: 'kazoku', kana: 'かぞく', kanji: '家族', es: 'familia', en: 'family', sit: 'valley', kind: 'n' },
  { id: 'chichi', kana: 'ちち', kanji: '父', es: 'mi padre', en: 'my father', sit: 'valley', kind: 'n' },
  { id: 'haha', kana: 'はは', kanji: '母', es: 'mi madre', en: 'my mother', sit: 'valley', kind: 'n' },
  { id: 'tomodachi', kana: 'ともだち', kanji: '友達', es: 'amigo · amiga', en: 'friend', sit: 'valley', kind: 'n' },
  { id: 'ano', kana: 'あの', kanji: null, es: 'aquel · aquella (antes de un nombre)', en: 'that … over there (before a noun)', sit: 'valley', kind: 'n' },
  { id: 'hito', kana: 'ひと', kanji: '人', es: 'persona', en: 'person', sit: 'valley', kind: 'n' },
  { id: 'dare', kana: 'だれ', kanji: '誰', es: 'quién', en: 'who', sit: 'valley', kind: 'q' },
  { id: 'kochira', kana: 'こちら', kanji: null, es: 'esta persona · por aquí', en: 'this person · this way', sit: 'valley', kind: 'n' },
  { id: 'tanaka', kana: 'たなか', kanji: '田中', es: 'Tanaka (apellido)', en: 'Tanaka (surname)', sit: 'valley', kind: 'n' },
  { id: 'ani', kana: 'あに', kanji: '兄', es: 'mi hermano mayor', en: 'my older brother', sit: 'valley', kind: 'n' },
  { id: 'otouto', kana: 'おとうと', kanji: '弟', es: 'hermano menor', en: 'younger brother', sit: 'valley', kind: 'n' },
  { id: 'ane', kana: 'あね', kanji: '姉', es: 'mi hermana mayor', en: 'my older sister', sit: 'valley', kind: 'n' },
  { id: 'kodomo', kana: 'こども', kanji: '子供', es: 'niño · hijo', en: 'child', sit: 'valley', kind: 'n' },
  { id: 'futari', kana: 'ふたり', kanji: '二人', es: 'dos personas', en: 'two people', sit: 'valley', kind: 'n' },
  { id: 'imouto', kana: 'いもうと', kanji: '妹', es: 'hermana menor', en: 'younger sister', sit: 'valley', kind: 'n' },
  { id: 'otoko', kana: 'おとこ', kanji: '男', es: 'hombre · varón', en: 'man · male', sit: 'valley', kind: 'n' },
  { id: 'otousan', kana: 'おとうさん', kanji: 'お父さん', es: 'padre (el de otra persona) · papá', en: "father (someone else's) · dad", sit: 'valley', kind: 'n' },
  { id: 'onna', kana: 'おんな', kanji: '女', es: 'mujer', en: 'woman · female', sit: 'valley', kind: 'n' },
  { id: 'okaasan', kana: 'おかあさん', kanji: 'お母さん', es: 'madre (la de otra persona) · mamá', en: "mother (someone else's) · mom", sit: 'valley', kind: 'n' },
  // Agregadas para el currículo (etapas 0 y 1)
  { id: 'kuni', kana: 'くに', kanji: '国', es: 'país', en: "country", sit: 'valley', kind: 'n' },
  { id: 'nihonjin', kana: 'にほんじん', kanji: '日本人', es: 'japonés · japonesa (persona)', en: "Japanese (person)", sit: 'valley', kind: 'n' },
  { id: 'uruguai', kana: 'ウルグアイ', kanji: null, es: 'Uruguay', en: "Uruguay", sit: 'valley', kind: 'n' },
  { id: 'amerika', kana: 'アメリカ', kanji: null, es: 'Estados Unidos', en: "the United States", sit: 'valley', kind: 'n' },
  { id: 'supein', kana: 'スペイン', kanji: null, es: 'España', en: "Spain", sit: 'valley', kind: 'n' },
  { id: 'mekishiko', kana: 'メキシコ', kanji: null, es: 'México', en: "Mexico", sit: 'valley', kind: 'n' },
  { id: 'burajiru', kana: 'ブラジル', kanji: null, es: 'Brasil', en: "Brazil", sit: 'valley', kind: 'n' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'anata', kana: 'あなた', kanji: null, es: 'tú · usted', en: 'you', sit: 'valley', kind: 'n' },
  { id: 'jin', kana: 'じん', kanji: '人', es: 'persona de (un país): メキシコ じん', en: 'person from (a country): メキシコ じん', sit: 'valley', kind: 'n' },
  { id: 'chuugoku', kana: 'ちゅうごく', kanji: '中国', es: 'China', en: 'China', sit: 'valley', kind: 'n' },
  { id: 'kaishain', kana: 'かいしゃいん', kanji: '会社員', es: 'empleado · empleada de oficina', en: 'office worker', sit: 'valley', kind: 'n' },
  { id: 'isha', kana: 'いしゃ', kanji: '医者', es: 'médico · médica', en: 'doctor', sit: 'valley', kind: 'n' },
  { id: 'onnanoko', kana: 'おんなのこ', kanji: '女の子', es: 'niña · chica', en: 'girl', sit: 'valley', kind: 'n' },
  { id: 'otokonoko', kana: 'おとこのこ', kanji: '男の子', es: 'niño · chico', en: 'boy', sit: 'valley', kind: 'n' },
  { id: 'oniisan', kana: 'おにいさん', kanji: 'お兄さん', es: 'hermano mayor (el de otra persona)', en: 'older brother (someone else’s)', sit: 'valley', kind: 'n' },
  { id: 'oneesan', kana: 'おねえさん', kanji: 'お姉さん', es: 'hermana mayor (la de otra persona)', en: 'older sister (someone else’s)', sit: 'valley', kind: 'n' },
  { id: 'kyoudai', kana: 'きょうだい', kanji: '兄弟', es: 'hermanos', en: 'siblings', sit: 'valley', kind: 'n' },
  { id: 'hitori', kana: 'ひとり', kanji: '一人', es: 'una persona · solo', en: 'one person · alone', sit: 'valley', kind: 'n' },
  { id: 'nin', kana: 'にん', kanji: '人', es: 'personas (contador desde 3: さん にん · なん にん; 1 y 2 son ひとり y ふたり)', en: 'people (counter: さん にん · なん にん)', sit: 'valley', kind: 'n' },
  { id: 'akachan', kana: 'あかちゃん', kanji: '赤ちゃん', es: 'bebé', en: 'baby', sit: 'valley', kind: 'n' },
  // Etapa 2 del currículo (P-08b)
  { id: 'sumimasu', kana: 'すみます', kanji: '住みます', te: 'すんで', tek: '住んで', dict: 'すむ', dictk: '住む', es: 'vivir (en un lugar): 〜に すんで います', en: 'to live (somewhere): 〜に すんで います', sit: 'valley', kind: 'v' },
  { id: 'kekkon', kana: 'けっこん', kanji: '結婚', es: 'matrimonio (けっこん します: casarse; けっこん して います: estar casado)', en: 'marriage (けっこん して います: to be married)', sit: 'valley', kind: 'n' },
  // Etapa 3 del currículo
  { id: 'koto', kana: 'こと', kanji: '事', es: 'cosa · hecho (〜た こと が ある)', en: "thing · fact (〜た こと が ある)", sit: 'valley', kind: 'n' },
  { id: 'ryokou', kana: 'りょこう', kanji: '旅行', es: 'viaje', en: "trip", sit: 'valley', kind: 'n' },
  { id: 'soto', kana: 'そと', kanji: '外', es: 'afuera', en: "outside", sit: 'valley', kind: 'n' },
  { id: 'iimasu', kana: 'いいます', kanji: '言います', te: 'いって', tek: '言って', dict: 'いう', dictk: '言う', es: 'decir', en: "to say", sit: 'valley', kind: 'v' },
  // Etapa 4 del currículo (parte 2)
  { id: 'mukashi', kana: 'むかし', kanji: '昔', es: 'hace mucho tiempo', en: "long ago", sit: 'valley', kind: 'n' },
  { id: 'ojiisan', kana: 'おじいさん', kanji: null, es: 'abuelo · anciano', en: "grandfather · old man", sit: 'valley', kind: 'n' },
  { id: 'monogatari', kana: 'ものがたり', kanji: '物語', es: 'cuento · historia', en: "story", sit: 'valley', kind: 'n' },
  { id: 'hajimemasu', kana: 'はじめます', kanji: '始めます', te: 'はじめて', tek: '始めて', dict: 'はじめる', dictk: '始める', es: 'empezar (algo)', en: "to begin (something)", sit: 'valley', kind: 'v' },
  { id: 'owarimasu', kana: 'おわります', kanji: '終わります', te: 'おわって', tek: '終わって', dict: 'おわる', dictk: '終わる', es: 'terminar', en: "to end", sit: 'valley', kind: 'v' },

  // Etapa 2 del currículo (P-08c: 2.13)
  { id: 'meishi', kana: 'めいし', kanji: '名刺', es: 'tarjeta de presentación', en: 'business card', sit: 'valley', kind: 'n' },
  { id: 'shoukai', kana: 'しょうかい', kanji: '紹介', es: 'presentación (しょうかい します: presentar a alguien)', en: 'introduction (しょうかい します: to introduce someone)', sit: 'valley', kind: 'n' },
  { id: 'ryuugakusei', kana: 'りゅうがくせい', kanji: '留学生', es: 'estudiante extranjero · de intercambio', en: 'international student', sit: 'valley', kind: 'n' },
  { id: 'kurasumeito', kana: 'クラスメート', kanji: null, es: 'compañero de clase', en: 'classmate', sit: 'valley', kind: 'n' },
  { id: 'douryou', kana: 'どうりょう', kanji: '同僚', es: 'compañero de trabajo', en: 'coworker', sit: 'valley', kind: 'n' },
  { id: 'senpai', kana: 'せんぱい', kanji: '先輩', es: 'senpai (compañero con más antigüedad en la escuela o el trabajo)', en: 'senpai (someone senior at school or work)', sit: 'valley', kind: 'n' },
  { id: 'minna', kana: 'みんな', kanji: null, es: 'todos (みんな で: todos juntos)', en: 'everyone (みんな で: all together)', sit: 'valley', kind: 'n' },
  { id: 'shinsetsu', kana: 'しんせつ', kanji: '親切', es: 'amable · atento (con los demás)', en: 'kind · helpful', sit: 'valley', kind: 'adj' },
  { id: 'yasashii', kana: 'やさしい', kanji: '優しい', es: 'cariñoso · bueno (de carácter)', en: 'gentle · kind-hearted', sit: 'valley', kind: 'adj' },
  { id: 'se', kana: 'せ', kanji: '背', es: 'estatura (せ が たかい: ser alto)', en: 'height (せ が たかい: to be tall)', sit: 'valley', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.19, 2.22 y 2.23)
  { id: 'kareshi', kana: 'かれし', kanji: '彼氏', es: 'novio', en: 'boyfriend', sit: 'valley', kind: 'n' },
  { id: 'kanojo', kana: 'かのじょ', kanji: '彼女', es: 'novia · ella', en: 'girlfriend · she', sit: 'valley', kind: 'n' },
  { id: 'deeto', kana: 'デート', kanji: null, es: 'cita (romántica) (デート を します: salir en una cita)', en: 'date (デート を します: to go on a date)', sit: 'valley', kind: 'n' },
  { id: 'machiawase', kana: 'まちあわせ', kanji: '待ち合わせ', es: 'encuentro acordado (la hora y el lugar para verse)', en: 'meeting up (the arranged time and place)', sit: 'valley', kind: 'n' },
  { id: 'renraku', kana: 'れんらく', kanji: '連絡', es: 'aviso · contacto (れんらく します: avisar, escribirle a alguien)', en: 'contact (れんらく します: to get in touch)', sit: 'valley', kind: 'n' },
  { id: 'buchou', kana: 'ぶちょう', kanji: '部長', es: 'jefe de departamento', en: 'department manager', sit: 'valley', kind: 'n' },
  { id: 'shachou', kana: 'しゃちょう', kanji: '社長', es: 'presidente de la empresa', en: 'company president', sit: 'valley', kind: 'n' },
  { id: 'tenin', kana: 'てんいん', kanji: '店員', es: 'dependiente · empleado de una tienda', en: 'shop clerk', sit: 'valley', kind: 'n' },
  { id: 'sasoimasu', kana: 'さそいます', kanji: '誘います', te: 'さそって', tek: '誘って', dict: 'さそう', dictk: '誘う', es: 'invitar (a hacer algo)', en: 'to invite', sit: 'valley', kind: 'v' },
  { id: 'waraimasu', kana: 'わらいます', kanji: '笑います', te: 'わらって', tek: '笑って', dict: 'わらう', dictk: '笑う', es: 'reír · reírse', en: 'to laugh', sit: 'valley', kind: 'v' },
  { id: 'uchi', kana: 'うち', kanji: '家', es: 'casa · mi casa (más cercano que いえ)', en: 'home · my place', sit: 'valley', kind: 'n' },
  { id: 'juusho', kana: 'じゅうしょ', kanji: '住所', es: 'dirección (de una casa)', en: 'address', sit: 'valley', kind: 'n' },
  // ── spring · Comida y gustos ──
  { id: 'gohan', kana: 'ごはん', kanji: 'ご飯', es: 'arroz cocido · comida', en: 'cooked rice · meal', sit: 'spring', kind: 'n' },
  { id: 'tabemasu', kana: 'たべます', kanji: '食べます', te: 'たべて', tek: '食べて', dict: 'たべる', dictk: '食べる', pot: 'たべられます', potk: '食べられます', caus: 'たべさせます', causk: '食べさせます', es: 'comer', en: 'to eat', sit: 'spring', kind: 'v' },
  { id: 'mizu', kana: 'みず', kanji: '水', es: 'agua', en: 'water', sit: 'spring', kind: 'n' },
  { id: 'nomimasu', kana: 'のみます', kanji: '飲みます', te: 'のんで', tek: '飲んで', dict: 'のむ', dictk: '飲む', es: 'beber', en: 'to drink', sit: 'spring', kind: 'v' },
  { id: 'nani', kana: 'なに', kanji: '何', es: 'qué', en: 'what', sit: 'spring', kind: 'q' },
  { id: 'suki', kana: 'すき', kanji: '好き', es: 'que gusta (me gusta…)', en: 'liked (I like…)', sit: 'spring', kind: 'adj' },
  { id: 'sakana', kana: 'さかな', kanji: '魚', es: 'pescado · pez', en: 'fish', sit: 'spring', kind: 'n' },
  { id: 'niku', kana: 'にく', kanji: '肉', es: 'carne', en: 'meat', sit: 'spring', kind: 'n' },
  { id: 'ocha', kana: 'おちゃ', kanji: 'お茶', es: 'té', en: 'tea', sit: 'spring', kind: 'n' },
  { id: 'pan', kana: 'パン', kanji: null, es: 'pan', en: 'bread', sit: 'spring', kind: 'n' },
  { id: 'oishii', kana: 'おいしい', kanji: null, es: 'rico · sabroso', en: 'delicious', sit: 'spring', kind: 'adj' },
  { id: 'ookii', kana: 'おおきい', kanji: '大きい', es: 'grande', en: 'big', sit: 'spring', kind: 'adj' },
  { id: 'chiisai', kana: 'ちいさい', kanji: '小さい', es: 'pequeño', en: 'small', sit: 'spring', kind: 'adj' },
  { id: 'me', kana: 'め', kanji: '目', es: 'ojo', en: 'eye', sit: 'spring', kind: 'n' },
  { id: 'iro', kana: 'いろ', kanji: '色', es: 'color', en: 'color', sit: 'spring', kind: 'n' },
  { id: 'aoi', kana: 'あおい', kanji: '青い', es: 'azul', en: 'blue', sit: 'spring', kind: 'adj' },
  { id: 'akai', kana: 'あかい', kanji: '赤い', es: 'rojo', en: 'red', sit: 'spring', kind: 'adj' },
  { id: 'shiroi', kana: 'しろい', kanji: '白い', es: 'blanco', en: 'white', sit: 'spring', kind: 'adj' },
  { id: 'ashi', kana: 'あし', kanji: '足', es: 'pie · pierna', en: 'foot · leg', sit: 'spring', kind: 'n' },
  { id: 'koohii', kana: 'コーヒー', kanji: null, es: 'café', en: 'coffee', sit: 'spring', kind: 'n' },
  { id: 'totemo', kana: 'とても', kanji: null, es: 'muy', en: 'very', sit: 'spring', kind: 'expr' },
  // Agregadas para el currículo (etapa 0)
  { id: 'juusu', kana: 'ジュース', kanji: null, es: 'jugo', en: "juice", sit: 'spring', kind: 'n' },
  { id: 'keeki', kana: 'ケーキ', kanji: null, es: 'pastel · torta', en: "cake", sit: 'spring', kind: 'n' },
  { id: 'kafe', kana: 'カフェ', kanji: null, es: 'café (el lugar)', en: "café", sit: 'spring', kind: 'n' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'ringo', kana: 'りんご', kanji: null, es: 'manzana', en: 'apple', sit: 'spring', kind: 'n' },
  { id: 'mikan', kana: 'みかん', kanji: null, es: 'mandarina', en: 'mandarin orange', sit: 'spring', kind: 'n' },
  { id: 'kudamono', kana: 'くだもの', kanji: '果物', es: 'fruta', en: 'fruit', sit: 'spring', kind: 'n' },
  { id: 'asagohan', kana: 'あさごはん', kanji: '朝ご飯', es: 'desayuno', en: 'breakfast', sit: 'spring', kind: 'n' },
  { id: 'hirugohan', kana: 'ひるごはん', kanji: '昼ご飯', es: 'almuerzo · comida del mediodía', en: 'lunch', sit: 'spring', kind: 'n' },
  { id: 'bangohan', kana: 'ばんごはん', kanji: '晩ご飯', es: 'cena', en: 'dinner', sit: 'spring', kind: 'n' },
  { id: 'osake', kana: 'おさけ', kanji: 'お酒', es: 'sake · bebida alcohólica', en: 'sake · alcohol', sit: 'spring', kind: 'n' },
  { id: 'sushi', kana: 'すし', kanji: null, es: 'sushi', en: 'sushi', sit: 'spring', kind: 'n' },
  { id: 'onigiri', kana: 'おにぎり', kanji: null, es: 'bola de arroz (onigiri)', en: 'rice ball', sit: 'spring', kind: 'n' },
  { id: 'amai', kana: 'あまい', kanji: '甘い', es: 'dulce', en: 'sweet', sit: 'spring', kind: 'adj' },
  { id: 'daisuki', kana: 'だいすき', kanji: '大好き', es: 'que encanta (me encanta…)', en: 'that one loves (I love…)', sit: 'spring', kind: 'adj' },
  { id: 'kirai', kana: 'きらい', kanji: '嫌い', es: 'que no gusta (no me gusta…)', en: 'disliked (I don’t like…)', sit: 'spring', kind: 'adj' },
  { id: 'omoshiroi', kana: 'おもしろい', kanji: '面白い', es: 'interesante · divertido', en: 'interesting · fun', sit: 'spring', kind: 'adj' },
  { id: 'tsumaranai', kana: 'つまらない', kanji: null, es: 'aburrido', en: 'boring', sit: 'spring', kind: 'adj' },
  // Etapa 2 del currículo
  { id: 'kuroi', kana: 'くろい', kanji: '黒い', es: 'negro', en: "black", sit: 'spring', kind: 'adj' },
  { id: 'raamen', kana: 'ラーメン', kanji: null, es: 'ramen', en: "ramen", sit: 'spring', kind: 'n' },
  { id: 'ongaku', kana: 'おんがく', kanji: '音楽', es: 'música', en: "music", sit: 'spring', kind: 'n' },
  { id: 'uta', kana: 'うた', kanji: '歌', es: 'canción', en: "song", sit: 'spring', kind: 'n' },
  { id: 'utaimasu', kana: 'うたいます', kanji: '歌います', te: 'うたって', tek: '歌って', dict: 'うたう', dictk: '歌う', es: 'cantar', en: "to sing", sit: 'spring', kind: 'v' },
  // Etapa 2 del currículo (P-08a)
  { id: 'kiiroi', kana: 'きいろい', kanji: '黄色い', es: 'amarillo', en: 'yellow', sit: 'spring', kind: 'adj' },
  { id: 'chairo', kana: 'ちゃいろ', kanji: '茶色', es: 'marrón · café (color)', en: 'brown', sit: 'spring', kind: 'n' },
  { id: 'midori', kana: 'みどり', kanji: '緑', es: 'verde', en: 'green', sit: 'spring', kind: 'n' },
  // Etapa 2 del currículo (P-08b)
  { id: 'menyuu', kana: 'メニュー', kanji: null, es: 'menú · carta', en: 'menu', sit: 'spring', kind: 'n' },
  { id: 'nomimono', kana: 'のみもの', kanji: '飲み物', es: 'bebida', en: 'drink', sit: 'spring', kind: 'n' },
  { id: 'teishoku', kana: 'ていしょく', kanji: '定食', es: 'menú completo (plato principal con arroz y sopa)', en: 'set meal', sit: 'spring', kind: 'n' },
  { id: 'karai', kana: 'からい', kanji: '辛い', es: 'picante', en: 'spicy', sit: 'spring', kind: 'adj' },
  { id: 'okaikei', kana: 'おかいけい', kanji: 'お会計', es: 'la cuenta (al pagar)', en: 'the bill · the check', sit: 'spring', kind: 'n' },
  { id: 'shumi', kana: 'しゅみ', kanji: '趣味', es: 'pasatiempo · afición', en: 'hobby', sit: 'spring', kind: 'n' },
  { id: 'dokusho', kana: 'どくしょ', kanji: '読書', es: 'lectura (como pasatiempo)', en: 'reading (as a hobby)', sit: 'spring', kind: 'n' },
  { id: 'shashin', kana: 'しゃしん', kanji: '写真', es: 'foto · fotografía', en: 'photo · photography', sit: 'spring', kind: 'n' },
  { id: 'piano', kana: 'ピアノ', kanji: null, es: 'piano', en: 'piano', sit: 'spring', kind: 'n' },
  { id: 'gitaa', kana: 'ギター', kanji: null, es: 'guitarra', en: 'guitar', sit: 'spring', kind: 'n' },
  { id: 'hikimasu', kana: 'ひきます', kanji: '弾きます', te: 'ひいて', tek: '弾いて', dict: 'ひく', dictk: '弾く', es: 'tocar (piano, guitarra)', en: 'to play (piano, guitar)', sit: 'spring', kind: 'v' },
  // P-08b+ (#49): se suma sobre P-08b (#48)
  { id: 'misoshiru', kana: 'みそしる', kanji: '味噌汁', es: 'sopa de miso', en: 'miso soup', sit: 'spring', kind: 'n' },
  { id: 'ohashi', kana: 'おはし', kanji: 'お箸', es: 'palillos (para comer)', en: 'chopsticks', sit: 'spring', kind: 'n' },
  { id: 'supuun', kana: 'スプーン', kanji: null, es: 'cuchara', en: 'spoon', sit: 'spring', kind: 'n' },
  { id: 'fooku', kana: 'フォーク', kanji: null, es: 'tenedor', en: 'fork', sit: 'spring', kind: 'n' },
  { id: 'okawari', kana: 'おかわり', kanji: 'お代わり', es: 'otra porción (del mismo plato o bebida)', en: 'second helping · refill', sit: 'spring', kind: 'n' },
  { id: 'ikaga', kana: 'いかが', kanji: null, es: 'qué tal (cortés): 〜は いかが です か = ¿quieres…?', en: 'how about (polite): 〜は いかが です か = would you like…?', sit: 'spring', kind: 'q' },
  { id: 'kashikomarimashita', kana: 'かしこまりました', kanji: null, es: 'entendido · enseguida (lo dice quien atiende)', en: 'certainly (said by staff)', sit: 'spring', kind: 'expr' },
  { id: 'kekkou', kana: 'けっこう', kanji: '結構', es: 'bien · suficiente (いいえ、けっこう です = no, gracias)', en: 'fine · enough (いいえ、けっこう です = no, thank you)', sit: 'spring', kind: 'expr' },
  // Etapa 4 del currículo
  { id: 'ryouri', kana: 'りょうり', kanji: '料理', es: 'cocina · plato', en: "cooking · dish", sit: 'spring', kind: 'n' },

  // Etapa 2 del currículo (P-08c: 2.15)
  { id: 'ryokucha', kana: 'りょくちゃ', kanji: '緑茶', es: 'té verde', en: 'green tea', sit: 'spring', kind: 'n' },
  { id: 'koucha', kana: 'こうちゃ', kanji: '紅茶', es: 'té negro', en: 'black tea', sit: 'spring', kind: 'n' },
  { id: 'bentou', kana: 'べんとう', kanji: '弁当', es: 'bentō (comida en caja)', en: 'bento (boxed meal)', sit: 'spring', kind: 'n' },
  { id: 'karee', kana: 'カレー', kanji: null, es: 'curry', en: 'curry', sit: 'spring', kind: 'n' },
  { id: 'tenpura', kana: 'てんぷら', kanji: '天ぷら', es: 'tempura (fritura japonesa)', en: 'tempura', sit: 'spring', kind: 'n' },
  { id: 'soba', kana: 'そば', kanji: null, es: 'soba (fideos de alforfón)', en: 'soba (buckwheat noodles)', sit: 'spring', kind: 'n' },
  { id: 'udon', kana: 'うどん', kanji: null, es: 'udon (fideos gruesos de trigo)', en: 'udon (thick wheat noodles)', sit: 'spring', kind: 'n' },
  { id: 'sarada', kana: 'サラダ', kanji: null, es: 'ensalada', en: 'salad', sit: 'spring', kind: 'n' },
  { id: 'mazui', kana: 'まずい', kanji: null, es: 'malo (de sabor) · que sabe mal', en: 'bad-tasting', sit: 'spring', kind: 'adj' },
  { id: 'nigai', kana: 'にがい', kanji: '苦い', es: 'amargo', en: 'bitter', sit: 'spring', kind: 'adj' },
  { id: 'sukimasu', kana: 'すきます', kanji: '空きます', te: 'すいて', tek: '空いて', dict: 'すく', dictk: '空く', es: 'vaciarse (おなか が すきました: tengo hambre)', en: 'to become empty (おなか が すきました: I am hungry)', sit: 'spring', kind: 'v' },
  { id: 'ippai', kana: 'いっぱい', kanji: null, es: 'lleno (おなか が いっぱい: estar satisfecho)', en: 'full (おなか が いっぱい: to be full)', sit: 'spring', kind: 'expr' },
  // Etapa 2 del currículo (P-08d: 2.19 y 2.23)
  { id: 'shokuji', kana: 'しょくじ', kanji: '食事', es: 'comida (en general) (しょくじ に いきます: ir a comer)', en: 'meal (しょくじ に いきます: to go out to eat)', sit: 'spring', kind: 'n' },
  { id: 'okashi', kana: 'おかし', kanji: 'お菓子', es: 'dulces · golosinas', en: 'sweets · snacks', sit: 'spring', kind: 'n' },
  { id: 'wain', kana: 'ワイン', kanji: null, es: 'vino', en: 'wine', sit: 'spring', kind: 'n' },
  { id: 'biiru', kana: 'ビール', kanji: null, es: 'cerveza', en: 'beer', sit: 'spring', kind: 'n' },
  // ── post · Compras y ciudad ──
  { id: 'kore', kana: 'これ', kanji: null, es: 'esto', en: 'this', sit: 'post', kind: 'n' },
  { id: 'ikura', kana: 'いくら', kanji: null, es: 'cuánto cuesta', en: 'how much', sit: 'post', kind: 'q' },
  { id: 'en', kana: 'えん', kanji: '円', es: 'yen', en: 'yen', sit: 'post', kind: 'n' },
  { id: 'hyaku', kana: 'ひゃく', kanji: '百', es: 'cien', en: 'hundred', sit: 'post', kind: 'num' },
  { id: 'sen', kana: 'せん', kanji: '千', es: 'mil', en: 'thousand', sit: 'post', kind: 'num' },
  { id: 'sore', kana: 'それ', kanji: null, es: 'eso', en: 'that', sit: 'post', kind: 'n' },
  { id: 'kudasai', kana: 'ください', kanji: null, es: 'dame, por favor', en: 'please give me', sit: 'post', kind: 'expr' },
  { id: 'man', kana: 'まん', kanji: '万', es: 'diez mil', en: 'ten thousand', sit: 'post', kind: 'num' },
  { id: 'ikimasu', kana: 'いきます', kanji: '行きます', te: 'いって', tek: '行って', dict: 'いく', dictk: '行く', pot: 'いけます', potk: '行けます', vol: 'いこう', volk: '行こう', ba: 'いけば', bak: '行けば', caus: 'いかせます', causk: '行かせます', es: 'ir', en: 'to go', sit: 'post', kind: 'v' },
  { id: 'doko', kana: 'どこ', kanji: null, es: 'dónde', en: 'where', sit: 'post', kind: 'q' },
  { id: 'mise', kana: 'みせ', kanji: '店', es: 'tienda', en: 'shop', sit: 'post', kind: 'n' },
  { id: 'kaimasu', kana: 'かいます', kanji: '買います', te: 'かって', tek: '買って', dict: 'かう', dictk: '買う', es: 'comprar', en: 'to buy', sit: 'post', kind: 'v' },
  { id: 'eki', kana: 'えき', kanji: '駅', es: 'estación', en: 'station', sit: 'post', kind: 'n' },
  { id: 'densha', kana: 'でんしゃ', kanji: '電車', es: 'tren', en: 'train', sit: 'post', kind: 'n' },
  { id: 'kimasu', kana: 'きます', kanji: '来ます', te: 'きて', tek: '来て', dict: 'くる', dictk: '来る', es: 'venir', en: 'to come', sit: 'post', kind: 'v' },
  { id: 'kaerimasu', kana: 'かえります', kanji: '帰ります', te: 'かえって', tek: '帰って', dict: 'かえる', dictk: '帰る', es: 'volver (a casa)', en: 'to go back (home)', sit: 'post', kind: 'v' },
  { id: 'ie', kana: 'いえ', kanji: '家', es: 'casa', en: 'house · home', sit: 'post', kind: 'n' },
  { id: 'kuruma', kana: 'くるま', kanji: '車', es: 'auto · coche', en: 'car', sit: 'post', kind: 'n' },
  { id: 'machi', kana: 'まち', kanji: '町', es: 'pueblo · ciudad', en: 'town', sit: 'post', kind: 'n' },
  { id: 'yasui', kana: 'やすい', kanji: '安い', es: 'barato', en: 'cheap', sit: 'post', kind: 'adj' },
  { id: 'okane', kana: 'おかね', kanji: 'お金', es: 'dinero', en: 'money', sit: 'post', kind: 'n' },
  { id: 'ichiba', kana: 'いちば', kanji: '市場', es: 'mercado', en: 'market', sit: 'post', kind: 'n' },
  { id: 'urimasu', kana: 'うります', kanji: '売ります', te: 'うって', tek: '売って', dict: 'うる', dictk: '売る', es: 'vender', en: 'to sell', sit: 'post', kind: 'v' },
  { id: 'doyoubi', kana: 'どようび', kanji: '土曜日', es: 'sábado', en: 'Saturday', sit: 'post', kind: 'n' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'sumaho', kana: 'スマホ', kanji: null, es: 'celular · teléfono inteligente', en: 'smartphone', sit: 'post', kind: 'n' },
  { id: 'byaku', kana: 'びゃく', kanji: '百', es: 'cien (en さんびゃく: trescientos)', en: 'hundred (in さんびゃく: three hundred)', sit: 'post', kind: 'num' },
  { id: 'zen', kana: 'ぜん', kanji: '千', es: 'mil (en さんぜん: tres mil)', en: 'thousand (in さんぜん: three thousand)', sit: 'post', kind: 'num' },
  { id: 'hitotsu', kana: 'ひとつ', kanji: '一つ', es: 'uno (una cosa)', en: 'one (thing)', sit: 'post', kind: 'num' },
  { id: 'futatsu', kana: 'ふたつ', kanji: '二つ', es: 'dos (cosas)', en: 'two (things)', sit: 'post', kind: 'num' },
  { id: 'mittsu', kana: 'みっつ', kanji: '三つ', es: 'tres (cosas)', en: 'three (things)', sit: 'post', kind: 'num' },
  { id: 'ikutsu', kana: 'いくつ', kanji: null, es: 'cuántos (cosas)', en: 'how many (things)', sit: 'post', kind: 'q' },
  { id: 'zenbu', kana: 'ぜんぶ', kanji: '全部', es: 'todo (ぜんぶ で: en total)', en: 'all (ぜんぶ で: in total)', sit: 'post', kind: 'n' },
  { id: 'toshokan', kana: 'としょかん', kanji: '図書館', es: 'biblioteca', en: 'library', sit: 'post', kind: 'n' },
  { id: 'byouin', kana: 'びょういん', kanji: '病院', es: 'hospital', en: 'hospital', sit: 'post', kind: 'n' },
  { id: 'konbini', kana: 'コンビニ', kanji: null, es: 'tienda de 24 horas', en: 'convenience store', sit: 'post', kind: 'n' },
  { id: 'ginkou', kana: 'ぎんこう', kanji: '銀行', es: 'banco', en: 'bank', sit: 'post', kind: 'n' },
  // Etapa 2 del currículo
  { id: 'furui', kana: 'ふるい', kanji: '古い', es: 'viejo · antiguo (cosas)', en: "old (things)", sit: 'post', kind: 'adj' },
  { id: 'takai', kana: 'たかい', kanji: '高い', es: 'caro · alto', en: "expensive · tall", sit: 'post', kind: 'adj' },
  // Etapa 2 del currículo (P-08a)
  { id: 'kaimono', kana: 'かいもの', kanji: '買い物', es: 'compras (かいもの を します: ir de compras)', en: 'shopping', sit: 'post', kind: 'n' },
  { id: 'depaato', kana: 'デパート', kanji: null, es: 'tienda departamental · grandes almacenes', en: 'department store', sit: 'post', kind: 'n' },
  { id: 'shatsu', kana: 'シャツ', kanji: null, es: 'camisa', en: 'shirt', sit: 'post', kind: 'n' },
  { id: 'boushi', kana: 'ぼうし', kanji: '帽子', es: 'sombrero · gorra', en: 'hat · cap', sit: 'post', kind: 'n' },
  { id: 'sukaato', kana: 'スカート', kanji: null, es: 'falda', en: 'skirt', sit: 'post', kind: 'n' },
  { id: 'zubon', kana: 'ズボン', kanji: null, es: 'pantalón', en: 'trousers · pants', sit: 'post', kind: 'n' },
  { id: 'seetaa', kana: 'セーター', kanji: null, es: 'suéter', en: 'sweater', sit: 'post', kind: 'n' },
  { id: 'kutsushita', kana: 'くつした', kanji: '靴下', es: 'calcetines', en: 'socks', sit: 'post', kind: 'n' },
  { id: 'kooto', kana: 'コート', kanji: null, es: 'abrigo', en: 'coat', sit: 'post', kind: 'n' },
  { id: 'shizuka', kana: 'しずか', kanji: '静か', es: 'tranquilo · silencioso', en: 'quiet', sit: 'post', kind: 'adj' },
  { id: 'nigiyaka', kana: 'にぎやか', kanji: null, es: 'animado · con mucho movimiento', en: 'lively · busy (place)', sit: 'post', kind: 'adj' },
  { id: 'benri', kana: 'べんり', kanji: '便利', es: 'práctico · cómodo', en: 'convenient', sit: 'post', kind: 'adj' },
  { id: 'yuumei', kana: 'ゆうめい', kanji: '有名', es: 'famoso', en: 'famous', sit: 'post', kind: 'adj' },
  // Etapa 3 del currículo
  { id: 'omoimasu', kana: 'おもいます', kanji: '思います', te: 'おもって', tek: '思って', dict: 'おもう', dictk: '思う', es: 'pensar · creer', en: "to think", sit: 'post', kind: 'v' },
  { id: 'shirimasu', kana: 'しります', kanji: '知ります', te: 'しって', tek: '知って', dict: 'しる', dictk: '知る', es: 'saber · conocer (しって います)', en: "to know (しって います)", sit: 'post', kind: 'v' },
  { id: 'kangaemasu', kana: 'かんがえます', kanji: '考えます', te: 'かんがえて', tek: '考えて', dict: 'かんがえる', dictk: '考える', es: 'pensar · reflexionar', en: "to think · consider", sit: 'post', kind: 'v' },
  // Etapa 3 del currículo (parte 2)
  { id: 'hoshii', kana: 'ほしい', kanji: '欲しい', es: 'querer (tener algo)', en: "to want (something)", sit: 'post', kind: 'adj' },
  { id: 'mono', kana: 'もの', kanji: '物', es: 'cosa · objeto', en: "thing", sit: 'post', kind: 'n' },
  { id: 'purezento', kana: 'プレゼント', kanji: null, es: 'regalo', en: "present", sit: 'post', kind: 'n' },
  { id: 'agemasu', kana: 'あげます', kanji: null, te: 'あげて', dict: 'あげる', es: 'dar (a otro)', en: "to give", sit: 'post', kind: 'v' },
  { id: 'moraimasu', kana: 'もらいます', kanji: null, te: 'もらって', dict: 'もらう', es: 'recibir', en: "to receive", sit: 'post', kind: 'v' },
  { id: 'kuremasu', kana: 'くれます', kanji: null, te: 'くれて', dict: 'くれる', es: 'dar (a mí)', en: "to give (to me)", sit: 'post', kind: 'v' },
  { id: 'okurimasu', kana: 'おくります', kanji: '送ります', te: 'おくって', tek: '送って', dict: 'おくる', dictk: '送る', es: 'enviar', en: "to send", sit: 'post', kind: 'v' },
  { id: 'kaeshimasu', kana: 'かえします', kanji: '返します', te: 'かえして', tek: '返して', dict: 'かえす', dictk: '返す', es: 'devolver', en: "to return (something)", sit: 'post', kind: 'v' },

  // Etapa 2 del currículo (P-08c: 2.14, 2.15, 2.16 y 2.18)
  { id: 'jimu', kana: 'ジム', kanji: null, es: 'gimnasio', en: 'gym', sit: 'post', kind: 'n' },
  { id: 'shokudou', kana: 'しょくどう', kanji: '食堂', es: 'comedor · cafetería', en: 'cafeteria · dining hall', sit: 'post', kind: 'n' },
  { id: 'kukkii', kana: 'クッキー', kanji: null, es: 'galleta', en: 'cookie', sit: 'post', kind: 'n' },
  { id: 'chokoreeto', kana: 'チョコレート', kanji: null, es: 'chocolate', en: 'chocolate', sit: 'post', kind: 'n' },
  { id: 'ichigo', kana: 'いちご', kanji: null, es: 'fresa', en: 'strawberry', sit: 'post', kind: 'n' },
  { id: 'purin', kana: 'プリン', kanji: null, es: 'flan', en: 'custard pudding', sit: 'post', kind: 'n' },
  { id: 'rousoku', kana: 'ろうそく', kanji: null, es: 'vela', en: 'candle', sit: 'post', kind: 'n' },
  { id: 'urikire', kana: 'うりきれ', kanji: '売り切れ', es: 'agotado', en: 'sold out', sit: 'post', kind: 'n' },
  { id: 'irimasu', kana: 'いります', kanji: null, te: 'いって', dict: 'いる', es: 'necesitar (〜が いります)', en: 'to need (〜が いります)', sit: 'post', kind: 'v' },
  { id: 'fukuro', kana: 'ふくろ', kanji: '袋', es: 'bolsa', en: 'bag (plastic or paper)', sit: 'post', kind: 'n' },
  { id: 'bijutsukan', kana: 'びじゅつかん', kanji: '美術館', es: 'museo de arte', en: 'art museum', sit: 'post', kind: 'n' },
  { id: 'hakubutsukan', kana: 'はくぶつかん', kanji: '博物館', es: 'museo (de historia o ciencia)', en: 'museum', sit: 'post', kind: 'n' },
  { id: 'yuubinkyoku', kana: 'ゆうびんきょく', kanji: '郵便局', es: 'oficina de correos', en: 'post office', sit: 'post', kind: 'n' },
  { id: 'resutoran', kana: 'レストラン', kanji: null, es: 'restaurante', en: 'restaurant', sit: 'post', kind: 'n' },
  { id: 'meisho', kana: 'めいしょ', kanji: '名所', es: 'lugar famoso (para visitar)', en: 'famous sight', sit: 'post', kind: 'n' },
  { id: 'chizu', kana: 'ちず', kanji: '地図', es: 'mapa', en: 'map', sit: 'post', kind: 'n' },
  { id: 'hoteru', kana: 'ホテル', kanji: null, es: 'hotel', en: 'hotel', sit: 'post', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.19, 2.20 y 2.21)
  { id: 'eigakan', kana: 'えいがかん', kanji: '映画館', es: 'cine', en: 'movie theater', sit: 'post', kind: 'n' },
  { id: 'chiketto', kana: 'チケット', kanji: null, es: 'entrada · boleto', en: 'ticket', sit: 'post', kind: 'n' },
  { id: 'omiyage', kana: 'おみやげ', kanji: 'お土産', es: 'recuerdo · regalo de un viaje', en: 'souvenir', sit: 'post', kind: 'n' },
  { id: 'kinjo', kana: 'きんじょ', kanji: '近所', es: 'el barrio · los alrededores de casa', en: 'neighborhood', sit: 'post', kind: 'n' },
  { id: 'shoutengai', kana: 'しょうてんがい', kanji: '商店街', es: 'calle comercial (de tiendas pequeñas)', en: 'shopping street', sit: 'post', kind: 'n' },
  { id: 'kissaten', kana: 'きっさてん', kanji: '喫茶店', es: 'cafetería (de estilo tradicional)', en: 'coffee shop', sit: 'post', kind: 'n' },
  { id: 'honya', kana: 'ほんや', kanji: '本屋', es: 'librería', en: 'bookstore', sit: 'post', kind: 'n' },
  { id: 'panya', kana: 'パンや', kanji: 'パン屋', es: 'panadería', en: 'bakery', sit: 'post', kind: 'n' },
  { id: 'hanaya', kana: 'はなや', kanji: '花屋', es: 'florería', en: 'flower shop', sit: 'post', kind: 'n' },
  { id: 'yaoya', kana: 'やおや', kanji: '八百屋', es: 'verdulería', en: 'greengrocer', sit: 'post', kind: 'n' },
  { id: 'nikuya', kana: 'にくや', kanji: '肉屋', es: 'carnicería', en: 'butcher shop', sit: 'post', kind: 'n' },
  { id: 'sakanaya', kana: 'さかなや', kanji: '魚屋', es: 'pescadería', en: 'fish shop', sit: 'post', kind: 'n' },
  { id: 'kouban', kana: 'こうばん', kanji: '交番', es: 'puesto de policía (del barrio)', en: 'police box', sit: 'post', kind: 'n' },
  { id: 'chuushajou', kana: 'ちゅうしゃじょう', kanji: '駐車場', es: 'estacionamiento', en: 'parking lot', sit: 'post', kind: 'n' },
  { id: 'biru', kana: 'ビル', kanji: null, es: 'edificio (de oficinas o tiendas)', en: 'building (offices or shops)', sit: 'post', kind: 'n' },
  { id: 'tatemono', kana: 'たてもの', kanji: '建物', es: 'edificio · construcción', en: 'building', sit: 'post', kind: 'n' },
  { id: 'manshon', kana: 'マンション', kanji: null, es: 'edificio de apartamentos', en: 'apartment building', sit: 'post', kind: 'n' },
  { id: 'kyoukai', kana: 'きょうかい', kanji: '教会', es: 'iglesia', en: 'church', sit: 'post', kind: 'n' },
  { id: 'puuru', kana: 'プール', kanji: null, es: 'piscina', en: 'swimming pool', sit: 'post', kind: 'n' },
  { id: 'akimasu', kana: 'あきます', kanji: '開きます', te: 'あいて', tek: '開いて', dict: 'あく', dictk: '開く', es: 'abrirse (la tienda abre; あいて います: está abierto)', en: 'to open (the shop opens; あいて います: it is open)', sit: 'post', kind: 'v' },
  // ── ruins · Objetos y estudio ──
  { id: 'hon', kana: 'ほん', kanji: '本', es: 'libro', en: 'book', sit: 'ruins', kind: 'n' },
  { id: 'sensei', kana: 'せんせい', kanji: '先生', es: 'profesor · maestra', en: 'teacher', sit: 'ruins', kind: 'n' },
  { id: 'gakkou', kana: 'がっこう', kanji: '学校', es: 'escuela', en: 'school', sit: 'ruins', kind: 'n' },
  { id: 'arimasu', kana: 'あります', kanji: null, te: 'あって', dict: 'ある', es: 'haber · estar (cosas)', en: 'there is · to be (things)', sit: 'ruins', kind: 'v' },
  { id: 'heya', kana: 'へや', kanji: '部屋', es: 'habitación', en: 'room', sit: 'ruins', kind: 'n' },
  { id: 'tsukue', kana: 'つくえ', kanji: '机', es: 'escritorio', en: 'desk', sit: 'ruins', kind: 'n' },
  { id: 'ue', kana: 'うえ', kanji: '上', es: 'arriba · encima', en: 'above · on top', sit: 'ruins', kind: 'n' },
  { id: 'naka', kana: 'なか', kanji: '中', es: 'dentro', en: 'inside', sit: 'ruins', kind: 'n' },
  { id: 'kaban', kana: 'かばん', kanji: null, es: 'bolso · mochila', en: 'bag', sit: 'ruins', kind: 'n' },
  { id: 'nihongo', kana: 'にほんご', kanji: '日本語', es: 'idioma japonés', en: 'Japanese (language)', sit: 'ruins', kind: 'n' },
  { id: 'yomimasu', kana: 'よみます', kanji: '読みます', te: 'よんで', tek: '読んで', dict: 'よむ', dictk: '読む', pot: 'よめます', potk: '読めます', potd: 'よめる', potdk: '読める', caus: 'よませます', causk: '読ませます', es: 'leer', en: 'to read', sit: 'ruins', kind: 'v' },
  { id: 'kanji', kana: 'かんじ', kanji: '漢字', es: 'kanji', en: 'kanji', sit: 'ruins', kind: 'n' },
  { id: 'benkyou', kana: 'べんきょう', kanji: '勉強', es: 'estudio', en: 'study', sit: 'ruins', kind: 'n' },
  { id: 'shimasu', kana: 'します', kanji: null, te: 'して', dict: 'する', vol: 'しよう', ba: 'すれば', caus: 'させます', es: 'hacer', en: 'to do', sit: 'ruins', kind: 'v' },
  { id: 'kaisha', kana: 'かいしゃ', kanji: '会社', es: 'empresa · oficina', en: 'company · office', sit: 'ruins', kind: 'n' },
  { id: 'hatarakimasu', kana: 'はたらきます', kanji: '働きます', te: 'はたらいて', tek: '働いて', dict: 'はたらく', dictk: '働く', es: 'trabajar', en: 'to work', sit: 'ruins', kind: 'v' },
  { id: 'kakimasu', kana: 'かきます', kanji: '書きます', te: 'かいて', tek: '書いて', dict: 'かく', dictk: '書く', es: 'escribir', en: 'to write', sit: 'ruins', kind: 'v' },
  { id: 'tegami', kana: 'てがみ', kanji: '手紙', es: 'carta', en: 'letter', sit: 'ruins', kind: 'n' },
  { id: 'shigoto', kana: 'しごと', kanji: '仕事', es: 'trabajo', en: 'work · job', sit: 'ruins', kind: 'n' },
  { id: 'sara', kana: 'さら', kanji: '皿', es: 'plato', en: 'plate', sit: 'ruins', kind: 'n' },
  // Agregadas para el currículo (etapa 1)
  { id: 'are', kana: 'あれ', kanji: null, es: 'aquello', en: "that (over there)", sit: 'ruins', kind: 'n' },
  { id: 'kuchi', kana: 'くち', kanji: '口', es: 'boca', en: "mouth", sit: 'ruins', kind: 'n' },
  { id: 'shita', kana: 'した', kanji: '下', es: 'abajo · debajo', en: "below · under", sit: 'ruins', kind: 'n' },
  { id: 'ushiro', kana: 'うしろ', kanji: '後ろ', es: 'detrás', en: "behind", sit: 'ruins', kind: 'n' },
  { id: 'mado', kana: 'まど', kanji: '窓', es: 'ventana', en: "window", sit: 'ruins', kind: 'n' },
  { id: 'mon', kana: 'もん', kanji: '門', es: 'portón · puerta de entrada', en: "gate", sit: 'ruins', kind: 'n' },
  { id: 'hanashimasu', kana: 'はなします', kanji: '話します', te: 'はなして', tek: '話して', dict: 'はなす', dictk: '話す', pot: 'はなせます', potk: '話せます', potd: 'はなせる', potdk: '話せる', es: 'hablar', en: "to speak", sit: 'ruins', kind: 'v' },
  { id: 'kikimasu', kana: 'ききます', kanji: '聞きます', te: 'きいて', tek: '聞いて', dict: 'きく', dictk: '聞く', es: 'escuchar · preguntar', en: "to listen · to ask", sit: 'ruins', kind: 'v' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'pen', kana: 'ペン', kanji: null, es: 'bolígrafo · pluma', en: 'pen', sit: 'ruins', kind: 'n' },
  { id: 'nooto', kana: 'ノート', kanji: null, es: 'cuaderno', en: 'notebook', sit: 'ruins', kind: 'n' },
  { id: 'enpitsu', kana: 'えんぴつ', kanji: '鉛筆', es: 'lápiz', en: 'pencil', sit: 'ruins', kind: 'n' },
  { id: 'jisho', kana: 'じしょ', kanji: '辞書', es: 'diccionario', en: 'dictionary', sit: 'ruins', kind: 'n' },
  { id: 'shinbun', kana: 'しんぶん', kanji: '新聞', es: 'periódico', en: 'newspaper', sit: 'ruins', kind: 'n' },
  { id: 'zasshi', kana: 'ざっし', kanji: '雑誌', es: 'revista', en: 'magazine', sit: 'ruins', kind: 'n' },
  { id: 'jugyou', kana: 'じゅぎょう', kanji: '授業', es: 'clase', en: 'class · lesson', sit: 'ruins', kind: 'n' },
  { id: 'isu', kana: 'いす', kanji: '椅子', es: 'silla', en: 'chair', sit: 'ruins', kind: 'n' },
  // Etapa 2 del currículo (P-08a)
  { id: 'omoi', kana: 'おもい', kanji: '重い', es: 'pesado', en: 'heavy', sit: 'ruins', kind: 'adj' },
  { id: 'karui', kana: 'かるい', kanji: '軽い', es: 'liviano · ligero', en: 'light (not heavy)', sit: 'ruins', kind: 'adj' },
  { id: 'hiroi', kana: 'ひろい', kanji: '広い', es: 'amplio · espacioso', en: 'spacious · wide', sit: 'ruins', kind: 'adj' },
  { id: 'semai', kana: 'せまい', kanji: '狭い', es: 'estrecho · pequeño (lugar)', en: 'narrow · cramped', sit: 'ruins', kind: 'adj' },
  { id: 'muzukashii', kana: 'むずかしい', kanji: '難しい', es: 'difícil', en: 'difficult', sit: 'ruins', kind: 'adj' },
  // Etapa 2 del currículo (P-08b)
  { id: 'daidokoro', kana: 'だいどころ', kanji: '台所', es: 'cocina (el lugar de la casa)', en: 'kitchen', sit: 'ruins', kind: 'n' },
  { id: 'apaato', kana: 'アパート', kanji: null, es: 'apartamento · departamento', en: 'apartment', sit: 'ruins', kind: 'n' },
  { id: 'reizouko', kana: 'れいぞうこ', kanji: '冷蔵庫', es: 'refrigerador', en: 'refrigerator', sit: 'ruins', kind: 'n' },
  { id: 'sofaa', kana: 'ソファー', kanji: null, es: 'sofá', en: 'sofa', sit: 'ruins', kind: 'n' },
  { id: 'karimasu', kana: 'かります', kanji: '借ります', te: 'かりて', tek: '借りて', dict: 'かりる', dictk: '借りる', es: 'pedir prestado · tomar prestado', en: 'to borrow', sit: 'ruins', kind: 'v' },
  { id: 'tsukaimasu', kana: 'つかいます', kanji: '使います', te: 'つかって', tek: '使って', dict: 'つかう', dictk: '使う', es: 'usar', en: 'to use', sit: 'ruins', kind: 'v' },
  { id: 'denwa', kana: 'でんわ', kanji: '電話', es: 'teléfono · llamada (でんわ を します: llamar)', en: 'telephone · call (でんわ を します: to call)', sit: 'ruins', kind: 'n' },
  // P-08b+ (#49): se suma sobre P-08b (#48)
  { id: 'genkan', kana: 'げんかん', kanji: '玄関', es: 'entrada de la casa (donde se dejan los zapatos)', en: 'entrance hall (where shoes are left)', sit: 'ruins', kind: 'n' },
  { id: 'kaidan', kana: 'かいだん', kanji: '階段', es: 'escalera', en: 'stairs', sit: 'ruins', kind: 'n' },
  { id: 'kai', kana: 'かい', kanji: '階', es: 'piso de un edificio (contador: に かい = segundo piso; さん がい = tercer piso)', en: 'floor of a building (counter: に かい = second floor)', sit: 'ruins', kind: 'n' },
  { id: 'eakon', kana: 'エアコン', kanji: null, es: 'aire acondicionado', en: 'air conditioner', sit: 'ruins', kind: 'n' },
  { id: 'doa', kana: 'ドア', kanji: null, es: 'puerta', en: 'door', sit: 'ruins', kind: 'n' },
  { id: 'akarui', kana: 'あかるい', kanji: '明るい', es: 'luminoso · con mucha luz', en: 'bright', sit: 'ruins', kind: 'adj' },
  { id: 'kurai', kana: 'くらい', kanji: '暗い', es: 'oscuro', en: 'dark', sit: 'ruins', kind: 'adj' },
  { id: 'denki', kana: 'でんき', kanji: '電気', es: 'luz (eléctrica) · electricidad', en: 'light · electricity', sit: 'ruins', kind: 'n' },
  { id: 'tsukemasu', kana: 'つけます', kanji: null, te: 'つけて', dict: 'つける', es: 'encender (la luz, la tele…)', en: 'to turn on (a light, the TV…)', sit: 'ruins', kind: 'v' },
  { id: 'keshimasu', kana: 'けします', kanji: '消します', te: 'けして', tek: '消して', dict: 'けす', dictk: '消す', es: 'apagar (la luz, la tele…)', en: 'to turn off (a light, the TV…)', sit: 'ruins', kind: 'v' },
  { id: 'tachimasu', kana: 'たちます', kanji: '立ちます', te: 'たって', tek: '立って', dict: 'たつ', dictk: '立つ', es: 'ponerse de pie', en: 'to stand up', sit: 'ruins', kind: 'v' },
  { id: 'wakarimasu', kana: 'わかります', kanji: '分かります', te: 'わかって', tek: '分かって', dict: 'わかる', dictk: '分かる', es: 'entender', en: 'to understand', sit: 'ruins', kind: 'v' },
  // Etapa 4 del currículo
  { id: 'dekimasu', kana: 'できます', kanji: null, te: 'できて', dict: 'できる', es: 'poder · saber hacer', en: "can · be able to", sit: 'ruins', kind: 'v' },
  { id: 'jouzu', kana: 'じょうず', kanji: '上手', es: 'hábil · bueno en', en: "good at", sit: 'ruins', kind: 'adj' },
  { id: 'heta', kana: 'へた', kanji: '下手', es: 'malo en · torpe', en: "bad at", sit: 'ruins', kind: 'adj' },
  { id: 'chikara', kana: 'ちから', kanji: '力', es: 'fuerza', en: "strength", sit: 'ruins', kind: 'n' },
  { id: 'tsumori', kana: 'つもり', kanji: null, es: 'intención (〜する つもり)', en: "intention (〜する つもり)", sit: 'ruins', kind: 'n' },
  { id: 'yotei', kana: 'よてい', kanji: '予定', es: 'plan · lo previsto', en: "plan · schedule", sit: 'ruins', kind: 'n' },
  { id: 'yakusoku', kana: 'やくそく', kanji: '約束', es: 'promesa · cita', en: "promise · appointment", sit: 'ruins', kind: 'n' },
  // Etapa 4 del currículo (parte 2)
  { id: 'oshiemasu', kana: 'おしえます', kanji: '教えます', te: 'おしえて', tek: '教えて', dict: 'おしえる', dictk: '教える', es: 'enseñar', en: "to teach", sit: 'ruins', kind: 'v' },
  { id: 'naraimasu', kana: 'ならいます', kanji: '習います', te: 'ならって', tek: '習って', dict: 'ならう', dictk: '習う', es: 'aprender (con alguien)', en: "to learn (from someone)", sit: 'ruins', kind: 'v' },
  { id: 'youni', kana: 'ように', kanji: null, es: 'para que · de modo que', en: "so that", sit: 'ruins', kind: 'expr' },
  { id: 'tame', kana: 'ため', kanji: null, es: 'para · con el fin de (〜の ため に)', en: "for · in order to", sit: 'ruins', kind: 'n' },
  { id: 'mokuteki', kana: 'もくてき', kanji: '目的', es: 'objetivo · propósito', en: "purpose", sit: 'ruins', kind: 'n' },
  { id: 'negai', kana: 'ねがい', kanji: '願い', es: 'deseo', en: "wish", sit: 'ruins', kind: 'n' },

  // Etapa 2 del currículo (P-08d: 2.19 y 2.22)
  { id: 'mochimasu', kana: 'もちます', kanji: '持ちます', te: 'もって', tek: '持って', dict: 'もつ', dictk: '持つ', es: 'tener · llevar en la mano (もって いきます: llevar algo)', en: 'to hold · to carry (もって いきます: to take along)', sit: 'ruins', kind: 'v' },
  { id: 'kaigi', kana: 'かいぎ', kanji: '会議', es: 'reunión (de trabajo)', en: 'meeting', sit: 'ruins', kind: 'n' },
  { id: 'jimusho', kana: 'じむしょ', kanji: '事務所', es: 'oficina', en: 'office', sit: 'ruins', kind: 'n' },
  { id: 'pasokon', kana: 'パソコン', kanji: null, es: 'computadora', en: 'computer', sit: 'ruins', kind: 'n' },
  { id: 'kopii', kana: 'コピー', kanji: null, es: 'copia (コピー します: fotocopiar)', en: 'copy (コピー します: to photocopy)', sit: 'ruins', kind: 'n' },
  { id: 'meeru', kana: 'メール', kanji: null, es: 'correo electrónico · mensaje', en: 'email · message', sit: 'ruins', kind: 'n' },
  { id: 'bangou', kana: 'ばんごう', kanji: '番号', es: 'número (でんわ ばんごう: número de teléfono)', en: 'number (でんわ ばんごう: phone number)', sit: 'ruins', kind: 'n' },
  { id: 'hiruyasumi', kana: 'ひるやすみ', kanji: '昼休み', es: 'descanso del mediodía', en: 'lunch break', sit: 'ruins', kind: 'n' },
  { id: 'kyuukei', kana: 'きゅうけい', kanji: '休憩', es: 'descanso (きゅうけい します: descansar un rato)', en: 'break (きゅうけい します: to take a break)', sit: 'ruins', kind: 'n' },
  { id: 'zangyou', kana: 'ざんぎょう', kanji: '残業', es: 'horas extra (ざんぎょう します: quedarse a trabajar)', en: 'overtime (ざんぎょう します: to work overtime)', sit: 'ruins', kind: 'n' },
  { id: 'shucchou', kana: 'しゅっちょう', kanji: '出張', es: 'viaje de trabajo', en: 'business trip', sit: 'ruins', kind: 'n' },
  { id: 'arubaito', kana: 'アルバイト', kanji: null, es: 'trabajo de medio tiempo (en corto: バイト)', en: 'part-time job (short: バイト)', sit: 'ruins', kind: 'n' },
  { id: 'shifuto', kana: 'シフト', kanji: null, es: 'turno (de trabajo)', en: 'shift (at work)', sit: 'ruins', kind: 'n' },
  { id: 'hajimarimasu', kana: 'はじまります', kanji: '始まります', te: 'はじまって', tek: '始まって', dict: 'はじまる', dictk: '始まる', es: 'empezar (algo empieza: la reunión empieza)', en: 'to begin (something begins)', sit: 'ruins', kind: 'v' },
  { id: 'tsukaremasu', kana: 'つかれます', kanji: '疲れます', te: 'つかれて', tek: '疲れて', dict: 'つかれる', dictk: '疲れる', es: 'cansarse (つかれました: estoy cansado)', en: 'to get tired (つかれました: I am tired)', sit: 'ruins', kind: 'v' },
  { id: 'chikoku', kana: 'ちこく', kanji: '遅刻', es: 'llegada tarde (ちこく します: llegar tarde)', en: 'being late (ちこく します: to be late)', sit: 'ruins', kind: 'n' },
  { id: 'kayoimasu', kana: 'かよいます', kanji: '通います', te: 'かよって', tek: '通って', dict: 'かよう', dictk: '通う', es: 'ir con regularidad (a la escuela, al trabajo)', en: 'to commute · to attend regularly', sit: 'ruins', kind: 'v' },
  // ── ranch · Animales y campo ──
  { id: 'inu', kana: 'いぬ', kanji: '犬', es: 'perro', en: 'dog', sit: 'ranch', kind: 'n' },
  { id: 'imasu', kana: 'います', kanji: null, te: 'いて', dict: 'いる', es: 'haber · estar (personas y animales)', en: 'there is · to be (people and animals)', sit: 'ranch', kind: 'v' },
  { id: 'neko', kana: 'ねこ', kanji: '猫', es: 'gato', en: 'cat', sit: 'ranch', kind: 'n' },
  { id: 'kawaii', kana: 'かわいい', kanji: null, es: 'lindo · tierno', en: 'cute', sit: 'ranch', kind: 'adj' },
  { id: 'uma', kana: 'うま', kanji: '馬', es: 'caballo', en: 'horse', sit: 'ranch', kind: 'n' },
  { id: 'ushi', kana: 'うし', kanji: '牛', es: 'vaca', en: 'cow', sit: 'ranch', kind: 'n' },
  { id: 'takusan', kana: 'たくさん', kanji: null, es: 'muchos · mucho', en: 'many · a lot', sit: 'ranch', kind: 'expr' },
  { id: 'doubutsu', kana: 'どうぶつ', kanji: '動物', es: 'animal', en: 'animal', sit: 'ranch', kind: 'n' },
  { id: 'niwa', kana: 'にわ', kanji: '庭', es: 'jardín · patio', en: 'garden · yard', sit: 'ranch', kind: 'n' },
  { id: 'tori', kana: 'とり', kanji: '鳥', es: 'pájaro · ave', en: 'bird', sit: 'ranch', kind: 'n' },
  { id: 'tsukurimasu', kana: 'つくります', kanji: '作ります', te: 'つくって', tek: '作って', dict: 'つくる', dictk: '作る', es: 'hacer · producir · cultivar', en: 'to make · to grow', sit: 'ranch', kind: 'v' },
  { id: 'yasai', kana: 'やさい', kanji: '野菜', es: 'verdura', en: 'vegetables', sit: 'ranch', kind: 'n' },
  { id: 'mame', kana: 'まめ', kanji: '豆', es: 'porotos · frijoles', en: 'beans', sit: 'ranch', kind: 'n' },
  { id: 'hatake', kana: 'はたけ', kanji: '畑', es: 'huerta · campo de cultivo', en: 'field · vegetable plot', sit: 'ranch', kind: 'n' },
  { id: 'kome', kana: 'こめ', kanji: '米', es: 'arroz (en grano)', en: 'rice (uncooked)', sit: 'ranch', kind: 'n' },
  { id: 'tamago', kana: 'たまご', kanji: '卵', es: 'huevo', en: 'egg', sit: 'ranch', kind: 'n' },
  { id: 'mura', kana: 'むら', kanji: '村', es: 'aldea', en: 'village', sit: 'ranch', kind: 'n' },
  { id: 'gyuunyuu', kana: 'ぎゅうにゅう', kanji: '牛乳', es: 'leche', en: 'milk', sit: 'ranch', kind: 'n' },
  { id: 'hayai', kana: 'はやい', kanji: '速い', es: 'rápido', en: 'fast', sit: 'ranch', kind: 'adj' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'mimi', kana: 'みみ', kanji: '耳', es: 'oreja · oído', en: 'ear', sit: 'ranch', kind: 'n' },
  { id: 'petto', kana: 'ペット', kanji: null, es: 'mascota', en: 'pet', sit: 'ranch', kind: 'n' },
  { id: 'beddo', kana: 'ベッド', kanji: null, es: 'cama', en: 'bed', sit: 'ranch', kind: 'n' },
  { id: 'toire', kana: 'トイレ', kanji: null, es: 'baño', en: 'toilet · restroom', sit: 'ranch', kind: 'n' },
  // Etapa 3 del currículo
  { id: 'atama', kana: 'あたま', kanji: '頭', es: 'cabeza', en: "head", sit: 'ranch', kind: 'n' },
  { id: 'te', kana: 'て', kanji: '手', es: 'mano', en: "hand", sit: 'ranch', kind: 'n' },
  { id: 'karada', kana: 'からだ', kanji: '体', es: 'cuerpo', en: "body", sit: 'ranch', kind: 'n' },
  { id: 'byouki', kana: 'びょうき', kanji: '病気', es: 'enfermedad · enfermo', en: "illness · sick", sit: 'ranch', kind: 'n' },
  { id: 'kusuri', kana: 'くすり', kanji: '薬', es: 'remedio', en: "medicine", sit: 'ranch', kind: 'n' },
  { id: 'itai', kana: 'いたい', kanji: '痛い', es: 'duele · doloroso', en: "painful · it hurts", sit: 'ranch', kind: 'adj' },
  // Etapa 3 del currículo (parte 2)
  { id: 'kokoro', kana: 'こころ', kanji: '心', es: 'corazón · mente', en: "heart · mind", sit: 'ranch', kind: 'n' },
  // Etapa 4 del currículo
  { id: 'irasshaimase', kana: 'いらっしゃいませ', kanji: null, es: '¡bienvenido! (en una tienda)', en: "welcome! (in a shop)", sit: 'ranch', kind: 'expr' },
  { id: 'shoushou', kana: 'しょうしょう', kanji: '少々', es: 'un momento · un poco (formal)', en: "a moment · a little (polite)", sit: 'ranch', kind: 'expr' },
  { id: 'omachikudasai', kana: 'おまちください', kanji: 'お待ちください', es: 'espere, por favor (formal)', en: "please wait (polite)", sit: 'ranch', kind: 'expr' },
  { id: 'okyakusan', kana: 'おきゃくさん', kanji: 'お客さん', es: 'cliente · visita', en: "customer · guest", sit: 'ranch', kind: 'n' },
  { id: 'shain', kana: 'しゃいん', kanji: '社員', es: 'empleado de una empresa', en: "company employee", sit: 'ranch', kind: 'n' },

  // Etapa 2 del currículo (P-08c: 2.15 y 2.18)
  { id: 'onaka', kana: 'おなか', kanji: 'お腹', es: 'barriga · estómago', en: 'stomach · belly', sit: 'ranch', kind: 'n' },
  { id: 'inaka', kana: 'いなか', kanji: '田舎', es: 'el campo · pueblo de origen', en: 'the countryside · hometown', sit: 'ranch', kind: 'n' },
  { id: 'shizen', kana: 'しぜん', kanji: '自然', es: 'naturaleza', en: 'nature', sit: 'ranch', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.19 y 2.20)
  { id: 'doubutsuen', kana: 'どうぶつえん', kanji: '動物園', es: 'zoológico', en: 'zoo', sit: 'ranch', kind: 'n' },
  { id: 'suizokukan', kana: 'すいぞくかん', kanji: '水族館', es: 'acuario', en: 'aquarium', sit: 'ranch', kind: 'n' },
  { id: 'yuuenchi', kana: 'ゆうえんち', kanji: '遊園地', es: 'parque de diversiones', en: 'amusement park', sit: 'ranch', kind: 'n' },
  { id: 'onsen', kana: 'おんせん', kanji: '温泉', es: 'aguas termales', en: 'hot spring', sit: 'ranch', kind: 'n' },
  { id: 'mizuumi', kana: 'みずうみ', kanji: '湖', es: 'lago', en: 'lake', sit: 'ranch', kind: 'n' },
  { id: 'keshiki', kana: 'けしき', kanji: '景色', es: 'paisaje · vista', en: 'scenery · view', sit: 'ranch', kind: 'n' },
  { id: 'shima', kana: 'しま', kanji: '島', es: 'isla', en: 'island', sit: 'ranch', kind: 'n' },
  { id: 'fujisan', kana: 'ふじさん', kanji: '富士山', es: 'el monte Fuji', en: 'Mount Fuji', sit: 'ranch', kind: 'n' },
  { id: 'noborimasu', kana: 'のぼります', kanji: '登ります', te: 'のぼって', tek: '登って', dict: 'のぼる', dictk: '登る', es: 'subir · escalar (una montaña)', en: 'to climb (a mountain)', sit: 'ranch', kind: 'v' },
  // ── lake · Clima y direcciones ──
  { id: 'tenki', kana: 'てんき', kanji: '天気', es: 'tiempo · clima', en: 'weather', sit: 'lake', kind: 'n' },
  { id: 'ii', kana: 'いい', kanji: null, es: 'bueno', en: 'good', sit: 'lake', kind: 'adj' },
  { id: 'ame', kana: 'あめ', kanji: '雨', es: 'lluvia', en: 'rain', sit: 'lake', kind: 'n' },
  { id: 'furimasu', kana: 'ふります', kanji: '降ります', te: 'ふって', tek: '降って', dict: 'ふる', dictk: '降る', ba: 'ふれば', bak: '降れば', pass: 'ふられます', passk: '降られます', es: 'caer (lluvia, nieve)', en: 'to fall (rain, snow)', sit: 'lake', kind: 'v' },
  { id: 'yama', kana: 'やま', kanji: '山', es: 'montaña', en: 'mountain', sit: 'lake', kind: 'n' },
  { id: 'kawa', kana: 'かわ', kanji: '川', es: 'río', en: 'river', sit: 'lake', kind: 'n' },
  { id: 'kirei', kana: 'きれい', kanji: null, es: 'bonito · limpio', en: 'pretty · clean', sit: 'lake', kind: 'adj' },
  { id: 'hana', kana: 'はな', kanji: '花', es: 'flor', en: 'flower', sit: 'lake', kind: 'n' },
  { id: 'samui', kana: 'さむい', kanji: '寒い', es: 'frío (hace frío)', en: 'cold (weather)', sit: 'lake', kind: 'adj' },
  { id: 'fuyu', kana: 'ふゆ', kanji: '冬', es: 'invierno', en: 'winter', sit: 'lake', kind: 'n' },
  { id: 'atsui', kana: 'あつい', kanji: '暑い', es: 'caluroso (hace calor)', en: 'hot (weather)', sit: 'lake', kind: 'adj' },
  { id: 'natsu', kana: 'なつ', kanji: '夏', es: 'verano', en: 'summer', sit: 'lake', kind: 'n' },
  { id: 'migi', kana: 'みぎ', kanji: '右', es: 'derecha', en: 'right', sit: 'lake', kind: 'n' },
  { id: 'michi', kana: 'みち', kanji: '道', es: 'camino · calle', en: 'road · street', sit: 'lake', kind: 'n' },
  { id: 'hidari', kana: 'ひだり', kanji: '左', es: 'izquierda', en: 'left', sit: 'lake', kind: 'n' },
  { id: 'umi', kana: 'うみ', kanji: '海', es: 'mar', en: 'sea', sit: 'lake', kind: 'n' },
  { id: 'minami', kana: 'みなみ', kanji: '南', es: 'sur', en: 'south', sit: 'lake', kind: 'n' },
  { id: 'kita', kana: 'きた', kanji: '北', es: 'norte', en: 'north', sit: 'lake', kind: 'n' },
  { id: 'sora', kana: 'そら', kanji: '空', es: 'cielo', en: 'sky', sit: 'lake', kind: 'n' },
  { id: 'ki', kana: 'き', kanji: '木', es: 'árbol', en: 'tree', sit: 'lake', kind: 'n' },
  { id: 'higashi', kana: 'ひがし', kanji: '東', es: 'este', en: 'east', sit: 'lake', kind: 'n' },
  { id: 'nishi', kana: 'にし', kanji: '西', es: 'oeste', en: 'west', sit: 'lake', kind: 'n' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'kasa', kana: 'かさ', kanji: '傘', es: 'paraguas', en: 'umbrella', sit: 'lake', kind: 'n' },
  { id: 'basu', kana: 'バス', kanji: null, es: 'autobús', en: 'bus', sit: 'lake', kind: 'n' },
  { id: 'takushii', kana: 'タクシー', kanji: null, es: 'taxi', en: 'taxi', sit: 'lake', kind: 'n' },
  { id: 'jitensha', kana: 'じてんしゃ', kanji: '自転車', es: 'bicicleta', en: 'bicycle', sit: 'lake', kind: 'n' },
  { id: 'hikouki', kana: 'ひこうき', kanji: '飛行機', es: 'avión', en: 'airplane', sit: 'lake', kind: 'n' },
  { id: 'kuukou', kana: 'くうこう', kanji: '空港', es: 'aeropuerto', en: 'airport', sit: 'lake', kind: 'n' },
  { id: 'kouen', kana: 'こうえん', kanji: '公園', es: 'parque', en: 'park', sit: 'lake', kind: 'n' },
  { id: 'aimasu', kana: 'あいます', kanji: '会います', te: 'あって', tek: '会って', dict: 'あう', dictk: '会う', es: 'ver a alguien · encontrarse (〜に あいます)', en: 'meet (〜に あいます)', sit: 'lake', kind: 'v' },
  { id: 'machimasu', kana: 'まちます', kanji: '待ちます', te: 'まって', tek: '待って', dict: 'まつ', dictk: '待つ', es: 'esperar', en: 'wait', sit: 'lake', kind: 'v' },
  // Etapa 2 del currículo
  { id: 'yuki', kana: 'ゆき', kanji: '雪', es: 'nieve', en: "snow", sit: 'lake', kind: 'n' },
  { id: 'haru', kana: 'はる', kanji: '春', es: 'primavera', en: "spring (season)", sit: 'lake', kind: 'n' },
  { id: 'aki', kana: 'あき', kanji: '秋', es: 'otoño', en: "autumn", sit: 'lake', kind: 'n' },
  { id: 'massugu', kana: 'まっすぐ', kanji: null, es: 'derecho (sin doblar)', en: "straight ahead", sit: 'lake', kind: 'expr' },
  { id: 'magarimasu', kana: 'まがります', kanji: '曲がります', te: 'まがって', tek: '曲がって', dict: 'まがる', dictk: '曲がる', es: 'doblar (en una esquina)', en: "to turn", sit: 'lake', kind: 'v' },
  // Etapa 2 del currículo (P-08a)
  { id: 'hare', kana: 'はれ', kanji: '晴れ', es: 'cielo despejado · buen tiempo', en: 'clear weather · sunny', sit: 'lake', kind: 'n' },
  { id: 'kumori', kana: 'くもり', kanji: '曇り', es: 'nublado', en: 'cloudy weather', sit: 'lake', kind: 'n' },
  { id: 'atatakai', kana: 'あたたかい', kanji: '暖かい', es: 'templado · agradable (clima)', en: 'warm (weather)', sit: 'lake', kind: 'adj' },
  { id: 'suzushii', kana: 'すずしい', kanji: '涼しい', es: 'fresco (clima)', en: 'cool (weather)', sit: 'lake', kind: 'adj' },
  { id: 'kisetsu', kana: 'きせつ', kanji: '季節', es: 'estación del año', en: 'season', sit: 'lake', kind: 'n' },
  // Etapa 2 del currículo (P-08b)
  { id: 'tsugi', kana: 'つぎ', kanji: '次', es: 'siguiente · próximo', en: 'next', sit: 'lake', kind: 'n' },
  { id: 'kado', kana: 'かど', kanji: '角', es: 'esquina', en: 'corner', sit: 'lake', kind: 'n' },
  { id: 'shingou', kana: 'しんごう', kanji: '信号', es: 'semáforo', en: 'traffic light', sit: 'lake', kind: 'n' },
  { id: 'watarimasu', kana: 'わたります', kanji: '渡ります', te: 'わたって', tek: '渡って', dict: 'わたる', dictk: '渡る', es: 'cruzar (una calle, un puente)', en: 'to cross', sit: 'lake', kind: 'v' },
  { id: 'chikai', kana: 'ちかい', kanji: '近い', es: 'cercano · (estar) cerca', en: 'near · close', sit: 'lake', kind: 'adj' },
  { id: 'tooi', kana: 'とおい', kanji: '遠い', es: 'lejano · (estar) lejos', en: 'far', sit: 'lake', kind: 'adj' },
  // P-08b+ (#49): se suma sobre P-08b (#48)
  { id: 'hashi', kana: 'はし', kanji: '橋', es: 'puente', en: 'bridge', sit: 'lake', kind: 'n' },
  { id: 'banme', kana: 'ばんめ', kanji: '番目', es: '-º (orden: に ばんめ = el segundo)', en: '-th (order: に ばんめ = the second)', sit: 'lake', kind: 'n' },
  { id: 'migigawa', kana: 'みぎがわ', kanji: '右側', es: 'lado derecho', en: 'right side', sit: 'lake', kind: 'n' },
  { id: 'hidarigawa', kana: 'ひだりがわ', kanji: '左側', es: 'lado izquierdo', en: 'left side', sit: 'lake', kind: 'n' },
  // Etapa 3 del currículo (parte 2)
  { id: 'norimasu', kana: 'のります', kanji: '乗ります', te: 'のって', tek: '乗って', dict: 'のる', dictk: '乗る', es: 'subir (a un vehículo)', en: "to ride · get on", sit: 'lake', kind: 'v' },
  { id: 'kakarimasu', kana: 'かかります', kanji: null, te: 'かかって', dict: 'かかる', es: 'tardar · llevar (tiempo)', en: "to take (time)", sit: 'lake', kind: 'v' },
  { id: 'jikan', kana: 'じかん', kanji: '時間', es: 'hora (duración) · tiempo', en: "hour (duration) · time", sit: 'lake', kind: 'n' },
  { id: 'chikatetsu', kana: 'ちかてつ', kanji: '地下鉄', es: 'metro', en: "subway", sit: 'lake', kind: 'n' },
  // Etapa 4 del currículo
  { id: 'oyogimasu', kana: 'およぎます', kanji: '泳ぎます', te: 'およいで', tek: '泳いで', dict: 'およぐ', dictk: '泳ぐ', pot: 'およげます', potk: '泳げます', es: 'nadar', en: "to swim", sit: 'lake', kind: 'v' },
  { id: 'kaze', kana: 'かぜ', kanji: '風', es: 'viento', en: "wind", sit: 'lake', kind: 'n' },
  { id: 'hikari', kana: 'ひかり', kanji: '光', es: 'luz', en: "light", sit: 'lake', kind: 'n' },
  { id: 'tsuyoi', kana: 'つよい', kanji: '強い', es: 'fuerte', en: "strong", sit: 'lake', kind: 'adj' },
  { id: 'haremasu', kana: 'はれます', kanji: '晴れます', te: 'はれて', tek: '晴れて', dict: 'はれる', dictk: '晴れる', ba: 'はれれば', bak: '晴れれば', es: 'despejarse (el cielo)', en: "to clear up", sit: 'lake', kind: 'v' },
  // Etapa 4 del currículo (parte 2)
  { id: 'kyouto', kana: 'きょうと', kanji: '京都', es: 'Kioto', en: "Kyoto", sit: 'lake', kind: 'n' },
  { id: 'toukyou', kana: 'とうきょう', kanji: '東京', es: 'Tokio', en: "Tokyo", sit: 'lake', kind: 'n' },
  { id: 'ken', kana: 'けん', kanji: '県', es: 'prefectura', en: "prefecture", sit: 'lake', kind: 'n' },
  { id: 'shinkansen', kana: 'しんかんせん', kanji: '新幹線', es: 'tren bala', en: "bullet train", sit: 'lake', kind: 'n' },

  // Etapa 2 del currículo (P-08c: 2.15 y 2.17)
  { id: 'tsumetai', kana: 'つめたい', kanji: '冷たい', es: 'frío (al tacto: agua, comida)', en: 'cold (to the touch: water, food)', sit: 'lake', kind: 'adj' },
  { id: 'donokurai', kana: 'どのくらい', kanji: null, es: 'cuánto (tiempo, distancia)', en: 'how long · how far', sit: 'lake', kind: 'q' },
  { id: 'gurai', kana: 'ぐらい', kanji: null, es: 'más o menos · unos (tras una cantidad)', en: 'about (after an amount)', sit: 'lake', kind: 'expr' },
  { id: 'norikaemasu', kana: 'のりかえます', kanji: '乗り換えます', te: 'のりかえて', tek: '乗り換えて', dict: 'のりかえる', dictk: '乗り換える', es: 'hacer transbordo · cambiar de tren', en: 'to change trains · transfer', sit: 'lake', kind: 'v' },
  { id: 'orimasu', kana: 'おります', kanji: '降ります', te: 'おりて', tek: '降りて', dict: 'おりる', dictk: '降りる', es: 'bajar (de un vehículo)', en: 'to get off (a vehicle)', sit: 'lake', kind: 'v' },
  { id: 'tsukimasu', kana: 'つきます', kanji: '着きます', te: 'ついて', tek: '着いて', dict: 'つく', dictk: '着く', es: 'llegar (〜に つきます)', en: 'to arrive (〜に つきます)', sit: 'lake', kind: 'v' },
  { id: 'higashiguchi', kana: 'ひがしぐち', kanji: '東口', es: 'salida este (de una estación)', en: 'east exit (of a station)', sit: 'lake', kind: 'n' },
  { id: 'nishiguchi', kana: 'にしぐち', kanji: '西口', es: 'salida oeste (de una estación)', en: 'west exit (of a station)', sit: 'lake', kind: 'n' },
  { id: 'hoomu', kana: 'ホーム', kanji: null, es: 'andén', en: 'platform', sit: 'lake', kind: 'n' },
  { id: 'kippu', kana: 'きっぷ', kanji: '切符', es: 'boleto', en: 'ticket', sit: 'lake', kind: 'n' },
  { id: 'katamichi', kana: 'かたみち', kanji: '片道', es: 'ida (boleto solo de ida)', en: 'one way', sit: 'lake', kind: 'n' },
  { id: 'oufuku', kana: 'おうふく', kanji: '往復', es: 'ida y vuelta', en: 'round trip', sit: 'lake', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.19, 2.20, 2.21 y 2.23)
  { id: 'kaisatsu', kana: 'かいさつ', kanji: '改札', es: 'torniquetes de la estación (donde se pasa el boleto)', en: 'ticket gate', sit: 'lake', kind: 'n' },
  { id: 'tomarimasu', kana: 'とまります', kanji: '止まります', te: 'とまって', tek: '止まって', dict: 'とまる', dictk: '止まる', es: 'detenerse · parar (el tren para en Kioto)', en: 'to stop (the train stops at Kyoto)', sit: 'lake', kind: 'v' },
  { id: 'ikikata', kana: 'いきかた', kanji: '行き方', es: 'cómo llegar (el camino para ir)', en: 'how to get there', sit: 'lake', kind: 'n' },
  { id: 'fune', kana: 'ふね', kanji: '船', es: 'barco', en: 'ship · boat', sit: 'lake', kind: 'n' },
  { id: 'yoko', kana: 'よこ', kanji: '横', es: 'al lado · el costado (〜の よこ: al lado de 〜)', en: 'side (〜の よこ: beside 〜)', sit: 'lake', kind: 'n' },
  { id: 'aida', kana: 'あいだ', kanji: '間', es: 'entre (A と B の あいだ: entre A y B)', en: 'between (A と B の あいだ: between A and B)', sit: 'lake', kind: 'n' },
  { id: 'mukai', kana: 'むかい', kanji: '向かい', es: 'enfrente (〜の むかい: enfrente de 〜)', en: 'across (〜の むかい: across from 〜)', sit: 'lake', kind: 'n' },
  { id: 'hen', kana: 'へん', kanji: '辺', es: 'zona (この へん: por aquí)', en: 'area (この へん: around here)', sit: 'lake', kind: 'n' },
  { id: 'mayoimasu', kana: 'まよいます', kanji: '迷います', te: 'まよって', tek: '迷って', dict: 'まよう', dictk: '迷う', es: 'perderse (みち に まよいます: perderse en el camino) · dudar', en: 'to get lost · to hesitate', sit: 'lake', kind: 'v' },
  { id: 'tochuu', kana: 'とちゅう', kanji: '途中', es: 'en el camino (とちゅう で: de camino)', en: 'on the way (とちゅう で: on the way)', sit: 'lake', kind: 'n' },
  // ── shrine · Rutina diaria ──
  { id: 'asa', kana: 'あさ', kanji: '朝', es: 'mañana (parte del día)', en: 'morning', sit: 'shrine', kind: 'n' },
  { id: 'okimasu', kana: 'おきます', kanji: '起きます', te: 'おきて', tek: '起きて', dict: 'おきる', dictk: '起きる', es: 'levantarse', en: 'to get up', sit: 'shrine', kind: 'v' },
  { id: 'mainichi', kana: 'まいにち', kanji: '毎日', es: 'todos los días', en: 'every day', sit: 'shrine', kind: 'n' },
  { id: 'yoru', kana: 'よる', kanji: '夜', es: 'noche', en: 'night', sit: 'shrine', kind: 'n' },
  { id: 'nemasu', kana: 'ねます', kanji: '寝ます', te: 'ねて', tek: '寝て', dict: 'ねる', dictk: '寝る', es: 'dormir · acostarse', en: 'to sleep · to go to bed', sit: 'shrine', kind: 'v' },
  { id: 'kinou', kana: 'きのう', kanji: '昨日', es: 'ayer', en: 'yesterday', sit: 'shrine', kind: 'n' },
  { id: 'mimasu', kana: 'みます', kanji: '見ます', te: 'みて', tek: '見て', dict: 'みる', dictk: '見る', vol: 'みよう', volk: '見よう', ba: 'みれば', bak: '見れば', es: 'ver · mirar', en: 'to see · to watch', sit: 'shrine', kind: 'v' },
  { id: 'terebi', kana: 'テレビ', kanji: null, es: 'televisión', en: 'TV', sit: 'shrine', kind: 'n' },
  { id: 'atarashii', kana: 'あたらしい', kanji: '新しい', es: 'nuevo', en: 'new', sit: 'shrine', kind: 'adj' },
  { id: 'fuku', kana: 'ふく', kanji: '服', es: 'ropa', en: 'clothes', sit: 'shrine', kind: 'n' },
  { id: 'nagai', kana: 'ながい', kanji: '長い', es: 'largo', en: 'long', sit: 'shrine', kind: 'adj' },
  { id: 'ato', kana: 'あと', kanji: '後', es: 'después', en: 'after', sit: 'shrine', kind: 'n' },
  { id: 'ofuro', kana: 'おふろ', kanji: 'お風呂', es: 'baño (de inmersión)', en: 'bath', sit: 'shrine', kind: 'n' },
  { id: 'hairimasu', kana: 'はいります', kanji: '入ります', te: 'はいって', tek: '入って', dict: 'はいる', dictk: '入る', es: 'entrar', en: 'to enter', sit: 'shrine', kind: 'v' },
  { id: 'arukimasu', kana: 'あるきます', kanji: '歩きます', te: 'あるいて', tek: '歩いて', dict: 'あるく', dictk: '歩く', es: 'caminar', en: 'to walk', sit: 'shrine', kind: 'v' },
  { id: 'mae', kana: 'まえ', kanji: '前', es: 'antes · delante', en: 'before · in front', sit: 'shrine', kind: 'n' },
  { id: 'hashirimasu', kana: 'はしります', kanji: '走ります', te: 'はしって', tek: '走って', dict: 'はしる', dictk: '走る', es: 'correr', en: 'to run', sit: 'shrine', kind: 'v' },
  { id: 'demasu', kana: 'でます', kanji: '出ます', te: 'でて', tek: '出て', dict: 'でる', dictk: '出る', es: 'salir', en: 'to leave · to go out', sit: 'shrine', kind: 'v' },
  { id: 'kutsu', kana: 'くつ', kanji: '靴', es: 'zapatos', en: 'shoes', sit: 'shrine', kind: 'n' },
  { id: 'sorekara', kana: 'それから', kanji: null, es: 'después · y luego', en: 'and then', sit: 'shrine', kind: 'expr' },
  // Etapa 1 del currículo (P-07: etapa 1 completa)
  { id: 'yoku', kana: 'よく', kanji: null, es: 'a menudo · con frecuencia', en: 'often', sit: 'shrine', kind: 'expr' },
  { id: 'tokidoki', kana: 'ときどき', kanji: '時々', es: 'a veces', en: 'sometimes', sit: 'shrine', kind: 'expr' },
  { id: 'zenzen', kana: 'ぜんぜん', kanji: '全然', es: 'nada · nunca (con 〜ません)', en: 'not at all (with 〜ません)', sit: 'shrine', kind: 'expr' },
  { id: 'yasumi', kana: 'やすみ', kanji: '休み', es: 'descanso · día libre', en: 'rest · day off', sit: 'shrine', kind: 'n' },
  { id: 'shukudai', kana: 'しゅくだい', kanji: '宿題', es: 'tarea (de la escuela)', en: 'homework', sit: 'shrine', kind: 'n' },
  { id: 'tesuto', kana: 'テスト', kanji: null, es: 'examen · prueba', en: 'test', sit: 'shrine', kind: 'n' },
  { id: 'paatii', kana: 'パーティー', kanji: null, es: 'fiesta', en: 'party', sit: 'shrine', kind: 'n' },
  { id: 'baito', kana: 'バイト', kanji: null, es: 'trabajo de medio tiempo', en: 'part-time job', sit: 'shrine', kind: 'n' },
  { id: 'hima', kana: 'ひま', kanji: '暇', es: 'libre · sin nada que hacer', en: 'free (not busy)', sit: 'shrine', kind: 'adj' },
  { id: 'isogashii', kana: 'いそがしい', kanji: '忙しい', es: 'ocupado', en: 'busy', sit: 'shrine', kind: 'adj' },
  { id: 'supootsu', kana: 'スポーツ', kanji: null, es: 'deporte', en: 'sports', sit: 'shrine', kind: 'n' },
  { id: 'sakkaa', kana: 'サッカー', kanji: null, es: 'fútbol', en: 'soccer · football', sit: 'shrine', kind: 'n' },
  { id: 'anime', kana: 'アニメ', kanji: null, es: 'anime · dibujos animados', en: 'anime', sit: 'shrine', kind: 'n' },
  { id: 'manga', kana: 'まんが', kanji: '漫画', es: 'manga · historieta', en: 'manga · comics', sit: 'shrine', kind: 'n' },
  { id: 'geemu', kana: 'ゲーム', kanji: null, es: 'videojuego · juego', en: 'video game · game', sit: 'shrine', kind: 'n' },
  // Etapa 2 del currículo
  { id: 'hiru', kana: 'ひる', kanji: '昼', es: 'mediodía', en: "noon", sit: 'shrine', kind: 'n' },
  { id: 'senshuu', kana: 'せんしゅう', kanji: '先週', es: 'la semana pasada', en: "last week", sit: 'shrine', kind: 'n' },
  { id: 'konshuu', kana: 'こんしゅう', kanji: '今週', es: 'esta semana', en: "this week", sit: 'shrine', kind: 'n' },
  { id: 'kotoshi', kana: 'ことし', kanji: '今年', es: 'este año', en: "this year", sit: 'shrine', kind: 'n' },
  { id: 'shuumatsu', kana: 'しゅうまつ', kanji: '週末', es: 'fin de semana', en: "weekend", sit: 'shrine', kind: 'n' },
  { id: 'raishuu', kana: 'らいしゅう', kanji: '来週', es: 'la semana que viene', en: "next week", sit: 'shrine', kind: 'n' },
  { id: 'issho', kana: 'いっしょ', kanji: '一緒', es: 'juntos (いっしょ に)', en: "together (いっしょ に)", sit: 'shrine', kind: 'expr' },
  { id: 'eiga', kana: 'えいが', kanji: '映画', es: 'película', en: "movie", sit: 'shrine', kind: 'n' },
  { id: 'yasumimasu', kana: 'やすみます', kanji: '休みます', te: 'やすんで', tek: '休んで', dict: 'やすむ', dictk: '休む', es: 'descansar', en: "to rest", sit: 'shrine', kind: 'v' },
  { id: 'ikemasen', kana: 'いけません', kanji: null, es: 'no se debe · no está bien', en: "must not · not allowed", sit: 'shrine', kind: 'expr' },
  // Etapa 2 del currículo (P-08a)
  { id: 'itsumo', kana: 'いつも', kanji: null, es: 'siempre', en: 'always', sit: 'shrine', kind: 'expr' },
  { id: 'amari', kana: 'あまり', kanji: null, es: 'no mucho (con 〜ません)', en: 'not much (with 〜ません)', sit: 'shrine', kind: 'expr' },
  { id: 'hayaku', kana: 'はやく', kanji: '早く', es: 'temprano · pronto', en: 'early', sit: 'shrine', kind: 'expr' },
  { id: 'shawaa', kana: 'シャワー', kanji: null, es: 'ducha', en: 'shower', sit: 'shrine', kind: 'n' },
  { id: 'abimasu', kana: 'あびます', kanji: '浴びます', te: 'あびて', tek: '浴びて', dict: 'あびる', dictk: '浴びる', es: 'darse (una ducha): シャワー を あびます', en: 'to take (a shower): シャワー を あびます', sit: 'shrine', kind: 'v' },
  { id: 'kao', kana: 'かお', kanji: '顔', es: 'cara', en: 'face', sit: 'shrine', kind: 'n' },
  { id: 'araimasu', kana: 'あらいます', kanji: '洗います', te: 'あらって', tek: '洗って', dict: 'あらう', dictk: '洗う', es: 'lavar', en: 'to wash', sit: 'shrine', kind: 'v' },
  { id: 'hamigaki', kana: 'はみがき', kanji: '歯磨き', es: 'cepillado de dientes (はみがき を します)', en: 'brushing teeth (はみがき を します)', sit: 'shrine', kind: 'n' },
  { id: 'souji', kana: 'そうじ', kanji: '掃除', es: 'limpieza (そうじ を します: limpiar)', en: 'cleaning (そうじ を します: to clean)', sit: 'shrine', kind: 'n' },
  { id: 'sentaku', kana: 'せんたく', kanji: '洗濯', es: 'lavado de ropa (せんたく を します)', en: 'laundry (せんたく を します)', sit: 'shrine', kind: 'n' },
  { id: 'tenisu', kana: 'テニス', kanji: null, es: 'tenis', en: 'tennis', sit: 'shrine', kind: 'n' },
  { id: 'konsaato', kana: 'コンサート', kanji: null, es: 'concierto', en: 'concert', sit: 'shrine', kind: 'n' },
  // Etapa 2 del currículo (P-08b)
  { id: 'akemasu', kana: 'あけます', kanji: '開けます', te: 'あけて', tek: '開けて', dict: 'あける', dictk: '開ける', es: 'abrir', en: 'to open', sit: 'shrine', kind: 'v' },
  { id: 'shimemasu', kana: 'しめます', kanji: '閉めます', te: 'しめて', tek: '閉めて', dict: 'しめる', dictk: '閉める', es: 'cerrar', en: 'to close', sit: 'shrine', kind: 'v' },
  { id: 'suwarimasu', kana: 'すわります', kanji: '座ります', te: 'すわって', tek: '座って', dict: 'すわる', dictk: '座る', es: 'sentarse', en: 'to sit down', sit: 'shrine', kind: 'v' },
  // P-08b+ (#49): se suma sobre P-08b (#48)
  { id: 'mou', kana: 'もう', kanji: null, es: 'ya', en: 'already · now', sit: 'shrine', kind: 'expr' },
  { id: 'asobimasu', kana: 'あそびます', kanji: '遊びます', te: 'あそんで', tek: '遊んで', dict: 'あそぶ', dictk: '遊ぶ', es: 'jugar · divertirse', en: 'to play · have fun', sit: 'shrine', kind: 'v' },
  { id: 'e', kana: 'え', kanji: '絵', es: 'dibujo · cuadro', en: 'picture · painting', sit: 'shrine', kind: 'n' },
  { id: 'tsuri', kana: 'つり', kanji: '釣り', es: 'pesca (con caña)', en: 'fishing', sit: 'shrine', kind: 'n' },
  { id: 'yakyuu', kana: 'やきゅう', kanji: '野球', es: 'béisbol', en: 'baseball', sit: 'shrine', kind: 'n' },
  // Etapa 3 del currículo (parte 2)
  { id: 'matsuri', kana: 'まつり', kanji: '祭り', es: 'festival', en: "festival", sit: 'shrine', kind: 'n' },
  { id: 'oshougatsu', kana: 'おしょうがつ', kanji: 'お正月', es: 'Año Nuevo', en: "New Year", sit: 'shrine', kind: 'n' },
  { id: 'hanami', kana: 'はなみ', kanji: '花見', es: 'mirar los cerezos en flor', en: "cherry-blossom viewing", sit: 'shrine', kind: 'n' },
  { id: 'tanoshii', kana: 'たのしい', kanji: '楽しい', es: 'divertido', en: "fun", sit: 'shrine', kind: 'adj' },
  // Etapa 2 del currículo (P-08c: 2.14 y 2.18)
  { id: 'taitei', kana: 'たいてい', kanji: null, es: 'normalmente · casi siempre', en: 'usually', sit: 'shrine', kind: 'expr' },
  { id: 'osoku', kana: 'おそく', kanji: '遅く', es: 'tarde (おそく おきます: me levanto tarde)', en: 'late (おそく おきます: I get up late)', sit: 'shrine', kind: 'expr' },
  { id: 'sanpo', kana: 'さんぽ', kanji: '散歩', es: 'paseo (さんぽ します: pasear)', en: 'walk (さんぽ します: to take a walk)', sit: 'shrine', kind: 'n' },
  { id: 'undou', kana: 'うんどう', kanji: '運動', es: 'ejercicio (うんどう します: hacer ejercicio)', en: 'exercise (うんどう します: to exercise)', sit: 'shrine', kind: 'n' },
  { id: 'dekakemasu', kana: 'でかけます', kanji: '出かけます', te: 'でかけて', tek: '出かけて', dict: 'でかける', dictk: '出かける', es: 'salir (de casa, a pasear o a hacer algo)', en: 'to go out', sit: 'shrine', kind: 'v' },
  { id: 'jinja', kana: 'じんじゃ', kanji: '神社', es: 'santuario sintoísta', en: 'Shinto shrine', sit: 'shrine', kind: 'n' },
  { id: 'otera', kana: 'おてら', kanji: 'お寺', es: 'templo budista', en: 'Buddhist temple', sit: 'shrine', kind: 'n' },
  // Etapa 2 del currículo (P-08d: 2.19, 2.20, 2.23 y 2.24)
  { id: 'karaoke', kana: 'カラオケ', kanji: null, es: 'karaoke', en: 'karaoke', sit: 'shrine', kind: 'n' },
  { id: 'isogimasu', kana: 'いそぎます', kanji: '急ぎます', te: 'いそいで', tek: '急いで', dict: 'いそぐ', dictk: '急ぐ', es: 'darse prisa', en: 'to hurry', sit: 'shrine', kind: 'v' },
  { id: 'natsuyasumi', kana: 'なつやすみ', kanji: '夏休み', es: 'vacaciones de verano', en: 'summer vacation', sit: 'shrine', kind: 'n' },
  { id: 'fuyuyasumi', kana: 'ふゆやすみ', kanji: '冬休み', es: 'vacaciones de invierno', en: 'winter vacation', sit: 'shrine', kind: 'n' },
  { id: 'keikaku', kana: 'けいかく', kanji: '計画', es: 'plan (けいかく を たてます: hacer un plan)', en: 'plan (けいかく を たてます: to make a plan)', sit: 'shrine', kind: 'n' },
  { id: 'tatemasu', kana: 'たてます', kanji: '立てます', te: 'たてて', tek: '立てて', dict: 'たてる', dictk: '立てる', es: 'armar · hacer (un plan) · poner de pie', en: 'to make (a plan) · to stand (something) up', sit: 'shrine', kind: 'v' },
  { id: 'junbi', kana: 'じゅんび', kanji: '準備', es: 'preparación (じゅんび します: preparar)', en: 'preparation (じゅんび します: to prepare)', sit: 'shrine', kind: 'n' },
  { id: 'nimotsu', kana: 'にもつ', kanji: '荷物', es: 'equipaje · bultos', en: 'luggage', sit: 'shrine', kind: 'n' },
  { id: 'pasupooto', kana: 'パスポート', kanji: null, es: 'pasaporte', en: 'passport', sit: 'shrine', kind: 'n' },
  { id: 'suutsukeesu', kana: 'スーツケース', kanji: null, es: 'maleta', en: 'suitcase', sit: 'shrine', kind: 'n' },
  { id: 'gaidobukku', kana: 'ガイドブック', kanji: null, es: 'guía de viaje (el libro)', en: 'guidebook', sit: 'shrine', kind: 'n' },
  { id: 'kigaemasu', kana: 'きがえます', kanji: '着替えます', te: 'きがえて', tek: '着替えて', dict: 'きがえる', dictk: '着替える', es: 'cambiarse de ropa', en: 'to change clothes', sit: 'shrine', kind: 'v' },
  { id: 'kazarimasu', kana: 'かざります', kanji: '飾ります', te: 'かざって', tek: '飾って', dict: 'かざる', dictk: '飾る', es: 'decorar · adornar', en: 'to decorate', sit: 'shrine', kind: 'v' },
  { id: 'atsumarimasu', kana: 'あつまります', kanji: '集まります', te: 'あつまって', tek: '集まって', dict: 'あつまる', dictk: '集まる', es: 'reunirse · juntarse', en: 'to gather', sit: 'shrine', kind: 'v' },
  { id: 'odorimasu', kana: 'おどります', kanji: '踊ります', te: 'おどって', tek: '踊って', dict: 'おどる', dictk: '踊る', es: 'bailar', en: 'to dance', sit: 'shrine', kind: 'v' },
  { id: 'tetsudaimasu', kana: 'てつだいます', kanji: '手伝います', te: 'てつだって', tek: '手伝って', dict: 'てつだう', dictk: '手伝う', es: 'ayudar (con una tarea)', en: 'to help (with a task)', sit: 'shrine', kind: 'v' },
  { id: 'yobimasu', kana: 'よびます', kanji: '呼びます', te: 'よんで', tek: '呼んで', dict: 'よぶ', dictk: '呼ぶ', es: 'llamar (タクシー を よびます: pedir un taxi)', en: 'to call (タクシー を よびます: to call a taxi)', sit: 'shrine', kind: 'v' },
  { id: 'hanabi', kana: 'はなび', kanji: '花火', es: 'fuegos artificiales', en: 'fireworks', sit: 'shrine', kind: 'n' },
  { id: 'taikai', kana: 'たいかい', kanji: '大会', es: 'torneo · festival grande (はなび たいかい: festival de fuegos artificiales)', en: 'tournament · big event (はなび たいかい: fireworks festival)', sit: 'shrine', kind: 'n' },
  { id: 'shiai', kana: 'しあい', kanji: '試合', es: 'partido · competencia', en: 'match · game', sit: 'shrine', kind: 'n' },
  { id: 'undoukai', kana: 'うんどうかい', kanji: '運動会', es: 'día deportivo (de la escuela)', en: 'sports day', sit: 'shrine', kind: 'n' },
  { id: 'chuushi', kana: 'ちゅうし', kanji: '中止', es: 'suspensión (ちゅうし です: se suspende)', en: 'cancellation (ちゅうし です: it is called off)', sit: 'shrine', kind: 'n' },
  { id: 'kaijou', kana: 'かいじょう', kanji: '会場', es: 'lugar del evento · sala', en: 'venue', sit: 'shrine', kind: 'n' },
  { id: 'sanka', kana: 'さんか', kanji: '参加', es: 'participación (さんか します: participar)', en: 'participation (さんか します: to take part)', sit: 'shrine', kind: 'n' },
];

// Patrones gramaticales, en el orden de E1.
export const PATTERNS = [
  { id: 'desu', ja: 'X は Y です', es: 'X es Y', en: 'X is Y' },
  { id: 'ka', ja: 'X は Y です か', es: '¿X es Y? (か convierte la frase en pregunta)', en: 'Is X Y? (か turns the sentence into a question)' },
  { id: 'jikan', ja: 'X じ です ・ X じ に', es: 'son las X · a las X', en: "it is X o'clock · at X o'clock" },
  { id: 'no', ja: 'X の Y', es: 'el Y de X', en: "X's Y" },
  { id: 'mo', ja: 'X も Y です', es: 'X también es Y', en: 'X is Y too' },
  { id: 'masu', ja: 'X を V ます', es: 'hago V con X (を marca lo que se come, se lee, se compra…)', en: 'I do V to X (を marks what is eaten, read, bought…)' },
  { id: 'suki', ja: 'X が すき です', es: 'me gusta X', en: 'I like X' },
  { id: 'adj', ja: 'X は A です', es: 'X es A (adjetivo)', en: 'X is A (adjective)' },
  { id: 'kore', ja: 'これ ・ それ は X です', es: 'esto · eso es X', en: 'this · that is X' },
  { id: 'ni', ja: 'X へ ・ X に いきます', es: 'voy a X (へ y に marcan el destino)', en: 'I go to X (へ and に mark the destination)' },
  { id: 'de', ja: 'X で V ます', es: 'hago V en X · con X (lugar o medio)', en: 'I do V at X · by X (place or means)' },
  { id: 'arimasu', ja: 'X に Y が あります ・ います', es: 'en X hay Y (あります cosas, います seres vivos)', en: 'there is Y in X (あります things, います living beings)' },
  { id: 'mashita', ja: 'V ました', es: 'hice V (pasado)', en: 'I did V (past)' },
  // P-10 · Solo lo usan frases del currículo (EXTRA): cur: true lo saca del chequeo de frases de viaje.
  { id: 'adjneg', cur: true, ja: 'A くない です ・ A かった です', es: 'no es A · era A. Adjetivos い: たかくない です (no es caro), たかかった です (era caro); いい cambia a よくない · よかった. Adjetivos な y sustantivos: しずか じゃない です o, más formal, しずか じゃありません (no es tranquilo), しずか でした (era tranquilo)', en: 'is not A · was A. い-adjectives: たかくない です, たかかった です; いい becomes よくない · よかった. な-adjectives and nouns: しずか じゃない です, しずか でした' },
];

// Fichas que no son palabras de LEX: partículas, cópula y terminaciones de cortesía.
export const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'も', 'の', 'と', 'か', 'ね', 'です', 'でした', 'でしょう', 'だ', 'より', 'から', 'まで', 'みたい', 'ので', 'のに', 'ございます', 'お',
  // P-10 · cópula negativa y pasada de adjetivos な y sustantivos (しずか じゃない です), y な ante sustantivo (しずか な まち)
  'じゃない', 'じゃなかった', 'じゃありません', 'じゃありませんでした', 'な'];

// Frases. `ja` segmentada, `ids` = palabras de LEX que usa, `pat` = id de PATTERNS o null (frase hecha).
export const PHRASES = [
  // ── forest ──
  { id: 'p_arigatou', sit: 'forest', ja: 'ありがとう ございます', ids: ['arigatou'], pat: null, es: 'Muchas gracias.', en: 'Thank you very much.' },
  { id: 'p_ohayou', sit: 'forest', ja: 'おはよう ございます', ids: ['ohayou'], pat: null, es: 'Buenos días.', en: 'Good morning.' },
  { id: 'p_konnichiwa', sit: 'forest', ja: 'やました さん こんにちは', ids: ['yamashita', 'san', 'konnichiwa'], pat: null, es: 'Hola, señor Yamashita.', en: 'Hello, Mr. Yamashita.' },
  { id: 'p_douzo', sit: 'forest', ja: 'はい どうぞ', ids: ['hai', 'douzo'], pat: null, es: 'Sí, adelante.', en: 'Yes, go ahead.' },
  { id: 'p_doumo', sit: 'forest', ja: 'どうも すみません', ids: ['doumo', 'sumimasen'], pat: null, es: 'Lo siento mucho.', en: 'I am very sorry.' },
  { id: 'p_hajimemashite', sit: 'forest', ja: 'はじめまして おがわ です', ids: ['hajimemashite', 'ogawa'], pat: null, es: 'Mucho gusto, soy Ogawa.', en: 'Nice to meet you, I am Ogawa.' },
  { id: 'p_yoroshiku', sit: 'forest', ja: 'よろしく おねがいします', ids: ['yoroshiku', 'onegaishimasu'], pat: null, es: 'Encantado de conocerte.', en: 'Pleased to meet you.' },
  { id: 'p_jaamata', sit: 'forest', ja: 'じゃあ また', ids: ['jaa', 'mata'], pat: null, es: 'Bueno, hasta luego.', en: 'Well, see you.' },

  // ── hill ──
  { id: 'p_gakusei', sit: 'hill', ja: 'わたし は がくせい です', ids: ['watashi', 'gakusei'], pat: 'desu', es: 'Soy estudiante.', en: 'I am a student.' },
  { id: 'p_gakuseika', sit: 'hill', ja: 'やました さん は がくせい です か', ids: ['yamashita', 'san', 'gakusei'], pat: 'ka', es: '¿El señor Yamashita es estudiante?', en: 'Is Mr. Yamashita a student?' },
  { id: 'p_nanji', sit: 'hill', ja: 'いま なん じ です か', ids: ['ima', 'nan', 'ji'], pat: 'ka', es: '¿Qué hora es ahora?', en: 'What time is it now?' },
  { id: 'p_sanji', sit: 'hill', ja: 'いま さん じ です', ids: ['ima', 'sankazu', 'ji'], pat: 'jikan', es: 'Ahora son las tres.', en: "It is three o'clock now." },
  { id: 'p_hachijihan', sit: 'hill', ja: 'ごぜん はち じ はん です', ids: ['gozen', 'hachi', 'ji', 'han'], pat: 'jikan', es: 'Son las ocho y media de la mañana.', en: 'It is half past eight in the morning.' },
  { id: 'p_nichiyoubi', sit: 'hill', ja: 'きょう は にちようび です', ids: ['kyou', 'nichiyoubi'], pat: 'desu', es: 'Hoy es domingo.', en: 'Today is Sunday.' },
  { id: 'p_getsuyoubi', sit: 'hill', ja: 'あした は げつようび です', ids: ['ashita', 'getsuyoubi'], pat: 'desu', es: 'Mañana es lunes.', en: 'Tomorrow is Monday.' },
  { id: 'p_namae', sit: 'hill', ja: 'わたし の なまえ は おがわ です', ids: ['watashi', 'namae', 'ogawa'], pat: 'no', es: 'Mi nombre es Ogawa.', en: 'My name is Ogawa.' },

  // ── valley ──
  { id: 'p_kazoku', sit: 'valley', ja: 'わたし の かぞく です', ids: ['watashi', 'kazoku'], pat: 'no', es: 'Es mi familia.', en: 'This is my family.' },
  { id: 'p_chichihaha', sit: 'valley', ja: 'ちち と はは です', ids: ['chichi', 'haha'], pat: 'desu', es: 'Son mi padre y mi madre.', en: 'They are my father and my mother.' },
  { id: 'p_mogakusei', sit: 'valley', ja: 'おがわ さん も がくせい です', ids: ['ogawa', 'san', 'gakusei'], pat: 'mo', es: 'La señora Ogawa también es estudiante.', en: 'Ms. Ogawa is a student too.' },
  { id: 'p_tomodachi', sit: 'valley', ja: 'やました さん は にほん の ともだち です', ids: ['yamashita', 'san', 'nihon', 'tomodachi'], pat: 'no', es: 'El señor Yamashita es un amigo de Japón.', en: 'Mr. Yamashita is a friend from Japan.' },
  { id: 'p_dare', sit: 'valley', ja: 'あの ひと は だれ です か', ids: ['ano', 'hito', 'dare'], pat: 'ka', es: '¿Quién es aquella persona?', en: 'Who is that person over there?' },
  { id: 'p_kochira', sit: 'valley', ja: 'こちら は たなか さん です', ids: ['kochira', 'tanaka', 'san'], pat: 'desu', es: 'Te presento a la señora Tanaka.', en: 'This is Ms. Tanaka.' },
  { id: 'p_aniotouto', sit: 'valley', ja: 'あに も おとうと も がくせい です', ids: ['ani', 'otouto', 'gakusei'], pat: 'mo', es: 'Mi hermano mayor y mi hermano menor son los dos estudiantes.', en: 'Both my older brother and my younger brother are students.' },
  { id: 'p_kodomo', sit: 'valley', ja: 'あね の こども は ふたり です', ids: ['ane', 'kodomo', 'futari'], pat: 'no', es: 'Mi hermana mayor tiene dos hijos.', en: 'My older sister has two children.' },

  // ── spring ──
  { id: 'p_gohan', sit: 'spring', ja: 'ごはん を たべます', ids: ['gohan', 'tabemasu'], pat: 'masu', es: 'Como arroz.', en: 'I eat rice.' },
  { id: 'p_mizu', sit: 'spring', ja: 'みず を のみます', ids: ['mizu', 'nomimasu'], pat: 'masu', es: 'Bebo agua.', en: 'I drink water.' },
  { id: 'p_nani', sit: 'spring', ja: 'なに を たべます か', ids: ['nani', 'tabemasu'], pat: 'ka', es: '¿Qué vas a comer?', en: 'What will you eat?' },
  { id: 'p_sakana', sit: 'spring', ja: 'わたし は さかな が すき です', ids: ['watashi', 'sakana', 'suki'], pat: 'suki', es: 'Me gusta el pescado.', en: 'I like fish.' },
  { id: 'p_ocha', sit: 'spring', ja: 'はは は おちゃ を のみます', ids: ['haha', 'ocha', 'nomimasu'], pat: 'masu', es: 'Mi madre bebe té.', en: 'My mother drinks tea.' },
  { id: 'p_oishii', sit: 'spring', ja: 'パン は おいしい です', ids: ['pan', 'oishii'], pat: 'adj', es: 'El pan está rico.', en: 'The bread is delicious.' },
  { id: 'p_me', sit: 'spring', ja: 'いもうと の め は おおきい です', ids: ['imouto', 'me', 'ookii'], pat: 'adj', es: 'Los ojos de mi hermana menor son grandes.', en: "My younger sister's eyes are big." },
  { id: 'p_aoi', sit: 'spring', ja: 'あおい いろ が すき です', ids: ['aoi', 'iro', 'suki'], pat: 'suki', es: 'Me gusta el color azul.', en: 'I like the color blue.' },

  // ── post ──
  { id: 'p_ikura', sit: 'post', ja: 'これ は いくら です か', ids: ['kore', 'ikura'], pat: 'kore', es: '¿Cuánto cuesta esto?', en: 'How much is this?' },
  { id: 'p_gohyaku', sit: 'post', ja: 'これ は ご ひゃく えん です', ids: ['kore', 'go', 'hyaku', 'en'], pat: 'kore', es: 'Esto cuesta quinientos yenes.', en: 'This is five hundred yen.' },
  { id: 'p_nisen', sit: 'post', ja: 'それ は に せん えん です', ids: ['sore', 'ni', 'sen', 'en'], pat: 'kore', es: 'Eso cuesta dos mil yenes.', en: 'That is two thousand yen.' },
  { id: 'p_kudasai', sit: 'post', ja: 'これ を ください', ids: ['kore', 'kudasai'], pat: null, es: 'Dame esto, por favor.', en: 'This one, please.' },
  { id: 'p_doko', sit: 'post', ja: 'どこ へ いきます か', ids: ['doko', 'ikimasu'], pat: 'ni', es: '¿Adónde vas?', en: 'Where are you going?' },
  { id: 'p_kaimasu', sit: 'post', ja: 'みせ で パン を かいます', ids: ['mise', 'pan', 'kaimasu'], pat: 'de', es: 'Compro pan en la tienda.', en: 'I buy bread at the shop.' },
  { id: 'p_kaerimasu', sit: 'post', ja: 'ろく じ に いえ に かえります', ids: ['roku', 'ji', 'ie', 'kaerimasu'], pat: 'jikan', es: 'Vuelvo a casa a las seis.', en: "I go back home at six o'clock." },
  { id: 'p_kuruma', sit: 'post', ja: 'あかい くるま で まち へ いきます', ids: ['akai', 'kuruma', 'machi', 'ikimasu'], pat: 'de', es: 'Voy al pueblo en el auto rojo.', en: 'I go to town in the red car.' },

  // ── ruins ──
  { id: 'p_senseinohon', sit: 'ruins', ja: 'これ は せんせい の ほん です', ids: ['kore', 'sensei', 'hon'], pat: 'no', es: 'Este es el libro de la profesora.', en: "This is the teacher's book." },
  { id: 'p_gakkou', sit: 'ruins', ja: 'がっこう へ いきます', ids: ['gakkou', 'ikimasu'], pat: 'ni', es: 'Voy a la escuela.', en: 'I go to school.' },
  { id: 'p_heya', sit: 'ruins', ja: 'へや に つくえ が あります', ids: ['heya', 'tsukue', 'arimasu'], pat: 'arimasu', es: 'En la habitación hay un escritorio.', en: 'There is a desk in the room.' },
  { id: 'p_ue', sit: 'ruins', ja: 'つくえ の うえ に ほん が あります', ids: ['tsukue', 'ue', 'hon', 'arimasu'], pat: 'arimasu', es: 'Sobre el escritorio hay un libro.', en: 'There is a book on the desk.' },
  { id: 'p_kaban', sit: 'ruins', ja: 'かばん の なか に おかね が あります', ids: ['kaban', 'naka', 'okane', 'arimasu'], pat: 'arimasu', es: 'Dentro del bolso hay dinero.', en: 'There is money in the bag.' },
  { id: 'p_yomimasu', sit: 'ruins', ja: 'にほんご の ほん を よみます', ids: ['nihongo', 'hon', 'yomimasu'], pat: 'masu', es: 'Leo un libro en japonés.', en: 'I read a Japanese book.' },
  { id: 'p_benkyou', sit: 'ruins', ja: 'がっこう で かんじ の べんきょう を します', ids: ['gakkou', 'kanji', 'benkyou', 'shimasu'], pat: 'de', es: 'Estudio kanji en la escuela.', en: 'I study kanji at school.' },
  { id: 'p_kaisha', sit: 'ruins', ja: 'ちち は かいしゃ で はたらきます', ids: ['chichi', 'kaisha', 'hatarakimasu'], pat: 'de', es: 'Mi padre trabaja en una empresa.', en: 'My father works at a company.' },

  // ── ranch ──
  { id: 'p_inu', sit: 'ranch', ja: 'いぬ が います', ids: ['inu', 'imasu'], pat: 'arimasu', es: 'Hay un perro.', en: 'There is a dog.' },
  { id: 'p_neko', sit: 'ranch', ja: 'いえ に ねこ が います', ids: ['ie', 'neko', 'imasu'], pat: 'arimasu', es: 'En casa hay un gato.', en: 'There is a cat at home.' },
  { id: 'p_kawaii', sit: 'ranch', ja: 'ねこ は かわいい です', ids: ['neko', 'kawaii'], pat: 'adj', es: 'El gato es lindo.', en: 'The cat is cute.' },
  { id: 'p_umaushi', sit: 'ranch', ja: 'うま と うし が たくさん います', ids: ['uma', 'ushi', 'takusan', 'imasu'], pat: 'arimasu', es: 'Hay muchos caballos y vacas.', en: 'There are many horses and cows.' },
  { id: 'p_doubutsu', sit: 'ranch', ja: 'わたし は どうぶつ が すき です', ids: ['watashi', 'doubutsu', 'suki'], pat: 'suki', es: 'Me gustan los animales.', en: 'I like animals.' },
  { id: 'p_tori', sit: 'ranch', ja: 'にわ に しろい とり が います', ids: ['niwa', 'shiroi', 'tori', 'imasu'], pat: 'arimasu', es: 'En el jardín hay un pájaro blanco.', en: 'There is a white bird in the garden.' },
  { id: 'p_hatake', sit: 'ranch', ja: 'はたけ で まめ と やさい を つくります', ids: ['hatake', 'mame', 'yasai', 'tsukurimasu'], pat: 'de', es: 'En la huerta cultivo porotos y verduras.', en: 'I grow beans and vegetables in the field.' },
  { id: 'p_tamago', sit: 'ranch', ja: 'はは は いちば で こめ と たまご を かいます', ids: ['haha', 'ichiba', 'kome', 'tamago', 'kaimasu'], pat: 'de', es: 'Mi madre compra arroz y huevos en el mercado.', en: 'My mother buys rice and eggs at the market.' },

  // ── lake ──
  { id: 'p_tenki', sit: 'lake', ja: 'きょう は いい てんき です', ids: ['kyou', 'ii', 'tenki'], pat: 'adj', es: 'Hoy hace buen tiempo.', en: 'The weather is nice today.' },
  { id: 'p_ame', sit: 'lake', ja: 'あした は あめ が ふります', ids: ['ashita', 'ame', 'furimasu'], pat: 'masu', es: 'Mañana va a llover.', en: 'It will rain tomorrow.' },
  { id: 'p_yamakawa', sit: 'lake', ja: 'むら に やま と かわ が あります', ids: ['mura', 'yama', 'kawa', 'arimasu'], pat: 'arimasu', es: 'En la aldea hay una montaña y un río.', en: 'There is a mountain and a river in the village.' },
  { id: 'p_hana', sit: 'lake', ja: 'にわ の はな は きれい です', ids: ['niwa', 'hana', 'kirei'], pat: 'adj', es: 'Las flores del jardín son bonitas.', en: 'The flowers in the garden are pretty.' },
  { id: 'p_fuyu', sit: 'lake', ja: 'ふゆ は さむい です', ids: ['fuyu', 'samui'], pat: 'adj', es: 'En invierno hace frío.', en: 'Winter is cold.' },
  { id: 'p_natsu', sit: 'lake', ja: 'なつ は とても あつい です', ids: ['natsu', 'totemo', 'atsui'], pat: 'adj', es: 'En verano hace mucho calor.', en: 'Summer is very hot.' },
  { id: 'p_migi', sit: 'lake', ja: 'みち の みぎ に えき が あります', ids: ['michi', 'migi', 'eki', 'arimasu'], pat: 'arimasu', es: 'A la derecha de la calle está la estación.', en: 'The station is on the right side of the street.' },
  { id: 'p_minami', sit: 'lake', ja: 'うみ は まち の みなみ に あります', ids: ['umi', 'machi', 'minami', 'arimasu'], pat: 'arimasu', es: 'El mar está al sur del pueblo.', en: 'The sea is to the south of the town.' },

  // ── shrine ──
  { id: 'p_okimasu', sit: 'shrine', ja: 'あさ ろく じ に おきます', ids: ['asa', 'roku', 'ji', 'okimasu'], pat: 'jikan', es: 'Me levanto a las seis de la mañana.', en: 'I get up at six in the morning.' },
  { id: 'p_mainichi', sit: 'shrine', ja: 'まいにち ぎゅうにゅう を のみます', ids: ['mainichi', 'gyuunyuu', 'nomimasu'], pat: 'masu', es: 'Bebo leche todos los días.', en: 'I drink milk every day.' },
  { id: 'p_nemasu', sit: 'shrine', ja: 'よる じゅう いち じ に ねます', ids: ['yoru', 'juu', 'ichi', 'ji', 'nemasu'], pat: 'jikan', es: 'Me acuesto a las once de la noche.', en: 'I go to bed at eleven at night.' },
  { id: 'p_terebi', sit: 'shrine', ja: 'きのう テレビ を みました', ids: ['kinou', 'terebi', 'mimasu'], pat: 'mashita', es: 'Ayer vi televisión.', en: 'I watched TV yesterday.' },
  { id: 'p_fuku', sit: 'shrine', ja: 'あたらしい ふく を かいました', ids: ['atarashii', 'fuku', 'kaimasu'], pat: 'mashita', es: 'Compré ropa nueva.', en: 'I bought new clothes.' },
  { id: 'p_nagai', sit: 'shrine', ja: 'うま は あし が ながい です', ids: ['uma', 'ashi', 'nagai'], pat: 'adj', es: 'El caballo tiene las patas largas.', en: 'Horses have long legs.' },
  { id: 'p_ofuro', sit: 'shrine', ja: 'ごはん の あと で おふろ に はいります', ids: ['gohan', 'ato', 'ofuro', 'hairimasu'], pat: 'ni', es: 'Después de comer me doy un baño.', en: 'After the meal I take a bath.' },
  { id: 'p_arukimasu', sit: 'shrine', ja: 'どようび に ともだち と まち を あるきました', ids: ['doyoubi', 'tomodachi', 'machi', 'arukimasu'], pat: 'mashita', es: 'El sábado caminé por el pueblo con un amigo.', en: 'On Saturday I walked around town with a friend.' },
];

// Lecturas muy cortas (2–5 líneas, Tadoku nivel 0), de más fácil a más difícil.
// `ids` = todas las palabras de LEX que aparecen.
export const READINGS = [
  // forest
  { id: 'r_ohayou', title: { es: 'Por la mañana', en: 'In the morning' }, lines: [
    { ja: 'おがわ さん おはよう ございます', es: 'Buenos días, señora Ogawa.', en: 'Good morning, Ms. Ogawa.' },
    { ja: 'やました さん おはよう ございます', es: 'Buenos días, señor Yamashita.', en: 'Good morning, Mr. Yamashita.' },
    { ja: 'お げんき です か', es: '¿Cómo está?', en: 'How are you?' },
    { ja: 'はい げんき です', es: 'Bien, gracias.', en: 'I am well.' },
  ], ids: ['ogawa', 'san', 'ohayou', 'yamashita', 'genki', 'hai'] },
  // forest + hill
  { id: 'r_hajimemashite', title: { es: 'Mucho gusto', en: 'Nice to meet you' }, lines: [
    { ja: 'はじめまして', es: 'Mucho gusto.', en: 'Nice to meet you.' },
    { ja: 'わたし は やました です', es: 'Soy Yamashita.', en: 'I am Yamashita.' },
    { ja: 'がくせい です', es: 'Soy estudiante.', en: 'I am a student.' },
    { ja: 'よろしく おねがいします', es: 'Encantado de conocerte.', en: 'Pleased to meet you.' },
  ], ids: ['hajimemashite', 'watashi', 'yamashita', 'gakusei', 'yoroshiku', 'onegaishimasu'] },
  { id: 'r_nanji', title: { es: '¿Qué hora es?', en: 'What time is it?' }, lines: [
    { ja: 'すみません いま なん じ です か', es: 'Disculpa, ¿qué hora es?', en: 'Excuse me, what time is it?' },
    { ja: 'いま ご じ はん です', es: 'Son las cinco y media.', en: 'It is half past five.' },
    { ja: 'どうも ありがとう ございます', es: 'Muchas gracias.', en: 'Thank you very much.' },
    { ja: 'いいえ', es: 'No es nada.', en: 'Not at all.' },
  ], ids: ['sumimasen', 'ima', 'nan', 'ji', 'go', 'han', 'doumo', 'arigatou', 'iie'] },
  { id: 'r_oyasumi', title: { es: 'Hasta mañana', en: 'See you tomorrow' }, lines: [
    { ja: 'いま ごご じゅう じ です', es: 'Son las diez de la noche.', en: 'It is ten p.m.' },
    { ja: 'あした は げつようび です', es: 'Mañana es lunes.', en: 'Tomorrow is Monday.' },
    { ja: 'おがわ さん おやすみなさい', es: 'Buenas noches, señora Ogawa.', en: 'Good night, Ms. Ogawa.' },
    { ja: 'じゃあ また あした', es: 'Bueno, hasta mañana.', en: 'Well, see you tomorrow.' },
  ], ids: ['ima', 'gogo', 'juu', 'ji', 'ashita', 'getsuyoubi', 'ogawa', 'san', 'oyasuminasai', 'jaa', 'mata'] },
  // + valley
  { id: 'r_kazoku', title: { es: 'Mi familia', en: 'My family' }, lines: [
    { ja: 'わたし の かぞく です', es: 'Esta es mi familia.', en: 'This is my family.' },
    { ja: 'ちち と はは と あに です', es: 'Son mi padre, mi madre y mi hermano mayor.', en: 'My father, my mother and my older brother.' },
    { ja: 'あに は がくせい です', es: 'Mi hermano es estudiante.', en: 'My brother is a student.' },
    { ja: 'わたし も がくせい です', es: 'Yo también soy estudiante.', en: 'I am a student too.' },
  ], ids: ['watashi', 'kazoku', 'chichi', 'haha', 'ani', 'gakusei'] },
  { id: 'r_dare', title: { es: '¿Quién es?', en: 'Who is that?' }, lines: [
    { ja: 'あの おとこ の ひと は だれ です か', es: '¿Quién es aquel hombre?', en: 'Who is that man over there?' },
    { ja: 'たなか さん の おとうさん です', es: 'Es el padre de Tanaka.', en: "He is Tanaka's father." },
    { ja: 'たなか さん は あね の ともだち です', es: 'Tanaka es amiga de mi hermana mayor.', en: "Tanaka is my older sister's friend." },
    { ja: 'こんばんは', es: 'Buenas noches.', en: 'Good evening.' },
  ], ids: ['ano', 'otoko', 'hito', 'dare', 'tanaka', 'san', 'otousan', 'ane', 'tomodachi', 'konbanwa'] },
  // + spring
  { id: 'r_gohan', title: { es: 'A comer', en: 'Time to eat' }, lines: [
    { ja: 'いただきます', es: '¡Buen provecho!', en: 'Thanks for the meal!' },
    { ja: 'わたし は さかな を たべます', es: 'Yo como pescado.', en: 'I eat fish.' },
    { ja: 'おとうと は にく を たべます', es: 'Mi hermano menor come carne.', en: 'My younger brother eats meat.' },
    { ja: 'とても おいしい です', es: 'Está muy rico.', en: 'It is very good.' },
  ], ids: ['itadakimasu', 'watashi', 'sakana', 'tabemasu', 'otouto', 'niku', 'totemo', 'oishii'] },
  { id: 'r_suki', title: { es: 'Lo que nos gusta', en: 'What we like' }, lines: [
    { ja: 'はは は おちゃ が すき です', es: 'A mi madre le gusta el té.', en: 'My mother likes tea.' },
    { ja: 'ちち は コーヒー が すき です', es: 'A mi padre le gusta el café.', en: 'My father likes coffee.' },
    { ja: 'わたし は みず を のみます', es: 'Yo bebo agua.', en: 'I drink water.' },
  ], ids: ['haha', 'ocha', 'suki', 'chichi', 'koohii', 'watashi', 'mizu', 'nomimasu'] },
  // + post
  { id: 'r_mise', title: { es: 'En la tienda', en: 'At the shop' }, lines: [
    { ja: 'すみません これ は いくら です か', es: 'Disculpa, ¿cuánto cuesta esto?', en: 'Excuse me, how much is this?' },
    { ja: 'ご ひゃく えん です', es: 'Quinientos yenes.', en: 'Five hundred yen.' },
    { ja: 'やすい です ね', es: 'Qué barato.', en: 'That is cheap.' },
    { ja: 'これ を ください', es: 'Dame esto, por favor.', en: 'This one, please.' },
    { ja: 'ありがとう ございます', es: 'Muchas gracias.', en: 'Thank you very much.' },
  ], ids: ['sumimasen', 'kore', 'ikura', 'go', 'hyaku', 'en', 'yasui', 'kudasai', 'arigatou'] },
  { id: 'r_machi', title: { es: 'Un sábado en el pueblo', en: 'A Saturday in town' }, lines: [
    { ja: 'きょう は どようび です', es: 'Hoy es sábado.', en: 'Today is Saturday.' },
    { ja: 'ともだち と でんしゃ で まち へ いきます', es: 'Voy al pueblo en tren con una amiga.', en: 'I go to town by train with a friend.' },
    { ja: 'みせ で パン を かいます', es: 'Compro pan en una tienda.', en: 'I buy bread at a shop.' },
    { ja: 'ろく じ に いえ に かえります', es: 'A las seis vuelvo a casa.', en: 'At six I go back home.' },
  ], ids: ['kyou', 'doyoubi', 'tomodachi', 'densha', 'machi', 'ikimasu', 'mise', 'pan', 'kaimasu', 'roku', 'ji', 'ie', 'kaerimasu'] },
  // + ruins
  { id: 'r_gakkou', title: { es: 'En la escuela', en: 'At school' }, lines: [
    { ja: 'げつようび に がっこう へ いきます', es: 'El lunes voy a la escuela.', en: 'On Monday I go to school.' },
    { ja: 'がっこう で かんじ を かきます', es: 'En la escuela escribo kanji.', en: 'At school I write kanji.' },
    { ja: 'にほんご の ほん も よみます', es: 'También leo un libro en japonés.', en: 'I also read a Japanese book.' },
    { ja: 'せんせい さようなら', es: 'Adiós, profesora.', en: 'Goodbye, teacher.' },
  ], ids: ['getsuyoubi', 'gakkou', 'ikimasu', 'kanji', 'kakimasu', 'nihongo', 'hon', 'yomimasu', 'sensei', 'sayounara'] },
  { id: 'r_doko', title: { es: '¿Dónde está mi libro?', en: 'Where is my book?' }, lines: [
    { ja: 'わたし の ほん は どこ です か', es: '¿Dónde está mi libro?', en: 'Where is my book?' },
    { ja: 'つくえ の うえ に あります か', es: '¿Está sobre el escritorio?', en: 'Is it on the desk?' },
    { ja: 'いいえ かばん の なか に あります', es: 'No, está dentro del bolso.', en: 'No, it is in the bag.' },
  ], ids: ['watashi', 'hon', 'doko', 'tsukue', 'ue', 'arimasu', 'iie', 'kaban', 'naka'] },
  // + ranch
  { id: 'r_inu', title: { es: 'El perro de casa', en: 'Our dog' }, lines: [
    { ja: 'いえ に いぬ が います', es: 'En casa hay un perro.', en: 'There is a dog at home.' },
    { ja: 'いぬ は ちいさい です', es: 'El perro es pequeño.', en: 'The dog is small.' },
    { ja: 'とても かわいい です', es: 'Es muy lindo.', en: 'It is very cute.' },
    { ja: 'いぬ は にく が すき です', es: 'Al perro le gusta la carne.', en: 'The dog likes meat.' },
  ], ids: ['ie', 'inu', 'imasu', 'chiisai', 'totemo', 'kawaii', 'niku', 'suki'] },
  { id: 'r_mura', title: { es: 'La aldea', en: 'The village' }, lines: [
    { ja: 'むら に うま と うし が います', es: 'En la aldea hay caballos y vacas.', en: 'There are horses and cows in the village.' },
    { ja: 'うま は はやい です', es: 'Los caballos son rápidos.', en: 'Horses are fast.' },
    { ja: 'むら で こめ を つくります', es: 'En la aldea se cultiva arroz.', en: 'They grow rice in the village.' },
    { ja: 'いちば で こめ を うります', es: 'El arroz se vende en el mercado.', en: 'They sell the rice at the market.' },
  ], ids: ['mura', 'uma', 'ushi', 'imasu', 'hayai', 'kome', 'tsukurimasu', 'ichiba', 'urimasu'] },
  // + lake
  { id: 'r_tenki', title: { es: 'Hoy y mañana', en: 'Today and tomorrow' }, lines: [
    { ja: 'きょう は いい てんき です', es: 'Hoy hace buen tiempo.', en: 'The weather is nice today.' },
    { ja: 'そら は あおい です', es: 'El cielo está azul.', en: 'The sky is blue.' },
    { ja: 'うみ へ いきます', es: 'Voy al mar.', en: 'I am going to the sea.' },
    { ja: 'あした は あめ が ふります', es: 'Mañana va a llover.', en: 'It will rain tomorrow.' },
    { ja: 'あした は いえ で ほん を よみます', es: 'Mañana leo un libro en casa.', en: 'Tomorrow I will read a book at home.' },
  ], ids: ['kyou', 'ii', 'tenki', 'sora', 'aoi', 'umi', 'ikimasu', 'ashita', 'ame', 'furimasu', 'ie', 'hon', 'yomimasu'] },
  { id: 'r_michi', title: { es: '¿Dónde queda la estación?', en: 'Where is the station?' }, lines: [
    { ja: 'すみません えき は どこ です か', es: 'Disculpa, ¿dónde queda la estación?', en: 'Excuse me, where is the station?' },
    { ja: 'みち の ひだり に みせ が あります', es: 'A la izquierda de la calle hay una tienda.', en: 'There is a shop on the left side of the street.' },
    { ja: 'えき は みせ の みぎ です', es: 'La estación está a la derecha de la tienda.', en: 'The station is to the right of the shop.' },
    { ja: 'どうも ありがとう ございます', es: 'Muchas gracias.', en: 'Thank you very much.' },
  ], ids: ['sumimasen', 'eki', 'doko', 'michi', 'hidari', 'mise', 'arimasu', 'migi', 'doumo', 'arigatou'] },
  // + shrine
  { id: 'r_ichinichi', title: { es: 'Mi día', en: 'My day' }, lines: [
    { ja: 'あさ ろく じ に おきます', es: 'Me levanto a las seis de la mañana.', en: 'I get up at six in the morning.' },
    { ja: 'ごはん の まえ に はしります', es: 'Antes de comer, corro.', en: 'Before the meal, I run.' },
    { ja: 'はち じ に いえ を でます', es: 'A las ocho salgo de casa.', en: 'At eight I leave home.' },
    { ja: 'よる じゅう じ に ねます', es: 'A las diez de la noche me acuesto.', en: 'At ten at night I go to bed.' },
  ], ids: ['asa', 'roku', 'ji', 'okimasu', 'gohan', 'mae', 'hashirimasu', 'hachi', 'ie', 'demasu', 'yoru', 'juu', 'nemasu'] },
  { id: 'r_kinou', title: { es: 'Ayer', en: 'Yesterday' }, lines: [
    { ja: 'きのう は にちようび でした', es: 'Ayer fue domingo.', en: 'Yesterday was Sunday.' },
    { ja: 'ともだち が いえ に きました', es: 'Un amigo vino a casa.', en: 'A friend came to my house.' },
    { ja: 'それから まち で あたらしい くつ を かいました', es: 'Después compré zapatos nuevos en el pueblo.', en: 'Then I bought new shoes in town.' },
    { ja: 'よる おふろ に はいりました', es: 'Por la noche me di un baño.', en: 'At night I took a bath.' },
  ], ids: ['kinou', 'nichiyoubi', 'tomodachi', 'ie', 'kimasu', 'sorekara', 'machi', 'atarashii', 'kutsu', 'kaimasu', 'yoru', 'ofuro', 'hairimasu'] },
];

// Uso real de cada kanji del juego: 'daily' (de todos los días), 'rare' (poco frecuente)
// o 'piece' (casi solo sirve de pieza). Se listan SOLO los que no son 'daily'.
// Criterio: frecuencia en el japonés cotidiano de un principiante (zona N5–N4 y palabras
// de la casa como 皿 o 豆), no el nivel JLPT estricto.
export const USE = {
  // Casi solo piezas: no se encuentran como palabra suelta
  '喿': 'piece', '澡': 'piece', '艸': 'piece',
  // Poco frecuentes para quien empieza
  '寸': 'rare', '斤': 'rare', '炎': 'rare', '晶': 'rare', '姓': 'rare', '杏': 'rare', '旦': 'rare', '朋': 'rare',
  '享': 'rare', '軍': 'rare', '圧': 'rare', '句': 'rare', '旬': 'rare', '杉': 'rare', '焚': 'rare', '盟': 'rare',
  '枯': 'rare', '視': 'rare', '症': 'rare', '延': 'rare', '禁': 'rare', '薪': 'rare', '操': 'rare', '燥': 'rare',
  '繰': 'rare', '襟': 'rare', '億': 'rare', '憶': 'rare', '藻': 'rare', '央': 'rare', '士': 'rare', '刀': 'rare',
  '矢': 'rare', '欠': 'rare', '舌': 'rare', '貝': 'rare', '占': 'rare', '至': 'rare', '孝': 'rare', '尾': 'rare',
  '床': 'rare', '衣': 'rare', '示': 'rare', '羽': 'rare', '故': 'rare', '案': 'rare', '居': 'rare', '周': 'rare',
  '可': 'rare', '完': 'rare',
};
export const useOf = k => USE[k] || 'daily';

// ── Autochequeo ──
// Devuelve una lista de errores (vacía si todo está bien).
// Formas de un verbo que pueden aparecer como ficha (docs/CURRICULO.md): las corteses sobre la raíz de ます
// (〜ます · ました · ません · ませんでした · ましょう · たい), la forma て (campo te), las que salen de ella
// (〜た · 〜たり) y la de diccionario (campo dict). Una sola definición para lang.js, lex.js y curriculum.js.
const VERB_ENDS = ['ます', 'ました', 'ません', 'ませんでした', 'ましょう', 'たい', 'ながら', 'そう'];
// Adjetivos な (no forman 〜そう quitando la い final)
export const taOf = te => te && te.replace(/て$/, 'た').replace(/で$/, 'だ');
const NA_ADJ = new Set(['kirei', 'genki', 'suki', 'jouzu', 'heta', 'dame', 'kirai', 'shizuka', 'nigiyaka', 'benri', 'yuumei', 'shinsetsu']);
// Etapa 4: potencial cortés (pot: たべられます, con sus ません · ました y la forma corta potd), volitiva (vol: いこう) y
// condicional (ba: いけば). Van como campos del verbo porque no se pueden deducir sin saber su grupo.
const masuSet = f => f ? [f, f.slice(0, -2) + 'ません', f.slice(0, -2) + 'ました'] : [];
const potForms = w => w.pot ? [...masuSet(w.pot), ...(w.potd ? [w.potd] : [])] : [];
// Pasiva (pass: しかられます) y causativa (caus: たべさせます), también con sus ません · ました
const passForms = w => [...masuSet(w.pass), ...masuSet(w.caus)];
// Adjetivos い (P-10): 〜そう · 〜くない · 〜かった · 〜くなかった · 〜くて sobre la raíz sin い. いい es irregular: conjuga
// sobre よ (よさそう · よくない · よかった…). Los な quedan en su raíz: la cópula (じゃない · でした · な) va como ficha aparte.
const ADJ_ENDS = ['そう', 'くない', 'かった', 'くなかった', 'くて'];
const isIAdj = w => w.kind === 'adj' && w.kana.endsWith('い') && !NA_ADJ.has(w.id);
const adjStem = w => w.id === 'ii' ? 'よ' : w.kana.slice(0, -1);
// Forma ない (P-14): 〜ない · 〜ないで · 〜なかった sobre la raíz negativa de la forma de diccionario (campo dict).
// Grupo: ichidan si dict = raíz de ます + る y te = raíz + て (たべる · みる); irregulares する · くる (y ...する); ある → ない;
// el resto es godan (い-fila → あ-fila: いく → いかない, かう → かわない). La forma た corta ya sale de te (taOf: いって → いった).
const GODAN_A = { 'う': 'わ', 'く': 'か', 'ぐ': 'が', 'す': 'さ', 'つ': 'た', 'ぬ': 'な', 'ぶ': 'ば', 'む': 'ま', 'る': 'ら' };
export function verbGroup(w) {
  if (!w.dict) return null;
  if (w.dict.endsWith('する') || w.dict === 'くる') return 'irr';
  if (w.dict === 'ある') return 'aru';
  const stem = w.kana.slice(0, -2);
  return w.dict === stem + 'る' && w.te === stem + 'て' ? 'ichi' : 'godan';
}
export function naiStem(w) {
  const g = verbGroup(w), d = w.dict;
  if (!g) return null;
  if (g === 'aru') return '';
  if (g === 'irr') return d.slice(0, -2) + (d.endsWith('する') ? 'し' : 'こ');
  if (g === 'ichi') return d.slice(0, -1);
  return d.slice(0, -1) + GODAN_A[d.slice(-1)];
}
const NAI_ENDS = ['ない', 'ないで', 'なかった'];
const naiForms = w => { const s = naiStem(w); return s === null ? [] : NAI_ENDS.map(e => s + e); };
export function verbForms(w) {
  if (w.kind === 'adj') return isIAdj(w) ? [w.kana, ...ADJ_ENDS.map(e => adjStem(w) + (w.id === 'ii' && e === 'そう' ? 'さそう' : e))] : [w.kana];
  if (w.kind !== 'v') return [w.kana];
  const stem = w.kana.slice(0, -2), ta = taOf(w.te);
  return [...VERB_ENDS.map(e => stem + e), ...(w.te ? [w.te, ta, ta + 'り', ta + 'ら'] : []), ...(w.dict ? [w.dict] : []), ...naiForms(w),
    ...potForms(w), ...passForms(w), ...(w.vol ? [w.vol] : []), ...(w.ba ? [w.ba] : [])];
}
// La misma forma escrita con kanji (para mostrarla cuando el jugador ya los tiene)
export function verbKanji(w, form) {
  if (!w.kanji || form === w.kana) return w.kanji;
  // 高い → 高くない · 高かった. いい no tiene kanji en LEX; si algún día lo tiene (良い), よ ocupa el lugar de い y la cuenta sigue bien.
  if (w.kind === 'adj') return isIAdj(w) ? w.kanji.slice(0, -1) + form.slice(adjStem(w).length) : w.kanji;
  if (w.kind !== 'v') return w.kanji;
  if (form === w.dict) return w.dictk || w.kanji;
  if (w.dict && naiForms(w).includes(form)) {
    // 行く → 行かない: la parte con kanji queda y la okurigana se cambia (来る → 来ない)
    const dk = w.dictk || w.kanji, r = [...dk].reverse().findIndex(c => !/[ぁ-ゟ]/.test(c));
    return dk.slice(0, dk.length - r) + form.slice(w.dict.length - r);
  }
  if (form === w.vol) return w.volk || w.kanji;
  if (form === w.ba) return w.bak || w.kanji;
  if (w.pot && potForms(w).includes(form)) {
    if (form === w.potd) return w.potdk || w.potk || w.kanji;
    return (w.potk || w.kanji).slice(0, -2) + form.slice(w.pot.length - 2);
  }
  for (const [f, k] of [[w.pass, w.passk], [w.caus, w.causk]]) if (f && masuSet(f).includes(form)) return (k || w.kanji).slice(0, -2) + form.slice(f.length - 2);
  if (w.te && [w.te, taOf(w.te), taOf(w.te) + 'り', taOf(w.te) + 'ら'].includes(form)) {
    const k = w.tek || w.kanji;
    return form === w.te ? k : taOf(k) + form.slice(taOf(w.te).length);
  }
  return w.kanji.slice(0, -2) + form.slice(w.kana.length - 2);
}
export function checkLang() {
  const errs = [];
  const KINDS = ['expr', 'n', 'v', 'adj', 'num', 'q'];
  const sitIdx = Object.fromEntries(SITUATIONS.map((s, i) => [s.id, i]));
  const byId = {}, lexIdx = {};
  const dup = (list, what) => { const seen = new Set(); for (const x of list) { if (seen.has(x.id)) errs.push(`${what}: id repetido ${x.id}`); seen.add(x.id); } };
  dup(SITUATIONS, 'SITUATIONS'); dup(LEX, 'LEX'); dup(PATTERNS, 'PATTERNS'); dup(PHRASES, 'PHRASES'); dup(READINGS, 'READINGS');

  LEX.forEach((w, i) => {
    byId[w.id] = w; lexIdx[w.id] = i;
    if (!/^[a-z]+$/.test(w.id)) errs.push(`LEX ${w.id}: el id debe ser romaji en minúscula`);
    if (!(w.sit in sitIdx)) errs.push(`LEX ${w.id}: situación desconocida ${w.sit}`);
    if (!KINDS.includes(w.kind)) errs.push(`LEX ${w.id}: kind desconocido ${w.kind}`);
    if (!w.kana || !/^[ぁ-ゟ゠-ヿ]+$/.test(w.kana)) errs.push(`LEX ${w.id}: kana inválido`);
    if (!w.es) errs.push(`LEX ${w.id}: falta traducción`);
    if (w.kind === 'v' && !w.kana.endsWith('ます')) errs.push(`LEX ${w.id}: los verbos van en forma ます`);
    if (i && sitIdx[w.sit] < sitIdx[LEX[i - 1].sit]) errs.push(`LEX ${w.id}: fuera del orden de situaciones`);
  });
  for (const s of SITUATIONS) {
    const n = LEX.filter(w => w.sit === s.id).length;
    if (!n) errs.push(`Situación ${s.id}: sin palabras`);
    // Era 50; P-08a (etapa 2, unidades 2.1–2.6) suma ~60 palabras y lleva hill, post y shrine a 60–62.
    // Era 80; P-08d (2.19–2.24) suma 126 palabras realmente nuevas (pedido de ~20 por unidad) y lleva post y shrine a ~100.
    // Queda en 130 para que P-08e (2.25–2.30) también entre sin tocar el tope.
    else if (n < 15 || n > 130) errs.push(`Situación ${s.id}: ${n} palabras (se esperan 15–130; el currículo de docs/CURRICULO.md suma palabras a las situaciones)`);
    const np = PHRASES.filter(p => p.sit === s.id).length;
    if (np < 5 || np > 8) errs.push(`Situación ${s.id}: ${np} frases (se esperan 5–8)`);
    for (const f of ['title', 'cando']) if (!s[f]?.es) errs.push(`Situación ${s.id}: falta ${f}`);
  }

  // Cada ficha de `ja` es una palabra listada en ids (o su conjugación) o una partícula; y cada id se usa.
  const forms = verbForms;
  const checkJa = (where, ja, ids) => {
    const words = ids.map(id => byId[id]).filter(Boolean), used = new Set();
    for (const tok of ja.split(' ')) {
      if (!tok) { errs.push(`${where}: espacio doble en «${ja}»`); continue; }
      const hit = words.filter(w => forms(w).includes(tok));
      if (hit.length) hit.forEach(w => used.add(w.id));
      else if (!PARTICLES.includes(tok)) errs.push(`${where}: la ficha «${tok}» no es una palabra de ids ni una partícula`);
    }
    return used;
  };

  const patIds = new Set(PATTERNS.map(p => p.id)), seenPat = new Set(), inPhrase = new Set();
  let prevSit = -1, runMax = -1;
  for (const p of PHRASES) {
    const si = sitIdx[p.sit];
    if (si === undefined) { errs.push(`Frase ${p.id}: situación desconocida ${p.sit}`); continue; }
    if (si < prevSit) errs.push(`Frase ${p.id}: fuera del orden de situaciones`);
    if (si !== prevSit) { prevSit = si; runMax = -1; }
    if (p.pat !== null && !patIds.has(p.pat)) errs.push(`Frase ${p.id}: patrón desconocido ${p.pat}`);
    if (!p.es) errs.push(`Frase ${p.id}: falta traducción`);
    let max = -1;
    for (const id of p.ids) {
      const w = byId[id];
      if (!w) { errs.push(`Frase ${p.id}: la palabra ${id} no existe en LEX`); continue; }
      if (sitIdx[w.sit] > si) errs.push(`Frase ${p.id}: usa ${id}, de una situación posterior (${w.sit})`);
      max = Math.max(max, lexIdx[id]); inPhrase.add(id);
    }
    const used = checkJa(`Frase ${p.id}`, p.ja, p.ids);
    for (const id of p.ids) if (byId[id] && !used.has(id)) errs.push(`Frase ${p.id}: ${id} está en ids pero no en ja`);
    // Una sola novedad: o trae una palabra más tardía que las frases anteriores de la situación, o un patrón nuevo.
    const newPat = p.pat !== null && !seenPat.has(p.pat);
    if (max <= runMax && !newPat) errs.push(`Frase ${p.id}: no trae novedad (ni palabra más tardía ni patrón nuevo)`);
    runMax = Math.max(runMax, max);
    if (p.pat !== null) seenPat.add(p.pat);
  }
  for (const pt of PATTERNS) if (!seenPat.has(pt.id) && !pt.cur) errs.push(`Patrón ${pt.id}: ninguna frase lo usa`);
  // La cobertura de frases de viaje ya no se mide aquí sobre todo LEX: desde P-08c la mide checkCurriculum() (js/curriculum.js),
  // solo sobre las palabras que no tienen frase propia del currículo (EXTRA), con mínimo 30 %. Decidido por Nicolás el
  // 15/11/2026: las palabras del currículo se practican con sus propias frases y las situaciones tienen el máximo de 8
  // frases de viaje. Historia: 40 % sobre todo LEX → 30 % (P-07) → 25 % (P-08b+).

  let prevLevel = -1;
  for (const r of READINGS) {
    if (!r.title?.es) errs.push(`Lectura ${r.id}: falta título`);
    if (r.lines.length < 2 || r.lines.length > 5) errs.push(`Lectura ${r.id}: ${r.lines.length} líneas (se esperan 2–5)`);
    const used = new Set();
    let level = -1;
    for (const id of r.ids) {
      if (!byId[id]) errs.push(`Lectura ${r.id}: la palabra ${id} no existe en LEX`);
      else level = Math.max(level, sitIdx[byId[id].sit]);
    }
    if (new Set(r.ids).size !== r.ids.length) errs.push(`Lectura ${r.id}: ids repetidos`);
    r.lines.forEach((l, i) => {
      if (!l.es) errs.push(`Lectura ${r.id}, línea ${i + 1}: falta traducción`);
      checkJa(`Lectura ${r.id}, línea ${i + 1}`, l.ja, r.ids).forEach(id => used.add(id));
    });
    for (const id of r.ids) if (byId[id] && !used.has(id)) errs.push(`Lectura ${r.id}: ${id} está en ids pero no en el texto`);
    if (level < prevLevel) errs.push(`Lectura ${r.id}: más fácil que la anterior (las lecturas van graduadas)`);
    prevLevel = level;
  }

  // P-14: formas ない y た corta de verbos conocidos (docs/PROGRESION.md §14)
  const NAI = {
    okurimasu: ['おくらない', 'おくらないで', 'おくらなかった', 'おくった'], tsukurimasu: ['つくらない', 'つくらないで', 'つくらなかった', 'つくった'],
    ikimasu: ['いかない', 'いかないで', 'いかなかった', 'いった'], kimasu: ['こない', 'こないで', 'こなかった', 'きた'],
    shimasu: ['しない', 'しないで', 'しなかった', 'した'], tabemasu: ['たべない', 'たべないで', 'たべなかった', 'たべた'],
    nomimasu: ['のまない', 'のまないで', 'のまなかった', 'のんだ'], kaimasu: ['かわない', 'かわないで', 'かわなかった', 'かった'],
    machimasu: ['またない', 'またないで', 'またなかった', 'まった'], hanashimasu: ['はなさない', 'はなさないで', 'はなさなかった', 'はなした'],
    kaerimasu: ['かえらない', 'かえらないで', 'かえらなかった', 'かえった'], arimasu: ['ない', 'ないで', 'なかった', 'あった'],
    imasu: ['いない', 'いないで', 'いなかった', 'いた'], mimasu: ['みない', 'みないで', 'みなかった', 'みた'],
    oyogimasu: ['およがない', 'およがないで', 'およがなかった', 'およいだ'], asobimasu: ['あそばない', 'あそばないで', 'あそばなかった', 'あそんだ'],
    shinimasu: ['しなない', 'しなないで', 'しななかった', 'しんだ'],
  };
  for (const [id, want] of Object.entries(NAI)) {
    const w = byId[id];
    if (!w) continue;
    const got = [...naiForms(w), taOf(w.te)];
    if (got.join() !== want.join()) errs.push(`Formas ない/た de ${id}: salió ${got.join('・')} y se esperaba ${want.join('・')}`);
  }
  for (const w of LEX) if (w.kind === 'v') {
    if (!w.dict) { errs.push(`LEX ${w.id}: falta dict (forma de diccionario)`); continue; }
    if (w.kanji && !w.dictk) errs.push(`LEX ${w.id}: tiene kanji pero no dictk`);
    if (w.dictk && naiForms(w).length !== 3) errs.push(`LEX ${w.id}: sin formas ない`);
    for (const f of naiForms(w)) if (!/^[ぁ-ゟ]+$/.test(f)) errs.push(`LEX ${w.id}: forma ない inválida ${f}`);
  }

  for (const [k, v] of Object.entries(USE)) if (v !== 'rare' && v !== 'piece') errs.push(`USE ${k}: valor desconocido ${v}`);
  return errs;
}
