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

## Próximos sprints (tentativo; se confirma en cada planificación)
Decidido por Nicolás el 10 de noviembre de 2026: la parte educativa (Academia, lecciones, ejercicios, cursos) se traduce y se rediseña en su propio sprint, porque también va a cambiar. El resto de los idiomas va antes.
- **Sprint 3 · Idiomas, etapa 2:** textos del menú interno (cada hoja, tienda, altar, Arena, Fusión, Viajes, mensajes y avisos), nombres y descripciones de los 101 KANJŪ y de sus piezas, en español e inglés. Sin Academia
- **Sprint 4 · Academia en dos idiomas:** traducción y ajustes de lecciones, ejercicios, cursos, Dojo y lecturas; la IA (cuentos y explicaciones) recibe el idioma del jugador
- **Sprint 5 · Academia, contenido nuevo:** cada unidad termina desbloqueando un kanji; ejercicio de armar frases tocando tarjetas; mapa de unidades si se aprobó (S1-05)
- **Sprint 6:** volver a simular la economía con 101 kanji y la Arena
- **Sprint 7:** telemetría de economía y validación de partida en el servidor; recompensa de regreso
- **Sprint 8:** desbloqueo progresivo de sistemas; temporada Otoño de momiji 紅葉 con pase gratuito
