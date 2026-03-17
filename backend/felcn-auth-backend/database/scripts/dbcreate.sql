-- eliminamos la base actual (si existe)
DROP DATABASE IF EXISTS felcn_auth;

-- creamos la nueva base
CREATE DATABASE felcn_auth ENCODING 'UTF-8';

-- configuramos la zona horaria (solo es necesario si utilizamos docker)
ALTER ROLE postgres SET TIMEZONE TO 'America/La_Paz';

-- nos conectamos a la nueva base
\c felcn_auth;

-- creamos los esquemas correspondientes
CREATE SCHEMA proyecto;
CREATE SCHEMA usuario;
CREATE SCHEMA parametro;
CREATE SCHEMA felcn_estructura;
