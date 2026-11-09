// KANJŪ · art.js — Arte de las 101 criaturas (estilo aprobado el 9 de noviembre de 2026, docs/arte/estilo.html).
// Cada kanji tiene su propia forma y muestra solo lo que significa; el kit aplica la firma: papel, pliegue,
// kanji a pincel, ojos de papel con pupila de píldora, broche dorado y marcas de grado.
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


// ---------- Diseños de los 101 kanji: una forma por kanji, solo con lo que significa ----------
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
'晶': { t: 'fire', g: 2, m: 'cristal', r: '日+日+日', idea: 'un racimo de cristales que brillan', h: 112, draw: t => ({
  body: 'M-18,-4 L-18,-86 L0,-108 L18,-86 L18,-4Z M-46,-4 L-56,-52 L-46,-70 L-28,-60 L-20,-14Z M46,-4 L56,-50 L46,-68 L28,-58 L20,-14Z',
  mid: `<path class="k2-ln" d="M0,-108 V-80 M-18,-86 L0,-80 L18,-86 M-46,-70 L-40,-46 M46,-68 L40,-44" stroke="${W}" stroke-width="1.8" fill="none" opacity=".7"/>`,
  front: P(ell(0, -4, 52, 7), '#9A9388', 2.6) + `<g class="k2-float">${star(-56, -86, .7)}</g><g class="k2-float b">${star(58, -90, .6)}</g>`,
  faces: [F(0, -64, 9, 'maru', { es: .8 })], kanji: [0, -32, 15] }) },
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
'杏': { t: 'wood', g: 2, m: 'albaricoque', r: '木+口', idea: 'un albaricoque con su hoja', h: 94, draw: t => ({
  body: 'M0,-70 C-6,-74 -20,-76 -32,-66 C-44,-54 -42,-24 -26,-10 C-14,0 14,0 26,-10 C42,-24 44,-54 32,-66 C20,-76 6,-74 0,-70Z',
  fill: '#E9A65A',
  back: Ln('M0,-70 C1,-78 2,-84 4,-88', WOOD, 3.4) + J(4, -86, `<g transform="rotate(-10) scale(.7)">${leafR(t.f, t.l)}</g>`, .2),
  mid: Ln('M10,-68 C16,-50 18,-30 12,-10', '#C9813A', 2.2, 0),
  faces: [F(-6, -42, 13, 'ten')], kanji: [-6, -19, 15] }) },
'旦': { t: 'fire', g: 2, m: 'amanecer', r: '日+一', idea: 'el sol que asoma sobre el horizonte', h: 70, draw: t => ({
  body: 'M-38,-22 A38,38 0 0,1 38,-22 H52 Q58,-22 58,-15 Q58,-8 52,-8 H-52 Q-58,-8 -58,-15 Q-58,-22 -52,-22Z',
  back: rays(0, -22, [[-80, .7], [-50, .8], [-20, .9], [10, .9], [40, .8], [70, .7]].map(([a, l]) => [a, l]), t),
  mid: `<path d="M-58,-15 H58" stroke="${t.d}" stroke-width="2" opacity=".6"/>`,
  front: feet([-34, 34], t, 8, -4),
  faces: [F(0, -40, 13, 'hane')], kanji: [-36, -15, 11] }) },
