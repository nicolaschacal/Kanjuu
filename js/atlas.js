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
import { $, buzz, MISSIONS, WEEKLY, ACHIEVEMENTS, owned, hud, toast, modal, floatText, ui } from './main.js';
import { scrHead } from './main.js';

// ---------- Códice ----------
// Atlas: hoja con tres pestañas (Atlas · Familias · Logros), como el Entrenador
export function viewDex(v) {
  const all = Object.keys(KANJI).sort((a, b) => depth(a) - depth(b));
  const tab = ui.dsub || 'atlas';
  let body = '';
  if (tab === 'atlas') body = `<p class="eyebrow">Tu colección</p><h2 class="pn-h">Atlas</h2>
    <p class="pn-lead">${owned()} de ${all.length} kanji descubiertos · tocá uno para ver su historia</p>
    <div class="tbar dex-bar"><i style="width:${owned() / all.length * 100}%"></i></div>
    ${[...new Set(all.map(kLevel))].map(L => `<h4>Nivel KANJŪ ${L} <small>${['Componentes fundamentales', 'Primera composición', 'Composición intermedia', 'Composición compleja', 'Composición avanzada'][L - 1]} · ${all.filter(k => kLevel(k) === L && S.dex[k]?.owned).length}/${all.filter(k => kLevel(k) === L).length}</small></h4>
    <div class="dex-grid">${all.filter(k => kLevel(k) === L).map(k => {
      const d = S.dex[k];
      return `<button class="dex-c ${d?.owned ? 'own' : d?.seen ? 'seen' : 'lock'}" data-k="${k}">${d?.owned ? creatureSVG(k) : d?.seen ? `<span class="sil">${k}</span>` : `<span class="lk">${ic('lock')}</span>`}<small>${d?.owned || d?.seen ? k : ''}</small>${d?.owned ? `<i class="mdots">${'●'.repeat(Math.min(6, mastery(k)))}</i>` : ''}</button>`;
    }).join('')}</div>`).join('')}
    ${S.log.length ? `<h4>輪 Linaje</h4><p class="muted">${S.log.map(l => `${l.k} (Gen ${l.gen})`).join(' · ')}</p>` : ''}
    <button class="link" id="wipe">Reiniciar partida</button>`;
  if (tab === 'fam') { const n = FAMILIES.filter(f => f.members.every(k => S.dex[k]?.owned)).length;
    body = `<p class="eyebrow">Familias 族</p><h2 class="pn-h">Familias</h2>
    <p class="pn-lead">Completá cada familia para ganar tinta y un boleto · ${n}/${FAMILIES.length} completas</p>
    <div class="fams">${FAMILIES.map(f => { const n = f.members.filter(k => S.dex[k]?.owned).length, done = n === f.members.length, got = (S.fams || []).includes(f.root);
      return `<button class="fam ${done && !got ? 'claim' : ''} ${got ? 'got' : ''}" data-fam="${f.root}" ${done && !got ? '' : 'disabled'}><span class="fr">${f.root}</span><div><b>Familia ${f.root}${PIECES[f.root] ? ` · ${PIECES[f.root].m}` : KANJI[f.root] ? ` · ${KANJI[f.root].m}` : ''}</b>
        <span class="fm">${f.members.map(k => `<i class="${S.dex[k]?.owned ? 'on' : ''}">${S.dex[k]?.seen ? k : '？'}</i>`).join('')}</span>
        <small>${got ? '✓ Cobrada' : done ? `¡Cobrar ${famReward(f)} 墨 + 1 札!` : `${n}/${f.members.length}`}</small></div></button>`; }).join('')}</div>`; }
  if (tab === 'ach') { const n = ACHIEVEMENTS.filter(a => a[2]()).length;
    body = `<p class="eyebrow">Logros 章</p><h2 class="pn-h">Logros</h2>
    <p class="pn-lead">${n}/${ACHIEVEMENTS.length} conseguidos</p>
    <div class="achs">${ACHIEVEMENTS.map(([k, n, f, d, ink]) => { const got = f(), cl = S.ach.includes(k);
      return `<button class="ach ${got ? 'got' : ''} ${got && !cl ? 'claim' : ''}" data-a="${k}" ${got && !cl ? '' : 'disabled'}><i>${k}</i><b>${n}</b><small>${cl ? '✓ Cobrado' : got ? `¡Cobrar ${ink} 墨!` : d}</small></button>`; }).join('')}</div>`; }
  v.innerHTML = `<div class="dex tr">${body}</div>`;
  v.querySelectorAll('.dex-c').forEach(b => b.onclick = () => {
    const k = b.dataset.k, d = S.dex[k]; if (!d?.seen) return toast('Aún no descubierto');
    const K = KANJI[k];
    modal(`<div class="dex-detail">${d.owned ? creatureSVG(k) : `<span class="sil big">${k}</span>`}
      ${storyHTML(k)}<button class="btn ghost" id="say2">${ic('sound')} Escuchar</button>
      <p class="muted">Nivel KANJŪ ${kLevel(k)} · composition_depth ${depth(k)}</p>
      ${K.recipes ? `<p>${K.recipes.map(r => r.join(' + ') + ' = ' + k).join('<br>')}</p>` : '<p class="muted">Componente fundamental</p>'}
      ${evolutionsOf(k).length ? `<p class="muted">Forma parte de: ${evolutionsOf(k).map(t => S.dex[t]?.seen ? t : '？').join(' ')}</p>` : ''}
      ${S.srs[k] ? `<p class="muted">Maestría ${mastery(k)}/6 · aciertos ${S.srs[k].ok} · fallos ${S.srs[k].miss}</p>` : ''}</div>`).querySelector('#say2').onclick = () => speak(reads(k)[0] || '');
  });
  v.querySelectorAll('.fam.claim').forEach(b => b.onclick = () => {
    const f = FAMILIES.find(x => x.root === b.dataset.fam); S.fams = [...(S.fams || []), f.root]; S.ink += famReward(f); S.tickets++;
    buzz([20, 60, 20]); toast(`族 ¡Familia ${f.root} completa! +${famReward(f)} 墨 · +1 札`); viewDex(v); hud(); });
  $('#wipe', v) && ($('#wipe', v).onclick = () => confirm('¿Borrar todo el progreso?') && reset());
  v.querySelectorAll('.ach.claim').forEach(b => b.onclick = () => {
    const a = ACHIEVEMENTS.find(x => x[0] === b.dataset.a); S.ach.push(a[0]); S.ink += a[4];
    floatText(b, `+${a[4]}墨`); buzz(20); viewDex(v); hud(); });
}
export const famReady = () => FAMILIES.some(f => f.members.every(k => S.dex[k]?.owned) && !(S.fams || []).includes(f.root));

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
