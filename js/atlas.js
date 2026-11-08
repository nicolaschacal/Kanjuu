// KANJŪ · atlas.js
import { ic } from './icons.js';
import { FAMILIES, PIECES } from './data.js';
const famReward = f => 30 * f.members.length;import { KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { $, buzz, MISSIONS, WEEKLY, ACHIEVEMENTS, owned, hud, toast, modal, floatText } from './main.js';
import { scrHead } from './main.js';

// ---------- Atlas (como el de Rebyters) ----------
// Pantalla limpia: solo los KANJŪ en casillas, los no descubiertos bloqueados.
// Al tocar uno se abre su linaje completo: pre-evoluciones y evoluciones por nivel.
const LV_NAMES = ['Componentes fundamentales', 'Primera composición', 'Composición intermedia', 'Composición compleja', 'Composición avanzada'];
const found = k => !!S.dex[k]?.owned;
const ancestors = (k, out = new Set()) => { for (const r of KANJI[k]?.recipes || []) for (const p of r) if (KANJI[p] && !out.has(p)) { out.add(p); ancestors(p, out); } return out; };
const descendants = (k, out = new Set()) => { for (const c of evolutionsOf(k)) if (!out.has(c)) { out.add(c); descendants(c, out); } return out; };
const card = (k, cls, sub) => found(k)
  ? `<button class="atl-card ${cls}" data-k="${k}"><span class="atl-art">${creatureSVG(k)}</span><b>${k}</b><small>${sub ?? KANJI[k].m}</small></button>`
  : `<button class="atl-card locked ${cls}" disabled aria-label="Sin descubrir"><span class="atl-art">${ic('lock')}</span>${sub === undefined ? '' : '<b>???</b><small>Sin descubrir</small>'}</button>`;

export function viewDex(v, sel = null) {
  v.scrollTop = 0; v.closest('.view')?.scrollTo?.(0, 0);
  if (sel && KANJI[sel]) return viewLineage(v, sel);
  const all = Object.keys(KANJI).sort((a, b) => depth(a) - depth(b)), n = all.filter(found).length;
  const famsReady = FAMILIES.filter(f => f.members.every(found) && !(S.fams || []).includes(f.root)).length;
  const achReady = ACHIEVEMENTS.filter(([k, , f]) => f() && !S.ach.includes(k)).length;
  const opt = (id, icon, label, dot) => `<button class="atl-opt" id="${id}">${ic(icon)}<span>${label}</span>${dot ? `<em>${dot}</em>` : ''}</button>`;
  v.innerHTML = `<div class="atl">
    ${scrHead('図', 'Atlas', 'Cada KANJŪ que descubrís queda revelado acá')}
    <div class="atl-opts">${opt('atlFam', 'leaf', 'Familias', famsReady)}${opt('atlAch', 'trophy', 'Logros', achReady)}${opt('atlGen', 'refresh', 'Linaje', 0)}</div>
    <div class="atl-prog"><span><b>${n}</b> / ${all.length} descubiertos</span><div><i style="width:${n / all.length * 100}%"></i></div></div>
    ${[1, 2, 3, 4, 5].filter(L => all.some(k => kLevel(k) === L)).map(L => { const ks = all.filter(k => kLevel(k) === L);
      return `<section class="atl-stage"><h2>Nivel ${L} · ${LV_NAMES[L - 1]} <span>${ks.filter(found).length}/${ks.length}</span></h2>
      <div class="atl-grid">${ks.map(k => card(k, '')).join('')}</div></section>`; }).join('')}
  </div>`;
  v.querySelectorAll('.atl-card[data-k]').forEach(b => b.onclick = () => { buzz(8); viewDex(v, b.dataset.k); });
  $('#atlFam', v).onclick = () => openFamilies(v);
  $('#atlAch', v).onclick = () => openAchievements(v);
  $('#atlGen', v).onclick = () => openGenerations();
}

function viewLineage(v, k) {
  const line = new Set([...ancestors(k), k, ...descendants(k)]);
  const groups = [1, 2, 3, 4, 5].map(L => ({ L, ks: [...line].filter(x => kLevel(x) === L).sort((a, b) => found(b) - found(a)) })).filter(g => g.ks.length);
  v.innerHTML = `<div class="atl">
    <button class="atl-back" id="atlBack">${ic('left')} Volver al Atlas</button>
    <div class="atl-title"><small>LINAJE COMPLETO</small><h1>${k} <span>${KANJI[k].m}</span></h1><p>Tus formas descubiertas quedan a la vista. Las que faltan siguen ocultas hasta que un KANJŪ tuyo llegue a ellas.</p>
    ${found(k) ? `<button class="atl-story" id="atlStory">${ic('book')} Historia y lectura</button>` : ''}</div>
    <div class="atl-map">${groups.map((g, i) => `<section class="atl-lv">
      <div class="atl-lv-label"><small>0${g.L}</small><strong>Nivel ${g.L}</strong></div>
      <div class="atl-lv-cards">${g.ks.map(x => card(x, x === k ? 'active' : '', x === k ? 'Seleccionado' : 'Ver linaje')).join('')}</div>
      ${i < groups.length - 1 ? `<div class="atl-arrow">${ic('right')}</div>` : ''}</section>`).join('')}</div>
  </div>`;
  $('#atlBack', v).onclick = () => viewDex(v);
  $('#atlStory', v) && ($('#atlStory', v).onclick = () => {
    const K = KANJI[k];
    modal(`<div class="dex-detail">${creatureSVG(k)}${storyHTML(k)}<button class="btn ghost" id="say2">${ic('sound')} Escuchar</button>
      ${K.recipes ? `<p>${K.recipes.map(r => r.join(' + ') + ' = ' + k).join('<br>')}</p>` : '<p class="muted">Componente fundamental</p>'}
      ${S.srs[k] ? `<p class="muted">Maestría ${mastery(k)}/6 · aciertos ${S.srs[k].ok} · fallos ${S.srs[k].miss}</p>` : ''}</div>`).querySelector('#say2').onclick = () => speak(reads(k)[0] || '');
  });
  v.querySelectorAll('.atl-card[data-k]').forEach(b => b.onclick = () => { if (b.dataset.k === k) return; buzz(8); viewDex(v, b.dataset.k); });
}

function openFamilies(v) {
  const m = modal(`<h3>族 Familias</h3><p class="muted">Completá cada familia para ganar premios.</p>
    <div class="fams">${FAMILIES.map(f => { const n = f.members.filter(found).length, done = n === f.members.length, got = (S.fams || []).includes(f.root);
      return `<button class="fam ${done && !got ? 'claim' : ''} ${got ? 'got' : ''}" data-fam="${f.root}" ${done && !got ? '' : 'disabled'}><span class="fr">${f.root}</span><div><b>Familia ${f.root}${PIECES[f.root] ? ` · ${PIECES[f.root].m}` : KANJI[f.root] ? ` · ${KANJI[f.root].m}` : ''}</b>
        <span class="fm">${f.members.map(k => `<i class="${found(k) ? 'on' : ''}">${S.dex[k]?.seen ? k : '？'}</i>`).join('')}</span>
        <small>${got ? '✓ Cobrada' : done ? `¡Cobrar ${famReward(f)} 墨 + 1 札!` : `${n}/${f.members.length}`}</small></div></button>`; }).join('')}</div>`);
  m.querySelectorAll('.fam.claim').forEach(b => b.onclick = () => {
    const f = FAMILIES.find(x => x.root === b.dataset.fam); S.fams = [...(S.fams || []), f.root]; S.ink += famReward(f); S.tickets++;
    buzz([20, 60, 20]); toast(`族 ¡Familia ${f.root} completa! +${famReward(f)} 墨 · +1 札`); hud(); m.close(); viewDex(v); openFamilies(v); });
}
function openAchievements(v) {
  const m = modal(`<h3>章 Logros</h3>
    <div class="achs">${ACHIEVEMENTS.map(([k, n, f, d, ink]) => { const got = f(), cl = S.ach.includes(k);
      return `<button class="ach ${got ? 'got' : ''} ${got && !cl ? 'claim' : ''}" data-a="${k}" ${got && !cl ? '' : 'disabled'}><i>${k}</i><b>${n}</b><small>${cl ? '✓ Cobrado' : got ? `¡Cobrar ${ink} 墨!` : d}</small></button>`; }).join('')}</div>`);
  m.querySelectorAll('.ach.claim').forEach(b => b.onclick = () => {
    const a = ACHIEVEMENTS.find(x => x[0] === b.dataset.a); S.ach.push(a[0]); S.ink += a[4];
    floatText(b, `+${a[4]}墨`); buzz(20); hud(); m.close(); viewDex(v); openAchievements(v); });
}
function openGenerations() {
  const m = modal(`<h3>輪 Linaje</h3><p class="muted">Los KANJŪ que renacieron y su generación.</p>
    ${S.log.length ? `<div class="atl-gens">${S.log.map(l => `<span><b>${l.k}</b> Gen ${l.gen}</span>`).join('')}</div>` : '<p class="muted">Todavía ningún KANJŪ renació.</p>'}
    <button class="link" id="wipe">Reiniciar partida</button>`);
  $('#wipe', m).onclick = () => confirm('¿Borrar todo el progreso?') && reset();
}

// ---------- Misiones y mejoras ----------
export function openQuests() {
  rollDaily();
  const m = modal(`<h3>任 Misiones de hoy</h3><p class="muted">Se renuevan cada día. Perder un día no te quita nada.</p>
    ${MISSIONS.map(q => {
      const p = Math.min(q.goal, S.daily.p[q.id] || 0), got = S.daily.claimed.includes(q.id);
      return `<div class="quest-row ${got ? 'got' : ''}"><div><b>${q.label}</b><div class="tbar"><i style="width:${p / q.goal * 100}%"></i></div><small>${p}/${q.goal}</small></div>
      <button class="btn ${p >= q.goal && !got ? 'ok' : 'ghost'}" data-q="${q.id}" ${p >= q.goal && !got ? '' : 'disabled'}>${got ? '✓' : `+${q.ink}墨`}</button></div>`;
    }).join('')}
    <h4>週 Desafíos de la semana</h4>
    ${WEEKLY.map(q => {
      const p = Math.min(q.goal, S.weekly.p[q.id] || 0), got = S.weekly.claimed.includes(q.id);
      return `<div class="quest-row ${got ? 'got' : ''}"><div><b>${q.label}</b><div class="tbar"><i style="width:${p / q.goal * 100}%"></i></div><small>${p}/${q.goal}</small></div>
      <button class="btn ${p >= q.goal && !got ? 'ok' : 'ghost'}" data-w="${q.id}" ${p >= q.goal && !got ? '' : 'disabled'}>${got ? '✓' : `+${q.ink}墨`}</button></div>`;
    }).join('')}`);
  m.querySelectorAll('[data-w]').forEach(b => b.onclick = () => {
    const q = WEEKLY.find(x => x.id === b.dataset.w); S.weekly.claimed.push(q.id); S.ink += q.ink;
    buzz(15); m.close(); hud(); openQuests(); });
  m.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
    const q = MISSIONS.find(x => x.id === b.dataset.q); S.daily.claimed.push(q.id); S.ink += q.ink;
    floatText(b, `+${q.ink}墨`); buzz(15); m.close(); hud(); openQuests();
  });
}
