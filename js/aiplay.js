// KANJŪ · aiplay.js — pantallas de cuentos y misiones con IA (propuesta docs/propuestas/A-11b-ia.html, tarea A-11b).
// Desde la ficha de cada KANJŪ: un cuento protagonizado por él o una misión en la que le ayudas, en el mismo salón
// de papel del entrenamiento. Sin IA conectada, la tarjeta lleva a conectarla (Plus o clave propia).
import { S, save, giveExp } from './state.js';
import { mainRead } from './data.js';
import { t } from './i18n.js';
import { kanaHTML, helpOn } from './help.js';
import { speak } from './games.js';
import { WORD, wordHTML, meet, findWord, jaPlain, tr } from './lex.js';
import { verbForms } from './lang.js';
import { creatureSVG } from './creature.js';
import { roomSVG, talkExercise } from './round.js';
import { aiOn, aiLeft, aiStatus, openAISettings } from './ai.js';
import { makeStory, makeMission } from './aigen.js';
import { $, esc, modal, toast, hud } from './main.js';

export const STORY_INK = 15, MISSION_INK = 20, REREAD_INK = 3, LIB_MAX = 20;
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
const lib = () => (S.ai ??= { lib: [], flavor: {} }, S.ai.lib ??= [], S.ai.flavor ??= {}, S.ai);

// Fichas de una oración generada: palabras del diario (con kanji si ya los tienes), partículas y nombres de KANJŪ
export function genHTML(ja, ids) {
  const ws = ids.map(id => WORD[id]).filter(Boolean), names = new Set(S.creatures.map(c => c.k));
  return ja.split(' ').map(tok => {
    if (names.has(tok)) return `<span class="ptok"><ruby class="wk">${tok}${helpOn() ? `<rt>${mainRead(tok)}</rt>` : ''}</ruby></span>`;
    const w = ws.find(x => x.kana === tok || verbForms(x).includes(tok));
    return `<span class="ptok">${w ? wordHTML(w, tok) : kanaHTML(tok, { particle: true })}</span>`;
  }).join('');
}

// ---------- Tarjeta de la ficha ----------
export function aiCardHTML(c) {
  const n = lib().lib.filter(x => x.k === c.k).length;
  return `<button class="bk-card ai-card" id="aiCard"><span class="ai-mark" aria-hidden="true">筆</span>
    <span class="bk-t"><b>${t('aip.card', { k: c.k })}</b><small>${aiOn() ? t('aip.cardOn') : t('aip.cardOff')}${n ? ` · ${t('aip.saved', { n })}` : ''}</small></span></button>`;
}
export function bindAICard(m, c, reopen) {
  const b = $('#aiCard', m); if (!b) return;
  b.onclick = async () => {
    if (!aiOn()) await aiStatus();
    if (!aiOn()) return openAISettings(modal, toast, () => { m.close(); reopen(); });
    m.close(); openHub(c, reopen);
  };
}

// ---------- Menú: cuento, misión y cuentos guardados ----------
function openHub(c, reopen) {
  const left = aiLeft(), saved = lib().lib.filter(x => x.k === c.k);
  const m = modal(`<p class="eyebrow">${t('aip.eyebrow')}</p><h3>${t('aip.card', { k: c.k })}</h3>
    <p class="muted">${t('aip.lead')}</p>
    <div class="ai-picks">
      <button class="ai-pick" data-go="story"><i>読</i><b>${t('aip.story')}</b><small>${t('aip.storySub', { k: c.k, n: STORY_INK })}</small></button>
      <button class="ai-pick" data-go="mission"><i>任</i><b>${t('aip.mission')}</b><small>${t('aip.missionSub', { k: c.k, n: MISSION_INK })}</small></button>
    </div>
    <p class="muted sm ai-left">${left === Infinity ? t('aip.own') : t('aip.left', { n: left })}<button class="link" id="aiCfg">${t('aip.settings')}</button></p>
    ${saved.length ? `<h4>${t('aip.library')}</h4><div class="ai-lib">${saved.map(x => `<button class="ai-book" data-id="${x.id}"><b>${esc(x.title)}</b><small>${new Date(x.at).toLocaleDateString()}</small></button>`).join('')}</div>` : ''}
    <button class="btn ghost wide" id="back">${t('aip.back')}</button>`);
  m.querySelectorAll('[data-go]').forEach(b => b.onclick = () => { m.close(); create(c, b.dataset.go, reopen); });
  m.querySelectorAll('[data-id]').forEach(b => b.onclick = () => { m.close(); const st = lib().lib.find(x => x.id === b.dataset.id); st && playStory(c, st, false, reopen); });
  $('#aiCfg', m).onclick = () => { m.close(); openAISettings(modal, toast, () => openHub(c, reopen)); };
  $('#back', m).onclick = () => { m.close(); reopen(); };
}

