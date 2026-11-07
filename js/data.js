// Base de kanji. Solo composiciones estructurales ampliamente documentadas.
// recipes[0] es la composición canónica (define composition_depth).
// mn = historia mnemotécnica (ayuda a recordar; no es etimología).
export const KANJI = {
  // — Componentes fundamentales —
  '一': { m: 'uno', on: ['イチ'], kun: ['ひと'], el: 'void', mn: 'Un solo trazo horizontal: el número uno.' },
  '木': { m: 'árbol', on: ['モク', 'ボク'], kun: ['き'], el: 'wood', mn: 'Un tronco con ramas arriba y raíces abajo.' },
  '人': { m: 'persona', on: ['ジン', 'ニン'], kun: ['ひと'], el: 'person', mn: 'Dos piernas caminando: una persona de perfil.' },
  '日': { m: 'sol · día', on: ['ニチ', 'ジツ'], kun: ['ひ'], el: 'sun', mn: 'El sol dentro de un marco, con un rayo en el centro.' },
  '月': { m: 'luna · mes', on: ['ゲツ', 'ガツ'], kun: ['つき'], el: 'moon', mn: 'Una luna creciente que se estiró hacia abajo.' },
  '火': { m: 'fuego', on: ['カ'], kun: ['ひ'], el: 'fire', mn: 'Una fogata: la llama al centro y chispas a los lados.' },
  '田': { m: 'arrozal', on: ['デン'], kun: ['た'], el: 'earth', mn: 'Un arrozal visto desde arriba, dividido en cuatro parcelas.' },
  '力': { m: 'fuerza', on: ['リョク', 'リキ'], kun: ['ちから'], el: 'power', mn: 'Un brazo flexionado mostrando el músculo.' },
  '女': { m: 'mujer', on: ['ジョ', 'ニョ'], kun: ['おんな'], el: 'heart', mn: 'Una mujer arrodillada con los brazos cruzados.' },
  '子': { m: 'niño', on: ['シ', 'ス'], kun: ['こ'], el: 'sky', mn: 'Un bebé envuelto que abre los brazos.' },
  '口': { m: 'boca', on: ['コウ', 'ク'], kun: ['くち'], el: 'voice', mn: 'Una boca bien abierta, cuadrada.' },
  '十': { m: 'diez', on: ['ジュウ'], kun: ['とお'], el: 'metal', mn: 'Una cruz: los diez dedos cruzados.' },
  '目': { m: 'ojo', on: ['モク'], kun: ['め'], el: 'eye', mn: 'Un ojo puesto de pie, con su pupila en medio.' },
  '生': { m: 'vida · nacer', on: ['セイ', 'ショウ'], kun: ['い(きる)', 'う(まれる)'], el: 'life', mn: 'Un brote que asoma de la tierra: la vida.' },
  '心': { m: 'corazón', on: ['シン'], kun: ['こころ'], el: 'heart', mn: 'Un corazón con sus gotas latiendo alrededor.' },
  '皿': { m: 'plato', on: [], kun: ['さら'], el: 'earth', mn: 'Un plato visto de costado, sobre su base.' },
  '水': { m: 'agua', on: ['スイ'], kun: ['みず'], el: 'water', note: 'como componente se escribe 氵', mn: 'Un chorro de agua al centro con salpicaduras a los lados.' },
  '艸': { m: 'hierba', on: ['ソウ'], kun: ['くさ'], el: 'life', note: 'como componente se escribe 艹 (くさかんむり)', mn: 'Dos brotes de hierba lado a lado.' },
  '手': { m: 'mano', on: ['シュ'], kun: ['て'], el: 'power', note: 'como componente se escribe 扌', mn: 'Una mano con los dedos extendidos.' },
  '糸': { m: 'hilo', on: ['シ'], kun: ['いと'], el: 'thread', mn: 'Un ovillo de hilo retorcido que cuelga.' },
  '示': { m: 'mostrar · altar', on: ['ジ', 'シ'], kun: ['しめ(す)'], el: 'spirit', mn: 'Un altar con ofrendas: lo que se muestra a los dioses.' },
  '衣': { m: 'ropa', on: ['イ'], kun: ['ころも'], el: 'thread', note: 'como componente se escribe 衤', mn: 'Una prenda con su cuello y sus faldones.' },
  '立': { m: 'estar de pie', on: ['リツ', 'リュウ'], kun: ['た(つ)'], el: 'person', mn: 'Una persona parada firme sobre el suelo.' },
  '車': { m: 'carro · auto', on: ['シャ'], kun: ['くるま'], el: 'metal', mn: 'Un carro visto desde arriba: el eje y sus dos ruedas.' },
  '止': { m: 'detenerse', on: ['シ'], kun: ['と(まる)', 'と(める)'], el: 'earth', mn: 'Una huella de pie plantada en el suelo: alto.' },
  '土': { m: 'tierra', on: ['ド', 'ト'], kun: ['つち'], el: 'earth', mn: 'Un brote que sale de la tierra.' },
  '寸': { m: 'medida · pulgada', on: ['スン'], kun: [], el: 'power', mn: 'Una mano con un punto en la muñeca: donde se mide el pulso.' },
  '皮': { m: 'piel', on: ['ヒ'], kun: ['かわ'], el: 'earth', mn: 'Una mano que arranca la piel de un animal.' },
  '毛': { m: 'pelo', on: ['モウ'], kun: ['け'], el: 'life', mn: 'Un mechón de pelo que se curva hacia arriba.' },
  '豆': { m: 'poroto · frijol', on: ['トウ', 'ズ'], kun: ['まめ'], el: 'life', mn: 'Un recipiente alto lleno de porotos.' },
  '斤': { m: 'hacha', on: ['キン'], kun: [], el: 'metal', mn: 'Un hacha colgada, lista para cortar.' },
  // — Primera composición —
  '林': { m: 'arboleda', on: ['リン'], kun: ['はやし'], recipes: [['木', '木']], form: 'izquierda-derecha', mn: 'Dos árboles juntos ya son una arboleda.' },
  '休': { m: 'descansar', on: ['キュウ'], kun: ['やす(む)'], recipes: [['人', '木']], form: 'izquierda-derecha', note: '人 aparece como 亻', mn: 'Una persona apoyada en un árbol: descansa.' },
  '本': { m: 'origen · libro', on: ['ホン'], kun: ['もと'], recipes: [['木', '一']], form: 'indicativo', note: 'un trazo marca la raíz', mn: 'Una marca en la raíz del árbol: el origen.' },
  '明': { m: 'brillante', on: ['メイ', 'ミョウ'], kun: ['あか(るい)'], recipes: [['日', '月']], form: 'izquierda-derecha', mn: 'Sol y luna juntos: todo está iluminado.' },
  '炎': { m: 'llama', on: ['エン'], kun: ['ほのお'], recipes: [['火', '火']], form: 'arriba-abajo', mn: 'Fuego sobre fuego: una llamarada.' },
  '男': { m: 'hombre', on: ['ダン', 'ナン'], kun: ['おとこ'], recipes: [['田', '力']], form: 'arriba-abajo', mn: 'Fuerza en el arrozal: quien trabaja la tierra.' },
  '好': { m: 'gustar', on: ['コウ'], kun: ['す(き)'], recipes: [['女', '子']], form: 'izquierda-derecha', mn: 'Una mujer abrazando a su niño: lo que se ama.' },
  '品': { m: 'artículo', on: ['ヒン'], kun: ['しな'], recipes: [['口', '口', '口']], form: 'triángulo', mn: 'Tres cajas apiladas: mercadería.' },
  '晶': { m: 'cristal', on: ['ショウ'], kun: [], recipes: [['日', '日', '日']], form: 'triángulo', mn: 'Tres soles brillando: un cristal resplandeciente.' },
  '星': { m: 'estrella', on: ['セイ', 'ショウ'], kun: ['ほし'], recipes: [['日', '生']], form: 'arriba-abajo', mn: 'Algo que nace brillando como un sol: una estrella.' },
  '姓': { m: 'apellido', on: ['セイ', 'ショウ'], kun: [], recipes: [['女', '生']], form: 'izquierda-derecha', mn: 'Lo que la madre te da al nacer: el apellido.' },
  '杏': { m: 'albaricoque', on: ['キョウ', 'アン'], kun: ['あんず'], recipes: [['木', '口']], form: 'arriba-abajo', mn: 'Un fruto redondo bajo el árbol: el albaricoque.' },
  '旦': { m: 'amanecer', on: ['タン', 'ダン'], kun: [], recipes: [['日', '一']], form: 'arriba-abajo', mn: 'El sol asomando sobre el horizonte.' },
  '朋': { m: 'compañero', on: ['ホウ'], kun: ['とも'], recipes: [['月', '月']], form: 'izquierda-derecha', note: 'componente con forma de 月', mn: 'Dos lunas lado a lado: compañeros.' },
  '古': { m: 'antiguo', on: ['コ'], kun: ['ふる(い)'], recipes: [['十', '口']], form: 'arriba-abajo', mn: 'Diez bocas contando la misma historia: algo antiguo.' },
  '相': { m: 'mutuo', on: ['ソウ', 'ショウ'], kun: ['あい'], recipes: [['木', '目']], form: 'izquierda-derecha', mn: 'Un ojo mira al árbol y el árbol le devuelve la mirada.' },
  '思': { m: 'pensar', on: ['シ'], kun: ['おも(う)'], recipes: [['田', '心']], form: 'arriba-abajo', note: 'componente con forma de 田', mn: 'Un campo de ideas sobre el corazón: pensar.' },
  '加': { m: 'añadir', on: ['カ'], kun: ['くわ(える)'], recipes: [['力', '口']], form: 'izquierda-derecha', mn: 'La fuerza de una voz de aliento: añadir.' },
  // — Primera composición con piezas 部品 —
  '字': { m: 'letra', on: ['ジ'], kun: ['あざ'], recipes: [['宀', '子']], form: 'arriba-abajo', mn: 'Un niño bajo el techo, aprendiendo a escribir letras.' },
  '安': { m: 'tranquilo · barato', on: ['アン'], kun: ['やす(い)'], recipes: [['宀', '女']], form: 'arriba-abajo', mn: 'Una mujer en casa bajo el techo: todo está en paz.' },
  '見': { m: 'ver', on: ['ケン'], kun: ['み(る)'], recipes: [['目', '儿']], form: 'arriba-abajo', mn: 'Un ojo con piernas que sale a ver el mundo.' },
  '兄': { m: 'hermano mayor', on: ['ケイ', 'キョウ'], kun: ['あに'], recipes: [['口', '儿']], form: 'arriba-abajo', mn: 'Una boca grande sobre piernas: el hermano mayor que da órdenes.' },
  '枚': { m: 'hoja · contador de cosas planas', on: ['マイ'], kun: [], recipes: [['木', '攵']], form: 'izquierda-derecha', mn: 'Golpear la madera hasta sacar láminas planas.' },
  '近': { m: 'cerca', on: ['キン'], kun: ['ちか(い)'], recipes: [['斤', '辶']], form: 'envolvente', mn: 'Caminar con el hacha hasta el árbol más cercano.' },
  '床': { m: 'piso · cama', on: ['ショウ'], kun: ['とこ', 'ゆか'], recipes: [['广', '木']], form: 'envolvente', mn: 'Madera bajo un techo abierto: el piso de la casa.' },
  '享': { m: 'recibir · disfrutar', on: ['キョウ'], kun: [], recipes: [['亠', '口', '子']], form: 'arriba-abajo', note: 'tres piezas: 亠, 口 y 子', mn: 'Bajo la tapa, una boca alimenta a un niño: recibir y disfrutar.' },
  '音': { m: 'sonido', on: ['オン', 'イン'], kun: ['おと', 'ね'], recipes: [['立', '日']], form: 'arriba-abajo', mn: 'Alguien de pie bajo el sol, cantando: un sonido.' },
  '新': { m: 'nuevo', on: ['シン'], kun: ['あたら(しい)', 'あら(た)'], recipes: [['立', '木', '斤']], form: 'izquierda-derecha', note: 'tres piezas: 立 y 木 a la izquierda, 斤 a la derecha', mn: 'Cortar un árbol con el hacha: madera nueva.' },
  // — Lote 2 de piezas —
  '軍': { m: 'ejército', on: ['グン'], kun: [], recipes: [['冖', '車']], form: 'arriba-abajo', mn: 'Carros bajo una cubierta: un ejército en marcha.' },
  '連': { m: 'conectar · llevar', on: ['レン'], kun: ['つ(れる)'], recipes: [['車', '辶']], form: 'envolvente', mn: 'Carros en fila por el camino: todo queda conectado.' },
  '疲': { m: 'cansarse', on: ['ヒ'], kun: ['つか(れる)'], recipes: [['疒', '皮']], form: 'envolvente', mn: 'Una enfermedad que se nota en la piel: estar agotado.' },
  '正': { m: 'correcto', on: ['セイ', 'ショウ'], kun: ['ただ(しい)'], recipes: [['一', '止']], form: 'arriba-abajo', mn: 'Detenerse justo en la línea: lo correcto.' },
  '寺': { m: 'templo', on: ['ジ'], kun: ['てら'], recipes: [['土', '寸']], form: 'arriba-abajo', mn: 'Tierra medida con cuidado: el terreno del templo.' },
  '尾': { m: 'cola', on: ['ビ'], kun: ['お'], recipes: [['尸', '毛']], form: 'envolvente', mn: 'Pelo que sale del cuerpo: una cola.' },
  '圧': { m: 'presión', on: ['アツ'], kun: [], recipes: [['厂', '土']], form: 'envolvente', mn: 'Tierra bajo un acantilado: aplastada por el peso.' },
  '厚': { m: 'grueso · amable', on: ['コウ'], kun: ['あつ(い)'], recipes: [['厂', '日', '子']], form: 'envolvente', note: 'tres piezas: 厂, 日 y 子', mn: 'Un niño al sol bajo la roca: abrigado y protegido.' },
  '同': { m: 'igual', on: ['ドウ'], kun: ['おな(じ)'], recipes: [['冂', '一', '口']], form: 'envolvente', note: 'tres piezas: 冂, 一 y 口', mn: 'Todas las bocas dentro del mismo marco: iguales.' },
  '内': { m: 'dentro', on: ['ナイ', 'ダイ'], kun: ['うち'], recipes: [['冂', '人']], form: 'envolvente', mn: 'Una persona que entra en el marco: adentro.' },
  '句': { m: 'frase', on: ['ク'], kun: [], recipes: [['勹', '口']], form: 'envolvente', mn: 'Palabras envueltas por la boca: una frase.' },
  '旬': { m: 'temporada', on: ['ジュン', 'シュン'], kun: [], recipes: [['勹', '日']], form: 'envolvente', mn: 'Días envueltos juntos: la mejor temporada de algo.' },
  '杉': { m: 'cedro japonés', on: [], kun: ['すぎ'], recipes: [['木', '彡']], form: 'izquierda-derecha', mn: 'Un árbol con agujas finas como pelo: el cedro.' },
  '登': { m: 'subir', on: ['トウ', 'ト'], kun: ['のぼ(る)'], recipes: [['癶', '豆']], form: 'arriba-abajo', mn: 'Pasos sobre un pedestal alto: subir.' },
  // — Composición intermedia —
  '森': { m: 'bosque', on: ['シン'], kun: ['もり'], recipes: [['林', '木'], ['木', '木', '木']], form: 'arriba-abajo', mn: 'Tres árboles: tantos que es un bosque.' },
  '体': { m: 'cuerpo', on: ['タイ', 'テイ'], kun: ['からだ'], recipes: [['人', '本']], form: 'izquierda-derecha', note: '人 aparece como 亻', mn: 'Una persona y su origen: el cuerpo.' },
  '焚': { m: 'quemar', on: ['フン'], kun: ['た(く)'], recipes: [['林', '火']], form: 'arriba-abajo', mn: 'Fuego bajo la arboleda: quemar leña.' },
  '盟': { m: 'alianza', on: ['メイ'], kun: [], recipes: [['明', '皿']], form: 'arriba-abajo', mn: 'Una promesa brillante sellada sobre un plato.' },
  '枯': { m: 'marchitarse', on: ['コ'], kun: ['か(れる)'], recipes: [['木', '古']], form: 'izquierda-derecha', mn: 'Un árbol muy antiguo se marchita.' },
  '想': { m: 'imaginar', on: ['ソウ', 'ソ'], kun: [], recipes: [['相', '心']], form: 'arriba-abajo', mn: 'Mirar con el corazón: imaginar.' },
  '案': { m: 'plan · propuesta', on: ['アン'], kun: [], recipes: [['安', '木']], form: 'arriba-abajo', mn: 'Una mesa de madera en la casa tranquila: ahí se hacen los planes.' },
  '視': { m: 'mirar con atención', on: ['シ'], kun: [], recipes: [['示', '見']], form: 'izquierda-derecha', note: '示 aparece como 礻', mn: 'Mirar el altar con mucha atención.' },
  '故': { m: 'razón · difunto', on: ['コ'], kun: ['ゆえ'], recipes: [['古', '攵']], form: 'izquierda-derecha', mn: 'Golpear algo antiguo para buscar la razón de las cosas.' },
  '運': { m: 'transportar · suerte', on: ['ウン'], kun: ['はこ(ぶ)'], recipes: [['軍', '辶']], form: 'envolvente', mn: 'El ejército avanza por el camino: transportar.' },
  '症': { m: 'síntoma', on: ['ショウ'], kun: [], recipes: [['疒', '正']], form: 'envolvente', mn: 'Una enfermedad que se muestra tal cual es: un síntoma.' },
  '待': { m: 'esperar', on: ['タイ'], kun: ['ま(つ)'], recipes: [['彳', '寺']], form: 'izquierda-derecha', mn: 'Ir hasta el templo y quedarse: esperar.' },
  '持': { m: 'tener · sostener', on: ['ジ'], kun: ['も(つ)'], recipes: [['手', '寺']], form: 'izquierda-derecha', note: '手 aparece como 扌', mn: 'Una mano que sostiene algo del templo: tener.' },
  '時': { m: 'tiempo · hora', on: ['ジ'], kun: ['とき'], recipes: [['日', '寺']], form: 'izquierda-derecha', mn: 'El sol sobre el templo marca la hora.' },
  '居': { m: 'residir', on: ['キョ'], kun: ['い(る)'], recipes: [['尸', '古']], form: 'envolvente', mn: 'Un cuerpo que vive en el mismo lugar desde hace mucho: residir.' },
  '延': { m: 'extender', on: ['エン'], kun: ['の(びる)'], recipes: [['正', '廴']], form: 'envolvente', note: 'en KanjiVG la parte izquierda figura como 正', mn: 'Seguir el camino largo sin detenerse: extender.' },
  '喿': { m: 'piar de pájaros', on: ['ソウ'], kun: [], recipes: [['品', '木']], form: 'arriba-abajo', note: 'carácter componente, casi no se usa solo', mn: 'Tres bocas sobre un árbol: pájaros cantando en las ramas.' },
  '禁': { m: 'prohibir', on: ['キン'], kun: [], recipes: [['林', '示']], form: 'arriba-abajo', mn: 'Una arboleda sagrada sobre un altar: está prohibido entrar.' },
  '意': { m: 'intención · mente', on: ['イ'], kun: [], recipes: [['音', '心']], form: 'arriba-abajo', mn: 'El sonido del corazón: lo que querés decir.' },
  '薪': { m: 'leña', on: ['シン'], kun: ['たきぎ'], recipes: [['艸', '新']], form: 'arriba-abajo', note: '艸 aparece como 艹', mn: 'Hierba sobre madera recién cortada: leña.' },
  // — Composición compleja (nivel 4) —
  '操': { m: 'manejar', on: ['ソウ'], kun: ['あやつ(る)', 'みさお'], recipes: [['手', '喿']], form: 'izquierda-derecha', note: '手 aparece como 扌', mn: 'Una mano que controla el alboroto de los pájaros: manejar.' },
  '燥': { m: 'secar', on: ['ソウ'], kun: [], recipes: [['火', '喿']], form: 'izquierda-derecha', mn: 'Fuego junto al árbol de los pájaros: todo se seca.' },
  '繰': { m: 'devanar · enrollar', on: ['ソウ'], kun: ['く(る)'], recipes: [['糸', '喿']], form: 'izquierda-derecha', mn: 'Hilo que se enrolla al ritmo del canto de los pájaros.' },
  '澡': { m: 'lavar', on: ['ソウ'], kun: [], recipes: [['水', '喿']], form: 'izquierda-derecha', note: '水 aparece como 氵 · carácter poco común', mn: 'Agua para lavar el árbol ruidoso.' },
  '襟': { m: 'cuello (de ropa)', on: ['キン'], kun: ['えり'], recipes: [['衣', '禁']], form: 'izquierda-derecha', note: '衣 aparece como 衤', mn: 'La parte de la ropa que nadie toca: el cuello.' },
  '億': { m: 'cien millones', on: ['オク'], kun: [], recipes: [['人', '意']], form: 'izquierda-derecha', note: '人 aparece como 亻', mn: 'Una persona con incontables ideas: cien millones.' },
  '憶': { m: 'recordar', on: ['オク'], kun: [], recipes: [['心', '意']], form: 'izquierda-derecha', note: '心 aparece como 忄', mn: 'Un corazón que guarda una idea: recordar.' },
  // — Composición avanzada (nivel 5) —
  '藻': { m: 'alga', on: ['ソウ'], kun: ['も'], recipes: [['艸', '澡']], form: 'arriba-abajo', note: '艸 aparece como 艹', mn: 'La hierba que vive en el agua: un alga.' },
};

