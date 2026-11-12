// KANJŪ · art.js — Arte de las criaturas (estilo aprobado el 9 de noviembre de 2026, docs/arte/estilo.html).
// Cada kanji tiene su propia forma y muestra solo lo que significa; el kit aplica la firma: papel, pliegue,
// kanji a pincel, ojos de papel con pupila de píldora, broche dorado y marcas de grado.
import { KANJI, typeOf, kLevel } from './data.js';
const INK = '#1E1A24', W = '#FFFDF8', GOLD = '#F2B937', SHU = '#D8452F', PINK = '#F39AAE', MOUTH = '#7A2E3A', WOOD = '#8C6A4A', WOODL = '#B48A5E', GLOW = '#FFE9A6';
const T = {
  wood:  { k: '木', n: 'Madera', f: '#8DC063', d: '#4C8A3E', l: '#D6ECBB' },
  fire:  { k: '火', n: 'Fuego', f: '#F2825A', d: '#C2432A', l: '#FFD5C2' },
  earth: { k: '土', n: 'Tierra', f: '#D8A562', d: '#94612E', l: '#F2DAB2' },
  metal: { k: '金', n: 'Metal', f: '#C5D0DB', d: '#687A90', l: '#EFF3F7' },
  water: { k: '水', n: 'Agua', f: '#72B9E8', d: '#2D6EAD', l: '#CDE8F9' },
};

// ---------- Utilería de papel ----------
const P = (d, fill, sw = 3.2, extra = '') => `<path d="${d}" fill="${fill}" stroke="${W}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round" paint-order="stroke" ${extra}/>`;
const Ln = (d, c, w = 4.5, bw = 3.5) => (bw ? `<path class="k2-ln" d="${d}" fill="none" stroke="${W}" stroke-width="${w + bw}" stroke-linecap="round" stroke-linejoin="round"/>` : '') + `<path class="k2-ln" d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const circ = (cx, cy, r) => `M${cx},${cy - r} A${r},${r} 0 1,1 ${cx},${cy + r} A${r},${r} 0 1,1 ${cx},${cy - r}Z`;
const ell = (cx, cy, rx, ry) => `M${cx - rx},${cy} A${rx},${ry} 0 1,1 ${cx + rx},${cy} A${rx},${ry} 0 1,1 ${cx - rx},${cy}Z`;
const rrect = (x, y, w, h, r) => `M${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} H${x + r} Q${x},${y + h} ${x},${y + h - r} V${y + r} Q${x},${y} ${x + r},${y}Z`;
const pin = () => `<circle r="2.7" fill="${GOLD}" stroke="#A8791A" stroke-width=".8"/><circle cx="-.8" cy="-.9" r=".8" fill="#FFF6D0"/>`;
const J = (x, y, inner, dl = 0, cls = 'k2-swing') => `<g transform="translate(${x} ${y})"><g class="${cls}" style="animation-delay:${-dl}s">${inner}</g>${pin()}</g>`;
const flame = (c, l) => P('M0,0 C-6,0 -8,-6 -5,-11 C-4,-7 -2,-7 -2,-9 C-1,-14 2,-17 3,-21 C4,-15 8,-11 7,-5 C6,-1 3,0 0,0Z', c) + `<path d="M0.5,-1.5 C-2,-2 -3,-5 -1,-8 C0,-6 2,-7 2,-9 C4,-6 4,-3 0.5,-1.5Z" fill="${l}"/>`;
const drop = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,-16 C3,-10 7,-7 7,-3 C7,1 4,3 0,3 C-4,3 -7,1 -7,-3 C-7,-7 -3,-10 0,-16Z', c)}</g>`;
const star = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,-12 C1,-5 2,-4 8,-3 C2,-2 1,-1 0,6 C-1,-1 -2,-2 -8,-3 C-2,-4 -1,-5 0,-12Z', GOLD, 2.4)}</g>`;
const feet = (xs, t, rx = 9, y = 0) => xs.map(x => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="5.5" fill="${t.d}" stroke="${W}" stroke-width="3" paint-order="stroke"/>`).join('');
const bubble = (x, y, r, t) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${W}" fill-opacity=".85" stroke="${t.d}" stroke-width="1.3"/><circle cx="${x - r * .35}" cy="${y - r * .35}" r="${r * .25}" fill="${W}"/>`;
const rays = (cx, cy, list, t) => `<g transform="translate(${cx} ${cy})">${list.map(([a, len], i) => `<path d="M-8,-30 C-8,-42 -3,-50 0,-54 C3,-50 8,-42 8,-30Z" transform="rotate(${a}) scale(1 ${len})" fill="${i % 2 ? GOLD : t.f}" stroke="${W}" stroke-width="3" stroke-linejoin="round" paint-order="stroke"/>`).join('')}</g>`;
const boxBird = (x, y, s, t, dir = 1) => `<g transform="translate(${x} ${y}) scale(${s * dir} ${s})">${P('M-8,-10 L-15,-14 L-13,-5Z', t.d, 2)}${P(rrect(-8, -14, 16, 14, 3), t.f, 2.6)}${P('M8,-10 L15,-7.5 L8,-5Z', GOLD, 2)}<circle cx="2.4" cy="-9.4" r="1.7" fill="${INK}"/><path class="k2-ln" d="M18,-15 q3,-2 4,-5 M20,-8 h5" stroke="${INK}" stroke-width="1.3" fill="none" stroke-linecap="round"/></g>`;
const leafL = (c, l) => P('M0,0 C-4,-14 -20,-24 -36,-20 C-32,-6 -16,2 0,0Z', c) + `<path class="k2-ln" d="M-5,-4 C-14,-11 -23,-15 -31,-17" stroke="${l}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
const leafR = (c, l) => `<g transform="scale(-1 1)">${leafL(c, l)}</g>`;
const oct = (r, cy) => { const p = []; for (let i = 0; i < 8; i++) { const a = (22.5 + i * 45) * Math.PI / 180; p.push((Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1)); } return 'M' + p.join(' L') + 'Z'; };
const cord = (x, y) => `<path class="k2-ln" d="M${x - 9},${y} Q${x},${y + 4} ${x + 9},${y}" stroke="${SHU}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="${x}" cy="${y + 2.4}" r="2.3" fill="${SHU}"/>`;
const zz = (x, y) => `<g class="k2-zz"><text x="${x}" y="${y}" font-family="Zen Maru Gothic, sans-serif" font-weight="900" font-size="14" fill="${INK}" stroke="${W}" stroke-width="3" paint-order="stroke">z</text><text x="${x + 10}" y="${y - 12}" font-family="Zen Maru Gothic, sans-serif" font-weight="900" font-size="10" fill="${INK}" stroke="${W}" stroke-width="3" paint-order="stroke">z</text></g>`;
const frond = (c, c2) => P('M0,0 C10,-6 14,-18 26,-22 C22,-12 30,-8 36,-2 C26,-2 22,6 10,6 C6,6 2,4 0,0Z', c) + `<path class="k2-ln" d="M4,0 C12,-4 20,-10 28,-12" stroke="${c2}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`;
const tree = (x, y, r, c) => P(`${circ(x, y - r * .35, r * .72)} ${circ(x - r * .55, y + r * .1, r * .55)} ${circ(x + r * .55, y + r * .1, r * .55)}`, c);
const HAND = 'M0,6 C-6,6 -10,2 -10,-4 L-12,-14 C-12,-17 -8,-17 -8,-14 L-6,-8 L-6,-18 C-6,-21 -2,-21 -2,-18 L-1,-9 L0,-20 C0,-23 4,-23 4,-20 L4,-9 L6,-17 C7,-20 10,-19 10,-16 L8,-6 L12,-10 C14,-12 16,-10 15,-8 L8,2 C6,5 3,6 0,6Z';
const hand = (x, y, rot, s, c) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P(HAND, c, 2.6)}</g>`;
const bicep = c => P('M0,0 C10,2 22,-2 26,-12 C30,-22 26,-32 18,-34 C12,-36 8,-30 12,-24 C14,-18 8,-12 0,-12Z', c, 3);
const wheel = (x, y, r, t) => `<g transform="translate(${x} ${y})"><g class="k2-rot">${P(circ(0, 0, r), INK, 3)}<circle r="${(r * .4).toFixed(1)}" fill="${t.l}"/><path class="k2-ln" d="M0,${-r * .75} V${r * .75} M${-r * .75},0 H${r * .75}" stroke="${t.l}" stroke-width="1.6"/></g>${pin()}</g>`;
const phase = (x, y, r, k) => k === 'full' ? P(circ(x, y, r), GLOW, 2) : k === 'new' ? P(circ(x, y, r), T.water.d, 2)
  : k === 'half' ? P(circ(x, y, r), T.water.d, 2) + `<path d="M${x},${y - r} A${r},${r} 0 0,1 ${x},${y + r}Z" fill="${GLOW}"/>`
  : P(circ(x, y, r), T.water.d, 2) + `<path d="M${x},${y - r} A${r},${r} 0 0,1 ${x},${y + r} A${r * .6},${r} 0 0,0 ${x},${y - r}Z" fill="${GLOW}"/>`;
const shide = (x, y) => `<path d="M${x - 3},${y} h6 l-3,5 h5 l-3,5 h5 l-4,6 h-6 l3,-5 h-5 l3,-5 h-5Z" fill="#FFFFFF" stroke="#B9B2A6" stroke-width=".8"/>`;
const heartP = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,8 C-6,3 -14,-2 -14,-9 C-14,-15 -7,-17 0,-11 C7,-17 14,-15 14,-9 C14,-2 6,3 0,8Z', SHU, 3)}</g>`;
const starPath = (cx, cy, R, r) => { const p = []; for (let i = 0; i < 10; i++) { const a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r : R; p.push((cx + Math.cos(a) * rr).toFixed(1) + ',' + (cy + Math.sin(a) * rr).toFixed(1)); } return 'M' + p.join(' L') + 'Z'; };
const flower5 = (cx, cy, r) => Array.from({ length: 5 }, (_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return circ(+(cx + Math.cos(a) * r * .6).toFixed(1), +(cy + Math.sin(a) * r * .6).toFixed(1), r * .5); }).join(' ');
const leafFall = (x, y, c) => `<g transform="translate(${x} ${y}) rotate(30) scale(.45)">${P('M0,0 C-4,-14 -20,-24 -36,-20 C-32,-6 -16,2 0,0Z', c)}</g>`;

// ---------- Ojos de papel: cinco temperamentos ----------
const ink = d => `<path d="${d}" fill="${INK}"/>`;
const dot = r => `<circle r="${r}" fill="${INK}"/>`;
const disc = r => `<circle r="${r}" fill="${W}" stroke="rgba(30,26,36,.28)" stroke-width=".7"/>`;
const pill = (dx = 0, dy = 0) => `<rect x="${dx - 1.9}" y="${dy - 3.2}" width="3.8" height="6.4" rx="1.9" fill="${INK}"/><circle cx="${dx - .7}" cy="${dy - 1.6}" r=".75" fill="${W}"/>`;
const LID = { harai: 'M-6.18,.54 A6.2,6.2 0 0,1 3.99,-4.75Z', tome: 'M-6,-1.5 A6.2,6.2 0 0,1 6,-1.5Z', hane: 'M5.99,1.6 A6.2,6.2 0 0,1 -5.62,2.62Z', sad: 'M-3.99,-4.75 A6.2,6.2 0 0,1 6.18,.54Z', angry: 'M-5.99,1.6 A6.2,6.2 0 0,1 3.1,-5.37Z' };
const BROW = { sad: ink('M-6,-10.6 L6.6,-6.6 L6,-4.6 L-6.6,-8.6Z'), stern: ink('M-7.6,-10 L7.8,-9.2 L7.8,-6.6 L-7.6,-7.6Z') };
const TEMP = { ten: ['点', 'Ten', 'tierno y curioso'], harai: ['払い', 'Harai', 'fiero y veloz'], tome: ['止め', 'Tome', 'sereno y firme'], hane: ['跳ね', 'Hane', 'pícaro'], maru: ['丸', 'Maru', 'asombrado'] };
function eyeParts(temp, expr, t, isRight, brow, px) {
  let u = '', m = '', lid = '', ov = '';
  const seg = d => `<path d="${d}" fill="${t.d}" stroke="${t.d}" stroke-width=".7" stroke-linejoin="round"/>`;
  const tear = isRight ? `<path d="M4,6.5 C6,9.5 6.6,11.6 4.6,12.6 C2.6,12.6 2.2,10.4 4,6.5Z" fill="${T.water.l}" stroke="${T.water.d}" stroke-width=".8"/>` : '';
  if (expr === 'feliz') m = `<path class="k2-ln" d="M-6,1.8 Q0,-5.8 6,1.8" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
  else if (expr === 'dormido') m = `<path class="k2-ln" d="M-6,-1.4 Q0,4.6 6,-1.4" fill="none" stroke="${INK}" stroke-width="2.6"/>`;
  else if (expr === 'sorpresa') { u = disc(7); m = dot(1.9); }
  else if (expr === 'triste') { u = disc(6.2); m = pill(); lid = seg(LID.sad); ov = BROW.sad + tear; }
  else if (expr === 'enojado') { u = disc(6.2); m = pill(); lid = seg(LID.angry); }
  else if (temp === 'maru') { u = disc(7); m = dot(2) + `<circle cx="-.8" cy="-.8" r=".6" fill="${W}"/>`; }
  else if (temp === 'hane') { u = disc(6.2); m = pill(1.5, -.5); lid = seg(LID.hane); }
  else { u = disc(6.2); m = pill(px || 0); if (LID[temp]) lid = seg(LID[temp]); }
  if (brow && expr === 'neutral') ov += BROW.stern;
  return [u, m, lid, ov];
}
function mouthSVG(x, y, expr, type, es) {
  if (type === 'sq') { const w = 10 * es, h = (expr === 'sorpresa' ? 8.5 : 5.5) * es; return `<rect x="${(x - w / 2).toFixed(1)}" y="${(y + 7 * es).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${(1.6 * es).toFixed(1)}" fill="${MOUTH}" stroke="${W}" stroke-width="1.4" paint-order="stroke"/>`; }
  let s;
  if (expr === 'feliz') s = `<path d="M-4.4,-.6 Q0,7 4.4,-.6Z" fill="${MOUTH}"/>`;
  else if (expr === 'sorpresa') s = `<ellipse cy="1.4" rx="2.2" ry="2.8" fill="${MOUTH}"/>`;
  else if (expr === 'triste') s = `<path class="k2-ln" d="M-3,2.6 Q0,-.8 3,2.6" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  else if (expr === 'enojado') s = `<path class="k2-ln" d="M-3.6,1.8 L-1.2,.2 L1.2,1.8 L3.6,.2" stroke="${INK}" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  else if (expr === 'dormido') s = `<circle cy="1.6" r="1.5" fill="${MOUTH}"/>`;
  else if (type === 'open') s = `<path d="M-4.6,-.6 h9.2 q0,8 -4.6,8 q-4.6,0 -4.6,-8Z" fill="${MOUTH}"/><path d="M-2.6,5 q2.6,-2.4 5.2,0 q-2.6,3 -5.2,0Z" fill="${SHU}"/>`;
  else s = `<path class="k2-ln" d="M-3,0 Q0,2.8 3,0" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  return `<g transform="translate(${x} ${(y + 3.8 * es).toFixed(1)}) scale(${es})">${s}</g>`;
}
const shu = d => `<path d="${d}" fill="${SHU}"/>`;
function faceSVG(f, g, main, _lang, exprO, t) {
  const es = f.es || 1, { x, y, sp } = f, temp = f.eye || 'ten';
  const expr = f.fix ? (f.expr || 'neutral') : (exprO || f.expr || 'neutral');
  if (f.mouthOnly) return mouthSVG(x, y - 3.8, expr, f.mouth, 1);
  const marks = main && g >= 3 ? shu('M3.6,7.6 C6.6,8.2 10,5.8 11.6,1.8 C11.4,6.2 8.4,10.8 3.4,9.8Z') + (g >= 4 ? shu('M2.6,11.6 C5,12.4 7.6,11 9,8.4 C8.6,11.6 6.2,14.2 2.4,13.4Z') : '') : '';
  const eye = (ex, side) => { const [u, m, lid, ov] = eyeParts(temp, expr, t, side > 0, f.brow, f.px ? f.px * side : 0), sc = `transform="scale(${side * es} ${es})"`;
    return `<g transform="translate(${ex} ${y})"><g class="k2-blink">${u ? `<g ${sc}>${u}</g>` : ''}<g class="k2-pup"><g ${sc}>${m}</g></g>${lid ? `<g ${sc}>${lid}</g>` : ''}</g>${ov || marks ? `<g ${sc}>${ov}${marks}</g>` : ''}</g>`; };
  let out = sp ? eye(x - sp, -1) + eye(x + sp, 1) : (f.px ? `<g transform="translate(${x} ${y}) scale(${es})">${(() => { const [u, m, lid] = eyeParts(temp, expr, t, true, false, f.px / es); return `<g class="k2-blink">${u}<g class="k2-pup">${m}</g>${lid}</g>`; })()}</g>` : eye(x, f.dir || 1));
  if (main && sp && g < 3) out += [-1, 1].map(sd => `<circle cx="${x + sd * (sp + 6.5 * es)}" cy="${y + 6.8 * es}" r="${3 * es}" fill="${SHU}" opacity=".42"/>`).join('');
  if (main && sp && g >= 5) out += `<g transform="translate(${x} ${y - 14})"><path d="M0,-5 C1.8,-2 1.8,1 0,3.4 C-1.8,1 -1.8,-2 0,-5Z" fill="${SHU}"/><path d="M0,-5 C1.8,-2 1.8,1 0,3.4 C-1.8,1 -1.8,-2 0,-5Z" fill="${SHU}" transform="rotate(48) scale(.7)"/><path d="M0,-5 C1.8,-2 1.8,1 0,3.4 C-1.8,1 -1.8,-2 0,-5Z" fill="${SHU}" transform="rotate(-48) scale(.7)"/></g>`;
  if (f.mouth !== false) out += mouthSVG(x, y, expr, f.mouth, es);
  return out;
}


// ---------- Diseños de los kanji: una forma por kanji, solo con lo que significa ----------
// Cada diseño devuelve: body (silueta), back/mid/front (piezas), faces (caras) y kanji [x, y, tamaño].
const F = (x, y, sp, eye = 'ten', o = {}) => ({ x, y, sp, eye, ...o });
const D = {
// ===== Grado 1 =====
'一': { t: 'earth', g: 1, m: 'uno', r: '', idea: 'un solo trazo, largo y tendido', h: 44, draw: t => ({
  body: 'M-56,-18 C-58,-34 -46,-40 -32,-36 C-10,-32 20,-33 42,-32 C54,-31 60,-23 58,-14 C56,-6 46,-5 38,-6 C14,-8 -12,-6 -34,-5 C-48,-4 -55,-9 -56,-18Z',
  back: P('M52,-30 C60,-36 66,-46 62,-54 C58,-48 54,-44 46,-42Z', t.d, 2.6),
  front: feet([-36, -12, 14, 36], t, 7, -1),
  faces: [F(-18, -22, 11, 'ten', { es: .82 })], kanji: [30, -19, 13] }) },
'木': { t: 'wood', g: 1, m: 'árbol', r: '', idea: 'un árbol con copa, tronco y raíces', h: 100, draw: t => ({
  body: `${circ(0, -68, 28)} ${circ(-26, -52, 22)} ${circ(26, -52, 22)} ${ell(0, -44, 36, 14)}`,
  back: P('M-9,-34 C-9,-20 -12,-10 -26,0 L-14,0 L0,-8 L14,0 L26,0 C12,-10 9,-20 9,-34Z', WOOD),
  front: J(18, -94, `<g transform="rotate(20) scale(.6)">${leafR(t.d, t.l)}</g>`, .6),
  faces: [F(0, -64, 14, 'ten')], kanji: [0, -42, 15] }) },
'人': { t: 'earth', g: 1, m: 'persona', r: '', idea: 'una persona de papel que camina', h: 92, draw: t => ({
  body: 'M0,-90 C12,-90 19,-81 19,-71 C19,-64 15,-58 10,-55 L36,-52 L38,-36 L14,-36 L30,-4 C31,0 27,2 24,0 L2,-20 L-2,-20 L-24,0 C-27,2 -31,0 -30,-4 L-14,-36 L-38,-36 L-36,-52 L-10,-55 C-15,-58 -19,-64 -19,-71 C-19,-81 -12,-90 0,-90Z',
  mid: cord(0, -55),
  faces: [F(0, -72, 8, 'ten', { es: .72 })], kanji: [0, -41, 13] }) },
'日': { t: 'fire', g: 1, m: 'sol · día', r: '', idea: 'el sol, cuya luz hace el día', h: 98, draw: t => ({
  body: circ(0, -40, 34),
  back: rays(0, -40, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => [a, i % 2 ? .84 : 1]), t),
  front: feet([-14, 14], t, 8, -1),
  faces: [F(0, -48, 15, 'maru')], kanji: [0, -24, 19] }) },
'月': { t: 'water', g: 1, m: 'luna · mes', r: '', idea: 'media luna con las fases del mes', h: 92, draw: t => ({
  body: 'M14,-89.8 A46,46 0 1,0 14,-2.2 A70,70 0 0,1 14,-89.8Z',
  front: `<g class="k2-float">${phase(38, -76, 6, 'full')}${phase(42, -56, 6, 'half')}</g><g class="k2-float b">${phase(42, -36, 6, 'cres')}${phase(38, -16, 6, 'new')}</g>`,
  faces: [F(-22, -52, 10, 'tome', { es: .95 })], kanji: [-22, -27, 17] }) },
'火': { t: 'fire', g: 1, m: 'fuego', r: '', idea: 'una llama con dos chispas', h: 108, draw: t => ({
  body: 'M0,0 C-26,0 -40,-14 -40,-36 C-40,-58 -22,-66 -14,-84 C-10,-94 -2,-102 10,-104 C24,-106 32,-96 28,-88 C24,-94 16,-94 12,-88 C8,-80 14,-72 22,-62 C34,-50 40,-44 40,-32 C40,-12 26,0 0,0Z',
  back: P('M-36,-40 C-50,-46 -54,-60 -46,-72 C-44,-60 -36,-56 -28,-56Z', t.d),
  front: `<g class="k2-float"><g transform="translate(-54 -78) scale(1.05)">${flame(t.f, t.l)}</g></g><g class="k2-float b"><g transform="translate(54 -62) scale(.95)">${flame(t.f, t.l)}</g></g>` + feet([-16, 16], t, 8),
  faces: [F(0, -38, 15, 'harai')], kanji: [0, -15, 19] }) },
'田': { t: 'earth', g: 1, m: 'arrozal', r: '', idea: 'un arrozal en cuatro parcelas, con sus brotes', h: 86, draw: t => ({
  body: rrect(-40, -68, 80, 66, 12),
  back: [-28, -10, 10, 28].map((x, i) => P(`M${x},-66 C${x - 3},-76 ${x - 7},-82 ${x - 12},-86 C${x - 3},-84 ${x + 1},-78 ${x + 2},-66Z`, i % 2 ? '#A3D07C' : T.wood.d, 2.4) + P(`M${x},-66 C${x + 3},-74 ${x + 7},-80 ${x + 11},-82 C${x + 5},-76 ${x + 3},-72 ${x + 2},-66Z`, T.wood.f, 2.2)).join(''),
  mid: `<path class="k2-ln" d="M-40,-30 H40 M0,-30 V-2 M0,-68 V-62" stroke="${t.d}" stroke-width="4" fill="none"/><path class="k2-ln" d="M-30,-14 h10 M10,-20 h12" stroke="${W}" stroke-width="2" opacity=".6" fill="none" stroke-linecap="round"/>`,
  faces: [F(0, -48, 16, 'ten')], kanji: [-20, -15, 15] }) },
'力': { t: 'metal', g: 1, m: 'fuerza', r: '', idea: 'brazos que muestran el músculo', h: 82, draw: t => ({
  body: 'M-30,0 C-34,-20 -36,-46 -26,-62 C-16,-74 16,-74 26,-62 C36,-46 34,-20 30,0Z',
  front: J(-30, -30, `<g transform="scale(-1 1)">${bicep(t.d)}${P(circ(20, -38, 7), t.d, 3)}</g>`, 0, 'k2-swing2') + J(30, -30, `${bicep(t.d)}${P(circ(20, -38, 7), t.d, 3)}`, .7, 'k2-swing2') + feet([-16, 16], t, 9),
  faces: [F(0, -50, 13, 'harai', { brow: true })], kanji: [0, -22, 19], shine: true }) },
'女': { t: 'fire', g: 1, m: 'mujer', r: '', idea: 'una mujer con kimono y moño', h: 106, draw: t => ({
  body: `M-14,-56 C-26,-48 -32,-28 -38,0 L38,0 C32,-28 26,-48 14,-56Z ${circ(0, -72, 18)}`,
  back: P(circ(0, -74, 20), '#3A2E3A') + P(circ(0, -96, 10), '#3A2E3A') + Ln('M8,-100 L22,-108', GOLD, 2.4, 2) + P(circ(23, -109, 3), SHU, 1.6),
  mid: `<path d="M-30,-38 H30 L31,-30 H-31Z" fill="${t.d}"/><path class="k2-ln" d="M-10,-56 L0,-44 L10,-56" stroke="${t.l}" stroke-width="3" fill="none"/>`,
  faces: [F(0, -71, 7, 'tome', { es: .72 })], kanji: [0, -16, 16] }) },
'子': { t: 'water', g: 1, m: 'niño', r: '', idea: 'un bebé envuelto que abre los brazos', h: 86, draw: t => ({
  body: `${circ(0, -64, 20)} M-20,-48 C-28,-30 -26,-8 -14,-2 C-6,2 6,2 14,-2 C26,-8 28,-30 20,-48Z`,
  front: J(-19, -44, P('M0,0 C-8,-6 -16,-16 -18,-26 C-10,-24 -2,-14 2,-6Z', t.d, 3), 0, 'k2-swing2') + J(19, -44, P('M0,0 C8,-6 16,-16 18,-26 C10,-24 2,-14 -2,-6Z', t.d, 3), .6, 'k2-swing2'),
  mid: Ln('M-6,-84 C-2,-90 4,-90 6,-86', t.d, 3, 2),
  faces: [F(0, -64, 9, 'maru', { es: .82 })], kanji: [0, -22, 15] }) },
'口': { t: 'metal', g: 1, m: 'boca', r: '', idea: 'una boca cuadrada, bien abierta', h: 90, draw: t => ({
  body: 'M-34,-72 Q-40,-72 -40,-66 L-35,-8 Q-34,-2 -28,-2 H28 Q34,-2 35,-8 L40,-66 Q40,-72 34,-72Z',
  back: P('M22,-70 C22,-82 30,-90 40,-86 C34,-85 31,-79 32,-70Z', t.d, 2.8),
  mid: `<path d="${rrect(-17, -47, 34, 24, 4)}" fill="${MOUTH}" stroke="${W}" stroke-width="2" paint-order="stroke"/><path d="M-10,-23 C-10,-32 10,-32 10,-23Z" fill="${SHU}"/><rect x="-9" y="-47" width="7" height="5.5" rx="1" fill="${W}"/><rect x="2" y="-47" width="7" height="5.5" rx="1" fill="${W}"/>`,
  front: feet([-20, 20], t, 9, -1),
  faces: [F(0, -59, 18, 'hane', { mouth: false })], kanji: [0, -12, 14] }) },
'十': { t: 'metal', g: 1, m: 'diez', r: '', idea: 'una cruz con diez dedos para contar', h: 94, draw: t => ({
  body: 'M-12,-86 Q-12,-92 -6,-92 H6 Q12,-92 12,-86 V-60 H38 Q44,-60 44,-54 V-40 Q44,-34 38,-34 H12 V-6 Q12,0 6,0 H-6 Q-12,0 -12,-6 V-34 H-38 Q-44,-34 -44,-40 V-54 Q-44,-60 -38,-60 H-12Z',
  front: J(-44, -47, hand(-8, 0, -90, 1, t.l), 0, 'k2-swing2') + J(44, -47, hand(8, 0, 90, 1, t.l), .7, 'k2-swing2'),
  faces: [F(0, -47, 8, 'ten', { es: .8 })], kanji: [0, -16, 13] }) },
'目': { t: 'water', g: 1, m: 'ojo', r: '', idea: 'un gran ojo que lo ve todo', h: 108, draw: t => ({
  body: 'M0,-104 C28,-84 40,-66 40,-52 C40,-36 28,-18 0,-4 C-28,-18 -40,-36 -40,-52 C-40,-66 -28,-84 0,-104Z',
  back: Ln('M-16,-88 L-24,-100 M0,-98 V-112 M16,-88 L24,-100', t.d, 3.2, 3),
  front: feet([-12, 12], t, 7, -1),
  faces: [F(0, -60, 0, 'maru', { es: 2.2, mouth: false })], kanji: [0, -27, 13] }) },
