// KANJŪ · main.js
import { ic } from './icons.js';
import { viewArena, ROAD, SLOTS } from './arena.js';import { KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn, setHelp } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { viewHome, harvest } from './sanctuary.js';
import { viewTrainer } from './trainer.js';
import { allDue } from './dojo.js';
import { viewLab } from './lab.js';
import { viewExp, fmt } from './trips.js';
import { viewDex, openQuests } from './atlas.js';
import { viewShop, openLogin } from './shop.js';
import { acadCtx } from './dojo.js';
import { openAccount, authWall } from './account.js';

export const $ = (s, r = document) => r.querySelector(s);
export const app = $('#app');
export const buzz = (n = 10) => navigator.vibrate?.(n);
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const sorted = a => [...a].sort().join('');
export const home = () => S.creatures.filter(c => !c.away);

export const MISSIONS = [
  { id: 'pet', label: 'Mimá a tus KANJŪ', goal: 5, ink: 8 },
  { id: 'train', label: 'Completá entrenamientos', goal: 3, ink: 12 },
  { id: 'exp', label: 'Enviá una expedición', goal: 1, ink: 8 },
  { id: 'review', label: 'Repasá kanji en el Dojo', goal: 8, ink: 15 },
  { id: 'acad', label: 'Completá 2 lecciones de la Academia', goal: 2, ink: 15 },
  { id: 'duel', label: 'Ganá 2 duelos en la Arena', goal: 2, ink: 20 },
];
export const WEEKLY = [
  { id: 'duel', label: 'Ganá 12 duelos', goal: 12, ink: 80 },
  { id: 'review', label: 'Repasá 50 kanji', goal: 50, ink: 60 },
  { id: 'disc', label: 'Descubrí 3 kanji nuevos', goal: 3, ink: 50 },
  { id: 'evo', label: 'Evolucioná o fusioná 3 veces', goal: 3, ink: 50 },
  { id: 'train', label: 'Entrená 20 veces', goal: 20, ink: 40 },
];
export const ACHIEVEMENTS = [
  ['闘', 'Primera victoria', () => (S.arena?.wins || 0) >= 1, 'Ganá un duelo', 30],
  ['城', 'Señor del castillo', () => (S.arena?.best || 0) >= 1400, 'Llegá a la Arena 5', 150],
  ['族', 'Primera familia', () => (S.fams || []).length >= 1, 'Completá una familia de kanji', 60],
  ['芽', 'Primer brote', () => S.stats.evolutions >= 1, 'Evoluciona una criatura', 20],
  ['合', 'Alquimista', () => S.stats.fusions >= 1, 'Realiza una fusión', 20],
  ['輪', 'Ciclo eterno', () => S.stats.rebirths >= 1, 'Completa un renacimiento', 40],
  ['集', 'Coleccionista', () => owned() >= 8, 'Obtén 8 kanji', 30],
  ['森', 'Guardián del bosque', () => S.dex['森']?.owned, 'Obtén 森', 30],
  ['学', 'Estudioso', () => Object.values(S.srs).filter(r => r.box >= 3).length >= 10, '10 kanji con maestría 3', 60],
  ['修', 'Disciplina', () => Object.values(S.srs).reduce((a, r) => a + r.ok, 0) >= 100, '100 repasos acertados', 60],
  ['広', 'Arquitecto', () => S.rows > 3, 'Expande el terreno', 30],
  ['召', 'Invocador', () => (S.stats.pulls || 0) >= 10, 'Invoca 10 veces', 40],
  ['富', 'Mercader de tinta', () => (S.stats.collected || 0) >= 1000, 'Recoge 1000 墨 producidos', 80],
  ['覚', 'Despertar', () => S.creatures.some(c => c.stars >= 1), 'Despierta una estrella', 40],
  ['半', 'Medio atlas', () => owned() >= Object.keys(KANJI).length / 2, 'Llena la mitad del atlas', 100],
  ['複', 'Arquitecto de kanji', () => Object.keys(S.dex).some(k => S.dex[k].owned && kLevel(k) >= 4), 'Obtén un KANJŪ de nivel 4', 120],
  ['藻', 'Maestro de la composición', () => Object.keys(S.dex).some(k => S.dex[k].owned && kLevel(k) >= 5), 'Obtén un KANJŪ de nivel 5', 250],
  ['全', 'Atlas completo', () => owned() >= Object.keys(KANJI).length, 'Llena todo el atlas', 300],
];
export const owned = () => Object.values(S.dex).filter(d => d.owned).length;

