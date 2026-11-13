// KANJŪ · sheet.js
import { ic } from './icons.js';
import { KANJI, ELEMENTS, REGIONS, DECOR, EXPANSIONS, CAP_STEP, depth, kLevel, size, element, evolutionsOf, evoLevel, learnGate, MAX_LV, reads } from './data.js';
import { creatureSVG, objSVG } from './creature.js';
import { S, loadedAt, save, replace, reset, grade, dueList, mastery, release, rollDaily, bump, see, addCreature, byId, expNeed, giveExp, evolve, fuse, rebirth } from './state.js';
import { GAMES, hasWord, hasParts, play, review, storyHTML, speak, okuHTML } from './games.js';
import * as cloud from './cloud.js';
import { startHelp, rr, romaji, kanaPool, kanaDrill, helpOn } from './help.js';
import { openAcademy, acadDue, reviewAcademy, DAILY_GOAL } from './academy.js';
import { openAISettings, aiStatus } from './ai.js';
import { startTutorial, emit } from './tutorial.js';
import { COLS, BASE_ROWS, ROW_COSTS, ROW_RANK, STORE_COSTS, OBJS, OBJ_MAX, upCost, objCost, foot, placed, tilesUsed, tilesTotal, fits, findSpot, settle, stored, storeFree, arrive, newObj, has, bellBonus, tripMult, neighbors, expBonus, calm, rate, pending, full, collect as gather, totalPending, totalRate, rankNeed, addXP, LOGIN, loginReady, claimLogin, PULL, PULL10, PITY, GOLD_RATE, pull, dupesOf, awaken, initWorld } from './world.js';
import { $, buzz, esc, home, ui, go, hud, toast, modal, floatText } from './main.js';
import { rankUp } from './sanctuary.js';
import { STROKES } from './strokes.js';
import { PIECES, isPiece, TYPES, typeOf, gradeTag, SRS_HOURS } from './data.js';
import { useTagHTML, anchorsHTML, bindAnchors } from './diary.js';
import { t } from './i18n.js';
import { tr } from './lex.js';
import { curSection, roundsOf, runRound, endRound, passTest, ROUNDS, inkSVG, paintedOf, strokesOf, prizeState, wakeBox, PRIZE_INK } from './round.js';
import { sectionById } from './curriculum.js';
import { WORD, wordHTML } from './lex.js';
import { bookCardHTML, openBook } from './book.js';
import { openExam } from './exam.js';

