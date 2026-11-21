// KANJŪ · readings.js — la lectura de cada unidad (P-12; propuesta aprobada docs/propuestas/P-11-lectura.html,
// docs/PROGRESION.md §12). Solo datos y funciones puras (sin DOM ni estado): checkCurriculum() los valida.
// Aquí solo están las dos lecturas que aprobó la maqueta (nota de la 1.10 y correo de la 2.10); el resto es P-13.
//
// Formato de UNIT_READINGS[idDeUnidad]:
//   kind   'note' (nota o mensaje, etapa 1: 2 a 4 líneas) | 'mail' (correo o diario, etapa 2: 5 a 10 líneas)
//   title  título · say: lo que dice tu KANJŪ al abrirla
//   from, to  (solo 'mail') quién escribe y la línea de la cabecera
//   lines  cada línea es una lista de fichas separadas por «|». Las fichas se dibujan pegadas, sin espacios, como se
//          escribe de verdad; el espacio solo existe en los datos.
//            «[kanji:lectura]» lleva furigana (la furigana se muestra según el dominio del jugador, S.srs)
//            «^。» o «^、» es puntuación (el «。 ！ ？» cierra una frase para el audio y el resaltado)
//            «ficha#etiqueta» distingue dos usos de la misma forma (で#with, に#into): la etiqueta no se muestra
//   es     la traducción (texto plano), una por línea (no se muestra mientras lees: solo en cada respuesta y al final)
//   words  qué dice cada ficha al tocarla, por su clave (la ficha sin furigana y con su «#etiqueta»):
//            m significado · g nota corta · kind (name | particle | noun | time | expr | verb | number | adji | form | gram)
//            id  palabra de LEX (si la hay; cuenta como encuentro al leer) · say  cómo se dice sola (へ → え)
//            nw  kanji con los que se arma una palabra nueva (que se puede leer aunque no se haya visto junta)
//   km     significado de los kanji enseñados que todavía no son KANJŪ (los demás salen de KANJI)
//   Q      preguntas (2 en la etapa 1, 3 desde la etapa 2): q, o (3 opciones), a (la correcta), line (la línea
//          que responde), tip (una pista por opción; la de la correcta va vacía) y ok (lo que se dice al acertar)
const T = es => ({ es });
const W = (kind, m, g, x = {}) => ({ kind, m: T(m), ...(g ? { g: T(g) } : {}), ...x });

