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
'人': { t: 'earth', g: 1, m: 'persona', r: '', idea: 'una persona de papel sobre sus dos piernas', h: 92, draw: t => ({
  body: 'M0,-90 C12,-90 19,-81 19,-71 C19,-64 15,-58 10,-55 C18,-52 21,-44 18,-36 L30,-4 C31,0 27,2 24,0 L2,-20 L-2,-20 L-24,0 C-27,2 -31,0 -30,-4 L-18,-36 C-21,-44 -18,-52 -10,-55 C-15,-58 -19,-64 -19,-71 C-19,-81 -12,-90 0,-90Z',
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








// ---------- KANJŪ nuevos (noviembre de 2026) ----------
// Mismas reglas que los 101 originales (docs/arte/biblia.html): un significado, una forma; cada compuesto hereda un rasgo
// visible de cada componente directo (máximo dos); grado 1 chibi sin brazos, grado 2 patitas o brazos cortos, grado 3
// postura propia, grado 4 accesorios, grado 5 forma adulta. Tipo, grado y receta salen de js/data.js.
const N = (k, idea, h, draw, o = {}) => { D[k] = { t: typeOf(k), g: kLevel(k), m: KANJI[k].m, r: (KANJI[k].recipes?.[0] || []).join('+'), idea, h, draw, ...o }; };
// El diseño de otro kanji, para heredar su cuerpo o sus piezas
const base = (k, t) => D[k].draw(t || T[D[k].t]);
// Escala y mueve un trazado
const tr = (d, sx, sy = sx, dx = 0, dy = 0) => d.replace(/([MLCQSTHVAZmlcqsthvaz])([^MLCQSTHVAZmlcqsthvaz]*)/g, (m, c, a) => {
  const n = (a.match(/-?\d*\.?\d+/g) || []).map(Number), up = c === c.toUpperCase(), C = c.toUpperCase(), o = [];
  const X = v => +(v * sx + (up ? dx : 0)).toFixed(1), Y = v => +(v * sy + (up ? dy : 0)).toFixed(1);
  if (C === 'Z') return c;
  if (C === 'H') return c + n.map(X).join(' ');
  if (C === 'V') return c + n.map(Y).join(' ');
  if (C === 'A') { for (let i = 0; i < n.length; i += 7) o.push(+(n[i] * Math.abs(sx)).toFixed(1), +(n[i + 1] * Math.abs(sy)).toFixed(1), n[i + 2], n[i + 3], sx * sy < 0 ? 1 - n[i + 4] : n[i + 4], X(n[i + 5]), Y(n[i + 6])); return c + o.join(' '); }
  for (let i = 0; i < n.length; i += 2) o.push(X(n[i]), Y(n[i + 1])); return c + o.join(' ');
});
// Otra criatura en chico, como pieza heredada (sin kanji; ojos de punto)
const mini = (k, x, y, s, o = {}) => { const d = D[k], t = o.t || T[d.t], b = d.draw(t), f = b.faces[0];
  const eyes = o.eyes === false || !f ? '' : f.sp ? `<circle cx="${f.x - f.sp}" cy="${f.y}" r="${(1.9 / s).toFixed(1)}" fill="${INK}"/><circle cx="${f.x + f.sp}" cy="${f.y}" r="${(1.9 / s).toFixed(1)}" fill="${INK}"/>` : `<circle cx="${f.x}" cy="${f.y}" r="${(5 / s).toFixed(1)}" fill="${W}"/><circle cx="${f.x}" cy="${f.y}" r="${(2.2 / s).toFixed(1)}" fill="${INK}"/>`;
  return `<g transform="translate(${x} ${y}) scale(${o.flip ? -s : s} ${s})">${o.back === false ? '' : b.back || ''}${P(b.body, o.fill || b.fill || t.f, 3 / s)}${b.mid || ''}${eyes}${o.front === false ? '' : b.front || ''}</g>`; };
// Patitas cortas, pegadas al cuerpo (van en `back`)
const stub = (xs, c, y = 0, h = 12, w = 11) => xs.map(x => P(`M${x - w / 2},${y - h} V${y - 4} Q${x - w / 2},${y} ${x},${y} Q${x + w / 2},${y} ${x + w / 2},${y - 4} V${y - h}Z`, c, 3)).join('');
// Brazo corto de papel con broche
const arm = (x, y, rot, c, len = 15, dl = 0, cls = 'k2-swing2') => J(x, y, `<g transform="rotate(${rot})">${P(rrect(-4.5, -1, 9, len, 4.5), c, 2.6)}</g>`, dl, cls);
// Tira de papel (brazo o pierna extendida de la familia de 大 y de Jū)
const strip = (x1, y1, x2, y2, c, w = 11) => { const a = Math.atan2(y2 - y1, x2 - x1), dx = Math.sin(a) * w / 2, dy = -Math.cos(a) * w / 2; return P(`M${(x1 + dx).toFixed(1)},${(y1 + dy).toFixed(1)} L${(x2 + dx).toFixed(1)},${(y2 + dy).toFixed(1)} L${(x2 - dx).toFixed(1)},${(y2 - dy).toFixed(1)} L${(x1 - dx).toFixed(1)},${(y1 - dy).toFixed(1)}Z`, c, 3); };
const note = (x, y, s = 1, c = INK) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="-3" cy="6" rx="4.4" ry="3.2" fill="${c}" stroke="${W}" stroke-width="2" paint-order="stroke" transform="rotate(-20 -3 6)"/><path d="M1,6 V-10 L9,-7 V-2 L1,-5" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/></g>`;
const sweat = (x, y, s = .5) => `<g class="k2-float">${drop(x, y, s, T.water.l)}</g>`;
const spd = (x, y, c, dir = -1) => Ln(`M${x},${y - 12} h${dir * 14} M${x + dir * 3},${y} h${dir * 18} M${x},${y + 12} h${dir * 12}`, c, 2.6, 2.4);
const tuft = (x, y, s = .5, dl = .4) => J(x, y, `<g transform="scale(${s})">${leafL(T.wood.d, T.wood.l)}${leafR(T.wood.f, T.wood.l)}</g>`, dl);
const arrowP = (x, y, rot, c, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P('M0,-16 L11,-2 L4.5,-2 L4.5,14 L-4.5,14 L-4.5,-2 L-11,-2Z', c, 2.6)}</g>`;
const steam = (x, y) => `<g class="k2-float">${Ln(`M${x - 7},${y} q-5,-7 0,-13 q5,-6 0,-11 M${x + 7},${y - 2} q-5,-7 0,-13 q5,-6 0,-11`, W, 2.2, 1.8)}</g>`;
const cloudB = (x, y, s = 1) => `${circ(x - 26 * s, y, 20 * s)} ${circ(x, y - 14 * s, 26 * s)} ${circ(x + 26 * s, y, 20 * s)} ${rrect(x - 46 * s, y - 4 * s, 92 * s, 26 * s, 13 * s)}`;
const houseB = (w, h, roof, x = 0) => `M${x - w / 2 - 10},${-h + 3} L${x},${-h - roof} L${x + w / 2 + 10},${-h + 3}Z ${rrect(x - w / 2, -h, w, h, 4)}`;
const pips = (pts, c, r = 4) => pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${W}" stroke-width="1.6" paint-order="stroke"/>`).join('');
const road = (y = 0, w = 62) => P(`M${-w},${y - 6} C${-w * .4},${y - 14} ${w * .3},${y + 2} ${w},${y - 8} L${w},${y + 2} C${w * .3},${y + 10} ${-w * .4},${y - 4} ${-w},${y + 4}Z`, T.earth.l, 2.6);
// Jū (獣): cuerpo de hoja doblada en cuatro, más ancho abajo que arriba. Todo lo que viene de 田 usa este cuerpo.
const JU = 'M-26,-98 C-10,-99 10,-99 26,-98 C38,-97 44,-90 45,-80 L49,-26 C50,-12 44,-6 32,-6 L-32,-6 C-44,-6 -50,-12 -49,-26 L-45,-80 C-44,-90 -38,-97 -26,-98Z';
const JUFOLD = `<path class="k2-ln" d="M-48,-52 C-16,-53 16,-51 49,-48" stroke="${W}" stroke-width="2.6" opacity=".85" fill="none"/>`;
const HORNP = 'M-9,6 C-3,-10 5,-24 15,-34 C17,-18 15,-4 9,10Z';
const horn = (x, y, dir, t, s = 1) => `<g transform="translate(${x} ${y}) scale(${dir * s} ${s})">${P(HORNP, t.f, 3)}<path d="M15,-34 C17,-18 15,-4 9,10 L5,8 C10,-4 13,-18 15,-34Z" fill="${t.d}"/></g>`;
// Patitas cortas estándar (pegadas al cuerpo: van detrás, el cuerpo tapa el arranque)
const legs = (xs, t, y = 0, h = 12) => stub(xs, t.d, y, h, 11);
// 人: dos piernas en ángulo, sin manos (bajan desde y0 hasta el piso)
const pLegs = (t, y0 = -14, x0 = 6, x1 = 14) => strip(-x0, y0, -x1, 0, t.d, 10) + strip(x0, y0, x1, 0, t.d, 10);
// 大: brazos y piernas extendidos en tiras de papel
const bigArms = (t, y, x, len = 26, up = 10, c = t.f) => strip(-x, y, -x - len, y - up, c, 11) + strip(x, y, x + len, y - up, c, 11);
// 口: la boca cuadrada, bien abierta
const mouthBox = (x, y, w = 30, h = 20) => `<path d="${rrect(x - w / 2, y - h / 2, w, h, 4)}" fill="${MOUTH}" stroke="${W}" stroke-width="2" paint-order="stroke"/><path d="M${x - w * .3},${y + h / 2} C${x - w * .3},${y + h * .08} ${x + w * .3},${y + h * .08} ${x + w * .3},${y + h / 2}Z" fill="${SHU}"/><rect x="${x - w * .27}" y="${y - h / 2}" width="${w * .2}" height="${h * .26}" rx="1" fill="${W}"/><rect x="${x + w * .07}" y="${y - h / 2}" width="${w * .2}" height="${h * .26}" rx="1" fill="${W}"/>`;
// 宀: techo; 亠: tapita con perilla; 广: alero de un lado
const roof = (x, y, w, c = T.fire.d) => P(`M${x - w / 2},${y} L${x},${y - w * .34} L${x + w / 2},${y} Q${x + w / 2 - 4},${y + 6} ${x + w / 2 - 10},${y + 4} L${x},${y - w * .2} L${x - w / 2 + 10},${y + 4} Q${x - w / 2 + 4},${y + 6} ${x - w / 2},${y}Z`, c, 3);
const lid = (x, y, w, c) => P(rrect(x - w / 2, y - 7, w, 7, 3.5), c, 2.6) + P(circ(x, y - 11, 4.5), c, 2.4);
const eave = (x, y, w, c = WOOD) => P(`M${x - 4},${y - 10} L${x + w},${y} L${x + w - 2},${y + 6} L${x - 4},${y - 3}Z`, c, 2.6) + P(rrect(x - 8, y - 12, 8, 70, 3), c, 2.4);
// 日: solcito; 月 y 夕: medialuna
const sunP = (x, y, r, t = T.fire) => `<g transform="translate(${x} ${y})">${rays(0, 0, [0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => [a, (i % 2 ? .4 : .48) * r / 14]), t)}${P(circ(0, 0, r), t.f, 2.6)}</g>`;
const moonP = (x, y, s = 1, c = T.water.f) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M5,-16 A16,16 0 1,0 5,16 A23,23 0 0,1 5,-16Z', c, 2.6)}</g>`;
// 火: llamita; 木: copa; 艸: dos brotes; 水: gota
const flameP = (x, y, s = 1, t = T.fire) => `<g transform="translate(${x} ${y}) scale(${s})">${flame(t.f, t.l)}</g>`;
const canopy = (x, y, s, c) => P(`${circ(x, y - 12 * s, 16 * s)} ${circ(x - 15 * s, y - 2 * s, 12 * s)} ${circ(x + 15 * s, y - 2 * s, 12 * s)} ${ell(x, y + 2 * s, 21 * s, 8 * s)}`, c, 2.6);
// 女: moño con horquilla
const bun = (x, y, s = 1, pinOn = true) => P(circ(x, y, 10 * s), '#3A2E3A', 2.6) + (pinOn ? Ln(`M${x + 6 * s},${y - 5 * s} L${x + 18 * s},${y - 13 * s}`, GOLD, 2.2, 2) + P(circ(x + 19 * s, y - 14 * s, 2.8 * s), SHU, 1.4) : '');
// 耂: barba blanca de anciano
const beard = (x, y, s = 1) => P(`M${x - 16 * s},${y} C${x - 14 * s},${y + 16 * s} ${x - 6 * s},${y + 24 * s} ${x},${y + 28 * s} C${x + 6 * s},${y + 24 * s} ${x + 14 * s},${y + 16 * s} ${x + 16 * s},${y} C${x + 8 * s},${y + 6 * s} ${x - 8 * s},${y + 6 * s} ${x - 16 * s},${y}Z`, W, 2.4);
// 辶: el camino que serpentea debajo
const path = (y = 0, w = 64) => road(y, w);
// 王: corona; 一: tablón
const crown = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M-20,0 L-22,-20 L-11,-11 L0,-24 L11,-11 L22,-20 L20,0Z', GOLD, 2.6)}${P(circ(0, -6, 3.4), SHU, 1.6)}</g>`;
const plank = (x, y, w, t) => P(rrect(x - w / 2, y - 9, w, 12, 6), t.f, 2.8) + `<path class="k2-ln" d="M${x - w / 2 + 8},${y - 3} h${w * .3}" stroke="${t.d}" stroke-width="1.6" fill="none"/>`;
// Cuerpo de Jū para todo lo que viene de 田 (s = escala, dy = desplazamiento vertical)
const juB = (s = 1, dy = 0, dx = 0) => tr(JU, s, s, dx, dy);
const juF = (s = 1, dy = 0, dx = 0) => `<path class="k2-ln" d="M${dx - 48 * s},${dy - 52 * s} C${dx - 16 * s},${dy - 53 * s} ${dx + 16 * s},${dy - 51 * s} ${dx + 49 * s},${dy - 48 * s}" stroke="${W}" stroke-width="2.6" opacity=".85" fill="none"/>`;
// Piezas chicas reutilizables
const onigiri = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${P('M0,-14 C6,-14 14,2 12,8 C10,12 -10,12 -12,8 C-14,2 -6,-14 0,-14Z', W, 2.4)}<path d="M-8,2 H8 V11 H-8Z" fill="#2E3A2E"/></g>`;
const hammer = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P(rrect(-2.5, -26, 5, 28, 2.5), WOOD, 2)}${P(rrect(-10, -34, 20, 11, 3), T.metal.d, 2.2)}</g>`;
const brush = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${P(rrect(-3, -30, 6, 26, 3), WOOD, 2)}${P('M-4,-6 C-6,2 -2,10 0,14 C2,10 6,2 4,-6Z', INK, 2)}</g>`;
const cane = (x, y, h = 40) => Ln(`M${x},${y} V${y - h} C${x},${y - h - 8} ${x + 10},${y - h - 8} ${x + 10},${y - h}`, WOOD, 3.4, 2.4);
const snake = (x, y, s = 1, c = T.wood.f) => `<g transform="translate(${x} ${y}) scale(${s})">${Ln('M-18,6 C-10,-2 -2,10 6,2 C10,-2 12,-8 10,-14', c, 6, 2.6)}${P(ell(10, -16, 6, 5), c, 2.2)}<circle cx="12" cy="-17" r="1.3" fill="${INK}"/><path d="M15,-15 l4,1 l-3,2" stroke="${SHU}" stroke-width="1.2" fill="none"/></g>`;
const wand = (x, y, rot = 0) => `<g transform="translate(${x} ${y}) rotate(${rot})">${Ln('M0,0 V-30', WOOD, 3, 2)}${Ln('M0,-20 L9,-24', WOOD, 2.4, 1.8)}${star(0, -34, .45)}</g>`;
const streamers = (x, y) => Ln(`M${x},${y} V${y - 34}`, WOOD, 2.6, 2) + `<g transform="translate(${x} ${y - 34})"><g class="k2-swing">${P('M0,0 C8,4 14,2 20,6 L18,10 C12,8 6,10 0,8Z', SHU, 2)}${P('M0,9 C8,12 14,10 20,14 L18,18 C12,16 6,18 0,16Z', GOLD, 2)}</g></g>`;
const signBoard = (x, y, w, h, c) => Ln(`M${x},${y} V${y - h - 18}`, WOOD, 3, 2.4) + P(rrect(x - w / 2, y - h - 30, w, 16, 3), c, 2.4);


// ===== Grado 1 · raíces: chibi, cabeza y cuerpo son lo mismo, sin brazos, 1–2 piezas =====
// Números y dinero
N('五', 'un dado de papel con sus cinco puntos', 96, t => ({ body: rrect(-34, -76, 68, 68, 14),
  back: legs([-14, 14], t),
  mid: pips([[-22, -64], [22, -64], [-22, -20], [22, -20]], t.d),
  front: J(0, -76, P(circ(0, -8, 7), t.d, 2.6), .3),
  faces: [F(0, -48, 13, 'ten')], kanji: [0, -26, 14] }));
N('七', 'una mariquita de siete puntos', 92, t => ({ body: 'M-42,-14 C-46,-48 -24,-72 0,-72 C24,-72 46,-48 42,-14 Q40,-6 32,-6 H-32 Q-40,-6 -42,-14Z',
  back: P(ell(0, -72, 17, 10), t.d, 2.6) + Ln('M-6,-80 C-10,-90 -16,-94 -22,-94 M6,-80 C10,-90 16,-94 22,-94', t.d, 2.4, 2) + legs([-18, 18], t),
  mid: pips([[-30, -48], [-28, -24], [-14, -62], [30, -48], [28, -24], [14, -62], [0, -68]], t.d, 4.4),
  faces: [F(0, -44, 13, 'ten')], kanji: [0, -22, 14] }));
N('八', 'un abanico que se abre hacia los dos lados', 84, t => ({ body: 'M0,-10 L-56,-38 A62,62 0 0,1 56,-38Z',
  back: legs([-7, 7], t, 0, 14),
  mid: `<path class="k2-ln" d="M0,-10 L-38,-58 M0,-10 L-16,-66 M0,-10 L16,-66 M0,-10 L38,-58" stroke="${t.d}" stroke-width="1.6" opacity=".45" fill="none"/><path class="k2-ln" d="M-50,-36 A52,52 0 0,1 50,-36" stroke="${t.l}" stroke-width="3" fill="none"/>` + P(circ(0, -10, 4), GOLD, 1.8),
  faces: [F(0, -52, 13, 'hane')], kanji: [0, -32, 13] }));
N('九', 'un zorrito con su abanico de colas', 98, t => ({ body: `${circ(0, -40, 32)} M-28,-54 L-30,-86 L-8,-70Z M28,-54 L30,-86 L8,-70Z`,
  back: [-60, -30, 0, 30, 60].map((a, i) => `<g transform="translate(0 -34) rotate(${a})">${P('M0,-24 C-11,-36 -11,-54 0,-66 C11,-54 11,-36 0,-24Z', i % 2 ? t.d : t.f, 2.6)}<path d="M0,-52 C-5,-58 -5,-62 0,-66 C5,-62 5,-58 0,-52Z" fill="${W}"/></g>`).join('') + legs([-14, 14], t),
  mid: `<path d="M-24,-60 L-26,-78 L-14,-68Z M24,-60 L26,-78 L14,-68Z" fill="${t.l}"/><path d="${ell(0, -30, 17, 12)}" fill="${W}"/><path d="${ell(0, -38, 3.4, 2.4)}" fill="${INK}"/>`,
  faces: [F(0, -50, 13, 'tome', { mouth: false })], kanji: [0, -24, 12] }));
N('万', 'un fajo de billetes atado con su faja', 84, t => ({ body: rrect(-44, -62, 88, 54, 8),
  back: legs([-26, 26], t),
  mid: `<path class="k2-ln" d="M-44,-14 H44 M-44,-20 H44" stroke="${t.d}" stroke-width="1.4" opacity=".5" fill="none"/><path d="M18,-62 H30 V-8 H18Z" fill="${SHU}"/>`,
  front: `<g class="k2-float"><g transform="translate(-6 -76) rotate(-8)">${P(rrect(-20, -8, 40, 16, 3), t.l, 2.4)}</g></g>` + P(circ(24, -36, 5), GOLD, 1.8),
  faces: [F(-10, -40, 13, 'ten')], kanji: [-10, -20, 13] }));
N('円', 'una moneda redonda con su cordón rojo', 96, t => ({ body: circ(0, -46, 38),
  back: Ln('M-6,-82 C-14,-98 -2,-106 6,-98 C12,-92 8,-86 4,-82', SHU, 3, 2.4) + legs([-14, 14], t, 0, 14),
  mid: `<path class="k2-ln" d="${circ(0, -46, 31)}" stroke="${t.d}" stroke-width="2.2" fill="none" opacity=".6"/>` + P(circ(0, -74, 5), t.d, 2),
  faces: [F(0, -48, 14, 'maru')], kanji: [0, -26, 15] }));
N('金', 'un koban, la moneda de oro ovalada', 104, t => ({ body: ell(0, -50, 32, 44), fill: GOLD,
  back: legs([-14, 14], T.earth, 0, 14),
  mid: `<path class="k2-ln" d="M-30,-70 H30 M-32,-58 H32 M-32,-46 H32 M-30,-34 H30" stroke="${GOLDT.d}" stroke-width="1.6" opacity=".35" fill="none"/>`,
  front: `<g class="k2-float">${star(36, -92, .7)}</g>`,
  faces: [F(0, -60, 13, 'hane')], kanji: [0, -32, 16] }));

// Tiempo
N('年', 'un kagami mochi con su mandarina: el año nuevo', 104, t => ({ body: `${ell(0, -30, 44, 22)} ${ell(0, -62, 32, 17)}`, fill: t.l,
  back: P(rrect(-50, -12, 100, 12, 3), WOODL, 2.6) + P('M-20,-14 L20,-14 L28,-4 L-28,-4Z', W, 2),
  front: J(0, -80, P(circ(0, -9, 11), GOLD, 2.6) + `<g transform="translate(4 -18) scale(.32)">${leafR(T.wood.f, T.wood.l)}</g>`, .3),
  faces: [F(0, -64, 11, 'ten')], kanji: [0, -30, 15] }));
N('午', 'el mazo de golpear mochi: al mediodía, ¡a comer!', 104, t => ({ body: rrect(-44, -82, 88, 52, 22),
  back: P(rrect(-6, -36, 12, 36, 5), WOOD, 2.6),
  mid: `<path d="M-34,-80 V-32 M34,-80 V-32" stroke="${t.d}" stroke-width="6" opacity=".55"/>`,
  faces: [F(0, -62, 13, 'harai')], kanji: [0, -42, 14] }));
N('夕', 'una medialuna medio dormida en la tarde', 90, t => ({ body: 'M10,-82 A40,40 0 1,0 10,-4 A56,56 0 0,1 10,-82Z',
  back: P(`${circ(30, -70, 12)} ${circ(44, -64, 10)} ${ell(36, -60, 20, 7)}`, T.fire.l, 2.4) + legs([-18, 2], t),
  faces: [F(-20, -46, 10, 'tome', { expr: 'dormido', fix: true })], kanji: [-20, -24, 14] }));
N('冬', 'un muñeco de nieve con su bufanda', 104, t => ({ body: `${circ(0, -28, 28)} ${circ(0, -72, 20)}`, fill: t.l,
  back: P('M-14,-86 C-14,-104 14,-104 14,-86Z', t.d, 2.6) + P(circ(0, -104, 5), W, 2),
  mid: P('M-19,-56 C-6,-50 6,-50 19,-56 L19,-48 C6,-42 -6,-42 -19,-48Z M10,-50 L14,-30 L22,-32 L18,-50Z', SHU, 2.2),
  faces: [F(0, -74, 9, 'ten')], kanji: [0, -24, 16] }));

// Personas y familia
N('先', 'el primero de la fila: siempre va adelante con su banderín', 104, t => ({ body: 'M-36,-32 C-36,-60 -14,-78 10,-76 C28,-74 42,-60 52,-42 C42,-38 38,-28 36,-22 C30,-10 18,-6 0,-6 C-24,-6 -36,-16 -36,-32Z',
  back: legs([-16, 14], t) + Ln('M-22,-72 V-104', WOOD, 3, 2.4),
  front: `<g transform="translate(-22 -104)"><g class="k2-swing" style="animation-delay:-.3s">${P('M0,0 L24,6 L0,14Z', SHU, 2.4)}</g></g>`,
  faces: [F(4, -48, 12, 'harai')], kanji: [0, -24, 14] }));
N('父', 'un papá de bigote con su gorra', 92, t => ({ body: 'M-38,-14 C-42,-44 -32,-74 0,-74 C32,-74 42,-44 38,-14 Q36,-6 28,-6 H-28 Q-36,-6 -38,-14Z',
  back: legs([-16, 16], t),
  mid: P('M-22,-34 C-14,-42 -4,-40 0,-34 C4,-40 14,-42 22,-34 C16,-28 6,-28 0,-32 C-6,-28 -16,-28 -22,-34Z', '#3A2E3A', 2),
  front: P('M-30,-66 C-28,-86 28,-86 30,-66 L42,-64 C42,-60 38,-58 30,-60 L-30,-60Z', t.d, 2.8),
  faces: [F(0, -48, 13, 'tome', { mouth: false })], kanji: [0, -18, 13] }));
N('母', 'una mamá con su delantal y su moño', 98, t => ({ body: 'M0,-80 C26,-80 40,-58 40,-34 C40,-14 30,-6 16,-6 H-16 C-30,-6 -40,-14 -40,-34 C-40,-58 -26,-80 0,-80Z',
  back: P(circ(0, -84, 12), '#3A2E3A', 2.6) + legs([-14, 14], t),
  mid: `<path d="M-28,-36 H28 L30,-8 H-30Z" fill="${W}" opacity=".92"/><path class="k2-ln" d="M-28,-36 C-20,-32 20,-32 28,-36" stroke="${SHU}" stroke-width="2.4" fill="none"/>`,
  faces: [F(0, -54, 13, 'ten')], kanji: [0, -20, 14] }));
N('友', 'dos amigos pegaditos con una bufanda compartida', 88, t => ({ body: `${circ(-12, -40, 32)} ${circ(30, -26, 20)}`,
  back: legs([-26, -2], t) + legs([24, 36], t, 0, 10),
  mid: P('M-34,-66 C-16,-58 14,-56 44,-42 L42,-34 C14,-48 -16,-50 -36,-58Z', SHU, 2.2),
  faces: [F(-14, -44, 12, 'ten'), F(31, -26, 9, 'maru', { fix: true, expr: 'feliz' })], kanji: [-14, -22, 13] }));
N('弟', 'un trompo con su cordel: el hermanito que no para', 98, t => ({ body: 'M-42,-58 C-42,-74 42,-74 42,-58 L8,-8 Q0,0 -8,-8Z',
  back: P(rrect(-6, -84, 12, 14, 4), WOOD, 2.4),
  mid: `<path class="k2-ln" d="M-38,-50 L38,-50 M-30,-40 L30,-40" stroke="${t.d}" stroke-width="2.4" opacity=".6" fill="none"/>`,
  front: J(34, -48, Ln('M0,0 C12,4 16,14 10,22 C6,28 12,34 18,32', SHU, 3), 0),
  faces: [F(0, -58, 12, 'hane')], kanji: [0, -30, 11] }));
N('私', 'un granito con su gafete: ¡este soy yo!', 100, t => ({ body: 'M0,-88 C22,-88 32,-60 32,-40 C32,-18 18,-6 0,-6 C-18,-6 -32,-18 -32,-40 C-32,-60 -22,-88 0,-88Z',
  back: legs([-12, 12], t),
  mid: P('M0,-56 C3,-52 4,-48 0,-46 C-3,-48 -2,-52 0,-56Z', t.d, 1.4),
  front: J(22, -40, P(rrect(-8, -2, 16, 12, 2), W, 2) + `<circle cx="0" cy="4" r="2.4" fill="${SHU}"/>`, .4),
  faces: [F(0, -62, 11, 'ten')], kanji: [0, -26, 14] }));
N('王', 'un rey con corona y capa', 96, t => ({ body: 'M-36,-14 C-40,-40 -34,-70 0,-70 C34,-70 40,-40 36,-14 Q34,-6 26,-6 H-26 Q-34,-6 -36,-14Z',
  back: P('M-34,-46 C-48,-30 -50,-12 -44,-2 H44 C50,-12 48,-30 34,-46Z', SHU, 2.6) + legs([-14, 14], t),
  front: crown(0, -66, 1.05),
  faces: [F(0, -46, 13, 'tome', { brow: true })], kanji: [0, -22, 14] }));
N('士', 'un samurái con su casco de cuernos dorados', 98, t => ({ body: circ(0, -38, 32),
  back: legs([-14, 14], t, 0, 14),
  front: P('M-36,-48 C-36,-82 36,-82 36,-48 L44,-42 C30,-46 -30,-46 -44,-42Z', t.d, 3) + P('M-6,-64 C-18,-74 -24,-88 -22,-98 C-14,-88 -6,-80 0,-70 C6,-80 14,-88 22,-98 C24,-88 18,-74 6,-64Z', GOLD, 2.4),
  faces: [F(0, -30, 13, 'tome', { brow: true })], kanji: [0, -12, 11] }));

// Posición y orientación
N('上', 'un globo que sube y sube', 110, t => ({ body: 'M0,-108 C24,-108 38,-88 38,-66 C38,-44 20,-30 6,-26 L8,-20 H-8 L-6,-26 C-20,-30 -38,-44 -38,-66 C-38,-88 -24,-108 0,-108Z',
  back: Ln('M0,-20 C-6,-14 6,-8 0,-2', t.d, 2, 1.6),
  mid: `<path d="M-22,-86 C-18,-96 -8,-100 0,-100" stroke="${W}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>`,
  faces: [F(0, -70, 14, 'maru')], kanji: [0, -48, 15] }));
