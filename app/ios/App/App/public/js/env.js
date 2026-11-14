// KANJŪ · env.js — dónde está la API.
// En la web, la API vive en el mismo sitio (direcciones relativas). En la app empaquetada (Capacitor), los archivos
// del juego van dentro de la app y la API se pide al sitio de producción.
const native = !!window.Capacitor?.isNativePlatform?.();
export const NATIVE = native;
export const API = native ? 'https://kanjuu.vercel.app' : '';
// credentials para fetch: en la app la API es otro origen
export const CREDS = native ? 'include' : 'same-origin';
