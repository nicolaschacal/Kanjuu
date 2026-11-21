// KANJŪ · unitread.js — «Lectura de la unidad» (tarea P-12; maqueta aprobada docs/propuestas/P-11-lectura.html,
// docs/PROGRESION.md §12). Se abre desde el cuaderno (js/book.js) y vive dentro de su misma hoja: leer, tocar palabras,
// escuchar, responder y el final. Los datos y su formato están en js/readings.js.
import { t } from './i18n.js';
import { ic } from './icons.js';
import { UNIT_READINGS, segs, plainOf, readOf, analyze, kanjiOf, newWordsOf, isKanji } from './readings.js';
import { SECTIONS } from './curriculum.js';
import { KANJI } from './data.js';
import { creatureSVG } from './creature.js';
import { S, save } from './state.js';
import { tr, finishUnitReading, FURI_OFF, READ_INK } from './lex.js';
import { helpOn } from './help.js';
import { canSpeak, speak, speakSeq } from './games.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const KIND = { name: 'uread.kind.name', particle: 'uread.kind.particle', noun: 'uread.kind.noun', time: 'uread.kind.time', expr: 'uread.kind.expr', verb: 'uread.kind.verb',
  number: 'uread.kind.number', adji: 'uread.kind.adji', form: 'uread.kind.form', gram: 'uread.kind.gram' };

export const readingOf = id => UNIT_READINGS[id] || null;
export const readingDone = id => S.uread?.[id] || null;
// Se abre al terminar el nivel 3 (§12): con la unidad cursando el nivel 4 o 5, o ya terminada o salteada
export const readingOpen = (s, state, level) => state === 'done' || (state === 'cur' && level >= 4);

// ---------- Datos del jugador ----------
// Unidad donde se enseña cada kanji (su primera aparición en SECTIONS)
let UNIT = null;
const unitOf = k => { if (!UNIT) { UNIT = {}; for (const s of SECTIONS) for (const c of s.kanji || []) UNIT[c] ??= s.id; } return UNIT[k]; };
// Kanji dominado: caja FURI_OFF o más del repaso (S.srs), el mismo criterio de la furigana de las rondas
const mastered = k => (S.srs[k]?.box || 0) >= FURI_OFF;
// Familia del KANJŪ: él mismo y los kanji cuya receta lo contiene (recipes de js/data.js)
const familyOf = k => new Set([k, ...Object.entries(KANJI).filter(([, v]) => (v.recipes || []).some(r => r.includes(k))).map(([c]) => c)]);
const kMean = (R, k) => tr(R.km?.[k]) || (KANJI[k]?.m || '').split(' · ')[0];
const fgCount = R => kanjiOf(R).filter(k => !mastered(k)).length;
const unitsOfR = R => new Set(kanjiOf(R).map(unitOf).filter(Boolean)).size;

// ---------- Fichas ----------
const famWrap = (txt, fam) => fam ? [...txt].map(c => fam.has(c) ? `<span class="p11-fam">${c}</span>` : c).join('') : txt;
// furigana: 'auto' (solo kanji no dominados) · 'all' (siempre, para la hoja de la palabra) · 'none'
function tokHTML(raw, mode = 'auto', fam = null) {
  return segs(raw.replace(/#\w+$/, '')).map(x => {
    if (x.t) return famWrap(x.t, fam);
    const need = mode === 'all' || (mode === 'auto' && [...x.k].some(c => !mastered(c)));
    return need ? `<ruby>${famWrap(x.k, fam)}<rt>${x.r}</rt></ruby>` : famWrap(x.k, fam);
  }).join('');
}
// La lectura → HTML. Cada ficha es un <span class="p11-w"> tocable (tap) y lleva su frase (data-s) para el audio.
function readingHTML(R, { tap = true, on = null, fam = null, sign = true } = {}) {
  const { lines } = analyze(R);
  return lines.map((toks, li) => `<p class="p11-l${sign && R.kind === 'mail' && li === lines.length - 1 && lines.length > 1 ? ' sign' : ''}">${toks.map(k => {
    if (k.pu) return `<span class="p11-pu">${k.p}</span>`;
    const inner = tokHTML(k.raw, 'auto', fam);
    return tap ? `<span class="p11-w${on === k.i ? ' on' : ''}" data-w="${k.i}" data-s="${k.s}" data-t="${esc(k.raw)}" data-k="${esc(k.key)}" role="button" tabindex="0">${inner}</span>` : inner;
  }).join('')}</p>`).join('');
}