N('下', 'un yoyó que baja por su hilo', 112, t => ({ body: circ(0, -38, 32),
  back: Ln('M0,-70 V-112', t.d, 2.4, 2),
  mid: `<path class="k2-ln" d="${circ(0, -38, 24)}" stroke="${t.d}" stroke-width="2" fill="none" opacity=".5"/>`,
  front: P(rrect(-8, -116, 16, 10, 5), SHU, 2.4),
  faces: [F(0, -44, 13, 'ten')], kanji: [0, -22, 13] }));
N('西', 'un sol de tarde que se hunde en el mar', 80, t => ({ body: 'M-46,-12 C-46,-40 -26,-64 0,-64 C26,-64 46,-40 46,-12Z', fill: GOLD,
  back: rays(0, -14, [-70, -45, -20, 20, 45, 70].map(a => [a, .9]), { f: GOLD }),
  front: P('M-56,-12 C-44,-20 -32,-6 -18,-12 C-4,-18 8,-6 22,-12 C36,-18 46,-6 56,-12 L56,0 H-56Z', t.f, 2.6),
  faces: [F(0, -46, 13, 'tome', { expr: 'dormido', fix: true })], kanji: [0, -28, 13] }));
N('南', 'una piña del sur con su corona de hojas', 108, t => ({ body: ell(0, -40, 32, 36), fill: GOLD,
  back: [-40, -16, 0, 16, 40].map((a, i) => `<g transform="translate(0 -72) rotate(${a})">${P('M0,6 C-7,-6 -6,-22 0,-34 C6,-22 7,-6 0,6Z', i % 2 ? T.wood.d : T.wood.f, 2.4)}</g>`).join('') + legs([-14, 14], t),
  mid: `<path class="k2-ln" d="M-26,-58 L18,-10 M-30,-34 L0,-6 M-8,-74 L30,-34 M26,-58 L-18,-10 M30,-34 L0,-6 M8,-74 L-30,-34" stroke="${GOLDT.d}" stroke-width="1.6" opacity=".45" fill="none"/>`,
  faces: [F(0, -48, 13, 'harai')], kanji: [0, -24, 14] }));
N('北', 'un pingüino del norte', 96, t => ({ body: 'M0,-92 C22,-92 34,-68 36,-42 C38,-16 26,-6 0,-6 C-26,-6 -38,-16 -36,-42 C-34,-68 -22,-92 0,-92Z', fill: t.d,
  back: stub([-12, 12], GOLD, 0, 12, 13),
  mid: `<path d="${ell(0, -32, 24, 26)}" fill="${W}"/>` + P('M-6,-58 L6,-58 L0,-50Z', GOLD, 1.6),
  faces: [F(0, -66, 11, 'ten', { mouth: false })], kanji: [0, -26, 14] }));
N('市', 'un puesto del mercado con su toldo a rayas', 98, t => ({ body: rrect(-36, -64, 72, 58, 6),
  back: legs([-20, 20], t),
  front: P('M-46,-62 L-40,-86 H40 L46,-62 Q40,-56 34,-62 Q28,-56 22,-62 Q16,-56 10,-62 Q4,-56 -2,-62 Q-8,-56 -14,-62 Q-20,-56 -26,-62 Q-32,-56 -38,-62 Q-42,-58 -46,-62Z', SHU, 2.6) + `<path d="M-26,-84 L-28,-64 M-6,-84 L-6,-62 M14,-84 L16,-62 M32,-84 L36,-64" stroke="${W}" stroke-width="5" opacity=".85"/>`,
  faces: [F(0, -42, 13, 'ten')], kanji: [0, -20, 13] }));
N('戸', 'una puerta de madera con su perilla', 102, t => ({ body: rrect(-28, -98, 56, 92, 8),
  back: legs([-14, 14], t),
  mid: `<path d="${rrect(-20, -90, 40, 30, 4)}" fill="${t.d}" opacity=".3"/><path d="${rrect(-20, -54, 40, 40, 4)}" fill="${t.d}" opacity=".18"/>` + P(circ(18, -50, 4), GOLD, 1.8),
  faces: [F(0, -74, 11, 'tome')], kanji: [0, -30, 15] }));
N('方', 'una brújula que siempre sabe la dirección', 100, t => ({ body: circ(0, -44, 36),
  back: legs([-14, 14], t),
  mid: `<path class="k2-ln" d="${circ(0, -44, 30)}" stroke="${t.d}" stroke-width="2" fill="none" opacity=".5"/><path d="M0,-80 V-72 M36,-44 H28 M0,-8 V-16 M-36,-44 H-28" stroke="${t.d}" stroke-width="3"/>`,
  front: J(0, -84, `<g class="k2-swing">${P('M0,-22 L7,0 L0,4 L-7,0Z', SHU, 2.2)}</g>`, 0, ''),
  faces: [F(0, -46, 14, 'maru')], kanji: [0, -24, 15] }));

// La persona grande y la pequeña
N('大', 'una persona grande con los brazos y las piernas extendidos', 104, t => ({ body: circ(0, -56, 34),
  back: bigArms(t, -58, 28, 30, 12) + strip(-14, -28, -26, 0, t.f, 11) + strip(14, -28, 26, 0, t.f, 11),
  front: P(circ(-60, -71, 6.5), t.f, 2.4) + P(circ(60, -71, 6.5), t.f, 2.4),
  faces: [F(0, -64, 14, 'ten', { expr: 'feliz', fix: true })], kanji: [0, -38, 16] }));
N('小', 'tan chiquito que se esconde detrás de dos piedritas', 100, t => ({ body: circ(0, -26, 22),
  back: legs([-8, 8], t, 0, 8),
  front: P(ell(-34, -8, 9, 7), t.l, 2.4) + P(ell(34, -8, 9, 7), t.l, 2.4),
  faces: [F(0, -30, 10, 'maru')], kanji: [0, -13, 11] }));

// Naturaleza
N('山', 'una montaña de tres picos con nieve en la cima', 92, t => ({ body: 'M-50,-8 L-28,-56 L-14,-42 L0,-82 L14,-42 L28,-56 L50,-8Z',
  back: legs([-24, 24], t),
  mid: `<path d="M-9,-56 L0,-80 L9,-56 L4,-60 L0,-54 L-4,-60Z" fill="${W}"/>`,
  faces: [F(0, -34, 13, 'tome')], kanji: [0, -16, 13] }));
N('川', 'un río que corre con tres corrientes y una hoja de paseo', 62, t => ({ body: 'M-56,-20 C-52,-40 -32,-46 -16,-38 C0,-30 12,-50 34,-50 C50,-50 60,-36 56,-22 C52,-8 32,-6 12,-8 C-8,-10 -24,-2 -40,-4 C-52,-6 -58,-12 -56,-20Z',
  mid: `<path class="k2-ln" d="M-46,-24 C-30,-30 -16,-20 0,-26 M18,-38 C30,-42 42,-36 50,-30 M-10,-12 C6,-16 22,-12 40,-16" stroke="${W}" stroke-width="2" fill="none" opacity=".7"/>`,
  front: J(-34, -38, `<g transform="rotate(-10) scale(.5)">${leafR(T.wood.f, T.wood.l)}</g>`, 0),
  faces: [F(6, -32, 12, 'ten')], kanji: [34, -24, 11] }));
