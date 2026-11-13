// KANJŪ · lex.js — las palabras del diario: hallar, anotar, recuperar y reencontrar (docs/APRENDIZAJE.md)
// Aquí solo hay estado y reglas; las pantallas están en js/diary.js y los ejercicios en js/wordgames.js.
import { LEX, PHRASES, READINGS, SITUATIONS, PATTERNS } from './lang.js';
import { SRS_HOURS, REGIONS, WORDS } from './data.js';
import { S, bump } from './state.js';
import { lang } from './i18n.js';
import { kanaHTML, helpOn } from './help.js';

export const WORD = Object.fromEntries(LEX.map(w => [w.id, w]));
// Textos de lang.js: { es, en } (o una palabra con sus campos es/en)
export const tr = o => (o && (o[lang()] ?? o.es)) || '';
export const sitOf = id => SITUATIONS.find(s => s.id === id);
export const sitWords = sit => LEX.filter(w => w.sit === sit);
export const patOf = id => PATTERNS.find(p => p.id === id);
export const regionOf = id => REGIONS.find(r => r.id === id);
export const found = id => !!S.lex[id];
// Solo palabras que siguen existiendo en los datos (una partida puede traer ids viejos)
export const foundIds = () => Object.keys(S.lex).filter(id => WORD[id]);
export const ENC_MAX = 10; // regla 5: diez encuentros o más por palabra

// ---------- Encontrar ----------
// Un encuentro más con la palabra, en un lugar del juego: trip · dojo · read · diary
export function meet(id, place) {
  const r = S.lex[id]; if (!r) return;
  r.n = (r.n || 0) + 1; r.at ??= [];
  if (!r.at.includes(place)) r.at.push(place);
}
// Hallazgo: la palabra entra al diario y al repaso
export function findWord(id, from) {
  if (S.lex[id]) return meet(id, 'trip');
  S.lex[id] = { box: 0, due: Date.now(), ok: 0, miss: 0, n: 1, at: ['trip'], from, t: Date.now() };
  bump('words');
}
// "Ya la sabía": entra al repaso con intervalo largo; si después falla, vuelve a la cola normal sin penalidad
export const KNEW_BOX = 3;
export function markKnown(id) {
  const r = S.lex[id]; if (!r || r.ok || r.miss) return;
  r.box = KNEW_BOX; r.due = Date.now() + SRS_HOURS[KNEW_BOX] * 36e5; r.knew = true;
}
// La siguiente palabra no hallada de la situación de una región, en su orden
export const nextWord = region => LEX.find(w => w.sit === region && !S.lex[w.id]) || null;
const seen = p => S.phr[p.id]?.n || 0;
export const readable = p => p.ids.every(id => S.lex[id]);
// Frase para presentar una palabra: la usa y todas sus otras palabras ya están en el diario (una sola novedad)
export function phraseFor(id) {
  return PHRASES.filter(p => p.ids.includes(id) && p.ids.every(x => x === id || S.lex[x])).sort((a, b) => seen(a) - seen(b))[0] || null;
}
// Reencuentro: una frase hecha solo con palabras ya halladas; primero las de esa región y las menos vistas
export function reencounter(region) {
  return PHRASES.filter(readable).sort((a, b) => ((b.sit === region) - (a.sit === region)) || seen(a) - seen(b))[0] || null;
}
// Ver una frase suma un encuentro a cada una de sus palabras (menos a la recién hallada, que ya contó)
export function seePhrase(p, place, skip) {
  (S.phr[p.id] ??= { n: 0, t: Date.now() }).n++;
  p.ids.forEach(id => id !== skip && meet(id, place));
}
export const phrasesOf = id => PHRASES.filter(p => p.ids.includes(id) && readable(p));
export const seenPhrases = () => PHRASES.filter(p => S.phr[p.id]);

// ---------- Recuperar: repaso espaciado con las mismas cajas que los kanji ----------
export function gradeWord(id, ok) {
  const r = S.lex[id]; if (!r) return;
  if (ok) { r.ok++; r.box = Math.min(SRS_HOURS.length - 1, r.box + 1); }
  else { r.miss++; r.box = Math.max(0, r.box - 2); } // fallar no quita nada: la palabra vuelve antes
  r.due = Date.now() + SRS_HOURS[r.box] * 36e5;
  meet(id, 'dojo');
}
export const lexDue = () => foundIds().filter(id => S.lex[id].due <= Date.now()).sort((a, b) => S.lex[a].due - S.lex[b].due);
export const lexSoon = () => Math.min(...foundIds().map(id => S.lex[id].due));
export const reviewedWords = () => foundIds().filter(id => S.lex[id].ok + S.lex[id].miss > 0).length;

// ---------- Reencontrar: lecturas ----------
export const readingMissing = r => r.ids.filter(id => WORD[id] && !S.lex[id]);
// Se abre cuando el jugador conoce todas sus palabras menos, como mucho, una
export const readingOpen = r => readingMissing(r).length <= 1;
export const READ_INK = 10;
// Leer da tinta la primera vez y suma encuentros (una vez por día por lectura)
export function finishReading(r) {
  const day = new Date().toISOString().slice(0, 10), st = S.read[r.id], first = !st;
  if (first) S.ink += READ_INK;
  if (st?.day !== day) r.ids.forEach(id => meet(id, 'read'));
  S.read[r.id] = { n: (st?.n || 0) + 1, t: st?.t || Date.now(), day };
  return first;
}

// ---------- Puedo… ----------
export const sitFound = sit => sitWords(sit).filter(w => S.lex[w.id]).length;
export const sitSolid = sit => sitWords(sit).filter(w => (S.lex[w.id]?.box || 0) >= 2).length;
// Una situación se logra con el 80 % de sus palabras en caja 2 o más
export const canDo = sit => { const n = sitWords(sit).length; return n > 0 && sitSolid(sit) >= Math.ceil(n * .8); };

// ---------- Mostrar ----------
const KANJI_RX = /[㐀-鿿々]/;
// La palabra va en kana hasta que el jugador tiene todos los kanji de su forma escrita
export const showsKanji = w => !!w.kanji && [...w.kanji].filter(c => KANJI_RX.test(c) && c !== '々').every(c => S.dex[c]?.owned);
export const wordHTML = w => showsKanji(w) ? `<ruby class="wk">${w.kanji}${helpOn() ? `<rt>${w.kana}</rt>` : ''}</ruby>` : kanaHTML(w.kana);
// Texto japonés segmentado con espacios: cada ficha es una palabra del diario o una partícula
export function jaTokens(ja, ids) {
  const ws = ids.map(id => WORD[id]).filter(Boolean);
  return ja.split(/\s+/).filter(Boolean).map(tok => ({ tok, w: ws.find(w => w.kana === tok || w.kanji === tok) || null }));
}
export function jaHTML(ja, ids, hot) {
  return jaTokens(ja, ids).map(({ tok, w }) => `<span class="ptok${w && w.id === hot ? ' hot' : ''}">${w ? wordHTML(w) : kanaHTML(tok, { particle: true })}</span>`).join('');
}
export const jaPlain = ja => ja.replace(/\s+/g, '');

// Palabras ancla de data.js (kanji + lectura + significado): cuentan para el diario cuando se tienen todos sus kanji
export const anchorsOf = k => WORDS.filter(w => w[0].includes(k));
export const anchorOwned = w => [...w[0]].filter(c => KANJI_RX.test(c)).every(c => S.dex[c]?.owned);
export const ownedAnchors = () => WORDS.filter(anchorOwned);

export { LEX, PHRASES, READINGS, SITUATIONS, PATTERNS };
