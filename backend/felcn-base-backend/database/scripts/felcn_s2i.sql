/* =========================================================
   TABLAS MAESTRAS
   ========================================================= */

CREATE TABLE grado (
    id_grado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    abreviatura VARCHAR(20) NOT NULL,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE rol (
    id_rol BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL,
    icono VARCHAR(35) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_creacion VARCHAR(50) NOT NULL
);

CREATE TABLE unidad (
    id_unidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    abreviatura VARCHAR(10) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    es_operativa_admin BOOLEAN NOT NULL
);

CREATE TABLE continente (
    id_continente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE contenido_caso (
    id_contenido_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);



/* =========================================================
   ESTRUCTURA TERRITORIAL
   ========================================================= */

CREATE TABLE distrital (
    id_distrital INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_unidad INTEGER NOT NULL,
    descripcion VARCHAR(80) NOT NULL,
    CONSTRAINT fk_distrital_unidad
        FOREIGN KEY (id_unidad)
        REFERENCES unidad (id_unidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE grupo (
    id_grupo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_distrital INTEGER NOT NULL,
    descripcion VARCHAR(75) NOT NULL,
    CONSTRAINT fk_grupo_distrital
        FOREIGN KEY (id_distrital)
        REFERENCES distrital (id_distrital)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


/* =========================================================
   SEGURIDAD Y USUARIOS
   ========================================================= */

CREATE TABLE usuario (
    id_usuario BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    usuario_login VARCHAR(15) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    id_grado INTEGER NOT NULL,
    nombre_app VARCHAR(200) NOT NULL,
    email VARCHAR(50) NOT NULL,
    telefono_celular VARCHAR(20) NOT NULL,
    telefono_corporativo VARCHAR(20) NOT NULL,
    id_grupo INTEGER NOT NULL,
    es_habilitado BOOLEAN NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    usuario_creacion VARCHAR(50) NOT NULL,
    fecha_ultimo_login TIMESTAMP NOT NULL,
    CONSTRAINT fk_usuario_grado
        FOREIGN KEY (id_grado)
        REFERENCES grado (id_grado),
    CONSTRAINT fk_usuario_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES grupo (id_grupo)
);

CREATE TABLE activacion_usuario (
    id_usuario BIGINT PRIMARY KEY,
    codigo_activacion UUID NOT NULL,
    CONSTRAINT fk_activacion_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id_usuario)
        ON DELETE CASCADE
);


/* =========================================================
   MENÚ Y PERMISOS
   ========================================================= */

CREATE TABLE menu (
    id_menu INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    menu_padre VARCHAR(50) NOT NULL,
    url_padre VARCHAR(50) NOT NULL,
    icono VARCHAR(35) NOT NULL,
    usuario_creacion VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL
);

CREATE TABLE menu_hijo (
    id_menu_hijo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_menu INTEGER NOT NULL,
    nombre_menu VARCHAR(50) NOT NULL,
    url VARCHAR(50) NOT NULL,
    icono VARCHAR(35),
    usuario_creacion VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL,
    CONSTRAINT fk_menu_hijo_menu
        FOREIGN KEY (id_menu)
        REFERENCES menu (id_menu)
        ON DELETE CASCADE
);

CREATE TABLE formulario (
    id_formulario BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_rol BIGINT NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    url VARCHAR(50) NOT NULL,
    CONSTRAINT fk_formulario_rol
        FOREIGN KEY (id_rol)
        REFERENCES rol (id_rol)
);


/* =========================================================
   AUDITORÍA
   ========================================================= */

CREATE TABLE auditoria_cambio (
    id_auditoria BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    base_datos VARCHAR(25) NOT NULL,
    tabla_afectada VARCHAR(25) NOT NULL,
    accion VARCHAR(25) NOT NULL,
    contenido_anterior TEXT NOT NULL,
    contenido_actual TEXT NOT NULL,
    contenido_encriptado TEXT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL
);


/* =========================================================
   FUNCIONES
   ========================================================= */

CREATE OR REPLACE FUNCTION fn_validar_usuario(
    p_nombre_usuario VARCHAR,
    p_contrasena VARCHAR
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_id_usuario BIGINT;
BEGIN
    SELECT id_usuario
    INTO v_id_usuario
    FROM usuario
    WHERE nombre_usuario = p_nombre_usuario
      AND contrasena = p_contrasena;

    IF v_id_usuario IS NULL THEN
        RETURN -1; -- usuario inválido
    END IF;

    IF EXISTS (
        SELECT 1
        FROM activacion_usuario
        WHERE id_usuario = v_id_usuario
    ) THEN
        RETURN -2; -- usuario no activado
    END IF;

    UPDATE usuario
    SET fecha_ultimo_login = now()
    WHERE id_usuario = v_id_usuario;

    RETURN v_id_usuario;
END;
$$;


/* =========================================================
   INDICES PROPUESTOS
   ========================================================= */

CREATE INDEX idx_usuario_nombre_usuario ON usuario (nombre_usuario);
CREATE INDEX idx_usuario_id_grupo ON usuario (id_grupo);
CREATE INDEX idx_formulario_id_rol ON formulario (id_rol);
CREATE INDEX idx_menu_hijo_id_menu ON menu_hijo (id_menu);

