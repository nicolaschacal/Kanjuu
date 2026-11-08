// Primera sesión guiada: señala qué tocar y avanza con las acciones reales del jugador.
import { S, save } from './state.js';

export const emit = ev => window.dispatchEvent(new CustomEvent('kj', { detail: ev }));

const STEPS = [
  { ev: 'sheet', sel: ['.it.mon:not(.egg)'], text: 'Este es tu KANJŪ. Tocalo para conocerlo.' },
  { ev: 'pet', sel: ['#pet'], text: 'Tocalo para mimarlo ♥. Así crece su vínculo y su ánimo.' },
  { ev: 'train', sel: ['#train', '[data-g]', '.game'], text: 'Entrenalo con un desafío. Aprende su kanji y produce el doble de tinta durante 1 hora.' },
  { ev: 'harvest', sel: ['#shopBtn.claim', '#shopBtn'], text: 'Tus KANJŪ producen tinta 墨 mientras viven en el santuario. ¡Recogela!', prep: 'ink' },
  { ev: 'lesson', sel: ['.node.cur', '#acadBtn'], text: 'La Academia te enseña japonés desde cero. Hacé tu primera lección.' },
  { ev: 'trip', sel: ['[data-send]', '[data-tab=exp]'], text: 'Mandá a tu KANJŪ de viaje: puede volver con un amigo nuevo.' },
  { ev: 'end', sel: [], text: '' },
];
const REWARD = 15;
const step = () => S.tut ?? (S.creatures.length ? 99 : 0);
let bubble, target, ctx;

export function startTutorial(c) {
  ctx = c;
  if (S.tut === undefined) S.tut = S.creatures.some(x => x.hist?.length > 1) ? 99 : 0;
  window.addEventListener('kj', e => advance(e.detail));
  let raf = 0;
  new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); }).observe(document.body, { childList: true, subtree: true });
  addEventListener('resize', render);
  render();
}
function advance(ev) {
  const i = step(), st = STEPS[i];
  if (!st || st.ev !== ev) return;
  S.tut = i + 1; S.ink += REWARD; save();
  ctx.toast(`✓ Paso completado · +${REWARD} 墨`);
  const next = STEPS[S.tut];
  if (next?.prep === 'ink') S.creatures.forEach(c => { if (c.pos) { c.prodAt = Date.now() - 6 * 36e5; c.insp = Date.now() + 36e5; } });
  if (next?.ev === 'end') finish();
  setTimeout(render, 50);
}
function finish() {
  S.tut = 99; S.ink += 50; S.tickets = (S.tickets || 0) + 1; save();
  const m = ctx.modal(`<div class="result"><div class="tut-medal">卒</div><h3>¡Ya sabés jugar!</h3>
    <p>+50 墨 · +1 札 para el altar de invocación</p>
    <p class="muted">Volvé mañana y repasá en el Dojo 修: cuando domines el kanji de tu KANJŪ, va a poder <b>evolucionar</b>. Cada día tu santuario produce tinta, y la Academia tiene una meta diaria.</p>
    <button class="btn ok wide">¡A jugar!</button></div>`);
  m.querySelector('.btn').onclick = () => { m.close(); ctx.refresh(); };
}
function visible(el) { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight; }
function render() {
  const st = STEPS[step()];
  target?.classList.remove('tut-target');
  if (!st || !st.text || document.querySelector('.wall, .onbm, .evofx, .summon')) { bubble?.remove(); bubble = null; return; }
  target = st.sel.map(s => [...document.querySelectorAll(s)].find(visible)).find(Boolean);
  // Dentro de un minijuego solo se muestra el texto, sin señalar
  if (st.ev === 'train' && document.querySelector('.game')) target = null;
  if (!bubble) {
    bubble = document.createElement('div'); bubble.className = 'tut-bubble';
    bubble.innerHTML = `<p></p><button class="tut-skip">Saltar tutorial</button>`;
    bubble.querySelector('.tut-skip').onclick = () => { S.tut = 99; save(); bubble.remove(); bubble = null; target?.classList.remove('tut-target'); };
    document.body.append(bubble);
  }
  bubble.querySelector('p').innerHTML = `<b>${step() + 1}/${STEPS.length - 1}</b> ${st.text}`;
  if (target) {
    target.classList.add('tut-target');
    const r = target.getBoundingClientRect(), below = r.top < innerHeight / 2;
    bubble.style.top = below ? `${Math.min(innerHeight - 140, r.bottom + 14)}px` : 'auto';
    bubble.style.bottom = below ? 'auto' : `${Math.max(10, innerHeight - r.top + 14)}px`;
    bubble.dataset.dir = below ? 'up' : 'down';
    bubble.style.setProperty('--ax', `${Math.max(24, Math.min(r.left + r.width / 2, innerWidth - 24))}px`);
  } else { bubble.style.top = 'auto'; bubble.style.bottom = '90px'; bubble.dataset.dir = ''; }
}
