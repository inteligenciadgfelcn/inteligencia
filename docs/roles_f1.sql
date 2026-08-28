INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(136, 'p', 'INVESTIGADOR', '/analisis/casos', 'create|read|update|delete', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(137, 'p', 'INVESTIGADOR', '/analisis/reportes', 'read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(141, 'p', 'INVESTIGADOR', '/analisis/transporte', 'create|read|delete|update', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(142, 'p', 'INVESTIGADOR', '/analisis/transporte/reportes', 'read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(144, 'p', 'INVESTIGADOR', '/analisis/reportes/vinculos', 'read', 'frontend', NULL, NULL, NULL);




INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(119, 'p', 'OPERATIVO', '/api/operativos/casos/unidad/:abreviaturaUnidad', 'GET', 'backend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(122, 'p', 'OPERATIVO', '/operativos/listado', 'create|read|update|delete', 'frontend', NULL, NULL, NULL);


INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(124, 'p', 'SEGUIMIENTO_JURIDICO', '/seguimientos/listado', 'create|read|update|delete', 'frontend', NULL, NULL, NULL);

INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(129, 'p', 'SEGUIMIENTO_CASOS', '/reportes/cuadros', 'read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(130, 'p', 'SEGUIMIENTO_CASOS', '/reportes/cruzados', 'read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(131, 'p', 'SEGUIMIENTO_CASOS', '/reportes/cruzados-all', 'read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(147, 'p', 'SEGUIMIENTO_CASOS', 'user-profile.jpeg', 'read|update', 'frontend', NULL, NULL, NULL);


INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(120, 'p', 'INVESTIGADOR_FINANCIERO', '/api/casos-paralelos', 'POST', 'backend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(121, 'p', 'INVESTIGADOR_FINANCIERO', '/api/casos-paralelos/buscar-por-unidad-resultado', 'POST', 'backend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(126, 'p', 'INVESTIGADOR_FINANCIERO', '/investigaciones/paralelo', 'create|read', 'frontend', NULL, NULL, NULL);
INSERT INTO usuario.casbin_rule
(id, ptype, v0, v1, v2, v3, v4, v5, v6)
VALUES(127, 'p', 'INVESTIGADOR_FINANCIERO', '/investigaciones/lgi', 'read', 'frontend', NULL, NULL, NULL);