-- ============================================================
-- Script 01: Crear usuario de aplicación PostgreSQL
-- Ejecutar como: sudo -u postgres psql -f 01-crear-usuarios.sql
-- ============================================================

-- Contraseña del superusuario postgres
-- Reemplazar <POSTGRES_PASSWORD> con la contraseña real
ALTER USER postgres PASSWORD '<POSTGRES_PASSWORD>';

-- Usuario de aplicación (con permisos limitados)
-- Para producción: usar este usuario en los .env en lugar de postgres
-- Reemplazar <APP_PASSWORD> con contraseña generada: openssl rand -base64 24
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'felcn_app') THEN
    CREATE USER felcn_app WITH PASSWORD '<APP_PASSWORD>';
  END IF;
END
$$;

-- Verificar usuarios creados
SELECT usename, usesuper, usecreatedb FROM pg_user ORDER BY usename;
