import { KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, MAX_LV, reads } from './data.js';
import { creatureSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, used, freeSpace, recruit, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak } from './games.js';
import * as cloud from './cloud.js';

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const buzz = (n = 10) => navigator.vibrate?.(n);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const sorted = a => [...a].sort().join('');
const home = () => S.creatures.filter(c => !c.away);

const MISSIONS = [
  { id: 'pet', label: 'Mimá a tus KANJŪ', goal: 5, ink: 8 },
  { id: 'train', label: 'Completá entrenamientos', goal: 3, ink: 12 },
  { id: 'exp', label: 'Enviá una expedición', goal: 1, ink: 8 },
  { id: 'review', label: 'Repasá kanji en el Dojo', goal: 8, ink: 15 },
];
const WEEKLY = [
  { id: 'review', label: 'Repasá 50 kanji', goal: 50, ink: 60 },
  { id: 'disc', label: 'Descubrí 3 kanji nuevos', goal: 3, ink: 50 },
  { id: 'evo', label: 'Evolucioná o fusioná 3 veces', goal: 3, ink: 50 },
  { id: 'train', label: 'Entrená 20 veces', goal: 20, ink: 40 },
];
const ACHIEVEMENTS = [
  ['芽', 'Primer brote', () => S.stats.evolutions >= 1, 'Evoluciona una criatura', 20],
  ['合', 'Alquimista', () => S.stats.fusions >= 1, 'Realiza una fusión', 20],
  ['輪', 'Ciclo eterno', () => S.stats.rebirths >= 1, 'Completa un renacimiento', 40],
  ['集', 'Coleccionista', () => owned() >= 8, 'Obtén 8 kanji', 30],
  ['森', 'Guardián del bosque', () => S.dex['森']?.owned, 'Obtén 森', 30],
  ['学', 'Estudioso', () => Object.values(S.srs).filter(r => r.box >= 3).length >= 10, '10 kanji con maestría 3', 60],
  ['修', 'Disciplina', () => Object.values(S.srs).reduce((a, r) => a + r.ok, 0) >= 100, '100 repasos acertados', 60],
  ['広', 'Arquitecto', () => S.cap > 6, 'Amplía el santuario', 20],
  ['半', 'Medio atlas', () => owned() >= Object.keys(KANJI).length / 2, 'Llena la mitad del atlas', 100],
  ['全', 'Atlas completo', () => owned() >= Object.keys(KANJI).length, 'Llena todo el atlas', 300],
];
const owned = () => Object.values(S.dex).filter(d => d.owned).length;

let tab = 'home', labSel = [];

// ---------- Shell ----------
function shell() {
  app.innerHTML = `
  <header class="hud">
    <div class="pill ink">墨 <b id="ink">${S.ink}</b></div>
    <div class="title">KANJ<span>Ū</span></div>
    <div class="hud-r"><button class="pill quest" id="questBtn">任 <b id="questN"></b></button><button class="pill acct ${cloud.user ? 'in' : ''}" id="acctBtn" aria-label="Cuenta">我</button></div>
  </header>
  <main id="view"></main>
  <nav class="tabs">${[['home', '苑', 'Santuario'], ['lab', '錬', 'Fusión'], ['exp', '旅', 'Viajes'], ['shop', '店', 'Tienda'], ['dex', '図', 'Atlas']]
      .map(([id, k, l]) => `<button data-tab="${id}" class="${tab === id ? 'on' : ''}"><i>${k}</i><span>${l}</span></button>`).join('')}</nav>
  <div id="layer"></div>`;
  app.querySelectorAll('.tabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; buzz(5); go(); });
  $('#questBtn').onclick = openQuests;
  $('#acctBtn').onclick = openAccount;
  go();
}
function go() {
  app.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  const v = $('#view'); v.className = 'view v-' + tab;
  ({ home: viewHome, lab: viewLab, exp: viewExp, shop: viewShop, dex: viewDex })[tab](v);
  hud();
}
function hud() {
  $('#ink').textContent = S.ink;
  rollDaily();
  const ready = MISSIONS.filter(m => (S.daily.p[m.id] || 0) >= m.goal && !S.daily.claimed.includes(m.id)).length
    + WEEKLY.filter(m => (S.weekly.p[m.id] || 0) >= m.goal && !S.weekly.claimed.includes(m.id)).length;
  $('#questN').textContent = ready ? `${ready}!` : `${S.daily.claimed.length}/${MISSIONS.length}`;
  $('#questBtn').classList.toggle('glow', !!ready);
  const expDone = S.creatures.some(c => c.away && Date.now() >= c.away.end);
  app.querySelector('[data-tab=exp]')?.classList.toggle('dot', expDone);
  app.querySelector('[data-tab=dex]')?.classList.toggle('dot', ACHIEVEMENTS.some(a => a[2]() && !S.ach.includes(a[0])));
  save();
}
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = msg;
  document.body.append(t); setTimeout(() => t.remove(), 2400);
}
function modal(html, cls = '') {
  const m = document.createElement('div'); m.className = 'modal ' + cls;
  m.innerHTML = `<div class="sheet">${html}</div>`;
  m.onclick = e => { if (e.target === m) close(); };
  const close = () => { m.classList.add('out'); setTimeout(() => m.remove(), 220); };
  m.close = close; $('#layer').append(m); return m;
}
function floatText(el, txt, cls = '') {
  const r = el.getBoundingClientRect(), f = document.createElement('div');
  f.className = 'float ' + cls; f.textContent = txt;
  f.style.left = r.left + r.width / 2 + 'px'; f.style.top = r.top + 10 + 'px';
  document.body.append(f); setTimeout(() => f.remove(), 1000);
}