'生': { t: 'wood', g: 1, m: 'vida · nacer', r: '', idea: 'una semilla que se abre y brota', h: 104, draw: t => ({
  body: 'M0,-74 C24,-74 36,-50 36,-30 C36,-10 22,0 0,0 C-22,0 -36,-10 -36,-30 C-36,-50 -24,-74 0,-74Z',
  fill: '#D8C089',
  mid: Ln('M-24,-60 L-14,-54 L-6,-62 L4,-54 L14,-62 L24,-56', W, 2.4, 0),
  front: J(0, -72, Ln('M0,0 C-1,-8 0,-14 2,-20', T.wood.d, 3.5) + `<g transform="translate(2 -20) scale(.62)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, 0),
  faces: [F(0, -38, 13, 'maru')], kanji: [0, -15, 15] }) },
'心': { t: 'fire', g: 1, m: 'corazón', r: '', idea: 'un corazón que late', h: 100, draw: t => ({
  body: 'M-2,-4 C-16,-14 -42,-30 -42,-54 C-42,-72 -24,-82 -10,-74 C-6,-72 -2,-68 0,-64 C2,-68 6,-72 10,-74 C24,-82 42,-72 42,-54 C42,-34 22,-20 10,-10 C6,-6 8,0 16,0 C22,0 24,-6 20,-8 C28,-8 30,4 18,6 C6,8 -2,2 -2,-4Z',
  front: [[-32, -86, -28, ''], [0, -92, 0, ' b'], [32, -86, 28, '']].map(([x, y, r, c]) => `<g class="k2-float${c}"><g transform="translate(${x} ${y}) rotate(${r})">${P('M0,-9 C3,-5 4,0 0,5 C-4,0 -3,-5 0,-9Z', SHU, 2.4)}</g></g>`).join(''),
  faces: [F(0, -52, 16, 'ten')], kanji: [0, -31, 17] }) },
'皿': { t: 'earth', g: 1, m: 'plato', r: '', idea: 'un plato hondo sobre su pie', h: 64, draw: t => ({
  body: 'M-50,-56 C-48,-30 -30,-16 -14,-14 L-16,0 L16,0 L14,-14 C30,-16 48,-30 50,-56Z',
  mid: `<path d="${ell(0, -56, 50, 6)}" fill="${t.l}" stroke="${W}" stroke-width="2.4" paint-order="stroke"/><path class="k2-ln" d="M-44,-46 C-20,-40 20,-40 44,-46" stroke="${t.d}" stroke-width="2.4" fill="none"/>`,
  faces: [F(0, -38, 15, 'ten')], kanji: [0, -20, 13] }) },
'水': { t: 'water', g: 1, m: 'agua', r: '', idea: 'una gota con cresta de ola', h: 112, draw: t => ({
  body: 'M0,0 C-24,0 -40,-10 -40,-30 C-40,-48 -26,-58 -16,-70 C-10,-78 -8,-90 -18,-96 C-28,-102 -38,-94 -36,-86 C-44,-98 -34,-112 -16,-110 C4,-108 10,-88 16,-74 C24,-58 40,-50 40,-30 C40,-10 24,0 0,0Z',
  back: P('M32,-22 C46,-32 58,-26 62,-12 C54,-16 46,-10 36,-6Z', t.d),
  front: `<g class="k2-float">${drop(-56, -52, .55, t.l)}</g><g class="k2-float b">${drop(52, -62, .5, t.l)}</g>`,
  faces: [F(0, -37, 15, 'ten')], kanji: [0, -14, 18] }) },
'艸': { t: 'wood', g: 1, m: 'hierba', r: '', idea: 'dos matas de hierba sobre un montículo', h: 96, draw: t => ({
  body: 'M-42,0 C-48,-16 -42,-40 -24,-46 C-8,-52 8,-52 24,-46 C42,-40 48,-16 42,0Z',
  back: [-1, 1].map(s => P(`M${s * -34},-38 C${s * -42},-56 ${s * -54},-66 ${s * -64},-70 C${s * -52},-56 ${s * -44},-46 ${s * -24},-38Z`, t.d) + P(`M${s * -26},-44 C${s * -30},-64 ${s * -36},-80 ${s * -44},-90 C${s * -28},-78 ${s * -18},-62 ${s * -14},-46Z`, '#A3D07C') + P(`M${s * -14},-48 C${s * -14},-68 ${s * -12},-82 ${s * -6},-94 C${s * -2},-80 ${s * -2},-64 ${s * -4},-48Z`, t.d)).join(''),
  faces: [F(0, -30, 14, 'hane')], kanji: [0, -10, 13] }) },
'手': { t: 'metal', g: 1, m: 'mano', r: '', idea: 'una mano abierta con sus cinco dedos', h: 102, draw: t => ({
  body: 'M-30,0 C-34,-14 -34,-30 -32,-42 L-40,-60 C-44,-68 -34,-74 -30,-66 L-22,-52 L-22,-84 C-22,-92 -12,-92 -12,-84 L-12,-56 L-6,-94 C-6,-102 6,-102 6,-94 L6,-56 L12,-88 C12,-96 22,-96 22,-88 L22,-54 L26,-74 C27,-82 36,-80 36,-72 L32,-40 C32,-24 30,-12 30,0Z',
  mid: Ln('M-14,-50 C-8,-46 8,-46 14,-50', t.d, 1.8, 0),
  faces: [F(0, -34, 13, 'ten')], kanji: [0, -13, 15], shine: true }) },
'糸': { t: 'wood', g: 1, m: 'hilo', r: '', idea: 'un ovillo con su hebra suelta', h: 74, draw: t => ({
  body: circ(0, -36, 34),
  mid: `<path class="k2-ln" d="M-30,-50 C-10,-62 14,-62 30,-46 M-34,-32 C-12,-46 16,-46 34,-26 M-28,-12 C-8,-24 12,-24 30,-10" stroke="${t.d}" stroke-width="2" fill="none" opacity=".55"/>`,
  front: J(30, -16, Ln('M0,0 C14,6 22,-4 18,-14 C14,-22 24,-28 30,-22', t.d, 3.5), 0),
  faces: [F(0, -44, 14, 'hane')], kanji: [0, -20, 16] }) },
'示': { t: 'water', g: 1, m: 'mostrar · altar', r: '', idea: 'un altar que muestra sus ofrendas', h: 104, draw: t => ({
  body: 'M-46,-70 Q-48,-78 -40,-78 H40 Q48,-78 46,-70 L42,-58 H20 L24,0 H-24 L-20,-58 H-42Z',
  back: P(ell(0, -82, 15, 6), W, 2.4) + P(ell(0, -90, 10, 5), W, 2.4) + P(circ(0, -97, 4.5), GOLD, 2),
  front: shide(-36, -58) + shide(36, -58),
  faces: [F(0, -40, 11, 'tome')], kanji: [0, -16, 15] }) },
'衣': { t: 'wood', g: 1, m: 'ropa', r: '', idea: 'un kimono con mangas anchas y obi', h: 86, draw: t => ({
  body: 'M-16,-82 L-50,-76 C-56,-74 -58,-64 -54,-58 L-36,-54 L-34,0 L34,0 L36,-54 L54,-58 C58,-64 56,-74 50,-76 L16,-82 C10,-74 -10,-74 -16,-82Z',
  mid: `<path class="k2-ln" d="M-16,-82 L0,-66 L16,-82" stroke="${t.l}" stroke-width="4" fill="none"/><path d="M-36,-34 H36 V-26 H-36Z" fill="${t.d}"/><circle cx="0" cy="-30" r="3" fill="${GOLD}"/>`,
  faces: [F(0, -50, 13, 'tome')], kanji: [0, -13, 15] }) },
'立': { t: 'earth', g: 1, m: 'estar de pie', r: '', idea: 'firme y derecho sobre su línea', h: 98, draw: t => ({
  body: 'M0,-96 C16,-96 22,-84 22,-70 L22,-16 H12 V-8 H4 V-16 H-4 V-8 H-12 V-16 H-22 V-70 C-22,-84 -16,-96 0,-96Z',
  front: P(rrect(-30, -70, 8, 36, 4), t.d, 2.6) + P(rrect(22, -70, 8, 36, 4), t.d, 2.6) + P(rrect(-46, -8, 92, 8, 4), t.d, 2.6),
  faces: [F(0, -74, 10, 'tome')], kanji: [0, -42, 17] }) },
'車': { t: 'metal', g: 1, m: 'carro · auto', r: '', idea: 'un carrito con ruedas que giran', h: 92, draw: t => ({
  body: `M-46,-24 L-42,-60 Q-41,-66 -35,-66 H35 Q41,-66 42,-60 L46,-24Z ${rrect(-26, -86, 52, 24, 10)}`,
  mid: `<path d="${rrect(-20, -82, 40, 14, 5)}" fill="${t.l}" opacity=".8"/>`,
  front: wheel(-28, -20, 16, t) + wheel(28, -20, 16, t),
  faces: [F(0, -50, 13, 'ten')], kanji: [0, -76, 11], shine: true }) },
'止': { t: 'earth', g: 1, m: 'detenerse', r: '', idea: 'una señal que te frena con la mano', h: 90, draw: t => ({
  body: oct(35, -48),
  mid: `<path class="k2-ln" d="${oct(29, -48)}" fill="none" stroke="${SHU}" stroke-width="3.6" stroke-linejoin="round"/>`,
  front: J(35, -50, `<g transform="translate(12 -10) rotate(8)">${P('M-6,6 C-8,-2 -8,-10 -6,-14 C-4,-16 -2,-14 -2,-10 L-1,-18 C0,-21 3,-20 3,-17 L3,-10 L5,-17 C6,-20 9,-19 9,-16 L7,-8 L10,-12 C12,-14 14,-12 13,-10 L8,2 C6,6 0,8 -6,6Z', t.l, 2.6)}</g>`, 0, 'k2-swing2') + feet([-15, 15], t, 10),
  faces: [F(0, -58, 13, 'tome', { brow: true })], kanji: [0, -36, 18] }) },
'土': { t: 'earth', g: 1, m: 'tierra', r: '', idea: 'un terrón con capas y piedritas', h: 66, draw: t => ({
  body: 'M-48,0 C-54,-14 -46,-30 -32,-36 C-28,-52 -12,-62 2,-58 C16,-66 34,-58 36,-42 C48,-36 54,-16 48,0Z',
  mid: `<path class="k2-ln" d="M-50,-8 C-30,-12 -10,-6 10,-10 C26,-13 38,-8 50,-10" stroke="${t.d}" stroke-width="2.6" fill="none"/>` + [[-36, -20, 3], [32, -24, 2.6], [40, -6, 2], [-22, -4, 2.2]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${t.l}"/>`).join(''),
  faces: [F(0, -40, 14, 'tome')], kanji: [0, -20, 14] }) },
