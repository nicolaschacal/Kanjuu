// KANJŪ · IA del lado del servidor (docs/CURRICULO.md §7, tarea A-11). Mismo esquema que heey:
// - IA de la casa (KANJUU_AI_*): la paga KANJŪ y la usan los jugadores Plus, con un cupo mensual.
// - Clave propia: cada jugador puede conectar su proveedor; se guarda cifrada (AES-256-GCM con ENCRYPTION_KEY)
//   y nunca vuelve al navegador. Con clave propia no hay cupo.
import crypto from 'node:crypto';

// ---------- Cifrado (mismo sobre que heey y AdmisIA: v1:iv:tag:data) ----------
function key() {
  const base = process.env.ENCRYPTION_KEY;
  if (!base || base.length < 32) throw new Error('ENCRYPTION_KEY no está configurada (mínimo 32 caracteres).');
  return crypto.createHash('sha256').update(base).digest();
}
export const cryptoReady = () => (process.env.ENCRYPTION_KEY || '').length >= 32;
export function encryptSecret(plain) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key(), iv);
  const data = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `v1:${iv.toString('base64')}:${c.getAuthTag().toString('base64')}:${data.toString('base64')}`;
}
export function decryptSecret(payload) {
  if (!payload || !payload.startsWith('v1:')) return '';
  try {
    const [, iv, tag, data] = payload.split(':');
    const d = crypto.createDecipheriv('aes-256-gcm', key(), Buffer.from(iv, 'base64'));
    d.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([d.update(Buffer.from(data, 'base64')), d.final()]).toString('utf8');
  } catch { return ''; }
}
export const secretHint = s => !s ? '' : s.length > 8 ? `••••${s.slice(-4)}` : '••••';

// ---------- Proveedores ----------
export const PROVIDERS = {
  gemini: { models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'] },
  groq: { models: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'], base: 'https://api.groq.com/openai/v1' },
  anthropic: { models: ['claude-haiku-4-5', 'claude-sonnet-4-5'] },
  openai: { models: ['gpt-5-mini', 'gpt-4.1-mini'], base: 'https://api.openai.com/v1' },
  openrouter: { models: ['google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5', 'deepseek/deepseek-chat'], base: 'https://openrouter.ai/api/v1' },
  custom: { models: [] }, // cualquier API compatible con OpenAI (baseUrl obligatoria)
};

// IA de la casa: null hasta que se configure KANJUU_AI_API_KEY
export function houseTarget() {
  const apiKey = process.env.KANJUU_AI_API_KEY;
  if (!apiKey) return null;
  const provider = process.env.KANJUU_AI_PROVIDER || 'gemini';
  return { provider, apiKey, model: process.env.KANJUU_AI_MODEL || PROVIDERS[provider]?.models[0] || 'gemini-2.5-flash', baseUrl: process.env.KANJUU_AI_BASE_URL || null };
}
export const PLUS_MONTHLY = () => Math.max(0, parseInt(process.env.KANJUU_AI_PLUS_MONTHLY || '150', 10) || 0);
// Jugadores Plus a mano (pruebas, regalos) hasta que haya cobro: emails separados por comas
export const plusByEmail = email => (process.env.KANJUU_PLUS_EMAILS || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean).includes(String(email || '').toLowerCase());

// Llamada al proveedor (desde el servidor: la clave nunca pasa por el navegador)
export async function callAI({ provider, apiKey, model, baseUrl }, { system, user, maxTokens = 1400, json = false, timeoutMs = 45000 }) {
  const signal = AbortSignal.timeout(timeoutMs);
  let url, headers, body;
  if (provider === 'gemini') {
    url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    headers = { 'content-type': 'application/json', 'x-goog-api-key': apiKey };
    body = { system_instruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { maxOutputTokens: maxTokens, temperature: .7, ...(json ? { responseMimeType: 'application/json' } : {}) } };
  } else if (provider === 'anthropic') {
    url = 'https://api.anthropic.com/v1/messages';
    headers = { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
    body = { model, max_tokens: maxTokens, temperature: .7, system, messages: [{ role: 'user', content: user }] };
  } else {
    const base = provider === 'custom' ? baseUrl : baseUrl || PROVIDERS[provider]?.base;
    if (!base) throw Object.assign(new Error('Proveedor sin dirección de API.'), { code: 400 });
    url = base.replace(/\/$/, '') + '/chat/completions';
    headers = { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` };
    if (provider === 'openrouter') { headers['HTTP-Referer'] = 'https://kanjuu.app'; headers['X-Title'] = 'KANJU'; }
    const newer = provider === 'openai' && /^(gpt-5|o\d)/.test(model), reasoning = /gpt-oss/.test(model);
    body = { model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(reasoning ? { reasoning_effort: 'low' } : {}),
      ...(newer ? { max_completion_tokens: Math.max(maxTokens, 2000) } : { max_tokens: reasoning ? Math.max(maxTokens, 2000) : maxTokens, temperature: .7 }),
      ...(json ? { response_format: { type: 'json_object' } } : {}) };
  }
  let r;
  try { r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal }); }
  catch (e) { throw Object.assign(new Error(e?.name === 'TimeoutError' ? 'La IA tardó demasiado en responder.' : 'No se pudo conectar con la IA.'), { code: 504 }); }
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(r.status === 401 || r.status === 403 ? 'La clave no es válida o no tiene permisos.' : r.status === 429 ? 'El proveedor de IA está limitando las solicitudes. Espera un momento.' : String(d?.error?.message || `La IA rechazó la solicitud (${r.status}).`).slice(0, 200)), { code: r.status === 429 ? 429 : 502 });
  const text = provider === 'gemini' ? (d?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('')
    : provider === 'anthropic' ? (d?.content || []).map(p => p.text || '').join('') : String(d?.choices?.[0]?.message?.content || '');
  if (!text.trim()) throw Object.assign(new Error('La IA respondió vacío. Prueba de nuevo.'), { code: 502 });
  return text.trim();
}
