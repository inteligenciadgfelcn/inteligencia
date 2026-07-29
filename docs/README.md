# Documentación — proyecto `inteligencia`

| # | Documento | Contenido |
|---|---|---|
| 00 | [Arquitectura](./00-arquitectura.md) | Mapa de componentes, puertos, dominios, flujo de tráfico |
| 01 | [Entorno local sin Docker](./01-entorno-local-sin-docker.md) | Arranque nativo por proyecto |
| 02 | [Entorno Docker (dev + staging)](./02-entorno-docker-dev.md) | `docker-compose.yml` real, cómo levantarlo |
| 03 | [Base de datos](./03-base-de-datos.md) | Bases reales, creación, migraciones, backups |
| 04 | [Variables de entorno](./04-variables-de-entorno.md) | Tabla consolidada por proyecto, qué es secreto |
| 05 | [nginx y TLS](./05-nginx-y-tls.md) | Config real, rutas, mTLS, rate limiting |
| 06 | [systemd y contenedores](./06-systemd-y-contenedores.md) | Políticas de reinicio |
| 07 | [Servidor nuevo desde cero](./07-servidor-nuevo-desde-cero.md) | Bootstrap completo, nginx y Postgres dockerizados |
| 08 | [Runbook: reset + Admin inicial](./08-runbook-reset-y-admin-inicial.md) | Contraseña fuerte obligatoria, sin `'123'` |
| 09 | [Manual de usuario](./09-manual-de-usuario.md) | Placeholder — pendiente con capturas |

`templates/` queda de una iteración anterior y está desactualizado (compose de un solo ambiente) — no usar como fuente de verdad, ver nota en [02](./02-entorno-docker-dev.md).

## Hallazgos que salieron de escribir esta documentación (no relacionados a los documentos en sí)

Al verificar cada afirmación contra el código y el servidor real (en vez de copiar documentación previa sin chequear), aparecieron 3 problemas concretos, independientes de esta tarea de documentación:

1. **Backup automatizado de PostgreSQL roto desde el 1 de mayo de 2026** — el cron corría todos los días pero fallaba en la primera línea por un permiso de archivo, nunca llegaba a hacer `pg_dump`. **Resuelto: se eliminó el cron** (no reparado — no era un backup específico de este proyecto). Hoy no hay backup automatizado; solo scripts manuales. Detalle en [03-base-de-datos.md](./03-base-de-datos.md) §9.2.
2. **Clave de API real commiteada en texto plano** en `frontend/felcn-base-frontend/.env.sample`. **Resuelto en el archivo actual** (reemplazada por placeholder, commiteado y pusheado) — el valor sigue en el historial de git y la clave real sigue activa en `consulta-persona-api`, pendiente rotarla. Detalle en [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6.
3. **Contraseña hardcodeada `'123'`** en el seed de usuarios — **resuelto** (`ADMIN_INITIAL_PASSWORD` obligatoria y validada). Detalle en [08](./08-runbook-reset-y-admin-inicial.md).
