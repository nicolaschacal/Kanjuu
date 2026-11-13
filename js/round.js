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
import { SECTIONS, sectionById, phraseById, nextSection, TALKS } from './curriculum.js';
import { creatureSVG } from './creature.js';
import { STROKES } from './strokes.js';
import { arrive } from './world.js';
import { tokenNotes, replyMeaning, fixPanel } from './feedback.js';

export const ROUNDS = 5;   // rondas para completar una sección
export const PASS = .8;    // la ronda cuenta con el 80 % o más
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = (a, rnd = Math.random) => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

// ---------- Progreso (S.cur) ----------
// Partidas sin S.cur: empiezan en la etapa 0, o en la 1 si en la nivelación dijeron que leen kana (S.level ≥ 1).
// La ubicación fina de partidas viejas es la tarea A-05.
export function cur() {
  if (!S.cur) { S.cur = { sec: SECTIONS[0].id, rounds: {}, done: {}, gold: {}, got: {}, skipped: {}, eggs: {} }; place(); }
  if (!sectionById(S.cur.sec)) S.cur.sec = SECTIONS[0].id;
  return S.cur;
}
// Ubicación (tarea A-05): quien dijo que lee kana (S.level ≥ 1) salta la etapa 0, y toda partida salta las secciones
// cuyas palabras ya domina (80 % en caja 2 o más, por viajes o el Dojo). Las salteadas quedan completas y sin premio.
export const known = s => s.words.filter(id => (S.lex[id]?.box || 0) >= 2).length >= Math.ceil(s.words.length * PASS);
function place() {
  for (const s of SECTIONS) {
    if (!(s.stage === 'e0' && (S.level || 0) >= 1) && !known(s)) { S.cur.sec = s.id; return; }
    skip(s.id);
  }
}
function skip(id) { const c = S.cur; c.done[id] ??= Date.now(); c.skipped[id] = true; c.rounds[id] = ROUNDS; }
// Prueba «Ya sé esto»: en la etapa 0 cubre todo lo que queda de la etapa (para quien ya lee kana); después, la sección.
export const testScope = (secId = cur().sec) => {
  const s = sectionById(secId);
  return s.stage === 'e0' ? SECTIONS.filter(x => x.stage === 'e0' && !cur().done[x.id]) : [s];
};
export const TEST_SIZE = 10;
export function planTest(secId = cur().sec, rnd = Math.random) {
  const secs = testScope(secId), words = shuffle([...new Set(secs.flatMap(s => s.words))], rnd).slice(0, TEST_SIZE - 1);
  const ph = shuffle(secs.flatMap(s => s.phrases), rnd)[0];
  return [...words.map(id => ({ t: 'word', id })), { t: 'phrase', id: ph }];
}
// Aprobar la prueba (80 %) completa las secciones de su alcance sin premio y lleva a la siguiente
export function passTest(secId, right, total) {
  const ok = total > 0 && right / total >= PASS, secs = testScope(secId);
  if (ok) {
    secs.forEach(s => skip(s.id));
    const last = secs.at(-1), next = nextSection(last.id);
    if (next) S.cur.sec = next.id;
    return { ok, secs, next };
  }
  return { ok, secs, next: null };
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
  // La situación con diálogo de la sección (si tiene) ocupa el lugar de una palabra
  const talk = TALKS[secId] ? { t: 'talk' } : w(3);
  return [{ t: 'intro' }, w(0), w(1), w(2), kan('meaning'), talk, p(0), w(4), kan('read'), rev(0), rev(1), p(1)];
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
    // El premio queda pintado; despierta ahora o más adelante, cuando se domine su palabra (checkPrizes)
    if (sectionById(secId).reward && !c.skipped[secId]) c.got[secId] ??= 'asleep';
  }
  return { counted, rounds: c.rounds[secId] || 0, completed, next, prizes: checkPrizes() };
}