N('色', 'una paleta de pintor con sus manchas de colores', 90, t => ({ body: 'M-6,-82 C28,-84 50,-64 48,-42 C46,-24 30,-20 22,-26 C14,-32 6,-24 10,-16 C14,-8 4,-4 -10,-6 C-36,-10 -50,-32 -46,-54 C-42,-72 -26,-82 -6,-82Z',
  back: legs([-24, -4], t),
  mid: pips([[-30, -64]], T.fire.f, 6) + pips([[-12, -72]], GOLD, 6) + pips([[8, -72]], T.wood.f, 6) + pips([[28, -62]], T.water.f, 6),
  faces: [F(-8, -46, 12, 'hane')], kanji: [-10, -24, 13] }));
N('長', 'una oruga larga, larguísima', 76, t => ({ body: `${circ(-40, -18, 14)} ${circ(-18, -22, 17)} ${circ(6, -26, 19)} ${circ(32, -40, 26)}`,
  back: Ln('M24,-62 C20,-74 14,-78 10,-80 M40,-62 C44,-74 50,-78 54,-80', t.d, 2.4, 2) + legs([-40, -18, 6, 26], t, 0, 10),
  faces: [F(32, -46, 11, 'ten')], kanji: [32, -26, 12] }));
N('気', 'un espíritu de aire que flota con su remolino', 104, t => ({ body: 'M0,-96 C12,-84 32,-82 36,-60 C40,-36 28,-10 4,-10 C-4,-10 -8,-4 -4,0 C-16,0 -34,-14 -36,-40 C-38,-64 -18,-82 0,-96Z',
  front: Ln('M2,-98 C10,-110 26,-108 24,-96 C22,-88 12,-90 14,-96', t.d, 3, 2.4) + `<g class="k2-float">${P(circ(-48, -66, 7), t.l, 2.2)}${P(circ(48, -40, 5), t.l, 2)}</g>`,
  faces: [F(0, -54, 13, 'maru')], kanji: [0, -32, 15] }));
N('入', 'una carpa con la puerta abierta: pasa, entra', 98, t => ({ body: 'M-48,-6 L-4,-88 Q0,-94 4,-88 L48,-6Z',
  back: legs([-26, 26], t),
  mid: `<path d="M20,-6 L32,-28 L40,-6Z" fill="${t.d}" opacity=".7"/>`,
  front: Ln('M0,-90 V-106', WOOD, 2.6, 2) + `<g transform="translate(0 -106)"><g class="k2-swing">${P('M0,0 L16,5 L0,10Z', SHU, 2.2)}</g></g>`,
  faces: [F(0, -40, 12, 'ten')], kanji: [0, -20, 13] }));

// Comida y cosas
N('用', 'un balde de madera, siempre listo para usar', 96, t => ({ body: 'M-36,-68 H36 L30,-10 Q30,-6 26,-6 H-26 Q-30,-6 -30,-10Z',
  back: Ln('M-34,-68 C-34,-96 34,-96 34,-68', t.d, 4, 2.4) + legs([-14, 14], t),
  mid: `<path d="M-35,-58 H35 M-31,-18 H31" stroke="${t.d}" stroke-width="5" opacity=".6"/>`,
  faces: [F(0, -44, 13, 'ten')], kanji: [0, -27, 12] }));
N('事', 'un cartel colgante con su sello rojo: el asunto del día', 104, t => ({ body: rrect(-28, -94, 56, 84, 4), fill: t.l,
  back: P(rrect(-36, -100, 72, 8, 4), WOOD, 2.4) + Ln('M-18,-100 L0,-112 L18,-100', t.d, 2, 1.6) + legs([-12, 12], t),
  front: P(rrect(-36, -14, 72, 8, 4), WOOD, 2.4) + `<path d="${rrect(10, -32, 12, 12, 2)}" fill="${SHU}"/>`,
  faces: [F(0, -70, 11, 'tome')], kanji: [0, -42, 16] }));
N('未', 'un arbolito que todavía no abrió su brote', 96, t => ({ body: `${circ(0, -56, 22)} ${circ(-18, -46, 16)} ${circ(18, -46, 16)} ${ell(0, -40, 26, 10)}`,
  back: P('M-6,-34 C-6,-20 -8,-10 -16,0 L-8,0 L0,-6 L8,0 L16,0 C8,-10 6,-20 6,-34Z', WOOD, 2.6),
  front: J(0, -78, P('M0,0 C-6,-6 -6,-14 0,-20 C6,-14 6,-6 0,0Z', t.d, 2.4), .3),
  faces: [F(0, -54, 11, 'ten')], kanji: [0, -38, 12] }));
N('食', 'un tazón con tapa que se relame', 96, t => ({ body: 'M-46,-70 C-48,-44 -34,-18 -14,-12 L-16,-6 H16 L14,-12 C34,-18 48,-44 46,-70 C30,-66 -30,-66 -46,-70Z', fill: t.l,
  back: legs([-12, 12], t),
  mid: `<path class="k2-ln" d="M-46,-62 C-20,-56 20,-56 46,-62" stroke="${SHU}" stroke-width="3" fill="none"/>`,
  front: J(32, -72, `<g transform="rotate(14)">${P('M-74,0 C-74,-28 14,-28 14,0 C0,4 -60,4 -74,0Z', t.d, 3)}${P(circ(-30, -22, 5), GOLD, 2)}</g>`, 0, 'k2-swing') + steam(-8, -86),
  faces: [F(0, -46, 15, 'ten', { mouth: 'open' })], kanji: [0, -24, 14] }));
N('欠', 'una galleta a la que le falta un mordisco y bosteza', 82, t => ({ body: 'M34.2,-55.1 A36,36 0 1,1 11.1,-78.2 A18,18 0 0,0 34.2,-55.1Z',
  back: legs([-14, 14], t),
  mid: [[-18, -60], [12, -32], [-24, -26], [2, -70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${t.d}"/>`).join(''),
  front: `<g class="k2-float">${[[42, -80, 2.8], [50, -68, 2], [36, -92, 1.8]].map(([x, y, r]) => P(circ(x, y, r), t.f, 1.6)).join('')}</g>`,
  faces: [F(-4, -48, 13, 'ten', { expr: 'dormido', fix: true })], kanji: [-4, -22, 14] }));
N('耳', 'una oreja grande, atenta a cada sonido', 108, t => ({ body: 'M-4,-108 C24,-110 40,-92 40,-66 C40,-46 28,-36 24,-24 C20,-10 8,-6 -6,-6 C-20,-6 -28,-14 -26,-26 C-24,-36 -14,-38 -12,-46 C-10,-54 -32,-58 -34,-76 C-36,-98 -24,-108 -4,-108Z',
  back: legs([-10, 12], t),
  mid: Ln('M-14,-84 C-12,-100 20,-100 22,-74 C24,-56 10,-50 6,-42', t.d, 3.2, 0),
  front: `<g class="k2-float">${Ln('M-46,-74 C-52,-68 -52,-60 -46,-54 M-56,-80 C-64,-70 -64,-58 -56,-48', t.d, 2.6, 2.4)}</g>`,
  faces: [F(4, -68, 12, 'maru')], kanji: [-4, -24, 15] }));

// Animales
N('牛', 'una vaquita de cuernos cortos', 94, t => ({ body: 'M-36,-14 C-42,-44 -34,-72 0,-72 C34,-72 42,-44 36,-14 Q34,-6 26,-6 H-26 Q-34,-6 -36,-14Z',
  back: P('M-28,-62 C-38,-66 -44,-76 -42,-86 C-36,-80 -30,-76 -22,-72Z M28,-62 C38,-66 44,-76 42,-86 C36,-80 30,-76 22,-72Z', t.l, 2.4) + legs([-16, 16], t),
  mid: `<path d="M18,-66 C28,-62 32,-50 26,-44 C20,-48 14,-56 18,-66Z" fill="${t.d}" opacity=".6"/><path d="${ell(0, -32, 17, 10)}" fill="${t.l}"/><circle cx="-6" cy="-32" r="2.4" fill="${t.d}"/><circle cx="6" cy="-32" r="2.4" fill="${t.d}"/>`,
  faces: [F(0, -54, 13, 'tome', { mouth: false })], kanji: [0, -16, 11] }));
N('馬', 'un caballito con su crin al viento', 104, t => ({ body: 'M-26,-88 C-12,-98 14,-96 26,-78 C36,-60 34,-28 28,-14 Q24,-6 16,-6 H-16 Q-26,-6 -28,-16 C-32,-36 -36,-62 -26,-88Z M-14,-90 L-18,-106 L-4,-96Z M14,-92 L16,-108 L24,-94Z',
  back: P('M-26,-86 C-40,-80 -44,-66 -40,-56 C-46,-50 -46,-38 -38,-30 L-30,-40 L-28,-84Z', t.d, 2.6) + legs([-14, 14], t),
  mid: `<path d="${ell(2, -34, 20, 12)}" fill="${t.l}"/><circle cx="-6" cy="-34" r="2.2" fill="${t.d}"/><circle cx="10" cy="-34" r="2.2" fill="${t.d}"/>`,
  faces: [F(2, -60, 13, 'ten', { mouth: false })], kanji: [2, -16, 11] }));
N('鳥', 'un pajarito redondo con su copete', 92, t => ({ body: circ(0, -40, 32),
  back: P('M26,-30 C40,-34 52,-44 56,-56 C46,-52 40,-46 30,-44Z', t.d, 2.6) + J(-6, -70, P('M0,0 C-4,-10 -2,-18 4,-22 C4,-14 6,-8 4,0Z', t.d, 2.2), .2) + stub([-10, 10], GOLD, 0, 12, 7),
  mid: P('M-30,-44 L-42,-40 L-30,-36Z', GOLD, 2),
  faces: [F(-4, -48, 12, 'ten', { mouth: false })], kanji: [0, -24, 14] }));
N('羽', 'una pluma con su compañera', 106, t => ({ body: 'M0,-102 C22,-82 30,-52 22,-26 C16,-12 6,-8 0,-8 C-6,-8 -16,-12 -22,-26 C-30,-52 -22,-82 0,-102Z',
  back: `<g transform="translate(26 -14) rotate(24)">${P('M0,-74 C14,-60 20,-38 14,-18 C10,-8 4,-4 0,-4 C-4,-4 -10,-8 -14,-18 C-20,-38 -14,-60 0,-74Z', t.l, 2.6)}</g>` + Ln('M0,-8 V4', t.d, 3, 2),
  mid: `<path class="k2-ln" d="M-18,-70 L-6,-62 M-22,-48 L-8,-42 M18,-70 L6,-62 M22,-48 L8,-42" stroke="${t.d}" stroke-width="1.6" opacity=".5" fill="none"/>`,
  faces: [F(0, -58, 11, 'ten')], kanji: [0, -32, 14] }));

// Herramientas
N('刀', 'una espada con su empuñadura roja', 108, t => ({ body: 'M-14,-92 C-14,-104 -2,-110 14,-108 L14,-36 H-14Z',
  back: P(rrect(-8, -30, 16, 24, 4), SHU, 2.4) + legs([-6, 6], t, 0, 8),
  mid: `<path d="M8,-104 L10,-40" stroke="${W}" stroke-width="2.4" opacity=".7"/>`,
  front: P(ell(0, -34, 22, 5), GOLD, 2.4),
  faces: [F(0, -76, 9, 'harai')], kanji: [0, -52, 12] }));
N('工', 'un yunque de herrero que hace chispas', 84, t => ({ body: 'M-52,-74 H42 Q50,-74 50,-66 V-58 Q50,-52 42,-52 H18 V-28 H32 Q38,-28 38,-22 V-12 Q38,-6 32,-6 H-32 Q-38,-6 -38,-12 V-22 Q-38,-28 -32,-28 H-18 V-52 H-34 C-46,-54 -54,-62 -52,-74Z',
  front: `<g class="k2-float">${star(-14, -88, .55)}${star(14, -94, .45)}</g>`,
  faces: [F(0, -62, 13, 'hane', { mouth: false })], kanji: [0, -16, 11] }));
N('矢', 'una flecha gordita que siempre da en el blanco', 112, t => ({ body: 'M0,-110 C12,-98 40,-72 42,-60 C44,-50 34,-50 24,-54 L14,-56 V-10 Q14,-6 10,-6 H-10 Q-14,-6 -14,-10 V-56 L-24,-54 C-34,-50 -44,-50 -42,-60 C-40,-72 -12,-98 0,-110Z',
  back: P('M-14,-30 L-30,-14 L-30,-2 L-14,-14Z M14,-30 L30,-14 L30,-2 L14,-14Z', SHU, 2.4),
  faces: [F(0, -74, 13, 'harai')], kanji: [0, -32, 12] }));
N('文', 'un rollo de papel con sus líneas escritas', 86, t => ({ body: rrect(-40, -70, 80, 60, 6), fill: t.l,
  back: legs([-20, 20], t),
  mid: `<path class="k2-ln" d="M-26,-60 V-18 M26,-60 V-18" stroke="${t.d}" stroke-width="1.4" opacity=".35" fill="none"/>`,
  front: P(rrect(-50, -74, 12, 68, 6), WOOD, 2.4) + P(rrect(38, -74, 12, 68, 6), WOOD, 2.4),
  faces: [F(0, -46, 13, 'ten')], kanji: [0, -24, 14] }));

// Casa, ropa y el cuatro
N('四', 'una tortuga de cuatro patitas', 80, t => ({ body: 'M-46,-12 C-46,-50 -22,-70 0,-70 C22,-70 46,-50 46,-12 Q46,-8 40,-8 H-40 Q-46,-8 -46,-12Z',
  back: P(circ(50, -26, 12), t.l, 2.6) + legs([-32, -12, 12, 32], t, 0, 10),
  mid: `<path class="k2-ln" d="M-30,-56 L-16,-48 L0,-56 L16,-48 L30,-56 M-16,-48 V-30 M16,-48 V-30" stroke="${t.d}" stroke-width="2" opacity=".45" fill="none"/>`,
  faces: [F(-2, -40, 13, 'ten')], kanji: [-2, -20, 13] }));
N('家', 'un cerdito bajo su techo: la casa', 104, t => ({ body: `${circ(0, -40, 32)} M-22,-62 L-28,-80 L-10,-70Z M22,-62 L28,-80 L10,-70Z`, fill: t.l,
  back: legs([-14, 14], t),
  mid: `<path d="${ell(0, -30, 13, 9)}" fill="${t.f}"/><circle cx="-4" cy="-30" r="2.2" fill="${t.d}"/><circle cx="4" cy="-30" r="2.2" fill="${t.d}"/>`,
  front: roof(0, -76, 92),
  faces: [F(0, -48, 13, 'ten', { mouth: false })], kanji: [0, -14, 11] }));
N('服', 'un saco colgado de su percha', 100, t => ({ body: 'M-16,-80 L-44,-72 C-50,-70 -52,-60 -48,-52 L-36,-50 L-34,-6 H34 L36,-50 L48,-52 C52,-60 50,-70 44,-72 L16,-80 L0,-60Z',
  back: Ln('M0,-80 V-92 C0,-100 10,-100 10,-94', T.metal.d, 2.6, 2) + legs([-14, 14], t),
  mid: `<path class="k2-ln" d="M-16,-80 L-6,-56 M16,-80 L6,-56" stroke="${t.d}" stroke-width="3" fill="none"/>` + pips([[0, -22], [0, -12]], GOLD, 2.6),
  faces: [F(0, -42, 12, 'ten')], kanji: [-18, -20, 11] }));

// Ya aprobados en la tanda 1
N('門', 'un portón de dos hojas que cuida la entrada', 106, t => ({ body: rrect(-44, -92, 88, 86, 6), fill: WOODL,
  back: legs([-28, 28], t),
  mid: `<path d="M-44,-92 H-30 V-6 H-44Z M30,-92 H44 V-6 H30Z" fill="${t.d}" opacity=".55"/><path class="k2-ln" d="M-30,-64 H30 M-30,-36 H30" stroke="${t.d}" stroke-width="1.6" fill="none" opacity=".5"/>`,
  front: P('M-62,-106 C-44,-98 44,-98 62,-106 L58,-92 L-58,-92Z', '#8E3428', 3) + P(rrect(-50, -92, 100, 7, 2), T.fire.d, 2.4),
  faces: [F(0, -62, 15, 'tome')], kanji: [0, -30, 16] }));
N('雨', 'una nube regordeta que llueve gotitas', 110, t => ({ body: cloudB(0, -60),
  front: [[-24, -10, ''], [0, 0, ' b'], [24, -10, '']].map(([x, y, c]) => `<g class="k2-float${c}">${drop(x, y, .75, t.l)}</g>`).join(''),
  faces: [F(0, -64, 15, 'tome')], kanji: [0, -44, 14] }));


// ===== Grado 2 · primera composición: aparecen patitas o brazos cortos; 2–3 piezas.
// El compuesto conserva el cuerpo de su base y suma un rasgo del otro componente (máximo dos). =====

// Números
N('二', 'dos troncos de 一 apilados', 70, t => { const o = base('一', t).body; return { body: `${tr(o, .84, .84, 0, -6)} ${tr(o, .62, .62, -4, -34)}`,
  back: legs([-26, 24], t),
  faces: [F(-14, -24, 10, 'ten'), F(-10, -48, 9, 'hane', { fix: true, expr: 'feliz' })], kanji: [26, -22, 12] }; });
N('千', 'la cruz de 十 con una pluma de 丿 en la cabeza: ¡mil!', 112, t => { const b = base('十', t); return { ...b,
  back: J(4, -92, P('M0,0 C-2,-12 4,-24 16,-30 C14,-20 10,-8 4,2Z', t.d, 2.4) + `<path class="k2-ln" d="M2,-4 C6,-14 10,-20 14,-26" stroke="${t.l}" stroke-width="1.2" fill="none"/>`, .3) }; });
N('六', 'el abanico de 八 con la tapita de 亠 en la cabeza', 98, t => { const b = base('八', t); return { ...b,
  front: lid(0, -72, 26, t.d) };
});
N('毎', 'la mamá de 母 sale todos los días con las piernas de 人', 106, t => { const b = base('母', t); return { ...b, body: tr(b.body, 1, 1, 0, -10),
  back: P(circ(0, -94, 12), '#3A2E3A', 2.6) + pLegs(t, -22, 8, 16),
  mid: `<path d="M-28,-46 H28 L30,-18 H-30Z" fill="${W}" opacity=".92"/><path class="k2-ln" d="M-28,-46 C-20,-42 20,-42 28,-46" stroke="${SHU}" stroke-width="2.4" fill="none"/>`,
  faces: [F(0, -64, 13, 'ten')], kanji: [0, -30, 14] }; });

// Lo que hereda de 口 (la caja con la boca abierta)
N('中', 'la caja de 口 atravesada por el palo de 丨, con su banderita', 116, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + Ln('M0,-70 V-110', WOOD, 3.4, 2.4) + `<g transform="translate(0 -110)"><g class="k2-swing">${P('M0,0 L20,6 L0,12Z', SHU, 2.2)}</g></g>` + legs([-20, 20], t),
  front: '' }; });
