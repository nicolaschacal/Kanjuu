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
  // Etapa 3 del currículo
  { id: 'hou', kana: 'ほう', kanji: '方', es: 'lado (〜の ほう が: «es más…»)', en: "side (〜の ほう が: «more…»)", sit: 'forest', kind: 'n' },
  { id: 'ichiban', kana: 'いちばん', kanji: '一番', es: 'el más · número uno', en: "the most · number one", sit: 'forest', kind: 'expr' },
  { id: 'ooi', kana: 'おおい', kanji: '多い', es: 'mucho · muchos', en: "many · a lot", sit: 'forest', kind: 'adj' },
  { id: 'sukunai', kana: 'すくない', kanji: '少ない', es: 'poco · pocos', en: "few · little", sit: 'forest', kind: 'adj' },

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
  // Etapa 3 del currículo
  { id: 'koto', kana: 'こと', kanji: '事', es: 'cosa · hecho (〜た こと が ある)', en: "thing · fact (〜た こと が ある)", sit: 'valley', kind: 'n' },
  { id: 'ryokou', kana: 'りょこう', kanji: '旅行', es: 'viaje', en: "trip", sit: 'valley', kind: 'n' },
  { id: 'soto', kana: 'そと', kanji: '外', es: 'afuera', en: "outside", sit: 'valley', kind: 'n' },
  { id: 'iimasu', kana: 'いいます', kanji: '言います', te: 'いって', tek: '言って', dict: 'いう', dictk: '言う', es: 'decir', en: "to say", sit: 'valley', kind: 'v' },

  // ── spring · Comida y gustos ──
  { id: 'gohan', kana: 'ごはん', kanji: 'ご飯', es: 'arroz cocido · comida', en: 'cooked rice · meal', sit: 'spring', kind: 'n' },
  { id: 'tabemasu', kana: 'たべます', kanji: '食べます', te: 'たべて', tek: '食べて', dict: 'たべる', dictk: '食べる', es: 'comer', en: 'to eat', sit: 'spring', kind: 'v' },
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
  // Etapa 2 del currículo
  { id: 'kuroi', kana: 'くろい', kanji: '黒い', es: 'negro', en: "black", sit: 'spring', kind: 'adj' },
  { id: 'raamen', kana: 'ラーメン', kanji: null, es: 'ramen', en: "ramen", sit: 'spring', kind: 'n' },
  { id: 'ongaku', kana: 'おんがく', kanji: '音楽', es: 'música', en: "music", sit: 'spring', kind: 'n' },
  { id: 'uta', kana: 'うた', kanji: '歌', es: 'canción', en: "song", sit: 'spring', kind: 'n' },
  { id: 'utaimasu', kana: 'うたいます', kanji: '歌います', te: 'うたって', tek: '歌って', dict: 'うたう', dictk: '歌う', es: 'cantar', en: "to sing", sit: 'spring', kind: 'v' },

  // ── post · Compras y ciudad ──
  { id: 'kore', kana: 'これ', kanji: null, es: 'esto', en: 'this', sit: 'post', kind: 'n' },
  { id: 'ikura', kana: 'いくら', kanji: null, es: 'cuánto cuesta', en: 'how much', sit: 'post', kind: 'q' },
  { id: 'en', kana: 'えん', kanji: '円', es: 'yen', en: 'yen', sit: 'post', kind: 'n' },
  { id: 'hyaku', kana: 'ひゃく', kanji: '百', es: 'cien', en: 'hundred', sit: 'post', kind: 'num' },
  { id: 'sen', kana: 'せん', kanji: '千', es: 'mil', en: 'thousand', sit: 'post', kind: 'num' },
  { id: 'sore', kana: 'それ', kanji: null, es: 'eso', en: 'that', sit: 'post', kind: 'n' },
  { id: 'kudasai', kana: 'ください', kanji: null, es: 'dame, por favor', en: 'please give me', sit: 'post', kind: 'expr' },
  { id: 'man', kana: 'まん', kanji: '万', es: 'diez mil', en: 'ten thousand', sit: 'post', kind: 'num' },
  { id: 'ikimasu', kana: 'いきます', kanji: '行きます', te: 'いって', tek: '行って', dict: 'いく', dictk: '行く', es: 'ir', en: 'to go', sit: 'post', kind: 'v' },
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
  // Etapa 2 del currículo
  { id: 'furui', kana: 'ふるい', kanji: '古い', es: 'viejo · antiguo (cosas)', en: "old (things)", sit: 'post', kind: 'adj' },
  { id: 'takai', kana: 'たかい', kanji: '高い', es: 'caro · alto', en: "expensive · tall", sit: 'post', kind: 'adj' },
  // Etapa 3 del currículo
  { id: 'omoimasu', kana: 'おもいます', kanji: '思います', te: 'おもって', tek: '思って', dict: 'おもう', dictk: '思う', es: 'pensar · creer', en: "to think", sit: 'post', kind: 'v' },
  { id: 'shirimasu', kana: 'しります', kanji: '知ります', te: 'しって', tek: '知って', dict: 'しる', dictk: '知る', es: 'saber · conocer (しって います)', en: "to know (しって います)", sit: 'post', kind: 'v' },
  { id: 'kangaemasu', kana: 'かんがえます', kanji: '考えます', te: 'かんがえて', tek: '考えて', dict: 'かんがえる', dictk: '考える', es: 'pensar · reflexionar', en: "to think · consider", sit: 'post', kind: 'v' },

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
  { id: 'yomimasu', kana: 'よみます', kanji: '読みます', te: 'よんで', tek: '読んで', dict: 'よむ', dictk: '読む', es: 'leer', en: 'to read', sit: 'ruins', kind: 'v' },
  { id: 'kanji', kana: 'かんじ', kanji: '漢字', es: 'kanji', en: 'kanji', sit: 'ruins', kind: 'n' },
  { id: 'benkyou', kana: 'べんきょう', kanji: '勉強', es: 'estudio', en: 'study', sit: 'ruins', kind: 'n' },
  { id: 'shimasu', kana: 'します', kanji: null, te: 'して', dict: 'する', es: 'hacer', en: 'to do', sit: 'ruins', kind: 'v' },
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
  { id: 'hanashimasu', kana: 'はなします', kanji: '話します', te: 'はなして', tek: '話して', dict: 'はなす', dictk: '話す', es: 'hablar', en: "to speak", sit: 'ruins', kind: 'v' },
  { id: 'kikimasu', kana: 'ききます', kanji: '聞きます', te: 'きいて', tek: '聞いて', dict: 'きく', dictk: '聞く', es: 'escuchar · preguntar', en: "to listen · to ask", sit: 'ruins', kind: 'v' },

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
  // Etapa 3 del currículo
  { id: 'atama', kana: 'あたま', kanji: '頭', es: 'cabeza', en: "head", sit: 'ranch', kind: 'n' },
  { id: 'te', kana: 'て', kanji: '手', es: 'mano', en: "hand", sit: 'ranch', kind: 'n' },
  { id: 'karada', kana: 'からだ', kanji: '体', es: 'cuerpo', en: "body", sit: 'ranch', kind: 'n' },
  { id: 'byouki', kana: 'びょうき', kanji: '病気', es: 'enfermedad · enfermo', en: "illness · sick", sit: 'ranch', kind: 'n' },
  { id: 'kusuri', kana: 'くすり', kanji: '薬', es: 'remedio', en: "medicine", sit: 'ranch', kind: 'n' },
  { id: 'itai', kana: 'いたい', kanji: '痛い', es: 'duele · doloroso', en: "painful · it hurts", sit: 'ranch', kind: 'adj' },

  // ── lake · Clima y direcciones ──
  { id: 'tenki', kana: 'てんき', kanji: '天気', es: 'tiempo · clima', en: 'weather', sit: 'lake', kind: 'n' },
  { id: 'ii', kana: 'いい', kanji: null, es: 'bueno', en: 'good', sit: 'lake', kind: 'adj' },
  { id: 'ame', kana: 'あめ', kanji: '雨', es: 'lluvia', en: 'rain', sit: 'lake', kind: 'n' },
  { id: 'furimasu', kana: 'ふります', kanji: '降ります', te: 'ふって', tek: '降って', dict: 'ふる', dictk: '降る', es: 'caer (lluvia, nieve)', en: 'to fall (rain, snow)', sit: 'lake', kind: 'v' },
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
  // Etapa 2 del currículo
  { id: 'yuki', kana: 'ゆき', kanji: '雪', es: 'nieve', en: "snow", sit: 'lake', kind: 'n' },
  { id: 'haru', kana: 'はる', kanji: '春', es: 'primavera', en: "spring (season)", sit: 'lake', kind: 'n' },
  { id: 'aki', kana: 'あき', kanji: '秋', es: 'otoño', en: "autumn", sit: 'lake', kind: 'n' },
  { id: 'massugu', kana: 'まっすぐ', kanji: null, es: 'derecho (sin doblar)', en: "straight ahead", sit: 'lake', kind: 'expr' },
  { id: 'magarimasu', kana: 'まがります', kanji: '曲がります', te: 'まがって', tek: '曲がって', dict: 'まがる', dictk: '曲がる', es: 'doblar (en una esquina)', en: "to turn", sit: 'lake', kind: 'v' },

  // ── shrine · Rutina diaria ──
  { id: 'asa', kana: 'あさ', kanji: '朝', es: 'mañana (parte del día)', en: 'morning', sit: 'shrine', kind: 'n' },
  { id: 'okimasu', kana: 'おきます', kanji: '起きます', te: 'おきて', tek: '起きて', dict: 'おきる', dictk: '起きる', es: 'levantarse', en: 'to get up', sit: 'shrine', kind: 'v' },
  { id: 'mainichi', kana: 'まいにち', kanji: '毎日', es: 'todos los días', en: 'every day', sit: 'shrine', kind: 'n' },
  { id: 'yoru', kana: 'よる', kanji: '夜', es: 'noche', en: 'night', sit: 'shrine', kind: 'n' },
  { id: 'nemasu', kana: 'ねます', kanji: '寝ます', te: 'ねて', tek: '寝て', dict: 'ねる', dictk: '寝る', es: 'dormir · acostarse', en: 'to sleep · to go to bed', sit: 'shrine', kind: 'v' },
  { id: 'kinou', kana: 'きのう', kanji: '昨日', es: 'ayer', en: 'yesterday', sit: 'shrine', kind: 'n' },
  { id: 'mimasu', kana: 'みます', kanji: '見ます', te: 'みて', tek: '見て', dict: 'みる', dictk: '見る', es: 'ver · mirar', en: 'to see · to watch', sit: 'shrine', kind: 'v' },
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
];

