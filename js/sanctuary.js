// KANJŪ · sanctuary.js
import { PIECES, KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { $, buzz, home, owned, ui, go, hud, toast, modal, floatText } from './main.js';
import { openCreature } from './sheet.js';
import { allDue, openDojo } from './dojo.js';
import { webgl, mountScene, emoteAt, hopAll, poke } from './scene3d.js';

// ---------- Santuario (grilla de tiles) ----------
let idleT, build = false, placing = null;
export function viewHome(v) { return webgl() && !new URLSearchParams(location.search).has('2d') ? viewHome3d(v) : viewHome2d(v); }

// Santuario 3D: la escena dibuja la grilla; la UI (objetivo, burbujas, dock) va por encima en HTML
function viewHome3d(v) {
  const pend = totalPending(), canGrow = S.rows < BASE_ROWS + ROW_COSTS.length;
  const bubbles = placed().filter(it => pending(it) >= 8 || full(it)).map(it => `<button class="bubble-ink ${full(it) ? 'full' : ''}" data-c="${it.id}" data-anchor="${it.id}">墨<span>${pending(it)}</span></button>`).join('');
  v.innerHTML = `
  <div class="home home3d">
    <div class="stage" id="stage">
      <div class="stage-ov">${placing || build ? '' : bubbles}</div>
      <div class="stage-top">${placing ? '' : goalHTML()}</div>
      ${build && canGrow ? `<button class="expand-row" id="expandRow">＋ Expandir terreno · ${ROW_COSTS[S.rows - BASE_ROWS]} 墨 · Rango ${ROW_RANK[S.rows - BASE_ROWS]}</button>` : ''}
      ${build ? `<div class="build-hint">匠 Modo construcción · tocá un ítem para moverlo, guardarlo o mejorarlo</div>` : ''}
    </div>
    ${placing ? `<div class="place-bar">Tocá dónde colocar <b>${placing.t ? OBJS[placing.t].k : placing.k}</b><button class="btn ghost" id="cancelPlace">Cancelar</button></div>` : dockHTML(pend)}
  </div>`;
  const stage = $('#stage', v);
  const items = placed().map(it => {
    const [w, h] = foot(it), b = { id: it.id, x: it.pos.x, y: it.pos.y, w, h };
    if (it.t) return { ...b, kind: 'obj', t: it.t, lv: it.lv };
    if (it.away) return { ...b, kind: 'away' };
    return { ...b, kind: it.egg ? 'egg' : 'mon', svg: creatureSVG(it.k, { mood: it.mood, egg: it.egg, gold: it.gold }), insp: it.insp > Date.now() };
  });
  let valid = null;
  if (placing) { const [w, h] = foot(placing); valid = []; for (let y = 0; y < S.rows; y++) for (let x = 0; x < COLS; x++) if (fits(w, h, x, y, placing)) valid.push([x, y]); }
  mountScene(stage, { cols: COLS, rows: S.rows, items, mode: placing ? 'placing' : build ? 'build' : 'play', valid, onTap: tap3d, onCell: (x, y) => tapCell(x, y, null) });
  stage.querySelectorAll('.bubble-ink').forEach(b => b.onclick = e => { e.stopPropagation(); harvest([findIt(b.dataset.c)], b); });
  bindDock(v);
  clearInterval(idleT);
  idleT = setInterval(() => {
    if (ui.tab !== 'home' || document.hidden || build || placing) return;
    hopAll(.25);
    const mons = S.creatures.filter(c => c.pos && !c.away && !c.egg);
    if (mons.length > 1 && Math.random() < .35) emoteAt(mons[Math.random() * mons.length | 0].id, ['♪', '♥', '！', '…', 'ｚ', '✿'][Math.random() * 6 | 0]);
    stage.querySelectorAll('.bubble-ink').forEach(b => { const n = pending(findIt(b.dataset.c)); b.querySelector('span').textContent = n; });
  }, 2500);
}
function tap3d(id) {
  const it = findIt(id); if (!it) return;
  buzz(8);
  if (build) return itemMenu(it);
  if (it.t) return toast(`${OBJS[it.t].k} ${OBJS[it.t].name} Nv${it.lv} · ${OBJS[it.t].desc}`);
  if (it.away) return toast(`${it.k} está de viaje`);
  if (it.egg) {
    it.cracks = (it.cracks || 0) + 1;
    if (it.cracks >= 3) { delete it.egg; delete it.cracks; save(); setTimeout(() => { go(); hatched(it); }, 350); }
    else { emoteAt(id, it.cracks === 1 ? '…' : '！！'); save(); }
    return;
  }
  setTimeout(() => openCreature(it.id), 220);
}
function dockHTML(pend) {
  return `<div class="dock">
      <button class="dk ${tilesUsed() >= tilesTotal() ? 'full' : ''}" id="build"><i>${build ? '✓' : '匠'}</i><span>${build ? 'Listo' : 'Construir'}</span></button>
      <button class="dk" id="store"><i>蔵</i><span>${stored().length}/${S.storeCap}</span>${S.gate.length ? `<b>${S.gate.length}</b>` : ''}</button>
      <button class="dk big ${pend ? 'ready' : ''}" id="collectAll"><i>収</i><span>${pend ? `+${pend} 墨` : `${totalRate()}/h`}</span></button>
      <button class="dk" id="tiles"><i>空</i><span>${tilesUsed()}/${tilesTotal()}</span></button>
      <button class="dk ${allDue() ? 'ready' : ''}" id="dojo"><i>修</i><span>Repaso</span>${allDue() ? `<b>${allDue()}</b>` : ''}</button>
    </div>`;
}
function bindDock(v) {
  if (placing) { $('#cancelPlace', v).onclick = () => { placing = null; go(); }; }
  else {
    $('#build', v).onclick = () => { build = !build; buzz(6); go(); };
    $('#store', v).onclick = openStorage;
    $('#collectAll', v).onclick = e => harvest(placed(), e.currentTarget);
    $('#tiles', v).onclick = () => toast(`空 ${tilesUsed()} de ${tilesTotal()} casillas ocupadas · Nivel 1 ocupa 1, nivel 2 ocupa 2×1, nivel 3 ocupa 2×2`);
    $('#dojo', v).onclick = openDojo;
  }
  $('#expandRow', v) && ($('#expandRow', v).onclick = buyRow);
}

function viewHome2d(v) {
  const R = S.rows, pend = totalPending();
  v.innerHTML = `
  <div class="home">
    <div class="home-scroll">
      <div class="sky-band"><div class="sun-disc"></div><div class="cloud c1"></div><div class="cloud c2"></div><div class="hill h1"></div><div class="hill h2"></div>${goalHTML()}</div>
      <div class="grid ${build ? 'build' : ''} ${placing ? 'placing' : ''}" style="--rows:${R}" id="grid">
        ${build || placing ? Array.from({ length: COLS * R }, (_, i) => `<i class="cell" data-x="${i % COLS}" data-y="${i / COLS | 0}"></i>`).join('') : ''}
        ${placed().map(itemHTML).join('')}
      </div>
      ${S.rows < BASE_ROWS + ROW_COSTS.length ? `<button class="expand-row" id="expandRow">＋ Expandir terreno · ${ROW_COSTS[S.rows - BASE_ROWS]} 墨 · Rango ${ROW_RANK[S.rows - BASE_ROWS]}</button>` : ''}
    </div>
    ${placing ? `<div class="place-bar">Tocá dónde colocar <b>${placing.t ? OBJS[placing.t].k : placing.k}</b><button class="btn ghost" id="cancelPlace">Cancelar</button></div>` : `
    <div class="dock">
      <button class="dk ${tilesUsed() >= tilesTotal() ? 'full' : ''}" id="build"><i>${build ? '✓' : '匠'}</i><span>${build ? 'Listo' : 'Construir'}</span></button>
      <button class="dk" id="store"><i>蔵</i><span>${stored().length}/${S.storeCap}</span>${S.gate.length ? `<b>${S.gate.length}</b>` : ''}</button>
      <button class="dk big ${pend ? 'ready' : ''}" id="collectAll"><i>収</i><span>${pend ? `+${pend} 墨` : `${totalRate()}/h`}</span></button>
      <button class="dk" id="tiles"><i>空</i><span>${tilesUsed()}/${tilesTotal()}</span></button>
      <button class="dk ${allDue() ? 'ready' : ''}" id="dojo"><i>修</i><span>Repaso</span>${allDue() ? `<b>${allDue()}</b>` : ''}</button>
    </div>`}
  </div>`;
  const grid = $('#grid', v);
  grid.querySelectorAll('[data-it]').forEach(el => el.onclick = e => tapItem(el.dataset.it, el, e));
  grid.querySelectorAll('.cell').forEach(el => el.onclick = () => tapCell(+el.dataset.x, +el.dataset.y, el));
  grid.querySelectorAll('.bubble-ink').forEach(b => b.onclick = e => { e.stopPropagation(); harvest([findIt(b.dataset.c)], b); });
  if (placing) { $('#cancelPlace', v).onclick = () => { placing = null; go(); }; markValid(grid); }
  else {
    $('#build', v).onclick = () => { build = !build; buzz(6); go(); };
    $('#store', v).onclick = openStorage;
    $('#collectAll', v).onclick = e => harvest(placed(), e.currentTarget);
    $('#tiles', v).onclick = () => toast(`空 ${tilesUsed()} de ${tilesTotal()} casillas ocupadas · Nivel 1 ocupa 1, nivel 2 ocupa 2×1, nivel 3 ocupa 2×2`);
    $('#dojo', v).onclick = openDojo;
  }
  $('#expandRow', v) && ($('#expandRow', v).onclick = buyRow);
  clearInterval(idleT);
  idleT = setInterval(() => {
    if (ui.tab !== 'home' || document.hidden || build || placing) return;
    const mons = [...grid.querySelectorAll('.it.mon:not(.egg)')];
    mons.forEach(el => Math.random() < .3 && (el.classList.remove('hop'), void el.offsetWidth, el.classList.add('hop')));
    if (mons.length > 1 && Math.random() < .35) emote(mons[Math.random() * mons.length | 0], ['♪', '♥', '！', '…', 'ｚ', '✿'][Math.random() * 6 | 0]);
    grid.querySelectorAll('.bubble-ink').forEach(b => { const n = pending(findIt(b.dataset.c)); b.querySelector('span').textContent = n; });
  }, 2500);
}
export const findIt = id => S.creatures.find(c => c.id === id) || S.objs.find(o => o.id === id);
export function itemHTML(it) {
  const [w, h] = foot(it), p = it.pos, n = pending(it);
  const style = `--x:${p.x};--y:${p.y};--w:${w};--h:${h}`;
  const bub = n >= 1 ? `<button class="bubble-ink ${full(it) ? 'full' : ''}" data-c="${it.id}">墨<span>${n}</span></button>` : '';
  if (it.t) return `<div class="it obj" data-it="${it.id}" style="${style}">${objSVG(it, OBJS[it.t])}${bub}</div>`;
  if (it.away) return `<div class="it away" data-it="${it.id}" style="${style}"><span>旅</span><small>${it.k} de viaje</small></div>`;
  return `<div class="it mon ${it.egg ? 'egg' : ''} ${it.insp > Date.now() ? 'insp' : ''}" data-it="${it.id}" style="${style}">
    <div class="flip">${creatureSVG(it.k, { mood: it.mood, egg: it.egg, gold: it.gold })}</div>${it.acc ? `<span class="acc-hat">${it.acc}</span>` : ''}
    <div class="tag">${it.egg ? '¿?' : `Lv${it.lv}${it.stars ? ' ' + '★'.repeat(it.stars) : ''}`}</div>${bub}</div>`;
}
export function harvest(list, el) {
  let sum = 0; list.forEach(it => sum += gather(it));
  if (!sum) return toast('Todavía no hay tinta para recoger · entrená para inspirar a tus KANJŪ');
  const ups = addXP(sum / 10); buzz([8, 30, 8]); emit('harvest'); floatText(el, `+${sum} 墨`); hud(); go();
  if (ups.length) rankUp(ups);
}
export function emote(el, e) {
  const b = document.createElement('div'); b.className = 'emote'; b.textContent = e;
  el.append(b); setTimeout(() => b.remove(), 1600);
}
export function tapItem(id, el, e) {
  const it = findIt(id); if (!it) return;
  buzz(8);
  if (placing) return;
  if (build) return itemMenu(it);
  if (it.t) return toast(`${OBJS[it.t].k} ${OBJS[it.t].name} Nv${it.lv} · ${OBJS[it.t].desc}`);
  if (it.away) return toast(`${it.k} está de viaje`);
  el.classList.remove('squish'); void el.offsetWidth; el.classList.add('squish');
  if (it.egg) {
    it.cracks = (it.cracks || 0) + 1;
    if (it.cracks >= 3) { delete it.egg; delete it.cracks; el.classList.add('hatch'); setTimeout(() => { go(); hatched(it); }, 600); }
    else emote(el, it.cracks === 1 ? '…' : '！！'); save(); return;
  }
  setTimeout(() => openCreature(it.id), 160);
}
export function hatched(c) {
  const m = modal(`<div class="result"><h3>¡Nació ${c.k}!</h3>${creatureSVG(c.k, { mood: 1, gold: c.gold })}${c.gold ? '<p class="g">✦ ¡Variante dorada! Produce +50% de tinta</p>' : ''}${c.gen ? `<p class="g">Gen ${c.gen} · +${c.gen * 25}% EXP permanente</p>` : ''}${storyHTML(c.k)}<button class="btn ok wide">¡Bienvenido!</button></div>`);
  speak(reads(c.k)[0] || ''); $('.btn', m).onclick = () => m.close();
}
export function itemMenu(it) {
  const isObj = !!it.t, d = isObj && OBJS[it.t];
  const m = modal(`<h3>${isObj ? `${d.k} ${d.name} · Nv${it.lv}` : `${it.k} · ${KANJI[it.k].m}`}</h3>
    <p class="muted">${isObj ? d.desc : `Produce ${rate(it).toFixed(1)} 墨/h aquí. Los objetos vecinos lo potencian.`}</p>
    <div class="menu-acts">
      <button class="btn ghost" id="mv">✥ Mover</button>
      <button class="btn ghost" id="st" ${storeFree() <= 0 || it.away ? 'disabled' : ''}>蔵 Guardar</button>
      ${isObj && it.lv < OBJ_MAX ? `<button class="btn ok" id="up" ${S.ink < upCost(it) ? 'disabled' : ''}>⬆ Mejorar · ${upCost(it)} 墨</button>` : ''}
      ${isObj ? `<button class="btn ghost" id="sell">Vender · +${sellValue(it)} 墨</button>` : ''}
    </div>`);
  $('#mv', m).onclick = () => { m.close(); placing = it; build = false; go(); };
  $('#st', m).onclick = () => { gather(it); it.pos = null; m.close(); go(); toast(`${isObj ? d.k : it.k} guardado en el almacén`); };
  $('#up', m) && ($('#up', m).onclick = () => { gather(it); S.ink -= upCost(it); it.lv++; m.close(); go(); toast(`⬆ ${d.k} subió a Nv${it.lv}`); buzz(20); });
  $('#sell', m) && ($('#sell', m).onclick = () => { S.ink += sellValue(it); S.objs = S.objs.filter(o => o !== it); m.close(); go(); });
}
export const sellValue = o => Math.round(OBJS[o.t].cost * (.4 + (o.lv - 1) * .5));
export function markValid(grid) {
  const [w, h] = foot(placing);
  grid.querySelectorAll('.cell').forEach(c => c.classList.toggle('ok', fits(w, h, +c.dataset.x, +c.dataset.y, placing)));
}
export function tapCell(x, y, el) {
  if (!placing) return;
  const [w, h] = foot(placing);
  if (!fits(w, h, x, y, placing)) { if (el) { el.classList.add('no'); setTimeout(() => el.classList.remove('no'), 300); } else toast('No entra ahí · elegí una casilla marcada'); buzz(30); return; }
  const it = placing; it.pos = { x, y }; it.prodAt ??= Date.now(); placing = null; buzz(12); go();
  const near = neighbors(it).map(o => OBJS[o.t].k).join(' ');
  if (!it.t && near) toast(`${it.k} recibe el aura de ${near}`);
}
export function buyRow() {
  const i = S.rows - BASE_ROWS, cost = ROW_COSTS[i], need = ROW_RANK[i];
  if (S.rank.lv < need) return toast(`Necesitás Rango ${need} para expandir el terreno`);
  if (S.ink < cost) return toast(`Te faltan ${cost - S.ink} 墨`);
  S.ink -= cost; S.rows++; buzz(20); toast('広 ¡Terreno expandido! +6 casillas'); go();
}
export function openStorage() {
  const list = stored();
  const m = modal(`<h3>蔵 Almacén <small class="muted">${list.length}/${S.storeCap}</small></h3>
    ${Object.keys(PIECES).some(p => S.pieces[p]) ? `<div class="pc-inv">部品 ${Object.keys(PIECES).filter(p => S.pieces[p]).map(p => `<span>${p}<i>×${S.pieces[p]}</i></span>`).join('')}<small>Las piezas no ocupan lugar · se equipan desde la ficha</small></div>` : ''}
    <p class="muted">Lo guardado no ocupa casillas ni produce tinta. Las criaturas guardadas pueden fusionarse y despertarse.</p>
    ${S.gate.length ? `<h4>門 En la puerta (almacén lleno)</h4>${S.gate.map((g, i) => `<div class="shop-row"><div class="gate-mon">${creatureSVG(g.k, { gold: g.gold })}</div><div><b>${g.k} · ${KANJI[g.k].m}</b></div><button class="btn ok" data-gin="${i}" ${storeFree() > 0 || findSpot(...foot({ k: g.k })) ? '' : 'disabled'}>Recibir</button><button class="btn ghost" data-gout="${i}">+${6 + kLevel(g.k) * 4}墨</button></div>`).join('')}` : ''}
    <div class="store-grid">${list.map(it => `<button class="st-it" data-s="${it.id}">${it.t ? objSVG(it, OBJS[it.t]) : creatureSVG(it.k, { egg: it.egg, gold: it.gold })}<small>${it.t ? `${OBJS[it.t].name} Nv${it.lv}` : `${it.k} Lv${it.lv}${it.stars ? ' ★' + it.stars : ''}`}</small><em>${foot(it).join('×')}</em></button>`).join('') || '<p class="muted">Vacío</p>'}</div>
    ${STORE_COSTS[(S.storeCap - 10) / 5] ? `<button class="btn ghost wide" id="moreStore">蔵 +5 espacios de almacén · ${STORE_COSTS[(S.storeCap - 10) / 5]} 墨</button>` : ''}`);
  m.querySelectorAll('[data-s]').forEach(b => b.onclick = () => storedMenu(findIt(b.dataset.s), m));
  m.querySelectorAll('[data-gin]').forEach(b => b.onclick = () => { const g = S.gate.splice(+b.dataset.gin, 1)[0]; arrive(g.k, { gold: g.gold }); m.close(); go(); openStorage(); });
  m.querySelectorAll('[data-gout]').forEach(b => b.onclick = () => { const g = S.gate.splice(+b.dataset.gout, 1)[0]; S.ink += 6 + kLevel(g.k) * 4; m.close(); go(); openStorage(); });
  $('#moreStore', m) && ($('#moreStore', m).onclick = () => { const c = STORE_COSTS[(S.storeCap - 10) / 5]; if (S.ink < c) return toast(`Te faltan ${c - S.ink} 墨`); S.ink -= c; S.storeCap += 5; m.close(); hud(); openStorage(); });
}
export function storedMenu(it, parent) {
  const isObj = !!it.t;
  const m = modal(`<h3>${isObj ? `${OBJS[it.t].k} ${OBJS[it.t].name}` : `${it.k} · ${KANJI[it.k].m}`}</h3><div class="menu-acts">
    <button class="btn ok" id="put" ${findSpot(...foot(it)) ? '' : 'disabled'}>✥ Colocar en el santuario</button>
    ${isObj ? `<button class="btn ghost" id="sell">Vender · +${sellValue(it)} 墨</button>` : `<button class="btn ghost" id="see">Ver ficha</button><button class="btn ghost" id="free" ${S.creatures.filter(c => !c.egg).length <= 1 ? 'disabled' : ''}>放 Liberar</button>`}</div>
    ${findSpot(...foot(it)) ? '' : '<p class="r">No hay lugar libre de ese tamaño. Expandí el terreno o guardá algo.</p>'}`);
  $('#put', m).onclick = () => { m.close(); parent.close(); placing = it; ui.tab = 'home'; go(); };
  $('#sell', m) && ($('#sell', m).onclick = () => { S.ink += sellValue(it); S.objs = S.objs.filter(o => o !== it); m.close(); parent.close(); go(); openStorage(); });
  $('#see', m) && ($('#see', m).onclick = () => { m.close(); parent.close(); openCreature(it.id); });
  $('#free', m) && ($('#free', m).onclick = () => { if (!confirm(`${it.k} volverá a la naturaleza. ¿Liberar?`)) return; const ink = release(it); m.close(); parent.close(); go(); toast(`+${ink} 墨`); openStorage(); });
}
export function rankUp(ups) {
  const r = ups[ups.length - 1];
  const m = modal(`<div class="result rank-up"><div class="rank-badge">位<b>${r}</b></div><h3>¡Rango ${r}!</h3>
    <p>+${ups.reduce((a, l) => a + 20 + l * 10, 0)} 墨 · +${ups.length} 札</p>
    ${ROW_RANK.includes(r) ? '<p class="g">Desbloqueaste una nueva expansión de terreno</p>' : ''}
    ${Object.values(OBJS).filter(o => o.rank === r).map(o => `<p class="g">Nuevo objeto en la tienda: ${o.k} ${o.name}</p>`).join('')}
    <button class="btn ok wide">¡Genial!</button></div>`);
  buzz([20, 60, 20]); $('.btn', m).onclick = () => m.close();
}

// Objetivo guiado: siempre hay un próximo paso claro
export function goalHTML() {
  const cs = S.creatures.filter(c => !c.egg);
  let g;
  if (S.creatures.some(c => c.egg)) g = 'Tocá el huevo 3 veces para que nazca';
  else if (!Object.keys(S.acad?.done || {}).length) g = '¿Nuevo en japonés? Tocá 学 arriba: aprendé hiragana, katakana y frases';
  else if ((S.acad?.day?.xp || 0) < DAILY_GOAL) g = `Meta de la Academia: ${S.acad?.day?.xp || 0}/${DAILY_GOAL} XP hoy · tocá 学`;
  else if (totalPending() >= 20) g = `Tus KANJŪ produjeron ${totalPending()} 墨 · tocá 収 para recoger`;
  else if (S.gate.length) g = 'Almacén lleno: hay KANJŪ esperando en la puerta';
  else if (S.tickets) g = `Tenés ${S.tickets} 札: invocá en el altar de la Tienda`;
  else if (!S.objs.length && S.ink >= 40) g = 'Comprá una 硯 Piedra de tinta en la Tienda para producir más';
  else if (allDue() >= 3) g = `${allDue()} cosas para repasar hoy · tocá 修 Repaso`;
  else if (S.creatures.some(c => c.away && Date.now() >= c.away.end)) g = 'Una criatura volvió de su expedición';
  else {
    const ready = cs.find(c => evolutionsOf(c.k).some(t => c.lv >= evoLevel(t)));
    const fuseOk = Object.keys(KANJI).find(t => !S.dex[t]?.owned && KANJI[t].recipes?.some(r => r.every(k => cs.filter(c => c.k === k && !c.away).length >= r.filter(x => x === k).length)));
    if (fuseOk) g = 'Tenés lo necesario para una fusión en 錬';
    else if (ready) g = `${ready.k} puede evolucionar · abrí su ficha`;
    else if (!S.creatures.some(c => c.away) && owned() < 3) g = 'Enviá una criatura de expedición para encontrar nuevos kanji';
    else { const c = cs.sort((a, b) => b.lv - a.lv)[0]; const t = c && evolutionsOf(c.k)[0]; g = t ? `Entrená a ${c.k} hasta Lv ${evoLevel(t)}` : 'Llevá una criatura a Lv MAX para renacer'; }
  }
  return `<div class="goal"><i>目標</i><span>${g}</span></div>`;
}