// ---------- Estado de la lectura abierta ----------
// El cuaderno llama a openUnitReading(sheet, ctx) con ctx = { sec, mon, back(), hud(), fg? }; todo queda en sheet._ur
export function openUnitReading(sheet, ctx) {
  const R = UNIT_READINGS[ctx.sec.id];
  const trainer = ctx.mon?.k || ctx.sec.kanji.find(k => KANJI[k]) || '日';
  const st = sheet._ur ??= {};
  stopUnitAudio(sheet);
  Object.assign(st, { ctx, R, id: ctx.sec.id, trainer, fam: familyOf(trainer), fg: ctx.fg ?? helpOn(), qAns: [], stop: null, done: false, q: null });
  if (!st.bound) { st.bound = true; bind(sheet); }
  sheet.classList.add('p11-on');
  reading(sheet);
}
// Apaga el audio y limpia la hoja (el cuaderno lo llama al volver al mapa o al cerrarse)
export function stopUnitAudio(sheet) {
  const st = sheet?._ur; if (!st?.stop) return;
  st.stop(); st.stop = null;
}
export function leaveUnitReading(sheet) {
  stopUnitAudio(sheet);
  sheet.classList.remove('p11-on', 'p11-nofg');
}

const host = (st, txt) => `<div class="p11-host"><span class="art">${creatureSVG(st.trainer)}</span><div class="p11-bub" id="bub"><span class="who">${t('uread.who', { k: st.trainer })}</span><p>${txt}</p></div></div>`;
function bub(sheet, txt) {
  const b = sheet.querySelector('#bub'); if (!b) return;
  b.querySelector('p').innerHTML = txt; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
}
const kindIcon = R => ic(R.kind === 'mail' ? 'mail' : 'note');
const chipsHTML = (st, R) => `<span class="p11-chip">${kindIcon(R)}${t(R.kind === 'mail' ? 'uread.chipMail' : 'uread.chipNote', { n: R.lines.length })}</span>
  <span class="p11-chip">${ic('kana')}${t('uread.chipKanji', { k: kanjiOf(R).length, n: unitsOfR(R) })}</span>
  ${st.fg ? `<span class="p11-chip fgc">${ic('eye')}${fgCount(R) ? t('uread.chipFg', { n: fgCount(R) }) : t('uread.chipFgNone')}</span>` : ''}`;

// ---------- 1 · Leer ----------
function reading(sheet) {
  const { R, id, fam } = sheet._ur, st = sheet._ur;
  const famIn = kanjiOf(R).filter(k => fam.has(k)), voice = canSpeak();
  sheet.classList.toggle('p11-nofg', !st.fg);
  sheet.innerHTML = `<div class="pn-head"><span class="p3-hic">${kindIcon(R)}</span>
      <span class="p11-ht"><small>${t('uread.head', { id })}</small><b>${esc(tr(R.title))}</b></span>
      <button class="p11-hb fg" data-u="fg" aria-pressed="${st.fg}" aria-label="${t('uread.fg')}">あ</button>
      <button class="p11-hb" data-u="back" aria-label="${t('sheet.close')}">${ic('x')}</button></div>
    <div class="p11-body" id="rb">
      ${host(st, esc(tr(R.say)))}
      <div class="p11-chips" id="chips">${chipsHTML(st, R)}</div>
      <div class="p11-paper ${R.kind}">
        ${R.kind === 'mail' ? `<div class="p11-mail"><i>${esc(R.from[0])}</i><span><b>${esc(R.from)}</b><small>${esc(tr(R.to))}</small></span></div>` : ''}
        <div class="p11-txt" id="txt">${readingHTML(R, { fam })}</div>
      </div>
      <div class="p11-legend">${famIn.length ? `<span><i class="lf"></i>${t('uread.legFam', { k: st.trainer, f: famIn.join(' ') })}</span>` : ''}<span><i class="lt"></i>${t('uread.legTap')}</span></div>
      <p class="p11-hint">${ic('bulb')}<span>${t('uread.hint')}</span></p>
    </div>
    <div class="p11-foot">${voice ? `<div class="p11-row"><button class="btn ghost" data-u="play" id="play">${ic('play')}${t('uread.listen')}</button><button class="btn ghost" data-u="slow" id="slow">${ic('slow')}${t('uread.slow')}</button></div>` : ''}
      <button class="btn ok wide" data-u="ask">${t('uread.done')}</button></div>`;
}

