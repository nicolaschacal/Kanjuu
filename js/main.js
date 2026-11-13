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
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld, raining } from './world.js';
import { setGrain, grainOn } from './paper.js';
import { hourNow } from './scene3d.js';
import { viewHome, harvest } from './sanctuary.js';
import { viewTrainer } from './trainer.js';
import { allDue } from './dojo.js';
import { viewLab } from './lab.js';
import { viewExp, fmt } from './trips.js';
import { viewDex, openQuests } from './atlas.js';
import { viewShop, openLogin } from './shop.js';
import { acadCtx } from './dojo.js';
import { openAccount, authWall } from './account.js';
import { t, setLang, langName, locale, detect, LANGS } from './i18n.js';
import { pathReady } from './path.js';
import { startGestures, haptic } from './gestures.js';
import { kanaSkip, ALL_KANA } from './help.js';
import { LEX } from './lex.js';

export const $ = (s, r = document) => r.querySelector(s);
export const app = $('#app');
export const buzz = (n = 10) => haptic(n); // vibración nativa en la app empaquetada (js/gestures.js)
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const sorted = a => [...a].sort().join('');
export const home = () => S.creatures.filter(c => !c.away);

export const MISSIONS = [
  { id: 'pet', label: 'Mimá a tus KANJŪ', goal: 5, ink: 8 },
  { id: 'train', label: 'Completá entrenamientos', goal: 3, ink: 12 },
  { id: 'exp', label: 'Enviá una expedición', goal: 1, ink: 8 },
  { id: 'review', label: 'Repasá kanji en el Dojo', goal: 8, ink: 15 },
  { id: 'words', key: 'quest.words', goal: 5, ink: 15 }, // hallazgos, reencuentros y aciertos de palabras en el Dojo
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
  ['複', 'Arquitecto de kanji', () => Object.keys(S.dex).some(k => S.dex[k].owned && kLevel(k) >= 4), 'Obtén un KANJŪ de grado 4', 120],
  ['藻', 'Maestro de la composición', () => Object.keys(S.dex).some(k => S.dex[k].owned && kLevel(k) >= 5), 'Obtén un KANJŪ de grado 5', 250],
  ['全', 'Atlas completo', () => owned() >= Object.keys(KANJI).length, 'Llena todo el atlas', 300],
];
export const owned = () => Object.values(S.dex).filter(d => d.owned).length;

export const ui = { tab: 'home', sub: 'kan', dsub: 'atlas' };

