// KANJŪ · round.js — motor de rondas del entrenamiento (docs/CURRICULO.md §1–§4, tarea A-03).
// Una ronda = 1 apertura + 11 ejercicios: palabras de la sección, 2 del kanji de la criatura, frases y repaso.
// La interfaz de aquí es provisoria (estilos del Dojo) hasta que se apruebe la propuesta A-02.
import { KANJI, mainRead } from './data.js';
import { S, grade } from './state.js';
import { t } from './i18n.js';
import { kanaHTML } from './help.js';
import { speak } from './games.js';
import { wordExercise } from './wordgames.js';
import { WORD, tr, jaTokens, jaHTML, jaPlain, wordHTML, gradeWord, meet, lexDue } from './lex.js';
import { SECTIONS, sectionById, phraseById, nextSection } from './curriculum.js';
import { creatureSVG } from './creature.js';

export const ROUNDS = 5;   // rondas para completar una sección
export const PASS = .8;    // la ronda cuenta con el 80 % o más
const shuffle = (a, rnd = Math.random) => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

// ---------- Progreso (S.cur) ----------
// Partidas sin S.cur: empiezan en la etapa 0, o en la 1 si en la nivelación dijeron que leen kana (S.level ≥ 1).
// La ubicación fina de partidas viejas es la tarea A-05.
export function cur() {
  S.cur ??= { sec: (S.level || 0) >= 1 ? '1.1' : '0.1', rounds: {}, done: {}, gold: {}, got: {}, skipped: {}, eggs: {} };
  if (!sectionById(S.cur.sec)) S.cur.sec = SECTIONS[0].id;
  return S.cur;
}
export const curSection = () => sectionById(cur().sec);
export const roundsOf = id => cur().rounds[id] || 0;
export const isDone = id => !!cur().done[id];

// Una palabra de la sección entra al diario la primera vez que aparece en una ronda
export function touchWord(id, sec) {
  if (!WORD[id]) return;
  if (S.lex[id]) return meet(id, 'train');
  S.lex[id] = { box: 0, due: Date.now(), ok: 0, miss: 0, n: 1, at: ['train'], from: `sec:${sec}`, t: Date.now() };
}

// ---------- Armar la ronda ----------
// Pasos: { t: 'intro' } · { t: 'word', id, review? } · { t: 'phrase', id } · { t: 'kanji', k, ask: 'meaning' | 'read' }
export function planRound(k, secId = cur().sec, rnd = Math.random) {
  const s = sectionById(secId);
  const box = id => S.lex[id]?.box ?? -1;
  // Primero lo nuevo y lo más flojo; en empate, al azar
  const words = shuffle(s.words, rnd).sort((a, b) => box(a) - box(b));
  const w = i => ({ t: 'word', id: words[i % words.length] });
  const seen = id => S.phr[id]?.n || 0;
  const phrases = shuffle(s.phrases, rnd).sort((a, b) => seen(a) - seen(b));
  const p = i => ({ t: 'phrase', id: phrases[i % phrases.length] });
  // Repaso: palabras vencidas de otras secciones; si no hay, kanji vencidos de la colección; si no, más de la sección
  const own = new Set(s.words);
  const dueW = lexDue().filter(id => !own.has(id) && WORD[id]);
  const dueK = Object.keys(S.srs).filter(x => x !== k && KANJI[x] && S.srs[x].due <= Date.now());
  const rev = i => dueW[i] ? { t: 'word', id: dueW[i], review: true } : dueK[i] ? { t: 'kanji', k: dueK[i], ask: 'meaning', review: true } : w(6 + i);
  const kan = ask => KANJI[k] ? { t: 'kanji', k, ask } : w(7);
  return [{ t: 'intro' }, w(0), w(1), w(2), kan('meaning'), w(3), p(0), w(4), kan('read'), rev(0), rev(1), p(1)];
}

// ---------- Cerrar la ronda ----------
// Devuelve { counted, rounds, completed, next } y avanza la sección si se completa.
export function endRound(secId, right, total) {
  const c = cur(), counted = total > 0 && right / total >= PASS;
  if (counted && !c.done[secId]) c.rounds[secId] = Math.min(ROUNDS, (c.rounds[secId] || 0) + 1);
  let completed = false, next = null;
  if (counted && !c.done[secId] && c.rounds[secId] >= ROUNDS) {
    c.done[secId] = Date.now(); completed = true;
    next = nextSection(secId);
    if (next && c.sec === secId) c.sec = next.id;
  }
  return { counted, rounds: c.rounds[secId] || 0, completed, next };
}