// Escuchar: la lectura entera, frase por frase, con la frase que suena resaltada
function playAll(sheet, rate, btn) {
  const st = sheet._ur, txt = sheet.querySelector('#txt'), play = sheet.querySelector('#play'), slow = sheet.querySelector('#slow');
  const idle = () => { if (!play) return; play.innerHTML = ic('play') + t('uread.listen'); play.classList.remove('on'); slow.classList.remove('on'); };
  const mark = i => txt?.querySelectorAll('.p11-w').forEach(x => x.classList.toggle('p11-say', +x.dataset.s === i));
  if (st.stop) { stopUnitAudio(sheet); mark(-1); idle(); return; }
  btn.classList.add('on'); if (btn === play) play.innerHTML = ic('pause') + t('uread.pause');
  bub(sheet, t('uread.listening'));
  st.stop = speakSeq(analyze(st.R).sents, rate, { onStart: mark, onEnd: () => { mark(-1); st.stop = null; idle(); } });
}

// ---------- 2 · La hoja de la palabra tocada ----------
function wordSheet(sheet, i) {
  const st = sheet._ur, R = st.R, txt = sheet.querySelector('#txt'); if (!txt) return;
  sheet.querySelector('.p11-sheet')?.remove();
  const words = [...txt.querySelectorAll('.p11-w')];
  words.forEach(w => w.classList.remove('on'));
  const el = words[i]; if (!el) return;
  el.classList.add('on');
  const raw = el.dataset.t, plain = plainOf(raw), d = R.words[el.dataset.k] || { m: { es: '' }, kind: 'noun' };
  const ks = [...plain].filter(isKanji);
  const tile = k => {
    const m = mastered(k), f = st.fam.has(k);
    return `<span class="p11-k${f ? ' kf' : ''}">${KANJI[k] ? `<span class="art">${creatureSVG(k)}</span>` : `<span class="p11-tile">${k}</span>`}
      <b>${k}</b><small>${esc(kMean(R, k))}${unitOf(k) ? ` · ${unitOf(k)}` : ''}</small><em class="${m ? 'ok' : 'fg'}">${t(m ? 'uread.mastered' : 'uread.withFg')}</em></span>`;
  };
  const nw = d.nw ? `<div class="p11-new"><i>${ic('sparkle')}</i><span><b>${t('uread.newWord')}</b><small>${t('uread.newWordS', { parts: d.nw.map(k => `${k} (${esc(kMean(R, k))})`).join(' + '), w: plain })}</small></span></div>` : '';
  const s = document.createElement('div');
  s.className = 'p11-sheet'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-label', t('uread.wordAria', { w: plain }));
  s.innerHTML = `<div class="p11-wh"><div><div class="p11-wk">${tokHTML(raw, ks.length ? 'all' : 'none')}</div></div>
      <button class="p11-hb" aria-label="${t('sheet.close')}" data-u="wx">${ic('x')}</button></div>
    <p class="p11-wm">${esc(tr(d.m))}</p><p class="p11-wg"><span class="p11-chip">${t(KIND[d.kind] || KIND.noun)}</span>${d.g ? ` ${esc(tr(d.g))}` : ''}</p>
    ${nw}
    ${ks.length ? `<div class="p11-ks">${ks.map(tile).join('')}</div>` : ''}
    <div class="p11-wnav"><button class="btn ghost" data-u="wp" aria-label="${t('uread.prev')}" ${i === 0 ? 'disabled' : ''}>${ic('left')}</button>
      ${canSpeak() ? `<button class="btn ghost p11-ws" data-u="ws" data-word="${esc(d.say || readOf(raw))}">${ic('sound')}${t('uread.listen')}</button>` : '<span></span>'}
      <button class="btn ghost" data-u="wn" aria-label="${t('uread.next')}" ${i === words.length - 1 ? 'disabled' : ''}>${ic('right')}</button></div>`;
  s.dataset.i = i;
  sheet.append(s);
  // La palabra tocada queda a la vista, arriba de la hoja
  const body = sheet.querySelector('#rb');
  if (body) {
    body.style.paddingBottom = `${s.offsetHeight + 16}px`;
    const top = el.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop;
    const free = body.clientHeight - s.offsetHeight + (sheet.querySelector('.p11-foot')?.offsetHeight || 0);
    body.scrollTo({ top: Math.max(0, top - Math.max(48, free / 2 - 24)), behavior: calm() ? 'auto' : 'smooth' });
  }
  // Tu KANJŪ comenta cuando la palabra lleva su familia o es nueva
  const fk = ks.filter(k => st.fam.has(k) && k !== st.trainer);
  if (ks.includes(st.trainer) && !fk.length) bub(sheet, t('uread.meIn', { w: plain }));
  else if (fk.length) { const r = KANJI[fk[0]]?.recipes?.find(x => x.includes(st.trainer)); bub(sheet, t('uread.family', { k: fk[0], me: st.trainer, r: r ? ` (${r.join(' + ')})` : '' })); }
  else if (d.nw) bub(sheet, t('uread.newBub', { w: plain }));
}
function closeWord(sheet) {
  sheet.querySelector('.p11-sheet')?.remove();
  sheet.querySelectorAll('.p11-w.on').forEach(w => w.classList.remove('on'));
  const body = sheet.querySelector('#rb'); if (body) body.style.paddingBottom = '';
}

