// KANJŪ · feedback.js — qué estuvo mal en tu respuesta (tarea A-12, propuesta docs/propuestas/A-12-errores.html).
// Capa fija, para todos y sin IA: marca las fichas que no van, explica la partícula o la forma del verbo confundida
// y dice qué significa lo que elegiste. Con IA (Plus o clave propia), un botón «¿Por qué?» explica con más detalle
// a partir de lo que ya calculó esta capa, así nunca contradice la respuesta correcta.
import { ic } from './icons.js';
import { t } from './i18n.js';
import { KANJI } from './data.js';
import { LEX, verbForms, taOf } from './lang.js';
import { tr } from './lex.js';
import { aiOn, explain } from './ai.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export const TIP_PARTICLES = ['は', 'が', 'を', 'に', 'で', 'へ', 'の', 'も', 'と', 'か'];

// ---------- Comparar fichas (subsecuencia común más larga) ----------
export function tokenDiff(given, answer) {
  const n = given.length, m = answer.length, L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = given[i] === answer[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const okG = new Set(), okA = new Set();
  for (let i = 0, j = 0; i < n && j < m;) {
    if (given[i] === answer[j]) { okG.add(i); okA.add(j); i++; j++; }
    else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
  }
  return { mine: given.map((tok, i) => ({ tok, ok: okG.has(i) })), need: answer.map((tok, j) => ({ tok, ok: okA.has(j) })) };
}

// ---------- Notas fijas ----------
const isParticle = tok => TIP_PARTICLES.includes(tok);
const wordOf = tok => LEX.find(w => w.kind === 'v' && verbForms(w).includes(tok)) || null;
// Nombre de la forma de un verbo
export function formName(w, tok) {
  const stem = w.kana.slice(0, -2);
  const ends = { 'ます': 'masu', 'ました': 'mashita', 'ません': 'masen', 'ませんでした': 'masendeshita', 'ましょう': 'mashou', 'たい': 'tai', 'ながら': 'nagara' };
  for (const [e, k] of Object.entries(ends)) if (tok === stem + e) return k;
  if (tok === w.te) return 'te';
  if (w.te && tok === taOf(w.te)) return 'ta';
  if (tok === w.dict) return 'dict';
  return null;
}
// Notas para una frase armada con fichas (o una respuesta elegida, comparada con la correcta)
export function tokenNotes(given, answer) {
  const d = tokenDiff(given, answer), notes = [];
  // Una partícula que está en las dos pero en otro lugar es un problema de orden, no de partícula
  const badAll = d.mine.filter(x => !x.ok && isParticle(x.tok)).map(x => x.tok), needAll = d.need.filter(x => !x.ok && isParticle(x.tok)).map(x => x.tok);
  const badP = badAll.filter(p => !needAll.includes(p)), needP = needAll.filter(p => !badAll.includes(p));
  if (needP.length && badP.length) notes.push(t('fx.pair', { need: needP[0], got: badP[0] }) + ` ${t('fx.p.' + needP[0])} ${t('fx.pairGot', { got: badP[0] })} ${t('fx.p.' + badP[0])}`);
  else if (needP.length) notes.push(t('fx.needP', { p: needP[0] }) + ' ' + t('fx.p.' + needP[0]));
  else if (badP.length) notes.push(t('fx.extraP', { p: badP[0] }) + ' ' + t('fx.p.' + badP[0]));
  // Mismo verbo en otra forma
  const badV = d.mine.filter(x => !x.ok).map(x => ({ tok: x.tok, w: wordOf(x.tok) })).filter(x => x.w);
  for (const b of badV) {
    const good = d.need.find(x => !x.ok && b.w && verbForms(b.w).includes(x.tok));
    const f1 = good && formName(b.w, good.tok), f2 = formName(b.w, b.tok);
    if (f1 && f2 && f1 !== f2) { notes.push(t('fx.form', { got: b.tok, gotF: t('fx.f.' + f2), need: good.tok, needF: t('fx.f.' + f1) })); break; }
  }
  // Las mismas fichas en otro orden
  if (!notes.length && given.length === answer.length && [...given].sort().join() === [...answer].sort().join()) {
    const last = answer[answer.length - 1];
    notes.push(t(wordOf(last) || ['です', 'でした'].includes(last) ? 'fx.orderVerb' : 'fx.order'));
  }
  return { diff: d, notes };
}
// Qué significa lo que elegiste (ejercicios de significado y de kanji)
export function choiceNote(chosen, { kanji = false } = {}) {
  if (kanji) {
    const k = Object.keys(KANJI).find(x => KANJI[x].m === chosen);
    return k ? t('fx.chosenK', { m: chosen, k }) : '';
  }
  const w = LEX.find(x => tr(x) === chosen);
  return w ? t('fx.chosenW', { m: chosen, w: w.kana }) : '';
}
// Significado de una respuesta armada con palabras del diario (charlas)
export const replyMeaning = ids => ids.map(id => LEX.find(w => w.id === id)).filter(Boolean).map(w => `${w.kana} = ${tr(w)}`).join(' · ');

// ---------- Panel ----------
const rowHTML = (toks, cls, render) => `<div class="fx-row ${cls}">${toks.map(x => `<span class="fx-t${x.ok ? '' : ' x'}">${render(x.tok)}</span>`).join('')}</div>`;
// opts: { diff?, render?, notes, ask: { question, given, correct } } · al tocar «Entendido», onDone()
export function fixPanel(body, { diff, render = esc, notes = [], extra = '', ask }, onDone) {
  const why = ask && aiOn();
  const box = document.createElement('div');
  box.className = 'fx';
  box.innerHTML = `<p class="fx-k">${t('fx.title')}</p>
    ${diff ? `<p class="fx-h">${t('fx.mine')}</p>${rowHTML(diff.mine, 'mine', render)}<p class="fx-h">${t('fx.right')}</p>${rowHTML(diff.need, 'need', render)}` : ''}
    ${extra}
    ${notes.filter(Boolean).map(n => `<p class="fx-n">${ic('bulb')}<span>${n}</span></p>`).join('')}
    <div class="fx-ai" hidden></div>
    <div class="fx-acts">${why ? `<button class="btn ghost fx-why">${ic('sparkles')} ${t('fx.why')}</button>` : ''}<button class="btn ok fx-ok">${t('dojo.gotIt')}</button></div>`;
  body.append(box);
  box.scrollIntoView?.({ block: 'nearest' });
  box.querySelector('.fx-ok').onclick = () => onDone();
  const w = box.querySelector('.fx-why');
  if (w) w.onclick = async () => {
    w.disabled = true; w.textContent = t('fx.thinking');
    const out = box.querySelector('.fx-ai');
    try { out.innerHTML = `${ic('sparkles')}<span>${esc(await explain(ask.question, ask.given, ask.correct, notes.filter(Boolean).join(' ')))}</span>`; out.hidden = false; w.remove(); }
    catch (e) { w.textContent = e.message; }
  };
  return box;
}
