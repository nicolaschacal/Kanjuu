// KANJŪ · shop.js
import { ic } from './icons.js';
import { PIECES, KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { artThumb } from './paper.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { ISLANDS, island, buyIsland, harmony, COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { $, buzz, go, hud, toast, modal, scrHead } from './main.js';
import { rankUp } from './sanctuary.js';

// ---------- Tienda y Altar ----------
export const ITEMS = [
  { id: 'scroll', k: '巻', name: 'Pergamino de saber', cost: 30, desc: '+60 EXP para la criatura que elijas' },
  { id: 'wind', k: '風', name: 'Viento veloz', cost: 20, desc: 'Termina un viaje al instante' },
  { id: 'mochi', k: '餅', name: 'Caja de mochis', cost: 20, desc: 'Todas tus criaturas felices: producen más' },
  { id: 'incense', k: '香', name: 'Incienso', cost: 45, desc: 'Inspira a todo el santuario 1 h: ×2 tinta' },
];
function shopObjs(decor) {
  return Object.entries(OBJS).filter(([, d]) => (d.kind === 'decor') === decor && !d.hide).map(([t, d]) => { const lock = S.rank.lv < d.rank, n = S.objs.filter(o => o.t === t).length;
    return `<div class="shop-row ${lock ? 'locked' : ''}"><i class="shop-art">${d.art ? `<img src="${artThumb(d.art)}" alt="">` : d.k}</i><div><b>${d.name}${n ? ` · tenés ${n}` : ''}</b><small>${d.kind === 'decor' ? d.desc : d.desc} · ${d.w}×${d.h} · 和+${d.har}</small></div>
      <button class="btn ok" data-obj="${t}" ${lock || S.ink < objCost(t) ? 'disabled' : ''}>${lock ? `Rango ${d.rank}` : objCost(t) + ' 墨'}</button></div>`; }).join('');
}
let shopTab = 'inv';
const SHOP_TABS = [['inv', '召', 'Invocar'], ['dec', '飾', 'Decorar'], ['bld', '建', 'Edificios'], ['pcs', '部', 'Piezas']];
export function viewShop(v) {
  v.innerHTML = `<div class="shop">
    ${scrHead('店', 'Tienda', `Tu santuario produce ${totalRate()} 墨/h`, `<span class="pill-w">墨 <b>${S.ink}</b></span><span class="pill-w">札 <b>${S.tickets}</b></span>`)}
    <div class="seg">${SHOP_TABS.map(([id, k, l]) => `<button class="${shopTab === id ? 'on' : ''}" data-st="${id}"><i>${k}</i><span>${l}</span></button>`).join('')}</div>
    ${shopTab === 'inv' ? `
    <div class="altar-card">
      <div class="altar-top"><span class="ak">召</span><div><b>Altar de invocación</b><small>Componentes de las regiones que desbloqueaste · ${Math.round(GOLD_RATE * 100)}% dorado</small></div></div>
      <div class="pity"><span>Kanji nuevo garantizado en</span><b>${Math.max(1, PITY - S.pity)}</b><span>invocaciones</span></div>
      <div class="row"><button class="btn ok" data-pull="1">${S.tickets ? '札 ×1' : `${PULL} 墨`}<small>Invocar 1</small></button><button class="btn ok gold" data-pull="10">${S.tickets >= 10 ? '札 ×10' : `${PULL10} 墨`}<small>Invocar 10 · 1 nuevo seguro</small></button></div>
    </div>
    ` : ''}
    ${shopTab === 'dec' ? `
    ${(() => { const nx = ISLANDS[(S.island || 0) + 1]; return nx ? `<div class="isle-card"><span class="ak">拡</span><div><b>${nx.name} ${nx.n}×${nx.n}</b><small>${nx.mons} plazas de KANJŪ y ${nx.objs} objetos (ahora ${island().mons} y ${island().objs})</small></div><button class="btn ok gold" id="buyIsle" ${S.rank.lv < nx.rank || S.ink < nx.cost ? 'disabled' : ''}>${S.rank.lv < nx.rank ? `Rango ${nx.rank}` : nx.cost + ' 墨'}</button></div>` : ''; })()}
    <h4>和 Armonía ${Math.round(harmony())} <small>cada objeto suma armonía: +1% de tinta por punto (hasta +60%)</small></h4>
    ${shopObjs(true)}` : ''}
    ${shopTab === 'bld' ? `<h4>Edificios <small>tienen efecto sobre sus vecinos · mejoralos hasta Nv${OBJ_MAX}</small></h4>
    ${shopObjs(false)}` : ''}
    ${shopTab === 'pcs' ? `<h4>Piezas 部品 <small>accesorios para evolucionar y fusionar</small></h4>
    ${Object.entries(PIECES).map(([p, d]) => `<div class="shop-row"><i class="pc-i">${p}</i><div><b>${d.name} <small class="rmj">${d.rom}</small> · ${d.m}${S.pieces[p] ? ` · tenés ${S.pieces[p]}` : ''}</b><small>Forma ${d.ex}</small></div><button class="btn ok" data-piece="${p}" ${S.ink < d.cost ? 'disabled' : ''}>${d.cost} 墨</button></div>`).join('')}
` : ''}
    ${shopTab === 'inv' ? `<h4>Consumibles <small>se usan una vez</small></h4>
    ${ITEMS.map(it => `<div class="shop-row"><i>${it.k}</i><div><b>${it.name}${S.items[it.id] ? ` · tenés ${S.items[it.id]}` : ''}</b><small>${it.desc}</small></div><button class="btn ok" data-buy="${it.id}" ${S.ink < it.cost ? 'disabled' : ''}>${it.cost} 墨</button></div>`).join('')}
` : ''}
  </div>`;
  v.querySelectorAll('[data-st]').forEach(b => b.onclick = () => { shopTab = b.dataset.st; buzz(5); go(); });
  v.querySelectorAll('[data-piece]').forEach(b => b.onclick = () => {
    const p = b.dataset.piece; S.ink -= PIECES[p].cost; S.pieces[p] = (S.pieces[p] || 0) + 1; buzz(10);
    toast(`部品 ${p} ${PIECES[p].name} guardada · equipala desde la ficha de una criatura`); go();
  });
  v.querySelectorAll('[data-pull]').forEach(b => b.onclick = () => doPull(+b.dataset.pull));
  $('#buyIsle', v) && ($('#buyIsle', v).onclick = () => { const r = buyIsland(); if (r === 'ok') { buzz([20, 60, 20]); toast(`拡 ¡${island().name}! Más lugar para KANJŪ y objetos`); go(); } });
  v.querySelectorAll('[data-obj]').forEach(b => b.onclick = () => {
    const t = b.dataset.obj, d = OBJS[t]; S.ink -= objCost(t); const o = newObj(t); buzz(12);
    if (o.pos) { toast(`${d.k} colocado en la isla · 和+${d.har} · movelo con 匠 Construir`); } else toast(`${d.k} guardado en 蔵 Almacén › Objetos (la isla está llena)`);
    go();
  });
  v.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => {
    const it = ITEMS.find(x => x.id === b.dataset.buy); S.ink -= it.cost; buzz(10);
    if (it.id === 'mochi') { S.creatures.forEach(c => { c.mood = 1; c.bond += 2; }); toast('餅 Todos están felices'); }
    else if (it.id === 'incense') { S.creatures.forEach(c => { gather(c); c.insp = Date.now() + 36e5; }); toast('香 Todo el santuario está inspirado: ×2 tinta por 1 h'); }
    else { S.items[it.id] = (S.items[it.id] || 0) + 1; toast(`${it.k} ${it.name} guardado`); }
    go();
  });
}
export function doPull(n) {
  const useT = S.tickets >= n, cost = n === 1 ? PULL : PULL10;
  if (!useT && S.ink < cost) return toast(`Te faltan ${cost - S.ink} 墨 · también podés usar 札`);
  if (useT) S.tickets -= n; else S.ink -= cost;
  const res = pull(n); bump('pull', n);
  const fx = document.createElement('div'); fx.className = 'summon';
  fx.innerHTML = `<div class="rays"></div><div class="sum-grid n${n}">${res.map((r, i) => `<div class="sum-card ${r.isNew ? 'new' : ''} ${r.gold ? 'gold' : ''}" style="animation-delay:${.3 + i * .12}s">
    ${creatureSVG(r.k, { gold: r.gold })}<b>${r.k}</b><small>${KANJI[r.k].m}</small>${r.isNew ? '<em>NUEVO</em>' : r.gold ? '<em>DORADO</em>' : ''}${r.where === 'store' ? '<i>蔵</i>' : r.where === 'gate' ? '<i>門</i>' : ''}</div>`).join('')}</div>
    <div class="sum-cap"><p>${res.filter(r => r.isNew).length} nuevos · los huevos están en tu santuario o almacén</p><button class="btn ok">Continuar</button></div>`;
  document.body.append(fx); buzz([20, 80, 20, 80, 40]);
  $('.btn', fx).onclick = () => { fx.classList.add('out'); setTimeout(() => fx.remove(), 300); go(); };
  if (res.some(r => r.isNew)) addXP(30 * res.filter(r => r.isNew).length);
  save();
}

