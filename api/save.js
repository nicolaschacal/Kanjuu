import { sql, userId, send } from './_lib.js';

export default async function handler(req, res) {
  const uid = userId(req);
  if (!uid) return send(res, 401, { error: 'Sin sesión' });
  try {
    if (req.method === 'GET') {
      const [s] = await sql`SELECT data, updated_at FROM saves WHERE user_id = ${uid}`;
      return send(res, 200, s || { data: null });
    }
    if (req.method === 'PUT') {
      const data = req.body?.data;
      if (!data || typeof data !== 'object' || !Array.isArray(data.creatures)) return send(res, 400, { error: 'Partida inválida' });
      if (JSON.stringify(data).length > 300_000) return send(res, 413, { error: 'Partida demasiado grande' });
      await sql`INSERT INTO saves (user_id, data, updated_at) VALUES (${uid}, ${JSON.stringify(data)}::jsonb, now())
        ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`;
      return send(res, 200, { ok: true });
    }
    return send(res, 405, { error: 'Método no permitido' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Error del servidor' });
  }
}
