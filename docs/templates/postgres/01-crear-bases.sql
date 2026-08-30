-- Crea las bases de datos reales del proyecto, vacías, propiedad del rol `postgres`
-- (mismo rol que usan hoy los backends via DB_USERNAME=postgres, ver docs/04-variables-de-entorno.md).
-- No crea schemas ni tablas: eso lo pone el `pg_restore`/`psql` de un dump real al
-- restaurar (dev/staging van por backup+restore manual, ver docs/13-migracion-y-restauracion-bd.md).
--
-- Nombre corregido: `felcn_auth` (oficial) en vez de `felcn_auth_v3` (nombre de trabajo
-- de dev/servertest) — confirmado por el usuario el 29/08/2026, ver memoria de proyecto.
-- Las otras 8 bases mantienen su nombre real tal cual están hoy en producción/dev.

CREATE DATABASE felcn_auth        ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE felcn_siii        ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE a_felcn_lgi       ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE felcn_s2i         ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE a_felcn_asignacion_caso ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE a_felcn_sii       ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE a_felcn_sospechoso ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE felcn_personas    ENCODING 'UTF8' OWNER postgres;
CREATE DATABASE felcn_vls         ENCODING 'UTF8' OWNER postgres;

ALTER ROLE postgres SET TIMEZONE TO 'America/La_Paz';
