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
import { LEX, PHRASES, PATTERNS, PARTICLES, verbForms } from './lang.js';
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
  // ── etapa 2 ──
  { id: 'c_hiru', ja: 'ひる に ごはん を たべます', ids: ['hiru', 'gohan', 'tabemasu'], pat: 'masu', es: 'Al mediodía como.', en: 'I eat at noon.' },
  { id: 'c_terebi', ja: 'あさ は テレビ を みません', ids: ['asa', 'terebi', 'mimasu'], pat: 'masu', es: 'A la mañana no miro la tele.', en: 'I do not watch TV in the morning.' },
  { id: 'c_senshuu', ja: 'せんしゅう ほん を よみました', ids: ['senshuu', 'hon', 'yomimasu'], pat: 'mashita', es: 'La semana pasada leí un libro.', en: 'I read a book last week.' },
  { id: 'c_benkyou', ja: 'きのう べんきょう を しませんでした', ids: ['kinou', 'benkyou', 'shimasu'], pat: 'mashita', es: 'Ayer no estudié.', en: 'I did not study yesterday.' },
  { id: 'c_kotoshi', ja: 'ことし にほん へ いきます', ids: ['kotoshi', 'nihon', 'ikimasu'], pat: 'ni', es: 'Este año voy a Japón.', en: 'This year I am going to Japan.' },
  { id: 'c_kuroi', ja: 'くろい くつ を ください', ids: ['kuroi', 'kutsu', 'kudasai'], pat: null, es: 'Unos zapatos negros, por favor.', en: 'Black shoes, please.' },
  { id: 'c_akai', ja: 'あかい ふく は いくら です か', ids: ['akai', 'fuku', 'ikura'], pat: 'ka', es: '¿Cuánto cuesta la ropa roja?', en: 'How much are the red clothes?' },
  { id: 'c_shiroi', ja: 'しろい ふく を かいます', ids: ['shiroi', 'fuku', 'kaimasu'], pat: 'masu', es: 'Compro ropa blanca.', en: 'I buy white clothes.' },
  { id: 'c_takai', ja: 'くつ は たかい です', ids: ['kutsu', 'takai'], pat: 'adj', es: 'Los zapatos son caros.', en: 'The shoes are expensive.' },
  { id: 'c_furui', ja: 'ふるい ほん です', ids: ['furui', 'hon'], pat: null, es: 'Es un libro viejo.', en: 'It is an old book.' },
  { id: 'c_yasui', ja: 'みせ の パン は やすい です', ids: ['mise', 'pan', 'yasui'], pat: 'adj', es: 'El pan de la tienda es barato.', en: 'The bread at the shop is cheap.' },
  { id: 'c_kirei', ja: 'はな は きれい です', ids: ['hana', 'kirei'], pat: 'adj', es: 'Las flores son lindas.', en: 'The flowers are pretty.' },
  { id: 'c_eiga', ja: 'しゅうまつ いっしょ に えいが を みません か', ids: ['shuumatsu', 'issho', 'eiga', 'mimasu'], pat: null, es: '¿Vemos una película juntos el fin de semana?', en: 'Shall we watch a movie together this weekend?' },
  { id: 'c_machi', ja: 'らいしゅう いっしょ に まち へ いきましょう', ids: ['raishuu', 'issho', 'machi', 'ikimasu'], pat: null, es: 'La semana que viene vamos juntos al centro.', en: "Let's go to town together next week." },
  { id: 'c_ashitagohan', ja: 'あした ともだち と ごはん を たべます', ids: ['ashita', 'tomodachi', 'gohan', 'tabemasu'], pat: 'masu', es: 'Mañana como con un amigo.', en: 'Tomorrow I will eat with a friend.' },
  { id: 'c_doyoubi', ja: 'どようび に えいが を みましょう', ids: ['doyoubi', 'eiga', 'mimasu'], pat: null, es: 'Veamos una película el sábado.', en: "Let's watch a movie on Saturday." },
  { id: 'c_yuki', ja: 'ふゆ は ゆき が ふります', ids: ['fuyu', 'yuki', 'furimasu'], pat: null, es: 'En invierno nieva.', en: 'It snows in winter.' },
  { id: 'c_deshou', ja: 'あした は あめ でしょう', ids: ['ashita', 'ame'], pat: null, es: 'Mañana probablemente llueva.', en: 'It will probably rain tomorrow.' },  { id: 'c_mado', ja: 'へや に おおきい まど が あります', ids: ['heya', 'ookii', 'mado', 'arimasu'], pat: 'arimasu', es: 'En el cuarto hay una ventana grande.', en: 'There is a big window in the room.' },
  { id: 'c_mon', ja: 'いえ の まえ に もん が あります', ids: ['ie', 'mae', 'mon', 'arimasu'], pat: 'arimasu', es: 'Delante de la casa hay un portón.', en: 'There is a gate in front of the house.' },
  { id: 'c_niwa', ja: 'にわ に いぬ が います', ids: ['niwa', 'inu', 'imasu'], pat: 'arimasu', es: 'En el jardín hay un perro.', en: 'There is a dog in the garden.' },
  { id: 'c_massugu', ja: 'まっすぐ いって ください', ids: ['massugu', 'ikimasu', 'kudasai'], pat: null, es: 'Siga derecho, por favor.', en: 'Please go straight ahead.' },
  { id: 'c_magatte', ja: 'みぎ へ まがって ください', ids: ['migi', 'magarimasu', 'kudasai'], pat: null, es: 'Doble a la derecha, por favor.', en: 'Please turn right.' },
  { id: 'c_ekidoko', ja: 'すみません えき は どこ です か', ids: ['sumimasen', 'eki', 'doko'], pat: 'ka', es: 'Disculpe, ¿dónde está la estación?', en: 'Excuse me, where is the station?' },
  { id: 'c_hidari', ja: 'えき は ひだり に あります', ids: ['eki', 'hidari', 'arimasu'], pat: 'arimasu', es: 'La estación está a la izquierda.', en: 'The station is on the left.' },
  { id: 'c_raamen', ja: 'ラーメン に します', ids: ['raamen', 'shimasu'], pat: null, es: 'Voy a pedir ramen.', en: 'I will have ramen.' },
  { id: 'c_nikuyasai', ja: 'にく と やさい を ください', ids: ['niku', 'yasai', 'kudasai'], pat: null, es: 'Carne y verduras, por favor.', en: 'Meat and vegetables, please.' },
  { id: 'c_tamago', ja: 'たまご は おいしい です', ids: ['tamago', 'oishii'], pat: 'adj', es: 'El huevo está rico.', en: 'The egg is tasty.' },
  { id: 'c_gohansakana', ja: 'ごはん と さかな に します', ids: ['gohan', 'sakana', 'shimasu'], pat: null, es: 'Voy a pedir arroz y pescado.', en: 'I will have rice and fish.' },
  { id: 'c_haitte', ja: 'へや に はいって も いい です か', ids: ['heya', 'hairimasu', 'ii'], pat: null, es: '¿Puedo entrar al cuarto?', en: 'May I come into the room?' },
  { id: 'c_yasunde', ja: 'やすんで も いい です か', ids: ['yasumimasu', 'ii'], pat: null, es: '¿Puedo descansar?', en: 'May I rest?' },
  { id: 'c_dete', ja: 'いま でて は いけません', ids: ['ima', 'demasu', 'ikemasen'], pat: null, es: 'Ahora no se puede salir.', en: 'You must not go out now.' },
  { id: 'c_mite', ja: 'テレビ を みて も いい です か', ids: ['terebi', 'mimasu', 'ii'], pat: null, es: '¿Puedo mirar la tele?', en: 'May I watch TV?' },
  { id: 'c_yonde', ja: 'いま ほん を よんで います', ids: ['ima', 'hon', 'yomimasu', 'imasu'], pat: null, es: 'Ahora estoy leyendo un libro.', en: 'I am reading a book now.' },
  { id: 'c_kaite', ja: 'はは は てがみ を かいて います', ids: ['haha', 'tegami', 'kakimasu', 'imasu'], pat: null, es: 'Mi madre está escribiendo una carta.', en: 'My mother is writing a letter.' },
  { id: 'c_hanashite', ja: 'ともだち と はなして います', ids: ['tomodachi', 'hanashimasu', 'imasu'], pat: null, es: 'Estoy hablando con un amigo.', en: 'I am talking with a friend.' },
  { id: 'c_kiite', ja: 'にほんご を きいて います', ids: ['nihongo', 'kikimasu', 'imasu'], pat: null, es: 'Estoy escuchando japonés.', en: 'I am listening to Japanese.' },
  { id: 'c_ongaku', ja: 'おんがく が すき です', ids: ['ongaku', 'suki'], pat: 'suki', es: 'Me gusta la música.', en: 'I like music.' },
  { id: 'c_uta', ja: 'まいにち うた を うたいます', ids: ['mainichi', 'uta', 'utaimasu'], pat: 'masu', es: 'Canto canciones todos los días.', en: 'I sing songs every day.' },
  { id: 'c_shumi', ja: 'わたし は おんがく と えいが が すき です', ids: ['watashi', 'ongaku', 'eiga', 'suki'], pat: 'suki', es: 'Me gustan la música y el cine.', en: 'I like music and movies.' },
  { id: 'c_kiitemasu', ja: 'おんがく を きいて います', ids: ['ongaku', 'kikimasu', 'imasu'], pat: null, es: 'Estoy escuchando música.', en: 'I am listening to music.' },  // ── etapa 3 ──
  { id: 'c_yori', ja: 'いぬ は ねこ より おおきい です', ids: ['inu', 'neko', 'ookii'], pat: null, es: 'El perro es más grande que el gato.', en: 'The dog is bigger than the cat.' },
  { id: 'c_hou', ja: 'なつ より ふゆ の ほう が すき です', ids: ['natsu', 'fuyu', 'hou', 'suki'], pat: null, es: 'Me gusta más el invierno que el verano.', en: 'I like winter more than summer.' },
  { id: 'c_ichiban', ja: 'ラーメン が いちばん すき です', ids: ['raamen', 'ichiban', 'suki'], pat: 'suki', es: 'El ramen es lo que más me gusta.', en: 'I like ramen the most.' },
  { id: 'c_ooi', ja: 'まち は ひと が おおい です', ids: ['machi', 'hito', 'ooi'], pat: null, es: 'En el centro hay mucha gente.', en: 'There are a lot of people in town.' },
  { id: 'c_nagai', ja: 'みち は ながい です', ids: ['michi', 'nagai'], pat: 'adj', es: 'El camino es largo.', en: 'The road is long.' },
  { id: 'c_nekoichiban', ja: 'ねこ が いちばん かわいい です', ids: ['neko', 'ichiban', 'kawaii'], pat: null, es: 'Los gatos son los más tiernos.', en: 'Cats are the cutest.' },
  { id: 'c_atama', ja: 'あたま が いたい です', ids: ['atama', 'itai'], pat: null, es: 'Me duele la cabeza.', en: 'I have a headache.' },
  { id: 'c_kusuri', ja: 'くすり を のんだ ほう が いい です', ids: ['kusuri', 'nomimasu', 'hou', 'ii'], pat: null, es: 'Es mejor que tomes un remedio.', en: 'You should take some medicine.' },
  { id: 'c_yasunda', ja: 'やすんだ ほう が いい です', ids: ['yasumimasu', 'hou', 'ii'], pat: null, es: 'Es mejor que descanses.', en: 'You should rest.' },
  { id: 'c_ashi', ja: 'あし が いたい です', ids: ['ashi', 'itai'], pat: null, es: 'Me duele el pie.', en: 'My foot hurts.' },
  { id: 'c_itta', ja: 'にほん へ いった こと が あります', ids: ['nihon', 'ikimasu', 'koto', 'arimasu'], pat: null, es: 'Fui a Japón alguna vez.', en: 'I have been to Japan.' },
  { id: 'c_tabeta', ja: 'ラーメン を たべた こと が あります', ids: ['raamen', 'tabemasu', 'koto', 'arimasu'], pat: null, es: 'Alguna vez comí ramen.', en: 'I have eaten ramen before.' },
  { id: 'c_mita', ja: 'ゆき を みた こと が ありません', ids: ['yuki', 'mimasu', 'koto', 'arimasu'], pat: null, es: 'Nunca vi la nieve.', en: 'I have never seen snow.' },
  { id: 'c_ryokou', ja: 'りょこう が すき です', ids: ['ryokou', 'suki'], pat: 'suki', es: 'Me gusta viajar.', en: 'I like traveling.' },
  { id: 'c_soto', ja: 'そと は さむい です', ids: ['soto', 'samui'], pat: 'adj', es: 'Afuera hace frío.', en: 'It is cold outside.' },
  { id: 'c_tari', ja: 'やま を あるいたり うみ を みたり します', ids: ['yama', 'arukimasu', 'umi', 'mimasu', 'shimasu'], pat: null, es: 'Camino por la montaña, miro el mar, y cosas así.', en: 'I walk in the mountains, look at the sea, and so on.' },
  { id: 'c_sora', ja: 'そら が きれい です', ids: ['sora', 'kirei'], pat: 'adj', es: 'El cielo está precioso.', en: 'The sky is beautiful.' },
  { id: 'c_umi', ja: 'うみ は おおきい です', ids: ['umi', 'ookii'], pat: 'adj', es: 'El mar es grande.', en: 'The sea is big.' },
  { id: 'c_ki', ja: 'やま に き が たくさん あります', ids: ['yama', 'ki', 'takusan', 'arimasu'], pat: 'arimasu', es: 'En la montaña hay muchos árboles.', en: 'There are many trees on the mountain.' },
  { id: 'c_kawa', ja: 'かわ で はしったり あるいたり しました', ids: ['kawa', 'hashirimasu', 'arukimasu', 'shimasu'], pat: null, es: 'En el río corrí, caminé, y cosas así.', en: 'By the river I ran, walked, and so on.' },
  { id: 'c_omouame', ja: 'あした は あめ だ と おもいます', ids: ['ashita', 'ame', 'omoimasu'], pat: null, es: 'Creo que mañana llueve.', en: 'I think it will rain tomorrow.' },
  { id: 'c_omouoishii', ja: 'ラーメン は おいしい と おもいます', ids: ['raamen', 'oishii', 'omoimasu'], pat: null, es: 'Creo que el ramen está rico.', en: 'I think ramen is tasty.' },
  { id: 'c_shitte', ja: 'せんせい の なまえ を しって います', ids: ['sensei', 'namae', 'shirimasu', 'imasu'], pat: null, es: 'Sé el nombre del profesor.', en: 'I know the teacher’s name.' },
  { id: 'c_kangae', ja: 'まいにち にほんご で かんがえます', ids: ['mainichi', 'nihongo', 'kangaemasu'], pat: null, es: 'Todos los días pienso en japonés.', en: 'Every day I think in Japanese.' },
  { id: 'c_kuru', ja: 'ともだち は くる と おもいます', ids: ['tomodachi', 'kimasu', 'omoimasu'], pat: null, es: 'Creo que mi amigo viene.', en: 'I think my friend is coming.' },  { id: 'c_taberu', ja: 'ラーメン が たべたい です', ids: ['raamen', 'tabemasu'], pat: null, es: 'Quiero comer ramen.', en: 'I want to eat ramen.' },
  { id: 'c_ikitai', ja: 'にほん へ いきたい です', ids: ['nihon', 'ikimasu'], pat: null, es: 'Quiero ir a Japón.', en: 'I want to go to Japan.' },
  { id: 'c_hoshii', ja: 'あたらしい くつ が ほしい です', ids: ['atarashii', 'kutsu', 'hoshii'], pat: null, es: 'Quiero zapatos nuevos.', en: 'I want new shoes.' },
  { id: 'c_nanihoshii', ja: 'なに が ほしい です か', ids: ['nani', 'hoshii'], pat: null, es: '¿Qué quieres?', en: 'What do you want?' },
  { id: 'c_mono', ja: 'いい もの が ほしい です', ids: ['ii', 'mono', 'hoshii'], pat: null, es: 'Quiero algo bueno.', en: 'I want something good.' },
  { id: 'c_kara', ja: 'えき から がっこう まで あるきます', ids: ['eki', 'gakkou', 'arukimasu'], pat: null, es: 'Camino de la estación a la escuela.', en: 'I walk from the station to school.' },
  { id: 'c_noru', ja: 'でんしゃ に のります', ids: ['densha', 'norimasu'], pat: null, es: 'Me subo al tren.', en: 'I get on the train.' },
  { id: 'c_jikan', ja: 'いち じかん かかります', ids: ['ichi', 'jikan', 'kakarimasu'], pat: null, es: 'Lleva una hora.', en: 'It takes an hour.' },
  { id: 'c_chika', ja: 'ちかてつ で いきます', ids: ['chikatetsu', 'ikimasu'], pat: 'de', es: 'Voy en metro.', en: 'I go by subway.' },
  { id: 'c_denshanan', ja: 'でんしゃ は なん じ に きます か', ids: ['densha', 'nan', 'ji', 'kimasu'], pat: 'ka', es: '¿A qué hora viene el tren?', en: 'What time does the train come?' },
  { id: 'c_tekara', ja: 'しごと を して から かえります', ids: ['shigoto', 'shimasu', 'kaerimasu'], pat: null, es: 'Vuelvo después de trabajar.', en: 'I go home after work.' },
  { id: 'c_nagara', ja: 'おんがく を ききながら べんきょう します', ids: ['ongaku', 'kikimasu', 'benkyou', 'shimasu'], pat: null, es: 'Estudio mientras escucho música.', en: 'I study while listening to music.' },
  { id: 'c_gakkou', ja: 'がっこう で にほんご を べんきょう します', ids: ['gakkou', 'nihongo', 'benkyou', 'shimasu'], pat: 'de', es: 'Estudio japonés en la escuela.', en: 'I study Japanese at school.' },
  { id: 'c_shigoto', ja: 'せんせい の しごと は たのしい です', ids: ['sensei', 'shigoto', 'tanoshii'], pat: null, es: 'El trabajo de profesor es divertido.', en: "A teacher's job is fun." },
  { id: 'c_ageru', ja: 'ともだち に プレゼント を あげます', ids: ['tomodachi', 'purezento', 'agemasu'], pat: null, es: 'Le doy un regalo a mi amigo.', en: 'I give my friend a present.' },
  { id: 'c_morau', ja: 'はは に てがみ を もらいました', ids: ['haha', 'tegami', 'moraimasu'], pat: null, es: 'Recibí una carta de mi madre.', en: 'I got a letter from my mother.' },
  { id: 'c_kureru', ja: 'あに が ほん を くれました', ids: ['ani', 'hon', 'kuremasu'], pat: null, es: 'Mi hermano mayor me dio un libro.', en: 'My older brother gave me a book.' },
  { id: 'c_okuru', ja: 'にほん へ てがみ を おくります', ids: ['nihon', 'tegami', 'okurimasu'], pat: null, es: 'Envío una carta a Japón.', en: 'I send a letter to Japan.' },
  { id: 'c_kaesu', ja: 'ほん を かえします', ids: ['hon', 'kaeshimasu'], pat: null, es: 'Devuelvo el libro.', en: 'I return the book.' },
  { id: 'c_toki', ja: 'こども の とき いぬ が すき でした', ids: ['kodomo', 'toki', 'inu', 'suki'], pat: null, es: 'De niño me gustaban los perros.', en: 'When I was a child, I liked dogs.' },
  { id: 'c_tara', ja: 'あめ が ふったら いえ に います', ids: ['ame', 'furimasu', 'ie', 'imasu'], pat: null, es: 'Si llueve, me quedo en casa.', en: 'If it rains, I will stay home.' },
  { id: 'c_karariyu', ja: 'あめ です から いきません', ids: ['ame', 'ikimasu'], pat: null, es: 'Como llueve, no voy.', en: 'Since it is raining, I will not go.' },
  { id: 'c_riyuu', ja: 'りゆう を いって ください', ids: ['riyuu', 'iimasu', 'kudasai'], pat: null, es: 'Dime el motivo, por favor.', en: 'Please tell me the reason.' },
  { id: 'c_hanami', ja: 'はる に はなみ を します', ids: ['haru', 'hanami', 'shimasu'], pat: null, es: 'En primavera vamos a ver los cerezos.', en: 'In spring we go cherry-blossom viewing.' },
  { id: 'c_matsuri', ja: 'なつ の まつり は たのしい です', ids: ['natsu', 'matsuri', 'tanoshii'], pat: 'adj', es: 'El festival de verano es divertido.', en: 'The summer festival is fun.' },
  { id: 'c_shougatsu', ja: 'おしょうがつ に かぞく と ごはん を たべます', ids: ['oshougatsu', 'kazoku', 'gohan', 'tabemasu'], pat: null, es: 'En Año Nuevo como con mi familia.', en: 'At New Year I eat with my family.' },  // ── etapa 4 ──
  { id: 'c_dekiru', ja: 'りょうり が できます', ids: ['ryouri', 'dekimasu'], pat: null, es: 'Sé cocinar.', en: 'I can cook.' },
  { id: 'c_oyogeru', ja: 'わたし は およげます', ids: ['watashi', 'oyogimasu'], pat: null, es: 'Sé nadar.', en: 'I can swim.' },
  { id: 'c_hanaseru', ja: 'にほんご が はなせます', ids: ['nihongo', 'hanashimasu'], pat: null, es: 'Puedo hablar japonés.', en: 'I can speak Japanese.' },
  { id: 'c_jouzu', ja: 'はは は りょうり が じょうず です', ids: ['haha', 'ryouri', 'jouzu'], pat: null, es: 'Mi madre cocina muy bien.', en: 'My mother is good at cooking.' },
  { id: 'c_yomeru', ja: 'かんじ が よめます か', ids: ['kanji', 'yomimasu'], pat: 'ka', es: '¿Puedes leer kanji?', en: 'Can you read kanji?' },
  { id: 'c_ikou', ja: 'らいしゅう にほん へ いこう と おもいます', ids: ['raishuu', 'nihon', 'ikimasu', 'omoimasu'], pat: null, es: 'Pienso ir a Japón la semana que viene.', en: 'I am thinking of going to Japan next week.' },
  { id: 'c_tsumori', ja: 'なつ に りょこう する つもり です', ids: ['natsu', 'ryokou', 'shimasu', 'tsumori'], pat: null, es: 'Tengo la intención de viajar en verano.', en: 'I plan to travel in summer.' },
  { id: 'c_yotei', ja: 'あした は よてい が あります', ids: ['ashita', 'yotei', 'arimasu'], pat: null, es: 'Mañana tengo planes.', en: 'I have plans tomorrow.' },
  { id: 'c_yakusoku', ja: 'ともだち と やくそく が あります', ids: ['tomodachi', 'yakusoku', 'arimasu'], pat: null, es: 'Tengo una cita con un amigo.', en: 'I have an appointment with a friend.' },
  { id: 'c_miyou', ja: 'えいが を みよう と おもいます', ids: ['eiga', 'mimasu', 'omoimasu'], pat: null, es: 'Pienso ver una película.', en: 'I am thinking of watching a movie.' },
  { id: 'c_oishisou', ja: 'ケーキ は おいしそう です', ids: ['keeki', 'oishii'], pat: null, es: 'El pastel parece rico.', en: 'The cake looks tasty.' },
  { id: 'c_furisou', ja: 'あめ が ふりそう です', ids: ['ame', 'furimasu'], pat: null, es: 'Parece que va a llover.', en: 'It looks like it will rain.' },
  { id: 'c_takasou', ja: 'くつ は たかそう です', ids: ['kutsu', 'takai'], pat: null, es: 'Los zapatos parecen caros.', en: 'The shoes look expensive.' },
  { id: 'c_mitai', ja: 'あの ひと は せんせい みたい です', ids: ['ano', 'hito', 'sensei'], pat: null, es: 'Esa persona parece profesora.', en: 'That person seems to be a teacher.' },
  { id: 'c_hikari', ja: 'ひかり が きれい です', ids: ['hikari', 'kirei'], pat: 'adj', es: 'La luz es preciosa.', en: 'The light is beautiful.' },
  { id: 'c_kaze', ja: 'きょう は かぜ が つよい です', ids: ['kyou', 'kaze', 'tsuyoi'], pat: null, es: 'Hoy hay mucho viento.', en: 'The wind is strong today.' },
  { id: 'c_wasure', ja: 'かぎ を わすれて しまいました', ids: ['kagi', 'wasuremasu', 'shimaimasu'], pat: null, es: 'Se me olvidó la llave.', en: 'I forgot the key (oops).' },
  { id: 'c_otoshi', ja: 'かばん を おとして しまいました', ids: ['kaban', 'otoshimasu', 'shimaimasu'], pat: null, es: 'Se me cayó la mochila.', en: 'I dropped my bag (oops).' },
  { id: 'c_kowashi', ja: 'くるま を こわして しまいました', ids: ['kuruma', 'kowashimasu', 'shimaimasu'], pat: null, es: 'Rompí el auto sin querer.', en: 'I broke the car (oops).' },
  { id: 'c_zenbu', ja: 'ケーキ を たべて しまいました', ids: ['keeki', 'tabemasu', 'shimaimasu'], pat: null, es: 'Me comí todo el pastel.', en: 'I ate the whole cake.' },
  { id: 'c_oite', ja: 'ジュース を かって おきます', ids: ['juusu', 'kaimasu', 'oku'], pat: null, es: 'Dejo comprado el jugo.', en: 'I will buy juice in advance.' },
  { id: 'c_hare', ja: 'あした はれれば うみ へ いきます', ids: ['ashita', 'haremasu', 'umi', 'ikimasu'], pat: null, es: 'Si mañana está despejado, voy al mar.', en: 'If it clears up tomorrow, I will go to the sea.' },
  { id: 'c_fureba', ja: 'あめ が ふれば いきません', ids: ['ame', 'furimasu', 'ikimasu'], pat: null, es: 'Si llueve, no voy.', en: 'If it rains, I will not go.' },
  { id: 'c_to', ja: 'みぎ へ まがる と えき が あります', ids: ['migi', 'magarimasu', 'eki', 'arimasu'], pat: null, es: 'Si doblas a la derecha, está la estación.', en: 'If you turn right, there is the station.' },
  { id: 'c_atsune', ja: 'なつ は あつい です ね', ids: ['natsu', 'atsui'], pat: null, es: 'Qué calor hace en verano, ¿no?', en: 'Summer is hot, isn’t it?' },
  { id: 'c_irasshai', ja: 'いらっしゃいませ', ids: ['irasshaimase'], pat: null, es: '¡Bienvenido!', en: 'Welcome!' },
  { id: 'c_omachi', ja: 'しょうしょう おまちください', ids: ['shoushou', 'omachikudasai'], pat: null, es: 'Espere un momento, por favor.', en: 'Please wait a moment.' },
  { id: 'c_shain', ja: 'わたし は かいしゃ の しゃいん です', ids: ['watashi', 'kaisha', 'shain'], pat: 'no', es: 'Soy empleado de una empresa.', en: 'I am a company employee.' },
  { id: 'c_okyaku', ja: 'おきゃくさん が きます', ids: ['okyakusan', 'kimasu'], pat: null, es: 'Viene un cliente.', en: 'A customer is coming.' },
  { id: 'c_arigatou2', ja: 'どうも ありがとう ございます', ids: ['doumo', 'arigatou'], pat: null, es: 'Muchísimas gracias.', en: 'Thank you very much.' },
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
  // ───────── Etapa 2 · Vida diaria ─────────
  { id: '2.1', stage: 'e2', title: T('Mi rutina', 'My routine'), cando: T('Puedo contar qué hago cada día', 'I can say what I do every day'),
    intro: T('Yo me levanto con el sol, ¡claro! ¿Y tú, qué haces cada día?', 'I get up with the sun, of course! What do you do every day?'),
    words: ['asa', 'okimasu', 'mainichi', 'hiru', 'yoru', 'nemasu', 'terebi', 'mimasu'],
    phrases: ['p_okimasu', 'p_nemasu', 'p_mainichi', 'c_hiru', 'c_terebi'], pats: ['masu'],
    kanji: ['毎', '朝', '昼', '夜', '起'], reward: '朝', rewardWord: 'asa', rival: ['昼', '夜', '毎'] },
  { id: '2.2', stage: 'e2', title: T('Lo que hice', 'What I did'), cando: T('Puedo contar lo que hice', 'I can say what I did'),
    intro: T('¡La semana pasada pasaron muchas cosas! ¿Te cuento?', 'So much happened last week! Shall I tell you?'),
    words: ['kinou', 'senshuu', 'konshuu', 'kotoshi', 'yomimasu', 'benkyou', 'shimasu', 'kaimasu'],
    phrases: ['p_terebi', 'c_senshuu', 'c_benkyou', 'c_kotoshi'], pats: ['mashita'],
    kanji: ['今', '先', '週', '年'], reward: '今', rewardWord: 'kotoshi', rival: ['先', '週', '年'] },
  { id: '2.3', stage: 'e2', title: T('Comprar ropa', 'Buying clothes'), cando: T('Puedo pedir ropa por color y preguntar el precio', 'I can ask for clothes by color and ask the price'),
    intro: T('Quiero algo nuevo para el festival. ¿Me acompañas a la tienda?', 'I want something new for the festival. Will you come to the shop with me?'),
    words: ['fuku', 'kutsu', 'kaimasu', 'akai', 'aoi', 'shiroi', 'kuroi', 'iro'],
    phrases: ['c_kuroi', 'c_akai', 'p_aoi', 'c_shiroi'], pats: [],
    kanji: ['買', '赤', '白', '黒', '青'], reward: '買', rewardWord: 'kaimasu', rival: ['赤', '白', '黒'] },
  { id: '2.4', stage: 'e2', title: T('Describir cosas', 'Describing things'), cando: T('Puedo decir cómo son las cosas', 'I can say what things are like'),
    intro: T('Este pincel es viejo… ¡pero es mi favorito! ¿Cómo son tus cosas?', 'This brush is old… but it is my favorite! What are your things like?'),
    words: ['atarashii', 'furui', 'takai', 'yasui', 'kirei', 'hana', 'ii', 'nagai'],
    phrases: ['p_fuku', 'c_takai', 'c_furui', 'c_yasui', 'c_kirei'], pats: ['adj'],
    kanji: ['新', '古', '高', '安'], reward: '新', rewardWord: 'atarashii', rival: ['古', '高', '安'] },
  { id: '2.5', stage: 'e2', title: T('Planes para el finde', 'Weekend plans'), cando: T('Puedo invitar y hacer planes', 'I can invite someone and make plans'),
    intro: T('¡El fin de semana no hay entrenamiento! ¿Qué hacemos?', 'No training this weekend! What shall we do?'),
    words: ['ashita', 'shuumatsu', 'raishuu', 'issho', 'eiga', 'doyoubi', 'mimasu', 'ikimasu'],
    phrases: ['c_eiga', 'c_machi', 'c_ashitagohan', 'c_doyoubi'], pats: [],
    kanji: ['明', '来', '週', '末'], reward: '明', rewardWord: 'ashita', rival: ['来', '週', '日'] },
  { id: '2.6', stage: 'e2', title: T('El clima', 'The weather'), cando: T('Puedo hablar del clima y de las estaciones', 'I can talk about the weather and the seasons'),
    intro: T('Hoy hay mucho sol… ¡es mi día! ¿Qué tiempo hará mañana?', 'Lots of sun today… it is my day! What will the weather be like tomorrow?'),
    words: ['tenki', 'ame', 'furimasu', 'yuki', 'haru', 'natsu', 'aki', 'fuyu', 'atsui', 'samui'],
    phrases: ['p_tenki', 'p_ame', 'p_fuyu', 'p_natsu', 'c_yuki', 'c_deshou'], pats: [],
    kanji: ['天', '気', '雨', '雪', '春', '夏', '秋', '冬'], reward: '雨', rewardWord: 'ame', rival: ['春', '夏', '冬'] },  { id: '2.7', stage: 'e2', title: T('Mi casa', 'My home'), cando: T('Puedo describir mi casa', 'I can describe my home'),
    intro: T('¡Quiero conocer tu casa! ¿Qué hay adentro?', 'I want to see your home! What is inside?'),
    words: ['ie', 'heya', 'mado', 'mon', 'niwa', 'tsukue', 'arimasu', 'imasu'],
    phrases: ['p_heya', 'c_mado', 'c_mon', 'c_niwa'], pats: ['arimasu'],
    kanji: ['家', '門', '窓'], reward: '家', rewardWord: 'ie', rival: ['門', '戸', '室'] },
  { id: '2.8', stage: 'e2', title: T('Pedir direcciones', 'Asking for directions'), cando: T('Puedo preguntar y explicar cómo llegar', 'I can ask and explain how to get somewhere'),
    intro: T('Me perdí buscando la estación… ¿Me ayudas a preguntar?', 'I got lost looking for the station… Will you help me ask?'),
    words: ['michi', 'migi', 'hidari', 'eki', 'massugu', 'magarimasu', 'ikimasu', 'kudasai', 'sumimasen'],
    phrases: ['p_migi', 'c_massugu', 'c_magatte', 'c_ekidoko', 'c_hidari'], pats: [],
    kanji: ['道', '駅', '右', '左'], reward: '道', rewardWord: 'michi', rival: ['右', '左', '駅'] },
  { id: '2.9', stage: 'e2', title: T('En el restaurante', 'At the restaurant'), cando: T('Puedo pedir comida en un restaurante', 'I can order food at a restaurant'),
    intro: T('¡Huele a ramen! Vamos a pedir algo rico.', "It smells like ramen! Let's order something tasty."),
    words: ['niku', 'sakana', 'tamago', 'kome', 'yasai', 'raamen', 'shimasu', 'oishii'],
    phrases: ['c_raamen', 'c_nikuyasai', 'c_tamago', 'c_gohansakana'], pats: [],
    kanji: ['肉', '魚', '卵', '米'], reward: '魚', rewardWord: 'sakana', rival: ['肉', '米', '食'] },
  { id: '2.10', stage: 'e2', title: T('Pedir permiso', 'Asking for permission'), cando: T('Puedo pedir permiso y decir lo que no se puede', 'I can ask permission and say what is not allowed'),
    intro: T('En el templo hay reglas… ¿Cómo se pide permiso?', 'There are rules at the temple… How do you ask for permission?'),
    words: ['hairimasu', 'demasu', 'yasumimasu', 'ii', 'ikemasen', 'heya', 'terebi', 'mimasu'],
    phrases: ['c_haitte', 'c_yasunde', 'c_dete', 'c_mite'], pats: [],
    kanji: ['入', '出', '休'], reward: '休', rewardWord: 'yasumimasu', rival: ['入', '出', '体'] },
  { id: '2.11', stage: 'e2', title: T('Lo que estoy haciendo', 'What I am doing'), cando: T('Puedo decir lo que estoy haciendo ahora', 'I can say what I am doing right now'),
    intro: T('¡Shh! Estoy concentrado… ¿Y tú, qué estás haciendo?', 'Shh! I am concentrating… What are you doing?'),
    words: ['hanashimasu', 'kikimasu', 'yomimasu', 'kakimasu', 'tegami', 'nihongo', 'imasu', 'ima'],
    phrases: ['c_yonde', 'c_kaite', 'c_hanashite', 'c_kiite'], pats: [],
    kanji: ['話', '聞', '読', '書'], reward: '話', rewardWord: 'hanashimasu', rival: ['聞', '読', '書'] },
  { id: '2.12', stage: 'e2', title: T('Mis hobbies', 'My hobbies'), cando: T('Puedo hablar de lo que me gusta hacer', 'I can talk about what I like to do'),
    intro: T('Cuando no entreno, ¡me encanta cantar! ¿Qué te gusta hacer a ti?', 'When I am not training, I love to sing! What do you like to do?'),
    words: ['ongaku', 'uta', 'utaimasu', 'eiga', 'suki', 'kikimasu', 'mainichi', 'mimasu'],
    phrases: ['c_ongaku', 'c_uta', 'c_shumi', 'c_kiitemasu'], pats: [],
    kanji: ['音', '楽', '歌', '見'], reward: '音', rewardWord: 'ongaku', rival: ['楽', '見', '聞'] },
  // ───────── Etapa 3 · Ampliar el mundo ─────────
  { id: '3.1', stage: 'e3', title: T('Comparar', 'Comparing'), cando: T('Puedo comparar cosas y decir cuál me gusta más', 'I can compare things and say which I like most'),
    intro: T('¿Qué es más fuerte, el sol o la luna? ¡Vamos a comparar!', "What is stronger, the sun or the moon? Let's compare!"),
    words: ['hou', 'ichiban', 'ooi', 'sukunai', 'nagai', 'ookii', 'takai', 'suki'],
    phrases: ['c_yori', 'c_hou', 'c_ichiban', 'c_ooi', 'c_nagai'], pats: [],
    kanji: ['多', '少', '長'], reward: '長', rewardWord: 'nagai', rival: ['少', '大', '小'] },
  { id: '3.2', stage: 'e3', title: T('El café de animales', 'The animal café'), cando: T('Puedo hablar de animales', 'I can talk about animals'),
    intro: T('¡Abrieron un café lleno de animales! Vamos a verlos.', "An animal café opened! Let's go see them."),
    words: ['inu', 'neko', 'tori', 'uma', 'ushi', 'doubutsu', 'takusan', 'kawaii'],
    phrases: ['p_umaushi', 'p_tori', 'p_kawaii', 'c_nekoichiban'], pats: [],
    kanji: ['犬', '猫', '鳥', '馬', '牛'], reward: '鳥', rewardWord: 'tori', rival: ['犬', '馬', '牛'] },
  { id: '3.3', stage: 'e3', title: T('Me siento mal', 'I feel sick'), cando: T('Puedo decir qué me duele y dar un consejo', 'I can say what hurts and give advice'),
    intro: T('Uy… hoy no me siento bien. ¿Me ayudas a decir qué me pasa?', "Ugh… I don't feel well today. Will you help me say what's wrong?"),
    words: ['atama', 'te', 'ashi', 'karada', 'byouki', 'kusuri', 'itai', 'yasumimasu'],
    phrases: ['c_atama', 'c_kusuri', 'c_yasunda', 'c_ashi'], pats: [],
    kanji: ['体', '頭', '手', '足', '病', '薬'], reward: '体', rewardWord: 'karada', rival: ['手', '足', '心'] },
  { id: '3.4', stage: 'e3', title: T('¿Alguna vez…?', 'Have you ever…?'), cando: T('Puedo contar lo que hice alguna vez', 'I can say what I have done before'),
    intro: T('Yo una vez fui hasta el mar. ¿Y tú, qué hiciste alguna vez?', 'I once went all the way to the sea. What have you done before?'),
    words: ['koto', 'ryokou', 'soto', 'iimasu', 'nihon', 'ikimasu', 'tabemasu', 'mimasu'],
    phrases: ['c_itta', 'c_tabeta', 'c_mita', 'c_ryokou', 'c_soto'], pats: [],
    kanji: ['旅', '外', '言'], reward: '旅', rewardWord: 'ryokou', rival: ['外', '行', '言'] },
  { id: '3.5', stage: 'e3', title: T('Un día en la naturaleza', 'A day in nature'), cando: T('Puedo contar varias cosas que hice', 'I can list several things I did'),
    intro: T('¡Hoy entrenamos afuera, entre montañas y ríos!', 'Today we train outside, among mountains and rivers!'),
    words: ['yama', 'kawa', 'umi', 'sora', 'ki', 'arukimasu', 'hashirimasu', 'shimasu'],
    phrases: ['c_tari', 'c_sora', 'c_umi', 'c_ki', 'c_kawa'], pats: [],
    kanji: ['山', '川', '海', '空'], reward: '海', rewardWord: 'umi', rival: ['山', '川', '空'] },
  { id: '3.6', stage: 'e3', title: T('Charla casual', 'Casual talk'), cando: T('Puedo decir lo que pienso', 'I can say what I think'),
    intro: T('Entre amigos se habla más corto. ¿Te enseño?', 'Among friends we speak more casually. Shall I show you?'),
    words: ['omoimasu', 'shirimasu', 'kangaemasu', 'kimasu', 'ame', 'oishii', 'ashita', 'nihongo'],
    phrases: ['c_omouame', 'c_omouoishii', 'c_shitte', 'c_kangae', 'c_kuru'], pats: [],
    kanji: ['思', '知', '考'], reward: '思', rewardWord: 'omoimasu', rival: ['知', '心', '言'] },  { id: '3.7', stage: 'e3', title: T('Lo que quiero', 'What I want'), cando: T('Puedo decir lo que quiero hacer y tener', 'I can say what I want to do and to have'),
    intro: T('Si pudiera pedir un deseo… ¿Qué quieres tú?', 'If I could make a wish… What do you want?'),
    words: ['hoshii', 'mono', 'kokoro', 'tabemasu', 'ikimasu', 'kutsu', 'nani', 'atarashii'],
    phrases: ['c_taberu', 'c_ikitai', 'c_hoshii', 'c_nanihoshii', 'c_mono'], pats: [],
    kanji: ['心', '物', '欲'], reward: null, rival: ['心', '物', '好'] },
  { id: '3.8', stage: 'e3', title: T('Viajar en tren', 'Traveling by train'), cando: T('Puedo decir de dónde a dónde voy y cuánto tardo', 'I can say where I go from and to, and how long it takes'),
    intro: T('¡Nunca subí a un tren! ¿Me explicas cómo se viaja?', 'I have never been on a train! Will you explain how to travel?'),
    words: ['densha', 'eki', 'norimasu', 'kakarimasu', 'jikan', 'chikatetsu', 'gakkou', 'arukimasu'],
    phrases: ['c_kara', 'c_noru', 'c_jikan', 'c_chika', 'c_denshanan'], pats: [],
    kanji: ['電', '乗', '地', '鉄'], reward: '電', rewardWord: 'densha', rival: ['車', '地', '道'] },
  { id: '3.9', stage: 'e3', title: T('Escuela y trabajo', 'School and work'), cando: T('Puedo contar mi día de estudio o de trabajo', 'I can describe my day at school or work'),
    intro: T('Entrenar también es un trabajo, ¿sabes? ¿Y el tuyo cómo es?', 'Training is a job too, you know? What is yours like?'),
    words: ['gakkou', 'kaisha', 'shigoto', 'sensei', 'gakusei', 'hatarakimasu', 'benkyou', 'tanoshii'],
    phrases: ['p_kaisha', 'c_tekara', 'c_nagara', 'c_gakkou', 'c_shigoto'], pats: [],
    kanji: ['学', '校', '仕', '事', '生'], reward: '学', rewardWord: 'gakkou', rival: ['校', '仕', '生'] },
  { id: '3.10', stage: 'e3', title: T('Dar y recibir', 'Giving and receiving'), cando: T('Puedo hablar de regalos y de lo que me dieron', 'I can talk about presents and what I was given'),
    intro: T('¡Me llegó una carta! ¿Quién me la habrá mandado?', 'I got a letter! Who could have sent it?'),
    words: ['agemasu', 'moraimasu', 'kuremasu', 'purezento', 'tegami', 'okurimasu', 'kaeshimasu', 'dare'],
    phrases: ['c_ageru', 'c_morau', 'c_kureru', 'c_okuru', 'c_kaesu'], pats: [],
    kanji: ['送', '返', '紙'], reward: '紙', rewardWord: 'tegami', rival: ['手', '本', '文'] },
  { id: '3.11', stage: 'e3', title: T('Cuando y si…', 'When and if…'), cando: T('Puedo decir cuándo, qué pasaría si… y por qué', 'I can say when, what would happen if… and why'),
    intro: T('Si llueve, no hay entrenamiento afuera… ¿Qué hacemos entonces?', 'If it rains, there is no outdoor training… What do we do then?'),
    words: ['toki', 'riyuu', 'kodomo', 'furimasu', 'iimasu', 'jikan', 'ame', 'ie'],
    phrases: ['c_toki', 'c_tara', 'c_karariyu', 'c_riyuu'], pats: [],
    kanji: ['時', '間', '由'], reward: null, rival: ['時', '間', '分'] },
  { id: '3.12', stage: 'e3', title: T('Fiestas de Japón', 'Festivals in Japan'), cando: T('Puedo hablar de las fiestas de Japón', 'I can talk about festivals in Japan'),
    intro: T('¡Llegó la temporada de fiestas! Te cuento cómo se celebran.', 'Festival season is here! Let me tell you how they are celebrated.'),
    words: ['hana', 'matsuri', 'oshougatsu', 'hanami', 'tanoshii', 'kirei', 'haru', 'natsu'],
    phrases: ['c_hanami', 'c_matsuri', 'c_shougatsu', 'c_kirei'], pats: [],
    kanji: ['花', '祭', '正'], reward: '花', rewardWord: 'hana', rival: ['正', '春', '夏'] },
  // ───────── Etapa 4 · Conversación cotidiana ─────────
  { id: '4.1', stage: 'e4', title: T('Lo que puedo hacer', 'What I can do'), cando: T('Puedo decir lo que sé y puedo hacer', 'I can say what I know how to do'),
    intro: T('¡Ya leo muchos kanji! ¿Y tú, qué sabes hacer?', 'I can read lots of kanji now! What can you do?'),
    words: ['dekimasu', 'jouzu', 'heta', 'chikara', 'ryouri', 'oyogimasu', 'hanashimasu', 'kanji'],
    phrases: ['c_dekiru', 'c_oyogeru', 'c_hanaseru', 'c_jouzu', 'c_yomeru'], pats: [],
    kanji: ['力', '上', '手'], reward: '力', rewardWord: 'chikara', rival: ['上', '手', '男'] },
  { id: '4.2', stage: 'e4', title: T('Mis planes', 'My plans'), cando: T('Puedo contar mis planes e intenciones', 'I can talk about my plans and intentions'),
    intro: T('Tengo muchos planes para el verano. ¿Te los cuento?', 'I have lots of plans for summer. Shall I tell you?'),
    words: ['tsumori', 'yotei', 'yakusoku', 'ikimasu', 'mimasu', 'shimasu', 'ryokou', 'raishuu'],
    phrases: ['c_ikou', 'c_tsumori', 'c_yotei', 'c_yakusoku', 'c_miyou'], pats: [],
    kanji: ['予', '定', '約'], reward: null, rival: ['日', '月', '年'] },
  { id: '4.3', stage: 'e4', title: T('Parece que…', 'It looks like…'), cando: T('Puedo decir cómo parecen las cosas', 'I can say how things look'),
    intro: T('Mira ese cielo… parece que va a llover. ¿Qué te parece?', 'Look at that sky… it looks like rain. What do you think?'),
    words: ['kaze', 'hikari', 'tsuyoi', 'iro', 'oishii', 'takai', 'furimasu', 'ame', 'kirei'],
    phrases: ['c_oishisou', 'c_furisou', 'c_takasou', 'c_mitai', 'c_hikari', 'c_kaze'], pats: [],
    kanji: ['風', '光', '色'], reward: '風', rewardWord: 'kaze', rival: ['色', '空', '天'] },
  { id: '4.4', stage: 'e4', title: T('Se me rompió', 'Oops, it broke'), cando: T('Puedo contar algo que salió mal sin querer', 'I can tell about something that went wrong by accident'),
    intro: T('¡Ay, no! Se me cayó el pincel… ¿A ti también te pasa?', 'Oh no! I dropped my brush… Does that happen to you too?'),
    words: ['shimaimasu', 'wasuremasu', 'otoshimasu', 'kowashimasu', 'oku', 'kagi', 'kaban', 'kaimasu'],
    phrases: ['c_wasure', 'c_otoshi', 'c_kowashi', 'c_zenbu', 'c_oite'], pats: [],
    kanji: ['壊', '落', '忘'], reward: null, rival: ['口', '目', '手'] },
  { id: '4.5', stage: 'e4', title: T('Si hace sol, vamos', 'If it is sunny, we go'), cando: T('Puedo decir qué pasa si…', 'I can say what happens if…'),
    intro: T('Si mañana sale el sol, ¡vamos al mar! ¿Y si llueve?', 'If the sun comes out tomorrow, we go to the sea! And if it rains?'),
    words: ['haremasu', 'atsui', 'samui', 'umi', 'ikimasu', 'furimasu', 'magarimasu', 'ame'],
    phrases: ['c_hare', 'c_fureba', 'c_to', 'c_atsune'], pats: [],
    kanji: ['晴', '暑', '寒'], reward: '晴', rewardWord: 'haremasu', rival: ['日', '天', '雨'] },
  { id: '4.6', stage: 'e4', title: T('Hablar con respeto', 'Speaking politely'), cando: T('Puedo usar frases de respeto en una tienda o una oficina', 'I can use polite phrases in a shop or an office'),
    intro: T('En las tiendas de Japón se habla con mucho respeto. ¡Practiquemos!', "In Japanese shops people speak very politely. Let's practice!"),
    words: ['irasshaimase', 'shoushou', 'omachikudasai', 'okyakusan', 'shain', 'kaisha', 'douzo', 'arigatou'],
    phrases: ['c_irasshai', 'c_omachi', 'c_shain', 'c_okyaku', 'c_arigatou2'], pats: [],
    kanji: ['社', '員', '客'], reward: '客', rewardWord: 'okyakusan', rival: ['社', '員', '会'] },
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
    opts: [O('つくえ の した に います', ['tsukue', 'shita', 'imasu']), O('いえ の まえ に あります', ['ie', 'mae', 'arimasu']), O('さん じ です', ['sankazu', 'ji'])] },  '2.1': { who: '日', ja: 'まいにち なん じ に おきます か', ids: ['mainichi', 'nan', 'ji', 'okimasu'], es: '¿A qué hora te levantas cada día?', en: 'What time do you get up every day?', hint: T('A las seis.', 'At six.'),
    opts: [O('ろく じ に おきます', ['roku', 'ji', 'okimasu']), O('よる に ねます', ['yoru', 'nemasu']), O('テレビ を みません', ['terebi', 'mimasu'])] },
  '2.2': { who: '人', ja: 'きのう なに を しました か', ids: ['kinou', 'nani', 'shimasu'], es: '¿Qué hiciste ayer?', en: 'What did you do yesterday?', hint: T('Viste la tele (en pasado).', 'You watched TV (past tense).'),
    opts: [O('テレビ を みました', ['terebi', 'mimasu']), O('テレビ を みます', ['terebi', 'mimasu']), O('ほん を かいます', ['hon', 'kaimasu'])] },
  '2.3': { who: '店', ja: 'なに を かいます か', ids: ['nani', 'kaimasu'], es: '¿Qué vas a comprar?', en: 'What will you buy?', hint: T('Quieres zapatos negros.', 'You want black shoes.'),
    opts: [O('くろい くつ を ください', ['kuroi', 'kutsu', 'kudasai']), O('しろい ふく です', ['shiroi', 'fuku']), O('あかい です か', ['akai'])] },
  '2.4': { who: '古', ja: 'ほん は あたらしい です か', ids: ['hon', 'atarashii'], es: '¿El libro es nuevo?', en: 'Is the book new?', hint: T('No: es viejo.', 'No: it is old.'),
    opts: [O('いいえ ふるい です', ['iie', 'furui']), O('はい たかい です', ['hai', 'takai']), O('いいえ やすい です', ['iie', 'yasui'])] },
  '2.5': { who: '友', ja: 'しゅうまつ いっしょ に えいが を みません か', ids: ['shuumatsu', 'issho', 'eiga', 'mimasu'], es: '¿Vemos una película juntos el fin de semana?', en: 'Shall we watch a movie together this weekend?', hint: T('Acepta: ¡veámosla!', "Accept: let's watch it!"),
    opts: [O('はい みましょう', ['hai', 'mimasu']), O('いいえ みました', ['iie', 'mimasu']), O('えいが は たかい です', ['eiga', 'takai'])] },
  '2.6': { who: '天', ja: 'あした は いい てんき です か', ids: ['ashita', 'ii', 'tenki'], es: '¿Mañana hace buen tiempo?', en: 'Will the weather be good tomorrow?', hint: T('No: mañana llueve.', 'No: it rains tomorrow.'),
    opts: [O('いいえ あめ が ふります', ['iie', 'ame', 'furimasu']), O('はい ゆき です', ['hai', 'yuki']), O('なつ は あつい です', ['natsu', 'atsui'])] },  '2.7': { who: '家', ja: 'へや に なに が あります か', ids: ['heya', 'nani', 'arimasu'], es: '¿Qué hay en tu cuarto?', en: 'What is in your room?', hint: T('Hay un escritorio.', 'There is a desk.'),
    opts: [O('つくえ が あります', ['tsukue', 'arimasu']), O('ねこ が あります', ['neko', 'arimasu']), O('まど です か', ['mado'])] },
  '2.8': { who: '道', ja: 'すみません えき は どこ です か', ids: ['sumimasen', 'eki', 'doko'], es: 'Disculpe, ¿dónde está la estación?', en: 'Excuse me, where is the station?', hint: T('Que siga derecho.', 'Tell them to go straight.'),
    opts: [O('まっすぐ いって ください', ['massugu', 'ikimasu', 'kudasai']), O('えき に いきました', ['eki', 'ikimasu']), O('ひだり です か', ['hidari'])] },
  '2.9': { who: '店', ja: 'なに に します か', ids: ['nani', 'shimasu'], es: '¿Qué va a pedir?', en: 'What will you have?', hint: T('Ramen.', 'Ramen.'),
    opts: [O('ラーメン に します', ['raamen', 'shimasu']), O('ラーメン が あります', ['raamen', 'arimasu']), O('みず を のみました', ['mizu', 'nomimasu'])] },
  '2.10': { who: '先', ja: 'へや に はいって も いい です か', ids: ['heya', 'hairimasu', 'ii'], es: '¿Puedo entrar al cuarto?', en: 'May I come into the room?', hint: T('Sí, adelante.', 'Yes, go ahead.'),
    opts: [O('はい どうぞ', ['hai', 'douzo']), O('いいえ はいりました', ['iie', 'hairimasu']), O('はい やすみます', ['hai', 'yasumimasu'])] },
  '2.11': { who: '母', ja: 'いま なに を して います か', ids: ['ima', 'nani', 'shimasu', 'imasu'], es: '¿Qué estás haciendo ahora?', en: 'What are you doing now?', hint: T('Estás leyendo un libro.', 'You are reading a book.'),
    opts: [O('ほん を よんで います', ['hon', 'yomimasu', 'imasu']), O('ほん を よみました', ['hon', 'yomimasu']), O('ほん を かいます', ['hon', 'kaimasu'])] },
  '2.12': { who: '楽', ja: 'おんがく が すき です か', ids: ['ongaku', 'suki'], es: '¿Te gusta la música?', en: 'Do you like music?', hint: T('Sí, ¡muchísimo!', 'Yes, a lot!'),
    opts: [O('はい とても すき です', ['hai', 'totemo', 'suki']), O('いいえ うた です', ['iie', 'uta']), O('おんがく を ききました', ['ongaku', 'kikimasu'])] },  '3.1': { who: '大', ja: 'なに が いちばん すき です か', ids: ['nani', 'ichiban', 'suki'], es: '¿Qué es lo que más te gusta?', en: 'What do you like the most?', hint: T('El ramen.', 'Ramen.'),
    opts: [O('ラーメン が いちばん すき です', ['raamen', 'ichiban', 'suki']), O('ラーメン より おおきい です', ['raamen', 'ookii']), O('いちばん です か', ['ichiban'])] },
  '3.2': { who: '犬', ja: 'どうぶつ が すき です か', ids: ['doubutsu', 'suki'], es: '¿Te gustan los animales?', en: 'Do you like animals?', hint: T('Sí, sobre todo los gatos.', 'Yes, especially cats.'),
    opts: [O('はい ねこ が いちばん すき です', ['hai', 'neko', 'ichiban', 'suki']), O('いいえ うし です', ['iie', 'ushi']), O('とり が います', ['tori', 'imasu'])] },
  '3.3': { who: '医', ja: 'どこ が いたい です か', ids: ['doko', 'itai'], es: '¿Dónde te duele?', en: 'Where does it hurt?', hint: T('La cabeza.', 'Your head.'),
    opts: [O('あたま が いたい です', ['atama', 'itai']), O('くすり を のみます', ['kusuri', 'nomimasu']), O('あたま です か', ['atama'])] },
  '3.4': { who: '人', ja: 'にほん へ いった こと が あります か', ids: ['nihon', 'ikimasu', 'koto', 'arimasu'], es: '¿Fuiste alguna vez a Japón?', en: 'Have you ever been to Japan?', hint: T('No, nunca.', 'No, never.'),
    opts: [O('いいえ いった こと が ありません', ['iie', 'ikimasu', 'koto', 'arimasu']), O('はい いきます', ['hai', 'ikimasu']), O('にほん へ いきましょう', ['nihon', 'ikimasu'])] },
  '3.5': { who: '山', ja: 'しゅうまつ なに を しました か', ids: ['shuumatsu', 'nani', 'shimasu'], es: '¿Qué hiciste el fin de semana?', en: 'What did you do on the weekend?', hint: T('Caminaste por la montaña y miraste el mar.', 'You walked in the mountains and looked at the sea.'),
    opts: [O('やま を あるいたり うみ を みたり しました', ['yama', 'arukimasu', 'umi', 'mimasu', 'shimasu']), O('やま を あるきます', ['yama', 'arukimasu']), O('うみ が すき です', ['umi', 'suki'])] },
  '3.6': { who: '友', ja: 'あした は あめ だ と おもいます か', ids: ['ashita', 'ame', 'omoimasu'], es: '¿Crees que mañana llueve?', en: 'Do you think it will rain tomorrow?', hint: T('Sí, eso crees.', 'Yes, you think so.'),
    opts: [O('はい あめ だ と おもいます', ['hai', 'ame', 'omoimasu']), O('いいえ あめ が すき です', ['iie', 'ame', 'suki']), O('あめ を みた こと が あります', ['ame', 'mimasu', 'koto', 'arimasu'])] },  '3.7': { who: '心', ja: 'なに が ほしい です か', ids: ['nani', 'hoshii'], es: '¿Qué quieres?', en: 'What do you want?', hint: T('Zapatos nuevos.', 'New shoes.'),
    opts: [O('あたらしい くつ が ほしい です', ['atarashii', 'kutsu', 'hoshii']), O('あたらしい くつ を かいました', ['atarashii', 'kutsu', 'kaimasu']), O('くつ は たかい です', ['kutsu', 'takai'])] },
  '3.8': { who: '駅', ja: 'えき から がっこう まで なん じかん かかります か', ids: ['eki', 'gakkou', 'nan', 'jikan', 'kakarimasu'], es: '¿Cuántas horas se tarda de la estación a la escuela?', en: 'How many hours does it take from the station to school?', hint: T('Una hora.', 'One hour.'),
    opts: [O('いち じかん かかります', ['ichi', 'jikan', 'kakarimasu']), O('いち じ に のります', ['ichi', 'ji', 'norimasu']), O('でんしゃ で いきます', ['densha', 'ikimasu'])] },
  '3.9': { who: '先', ja: 'しごと を して から なに を します か', ids: ['shigoto', 'shimasu', 'nani'], es: '¿Qué haces después de trabajar?', en: 'What do you do after work?', hint: T('Vuelves a casa.', 'You go home.'),
    opts: [O('いえ に かえります', ['ie', 'kaerimasu']), O('しごと を しました', ['shigoto', 'shimasu']), O('かいしゃ が すき です', ['kaisha', 'suki'])] },
  '3.10': { who: '母', ja: 'だれ に てがみ を もらいました か', ids: ['dare', 'tegami', 'moraimasu'], es: '¿De quién recibiste la carta?', en: 'Who did you get the letter from?', hint: T('De tu madre.', 'From your mother.'),
    opts: [O('はは に もらいました', ['haha', 'moraimasu']), O('はは に あげます', ['haha', 'agemasu']), O('てがみ を かきました', ['tegami', 'kakimasu'])] },
  '3.11': { who: '天', ja: 'あめ が ふったら なに を します か', ids: ['ame', 'furimasu', 'nani', 'shimasu'], es: 'Si llueve, ¿qué haces?', en: 'If it rains, what will you do?', hint: T('Te quedas en casa.', 'You stay home.'),
    opts: [O('いえ に います', ['ie', 'imasu']), O('あめ が すき でした', ['ame', 'suki']), O('うみ へ いきました', ['umi', 'ikimasu'])] },
  '3.12': { who: '花', ja: 'はなみ を した こと が あります か', ids: ['hanami', 'shimasu', 'koto', 'arimasu'], es: '¿Alguna vez fuiste a ver los cerezos?', en: 'Have you ever gone cherry-blossom viewing?', hint: T('Sí.', 'Yes.'),
    opts: [O('はい あります', ['hai', 'arimasu']), O('いいえ はな です', ['iie', 'hana']), O('まつり へ いきましょう', ['matsuri', 'ikimasu'])] },  '4.1': { who: '力', ja: 'およげます か', ids: ['oyogimasu'], es: '¿Sabes nadar?', en: 'Can you swim?', hint: T('Sí, sabes.', 'Yes, you can.'),
    opts: [O('はい およげます', ['hai', 'oyogimasu']), O('はい およぎました', ['hai', 'oyogimasu']), O('りょうり が へた です', ['ryouri', 'heta'])] },
  '4.2': { who: '友', ja: 'なつ に なに を します か', ids: ['natsu', 'nani', 'shimasu'], es: '¿Qué vas a hacer en verano?', en: 'What will you do in summer?', hint: T('Tienes intención de viajar.', 'You plan to travel.'),
    opts: [O('りょこう する つもり です', ['ryokou', 'shimasu', 'tsumori']), O('りょこう が すき でした', ['ryokou', 'suki']), O('やくそく が あります', ['yakusoku', 'arimasu'])] },
  '4.3': { who: '天', ja: 'あめ が ふりそう です ね', ids: ['ame', 'furimasu'], es: 'Parece que va a llover, ¿no?', en: 'It looks like rain, doesn’t it?', hint: T('Sí, parece.', 'Yes, it does.'),
    opts: [O('はい ふりそう です', ['hai', 'furimasu']), O('はい ふりました', ['hai', 'furimasu']), O('ケーキ は おいしそう です', ['keeki', 'oishii'])] },
  '4.4': { who: '母', ja: 'かぎ は どこ です か', ids: ['kagi', 'doko'], es: '¿Dónde está la llave?', en: 'Where is the key?', hint: T('Se te olvidó, sin querer.', 'You forgot it, by accident.'),
    opts: [O('わすれて しまいました', ['wasuremasu', 'shimaimasu']), O('かって おきます', ['kaimasu', 'oku']), O('かぎ が ほしい です', ['kagi', 'hoshii'])] },
  '4.5': { who: '日', ja: 'あした はれれば なに を します か', ids: ['ashita', 'haremasu', 'nani', 'shimasu'], es: 'Si mañana está despejado, ¿qué harás?', en: 'If it clears up tomorrow, what will you do?', hint: T('Vas al mar.', 'You go to the sea.'),
    opts: [O('うみ へ いきます', ['umi', 'ikimasu']), O('あめ が ふりそう です', ['ame', 'furimasu']), O('いいえ はれます', ['iie', 'haremasu'])] },
  '4.6': { who: '店', ja: 'いらっしゃいませ', ids: ['irasshaimase'], es: '¡Bienvenido!', en: 'Welcome!', hint: T('Eres el empleado: pide al cliente que espere un momento.', 'You are the clerk: ask the customer to wait a moment.'),
    opts: [O('しょうしょう おまちください', ['shoushou', 'omachikudasai']), O('いただきます', ['itadakimasu']), O('さようなら', ['sayounara'])] },
};

export const sectionById = id => SECTIONS.find(s => s.id === id);
export const phraseById = id => PHRASES.find(p => p.id === id) || EXTRA.find(p => p.id === id);
export const nextSection = id => SECTIONS[SECTIONS.findIndex(s => s.id === id) + 1] || null;

// ---------- Chequeo (docs/CURRICULO.md §3). Devuelve la lista de errores. ----------
export function checkCurriculum() {
  const errs = [];
  const lex = Object.fromEntries(LEX.map(w => [w.id, w]));
  const pats = new Set(PATTERNS.map(p => p.id)), stages = new Set(STAGES.map(s => s.id));
  const forms = verbForms;
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
  // Cobertura: el 70 % de las palabras aparece en alguna frase de viaje, frase del currículo o diálogo
  const inUse = new Set([...PHRASES, ...EXTRA].flatMap(p => p.ids));
  Object.values(TALKS).forEach(d => [d, ...d.opts].forEach(x => x.ids.forEach(id => inUse.add(id))));
  const cover = LEX.filter(w => inUse.has(w.id)).length / LEX.length;
  if (cover < .7) errs.push(`Solo el ${Math.round(cover * 100)} % de las palabras aparece en alguna frase o diálogo (mínimo 70 %)`);
  return errs;
}