// Fichas que no son palabras de LEX: partículas, cópula y terminaciones de cortesía.
export const PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'も', 'の', 'と', 'か', 'ね', 'です', 'でした', 'でしょう', 'だ', 'より', 'ございます', 'お'];

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
const VERB_ENDS = ['ます', 'ました', 'ません', 'ませんでした', 'ましょう', 'たい'];
export const taOf = te => te && te.replace(/て$/, 'た').replace(/で$/, 'だ');
export function verbForms(w) {
  if (w.kind !== 'v') return [w.kana];
  const stem = w.kana.slice(0, -2), ta = taOf(w.te);
  return [...VERB_ENDS.map(e => stem + e), ...(w.te ? [w.te, ta, ta + 'り'] : []), ...(w.dict ? [w.dict] : [])];
}
// La misma forma escrita con kanji (para mostrarla cuando el jugador ya los tiene)
export function verbKanji(w, form) {
  if (!w.kanji || w.kind !== 'v' || form === w.kana) return w.kanji;
  if (form === w.dict) return w.dictk || w.kanji;
  if (w.te && [w.te, taOf(w.te), taOf(w.te) + 'り'].includes(form)) {
    const k = w.tek || w.kanji;
    return form === w.te ? k : form === taOf(w.te) ? taOf(k) : taOf(k) + 'り';
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
    if (!w.es || !w.en) errs.push(`LEX ${w.id}: falta traducción`);
    if (w.kind === 'v' && !w.kana.endsWith('ます')) errs.push(`LEX ${w.id}: los verbos van en forma ます`);
    if (i && sitIdx[w.sit] < sitIdx[LEX[i - 1].sit]) errs.push(`LEX ${w.id}: fuera del orden de situaciones`);
  });
  for (const s of SITUATIONS) {
    const n = LEX.filter(w => w.sit === s.id).length;
    if (!n) errs.push(`Situación ${s.id}: sin palabras`);
    else if (n < 15 || n > 30) errs.push(`Situación ${s.id}: ${n} palabras (se esperan 15–30; el currículo de docs/CURRICULO.md suma palabras a las situaciones)`);
    const np = PHRASES.filter(p => p.sit === s.id).length;
    if (np < 5 || np > 8) errs.push(`Situación ${s.id}: ${np} frases (se esperan 5–8)`);
    for (const f of ['title', 'cando']) if (!s[f]?.es || !s[f]?.en) errs.push(`Situación ${s.id}: falta ${f}`);
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
    if (!p.es || !p.en) errs.push(`Frase ${p.id}: falta traducción`);
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
  for (const pt of PATTERNS) if (!seenPat.has(pt.id)) errs.push(`Patrón ${pt.id}: ninguna frase lo usa`);
  const cover = inPhrase.size / LEX.length;
  // 60 %: las palabras que suma el currículo (docs/CURRICULO.md) se practican con sus propias frases (EXTRA en js/curriculum.js)
  if (cover < .6) errs.push(`Solo el ${Math.round(cover * 100)} % de las palabras aparece en alguna frase (mínimo 60 %)`);

  let prevLevel = -1;
  for (const r of READINGS) {
    if (!r.title?.es || !r.title?.en) errs.push(`Lectura ${r.id}: falta título`);
    if (r.lines.length < 2 || r.lines.length > 5) errs.push(`Lectura ${r.id}: ${r.lines.length} líneas (se esperan 2–5)`);
    const used = new Set();
    let level = -1;
    for (const id of r.ids) {
      if (!byId[id]) errs.push(`Lectura ${r.id}: la palabra ${id} no existe en LEX`);
      else level = Math.max(level, sitIdx[byId[id].sit]);
    }
    if (new Set(r.ids).size !== r.ids.length) errs.push(`Lectura ${r.id}: ids repetidos`);
    r.lines.forEach((l, i) => {
      if (!l.es || !l.en) errs.push(`Lectura ${r.id}, línea ${i + 1}: falta traducción`);
      checkJa(`Lectura ${r.id}, línea ${i + 1}`, l.ja, r.ids).forEach(id => used.add(id));
    });
    for (const id of r.ids) if (byId[id] && !used.has(id)) errs.push(`Lectura ${r.id}: ${id} está en ids pero no en el texto`);
    if (level < prevLevel) errs.push(`Lectura ${r.id}: más fácil que la anterior (las lecturas van graduadas)`);
    prevLevel = level;
  }

  for (const [k, v] of Object.entries(USE)) if (v !== 'rare' && v !== 'piece') errs.push(`USE ${k}: valor desconocido ${v}`);
  return errs;
}
