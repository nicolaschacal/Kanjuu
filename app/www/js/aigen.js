// KANJŪ · aigen.js — cuentos, misiones y frases de sabor con IA (docs/CURRICULO.md §7, tarea A-11b).
// Usa /api/ai (js/ai.js): la IA incluida de Plus o la clave propia del jugador.
// Salvaguarda i+1: la IA escribe en kana con las palabras separadas por espacios y cada ficha se controla contra
// el diario del jugador (S.lex) antes de mostrarse. Solo pasan palabras que ya conoce, partículas y los nombres de sus
// KANJŪ; como mucho un 5 % de palabras nuevas, y solo de la sección actual o la siguiente. Lo que no pasa se descarta
// o se pide de nuevo una vez.
import { S } from './state.js';
import { KANJI, ELEMENTS, FAMILIES, TYPES, typeOf, element, mainRead } from './data.js';
import { LEX, PARTICLES, verbForms } from './lang.js';
import { WORD } from './lex.js';
import { curSection } from './round.js';
import { nextSection } from './curriculum.js';
import { lang } from './i18n.js';
import { ai } from './ai.js';

export const FRESH_MAX = .05; // proporción máxima de palabras nuevas
const PUNCT = /[。、！？!?,.「」『』…・〜~"“”]/g;
const LANG_NAME = { es: 'español neutro (tú)', en: 'English' };

// ---------- Vocabulario permitido ----------
// Base: palabras del diario en caja 2 o más (las que el jugador ya domina); si son pocas, todas las halladas.
export function vocab() {
  const found = LEX.filter(w => S.lex[w.id]);
  let known = found.filter(w => (S.lex[w.id].box || 0) >= 2);
  if (known.length < 20) known = found;
  const s = curSection(), n = nextSection(s.id), ids = new Set(known.map(w => w.id));
  const fresh = [...s.words, ...(n?.words || [])].map(id => WORD[id]).filter(w => w && !ids.has(w.id));
  return { known, fresh };
}
// Nombres de los KANJŪ del jugador que pueden aparecer como personajes (se escriben con su kanji)
export const castNames = () => [...new Set(S.creatures.filter(c => !c.egg).map(c => c.k))];

// ---------- Control i+1 ----------
const has = (w, tok) => w.kana === tok || verbForms(w).includes(tok);
const clean = ja => String(ja || '').replace(/　/g, ' ').replace(PUNCT, ' ').replace(/\s+/g, ' ').trim();
// Revisa una oración; devuelve las fichas resueltas o null si tiene algo que el jugador no puede leer
export function checkLine(ja, { known, fresh, names }) {
  const toks = clean(ja).split(' ').filter(Boolean);
  if (!toks.length || toks.length > 14) return null;
  const ids = [], nw = [], out = [];
  for (const tok of toks) {
    if (PARTICLES.includes(tok)) { out.push(tok); continue; }
    if (names.includes(tok)) { out.push(tok); continue; }
    const w = known.find(x => has(x, tok));
    if (w) { ids.push(w.id); out.push(tok); continue; }
    const f = fresh.find(x => has(x, tok));
    if (f) { ids.push(f.id); nw.push(f.id); out.push(tok); continue; }
    return null;
  }
  return { ja: out.join(' '), ids: [...new Set(ids)], fresh: nw, size: toks.length };
}
// Revisa un texto entero (varias oraciones): descarta las que no pasan y controla el 5 % de palabras nuevas
export function checkText(lines, v) {
  const ok = [], bad = [];
  let size = 0, nw = 0;
  for (const l of lines) {
    const r = checkLine(l.ja, v);
    if (!r) { bad.push(l.ja); continue; }
    if (nw + r.fresh.length > Math.max(1, Math.floor((size + r.size) * FRESH_MAX))) { bad.push(l.ja); continue; }
    size += r.size; nw += r.fresh.length;
    ok.push({ ...l, ja: r.ja, ids: r.ids, fresh: r.fresh });
  }
  return { ok, bad, fresh: [...new Set(ok.flatMap(l => l.fresh))] };
}

// ---------- Perfil de la criatura ----------
export function profile(c) {
  const K = KANJI[c.k], el = element(c.k), ty = TYPES[typeOf(c.k)];
  const fam = FAMILIES.filter(f => f.root === c.k || f.members.includes(c.k)).flatMap(f => [f.root, ...f.members]).filter(k => k !== c.k && S.dex[k]?.owned);
  return { k: c.k, meaning: K.m, element: ELEMENTS[el][2], type: `${ty.k} ${ty.name}`, family: [...new Set(fam)].slice(0, 6), lv: c.lv, bond: c.bond || 0, read: mainRead(c.k) };
}
const profileText = p => `${p.k} (lectura ${p.read}, significa «${p.meaning}»), elemento ${p.element}, tipo ${p.type}, nivel ${p.lv}, vínculo ${p.bond}${p.family.length ? `, su familia de kanji: ${p.family.join(' ')}` : ''}`;
// Lista compacta de palabras para el pedido: kana = significado, y los verbos con sus formas más usadas
const listText = ws => ws.slice(0, 160).map(w => {
  const m = w[lang()] || w.es;
  if (w.kind === 'v') return `${verbForms(w).slice(0, 4).join('/')}${w.te ? '/' + w.te : ''} = ${m}`;
  return `${w.kana} = ${m}`;
}).join('; ');

function rules(v, names) {
  return `Reglas estrictas de escritura japonesa:
- Escribe SOLO en hiragana o katakana, sin kanji, con un espacio entre cada palabra y cada partícula: わたし は みず を のみます
- Usa SOLO estas palabras, exactamente en estas formas: ${listText(v.known)}.
- Partículas y fórmulas permitidas: ${PARTICLES.join(' ')}.
- Los personajes son KANJŪ y se nombran con su kanji como palabra suelta: ${names.join(' ')} (por ejemplo: ${names[0] || '木'} さん は …).
- Puedes usar como mucho UNA palabra nueva de esta lista: ${listText(v.fresh) || '(ninguna)'}.
- Oraciones cortas (de 2 a 10 palabras), naturales y correctas. Si una idea no se puede decir con estas palabras, no la digas.
- Sin signos de puntuación.`;
}
const parse = text => { const m = String(text).match(/\{[\s\S]*\}/); if (!m) return null; try { return JSON.parse(m[0]); } catch { return null; } };
const str = (x, n = 200) => String(x ?? '').slice(0, n);

// ---------- Cuento protagonizado por una criatura ----------
export async function makeStory(c, theme = '') {
  const v = { ...vocab(), names: castNames() }, p = profile(c), L = LANG_NAME[lang()] || LANG_NAME.es;
  const cast = [c.k, ...v.names.filter(k => k !== c.k).sort(() => Math.random() - .5).slice(0, 2)];
  const system = `Eres autor de lecturas graduadas de japonés para principiantes en el juego KANJŪ, donde cada kanji es una criatura con personalidad.
${rules(v, cast)}
Protagonista: ${profileText(p)}. Su personalidad sale de su significado y su elemento. Otros personajes posibles: ${cast.slice(1).join(' ') || '(ninguno)'}.
Traducciones, título y preguntas en ${L}.
Responde SOLO con JSON válido:
{"title":"título corto","lines":[{"ja":"oración en kana con espacios","tr":"traducción"}],"questions":[{"q":"pregunta de comprensión","a":"respuesta correcta","wrong":["incorrecta 1","incorrecta 2"]}],"flavor":[{"ja":"frase muy corta que diría ${c.k}","tr":"traducción"}]}
Escribe de 5 a 7 oraciones, 2 o 3 preguntas y 3 frases de sabor (de 1 a 4 palabras, con la personalidad de ${c.k}).`;
  return generate(system, `Escribe un cuento nuevo de ${c.k}${theme ? ` sobre: ${theme}` : ''}.`, v, d => {
    const r = checkText((d.lines || []).filter(l => l?.ja && l?.tr).map(l => ({ ja: str(l.ja), tr: str(l.tr) })), v);
    if (r.ok.length < 4) return { bad: r.bad };
    const qs = (d.questions || []).filter(q => q?.q && q?.a && Array.isArray(q.wrong) && q.wrong.length >= 2).slice(0, 3)
      .map(q => ({ q: str(q.q), a: str(q.a, 80), wrong: q.wrong.slice(0, 2).map(x => str(x, 80)) }));
    const fl = checkText((d.flavor || []).filter(l => l?.ja && l?.tr).map(l => ({ ja: str(l.ja, 60), tr: str(l.tr, 80) })), { ...v, fresh: [], names: [] }).ok.filter(l => l.ids.length);
    return { story: { id: `s${Date.now().toString(36)}`, kind: 'story', k: c.k, title: str(d.title || '—', 60), lines: r.ok, questions: qs, fresh: r.fresh, at: Date.now() }, flavor: fl };
  });
}

// ---------- Misión: la criatura necesita ayuda y tú contestas en japonés ----------
export async function makeMission(c) {
  const v = { ...vocab(), names: castNames() }, p = profile(c), L = LANG_NAME[lang()] || LANG_NAME.es;
  const npcs = v.names.filter(k => k !== c.k).sort(() => Math.random() - .5).slice(0, 2);
  const system = `Diseñas misiones cortas para el juego KANJŪ (aprender japonés con criaturas kanji).
${rules(v, [c.k, ...npcs])}
La criatura ${profileText(p)} le pide ayuda al jugador con algo pequeño y cotidiano que se pueda resolver con estas palabras. En cada paso un personaje (${npcs.join(' ') || 'una persona'}) dice algo en japonés y el jugador elige qué contestar: una respuesta correcta y dos que no corresponden (también con las palabras permitidas).
Textos en ${L}.
Responde SOLO con JSON válido:
{"title":"título corto","ask":"lo que ${c.k} le pide al jugador, en una oración","steps":[{"who":"kanji del personaje que habla","ja":"lo que dice, en kana con espacios","tr":"traducción","hint":"qué tiene que hacer el jugador","opts":["respuesta correcta en kana","incorrecta","incorrecta"]}],"thanks":"cómo agradece ${c.k}, en una oración"}
Exactamente 3 pasos.`;
  return generate(system, `Arma una misión nueva para ${c.k}.`, v, d => {
    const steps = [], bad = [];
    for (const s of (d.steps || []).slice(0, 3)) {
      const line = checkLine(s?.ja, v), opts = (s?.opts || []).slice(0, 3).map(o => checkLine(o, { ...v, fresh: [] }));
      if (!line || opts.length < 3 || opts.some(o => !o) || new Set(opts.map(o => o.ja)).size < 3) { bad.push(s?.ja); continue; }
      steps.push({ who: v.names.includes(s.who) ? s.who : npcs[0] || '人', ja: line.ja, ids: line.ids, fresh: line.fresh, tr: str(s.tr), hint: str(s.hint, 120), opts: opts.map(o => ({ ja: o.ja, ids: o.ids })) });
    }
    if (steps.length < 3) return { bad };
    return { mission: { id: `m${Date.now().toString(36)}`, kind: 'mission', k: c.k, title: str(d.title || '—', 60), ask: str(d.ask, 160), thanks: str(d.thanks, 160), steps, fresh: [...new Set(steps.flatMap(s => s.fresh))], at: Date.now() } };
  });
}

// Pide a la IA y controla; si no pasa el control i+1, se pide una vez más diciendo qué falló
async function generate(system, user, v, build) {
  let msg = user;
  for (let i = 0; i < 2; i++) {
    const d = parse(await ai({ system, user: msg, json: true, maxTokens: 1500 }));
    const r = d ? build(d) : { bad: [] };
    if (!r.bad) return r;
    msg = `${user}\nEl intento anterior usó palabras o formas que no estaban en la lista: ${r.bad.filter(Boolean).slice(0, 4).join(' · ') || 'formato inválido'}. Usa solo las palabras permitidas, en kana y separadas por espacios.`;
  }
  throw new Error('i+1');
}
