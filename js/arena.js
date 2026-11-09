// KANJŪ · arena.js — Duelos 3 contra 3 con copas, arenas, cofres que se abren estudiando y camino de copas.
import { ic } from './icons.js';
import { webgl, mountArena, arenaHit, arenaCheer, emoteAt } from './scene3d.js';
import { KANJI, TYPES, typeOf, typeMult, kLevel, reads, PIECES } from './data.js';
import { S, save, bump, mastery } from './state.js';
import { creatureSVG } from './creature.js';
import { addXP } from './world.js';
import { romaji, helpOn } from './help.js';
import { speak } from './games.js';
import { $, buzz, toast, modal, go, hud, ui } from './main.js';
import { scrHead } from './main.js';

// Las peleas son siempre 3 contra 3. cap = nivel máximo de los kanji rivales en esa arena.
// Escenario de cada una (scene3d.js): Hanami · Bambú de Arashiyama · Fushimi Inari · Sapporo · Osaka · Fuji
export const ARENAS = [
  { k: '芽', name: 'Arena del Brote', min: 0, cap: 1 },
  { k: '林', name: 'Bosque de los Ecos', min: 200, cap: 2 },
  { k: '寺', name: 'Patio del Templo', min: 500, cap: 2 },
  { k: '雲', name: 'Monte de las Nubes', min: 900, cap: 3 },
  { k: '城', name: 'Castillo de Tinta', min: 1400, cap: 4 },
  { k: '龍', name: 'Cumbre del Dragón', min: 2000, cap: 5 },
];
const RIVALS = ['Haru', 'Sora', 'Ren', 'Yuki', 'Kai', 'Mio', 'Taro', 'Aoi', 'Nao', 'Riku', 'Hana', 'Kenji'];
const CHESTS = {
  wood: { k: '木箱', name: 'Cofre de madera', need: 6, col: '#a8743a', ink: [30, 50], piece: .5, tickets: 0, scroll: .3 },
  silver: { k: '銀箱', name: 'Cofre de plata', need: 12, col: '#9fb0c4', ink: [70, 110], piece: 1, tickets: .3, scroll: .6 },
  gold: { k: '金箱', name: 'Cofre de oro', need: 24, col: '#ffc23d', ink: [160, 240], piece: 2, tickets: 1, scroll: 1 },
};
const CYCLE = ['wood', 'wood', 'silver', 'wood', 'wood', 'silver', 'wood', 'gold'];
export const SLOTS = 4;

export function A() {
  S.arena ??= { cups: 0, best: 0, wins: 0, played: 0, chests: [], cyc: 0, road: [] };
  return S.arena;
}
export const arenaOf = cups => [...ARENAS].reverse().find(a => cups >= a.min);
export const arenaIdx = cups => ARENAS.indexOf(arenaOf(cups));

// Puntos de estudio: abren el primer cofre de la fila
export function study(n) {
  const a = A(), c = a.chests[0]; if (!c || n <= 0) return;
  c.pts = Math.min(CHESTS[c.t].need, c.pts + n);
}

// Estadísticas de combate: el nivel, el rango KANJŪ, las estrellas y lo que sabés del kanji importan
export function stats(c) {
  const L = kLevel(c.k), m = c.enemy ? c.m : mastery(c.k);
  return {
    atk: Math.round(8 + c.lv * 1.6 + (L - 1) * 7 + (c.stars || 0) * 3 + m * 1.5 + (c.gold ? 4 : 0)),
    hp: Math.round(40 + c.lv * 4 + (L - 1) * 18 + (c.stars || 0) * 8 + Math.min(20, (c.bond || 0) / 3)),
  };
}

// Camino de copas: premios cada 100 copas
export const ROAD = Array.from({ length: 25 }, (_, i) => {
  const at = (i + 1) * 100, r = i % 4;
  return { at, ...(r === 0 ? { ink: 60 + i * 10 } : r === 1 ? { piece: 1 } : r === 2 ? { tickets: 1 } : { chest: i % 8 === 7 ? 'gold' : 'silver' }) };
});