'寸': { t: 'metal', g: 1, m: 'medida · pulgada', r: '', idea: 'una regla que mide pulgada a pulgada', h: 106, draw: t => ({
  body: rrect(-18, -104, 36, 102, 6),
  mid: `<path class="k2-ln" d="${Array.from({ length: 12 }, (_, i) => `M-18,${-96 + i * 8} h${i % 4 ? 6 : 11}`).join(' ')}" stroke="${t.d}" stroke-width="1.8" fill="none"/>`,
  front: J(-18, -56, `<g transform="scale(-1 1)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(18, -56, P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3), 1) + feet([-10, 10], t, 7, -1),
  faces: [F(3, -80, 8, 'hane', { es: .75 })], kanji: [3, -40, 16], shine: true }) },
'皮': { t: 'earth', g: 1, m: 'piel', r: '', idea: 'una piel estirada con sus cuatro puntas', h: 84, draw: t => ({
  body: 'M0,-80 C10,-80 14,-72 20,-74 C30,-78 40,-72 38,-62 C36,-56 30,-54 34,-46 C40,-36 42,-22 34,-14 C30,-10 34,-4 30,0 C20,4 14,-4 0,-2 C-14,-4 -20,4 -30,0 C-34,-4 -30,-10 -34,-14 C-42,-22 -40,-36 -34,-46 C-30,-54 -36,-56 -38,-62 C-40,-72 -30,-78 -20,-74 C-14,-72 -10,-80 0,-80Z',
  mid: `<path class="k2-ln" d="M-24,-66 C-30,-50 -32,-26 -22,-10 M24,-66 C30,-50 32,-26 22,-10" stroke="${W}" stroke-width="1.8" stroke-dasharray="3 4" fill="none" opacity=".8"/>`,
  faces: [F(0, -50, 13, 'ten')], kanji: [0, -26, 15] }) },
'毛': { t: 'wood', g: 1, m: 'pelo', r: '', idea: 'una mota de pelo con un rulo arriba', h: 100, draw: t => ({
  body: `${circ(0, -40, 26)} ${circ(-24, -30, 18)} ${circ(24, -30, 18)} ${circ(-14, -56, 16)} ${circ(14, -56, 16)} ${circ(0, -18, 22)}`,
  back: Ln('M2,-68 C-2,-86 10,-98 22,-94 C32,-90 30,-78 22,-78 C16,-78 14,-84 18,-86', t.d, 6),
  mid: `<path class="k2-ln" d="M-34,-36 c4,-4 8,-4 12,0 M24,-42 c4,-4 8,-4 12,0 M-8,-6 c4,-4 8,-4 12,0" stroke="${t.d}" stroke-width="1.8" fill="none"/>`,
  faces: [F(0, -42, 13, 'hane')], kanji: [0, -18, 15] }) },
'豆': { t: 'wood', g: 1, m: 'poroto · frijol', r: '', idea: 'un poroto gordito con su marca', h: 66, draw: t => ({
  body: 'M-42,-32 C-46,-52 -30,-64 -12,-60 C-4,-58 4,-56 12,-60 C30,-64 46,-52 42,-32 C38,-10 18,0 0,0 C-18,0 -38,-10 -42,-32Z',
  fill: '#C9A060',
  mid: `<path d="${ell(0, -55, 7, 3)}" fill="${W}" opacity=".85"/>`,
  front: feet([-16, 16], t, 8, -1),
  faces: [F(0, -38, 15, 'ten')], kanji: [0, -16, 15] }) },
'斤': { t: 'metal', g: 1, m: 'hacha', r: '', idea: 'un hacha con su mango de madera', h: 106, draw: t => ({
  body: 'M-34,-100 L10,-104 C30,-104 46,-90 46,-70 C46,-54 36,-42 24,-40 C20,-52 12,-58 2,-58 L-34,-60Z',
  back: P(rrect(-28, -64, 12, 64, 5), WOOD),
  mid: Ln('M40,-90 C46,-80 46,-62 38,-48', W, 2.4, 0),
  faces: [F(-8, -84, 10, 'harai')], kanji: [20, -64, 14], shine: true }) },

// ===== Grado 2 =====
'林': { t: 'wood', g: 2, m: 'arboleda', r: '木+木', idea: 'dos árboles juntos', h: 96, draw: t => ({
  body: `${circ(-22, -62, 26)} ${circ(22, -66, 28)} ${circ(-40, -46, 16)} ${circ(42, -48, 16)} ${ell(0, -42, 48, 14)}`,
  back: P('M-28,-32 L-30,0 H-16 L-18,-32Z', WOOD) + P('M18,-32 L16,0 H30 L28,-32Z', WOOD),
  faces: [F(0, -60, 15, 'ten')], kanji: [0, -40, 14] }) },
'休': { t: 'earth', g: 2, m: 'descansar', r: '人+木', idea: 'una persona dormida contra un árbol', h: 128, draw: t => ({
  body: 'M-40,0 C-46,-16 -40,-36 -26,-44 C-30,-52 -30,-64 -22,-72 C-12,-82 6,-82 14,-72 C20,-64 20,-54 16,-46 C28,-40 34,-24 32,-10 L44,-4 C46,0 42,2 38,2 L-36,2 C-40,2 -40,0 -40,0Z',
  back: P('M22,-100 h12 v100 h-12Z', WOOD, 2.6) + J(28, -100, tree(0, -6, 26, T.wood.f), .4),
  mid: cord(-4, -46),
  front: zz(-38, -84),
  faces: [F(-4, -62, 8, 'tome', { es: .72, expr: 'dormido' })], kanji: [-6, -22, 16] }) },
'本': { t: 'wood', g: 2, m: 'origen · libro', r: '木+一', idea: 'un libro del que crece un árbol; la raíz, marcada', h: 124, draw: t => ({
  body: rrect(-30, -76, 60, 74, 6),
  back: Ln('M0,-74 V-92', WOOD, 6) + tree(0, -104, 22, '#A3D07C'),
  mid: `<path d="M-30,-70 H-22 V-8 H-30Z" fill="${t.d}"/><path d="M22,-70 H28 V-8 H22Z" fill="${W}" opacity=".7"/><path d="M8,-2 V8 L12,4 L16,8 V-2Z" fill="${SHU}"/>`,
  front: P(rrect(-14, -80, 28, 6, 3), SHU, 2.2),
  faces: [F(2, -54, 12, 'tome')], kanji: [2, -26, 17] }) },
'明': { t: 'fire', g: 2, m: 'brillante', r: '日+月', idea: 'el sol con la luna al hombro', h: 104, draw: t => ({
  body: circ(0, -42, 36),
  back: rays(0, -42, [[-160, .9], [-130, 1.04], [-100, .9], [-70, 1.04], [-40, .9], [-10, 1.04]], t) + P('M22,-92 A48,48 0 0,1 30,2 A66,66 0 0,0 22,-92Z', T.water.f, 3.2),
  front: `<g class="k2-float">${star(62, -84, .8)}</g><g class="k2-float b">${star(-56, -14, .6)}</g><g transform="translate(30 -74)">${pin()}</g>` + feet([-18, 16], t, 9),
  faces: [F(-3, -52, 15, 'maru')], kanji: [-3, -27, 20] }) },
'炎': { t: 'fire', g: 2, m: 'llama', r: '火+火', idea: 'una llamarada doble', h: 152, draw: t => ({
  body: 'M0,0 C-34,0 -50,-18 -48,-46 C-46,-66 -34,-76 -30,-92 C-28,-104 -34,-112 -42,-112 C-36,-122 -18,-122 -12,-106 C-8,-96 -6,-88 0,-84 C6,-88 8,-96 12,-106 C18,-122 36,-122 42,-112 C34,-112 28,-104 30,-92 C34,-76 46,-66 48,-46 C50,-18 34,0 0,0Z',
  back: P('M0,-150 C10,-134 22,-124 20,-108 C18,-96 8,-90 0,-90 C-8,-90 -18,-96 -20,-108 C-22,-120 -10,-126 -6,-138 C-4,-132 0,-134 0,-150Z', t.d)
    + J(40, -14, P('M0,0 C12,-2 22,-12 22,-26 C22,-34 18,-40 14,-44 C16,-34 10,-30 6,-34 C8,-22 2,-14 -4,-8Z', '#F6A13B'), .8),
  front: J(-45, -46, P('M0,0 C-10,-2 -18,-10 -18,-24 C-12,-19 -8,-19 -6,-24 C-1,-15 3,-6 0,0Z', t.d), 0) + J(45, -46, P('M0,0 C10,-2 18,-10 18,-24 C12,-19 8,-19 6,-24 C1,-15 -3,-6 0,0Z', t.d), 1.5) + feet([-20, 20], t, 10),
  faces: [F(0, -54, 17, 'harai')], kanji: [0, -24, 22] }) },
'男': { t: 'earth', g: 2, m: 'hombre', r: '田+力', idea: 'un hombre fuerte con vincha de arrozal', h: 96, draw: t => ({
  body: `M-36,0 C-38,-20 -40,-44 -30,-54 C-20,-62 20,-62 30,-54 C40,-44 38,-20 36,0Z ${circ(0, -72, 19)}`,
  mid: `<path d="${rrect(-19, -86, 38, 8, 3)}" fill="${t.d}"/><path class="k2-ln" d="M-10,-86 v8 M0,-86 v8 M10,-86 v8" stroke="${t.l}" stroke-width="1.6" fill="none"/>`,
  front: J(31, -46, bicep(t.d), .3, 'k2-swing2') + J(-31, -46, `<g transform="scale(-1 1)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0),
  faces: [F(0, -70, 8, 'tome', { es: .75, brow: true })], kanji: [0, -28, 18] }) },
'好': { t: 'fire', g: 2, m: 'gustar', r: '女+子', idea: 'una madre que abraza a su niño', h: 108, draw: t => ({
  body: `M-24,-56 C-36,-48 -42,-28 -48,0 L28,0 C22,-28 16,-48 4,-56Z ${circ(-10, -72, 18)}`,
  back: P(circ(-10, -74, 20), '#3A2E3A') + P(circ(-10, -96, 10), '#3A2E3A'),
  mid: P(circ(14, -40, 15), T.water.f, 3) + `<g transform="translate(14 -42)">${faceSVG(F(0, 0, 5, 'maru', { es: .55, fix: true, expr: 'feliz' }), 1, false, 'B', '', T.water)}</g>`,
  front: P('M-30,-44 C-18,-30 8,-24 26,-30 C24,-24 10,-18 -4,-20 C-16,-22 -26,-30 -30,-44Z', t.d, 3)
    + `<g class="k2-float">${heartP(36, -76, .6)}</g><g class="k2-float b">${heartP(46, -58, .45)}</g>`,
  faces: [F(-10, -71, 7, 'tome', { es: .72, expr: 'feliz' })], kanji: [-14, -12, 15] }) },
'品': { t: 'metal', g: 2, m: 'artículo', r: '口+口+口', idea: 'tres bocas apiladas: mercadería', h: 104, draw: t => ({
  body: `${rrect(-21, -100, 42, 37, 7)} ${rrect(-46, -63, 46, 61, 8)} ${rrect(0, -63, 46, 61, 8)}`,
  back: P('M12,-99 C12,-110 20,-116 28,-112 C23,-111 21,-106 22,-99Z', t.d, 2.8),
  mid: `<path class="k2-ln" d="M0,-62 V-30" stroke="${W}" stroke-width="2.4"/>`,
  front: feet([-28, 28], t, 9, -1),
  faces: [F(0, -88, 10, 'hane', { es: .78, mouth: 'sq' }), F(-23, -46, 9, 'tome', { es: .7, mouth: 'sq', fix: true }), F(23, -46, 9, 'maru', { es: .7, mouth: 'sq', fix: true, expr: 'sorpresa' })], kanji: [0, -14, 16] }) },
'星': { t: 'fire', g: 2, m: 'estrella', r: '日+生', idea: 'una estrella recién nacida', h: 104, draw: t => ({
  body: starPath(0, -48, 50, 24),
  back: J(0, -96, `<g transform="scale(.5)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .5),
  front: `<g class="k2-float">${star(-48, -92, .6)}</g>`,
  faces: [F(0, -52, 11, 'maru', { es: .9 })], kanji: [0, -33, 12] }) },
'姓': { t: 'fire', g: 2, m: 'apellido', r: '女+生', idea: 'la placa con el nombre de la familia', h: 112, draw: t => ({
  body: 'M-24,-96 L24,-96 L26,-4 L-26,-4Z',
  back: P('M-32,-94 L0,-110 L32,-94Z', t.d) + Ln('M-14,-104 L-20,-112 M14,-104 L20,-112', WOOD, 2, 2),
  mid: P(circ(0, -80, 10), W, 2) + `<path d="${Array.from({ length: 5 }, (_, i) => { const a = i * 72 * Math.PI / 180; return `M0,-80 L${(Math.sin(a) * 7).toFixed(1)},${(-80 - Math.cos(a) * 7).toFixed(1)}`; }).join(' ')}" stroke="${t.d}" stroke-width="2.4" stroke-linecap="round"/>`,
  front: P(rrect(-32, -8, 64, 8, 3), WOOD, 2.4),
  faces: [F(0, -58, 11, 'tome')], kanji: [0, -28, 18] }) },
'旦': { t: 'fire', g: 2, m: 'amanecer', r: '日+一', idea: 'el sol que asoma sobre el horizonte', h: 70, draw: t => ({
  body: 'M-38,-22 A38,38 0 0,1 38,-22 H52 Q58,-22 58,-15 Q58,-8 52,-8 H-52 Q-58,-8 -58,-15 Q-58,-22 -52,-22Z',
  back: rays(0, -22, [[-80, .7], [-50, .8], [-20, .9], [10, .9], [40, .8], [70, .7]].map(([a, l]) => [a, l]), t),
  mid: `<path d="M-58,-15 H58" stroke="${t.d}" stroke-width="2" opacity=".6"/>`,
  front: feet([-34, 34], t, 8, -4),
  faces: [F(0, -40, 13, 'hane')], kanji: [-36, -15, 11] }) },
'古': { t: 'metal', g: 2, m: 'antiguo', r: '十+口', idea: 'una piedra antigua, gastada y con musgo', h: 100, draw: t => ({
  body: 'M-28,0 L-26,-70 C-26,-86 -14,-96 0,-96 C14,-96 26,-86 26,-70 L28,0Z',
  mid: `<path class="k2-ln" d="M16,-84 L10,-74 L14,-66 M-20,-30 L-14,-22 L-18,-14" stroke="${t.d}" stroke-width="1.6" fill="none"/>`,
  front: P('M-30,0 C-30,-8 -22,-12 -14,-8 C-10,-14 -2,-12 0,-6 C4,-2 2,0 0,0Z', T.wood.f, 2.4) + P('M28,0 C28,-6 22,-10 16,-6 C14,-2 16,0 18,0Z', T.wood.d, 2.4),
  faces: [F(0, -66, 10, 'tome')], kanji: [0, -34, 18] }) },
'相': { t: 'wood', g: 2, m: 'mutuo', r: '木+目', idea: 'un árbol y un ojo que se miran', h: 90, draw: t => ({
  body: `${circ(-24, -44, 26)} ${circ(24, -44, 26)} ${ell(0, -24, 40, 22)}`,
  back: J(-34, -66, `<g transform="rotate(-20) scale(.6)">${leafL(t.d, t.l)}</g>`, 0) + Ln('M24,-70 V-80 M14,-68 L10,-76 M34,-68 L38,-76', t.d, 2.6, 2),
  front: `<path class="k2-ln" d="M-10,-50 H10" stroke="${t.d}" stroke-width="1.6" stroke-dasharray="2 3" fill="none"/>`,
  faces: [F(-24, -48, 0, 'ten', { es: 1.4, px: 2.5, mouth: false }), F(24, -48, 0, 'ten', { es: 1.4, px: -2.5, mouth: false }), F(0, -36, 0, 'ten', { es: .1, mouthOnly: true })], kanji: [0, -16, 14] }) },
'思': { t: 'earth', g: 2, m: 'pensar', r: '田+心', idea: 'un corazón que piensa con su cabeza de arrozal', h: 86, draw: t => ({
  body: 'M-34,-56 C-34,-84 34,-84 34,-56 C36,-52 36,-48 36,-44 C36,-24 14,-10 0,0 C-14,-10 -36,-24 -36,-44 C-36,-48 -36,-52 -34,-56Z',
  mid: `<path d="M-34,-56 C-34,-84 34,-84 34,-56Z" fill="${t.d}" opacity=".35"/><path class="k2-ln" d="M0,-77 V-56 M-32,-66 H32 M-34,-56 H34" stroke="${t.d}" stroke-width="2.2" fill="none"/>`,
  front: `<g class="k2-float"><circle cx="40" cy="-82" r="2.6" fill="${W}" stroke="${t.d}" stroke-width="1"/><circle cx="48" cy="-92" r="3.6" fill="${W}" stroke="${t.d}" stroke-width="1"/></g>`,
  faces: [F(0, -40, 13, 'tome')], kanji: [0, -18, 13] }) },
'加': { t: 'metal', g: 2, m: 'añadir', r: '力+口', idea: 'suma un bloque más a la pila', h: 100, draw: t => ({
  body: rrect(-32, -66, 64, 64, 12),
  front: J(30, -50, `<g transform="rotate(-20)">${bicep(t.d)}</g>`, 0, 'k2-swing2') + `<g class="k2-float">${P(rrect(-12, -96, 24, 22, 4), t.l, 2.6)} <path class="k2-ln" d="M0,-90 V-80 M-5,-85 H5" stroke="${t.d}" stroke-width="2.6" stroke-linecap="round" fill="none"/></g>` + feet([-16, 16], t, 8, -1),
  faces: [F(-2, -46, 13, 'ten')], kanji: [-2, -20, 16], shine: true }) },
'字': { t: 'water', g: 2, m: 'letra', r: '宀+子', idea: 'una hoja de caligrafía con su pincel', h: 110, draw: t => ({
  body: rrect(-30, -90, 60, 88, 4),
  front: P('M-38,-88 L0,-108 L38,-88 L32,-84 L0,-98 L-32,-84Z', t.d) + J(32, -40, `<g transform="rotate(-30)">${P(rrect(-2.5, -30, 5, 30, 2.5), WOOD, 2)}${P('M-3,0 C-4,6 -2,12 0,14 C2,12 4,6 3,0Z', INK, 2)}</g>`, 0),
  faces: [F(0, -72, 11, 'ten')], kanji: [0, -36, 24] }) },
'安': { t: 'fire', g: 2, m: 'tranquilo · barato', r: '宀+女', idea: 'una casita en calma; la etiqueta dice barato', h: 94, draw: t => ({
  body: 'M-34,0 L-34,-50 L0,-80 L34,-50 L34,0Z',
  front: P('M-44,-48 L0,-88 L44,-48 L38,-44 L0,-78 L-38,-44Z', t.d) + J(38, -46, Ln('M0,0 L4,12', INK, 1.2, 1.6) + P('M-3,12 H12 L18,19 L12,26 H-3Z', W, 2) + `<circle cx="5" cy="19" r="3.4" fill="${GOLD}" stroke="#A8791A" stroke-width=".8"/>`, 0),
  faces: [F(0, -42, 12, 'tome')], kanji: [0, -17, 15] }) },
'見': { t: 'water', g: 2, m: 'ver', r: '目+儿', idea: 'un ojo con piernas que sale a ver', h: 94, draw: t => ({
  body: `${circ(0, -58, 32)} M-14,-32 L-24,-4 C-25,0 -20,2 -17,0 L-4,-28Z M14,-32 L24,-4 C25,0 20,2 17,0 L4,-28Z`,
  back: Ln('M-14,-86 L-20,-96 M0,-90 V-102 M14,-86 L20,-96', t.d, 3, 3),
  faces: [F(0, -62, 0, 'ten', { es: 2.1, mouth: false })], kanji: [0, -36, 12] }) },
'兄': { t: 'metal', g: 2, m: 'hermano mayor', r: '口+儿', idea: 'el mayor: boca grande y piernas largas', h: 104, draw: t => ({
  body: `${rrect(-32, -100, 64, 70, 12)} M-12,-32 L-24,-4 C-25,0 -20,2 -17,0 L-2,-30Z M12,-32 L24,-4 C25,0 20,2 17,0 L2,-30Z`,
  mid: `<path d="${rrect(-14, -72, 28, 16, 4)}" fill="${MOUTH}" stroke="${W}" stroke-width="2" paint-order="stroke"/><path d="M-8,-56 C-8,-62 8,-62 8,-56Z" fill="${SHU}"/>`,
  front: J(32, -66, `<g transform="rotate(-50)">${P('M0,0 C10,-2 22,-2 28,0 C30,1 30,4 28,5 C22,6 10,6 0,5Z', t.d, 3)}</g>`, 0, 'k2-swing2'),
  faces: [F(0, -86, 13, 'harai', { mouth: false })], kanji: [0, -42, 14], shine: true }) },
'枚': { t: 'wood', g: 2, m: 'hoja · contador de cosas planas', r: '木+攵', idea: 'láminas planas de madera, una tras otra', h: 92, draw: t => ({
  body: rrect(-26, -86, 52, 84, 3),
  fill: '#C9A26A',
  back: `<g transform="rotate(-12 -10 0)">${P(rrect(-34, -82, 50, 80, 3), '#D8B784')}</g><g transform="rotate(10 10 0)">${P(rrect(-14, -84, 50, 82, 3), '#B48A5E')}</g>`,
  mid: `<path class="k2-ln" d="M-18,-76 C-10,-70 -14,-56 -6,-50 M14,-40 C8,-30 16,-20 10,-10" stroke="${WOOD}" stroke-width="1.6" fill="none" opacity=".7"/>`,
  faces: [F(0, -62, 11, 'ten')], kanji: [0, -30, 18] }) },
'近': { t: 'metal', g: 2, m: 'cerca', r: '斤+辶', idea: 'llegó: la meta está justo al lado', h: 76, draw: t => ({
  body: circ(-6, -36, 28),
  back: P('M-62,4 C-42,-6 -22,8 0,0 C22,-8 42,6 62,-2 L62,6 C42,14 22,0 0,8 C-22,16 -42,2 -62,14Z', '#D8C9A8', 2.4),
  front: J(32, -2, Ln('M0,0 V-40', WOOD, 2.5) + P('M0,-40 L18,-34 L0,-28Z', SHU, 2), 0, 'k2-swing2') + J(20, -38, P('M0,0 C6,-4 12,-4 16,-2 C12,2 6,4 0,4Z', t.d, 2.6), .4),
  faces: [F(-8, -40, 11, 'hane')], kanji: [-8, -18, 14] }) },
'床': { t: 'wood', g: 2, m: 'piso · cama', r: '广+木', idea: 'una cama de madera sobre el piso', h: 92, draw: t => ({
  body: 'M-48,-8 L-48,-38 L-42,-38 L-42,-84 Q-42,-90 -36,-90 H-4 Q2,-90 2,-84 L2,-38 H48 L48,-8Z',
  fill: '#C9A26A',
  mid: `<path class="k2-ln" d="M-42,-60 H2" stroke="${WOOD}" stroke-width="1.6" fill="none" opacity=".6"/>`,
  front: P(rrect(-4, -48, 52, 14, 6), W, 2.4) + P(ell(8, -50, 9, 5), t.l, 2) + P('M14,-48 H50 V-34 H14Z', t.f, 2.4) + P(rrect(-58, -10, 116, 10, 3), WOOD, 2.4),
  faces: [F(-20, -74, 8, 'tome', { es: .8 })], kanji: [-20, -50, 13] }) },
'音': { t: 'earth', g: 2, m: 'sonido', r: '立+日', idea: 'de pie, cantando: el sonido sale en ondas', h: 96, draw: t => ({
  body: 'M-26,0 L-28,-60 C-28,-82 -16,-92 0,-92 C16,-92 28,-82 28,-60 L26,0Z',
  front: [1, -1].map(s => `<g class="k2-float${s > 0 ? '' : ' b'}">${Ln(`M${s * 38},-74 C${s * 46},-66 ${s * 46},-54 ${s * 38},-46 M${s * 48},-82 C${s * 60},-70 ${s * 60},-50 ${s * 48},-38`, t.d, 3, 2.4)}</g>`).join('') + feet([-12, 12], t, 8, -1),
  faces: [F(0, -66, 11, 'tome', { mouth: 'open' })], kanji: [0, -30, 18] }) },
'新': { t: 'earth', g: 2, m: 'nuevo', r: '立+木+斤', idea: 'un tronco recién cortado que brilla', h: 80, draw: t => ({
  body: rrect(-48, -64, 92, 62, 28),
  fill: '#C9A26A',
  mid: `<path d="${ell(30, -33, 14, 28)}" fill="#F2DAB2" stroke="${W}" stroke-width="2.4" paint-order="stroke"/><path class="k2-ln" d="${ell(30, -33, 8, 17)} ${ell(30, -33, 3, 7)}" stroke="${WOOD}" stroke-width="1.6" fill="none"/>`,
  front: `<g class="k2-float">${star(-44, -70, .8)}${star(52, -72, .6)}</g>` + J(-42, -56, `<g transform="rotate(-30) scale(.42)">${P(rrect(-6, -10, 12, 70, 5), WOOD)}${P('M-34,-10 L4,-14 C18,-14 28,-4 28,10 C28,20 22,28 14,30 C10,22 6,16 -2,16 L-34,14Z', T.metal.f)}</g>`, 0, 'k2-swing2'),
  faces: [F(-12, -42, 12, 'maru')], kanji: [-12, -18, 15] }) },
'軍': { t: 'metal', g: 2, m: 'ejército', r: '冖+車', idea: 'un carro cubierto que marcha con su estandarte', h: 100, draw: t => ({
  body: `M-40,-32 C-40,-74 40,-74 40,-32Z ${rrect(-46, -34, 92, 20, 4)}`,
  mid: `<path class="k2-ln" d="M-20,-66 C-22,-52 -22,-40 -20,-34 M20,-66 C22,-52 22,-40 20,-34" stroke="${t.d}" stroke-width="1.8" fill="none"/>`,
  front: wheel(-28, -12, 13, t) + wheel(28, -12, 13, t) + J(-38, -56, Ln('M0,0 V-38', WOOD, 2.6) + P('M0,-36 H14 V-6 H0Z', SHU, 2), 0),
  faces: [F(0, -50, 11, 'harai', { brow: true })], kanji: [0, -24, 12] }) },
'連': { t: 'metal', g: 2, m: 'conectar · llevar', r: '車+辶', idea: 'tres carritos enganchados en fila', h: 64, draw: t => ({
  body: `${rrect(-62, -50, 36, 38, 6)} ${rrect(-18, -54, 36, 42, 6)} ${rrect(26, -50, 36, 38, 6)}`,
  mid: Ln('M-26,-26 H-18 M18,-26 H26', '#8A6A3A', 3, 2),
  front: [-52, -36, -8, 8, 36, 52].map(x => wheel(x, -10, 8, t)).join(''),
  faces: [F(44, -36, 8, 'hane', { es: .8 }), F(-44, -36, 7, 'tome', { es: .7 })], kanji: [0, -32, 17], shine: true }) },
'疲': { t: 'earth', g: 2, m: 'cansarse', r: '疒+皮', idea: 'agotado y derretido, sudando', h: 62, draw: t => ({
  body: 'M-50,0 C-54,-10 -44,-22 -32,-26 C-30,-44 -16,-56 0,-56 C16,-56 28,-44 30,-26 C42,-22 54,-10 50,0Z',
  mid: Ln('M-10,-50 V-44 M-2,-52 V-46 M6,-50 V-44', T.water.d, 1.8, 0),
  front: `<g class="k2-float">${drop(36, -46, .45, T.water.l)}</g><g class="k2-float b">${drop(-38, -38, .38, T.water.l)}</g>`,
  faces: [F(0, -34, 13, 'tome', { expr: 'triste' })], kanji: [0, -13, 13] }) },
'正': { t: 'earth', g: 2, m: 'correcto', r: '一+止', idea: 'firme sobre la línea, con su ○ de correcto', h: 100, draw: t => ({
  body: rrect(-30, -82, 60, 74, 10),
  back: `<circle cx="0" cy="-50" r="46" fill="none" stroke="${W}" stroke-width="13"/><circle cx="0" cy="-50" r="46" fill="none" stroke="${SHU}" stroke-width="7"/>`,
  front: P(rrect(-50, -8, 100, 8, 4), t.d, 2.6),
  faces: [F(0, -62, 12, 'tome')], kanji: [0, -30, 18] }) },
'寺': { t: 'earth', g: 2, m: 'templo', r: '土+寸', idea: 'un templo de techo curvo', h: 104, draw: t => ({
  body: 'M-34,-2 L-34,-50 L-54,-54 C-40,-60 -26,-70 -16,-84 L16,-84 C26,-70 40,-60 54,-54 L34,-50 L34,-2Z',
  front: P('M-56,-54 C-40,-58 -26,-70 -16,-86 L16,-86 C26,-70 40,-58 56,-54 L48,-48 L-48,-48Z', '#8E3428') + P(circ(0, -92, 4.5), GOLD, 2) + Ln('M0,-86 V-88', GOLD, 2, 2),
  faces: [F(0, -36, 12, 'tome')], kanji: [0, -14, 13] }) },
'尾': { t: 'wood', g: 2, m: 'cola', r: '尸+毛', idea: 'una cola enorme y peluda', h: 116, draw: t => ({
  body: circ(-10, -32, 30),
  back: Ln('M12,-28 C40,-28 58,-56 52,-84 C48,-106 22,-114 6,-102 C-6,-92 0,-76 12,-78 C22,-80 24,-92 16,-94', t.d, 22, 4) + Ln('M30,-40 C42,-48 48,-60 48,-74 M20,-104 C30,-104 40,-98 44,-90', t.l, 2.4, 0),
  faces: [F(-10, -38, 11, 'hane')], kanji: [-10, -16, 14] }) },
'圧': { t: 'earth', g: 2, m: 'presión', r: '厂+土', idea: 'aplastado bajo el peso de una roca', h: 66, draw: t => ({
  body: 'M-50,0 C-54,-18 -40,-36 -20,-36 H20 C40,-36 54,-18 50,0Z',
  front: P('M-60,-36 L-58,-62 L56,-66 L52,-50 L22,-38 L-30,-38Z', '#9A9388') + Ln('M-56,-20 l-8,0 M-56,-10 l-10,0 M56,-20 l8,0 M56,-10 l10,0', t.d, 2, 2),
  faces: [F(-14, -20, 10, 'tome')], kanji: [26, -18, 13] }) },
'厚': { t: 'fire', g: 2, m: 'grueso · amable', r: '厂+日+子', idea: 'grueso como un colchón, con un abrazo amable', h: 78, draw: t => ({
  body: rrect(-40, -70, 80, 66, 16),
  back: [3, 2, 1].map(i => P(rrect(-40 + i * 4, -70 + i * 4, 80, 66, 16), i % 2 ? t.d : t.l, 2.6)).join(''),
  front: J(-38, -42, `<g transform="scale(-1 1) rotate(-40)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(38, -42, `<g transform="rotate(-40)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .6),
  faces: [F(0, -48, 14, 'ten')], kanji: [0, -22, 16] }) },
'同': { t: 'earth', g: 2, m: 'igual', r: '冂+一+口', idea: 'un marco con dos iguales adentro', h: 94, draw: t => ({
  body: 'M-42,0 L-42,-82 Q-42,-90 -34,-90 H34 Q42,-90 42,-82 L42,0 L26,0 L26,-58 L-26,-58 L-26,0Z',
  mid: [-12, 12].map(x => P(circ(x, -24, 10), t.l, 2.4) + `<g transform="translate(${x} -26)">${faceSVG(F(0, 0, 4, 'ten', { es: .5, fix: true }), 1, false, 'B', '', t)}</g>`).join(''),
  faces: [F(0, -76, 11, 'ten', { es: .85 })], kanji: [-34, -28, 12] }) },
'内': { t: 'earth', g: 2, m: 'dentro', r: '冂+人', idea: 'una casa con alguien adentro', h: 96, draw: t => ({
  body: 'M-50,0 L-50,-64 L0,-92 L50,-64 L50,0Z',
  mid: `<path d="${rrect(-16, -40, 32, 40, 4)}" fill="#3A2E3A"/>` + P(circ(0, -22, 9), T.earth.l, 2) + `<g transform="translate(0 -23)">${faceSVG(F(0, 0, 4, 'maru', { es: .5, fix: true }), 1, false, 'B', '', t)}</g>`,
  faces: [F(0, -60, 11, 'ten')], kanji: [33, -22, 13] }) },
'句': { t: 'metal', g: 2, m: 'frase', r: '勹+口', idea: 'un globo de diálogo con su frase', h: 94, draw: t => ({
  body: 'M-44,-50 C-44,-78 -24,-90 0,-90 C24,-90 44,-78 44,-50 C44,-24 24,-12 0,-12 C-6,-12 -12,-13 -16,-14 L-30,0 L-26,-18 C-38,-24 -44,-36 -44,-50Z',
  front: `<g class="k2-float">${[0, 1, 2].map(i => `<circle cx="${48 + i * 8}" cy="${-92 - i * 4}" r="${2.4 + i * .5}" fill="${t.d}" stroke="${W}" stroke-width="1.4" paint-order="stroke"/>`).join('')}</g>`,
  faces: [F(0, -62, 13, 'hane')], kanji: [0, -34, 15] }) },
'登': { t: 'wood', g: 2, m: 'subir', r: '癶+豆', idea: 'subiendo una escalera, paso a paso', h: 112, draw: t => ({
  body: `${circ(22, -82, 24)} M10,-62 L4,-56 C2,-52 6,-50 8,-52 L18,-60Z M30,-60 L36,-42 C37,-38 33,-36 31,-40 L22,-58Z`,
  back: P('M-62,0 V-14 H-38 V-28 H-14 V-42 H10 V-56 H60 V0Z', '#C9B48C', 2.6),
  mid: `<path class="k2-ln" d="M-38,-14 H-62 M-14,-28 H-38 M10,-42 H-14" stroke="#A8916A" stroke-width="1.6" fill="none"/>`,
  front: J(42, -90, `<g transform="rotate(-60)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0, 'k2-swing2'),
  faces: [F(22, -88, 9, 'hane', { es: .9 })], kanji: [22, -68, 12] }) },

// ===== Grado 3 =====
'森': { t: 'wood', g: 3, m: 'bosque', r: '林+木', idea: 'tres árboles: el bosque entero', h: 126, draw: t => ({
  body: 'M-60,0 C-66,-26 -52,-60 -18,-68 C10,-74 48,-62 58,-34 C64,-16 62,-4 58,0Z',
  mid: `<path d="M-57,-28 C-50,-56 -24,-66 0,-69 C24,-68 46,-58 57,-34 C49,-43 41,-39 34,-46 C26,-40 18,-44 10,-51 C2,-44 -8,-46 -14,-53 C-22,-45 -32,-46 -38,-51 C-44,-41 -51,-38 -57,-28Z" fill="${t.d}" opacity=".5"/>`,
  front: J(-32, -60, Ln('M0,0 C-1,-6 -2,-10 -3,-14', WOOD, 4.5) + tree(-3, -26, 17, t.d), 0) + J(34, -56, Ln('M0,0 C1,-6 2,-10 3,-14', WOOD, 4.5) + tree(3, -26, 17, t.d), 1.1) + J(2, -68, Ln('M0,0 V-18', WOOD, 5) + tree(0, -32, 23, '#A3D07C'), 2) + feet([-42, -16, 18, 44], t, 9),
  faces: [F(0, -33, 18, 'tome')], kanji: [0, -12, 18] }) },
'体': { t: 'earth', g: 3, m: 'cuerpo', r: '人+本', idea: 'un cuerpo entero estirado: brazos y piernas', h: 104, draw: t => ({
  body: `${circ(0, -88, 15)} M-6,-74 L-40,-90 C-46,-92 -48,-84 -44,-80 L-14,-62 L-14,-36 L-34,-4 C-36,0 -30,4 -26,0 L0,-26 L26,0 C30,4 36,0 34,-4 L14,-36 L14,-62 L44,-80 C48,-84 46,-92 40,-90 L6,-74Z`,
  mid: cord(0, -60),
  faces: [F(0, -88, 6, 'ten', { es: .62 })], kanji: [0, -44, 14] }) },
'枯': { t: 'wood', g: 3, m: 'marchitarse', r: '木+古', idea: 'un árbol seco que pierde sus hojas', h: 104, draw: t => ({
  body: 'M-16,0 L-18,-40 C-28,-50 -42,-54 -48,-66 C-38,-62 -26,-60 -18,-56 L-18,-72 C-22,-82 -20,-94 -14,-100 C-12,-90 -8,-82 -4,-74 C2,-86 12,-94 18,-98 C16,-86 10,-76 4,-66 C16,-64 30,-68 38,-76 C36,-64 26,-54 18,-50 L16,0Z',
  fill: '#9C8C5E',
  front: `<g class="k2-float">${leafFall(-44, -40, '#C9A04A')}${leafFall(40, -30, '#B5783A')}</g><g class="k2-float b">${leafFall(30, -84, '#C9A04A')}</g>`,
  faces: [F(0, -34, 8, 'tome', { es: .72, expr: 'triste' })], kanji: [0, -14, 12] }) },
'想': { t: 'wood', g: 3, m: 'imaginar', r: '相+心', idea: 'un corazón que sueña despierto', h: 124, draw: t => ({
  body: 'M0,0 C-14,-12 -40,-26 -40,-50 C-40,-66 -24,-74 -12,-68 C-6,-66 -2,-62 0,-58 C2,-62 6,-66 12,-68 C24,-74 40,-66 40,-50 C40,-26 14,-12 0,0Z',
  front: `<g class="k2-float"><circle cx="22" cy="-80" r="3" fill="${W}" stroke="${t.d}" stroke-width="1"/><circle cx="30" cy="-90" r="4.4" fill="${W}" stroke="${t.d}" stroke-width="1"/>${P('M20,-110 C16,-122 30,-130 38,-124 C44,-134 60,-130 60,-118 C70,-116 70,-102 60,-100 C58,-92 44,-92 40,-98 C32,-92 20,-96 20,-104 C14,-104 14,-110 20,-110Z', W, 2.4, `style="stroke:${t.d};stroke-width:1.2"`)}${star(40, -112, .65)}</g>`,
  faces: [F(0, -46, 13, 'hane')], kanji: [0, -26, 15] }) },
'案': { t: 'fire', g: 3, m: 'plan · propuesta', r: '安+木', idea: 'un tablero con el plan dibujado', h: 104, draw: t => ({
  body: rrect(-38, -96, 76, 66, 6),
  back: Ln('M-24,-34 L-34,0 M24,-34 L34,0 M0,-34 V-4', WOOD, 4),
  mid: `<path d="${rrect(6, -90, 28, 24, 2)}" fill="${W}"/><path class="k2-ln" d="M10,-84 H28 M10,-78 H22 M10,-72 H26" stroke="${T.water.d}" stroke-width="1.6" fill="none"/>`,
  front: J(38, -50, `<g transform="rotate(30)">${P(rrect(-2.5, -26, 5, 26, 2), GOLD, 2)}${P('M-2.5,0 L0,6 L2.5,0Z', INK, 1.4)}</g>`, 0),
  faces: [F(-12, -74, 11, 'tome')], kanji: [-6, -46, 16] }) },
'視': { t: 'water', g: 3, m: 'mirar con atención', r: '示+見', idea: 'se hace sombra con la mano para mirar mejor', h: 100, draw: t => ({
  body: `${circ(0, -58, 32)} M-14,-32 L-24,-4 C-25,0 -20,2 -17,0 L-4,-28Z M14,-32 L24,-4 C25,0 20,2 17,0 L4,-28Z`,
  front: J(-26, -76, `<g transform="rotate(-10)">${P('M0,0 C10,-6 26,-8 34,-4 C36,-2 34,2 30,2 C22,2 10,4 2,6Z', t.d, 3)}</g>`, 0) + Ln('M44,-72 l10,-4 M46,-60 h11 M44,-48 l10,4', t.d, 2.4, 2),
  faces: [F(4, -60, 0, 'tome', { es: 2.1, mouth: false })], kanji: [0, -36, 12] }) },
'故': { t: 'metal', g: 3, m: 'razón · difunto', r: '古+攵', idea: 'la tablilla de los antepasados, que guarda el porqué', h: 120, draw: t => ({
  body: 'M-22,-8 L-22,-78 C-30,-82 -32,-92 -24,-98 C-18,-104 -8,-100 0,-108 C8,-100 18,-104 24,-98 C32,-92 30,-82 22,-78 L22,-8Z',
  mid: `<path class="k2-ln" d="M-16,-76 H16 M-16,-14 H16" stroke="${GOLD}" stroke-width="2" fill="none"/>`,
  front: P(rrect(-32, -10, 64, 10, 3), t.d, 2.4) + `<g class="k2-float">${Ln('M40,-30 C34,-44 46,-52 40,-66 C36,-76 44,-84 40,-94', '#B9B2C4', 2, 2)}</g>` + P(rrect(37, -28, 6, 18, 2), WOODL, 2),
  faces: [F(0, -62, 9, 'tome', { es: .9 })], kanji: [0, -38, 16], shine: true }) },
'運': { t: 'metal', g: 3, m: 'transportar · suerte', r: '軍+辶', idea: 'lleva su carga corriendo, con su amuleto de suerte', h: 96, draw: t => ({
  body: `${circ(-6, -42, 30)} M-20,-16 L-30,-2 C-32,2 -26,4 -24,1 L-10,-14Z M8,-16 L20,-4 C22,0 28,-2 26,-6 L16,-18Z`,
  back: P(circ(22, -64, 22), T.wood.l, 3) + `<path class="k2-ln" d="M6,-74 C14,-66 30,-62 40,-70 M10,-52 C18,-58 30,-58 38,-50" stroke="${T.wood.d}" stroke-width="1.6" fill="none"/>` + P('M14,-86 C18,-94 26,-94 30,-86 L22,-82Z', SHU, 2),
  front: J(40, -60, Ln('M0,0 V10', GOLD, 1.4, 1.4) + P(rrect(-5, 10, 10, 15, 2), SHU, 2) + `<path d="M-3,14 H3" stroke="${GOLD}" stroke-width="1.4"/>`, 0, 'k2-swing2') + Ln('M-46,-54 h-12 M-44,-40 h-16 M-46,-26 h-10', t.d, 2.4, 2),
  faces: [F(-10, -46, 12, 'harai')], kanji: [-6, -22, 15], shine: true }) },
'症': { t: 'earth', g: 3, m: 'síntoma', r: '疒+正', idea: 'con fiebre, termómetro y bolsa de hielo', h: 88, draw: t => ({
  body: circ(0, -38, 34),
  back: P('M-24,-66 C-24,-80 24,-80 24,-66 C14,-72 -14,-72 -24,-66Z', T.water.l, 2.6),
  front: J(6, -26, `<g transform="rotate(20)">${P(rrect(0, -2.5, 30, 5, 2.5), W, 2)}${P(circ(32, 0, 4), SHU, 1.8)}</g>`, 0) + `<g class="k2-float">${drop(-40, -60, .45, T.water.l)}</g>`,
  faces: [F(-4, -44, 13, 'tome', { expr: 'triste', mouth: false })], kanji: [-4, -16, 14] }) },
'待': { t: 'earth', g: 3, m: 'esperar', r: '彳+寺', idea: 'sentado con su reloj de arena, esperando', h: 82, draw: t => ({
  body: 'M-30,0 C-36,-14 -34,-40 -26,-52 C-18,-66 14,-66 22,-52 C30,-40 30,-14 26,0Z',
  back: P(rrect(-46, -24, 92, 8, 3), WOOD, 2.4) + Ln('M-40,-16 V0 M40,-16 V0', WOOD, 4),
  front: J(26, -30, P('M0,-16 h14 v3 l-5,5 l5,5 v3 h-14 v-3 l5,-5 l-5,-5Z', '#E9D7AE', 2.2) + `<path d="M4,-2 h6 l1,2 h-8Z" fill="#C79A3C"/>`, 0, 'k2-swing2'),
  faces: [F(-2, -44, 12, 'tome')], kanji: [-2, -20, 15] }) },
'持': { t: 'metal', g: 3, m: 'tener · sostener', r: '手+寺', idea: 'sostiene en alto un cajón con las dos manos', h: 114, draw: t => ({
  body: circ(0, -40, 32),
  front: J(-28, -54, `<g transform="rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(28, -54, `<g transform="scale(-1 1) rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .5)
    + `<g class="k2-float">${P(rrect(-22, -106, 44, 30, 4), WOODL, 2.6)}<path class="k2-ln" d="M-22,-96 H22 M-22,-86 H22" stroke="${WOOD}" stroke-width="1.6" fill="none"/></g>` + feet([-16, 16], t, 8, -1),
  faces: [F(0, -44, 13, 'ten')], kanji: [0, -20, 15], shine: true }) },
'時': { t: 'fire', g: 3, m: 'tiempo · hora', r: '日+寺', idea: 'un reloj con techo de templo; sus brazos son las agujas', h: 112, draw: t => { let ticks = '';
    for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); ticks += `M${(c * 34).toFixed(1)},${(-46 + s * 34).toFixed(1)} L${(c * (i % 3 ? 37 : 39)).toFixed(1)},${(-46 + s * (i % 3 ? 37 : 39)).toFixed(1)} `; }
    return { body: circ(0, -46, 42),
      back: rays(0, -46, [[-60, .95], [-30, 1.05], [0, 1.12], [30, 1.05], [60, .95]].map(([a, l]) => [a, l + .2]), t),
      mid: `<path class="k2-ln" d="${ticks}" stroke="${t.d}" stroke-width="2" fill="none" stroke-linecap="round"/>`,
      front: P('M-30,-86 C-20,-90 -12,-98 -6,-106 L6,-106 C12,-98 20,-90 30,-86 L24,-82 L-24,-82Z', '#8E3428') + P(circ(0, -110, 3.5), GOLD, 2)
        + J(-40, -48, `<g transform="rotate(-150)">${P(rrect(0, -3, 20, 6, 3), INK, 2)}</g>`, 0) + J(40, -48, `<g transform="rotate(-60)">${P(rrect(0, -2.5, 28, 5, 2.5), INK, 2)}</g>`, 1) + feet([-16, 16], t, 9),
      faces: [F(0, -60, 14, 'tome')], kanji: [0, -30, 18] }; } },
'居': { t: 'metal', g: 3, m: 'residir', r: '尸+古', idea: 'una casa de techo de paja donde vive', h: 100, draw: t => ({
  body: 'M-36,-2 L-36,-50 L-52,-50 L0,-98 L52,-50 L36,-50 L36,-2Z',
  front: P('M-54,-48 L0,-98 L54,-48 L44,-46 L0,-86 L-44,-46Z', '#C9A45C') + `<path class="k2-ln" d="M-30,-60 L-20,-56 M24,-58 L32,-62 M-6,-80 L4,-82" stroke="#A88440" stroke-width="1.6" fill="none"/>`,
  faces: [F(0, -36, 12, 'ten')], kanji: [0, -13, 13] }) },
