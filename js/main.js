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
import { viewHome, harvest, openStorage } from './sanctuary.js';
import { hourNow } from './scene3d.js';
import { viewLab } from './lab.js';
import { viewExp, fmt } from './trips.js';
import { viewDex, openQuests } from './atlas.js';
import { viewShop, openLogin } from './shop.js';
import { acadCtx, allDue, openDojo } from './dojo.js';
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

export const ui = { tab: 'home' };

// ---------- Shell (HUD y barra como Rebyters) ----------
// Hora del mundo: la misma que usa la escena (día/noche según la hora local)
const PERIODS = [[5, 'Noche', 'moon'], [8.5, 'Mañana', 'sunrise'], [17.5, 'Día', 'sun'], [20.5, 'Atardecer', 'sunset'], [24, 'Noche', 'moon']];
export const period = (h = hourNow()) => PERIODS.find(p => h < p[0]);
const clockTxt = () => { const h = hourNow(), m = Math.round((h % 1) * 60); return `${String(Math.floor(h) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
const NAV = [['me', 'user', 'Usuario'], ['lab', 'fusion', 'Fusión'], ['arena', 'swords', 'Arena'], ['exp', 'compass', 'Viajes'], ['dex', 'book', 'Atlas']];
export function shell() {
  app.innerHTML = `
  <header class="hud">
    <div class="hud-l" id="hudL"></div>
    <div class="hud-r">
      <div class="w-wallet">
        <button class="w-cell" id="inkBtn" aria-label="Tinta"><i class="w-coin">${ic('ink')}</i><span class="w-num"><b id="ink">${S.ink}</b><small id="inkSub">墨 tinta</small></span><em class="w-pend" id="inkPend"></em></button>
        <button class="w-cell" id="shopBtn" aria-label="Tienda"><i class="w-tix">${ic('ticket')}</i><span class="w-num"><b id="tix">${S.tickets}</b><small>札 boletos</small></span></button>
      </div>
      <button class="w-daily" id="questBtn" aria-label="Misiones de hoy"><span class="wd-badge" id="questIc">${ic('list')}</span><span class="wd-copy"><b>Misiones</b><small id="questTxt"></small><span class="wd-pips" id="questPips"></span></span>${ic('right', 'wd-go')}</button>
    </div>
  </header>
  <main id="view"></main>
  <nav class="tabs">${NAV.map(([id, k, l]) => `<button data-tab="${id}" class="${id === 'arena' ? 'center' : ''}"><i>${ic(k)}</i><span>${l}</span></button>`).join('')}</nav>
  <div id="layer"></div>`;
  app.querySelectorAll('.tabs button').forEach(b => b.onclick = () => {
    buzz(5);
    if (b.dataset.tab === 'me') return openMenu();
    ui.tab = ui.tab === b.dataset.tab ? 'home' : b.dataset.tab; go();
  });
  $('#questBtn').onclick = openQuests;
  $('#shopBtn').onclick = () => { ui.tab = 'shop'; buzz(5); go(); };
  $('#inkBtn').onclick = e => { if (ui.tab === 'home' && totalPending() > 0) return harvest(placed(), e.currentTarget); ui.tab = 'shop'; buzz(5); go(); };
  go();
}
export function go() {
  app.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === ui.tab));
  const v = $('#view'); v.className = 'view v-' + ui.tab;
  app.classList.toggle('on-home', ui.tab === 'home'); $('#shopBtn')?.classList.toggle('on', ui.tab === 'shop');
  ({ home: viewHome, lab: viewLab, exp: viewExp, arena: viewArena, shop: viewShop, dex: viewDex })[ui.tab](v);
  hud();
}
function hudLeft() {
  const L = $('#hudL'); if (!L) return;
  const mode = ui.tab === 'home' ? 'clock' : 'back';
  if (L.dataset.mode !== mode) {
    L.dataset.mode = mode;
    L.innerHTML = mode === 'clock'
      ? `<div class="w-clock" title="Hora del santuario"><span class="w-face" id="clkF"></span><span><b id="clkP"></b><small id="clkT"></small></span></div>`
      : `<button class="w-back" id="backBtn">${ic('left')}<span>Isla</span></button>`;
    $('#backBtn', L) && ($('#backBtn', L).onclick = () => { ui.tab = 'home'; buzz(5); go(); });
  }
  if (mode === 'clock') {
    const [, name, icon] = period(), f = $('#clkF', L);
    if (f.dataset.i !== icon) { f.dataset.i = icon; f.innerHTML = ic(icon); f.className = 'w-face ' + icon; }
    $('#clkP', L).textContent = name; $('#clkT', L).textContent = clockTxt();
  }
}
export function hud() {
  hudLeft();
  $('#ink').textContent = S.ink;
  rollDaily();
  const ready = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal && !S.daily.claimed.includes(m.id)).length
    + WEEKLY.filter(m => (S.weekly.p[m.id] || 0) >= m.goal && !S.weekly.claimed.includes(m.id)).length;
  $('#questBtn').classList.toggle('hot', !!ready);
  $('#questIc').innerHTML = ic(ready ? 'gift' : 'list');
  const tix = $('#tix'); if (tix) tix.textContent = S.tickets;
  const done = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal).length;
  const qt = $('#questTxt'); if (qt) qt.textContent = ready ? `${ready} para cobrar` : `${done}/${MISSIONS.length} hoy`;
  $('#questPips').innerHTML = MISSIONS.map(m => `<i class="${S.daily.claimed.includes(m.id) ? 'claimed' : (S.daily.p[m.id] || 0) >= m.goal ? 'done' : ''}"></i>`).join('');
  // La tinta producida se avisa sobre la tinta: tocarla la recoge
  const pend = totalPending(), pe = $('#inkPend'), ib = $('#inkBtn');
  pe.textContent = pend ? `+${pend}` : ''; ib.classList.toggle('ready', !!pend && ui.tab === 'home'); ib.classList.toggle('full', placed().some(full));
  $('#inkSub').textContent = pend && ui.tab === 'home' ? 'tocá para recoger' : `墨 · ${totalRate()}/h`;
  const expDone = S.creatures.some(c => c.away && Date.now() >= c.away.end);
  app.querySelector('[data-tab=exp]')?.classList.toggle('dot', expDone);
  const ar = S.arena; app.querySelector('[data-tab=arena]')?.classList.toggle('dot', !!ar && (ar.chests.some((c, i) => i === 0 && c.pts >= ({ wood: 6, silver: 12, gold: 24 })[c.t]) || ROAD.some(r => ar.best >= r.at && !ar.road.includes(r.at))));
  app.querySelector('[data-tab=dex]')?.classList.toggle('dot', ACHIEVEMENTS.some(a => a[2]() && !S.ach.includes(a[0])));
  app.querySelector('[data-tab=me]')?.classList.toggle('dot', allDue() > 0 || (S.acad?.day?.xp || 0) < DAILY_GOAL);
  save();
}
const ICONS = { '店': 'bag', '旅': 'compass', '錬': 'fusion', '闘': 'swords', '図': 'book' };
// Usuario: todo lo del jugador en un panel (rango, repaso, Academia, Tienda, inventario, cuenta y ajustes)
export function openMenu() {
  const need = rankNeed(S.rank.lv), due = allDue(), acadXp = S.acad?.day?.xp || 0;
  const row = (id, icon, t, sub, badge = '', hot = false) => `<button class="row-k ${hot ? 'hot' : ''}" id="${id}"><span class="row-ic">${ic(icon)}</span><span class="row-t"><b>${t}</b><small>${sub}</small></span>${badge ? `<b class="row-n">${badge}</b>` : ''}${ic('right', 'chev')}</button>`;
  const m = modal(`<div class="me-head"><span class="me-avatar">${ic('user')}</span><div class="me-id"><small>${cloud.user ? esc(cloud.user.email) : 'Jugador'}</small><b>Guardián ${S.rank.lv}</b><span class="me-xp"><i style="width:${S.rank.xp / need * 100}%"></i></span><small>${S.rank.xp}/${need} para el próximo rango</small></div></div>
    <div class="me-stats"><span><b>${owned()}</b><small>Kanji</small></span><span><b>${S.creatures.length}</b><small>KANJŪ</small></span><span><b>${S.arena?.best || 0}</b><small>Copas</small></span></div>
    <p class="me-label">Estudio</p>
    <div class="menu-list">
      ${row('mDojo', 'refresh', due ? 'Repasar' : 'Repaso al día', due ? 'Kanji, kana y vocabulario para hoy' : 'No hay nada pendiente: volvé mañana', due || '', !!due)}
      ${row('mAcad', 'cap', 'Academia', `Meta de hoy: ${Math.min(acadXp, DAILY_GOAL)}/${DAILY_GOAL} XP`, '', acadXp < DAILY_GOAL)}
    </div>
    <p class="me-label">Santuario</p>
    <div class="menu-list">
      ${row('mShop', 'bag', 'Tienda', 'Invocar, decorar, islas y piezas')}
      ${row('mInv', 'box', 'Inventario', 'Piezas de evolución y consumibles')}
    </div>
    <p class="me-label">Cuenta y ajustes</p>
    <div class="menu-list">
      ${row('mAcct', 'user', 'Cuenta', cloud.user ? 'Guardado en la nube y seguridad' : 'Guardado en la nube y seguridad')}
      ${row('mAI', 'sparkles', 'Inteligencia artificial', 'Tu clave para cuentos y explicaciones')}
      <label class="row-k"><span class="row-ic">${ic('kana')}</span><span class="row-t"><b>Ayuda de lectura</b><small>Furigana sobre los kanji de la interfaz</small></span><input type="checkbox" class="sw" id="mFuri" ${helpOn() ? 'checked' : ''}></label>
    </div>`, 'me-sheet');
  $('#mDojo', m).onclick = () => { m.close(); openDojo(); };
  $('#mAcad', m).onclick = () => { m.close(); openAcademy(acadCtx()); };
  $('#mShop', m).onclick = () => { m.close(); ui.tab = 'shop'; go(); };
  $('#mInv', m).onclick = () => { m.close(); openStorage('evo'); };
  $('#mAcct', m).onclick = () => { m.close(); openAccount(); };
  $('#mAI', m).onclick = () => { m.close(); openAISettings(modal, toast, () => {}); };
  $('#mFuri', m).onchange = e => { setHelp(e.target.checked); go(); };
}
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