N('右', 'la caja de 口 que se lleva el onigiri a la boca con la mano derecha (ナ)', 96, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t),
  front: arm(38, -40, -150, t.d, 18, .3) + onigiri(52, -66, .9) }; });
N('京', 'la caja de 口 con el techito de 亠: una pagoda de la capital', 108, t => { const b = base('口', t); return { ...b,
  back: legs([-20, 20], t),
  front: P('M-50,-70 C-30,-74 -10,-92 0,-96 C10,-92 30,-74 50,-70 Q40,-64 30,-68 L-30,-68 Q-40,-64 -50,-70Z', T.fire.d, 3) + P(circ(0, -100, 5), GOLD, 2) }; });
N('周', 'la caja de 口 rodeada por el marco de 冂', 100, t => { const b = base('口', t); return { ...b,
  back: P('M-52,0 V-86 Q-52,-92 -46,-92 H46 Q52,-92 52,-86 V0 H42 V-82 H-42 V0Z', t.d, 3) + legs([-20, 20], t), front: '' }; });
N('回', 'la caja de 口 dentro de 囗, dando vueltas', 100, t => { const b = base('口', t); return { ...b,
  back: P(rrect(-54, -94, 108, 92, 14), t.l, 3) + legs([-20, 20], t),
  front: `<g class="k2-float">${arrowP(-50, -48, -20, t.d, .55)}${arrowP(50, -48, 160, t.d, .55)}</g>` }; });
N('可', 'la caja de 口 con su antena de 丁: ¡sí se puede!', 104, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + Ln('M-10,-72 V-96', T.metal.d, 3, 2) + P(rrect(-20, -102, 20, 7, 3), T.metal.d, 2.2) + legs([-20, 20], t),
  faces: [F(0, -59, 18, 'hane', { mouth: false, expr: 'feliz', fix: true })] }; });
N('味', 'la caja de 口 que prueba el fruto de 未', 104, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t),
  front: J(30, -72, Ln('M0,0 C2,-10 6,-16 12,-20', T.wood.d, 3) + P(circ(14, -24, 8), SHU, 2.4) + `<g transform="translate(16 -32) scale(.3)">${leafR(T.wood.f, T.wood.l)}</g>`, .4) }; });
N('台', 'la caja de 口 hecha tarima, con la naricita de 厶', 92, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + P(rrect(-50, -10, 100, 10, 4), WOOD, 2.6),
  mid: b.mid + P('M0,-56 L5,-48 L-5,-48Z', t.d, 1.6) }; });
N('占', 'la caja de 口 que adivina con su varita de 卜', 100, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t),
  front: arm(38, -44, -160, t.d, 14, .2) + wand(46, -58, 20) }; });
N('名', 'la medialuna de 夕 dice su nombre con la boca abierta de 口', 92, t => { const b = base('夕', t); return { ...b,
  faces: [F(-20, -50, 10, 'maru', { mouth: false })],
  mid: mouthBox(-18, -34, 22, 14), kanji: [-22, -16, 12] }; });
N('知', 'la flecha de 矢 que habla con la boca de 口: lo sabe', 112, t => { const b = base('矢', t); return { ...b,
  faces: [F(0, -84, 12, 'ten', { mouth: false })], mid: mouthBox(0, -64, 24, 14), kanji: [0, -32, 12] }; });

// Lo que hereda de 日 (el sol)
N('白', 'el sol de 日 tan brillante que se ve blanco, con su destello de 丶', 100, t => { const b = base('日', t); return { ...b, fill: t.l,
  back: rays(0, -40, [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => [a, i % 2 ? .84 : 1]), { f: W }) + legs([-14, 14], t),
  front: `<g class="k2-float">${star(30, -86, .8)}</g>` }; });
N('早', 'el sol de 日 sale corriendo y bracea con las manos de 十', 102, t => { const b = base('日', t); return { ...b,
  back: b.back + legs([-14, 14], t),
  front: J(-32, -44, hand(-6, 4, -110, .75, T.metal.l), 0, 'k2-swing2') + J(32, -48, hand(6, -2, 70, .75, T.metal.l), .5, 'k2-swing2') + spd(-60, -40, t.d),
  faces: [F(0, -48, 15, 'harai')] }; });
N('者', 'el sol de 日 con la barba blanca de 耂: el que sabe', 104, t => { const b = base('日', t); return { ...b,
  back: b.back + legs([-14, 14], t),
  mid: beard(0, -42, .55), kanji: [0, -17, 12],
  front: cane(44, 0, 48),
  faces: [F(0, -54, 15, 'tome', { mouth: false })] }; });
N('書', 'el sol de 日 que escribe con el pincel de 聿', 100, t => { const b = base('日', t); return { ...b,
  back: b.back + legs([-14, 14], t),
  front: arm(32, -38, -120, t.d, 14, .2) + brush(50, -52, 30, .9) }; });
N('曜', 'el sol de 日 con las alas de 羽: un día que vuela', 100, t => { const b = base('日', t); return { ...b,
  back: [-1, 1].map(s => `<g transform="translate(${s * 34} -46) scale(${s} 1) rotate(-30)">${P('M0,0 C14,-6 30,-4 40,6 C30,8 20,12 10,10Z', T.water.l, 2.4)}</g>`).join('') + b.back + legs([-14, 14], t) }; });

// Lo que hereda de 人 (dos piernas, sin manos)
N('今', 'la persona de 人 lleva en equilibrio el tablón de 一: ¡ahora!', 110, t => { const b = base('人', t); return { ...b,
  front: plank(0, -92, 70, T.earth) }; });
N('作', 'la persona de 人 cose con la aguja grande de 乍', 100, t => { const b = base('人', t); return { ...b,
  back: `<g transform="translate(32 -6) rotate(-28)">${P(rrect(-2.5, -54, 5, 54, 2.5), T.metal.l, 2)}${P(ell(0, -48, 1.5, 4), W, 0)}</g>` + Ln('M44,-52 C60,-56 56,-30 38,-28 C26,-27 24,-40 18,-44', SHU, 2.4, 2) }; });
N('仕', 'la persona de 人 con el casco de 士: está de servicio', 106, t => { const b = base('人', t); return { ...b,
  front: P('M-22,-74 C-22,-98 22,-98 22,-74 L28,-70 C18,-74 -18,-74 -28,-70Z', T.metal.d, 2.8) + P('M-4,-88 C-12,-96 -16,-104 -14,-110 C-8,-104 -4,-98 0,-92 C4,-98 8,-104 14,-110 C16,-104 12,-96 4,-88Z', GOLD, 2.2) }; });
N('化', 'la persona de 人 da una vuelta y aparece su doble cabeza abajo, 匕', 112, t => { const b = base('人', t); return { ...b,
  back: `<g class="k2-float"><g transform="translate(40 -108) rotate(180) scale(.5)">${P(b.body, t.l, 6)}</g></g>` + Ln('M-40,-60 C-54,-82 -38,-104 -14,-102', t.d, 3, 2.4) + P('M-14,-102 l-8,-6 l2,10Z', t.d, 1.6) }; });
N('全', 'la persona de 人 con la corona de 王: todos juntos', 108, t => { const b = base('人', t); return { ...b, front: crown(0, -86, .85) }; });

// Lo que hereda de 大 (brazos y piernas extendidos)
N('犬', 'el cuerpo de 大 con las dos orejas en punta del 丶: el cuerno que hereda Jū', 104, t => ({ body: circ(0, -52, 32),
  back: horn(-14, -80, -1, t, .62) + horn(14, -80, 1, t, .62) + bigArms(t, -50, 26, 22, 6) + strip(-12, -24, -20, 0, t.f, 11) + strip(12, -24, 20, 0, t.f, 11),
  mid: `<path d="${ell(0, -40, 13, 9)}" fill="${t.l}"/><path d="${ell(0, -44, 5, 3.6)}" fill="${INK}"/>`,
  faces: [F(0, -62, 13, 'ten', { mouth: false })], kanji: [0, -27, 12] }));
N('天', 'la persona grande de 大 con el tablón de 一 sobre la cabeza: lo más alto', 112, t => { const b = base('大', t); return { ...b, front: b.front + plank(0, -96, 64, T.earth) }; });
N('央', 'la persona grande de 大, justo en el centro del marco de 冂', 112, t => { const b = base('大', t); return { ...b,
  back: P('M-70,0 V-104 Q-70,-110 -64,-110 H64 Q70,-110 70,-104 V0 H60 V-100 H-60 V0Z', WOOD, 3) + b.back }; });

// Lo que hereda de 木 (el árbol)
N('東', 'el árbol de 木 con el sol de 日 que sale por detrás: el este', 104, t => { const b = base('木', t); return { ...b,
  back: sunP(30, -82, 16) + b.back }; });
N('村', 'el árbol de 木 con la regla de 寸 como cerca: la aldea', 100, t => { const b = base('木', t); return { ...b,
  front: b.front + [-44, -34, -24].map(x => P(rrect(x - 4, -26, 8, 26, 3), T.metal.f, 2)).join('') + P(rrect(-50, -20, 34, 5, 2), T.metal.d, 1.8) }; });

// Lo que hereda de 女 (el moño)
N('姉', 'la mujer de 女 con la sombrilla a rayas de 市: la hermana mayor', 120, t => { const b = base('女', t); return { ...b,
  front: Ln('M26,-40 V-110', WOOD, 2.6, 2) + P('M-4,-104 C6,-124 46,-124 56,-104 Q48,-98 40,-104 Q32,-98 26,-104 Q18,-98 10,-104 Q2,-98 -4,-104Z', SHU, 2.6) + `<path d="M12,-118 L10,-104 M40,-118 L42,-104" stroke="${W}" stroke-width="4" opacity=".8"/>` }; });
N('妹', 'la mujer de 女, más chiquita, con el brote de 未 en el pelo: la hermana menor', 112, t => { const b = base('女', t); return { ...b,
  body: tr(b.body, .86, .86), back: `<g transform="scale(.86)">${b.back}</g>` + J(-10, -90, P('M0,0 C-6,-6 -6,-14 0,-20 C6,-14 6,-6 0,0Z', T.wood.f, 2.2), .3),
  mid: `<g transform="scale(.86)">${b.mid}</g>`, faces: [F(0, -61, 7, 'ten', { es: .72 })], kanji: [0, -14, 14] }; });


// Lo que hereda de 王, 目, 糸, 夕, 火, 土, 生, 山, 止 y otros
N('主', 'el rey de 王 con la llama de su lámpara (亠) sobre la corona: el dueño de casa', 112, t => { const b = base('王', t); return { ...b,
  front: b.front + `<g class="k2-float">${flameP(0, -92, 1.3)}</g>` }; });
N('玉', 'una joya tallada con la corona de 王 y su destello de 丶', 104, t => ({ body: 'M0,-80 L32,-62 L36,-30 L0,-6 L-36,-30 L-32,-62Z',
  back: legs([-14, 14], t),
  mid: `<path class="k2-ln" d="M-32,-62 L0,-50 L32,-62 M0,-50 V-6 M-36,-30 L0,-50 L36,-30" stroke="${t.l}" stroke-width="1.6" opacity=".7" fill="none"/>`,
  front: crown(0, -78, .8) + `<g class="k2-float">${star(34, -84, .6)}</g>`,
  faces: [F(0, -46, 13, 'maru')], kanji: [0, -24, 13] }));
N('自', 'el ojo de 目 con la naricita de 丶: uno mismo', 108, t => { const b = base('目', t); return { ...b,
  back: b.back + legs([-12, 12], t), front: '',
  mid: P(ell(0, -40, 5, 4), t.d, 2), kanji: [0, -22, 12] }; });
N('県', 'el ojo de 目 con su amiguito chiquito de 小', 108, t => { const b = base('目', t); return { ...b,
  back: b.back + legs([-12, 12], t), front: P(circ(40, -16, 12), t.l, 2.6) + `<circle cx="36" cy="-18" r="2" fill="${INK}"/><circle cx="44" cy="-18" r="2" fill="${INK}"/>` }; });
N('後', 'el ovillo de 糸 se queda atrás: camina despacio con los pies de 夂', 84, t => { const b = base('糸', t); return { ...b, body: tr(b.body, 1, 1, 0, -6),
  back: strip(-10, -10, -24, 0, t.d, 10) + strip(10, -10, 16, 0, t.d, 10),
  mid: `<g transform="translate(0 -6)">${b.mid}</g>`, front: Ln('M30,-22 C46,-14 56,-24 66,-14 C72,-8 76,-2 84,-4', t.d, 3.5) + spd(-46, -44, t.d, -1),
  faces: [F(0, -50, 14, 'hane')], kanji: [0, -26, 16] }; });
N('終', 'el ovillo de 糸 con la bufanda de 冬: se acaba el hilo', 84, t => { const b = base('糸', t); return { ...b,
  back: legs([-14, 14], t),
  front: P('M-30,-58 C-14,-50 14,-50 30,-58 L30,-50 C14,-42 -14,-42 -30,-50Z M14,-50 L18,-30 L26,-32 L22,-50Z', SHU, 2.2) + J(32, -16, Ln('M0,0 C6,4 10,2 12,-2', t.d, 3.5), 0) }; });
N('外', 'la medialuna de 夕 sale afuera con el bastón de 卜', 98, t => { const b = base('夕', t); return { ...b,
  front: Ln('M24,0 V-50 M24,-34 L36,-40', WOOD, 3.4, 2.4) }; });
N('夜', 'la medialuna de 夕 con el gorro de dormir de 亠: es de noche', 100, t => { const b = base('夕', t); return { ...b,
  back: b.back,
  front: P('M-44,-74 C-38,-92 -10,-96 4,-80 C-8,-82 -24,-78 -34,-66Z', t.d, 2.6) + P(circ(6, -80, 4.5), W, 2) + zz(-62, -60),
  faces: [F(-20, -46, 10, 'tome', { expr: 'dormido', fix: true })] }; });
N('秋', 'la llama de 火 con una espiga de 禾: la cosecha de otoño', 112, t => { const b = base('火', t); return { ...b,
  front: J(18, -98, Ln('M0,0 C-2,-10 2,-18 8,-24', T.wood.d, 2.6, 2) + [0, 1, 2, 3].map(i => P(ell(8 + i * 2, -26 - i * 7, 4, 6), GOLD, 1.8)).join(''), .3) + legs([-16, 16], t) }; });
N('赤', 'la tierra de 土 al rojo vivo por el fuego de 火', 98, t => { const b = base('土', t); return { ...b,
  back: legs([-24, 24], t, 0, 8),
  front: `<g class="k2-float">${flameP(0, -60, 1.6)}${flameP(-30, -40, .9)}${flameP(30, -44, .9)}</g>` }; });
N('地', 'el terrón de 土 con la serpiente de 也 que asoma: el suelo', 80, t => { const b = base('土', t); return { ...b,
  front: snake(46, -18, 1.1) }; });
N('至', 'la flecha que llega y se clava en el suelo de 土', 92, t => { const b = base('土', t); return { ...b,
  back: `<g transform="translate(-10 -54) rotate(30)">${P(rrect(-3, -36, 6, 36, 3), WOOD, 2.4)}${P('M-9,-30 L0,-46 L9,-30Z', T.metal.d, 2.2)}</g>` }; });
N('青', 'la semilla de 生 bajo la luna de 月 se pone azul', 104, t => { const b = base('生', t); return { ...b, fill: t.f,
  back: moonP(-44, -70, 1, T.water.l) + legs([-14, 14], t) }; });
N('出', 'una montaña de 山 que asoma de otra montaña: salir', 112, t => { const o = base('山', t).body; return { body: `${o} ${tr(o, .58, .58, 0, -56)}`,
  back: legs([-24, 24], t),
  faces: [F(0, -34, 13, 'tome'), F(0, -72, 9, 'maru', { fix: true, expr: 'feliz' })], kanji: [0, -16, 13] }; });
N('走', 'la señal de 止 que ya no se detiene: corre levantando tierra de 土', 96, t => { const b = base('止', t); return { ...b,
  front: strip(-10, -16, -24, -2, t.d, 10) + strip(10, -16, 22, 0, t.d, 10) + `<g class="k2-float">${P(`${circ(-48, -14, 9)} ${circ(-60, -8, 6)}`, T.earth.l, 2.2)}</g>` + spd(-46, -52, t.d) }; });
N('足', 'la caja de 口 sobre los dos pies grandes de 止', 96, t => { const b = base('口', t); return { ...b,
  back: b.back + stub([-18, 18], t.d, 0, 10, 12),
  front: P(ell(-22, -3, 16, 7), SHU, 2.6) + P(ell(22, -3, 16, 7), SHU, 2.6) }; });
N('歩', 'la señal de 止 da pasitos con su amiguito de 少', 96, t => { const b = base('止', t); return { ...b,
  front: strip(-10, -16, -18, 0, t.d, 10) + strip(10, -16, 18, 0, t.d, 10) + P(circ(46, -14, 12), t.l, 2.4) + `<circle cx="42" cy="-16" r="2" fill="${INK}"/><circle cx="50" cy="-16" r="2" fill="${INK}"/>` }; });

// Lo que hereda de 七, 八, 月, 示, 戸, 父, 皮, 豆, 工, 子
N('切', 'la mariquita de 七 con la espadita de 刀', 98, t => { const b = base('七', t); return { ...b,
  front: `<g transform="translate(44 -24) rotate(20) scale(.6)">${P('M-8,-60 C-8,-70 0,-74 10,-72 L10,-20 H-8Z', T.metal.l, 3)}${P(ell(1, -18, 15, 4), GOLD, 2.4)}${P(rrect(-5, -16, 12, 18, 3), SHU, 2.4)}</g>` }; });
N('分', 'el abanico de 八 partido en dos por la espada de 刀', 98, t => { const b = base('八', t); return { ...b,
  front: `<g transform="translate(40 -66) rotate(30) scale(.55)">${P('M-8,-60 C-8,-70 0,-74 10,-72 L10,-20 H-8Z', T.metal.l, 3)}${P(ell(1, -18, 15, 4), GOLD, 2.4)}${P(rrect(-5, -16, 12, 18, 3), SHU, 2.4)}</g>` }; });
N('前', 'la luna de 月 va adelante con la visera de 八', 100, t => { const b = base('月', t); return { ...b,
  back: legs([-30, -10], t),
  front: b.front + `<g transform="translate(-34 -84) rotate(-24) scale(.4)">${P('M0,-10 L-56,-38 A62,62 0 0,1 56,-38Z', T.earth.f, 4)}</g>` }; });
N('社', 'el altar de 示 sobre su montículo de 土: el santuario', 108, t => { const b = base('示', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -10), back: `<g transform="translate(0 -10)">${b.back}</g>`,
  front: `<g transform="translate(0 -10)">${b.front}</g>` + P('M-52,0 C-46,-14 -20,-18 0,-18 C20,-18 46,-14 52,0Z', T.earth.f, 2.6),
  faces: [F(0, -50, 11, 'tome')], kanji: [0, -28, 14] }; });
