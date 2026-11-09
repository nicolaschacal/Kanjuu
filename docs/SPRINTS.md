# Sprints de KANJŪ — cómo trabaja el equipo de agentes

El equipo trabaja solo, sin supervisión, y **nunca toca `main`**. Cada cambio llega como pull request con una vista previa jugable. Nicolás aprueba o rechaza desde el celular cuando puede.

## Ritmo
- **Sprint = 1 semana** (lunes a domingo). El contenido de cada sprint está en `docs/BACKLOG.md`.
- **Turno de trabajo:** una tarea programada abre una sesión nueva todas las noches. Cada turno trabaja como máximo en una tarea nueva, más las correcciones pendientes.
- **Límite de trabajo en curso: 3 pull requests esperando revisión.** Si ya hay 3, el turno solo atiende comentarios y no empieza nada nuevo. Así no se acumulan cambios que después chocan entre sí.

## Cómo aprueba Nicolás (desde la app de GitHub o el navegador)
| Quiero… | Hago… |
|---|---|
| Ver el cambio funcionando | Abrir el pull request y tocar el enlace de vista previa de Vercel |
| **Aprobarlo** | **Merge** (pasa a `main` y se publica) |
| Pedir cambios | Dejar un comentario en el pull request; el próximo turno lo corrige en la misma rama |
| **Rechazarlo** | **Close** con un comentario del porqué; el próximo turno lo registra y no insiste |
| Cambiar prioridades | Comentar en el pull request de planificación del sprint, o decírselo a Claude en el chat |

## Qué hace cada turno, en orden
1. **Preparar:** adjuntar el repo con permiso de escritura, clonarlo y leer `CLAUDE.md`, este documento, `docs/BACKLOG.md` y `ROADMAP.md`.
2. **Leer el estado en GitHub** (la fuente de verdad es GitHub, no un archivo):
   - Pull requests **abiertos** con comentarios nuevos de nicolaschacal → atenderlos primero, en su misma rama.
   - Pull requests **cerrados sin merge** desde el último turno → la tarea queda rechazada; anotar el motivo en el próximo PR de planificación.
   - Pull requests **mergeados** → la tarea está hecha.
3. **Elegir la próxima tarea** del sprint actual, en el orden del backlog, que no tenga rama ni pull request. Si el sprint se terminó, abrir el **pull request de planificación** del sprint siguiente (ver abajo) y no empezar tareas nuevas hasta que se apruebe.
4. **Planificar como director:** leer el código involucrado, decidir el enfoque y repartir el trabajo entre los roles (`.claude/agents/`).
5. **Implementar** en la rama `sprint-NN/ID-descripcion` creada desde `main` actualizado.
6. **Verificar:**
   - `node --check` sobre los módulos tocados y el chequeo de idiomas cuando exista.
   - Prueba en navegador sin pantalla (Playwright) con viewport de teléfono (390 × 844): el juego carga, no hay errores en la consola, y el flujo cambiado funciona.
   - El **revisor** (un agente que no escribió el código) compara el resultado con los criterios de aceptación.
7. **Abrir el pull request** (ver plantilla).
8. **Cerrar el turno** con un mensaje corto para Nicolás: qué se entregó, enlaces a los pull requests y capturas.

## Plantilla de pull request
Título: `[Sprint N] ID · Qué cambia`

```
## Qué cambia
(2–4 líneas, en lenguaje de jugador)

## Cómo probarlo
1. Abrir la vista previa de Vercel (enlace en el comentario del bot)
2. …

## Criterios de aceptación
- [x] …

## Riesgos y notas
(guardado, migraciones, cosas que quedaron fuera)

## Necesita tu decisión
(solo si hay algo que elegir; si no, "Nada")
```

## Planificación de sprint
Cuando el sprint actual se termina, el turno abre un pull request que solo cambia `docs/BACKLOG.md`:
- Resumen del sprint: qué se aprobó, qué se rechazó y por qué
- Propuesta de 4 a 6 tareas para el sprint siguiente, sacadas del `ROADMAP.md`, cada una con criterios de aceptación

Aprobar ese pull request = aprobar el sprint.

## Reglas de diseño
Lo visual se aprueba antes de implementarse. Toda tarea marcada **diseño** se entrega en dos pull requests:
1. **Propuesta:** maqueta navegable o capturas, sin tocar el juego real.
2. **Implementación:** solo después de que la propuesta se mergeó, y fiel a ella.