export const ui = { tab: 'home', sub: 'kan' };

// ---------- Shell ----------
// El mapa siempre queda debajo. Cada sección es una hoja con pestañas que sube sobre el mapa;
// mientras hay una hoja o un modal abierto, desaparecen el HUD y la barra inferior.
export const NAV = [['trainer', 'user', 'Entrenador'], ['lab', 'fusion', 'Fusión'], ['arena', 'swords', 'Arena'], ['exp', 'compass', 'Viajes'], ['dex', 'book', 'Atlas']];
const TITLES = { lab: 'Fusión', arena: 'Arena', exp: 'Viajes', dex: 'Atlas', shop: 'Tienda' };
export const TRAINER_TABS = [['bag', 'bag', 'Mochila'], ['kan', 'paw', 'KANJŪ'], ['me', 'user', 'Usuario']];
export function shell() {
  app.innerHTML = `
  <header class="hud">
    <button class="hud-clock" id="clock" aria-label="Momento del día y clima"><span class="clk-ic" id="clkI">${ic(phase().i)}</span><span class="clk-t"><b id="clkP">${phase().l}</b><small><span id="clkT">${clock()}</span><span id="wx" hidden> · <span id="wxT"></span></span></small></span></button>
    <div class="hud-r">
      <div class="hud-row">
        <button class="wallet-p" id="shopBtn" aria-label="Tinta y tienda"><span class="wc">${ic('ink', 'ink')}<b id="ink">${S.ink}</b></span><span class="wc">${ic('ticket', 'tix')}<b id="tix">${S.tickets}</b></span><i class="ink-dot" id="inkDot" hidden></i></button>
        <button class="gear-b" id="gearBtn" aria-label="Configuración">${ic('gear')}</button>
      </div>
      <button class="quest-card" id="questBtn" aria-label="Misiones de hoy"><span class="qc-ic">${ic('list')}</span><span class="qc-t"><b>Misiones</b><small id="questTxt"></small></span><b class="qc-n" id="questN"></b></button>
    </div>
  </header>
  <main id="view"></main>
  <div id="panel"></div>
  <nav class="tabs">${NAV.map(([id, k, l]) => `<button data-tab="${id}" class="${id === 'arena' ? 'center' : ''}"><i>${ic(k)}</i><span>${l}</span></button>`).join('')}</nav>
  <div id="layer"></div>`;
  homeOn = false;
  app.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { ui.tab = b.dataset.tab; buzz(5); go(); });
  $('#questBtn').onclick = openQuests;
  $('#shopBtn').onclick = e => totalPending() ? harvest(placed(), $('#ink')) : (ui.tab = 'shop', buzz(5), go());
  $('#gearBtn').onclick = openMenu;
  $('#clock').onclick = () => weather(true);
  new MutationObserver(covered).observe($('#layer'), { childList: true });
  weather(false);
  go();
}
let homeOn = false;
export const covered = () => app.classList.toggle('covered', ui.tab !== 'home' || !!$('#layer')?.children.length || app.classList.contains('focus'));
export function go() {
  const panel = ui.tab !== 'home';
  // El mapa sólo se vuelve a dibujar cuando está a la vista (o la primera vez)
  if (!panel || !homeOn) { const v = $('#view'); v.className = 'view v-home'; viewHome(v); homeOn = true; }
  renderPanel();
  covered(); hud();
}
export const closePanel = () => { ui.tab = 'home'; go(); };
function renderPanel() {
  const p = $('#panel'), t = ui.tab;
  if (t === 'home') {
    if (p.classList.contains('open')) { p.classList.add('out'); setTimeout(() => { if (ui.tab === 'home') { p.className = ''; p.innerHTML = ''; } }, 230); }
    return;
  }
  const fresh = !p.classList.contains('open') || p.classList.contains('out') || p.dataset.t !== t;
  const old = $('#pnBody', p), top = fresh ? 0 : old?.scrollTop || 0;
  const head = t === 'trainer'
    ? `<div class="pn-tabs">${TRAINER_TABS.map(([id, k, l]) => `<button class="${ui.sub === id ? 'on' : ''}" data-sub="${id}">${ic(k)}<span>${l}</span></button>`).join('')}</div>`
    : `<b class="pn-title">${TITLES[t]}</b>`;
  p.className = 'open' + (fresh && p.dataset.t !== t && !p.classList.contains('open') ? ' in' : '');
  p.dataset.t = t;
  p.innerHTML = `<div class="pn-card"><div class="pn-head">${head}<button class="pn-x" id="pnX" aria-label="Cerrar">${ic('x')}</button></div><div class="pn-body view v-${t}${t === 'trainer' ? ' sub-' + ui.sub : ''}" id="pnBody"></div></div>`;
  p.onclick = e => { if (e.target === p) closePanel(); };
  $('#pnX', p).onclick = closePanel;
  p.querySelectorAll('[data-sub]').forEach(b => b.onclick = () => { ui.sub = b.dataset.sub; buzz(5); go(); });
  const body = $('#pnBody', p);
  ({ lab: viewLab, exp: viewExp, arena: viewArena, shop: viewShop, dex: viewDex, trainer: viewTrainer })[t](body);
  body.scrollTop = top;
}
export function hud() {
  $('#ink').textContent = S.ink;
  const ct = $('#clkT'); if (ct) { ct.textContent = clock(); const ph = phase(); if ($('#clkP').textContent !== ph.l) { $('#clkP').textContent = ph.l; if (!wxNow) $('#clkI').innerHTML = ic(ph.i); } }
  const dot = $('#inkDot'), pend = totalPending(); if (dot) { dot.hidden = !pend; $('#shopBtn').classList.toggle('claim', !!pend); }
  rollDaily();
  const ready = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal && !S.daily.claimed.includes(m.id)).length
    + WEEKLY.filter(m => (S.weekly.p[m.id] || 0) >= m.goal && !S.weekly.claimed.includes(m.id)).length;
  $('#questN').textContent = ready || '';
  $('#questBtn').classList.toggle('hot', !!ready);
  const tix = $('#tix'); if (tix) tix.textContent = S.tickets;
  const done = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal).length;
  const qt = $('#questTxt'); if (qt) qt.textContent = ready ? `${ready} para cobrar` : `${done}/${MISSIONS.length} hoy`;
  const expDone = S.creatures.some(c => c.away && Date.now() >= c.away.end);
  app.querySelector('[data-tab=exp]')?.classList.toggle('dot', expDone);
  const ar = S.arena; app.querySelector('[data-tab=arena]')?.classList.toggle('dot', !!ar && (ar.chests.some((c, i) => i === 0 && c.pts >= ({ wood: 6, silver: 12, gold: 24 })[c.t]) || ROAD.some(r => ar.best >= r.at && !ar.road.includes(r.at))));
  app.querySelector('[data-tab=dex]')?.classList.toggle('dot', ACHIEVEMENTS.some(a => a[2]() && !S.ach.includes(a[0])));
  app.querySelector('[data-tab=trainer]')?.classList.toggle('dot', !!S.gate.length || !!allDue());
  save();
}
// ---------- Hora y clima (Open-Meteo, sin clave). La ubicación sólo se pide al tocar el reloj. ----------
const clock = () => new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
// Momento del día: es lo que se lee primero (como en Rebyters); la hora y el clima van chicos debajo
const phase = (h = new Date().getHours()) => h >= 6 && h < 12 ? { l: 'Mañana', i: 'dawn' } : h >= 12 && h < 19 ? { l: 'Tarde', i: 'sun' } : h >= 19 && h < 23 ? { l: 'Noche', i: 'night' } : { l: 'Madrugada', i: 'night' };
const WXN = { sun: 'Despejado', cloud: 'Nublado', fog: 'Niebla', rain: 'Lluvia', snow: 'Nieve', storm: 'Tormenta' };
let wxNow = null;
const WX = c => c <= 1 ? 'sun' : c <= 3 ? 'cloud' : c <= 48 ? 'fog' : c <= 67 || (c >= 80 && c <= 82) ? 'rain' : c <= 86 ? 'snow' : 'storm';
const GEO = 'kanjuu.geo', WXC = 'kanjuu.wx';
export async function weather(ask) {
  const show = w => {
    const el = $('#wx'); if (!el) return; wxNow = w; el.hidden = false;
    const k = WX(w.c); $('#clkI').innerHTML = ic(k === 'sun' ? phase().i : k);
    $('#wxT').textContent = `${Math.round(w.t)}° ${WXN[k]}`;
  };
  try { const w = JSON.parse(localStorage.getItem(WXC)); if (w) { show(w); if (Date.now() - w.at < 18e5 && !ask) return; } } catch {}
  let pos; try { pos = JSON.parse(localStorage.getItem(GEO)); } catch {}
  if (!pos) {
    if (!navigator.geolocation) return ask && toast('Este dispositivo no comparte su ubicación');
    if (!ask) { const p = await navigator.permissions?.query({ name: 'geolocation' }).catch(() => null); if (p?.state !== 'granted') return; }
    pos = await new Promise(res => navigator.geolocation.getCurrentPosition(p => res({ lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2) }), () => res(null), { timeout: 10000, maximumAge: 36e5 }));
    if (!pos) return ask && toast('Activá la ubicación para ver el clima');
    try { localStorage.setItem(GEO, JSON.stringify(pos)); } catch {}
  }
  try {
    const r = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.lat}&longitude=${pos.lon}&current=temperature_2m,weather_code,is_day`)).json();
    const w = { t: r.current.temperature_2m, c: r.current.weather_code, day: !!r.current.is_day, at: Date.now() };
    localStorage.setItem(WXC, JSON.stringify(w)); show(w);
  } catch { if (ask) toast('No se pudo cargar el clima'); }
}
// Configuración: cuenta, IA, ayuda de lectura y clima
export function openMenu() {
  const m = modal(`<h3>${ic('gear')} Configuración</h3>
    <div class="menu-list">
      <button class="row-k" id="mAcct"><span class="row-ic">${ic('user')}</span><span class="row-t"><b>Cuenta</b><small>${cloud.user ? esc(cloud.user.email) : 'Guardado en la nube y seguridad'}</small></span>${ic('right', 'chev')}</button>
      <button class="row-k" id="mAI"><span class="row-ic">${ic('sparkles')}</span><span class="row-t"><b>IA propia</b><small>Tu clave para cuentos y explicaciones</small></span>${ic('right', 'chev')}</button>
      <label class="row-k"><span class="row-ic">${ic('kana')}</span><span class="row-t"><b>Ayuda de lectura</b><small>Furigana sobre los kanji de la interfaz</small></span><input type="checkbox" class="sw" id="mFuri" ${helpOn() ? 'checked' : ''}></label>
      <button class="row-k" id="mWx"><span class="row-ic">${ic('sun')}</span><span class="row-t"><b>Clima</b><small>Usa tu ubicación aproximada para el clima del HUD</small></span>${ic('right', 'chev')}</button>
    </div>`);
  $('#mAcct', m).onclick = () => { m.close(); openAccount(); };
  $('#mAI', m).onclick = () => { m.close(); openAISettings(modal, toast, go); };
  $('#mFuri', m).onchange = e => { setHelp(e.target.checked); go(); };
  $('#mWx', m).onclick = () => { m.close(); try { localStorage.removeItem(GEO); } catch {} weather(true); };
}
const ICONS = { '店': 'bag', '旅': 'compass', '錬': 'fusion', '闘': 'swords', '図': 'book' };
// Encabezado común de pantalla: sello con kanji · título · una línea · dato a la derecha
export const scrHead = (k, title, sub, right = '') => `<header class="scr-h"><span class="scr-k">${ICONS[k] ? ic(ICONS[k]) : `<i>${k}</i>`}</span><div class="scr-t"><b>${title}</b><small>${sub}</small></div>${right ? `<div class="scr-r">${right}</div>` : ''}</header>`;
export function toast(msg) {
  const box = document.getElementById('toasts') || Object.assign(document.body.appendChild(document.createElement('div')), { id: 'toasts' });
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg;
  box.append(t); while (box.children.length > 3) box.firstChild.remove(); setTimeout(() => t.remove(), 2600);
}
export function modal(html, cls = '') {
  const m = document.createElement('div'); m.className = 'modal ' + cls;
  m.innerHTML = `<div class="sheet">${html}</div>`;
  m.onclick = e => { if (e.target === m) close(); };
  const close = () => { m.classList.add('out'); setTimeout(() => m.remove(), 220); };
  m.close = close; $('#layer').append(m); return m;
}
export function floatText(el, txt, cls = '') {
  const r = el.getBoundingClientRect(), f = document.createElement('div');
  f.className = 'float ' + cls; f.textContent = txt;
  f.style.left = r.left + r.width / 2 + 'px'; f.style.top = r.top + 10 + 'px';
  document.body.append(f); setTimeout(() => f.remove(), 1000);
}

// ---------- Inicio ----------
export function onboarding() {
  const starters = ['木', '日', '火'];
  const m = modal(`<div class="onb"><div class="onb-k">漢獣</div><h2>Bienvenido al santuario</h2>
    <p>Cada kanji es una criatura viva. Criala, entrenala y descubrí en qué se convierte.</p>
    <p class="muted">Elegí tu primer huevo</p>
    <div class="eggs">${starters.map(k => `<button class="egg-pick" data-k="${k}">${creatureSVG(k, { egg: true })}<small>${ELEMENTS[element(k)][2]}</small></button>`).join('')}</div></div>`, 'onbm');
  m.onclick = null;
  m.querySelectorAll('.egg-pick').forEach(b => b.onclick = () => {
    b.classList.add('hatch'); buzz([10, 40, 10]);
    setTimeout(() => {
      const c = arrive(b.dataset.k).c; c.mood = 1; m.close(); go();
      const w = modal(`<div class="result"><h3>¡Nació tu primer KANJŪ!</h3>${creatureSVG(c.k, { mood: 1 })}${storyHTML(c.k)}
        <p class="muted">Cada kanji tiene una historia para recordarlo. Tocá a ${c.k} en el santuario para mimarlo y entrenarlo.</p><button class="btn ok wide">¡Vamos!</button></div>`);
      speak(reads(c.k)[0]); $('.btn', w).onclick = () => w.close();
    }, 700);
  });
}

// Pasa el tiempo: el ánimo baja suavemente, nunca castiga
export const last = S.last || Date.now(), hrs = (Date.now() - last) / 36e5;
initWorld();
S.creatures.forEach(c => c.mood = calm(c) ? Math.max(.7, c.mood) : Math.max(.25, c.mood - hrs * .04));
// Regalo de regreso: nunca se pierde nada por no jugar
export const gift = S.creatures.length && hrs >= 3 ? Math.min(40, Math.round(hrs * 1.5) + S.creatures.length) : 0;
if (gift) { S.ink += gift; setTimeout(() => toast(`Mientras no estabas, tus KANJŪ juntaron <b>${gift} 墨</b>`), 900); }
S.last = Date.now();
setInterval(() => { S.last = Date.now(); save(); }, 15000);
setInterval(() => {
  if (ui.tab !== 'exp') return hud();
  document.querySelectorAll('[data-end]').forEach(el => { const l = +el.dataset.end - Date.now(); if (l <= 0) go(); else el.textContent = fmt(l); });
}, 1000);

export function startGame() {
  if (!S.creatures.length) onboarding();
  else if (loginReady()) setTimeout(openLogin, gift ? 1400 : 300);
}
shell();
startHelp(toast);
startTutorial({ toast, modal, refresh: go });
// Se necesita cuenta para jugar. Sin conexión, quien ya inició sesión en este dispositivo puede seguir.
cloud.me().then(async u => {
  if (u === undefined) return cloud.lastUser() ? startGame() : authWall('Sin conexión: conectate a internet para crear tu cuenta o entrar.');
  if (!u) return authWall();
  const remote = await cloud.pull().catch(() => undefined);
  if (remote?.creatures?.length && (remote.savedAt || 0) > loadedAt) { replace(remote); initWorld(); }
  if (remote !== undefined) cloud.setReady(true);
  shell(); aiStatus().catch(() => {});
  startGame();
});
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