// ---------- Vista ----------
export function viewArena(v) {
  const a = A(), ar = arenaOf(a.cups), i = ARENAS.indexOf(ar), next = ARENAS[i + 1];
  const team = myTeam(), pend = ROAD.filter(r => a.best >= r.at && !a.road.includes(r.at));
  v.innerHTML = `<div class="arena">
    ${scrHead('闘', 'Arena', 'Duelos de kanji: ganá copas y abrí cofres estudiando', `<span class="pill-w">${ic('trophy')}<b>${a.cups}</b></span>`)}
    <div class="arena-card" style="--i:${i}">
      <span class="ak">${ar.k}</span><div><small>Arena ${i + 1}</small><b>${ar.name}</b>
      <div class="cups">${ic('trophy')} ${a.cups}${next ? `<div class="tbar"><i style="width:${(a.cups - ar.min) / (next.min - ar.min) * 100}%"></i></div><small>${next.min - a.cups} para ${next.name}</small>` : ''}</div></div>
    </div>
    <div class="team-pick"><h4>Tu equipo <small>los 3 KANJŪ más fuertes · tocá para cambiar</small></h4>
      <div class="team">${team.map(c => cardHTML(c, false, 'data-swap="' + c.id + '"')).join('') || '<p class="muted">Necesitás al menos 1 KANJŪ.</p>'}</div></div>
    <button class="btn ok wide battle-btn" id="fight" ${team.length ? '' : 'disabled'}>闘 ¡A combatir!</button>
    <p class="muted center">Cada ataque es un desafío del kanji de tu KANJŪ. Los tipos 五行 deciden quién es fuerte contra quién.</p>
    <h4>箱 Cofres <small>se abren estudiando: cada acierto en el Repaso, la Academia o entrenando suma</small></h4>
    <div class="chests">${Array.from({ length: SLOTS }, (_, j) => {
      const c = a.chests[j]; if (!c) return '<div class="chest empty">vacío</div>';
      const d = CHESTS[c.t], ready = c.pts >= d.need;
      return `<button class="chest ${ready ? 'ready' : ''} ${j === 0 ? 'active' : ''}" data-ch="${j}" style="--c:${d.col}"><span>${d.k}</span><small>${ready ? '¡Abrir!' : j === 0 ? `${c.pts}/${d.need} 学` : 'en espera'}</small>${j === 0 && !ready ? `<i style="width:${c.pts / d.need * 100}%"></i>` : ''}</button>`;
    }).join('')}</div>
    <h4>道 Camino de copas ${pend.length ? `<small class="r">¡${pend.length} premio${pend.length > 1 ? 's' : ''}!</small>` : ''}</h4>
    <div class="road">${ROAD.map(r => { const got = a.road.includes(r.at), can = a.best >= r.at;
      return `<button class="rd ${got ? 'got' : can ? 'can' : ''}" data-rd="${r.at}" ${can && !got ? '' : 'disabled'}><small>杯${r.at}</small><b>${r.ink ? r.ink + ' 墨' : r.piece ? '部品' : r.tickets ? '1 札' : CHESTS[r.chest].k}</b></button>`; }).join('')}</div>
    <div class="types-help"><h4>五行 Tipos</h4><p>${Object.values(TYPES).map(t => `<span style="color:${t.col}">${t.k}</span> vence a <span style="color:${TYPES[t.beats].col}">${TYPES[t.beats].k}</span>`).join(' · ')}</p></div>
  </div>`;
  $('#fight', v).onclick = () => startDuel();
  v.querySelectorAll('[data-swap]').forEach(b => b.onclick = () => pickTeam(b.dataset.swap));
  v.querySelectorAll('[data-ch]').forEach(b => b.onclick = () => openChest(+b.dataset.ch));
  v.querySelectorAll('[data-rd]').forEach(b => b.onclick = () => claimRoad(+b.dataset.rd));
  v.querySelector('.rd.can')?.scrollIntoView({ inline: 'center', block: 'nearest' });
}
const fighters = () => S.creatures.filter(c => !c.egg && !c.away);
export function myTeam() {
  const a = A(), pool = fighters();
  let t = (a.team || []).map(id => pool.find(c => c.id === id)).filter(Boolean);
  for (const c of [...pool].sort((x, y) => stats(y).atk + stats(y).hp - stats(x).atk - stats(x).hp)) { if (t.length >= 3) break; if (!t.includes(c)) t.push(c); }
  a.team = t.map(c => c.id); return t;
}
function cardHTML(c, enemy, attrs = '') {
  const t = TYPES[typeOf(c.k)], st = stats(c);
  return `<button class="fcard ${enemy ? 'enemy' : ''}" ${attrs} style="--t:${t.col}"><span class="tb">${t.k}</span>${creatureSVG(c.k, { gold: c.gold })}<b>${c.k}</b><small>Lv${c.lv} · 闘${st.atk} ♥${st.hp}</small></button>`;
}
function pickTeam(outId) {
  const a = A(), team = myTeam(), pool = fighters().filter(c => !team.includes(c));
  const m = modal(`<h3>Cambiar a ${team.find(c => c.id === outId)?.k}</h3><div class="team wrap">${pool.map(c => cardHTML(c, false, `data-in="${c.id}"`)).join('') || '<p class="muted">No hay otros KANJŪ disponibles.</p>'}</div>`);
  m.querySelectorAll('[data-in]').forEach(b => b.onclick = () => { a.team = a.team.map(id => id === outId ? b.dataset.in : id); save(); m.close(); go(); });
}

