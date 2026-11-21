# Backlog de KANJŪ

El estado de cada tarea vive en GitHub: rama `sprint-NN/ID-…` y su pull request. Este archivo solo cambia mediante el pull request de planificación de cada sprint.

---

## Sprint 1 · 10 al 16 de noviembre de 2026 · "Base de idiomas y Academia"

### S1-01 · Infraestructura de idiomas (español + inglés) *(hecha)*
- `js/i18n.js` con `t('clave', vars)`, plurales con `Intl.PluralRules`
- `locales/es.json` (español neutro con tú) y `locales/en.json`
- Idioma automático según el dispositivo (cualquier español → español; inglés → inglés; otro → español); selector en Configuración; se guarda con la partida
- Interfaz de primer nivel traducida: HUD, barra inferior, Configuración y los títulos y pestañas de cada hoja
- Sin variante Río de la Plata: decidido por Nicolás el 10 de noviembre de 2026 para no sobrecargar la app
- Script `tools/check_i18n.mjs` que detecta claves faltantes entre idiomas
- Queda para las etapas siguientes: textos de las hojas, nombres y descripciones de criaturas, y toda la Academia (ver Sprints 3 y 4)

**Aceptación:** cambiar el idioma en Configuración cambia esos textos sin recargar ni perder la partida; el script pasa sin errores; en español los textos aparecen con tú.

---

### S1-02 · Analítica de la Academia
- Eventos: lección iniciada, terminada, abandonada (con pantalla en la que se dejó), error por tipo de ejercicio, tiempo por lección
- Envío en lotes a `/api/events`; la tabla se crea sola de forma idempotente; sin datos personales (id de cuenta con hash)
- `tools/reporte_academia.mjs` que imprime abandono por lección y error por tipo

**Aceptación:** jugar una lección en la vista previa genera los eventos; el reporte los muestra; si el envío falla, el juego no se entera.

### S1-03 · Test de ubicación
- Botón "Ya sé esto" al inicio de cada unidad: 8–10 preguntas mezcladas de esa unidad, sin pistas
- 80% o más: la unidad queda completa con 1 corona y se cobra su premio
- Se puede repetir; fallar no quita nada

**Aceptación:** alguien que sabe hiragana puede saltar Hiragana I y II en menos de 5 minutos.

### S1-04 · Ejercicio de escritura de kana (no es opción múltiple)
- Nuevo tipo de ejercicio en la Academia: escribir un kana con el dedo, evaluado trazo por trazo con los datos de KanjiVG que ya usa `js/strokes.js`
- Aparece en las unidades de hiragana y katakana, intercalado con los demás

**Aceptación:** funciona con el dedo en la vista previa en el teléfono; los trazos en mal orden o dirección se marcan.

### S1-05 · Propuesta: mapa de unidades con criatura guía *(diseño)*
- Maqueta del camino de unidades de la Academia con una criatura guía que avanza con el jugador, en el estilo de papel del santuario
- Solo propuesta: no toca el juego

**Aceptación:** maqueta navegable en el teléfono; Nicolás la aprueba o la rechaza.

### S1-06 · Propuesta: sistema visual de criaturas *(diseño)*
- Biblia de estilo en `docs/ARTE.md`: siluetas por tipo 五行, paleta, kanji a pincel, ojos, sombra, textura de papel, tamaño mínimo legible (64 px)
- Piloto: 木 en sus 3 etapas, y 林 y 森 en su primera etapa
- Prompts base para el modelo de IA de imágenes

**Aceptación:** las pruebas se ven en una página de la vista previa al lado de las criaturas actuales.

