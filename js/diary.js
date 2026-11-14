// KANJŪ · diary.js — Diario de descubrimientos y tarjeta de hallazgo de los viajes.
// Pestañas: Palabras · Frases · Lecturas · Kana · Puedo…  (docs/APRENDIZAJE.md §2, §3 y §7)
import { ic } from './icons.js';
import { KANJI, SRS_HOURS, reads } from './data.js';
import { S, save, bump } from './state.js';
import { t } from './i18n.js';
import { romaji, kanaPool, kanaDrill, kanaHTML, kanaUnits, kanaSeen, romajiOff, helpOn } from './help.js';
import { speak } from './games.js';
import { emit } from './tutorial.js';
import { useOf } from './lang.js';
import { WORD, LEX, READINGS, SITUATIONS, tr, sitOf, sitWords, patOf, regionOf, foundIds, meet, findWord, markKnown, nextWord, phraseFor, reencounter, seePhrase, phrasesOf, seenPhrases,
  readingMissing, readingOpen, finishReading, READ_INK, sitFound, sitSolid, canDo, wordHTML, jaHTML, jaPlain, anchorsOf, ownedAnchors, ENC_MAX } from './lex.js';
import { $, ui, go, hud, toast, modal, buzz } from './main.js';

const TABS = [['words', 'pen', 'diary.words'], ['phrases', 'list', 'diary.phrases'], ['reads', 'book', 'diary.reads'], ['kana', 'kana', 'diary.kana'], ['cando', 'check', 'diary.cando']];
const KIND = { n: 'diary.kind.noun', v: 'diary.kind.verb', adj: 'diary.kind.adj', expr: 'diary.kind.expr', num: 'diary.kind.num', q: 'diary.kind.q' };
const kindOf = w => KIND[w.kind] ? t(KIND[w.kind]) : '';
const dots = n => '●'.repeat(Math.min(ENC_MAX, n)) + '○'.repeat(Math.max(0, ENC_MAX - n));
const BOXES = SRS_HOURS.length - 1;
const told = new Set(); // un encuentro por palabra y por sesión al oírla en el diario

// Abre el diario (vive como pestaña del Atlas) en la pestaña pedida
export function openDiary(tab) {
  if (tab) ui.diary = tab;
  ui.tab = 'dex'; ui.dsub = 'diary'; go();
}
export const diaryNew = () => foundIds().length;

export function viewDiary(v) {
  const tab = TABS.some(x => x[0] === ui.diary) ? ui.diary : 'words';
  if (!S.path.diary) { S.path.diary = true; save(); } // objetivo del Camino: abrir el diario
  emit('diary');
  const n = foundIds().length;
  v.innerHTML = `<div class="dex tr diary">
    <p class="eyebrow">${t('diary.eyebrow')}</p><h2 class="pn-h">${t('diary.title')}</h2>
    <p class="pn-lead">${t('diary.lead', { n, total: LEX.length })}</p>
    <div class="st-tabs dy-tabs">${TABS.map(([id, k, l]) => `<button class="${tab === id ? 'on' : ''}" data-dy="${id}">${ic(k)}<span>${t(l)}</span></button>`).join('')}</div>
    <div class="dy-body">${({ words: wordsTab, phrases: phrasesTab, reads: readsTab, kana: kanaTab, cando: candoTab })[tab]()}</div></div>`;
  v.querySelectorAll('[data-dy]').forEach(b => b.onclick = () => { ui.diary = b.dataset.dy; buzz(5); viewDiary(v); });
  v.querySelectorAll('[data-w]').forEach(b => b.onclick = () => openWord(b.dataset.w));
  v.querySelectorAll('[data-anchor]').forEach(b => b.onclick = () => speak(b.dataset.anchor));
  v.querySelectorAll('[data-sayp]').forEach(b => b.onclick = () => speak(b.dataset.sayp));
  v.querySelectorAll('[data-read]').forEach(b => b.onclick = () => openReading(READINGS.find(r => r.id === b.dataset.read), v));
  $('#dyDrill', v) && ($('#dyDrill', v).onclick = async () => {
    const pool = litKana(); if (pool.length < 4) return toast(t('diary.kanaFew'));
    const r = await kanaDrill(pool, $('#layer')); save(); hud(); viewDiary(v);
    if (r.total) toast(t('diary.kanaDone', { right: r.right, total: r.total }));
  });
  $('#dyTrip', v) && ($('#dyTrip', v).onclick = () => { ui.tab = 'exp'; go(); });
}
const emptyHTML = (title, sub) => `<div class="tr-empty"><b>${title}</b><small>${sub}</small></div><button class="btn ok wide" id="dyTrip">${ic('compass')} ${t('diary.goTrip')}</button>`;

