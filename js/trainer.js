// KANJŪ · trainer.js — hoja del Entrenador (como Rebyters): Mochila · KANJŪ · Usuario
import { ic } from './icons.js';
import { artThumb } from './paper.js';
import { KANJI, PIECES, kLevel, MAX_LV, gradeTag } from './data.js';
import { creatureSVG } from './creature.js';
import { S, save, mastery, expNeed } from './state.js';
import { OBJS, STORE_COSTS, foot, storeFree, arrive, rankNeed, shownObjs, objCap, totalRate } from './world.js';
import { $, buzz, ui, go, hud, toast, owned, openMenu } from './main.js';
import { openCreature } from './sheet.js';
import { storedMenu, findIt, CONSUMABLES, storeTabNow, setStoreTab } from './sanctuary.js';
import { openDojo, allDue, acadCtx } from './dojo.js';
import { openAcademy, DAILY_GOAL } from './academy.js';
import { openQuests } from './atlas.js';
import * as cloud from './cloud.js';
import { t } from './i18n.js';
import { openDiary } from './diary.js';
import { foundIds } from './lex.js';

const noop = { close() {} };
export function viewTrainer(v) {
  (({ bag: bagTab, kan: kanTab, me: meTab })[ui.sub] || kanTab)(v);
}

// ---------- Mochila: objetos, piezas y consumibles ----------
function bagTab(v) {
  let tab = storeTabNow(); if (!['obj', 'evo', 'con'].includes(tab)) tab = 'obj';
  const objs = S.objs.filter(o => !o.pos), pcs = Object.keys(PIECES).filter(p => S.pieces[p]), cons = CONSUMABLES.filter(c => S.items[c.id]);
  const segs = [['obj', '飾', 'Objetos', objs.length], ['evo', '部', 'Piezas', pcs.reduce((a, p) => a + S.pieces[p], 0)], ['con', '品', 'Consumibles', cons.reduce((a, c) => a + S.items[c.id], 0)]];
  let body = '';
  if (tab === 'obj') body = `<p class="pn-lead">Toca un objeto para colocarlo en la isla · ${shownObjs()}/${objCap()} colocados</p>
    <div class="tr-grid">${objs.map(o => `<button class="tr-card" data-s="${o.id}"><span class="tr-th obj">${OBJS[o.t].art ? `<img class="obj-art" src="${artThumb(OBJS[o.t].art)}" alt="">` : `<i>${OBJS[o.t].k}</i>`}</span><span class="tr-t"><b>${OBJS[o.t].name}</b><small>Nv${o.lv} · ${OBJS[o.t].w}×${OBJS[o.t].h}</small></span></button>`).join('') || empty('No hay objetos guardados', 'Compra decoración y edificios en la Tienda')}</div>`;
  if (tab === 'evo') body = `<p class="pn-lead">Piezas 部品: se equipan desde la ficha de un KANJŪ para evolucionar o se suman en la fusión.</p>
    <div class="tr-grid">${pcs.map(p => `<div class="tr-card"><span class="tr-th obj"><i>${p}</i></span><span class="tr-t"><b>${PIECES[p].name}</b><small>${PIECES[p].m} · ×${S.pieces[p]}</small></span></div>`).join('') || empty('Sin piezas', 'Salen de viajes, cofres y la Tienda')}</div>`;
  if (tab === 'con') body = `<p class="pn-lead">Objetos de un solo uso.</p>
    <div class="tr-list">${cons.map(c => `<div class="tr-card wide"><span class="tr-th obj"><i>${c.k}</i></span><span class="tr-t"><b>${c.name} · ×${S.items[c.id]}</b><small>${c.use}</small></span></div>`).join('') || empty('No tienes consumibles', 'Están en la Tienda')}</div>`;
  v.innerHTML = `<div class="tr">
    <p class="eyebrow">Tu mochila</p><h2 class="pn-h">Inventario</h2>
    <div class="st-tabs">${segs.map(([id, k, l, n]) => `<button class="${tab === id ? 'on' : ''}" data-seg="${id}"><i>${k}</i><span>${l}</span>${n ? `<b>${n}</b>` : ''}</button>`).join('')}</div>
    ${body}
    <button class="btn ghost wide" id="toShop">${ic('bag')} Ir a la Tienda</button></div>`;
  v.querySelectorAll('[data-seg]').forEach(b => b.onclick = () => { setStoreTab(b.dataset.seg); buzz(5); go(); });
  v.querySelectorAll('[data-s]').forEach(b => b.onclick = () => storedMenu(findIt(b.dataset.s), noop));
  $('#toShop', v).onclick = () => { ui.tab = 'shop'; go(); };
}

