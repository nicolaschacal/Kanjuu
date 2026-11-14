import { KANJI, WORDS, PIECES, isPiece, reads, plain } from './data.js';
import { ic } from './icons.js';
import { STROKES } from './strokes.js';
import { S } from './state.js';
import { rr, romaji, helpOn } from './help.js';
import { wordExercise } from './wordgames.js';

const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const pick = a => a[Math.floor(Math.random() * a.length)];
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };

export const GAMES = {
  trace: { name: 'Trazo', k: '書', desc: 'Escríbelo en el orden correcto' },
  bubbles: { name: 'Lecturas', k: '読', desc: 'Atrapa sus lecturas' },
  word: { name: 'Palabra', k: '語', desc: 'Completa la palabra' },
  parts: { name: 'Ensamblar', k: '組', desc: 'Construye el kanji con sus piezas' },
  listen: { name: 'Escuchar', k: '聴', desc: 'Escucha la lectura y elige el kanji' },
};
export const hasParts = k => !!KANJI[k].recipes;

// Voz japonesa del sistema (si no hay, se muestra la lectura escrita)
let jaVoice = null;
const pickVoice = () => jaVoice = speechSynthesis?.getVoices().find(v => v.lang?.startsWith('ja')) || null;
try { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; } catch {}
export const canSpeak = () => !!jaVoice;
export function speak(text) {
  try { const u = new SpeechSynthesisUtterance(plain(text)); u.lang = 'ja-JP'; if (jaVoice) u.voice = jaVoice; u.rate = .85; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch {}
}
// Tarjeta de historia mnemotécnica: se muestra al descubrir o al fallar
export function storyHTML(k) {
  const K = KANJI[k];
  return `<div class="story"><span class="story-k">${k}</span><div><b>${K.m}</b><small>${reads(k).map(r => okuHTML(rr(r))).join('・') || '—'}</small>
    ${K.recipes ? `<div class="story-parts">${K.recipes[0].map(p => `<span class="${isPiece(p) ? 'pc' : ''}">${p}<i>${(KANJI[p] || PIECES[p]).m}</i></span>`).join('<em>+</em>')}</div>` : ''}
    <p>知 ${K.mn}</p>${S.notes?.[k] ? `<p class="mine">筆 ${S.notes[k].replace(/</g, '&lt;')}</p>` : ''}</div></div>`;
}
// Lecturas que se piden: la principal hasta maestría 3, después todas
export const learnReads = k => (S.srs[k]?.box || 0) >= 3 ? reads(k) : reads(k).slice(0, 1);
// やす(む) → やす + む atenuado (okurigana)
export const okuHTML = html => html.replace(/\((.+?)\)/, '<i class="oku">$1</i>');
export const hasWord = k => WORDS.some(w => w[0].includes(k));

export function play(type, k, know, root) {
  return new Promise(done => {
    const wrap = h(`<div class="game"><div class="game-head"><span class="chip">${GAMES[type].k} ${GAMES[type].name}</span><button class="x">✕</button></div><div class="game-body"></div></div>`);
    root.append(wrap);
    const body = wrap.querySelector('.game-body');
    const end = stars => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); done(stars); };
    wrap.querySelector('.x').onclick = () => end(-1);
    ({ trace, bubbles, word, parts, listen })[type](k, know, body, end);
  });
}