// ---------- Palabras ----------
function wordsTab() {
  const groups = SITUATIONS.map(s => {
    const all = sitWords(s.id), mine = all.filter(w => S.lex[w.id]); if (!all.length) return '';
    const left = all.length - mine.length, rg = regionOf(s.id);
    return `<h4 class="dy-h">${tr(s.title)}<small>${mine.length}/${all.length}</small></h4>
      ${mine.map(wordRow).join('')}
      ${left ? `<p class="dy-more">${ic('compass')} ${t('diary.left', { n: left, place: rg?.es || '' })}</p>` : ''}`;
  }).join('');
  const anchors = ownedAnchors();
  return (foundIds().length ? groups : emptyHTML(t('diary.noWords'), t('diary.noWordsSub')) + groups)
    + (anchors.length ? `<h4 class="dy-h">${t('diary.anchors')}<small>${anchors.length}</small></h4><p class="dy-more">${t('diary.anchorsSub')}</p>
      <div class="dy-anchors">${anchors.map(anchorChip).join('')}</div>` : '');
}
function wordRow(w) {
  const r = S.lex[w.id], rg = regionOf(r.from);
  return `<button class="dy-w" data-w="${w.id}"><span class="dy-k">${wordHTML(w)}</span>
    <span class="dy-t"><b>${tr(w)}</b><small>${rg ? t('diary.from', { place: rg.es }) : ''}</small><i class="dy-dots" aria-label="${t('diary.enc', { n: r.n || 1 })}">${dots(r.n || 1)}</i></span>
    <em class="dy-box">${t('diary.box', { n: r.box, max: BOXES })}</em></button>`;
}
const anchorChip = w => `<button class="dy-a" data-anchor="${w[1]}"><ruby class="wk">${w[0]}${helpOn() ? `<rt>${w[1]}</rt>` : ''}</ruby><small>${w[2]}</small>${ic('sound')}</button>`;

// Tocar una palabra = oírla y ver sus frases
function openWord(id) {
  const w = WORD[id], r = S.lex[id], ps = phrasesOf(id);
  if (!told.has(id)) { told.add(id); meet(id, 'diary'); save(); }
  const m = modal(`<div class="find">
    <button class="find-w" id="wSay" aria-label="${t('dojo.listen')}">${wordHTML(w)}${ic('sound')}</button>
    <p class="find-m"><b>${tr(w)}</b>${kindOf(w) ? ` <small>${kindOf(w)}</small>` : ''}</p>
    ${w.kanji ? `<p class="muted">${t('diary.written', { kanji: w.kanji })}</p>` : ''}
    <p class="dy-dots big">${dots(r.n || 1)}</p><p class="muted">${t('diary.encLong', { n: r.n || 1, places: (r.at || []).length })} · ${t('diary.box', { n: r.box, max: BOXES })}</p>
    ${ps.length ? `<h4>${t('diary.itsPhrases')}</h4>${ps.map(p => phraseHTML(p, id)).join('')}` : `<p class="muted">${t('diary.noPhrases')}</p>`}</div>`);
  speak(w.kana);
  $('#wSay', m).onclick = () => speak(w.kana);
  m.querySelectorAll('[data-sayp]').forEach(b => b.onclick = () => speak(b.dataset.sayp));
}

// ---------- Frases ----------
// El nombre del patrón queda a un toque (metalenguaje a pedido)
function phraseHTML(p, hot) {
  const pat = p.pat && patOf(p.pat);
  return `<div class="dy-p"><button class="say-l" data-sayp="${jaPlain(p.ja)}" aria-label="${t('dojo.listen')}">${ic('sound')}</button>
    <p class="jp">${jaHTML(p.ja, p.ids, hot)}</p><p class="es">${tr(p)}</p>
    ${pat ? `<details class="dy-pat"><summary>${t('diary.pattern')}</summary><p><b class="jp">${pat.ja}</b>: ${tr(pat)}</p></details>` : ''}</div>`;
}
function phrasesTab() {
  const ps = seenPhrases();
  if (!ps.length) return emptyHTML(t('diary.noPhr'), t('diary.noPhrSub'));
  return `<p class="dy-more">${t('diary.phrSub')}</p>${ps.map(p => phraseHTML(p)).join('')}`;
}