// ---------- 3 · Preguntas de comprensión ----------
function questions(sheet, n = 0) {
  const st = sheet._ur;
  if (n === 0) st.qAns = [];
  st.q = { n, sel: null, peek: false };
  drawQ(sheet);
}
function drawQ(sheet, keepScroll = false) {
  const st = sheet._ur, R = st.R, { n, sel, peek } = st.q, Q = R.Q[n], sc = keepScroll ? sheet.querySelector('.p11-body')?.scrollTop || 0 : 0;
  sheet.classList.toggle('p11-nofg', !st.fg);
  sheet.innerHTML = `<div class="pn-head"><span class="p3-hic">${ic('question')}</span><span class="p11-ht"><small>${t('uread.head', { id: st.id })}</small><b>${t('uread.qN', { n: n + 1, total: R.Q.length })}</b></span>
      <button class="p11-hb" data-u="back" aria-label="${t('sheet.close')}">${ic('x')}</button></div>
    <div class="p11-body">
      <div class="p11-qbar">${R.Q.map((_, i) => `<i class="${i < n ? (st.qAns[i] ? 'ok' : 'no') : i === n ? 'on' : ''}"></i>`).join('')}</div>
      ${host(st, t(n === 0 ? 'uread.qHost0' : 'uread.qHost1'))}
      <p class="p11-q">${esc(tr(Q.q))}</p>
      <div class="p11-opts">${Q.o.map((o, i) => `<button class="p11-opt${sel === i ? ' on' : ''}" data-u="opt" data-o="${i}"><i>${'ABC'[i]}</i><span>${esc(tr(o))}</span></button>`).join('')}</div>
      <button class="p11-peek" data-u="peek" aria-expanded="${peek}">${ic('eye')}${t(peek ? 'uread.hideText' : 'uread.showText')}${ic(peek ? 'minus' : 'plus')}</button>
      ${peek ? `<div class="p11-peekbox"><div class="p11-txt">${readingHTML(R, { tap: false, fam: st.fam })}</div></div>` : ''}
    </div>
    <div class="p11-foot"><button class="btn ok wide" data-u="check" ${sel === null ? 'disabled' : ''}>${t('uread.check')}</button></div>`;
  const b = sheet.querySelector('.p11-body'); if (b) b.scrollTop = sc;
}
function checkQ(sheet) {
  const st = sheet._ur, R = st.R, { n, sel } = st.q, Q = R.Q[n];
  if (sel === null || st.qAns[n] !== undefined) return;
  const ok = sel === Q.a; st.qAns[n] = ok;
  sheet.querySelectorAll('[data-o]').forEach(b => { b.disabled = true; b.classList.toggle('right', +b.dataset.o === Q.a); });
  if (!ok) sheet.querySelector(`[data-o="${sel}"]`)?.classList.add('wrong');
  sheet.querySelector('.p11-foot').hidden = true;
  bub(sheet, t(ok ? 'uread.qOk' : 'uread.qNo'));
  const line = { kind: R.kind, words: R.words, lines: [R.lines[Q.line]] };
  const d = document.createElement('div');
  d.className = `p11-res ${ok ? 'ok' : 'no'}`; d.setAttribute('role', 'status');
  d.innerHTML = `<div class="p11-rh"><i>${ic(ok ? 'check' : 'x')}</i><b>${ok ? t('uread.good') : t('uread.was', { a: esc(tr(Q.o[Q.a])) })}</b></div>
    <div class="p11-quote"><small>${t('uread.inText', { n: Q.line + 1 })}</small><div class="p11-txt">${readingHTML(line, { tap: false, fam: st.fam, sign: false })}</div><p class="es">«${esc(R.es[Q.line])}»</p></div>
    <p class="p11-tip">${ic('bulb')}<span>${esc(tr(ok ? Q.ok : Q.tip[sel]))}</span></p>
    <button class="btn ok wide" data-u="next">${t(n + 1 < R.Q.length ? 'uread.nextQ' : 'uread.results')}</button>`;
  sheet.append(d);
}