### S1-08 · Atlas, colección e isla explican lo que muestran
Pedido por Nicolás el 9 de noviembre de 2026: hoy el jugador no entiende por qué un kanji aparece en gris en el Atlas ni por qué tiene una criatura de otro color.
- **Kanji vistos y no conseguidos:** el juego guarda dónde se vio cada kanji (`S.dex[k].from`: región del viaje, puerta del santuario, componente de una criatura). La ficha gris del Atlas lo dice: "Visto en: Valle de fuego · mandá un viaje ahí para encontrarlo". Para partidas viejas sin ese dato, se deduce de las regiones donde vive el kanji.
- **Leyenda del Atlas:** una línea arriba de la grilla que explica los tres estados (lo tienes · lo viste · sin descubrir).
- **Variante dorada:** etiqueta "Dorado" visible en la tarjeta de Mis KANJŪ, el Atlas y la ficha, y en la ficha una línea que explica qué es: "Variante dorada: rara, produce +50% de tinta".
- **Sin lugar en la isla (pedido el 9 de noviembre de 2026):** hoy dice "No hay lugar libre" aunque queden casillas sueltas, y el jugador cree que es un error. El mensaje dice el tamaño que falta ("El cerezo necesita 2×2 libres; tenés 15 casillas sueltas") y la isla marca qué objeto o KANJŪ conviene mover para abrir ese hueco (el que libera un espacio del tamaño pedido moviendo una sola pieza), con la opción de ampliar la isla.
- Textos con `t()` en los tres idiomas si S1-01 ya está mergeada; si no, en español neutro y se migran después.

**Aceptación:** con una isla sin ningún 2×2 libre, intentar poner el cerezo explica el tamaño que falta y resalta la pieza a mover; tocar un kanji gris en el Atlas dice dónde se vio y cómo conseguirlo; las criaturas doradas llevan su etiqueta en las tres pantallas; una partida vieja carga sin errores y sus kanji vistos muestran una región.

---

## Sprint 2 · 17 al 23 de noviembre de 2026 · "Estados y clima"
Pedido por Nicolás el 9 de noviembre de 2026. Especificación completa en **docs/ESTADOS.md**.

### S2-01 · Propuesta: cómo se ven los estados y la lluvia *(diseño)*
- Maqueta con los ocho estados (contento, tranquilo, de mal humor, mojado, resguardado, secándose, inspirado, dormido) aplicados a criaturas reales del estilo aprobado
- Íconos de estado para la ficha y para la isla, gotas y papel oscurecido al mojarse, vapor al secarse
- Animación de ir al techo y volver, área cubierta en celeste en el modo editor, pronóstico en el reloj

**Aceptación:** maqueta navegable en el teléfono; Nicolás la aprueba o la rechaza.

### S2-02 · Lógica de estados, techos y lluvia
- Estados según la tabla de docs/ESTADOS.md y su efecto en la tinta (mojado ×0,2, resguardado +10%, etc.)
- Techos con área y plazas (Refugio, casa, templo, pagoda, casa de té, árboles grandes, puente); los KANJŪ de agua no se mojan
- Efecto de los chaparrones durante la ausencia, calculado con `rainAt`; el resumen de regreso lo cuenta
- Pronóstico "Lluvia en N min" en el reloj
- Guardado compatible: partidas viejas cargan con estado contento
- Escenario de lluvia en `tools/sim_economia.py` con los objetivos de balance de docs/ESTADOS.md

**Aceptación:** con `?lluvia=1`, los KANJŪ sin techo quedan mojados y producen ×0,2; los que están bajo un Refugio quedan resguardados; la simulación cumple los objetivos.

### S2-03 · Estados en la isla y en la ficha *(solo después de aprobar S2-01)*
- Implementar lo aprobado en S2-01: íconos, expresiones, gotas y vapor, caminar al techo y volver
- Ficha con el estado, qué le pasa y cómo arreglarlo
- Modo editor: área cubierta y plazas al elegir un objeto con techo

**Aceptación:** igual a la maqueta aprobada; sin errores de consola en 390 × 844.

### S2-04 · Misión "Primer chaparrón"
- En la primera lluvia del jugador, una misión guiada regala un Refugio y muestra cómo resguardar a sus KANJŪ

**Aceptación:** un jugador nuevo con `?lluvia=1` recibe la misión una sola vez y termina con al menos un KANJŪ resguardado.

---

## Bloque P · Progresión real del aprendizaje *(va primero: pedido por Nicolás el 14 de noviembre de 2026)*
Especificación completa en **docs/PROGRESION.md**: el modelo de Duolingo para el idioma y el de componentes → kanji → vocabulario para los kanji, con los KANJŪ al centro. Se hace en este orden; cada tarea es un pull request.