'朋': { t: 'water', g: 2, m: 'compañero', r: '月+月', idea: 'dos lunas que se toman de la mano', h: 92, draw: t => ({
  body: 'M-6,-86 A42,42 0 1,0 -6,-6 A62,62 0 0,1 -6,-86Z M6,-86 A42,42 0 1,1 6,-6 A62,62 0 0,0 6,-86Z',
  front: P(ell(0, -46, 9, 7), t.d, 2.6) + `<g class="k2-float">${star(0, -98, .6)}</g>`,
  faces: [F(-36, -56, 8, 'ten', { es: .8 }), F(36, -56, 8, 'ten', { es: .8 })], kanji: [-36, -30, 14] }) },
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
'享': { t: 'metal', g: 2, m: 'recibir · disfrutar', r: '亠+口+子', idea: 'recibe un plato de dulces y lo disfruta', h: 108, draw: t => ({
  body: circ(0, -40, 34),
  front: J(-28, -54, `<g transform="rotate(-70)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(28, -54, `<g transform="scale(-1 1) rotate(-70)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .5)
    + `<g class="k2-float">${P('M-18,-84 H18 C16,-74 8,-70 0,-70 C-8,-70 -16,-74 -18,-84Z', WOODL, 2.6)}${P(circ(-6, -90, 6), W, 2)}${P(circ(6, -91, 6), PINK, 2)}${P(circ(0, -98, 6), '#A3D07C', 2)}</g>`,
  faces: [F(0, -44, 14, 'ten', { expr: 'feliz' })], kanji: [0, -20, 16], shine: true }) },
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
'焚': { t: 'wood', g: 3, m: 'quemar', r: '林+火', idea: 'una fogata de leños encendidos', h: 116, draw: t => ({
  body: 'M-46,0 L-14,-62 L14,-62 L46,0Z',
  fill: '#B48A5E',
  back: P('M0,-112 C10,-96 30,-86 32,-66 C34,-56 24,-50 0,-50 C-24,-50 -34,-56 -32,-66 C-30,-80 -18,-84 -12,-96 C-8,-88 -4,-88 -2,-94 C-4,-102 -2,-108 0,-112Z', T.fire.f) + P('M0,-84 C6,-76 16,-70 16,-60 C16,-54 8,-52 0,-52 C-8,-52 -16,-54 -16,-60 C-16,-68 -6,-72 0,-84Z', GLOW, 2.4),
  mid: `<path class="k2-ln" d="M-30,-30 L30,-30 M-22,-46 L22,-46" stroke="${WOOD}" stroke-width="2" fill="none"/>`,
  front: `<g class="k2-float"><g transform="translate(-44 -70) scale(.7)">${flame(T.fire.f, T.fire.l)}</g></g><g class="k2-float b"><g transform="translate(46 -80) scale(.6)">${flame(T.fire.f, T.fire.l)}</g></g>`,
  faces: [F(0, -32, 11, 'harai', { es: .9 })], kanji: [0, -10, 14] }) },
'盟': { t: 'fire', g: 3, m: 'alianza', r: '明+皿', idea: 'sol y luna se dan la mano sobre el plato', h: 104, draw: t => ({
  body: `${circ(0, -62, 30)} M-50,-26 C-46,-10 -30,-4 -16,-4 L-16,0 L16,0 L16,-4 C30,-4 46,-10 50,-26Z`,
  back: rays(0, -62, [[-150, .8], [-120, .9], [-90, .8], [-60, .9]], t),
  mid: `<path d="M0,-92 A30,30 0 0,1 0,-32Z" fill="${T.water.f}"/><path d="${ell(0, -26, 50, 5)}" fill="${T.earth.l}" stroke="${W}" stroke-width="2" paint-order="stroke"/>`,
  front: P(ell(0, -36, 10, 6), t.d, 2.6),
  faces: [F(0, -66, 13, 'tome')], kanji: [0, -14, 12] }) },
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
'喿': { t: 'metal', g: 3, m: 'piar de pájaros', r: '品+木', idea: 'pajaritos que pían en las ramas', h: 138, draw: t => ({
  body: 'M0,-96 C22,-96 32,-76 32,-50 L38,0 L-38,0 L-32,-50 C-32,-76 -22,-96 0,-96Z',
  front: J(-14, -90, Ln('M0,0 C-10,-12 -22,-16 -34,-16', WOOD, 4.5) + boxBird(-36, -16, 1, t, -1), 0) + J(14, -90, Ln('M0,0 C10,-14 22,-20 36,-22', WOOD, 4.5) + boxBird(38, -22, 1, t), 1.2) + J(0, -96, Ln('M0,0 V-20', WOOD, 4.5) + boxBird(0, -20, 1, t), 2.1)
    + J(-33, -46, P('M0,0 C-8,2 -16,8 -18,18 C-10,16 -2,10 2,4Z', t.d, 3), .3) + J(33, -46, P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3), 1.6),
  faces: [F(0, -64, 14, 'maru', { mouth: 'open' })], kanji: [0, -28, 21], shine: true }) },
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
'薪': { t: 'wood', g: 3, m: 'leña', r: '艸+新', idea: 'un atado de leña recién cortada', h: 100, draw: t => ({
  body: `${rrect(-38, -80, 20, 80, 9)} ${rrect(-19, -86, 20, 86, 9)} ${rrect(0, -82, 20, 82, 9)} ${rrect(19, -78, 20, 78, 9)}`,
  fill: '#B48A5E',
  mid: [[-28, -80], [-9, -86], [10, -82], [29, -78]].map(([x, y]) => `<path d="${ell(x, y + 4, 8, 4)}" fill="#F2DAB2"/>`).join('') + `<path class="k2-ln" d="M-38,-30 H39" stroke="${SHU}" stroke-width="3" fill="none"/>`,
  back: J(-4, -88, P('M0,0 C-4,-10 -10,-16 -16,-20 C-8,-18 -2,-12 2,-2Z', t.f, 2.4) + P('M0,0 C2,-12 6,-18 10,-22 C10,-14 8,-8 4,0Z', t.d, 2.4), 0),
  faces: [F(0, -60, 14, 'ten')], kanji: [0, -14, 15] }) },