// ---------- Santuario ----------
let wanderT;
function viewHome(v) {
  const d = S.deco;
  v.innerHTML = `
  <div class="scene">
    <div class="sky"><div class="sun-disc"></div><div class="cloud c1"></div><div class="cloud c2"></div></div>
    <div class="hill h1"></div><div class="hill h2"></div>
    <div class="ground"></div>
    ${d.includes('gate') ? '<div class="deco torii"><i></i><b></b></div>' : ''}
    ${d.includes('pond') ? '<div class="deco koi"></div>' : ''}
    ${d.includes('lantern') ? '<div class="deco lantern"><i></i></div>' : ''}
    <div class="grass g1"></div><div class="grass g2"></div><div class="grass g3"></div>
    <div id="mons"></div>
    ${goalHTML()}
    <div class="space ${freeSpace() <= 0 ? 'full' : ''}" id="space">空 ${used()}/${S.cap}</div>
    ${S.gate.length ? `<button class="gate-note" id="gate">門 ${S.gate.length} esperando en la puerta</button>` : ''}
    ${S.creatures.some(c => c.away) ? `<div class="away-note">旅 ${S.creatures.filter(c => c.away).length} de viaje</div>` : ''}
    <button class="dojo-btn ${dueList().length ? 'due' : ''}" id="dojo"><i>修</i><span>Dojo</span>${dueList().length ? `<b>${dueList().length}</b>` : ''}</button>
  </div>`;
  const box = $('#mons', v);
  home().forEach((c, i) => {
    const el = document.createElement('button');
    el.className = 'mon' + (c.egg ? ' egg' : ''); el.dataset.id = c.id;
    el.style.setProperty('--d', 0.9 + depth(c.k) * .12);
    el.innerHTML = `<div class="flip">${creatureSVG(c.k, { mood: c.mood, egg: c.egg })}</div><div class="tag">${c.egg ? '¿?' : 'Lv' + c.lv}</div>`;
    place(el, 15 + (i * 23) % 70, 58 + (i * 13) % 24);
    el.onclick = () => tapMon(c, el);
    box.append(el);
  });
  $('#space', v).onclick = () => { tab = 'shop'; go(); };
  $('#dojo', v).onclick = openDojo;
  if (S.gate.length) $('#gate', v).onclick = openGate;
  clearInterval(wanderT);
  wanderT = setInterval(() => {
    if (tab !== 'home' || document.hidden) return;
    const els = [...box.children];
    els.forEach(el => { if (Math.random() < .45 && !el.classList.contains('egg')) wander(el); });
    if (els.length > 1 && Math.random() < .3) {
      const a = els[Math.random() * els.length | 0];
      emote(a, ['♪', '♥', '！', '…', 'ｚ', '✿'][Math.random() * 6 | 0]);
    }
  }, 2200);
}
function place(el, x, y) {
  el.style.left = x + '%'; el.style.top = y + '%'; el.style.zIndex = Math.round(y);
  el.dataset.x = x; el.dataset.y = y;
}
function wander(el) {
  const x = +el.dataset.x, nx = Math.max(8, Math.min(84, x + (Math.random() - .5) * 36));
  const ny = Math.max(55, Math.min(84, +el.dataset.y + (Math.random() - .5) * 14));
  el.querySelector('.flip').style.transform = `scaleX(${nx < x ? -1 : 1})`;
  el.classList.add('walk'); place(el, nx, ny);
  setTimeout(() => el.classList.remove('walk'), 1600);
}
function emote(el, e) {
  const b = document.createElement('div'); b.className = 'emote'; b.textContent = e;
  el.append(b); setTimeout(() => b.remove(), 1600);
}
function tapMon(c, el) {
  buzz(8); el.classList.remove('squish'); void el.offsetWidth; el.classList.add('squish');
  if (c.egg) {
    c.cracks = (c.cracks || 0) + 1;
    if (c.cracks >= 3) { delete c.egg; delete c.cracks; hatchFX(c, el); }
    else emote(el, '…'); save(); return;
  }
  setTimeout(() => openCreature(c.id), 160);
}
function hatchFX(c, el) {
  el.classList.add('hatch');
  setTimeout(() => { go(); toast(`<b>${c.k}</b> renació · Gen ${c.gen} <small>+${c.gen * 25}% EXP permanente</small>`); }, 600);
}

// Objetivo guiado: siempre hay un próximo paso claro
function goalHTML() {
  const cs = S.creatures.filter(c => !c.egg);
  let g;
  if (S.creatures.some(c => c.egg)) g = 'Tocá el huevo 3 veces para que nazca';
  else if (S.gate.length && freeSpace() >= size(S.gate[0])) g = 'Hay espacio: recibí al KANJŪ que espera en la puerta';
  else if (S.gate.length) g = 'Santuario lleno: ampliá en la tienda, fusioná o liberá';
  else if (dueList().length >= 3) g = `${dueList().length} kanji listos para repasar en el Dojo`;
  else if (S.creatures.some(c => c.away && Date.now() >= c.away.end)) g = 'Una criatura volvió de su expedición';
  else {
    const ready = cs.find(c => evolutionsOf(c.k).some(t => c.lv >= evoLevel(t)));
    const fuseOk = Object.keys(KANJI).find(t => !S.dex[t]?.owned && KANJI[t].recipes?.some(r => r.every(k => cs.filter(c => c.k === k && !c.away).length >= r.filter(x => x === k).length)));
    if (fuseOk) g = 'Tenés lo necesario para una fusión en 錬';
    else if (ready) g = `${ready.k} puede evolucionar · abrí su ficha`;
    else if (!S.creatures.some(c => c.away) && owned() < 3) g = 'Enviá una criatura de expedición para encontrar nuevos kanji';
    else { const c = cs.sort((a, b) => b.lv - a.lv)[0]; const t = c && evolutionsOf(c.k)[0]; g = t ? `Entrená a ${c.k} hasta Lv ${evoLevel(t)}` : 'Llevá una criatura a Lv MAX para renacer'; }
  }
  return `<div class="goal"><i>目標</i><span>${g}</span></div>`;
}

