// Arma app/www con los archivos del juego (el juego no tiene paso de compilación: se copian tal cual).
// Uso: npm run build (dentro de app/) o npm run app:build (en la raíz).
import { cp, rm, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url)), root = path.join(here, '..'), out = path.join(here, 'www');
const COPY = ['index.html', 'manifest.json', 'icon.svg', 'css', 'js', 'locales', 'icons'];
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
for (const f of COPY) await cp(path.join(root, f), path.join(out, f), { recursive: true });
// Las fuentes de Google se piden por internet; el resto queda dentro de la app
const html = await readFile(path.join(out, 'index.html'), 'utf8');
if (!html.includes('js/main.js')) throw new Error('index.html no carga js/main.js');
await writeFile(path.join(out, 'build.json'), JSON.stringify({ at: new Date().toISOString() }));
console.log(`Listo: ${out}`);