'延': { t: 'earth', g: 3, m: 'extender', r: '正+廴', idea: 'estirándose de punta a punta', h: 48, draw: t => ({
  body: 'M-62,-20 C-62,-34 -52,-40 -38,-40 H38 C52,-40 62,-34 62,-20 C62,-6 52,0 38,0 H-38 C-52,0 -62,-6 -62,-20Z',
  front: J(-60, -22, `<g transform="scale(-1 1)">${P('M0,0 C8,-4 16,-4 22,0 C16,4 8,4 0,0Z', t.d, 2.6)}</g>`, 0, 'k2-swing2') + J(60, -22, P('M0,0 C8,-4 16,-4 22,0 C16,4 8,4 0,0Z', t.d, 2.6), .5, 'k2-swing2') + Ln('M-20,-48 H20 M-14,-52 L-20,-48 L-14,-44 M14,-52 L20,-48 L14,-44', t.d, 2, 2),
  faces: [F(-32, -22, 10, 'hane')], kanji: [24, -20, 15] }) },
'禁': { t: 'wood', g: 3, m: 'prohibir', r: '林+示', idea: 'cuerda sagrada y brazos en cruz: no se pasa', h: 114, draw: t => ({
  body: rrect(-32, -82, 64, 80, 10),
  back: J(-22, -82, Ln('M0,0 V-8', WOOD, 3.5) + tree(0, -16, 12, t.d), 0) + J(22, -82, Ln('M0,0 V-8', WOOD, 3.5) + tree(0, -16, 12, '#A3D07C'), .8),
  front: Ln('M-36,-76 C-12,-70 12,-70 36,-76', '#D9B66C', 5, 3) + shide(-14, -72) + shide(14, -72)
    + P('M-28,-48 L22,-22 L28,-30 L-22,-56Z', t.d, 2.6) + P('M28,-48 L-22,-22 L-28,-30 L22,-56Z', t.d, 2.6),
  faces: [F(0, -60, 12, 'harai', { brow: true, mouth: false })], kanji: [0, -14, 14] }) },
'意': { t: 'earth', g: 3, m: 'intención · mente', r: '音+心', idea: 'una mente con su intención: la flecha marca adónde va', h: 98, draw: t => ({
  body: circ(0, -46, 36),
  back: `<path class="k2-ln" d="${ell(0, -74, 46, 11)}" stroke="${t.d}" stroke-width="2" stroke-dasharray="3 4" fill="none"/>`,
  front: J(42, -76, P('M0,0 L12,-4 L10,-10 L22,-2 L10,6 L12,0Z', SHU, 2), 0, 'k2-swing2') + heartP(24, -22, .5),
  faces: [F(0, -54, 14, 'tome')], kanji: [0, -26, 17] }) },
'億': { t: 'earth', g: 4, m: 'cien millones', r: '人+意', idea: 'rodeado de tantos puntos que no se pueden contar', h: 112, draw: t => { let dots = '';
    for (let i = 0; i < 70; i++) { const a = i * 2.4, rr = 40 + (i % 9) * 4 + i * .25; dots += `<circle cx="${(Math.cos(a) * rr).toFixed(1)}" cy="${(-46 + Math.sin(a) * rr * .8).toFixed(1)}" r="${(1 + (i % 3) * .5).toFixed(1)}" fill="${i % 4 ? GOLD : t.d}"/>`; }
    return { body: circ(0, -44, 32), back: `<g class="k2-halo">${dots}</g>`,
      faces: [F(0, -50, 13, 'maru')], kanji: [0, -24, 16] }; } },
'憶': { t: 'fire', g: 4, m: 'recordar', r: '心+意', idea: 'un corazón con una cinta para no olvidar', h: 108, draw: t => ({
  body: 'M0,0 C-14,-12 -44,-28 -44,-54 C-44,-72 -26,-82 -12,-74 C-6,-72 -2,-68 0,-64 C2,-68 6,-72 12,-74 C26,-82 44,-72 44,-54 C44,-28 14,-12 0,0Z',
  front: J(40, -56, `<g transform="rotate(-30)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>` + P('M10,6 l-6,-6 l2,8Z M10,6 l6,-6 l-2,8Z', SHU, 1.6), 0, 'k2-swing2')
    + `<g class="k2-float">${P(rrect(-60, -104, 30, 24, 2), W, 2.4)}<path d="M-56,-86 L-50,-94 L-44,-88 L-38,-96 L-34,-86Z" fill="${T.wood.f}"/><circle cx="-38" cy="-98" r="2.4" fill="${GOLD}"/></g>`,
  faces: [F(0, -52, 15, 'tome')], kanji: [0, -30, 16] }) },

// ===== Grado 5 =====
  // ===== Restaurados (roster original) =====
'喿': { t: 'metal', g: 3, m: 'piar de pájaros', r: '品+木', idea: 'pajaritos que pían en las ramas', h: 138, draw: t => ({
  body: 'M0,-96 C22,-96 32,-76 32,-50 L38,0 L-38,0 L-32,-50 C-32,-76 -22,-96 0,-96Z',
  front: J(-14, -90, Ln('M0,0 C-10,-12 -22,-16 -34,-16', WOOD, 4.5) + boxBird(-36, -16, 1, t, -1), 0) + J(14, -90, Ln('M0,0 C10,-14 22,-20 36,-22', WOOD, 4.5) + boxBird(38, -22, 1, t), 1.2) + J(0, -96, Ln('M0,0 V-20', WOOD, 4.5) + boxBird(0, -20, 1, t), 2.1)
    + J(-33, -46, P('M0,0 C-8,2 -16,8 -18,18 C-10,16 -2,10 2,4Z', t.d, 3), .3) + J(33, -46, P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3), 1.6),
  faces: [F(0, -64, 14, 'maru', { mouth: 'open' })], kanji: [0, -28, 21], shine: true }) },
'澡': { t: 'water', g: 4, m: 'lavar', r: '水+喿', idea: 'una ola que se lava en la tina', h: 134, draw: t => ({
  body: 'M-38,0 C-44,-30 -42,-74 -20,-96 C-8,-108 10,-114 22,-106 C34,-98 38,-86 28,-80 C22,-88 10,-88 8,-80 C26,-72 42,-50 42,-24 C42,-8 38,-2 36,0Z',
  front: P('M-45,-30 h90 l-6,30 h-78Z', WOODL, 3) + `<path class="k2-ln" d="M-44,-22 h88 M-41,-8 h82" stroke="${WOOD}" stroke-width="3" fill="none"/>` + boxBird(-18, -100, .9, T.metal, -1)
    + `<g class="k2-float">${bubble(-52, -74, 6, t)}${bubble(-60, -54, 4, t)}</g><g class="k2-float b">${bubble(54, -98, 5, t)}${bubble(60, -78, 3.5, t)}</g>`
    + J(-39, -52, P('M0,0 C-10,-4 -16,-12 -16,-22 C-8,-20 0,-12 3,-4Z', t.d, 3), 0, 'k2-swing2') + J(39, -52, P('M0,0 C10,-4 16,-12 16,-22 C8,-20 0,-12 -3,-4Z', t.d, 3), .7, 'k2-swing2'),
  faces: [F(0, -66, 15, 'ten', { expr: 'feliz' })], kanji: [0, -45, 19] }) },
'焚': { t: 'wood', g: 3, m: 'quemar', r: '林+火', idea: 'una fogata de leños encendidos', h: 116, draw: t => ({
  body: 'M-46,0 L-14,-62 L14,-62 L46,0Z',
  fill: '#B48A5E',
  back: P('M0,-112 C10,-96 30,-86 32,-66 C34,-56 24,-50 0,-50 C-24,-50 -34,-56 -32,-66 C-30,-80 -18,-84 -12,-96 C-8,-88 -4,-88 -2,-94 C-4,-102 -2,-108 0,-112Z', T.fire.f) + P('M0,-84 C6,-76 16,-70 16,-60 C16,-54 8,-52 0,-52 C-8,-52 -16,-54 -16,-60 C-16,-68 -6,-72 0,-84Z', GLOW, 2.4),
  mid: `<path class="k2-ln" d="M-30,-30 L30,-30 M-22,-46 L22,-46" stroke="${WOOD}" stroke-width="2" fill="none"/>`,
  front: `<g class="k2-float"><g transform="translate(-44 -70) scale(.7)">${flame(T.fire.f, T.fire.l)}</g></g><g class="k2-float b"><g transform="translate(46 -80) scale(.6)">${flame(T.fire.f, T.fire.l)}</g></g>`,
  faces: [F(0, -32, 11, 'harai', { es: .9 })], kanji: [0, -10, 14] }) },
'杏': { t: 'wood', g: 2, m: 'albaricoque', r: '木+口', idea: 'un albaricoque con su hoja', h: 94, draw: t => ({
  body: 'M0,-70 C-6,-74 -20,-76 -32,-66 C-44,-54 -42,-24 -26,-10 C-14,0 14,0 26,-10 C42,-24 44,-54 32,-66 C20,-76 6,-74 0,-70Z',
  fill: '#E9A65A',
  back: Ln('M0,-70 C1,-78 2,-84 4,-88', WOOD, 3.4) + J(4, -86, `<g transform="rotate(-10) scale(.7)">${leafR(t.f, t.l)}</g>`, .2),
  mid: Ln('M10,-68 C16,-50 18,-30 12,-10', '#C9813A', 2.2, 0),
  faces: [F(-6, -42, 13, 'ten')], kanji: [-6, -19, 15] }) },
'朋': { t: 'water', g: 2, m: 'compañero', r: '月+月', idea: 'dos lunas que se toman de la mano', h: 92, draw: t => ({
  body: 'M-6,-86 A42,42 0 1,0 -6,-6 A62,62 0 0,1 -6,-86Z M6,-86 A42,42 0 1,1 6,-6 A62,62 0 0,0 6,-86Z',
  front: P(ell(0, -46, 9, 7), t.d, 2.6) + `<g class="k2-float">${star(0, -98, .6)}</g>`,
  faces: [F(-36, -56, 8, 'ten', { es: .8 }), F(36, -56, 8, 'ten', { es: .8 })], kanji: [-36, -30, 14] }) },
'享': { t: 'metal', g: 2, m: 'recibir · disfrutar', r: '亠+口+子', idea: 'recibe un plato de dulces y lo disfruta', h: 108, draw: t => ({
  body: circ(0, -40, 34),
  front: J(-28, -54, `<g transform="rotate(-70)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(28, -54, `<g transform="scale(-1 1) rotate(-70)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .5)
    + `<g class="k2-float">${P('M-18,-84 H18 C16,-74 8,-70 0,-70 C-8,-70 -16,-74 -18,-84Z', WOODL, 2.6)}${P(circ(-6, -90, 6), W, 2)}${P(circ(6, -91, 6), PINK, 2)}${P(circ(0, -98, 6), '#A3D07C', 2)}</g>`,
  faces: [F(0, -44, 14, 'ten', { expr: 'feliz' })], kanji: [0, -20, 16], shine: true }) },
'襟': { t: 'wood', g: 4, m: 'cuello (de ropa)', r: '衣+禁', idea: 'el cuello cruzado de un kimono', h: 94, draw: t => ({
  body: 'M-46,0 L-44,-70 C-40,-84 -24,-90 -14,-90 L0,-74 L14,-90 C24,-90 40,-84 44,-70 L46,0Z',
  front: P('M-14,-90 L10,-58 L20,-62 L2,-90Z', W, 2.6) + P('M14,-90 L-8,-54 L-18,-60 L0,-86Z', T.wood.l, 2.6) + P(rrect(-44, -30, 88, 8, 2), t.d, 2.2),
  faces: [F(0, -42, 14, 'tome', { es: .9 })], kanji: [0, -12, 15] }) },
'藻': { t: 'wood', g: 5, m: 'alga', r: '艸+澡', idea: 'un alga alta que ondula entre burbujas', h: 166, draw: t => ({
  body: 'M-8,0 C-26,-20 -32,-50 -20,-80 C-10,-104 -18,-130 -4,-158 C10,-134 22,-110 18,-86 C14,-62 28,-38 24,-16 C22,-6 12,0 -8,0Z',
  front: P(ell(-2, -2, 28, 6), '#9A9388', 2.4)
    + J(20, -96, `<g transform="rotate(-24)">${frond('#5E9E5A', t.l)}</g>`, 0) + J(24, -50, `<g transform="rotate(10)">${frond(t.d, t.l)}</g>`, 1) + J(-22, -70, `<g transform="scale(-1 1) rotate(-6)">${frond(t.d, t.l)}</g>`, 1.5) + J(-24, -30, `<g transform="scale(-1 1) rotate(20) scale(.8)">${frond('#5E9E5A', t.l)}</g>`, 2.2)
    + `<g class="k2-float">${bubble(-40, -140, 6, T.water)}${bubble(-50, -156, 4, T.water)}</g><g class="k2-float b">${bubble(40, -136, 5, T.water)}${bubble(46, -20, 4, T.water)}</g>`,
  faces: [F(-4, -112, 9, 'harai', { es: .95 })], kanji: [2, -54, 18] }) },
'薪': { t: 'wood', g: 3, m: 'leña', r: '艸+新', idea: 'un atado de leña recién cortada', h: 100, draw: t => ({
  body: `${rrect(-38, -80, 20, 80, 9)} ${rrect(-19, -86, 20, 86, 9)} ${rrect(0, -82, 20, 82, 9)} ${rrect(19, -78, 20, 78, 9)}`,
  fill: '#B48A5E',
  mid: [[-28, -80], [-9, -86], [10, -82], [29, -78]].map(([x, y]) => `<path d="${ell(x, y + 4, 8, 4)}" fill="#F2DAB2"/>`).join('') + `<path class="k2-ln" d="M-38,-30 H39" stroke="${SHU}" stroke-width="3" fill="none"/>`,
  back: J(-4, -88, P('M0,0 C-4,-10 -10,-16 -16,-20 C-8,-18 -2,-12 2,-2Z', t.f, 2.4) + P('M0,0 C2,-12 6,-18 10,-22 C10,-14 8,-8 4,0Z', t.d, 2.4), 0),
  faces: [F(0, -60, 14, 'ten')], kanji: [0, -14, 15] }) },
'燥': { t: 'fire', g: 4, m: 'secar', r: '火+喿', idea: 'su calor seca la ropa tendida', h: 126, draw: t => ({
  body: 'M0,0 C-30,0 -46,-16 -46,-40 C-46,-62 -28,-70 -20,-88 C-16,-96 -8,-100 0,-104 C8,-100 16,-96 20,-88 C28,-70 46,-62 46,-40 C46,-16 30,0 0,0Z',
  back: Ln('M-58,-112 C-30,-104 30,-104 58,-112', WOOD, 2, 2),
  front: J(-26, -106, P('M-12,0 H12 V22 L6,26 L0,22 L-6,26 L-12,22Z', W, 2.2) + `<path class="k2-ln" d="M-12,6 H12" stroke="${T.water.f}" stroke-width="2" fill="none"/>`, 0) + J(28, -106, P('M-10,0 H10 V18 H-10Z', T.water.l, 2.2), 1)
    + `<g class="k2-float">${Ln('M-26,-70 c-4,-6 4,-10 0,-16 M30,-74 c-4,-6 4,-10 0,-16', '#B9B2C4', 1.8, 1.6)}</g>` + feet([-18, 18], t, 9),
  faces: [F(0, -46, 15, 'harai')], kanji: [0, -20, 18] }) },
'繰': { t: 'wood', g: 4, m: 'devanar · enrollar', r: '糸+喿', idea: 'un carrete que enrolla su hilo', h: 92, draw: t => ({
  body: 'M-38,-84 H38 V-72 H28 V-16 H38 V-4 H-38 V-16 H-28 V-72 H-38Z',
  fill: '#B48A5E',
  mid: `<path d="M-28,-72 H28 V-16 H-28Z" fill="${t.f}"/><path class="k2-ln" d="${Array.from({ length: 7 }, (_, i) => `M-28,${-68 + i * 8} L28,${-64 + i * 8}`).join(' ')}" stroke="${t.d}" stroke-width="1.6" fill="none" opacity=".7"/>`,
  front: J(38, -40, Ln('M0,0 C12,4 18,-6 26,-2 C32,2 30,12 24,12', t.d, 2.4, 2), 0) + J(-38, -44, P(rrect(-14, -2, 14, 4, 2), WOOD, 2) + P(circ(-16, 0, 4), GOLD, 1.6), .5, 'k2-swing2'),
  faces: [F(0, -52, 11, 'ten')], kanji: [0, -28, 15] }) },
'操': { t: 'metal', g: 4, m: 'manejar', r: '手+喿', idea: 'mueve con hilos un pajarito de papel', h: 118, draw: t => ({
  body: circ(-6, -40, 32),
  front: J(-6, -74, P(rrect(-24, -40, 48, 6, 3), WOOD, 2.4) + P(rrect(-3, -52, 6, 30, 3), WOOD, 2.4) + `<path class="k2-ln" d="M-22,-34 L30,10 M22,-34 L44,6 M0,-22 L38,2" stroke="#8C8A96" stroke-width="1" fill="none"/>` + boxBird(40, 18, 1, t), 0)
    + J(-34, -54, `<g transform="rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(22, -56, `<g transform="scale(-1 1) rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .4),
  faces: [F(-6, -44, 12, 'hane')], kanji: [-6, -20, 15], shine: true }) },
'盟': { t: 'fire', g: 3, m: 'alianza', r: '明+皿', idea: 'sol y luna se dan la mano sobre el plato', h: 104, draw: t => ({
  body: `${circ(0, -62, 30)} M-50,-26 C-46,-10 -30,-4 -16,-4 L-16,0 L16,0 L16,-4 C30,-4 46,-10 50,-26Z`,
  back: rays(0, -62, [[-150, .8], [-120, .9], [-90, .8], [-60, .9]], t),
  mid: `<path d="M0,-92 A30,30 0 0,1 0,-32Z" fill="${T.water.f}"/><path d="${ell(0, -26, 50, 5)}" fill="${T.earth.l}" stroke="${W}" stroke-width="2" paint-order="stroke"/>`,
  front: P(ell(0, -36, 10, 6), t.d, 2.6),
  faces: [F(0, -66, 13, 'tome')], kanji: [0, -14, 12] }) },
'晶': { t: 'fire', g: 2, m: 'cristal', r: '日+日+日', idea: 'un racimo de cristales que brillan', h: 112, draw: t => ({
  body: 'M-18,-4 L-18,-86 L0,-108 L18,-86 L18,-4Z M-46,-4 L-56,-52 L-46,-70 L-28,-60 L-20,-14Z M46,-4 L56,-50 L46,-68 L28,-58 L20,-14Z',
  mid: `<path class="k2-ln" d="M0,-108 V-80 M-18,-86 L0,-80 L18,-86 M-46,-70 L-40,-46 M46,-68 L40,-44" stroke="${W}" stroke-width="1.8" fill="none" opacity=".7"/>`,
  front: P(ell(0, -4, 52, 7), '#9A9388', 2.6) + `<g class="k2-float">${star(-56, -86, .7)}</g><g class="k2-float b">${star(58, -90, .6)}</g>`,
  faces: [F(0, -64, 9, 'maru', { es: .8 })], kanji: [0, -32, 15] }) },
'旬': { t: 'fire', g: 2, m: 'temporada', r: '勹+日', idea: 'un sol envuelto por las cuatro estaciones', h: 94, draw: t => ({
  body: circ(0, -44, 32),
  back: Ln('M-30,-68 C-50,-50 -48,-18 -24,-6', t.d, 6, 3),
  front: `<g class="k2-float">${P(flower5(-46, -76, 7), PINK, 2)}${P(circ(46, -76, 7), GOLD, 2)}</g><g class="k2-float b">${P('M48,-30 l4,-8 l4,8 l8,-2 l-6,6 l6,6 l-8,-2 l-4,8 l-4,-8 l-8,2 l6,-6 l-6,-6Z', SHU, 2)}${Ln('M-52,-36 V-16 M-61,-31 L-43,-21 M-61,-21 L-43,-31', '#9FC6E6', 2, 2)}</g>` + feet([-14, 14], t, 8, -1),
  faces: [F(0, -50, 13, 'ten')], kanji: [0, -26, 16] }) },
'杉': { t: 'wood', g: 2, m: 'cedro japonés', r: '木+彡', idea: 'un cedro alto con capas de agujas', h: 124, draw: t => ({
  body: 'M0,-122 C6,-108 14,-98 12,-92 C22,-82 26,-72 22,-66 C34,-54 38,-42 34,-36 C44,-24 46,-12 40,-8 L-40,-8 C-46,-12 -44,-24 -34,-36 C-38,-42 -34,-54 -22,-66 C-26,-72 -22,-82 -12,-92 C-14,-98 -6,-108 0,-122Z',
  back: P(rrect(-6, -10, 12, 10, 3), WOOD, 2.4),
  mid: `<path class="k2-ln" d="M-14,-92 C-6,-88 6,-88 14,-92 M-24,-66 C-10,-60 10,-60 24,-66 M-36,-36 C-14,-30 14,-30 36,-36" stroke="${t.d}" stroke-width="2" fill="none"/>`,
  faces: [F(0, -50, 11, 'tome')], kanji: [0, -22, 15] }) },
};

// ---------- Roster v2 (noviembre de 2026): 192 criaturas nuevas ----------
// Misma firma que las anteriores. Tipo, grado y receta salen de js/data.js; aquí va solo la forma.
const tab = (x, y, w, h) => rrect(x - w / 2, y - h, w, h, Math.min(8, h / 2.4));
const pers = (x, y, s = 1) => `${circ(x, y - 37 * s, 11 * s)} M${x - 9 * s},${y - 27 * s} L${x - 15 * s},${y} L${x + 15 * s},${y} L${x + 9 * s},${y - 27 * s}Z`;
const house = (x, y, w, h, r) => `M${x - w / 2 - 8},${y - h + 2} L${x},${y - h - r} L${x + w / 2 + 8},${y - h + 2}Z ${rrect(x - w / 2, y - h, w, h, 3)}`;
const cloud = (x, y, s = 1) => `${circ(x, y - 6 * s, 20 * s)} ${circ(x - 22 * s, y, 15 * s)} ${circ(x + 22 * s, y, 15 * s)} ${ell(x, y + 6 * s, 38 * s, 12 * s)}`;
const mound = (w, h, x = 0) => `M${x - w},0 C${x - w},${-h * 1.3} ${x + w},${-h * 1.3} ${x + w},0Z`;
const sunD = (x, y, r) => P(circ(x, y, r), GOLD, 2.6);
const moonD = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M4,-14 A14,14 0 1,0 4,14 A20,20 0 0,1 4,-14Z', GLOW, 2.4)}</g>`;
const bar = (x, y, w, h, c, sw = 2.6) => P(rrect(x, y, w, h, Math.min(4, h / 2)), c, sw);
const waves = (x, y, t, d = 1) => Ln(`M${x},${y - 8} q${6 * d},8 0,16 M${x + 8 * d},${y - 13} q${9 * d},13 0,26`, t.d, 2.2, 2);
const sprout = (x, y, s = .5) => J(x, y, `<g transform="scale(${s})">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .4);
const arrowP = (x, y, rot, c, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P('M0,-16 L10,-2 L4,-2 L4,14 L-4,14 L-4,-2 L-10,-2Z', c, 2.4)}</g>`;
const bowl = (x, y, w) => `M${x - w},${y - w * .7} H${x + w} C${x + w},${y - w * .1} ${x + w * .5},${y} ${x},${y} C${x - w * .5},${y} ${x - w},${y - w * .1} ${x - w},${y - w * .7}Z`;
const steam = (x, y, c) => `<g class="k2-float">${Ln(`M${x - 8},${y} q-5,-8 0,-14 q5,-6 0,-12 M${x + 8},${y} q-5,-8 0,-14 q5,-6 0,-12`, c, 2.2, 2)}</g>`;
const gate = 'M-46,-84 H-6 V0 H-46Z M6,-84 H46 V0 H6Z';
const ear = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,-18 C12,-18 16,-6 12,4 C10,12 4,18 -2,14 C-6,10 -2,4 -2,0 C-8,-2 -10,-14 0,-18Z', c, 2.6)}${Ln('M2,-10 C8,-8 8,0 2,4', INK, 1.6, 0)}</g>`;
const sword = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P('M-3,-46 C2,-48 5,-40 4,-8 L-4,-8Z', T.metal.l, 2.4)}${bar(-9, -8, 18, 5, GOLD, 2)}${bar(-3, -3, 6, 16, WOOD, 2)}</g>`;
const shell = (x, y, s, c, l) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,0 C-18,0 -22,-14 -14,-24 C-8,-30 8,-30 14,-24 C22,-14 18,0 0,0Z', c, 2.6)}${Ln('M0,-2 V-26 M-7,-3 L-11,-22 M7,-3 L11,-22', l, 1.5, 0)}</g>`;
const flowerP = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})">${[0, 72, 144, 216, 288].map(a => `<g transform="rotate(${a})">${P('M0,-4 C-7,-12 -5,-20 0,-22 C5,-20 7,-12 0,-4Z', c, 2)}</g>`).join('')}<circle r="4.5" fill="${GOLD}"/></g>`;
const N = (k, idea, h, draw) => { D[k] = { t: typeOf(k), g: kLevel(k), m: KANJI[k].m, r: (KANJI[k].recipes?.[0] || []).join('+'), idea, h, draw }; };

// ===== Grado 1 · Números y dinero =====
N('二', 'dos tablillas de papel apiladas', 54, t => ({ body: `${tab(0, -27, 78, 20)} ${tab(0, 0, 96, 24)}`, front: feet([-30, 30], t, 7, 1),
  faces: [F(-18, -15, 10, 'ten', { es: .8 })], kanji: [24, -13, 13] }));
N('五', 'un carrete de hilo con cinco vueltas', 86, t => ({ body: `${tab(0, -70, 70, 14)} ${tab(0, -14, 46, 58)} ${tab(0, 0, 70, 16)}`,
  mid: Ln('M-23,-66 H23 M-23,-61 H23 M-23,-56 H23 M-23,-22 H23 M-23,-27 H23', SHU, 1.8, 0),
  faces: [F(0, -45, 8, 'tome', { es: .75 })], kanji: [0, -8, 11] }));
N('七', 'un anzuelo de papel que cruza una línea', 84, t => ({ body: 'M-50,-52 L44,-70 L48,-54 L-46,-36Z M-8,-82 H10 V-22 C10,-12 18,-10 46,-12 L46,4 C10,6 -8,2 -8,-18Z',
  front: feet([0], t, 9, 2), faces: [F(1, -42, 0, 'hane', { es: .8, dir: 1 })], kanji: [30, -4, 11] }));
N('八', 'un abanico que se abre en dos', 80, t => ({ body: 'M-8,-76 C-12,-40 -30,-14 -54,-2 C-56,2 -50,6 -44,4 C-14,-8 4,-40 8,-74Z M10,-70 C16,-40 34,-14 56,-2 C58,2 52,6 46,4 C22,-8 2,-36 -2,-66Z',
  mid: Ln('M-30,-22 L-20,-30 M30,-22 L20,-30', t.l, 1.6, 0),
  faces: [F(-22, -24, 0, 'ten', { es: .8 }), F(24, -24, 0, 'ten', { es: .8, mouth: false })], kanji: [2, -58, 11] }));
N('九', 'un brazo doblado que se estira', 86, t => ({ body: 'M-20,-84 H-4 V-62 H26 C34,-62 36,-56 36,-48 V-14 C36,-8 42,-8 52,-10 L52,4 C30,8 20,4 20,-12 V-46 H-4 C-6,-24 -20,-6 -44,2 C-50,2 -52,-6 -46,-10 C-28,-18 -20,-34 -20,-52Z',
  front: hand(-22, -84, 0, .55, t.d), faces: [F(8, -54, 8, 'harai', { es: .7 })], kanji: [36, -30, 10] }));
N('千', 'un diez con una pluma en la cabeza', 96, t => ({ body: `${tab(0, -44, 96, 18)} ${tab(0, 0, 20, 78)}`,
  back: J(4, -78, `<g transform="rotate(-30) scale(.8)">${leafR(t.d, t.l)}</g>`, .3),
  front: feet([0], t, 9, 2), faces: [F(-26, -53, 8, 'ten', { es: .75 })], kanji: [28, -53, 11] }));
N('万', 'un fajo de billetes doblado', 80, t => ({ body: `${tab(0, -58, 100, 18)} M-14,-60 H4 C2,-30 -12,-10 -40,2 C-46,2 -48,-6 -42,-10 C-24,-18 -14,-38 -14,-60Z M-2,-46 H38 C44,-46 44,-40 44,-34 C42,-14 36,0 20,4 C14,4 12,-4 18,-8 C26,-12 28,-22 28,-32 H-2Z`,
  mid: Ln('M-40,-72 V-62 M-28,-72 V-62 M28,-72 V-62 M40,-72 V-62', t.d, 1.6, 0),
  faces: [F(0, -67, 8, 'tome', { es: .7 })], kanji: [20, -22, 11] }));