// ---------- Hoja de criatura ----------
function openCreature(id) {
  const c = byId(id); if (!c) return;
  const K = KANJI[c.k], [fill] = ELEMENTS[element(c.k)];
  const evos = evolutionsOf(c.k);
  const m = modal(`
    <div class="cr-top" style="--el:${fill}">
      <button class="cr-art" id="pet">${creatureSVG(c.k, { mood: c.mood })}</button>
      <div class="cr-name"><span class="big-k">${c.k}</span><div><b>${K.m}</b><small>${ELEMENTS[element(c.k)][2]} · Nivel KANJŪ ${kLevel(c.k)}${c.gen ? ` · Gen ${c.gen}` : ''}</small></div></div>
      <div class="reads"><button class="say" id="say">🔊</button><span>音 ${K.on.join('・') || '—'}</span><span>訓 ${K.kun.join('・') || '—'}</span><span class="mast" title="Maestría">熟 ${'★'.repeat(mastery(c.k))}${'☆'.repeat(Math.max(0, 6 - mastery(c.k)))}</span></div>
    </div>
    <div class="bars">
      <div class="bar"><label>Lv ${c.lv}${c.lv >= MAX_LV ? ' MAX' : ''}</label><div><i style="width:${c.exp / expNeed(c.lv) * 100}%"></i></div></div>
      <div class="bar bond"><label>絆 ${'♥'.repeat(Math.min(5, c.bond / 10 | 0))}${'♡'.repeat(5 - Math.min(5, c.bond / 10 | 0))}</label><div><i style="width:${c.mood * 100}%"></i></div></div>
    </div>
    <div class="acts a4">
      <button class="act" id="train"><i>練</i>Entrenar</button>
      <button class="act" id="snack" ${S.ink < 5 ? 'disabled' : ''}><i>餅</i>Mochi <small>5墨</small></button>
      <button class="act ${c.lv >= MAX_LV ? 'hot' : ''}" id="reborn" ${c.lv < MAX_LV ? 'disabled' : ''}><i>輪</i>Renacer</button>
      <button class="act" id="free" ${S.creatures.filter(x => !x.egg).length <= 1 ? 'disabled' : ''}><i>放</i>Liberar</button>
    </div>
    ${S.items.scroll ? `<button class="btn ghost wide" id="scroll">巻 Usar pergamino (+60 EXP) · ${S.items.scroll}</button>` : ''}
    <details class="story-d"><summary>💡 Historia para recordarlo</summary>${storyHTML(c.k)}
      <textarea id="note" maxlength="160" placeholder="Escribí tu propia historia: las que inventás vos se recuerdan mejor">${esc(S.notes?.[c.k] || '')}</textarea></details>
    <h4>進化 Evoluciones</h4>
    <div class="evos">${evos.length ? evos.map(t => evoCard(c, t)).join('') : '<p class="muted">Forma final en este santuario. Llegá a Lv MAX para renacer.</p>'}</div>
    ${K.recipes ? `<p class="muted">Composición: ${K.recipes.map(r => r.join(' + ')).join('  ·  ')}${K.note ? ` — ${K.note}` : ''}</p>` : ''}
    <p class="hist">${c.hist.join(' → ')}</p>`, 'cr');

  $('#pet', m).onclick = e => {
    c.mood = Math.min(1, c.mood + .12); c.bond++; bump('pet'); giveExp(c, 1);
    floatText(e.currentTarget, '♥', 'heart'); buzz(6);
    const a = $('#pet', m); a.classList.remove('squish'); void a.offsetWidth; a.classList.add('squish'); hud();
  };
  $('#snack', m).onclick = () => { S.ink -= 5; c.mood = 1; c.bond += 3; const up = giveExp(c, 8); m.close(); toast(`${c.k} disfrutó el mochi ${up ? '· ¡Subió de nivel!' : ''}`); go(); setTimeout(() => openCreature(id), 260); };
  $('#train', m).onclick = () => openTraining(c, m);
  $('#say', m).onclick = () => speak(reads(c.k)[0] || '');
  $('#note', m).onchange = e => { S.notes ??= {}; S.notes[c.k] = e.target.value.trim(); save(); toast('✍ Historia guardada'); };
  $('#free', m).onclick = () => {
    if (!confirm(`${c.k} volverá a la naturaleza y te dejará tinta. Su entrada en el atlas se conserva. ¿Liberar?`)) return;
    const ink = release(c); m.close(); go(); toast(`${c.k} se despidió · +${ink} 墨`); };
  if (S.items.scroll) $('#scroll', m).onclick = () => { S.items.scroll--; const up = giveExp(c, 60); m.close(); go(); toast(`${c.k} absorbió el pergamino${up ? ` · ¡Nivel ${c.lv}!` : ''}`); setTimeout(() => openCreature(id), 260); };
  $('#reborn', m).onclick = () => {
    if (!confirm(`${c.k} volverá a ser un huevo de su raíz y ganará +25% EXP para siempre. ¿Renacer?`)) return;
    rebirth(c); m.close(); tab = 'home'; go(); toast('Un huevo apareció en el santuario. Tocalo 3 veces.');
  };
  m.querySelectorAll('[data-evo]').forEach(b => b.onclick = () => { m.close(); evolveFX(c, b.dataset.evo); });
}
function evoCard(c, t) {
  const need = evoLevel(t), rec = KANJI[t].recipes.find(r => r.includes(c.k));
  const others = [...rec]; others.splice(others.indexOf(c.k), 1);
  const missing = [...new Set(others)].filter(o => !S.dex[o]?.owned);
  const learned = mastery(c.k) >= 1, room = freeSpace() >= size(t) - size(c.k);
  const ok = c.lv >= need && !missing.length && learned && room;
  const known = S.dex[t]?.seen;
  return `<button class="evo ${ok ? 'ready' : ''}" data-evo="${t}" ${ok ? '' : 'disabled'}>
    <div class="evo-k ${known ? '' : 'unk'}">${known ? t : '？'}</div>
    <div><b>${known ? KANJI[t].m : 'Desconocido'}</b><small>${c.k} + ${others.join(' + ')}</small>
    <small class="${c.lv >= need ? 'g' : ''}">Lv ${need}</small>${missing.length ? `<small class="r">Conocé: ${missing.join(' ')}</small>` : ''}${learned ? '' : `<small class="r">Acertá ${c.k} en un entrenamiento o en el Dojo</small>`}${room ? '' : `<small class="r">Necesitás ${size(t) - size(c.k)} espacio más</small>`}</div></button>`;
}
function openTraining(c, parent) {
  const games = Object.entries(GAMES).filter(([id]) => (id !== 'word' || hasWord(c.k)) && (id !== 'parts' || hasParts(c.k)));
  const m = modal(`<h3>練 Entrenar con ${c.k}</h3><div class="games">${games.map(([id, g]) =>
    `<button class="gcard" data-g="${id}"><i>${g.k}</i><b>${g.name}</b><small>${g.desc}</small></button>`).join('')}</div>
    <p class="muted">Saber: ${'●'.repeat(Math.min(5, c.know))}${'○'.repeat(Math.max(0, 5 - c.know))} · la dificultad se adapta</p>`);
  m.querySelectorAll('[data-g]').forEach(b => b.onclick = async () => {
    m.close(); parent.close();
    const stars = await play(b.dataset.g, c.k, c.know, $('#layer'));
    if (stars < 0) return;
    const exp = [3, 10, 16, 24][stars] * (c.mood > .6 ? 1.2 : 1);
    const ups = giveExp(c, exp), ink = stars + ups * 3;
    S.ink += ink; grade(c.k, stars >= 2);
    if (stars >= 2) c.know++;
    c.mood = Math.max(0, c.mood - .05); S.stats.trainings++; bump('train');
    const r = modal(`<div class="result"><div class="stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
      <div class="res-art">${creatureSVG(c.k, { mood: stars >= 2 ? 1 : .5 })}</div>
      <p><b>+${Math.round(exp * (1 + c.gen * .25))} EXP · +${ink} 墨</b>${ups ? ` · <b class="g">¡Nivel ${c.lv}!</b>` : ''}</p>
      ${stars < 2 ? storyHTML(c.k) : ''}
      ${evolutionsOf(c.k).some(t => c.lv >= evoLevel(t) && c.lv - ups < evoLevel(t)) ? '<p class="g">✦ ¡Nueva evolución disponible!</p>' : ''}
      <div class="row"><button class="btn ghost" id="again">Otra vez</button><button class="btn ok" id="done">Seguir</button></div></div>`);
    $('#again', r).onclick = () => { r.close(); openTraining(c, { close() {} }); };
    $('#done', r).onclick = () => { r.close(); go(); openCreature(c.id); };
    hud();
  });
}

