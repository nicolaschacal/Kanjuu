# Aprendizaje dentro del juego — especificación

Pedido por Nicolás el 12 y 13 de noviembre de 2026: sacar la Academia como camino aparte, tener un **diario de descubrimientos**, dar sentido a los **viajes** y que aprender japonés sea parte de jugar, no un peaje. Esta especificación baja a mecánicas la biblia pedagógica (secciones 2, 4, 6, 8 y las doce reglas de la sección 9).

## El ciclo: encontrar → anotar → recuperar → reencontrar

Toda palabra pasa por cuatro momentos, cada uno en un lugar distinto del juego (regla 4 y regla 5: diez encuentros o más en al menos tres lugares).

| Momento | Dónde | Qué pasa |
|---|---|---|
| **Encontrar** | Al recibir un viaje (momento tranquilo, regla 6) | El KANJŪ vuelve con un **hallazgo**: una palabra nueva de la situación de esa región, con audio, kana y significado, dentro de una frase que el jugador ya entiende casi entera |
| **Anotar** | Diario (reemplaza a la Academia) | La palabra queda en el diario con dónde se halló y sus encuentros (●●●○○…) |
| **Recuperar** | Dojo (repaso del día) | La palabra entra al repaso espaciado junto con los kanji; se pide recuperar, no solo reconocer (regla 7) |
| **Reencontrar** | Lecturas del diario y frases de otros viajes | Textos cortos armados solo con palabras que el jugador ya halló (regla 2: 95–98 % conocido) |

## 1. Datos de lengua (`js/lang.js`, archivo nuevo)

- `SITUATIONS`: una por región de `REGIONS` (9). Cada una con `id` de región, `cando` ("Puedo saludar y agradecer"), y sus palabras y frases.
- `LEX`: unas 150–200 palabras de E0–E1 (saludos, familia, comida, números y hora, lugares, verbos en ます, adjetivos básicos). Cada palabra: `id`, `kana`, `kanji` (opcional, la forma escrita habitual), `es`, `en`, `sit` (situación), `kind` (sust., verbo, adj., expresión). Orden por frecuencia dentro de cada situación. La palabra se muestra **en kana** hasta que el jugador tiene todos los kanji de su forma escrita; entonces pasa a mostrarse con kanji y furigana ("la forma escrita de algo que ya sé", regla de orden 4).
- `PHRASES`: 4–8 frases por situación, cada una con sus palabras (`ids`), su patrón gramatical (`pat`, en el orden de E1: X は Y です · か · の · も · これ/それ/あれ · números · ます · を に で へ · あります/います · adjetivos) y traducción. **Una sola novedad por frase.**
- `READINGS`: 12–20 lecturas muy cortas (2–5 frases, nivel 0 de Tadoku), cada una con la lista de palabras que usa. Una lectura se abre cuando el jugador conoce todas sus palabras menos, como mucho, una.
- Las palabras ancla que ya están en `WORDS` de `js/data.js` (kanji + lectura + significado) también cuentan como palabras del diario cuando el jugador tiene todos sus kanji.
- Nada de japonés inventado: frases de manual (Genki 1–5, Irodori A1). Sin romaji en los datos: sale de `romaji()` en `js/help.js`.

## 2. Hallazgos de viaje (`js/trips.js`)

- Al **recibir** un viaje, después del resumen de tinta: tarjeta de hallazgo con la palabra (kana grande, romaji si el andamio sigue activo, significado, botón de audio con `speak`) y una frase de `PHRASES` que la usa y cuyas otras palabras ya están en el diario (si no hay ninguna, la palabra sola). La parte nueva va resaltada.
- Qué palabra: la siguiente no hallada de la situación de esa región, en su orden. Si la región ya no tiene palabras nuevas, trae un **reencuentro**: una frase con palabras ya halladas (suma un encuentro a cada una).
- La tarjeta se cierra con un toque; no hay examen en ese momento. Opción "Ya la sabía" → entra al repaso con intervalo largo (comprobación diferida, nivelación regla 4).
- La lista de regiones muestra el Can-do de cada una y su progreso ("Saludar · 4/12 palabras").

