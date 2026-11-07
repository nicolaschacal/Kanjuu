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
  // — Composición intermedia —
  '森': { m: 'bosque', on: ['シン'], kun: ['もり'], recipes: [['林', '木'], ['木', '木', '木']], form: 'arriba-abajo', mn: 'Tres árboles: tantos que es un bosque.' },
  '体': { m: 'cuerpo', on: ['タイ', 'テイ'], kun: ['からだ'], recipes: [['人', '本']], form: 'izquierda-derecha', note: '人 aparece como 亻', mn: 'Una persona y su origen: el cuerpo.' },
  '焚': { m: 'quemar', on: ['フン'], kun: ['た(く)'], recipes: [['林', '火']], form: 'arriba-abajo', mn: 'Fuego bajo la arboleda: quemar leña.' },
  '盟': { m: 'alianza', on: ['メイ'], kun: [], recipes: [['明', '皿']], form: 'arriba-abajo', mn: 'Una promesa brillante sellada sobre un plato.' },
  '枯': { m: 'marchitarse', on: ['コ'], kun: ['か(れる)'], recipes: [['木', '古']], form: 'izquierda-derecha', mn: 'Un árbol muy antiguo se marchita.' },
  '想': { m: 'imaginar', on: ['ソウ', 'ソ'], kun: [], recipes: [['相', '心']], form: 'arriba-abajo', mn: 'Mirar con el corazón: imaginar.' },
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
];

export const ELEMENTS = {
  wood: ['#7ccf6a', '#3f8f3a', 'Madera'], sun: ['#ffcb47', '#d98b12', 'Sol'], moon: ['#8f9cff', '#4b55b8', 'Luna'],
  fire: ['#ff7a52', '#c33d22', 'Fuego'], person: ['#f5c9a1', '#c98552', 'Gente'], earth: ['#d39a62', '#8a5a2e', 'Tierra'],
  power: ['#ffa94d', '#c76a10', 'Fuerza'], heart: ['#ff98bf', '#c9497b', 'Corazón'], sky: ['#7fd6f2', '#2f93b8', 'Cielo'],
  void: ['#efe9dd', '#a69c88', 'Vacío'], voice: ['#5fd6c0', '#1f8f7d', 'Voz'], metal: ['#c9d3de', '#6b7a8c', 'Metal'],
  eye: ['#c49bff', '#7646c2', 'Visión'], life: ['#b8ef7a', '#5c9a24', 'Vida'],
};

export const REGIONS = [
  { id: 'forest', name: '森の小道', es: 'Sendero del bosque', secs: 45, drops: ['木', '人', '一'], need: 0, bg: ['#2f6b4a', '#a7d68a'] },
  { id: 'hill', name: '日月の丘', es: 'Colina del sol y la luna', secs: 120, drops: ['日', '月', '子'], need: 3, bg: ['#3b3f8f', '#ffcf7a'] },
  { id: 'valley', name: '火の谷', es: 'Valle de fuego', secs: 240, drops: ['火', '田', '力', '女'], need: 6, bg: ['#7a2420', '#ffae5e'] },
  { id: 'spring', name: '心の泉', es: 'Manantial del corazón', secs: 360, drops: ['口', '目', '心'], need: 10, bg: ['#1f6f8b', '#9fe8d8'] },
  { id: 'ruins', name: '古の遺跡', es: 'Ruinas antiguas', secs: 480, drops: ['十', '生', '皿'], need: 15, bg: ['#4a3b2a', '#d9b77a'] },
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
  return d.el || element(d.recipes[0][0]);
}
export function roots(k) {
  const r = KANJI[k].recipes;
  return r ? r[0].flatMap(roots) : [k];
}
export function evolutionsOf(k) {
  return Object.keys(KANJI).filter(c => KANJI[c].recipes?.some(r => r.includes(k)));
}
export const evoLevel = c => 4 + depth(c) * 3;
export const MAX_LV = 15;
export const reads = k => [...KANJI[k].on, ...KANJI[k].kun];
export const plain = r => r.replace(/[()]/g, '');
