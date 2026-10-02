-- public.operativo (felcn_siii): el campo "descripcion" deja de ser
-- obligatorio y deja de sincronizarse con "breve_detalle".
--
-- Hasta ahora, el formulario de /operativos/registro mandaba el mismo texto
-- de "Breve Detalle del Operativo" a los dos campos (breve_detalle Y
-- descripcion) en cada guardado -- lo que pisaba en silencio cualquier
-- edición hecha sobre "Informe del Caso/Detalle del Hecho" en Seguimientos
-- (que sí sigue escribiendo solo descripcion). A partir de ahora:
--   - breve_detalle: lo gestiona únicamente /operativos/registro.
--   - descripcion: lo gestiona únicamente Seguimientos (tab Metadatos).
--
-- Nullable porque un operativo recién creado no tiene todavía ningún
-- "Informe del Caso" cargado desde Seguimientos.
--
-- Idempotente (DROP NOT NULL no falla si la columna ya es nullable).
-- Correr a mano contra felcn_siii en cada ambiente (dev, staging) -- este
-- proyecto no tiene runner de migraciones para las bases del módulo SIII.

BEGIN;

ALTER TABLE public.operativo
  ALTER COLUMN descripcion DROP NOT NULL;

COMMIT;
