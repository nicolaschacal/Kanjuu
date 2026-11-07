// KANJŪ · account.js
import { KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { $, esc, shell, toast, modal, startGame } from './main.js';

// ---------- Cuenta ----------
export function openAccount() {
  if (cloud.user) {
    const m = modal(`<h3>我 Tu cuenta</h3><p>${esc(cloud.user.email)}</p><p class="muted">Tu santuario se guarda en la nube automáticamente.</p>
      <div class="row"><button class="btn ghost" id="out">Cerrar sesión</button><button class="btn ok" id="sync">Guardar ahora</button></div>
      <button class="btn gold wide" id="aiSet">✨ ${S.aiOn ? 'Tu IA está conectada · cambiar' : 'Conectar mi IA (cuentos personalizados)'}</button>
      <h4>🔒 Seguridad</h4>
      <div class="menu-acts"><button class="btn ghost" id="chPass">Cambiar contraseña</button><button class="btn ghost" id="newCode">Nuevo código de recuperación</button><button class="btn danger" id="delAcc">Borrar mi cuenta</button></div>`);
    $('#chPass', m).onclick = () => passPrompt('Cambiar contraseña', true, async (password, newPassword) => { await cloud.account('change', { password, newPassword }); toast('Contraseña cambiada'); });
    $('#newCode', m).onclick = () => passPrompt('Nuevo código de recuperación', false, async password => { const r = await cloud.account('newcode', { password }); showRecovery(r.recovery); });
    $('#delAcc', m).onclick = () => passPrompt('Borrar mi cuenta', false, async password => {
      if (!confirm('Se borrará tu cuenta y todo tu progreso para siempre. Esto no se puede deshacer. ¿Continuar?')) return;
      await cloud.account('delete', { password }); try { localStorage.clear(); } catch {} location.reload();
    }, 'Esto borra tu cuenta, tu santuario y tu progreso de estudio de forma permanente.');
    $('#aiSet', m).onclick = () => { m.close(); openAISettings(modal, toast, shell); };
    $('#sync', m).onclick = async () => { try { await cloud.pushNow(S); toast('Partida guardada en la nube'); } catch (e) { toast(e.message); } };
    $('#out', m).onclick = async () => {
      if (!confirm('¿Cerrar sesión? Tu santuario queda guardado en tu cuenta.')) return;
      try { await cloud.pushNow(S); } catch { return toast('Sin conexión: no se pudo guardar. Probá de nuevo antes de salir.'); }
      await cloud.logout(); try { localStorage.removeItem('kanjuu.save.v1'); } catch {} location.reload();
    };
    return;
  }
  authWall();
}
export function passPrompt(title, withNew, run, warn = '') {
  const m = modal(`<h3>${title}</h3>${warn ? `<p class="r">${warn}</p>` : ''}<form class="auth"><input name="password" type="password" autocomplete="current-password" placeholder="Tu contraseña actual" required>
    ${withNew ? '<input name="newPassword" type="password" autocomplete="new-password" placeholder="Nueva contraseña (mín. 8)" minlength="8" required>' : ''}
    <p class="err r"></p><button class="btn ${warn ? 'danger' : 'ok'} wide" type="submit">Confirmar</button></form>`, 'onacct');
  const f = $('form', m);
  f.onsubmit = async e => { e.preventDefault(); try { await run(f.password.value, f.newPassword?.value); m.close(); } catch (x) { $('.err', f).textContent = x.message; } };
}
// El código de recuperación reemplaza al email: se muestra una sola vez
export function showRecovery(code) {
  return new Promise(done => {
    const m = modal(`<h3>🔑 Tu código de recuperación</h3><p>Si olvidás tu contraseña, con este código podés recuperar tu cuenta. <b>Guardalo</b> (captura de pantalla o en tus notas): no lo vamos a volver a mostrar.</p>
      <div class="rcode">${code}</div><button class="btn ghost wide" id="cp">Copiar</button><button class="btn ok wide" id="ok">Ya lo guardé</button>`, 'onacct wall');
    m.onclick = null;
    $('#cp', m).onclick = () => { navigator.clipboard?.writeText(code); toast('Código copiado'); };
    $('#ok', m).onclick = () => { m.close(); done(); };
  });
}
export function recoverForm(wall) {
  const m = modal(`<h3>🔑 Recuperar cuenta</h3><p class="muted">Usá el código de recuperación que guardaste al crear tu cuenta.</p>
    <form class="auth"><input name="email" type="email" placeholder="Email" value="${esc(cloud.lastUser() || '')}" required><input name="code" placeholder="Código (XXXX-XXXX-XXXX)" autocapitalize="characters" required>
    <input name="password" type="password" autocomplete="new-password" placeholder="Nueva contraseña (mín. 8)" minlength="8" required><p class="err r"></p><button class="btn ok wide" type="submit">Recuperar</button></form>
    <p class="muted">¿No tenés el código? Escribinos desde tu email para verificar tu identidad.</p>`, 'onacct');
  m.style.zIndex = 96;
  const f = $('form', m);
  f.onsubmit = async e => {
    e.preventDefault();
    try { const r = await cloud.auth('recover', f.email.value, '', { code: f.code.value, newPassword: f.password.value }); m.close(); wall.close(); await showRecovery(r.recovery); await syncAfterLogin(false); shell(); toast('¡Cuenta recuperada!'); setTimeout(startGame, 300); }
    catch (x) { $('.err', f).textContent = x.message; }
  };
}
// Pantalla de acceso obligatoria: no se puede cerrar sin iniciar sesión
export function authWall(note = '') {
  if (document.querySelector('.wall')) return;
  let mode = S.creatures.length || cloud.lastUser() ? 'login' : 'register';
  const m = modal(`<div class="wall-top"><div class="onb-k">漢獣</div><h2>KANJŪ</h2><p class="muted">El mundo vivo de los kanji</p></div>
    ${note ? `<p class="r">${note}</p>` : ''}
    <div class="seg"><button data-m="login" class="${mode === 'login' ? 'on' : ''}">Entrar</button><button data-m="register" class="${mode === 'register' ? 'on' : ''}">Crear cuenta</button></div>
    <form class="auth" autocomplete="on"><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="Email" value="${esc(cloud.lastUser() || '')}" required>
    <input name="password" type="password" autocomplete="${mode === 'login' ? 'current-password' : 'new-password'}" placeholder="Contraseña (mín. 8)" minlength="8" required>
    <p class="err r"></p><button class="btn ok wide" type="submit">${mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button></form>
    <button class="link" id="forgot">¿Olvidaste tu contraseña?</button>
    <p class="muted">Tu cuenta guarda tu santuario, tu colección y tu progreso de estudio en la nube.</p>`, 'onacct wall');
  $('#forgot', m).onclick = () => recoverForm(m);
  m.onclick = null;
  const f = $('form', m), sub = $('[type=submit]', f);
  m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
    mode = b.dataset.m; m.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b));
    sub.textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
    f.password.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  });
  f.onsubmit = async e => {
    e.preventDefault(); sub.disabled = true; $('.err', f).textContent = '';
    try {
      const r = await cloud.auth(mode, f.email.value, f.password.value);
      if (r.recovery) await showRecovery(r.recovery);
      await syncAfterLogin(mode === 'register');
      m.close(); shell(); aiStatus().catch(() => {});
      toast(mode === 'login' ? '¡Bienvenido de vuelta!' : '¡Cuenta creada! Bienvenido al santuario');
      setTimeout(startGame, 400);
    } catch (err) { $('.err', f).textContent = err.message; sub.disabled = false; }
  };
}
export async function syncAfterLogin(isNew) {
  cloud.setReady(false);
  const remote = isNew ? null : await cloud.pull().catch(() => null);
  if (remote?.creatures?.length) {
    const localHas = S.creatures.length && (S.savedAt || 0) > (remote.savedAt || 0);
    if (!localHas || !confirm('Este dispositivo tiene una partida más reciente que la de tu cuenta.\n\nAceptar: usar la de este dispositivo\nCancelar: usar la de la nube')) { replace(remote); initWorld(); }
    else await cloud.pushNow(S);
  } else if (S.creatures.length) await cloud.pushNow(S);
  cloud.setReady(true);
}
