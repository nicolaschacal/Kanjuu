import { ELEMENTS, element, roots, depth, typeOf } from './data.js';
import { ART } from './art.js';

// Criaturas de papel: la silueta dice el tipo 五行 (hoja, llama, roca, campana, gota), el color dice el
// elemento, el kanji va pintado con pincel en el pecho y cada raíz suma un rasgo. Borde crema de recorte.
const CREAM = '#FFF4DC', INK = '#1A1220';
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, t) => '#' + hex(a).map((v, i) => Math.round(v + (hex(b)[i] - v) * t).toString(16).padStart(2, '0')).join('');

// Formas en un lienzo de diseño de 120×130 con la base en y=124
const SHAPES = {
  wood: { head: 36, eye: [72, 16], belly: [98, 22, 17],
    body: 'M60 36 C88 36 104 58 104 84 C104 112 86 124 60 124 C34 124 16 112 16 84 C16 58 32 36 60 36Z',
    shade: 'M60 124 C34 124 16 112 16 84 C30 108 90 108 104 84 C104 112 86 124 60 124Z' },
  fire: { head: 44, eye: [76, 15], belly: [100, 20, 15],
    body: 'M60 6 C66 30 94 42 100 72 C106 104 86 126 60 126 C34 126 14 106 18 76 C21 58 34 50 40 38 C44 52 50 54 52 48 C50 32 54 18 60 6Z',
    inner: 'M60 40 C64 56 84 66 86 86 C88 108 76 118 60 118 C44 118 32 108 34 88 C36 74 46 70 50 62 C54 70 58 66 60 40Z',
    shade: 'M60 126 C34 126 14 106 18 80 C30 108 92 108 102 80 C106 106 86 126 60 126Z' },
  earth: { head: 48, eye: [82, 14], belly: [104, 20, 14],
    body: 'M14 124 C8 98 18 70 38 58 C48 42 74 40 86 54 C104 64 112 94 106 124Z',
    shade: 'M14 124 C10 110 12 100 16 92 C30 112 90 114 108 96 C110 108 108 116 106 124Z' },
  metal: { head: 30, eye: [64, 14], belly: [92, 18, 13],
    body: 'M60 30 C84 30 96 50 98 80 L104 120 L16 120 L22 80 C24 50 36 30 60 30Z',
    shade: 'M19 106 L101 106 L104 120 L16 120Z' },
  water: { head: 40, eye: [78, 15], belly: [98, 20, 15],
    body: 'M60 8 C72 38 104 62 104 88 C104 112 86 126 60 126 C34 126 16 112 16 88 C16 62 48 38 60 8Z',
    shade: 'M60 126 C34 126 16 112 16 88 C30 112 90 112 104 88 C104 112 86 126 60 126Z' },
};

