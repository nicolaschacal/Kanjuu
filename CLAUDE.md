# KANJŪ — reglas para Claude y su equipo de agentes

Juego mobile-first (vertical, táctil) de criaturas kanji. Web estática sin build (`index.html` + módulos ES en `js/`), escena 3D con three.js, API serverless en `api/` (Vercel + Neon). Dueño y único aprobador: **Nicolás (nicolaschacal)**.

Antes de trabajar, leer: `docs/SPRINTS.md` (proceso), `docs/BACKLOG.md` (qué hacer), `ROADMAP.md` (hacia dónde va).

## Reglas que no se rompen
1. **Nunca hacer push ni merge a `main`.** Todo va en una rama `sprint-NN/ID-…` con su pull request. Merge = aprobación de Nicolás.
2. **Una tarea por pull request.** Si una tarea no entra en un turno, dividirla y avisarlo en el PR.
3. **Lo visual se aprueba antes de implementarse:** propuesta primero, implementación después (ver `docs/SPRINTS.md`). La implementación debe quedar igual a lo aprobado.
4. **Santuario (con modo editor) y Arenas están cerrados.** No rediseñarlos; solo corregir errores o lo que una tarea pida explícitamente.
5. **Guardado compatible hacia atrás:** toda partida existente debe cargar después del cambio. Campos nuevos con valor por defecto (`??=`).
6. **Producción intocable:** no cambiar variables de entorno, dominios ni ajustes de Vercel; no ejecutar SQL a mano contra Neon; no borrar datos. Las tablas nuevas se crean solas desde la API con `CREATE TABLE IF NOT EXISTS`.
7. **Sin servicios pagos nuevos, sin secretos en el código, sin dependencias pesadas.**
8. **Ante una decisión irreversible o dudosa:** preparar todo, explicarla en "Necesita tu decisión" del PR y no avanzar con eso.
9. **No borrar ramas ni cerrar pull requests ajenos.**

## Producto
- El juego enseña kanji reales: recetas de fusión verificadas con KanjiVG (`docs/NIVELES.md`); cada criatura muestra solo lecturas exactas de su kanji (`docs/LECTURAS.md`).
- Nunca vender kanji del currículo central, evoluciones, maestría ni ventaja en la Arena. Sin anuncios. Público: todos (ver `ROADMAP.md` §8 y §9).
- Sin rachas punitivas, sin energía que bloquee jugar.
- **Idiomas:** español e inglés. Una vez que exista `js/i18n.js`, todo texto nuevo va con `t()` y en ambos diccionarios.
- La furigana en la interfaz es necesaria y se puede apagar; no quitarla.
- Íconos estilo sistema operativo, no emojis.

## Calidad
- Probar en viewport de teléfono (390 × 844) con Playwright: sin errores de consola y con el flujo cambiado funcionando.
- Respetar "reducir movimiento" y el rendimiento en teléfonos (sin trabajo por cuadro innecesario).
- Mensajes de commit y textos de PR en español.

## Equipo (`.claude/agents/`)
La sesión principal es el **director**: planifica, reparte y vigila que nadie se vaya por las ramas. Roles: `integrador` (código), `disenador-gui` (interfaz), `educador` (aprendizaje), `artista-2d` (arte), `revisor` (verificación independiente).
