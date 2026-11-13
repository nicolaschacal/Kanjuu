// IA de KANJŪ (docs/CURRICULO.md §7, tarea A-11). Todo pasa por /api/ai: la clave nunca vive en el navegador.
// - KANJŪ Plus: IA incluida (la de la casa), con un cupo mensual de usos.
// - Clave propia: cualquier jugador con cuenta conecta su proveedor; se guarda cifrada en el servidor y no tiene cupo.
import { ic } from './icons.js';
import { S, save } from './state.js';
import { KANJI } from './data.js';
import { t, lang } from './i18n.js';

export const PROVIDERS = {
  gemini: { label: 'Google Gemini', models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'], prefixes: ['AIza'], keyUrl: 'https://aistudio.google.com/apikey', free: true },
  groq: { label: 'Groq', models: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'], prefixes: ['gsk_'], keyUrl: 'https://console.groq.com/keys', free: true },
  anthropic: { label: 'Anthropic / Claude', models: ['claude-haiku-4-5', 'claude-sonnet-4-5'], prefixes: ['sk-ant-'], keyUrl: 'https://console.anthropic.com/settings/keys' },
  openai: { label: 'OpenAI / ChatGPT', models: ['gpt-5-mini', 'gpt-4.1-mini'], prefixes: ['sk-proj-', 'sk-svcacct-'], keyUrl: 'https://platform.openai.com/api-keys' },
  openrouter: { label: 'OpenRouter', models: ['google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5', 'deepseek/deepseek-chat'], prefixes: ['sk-or-'], keyUrl: 'https://openrouter.ai/keys' },
  custom: { label: 'Otra (compatible con OpenAI)', models: [], prefixes: [] },
};
export const detect = k => Object.keys(PROVIDERS).find(id => PROVIDERS[id].prefixes.some(p => k.startsWith(p))) || '';

// Estado que devuelve el servidor: { house, plus, used, limit, own, ready } · null = sin sesión o sin conexión
let st = null;
const OLD = 'kanjuu.ai.v1'; // clave que versiones anteriores guardaban en el dispositivo
const api = async (body) => {
  const r = await fetch('/api/ai', body ? { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) } : {});
  const d = await r.json().catch(() => ({}));
  return { ok: r.ok, status: r.status, d };
};
const left = () => st ? Math.max(0, (st.limit || 0) - (st.used || 0)) : 0;
export const aiLeft = () => st?.own ? Infinity : houseOn() ? left() : 0;
const houseOn = () => !!(st?.plus && st?.house && st.limit > 0);
export const aiOn = () => !!(st?.own || (houseOn() && left() > 0));

export async function aiStatus() {
  try {
    const r = await api();
    st = r.ok ? r.d : null;
    // Se sube al servidor la clave que una versión anterior dejó en el dispositivo y se borra de aquí
    let old = null; try { old = JSON.parse(localStorage.getItem(OLD)); } catch {}
    if (st && old?.key && !st.own && st.ready) {
      const m = await api({ action: 'key', provider: old.provider, key: old.key, model: old.model });
      if (m.ok) st.own = m.d.own;
      try { localStorage.removeItem(OLD); } catch {}
    }
  } catch { st = null; }
  const on = aiOn();
  if (S.aiOn !== on) { S.aiOn = on; save(); }
  return on;
}

function fail(r) {
  if (r.status === 401) return new Error(t('ai.err.login'));
  if (r.status === 402) return new Error(r.d.reason === 'quota' ? t('ai.err.quota', { n: r.d.limit }) : t('ai.err.none'));
  return new Error(r.d.error || t('ai.err.generic'));
}
export async function ai(opts) {
  let r;
  try { r = await api({ action: 'gen', ...opts }); } catch { throw new Error(t('ai.err.net')); }
  if (!r.ok) { if (r.status === 402 && st) { st.used = st.limit; S.aiOn = aiOn(); } throw fail(r); }
  if (st && r.d.via === 'house') st.used = r.d.used;
  return r.d.text;
}

// ---- Cuentos personalizados ----
const GRAMMAR = { g1: 'saludos', g2: 'A は B です, preguntas con か', g3: 'これ/それ/あれ, の posesivo', g4: 'objeto を + verbo en ます (orden sujeto-objeto-verbo)', g5: 'に destino, で lugar de la acción', g6: 'ます / ません / ました / ませんでした', g7: 'adjetivos い y な con です', g8: 'あります/います con が' };
const KANJI_RX = /[㐀-鿿々]/g;
export async function genStory(theme) {
  const kanji = Object.keys(S.dex).filter(k => S.dex[k].owned);
  const byLv = S.creatures.filter(c => !c.egg).sort((a, b) => b.lv - a.lv);
  const cast = [...new Map(byLv.map(c => [c.k, c])).values()].slice(0, 6).sort(() => Math.random() - .5).slice(0, 3);
  const vocab = Object.keys(S.acad?.srs || {}).filter(k => k[0] === 'v').map(k => k.slice(2).split('|')[0]).slice(0, 60);
  const grammar = Object.keys(GRAMMAR).filter(id => S.acad?.done?.[id]).map(id => GRAMMAR[id]);
  const system = `Eres autor de lecturas graduadas de japonés para hispanohablantes principiantes en el juego KANJŪ, donde cada kanji es una criatura.
Reglas estrictas:
- Escribe entre 4 y 7 oraciones cortas en japonés natural y correcto, forma cortés (です/ます).
- Usa SOLO estos kanji: ${kanji.join(' ') || '(ninguno)'}. Cualquier otra palabra va en hiragana o katakana. Nunca uses otros kanji.
- Escribe cada kanji o grupo de kanji seguido de su lectura entre llaves: 木{き}, 森{もり}, 明日{あした}.
- Separa palabras y partículas con un espacio: 木{き} の した で 休{やす}みます。
- Usa preferentemente este vocabulario conocido: ${vocab.join(', ') || 'básico'}.
- Gramática que el alumno ya vio (no uses estructuras mucho más avanzadas): ${grammar.join('; ') || 'A は B です, あります/います'}.
- Las criaturas protagonistas son personajes: ${cast.map(c => `${c.k} (${KANJI[c.k].m})`).join(', ')}. Llámalas por su kanji con lectura y さん.
- Incluye como máximo 2 palabras nuevas útiles.
Responde SOLO con JSON válido:
{"title":"título corto en español","lines":[{"jp":"oración con kanji{lectura}","es":"traducción"}],"questions":[{"q":"pregunta de comprensión en español","a":"respuesta correcta","wrong":["incorrecta 1","incorrecta 2"]}],"new_words":[{"jp":"palabra en kana","es":"significado"}]}
Incluye 2 o 3 preguntas.`;
  const text = await ai({ system, user: `Escribe una historia nueva${theme ? ` sobre: ${theme}` : ''}.`, json: true });
  const m = text.match(/\{[\s\S]*\}/); if (!m) throw new Error(t('ai.err.story'));
  let s; try { s = JSON.parse(m[0]); } catch { throw new Error(t('ai.err.story')); }
  const allowed = new Set(kanji);
  // Se descartan oraciones con kanji que no tienes o sin lectura
  s.lines = (s.lines || []).filter(l => l?.jp && l?.es).map(l => ({ jp: String(l.jp).slice(0, 200), es: String(l.es).slice(0, 200) }))
    .filter(l => (l.jp.replace(/\{[^}]*\}/g, '').match(KANJI_RX) || []).every(k => allowed.has(k)) && !/[㐀-鿿々](?![㐀-鿿々]*\{)/.test(l.jp));
  if (s.lines.length < 3) throw new Error(t('ai.err.kanji'));
  s.questions = (s.questions || []).filter(q => q?.q && q?.a && Array.isArray(q.wrong)).slice(0, 3).map(q => ({ q: String(q.q), a: String(q.a), wrong: q.wrong.slice(0, 2).map(String) }));
  s.new_words = (s.new_words || []).filter(w => w?.jp && w?.es).slice(0, 2);
  s.title = String(s.title || 'Historia').slice(0, 60);
  return s;
}
export async function explain(question, given, correct, context = '') {
  const L = lang() === 'en' ? 'English' : 'español neutro (tú)';
  const x = await ai({ system: `Eres un profesor de japonés paciente para principiantes. Explica en ${L}, en máximo 3 oraciones cortas y simples, por qué la respuesta del alumno es incorrecta y cómo recordar la correcta. La respuesta correcta es la que se te da: no la discutas ni propongas otra. Sin markdown.`,
    user: `Ejercicio: ${String(question).slice(0, 300)}\nRespuesta del alumno: ${String(given).slice(0, 160)}\nRespuesta correcta: ${String(correct).slice(0, 160)}${context ? `\nPista del juego: ${String(context).replace(/<[^>]+>/g, '').slice(0, 400)}` : ''}`, maxTokens: 300 });
  return x.replace(/\*\*/g, '');
}

// ---- Pantalla de configuración ----
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
export async function openAISettings(modal, toast, onChange) {
  await aiStatus();
  const done = () => { S.aiOn = aiOn(); save(); onChange?.(); };
  if (!st) {
    modal(`<h3>${ic('sparkles')} ${t('ai.title')}</h3><p class="muted">${t('ai.intro')}</p><p>${t('ai.needLogin')}</p>`);
    return;
  }
  const plus = houseOn()
    ? `<div class="shop-row"><i>${ic('sparkles')}</i><div><b>${t('ai.plus.on')}</b><small>${t('ai.plus.left', { n: left(), limit: st.limit })}</small></div></div>`
    : `<div class="shop-row"><i>${ic('sparkles')}</i><div><b>${t('ai.plus.name')}</b><small>${st.plus ? t('ai.plus.soon') : t('ai.plus.off')}</small></div></div>`;
  const own = st.own ? `<div class="shop-row"><i>✓</i><div><b>${esc(PROVIDERS[st.own.provider]?.label || st.own.provider)}</b><small>${esc(st.own.model)} · ${esc(st.own.hint)} · ${t('ai.own.free')}</small></div><button class="btn ghost" id="del">${t('ai.own.remove')}</button></div>` : '';
  const m = modal(`<h3>${ic('sparkles')} ${t('ai.title')}</h3>
    <p class="muted">${t('ai.intro')}</p>
    ${plus}
    <h4>${t('ai.own.title')}</h4>
    <p class="muted">${t('ai.own.intro')}</p>
    ${own}
    ${st.ready ? `<form class="auth" id="kf">
      <input name="key" type="password" autocomplete="off" placeholder="${st.own ? t('ai.own.change') : t('ai.own.paste')}" required>
      <select name="provider" class="sel"><option value="">${t('ai.own.auto')}</option>${Object.entries(PROVIDERS).map(([id, p]) => `<option value="${id}">${id === 'custom' ? t('ai.own.custom') : p.label}${p.free ? ` · ${t('ai.own.freeTier')}` : ''}</option>`).join('')}</select>
      <input name="baseUrl" type="url" placeholder="https://…/v1" hidden>
      <input name="model" list="aiModels" placeholder="${t('ai.own.model')}"><datalist id="aiModels"></datalist>
      <p class="err r"></p><button class="btn ok wide" type="submit">${t('ai.own.connect')}</button>
    </form>
    <p class="muted">${ic('lock')} ${t('ai.own.safe')} <a href="${PROVIDERS.gemini.keyUrl}" target="_blank" rel="noopener">Gemini</a> · <a href="${PROVIDERS.groq.keyUrl}" target="_blank" rel="noopener">Groq</a></p>` : `<p class="muted">${t('ai.own.notReady')}</p>`}`);
  m.querySelector('#del')?.addEventListener('click', async () => {
    const r = await api({ action: 'delkey' }).catch(() => null);
    if (!r?.ok) return toast(t('ai.err.generic'));
    st.own = null; m.close(); toast(t('ai.own.removed')); done();
  });
  const f = m.querySelector('#kf'); if (!f) return;
  const sel = f.provider, dl = m.querySelector('#aiModels');
  const fill = () => {
    const id = sel.value || detect(f.key.value.trim());
    f.baseUrl.hidden = id !== 'custom'; f.baseUrl.required = id === 'custom';
    dl.innerHTML = (PROVIDERS[id]?.models || []).map(x => `<option value="${x}">`).join('');
    if (!PROVIDERS[id]?.models.includes(f.model.value)) f.model.value = PROVIDERS[id]?.models[0] || '';
  };
  f.key.oninput = fill; sel.onchange = fill; fill();
  f.onsubmit = async e => {
    e.preventDefault();
    const key = f.key.value.trim(), provider = sel.value || detect(key), b = f.querySelector('[type=submit]'), err = f.querySelector('.err');
    if (!provider) { err.textContent = t('ai.own.pick'); return; }
    if (provider === 'custom' && !f.model.value.trim()) { err.textContent = t('ai.own.needModel'); return; }
    b.disabled = true; b.textContent = t('ai.own.testing'); err.textContent = '';
    let r; try { r = await api({ action: 'key', provider, key, model: f.model.value.trim(), baseUrl: provider === 'custom' ? f.baseUrl.value.trim() : undefined }); } catch { r = { ok: false, d: { error: t('ai.err.net') } }; }
    if (!r.ok) { err.textContent = r.status === 401 ? t('ai.err.login') : r.d.error || t('ai.err.generic'); b.disabled = false; b.textContent = t('ai.own.connect'); return; }
    st.own = r.d.own; m.close(); toast(t('ai.own.ok')); done();
  };
}
