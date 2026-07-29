# 03 — Base de datos

## 1. Motor

PostgreSQL ^16 (el servidor actual tiene el cliente 17.10 instalado — verificar compatibilidad si se apunta a una versión de servidor distinta a 16). Hoy corre **nativo en el host** `servertest`, no dockerizado. Para el servidor nuevo se dockeriza — ver [07-servidor-nuevo-desde-cero.md](./07-servidor-nuevo-desde-cero.md).

## 2. Bases de datos reales en uso

Fuente de verdad: los `.env` / `.env.sample` de cada backend (no los `dbcreate.sql`, ver advertencia en sección 4).

| Base de datos | Usada por | Schemas relevantes |
|---|---|---|
| `felcn_auth_v3` | `auth-backend` (principal), `base-backend-v2` (conexión `DB_AUTH_*`, lectura de usuarios), `fake-ciudadania-api` (schema propio) | `usuario` (usuarios, personas, roles, módulos, sesiones), `parametro`, `felcn_estructura`, `proyecto`, `fake_ciudadania` |
| `felcn_siii` | `base-backend-v2` (`DB_SIII_*`) | ver `felcn_siii.sql` |
| `felcn_lgi` | `base-backend-v2` (`DB_LGI_*`, mismo servidor que SIII) | ver `lgi-catalogos.sql` |
| `a_felcn_asignacion_caso` | `base-backend-v2` (`DB_ASIG_CASOS_*`) | ver `felcn_asignacion_caso.sql` |
| `a_felcn_sii` | `base-backend-v2` (`DB_SII_*`) | — |
| `a_felcn_sospechoso` | `base-backend-v2` (`DB_SOSPECHOSO_*`) | — |
| `felcn_personas` | `base-backend-v2` (`DB_PERSONAS_*`) | — |
| `felcn_vls` | `base-backend-v2` (`DB_VLS_*`) | — |
| `bolivia_hub` | `consulta-persona-api` — **no está en este servidor**, host externo (`72.60.156.246` en `.env.example`) | — |

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

**Antes de correr `dbcreate.sql` en un servidor nuevo**, editar el nombre de la base (`CREATE DATABASE ...`) para que coincida con el `.env` que se vaya a usar, o renombrar la base después de crearla. Esto es una fuente típica de "no conecta" para un developer nuevo que sigue el script al pie de la letra.

## 5. Creación desde cero (desarrollo, con Docker)

```bash
docker run --name pg16 -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:16.0

cd backend/felcn-auth-backend
bash database/scripts/dbcreate_docker.sh pg16

cd ../felcn-base-backend-v2
bash database/scripts/dbcreate_docker.sh pg16
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

## 8. Seeds de usuarios — pendiente de corrección

El seed `felcn-auth-backend/database/seeds/1611171041790-usuario.ts` crea hoy 3 usuarios de prueba (`ADMINISTRADOR`, `ADMINISTRADOR-TECNICO`, `TECNICO`) con **contraseña hardcodeada `'123'`** y personas ficticias con correos `yopmail.com`. Esto se está corrigiendo — ver [08-runbook-reset-y-admin-inicial.md](./08-runbook-reset-y-admin-inicial.md) para el diseño nuevo (usuario Admin con contraseña fuerte desde variable de entorno, datos de prueba solo en dev).

## 9. Backups

### 9.1. Scripts manuales por proyecto

Cada proyecto trae `backups/dbbackup.sh` / `dbbackup_docker.sh` / `dbrestore.sh` / `dbrestore_docker.sh` (ver `backups/BACKUP_AND_RESTORE.md` en cada uno) — son manuales, para uso puntual de un developer (`pg_dump` de una sola base).

### 9.2. 🚨 Backup automatizado diario — ROTO desde el 1 de mayo de 2026

Existe un cron real y más completo, fuera de los repos de proyecto:

```
0 2 * * * /bin/bash /home/server/devops-agent/scripts/db/backup-postgres.sh >> /opt/docker-production/logs/backup-cron.log 2>&1
```

Este script (`/home/server/devops-agent/scripts/db/backup-postgres.sh`) hace `pg_dump -Fc` de **todas** las bases de datos del clúster (más los globals) hacia `/opt/backups/postgres/`, con retención de 30 días.

**Está fallando silenciosamente todos los días desde que se creó.** El archivo `/opt/docker-production/logs/backup-postgres.log` quedó con dueño `root:root` (modo 644), y el script corre como el usuario `server`. La primera línea del script escribe a ese log vía `tee`, falla por permiso denegado, y como el script usa `set -euo pipefail`, se corta ahí mismo — **nunca llega a ejecutar ningún `pg_dump`**.

Evidencia: `/opt/docker-production/logs/backup-cron.log` tiene una entrada de "Iniciando backup PostgreSQL..." + error de permiso **todos los días desde el 15 de julio hasta hoy**, sin ninguna línea de "DB '...': ..." después. Y el contenido real de `/opt/backups/postgres/` solo tiene archivos del **1 de mayo de 2026** (`globals_20260501_180252.sql.gz`, `postgres_20260501_180252.dump`) — ninguna base de datos de aplicación (`felcn_auth_v3`, `felcn_siii`, etc.) tiene un dump ahí, ni de mayo ni de ningún mes.

**Esto significa que no hay backup automatizado funcionando de ninguna base de datos de la aplicación, y probablemente nunca lo hubo funcionando de las bases de la app (solo se ven los dumps de `globals`/`postgres` del día de la instalación).** Es un hallazgo independiente de esta documentación — corregirlo (arreglar el permiso del log, o mejor, hacer que el script no dependa de escribir ese archivo específico para no fallar, y validar que corran los `pg_dump` de cada base) es la acción más urgente en este tema, más allá de terminar de escribir estos documentos.
