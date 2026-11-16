// KANJŪ · book.js — cuaderno de entrenamiento (propuesta A-02, tarea A-06a; mapa de niveles y guía de la unidad: tarea P-06,
// maqueta aprobada docs/propuestas/P-03-progresion.html, pantallas 1 y 10).
// En la ficha de cada KANJŪ, una tarjeta con la sección actual y su kanji a medio pintar; al tocarla, el cuaderno: una
// pestaña por unidad de la etapa actual y de la siguiente, con su tinta por nivel, su elenco, la guía, sus 5 niveles y,
// en las unidades que vienen, «Saltar aquí».
import { t } from './i18n.js';
import { ic } from './icons.js';
import { tr, WORD, jaHTML, wordHTML, showsKanji, patOf } from './lex.js';
import { SECTIONS, STAGES, LEVELS, ROUNDS_PER_LEVEL, ROUND_SIZE, PRIOR_MIX, GUIDES, phraseById } from './curriculum.js';
import { cur, curSection, levelOf, levelRounds, inkSVG, paintedOf, partsOf, prizeState, canJump, jumpSize } from './round.js';
import { creatureSVG } from './creature.js';
import { canExam, openExam } from './exam.js';
import { KANJI } from './data.js';
import { verbKanji } from './lang.js';
import { speak, canSpeak } from './games.js';
import { helpOn, kanaHTML } from './help.js';
import { readsHTML } from './exercises.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// [kanji:lectura] lleva furigana (textos de la guía en js/curriculum.js)
const J = s => esc(s).replace(/\[([^:\]]+):([^\]]+)\]/g, (_, k, r) => helpOn() ? `<ruby class="wk">${k}<rt>${r}</rt></ruby>` : k);

// Tarjeta de la ficha (debajo de los botones de acción)
export function bookCardHTML() {
  const s = curSection(), st = STAGES.find(x => x.id === s.stage);
  return `<button class="bk-card" id="bookCard"><span class="rd-ink-box">${s.reward ? inkSVG(s.reward, paintedOf(s.id)) : `<span class="rd-inkk">${s.kanji[0] || '・'}</span>`}</span>
    <span class="bk-t"><b>${tr(s.title)} · ${t('book.level', { l: levelOf(s.id), total: LEVELS })}</b>
    <small>${s.reward ? t('book.hidden') : t('book.noPrize')} · ${tr(st.title)} · ${t('book.open')}</small></span></button>`;
}

// ---------- Mapa de niveles ----------
// Qué se practica en cada nivel (docs/PROGRESION.md §3), sus ayudas y sus ejercicios, como en la maqueta
const LV = [
  { name: 'book.lv1', what: 'book.lv1d', aids: ['book.aidFuri', 'book.aidRomaji'], ex: ['ex.meet', 'ex.pairs'] },
  { name: 'book.lv2', what: 'book.lv2d', aids: ['book.aidFuri'], ex: ['ex.jaes', 'ex.similar'] },
  { name: 'book.lv3', what: 'book.lv3d', aids: ['book.aidFuriOff'], ex: ['ex.esja', 'ex.kana'] },
  { name: 'book.lv4', what: 'book.lv4d', aids: ['book.aidNoTr'], ex: ['ex.listen', 'ex.gap'] },
  { name: 'book.lv5', what: 'book.lv5d', aids: ['book.aidNone'], ex: [] },
];
const lvInfo = n => LV[Math.min(n, LV.length) - 1];
const stageNo = s => STAGES.findIndex(x => x.id === s.stage);
// Unidades del cuaderno: las de la etapa actual y las de la siguiente (hasta ahí se puede saltar, §8)
function units() {
  const i = stageNo(curSection()), ok = new Set(STAGES.slice(i, i + 2).map(x => x.id));
  return SECTIONS.filter(x => ok.has(x.stage));
}
const stateOf = s => cur().done[s.id] ? 'done' : cur().sec === s.id ? 'cur' : 'ahead';
// Elenco de la unidad (§2b.1): sus kanji con criatura; el premio va aparte, como tinta
const castOf = s => s.kanji.filter(k => KANJI[k] && k !== s.reward);
// Presenta la guía el primer KANJŪ del elenco (propuesta P-03); si no hay, el premio y, si tampoco, tu KANJŪ (§7)
const hostOf = (s, mon) => castOf(s)[0] || (KANJI[s.reward] ? s.reward : mon?.k);