// ---------- Secuencia de evolución / fusión ----------
function evolveFX(c, to, from = [c.k]) {
  const fx = document.createElement('div'); fx.className = 'evofx';
  fx.innerHTML = `<div class="rays"></div><div class="parts">${from.map(k => `<span>${k}</span>`).join('')}</div>
    <div class="old">${creatureSVG(from[0])}</div><div class="new">${creatureSVG(to, { mood: 1 })}</div>
    <div class="evo-cap"><span class="big-k">${to}</span><b>${KANJI[to].m}</b><small>${KANJI[to].on.join('・')} · ${KANJI[to].kun.join('・')}</small><small>${from.join(' + ')} = ${to} · Nivel KANJŪ ${kLevel(to)}</small><p class="evo-mn">💡 ${KANJI[to].mn}</p><button class="btn ok">¡Genial!</button></div>`;
  if (from.length === 1 && !evolve(c, to)) { fx.remove(); toast('No hay espacio en el santuario para esa evolución'); return; }
  document.body.append(fx); buzz([20, 60, 40]); bump('evo');
  save();
  $('.btn', fx).onclick = () => { fx.classList.add('out'); setTimeout(() => fx.remove(), 300); go(); };
}

// ---------- Laboratorio de fusión ----------
function viewLab(v) {
  labSel = labSel.filter(id => byId(id) && !byId(id).away);
  const sel = labSel.map(byId), ks = sorted(sel.map(c => c.k));
  const match = Object.keys(KANJI).find(t => KANJI[t].recipes?.some(r => sorted(r) === ks));
  const avail = S.creatures.filter(c => !c.away && !c.egg);
  const countOwn = k => avail.filter(c => c.k === k).length;
  v.innerHTML = `
  <div class="lab">
    <div class="altar">
      <div class="slots">${[0, 1, 2].map(i => sel[i] ? `<button class="slot full" data-rm="${sel[i].id}">${creatureSVG(sel[i].k)}</button>` : `<div class="slot">＋</div>`).join('<span class="plus">+</span>')}</div>
      <div class="arrow">↓</div>
      <div class="result-slot ${match ? 'ok' : ''}">${match ? `<span class="big-k">${match}</span><small>${KANJI[match].m} · ${KANJI[match].form}</small>` : `<span class="big-k dim">？</span><small>${sel.length ? 'Sin composición conocida' : 'Elegí criaturas'}</small>`}</div>
      <button class="btn ok wide" id="fuse" ${match ? '' : 'disabled'}>合 Fusionar</button>
    </div>
    <h4>Tus criaturas</h4>
    <div class="roster">${avail.map(c => `<button class="chip-mon ${labSel.includes(c.id) ? 'on' : ''}" data-id="${c.id}">${creatureSVG(c.k)}<small>${c.k} Lv${c.lv}</small></button>`).join('') || '<p class="muted">No hay criaturas disponibles.</p>'}</div>
    <h4>合 Libro de composiciones</h4>
    <div class="recipes">${Object.keys(KANJI).filter(t => KANJI[t].recipes).map(t => {
      const dx = S.dex[t], show = dx?.seen;
      return KANJI[t].recipes.map(r => {
        const need = {}; r.forEach(k => need[k] = (need[k] || 0) + 1);
        const have = Object.entries(need).every(([k, n]) => countOwn(k) >= n);
        const anyPart = r.some(k => S.dex[k]?.owned);
        if (!anyPart && !show) return '';
        return `<button class="recipe ${have ? 'have' : ''}" data-r="${r.join(',')}">${r.map(k => `<span class="${countOwn(k) ? '' : 'miss'}">${S.dex[k]?.seen ? k : '？'}</span>`).join('<em>+</em>')}<em>=</em><b>${show ? t : '？'}</b><small>${show ? KANJI[t].m : 'Por descubrir'}${have ? ' · ¡Listo!' : ''}</small></button>`;
      }).join('');
    }).join('')}</div>
  </div>`;
  v.querySelectorAll('.chip-mon').forEach(b => b.onclick = () => {
    const id = b.dataset.id; buzz(5);
    labSel = labSel.includes(id) ? labSel.filter(x => x !== id) : labSel.length < 3 ? [...labSel, id] : labSel;
    viewLab(v);
  });
  v.querySelectorAll('[data-rm]').forEach(b => b.onclick = () => { labSel = labSel.filter(x => x !== b.dataset.rm); viewLab(v); });
  v.querySelectorAll('.recipe.have').forEach(b => b.onclick = () => {
    const pool = [...avail]; labSel = [];
    b.dataset.r.split(',').forEach(k => { const i = pool.findIndex(c => c.k === k); labSel.push(pool.splice(i, 1)[0].id); });
    viewLab(v);
  });
  $('#fuse', v).onclick = () => {
    if (!confirm(`Las criaturas elegidas se unirán para formar ${match}. ¿Fusionar?`)) return;
    const from = sel.map(c => c.k), nc = fuse(labSel, match); labSel = [];
    evolveFX(nc, match, from);
  };
}

