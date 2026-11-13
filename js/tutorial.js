// Primera sesión guiada: señala qué tocar y avanza con las acciones reales del jugador.
import { S, save, mastery } from './state.js';
import { KANJI, isPiece, learnGate } from './data.js';
import { t } from './i18n.js';

export const emit = ev => window.dispatchEvent(new CustomEvent('kj', { detail: ev }));

// La primera sesión ya no pasa por la Academia: huevo → mimar → entrenar → recoger tinta → primer viaje
// (vuelve con un amigo y la primera palabra) → abrir el diario → primera fusión guiada.
// sel y text pueden ser funciones: el último paso cambia según lo que le falte al jugador.
const STEPS = [
  { ev: 'sheet', sel: ['.it.mon:not(.egg)'], text: 'tut.sheet' },
  { ev: 'pet', sel: ['#pet'], text: 'tut.pet' },
  { ev: 'train', sel: ['#train', '[data-g]', '.game'], text: 'tut.train' },
  { ev: 'harvest', sel: ['#shopBtn.claim', '#shopBtn'], text: 'tut.harvest', prep: 'ink' },
  { ev: 'trip', sel: ['[data-send]', '.roster [data-id]', '[data-tab=exp]'], text: 'tut.trip' },
  { ev: 'collect', sel: ['[data-collect]:not([disabled])', '[data-collect]', '[data-tab=exp]'], text: 'tut.collect' },
  { ev: 'diary', sel: ['#toDiary', '[data-sub=diary]', '[data-tab=dex]'], text: 'tut.diary' },
  { ev: 'fuse', sel: () => fuseStep().sel, text: () => fuseStep().text },
  { ev: 'end', sel: [], text: '' },
];
const TUT_V = 2; // versión de la lista de pasos (la 1 tenía la lección de la Academia en el paso 5)
// Primera fusión: busca una receta de dos KANJŪ que el jugador ya tiene y dice qué falta para hacerla
function fuseStep() {
  const free = S.creatures.filter(c => !c.egg && !c.away);
  for (const to of Object.keys(KANJI)) for (const r of KANJI[to].recipes || []) {
    if (r.length !== 2 || r.some(isPiece)) continue;
    const pool = [...free];
    if (!r.every(k => { const i = pool.findIndex(c => c.k === k); return i >= 0 && pool.splice(i, 1); })) continue;
    const gate = learnGate(to), weak = [...new Set(r)].filter(k => mastery(k) < gate);
    if (weak.length) return { sel: ['#dojo.ready', '.it.mon:not(.egg)'], text: t('tut.fuseWeak', { a: r[0], b: r[1], to, weak: weak.map(k => `${k} ${mastery(k)}/${gate}`).join(' · ') }) };
    return { sel: ['#fuse:not([disabled])', '.recipe.have', '[data-tab=lab]'], text: t('tut.fuseGo', { a: r[0], b: r[1], to }) };
  }
  return { sel: ['[data-collect]:not([disabled])', '[data-send]', '[data-tab=exp]'], text: t('tut.fuseNone') };
}
const REWARD = 15;
const step = () => S.tut ?? (S.creatures.length ? 99 : 0);
let bubble, target, ctx;

export function startTutorial(c) {
  ctx = c;
  if (S.tut === undefined) S.tut = S.creatures.some(x => x.hist?.length > 1) ? 99 : 0;
  sync();
  window.addEventListener('kj', e => advance(e.detail));
  let raf = 0;
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', render);
  render();
}
// Partidas a mitad del tutorial viejo (también las que llegan de la nube): el paso de la Academia ya no existe, siguen desde el primer viaje
function sync() { if (S.tutV === TUT_V) return; if (S.tut !== undefined && S.tut < 99 && S.tut > 4) S.tut = 4; S.tutV = TUT_V; }
function advance(ev) {
  sync();
  const i = step(), st = STEPS[i];
  if (!st || st.ev !== ev) return;
  S.tut = i + 1; S.ink += REWARD; save();
  ctx.toast(t('tut.stepDone', { ink: REWARD }));
  const next = STEPS[S.tut];
  if (next?.prep === 'ink') S.creatures.forEach(c => { if (c.pos) { c.prodAt = Date.now() - 6 * 36e5; c.insp = Date.now() + 36e5; } });
  if (next?.ev === 'end') finish();
  setTimeout(render, 50);
}
function finish() {
  S.tut = 99; S.ink += 50; S.tickets = (S.tickets || 0) + 1; save();
  const m = ctx.modal(`<div class="result"><div class="tut-medal">卒</div><h3>${t('tut.endTitle')}</h3>
    <p>${t('tut.endReward')}</p>
    <p class="muted">${t('tut.endNote')}</p>
    <button class="btn ok wide">${t('tut.endGo')}</button></div>`);
  m.querySelector('.btn').onclick = () => { m.close(); ctx.refresh(); };
}
function visible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; }
function render() {
  sync();
  const st = STEPS[step()];
  target?.classList.remove('tut-target');
  if (!st || !st.text || document.querySelector('.wall, .onbm, .evofx, .summon')) { bubble?.remove(); bubble = null; return; }
  const sel = typeof st.sel === 'function' ? st.sel() : st.sel, text = typeof st.text === 'function' ? st.text() : t(st.text);
  target = sel.map(s => [...document.querySelectorAll(s)].find(visible)).find(Boolean);
  // Con una hoja abierta que no tiene nada que señalar (resumen de viaje, hallazgo), el globo no tapa sus botones
  if (!target && document.querySelector('#layer .modal:not(.out)')) { bubble?.remove(); bubble = null; return; }
  // Dentro de un minijuego solo se muestra el texto, sin señalar
  if (st.ev === 'train' && document.querySelector('.game')) target = null;
  if (!bubble) {
    bubble = document.createElement('div'); bubble.className = 'tut-bubble';
    bubble.innerHTML = `<p></p><button class="tut-skip">${t('tut.skip')}</button>`;
    bubble.querySelector('.tut-skip').onclick = () => { S.tut = 99; save(); bubble.remove(); bubble = null; target?.classList.remove('tut-target'); };
    document.body.append(bubble);
  }
  const html = `<b>${step() + 1}/${STEPS.length - 1}</b> ${text}`, p = bubble.querySelector('p');
  if (p.innerHTML !== html) p.innerHTML = html; // sin reescribir si no cambió: evita un bucle con el observador
  if (target) {
    target.classList.add('tut-target');
    const r = target.getBoundingClientRect(), below = r.top < innerHeight / 2;
    bubble.style.top = below ? `${Math.min(innerHeight - 140, r.bottom + 14)}px` : 'auto';
    bubble.style.bottom = below ? 'auto' : `${Math.max(10, innerHeight - r.top + 14)}px`;
    bubble.dataset.dir = below ? 'up' : 'down';
    bubble.style.setProperty('--ax', `${Math.max(24, Math.min(r.left + r.width / 2, innerWidth - 24))}px`);
  } else { bubble.style.top = 'auto'; bubble.style.bottom = '90px'; bubble.dataset.dir = ''; }
}
