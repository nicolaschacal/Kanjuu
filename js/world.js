// Mundo del santuario: grilla, objetos, almacén, producción, rango, altar y calendario.
import { KANJI, REGIONS, kLevel, element } from './data.js';
import { S, addCreature, see, mastery } from './state.js';

// --- La isla: siempre básica; el jugador la decora y la agranda (3 niveles, como en Rebyters) ---
// Las criaturas ocupan casillas según su nivel (Nv1 1×1, Nv2 2×1, Nv3 2×2…). Cada nivel de isla tiene
// plazas para KANJŪ: cada uno ocupa tantas plazas como su grado (1–5) (un huevo, 1). Isla 5×5 = 5 plazas:
// cinco KANJŪ de nivel 1, o uno de nivel 3 y dos de nivel 1, etc. Los objetos tienen su propio tope.
export const ISLANDS = [
  { n: 5, mons: 5, objs: 12, cost: 0, rank: 1, name: 'Isla pequeña' },
  { n: 7, mons: 7, objs: 24, cost: 1500, rank: 4, name: 'Isla mediana' },
  { n: 9, mons: 9, objs: 40, cost: 5000, rank: 8, name: 'Isla grande' },
  { n: 12, mons: 12, objs: 64, cost: 12000, rank: 12, name: 'Isla amplia' },
  { n: 15, mons: 15, objs: 96, cost: 25000, rank: 16, name: 'Gran isla' },
];
export const island = () => ISLANDS[S.island || 0];
export const monCap = () => island().mons;
export const objCap = () => island().objs;
export const slot = it => it.egg ? 1 : kLevel(it.k);
export const shownMons = () => S.creatures.filter(c => c.pos).reduce((a, c) => a + slot(c), 0);
// ¿Entra este KANJŪ en las plazas de la isla? (si ya está colocado, no se cuenta dos veces)
export const monFits = it => shownMons() - (it.pos ? slot(it) : 0) + slot(it) <= monCap();
export const shownObjs = () => S.objs.filter(o => o.pos).length;
// 和 Armonía: cada objeto colocado suma belleza; la armonía sube la tinta de todo el santuario (+1% c/u, tope +60%)
export const harmony = () => S.objs.filter(o => o.pos).reduce((a, o) => a + (OBJS[o.t]?.har || 0) * (1 + (o.lv - 1) * .5), 0);
export const harmonyMult = () => 1 + Math.min(.6, harmony() * .01);
export function syncGrid() {
  S.cols = S.rows = island().n;
  placed().forEach(it => { const [w, h] = foot(it), p = it.pos; if (p.x + w > S.cols || p.y + h > S.rows) it.pos = null; });
  let used = 0; S.creatures.filter(c => c.pos && !c.away).forEach(c => { used += slot(c); if (used > monCap()) { used -= slot(c); c.pos = null; } });
  S.objs.filter(o => o.pos).slice(objCap()).forEach(o => { o.pos = null; });
}
export function buyIsland() {
  const i = (S.island || 0) + 1, I = ISLANDS[i];
  if (!I) return 'max';
  if (S.rank.lv < I.rank) return 'rank';
  if (S.ink < I.cost) return 'ink';
  S.ink -= I.cost; S.island = i; syncGrid(); return 'ok';
}
export const COLS = 6, BASE_ROWS = 3; // (compatibilidad: el tamaño real está en S.cols/S.rows)
export const ROW_COSTS = [], ROW_RANK = [];
export const STORE_COSTS = [40, 90, 160, 260];
export const PROD_CAP_H = 6; // la producción se acumula hasta 6 h: nunca se pierde, solo se llena

