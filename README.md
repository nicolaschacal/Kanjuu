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
js/data.js      kanji, recetas, palabras, regiones, depth
js/state.js     guardado local, EXP, evolución, fusión, renacimiento
js/creature.js  generador SVG procedural (rasgos heredados de cada raíz)
js/games.js     minijuegos
js/main.js      pantallas, santuario, UI
```

## Aprendizaje
Dojo con repetición espaciada (Leitner), recuperación activa, intercalado de tipos de pregunta, mnemotecnias por kanji (y propias del jugador), audio japonés y descomposición en componentes. Evolucionar exige haber acertado el kanji al menos una vez.

## Economía y espacio
Cada criatura ocupa tantos espacios como su nivel KANJŪ. La tienda vende ampliaciones, objetos y decoraciones con tinta 墨. Si el santuario está lleno, las nuevas criaturas esperan en la puerta.

Ver `ROADMAP.md` para el plan hacia las tiendas.

## Cuentas y nube
- Vercel Functions en `api/` (`auth.js`, `save.js`) + Postgres en Neon (tablas `users`, `saves`).
- Contraseñas con scrypt + sal; sesión en cookie HttpOnly firmada (HMAC, 60 días).
- Variables de entorno en Vercel: `DATABASE_URL`, `AUTH_SECRET`.
- El juego funciona sin cuenta y sin conexión; al iniciar sesión se compara la partida local con la de la nube.
