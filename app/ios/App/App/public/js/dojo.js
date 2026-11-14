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
import { t } from './i18n.js';
import { lexDue, lexSoon, gradeWord, foundIds } from './lex.js';

// ---------- Dojo: repaso espaciado ----------
export const acadCtx = () => ({ modal, toast, hud: () => { shell(); }, addXP, rankUp, bump, giveExp, openDojo, kanjiDue: () => dueList().length });
export const allDue = () => dueList().length + lexDue().length + acadDue();
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
// Intercalado: kanji y palabras se alternan en una sesión corta
const SESSION = 10;
function interleave(ks, ws) {
  const out = [];
  for (let i = 0; out.length < SESSION && (i < ks.length || i < ws.length); i++) {
    if (i < ks.length) out.push(ks[i]);
    if (i < ws.length && out.length < SESSION) out.push({ w: ws[i] });
  }
  return out;
}
// Repaso del día: kanji y palabras del diario intercalados; después, los cuadernos de kana (si el jugador los usa)
export async function openDojo() {
  let list = interleave(dueList(), lexDue()), free = false;
  if (!list.length && acadDue()) {
    const r = await reviewAcademy(acadCtx()); if (!r) return;
    bump('review', r.right); save(); hud(); go();
    return toast(t('dojo.doneToast', { right: r.right, total: r.total, ink: r.ink }));
  }
  if (!list.length) {
    const owned = Object.keys(S.srs), words = foundIds();
    if (!owned.length && !words.length) return toast(t('dojo.empty'));
    const soon = Math.min(...owned.map(k => S.srs[k].due), lexSoon()) - Date.now();
    if (!confirm(t('dojo.freeAsk', { time: fmt(soon) }))) return;
    list = shuffle([...owned, ...words.map(w => ({ w }))]).slice(0, 6); free = true;
  }
  const bell = bellBonus();
  let wordsOk = 0;
  const res = await review(list, $('#layer'), (k, ok, isWord) => {
    if (isWord) { if (!free) gradeWord(k, ok); if (ok) wordsOk++; return; }
    if (!free) grade(k, ok);
    if (ok) S.creatures.filter(c => c.k === k && !c.egg).forEach(c => giveExp(c, 6));
  });
  let ink = res.right * (4 + bell) * (free ? .5 : 1) | 0;
  S.ink += ink; bump('review', res.right); if (wordsOk) bump('words', wordsOk); const rk = addXP(res.right * 3); save();
  // Después siguen los kana y las palabras de los cuadernos, si hay pendientes
  let extra = null;
  if (!free && acadDue()) { extra = await reviewAcademy(acadCtx()); if (extra) { ink += extra.ink; res.right += extra.right; res.total += extra.total; } }
  if (rk.length) setTimeout(() => rankUp(rk), 400);
  const m = modal(`<div class="result"><h3>修 ${t('dojo.doneTitle')}</h3><div class="stars">${res.right}<span>/${res.total}</span></div>
    <p><b>+${ink} 墨</b> · ${t('dojo.doneExp')}</p>
    <p class="muted">${t(free ? 'dojo.doneFree' : 'dojo.doneNote')}</p>
    <button class="btn ok wide">${t('dojo.back')}</button></div>`);
  $('.btn', m).onclick = () => { m.close(); go(); };
  hud();
}