// Objetos colocables. kind: prod (genera tinta), aura (afecta vecinos), global (afecta todo)
export const OBJS = {
  suzuri: { k: '硯', name: 'Piedra de tinta', w: 1, h: 1, cost: 40, rank: 1, kind: 'prod', col: '#3a3f4b', desc: 'Produce 5 墨/h por nivel' },
  lantern: { k: '灯', name: 'Farol de piedra', w: 1, h: 1, cost: 50, rank: 1, kind: 'aura', col: '#b9a88a', desc: 'Vecinos: +15% EXP por nivel' },
  pine: { k: '松', name: 'Pino sagrado', w: 1, h: 1, cost: 60, rank: 2, kind: 'aura', col: '#3f8f3a', desc: 'Vecinos de Madera y Vida: +40% 墨 por nivel' },
  pond: { k: '池', name: 'Estanque', w: 2, h: 1, cost: 90, rank: 3, kind: 'aura', col: '#4aa3c9', desc: 'Vecinos: +12% 墨 por nivel y siempre contentos' },
  shrine: { k: '祠', name: 'Santuario menor', w: 2, h: 2, cost: 200, rank: 4, kind: 'aura', col: '#e8503a', desc: 'Vecinos: +25% 墨 por nivel' },
  bell: { k: '鐘', name: 'Campana del templo', w: 1, h: 1, cost: 120, rank: 3, kind: 'global', col: '#c78f12', desc: '+1 墨 por acierto en el Dojo, por nivel' },
  torii: { k: '門', name: 'Portal torii', w: 2, h: 1, cost: 150, rank: 5, kind: 'global', col: '#d9442f', desc: 'Viajes −10% de tiempo por nivel' },
  brazier: { k: '炉', name: 'Brasero', w: 1, h: 1, cost: 70, rank: 2, kind: 'aura', col: '#c33d22', desc: 'Vecinos de Fuego y Sol: +40% 墨 por nivel' },
  // Decoración: no tiene efecto propio, suma 和 Armonía (más tinta en todo el santuario)
  stone: { k: '石', name: 'Camino de piedra', w: 1, h: 1, cost: 15, rank: 1, kind: 'decor', col: '#B3AB98', desc: 'Losas para armar caminos' },
  rock: { k: '岩', name: 'Roca musgosa', w: 1, h: 1, cost: 20, rank: 1, kind: 'decor', col: '#8E8778', desc: 'Piedra con musgo' },
  shrub: { k: '叢', name: 'Arbusto', w: 1, h: 1, cost: 25, rank: 1, kind: 'decor', col: '#4E8F4A', desc: 'Verde y redondo' },
  flowers: { k: '花', name: 'Cantero de flores', w: 1, h: 1, cost: 30, rank: 1, kind: 'decor', col: '#F4A7B9', desc: 'Flores blancas, rosas y amarillas' },
  fence: { k: '柵', name: 'Cerca de madera', w: 1, h: 1, cost: 20, rank: 1, kind: 'decor', col: '#7A4E32', desc: 'Para delimitar zonas' },
  banner: { k: '幟', name: 'Estandarte', w: 1, h: 1, cost: 35, rank: 2, kind: 'decor', col: '#2A2F5A', desc: 'Nobori con el emblema 漢獣' },
  bamboo: { k: '竹', name: 'Bambú', w: 1, h: 1, cost: 40, rank: 2, kind: 'decor', col: '#7FB04A', desc: 'Un macizo de cañas' },
  tree: { k: '樹', name: 'Árbol', w: 1, h: 1, cost: 55, rank: 2, kind: 'decor', col: '#3F7A45', desc: 'Copa frondosa' },
  altar: { k: '壇', name: 'Altar de incienso', w: 1, h: 1, cost: 80, rank: 3, kind: 'decor', col: '#A9A292', desc: 'Un hokora con humo de incienso' },
  house: { k: '家', name: 'Casita', w: 2, h: 2, cost: 260, rank: 5, kind: 'decor', col: '#C9A27A', desc: 'Una casa con la ventana encendida' },
  sakura: { k: '桜', name: 'Cerezo', w: 2, h: 2, cost: 240, rank: 6, kind: 'decor', col: '#F4A7B9', desc: 'Suelta pétalos sobre el santuario' },
  pagoda: { k: '塔', name: 'Pagoda', w: 2, h: 2, cost: 700, rank: 9, kind: 'decor', col: '#B8392A', desc: 'Cinco techos: el orgullo de la aldea' },
  // Santuario de papel: adornos de templo y edificios japoneses
  chochin: { k: '提', name: 'Chōchin', w: 1, h: 1, cost: 45, rank: 2, kind: 'decor', col: '#D9533B', desc: 'Farolillo de papel: se enciende de noche' },
  ema: { k: '絵', name: 'Ema', w: 1, h: 1, cost: 60, rank: 2, kind: 'decor', col: '#E8D2A6', desc: 'Tablillas de deseos' },
  komainu: { k: '狛', name: 'Komainu', w: 1, h: 1, cost: 90, rank: 3, kind: 'decor', col: '#B9B4A8', desc: 'Guardián de piedra del templo' },
  refugio: { k: '庵', name: 'Refugio', w: 1, h: 1, cost: 110, rank: 3, kind: 'decor', col: '#87603F', desc: 'Tus KANJŪ se cubren aquí cuando llueve' },
  bridge: { k: '橋', name: 'Puente', w: 2, h: 2, cost: 160, rank: 3, kind: 'decor', col: '#C8412E', desc: 'Puente rojo: cruza el agua de punta a punta', water: true },
  sacred: { k: '磐', name: 'Roca sagrada', w: 1, h: 1, cost: 120, rank: 4, kind: 'decor', col: '#8E897F', desc: 'Roca con su cuerda shimenawa' },
  teahouse: { k: '茶', name: 'Casa de té', w: 1, h: 1, cost: 180, rank: 4, kind: 'decor', col: '#D9C9A8', desc: 'Pequeña, con ventana redonda' },
  temple: { k: '寺', name: 'Templo', w: 2, h: 2, cost: 520, rank: 7, kind: 'decor', col: '#3E4A52', desc: 'Salón principal con frontón curvo' },
  castle: { k: '城', name: 'Castillo', w: 3, h: 3, cost: 1500, rank: 10, kind: 'decor', col: '#4E8C82', desc: 'Torre de cinco pisos estilo Osaka' },
  zoo: { k: '園', name: 'Zoo', w: 2, h: 2, cost: 600, rank: 4, kind: 'decor', col: '#B79A5E', desc: 'Hogar de tus KANJŪ animales: no ocupan casillas de la isla' },
};
// Recorte de papel que dibuja cada objeto en el santuario (paper.js). flat: va acostado en el suelo
const ART = { suzuri: 'suzuri', lantern: 'farol', pine: 'pino', pond: 'estanque', shrine: 'templo', bell: 'campana', torii: 'torii', brazier: 'brasero', stone: 'losa', rock: 'roca', shrub: 'arbusto', flowers: 'flores', fence: 'cerca', banner: 'nobori', bamboo: 'bambu', tree: 'arbol', altar: 'incienso', house: 'minka', sakura: 'cerezo', pagoda: 'pagoda', chochin: 'chochin', ema: 'ema', komainu: 'komainu', refugio: 'refugio', bridge: 'puente', sacred: 'sagrada', teahouse: 'casate', temple: 'templo', castle: 'castillo', zoo: 'zoo' };
Object.entries(ART).forEach(([t, a]) => OBJS[t].art = a);
OBJS.pond.flat = OBJS.stone.flat = true; OBJS.pond.water = true; OBJS.rock.water = true;
OBJS.stone.hide = true;
// Categorías de la Tienda y la Mochila (lo que no está en ninguna es Decoración)
export const CATS = { deco: 'Decoración', nat: 'Naturaleza', luz: 'Luces', edif: 'Edificios' };
Object.entries({ nat: 'pine pond rock shrub flowers bamboo tree sakura sacred', luz: 'lantern brazier chochin altar', edif: 'shrine bell torii house pagoda refugio bridge teahouse temple castle zoo' })
  .forEach(([c, l]) => l.split(' ').forEach(t => OBJS[t].cat = c));