export const WORDS = [
  ['森林', 'しんりん', 'bosque'], ['休日', 'きゅうじつ', 'día libre'], ['日本', 'にほん', 'Japón'],
  ['本日', 'ほんじつ', 'hoy'], ['明日', 'あした', 'mañana'], ['月日', 'つきひ', 'el tiempo'],
  ['男子', 'だんし', 'chico'], ['女子', 'じょし', 'chica'], ['火力', 'かりょく', 'potencia de fuego'],
  ['一日', 'いちにち', 'un día'], ['人力', 'じんりき', 'fuerza humana'], ['明月', 'めいげつ', 'luna llena'],
  ['人生', 'じんせい', 'la vida'], ['一生', 'いっしょう', 'toda la vida'], ['明星', 'みょうじょう', 'lucero'],
  ['本心', 'ほんしん', 'verdadero sentir'], ['人体', 'じんたい', 'cuerpo humano'], ['体力', 'たいりょく', 'resistencia física'],
  ['木目', 'もくめ', 'veta de la madera'], ['人目', 'ひとめ', 'la mirada ajena'], ['十日', 'とおか', 'día diez'],
  ['十人', 'じゅうにん', 'diez personas'], ['人口', 'じんこう', 'población'], ['火口', 'かこう', 'cráter'],
  ['古木', 'こぼく', 'árbol viejo'], ['古本', 'ふるほん', 'libro usado'], ['思想', 'しそう', 'ideología'],
  ['一旦', 'いったん', 'por un momento'], ['一品', 'いっぴん', 'un plato'], ['生木', 'なまき', 'madera verde'],
  ['一体', 'いったい', 'un solo cuerpo'], ['口火', 'くちび', 'chispa inicial'],
  ['水田', 'すいでん', 'arrozal inundado'], ['手本', 'てほん', 'modelo / ejemplo'], ['新人', 'しんじん', 'novato'],
  ['本音', 'ほんね', 'verdadera intención'], ['一億', 'いちおく', 'cien millones'], ['人手', 'ひとで', 'mano de obra'],
  ['安心', 'あんしん', 'tranquilidad'], ['見本', 'みほん', 'muestra'], ['一枚', 'いちまい', 'una hoja'], ['故人', 'こじん', 'el difunto'],
  ['一時', 'いちじ', 'la una / un momento'], ['同時', 'どうじ', 'al mismo tiempo'], ['内心', 'ないしん', 'en el fondo'],
  ['毛糸', 'けいと', 'lana'], ['土木', 'どぼく', 'obras públicas'], ['正月', 'しょうがつ', 'Año Nuevo'],
  ['水力', 'すいりょく', 'fuerza hidráulica'], ['新月', 'しんげつ', 'luna nueva'], ['木立', 'こだち', 'arboleda'],
];