async function create(c, kind, reopen) {
  const wait = modal(`<div class="result"><div class="quill">筆</div><h3>${t(kind === 'story' ? 'aip.writing' : 'aip.planning', { k: c.k })}</h3><p class="muted">${t('aip.onlyKnown')}</p></div>`);
  wait.onclick = null;
  let r;
  try { r = kind === 'story' ? await makeStory(c) : await makeMission(c); }
  catch (e) { wait.close(); toast(e.message === 'i+1' ? t('aip.tooHard') : e.message); return openHub(c, reopen); }
  wait.close(); hud();
  if (r.flavor?.length) { lib().flavor[c.k] = r.flavor.slice(0, 5); save(); }
  if (kind === 'story') { const a = lib(); a.lib = [r.story, ...a.lib].slice(0, LIB_MAX); save(); return playStory(c, r.story, true, reopen); }
  return playMission(c, r.mission, reopen);
}

// ---------- Salón de papel (el mismo del entrenamiento) ----------
function room(c, title, n) {
  const wrap = document.createElement('div');
  wrap.className = 'game round rd-lesson ai-play';
  wrap.innerHTML = `<div class="rd-scene">${roomSVG()}<button class="x rd-x" aria-label="${t('dojo.back')}">✕</button>
    <div class="rd-drops">${Array.from({ length: n }, () => '<i></i>').join('')}</div>
    <div class="rd-bub"><span class="who">${c.k}</span><p></p></div><span class="rd-me">${creatureSVG(c.k)}</span><span class="rd-npc"></span></div>
    <p class="rd-sec">${esc(title)}</p><div class="game-body rd-low"></div>`;
  $('#layer').append(wrap);
  const bub = wrap.querySelector('.rd-bub'), scene = wrap.querySelector('.rd-scene'), drops = [...wrap.querySelectorAll('.rd-drops i')];
  return {
    wrap, scene, body: wrap.querySelector('.game-body'),
    say(html, who = c.k) { bub.querySelector('p').innerHTML = html; bub.querySelector('.who').textContent = who; bub.classList.toggle('npc', who !== c.k); bub.classList.remove('pop'); void bub.offsetWidth; bub.classList.add('pop'); },
    paint(i) { drops.forEach((d, j) => { d.classList.toggle('on', j < i); d.classList.toggle('now', j === i); }); },
    close() { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 250); },
  };
}

// ---------- Cuento: se lee oración por oración y después se contesta ----------
function playStory(c, st, fresh, reopen) {
  const qs = st.questions || [], R = room(c, st.title, st.lines.length + qs.length);
  let i = 0, right = 0;
  R.wrap.querySelector('.x').onclick = () => { R.close(); reopen(); };
  const line = () => {
    R.paint(i);
    if (i >= st.lines.length) return ask(0);
    const l = st.lines[i];
    R.say(esc(t('aip.readSay', { n: i + 1, total: st.lines.length })));
    R.body.innerHTML = `<p class="jp qm ai-line">${genHTML(l.ja, l.ids)}</p>
      <button class="link ai-tr">${t('aip.showTr')}</button><p class="ai-trt" hidden>${esc(l.tr)}</p>
      <div class="row"><button class="btn ghost" id="hear">音 ${t('aip.hear')}</button><button class="btn ok" id="nx">${t(i === st.lines.length - 1 && !qs.length ? 'aip.finish' : 'aip.next')}</button></div>`;
    speak(jaPlain(l.ja));
    R.body.querySelector('.ai-tr').onclick = e => { e.target.hidden = true; R.body.querySelector('.ai-trt').hidden = false; };
    R.body.querySelector('#hear').onclick = () => speak(jaPlain(l.ja));
    R.body.querySelector('#nx').onclick = () => { i++; line(); };
  };
  const ask = j => {
    R.paint(st.lines.length + j);
    if (j >= qs.length) return finish();
    const q = qs[j], opts = shuffle([q.a, ...q.wrong]);
    R.say(esc(t('aip.askSay')));
    R.body.innerHTML = `<p class="hint">${esc(q.q)}</p><div class="opts txt">${opts.map((o, x) => `<button class="opt" data-x="${x}">${esc(o)}</button>`).join('')}</div>`;
    R.body.querySelectorAll('.opt').forEach(b => b.onclick = () => {
      R.body.querySelectorAll('.opt').forEach(x => x.disabled = true);
      const ok = opts[+b.dataset.x] === q.a; if (ok) right++;
      b.classList.add(ok ? 'right' : 'wrong');
      if (!ok) R.body.querySelectorAll('.opt')[opts.indexOf(q.a)].classList.add('right');
      R.wrap.querySelector('.rd-me').classList.toggle('happy', ok);
      setTimeout(() => ask(j + 1), ok ? 700 : 1300);
    });
  };
  const finish = () => {
    R.close();
    const ids = [...new Set(st.lines.flatMap(l => l.ids))];
    const ink = fresh ? STORY_INK : REREAD_INK, exp = fresh ? 10 + right * 2 : 3;
    reward(c, { ids, fresh: fresh ? st.fresh : [], ink, exp, bond: fresh ? 2 : 0, line: t('aip.storyDone', { k: c.k, n: right, total: qs.length }) }, reopen);
  };
  line();
}

