-- public.logotipo (felcn_siii): los campos "Organización Criminal", "Posibles
-- Blancos" y "Observación" dejan de ser obligatorios -- se detectó que en
-- muchos operativos esta información simplemente no se conoce al momento de
-- registrar el logotipo, y obligarla generaba datos basura solo para pasar
-- la validación. La fotografía SÍ sigue siendo obligatoria (ya lo era,
-- no cambia).
--
-- Idempotente (DROP NOT NULL no falla si la columna ya es nullable).
-- Correr a mano contra felcn_siii en cada ambiente (dev, staging) -- este
-- proyecto no tiene runner de migraciones para las bases del módulo SIII,
-- ver el precedente en logotipo-relacion-operativo.sql.

BEGIN;

ALTER TABLE public.logotipo
  ALTER COLUMN organizacion DROP NOT NULL;

ALTER TABLE public.logotipo
  ALTER COLUMN blanco DROP NOT NULL;

ALTER TABLE public.logotipo
  ALTER COLUMN observacion DROP NOT NULL;

COMMIT;
