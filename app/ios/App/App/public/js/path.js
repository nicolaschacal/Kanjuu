// KANJŪ · path.js — Camino del santuario: capítulos cortos que llevan de la mano las primeras dos semanas (docs/APRENDIZAJE.md §8)
// Cada objetivo se comprueba con el estado real de la partida. Nunca bloquea jugar: es una guía con premio.
import { KANJI, isPiece } from './data.js';
import { S } from './state.js';
import { t } from './i18n.js';
import { foundIds, reviewedWords, canDo, SITUATIONS } from './lex.js';

const ownedN = () => Object.values(S.dex).filter(d => d.owned).length;
const wordsN = () => foundIds().length;
const solidN = () => foundIds().filter(id => S.lex[id].box >= 2).length;
// Un kanji con una pieza en su receta solo se consigue evolucionando con accesorio o fusionando con la pieza
const hasPieceKanji = () => Object.keys(S.dex).some(k => S.dex[k].owned && KANJI[k]?.recipes?.some(r => r.some(isPiece)));

// goal: [clave de texto, valor actual, meta]
export const CHAPTERS = [
  { id: 'c1', title: 'path.c1', ink: 30, goals: [
    ['path.g.hatch', () => S.creatures.filter(c => !c.egg).length, 1],
    ['path.g.pet', () => S.creatures.reduce((a, c) => a + (c.bond || 0), 0), 1],
    ['path.g.train', () => S.stats.trainings || 0, 1],
    ['path.g.harvest', () => S.stats.collected || 0, 1],
  ] },
  { id: 'c2', title: 'path.c2', ink: 40, goals: [
    ['path.g.trip', () => S.stats.trips || 0, 1],
    ['path.g.word', wordsN, 1],
    ['path.g.diary', () => S.path.diary ? 1 : 0, 1],
  ] },
  { id: 'c3', title: 'path.c3', ink: 50, tickets: 1, goals: [
    ['path.g.own', ownedN, 3],
    ['path.g.review', reviewedWords, 1],
    ['path.g.fuse', () => S.stats.fusions || 0, 1],
  ] },
  { id: 'c4', title: 'path.c4', ink: 60, goals: [
    ['path.g.words', wordsN, 8],
    ['path.g.phrases', () => Object.keys(S.phr).length, 3],
    ['path.g.solid', solidN, 5],
    ['path.g.regions', () => Object.keys(S.regionsDone || {}).length, 2],
  ] },
  { id: 'c5', title: 'path.c5', ink: 60, tickets: 1, goals: [
    ['path.g.words', wordsN, 15],
    ['path.g.read', () => Object.keys(S.read).length, 1],
    ['path.g.evolve', () => S.stats.evolutions || 0, 1],
  ] },
  { id: 'c6', title: 'path.c6', ink: 100, tickets: 2, goals: [
    ['path.g.acc', () => hasPieceKanji() ? 1 : 0, 1],
    ['path.g.family', () => (S.fams || []).length, 1],
    ['path.g.cando', () => SITUATIONS.filter(s => canDo(s.id)).length, 1],
    ['path.g.own', ownedN, 12],
  ] },
];
// Capítulo actual: el primero sin cobrar
export const chapter = () => CHAPTERS.find(c => !S.path.claimed.includes(c.id)) || null;
export const goalsOf = c => c.goals.map(([key, cur, need]) => { const n = Math.min(need, cur() || 0); return { text: t(key, { n: need }), n, need, ok: n >= need }; });
export const pathReady = () => { const c = chapter(); return !!c && c.goals.every(([, cur, need]) => (cur() || 0) >= need); };
export function claimChapter() {
  const c = chapter(); if (!c || !pathReady()) return null;
  S.path.claimed.push(c.id); S.ink += c.ink; if (c.tickets) S.tickets = (S.tickets || 0) + c.tickets;
  return c;
}
// Próximo objetivo sin cumplir, para el texto guía del santuario
export function nextGoal() { const c = chapter(); return c ? goalsOf(c).find(g => !g.ok)?.text || null : null; }
// Tarjeta del Camino para la hoja de misiones
export function pathHTML(ic) {
  const c = chapter(), i = CHAPTERS.indexOf(c);
  if (!c) return `<div class="path-card done"><b>${ic('check')} ${t('path.title')}</b><small>${t('path.allDone')}</small></div>`;
  const gs = goalsOf(c), ready = gs.every(g => g.ok);
  return `<div class="path-card ${ready ? 'ready' : ''}"><small class="path-n">${t('path.title')} · ${t('path.chapter', { n: i + 1, total: CHAPTERS.length })}</small><b>${t(c.title)}</b>
    <ul>${gs.map(g => `<li class="${g.ok ? 'ok' : ''}">${ic(g.ok ? 'check' : 'target')}<span>${g.text}</span>${g.need > 1 ? `<em>${g.n}/${g.need}</em>` : ''}</li>`).join('')}</ul>
    <button class="btn ${ready ? 'ok' : 'ghost'} wide" id="pathClaim" ${ready ? '' : 'disabled'}>${t('path.reward', { ink: c.ink })}${c.tickets ? ` · +${c.tickets} 札` : ''}</button>
    <small class="muted">${t('path.note')}</small></div>`;
}