### P-01 · Kanji desde que se enseñan
- Una palabra se escribe con kanji cuando su kanji ya se enseñó en una unidad cursada (o está en `S.srs`), no solo si el jugador tiene la criatura
- Las frases del entrenamiento se muestran en japonés real con furigana

**Aceptación:** en la 3.2, いぬ se ve como 犬 con furigana aunque no tengas al KANJŪ 犬; en la 1.1, 犬 sigue en kana.

### P-02 · Primer intento cuenta y distractores plausibles
- La ronda cuenta con 80 % de aciertos al primer intento; el ejercicio fallado vuelve, pero no suma
- Distractores del mismo tipo de palabra y de la unidad o las anteriores; 3 a 5 fichas de más plausibles al armar frases

**Aceptación:** una ronda con 3 errores no cuenta; las opciones de «perro» son otros sustantivos de animales o de la unidad.

### P-03 · Propuesta: ejercicios nuevos, presentación del KANJŪ, guía y «Saltar aquí» *(diseño)*
- Maqueta en `docs/propuestas/P-03-progresion.html`: presentación de un KANJŪ (dibujo, componentes, lectura), emparejar pares, japonés → español, escuchar y armar, hueco, teclado kana, kanji parecido, guía de la unidad, mapa de niveles en el cuaderno y prueba para saltar
- Solo propuesta: no toca el juego

**Aceptación:** maqueta navegable en el teléfono; Nicolás la aprueba o la rechaza.

### P-04 · Niveles dentro de la unidad
- 5 niveles × 3 rondas por unidad, con la dificultad de docs/PROGRESION.md §3; la tinta se pinta por nivel; guardado compatible

**Aceptación:** una partida vieja carga en su unidad, nivel 1, con lo pintado intacto.

### P-05 · Ejercicios nuevos *(después de aprobar P-03)*
### P-06 · Presentación del KANJŪ, guía de la unidad y pruebas para saltar *(después de aprobar P-03)*
### P-07 · Contenido: etapa 1 completa (~250 palabras, ~40 kanji)
### P-08 · Contenido: etapa 2 hasta el N5 (~800 palabras)
### P-09 · Contenido: etapas 3 y 4 hasta el N4 (~1500 palabras)
Cada tarea de contenido: frases de manual (Genki, Marugoto, Irodori), kanji ordenados según sus recetas (componentes antes), `tools/check_curriculo.mjs` sin errores.

*Agregado el 15 de noviembre de 2026, con las decisiones de Nicolás (docs/PROGRESION.md §11 a §14):*

### P-08c · P-08d · P-08e · Etapa 2, unidades nuevas 2.13 a 2.30 *(después de aprobar el mapa §13)*
- 6 unidades por PR, cada una con 18–20 palabras, 12–15 frases, diálogo, rivales y premio, según el mapa de docs/PROGRESION.md §13

**Aceptación:** la etapa 2 llega a ~800 palabras acumuladas; `tools/check_curriculo.mjs` sin errores; una partida vieja carga en su unidad.

### P-10 · Pasado y negativo de los adjetivos い y な, y de です *(decidido por Nicolás)*
- Formas 〜くない, 〜かった, 〜くなかった, 〜くて; じゃない, じゃありません y でした como fichas; frases nuevas

**Aceptación:** en la 2.4 se arma 「この くつ は たかくない です」 y se ve 高くない con furigana.

### P-11 · Propuesta: leer de corrido *(diseño)*
- Maqueta en `docs/propuestas/P-11-lectura.html`: lectura por unidad sin espacios, furigana solo en kanji no dominados, tocar una palabra, audio y preguntas de comprensión (§12)

**Aceptación:** maqueta navegable en el teléfono; Nicolás la aprueba o la rechaza.

### P-12 · Lectura por unidad *(después de aprobar P-11)*
### P-13 · Lecturas de las etapas 1 y 2 *(después de P-12)*
### P-14 · Forma ない y forma た corta en el motor

*Agregado el 21 de noviembre de 2026 (mapa en docs/PROGRESION.md §15; plan en §14):*

### P-09a · Mapa de las etapas 3 y 4 hasta el N4 *(documentación)*
- Sección nueva §15: 12 unidades nuevas (3.13 a 3.18 y 4.13 a 4.18), gramática del N4 sin repetir, 76 kanji nuevos del roster y 12 premios nuevos
- Meta: ~1500 palabras y ~296 kanji al cerrar la etapa 4; 19 a 20 palabras nuevas por unidad