// ---------- Premio de sección: un kanji que se pinta con tinta (docs/CURRICULO.md §5) ----------
// Cada entrenamiento que cuenta pinta una parte de sus trazos reales (KanjiVG). Con la sección completa, el kanji
// queda pintado y «dormido» hasta que su palabra llega a la caja WAKE (en la etapa 0, los huevos piden más).
export const WAKE = { e0: 3, other: 2 };
export const PRIZE_INK = 30; // si el jugador ya tenía esa criatura
export const strokesOf = k => STROKES[k]?.length || 5;
export const paintedOf = (secId, rounds = roundsOf(secId)) => {
  const s = sectionById(secId); if (!s?.reward) return 0;
  return Math.round(strokesOf(s.reward) * Math.min(rounds, ROUNDS) / ROUNDS);
};
export const prizeState = secId => cur().got[secId] || null; // null · 'asleep' · 'alive' · 'ink' · 'gate'
export const wakeBox = s => s.stage === 'e0' ? WAKE.e0 : WAKE.other;
// Despierta los premios dormidos cuya palabra ya está dominada. Devuelve [{ sec, k, as: 'alive'|'gate'|'ink' }].
export function checkPrizes() {
  const c = cur(), out = [];
  for (const [id, st] of Object.entries(c.got)) {
    if (st !== 'asleep') continue;
    const s = sectionById(id); if (!s?.reward) continue;
    if ((S.lex[s.rewardWord]?.box || 0) < wakeBox(s)) continue;
    let as;
    if (S.dex[s.reward]?.owned) { S.ink += PRIZE_INK; as = 'ink'; }
    else as = arrive(s.reward).where === 'gate' ? 'gate' : 'alive';
    c.got[id] = as; out.push({ sec: id, k: s.reward, as });
  }
  return out;
}