N('所', 'la puerta de 戸 con el hacha de 斤 apoyada: aquí vivo', 104, t => { const b = base('戸', t); return { ...b,
  front: `<g transform="translate(46 -6) rotate(10) scale(.55)">${P(rrect(-6, -90, 12, 90, 5), WOOD, 3)}${P('M-30,-96 L6,-100 C22,-100 34,-88 34,-72 C34,-60 26,-52 18,-50 C14,-60 8,-64 0,-64 L-30,-66Z', T.metal.f, 3)}</g>` }; });
N('交', 'el papá de 父 con la gorra de 亠 y su banderín de cruce', 100, t => { const b = base('父', t); return { ...b,
  front: lid(0, -74, 46, GOLD) + `<g transform="translate(44 -6)">${Ln('M0,0 V-50', WOOD, 3, 2)}<g class="k2-swing">${P('M0,-50 L20,-44 L0,-36Z', GOLD, 2.2)}</g></g>` }; });
N('彼', 'el cuero de 皮 da un paso por la escalerita de 彳: él', 96, t => { const b = base('皮', t); return { ...b,
  back: (b.back || '') + P('M-58,0 V-14 H-44 V-28 H-30 V0Z', WOOD, 2.6) + legs([-14, 14], t) }; });
N('短', 'el poroto de 豆 con una flechita corta de 矢', 96, t => { const b = base('豆', t); return { ...b,
  front: b.front + `<g transform="translate(26 -62) rotate(40)">${P(rrect(-2.5, -20, 5, 22, 2.5), WOOD, 2)}${P('M-7,-16 L0,-28 L7,-16Z', T.metal.d, 2)}${P('M-2.5,2 L-7,8 M2.5,2 L7,8', SHU, 2)}</g>` }; });
N('左', 'el yunque de 工 sostiene el martillo con la mano izquierda (ナ)', 98, t => { const b = base('工', t); return { ...b,
  back: legs([-22, 22], t),
  front: arm(-46, -62, 150, t.d, 16, .2) + hammer(-58, -78, -30, .9) }; });
N('学', 'el niño de 子 con las tres chispas de ⺍ en la cabeza: estudia', 98, t => { const b = base('子', t); return { ...b,
  back: (b.back || '') + [[-12, -88, -16], [0, -92, 0], [12, -88, 16]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${Ln('M0,0 V-9', t.d, 4, 0)}</g>`).join('') + legs([-10, 10], t) }; });
N('孝', 'el niño de 子 con el bastón del abuelo (耂): respeta a sus mayores', 98, t => { const b = base('子', t); return { ...b,
  back: (b.back || '') + legs([-10, 10], t), front: b.front + cane(38, 0, 50) }; });

// Lo que hereda de 口 con 貝, de 目 con 八, etc.
N('貝', 'una concha de abanico (八) con el gran ojo de 目', 92, t => ({ body: 'M0,-6 L-46,-34 C-50,-60 -28,-82 0,-82 C28,-82 50,-60 46,-34Z',
  back: legs([-12, 12], t),
  mid: `<path class="k2-ln" d="M0,-6 L-30,-74 M0,-6 L-12,-82 M0,-6 L12,-82 M0,-6 L30,-74" stroke="${t.l}" stroke-width="2" opacity=".7" fill="none"/>`,
  faces: [F(0, -54, 0, 'maru', { es: 1.8, mouth: false })], kanji: [0, -26, 12] }));

// Animales y comida
N('物', 'la vaquita de 牛 con los banderines de 勿: lleva sus cosas', 104, t => { const b = base('牛', t); return { ...b,
  front: streamers(-40, -40) }; });
N('駅', 'el caballito de 馬 junto al cartel de 尺: la estación', 104, t => { const b = base('馬', t); return { ...b,
  front: signBoard(46, 0, 30, 50, T.metal.l) }; });
N('魚', 'un pez redondo doblado en cuatro como 田, con la cola de llamas de 火', 76, t => ({ body: 'M-48,-36 C-48,-60 -24,-70 0,-70 C22,-70 34,-58 38,-48 L40,-24 C34,-12 20,-4 0,-4 C-24,-4 -48,-14 -48,-36Z',
  back: `<g transform="translate(40 -52) rotate(60) scale(1.35)">${flame(T.fire.f, T.fire.l)}</g><g transform="translate(40 -22) rotate(120) scale(1.35)">${flame(T.fire.d, T.fire.l)}</g>`,
  mid: `<path class="k2-ln" d="M-48,-37 C-20,-38 12,-37 40,-36" stroke="${W}" stroke-width="2.4" opacity=".85" fill="none"/>`,
  front: J(-4, -68, P('M0,0 C4,-10 14,-14 22,-12 C18,-6 12,-2 6,2Z', t.d, 2.4), 0, 'k2-swing2') + J(-14, -10, P('M0,0 C-4,8 -12,12 -20,10 C-16,4 -10,0 -4,-2Z', t.d, 2.4), .6, 'k2-swing2'),
  faces: [F(-14, -50, 13, 'maru')], kanji: [-14, -22, 13] }));
N('茶', 'el arbusto de 木 con los brotes tiernos de 艸: hojas de té', 104, t => { const b = base('木', t); return { ...b,
  front: tuft(-14, -94, .45, .2) + tuft(16, -94, .45, .6) + steam(40, -60) }; });
N('紙', 'una hoja de papel cosida con el hilo de 糸', 98, t => ({ body: 'M-34,-92 H22 L36,-78 V-12 Q36,-6 30,-6 H-34 Q-40,-6 -40,-12 V-86 Q-40,-92 -34,-92Z', fill: t.l,
  back: legs([-18, 18], t),
  mid: `<path d="M22,-92 V-78 H36Z" fill="${t.f}"/><path class="k2-ln" d="M-32,-84 V-14" stroke="${t.d}" stroke-width="2" stroke-dasharray="4 4" fill="none"/>`,
  front: P(circ(44, -20, 12), t.f, 2.4) + Ln('M34,-26 C24,-34 -20,-40 -32,-30', t.d, 1.8, 1.6),
  faces: [F(0, -62, 12, 'ten')], kanji: [0, -32, 15] }));
N('酒', 'la botella de sake de 酉 con una gota de 水', 110, t => ({ body: 'M-8,-104 H8 V-90 C8,-80 30,-70 30,-40 C30,-16 20,-6 0,-6 C-20,-6 -30,-16 -30,-40 C-30,-70 -8,-80 -8,-90Z',
  back: legs([-12, 12], t),
  mid: P('M-24,-60 H24 V-52 H-24Z', SHU, 1.8),
  front: `<g class="k2-float">${drop(34, -88, .6, t.l)}</g>`,
  faces: [F(0, -42, 12, 'ten', { expr: 'feliz', fix: true })], kanji: [0, -22, 13] }));
N('医', 'el botiquín de 匸 que guarda la flecha de 矢: la medicina', 92, t => ({ body: rrect(-40, -70, 80, 64, 8),
  back: legs([-20, 20], t) + `<g transform="translate(30 -66) rotate(30)">${P(rrect(-2.5, -26, 5, 28, 2.5), WOOD, 2)}${P('M-7,-22 L0,-34 L7,-22Z', T.metal.d, 2)}</g>`,
  mid: P('M-6,-66 H6 V-60 H12 V-48 H6 V-42 H-6 V-48 H-12 V-60 H-6Z', SHU, 1.6) + P(rrect(-12, -78, 24, 10, 4), t.d, 2.2),
  faces: [F(0, -36, 13, 'ten')], kanji: [0, -17, 12] }));
N('洗', 'la gota de 水 se lava con espuma y va primero, con el banderín de 先', 116, t => { const b = base('水', t); return { ...b,
  back: b.back + [[-24, -104, 10], [-8, -112, 12], [10, -106, 10]].map(([x, y, r]) => P(circ(x, y, r), W, 2.4)).join(''),
  front: Ln('M34,-30 V-70', WOOD, 2.6, 2) + `<g transform="translate(34 -70)"><g class="k2-swing">${P('M0,0 L18,5 L0,10Z', SHU, 2)}</g></g>` + legs([-14, 14], t) }; });
N('池', 'la gota de 水 se acuesta y se vuelve estanque; la serpiente de 也 nada en él', 78, t => ({ body: 'M-56,-26 C-58,-44 -40,-54 -20,-54 C-14,-60 -14,-68 -22,-72 C-12,-76 2,-68 0,-54 C20,-54 58,-48 58,-26 C58,-10 34,-4 0,-4 C-34,-4 -56,-10 -56,-26Z',
  back: legs([-30, 30], t),
  mid: `<path class="k2-ln" d="${ell(-6, -16, 34, 6)}" stroke="${W}" stroke-width="1.6" fill="none" opacity=".7"/>`,
  front: snake(40, -44, .9),
  faces: [F(-4, -34, 14, 'ten')], kanji: [-6, -18, 12] }));


// Lo que hereda de 田 (el cuerpo de Jū), de 門, de 食, de 雨, de 米, de 小, de 士, de 一
N('里', 'la hoja de 田 doblada en cuatro, sentada en su terrón de 土: la aldea natal', 108, t => ({ body: juB(1, -14),
  mid: juF(1, -14),
  front: P('M-60,0 C-56,-22 -30,-28 0,-28 C30,-28 56,-22 60,0Z', T.earth.d, 2.8) + [[-40, -10], [30, -14], [44, -6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${T.earth.l}"/>`).join('') + tuft(-30, -26, .35, .2),
  faces: [F(0, -84, 14, 'ten')], kanji: [0, -54, 15] }));
N('町', 'la hoja de 田 doblada en cuatro junto a su farol de 丁: una cuadra del pueblo', 112, t => ({ body: juB(1, -6),
  back: legs([-20, 20], t),
  mid: juF(1, -6),
  front: Ln('M66,0 V-80', T.metal.d, 3.4, 2.4) + P(rrect(54, -86, 24, 8, 3), T.metal.d, 2.4) + `<path d="${rrect(58, -78, 16, 14, 3)}" fill="${GLOW}" stroke="${W}" stroke-width="2" paint-order="stroke"/>`,
  faces: [F(0, -76, 14, 'ten')], kanji: [0, -36, 15] }));
N('少', 'el chiquito de 小 con una hojita de 丿 como sombrilla: un poquito', 100, t => { const b = base('小', t); return { ...b,
  back: b.back + Ln('M-2,-46 V-62', WOOD, 2.2, 1.8), front: b.front + `<g transform="translate(-2 -62) rotate(-90) scale(.55)">${leafL(T.wood.f, T.wood.l)}</g>` }; });
N('米', 'un grano de arroz con la ramita de 木 y dos granitos de 丷 que saltan', 104, t => ({ body: 'M0,-90 C24,-90 36,-62 36,-42 C36,-18 22,-6 0,-6 C-22,-6 -36,-18 -36,-42 C-36,-62 -24,-90 0,-90Z', fill: W,
  back: legs([-14, 14], t),
  front: J(0, -88, `<g transform="scale(.5)">${leafL(t.d, t.l)}${leafR(t.f, t.l)}</g>`, .3) + `<g class="k2-float">${P(ell(-44, -70, 5, 8), W, 2.2)}${P(ell(46, -60, 5, 8), W, 2.2)}</g>`,
  faces: [F(0, -56, 13, 'ten')], kanji: [0, -28, 15] }));
N('売', 'el samurái de 士 atiende su puesto con la cortina de 冖', 104, t => { const b = base('士', t); return { ...b,
  back: b.back + Ln('M-62,0 V-80 M62,0 V-80', WOOD, 3, 2.4),
  front: b.front + P('M-66,-84 H66 V-74 H-66Z', WOOD, 2.4) + [-54, -38, 38, 54].map(x => P(rrect(x - 7, -74, 14, 26, 2), T.fire.d, 2)).join('') }; });
N('高', 'dos cajas de 口 apiladas con su tejado de 亠: la torre alta', 128, t => ({ body: `${rrect(-28, -116, 56, 40, 8)} M-34,-76 Q-40,-76 -40,-70 L-35,-12 Q-34,-6 -28,-6 H28 Q34,-6 35,-12 L40,-70 Q40,-76 34,-76Z`,
  back: legs([-20, 20], t),
  mid: mouthBox(0, -46, 30, 18),
  front: P('M-42,-114 C-26,-118 -10,-130 0,-134 C10,-130 26,-118 42,-114 Q34,-108 26,-112 L-26,-112 Q-34,-108 -42,-114Z', T.fire.d, 3),
  faces: [F(0, -96, 12, 'hane', { mouth: false })], kanji: [0, -22, 13] }));
N('行', 'un poste de caminos con los tablones de 一 que señalan hacia dónde ir', 112, t => ({ body: rrect(-20, -96, 40, 90, 10),
  back: legs([-10, 10], t),
  front: P('M20,-90 H54 L64,-82 L54,-74 H20Z', T.earth.f, 2.6) + P('M-20,-66 H-54 L-64,-58 L-54,-50 H-20Z', T.earth.f, 2.6),
  faces: [F(0, -70, 10, 'ten')], kanji: [0, -32, 14] }));
N('空', 'el abanico de 八 abierto como alas bajo el techo de 宀: el cielo', 104, t => { const b = base('八', t); return { ...b,
  front: roof(0, -74, 60) }; });

// El portón de 門
N('聞', 'el portón de 門 con las orejas de 耳: escucha con los ojos cerrados', 112, t => { const b = base('門', t); return { ...b,
  back: b.back + [-1, 1].map(s => `<g transform="translate(${s * 58} -70) scale(${s * .42} .42) translate(-4 58)">${P(base('耳', T.metal).body, T.metal.f, 6)}</g>`).join(''),
  faces: [F(0, -62, 15, 'tome', { expr: 'feliz', fix: true })] }; });
N('開', 'el portón de 門 abre sus hojas de par en par y levanta la tranca 开', 120, t => { const b = base('門', t); return { ...b,
  body: `${rrect(-46, -92, 16, 86, 5)} ${rrect(30, -92, 16, 86, 5)} ${rrect(-32, -92, 64, 26, 6)} ${rrect(-32, -24, 64, 18, 4)}`,
  back: `<path d="${rrect(-30, -66, 60, 44, 2)}" fill="${GLOW}"/>` + legs([-38, 38], t),
  mid: '',
  front: b.front + J(-30, -64, P('M0,0 L-24,-8 L-24,46 L0,54Z', t.f, 3), 0, 'k2-swing') + J(30, -64, P('M0,0 L24,-8 L24,46 L0,54Z', t.f, 3), 1.2, 'k2-swing') + `<g transform="translate(0 -120)">${P(rrect(-22, -4, 44, 6, 3), SHU, 2.2)}${P(rrect(-22, 4, 44, 6, 3), SHU, 2.2)}</g>`,
  faces: [F(0, -80, 11, 'maru', { expr: 'feliz', fix: true })], kanji: [0, -15, 12] }; });
N('間', 'el portón de 門 entreabierto: el sol de 日 se asoma entre las hojas', 108, t => { const b = base('門', t); return { ...b,
  mid: b.mid + `<path d="M-5,-92 H5 V-6 H-5Z" fill="${GLOW}"/>`,
  front: b.front + `<g class="k2-float">${sunP(0, -64, 9)}</g>`,
  faces: [F(0, -70, 26, 'hane', { mouth: false })], kanji: [-17, -30, 13] }; });

// El tazón de 食, ahora con patitas
N('飲', 'el tazón de 食 se saca la tapa y toma con pajita, con la boca abierta de 欠', 112, t => { const b = base('食', t); return { ...b,
  mid: `<path d="${ell(0, -67, 45, 6)}" fill="${T.water.f}" stroke="${W}" stroke-width="2.4" paint-order="stroke"/>` + b.mid,
  front: J(14, -66, Ln('M0,0 L14,-44 L26,-50', SHU, 4.5), 0, 'k2-swing') }; });
N('飯', 'el tazón de 食 rebosante de arroz, con la paleta de 反', 112, t => { const b = base('食', t); return { ...b,
  body: `${b.body} M-44,-66 C-42,-92 -20,-104 0,-104 C20,-104 42,-92 44,-66Z`,
  mid: `<path d="M-44,-66 C-42,-92 -20,-104 0,-104 C20,-104 42,-92 44,-66Z" fill="${W}"/>` + [[-22, -78], [-6, -92], [12, -84], [28, -74], [2, -74], [-30, -70], [18, -96]].map(([x, y]) => `<path d="${ell(x, y, 3.2, 1.8)}" fill="${T.metal.l}"/>`).join('') + b.mid,
  front: J(44, -64, `<g transform="rotate(-30)">${P(rrect(-3, -34, 6, 24, 3), WOOD, 2)}${P(ell(0, -42, 9, 11), WOODL, 2.4)}</g>`, 0, 'k2-swing2'),
  faces: [F(0, -46, 15, 'ten', { expr: 'feliz', fix: true })] }; });

// La nube de 雨
N('電', 'la nube de 雨 se carga con los rayos de 日 y sus bracitos son relámpagos', 116, t => { const b = base('雨', t); return { ...b,
  back: rays(0, -66, [[-60, .9], [-20, 1], [20, 1], [60, .9]], T.fire),
  front: J(-36, -36, P('M0,0 L-8,14 L0,14 L-6,30 L10,8 L2,8 L8,0Z', GOLD, 2.4), 0, 'k2-swing2') + J(36, -36, P('M0,0 L-8,14 L0,14 L-6,30 L10,8 L2,8 L8,0Z', GOLD, 2.4), .7, 'k2-swing2'),
  faces: [F(0, -64, 15, 'harai')] }; });


// ===== Grado 3 · composición intermedia: postura propia (se para, carga, se apoya), 3–4 piezas,
// marcas bermellón bajo los ojos (las pone el kit). Un rasgo de cada componente directo, máximo dos. =====

// Jū 獣, la mascota: idéntica a su ficha, en pose neutra. Única de Fuego por decisión de diseño:
// no lleva kanji en el cuerpo ni marcas de grado.
N('獣', 'Jū: la hoja de 田 doblada en cuatro, las chispas de ⺍, la boca de 口 y el cuerno y los brazos de 犬', 132, t => ({ body: JU,
  back: horn(34, -94, 1, t, 1.05) + [[-24, -104, -16], [-2, -108, 0], [20, -104, 16]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})">${Ln('M0,0 V-10', t.d, 4.6, 0)}</g>`).join('')
    + strip(-44, -56, -72, -40, t.f, 12) + strip(46, -56, 74, -40, t.f, 12) + strip(-14, -10, -20, 6, t.f, 11) + strip(14, -10, 20, 6, t.f, 11),
  mid: JUFOLD + P('M-18,-44 Q0,-42 18,-42 Q16,-18 0,-18 Q-16,-19 -18,-44Z', MOUTH, 2.6)
    + `<path d="M-10,-22 Q0,-30 10,-22 Q5,-18 0,-18 Q-5,-18 -10,-22Z" fill="${SHU}"/><path d="M-14,-43 L-10.5,-35 L-7,-43.2Z M7,-42.6 L10.5,-34.5 L14,-42.4Z" fill="${W}"/>`,
  faces: [F(4, -72, 0, 'ten', { es: 2.8, mouth: false })], kanji: [0, -30, 14] }), { mascot: true });

