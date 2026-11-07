import { ELEMENTS, element, roots, depth } from './data.js';

// Criatura SVG procedural: cuerpo según elemento, rasgos heredados de cada raíz.
export function creatureSVG(k, { mood = 1, egg = false, gold = false } = {}) {
  if (egg) return eggSVG(element(k), gold);
  const d = depth(k), [fill, dark] = gold ? ['#ffd95e', '#b07d10'] : ELEMENTS[element(k)];
  const els = roots(k).map(element);
  const count = e => els.filter(x => x === e).length;
  const ry = 30 + d * 4, rx = 34 + d * 5, cx = 60, cy = 104 - ry;
  const top = cy - ry, square = count('earth') ? 14 : rx;
  let back = '', front = '';
  const off = (i, n) => (i - (n - 1) / 2) * 16;

  if (count('sun')) back += `<g class="kj-spin" style="transform-origin:${cx}px ${cy}px">${[...Array(10)].map((_, i) =>
    `<rect x="${cx - 3}" y="${cy - ry - 16}" width="6" height="14" rx="3" fill="#ffd866" transform="rotate(${i * 36} ${cx} ${cy})"/>`).join('')}</g>`;
  if (count('sky')) back += `<path d="M${cx - rx + 4} ${cy} q-22 -16 -20 6 q8 6 20 2Z M${cx + rx - 4} ${cy} q22 -16 20 6 q-8 6 -20 2Z" fill="#fff" stroke="${dark}" stroke-width="2"/>`;
  for (let i = 0, n = count('wood'); i < n; i++) {
    const x = cx + off(i, n);
    front += `<g class="kj-sway" style="transform-origin:${x}px ${top + 2}px"><path d="M${x} ${top + 4} v-10" stroke="#3f8f3a" stroke-width="3" stroke-linecap="round"/><path d="M${x} ${top - 6} q-12 -8 -14 2 q8 6 14 -2Z M${x} ${top - 6} q12 -10 15 0 q-8 7 -15 0Z" fill="#8ee06f" stroke="#3f8f3a" stroke-width="2"/></g>`;
  }
  for (let i = 0, n = count('fire'); i < n; i++) {
    const x = cx + off(i, n) + 2;
    front += `<path class="kj-flicker" style="transform-origin:${x}px ${top + 4}px" d="M${x} ${top + 6} q-14 -8 -4 -24 q2 8 8 8 q2 -10 -2 -16 q16 8 10 26 q-4 8 -12 6Z" fill="#ffb03b" stroke="#c33d22" stroke-width="2"/>`;
  }
  if (count('moon')) front += `<path d="M${cx + rx * .45} ${top + 6} a14 14 0 1 0 16 -16 a10 10 0 1 1 -16 16Z" fill="#e8ecff" stroke="${ELEMENTS.moon[1]}" stroke-width="2"/>`;
  if (count('power')) front += `<path d="M${cx - 16} ${top + 6} l-6 -16 l12 10Z M${cx + 16} ${top + 6} l6 -16 l-12 10Z" fill="#fff4dc" stroke="${ELEMENTS.power[1]}" stroke-width="2" stroke-linejoin="round"/>`;
  if (count('heart')) front += `<path d="M${cx - rx * .6} ${top + 10} q-14 -12 -4 -18 q6 4 8 12Z M${cx + rx * .6} ${top + 10} q14 -12 4 -18 q-6 4 -8 12Z" fill="#ff98bf" stroke="#c9497b" stroke-width="2"/>`;
  if (count('void')) front += `<ellipse cx="${cx}" cy="${top - 10}" rx="16" ry="4" fill="none" stroke="#e0b84a" stroke-width="3"/>`;
  if (count('person')) front += `<path class="kj-wave" style="transform-origin:${cx + rx - 4}px ${cy + 4}px" d="M${cx + rx - 4} ${cy + 4} q12 -4 14 -14" stroke="${ELEMENTS.person[1]}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M${cx - rx + 4} ${cy + 4} q-12 4 -12 14" stroke="${ELEMENTS.person[1]}" stroke-width="6" fill="none" stroke-linecap="round"/>`;
  if (count('voice')) front += `<path d="M${cx - rx + 2} ${cy - 4} q-14 -2 -16 -14 M${cx - rx + 2} ${cy + 2} q-16 2 -20 -6" stroke="${ELEMENTS.voice[1]}" stroke-width="3" fill="none" stroke-linecap="round" class="kj-flicker" style="transform-origin:${cx - rx}px ${cy}px"/>`;
  if (count('metal')) front += `<path d="M${cx} ${top + 2} v-16 M${cx - 8} ${top - 8} h16" stroke="${ELEMENTS.metal[1]}" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${top - 16}" r="3.5" fill="#fff" stroke="${ELEMENTS.metal[1]}" stroke-width="2"/>`;
  if (count('eye')) front += `<ellipse cx="${cx}" cy="${top + 9}" rx="7" ry="5" fill="#fff" stroke="${ELEMENTS.eye[1]}" stroke-width="2"/><circle class="kj-look" cx="${cx}" cy="${top + 9}" r="2.6" fill="#4a2a7a"/>`;
  if (count('life')) front += `<g class="kj-sway" style="transform-origin:${cx - rx * .5}px ${top + 4}px"><path d="M${cx - rx * .5} ${top + 6} q-2 -10 4 -14" stroke="#5c9a24" stroke-width="3" fill="none"/><circle cx="${cx - rx * .5 + 5}" cy="${top - 10}" r="5" fill="#fff38a" stroke="#c9a020" stroke-width="2"/></g>`;
  if (count('water')) front += `<path class="kj-flicker" style="transform-origin:${cx + rx * .4}px ${top}px" d="M${cx + rx * .4} ${top - 16} q-8 12 0 16 q8 -4 0 -16Z" fill="#bfe6ff" stroke="${ELEMENTS.water[1]}" stroke-width="2"/>`;
  if (count('thread')) front += `<path d="M${cx - rx + 6} ${top + 10} q-12 -6 -8 -18 q8 4 4 12 q-4 6 -10 2" fill="none" stroke="${ELEMENTS.thread[1]}" stroke-width="2.5" stroke-linecap="round"/>`;
  if (count('spirit')) front += `<g class="kj-flicker" style="transform-origin:${cx - rx * .4}px ${top}px"><path d="M${cx - rx * .4} ${top - 2} q-6 -8 0 -16 q6 8 0 16Z" fill="#fff3b0" stroke="#c9a020" stroke-width="1.5"/></g>`;
  if (d >= 3) back = `<circle cx="${cx}" cy="${cy}" r="${rx + 8}" fill="none" stroke="${fill}" stroke-width="3" stroke-dasharray="4 6" class="kj-spin" style="transform-origin:${cx}px ${cy}px" opacity=".8"/>` + back;
  if (d >= 4) back = `<circle cx="${cx}" cy="${cy}" r="${rx + 14}" fill="${fill}" opacity=".18"/>` + back;
  if (d >= 2) front += `<g fill="#fff6c9" stroke="${dark}" stroke-width="1.5">${[-14, 0, 14].map(o => `<path d="M${cx + o} ${top - 1} l4 -8 l4 8Z" transform="translate(-4 0)"/>`).join('')}</g>`;

  const happy = mood > .6, sad = mood < .3;
  const mouth = happy ? `<path d="M${cx - 6} ${cy + 2} q6 7 12 0" stroke="#3a2a22" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : sad ? `<path d="M${cx - 5} ${cy + 5} q5 -4 10 0" stroke="#3a2a22" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
    : `<path d="M${cx - 4} ${cy + 3} h8" stroke="#3a2a22" stroke-width="2.5" stroke-linecap="round"/>`;
  const ey = cy - ry * .32, ex = 11 + d;

  if (gold) front += `<g class="kj-spark" fill="#fff8c4"><path d="M18 30 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3Z"/><path d="M98 54 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2Z"/></g>`;
  return `<svg viewBox="0 0 120 120" class="kj-svg" aria-label="${k}">
  <ellipse class="kj-shadow" cx="${cx}" cy="108" rx="${rx * .8}" ry="5" fill="#0003"/>
  <g class="kj-body">${back}
    <rect x="${cx - rx}" y="${top}" width="${rx * 2}" height="${ry * 2}" rx="${Math.min(square + 18, rx)}" fill="${fill}" stroke="${dark}" stroke-width="3"/>
    <ellipse cx="${cx - rx * .45}" cy="${top + ry * .45}" rx="${rx * .22}" ry="${ry * .14}" fill="#fff6" />
    <circle cx="${cx}" cy="${cy + ry * .48}" r="${12 + d * 2}" fill="#fffaf0" stroke="${dark}" stroke-width="2"/>
    <text x="${cx}" y="${cy + ry * .48 + 1}" text-anchor="middle" dominant-baseline="central" font-size="${15 + d * 2}" font-weight="900" fill="#2b2018" font-family="'Zen Maru Gothic',sans-serif">${k}</text>
    <g class="kj-eyes"><ellipse cx="${cx - ex}" cy="${ey}" rx="4.5" ry="6" fill="#2b2018"/><ellipse cx="${cx + ex}" cy="${ey}" rx="4.5" ry="6" fill="#2b2018"/>
    <circle cx="${cx - ex + 1.5}" cy="${ey - 2}" r="1.6" fill="#fff"/><circle cx="${cx + ex + 1.5}" cy="${ey - 2}" r="1.6" fill="#fff"/></g>
    ${happy ? `<ellipse cx="${cx - ex - 8}" cy="${ey + 8}" rx="5" ry="3" fill="#ff6f8f66"/><ellipse cx="${cx + ex + 8}" cy="${ey + 8}" rx="5" ry="3" fill="#ff6f8f66"/>` : ''}
    ${mouth}${front}
  </g></svg>`;
}