// Kanji pintado: `done` trazos en tinta, los `fresh` siguientes se dibujan ahora, el resto como guía tenue
export function inkSVG(k, done, fresh = 0) {
  const st = STROKES[k]; if (!st) return `<span class="rd-inkk">${done ? k : '？'}</span>`;
  return `<svg class="rd-ink" viewBox="0 0 109 109" role="img" aria-label="${done >= st.length ? k : '？'}"><g class="g">${st.map(d => `<path d="${d}"/>`).join('')}</g>
    <g class="d">${st.slice(0, done).map(d => `<path d="${d}"/>`).join('')}</g>
    <g class="n">${st.slice(done, done + fresh).map((d, i) => `<path d="${d}" style="animation-delay:${.4 + i * .6}s"/>`).join('')}</g></svg>`;
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
    // Qué estuvo mal (A-12): las fichas que no van, y la partícula o la forma confundida
    const given = picked.map(x => tiles[x.dataset.i].v), html = tok => { const x = toks.find(y => y.tok === tok); return x?.w ? wordHTML(x.w, tok) : kanaHTML(tok, { particle: true }); };
    setTimeout(() => {
      body.innerHTML = `<div class="qm sm">«${tr(ph)}»</div>`;
      const r = given.length ? tokenNotes(given, answer) : null;
      fixPanel(body, { diff: r?.diff, render: html, notes: r?.notes || [], extra: r ? '' : `<p class="jp qm">${jaHTML(ph.ja, ph.ids)}</p>`,
        ask: given.length && { question: `${t('dojo.order')}: «${tr(ph)}»`, given: given.join(' '), correct: ph.ja } }, () => done(false));
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
// Situación: elegir qué contestarle al personaje (la primera respuesta de los datos es la correcta)
export function talkExercise(d, body, done) {
  const opts = shuffle(d.opts.map((o, i) => ({ ...o, ok: i === 0 })));
  body.innerHTML = `<p class="hint">${t('round.reply')} <b>${tr(d.hint)}</b></p>
    <div class="rd-replies">${opts.map((o, i) => `<button class="rd-reply jp" data-i="${i}">${jaHTML(o.ja, o.ids)}</button>`).join('')}</div>`;
  body.querySelectorAll('.rd-reply').forEach(b => b.onclick = () => {
    body.querySelectorAll('.rd-reply').forEach(x => x.disabled = true);
    const o = opts[+b.dataset.i];
    b.classList.add(o.ok ? 'right' : 'wrong');
    const good = opts.find(x => x.ok);
    speak(jaPlain(good.ja));
    if (o.ok) return setTimeout(() => done(true), 800);
    body.querySelectorAll('.rd-reply')[opts.indexOf(good)].classList.add('right');
    // Qué dijiste y qué correspondía (A-12)
    const { notes } = tokenNotes(o.ja.split(/\s+/), good.ja.split(/\s+/));
    const mean = (cls, label, x) => replyMeaning(x.ids) ? `<p class="fx-m ${cls}"><b>${label}</b> ${replyMeaning(x.ids)}</p>` : '';
    fixPanel(body, { notes: notes.slice(0, 1), extra: mean('mine', t('fx.said'), o) + mean('need', t('fx.fits'), good),
      ask: { question: `${t('round.reply')} ${tr(d.hint)}`, given: o.ja, correct: good.ja } }, () => done(false));
  });
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
    speak(mainRead(k));
    if (ok) return setTimeout(() => done(true), 700);
    [...body.querySelectorAll('.opt')].find(x => x.dataset.v === correct)?.classList.add('right');
    const chosen = b.dataset.v, other = Object.keys(KANJI).find(x => x !== k && (ask === 'read' ? mainRead(x) : KANJI[x].m) === chosen);
    fixPanel(body, { notes: [other ? t(ask === 'read' ? 'fx.chosenR' : 'fx.chosenK', { m: chosen, k: other }) : '', t('fx.kanjiIs', { k, m: KANJI[k].m, r: mainRead(k) })],
      ask: { question: t(ask === 'read' ? 'round.kRead' : 'round.kMeaning') + ' ' + k, given: chosen, correct } }, () => done(false));
  });
}

// Salón de entrenamiento de papel (propuesta A-02): pared shōji, tatami y sol. De noche cuando la criatura usa su poder.
export function roomSVG(h = 260) {
  return `<svg class="rd-room" viewBox="0 0 390 ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <rect width="390" height="${h}" class="wall"/>
    <g class="ribs" stroke-width="3">${[0, 1, 2, 3, 4].map(i => `<line x1="${i * 98}" y1="0" x2="${i * 98}" y2="${h * .68}"/>`).join('')}<line x1="0" y1="${h * .34}" x2="390" y2="${h * .34}"/></g>
    <circle class="sun" cx="300" cy="${h * .2}" r="24"/>
    <rect y="${h * .68}" width="390" height="${h * .32}" class="mat"/>
    <g class="mat-l" stroke-width="2.5">${[0, 1, 2, 3].map(i => `<line x1="${i * 130}" y1="${h * .68}" x2="${i * 130 + 40}" y2="${h}"/>`).join('')}</g>
    <rect y="${h * .68 - 4}" width="390" height="6" class="sill"/></svg>`;
}

// ---------- Jugar una ronda ----------
// Resuelve { right, total, kanjiOk } o null si el jugador sale. Un error no corta la ronda: el paso vuelve al final una vez.
export function runRound(c, root, { test = false } = {}) {
  const s = curSection(), steps = test ? planTest(s.id) : planRound(c.k, s.id);
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'game round rd-lesson';
    const n = test ? steps.length : steps.length - 1;
    wrap.innerHTML = `<div class="rd-scene">${roomSVG()}<button class="x rd-x" aria-label="${t('dojo.back')}">${'✕'}</button>
      <div class="rd-drops">${Array.from({ length: n }, (_, i) => `<i class="${steps[test ? i : i + 1]?.t === 'kanji' && steps[test ? i : i + 1]?.k === c.k ? 'k' : ''}"></i>`).join('')}</div>
      <div class="rd-bub"><span class="who">${c.k}</span><p></p></div><span class="rd-me">${creatureSVG(c.k)}</span><span class="rd-npc"></span></div>
      <p class="rd-sec">${tr(s.title)}</p><div class="game-body rd-low"></div>`;
    root.append(wrap);
    const body = wrap.querySelector('.game-body'), drops = [...wrap.querySelectorAll('.rd-drops i')], scene = wrap.querySelector('.rd-scene');
    const say = (txt, who = c.k, html = false) => { const b = wrap.querySelector('.rd-bub p'); b[html ? 'innerHTML' : 'textContent'] = txt; wrap.querySelector('.rd-bub .who').textContent = who; wrap.querySelector('.rd-bub').classList.toggle('npc', who !== c.k); wrap.querySelector('.rd-bub').classList.remove('pop'); void b.offsetWidth; wrap.querySelector('.rd-bub').classList.add('pop'); };
    // Con IA, a veces la criatura festeja con una frase de sabor propia (aigen.js; solo palabras que ya conoces)
    const flavor = S.ai?.flavor?.[c.k] || [];
    const react = ok => {
      const f = ok && flavor.length && Math.random() < .35 ? pick(flavor) : null;
      f ? say(`<span class="jp">${jaHTML(f.ja, f.ids)}</span><small>${f.tr.replace(/</g, '&lt;')}</small>`, c.k, true) : say(pick(t(ok ? 'round.sayOk' : 'round.sayMiss').split('|')));
      wrap.querySelector('.rd-me').classList.toggle('happy', ok);
    };
    const queue = steps.map((st, i) => ({ ...st, i })), retried = new Set();
    let right = 0, total = 0, kanjiOk = 0, pos = 0; const used = new Set(), use = id => { touchWord(id, s.id); used.add(id); }; // pos = pasos terminados (acertados, o fallados por segunda vez)
    const end = res => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); resolve(res); };
    wrap.querySelector('.x').onclick = () => end(null);
    const paint = () => drops.forEach((d, i) => { d.classList.toggle('on', i < pos); d.classList.toggle('now', i === pos); });
    const next = () => {
      const st = queue.shift(); paint();
      if (!st) return end({ right, total, kanjiOk, words: [...used] });
      const after = ok => {
        if (!retried.has(st.i)) { total++; if (ok) right++; }
        if (!test) react(ok);
        scene.classList.remove('power', 'talk'); wrap.querySelector('.rd-npc').innerHTML = '';
        if (!ok && !retried.has(st.i) && !test) { retried.add(st.i); queue.push(st); }
        if (ok || st.again || test) pos++;
        if (!ok && !st.again) queue[queue.length - 1].again = true;
        test ? next() : setTimeout(next, 700); // un momento para leer la reacción de la criatura
      };
      if (st.t === 'intro') {
        say(tr(s.intro));
        body.innerHTML = `${s.reward ? `<div class="rd-goal"><span class="rd-ink-box">${inkSVG(s.reward, paintedOf(s.id))}</span><span><b>${tr(s.title)} · ${t('book.progress', { n: Math.min(ROUNDS, roundsOf(s.id) + 1), total: ROUNDS })}</b><small>${t('round.goal')}</small></span></div>` : ''}<button class="btn ok wide">${t('round.start')}</button>
          ${isDone(s.id) ? '' : `<button class="link rd-skip">${t(s.stage === 'e0' ? 'round.skipKana' : 'round.skip')}</button>`}`;
        body.querySelector('.rd-skip') && (body.querySelector('.rd-skip').onclick = () => end({ skipTest: true }));
        return body.querySelector('.btn').onclick = () => { pos = 0; next(); };
      }
      if (st.t === 'word') {
        use(st.id); say(t(st.review ? 'round.sayReview' : 'round.sayWord'));
        return wordExercise(st.id, body, ok => { gradeWord(st.id, ok); after(ok); });
      }
      if (st.t === 'phrase') {
        const ph = phraseById(st.id); say(t('round.sayPhrase'));
        ph.ids.forEach(use);
        // La frase suma encuentros a sus palabras; no cambia sus cajas (eso lo hacen los ejercicios de cada palabra)
        return phraseExercise(ph, body, ok => { (S.phr[ph.id] ??= { n: 0, t: Date.now() }).n++; if (ok) ph.ids.forEach(id => meet(id, 'train')); after(ok); });
      }
      if (st.t === 'talk') {
        const d = TALKS[s.id];
        d.ids.forEach(use);
        scene.classList.add('talk'); wrap.querySelector('.rd-npc').innerHTML = creatureSVG(d.who);
        say(`<span class="jp">${jaHTML(d.ja, d.ids)}</span><small>${tr(d)}</small>`, d.who, true);
        return talkExercise(d, body, ok => { if (ok) d.ids.forEach(id => meet(id, 'train')); after(ok); });
      }
      const mine = st.k === c.k;
      if (mine) { scene.classList.add('power'); say(t('round.sayPower', { k: c.k })); } else say(t('round.sayReview'));
      return kanjiExercise(st.k, st.ask, body, ok => { grade(st.k, ok); if (ok && st.k === c.k) kanjiOk++; after(ok); });
    };
    next();
  });
}