Object.values(OBJS).forEach(d => d.cat ??= 'deco');
// Efecto en dos líneas para la ficha de compra
const EFF = { suzuri: ['+5 墨/h', 'producción'], lantern: ['+15%', 'EXP a vecinos'], pine: ['+40% 墨', 'Madera y Vida'], pond: ['+12% 墨', 'a vecinos'], shrine: ['+25% 墨', 'a vecinos'], bell: ['+1 墨', 'por acierto'], torii: ['−10%', 'tiempo de viaje'], brazier: ['+40% 墨', 'Fuego y Sol'], chochin: ['De noche', 'se enciende'], refugio: ['Refugio', 'para la lluvia'], sakura: ['Pétalos', 'sobre la isla'], altar: ['Incienso', 'humo de templo'] };
export const objEff = t => EFF[t] || ['Adorno', 'decoración']; // los caminos ahora se pintan como casillas en el editor

// Armonía que aporta cada objeto (los edificios también embellecen)
Object.entries({ suzuri: 2, lantern: 3, pine: 3, pond: 5, shrine: 10, bell: 4, torii: 6, brazier: 3, stone: 1, rock: 1, shrub: 1, flowers: 2, fence: 1, banner: 2, bamboo: 2, tree: 3, altar: 4, house: 9, sakura: 9, pagoda: 18, chochin: 2, ema: 2, komainu: 3, refugio: 3, bridge: 4, sacred: 4, teahouse: 5, temple: 12, castle: 25 }).forEach(([t, h]) => OBJS[t].har = h);
export const OBJ_MAX = 5;
export const upCost = o => Math.round(OBJS[o.t].cost * o.lv * 1.6);
// Cada copia del mismo objeto cuesta 50% más
export const objCost = t => Math.round(OBJS[t].cost * (OBJS[t].kind === 'decor' ? 1.12 : 1.5) ** S.objs.filter(o => o.t === t).length);

