import { KANJI, MAX_LV, roots, size, BASE_CAP, CAP_STEP, SRS_HOURS } from './data.js';
import { pushSoon } from './cloud.js';

const KEY = 'kanjuu.save.v1';
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

export let S = norm(load());
export const loadedAt = S.savedAt || 0;

function fresh() {
  return { creatures: [], dex: {}, ink: 20, deco: [], log: [], stats: { fusions: 0, evolutions: 0, rebirths: 0, trainings: 0 }, daily: { date: today(), p: {}, claimed: [] } };
}
// Completa campos nuevos en partidas viejas
export function norm(s) {
  s.gate ??= []; s.pieces ??= {}; s.srs ??= {}; s.ach ??= []; s.items ??= {};
  s.weekly ??= { week: weekKey(), p: {}, claimed: [] };
  Object.keys(s.dex || {}).forEach(k => s.dex[k].owned && (s.srs[k] ??= { box: 0, due: 0, ok: 0, miss: 0 }));
  return s;
}
export function weekKey() { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.toISOString().slice(0, 10); }
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s?.creatures) return s; } catch {}
  return fresh();
}
export function save() { S.savedAt = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} pushSoon(S); }
// Reemplaza la partida actual (p. ej. con la de la nube) sin cambiar la referencia
export function replace(data) { Object.keys(S).forEach(k => delete S[k]); Object.assign(S, norm(data)); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
export function reset() { replace(fresh()); save(); location.reload(); }

export function rollDaily() {
  if (S.daily.date !== today()) S.daily = { date: today(), p: {}, claimed: [] };
  if (S.weekly.week !== weekKey()) S.weekly = { week: weekKey(), p: {}, claimed: [] };
}
// Estudiar abre cofres de la Arena: cada acierto suma puntos al primer cofre de la fila
const STUDY = { review: 1, train: 2, acad: 3 };
export function bump(key, n = 1) {
  rollDaily(); S.daily.p[key] = (S.daily.p[key] || 0) + n; S.weekly.p[key] = (S.weekly.p[key] || 0) + n;
  const ch = S.arena?.chests?.[0]; if (ch && STUDY[key]) ch.pts += n * STUDY[key];
}


// --- Repetición espaciada ---
export function srsAdd(k) { S.srs[k] ??= { box: 0, due: Date.now(), ok: 0, miss: 0 }; }
export function grade(k, ok) {
  srsAdd(k); const r = S.srs[k];
  if (ok) { r.ok++; r.box = Math.min(SRS_HOURS.length - 1, r.box + 1); }
  else { r.miss++; r.box = Math.max(0, r.box - 2); }
  r.due = Date.now() + SRS_HOURS[r.box] * 36e5;
}
export const dueList = () => Object.keys(S.srs).filter(k => S.srs[k].due <= Date.now()).sort((a, b) => S.srs[a].due - S.srs[b].due);
export const mastery = k => S.srs[k]?.box || 0;

export function see(k) { S.dex[k] ??= { seen: true }; }
export function own(k) { const nw = !S.dex[k]?.owned; see(k); S.dex[k].owned = true; srsAdd(k); if (nw && S.creatures.length) bump('disc'); }

export function addCreature(k, extra = {}) {
  const c = { id: uid(), k, lv: 1, exp: 0, bond: 0, mood: .7, gen: 0, know: 0, away: null, hist: [k], ...extra };
  S.creatures.push(c); own(k);
  // Descubrir una criatura revela también sus componentes en el códice
  KANJI[k].recipes?.[0].forEach(see);
  return c;
}
export const byId = id => S.creatures.find(c => c.id === id);
export const expNeed = lv => 12 + lv * 8;
export const mult = c => (1 + c.gen * .25) * (1 + .2 * (c.stars || 0));

// Devuelve cuántos niveles subió
export function giveExp(c, amount) {
  let ups = 0; c.exp += Math.round(amount * mult(c));
  while (c.lv < MAX_LV && c.exp >= expNeed(c.lv)) { c.exp -= expNeed(c.lv); c.lv++; ups++; }
  if (c.lv >= MAX_LV) c.exp = Math.min(c.exp, expNeed(c.lv));
  return ups;
}

export function evolve(c, to) {
  if (c.acc && KANJI[to].recipes.some(r => r.includes(c.acc) && r.includes(c.k))) c.acc = null; // la pieza equipada se consume
  c.k = to; c.lv = 1; c.exp = 0; c.hist.push(to); own(to); S.stats.evolutions++; return true;
}

// Fusión (como en Digimon): las criaturas se consumen y nace una nueva. Para conservar a la tuya, evolucionala.
export function fuse(ids, to, pieces = []) {
  const used = ids.map(byId);
  pieces.forEach(p => S.pieces[p]--);
  used.forEach(c => { if (c.acc) { S.pieces[c.acc] = (S.pieces[c.acc] || 0) + 1; c.acc = null; } });
  S.creatures = S.creatures.filter(c => !ids.includes(c.id));
  S.stats.fusions++;
  return addCreature(to, {
    gen: Math.max(...used.map(c => c.gen)),
    bond: Math.round(used.reduce((a, c) => a + (c.bond || 0), 0) / used.length),
    hist: [...new Set(used.flatMap(c => c.hist)), to],
  });
}

// Renacimiento: vuelve a su componente fundamental con un legado permanente
// Liberar: la criatura vuelve a la naturaleza y deja tinta
export function release(c) {
  if (c.acc) { S.pieces[c.acc] = (S.pieces[c.acc] || 0) + 1; c.acc = null; }
  const ink = 4 + size(c.k) * 6 + c.lv;
  S.creatures = S.creatures.filter(x => x !== c); S.ink += ink; return ink;
}
export function rebirth(c) {
  const root = roots(c.k)[0];
  S.log.unshift({ k: c.k, gen: c.gen, date: today() });
  Object.assign(c, { k: root, lv: 1, exp: 0, gen: c.gen + 1, know: Math.ceil(c.know / 2), egg: true, hist: [...c.hist, '↻', root] });
  S.stats.rebirths++;
}
