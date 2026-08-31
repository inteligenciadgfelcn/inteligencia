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
| 07 | [Servidor nuevo desde cero (staging)](./07-servidor-nuevo-desde-cero.md) | Bootstrap completo del servidor de staging — todo dockerizado (Postgres, nginx, apps, y el registry solo en el servidor dev), revisado 29/08/2026 |
| 08 | [Runbook: reset + Admin inicial](./08-runbook-reset-y-admin-inicial.md) | Contraseña fuerte obligatoria, sin `'123'` |
| 09 | [Manual de usuario](./09-manual-de-usuario.md) | Redirección — ver [manual-usuario/01](./manual-usuario/01-autenticacion-y-autorizacion.md) y [manual-usuario/02](./manual-usuario/02-sistema-de-inteligencia.md). Capturas de pantalla pendientes; sección de módulos `(fase_2)` en la Parte 2 en curso |
| 10 | [Formularios y APIs](./10-formularios-y-apis.md) | Inventario de formularios del frontend (excluye `(fase_2)`), endpoints que consumen y tablas de BD involucradas |
| 11 | [Tablas por base de datos](./11-tablas-por-base-de-datos.md) | Reagrupación del documento 10 en sentido inverso: base de datos → tabla → dónde se usa |
| 12 | [Requisitos de seguridad e infraestructura](./12-requisitos-seguridad-infraestructura.md) | Checklist estándar que infraestructura/seguridad debe mantener en staging y producción — cada punto atado a un incidente real |
| 13 | [Migración y restauración de BD](./13-migracion-y-restauracion-bd.md) | Mecanismo real (TypeORM, no Liquibase), política distinta por ambiente — producción arranca vacía, nunca restaura dump de dev/staging |
| 14 | [Registro de imágenes](./14-registro-de-imagenes.md) | Docker Registry OSS simple, solo en el servidor dev (`.23`) — build/push en dev, pull-only en staging/producción |

Informes de productos (entregables puntuales, fuera de la numeración): [informes/producto-3-implementacion-fase1.md](./informes/producto-3-implementacion-fase1.md)

Decisiones de arquitectura (ADR — por qué se decidió algo y qué se descartó, distinto de la documentación ejecutable de arriba): [adr/0001-postgres-nginx-registry-dockerizados.md](./adr/0001-postgres-nginx-registry-dockerizados.md).

Todo lo ejecutable (compose files, scripts, configs de Postgres/nginx/registry/MkDocs) se movió a [`deploy/`](../deploy/README.md) (30/08/2026) — `docs/` ya no tiene ninguna plantilla propia, solo la narrativa. Ver [`deploy/README.md`](../deploy/README.md) como punto de entrada operativo y [07](./07-servidor-nuevo-desde-cero.md) para la guía completa paso a paso.

## Hallazgos que salieron de escribir esta documentación (no relacionados a los documentos en sí)

Al verificar cada afirmación contra el código y el servidor real (en vez de copiar documentación previa sin chequear), aparecieron 3 problemas concretos, independientes de esta tarea de documentación:

1. **Backup automatizado de PostgreSQL roto desde el 1 de mayo de 2026** — el cron corría todos los días pero fallaba en la primera línea por un permiso de archivo, nunca llegaba a hacer `pg_dump`. **Resuelto: se eliminó el cron** (no reparado — no era un backup específico de este proyecto). Hoy no hay backup automatizado; solo scripts manuales. Detalle en [03-base-de-datos.md](./03-base-de-datos.md) §9.2.
2. **Clave de API real commiteada en texto plano** en `frontend/felcn-base-frontend/.env.sample`. **Resuelto en el archivo actual** (reemplazada por placeholder, commiteado y pusheado) — el valor sigue en el historial de git y la clave real sigue activa en `consulta-persona-api`, pendiente rotarla. Detalle en [04-variables-de-entorno.md](./04-variables-de-entorno.md) §5.
3. **Contraseña hardcodeada `'123'`** en el seed de usuarios — **resuelto** (`ADMIN_INITIAL_PASSWORD` obligatoria y validada). Detalle en [08](./08-runbook-reset-y-admin-inicial.md).
4. **`URL_FRONTEND` no estaba documentada** pese a ser crítica (arma los links de activación/recuperación/desbloqueo por correo) — **resuelto**, agregada en [04](./04-variables-de-entorno.md) §1.
5. **Variables documentadas que nunca existieron en código** (`IOP_SEGIP_*` en ambos backends, "Mensajería Alertín" `MSJ_*` en `base-backend-v2`) y una integración muerta que sí tenía código pero ningún caller (`IOP_SIN_*` en `auth-backend`, no confundir con la integración SIN real y en uso de `base-backend-v2`) — **resuelto**: docs corregidos, código muerto de `auth-backend` eliminado (21/08/2026).
6. **`fake-ciudadania-api` documentado como componente activo sin estarlo** — no está en `docker-compose.yml`, nginx ni en ningún `.env` real; el login ya es 100% contra Ciudadanía Digital real (AGETIC) en todos los ambientes. **Docs corregidos** (21/08/2026); código (`backend/fake-ciudadania-api/`, referencias en `usuario.service.ts`) queda pendiente de eliminar.
7. **Staging vivía en este mismo servidor** compartiendo `docker-compose.yml` y nginx con dev — **sacado de acá el 21/08/2026** (contenedores, servicios del compose, upstreams y locations de nginx). Va en un servidor nuevo separado; [07](./07-servidor-nuevo-desde-cero.md) es la fuente de verdad para levantarlo ahí.