// ---------- KANJŪ: toda la colección, dónde está cada uno, puerta y almacén ----------
const where = c => c.away ? ['旅', 'De viaje', 'trip'] : c.pos ? ['島', 'En la isla', 'isle'] : ['蔵', 'Almacén', 'store'];
function kanTab(v) {
  const list = [...S.creatures].sort((a, b) => (!!b.pos - !!a.pos) || b.lv - a.lv);
  const inStore = S.creatures.filter(c => !c.pos && !c.away).length, more = STORE_COSTS[(S.storeCap - 10) / 5];
  v.innerHTML = `<div class="tr">
    <p class="eyebrow">Tu colección</p><h2 class="pn-h">Mis KANJŪ</h2>
    <p class="pn-lead">${list.length} compañeros · ${owned()}/${Object.keys(KANJI).length} kanji en el Atlas · almacén ${inStore}/${S.storeCap}</p>
    ${S.gate.length ? `<h4>門 Esperando en la puerta</h4><div class="tr-list">${S.gate.map((g, i) => `<div class="tr-card wide"><span class="tr-th">${creatureSVG(g.k, { gold: g.gold })}</span><span class="tr-t"><b>${g.k} · ${KANJI[g.k].m}</b><small>No entra en el almacén</small></span><span class="tr-acts"><button class="btn ok" data-gin="${i}" ${storeFree() > 0 ? '' : 'disabled'}>Recibir</button><button class="btn ghost" data-gout="${i}">+${6 + kLevel(g.k) * 4}墨</button></span></div>`).join('')}</div>` : ''}
    <div class="tr-grid">${list.map(c => { const [k, l, cls] = where(c);
      return `<button class="tr-card" data-c="${c.id}"><span class="tr-th ${c.gold ? 'gold' : ''}">${creatureSVG(c.k, { egg: c.egg, gold: c.gold, mood: c.mood })}${c.egg ? '' : gradeTag(c.k, 'gem')}</span>
        <span class="tr-t"><b>${c.egg ? 'Huevo' : `${c.k} ${KANJI[c.k].m}`}</b><small>${c.egg ? '¿?' : `Nv ${c.lv}/${MAX_LV}${c.lv >= MAX_LV ? ' MAX' : ''}${c.stars ? ' · ' + '★'.repeat(c.stars) : ''}`}</small><em class="loc ${cls}">${k} ${l}</em></span></button>`; }).join('')}</div>
    ${more ? `<button class="btn ghost wide" id="moreStore">蔵 +5 lugares en el almacén · ${more} 墨</button>` : ''}</div>`;
  v.querySelectorAll('[data-c]').forEach(b => b.onclick = () => {
    const c = findIt(b.dataset.c); buzz(6);
    if (c.egg && c.pos) return toast('Toca el huevo en la isla 3 veces para que nazca');
    !c.pos && !c.away ? storedMenu(c, noop) : openCreature(c.id);
  });
  v.querySelectorAll('[data-gin]').forEach(b => b.onclick = () => { const g = S.gate.splice(+b.dataset.gin, 1)[0]; arrive(g.k, { gold: g.gold }); go(); });
  v.querySelectorAll('[data-gout]').forEach(b => b.onclick = () => { const g = S.gate.splice(+b.dataset.gout, 1)[0]; S.ink += 6 + kLevel(g.k) * 4; go(); });
  $('#moreStore', v) && ($('#moreStore', v).onclick = () => { if (S.ink < more) return toast(`Te faltan ${more - S.ink} 墨`); S.ink -= more; S.storeCap += 5; buzz(12); go(); });
}

// ---------- Usuario: rango con barra de progreso, estadísticas y accesos ----------
function meTab(v) {
  const need = rankNeed(S.rank.lv), due = allDue(), ax = S.acad?.day?.xp || 0;
  const learned = Object.keys(S.srs).filter(k => mastery(k) >= 3).length;
  v.innerHTML = `<div class="tr">
    <p class="eyebrow">Tu perfil</p><h2 class="pn-h">${cloud.user ? cloud.user.email.split('@')[0] : 'Guardián'}</h2>
    <div class="me-card">
      <span class="me-seal big"><i>守</i></span>
      <div class="me-c"><b>Guardián <em>${S.rank.lv}</em></b><div class="bar-k"><i style="width:${S.rank.xp / need * 100}%"></i></div><small>${Math.floor(S.rank.xp)}/${need} para el rango ${S.rank.lv + 1}</small></div>
    </div>
    <div class="me-stats">
      <div><b>${owned()}</b><small>Kanji</small></div><div><b>${learned}</b><small>Dominados</small></div>
      <div><b>${S.stats.evolutions + S.stats.fusions}</b><small>Evoluciones</small></div><div><b>${S.arena?.cups || 0}</b><small>Copas</small></div>
    </div>
    <div class="menu-list">
      <button class="row-k" id="uRev"><span class="row-ic ${due ? 'hot' : ''}">${ic('refresh')}</span><span class="row-t"><b>Repaso del día</b><small>${due ? `${due} para repasar hoy` : 'Todo al día · vuelve mañana'}</small></span>${due ? `<b class="row-n">${due}</b>` : ic('right', 'chev')}</button>
      <button class="row-k" id="uDiary"><span class="row-ic">${ic('pen')}</span><span class="row-t"><b>${t('diary.title')}</b><small>${t('diary.rowSub', { n: foundIds().length })}</small></span>${ic('right', 'chev')}</button>
      <button class="row-k" id="uQuest"><span class="row-ic">${ic('list')}</span><span class="row-t"><b>Misiones</b><small>Diarias y semanales</small></span>${ic('right', 'chev')}</button>
      <button class="row-k" id="uShop"><span class="row-ic">${ic('bag')}</span><span class="row-t"><b>Tienda</b><small>Invocar, decorar, edificios y piezas · ${totalRate()} 墨/h</small></span>${ic('right', 'chev')}</button>
      <button class="row-k" id="uCfg"><span class="row-ic">${ic('gear')}</span><span class="row-t"><b>Configuración</b><small>Cuenta, IA y ayuda de lectura</small></span>${ic('right', 'chev')}</button>
    </div></div>`;
  $('#uRev', v).onclick = openDojo;
  $('#uDiary', v).onclick = () => openDiary();
  $('#uQuest', v).onclick = openQuests;
  $('#uShop', v).onclick = () => { ui.tab = 'shop'; go(); };
  $('#uCfg', v).onclick = openMenu;
}
const empty = (t, s) => `<div class="tr-empty"><b>${t}</b><small>${s}</small></div>`;