// ---------- Shell ----------
// El mapa siempre queda debajo. Cada sección es una hoja con pestañas que sube sobre el mapa;
// mientras hay una hoja o un modal abierto, desaparecen el HUD y la barra inferior.
// El tercer valor es la clave del texto en locales/*.json
export const NAV = [['trainer', 'user', 'nav.trainer'], ['lab', 'fusion', 'nav.lab'], ['arena', 'swords', 'nav.arena'], ['exp', 'compass', 'nav.exp'], ['dex', 'book', 'nav.dex']];
const TITLES = { lab: 'nav.lab', arena: 'nav.arena', exp: 'nav.exp', dex: 'nav.dex', shop: 'sheet.shop' };
export const TRAINER_TABS = [['bag', 'bag', 'trainer.bag'], ['kan', 'paw', 'trainer.kan'], ['me', 'user', 'trainer.me']];
export const DEX_TABS = [['atlas', 'book', 'dex.atlas'], ['diary', 'pen', 'dex.diary'], ['fam', 'fusion', 'dex.fam'], ['ach', 'star', 'dex.ach']];
export function shell() {
  app.innerHTML = `
  <header class="hud">
    <button class="hud-clock" id="clock" data-i18n-aria="hud.clock" aria-label="${t('hud.clock')}"><span class="clk-ic" id="clkI">${ic(phase().i)}</span><span class="clk-t"><b id="clkP">${phase().l}</b><small><span id="clkT">${clock()}</span><span id="wx" hidden> · <span id="wxT"></span></span></small></span></button>
    <div class="hud-r">
      <div class="hud-row">
        <button class="wallet-p" id="shopBtn" data-i18n-aria="hud.wallet" aria-label="${t('hud.wallet')}"><span class="wc">${ic('ink', 'ink')}<b id="ink">${S.ink}</b></span><span class="wc">${ic('ticket', 'tix')}<b id="tix">${S.tickets}</b></span><i class="ink-dot" id="inkDot" hidden></i></button>
        <button class="gear-b" id="gearBtn" data-i18n-aria="menu.title" aria-label="${t('menu.title')}">${ic('gear')}</button>
      </div>
      <button class="quest-card" id="questBtn" data-i18n-aria="hud.questsAria" aria-label="${t('hud.questsAria')}"><span class="qc-ic">${ic('list')}</span><span class="qc-t"><b data-i18n="hud.quests">${t('hud.quests')}</b><small id="questTxt"></small></span><b class="qc-n" id="questN"></b></button>
    </div>
  </header>
  <main id="view"></main>
  <div id="panel"></div>
  <nav class="tabs">${NAV.map(([id, k, l]) => `<button data-tab="${id}" class="${id === 'arena' ? 'center' : ''}"><i>${ic(k)}</i><span data-i18n="${l}">${t(l)}</span></button>`).join('')}</nav>
  <div id="layer"></div>`;
  homeOn = false; document.documentElement.lang = locale();
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
export const covered = () => app.classList.toggle('covered', ui.tab !== 'home' || !!$('#layer')?.children.length || app.classList.contains('focus') || app.classList.contains('building'));
export function go() {
  const panel = ui.tab !== 'home';
  // El mapa sólo se vuelve a dibujar cuando está a la vista (o la primera vez)
  if (!panel || !homeOn) { const v = $('#view'); v.className = 'view v-home'; viewHome(v); homeOn = true; }
  renderPanel();
  covered(); hud();
}
export const closePanel = () => { ui.tab = 'home'; go(); };
function renderPanel() {
  const p = $('#panel'), tab = ui.tab;
  if (tab === 'home') {
    if (p.classList.contains('open')) { p.classList.add('out'); setTimeout(() => { if (ui.tab === 'home') { p.className = ''; p.innerHTML = ''; } }, 230); }
    return;
  }
  const fresh = !p.classList.contains('open') || p.classList.contains('out') || p.dataset.t !== tab;
  const old = $('#pnBody', p), top = fresh ? 0 : old?.scrollTop || 0;
  const tabs = tab === 'trainer' ? [TRAINER_TABS, 'sub'] : tab === 'dex' ? [DEX_TABS, 'dsub'] : null;
  const head = tabs
    ? `<div class="pn-tabs">${tabs[0].map(([id, k, l]) => `<button class="${(ui[tabs[1]] || tabs[0][0][0]) === id ? 'on' : ''}" data-sub="${id}">${ic(k)}<span>${t(l)}</span></button>`).join('')}</div>`
    : `<b class="pn-title">${t(TITLES[tab])}</b>`;
  p.className = 'open' + (fresh && p.dataset.t !== tab && !p.classList.contains('open') ? ' in' : '');
  p.dataset.t = tab;
  p.innerHTML = `<div class="pn-card"><div class="pn-head">${head}<button class="pn-x" id="pnX" aria-label="${t('sheet.close')}">${ic('x')}</button></div><div class="pn-body view v-${tab}${tab === 'trainer' ? ' sub-' + ui.sub : ''}" id="pnBody"></div></div>`;
  p.onclick = e => { if (e.target === p) closePanel(); };
  $('#pnX', p).onclick = closePanel;
  p.querySelectorAll('[data-sub]').forEach(b => b.onclick = () => { ui[tabs[1]] = b.dataset.sub; buzz(5); go(); });
  const body = $('#pnBody', p);
  ({ lab: viewLab, exp: viewExp, arena: viewArena, shop: viewShop, dex: viewDex, trainer: viewTrainer })[tab](body);
  body.scrollTop = top;
}
export function hud() {
  $('#ink').textContent = S.ink;
  const ct = $('#clkT'); if (ct) {
    const ph = phase(), rn = raining(), lbl = ph.l; ct.textContent = rn ? clock() + ' · ' + t('hud.rain') : clock();
    const k = rn ? 'rain' : wxNow && WX(wxNow.c) !== 'sun' ? WX(wxNow.c) : ph.i;
    if ($('#clkP').textContent !== lbl) $('#clkP').textContent = lbl;
    const ci = $('#clkI'); if (ci.dataset.k !== k) { ci.dataset.k = k; ci.innerHTML = ic(k); }
  }
  const dot = $('#inkDot'), pend = totalPending(); if (dot) { dot.hidden = !pend; $('#shopBtn').classList.toggle('claim', !!pend); }
  rollDaily();
  const ready = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal && !S.daily.claimed.includes(m.id)).length
    + WEEKLY.filter(m => (S.weekly.p[m.id] || 0) >= m.goal && !S.weekly.claimed.includes(m.id)).length + (pathReady() ? 1 : 0);
  $('#questN').textContent = ready || '';
  $('#questBtn').classList.toggle('hot', !!ready);
  const tix = $('#tix'); if (tix) tix.textContent = S.tickets;
  const done = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal).length;
  const qt = $('#questTxt'); if (qt) qt.textContent = ready ? t('hud.questsReady', { n: ready }) : t('hud.questsDone', { done, total: MISSIONS.length });
  if (wxNow) wxLabel();
  const expDone = S.creatures.some(c => c.away && Date.now() >= c.away.end);
  app.querySelector('[data-tab=exp]')?.classList.toggle('dot', expDone);
  const ar = S.arena; app.querySelector('[data-tab=arena]')?.classList.toggle('dot', !!ar && (ar.chests.some((c, i) => i === 0 && c.pts >= ({ wood: 6, silver: 12, gold: 24 })[c.t]) || ROAD.some(r => ar.best >= r.at && !ar.road.includes(r.at))));
  app.querySelector('[data-tab=dex]')?.classList.toggle('dot', ACHIEVEMENTS.some(a => a[2]() && !S.ach.includes(a[0])));
  app.querySelector('[data-tab=trainer]')?.classList.toggle('dot', !!S.gate.length || !!allDue());
  save();
}
// ---------- Hora y clima (Open-Meteo, sin clave). La ubicación sólo se pide al tocar el reloj. ----------
const clock = () => new Date().toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
// Momento del día: es lo que se lee primero (como en Rebyters); la hora y el clima van chicos debajo
const phase = (h = Math.floor(hourNow())) => h >= 6 && h < 12 ? { l: t('hud.phase.morning'), i: 'dawn' } : h >= 12 && h < 19 ? { l: t('hud.phase.afternoon'), i: 'sun' } : h >= 19 && h < 23 ? { l: t('hud.phase.night'), i: 'night' } : { l: t('hud.phase.lateNight'), i: 'night' };
let wxNow = null;
// Temperatura y clima en el idioma actual (también se llama al cambiar de idioma)
function wxLabel() { const el = $('#wxT'); if (!el || !wxNow) return; const k = raining() ? 'rain' : WX(wxNow.c); const txt = `${Math.round(wxNow.t)}° ${t('hud.wx.' + k)}`; if (el.textContent !== txt) el.textContent = txt; }
const WX = c => c <= 1 ? 'sun' : c <= 3 ? 'cloud' : c <= 48 ? 'fog' : c <= 67 || (c >= 80 && c <= 82) ? 'rain' : c <= 86 ? 'snow' : 'storm';
const GEO = 'kanjuu.geo', WXC = 'kanjuu.wx';
export async function weather(ask) {
  const show = w => {
    const el = $('#wx'); if (!el) return; wxNow = w; el.hidden = false;
    const k = raining() ? 'rain' : WX(w.c) === 'sun' ? phase().i : WX(w.c); $('#clkI').innerHTML = ic(k); $('#clkI').dataset.k = k;
    wxLabel();
  };
  try { const w = JSON.parse(localStorage.getItem(WXC)); if (w) { show(w); if (Date.now() - w.at < 18e5 && !ask) return; } } catch {}
  let pos; try { pos = JSON.parse(localStorage.getItem(GEO)); } catch {}
  if (!pos) {
    if (!navigator.geolocation) return ask && toast(t('wx.noGeo'));
    if (!ask) { const p = await navigator.permissions?.query({ name: 'geolocation' }).catch(() => null); if (p?.state !== 'granted') return; }
    pos = await new Promise(res => navigator.geolocation.getCurrentPosition(p => res({ lat: +p.coords.latitude.toFixed(2), lon: +p.coords.longitude.toFixed(2) }), () => res(null), { timeout: 10000, maximumAge: 36e5 }));
    if (!pos) return ask && toast(t('wx.enableGeo'));
    try { localStorage.setItem(GEO, JSON.stringify(pos)); } catch {}
  }
  try {
    const r = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.lat}&longitude=${pos.lon}&current=temperature_2m,weather_code,is_day`)).json();
    const w = { t: r.current.temperature_2m, c: r.current.weather_code, day: !!r.current.is_day, at: Date.now() };
    localStorage.setItem(WXC, JSON.stringify(w)); show(w);
  } catch { if (ask) toast(t('wx.fail')); }
}
// Configuración: cuenta, IA, idioma, ayuda de lectura y clima
export function openMenu() {
  const row = (id, icon, k, sub) => `<button class="row-k" id="${id}"><span class="row-ic">${ic(icon)}</span><span class="row-t"><b>${t(k)}</b><small>${sub}</small></span>${ic('right', 'chev')}</button>`;
  const sw = (id, icon, k, on) => `<label class="row-k"><span class="row-ic">${ic(icon)}</span><span class="row-t"><b>${t(k)}</b><small>${t(k + 'Sub')}</small></span><input type="checkbox" class="sw" id="${id}" ${on ? 'checked' : ''}></label>`;
  const m = modal(`<h3>${ic('gear')} ${t('menu.title')}</h3>
    <div class="menu-list">
      ${row('mAcct', 'user', 'menu.account', cloud.user ? esc(cloud.user.email) : t('menu.accountSub'))}
      ${row('mLang', 'globe', 'menu.lang', esc(S.lang && S.lang !== 'auto' ? langName() : `${t('lang.auto')} · ${langName()}`))}
      ${row('mAI', 'sparkles', 'menu.ai', t('menu.aiSub'))}
      ${row('mLevel', 'cap', 'menu.level', t(LEVELS[S.level || 0][0]))}
      ${sw('mFuri', 'kana', 'menu.furi', helpOn())}
      ${sw('mGrain', 'leaf', 'menu.grain', grainOn())}
      ${row('mWx', 'sun', 'menu.wx', t('menu.wxSub'))}
    </div>`);
  $('#mAcct', m).onclick = () => { m.close(); openAccount(); };
  $('#mLang', m).onclick = () => { m.close(); openLang(); };
  $('#mAI', m).onclick = () => { m.close(); openAISettings(modal, toast, go); };
  $('#mLevel', m).onclick = () => { m.close(); openLevel(openMenu); };
  $('#mFuri', m).onchange = e => { setHelp(e.target.checked); go(); };
  $('#mGrain', m).onchange = e => setGrain(e.target.checked);
  $('#mWx', m).onclick = () => { m.close(); try { localStorage.removeItem(GEO); } catch {} weather(true); };
}
// Elegir idioma: automático (según el dispositivo) o uno fijo. Cambia al instante, sin recargar.
function openLang() {
  const cur = S.lang && S.lang !== 'auto' ? S.lang : 'auto';
  const opt = (id, name, sub = '') => `<button class="row-k${cur === id ? ' on' : ''}" data-l="${id}" aria-pressed="${cur === id}"><span class="row-t"><b>${esc(name)}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</span>${cur === id ? ic('check', 'chev') : ''}</button>`;
  const m = modal(`<h3>${ic('globe')} ${t('lang.title')}</h3>
    <div class="menu-list">${opt('auto', t('lang.auto'), t('lang.autoSub', { name: langName(detect()) }))}${LANGS.map(l => opt(l.id, l.name)).join('')}</div>`);
  m.querySelectorAll('[data-l]').forEach(b => b.onclick = () => {
    buzz(5); setLang(b.dataset.l); m.close(); go(); toast(t('lang.changed', { name: esc(langName()) })); openMenu();
  });
}
// Nivelación: "¿Qué sabes ya?" (docs/APRENDIZAJE.md §6). Autodeclarar primero; ante la duda, un peldaño abajo.
// 0 empiezo de cero · 1 leo hiragana y katakana · 2 además reconozco algunos kanji
const LEVELS = [['level.zero', 'level.zeroSub', 'leaf'], ['level.kana', 'level.kanaSub', 'kana'], ['level.kanji', 'level.kanjiSub', 'book']];
export function setLevel(n) {
  const was = S.level; S.level = n;
  // Comprobación diferida: los kana quedan como sabidos (romaji apagado) y, si uno falla en el repaso, su romaji vuelve
  if (n >= 1) kanaSkip([ALL_KANA, ...LEX.map(w => w.kana)]);
  else if (was >= 1) S.kana = {}; // bajar a "de cero" vuelve a mostrar el romaji de todos los kana
  save();
}
export function openLevel(after) {
  const cur = S.level;
  const m = modal(`<div class="onb lvl"><h2>${t('level.title')}</h2><p class="muted">${t('level.lead')}</p>
    <div class="menu-list">${LEVELS.map(([k, sub, icon], i) => `<button class="row-k${cur === i ? ' on' : ''}" data-lv="${i}"><span class="row-ic">${ic(icon)}</span><span class="row-t"><b>${t(k)}</b><small>${t(sub)}</small></span>${cur === i ? ic('check', 'chev') : ''}</button>`).join('')}</div>
    <p class="muted">${t('level.note')}</p></div>`, 'onbm');
  if (cur == null) m.onclick = null; // la primera vez hay que elegir (se puede cambiar después en Configuración)
  m.querySelectorAll('[data-lv]').forEach(b => b.onclick = () => { buzz(5); setLevel(+b.dataset.lv); m.close(); go(); after?.(); });
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
      speak(reads(c.k)[0]); const done = () => { w.close(); if (S.level == null) openLevel(); };
      $('.btn', w).onclick = done; w.onclick = e => { if (e.target === w) done(); };
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
startGestures(toast);
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