## Hallazgos de la revisión de despliegue dockerizado (29/08/2026)

Al diseñar Postgres/nginx/registry dockerizados para los servidores nuevos, se probó cada pieza de punta a punta en `servertest` (sin tocar el stack real) antes de documentarla — aparecieron estos hallazgos concretos:

8. **La versión real de Postgres es 17.11, no 16** — la documentación anterior decía "^16" sin haberlo verificado contra el servidor real. Confirmado restaurando un dump real contra `postgres:16` (falló por sintaxis de Postgres 17) y contra `postgres:17` (funcionó). Corregido en [03](./03-base-de-datos.md) §1 y en todas las plantillas nuevas.
9. **Faltaba una base de datos en la documentación** (`felcn_s2i`) y el nombre real de otra estaba mal (`a_felcn_lgi`, no `felcn_lgi`) — confirmado contra los `.env` reales de `base-backend-v2`. Corregido en [03](./03-base-de-datos.md) §2.
10. **Bug real en nginx**: un `add_header` dentro de una `location` resetea todos los `add_header` heredados del `server` — la ruta `/_next/static/` del nginx real de `servertest` no lleva los headers de seguridad por esto. No se corrige ahí (ese servidor se da de baja), pero sí en la plantilla nueva para servidores dockerizados. Detalle en [05](./05-nginx-y-tls.md) §1.
11. **Bug real en el script de backup de `auth-backend`**: `backups/dbbackup.sh` respaldaba `database_db` (nombre de `base-backend-v2`, copiado mal) en vez de la base real. Corregido en la versión dockerizada nueva ([deploy/tools/postgres/pg-backup.sh](../deploy/tools/postgres/pg-backup.sh)); el script original no se tocó. Detalle en [03](./03-base-de-datos.md) §9.1.
12. **Variable de entorno muerta eliminada**: `DB_SCHEMA_PARAMETRICAS` en el `docker-compose.yml` real de dev, sin ningún uso en código — sacada. Detalle en [04](./04-variables-de-entorno.md) §2.
13. **Pipelines de CI/CD legados eliminados**: `.gitlab-ci.yml` y `.gitlab/k8s-*.yml` (AGETIC) en los 3 proyectos — confirmado sin push a ningún registry ni uso activo, no eran la base de nada del despliegue actual.

## Hallazgos de la prueba de fidelidad de la documentación (29/08/2026)

Después de escribir la documentación de arriba, se probó siguiéndola **literalmente** (sin el contexto de quien la escribió) para confirmar que alcanza por sí sola — aparecieron 5 bugs mecánicos, los 5 corregidos, ver [ADR-0001](./adr/0001-postgres-nginx-registry-dockerizados.md) para el detalle completo:

14. Nombre de red Docker inconsistente entre `docker-compose.prod.yml` y `docker-compose.registry.yml` (Compose antepone el nombre del directorio si no se fija `name:`) — el registry no podía levantar. Corregido.
15. Los `*.conf.template` de nginx nunca se activaban (nginx solo incluye `*.conf`) — faltaba el paso explícito de renombrar. Corregido en [07](./07-servidor-nuevo-desde-cero.md) Fase 6.
16. Las plantillas referenciaban archivos de certbot (`options-ssl-nginx.conf`, `ssl-dhparams.pem`) que el modo `certonly --webroot` nunca genera (son del plugin `--nginx`). Corregido, sacados de las plantillas.
17. `base-backend-v2` solo tenía `DB_HOST` sobreescrito en la plantilla, no los 8 bloques con prefijo que usa para sus otras bases — quedaban apuntando al Postgres nativo de `servertest`. Corregido.
18. Faltaba documentar el `.env` propio del compose (`DB_PASSWORD`/`TAG`) y el orden real de arranque (Postgres → restore → apps → nginx). Corregido en [07](./07-servidor-nuevo-desde-cero.md) Fase 6.
