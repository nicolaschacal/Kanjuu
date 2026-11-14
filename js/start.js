// KANJŪ · start.js — pantalla de inicio (tarea B-01, propuesta docs/propuestas/B-01-inicio.html).
// Es lo primero que se ve al abrir la app: el título mientras carga la partida y, si no hay sesión, el acceso
// (crear cuenta o entrar) en la misma pantalla. Con sesión, entra sola al santuario cuando la partida está lista.
import { S } from './state.js';
import { creatureSVG } from './creature.js';
import * as cloud from './cloud.js';
import { t } from './i18n.js';
import { showRecovery, recoverForm, syncAfterLogin } from './account.js';
import { aiStatus } from './ai.js';
import { $, esc, shell, toast, startGame, buzz } from './main.js';

const MIN_MS = 900; // el título se ve al menos este tiempo, para que no parpadee
const STARTERS = ['木', '日', '火'];
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Hasta tres KANJŪ del jugador (los de mayor nivel); si todavía no tiene, los tres primeros huevos
function cast() {
  const mine = [...new Map(S.creatures.filter(c => !c.egg).sort((a, b) => b.lv - a.lv).map(c => [c.k, c])).keys()].slice(0, 3);
  return mine.length ? mine : STARTERS;
}

export function startScreen() {
  document.getElementById('boot')?.remove();
  const el = document.createElement('div'), born = Date.now();
  el.className = 'title-scr'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'KANJŪ');
  document.body.append(el);
  let mode = 'load', form = null, note = '';

  const draw = () => {
    const ks = cast();
    el.innerHTML = `
      <div class="ts-sky"><i class="ts-moon"></i>
        <div class="ts-logo"><img class="ts-seal" src="icons/icon-512.png" alt="" width="104" height="104"><h1>KANJŪ</h1><p>${t('start.tag')}</p></div>
      </div>
      <div class="ts-hill"><div class="ts-cast">${ks.map((k, i) => `<span class="ts-c c${i}">${creatureSVG(k, { mood: 1 })}</span>`).join('')}</div></div>
      <div class="ts-low">${low()}</div>`;
    bind();
  };
  const low = () => {
    if (mode === 'load') return `<p class="ts-wait"><i class="ts-brush"></i>${t(S.creatures.length ? 'start.opening' : 'start.loading')}</p>`;
    if (mode === 'guest') return `${note ? `<p class="ts-note">${esc(note)}</p>` : ''}
      <button class="btn ok wide ts-big" data-f="register">${t('start.create')}</button>
      <button class="btn ghost wide" data-f="login">${t('start.have')}</button>
      <p class="ts-foot">${t('start.cloud')}</p>`;
    const reg = form === 'register';
    return `<form class="auth ts-form" autocomplete="on">
        <b class="ts-ft">${t(reg ? 'start.create' : 'start.enter')}</b>
        <input name="email" type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false" placeholder="${t('start.email')}" value="${esc(cloud.lastUser() || '')}" required>
        <input name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" placeholder="${t(reg ? 'start.passNew' : 'start.pass')}" minlength="8" required>
        <p class="err r" role="alert"></p>
        <button class="btn ok wide ts-big" type="submit">${t(reg ? 'start.create' : 'start.enter')}</button>
        <div class="ts-links"><button type="button" class="link" id="stBack">${t('start.back')}</button>${reg ? '' : `<button type="button" class="link" id="stForgot">${t('start.forgot')}</button>`}</div>
      </form>`;
  };
  const bind = () => {
    el.querySelectorAll('[data-f]').forEach(b => b.onclick = () => { buzz(5); form = b.dataset.f; mode = 'form'; el.classList.add('typing'); draw(); });
    const f = $('.ts-form', el); if (!f) return;
    $('#stBack', el).onclick = () => { mode = 'guest'; el.classList.remove('typing'); draw(); };
    const fg = $('#stForgot', el); if (fg) fg.onclick = () => recoverForm({ close: leave });
    f.onsubmit = async e => {
      e.preventDefault();
      const sub = $('[type=submit]', f), err = $('.err', f), reg = form === 'register';
      sub.disabled = true; err.textContent = '';
      try {
        const r = await cloud.auth(form, f.email.value.trim(), f.password.value);
        if (r.recovery) await showRecovery(r.recovery);
        await syncAfterLogin(reg);
        shell(); aiStatus().catch(() => {});
        leave(); toast(t(reg ? 'start.welcomeNew' : 'start.welcomeBack'));
        setTimeout(startGame, 400);
      } catch (x) { err.textContent = x.message; sub.disabled = false; }
    };
  };
  function leave() {
    if (!el.isConnected) return;
    if (calm()) return el.remove();
    el.classList.add('out'); setTimeout(() => el.remove(), 420);
  }
  draw();
  return {
    // Hay sesión y la partida está lista: entra sola
    enter(then) { setTimeout(() => { leave(); then?.(); }, Math.max(0, MIN_MS - (Date.now() - born))); },
    // No hay sesión: muestra crear cuenta / entrar
    auth(msg = '') { note = msg; mode = 'guest'; form = null; draw(); },
  };
}
