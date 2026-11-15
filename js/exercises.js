// KANJŪ · exercises.js — ejercicios nuevos de la ronda (tarea P-05, docs/PROGRESION.md §4).
// Implementa la propuesta aprobada docs/propuestas/P-03-progresion.html: emparejar pares, japonés → español,
// escuchar y armar, completar el hueco, escribir la lectura con teclado kana y kanji parecido.
// Todos usan el marco de la maqueta: botón «Comprobar» abajo (menos emparejar) y un panel de acierto o error
// que sube desde abajo, con «Seguir» o «Entendido». El motor (js/round.js) decide en qué nivel va cada uno.
import { ic } from './icons.js';
import { t } from './i18n.js';
import { KANJI, mainRead } from './data.js';
import { STROKES } from './strokes.js';
import { kanaHTML, helpOn, aidLevel, romaji } from './help.js';
import { speak, canSpeak } from './games.js';
import { extraTiles } from './wordgames.js';
import { WORD, PHRASES, tr, wordHTML, jaTokens, jaHTML, jaPlain, showsKanji, kanjiTaught } from './lex.js';
import { verbKanji, taOf } from './lang.js';
import { EXTRA } from './curriculum.js';
import { tokenDiff, tokenNotes } from './feedback.js';
import { aiOn, explain } from './ai.js';
import { creatureSVG } from './creature.js';

