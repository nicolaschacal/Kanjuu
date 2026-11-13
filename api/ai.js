// KANJŪ · /api/ai — IA de la casa (Plus, con cupo) o clave propia del jugador (cifrada en el servidor).
// GET            → estado: { house, plus, used, limit, own: { provider, model, hint } | null, ready }
// POST {action}  → 'key' (guardar clave propia, se prueba antes) · 'delkey' · 'gen' (generar texto)
import { sql, userId, send } from './_lib.js';
import { encryptSecret, decryptSecret, secretHint, cryptoReady, houseTarget, PLUS_MONTHLY, plusByEmail, callAI, PROVIDERS } from './_ailib.js';

const month = () => new Date().toISOString().slice(0, 7); // 2026-11
const MAX_IN = 12000, MAX_TOKENS = 1600;

let ready = null;
function tables() {
  // Tablas nuevas: se crean solas (CLAUDE.md, regla 6)
  ready ??= Promise.all([
    sql`CREATE TABLE IF NOT EXISTS ai_keys (user_id bigint PRIMARY KEY, provider text NOT NULL, model text NOT NULL, base_url text, key_enc text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS ai_usage (user_id bigint NOT NULL, month text NOT NULL, n integer NOT NULL DEFAULT 0, PRIMARY KEY (user_id, month))`,
    sql`CREATE TABLE IF NOT EXISTS plus (user_id bigint PRIMARY KEY, until timestamptz, source text, updated_at timestamptz NOT NULL DEFAULT now())`,
  ]).catch(e => { ready = null; throw e; });
  return ready;
}
async function isPlus(uid) {
  const [u] = await sql`SELECT email FROM users WHERE id = ${uid}`;
  if (plusByEmail(u?.email)) return true;
  const [p] = await sql`SELECT until FROM plus WHERE user_id = ${uid}`;
  return !!p && (!p.until || new Date(p.until) > new Date());
}
async function used(uid) { const [r] = await sql`SELECT n FROM ai_usage WHERE user_id = ${uid} AND month = ${month()}`; return r?.n || 0; }
async function ownKey(uid) { const [r] = await sql`SELECT provider, model, base_url, key_enc FROM ai_keys WHERE user_id = ${uid}`; return r || null; }

export default async function handler(req, res) {
  const uid = userId(req);
  if (!uid) return send(res, 401, { error: 'Sin sesión' });
  try {
    await tables();
    const house = !!houseTarget();
    if (req.method === 'GET') {
      const [plus, n, own] = await Promise.all([isPlus(uid), used(uid), ownKey(uid)]);
      return send(res, 200, { house, plus, used: n, limit: plus && house ? PLUS_MONTHLY() : 0, ready: cryptoReady(),
        own: own ? { provider: own.provider, model: own.model, hint: secretHint(decryptSecret(own.key_enc)) } : null });
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido' });
    const b = req.body || {};

    if (b.action === 'key') {
      if (!cryptoReady()) return send(res, 503, { error: 'La IA propia todavía no está habilitada en el servidor.' });
      const provider = String(b.provider || ''), apiKey = String(b.key || '').trim(), baseUrl = b.baseUrl ? String(b.baseUrl).trim() : null;
      if (!PROVIDERS[provider]) return send(res, 400, { error: 'Proveedor desconocido.' });
      if (apiKey.length < 10 || apiKey.length > 400) return send(res, 400, { error: 'La clave no parece válida.' });
      if (provider === 'custom' && !/^https:\/\//.test(baseUrl || '')) return send(res, 400, { error: 'Falta la dirección de la API (https://…).' });
      const model = String(b.model || PROVIDERS[provider].models[0] || '').slice(0, 120);
      if (!model) return send(res, 400, { error: 'Falta el modelo.' });
      // Se prueba la clave antes de guardarla
      await callAI({ provider, apiKey, model, baseUrl }, { system: 'Responde solo: ok', user: 'ok', maxTokens: 20, timeoutMs: 15000 });
      await sql`INSERT INTO ai_keys (user_id, provider, model, base_url, key_enc, updated_at) VALUES (${uid}, ${provider}, ${model}, ${baseUrl}, ${encryptSecret(apiKey)}, now())
        ON CONFLICT (user_id) DO UPDATE SET provider = EXCLUDED.provider, model = EXCLUDED.model, base_url = EXCLUDED.base_url, key_enc = EXCLUDED.key_enc, updated_at = now()`;
      return send(res, 200, { ok: true, own: { provider, model, hint: secretHint(apiKey) } });
    }
    if (b.action === 'delkey') { await sql`DELETE FROM ai_keys WHERE user_id = ${uid}`; return send(res, 200, { ok: true }); }

    if (b.action === 'gen') {
      const system = String(b.system || '').slice(0, MAX_IN), user = String(b.user || '').slice(0, MAX_IN);
      if (!user) return send(res, 400, { error: 'Pedido vacío.' });
      const opts = { system, user, maxTokens: Math.min(MAX_TOKENS, Math.max(16, +b.maxTokens || 1400)), json: !!b.json };
      // 1) clave propia: sin cupo · 2) IA de la casa para Plus, con cupo mensual
      const own = await ownKey(uid), apiKey = own && decryptSecret(own.key_enc);
      if (apiKey) return send(res, 200, { text: await callAI({ provider: own.provider, apiKey, model: own.model, baseUrl: own.base_url }, opts), via: 'own' });
      const target = houseTarget();
      if (!target) return send(res, 402, { error: 'no_ai', reason: 'house_off' });
      if (!(await isPlus(uid))) return send(res, 402, { error: 'no_ai', reason: 'not_plus' });
      const limit = PLUS_MONTHLY();
      // Reserva el uso antes de llamar (evita pasarse con pedidos en paralelo); si falla, se devuelve
      const [r] = await sql`INSERT INTO ai_usage (user_id, month, n) VALUES (${uid}, ${month()}, 1)
        ON CONFLICT (user_id, month) DO UPDATE SET n = ai_usage.n + 1 WHERE ai_usage.n < ${limit} RETURNING n`;
      if (!r) return send(res, 402, { error: 'no_ai', reason: 'quota', limit });
      try { return send(res, 200, { text: await callAI(target, opts), via: 'house', used: r.n, limit }); }
      catch (e) { await sql`UPDATE ai_usage SET n = GREATEST(0, n - 1) WHERE user_id = ${uid} AND month = ${month()}`; throw e; }
    }
    return send(res, 400, { error: 'Acción desconocida.' });
  } catch (e) {
    if (e?.code) return send(res, e.code >= 400 && e.code < 600 ? e.code : 500, { error: e.message });
    console.error(e);
    return send(res, 500, { error: 'Error del servidor' });
  }
}
