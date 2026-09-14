-- public.logotipo (felcn_siii) colgaba de droga (id_droga), lo que obligaba
-- a registrar el logotipo dentro de una droga puntual del operativo. El tab
-- "Logotipo" de /operativos/registro pasa a ser una sección independiente
-- del operativo (ya no anidada bajo "Drogas"), igual que Bienes o Galería
-- — este script re-vincula la tabla: id_droga -> id_operativo.
--
-- Backfill: cada logotipo hereda el id_operativo de su droga actual
-- (droga.id_operativo), relación 1:1 sin ambigüedad para las filas
-- existentes.
--
-- Idempotente (columnas/constraints con IF EXISTS / IF NOT EXISTS).
-- Correr a mano contra felcn_siii en staging y producción — este proyecto
-- no tiene runner de migraciones para las bases del módulo SIII, los
-- cambios de schema se aplican así (ver database/scripts/README.md y el
-- precedente en nombre-archivo-ovise-activo-patrimonial.sql). En dev ya
-- se aplicó.

BEGIN;

ALTER TABLE public.logotipo
  ADD COLUMN IF NOT EXISTS id_operativo BIGINT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'logotipo' AND column_name = 'id_droga'
  ) THEN
    UPDATE public.logotipo l
    SET id_operativo = d.id_operativo
    FROM public.droga d
    WHERE d.id_droga = l.id_droga
      AND l.id_operativo IS NULL;
  END IF;
END $$;

ALTER TABLE public.logotipo
  ALTER COLUMN id_operativo SET NOT NULL;

ALTER TABLE public.logotipo
  DROP CONSTRAINT IF EXISTS fk_logotipo_operativo;
ALTER TABLE public.logotipo
  ADD CONSTRAINT fk_logotipo_operativo
    FOREIGN KEY (id_operativo) REFERENCES public.operativo (id_operativo);

ALTER TABLE public.logotipo
  DROP CONSTRAINT IF EXISTS fk_logotipo_droga;
ALTER TABLE public.logotipo
  DROP COLUMN IF EXISTS id_droga;

COMMIT;
