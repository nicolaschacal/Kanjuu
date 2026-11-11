// Analítica de la Academia (S1-02). Recibe lotes de eventos; nunca guarda datos personales.
import { sql, userId, anonId, send } from './_lib.js';

const NAMES = new Set(['lesson_start', 'lesson_end', 'lesson_quit', 'ex_error']);
const MAX = 50;
const str = (v, n = 24) => typeof v === 'string' ? v.slice(0, n) : null;
const int = v => Number.isFinite(+v) ? Math.max(0, Math.min(2 ** 31 - 1, Math.round(+v))) : null;

// La tabla se crea sola la primera vez (idempotente)
let ready = null;
const init = () => ready ??= sql`CREATE TABLE IF NOT EXISTS academy_events (
    id bigserial PRIMARY KEY,
    eid text,
    at timestamptz NOT NULL DEFAULT now(),
    acct text NOT NULL,
    name text NOT NULL,
    lesson text,
    unit text,
    ex text,
    step int,
    ms int,
    data jsonb
  )`.then(() => sql`CREATE INDEX IF NOT EXISTS academy_events_lesson ON academy_events (lesson, name)`)
  .then(() => sql`CREATE UNIQUE INDEX IF NOT EXISTS academy_events_eid ON academy_events (eid)`).catch(e => { ready = null; throw e; });

// Solo se guardan estos campos, con tipo y largo controlados
function clean(e, acct) {
  if (!e || typeof e !== 'object' || !NAMES.has(e.n)) return null;
  const at = int(e.at), now = Date.now();
  const extra = {};
  for (const k of ['mistakes', 'total', 'done', 'best']) if (e[k] != null) extra[k] = int(e[k]);
  for (const k of ['perfect', 'again']) if (e[k] != null) extra[k] = !!e[k];
  if (e.lt) extra.lt = str(e.lt, 12);
  if (e.how) extra.how = str(e.how, 8);
  return {
    at: new Date(at && at > now - 30 * 864e5 && at < now + 6e4 ? at : now).toISOString(),
    eid: str(e.id, 40), acct, name: e.n, lesson: str(e.lesson), unit: str(e.unit), ex: str(e.ex, 12),
    step: e.step != null ? int(e.step) : null, ms: e.ms != null ? int(e.ms) : null, data: extra,
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido' });
  try {
    let b = req.body;
    if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = null; } } // sendBeacon
    if (!b || !Array.isArray(b.events) || !b.events.length) return send(res, 400, { error: 'Sin eventos' });
    if (b.events.length > MAX) return send(res, 413, { error: 'Demasiados eventos' });
    const uid = userId(req);
    const acct = anonId(uid ? `u:${uid}` : `d:${String(b.dev || 'anon').slice(0, 64)}`);
    const rows = b.events.map(e => clean(e, acct)).filter(Boolean);
    if (!rows.length) return send(res, 200, { ok: true, saved: 0 });
    await init();
    await sql`INSERT INTO academy_events (eid, at, acct, name, lesson, unit, ex, step, ms, data)
      SELECT eid, at, acct, name, lesson, unit, ex, step, ms, data
      FROM jsonb_to_recordset(${JSON.stringify(rows)}::jsonb)
      AS x(eid text, at timestamptz, acct text, name text, lesson text, unit text, ex text, step int, ms int, data jsonb)
      ON CONFLICT (eid) DO NOTHING`;
    return send(res, 200, { ok: true, saved: rows.length });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Error del servidor' });
  }
}
