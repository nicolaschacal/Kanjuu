# IA de KANJŪ (tarea A-11a)

Dos caminos, como en heey. Todo pasa por `api/ai.js`: **la clave nunca vive en el navegador**.

| Camino | Quién | Qué hace el jugador | Límite |
|---|---|---|---|
| IA incluida (de la casa) | Jugadores Plus | Nada: solo juega | `KANJUU_AI_PLUS_MONTHLY` usos por mes (1 cuento o 1 explicación = 1 uso) |
| Clave propia | Cualquier jugador con cuenta | Pega su clave y elige proveedor y modelo en Menú → IA | Sin límite de KANJŪ (paga su proveedor) |

Si el jugador tiene clave propia, se usa esa y no gasta el cupo de Plus.

## Variables de entorno (Vercel → proyecto → Settings → Environment Variables)

| Variable | Obligatoria | Ejemplo | Para qué |
|---|---|---|---|
| `ENCRYPTION_KEY` | Sí, para claves propias | salida de `openssl rand -base64 48` | Cifra las claves de los jugadores (AES-256-GCM). **No cambiarla nunca**: las claves guardadas dejarían de abrirse |
| `KANJUU_AI_API_KEY` | Sí, para la IA incluida | `AIza…` | Clave de la IA de la casa |
| `KANJUU_AI_PROVIDER` | No (gemini) | `gemini` · `groq` · `anthropic` · `openai` · `openrouter` · `custom` | Proveedor de la casa |
| `KANJUU_AI_MODEL` | No | `gemini-2.5-flash-lite` | Modelo de la casa |
| `KANJUU_AI_BASE_URL` | Solo con `custom` | `https://…/v1` | API compatible con OpenAI |
| `KANJUU_AI_PLUS_MONTHLY` | No (150) | `150` | Usos por mes de cada jugador Plus |
| `KANJUU_PLUS_EMAILS` | No | `yo@mail.com,amigo@mail.com` | Jugadores Plus a mano (pruebas, regalos) hasta que haya cobro |

## Plus

Hoy un jugador es Plus si su email está en `KANJUU_PLUS_EMAILS` o si tiene una fila vigente en la tabla `plus` (`user_id`, `until`, `source`). El cobro (precio, pasarela) se decide después; cuando exista, el webhook de pago solo tiene que escribir en esa tabla.

## Tablas (se crean solas)

`ai_keys` (clave propia cifrada), `ai_usage` (usos por jugador y mes), `plus`.