**Aceptación:** Nicolás aprueba el mapa o pide cambios; sin código.

### P-09b · P-09c · Etapa 3, unidades 3.1 a 3.6 y 3.7 a 3.12 *(después de aprobar §15)*
- Cada unidad pasa de 8 a 19–20 palabras nuevas y a 12–15 frases; conservan id, título, kanji y premio
- Cambios declarados de gramática: 3.3, 3.5, 3.7 y 3.8 (hoy repiten 2.x)

**Aceptación:** `tools/check_curriculo.mjs` sin errores; una partida vieja carga en su unidad; la etapa 3 existente llega a ~1030 palabras acumuladas.

### P-09d · Etapa 3, unidades nuevas 3.13 a 3.18 *(después de P-14 y de aprobar §15)*
- 6 unidades con 20 palabras, 12–15 frases, diálogo, guía, rivales y premio, según §15

**Aceptación:** ~1150 palabras y ~233 kanji acumulados; `tools/check_curriculo.mjs` sin errores.

### P-09e · P-09f · Etapa 4, unidades 4.1 a 4.6 y 4.7 a 4.12 *(después de aprobar §15)*
- Igual que P-09b y P-09c; cambio declarado de gramática en 4.10 (hoy repite 2.27)

**Aceptación:** ~1390 palabras y ~261 kanji acumulados.

### P-09g · Etapa 4, unidades nuevas 4.13 a 4.18 *(después de P-09d)*
- 6 unidades nuevas; cierra el N4 con la llamada y la despedida (4.18)

**Aceptación:** ~1500 palabras y ~296 kanji acumulados; `tools/check_curriculo.mjs` sin errores; una partida vieja carga en su unidad.

---

## Bloque A · Aprendizaje en el entrenamiento *(va primero: decidido por Nicolás el 13 de noviembre de 2026)*
Pedido por Nicolás el 13 de noviembre de 2026: la Academia desaparece y el japonés se aprende en la pestaña Entrenar de cada KANJŪ, por etapas y secciones. Especificación completa en **docs/CURRICULO.md**. Reemplaza a los sprints 4 y 5 tentativos (Academia en dos idiomas y contenido nuevo de la Academia). Se hace **antes** del Sprint 2 (estados y clima), que se corre una vez terminado el bloque.

### A-01 · Datos del currículo, etapas 0 y 1
- `js/curriculum.js` con las 18 secciones de E0 y E1 (docs/CURRICULO.md §9): palabras núcleo, frases, patrones, kana, kanji, recompensa, palabra de la recompensa y rivales
- Amplía `LEX` y `PHRASES` de `js/lang.js` donde haga falta, sin cambiar ids existentes y pasando `checkLang()`
- `checkCurriculum()` y `tools/check_curriculo.mjs` con las reglas de docs/CURRICULO.md §3

**Aceptación:** el script pasa sin errores; cada recompensa existe en `KANJI`; ninguna frase usa palabras de secciones posteriores.

### A-02 · Propuesta: ronda, mapa de secciones y materialización *(diseño)*
- Maqueta de la pestaña Entrenar con el mapa de secciones de la etapa, una ronda de 12 ejercicios con la criatura narrando y la escena en la que una palabra se "materializa" en un KANJŪ
- Solo propuesta: no toca el juego

**Aceptación:** maqueta navegable en el teléfono; Nicolás la aprueba o la rechaza.

### A-03 · Motor de rondas
- Ronda de 12 ejercicios (8 de la sección, 2 del kanji de la criatura con los juegos de `GAMES`, 2 de repaso) que se abre desde Entrenar
- Corrige, actualiza `S.lex`, `S.srs` y `S.kana`, y lleva `S.cur` (rondas por sección); 80 % para que cuente
- Interfaz provisoria con los estilos actuales hasta que se apruebe A-02
- Guardado compatible: partidas viejas cargan y se ubican por lo que ya saben

**Aceptación:** desde la ficha de cualquier KANJŪ se juega una ronda de la sección actual; al terminar la quinta, la sección queda completa y se abre la siguiente; sin errores de consola en 390 × 844.