export const UNIT_READINGS = {
  '1.10': {
    kind: 'note',
    title: T('Una nota para Yumi'),
    say: T('Yumi encontró una nota en la mesa. ¿La leemos juntos?'),
    lines: [
      'ゆみ|へ',
      'お[母:かあ]さん|は|[七:しち][時:じ]|ごろ|[帰:かえ]ります|^。',
      'ばんごはん|は|[三:さん][人:にん]|で#with|[食:た]べます|^。',
      'おにぎり|は|つくえ|の|[上:うえ]|に|あります|^。',
    ],
    es: ['Para Yumi:', 'Mamá vuelve a eso de las siete.', 'Cenamos los tres.', 'Los onigiri están encima del escritorio.'],
    km: { 帰: T('volver') },
    words: {
      'ゆみ': W('name', 'Yumi', 'Un nombre de persona.'),
      'へ': W('particle', 'para… (al empezar una nota o una carta)', 'Es la misma へ de «ir hacia»: la nota va hacia Yumi. Se lee «e».', { say: 'え' }),
      'は': W('particle', 'marca el tema de la frase', 'Escrita は, se lee «wa». Lo que va antes es de lo que se habla.'),
      'お母さん': W('noun', 'mamá', 'Así se le dice a la mamá dentro de la familia, y también a la madre de otra persona.', { id: 'okaasan' }),
      '七時': W('time', 'las siete', '七 (siete) + 時 (hora). En la hora, 七 se lee しち.'),
      'ごろ': W('expr', 'a eso de (una hora)', 'Va pegada a la hora: 七時ごろ, «a eso de las siete».', { id: 'goro' }),
      '帰ります': W('verb', 'volver (a casa)', 'Forma educada (〜ます).', { id: 'kaerimasu' }),
      'ばんごはん': W('noun', 'la cena', 'Va en kana porque 晩 todavía no se enseña.', { id: 'bangohan' }),
      '三人': W('number', 'tres personas', '三 (tres) + 人 contado como にん. 1 y 2 son distintos: ひとり, ふたり.', { nw: ['三', '人'] }),
      'で#with': W('particle', 'entre (tantas personas)', '三人で: «los tres juntos». Es la で de «con qué» o «cómo» se hace algo.'),
      '食べます': W('verb', 'comer', 'Forma educada (〜ます).', { id: 'tabemasu' }),
      'おにぎり': W('noun', 'bola de arroz (onigiri)', null, { id: 'onigiri' }),
      'つくえ': W('noun', 'escritorio', 'Va en kana porque 机 todavía no se enseña.', { id: 'tsukue' }),
      'の': W('particle', 'de', 'Une dos palabras: つくえの上, «lo de arriba del escritorio».'),
      '上': W('noun', 'arriba · encima', null, { id: 'ue' }),
      'に': W('particle', 'en (el lugar donde algo está)', 'Con あります o います marca dónde está.'),
      'あります': W('verb', 'hay · está (cosas)', 'Para cosas. Para personas y animales es います.', { id: 'arimasu' }),
    },
    Q: [
      { q: T('¿A qué hora vuelve la mamá?'), o: [T('A eso de las siete'), T('A las tres en punto'), T('A eso de las diez')], a: 0, line: 1,
        tip: [T(''), T('三 aparece en 三人 (tres personas), no en la hora. La hora es 七時: las siete.'), T('十 (diez) no aparece en la nota. La hora es 七時: las siete.')],
        ok: T('ごろ quiere decir «a eso de».') },
      { q: T('¿Dónde están los onigiri?'), o: [T('Debajo del escritorio'), T('Encima del escritorio'), T('Dentro de la mochila')], a: 1, line: 3,
        tip: [T('上 es «arriba, encima». «Debajo» sería 下.'), T(''), T('La nota no habla de una mochila (かばん). Dice つくえの上: encima del escritorio.')],
        ok: T('つくえの上: encima del escritorio.') },
    ],
  },

  '2.10': {
    kind: 'mail',
    title: T('Un sábado de nieve'),
    say: T('Ken le escribió un correo a Tanaka. ¡Habla de la nieve! ¿Lo leemos?'),
    from: 'ケン', to: T('para たなかさん · sábado'),
    lines: [
      'たなか|さん|へ',
      '[土:ど][曜:よう][日:び]|は|[朝:あさ]|から|[雨:あめ]|でした|^。|とても|さむかった|です|^。',
      '[十:じゅう][時:じ]|ごろ|^、|[母:はは]|と|[駅:えき][前:まえ]|の|カフェ|に#into|[入:はい]りました|^。',
      '[私:わたし]|は|コーヒー|を|[飲:の]みました|^。|[母:はは]|は|ケーキ|を|[食:た]べました|^。',
      'ケーキ|は|[高:たか]かった|です|^。|でも|^、|とても|おいしかった|です|^。',
      'ゆうがた|^、|[雪:ゆき]|が|ふりました|^。|[窓:まど]|から|^、|[白:しろ]い|[雪:ゆき]|を|みました|^。',
      '[明日:あした]|は|[休:やす]み|です|^。|たなか|さん|の|[家:いえ]|に#to|[行:い]って|もいいですか|^。',
      'ケン',
    ],
    es: ['Para Tanaka:', 'El sábado llovió desde la mañana. Hacía mucho frío.', 'A eso de las diez, entramos con mamá a la cafetería frente a la estación.', 'Yo tomé café. Mamá comió pastel.', 'El pastel era caro. Pero estaba muy rico.', 'Al atardecer nevó. Desde la ventana vi la nieve blanca.', 'Mañana es mi día libre. ¿Puedo ir a tu casa?', 'Ken'],
    km: { 雪: T('nieve'), 窓: T('ventana') },
    words: {
      'たなか': W('name', 'Tanaka', 'Un apellido.', { id: 'tanaka' }),
      'さん': W('expr', 'señor · señora', 'Va después del nombre de otra persona, nunca del tuyo.', { id: 'san' }),
      'へ': W('particle', 'para… (al empezar una nota o una carta)', 'Es la misma へ de «ir hacia»: la nota va hacia Yumi. Se lee «e».', { say: 'え' }),
      'は': W('particle', 'marca el tema de la frase', 'Escrita は, se lee «wa». Lo que va antes es de lo que se habla.'),
      '土曜日': W('noun', 'sábado', null, { id: 'doyoubi' }),
      '朝': W('noun', 'la mañana', null, { id: 'asa' }),
      'から': W('particle', 'desde', '朝から: desde la mañana. 窓から: desde la ventana.'),
      '雨': W('noun', 'lluvia', null, { id: 'ame' }),
      'でした': W('form', 'era · fue', 'Pasado de です.'),
      'とても': W('expr', 'muy', null, { id: 'totemo' }),
      'さむかった': W('adji', 'hacía frío', 'Pasado de さむい: la い final se vuelve かった. Va en kana porque 寒 todavía no se enseña.', { id: 'samui' }),
      'です': W('form', '(forma educada)', 'Después de un adjetivo en pasado, です solo lo hace educado: さむかったです.'),
      '十時': W('time', 'las diez'),
      'ごろ': W('expr', 'a eso de (una hora)', 'Va pegada a la hora: 十時ごろ, «a eso de las diez».', { id: 'goro' }),
      '母': W('noun', 'mi mamá', 'Así nombras a tu madre ante alguien de afuera (como Ken en su correo a Tanaka). En la familia se dice お母さん.', { id: 'haha' }),
      'と': W('particle', 'con', '母と: con mamá.'),
      '駅前': W('noun', 'frente a la estación', 'Se usa para nombrar lugares: 駅前のカフェ.', { nw: ['駅', '前'] }),
      'の': W('particle', 'de', 'Une dos palabras: 駅前のカフェ, «la cafetería frente a la estación».'),
      'カフェ': W('noun', 'cafetería', null, { id: 'kafe' }),
      'に#into': W('particle', 'a (el lugar al que entras)', 'Con 入ります, el lugar va con に.'),
      '入りました': W('verb', 'entramos', 'Pasado de 入ります (entrar).', { id: 'hairimasu' }),
      '私': W('noun', 'yo', null, { id: 'watashi' }),
      'コーヒー': W('noun', 'café', null, { id: 'koohii' }),
      'を': W('particle', 'marca lo que se come, se toma, se ve…', 'Se escribe を y se lee «o».'),
      '飲みました': W('verb', 'tomé · bebí', 'Pasado de 飲みます.', { id: 'nomimasu' }),
      'ケーキ': W('noun', 'pastel', null, { id: 'keeki' }),
      '食べました': W('verb', 'comió · comí', 'Pasado de 食べます.', { id: 'tabemasu' }),
      '高かった': W('adji', 'era caro', 'Pasado de 高い: 高い → 高かった.', { id: 'takai' }),
      'でも': W('expr', 'pero', 'Al empezar la frase.', { id: 'demo' }),
      'おいしかった': W('adji', 'estaba rico', 'Pasado de おいしい.', { id: 'oishii' }),
      'ゆうがた': W('noun', 'al atardecer', 'Va en kana porque 方 todavía no se enseña.', { id: 'yuugata' }),
      '雪': W('noun', 'nieve', null, { id: 'yuki' }),
      'が': W('particle', 'marca quién o qué hace algo', '雪がふりました: lo que cayó fue la nieve.'),
      'ふりました': W('verb', 'cayó (lluvia, nieve)', 'Pasado de ふります. Va en kana porque 降 todavía no se enseña.', { id: 'furimasu' }),
      '家': W('noun', 'casa', null),
      '窓': W('noun', 'ventana', null, { id: 'mado' }),
      '白い': W('adji', 'blanco', null, { id: 'shiroi' }),
      'みました': W('verb', 'vi · miré', 'Pasado de みます. Va en kana porque 見 llega en la 2.12.', { id: 'mimasu' }),
      '明日': W('noun', 'mañana (el día siguiente)', 'Se lee あした como palabra entera: no se separa por kanji.', { id: 'ashita' }),
      '休み': W('noun', 'día libre · descanso', null, { id: 'yasumi' }),
      'に#to': W('particle', 'a (el lugar al que vas)', 'Con 行きます, el lugar al que vas va con に.'),
      '行って': W('verb', 'ir (forma て)', '行きます en forma て es 行って.', { id: 'ikimasu' }),
      'もいいですか': W('gram', '¿puedo…?', 'Forma て + もいいですか: pedir permiso. Es la gramática de esta unidad.'),
      'ケン': W('name', 'Ken', 'Un nombre, en katakana. Firma el correo.'),
    },
    Q: [
      { q: T('¿Qué tiempo hizo el sábado por la mañana?'), o: [T('Llovió'), T('Nevó'), T('Hubo sol')], a: 0, line: 1,
        tip: [T(''), T('La nieve llegó después, ゆうがた (al atardecer). Por la mañana dice 朝から雨でした: llovió.'), T('Dice 朝から雨でした: llovió desde la mañana.')],
        ok: T('朝から雨でした: llovió desde la mañana.') },
      { q: T('¿Qué comió la mamá?'), o: [T('Café'), T('Pastel'), T('Arroz')], a: 1, line: 3,
        tip: [T('El café lo tomó Ken: 私はコーヒーを飲みました.'), T(''), T('El correo no habla de arroz. 母はケーキを食べました: mamá comió pastel.')],
        ok: T('母はケーキを食べました: mamá comió pastel.') },
      { q: T('¿Qué le pregunta Ken a Tanaka?'), o: [T('Si quiere ir a la cafetería'), T('Si mañana va a nevar'), T('Si puede ir a su casa mañana')], a: 2, line: 6,
        tip: [T('La cafetería ya fue: 入りました está en pasado.'), T('No pregunta por el clima. 行ってもいいですか es «¿puedo ir?».'), T('')],
        ok: T('行ってもいいですか: ¿puedo ir? Es lo que aprendiste en esta unidad.') },
    ],
  },
};

