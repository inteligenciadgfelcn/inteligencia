-- ============================================================================
-- Migración: persona_auxiliar -> detenido_auxiliar, filtrando por número de caso
-- Base de datos: felcn_siii (schema public)
--
-- Uso:
--   psql -h $DB_SIII_HOST -p $DB_SIII_PORT -U $DB_SIII_USERNAME -d $DB_SIII_DATABASE \
--        -v numero_caso='LP-ARR-1/26' \
--        -f database/scripts/migrar-persona-a-detenido-auxiliar.sql
--
-- Qué hace:
--   1) PASO 1 (solo lectura): muestra los registros de persona_auxiliar que
--      coinciden con :numero_caso (vía persona_auxiliar -> operativo -> asignacion),
--      para revisar ANTES de escribir nada.
--   2) PASO 2 (escritura, dentro de una transacción): inserta en detenido_auxiliar
--      los registros que aún no existan ahí (mismo id_operativo + nombres +
--      apellidos), y muestra lo insertado con RETURNING.
--
-- Reglas de mapeo acordadas:
--   - id_estado_civil: 8 ("Desconocido" en parametricas.estado_civil), no existe
--     en persona_auxiliar.
--   - serie / seccion: sin equivalente en persona_auxiliar -> se dejan ''.
--   - observaciones: se arma con el detalle de documento (nro_documento +
--     tipo_documento) y el "estado" original de persona_auxiliar, para no
--     perder esos datos que detenido_auxiliar no tiene como columnas propias.
--   - observaciones_adicionales: '' (sin dato de origen).
--   - es_actual = true, es_revision_icia = false, tiene_tarjeta = false,
--     esta_vivo = true (valores por defecto razonables para un registro recién
--     migrado).
--   - fecha_hora_ingreso: se conserva la original de persona_auxiliar.
--   - fecha_hora_actualizacion: now() (momento de esta migración).
--   - usuario / usuario_actualizacion: se copia pa.usuario.
--   - foto_perfil_derecho: sin equivalente en persona_auxiliar -> NULL.
--   - Idempotencia: si ya existe en detenido_auxiliar un registro con el mismo
--     id_operativo + nombres + apellido_paterno + apellido_materno, se omite
--     (no se duplica) aunque el script se corra varias veces.
-- ============================================================================

\set ON_ERROR_STOP on

\if :{?numero_caso}
\else
  \echo 'ERROR: falta el parámetro. Ejecuta con: -v numero_caso=''NUMERO_DE_CASO'''
  \quit
\endif

-- ----------------------------------------------------------------------------
-- PASO 1: Vista previa (solo lectura) — revisa esto antes de confiar en el PASO 2
-- ----------------------------------------------------------------------------
SELECT
  pa.id_persona_auxiliar,
  pa.id_operativo,
  a.numero_caso,
  pa.nombres,
  pa.apellido_paterno,
  pa.apellido_materno,
  pa.nro_documento,
  pa.estado,
  EXISTS (
    SELECT 1 FROM detenido_auxiliar da
    WHERE da.id_operativo = pa.id_operativo
      AND da.nombres = pa.nombres
      AND da.apellido_paterno = pa.apellido_paterno
      AND da.apellido_materno = pa.apellido_materno
  ) AS ya_migrado
FROM persona_auxiliar pa
JOIN operativo  o ON o.id_operativo = pa.id_operativo
JOIN asignacion a ON a.id_caso = o.id_caso
WHERE TRIM(a.numero_caso) = TRIM(:'numero_caso')
ORDER BY pa.id_persona_auxiliar;

-- ----------------------------------------------------------------------------
-- PASO 2: Migración real (dentro de una transacción)
-- ----------------------------------------------------------------------------
BEGIN;

INSERT INTO detenido_auxiliar (
  id_operativo, numero_caso, nombres, apellido_paterno, apellido_materno, apellido_esposo,
  id_pais, genero, fecha_nacimiento, id_estado_civil, serie, seccion,
  foto_frente, foto_perfil_derecho, foto_perfil_izquierdo, direccion,
  observaciones, es_actual, es_revision_icia, tiene_tarjeta, esta_vivo,
  observaciones_adicionales, fecha_hora_ingreso, usuario,
  fecha_hora_actualizacion, usuario_actualizacion
)
SELECT
  pa.id_operativo,
  TRIM(a.numero_caso),
  pa.nombres,
  pa.apellido_paterno,
  pa.apellido_materno,
  pa.apellido_esposo,
  pa.id_pais,
  (pa.genero = B'1'),                     -- bit(1) -> boolean
  pa.fecha_nacimiento,
  8,                                       -- id_estado_civil = 'Desconocido'
  '',                                      -- serie: sin origen
  '',                                      -- seccion: sin origen
  pa.foto_frente,
  NULL,                                    -- foto_perfil_derecho: sin origen
  pa.foto_perfil_izquierdo,
  pa.direccion,
  'Migrado desde persona_auxiliar (id_persona_auxiliar=' || pa.id_persona_auxiliar::text || '). '
    || 'Documento: ' || COALESCE(td.descripcion, 'tipo ' || pa.id_tipo_documento::text)
    || ' ' || pa.nro_documento || '. '
    || 'Estado original en persona_auxiliar: ' || pa.estado,
  true,                                    -- es_actual
  false,                                   -- es_revision_icia
  false,                                   -- tiene_tarjeta
  true,                                    -- esta_vivo
  '',                                      -- observaciones_adicionales
  pa.fecha_hora_ingreso,
  pa.usuario,
  now(),
  pa.usuario
FROM persona_auxiliar pa
JOIN operativo  o ON o.id_operativo = pa.id_operativo
JOIN asignacion a ON a.id_caso = o.id_caso
LEFT JOIN parametricas.tipo_documento td ON td.id_tipo_documento = pa.id_tipo_documento
WHERE TRIM(a.numero_caso) = TRIM(:'numero_caso')
  AND NOT EXISTS (
    SELECT 1 FROM detenido_auxiliar da
    WHERE da.id_operativo = pa.id_operativo
      AND da.nombres = pa.nombres
      AND da.apellido_paterno = pa.apellido_paterno
      AND da.apellido_materno = pa.apellido_materno
  )
RETURNING id_detenido_auxiliar, id_operativo, numero_caso, nombres, apellido_paterno, apellido_materno;

COMMIT;
