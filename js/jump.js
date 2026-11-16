// KANJŪ · jump.js — prueba «Saltar aquí» (docs/PROGRESION.md §8, tarea P-06; maqueta aprobada
// docs/propuestas/P-03-progresion.html, pantalla 11): entrada con las reglas, la prueba en el marco de la ronda
// (js/round.js, runRound con jump) y el final, aprobada o no. Si no se aprueba, no cambia nada.
import { t } from './i18n.js';
import { ic } from './icons.js';
import { tr } from './lex.js';
import { sectionById, JUMP_ERRORS } from './curriculum.js';
import { cur, runRound, jumpSkips, jumpSize, passJump, inkSVG } from './round.js';

const name = s => `${s.id} · ${tr(s.title)}`;
// «2.7, 2.8 y 2.9»; con muchas, «de 2.3 a 2.18»
const list = ids => ids.length > 3 ? t('jump.range', { a: ids[0], b: ids.at(-1) }) : new Intl.ListFormat('es', { type: 'conjunction' }).format(ids);
const blank = `<span class="rd-ink-box"><span class="rd-inkk q">？</span></span>`;

// Resuelve { book: unidad } para volver a abrir el cuaderno ahí, o null
export function jumpTest(c, target, root) {
  return new Promise(resolve => {
    const v = document.createElement('div'); v.className = 'p3-jscr';
    root.append(v);
    const leave = to => { v.remove(); resolve(to ? { book: to } : null); };
    const entry = () => {
      const s = sectionById(target), here = sectionById(cur().sec), skips = jumpSkips(target).map(x => x.id), n = jumpSize(target);
      v.hidden = false;
      v.innerHTML = `<div class="p3-jtop"><button class="x rd-x" aria-label="${t('dojo.back')}">${ic('x')}</button><p class="eyebrow">${t('jump.here')}</p>
          <h2>${name(s)}</h2><p>${t('jump.lead')}</p></div>
        <div class="p3-jbody"><ul class="p3-rules">
          <li><i>${ic('list')}</i><span><b>${t('jump.r1', { n })}</b><small>${t('jump.r1s')}</small></span></li>
          <li><i>${ic('target')}</i><span><b>${t('jump.r2', { n: JUMP_ERRORS })}</b><small>${t('jump.r2s', { n: JUMP_ERRORS + 1 })}</small></span></li>
          <li><i>${ic('refresh')}</i><span><b>${t('jump.r3')}</b><small>${t('jump.r3s', { here: name(here) })}</small></span></li>
          <li><i>${ic('lock')}</i><span><b>${t('jump.r4')}</b><small>${t('jump.r4s', { n: skips.length, list: list(skips) })}</small>
            <span class="p3-skp">${skips.slice(0, 4).map(u => `<span>${blank}${u}</span>`).join('')}${skips.length > 4 ? `<span><span class="rd-ink-box"><span class="rd-inkk p3-more">+${skips.length - 4}</span></span></span>` : ''}</span></span></li>
        </ul></div>
        <div class="p3-foot"><button class="btn ok wide" data-go>${t('jump.go')}</button><button class="btn ghost wide" data-no>${t('jump.notNow')}</button></div>`;
      v.querySelector('.x').onclick = v.querySelector('[data-no]').onclick = () => leave(target);
      v.querySelector('[data-go]').onclick = test;
    };
    const test = async () => {
      v.hidden = true;
      const res = await runRound(c, root, { jump: target });
      if (!res) return entry(); // salió de la prueba: vuelve a la entrada
      const ok = res.errors <= JUMP_ERRORS && res.total >= jumpSize(target);
      end(ok, res, ok ? passJump(target).map(x => x.id) : []);
    };
    const end = (ok, res, skipped) => {
      const s = sectionById(target), here = sectionById(cur().sec);
      v.hidden = false;
      v.innerHTML = `<div class="p3-end"><button class="x rd-x" aria-label="${t('dojo.back')}">${ic('x')}</button><p class="eyebrow">${t('jump.here')} · ${s.id}</p>${ok
        ? `<span class="p3-seal">${ic('trophy')}</span><h2>${t('jump.passT')}</h2><p>${t('jump.passS', { r: res.right, total: res.total, n: res.errors, at: name(s) })}</p>
          <div class="p3-endc"><p><b>${t('jump.book')}</b></p><div class="bk-pages">${skipped.slice(-3).map(u => `<div class="bk-page">${blank}<b>${u}</b><small>${t('jump.skippedPage')}</small></div>`).join('')}
            <div class="bk-page cur"><span class="rd-ink-box">${s.reward ? inkSVG(s.reward, 0) : blank}</span><b>${s.id}</b><small>${t('jump.startHere')}</small></div></div></div>
          <div class="p3-acts"><button class="btn ok wide" data-book="${s.id}">${t('jump.goTo', { id: s.id })}</button></div>`
        : `<span class="p3-seal no">${ic('refresh')}</span><h2>${t('jump.failT')}</h2><p>${t('jump.failS', { n: res.errors, m: JUMP_ERRORS })}</p>
          <div class="p3-endc"><div class="row">${ic('check')}<p><b>${t('jump.failB')}</b> ${t('jump.failC', { here: name(here) })}</p></div></div>
          <div class="p3-acts"><button class="btn ok wide" data-book="${here.id}">${t('jump.stay', { id: here.id })}</button><button class="btn ghost wide" data-retry>${ic('refresh')}${t('jump.retry')}</button></div>`}</div>`;
      v.querySelector('.x').onclick = () => leave(ok ? target : here.id);
      v.querySelectorAll('[data-book]').forEach(b => b.onclick = () => leave(b.dataset.book));
      v.querySelector('[data-retry]')?.addEventListener('click', entry);
    };
    entry();
  });
}
