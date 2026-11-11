// Academia: camino de lecciones al estilo Duolingo con kana, gramática y lecturas graduadas.
import { ic } from './icons.js';
import { S, save, mastery } from './state.js';
import { SRS_HOURS, KANJI, PIECES } from './data.js';
import { UNITS, STORIES } from './course.js';
import { LESSONS, romaji, helpOn } from './help.js';
import { speak } from './games.js';
import { aiOn, genStory, explain, openAISettings } from './ai.js';
import { emit } from './tutorial.js';
import { track, flush, openLesson } from './analytics.js';

const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const pick = a => a[Math.random() * a.length | 0];
const $ = (s, r = document) => r.querySelector(s);
const today = () => new Date().toISOString().slice(0, 10);
const chars = L => Array.isArray(L.chars) ? L.chars : [...L.chars];
const ALL = UNITS.flatMap(u => u.lessons.map(l => ({ ...l, unit: u })));
const byId = id => ALL.find(l => l.id === id);
export const DAILY_GOAL = 30;

function A() {
  S.acad ??= {};
  const a = S.acad; a.done ??= {}; a.srs ??= {}; a.units ??= []; a.xp ??= 0;
  if (a.day?.date !== today()) a.day = { date: today(), xp: 0 };
  return a;
}
export const acadDue = () => Object.values(A().srs).filter(r => r.due <= Date.now()).length;
const crowns = id => A().done[id] || 0;
function unlocked(L) {
  const i = L.unit.lessons.findIndex(x => x.id === L.id);
  if (i > 0) return !!crowns(L.unit.lessons[i - 1].id);
  const ui = UNITS.indexOf(L.unit);
  if (L.type === 'story' || L.unit.free) return true; // lecturas y piezas: se pueden hacer en cualquier momento
  const prev = UNITS.slice(0, ui).reverse().find(u => !u.free); // las unidades libres no bloquean el camino
  return !prev || prev.lessons.every(x => crowns(x.id));
}
const storyReady = st => st.kanji.filter(k => S.dex[k]?.owned).length >= Math.ceil(st.kanji.length / 2);

// ---------- Construcción de ejercicios ----------
const kanaOf = ids => ids.flatMap(id => chars(byId(id)));
const kanaLessonsBefore = L => ALL.filter(l => l.type === 'kana' && ALL.indexOf(l) <= ALL.indexOf(L) && /[゠-ヿ]/.test(chars(l)[0]) === /[゠-ヿ]/.test(chars(L)[0])).map(l => l.id);
function buildKana(L) {
  const cs = chars(L), pool = kanaOf(kanaLessonsBefore(L)), ex = [];
  if (!crowns(L.id)) { cs.slice(0, 8).forEach(c => ex.push({ t: 'intro', c })); if (L.note) ex.splice(1, 0, { t: 'note', html: L.note }); }
  shuffle(cs).slice(0, 8).forEach(c => ex.push(pick([{ t: 'k2r', c, pool }, { t: 'r2k', c, pool }, { t: 'listen', c, pool }])));
  ex.push({ t: 'match', pairs: shuffle(cs).slice(0, 5).map(c => [c, romaji(c)]) });
  shuffle(L.words).slice(0, 4).forEach(([jp, es]) => ex.push({ t: 'mean', jp, es, opts: L.words.map(w => w[1]) }));
  return ex;
}
function buildPhrase(L) {
  const ex = [{ t: 'note', html: L.tip }], V = L.vocab;
  if (!crowns(L.id)) V.forEach(([jp, es]) => ex.push({ t: 'vintro', jp, es }));
  ex.push({ t: 'match', pairs: shuffle(V).slice(0, 5).map(([jp, es]) => [jp, es]) });
  shuffle(V).slice(0, 3).forEach(([jp, es]) => ex.push(pick([{ t: 'mean', jp, es, opts: V.map(v => v[1]) }, { t: 'listenv', jp, es, opts: V.map(v => v[0]) }])));
  const S2 = L.sents || [];
  S2.forEach(([jp, es]) => ex.push(Math.random() < .6 ? { t: 'build', jp, es, extra: V.map(v => v[0]).concat(['は', 'を', 'に', 'で', 'の', 'か']) } : { t: 'trans', jp, es, opts: S2.map(s => s[1]).concat(V.map(v => v[1])) }));
  (L.blanks || []).forEach(([s, a, es]) => ex.push({ t: 'blank', s, a, es }));
  return ex;
}
const FORMS = [['ます', 'presente'], ['ません', 'presente negativo'], ['ました', 'pasado'], ['ませんでした', 'pasado negativo']];
function buildTense(L) {
  const ex = [{ t: 'note', html: L.tip }];
  L.verbs.forEach(([stem, es]) => {
    const [f, lab] = pick(FORMS);
    ex.push({ t: 'tense', q: `<b>${es}</b> · ${lab}`, a: stem + f, opts: FORMS.map(x => stem + x[0]) });
    const [f2, lab2] = pick(FORMS);
    ex.push({ t: 'tense', q: `¿Qué tiempo es <b class="jp">${stem + f2}</b>?`, a: lab2, opts: FORMS.map(x => x[1]), speak: stem + f2 });
  });
  return shuffle(ex.slice(1)).reduce((a, e) => (a.push(e), a), [ex[0]]);
}
function buildReview(L) {
  const ids = L.from, cs = kanaOf(ids), words = ids.flatMap(id => byId(id).words);
  const ex = shuffle(cs).slice(0, 8).map(c => pick([{ t: 'k2r', c, pool: cs }, { t: 'r2k', c, pool: cs }, { t: 'listen', c, pool: cs }]));
  shuffle(words).slice(0, 4).forEach(([jp, es]) => ex.push({ t: 'mean', jp, es, opts: words.map(w => w[1]) }));
  ex.push({ t: 'match', pairs: shuffle(cs).slice(0, 5).map(c => [c, romaji(c)]) });
  return shuffle(ex);
}

