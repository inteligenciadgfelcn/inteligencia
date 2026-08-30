# 03 — Base de datos

## 1. Motor

**Corregido 29/08/2026: PostgreSQL 17.11**, no 16 — el dato anterior ("^16, cliente 17.10") era una suposición sin verificar contra el servidor real. Confirmado empíricamente restaurando un dump real (`felcn_auth_v3_schemaonly_20260827_094430.sql`, cabecera `Dumped from database version 17.11`) contra un contenedor `postgres:16` (falló: `ERROR: unrecognized configuration parameter "transaction_timeout"`, sintaxis introducida en Postgres 17) y luego contra `postgres:17` (funcionó limpio). Corre **nativo en el host** `servertest`, no dockerizado.

**Los servidores nuevos (dev `.23` / staging `.24` / producción) ya NO replican el patrón nativo** — corren Postgres dockerizado (`postgres:17`, versión real confirmada arriba) — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 3 y las plantillas en [docs/templates/postgres/](./templates/postgres/).

## 2. Bases de datos reales en uso

Fuente de verdad: los `.env` / `.env.sample` de cada backend (no los `dbcreate.sql`, ver advertencia en sección 4).

**Corregido 29/08/2026** — la tabla anterior tenía dos errores (nombre real de LGI sin el prefijo `a_`, y faltaba `felcn_s2i` por completo): faltante confirmado contra los `.env` reales de `base-backend-v2` (`grep -oE "^DB_[A-Z0-9_]*_DATABASE=" .env`), que listan 9 bases en total, no 8. También el nombre oficial de la primera se corrigió de `felcn_auth_v3` a `felcn_auth` (ver advertencia debajo de esta tabla y [04-variables-de-entorno.md](./04-variables-de-entorno.md)) — aplica a servidores **nuevos**, `servertest` sigue con `felcn_auth_v3`.

| Base de datos | Usada por | Schemas relevantes |
|---|---|---|
| `felcn_auth` (`felcn_auth_v3` en `servertest`) | `auth-backend` (principal), `base-backend-v2` (conexión `DB_AUTH_*`/por defecto, lectura de usuarios) | `usuario` (usuarios, personas, roles, módulos, sesiones), `parametro`, `felcn_estructura`, `proyecto` |
| `felcn_siii` | `base-backend-v2` (`DB_SIII_*`) | ver `felcn_siii.sql` |
| `a_felcn_lgi` | `base-backend-v2` (`DB_LGI_*`) | ver `lgi-catalogos.sql` |
| `felcn_s2i` | `base-backend-v2` (`DB_S2I_*`) | — |
| `a_felcn_asignacion_caso` | `base-backend-v2` (`DB_ASIG_CASOS_*`) | ver `felcn_asignacion_caso.sql` |
| `a_felcn_sii` | `base-backend-v2` (`DB_SII_*`) | — |
| `a_felcn_sospechoso` | `base-backend-v2` (`DB_SOSPECHOSO_*`) | — |
| `felcn_personas` | `base-backend-v2` (`DB_PERSONAS_*`) | — |
| `felcn_vls` | `base-backend-v2` (`DB_VLS_*`) | — |

El schema `fake_ciudadania` **sigue existiendo físicamente** en `felcn_auth_v3` (`\dn` lo confirma) aunque `fake-ciudadania-api` está confirmado sin uso (ver [00-arquitectura.md](./00-arquitectura.md) §1) — nadie lo escribe hoy. Queda huérfano hasta que se limpie el código de `fake-ciudadania-api`; en ese momento evaluar si también hay que dropear este schema.

`base-backend-v2` es multi-conexión: cada bloque `DB_<NOMBRE>_*` en su `.env` apunta a una base distinta (pueden estar en el mismo servidor Postgres o no). Antes de tocar credenciales de una, confirmar cuáles comparten instancia física.

## 3. Schemas del dominio `usuario` (felcn_auth_v3)

Según `database/scripts/README.md` de auth-backend:

| Schema | Descripción |
|---|---|
| `proyecto` | Schema por defecto de TypeORM |
| `usuario` | Usuarios, personas, roles, módulos, sesiones, tokens |
| `parametro` | Parámetros generales del sistema |
| `felcn_estructura` | Estructura organizacional FELCN (grado, unidad, distrital, grupo) |

## 4. ⚠️ Advertencia: los scripts `dbcreate.sql` tienen nombres desactualizados

Los scripts `database/scripts/dbcreate.sql` de **ambos** proyectos crean nombres de ejemplo que **no coinciden** con lo que usan los `.env.sample` reales:

| Script | Crea la base | Schemas que crea | Nombre real esperado por el `.env` |
|---|---|---|---|
| `felcn-auth-backend/database/scripts/dbcreate.sql` | `felcn_auth` | `proyecto`, `usuario`, `parametro`, `felcn_estructura` | `felcn_auth_v3` |
| `felcn-base-backend-v2/database/scripts/dbcreate.sql` | `database_db` | `proyecto`, `usuarios`, `parametricas` | (multi-base, ver tabla arriba) — y el schema real es `usuario` (singular), no `usuarios` |

