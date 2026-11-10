# KANJŪ · 漢獣 — Santuario de criaturas kanji

Juego mobile-first (2D, vertical) donde cada kanji es una criatura viva. Prototipo jugable del loop completo.

**Jugar:** abrir `index.html` con cualquier servidor estático (`python3 -m http.server`). Sin build, sin dependencias. Instalable como PWA.

## Loop
Santuario → mimar → entrenar (minijuegos) → EXP → evolución ramificada → fusión → expediciones → nuevas criaturas → mejoras → renacimiento.

## Sistemas del MVP
- **Santuario vivo:** criaturas SVG que caminan, parpadean, reaccionan al toque y muestran emociones. Objetivo guiado (目標) siempre visible.
- **Entrenamiento** (no todo es quiz): 書 trazo con el dedo (evaluado por cobertura/precisión), 読 atrapar lecturas en burbujas, 語 completar palabras. Dificultad adaptativa según el "saber" de cada criatura.
- **Evolución por EXP** ramificada (木 → 林 / 森 / 休 / 本). Requiere nivel y conocer los otros componentes.
- **Fusión:** solo composiciones documentadas; 2 o 3 componentes; el resultado es el mismo kanji que por evolución.
- **Expediciones** asíncronas y cortas (45 s – 4 min), sin GPS. Desbloqueo de regiones por colección.
- **Renacimiento:** a Lv MAX vuelve a ser huevo de su raíz con +25% EXP permanente por generación; queda en el linaje.
- **Retención sin castigo:** misiones diarias (perder un día no quita nada), logros, códice, mejoras del santuario con tinta 墨.

## Niveles
- `composition_depth` se calcula desde la receta canónica (`recipes[0]`).
- Nivel KANJŪ = `min(5, depth + 1)`. Independiente de la clasificación lingüística de Zen'nyoji.

## Estructura
```
js/main.js       arranque, barra superior, objetivos, navegación
js/sanctuary.js  santuario en grilla, construir, almacén, rango
js/sheet.js      ficha de criatura, entrenamiento, evolución
js/lab.js        laboratorio de fusión
js/trips.js      viajes
js/atlas.js      atlas, logros, misiones
js/shop.js       tienda, altar, calendario, kana
js/dojo.js       repaso del día (kanji + kana + vocabulario)
js/account.js    cuenta, recuperación, borrar cuenta
js/academy.js    Academia (camino, lecciones, lecturas)   js/course.js  contenido del curso
js/world.js      grilla, producción, objetos, altar        js/state.js   guardado y SRS
js/games.js      minijuegos                                js/strokes.js trazos KanjiVG (CC BY-SA 3.0)
js/tutorial.js   primera sesión guiada                     js/ai.js      IA propia (desde el dispositivo)
js/i18n.js       idiomas: t('clave'), locales/*.json      tools/check_i18n.mjs  chequeo de claves
api/             auth (límite de intentos, recuperación, borrar cuenta) y guardado
tools/           simulación de economía                    docs/ECONOMIA.md
```

## Aprendizaje
Dojo con repetición espaciada (Leitner), recuperación activa, intercalado de tipos de pregunta, mnemotecnias por kanji (y propias del jugador), audio japonés y descomposición en componentes. Evolucionar exige haber acertado el kanji al menos una vez.

## Economía y santuario
- Grilla de 6 columnas: nivel 1 ocupa 1×1, nivel 2 ocupa 2×1, nivel 3 ocupa 2×2. Objetos también ocupan casillas.
- Las criaturas colocadas producen tinta 墨 por hora: más si su kanji está dominado (maestría), si están felices, despiertas (★), doradas o junto a objetos con aura. Entrenarlas las inspira (×2 durante 1 h).
- Almacén 蔵 para lo que no está en juego; la puerta 門 recibe lo que no entra.
- Altar 召: invocaciones con tinta o boletos, piedad visible, variantes doradas; los duplicados despiertan estrellas.
- Rango de guardián: sube con todo lo que hacés y desbloquea terreno y objetos. Calendario de 7 días que no se reinicia.
- Lógica en `js/world.js`.

Ver `ROADMAP.md` para el plan hacia las tiendas.

## Cuentas y nube
- Vercel Functions en `api/` (`auth.js`, `save.js`) + Postgres en Neon (tablas `users`, `saves`).
- Contraseñas con scrypt + sal; sesión en cookie HttpOnly firmada (HMAC, 60 días).
- Variables de entorno en Vercel: `DATABASE_URL`, `AUTH_SECRET`.
- El juego funciona sin cuenta y sin conexión; al iniciar sesión se compara la partida local con la de la nube.

## IA propia (opcional)
Cada jugador conecta su clave (Gemini, Groq, Claude, OpenAI u OpenRouter) desde 我 → ✨ o desde la Academia.
La app llama al proveedor **directo desde el dispositivo**: la clave se guarda solo localmente (fuera de la partida sincronizada) y no pasa por el servidor de KANJŪ, así que no consume funciones ni base de datos.
Se usa para cuentos con las criaturas del jugador (limitados a sus kanji, vocabulario y gramática; las oraciones con kanji no permitidos se descartan) y para explicar errores en la Academia. Código en `js/ai.js`.
En la app nativa (Capacitor) la clave pasaría al llavero del sistema (Keychain / Keystore) y las llamadas pueden ir por el HTTP nativo.

## Créditos
Orden de trazos: [KanjiVG](http://kanjivg.tagaini.net) de Ulrich Apel, licencia CC BY-SA 3.0 (`js/strokes.js`).