// ---------- Rival ----------
function rivalTeam() {
  const a = A(), i = arenaIdx(a.cups), ar = ARENAS[i], mine = myTeam();
  const avg = mine.reduce((s, c) => s + c.lv, 0) / Math.max(1, mine.length);
  const pool = Object.keys(KANJI).filter(k => kLevel(k) <= ar.cap);
  const first = a.played < 2; // los primeros duelos son amables
  return Array.from({ length: 3 }, (_, j) => {
    const k = pool[Math.random() * pool.length | 0];
    const lv = Math.max(1, Math.min(15, Math.round(first ? 1 + j : avg * (.75 + i * .06) + (Math.random() * 4 - 2))));
    return { id: 'e' + j, k, lv, m: Math.min(6, 1 + i), enemy: true, stars: i >= 4 ? 1 : 0 };
  });
}

// ---------- Duelo ----------
export function startDuel() {
  const a = A(), mine = myTeam().map(c => ({ c, ...stats(c), max: stats(c).hp })), foes = rivalTeam().map(c => ({ c, ...stats(c), max: stats(c).hp }));
  const rival = RIVALS[Math.random() * RIVALS.length | 0];
  let combo = 0, special = 0, over = false, busy = false;
  const w = document.createElement('div'); w.className = 'duel';
  document.body.append(w);
  const alive = s => s.filter(x => x.hp > 0);
  const has3d = webgl();
  if (has3d) { w.classList.add('d3'); w.innerHTML = `<div class="duel-stage"><div class="stage-ov"></div></div><div class="duel-ui"></div>`; }
  function render(msg = '') {
    if (has3d) return render3d(msg);
    const ef = alive(foes)[0];
    w.innerHTML = `<div class="duel-head"><span>${rival} · 杯${Math.max(0, a.cups + Math.round(Math.random() * 60 - 30))}</span><button class="x">✕</button></div>
      <div class="side foes">${foes.map((f, j) => unit(f, true, f === ef)).join('')}</div>
      <div class="duel-mid"><p>${msg || 'Elegí quién ataca'}</p><div class="sp"><i style="width:${special / 3 * 100}%"></i><span>必殺 ${special >= 3 ? '¡LISTO!' : ''}</span></div>${combo >= 2 ? `<b class="combo hot">炎 ${combo}</b>` : ''}</div>
      <div class="side mine">${mine.map(f => unit(f, false)).join('')}</div>`;
    w.querySelector('.x').onclick = () => { if (confirm('¿Rendirte? Perdés copas.')) finish(false); };
    w.querySelectorAll('[data-atk]').forEach(b => b.onclick = () => !busy && attack(mine[+b.dataset.atk]));
  }
  // Arena 3D: la escena muestra a las criaturas; arriba de cada una, su nombre y vida
  function render3d(msg) {
    const ef = alive(foes)[0], ui = w.querySelector('.duel-ui'), stage = w.querySelector('.duel-stage'), ov = stage.querySelector('.stage-ov');
    ui.innerHTML = `<div class="duel-head"><span class="rv"><i>敵</i>${rival}<small>杯${Math.max(0, a.cups + 12)}</small></span><button class="x" aria-label="Rendirse">✕</button></div>
      <div class="duel-mid"><p>${msg || 'Tocá a uno de tus KANJŪ para atacar'}</p><div class="sp"><i style="width:${special / 3 * 100}%"></i><span>必殺 ${special >= 3 ? '¡LISTO!' : ''}</span></div>${combo >= 2 ? `<b class="combo hot">連 ×${combo}</b>` : ''}</div>`;
    const lab = (f, enemy, j) => {
      const t = TYPES[typeOf(f.c.k)], mult = !enemy && ef ? typeMult(typeOf(f.c.k), typeOf(ef.c.k)) : 1;
      return `<button class="ulabel ${enemy ? 'e' : 'm'} ${f.hp <= 0 ? 'down' : ''}" data-anchor="${enemy ? 'e' : 'm'}${j}" ${enemy ? '' : 'data-foot'} ${!enemy && f.hp > 0 ? `data-atk="${j}"` : 'disabled'} style="--t:${t.col}">
        <span class="lt"><span class="tb">${t.k}</span><b>${f.c.k}</b><small>Nv${f.c.lv}</small>${!enemy && mult !== 1 && f.hp > 0 ? `<em class="${mult > 1 ? 'up' : 'dn'}">${mult > 1 ? '▲' : '▼'}</em>` : ''}</span>
        <span class="hp"><i style="width:${Math.max(0, f.hp / f.max * 100)}%"></i></span></button>`;
    };
    ov.innerHTML = foes.map((f, j) => lab(f, true, j)).join('') + mine.map((f, j) => lab(f, false, j)).join('');
    const it = (f, side, j) => ({ id: side + j, side, slot: j, svg: creatureSVG(f.c.k, { mood: f.hp / f.max > .3 ? 1 : .2, gold: f.c.gold }), down: f.hp <= 0, target: side === 'e' && f === ef });
    mountArena(stage, { scene: arenaIdx(a.cups), items: [...foes.map((f, j) => it(f, 'e', j)), ...mine.map((f, j) => it(f, 'm', j))], onTap: id => { if (id[0] === 'm' && !busy && mine[+id[1]].hp > 0) attack(mine[+id[1]]); } });
    ui.querySelector('.x').onclick = () => { if (confirm('¿Rendirte? Perdés copas.')) finish(false); };
    ov.querySelectorAll('[data-atk]').forEach(b => b.onclick = () => !busy && attack(mine[+b.dataset.atk]));
  }
  function fx(fromSel, toSel, cls1, txt, from, to, k) {
    if (!has3d) { hit(fromSel, cls1); hit(toSel, 'shake', txt); return; }
    arenaHit(from, to, TYPES[typeOf(k)].col).then(() => emoteAt(to, txt, 'dmg3d', 950));
  }
  function unit(f, enemy, target) {
    const t = TYPES[typeOf(f.c.k)], ef = alive(foes)[0];
    const mult = !enemy && ef ? typeMult(typeOf(f.c.k), typeOf(ef.c.k)) : 1;
    return `<button class="unit ${f.hp <= 0 ? 'down' : ''} ${target ? 'target' : ''}" ${!enemy && f.hp > 0 ? `data-atk="${mine.indexOf(f)}"` : 'disabled'} data-u="${enemy ? 'e' : 'm'}${(enemy ? foes : mine).indexOf(f)}" style="--t:${t.col}">
      <span class="tb">${t.k}</span>${!enemy && mult !== 1 && f.hp > 0 ? `<span class="adv ${mult > 1 ? 'up' : 'down'}">${mult > 1 ? '▲' : '▼'}</span>` : ''}
      ${creatureSVG(f.c.k, { mood: f.hp / f.max > .3 ? 1 : .2, gold: f.c.gold })}<b>${f.c.k}</b><small>Lv${f.c.lv}</small>
      <div class="hp"><i style="width:${Math.max(0, f.hp / f.max * 100)}%"></i></div></button>`;
  }
  async function attack(me) {
    const foe = alive(foes)[0]; if (!foe || me.hp <= 0) return;
    busy = true;
    const res = await challenge(me.c.k, w);
    const mult = typeMult(typeOf(me.c.k), typeOf(foe.c.k));
    let dmg = me.atk * mult * (res.ok ? (res.fast ? 1.3 : 1) : .3);
    let note = res.ok ? (res.fast ? '¡Crítico!' : '¡Bien!') : 'Falló el desafío…';
    if (res.ok) { combo++; special = Math.min(3, special + 1); } else combo = 0;
    if (res.ok && special >= 3 && res.useSpecial) { dmg *= 2.2; special = 0; note = '必殺 ¡Técnica especial!'; }
    dmg = Math.max(1, Math.round(dmg * (1 + Math.min(combo, 5) * .05)));
    foe.hp -= dmg;
    render(`${me.c.k} → ${foe.c.k}: <b>${dmg}</b> ${note}${mult > 1 ? ' · ¡Muy efectivo!' : mult < 1 ? ' · Poco efectivo' : ''}`);
    fx(`[data-u="m${mine.indexOf(me)}"]`, `[data-u="e${foes.indexOf(foe)}"]`, 'lunge', `-${dmg}`, 'm' + mine.indexOf(me), 'e' + foes.indexOf(foe), me.c.k);
    buzz(res.ok ? 20 : 8);
    await wait(has3d ? 1200 : 900);
    if (!alive(foes).length) return finish(true);
    // Turno rival
    const ef = alive(foes)[0], targets = alive(mine), tg = targets[Math.random() * targets.length | 0];
    const em = typeMult(typeOf(ef.c.k), typeOf(tg.c.k)), ed = Math.max(1, Math.round(ef.atk * em * (.8 + Math.random() * .3)));
    tg.hp -= ed;
    render(`${ef.c.k} ataca a ${tg.c.k}: <b>${ed}</b>${em > 1 ? ' · ¡Muy efectivo!' : em < 1 ? ' · Poco efectivo' : ''}`);
    fx(`[data-u="e${foes.indexOf(ef)}"]`, `[data-u="m${mine.indexOf(tg)}"]`, 'lunge2', `-${ed}`, 'e' + foes.indexOf(ef), 'm' + mine.indexOf(tg), ef.c.k);
    await wait(has3d ? 1200 : 900);
    if (!alive(mine).length) return finish(false);
    busy = false; render();
  }
  function hit(sel, cls, txt) {
    const el = w.querySelector(sel); if (!el) return;
    el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 500);
    if (txt) { const f = document.createElement('div'); f.className = 'dmg'; f.textContent = txt; el.append(f); setTimeout(() => f.remove(), 900); }
  }
  function finish(win) {
    if (over) return; over = true;
    a.played++;
    const ar0 = arenaIdx(a.cups), floor = arenaOf(a.cups).min;
    const delta = win ? 26 + Math.round(Math.random() * 8) : -Math.min(18 + Math.round(Math.random() * 6), a.cups - floor);
    a.cups = Math.max(0, a.cups + delta); a.best = Math.max(a.best, a.cups);
    let ink = 0, chest = null;
    if (win) {
      a.wins++; ink = 15 + ar0 * 8; S.ink += ink; bump('duel');
      if (a.chests.length < SLOTS) { chest = CYCLE[a.cyc++ % CYCLE.length]; a.chests.push({ t: chest, pts: 0 }); }
      mine.forEach(f => { f.c.bond = (f.c.bond || 0) + 1; });
    }
    const ups = addXP(win ? 15 : 5); save();
    const promoted = arenaIdx(a.cups) > ar0;
    const card = `<div class="duel-end ${win ? 'win' : 'lose'}"><h2>${win ? '勝利 ¡Victoria!' : '敗北 Derrota'}</h2>
      <p class="cupd">${ic('trophy')} ${delta > 0 ? '+' : ''}${delta}</p>
      ${win ? `<p>+${ink} 墨${chest ? ` · ${CHESTS[chest].k} ${CHESTS[chest].name}` : ' · <span class="r">cofres llenos: abrí alguno estudiando</span>'}</p>` : '<p class="muted">Entrená a tus KANJŪ y estudiá sus kanji para atacar más fuerte.</p>'}
      ${promoted ? `<div class="promo"><span>${arenaOf(a.cups).k}</span><b>¡Nueva arena!</b><small>${arenaOf(a.cups).name}</small></div>` : ''}
      <button class="btn ok wide">Continuar</button></div>`;
    // En 3D el resultado aparece sobre la arena (que sigue viva) y el equipo ganador festeja
    if (has3d) { w.querySelector('.stage-ov').innerHTML = ''; w.querySelector('.duel-ui').innerHTML = card; arenaCheer(win ? 'm' : 'e'); }
    else w.innerHTML = card;
    w.querySelector('.btn').onclick = () => { w.remove(); hud(); go(); };
    if (promoted) buzz([30, 80, 30, 80, 60]);
  }
  render();
}
const wait = ms => new Promise(r => setTimeout(r, ms));