export const ELEMENTS = {
  wood: ['#7ccf6a', '#3f8f3a', 'Madera'], sun: ['#ffcb47', '#d98b12', 'Sol'], moon: ['#8f9cff', '#4b55b8', 'Luna'],
  fire: ['#ff7a52', '#c33d22', 'Fuego'], person: ['#f5c9a1', '#c98552', 'Gente'], earth: ['#d39a62', '#8a5a2e', 'Tierra'],
  power: ['#ffa94d', '#c76a10', 'Fuerza'], heart: ['#ff98bf', '#c9497b', 'Corazón'], sky: ['#7fd6f2', '#2f93b8', 'Cielo'],
  void: ['#efe9dd', '#a69c88', 'Vacío'], voice: ['#5fd6c0', '#1f8f7d', 'Voz'], metal: ['#c9d3de', '#6b7a8c', 'Metal'],
  eye: ['#c49bff', '#7646c2', 'Visión'], life: ['#b8ef7a', '#5c9a24', 'Vida'],
  water: ['#6cc4ff', '#2a6fb0', 'Agua'], thread: ['#e6b8ff', '#8a4fc2', 'Hilo'], spirit: ['#fff0b8', '#c9a020', 'Espíritu'],
};

// daily: exploraciones por día en cada región (se renuevan cada día)
export const REGIONS = [
  { id: 'forest', name: '森の小道', es: 'Sendero del bosque', secs: 45, drops: ['木', '人', '一'], need: 0, daily: 6, bg: ['#2f6b4a', '#a7d68a'] },
  { id: 'hill', name: '日月の丘', es: 'Colina del sol y la luna', secs: 120, drops: ['日', '月', '子'], need: 3, daily: 5, bg: ['#3b3f8f', '#ffcf7a'] },
  { id: 'valley', name: '火の谷', es: 'Valle de fuego', secs: 240, drops: ['火', '田', '力', '女'], need: 6, daily: 4, bg: ['#7a2420', '#ffae5e'] },
  { id: 'spring', name: '心の泉', es: 'Manantial del corazón', secs: 360, drops: ['口', '目', '心'], need: 10, daily: 4, bg: ['#1f6f8b', '#9fe8d8'] },
  { id: 'post', name: '宿場町', es: 'Pueblo de posta', secs: 300, drops: ['車', '止', '土', '寸'], need: 12, daily: 4, bg: ['#6b4a2a', '#f0c27a'] },
  { id: 'ruins', name: '古の遺跡', es: 'Ruinas antiguas', secs: 480, drops: ['十', '生', '皿', '立', '斤'], need: 15, daily: 3, bg: ['#4a3b2a', '#d9b77a'] },
  { id: 'ranch', name: '豆の野', es: 'Pradera de los porotos', secs: 420, drops: ['皮', '毛', '豆'], need: 18, daily: 3, bg: ['#4f6b2a', '#d6e88a'] },
  { id: 'lake', name: '水の里', es: 'Aldea del agua', secs: 600, drops: ['水', '艸', '糸'], need: 22, daily: 3, bg: ['#1e4f7a', '#7fd6f2'] },
  { id: 'shrine', name: '禁の社', es: 'Templo prohibido', secs: 720, drops: ['手', '衣', '示'], need: 30, daily: 3, bg: ['#5a1f2e', '#e8a0b0'] },
];