// ---------- Expediciones ----------
function viewExp(v) {
  const n = owned(), fast = S.deco.includes('gate') ? .75 : 1;
  v.innerHTML = `<div class="exps"><p class="lead">Enviá a tus KANJŪ a explorar. Vuelven con tinta, experiencia y, a veces, nuevos amigos.</p>
  ${REGIONS.map(r => {
    const c = S.creatures.find(x => x.away?.region === r.id), lock = n < r.need;
    let inner;
    if (lock) inner = `<p class="muted">🔒 Obtené ${r.need} kanji para desbloquear (${n}/${r.need})</p>`;
    else if (c) {
      const left = Math.max(0, c.away.end - Date.now()), done = !left;
      inner = `<div class="trip"><div class="trip-mon ${done ? '' : 'walking'}">${creatureSVG(c.k)}</div><div class="trip-info"><b>${c.k} ${done ? 'regresó' : 'explorando…'}</b>
        <div class="tbar"><i style="width:${(1 - left / (c.away.secs * 1000)) * 100}%"></i></div><small data-end="${c.away.end}">${done ? '¡Listo!' : fmt(left)}</small></div>
        ${!done && S.items.wind ? `<button class="btn ghost" data-wind="${c.id}">風 ${S.items.wind}</button>` : `<button class="btn ${done ? 'ok' : 'ghost'}" data-collect="${c.id}" ${done ? '' : 'disabled'}>Recibir</button>`}</div>`;
    } else inner = `<div class="trip"><small>Hallazgos: ${r.drops.map(k => S.dex[k]?.seen ? k : '？').join(' ')} · ⏱ ${fmt(r.secs * fast * 1000)}</small><button class="btn ok" data-send="${r.id}">Enviar</button></div>`;
    return `<section class="region ${lock ? 'locked' : ''}" style="--a:${r.bg[0]};--b:${r.bg[1]}"><header><span class="rk">${r.name}</span><b>${r.es}</b></header>${inner}</section>`;
  }).join('')}</div>`;
  v.querySelectorAll('[data-send]').forEach(b => b.onclick = () => pickForTrip(REGIONS.find(r => r.id === b.dataset.send), fast));
  v.querySelectorAll('[data-collect]').forEach(b => b.onclick = () => collect(byId(b.dataset.collect)));
  v.querySelectorAll('[data-wind]').forEach(b => b.onclick = () => { S.items.wind--; byId(b.dataset.wind).away.end = Date.now(); go(); });
}
const fmt = ms => { const s = Math.ceil(ms / 1000); return s >= 60 ? `${s / 60 | 0}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`; };
function pickForTrip(r, fast) {
  const free = home().filter(c => !c.egg);
  const m = modal(`<h3>旅 ${r.es}</h3><p class="muted">¿Quién va? Las criaturas fuera no pueden entrenar ni fusionarse.</p>
    <div class="roster">${free.map(c => `<button class="chip-mon" data-id="${c.id}">${creatureSVG(c.k)}<small>${c.k} Lv${c.lv}</small></button>`).join('')}</div>`);
  m.querySelectorAll('[data-id]').forEach(b => b.onclick = () => {
    const c = byId(b.dataset.id), secs = Math.round(r.secs * fast);
    c.away = { region: r.id, end: Date.now() + secs * 1000, secs };
    bump('exp'); m.close(); toast(`${c.k} partió hacia ${r.name}`); go();
  });
}
function collect(c) {
  const r = REGIONS.find(x => x.id === c.away.region);
  S.regionsDone ??= {};
  const first = !S.regionsDone[r.id]; S.regionsDone[r.id] = (S.regionsDone[r.id] || 0) + 1;
  const ink = 4 + Math.round(r.secs / 15), up = giveExp(c, r.secs / 3);
  S.ink += ink; c.away = null; c.mood = Math.min(1, c.mood + .2);
  let found = null;
  if (first || Math.random() < .45) {
    const fresh = r.drops.filter(k => !S.dex[k]?.owned);
    const k = fresh.length && Math.random() < .8 ? fresh[0] : r.drops[Math.random() * r.drops.length | 0];
    const res = recruit(k); found = res.c || { k, gate: true };
  } else r.drops.forEach(k => Math.random() < .5 && see(k));
  const m = modal(`<div class="result"><h3>${c.k} volvió de ${r.name}</h3>
    <p>+${ink} 墨 · +EXP${up ? ` · <b class="g">¡Nivel ${c.lv}!</b>` : ''}</p>
    ${found ? `<div class="newmon"><span class="new-tag">${found.gate ? '門 Espera en la puerta' : '¡Nuevo KANJŪ!'}</span>${creatureSVG(found.k, { mood: 1 })}${storyHTML(found.k)}${found.gate ? '<small class="r">Tu santuario está lleno. Ampliá, fusioná o liberá para recibirlo.</small>' : ''}</div>` : '<p class="muted">Encontró huellas de otros kanji.</p>'}
    <button class="btn ok wide">Genial</button></div>`);
  $('.btn', m).onclick = () => { m.close(); go(); };
  hud();
}

