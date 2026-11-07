// KANJŪ · lab.js
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
import { $, buzz, sorted, toast } from './main.js';
import { evolveFX } from './sheet.js';

let labSel = [];
// ---------- Laboratorio de fusión ----------
export function viewLab(v) {
  labSel = labSel.filter(id => byId(id) && !byId(id).away);
  const sel = labSel.map(byId), ks = sorted(sel.map(c => c.k));
  const match = Object.keys(KANJI).find(t => KANJI[t].recipes?.some(r => sorted(r) === ks));
  const avail = S.creatures.filter(c => !c.away && !c.egg);
  const countOwn = k => avail.filter(c => c.k === k).length;
  const weak = match ? [...new Set(sel.map(c => c.k))].filter(k => mastery(k) < learnGate(match)) : [];
  v.innerHTML = `
  <div class="lab">
    <div class="altar">
      <div class="slots">${Array.from({ length: Math.min(4, Math.max(2, sel.length + 1)) }, (_, i) => i).map(i => sel[i] ? `<button class="slot full" data-rm="${sel[i].id}">${creatureSVG(sel[i].k)}</button>` : `<div class="slot">＋</div>`).join('<span class="plus">+</span>')}</div>
      <div class="arrow">↓</div>
      <div class="result-slot ${match ? 'ok' : ''}">${match ? `<span class="big-k">${match}</span><small>${KANJI[match].m} · ${KANJI[match].form}</small>` : `<span class="big-k dim">？</span><small>${sel.length ? 'Sin composición conocida' : 'Elegí criaturas'}</small>`}</div>
      ${weak.length ? `<p class="gate-msg">📖 Para fusionar necesitás dominar ${weak.map(k => `<b>${k}</b> ${mastery(k)}/${learnGate(match)}`).join(' · ')}. Repasalos en el Dojo en días distintos.</p>` : ''}
      <button class="btn ok wide" id="fuse" ${match && !weak.length ? '' : 'disabled'}>合 Fusionar</button>
    </div>
    <h4>Tus criaturas</h4>
    <div class="roster">${avail.map(c => `<button class="chip-mon ${labSel.includes(c.id) ? 'on' : ''}" data-id="${c.id}">${creatureSVG(c.k)}<small>${c.k} Lv${c.lv}</small></button>`).join('') || '<p class="muted">No hay criaturas disponibles.</p>'}</div>
    <h4>合 Libro de composiciones</h4>
    <div class="recipes">${Object.keys(KANJI).filter(t => KANJI[t].recipes).map(t => {
      const dx = S.dex[t], show = dx?.seen;
      return KANJI[t].recipes.map(r => {
        const need = {}; r.forEach(k => need[k] = (need[k] || 0) + 1);
        const have = Object.entries(need).every(([k, n]) => countOwn(k) >= n);
        const anyPart = r.some(k => S.dex[k]?.owned);
        if (!anyPart && !show) return '';
        return `<button class="recipe ${have ? 'have' : ''}" data-r="${r.join(',')}">${r.map(k => `<span class="${countOwn(k) ? '' : 'miss'}">${S.dex[k]?.seen ? k : '？'}</span>`).join('<em>+</em>')}<em>=</em><b>${show ? t : '？'}</b><small>${show ? KANJI[t].m : 'Por descubrir'}${have ? ' · ¡Listo!' : ''}</small></button>`;
      }).join('');
    }).join('')}</div>
  </div>`;
  v.querySelectorAll('.chip-mon').forEach(b => b.onclick = () => {
    const id = b.dataset.id; buzz(5);
    labSel = labSel.includes(id) ? labSel.filter(x => x !== id) : labSel.length < 4 ? [...labSel, id] : labSel;
    viewLab(v);
  });
  v.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { labSel = labSel.filter(x => x !== b.dataset.rm); viewLab(v); });
  v.querySelectorAll('.recipe.have').forEach(b => b.onclick = () => {
    const pool = [...avail]; labSel = [];
    b.dataset.r.split(',').forEach(k => { const i = pool.findIndex(c => c.k === k); labSel.push(pool.splice(i, 1)[0].id); });
    viewLab(v);
  });
  $('#fuse', v).onclick = () => {
    if (!confirm(`Las criaturas elegidas se unirán para formar ${match}. ¿Fusionar?`)) return;
    const pref = sel.find(c => c.pos)?.pos, from = sel.map(c => c.k), nc = fuse(labSel, match); labSel = [];
    nc.prodAt = Date.now(); if (settle(nc, pref) === 'store') setTimeout(() => toast(`${match} está en el almacén: no había lugar`), 2600);
    evolveFX(nc, match, from);
  };
}