## 3. Diario (`js/diary.js`, archivo nuevo; reemplaza la entrada a la Academia)

Hoja con pestañas, en el lugar donde hoy se entra a la Academia (botón 学 del santuario y fila del Entrenador) y como pestaña del Atlas:
- **Palabras:** agrupadas por situación; cada una con kana, forma con kanji cuando corresponde, significado, dónde se halló, encuentros (hasta 10) y su caja de repaso. Tocar = oír y ver sus frases.
- **Frases:** las frases vistas, con el patrón nombrado en una línea ("X は Y です: X es Y"). El metalenguaje queda a un toque.
- **Lecturas:** las abiertas y las que faltan ("te faltan 2 palabras: viaja a …"). Leer una da tinta la primera vez y suma encuentros.
- **Kana:** tabla de hiragana y katakana que se va encendiendo con los kana de las palabras halladas. Desde ahí, práctica opcional (se reutiliza `kanaDrill` y las unidades de kana de `js/course.js` como cuadernos opcionales).
- **Puedo…:** los Can-do logrados (una situación se logra con el 80 % de sus palabras en caja 2 o más).

## 4. Dojo: recuperar (`js/dojo.js`, `js/games.js`)

- Las palabras del diario tienen su propio registro de repaso (`S.lex[id] = { box, due, ok, miss, n, at: [lugares], from }`) con las mismas cajas que los kanji.
- El repaso del día mezcla kanji y palabras (intercalado). Tipos para palabras, de menor a mayor exigencia según la caja: oír y elegir significado → ver kana y elegir significado → ver significado y **armar la palabra con fichas de kana** (recuperación) → ordenar las fichas de una frase.
- Se agrega una caja más de unos cuatro meses (`SRS_HOURS` termina en 2880).
- Fallar no quita nada: la palabra vuelve antes.

## 5. Andamios que vencen (`js/help.js`)

- **Romaji por kana:** el romaji se muestra debajo de cada kana hasta que ese kana se acertó 3 veces; después se apaga solo para ese kana (regla 11). El interruptor de Configuración sigue mandando.
- **Furigana por kanji:** como hoy (se retira con la maestría).

## 6. Nivelación (`js/main.js`, inicio)

- Al empezar, después de elegir el huevo: "¿Qué sabes ya?" con tres opciones (empiezo de cero · leo hiragana y katakana · además reconozco algunos kanji). Decide si el romaji arranca apagado y marca los kana como sabidos con comprobación diferida. Ante la duda, un peldaño abajo. Se puede cambiar en Configuración.

## 7. Verdad sobre cada kanji (ficha y Atlas)

- Etiqueta de uso en la ficha: **de todos los días** (N5–N4), **poco frecuente** o **solo pieza** (喿, 澡 y similares) — campo `use` calculado en `js/lang.js` a partir de una lista.
- Palabras ancla del kanji en su ficha (las de `WORDS` que lo contienen), con audio.

## 8. Recorrido guiado (`js/tutorial.js` y capítulos)

- La primera sesión guiada deja de mandar a la Academia: huevo → mimar → entrenar → recoger tinta → primer viaje (vuelve con un amigo **y** con la primera palabra) → abrir el diario → primera fusión guiada.
- **Camino del santuario** (`S.path`): capítulos cortos con 3–4 objetivos y premio, que llevan de la mano por las primeras dos semanas (primer compañero, primera fusión, primera palabra repasada, primera lectura, primera evolución con accesorio, primera familia). Se ve en la tarjeta de misiones. Nunca bloquea jugar.
- Misiones diarias: sale "Completá 2 lecciones de la Academia"; entra "Hallá o repasá 5 palabras".

## 9. Lo que no cambia

- Santuario (con editor) y Arenas: cerrados.
- Guardado compatible hacia atrás: todo campo nuevo con `??=`; el progreso viejo de la Academia (`S.acad`) no se borra.
- Sin rachas punitivas, sin energía. Textos nuevos con `t()` en `locales/es.json` y `locales/en.json`, español neutro con tú.