// ---------- Códice ----------
function viewDex(v) {
  const all = Object.keys(KANJI).sort((a, b) => depth(a) - depth(b));
  v.innerHTML = `<div class="dex">
    <div class="dex-head"><b>${owned()}</b>/${all.length} kanji<div class="tbar"><i style="width:${owned() / all.length * 100}%"></i></div></div>
    ${[...new Set(all.map(kLevel))].map(L => `<h4>Nivel KANJŪ ${L} <small>${['Componentes fundamentales', 'Primera composición', 'Composición intermedia', 'Composición compleja', 'Composición avanzada'][L - 1]}</small></h4>
    <div class="dex-grid">${all.filter(k => kLevel(k) === L).map(k => {
      const d = S.dex[k];
      return `<button class="dex-c ${d?.owned ? 'own' : d?.seen ? 'seen' : ''}" data-k="${k}">${d?.owned ? creatureSVG(k) : `<span class="sil">${d?.seen ? k : '？'}</span>`}<small>${d?.seen ? k : '—'}</small>${d?.owned ? `<i class="mdots">${'●'.repeat(Math.min(6, mastery(k)))}</i>` : ''}</button>`;
    }).join('')}</div>`).join('')}
    <h4>章 Logros</h4>
    <div class="achs">${ACHIEVEMENTS.map(([k, n, f, d, ink]) => { const got = f(), cl = S.ach.includes(k);
      return `<button class="ach ${got ? 'got' : ''} ${got && !cl ? 'claim' : ''}" data-a="${k}" ${got && !cl ? '' : 'disabled'}><i>${k}</i><b>${n}</b><small>${cl ? '✓ Cobrado' : got ? `¡Cobrar ${ink} 墨!` : d}</small></button>`; }).join('')}</div>
    ${S.log.length ? `<h4>輪 Linaje</h4><p class="muted">${S.log.map(l => `${l.k} (Gen ${l.gen})`).join(' · ')}</p>` : ''}
    <button class="link" id="wipe">Reiniciar partida</button>
  </div>`;
  v.querySelectorAll('.dex-c').forEach(b => b.onclick = () => {
    const k = b.dataset.k, d = S.dex[k]; if (!d?.seen) return toast('Aún no descubierto');
    const K = KANJI[k];
    modal(`<div class="dex-detail">${d.owned ? creatureSVG(k) : `<span class="sil big">${k}</span>`}
      ${storyHTML(k)}<button class="btn ghost" id="say2">🔊 Escuchar</button>
      <p class="muted">Nivel KANJŪ ${kLevel(k)} · composition_depth ${depth(k)}</p>
      ${K.recipes ? `<p>${K.recipes.map(r => r.join(' + ') + ' = ' + k).join('<br>')}</p>` : '<p class="muted">Componente fundamental</p>'}
      ${evolutionsOf(k).length ? `<p class="muted">Forma parte de: ${evolutionsOf(k).map(t => S.dex[t]?.seen ? t : '？').join(' ')}</p>` : ''}
      ${S.srs[k] ? `<p class="muted">Maestría ${mastery(k)}/6 · aciertos ${S.srs[k].ok} · fallos ${S.srs[k].miss}</p>` : ''}</div>`).querySelector('#say2').onclick = () => speak(reads(k)[0] || '');
  });
  $('#wipe', v).onclick = () => confirm('¿Borrar todo el progreso?') && reset();
  v.querySelectorAll('.ach.claim').forEach(b => b.onclick = () => {
    const a = ACHIEVEMENTS.find(x => x[0] === b.dataset.a); S.ach.push(a[0]); S.ink += a[4];
    floatText(b, `+${a[4]}墨`); buzz(20); viewDex(v); hud(); });
}

