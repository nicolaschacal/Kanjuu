import { KANJI, MAX_LV, roots } from './data.js';

const KEY = 'kanjuu.save.v1';
const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

export let S = load();

function fresh() {
  return { creatures: [], dex: {}, ink: 10, deco: [], log: [], stats: { fusions: 0, evolutions: 0, rebirths: 0, trainings: 0 }, daily: { date: today(), p: {}, claimed: [] } };
}
function load() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s?.creatures) return s; } catch {}
  return fresh();
}
export function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
export function reset() { S = fresh(); save(); location.reload(); }

export function rollDaily() {
  if (S.daily.date !== today()) S.daily = { date: today(), p: {}, claimed: [] };
}
export function bump(key, n = 1) { rollDaily(); S.daily.p[key] = (S.daily.p[key] || 0) + n; }

export function see(k) { S.dex[k] ??= { seen: true }; }
export function own(k) { see(k); S.dex[k].owned = true; }

export function addCreature(k, extra = {}) {
  const c = { id: uid(), k, lv: 1, exp: 0, bond: 0, mood: .7, gen: 0, know: 0, away: null, hist: [k], ...extra };
  S.creatures.push(c); own(k);
  // Descubrir una criatura revela también sus componentes en el códice
  KANJI[k].recipes?.[0].forEach(see);
  return c;
}
export const byId = id => S.creatures.find(c => c.id === id);
export const expNeed = lv => 12 + lv * 8;
export const mult = c => (1 + c.gen * .25) * (S.deco.includes('lantern') ? 1.1 : 1);

// Devuelve cuántos niveles subió
export function giveExp(c, amount) {
  let ups = 0; c.exp += Math.round(amount * mult(c));
  while (c.lv < MAX_LV && c.exp >= expNeed(c.lv)) { c.exp -= expNeed(c.lv); c.lv++; ups++; }
  if (c.lv >= MAX_LV) c.exp = Math.min(c.exp, expNeed(c.lv));
  return ups;
}

export function evolve(c, to) {
  c.k = to; c.lv = 1; c.exp = 0; c.hist.push(to); own(to); S.stats.evolutions++;
}

// Fusión: consume las criaturas y crea el carácter resultante
export function fuse(ids, to) {
  const used = ids.map(byId);
  S.creatures = S.creatures.filter(c => !ids.includes(c.id));
  S.stats.fusions++;
  return addCreature(to, {
    gen: Math.max(...used.map(c => c.gen)),
    bond: Math.round(used.reduce((a, c) => a + c.bond, 0) / used.length),
    hist: [...new Set(used.flatMap(c => c.hist)), to],
  });
}

// Renacimiento: vuelve a su componente fundamental con un legado permanente
export function rebirth(c) {
  const root = roots(c.k)[0];
  S.log.unshift({ k: c.k, gen: c.gen, date: today() });
  Object.assign(c, { k: root, lv: 1, exp: 0, gen: c.gen + 1, know: Math.ceil(c.know / 2), egg: true, hist: [...c.hist, '↻', root] });
  S.stats.rebirths++;
}
