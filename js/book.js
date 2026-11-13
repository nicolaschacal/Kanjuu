// KANJŪ · book.js — cuaderno de entrenamiento (propuesta A-02 aprobada, pantallas 1 y 8; tarea A-06a).
// En la ficha de cada KANJŪ, una tarjeta con la sección actual y su kanji a medio pintar; al tocarla, el cuaderno
// de la etapa: una página por sección con lo que se pintó.
import { t } from './i18n.js';
import { tr } from './lex.js';
import { SECTIONS, STAGES } from './curriculum.js';
import { cur, curSection, roundsOf, inkSVG, paintedOf, prizeState, ROUNDS } from './round.js';
import { creatureSVG } from './creature.js';

// Tarjeta de la ficha (debajo de los botones de acción)
export function bookCardHTML() {
  const s = curSection(), st = STAGES.find(x => x.id === s.stage);
  return `<button class="bk-card" id="bookCard"><span class="rd-ink-box">${s.reward ? inkSVG(s.reward, paintedOf(s.id)) : `<span class="rd-inkk">${s.kanji[0] || '・'}</span>`}</span>
    <span class="bk-t"><b>${tr(s.title)} · ${t('book.progress', { n: roundsOf(s.id), total: ROUNDS })}</b>
    <small>${s.reward ? t('book.hidden') : t('book.noPrize')} · ${tr(st.title)} · ${t('book.open')}</small></span></button>`;
}

// Página de una sección
function pageHTML(s) {
  const c = cur(), done = !!c.done[s.id], here = c.sec === s.id, got = prizeState(s.id);
  let fig, sub, cls = '';
  if (here) { fig = s.reward ? inkSVG(s.reward, paintedOf(s.id)) : `<span class="rd-inkk">${s.kanji[0] || '・'}</span>`; sub = t('book.here', { n: roundsOf(s.id), total: ROUNDS }); cls = 'cur'; }
  else if (!done) { fig = '<span class="rd-inkk q">？</span>'; sub = t('book.blank'); cls = 'next'; }
  else if (c.skipped[s.id]) { fig = `<span class="rd-inkk sm">${s.kanji.slice(0, 3).join('') || '・'}</span>`; sub = t('book.skipped'); }
  else if (got === 'asleep') { fig = inkSVG(s.reward, paintedOf(s.id)); sub = t('book.asleep'); }
  else if (s.reward) { fig = `<span class="bk-mon">${creatureSVG(s.reward)}</span>`; sub = t('book.alive'); }
  else { fig = `<span class="rd-inkk sm">${s.kanji.slice(0, 3).join('') || '・'}</span>`; sub = t('book.done'); }
  return `<div class="bk-page ${cls}">${c.gold[s.id] ? '<span class="bk-seal">金</span>' : ''}<span class="rd-ink-box">${fig}</span><b>${s.id} · ${tr(s.title)}</b><small>${sub}</small></div>`;
}

export function openBook(modal) {
  const s = curSection(), st = STAGES.find(x => x.id === s.stage);
  return modal(`<p class="eyebrow">${tr(st.title)}</p><h3>${t('book.title')}</h3><p class="muted">${t('book.lead')}</p>
    <div class="bk-pages">${SECTIONS.filter(x => x.stage === s.stage).map(pageHTML).join('')}</div>`, 'bk');
}
