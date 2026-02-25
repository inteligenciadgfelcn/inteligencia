/* =========================================================
   BASE DE DATOS: FELCN-SIII
   CONVERSIÓN A POSTGRESQL 16 - CON ESQUEMAS
   Fecha: 2025-12-13
   ========================================================= */

-- Crear el esquema para las paramétricas
CREATE SCHEMA IF NOT EXISTS parametricas;

/* =========================================================
   TABLAS DE CATÁLOGOS Y DESCRIPCIONES (ESQUEMA PARAMETRICAS)
   ========================================================= */

CREATE TABLE parametricas.sustancia_solida_descripcion (
    id_sustancia_solida_descripcion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.sustancia_liquida_descripcion (
    id_sustancia_liquida_descripcion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.situacion_legal (
    id_situacion_legal INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE parametricas.continente (
    id_continente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.contenido_caso (
    id_contenido_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE parametricas.contenido_bien (
    id_contenido_bien BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE parametricas.color_piel (
    id_color_piel INTEGER PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL
);

CREATE TABLE parametricas.color_ojos (
    id_color_ojos INTEGER PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.color_cabello (
    id_color_cabello INTEGER PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL
);

CREATE TABLE parametricas.tipo_cabellos (
    id_tipo_cabello INTEGER PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.coca_procedencia (
    id_coca_procedencia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(75) NOT NULL
);

CREATE TABLE parametricas.coca_estado (
    id_coca_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(75) NOT NULL
);

CREATE TABLE parametricas.coca_descripcion (
    id_coca_descripcion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.categoria_operativo (
    id_categoria_operativo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.bienes (
    id_bien INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.calidad_bien (
    id_calidad_bien INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.estado_civil (
    id_estado_civil INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(25) NOT NULL
);

CREATE TABLE parametricas.etapa_investigacion (
    id_etapa_investigacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.etapa (
    id_etapa INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(15) NOT NULL
);

CREATE TABLE parametricas.forma_transporte (
    id_forma_transporte INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.tipo_droga (
    id_tipo_droga INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL,
    lista VARCHAR(3) NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    es_medicamento BOOLEAN,
    es_ds BOOLEAN
);

CREATE TABLE parametricas.tipo_relevancia (
    id_tipo_relevancia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.tipo_persona (
    id_tipo_persona INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.tipo_penal (
    id_tipo_penal INTEGER PRIMARY KEY,
    descripcion VARCHAR(75) NOT NULL
);

CREATE TABLE parametricas.tipo_operacion (
    id_tipo_operacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL
);

CREATE TABLE parametricas.tipo_implicado (
    id_tipo_implicado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(75) NOT NULL
);

CREATE TABLE parametricas.tipo_fabrica (
    id_tipo_fabrica INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(35) NOT NULL
);

CREATE TABLE parametricas.tipo_documento (
    id_tipo_documento INTEGER PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.tipo_denuncia (
    id_tipo_denuncia INTEGER PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL
);

CREATE TABLE parametricas.tamanio_documento (
    id_tamanio_documento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL,
    ancho INTEGER NOT NULL,
    alto INTEGER NOT NULL
);

CREATE TABLE parametricas.plan_operaciones (
    id_plan_operacion INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    gestion VARCHAR(4) NOT NULL
);

CREATE TABLE parametricas.recurso (
    id_recurso INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    descripcion VARCHAR(20) NOT NULL
);

CREATE TABLE parametricas.grado (
    id_grado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    abreviatura VARCHAR(20) NOT NULL,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE parametricas.letra (
    letras VARCHAR(3) PRIMARY KEY
);


/* =========================================================
   GEOGRAFÍA (ESQUEMA PARAMETRICAS)
   ========================================================= */

CREATE TABLE parametricas.pais (
    id_pais INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_continente INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_pais_continente
        FOREIGN KEY (id_continente)
        REFERENCES parametricas.continente (id_continente)
);

CREATE TABLE parametricas.pais_destino (
    id_pais_destino INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_continente INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_pais_destino_continente
        FOREIGN KEY (id_continente)
        REFERENCES parametricas.continente (id_continente)
);

CREATE TABLE parametricas.departamento (
    id_departamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_pais INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_departamento_pais
        FOREIGN KEY (id_pais)
        REFERENCES parametricas.pais (id_pais)
);

CREATE TABLE parametricas.provincia (
    id_provincia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_provincia_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES parametricas.departamento (id_departamento)
);

CREATE TABLE parametricas.localidad (
    id_localidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_provincia INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_localidad_provincia
        FOREIGN KEY (id_provincia)
        REFERENCES parametricas.provincia (id_provincia)
);

/* NOTA: Esta tabla se mantiene en el esquema PUBLIC 
   según la solicitud explícita de exclusión.
*/
CREATE TABLE public.lugar_coordenada_xy (
    id_lugar_coordenada BIGINT PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    grados_x INTEGER NOT NULL,
    min_x INTEGER NOT NULL,
    seg_x DOUBLE PRECISION NOT NULL,
    grados_y INTEGER NOT NULL,
    min_y INTEGER NOT NULL,
    seg_y DOUBLE PRECISION NOT NULL
);


/* =========================================================
   ESTRUCTURA ORGANIZACIONAL (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.departamento_caso (
    id_departamento_caso VARCHAR(2) PRIMARY KEY,
    descripcion VARCHAR(50) NOT NULL
);

CREATE TABLE public.unidad_caso (
    id_unidad_caso VARCHAR(2) PRIMARY KEY,
    descripcion VARCHAR(80) NOT NULL
);

CREATE TABLE public.unidad (
    id_unidad INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    abreviatura VARCHAR(3) NOT NULL,
    descripcion VARCHAR(80) NOT NULL,
    abreviatura_icia VARCHAR(2) NOT NULL,
    es_operativa_admin BOOLEAN NOT NULL,
    abreviatura_reporte VARCHAR(10) NOT NULL
);

CREATE TABLE public.distrital (
    id_distrital INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_unidad INTEGER NOT NULL,
    descripcion VARCHAR(80) NOT NULL,
    CONSTRAINT fk_distrital_unidad
        FOREIGN KEY (id_unidad)
        REFERENCES public.unidad (id_unidad)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.grupo (
    id_grupo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_distrital INTEGER NOT NULL,
    descripcion VARCHAR(75) NOT NULL,
    CONSTRAINT fk_grupo_distrital
        FOREIGN KEY (id_distrital)
        REFERENCES public.distrital (id_distrital)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.vehiculo_distrital (
    id_vehiculo_distrital INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_distrital INTEGER NOT NULL,
    placa VARCHAR(10) NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    CONSTRAINT fk_vehiculo_distrital_distrital
        FOREIGN KEY (id_distrital)
        REFERENCES public.distrital (id_distrital)
        ON UPDATE CASCADE
);


/* =========================================================
   USUARIOS Y SEGURIDAD (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.usuario (
    usuario VARCHAR(15) PRIMARY KEY,
    id_grado INTEGER NOT NULL,
    nombre_app VARCHAR(200) NOT NULL,
    telefono_celular VARCHAR(10) NOT NULL,
    telefono_fijo VARCHAR(10) NOT NULL,
    id_grupo INTEGER NOT NULL,
    rol VARCHAR(1) NOT NULL,
    CONSTRAINT fk_usuario_grado
        FOREIGN KEY (id_grado)
        REFERENCES parametricas.grado (id_grado),
    CONSTRAINT fk_usuario_grupo
        FOREIGN KEY (id_grupo)
        REFERENCES public.grupo (id_grupo)
        ON UPDATE CASCADE
);

CREATE TABLE public.usuario_unidad (
    usuario VARCHAR(15) NOT NULL,
    id_departamento_caso VARCHAR(2) NOT NULL,
    abreviatura_unidad VARCHAR(3) NOT NULL,
    CONSTRAINT fk_usuario_unidad_usuario
        FOREIGN KEY (usuario)
        REFERENCES public.usuario (usuario)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_usuario_unidad_departamento
        FOREIGN KEY (id_departamento_caso)
        REFERENCES public.departamento_caso (id_departamento_caso)
        ON UPDATE CASCADE
);


/* =========================================================
   CATÁLOGOS DE BIENES (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.catalogo_clase (
    id_catalogo_clase INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_bien INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    es_fungible BOOLEAN,
    CONSTRAINT fk_catalogo_clase_bien
        FOREIGN KEY (id_bien)
        REFERENCES parametricas.bienes (id_bien)
);

CREATE TABLE public.catalogo_tipo (
    id_catalogo_tipo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_catalogo_clase INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_catalogo_tipo_clase
        FOREIGN KEY (id_catalogo_clase)
        REFERENCES public.catalogo_clase (id_catalogo_clase)
);

CREATE TABLE public.catalogo_juridica (
    id_catalogo_juridica INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_catalogo_clase INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_catalogo_juridica_clase
        FOREIGN KEY (id_catalogo_clase)
        REFERENCES public.catalogo_clase (id_catalogo_clase)
        ON UPDATE CASCADE
);

CREATE TABLE public.catalogo_caracteristica (
    id_catalogo_caracteristica INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_catalogo_clase INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_catalogo_caracteristica_clase
        FOREIGN KEY (id_catalogo_clase)
        REFERENCES public.catalogo_clase (id_catalogo_clase)
);


/* =========================================================
   FÁBRICAS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.fabrica_modelo (
    id_fabrica_modelo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo_fabrica INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_fabrica_modelo_tipo
        FOREIGN KEY (id_tipo_fabrica)
        REFERENCES parametricas.tipo_fabrica (id_tipo_fabrica)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


/* =========================================================
   DROGAS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.estado_droga (
    id_estado_droga INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_tipo_droga INTEGER NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    CONSTRAINT fk_estado_droga_tipo
        FOREIGN KEY (id_tipo_droga)
        REFERENCES parametricas.tipo_droga (id_tipo_droga)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.estado (
    id_estado INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_etapa INTEGER NOT NULL,
    descripcion VARCHAR(40) NOT NULL,
    CONSTRAINT fk_estado_etapa
        FOREIGN KEY (id_etapa)
        REFERENCES parametricas.etapa (id_etapa)
        ON UPDATE CASCADE
);


/* =========================================================
   ITEMS OPERATIVOS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.item_operativo (
    id_item_operativo INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_categoria_operativo INTEGER NOT NULL,
    descripcion VARCHAR(90) NOT NULL,
    CONSTRAINT fk_item_operativo_categoria
        FOREIGN KEY (id_categoria_operativo)
        REFERENCES parametricas.categoria_operativo (id_categoria_operativo)
);


/* =========================================================
   CASOS Y ASIGNACIONES (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.asignacion (
    id_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_departamento_caso VARCHAR(2) NOT NULL,
    abreviatura_unidad VARCHAR(3) NOT NULL,
    id_distrital INTEGER NOT NULL,
    id_grupo INTEGER NOT NULL,
    letras VARCHAR(3) NOT NULL,
    numero_caso VARCHAR(20) NOT NULL,
    numero_caso_per_dom VARCHAR(20) NOT NULL,
    numero_operativo VARCHAR(20) NOT NULL,
    codigo_servicio VARCHAR(50) NOT NULL,
    ianus VARCHAR(15) NOT NULL,
    nombre_caso VARCHAR(30) NOT NULL,
    fiscal_solicitud VARCHAR(100) NOT NULL,
    telefono_solicitud VARCHAR(15) NOT NULL,
    asignado_caso VARCHAR(100) NOT NULL,
    telefono_asignado VARCHAR(15) NOT NULL,
    fiscal_asignado_caso VARCHAR(70) NOT NULL,
    telefono_fiscal VARCHAR(15) NOT NULL,
    id_etapa_investigacion INTEGER,
    resultado BOOLEAN,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    -- No se ponen FKs a 'etapa_investigacion' si es opcional y no estaba explícito antes,
    -- pero si se requiere integridad referencial a paramétricas:
    -- CONSTRAINT fk_asignacion_etapa FOREIGN KEY (id_etapa_investigacion) REFERENCES parametricas.etapa_investigacion (id_etapa_investigacion)
    CONSTRAINT fk_asignacion_departamento_caso
        FOREIGN KEY (id_departamento_caso)
        REFERENCES public.departamento_caso (id_departamento_caso)
);

CREATE TABLE public.caso_unidad (
    id_caso_unidad BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_operativo BIGINT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL
);

CREATE TABLE public.presedencia (
    id_presedencia BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    delitos_precedentes VARCHAR(150) NOT NULL,
    numero_caso_precedente VARCHAR(20) NOT NULL,
    ianus_precedente VARCHAR(15) NOT NULL,
    origen_caso TEXT NOT NULL,
    CONSTRAINT fk_presedencia_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.investigacion_paralela (
    id_investigacion_paralela BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_departamento_caso VARCHAR(2) NOT NULL,
    abreviatura_unidad VARCHAR(3) NOT NULL,
    id_distrital INTEGER NOT NULL,
    id_grupo INTEGER NOT NULL,
    delito VARCHAR(35) NOT NULL,
    numero_caso VARCHAR(20) NOT NULL,
    asignado_caso VARCHAR(100) NOT NULL,
    fiscal_asignado_caso VARCHAR(70) NOT NULL,
    id_operativo BIGINT NOT NULL,
    delito_precedente TEXT NOT NULL,
    informe TEXT NOT NULL,
    fecha_envio_investigacion_paralela TIMESTAMP NOT NULL,
    resultado BOOLEAN NOT NULL,
    fecha_respuesta_investigacion_paralela TIMESTAMP,
    respuesta_investigacion_paralela BOOLEAN NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL
);

CREATE TABLE public.documentacion_caso (
    id_documentacion_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_contenido_caso BIGINT NOT NULL,
    id_caso BIGINT NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    CONSTRAINT fk_documentacion_caso_contenido
        FOREIGN KEY (id_contenido_caso)
        REFERENCES parametricas.contenido_caso (id_contenido_caso),
    CONSTRAINT fk_documentacion_caso_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.archivo (
    id_archivo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_contenido_caso BIGINT NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    nombre_archivo VARCHAR(150) NOT NULL,
    data BYTEA NOT NULL,
    CONSTRAINT fk_archivo_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    -- CONSTRAINT fk_archivo_contenido FOREIGN KEY (id_contenido_caso) REFERENCES parametricas.contenido_caso (id_contenido_caso)
);

CREATE TABLE public.archivo_bien (
    id_archivo_bien BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_contenido_bien BIGINT NOT NULL,
    tipo VARCHAR(15) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    nombre_archivo VARCHAR(150) NOT NULL,
    data BYTEA NOT NULL,
    CONSTRAINT fk_archivo_bien_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
    -- CONSTRAINT fk_archivo_bien_contenido FOREIGN KEY (id_contenido_bien) REFERENCES parametricas.contenido_bien (id_contenido_bien)
);

CREATE TABLE public.documento_contenido_caso (
    id_documento_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_documentacion_caso BIGINT NOT NULL,
    hoja VARCHAR(10) NOT NULL,
    id_tamanio_documento INTEGER NOT NULL,
    archivo BYTEA NOT NULL,
    CONSTRAINT fk_documento_contenido_caso
        FOREIGN KEY (id_documentacion_caso)
        REFERENCES public.documentacion_caso (id_documentacion_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_documento_tamanio
        FOREIGN KEY (id_tamanio_documento)
        REFERENCES parametricas.tamanio_documento (id_tamanio_documento)
);


/* =========================================================
   INVESTIGADORES Y FISCALES (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.investigador (
    id_investigador BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    id_grado INTEGER NOT NULL,
    nombre_app VARCHAR(200) NOT NULL,
    telefono_celular VARCHAR(10) NOT NULL,
    telefono_fijo VARCHAR(10) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    es_actual BOOLEAN NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario_sistema VARCHAR(15) NOT NULL,
    CONSTRAINT fk_investigador_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_investigador_grado
        FOREIGN KEY (id_grado)
        REFERENCES parametricas.grado (id_grado)
);

CREATE TABLE public.investigador_caso (
    id_investigador_caso BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    memo VARCHAR(15) NOT NULL,
    fecha_asignacion TIMESTAMP NOT NULL,
    es_actual BOOLEAN NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario_sistema VARCHAR(15) NOT NULL,
    CONSTRAINT fk_investigador_caso_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.fiscal (
    id_fiscal BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    nombre_apellidos VARCHAR(150) NOT NULL,
    telefono_celular VARCHAR(10) NOT NULL,
    telefono_fijo VARCHAR(10) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    es_actual BOOLEAN NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_fiscal_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


/* =========================================================
   JURISDICCIÓN Y CONTROL (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.jurisdiccion (
    id_jurisdiccion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    jurisdiccion VARCHAR(100) NOT NULL,
    observacion VARCHAR(150) NOT NULL,
    es_actual BOOLEAN NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_jurisdiccion_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.control_jurisdiccional (
    id_control_jurisdiccional BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    juzgado_instruccion VARCHAR(100) NOT NULL,
    juzgado_partido VARCHAR(100) NOT NULL,
    tribunal_sentencia VARCHAR(100) NOT NULL,
    juzgado_ejecucion VARCHAR(100) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    es_actual BOOLEAN NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_control_jurisdiccional_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE public.seguimiento_investigacion (
    id_seguimiento_investigacion BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    actividad_realizada TEXT NOT NULL,
    actividad_programada TEXT NOT NULL,
    CONSTRAINT fk_seguimiento_investigacion_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


/* =========================================================
   OPERATIVOS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.operativo (
    id_operativo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_tipo_relevancia INTEGER NOT NULL,
    numero_operativo VARCHAR(20) NOT NULL,
    id_tipo_denuncia INTEGER,
    id_tipo_penal INTEGER,
    fecha_operativo TIMESTAMP NOT NULL,
    id_departamento INTEGER NOT NULL,
    id_provincia INTEGER NOT NULL,
    id_localidad INTEGER NOT NULL,
    lugar VARCHAR(255) NOT NULL,
    id_categoria_operativo INTEGER NOT NULL,
    id_item_operativo INTEGER NOT NULL,
    id_unidad INTEGER NOT NULL,
    id_distrital INTEGER NOT NULL,
    id_grupo INTEGER NOT NULL,
    mando VARCHAR(150) NOT NULL,
    grados_x INTEGER NOT NULL,
    min_x INTEGER NOT NULL,
    seg_x DOUBLE PRECISION NOT NULL,
    coord_x DOUBLE PRECISION NOT NULL,
    grados_y INTEGER NOT NULL,
    min_y INTEGER NOT NULL,
    seg_y DOUBLE PRECISION NOT NULL,
    coord_y DOUBLE PRECISION NOT NULL,
    id_plan_operacion INTEGER NOT NULL,
    breve_detalle TEXT,
    descripcion TEXT NOT NULL,
    id_tipo_operacion INTEGER NOT NULL,
    organizacion VARCHAR(50) NOT NULL,
    clan_familiar VARCHAR(50),
    es_revisado BOOLEAN NOT NULL,
    es_positivo BOOLEAN NOT NULL,
    es_aprehendido BOOLEAN NOT NULL,
    es_arrestado BOOLEAN NOT NULL,
    es_icia BOOLEAN NOT NULL,
    es_parte_diario BOOLEAN NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_operativo_asignacion
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_operativo_item
        FOREIGN KEY (id_item_operativo)
        REFERENCES public.item_operativo (id_item_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_operativo_plan
        FOREIGN KEY (id_plan_operacion)
        REFERENCES parametricas.plan_operaciones (id_plan_operacion)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    -- FKs a Paramétricas geográficas y de tipo
    CONSTRAINT fk_operativo_tipo_relevancia
        FOREIGN KEY (id_tipo_relevancia)
        REFERENCES parametricas.tipo_relevancia (id_tipo_relevancia),
    CONSTRAINT fk_operativo_tipo_denuncia
        FOREIGN KEY (id_tipo_denuncia)
        REFERENCES parametricas.tipo_denuncia (id_tipo_denuncia),
    CONSTRAINT fk_operativo_tipo_penal
        FOREIGN KEY (id_tipo_penal)
        REFERENCES parametricas.tipo_penal (id_tipo_penal),
    CONSTRAINT fk_operativo_departamento
        FOREIGN KEY (id_departamento)
        REFERENCES parametricas.departamento (id_departamento),
    CONSTRAINT fk_operativo_provincia
        FOREIGN KEY (id_provincia)
        REFERENCES parametricas.provincia (id_provincia),
    CONSTRAINT fk_operativo_localidad
        FOREIGN KEY (id_localidad)
        REFERENCES parametricas.localidad (id_localidad),
    CONSTRAINT fk_operativo_categoria
        FOREIGN KEY (id_categoria_operativo)
        REFERENCES parametricas.categoria_operativo (id_categoria_operativo),
    CONSTRAINT fk_operativo_tipo_operacion
        FOREIGN KEY (id_tipo_operacion)
        REFERENCES parametricas.tipo_operacion (id_tipo_operacion)
);

CREATE TABLE public.galeria (
    id_galeria BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    descripcion VARCHAR(100) NOT NULL,
    foto BYTEA NOT NULL,
    CONSTRAINT fk_galeria_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
);

CREATE TABLE public.logotipo (
    id_logotipo BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    numero_caso VARCHAR(20) NOT NULL,
    numero_operativo VARCHAR(20) NOT NULL,
    fecha_operativo TIMESTAMP NOT NULL,
    nombre_caso VARCHAR(30) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen VARCHAR(50) NOT NULL,
    descripcion_logo TEXT NOT NULL,
    id_tipo_droga INTEGER NOT NULL,
    id_pais_origen INTEGER NOT NULL,
    id_pais_destino INTEGER NOT NULL,
    organizacion VARCHAR(50) NOT NULL,
    blanco TEXT NOT NULL,
    observacion TEXT NOT NULL,
    enlace VARCHAR(300) NOT NULL,
    fotografia BYTEA NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_logotipo_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo),
    CONSTRAINT fk_logotipo_tipo_droga
        FOREIGN KEY (id_tipo_droga)
        REFERENCES parametricas.tipo_droga (id_tipo_droga),
    CONSTRAINT fk_logotipo_pais_origen
        FOREIGN KEY (id_pais_origen)
        REFERENCES parametricas.pais (id_pais),
    CONSTRAINT fk_logotipo_pais_destino
        FOREIGN KEY (id_pais_destino)
        REFERENCES parametricas.pais_destino (id_pais_destino)
);

CREATE TABLE public.servidor_policial (
    id_servidor_policial BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_grado INTEGER NOT NULL,
    nombre_apellidos VARCHAR(150) NOT NULL,
    info_actualizada TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_servidor_policial_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_servidor_policial_grado
        FOREIGN KEY (id_grado)
        REFERENCES parametricas.grado (id_grado)
);


/* =========================================================
   PERSONAS (DETENIDOS, ARRESTADOS, IMPLICADOS) (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.detenido_investigado (
    id_detenido_investigado BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_caso BIGINT NOT NULL,
    id_tipo_persona INTEGER NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    apellido_esposo VARCHAR(50) NOT NULL,
    id_pais INTEGER NOT NULL,
    id_estado_civil INTEGER NOT NULL,
    id_tipo_documento INTEGER NOT NULL,
    numero_documento VARCHAR(50) NOT NULL,
    relacion VARCHAR(250) NOT NULL,
    observaciones TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    fecha_hora_actualizacion TIMESTAMP NOT NULL,
    usuario_actualizacion VARCHAR(15) NOT NULL,
    CONSTRAINT fk_detenido_investigado_caso
        FOREIGN KEY (id_caso)
        REFERENCES public.asignacion (id_caso),
    CONSTRAINT fk_detenido_investigado_tipo_persona
        FOREIGN KEY (id_tipo_persona)
        REFERENCES parametricas.tipo_persona (id_tipo_persona),
    CONSTRAINT fk_detenido_investigado_pais
        FOREIGN KEY (id_pais)
        REFERENCES parametricas.pais (id_pais),
    CONSTRAINT fk_detenido_investigado_estado_civil
        FOREIGN KEY (id_estado_civil)
        REFERENCES parametricas.estado_civil (id_estado_civil),
    CONSTRAINT fk_detenido_investigado_tipo_doc
        FOREIGN KEY (id_tipo_documento)
        REFERENCES parametricas.tipo_documento (id_tipo_documento)
);

CREATE TABLE public.detenido_auxiliar (
    id_detenido_auxiliar BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    numero_caso VARCHAR(50) NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    apellido_esposo VARCHAR(50) NOT NULL,
    id_pais INTEGER NOT NULL,
    es_masculino BOOLEAN NOT NULL,
    fecha_nacimiento TIMESTAMP,
    id_estado_civil INTEGER NOT NULL,
    serie VARCHAR(50) NOT NULL,
    seccion VARCHAR(50) NOT NULL,
    foto_frente BYTEA,
    foto_perfil_derecho BYTEA,
    foto_perfil_izquierdo BYTEA,
    direccion VARCHAR(255) NOT NULL,
    observaciones TEXT NOT NULL,
    es_actual BOOLEAN NOT NULL,
    es_revision_icia BOOLEAN NOT NULL,
    tiene_tarjeta BOOLEAN NOT NULL,
    esta_vivo BOOLEAN NOT NULL,
    observaciones_adicionales TEXT NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    fecha_hora_actualizacion TIMESTAMP NOT NULL,
    usuario_actualizacion VARCHAR(15) NOT NULL,
    CONSTRAINT fk_detenido_auxiliar_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detenido_auxiliar_estado_civil
        FOREIGN KEY (id_estado_civil)
        REFERENCES parametricas.estado_civil (id_estado_civil)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_detenido_auxiliar_pais
        FOREIGN KEY (id_pais)
        REFERENCES parametricas.pais (id_pais)
);

CREATE TABLE public.arrestado_auxiliar (
    id_arrestado_auxiliar BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    numero_caso VARCHAR(50) NOT NULL,
    nombres VARCHAR(50) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50) NOT NULL,
    apellido_esposo VARCHAR(50) NOT NULL,
    es_masculino BOOLEAN NOT NULL,
    id_pais INTEGER NOT NULL,
    numero_documento VARCHAR(15) NOT NULL,
    fecha_nacimiento TIMESTAMP,
    lugar_nacimiento VARCHAR(150) NOT NULL,
    id_estado_civil INTEGER NOT NULL,
    ocupacion VARCHAR(70) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    estatura VARCHAR(50) NOT NULL,
    id_color_piel INTEGER NOT NULL,
    id_color_ojos INTEGER NOT NULL,
    id_color_cabello INTEGER NOT NULL,
    id_tipo_cabello INTEGER NOT NULL,
    senas VARCHAR(150) NOT NULL,
    lugar_arresto VARCHAR(150) NOT NULL,
    foto_frente BYTEA,
    foto_dedo_derecho BYTEA,
    foto_dedo_izquierdo BYTEA,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(50) NOT NULL,
    fecha_hora_actualizacion TIMESTAMP,
    CONSTRAINT fk_arrestado_auxiliar_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo),
    CONSTRAINT fk_arrestado_auxiliar_pais
        FOREIGN KEY (id_pais)
        REFERENCES parametricas.pais (id_pais),
    CONSTRAINT fk_arrestado_auxiliar_estado_civil
        FOREIGN KEY (id_estado_civil)
        REFERENCES parametricas.estado_civil (id_estado_civil),
    CONSTRAINT fk_arrestado_auxiliar_color_piel
        FOREIGN KEY (id_color_piel)
        REFERENCES parametricas.color_piel (id_color_piel),
    CONSTRAINT fk_arrestado_auxiliar_color_ojos
        FOREIGN KEY (id_color_ojos)
        REFERENCES parametricas.color_ojos (id_color_ojos),
    CONSTRAINT fk_arrestado_auxiliar_color_cabello
        FOREIGN KEY (id_color_cabello)
        REFERENCES parametricas.color_cabello (id_color_cabello),
    CONSTRAINT fk_arrestado_auxiliar_tipo_cabello
        FOREIGN KEY (id_tipo_cabello)
        REFERENCES parametricas.tipo_cabellos (id_tipo_cabello)
);


/* =========================================================
   DROGAS SECUESTRADAS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.droga (
    id_droga BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_tipo_droga INTEGER NOT NULL,
    id_estado_droga INTEGER NOT NULL,
    cantidad_gramos DOUBLE PRECISION NOT NULL,
    cantidad_unidades INTEGER DEFAULT 0,
    id_forma_transporte INTEGER NOT NULL,
    id_pais_procedencia INTEGER NOT NULL,
    id_pais_destino INTEGER NOT NULL,
    foto_prueba_campo BYTEA,
    foto_pesaje BYTEA,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_droga_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_droga_tipo_droga
        FOREIGN KEY (id_tipo_droga)
        REFERENCES parametricas.tipo_droga (id_tipo_droga),
    CONSTRAINT fk_droga_estado_droga
        FOREIGN KEY (id_estado_droga)
        REFERENCES public.estado_droga (id_estado_droga),
    CONSTRAINT fk_droga_forma_transporte
        FOREIGN KEY (id_forma_transporte)
        REFERENCES parametricas.forma_transporte (id_forma_transporte),
    CONSTRAINT fk_droga_pais_procedencia
        FOREIGN KEY (id_pais_procedencia)
        REFERENCES parametricas.pais (id_pais),
    CONSTRAINT fk_droga_pais_destino
        FOREIGN KEY (id_pais_destino)
        REFERENCES parametricas.pais (id_pais)
);


/* =========================================================
   SUSTANCIAS SÓLIDAS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.sustancia_solida (
    id_sustancia_solida BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_sustancia_solida_descripcion INTEGER NOT NULL,
    cantidad DOUBLE PRECISION NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_sustancia_solida_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_sustancia_solida_descripcion
        FOREIGN KEY (id_sustancia_solida_descripcion)
        REFERENCES parametricas.sustancia_solida_descripcion (id_sustancia_solida_descripcion)
);


/* =========================================================
   SUSTANCIAS LÍQUIDAS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.sustancia_liquida (
    id_sustancia_liquida BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_sustancia_liquida_descripcion INTEGER NOT NULL,
    cantidad DOUBLE PRECISION NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_sustancia_liquida_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_sustancia_liquida_descripcion
        FOREIGN KEY (id_sustancia_liquida_descripcion)
        REFERENCES parametricas.sustancia_liquida_descripcion (id_sustancia_liquida_descripcion)
);


/* =========================================================
   FÁBRICAS/LABORATORIOS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.fabrica (
    id_fabrica BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_fabrica_modelo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_fabrica_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_fabrica_modelo
        FOREIGN KEY (id_fabrica_modelo)
        REFERENCES public.fabrica_modelo (id_fabrica_modelo)
);


/* =========================================================
   BIENES SECUESTRADOS (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.item_bien_secuestrado (
    id_item_bien_secuestrado BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_catalogo_tipo INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    costo_aproximado DOUBLE PRECISION DEFAULT 0,
    costo_cuantificado DOUBLE PRECISION DEFAULT 0,
    es_investigacion BOOLEAN NOT NULL DEFAULT FALSE,
    foto_bien BYTEA,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_item_bien_secuestrado_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_item_bien_secuestrado_catalogo_tipo
        FOREIGN KEY (id_catalogo_tipo)
        REFERENCES public.catalogo_tipo (id_catalogo_tipo)
);


/* =========================================================
   CARACTERÍSTICAS DE BIENES (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.item_bien_caracteristica (
    id_item_bien_caracteristica BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_item_bien_secuestrado BIGINT NOT NULL,
    id_catalogo_caracteristica INTEGER NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_item_bien_caracteristica_bien
        FOREIGN KEY (id_item_bien_secuestrado)
        REFERENCES public.item_bien_secuestrado (id_item_bien_secuestrado)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_item_bien_caracteristica_catalogo
        FOREIGN KEY (id_catalogo_caracteristica)
        REFERENCES public.catalogo_caracteristica (id_catalogo_caracteristica)
);


/* =========================================================
   HOJA DE COCA (ESQUEMA PUBLIC)
   ========================================================= */

CREATE TABLE public.coca (
    id_coca BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_operativo BIGINT NOT NULL,
    id_coca_procedencia INTEGER NOT NULL,
    id_coca_estado INTEGER NOT NULL,
    id_coca_descripcion INTEGER NOT NULL,
    cantidad_kilogramos DOUBLE PRECISION NOT NULL,
    observaciones TEXT,
    fecha_hora_ingreso TIMESTAMP NOT NULL,
    usuario VARCHAR(15) NOT NULL,
    CONSTRAINT fk_coca_operativo
        FOREIGN KEY (id_operativo)
        REFERENCES public.operativo (id_operativo)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_coca_procedencia
        FOREIGN KEY (id_coca_procedencia)
        REFERENCES parametricas.coca_procedencia (id_coca_procedencia),
    CONSTRAINT fk_coca_estado
        FOREIGN KEY (id_coca_estado)
        REFERENCES parametricas.coca_estado (id_coca_estado),
    CONSTRAINT fk_coca_descripcion
        FOREIGN KEY (id_coca_descripcion)
        REFERENCES parametricas.coca_descripcion (id_coca_descripcion)
);


/* =========================================================
   ÍNDICES PARA OPTIMIZACIÓN
   ========================================================= */

CREATE INDEX idx_operativo_caso ON public.operativo (id_caso);
CREATE INDEX idx_operativo_fecha ON public.operativo (fecha_operativo);
CREATE INDEX idx_droga_operativo ON public.droga (id_operativo);
CREATE INDEX idx_detenido_auxiliar_operativo ON public.detenido_auxiliar (id_operativo);
CREATE INDEX idx_arrestado_auxiliar_operativo ON public.arrestado_auxiliar (id_operativo);
CREATE INDEX idx_item_bien_secuestrado_operativo ON public.item_bien_secuestrado (id_operativo);
CREATE INDEX idx_fabrica_operativo ON public.fabrica (id_operativo);
CREATE INDEX idx_galeria_operativo ON public.galeria (id_operativo);
CREATE INDEX idx_asignacion_usuario ON public.asignacion (usuario);