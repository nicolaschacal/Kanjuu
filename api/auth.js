import crypto from 'node:crypto';
import { sql, hashPass, checkPass, setSession, clearSession, userId, send } from './_lib.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FAILS = 5, WINDOW_MIN = 15, LOCK_MIN = 15;
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

// Código de recuperación: se muestra una sola vez y se guarda con hash
function newCode() {
  const b = crypto.randomBytes(12);
  const s = [...b].map(x => ALPHA[x % ALPHA.length]).join('');
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}
const normCode = c => String(c || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const ip = req => String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

// Límite de intentos por email y por IP
async function locked(keys) {
  const rows = await sql`SELECT key, locked_until FROM login_attempts WHERE key = ANY(${keys}) AND locked_until > now()`;
  return rows.length ? Math.ceil((new Date(rows[0].locked_until) - Date.now()) / 60000) : 0;
}
async function fail(keys) {
  for (const k of keys) {
    await sql`INSERT INTO login_attempts (key, n, first_at) VALUES (${k}, 1, now())
      ON CONFLICT (key) DO UPDATE SET
        n = CASE WHEN login_attempts.first_at < now() - make_interval(mins => ${WINDOW_MIN}) THEN 1 ELSE login_attempts.n + 1 END,
        first_at = CASE WHEN login_attempts.first_at < now() - make_interval(mins => ${WINDOW_MIN}) THEN now() ELSE login_attempts.first_at END`;
    await sql`UPDATE login_attempts SET locked_until = now() + make_interval(mins => ${LOCK_MIN}), n = 0 WHERE key = ${k} AND n >= ${MAX_FAILS}`;
  }
}
const clearFails = keys => sql`DELETE FROM login_attempts WHERE key = ANY(${keys})`;
const lockMsg = m => `Demasiados intentos. Esperá ${m} minuto${m === 1 ? '' : 's'} y probá de nuevo.`;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const uid = userId(req);
      if (!uid) return send(res, 200, { user: null });
      const [u] = await sql`SELECT id, email FROM users WHERE id = ${uid}`;
      return send(res, 200, { user: u || null });
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido' });
    const b = req.body || {}, action = b.action;
    if (action === 'logout') { clearSession(res); return send(res, 200, { ok: true }); }

    // --- Acciones con sesión iniciada ---
    if (['change', 'newcode', 'delete'].includes(action)) {
      const uid = userId(req);
      if (!uid) return send(res, 401, { error: 'Iniciá sesión de nuevo' });
      const keys = [`u:${uid}`];
      const m = await locked(keys); if (m) return send(res, 429, { error: lockMsg(m) });
      const [u] = await sql`SELECT id, pass FROM users WHERE id = ${uid}`;
      if (!u || !checkPass(String(b.password || ''), u.pass)) { await fail(keys); return send(res, 401, { error: 'Contraseña incorrecta' }); }
      await clearFails(keys);
      if (action === 'delete') { await sql`DELETE FROM users WHERE id = ${uid}`; clearSession(res); return send(res, 200, { ok: true }); }
      if (action === 'newcode') { const code = newCode(); await sql`UPDATE users SET recovery = ${hashPass(normCode(code))} WHERE id = ${uid}`; return send(res, 200, { recovery: code }); }
      if (String(b.newPassword || '').length < 8) return send(res, 400, { error: 'La nueva contraseña debe tener al menos 8 caracteres' });
      await sql`UPDATE users SET pass = ${hashPass(b.newPassword)} WHERE id = ${uid}`;
      return send(res, 200, { ok: true });
    }

    const email = String(b.email || '').trim().toLowerCase();
    if (!EMAIL.test(email)) return send(res, 400, { error: 'Email inválido' });
    const keys = [`e:${email}`, `ip:${ip(req)}`];
    const m = await locked(keys); if (m) return send(res, 429, { error: lockMsg(m) });

    if (action === 'register') {
      if (String(b.password || '').length < 8) return send(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres' });
      const [exists] = await sql`SELECT 1 FROM users WHERE email = ${email}`;
      if (exists) return send(res, 409, { error: 'Ya existe una cuenta con ese email' });
      const code = newCode();
      const [u] = await sql`INSERT INTO users (email, pass, recovery) VALUES (${email}, ${hashPass(b.password)}, ${hashPass(normCode(code))}) RETURNING id, email`;
      setSession(res, u.id);
      return send(res, 200, { user: u, recovery: code });
    }
    if (action === 'login') {
      const [u] = await sql`SELECT id, email, pass FROM users WHERE email = ${email}`;
      if (!u || !checkPass(String(b.password || ''), u.pass)) { await fail(keys); return send(res, 401, { error: 'Email o contraseña incorrectos' }); }
      await clearFails(keys); setSession(res, u.id);
      return send(res, 200, { user: { id: u.id, email: u.email } });
    }
    if (action === 'recover') {
      if (String(b.newPassword || '').length < 8) return send(res, 400, { error: 'La nueva contraseña debe tener al menos 8 caracteres' });
      const [u] = await sql`SELECT id, email, recovery FROM users WHERE email = ${email}`;
      if (!u?.recovery || !checkPass(normCode(b.code), u.recovery)) { await fail(keys); return send(res, 401, { error: 'Email o código de recuperación incorrectos' }); }
      const code = newCode(); // el código usado deja de servir
      await sql`UPDATE users SET pass = ${hashPass(b.newPassword)}, recovery = ${hashPass(normCode(code))} WHERE id = ${u.id}`;
      await clearFails(keys); setSession(res, u.id);
      return send(res, 200, { user: { id: u.id, email: u.email }, recovery: code });
    }
    return send(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Error del servidor' });
  }
}
