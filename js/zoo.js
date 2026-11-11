// KANJŪ · zoo.js — MAQUETA del Zoo 動物園 (propuesta, docs/HABITATS.md).
// Adentro: vista en corte con plazas; abajo, los KANJŪ de la isla sin pistas: el jugador prueba si son animales.
import { KANJI } from './data.js';
import { creatureSVG } from './creature.js';
import { artThumb } from './paper.js';
import { S } from './state.js';
import { modal, buzz } from './main.js';

// Quiénes viven adentro y dónde (en % del corte)
const INSIDE = [
  { k: '犬', x: 18, y: 63, w: 21, zz: true },
  { k: '牛', x: 45, y: 64, w: 23 },
  { k: '鳥', x: 24, y: 27, w: 15 },
  { k: '魚', x: 82, y: 88, w: 16 },
];
const PLAZAS = 6, TOTAL = 12;
const FREE = [{ x: 20, y: 97 }, { x: 48, y: 97 }];
const inkSvg = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z"/></svg>`;

export function openZoo(o) {
  const tray = [...new Set(['猫', '毛', ...S.creatures.filter(c => c.pos && !c.egg).map(c => c.k), '馬'])].filter(k => !INSIDE.some(i => i.k === k));
  const dex = INSIDE.map(i => `<i title="${KANJI[i.k].m}">${creatureSVG(i.k)}</i>`).join('') + '<i class="q">?</i>'.repeat(TOTAL - INSIDE.length);
  const m = modal(`
    <div class="sh-head"><div class="sh-seal"><i>園</i></div><div class="sh-t"><b>Zoo</b><small>Nivel 2 · ${INSIDE.length} de ${PLAZAS} plazas · 38 墨/h</small></div>
      <button class="zoo-get" id="zGet">${inkSvg(15)}+38</button></div>
    <div class="zoo-dex-h"><b>Animales descubiertos</b><span>${INSIDE.length} / ${TOTAL}</span></div>
    <div class="zoo-dex">${dex}</div>
    <div class="zoo-stage" style="background-image:url(${artThumb('zooFondo')})">
      <img class="zoo-p" src="${artThumb('fardo')}" alt="" style="left:6%;top:56%;width:24%">
      <img class="zoo-p" src="${artThumb('fardo')}" alt="" style="left:33%;top:57%;width:24%">
      <img class="zoo-p" src="${artThumb('nido')}" alt="" style="left:14%;top:21%;width:20%">
      ${FREE.map(f => `<span class="zoo-free" style="left:${f.x}%;top:${f.y}%">Plaza libre</span>`).join('')}
      ${INSIDE.map(i => `<button class="zoo-mon" aria-label="${i.k}" style="left:${i.x}%;top:${i.y}%;width:${i.w}%">${creatureSVG(i.k, { mood: 1 })}${i.zz ? '<em>z z</em>' : ''}</button>`).join('')}
    </div>
    <h4>Tus KANJŪ en la isla <small>¿Cuál es un animal? Tócalo para llevarlo al Zoo</small></h4>
    <div class="zoo-tray">${tray.map(k => `<button data-k="${k}" aria-label="Probar ${k}">${creatureSVG(k, { mood: 1 })}</button>`).join('')}</div>
  `, 'zoo');
  m.querySelectorAll('.zoo-tray button').forEach(b => b.onclick = () => { buzz(10); tryIn(b.dataset.k); });
}

// Acierto o rechazo: equivocarse nunca cuesta nada y siempre enseña el significado
export function tryIn(k) {
  const K = KANJI[k];
  if (K.zoo) {
    modal(`<div class="zoo-res ok">
      <span class="zoo-seal">動物</span>
      <div class="zoo-big">${creatureSVG(k, { mood: 1 })}</div>
      <h3>¡Es un animal!</h3>
      <p><b class="jp">${k}</b> · ${K.kun[0] || K.on[0]} · ${K.m}<br>entró al Zoo.</p>
      <div class="zoo-dex-h"><b>Animales descubiertos</b><span>${INSIDE.length + 1} / ${TOTAL}</span></div>
      <div class="zoo-bar"><i style="width:${(INSIDE.length + 1) / TOTAL * 100}%"></i></div>
      <p class="muted">+10 墨 por el primer acierto</p>
    </div>`, 'zoo');
  } else {
    const part = k === '毛' || k === '尾';
    modal(`<div class="zoo-res no">
      <div class="zoo-big">${creatureSVG(k, { mood: 1 })}</div>
      <h3><b class="jp">${k}</b> no es un animal</h3>
      <p><b class="jp">${k}</b> (${K.kun[0] || K.on[0]}) significa <b>${K.m}</b>.${part ? ' Es parte de un animal, pero no es un animal.' : ' Vuelve a su lugar en la isla.'}</p>
      <p class="muted">Equivocarse no cuesta nada. Prueba con otro.</p>
    </div>`, 'zoo');
  }
}