// ---------- Piezas 部品 ----------
function buildPiece(L) {
  const p = L.piece, d = PIECES[p], others = Object.keys(PIECES).filter(x => x !== p);
  const withP = Object.keys(KANJI).filter(k => KANJI[k].recipes?.some(r => r.includes(p)));
  const without = Object.keys(KANJI).filter(k => !withP.includes(k) && KANJI[k].recipes);
  const ex = [{ t: 'note', html: `<div class="pc-card"><span>${p}</span><b>${d.name}</b><i>${d.rom}</i><p>${d.m}</p></div><p>知 ${d.mn}</p><p>No es un kanji que se use solo: es una <b>pieza</b> que aparece dentro de otros. Aparece en: <b class="jp">${withP.join(' ')}</b></p>` }];
  withP.forEach(k => ex.push({ t: 'note', html: `<div class="pc-card"><span>${k}</span><b>${KANJI[k].m}</b></div><p>${KANJI[k].recipes.find(r => r.includes(p)).join(' + ')} = ${k}</p><p>知 ${KANJI[k].mn}</p>` }));
  ex.push({ t: 'q', q: `¿Qué significa la pieza <b class="jp">${p}</b>?`, a: d.m, opts: [d.m, ...shuffle(others).slice(0, 3).map(x => PIECES[x].m)] });
  ex.push({ t: 'q', q: `¿Cómo se llama la pieza <b class="jp">${p}</b>?`, a: d.name, opts: [d.name, ...shuffle(others).slice(0, 3).map(x => PIECES[x].name)] });
  withP.forEach(k => ex.push({ t: 'q', q: `¿Qué kanji contiene ${p} (${d.m})?`, a: k, opts: [k, ...shuffle(without).slice(0, 3)] }));
  withP.slice(0, 2).forEach(k => ex.push({ t: 'q', q: `¿Qué significa <b class="jp">${k}</b>?`, a: KANJI[k].m, opts: [KANJI[k].m, ...shuffle(Object.keys(KANJI).filter(x => x !== k)).slice(0, 3).map(x => KANJI[x].m)] }));
  return ex;
}