// ---------- Hoja de criatura ----------
export function openCreature(id) {
  const c = byId(id); if (!c) return;
  emit('sheet');
  const K = KANJI[c.k], [fill] = ELEMENTS[element(c.k)];
  const evos = evolutionsOf(c.k);
  const m = modal(`
    <div class="cr-top" style="--el:${fill}">
      <button class="cr-art" id="pet">${creatureSVG(c.k, { mood: c.mood, gold: c.gold })}${c.acc ? `<span class="acc-hat big">${c.acc}</span>` : ''}</button>
      <div class="cr-name"><span class="big-k">${c.k}</span><div><b>${K.m}</b>${gradeTag(c.k)}${useTagHTML(c.k)}<small><b class="tbadge" style="--t:${TYPES[typeOf(c.k)].col}">${TYPES[typeOf(c.k)].k} ${TYPES[typeOf(c.k)].name}</b> fuerte contra ${TYPES[TYPES[typeOf(c.k)].beats].k} · ${ELEMENTS[element(c.k)][2]}${c.gen ? ` · Gen ${c.gen}` : ''}</small></div></div>
      <div class="reads"><button class="say" id="say" aria-label="Escuchar">${ic('sound')}</button>${reads(c.k).map((r, i) => `<span class="${i ? 'r2' : 'r1'}" ${i ? `title="Se pide desde maestría 3"` : ''}><b>${K.kun.includes(r) ? '訓' : '音'}</b>${okuHTML(rr(r))}${i && mastery(c.k) < 3 ? ` ${ic('lock')}` : ''}</span>`).join('') || '<span>—</span>'}<span class="mast" title="Maestría">熟 ${'★'.repeat(mastery(c.k))}${'☆'.repeat(Math.max(0, SRS_HOURS.length - 1 - mastery(c.k)))}</span></div>
    </div>
    <div class="bars">
      <div class="bar"><label>Nv ${c.lv}<small>/${MAX_LV}</small>${c.lv >= MAX_LV ? ' MAX' : ''}</label><div><i style="width:${c.exp / expNeed(c.lv) * 100}%"></i></div></div>
      <div class="bar bond"><label>絆 ${'♥'.repeat(Math.min(5, c.bond / 10 | 0))}${'♡'.repeat(5 - Math.min(5, c.bond / 10 | 0))}</label><div><i style="width:${c.mood * 100}%"></i></div></div>
    </div>
    <div class="acts a4">
      <button class="act" id="train" ${c.pos ? '' : 'disabled'}><i>練</i>Entrenar</button>
      <button class="act" id="snack" ${S.ink < 5 ? 'disabled' : ''}><i>餅</i>Mochi <small>5墨</small></button>
      <button class="act ${c.lv >= MAX_LV ? 'hot' : ''}" id="reborn" ${c.lv < MAX_LV ? 'disabled' : ''}><i>輪</i>Renacer</button>
      <button class="act" id="free" ${S.creatures.filter(x => !x.egg).length <= 1 ? 'disabled' : ''}><i>放</i>Liberar</button>
    </div>
    ${c.egg ? '' : bookCardHTML()}
    ${c.pos ? `<p class="prod">収 Produce <b>${rate(c).toFixed(1)} 墨/h</b>${c.insp > Date.now() ? ' · <b class="g">inspirado ×2</b>' : ' · entrenalo para inspirarlo ×2'}${neighbors(c).length ? ` · aura ${neighbors(c).map(o => OBJS[o.t].k).join('')}` : ''}</p>` : '<p class="r">En el almacén: colocalo en el santuario para entrenar y producir</p>'}
    ${dupesOf(c).length && (c.stars || 0) < 5 ? `<button class="btn ok wide gold" id="awaken">覚 Despertar ★${(c.stars || 0) + 1} · usa un ${c.k} duplicado (+20% tinta y EXP)</button>` : ''}
    ${S.items.scroll ? `<button class="btn ghost wide" id="scroll">巻 Usar pergamino (+60 EXP) · ${S.items.scroll}</button>` : ''}
    <details class="story-d"><summary>${ic('bulb')} Historia para recordarlo</summary>${storyHTML(c.k)}
      <textarea id="note" maxlength="160" placeholder="Escribí tu propia historia: las que inventás vos se recuerdan mejor">${esc(S.notes?.[c.k] || '')}</textarea></details>
    ${anchorsHTML(c.k)}
    ${accHTML(c)}
    <h4>進化 Evoluciones <small>${evos.length} caminos · 知 = dominio en el repaso</small></h4>
    <div class="evos">${evos.length ? [...evos].sort((a, b) => (!!S.dex[b]?.seen - !!S.dex[a]?.seen) || evoLevel(a) - evoLevel(b)).map(t => evoCard(c, t)).join('') : '<p class="muted">Forma final en este santuario. Llegá a Lv MAX para renacer.</p>'}</div>
    ${K.recipes ? `<p class="muted">Composición: ${K.recipes.map(r => r.join(' + ')).join('  ·  ')}${K.note ? ` — ${K.note}` : ''}</p>` : ''}
    <p class="hist">${c.hist.join(' → ')}</p>`, 'cr');

  $('#bookCard', m) && ($('#bookCard', m).onclick = () => { buzz(5); openBook(modal, c); });
  $('#pet', m).onclick = e => {
    c.mood = Math.min(1, c.mood + .12); c.bond++; bump('pet'); giveExp(c, 1); emit('pet');
    floatText(e.currentTarget, '♥', 'heart'); buzz(6);
    const a = $('#pet', m); a.classList.remove('squish'); void a.offsetWidth; a.classList.add('squish'); hud();
  };
  $('#snack', m).onclick = () => { S.ink -= 5; c.mood = 1; c.bond += 3; const up = giveExp(c, 8); m.close(); toast(`${c.k} disfrutó el mochi ${up ? '· ¡Subió de nivel!' : ''}`); go(); setTimeout(() => openCreature(id), 260); };
  $('#train', m).onclick = () => openTraining(c, m);
  $('#awaken', m) && ($('#awaken', m).onclick = () => { if (!confirm(`Se consumirá otro ${c.k}. ¿Despertar?`)) return; awaken(c); m.close(); go(); buzz([20, 60, 20]); toast(`覚 ${c.k} despertó: ★${c.stars}`); setTimeout(() => openCreature(id), 260); });
  $('#say', m).onclick = () => speak(reads(c.k)[0] || '');
  bindAnchors(m);
  $('#note', m).onchange = e => { S.notes ??= {}; S.notes[c.k] = e.target.value.trim(); save(); toast('筆 Historia guardada'); };
  $('#free', m).onclick = () => {
    if (!confirm(`${c.k} volverá a la naturaleza y te dejará tinta. Su entrada en el atlas se conserva. ¿Liberar?`)) return;
    const ink = release(c); m.close(); go(); toast(`${c.k} se despidió · +${ink} 墨`); };
  if (S.items.scroll) $('#scroll', m).onclick = () => { S.items.scroll--; const up = giveExp(c, 60); m.close(); go(); toast(`${c.k} absorbió el pergamino${up ? ` · ¡Nivel ${c.lv}!` : ''}`); setTimeout(() => openCreature(id), 260); };
  $('#reborn', m).onclick = () => {
    if (!confirm(`${c.k} volverá a ser un huevo de su raíz y ganará +25% EXP para siempre. ¿Renacer?`)) return;
    rebirth(c); m.close(); ui.tab = 'home'; go(); toast('Un huevo apareció en el santuario. Tocalo 3 veces.');
  };
  m.querySelectorAll('[data-evo]').forEach(b => b.onclick = () => { m.close(); evolveFX(c, b.dataset.evo); });
  m.querySelectorAll('[data-eq]').forEach(b => b.onclick = () => {
    const p = b.dataset.eq;
    if (c.acc) S.pieces[c.acc] = (S.pieces[c.acc] || 0) + 1;
    if (p) { S.pieces[p]--; c.acc = p; buzz(15); toast(`${c.k} se puso ${p} ${PIECES[p].m}`); } else { c.acc = null; toast('Pieza devuelta al inventario'); }
    save(); m.close(); go(); setTimeout(() => openCreature(id), 220);
  });
}
export function evoCard(c, t) {
  const need = evoLevel(t), rec = KANJI[t].recipes.find(r => r.includes(c.k));
  const others = [...rec]; others.splice(others.indexOf(c.k), 1);
  const piece = others.find(isPiece), pieceOk = !piece || c.acc === piece;
  const missing = [...new Set(others)].filter(o => !isPiece(o) && !S.dex[o]?.owned);
  const gate = learnGate(t), learned = mastery(c.k) >= gate, room = true;
  const ok = c.lv >= need && !missing.length && learned && room && pieceOk;
  const known = S.dex[t]?.seen;
  // Tarjeta compacta: kanji · nombre · receta · requisitos como chips (✓ cumplido / pendiente)
  const q = (okk, txt) => `<em class="${okk ? 'ok' : ''}">${okk ? '✓ ' : ''}${txt}</em>`;
  return `<button class="evo ${ok ? 'ready' : ''}" data-evo="${t}" ${ok ? '' : 'disabled'}>
    <div class="evo-k ${known ? '' : 'unk'}">${known ? t : '？'}</div>
    <div class="evo-b"><b>${known ? KANJI[t].m : 'Por descubrir'}</b><small class="evo-r">${c.k} + ${others.join(' + ')}</small>
    <span class="evo-q">${q(c.lv >= need, `Nv ${need}`)}${q(learned, `知 ${Math.min(mastery(c.k), gate)}/${gate}`)}${missing.length ? q(false, `Conocé ${missing.join(' ')}`) : ''}${piece ? q(pieceOk, `Pieza ${piece}`) : ''}</span></div>
  </button>`;
}
// Entrenar: abre directo la lección de la sección actual (docs/CURRICULO.md). Los juegos del kanji quedan
// dentro de la lección (2 ejercicios) y como práctica libre desde el resultado (openPractice).
export async function openTraining(c, parent) {
  const sec = curSection(), before = paintedOf(sec.id);
  parent.close();
  const res = await runRound(c, $('#layer'));
  if (!res) return go();
  if (res.skipTest) return skipTest(c, sec);
  const r = endRound(sec.id, res.right, res.total);
  const painted = paintedOf(sec.id), total = sec.reward ? strokesOf(sec.reward) : 0;
  const asleep = r.completed && prizeState(sec.id) === 'asleep';
  const prizeHTML = sec.reward ? `<div class="rd-prize"><span class="rd-ink-box">${inkSVG(sec.reward, before, painted - before)}</span>
    <small>${asleep ? t('round.asleep', { w: WORD[sec.rewardWord]?.kana || '' }) : t('round.strokes', { n: painted, total })}</small></div>` : '';
  // Misma economía que los juegos de entrenamiento: EXP según aciertos, tinta y rango
  const exp = (6 + res.right * 2) * (c.mood > .6 ? 1.2 : 1) * expBonus(c);
  gather(c); if (r.counted) c.insp = Date.now() + 36e5;
  const rk = addXP(6 + res.right * 2), ups = giveExp(c, exp), ink = res.right + ups * 6;
  S.ink += ink; c.know += res.kanjiOk ? 1 : 0; emit('train');
  c.mood = Math.max(0, c.mood - .05); S.stats.trainings++; bump('train'); save();
  const msg = r.completed ? t('round.complete', { title: tr(sec.title) }) + (r.next ? ' ' + t('round.next', { title: tr(r.next.title) }) : '')
    : r.counted ? t('round.counted', { n: r.rounds, total: ROUNDS }) : t('round.notCounted');
  const out = modal(`<div class="result"><div class="res-art">${creatureSVG(c.k, { mood: r.counted ? 1 : .5 })}</div>
    <p><b>${res.right}/${res.total}</b> · +${Math.round(exp * (1 + c.gen * .25))} EXP · +${ink} 墨${ups ? ` · <b class="g">${t('round.levelUp', { lv: c.lv })}</b>` : ''}</p>
    <p class="${r.counted ? 'g' : 'muted'}">${msg}</p>${prizeHTML}
    ${res.words?.length ? `<p class="rd-today-h">${t('round.today')}</p><div class="rd-today">${res.words.filter(id => WORD[id]).slice(0, 6).map(id => `<span><b class="jp">${wordHTML(WORD[id])}</b><small>${tr(WORD[id])}</small></span>`).join('')}</div>` : ''}
    ${evolutionsOf(c.k).some(x => c.lv >= evoLevel(x) && c.lv - ups < evoLevel(x)) ? '<p class="g">✦ ¡Nueva evolución disponible!</p>' : ''}
    <div class="row"><button class="btn ghost" id="again">${t('round.again')}</button><button class="btn ok" id="done">${t('round.continue')}</button></div>
    ${r.completed && !S.cur.skipped[sec.id] ? `<button class="btn gold wide" id="exam">金 ${t('exam.offer')}</button>` : ''}
    <button class="link" id="practice">${t('round.practice', { k: c.k })}</button></div>`);
  $('#exam', out) && ($('#exam', out).onclick = () => { out.close(); openExam(c, sec.id, modal); });
  $('#again', out).onclick = () => { out.close(); openTraining(c, { close() {} }); };
  $('#practice', out).onclick = () => { out.close(); openPractice(c, { close() {} }); };
  $('#done', out).onclick = () => { out.close(); go(); openCreature(c.id); if (rk.length) rankUp(rk); };
  hud();
  // Premios que despertaron (de esta sección o de una anterior que estaba dormida)
  for (const p of r.prizes) await prizeBorn(p);
}

