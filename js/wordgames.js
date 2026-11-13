// KANJŪ · wordgames.js — ejercicios de palabras para el repaso del Dojo (docs/APRENDIZAJE.md §4)
// De menor a mayor exigencia según la caja: oír → significado · kana → significado · significado → armar con fichas · ordenar una frase.
// Sin relojes: la lengua va en momentos tranquilos (regla 6).
import { ic } from './icons.js';
import { S } from './state.js';
import { t } from './i18n.js';
import { kanaUnits, kanaHTML, kanaHit, kanaMiss } from './help.js';
import { speak, canSpeak } from './games.js';
import { WORD, LEX, tr, wordHTML, jaHTML, jaTokens, jaPlain, phrasesOf, foundIds } from './lex.js';

const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const IS_KANA = /[ぁ-ゖァ-ヺ]/;

export const wordType = box => box <= 0 ? 'l2m' : box === 1 ? 'k2m' : box <= 3 ? 'build' : 'order';

// Tarjeta de la palabra: se muestra al fallar, con una frase que ya se puede leer
export function wordCardHTML(w) {
  const p = phrasesOf(w.id)[0];
  return `<div class="wcard"><div class="wcard-k">${wordHTML(w)}</div><b>${tr(w)}</b>
    ${p ? `<p class="jp">${jaHTML(p.ja, p.ids, w.id)}</p><small>${tr(p)}</small>` : ''}</div>`;
}

// Un ejercicio para la palabra `id`; llama a done(true|false) cuando termina
export function wordExercise(id, body, done) {
  const w = WORD[id], box = S.lex[id]?.box || 0;
  let type = wordType(box);
  const phrase = type === 'order' ? shuffle(phrasesOf(id).filter(p => jaTokens(p.ja, p.ids).length >= 3))[0] : null;
  if (type === 'order' && !phrase) type = 'build';
  if (type === 'l2m' && !canSpeak()) type = 'k2m';
  const readsKana = type === 'k2m' || type === 'build';
  const fail = () => {
    if (readsKana) kanaMiss(w.kana);
    setTimeout(() => {
      body.innerHTML = `<p class="hint">${t('dojo.remember')}</p>${wordCardHTML(w)}<button class="btn ok wide">${t('dojo.gotIt')}</button>`;
      speak(w.kana);
      body.querySelector('.btn').onclick = () => done(false);
    }, 700);
  };
  const win = () => { if (readsKana) kanaHit(w.kana); navigator.vibrate?.(8); speak(phrase ? jaPlain(phrase.ja) : w.kana); setTimeout(() => done(true), 750); };

  if (type === 'l2m' || type === 'k2m') {
    // Distractores: primero palabras ya halladas (lo que el jugador podría confundir de verdad)
    const mine = shuffle(foundIds().filter(x => x !== id).map(x => WORD[x])), rest = shuffle(LEX.filter(x => x.id !== id && !S.lex[x.id]));
    const correct = tr(w), opts = shuffle([correct, ...[...new Set([...mine, ...rest].map(tr))].filter(m => m !== correct).slice(0, 3)]);
    body.innerHTML = `${type === 'l2m'
      ? `<button class="speaker" aria-label="${t('dojo.listen')}">${ic('sound')}<span></span></button><p class="hint">${t('dojo.hearMeaning')}</p>`
      : `<div class="qw">${wordHTML(w)}</div><p class="hint">${t('dojo.meaning')}</p>`}
      <div class="opts txt">${opts.map(o => `<button class="opt">${o}</button>`).join('')}</div>`;
    const sp = body.querySelector('.speaker');
    if (sp) { sp.onclick = () => speak(w.kana); setTimeout(() => speak(w.kana), 200); }
    body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      body.querySelectorAll('.opt').forEach(x => x.disabled = true);
      if (sp) sp.querySelector('span').innerHTML = kanaHTML(w.kana);
      if (b.textContent === correct) { b.classList.add('right'); win(); }
      else { b.classList.add('wrong'); [...body.querySelectorAll('.opt')].find(x => x.textContent === correct)?.classList.add('right'); fail(); }
    });
    return;
  }
  // Armar: se ve el significado y se recupera la forma, ficha por ficha
  let tiles, answer, prompt;
  if (type === 'build') {
    answer = kanaUnits(w.kana);
    const extra = shuffle([...new Set(LEX.filter(x => x.id !== id).flatMap(x => kanaUnits(x.kana)))].filter(u => IS_KANA.test(u) && !answer.includes(u))).slice(0, Math.min(4, Math.max(2, 6 - answer.length)));
    tiles = shuffle([...answer, ...extra]).map(u => ({ v: u, html: kanaHTML(u) }));
    prompt = `<p class="hint">${t('dojo.build')}</p><div class="qm">«${tr(w)}»</div>`;
  } else {
    const toks = jaTokens(phrase.ja, phrase.ids);
    answer = toks.map(x => x.tok);
    tiles = shuffle(toks).map(x => ({ v: x.tok, html: x.w ? wordHTML(x.w) : kanaHTML(x.tok, { particle: true }) }));
    prompt = `<p class="hint">${t('dojo.order')}</p><div class="qm sm">«${tr(phrase)}»</div>`;
  }
  body.innerHTML = `${prompt}<div class="asm-row" aria-live="polite"></div>
    <div class="asm-bank">${tiles.map((x, i) => `<button class="asm-t" data-i="${i}">${x.html}</button>`).join('')}</div>
    <button class="link asm-skip">${t('dojo.dontKnow')}</button>`;
  const row = body.querySelector('.asm-row'), bank = body.querySelector('.asm-bank'), picked = [];
  let over = false;
  const reveal = ok => {
    over = true; body.querySelectorAll('.asm-t').forEach(b => b.disabled = true); body.querySelector('.asm-skip').hidden = true;
    row.classList.add(ok ? 'right' : 'wrong');
    ok ? win() : fail();
  };
  body.querySelectorAll('.asm-t').forEach(b => b.onclick = () => {
    if (over) return;
    if (b.parentNode === row) { picked.splice(picked.indexOf(b), 1); bank.append(b); return; }
    row.append(b); picked.push(b); navigator.vibrate?.(5);
    // Se comprueba solo al colocar la última ficha: recuperar, no tantear
    if (picked.length === answer.length) reveal(picked.map(x => tiles[x.dataset.i].v).join('\u0001') === answer.join('\u0001'));
  });
  body.querySelector('.asm-skip').onclick = () => !over && reveal(false);
}