// ---------- Lecturas ----------
function readsTab() {
  if (!READINGS.length) return '';
  const row = r => {
    const open = readingOpen(r), miss = readingMissing(r), done = S.read[r.id];
    const places = [...new Set(miss.map(id => regionOf(WORD[id].sit)?.es).filter(Boolean))].join(' · ');
    return `<button class="dy-r ${open ? '' : 'lock'} ${done ? 'done' : ''}" ${open ? `data-read="${r.id}"` : 'disabled'}>
      <span class="dy-ri">${ic(open ? 'book' : 'lock')}</span>
      <span class="dy-t"><b>${tr(r.title)}</b><small>${open ? (done ? t('diary.readDone') : t('diary.readNew', { ink: READ_INK })) : t('diary.readMiss', { n: miss.length, place: places })}</small></span>
      ${open ? ic('right', 'chev') : ''}</button>`;
  };
  const list = [...READINGS].sort((a, b) => readingOpen(b) - readingOpen(a));
  return `<p class="dy-more">${t('diary.readsSub')}</p>${list.map(row).join('')}`;
}
function openReading(r, v) {
  const m = modal(`<div class="dy-read"><h3>${ic('book')} ${tr(r.title)}</h3>
    <div class="story-read">${r.lines.map((l, i) => `<div class="sline" data-i="${i}"><button class="say-l" data-sayp="${jaPlain(l.ja)}" aria-label="${t('dojo.listen')}">${ic('sound')}</button><p class="jp">${jaHTML(l.ja, r.ids)}</p><p class="es">${tr(l)}</p></div>`).join('')}</div>
    <p class="muted">${t('diary.readHelp')}</p><button class="btn ok wide" id="rdEnd">${t('diary.readEnd')}</button></div>`);
  m.querySelectorAll('.sline').forEach(l => l.onclick = e => { if (!e.target.closest('.say-l')) l.classList.toggle('open'); });
  m.querySelectorAll('[data-sayp]').forEach(b => b.onclick = () => speak(b.dataset.sayp));
  $('#rdEnd', m).onclick = () => {
    const first = finishReading(r); save(); m.close(); hud(); viewDiary(v);
    toast(first ? t('diary.readFirst', { ink: READ_INK }) : t('diary.readAgain'));
  };
}

// ---------- Kana ----------
const GOJUON = ['あいうえお', 'かきくけこ', 'さしすせそ', 'たちつてと', 'なにぬねの', 'はひふへほ', 'まみむめも', 'や　ゆ　よ', 'らりるれろ', 'わ　　　を', 'ん', 'がぎぐげご', 'ざじずぜぞ', 'だぢづでど', 'ばびぶべぼ', 'ぱぴぷぺぽ'];
const toKata = s => s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
// Kana encendidos: los que aparecen en las palabras halladas (y los que ya se practicaron)
function litSet() {
  const set = new Set(Object.keys(S.kana).filter(c => S.kana[c] > 0));
  foundIds().forEach(id => [...WORD[id].kana].forEach(c => set.add(c)));
  return set;
}
const litKana = () => [...litSet()].filter(c => /^[ぁ-ゖァ-ヺ]$/.test(c) && !'ゃゅょっャュョッ'.includes(c) && romaji(c));
function kanaTab() {
  const lit = litSet();
  const grid = rows => `<div class="dy-kana">${rows.map(row => `<div>${[...row].map(c => c === '　' ? '<span class="dy-gap"></span>'
    : `<span class="${lit.has(c) ? 'on' : ''} ${romajiOff(c) ? 'ok' : ''}">${c}<i>${lit.has(c) && !romajiOff(c) && helpOn() ? romaji(c) : ''}</i></span>`).join('')}</div>`).join('')}</div>`;
  const count = rows => [...rows.join('')].filter(c => c !== '　' && lit.has(c)).length, total = GOJUON.join('').replace(/　/g, '').length;
  const kata = GOJUON.map(toKata);
  return `<p class="dy-more">${t('diary.kanaSub')}</p>
    <h4 class="dy-h">${t('diary.hira')}<small>${count(GOJUON)}/${total}</small></h4>${grid(GOJUON)}
    <h4 class="dy-h">${t('diary.kata')}<small>${count(kata)}/${total}</small></h4>${grid(kata)}
    <p class="dy-more">${t('diary.kanaLegend')}</p>
    <button class="btn ok wide" id="dyDrill">${ic('kana')} ${t('diary.kanaDrill')}</button>`;
}

