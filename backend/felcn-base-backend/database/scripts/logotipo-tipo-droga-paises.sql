-- public.logotipo (felcn_siii) no registra a qué tipo de droga corresponde
-- el logo detectado ni los países de origen/destino de la organización.
-- Se agregan como catálogo (igual patrón que public.droga: tipo_droga y
-- pais para procedencia/destino) para poder filtrar/reportar por esos ejes.
--
-- Nullable a nivel de BD: ya existen logotipos registrados (ver
-- logotipo-relacion-operativo.sql) sin esta información y no hay forma de
-- derivarla de los datos actuales, así que no se puede exigir NOT NULL sin
-- romper esas filas. La obligatoriedad para logotipos NUEVOS se valida en
-- el backend (CreateLogotipoDto) y el formulario del tab "Logotipos".
--
-- Idempotente (columnas/constraints con IF NOT EXISTS).
-- Correr a mano contra felcn_siii en dev, staging y producción — este
-- proyecto no tiene runner de migraciones para las bases del módulo SIII,
-- los cambios de schema se aplican así (ver database/scripts/README.md y
-- el precedente en logotipo-relacion-operativo.sql).

BEGIN;

ALTER TABLE public.logotipo
  ADD COLUMN IF NOT EXISTS id_tipo_droga INTEGER,
  ADD COLUMN IF NOT EXISTS id_pais_origen INTEGER,
  ADD COLUMN IF NOT EXISTS id_pais_destino INTEGER;

ALTER TABLE public.logotipo
  DROP CONSTRAINT IF EXISTS fk_logotipo_tipo_droga;
ALTER TABLE public.logotipo
  ADD CONSTRAINT fk_logotipo_tipo_droga
    FOREIGN KEY (id_tipo_droga) REFERENCES parametricas.tipo_droga (id_tipo_droga);

ALTER TABLE public.logotipo
  DROP CONSTRAINT IF EXISTS fk_logotipo_pais_origen;
ALTER TABLE public.logotipo
  ADD CONSTRAINT fk_logotipo_pais_origen
    FOREIGN KEY (id_pais_origen) REFERENCES parametricas.pais (id_pais);

ALTER TABLE public.logotipo
  DROP CONSTRAINT IF EXISTS fk_logotipo_pais_destino;
ALTER TABLE public.logotipo
  ADD CONSTRAINT fk_logotipo_pais_destino
    FOREIGN KEY (id_pais_destino) REFERENCES parametricas.pais (id_pais);

COMMIT;
