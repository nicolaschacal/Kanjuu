// IA del jugador: clave propia, cuentos personalizados y explicaciones de errores.
import { S, save } from './state.js';
import { KANJI } from './data.js';
import * as cloud from './cloud.js';

let status = null; // { key, providers }
const api = async (method, body) => {
  const r = await fetch('/api/ai', { method, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error(j.error || 'Sin conexión'); return j;
};
export const aiOn = () => !!(cloud.user && S.aiOn);
export async function aiStatus() { status = await api('GET'); S.aiOn = !!status.key; save(); return status; }

const GRAMMAR = { g1: 'saludos', g2: 'A は B です, preguntas con か', g3: 'これ/それ/あれ, の posesivo', g4: 'objeto を + verbo en ます (orden sujeto-objeto-verbo)', g5: 'に destino, で lugar de la acción', g6: 'ます / ません / ました / ませんでした', g7: 'adjetivos い y な con です', g8: 'あります/います con が' };
export function storyContext(theme) {
  const kanji = Object.keys(S.dex).filter(k => S.dex[k].owned);
  const placed = S.creatures.filter(c => !c.egg).sort((a, b) => b.lv - a.lv);
  const cast = [...new Map(placed.map(c => [c.k, c])).values()].slice(0, 6).sort(() => Math.random() - .5).slice(0, 3);
  const done = S.acad?.done || {};
  return {
    kanji, theme,
    creatures: cast.map(c => ({ k: c.k, m: KANJI[c.k].m })),
    vocab: Object.keys(S.acad?.srs || {}).filter(k => k[0] === 'v').map(k => k.slice(2).split('|')[0]),
    grammar: Object.keys(GRAMMAR).filter(id => done[id]).map(id => GRAMMAR[id]),
  };
}
export async function genStory(theme) { return (await api('POST', { action: 'story', ...storyContext(theme) })).story; }
export async function explain(question, given, correct) { return (await api('POST', { action: 'explain', question, given, correct })).text; }

export async function openAISettings(modal, toast, onChange) {
  if (!cloud.user) return toast('Creá una cuenta (botón 我) para conectar tu IA');
  let st;
  try { st = await aiStatus(); } catch (e) { return toast(e.message); }
  const P = st.providers, k = st.key;
  const m = modal(`<h3>✨ Tu IA</h3>
    <p class="muted">Conectá tu propia clave de IA y KANJŪ escribirá cuentos con tus criaturas, solo con los kanji y la gramática que ya conocés. También explicará tus errores.</p>
    ${k ? `<div class="shop-row"><i>✓</i><div><b>${P[k.provider].label}</b><small>${k.model} · ${k.hint}</small></div><button class="btn ghost" id="del">Quitar</button></div>` : ''}
    <form class="auth" id="kf">
      <input name="apiKey" type="password" autocomplete="off" placeholder="${k ? 'Pegá una clave nueva para cambiarla' : 'Pegá tu clave de API'}" required>
      <select name="provider" class="sel"><option value="">Detectar automáticamente</option>${Object.entries(P).map(([id, p]) => `<option value="${id}">${p.label}</option>`).join('')}</select>
      <select name="model" class="sel"></select>
      <p class="err r"></p><button class="btn ok wide" type="submit">Conectar</button>
    </form>
    <p class="muted">La clave se guarda cifrada en el servidor y nunca vuelve a tu navegador. Cada historia usa tu cuenta del proveedor (centavos por historia). ¿No tenés? Gemini y Groq tienen planes gratuitos: <a href="${P.gemini.keyUrl}" target="_blank" rel="noopener">clave de Gemini</a> · <a href="${P.groq.keyUrl}" target="_blank" rel="noopener">clave de Groq</a>.</p>`);
  const f = m.querySelector('#kf'), sel = f.provider, ms = f.model;
  const detect = v => v.startsWith('sk-ant-') ? 'anthropic' : v.startsWith('AIza') ? 'gemini' : v.startsWith('gsk_') ? 'groq' : v.startsWith('sk-or-') ? 'openrouter' : /^sk-(proj|svcacct)-/.test(v) ? 'openai' : '';
  const fill = () => { const id = sel.value || detect(f.apiKey.value.trim()); ms.innerHTML = id ? P[id].models.map(x => `<option>${x}</option>`).join('') : '<option value="">Modelo (según el proveedor)</option>'; };
  f.apiKey.oninput = fill; sel.onchange = fill; fill();
  f.onsubmit = async e => {
    e.preventDefault(); const b = f.querySelector('[type=submit]'); b.disabled = true; b.textContent = 'Probando la clave…'; f.querySelector('.err').textContent = '';
    try { await api('PUT', { apiKey: f.apiKey.value.trim(), provider: sel.value || undefined, model: ms.value || undefined }); S.aiOn = true; save(); m.close(); toast('✨ IA conectada · ¡probá un cuento en la Academia!'); onChange?.(); }
    catch (err) { f.querySelector('.err').textContent = err.message; b.disabled = false; b.textContent = 'Conectar'; }
  };
  m.querySelector('#del')?.addEventListener('click', async () => { await api('DELETE'); S.aiOn = false; save(); m.close(); toast('Clave quitada'); onChange?.(); });
}