function mapHTML(s, openLv, mon) {
  const c = cur(), st = stateOf(s), done = st === 'done', ahead = st === 'ahead', curLv = st === 'cur' ? levelOf(s.id) : 0;
  const parts = ahead ? 0 : partsOf(s.id), skipped = !!c.skipped[s.id], got = prizeState(s.id);
  const can = !!mon?.pos; // como «Entrenar» en la ficha: solo un KANJŪ que está en el santuario
  const painted = n => paintedOf(s.id, n);
  const next = n => Math.max(0, painted(n) - painted(n - 1));
  const tabs = units().map(u => {
    const us = stateOf(u);
    return `<button class="p3-unit${u.id === s.id ? ' on' : ''}${u.id === c.sec && u.id !== s.id ? ' here' : ''}" role="tab" aria-selected="${u.id === s.id}" data-unit="${u.id}">${u.id === s.id ? '' : us === 'done' ? ic('check') : us === 'ahead' ? ic('lock') : ''}${u.id}</button>`;
  }).join('');
  // Tinta del premio: lo pintado, y la parte del nivel en curso en rojo tenue
  const heroFig = !s.reward ? `<span class="rd-inkk">${s.kanji[0] || '・'}</span>`
    : skipped ? `<span class="rd-inkk q">？</span>`
    : inkSVG(s.reward, ahead ? 0 : paintedOf(s.id), 0, st === 'cur' ? Math.max(0, painted(curLv) - paintedOf(s.id)) : 0);
  const heroB = ahead ? t('book.blank') : skipped ? t('book.skipped') : done ? (got === 'asleep' ? t('book.asleep') : s.reward && got ? t('book.alive') : t('book.done'))
    : t('book.parts', { n: parts, total: LEVELS });
  const heroS = !s.reward ? t('book.noPrize') : skipped ? t('book.skippedSub') : ahead ? t('book.inkAhead', { k: s.reward }) : done ? '' : t('book.inkLead', { k: s.reward });
  const cast = castOf(s).slice(0, s.reward ? 2 : 3);
  const castHTML = `${cast.map(k => `<span><span class="art">${creatureSVG(k)}</span>${k}</span>`).join('')}${s.reward && !skipped ? `<span><span class="rd-ink-box">${inkSVG(s.reward, ahead ? 0 : paintedOf(s.id))}</span>${t('book.prize')}</span>` : ''}`;
  const exam = done && canExam(s.id) && !c.gold[s.id] ? `<button class="btn gold wide p3-exam" data-exam="${s.id}">金 ${t('exam.title')}</button>` : '';
  const jump = ahead && canJump(s.id) ? `<div class="p3-jump"><div class="row"><i>${ic('key')}</i><div><b>${t('jump.cardT')}</b><small>${t('jump.cardS', { here: `${curSection().id} · ${tr(curSection().title)}`, n: jumpSize(s.id) })}</small></div></div>
    <button class="btn ok wide" data-jump="${s.id}" ${can ? '' : 'disabled'}>${t('jump.here')}</button></div>` : '';
  const host = hostOf(s, mon);
  const guide = `<button class="p3-guide" data-guide><span class="art">${creatureSVG(host)}</span><span><b>${t('guide.title')}</b><small>${t('guide.cardS', { what: guideWhat(s), k: host })}</small></span>${ic('right')}</button>`;
  const row = (L, i) => {
    const n = i + 1, state = done || n < curLv ? 'done' : n === curLv ? 'cur' : 'lock';
    const r = state === 'done' ? ROUNDS_PER_LEVEL : state === 'cur' ? levelRounds(s.id) : 0, open = openLv === n;
    const mini = !s.reward ? '' : state === 'done' && !skipped ? inkSVG(s.reward, painted(n)) : state === 'cur' ? inkSVG(s.reward, painted(n - 1), 0, next(n)) : inkSVG(s.reward, 0);
    const act = state === 'cur' ? `<button class="btn ok wide" data-play ${can ? '' : 'disabled'}>${ic('right')}${t('book.start', { n: r + 1, total: ROUNDS_PER_LEVEL })}</button>`
      : state === 'done' ? `<button class="btn ghost wide" data-review="${n}" ${can ? '' : 'disabled'}>${ic('refresh')}${t('book.review')}</button>`
      : `<p class="p3-lockt">${ic('lock')}${ahead ? t('book.lockAhead') : t('book.lockLv', { n: n - 1 })}</p>`;
    const sub = state === 'done' ? t('book.roundsDone', { n: ROUNDS_PER_LEVEL, total: ROUNDS_PER_LEVEL }) : state === 'cur' ? t('book.roundOf', { n: r + 1, total: ROUNDS_PER_LEVEL })
      : t('book.roundsLock', { n: ROUNDS_PER_LEVEL, ex: ROUND_SIZE });
    return `<div class="p3-lv ${state}">
      <button class="p3-lvh" data-lv="${n}" aria-expanded="${open}"><span class="p3-med">${state === 'done' ? ic('check') : state === 'lock' && ahead ? ic('lock') : n}</span>
        <span class="p3-lvt"><b>${t('book.lvName', { n, name: t(L.name) })}</b><small><span class="p3-rd">${Array.from({ length: ROUNDS_PER_LEVEL }, (_, k) => `<i class="${k < r ? 'on' : ''}"></i>`).join('')}</span>${sub}</small></span>
        <span class="p3-mini" aria-hidden="true">${mini}</span></button>
      ${open ? `<div class="p3-lvb"><p>${t(L.what, { p: Math.round(PRIOR_MIX * 100) })}</p>
        <div class="p3-chips">${L.aids.map(a => `<span class="p3-chip">${ic(a === 'book.aidNoTr' || a === 'book.aidNone' ? 'eye' : 'kana')}${t(a)}</span>`).join('')}</div>
        ${L.ex.length ? `<div class="p3-exs">${L.ex.map(e => `<span class="p3-ex">${t(e)}</span>`).join('')}</div>` : ''}
        ${act}${(state === 'cur' || state === 'done') && !can ? `<p class="p3-lockt">${ic('home')}${t('book.placeFirst')}</p>` : ''}</div>` : ''}
    </div>`;
  };
  const stage = STAGES[stageNo(s)];
  return `<div class="pn-head"><span class="p3-hic">${ic('book')}</span><span class="pn-title">${t('book.head')}</span><button class="pn-x" data-close aria-label="${t('sheet.close')}">${ic('x')}</button></div>
    <div class="p3-units" role="tablist">${tabs}</div>
    <div class="pn-body view"><div>
      <p class="eyebrow">${t('book.stage', { n: stageNo(s), title: tr(stage.title) })}</p>
      <h2 class="p3-h">${s.id} · ${tr(s.title)}</h2>
      <span class="p3-cando">${tr(s.cando)}.</span>
      <div class="p3-hero"><span class="rd-ink-box">${heroFig}</span>
        <div><b>${heroB}</b>${heroS ? `<small>${heroS}</small>` : ''}
          <div class="p3-parts">${Array.from({ length: LEVELS }, (_, k) => `<i class="${k + 1 <= parts && !skipped ? 'on' : k + 1 === curLv ? 'now' : ''}"></i>`).join('')}</div>
          ${castHTML ? `<div class="p3-cast">${castHTML}</div>` : ''}</div></div>
      ${exam}${jump}${guide}
      <h4 class="p3-lvh4">${t('book.levels')} <small>${t('book.levelsSub', { n: LEVELS, r: ROUNDS_PER_LEVEL })}</small></h4>
      <div class="p3-lvs">${Array.from({ length: LEVELS }, (_, i) => row(lvInfo(i + 1), i)).join('')}</div>
    </div></div>`;
}

