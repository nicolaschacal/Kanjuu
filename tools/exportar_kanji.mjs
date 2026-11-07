// Exporta el árbol de kanji para la simulación: node tools/exportar_kanji.mjs
import { writeFileSync } from 'node:fs';
import { KANJI, REGIONS, depth } from '../js/data.js';
const K = {}; for (const k in KANJI) K[k] = { r: KANJI[k].recipes || null, dep: depth(k) };
writeFileSync('tools/kanji.json', JSON.stringify({ K, R: REGIONS.map(r => ({ need: r.need, drops: r.drops, secs: r.secs })) }));
