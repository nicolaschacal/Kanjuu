# Progresión real del aprendizaje (modelo Duolingo) — propuesta

Pedido por Nicolás el 14 de noviembre de 2026: «Quiero que te bases en cómo lo hace Duolingo. Yo aprendí con ellos. Hubo una progresión de aprendizaje real».

Esto es una **propuesta de especificación**. No cambia código. Se toma de Duolingo la **progresión pedagógica** (cantidad, orden, repetición, dificultad que sube, guía por unidad, saltar con prueba), no su aspecto visual: el entrenamiento sigue siendo con tu KANJŪ, en el santuario, con el kanji que se pinta con tinta.

---

## 1. Qué pasa hoy (diagnóstico)

Nicolás llegó a la etapa 4 «con los ojos cerrados» sin dominar el N5. Causas encontradas en el código:

| Problema | Dónde | Efecto |
|---|---|---|
| **Muy poco contenido.** Todo el currículo tiene 54 secciones, **295 palabras**, 173 kanji y 246 frases | `js/curriculum.js` | El N5 pide unas 800 palabras y el N4 unas 1500. Las etapas dicen «N5» y «N4», pero el contenido no llega ni al N5 |
| **Los kanji casi no se ven.** Una palabra se muestra con kanji solo si el jugador tiene la criatura de cada uno de sus kanji | `showsKanji()` en `js/lex.js` | Sin la criatura, 犬 aparece como いぬ |
| **Las frases están en hiragana.** 0 de las 232 frases del currículo llevan kanji | `EXTRA` en `js/curriculum.js` | Se lee hiragana en todas las etapas |
| **Casi todo es elegir 1 de 4 en español**, con distractores al azar de cualquier tema | `wordExercise()` en `js/wordgames.js` | Se responde por descarte |
| **Armar frases con la traducción a la vista** y solo 2 fichas de más | `phraseExercise()` en `js/round.js` | Sale por lógica, sin entender el japonés |
| **No se reprueba.** 80 % para contar, y el ejercicio fallado vuelve hasta acertarlo | `endRound()` | Toda ronda cuenta |
| **5 rondas de 12 ejercicios por sección** (60 en total) | `ROUNDS`, `planRound()` | Una unidad de Duolingo tiene 15 a 25 lecciones de ~15 ejercicios (≈300) |

**La cuenta que lo resume:** Duolingo Japonés tiene unas 4800 lecciones y unas 6900 palabras. Kanjuu tiene hoy 270 rondas (54 × 5) y 295 palabras: menos del 5 % del volumen. Por eso las 4 etapas se sienten como la sección 1 de Duolingo.

## 2. Cómo lo hace Duolingo (lo que tomamos)

1. **Secciones → unidades → niveles → lecciones.** En japonés, la sección 1 (Intro) tiene 10 unidades; la 2 (A1) tiene 35; la 3 (A1) sigue; la 4 es A2. Cada unidad es una situación («Pedir comida», «Describir a tu familia», «Moverte en la estación»).
2. **Mucha repetición del mismo material** en lecciones que suben de dificultad: primero reconocer, al final producir sin ayuda.
3. **Ejercicios variados:** traducir con banco de palabras en las dos direcciones, emparejar pares, escuchar y armar lo que oíste, completar el hueco, elegir la imagen, escribir.
4. **Kanji dentro de palabras.** Un kanji se presenta cuando aparece en una palabra nueva, primero emparejándolo con su lectura en kana, y desde ahí se escribe con kanji. Pasa a un apartado de práctica de kanji.
5. **Guía de la unidad (*guidebook*):** frases clave y una explicación corta de gramática. Es opcional y se abre desde la unidad.
6. **«Saltar aquí»:** una prueba corta y exigente para saltar a una unidad o a la siguiente sección. Si no se aprueba, se sigue donde se estaba, sin perder nada.
7. **Repaso personalizado** con lo que más cuesta.

## 3. La nueva estructura en Kanjuu

Se mantienen los nombres del juego: **etapa** (lo que en Duolingo es una sección) → **unidad** (lo que hoy llamamos sección, por ejemplo 1.3) → **nivel** → **ronda**.

| Etapa | Equivale a | Unidades | Palabras acumuladas | Kanji acumulados |
|---|---|---|---|---|
| 0 · Sonidos y kana | Sección 1 (kana) | 8 (las de hoy) | ~60 | 0 a 3 |
| 1 · Primeros pasos | Sección 1 (Intro) | 10 | ~250 | ~40 |
| 2 · Vida diaria | Sección 2 (A1) · **N5 completo** | 25 a 30 | ~800 | ~110 |
| 3 · Ampliar el mundo | Sección 3 (A1+) | 25 a 30 | ~1200 | ~200 |
| 4 · Conversación cotidiana | Sección 4 (A2) · **N4 completo** | 25 a 30 | ~1500 | ~300 |

Las unidades actuales se conservan como esqueleto y se reparten: las etapas 1 a 4 de hoy cubren, en contenido real, lo que debería ser la etapa 1 y el principio de la 2.

**Dentro de cada unidad:**

| Nivel | Qué se practica | Ayudas |
|---|---|---|
| 1 | Palabras nuevas: escuchar, emparejar con su significado, kanji emparejado con su lectura | Furigana y romaji |
| 2 | Las mismas palabras en frases cortas; traducir japonés → español con banco de palabras | Furigana |
| 3 | Gramática de la unidad; traducir español → japonés con banco | Furigana que se apaga por kanji |
| 4 | Escuchar y armar lo que oíste; completar el hueco; la situación con diálogo | Sin traducción a la vista |
| 5 | Producción: frases enteras sin ayudas, mezcla con unidades anteriores | Nada |