### A-04 · Recompensas de sección
- Al completar la quinta ronda: entrega del KANJŪ si su palabra está en caja 2 o más; si no, silueta en el diario
- Huevos de E0 y su eclosión al reconocer el kanji; tinta si ya se tenía la criatura

**Aceptación:** completar 1.9 con おとうと en caja 2 entrega 弟 una sola vez; las secciones salteadas no entregan nada.

### A-05 · Nivelación y ubicación
- Prueba corta para saltar secciones (8–10 preguntas, 80 %); las salteadas quedan completas sin recompensa
- Ubicación automática de las partidas existentes

**Aceptación:** alguien que sabe kana llega a 1.1 en menos de 5 minutos; una partida vieja carga ubicada.

### A-04b · KANJŪ provisorios 旅, 風, 晴 y 客
- Agregar los cuatro kanji al roster con lecturas exactas y un dibujo borrador simple (decidido por Nicolás el 13 de noviembre de 2026: se diseñan bien más adelante)
- Marcados como provisorios en los datos para encontrarlos cuando se haga el diseño final

**Aceptación:** los cuatro existen en `KANJI`, se ven en el Atlas y pasan los chequeos de lecturas.

Después: A-06 (implementar A-02), A-07 (combate de examen y dorado), A-08 a A-10 (contenido de E2 a E4) y A-11 (capa de IA), en ese orden.

---

## Bloque B · KANJŪ como app (pedido por Nicolás el 13 de noviembre de 2026)
Preparar el juego para empaquetarlo en iOS y Android (ROADMAP §7).

### B-01 · Pantalla de inicio y acceso
- Pantalla de arranque inmediata, título mientras carga la partida y acceso (crear cuenta, entrar, recuperar) en la misma pantalla
- Detalles de app: sin resaltado ni menú de pulsación larga, sin zoom, archivos completos para abrir sin conexión

**Aceptación:** con sesión entra sola; sin sesión se puede crear cuenta y entrar; sin errores de consola en 390 × 844.

### B-02 · Gestos
- Deslizar hacia abajo para cerrar hojas y ventanas; deslizar desde el borde izquierdo para volver; deslizar a los lados entre pestañas
- Botón «atrás» de Android y vibración nativa cuando esté empaquetada

**Aceptación:** las ventanas obligatorias (acceso, primer huevo) no se cierran con gestos; el mapa del Santuario no cambia.

### B-03 · Proyecto nativo con Capacitor
- Configuración, carpeta de la app, dirección de la API para la app y guía paso a paso para generar iOS y Android

**Aceptación:** `npm run app:build` arma la carpeta `www/`; la guía permite abrir el proyecto en Xcode y Android Studio.

---

## Próximos sprints (tentativo; se confirma en cada planificación)
Cancelado por Nicolás el 13 de noviembre de 2026: el juego queda solo en español neutro (sin inglés) y sin Academia. Los sprints de idiomas tachados ya no se hacen.
Decidido por Nicolás el 10 de noviembre de 2026: la parte educativa (Academia, lecciones, ejercicios, cursos) se traduce y se rediseña en su propio sprint, porque también va a cambiar. El resto de los idiomas va antes.
- ~~**Sprint 3 · Idiomas, etapa 2:** textos del menú interno (cada hoja, tienda, altar, Arena, Fusión, Viajes, mensajes y avisos), nombres y descripciones de los 101 KANJŪ y de sus piezas, en español e inglés. Sin Academia~~
- ~~**Sprint 4 · Academia en dos idiomas:** traducción y ajustes de lecciones, ejercicios, cursos, Dojo y lecturas; la IA (cuentos y explicaciones) recibe el idioma del jugador~~
- **Sprint 5 · Academia, contenido nuevo:** cada unidad termina desbloqueando un kanji; ejercicio de armar frases tocando tarjetas; mapa de unidades si se aprobó (S1-05)
- **Sprint 6:** volver a simular la economía con 293 kanji y la Arena
- **Sprint 7:** telemetría de economía y validación de partida en el servidor; recompensa de regreso
- **Sprint 8:** desbloqueo progresivo de sistemas; temporada Otoño de momiji 紅葉 con pase gratuito
