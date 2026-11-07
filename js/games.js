import { KANJI, WORDS } from './data.js';
import { S } from './state.js';

const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const pick = a => a[Math.floor(Math.random() * a.length)];
const h = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };

export const GAMES = {
  trace: { name: 'Trazo', k: '書', desc: 'Dibujá el kanji con el dedo' },
  bubbles: { name: 'Lecturas', k: '読', desc: 'Atrapá sus lecturas' },
  word: { name: 'Palabra', k: '語', desc: 'Completá la palabra' },
};
export const hasWord = k => WORDS.some(w => w[0].includes(k));

export function play(type, k, know, root) {
  return new Promise(done => {
    const wrap = h(`<div class="game"><div class="game-head"><span class="chip">${GAMES[type].k} ${GAMES[type].name}</span><button class="x">✕</button></div><div class="game-body"></div></div>`);
    root.append(wrap);
    const body = wrap.querySelector('.game-body');
    const end = stars => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); done(stars); };
    wrap.querySelector('.x').onclick = () => end(-1);
    ({ trace, bubbles, word })[type](k, know, body, end);
  });
}

function trace(k, know, body, end) {
  const S2 = 300;
  body.innerHTML = `<p class="hint">Trazá <b>${k}</b> · ${KANJI[k].m}</p><canvas width="${S2}" height="${S2}" class="pad"></canvas><div class="row"><button class="btn ghost clr">Borrar</button><button class="btn ok">¡Listo!</button></div>`;
  const cv = body.querySelector('canvas'), cx = cv.getContext('2d');
  const font = `900 240px 'Zen Maru Gothic', sans-serif`;
  const mask = document.createElement('canvas'); mask.width = mask.height = S2;
  const mx = mask.getContext('2d'); mx.font = font; mx.textAlign = 'center'; mx.textBaseline = 'middle'; mx.fillText(k, S2 / 2, S2 / 2 + 10);
  const M = mx.getImageData(0, 0, S2, S2).data;
  const guide = () => {
    cx.clearRect(0, 0, S2, S2); cx.font = font; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.fillStyle = `rgba(60,40,30,${know >= 4 ? .06 : know >= 2 ? .14 : .25})`; cx.fillText(k, S2 / 2, S2 / 2 + 10);
  };
  guide();
  let drawing = false, ink = new Uint8Array(S2 * S2), last;
  const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * S2 / r.width, (e.clientY - r.top) * S2 / r.height]; };
  const stamp = ([x, y]) => { for (let dy = -9; dy <= 9; dy++) for (let dx = -9; dx <= 9; dx++) { const X = x + dx | 0, Y = y + dy | 0; if (dx * dx + dy * dy < 81 && X >= 0 && Y >= 0 && X < S2 && Y < S2) ink[Y * S2 + X] = 1; } };
  cv.onpointerdown = e => { drawing = true; last = pt(e); cv.setPointerCapture(e.pointerId); stamp(last); };
  cv.onpointermove = e => {
    if (!drawing) return; const p = pt(e);
    cx.strokeStyle = '#2b2018'; cx.lineWidth = 18; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(...last); cx.lineTo(...p); cx.stroke();
    const n = Math.ceil(Math.hypot(p[0] - last[0], p[1] - last[1]) / 4);
    for (let i = 1; i <= n; i++) stamp([last[0] + (p[0] - last[0]) * i / n, last[1] + (p[1] - last[1]) * i / n]);
    last = p;
  };
  cv.onpointerup = () => drawing = false;
  body.querySelector('.clr').onclick = () => { ink.fill(0); guide(); };
  body.querySelector('.ok').onclick = () => {
    let m = 0, hit = 0, drawn = 0;
    for (let i = 0; i < ink.length; i++) { const on = M[i * 4 + 3] > 80; if (on) m++; if (ink[i]) { drawn++; if (on) hit++; } }
    if (!drawn) return;
    const cover = hit / m, prec = hit / drawn, sc = Math.min(1, cover * 1.6) * Math.min(1, prec * 1.5);
    end(sc > .7 ? 3 : sc > .45 ? 2 : sc > .2 ? 1 : 0);
  };
}

function bubbles(k, know, body, end) {
  const good = [...KANJI[k].on, ...KANJI[k].kun];
  const others = shuffle(Object.keys(KANJI).filter(x => x !== k).flatMap(x => [...KANJI[x].on, ...KANJI[x].kun]).filter(r => !good.includes(r)));
  const pool = shuffle([...good, ...good, ...others.slice(0, 4 + know * 2)]);
  const total = good.length * 2, time = Math.max(7, 12 - know);
  body.innerHTML = `<p class="hint">Tocá las lecturas de <b class="big">${k}</b></p><div class="pond"></div><div class="timer"><i></i></div>`;
  const pond = body.querySelector('.pond'), bar = body.querySelector('.timer i');
  let score = 0, caught = 0, over = false;
  pool.forEach((r, i) => {
    const b = h(`<button class="bubble" style="left:${8 + Math.random() * 70}%;animation-duration:${time * .7 + Math.random() * 3}s;animation-delay:${-Math.random() * time * .6}s">${r}</button>`);
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
  body.innerHTML = `<p class="hint">Completá la palabra</p><div class="word">${masked}</div>
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