// Prueba «Ya sé esto» (A-05): 10 preguntas sin repetición; con 80 % se saltan sus secciones, sin premio
async function skipTest(c, sec) {
  const res = await runRound(c, $('#layer'), { test: true });
  if (!res) return go();
  const r = passTest(sec.id, res.right, res.total); save();
  const out = modal(`<div class="result"><div class="res-art">${creatureSVG(c.k, { mood: r.ok ? 1 : .6 })}</div>
    <p><b>${res.right}/${res.total}</b></p>
    <p class="${r.ok ? 'g' : 'muted'}">${r.ok ? t('round.testPass', { n: r.secs.length }) + (r.next ? ' ' + t('round.next', { title: tr(r.next.title) }) : '') : t('round.testFail')}</p>
    <div class="row"><button class="btn ok" id="done">${t('round.continue')}</button></div></div>`);
  $('#done', out).onclick = () => { out.close(); go(); };
  hud();
}

// El kanji pintado cobra vida: se hunde en una gota de tinta y nace la criatura (propuesta A-02, pantalla 7)
function prizeBorn({ sec, k, as }) {
  const s = sectionById(sec), n = strokesOf(k);
  return new Promise(done => {
    const m = modal(`<div class="rd-born"><p class="eyebrow">${tr(s.title)}</p>
      <div class="rd-stage"><span class="rd-ink-box">${inkSVG(k, Math.max(0, n - 1), 1)}</span><span class="rd-drip"></span><span class="rd-baby">${creatureSVG(k)}</span></div>
      <h3>${t('round.born', { k })}</h3>
      <p class="muted">${as === 'ink' ? t('round.inkInstead', { k, ink: PRIZE_INK }) : as === 'gate' ? t('round.atGate') : t('round.bornSub', { title: tr(s.title), w: WORD[s.rewardWord]?.kana || '' })}</p>
      <button class="btn ok wide">${t('round.great')}</button></div>`, 'rd-born-m');
    requestAnimationFrame(() => m.querySelector('.rd-born').classList.add('play'));
    buzz(20);
    m.querySelector('.btn').onclick = () => { m.close(); go(); hud(); done(); };
  });
}