// Trazo con orden real (KanjiVG): demostración animada y evaluación trazo por trazo
function trace(k, know, body, end) {
  const strokes = STROKES[k];
  if (!strokes?.length) return end(-1);
  const NS = 'http://www.w3.org/2000/svg';
  body.innerHTML = `<p class="hint">Escribe <b>${k}</b> · ${KANJI[k].m} <span class="sc">Trazo <b>1</b>/${strokes.length}</span></p>
    <svg class="pad stroke-pad" viewBox="0 0 109 109"><g class="grid-l"><line x1="54.5" y1="0" x2="54.5" y2="109"/><line x1="0" y1="54.5" x2="109" y2="54.5"/></g>
    <g class="guide">${know < 3 ? strokes.map(d => `<path d="${d}"/>`).join('') : ''}</g><g class="done"></g><g class="hintg"></g><path class="ink" d=""/></svg>
    <div class="row"><button class="btn ghost demo">▶ Ver orden</button></div>`;
  const svg = body.querySelector('svg'), done = svg.querySelector('.done'), hintg = svg.querySelector('.hintg'), ink = svg.querySelector('.ink'), sc = body.querySelector('.sc b');
  const measure = document.createElementNS(NS, 'path'); svg.append(measure); measure.style.display = 'none';
  let i = 0, mistakes = 0, tries = 0, pts = [], drawing = false, busy = false;
  const sample = (d, n = 12) => { measure.setAttribute('d', d); const L = measure.getTotalLength(); return Array.from({ length: n }, (_, j) => { const p = measure.getPointAtLength(L * j / (n - 1)); return [p.x, p.y]; }); };
  const resample = (p, n = 12) => {
    const seg = [0]; for (let j = 1; j < p.length; j++) seg.push(seg[j - 1] + Math.hypot(p[j][0] - p[j - 1][0], p[j][1] - p[j - 1][1]));
    const L = seg[seg.length - 1] || 1;
    return Array.from({ length: n }, (_, j) => { const t = L * j / (n - 1); let a = seg.findIndex(s => s >= t - 1e-9); if (a < 0) return p[p.length - 1]; if (a === 0) return p[0]; const f = (t - seg[a - 1]) / (seg[a] - seg[a - 1] || 1); return [p[a - 1][0] + (p[a][0] - p[a - 1][0]) * f, p[a - 1][1] + (p[a][1] - p[a - 1][1]) * f]; });
  };
  const animate = (d, cls, ms = 600) => new Promise(r => {
    const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); p.setAttribute('class', cls); hintg.append(p);
    const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    p.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: ms, fill: 'forwards', easing: 'ease-in-out' }).onfinish = () => r(p);
  });
  const startDot = () => {
    hintg.querySelectorAll('.sd').forEach(x => x.remove());
    if (know >= 2 || i >= strokes.length) return;
    const [x, y] = sample(strokes[i], 2)[0], c = document.createElementNS(NS, 'g'); c.setAttribute('class', 'sd');
    c.innerHTML = `<circle cx="${x}" cy="${y}" r="4.5"/><text x="${x}" y="${y + 1.6}">${i + 1}</text>`; hintg.append(c);
  };
  async function demo() {
    if (busy) return; busy = true; hintg.innerHTML = '';
    for (let j = i; j < strokes.length; j++) await animate(strokes[j], 'demo', 450);
    setTimeout(() => { hintg.innerHTML = ''; startDot(); busy = false; }, 500);
  }
  const pos = e => { const r = svg.getBoundingClientRect(); return [(e.clientX - r.left) * 109 / r.width, (e.clientY - r.top) * 109 / r.height]; };
  svg.onpointerdown = e => { if (busy || i >= strokes.length) return; drawing = true; pts = [pos(e)]; svg.setPointerCapture(e.pointerId); };
  svg.onpointermove = e => { if (!drawing) return; pts.push(pos(e)); ink.setAttribute('d', 'M' + pts.map(p => p.join(' ')).join(' L')); };
  svg.onpointerup = async () => {
    if (!drawing) return; drawing = false;
    const exp = sample(strokes[i]), got = resample(pts.length > 1 ? pts : [pts[0], pts[0]]);
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const avg = exp.reduce((s, p, j) => s + dist(p, got[j]), 0) / exp.length;
    const ok = dist(exp[0], got[0]) < 22 && dist(exp[exp.length - 1], got[got.length - 1]) < 22 && avg < 15;
    ink.setAttribute('d', '');
    if (ok) {
      const p = document.createElementNS(NS, 'path'); p.setAttribute('d', strokes[i]); done.append(p); navigator.vibrate?.(8);
      i++; tries = 0; hintg.innerHTML = '';
    } else {
      mistakes++; tries++; navigator.vibrate?.(40); busy = true;
      svg.classList.add('shake-s'); setTimeout(() => svg.classList.remove('shake-s'), 300);
      await animate(strokes[i], 'hint', 500); await new Promise(r => setTimeout(r, 350)); hintg.innerHTML = ''; busy = false;
      if (tries >= 3) { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', strokes[i]); p.setAttribute('class', 'auto'); done.append(p); i++; tries = 0; }
    }
    sc.textContent = Math.min(i + 1, strokes.length);
    if (i >= strokes.length) { svg.classList.add('complete'); return setTimeout(() => end(mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1), 700); }
    startDot();
  };
  body.querySelector('.demo').onclick = demo;
  if (know < 1) demo(); else startDot();
}

