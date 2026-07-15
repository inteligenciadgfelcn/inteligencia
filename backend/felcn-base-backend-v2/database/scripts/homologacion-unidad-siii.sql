-- Homologación de felcn_siii.public.unidad contra la tabla maestra
-- felcn_auth_v3.parametro.unidad. A la réplica de SIII le faltaban 10
-- unidades administrativas/nacionales (incluida DNI), lo que hacía fallar
-- con "viola la llave foránea fk_asignacion_unidad" cualquier asignación
-- de un usuario perteneciente a esas unidades.
-- Aplicado en producción el 2026-07-15.

BEGIN;

-- abreviatura/abreviatura_icia eran varchar(2)/varchar(3) — insuficiente
-- para códigos como 'DG-FELCN', 'DNCITESC' (8 caracteres).
ALTER TABLE unidad ALTER COLUMN abreviatura TYPE varchar(20);
ALTER TABLE unidad ALTER COLUMN abreviatura_icia TYPE varchar(20);
ALTER TABLE unidad ALTER COLUMN descripcion TYPE varchar(150);

-- Homologar nomenclatura de las 9 direcciones departamentales con la maestra
-- ("Jefatura Departamental X" → "Dirección Departamental X").
UPDATE unidad SET descripcion = 'Dirección Departamental La Paz' WHERE abreviatura = 'JLP';
UPDATE unidad SET descripcion = 'Dirección Departamental Oruro' WHERE abreviatura = 'JOR';
UPDATE unidad SET descripcion = 'Dirección Departamental Potosi' WHERE abreviatura = 'JPT';
UPDATE unidad SET descripcion = 'Dirección Departamental Cochabamba' WHERE abreviatura = 'JCB';
UPDATE unidad SET descripcion = 'Dirección Departamental Santa Cruz' WHERE abreviatura = 'JSC';
UPDATE unidad SET descripcion = 'Dirección Departamental Tarija' WHERE abreviatura = 'JTJ';
UPDATE unidad SET descripcion = 'Dirección Departamental Chuquisaca' WHERE abreviatura = 'JCH';
UPDATE unidad SET descripcion = 'Dirección Departamental Beni' WHERE abreviatura = 'JBN';
UPDATE unidad SET descripcion = 'Dirección Departamental Pando' WHERE abreviatura = 'JPN';

-- Unidades administrativas/nacionales faltantes (existen en auth_v3.parametro.unidad,
-- no existían en felcn_siii.unidad). abreviatura_icia no tiene equivalente en la
-- maestra: se usa la misma abreviatura completa ahora que la columna ya no está
-- limitada a 2 caracteres.
INSERT INTO unidad (abreviatura, descripcion, abreviatura_icia, es_operativa_admin, abreviatura_reporte)
SELECT nueva.abreviatura, nueva.descripcion, nueva.abreviatura_icia, nueva.es_operativa_admin, nueva.abreviatura_reporte
FROM (VALUES
  ('DG-FELCN', 'Dirección General de la Fuerza Especial de Lucha Contra el Narcotráfico', 'DG-FELCN', false, 'DG-FELCN'),
  ('INSPEC', 'Inspectoría General', 'INSPEC', false, 'INSPEC'),
  ('AJ', 'Asesoría Jurídica', 'AJ', false, 'AJ'),
  ('SDEM', 'Sub Dirección y Jefatura de Estado Mayor', 'SDEM', false, 'SDEM'),
  ('DNP', 'Departamento Nacional de Personal', 'DNP', false, 'DNP'),
  ('DNI', 'Departamento Nacional de Inteligencia', 'DNI', false, 'DNI'),
  ('DNPO', 'Departamento Nacional de Planeamiento y Operaciones', 'DNPO', false, 'DNPO'),
  ('DNA', 'Departamento Nacional Administrativo', 'DNA', false, 'DNA'),
  ('DNCSRI', 'Departamento Nacional de Comunicación Social y Relaciones Internacionales', 'DNCSRI', false, 'DNCSRI'),
  ('DNCITESC', 'Departamento Nacional del Centro de Investigación Técnico Científico en Toxicología Y Sustancias Controladas', 'DNCITESC', false, 'DNCITESC')
) AS nueva(abreviatura, descripcion, abreviatura_icia, es_operativa_admin, abreviatura_reporte)
WHERE NOT EXISTS (
  SELECT 1 FROM unidad u WHERE u.abreviatura = nueva.abreviatura
);

COMMIT;
