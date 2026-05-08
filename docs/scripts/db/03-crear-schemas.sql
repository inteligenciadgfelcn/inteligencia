-- ============================================================
-- Script 03: Crear schemas en felcn_auth_v3
-- Ejecutar como: sudo -u postgres psql -d felcn_auth_v3 -f 03-crear-schemas.sql
-- ============================================================

-- Schemas requeridos por felcn-base-backend-v2
CREATE SCHEMA IF NOT EXISTS usuarios;
CREATE SCHEMA IF NOT EXISTS parametricas;

-- Schemas requeridos por felcn-auth-backend
CREATE SCHEMA IF NOT EXISTS proyecto;
CREATE SCHEMA IF NOT EXISTS usuario;
CREATE SCHEMA IF NOT EXISTS parametro;
CREATE SCHEMA IF NOT EXISTS felcn_estructura;

-- Permisos para el usuario de aplicación (si se usa felcn_app en lugar de postgres)
-- Descomentar en producción:
-- GRANT USAGE ON SCHEMA usuarios TO felcn_app;
-- GRANT USAGE ON SCHEMA parametricas TO felcn_app;
-- GRANT USAGE ON SCHEMA proyecto TO felcn_app;
-- GRANT USAGE ON SCHEMA usuario TO felcn_app;
-- GRANT USAGE ON SCHEMA parametro TO felcn_app;
-- GRANT USAGE ON SCHEMA felcn_estructura TO felcn_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA usuarios TO felcn_app;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA parametricas TO felcn_app;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA usuarios TO felcn_app;

-- Verificar schemas creados
\dn