// ---------- Lectura graduada ----------
const toks = line => line.replace(/([㐀-鿿々]+)\{([^}]+)\}/g, (_, k, y) => {
  const known = [...k].every(c => mastery(c) >= 3);
  return `<ruby class="rk${known ? ' hid' : ''}">${k}<rt>${y}</rt></ruby>`;
});
const plainLine = line => line.replace(/([㐀-鿿々]+)\{([^}]+)\}/g, '$2').replace(/\s/g, '');
function storyHTML(st) {
  return `<div class="story-read">${st.lines.map(([jp, es], i) => `<div class="sline" data-i="${i}"><button class="say-l" data-say="${i}">音</button><p class="jp">${toks(jp.replace(/ /g, ''))}</p><p class="es">${es}</p></div>`).join('')}
    <p class="muted">Tocá una oración para ver su traducción. Tocá un kanji para ver su lectura. La furigana desaparece en los kanji que ya dominás.</p></div>`;
}

// ---------- Reproductor de lecciones ----------
export function runLesson(L, root, custom) {
  let queue;
  if (custom) queue = custom;
  else if (L.type === 'kana') queue = buildKana(L);
  else if (L.type === 'phrase') queue = buildPhrase(L);
  else if (L.type === 'tense') queue = buildTense(L);
  else if (L.type === 'review') queue = buildReview(L);
  else if (L.type === 'story') { const st = STORIES[L.story]; queue = [{ t: 'read', st }, ...st.qs.map(([q, a, o]) => ({ t: 'q', q, a, opts: [a, ...o] }))]; }
  else if (L.type === 'piece') queue = buildPiece(L);
  else queue = [{ t: 'note', html: `<h3>${LESSONS[L.tip].t}</h3>${LESSONS[L.tip].body}` }];
  const total = queue.filter(e => !['intro', 'vintro', 'note', 'read'].includes(e.t)).length || 1;
  let done = 0, mistakes = 0, combo = 0, best = 0, retries = 0; const missed = new Set();
  // Analítica (S1-02): solo las lecciones del curso, no los repasos ni los cuentos de IA
  const ev = L.id ? { lesson: L.id, unit: L.unit?.id, lt: L.type } : null, t0 = Date.now();
  let step = 0;
  if (ev) track('lesson_start', { ...ev, again: !!crowns(L.id) });
  return new Promise(resolve => {
    const w = document.createElement('div'); w.className = 'lp';
    w.innerHTML = `<div class="lp-head"><button class="x">✕</button><div class="lp-bar"><i></i></div><span class="combo"></span></div><div class="lp-body"></div><div class="lp-foot"><div class="fb"></div><button class="btn ok wide go" disabled>Comprobar</button></div>`;
    root.append(w);
    const body = $('.lp-body', w), foot = $('.lp-foot', w), btn = $('.go', w), fb = $('.fb', w), bar = $('.lp-bar i', w), cb = $('.combo', w);
    $('.x', w).onclick = () => {
      if (!confirm('¿Salir? Vas a perder el progreso de esta lección.')) return;
      if (ev) { openLesson(null); track('lesson_quit', { ...ev, how: 'x', ms: Date.now() - t0, mistakes, ...where() }); flush(); }
      w.remove(); resolve(null);
    };
    let cur, answer, check;
    const where = () => ({ step, ex: cur?.t || null, done, total });
    const err = () => { if (ev) track('ex_error', { ...ev, ex: cur.t, step }); };
    const setReady = ok => btn.disabled = !ok;
    function next() {
      bar.style.width = Math.min(100, done / total * 100) + '%';
      foot.className = 'lp-foot'; fb.innerHTML = ''; btn.textContent = 'Comprobar'; setReady(false);
      cur = queue.shift();
      if (!cur) return finish();
      answer = null; check = null; step++;
      if (ev) openLesson({ ...ev, ms: Date.now() - t0, mistakes, ...where(), seen: Date.now() });
      render(cur);
    }
    function finish() {
      if (ev) { openLesson(null); track('lesson_end', { ...ev, ms: Date.now() - t0, mistakes, total, perfect: !mistakes, best }); flush(); }
      w.remove();
      resolve({ mistakes, best, total, perfect: !mistakes, missed });
    }
    const info = ['intro', 'vintro', 'note', 'read'];
    function render(e) {
      body.className = 'lp-body t-' + e.t;
      if (info.includes(e.t)) {
        if (e.t === 'intro') body.innerHTML = `<p class="lp-q">Nuevo carácter</p><button class="big-kana" id="sp">${e.c}</button><p class="rom">${romaji(e.c)}</p><p class="muted">Tocá para escuchar</p>`;
        else if (e.t === 'vintro') body.innerHTML = `<p class="lp-q">Nueva palabra</p><button class="big-word" id="sp">${e.jp}</button><p class="rom">${romaji(e.jp)}</p><p class="es-big">${e.es}</p>`;
        else if (e.t === 'read') body.innerHTML = `<p class="lp-q">Leé la historia</p>${storyHTML(e.st)}`;
        else body.innerHTML = `<div class="tipcard">知 ${e.html}</div>`;
        const sp = $('#sp', body); if (sp) { sp.onclick = () => speak(e.c || e.jp); speak(e.c || e.jp); }
        body.querySelectorAll('.sline').forEach(l => l.onclick = ev => { if (ev.target.closest('.say-l')) return; l.classList.toggle('open'); });
        body.querySelectorAll('[data-say]').forEach(b => b.onclick = () => speak(plainLine(e.st.lines[+b.dataset.say][0])));
        body.querySelectorAll('ruby.rk').forEach(r => r.onclick = ev => { ev.stopPropagation(); r.classList.toggle('show'); });
        btn.textContent = 'Continuar'; setReady(true); check = () => true; return;
      }
      if (e.t === 'match') return renderMatch(e);
      let q = '', opts = [], correct;
      if (e.t === 'k2r') { q = `<p class="lp-q">¿Cómo suena?</p><div class="big-kana">${e.c}</div>`; correct = romaji(e.c); opts = optsFrom(correct, e.pool.map(romaji)); }
      else if (e.t === 'r2k') { q = `<p class="lp-q">Elegí <b>${romaji(e.c)}</b></p>`; correct = e.c; opts = optsFrom(correct, e.pool); }
      else if (e.t === 'listen') { q = `<p class="lp-q">¿Qué escuchás?</p><button class="spk" id="sp" aria-label="Escuchar">${ic('sound')}</button>`; correct = e.c; opts = optsFrom(correct, e.pool); setTimeout(() => speak(e.c), 250); }
      else if (e.t === 'mean') { q = `<p class="lp-q">¿Qué significa?</p><button class="big-word" id="sp">${e.jp}</button>${helpOn() ? `<p class="rom">${romaji(e.jp)}</p>` : ''}`; correct = e.es; opts = optsFrom(correct, e.opts, 3); speak(e.jp); }
      else if (e.t === 'listenv') { q = `<p class="lp-q">Escuchá y elegí: <b>${e.es}</b></p><button class="spk" id="sp" aria-label="Escuchar">${ic('sound')}</button>`; correct = e.jp; opts = optsFrom(correct, e.opts, 3); setTimeout(() => speak(e.jp), 250); }
      else if (e.t === 'trans') { q = `<p class="lp-q">Traducí</p><button class="big-word sm" id="sp">${e.jp.replace(/ /g, '')}</button>${helpOn() ? `<p class="rom">${romaji(e.jp)}</p>` : ''}`; correct = e.es; opts = optsFrom(correct, e.opts, 3); speak(e.jp); }
      else if (e.t === 'blank') { q = `<p class="lp-q">Completá · <i>${e.es}</i></p><div class="big-word sm">${e.s.replace('_', '<span class="gap">？</span>').replace(/ /g, '')}</div>`; correct = e.a; opts = optsFrom(correct, ['は', 'を', 'に', 'で', 'の', 'か', 'が', 'います', 'あります'], 4); }
      else if (e.t === 'tense' || e.t === 'q') { q = `<p class="lp-q">${e.q}</p>`; correct = e.a; opts = shuffle([...new Set(e.opts)]); if (e.speak) setTimeout(() => speak(e.speak), 250); }
      else if (e.t === 'build') return renderBuild(e);
      body.innerHTML = `${q}<div class="lp-opts ${opts.some(o => o.length > 8) ? 'col' : ''}">${opts.map(o => `<button class="lo">${o}</button>`).join('')}</div>`;
      const sp = $('#sp', body); if (sp) sp.onclick = () => speak(e.c || e.jp || e.speak);
      body.querySelectorAll('.lo').forEach(b => b.onclick = () => {
        body.querySelectorAll('.lo').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); answer = b.textContent; setReady(true);
        if (/[぀-ヿ]/.test(answer) && answer.length < 12) speak(answer);
      });
      check = () => answer === correct; cur.correct = correct;
    }
    function optsFrom(correct, pool, n = 4) {
      const others = shuffle([...new Set(pool)].filter(x => x !== correct)).slice(0, n - 1);
      return shuffle([correct, ...others]);
    }
    function renderBuild(e) {
      const words = e.jp.split(' '), bank = shuffle([...words, ...shuffle(e.extra.filter(x => !words.includes(x))).slice(0, 3)]);
      body.innerHTML = `<p class="lp-q">Escribí en japonés</p><p class="es-big">${e.es}</p><div class="ans-row"></div><div class="bank">${bank.map((t, i) => `<button class="tk" data-i="${i}">${t}</button>`).join('')}</div>`;
      const row = $('.ans-row', body), sel = [];
      body.querySelectorAll('.tk').forEach(b => b.onclick = () => {
        if (b.parentNode === row) { row.removeChild(b); $('.bank', body).append(b); sel.splice(sel.indexOf(b), 1); }
        else { row.append(b); sel.push(b); speak(b.textContent); }
        setReady(sel.length > 0);
      });
      check = () => sel.map(b => b.textContent).join(' ') === e.jp; cur.correct = e.jp.replace(/ /g, '');
    }
    function renderMatch(e) {
      const L2 = shuffle(e.pairs.map(p => p[0])), R2 = shuffle(e.pairs.map(p => p[1]));
      body.innerHTML = `<p class="lp-q">Uní los pares</p><div class="match"><div>${L2.map(x => `<button class="mt" data-s="l">${x}</button>`).join('')}</div><div>${R2.map(x => `<button class="mt" data-s="r">${x}</button>`).join('')}</div></div>`;
      let a = null, left = e.pairs.length, errs = 0;
      body.querySelectorAll('.mt').forEach(b => b.onclick = () => {
        if (b.disabled) return;
        if (b.dataset.s === 'l' && /[぀-ヿ]/.test(b.textContent)) speak(b.textContent);
        if (!a || a.dataset.s === b.dataset.s) { a?.classList.remove('sel'); a = b; b.classList.add('sel'); return; }
        const [l, r] = a.dataset.s === 'l' ? [a, b] : [b, a];
        if (e.pairs.some(p => p[0] === l.textContent && p[1] === r.textContent)) {
          [l, r].forEach(x => { x.disabled = true; x.classList.add('ok'); x.classList.remove('sel'); }); navigator.vibrate?.(8);
          if (!--left) { done++; combo += errs ? 0 : 1; best = Math.max(best, combo); mistakes += errs; showCombo(); setTimeout(next, 450); }
        } else { errs++; err(); [l, r].forEach(x => { x.classList.add('bad'); setTimeout(() => x.classList.remove('bad', 'sel'), 400); }); navigator.vibrate?.(40); }
        a = null;
      });
    }
    function showCombo() { cb.textContent = combo >= 3 ? `炎 ${combo}` : ''; cb.classList.toggle('hot', combo >= 5); }
    btn.onclick = () => {
      if (btn.textContent === 'Continuar') return next();
      if (!check) return;
      const ok = check();
      if (info.includes(cur.t)) return next();
      if (ok) { done++; combo++; best = Math.max(best, combo); foot.className = 'lp-foot good'; fb.innerHTML = `<b>${pick(['¡Excelente!', '¡Bien!', '¡Correcto!', '¡Perfecto!'])}</b>`; navigator.vibrate?.(10); }
      else {
        mistakes++; combo = 0; err(); foot.className = 'lp-foot bad'; if (cur.key) missed.add(cur.key);
        fb.innerHTML = `<b>Respuesta correcta:</b><span class="jp">${cur.correct}</span>${cur.t === 'k2r' || cur.t === 'r2k' || cur.t === 'listen' ? `<small>${cur.c} = ${romaji(cur.c)}</small>` : ''}${aiOn() ? '<button class="why">？ ¿Por qué?</button>' : ''}`;
        const why = fb.querySelector('.why'), given = answer || '(armado)', qtext = body.querySelector('.lp-q')?.textContent + ' ' + (cur.jp || cur.c || cur.s || cur.q || '');
        if (why) why.onclick = async () => { why.disabled = true; why.textContent = 'Pensando…'; try { why.outerHTML = `<p class="ai-exp">✦ ${(await explain(qtext, given, cur.correct)).replace(/</g, '&lt;')}</p>`; } catch (e) { why.textContent = e.message; } };
        if (retries < 6) { queue.push({ ...cur }); retries++; }
        navigator.vibrate?.(40);
      }
      showCombo(); btn.textContent = 'Continuar';
    };
    next();
  });
}

