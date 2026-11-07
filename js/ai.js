// IA del jugador: la app llama al proveedor directo desde el dispositivo.
// La clave se guarda solo en este dispositivo (nunca en la partida ni en el servidor de KANJŪ).
import { ic } from './icons.js';
import { S, save } from './state.js';
import { KANJI } from './data.js';

const KEY = 'kanjuu.ai.v1';
export const PROVIDERS = {
  gemini: { label: 'Google Gemini', models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'], prefixes: ['AIza'], keyUrl: 'https://aistudio.google.com/apikey', free: true },
  groq: { label: 'Groq', models: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'], prefixes: ['gsk_'], base: 'https://api.groq.com/openai/v1', keyUrl: 'https://console.groq.com/keys', free: true },
  anthropic: { label: 'Anthropic / Claude', models: ['claude-haiku-4-5', 'claude-sonnet-4-5'], prefixes: ['sk-ant-'], keyUrl: 'https://console.anthropic.com/settings/keys' },
  openai: { label: 'OpenAI / ChatGPT', models: ['gpt-5-mini', 'gpt-4.1-mini'], prefixes: ['sk-proj-', 'sk-svcacct-'], base: 'https://api.openai.com/v1', keyUrl: 'https://platform.openai.com/api-keys' },
  openrouter: { label: 'OpenRouter', models: ['google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5', 'deepseek/deepseek-chat'], prefixes: ['sk-or-'], base: 'https://openrouter.ai/api/v1', keyUrl: 'https://openrouter.ai/keys' },
};
export const detect = k => Object.keys(PROVIDERS).find(id => PROVIDERS[id].prefixes.some(p => k.startsWith(p))) || '';

const cfg = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
const setCfg = c => { try { c ? localStorage.setItem(KEY, JSON.stringify(c)) : localStorage.removeItem(KEY); } catch {} };
export const aiOn = () => !!cfg()?.key;
const hint = k => `${k.slice(0, 6)}…${k.slice(-4)}`;

async function call({ provider, key, model }, { system, user, maxTokens = 1400, json = false, timeoutMs = 45000 }) {
  const P = PROVIDERS[provider], signal = AbortSignal.timeout(timeoutMs);
  let url, headers, body;
  if (provider === 'gemini') {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    headers = { 'content-type': 'application/json', 'x-goog-api-key': key };
    body = { system_instruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: .7, ...(json ? { responseMimeType: 'application/json' } : {}) } };
  } else if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages';
    headers = { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' };
    body = { model, max_tokens: maxTokens, temperature: .7, system, messages: [{ role: 'user', content: user }] };
  } else {
    url = P.base + '/chat/completions';
    headers = { 'content-type': 'application/json', authorization: `Bearer ${key}` };
    if (provider === 'openrouter') { headers['HTTP-Referer'] = location.origin; headers['X-Title'] = 'KANJU'; }
    const newer = provider === 'openai' && /^(gpt-5|o\d)/.test(model), reasoning = /gpt-oss/.test(model);
    body = { model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(reasoning ? { reasoning_effort: 'low' } : {}),
      ...(newer ? { max_completion_tokens: Math.max(maxTokens, 2000) } : { max_tokens: reasoning ? Math.max(maxTokens, 2000) : maxTokens, temperature: .7 }),
      ...(json ? { response_format: { type: 'json_object' } } : {}) };
  }
  let r;
  try { r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal }); }
  catch (e) { throw new Error(e?.name === 'TimeoutError' ? 'La IA tardó demasiado en responder.' : 'No se pudo conectar con la IA. Revisá tu conexión.'); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(r.status === 401 || r.status === 403 ? 'La clave no es válida o no tiene permisos.' : r.status === 429 ? 'Tu proveedor de IA está limitando las solicitudes. Esperá un momento.' : String(d?.error?.message || `La IA rechazó la solicitud (${r.status}).`).slice(0, 200));
  const text = provider === 'gemini' ? (d?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('')
    : provider === 'anthropic' ? (d?.content || []).map(p => p.text || '').join('') : String(d?.choices?.[0]?.message?.content || '');
  if (!text.trim()) throw new Error('La IA respondió vacío. Probá de nuevo.');
  S.aiUses = { day: new Date().toISOString().slice(0, 10), n: (S.aiUses?.day === new Date().toISOString().slice(0, 10) ? S.aiUses.n : 0) + 1 };
  return text.trim();
}
const ai = opts => { const c = cfg(); if (!c) throw new Error('Conectá tu IA primero'); return call(c, opts); };

// ---- Cuentos personalizados ----
const GRAMMAR = { g1: 'saludos', g2: 'A は B です, preguntas con か', g3: 'これ/それ/あれ, の posesivo', g4: 'objeto を + verbo en ます (orden sujeto-objeto-verbo)', g5: 'に destino, で lugar de la acción', g6: 'ます / ません / ました / ませんでした', g7: 'adjetivos い y な con です', g8: 'あります/います con が' };
const KANJI_RX = /[㐀-鿿々]/g;
export async function genStory(theme) {
  const kanji = Object.keys(S.dex).filter(k => S.dex[k].owned);
  const byLv = S.creatures.filter(c => !c.egg).sort((a, b) => b.lv - a.lv);
  const cast = [...new Map(byLv.map(c => [c.k, c])).values()].slice(0, 6).sort(() => Math.random() - .5).slice(0, 3);
  const vocab = Object.keys(S.acad?.srs || {}).filter(k => k[0] === 'v').map(k => k.slice(2).split('|')[0]).slice(0, 60);
  const grammar = Object.keys(GRAMMAR).filter(id => S.acad?.done?.[id]).map(id => GRAMMAR[id]);
  const system = `Sos autor de lecturas graduadas de japonés para hispanohablantes principiantes en el juego KANJŪ, donde cada kanji es una criatura.
Reglas estrictas:
- Escribí entre 4 y 7 oraciones cortas en japonés natural y correcto, forma cortés (です/ます).
- Usá SOLO estos kanji: ${kanji.join(' ') || '(ninguno)'}. Cualquier otra palabra va en hiragana o katakana. Nunca uses otros kanji.
- Escribí cada kanji o grupo de kanji seguido de su lectura entre llaves: 木{き}, 森{もり}, 明日{あした}.
- Separá palabras y partículas con un espacio: 木{き} の した で 休{やす}みます。
- Usá preferentemente este vocabulario conocido: ${vocab.join(', ') || 'básico'}.
- Gramática que el alumno ya vio (no uses estructuras mucho más avanzadas): ${grammar.join('; ') || 'A は B です, あります/います'}.
- Las criaturas protagonistas son personajes: ${cast.map(c => `${c.k} (${KANJI[c.k].m})`).join(', ')}. Llamalas por su kanji con lectura y さん.
- Incluí como máximo 2 palabras nuevas útiles.
Respondé SOLO con JSON válido:
{"title":"título corto en español","lines":[{"jp":"oración con kanji{lectura}","es":"traducción"}],"questions":[{"q":"pregunta de comprensión en español","a":"respuesta correcta","wrong":["incorrecta 1","incorrecta 2"]}],"new_words":[{"jp":"palabra en kana","es":"significado"}]}
Incluí 2 o 3 preguntas.`;
  const text = await ai({ system, user: `Escribí una historia nueva${theme ? ` sobre: ${theme}` : ''}.`, json: true });
  const m = text.match(/\{[\s\S]*\}/); if (!m) throw new Error('La IA no devolvió un cuento válido. Probá de nuevo.');
  let st; try { st = JSON.parse(m[0]); } catch { throw new Error('La IA devolvió un formato inválido. Probá de nuevo.'); }
  const allowed = new Set(kanji);
  // Se descartan oraciones con kanji que no tenés o sin lectura
  st.lines = (st.lines || []).filter(l => l?.jp && l?.es).map(l => ({ jp: String(l.jp).slice(0, 200), es: String(l.es).slice(0, 200) }))
    .filter(l => (l.jp.replace(/\{[^}]*\}/g, '').match(KANJI_RX) || []).every(k => allowed.has(k)) && !/[㐀-鿿々](?![㐀-鿿々]*\{)/.test(l.jp));
  if (st.lines.length < 3) throw new Error('La IA usó kanji que todavía no tenés. Probá de nuevo.');
  st.questions = (st.questions || []).filter(q => q?.q && q?.a && Array.isArray(q.wrong)).slice(0, 3).map(q => ({ q: String(q.q), a: String(q.a), wrong: q.wrong.slice(0, 2).map(String) }));
  st.new_words = (st.new_words || []).filter(w => w?.jp && w?.es).slice(0, 2);
  st.title = String(st.title || 'Historia').slice(0, 60);
  save();
  return st;
}
export async function explain(question, given, correct) {
  const t = await ai({ system: 'Sos un profesor de japonés paciente para hispanohablantes principiantes. Explicá en español, en máximo 3 oraciones cortas y simples, por qué la respuesta del alumno es incorrecta y cómo recordar la correcta. Sin markdown.',
    user: `Ejercicio: ${String(question).slice(0, 300)}\nRespuesta del alumno: ${String(given).slice(0, 100)}\nRespuesta correcta: ${String(correct).slice(0, 100)}`, maxTokens: 300 });
  save(); return t.replace(/\*\*/g, '');
}

// ---- Pantalla de configuración ----
export async function openAISettings(modal, toast, onChange) {
  const c = cfg(), uses = S.aiUses?.day === new Date().toISOString().slice(0, 10) ? S.aiUses.n : 0;
  const m = modal(`<h3>${ic('sparkles')} Tu IA</h3>
    <p class="muted">Conectá tu propia clave y KANJŪ escribirá cuentos con tus criaturas, usando solo los kanji y la gramática que ya conocés. También te explicará tus errores.</p>
    ${c ? `<div class="shop-row"><i>✓</i><div><b>${PROVIDERS[c.provider].label}</b><small>${c.model} · ${hint(c.key)} · ${uses} usos hoy</small></div><button class="btn ghost" id="del">Quitar</button></div>` : ''}
    <form class="auth" id="kf">
      <input name="key" type="password" autocomplete="off" placeholder="${c ? 'Pegá una clave nueva para cambiarla' : 'Pegá tu clave de API'}" required>
      <select name="provider" class="sel"><option value="">Detectar automáticamente</option>${Object.entries(PROVIDERS).map(([id, p]) => `<option value="${id}">${p.label}${p.free ? ' · tiene plan gratis' : ''}</option>`).join('')}</select>
      <select name="model" class="sel"></select>
      <p class="err r"></p><button class="btn ok wide" type="submit">Conectar</button>
    </form>
    <p class="muted">${ic('lock')} La clave queda guardada <b>solo en este dispositivo</b>: la app habla directo con tu proveedor y nunca la envía a KANJŪ. Cada historia se cobra en tu cuenta del proveedor (centavos). Gratis: <a href="${PROVIDERS.gemini.keyUrl}" target="_blank" rel="noopener">clave de Gemini</a> · <a href="${PROVIDERS.groq.keyUrl}" target="_blank" rel="noopener">clave de Groq</a>.</p>`);
  const f = m.querySelector('#kf'), sel = f.provider, ms = f.model;
  const fill = () => { const id = sel.value || detect(f.key.value.trim()); ms.innerHTML = id ? PROVIDERS[id].models.map(x => `<option>${x}</option>`).join('') : '<option value="">Modelo (según el proveedor)</option>'; };
  f.key.oninput = fill; sel.onchange = fill; fill();
  f.onsubmit = async e => {
    e.preventDefault();
    const key = f.key.value.trim(), provider = sel.value || detect(key), b = f.querySelector('[type=submit]'), err = f.querySelector('.err');
    if (!provider) { err.textContent = 'No reconocimos el proveedor: elegilo de la lista.'; return; }
    const next = { provider, key, model: ms.value || PROVIDERS[provider].models[0] };
    b.disabled = true; b.textContent = 'Probando la clave…'; err.textContent = '';
    try { await call(next, { system: 'Respondé solo: ok', user: 'ok', maxTokens: 20, timeoutMs: 15000 }); setCfg(next); S.aiOn = true; save(); m.close(); toast('✦ IA conectada · ¡probá un cuento en la Academia!'); onChange?.(); }
    catch (x) { err.textContent = x.message; b.disabled = false; b.textContent = 'Conectar'; }
  };
  m.querySelector('#del')?.addEventListener('click', () => { setCfg(null); S.aiOn = false; save(); m.close(); toast('Clave quitada de este dispositivo'); onChange?.(); });
}
export const aiStatus = async () => aiOn();