// ---------- Misiones y mejoras ----------
function openQuests() {
  rollDaily();
  const m = modal(`<h3>任 Misiones de hoy</h3><p class="muted">Se renuevan cada día. Perder un día no te quita nada.</p>
    ${MISSIONS.map(q => {
      const p = Math.min(q.goal, S.daily.p[q.id] || 0), got = S.daily.claimed.includes(q.id);
      return `<div class="quest-row ${got ? 'got' : ''}"><div><b>${q.label}</b><div class="tbar"><i style="width:${p / q.goal * 100}%"></i></div><small>${p}/${q.goal}</small></div>
      <button class="btn ${p >= q.goal && !got ? 'ok' : 'ghost'}" data-q="${q.id}" ${p >= q.goal && !got ? '' : 'disabled'}>${got ? '✓' : `+${q.ink}墨`}</button></div>`;
    }).join('')}
    <h4>週 Desafíos de la semana</h4>
    ${WEEKLY.map(q => {
      const p = Math.min(q.goal, S.weekly.p[q.id] || 0), got = S.weekly.claimed.includes(q.id);
      return `<div class="quest-row ${got ? 'got' : ''}"><div><b>${q.label}</b><div class="tbar"><i style="width:${p / q.goal * 100}%"></i></div><small>${p}/${q.goal}</small></div>
      <button class="btn ${p >= q.goal && !got ? 'ok' : 'ghost'}" data-w="${q.id}" ${p >= q.goal && !got ? '' : 'disabled'}>${got ? '✓' : `+${q.ink}墨`}</button></div>`;
    }).join('')}`);
  m.querySelectorAll('[data-w]').forEach(b => b.onclick = () => {
    const q = WEEKLY.find(x => x.id === b.dataset.w); S.weekly.claimed.push(q.id); S.ink += q.ink;
    buzz(15); m.close(); hud(); openQuests(); });
  m.querySelectorAll('[data-q]').forEach(b => b.onclick = () => {
    const q = MISSIONS.find(x => x.id === b.dataset.q); S.daily.claimed.push(q.id); S.ink += q.ink;
    floatText(b, `+${q.ink}墨`); buzz(15); m.close(); hud(); openQuests();
  });
}
// ---------- Tienda ----------
const ITEMS = [
  { id: 'egg', k: '卵', name: 'Huevo misterioso', cost: 70, desc: 'Un componente de las regiones que ya exploraste' },
  { id: 'scroll', k: '巻', name: 'Pergamino de saber', cost: 30, desc: '+60 EXP para la criatura que elijas' },
  { id: 'wind', k: '風', name: 'Viento veloz', cost: 20, desc: 'Termina una expedición al instante' },
  { id: 'mochi', k: '餅', name: 'Caja de mochis', cost: 20, desc: 'Todas tus criaturas quedan felices' },
];
function viewShop(v) {
  const step = S.cap > 6 ? (S.cap - 6) / CAP_STEP : 0, next = EXPANSIONS[step];
  v.innerHTML = `<div class="shop">
    <div class="wallet">墨 <b>${S.ink}</b><small>Ganás tinta entrenando, repasando, viajando y con misiones</small></div>
    <h4>空 Espacio del santuario <small>${used()}/${S.cap} ocupados</small></h4>
    <div class="cap-bar">${Array.from({ length: S.cap }, (_, i) => `<i class="${i < used() ? 'on' : ''}"></i>`).join('')}</div>
    <p class="muted">Cada criatura ocupa tantos espacios como su nivel KANJŪ (1 · 2 · 3…).</p>
    ${next ? `<div class="shop-row big"><i>広</i><div><b>Ampliar santuario</b><small>+${CAP_STEP} espacios · nivel ${step + 1}/${EXPANSIONS.length}</small></div><button class="btn ok" data-buy="cap" ${S.ink < next ? 'disabled' : ''}>${next} 墨</button></div>` : '<p class="g">Santuario al máximo tamaño</p>'}
    <h4>品 Objetos</h4>
    ${ITEMS.map(it => `<div class="shop-row"><i>${it.k}</i><div><b>${it.name}${S.items[it.id] ? ` · tenés ${S.items[it.id]}` : ''}</b><small>${it.desc}</small></div><button class="btn ok" data-buy="${it.id}" ${S.ink < it.cost ? 'disabled' : ''}>${it.cost} 墨</button></div>`).join('')}
    <h4>匠 Decoraciones</h4>
    ${DECOR.map(d => { const has = S.deco.includes(d.id);
      return `<div class="shop-row"><i>${d.k}</i><div><b>${d.name}</b><small>${d.desc}</small></div><button class="btn ${has ? 'ghost' : 'ok'}" data-deco="${d.id}" ${has || S.ink < d.cost ? 'disabled' : ''}>${has ? '✓' : d.cost + ' 墨'}</button></div>`; }).join('')}
  </div>`;
  v.querySelectorAll('[data-buy]').forEach(b => b.onclick = () => buy(b.dataset.buy, next, b));
  v.querySelectorAll('[data-deco]').forEach(b => b.onclick = () => {
    const d = DECOR.find(x => x.id === b.dataset.deco); S.ink -= d.cost; S.deco.push(d.id); toast(`${d.k} ${d.name} construido`); go(); });
}
function buy(id, capCost, el) {
  buzz(12);
  if (id === 'cap') { S.ink -= capCost; S.cap += CAP_STEP; floatText(el, `+${CAP_STEP} espacios`); toast('広 ¡Santuario ampliado!'); return go(); }
  const it = ITEMS.find(x => x.id === id); S.ink -= it.cost;
  if (id === 'mochi') { S.creatures.forEach(c => { c.mood = 1; c.bond += 2; }); toast('餅 Todos están felices'); }
  else if (id === 'egg') {
    const pool = REGIONS.filter(r => S.regionsDone?.[r.id] || r.need === 0).flatMap(r => r.drops);
    const fresh = pool.filter(k => !S.dex[k]?.owned), k = fresh.length && Math.random() < .6 ? fresh[Math.random() * fresh.length | 0] : pool[Math.random() * pool.length | 0];
    if (freeSpace() >= 1) { addCreature(k, { egg: true }); toast('卵 Un huevo llegó al santuario'); }
    else { S.gate.push(k); see(k); toast('卵 El huevo espera en la puerta: no hay espacio'); }
  } else { S.items[id] = (S.items[id] || 0) + 1; toast(`${it.k} ${it.name} guardado`); }
  go();
}

// ---------- Puerta: criaturas esperando espacio ----------
function openGate() {
  const m = modal(`<h3>門 En la puerta</h3><p class="muted">Espacio libre: ${freeSpace()} · Cada una ocupa su nivel KANJŪ.</p>
    ${S.gate.map((k, i) => `<div class="shop-row"><div class="gate-mon">${creatureSVG(k)}</div><div><b>${k} · ${KANJI[k].m}</b><small>Ocupa ${size(k)}</small></div>
      <button class="btn ok" data-in="${i}" ${freeSpace() >= size(k) ? '' : 'disabled'}>Recibir</button><button class="btn ghost" data-out="${i}">+${3 + size(k) * 4}墨</button></div>`).join('')}
    <button class="btn ghost wide" id="toShop">店 Ampliar santuario</button>`);
  m.querySelectorAll('[data-in]').forEach(b => b.onclick = () => { const k = S.gate.splice(+b.dataset.in, 1)[0]; addCreature(k); m.close(); go(); toast(`¡${k} llegó al santuario!`); });
  m.querySelectorAll('[data-out]').forEach(b => b.onclick = () => { const k = S.gate.splice(+b.dataset.out, 1)[0]; S.ink += 3 + size(k) * 4; m.close(); go(); });
  $('#toShop', m).onclick = () => { m.close(); tab = 'shop'; go(); };
}

// ---------- Dojo: repaso espaciado ----------
async function openDojo() {
  let list = dueList().slice(0, 10), free = false;
  if (!list.length) {
    const owned = Object.keys(S.srs);
    if (!owned.length) return toast('Primero conseguí un KANJŪ');
    const soon = Math.min(...owned.map(k => S.srs[k].due)) - Date.now();
    if (!confirm(`Todo repasado ✓ El próximo repaso llega en ${fmt(soon)}.\n\n¿Práctica libre? (no cambia la maestría)`)) return;
    list = owned.sort(() => Math.random() - .5).slice(0, 6); free = true;
  }
  const bell = S.deco.includes('bell') ? 1 : 0;
  const res = await review(list, $('#layer'), (k, ok) => {
    if (!free) grade(k, ok);
    if (ok) S.creatures.filter(c => c.k === k && !c.egg).forEach(c => giveExp(c, 6));
  });
  const ink = res.right * (2 + bell) * (free ? .5 : 1) | 0;
  S.ink += ink; bump('review', res.right); save();
  const m = modal(`<div class="result"><h3>修 Dojo completado</h3><div class="stars">${res.right}<span>/${res.total}</span></div>
    <p><b>+${ink} 墨</b> · tus KANJŪ ganaron EXP por cada acierto</p>
    <p class="muted">${free ? 'Práctica libre.' : 'Los kanji que fallaste volverán pronto; los que acertaste, cada vez más tarde.'}</p>
    <button class="btn ok wide">Volver</button></div>`);
  $('.btn', m).onclick = () => { m.close(); go(); };
  hud();
}