// ===== Grado 4 =====
'操': { t: 'metal', g: 4, m: 'manejar', r: '手+喿', idea: 'mueve con hilos un pajarito de papel', h: 118, draw: t => ({
  body: circ(-6, -40, 32),
  front: J(-6, -74, P(rrect(-24, -40, 48, 6, 3), WOOD, 2.4) + P(rrect(-3, -52, 6, 30, 3), WOOD, 2.4) + `<path class="k2-ln" d="M-22,-34 L30,10 M22,-34 L44,6 M0,-22 L38,2" stroke="#8C8A96" stroke-width="1" fill="none"/>` + boxBird(40, 18, 1, t), 0)
    + J(-34, -54, `<g transform="rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, 0) + J(22, -56, `<g transform="scale(-1 1) rotate(-80)">${P('M0,0 C8,2 16,8 18,18 C10,16 2,10 -2,4Z', t.d, 3)}</g>`, .4),
  faces: [F(-6, -44, 12, 'hane')], kanji: [-6, -20, 15], shine: true }) },
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
'澡': { t: 'water', g: 4, m: 'lavar', r: '水+喿', idea: 'una ola que se lava en la tina', h: 134, draw: t => ({
  body: 'M-38,0 C-44,-30 -42,-74 -20,-96 C-8,-108 10,-114 22,-106 C34,-98 38,-86 28,-80 C22,-88 10,-88 8,-80 C26,-72 42,-50 42,-24 C42,-8 38,-2 36,0Z',
  front: P('M-45,-30 h90 l-6,30 h-78Z', WOODL, 3) + `<path class="k2-ln" d="M-44,-22 h88 M-41,-8 h82" stroke="${WOOD}" stroke-width="3" fill="none"/>` + boxBird(-18, -100, .9, T.metal, -1)
    + `<g class="k2-float">${bubble(-52, -74, 6, t)}${bubble(-60, -54, 4, t)}</g><g class="k2-float b">${bubble(54, -98, 5, t)}${bubble(60, -78, 3.5, t)}</g>`
    + J(-39, -52, P('M0,0 C-10,-4 -16,-12 -16,-22 C-8,-20 0,-12 3,-4Z', t.d, 3), 0, 'k2-swing2') + J(39, -52, P('M0,0 C10,-4 16,-12 16,-22 C8,-20 0,-12 -3,-4Z', t.d, 3), .7, 'k2-swing2'),
  faces: [F(0, -66, 15, 'ten', { expr: 'feliz' })], kanji: [0, -45, 19] }) },
'襟': { t: 'wood', g: 4, m: 'cuello (de ropa)', r: '衣+禁', idea: 'el cuello cruzado de un kimono', h: 94, draw: t => ({
  body: 'M-46,0 L-44,-70 C-40,-84 -24,-90 -14,-90 L0,-74 L14,-90 C24,-90 40,-84 44,-70 L46,0Z',
  front: P('M-14,-90 L10,-58 L20,-62 L2,-90Z', W, 2.6) + P('M14,-90 L-8,-54 L-18,-60 L0,-86Z', T.wood.l, 2.6) + P(rrect(-44, -30, 88, 8, 2), t.d, 2.2),
  faces: [F(0, -42, 14, 'tome', { es: .9 })], kanji: [0, -12, 15] }) },
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
'藻': { t: 'wood', g: 5, m: 'alga', r: '艸+澡', idea: 'un alga alta que ondula entre burbujas', h: 166, draw: t => ({
  body: 'M-8,0 C-26,-20 -32,-50 -20,-80 C-10,-104 -18,-130 -4,-158 C10,-134 22,-110 18,-86 C14,-62 28,-38 24,-16 C22,-6 12,0 -8,0Z',
  front: P(ell(-2, -2, 28, 6), '#9A9388', 2.4)
    + J(20, -96, `<g transform="rotate(-24)">${frond('#5E9E5A', t.l)}</g>`, 0) + J(24, -50, `<g transform="rotate(10)">${frond(t.d, t.l)}</g>`, 1) + J(-22, -70, `<g transform="scale(-1 1) rotate(-6)">${frond(t.d, t.l)}</g>`, 1.5) + J(-24, -30, `<g transform="scale(-1 1) rotate(20) scale(.8)">${frond('#5E9E5A', t.l)}</g>`, 2.2)
    + `<g class="k2-float">${bubble(-40, -140, 6, T.water)}${bubble(-50, -156, 4, T.water)}</g><g class="k2-float b">${bubble(40, -136, 5, T.water)}${bubble(46, -20, 4, T.water)}</g>`,
  faces: [F(-4, -112, 9, 'harai', { es: .95 })], kanji: [2, -54, 18] }) },
};

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