// ---------- Repaso espaciado de la Academia ----------
function learnItems(L) {
  const a = A(), add = key => a.srs[key] ??= { box: 0, due: Date.now() + SRS_HOURS[1] * 36e5 };
  if (L.type === 'kana') { chars(L).forEach(c => add('k:' + c)); L.words.forEach(([jp, es]) => add(`v:${jp}|${es}`)); }
  if (L.type === 'phrase') L.vocab.forEach(([jp, es]) => add(`v:${jp}|${es}`));
}
function reviewQueue() {
  const a = A(), due = Object.keys(a.srs).filter(k => a.srs[k].due <= Date.now()).slice(0, 12);
  const allK = Object.keys(a.srs).filter(k => k[0] === 'k').map(k => k.slice(2));
  const allV = Object.keys(a.srs).filter(k => k[0] === 'v').map(k => k.slice(2).split('|'));
  return due.map(key => key[0] === 'k'
    ? { ...pick([{ t: 'k2r' }, { t: 'r2k' }, { t: 'listen' }]), c: key.slice(2), pool: allK, key }
    : (([jp, es]) => ({ t: 'mean', jp, es, opts: allV.map(v => v[1]), key }))(key.slice(2).split('|')));
}

// Repaso de kana y vocabulario: se usa dentro del repaso del día del Dojo
export async function reviewAcademy(ctx) {
  const a = A(), q = reviewQueue(); if (!q.length) return null;
  const keys = q.map(e => e.key);
  const res = await runLesson({ type: 'custom' }, document.body, q);
  if (!res) return null;
  keys.forEach(k => { const r = a.srs[k], ok = !res.missed.has(k); r.box = ok ? Math.min(SRS_HOURS.length - 1, r.box + 1) : Math.max(0, r.box - 1); r.due = Date.now() + SRS_HOURS[Math.max(1, r.box)] * 36e5; });
  const xp = 10 + (res.perfect ? 5 : 0); a.xp += xp; a.day.xp += xp; S.ink += xp * 2; ctx.addXP(xp); save();
  return { right: keys.length - res.missed.size, total: keys.length, ink: xp * 2 };
}