export function creatureSVG(k, { mood = 1, egg = false, gold = false } = {}) {
  if (egg) return eggSVG(typeOf(k), element(k), gold);
  if (ART[k]) return artSVG(k, mood, gold);
  const d = depth(k), type = typeOf(k), sh = SHAPES[type];
  let [fill, dark] = gold ? ['#F2C94C', '#B8862A'] : ELEMENTS[element(k)];
  const shade = mix(fill, dark, .55), light = mix(fill, '#FFFFFF', .45);
  const els = roots(k).map(element), count = e => els.filter(x => x === e).length;
  const s = [.8, .86, .91, .95, .98][Math.min(d, 4)];
  const P = (x, y) => [60 + (x - 60) * s, 112 + (y - 124) * s]; // diseño → viewBox
  const id = 'kj' + [...k].map(c => c.codePointAt(0)).join('') + (gold ? 'g' : '');
  const H = sh.head, off = (i, n, w = 26) => 60 + (i - (n - 1) / 2) * w;
  let back = '', top = '', face = '';

  // Rasgo propio del tipo
  if (type === 'wood') {
    const n = Math.max(1, Math.min(3, count('wood')));
    for (let i = 0; i < n; i++) { const x = off(i, n, 34); top += `<g class="kj-sway" style="transform-origin:${x}px ${H}px"><path d="M${x} ${H - 2} C${x - 12} ${H - 26} ${x - 30} ${H - 24} ${x - 36} ${H - 12} C${x - 20} ${H - 12} ${x - 10} ${H - 6} ${x} ${H - 2}Z" fill="${light}"/><path d="M${x} ${H - 2} C${x + 10} ${H - 28} ${x + 32} ${H - 26} ${x + 38} ${H - 14} C${x + 22} ${H - 12} ${x + 10} ${H - 6} ${x} ${H - 2}Z" fill="${fill}"/></g>`; }
  }
  if (type === 'metal') top += `<circle cx="60" cy="22" r="10" fill="${shade}"/>`;
  if (type === 'earth') face += `<circle cx="38" cy="74" r="4" fill="${light}"/><circle cx="88" cy="70" r="3" fill="${light}"/><circle cx="96" cy="96" r="3.5" fill="${light}"/>`;

  // Rasgos heredados de las raíces (si no son del propio tipo)
  if (count('sun')) back += `<g class="kj-spin" style="transform-origin:60px 84px">${[...Array(10)].map((_, i) => `<path d="M56 18 L60 4 L64 18Z" fill="#F2B544" transform="rotate(${i * 36} 60 84)"/>`).join('')}</g>`;
  if (count('sky')) back += `<path d="M18 80 C-4 60 -6 86 4 96 C10 90 14 92 18 92Z M102 80 C124 60 126 86 116 96 C110 90 106 92 102 92Z" fill="#FFFFFF"/>`;
  if (count('fire') && type !== 'fire') top += `<path class="kj-flicker" style="transform-origin:60px ${H}px" d="M60 ${H + 2} C46 ${H - 4} 48 ${H - 18} 56 ${H - 28} C56 ${H - 18} 62 ${H - 16} 64 ${H - 22} C72 ${H - 12} 74 ${H - 2} 60 ${H + 2}Z" fill="#FFA24A"/>`;
  if (count('wood') && type !== 'wood') top += `<g class="kj-sway" style="transform-origin:72px ${H + 4}px"><path d="M72 ${H + 4} C70 ${H - 6} 74 ${H - 10} 78 ${H - 14}" stroke="#3F8F3A" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M78 ${H - 14} C80 ${H - 28} 96 ${H - 28} 98 ${H - 22} C90 ${H - 14} 84 ${H - 12} 78 ${H - 14}Z" fill="#8AD873"/></g>`;
  if (count('water') && type !== 'water') top += `<path class="kj-flicker" style="transform-origin:90px ${H}px" d="M90 ${H - 26} C96 ${H - 16} 98 ${H - 10} 98 ${H - 6} C98 ${H} 94 ${H + 4} 90 ${H + 4} C86 ${H + 4} 82 ${H} 82 ${H - 6} C82 ${H - 10} 84 ${H - 16} 90 ${H - 26}Z" fill="#7CC4F2"/>`;
  if (count('earth') && type !== 'earth') top += `<path d="M44 ${H + 4} C44 ${H - 8} 54 ${H - 14} 62 ${H - 12} C72 ${H - 14} 78 ${H - 6} 76 ${H + 4}Z" fill="#C98A4B"/>`;
  if (count('metal') && type !== 'metal') top += `<path d="M60 ${H + 2} V${H - 16}" stroke="#6B7A8C" stroke-width="4" stroke-linecap="round"/><circle cx="60" cy="${H - 20}" r="6" fill="#E9D27A"/>`;
  if (count('moon')) top += `<path d="M84 ${H - 4} A16 16 0 1 0 100 ${H - 24} A12 12 0 1 1 84 ${H - 4}Z" fill="#E8ECFF"/>`;
  if (count('power')) top += `<path d="M38 ${H + 8} L30 ${H - 14} L48 ${H + 2}Z M82 ${H + 8} L90 ${H - 14} L72 ${H + 2}Z" fill="#FFF4DC" stroke="${dark}" stroke-width="2" stroke-linejoin="round"/>`;
  if (count('heart')) top += `<path d="M36 ${H + 10} C20 ${H - 6} 30 ${H - 18} 40 ${H - 8} C44 ${H - 18} 54 ${H - 8} 44 ${H + 6}Z M84 ${H + 10} C100 ${H - 6} 90 ${H - 18} 80 ${H - 8} C76 ${H - 18} 66 ${H - 8} 76 ${H + 6}Z" fill="#FF98BF"/>`;
  if (count('void')) top += `<ellipse cx="60" cy="${H - 18}" rx="20" ry="5" fill="none" stroke="#E0B84A" stroke-width="4"/>`;
  if (count('person')) back += `<path class="kj-wave" style="transform-origin:100px 92px" d="M100 92 C112 88 116 78 114 70" stroke="${shade}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M20 92 C8 96 6 104 8 110" stroke="${shade}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  if (count('voice')) back += `<path class="kj-flicker" style="transform-origin:14px 80px" d="M12 70 C2 72 -2 64 0 58 M12 82 C0 86 -4 80 -6 76" stroke="${dark}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  if (count('eye')) top += `<ellipse cx="60" cy="${H + 12}" rx="8" ry="6" fill="#FFFFFF" stroke="${dark}" stroke-width="2"/><circle class="kj-look" cx="60" cy="${H + 12}" r="3" fill="${INK}"/>`;
  if (count('life')) top += `<g class="kj-sway" style="transform-origin:42px ${H + 4}px"><path d="M42 ${H + 4} C40 ${H - 6} 42 ${H - 12} 46 ${H - 16}" stroke="#5C9A24" stroke-width="3.5" fill="none"/><circle cx="47" cy="${H - 20}" r="6" fill="#FFF38A"/></g>`;
  if (count('thread')) top += `<path d="M26 ${H + 14} C14 ${H + 6} 18 ${H - 8} 28 ${H - 4} C34 ${H} 30 ${H + 8} 24 ${H + 6}" fill="none" stroke="#B57AE0" stroke-width="3.5" stroke-linecap="round"/>`;
  if (count('spirit')) top += `<path class="kj-flicker" style="transform-origin:34px ${H}px" d="M34 ${H + 2} C26 ${H - 8} 30 ${H - 18} 36 ${H - 26} C38 ${H - 16} 44 ${H - 10} 34 ${H + 2}Z" fill="#BFE3FF"/>`;

  // Cara: ojos grandes con brillo; el ánimo cambia ojos y boca
  const [ey, ex] = sh.eye, happy = mood > .85, sad = mood < .3;
  if (happy) face += `<path d="M${60 - ex - 7} ${ey + 2} Q${60 - ex} ${ey - 8} ${60 - ex + 7} ${ey + 2} M${60 + ex - 7} ${ey + 2} Q${60 + ex} ${ey - 8} ${60 + ex + 7} ${ey + 2}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round"/>`;
  else face += `<g class="kj-eyes" style="transform-origin:60px ${ey}px"><ellipse cx="${60 - ex}" cy="${ey}" rx="${sad ? 6 : 7}" ry="${sad ? 7 : 9}" fill="${INK}"/><ellipse cx="${60 + ex}" cy="${ey}" rx="${sad ? 6 : 7}" ry="${sad ? 7 : 9}" fill="${INK}"/>
    <circle cx="${60 - ex + 2}" cy="${ey - 4}" r="2.8" fill="#FFF"/><circle cx="${60 + ex + 2}" cy="${ey - 4}" r="2.8" fill="#FFF"/><circle cx="${60 - ex - 2.5}" cy="${ey + 4}" r="1.2" fill="#FFF"/><circle cx="${60 + ex - 2.5}" cy="${ey + 4}" r="1.2" fill="#FFF"/></g>`;
  if (sad) face += `<path d="M${60 - ex - 8} ${ey - 13} L${60 - ex + 6} ${ey - 9} M${60 + ex + 8} ${ey - 13} L${60 + ex - 6} ${ey - 9}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><path d="M${60 - ex - 3} ${ey + 10} C${60 - ex - 6} ${ey + 16} ${60 - ex - 3} ${ey + 20} ${60 - ex} ${ey + 20} C${60 - ex + 3} ${ey + 20} ${60 - ex + 3} ${ey + 16} ${60 - ex - 3} ${ey + 10}Z" fill="#7CC4F2"/>`;
  if (mood > .5) face += `<ellipse cx="${60 - ex - 10}" cy="${ey + 11}" rx="6" ry="3.5" fill="#F28C8C" opacity=".7"/><ellipse cx="${60 + ex + 10}" cy="${ey + 11}" rx="6" ry="3.5" fill="#F28C8C" opacity=".7"/>`;
  if (happy) face += `<path d="M55 ${ey + 12} Q60 ${ey + 17} 65 ${ey + 12}" stroke="${INK}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;

  // Aura según profundidad de composición
  let aura = '';
  if (d >= 4) aura += `<circle cx="60" cy="${P(60, 84)[1]}" r="58" fill="${fill}" opacity=".16"/>`;
  if (d >= 3) aura += `<circle class="kj-spin" style="transform-origin:60px ${P(60, 84)[1]}px" cx="60" cy="${P(60, 84)[1]}" r="54" fill="none" stroke="${fill}" stroke-width="2.5" stroke-dasharray="3 7" opacity=".9"/>`;
  const spark = gold ? `<g class="kj-spark" fill="#FFF8C4"><path d="M14 26 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3Z"/><path d="M100 46 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2Z"/></g>` : '';

  const [bx, by] = P(60, sh.belly[0]), brx = sh.belly[1] * s, bry = sh.belly[2] * s;
  return `<svg viewBox="0 0 120 120" class="kj-svg" aria-label="${k}">
  <ellipse class="kj-shadow" cx="60" cy="113" rx="${34 * s}" ry="5" fill="#140A1E2E"/>${aura}
  <g class="kj-body"><g transform="translate(60 112) scale(${s}) translate(-60 -124)">
    <defs><clipPath id="${id}"><path d="${sh.body}"/></clipPath></defs>
    <g stroke="${CREAM}" stroke-width="7" stroke-linejoin="round" paint-order="stroke">${back}${top}<path d="${sh.body}" fill="${fill}"/></g>
    <path d="${sh.shade}" fill="${shade}" clip-path="url(#${id})"/>
    ${sh.inner ? `<path d="${sh.inner}" fill="${mix(fill, '#FFE08A', .6)}"/>` : ''}
    ${type === 'water' ? `<path d="M36 70 C40 56 48 46 54 38" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>` : ''}
    ${type === 'metal' ? `<path d="M19 106 L101 106" stroke="${dark}" stroke-width="3" opacity=".5"/>` : ''}
    ${face}
  </g>
  <ellipse cx="${bx}" cy="${by}" rx="${brx}" ry="${bry}" fill="#F6EBD0"/>
  <text x="${bx}" y="${by + 1}" text-anchor="middle" dominant-baseline="central" font-size="${bry * 1.55}" fill="#2B1D16" font-family="'Yuji Syuku',serif">${k}</text>
  </g>${spark}</svg>`;
}

// Criatura ilustrada (recorte de papel): misma caja 120×120, base en y=114, sombra y respiración como la procedural
function artSVG(k, mood, gold) {
  const id = 'kja' + [...k].map(c => c.codePointAt(0)).join('') + (gold ? 'g' : '');
  const tint = gold ? `<defs><filter id="${id}"><feColorMatrix type="matrix" values=".55 .45 .1 0 .08  .45 .45 .08 0 .04  .12 .18 .12 0 0  0 0 0 1 0"/></filter></defs>` : '';
  const spark = gold ? `<g class="kj-spark" fill="#FFF8C4"><path d="M14 26 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3Z"/><path d="M100 46 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2Z"/></g>` : '';
  const tear = mood < .3 ? `<path d="M44 66 C41 72 44 76 47 76 C50 76 50 72 44 66Z" fill="#7CC4F2" stroke="#FFF" stroke-width="1.5"/>` : '';
  return `<svg viewBox="0 0 120 120" class="kj-svg" aria-label="${k}">${tint}
  <ellipse class="kj-shadow" cx="60" cy="113" rx="30" ry="5" fill="#140A1E2E"/>
  <g class="kj-body"><image href="${ART[k]}" x="6" y="4" width="108" height="110" preserveAspectRatio="xMidYMax meet"${gold ? ` filter="url(#${id})"` : ''}/>${tear}</g>${spark}</svg>`;
}

function eggSVG(type, el, gold) {
  const [fill, dark] = gold ? ['#F2C94C', '#B8862A'] : ELEMENTS[el];
  return `<svg viewBox="0 0 120 120" class="kj-svg"><ellipse class="kj-shadow" cx="60" cy="110" rx="26" ry="5" fill="#140A1E2E"/>
  <g class="kj-egg" style="transform-origin:60px 106px"><path d="M60 20 C88 20 94 68 94 80 C94 98 80 108 60 108 C40 108 26 98 26 80 C26 68 32 20 60 20Z" fill="#FFF8EA" stroke="${CREAM}" stroke-width="7" paint-order="stroke"/>
  <path d="M60 108 C40 108 26 98 26 80 C36 98 84 98 94 80 C94 98 80 108 60 108Z" fill="#E9DCC0"/>
  <path d="M28 70 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l4 -3" stroke="${fill}" stroke-width="7" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
  <circle cx="46" cy="44" r="6" fill="${fill}"/><circle cx="72" cy="52" r="4" fill="${fill}"/><circle cx="58" cy="34" r="3" fill="${dark}" opacity=".5"/></g></svg>`;
}

// Objeto del santuario (vista 2D / almacén): ficha de papel con su kanji y pips de nivel
export function objSVG(o, def) {
  const W = def.w * 60, H = def.h * 60;
  return `<svg viewBox="0 0 ${W} ${H}" class="obj-svg" preserveAspectRatio="xMidYMax meet">
    <rect x="5" y="${H * .18}" width="${W - 10}" height="${H * .76}" rx="14" fill="${def.col}" stroke="${CREAM}" stroke-width="5"/>
    <rect x="5" y="${H * .74}" width="${W - 10}" height="${H * .2}" rx="10" fill="#0003"/>
    <text x="${W / 2}" y="${H * .54}" text-anchor="middle" dominant-baseline="central" font-size="${Math.min(W, H) * .44}" fill="#FFF4DC" font-family="'Yuji Syuku',serif">${def.k}</text>
    <g fill="#F2B544" stroke="#16132A" stroke-width="1.5">${Array.from({ length: o.lv }, (_, i) => `<circle cx="${W / 2 + (i - (o.lv - 1) / 2) * 11}" cy="${H * .86}" r="4"/>`).join('')}</g></svg>`;
}
