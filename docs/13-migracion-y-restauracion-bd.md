# 13 — Migración y restauración de base de datos: mecanismo y política por ambiente

> Se separa de [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) porque la pregunta "¿cómo se pone en pie el schema de una base nueva?" tiene una respuesta distinta según el ambiente (dev/staging pueden partir de un dump con datos; producción no) y merece su propio documento en vez de quedar enterrada en el paso a paso de un servidor puntual.

## 1. El mecanismo real: TypeORM (no Liquibase, no Flyway)

No existe Liquibase, Flyway ni ninguna herramienta de migración externa en este proyecto. Cada backend NestJS (`felcn-auth-backend`, `felcn-base-backend`) trae su propio esquema TypeORM, con dos conjuntos de archivos versionados en `database/migrations/` (estructura: tablas, columnas, índices) y `database/seeds/` (datos: catálogos, políticas Casbin, módulos de menú, usuario admin inicial):

```bash
npm run migrations:run      # aplica migraciones pendientes de database/migrations/ (esquema)
npm run seeds:run           # aplica seeds pendientes de database/seeds/ (datos)
npm run seeds:create database/seeds/nombreDescriptivo   # nueva migración/seed
npm run schema:drop         # DESTRUCTIVO: borra todo el esquema
npm run setup               # migrations:clean + schema:drop + migrations:generate + migrations:run + seeds:run
```

Ambos comandos (`migrations:run`, `seeds:run`) son **idempotentes y acumulativos**: TypeORM registra en una tabla propia (`migrations`, dentro del schema `proyecto`) cuáles ya se ejecutaron, y solo corre las nuevas. Correrlos de nuevo en una base ya migrada no rompe nada ni duplica datos.

**Corregido 29/08/2026 — `database/migrations/` ya no está en `.gitignore`.** Antes de esta fecha esa carpeta no viajaba con `git clone` (`database/seeds/` sí, siempre); ahora los 8 archivos de migración de esquema existentes están versionados igual que los seeds. Un `git clone` en un servidor nuevo (dev, staging o producción) trae ambas carpetas completas — ya no hace falta copiar nada a mano. Verificación rápida tras cualquier clone: `ls backend/felcn-auth-backend/database/migrations/` no debería aparecer vacía.

## 2. Política por ambiente

| Ambiente | Mecanismo | Por qué |
|---|---|---|
| **`servertest`/`desarrollo.felcn.gob.bo` (.20, Postgres nativo)** | Dump/backup restaurado desde otro ambiente (`.sql`/`.dump` vía `pg_restore`/`psql`) **o** `npm run setup` desde cero — indistinto, es un ambiente de trabajo | No hay compromiso de integridad de datos; el objetivo es tener algo con qué probar |
| **Servidores nuevos dockerizados — dev `.23` / staging `.24`** | Dump ya generado el 21/08/2026 de las 8 bases reales (`backups/20260821-staging-migracion/`, fuera de git), restaurado con [deploy/tools/postgres/pg-restore.sh](../deploy/tools/postgres/pg-restore.sh) contra el contenedor de Postgres (`docker exec` + `psql`, no un Postgres nativo) — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) §3. Probado de punta a punta en `servertest` (sin tocar el stack real) el 29/08/2026: restore real de un dump, `docker kill`+recrear el contenedor con los datos intactos por el volumen nombrado `postgres_data`. | Dev/staging necesitan parecerse a producción en volumen de datos para pruebas realistas, así que sí se restaura un dump con datos; dockerizar Postgres no cambia esta política, solo el CÓMO técnico |
| **Producción** | **`migrations:run` + `seeds:run` desde un schema completamente vacío. NUNCA restaurar un dump de dev/staging.** | El usuario lo pidió explícito: producción "debe estar en 0" — sin usuarios de prueba, datos ficticios ni contraseñas conocidas (`ADMIN_INITIAL_PASSWORD` de dev/staging) filtrados a un ambiente real |

### Secuencia exacta para producción (cuando exista el servidor)

1. Base de datos creada, vacía, con el usuario/rol de aplicación ya creado (ver [03-base-de-datos.md](./03-base-de-datos.md) §5/6 para los nombres correctos — **usar los nombres reales del `.env`**, no los de `dbcreate.sql`, que están desactualizados).
2. `git clone` del repo (ya trae `database/migrations/` y `database/seeds/` completos, ver §1).
3. `npm run migrations:run` en cada backend — deja el schema (tablas, columnas, índices, políticas Casbin, catálogo de módulos de menú) en el estado exacto que hoy tiene dev, sin ningún dato transaccional.
4. `ADMIN_INITIAL_PASSWORD` propia de producción (nunca reutilizar la de dev/staging) en el `.env`, después `npm run seeds:run` — crea el usuario administrador inicial con esa contraseña. Ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md).
5. Ningún dato de negocio (personas, operativos, casos, etc.) se migra desde dev/staging — producción arranca sin ningún registro salvo lo que traen los seeds (catálogos base: grados, roles, módulos de menú, políticas Casbin).

Si en algún momento se decide que sí hace falta migrar datos reales de dev/staging a producción (por ejemplo, catálogos que un usuario cargó a mano y no están en ningún seed versionado), eso es una decisión aparte, puntual, que hay que evaluar caso por caso — no el procedimiento por defecto.

## 3. ⚠️ El backup automatizado de Postgres está roto desde el 1 de mayo de 2026

Ver detalle completo en [03-base-de-datos.md](./03-base-de-datos.md) §9.2 — el cron diario de `pg_dump` fallaba en su primera línea por un permiso de archivo de log y nunca llegó a respaldar nada. Se decidió eliminar el cron en vez de repararlo (no era específico de este proyecto) y **hoy no existe ningún backup automatizado**.

**Esto es directamente relevante para producción**: no hay que asumir que "si algo sale mal en producción, restauramos el backup de dev" — hoy esa opción no existe como red de seguridad automatizada. Antes de dar por lista cualquier instalación (staging o producción), configurar un backup propio de este proyecto (`pg_dump` por cron, retención definida, **probado de verdad tras instalarlo** — no solo "el cron corrió sin error en el log", confirmar que el archivo de dump se generó y es restaurable). Para los servidores nuevos dockerizados, usar [deploy/tools/postgres/pg-backup.sh](../deploy/tools/postgres/pg-backup.sh) (recibe la base de datos como argumento) en vez de `backups/dbbackup.sh` de cada backend — ese script tenía un bug real (`auth-backend/backups/dbbackup.sh` respaldaba `database_db`, el nombre de `base-backend-v2`, copiado mal) que la versión dockerizada corrige.