// ---------- Misión: tres pasos de conversación ----------
function playMission(c, ms, reopen) {
  const R = room(c, ms.title, ms.steps.length);
  let i = 0, right = 0;
  R.wrap.querySelector('.x').onclick = () => { R.close(); reopen(); };
  R.say(esc(ms.ask));
  R.body.innerHTML = `<div class="rd-goal ai-goal"><span class="ai-mark">任</span><span><b>${esc(ms.title)}</b><small>${t('aip.missionGoal', { k: c.k })}</small></span></div><button class="btn ok wide">${t('aip.help')}</button>`;
  R.body.querySelector('.btn').onclick = () => step();
  const step = () => {
    R.paint(i);
    R.scene.classList.remove('talk'); R.wrap.querySelector('.rd-npc').innerHTML = '';
    if (i >= ms.steps.length) return done();
    const s = ms.steps[i];
    R.scene.classList.add('talk'); R.wrap.querySelector('.rd-npc').innerHTML = creatureSVG(s.who);
    R.say(`<span class="jp">${genHTML(s.ja, s.ids)}</span><small>${esc(s.tr)}</small>`, s.who);
    speak(jaPlain(s.ja));
    // talkExercise espera el formato de TALKS: la primera opción es la correcta
    talkExercise({ hint: { es: s.hint, en: s.hint }, opts: s.opts }, R.body, ok => { if (ok) right++; i++; setTimeout(step, 300); });
  };
  const done = () => {
    R.say(esc(ms.thanks));
    R.body.innerHTML = `<button class="btn ok wide">${t('aip.finish')}</button>`;
    R.body.querySelector('.btn').onclick = () => {
      R.close();
      const ids = [...new Set(ms.steps.flatMap(s => [...s.ids, ...s.opts[0].ids]))];
      reward(c, { ids, fresh: ms.fresh, ink: right ? MISSION_INK : 5, exp: 8 + right * 4, bond: right ? 3 : 0, line: t('aip.missionDone', { k: c.k, n: right, total: ms.steps.length }) }, reopen);
    };
  };
}

// ---------- Premio ----------
function reward(c, { ids, fresh, ink, exp, bond, line }, reopen) {
  ids.forEach(id => meet(id, 'ai'));
  fresh.forEach(id => findWord(id, 'ai'));
  const ups = giveExp(c, exp); S.ink += ink; c.bond = (c.bond || 0) + bond; save(); hud();
  const m = modal(`<div class="result"><div class="res-art">${creatureSVG(c.k, { mood: 1 })}</div>
    <p>${esc(line)}</p><p><b>+${ink} 墨</b> · +${Math.round(exp)} EXP${bond ? ` · 絆 +${bond}` : ''}${ups ? ` · <b class="g">${t('round.levelUp', { lv: c.lv })}</b>` : ''}</p>
    ${fresh.length ? `<p class="rd-today-h">${t('aip.newWords')}</p><div class="rd-today">${fresh.map(id => `<span><b class="jp">${wordHTML(WORD[id])}</b><small>${esc(tr(WORD[id]))}</small></span>`).join('')}</div>` : ''}
    <button class="btn ok wide">${t('round.continue')}</button></div>`);
  $('.btn', m).onclick = () => { m.close(); reopen(); };
}
