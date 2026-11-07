# Análisis de diseño de KANJŪ

Revisión como diseñador de videojuegos para dos públicos: quien quiere aprender japonés y quien quiere un juego de monstruos (fans de Digimon World / Pokémon / Clash Royale).

## Fortalezas
- **Hábito diario sin castigo:** calendario de 7 días, misiones, tinta que se acumula, repaso espaciado y huellas en los viajes.
- **Aprender es avanzar:** la maestría de un kanji decide si la criatura evoluciona, cuánta tinta produce y qué tan fuerte ataca.
- **Fusión con kanji reales:** descubrir 日 + 寺 = 時 se siente como una receta secreta y enseña composición.
- **Sesiones flexibles:** 2 minutos (recoger, repasar) o 30 (Academia, cuentos, fusiones, Arena).

## Problemas detectados
1. **Sobrecarga inicial:** demasiados sistemas, monedas y medidores visibles desde el minuto 1. *(Se resuelve en la etapa gráfica con desbloqueo progresivo.)*
2. **Faltaba un verbo central para fans de monstruos:** las criaturas no se usaban en desafíos donde importe cuáles elegiste.
3. **Muro a mitad de juego:** tras la semana 1 el ritmo de novedades cae; faltaban metas intermedias.
4. **La maestría frena a quien solo quiere jugar:** es intencional (repetición espaciada), pero hacía falta algo para hacer mientras tanto.
5. **Fusión y apego:** se decidió mantener la fusión como en Digimon (nace una criatura nueva y las otras se consumen). Quien quiera conservar a su criatura, la evoluciona. Esto también evita acumular cientos de criaturas.

## Decisiones (implementadas)
| Problema | Solución |
|---|---|
| 2 | **Arena 闘 estilo Clash Royale:** duelos 3 contra 3; cada ataque es un desafío del kanji del atacante (significado o lectura, 7 s). Crítico si respondés rápido, combo y técnica especial 必殺. Copas, 6 arenas, camino de copas con premios. |
| 2 | **Tipos 五行 (gogyō):** los elementos se agrupan en los cinco elementos japoneses (木 火 土 金 水) con su ciclo real de dominio: 木>土>水>火>金>木. Ventaja ×1,5, desventaja ×0,7. |
| 2 | **Estadísticas que importan:** ataque y vida según nivel, nivel KANJŪ, estrellas, vínculo, variante dorada y **maestría del kanji**. |
| 4 | **Cofres que se abren estudiando** (no esperando): cada acierto en Repaso, Academia o entrenamiento suma. 4 espacios; si están llenos, ganar solo da copas. |
| 3 | **Familias 族:** kanji que comparten pieza o base (寺: 寺 時 持 待; 喿; 辶…), con premio al completarlas. Arenas y camino de copas como metas de semanas. |

## Pendiente (etapa gráfica)
- Desbloqueo progresivo de sistemas y simplificación de monedas/medidores en pantalla.
- Personalidades y vida en el santuario.
- Elegir perfil al empezar (aprender japonés / solo jugar) para ajustar ayudas.