// ---------- Entrenador de kana ----------
export async function startKana() {
  const pool = kanaPool(reads);
  if (pool.length < 4) return toast('Conseguí más criaturas para tener sonidos que practicar');
  const r = await kanaDrill(pool, $('#layer'));
  const ink = r.right * 2; S.ink += ink; bump('review', r.right); const up = addXP(r.right * 2); save(); hud();
  toast(`仮 ${r.right}/${r.total} · +${ink} 墨`); if (up.length) rankUp(up);
}

// ---------- Calendario de entrada ----------
export function openLogin() {
  const day = S.login.day % 7;
  const m = modal(`<h3>暦 Regalo del día</h3><p class="muted">Avanza cada día que entrás. Si faltás, no perdés nada: sigue donde quedó.</p>
    <div class="cal">${LOGIN.map((r, i) => `<div class="cal-d ${i < day ? 'got' : i === day ? 'today' : ''}"><small>Día ${i + 1}</small><b>${r.ink ? `${r.ink}<i>墨</i>` : r.tickets ? `${r.tickets}<i>札</i>` : `${r.scroll}<i>巻</i>`}</b>${r.gold ? '<em>✦ dorado</em>' : ''}</div>`).join('')}</div>
    <button class="btn ok wide" id="claim">Recibir</button>`, 'onacct');
  m.onclick = null;
  $('#claim', m).onclick = () => { const r = claimLogin(); buzz([10, 40, 10]); m.close(); hud(); go(); toast(`Recibiste ${r.ink ? r.ink + ' 墨' : ''}${r.tickets ? ` ${r.tickets} 札` : ''}${r.scroll ? ` ${r.scroll} 巻` : ''}${r.gold ? ' · ¡tu próxima invocación será dorada!' : ''}`); };
}
