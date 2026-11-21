// KANJŪ · round.js — motor de rondas del entrenamiento (docs/CURRICULO.md §1–§4, tarea A-03).
// Una ronda = 1 apertura + 11 ejercicios: palabras de la sección, 2 del kanji de la criatura, frases y repaso.
// La interfaz de aquí es provisoria (estilos del Dojo) hasta que se apruebe la propuesta A-02.
import { KANJI, mainRead } from './data.js';
import { S, grade } from './state.js';
import { t } from './i18n.js';
import { kanaHTML, setAid } from './help.js';
import { speak, canSpeak } from './games.js';
import { ic } from './icons.js';
import { wordExercise, extraTiles } from './wordgames.js';
import { WORD, tr, jaTokens, jaHTML, jaPlain, wordHTML, gradeWord, meet, lexDue } from './lex.js';
import { SECTIONS, STAGES, sectionById, phraseById, nextSection, TALKS, LEVELS, ROUNDS_PER_LEVEL, ROUND_SIZE, PRIOR_MIX, JUMP_ERRORS, JUMP_SIZE, JUMP_STAGE_SIZE } from './curriculum.js';
import { creatureSVG } from './creature.js';
import { STROKES } from './strokes.js';
import { arrive } from './world.js';
import { tokenNotes, replyMeaning, fixPanel } from './feedback.js';
import { pairsOf, jaesFits, listenFits, gapsOf, typeFits, similarFits, pairsExercise, jaesExercise, listenExercise, gapExercise, typeExercise, similarExercise, meetExercise } from './exercises.js';

// Una sección tiene LEVELS niveles de ROUNDS_PER_LEVEL rondas (docs/PROGRESION.md §3, tarea P-04)
export const UNIT_ROUNDS = LEVELS * ROUNDS_PER_LEVEL;
const OLD_ROUNDS = 5; // rondas por sección antes de P-04: S.cur.rounds se sigue escribiendo así para partidas viejas
export const PASS = .8;    // la ronda cuenta con el 80 % o más
// Qué ejercicios de palabra admite cada nivel (wordgames.js): reconocer al principio, producir al final
// (nivel 2 sigue en japonés → significado; armar en japonés empieza en el 3)
const LEVEL_TYPES = { 1: { max: 'k2m' }, 2: { max: 'k2m' }, 3: { min: 'k2m' }, 4: { min: 'build' }, 5: { min: 'build' } };
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = (a, rnd = Math.random) => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