function bubbles(k, know, body, end) {
  const good = learnReads(k);
  const others = shuffle(Object.keys(KANJI).filter(x => x !== k).flatMap(x => reads(x)).filter(r => !reads(k).includes(r)));
  const pool = shuffle([...good, ...good, ...others.slice(0, 4 + know * 2)]);
  const total = good.length * 2, time = Math.max(7, 12 - know);
  body.innerHTML = `<p class="hint">Toca las lecturas de <b class="big">${k}</b></p><div class="pond"></div><div class="timer"><i></i></div>`;
  const pond = body.querySelector('.pond'), bar = body.querySelector('.timer i');
  let score = 0, caught = 0, over = false;
  pool.forEach((r, i) => {
    const b = h(`<button class="bubble" style="left:${8 + Math.random() * 70}%;animation-duration:${time * .7 + Math.random() * 3}s;animation-delay:${-Math.random() * time * .6}s">${r}${helpOn() && know < 3 ? `<i class="rmj">${romaji(r)}</i>` : ''}</button>`);
    b.onclick = () => {
      if (over || b.disabled) return; b.disabled = true;
      if (good.includes(r)) { score++; caught++; b.classList.add('pop'); navigator.vibrate?.(8); } else { score--; b.classList.add('bad'); }
      if (caught >= total) finish();
    };
    pond.append(b);
  });
  bar.style.transitionDuration = time + 's'; requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = '0%'));
  const t = setTimeout(finish, time * 1000);
  function finish() { if (over) return; over = true; clearTimeout(t); const r = score / total; setTimeout(() => end(r >= .9 ? 3 : r >= .5 ? 2 : r > 0 ? 1 : 0), 300); }
}

function word(k, know, body, end) {
  const w = pick(WORDS.filter(x => x[0].includes(k)));
  const known = Object.keys(S.dex).filter(x => x !== k);
  const opts = shuffle([k, ...shuffle(known.length >= 3 ? known : Object.keys(KANJI).filter(x => x !== k)).slice(0, 3)]);
  const masked = w[0].replace(k, '<span class="blank">？</span>');
  body.innerHTML = `<p class="hint">Completa la palabra</p><div class="word">${masked}</div>
    <p class="reading">${know < 3 ? w[1] + ' · ' : ''}${w[2]}</p><div class="opts">${opts.map(o => `<button class="opt">${o}</button>`).join('')}</div>`;
  let tries = 0;
  body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if (b.textContent === k) {
      b.classList.add('right'); body.querySelector('.word').innerHTML = w[0];
      body.querySelector('.reading').textContent = `${w[1]} · ${w[2]}`;
      setTimeout(() => end(tries ? 1 : 3), 900);
    } else { tries++; b.classList.add('wrong'); b.disabled = true; }
  });
}

function parts(k, know, body, end) {
  const rec = KANJI[k].recipes[0];
  const fundamentals = Object.keys(KANJI).filter(x => !rec.includes(x));
  const tiles = shuffle([...rec, ...shuffle(fundamentals).slice(0, 3 + Math.min(3, know))]);
  let picked = [], mistakes = 0;
  body.innerHTML = `<p class="hint">Construye el kanji de <b>«${KANJI[k].m}»</b></p>
    <div class="target ${know < 2 ? 'peek' : ''}">${know < 2 ? k : '？'}</div>
    <div class="slots-row">${rec.map(() => '<span class="pslot"></span>').join('<em>+</em>')}</div>
    <div class="tiles">${tiles.map((t, i) => `<button class="tile" data-i="${i}">${t}<small>${(KANJI[t] || PIECES[t]).m}</small></button>`).join('')}</div>`;
  const slots = body.querySelectorAll('.pslot');
  body.querySelectorAll('.tile').forEach(b => b.onclick = () => {
    const t = tiles[b.dataset.i], need = [...rec];
    picked.forEach(p => need.splice(need.indexOf(p), 1));
    if (need.includes(t)) {
      slots[picked.length].textContent = t; slots[picked.length].classList.add('in');
      picked.push(t); b.disabled = true; b.classList.add('right'); navigator.vibrate?.(8);
      if (picked.length === rec.length) {
        const tg = body.querySelector('.target'); tg.textContent = k; tg.classList.add('done');
        setTimeout(() => end(mistakes ? mistakes > 1 ? 1 : 2 : 3), 900);
      }
    } else { mistakes++; b.classList.add('wrong'); b.disabled = true; }
  });
}

function listen(k, know, body, end) {
  const r = pick(learnReads(k)), opts = shuffle([k, ...shuffle(Object.keys(S.dex).filter(x => x !== k && !reads(x).includes(r))).slice(0, 3)]);
  while (opts.length < 4) { const x = pick(Object.keys(KANJI)); if (!opts.includes(x) && !reads(x).includes(r)) opts.push(x); }
  const show = !canSpeak() || know < 1;
  body.innerHTML = `<p class="hint">¿Qué kanji se lee así?</p><button class="speaker" aria-label="Escuchar">${ic('sound')}<span>${show ? rr(r) : ''}</span></button>
    <div class="opts">${opts.map(o => `<button class="opt">${o}</button>`).join('')}</div>`;
  const say = () => speak(r); say();
  body.querySelector('.speaker').onclick = () => { say(); body.querySelector('.speaker span').textContent = r; };
  let tries = 0;
  body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
    if (b.textContent === k) { b.classList.add('right'); setTimeout(() => end(tries ? 1 : 3), 700); }
    else { tries++; b.classList.add('wrong'); b.disabled = true; }
  });
}