// ---------- 4 · Final ----------
function end(sheet) {
  const st = sheet._ur, R = st.R, got = st.qAns.filter(Boolean).length;
  // La tinta se cobra una sola vez: la primera que se llega al final de esta lectura
  if (!st.done) { st.first = finishUnitReading(st.id, got, R.Q.length); st.done = true; save(); st.ctx.hud?.(); }
  const nw = newWordsOf(R), all = kanjiOf(R).length, fg = fgCount(R);
  sheet.classList.toggle('p11-nofg', !st.fg);
  sheet.innerHTML = `<div class="p11-end">
    <p class="eyebrow" style="color:var(--gold)">${t('uread.head', { id: st.id })}</p>
    <span class="p11-endart art">${creatureSVG(st.trainer)}</span>
    <h2>${t('uread.endT')}</h2>
    <p>${t(R.kind === 'mail' ? 'uread.endMail' : 'uread.endNote', { k: all, n: unitsOfR(R) })}</p>
    <div class="p11-endc">
      <div class="p11-er"><i>${ic('question')}</i><span><b>${t('uread.rUnder')}</b><small>${t('uread.rUnderS')}</small></span><em>${t('uread.rOf', { a: got, b: R.Q.length })}</em></div>
      ${nw.length ? `<div class="p11-er"><i>${ic('sparkle')}</i><span><b>${t('uread.rNew')}</b><small>${t('uread.rNewS')}</small></span><em class="jp">${nw.join(' · ')}</em></div>` : ''}
      <div class="p11-er"><i>${ic('kana')}</i><span><b>${t('uread.rKanji')}</b><small>${t('uread.rKanjiS', { a: all - fg, b: fg })}</small></span><em>${all}</em></div>
      <div class="p11-er"><i>${ic('ink')}</i><span><b>${t('uread.rInk')}</b><small>${t('uread.rInkS')}</small></span><em>${st.first ? `+${READ_INK}` : '—'}</em></div>
    </div>
    <details class="p11-tr-d" style="margin-top:12px;text-align:left"><summary class="btn ghost wide" style="display:flex;align-items:center;justify-content:center;list-style:none;margin:0">${ic('eye')}${t('uread.trans')}</summary>
      <div class="p11-tr">${R.es.map(x => `<p>${esc(x)}</p>`).join('')}</div></details>
    <div class="p11-acts"><button class="btn ok wide" data-u="back">${t('uread.toBook')}</button>
      <button class="btn ghost wide" data-u="again">${ic('refresh')}${t('uread.again')}</button></div>
  </div>`;
}

// ---------- Eventos (una sola vez por hoja) ----------
function bind(sheet) {
  const live = () => sheet.classList.contains('p11-on') && sheet._ur;
  sheet.addEventListener('click', e => {
    const st = live(); if (!st) return;
    const w = e.target.closest('.p11-w');
    if (w && sheet.contains(w)) return wordSheet(sheet, +w.dataset.w);
    const b = e.target.closest('[data-u]'); if (!b || b.disabled) return;
    const u = b.dataset.u;
    if (u === 'back') { leaveUnitReading(sheet); return st.ctx.back(); }
    if (u === 'fg') {
      st.fg = !st.fg; sheet.classList.toggle('p11-nofg', !st.fg); b.setAttribute('aria-pressed', st.fg);
      const c = sheet.querySelector('#chips'); if (c) c.innerHTML = chipsHTML(st, st.R);
      return bub(sheet, t(st.fg ? 'uread.fgOn' : 'uread.fgOff'));
    }
    if (u === 'play') return playAll(sheet, .9, b);
    if (u === 'slow') return playAll(sheet, .6, b);
    if (u === 'ask') { stopUnitAudio(sheet); return questions(sheet, 0); }
    if (u === 'wx') return closeWord(sheet);
    if (u === 'wp' || u === 'wn') return wordSheet(sheet, +b.closest('.p11-sheet').dataset.i + (u === 'wn' ? 1 : -1));
    if (u === 'ws') return speak(b.dataset.word, .85);
    if (u === 'opt') { st.q.sel = +b.dataset.o; return drawQ(sheet, true); }
    if (u === 'peek') { st.q.peek = !st.q.peek; return drawQ(sheet, true); }
    if (u === 'check') return checkQ(sheet);
    if (u === 'next') return st.q.n + 1 < st.R.Q.length ? questions(sheet, st.q.n + 1) : end(sheet);
    if (u === 'again') { st.fg = false; st.qAns = []; st.done = false; return reading(sheet); }
  });
  sheet.addEventListener('keydown', e => {
    if (!live() || (e.key !== 'Enter' && e.key !== ' ')) return;
    const w = e.target.closest?.('.p11-w'); if (!w) return;
    e.preventDefault(); wordSheet(sheet, +w.dataset.w);
  });
}