// Cuántas preguntas lleva una lectura según su etapa (§12: 2 o 3)
export const questionsFor = stage => stage === 'e1' || stage === 'e0' ? 2 : 3;
// Largo en líneas según el tipo (nota de la etapa 1: 2 a 4 · correo o diario de la etapa 2: 5 a 10)
export const LINES = { note: [2, 4], mail: [5, 10] };

// ---------- Fichas ----------
const KRX = /[一-鿿]/;
export const isKanji = c => KRX.test(c);
// Una ficha «[k:r]» o texto → trozos { k, r } (con furigana) o { t }
export const segs = s => { const out = []; s.replace(/\[([^:\]]+):([^\]]+)\]|([^\[]+)/g, (_, k, r, t) => { out.push(k ? { k, r } : { t }); }); return out; };
export const plainOf = s => s.replace(/#\w+$/, '').replace(/\[([^:\]]+):[^\]]+\]/g, '$1');
export const readOf = s => s.replace(/#\w+$/, '').replace(/\[([^:\]]+):([^\]]+)\]/g, '$2');
export const keyOf = s => { const h = s.match(/#\w+$/); return h ? plainOf(s) + h[0] : plainOf(s); };

// Una lectura → sus líneas de fichas (con el número de frase de cada una, para el audio) y sus frases en texto
export function analyze(R) {
  let sn = 0, wi = 0, cur = '';
  const sents = [];
  const lines = R.lines.map(ln => {
    const toks = ln.split('|').map(raw => {
      const s = sn;
      if (raw[0] === '^') {
        const p = raw.slice(1); cur += p;
        if (/[。！？]/.test(p)) { sents[sn++] = cur; cur = ''; }
        return { raw, pu: true, p, s };
      }
      cur += plainOf(raw);
      return { raw, pu: false, s, i: wi++, key: keyOf(raw) };
    });
    if (cur) { sents[sn++] = cur; cur = ''; } // el saludo y la firma cuentan como su propia frase
    return toks;
  });
  return { lines, sents };
}
// Kanji distintos de la lectura, en orden de aparición
export const kanjiOf = R => [...new Set(R.lines.join('|').split('|').filter(x => x[0] !== '^').flatMap(x => [...plainOf(x)]).filter(isKanji))];
// Palabras nuevas: fichas que se pueden leer con kanji conocidos aunque no se hayan visto juntas
export const newWordsOf = R => [...new Set(R.lines.join('|').split('|').filter(x => x[0] !== '^' && R.words[keyOf(x)]?.nw).map(plainOf))];