const uid = () => Math.random().toString(36).slice(2, 9);
export const rows = () => S.rows;

// --- Suelo de la isla (editor de Construir): tipo de casilla, altura 0–3 y rampa ---
export const GROUNDS = {
  grass: { n: 'Pasto', c: '#8DBF5E' }, moss: { n: 'Musgo', c: '#5F9447' }, dirt: { n: 'Tierra', c: '#B98D5A' },
  sand: { n: 'Arena', c: '#E2CE97' }, slate: { n: 'Losa', c: '#AAA59B' }, snow: { n: 'Nieve', c: '#F3F0EA' }, water: { n: 'Agua', c: '#5AA5D2' },
};
export const tileAt = (x, y) => ({ g: 'grass', h: 0, r: null, ...(S.tiles?.[x + ',' + y] || {}) });
function putTile(x, y, t) {
  const k = x + ',' + y; S.tiles ??= {};
  if (t.g === 'grass' && !t.h && !t.r) delete S.tiles[k]; else S.tiles[k] = { g: t.g, h: t.h || 0, ...(t.r ? { r: t.r } : {}) };
}
export const isWater = (x, y) => tileAt(x, y).g === 'water';
export const itemOn = (x, y) => placed().find(it => { const [w, h] = foot(it), p = it.pos; return x >= p.x && x < p.x + w && y >= p.y && y < p.y + h; });
// Cada acción devuelve un texto de error o null
export function paintTile(x, y, g) {
  const t = tileAt(x, y); if (t.g === g) return null;
  const it = itemOn(x, y);
  if (g === 'water' && it && !it.t) return 'Mové primero al KANJŪ: no nadan';
  if (g === 'water' && it?.t && !OBJS[it.t].water) return 'Quitá el objeto antes de hacer agua';
  t.g = g; if (g === 'water') t.r = null; putTile(x, y, t); return null;
}
export function raiseTile(x, y) {
  const t = tileAt(x, y); if (t.g === 'water') return 'Para subir el agua usá Cascada';
  t.h = (t.h + 1) % 4; t.r = null; putTile(x, y, t); return null;
}
export function cascadeTile(x, y) {
  const t = tileAt(x, y); if (t.g !== 'water') return 'Tocá una casilla de agua';
  t.h = (t.h + 1) % 4; putTile(x, y, t); return null;
}
export function rampTile(x, y) {
  const t = tileAt(x, y); if (t.g === 'water') return 'No hay rampas en el agua';
  const dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]].filter(([dx, dy]) => { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= S.cols || ny >= S.rows) return false; const n = tileAt(nx, ny); return n.g !== 'water' && n.h === t.h + 1; });
  if (!dirs.length) { if (t.r) { t.r = null; putTile(x, y, t); return null; } return 'La rampa va al lado de una casilla un nivel más alta'; }
  const i = t.r ? dirs.findIndex(d => d[0] === t.r[0] && d[1] === t.r[1]) + 1 : 0;
  t.r = i >= dirs.length ? null : dirs[i]; putTile(x, y, t); return null;
}

