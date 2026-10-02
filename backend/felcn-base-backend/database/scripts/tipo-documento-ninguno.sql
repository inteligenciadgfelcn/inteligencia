-- parametricas.tipo_documento (felcn_siii): agrega la opción "NINGUNO" al
-- catálogo. id_tipo_documento no tiene secuencia/default (los 11 valores
-- existentes se insertaron a mano con ID explícito) -- se sigue el mismo
-- patrón, usando el próximo ID libre (12).
--
-- Idempotente (no inserta si ya existe un id_tipo_documento = 12, o una
-- fila con descripcion = 'NINGUNO').
-- Correr a mano contra felcn_siii en cada ambiente (dev, staging).

BEGIN;

INSERT INTO parametricas.tipo_documento
  (id_tipo_documento, descripcion, _estado, _transaccion, _usuario_creacion)
SELECT 12, 'NINGUNO', 'ACTIVO', 'SEEDS', 'postgres'
WHERE NOT EXISTS (
  SELECT 1 FROM parametricas.tipo_documento
  WHERE id_tipo_documento = 12 OR descripcion = 'NINGUNO'
);

COMMIT;