N('円', 'una moneda redonda con ventanilla', 92, t => ({ body: circ(0, -44, 42), mid: P(rrect(-14, -52, 28, 20, 3), t.d, 2) + `<path d="M-10,-48 h20 v12 h-20Z" fill="${t.l}"/>`,
  front: feet([-14, 14], t, 8, -1), faces: [F(0, -66, 12, 'maru', { es: .85 })], kanji: [0, -18, 14] }));
N('金', 'una montañita con pepitas brillantes', 92, t => ({ body: 'M0,-88 L50,-34 L40,-30 L46,0 H-46 L-40,-30 L-50,-34Z', fill: GOLD,
  front: `<g class="k2-float">${star(-40, -76, .6)}${star(44, -70, .5)}</g>` + P(circ(-24, -8, 5), GLOW, 2) + P(circ(24, -8, 5), GLOW, 2),
  faces: [F(0, -52, 11, 'maru')], kanji: [0, -20, 15] }));
// ===== Tiempo =====
N('年', 'un atado de espigas cargado al hombro', 100, t => ({ body: 'M-34,-58 C-38,-30 -30,-6 -20,0 H20 C30,-6 38,-30 34,-58Z M-26,-56 L-36,-96 L-18,-78 L-8,-100 L0,-78 L10,-100 L18,-78 L36,-96 L26,-56Z',
  mid: `<path d="M-33,-52 H33 L32,-44 H-32Z" fill="${SHU}"/>`, faces: [F(0, -34, 11, 'tome')], kanji: [0, -10, 13] }));
N('午', 'el palo de un reloj de sol', 96, t => ({ body: `${ell(0, -10, 50, 12)} ${tab(0, -8, 16, 80)}`, back: sunD(0, -92, 12),
  mid: `<path d="M8,-10 L44,-6 L8,-2Z" fill="${INK}" opacity=".3"/>`, faces: [F(0, -62, 0, 'ten', { es: .7, mouth: false })], kanji: [-26, -10, 11] }));
N('半', 'una hoja partida en dos mitades', 86, t => ({ body: 'M-6,-84 C-40,-80 -52,-40 -40,-10 C-34,0 -16,2 -6,0Z M6,-84 C40,-80 52,-40 40,-10 C34,0 16,2 6,0Z',
  mid: Ln('M-6,-70 L-10,-58 L-6,-46 L-10,-34 L-6,-22 M6,-70 L10,-58 L6,-46 L10,-34 L6,-22', t.d, 1.6, 0),
  faces: [F(-25, -48, 0, 'ten', { es: .85 }), F(25, -48, 0, 'ten', { es: .85, mouth: false })], kanji: [-24, -20, 12] }));
N('夕', 'media luna que asoma entre nubes', 92, t => ({ body: 'M10,-88 A44,44 0 1,0 10,-2 A64,64 0 0,1 10,-88Z', back: P(cloud(26, -22, .7), '#F6C7A8', 2.6),
  front: `<g class="k2-float">${star(40, -76, .5)}</g>`, faces: [F(-22, -50, 9, 'dormido', { es: .9, expr: 'dormido' })], kanji: [-22, -26, 14] }));
N('毎', 'una figura con sombrero que repite un gesto', 96, t => ({ body: `${pers(0, 0, 1.5)}`, back: P('M-34,-66 L0,-96 L34,-66Z', t.d, 3),
  front: `<g class="k2-rot" transform="translate(40 -40)">${Ln('M-10,0 A10,10 0 1,1 0,10', SHU, 2.6, 2)}<path d="M-3,6 L3,10 L-3,14Z" fill="${SHU}"/></g>`,
  faces: [F(0, -56, 7, 'tome', { es: .75 })], kanji: [0, -16, 14] }));
N('冬', 'un pie que pisa dos cristales de hielo', 90, t => ({ body: 'M-10,-86 C10,-88 22,-76 22,-58 C22,-44 30,-36 44,-34 C52,-32 54,-22 46,-18 H-30 C-40,-18 -42,-30 -34,-36 C-22,-44 -18,-60 -22,-74 C-22,-82 -16,-86 -10,-86Z',
  front: P('M-30,-12 L-18,-12 L-12,0 L-36,0Z', T.water.l, 2.4) + P('M12,-12 L24,-12 L30,0 L6,0Z', T.water.l, 2.4) + `<g class="k2-float">${star(-44, -70, .5)}</g>`,
  faces: [F(-2, -62, 8, 'tome', { es: .8 })], kanji: [8, -34, 12] }));
N('先', 'una figura que camina adelantada', 96, t => ({ body: `${pers(-8, 0, 1.55)}`, front: arrowP(40, -60, 90, SHU, .9) + J(-22, -8, P('M0,0 L-18,10 L-14,16 L4,8Z', t.d, 2.6), 0, 'k2-swing2'),
  faces: [F(-6, -58, 7, 'harai', { es: .75 })], kanji: [-8, -18, 14] }));
N('後', 'un caminante que arrastra un hilo', 96, t => ({ body: `${pers(8, 0, 1.55)}`, back: Ln('M-4,-4 C-24,-2 -34,-14 -44,-6 C-52,0 -56,-8 -58,-16', SHU, 2.4, 2),
  front: P(circ(-58, -18, 5), SHU, 2), faces: [F(10, -58, 7, 'ten', { es: .75, px: -1 })], kanji: [8, -18, 14] }));
// ===== Personas =====
N('父', 'una figura de brazos cruzados con bigote', 100, t => ({ body: `${circ(0, -76, 20)} M-22,-58 C-36,-40 -34,-10 -26,0 H26 C34,-10 36,-40 22,-58Z`,
  mid: Ln('M-24,-34 L24,-20 M24,-34 L-24,-20', t.d, 6, 3) + `<path d="M-12,-66 C-6,-62 -2,-62 0,-66 C2,-62 6,-62 12,-66 C8,-58 2,-60 0,-62 C-2,-60 -8,-58 -12,-66Z" fill="${INK}"/>`,
  faces: [F(0, -80, 8, 'tome', { es: .8, mouth: false, brow: true })], kanji: [0, -8, 11] }));
N('母', 'una figura que abraza, con dos puntos al pecho', 100, t => ({ body: `${circ(0, -76, 19)} M-18,-58 C-40,-46 -40,-8 -28,0 H28 C40,-8 40,-46 18,-58Z`,
  back: P(circ(0, -78, 22), '#3A2E3A') + P(circ(0, -100, 9), '#3A2E3A'),
  mid: Ln('M-30,-30 C-10,-14 10,-14 30,-30', t.d, 6, 3) + `<circle cx="-9" cy="-40" r="2.6" fill="${t.d}"/><circle cx="9" cy="-40" r="2.6" fill="${t.d}"/>`,
  front: heartP(0, -20, .5), faces: [F(0, -76, 7, 'tome', { es: .75 })], kanji: [0, -6, 10] }));
N('友', 'dos manos de papel entrelazadas', 84, t => ({ body: `${circ(-24, -52, 22)} ${circ(24, -52, 22)} M-40,-36 L-30,0 H30 L40,-36Z`,
  front: hand(-6, -14, 40, .7, t.d) + hand(6, -14, -40, .7, t.l) + heartP(0, -84, .5),
  faces: [F(-24, -54, 8, 'ten', { es: .8 }), F(24, -54, 8, 'hane', { es: .8 })], kanji: [0, -34, 11] }));
N('弟', 'un niño pequeño con un arco de juguete', 80, t => ({ body: pers(-6, 0, 1.3), front: Ln('M26,-66 C46,-50 46,-22 26,-6', WOOD, 3.4, 2.6) + Ln('M26,-66 V-6', INK, 1.2, 0) + Ln('M14,-36 H34', WOODL, 2, 1.6),
  back: sprout(-6, -64, .3), faces: [F(-6, -48, 6, 'maru', { es: .7 })], kanji: [-6, -14, 12] }));
N('私', 'una figura que abraza su propia espiga', 96, t => ({ body: pers(0, 0, 1.55), front: J(20, -30, Ln('M0,0 C2,-20 4,-36 14,-52', GOLD, 3, 2.4) + P('M14,-52 C20,-60 28,-58 26,-48 C22,-42 16,-44 14,-52Z', GOLD, 2) + P('M8,-36 C16,-42 22,-38 20,-30 C14,-28 10,-30 8,-36Z', GOLD, 2), .3) + hand(-22, -30, 60, .5, t.d),
  faces: [F(0, -58, 7, 'ten', { es: .75 })], kanji: [-2, -14, 13] }));
N('自', 'una cara que se señala la nariz', 86, t => ({ body: rrect(-34, -82, 68, 82, 22), front: hand(34, -30, -70, .7, t.d) + P(circ(0, -46, 5), PINK, 2),
  faces: [F(0, -58, 12, 'ten', { mouth: false }), F(0, -38, 0, 'ten', { mouthOnly: true })], kanji: [0, -14, 13] }));
N('主', 'un candelabro con la llama encendida', 100, t => ({ body: `${tab(0, -62, 64, 12)} ${tab(0, -32, 48, 12)} ${tab(0, 0, 76, 14)} ${tab(0, -4, 14, 70)}`,
  back: J(0, -76, `<g transform="scale(1.1)">${flame(SHU, GOLD)}</g>`, 0, 'k2-float'),
  faces: [F(0, -22, 0, 'tome', { es: .7, mouth: false })], kanji: [24, -7, 10] }));
N('王', 'una figura con corona de tres franjas', 98, t => ({ body: `${circ(0, -60, 22)} M-24,-42 C-40,-30 -40,-8 -30,0 H30 C40,-8 40,-30 24,-42Z`,
  back: P('M-22,-76 L-26,-98 L-12,-86 L0,-102 L12,-86 L26,-98 L22,-76Z', GOLD, 3),
  mid: Ln('M-30,-30 H30 M-32,-18 H32 M-30,-6 H30', GOLD, 2.4, 0), faces: [F(0, -60, 8, 'tome', { es: .8, brow: true })], kanji: [0, -18, 11] }));
N('士', 'un pequeño samurái de brazos abiertos', 96, t => ({ body: `${circ(0, -66, 18)} M-50,-48 H50 L46,-34 H14 L22,0 H-22 L-14,-34 H-46Z`,
  back: P('M-20,-78 C-14,-96 14,-96 20,-78Z', t.d, 3) + P('M-6,-94 L0,-106 L6,-94Z', GOLD, 2),
  faces: [F(0, -64, 7, 'harai', { es: .75, brow: true })], kanji: [0, -14, 12] }));
N('夫', 'una figura de brazos abiertos con un pasador en el pelo', 100, t => ({ body: `${circ(0, -76, 18)} M-52,-52 H52 L50,-38 H12 L34,0 H16 L0,-22 L-16,0 H-34 L-12,-38 H-50Z`,
  back: Ln('M-22,-92 H22', GOLD, 3, 2.4) + P(circ(24, -92, 3.5), SHU, 1.6), faces: [F(0, -74, 7, 'tome', { es: .75 })], kanji: [0, -42, 9] }));
// ===== Lugar y dirección =====
N('上', 'una flecha que brota sobre el suelo', 84, t => ({ body: `${tab(0, 0, 100, 18)} ${tab(0, -10, 18, 66)} M6,-58 H40 C46,-58 46,-44 40,-44 H6Z`, back: arrowP(-30, -56, 0, SHU, .8),
  faces: [F(-26, -9, 8, 'ten', { es: .7 })], kanji: [26, -9, 10] }));
N('下', 'una raíz que cuelga bajo el suelo', 84, t => ({ body: `${tab(0, -62, 100, 18)} ${tab(0, 0, 18, 70)} M6,-52 C24,-50 36,-40 42,-30 C44,-24 36,-20 32,-26 C26,-34 18,-38 6,-38Z`, back: arrowP(-30, -24, 180, SHU, .8),
  faces: [F(-26, -71, 8, 'ten', { es: .7 })], kanji: [26, -71, 10] }));
N('中', 'una diana atravesada por el centro', 96, t => ({ body: `${circ(0, -46, 36)} ${tab(0, 0, 12, 96)}`, mid: `<circle cx="0" cy="-46" r="24" fill="none" stroke="${W}" stroke-width="3"/><circle cx="0" cy="-46" r="11" fill="${SHU}"/>`,
  faces: [F(0, -70, 9, 'ten', { es: .7, mouth: false })], kanji: [0, -18, 11] }));
N('右', 'una mano que acerca algo a una boca', 84, t => ({ body: `${circ(-10, -40, 32)}`, front: J(22, -36, `<g transform="rotate(20)">${P(HAND, t.d, 2.6)}</g>`, 0, 'k2-swing2') + P(circ(34, -62, 6), SHU, 2) + feet([-22, 2], t, 7, -2),
  faces: [F(-12, -48, 10, 'ten', { mouth: 'open' })], kanji: [-12, -22, 13] }));
N('左', 'una mano que sostiene una regla', 84, t => ({ body: `${circ(10, -40, 32)}`, front: J(-22, -36, `<g transform="rotate(-20) scale(-1 1)">${P(HAND, t.d, 2.6)}</g>`, 0, 'k2-swing2') + bar(-52, -70, 8, 44, WOODL) + feet([-2, 22], t, 7, -2),
  faces: [F(12, -48, 10, 'tome')], kanji: [12, -22, 13] }));
N('西', 'un nido donde se acuesta el sol', 80, t => ({ body: bowl(0, 0, 46) + ' ' + tab(0, -30, 100, 10), back: sunD(0, -40, 20) + rays(0, -40, [[-60, .5], [-30, .55], [0, .6], [30, .55], [60, .5]], t),
  mid: Ln('M-36,-22 L-20,-6 M-20,-24 L0,-4 M0,-24 L20,-6 M20,-22 L34,-10', t.d, 1.6, 0), faces: [F(0, -44, 7, 'dormido', { es: .7, fix: true, expr: 'dormido' })], kanji: [0, -13, 12] }));
N('南', 'una carpa tibia con un brote dentro', 96, t => ({ body: 'M0,-92 L48,-50 V0 H-48 V-50Z', mid: `<path d="M-14,0 V-34 C-14,-48 14,-48 14,-34 V0Z" fill="${t.l}"/>`, front: sprout(0, -4, .32) + sunD(40, -86, 9),
  faces: [F(0, -64, 11, 'ten')], kanji: [0, -20, 12] }));
N('北', 'dos figuras sentadas espalda con espalda', 86, t => ({ body: `${pers(-22, 0, 1.3)} ${pers(22, 0, 1.3)}`, front: `<g class="k2-float">${star(0, -78, .5)}</g>` + Ln('M-6,-30 V-10 M6,-30 V-10', T.water.l, 2, 0),
  faces: [F(-26, -48, 0, 'tome', { es: .7, dir: -1, mouth: false }), F(26, -48, 0, 'tome', { es: .7, mouth: false })], kanji: [-22, -14, 10] }));
N('市', 'un puesto de feria con su toldo', 92, t => ({ body: `M-52,-58 L-40,-84 H40 L52,-58Z ${rrect(-40, -58, 80, 58, 3)}`, mid: [-39, -13, 13].map((x, i) => `<path d="M${x},-58 h26 v8 q-13,10 -26,0Z" fill="${i % 2 ? W : SHU}"/>`).join('') + bar(-34, -18, 68, 8, WOOD, 2),
  front: P(circ(-18, -24, 6), SHU, 2) + P(circ(-4, -24, 6), GOLD, 2) + P(circ(10, -24, 6), T.wood.f, 2), faces: [F(0, -36, 9, 'ten', { es: .7, mouth: false })], kanji: [0, -72, 11] }));
N('里', 'una casita sobre un arrozal', 86, t => ({ body: `${house(0, -18, 52, 38, 26)} ${tab(0, 0, 104, 22)}`, mid: Ln('M-48,-11 H48 M-24,-20 V-2 M0,-20 V-2 M24,-20 V-2', t.d, 1.6, 0) + `<path d="M-7,-18 v-18 h14 v18Z" fill="${t.d}"/>`,
  faces: [F(0, -46, 9, 'tome', { es: .75, mouth: false })], kanji: [0, -64, 10] }));
N('央', 'una figura parada dentro de un marco', 96, t => ({ body: `${pers(0, 0, 1.5)} M-46,-52 H46 V-22 H34 V-40 H-34 V-22 H-46Z`, front: Ln('M-24,-20 L-44,0 M24,-20 L44,0', t.d, 5, 3),
  faces: [F(0, -56, 7, 'tome', { es: .75 })], kanji: [0, -14, 13] }));
N('戸', 'una hoja de puerta corrediza', 92, t => ({ body: `${tab(0, -78, 80, 12)} ${rrect(-30, -76, 60, 76, 4)}`, fill: WOODL, mid: Ln('M-30,-50 H30 M-30,-26 H30 M0,-76 V0', W, 1.6, 0) + P(circ(20, -38, 4), GOLD, 1.6),
  faces: [F(-14, -62, 7, 'ten', { es: .7, mouth: false })], kanji: [14, -13, 11] }));
N('門', 'un portón de dos hojas con patitas', 90, t => ({ body: gate, front: P(circ(-12, -40, 3.5), GOLD, 1.6) + P(circ(12, -40, 3.5), GOLD, 1.6) + feet([-26, 26], t, 9, 2),
  mid: Ln('M-46,-62 H-6 M6,-62 H46', t.d, 2, 0), faces: [F(-26, -46, 7, 'tome', { es: .75 }), F(26, -46, 7, 'tome', { es: .75 })], kanji: [-26, -14, 11] }));
N('方', 'una veleta de papel', 96, t => ({ body: `${tab(0, 0, 60, 12)} ${tab(0, -8, 10, 60)} M-40,-78 L20,-78 L44,-66 L20,-54 L-40,-54 L-28,-66Z`, back: P(circ(0, -88, 5), GOLD, 2),
  faces: [F(-10, -68, 7, 'harai', { es: .7, mouth: false })], kanji: [18, -66, 10] }));
N('家', 'una casita con un cerdito asomado', 94, t => ({ body: house(0, 0, 76, 52, 36), mid: `<path d="M-16,0 V-30 C-16,-42 16,-42 16,-30 V0Z" fill="${t.d}"/>`,
  front: P(ell(0, -14, 13, 10), PINK, 2.4) + `<ellipse cx="0" cy="-12" rx="5" ry="3.5" fill="${SHU}" opacity=".6"/><circle cx="-4" cy="-18" r="1.4" fill="${INK}"/><circle cx="4" cy="-18" r="1.4" fill="${INK}"/>` + bar(22, -84, 10, 20, t.d),
  faces: [F(-22, -38, 0, 'ten', { es: .6, mouth: false }), F(22, -38, 0, 'ten', { es: .6, mouth: false })], kanji: [0, -64, 12] }));
// ===== Naturaleza y color =====
N('大', 'una figura de brazos bien abiertos', 100, t => ({ body: `${circ(0, -78, 18)} M-56,-56 C-30,-52 30,-52 56,-56 L54,-40 C36,-38 20,-38 12,-38 L36,-4 C38,0 32,4 28,0 L0,-24 L-28,0 C-32,4 -38,0 -36,-4 L-12,-38 C-20,-38 -36,-38 -54,-40Z`,
  faces: [F(0, -76, 7, 'maru', { es: .8, mouth: 'open' })], kanji: [0, -44, 9] }));
N('小', 'un brote diminuto con dos migas', 60, t => ({ body: `${tab(0, 0, 16, 52)} ${circ(-26, -14, 9)} ${circ(26, -14, 9)}`, back: sprout(0, -50, .25),
  faces: [F(0, -32, 0, 'ten', { es: .6, mouth: false })], kanji: [0, -12, 8] }));
N('少', 'un brote al que le falta un pedazo', 66, t => ({ body: `M-8,-56 H8 V-22 L0,-14 L-8,-22Z ${circ(-26, -22, 9)} ${circ(26, -22, 9)} M30,-8 C10,-2 -14,2 -36,0 C-40,-4 -36,-10 -30,-10 C-10,-10 10,-14 26,-18Z`,
  front: `<g class="k2-float">${P('M12,-56 l8,-6 l2,10Z', t.l, 2)}</g>`, faces: [F(0, -38, 0, 'ten', { es: .6, mouth: false, expr: 'triste' })], kanji: [-8, -4, 7] }));
N('山', 'una montaña de tres picos', 90, t => ({ body: 'M-56,0 L-38,-50 L-22,-30 L0,-88 L22,-30 L38,-50 L56,0Z', mid: `<path d="M0,-88 L-10,-62 L-3,-68 L3,-60 L10,-64Z" fill="${W}"/>`,
  faces: [F(0, -40, 11, 'tome')], kanji: [0, -14, 13] }));
N('川', 'tres cintas de agua que bajan', 90, t => ({ body: 'M-44,-86 C-30,-60 -52,-30 -40,0 H-22 C-34,-30 -14,-60 -28,-86Z M-8,-86 C4,-60 -14,-30 -6,0 H10 C0,-30 20,-60 8,-86Z M28,-86 C42,-60 22,-30 30,0 H46 C38,-30 58,-60 44,-86Z',
  front: `<g class="k2-float">${bubble(-52, -70, 4, T.water)}${bubble(54, -40, 5, T.water)}</g>`, faces: [F(1, -50, 0, 'ten', { es: .7, mouth: false })], kanji: [1, -20, 9] }));
N('雨', 'una nube con cuatro gotas', 100, t => ({ body: cloud(0, -64, 1.25), front: `<g class="k2-float">${drop(-28, -16, .7, T.water.f)}${drop(10, -8, .7, T.water.f)}</g><g class="k2-float b">${drop(-8, -22, .7, T.water.l)}${drop(30, -20, .7, T.water.l)}</g>`,
  faces: [F(-4, -72, 11, 'tome', { expr: 'triste' })], kanji: [4, -50, 12] }));
N('白', 'un grano de arroz que brilla', 84, t => ({ body: 'M0,-80 C30,-74 34,-30 22,-8 C14,2 -14,2 -22,-8 C-34,-30 -30,-74 0,-80Z', fill: '#FFFDF8',
  back: rays(0, -40, [[0, .7], [45, .6], [90, .6], [135, .6], [180, .6], [225, .6], [270, .6], [315, .6]], { f: GLOW }),
  faces: [F(0, -50, 9, 'ten')], kanji: [0, -22, 13] }));
N('赤', 'un montoncito de tierra sobre brasas', 86, t => ({ body: mound(40, 58), fill: SHU, front: `<g transform="translate(-26 0) scale(.9)">${flame(SHU, GOLD)}</g><g transform="translate(0 2)">${flame(GOLD, GLOW)}</g><g transform="translate(26 0) scale(.9)">${flame(SHU, GOLD)}</g>`,
  faces: [F(0, -46, 10, 'harai')], kanji: [0, -22, 13] }));
N('青', 'un brote bajo una luna azul', 96, t => ({ body: 'M22,-30 A30,30 0 1,0 22,-2 A44,44 0 0,1 22,-30Z M-4,-34 C-10,-60 0,-80 0,-90 C4,-78 12,-60 6,-34Z', fill: T.water.f,
  back: J(0, -62, `<g transform="scale(.6)">${leafL('#4FA89A', T.water.l)}${leafR('#72C7B8', T.water.l)}</g>`, .3),
  faces: [F(-10, -16, 7, 'ten', { es: .7 })], kanji: [-8, -2, 8] }));
N('色', 'una paleta con manchas de tinta', 84, t => ({ body: 'M-44,-36 C-44,-70 -10,-82 18,-76 C44,-70 54,-44 44,-24 C36,-10 24,-18 14,-10 C4,-2 -4,0 -16,-2 C-34,-6 -44,-18 -44,-36Z',
  mid: `<circle cx="-22" cy="-52" r="7" fill="${SHU}"/><circle cx="-2" cy="-64" r="7" fill="${GOLD}"/><circle cx="20" cy="-58" r="7" fill="${T.water.f}"/><circle cx="32" cy="-40" r="7" fill="${T.wood.f}"/>`,
  front: J(-30, -8, `<g transform="rotate(-50)">${bar(-2, -44, 4, 40, WOOD, 2)}${P('M-4,-44 C-4,-54 0,-60 0,-60 C0,-60 4,-54 4,-44Z', INK, 2)}</g>`, .2), faces: [F(-8, -32, 8, 'hane', { es: .75 })], kanji: [18, -24, 10] }));
N('長', 'una figura de melena larguísima', 104, t => ({ body: `${circ(0, -80, 18)} M-16,-62 C-22,-40 -20,-12 -14,0 H14 C20,-12 22,-40 16,-62Z`,
  back: P('M-18,-88 C-40,-80 -44,-40 -50,-4 C-40,-8 -34,-4 -30,-10 C-24,-40 -24,-70 -12,-96Z', '#EDE6DA', 3) + P('M18,-88 C40,-80 44,-40 50,-4 C40,-8 34,-4 30,-10 C24,-40 24,-70 12,-96Z', '#EDE6DA', 3),
  faces: [F(0, -80, 7, 'tome', { es: .75, brow: true })], kanji: [0, -28, 13] }));
N('高', 'una torre de dos pisos', 108, t => ({ body: `M-30,-84 L0,-106 L30,-84Z ${rrect(-20, -84, 40, 30, 3)} M-44,-52 L0,-66 L44,-52Z ${rrect(-30, -52, 60, 52, 3)}`,
  mid: `<path d="M-8,0 v-18 h16 v18Z" fill="${t.d}"/>`, faces: [F(0, -74, 7, 'tome', { es: .65, mouth: false })], kanji: [0, -34, 12] }));
N('気', 'un hilo de vapor con ojos', 96, t => ({ body: 'M0,-4 C-26,-6 -34,-26 -20,-38 C-38,-50 -24,-74 -4,-66 C-2,-88 30,-90 30,-66 C48,-62 46,-36 28,-34 C40,-18 22,-2 0,-4Z', fill: '#FFF8E4',
  front: `<g class="k2-float">${Ln('M-44,-80 q-6,-8 0,-14 M46,-84 q6,-8 0,-14', GOLD, 2.4, 2)}</g>` + P(bowl(0, 10, 18), t.d, 2.6),
  faces: [F(2, -54, 10, 'maru')], kanji: [4, -28, 12] }));
// ===== Acciones =====
N('行', 'un cruce de caminos con patas', 86, t => ({ body: `${tab(0, -26, 108, 24)} ${tab(0, 0, 26, 82)}`, mid: Ln('M-48,-38 h14 M-26,-38 h10 M18,-38 h10 M36,-38 h12 M0,-76 v10 M0,-18 v8', W, 2, 0),
  front: feet([-40, 40], t, 7, -24) + arrowP(0, -92, 0, SHU, .6), faces: [F(0, -40, 8, 'harai', { es: .75 })], kanji: [-34, -38, 9] }));
N('来', 'un árbol cargado que hace señas', 102, t => ({ body: `${circ(0, -70, 28)} ${circ(-26, -54, 20)} ${circ(26, -54, 20)}`, back: P('M-8,-36 C-8,-20 -10,-10 -22,0 H22 C10,-10 8,-20 8,-36Z', WOOD),
  front: P(circ(-28, -52, 6), SHU, 2) + P(circ(30, -60, 6), SHU, 2) + P(circ(8, -92, 6), SHU, 2) + J(40, -44, `<g transform="rotate(30)">${P(HAND, t.d, 2.4)}</g>`, 0, 'k2-swing2'),
  faces: [F(0, -70, 11, 'ten', { mouth: 'open' })], kanji: [0, -44, 12] }));
