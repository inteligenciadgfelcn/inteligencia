INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(38, 'Operativos', '/operativos', 'Operativos', '{"icono": "engineering", "orden": 4, "descripcion": "Operativos"}'::jsonb, NULL, 'ACTIVO', 'ACTUALIZAR', 1, '2026-05-20 10:45:44.033', 1, '2026-08-28 00:02:39.364');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(48, 'Registro y Listado', '/operativos/listado', 'Registro y Listado', '{"icono": "mobile", "orden": 1, "descripcion": "Registro y Listado de Operativos"}'::jsonb, 38, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:51:16.815', 1, '2026-08-28 00:11:05.653');



INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(43, 'Seguimientos Casos Jurídicos', '/seguimientos', 'Seguimientos Casos Jurídicos', '{"icono": "schedule", "orden": 16, "descripcion": "Seguimientos Casos Jurídicos"}'::jsonb, NULL, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:32:43.565', NULL, NULL);
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(49, 'Seguimiento', '/seguimientos/listado', 'Seguimiento', '{"icono": "table_chart", "orden": 1, "descripcion": "Seguimiento"}'::jsonb, 43, 'ACTIVO', 'CREAR', 1, '2026-05-20 21:45:43.338', NULL, NULL);




INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(50, 'Análisis de Información de Inteligencia', '/analisis', 'Análisis de Información de Inteligencia', '{"icono": "widgets", "orden": 21, "descripcion": "Análisis de Información de Inteligencia"}'::jsonb, NULL, 'ACTIVO', 'ACTUALIZAR', 1, '2026-05-24 21:45:58.113', 1, '2026-05-24 22:12:35.258');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(51, 'Casos Investigados', '/analisis/casos', 'Casos Investigados', '{"icono": "plus", "orden": 1, "descripcion": "Casos Investigados"}'::jsonb, 50, 'ACTIVO', 'ACTUALIZAR', 1, '2026-05-24 21:47:14.964', 1, '2026-05-24 22:12:47.278');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(52, 'REPORTES CASOS', '/analisis/reportes', 'REPORTES CASOS', '{"icono": "view", "orden": 2, "descripcion": "Reportes"}'::jsonb, 50, 'ACTIVO', 'CREAR', 1, '2026-05-25 23:28:56.269', 1, '2026-07-20 22:32:31.536');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(59, 'DIAGRAMA DE VÍNCULOS', '/analisis/reportes/vinculos', 'DIAGRAMA DE VÍNCULOS', '{"icono": "grid_on", "orden": 5, "descripcion": "DIAGRAMA DE VÍNCULOS"}'::jsonb, 50, 'ACTIVO', 'CREAR', 1, '2026-07-20 22:22:31.444', 1, '2026-07-20 22:32:55.790');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(57, 'FLUJO DE TRANSPORTE', '/analisis/transporte', 'FLUJO DE TRANSPORTE', '{"icono": "sticky_note_2", "orden": 3, "descripcion": "FLUJO DE TRANSPORTE"}'::jsonb, 50, 'ACTIVO', 'CREAR', 1, '2026-07-20 22:20:06.792', 1, '2026-08-28 00:11:57.649');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(58, 'REPORTE DE FLUJOS DE TRANSPORTE', '/analisis/transporte/reportes', 'REPORTE DE FLUJOS DE TRANSPORTE', '{"icono": "open_with", "orden": 4, "descripcion": "REPORTE DE FLUJOS DE TRANSPORTE"}'::jsonb, 50, 'ACTIVO', 'CREAR', 1, '2026-07-20 22:21:26.677', 1, '2026-08-28 00:12:39.485');




INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(40, 'Investigación Financiera', '/investigaciones', 'Investigación Financiera', '{"icono": "search", "orden": 15, "descripcion": "Investigación Financiera"}'::jsonb, NULL, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:24:01.416', 1, '2026-08-28 00:03:21.491');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(42, 'LGI', '/investigaciones/lgi', 'LGI', '{"icono": "drag_indicator", "orden": 2, "descripcion": "Investigacion Financiera LGI"}'::jsonb, 40, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:29:02.267', 1, '2026-08-28 00:05:49.693');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(41, 'Paralela', '/investigaciones/paralelo', 'Paralela', '{"icono": "gavel", "orden": 1, "descripcion": "Investigacion Financiera Paralelo al opertivo"}'::jsonb, 40, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:28:25.517', 1, '2026-08-28 00:04:57.449');



INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(44, 'Reportes', '/reportes', 'Reportes', '{"icono": "view_quilt", "orden": 17, "descripcion": "Reportes Casos Operativos"}'::jsonb, NULL, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:34:16.823', NULL, NULL);
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(45, 'Reportes Cruzados', '/reportes/cruzados', 'Reportes Cruzados', '{"icono": "view_module", "orden": 1, "descripcion": "Reportes Cruzados"}'::jsonb, 44, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:34:58.120', 1, '2026-08-28 00:08:22.232');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(47, 'Avanzado', '/reportes/cruzados-all', 'Reportes cruzados filtrados', '{"icono": "monitor", "orden": 3, "descripcion": "Reportes cruzados con filtros"}'::jsonb, 44, 'ACTIVO', 'ACTUALIZAR', 1, '2026-05-20 11:37:07.603', 1, '2026-08-28 00:10:26.271');
INSERT INTO usuario.modulo
(id, "label", url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion)
VALUES(46, 'Cuadros', '/reportes/cuadros', 'Cuadros', '{"icono": "storage", "orden": 2, "descripcion": "Reporte en cuadros"}'::jsonb, 44, 'ACTIVO', 'CREAR', 1, '2026-05-20 11:35:47.260', NULL, NULL);


