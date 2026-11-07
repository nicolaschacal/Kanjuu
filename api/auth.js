import { sql, hashPass, checkPass, setSession, clearSession, userId, send } from './_lib.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const uid = userId(req);
      if (!uid) return send(res, 200, { user: null });
      const [u] = await sql`SELECT id, email FROM users WHERE id = ${uid}`;
      return send(res, 200, { user: u || null });
    }
    if (req.method !== 'POST') return send(res, 405, { error: 'Método no permitido' });
    const { action, email: rawEmail = '', password = '' } = req.body || {};
    if (action === 'logout') { clearSession(res); return send(res, 200, { ok: true }); }
    const email = String(rawEmail).trim().toLowerCase();
    if (!EMAIL.test(email)) return send(res, 400, { error: 'Email inválido' });
    if (String(password).length < 8) return send(res, 400, { error: 'La contraseña debe tener al menos 8 caracteres' });

    if (action === 'register') {
      const [exists] = await sql`SELECT 1 FROM users WHERE email = ${email}`;
      if (exists) return send(res, 409, { error: 'Ya existe una cuenta con ese email' });
      const [u] = await sql`INSERT INTO users (email, pass) VALUES (${email}, ${hashPass(password)}) RETURNING id, email`;
      setSession(res, u.id);
      return send(res, 200, { user: u });
    }
    if (action === 'login') {
      const [u] = await sql`SELECT id, email, pass FROM users WHERE email = ${email}`;
      if (!u || !checkPass(password, u.pass)) return send(res, 401, { error: 'Email o contraseña incorrectos' });
      setSession(res, u.id);
      return send(res, 200, { user: { id: u.id, email: u.email } });
    }
    return send(res, 400, { error: 'Acción desconocida' });
  } catch (e) {
    console.error(e);
    return send(res, 500, { error: 'Error del servidor' });
  }
}