// ---------- Ejercicios propios de la ronda ----------
// Frase: ordenar las fichas. Sirve para PHRASES y para las frases del currículo (EXTRA).
function phraseExercise(ph, body, done) {
  const toks = jaTokens(ph.ja, ph.ids), answer = toks.map(x => x.tok);
  const extra = shuffle(['は', 'が', 'を', 'に', 'の', 'も'].filter(x => !answer.includes(x))).slice(0, 2).map(tok => ({ tok, w: null }));
  const tiles = shuffle([...toks, ...extra]).map(x => ({ v: x.tok, html: x.w ? wordHTML(x.w, x.tok) : kanaHTML(x.tok, { particle: true }) }));
  body.innerHTML = `<p class="hint">${t('dojo.order')}</p><div class="qm sm">«${tr(ph)}»</div><div class="asm-row" aria-live="polite"></div>
    <div class="asm-bank">${tiles.map((x, i) => `<button class="asm-t" data-i="${i}">${x.html}</button>`).join('')}</div>
    <button class="link asm-skip">${t('dojo.dontKnow')}</button>`;
  const row = body.querySelector('.asm-row'), bank = body.querySelector('.asm-bank'), picked = [];
  let over = false;
  const reveal = ok => {
    over = true; body.querySelectorAll('.asm-t').forEach(b => b.disabled = true); body.querySelector('.asm-skip').hidden = true;
    row.classList.add(ok ? 'right' : 'wrong'); speak(jaPlain(ph.ja));
    if (ok) return setTimeout(() => done(true), 900);
    setTimeout(() => {
      body.innerHTML = `<p class="hint">${t('dojo.remember')}</p><p class="jp qm">${jaHTML(ph.ja, ph.ids)}</p><small>${tr(ph)}</small><button class="btn ok wide">${t('dojo.gotIt')}</button>`;
      body.querySelector('.btn').onclick = () => done(false);
    }, 800);
  };
  body.querySelectorAll('.asm-t').forEach(b => b.onclick = () => {
    if (over) return;
    if (b.parentNode === row) { picked.splice(picked.indexOf(b), 1); bank.append(b); return; }
    row.append(b); picked.push(b); navigator.vibrate?.(5);
    if (picked.length === answer.length) reveal(picked.map(x => tiles[x.dataset.i].v).join('\u0001') === answer.join('\u0001'));
  });
  body.querySelector('.asm-skip').onclick = () => !over && reveal(false);
}
// Kanji de la criatura: qué significa, o cómo se lee su lectura principal
function kanjiExercise(k, ask, body, done) {
  const pool = shuffle(Object.keys(KANJI).filter(x => x !== k && !KANJI[x].recipes?.some(r => r.some(p => !KANJI[p]))));
  const val = x => ask === 'read' ? mainRead(x) : KANJI[x].m;
  const correct = val(k), opts = shuffle([correct, ...[...new Set(pool.map(val))].filter(v => v && v !== correct).slice(0, 3)]);
  body.innerHTML = `<div class="qw">${k}</div><p class="hint">${t(ask === 'read' ? 'round.kRead' : 'round.kMeaning')}</p>
    <div class="opts txt">${opts.map(o => `<button class="opt" data-v="${o}">${ask === 'read' ? kanaHTML(o) : o}</button>`).join('')}</div>`;
  body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    body.querySelectorAll('.opt').forEach(x => x.disabled = true);
    const ok = b.dataset.v === correct;
    b.classList.add(ok ? 'right' : 'wrong');
    if (!ok) [...body.querySelectorAll('.opt')].find(x => x.dataset.v === correct)?.classList.add('right');
    speak(mainRead(k)); setTimeout(() => done(ok), ok ? 700 : 1300);
  });
}

// ---------- Jugar una ronda ----------
// Resuelve { right, total, kanjiOk } o null si el jugador sale. Un error no corta la ronda: el paso vuelve al final una vez.
export function runRound(c, root) {
  const s = curSection(), steps = planRound(c.k, s.id);
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'game round';
    wrap.innerHTML = `<div class="game-head"><span class="chip">${tr(s.title)}</span><span class="rd-dots"></span><button class="x" aria-label="${t('dojo.back')}">✕</button></div><div class="game-body"></div>`;
    root.append(wrap);
    const body = wrap.querySelector('.game-body'), dots = wrap.querySelector('.rd-dots');
    const queue = steps.map((st, i) => ({ ...st, i })), retried = new Set();
    let right = 0, total = 0, kanjiOk = 0, pos = 0; // pos = pasos terminados (acertados, o fallados por segunda vez)
    const end = res => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); resolve(res); };
    wrap.querySelector('.x').onclick = () => end(null);
    const paint = () => dots.textContent = `${Math.min(pos, steps.length - 1)}/${steps.length - 1}`;
    const next = () => {
      const st = queue.shift(); paint();
      if (!st) return end({ right, total, kanjiOk });
      const after = ok => {
        if (!retried.has(st.i)) { total++; if (ok) right++; }
        if (!ok && !retried.has(st.i)) { retried.add(st.i); queue.push(st); }
        if (ok || st.again) pos++;
        if (!ok && !st.again) queue[queue.length - 1].again = true;
        next();
      };
      if (st.t === 'intro') {
        pos++;
        body.innerHTML = `<div class="rd-intro"><span class="rd-art">${creatureSVG(c.k)}</span><p class="qm sm">${tr(s.intro)}</p></div><button class="btn ok wide">${t('round.start')}</button>`;
        return body.querySelector('.btn').onclick = next;
      }
      if (st.t === 'word') {
        touchWord(st.id, s.id);
        return wordExercise(st.id, body, ok => { gradeWord(st.id, ok); after(ok); });
      }
      if (st.t === 'phrase') {
        const ph = phraseById(st.id);
        ph.ids.forEach(id => touchWord(id, s.id));
        // La frase suma encuentros a sus palabras; no cambia sus cajas (eso lo hacen los ejercicios de cada palabra)
        return phraseExercise(ph, body, ok => { (S.phr[ph.id] ??= { n: 0, t: Date.now() }).n++; if (ok) ph.ids.forEach(id => meet(id, 'train')); after(ok); });
      }
      return kanjiExercise(st.k, st.ask, body, ok => { grade(st.k, ok); if (ok && st.k === c.k) kanjiOk++; after(ok); });
    };
    next();
  });
}

