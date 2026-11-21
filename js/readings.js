// KANJŪ · readings.js — la lectura de cada unidad (P-12; propuesta aprobada docs/propuestas/P-11-lectura.html,
// docs/PROGRESION.md §12). Solo datos y funciones puras (sin DOM ni estado): checkCurriculum() los valida.
// Modelos aprobados por la maqueta: nota de la 1.10 y correo de la 2.10. P-13a suma las notas de la 1.1 a la 1.9.
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

// Fichas que se repiten en las lecturas de la etapa 1 (P-13a)
const C = {
  wa: W('particle', 'marca el tema de la frase', 'Escrita は, se lee «wa». Lo que va antes es de lo que se habla.'),
  no: W('particle', 'de', 'Une dos palabras y dice a quién pertenece algo o de dónde viene.'),
  ka: W('particle', '(hace una pregunta)', 'Va al final de la frase: か hace el papel de los signos de pregunta.'),
  desu: W('form', '(forma educada)', 'Cierra la frase de forma cortés. Es el «es» o «son».'),
  san: W('expr', 'señor · señora', 'Va después del nombre de otra persona, nunca del tuyo.', { id: 'san' }),
  watashi: W('noun', 'yo', null, { id: 'watashi' }),
  yumi: W('name', 'Yumi', 'Un nombre de persona.'),
  ken: W('name', 'Ken', 'Un nombre de persona, en katakana.'),
  nan: W('noun', 'qué', 'Antes de です se lee なん.', { id: 'nan' }),
  to: W('particle', 'y', 'Une dos palabras: 父と母, «papá y mamá».'),
  mo: W('particle', 'también', 'Ocupa el lugar de は.'),
  wo: W('particle', 'marca lo que se come, se toma, se ve…', 'Se escribe を y se lee «o».'),
  ga: W('particle', 'marca lo que gusta', 'Con すき, lo que te gusta lleva が.'),
  ano: W('expr', 'ese · esa (a lo lejos, antes de un nombre)', null, { id: 'ano' }),
  kono: W('expr', 'este · esta (antes de un nombre)', null, { id: 'kono' }),
  totemo: W('expr', 'muy', null, { id: 'totemo' }),
};