export const DECOR = [
  { id: 'lantern', k: '灯', name: 'Farol de piedra', cost: 30, desc: '+10% EXP al entrenar' },
  { id: 'pond', k: '池', name: 'Estanque', cost: 50, desc: 'El ánimo baja a la mitad de velocidad' },
  { id: 'gate', k: '門', name: 'Portal torii', cost: 80, desc: 'Expediciones un 25% más rápidas' },
  { id: 'bell', k: '鐘', name: 'Campana del templo', cost: 120, desc: '+1 墨 por cada repaso acertado' },
];

// Espacio del santuario: cada ampliación suma 3 espacios
export const BASE_CAP = 6, CAP_STEP = 3;
export const EXPANSIONS = [40, 90, 160, 260, 400, 600];

// Repetición espaciada (cajas de Leitner), en horas
export const SRS_HOURS = [0, 8, 24, 72, 168, 384, 840];

// Piezas 部品: componentes que no son criaturas. Se usan como accesorios para evolucionar y fusionar.
// Para el nivel KANJŪ cuentan como nivel 1 (componentes fundamentales).
export const PIECES = {
  '宀': { name: 'うかんむり', rom: 'ukanmuri', m: 'techo', cost: 40, mn: 'El techo de una casa: lo que está debajo está protegido.', ex: '字 安 案' },
  '儿': { name: 'ひとあし', rom: 'hitoashi', m: 'piernas', cost: 40, mn: 'Dos piernas que caminan: algo que se mueve.', ex: '見 兄 視' },
  '攵': { name: 'のぶん', rom: 'nobun', m: 'golpear · actuar', cost: 45, mn: 'Una mano con un palo: hacer algo con fuerza.', ex: '枚 故' },
  '辶': { name: 'しんにょう', rom: 'shinnyō', m: 'camino · avanzar', cost: 45, mn: 'Un camino que avanza por debajo: moverse.', ex: '近 連 運' },
  '广': { name: 'まだれ', rom: 'madare', m: 'techo abierto', cost: 40, mn: 'Un techo apoyado de un solo lado: un cobertizo.', ex: '床' },
  '亠': { name: 'なべぶた', rom: 'nabebuta', m: 'tapa', cost: 35, mn: 'La tapa de una olla.', ex: '享' },
  '冖': { name: 'わかんむり', rom: 'wakanmuri', m: 'cubierta', cost: 40, mn: 'Una tela que cubre algo desde arriba.', ex: '軍 運' },
  '疒': { name: 'やまいだれ', rom: 'yamaidare', m: 'enfermedad', cost: 45, mn: 'Una cama de enfermo apoyada contra la pared.', ex: '疲 症' },
  '彳': { name: 'ぎょうにんべん', rom: 'gyōninben', m: 'ir · paso', cost: 40, mn: 'Una persona que da pasos por la calle.', ex: '待' },
  '尸': { name: 'しかばね', rom: 'shikabane', m: 'cuerpo', cost: 40, mn: 'Un cuerpo recostado visto de costado.', ex: '居 尾' },
  '厂': { name: 'がんだれ', rom: 'gandare', m: 'acantilado', cost: 40, mn: 'Una roca que sobresale como un alero.', ex: '圧 厚' },
  '冂': { name: 'けいがまえ', rom: 'keigamae', m: 'marco', cost: 40, mn: 'Un marco abierto por abajo.', ex: '同 内' },
  '勹': { name: 'つつみがまえ', rom: 'tsutsumigamae', m: 'envolver', cost: 40, mn: 'Un brazo que rodea y envuelve.', ex: '句 旬' },
  '彡': { name: 'さんづくり', rom: 'sanzukuri', m: 'pelo · adorno', cost: 35, mn: 'Tres trazos como mechones de pelo.', ex: '杉' },
  '癶': { name: 'はつがしら', rom: 'hatsugashira', m: 'pasos', cost: 45, mn: 'Dos pies que se separan para dar un paso.', ex: '登' },
  '廴': { name: 'えんにょう', rom: 'ennyō', m: 'camino largo', cost: 45, mn: 'Un camino que se estira a lo lejos.', ex: '延' },
};
export const isPiece = k => k in PIECES;

