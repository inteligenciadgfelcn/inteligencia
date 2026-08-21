# Documentación — proyecto `inteligencia`

| # | Documento | Contenido |
|---|---|---|
| 00 | [Arquitectura](./00-arquitectura.md) | Mapa de componentes, puertos, dominios, flujo de tráfico |
| 01 | [Entorno local sin Docker](./01-entorno-local-sin-docker.md) | Arranque nativo por proyecto |
| 02 | [Entorno Docker (dev)](./02-entorno-docker-dev.md) | `docker-compose.yml` real, cómo levantarlo — staging se sacó de este servidor el 21/08/2026 |
| 03 | [Base de datos](./03-base-de-datos.md) | Bases reales, creación, migraciones, backups |
| 04 | [Variables de entorno](./04-variables-de-entorno.md) | Tabla consolidada por proyecto, qué es secreto |
| 05 | [nginx y TLS](./05-nginx-y-tls.md) | Config real, rutas, mTLS, rate limiting |
| 06 | [systemd y contenedores](./06-systemd-y-contenedores.md) | Políticas de reinicio |
| 07 | [Servidor nuevo desde cero (staging)](./07-servidor-nuevo-desde-cero.md) | Bootstrap completo del servidor de staging — nginx y Postgres nativos (mismo patrón que `servertest`), apps con Docker |
| 08 | [Runbook: reset + Admin inicial](./08-runbook-reset-y-admin-inicial.md) | Contraseña fuerte obligatoria, sin `'123'` |
| 09 | [Manual de usuario](./09-manual-de-usuario.md) | Redirección — ver [manual-usuario/01](./manual-usuario/01-autenticacion-y-autorizacion.md) y [manual-usuario/02](./manual-usuario/02-sistema-de-inteligencia.md). Capturas de pantalla pendientes; sección de módulos `(fase_2)` en la Parte 2 en curso |
| 10 | [Formularios y APIs](./10-formularios-y-apis.md) | Inventario de formularios del frontend (excluye `(fase_2)`), endpoints que consumen y tablas de BD involucradas |
| 11 | [Tablas por base de datos](./11-tablas-por-base-de-datos.md) | Reagrupación del documento 10 en sentido inverso: base de datos → tabla → dónde se usa |
| 12 | [Requisitos de seguridad e infraestructura](./12-requisitos-seguridad-infraestructura.md) | Checklist estándar que infraestructura/seguridad debe mantener en staging y producción — cada punto atado a un incidente real |

Informes de productos (entregables puntuales, fuera de la numeración): [informes/producto-3-implementacion-fase1.md](./informes/producto-3-implementacion-fase1.md)

`templates/` queda de una iteración anterior y está desactualizado (compose de un solo ambiente) — no usar como fuente de verdad, ver nota en [02](./02-entorno-docker-dev.md).

## Hallazgos que salieron de escribir esta documentación (no relacionados a los documentos en sí)

Al verificar cada afirmación contra el código y el servidor real (en vez de copiar documentación previa sin chequear), aparecieron 3 problemas concretos, independientes de esta tarea de documentación:

1. **Backup automatizado de PostgreSQL roto desde el 1 de mayo de 2026** — el cron corría todos los días pero fallaba en la primera línea por un permiso de archivo, nunca llegaba a hacer `pg_dump`. **Resuelto: se eliminó el cron** (no reparado — no era un backup específico de este proyecto). Hoy no hay backup automatizado; solo scripts manuales. Detalle en [03-base-de-datos.md](./03-base-de-datos.md) §9.2.
2. **Clave de API real commiteada en texto plano** en `frontend/felcn-base-frontend/.env.sample`. **Resuelto en el archivo actual** (reemplazada por placeholder, commiteado y pusheado) — el valor sigue en el historial de git y la clave real sigue activa en `consulta-persona-api`, pendiente rotarla. Detalle en [04-variables-de-entorno.md](./04-variables-de-entorno.md) §6.
3. **Contraseña hardcodeada `'123'`** en el seed de usuarios — **resuelto** (`ADMIN_INITIAL_PASSWORD` obligatoria y validada). Detalle en [08](./08-runbook-reset-y-admin-inicial.md).
4. **`URL_FRONTEND` no estaba documentada** pese a ser crítica (arma los links de activación/recuperación/desbloqueo por correo) — **resuelto**, agregada en [04](./04-variables-de-entorno.md) §1.
5. **Variables documentadas que nunca existieron en código** (`IOP_SEGIP_*` en ambos backends, "Mensajería Alertín" `MSJ_*` en `base-backend-v2`) y una integración muerta que sí tenía código pero ningún caller (`IOP_SIN_*` en `auth-backend`, no confundir con la integración SIN real y en uso de `base-backend-v2`) — **resuelto**: docs corregidos, código muerto de `auth-backend` eliminado (21/08/2026).
6. **`fake-ciudadania-api` documentado como componente activo sin estarlo** — no está en `docker-compose.yml`, nginx ni en ningún `.env` real; el login ya es 100% contra Ciudadanía Digital real (AGETIC) en todos los ambientes. **Docs corregidos** (21/08/2026); código (`backend/fake-ciudadania-api/`, referencias en `usuario.service.ts`) queda pendiente de eliminar.
7. **Staging vivía en este mismo servidor** compartiendo `docker-compose.yml` y nginx con dev — **sacado de acá el 21/08/2026** (contenedores, servicios del compose, upstreams y locations de nginx). Va en un servidor nuevo separado; [07](./07-servidor-nuevo-desde-cero.md) es la fuente de verdad para levantarlo ahí.