// Lo que viene de 田: el cuerpo de Jū
N('猫', 'el cuerpo de Jū (la hoja de 田 doblada en cuatro) con las orejas en punta y los brazos extendidos de 犬', 120, t => ({ body: JU,
  back: horn(-28, -94, -1, t, .72) + horn(28, -94, 1, t, .72) + strip(-44, -50, -68, -40, t.f, 11) + strip(46, -50, 70, -40, t.f, 11) + strip(-14, -10, -20, 4, t.f, 11) + strip(14, -10, 20, 4, t.f, 11),
  mid: JUFOLD + `<path d="M-2.6,-60 h5.2 l-2.6,3.2Z" fill="${SHU}"/>` + Ln('M-12,-58 H-32 M-12,-54 L-31,-50 M12,-58 H32 M12,-54 L31,-50', INK, 1.1, 0),
  faces: [F(0, -72, 16, 'hane')], kanji: [0, -30, 16] }));
N('番', 'el cuerpo de 田 espera su turno con granos de 米 en la cabeza y su numerito', 118, t => ({ body: JU,
  back: legs([-20, 20], t, 0, 12) + `<g class="k2-float">${P(ell(-16, -110, 5, 8), W, 2.2)}${P(ell(2, -114, 5, 8), W, 2.2)}${P(ell(18, -108, 5, 8), W, 2.2)}</g>`,
  mid: JUFOLD,
  front: J(46, -48, P(rrect(-2, -2, 22, 16, 3), W, 2.2) + `<circle cx="9" cy="6" r="3" fill="${SHU}"/>`, .3),
  faces: [F(0, -72, 16, 'ten')], kanji: [0, -30, 16] }));
N('黒', 'la aldea de 里 tiznada por el fuego de 火: negro', 112, t => { const b = base('里', t); return { ...b, fill: '#4A3A34',
  front: b.front.replace(T.earth.d, '#3A2E2A') + `<g class="k2-float">${flameP(-40, -24, 1.2)}${flameP(44, -22, 1.1)}</g>` + `<g class="k2-float b">${P(circ(26, -110, 7), '#8A7F78', 2)}${P(circ(38, -120, 5), '#8A7F78', 2)}</g>` }; });
N('理', 'la aldea de 里 con la corona de 王: todo en su lugar, con razón', 116, t => { const b = base('里', t); return { ...b, front: b.front + crown(0, -110, .9) }; });
N('重', 'el cuerpo de 里 carga en la cabeza la cruz de 千 y suda: ¡qué pesado!', 124, t => { const b = base('里', t); return { ...b,
  back: `<g transform="translate(0 -110) scale(.62)">${P(base('十', T.metal).body, T.metal.f, 4)}</g>`,
  front: b.front + sweat(-52, -86) + sweat(52, -80),
  faces: [F(0, -84, 14, 'ten', { expr: 'triste', fix: true })] }; });

// Números y personas
N('三', 'tres troncos de 一 apilados que hacen equilibrio', 96, t => { const o = base('一', t).body; return { body: `${tr(o, .88, .88, 0, -6)} ${tr(o, .7, .7, 6, -34)} ${tr(o, .56, .56, -4, -56)}`,
  back: legs([-28, 26], t) + sweat(40, -82),
  faces: [F(-14, -26, 10, 'ten'), F(-2, -50, 9, 'hane', { fix: true, expr: 'sorpresa' }), F(-12, -70, 9, 'maru', { fix: true })], kanji: [30, -22, 12] }; });
N('半', 'los troncos de 二 partidos en dos mitades por el palo de 丨', 96, t => { const o = base('二', t).body; return { body: `${tr(o, 1, 1, -6, 0)}`,
  back: legs([-26, 22], t) + Ln('M2,-72 V4', WOOD, 3.6, 2.4) + `<g transform="translate(2 -72)">${P('M0,0 L-8,-12 M0,0 L8,-12', GOLD, 2.4)}${P(circ(-9, -13, 3.4), GOLD, 1.8)}${P(circ(9, -13, 3.4), GOLD, 1.8)}</g>`,
  faces: [F(-20, -24, 10, 'ten'), F(-16, -48, 9, 'hane', { fix: true })], kanji: [22, -22, 12] }; });
N('元', 'las tablas de 二 dan un salto sobre las piernas de 儿: con energía', 100, t => { const o = base('一', t).body; return { body: `${tr(o, .84, .84, 0, -22)} ${tr(o, .62, .62, -4, -50)}`,
  back: strip(-16, -26, -28, 0, t.d, 10) + strip(16, -26, 28, -4, t.d, 10),
  front: `<g class="k2-float">${star(-50, -70, .6)}${star(52, -62, .5)}</g>`,
  faces: [F(-14, -40, 10, 'ten', { expr: 'feliz', fix: true }), F(-10, -64, 9, 'maru', { fix: true })], kanji: [26, -38, 12] }; });
N('百', 'el sol blanco de 白 salta con el tablón de 一: ¡cien puntos!', 112, t => { const b = base('白', t); return { ...b,
  back: b.back.replace(legs([-14, 14], t), '') + strip(-12, -10, -22, 4, t.d, 10) + strip(12, -10, 22, 4, t.d, 10),
  front: b.front + plank(0, -88, 60, T.earth) }; });
N('夫', 'la persona de 人, ya adulta, con las dos horquillas de 二 en el moño', 112, t => { const b = base('人', t); return { ...b,
  back: P(circ(0, -94, 9), '#3A2E3A', 2.4),
  front: Ln('M-16,-96 H16 M-14,-90 H14', GOLD, 2.6, 2) + P(circ(17, -96, 2.6), SHU, 1.4) + P(circ(15, -90, 2.6), SHU, 1.4),
  faces: [F(0, -72, 8, 'tome', { es: .72, brow: true })] }; });
N('会', 'dos personas de 人 se encuentran sobre el banco de 二', 104, t => { const b = base('人', t); return { body: `${tr(b.body, .9, .9, -22, -12)} ${tr(b.body, .72, .72, 26, -12)}`,
  mid: cord(-22, -61) + cord(26, -52),
  front: plank(0, -2, 100, T.earth),
  faces: [F(-22, -77, 8, 'ten', { es: .72, expr: 'feliz', fix: true }), F(26, -64, 8, 'maru', { es: .72, fix: true, expr: 'feliz' })], kanji: [-22, -48, 12] }; });
N('住', 'el dueño de 主 sentado en su almohadón con las piernas de 人 cruzadas: vive aquí', 112, t => { const b = base('主', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -10), back: `<g transform="translate(0 -10)">${b.back.replace(legs([-14, 14], t), '')}</g>` + P(ell(0, -6, 54, 9), SHU, 2.6),
  mid: '', front: `<g transform="translate(0 -10)">${b.front}</g>` + P('M-30,-14 C-20,-4 20,-4 30,-14 C18,-12 -18,-12 -30,-14Z', t.d, 2.4),
  faces: [F(0, -56, 13, 'tome', { brow: true })], kanji: [0, -32, 14] }; });
N('何', 'la caja de 可 sobre las piernas de 人, con la cabeza ladeada: ¿qué?', 112, t => { const b = base('可', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -12), back: `<g transform="translate(0 -12) rotate(-8 0 -40)">${b.back.replace(legs([-20, 20], t), '')}</g>` + pLegs(t, -18, 8, 16),
  mid: `<g transform="translate(0 -12)">${b.mid}</g>`, faces: [F(0, -71, 18, 'hane', { mouth: false, expr: 'sorpresa', fix: true })], kanji: [0, -24, 13] }; });

// Lo que viene de 米, 自, 口, 女, 主, 走
N('来', 'el grano de 米 viene en la patineta de 一', 112, t => { const b = base('米', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -16), back: '',
  mid: '', front: `<g transform="translate(0 -16)">${b.front}</g>` + P(rrect(-44, -16, 88, 9, 4.5), T.earth.f, 2.6) + wheel(-28, -5, 6, T.metal) + wheel(28, -5, 6, T.metal) + spd(-56, -50, t.d),
  faces: [F(0, -72, 13, 'harai', { expr: 'feliz', fix: true })], kanji: [0, -42, 15] }; });
N('料', 'el grano de 米 con el cucharón de 斗 al hombro: mide su parte', 108, t => { const b = base('米', t); return { ...b,
  back: b.back + `<g transform="translate(30 -66) rotate(36)">${P(rrect(-3, -4, 6, 46, 3), WOOD, 2.2)}${P(ell(0, -10, 13, 10), WOODL, 2.4)}</g>` }; });
N('首', 'el ojo y la nariz de 自 sobre un cuello largo, con dos pelitos de 丷', 124, t => { const b = base('自', t); return { ...b,
  body: `${tr(b.body, .9, .9, 0, -22)} ${rrect(-12, -32, 24, 28, 8)}`,
  back: b.back.replace(legs([-12, 12], t), '') + Ln('M-8,-112 C-12,-120 -10,-126 -4,-128 M8,-112 C12,-120 10,-126 4,-128', t.d, 3, 2.4) + legs([-10, 10], t),
  mid: P(ell(0, -58, 4.5, 3.6), t.d, 2), faces: [F(0, -76, 0, 'maru', { es: 2, mouth: false })], kanji: [0, -18, 11] }; });
N('夏', 'el ojo de 自 con sombrero de paja de 一 y los pies de 夂: va a la playa', 110, t => { const b = base('自', t); return { ...b,
  back: b.back.replace(legs([-12, 12], t), '') + strip(-10, -8, -22, 2, t.d, 10) + strip(10, -8, 18, 4, t.d, 10),
  front: P('M-46,-86 C-30,-80 30,-80 46,-86 C40,-94 24,-96 18,-96 C16,-110 -16,-110 -18,-96 C-24,-96 -40,-94 -46,-86Z', GOLD, 2.6) + P('M-18,-96 C-12,-92 12,-92 18,-96 L18,-92 C12,-88 -12,-88 -18,-92Z', SHU, 1.6) }; });
N('言', 'la caja de 口 se inclina y habla: las dos líneas de 二 le salen de la boca', 112, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t),
  front: `<g class="k2-float">${Ln('M50,-50 C58,-56 66,-56 72,-50 M50,-34 C58,-40 68,-40 76,-34', t.d, 4, 2.6)}</g>` + lid(0, -76, 26, t.d) }; });
N('舌', 'la caja de 口 saca la lengua, con la plumita de 千 en la cabeza', 104, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t) + J(-14, -72, P('M0,0 C-2,-12 4,-24 16,-30 C14,-20 10,-8 4,2Z', t.d, 2.4), .3),
  mid: b.mid + P('M-8,-28 C-8,-10 8,-10 8,-28Z', SHU, 2), faces: [F(0, -59, 18, 'hane', { mouth: false, expr: 'feliz', fix: true })] }; });
N('若', 'la caja de 右 con brotes tiernos de 艸: es joven y saluda', 108, t => { const b = base('右', t); return { ...b, back: b.back + tuft(-20, -76, .42, .2) + tuft(4, -78, .42, .7) }; });
N('始', 'la mujer de 女 sube a la tarima de 台: ¡empezamos!', 120, t => { const b = base('女', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -18), back: `<g transform="translate(0 -18)">${b.back}</g>`, mid: `<g transform="translate(0 -18)">${b.mid}</g>`,
  front: P(rrect(-50, -18, 100, 18, 4), T.metal.f, 2.6) + `<g class="k2-float">${star(-50, -96, .6)}${star(52, -86, .5)}</g>`,
  faces: [F(0, -89, 7, 'tome', { es: .72, expr: 'feliz', fix: true })], kanji: [0, -34, 16] }; });
N('起', 'la señal de 走 se levanta de un salto con el resorte de 己', 118, t => { const b = base('止', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -26), mid: `<g transform="translate(0 -26)">${b.mid}</g>`,
  back: Ln('M-14,-14 L14,-10 L-14,-6 L14,-2 L-10,2', T.metal.d, 3.4, 2.4) + `<g class="k2-float">${P(`${circ(-46, -12, 9)} ${circ(-58, -6, 6)}`, T.earth.l, 2.2)}</g>`,
  front: `<g transform="translate(0 -26)">${b.front.replace(feet([-15, 15], t, 10), '')}</g>` + `<g class="k2-float">${star(-46, -100, .6)}</g>`,
  faces: [F(0, -84, 13, 'tome', { expr: 'sorpresa', fix: true })], kanji: [0, -62, 18] }; });

// Lo que viene de 内, 王, 玉, 水, 木, 大
N('肉', 'un muslo de carne con su hueso que camina con las piernas de 人', 104, t => ({ body: 'M-34,-46 C-38,-74 -14,-88 6,-84 C26,-80 40,-62 36,-40 C32,-20 14,-12 -2,-14 C-20,-16 -32,-28 -34,-46Z', fill: '#C9744A',
  back: `<g transform="translate(26 -26) rotate(40)">${P(rrect(-5, -4, 10, 26, 5), W, 2.4)}${P(`${circ(-6, 24, 6)} ${circ(6, 24, 6)}`, W, 2.4)}</g>` + pLegs(t, -18, 8, 14),
  mid: `<path class="k2-ln" d="M-24,-66 C-14,-74 0,-74 8,-70 M-28,-50 C-20,-56 -8,-56 0,-54" stroke="${T.fire.l}" stroke-width="2.4" opacity=".6" fill="none"/>`,
  faces: [F(-2, -58, 13, 'ten')], kanji: [-2, -32, 14] }));
N('病', 'la casa de 内 se siente mal: lleva la venda de 疒 y el termómetro de 一', 104, t => { const b = base('内', t); return { ...b,
  front: P('M-30,-82 L-6,-96 L0,-86 L-24,-72Z', W, 2.2) + `<path d="M-22,-86 l8,-4 M-18,-80 l8,-4" stroke="${T.fire.l}" stroke-width="1.6"/>` + `<g transform="translate(18 -48) rotate(-30)">${P(rrect(-2.5, -2, 5, 26, 2.5), W, 2)}${P(circ(0, 24, 4), SHU, 1.8)}</g>` + sweat(-52, -70),
  faces: [F(0, -60, 11, 'ten', { expr: 'triste', fix: true })] }; });
N('国', 'la joya de 玉 dentro de su muralla de 囗: el país', 112, t => { const b = base('玉', t); return { ...b,
  back: P('M-60,0 V-92 H-48 V-84 H-38 V-92 H-26 V-84 H26 V-92 H38 V-84 H48 V-92 H60 V0 H50 V-80 H-50 V0Z', T.earth.f, 3) + b.back }; });
N('海', 'la gota de 水 crece hasta ser una ola, con el moño de 毎: la madre mar', 118, t => ({ body: 'M-50,-4 C-56,-28 -46,-56 -24,-74 C-8,-88 4,-104 -6,-114 C10,-120 34,-112 42,-94 C48,-80 40,-68 30,-66 C34,-76 30,-84 22,-86 C12,-78 20,-62 34,-50 C46,-40 54,-24 50,-4Z',
  back: P(circ(-34, -92, 11), '#3A2E3A', 2.4),
  mid: `<path class="k2-ln" d="M-46,-22 C-30,-30 -14,-20 2,-26 C18,-32 34,-24 48,-28" stroke="${t.l}" stroke-width="2.4" fill="none" opacity=".8"/>`,
  front: P('M-60,-2 C-46,-10 -34,2 -20,-4 C-6,-10 6,2 20,-4 C34,-10 46,2 60,-4 L60,4 L-60,4Z', t.d, 2.4) + `<g class="k2-float">${drop(56, -80, .5, t.l)}</g>`,
  faces: [F(-6, -54, 14, 'harai')], kanji: [-6, -30, 15] }));
N('楽', 'el árbol de 木 toca el tambor blanco de 白: ¡qué divertido!', 112, t => { const b = base('木', t); return { ...b,
  front: b.front + P(ell(0, -18, 24, 12), W, 2.6) + `<path d="M-24,-18 V-8 C-24,-2 24,-2 24,-8 V-18" fill="${W}" stroke="${W}" stroke-width="2.6"/><path class="k2-ln" d="M-24,-18 L-12,-6 L0,-18 L12,-6 L24,-18" stroke="${SHU}" stroke-width="2" fill="none"/>`
    + `<g class="k2-float">${note(-50, -90, 1)}${note(52, -74, .8)}</g>` }; });
N('英', 'la persona grande de 央 con una flor de 艸: excelente', 116, t => { const b = base('央', t); return { ...b,
  front: b.front + J(18, -88, `${[0, 72, 144, 216, 288].map(a => `<g transform="rotate(${a})">${P('M0,-2 C-6,-8 -5,-14 0,-16 C5,-14 6,-8 0,-2Z', SHU, 2)}</g>`).join('')}${P(circ(0, 0, 4), GOLD, 1.6)}`, .3) }; });

// Techos, tiendas y casas
N('店', 'la caja de 占 abrió su tienda bajo el alero de 广', 112, t => { const b = base('占', t); return { ...b,
  back: b.back + P('M-56,-96 L56,-84 L54,-76 L-56,-86Z', WOOD, 2.8) + P(rrect(-60, -96, 9, 96, 3), WOOD, 2.4) + [[-30, -78], [0, -76], [30, -72]].map(([x, y]) => P(rrect(x - 6, y, 12, 16, 5), SHU, 2)).join('') }; });
N('室', 'el suelo de 至 con su flecha, bajo el techo de 宀: una sala', 104, t => { const b = base('至', t); return { ...b, front: roof(0, -82, 120) }; });
N('屋', 'el suelo de 至 bajo la cortina de 尸: la tienda', 104, t => { const b = base('至', t); return { ...b,
  front: P('M-60,-86 H60 V-76 H-60Z', WOOD, 2.6) + [-46, -24, 24, 46].map(x => P(rrect(x - 9, -76, 18, 24, 2), T.water.d, 2)).join('') }; });
N('教', 'el niño de 孝 ya enseña: señala con el puntero de 攵', 110, t => { const b = base('孝', t); return { ...b,
  back: b.back + P(rrect(-74, -84, 34, 26, 3), '#3A4A3E', 2.6) + `<path class="k2-ln" d="M-68,-76 h16 M-68,-68 h22" stroke="${W}" stroke-width="1.6"/>`,
  front: b.front + `<g transform="translate(-22 -48) rotate(-60)">${Ln('M0,0 V-36', WOOD, 2.6, 2)}${P(circ(0, -38, 3), SHU, 1.4)}</g>` }; });
N('週', 'la caja de 周 da la vuelta caminando por el camino de 辶: una semana', 104, t => { const b = base('周', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -8), back: `<g transform="translate(0 -8)">${b.back}</g>`, mid: `<g transform="translate(0 -8)">${b.mid}</g>`,
  front: road(0, 70) + spd(-60, -40, t.d),
  faces: [F(0, -67, 18, 'hane', { mouth: false })], kanji: [0, -20, 14] }; });