// --- Lluvia: cada 3 horas hay una chance de chaparrón de 25 a 55 minutos (igual para todos ese día) ---
const rnd01 = n => { const v = Math.sin(n * 127.1 + 311.7) * 43758.5453; return v - Math.floor(v); };
export function rainAt(ms = Date.now()) {
  const q = new URLSearchParams(location.search).get('lluvia'); if (q !== null) return q !== '0';
  const d = new Date(ms), day = d.getFullYear() * 400 + d.getMonth() * 32 + d.getDate();
  const hr = d.getHours() + d.getMinutes() / 60, block = Math.floor(hr / 3), seed = day * 8 + block;
  if (rnd01(seed) > .3) return false;
  const start = block * 3 + rnd01(seed + .5) * 2.2, len = (25 + rnd01(seed + .9) * 30) / 60;
  return hr >= start && hr < start + len;
}
export const raining = () => rainAt();

export function foot(it) {
  if (it.t) return [OBJS[it.t].w, OBJS[it.t].h];
  if (it.egg) return [1, 1];
  const L = kLevel(it.k); return [[1, 1], [2, 1], [2, 2], [3, 2], [3, 3]][L - 1];
}
export const placed = () => [...S.creatures.filter(c => c.pos), ...S.objs.filter(o => o.pos)];
export const tilesUsed = () => placed().reduce((a, it) => { const [w, h] = foot(it); return a + w * h; }, 0);
export const tilesTotal = () => S.cols * S.rows;

export function fits(w, h, x, y, ignore) {
  if (x < 0 || y < 0 || x + w > S.cols || y + h > S.rows) return false;
  const floats = !!(ignore?.t && OBJS[ignore.t].water);
  if (!floats) for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (isWater(x + i, y + j)) return false;
  return !placed().some(it => {
    if (it === ignore) return false;
    const [W, H] = foot(it), p = it.pos;
    return x < p.x + W && x + w > p.x && y < p.y + H && y + h > p.y;
  });
}
// Busca lugar libre repartiendo: elige la casilla más lejos de lo que ya está (distribución orgánica)
export function findSpot(w, h, ignore) {
  const others = placed().filter(it => it !== ignore).map(it => { const [W, H] = foot(it); return [it.pos.x + W / 2, it.pos.y + H / 2]; });
  let best = null, score = -1;
  for (let y = 0; y < S.rows; y++) for (let x = 0; x < S.cols; x++) {
    if (!fits(w, h, x, y, ignore)) continue;
    const cx = x + w / 2, cy = y + h / 2;
    const d = others.length ? Math.min(...others.map(([ox, oy]) => Math.hypot(ox - cx, (oy - cy) * 1.2))) : 10 - Math.hypot(cx - S.cols / 2, cy - S.rows / 2);
    if (d > score + 1e-6) { score = d; best = { x, y }; }
  }
  return best;
}
// Coloca en la grilla; si no entra, al almacén; si el almacén está lleno, a la puerta
export function settle(it, prefer) {
  const [w, h] = foot(it);
  if (!it.pos && (it.t ? shownObjs() >= objCap() : !monFits(it))) { it.pos = null; return 'store'; } // topes de la isla
  if (prefer && fits(w, h, prefer.x, prefer.y, it)) { it.pos = { ...prefer }; return 'grid'; }
  if (it.pos && fits(w, h, it.pos.x, it.pos.y, it)) return 'grid';
  const s = findSpot(w, h, it);
  if (s) { it.pos = s; return 'grid'; }
  it.pos = null;
  return 'store';
}
export const stored = () => [...S.creatures.filter(c => !c.pos && !c.away), ...S.objs.filter(o => !o.pos)];
export const storeFree = () => S.storeCap - S.creatures.filter(c => !c.pos && !c.away).length; // el almacén limita KANJŪ; los objetos no ocupan lugar