// Desafío rápido sobre el kanji del atacante: significado o lectura, con tiempo
function challenge(k, root) {
  return new Promise(done => {
    const K = KANJI[k], useRead = reads(k).length && Math.random() < .45;
    const others = Object.keys(KANJI).filter(x => x !== k).sort(() => Math.random() - .5);
    const correct = useRead ? reads(k)[0] : K.m;
    const opts = [correct, ...others.map(x => useRead ? reads(x)[0] : KANJI[x].m).filter(o => o && o !== correct && !(useRead && reads(k).includes(o)))].filter((v, i, s) => s.indexOf(v) === i).slice(0, 4).sort(() => Math.random() - .5);
    const T = 7000, t0 = Date.now();
    const box = document.createElement('div'); box.className = 'chal';
    box.innerHTML = `<p>${useRead ? '¿Cómo se lee?' : '¿Qué significa?'}</p><div class="ck">${k}</div><div class="ctime"><i></i></div>
      <div class="copts">${opts.map(o => `<button class="co">${o}${useRead && helpOn() ? `<i class="rmj">${romaji(o)}</i>` : ''}</button>`).join('')}</div>`;
    root.append(box);
    requestAnimationFrame(() => requestAnimationFrame(() => { box.querySelector('.ctime i').style.transitionDuration = T + 'ms'; box.querySelector('.ctime i').style.width = '0%'; }));
    let ended = false;
    const end = ok => {
      if (ended) return; ended = true; clearTimeout(to);
      const fast = ok && Date.now() - t0 < 2500;
      box.querySelectorAll('.co').forEach(b => { b.disabled = true; if (b.firstChild.textContent === correct) b.classList.add('right'); });
      if (ok) speak(reads(k)[0] || '');
      setTimeout(() => { box.remove(); done({ ok, fast, useSpecial: true }); }, ok ? 350 : 900);
    };
    const to = setTimeout(() => end(false), T);
    box.querySelectorAll('.co').forEach(b => b.onclick = () => { const ok = b.firstChild.textContent === correct; if (!ok) b.classList.add('wrong'); end(ok); });
  });
}

