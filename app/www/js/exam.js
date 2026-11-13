// KANJŪ · exam.js — examen dorado de una sección (docs/CURRICULO.md §6, tarea A-07).
// Es un duelo de la Arena con su misma lógica (tipos 五行, combo, 必殺, reloj por turno): tu KANJŪ que entrenó la
// sección más 2 que elijas, contra las 3 sombras de la sección. Cada ataque es una pregunta de las palabras de la
// sección, sin romaji. Ganar dora la sección: sello 金 en el cuaderno y tinta. No se juegan copas.
import { t } from './i18n.js';
import { S, save } from './state.js';
import { creatureSVG } from './creature.js';
import { addXP } from './world.js';
import { speak } from './games.js';
import { WORD, LEX, tr } from './lex.js';
import { sectionById } from './curriculum.js';
import { cur } from './round.js';
import { startDuel, myTeam, stats } from './arena.js';
import { ic } from './icons.js';

export const GOLD_INK = 40;
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);
export const canExam = id => !!cur().done[id] && !cur().skipped[id];

// Pregunta de examen: qué significa una palabra de la sección (en kana, sin romaji), con el reloj de la Arena
export function examAsk(s) {
  const pool = s.words.filter(id => WORD[id]);
  return (k, root) => new Promise(done => {
    const w = WORD[pool[Math.random() * pool.length | 0]], correct = tr(w);
    const others = shuffle([...s.words.map(id => WORD[id]), ...LEX]).filter(x => x && tr(x) !== correct);
    const opts = shuffle([correct, ...[...new Set(others.map(tr))].slice(0, 3)]);
    const T = 8000, t0 = Date.now();
    const box = document.createElement('div'); box.className = 'chal exam';
    box.innerHTML = `<p>${t('exam.ask')}</p><div class="ck jp">${w.kana}</div><div class="ctime"><i></i></div>
      <div class="copts">${opts.map(o => `<button class="co">${o}</button>`).join('')}</div>`;
    root.append(box);
    requestAnimationFrame(() => requestAnimationFrame(() => { box.querySelector('.ctime i').style.transitionDuration = T + 'ms'; box.querySelector('.ctime i').style.width = '0%'; }));
    let ended = false;
    const end = ok => {
      if (ended) return; ended = true; clearTimeout(to);
      box.querySelectorAll('.co').forEach(b => { b.disabled = true; if (b.textContent === correct) b.classList.add('right'); });
      if (ok) speak(w.kana);
      setTimeout(() => { box.remove(); done({ ok, fast: ok && Date.now() - t0 < 3000, useSpecial: true }); }, ok ? 350 : 1000);
    };
    const to = setTimeout(() => end(false), T);
    box.querySelectorAll('.co').forEach(b => b.onclick = () => { const ok = b.textContent === correct; if (!ok) b.classList.add('wrong'); end(ok); });
  });
}

// Las sombras de la sección: sus 3 rivales, al nivel promedio de tu equipo
function shadows(s, team) {
  const avg = Math.round(team.reduce((n, c) => n + c.lv, 0) / Math.max(1, team.length));
  return s.rival.map((k, j) => ({ id: 's' + j, k, lv: Math.max(1, avg), m: 2, enemy: true, stars: 0 }));
}

// Pantalla previa: equipo (tu KANJŪ + 2 a elegir), rivales y reglas
export function openExam(c, secId, modal) {
  const s = sectionById(secId);
  const pool = () => S.creatures.filter(x => !x.egg && !x.away && x.id !== c.id);
  let mates = myTeam().filter(x => x.id !== c.id).slice(0, 2);
  if (mates.length < 2) mates = [...mates, ...pool().filter(x => !mates.includes(x))].slice(0, 2);
  const card = (x, tag) => `<span class="ex-mon">${creatureSVG(x.k, { gold: x.gold })}<b>${x.k}</b><small>${tag}</small></span>`;
  const m = modal(`<p class="eyebrow">${t('exam.eyebrow', { title: tr(s.title) })}</p><h3>${t('exam.title')}</h3><p class="muted">${t('exam.lead')}</p>
    <div class="ex-vs"><div class="ex-team" id="exTeam"></div><b>VS</b><div class="ex-team foes">${s.rival.map(k => card({ k }, t('exam.shadow', { k }))).join('')}</div></div>
    <ul class="ex-rules"><li>${t('exam.rule1')}</li><li>${t('exam.rule2')}</li><li>${t('exam.rule3')}</li></ul>
    <p class="muted">${t('exam.prize', { ink: GOLD_INK })}</p>
    <button class="btn ok wide" id="exGo">${t('exam.start')}</button>`, 'exam-m');
  const paint = () => {
    m.querySelector('#exTeam').innerHTML = card(c, t('exam.trained')) + mates.map((x, i) => `<button class="ex-slot" data-i="${i}">${card(x, t('exam.change'))}</button>`).join('')
      + (mates.length < 2 ? `<span class="ex-mon empty">${ic('plus')}<small>${t('exam.none')}</small></span>` : '');
    m.querySelectorAll('.ex-slot').forEach(b => b.onclick = () => {
      const free = pool().filter(x => !mates.includes(x)); if (!free.length) return;
      // Rota por los KANJŪ disponibles, del más fuerte al más débil
      free.sort((p, q) => stats(q).atk + stats(q).hp - stats(p).atk - stats(p).hp);
      mates[+b.dataset.i] = free[0]; paint();
    });
  };
  paint();
  m.querySelector('#exGo').onclick = () => {
    m.close();
    const team = [c, ...mates];
    startDuel({
      mine: team, foes: shadows(s, team), rival: t('exam.rivals', { title: tr(s.title) }), ask: examAsk(s),
      end: win => {
        let ink = 0;
        if (win && !cur().gold[secId]) { cur().gold[secId] = Date.now(); ink = GOLD_INK; S.ink += ink; }
        addXP(win ? 20 : 5); save();
        return `<div class="duel-end ${win ? 'win' : 'lose'}"><h2>${win ? t('exam.win') : t('exam.lose')}</h2>
          <p>${win ? (ink ? t('exam.winSub', { title: tr(s.title), ink }) : t('exam.again')) : t('exam.loseSub')}</p>
          <button class="btn ok wide">${t('round.continue')}</button></div>`;
      },
    });
  };
  return m;
}