// ---------- Cuenta ----------
function openAccount() {
  if (cloud.user) {
    const m = modal(`<h3>我 Tu cuenta</h3><p>${esc(cloud.user.email)}</p><p class="muted">Tu santuario se guarda en la nube automáticamente.</p>
      <div class="row"><button class="btn ghost" id="out">Cerrar sesión</button><button class="btn ok" id="sync">Guardar ahora</button></div>`);
    $('#sync', m).onclick = async () => { try { await cloud.pushNow(S); toast('Partida guardada en la nube'); } catch (e) { toast(e.message); } };
    $('#out', m).onclick = async () => { await cloud.logout(); m.close(); shell(); toast('Sesión cerrada · tu partida sigue en este dispositivo'); };
    return;
  }
  let mode = 'login';
  const m = modal(`<h3>我 Cuenta KANJŪ</h3><p class="muted">Guardá tu santuario en la nube y jugá desde cualquier dispositivo.</p>
    <div class="seg"><button data-m="login" class="on">Entrar</button><button data-m="register">Crear cuenta</button></div>
    <form class="auth" autocomplete="on"><input name="email" type="email" inputmode="email" autocomplete="email" placeholder="Email" required>
    <input name="password" type="password" autocomplete="current-password" placeholder="Contraseña (mín. 8)" minlength="8" required>
    <p class="err r"></p><button class="btn ok wide" type="submit">Entrar</button></form>`, 'onacct');
  const f = $('form', m), sub = $('[type=submit]', f);
  m.querySelectorAll('[data-m]').forEach(b => b.onclick = () => {
    mode = b.dataset.m; m.querySelectorAll('[data-m]').forEach(x => x.classList.toggle('on', x === b));
    sub.textContent = mode === 'login' ? 'Entrar' : 'Crear cuenta';
    f.password.autocomplete = mode === 'login' ? 'current-password' : 'new-password';
  });
  f.onsubmit = async e => {
    e.preventDefault(); sub.disabled = true; $('.err', f).textContent = '';
    try {
      await cloud.auth(mode, f.email.value, f.password.value);
      await syncAfterLogin(mode === 'register');
      m.close(); document.querySelector('.onbm')?.remove(); shell();
      if (!S.creatures.length) onboarding();
      toast(mode === 'login' ? '¡Bienvenido de vuelta!' : 'Cuenta creada · tu santuario ya está en la nube');
    } catch (err) { $('.err', f).textContent = err.message; sub.disabled = false; }
  };
}
async function syncAfterLogin(isNew) {
  cloud.setReady(false);
  const remote = isNew ? null : await cloud.pull().catch(() => null);
  if (remote?.creatures?.length) {
    const localHas = S.creatures.length && (S.savedAt || 0) > (remote.savedAt || 0);
    if (!localHas || !confirm('Este dispositivo tiene una partida más reciente que la de tu cuenta.\n\nAceptar: usar la de este dispositivo\nCancelar: usar la de la nube')) replace(remote);
    else await cloud.pushNow(S);
  } else if (S.creatures.length) await cloud.pushNow(S);
  cloud.setReady(true);
}

// ---------- Inicio ----------
function onboarding() {
  const starters = ['木', '日', '火'];
  const m = modal(`<div class="onb"><div class="onb-k">漢獣</div><h2>Bienvenido al santuario</h2>
    <p>Cada kanji es una criatura viva. Criala, entrenala y descubrí en qué se convierte.</p>
    <p class="muted">Elegí tu primer huevo</p>
    <button class="link" id="haveAcct" style="margin:0 auto 6px">Ya tengo cuenta</button>
    <div class="eggs">${starters.map(k => `<button class="egg-pick" data-k="${k}">${creatureSVG(k, { egg: true })}<small>${ELEMENTS[element(k)][2]}</small></button>`).join('')}</div></div>`, 'onbm');
  m.onclick = null;
  $('#haveAcct', m).onclick = openAccount;
  m.querySelectorAll('.egg-pick').forEach(b => b.onclick = () => {
    b.classList.add('hatch'); buzz([10, 40, 10]);
    setTimeout(() => {
      const c = addCreature(b.dataset.k); c.mood = 1; m.close(); go();
      const w = modal(`<div class="result"><h3>¡Nació tu primer KANJŪ!</h3>${creatureSVG(c.k, { mood: 1 })}${storyHTML(c.k)}
        <p class="muted">Cada kanji tiene una historia para recordarlo. Tocá a ${c.k} en el santuario para mimarlo y entrenarlo.</p><button class="btn ok wide">¡Vamos!</button></div>`);
      speak(reads(c.k)[0]); $('.btn', w).onclick = () => w.close();
    }, 700);
  });
}

// Pasa el tiempo: el ánimo baja suavemente, nunca castiga
const last = S.last || Date.now(), hrs = (Date.now() - last) / 36e5;
S.creatures.forEach(c => c.mood = Math.max(.25, c.mood - hrs * (S.deco.includes('pond') ? .02 : .04)));
// Regalo de regreso: nunca se pierde nada por no jugar
const gift = S.creatures.length && hrs >= 3 ? Math.min(40, Math.round(hrs * 1.5) + S.creatures.length) : 0;
if (gift) { S.ink += gift; setTimeout(() => toast(`Mientras no estabas, tus KANJŪ juntaron <b>${gift} 墨</b>`), 900); }
S.last = Date.now();
setInterval(() => { S.last = Date.now(); save(); }, 15000);
setInterval(() => {
  if (tab !== 'exp') return hud();
  document.querySelectorAll('[data-end]').forEach(el => { const l = +el.dataset.end - Date.now(); if (l <= 0) go(); else el.textContent = fmt(l); });
}, 1000);

shell();
if (!S.creatures.length) onboarding();
// Si hay sesión, trae la partida de la nube cuando es más nueva
cloud.me().then(async u => {
  if (!u) return;
  const remote = await cloud.pull().catch(() => undefined);
  if (remote === undefined) return shell(); // sin conexión: no sincronizar
  if (remote?.creatures?.length && (remote.savedAt || 0) > loadedAt) { replace(remote); document.querySelector('.onbm')?.remove(); }
  cloud.setReady(true); shell();
  if (!S.creatures.length && !document.querySelector('.onbm')) onboarding();
});
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