N('出', 'un brote que rompe su maceta', 92, t => ({ body: 'M-36,-40 H36 L28,0 H-28Z M-8,-40 C-10,-60 -4,-78 0,-90 C4,-78 10,-60 8,-40Z', back: J(0, -66, `<g transform="scale(.7)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .2),
  mid: Ln('M-14,-40 L-8,-30 L-2,-38 L6,-28 L12,-38', INK, 1.4, 0), faces: [F(0, -20, 10, 'maru', { es: .85 })], kanji: [0, -60, 8] }));
N('入', 'la entrada de una carpa', 84, t => ({ body: 'M0,-82 L54,0 H-54Z', mid: `<path d="M0,-50 C-16,-34 -18,-14 -18,0 H18 C18,-14 16,-34 0,-50Z" fill="${INK}" opacity=".55"/>`, front: arrowP(0, -16, 0, GOLD, .6) + P('M-4,-82 L0,-96 L14,-90 L0,-86Z', SHU, 2),
  faces: [F(-30, -14, 0, 'ten', { es: .65, mouth: false }), F(30, -14, 0, 'ten', { es: .65, mouth: false })], kanji: [0, -64, 9] }));
N('食', 'un cuenco humeante con tapa', 92, t => ({ body: `${bowl(0, 0, 44)} M-46,-34 C-40,-64 40,-64 46,-34Z ${circ(0, -62, 7)}`, front: steam(0, -72, t.d),
  mid: Ln('M-44,-32 H44', t.d, 2.4, 0), faces: [F(0, -20, 10, 'ten', { es: .85, mouth: 'open' })], kanji: [0, -46, 10] }));
N('言', 'una boca con ondas de voz encima', 92, t => ({ body: `${rrect(-30, -40, 60, 40, 10)} ${tab(0, -48, 76, 9)} ${tab(0, -62, 52, 9)} ${tab(0, -76, 52, 9)}`, front: waves(40, -66, t) + waves(-40, -66, t, -1),
  faces: [F(0, -28, 9, 'ten', { es: .8, mouth: 'open' })], kanji: [0, -6, 9] }));
N('走', 'una figura en plena zancada', 92, t => ({ body: `${circ(8, -74, 15)} M-2,-60 L22,-52 L10,-28 L34,-10 L28,0 L-6,-18 L-20,0 L-34,-4 L-14,-30Z`, front: J(-10, -50, P('M0,0 L-26,-8 L-28,0 L-2,10Z', t.d, 2.6), 0, 'k2-swing2') + J(20, -48, P('M0,0 L22,-12 L26,-4 L4,10Z', t.d, 2.6), .4, 'k2-swing2') + Ln('M-52,-30 h14 M-56,-18 h18 M-50,-6 h12', t.d, 2.2, 2),
  faces: [F(10, -74, 6, 'harai', { es: .65 })], kanji: [2, -36, 10] }));
N('欠', 'una figura que bosteza', 92, t => ({ body: pers(0, 0, 1.5), front: zz(22, -76) + hand(-24, -40, 30, .55, t.d),
  faces: [F(0, -60, 7, 'dormido', { es: .75, mouth: false, fix: true, expr: 'dormido' }), F(0, -44, 0, 'ten', { mouthOnly: true, mouth: 'open' })], kanji: [0, -14, 13] }));
N('用', 'un balde de madera con asa', 86, t => ({ body: 'M-36,-58 H36 L30,0 H-30Z', fill: WOODL, back: Ln('M-30,-56 C-30,-92 30,-92 30,-56', WOOD, 4, 3),
  mid: Ln('M-34,-44 H34 M-31,-14 H31', WOOD, 3, 0), faces: [F(0, -32, 10, 'tome')], kanji: [0, -6, 9] }));
N('事', 'una mano con un rollo de registros', 96, t => ({ body: `${rrect(-28, -70, 56, 64, 4)} ${tab(0, -66, 68, 12)} ${tab(0, 0, 68, 12)}`, fill: '#FFF8E4', front: hand(34, -30, -80, .6, T.earth.f),
  mid: Ln('M-18,-56 H18 M-18,-48 H10 M-18,-22 H18', INK, 1.3, 0), faces: [F(0, -36, 0, 'ten', { es: .65, mouth: false })], kanji: [-12, -34, 9] }));
N('未', 'un arbolito con brotes sin abrir', 96, t => ({ body: `${circ(0, -66, 24)} ${circ(-22, -50, 17)} ${circ(22, -50, 17)}`, back: P('M-7,-34 C-7,-20 -9,-10 -20,0 H20 C9,-10 7,-20 7,-34Z', WOOD),
  front: P(circ(-24, -70, 4), GLOW, 2) + P(circ(22, -76, 4), GLOW, 2) + P(circ(2, -92, 4), GLOW, 2), faces: [F(0, -64, 10, 'ten', { expr: 'dormido' })], kanji: [0, -42, 11] }));
N('売', 'un vendedor tras un mostrador', 96, t => ({ body: `${pers(0, -22, 1.2)} ${rrect(-46, -30, 92, 30, 5)}`, back: P('M-18,-74 C-12,-90 12,-90 18,-74Z', SHU, 2.6),
  front: P(circ(-28, -34, 6), GOLD, 2) + P(circ(28, -34, 6), SHU, 2) + J(30, -52, `<g transform="rotate(20) scale(.5)">${P(HAND, t.d, 2.6)}</g>`, 0, 'k2-swing2'),
  faces: [F(0, -66, 6, 'hane', { es: .7, mouth: 'open' })], kanji: [0, -14, 12] }));
// ===== Cuerpo =====
N('耳', 'una oreja grande con pliegues', 92, t => ({ body: 'M0,-88 C34,-88 46,-56 34,-28 C28,-10 12,6 -6,-2 C-18,-10 -8,-24 -8,-32 C-28,-38 -34,-86 0,-88Z',
  mid: Ln('M4,-72 C22,-68 24,-44 10,-30 M0,-54 C8,-50 8,-42 2,-38', t.d, 2.4, 0), front: waves(46, -56, t),
  faces: [F(-4, -16, 0, 'ten', { es: .6, mouth: false })], kanji: [16, -50, 9] }));
N('足', 'una pierna que da un paso', 92, t => ({ body: 'M-18,-88 H12 V-30 C12,-22 20,-20 40,-18 C52,-16 52,0 40,0 H-18 C-24,0 -24,-10 -22,-20Z',
  front: Ln('M-44,-10 h-12 M-44,-22 h-8', t.d, 2.2, 2), faces: [F(-4, -64, 8, 'harai', { es: .8 })], kanji: [10, -10, 10] }));
N('首', 'una cabeza con moño sobre un cuello largo', 102, t => ({ body: `${circ(0, -72, 22)} ${tab(0, 0, 22, 54)} ${tab(0, 0, 60, 12)}`, back: P(circ(0, -98, 9), '#3A2E3A') + Ln('M-10,-100 H10', GOLD, 2, 1.6),
  mid: `<path d="M-11,-40 H11 V-32 H-11Z" fill="${SHU}"/>`, faces: [F(0, -74, 9, 'tome', { es: .85 })], kanji: [0, -18, 9] }));
N('肉', 'un corte de carne veteado', 76, t => ({ body: 'M-44,-40 C-44,-68 -10,-74 14,-68 C40,-62 52,-40 44,-20 C36,-2 -10,2 -30,-6 C-40,-10 -44,-24 -44,-40Z', fill: '#E88A7A',
  mid: Ln('M-30,-44 C-10,-56 14,-54 30,-40 M-24,-24 C-6,-34 16,-32 30,-20', '#FFE4DC', 3, 0) + P(circ(22, -50, 6), W, 1.6),
  faces: [F(-6, -40, 9, 'ten', { es: .8 })], kanji: [-6, -14, 9] }));
N('米', 'una espiga con granos que saltan', 100, t => ({ body: `${ell(0, -22, 20, 22)} M-5,-40 C-6,-60 -2,-80 6,-96 C10,-80 8,-60 5,-40Z`, fill: '#FFFDF8',
  back: [[-18, -70, -30], [18, -66, 30], [-22, -50, -50], [24, -46, 50]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${P(ell(0, 0, 5, 9), GOLD, 2)}</g>`).join(''),
  front: `<g class="k2-float">${P(ell(-40, -84, 3, 5), W, 1.6)}${P(ell(40, -80, 3, 5), W, 1.6)}</g>`, faces: [F(0, -26, 7, 'ten', { es: .75 })], kanji: [0, -8, 8] }));
N('牛', 'una vaquita con un cuerno torcido', 90, t => ({ body: `${ell(0, -34, 40, 32)}`, fill: '#FFFDF8', back: P('M-26,-58 C-40,-66 -44,-80 -36,-88 C-34,-76 -26,-70 -16,-66Z', '#EDE6DA', 2.6) + P('M24,-60 C30,-70 30,-76 26,-80', '#EDE6DA', 2.6) + P(ell(-40, -52, 10, 6), t.f, 2.4) + P(ell(40, -52, 10, 6), t.f, 2.4),
  mid: `<path d="M-30,-50 C-22,-58 -10,-50 -16,-40 C-24,-36 -34,-40 -30,-50Z" fill="${INK}" opacity=".8"/>` + P(ell(0, -16, 18, 11), PINK, 2) + `<circle cx="-6" cy="-16" r="2" fill="${MOUTH}"/><circle cx="6" cy="-16" r="2" fill="${MOUTH}"/>`,
  front: feet([-20, 20], t, 8, -1), faces: [F(0, -44, 12, 'tome', { mouth: false })], kanji: [20, -34, 9] }));
N('馬', 'un caballo de crin flameante', 100, t => ({ body: 'M-40,-40 C-40,-56 -20,-60 0,-58 L10,-84 C14,-96 34,-96 40,-84 L50,-66 C52,-60 46,-56 40,-58 L30,-60 L30,-20 L34,0 H20 L16,-18 H-20 L-24,0 H-38 L-36,-22 C-40,-28 -40,-34 -40,-40Z',
  back: P('M2,-62 C-6,-76 0,-92 14,-98 C8,-88 12,-78 16,-70Z', '#3A2E3A', 2.6) + J(-38, -42, P('M0,0 C-14,4 -18,20 -12,30 C-6,22 -2,12 4,6Z', '#3A2E3A', 2.6), .3),
  faces: [F(26, -80, 0, 'harai', { es: .75, mouth: false })], kanji: [-6, -38, 13] }));
N('鳥', 'un pájaro posado con la cola larga', 86, t => ({ body: `${circ(8, -60, 20)} M-10,-48 C-30,-44 -50,-20 -56,-4 C-40,-8 -20,-10 0,-12 C24,-12 30,-30 24,-46Z`,
  front: P('M26,-62 L42,-56 L26,-52Z', GOLD, 2) + Ln('M-4,-12 V0 M8,-12 V0', GOLD, 2.4, 2) + J(-6, -36, P('M0,0 C-10,-2 -24,6 -30,16 C-18,16 -6,12 4,6Z', t.d, 2.6), .2),
  faces: [F(12, -64, 0, 'ten', { es: .75, mouth: false })], kanji: [2, -28, 10] }));
N('犬', 'un perro con una oreja parada', 86, t => ({ body: `${circ(0, -52, 26)} M-24,-34 C-32,-14 -28,-4 -20,0 H20 C28,-4 32,-14 24,-34Z`, back: P('M-20,-70 L-30,-92 L-6,-78Z', t.d, 3) + P('M14,-76 C26,-84 36,-76 34,-62 C30,-56 22,-60 14,-76Z', t.d, 3) + J(24, -8, P('M0,0 C10,-4 18,-14 14,-24 C8,-16 2,-10 -4,-6Z', t.d, 2.6), 0, 'k2-swing2'),
  mid: P(ell(0, -44, 6, 4.5), INK, 1), faces: [F(0, -58, 11, 'ten', { mouth: 'open' })], kanji: [0, -14, 11] }));
N('羽', 'dos alas de papel plegado', 80, t => ({ body: 'M-4,-10 C-30,-8 -54,-30 -56,-70 C-40,-66 -30,-70 -22,-78 C-12,-60 -4,-40 -4,-10Z M4,-10 C30,-8 54,-30 56,-70 C40,-66 30,-70 22,-78 C12,-60 4,-40 4,-10Z', fill: '#FFFDF8',
  mid: Ln('M-10,-22 C-24,-34 -36,-50 -44,-64 M-8,-36 C-16,-48 -22,-58 -26,-68 M10,-22 C24,-34 36,-50 44,-64 M8,-36 C16,-48 22,-58 26,-68', t.d, 1.5, 0),
  front: P(circ(0, -8, 9), t.f, 2.6), faces: [F(0, -10, 0, 'ten', { es: .55, mouth: false })], kanji: [-26, -38, 9] }));
N('玉', 'una esfera pulida con un destello', 84, t => ({ body: circ(0, -40, 36), fill: '#9FD8C8', mid: `<path d="M-22,-56 C-16,-68 -4,-72 6,-70 C-6,-66 -14,-58 -18,-48Z" fill="${W}" opacity=".8"/>`,
  front: P(ell(0, -3, 26, 6), SHU, 2.4) + `<g class="k2-float">${star(38, -74, .5)}</g>`, faces: [F(0, -42, 11, 'maru')], kanji: [0, -18, 12] }));
// ===== Cosas =====
N('刀', 'una katana curva de papel', 100, t => ({ body: 'M-6,-96 C10,-92 20,-60 16,-22 L-10,-22 C-2,-50 -2,-76 -6,-96Z', fill: T.metal.l,
  front: bar(-18, -24, 40, 7, GOLD) + bar(-6, -17, 14, 20, '#3A2E3A') + Ln('M-6,-12 H8 M-6,-6 H8', GOLD, 1.3, 0),
  faces: [F(4, -50, 0, 'harai', { es: .65, mouth: false })], kanji: [5, -32, 8] }));
N('工', 'una escuadra de carpintero', 80, t => ({ body: `${tab(0, -62, 80, 16)} ${tab(0, 0, 100, 18)} ${tab(0, -10, 18, 60)}`, mid: Ln('M-44,-12 v6 M-32,-12 v4 M-20,-12 v6 M20,-12 v6 M32,-12 v4 M44,-12 v6', INK, 1.2, 0),
  faces: [F(0, -44, 0, 'tome', { es: .65, mouth: false })], kanji: [0, -70, 9] }));
N('矢', 'una flecha emplumada', 100, t => ({ body: `M0,-98 L16,-70 H6 V-20 L16,-4 H-16 L-6,-20 V-70 H-16Z`, mid: Ln('M-12,-10 L-4,-18 M12,-10 L4,-18', SHU, 2, 0),
  front: Ln('M-30,-50 h10 M-34,-40 h12 M20,-50 h10 M22,-40 h12', t.d, 2, 1.6), faces: [F(0, -52, 0, 'harai', { es: .6, mouth: false })], kanji: [0, -36, 7] }));
N('文', 'un pliego con trazos cruzados', 88, t => ({ body: 'M-34,-84 H24 L38,-70 V0 H-34Z', fill: '#FFF8E4', mid: `<path d="M24,-84 V-70 H38Z" fill="${T.earth.l}"/>` + Ln('M-22,-68 H14 M-22,-60 H22', INK, 1.6, 0),
  front: J(34, -20, `<g transform="rotate(35)">${bar(-2, -34, 4, 30, WOOD, 2)}${P('M-4,-4 C-4,4 0,10 0,10 C0,10 4,4 4,-4Z', INK, 2)}</g>`, .2), faces: [F(0, -40, 9, 'ten', { es: .85 })], kanji: [0, -14, 11] }));
N('四', 'una caja con dos piernitas dentro', 86, t => ({ body: rrect(-40, -78, 80, 74, 10), mid: Ln('M-12,-74 C-12,-58 -16,-50 -26,-46 M12,-74 C12,-58 14,-50 26,-48', t.d, 3.4, 0),
  front: feet([-22, 22], t, 8, -2), faces: [F(-14, -30, 8, 'ten', { es: .75 })], kanji: [18, -24, 12] }));
N('服', 'una prenda colgada con una mano que la acomoda', 92, t => ({ body: 'M-18,-80 L0,-70 L18,-80 L50,-60 L40,-40 L28,-46 V0 H-28 V-46 L-40,-40 L-50,-60Z', back: Ln('M-22,-84 C-10,-98 10,-98 22,-84', WOOD, 3, 2.4),
  mid: Ln('M0,-70 V0', t.d, 1.6, 0) + `<circle cx="0" cy="-52" r="2.4" fill="${GOLD}"/><circle cx="0" cy="-36" r="2.4" fill="${GOLD}"/>`, faces: [F(-13, -56, 0, 'ten', { es: .6, mouth: false }), F(13, -56, 0, 'ten', { es: .6, mouth: false })], kanji: [0, -16, 12] }));

// ===== Grado 2 · Números y tiempo =====
N('三', 'tres tablillas apiladas', 78, t => ({ body: `${tab(0, -52, 60, 18)} ${tab(0, -27, 78, 19)} ${tab(0, 0, 98, 23)}`, front: feet([-30, 30], t, 7, 1),
  faces: [F(-18, -14, 10, 'ten', { es: .8 })], kanji: [24, -12, 12] }));
N('六', 'un abanico con sombrero', 92, t => ({ body: 'M-6,-56 C-10,-34 -26,-14 -50,-2 C-54,2 -48,6 -42,4 C-14,-8 2,-30 6,-54Z M8,-52 C14,-32 32,-12 52,-2 C54,2 48,6 42,4 C20,-6 2,-26 -2,-48Z M-40,-70 C-30,-92 30,-92 40,-70 C42,-62 -42,-62 -40,-70Z',
  back: P(circ(0, -92, 6), SHU, 2), faces: [F(0, -72, 8, 'hane', { es: .7, mouth: false })], kanji: [0, -30, 9] }));
N('百', 'un grano blanco con una viga encima', 94, t => ({ body: `M0,-76 C28,-70 32,-28 20,-8 C12,2 -12,2 -20,-8 C-32,-28 -28,-70 0,-76Z ${tab(0, -80, 84, 12)}`, fill: '#FFFDF8',
  front: `<g class="k2-float">${P(ell(-40, -40, 3, 5), W, 1.6)}${P(ell(42, -52, 3, 5), W, 1.6)}${P(ell(40, -20, 3, 5), W, 1.6)}</g>`, faces: [F(0, -48, 9, 'maru')], kanji: [0, -20, 12] }));
N('今', 'una figura bajo un techito, señalando el suelo', 96, t => ({ body: `M0,-94 L52,-56 L44,-46 L0,-78 L-44,-46 L-52,-56Z ${pers(0, 0, 1.25)}`, front: J(16, -26, P('M0,0 L8,22 L2,24 L-6,4Z', t.d, 2.4), 0, 'k2-swing2') + star(18, 2, .5),
  faces: [F(0, -46, 6, 'ten', { es: .7 })], kanji: [0, -12, 11] }));
N('分', 'una espada que parte un abanico', 92, t => ({ body: 'M-6,-56 C-10,-36 -24,-16 -48,-4 C-52,0 -46,4 -40,2 C-14,-10 2,-32 6,-54Z M8,-52 C14,-32 30,-14 50,-4 C52,0 46,4 40,2 C20,-8 2,-28 -2,-48Z',
  front: sword(0, -40, 0, 1) + `<g class="k2-float">${star(-24, -70, .5)}${star(26, -66, .4)}</g>`, faces: [F(-26, -20, 0, 'ten', { es: .7, mouth: false }), F(28, -20, 0, 'ten', { es: .7, mouth: false })], kanji: [0, -4, 8] }));
N('間', 'un portón con el sol asomado entre sus hojas', 92, t => ({ body: gate, back: sunD(0, -52, 16) + rays(0, -52, [[0, .5], [180, .4]], t), front: feet([-26, 26], t, 9, 2),
  faces: [F(-26, -50, 7, 'tome', { es: .75 }), F(26, -50, 7, 'tome', { es: .75 })], kanji: [-26, -16, 11] }));
N('前', 'una luna y una espada bajo dos cuernitos', 90, t => ({ body: rrect(-40, -64, 80, 64, 12), back: P('M-26,-62 L-34,-88 L-14,-66Z', t.d, 3) + P('M26,-62 L34,-88 L14,-66Z', t.d, 3),
  front: moonD(-16, -18, .7) + sword(20, -4, 0, .55), faces: [F(0, -46, 11, 'ten')], kanji: [0, -24, 9] }));
N('早', 'un sol apoyado en un poste', 100, t => ({ body: `${circ(0, -66, 28)} ${tab(0, 0, 12, 40)} ${tab(0, -16, 50, 10)}`, fill: GOLD, back: rays(0, -66, [[-60, .6], [-30, .7], [0, .75], [30, .7], [60, .6]], t),
  faces: [F(0, -70, 10, 'maru', { mouth: 'open' })], kanji: [0, -48, 9] }));
N('夜', 'una figura bajo un techo junto a la luna', 94, t => ({ body: `M0,-92 L52,-56 H-52Z ${pers(-14, 0, 1.35)}`, fill: '#4B4A7A', front: moonD(30, -30, 1) + `<g class="k2-float">${star(44, -60, .4)}${star(-46, -40, .4)}</g>`,
  faces: [F(-14, -50, 6, 'dormido', { es: .7, expr: 'dormido' })], kanji: [-14, -14, 11] }));
N('夏', 'una cara acalorada que arrastra un pie', 96, t => ({ body: rrect(-30, -76, 60, 62, 20) + ' M-22,-16 L-34,0 H-6 L-4,-14Z M8,-14 L20,0 H40 L24,-16Z', back: sunD(34, -84, 13) + rays(34, -84, [[0, .4], [60, .4], [120, .4], [180, .4], [240, .4], [300, .4]], t),
  front: drop(-36, -50, .5, T.water.l) + drop(38, -40, .5, T.water.l), faces: [F(0, -50, 10, 'tome', { expr: 'triste' })], kanji: [0, -26, 9] }));
N('秋', 'una llama con una espiga dorada', 92, t => ({ body: 'M8,-2 C-20,-2 -30,-22 -20,-42 C-18,-30 -12,-28 -10,-34 C-8,-56 4,-70 10,-86 C14,-64 34,-48 30,-24 C28,-8 18,-2 8,-2Z', fill: '#F2A04A',
  back: J(-30, -6, Ln('M0,0 C-2,-30 -4,-50 -14,-70', GOLD, 3, 2.4) + P('M-14,-70 C-22,-76 -28,-72 -26,-62 C-20,-58 -16,-62 -14,-70Z', GOLD, 2), .3),
  front: leafFall(40, -70, SHU) + leafFall(-44, -90, '#F2A04A'), faces: [F(6, -32, 9, 'tome', { es: .85 })], kanji: [8, -12, 9] }));
N('曜', 'un sol con alas y un pajarito', 92, t => ({ body: circ(0, -44, 34), fill: GOLD, back: P('M-28,-56 C-46,-70 -58,-66 -60,-52 C-50,-52 -40,-46 -30,-38Z', W, 2.6) + P('M28,-56 C46,-70 58,-66 60,-52 C50,-52 40,-46 30,-38Z', W, 2.6),
  front: boxBird(30, -80, .7, t) + feet([-12, 12], t, 8, -6), faces: [F(0, -50, 11, 'ten')], kanji: [0, -24, 13] }));
N('終', 'un ovillo que se acaba sobre el hielo', 80, t => ({ body: circ(-8, -34, 30), mid: Ln('M-30,-44 C-14,-56 4,-54 14,-40 M-32,-30 C-14,-40 4,-38 16,-26 M-26,-16 C-12,-24 2,-22 10,-14', t.l, 1.8, 0),
  front: Ln('M18,-20 C30,-10 34,-4 50,-4', t.d, 2.4, 2) + P('M36,-8 L50,-8 L56,2 L30,2Z', T.water.l, 2.4), faces: [F(-10, -40, 9, 'dormido', { es: .8, expr: 'dormido' })], kanji: [-8, -16, 10] }));
// ===== Lugar =====
N('外', 'media luna con una vara al costado', 92, t => ({ body: 'M0,-84 A40,40 0 1,0 0,-4 A58,58 0 0,1 0,-84Z', front: bar(34, -84, 7, 84, WOOD) + P('M41,-56 L58,-48 L41,-42Z', WOODL, 2.4) + star(38, -90, .5),
  faces: [F(-26, -48, 8, 'ten', { es: .85 })], kanji: [-26, -24, 12] }));
N('東', 'un árbol con el sol saliendo detrás', 102, t => ({ body: `${circ(0, -70, 28)} ${circ(-26, -54, 20)} ${circ(26, -54, 20)}`, back: sunD(26, -84, 22) + rays(26, -84, [[0, .5], [45, .5], [90, .5]], t) + P('M-8,-36 C-8,-20 -10,-10 -22,0 H22 C10,-10 8,-20 8,-36Z', WOOD),
  faces: [F(-6, -68, 10, 'ten')], kanji: [-4, -44, 12] }));
N('天', 'una figura de brazos abiertos con una viga de cielo encima', 104, t => ({ body: `${tab(0, -90, 104, 12)} ${circ(0, -66, 15)} M-46,-48 C-24,-46 24,-46 46,-48 L44,-36 H10 L30,-4 C32,0 26,2 24,0 L0,-20 L-24,0 C-26,2 -32,0 -30,-4 L-10,-36 H-44Z`,
  front: `<g class="k2-float">${P(cloud(-40, -96, .3), W, 2)}${P(cloud(42, -98, .3), W, 2)}</g>`, faces: [F(0, -66, 6, 'maru', { es: .65 })], kanji: [0, -38, 8] }));
N('国', 'una joya dentro de una muralla', 88, t => ({ body: rrect(-44, -84, 88, 84, 8), mid: `<rect x="-34" y="-74" width="68" height="64" rx="4" fill="${t.l}"/>` + [-38, -19, 0, 19, 38].map(x => `<rect x="${x - 5}" y="-92" width="10" height="10" fill="${t.d}"/>`).join(''),
  front: P(circ(-16, -30, 13), '#9FD8C8', 2.6) + `<circle cx="-20" cy="-34" r="3" fill="${W}" opacity=".8"/>`, faces: [F(0, -60, 9, 'tome', { es: .75, mouth: false })], kanji: [18, -28, 13] }));
N('町', 'un arrozal con un cartel de calle', 86, t => ({ body: `${rrect(-50, -44, 62, 44, 5)}`, mid: Ln('M-50,-22 H12 M-19,-44 V0', t.d, 1.8, 0), front: bar(26, -78, 6, 78, WOOD) + P(rrect(14, -84, 34, 20, 3), T.water.f, 2.6) + Ln('M20,-74 H42', W, 2, 0),
  faces: [F(-34, -32, 0, 'ten', { es: .6, mouth: false }), F(-4, -32, 0, 'ten', { es: .6, mouth: false })], kanji: [-19, -10, 9] }));
N('村', 'un árbol con una casita medida al lado', 96, t => ({ body: `${circ(-20, -64, 24)} ${circ(-40, -50, 15)} ${circ(0, -50, 15)}`, back: P('M-26,-36 C-26,-20 -28,-10 -36,0 H-4 C-12,-10 -14,-20 -14,-36Z', WOOD),
  front: P(house(32, 0, 28, 22, 16), T.earth.f, 2.6) + `<path d="M28,0 v-12 h8 v12Z" fill="${T.earth.d}"/>`, faces: [F(-20, -64, 9, 'ten', { es: .85 })], kanji: [-20, -42, 9] }));
N('道', 'una cabeza que viaja sobre una senda', 96, t => ({ body: `${circ(8, -66, 22)} M-52,-8 C-30,-30 20,-30 50,-40 L54,-26 C30,-14 -10,-10 -30,4 H-52Z`, back: P(circ(8, -92, 8), '#3A2E3A'),
  mid: Ln('M-36,-6 C-16,-18 16,-18 40,-28', W, 1.8, 0), front: Ln('M-30,-60 h-12 M-28,-72 h-16', t.d, 2.2, 2), faces: [F(8, -68, 9, 'harai', { es: .85 })], kanji: [-32, -8, 9] }));
N('駅', 'un caballo detenido junto a un mojón', 96, t => ({ body: 'M-48,-36 C-48,-50 -30,-54 -14,-52 L-6,-74 C-2,-84 14,-84 18,-74 L26,-58 C28,-54 22,-50 18,-52 L10,-54 L10,-18 L12,0 H0 L-2,-16 H-32 L-34,0 H-46 L-44,-20 C-48,-26 -48,-30 -48,-36Z',
  back: P('M-12,-56 C-18,-68 -12,-82 0,-86 C-6,-78 -2,-68 2,-62Z', '#3A2E3A', 2.4), front: bar(34, -70, 8, 70, '#9A9388') + P(rrect(24, -90, 28, 22, 4), W, 2.6) + `<circle cx="38" cy="-79" r="6" fill="none" stroke="${SHU}" stroke-width="2"/><path d="M38,-83 v4 l3,2" stroke="${INK}" stroke-width="1.4" fill="none"/>`,
  faces: [F(8, -70, 0, 'tome', { es: .65, mouth: false })], kanji: [-18, -34, 11] }));
N('社', 'un altar pequeño sobre un montículo', 96, t => ({ body: `${mound(46, 22)} ${rrect(-18, -62, 36, 40, 3)} M-34,-60 L0,-88 L34,-60Z`, mid: `<path d="M-7,-22 v-22 h14 v22Z" fill="${t.d}"/>`,
  front: Ln('M-20,-52 C-8,-46 8,-46 20,-52', GOLD, 2.4, 0) + shide(-10, -50) + shide(10, -50), faces: [F(0, -70, 0, 'tome', { es: .55, mouth: false })], kanji: [0, -8, 9] }));
N('京', 'una torre con farol sobre una colina', 106, t => ({ body: `${mound(48, 22)} ${rrect(-16, -74, 32, 54, 3)} M-30,-72 L0,-100 L30,-72Z M-26,-46 L0,-58 L26,-46Z`, back: `<g class="k2-float">${P(circ(0, -108, 5), GOLD, 2)}</g>`,
  mid: `<rect x="-6" y="-68" width="12" height="10" fill="${GLOW}"/><rect x="-6" y="-40" width="12" height="12" fill="${GLOW}"/>`, faces: [F(-24, -8, 0, 'ten', { es: .55, mouth: false }), F(24, -8, 0, 'ten', { es: .55, mouth: false })], kanji: [0, -8, 9] }));
N('県', 'un ojo sobre tres patitas', 86, t => ({ body: `${ell(0, -52, 44, 28)}`, mid: P(circ(0, -52, 16), W, 1.6) + `<circle cx="0" cy="-52" r="9" fill="${t.d}"/><circle cx="-3" cy="-55" r="3" fill="${W}"/>`,
  front: Ln('M-20,-28 L-28,-4 M0,-24 V-2 M20,-28 L28,-4', t.d, 5, 3) + feet([-28, 0, 28], t, 7, 0), faces: [F(0, -30, 0, 'ten', { mouthOnly: true })], kanji: [32, -52, 8] }));