// ---------- Progreso (S.cur) ----------
// Partidas sin S.cur: empiezan en la etapa 0, o en la 1 si en la nivelación dijeron que leen kana (S.level ≥ 1).
// La ubicación fina de partidas viejas es la tarea A-05.
export function cur() {
  if (!S.cur) { S.cur = { sec: SECTIONS[0].id, rounds: {}, prog: {}, done: {}, gold: {}, got: {}, skipped: {}, eggs: {}, met: {} }; place(); }
  // P-04: S.cur.prog[sección] = rondas que contaron (0 a UNIT_ROUNDS). Una partida vieja arranca su sección en el
  // nivel 1; lo que ya había pintado (S.cur.rounds, de 0 a 5) se conserva como piso de la tinta (paintedOf).
  S.cur.prog ??= {};
  // P-06: S.cur.met[kanji] = cuándo se presentó su KANJŪ en el nivel 1 (partidas viejas: nada presentado todavía)
  S.cur.met ??= {};
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
function skip(id) { const c = S.cur; c.done[id] ??= Date.now(); c.skipped[id] = true; c.rounds[id] = OLD_ROUNDS; (c.prog ??= {})[id] = UNIT_ROUNDS; }
// ---------- «Saltar aquí» (docs/PROGRESION.md §8, tarea P-06) ----------
// Se puede saltar a una unidad que viene después de la actual, en la etapa actual o en la siguiente. La prueba es de
// producción (sin ayudas) sobre las unidades que se saltan y las anteriores. Se aprueba con hasta JUMP_ERRORS errores;
// si no, todo sigue donde estaba. Las unidades saltadas quedan completas y sin premio (skip()).
const at = id => SECTIONS.findIndex(x => x.id === id);
const stageAt = id => STAGES.findIndex(x => x.id === sectionById(id)?.stage);
export function canJump(target) {
  const c = cur(), s = sectionById(target);
  return !!s && !c.done[target] && at(target) > at(c.sec) && stageAt(target) <= stageAt(c.sec) + 1;
}
// Unidades que quedan saltadas al aprobar: desde la actual hasta la anterior a la elegida
export const jumpSkips = target => SECTIONS.slice(at(cur().sec), at(target)).filter(x => !cur().done[x.id]);
// Al principio de la etapa siguiente, la prueba es más larga (saltar la etapa)
// «Ya sé esto» y pasar de la última unidad de una etapa a la primera de la siguiente van con el tamaño normal
export const jumpSize = target => {
  const s = sectionById(target), c = curSection();
  return s.stage !== c.stage && SECTIONS.find(x => x.stage === s.stage) === s && at(target) > at(c.id) + 1 && jumpFrom(c.id)?.id !== target ? JUMP_STAGE_SIZE : JUMP_SIZE;
};
// «Ya sé esto» desde la ronda: salta a la unidad siguiente; en la etapa 0, «Ya leo kana» salta al principio de la etapa 1
export function jumpFrom(secId) {
  const s = sectionById(secId), first1 = SECTIONS.find(x => x.stage !== 'e0');
  return s.stage === 'e0' ? first1 : nextSection(secId);
}
// Pasos de la prueba: frases para armar, palabras en modo producción, huecos y lecturas con teclado kana
export function planJump(target, rnd = Math.random) {
  const skips = jumpSkips(target), before = SECTIONS.slice(0, at(cur().sec));
  // Primero lo que se salta y, después, lo anterior («todo lo anterior», §8)
  const uniq = a => [...new Set(a)];
  const phrases = uniq([...shuffle(skips.flatMap(x => x.phrases), rnd), ...shuffle(before.flatMap(x => x.phrases), rnd)]).filter(id => phraseById(id));
  const words = uniq([...shuffle(skips.flatMap(x => x.words), rnd), ...shuffle(before.flatMap(x => x.words), rnd)]).filter(id => WORD[id]);
  let pi = 0, wi = 0, gi = 0, yi = 0;
  const w = () => ({ t: 'word', id: words[wi++ % words.length], lv: LEVELS });
  const p = () => phrases.length ? { t: 'phrase', id: phrases[pi++ % phrases.length] } : w();
  const gaps = phrases.flatMap(id => gapsOf(phraseById(id)).map(x => ({ id, i: x.i, kind: x.kind })));
  const g = () => gaps.length ? { t: 'gap', items: [gaps[gi++ % gaps.length]] } : p();
  const yW = words.filter(typeFits), y = () => yW.length ? { t: 'type', ids: [yW[yi++ % yW.length]] } : w();
  const make = { p, w, g, y }, pat = 'p w p g p y p w p g p w p y p'.split(' ');
  return Array.from({ length: jumpSize(target) }, (_, i) => make[pat[i % pat.length]]());
}
// Aprobar: las unidades salteadas quedan completas sin premio y se empieza en la elegida, en el nivel 1
export function passJump(target) {
  const skips = jumpSkips(target);
  skips.forEach(x => skip(x.id));
  cur().sec = target;
  return skips;
}
export const curSection = () => sectionById(cur().sec);
export const isDone = id => !!cur().done[id];
// Rondas que contaron en la sección, nivel actual (1 a LEVELS) y rondas que contaron dentro de ese nivel
export const roundsOf = id => isDone(id) ? UNIT_ROUNDS : Math.min(UNIT_ROUNDS, cur().prog[id] || 0);
export const levelsDone = id => Math.floor(roundsOf(id) / ROUNDS_PER_LEVEL);
export const levelOf = id => Math.min(LEVELS, levelsDone(id) + 1);
export const levelRounds = id => isDone(id) ? ROUNDS_PER_LEVEL : roundsOf(id) % ROUNDS_PER_LEVEL;

// Una palabra de la sección entra al diario la primera vez que aparece en una ronda
export function touchWord(id, sec) {
  if (!WORD[id]) return;
  if (S.lex[id]) return meet(id, 'train');
  S.lex[id] = { box: 0, due: Date.now(), ok: 0, miss: 0, n: 1, at: ['train'], from: `sec:${sec}`, t: Date.now() };
}

// ---------- Armar la ronda ----------
// Pasos: { t: 'intro' } · { t: 'word', id, review?, lv } · { t: 'phrase', id } · { t: 'kanji', k, ask: 'meaning' | 'read' } · { t: 'talk' }
// Cada nivel cambia la mezcla (docs/PROGRESION.md §3): 1 palabras nuevas · 2 frases cortas · 3 más frases ·
// 4 la situación con diálogo · 5 producción con un 30 % de secciones anteriores. Los 2 ejercicios del kanji de la
// criatura siguen en todos los niveles. ROUND_SIZE ejercicios por ronda, sin contar la apertura.
// Letras: w palabra · p frase (español → japonés) · K/R kanji de la criatura (significado/lectura) · v repaso · t situación · o anteriores.
// Ejercicios nuevos (P-05, js/exercises.js), repartidos como en la maqueta P-03: m emparejar (nivel 1) · j japonés → español
// y s kanji parecido (nivel 2) · y escribir la lectura con teclado kana (nivel 3) · l escuchar y armar y g completar el hueco
// (nivel 4). El nivel 5 los mezcla. Si una unidad no tiene material para uno, ese paso vuelve a palabra, frase o kanji.
// Si ROUND_SIZE es mayor que el patrón, el patrón se repite; si LEVELS pasa de 5, los niveles extra usan el último.
export const PLANS = {
  1: 'w m w K w w p w R w m v p w v',
  2: 'w j w K p s j R p w v j w v p',
  3: 'p w K y p p w R j p v y w v p',
  4: 't l w K g p l R p g w v l v p',
  5: 'p w K l p g R w p y p w j w p', // aquí se reparten los pasos «o» según PRIOR_MIX (planOf)
};
const LAST = Math.max(...Object.keys(PLANS).map(Number));
// Pasos de un nivel: el patrón al largo ROUND_SIZE y, en el último nivel, PRIOR_MIX de la ronda con secciones anteriores
export function planOf(lv) {
  const base = PLANS[Math.min(lv, LAST)].split(' '), out = Array.from({ length: ROUND_SIZE }, (_, i) => base[i % base.length]);
  if (lv >= LAST) {
    const n = Math.round(ROUND_SIZE * PRIOR_MIX), free = out.map((c, i) => c === 'K' || c === 'R' ? -1 : i).filter(i => i >= 0);
    for (let j = 0; j < n && free.length; j++) out[free[Math.min(free.length - 1, Math.floor((j + .5) * free.length / n))]] = 'o';
  }
  return out;
}
export function planRound(k, secId = cur().sec, rnd = Math.random, level = levelOf(secId)) {
  const s = sectionById(secId), lv = level >= LEVELS ? LAST : Math.max(1, level); // el último nivel siempre es el de producción
  const box = id => S.lex[id]?.box ?? -1;
  // Primero lo nuevo y lo más flojo; en empate, al azar
  const words = shuffle(s.words, rnd).sort((a, b) => box(a) - box(b));
  let wi = 0, pi = 0, vi = 0, oi = 0;
  const w = () => ({ t: 'word', id: words[wi++ % words.length], lv });
  const seen = id => S.phr[id]?.n || 0;
  const phrases = shuffle(s.phrases, rnd).sort((a, b) => seen(a) - seen(b));
  const p = () => phrases.length ? { t: 'phrase', id: phrases[pi++ % phrases.length] } : w();
  // Repaso: palabras vencidas de otras secciones; si no hay, kanji vencidos de la colección; si no, más de la sección
  const own = new Set(s.words);
  const dueW = lexDue().filter(id => !own.has(id) && WORD[id]);
  const dueK = Object.keys(S.srs).filter(x => x !== k && KANJI[x] && S.srs[x].due <= Date.now());
  const v = () => { const i = vi++; return dueW[i] ? { t: 'word', id: dueW[i], review: true, lv } : dueK[i - dueW.length] ? { t: 'kanji', k: dueK[i - dueW.length], ask: 'meaning', review: true } : w(); };
  // Nivel 5: palabras y frases de las secciones anteriores (lo más flojo primero), intercaladas
  const idx = SECTIONS.indexOf(s), before = SECTIONS.slice(0, Math.max(0, idx));
  const oldW = shuffle([...new Set(before.flatMap(x => x.words))].filter(id => WORD[id] && !own.has(id)), rnd).sort((a, b) => box(a) - box(b));
  const oldP = shuffle([...new Set(before.flatMap(x => x.phrases))], rnd).sort((a, b) => seen(a) - seen(b));
  const o = () => { const i = oi++, ph = i % 2 ? oldP[i >> 1] : null, id = i % 2 ? null : oldW[i >> 1];
    return ph ? { t: 'phrase', id: ph, review: true } : id ? { t: 'word', id, review: true, lv } : v(); };
  const kan = ask => KANJI[k] ? { t: 'kanji', k, ask } : w();
  // La situación con diálogo de la sección (si tiene); si no, una frase
  const talk = () => TALKS[secId] ? { t: 'talk' } : p();
  // Ejercicios nuevos (P-05): cada uno rota por su material y, si no hay, cae en el paso de siempre
  const oldWords = [...new Set(before.flatMap(x => x.words))].filter(id => !own.has(id)).reverse(); // primero las más cercanas
  const rot = (list, n) => list.length ? list[n % list.length] : null;
  let ji = 0, li = 0, gi = 0, yi = 0, si = 0;
  const m = () => { const r = pairsOf([...shuffle(s.words, rnd), ...oldWords], rnd); return r ? { t: 'pairs', ...r } : w(); };
  const jP = phrases.filter(id => jaesFits(phraseById(id))), lP = phrases.filter(id => listenFits(phraseById(id)));
  const j = () => { const id = rot(jP, ji++); return id ? { t: 'jaes', id } : p(); };
  const l = () => { const id = rot(lP, li++); return id ? { t: 'listen', id } : p(); };
  // Hueco: dos frases distintas, primero una partícula y después una forma del verbo si la unidad la tiene
  const gapsAll = phrases.flatMap(id => gapsOf(phraseById(id)).map(x => ({ id, i: x.i, kind: x.kind })));
  const g = () => {
    if (!gapsAll.length) return p();
    const a = rot(gapsAll.filter(x => x.kind === 'p'), gi) || rot(gapsAll, gi);
    const b = rot(gapsAll.filter(x => x.id !== a.id && x.kind === 'v'), gi) || rot(gapsAll.filter(x => x.id !== a.id), gi + 1);
    gi++;
    return { t: 'gap', items: b ? [a, b] : [a] };
  };
  const yW = [...words.filter(typeFits), ...oldWords.filter(typeFits)];
  const y = () => { if (!yW.length) return w(); const a = rot(yW, yi++), b = yW.length > 1 ? rot(yW, yi++) : null; return { t: 'type', ids: b && b !== a ? [a, b] : [a] }; };
  // Kanji parecido: primero los de la unidad, barajados, y después los ya enseñados; cada ronda empieza en otro lugar
  const sK = [...new Set([...shuffle(s.kanji, rnd), ...shuffle(Object.keys(S.srs), rnd), k])].filter(similarFits);
  si = Math.floor(rnd() * Math.max(1, Math.min(sK.length, s.kanji.length || sK.length)));
  const sm = () => { const x = rot(sK, si++); return x ? { t: 'similar', k: x } : kan('meaning'); };
  const make = { w, p, v, o, t: talk, K: () => kan('meaning'), R: () => kan('read'), m, j, l, g, y, s: sm };
  // Nivel 1 (§2b.2): antes de los ejercicios se presentan los KANJŪ de la unidad que todavía no se presentaron, en su
  // orden (los componentes van antes). Se reparten entre las rondas que le quedan al nivel. No cuentan como ejercicio.
  const met = cur().met, unmet = lv === 1 ? s.kanji.filter(x => KANJI[x] && !met[x]) : [];
  const left = Math.max(1, ROUNDS_PER_LEVEL - (isDone(secId) || lv < levelOf(secId) ? 0 : levelRounds(secId))); // al repasar un nivel, las rondas del nivel vuelven a ser todas
  const meets = unmet.slice(0, Math.ceil(unmet.length / left)).map(x => ({ t: 'meet', k: x }));
  return [{ t: 'intro' }, ...meets, ...planOf(lv).map(c => make[c]())];
}

// ---------- Cerrar la ronda ----------
// Devuelve { counted, level, rounds, levelUp, completed, next, prizes } y avanza la sección si se completa.
// rounds = rondas que contaron dentro del nivel; levelUp = esta ronda cerró un nivel (y pintó una parte del kanji).
export function endRound(secId, right, total) {
  const c = cur(), counted = total > 0 && right / total >= PASS;
  let levelUp = false;
  if (counted && !c.done[secId]) {
    c.prog[secId] = Math.min(UNIT_ROUNDS, (c.prog[secId] || 0) + 1);
    levelUp = c.prog[secId] % ROUNDS_PER_LEVEL === 0;
  }
  let completed = false, next = null;
  if (counted && !c.done[secId] && c.prog[secId] >= UNIT_ROUNDS) {
    c.done[secId] = Date.now(); completed = true; c.rounds[secId] = OLD_ROUNDS;
    next = nextSection(secId);
    if (next && c.sec === secId) c.sec = next.id;
    // El premio queda pintado; despierta ahora o más adelante, cuando se domine su palabra (checkPrizes)
    if (sectionById(secId).reward && !c.skipped[secId]) c.got[secId] ??= 'asleep';
  }
  const lr = (c.prog[secId] || 0) % ROUNDS_PER_LEVEL;
  return { counted, level: completed || c.done[secId] ? LEVELS : levelOf(secId) - (levelUp ? 1 : 0), rounds: levelUp || c.done[secId] ? ROUNDS_PER_LEVEL : lr,
    levelUp, completed, next, prizes: checkPrizes() };
}

// ---------- Premio de sección: un kanji que se pinta con tinta (docs/CURRICULO.md §5) ----------
// Cada nivel completo pinta una parte de sus trazos reales (KanjiVG; P-04). Con la sección completa, el kanji
// queda pintado y «dormido» hasta que su palabra llega a la caja WAKE (en la etapa 0, los huevos piden más).
export const WAKE = { e0: 3, other: 2 };
export const PRIZE_INK = 30; // si el jugador ya tenía esa criatura
export const strokesOf = k => STROKES[k]?.length || 5;
// Partes pintadas: los niveles completos, o lo que una partida de antes de P-04 ya tenía pintado (S.cur.rounds)
export const partsOf = secId => isDone(secId) ? LEVELS : Math.max(levelsDone(secId), Math.min(LEVELS, cur().rounds[secId] || 0));
export const paintedOf = (secId, parts = partsOf(secId)) => {
  const s = sectionById(secId); if (!s?.reward) return 0;
  return Math.round(strokesOf(s.reward) * Math.min(parts, LEVELS) / LEVELS);
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

// Kanji pintado: `done` trazos en tinta, los `fresh` siguientes se dibujan ahora, los `next` siguientes en rojo tenue
// (la parte del nivel en curso, en el cuaderno) y el resto como guía tenue
export function inkSVG(k, done, fresh = 0, next = 0) {
  const st = STROKES[k]; if (!st) return `<span class="rd-inkk">${done ? k : '？'}</span>`;
  return `<svg class="rd-ink" viewBox="0 0 109 109" role="img" aria-label="${done >= st.length ? k : '？'}"><g class="g">${st.map(d => `<path d="${d}"/>`).join('')}</g>
    <g class="d">${st.slice(0, done).map(d => `<path d="${d}"/>`).join('')}</g>
    <g class="n">${st.slice(done, done + fresh).map((d, i) => `<path d="${d}" style="animation-delay:${.4 + i * .6}s"/>`).join('')}</g>${next ? `
    <g class="p">${st.slice(done + fresh, done + fresh + next).map(d => `<path d="${d}"/>`).join('')}</g>` : ''}</svg>`;
}

// ---------- Ejercicios propios de la ronda ----------
// Frase: ordenar las fichas. Sirve para PHRASES y para las frases del currículo (EXTRA).
function phraseExercise(ph, body, done) {
  const toks = jaTokens(ph.ja, ph.ids), answer = toks.map(x => x.tok);
  const extra = extraTiles(toks);
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
  // Distractores (P-02): primero kanji ya enseñados o de la unidad actual, que son los que de verdad se confunden
  const c0 = cur(), taught = new Set([...Object.keys(S.srs), ...SECTIONS.filter(x => c0.done[x.id] || x.id === c0.sec).flatMap(x => x.kanji)]), all = Object.keys(KANJI).filter(x => x !== k && !KANJI[x].recipes?.some(r => r.some(p => !KANJI[p])));
  const pool = [...shuffle(all.filter(x => taught.has(x))), ...shuffle(all.filter(x => !taught.has(x)))];
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
// Opciones: sec + level = repasar un nivel ya terminado (desde el cuaderno; no avanza nada) · jump = la prueba
// «Saltar aquí» hacia esa unidad: sin ayudas, sin repetir lo fallado y se corta al pasar JUMP_ERRORS errores.
export function runRound(c, root, { sec, level, jump } = {}) {
  const test = !!jump, review = !!sec && !test;
  const s = review ? sectionById(sec) : curSection(), lv = test ? LEVELS : review ? level : levelOf(s.id);
  const steps = test ? planJump(jump) : planRound(c.k, s.id, Math.random, lv);
  // Ayudas del nivel (furigana y romaji, docs/PROGRESION.md §3); en la etapa 0 el romaji sigue su regla por kana.
  // La prueba para saltar va sin ayudas (§8: «ejercicios de producción»).
  setAid(test ? LEVELS : s.stage === 'e0' ? 1 : lv);
  return new Promise(resolve => {
    const wrap = document.createElement('div');
    wrap.className = 'game round rd-lesson rd-p3'; // rd-p3: marco de la maqueta P-03 (solo en las rondas, no en el salón de IA)
    // Una gota por ejercicio: la apertura y la presentación de los KANJŪ no cuentan
    const exs = steps.filter(x => x.t !== 'intro' && x.t !== 'meet'), n = exs.length;
    let pos = 0; // pasos terminados (acertados, o fallados por segunda vez)
    const label = () => test ? t('jump.sec', { n: Math.min(n, pos + 1), total: n }) : review ? t('round.reviewLv', { l: lv })
      : t('round.lvRound', { l: lv, n: Math.min(ROUNDS_PER_LEVEL, levelRounds(s.id) + 1), total: ROUNDS_PER_LEVEL });
    const marks = e => `<span class="p3-errs" role="img" aria-label="${t('jump.errsAria', { n: Math.min(e, JUMP_ERRORS), total: JUMP_ERRORS })}">${t('jump.errs')} ${Array.from({ length: JUMP_ERRORS }, (_, i) => `<i class="${i < e ? 'on' : ''}">${i < e ? ic('x') : ''}</i>`).join('')}</span>`;
    wrap.innerHTML = `<div class="rd-scene">${roomSVG()}<button class="x rd-x" aria-label="${t('dojo.back')}">${ic('x')}</button>
      <div class="rd-drops">${exs.map(x => `<i class="${x.t === 'kanji' && x.k === c.k ? 'k' : ''}"></i>`).join('')}</div>
      <div class="rd-bub"><span class="who">${c.k}</span><p></p></div><span class="rd-me">${creatureSVG(c.k)}</span><span class="rd-npc"></span></div>
      <div class="rd-sec p3-sec"><span>${label()}</span><em hidden></em>${test ? marks(0) : ''}</div>
      <div class="game-body rd-low"></div>`;
    root.append(wrap);
    const body = wrap.querySelector('.game-body'), drops = [...wrap.querySelectorAll('.rd-drops i')], scene = wrap.querySelector('.rd-scene');
    const say = (txt, who = c.k, html = false) => { if (test && who === c.k) { txt = t('jump.say'); html = false; } const b = wrap.querySelector('.rd-bub p'); b[html ? 'innerHTML' : 'textContent'] = txt; wrap.querySelector('.rd-bub .who').textContent = who; wrap.querySelector('.rd-bub').classList.toggle('npc', who !== c.k); wrap.querySelector('.rd-bub').classList.remove('pop'); void b.offsetWidth; wrap.querySelector('.rd-bub').classList.add('pop'); };
    // Con IA, a veces la criatura festeja con una frase de sabor propia (aigen.js; solo palabras que ya conoces)
    const flavor = S.ai?.flavor?.[c.k] || [];
    const react = ok => {
      const f = ok && flavor.length && Math.random() < .35 ? pick(flavor) : null;
      f ? say(`<span class="jp">${jaHTML(f.ja, f.ids)}</span><small>${f.tr.replace(/</g, '&lt;')}</small>`, c.k, true) : say(pick(t(ok ? 'round.sayOk' : 'round.sayMiss').split('|')));
      wrap.querySelector('.rd-me').classList.toggle('happy', ok);
    };
    // Marco de los ejercicios nuevos (js/exercises.js): etiqueta del tipo, globo, reacción y el KANJŪ que entra a la escena
    const chip = wrap.querySelector('.p3-sec em');
    // En la prueba para saltar, a la derecha van los errores en vez del tipo de ejercicio (maqueta P-03)
    const ctx = { wrap, body, chip: tx => { chip.textContent = tx || ''; chip.hidden = !tx || test; }, say: (tx, who) => say(tx, who), react,
      npc: k => { scene.classList.add('talk'); wrap.querySelector('.rd-npc').innerHTML = creatureSVG(k); } };
    const queue = steps.map((st, i) => ({ ...st, i })), retried = new Set();
    let right = 0, total = 0, kanjiOk = 0, errs = 0; const used = new Set(), use = id => { if (!test) touchWord(id, s.id); used.add(id); }; // pos = pasos terminados (acertados, o fallados por segunda vez)
    // La prueba para saltar no escribe en el guardado (palabras, frases ni cajas): si no se aprueba o se abandona, no cambia nada
    const gw = (id, ok) => { if (!test) gradeWord(id, ok); }, mt = (id, w) => { if (!test) meet(id, w); }, gk = (k, ok) => { if (!test) grade(k, ok); };
    const end = res => { setAid(0); wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); resolve(res); };
    wrap.querySelector('.x').onclick = () => end(null);
    const paint = () => { drops.forEach((d, i) => { d.classList.toggle('on', i < pos); d.classList.toggle('now', i === pos); }); if (test) wrap.querySelector('.p3-sec > span').textContent = label(); };
    const next = () => {
      const st = queue.shift(); paint();
      body.classList.remove('p3-body', 'lock'); wrap.querySelectorAll('.p3-foot, .p3-res').forEach(x => x.remove()); ctx.chip('');
      if (!st) return end({ right, total, kanjiOk, errors: errs, words: [...used] });
      // quick: el ejercicio ya mostró su panel y su reacción; se sigue al tocar «Seguir» o «Entendido»
      const after = (ok, quick = false) => {
        if (!retried.has(st.i)) { total++; if (ok) right++; }
        // Saltar aquí: cada error suma una marca; al pasar el margen, la prueba termina (propuesta P-03)
        if (test && !ok) { errs++; wrap.querySelector('.p3-errs').outerHTML = marks(errs); if (errs > JUMP_ERRORS) return end({ right, total, kanjiOk, errors: errs, words: [...used] }); }
        if (!test && !quick) react(ok);
        scene.classList.remove('power', 'talk'); wrap.querySelector('.rd-npc').innerHTML = '';
        if (!ok && !retried.has(st.i) && !test) { retried.add(st.i); queue.push(st); }
        if (ok || st.again || test) pos++;
        if (!ok && !st.again && !test) st.again = true; // el paso reencolado es el mismo objeto; en la prueba no se reencola (fallar la última rompía la prueba)
        test || quick ? next() : setTimeout(next, 700); // un momento para leer la reacción de la criatura
      };
      if (st.t === 'intro') {
        say(tr(s.intro));
        body.innerHTML = `${s.reward ? `<div class="rd-goal"><span class="rd-ink-box">${inkSVG(s.reward, paintedOf(s.id))}</span><span><b>${tr(s.title)} · ${t('book.level', { l: lv, total: LEVELS })}</b><small>${review ? t('round.reviewSub') : `${t('round.ofLevel', { n: Math.min(ROUNDS_PER_LEVEL, levelRounds(s.id) + 1), total: ROUNDS_PER_LEVEL })}. ${t('round.goal')}`}</small></span></div>` : ''}<button class="btn ok wide">${t('round.start')}</button>
          ${isDone(s.id) || review || !jumpFrom(s.id) ? '' : `<button class="link rd-skip">${t(s.stage === 'e0' ? 'round.skipKana' : 'round.skip')}</button>`}`;
        body.querySelector('.rd-skip') && (body.querySelector('.rd-skip').onclick = () => end({ skipTest: true }));
        return body.querySelector('.btn').onclick = () => { pos = 0; next(); };
      }
      // Presentación de un KANJŪ (nivel 1): no se comprueba ni suma; al terminar queda presentado
      if (st.t === 'meet') return meetExercise(ctx, st.k, c.k, s, () => { cur().met[st.k] = Date.now(); next(); });
      if (st.t === 'word') {
        use(st.id); say(t(st.review ? 'round.sayReview' : 'round.sayWord'));
        return wordExercise(st.id, body, ok => { gw(st.id, ok); after(ok); }, LEVEL_TYPES[st.lv] || {});
      }
      // Frases de los ejercicios nuevos: suman encuentros como las de siempre
      const sawPhrase = (ph, ok) => { if (test) return; (S.phr[ph.id] ??= { n: 0, t: Date.now() }).n++; if (ok) ph.ids.forEach(id => meet(id, 'train')); };
      if (st.t === 'pairs') {
        st.ids.forEach(use);
        return pairsExercise(ctx, st, ok => { if (ok) st.ids.forEach(id => mt(id, 'train')); after(ok, true); });
      }
      // Sin voz japonesa, Escuchar y armar se cambia por Japonés → español (propuesta P-03)
      if (st.t === 'jaes' || (st.t === 'listen' && !canSpeak())) {
        const ph = phraseById(st.id); ph.ids.forEach(use);
        const at = SECTIONS.indexOf(s), others = [...s.phrases, ...SECTIONS.slice(Math.max(0, at - 2), at).flatMap(x => x.phrases)].map(phraseById).filter(Boolean);
        return jaesExercise(ctx, ph, others, ok => { sawPhrase(ph, ok); after(ok, true); });
      }
      if (st.t === 'listen') {
        const ph = phraseById(st.id); ph.ids.forEach(use);
        return listenExercise(ctx, ph, ok => { sawPhrase(ph, ok); after(ok, true); });
      }
      if (st.t === 'gap') {
        const items = st.items.map(x => { const ph = phraseById(x.id); return { ph, gap: gapsOf(ph).find(y => y.i === x.i && y.kind === x.kind) }; }).filter(x => x.gap);
        if (!items.length) { st.t = 'phrase'; st.id = st.items[0].id; queue.unshift(st); return next(); } // sin hueco válido: la frase de siempre
        items.forEach(x => x.ph.ids.forEach(use));
        return gapExercise(ctx, items, (ok, res) => { items.forEach((x, i) => sawPhrase(x.ph, res[i])); after(ok, true); });
      }
      if (st.t === 'type') {
        st.ids.forEach(use);
        return typeExercise(ctx, st.ids, (ok, res) => { st.ids.forEach((id, i) => gw(id, res[i])); after(ok, true); });
      }
      if (st.t === 'similar') {
        return similarExercise(ctx, st.k, ok => { if (S.srs[st.k]) gk(st.k, ok); after(ok, true); });
      }
      if (st.t === 'phrase') {
        const ph = phraseById(st.id); say(t('round.sayPhrase')); ctx.chip(t('ex.esja'));
        ph.ids.forEach(use);
        // La frase suma encuentros a sus palabras; no cambia sus cajas (eso lo hacen los ejercicios de cada palabra)
        return phraseExercise(ph, body, ok => { sawPhrase(ph, ok); after(ok); });
      }
      if (st.t === 'talk') {
        const d = TALKS[s.id];
        d.ids.forEach(use);
        scene.classList.add('talk'); wrap.querySelector('.rd-npc').innerHTML = creatureSVG(d.who);
        say(`<span class="jp">${jaHTML(d.ja, d.ids)}</span><small>${tr(d)}</small>`, d.who, true);
        return talkExercise(d, body, ok => { if (ok) d.ids.forEach(id => mt(id, 'train')); after(ok); });
      }
      const mine = st.k === c.k;
      if (mine) { scene.classList.add('power'); say(t('round.sayPower', { k: c.k })); } else say(t('round.sayReview'));
      return kanjiExercise(st.k, st.ask, body, ok => { gk(st.k, ok); if (ok && st.k === c.k) kanjiOk++; after(ok); });
    };
    next();
  });
}

