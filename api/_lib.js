import { neon } from '@neondatabase/serverless';
import crypto from 'node:crypto';

export const sql = neon(process.env.DATABASE_URL);
const SECRET = process.env.AUTH_SECRET;
const DAYS = 60;

export function hashPass(p) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${crypto.scryptSync(p, salt, 64).toString('hex')}`;
}
export function checkPass(p, stored) {
  const [salt, h] = stored.split(':');
  return crypto.timingSafeEqual(crypto.scryptSync(p, salt, 64), Buffer.from(h, 'hex'));
}
const mac = s => crypto.createHmac('sha256', SECRET).update(s).digest('base64url');
export function setSession(res, uid) {
  const exp = Date.now() + DAYS * 864e5, body = `${uid}.${exp}`;
  res.setHeader('Set-Cookie', `kj=${body}.${mac(body)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${DAYS * 86400}`);
}
export const clearSession = res => res.setHeader('Set-Cookie', 'kj=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0');
export function userId(req) {
  const m = /(?:^|;\s*)kj=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return null;
  const [uid, exp, sig] = m[1].split('.');
  const good = mac(`${uid}.${exp}`);
  if (!sig || sig.length !== good.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(good)) || +exp < Date.now()) return null;
  return Number(uid);
}
export const send = (res, code, obj) => res.status(code).json(obj);
