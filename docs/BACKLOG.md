# Backlog de KANJŪ

El estado de cada tarea vive en GitHub: rama `sprint-NN/ID-…` y su pull request. Este archivo solo cambia mediante el pull request de planificación de cada sprint.

---

## Sprint 1 · 10 al 16 de noviembre de 2026 · "Base de idiomas y Academia"

### S1-01 · Infraestructura de idiomas (español + inglés)
- `js/i18n.js` con `t('clave', vars)`, plurales con `Intl.PluralRules`
- `locales/es.json` (español neutro con tú), `locales/es-rp.json` (variante Río de la Plata con voseo, solo las claves que cambian; el resto cae a `es`) y `locales/en.json`
- Los textos actuales con voseo se mueven a `es-rp` y se reescriben con tú en `es`
- Idioma automático según el dispositivo (Uruguay y Argentina → Río de la Plata); selector en Configuración; se guarda junto con la partida
- Traducir la **interfaz de primer nivel**: HUD, barra inferior, Configuración y los títulos de cada hoja. El resto se migra en tareas siguientes
- Script `tools/check_i18n.mjs` que detecta claves faltantes entre idiomas

**Aceptación:** cambiar el idioma en Configuración cambia esos textos sin recargar ni perder la partida; el script pasa sin errores; en "Español (Río de la Plata)" todo se ve igual que antes y en español neutro los mismos textos aparecen con tú.

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

### S1-08 · Atlas y colección explican lo que muestran
Pedido por Nicolás el 9 de noviembre de 2026: hoy el jugador no entiende por qué un kanji aparece en gris en el Atlas ni por qué tiene una criatura de otro color.
- **Kanji vistos y no conseguidos:** el juego guarda dónde se vio cada kanji (`S.dex[k].from`: región del viaje, puerta del santuario, componente de una criatura). La ficha gris del Atlas lo dice: "Visto en: Valle de fuego · mandá un viaje ahí para encontrarlo". Para partidas viejas sin ese dato, se deduce de las regiones donde vive el kanji.
- **Leyenda del Atlas:** una línea arriba de la grilla que explica los tres estados (lo tienes · lo viste · sin descubrir).
- **Variante dorada:** etiqueta "Dorado" visible en la tarjeta de Mis KANJŪ, el Atlas y la ficha, y en la ficha una línea que explica qué es: "Variante dorada: rara, produce +50% de tinta".
- Textos con `t()` en los tres idiomas si S1-01 ya está mergeada; si no, en español neutro y se migran después.

**Aceptación:** tocar un kanji gris en el Atlas dice dónde se vio y cómo conseguirlo; las criaturas doradas llevan su etiqueta en las tres pantallas; una partida vieja carga sin errores y sus kanji vistos muestran una región.

---

## Próximos sprints (tentativo; se confirma en cada planificación)
- **Sprint 2:** traducir el resto de la interfaz; cada unidad termina desbloqueando un kanji; ejercicio de armar frases tocando tarjetas; implementar el mapa de unidades si se aprobó
- **Sprint 3:** datos de kanji y Academia en inglés; IA en el idioma del jugador; volver a simular la economía con 101 kanji y la Arena
- **Sprint 4:** telemetría de economía y validación de partida en el servidor; recompensa de regreso
- **Sprint 5:** desbloqueo progresivo de sistemas; temporada Otoño de momiji 紅葉 con pase gratuito