export const UNIT_READINGS = {
  '1.1': {
    kind: 'note',
    title: T('Una tarjeta de presentación'),
    say: T('Ken dejó su tarjeta para que lo conozcas. ¿La leemos juntos?'),
    lines: [
      '[私:わたし]|は|ケン|です|^。',
      '[国:くに]|は|[日:に][本:ほん]|です|^。|[日:に][本:ほん][人:じん]|です|^。',
      'たなか|さん|は|ともだち|です|^。',
      'あの|[木:き]|は|[日:に][本:ほん]|の|[木:き]|です|^。',
    ],
    es: ['Yo soy Ken.', 'Mi país es Japón. Soy japonés.', 'El señor Tanaka es mi amigo.', 'Ese árbol es un árbol de Japón.'],
    words: {
      '私': C.watashi,
      'は': C.wa,
      'ケン': C.ken,
      'です': C.desu,
      '国': W('noun', 'país', null, { id: 'kuni' }),
      '日本': W('noun', 'Japón', '日 (sol) + 本 (origen): «el origen del sol». Se lee にほん.', { id: 'nihon' }),
      '日本人': W('noun', 'japonés · japonesa (persona)', '日 + 本 + 人 (persona). Aquí 人 se lee «じん»: la persona de un país.', { id: 'nihonjin', nw: ['日', '本', '人'] }),
      'たなか': W('name', 'Tanaka', 'Un apellido.', { id: 'tanaka' }),
      'さん': C.san,
      'ともだち': W('noun', 'amigo · amiga', 'Va en kana porque 友達 todavía no se enseña.', { id: 'tomodachi' }),
      'あの': C.ano,
      '木': W('noun', 'árbol', null, { id: 'ki' }),
      'の': C.no,
    },
    Q: [
      { q: T('¿De dónde es Ken?'), o: [T('De Japón'), T('De China'), T('De México')], a: 0, line: 1,
        tip: [T(''), T('China se dice ちゅうごく. La tarjeta dice 国は日本です: su país es Japón.'), T('México se escribe メキシコ y no aparece. Aquí dice 日本: Japón.')],
        ok: T('国は日本です: su país es Japón.') },
      { q: T('¿Quién es el señor Tanaka para Ken?'), o: [T('Su profesor'), T('Su amigo'), T('Su hermano')], a: 1, line: 2,
        tip: [T('Profesor se dice せんせい. Aquí dice ともだち.'), T(''), T('La tarjeta no habla de hermanos. たなかさんは ともだち: es su amigo.')],
        ok: T('ともだち quiere decir «amigo».') },
    ],
  },

  '1.2': {
    kind: 'note',
    title: T('Un mensaje de Yumi'),
    say: T('Yumi le escribió a Ken con muchas preguntas. ¿Las leemos?'),
    lines: [
      'ケン|さん|^、|この|[人:ひと]|は|[何:なに][人:じん]|です|か|^。',
      'それ|は|[私:わたし]|の|[本:ほん]|です|か|^。',
      'あれ|は|[何:なん]|です|か|^。',
    ],
    es: ['Ken, ¿de qué país es esta persona?', '¿Eso es mi libro?', '¿Qué es aquello de allá?'],
    words: {
      'ケン': C.ken,
      'さん': C.san,
      'この': C.kono,
      '人': W('noun', 'persona', null, { id: 'hito' }),
      'は': C.wa,
      '何人': W('noun', 'de qué país (de qué nacionalidad)', 'Aquí 人 se lee «じん», como en 日本人, y 何 se lee «なに». Con un número, como 三人, se lee «にん».', { nw: ['何', '人'] }),
      'です': C.desu,
      'か': C.ka,
      'それ': W('noun', 'eso (cerca de quien escucha)', null, { id: 'sore' }),
      '私': C.watashi,
      'の': C.no,
      '本': W('noun', 'libro', null, { id: 'hon' }),
      'あれ': W('noun', 'aquello (lejos de los dos)', null, { id: 'are' }),
      '何': C.nan,
    },
    Q: [
      { q: T('¿Qué le pregunta Yumi a Ken sobre esa persona?'), o: [T('Cuántos años tiene'), T('De qué país es'), T('Cómo se llama')], a: 1, line: 0,
        tip: [T('La edad se pregunta con 何歳 (なんさい). Aquí es 何人, con 人 leído «じん»: de qué país.'), T(''), T('El nombre se pregunta con なまえ. 何人 pregunta de qué país es.')],
        ok: T('何人: de qué país es la persona.') },
      { q: T('¿Qué cree Yumi que es «それ»?'), o: [T('Su libro'), T('Su bolso'), T('Su paraguas')], a: 0, line: 1,
        tip: [T(''), T('Bolso se dice かばん. Aquí dice 本: libro.'), T('Paraguas se dice かさ. Aquí dice 本: libro.')],
        ok: T('私の本: su libro.') },
    ],
  },

  '1.3': {
    kind: 'note',
    title: T('Un mensaje de Ken'),
    say: T('Ken no sabe qué hora es. ¿Le ayudamos a leer su mensaje?'),
    lines: [
      'ゆみ|さん|^、|いま|は|[何:なん][時:じ]|です|か|^。',
      '[私:わたし]|の|とけい|は|[十:じゅう][二:に][時:じ]|です|^。',
      'じゅぎょう|は|ごご|[二:に][時:じ][半:はん]|です|^。',
    ],
    es: ['Yumi, ¿qué hora es ahora?', 'Mi reloj marca las doce.', 'La clase es a las dos y media de la tarde.'],
    words: {
      'ゆみ': C.yumi,
      'さん': C.san,
      'いま': W('time', 'ahora', 'Va en kana porque 今 todavía no se enseña.', { id: 'ima' }),
      'は': C.wa,
      '何時': W('time', '¿qué hora?', '何 (qué) + 時 (hora): なん じ.'),
      'です': C.desu,
      'か': C.ka,
      '私': C.watashi,
      'の': C.no,
      'とけい': W('noun', 'reloj', 'Va en kana porque 計 todavía no se enseña.', { id: 'tokei' }),
      '十二時': W('time', 'las doce', '十 (diez) + 二 (dos) + 時 (hora): じゅうに じ.', { nw: ['十', '二', '時'] }),
      'じゅぎょう': W('noun', 'clase', 'Va en kana porque 授業 todavía no se enseña.', { id: 'jugyou' }),
      'ごご': W('time', 'de la tarde (p. m.)', 'Va antes de la hora: ごご二時, «las dos de la tarde».', { id: 'gogo' }),
      '二時半': W('time', 'las dos y media', '二時 (las dos) + 半 (y media).'),
    },
    Q: [
      { q: T('¿Qué hora marca el reloj de Ken?'), o: [T('Las dos'), T('Las doce'), T('Las diez')], a: 1, line: 1,
        tip: [T('二時 aparece en la clase (二時半). El reloj dice 十二時: las doce.'), T(''), T('十 (diez) está en 十二時, pero la hora completa es doce.')],
        ok: T('十二時: las doce.') },
      { q: T('¿A qué hora es la clase?'), o: [T('A las doce y media'), T('A las dos en punto'), T('A las dos y media')], a: 2, line: 2,
        tip: [T('十二時 es la hora del reloj de Ken, no la de la clase.'), T('Falta 半: quiere decir «y media».'), T('')],
        ok: T('二時半: las dos y media.') },
    ],
  },

  '1.4': {
    kind: 'note',
    title: T('El cartel del puesto'),
    say: T('¡Mira el cartel de este puesto del mercado! ¿Vemos cuánto cuesta cada cosa?'),
    lines: [
      'りんご|は|[百:ひゃく][円:えん]|です|^。',
      'みかん|は|[二:に][百:ひゃく][円:えん]|です|^。',
      'ケーキ|は|[五:ご][百:ひゃく][円:えん]|です|^。',
      'かばん|は|[千:せん][円:えん]|です|^。',
    ],
    es: ['Las manzanas cuestan cien yenes.', 'Las mandarinas cuestan doscientos yenes.', 'El pastel cuesta quinientos yenes.', 'El bolso cuesta mil yenes.'],
    words: {
      'りんご': W('noun', 'manzana', null, { id: 'ringo' }),
      'は': C.wa,
      '百円': W('number', 'cien yenes', '百 (cien) + 円 (yen): ひゃく えん.'),
      'です': C.desu,
      'みかん': W('noun', 'mandarina', null, { id: 'mikan' }),
      '二百円': W('number', 'doscientos yenes', '二 (dos) + 百 (cien) + 円 (yen): にひゃく えん.', { nw: ['二', '百', '円'] }),
      'ケーキ': W('noun', 'pastel', null, { id: 'keeki' }),
      '五百円': W('number', 'quinientos yenes', '五 (cinco) + 百 (cien) + 円 (yen): ごひゃく えん.'),
      'かばん': W('noun', 'bolso · mochila', null, { id: 'kaban' }),
      '千円': W('number', 'mil yenes', '千 (mil) + 円 (yen): せん えん.'),
    },
    Q: [
      { q: T('¿Cuánto cuestan las mandarinas?'), o: [T('100 yenes'), T('200 yenes'), T('500 yenes')], a: 1, line: 1,
        tip: [T('百円 (cien yenes) es el precio de las manzanas. Las mandarinas llevan 二 delante: 二百円.'), T(''), T('五百円 es el precio del pastel.')],
        ok: T('二百円: doscientos yenes.') },
      { q: T('¿Qué cuesta mil yenes?'), o: [T('La manzana'), T('El pastel'), T('El bolso')], a: 2, line: 3,
        tip: [T('Las manzanas cuestan 百円: cien yenes.'), T('El pastel cuesta 五百円: quinientos yenes.'), T('')],
        ok: T('千円: mil yenes. Es el precio del bolso.') },
    ],
  },

  '1.5': {
    kind: 'note',
    title: T('Un mensaje de Yumi'),
    say: T('Yumi nos escribió desde el campo. ¿Lo leemos?'),
    lines: [
      'ケン|さん|^、|これ|は|[飲:の]み[水:みず]|です|^。',
      '[私:わたし]|は|[水:みず]|を|[飲:の]みます|^。',
      'ケン|さん|は|[何:なに]|を|[食:た]べます|か|^。',
      'おにぎり|です|か|^。',
    ],
    es: ['Ken, esto es agua potable.', 'Yo tomo agua.', 'Ken, ¿tú qué comes?', '¿Son onigiri?'],
    words: {
      'ケン': C.ken,
      'さん': C.san,
      'これ': W('noun', 'esto (cerca de quien habla)', null, { id: 'kore' }),
      'は': C.wa,
      '飲み水': W('noun', 'agua potable (agua para beber)', '飲 (beber) + み + 水 (agua): のみみず. Se ve en los carteles junto a las fuentes.', { nw: ['飲', '水'] }),
      'です': C.desu,
      '私': C.watashi,
      '水': W('noun', 'agua', null, { id: 'mizu' }),
      'を': C.wo,
      '飲みます': W('verb', 'beber · tomar', 'Forma educada (〜ます).', { id: 'nomimasu' }),
      '何': W('noun', 'qué', 'Antes de を se lee なに.', { id: 'nani' }),
      '食べます': W('verb', 'comer', 'Forma educada (〜ます).', { id: 'tabemasu' }),
      'か': C.ka,
      'おにぎり': W('noun', 'bola de arroz (onigiri)', null, { id: 'onigiri' }),
    },
    Q: [
      { q: T('¿Qué toma Yumi?'), o: [T('Café'), T('Agua'), T('Té')], a: 1, line: 1,
        tip: [T('El café (コーヒー) no aparece en el mensaje. Yumi dice 水を飲みます.'), T(''), T('El té se dice お茶 y no aparece. Yumi dice 水: agua.')],
        ok: T('水を飲みます: toma agua.') },
      { q: T('¿Qué le pregunta Yumi a Ken?'), o: [T('Qué toma'), T('Qué come'), T('Dónde come')], a: 1, line: 2,
        tip: [T('Beber es 飲みます. Aquí pregunta con 食べます.'), T(''), T('No pregunta dónde. 何を食べますか es «¿qué comes?».')],
        ok: T('食べます: comer. Le pregunta qué come.') },
    ],
  },

  '1.6': {
    kind: 'note',
    title: T('La semana de Yumi'),
    say: T('Yumi anotó su semana. ¿La leemos?'),
    lines: [
      '[月:げつ][水:すい][金:きん]|は|バイト|です|^。',
      '[火:か][曜:よう][日:び]|は|テスト|です|^。',
      '[土:ど][曜:よう][日:び]|と|[日:にち][曜:よう][日:び]|は|やすみ|です|^。',
      'ケン|さん|^、|[木:もく][曜:よう][日:び]|は|ひま|です|か|^。',
    ],
    es: ['Lunes, miércoles y viernes tengo mi trabajo de medio tiempo.', 'El martes tengo un examen.', 'El sábado y el domingo descanso.', 'Ken, ¿estás libre el jueves?'],
    words: {
      '月水金': W('time', 'lunes, miércoles y viernes', '月 (げつ) + 水 (すい) + 金 (きん). Así se anotan los días en un horario.', { nw: ['月', '水', '金'] }),
      'は': C.wa,
      'バイト': W('noun', 'trabajo de medio tiempo', null, { id: 'baito' }),
      'です': C.desu,
      '火曜日': W('noun', 'martes', '火 (fuego) + 曜 + 日.', { id: 'kayoubi' }),
      'テスト': W('noun', 'examen', null, { id: 'tesuto' }),
      '土曜日': W('noun', 'sábado', '土 (tierra) + 曜 + 日.', { id: 'doyoubi' }),
      'と': C.to,
      '日曜日': W('noun', 'domingo', '日 (sol) + 曜 + 日. La primera 日 se lee «にち» y la última «び».', { id: 'nichiyoubi' }),
      'やすみ': W('noun', 'día libre · descanso', 'Va en kana porque 休 todavía no se enseña.', { id: 'yasumi' }),
      'ケン': C.ken,
      'さん': C.san,
      '木曜日': W('noun', 'jueves', '木 (árbol) + 曜 + 日.', { id: 'mokuyoubi' }),
      'ひま': W('adji', 'libre · sin nada que hacer', 'Va en kana porque 暇 todavía no se enseña.', { id: 'hima' }),
      'か': C.ka,
    },
    Q: [
      { q: T('¿Qué días trabaja Yumi?'), o: [T('Lunes, miércoles y viernes'), T('Martes y jueves'), T('Sábado y domingo')], a: 0, line: 0,
        tip: [T(''), T('火曜日 (martes) es el día del examen, y 木曜日 (jueves) es el día que le pregunta a Ken.'), T('土曜日 y 日曜日 son sábado y domingo: ¡esos días descansa!')],
        ok: T('月水金: lunes, miércoles y viernes.') },
      { q: T('¿Qué día es el examen?'), o: [T('El viernes'), T('El martes'), T('El jueves')], a: 1, line: 1,
        tip: [T('金曜日 es viernes, y ese día trabaja (月水金).'), T(''), T('木曜日 es jueves: ese día Yumi le pregunta a Ken si está libre.')],
        ok: T('火曜日はテストです: el examen es el martes.') },
    ],
  },

  '1.7': {
    kind: 'note',
    title: T('Un mensaje de Ken'),
    say: T('Ken quiere ir al parque con Yumi. ¿Leemos su mensaje?'),
    lines: [
      'ゆみ|さん|^、|[私:わたし]|は|こうえん|へ|[行:い]きます|^。',
      'ゆみ|さん|は|バス|で#by|[来:き]ます|か|^。',
      'こうえん|で#at|ゆみ|さん|に|あいます|^。',
      '[行:い]き|は|[車:くるま]|^、|[帰:かえ]り|は|でんしゃ|です|^。',
    ],
    es: ['Yumi, yo voy al parque.', '¿Tú vienes en autobús?', 'Me encuentro contigo en el parque.', 'La ida es en auto y la vuelta, en tren.'],
    km: { 帰: T('volver') },
    words: {
      'ゆみ': C.yumi,
      'さん': C.san,
      '私': C.watashi,
      'は': C.wa,
      'こうえん': W('noun', 'parque', 'Va en kana porque 公園 todavía no se enseña.', { id: 'kouen' }),
      'へ': W('particle', 'a · hacia (el lugar al que vas)', 'Es la partícula de destino. Se lee «e».', { say: 'え' }),
      '行きます': W('verb', 'ir', 'Forma educada (〜ます).', { id: 'ikimasu' }),
      'バス': W('noun', 'autobús', null, { id: 'basu' }),
      'で#by': W('particle', 'en (el medio de transporte)', 'バスで: «en autobús». Es la で de «con qué» o «cómo».'),
      '来ます': W('verb', 'venir', 'Forma educada (〜ます).', { id: 'kimasu' }),
      'か': C.ka,
      'で#at': W('particle', 'en (el lugar donde pasa algo)', 'こうえんで: «en el parque». Marca dónde haces algo.'),
      'に': W('particle', 'a (la persona a quien ves)', 'Con あいます, la persona va con に.'),
      'あいます': W('verb', 'encontrarse · ver a alguien', 'Forma educada (〜ます). Va en kana porque 会 todavía no se enseña.', { id: 'aimasu' }),
      '行き': W('noun', 'la ida', 'Del verbo 行きます sale 行き, «la ida».', { nw: ['行'] }),
      '車': W('noun', 'auto', null, { id: 'kuruma' }),
      '帰り': W('noun', 'la vuelta', 'Del verbo 帰ります sale 帰り, «la vuelta».', { nw: ['帰'] }),
      'でんしゃ': W('noun', 'tren', 'Va en kana porque 電 todavía no se enseña.', { id: 'densha' }),
      'です': C.desu,
    },
    Q: [
      { q: T('¿Cómo va Ken al parque?'), o: [T('En auto'), T('En tren'), T('En autobús')], a: 0, line: 3,
        tip: [T(''), T('でんしゃ es para la vuelta: 帰りは でんしゃ.'), T('バス es el medio con el que le pregunta a Yumi.')],
        ok: T('行きは車: la ida es en auto.') },
      { q: T('¿Dónde se encuentran Ken y Yumi?'), o: [T('En la estación'), T('En el parque'), T('En la escuela')], a: 1, line: 2,
        tip: [T('La estación (えき) no aparece. Dice こうえんで: en el parque.'), T(''), T('La escuela (がっこう) no aparece. Dice こうえんで あいます.')],
        ok: T('こうえんで あいます: se ven en el parque.') },
    ],
  },

  '1.8': {
    kind: 'note',
    title: T('Un mensaje de Ken'),
    say: T('Ken le cuenta a Yumi lo que le gusta. ¿Lo leemos?'),
    lines: [
      'ゆみ|さん|^、|[私:わたし]|は|いぬ|が|[大:だい][好:す]き|です|^。',
      'この|[子:こ]いぬ|は|[小:ちい]さい|です|^。|とても|かわいい|です|^。',
      'あの|[女:おんな]の[子:こ]|は|ねこ|が|[好:す]き|です|^。',
      'ゆみ|さん|は|[何:なに]|が|[好:す]き|です|か|^。',
    ],
    es: ['Yumi, a mí me encantan los perros.', 'Este cachorro es pequeño. Es muy lindo.', 'A esa niña le gustan los gatos.', 'Yumi, ¿qué te gusta a ti?'],
    words: {
      'ゆみ': C.yumi,
      'さん': C.san,
      '私': C.watashi,
      'は': C.wa,
      'いぬ': W('noun', 'perro', 'Va en kana porque 犬 todavía no se enseña.', { id: 'inu' }),
      'が': C.ga,
      '大好き': W('adji', 'que encanta', '大 (grande) + 好き: «gustar en grande».', { id: 'daisuki' }),
      'です': C.desu,
      'この': C.kono,
      '子いぬ': W('noun', 'cachorro (de perro)', '子 (niño, cría) delante del animal dice que es una cría: こいぬ.', { nw: ['子'] }),
      '小さい': W('adji', 'pequeño', null, { id: 'chiisai' }),
      'とても': C.totemo,
      'かわいい': W('adji', 'lindo · tierno', null, { id: 'kawaii' }),
      'あの': C.ano,
      '女の子': W('noun', 'niña · chica', '女 (mujer) + の + 子 (niño).', { id: 'onnanoko' }),
      'ねこ': W('noun', 'gato', 'Va en kana porque 猫 todavía no se enseña.', { id: 'neko' }),
      '好き': W('adji', 'que gusta', null, { id: 'suki' }),
      '何': W('noun', 'qué', 'Antes de が se lee なに.', { id: 'nani' }),
      'か': C.ka,
    },
    Q: [
      { q: T('¿Cómo es el cachorro?'), o: [T('Grande y muy lindo'), T('Pequeño y muy lindo'), T('Pequeño y aburrido')], a: 1, line: 1,
        tip: [T('大 quiere decir «grande», pero aquí dice 小さい: pequeño.'), T(''), T('つまらない («aburrido») no aparece. Dice とても かわいい: muy lindo.')],
        ok: T('小さい y とても かわいい: pequeño y muy lindo.') },
      { q: T('¿A quién le gustan los gatos?'), o: [T('A Ken'), T('A esa niña'), T('A Yumi')], a: 1, line: 2,
        tip: [T('Ken dice いぬが大好き: a él le encantan los perros.'), T(''), T('Ken le pregunta a Yumi qué le gusta, pero no dice su respuesta.')],
        ok: T('女の子は ねこが 好き: a esa niña le gustan los gatos.') },
    ],
  },

  '1.9': {
    kind: 'note',
    title: T('Mi familia'),
    say: T('Yumi le presenta su familia a Ken. ¿La leemos?'),
    lines: [
      'ケン|さん|^、|[私:わたし]|は|[三:さん][人:にん][兄:きょう][弟:だい]|です|^。',
      '[兄:あに]|は|がくせい|です|^。|[妹:いもうと]|は|[子:こ]ども|です|^。',
      '[父:ちち]|と|[母:はは]|は|いしゃ|です|^。',
      'ケン|さん|の|お[父:とう]さん|も|いしゃ|です|か|^。',
    ],
    es: ['Ken, somos tres hermanos.', 'Mi hermano mayor es estudiante. Mi hermana menor es una niña.', 'Mi papá y mi mamá son médicos.', 'Ken, ¿tu papá también es médico?'],
    words: {
      'ケン': C.ken,
      'さん': C.san,
      '私': C.watashi,
      'は': C.wa,
      '三人兄弟': W('noun', 'tres hermanos (somos tres)', '三 + 人 (にん) + 兄弟 (きょうだい): «tres hermanos». Cuenta a quien habla.', { nw: ['三', '人', '兄', '弟'] }),
      'です': C.desu,
      '兄': W('noun', 'mi hermano mayor', 'Así nombras a tu hermano ante alguien de afuera. Al hermano de otra persona lo llamas お兄さん.', { id: 'ani' }),
      'がくせい': W('noun', 'estudiante', 'Va en kana porque 学 todavía no se enseña.', { id: 'gakusei' }),
      '妹': W('noun', 'mi hermana menor', null, { id: 'imouto' }),
      '子ども': W('noun', 'niño · niña', 'Se escribe 子 + ども porque 供 todavía no se enseña.', { id: 'kodomo' }),
      '父': W('noun', 'mi papá', 'Así nombras a tu padre ante alguien de afuera. En la familia se dice お父さん.', { id: 'chichi' }),
      'と': C.to,
      '母': W('noun', 'mi mamá', 'Así nombras a tu madre ante alguien de afuera. En la familia se dice お母さん.', { id: 'haha' }),
      'いしゃ': W('noun', 'médico · médica', 'Va en kana porque 医者 todavía no se enseña.', { id: 'isha' }),
      'の': C.no,
      'お父さん': W('noun', 'papá (el de otra persona)', 'Para el papá de otra persona se usa お父さん.', { id: 'otousan' }),
      'も': C.mo,
      'か': C.ka,
    },
    Q: [
      { q: T('¿Cuántos hermanos son en la familia de Yumi?'), o: [T('Dos'), T('Tres'), T('Cuatro')], a: 1, line: 0,
        tip: [T('Dos sería 二人兄弟. Aquí dice 三人: tres.'), T(''), T('Cuatro sería 四人兄弟. Aquí dice 三人: tres.')],
        ok: T('三人兄弟: son tres hermanos.') },
      { q: T('¿Quién es estudiante?'), o: [T('Su hermano mayor'), T('Su hermana menor'), T('Su papá')], a: 0, line: 1,
        tip: [T(''), T('妹 es la hermana menor, pero ella es 子ども: una niña.'), T('父 es su papá, y él es いしゃ: médico.')],
        ok: T('兄はがくせいです: el hermano mayor es estudiante.') },
    ],
  },

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
