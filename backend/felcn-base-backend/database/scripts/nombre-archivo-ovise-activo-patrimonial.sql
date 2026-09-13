-- public.ovise y public.activo_patrimonial (felcn_s2i) guardan el archivo
-- adjunto en bytea pero nunca guardaron el nombre original (con extensión)
-- — el endpoint de descarga solo devolvía Content-Type: application/octet-
-- stream sin Content-Disposition, así que el navegador descargaba el
-- archivo sin extensión (bug real reportado en los tabs "Activo
-- Patrimonial" y "OVISE" de /analisis/casos/:id/). El resto de los módulos
-- con archivo adjunto (archivos-blanco, bienes, organización, seguimiento
-- de casos) ya guardan nombre_archivo — esto alinea a estas dos tablas con
-- ese mismo patrón.
--
-- Correr a mano contra felcn_s2i en cada ambiente (dev, staging) — este
-- proyecto no tiene runner de migraciones para las bases secundarias
-- (DB_S2I_*, ver database/scripts/README.md), los cambios de schema se
-- aplican así, igual que homologacion-unidad-siii.sql.

BEGIN;

ALTER TABLE public.ovise
  ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(150) NULL;
COMMENT ON COLUMN public.ovise.nombre_archivo IS
  'Nombre original del archivo adjunto (con extensión) — vacío en registros anteriores a este script';

ALTER TABLE public.activo_patrimonial
  ADD COLUMN IF NOT EXISTS nombre_archivo VARCHAR(150) NULL;
COMMENT ON COLUMN public.activo_patrimonial.nombre_archivo IS
  'Nombre original del archivo adjunto (con extensión) — vacío en registros anteriores a este script';

COMMIT;