**Antes de correr `dbcreate.sql` en `servertest`**, editar el nombre de la base (`CREATE DATABASE ...`) para que coincida con el `.env` que se vaya a usar (`felcn_auth_v3`), o renombrar la base después de crearla. Esto es una fuente típica de "no conecta" para un developer nuevo que sigue el script al pie de la letra.

**Nota (29/08/2026): para servidores nuevos dockerizados, no se usa `dbcreate.sql` directamente** — el nombre `felcn_auth` que ya trae este script es, de hecho, el nombre oficial correcto para esos servidores (ver corrección de la tabla arriba). El init real para esos servidores es [docs/templates/postgres/01-crear-bases.sql](./templates/postgres/01-crear-bases.sql), que crea las 9 bases reales (con el nombre `felcn_auth` correcto) de una sola vez — no requiere editar nada a mano. `dbcreate.sql` de `base-backend-v2` sigue desactualizado (crea `database_db` con schema `usuarios` en plural) y no se usa en ningún lado para bootstrap real; dev/staging bootstrapean restaurando un dump, no corriendo `dbcreate.sql`.

## 5. Creación desde cero (sandbox local de un developer, con Docker)

Para un contenedor de Postgres puntual en la máquina de un developer (no para levantar un servidor nuevo — eso es [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md) Fase 3, con `postgres:17` y [docs/templates/postgres/](./templates/postgres/)):

```bash
docker run --name pg17 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:17

cd backend/felcn-auth-backend
bash database/scripts/dbcreate_docker.sh pg17

cd ../felcn-base-backend-v2
bash database/scripts/dbcreate_docker.sh pg17
```

## 6. Creación desde cero (Postgres nativo)

```bash
# habilitar auth por password para el usuario postgres (una vez)
# editar /etc/postgresql/16/main/pg_hba.conf: local all postgres md5

sudo -u postgres psql -f backend/felcn-auth-backend/database/scripts/dbcreate.sql
sudo -u postgres psql -f backend/felcn-base-backend-v2/database/scripts/dbcreate.sql
```

Revisar antes los nombres de base según la advertencia de la sección 4.

## 7. Migraciones y seeds (TypeORM)

Ambos backends NestJS usan los mismos comandos (`ormconfig-default.ts` para migraciones de esquema, `ormconfig-seed.ts` para datos semilla):

```bash
npm run migrations:run      # aplica migraciones pendientes (esquema/tablas)
npm run seeds:run           # aplica seeds (datos semilla)
npm run seeds:create database/seeds/nombreDescriptivo   # nueva migración/seed
npm run schema:drop         # DESTRUCTIVO: borra todo el esquema
npm run setup               # migrations:clean + schema:drop + migrations:generate + migrations:run + seeds:run
```

`npm run setup` es para partir de cero — no correrlo nunca contra una base con datos reales que se quieran conservar.

## 8. Seeds de usuarios — corregido

El seed `felcn-auth-backend/database/seeds/1611171041790-usuario.ts` ya no usa contraseña hardcodeada `'123'` — ahora exige `ADMIN_INITIAL_PASSWORD` (obligatoria, validada con `TextService.validateLevelPassword`). Ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md) para el detalle y lo que quedó pendiente (separar los usuarios de prueba del seed de producción).

## 9. Backups

### 9.1. Scripts manuales por proyecto

Cada proyecto trae `backups/dbbackup.sh` / `dbbackup_docker.sh` / `dbrestore.sh` / `dbrestore_docker.sh` (ver `backups/BACKUP_AND_RESTORE.md` en cada uno) — son manuales, para uso puntual de un developer (`pg_dump` de una sola base).

**Bug real encontrado y corregido (29/08/2026, solo en la versión dockerizada nueva)**: `felcn-auth-backend/backups/dbbackup.sh` hacía `pg_dump ... database_db` — `database_db` es el nombre de placeholder de `base-backend-v2`, copiado mal; el script de auth-backend nunca respaldó realmente `felcn_auth_v3`. La versión nueva para servidores dockerizados ([docs/templates/postgres/pg-backup.sh](./templates/postgres/pg-backup.sh)) recibe el nombre de la base como argumento, corrigiendo esto. El script original de este repo (`backups/dbbackup.sh`) no se tocó.

### 9.2. No hay backup automatizado para este proyecto

Existía un cron diario (`/home/server/devops-agent/scripts/db/backup-postgres.sh`, fuera de este repo, parte del toolkit de administración del servidor — ver `devops-agent`) que llevaba **roto desde el 1 de mayo de 2026**: fallaba en la primera línea por un permiso de archivo de log (`/opt/docker-production/logs/backup-postgres.log` quedó `root:root`, el script corre como `server`, y `set -euo pipefail` cortaba la ejecución ahí mismo) y nunca llegó a ejecutar ningún `pg_dump` real de las bases de la aplicación. Se decidió **eliminar el cron en vez de repararlo** (no es un backup que pertenezca a este proyecto) — la entrada ya no está en el crontab del usuario `server`.

**Conclusión: hoy no hay ningún backup automatizado de las bases de datos de este proyecto.** Solo quedan los scripts manuales de la sección 9.1, a ejecutar puntualmente. Si se quiere backup automatizado en el futuro, diseñarlo específicamente para este proyecto (qué bases, dónde, con qué retención) en vez de depender del script genérico del servidor.