// ---------- Guía de la unidad (§7): frases clave, gramática y kanji. Opcional. ----------
// Pantallas de gramática: las de GUIDES o, si no hay, una por patrón de la unidad (PATTERNS)
function gramPages(s) {
  const g = GUIDES[s.id];
  if (g?.gram) return g.gram;
  return s.pats.map(patOf).filter(Boolean).map(p => ({ jp: p.ja, text: p, ex: s.phrases.filter(id => phraseById(id)?.pat === p.id).slice(0, 2) }));
}
// Qué trae la guía de la unidad, para su tarjeta: «Frases clave, la gramática y los kanji»
const guideWhat = s => {
  const w = new Intl.ListFormat('es', { type: 'conjunction' }).format([t('guide.wPhrases'), ...(gramPages(s).length ? [t('guide.wGram')] : []), ...(s.kanji.some(k => KANJI[k]) ? [t('guide.wKanji')] : [])]);
  return w[0].toUpperCase() + w.slice(1);
};
const keyPhrases = s => (GUIDES[s.id]?.phrases || s.phrases.slice(0, 5)).map(phraseById).filter(Boolean);
const phraseHTML = (p, voice) => `<div class="dy-p"><p class="jp">${jaHTML(p.ja, p.ids)}。</p><p class="es">${esc(tr(p))}</p>${voice ? `<button class="say-l" data-say="${esc(p.ja.replace(/\s+/g, ''))}" aria-label="${t('dojo.listen')}">${ic('sound')}</button>` : ''}</div>`;
// Forma て de un verbo con la terminación que cambia resaltada: 入ります → 入って
function teHTML(w) {
  const stem = w.kana.slice(0, -2);
  let i = 0; while (i < stem.length && stem[i] === w.te[i]) i++;
  const end = w.te.length - i, kj = showsKanji(w) ? verbKanji(w, w.te) : w.te;
  const body = `${kj.slice(0, kj.length - end)}<em>${kj.slice(kj.length - end)}</em>`;
  return showsKanji(w) && helpOn() ? `<ruby class="wk">${body}<rt>${w.te}</rt></ruby>` : body;
}
function formHTML(form) {
  return form.map(x => x === '+' || x === '=' ? `<i>${x}</i>` : Array.isArray(x) ? (x[0] === 'p' ? `<span>${kanaHTML(x[1], { particle: true })}</span>` : `<span class="${x[0]}">${esc(tr(x[1]))}</span>`) : `<span>${J(x)}</span>`).join('');
}
function guideHTML(s, tab, page, mon) {
  const voice = canSpeak(), pages = gramPages(s), host = hostOf(s, mon);
  const tabs = [['frases', 'list', 'guide.tPhrases'], ...(pages.length ? [['gram', 'pen', 'guide.tGram']] : []), ['kanji', 'kana', 'guide.tKanji']];
  let html;
  if (tab === 'gram' && pages.length) {
    const i = Math.min(page, pages.length - 1), p = pages[i], last = i === pages.length - 1;
    html = `<p class="eyebrow">${t('guide.gramN', { n: i + 1, total: pages.length })}</p>
      <h3 class="p3-gh">${p.title ? esc(tr(p.title)) : ''}<span class="jp">${J(p.jp)}</span></h3>
      <p class="p3-gp">${J(tr(p.text))}</p>
      ${p.form ? `<div class="p3-form">${formHTML(p.form)}</div>` : ''}
      ${p.te ? `<div class="p3-tbl"><div><small>〜ます</small><span></span><small>${t('guide.teForm')}</small></div>${p.te.map(id => WORD[id]).filter(Boolean).map(w => `<div><span>${wordHTML(w)}</span>${ic('right')}<span>${teHTML(w)}</span></div>`).join('')}</div>` : ''}
      ${(p.ex || []).map(phraseById).filter(Boolean).map(x => phraseHTML(x, voice)).join('')}
      ${p.note ? `<p class="p3-mn">${ic('bulb')}<span>${J(tr(p.note))}</span></p>` : ''}
      <div class="p3-pages">${i ? `<button class="btn ghost" data-page="${i - 1}">${ic('left')}${t('guide.prev')}</button>` : '<span></span>'}
        <span class="dots">${pages.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</span>
        ${last ? `<button class="btn ok" data-tab="kanji">${t('guide.tKanji')}${ic('right')}</button>` : `<button class="btn ok" data-page="${i + 1}">${t('guide.next')}${ic('right')}</button>`}</div>`;
  } else if (tab === 'kanji') {
    html = `<p class="eyebrow">${t('guide.cast')}</p><h3 class="p3-gh">${t('guide.kanjiT')}</h3>
      ${s.kanji.filter(k => KANJI[k]).map(k => `<div class="p3-kc"><span class="art">${creatureSVG(k)}</span><div><div class="t"><b>${k}</b><span>${esc(KANJI[k].m)}</span>${k === s.reward ? `<em>${t('book.prize')}</em>` : ''}</div>
        <div class="p3-kr">${readsHTML(k, { cls: 'p3-krb' })}</div>${KANJI[k].mn ? `<p>${esc(KANJI[k].mn)}</p>` : ''}</div></div>`).join('') || `<p class="muted">${t('guide.noKanji')}</p>`}`;
  } else {
    tab = 'frases';
    html = `<p class="eyebrow">${t('guide.eyebrow', { id: s.id, title: tr(s.title) })}</p>
      <div class="p3-host"><span class="art">${creatureSVG(host)}</span><div class="p3-hb"><span class="who">${host}</span><p>${t('guide.hello', { k: host, c: tr(s.cando).replace(/^Puedo\s+/, '') })}${voice ? ' ' + t('guide.tap') : ''}</p></div></div>
      <h4 class="p3-h4">${t('guide.keyPhrases')}</h4>
      ${keyPhrases(s).map(p => phraseHTML(p, voice)).join('')}`;
  }
  return `<div class="pn-head"><div class="pn-tabs" role="tablist">${tabs.map(([id, i, k]) => `<button class="${tab === id ? 'on' : ''}" role="tab" aria-selected="${tab === id}" data-tab="${id}">${ic(i)}<span>${t(k)}</span></button>`).join('')}</div>
      <button class="pn-x" data-map aria-label="${t('sheet.close')}">${ic('x')}</button></div>
    <div class="pn-body view"><div>${html}</div></div>
    <div class="p3-gfoot"><button class="btn ${tab === 'gram' ? 'ghost' : 'ok'} wide" data-map>${t('guide.done')}</button></div>`;
}

