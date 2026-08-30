#!/bin/bash

# Reemplaza a 01-crear-bases.sql (30/08/2026): pasa a script porque necesita
# tomar la contraseña del rol de aplicación de una variable de entorno — un
# .sql estático no puede. Sigue corriendo automáticamente al primer arranque
# del contenedor (docker-entrypoint-initdb.d ejecuta .sh igual que .sql).
#
# Crea las 9 bases reales, vacías, propiedad del rol `postgres` (superusuario
# — sigue siendo el único que corre migraciones, `ALTER`/`DROP`/`CREATE TABLE`).
# Además crea `felcn_app`, un rol de aplicación SIN privilegios de superusuario
# que es el que usan los contenedores de las apps día a día (`DB_USERNAME` en
# el compose, ver docker-compose.prod.yml) — separación deliberada: DDL con
# `postgres`, DML (SELECT/INSERT/UPDATE/DELETE) con `felcn_app`.
#
# Solo `felcn_auth` recibe schemas + permisos armados acá — las otras 8 bases
# van por backup+restore manual (ver docs/13-migracion-y-restauracion-bd.md);
# si esas bases también van a usar `felcn_app`, el restore tiene que otorgarle
# los mismos permisos después de restaurar (pendiente, no resuelto acá).

set -e -o errtrace

: "${DB_APP_PASSWORD:?DB_APP_PASSWORD no está seteada — hace falta para crear el rol felcn_app}"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
  CREATE DATABASE felcn_auth              ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE felcn_siii              ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE a_felcn_lgi              ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE felcn_s2i               ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE a_felcn_asignacion_caso ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE a_felcn_sii             ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE a_felcn_sospechoso      ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE felcn_personas          ENCODING 'UTF8' OWNER postgres;
  CREATE DATABASE felcn_vls               ENCODING 'UTF8' OWNER postgres;

  ALTER ROLE postgres SET TIMEZONE TO 'America/La_Paz';

  CREATE ROLE felcn_app LOGIN PASSWORD '$DB_APP_PASSWORD';
EOSQL

# Schemas + permisos de felcn_app — solo en felcn_auth (la única base que este
# trabajo migra/siembra de punta a punta hoy).
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname felcn_auth <<-EOSQL
  CREATE SCHEMA proyecto;
  CREATE SCHEMA usuario;
  CREATE SCHEMA parametro;
  CREATE SCHEMA felcn_estructura;

  GRANT CONNECT ON DATABASE felcn_auth TO felcn_app;
  GRANT USAGE ON SCHEMA proyecto, usuario, parametro, felcn_estructura TO felcn_app;

  -- "FOR ROLE postgres": las migraciones siguen corriendo como postgres: cada
  -- tabla NUEVA que una migración futura cree hereda automáticamente estos
  -- permisos para felcn_app, sin tener que acordarse de otorgarlos a mano.
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA proyecto
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA usuario
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA parametro
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA felcn_estructura
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO felcn_app;

  -- Necesario para nextval() en columnas BIGSERIAL/SERIAL de esas tablas.
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA proyecto
    GRANT USAGE, SELECT ON SEQUENCES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA usuario
    GRANT USAGE, SELECT ON SEQUENCES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA parametro
    GRANT USAGE, SELECT ON SEQUENCES TO felcn_app;
  ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA felcn_estructura
    GRANT USAGE, SELECT ON SEQUENCES TO felcn_app;
EOSQL