const memo = {};
export function depth(k) {
  if (k in memo) return memo[k];
  const r = KANJI[k]?.recipes;
  return (memo[k] = r ? 1 + Math.max(...r[0].map(depth)) : 0);
}
export const kLevel = k => Math.min(5, depth(k) + 1);
// Espacios que ocupa una criatura: crecen con su nivel KANJŪ
export const size = k => kLevel(k);

export function element(k) {
  const d = KANJI[k];
  return d.el || element(d.recipes[0].find(p => !isPiece(p)));
}
export function roots(k) {
  if (isPiece(k)) return [];
  const r = KANJI[k].recipes;
  return r ? r[0].flatMap(roots) : [k];
}
export function evolutionsOf(k) {
  return Object.keys(KANJI).filter(c => KANJI[c].recipes?.some(r => r.includes(k)));
}
// Balance validado con simulación de 30 días (ver docs/ECONOMIA.md)
export const evoLevel = c => 5 + (depth(c) - 1) * 3;
// Maestría mínima de los componentes para evolucionar o fusionar: obliga a repasar en días distintos
export const learnGate = c => depth(c) <= 1 ? 2 : depth(c) + 2;
export const MAX_LV = 15;
export const reads = k => [...KANJI[k].on, ...KANJI[k].kun];
export const plain = r => r.replace(/[()]/g, '');
