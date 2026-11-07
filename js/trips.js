// KANJŪ · trips.js
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
import { $, home, owned, go, hud, toast, modal } from './main.js';

// ---------- Expediciones ----------
export function viewExp(v) {
  const n = owned(), fast = tripMult();
  v.innerHTML = `<div class="exps"><p class="lead">Enviá a tus KANJŪ a explorar. Vuelven con tinta, experiencia y, a veces, nuevos amigos.</p>
  ${REGIONS.map(r => {
    const c = S.creatures.find(x => x.away?.region === r.id), lock = n < r.need;
    let inner;
    if (lock) inner = `<p class="muted">🔒 Obtené ${r.need} kanji para desbloquear (${n}/${r.need})</p>`;
    else if (c) {
      const left = Math.max(0, c.away.end - Date.now()), done = !left;
      inner = `<div class="trip"><div class="trip-mon ${done ? '' : 'walking'}">${creatureSVG(c.k)}</div><div class="trip-info"><b>${c.k} ${done ? 'regresó' : 'explorando…'}</b>
        <div class="tbar"><i style="width:${(1 - left / (c.away.secs * 1000)) * 100}%"></i></div><small data-end="${c.away.end}">${done ? '¡Listo!' : fmt(left)}</small></div>
        ${!done && S.items.wind ? `<button class="btn ghost" data-wind="${c.id}">風 ${S.items.wind}</button>` : `<button class="btn ${done ? 'ok' : 'ghost'}" data-collect="${c.id}" ${done ? '' : 'disabled'}>Recibir</button>`}</div>`;
    } else inner = `<div class="trip"><small>Hallazgos: ${r.drops.map(k => S.dex[k]?.seen ? k : '？').join(' ')} · ⏱ ${fmt(r.secs * fast * 1000)}${tracksHTML(r)}</small><button class="btn ok" data-send="${r.id}">Enviar</button></div>`;
    return `<section class="region ${lock ? 'locked' : ''}" style="--a:${r.bg[0]};--b:${r.bg[1]}"><header><span class="rk">${r.name}</span><b>${r.es}</b></header>${inner}</section>`;
  }).join('')}</div>`;
  v.querySelectorAll('[data-send]').forEach(b => b.onclick = () => pickForTrip(REGIONS.find(r => r.id === b.dataset.send), fast));
  v.querySelectorAll('[data-collect]').forEach(b => b.onclick = () => collect(byId(b.dataset.collect)));
  v.querySelectorAll('[data-wind]').forEach(b => b.onclick = () => { S.items.wind--; byId(b.dataset.wind).away.end = Date.now(); go(); });
}
export const fmt = ms => { const s = Math.ceil(ms / 1000); return s >= 60 ? `${s / 60 | 0}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`; };
export function pickForTrip(r, fast) {
  const free = home().filter(c => !c.egg && c.pos);
  const m = modal(`<h3>旅 ${r.es}</h3><p class="muted">¿Quién va? Las criaturas fuera no pueden entrenar ni fusionarse.</p>
    <div class="roster">${free.map(c => `<button class="chip-mon" data-id="${c.id}">${creatureSVG(c.k)}<small>${c.k} Lv${c.lv}</small></button>`).join('')}</div>`);
  m.querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const c = byId(b.dataset.id), secs = Math.round(r.secs * fast);
    c.away = { region: r.id, end: Date.now() + secs * 1000, secs };
    bump('exp'); m.close(); toast(`${c.k} partió hacia ${r.name}`); go(); emit('trip');
  });
}
// Huellas 足跡: cada viaje sin compañero deja huellas; con TRACKS_MAX el próximo hallazgo es seguro
export const TRACKS_MAX = 6, FIND_BASE = .06, FIND_PER_TRACK = .03;
const tracks = r => (S.tracks ??= {})[r.id] || 0;
const tracksHTML = r => `<span class="tracks">足跡 ${'●'.repeat(tracks(r))}${'○'.repeat(TRACKS_MAX - tracks(r))}</span>`;
export function collect(c) {
  const r = REGIONS.find(x => x.id === c.away.region);
  S.regionsDone ??= {}; S.tracks ??= {};
  S.regionsDone[r.id] = (S.regionsDone[r.id] || 0) + 1;
  const firstEver = !(S.stats.trips > 0); S.stats.trips = (S.stats.trips || 0) + 1;
  let ink = 4 + Math.round(r.secs / 15); const up = giveExp(c, r.secs / 3);
  c.away = null; c.mood = Math.min(1, c.mood + .2);
  let found = null, bonus = '', gained = 0;
  const t = tracks(r), chance = FIND_BASE + t * FIND_PER_TRACK;
  if (firstEver || t >= TRACKS_MAX || Math.random() < chance) {
    S.tracks[r.id] = 0;
    const fresh = r.drops.filter(k => !S.dex[k]?.owned);
    const k = fresh.length && Math.random() < .8 ? fresh[0] : r.drops[Math.random() * r.drops.length | 0];
    const res = arrive(k); found = res.c ? { k, store: res.where === 'store' } : { k, gate: true };
  } else {
    // Sin compañero: deja huellas (más en regiones lejanas) y trae algo útil
    gained = Math.min(TRACKS_MAX - t, r.secs >= 240 ? 2 : 1);
    S.tracks[r.id] = t + gained;
    r.drops.forEach(k => Math.random() < .5 && see(k));
    const roll = Math.random();
    if (roll < .15) { S.items.scroll = (S.items.scroll || 0) + 1; bonus = '巻 Encontró un pergamino de saber'; }
    else if (roll < .3) { S.items.wind = (S.items.wind || 0) + 1; bonus = '風 Encontró un viento veloz'; }
    else { const extra = Math.round(ink * .6); ink += extra; bonus = `Juntó tinta extra en el camino`; }
  }
  S.ink += ink;
  const m = modal(`<div class="result"><h3>${c.k} volvió de ${r.name}</h3>
    <p>+${ink} 墨 · +EXP${up ? ` · <b class="g">¡Nivel ${c.lv}!</b>` : ''}</p>
    ${found ? `<div class="newmon"><span class="new-tag">${found.gate ? '門 Espera en la puerta' : found.store ? '¡Nuevo! · está en el almacén' : '¡Nuevo KANJŪ!'}</span>${creatureSVG(found.k, { mood: 1 })}${storyHTML(found.k)}${found.gate ? '<small class="r">Santuario y almacén llenos. Liberá espacio para recibirlo.</small>' : ''}</div>` : `<p class="muted">No volvió acompañado, pero encontró huellas.</p><div class="tracks-big">足跡 ${'●'.repeat(tracks(r))}${'○'.repeat(TRACKS_MAX - tracks(r))}<small>${tracks(r) >= TRACKS_MAX ? '¡El próximo viaje a esta región trae un compañero seguro!' : `+${gained} · con ${TRACKS_MAX} huellas el próximo compañero es seguro`}</small></div>${bonus ? `<p class="g">${bonus}</p>` : ''}`}
    <button class="btn ok wide">Genial</button></div>`);
  $('.btn', m).onclick = () => { m.close(); go(); };
  hud();
}
