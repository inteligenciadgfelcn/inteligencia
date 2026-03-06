/* =========================================================
   felcn_asignacion_caso — Script de creación
   Origen: Insert S2 de ICIA-SERV-01 (insertacasosS2, CONEXASIG)

   NOTA: Los campos Dis_Id, Grp_Id, FSolicitud, FonoS, FonoA, FonoF
   NO están en esta tabla. Se guardan en felcn_siii.public.asignacion
   (Insert S3 / insertacasosS3, CONEXSIII).
   ========================================================= */

/* =========================================================
   TABLAS MAESTRAS
   ========================================================= */

CREATE TABLE departamento (
    id_departamento CHAR(2) PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE unidad (
    id_unidad CHAR(2) PRIMARY KEY,
    descripcion VARCHAR(80) NOT NULL
);

CREATE TABLE letra (
    codigo CHAR(3) PRIMARY KEY,
    es_mostrable BOOLEAN NOT NULL
);

/* =========================================================
   USUARIOS Y RELACIONES
   ========================================================= */

CREATE TABLE usuario_unidad (
    usuario_login CHAR(15) NOT NULL,
    id_departamento CHAR(2) NOT NULL,
    id_unidad CHAR(2) NOT NULL,
    CONSTRAINT pk_usuario_unidad
        PRIMARY KEY (usuario_login, id_departamento, id_unidad),
    CONSTRAINT fk_usuario_unidad_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES departamento (id_departamento),
    CONSTRAINT fk_usuario_unidad_unidad
        FOREIGN KEY (id_unidad)
        REFERENCES unidad (id_unidad)
);

CREATE TABLE usuario_icia (
    usuario_login CHAR(15) PRIMARY KEY,
    datos_generales VARCHAR(100) NOT NULL
);

/* =========================================================
   SERVICIOS
   Origen: Servicio.Insertservicio() en ICIA-SERV-00
   ========================================================= */

CREATE TABLE servicio (
    codigo_servicio VARCHAR(50) PRIMARY KEY,
    usuario_login CHAR(15) NOT NULL,
    usuario_ejecutor CHAR(15) NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    fecha_hora_salida TIMESTAMP NOT NULL
);

/* =========================================================
   ASIGNACIÓN DE CASOS (Insert S2 — insertacasosS2)
   Campos exactos del INSERT original:
     DptoAv_Id, UnidAV_Id, Letras, NroCaso, NroOperativo,
     FechaOperativo, NombreCaso, AsigCaso, CodServicio,
     FiscalAsigCaso, fechahoraing, Usuario
   ========================================================= */

CREATE TABLE asignacion (
    id_asignacion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento CHAR(2) NOT NULL,
    id_unidad CHAR(2) NOT NULL,
    codigo_letra CHAR(3) NOT NULL DEFAULT 'PD',
    numero_caso VARCHAR(20) NOT NULL DEFAULT '',
    numero_operativo VARCHAR(20) NOT NULL,
    fecha_operativo TIMESTAMP,
    nombre_caso VARCHAR(30) NOT NULL,
    asignacion_caso VARCHAR(70) NOT NULL,
    codigo_servicio VARCHAR(50) NOT NULL,
    fiscal_asignado VARCHAR(70) NOT NULL DEFAULT '*',
    fecha_hora_registro TIMESTAMP NOT NULL,
    usuario_login CHAR(15) NOT NULL,
    CONSTRAINT fk_asignacion_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES departamento (id_departamento),
    CONSTRAINT fk_asignacion_unidad
        FOREIGN KEY (id_unidad)
        REFERENCES unidad (id_unidad),
    CONSTRAINT fk_asignacion_letra
        FOREIGN KEY (codigo_letra)
        REFERENCES letra (codigo),
    CONSTRAINT fk_asignacion_servicio
        FOREIGN KEY (codigo_servicio)
        REFERENCES servicio (codigo_servicio)
);

/* =========================================================
   ÍNDICES
   ========================================================= */

CREATE INDEX idx_asignacion_departamento
    ON asignacion (id_departamento);

CREATE INDEX idx_asignacion_unidad
    ON asignacion (id_unidad);

CREATE INDEX idx_asignacion_codigo_servicio
    ON asignacion (codigo_servicio);

CREATE INDEX idx_asignacion_usuario_login
    ON asignacion (usuario_login);

CREATE INDEX idx_servicio_usuario_login
    ON servicio (usuario_login);