// ---------- Abrir el cuaderno ----------
// acts (los pone sheet.js): play() entrena el nivel actual · review(sec, nivel) repasa un nivel terminado ·
// jump(sec) abre «Saltar aquí». at = unidad que se abre (por defecto, la actual).
export function openBook(modal, mon, acts = {}, at = cur().sec) {
  const m = modal('', 'p3-bkm'), sheet = m.querySelector('.sheet');
  sheet.classList.add('pn-card');
  let sec = units().some(u => u.id === at) ? at : cur().sec, view = 'map', tab = 'frases', page = 0, openLv = null;
  const draw = (keep = false) => {
    const s = SECTIONS.find(x => x.id === sec), sc = keep ? sheet.querySelector('.pn-body')?.scrollTop || 0 : 0;
    if (openLv === null) openLv = stateOf(s) === 'cur' ? levelOf(s.id) : 0;
    sheet.innerHTML = view === 'guide' ? guideHTML(s, tab, page, mon) : mapHTML(s, openLv, mon);
    const body = sheet.querySelector('.pn-body'); if (body) body.scrollTop = sc;
    if (view === 'map') sheet.querySelector('.p3-unit.on')?.scrollIntoView({ block: 'nearest', inline: 'center' });
  };
  const close = () => m.close();
  // Atrás o tocar fuera: desde la guía se vuelve al mapa; desde el mapa se cierra
  m.onclick = e => { if (e.target !== m) return; if (view === 'guide') { view = 'map'; draw(); } else close(); };
  sheet.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b || b.disabled) return;
    const d = b.dataset;
    if ('say' in d) return speak(d.say);
    if ('close' in d) return close();
    if ('unit' in d) { sec = d.unit; openLv = null; return draw(); }
    if ('lv' in d) { const n = +d.lv; openLv = openLv === n ? 0 : n; return draw(true); }
    if ('guide' in d) { view = 'guide'; tab = 'frases'; page = 0; return draw(); }
    if ('map' in d) { view = 'map'; return draw(); }
    if ('tab' in d) { tab = d.tab; page = 0; return draw(); }
    if ('page' in d) { page = +d.page; return draw(); }
    if ('play' in d) { close(); return acts.play?.(); }
    if ('review' in d) { close(); return acts.review?.(sec, +d.review); }
    if ('jump' in d) { close(); return acts.jump?.(d.jump); }
    if ('exam' in d) { close(); return openExam(mon, d.exam, modal); }
  });
  draw();
  return m;
}
