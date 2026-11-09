// KANJŪ · sanctuary.js
import { ic } from './icons.js';
import { PIECES, KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { ISLANDS, island, buyIsland, objCap, shownObjs, harmony, harmonyMult, monCap, shownMons, monFits, slot, syncGrid, COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld, CATS, objEff, GROUNDS, paintTile, raiseTile, rampTile, cascadeTile, raining } from './world.js';
import { $, buzz, home, owned, ui, go, hud, toast, modal, floatText, covered } from './main.js';
import { openCreature } from './sheet.js';
import { allDue, openDojo, acadCtx } from './dojo.js';
import { artThumb } from './paper.js';
import { webgl, mountScene, emoteAt, hopAll, poke, setFocus, rotateCam, zoomCam, tileAtScreen, flashTile } from './scene3d.js';
import { openTraining } from './sheet.js';
import { TYPES, typeOf, gradeTag } from './data.js';

// ---------- Santuario (grilla de tiles) ----------
let idleT, build = false, placing = null, seenGoal = '', focusId = null, tool = 'move';
export function viewHome(v) { return webgl() && !new URLSearchParams(location.search).has('2d') ? viewHome3d(v) : viewHome2d(v); }

// Santuario 3D: la escena dibuja la grilla; la UI (objetivo, burbujas, dock) va por encima en HTML.
// Construir (pantalla completa, sin HUD ni barra), tal como la maqueta:
//  arriba Listo · isla 5×5 con 置 獣 和 y "+" para ampliar · tinta
//  abajo un panel de tres pestañas con color propio: Mochila (lo tuyo) · Tienda (se paga) · Terreno
//  comprar abre una ficha con vista previa en la isla; al tocar un objeto la cámara se acerca y
//  aparecen Guardar / Mejorar / Vender debajo de él, con deshacer y confirmar abajo.
let sel = null, selFrom = null, trayTab = 'inv', invSub = 'obj', shopSub = 'deco', buyPick = null;
const undoStack = []; let undoAt = 0;
function viewHome3d(v) {
  if (focusId && (build || placing || !S.creatures.some(c => c.id === focusId && c.pos))) focusId = null;
  if (sel && (!build || !findIt(sel)?.pos)) sel = null;
  if (!build) buyPick = null;
  const bubbles = placed().filter(it => pending(it) >= 1).map(it => `<button class="bubble-ink ${full(it) ? 'full' : ''}" data-c="${it.id}" data-anchor="${it.id}" aria-label="Recoger ${pending(it)} de tinta">${ic('ink')}</button>`).join('');
  const editing = build && !placing, mode = !editing ? '' : buyPick ? 'buy' : sel ? 'sel' : trayTab;
  const preview = mode === 'buy' ? previewSpot(buyPick) : null;
  v.innerHTML = `
  <div class="home home3d">
    <div class="stage ${editing ? 'bm bm-' + mode : ''}" id="stage">
      <div class="stage-fx" aria-hidden="true"></div>
      <div class="stage-ov">${placing || build || focusId ? '' : bubbles}${mode === 'sel' ? ctxHTML(findIt(sel)) : ''}</div>
      ${mode === 'buy' ? `<div class="bm-scrim"></div>` : ''}
      ${editing ? topHTML(mode) : ''}
      ${placing || focusId || build ? '' : ctrlHTML()}
      ${focusId ? '' : !editing ? camHTML() : mode === 'inv' || mode === 'shop' ? `<div class="bm-cam"><button id="rotL" aria-label="Girar a la izquierda">${ic('rotL')}</button><i></i><button id="rotR" aria-label="Girar a la derecha">${ic('rotR')}</button></div>` : ''}
      ${mode === 'suelo' ? `<button class="bm-undo" id="undo" aria-label="Deshacer" ${undoStack.length ? '' : 'disabled'}>${ic('undo')}</button>` : ''}
      ${mode === 'buy' ? buyHTML(buyPick, preview) : mode === 'sel' ? miniHTML(findIt(sel)) : editing ? sheetHTML() : ''}
      ${focusId ? focusHTML(findIt(focusId)) : ''}
    </div>
    ${placing ? `<div class="place-bar">Tocá dónde colocar <b>${placing.t ? OBJS[placing.t].k : placing.k}</b><button class="btn ghost" id="cancelPlace">Cancelar</button></div>` : ''}
  </div>`;
  const app = document.getElementById('app');
  app.classList.toggle('focus', !!focusId); app.classList.toggle('building', build || !!placing); covered();
  const stg = $('#stage', v);
  const items = placed().map(it => {
    const [w, h] = foot(it), b = { id: it.id, x: it.pos.x, y: it.pos.y, w, h };
    if (it.t) return { ...b, kind: 'obj', t: it.t, lv: it.lv };
    if (it.away) return { ...b, kind: 'away' };
    return { ...b, kind: it.egg ? 'egg' : 'mon', svg: creatureSVG(it.k, { mood: it.mood, egg: it.egg, gold: it.gold }), insp: it.insp > Date.now() };
  });
  const cells = it => { const [w, h] = foot(it), out = []; for (let y = 0; y < S.rows; y++) for (let x = 0; x < S.cols; x++) if (fits(w, h, x, y, it)) out.push([x, y]); return out; };
  const valid = placing ? cells(placing) : mode === 'sel' ? cells(findIt(sel)).filter(([x, y]) => x !== findIt(sel).pos.x || y !== findIt(sel).pos.y) : null;
  const t = mode === 'suelo' ? tool : 'move';
  const opts = { cols: S.cols, rows: S.rows, focus: focusId, items, OBJS, tiles: S.tiles, tool: t, paints: !!GROUNDS[t], rain: raining, mode: placing ? 'placing' : build ? 'build' : 'play', valid, selected: mode === 'sel' ? sel : null, preview, closeUp: mode === 'sel',
    onTap: tap3d, onCell: (x, y) => placing ? tapCell(x, y, null) : moveSel(x, y), onMiss: () => { if (sel) { sel = null; go(); } },
    canPlace: (id, x, y) => { const it = findIt(id), [w, h] = foot(it); return fits(w, h, x, y, it); },
    onMove: (id, x, y) => { const it = findIt(id); if (x === null) { buzz(30); toast('No entra ahí'); return; } if (sel !== id) { sel = id; selFrom = { ...it.pos }; } it.pos = { x, y }; buzz(12); save(); go(); },
    onLong: id => { const it = findIt(id); if (!it || it.away) return; build = true; tool = 'move'; pick(id); focusId = null; setFocus(null); buzz([10, 30, 10]); go(); } };
  // Terreno: cada toque cambia la casilla y se vuelve a armar sólo la isla (sin redibujar la pantalla)
  let errAt = 0;
  opts.onTile = (x, y) => {
    const before = JSON.stringify(S.tiles);
    const err = GROUNDS[t] ? paintTile(x, y, t) : t === 'raise' ? raiseTile(x, y) : t === 'ramp' ? rampTile(x, y) : t === 'fall' ? cascadeTile(x, y) : null;
    if (err) { if (Date.now() - errAt > 1500) { toast(err); buzz(30); } errAt = Date.now(); return; }
    if (JSON.stringify(S.tiles) === before) return;
    if (Date.now() - undoAt > 700) { undoStack.push(before); if (undoStack.length > 40) undoStack.shift(); }
    undoAt = Date.now();
    const u = $('#undo', stg); if (u) u.disabled = false;
    flashTile(x, y); buzz(5); save(); mountScene(stg, { ...opts, tiles: S.tiles });
  };
  mountScene(stg, opts);
  $('#rotL', stg) && ($('#rotL', stg).onclick = () => rotateCam(-1));
  $('#rotR', stg) && ($('#rotR', stg).onclick = () => rotateCam(1));
  $('#zIn', stg) && ($('#zIn', stg).onclick = () => zoomCam(1.2));
  $('#zOut', stg) && ($('#zOut', stg).onclick = () => zoomCam(1 / 1.2));
  stg.querySelectorAll('.bubble-ink').forEach(b => b.onclick = e => { e.stopPropagation(); harvest([findIt(b.dataset.c)], b); });
  if (editing) bindBuild(stg);
  bindDock(v);
  if (focusId) bindFocus(stg, findIt(focusId));
  clearInterval(idleT);
  idleT = setInterval(() => {
    if (ui.tab !== 'home' || document.hidden || build || placing || focusId) return;
    hopAll(.25);
    const mons = S.creatures.filter(c => c.pos && !c.away && !c.egg);
    if (mons.length > 1 && Math.random() < .35) emoteAt(mons[Math.random() * mons.length | 0].id, ['♪', '♥', '！', '…', 'ｚ', '✿'][Math.random() * 6 | 0]);
    if (!stg.querySelector('.bubble-ink') && placed().some(it => pending(it) >= 1)) go();
  }, 2500);
}
// ---------- Construir ----------
const pick = id => { sel = id; selFrom = findIt(id)?.pos ? { ...findIt(id).pos } : null; buyPick = null; };
const thumb = it => it.t ? `<img src="${artThumb(OBJS[it.t].art)}" alt="">` : creatureSVG(it.k, { mood: it.mood, egg: it.egg, gold: it.gold });
const short = n => n.split(' ')[0];
const inkSvg = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3c3 4.5 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 3-6.5 6-11z"/></svg>`;
// Dónde aparece lo que se compra: la casilla libre más cerca del centro de la isla (bien a la vista)
function previewSpot(k) {
  const d = OBJS[k]; let best = null, bd = 1e9;
  for (let y = 0; y < S.rows; y++) for (let x = 0; x < S.cols; x++) {
    if (!fits(d.w, d.h, x, y)) continue;
    const dd = Math.hypot(x + d.w / 2 - S.cols / 2, y + d.h / 2 - S.rows / 2); if (dd < bd) { bd = dd; best = { x, y }; }
  }
  return best ? { t: k, ...best, w: d.w, h: d.h } : null;
}
function topHTML(mode) {
  const wallet = `<div class="bm-wallet ${mode === 'shop' || mode === 'buy' ? 'dark' : ''}">${inkSvg(16)}<b>${S.ink}</b></div>`;
  if (mode === 'buy') return `<div class="bm-top">${wallet}</div>`;
  const nextI = ISLANDS[(S.island || 0) + 1];
  return `<div class="bm-top">
    <button class="bm-done" id="build" aria-label="Terminar de construir"><span>${ic('check')}</span>Listo</button>
    <div class="bm-isle"><b>${S.cols}×${S.rows}</b><div class="bm-pips"><span><em>置</em>${shownObjs()}/${objCap()}</span><span><em>獣</em>${shownMons()}/${monCap()}</span><span><em>和</em>${Math.round(harmony())}</span></div>
      ${nextI ? `<button class="bm-plus" id="expandRow" aria-label="Ampliar a ${nextI.n}×${nextI.n} por ${nextI.cost} de tinta">${ic('plus')}</button>` : ''}</div>
    ${wallet}
  </div>`;
}
const SEG = [['inv', 'bag', 'Mochila'], ['shop', 'shop', 'Tienda'], ['suelo', 'mount', 'Terreno']];
function sheetHTML() {
  const inv = stored(), invO = inv.filter(it => it.t), invM = inv.filter(it => !it.t);
  const chip = (attr, id, cur, label, n) => `<button class="bm-chip ${cur === id ? 'on' : ''}" ${attr}="${id}">${label}${n != null ? ` <small>${n}</small>` : ''}</button>`;
  const pages = (cards, empty) => {
    if (!cards.length) return `<div class="bm-empty">${empty}</div>`;
    const out = []; for (let i = 0; i < cards.length; i += 8) out.push(`<div class="bm-page">${cards.slice(i, i + 8).join('')}</div>`);
    return `<div class="bm-pages" data-n="${out.length}">${out.join('')}</div>`;
  };
  const pager = n => n > 1 ? `<div class="bm-pager">${Array.from({ length: n }, (_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>` : '';
  let body = '', foot = '', n = 1;
  if (trayTab === 'inv') {
    // Objetos iguales (mismo tipo y nivel) se apilan con ×N
    let cards;
    if (invSub === 'mon') cards = invM.map(it => `<button class="bm-tile" data-place="${it.id}">${thumb(it)}<span class="lv">${it.k} · ${it.egg ? 'Huevo' : 'Nv' + it.lv}</span></button>`);
    else {
      const g = new Map(); invO.filter(it => invSub === 'obj' || OBJS[it.t].cat === invSub).forEach(it => { const k = it.t + '|' + it.lv; g.set(k, [...(g.get(k) || []), it]); });
      cards = [...g.values()].map(l => { const it = l[0]; return `<button class="bm-tile" data-place="${it.id}">${l.length > 1 ? `<span class="cnt">×${l.length}</span>` : ''}${thumb(it)}<span class="lv">${short(OBJS[it.t].name)} · Nv${it.lv}</span></button>`; });
    }
    n = Math.ceil(cards.length / 8);
    body = `<div class="bm-chips">${chip('data-isub', 'obj', invSub, 'Objetos', invO.length)}${chip('data-isub', 'mon', invSub, 'KANJŪ', invM.length)}${chip('data-isub', 'nat', invSub, 'Naturaleza')}${chip('data-isub', 'luz', invSub, 'Luces')}</div>
      ${pages(cards, invSub === 'mon' ? 'Todos tus KANJŪ están en la isla' : `No tenés objetos guardados<button class="bm-link" data-seg="shop">${ic('shop')}Ir a la Tienda</button>`)}`;
    foot = `<span class="bm-hint">${ic('hand')}Arrastralo a la isla · gratis</span>`;
  } else if (trayTab === 'shop') {
    const own = t => S.objs.filter(o => o.t === t).length;
    const cards = Object.entries(OBJS).filter(([, d]) => !d.hide && d.cat === shopSub).sort((a, b) => a[1].rank - b[1].rank || a[1].cost - b[1].cost).map(([k, d]) => {
      const lock = S.rank.lv < d.rank, c = objCost(k), o = own(k);
      if (lock) return `<button class="bm-card lock" disabled aria-label="${d.name}: rango ${d.rank}"><img src="${artThumb(d.art)}" alt=""><span class="lk">${ic('lock')}Rango ${d.rank}</span></button>`;
      return `<button class="bm-card" data-pick="${k}" aria-label="${d.name}, ${c} de tinta">${o ? `<span class="tag own">TENÉS ${o}</span>` : d.rank === S.rank.lv ? `<span class="tag new">NUEVO</span>` : ''}<img src="${artThumb(d.art)}" alt=""><span class="price ${S.ink < c ? 'no' : ''}">${inkSvg(11)}${c}</span></button>`;
    });
    n = Math.ceil(cards.length / 8);
    body = `<div class="bm-chips">${Object.entries(CATS).map(([id, l]) => chip('data-ssub', id, shopSub, l)).join('')}</div>${pages(cards, 'Nada por acá todavía')}`;
    foot = `<span class="bm-hint">Tocá para ver el detalle antes de comprar</span>`;
  } else {
    body = `<div class="bm-lab">Pintar suelo <span>Arrastrá el dedo · gratis</span></div>
      <div class="bm-sw">${Object.entries(GROUNDS).filter(([id]) => id !== 'snow').map(([id, g]) => `<button class="${tool === id ? 'on' : ''}" data-tool="${id}" aria-pressed="${tool === id}"><i style="background:${g.c}"></i>${g.n}</button>`).join('')}</div>
      <div class="bm-lab">Dar forma</div>
      <div class="bm-tools">${[['raise', 'Relieve', 'Subir 1·2·3'], ['ramp', 'Rampa', 'Une alturas'], ['fall', 'Cascada', 'Sube el agua']].map(([id, l, s]) => `<button class="${tool === id ? 'on' : ''}" data-tool="${id}" aria-pressed="${tool === id}">${TOOL_SVG[id]}<span>${l}<small>${s}</small></span></button>`).join('')}</div>`;
  }
  return `<div class="bm-sheet t-${trayTab}">
    <div class="bm-grab"></div>
    <div class="bm-seg">${SEG.map(([id, i, l]) => `<button class="${trayTab === id ? 'on' : ''}" data-seg="${id}">${ic(i)}${l}${id === 'inv' && inv.length ? ` <span class="n">${inv.length}</span>` : ''}</button>`).join('')}</div>
    ${body}
    ${foot ? `<div class="bm-foot">${foot}${pager(n)}</div>` : ''}
  </div>`;
}
// Ficha de compra: qué es, qué da y cuánto cuesta; la isla muestra dónde va a aparecer
function buyHTML(k, spot) {
  const d = OBJS[k], c = objCost(k), mine = stored().filter(o => o.t === k), poor = S.ink < c, [e1, e2] = objEff(k), K = KANJI[d.k];
  const read = K ? `${d.k} ${romaji((K.kun?.[0] || K.on?.[0] || '').replace(/[.-].*/, ''))} · ${K.m}` : d.k;
  const lit = ['farol', 'chochin', 'brasero', 'incienso'].includes(d.art) && e1 !== 'De noche';
  return `<div class="bm-sheet bm-buy">
    <div class="bm-grab"></div>
    <button class="bm-x" id="bbX" aria-label="Cerrar">${ic('x')}</button>
    <div class="bb-hero"><div class="bb-art"><img src="${artThumb(d.art)}" alt=""></div>
      <div><div class="bb-kind">${CATS[d.cat]} · ${d.w}×${d.h}</div><h2>${d.name}</h2><div class="bb-k">${read}</div></div></div>
    <div class="bb-stats"><div><b>${e1}</b><small>${e2}</small></div><div><b>和 +${d.har}</b><small>Armonía</small></div><div><b>${lit ? 'De noche' : d.w + '×' + d.h}</b><small>${lit ? 'se enciende' : 'casillas'}</small></div></div>
    ${mine.length ? `<div class="bb-own"><span>Ya tenés ${mine.length} en la Mochila</span><button data-place="${mine[0].id}">Usar el mío</button></div>` : ''}
    <button class="bb-buy" id="bbBuy" ${poor ? 'disabled' : ''}>${poor ? `Faltan ${c - S.ink}` : 'Comprar'} <span>${inkSvg(14)}${c}</span></button>
    <p class="bb-after">${poor ? 'Conseguí tinta cuidando a tus KANJŪ' : `Te quedan ${S.ink - c} 墨 · ${spot ? 'aparece en la casilla verde' : 'va a tu Mochila: no hay lugar libre'}`}</p>
  </div>`;
}
// Seleccionado: nombre y acciones debajo del objeto (siguen a la cámara), flechas para arrastrar
function ctxHTML(it) {
  const isObj = !!it.t, name = isObj ? OBJS[it.t].name : `${it.k} · ${KANJI[it.k].m}`, sub = isObj ? `Nv${it.lv} · ${objEff(it.t).join(' ')}` : it.egg ? 'Huevo' : `Nv${it.lv}`;
  return `<div class="bm-ctx" data-anchor="${it.id}" data-foot>
    <i class="ar a1">${ic('left')}</i><i class="ar a2">${ic('right')}</i><i class="ar a3">${ic('left')}</i>
    <div class="nm">${name}<small>${sub}</small></div>
    <div class="acts">
      <button class="bm-act" data-a="store" ${!isObj && storeFree() <= 0 ? 'disabled' : ''}><span>${ic('bagIn')}</span>Guardar</button>
      ${isObj && it.lv < OBJ_MAX ? `<button class="bm-act up" data-a="up" ${S.ink < upCost(it) ? 'disabled' : ''}><span>${ic('arrowUp')}</span>Mejorar <em>墨 ${upCost(it)}</em></button>` : ''}
      ${isObj ? `<button class="bm-act sell" data-a="sell"><span>${ic('trash')}</span>Vender <em>+${sellValue(it)}</em></button>` : ''}
    </div>
  </div>`;
}
function miniHTML(it) {
  const name = it.t ? OBJS[it.t].name.toLowerCase() : it.k;
  return `<div class="bm-mini"><span class="bm-grab"></span>
    <p><b>Moviendo ${it.t ? 'el ' + short(name) : 'a ' + name}</b>Arrastralo a una casilla verde. Tocá afuera para soltarlo.</p>
    <button class="bm-circ" data-a="undo" aria-label="Deshacer" ${selFrom && (selFrom.x !== it.pos.x || selFrom.y !== it.pos.y) ? '' : 'disabled'}>${ic('undo')}</button>
    <button class="bm-circ ok" data-a="x" aria-label="Confirmar">${ic('check')}</button>
  </div>`;
}
function bindBuild(stg) {
  const pg = $('.bm-pages', stg), dots = stg.querySelectorAll('.bm-pager i');
  if (pg) {
    const k = 'bm.' + trayTab + invSub + shopSub;
    try { pg.scrollLeft = +(sessionStorage.getItem(k) || 0); } catch {}
    const upd = () => { const i = Math.round(pg.scrollLeft / pg.clientWidth); dots.forEach((d, j) => d.classList.toggle('on', i === j)); try { sessionStorage.setItem(k, pg.scrollLeft); } catch {} };
    pg.onscroll = upd; upd();
  }
  stg.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { trayTab = b.dataset.seg; buyPick = null; sel = null; tool = trayTab === 'suelo' ? (tool === 'move' ? 'grass' : tool) : 'move'; buzz(5); go(); });
  stg.querySelectorAll('[data-isub]').forEach(b => b.onclick = () => { invSub = b.dataset.isub; buzz(5); go(); });
  stg.querySelectorAll('[data-ssub]').forEach(b => b.onclick = () => { shopSub = b.dataset.ssub; buzz(5); go(); });
  stg.querySelectorAll('[data-tool]').forEach(b => b.onclick = () => { tool = b.dataset.tool; buzz(6); go(); });
  $('#undo', stg) && ($('#undo', stg).onclick = () => { const prev = undoStack.pop(); if (!prev) return; S.tiles = JSON.parse(prev); buzz(8); save(); go(); });
  const place = (id, at) => {
    const it = findIt(id);
    if (it.t ? shownObjs() >= objCap() : !monFits(it)) { buzz(30); return toast(it.t ? `置 La isla ya tiene ${objCap()} objetos · tocá + para ampliarla` : `獣 No quedan plazas para ${it.k} · guardá a otro KANJŪ`); }
    if (settle(it, at) !== 'grid') { buzz(30); return toast('No hay lugar libre · mové o guardá algo'); }
    it.prodAt ??= Date.now(); pick(it.id); selFrom = null; buzz(12); save(); go();
  };
  // Mochila: tocar lo pone en un lugar libre; arrastrarlo hacia arriba lo suelta en la casilla elegida
  stg.querySelectorAll('[data-place]').forEach(b => {
    b.onclick = () => { if (!b.dataset.dragged) place(b.dataset.place); };
    b.onpointerdown = e => {
      const x0 = e.clientX, y0 = e.clientY; let ghost = null;
      const mv = ev => {
        if (!ghost && y0 - ev.clientY > 18 && Math.abs(ev.clientX - x0) < y0 - ev.clientY) {
          ghost = b.querySelector('img,svg').cloneNode(true); ghost.classList.add('bm-ghost'); document.body.append(ghost); b.dataset.dragged = 1; buzz(6);
        }
        if (ghost) { ev.preventDefault(); ghost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) translate(-50%, -85%)`; }
      };
      const up = ev => {
        removeEventListener('pointermove', mv); removeEventListener('pointerup', up); removeEventListener('pointercancel', up);
        if (!ghost) return; ghost.remove(); setTimeout(() => delete b.dataset.dragged, 0);
        if (ev.type === 'pointerup') { const t = tileAtScreen(ev.clientX, ev.clientY); if (t) place(b.dataset.place, t); }
      };
      addEventListener('pointermove', mv, { passive: false }); addEventListener('pointerup', up); addEventListener('pointercancel', up);
    };
  });
  stg.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => { buyPick = b.dataset.pick; sel = null; buzz(6); go(); });
  $('#bbX', stg) && ($('#bbX', stg).onclick = () => { buyPick = null; go(); });
  $('#bbBuy', stg) && ($('#bbBuy', stg).onclick = () => {
    const k = buyPick, d = OBJS[k], c = objCost(k), spot = previewSpot(k);
    if (S.ink < c) return;
    S.ink -= c; const o = newObj(k); buyPick = null; buzz([10, 40, 20]);
    if (spot && o.pos) { o.pos = { ...spot }; settle(o, spot); }
    if (o.pos) { pick(o.id); selFrom = null; toast(`¡Comprado! ${d.name}`); } else { trayTab = 'inv'; invSub = 'obj'; toast(`¡Comprado! ${d.name} quedó en tu Mochila`); }
    save(); hud(); go();
  });
  stg.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
    const it = findIt(sel), a = b.dataset.a;
    if (a === 'x') sel = null;
    else if (a === 'undo') { if (selFrom) it.pos = { ...selFrom }; }
    else if (a === 'store') { gather(it); it.pos = null; sel = null; toast(`${it.t ? OBJS[it.t].name : it.k} guardado en tu Mochila`); }
    else if (a === 'up') { gather(it); S.ink -= upCost(it); it.lv++; toast(`${OBJS[it.t].name} subió a Nv${it.lv}`); buzz(20); }
    else if (a === 'sell') { S.ink += sellValue(it); S.objs = S.objs.filter(o => o !== it); sel = null; toast('Vendido'); }
    buzz(6); save(); hud(); go();
  });
}
function moveSel(x, y) {
  const it = sel && findIt(sel);
  if (it) { const [w, h] = foot(it); if (fits(w, h, x, y, it)) { it.pos = { x, y }; buzz(12); save(); return go(); } }
  if (sel) { sel = null; go(); }
}
// Vista de primer plano (como en Rebyters): la cámara se acerca a la criatura y aparece su tarjeta
function focusHTML(c) {
  const K = KANJI[c.k], t = TYPES[typeOf(c.k)];
  return `<div class="focus-card" style="--t:${t.col}">
    <button class="fc-x" id="fcX" aria-label="Volver a la isla">${ic('x')}</button>
    <div class="fc-top"><span class="fc-k">${c.k}</span><div class="fc-info"><b>${K.m}</b><small>${gradeTag(c.k, 'short')} <span class="fc-t">${t.k} ${t.name}</span> · Nv ${c.lv}/${MAX_LV}${c.stars ? ' · ' + '★'.repeat(c.stars) : ''}</small>
      <div class="fc-bars"><span title="EXP"><i style="width:${c.exp / expNeed(c.lv) * 100}%"></i></span><span class="b" title="Ánimo"><i style="width:${c.mood * 100}%"></i></span></div></div></div>
    <div class="fc-acts"><button class="fc-a main" id="fcTrain">${ic('target')}Entrenar</button><button class="fc-a" id="fcPet">${ic('heart')}Mimar</button><button class="fc-a" id="fcSheet">${ic('book')}Ficha</button></div>
  </div>`;
}
function bindFocus(stg, c) {
  $('#fcX', stg).onclick = () => { focusId = null; setFocus(null); go(); };
  $('#fcTrain', stg).onclick = () => openTraining(c, { close() {} });
  $('#fcSheet', stg).onclick = () => openCreature(c.id);
  $('#fcPet', stg).onclick = () => {
    c.mood = Math.min(1, c.mood + .12); c.bond = (c.bond || 0) + 1; bump('pet'); giveExp(c, 1); emit('pet');
    poke(c.id); emoteAt(c.id, '♥'); buzz(6); save();
    stg.querySelector('.fc-bars .b i').style.width = c.mood * 100 + '%';
  };
}
export const unfocus = () => { if (focusId) { focusId = null; setFocus(null); } };
function tap3d(id) {
  const it = findIt(id);
  if (!it) { if (focusId) { focusId = null; setFocus(null); go(); } return; }
  buzz(8);
  if (build) { if (it.away) return toast(`${it.k} está de viaje`); if (sel === id) sel = null; else pick(id); return go(); }
  if (it.t) return toast(`${OBJS[it.t].k} ${OBJS[it.t].name} Nv${it.lv} · ${OBJS[it.t].desc}`);
  if (it.away) return toast(`${it.k} está de viaje`);
  if (it.egg) {
    it.cracks = (it.cracks || 0) + 1;
    if (it.cracks >= 3) { delete it.egg; delete it.cracks; save(); setTimeout(() => { go(); hatched(it); }, 350); }
    else { emoteAt(id, it.cracks === 1 ? '…' : '！！'); save(); }
    return;
  }
  focusId = it.id; setFocus(it.id); emit('sheet'); go();
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
// Sobre la escena sólo queda Construir (abajo a la derecha); en modo construcción, también la Mochila
function ctrlHTML() {
  return `${build ? `<button class="build-pill alt" id="store">${ic('bag')}<span>Mochila</span>${S.gate.length ? `<b>${S.gate.length}</b>` : ''}</button>` : ''}
    <button class="build-pill ${build ? 'on' : ''}" id="build">${ic(build ? 'check' : 'build')}<span>${build ? 'Listo' : 'Construir'}</span></button>`;
}
// Girar la isla de a 90° y acercar/alejar (también se gira arrastrando y se hace zoom pellizcando)
function camHTML() {
  return `<div class="cam-ctrl"><button id="rotL" aria-label="Girar a la izquierda">${ic('rotL')}</button><button id="rotR" aria-label="Girar a la derecha">${ic('rotR')}</button><button id="zOut" aria-label="Alejar">${ic('minus')}</button><button id="zIn" aria-label="Acercar">${ic('plus')}</button></div>`;
}
// Modo Construir: mover objetos o editar el suelo (tiles, relieve, rampa y cascada)
const TOOL_SVG = {
  raise: '<svg viewBox="0 0 46 46" aria-hidden="true"><rect x="4" y="26" width="10" height="14" fill="#8DBF5E" stroke="#1A1220" stroke-width="2.5"/><rect x="18" y="10" width="10" height="30" fill="#8DBF5E" stroke="#1A1220" stroke-width="2.5"/><rect x="32" y="18" width="10" height="22" fill="#8DBF5E" stroke="#1A1220" stroke-width="2.5"/></svg>',
  ramp: '<svg viewBox="0 0 46 46" aria-hidden="true"><path d="M4 40 L42 40 L42 14 Z" fill="#8DBF5E" stroke="#2E2620" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 34 L30 24" stroke="#2E2620" stroke-width="2.5" stroke-linecap="round"/><path d="M24 23 L30 24 L28 30" fill="none" stroke="#2E2620" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  fall: '<svg viewBox="0 0 46 46" aria-hidden="true"><path d="M4 14 H24 V40 H4 Z" fill="#A47D55" stroke="#2E2620" stroke-width="2.5"/><path d="M4 12 H26 V16 H4 Z" fill="#5AA5D2" stroke="#2E2620" stroke-width="2"/><path d="M26 14 C33 16 32 28 33 40" fill="none" stroke="#5AA5D2" stroke-width="6" stroke-linecap="round"/><path d="M24 40 H44" stroke="#5AA5D2" stroke-width="4" stroke-linecap="round"/></svg>',
};
const TOOL_HINT = { move: 'Tocá un objeto o KANJŪ para moverlo, guardarlo o mejorarlo', raise: 'Tocá una casilla para subirla; en la cima vuelve a llano', ramp: 'Tocá una casilla al pie de una colina', fall: 'Tocá agua para subirla; cae por los bordes más bajos' };
function bindDock(v) {
  if (placing) { $('#cancelPlace', v).onclick = () => { placing = null; go(); }; }
  else {
    $('#build', v) && ($('#build', v).onclick = () => { build = !build; tool = 'move'; sel = null; buyPick = null; trayTab = 'inv'; undoStack.length = 0; focusId = null; setFocus(null); buzz(6); go(); });
    $('#store', v) && ($('#store', v).onclick = () => openStorage());
    $('#collectAll', v) && ($('#collectAll', v).onclick = e => harvest(placed(), e.currentTarget));
    $('#dojo', v) && ($('#dojo', v).onclick = openDojo);
    $('#acadFab', v) && ($('#acadFab', v).onclick = () => openAcademy(acadCtx()));
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
    $('#build', v) && ($('#build', v).onclick = () => { build = !build; focusId = null; setFocus(null); buzz(6); go(); });
    $('#store', v) && ($('#store', v).onclick = () => openStorage());
    $('#collectAll', v) && ($('#collectAll', v).onclick = e => harvest(placed(), e.currentTarget));
    $('#dojo', v) && ($('#dojo', v).onclick = openDojo);
  }
  $('#expandRow', v) && ($('#expandRow', v).onclick = buyRow);
  clearInterval(idleT);
  idleT = setInterval(() => {
    if (ui.tab !== 'home' || document.hidden || build || placing) return;
    const mons = [...grid.querySelectorAll('.it.mon:not(.egg)')];
    mons.forEach(el => Math.random() < .3 && (el.classList.remove('hop'), void el.offsetWidth, el.classList.add('hop')));
    if (mons.length > 1 && Math.random() < .35) emote(mons[Math.random() * mons.length | 0], ['♪', '♥', '！', '…', 'ｚ', '✿'][Math.random() * 6 | 0]);
  }, 2500);
}
export const findIt = id => S.creatures.find(c => c.id === id) || S.objs.find(o => o.id === id);
export function itemHTML(it) {
  const [w, h] = foot(it), p = it.pos, n = pending(it);
  const style = `--x:${p.x};--y:${p.y};--w:${w};--h:${h}`;
  const bub = n >= 1 ? `<button class="bubble-ink ${full(it) ? 'full' : ''}" data-c="${it.id}">${ic('ink')}</button>` : '';
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
      <button class="btn ghost" id="st" ${(!isObj && storeFree() <= 0) || it.away ? 'disabled' : ''}>蔵 Guardar</button>
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
  if (!placing.pos && (placing.t ? shownObjs() >= objCap() : !monFits(placing))) { toast(placing.t ? `置 La isla ya tiene ${objCap()} objetos · ampliala en 匠` : `獣 Ocupa ${slot(placing)} plazas y quedan ${monCap() - shownMons()} · guardá uno o ampliá la isla`); buzz(30); return; }
  const it = placing; it.pos = { x, y }; it.prodAt ??= Date.now(); placing = null; buzz(12); go();
  const near = neighbors(it).map(o => OBJS[o.t].k).join(' ');
  if (!it.t && near) toast(`${it.k} recibe el aura de ${near}`);
}
export function buyRow() {
  const nx = ISLANDS[(S.island || 0) + 1], r = buyIsland();
  if (r === 'max') return toast('Tu isla ya es la más grande');
  if (r === 'rank') return toast(`${nx.name}: necesitás rango ${nx.rank}`);
  if (r === 'ink') return toast(`Te faltan ${nx.cost - S.ink} 墨 para la ${nx.name}`);
  buzz([20, 60, 20]); hud(); toast(`拡 ¡${island().name} ${S.cols}×${S.rows}! Más lugar para KANJŪ y objetos`); go();
}
// Almacén por categorías: KANJŪ, objetos (decoración y edificios), evolución (piezas) y consumibles
let storeTab = 'mon';
export function openStorage(tab) {
  if (tab) storeTab = tab;
  ui.sub = storeTab === 'mon' ? 'kan' : 'bag'; ui.tab = 'trainer'; go();
}
export const storeTabNow = () => storeTab, setStoreTab = t => storeTab = t;
export const CONSUMABLES = [
  { id: 'scroll', k: '巻', name: 'Pergamino de saber', use: '+60 EXP: usalo desde la ficha de una criatura' },
  { id: 'wind', k: '風', name: 'Viento veloz', use: 'Termina un viaje al instante: usalo en 旅 Viajes' },
];
export function storedMenu(it, parent) {
  const isObj = !!it.t, egg = !!it.egg, spot = findSpot(...foot(it));
  const capOk = isObj ? shownObjs() < objCap() : monFits(it);
  const free = monCap() - shownMons();
  const why = !capOk ? (isObj ? `La isla ya tiene ${objCap()} objetos. Guardá uno o ampliá la isla.` : `Ocupa ${slot(it)} ${slot(it) === 1 ? 'plaza' : 'plazas'} y en la isla quedan ${free} de ${monCap()}. Guardá uno o ampliá la isla.`)
    : spot ? '' : 'No hay lugar libre de ese tamaño. Ampliá la isla o guardá algo.';
  const m = modal(`<h3>${isObj ? `${OBJS[it.t].k} ${OBJS[it.t].name}` : egg ? '卵 Huevo misterioso' : `${it.k} · ${KANJI[it.k].m}`}</h3>
    ${egg ? '<p class="muted">Colocalo en la isla y tocalo 3 veces para que nazca.</p>' : isObj ? '' : `<p class="muted">${gradeTag(it.k)} · ocupa ${slot(it)} ${slot(it) === 1 ? 'plaza' : 'plazas'} (${monCap() - shownMons()} libres)</p>`}
    <div class="menu-acts">
    <button class="btn ok" id="put" ${spot && capOk ? '' : 'disabled'}>✥ Colocar en la isla</button>
    ${isObj ? `<button class="btn ghost" id="sell">Vender · +${sellValue(it)} 墨</button>` : egg ? '' : `<button class="btn ghost" id="see">Ver ficha</button><button class="btn ghost" id="free" ${S.creatures.filter(c => !c.egg).length <= 1 ? 'disabled' : ''}>放 Liberar</button>`}</div>
    ${why ? `<p class="r">${why}</p>` : ''}`);
  $('#put', m).onclick = () => { m.close(); parent.close(); placing = it; ui.tab = 'home'; go(); };
  $('#sell', m) && ($('#sell', m).onclick = () => { S.ink += sellValue(it); S.objs = S.objs.filter(o => o !== it); m.close(); parent.close(); go(); });
  $('#see', m) && ($('#see', m).onclick = () => { m.close(); parent.close(); openCreature(it.id); });
  $('#free', m) && ($('#free', m).onclick = () => { if (!confirm(`${it.k} volverá a la naturaleza. ¿Liberar?`)) return; const ink = release(it); m.close(); parent.close(); go(); toast(`+${ink} 墨`); });
}
export function rankUp(ups) {
  const r = ups[ups.length - 1];
  const m = modal(`<div class="result rank-up"><div class="rank-badge">位<b>${r}</b></div><h3>¡Rango ${r}!</h3>
    <p>+${ups.reduce((a, l) => a + 20 + l * 10, 0)} 墨 · +${ups.length} 札</p>
    ${ISLANDS.some(i => i.rank === r) ? `<p class="g">拡 Ya podés ampliar a la ${ISLANDS.find(i => i.rank === r).name} desde 匠 Construir</p>` : ''}
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
  return `<button class="goal" aria-label="Objetivo">${ic('target')}<span>${g}</span></button>`;
}