// ---------- Cofres y camino ----------
function rollChest(t) {
  const d = CHESTS[t], out = [];
  const ink = d.ink[0] + Math.round(Math.random() * (d.ink[1] - d.ink[0])); S.ink += ink; out.push(`${ink} 墨`);
  const nP = Math.floor(d.piece) + (Math.random() < d.piece % 1 ? 1 : 0), all = Object.keys(PIECES);
  for (let i = 0; i < nP; i++) { const p = all[Math.random() * all.length | 0]; S.pieces[p] = (S.pieces[p] || 0) + 1; out.push(`部品 ${p}`); }
  if (Math.random() < d.tickets) { S.tickets++; out.push('1 札'); }
  if (Math.random() < d.scroll) { S.items.scroll = (S.items.scroll || 0) + 1; out.push('巻 pergamino'); }
  return out;
}
function openChest(j) {
  const a = A(), c = a.chests[j]; if (!c) return;
  const d = CHESTS[c.t];
  if (c.pts < d.need) return toast(j === 0 ? `Faltan ${d.need - c.pts} aciertos de estudio para abrirlo · andá a 修 Repaso o 学 Academia` : 'Se abre después del primero de la fila');
  a.chests.splice(j, 1);
  const got = rollChest(c.t); save(); buzz([20, 60, 20]);
  const m = modal(`<div class="result chest-open"><div class="chest big" style="--c:${d.col}"><span>${d.k}</span></div><h3>${d.name}</h3><div class="loot">${got.map(g => `<span>${g}</span>`).join('')}</div><button class="btn ok wide">¡Genial!</button></div>`);
  m.querySelector('.btn').onclick = () => { m.close(); go(); hud(); };
}
function claimRoad(at) {
  const a = A(), r = ROAD.find(x => x.at === at); if (!r || a.road.includes(at) || a.best < at) return;
  a.road.push(at); let msg;
  if (r.ink) { S.ink += r.ink; msg = `${r.ink} 墨`; }
  else if (r.piece) { const all = Object.keys(PIECES), p = all[Math.random() * all.length | 0]; S.pieces[p] = (S.pieces[p] || 0) + 1; msg = `部品 ${p} ${PIECES[p].m}`; }
  else if (r.tickets) { S.tickets++; msg = '1 札'; }
  else msg = rollChest(r.chest).join(' · ');
  save(); toast(`道 Premio de ${at} copas: ${msg}`); go(); hud();
}