// Práctica libre con los juegos del kanji de la criatura (suma EXP, no avanza la sección)
export function openPractice(c, parent) {
  const games = Object.entries(GAMES).filter(([id]) => (id !== 'word' || hasWord(c.k)) && (id !== 'parts' || hasParts(c.k)) && (id !== 'trace' || STROKES[c.k]?.length));
  const m = modal(`<h3>練 ${t('round.practiceTitle', { k: c.k })}</h3><p class="muted">${t('round.free')}</p><div class="games">${games.map(([id, g]) =>
    `<button class="gcard" data-g="${id}"><i>${g.k}</i><b>${g.name}</b><small>${g.desc}</small></button>`).join('')}</div>
    <p class="muted">Saber: ${'●'.repeat(Math.min(5, c.know))}${'○'.repeat(Math.max(0, 5 - c.know))} · la dificultad se adapta</p>`);
  m.querySelectorAll('[data-g]').forEach(b => b.onclick = async () => {
    m.close(); parent.close();
    const stars = await play(b.dataset.g, c.k, c.know, $('#layer'));
    if (stars < 0) return;
    const exp = [3, 10, 16, 24][stars] * (c.mood > .6 ? 1.2 : 1) * expBonus(c);
    gather(c); if (stars >= 2) c.insp = Date.now() + 36e5;
    const rk = addXP(6 + stars * 4);
    const ups = giveExp(c, exp), ink = (stars + ups * 3) * 2;
    S.ink += ink; grade(c.k, stars >= 2); emit('train');
    if (stars >= 2) c.know++;
    c.mood = Math.max(0, c.mood - .05); S.stats.trainings++; bump('train');
    const r = modal(`<div class="result"><div class="stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
      <div class="res-art">${creatureSVG(c.k, { mood: stars >= 2 ? 1 : .5 })}</div>
      <p><b>+${Math.round(exp * (1 + c.gen * .25))} EXP · +${ink} 墨</b>${ups ? ` · <b class="g">¡Nivel ${c.lv}!</b>` : ''}</p>
      ${stars >= 2 ? `<p class="g">✦ ${c.k} está inspirado: produce ×2 tinta durante 1 h</p>` : storyHTML(c.k)}
      ${evolutionsOf(c.k).some(t => c.lv >= evoLevel(t) && c.lv - ups < evoLevel(t)) ? '<p class="g">✦ ¡Nueva evolución disponible!</p>' : ''}
      <div class="row"><button class="btn ghost" id="again">Otra vez</button><button class="btn ok" id="done">Seguir</button></div></div>`);
    $('#again', r).onclick = () => { r.close(); openPractice(c, { close() {} }); };
    $('#done', r).onclick = () => { r.close(); go(); openCreature(c.id); if (rk.length) rankUp(rk); };
    hud();
  });
}

