// Chequea el currículo del entrenamiento (docs/CURRICULO.md §3) y la base de lengua.
// Uso: node tools/check_curriculo.mjs
import { checkLang } from '../js/lang.js';
import { checkCurriculum, SECTIONS } from '../js/curriculum.js';

const errs = [...checkLang().map(e => `lang · ${e}`), ...checkCurriculum().map(e => `currículo · ${e}`)];
if (errs.length) { console.error(errs.join('\n')); console.error(`\n${errs.length} errores`); process.exit(1); }
const withReward = SECTIONS.filter(s => s.reward).length;
console.log(`Currículo correcto: ${SECTIONS.length} secciones, ${withReward} con recompensa.`);