// ---------- Pantalla de la Academia ----------
export function openAcademy(ctx) {
  const a = A();
  const v = document.createElement('div'); v.className = 'acad-v';
  const render = () => {
    const due = acadDue();
    let firstOpen = true;
    v.innerHTML = `<div class="av-head"><button class="x">✕</button><b>学 Academia</b>
      <div class="goal-ring" style="--p:${Math.min(1, a.day.xp / DAILY_GOAL)}"><span>${a.day.xp}<small>/${DAILY_GOAL}</small></span></div></div>
      <div class="av-body">${UNITS.map((u, ui) => {
        const n = u.lessons.filter(l => crowns(l.id)).length;
        return `<section class="unit" style="--uc:${u.color}"><header><small>Unidad ${ui + 1}</small><b>${u.name}</b><span>${n}/${u.lessons.length}${a.units.includes(u.id) ? ' ✓' : ` · premio ${u.reward.tickets} 札`}</span></header>
        <div class="path">${u.lessons.map((l0, i) => { const l = byId(l0.id);
          const on = unlocked(l), c = crowns(l.id), st = l.type === 'story' ? STORIES[l.story] : null, ready = !st || storyReady(st);
          const isCur = on && !c && firstOpen && ready; if (isCur) firstOpen = false;
          const icon = l.type === 'kana' ? chars(l)[0] : l.type === 'piece' ? l.piece : { tip: '知', phrase: '語', tense: '時', review: '↻', story: '読' }[l.type];
          return `<div class="pnode" style="--off:${[0, 1, 2, 1, 0, -1, -2, -1][i % 8]}"><button class="node ${c ? 'done' : ''} ${on && ready ? '' : 'lock'} ${isCur ? 'cur' : ''}" data-l="${l.id}">${on && ready ? icon : '封'}${c ? `<i class="cr">${'冠'.repeat(c)}</i>` : ''}</button>${isCur ? '<span class="start">EMPEZAR</span>' : ''}<small>${l.name}</small></div>`;
        }).join('')}</div></section>`;
      }).join('')}</div>
      <div class="av-foot"><div class="row2"><button class="btn gold" id="aiStory">${ic('sparkles')} Cuento con tus KANJŪ</button><button class="btn ghost" id="lib">本 ${(S.library || []).length}</button></div>
      <button class="btn ${due + ctx.kanjiDue() ? 'ok' : 'ghost'} wide" id="rev" ${due + ctx.kanjiDue() ? '' : 'disabled'}>修 Repaso del día ${due + ctx.kanjiDue() ? `· ${due + ctx.kanjiDue()} listos` : '· al día ✓'}</button></div>`;
    $('.x', v).onclick = () => { v.remove(); ctx.hud(); };
    v.querySelectorAll('[data-l]').forEach(b => b.onclick = () => openNode(byId(b.dataset.l)));
    $('#rev', v).onclick = doReview;
    $('#aiStory', v).onclick = () => aiOn() ? pickTheme() : openAISettings(ctx.modal, ctx.toast, render);
    $('#lib', v).onclick = openLibrary;
    $('.cur', v)?.scrollIntoView({ block: 'center' });
  };
  function openNode(L) {
    const st = L.type === 'story' ? STORIES[L.story] : null;
    if (!unlocked(L)) return ctx.toast('Completá la lección anterior para desbloquear esta');
    if (st && !storyReady(st)) return ctx.toast(`Para leer esta historia conseguí al menos la mitad de: ${st.kanji.join(' ')}`);
    start(L);
  }
  async function start(L) {
    const res = await runLesson(L, document.body);
    if (!res) return;
    const first = !crowns(L.id);
    let pieceMsg = '';
    if (first && L.type === 'piece') { S.pieces ??= {}; S.pieces[L.piece] = (S.pieces[L.piece] || 0) + 1; pieceMsg = `<p class="g">部品 Ganaste la pieza ${L.piece}: equipala desde la ficha de una criatura</p>`; }
    a.done[L.id] = Math.min(3, crowns(L.id) + 1);
    const xp = (L.type === 'tip' ? 5 : 10) + (res.perfect ? 5 : 0) + Math.min(5, res.best >> 1);
    a.xp += xp; a.day.xp += xp; learnItems(L);
    const ink = xp * 2; S.ink += ink; ctx.bump('acad'); emit('lesson'); const ups = ctx.addXP(xp);
    let unitMsg = '';
    const u = L.unit;
    if (!a.units.includes(u.id) && u.lessons.every(l => crowns(l.id))) { a.units.push(u.id); S.tickets += u.reward.tickets; unitMsg = `<p class="g">祝 ¡Unidad completada! +${u.reward.tickets} 札 para el altar</p>`; }
    const goalHit = a.day.xp >= DAILY_GOAL && a.day.xp - xp < DAILY_GOAL;
    if (goalHit) S.ink += 30;
    save();
    const m = ctx.modal(`<div class="result"><h3>${res.perfect ? '¡Lección perfecta!' : '¡Lección completada!'}</h3>
      <div class="lr-stats"><div><b>+${xp}</b><small>XP</small></div><div><b>${Math.round((1 - res.mistakes / Math.max(res.total, res.mistakes + 1)) * 100)}%</b><small>precisión</small></div><div><b>${res.best}</b><small>mejor racha</small></div></div>
      <p><b>+${ink} 墨</b>${first ? '' : ` · 冠 ${crowns(L.id)}/3`}</p>${pieceMsg}${unitMsg}${goalHit ? '<p class="g">的 ¡Meta diaria cumplida! +30 墨</p>' : ''}
      <button class="btn ok wide">Continuar</button></div>`);
    $('.btn', m).onclick = () => { m.close(); render(); if (ups.length) ctx.rankUp(ups); };
  }
  // El repaso es uno solo para todo el juego: el Dojo
  async function doReview() { v.remove(); await ctx.openDojo(); }
  // ---- Cuentos con IA ----
  const THEMES = ['una aventura en el bosque', 'la comida', 'una noche de estrellas', 'la amistad', 'un día de lluvia', 'un viaje', 'una fiesta', 'un misterio'];
  function pickTheme() {
    const t = [...THEMES].sort(() => Math.random() - .5).slice(0, 4);
    const m = ctx.modal(`<h3>${ic('sparkles')} ¿De qué trata el cuento?</h3><p class="muted">Lo escribe tu IA con tus ${Object.values(S.dex).filter(d => d.owned).length} kanji, tus palabras aprendidas y tu gramática. Protagonistas: tus KANJŪ.</p>
      <div class="themes">${t.map(x => `<button class="btn ghost" data-t="${x}">${x}</button>`).join('')}<button class="btn ghost" data-t="">運 Sorpresa</button></div>
      <button class="link" id="aiCfg">設 Configurar mi IA</button>`);
    m.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { m.close(); makeStory(b.dataset.t); });
    m.querySelector('#aiCfg').onclick = () => { m.close(); openAISettings(ctx.modal, ctx.toast, render); };
  }
  async function makeStory(theme) {
    const wait = ctx.modal(`<div class="result"><div class="quill">筆</div><h3>Tu IA está escribiendo…</h3><p class="muted">Usando solo los kanji que ya tenés</p></div>`);
    wait.onclick = null;
    let st;
    try { st = await genStory(theme); } catch (e) { wait.close(); return ctx.toast(e.message); }
    wait.close();
    S.library = [{ ...st, date: Date.now(), cast: [] }, ...(S.library || [])].slice(0, 30); save();
    readStory(st, true);
  }
  async function readStory(st, fresh) {
    const story = { kanji: [], lines: st.lines.map(l => [l.jp, l.es]) };
    const q = [{ t: 'read', st: story }, ...(st.new_words || []).map(w => ({ t: 'vintro', jp: w.jp, es: w.es })), ...st.questions.map(x => ({ t: 'q', q: x.q, a: x.a, opts: [x.a, ...x.wrong] }))];
    const res = await runLesson({ type: 'custom' }, document.body, q);
    if (!res) return;
    const used = new Set(st.lines.flatMap(l => l.jp.match(/[\u3400-\u9fff]/g) || []));
    S.creatures.filter(c => used.has(c.k) && !c.egg).forEach(c => ctx.giveExp(c, 10));
    (st.new_words || []).forEach(w => a.srs[`v:${w.jp}|${w.es}`] ??= { box: 0, due: Date.now() + SRS_HOURS[1] * 36e5 });
    const xp = fresh ? 15 + (res.perfect ? 5 : 0) : 5, ink = fresh ? 30 : 5;
    a.xp += xp; a.day.xp += xp; S.ink += ink; ctx.bump('acad'); const ups = ctx.addXP(xp); save();
    ctx.toast(`書 ${st.title} · +${xp} XP · +${ink} 墨${used.size ? ` · ${[...used].filter(k => S.creatures.some(c => c.k === k)).join('')} ganaron EXP` : ''}`);
    if (ups.length) ctx.rankUp(ups);
    render();
  }
  function openLibrary() {
    const L = S.library || [];
    const m = ctx.modal(`<h3>${ic('book')} Tu biblioteca</h3>${L.length ? L.map((st, i) => `<button class="lesson" data-b="${i}"><i>読</i><div><b>${st.title}</b><small>${new Date(st.date).toLocaleDateString()} · ${st.lines.length} oraciones</small></div></button>`).join('') : '<p class="muted">Todavía no hay cuentos. Creá uno con ✦.</p>'}`);
    m.querySelectorAll('[data-b]').forEach(b => b.onclick = () => { m.close(); readStory(L[+b.dataset.b], false); });
  }
  render(); document.body.append(v);
}