N('校', 'el árbol de 木 con la gorra y el banderín de 交: la escuela', 108, t => { const b = base('木', t); return { ...b,
  front: b.front + lid(0, -92, 46, GOLD) + `<g transform="translate(46 0)">${Ln('M0,0 V-56', WOOD, 3, 2)}<g class="k2-swing">${P('M0,-56 L20,-50 L0,-42Z', GOLD, 2.2)}</g></g>` }; });

// Conchas, ojos y soles
N('買', 'la concha de 貝 va de compras con su bolsa de red de 罒', 100, t => { const b = base('貝', t); return { ...b,
  back: b.back + P('M30,-60 C54,-64 62,-40 54,-22 C46,-10 30,-12 28,-24Z', 'none', 2.6).replace('fill="none"', `fill="${T.wood.l}"`) + `<path class="k2-ln" d="M34,-54 L56,-30 M42,-60 L58,-42 M32,-38 L50,-18 M54,-56 L34,-22" stroke="${T.wood.d}" stroke-width="1.6" fill="none"/>` + Ln('M28,-52 C36,-72 46,-72 50,-60', T.wood.d, 2.4, 2) }; });
N('員', 'la concha de 貝 con la boca de 口 y su gafete de empleado', 100, t => { const b = base('貝', t); return { ...b,
  mid: b.mid + mouthBox(0, -34, 20, 12), kanji: [0, -16, 11],
  front: J(30, -40, P(rrect(-8, -2, 16, 12, 2), W, 2) + `<circle cx="0" cy="4" r="2.4" fill="${SHU}"/>`, .4) }; });
N('親', 'el ojo de 見 se para sobre el tocón de 木 para cuidar de lejos: los padres', 122, t => { const b = base('見', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -22), back: `<g transform="translate(0 -22)">${b.back}</g>`,
  front: P('M-30,-22 H30 L26,0 H-26Z', WOOD, 2.6) + `<path d="${ell(0, -22, 30, 5)}" fill="${WOODL}" stroke="${W}" stroke-width="2.4" paint-order="stroke"/>` + tuft(-24, -24, .35, .4),
  faces: [F(0, -84, 0, 'ten', { es: 2.1, mouth: false })], kanji: [0, -58, 12] }; });
N('昼', 'el sol de 旦 ya subió un palmo de 尺: es mediodía', 104, t => { const b = base('旦', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -10), back: `<g transform="translate(0 -10)">${b.back}</g>` + legs([-34, 34], t),
  mid: `<g transform="translate(0 -10)">${b.mid}</g>`, front: P(rrect(52, -86, 10, 66, 2), GOLD, 2.2) + `<path class="k2-ln" d="M52,-78 h5 M52,-66 h7 M52,-54 h5 M52,-42 h7 M52,-30 h5" stroke="${GOLDT.d}" stroke-width="1.6"/>`,
  faces: [F(0, -52, 13, 'hane', { expr: 'feliz', fix: true })], kanji: [-36, -25, 11] }; });
N('暗', 'el sol de 日 se esconde detrás de 音 cuando oscurece', 104, t => { const b = base('音', t); return { ...b, fill: '#5A5A7A',
  back: sunP(30, -92, 13, { f: '#8A7F98', d: '#5A5A7A' }) + legs([-12, 12], t), front: b.front.replace(feet([-12, 12], t, 8, -1), ''),
  faces: [F(0, -66, 11, 'tome', { expr: 'dormido', fix: true })] }; });
N('都', 'el sabio de 者 en lo alto de su colina de 阝: la capital', 118, t => { const b = base('者', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -22), back: `<g transform="translate(0 -22)">${b.back}</g>`,
  mid: `<g transform="translate(0 -22)">${b.mid}</g>`, front: P('M-62,0 C-54,-28 -24,-30 0,-28 C24,-30 54,-28 62,0Z', T.wood.f, 2.6) + `<g transform="translate(0 -22)">${b.front}</g>`,
  faces: [F(0, -76, 15, 'tome', { mouth: false })], kanji: [0, -39, 12] }; });

// El sol que se despereza, la flor que se para
N('朝', 'el sol de 早 se para y se despereza con las manos de 十, mientras la luna de 月 se va a dormir', 120, t => ({ body: circ(0, -52, 34), fill: T.fire.f,
  back: rays(0, -52, [[-150, 1.12], [-120, 1.22], [-90, 1.3], [-60, 1.22], [-30, 1.12]], T.fire) + `<g transform="translate(54 -24)">${P('M8,-30 A20,20 0 1,0 8,10 A28,28 0 0,1 8,-30Z', T.water.f, 2.6)}<g transform="translate(-8 -10)">${faceSVG(F(0, 0, 4, 'ten', { es: .45, fix: true, expr: 'dormido' }), 1, false, 'B', '', T.water)}</g></g>` + zz(64, -56) + legs([-16, 16], t),
  front: J(-30, -70, hand(-4, -8, -30, .75, T.metal.l), 0, 'k2-swing') + J(30, -70, hand(4, -8, 30, .75, T.metal.l), .6, 'k2-swing'),
  faces: [F(0, -58, 14, 'maru', { expr: 'feliz', fix: true })], kanji: [0, -30, 16] }));
N('花', 'la flor se para sobre su tallo y abre las hojas de 艸 como brazos; la vuelta de 化 la hizo florecer', 124, t => ({ body: `${[0, 72, 144, 216, 288].map(a => { const r = (-90 + a) * Math.PI / 180; return circ(+(Math.cos(r) * 25).toFixed(1), +(-82 + Math.sin(r) * 25).toFixed(1), 21); }).join(' ')}`, fill: GOLD,
  back: Ln('M-46,-92 C-62,-110 -40,-132 -12,-126', t.d, 3, 2.4) + P('M-12,-126 l-8,-6 l2,10Z', t.d, 1.6) + Ln('M0,-46 V-8', t.d, 6) + stub([-10, 10], t.d, 0, 10, 10),
  mid: P(circ(0, -82, 22), t.l, 2.2),
  front: J(-4, -36, `<g transform="rotate(-20) scale(.7)">${leafL(t.f, t.l)}</g>`, 0, 'k2-swing2') + J(4, -36, `<g transform="rotate(20) scale(.7)">${leafR(t.f, t.l)}</g>`, .7, 'k2-swing2'),
  faces: [F(0, -88, 10, 'ten', { expr: 'feliz', fix: true })], kanji: [0, -71, 11] }));


// ===== Grado 4 · composición compleja: estilizado, accesorios propios, 4–5 piezas =====
N('道', 'el de 首 recorre el camino de 辶 con su mochila de viaje', 128, t => { const b = base('首', t); return { ...b,
  back: b.back + P(rrect(-44, -70, 26, 32, 7), T.fire.d, 2.6) + Ln('M-30,-70 C-30,-78 -22,-80 -18,-74', WOOD, 2.4, 2),
  front: road(0, 72) + cane(30, -2, 54) + `<g class="k2-float">${star(52, -110, .55)}</g>` }; });
N('話', 'la caja de 言 charla y charla sacando la lengua de 舌', 116, t => { const b = base('言', t); return { ...b,
  mid: b.mid + P('M-8,-28 C-8,-10 8,-10 8,-28Z', SHU, 2),
  front: b.front + `<g class="k2-float b">${Ln('M-50,-50 C-58,-56 -66,-56 -72,-50 M-50,-34 C-58,-40 -68,-40 -76,-34', t.d, 4, 2.6)}</g>` + P(`M-16,-92 C-10,-104 12,-104 16,-92Z`, SHU, 2.2),
  faces: [F(0, -59, 18, 'hane', { mouth: false, expr: 'feliz', fix: true })] }; });
N('語', 'la caja de 言 habla idiomas: sus palabras salen de colores, con el dado de 五 como insignia', 116, t => { const b = base('言', t); return { ...b,
  front: lid(0, -76, 26, t.d) + `<g class="k2-float">${Ln('M50,-56 C58,-62 66,-62 72,-56', T.fire.f, 4, 2.6)}${Ln('M50,-42 C58,-48 68,-48 76,-42', T.wood.f, 4, 2.6)}${Ln('M50,-28 C58,-34 66,-34 72,-28', T.water.f, 4, 2.6)}</g>`
    + J(-30, -40, `<g transform="scale(.32)">${P(rrect(-34, -34, 68, 68, 14), T.earth.f, 5)}${pips([[-20, -20], [20, -20], [0, 0], [-20, 20], [20, 20]], T.earth.d, 6)}</g>`, .3) }; });
N('読', 'la caja de 言 lee en voz alta el letrero del puesto de 売, con sus lentes', 116, t => { const b = base('言', t); return { ...b,
  front: lid(0, -76, 26, t.d) + `<path class="k2-ln" d="M-30,-60 h22 M8,-60 h22 M-8,-60 h16" stroke="${INK}" stroke-width="1.6" fill="none"/><circle cx="-18" cy="-59" r="10" fill="none" stroke="${INK}" stroke-width="1.8"/><circle cx="18" cy="-59" r="10" fill="none" stroke="${INK}" stroke-width="1.8"/>`
    + arm(40, -40, -140, t.d, 16, .2) + `<g transform="translate(60 -70) rotate(-12)">${P(rrect(-14, -18, 28, 34, 3), W, 2.4)}<path d="M-8,-10 h16 M-8,-2 h16 M-8,6 h10" stroke="${T.fire.d}" stroke-width="2"/></g>`,
  faces: [F(0, -59, 18, 'hane', { mouth: false })] }; });
N('漢', 'el adulto de 夫 con su manto de agua de 水 y su pincel: el que escribe los kanji', 120, t => { const b = base('夫', t); return { ...b,
  back: b.back + P('M-14,-60 C-34,-44 -40,-20 -34,0 H34 C40,-20 34,-44 14,-60Z', T.water.f, 3) + `<path class="k2-ln" d="M-30,-20 C-16,-26 -4,-16 10,-22 C20,-26 28,-20 34,-24" stroke="${T.water.l}" stroke-width="2" fill="none"/>`,
  front: b.front + brush(36, -30, 20, 1) + `<g class="k2-float">${drop(-46, -70, .45, T.water.l)}</g>` }; });
