-- ============================================
-- Script de creación de esquema SUNESIS
-- Migración de SQL Server a PostgreSQL
-- Proyecto: FELCN-SUNESIS
-- ============================================

-- Crear esquema sunesis
CREATE SCHEMA IF NOT EXISTS sunesis;

-- ============================================
-- TABLAS PARAMÉTRICAS (LOOKUPS)
-- ============================================

-- Tabla: Grados (jerarquía militar/policial)
CREATE TABLE IF NOT EXISTS sunesis.grados (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    orden INTEGER DEFAULT 0,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Unidades
CREATE TABLE IF NOT EXISTS sunesis.unidades (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(150) NOT NULL,
    abreviatura VARCHAR(50),
    abreviatura_icia VARCHAR(50),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Distritales
CREATE TABLE IF NOT EXISTS sunesis.distritales (
    id BIGSERIAL PRIMARY KEY,
    id_unidad BIGINT NOT NULL REFERENCES sunesis.unidades(id),
    codigo VARCHAR(20) NOT NULL,
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Grupos
CREATE TABLE IF NOT EXISTS sunesis.grupos (
    id BIGSERIAL PRIMARY KEY,
    id_distrital BIGINT NOT NULL REFERENCES sunesis.distritales(id),
    codigo VARCHAR(20),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Paises
CREATE TABLE IF NOT EXISTS sunesis.paises (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    codigo_iso VARCHAR(3),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Departamentos
CREATE TABLE IF NOT EXISTS sunesis.departamentos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Provincias
CREATE TABLE IF NOT EXISTS sunesis.provincias (
    id BIGSERIAL PRIMARY KEY,
    id_departamento BIGINT NOT NULL REFERENCES sunesis.departamentos(id),
    codigo VARCHAR(10),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Localidades
CREATE TABLE IF NOT EXISTS sunesis.localidades (
    id BIGSERIAL PRIMARY KEY,
    id_provincia BIGINT NOT NULL REFERENCES sunesis.provincias(id),
    codigo VARCHAR(10),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Estados de Caso
CREATE TABLE IF NOT EXISTS sunesis.estados_caso (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    color VARCHAR(20),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Etapas de Investigación
CREATE TABLE IF NOT EXISTS sunesis.etapas_investigacion (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    orden INTEGER DEFAULT 0,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Denuncia
CREATE TABLE IF NOT EXISTS sunesis.tipos_denuncia (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos Penales
CREATE TABLE IF NOT EXISTS sunesis.tipos_penal (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(150) NOT NULL,
    articulo VARCHAR(50),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Relevancia
CREATE TABLE IF NOT EXISTS sunesis.tipos_relevancia (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Categorías de Operativo
CREATE TABLE IF NOT EXISTS sunesis.categorias_operativo (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Items de Operativo (subcategorías)
CREATE TABLE IF NOT EXISTS sunesis.items_operativo (
    id BIGSERIAL PRIMARY KEY,
    id_categoria BIGINT NOT NULL REFERENCES sunesis.categorias_operativo(id),
    codigo VARCHAR(20),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Operativo
CREATE TABLE IF NOT EXISTS sunesis.tipos_operativo (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Plan de Operaciones
CREATE TABLE IF NOT EXISTS sunesis.plan_operaciones (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    gestion VARCHAR(10),
    descripcion TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Droga
CREATE TABLE IF NOT EXISTS sunesis.tipos_droga (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Estados de Droga
CREATE TABLE IF NOT EXISTS sunesis.estados_droga (
    id BIGSERIAL PRIMARY KEY,
    id_tipo_droga BIGINT NOT NULL REFERENCES sunesis.tipos_droga(id),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Formas de Transporte
CREATE TABLE IF NOT EXISTS sunesis.formas_transporte (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Organización
CREATE TABLE IF NOT EXISTS sunesis.tipos_organizacion (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Sustancias Sólidas (descripción)
CREATE TABLE IF NOT EXISTS sunesis.sustancias_solidas_desc (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Sustancias Líquidas (descripción)
CREATE TABLE IF NOT EXISTS sunesis.sustancias_liquidas_desc (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Tipos de Fábrica
CREATE TABLE IF NOT EXISTS sunesis.tipos_fabrica (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Modelos de Fábrica
CREATE TABLE IF NOT EXISTS sunesis.modelos_fabrica (
    id BIGSERIAL PRIMARY KEY,
    id_tipo_fabrica BIGINT NOT NULL REFERENCES sunesis.tipos_fabrica(id),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Bienes (categorías principales)
CREATE TABLE IF NOT EXISTS sunesis.bienes (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(20),
    descripcion VARCHAR(100) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Catálogo de Clases (bienes)
CREATE TABLE IF NOT EXISTS sunesis.catalogo_clases (
    id BIGSERIAL PRIMARY KEY,
    id_bien BIGINT NOT NULL REFERENCES sunesis.bienes(id),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Catálogo de Tipos (bienes)
CREATE TABLE IF NOT EXISTS sunesis.catalogo_tipos (
    id BIGSERIAL PRIMARY KEY,
    id_clase BIGINT NOT NULL REFERENCES sunesis.catalogo_clases(id),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Catálogo de Características (bienes)
CREATE TABLE IF NOT EXISTS sunesis.catalogo_caracteristicas (
    id BIGSERIAL PRIMARY KEY,
    id_clase BIGINT NOT NULL REFERENCES sunesis.catalogo_clases(id),
    descripcion VARCHAR(150) NOT NULL,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- ============================================
-- TABLAS PRINCIPALES DE NEGOCIO
-- ============================================

-- Tabla: Casos (ASIGNACION)
CREATE TABLE IF NOT EXISTS sunesis.casos (
    id BIGSERIAL PRIMARY KEY,
    id_pais BIGINT REFERENCES sunesis.paises(id),
    id_estado_caso BIGINT REFERENCES sunesis.estados_caso(id),
    id_etapa_investigacion BIGINT REFERENCES sunesis.etapas_investigacion(id),
    id_departamento BIGINT REFERENCES sunesis.departamentos(id),
    id_unidad BIGINT REFERENCES sunesis.unidades(id),
    nro_caso VARCHAR(50),
    nro_caso_cer VARCHAR(50),
    nro_operativo VARCHAR(50),
    nombre_caso VARCHAR(150),
    palabra_clave VARCHAR(50),
    lugar VARCHAR(200),
    antecedentes TEXT,
    fecha_inicio DATE,
    fecha_operativo TIMESTAMP WITHOUT TIME ZONE,
    solicita VARCHAR(150),
    fono_solicita VARCHAR(50),
    asignado_caso VARCHAR(150),
    fono_asignado VARCHAR(50),
    fiscal_asignado VARCHAR(150),
    fono_fiscal VARCHAR(50),
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Índices para casos
CREATE INDEX IF NOT EXISTS idx_casos_username ON sunesis.casos(username);
CREATE INDEX IF NOT EXISTS idx_casos_nro_caso ON sunesis.casos(nro_caso);
CREATE INDEX IF NOT EXISTS idx_casos_nro_operativo ON sunesis.casos(nro_operativo);

-- Tabla: Operativos
CREATE TABLE IF NOT EXISTS sunesis.operativos (
    id BIGSERIAL PRIMARY KEY,
    id_caso BIGINT NOT NULL REFERENCES sunesis.casos(id),
    id_tipo_relevancia BIGINT REFERENCES sunesis.tipos_relevancia(id),
    id_tipo_denuncia BIGINT REFERENCES sunesis.tipos_denuncia(id),
    id_tipo_penal BIGINT REFERENCES sunesis.tipos_penal(id),
    id_departamento BIGINT REFERENCES sunesis.departamentos(id),
    id_provincia BIGINT REFERENCES sunesis.provincias(id),
    id_localidad BIGINT REFERENCES sunesis.localidades(id),
    id_categoria BIGINT REFERENCES sunesis.categorias_operativo(id),
    id_item BIGINT REFERENCES sunesis.items_operativo(id),
    id_unidad BIGINT REFERENCES sunesis.unidades(id),
    id_distrital BIGINT REFERENCES sunesis.distritales(id),
    id_grupo BIGINT REFERENCES sunesis.grupos(id),
    id_plan_operacion BIGINT REFERENCES sunesis.plan_operaciones(id),
    id_tipo_operativo BIGINT REFERENCES sunesis.tipos_operativo(id),
    nro_operativo VARCHAR(50),
    fecha_operativo TIMESTAMP WITHOUT TIME ZONE,
    lugar VARCHAR(300),
    al_mando VARCHAR(200),
    -- Coordenadas en grados/minutos/segundos
    grados_x DECIMAL(10,6),
    minutos_x DECIMAL(10,6),
    segundos_x DECIMAL(10,6),
    coord_x DECIMAL(15,10),
    grados_y DECIMAL(10,6),
    minutos_y DECIMAL(10,6),
    segundos_y DECIMAL(10,6),
    coord_y DECIMAL(15,10),
    breve_detalle TEXT,
    descripcion TEXT,
    organizacion VARCHAR(200),
    clan_familiar VARCHAR(200),
    revisado BOOLEAN DEFAULT FALSE,
    positivo BOOLEAN DEFAULT FALSE,
    aprehendido INTEGER DEFAULT 0,
    arrestado INTEGER DEFAULT 0,
    es_icia BOOLEAN DEFAULT FALSE,
    parte_diario TEXT,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Índices para operativos
CREATE INDEX IF NOT EXISTS idx_operativos_caso ON sunesis.operativos(id_caso);
CREATE INDEX IF NOT EXISTS idx_operativos_nro ON sunesis.operativos(nro_operativo);

-- Tabla: Servicios (ICIA)
CREATE TABLE IF NOT EXISTS sunesis.servicios (
    id BIGSERIAL PRIMARY KEY,
    codigo_servicio VARCHAR(100) NOT NULL,
    usuario VARCHAR(50),
    usuario_emergencia VARCHAR(50),
    fecha_hora_ingreso TIMESTAMP WITHOUT TIME ZONE,
    fecha_hora_salida TIMESTAMP WITHOUT TIME ZONE,
    observaciones TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Índices para servicios
CREATE INDEX IF NOT EXISTS idx_servicios_usuario ON sunesis.servicios(usuario);
CREATE INDEX IF NOT EXISTS idx_servicios_codigo ON sunesis.servicios(codigo_servicio);

-- Tabla: Blancos (personas investigadas)
CREATE TABLE IF NOT EXISTS sunesis.blancos (
    id BIGSERIAL PRIMARY KEY,
    id_caso BIGINT NOT NULL REFERENCES sunesis.casos(id),
    id_pais BIGINT REFERENCES sunesis.paises(id),
    nombres VARCHAR(100),
    paterno VARCHAR(75),
    materno VARCHAR(75),
    apellido_esposo VARCHAR(75),
    alias VARCHAR(50),
    foto BYTEA,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Antecedentes de Blancos
CREATE TABLE IF NOT EXISTS sunesis.antecedentes_blanco (
    id BIGSERIAL PRIMARY KEY,
    id_blanco BIGINT NOT NULL REFERENCES sunesis.blancos(id),
    id_tipo_delito BIGINT,
    id_pais BIGINT REFERENCES sunesis.paises(id),
    lugar_hecho VARCHAR(150),
    nro_caso VARCHAR(50),
    fecha_hecho DATE,
    hecho TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Redes Sociales de Blancos
CREATE TABLE IF NOT EXISTS sunesis.redes_sociales (
    id BIGSERIAL PRIMARY KEY,
    id_blanco BIGINT NOT NULL REFERENCES sunesis.blancos(id),
    tipo_red VARCHAR(50),
    direccion VARCHAR(250),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Ubicaciones de Blancos (GIS)
CREATE TABLE IF NOT EXISTS sunesis.ubicaciones_blanco (
    id BIGSERIAL PRIMARY KEY,
    id_blanco BIGINT NOT NULL REFERENCES sunesis.blancos(id),
    descripcion VARCHAR(200),
    coord_x DECIMAL(15,10),
    coord_y DECIMAL(15,10),
    contenido TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Organizaciones/Empresas
CREATE TABLE IF NOT EXISTS sunesis.organizaciones (
    id BIGSERIAL PRIMARY KEY,
    id_caso BIGINT NOT NULL REFERENCES sunesis.casos(id),
    id_tipo_organizacion BIGINT REFERENCES sunesis.tipos_organizacion(id),
    nombre VARCHAR(150),
    nit VARCHAR(50),
    matricula VARCHAR(50),
    representante VARCHAR(150),
    observaciones TEXT,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Ubicaciones de Organizaciones (GIS)
CREATE TABLE IF NOT EXISTS sunesis.ubicaciones_organizacion (
    id BIGSERIAL PRIMARY KEY,
    id_organizacion BIGINT NOT NULL REFERENCES sunesis.organizaciones(id),
    descripcion VARCHAR(200),
    coord_x DECIMAL(15,10),
    coord_y DECIMAL(15,10),
    contenido TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Drogas
CREATE TABLE IF NOT EXISTS sunesis.drogas (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_estado_droga BIGINT REFERENCES sunesis.estados_droga(id),
    id_forma_transporte BIGINT REFERENCES sunesis.formas_transporte(id),
    id_pais_procedencia BIGINT REFERENCES sunesis.paises(id),
    id_pais_destino BIGINT REFERENCES sunesis.paises(id),
    cantidad DECIMAL(15,4),
    capsulas INTEGER,
    prueba VARCHAR(100),
    pesaje DECIMAL(15,4),
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Sustancias Sólidas
CREATE TABLE IF NOT EXISTS sunesis.sustancias_solidas (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_sustancia_desc BIGINT REFERENCES sunesis.sustancias_solidas_desc(id),
    cantidad DECIMAL(15,4),
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Sustancias Líquidas
CREATE TABLE IF NOT EXISTS sunesis.sustancias_liquidas (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_sustancia_desc BIGINT REFERENCES sunesis.sustancias_liquidas_desc(id),
    cantidad DECIMAL(15,4),
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Fábricas
CREATE TABLE IF NOT EXISTS sunesis.fabricas (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_modelo_fabrica BIGINT REFERENCES sunesis.modelos_fabrica(id),
    cantidad INTEGER,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Personas Auxiliares (detenidos)
CREATE TABLE IF NOT EXISTS sunesis.personas_auxiliares (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_pais BIGINT REFERENCES sunesis.paises(id),
    id_tipo_documento BIGINT,
    nombres VARCHAR(100),
    paterno VARCHAR(75),
    materno VARCHAR(75),
    apellido_esposo VARCHAR(75),
    genero VARCHAR(10),
    nro_documento VARCHAR(50),
    fecha_nacimiento DATE,
    direccion VARCHAR(250),
    estado_persona VARCHAR(50),
    foto_frente BYTEA,
    foto_perfil_derecho BYTEA,
    foto_perfil_izquierdo BYTEA,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Bienes Secuestrados
CREATE TABLE IF NOT EXISTS sunesis.bienes_secuestrados (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_tipo_bien BIGINT REFERENCES sunesis.catalogo_tipos(id),
    cantidad INTEGER,
    costo_aproximado DECIMAL(15,2),
    costo_cuantificado DECIMAL(15,2),
    investigado BOOLEAN DEFAULT FALSE,
    foto BYTEA,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Características de Bienes Secuestrados
CREATE TABLE IF NOT EXISTS sunesis.caracteristicas_bien (
    id BIGSERIAL PRIMARY KEY,
    id_bien_secuestrado BIGINT NOT NULL REFERENCES sunesis.bienes_secuestrados(id),
    id_caracteristica BIGINT REFERENCES sunesis.catalogo_caracteristicas(id),
    descripcion VARCHAR(200),
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Ubicaciones de Bienes (GIS)
CREATE TABLE IF NOT EXISTS sunesis.ubicaciones_bien (
    id BIGSERIAL PRIMARY KEY,
    id_bien_secuestrado BIGINT NOT NULL REFERENCES sunesis.bienes_secuestrados(id),
    descripcion VARCHAR(200),
    coord_x DECIMAL(15,10),
    coord_y DECIMAL(15,10),
    contenido TEXT,
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- Tabla: Logotipos
CREATE TABLE IF NOT EXISTS sunesis.logotipos (
    id BIGSERIAL PRIMARY KEY,
    id_operativo BIGINT NOT NULL REFERENCES sunesis.operativos(id),
    id_tipo_droga BIGINT REFERENCES sunesis.tipos_droga(id),
    id_pais_origen BIGINT REFERENCES sunesis.paises(id),
    id_pais_destino BIGINT REFERENCES sunesis.paises(id),
    nro_caso VARCHAR(50),
    nro_operativo VARCHAR(50),
    fecha_operativo TIMESTAMP WITHOUT TIME ZONE,
    nombre_caso VARCHAR(150),
    descripcion_operativo TEXT,
    imagen BYTEA,
    descripcion_logo TEXT,
    organizacion VARCHAR(200),
    blanco VARCHAR(200),
    observacion TEXT,
    enlace VARCHAR(500),
    fotografia BYTEA,
    username VARCHAR(100),
    _estado VARCHAR(30) NOT NULL DEFAULT 'ACTIVO',
    _transaccion VARCHAR(30) NOT NULL DEFAULT 'CREAR',
    _usuario_creacion BIGINT NOT NULL,
    _fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    _usuario_modificacion BIGINT,
    _fecha_modificacion TIMESTAMP WITHOUT TIME ZONE
);

-- ============================================
-- COMENTARIOS EN TABLAS
-- ============================================
COMMENT ON TABLE sunesis.casos IS 'Tabla principal de casos/asignaciones migrada de ASIGNACION';
COMMENT ON TABLE sunesis.operativos IS 'Tabla de operativos policiales migrada de OPERATIVO';
COMMENT ON TABLE sunesis.servicios IS 'Tabla de servicios ICIA migrada de SERVICIO';
COMMENT ON TABLE sunesis.blancos IS 'Tabla de personas investigadas (blancos)';
COMMENT ON TABLE sunesis.organizaciones IS 'Tabla de organizaciones/empresas investigadas';
COMMENT ON TABLE sunesis.drogas IS 'Tabla de drogas incautadas en operativos';
COMMENT ON TABLE sunesis.bienes_secuestrados IS 'Tabla de bienes secuestrados en operativos';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
