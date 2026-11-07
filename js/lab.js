// KANJŪ · lab.js
import { PIECES, isPiece, KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
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
import { scrHead } from './main.js';
import { evolveFX } from './sheet.js';

let labSel = [], labAll = false;
// ---------- Laboratorio de fusión ----------
export function viewLab(v) {
  const pc = {}; labSel = labSel.filter(id => id.startsWith('p:') ? (pc[id] = (pc[id] || 0) + 1) <= (S.pieces[id.slice(2)] || 0) : byId(id) && !byId(id).away);
  const sel = labSel.filter(id => !id.startsWith('p:')).map(byId), selP = labSel.filter(id => id.startsWith('p:')).map(id => id.slice(2));
  const ks = sorted([...sel.map(c => c.k), ...selP]);
  const match = Object.keys(KANJI).find(t => KANJI[t].recipes?.some(r => sorted(r) === ks));
  const avail = S.creatures.filter(c => !c.away && !c.egg);
  const countOwn = k => isPiece(k) ? S.pieces[k] || 0 : avail.filter(c => c.k === k).length;
  const slotHTML = id => id.startsWith('p:') ? `<button class="slot full pc" data-rm="${id}"><span>${id.slice(2)}</span></button>` : `<button class="slot full" data-rm="${id}">${creatureSVG(byId(id).k)}</button>`;
  const weak = match ? [...new Set(sel.map(c => c.k))].filter(k => mastery(k) < learnGate(match)) : [];
  v.innerHTML = `
  <div class="lab">
    ${scrHead('錬', 'Fusión', 'Combiná KANJŪ y piezas: nace uno nuevo y los demás se consumen')}
    <div class="altar">
      <div class="slots">${Array.from({ length: Math.min(4, Math.max(2, labSel.length + 1)) }, (_, i) => i).map(i => labSel[i] ? slotHTML(labSel[i]) : `<div class="slot">＋</div>`).join('<span class="plus">+</span>')}</div>
      <div class="arrow">↓</div>
      <div class="result-slot ${match ? 'ok' : ''}">${match ? `<span class="big-k">${match}</span><small>${KANJI[match].m} · ${KANJI[match].form}</small>` : `<span class="big-k dim">？</span><small>${sel.length ? 'Sin composición conocida' : 'Elegí criaturas'}</small>`}</div>
      ${weak.length ? `<p class="gate-msg">書 Para fusionar necesitás dominar ${weak.map(k => `<b>${k}</b> ${mastery(k)}/${learnGate(match)}`).join(' · ')}. Repasalos en el Dojo en días distintos.</p>` : ''}
      <button class="btn ok wide" id="fuse" ${match && !weak.length ? '' : 'disabled'}>合 Fusionar</button>
    </div>
    <h4>Tus KANJŪ <small>tocá para ponerlos en el altar</small></h4>
    <div class="roster">${avail.map(c => `<button class="chip-mon ${labSel.includes(c.id) ? 'on' : ''}" data-id="${c.id}">${creatureSVG(c.k)}<small>${c.k} Lv${c.lv}</small></button>`).join('') || '<p class="muted">No hay criaturas disponibles.</p>'}</div>
    <h4>部品 Piezas <small>accesorios que también se fusionan</small></h4>
    <div class="roster">${Object.keys(PIECES).filter(p => S.pieces[p] > 0).map(p => `<button class="chip-mon pc ${labSel.includes('p:' + p) ? 'on' : ''}" data-p="${p}"><span>${p}</span><small>${PIECES[p].m} ×${S.pieces[p]}</small></button>`).join('') || '<p class="muted">No tenés piezas. Conseguilas en la Tienda, en viajes o en la Academia.</p>'}</div>
    <h4>合 Libro de composiciones</h4>
    <div class="recipes ${labAll ? 'all' : ''}">${Object.keys(KANJI).filter(t => KANJI[t].recipes).sort((a, b) => (!!S.dex[b]?.seen - !!S.dex[a]?.seen)).map(t => {
      const dx = S.dex[t], show = dx?.seen;
      return KANJI[t].recipes.map(r => {
        const need = {}; r.forEach(k => need[k] = (need[k] || 0) + 1);
        const have = Object.entries(need).every(([k, n]) => countOwn(k) >= n);
        const anyPart = r.some(k => S.dex[k]?.owned);
        if (!anyPart && !show) return '';
        return `<button class="recipe ${have ? 'have' : ''}" data-r="${r.join(',')}">${r.map(k => `<span class="${countOwn(k) ? '' : 'miss'} ${isPiece(k) ? 'pc' : ''}">${S.dex[k]?.seen || isPiece(k) ? k : '？'}</span>`).join('<em>+</em>')}<em>=</em><b>${show ? t : '？'}</b><small>${show ? KANJI[t].m : 'Por descubrir'}${have ? ' · ¡Listo!' : ''}</small></button>`;
      }).join('');
    }).join('')}</div>
    <button class="btn ghost wide" id="recAll">${labAll ? 'Mostrar menos' : 'Ver todo el libro'}</button>
  </div>`;
  $('#recAll', v).onclick = () => { labAll = !labAll; viewLab(v); };
  v.querySelectorAll('.chip-mon').forEach(b => b.onclick = () => {
    const id = b.dataset.id; buzz(5);
    labSel = labSel.includes(id) ? labSel.filter(x => x !== id) : labSel.length < 4 ? [...labSel, id] : labSel;
    viewLab(v);
  });
  v.querySelectorAll('[data-p]').forEach(b => b.onclick = () => {
    const id = 'p:' + b.dataset.p, n = labSel.filter(x => x === id).length; buzz(5);
    labSel = n < S.pieces[b.dataset.p] && labSel.length < 4 ? [...labSel, id] : labSel.filter(x => x !== id);
    viewLab(v);
  });
  v.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { const i = labSel.indexOf(b.dataset.rm); labSel.splice(i, 1); viewLab(v); });
  v.querySelectorAll('.recipe.have').forEach(b => b.onclick = () => {
    const pool = [...avail]; labSel = [];
    b.dataset.r.split(',').forEach(k => { if (isPiece(k)) return labSel.push('p:' + k); const i = pool.findIndex(c => c.k === k); labSel.push(pool.splice(i, 1)[0].id); });
    viewLab(v);
  });
  $('#fuse', v).onclick = () => {
    if (!confirm(`Las criaturas${selP.length ? ' y piezas' : ''} elegidas se unirán para formar ${match}. ¿Fusionar?`)) return;
    const pref = sel.find(c => c.pos)?.pos, from = [...sel.map(c => c.k), ...selP], nc = fuse(sel.map(c => c.id), match, selP); labSel = [];
    nc.prodAt = Date.now(); if (settle(nc, pref) === 'store') setTimeout(() => toast(`${match} está en el almacén: no había lugar`), 2600);
    evolveFX(nc, match, from);
  };
}
