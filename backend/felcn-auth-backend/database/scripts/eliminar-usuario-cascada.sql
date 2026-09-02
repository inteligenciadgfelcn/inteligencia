-- Elimina un usuario y TODO lo que depende de él, en el orden correcto según
-- las foreign keys reales de felcn_auth (confirmadas contra information_schema
-- el 02/09/2026, no copiadas de memoria):
--   recurso_excepcion -> usuario_rol -> usuario -> persona
-- Más 3 tablas sin FK real pero igual ligadas al usuario (bitacora_login,
-- refresh_token, solicitud_registro) — se limpian para que las pruebas
-- repetidas con el mismo carnet/correo no choquen con datos viejos.
--
-- Uso (parámetro :'usuario' = columna usuario.usuario, normalmente el carnet):
--   docker compose exec -e PGOPTIONS='' postgres \
--     psql -U postgres -d felcn_auth -v usuario="5808569" \
--     -f /ruta/a/eliminar-usuario-cascada.sql
-- O más simple, con el wrapper: bash eliminar-usuario-cascada.sh 5808569

\set ON_ERROR_STOP on
\if :{?usuario}
\else
  \echo 'ERROR: falta el parámetro -v usuario=<carnet>'
  \quit 1
\endif

BEGIN;

\echo '--- Usuario a eliminar ---'
SELECT id, usuario, correo_electronico, _estado
FROM usuario.usuario WHERE usuario = :'usuario';

-- 1. recurso_excepcion (hijo de usuario_rol, ver ADR-0001 RBAC por usuario)
DELETE FROM usuario.recurso_excepcion
WHERE id_usuario_rol IN (
  SELECT ur.id FROM usuario.usuario_rol ur
  JOIN usuario.usuario u ON u.id = ur.id_usuario
  WHERE u.usuario = :'usuario'
);

-- 2. usuario_rol
DELETE FROM usuario.usuario_rol
WHERE id_usuario = (SELECT id FROM usuario.usuario WHERE usuario = :'usuario');

-- 3. historial_contrasena
DELETE FROM usuario.historial_contrasena
WHERE id_usuario = (SELECT id FROM usuario.usuario WHERE usuario = :'usuario');

-- 4. otp_sesion
DELETE FROM usuario.otp_sesion
WHERE id_usuario = (SELECT id FROM usuario.usuario WHERE usuario = :'usuario');

-- 5. bitacora_login — log de auditoría, sin FK real (id_usuario nullable),
-- se limpia igual porque es un usuario de prueba, no un caso real a auditar.
DELETE FROM usuario.bitacora_login WHERE usuario = :'usuario';

-- 6. refresh_token — sin FK real, grant_id guarda el id de usuario como texto.
DELETE FROM usuario.refresh_token
WHERE grant_id = (SELECT id::text FROM usuario.usuario WHERE usuario = :'usuario');

-- 7. solicitud_registro — por si el usuario nació de una solicitud de
-- preregistro, o quedó una solicitud pendiente con el mismo carnet (el
-- índice único de "documento pendiente" bloquearía una prueba nueva si no
-- se limpia esto).
DELETE FROM usuario.solicitud_registro WHERE nro_documento = :'usuario';

-- 8. usuario, y su persona asociada (guardamos id_persona antes de borrar)
WITH borrado AS (
  DELETE FROM usuario.usuario WHERE usuario = :'usuario' RETURNING id_persona
)
DELETE FROM usuario.persona WHERE id IN (SELECT id_persona FROM borrado);

COMMIT;

\echo '--- Listo. Confirmando que ya no existe ---'
SELECT count(*) AS deberia_ser_cero
FROM usuario.usuario WHERE usuario = :'usuario';