function eggSVG(el, gold) {
  const [fill, dark] = gold ? ['#ffd95e', '#b07d10'] : ELEMENTS[el];
  return `<svg viewBox="0 0 120 120" class="kj-svg"><ellipse cx="60" cy="108" rx="26" ry="5" fill="#0003"/>
  <g class="kj-egg" style="transform-origin:60px 104px"><path d="M60 22 C88 22 92 70 92 80 C92 98 78 106 60 106 C42 106 28 98 28 80 C28 70 32 22 60 22Z" fill="#fffaf0" stroke="${dark}" stroke-width="3"/>
  <path d="M30 72 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8" stroke="${fill}" stroke-width="6" fill="none" stroke-linejoin="round"/>
  <circle cx="46" cy="44" r="6" fill="${fill}"/><circle cx="72" cy="52" r="4" fill="${fill}"/></g></svg>`;
}

// Objeto del santuario: base de piedra con su kanji y pips de nivel
export function objSVG(o, def) {
  const W = def.w * 60, H = def.h * 60;
  return `<svg viewBox="0 0 ${W} ${H}" class="obj-svg" preserveAspectRatio="xMidYMax meet">
    <rect x="4" y="${H * .18}" width="${W - 8}" height="${H * .78}" rx="12" fill="${def.col}" stroke="#2b2018" stroke-width="3"/>
    <rect x="10" y="${H * .18 + 6}" width="${W - 20}" height="8" rx="4" fill="#fff3"/>
    <text x="${W / 2}" y="${H * .58}" text-anchor="middle" dominant-baseline="central" font-size="${Math.min(W, H) * .42}" font-weight="900" fill="#fff" font-family="'Zen Maru Gothic',sans-serif">${def.k}</text>
    <g fill="#ffd866" stroke="#2b2018" stroke-width="1.5">${Array.from({ length: o.lv }, (_, i) => `<circle cx="${W / 2 + (i - (o.lv - 1) / 2) * 11}" cy="${H * .9}" r="4"/>`).join('')}</g></svg>`;
}