N('地', 'un terrón con una serpiente enroscada', 80, t => ({ body: mound(50, 44), front: Ln('M-30,-30 C-44,-34 -46,-50 -34,-54 C-24,-56 -18,-48 -22,-42 C-14,-40 -8,-46 -10,-58', T.wood.d, 5, 3) + P(circ(-10, -60, 5), T.wood.d, 2),
  faces: [F(8, -30, 10, 'tome', { es: .9 })], kanji: [8, -10, 10] }));
N('池', 'un charco con una serpiente de agua', 70, t => ({ body: ell(0, -22, 54, 22), mid: `<ellipse cx="0" cy="-22" rx="40" ry="13" fill="${t.l}" opacity=".7"/>`, front: Ln('M20,-26 C28,-40 40,-36 38,-28 C36,-22 28,-26 30,-30', T.wood.d, 4, 2.6) + P(ell(-34, -34, 9, 5), T.wood.f, 2),
  faces: [F(-8, -24, 9, 'ten', { es: .8 })], kanji: [22, -13, 8] }));
N('海', 'una ola con sombrero', 92, t => ({ body: 'M-56,0 C-56,-30 -40,-52 -16,-58 C6,-64 22,-54 26,-40 C28,-30 20,-24 14,-28 C22,-14 44,-14 56,-26 V0Z', back: P('M-34,-56 L-6,-86 L22,-56Z', SHU, 3),
  mid: Ln('M-40,-10 q8,-8 16,0 q8,8 16,0 q8,-8 16,0', W, 2, 0), faces: [F(-16, -36, 10, 'tome')], kanji: [30, -9, 9] }));
N('空', 'un techo con un hueco por donde se ve el cielo', 96, t => ({ body: 'M-52,-40 L0,-92 L52,-40 V-30 H-52Z M-44,-30 H-30 V0 H-44Z M30,-30 H44 V0 H30Z', mid: P(circ(0, -58, 14), T.water.l, 2.4),
  front: `<g class="k2-float">${P(cloud(0, -18, .45), W, 2.4)}</g>` + boxBird(36, -80, .45, t), faces: [F(-24, -38, 0, 'ten', { es: .55, mouth: false }), F(24, -38, 0, 'ten', { es: .55, mouth: false })], kanji: [0, -58, 11] }));
N('所', 'una puerta con un hacha colgada', 92, t => ({ body: `${tab(0, -78, 76, 12)} ${rrect(-28, -76, 56, 76, 4)}`, fill: WOODL, mid: Ln('M-28,-40 H28', W, 1.6, 0) + P(circ(-18, -36, 4), GOLD, 1.6),
  front: J(16, -62, bar(-2, 0, 5, 34, WOOD, 2) + P('M-2,2 C-16,0 -20,12 -14,20 L3,14Z', T.metal.f, 2.4), .3), faces: [F(-4, -58, 7, 'tome', { es: .7, mouth: false })], kanji: [-6, -14, 11] }));
N('周', 'un cerco con un guardia que da vueltas', 90, t => ({ body: 'M-46,-84 H46 V0 H32 V-70 H-32 V0 H-46Z', mid: Ln('M-39,-56 h7 M-39,-28 h7 M32,-56 h7 M32,-28 h7', t.d, 1.6, 0),
  front: `<g class="k2-rot" transform="translate(0 -40)">${Ln('M-20,0 A20,20 0 1,1 0,20', SHU, 2.4, 2)}</g>` + P(pers(0, -8, .8), T.metal.f, 2.6), faces: [F(-39, -44, 0, 'tome', { es: .55, mouth: false }), F(39, -44, 0, 'tome', { es: .55, mouth: false })], kanji: [0, -77, 9] }));
N('回', 'un remolino cuadrado', 84, t => ({ body: rrect(-40, -80, 80, 80, 12), mid: `<rect x="-22" y="-62" width="44" height="44" rx="8" fill="none" stroke="${W}" stroke-width="5"/>`,
  front: `<g class="k2-rot" transform="translate(0 -40)">${Ln('M-10,0 A10,10 0 1,1 0,10', t.d, 3, 0)}</g>`, faces: [F(0, -71, 12, 'maru', { es: .6, mouth: false })], kanji: [0, -9, 8] }));
// ===== Personas =====
N('名', 'media luna sobre una boca que llama', 96, t => ({ body: `${rrect(-30, -44, 60, 44, 12)} M6,-92 A22,22 0 1,0 6,-50 A30,30 0 0,1 6,-92Z`, front: waves(38, -24, t) + P(rrect(-50, -30, 18, 12, 3), W, 2) + Ln('M-46,-24 h10', INK, 1.3, 0),
  faces: [F(0, -30, 9, 'ten', { es: .8, mouth: 'open' })], kanji: [-8, -70, 9] }));
N('元', 'dos piernas que cargan dos tablillas', 84, t => ({ body: `${tab(0, -66, 60, 14)} ${tab(0, -44, 92, 16)} M-22,-44 C-22,-24 -28,-10 -44,-2 C-48,2 -42,6 -38,4 C-18,-4 -8,-22 -8,-44Z M8,-44 V-14 C8,-2 18,2 46,0 L46,-12 C28,-10 22,-12 22,-18 V-44Z`,
  front: `<g class="k2-float">${star(40, -72, .5)}</g>`, faces: [F(0, -53, 9, 'ten', { es: .7, mouth: 'open' })], kanji: [0, -73, 9] }));
N('姉', 'una chica con bolsa de feria', 100, t => ({ body: `M-14,-56 C-26,-48 -30,-28 -34,0 L34,0 C30,-28 26,-48 14,-56Z ${circ(0, -72, 18)}`, back: P(circ(0, -74, 20), '#3A2E3A') + P('M14,-76 C28,-76 30,-56 24,-44 C20,-52 16,-60 12,-66Z', '#3A2E3A', 2.6),
  front: J(30, -34, P('M-8,0 H8 L10,22 H-10Z', GOLD, 2.4) + Ln('M-5,0 C-5,-10 5,-10 5,0', WOOD, 2, 1.6), .3), faces: [F(0, -71, 7, 'tome', { es: .72 })], kanji: [0, -18, 14] }));
N('妹', 'una niña con un brote en la cabeza', 84, t => ({ body: `M-12,-44 C-22,-38 -26,-22 -28,0 L28,0 C26,-22 22,-38 12,-44Z ${circ(0, -58, 17)}`, back: P(circ(-18, -66, 8), '#3A2E3A') + P(circ(18, -66, 8), '#3A2E3A') + sprout(0, -74, .3),
  faces: [F(0, -57, 7, 'maru', { es: .72 })], kanji: [0, -14, 13] }));
N('彼', 'un caminante con abrigo de piel', 100, t => ({ body: `${circ(0, -78, 17)} M-18,-60 C-34,-50 -36,-10 -30,0 H30 C36,-10 34,-50 18,-60Z`, mid: `<path d="M-18,-60 C-10,-50 10,-50 18,-60 L24,-52 C12,-40 -12,-40 -24,-52Z" fill="${W}"/>` + Ln('M0,-46 V0', t.d, 1.6, 0),
  front: Ln('M-46,-20 h10 M-50,-8 h14', t.d, 2.2, 2), faces: [F(0, -78, 7, 'hane', { es: .75 })], kanji: [12, -22, 11] }));
N('者', 'un anciano sentado al sol', 96, t => ({ body: `${circ(0, -62, 18)} M-20,-44 C-34,-30 -36,-8 -28,0 H28 C36,-8 34,-30 20,-44Z`, back: sunD(36, -86, 12) + bar(-40, -60, 5, 60, WOOD),
  mid: `<path d="M-10,-50 C-6,-38 6,-38 10,-50 C6,-30 -6,-30 -10,-50Z" fill="${W}"/>`, faces: [F(0, -64, 7, 'tome', { es: .75, brow: true, mouth: false })], kanji: [0, -16, 12] }));
N('若', 'una mano con un brote tierno', 92, t => ({ body: rrect(-30, -52, 60, 52, 16), back: J(0, -50, `<g transform="scale(.9)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .2),
  front: hand(36, -24, -30, .6, t.d), faces: [F(0, -32, 10, 'maru', { mouth: 'open' })], kanji: [0, -8, 9] }));
// ===== Acciones =====
N('聞', 'un portón con una oreja asomada', 92, t => ({ body: gate, front: ear(0, -44, 1.1, PINK) + feet([-26, 26], t, 9, 2) + waves(52, -60, t),
  faces: [F(-26, -56, 7, 'maru', { es: .75 }), F(26, -56, 7, 'maru', { es: .75 })], kanji: [-26, -18, 11] }));
N('開', 'un portón con la tranca levantada', 92, t => ({ body: 'M-56,-84 H-26 L-20,0 H-50Z M26,-84 H56 L50,0 H20Z', back: `<path d="M-22,-80 H22 V0 H-22Z" fill="${GLOW}" opacity=".7"/>` + rays(0, -40, [[0, .5], [90, .4], [270, .4]], t),
  front: J(0, -66, bar(-24, -3, 48, 7, WOOD), .3) + feet([-36, 36], t, 9, 2), faces: [F(-38, -46, 6, 'maru', { es: .7 }), F(38, -46, 6, 'maru', { es: .7 })], kanji: [-37, -16, 10] }));
N('会', 'dos figuras bajo un mismo techito', 92, t => ({ body: `M0,-92 L54,-54 L46,-44 L0,-76 L-46,-44 L-54,-54Z ${pers(-20, 0, 1.1)} ${pers(20, 0, 1.1)}`, front: heartP(0, -50, .45),
  faces: [F(-20, -40, 5, 'ten', { es: .65 }), F(20, -40, 5, 'hane', { es: .65 })], kanji: [-20, -11, 9] }));
N('書', 'un pincel parado sobre un tintero', 104, t => ({ body: `${rrect(-30, -30, 60, 30, 8)} ${tab(0, -30, 10, 56)} M-8,-86 C-8,-98 0,-104 0,-104 C0,-104 8,-98 8,-86Z`, mid: `<ellipse cx="0" cy="-22" rx="20" ry="6" fill="${INK}" opacity=".8"/>`,
  front: Ln('M-16,-52 H16 M-16,-66 H16', t.d, 3, 2) + hand(18, -58, -60, .55, T.earth.f), faces: [F(-12, -11, 6, 'tome', { es: .6, mouth: false })], kanji: [16, -10, 9] }));
N('語', 'una boca que habla a un coro de cinco', 90, t => ({ body: `${rrect(-50, -40, 44, 40, 10)} ${tab(-28, -48, 54, 8)} ${tab(-28, -60, 40, 8)}`, front: [0, 1, 2, 3, 4].map(i => P(circ(10 + (i % 3) * 18, -18 - Math.floor(i / 3) * 22 - (i % 2) * 4, 8), i % 2 ? t.l : t.f, 2.2) + `<ellipse cx="${10 + (i % 3) * 18}" cy="${-17 - Math.floor(i / 3) * 22 - (i % 2) * 4}" rx="3" ry="2.4" fill="${MOUTH}"/>`).join(''),
  faces: [F(-28, -28, 8, 'ten', { es: .75, mouth: 'open' })], kanji: [-28, -6, 9] }));
N('飲', 'un cuenco junto a una boca abierta', 90, t => ({ body: `${bowl(-14, 0, 32)} ${circ(26, -46, 20)}`, front: steam(-14, -30, t.d) + Ln('M10,-36 C-2,-34 -8,-30 -10,-24', T.water.f, 3, 2.4),
  faces: [F(26, -52, 7, 'ten', { es: .75, mouth: 'open' })], kanji: [-14, -12, 10] }));
N('作', 'una figura que cose', 96, t => ({ body: pers(-10, 0, 1.5), front: P('M14,-40 L44,-48 L48,-10 L20,-6Z', t.l, 2.6) + Ln('M22,-34 L40,-38 M24,-22 L42,-26', SHU, 1.4, 0) + J(8, -36, Ln('M0,0 L18,-14', '#9A9388', 1.6, 1.2), 0, 'k2-swing2'),
  faces: [F(-10, -58, 7, 'tome', { es: .75 })], kanji: [-10, -16, 13] }));
N('知', 'una flecha que sale de una boca', 84, t => ({ body: rrect(-10, -56, 56, 56, 14), front: `<g transform="translate(-30 -34) rotate(-90)">${P('M0,-24 L8,-10 H3 V14 L8,22 H-8 L-3,14 V-10 H-8Z', T.metal.f, 2.4)}</g>` + `<g class="k2-float">${star(34, -70, .6)}</g>`,
  faces: [F(18, -38, 9, 'maru', { mouth: 'open' })], kanji: [18, -10, 9] }));
N('住', 'una figura junto a su candelabro', 98, t => ({ body: `${pers(-18, 0, 1.4)}`, front: bar(22, -8, 26, 8, T.metal.d) + bar(32, -56, 6, 50, T.metal.d) + bar(20, -60, 30, 7, T.metal.d) + `<g transform="translate(35 -60) scale(1)">${flame(SHU, GOLD)}</g>`,
  back: P(house(0, 0, 100, 60, 34), T.earth.l, 2.6, 'opacity=".55"'), faces: [F(-18, -54, 6, 'tome', { es: .7 })], kanji: [-18, -14, 12] }));
N('仕', 'una figura que saluda a un samurái', 96, t => ({ body: `${pers(-24, 0, 1.2)} ${circ(22, -66, 15)} M-12,-50 H56 L52,-38 H34 L40,0 H4 L10,-38 H-8Z`, back: P('M6,-76 C10,-90 34,-90 38,-76Z', T.metal.d, 2.6),
  faces: [F(-24, -46, 5, 'ten', { es: .65 }), F(22, -66, 6, 'harai', { es: .65, brow: true })], kanji: [-24, -12, 10] }));
N('洗', 'unas piernas que entran al agua', 86, t => ({ body: 'M-52,0 V-22 q13,-12 26,0 q13,12 26,0 q13,-12 26,0 q13,12 26,0 V0Z M-20,-22 C-20,-50 -14,-66 -10,-80 H10 C14,-66 20,-50 20,-22Z',
  front: `<g class="k2-float">${bubble(-34, -50, 6, T.water)}${bubble(36, -60, 5, T.water)}${bubble(28, -36, 3, T.water)}</g>`, faces: [F(0, -56, 7, 'ten', { es: .75 })], kanji: [0, -32, 9] }));
N('歩', 'dos huellas, una delante de la otra', 84, t => ({ body: 'M-36,-40 C-36,-56 -14,-56 -12,-40 C-10,-20 -14,-6 -24,-2 C-34,-4 -36,-20 -36,-40Z M12,-70 C12,-86 34,-86 36,-70 C38,-50 34,-36 24,-32 C14,-34 12,-50 12,-70Z',
  front: [-34, -27, -20, -13].map(x => P(circ(x, -58, 3), t.d, 1.4)).join('') + [14, 21, 28, 35].map(x => P(circ(x, -88, 3), t.d, 1.4)).join(''), faces: [F(-24, -30, 0, 'ten', { es: .6, mouth: false }), F(24, -60, 0, 'ten', { es: .6, mouth: false })], kanji: [24, -44, 8] }));
N('起', 'una figura que salta de su manta', 92, t => ({ body: `${circ(0, -70, 16)} M-12,-56 L-34,-76 L-40,-66 L-16,-42 L-14,-20 H14 L16,-42 L40,-66 L34,-76 L12,-56Z M-50,-22 C-30,-30 30,-30 50,-22 L46,0 H-46Z`,
  front: `<g class="k2-float">${star(-44, -80, .5)}${star(46, -84, .5)}</g>`, mid: Ln('M-44,-12 H44', t.l, 2, 0), faces: [F(0, -70, 6, 'maru', { es: .7, mouth: 'open' })], kanji: [0, -10, 9] }));
N('切', 'una espada con una marca de corte', 96, t => ({ body: rrect(-44, -30, 60, 30, 6), fill: WOODL, front: sword(24, -22, 20, 1.2) + Ln('M-30,-30 L-22,-44 M-14,-30 L-8,-42', SHU, 2.2, 2) + P(ell(-20, -34, 14, 7), T.wood.f, 2.4) + Ln('M-20,-41 V-27', W, 1.6, 0),
  faces: [F(-26, -16, 7, 'harai', { es: .7 })], kanji: [2, -13, 10] }));
N('交', 'una figura de piernas cruzadas con sombrero', 96, t => ({ body: `${circ(0, -66, 17)} M-18,-48 H18 L14,-28 L40,-4 L30,4 L0,-18 L-30,4 L-40,-4 L-14,-28Z`, back: P('M-30,-78 C-20,-94 20,-94 30,-78 C30,-74 -30,-74 -30,-78Z', t.d, 2.6),
  faces: [F(0, -64, 6, 'tome', { es: .7 })], kanji: [0, -34, 8] }));
N('可', 'una boca que asiente bajo un alero', 90, t => ({ body: `${tab(0, -74, 96, 14)} M30,-74 H44 V-10 C44,2 30,4 20,2 L22,-10 C28,-8 30,-10 30,-14Z ${rrect(-34, -52, 46, 40, 10)}`,
  front: Ln('M-46,-22 l8,8 l14,-16', T.wood.d, 3.4, 2.6), faces: [F(-11, -38, 8, 'ten', { es: .75 })], kanji: [-10, -81, 9] }));
// ===== Cuerpo, comida, animales y cosas =====
N('舌', 'una boca que saca la lengua', 80, t => ({ body: rrect(-36, -62, 72, 50, 16), front: J(0, -22, P('M-10,0 H10 V16 C10,28 -10,28 -10,16Z', PINK, 2.6) + Ln('M0,2 V18', SHU, 1.6, 0), .2, 'k2-swing2') + P('M-6,-74 L0,-86 L10,-80 L2,-72Z', t.d, 2),
  faces: [F(0, -44, 11, 'hane', { mouth: false })], kanji: [22, -24, 9] }));
N('貝', 'una almeja con dos patitas', 66, t => ({ body: 'M0,-4 C-34,-4 -46,-26 -34,-44 C-22,-58 22,-58 34,-44 C46,-26 34,-4 0,-4Z', mid: Ln('M0,-8 V-52 M-14,-9 L-22,-46 M14,-9 L22,-46', t.d, 1.6, 0),
  front: feet([-12, 12], t, 7, 0), faces: [F(0, -32, 10, 'ten', { es: .8 })], kanji: [0, -13, 9] }));
N('味', 'una boca que prueba un brote', 86, t => ({ body: rrect(-44, -56, 56, 56, 16), front: sprout(34, -8, .4) + bar(31, -8, 5, 8, WOOD, 1.6) + `<g class="k2-float">${star(30, -62, .5)}</g>`,
  faces: [F(-16, -38, 9, 'ten', { mouth: 'open' })], kanji: [-16, -12, 10] }));
N('茶', 'una figura que recoge hojas bajo un arbusto', 84, t => ({ body: `${bowl(0, 0, 36)}`, fill: '#EFF3F7', mid: `<ellipse cx="0" cy="-25" rx="32" ry="6" fill="#8DC063"/>`, front: steam(0, -34, T.wood.d) + J(26, -30, `<g transform="scale(.4) rotate(40)">${leafR(T.wood.d, T.wood.l)}</g>`, .3),
  faces: [F(-10, -14, 8, 'tome', { es: .75 })], kanji: [20, -11, 8] }));
N('魚', 'un pez con escamas en cuadrícula', 72, t => ({ body: 'M-50,-34 C-36,-60 10,-62 30,-40 L52,-56 L48,-34 L52,-12 L30,-28 C10,-6 -36,-8 -50,-34Z', mid: Ln('M-14,-50 V-18 M0,-52 V-16 M14,-48 V-20 M-22,-40 H24 M-22,-28 H24', t.l, 1.4, 0),
  front: `<g class="k2-float">${bubble(-56, -56, 4, T.water)}</g>`, faces: [F(-36, -38, 0, 'maru', { es: .8, mouth: false })], kanji: [4, -34, 11] }));
N('猫', 'un gato escondido entre pasto', 86, t => ({ body: `${circ(0, -50, 26)} M-22,-30 C-28,-14 -26,-4 -18,0 H18 C26,-4 28,-14 22,-30Z`, back: P('M-24,-62 L-28,-88 L-6,-74Z', t.f, 3) + P('M24,-62 L28,-88 L6,-74Z', t.f, 3) + J(22, -6, Ln('M0,0 C14,-2 20,-16 14,-28', t.d, 5, 3), 0, 'k2-swing2'),
  mid: Ln('M-34,-48 h-12 M-34,-42 l-12,4 M34,-48 h12 M34,-42 l12,4', INK, 1.2, 0), front: J(-40, 0, `<g transform="scale(.4)">${leafL(T.wood.d, T.wood.l)}</g>`, .2) + J(42, 0, `<g transform="scale(.4)">${leafR(T.wood.f, T.wood.l)}</g>`, .5),
  faces: [F(0, -54, 11, 'hane')], kanji: [0, -14, 11] }));
N('黒', 'una casita tiznada sobre brasas', 86, t => ({ body: house(0, -12, 56, 40, 28), fill: '#4A444E', front: `<g transform="translate(-22 0) scale(.8)">${flame(SHU, GOLD)}</g><g transform="translate(0 2) scale(.9)">${flame(GOLD, GLOW)}</g><g transform="translate(22 0) scale(.8)">${flame(SHU, GOLD)}</g>` + `<g class="k2-float">${P(circ(20, -86, 5), '#4A444E', 2)}${P(circ(30, -96, 3), '#4A444E', 2)}</g>`,
  faces: [F(0, -38, 10, 'maru')], kanji: [0, -62, 9] }));
N('化', 'una figura y su reflejo invertido', 96, t => ({ body: `${pers(-22, 0, 1.3)} ${circ(22, -14, 14)} M13,-26 L4,-52 H40 L31,-26Z`, front: `<g class="k2-float">${star(0, -70, .6)}${star(40, -64, .4)}</g>` + Ln('M-4,-40 C2,-46 6,-46 10,-42', GOLD, 2.2, 2),
  faces: [F(-22, -48, 6, 'ten', { es: .7 }), F(22, -14, 5, 'hane', { es: .6, mouth: false })], kanji: [-22, -12, 10] }));
N('台', 'un pedestal con algo encima', 80, t => ({ body: `${tab(0, -40, 60, 12)} M-22,-40 H22 L30,0 H-30Z`, front: P(circ(0, -66, 12), GOLD, 2.6) + `<g class="k2-float">${star(22, -78, .4)}</g>`,
  faces: [F(0, -28, 8, 'tome', { es: .7 })], kanji: [0, -8, 9] }));
N('物', 'una vaca con un banderín', 88, t => ({ body: ell(-6, -32, 38, 30), fill: '#FFFDF8', back: P(ell(-42, -50, 9, 6), t.f, 2.4) + P(ell(30, -50, 9, 6), t.f, 2.4) + P('M-30,-56 C-38,-66 -36,-76 -30,-80', '#EDE6DA', 2.6),
  mid: P(ell(-6, -16, 16, 10), PINK, 2), front: bar(42, -84, 5, 84, WOOD) + J(47, -80, P('M0,0 H22 L16,8 L22,16 H0Z', SHU, 2.4), .3) + feet([-24, 12], t, 8, -1), faces: [F(-6, -42, 11, 'tome', { mouth: false })], kanji: [22, -34, 8] }));
N('料', 'un cucharón lleno de arroz', 80, t => ({ body: `${bowl(-6, 0, 34)} M22,-30 L52,-70 L60,-64 L32,-22Z`, fill: WOODL, mid: `<ellipse cx="-6" cy="-24" rx="30" ry="6" fill="${W}"/>`,
  front: `<g class="k2-float">${P(ell(-20, -40, 3, 5), W, 1.6)}${P(ell(4, -46, 3, 5), W, 1.6)}</g>`, faces: [F(-16, -12, 7, 'ten', { es: .7 })], kanji: [14, -10, 8] }));
N('理', 'un rey que ordena una aldea', 98, t => ({ body: `${circ(-14, -62, 18)} M-34,-44 C-44,-30 -44,-8 -36,0 H8 C16,-8 16,-30 6,-44Z`, back: P('M-32,-76 L-36,-96 L-24,-86 L-14,-100 L-4,-86 L8,-96 L4,-76Z', GOLD, 3),
  front: P(house(38, 0, 20, 16, 12), T.earth.f, 2.4) + P(house(38, -32, 20, 16, 12), T.earth.f, 2.4), faces: [F(-14, -62, 7, 'tome', { es: .75, brow: true })], kanji: [-14, -18, 11] }));
N('飯', 'un cuenco de arroz con una mano que vuelve', 86, t => ({ body: `${bowl(0, 0, 40)} M-34,-28 C-30,-62 30,-62 34,-28Z`, fill: '#EFF3F7', mid: `<path d="M-34,-28 C-30,-62 30,-62 34,-28Z" fill="${W}"/>` + Ln('M-10,-44 l4,3 M6,-48 l4,3 M-2,-36 l4,3', '#D9D2C4', 1.6, 0),
  front: Ln('M30,-66 L52,-30 M38,-70 L56,-36', WOOD, 2.6, 2), faces: [F(0, -16, 10, 'ten', { es: .85, mouth: 'open' })], kanji: [0, -42, 10] }));
N('紙', 'un pliego hecho de hilos', 88, t => ({ body: 'M-36,-84 H24 L38,-70 V0 H-36Z', fill: '#FFF8E4', mid: `<path d="M24,-84 V-70 H38Z" fill="${T.earth.l}"/>` + Ln('M-28,-20 H30 M-28,-10 H30', T.wood.l, 1.4, 0),
  front: Ln('M-36,-30 C-48,-28 -50,-16 -44,-8 M-36,-50 C-52,-50 -56,-36 -52,-28', T.wood.d, 2, 1.6), faces: [F(0, -52, 10, 'ten')], kanji: [0, -28, 10] }));
N('酒', 'una vasija que gotea', 92, t => ({ body: 'M-10,-88 H10 V-70 C30,-62 36,-40 34,-20 C32,-6 20,0 0,0 C-20,0 -32,-6 -34,-20 C-36,-40 -30,-62 -10,-70Z', mid: `<path d="M-14,-72 H14 V-66 H-14Z" fill="${SHU}"/>`,
  front: drop(44, -30, .6, T.water.f) + P(bowl(46, 0, 12), W, 2.4), faces: [F(0, -42, 10, 'hane')], kanji: [0, -16, 12] }));
N('電', 'una nube con un rayo que cae', 104, t => ({ body: cloud(0, -70, 1.2), fill: '#B9C3D0', front: P('M-4,-50 L-18,-22 H-4 L-12,0 L16,-32 H2 L10,-50Z', GOLD, 2.8) + `<g class="k2-float">${star(-40, -30, .5)}${star(40, -24, .4)}</g>`,
  faces: [F(0, -78, 11, 'harai', { brow: true })], kanji: [0, -56, 10] }));
N('学', 'un niño con un sombrero del que salen chispas', 92, t => ({ body: `${circ(0, -50, 20)} M-18,-32 C-26,-18 -24,-4 -14,0 H14 C24,-4 26,-18 18,-32Z`, back: P('M-28,-62 H28 L22,-72 H-22Z', t.d, 2.6) + P('M-16,-72 H16 L0,-82Z', t.d, 2.6) + Ln('M-16,-86 l-4,-10 M0,-90 v-10 M16,-86 l4,-10', GOLD, 2.4, 2),
  front: P('M-14,-14 H14 L18,0 H-18Z', '#FFF8E4', 2.4) + Ln('M0,-14 V0', t.d, 1.2, 0), faces: [F(0, -50, 8, 'maru', { es: .8 })], kanji: [0, -24, 9] }));
N('医', 'un botiquín con una flecha dentro', 80, t => ({ body: rrect(-42, -60, 84, 60, 8), fill: '#FFFDF8', back: bar(-14, -70, 28, 10, t.d), mid: `<path d="M-6,-48 H6 V-36 H18 V-24 H6 V-12 H-6 V-24 H-18 V-36 H-6Z" fill="${SHU}"/>`,
  faces: [F(-28, -46, 0, 'ten', { es: .6, mouth: false }), F(28, -46, 0, 'ten', { es: .6, mouth: false })], kanji: [28, -16, 10] }));
N('楽', 'un tambor con cascabeles sobre un árbol', 98, t => ({ body: `${ell(0, -58, 36, 26)}`, fill: '#FFFDF8', back: P('M-8,-34 C-8,-20 -10,-10 -22,0 H22 C10,-10 8,-20 8,-34Z', WOOD), mid: `<ellipse cx="0" cy="-58" rx="36" ry="26" fill="none" stroke="${SHU}" stroke-width="4"/>`,
  front: J(-40, -66, P(circ(0, 8, 6), GOLD, 2), .2) + J(40, -66, P(circ(0, 8, 6), GOLD, 2), .6) + `<g class="k2-float">${Ln('M-50,-90 v-10 l6,-2 v10', INK, 1.6, 1.2)}${Ln('M46,-92 v-10 l6,-2 v10', INK, 1.6, 1.2)}</g>`, faces: [F(0, -62, 11, 'ten', { mouth: 'open', expr: 'feliz' })], kanji: [0, -42, 9] }));
N('英', 'una flor en el centro de un marco', 92, t => ({ body: rrect(-40, -72, 80, 72, 8), mid: `<rect x="-30" y="-64" width="60" height="38" rx="4" fill="${t.l}"/>` + Ln('M0,-40 V-28', T.wood.d, 2.4, 0) + flowerP(0, -48, .8, SHU),
  back: J(-20, -70, `<g transform="scale(.5)">${leafL(T.wood.d, T.wood.l)}</g>`, .2) + J(20, -70, `<g transform="scale(.5)">${leafR(T.wood.f, T.wood.l)}</g>`, .5), faces: [F(-14, -15, 7, 'ten', { es: .65 })], kanji: [20, -13, 9] }));
N('重', 'una figura aplastada por un bulto enorme', 98, t => ({ body: `M-40,-92 C-46,-60 -44,-44 -36,-36 H36 C44,-44 46,-60 40,-92 C20,-98 -20,-98 -40,-92Z ${pers(0, 0, 1)}`, mid: Ln('M-40,-64 H40', SHU, 3, 0),
  front: drop(-28, -24, .45, T.water.l) + drop(28, -20, .45, T.water.l), faces: [F(0, -36, 5, 'tome', { es: .6, expr: 'triste' })], kanji: [0, -78, 11] }));
N('短', 'una flecha diminuta junto a un poroto', 60, t => ({ body: `${ell(22, -22, 24, 21)}`, front: `<g transform="translate(-24 -22) rotate(90)">${P('M0,-22 L8,-10 H3 V10 L8,18 H-8 L-3,10 V-10 H-8Z', T.metal.f, 2.4)}</g>` + Ln('M-46,-42 v8 M-2,-42 v8 M-46,-38 H-2', INK, 1.4, 0),
  faces: [F(22, -28, 7, 'ten', { es: .7 })], kanji: [22, -10, 8] }));
N('全', 'un rey bajo un techo amplio', 100, t => ({ body: `M0,-96 L56,-56 L48,-46 L0,-80 L-48,-46 L-56,-56Z ${circ(0, -52, 15)} M-18,-38 C-30,-28 -30,-8 -24,0 H24 C30,-8 30,-28 18,-38Z`, back: P('M-14,-64 L-16,-78 L-8,-72 L0,-82 L8,-72 L16,-78 L14,-64Z', GOLD, 2.6),
  mid: Ln('M-24,-24 H24 M-25,-12 H25', GOLD, 2, 0), faces: [F(0, -52, 6, 'tome', { es: .65 })], kanji: [0, -18, 9] }));
N('番', 'un arrozal con granos numerados', 84, t => ({ body: rrect(-44, -50, 88, 50, 8), mid: Ln('M-44,-25 H44 M0,-50 V0', t.d, 2, 0), back: [[-24, -60], [0, -68], [24, -60]].map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${(i - 1) * 20})">${P(ell(0, 0, 5, 9), W, 2)}</g>`).join(''),
  front: P(circ(-22, -38, 7), SHU, 1.6) + P(circ(22, -38, 7), GOLD, 1.6), faces: [F(-22, -14, 0, 'ten', { es: .6, mouth: false }), F(22, -14, 0, 'ten', { es: .6, mouth: false })], kanji: [0, -25, 10] }));