// ---------- Secuencia de evolución / fusión ----------
export function evolveFX(c, to, from = c.acc && KANJI[to].recipes.some(r => r.includes(c.acc)) ? [c.k, c.acc] : [c.k]) {
  const fx = document.createElement('div'); fx.className = 'evofx';
  fx.innerHTML = `<div class="rays"></div><div class="parts">${from.map(k => `<span>${k}</span>`).join('')}</div>
    <div class="old">${creatureSVG(from[0])}</div><div class="new">${creatureSVG(to, { mood: 1 })}</div>
    <div class="evo-cap"><span class="big-k">${to}</span><b>${KANJI[to].m}</b><small>${KANJI[to].on.join('・')} · ${KANJI[to].kun.join('・')}</small><small>${from.join(' + ')} = ${to}</small>${gradeTag(to)}<p class="evo-mn">知 ${KANJI[to].mn}</p><button class="btn ok">¡Genial!</button></div>`;
  if (from[0] === c.k && byId(c.id)) { evolve(c, to); if (settle(c) === 'store') setTimeout(() => toast(`${to} creció y no entra en su lugar: está en el almacén`), 2600); }
  addXP(40);
  document.body.append(fx); buzz([20, 60, 40]); bump('evo');
  save();
  $('.btn', fx).onclick = () => { fx.classList.add('out'); setTimeout(() => fx.remove(), 300); go(); };
}

// Accesorio 部品: piezas útiles para las evoluciones de esta criatura
export function accHTML(c) {
  const useful = [...new Set(evolutionsOf(c.k).flatMap(t => KANJI[t].recipes.filter(r => r.includes(c.k)).flat()).filter(isPiece))];
  if (!useful.length && !c.acc) return '';
  return `<h4>部品 Accesorio</h4><div class="acc-row">${c.acc ? `<div class="acc-on"><span>${c.acc}</span><div><b>${PIECES[c.acc].name}</b><small>${PIECES[c.acc].m} · se consume al evolucionar</small></div><button class="btn ghost" data-eq="">Quitar</button></div>` : ''}
    ${useful.filter(p => p !== c.acc).map(p => `<button class="acc-opt" data-eq="${p}" ${S.pieces[p] ? '' : 'disabled'}><span>${p}</span><small>${PIECES[p].m}<br>${S.pieces[p] ? `Equipar · tenés ${S.pieces[p]}` : 'No tenés'}</small></button>`).join('')}</div>`;
}