// Llega una criatura nueva al mundo
export function arrive(k, extra = {}) {
  if ((!findSpot(...foot({ k, ...extra })) || !monFits({ k, ...extra })) && storeFree() <= 0) { see(k); S.gate.push({ k, gold: !!extra.gold }); return { where: 'gate' }; }
  const c = addCreature(k, extra);
  const where = settle(c);
  return { c, where };
}
export function newObj(t) {
  const o = { id: uid(), t, lv: 1, prodAt: Date.now() };
  S.objs.push(o); settle(o); return o;
}
export const has = t => S.objs.some(o => o.t === t && o.pos);
const globalLv = t => S.objs.filter(o => o.t === t && o.pos).reduce((a, o) => a + o.lv, 0);
export const bellBonus = () => globalLv('bell');
export const tripMult = () => Math.max(.4, 1 - globalLv('torii') * .1);

// Objetos cuyo rectángulo + 1 casilla toca al ítem
export function neighbors(it) {
  if (!it.pos) return [];
  const [w, h] = foot(it), p = it.pos;
  return S.objs.filter(o => o.pos && o !== it && OBJS[o.t].kind === 'aura').filter(o => {
    const [W, H] = foot(o);
    return p.x - 1 < o.pos.x + W && p.x + w + 1 > o.pos.x && p.y - 1 < o.pos.y + H && p.y + h + 1 > o.pos.y;
  });
}
export function expBonus(c) {
  return 1 + neighbors(c).filter(o => o.t === 'lantern').reduce((a, o) => a + .15 * o.lv, 0);
}
export const calm = c => neighbors(c).some(o => o.t === 'pond');

// Tinta por hora de una criatura colocada
export function rate(c) {
  if (!c.pos || c.egg || c.away) return 0;
  const el = element(c.k);
  let r = (.8 + c.lv * .15 + mastery(c.k) * .5) * (1 + .5 * (kLevel(c.k) - 1));
  r *= (.5 + .5 * c.mood) * (1 + .2 * (c.stars || 0)) * (1 + .25 * c.gen) * (c.gold ? 1.5 : 1);
  let aura = 1;
  for (const o of neighbors(c)) {
    if (o.t === 'shrine') aura += .25 * o.lv;
    if (o.t === 'pond') aura += .12 * o.lv;
    if (o.t === 'pine' && (el === 'wood' || el === 'life')) aura += .4 * o.lv;
    if (o.t === 'brazier' && (el === 'fire' || el === 'sun')) aura += .4 * o.lv;
  }
  r *= aura;
  if (c.insp > Date.now()) r *= 2;
  return r * harmonyMult();
}
export const objRate = o => o.pos && o.t === 'suzuri' ? 5 * o.lv : 0;
export function pending(it) {
  const r = it.t ? objRate(it) : rate(it);
  if (!r) return 0;
  it.prodAt ??= Date.now();
  const h = Math.min(PROD_CAP_H, (Date.now() - it.prodAt) / 36e5);
  return Math.floor(r * h);
}
export const full = it => it.prodAt && (Date.now() - it.prodAt) / 36e5 >= PROD_CAP_H;
export function collect(it) {
  const n = pending(it); if (!n) return 0;
  const r = it.t ? objRate(it) : rate(it);
  it.prodAt = Math.min(Date.now(), it.prodAt + n / r * 36e5); // conserva la fracción
  if (Date.now() - it.prodAt > PROD_CAP_H * 36e5) it.prodAt = Date.now();
  S.ink += n; S.stats.collected = (S.stats.collected || 0) + n;
  return n;
}
export const totalPending = () => placed().reduce((a, it) => a + pending(it), 0);
export const totalRate = () => Math.round(placed().reduce((a, it) => a + (it.t ? objRate(it) : rate(it)), 0));

// --- Rango de guardián ---
export const rankNeed = r => 60 + r * r * 25;
export function addXP(n) {
  const R = S.rank; R.xp += Math.round(n); const ups = [];
  while (R.xp >= rankNeed(R.lv)) { R.xp -= rankNeed(R.lv); R.lv++; ups.push(R.lv); S.ink += 20 + R.lv * 10; S.tickets++; }
  return ups;
}