// ---------- Puedo… ----------
function candoTab() {
  return `<p class="dy-more">${t('diary.candoSub')}</p>${SITUATIONS.map(s => {
    const n = sitWords(s.id).length; if (!n) return '';
    const solid = sitSolid(s.id), ok = canDo(s.id);
    return `<div class="dy-c ${ok ? 'ok' : ''}"><span class="dy-ri">${ic(ok ? 'check' : 'target')}</span>
      <span class="dy-t"><b>${tr(s.cando)}</b><div class="tbar"><i style="width:${Math.min(100, solid / Math.ceil(n * .8) * 100)}%"></i></div>
      <small>${tr(s.title)} · ${t('diary.candoProg', { n: solid, total: n, found: sitFound(s.id) })}</small></span></div>`;
  }).join('')}`;
}

// ---------- Hallazgo de viaje ----------
// Al recibir un viaje: una palabra nueva de la situación de esa región dentro de una frase que ya se entiende casi entera.
// Si la región no tiene palabras nuevas, un reencuentro: una frase con palabras ya halladas. Nunca hay examen aquí.
export function openFind(regionId) {
  const w = nextWord(regionId);
  let p;
  if (w) { findWord(w.id, regionId); p = phraseFor(w.id); if (p) seePhrase(p, 'trip', w.id); }
  else { p = reencounter(regionId); if (!p) return null; seePhrase(p, 'trip'); bump('words'); }
  save();
  const m = modal(`<div class="find">
    <span class="new-tag">${t(w ? 'find.new' : 'find.again')}</span>
    ${w ? `<button class="find-w" id="fSay" aria-label="${t('dojo.listen')}">${wordHTML(w)}${ic('sound')}</button>
    <p class="find-m"><b>${tr(w)}</b>${kindOf(w) ? ` <small>${kindOf(w)}</small>` : ''}</p>` : `<p class="muted">${t('find.againSub')}</p>`}
    ${p ? `<div class="dy-p"><button class="say-l" data-sayp="${jaPlain(p.ja)}" aria-label="${t('dojo.listen')}">${ic('sound')}</button><p class="jp">${jaHTML(p.ja, p.ids, w?.id)}</p><p class="es">${tr(p)}</p></div>` : ''}
    <p class="muted">${t(w ? 'find.saved' : 'find.againSaved')}</p>
    <button class="btn ok wide" id="fOk">${t('find.ok')}</button>
    <div class="row find-row">${w ? `<button class="btn ghost" id="fKnew">${t('find.knew')}</button>` : ''}<button class="btn ghost" id="toDiary">${ic('pen')} ${t('find.diary')}</button></div></div>`, 'findm');
  const say = () => speak(w ? w.kana : jaPlain(p.ja));
  say();
  $('#fSay', m) && ($('#fSay', m).onclick = say);
  m.querySelectorAll('[data-sayp]').forEach(b => b.onclick = () => speak(b.dataset.sayp));
  const close = () => { m.close(); hud(); };
  $('#fOk', m).onclick = () => { close(); go(); };
  $('#fKnew', m) && ($('#fKnew', m).onclick = () => { markKnown(w.id); save(); close(); go(); toast(t('find.knewToast')); });
  $('#toDiary', m).onclick = () => { close(); openDiary(w ? 'words' : 'phrases'); };
  hud();
  return m;
}
// Progreso de lengua de una región, para la lista de viajes: "Saludar · 4/12 palabras"
export function regionLangHTML(regionId) {
  const s = sitOf(regionId), n = sitWords(regionId).length; if (!s || !n) return '';
  return `<p class="r-lang">${ic(canDo(regionId) ? 'check' : 'pen')}<span><b>${tr(s.title)}</b> · ${t('trip.words', { n: sitFound(regionId), total: n })}<small>${tr(s.cando)}</small></span></p>`;
}

// ---------- Verdad sobre cada kanji: etiqueta de uso y palabras ancla (ficha y Atlas) ----------
const USE_KEY = { daily: 'use.daily', rare: 'use.rare', piece: 'use.piece' };
export const useTagHTML = k => { const u = useOf(k); return USE_KEY[u] ? `<span class="use-tag u-${u}">${t(USE_KEY[u])}</span>` : ''; };
export function anchorsHTML(k) {
  const ws = anchorsOf(k); if (!ws.length) return '';
  return `<h4>${t('diary.anchorsOf', { k })}</h4><div class="dy-anchors">${ws.map(anchorChip).join('')}</div>`;
}
export const bindAnchors = root => root.querySelectorAll('[data-anchor]').forEach(b => b.onclick = () => speak(b.dataset.anchor));