N('読', 'un vendedor que lee en voz alta', 96, t => ({ body: `${pers(0, 0, 1.45)}`, back: P('M-18,-74 C-12,-90 12,-90 18,-74Z', SHU, 2.6), front: P('M-24,-20 L0,-15 L24,-20 V-2 L0,3 L-24,-2Z', '#FFF8E4', 2.6) + Ln('M0,-15 V3 M-18,-13 L-6,-10 M6,-10 L18,-13', INK, 1.2, 0) + waves(30, -60, t),
  faces: [F(0, -54, 6, 'ten', { es: .7, mouth: 'open' })], kanji: [0, -29, 8] }));
N('占', 'una boca con una varita mágica encima', 90, t => ({ body: rrect(-34, -46, 68, 46, 12), front: bar(-3, -86, 6, 42, WOOD) + star(0, -88, .8) + `<g class="k2-float">${star(-34, -64, .4)}${star(36, -70, .4)}</g>`,
  faces: [F(0, -30, 10, 'hane', { mouth: 'open' })], kanji: [0, -8, 9] }));
N('至', 'una flecha clavada en un terrón', 90, t => ({ body: mound(48, 36), front: `<g transform="translate(0 -44) rotate(180)">${P('M0,-26 L10,-12 H4 V20 L10,30 H-10 L-4,20 V-12 H-10Z', T.metal.f, 2.6)}</g>` + Ln('M-22,-30 l-6,-8 M22,-30 l6,-8', t.d, 2.2, 2),
  faces: [F(-22, -14, 0, 'maru', { es: .7, mouth: false }), F(22, -14, 0, 'maru', { es: .7, mouth: false })], kanji: [0, -7, 9] }));
N('孝', 'un niño que lleva a un abuelo a caballito', 100, t => ({ body: `${circ(0, -34, 17)} M-18,-18 C-26,-10 -24,-2 -16,0 H16 C24,-2 26,-10 18,-18Z ${circ(8, -74, 14)} M-10,-62 C-18,-52 -16,-44 -8,-42 H24 C30,-46 28,-58 22,-64Z`,
  back: bar(30, -70, 4, 40, WOOD), mid: `<path d="M2,-66 C6,-58 12,-58 16,-66 C12,-52 6,-52 2,-66Z" fill="${W}"/>`, faces: [F(0, -34, 7, 'ten', { es: .75 }), F(8, -76, 5, 'tome', { es: .6, mouth: false, brow: true })], kanji: [0, -8, 8] }));
N('漢', 'un pergamino que flota por un río', 86, t => ({ body: `M-52,0 V-18 q13,-12 26,0 q13,12 26,0 q13,-12 26,0 q13,12 26,0 V0Z ${rrect(-26, -80, 52, 56, 4)}`,
  mid: P(rrect(-26, -80, 52, 56, 4), '#FFF8E4', 2.6) + P(circ(-26, -52, 5), WOOD, 2) + P(circ(26, -52, 5), WOOD, 2), faces: [F(0, -64, 8, 'ten', { es: .75 })], kanji: [0, -40, 12] }));
// ===== Grado 3 =====
N('店', 'un puesto con alero y cartel', 96, t => ({ body: `M-54,-56 L-40,-86 H40 L54,-56Z ${rrect(-40, -56, 80, 56, 3)}`, mid: [-39, -13, 13].map((x, i) => `<path d="M${x},-56 h26 v8 q-13,10 -26,0Z" fill="${i % 2 ? W : t.d}"/>`).join('') + bar(-34, -18, 68, 8, WOOD, 2),
  front: J(46, -80, P(rrect(-9, 0, 18, 26, 3), SHU, 2.4) + Ln('M-4,8 h8 M-4,16 h8', W, 1.4, 0), .3) + star(-48, -90, .5), faces: [F(0, -36, 10, 'ten', { es: .85, mouth: 'open' })], kanji: [0, -72, 11] }));
N('室', 'un cuarto con techo y piso de tierra', 92, t => ({ body: house(0, -8, 80, 50, 32) + ' ' + tab(0, 0, 100, 10), mid: `<rect x="-30" y="-50" width="60" height="38" rx="3" fill="${t.l}"/>` + Ln('M0,-50 V-12 M-30,-31 H30', t.d, 1.4, 0),
  front: P(rrect(-8, -22, 16, 12, 3), SHU, 2), faces: [F(0, -40, 11, 'tome', { es: .7, mouth: false })], kanji: [0, -74, 11] }));
N('屋', 'un local con toldo y mostrador', 94, t => ({ body: `M-56,-52 L-44,-82 H44 L56,-52Z ${rrect(-40, -52, 80, 52, 3)}`, mid: `<path d="M-52,-56 H52 V-50 H-52Z" fill="${t.d}"/>` + bar(-34, -16, 68, 8, WOOD, 2) + `<rect x="-14" y="-46" width="28" height="18" rx="2" fill="${W}"/>`,
  front: P('M-30,-22 l8,-8 l8,8Z', SHU, 2) + P(circ(26, -24, 6), GOLD, 2), faces: [F(0, -38, 6, 'ten', { es: .6, mouth: false })], kanji: [0, -68, 11] }));
N('教', 'un anciano con vara junto a un niño', 102, t => ({ body: `${circ(-18, -70, 17)} M-36,-52 C-48,-36 -48,-10 -42,0 H2 C8,-10 8,-36 -2,-52Z ${pers(34, 0, .9)}`, back: P(circ(-18, -90, 7), '#EDE6DA'),
  front: J(0, -44, Ln('M0,0 L26,-26', WOOD, 3, 2.4), 0, 'k2-swing2') + star(30, -74, .5), mid: `<path d="M-26,-60 C-22,-50 -14,-50 -10,-60 C-14,-42 -22,-42 -26,-60Z" fill="${W}"/>`,
  faces: [F(-18, -72, 6, 'tome', { es: .7, brow: true, mouth: false }), F(34, -34, 4, 'maru', { es: .55 })], kanji: [-20, -20, 12] }));
N('週', 'un cerco que rueda por un camino', 92, t => ({ body: `${circ(0, -52, 34)} M-56,-6 C-30,-20 30,-20 56,-6 V4 H-56Z`, mid: `<circle cx="0" cy="-52" r="22" fill="none" stroke="${W}" stroke-width="4"/>` + [0, 1, 2, 3, 4, 5, 6].map(i => `<circle cx="${(Math.cos(i * .9) * 22).toFixed(1)}" cy="${(-52 + Math.sin(i * .9) * 22).toFixed(1)}" r="3.4" fill="${i === 6 ? SHU : t.d}"/>`).join(''),
  front: Ln('M-52,-60 h-8 M-50,-46 h-10', t.d, 2.2, 2), faces: [F(0, -56, 8, 'ten', { es: .8 })], kanji: [0, -6, 8] }));
N('何', 'una figura con signo de pregunta en la mano', 100, t => ({ body: pers(-8, 0, 1.55), front: `<g class="k2-float" transform="translate(34 -74)">${P('M-10,-8 C-10,-22 12,-22 12,-8 C12,0 2,0 2,10 H-4 C-4,-2 4,-4 4,-8 C4,-12 -2,-12 -2,-8Z', SHU, 2.4)}${P(circ(-1, 18, 3.6), SHU, 2)}</g>` + hand(22, -30, -40, .55, t.d),
  faces: [F(-8, -58, 7, 'maru', { es: .75 })], kanji: [-8, -16, 14] }));
N('校', 'un árbol con niños que se cruzan debajo', 104, t => ({ body: `${circ(0, -76, 26)} ${circ(-24, -60, 19)} ${circ(24, -60, 19)}`, back: P('M-7,-44 C-7,-28 -9,-14 -18,0 H18 C9,-14 7,-28 7,-44Z', WOOD),
  front: P(pers(-30, 0, .75), T.water.f, 2.4) + P(pers(30, 0, .75), T.fire.f, 2.4) + P(rrect(-12, -40, 24, 12, 3), W, 2), faces: [F(0, -76, 10, 'tome')], kanji: [0, -52, 11] }));
N('話', 'una boca con ondas y la lengua afuera', 92, t => ({ body: `${rrect(-34, -44, 68, 44, 12)} ${tab(0, -52, 80, 9)} ${tab(0, -66, 54, 9)}`, front: J(0, -14, P('M-8,0 H8 V12 C8,22 -8,22 -8,12Z', PINK, 2.4), .2, 'k2-swing2') + waves(44, -62, t) + waves(-44, -62, t, -1),
  faces: [F(0, -32, 10, 'hane', { mouth: false })], kanji: [22, -12, 9] }));
N('買', 'una red de compras con una almeja dentro', 88, t => ({ body: 'M-34,-52 H34 L28,0 H-28Z', back: Ln('M-22,-52 C-22,-84 22,-84 22,-52', WOOD, 3.4, 2.6), mid: Ln('M-30,-38 H30 M-29,-24 H29 M-16,-52 L-12,0 M0,-52 V0 M16,-52 L12,0', t.l, 1.3, 0),
  front: shell(0, -50, .8, T.metal.l, T.metal.d) + P(circ(40, -20, 7), GOLD, 2), faces: [F(0, -32, 10, 'ten', { mouth: 'open' })], kanji: [0, -9, 9] }));
N('員', 'una almeja con gorra de empleado', 84, t => ({ body: 'M0,-4 C-34,-4 -46,-26 -34,-44 C-22,-58 22,-58 34,-44 C46,-26 34,-4 0,-4Z', back: P('M-22,-52 C-18,-70 18,-70 22,-52Z', SHU, 2.6) + P('M-22,-54 H34 L30,-48 H-22Z', SHU, 2.4),
  mid: Ln('M-14,-9 L-22,-40 M14,-9 L22,-40', t.d, 1.4, 0), front: feet([-12, 12], t, 7, 0), faces: [F(0, -32, 10, 'ten', { es: .8, mouth: 'open' })], kanji: [0, -12, 9] }));
N('親', 'un ojo con piernas subido a un árbol', 108, t => ({ body: `${circ(0, -48, 26)} ${circ(-24, -34, 18)} ${circ(24, -34, 18)} ${ell(8, -90, 18, 13)}`, back: P('M-7,-20 C-7,-10 -9,-4 -16,0 H16 C9,-4 7,-10 7,-20Z', WOOD),
  mid: P(circ(8, -90, 7), W, 1.4) + `<circle cx="8" cy="-90" r="4" fill="${INK}"/>` + Ln('M0,-78 L-4,-68 M16,-78 L20,-68', t.d, 4, 2.6), front: P(pers(-40, 0, .6), T.water.f, 2.2),
  faces: [F(0, -44, 10, 'tome')], kanji: [0, -28, 9] }));
N('朝', 'un sol que sube mientras la luna se va', 92, t => ({ body: `${circ(-14, -40, 30)}`, fill: GOLD, back: rays(-14, -40, [[-90, .55], [-60, .6], [-30, .65], [0, .7], [30, .65], [60, .6]], t) + moonD(36, -74, .9),
  front: P('M-56,-8 C-30,-16 30,-16 56,-8 V4 H-56Z', T.earth.f, 2.6) + boxBird(40, -30, .5, T.water), faces: [F(-14, -46, 10, 'maru', { mouth: 'open' })], kanji: [-14, -24, 10] }));
N('昼', 'un sol en lo más alto, medido con la mano', 104, t => ({ body: circ(0, -64, 30), fill: GOLD, back: rays(0, -64, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => [a, i % 2 ? .6 : .72]), t),
  front: P(tab(0, 0, 90, 10), T.earth.f, 2.6) + hand(40, -26, -20, .6, T.earth.f) + Ln('M-30,-10 V-20 M-10,-10 V-24 M10,-10 V-20', INK, 1.3, 0), faces: [F(0, -70, 11, 'ten', { mouth: 'open' })], kanji: [0, -46, 10] }));
N('春', 'tres brotes que se estiran al sol', 96, t => ({ body: `${pers(-34, 0, .95)} ${pers(0, 0, 1.15)} ${pers(34, 0, .95)}`, fill: '#F7B7C6', back: sunD(0, -84, 14) + rays(0, -84, [[-90, .4], [-45, .45], [0, .5], [45, .45], [90, .4]], t),
  front: flowerP(-48, -56, .5, PINK) + flowerP(50, -60, .5, W) + sprout(-34, -44, .22) + sprout(34, -44, .22), faces: [F(0, -43, 5, 'ten', { es: .65, expr: 'feliz' })], kanji: [0, -12, 10] }));
N('花', 'un brote que se abre en flor', 100, t => ({ body: `${[0, 72, 144, 216, 288].map(a => { const r = a * Math.PI / 180; return circ(+(Math.sin(r) * 22).toFixed(1), +(-62 - Math.cos(r) * 22).toFixed(1), 16); }).join(' ')} ${circ(0, -62, 16)}`, fill: '#F39AAE',
  back: Ln('M0,-40 C-2,-24 2,-12 0,0', T.wood.d, 5, 3) + J(0, -16, `<g transform="scale(.6)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .3), mid: P(circ(0, -62, 15), GOLD, 2),
  faces: [F(0, -65, 6, 'ten', { es: .7 })], kanji: [0, -86, 10] }));
N('薬', 'un frasquito con hojas y un tambor contento', 96, t => ({ body: `${rrect(-26, -62, 52, 62, 12)} ${tab(0, -62, 34, 14)}`, fill: '#EFF8F1', mid: `<rect x="-20" y="-40" width="40" height="24" rx="3" fill="${W}" stroke="${t.d}" stroke-width="1"/><path d="M-3,-36 H3 V-31 H8 V-25 H3 V-20 H-3 V-25 H-8 V-31 H-3Z" fill="${SHU}"/>`,
  back: J(0, -76, `<g transform="scale(.6)">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, .3), front: `<g class="k2-float">${P(rrect(32, -40, 16, 8, 4), SHU, 2)}${P(rrect(-50, -24, 16, 8, 4), W, 2)}</g>`, faces: [F(0, -52, 8, 'ten', { es: .7, mouth: false })], kanji: [0, -8, 8] }));
N('始', 'una figura que sube a una tarima', 102, t => ({ body: `M-12,-60 C-22,-54 -26,-38 -28,-18 L28,-18 C26,-38 22,-54 12,-60Z ${circ(0, -76, 16)} M-36,-18 H36 L44,0 H-44Z`, back: P(circ(0, -78, 18), '#3A2E3A') + P(circ(0, -96, 8), '#3A2E3A'),
  front: `<g class="k2-float">${star(-40, -70, .6)}${star(42, -64, .5)}</g>` + hand(26, -50, -20, .5, t.d), faces: [F(0, -75, 6, 'maru', { es: .7, mouth: 'open' })], kanji: [0, -34, 11] }));
N('絵', 'hilos de colores que forman un cuadro', 88, t => ({ body: rrect(-40, -76, 80, 74, 5), fill: WOODL, mid: `<rect x="-32" y="-68" width="64" height="44" rx="2" fill="#FFF8E4"/><circle cx="20" cy="-58" r="6" fill="${GOLD}"/><path d="M-32,-30 q10,-8 20,0 q10,8 20,0 q10,-8 24,0 V-24 H-32Z" fill="${T.wood.f}"/>`,
  front: feet([-22, 22], t, 8, 0) + J(40, -70, `<g transform="rotate(30)">${bar(-2, -30, 4, 26, WOOD, 2)}${P('M-4,-30 C-4,-38 0,-44 0,-44 C0,-44 4,-38 4,-30Z', SHU, 2)}</g>`, .2), faces: [F(-6, -46, 8, 'ten', { es: .75 })], kanji: [0, -12, 10] }));
N('動', 'un brazo que empuja un bulto pesado', 96, t => ({ body: `M-8,-80 C-14,-56 -12,-38 -6,-28 H46 C52,-38 54,-56 48,-80 C30,-86 10,-86 -8,-80Z ${tab(20, 0, 60, 26)}`, mid: Ln('M-8,-56 H50', SHU, 3, 0),
  front: J(-14, -30, `<g transform="scale(-1 1) rotate(-20)">${bicep(T.earth.f)}</g>`, 0, 'k2-swing2') + Ln('M-52,-14 h12 M-56,-4 h16', t.d, 2.2, 2) + wheel(4, -2, 8, t) + wheel(36, -2, 8, t), faces: [F(20, -14, 8, 'harai', { es: .75, brow: true })], kanji: [20, -66, 11] }));
N('暗', 'un sol apagado que solo se escucha', 90, t => ({ body: circ(0, -44, 36), fill: '#5A5670', back: rays(0, -44, [[0, .5], [60, .5], [120, .5], [180, .5], [240, .5], [300, .5]], { f: '#5A5670' }),
  front: waves(42, -50, { d: GLOW }) + waves(-42, -50, { d: GLOW }, -1) + `<g class="k2-float">${star(34, -84, .4)}</g>`, faces: [F(0, -50, 11, 'dormido', { fix: true, expr: 'dormido' })], kanji: [0, -22, 11] }));
N('都', 'un anciano frente a un banderín de ciudad', 102, t => ({ body: `${rrect(-46, -40, 26, 40, 3)} ${rrect(-18, -72, 34, 72, 3)} ${rrect(18, -52, 26, 52, 3)}`, mid: [[-40, -30], [-32, -30], [-40, -18], [-32, -18], [24, -42], [34, -42], [24, -28], [34, -28]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="8" fill="${GLOW}"/>`).join(''),
  front: bar(48, -96, 4, 96, WOOD) + J(52, -92, P('M0,0 H-22 L-16,8 L-22,16 H0Z', SHU, 2.4), .3), faces: [F(-1, -56, 7, 'tome', { es: .7 })], kanji: [-1, -18, 11] }));
N('完', 'una casita con todas sus piezas en orden', 96, t => ({ body: house(0, 0, 76, 54, 34), mid: `<rect x="-28" y="-46" width="24" height="18" rx="2" fill="${t.l}"/><rect x="4" y="-46" width="24" height="18" rx="2" fill="${t.l}"/><path d="M-8,0 v-20 h16 v20Z" fill="${t.d}"/>`,
  front: `<g transform="translate(40 -84)">${P(circ(0, 0, 13), T.wood.f, 2.6)}${Ln('M-6,0 l4,5 l8,-10', W, 2.6, 0)}</g>`, faces: [F(-16, -37, 0, 'ten', { es: .55, mouth: false }), F(16, -37, 0, 'ten', { es: .55, mouth: false })], kanji: [0, -66, 12] }));
N('病', 'una figura tapada en una camita contra la pared', 84, t => ({ body: `${rrect(-50, -30, 100, 22, 6)} ${circ(-28, -42, 15)} M-52,-64 H-44 V0 H-52Z M-46,-10 H50 V0 H-46Z`, fill: '#EFF3F7', mid: `<path d="M-10,-30 H50 V-12 H-10Z" fill="${T.water.l}"/>`,
  front: bar(-2, -60, 4, 22, '#9A9388', 1.6) + P(circ(0, -62, 5), SHU, 1.6) + `<g class="k2-float">${drop(12, -60, .4, T.water.l)}</g>`, faces: [F(-28, -44, 6, 'tome', { es: .65, expr: 'triste', fix: true })], kanji: [20, -20, 11] }));
// ===== Grado 4 =====
N('院', 'un edificio con escalones a su lado', 104, t => ({ body: `${rrect(-22, -68, 68, 68, 4)} M-28,-66 L12,-94 L52,-66Z M-56,0 V-14 H-44 V-28 H-32 V-42 H-22 V0Z`, mid: `<path d="M26,0 v-24 h14 v24Z" fill="${t.d}"/>`,
  front: `<g transform="translate(12 -78)">${P(circ(0, 0, 8), W, 2)}<path d="M-2,-5 H2 V-2 H5 V2 H2 V5 H-2 V2 H-5 V-2 H-2Z" fill="${SHU}"/></g>`, faces: [F(12, -50, 10, 'tome', { es: .85 })], kanji: [-4, -15, 11] }));
N('働', 'una figura que empuja un bulto pesado', 104, t => ({ body: `${pers(-26, 0, 1.5)} M4,-70 C0,-50 2,-36 8,-28 H50 C56,-36 58,-50 54,-70 C40,-76 18,-76 4,-70Z ${tab(29, 0, 50, 24)}`, mid: Ln('M4,-50 H54', SHU, 3, 0),
  front: J(-14, -40, P('M0,0 L20,-4 L20,6 L0,10Z', t.d, 2.6), 0, 'k2-swing2') + drop(-48, -60, .45, T.water.l) + wheel(16, -2, 7, t) + wheel(42, -2, 7, t), faces: [F(-26, -56, 7, 'harai', { es: .75, brow: true })], kanji: [-26, -16, 12] }));

// ---------- El kit en el juego ----------
const GOLDT = { f: '#F2C94C', d: '#B8862A', l: '#FBE7A1' };
const GF = [.84, .88, .92, .96, 1];
if (typeof document !== 'undefined' && !document.getElementById('k2grain')) {
  try {
    const cv = document.createElement('canvas'); cv.width = cv.height = 96; const x = cv.getContext('2d'); const im = x.createImageData(96, 96);
    for (let i = 0; i < im.data.length; i += 4) { const v = Math.random() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    x.putImageData(im, 0, 0);
    const d = document.createElement('div');
    d.innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><pattern id="k2grain" patternUnits="userSpaceOnUse" width="96" height="96"><image href="${cv.toDataURL()}" width="96" height="96"/></pattern></defs></svg>`;
    document.body.appendChild(d.firstChild);
  } catch (e) {}
}
let uid = 0;
export const hasArt = k => k in D;
export const artInfo = k => D[k] && { idea: D[k].idea, tipo: D[k].t, grado: D[k].g };
// mood < .3 → triste; si no, la expresión propia del diseño. gold → papel dorado con destellos.
export function artSVG(k, { mood, gold = false, expr } = {}) {
  const def = D[k]; if (!def) return null;
  const t0 = T[def.t], t = gold ? { ...t0, ...GOLDT } : t0, g = def.g, x = def.draw(t), id = 'k2' + (++uid), fill = gold ? GOLDT.f : (x.fill || t.f);
  const ex = expr || (mood != null && mood < .3 ? 'triste' : '');
  const s = Math.min(150 / def.h, 1.25) * GF[g - 1];
  const [kx, ky, ks] = x.kanji;
  let sheets = '';
  for (let i = g - 1; i >= 1; i--) sheets += `<path d="${x.body}" transform="translate(${(-i * 3.4).toFixed(1)} ${(-i * 2.6).toFixed(1)})" fill="${i % 2 ? t.l : fill}" stroke="${W}" stroke-width="5" stroke-linejoin="round" paint-order="stroke"/>`;
  let halo = '';
  if (g >= 5) { const R = Math.min(78, def.h * .46); let pe = '';
    for (let i = 0; i < 12; i++) pe += `<path d="M0,${-R} C6,${-R + 6} 6,${-R + 16} 0,${-R + 22} C-6,${-R + 16} -6,${-R + 6} 0,${-R}Z" transform="rotate(${i * 30})" fill="${i % 2 ? t.l : t.f}" stroke="${W}" stroke-width="2.4" paint-order="stroke"/>`;
    halo = `<g transform="translate(0 ${(-def.h * .5).toFixed(1)})"><g class="k2-halo">${pe}</g></g>`; }
  const shine = def.t === 'metal' || gold ? `<rect class="k2-shine" x="-6" y="-170" width="12" height="190" fill="${W}" opacity=".4"/>` : '';
  const faces = x.faces.map((f, i) => `<!--f-->${faceSVG(f, g, i === 0, 'B', ex, t)}<!--/f-->`).join('');
  const spark = gold ? `<g class="k2-float">${star(-60, -120, .8)}${star(62, -70, .6)}</g>` : '';
  const kt = [(kx * s + 84).toFixed(1), (ky * s + 158).toFixed(1), (ks * s).toFixed(1)].join(',');
  return `<svg viewBox="-84 -158 168 168" class="kj-svg kj2" data-kt="${kt}" aria-label="${k}">
    <defs><clipPath id="${id}c"><path d="${x.body}"/></clipPath></defs>
    <g transform="scale(${s.toFixed(3)})"><g class="k2-whole">${halo}<g class="k2-idle k2-idle-${def.t}">
      ${x.back || ''}${sheets}
      <path d="${x.body}" fill="${fill}" stroke="${W}" stroke-width="5.5" stroke-linejoin="round" paint-order="stroke"/>
      <g clip-path="url(#${id}c)">
        <!--k--><ellipse cx="${kx}" cy="${ky}" rx="${(ks * .95).toFixed(1)}" ry="${(ks * .8).toFixed(1)}" fill="${t.l}" opacity=".95"/><!--/k-->
        ${shine}
        <rect x="0" y="-195" width="120" height="205" fill="${INK}" opacity=".11"/>
        <path class="k2-ln" d="M0,-195 V10" stroke="${W}" stroke-width="1" opacity=".5" fill="none"/>
        <rect x="-120" y="-195" width="240" height="205" fill="url(#k2grain)" opacity=".09" style="mix-blend-mode:multiply"/>
      </g>
      ${x.mid || ''}
      <!--k--><text x="${kx}" y="${ky}" text-anchor="middle" dominant-baseline="central" font-family="'Yuji Syuku', serif" font-size="${ks}" fill="${INK}" transform="rotate(-4 ${kx} ${ky})">${k}</text><!--/k-->
      ${faces}
      ${x.front || ''}
    </g></g></g>${spark}
  </svg>`;
}
// Vista de espaldas (Arena): sin caras ni kanji
export const artBack = svg => svg.replace(/<!--f-->[\s\S]*?<!--\/f-->/g, '').replace(/<!--k-->[\s\S]*?<!--\/k-->/g, '').replace(/<text[\s\S]*?<\/text>/g, '').replace(/ data-kt="[^"]*"/, '');
