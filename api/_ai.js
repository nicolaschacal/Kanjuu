// Adaptadores de proveedores de IA (portado de heey.me). Cada jugador trae su propia clave.
import crypto from 'node:crypto';

export const PROVIDERS = {
  anthropic: { label: 'Anthropic / Claude', model: 'claude-haiku-4-5', models: ['claude-haiku-4-5', 'claude-sonnet-4-5'], prefixes: ['sk-ant-'], keyUrl: 'https://console.anthropic.com/settings/keys' },
  gemini: { label: 'Google Gemini', model: 'gemini-2.5-flash', models: ['gemini-2.5-flash', 'gemini-2.5-flash-lite'], prefixes: ['AIza'], keyUrl: 'https://aistudio.google.com/apikey' },
  openai: { label: 'OpenAI / ChatGPT', model: 'gpt-5-mini', models: ['gpt-5-mini', 'gpt-4.1-mini'], prefixes: ['sk-proj-', 'sk-svcacct-'], base: 'https://api.openai.com/v1', keyUrl: 'https://platform.openai.com/api-keys' },
  groq: { label: 'Groq', model: 'openai/gpt-oss-120b', models: ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'], prefixes: ['gsk_'], base: 'https://api.groq.com/openai/v1', keyUrl: 'https://console.groq.com/keys' },
  openrouter: { label: 'OpenRouter', model: 'google/gemini-2.5-flash', models: ['google/gemini-2.5-flash', 'anthropic/claude-haiku-4.5'], prefixes: ['sk-or-'], base: 'https://openrouter.ai/api/v1', keyUrl: 'https://openrouter.ai/keys' },
  deepseek: { label: 'DeepSeek', model: 'deepseek-chat', models: ['deepseek-chat'], prefixes: [], base: 'https://api.deepseek.com/v1', keyUrl: 'https://platform.deepseek.com/api_keys' },
  mistral: { label: 'Mistral', model: 'mistral-small-latest', models: ['mistral-small-latest'], prefixes: [], base: 'https://api.mistral.ai/v1', keyUrl: 'https://console.mistral.ai/api-keys' },
};
export function detectProvider(key) {
  for (const [id, p] of Object.entries(PROVIDERS)) if (p.prefixes.some(x => key.startsWith(x))) return id;
  return null;
}

const KEY = () => Buffer.from(process.env.AI_ENC_KEY || '', 'hex');
export function encrypt(plain) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', KEY(), iv);
  const data = Buffer.concat([c.update(plain, 'utf8'), c.final()]);
  return `v1:${iv.toString('base64')}:${c.getAuthTag().toString('base64')}:${data.toString('base64')}`;
}
export function decrypt(p) {
  try {
    const [, iv, tag, data] = p.split(':');
    const d = crypto.createDecipheriv('aes-256-gcm', KEY(), Buffer.from(iv, 'base64'));
    d.setAuthTag(Buffer.from(tag, 'base64'));
    return Buffer.concat([d.update(Buffer.from(data, 'base64')), d.final()]).toString('utf8');
  } catch { return ''; }
}
export const hint = k => `${k.slice(0, 6)}…${k.slice(-4)}`;

export class AIError extends Error { constructor(m, status) { super(m); this.status = status; } }

export async function generate({ provider, apiKey, model }, { system, user, maxTokens = 1200, json = false, timeoutMs = 45000 }) {
  const P = PROVIDERS[provider]; if (!P) throw new AIError('Proveedor desconocido');
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
    url = P.base + '/chat/completions';
    headers = { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` };
    if (provider === 'openrouter') { headers['HTTP-Referer'] = 'https://kanjuu.vercel.app'; headers['X-Title'] = 'KANJU'; }
    const newer = provider === 'openai' && /^(gpt-5|o\d)/.test(model), reasoning = /gpt-oss/.test(model);
    body = {
      model, messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      ...(reasoning ? { reasoning_effort: 'low' } : {}),
      ...(newer ? { max_completion_tokens: Math.max(maxTokens, 2000) } : { max_tokens: reasoning ? Math.max(maxTokens, 2000) : maxTokens, temperature: .7 }),
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    };
  }
  let r;
  try { r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body), signal }); }
  catch (e) { throw new AIError(e?.name === 'TimeoutError' ? 'La IA tardó demasiado en responder.' : 'No se pudo conectar con la IA.', 503); }
  const raw = await r.text(); let d = {}; try { d = JSON.parse(raw); } catch {}
  if (!r.ok) throw new AIError(String(d?.error?.message || d?.message || `La IA rechazó la solicitud (HTTP ${r.status}).`).slice(0, 240), r.status);
  const text = provider === 'gemini' ? (d?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('')
    : provider === 'anthropic' ? (d?.content || []).map(p => p.text || '').join('') : String(d?.choices?.[0]?.message?.content || '');
  if (!text.trim()) throw new AIError('La IA respondió vacío.', 502);
  return text.trim();
}
export function parseJSON(t) {
  const m = t.match(/\{[\s\S]*\}/); if (!m) throw new AIError('Respuesta sin JSON.', 502);
  return JSON.parse(m[0]);
}