const shuffle = (a, rnd = Math.random) => a.map(v => [rnd(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const HIRA = /^[ぁ-ゖー]+$/;
const PARTS = ['は', 'が', 'を', 'に', 'の', 'も', 'で', 'へ', 'と'];
// Huecos de partícula: los distractores salen solo de を · に · で · へ · の. は, が, も y と nunca se ofrecen como
// distractor, porque casi siempre arman otra frase correcta (窓 は しめて, ともだち と はなして…).
const GAP_FAKE = ['を', 'に', 'で', 'へ', 'の'];
// Pares que en muchas frases podrían ir los dos: nunca se ofrecen juntos en un hueco. El mapa es simétrico.
const CLOSE_PAIRS = [['に', 'へ'], ['に', 'で'], ['で', 'を'], ['が', 'を'], ['に', 'と'], ['の', 'に'], ['の', 'で'], ['へ', 'を']];
const CLOSE = {};
CLOSE_PAIRS.forEach(([a, b]) => { (CLOSE[a] ??= []).push(b); (CLOSE[b] ??= []).push(a); });
// の entre dos sustantivos casi siempre es gramatical (カフェ の コーヒー, ちち の はは): no se ofrece si después del
// hueco viene un sustantivo o una ficha que no es verbo, adjetivo ni cópula
const PRED = new Set(['です', 'でした', 'だ', 'ください', 'います', 'あります', 'いい']);
const predAfter = x => !!x && (x.w ? ['v', 'adj'].includes(x.w.kind) : PRED.has(x.tok));
// で delante de un adjetivo puede ser «en» (にほん で ゆうめい): tampoco se ofrece ahí. Si el hueco es el tema, el sujeto
// o «con» (は · が · も · と), に y で tampoco: podrían marcar el momento o el lugar (あさ に テレビ を みません)
const TOPIC = ['は', 'が', 'も', 'と'];
// Verbos que aceptan «en / a / dentro de» con に junto a su objeto (ノート に かきます, かばん に おとします): con ellos,
// に no es distractor de を
const NI_VERBS = new Set(['おとします', 'おきます', 'かきます', 'おくります', 'あげます', 'かえします', 'つけます', 'のります', 'はいります', 'すわります', 'いいます', 'はなします', 'ききます', 'おしえます', 'かします', 'いれます', 'だします', 'かけます', 'とります', 'うります', 'かいます']);
// は o も delante de un verbo pueden estar en lugar de を (さかな は たべません → さかな を たべません): ahí no va を
export const gapFakes = (right, nextTok) => GAP_FAKE.filter(p => p !== right && !(CLOSE[right] || []).includes(p) && !(p === 'の' && !predAfter(nextTok)) && !(p === 'で' && nextTok?.w?.kind === 'adj') && !(TOPIC.includes(right) && (p === 'に' || p === 'で'))
  && !(p === 'を' && ['は', 'も'].includes(right) && nextTok?.w?.kind === 'v')
  && !(p === 'に' && right === 'を' && NI_VERBS.has(nextTok?.w?.kana)));
// Forma escrita de una palabra sin furigana (lo que se lee en Emparejar y en el teclado kana)
const bare = (w, form = w.kana) => showsKanji(w) ? verbKanji(w, form) : form;
const tokHTML = x => x.w ? wordHTML(x.w, x.tok) : kanaHTML(x.tok, { particle: true });

// ---------- Elegir el material (lo usa planRound) ----------
// Emparejar: 5 kanji con su lectura (palabras de la unidad que ya se escriben con kanji) o, si no alcanzan,
// 5 palabras con su significado. `pool` = palabras de la unidad primero y después las de unidades anteriores.
export function pairsOf(pool, rnd = Math.random) {
  const take = (list, key) => { const seen = new Set(), out = []; for (const w of list) { const k = key(w); if (seen.has(k)) continue; seen.add(k); out.push(w); if (out.length === 5) break; } return out; };
  const ws = pool.map(id => WORD[id]).filter(Boolean);
  const kj = ws.filter(showsKanji), byKana = take(kj, w => w.kana);
  if (byKana.length === 5 && new Set(byKana.map(w => bare(w))).size === 5) return { mode: 'read', ids: shuffle(byKana, rnd).map(w => w.id) };
  // Por significado: sin dos que se pisen («dame, por favor» y «por favor»)
  const STOP = new Set(['las', 'los', 'del', 'una', 'uno', 'por', 'con', 'que', 'para', 'muy', 'más', 'sin']);
  const mw = m => new Set(m.toLowerCase().split(/[^a-záéíóúñü]+/).filter(x => x.length > 2 && !STOP.has(x)));
  const byM = [];
  for (const w of ws.filter(w => tr(w))) {
    const a = mw(tr(w));
    if (byM.some(x => [...mw(tr(x))].some(y => a.has(y)))) continue;
    byM.push(w); if (byM.length === 5) break;
  }
  return byM.length === 5 ? { mode: 'mean', ids: shuffle(byM, rnd).map(w => w.id) } : null;
}
// Japonés → español: fichas en español de la traducción, sin ¿ ? ¡ ! ni comas (los signos de pregunta y
// exclamación quedan fijos en la línea). La primera palabra pasa a minúscula, salvo los nombres propios: los que en
// alguna frase aparecen con mayúscula en medio de la oración (Tanaka, Japón…).
let proper = null;
const properSet = () => proper ??= new Set([...PHRASES, ...EXTRA].flatMap(p => (p.es || '').split(/\s+/).slice(1)).map(clean).filter(w => w && w !== w.toLowerCase()));
const clean = w => w.replace(/[¿?¡!.,;:«»"…()]/g, '');
// Las notas entre paréntesis («(con minutos)», «(al terminar)») no son parte de la traducción: se quitan antes
const noNote = es => es.replace(/\s*\([^)]*\)/g, '').trim();
export function esTokens(es) {
  es = noNote(es);
  // Si la pregunta o la exclamación empieza a mitad de la oración («Disculpa, ¿dónde está…?»), su ¿ o ¡ va pegado a
  // la palabra donde empieza; si la oración empieza con ella, queda fijo al principio de la línea
  const ws = es.split(/\s+/).map((w, i) => (i > 0 && /^[¿¡]/.test(w) ? w[0] : '') + clean(w)).filter(w => clean(w));
  if (ws[0] && !properSet().has(ws[0])) ws[0] = ws[0].toLowerCase();
  const close = /[?!]$/.test(es) ? es.slice(-1) : '';
  const open = /^[¿¡]/.test(es) ? es[0] : close && !/[¿¡]/.test(es) ? { '?': '¿', '!': '¡' }[close] : '';
  return { ws, open, close };
}
// Dos palabras que se parecen tanto que una podría ir por la otra (disculpa / disculpe, está / están)
const prefix = (a, b) => { let i = 0; while (i < a.length && a[i] === b[i]) i++; return i; };
const twin = (a, b) => { a = a.toLowerCase(); b = b.toLowerCase(); return a === b || (prefix(a, b) >= Math.min(5, a.length - 1, b.length - 1) && Math.abs(a.length - b.length) <= 2 && Math.min(a.length, b.length) >= 4); };
export const jaesFits = ph => { const n = esTokens(tr(ph)).ws.length; return n >= 2 && n <= 7; };
export const listenFits = ph => jaTokens(ph.ja, ph.ids).length >= 3;
// Huecos posibles de una frase: una partícula suelta, o un verbo en forma て antes de も · ください · います
export function gapsOf(ph) {
  const toks = jaTokens(ph.ja, ph.ids), out = [];
  if (toks.length < 3) return out;
  toks.forEach((x, i) => {
    if (!x.w && PARTS.includes(x.tok) && i > 0) {
      const fakes = gapFakes(x.tok, toks[i + 1]);
      if (fakes.length >= 2) out.push({ i, kind: 'p', right: x.tok, opts: [x.tok, ...fakes] });
    }
    const w = x.w, nx = toks[i + 1]?.tok;
    if (w?.kind === 'v' && w.te && x.tok === w.te && ['も', 'ください', 'います'].includes(nx)) {
      const stem = w.kana.slice(0, -2), alt = [...new Set([stem + 'ます', w.dict, taOf(w.te), stem + 'ません'].filter(f => f && f !== w.te))];
      if (alt.length >= 3) out.push({ i, kind: 'v', right: w.te, opts: [w.te, ...alt], w });
    }
  });
  return out;
}
// Escribir la lectura: palabras que ya se ven con kanji y se leen solo con hiragana
export const typeFits = id => { const w = WORD[id]; return !!w && showsKanji(w) && HIRA.test(w.kana) && w.kana.length <= 7; };
// Kanji parecido: grupos que se confunden de verdad (solo cuentan los que están en el roster y tienen trazos)
const SIMILAR = ['人入八大', '大犬天夫', '土士工上', '日目白田旦', '木本未休体', '千十午牛', '刀力万', '王玉主生',
  '右左', '子字', '口回品', '見貝目', '白百自', '毎母', '小少', '午年', '四西', '内肉', '門間聞開', '待持時寺',
  '姉妹', '住主', '売読', '話語', '飯飲', '教孝', '東車', '夕名外', '雨電', '早草', '休体'];
export function similarOf(k) {
  const ok = x => x !== k && KANJI[x] && STROKES[x];
  return [...new Set(SIMILAR.filter(g => g.includes(k)).flatMap(g => [...g]).filter(ok))];
}
// Solo se pregunta un kanji enseñado con al menos 2 parecidos también enseñados (los distractores se reconocen)
export const similarFits = k => !!(KANJI[k] && STROKES[k]) && kanjiTaught(k) && similarOf(k).filter(kanjiTaught).length >= 2;

// ---------- Marco común ----------
// ctx (lo arma runRound): { wrap, body, chip(texto), say(texto, quién, html), react(ok), npc(kanji) }
function frame(ctx, type, html, foot = true) {
  const { wrap, body } = ctx;
  // En una serie («2 de 2») el ítem anterior dejó la lección bloqueada y su botón: se limpian
  body.classList.remove('lock'); wrap.querySelectorAll('.p3-foot').forEach(x => x.remove());
  body.classList.add('p3-body'); body.innerHTML = html; body.scrollTop = 0; ctx.chip(type);
  if (!foot) return null;
  const f = document.createElement('div');
  f.className = 'p3-foot'; f.innerHTML = `<button class="btn ok wide" disabled>${t('ex.check')}</button>`;
  wrap.append(f);
  return f.querySelector('.btn');
}
// Panel de acierto o error (como res() de la maqueta). ask = para el botón «¿Por qué?» con IA, si está activa.
function result(ctx, ok, { html = '', title, say, who, ask, onDone }) {
  const { wrap, body } = ctx;
  body.classList.add('lock');
  const f = wrap.querySelector('.p3-foot'); if (f) f.hidden = true;
  say ? ctx.say(say, who) : ctx.react(ok);
  const d = document.createElement('div');
  d.className = `p3-res ${ok ? 'ok' : 'no'}`; d.setAttribute('role', 'status');
  const why = !ok && ask && aiOn();
  d.innerHTML = `<div class="p3-rh"><i>${ic(ok ? 'check' : 'x')}</i><b>${title || t(ok ? 'ex.ok' : 'fx.title')}</b></div>${html}
    <div class="fx-ai" hidden></div>
    <div class="fx-acts">${why ? `<button class="btn ghost fx-why">${ic('sparkles')} ${t('fx.why')}</button>` : ''}<button class="btn ok wide p3-go">${t(ok ? 'round.continue' : 'dojo.gotIt')}</button></div>`;
  wrap.append(d);
  const go = d.querySelector('.p3-go');
  let fired = false;
  go.onclick = () => { if (fired) return; fired = true; d.remove(); onDone(); };
  const w = d.querySelector('.fx-why');
  if (w) w.onclick = async () => {
    w.disabled = true; w.textContent = t('fx.thinking');
    const out = d.querySelector('.fx-ai');
    try { out.innerHTML = `${ic('sparkles')}<span>${esc(await explain(ask.question, ask.given, ask.correct, ''))}</span>`; out.hidden = false; w.remove(); }
    catch (e) { w.textContent = e.message; }
  };
}
// Filas «Tu respuesta / Correcta» con las fichas que no van marcadas (clases fx-* de A-12)
function fxRows(given, need, render, notes = []) {
  const d = tokenDiff(given, need), row = (xs, cls) => `<div class="fx-row ${cls}">${xs.length ? xs.map(x => `<span class="fx-t${x.ok ? '' : ' bad'}">${render(x.tok)}</span>`).join('') : '<span class="fx-t bad">—</span>'}</div>`;
  return `<div class="fx"><p class="fx-h">${t('fx.mine')}</p>${row(d.mine, 'mine')}<p class="fx-h">${t('fx.right')}</p>${row(d.need, 'need')}
    ${notes.filter(Boolean).map(n => `<p class="fx-n">${ic('bulb')}<span>${n}</span></p>`).join('')}</div>`;
}
const ansHTML = ph => `<p class="p3-ans"><span class="jp">${jaHTML(ph.ja, ph.ids)}</span>${esc(tr(ph))}</p>`;
// Pasos de una serie («1 de 2»): un solo ejercicio con dos ítems; cuenta como acertado si salen los dos
const stepHTML = (i, n) => n > 1 ? `<span class="p3-step">${Array.from({ length: n }, (_, j) => `<i class="${j <= i ? 'on' : ''}"></i>`).join('')}${t('ex.step', { n: i + 1, total: n })}</span>` : '';
// done(todos bien, [resultado de cada ítem])
function series(items, run, done) {
  const res = [];
  const go = i => i >= items.length ? done(res.every(Boolean), res) : run(items[i], i, items.length, ok => { res.push(ok); go(i + 1); });
  go(0);
}

// ---------- Fichas (banco) ----------
// items [{ v, html, cls }] · al comprobar, onCheck(lo puesto, acertó)
function bank(ctx, btn, items, answer, onCheck) {
  const line = ctx.body.querySelector('.p3-line'), end = line.querySelector('.p3-close'), bk = ctx.body.querySelector('.asm-bank');
  const picked = [];
  bk.innerHTML = items.map((x, i) => `<button class="asm-t ${x.cls || ''}" data-i="${i}">${x.html}</button>`).join('');
  const render = () => {
    line.querySelectorAll('.asm-t').forEach(b => b.remove());
    picked.forEach((i, j) => {
      const b = document.createElement('button'); b.className = `asm-t ${items[i].cls || ''}`; b.innerHTML = items[i].html;
      b.onclick = () => { picked.splice(j, 1); render(); };
      end ? line.insertBefore(b, end) : line.append(b);
    });
    bk.querySelectorAll('.asm-t').forEach(b => { const u = picked.includes(+b.dataset.i); b.classList.toggle('used', u); b.setAttribute('aria-hidden', u); b.tabIndex = u ? -1 : 0; });
    btn.disabled = !picked.length;
  };
  bk.querySelectorAll('.asm-t').forEach(b => b.onclick = () => { if (!picked.includes(+b.dataset.i)) { picked.push(+b.dataset.i); navigator.vibrate?.(5); render(); } });
  btn.onclick = () => { btn.disabled = true; const g = picked.map(i => items[i].v); onCheck(g, g.join('\u0001') === answer.join('\u0001')); };
  render();
}
const jaItems = toks => shuffle([...toks, ...extraTiles(toks)]).map(x => ({ v: x.tok, html: tokHTML(x), cls: !x.w && [...PARTS, 'か', 'ね', 'よ'].includes(x.tok) ? 'pt' : '' }));

// ======================================================================
// Emparejar pares (nivel 1)
// ======================================================================
const long = s => [...s].length > 5;
export function pairsExercise(ctx, { mode, ids }, done) {
  const ws = ids.map(id => WORD[id]), right = shuffle(ws.map((w, i) => i));
  const R = i => mode === 'read' ? kanaHTML(ws[i].kana) : esc(tr(ws[i]));
  frame(ctx, t('ex.pairs'), `<p class="hint">${t(mode === 'read' ? 'ex.pairsHintR' : 'ex.pairsHintM')}</p>
    <div class="p3-pairs">${ws.map((w, i) => `<button class="p3-pc${long(mode === 'read' ? bare(w) : w.kana) ? ' sm' : ''}" data-l="${i}">${mode === 'read' ? bare(w) : wordHTML(w)}</button><button class="p3-pc r${mode === 'mean' ? ' es' : long(ws[right[i]].kana) ? ' sm' : ''}" data-r="${right[i]}">${R(right[i])}</button>`).join('')}</div>
    <p class="p3-pstat" aria-live="polite">${t('ex.pairsN', { n: 0, total: ws.length })}</p>`, false);
  ctx.say(t(mode === 'read' ? 'ex.sayPairsR' : 'ex.sayPairsM'));
  const B = ctx.body;
  let selL = null, selR = null, got = 0, miss = 0;
  const tryPair = () => {
    if (selL === null || selR === null) return;
    const a = B.querySelector(`[data-l="${selL}"]`), b = B.querySelector(`[data-r="${selR}"]`);
    if (selL === selR) {
      [a, b].forEach(x => { x.classList.remove('p3-on'); x.classList.add('ok'); x.disabled = true; });
      speak(ws[selL].kana); got++;
      B.querySelector('.p3-pstat').textContent = t('ex.pairsN', { n: got, total: ws.length });
      // Con algún par equivocado no cuenta como acierto al primer intento: el panel lo dice y el ejercicio vuelve
      if (got === ws.length) setTimeout(() => result(ctx, !miss, { title: miss ? t('ex.pairsLater') : '',
        html: `<div class="p3-mtab">${ws.map(w => `<b>${bare(w)}</b><span class="jp">${bare(w) === w.kana ? "" : w.kana}</span><span>${esc(tr(w))}</span>`).join('')}</div>${miss ? `<p class="p3-ans p3-miss">${t('ex.pairsMiss', { n: miss })}</p>` : ''}`,
        onDone: () => done(!miss) }), 400);
    } else {
      miss++; ctx.say(t('ex.sayPairMiss'));
      [a, b].forEach(x => { x.classList.remove('p3-on', 'bad'); void x.offsetWidth; x.classList.add('bad'); });
      setTimeout(() => [a, b].forEach(x => x.classList.remove('bad')), 400);
    }
    selL = selR = null;
  };
  B.querySelectorAll('[data-l]').forEach(b => b.onclick = () => { B.querySelectorAll('[data-l]').forEach(x => x.classList.remove('p3-on')); selL = +b.dataset.l; b.classList.add('p3-on'); tryPair(); });
  B.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { B.querySelectorAll('[data-r]').forEach(x => x.classList.remove('p3-on')); selR = +b.dataset.r; b.classList.add('p3-on'); tryPair(); });
}

// ======================================================================
// Japonés → español (nivel 2): la frase en japonés y la traducción con fichas en español
// ======================================================================
export function jaesExercise(ctx, ph, others, done) {
  const { ws, open, close } = esTokens(tr(ph)), have = new Set(ws.map(w => clean(w).toLowerCase()));
  // Fichas de más: palabras de otras frases de la unidad y de las anteriores (others), que no estén en la respuesta
  // (sin el ¿ o ¡ pegado y sin palabras gemelas de la respuesta, que darían otra traducción correcta)
  const pool = [...new Set(others.filter(p => p.id !== ph.id).flatMap(p => esTokens(tr(p)).ws.map(clean)))].filter(w => !have.has(w.toLowerCase()) && !ws.some(a => twin(clean(a), w)));
  const extra = shuffle(pool).slice(0, Math.min(4, Math.max(3, 9 - ws.length)));
  const items = shuffle([...ws, ...extra]).map(w => ({ v: w, html: esc(w), cls: 'es' }));
  const voice = canSpeak();
  const btn = frame(ctx, t('ex.jaes'), `<p class="hint">${t('dojo.meaning')}</p>
    <div class="p3-src">${voice ? `<button class="p3-spk-s" data-say aria-label="${t('dojo.listen')}">${ic('sound')}</button>` : ''}<p class="jp">${jaHTML(ph.ja, ph.ids)}</p></div>
    <div class="p3-line">${open ? `<span class="p3-pun">${open}</span>` : ''}${close ? `<span class="p3-pun p3-close">${close}</span>` : ''}</div><div class="asm-bank"></div>`);
  ctx.say(t('ex.sayJaes'));
  ctx.body.querySelector('[data-say]')?.addEventListener('click', () => speak(jaPlain(ph.ja)));
  bank(ctx, btn, items, ws, (g, ok) => {
    speak(jaPlain(ph.ja));
    result(ctx, ok, { html: ok ? ansHTML(ph) : fxRows(g, ws, esc) + ansHTML(ph),
      ask: { question: `${t('dojo.meaning')} ${jaPlain(ph.ja)}`, given: g.join(' '), correct: tr(ph) }, onDone: () => done(ok) });
  });
}

// ======================================================================
// Escuchar y armar (nivel 4): la frase no se ve; se oye (normal o lento) y se arma con fichas japonesas
// ======================================================================
export function listenExercise(ctx, ph, done) {
  const toks = jaTokens(ph.ja, ph.ids), answer = toks.map(x => x.tok), items = jaItems(toks), say = jaPlain(ph.ja);
  const btn = frame(ctx, t('ex.listen'), `<p class="hint">${t('ex.listenHint')}</p>
    <div class="p3-say"><button class="p3-spk" data-rate=".85" aria-label="${t('dojo.listen')}">${ic('sound')}<span>${t('dojo.listen')}</span></button>
      <button class="p3-spk slow" data-rate=".55" aria-label="${t('ex.slow')}">${ic('slow')}<span>${t('ex.slow')}</span></button></div>
    <div class="p3-line"></div><div class="asm-bank"></div>`);
  ctx.say(t('ex.sayListen'));
  ctx.body.querySelectorAll('.p3-spk').forEach(b => b.onclick = () => speak(say, +b.dataset.rate));
  setTimeout(() => speak(say), 300);
  const html = tok => { const x = toks.find(y => y.tok === tok); return x ? tokHTML(x) : kanaHTML(tok, { particle: true }); };
  bank(ctx, btn, items, answer, (g, ok) => {
    speak(say);
    const notes = ok ? [] : tokenNotes(g, answer).notes;
    result(ctx, ok, { html: ok ? ansHTML(ph) : fxRows(g, answer, html, notes) + ansHTML(ph),
      ask: { question: `${t('ex.listenHint')}: ${say}`, given: g.join(' '), correct: ph.ja }, onDone: () => done(ok) });
  });
}

// ======================================================================
// Completar el hueco (nivel 4): una partícula o la forma del verbo; 4 opciones del mismo tipo
// ======================================================================
export function gapExercise(ctx, items, done) {
  series(items, ({ ph, gap }, i, n, next) => {
    const toks = jaTokens(ph.ja, ph.ids), part = gap.kind === 'p';
    const opts = shuffle([gap.right, ...shuffle(gap.opts.slice(1)).slice(0, 3)]); // 3 o 4 opciones
    const side = a => a.length ? jaHTML(a.map(x => x.tok).join(' '), ph.ids) : '';
    const btn = frame(ctx, t('ex.gap'), `${stepHTML(i, n)}<p class="hint">${t(part ? 'ex.gapHintP' : 'ex.gapHintV')}</p>
      <p class="p3-gapq jp">${side(toks.slice(0, gap.i))}<span class="p3-gap" aria-label="${t('ex.gapAria')}">＿</span>${side(toks.slice(gap.i + 1))}</p>
      <div class="p3-opts4${part ? '' : ' v'}${opts.length === 3 ? ' n3' : ''}">${opts.map(o => `<button class="asm-t${part ? ' pt' : ''}" data-v="${o}">${part ? kanaHTML(o, { particle: true }) : gap.w ? wordHTML(gap.w, o) : o}</button>`).join('')}</div>`);
    ctx.say(t(part ? 'ex.sayGapP' : 'ex.sayGapV'));
    const g = ctx.body.querySelector('.p3-gap');
    let sel = null;
    ctx.body.querySelectorAll('.p3-opts4 .asm-t').forEach(b => b.onclick = () => {
      ctx.body.querySelectorAll('.p3-opts4 .asm-t').forEach(x => x.classList.remove('p3-on')); b.classList.add('p3-on');
      sel = b.dataset.v; g.innerHTML = b.innerHTML; g.classList.add('fill'); btn.disabled = false;
    });
    btn.onclick = () => {
      btn.disabled = true;
      const ok = sel === gap.right; speak(jaPlain(ph.ja));
      result(ctx, ok, { html: ok ? ansHTML(ph) : fxRows([sel], [gap.right], x => part ? kanaHTML(x, { particle: true }) : gap.w ? wordHTML(gap.w, x) : x, tokenNotes([sel], [gap.right]).notes) + ansHTML(ph),
        ask: { question: `${t(part ? 'ex.gapHintP' : 'ex.gapHintV')}: ${toks.map((x, j) => j === gap.i ? '＿' : x.tok).join('')}`, given: sel, correct: gap.right }, onDone: () => next(ok) });
    };
  }, done);
}

// ======================================================================
// Escribir la lectura con un teclado propio de fichas kana (nivel 3), sin depender del teclado del teléfono
// ======================================================================
const KR = { あ: 'あいうえお', か: 'かきくけこ', さ: 'さしすせそ', た: 'たちつてと', な: 'なにぬねの', は: 'はひふへほ', ま: 'まみむめも', や: 'やゆよ', ら: 'らりるれろ', わ: 'わをー' };
const DAK = Object.fromEntries([...'かきくけこさしすせそたちつてとはひふへほ'].map((c, i) => [c, 'がぎぐげござじずぜぞだぢづでどばびぶべぼ'[i]]));
const HAN = Object.fromEntries([...'はひふへほ'].map((c, i) => [c, 'ぱぴぷぺぽ'[i]]));
const SMALL = Object.fromEntries([...'あいうえおつやゆよ'].map((c, i) => [c, 'ぁぃぅぇぉっゃゅょ'[i]]));
// ゛ ゜ y 小 cambian el último kana (y lo devuelven si se tocan otra vez)
const flip = (m, c) => m[c] || Object.keys(m).find(k => m[k] === c) || c;
export function typeExercise(ctx, ids, done) {
  series(ids, (id, i, n, next) => {
    const w = WORD[id], kj = bare(w);
    // Romaji debajo de cada kana solo cuando el nivel lo da (como el resto de la ronda)
    const rom = c => helpOn() && aidLevel() < 2 ? `<small>${c === 'ー' ? '—' : c === 'を' ? 'o' : romaji(c)}</small>` : '';
    let row = 'あ', typed = '';
    const btn = frame(ctx, t('ex.kana'), `${stepHTML(i, n)}<p class="hint">${t('ex.kanaHint')}</p>
      <div class="p3-kw"><b class="jp">${kj}</b><small>${esc(tr(w))}</small></div>
      <div class="p3-type" aria-live="polite"></div><div class="p3-kb"></div>`);
    ctx.say(t('ex.sayKana'));
    const typedEl = ctx.body.querySelector('.p3-type'), kb = ctx.body.querySelector('.p3-kb');
    const rowBtn = r => `<button class="p3-k ${r === row ? 'on' : ''}" data-row="${r}" aria-label="${t('ex.kRow', { r })}">${r}</button>`;
    const draw = () => {
      typedEl.innerHTML = typed ? `<span>${typed}</span><i class="p3-caret"></i>` : `<span class="ph">${t('ex.kanaPh')}</span>`;
      btn.disabled = !typed;
      kb.innerHTML = `<div class="p3-krow p3-kstrip">${[...KR[row]].map(c => `<button class="p3-k" data-c="${c}">${c}${rom(c)}</button>`).join('')}</div>
        <div class="p3-krow">${[...'あかさたな'].map(rowBtn).join('')}</div><div class="p3-krow">${[...'はまやらわ'].map(rowBtn).join('')}</div>
        <div class="p3-krow"><button class="p3-k fn" data-fn="dak" aria-label="${t('ex.kDak')}"><span class="mk">゛</span></button><button class="p3-k fn" data-fn="han" aria-label="${t('ex.kHan')}"><span class="mk">゜</span></button><button class="p3-k fn" data-fn="small" aria-label="${t('ex.kSmall')}">小</button><button class="p3-k" data-c="ん">ん${rom('ん')}</button><button class="p3-k fn" data-fn="del" aria-label="${t('ex.kDel')}">${ic('back')}</button></div>`;
    };
    // Un solo manejador para todo el teclado (se redibuja al cambiar de fila)
    kb.onclick = e => {
      const b = e.target.closest('button'); if (!b || ctx.body.classList.contains('lock')) return;
      if (b.dataset.row) row = b.dataset.row;
      else if (b.dataset.c) { if (typed.length < 12) typed += b.dataset.c; navigator.vibrate?.(5); }
      else {
        const f = b.dataset.fn, last = typed.slice(-1);
        if (f === 'del') typed = typed.slice(0, -1);
        else if (last) typed = typed.slice(0, -1) + flip(f === 'dak' ? DAK : f === 'han' ? HAN : SMALL, last);
      }
      draw();
    };
    draw();
    btn.onclick = () => {
      btn.disabled = true;
      const ok = typed === w.kana; speak(w.kana);
      result(ctx, ok, { html: ok ? `<p class="p3-ans"><span class="jp">${wordHTML(w)}</span>${w.kana} · ${esc(tr(w))}</p>`
        : fxRows([...typed], [...w.kana], x => x, [t('ex.kanaNote', { w: kj, r: w.kana })]),
        ask: { question: `${t('ex.kanaHint')}: ${kj}`, given: typed, correct: w.kana }, onDone: () => next(ok) });
    };
  }, done);
}

// ======================================================================
// Kanji parecido (nivel 2): elegir el kanji entre otros que se le parecen. Si fallas, el KANJŪ aparece
// en la escena y en el panel, con su pista y la comparación de trazos reales (docs/PROGRESION.md §2b.4)
// ======================================================================
const inkFull = k => { const st = STROKES[k]; return `<svg class="rd-ink" viewBox="0 0 109 109" role="img" aria-label="${k}"><g class="d">${st.map(d => `<path d="${d}"/>`).join('')}</g></svg>`; };
export function similarExercise(ctx, k, done) {
  const others = shuffle(similarOf(k).filter(kanjiTaught)).slice(0, 3);
  const opts = shuffle([k, ...others]), m = KANJI[k].m;
  const btn = frame(ctx, t('ex.similar'), `<p class="hint">${t('ex.simHint', { m: esc(m) })}</p><div class="qm sm"><span class="jp">${mainRead(k) || ''}</span></div>
    <div class="opts">${opts.map(x => `<button class="opt" data-k="${x}">${x}</button>`).join('')}</div>`);
  ctx.say(t('ex.saySim', { m }));
  let sel = null;
  ctx.body.querySelectorAll('.opt').forEach(b => b.onclick = () => { ctx.body.querySelectorAll('.opt').forEach(x => x.classList.remove('p3-on')); b.classList.add('p3-on'); sel = b.dataset.k; btn.disabled = false; });
  btn.onclick = () => {
    btn.disabled = true;
    const ok = sel === k; speak(mainRead(k));
    ctx.body.querySelectorAll('.opt').forEach(x => { x.classList.remove('p3-on'); x.classList.toggle('right', x.dataset.k === k); });
    if (ok) return result(ctx, true, { html: `<p class="p3-ans"><span class="jp">${k} · ${mainRead(k)}</span>${esc(m)}</p>`, onDone: () => done(true) });
    ctx.body.querySelector(`.opt[data-k="${sel}"]`)?.classList.add('wrong');
    ctx.npc(k);
    result(ctx, false, { title: t('ex.simNo', { k }), say: t('ex.saySimMiss'), who: k,
      html: `<div class="p3-help"><span class="art">${creatureSVG(k)}</span><div><b>${k} · ${esc(m)}</b><small>${esc(KANJI[k].mn || '')}</small></div></div>
        <div class="p3-cmp"><figure><span class="rd-ink-box">${inkFull(sel)}</span><figcaption>${sel} · ${esc(KANJI[sel].m)}</figcaption></figure>
          <figure class="me"><span class="rd-ink-box">${inkFull(k)}</span><figcaption>${k} · ${esc(m)}</figcaption></figure></div>
        <p class="fx-n">${ic('bulb')}<span>${t('ex.simNote', { a: sel, ma: esc(KANJI[sel].m), b: k, mb: esc(m) })}</span></p>`,
      ask: { question: t('ex.saySim', { m }), given: sel, correct: k }, onDone: () => done(false) });
  };
}