- Cada nivel tiene **3 rondas de 15 ejercicios** (propuesta): 15 rondas por unidad, unos 225 ejercicios. Una ronda sigue durando de 3 a 5 minutos.
- **El kanji de tinta se pinta por nivel:** 5 niveles, 5 partes del dibujo, igual que hoy con las rondas. La recompensa no cambia.
- La ronda se sigue jugando con la criatura de la ficha; sus 2 ejercicios de kanji siguen.

## 4. Ejercicios

| Tipo | Cómo es | Nuevo |
|---|---|---|
| Emparejar pares | 5 palabras con 5 significados, o 5 kanji con 5 lecturas | Sí |
| Japonés → español | Frase en japonés real; se arma la traducción con un banco de palabras en español | Sí |
| Español → japonés | Se arma la frase con fichas japonesas, con 3 a 5 fichas de más **plausibles** (partículas y palabras de la misma unidad) | Mejora |
| Escuchar y armar | Se oye la frase sin verla y se arma | Sí |
| Completar el hueco | Falta una partícula o una forma del verbo | Sí |
| Escribir la lectura | Se escribe en kana con un teclado de fichas kana (sin depender del teclado japonés del teléfono) | Sí |
| Kanji parecido | Elegir entre 人 / 入 / 大, o 土 / 士 | Sí |
| Situación | Lo que ya existe (`talkExercise`) | No |
| Trazo | Lo que ya existe (`js/strokes.js`) | No |

**Distractores:** siempre del mismo tipo de palabra y de la misma unidad o de las anteriores (nunca «perro / martes / rojo / ventana» mezclados).

## 5. Kanji y escritura real

- Una palabra se escribe con kanji **desde la unidad que lo enseña**, tenga o no el jugador la criatura. Se cambia `showsKanji()` para que mire el kanji enseñado (`S.srs` o la unidad cursada), no `S.dex[c].owned`.
- Las frases se reescriben en **japonés real** (犬は猫より大きいです), con furigana que se apaga kanji por kanji según el dominio (ya está pensado así en `docs/CURRICULO.md` §2). La furigana se puede apagar siempre.
- Antes de usar un kanji por primera vez, se presenta con un ejercicio de emparejar kanji ↔ lectura.
- Tener la criatura sigue dando lo suyo (lecturas completas, evoluciones, Arena), pero no decide qué se puede leer.

## 6. Para que cueste de verdad

- **Cuenta el primer intento.** El ejercicio fallado vuelve al final (para aprender), pero no suma para aprobar.
- Una ronda cuenta con el 80 % de aciertos al primer intento.
- Sin corazones ni energía: nunca se bloquea jugar (regla del juego). Si una ronda no cuenta, se repite cuando quieras.
- El nivel 5 de cada unidad mezcla un 30 % de las unidades anteriores.

## 7. Guía de la unidad

- Al entrar a una unidad aparece una **tarjeta «Guía»**: frases clave con audio, una explicación corta de la gramática (2 o 3 pantallas) y los kanji de la unidad con sus lecturas. La presenta tu KANJŪ.
- Opcional, como en Duolingo; se puede volver a abrir desde el cuaderno.
- Necesita propuesta visual aprobada antes de implementarse (regla 3).

## 8. Saltar

- **Saltar a una unidad:** en cualquier unidad de la etapa actual o de la siguiente, «Saltar aquí» abre una prueba de 15 ejercicios de producción sobre todo lo anterior. Se aprueba con hasta 3 errores.
- **Saltar la etapa:** al principio de cada etapa, una prueba de 20 ejercicios lleva al inicio de la siguiente (de 1.x a 2.1, de 2.x a 3.1).
- Si no se aprueba, se sigue donde se estaba, sin perder nada, y se puede reintentar.
- Las unidades saltadas no entregan su KANJŪ (ya decidido).

## 9. Partidas existentes

Guardado compatible: `S.cur` gana campos con `??=` (`level`, `rounds` por nivel). Una partida en la unidad X de hoy se ubica en la unidad equivalente del nuevo mapa, en el nivel 1. Lo ya pintado se conserva.

## 10. Plan de trabajo

| ID | Tarea | Tipo |
|---|---|---|
| P-01 | Kanji desde que se enseñan (`showsKanji`) y frases reescritas en japonés real | código + contenido |
| P-02 | Primer intento cuenta, distractores de la misma unidad, más fichas de más | código |
| P-03 | Propuesta visual: ejercicios nuevos, guía de la unidad, «Saltar aquí» | diseño (propuesta) |
| P-04 | Niveles dentro de la unidad (5 × 3 rondas) y tinta por nivel | código |
| P-05 | Ejercicios nuevos (pares, ja → es, escuchar y armar, hueco, teclado kana, kanji parecido) | código, después de P-03 |
| P-06 | Guía de la unidad y pruebas para saltar | código, después de P-03 |
| P-07 · P-08 · P-09 | Contenido: etapa 1 completa (~250 palabras), etapa 2 hasta el N5 (~800), etapas 3 y 4 hasta el N4 (~1500). Revisado por Claude con frases de manual | contenido |

P-01 y P-02 se notan enseguida y no necesitan diseño nuevo: se pueden hacer primero.

## Necesita tu decisión

1. ¿Los nombres quedan **etapa → unidad → nivel → ronda**, o prefieres otros?
2. ¿**3 rondas por nivel** (15 por unidad) te parece bien, o prefieres menos rondas y más largas?
3. ¿Saltar con **hasta 3 errores** de margen, o más estricto?
4. ¿La guía de la unidad **opcional** (como Duolingo) u **obligatoria** la primera vez?
5. ¿Empezamos por **P-01 y P-02**, que no necesitan diseño, mientras se prepara la propuesta visual P-03?