// --- Calendario de 7 días (avanza solo los días que entrás; nunca se reinicia) ---
export const LOGIN = [{ ink: 40 }, { tickets: 1 }, { ink: 80 }, { scroll: 2 }, { tickets: 2 }, { ink: 150 }, { tickets: 3, gold: 1 }];
export const today = () => new Date().toISOString().slice(0, 10);
export const loginReady = () => S.creatures.length && S.login.last !== today();
export function claimLogin() {
  const r = LOGIN[S.login.day % 7];
  if (r.ink) S.ink += r.ink;
  if (r.tickets) S.tickets += r.tickets;
  if (r.scroll) S.items.scroll = (S.items.scroll || 0) + r.scroll;
  if (r.gold) S.goldNext = true;
  S.login.day++; S.login.last = today();
  return r;
}

// --- Altar de invocación (solo tinta o boletos 札, nunca dinero) ---
export const PULL = 120, PULL10 = 1080, PITY = 10, GOLD_RATE = .04;
export function pullPool() {
  const n = Object.values(S.dex).filter(d => d.owned).length;
  return REGIONS.filter(r => n >= r.need).flatMap(r => r.drops);
}
export function pull(times) {
  const pool = pullPool(), out = [];
  for (let i = 0; i < times; i++) {
    const unowned = pool.filter(k => !S.dex[k]?.owned && !out.some(o => o.k === k));
    S.pity++;
    const forceNew = unowned.length && (S.pity >= PITY || (times === 10 && i === 9 && !out.some(o => o.isNew)));
    const k = forceNew || (unowned.length && Math.random() < .15) ? unowned[Math.random() * unowned.length | 0] : pool[Math.random() * pool.length | 0];
    const isNew = !S.dex[k]?.owned && !out.some(o => o.k === k);
    if (isNew) S.pity = 0;
    const gold = S.goldNext || Math.random() < GOLD_RATE; S.goldNext = false;
    if (gold) see(k), S.dex[k].gold = true;
    out.push({ k, isNew, gold, ...arrive(k, { egg: true, gold }) });
  }
  S.stats.pulls = (S.stats.pulls || 0) + times;
  return out;
}

// --- Despertar: un duplicado del mismo kanji suma una estrella ---
export const dupesOf = c => S.creatures.filter(x => x !== c && x.k === c.k && !x.away && !x.egg);
export function awaken(c) {
  const d = dupesOf(c).sort((a, b) => a.lv - b.lv)[0];
  if (!d || (c.stars || 0) >= 5) return false;
  S.creatures = S.creatures.filter(x => x !== d);
  c.stars = (c.stars || 0) + 1; c.gold ||= d.gold;
  return true;
}

// Migra partidas anteriores al sistema de grilla
export function initWorld() {
  S.rows ??= BASE_ROWS; S.objs ??= []; S.storeCap ??= 10; S.tickets ??= 1; S.pity ??= 0;
  S.rank ??= { lv: 1, xp: 0 }; S.login ??= { day: 0, last: '' }; S.tiles ??= {};
  S.gate = (S.gate || []).map(g => typeof g === 'string' ? { k: g } : g);
  if (S.deco?.length) { S.deco.forEach(t => OBJS[t] && newObj(t)); }
  delete S.deco; delete S.cap;
  if (!S.gridV) { S.creatures.forEach(c => c.pos === undefined && settle(c)); S.gridV = 1; }
  S.creatures.forEach(c => { c.pos ??= null; c.prodAt ??= Date.now(); });
  // v3: isla de 3 niveles. Lo que se había pagado en expansiones se devuelve en tinta.
  if (!S.islandV) { const paid = [60, 130, 220, 340, 500, 720, 1000].slice(0, Math.max(0, (S.rows || 3) - 3)).reduce((a, b) => a + b, 0) + (S.ext ? [150, 400].slice(0, S.ext).reduce((a, b) => a + b, 0) : 0); if (S.stageV) S.ink += [150, 400].slice(0, S.ext || 0).reduce((a, b) => a + b, 0); else S.ink += paid; S.island = 0; S.islandV = 1; delete S.ext; delete S.stageV; }
  syncGrid();
}