N('春', 'los troncos de 三 florecen al sol de 日: primavera', 110, t => { const b = base('三', t); return { ...b,
  back: sunP(-40, -86, 14) + b.back.replace(sweat(40, -82), ''),
  front: [[-30, -60], [24, -76], [44, -40], [-44, -30], [6, -92]].map(([x, y], i) => `<g class="k2-float${i % 2 ? ' b' : ''}"><g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<g transform="rotate(${a})">${P('M0,-1 C-4,-5 -3,-9 0,-10 C3,-9 4,-5 0,-1Z', '#F4B8C4', 1.4)}</g>`).join('')}</g></g>`).join('') }; });
N('薬', 'el árbol músico de 楽 con hierbas de 艸 y su bolsita de remedios', 118, t => { const b = base('楽', t); return { ...b,
  front: b.front + tuft(-18, -96, .45, .2) + tuft(16, -98, .45, .6) + J(44, -40, P('M-10,0 C-14,10 -12,22 0,24 C12,22 14,10 10,0Z', T.fire.d, 2.4) + `<path d="M-8,0 h16" stroke="${GOLD}" stroke-width="2.4"/>`, .5) }; });
N('絵', 'las dos personas de 会 pintan un cuadro con un pincel de hilo de 糸', 112, t => { const b = base('会', t); return { ...b,
  back: Ln('M-64,0 L-50,-80 M-36,0 L-50,-80', WOOD, 3, 2.4) + P(rrect(-74, -84, 44, 36, 3), W, 2.6) + `<path d="M-66,-60 C-58,-74 -46,-62 -38,-74" stroke="${T.wood.f}" stroke-width="4" fill="none"/>${P(circ(-44, -76, 4), SHU, 1)}`,
  front: b.front + `<g transform="translate(48 -48) rotate(20)">${P(rrect(-3, -26, 6, 24, 3), WOOD, 2)}${Ln('M0,-2 C6,6 -4,12 4,18', T.wood.f, 2.6, 2)}</g>` }; });
N('動', 'el de 重 carga su peso y saca los músculos de 力: se mueve', 126, t => { const b = base('重', t); return { ...b,
  front: b.front + J(-48, -56, `<g transform="scale(-.8 .8)">${bicep(t.d)}</g>`, 0, 'k2-swing2') + J(48, -56, `<g transform="scale(.8)">${bicep(t.d)}</g>`, .6, 'k2-swing2'),
  faces: [F(0, -84, 14, 'harai', { brow: true })] }; });
N('完', 'las tablas de 元 ya tienen su propio techo de 宀: todo completo', 116, t => { const b = base('元', t); return { ...b,
  back: roof(0, -70, 120) + b.back, front: b.front + `<g class="k2-float b">${star(0, -112, .7)}</g>` }; });

// ===== Grado 5 · composición avanzada: forma adulta y halo (el halo lo pone el kit) =====
N('院', 'la casa de 完 sobre las escaleras de 阝: una institución', 132, t => { const b = base('完', t); return { ...b,
  body: b.body.split(' M').length ? tr(b.body, 1, 1, 0, -22) : b.body,
  back: `<g transform="translate(0 -22)">${b.back}</g>` + P('M-60,0 V-12 H-40 V-22 H40 V-12 H60 V0Z', T.metal.f, 2.6),
  front: `<g transform="translate(0 -22)">${b.front}</g>`,
  faces: b.faces.map(f => ({ ...f, y: f.y - 22 })), kanji: [b.kanji[0], b.kanji[1] - 22, b.kanji[2]] }; });
N('働', 'el forzudo de 動 con las piernas de 人 y su casco de obra: trabaja', 132, t => { const b = base('動', t); return { ...b,
  front: b.front + P('M-30,-106 C-30,-130 30,-130 30,-106 L38,-102 L-38,-102Z', GOLD, 2.8) + P(rrect(-4, -128, 8, 20, 3), GOLDT.d, 2) }; });


// ===== Corrección (13 de noviembre): "solo lo que significa". Ninguna criatura suma un animal ni un objeto
// ajeno a su kanji (docs/arte/biblia.html). Estos diseños reemplazan a los anteriores. =====

// Números: la forma de sus trazos, con volumen, como 一 y 十
N('五', 'un cuerpo de cinco lados, con un punto en cada esquina para contar hasta cinco', 92, t => ({ body: 'M0,-86 C4,-86 40,-62 42,-58 C44,-54 32,-12 30,-10 C28,-6 -28,-6 -30,-10 C-32,-12 -44,-54 -42,-58 C-40,-62 -4,-86 0,-86Z',
  back: legs([-14, 14], t),
  mid: pips([[0, -78], [34, -56], [24, -16], [-24, -16], [-34, -56]], t.d, 4.6),
  faces: [F(0, -52, 13, 'ten')], kanji: [0, -28, 14] }));
N('七', 'una bolita cruzada por una banda, con la cola en gancho: así se dobla el siete', 92, t => ({ body: circ(0, -40, 32),
  back: P('M20,-14 C34,-8 40,4 54,0 C62,-2 62,-14 54,-16 C50,-10 44,-10 38,-16 C32,-22 28,-26 22,-28Z', t.d, 2.6) + legs([-12, 12], t),
  front: P(rrect(-50, -60, 100, 11, 5.5), t.d, 2.6),
  faces: [F(0, -40, 13, 'ten')], kanji: [0, -18, 13] }));
N('九', 'una bolita con la cola larga y doblada que casi da la vuelta: nueve', 96, t => ({ body: circ(-6, -40, 32),
  back: Ln('M20,-26 C38,-18 50,-30 50,-50 C50,-66 38,-74 30,-66 C24,-60 30,-52 36,-56', t.d, 7, 3) + P('M-22,-66 C-28,-80 -32,-90 -40,-96 C-30,-94 -22,-86 -14,-72Z', t.d, 2.4) + legs([-18, 6], t),
  faces: [F(-6, -42, 13, 'tome')], kanji: [-6, -20, 13] }));
N('四', 'un cuarto de cuatro paredes con dos piernitas adentro', 88, t => ({ body: rrect(-46, -78, 92, 70, 12),
  back: legs([-26, 26], t),
  mid: `<path d="${rrect(-30, -40, 60, 26, 6)}" fill="${t.d}" opacity=".55"/>` + strip(-6, -36, -14, -16, t.l, 8) + strip(6, -36, 14, -16, t.l, 8),
  faces: [F(0, -60, 14, 'ten')], kanji: [30, -24, 11] }));
N('万', 'ancho, ancho, con un tablón larguísimo encima: diez mil, un montón', 76, t => ({ body: ell(0, -30, 50, 26),
  back: legs([-28, -10, 10, 28], t, 0, 10),
  front: P(rrect(-60, -66, 120, 12, 6), t.d, 2.6),
  mid: pips([[-38, -34], [38, -34], [-30, -16], [30, -16]], t.l, 3),
  faces: [F(0, -34, 14, 'ten')], kanji: [0, -14, 12] }));

// Tiempo y estaciones
N('年', 'una gavilla de cosecha atada con su cordón: pasó un año', 104, t => ({ body: 'M-10,-100 C-30,-96 -40,-76 -36,-56 C-34,-46 -22,-40 -18,-36 L-22,-4 H22 L18,-36 C22,-40 34,-46 36,-56 C40,-76 30,-96 10,-100 C4,-102 -4,-102 -10,-100Z', fill: GOLD,
  back: legs([-12, 12], t),
  mid: `<path class="k2-ln" d="M-24,-88 C-20,-70 -16,-58 -12,-40 M-8,-96 V-40 M8,-96 V-40 M24,-88 C20,-70 16,-58 12,-40" stroke="${GOLDT.d}" stroke-width="1.6" opacity=".45" fill="none"/>` + P('M-20,-42 C-10,-36 10,-36 20,-42 L20,-34 C10,-28 -10,-28 -20,-34Z', SHU, 2),
  faces: [F(0, -70, 12, 'ten')], kanji: [0, -16, 11] }));
N('午', 'un reloj de sol con la sombra justo hacia abajo: es mediodía', 98, t => ({ body: circ(0, -46, 38),
  back: legs([-14, 14], t) + `<g class="k2-float">${sunP(0, -100, 10)}</g>`,
  mid: [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => `<path d="M0,-34 V-30" stroke="${t.d}" stroke-width="2.4" transform="translate(0 -46) rotate(${a})"/>`).join('') + P('M-3,-84 L3,-84 L2,-46 L-2,-46Z', t.d, 1.6),
  faces: [F(0, -48, 14, 'tome')], kanji: [0, -24, 13] }));
N('冬', 'con nieve en la cabeza, tiritando sobre el hielo: invierno', 94, t => ({ body: 'M-38,-14 C-42,-44 -30,-70 0,-70 C30,-70 42,-44 38,-14 Q36,-6 28,-6 H-28 Q-36,-6 -38,-14Z',
  back: legs([-14, 14], t),
  mid: P('M-36,-46 C-34,-66 -18,-74 0,-74 C18,-74 34,-66 36,-46 C30,-40 26,-50 20,-44 C14,-38 10,-48 4,-42 C-2,-36 -8,-46 -14,-40 C-20,-36 -26,-46 -36,-46Z', W, 2.4),
  front: P(rrect(-46, -6, 92, 8, 4), t.l, 2.4) + `<g class="k2-float">${Ln('M-54,-60 l6,6 M-48,-60 l-6,6 M-51,-62 v10 M54,-40 l6,6 M60,-40 l-6,6 M57,-42 v10', t.d, 1.8, 1.6)}</g>`,
  faces: [F(0, -38, 13, 'tome', { expr: 'triste', fix: true })], kanji: [0, -18, 11] }));
N('南', 'tibio como el sur: le brotan plantas de la cabeza y despide calor', 106, t => ({ body: 'M-38,-14 C-42,-44 -30,-74 0,-74 C30,-74 42,-44 38,-14 Q36,-6 28,-6 H-28 Q-36,-6 -38,-14Z',
  back: legs([-14, 14], t) + tuft(-14, -72, .5, .2) + tuft(14, -72, .5, .7),
  front: `<g class="k2-float">${Ln('M-50,-50 c-4,-6 4,-10 0,-16 M52,-42 c-4,-6 4,-10 0,-16', T.fire.f, 2.4, 2)}</g>`,
  faces: [F(0, -46, 13, 'harai', { expr: 'feliz', fix: true })], kanji: [0, -22, 14] }));

// Personas
N('長', 'de pelo larguísimo que flamea al viento: largo, y el más viejo, el jefe', 108, t => ({ body: 'M-28,-14 C-32,-50 -24,-84 0,-84 C24,-84 32,-50 28,-14 Q26,-6 18,-6 H-18 Q-26,-6 -28,-14Z',
  back: P('M-20,-80 C-40,-84 -58,-70 -70,-48 C-62,-50 -56,-46 -54,-40 C-46,-52 -36,-58 -26,-60Z M-24,-64 C-48,-60 -62,-40 -66,-16 C-58,-22 -50,-20 -46,-14 C-44,-30 -36,-44 -26,-48Z', t.d, 2.6) + legs([-10, 10], t),
  mid: P('M-24,-74 C-14,-90 14,-90 24,-74 C14,-80 -14,-80 -24,-74Z', t.d, 2),
  faces: [F(0, -56, 11, 'tome', { brow: true })], kanji: [0, -28, 14] }));
N('北', 'dos espalda con espalda, aguantando el frío del norte', 88, t => ({ body: `${circ(-20, -36, 26)} ${circ(20, -36, 26)}`,
  back: legs([-30, -10, 10, 30], t, 0, 10),
  mid: `<path d="M0,-60 V-12" stroke="${t.d}" stroke-width="2.4" opacity=".5"/>`,
  front: `<g class="k2-float">${Ln('M-60,-72 l6,6 M-54,-72 l-6,6 M-57,-74 v10 M58,-80 l6,6 M64,-80 l-6,6 M61,-82 v10', t.d, 1.8, 1.6)}</g>`,
  faces: [F(-22, -42, 8, 'tome', { es: .85 }), F(22, -42, 8, 'tome', { es: .85, fix: true })], kanji: [-20, -20, 12] }));
N('家', 'una casa con la familia asomada a la ventana', 106, t => ({ body: 'M-40,-60 L0,-96 L40,-60 V-12 Q40,-6 34,-6 H-34 Q-40,-6 -40,-12Z',
  back: legs([-18, 18], t),
  mid: `<path d="${rrect(-26, -44, 52, 22, 5)}" fill="${t.d}" opacity=".7"/>` + [[-14, -33, 6], [0, -32, 5], [14, -33, 6]].map(([x, y, r]) => P(circ(x, y, r), t.l, 1.6) + `<circle cx="${x - 2}" cy="${y - 1}" r="1" fill="${INK}"/><circle cx="${x + 2}" cy="${y - 1}" r="1" fill="${INK}"/>`).join(''),
  faces: [F(0, -64, 12, 'ten')], kanji: [26, -16, 10] }));
N('弟', 'el hermanito, con el arco de juguete que se ve en su kanji', 92, t => ({ body: `${circ(0, -40, 30)}`,
  back: Ln('M-30,-74 C-50,-56 -50,-24 -30,-6', WOOD, 3.4, 2.4) + Ln('M-30,-74 L-30,-6', W, 1.4, 0) + legs([-12, 12], t),
  faces: [F(0, -46, 12, 'hane')], kanji: [0, -22, 13] }));
N('先', 'va por delante de todos, inclinado hacia adelante', 98, t => ({ body: 'M-36,-32 C-36,-60 -14,-78 10,-76 C28,-74 42,-60 52,-42 C42,-38 38,-28 36,-22 C30,-10 18,-6 0,-6 C-24,-6 -36,-16 -36,-32Z',
  back: strip(4, -12, 18, 2, t.d, 10) + strip(-14, -12, -4, 2, t.d, 10),
  front: spd(-48, -42, t.d),
  faces: [F(4, -48, 12, 'harai')], kanji: [0, -24, 14] }));
N('私', 'mi propia espiga de arroz, que me abrazo: yo', 102, t => ({ body: 'M0,-84 C22,-84 32,-58 32,-40 C32,-18 18,-6 0,-6 C-18,-6 -32,-18 -32,-40 C-32,-58 -22,-84 0,-84Z',
  back: legs([-12, 12], t) + J(0, -82, Ln('M0,0 C-2,-8 2,-14 6,-20', T.wood.d, 2.6, 2) + [0, 1, 2].map(i => P(ell(6 + i * 2, -22 - i * 7, 4, 6), GOLD, 1.8)).join(''), .3),
  faces: [F(0, -56, 11, 'ten', { expr: 'feliz', fix: true })], kanji: [0, -26, 14] }));
N('欠', 'bosteza con la boca bien abierta: le falta un pedacito', 82, t => ({ body: 'M34.2,-55.1 A36,36 0 1,1 11.1,-78.2 A18,18 0 0,0 34.2,-55.1Z',
  back: legs([-14, 14], t),
  faces: [F(-4, -50, 13, 'tome', { mouth: 'open' })], kanji: [-4, -22, 14] }));

// Posición y dirección
N('上', 'parado encima de la línea, señalando hacia arriba', 104, t => ({ body: circ(0, -60, 28),
  back: Ln('M0,-88 V-104', t.d, 3.2, 2.4) + P('M-8,-100 L0,-112 L8,-100Z', t.d, 2.2) + legs([-10, 10], t, -26, 8),
  front: P(rrect(-50, -28, 100, 10, 5), t.d, 2.6),
  faces: [F(0, -62, 12, 'maru')], kanji: [0, -44, 12] }));
N('下', 'colgado por debajo de la línea, señalando hacia abajo', 104, t => ({ body: circ(0, -46, 28),
  back: Ln('M0,-74 V-92', t.d, 2.6, 2) + Ln('M0,-18 V-6', t.d, 3.2, 2.4) + P('M-8,-10 L0,2 L8,-10Z', t.d, 2.2),
  front: P(rrect(-50, -100, 100, 10, 5), t.d, 2.6),
  faces: [F(0, -50, 12, 'ten', { expr: 'feliz', fix: true })], kanji: [0, -30, 12] }));
N('方', 'con su flecha en la cabeza que gira y señala hacia dónde ir', 104, t => ({ body: 'M-36,-14 C-40,-44 -30,-72 0,-72 C30,-72 40,-44 36,-14 Q34,-6 26,-6 H-26 Q-34,-6 -36,-14Z',
  back: legs([-14, 14], t),
  front: J(0, -72, `<g class="k2-swing">${Ln('M0,0 V-16', t.d, 2.6, 2)}${P('M-22,-20 L14,-20 L14,-26 L26,-16 L14,-6 L14,-12 L-22,-12Z', SHU, 2.2)}</g>`, 0, ''),
  faces: [F(0, -46, 13, 'ten')], kanji: [0, -22, 14] }));
N('入', 'una entrada en punta, abierta: pasa', 98, t => ({ body: 'M-46,-6 L-6,-92 Q0,-100 6,-92 L46,-6Z',
  back: legs([-24, 24], t),
  mid: `<path d="M-12,-6 C-12,-26 12,-26 12,-6Z" fill="${t.d}" opacity=".7"/>`,
  front: arrowP(0, -10, 0, GOLD, .55),
  faces: [F(0, -50, 11, 'ten')], kanji: [0, -30, 13] }));
N('用', 'un marco firme, siempre a mano para lo que haga falta', 94, t => ({ body: 'M-36,-74 Q-36,-80 -30,-80 H30 Q36,-80 36,-74 V-12 Q36,-6 30,-6 H-30 Q-36,-6 -36,-12Z',
  back: legs([-14, 14], t),
  mid: `<path class="k2-ln" d="M-36,-56 H36 M-36,-32 H36 M0,-80 V-6" stroke="${t.d}" stroke-width="2.4" opacity=".45" fill="none"/>`,
  faces: [F(0, -64, 13, 'ten')], kanji: [-18, -19, 11] }));
N('色', 'su papel está hecho de muchos colores', 90, t => ({ body: 'M-38,-14 C-42,-44 -30,-74 0,-74 C30,-74 42,-44 38,-14 Q36,-6 28,-6 H-28 Q-36,-6 -38,-14Z',
  back: legs([-14, 14], t),
  mid: `<path d="M-38,-62 C-24,-80 -4,-78 2,-70 C-6,-56 -26,-46 -40,-44Z" fill="${T.fire.f}" opacity=".85"/><path d="M38,-60 C26,-80 8,-78 2,-70 C10,-58 28,-52 40,-46Z" fill="${GOLD}" opacity=".85"/><path d="M-40,-20 C-30,-30 -14,-28 -8,-18 C-12,-10 -24,-6 -34,-8Z" fill="${T.wood.f}" opacity=".85"/><path d="M40,-22 C30,-32 14,-28 8,-18 C12,-10 24,-6 34,-8Z" fill="${T.water.f}" opacity=".85"/>`,
  faces: [F(0, -46, 13, 'hane')], kanji: [0, -22, 14] }));

// Compuestos que llevaban ideas ajenas
N('中', 'la caja de 口 atravesada de punta a punta por el palo de 丨', 116, t => { const b = base('口', t); return { ...b,
  back: Ln('M0,-108 V8', WOOD, 4, 2.6) + (b.back || '') + legs([-20, 20], t), front: '' }; });
N('占', 'la caja de 口 pregunta y la vara de 卜 le responde', 104, t => { const b = base('口', t); return { ...b,
  back: (b.back || '') + legs([-20, 20], t) + Ln('M-6,-72 V-106 M-6,-92 L10,-98', WOOD, 3.4, 2.4) }; });
N('者', 'el sol de 日 con la barba blanca de 耂: alguien con oficio', 100, t => { const b = base('日', t); return { ...b,
  back: b.back + legs([-14, 14], t),
  mid: beard(0, -42, .55), kanji: [0, -17, 12],
  faces: [F(0, -54, 15, 'tome', { mouth: false })] }; });
N('姉', 'la mujer de 女 frente al toldo a rayas de 市: ya va sola al mercado', 116, t => { const b = base('女', t); return { ...b,
  back: P('M-50,-90 L-44,-112 H44 L50,-90 Q44,-84 38,-90 Q32,-84 26,-90 Q20,-84 14,-90 Q8,-84 2,-90 Q-4,-84 -10,-90 Q-16,-84 -22,-90 Q-28,-84 -34,-90 Q-40,-84 -50,-90Z', SHU, 2.6) + `<path d="M-30,-110 L-32,-92 M-10,-110 L-10,-90 M10,-110 L10,-90 M30,-110 L32,-92" stroke="${W}" stroke-width="5" opacity=".85"/>` + b.back }; });
N('夜', 'la medialuna de 夕 duerme bajo el techito de 亠: es de noche', 100, t => { const b = base('夕', t); return { ...b,
  back: b.back,
  front: lid(-20, -82, 34, t.d) + zz(-62, -60) + `<g class="k2-float">${star(36, -40, .45)}</g>`,
  faces: [F(-20, -46, 10, 'tome', { expr: 'dormido', fix: true })] }; });
N('交', 'el papá de 父 con su sombrero de 亠, cruzando las piernas', 100, t => { const b = base('父', t); return { ...b,
  back: strip(-12, -14, 10, 4, t.d, 10) + strip(12, -14, -10, 4, t.d, 10),
  front: lid(0, -74, 46, GOLD) }; });
N('洗', 'la gota de 水 se lava con espuma y se inclina hacia adelante como 先', 116, t => { const b = base('水', t); return { ...b,
  back: b.back + [[-24, -104, 10], [-8, -112, 12], [10, -106, 10]].map(([x, y, r]) => P(circ(x, y, r), W, 2.4)).join('') + legs([-14, 14], t),
  front: b.front + spd(-52, -40, t.d) }; });
N('来', 'el grano de 米 llega a la mesa de 一: todos vienen', 112, t => { const b = base('米', t); return { ...b,
  body: tr(b.body, 1, 1, 0, -16), back: legs([-12, 12], t, -16, 10),
  front: `<g transform="translate(0 -16)">${b.front}</g>` + plank(0, -6, 96, T.earth) + spd(-56, -60, t.d),
  faces: [F(0, -72, 13, 'harai', { expr: 'feliz', fix: true })], kanji: [0, -42, 15] }; });
N('夏', 'el ojo de 自 arrastra los pies de 夂 bajo el sol: qué calor', 110, t => { const b = base('自', t); return { ...b,
  back: b.back.replace(legs([-12, 12], t), '') + strip(-10, -8, -22, 2, t.d, 10) + strip(10, -8, 18, 4, t.d, 10),
  front: sweat(-46, -70) + sweat(46, -56) + `<g class="k2-float">${Ln('M-30,-112 c-4,-6 4,-10 0,-16 M30,-112 c-4,-6 4,-10 0,-16', T.fire.f, 2.4, 2)}</g>` }; });
N('道', 'la cabeza de 首 avanza por el camino de 辶', 124, t => { const b = base('首', t); return { ...b,
  back: b.back.replace(legs([-10, 10], t), '') + strip(-6, -4, -16, 6, t.d, 10) + strip(6, -4, 14, 8, t.d, 10),
  front: road(4, 72) + spd(-56, -60, t.d) }; });
N('語', 'la caja de 言 dice lo mismo de cinco maneras: un idioma', 116, t => { const b = base('言', t); return { ...b,
  front: lid(0, -76, 26, t.d) + `<g class="k2-float">${Ln('M50,-60 C58,-66 66,-66 72,-60', T.fire.f, 4, 2.6)}${Ln('M50,-46 C58,-52 68,-52 76,-46', T.wood.f, 4, 2.6)}${Ln('M50,-32 C58,-38 66,-38 72,-32', T.water.f, 4, 2.6)}</g>`
    + `<g class="k2-float b">${Ln('M-50,-52 C-58,-58 -66,-58 -72,-52', GOLD, 4, 2.6)}${Ln('M-50,-38 C-58,-44 -68,-44 -76,-38', SHU, 4, 2.6)}</g>` }; });
N('読', 'la caja de 言 lee en voz alta el letrero del puesto de 売', 116, t => { const b = base('言', t); return { ...b,
  front: lid(0, -76, 26, t.d) + arm(40, -40, -140, t.d, 16, .2) + `<g transform="translate(60 -70) rotate(-12)">${P(rrect(-14, -18, 28, 34, 3), W, 2.4)}<path d="M-8,-10 h16 M-8,-2 h16 M-8,6 h10" stroke="${T.fire.d}" stroke-width="2"/></g>` }; });
N('町', 'la hoja de 田 doblada en cuatro junto al poste de 丁: una cuadra del pueblo', 112, t => ({ body: juB(1, -6),
  back: legs([-20, 20], t),
  mid: juF(1, -6),
  front: Ln('M66,0 V-80', T.metal.d, 3.4, 2.4) + P(rrect(50, -88, 32, 9, 4), T.metal.d, 2.4),
  faces: [F(0, -76, 14, 'ten')], kanji: [0, -36, 15] }));


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
  const faces = x.faces.map((f, i) => `<!--f-->${faceSVG(f, def.mascot ? 1 : g, i === 0 && !def.mascot, 'B', ex, t)}<!--/f-->`).join('');
  const spark = gold ? `<g class="k2-float">${star(-60, -120, .8)}${star(62, -70, .6)}</g>` : '';
  const kt = [(kx * s + 84).toFixed(1), (ky * s + 158).toFixed(1), (ks * s).toFixed(1)].join(',');
  return `<svg viewBox="-84 -158 168 168" class="kj-svg kj2"${def.mascot ? '' : ` data-kt="${kt}"`} aria-label="${k}">
    <defs><clipPath id="${id}c"><path d="${x.body}"/></clipPath></defs>
    <g transform="scale(${s.toFixed(3)})"><g class="k2-whole">${halo}<g class="k2-idle k2-idle-${def.t}">
      ${x.back || ''}${sheets}
      <path d="${x.body}" fill="${fill}" stroke="${W}" stroke-width="5.5" stroke-linejoin="round" paint-order="stroke"/>
      <g clip-path="url(#${id}c)">
        ${def.mascot ? '' : `<!--k--><ellipse cx="${kx}" cy="${ky}" rx="${(ks * .95).toFixed(1)}" ry="${(ks * .8).toFixed(1)}" fill="${t.l}" opacity=".95"/><!--/k-->`}
        ${shine}
        <rect x="0" y="-195" width="120" height="205" fill="${INK}" opacity=".11"/>
        <path class="k2-ln" d="M0,-195 V10" stroke="${W}" stroke-width="1" opacity=".5" fill="none"/>
        <rect x="-120" y="-195" width="240" height="205" fill="url(#k2grain)" opacity=".09" style="mix-blend-mode:multiply"/>
      </g>
      ${x.mid || ''}
      ${def.mascot ? '' : `<!--k--><text x="${kx}" y="${ky}" text-anchor="middle" dominant-baseline="central" font-family="'Yuji Syuku', serif" font-size="${ks}" fill="${INK}" transform="rotate(-4 ${kx} ${ky})">${k}</text><!--/k-->`}
      ${faces}
      ${x.front || ''}
    </g></g></g>${spark}
  </svg>`;
}
// Vista de espaldas (Arena): sin caras ni kanji
export const artBack = svg => svg.replace(/<!--f-->[\s\S]*?<!--\/f-->/g, '').replace(/<!--k-->[\s\S]*?<!--\/k-->/g, '').replace(/<text[\s\S]*?<\/text>/g, '').replace(/ data-kt="[^"]*"/, '');
