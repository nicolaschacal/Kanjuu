// KANJŪ · dojo.js
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
import { $, owned, shell, go, hud, toast, modal } from './main.js';
import { rankUp } from './sanctuary.js';
import { fmt } from './trips.js';

// ---------- Dojo: repaso espaciado ----------
export const acadCtx = () => ({ modal, toast, hud: () => { shell(); }, addXP, rankUp, bump, giveExp, openDojo, kanjiDue: () => dueList().length });
export const allDue = () => dueList().length + acadDue();
// Repaso del día: kanji (Dojo) + kana y vocabulario (Academia) en una sola sesión
export async function openDojo() {
  let list = dueList().slice(0, 10), free = false;
  if (!list.length && acadDue()) {
    const r = await reviewAcademy(acadCtx()); if (!r) return;
    bump('review', r.right); save(); hud(); go();
    return toast(`修 Repaso del día completo · ${r.right}/${r.total} · +${r.ink} 墨`);
  }
  if (!list.length) {
    const owned = Object.keys(S.srs);
    if (!owned.length) return toast('Primero conseguí un KANJŪ');
    const soon = Math.min(...owned.map(k => S.srs[k].due)) - Date.now();
    if (!confirm(`Todo repasado ✓ El próximo repaso llega en ${fmt(soon)}.\n\n¿Práctica libre? (no cambia la maestría)`)) return;
    list = owned.sort(() => Math.random() - .5).slice(0, 6); free = true;
  }
  const bell = bellBonus();
  const res = await review(list, $('#layer'), (k, ok) => {
    if (!free) grade(k, ok);
    if (ok) S.creatures.filter(c => c.k === k && !c.egg).forEach(c => giveExp(c, 6));
  });
  let ink = res.right * (4 + bell) * (free ? .5 : 1) | 0;
  S.ink += ink; bump('review', res.right); const rk = addXP(res.right * 3); save();
  // Después de los kanji siguen los kana y las palabras pendientes
  let extra = null;
  if (!free && acadDue()) { extra = await reviewAcademy(acadCtx()); if (extra) { ink += extra.ink; res.right += extra.right; res.total += extra.total; } }
  if (rk.length) setTimeout(() => rankUp(rk), 400);
  const m = modal(`<div class="result"><h3>修 Repaso del día completo</h3><div class="stars">${res.right}<span>/${res.total}</span></div>
    <p><b>+${ink} 墨</b> · tus KANJŪ ganaron EXP por cada acierto${extra ? ' · incluye kana y palabras' : ''}</p>
    <p class="muted">${free ? 'Práctica libre.' : 'Los kanji que fallaste volverán pronto; los que acertaste, cada vez más tarde.'}</p>
    <button class="btn ok wide">Volver</button></div>`);
  $('.btn', m).onclick = () => { m.close(); go(); };
  hud();
}