// --- Dojo de repaso: recuperación activa + repetición espaciada + intercalado ---
// list mezcla kanji ('木') y palabras del diario ({ w: id }); onGrade(clave, acierto, esPalabra)
export function review(list, root, onGrade) {
  return new Promise(done => {
    const queue = list.map(k => typeof k === 'string' ? { k, retry: false } : { w: k.w, retry: false }), res = { right: 0, wrong: 0, total: list.length };
    const wrap = h(`<div class="game"><div class="game-head"><span class="chip">修 Dojo</span><div class="prog"><i></i></div><button class="x">✕</button></div><div class="game-body"></div></div>`);
    root.append(wrap);
    const body = wrap.querySelector('.game-body'), bar = wrap.querySelector('.prog i');
    const finish = () => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); done(res); };
    wrap.querySelector('.x').onclick = finish;
    const all = Object.keys(KANJI);
    function next() {
      bar.style.width = (res.right + res.wrong) / Math.max(1, res.total) * 100 + '%';
      const item = queue.shift(); if (!item) return finish();
      // Palabras: ejercicios escalonados por caja (js/wordgames.js)
      if (item.w) return wordExercise(item.w, body, ok => {
        if (!item.retry) { ok ? res.right++ : res.wrong++; onGrade(item.w, ok, true); if (!ok) queue.push({ w: item.w, retry: true }); }
        next();
      });
      const { k } = item, box = S.srs[k]?.box || 0, K = KANJI[k];
      const types = box < 2 ? ['k2m', 'k2m', 'listen'] : box < 4 ? ['m2k', 'listen', 'k2r'] : ['k2r', 'm2k', 'parts'];
      let type = pick(types); if (type === 'parts' && !K.recipes) type = 'k2r';
      const others = shuffle(all.filter(x => x !== k)).slice(0, 3);
      let q, opts, correct;
      if (type === 'k2m') { q = `<div class="qk">${k}</div><p class="hint">¿Qué significa?</p>`; opts = shuffle([K.m, ...others.map(o => KANJI[o].m)]); correct = K.m; }
      else if (type === 'm2k' || type === 'parts') { q = `<p class="hint">¿Cuál es el kanji de</p><div class="qm">«${K.m}»</div>${type === 'parts' ? `<p class="muted">Pista: ${K.recipes[0].join(' + ')}</p>` : ''}`; opts = shuffle([k, ...others]); correct = k; }
      else if (type === 'listen') { const r = pick(learnReads(k)); q = `<button class="speaker" aria-label="Escuchar">${ic('sound')}<span>${canSpeak() ? '' : r}</span></button><p class="hint">¿Qué kanji se lee así?</p>`; opts = shuffle([k, ...others.filter(o => !reads(o).includes(r))]); correct = k; setTimeout(() => speak(r), 200); body.dataset.r = r; }
      else { const r = pick(learnReads(k)); const pool = shuffle(all.flatMap(reads).filter(x => !reads(k).includes(x))); q = `<div class="qk">${k}</div><p class="hint">¿Cómo se lee?</p>`; opts = shuffle([r, ...[...new Set(pool)].slice(0, 3)]); correct = r; }
      body.innerHTML = `${q}<div class="opts ${type === 'k2m' || type === 'k2r' ? 'txt' : ''}">${opts.map(o => `<button class="opt">${o}</button>`).join('')}</div>`;
      const sp = body.querySelector('.speaker'); if (sp) sp.onclick = () => { speak(body.dataset.r); sp.querySelector('span').textContent = body.dataset.r; };
      body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
        body.querySelectorAll('.opt').forEach(x => x.disabled = true);
        if (b.textContent === correct) {
          b.classList.add('right'); navigator.vibrate?.(8);
          if (!item.retry) { res.right++; onGrade(k, true); }
          speak(reads(k)[0] || '');
          setTimeout(next, 650);
        } else {
          b.classList.add('wrong'); [...body.querySelectorAll('.opt')].find(x => x.textContent === correct)?.classList.add('right');
          if (!item.retry) { res.wrong++; onGrade(k, false); queue.push({ k, retry: true }); }
          setTimeout(() => {
            body.innerHTML = `<p class="hint">Recuérdalo así</p>${storyHTML(k)}<button class="btn ok wide">Entendido</button>`;
            body.querySelector('.btn').onclick = next;
          }, 700);
        }
      });
    }
    next();
  });
}
