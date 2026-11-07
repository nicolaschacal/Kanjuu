// Base de kanji del MVP. Solo composiciones ampliamente documentadas.
// recipes[0] es la composición canónica (define composition_depth).
export const KANJI = {
  '一': { m: 'uno', on: ['イチ'], kun: ['ひと'], el: 'void' },
  '木': { m: 'árbol', on: ['モク', 'ボク'], kun: ['き'], el: 'wood' },
  '人': { m: 'persona', on: ['ジン', 'ニン'], kun: ['ひと'], el: 'person' },
  '日': { m: 'sol · día', on: ['ニチ', 'ジツ'], kun: ['ひ'], el: 'sun' },
  '月': { m: 'luna · mes', on: ['ゲツ', 'ガツ'], kun: ['つき'], el: 'moon' },
  '火': { m: 'fuego', on: ['カ'], kun: ['ひ'], el: 'fire' },
  '田': { m: 'arrozal', on: ['デン'], kun: ['た'], el: 'earth' },
  '力': { m: 'fuerza', on: ['リョク', 'リキ'], kun: ['ちから'], el: 'power' },
  '女': { m: 'mujer', on: ['ジョ', 'ニョ'], kun: ['おんな'], el: 'heart' },
  '子': { m: 'niño', on: ['シ', 'ス'], kun: ['こ'], el: 'sky' },
  '林': { m: 'arboleda', on: ['リン'], kun: ['はやし'], recipes: [['木', '木']], form: 'izquierda-derecha' },
  '森': { m: 'bosque', on: ['シン'], kun: ['もり'], recipes: [['林', '木'], ['木', '木', '木']], form: 'arriba-abajo' },
  '休': { m: 'descansar', on: ['キュウ'], kun: ['やす(む)'], recipes: [['人', '木']], form: 'izquierda-derecha', note: '人 aparece como 亻 a la izquierda' },
  '本': { m: 'origen · libro', on: ['ホン'], kun: ['もと'], recipes: [['木', '一']], form: 'indicativo', note: 'un trazo marca la raíz del árbol' },
  '明': { m: 'brillante', on: ['メイ', 'ミョウ'], kun: ['あか(るい)'], recipes: [['日', '月']], form: 'izquierda-derecha' },
  '炎': { m: 'llama', on: ['エン'], kun: ['ほのお'], recipes: [['火', '火']], form: 'arriba-abajo' },
  '男': { m: 'hombre', on: ['ダン', 'ナン'], kun: ['おとこ'], recipes: [['田', '力']], form: 'arriba-abajo' },
  '好': { m: 'gustar', on: ['コウ'], kun: ['す(き)'], recipes: [['女', '子']], form: 'izquierda-derecha' },
};

export const WORDS = [
  ['森林', 'しんりん', 'bosque'], ['休日', 'きゅうじつ', 'día libre'], ['日本', 'にほん', 'Japón'],
  ['本日', 'ほんじつ', 'hoy'], ['明日', 'あした', 'mañana'], ['月日', 'つきひ', 'el tiempo'],
  ['男子', 'だんし', 'chico'], ['女子', 'じょし', 'chica'], ['火力', 'かりょく', 'potencia de fuego'],
  ['一日', 'いちにち', 'un día'], ['人力', 'じんりき', 'fuerza humana'], ['明月', 'めいげつ', 'luna llena'],
];

export const ELEMENTS = {
  wood: ['#7ccf6a', '#3f8f3a', 'Madera'], sun: ['#ffcb47', '#d98b12', 'Sol'], moon: ['#8f9cff', '#4b55b8', 'Luna'],
  fire: ['#ff7a52', '#c33d22', 'Fuego'], person: ['#f5c9a1', '#c98552', 'Gente'], earth: ['#d39a62', '#8a5a2e', 'Tierra'],
  power: ['#ffa94d', '#c76a10', 'Fuerza'], heart: ['#ff98bf', '#c9497b', 'Corazón'], sky: ['#7fd6f2', '#2f93b8', 'Cielo'],
  void: ['#efe9dd', '#a69c88', 'Vacío'],
};

export const REGIONS = [
  { id: 'forest', name: '森の小道', es: 'Sendero del bosque', secs: 45, drops: ['木', '人', '一'], need: 0, bg: ['#2f6b4a', '#a7d68a'] },
  { id: 'hill', name: '日月の丘', es: 'Colina del sol y la luna', secs: 120, drops: ['日', '月', '子'], need: 3, bg: ['#3b3f8f', '#ffcf7a'] },
  { id: 'valley', name: '火の谷', es: 'Valle de fuego', secs: 240, drops: ['火', '田', '力', '女'], need: 6, bg: ['#7a2420', '#ffae5e'] },
];

export const DECOR = [
  { id: 'lantern', k: '灯', name: 'Farol de piedra', cost: 30, desc: '+10% EXP al entrenar' },
  { id: 'pond', k: '池', name: 'Estanque', cost: 50, desc: 'Las criaturas se alegran más rápido' },
  { id: 'gate', k: '門', name: 'Portal torii', cost: 80, desc: 'Expediciones un 25% más rápidas' },
];

const memo = {};
export function depth(k) {
  if (k in memo) return memo[k];
  const r = KANJI[k]?.recipes;
  return (memo[k] = r ? 1 + Math.max(...r[0].map(depth)) : 0);
}
export const kLevel = k => Math.min(5, depth(k) + 1);

export function element(k) {
  const d = KANJI[k];
  return d.el || element(d.recipes[0][0]);
}
// Elementos de todas las raíces (para la silueta compuesta)
export function roots(k) {
  const r = KANJI[k].recipes;
  return r ? r[0].flatMap(roots) : [k];
}
// Kanji a los que k puede evolucionar (aparece en alguna receta)
export function evolutionsOf(k) {
  return Object.keys(KANJI).filter(c => KANJI[c].recipes?.some(r => r.includes(k)));
}
export const evoLevel = c => 4 + depth(c) * 3;
export const MAX_LV = 15;
