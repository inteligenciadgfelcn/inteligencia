--
-- PostgreSQL database dump
--

\restrict hKDDWnMPFvJhzo7nNxRjQw2Nr5vnvLz7RkAkZzy9q633wanUc5vPK2m3bRhAXe6

-- Dumped from database version 14.20 (Debian 14.20-1.pgdg13+1)
-- Dumped by pg_dump version 16.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: felcn_estructura; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA felcn_estructura;


ALTER SCHEMA felcn_estructura OWNER TO postgres;

--
-- Name: parametro; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA parametro;


ALTER SCHEMA parametro OWNER TO postgres;

--
-- Name: proyecto; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA proyecto;


ALTER SCHEMA proyecto OWNER TO postgres;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: usuario; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA usuario;


ALTER SCHEMA usuario OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: distrital; Type: TABLE; Schema: parametro; Owner: postgres
--

CREATE TABLE parametro.distrital (
    id integer NOT NULL,
    id_unidad integer NOT NULL,
    descripcion character varying(150) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT chk_distrital_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE parametro.distrital OWNER TO postgres;

--
-- Name: distrital_id_seq; Type: SEQUENCE; Schema: parametro; Owner: postgres
--

CREATE SEQUENCE parametro.distrital_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE parametro.distrital_id_seq OWNER TO postgres;

--
-- Name: distrital_id_seq; Type: SEQUENCE OWNED BY; Schema: parametro; Owner: postgres
--

ALTER SEQUENCE parametro.distrital_id_seq OWNED BY parametro.distrital.id;


--
-- Name: grado; Type: TABLE; Schema: parametro; Owner: postgres
--

CREATE TABLE parametro.grado (
    id integer NOT NULL,
    abreviatura character varying(20) NOT NULL,
    descripcion character varying(100) NOT NULL,
    orden integer,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT chk_grado_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE parametro.grado OWNER TO postgres;

--
-- Name: grado_id_seq; Type: SEQUENCE; Schema: parametro; Owner: postgres
--

CREATE SEQUENCE parametro.grado_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE parametro.grado_id_seq OWNER TO postgres;

--
-- Name: grado_id_seq; Type: SEQUENCE OWNED BY; Schema: parametro; Owner: postgres
--

ALTER SEQUENCE parametro.grado_id_seq OWNED BY parametro.grado.id;


--
-- Name: grupo; Type: TABLE; Schema: parametro; Owner: postgres
--

CREATE TABLE parametro.grupo (
    id integer NOT NULL,
    id_distrital integer NOT NULL,
    descripcion character varying(150) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT chk_grupo_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE parametro.grupo OWNER TO postgres;

--
-- Name: grupo_id_seq; Type: SEQUENCE; Schema: parametro; Owner: postgres
--

CREATE SEQUENCE parametro.grupo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE parametro.grupo_id_seq OWNER TO postgres;

--
-- Name: grupo_id_seq; Type: SEQUENCE OWNED BY; Schema: parametro; Owner: postgres
--

ALTER SEQUENCE parametro.grupo_id_seq OWNED BY parametro.grupo.id;


--
-- Name: parametro; Type: TABLE; Schema: parametro; Owner: postgres
--

CREATE TABLE parametro.parametro (
    id bigint NOT NULL,
    codigo character varying(15) NOT NULL,
    nombre character varying(50) NOT NULL,
    grupo character varying(15) NOT NULL,
    descripcion character varying(255) NOT NULL,
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_parametro_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE parametro.parametro OWNER TO postgres;

--
-- Name: parametro_id_seq; Type: SEQUENCE; Schema: parametro; Owner: postgres
--

CREATE SEQUENCE parametro.parametro_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE parametro.parametro_id_seq OWNER TO postgres;

--
-- Name: parametro_id_seq; Type: SEQUENCE OWNED BY; Schema: parametro; Owner: postgres
--

ALTER SEQUENCE parametro.parametro_id_seq OWNED BY parametro.parametro.id;


--
-- Name: unidad; Type: TABLE; Schema: parametro; Owner: postgres
--

CREATE TABLE parametro.unidad (
    id integer NOT NULL,
    abreviatura character varying(20) NOT NULL,
    descripcion character varying(150) NOT NULL,
    es_operativa_admin boolean DEFAULT false NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT chk_unidad_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE parametro.unidad OWNER TO postgres;

--
-- Name: unidad_id_seq; Type: SEQUENCE; Schema: parametro; Owner: postgres
--

CREATE SEQUENCE parametro.unidad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE parametro.unidad_id_seq OWNER TO postgres;

--
-- Name: unidad_id_seq; Type: SEQUENCE OWNED BY; Schema: parametro; Owner: postgres
--

ALTER SEQUENCE parametro.unidad_id_seq OWNED BY parametro.unidad.id;


--
-- Name: migrations; Type: TABLE; Schema: proyecto; Owner: postgres
--

CREATE TABLE proyecto.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE proyecto.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: proyecto; Owner: postgres
--

CREATE SEQUENCE proyecto.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE proyecto.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: proyecto; Owner: postgres
--

ALTER SEQUENCE proyecto.migrations_id_seq OWNED BY proyecto.migrations.id;


--
-- Name: auditoria_cambio; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.auditoria_cambio (
    id bigint NOT NULL,
    base_datos character varying(50) NOT NULL,
    schema_afectado character varying(50),
    tabla_afectada character varying(50) NOT NULL,
    accion character varying(25) NOT NULL,
    contenido_anterior jsonb,
    contenido_actual jsonb,
    id_registro character varying(50),
    usuario character varying(50),
    id_usuario bigint,
    fecha_hora timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE usuario.auditoria_cambio OWNER TO postgres;

--
-- Name: auditoria_cambio_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.auditoria_cambio_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.auditoria_cambio_id_seq OWNER TO postgres;

--
-- Name: auditoria_cambio_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.auditoria_cambio_id_seq OWNED BY usuario.auditoria_cambio.id;


--
-- Name: bitacora_login; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.bitacora_login (
    id bigint NOT NULL,
    id_usuario bigint,
    usuario character varying(50),
    ip_origen character varying(45),
    user_agent text,
    metodo_autenticacion character varying(30) DEFAULT 'LOCAL'::character varying NOT NULL,
    exitoso boolean DEFAULT false NOT NULL,
    motivo_fallo character varying(100),
    session_id character varying(100),
    dispositivo character varying(200),
    fecha_hora timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE usuario.bitacora_login OWNER TO postgres;

--
-- Name: bitacora_login_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.bitacora_login_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.bitacora_login_id_seq OWNER TO postgres;

--
-- Name: bitacora_login_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.bitacora_login_id_seq OWNED BY usuario.bitacora_login.id;


--
-- Name: casbin_rule; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.casbin_rule (
    id integer NOT NULL,
    ptype character varying,
    v0 character varying,
    v1 character varying,
    v2 character varying,
    v3 character varying,
    v4 character varying,
    v5 character varying,
    v6 character varying
);


ALTER TABLE usuario.casbin_rule OWNER TO postgres;

--
-- Name: casbin_rule_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.casbin_rule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.casbin_rule_id_seq OWNER TO postgres;

--
-- Name: casbin_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.casbin_rule_id_seq OWNED BY usuario.casbin_rule.id;


--
-- Name: modulo; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.modulo (
    id bigint NOT NULL,
    label character varying(50) NOT NULL,
    url character varying(50) NOT NULL,
    nombre character varying(50) NOT NULL,
    propiedades jsonb NOT NULL,
    id_modulo bigint,
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_modulo_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE usuario.modulo OWNER TO postgres;

--
-- Name: modulo_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.modulo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.modulo_id_seq OWNER TO postgres;

--
-- Name: modulo_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.modulo_id_seq OWNED BY usuario.modulo.id;


--
-- Name: persona; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.persona (
    id bigint NOT NULL,
    uuid_ciudadano uuid,
    nombres character varying(100),
    primer_apellido character varying(100),
    segundo_apellido character varying(100),
    tipo_documento character varying(15) DEFAULT 'CI'::character varying NOT NULL,
    tipo_documento_otro character varying(50),
    nro_documento character varying(50) NOT NULL,
    fecha_nacimiento date,
    telefono character varying(50),
    genero character varying(15),
    observacion character varying(255),
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_persona_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[]))),
    CONSTRAINT ck_persona_genero CHECK (((genero)::text = ANY ((ARRAY['M'::character varying, 'F'::character varying, 'OTRO'::character varying])::text[]))),
    CONSTRAINT ck_persona_tipo_documento CHECK (((tipo_documento)::text = ANY ((ARRAY['CI'::character varying, 'CIE'::character varying, 'PASAPORTE'::character varying, 'OTRO'::character varying])::text[])))
);


ALTER TABLE usuario.persona OWNER TO postgres;

--
-- Name: persona_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.persona_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.persona_id_seq OWNER TO postgres;

--
-- Name: persona_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.persona_id_seq OWNED BY usuario.persona.id;


--
-- Name: refresh_token; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.refresh_token (
    id character varying NOT NULL,
    grant_id character varying NOT NULL,
    iat timestamp without time zone NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    is_revoked boolean NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE usuario.refresh_token OWNER TO postgres;

--
-- Name: rol; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.rol (
    id bigint NOT NULL,
    rol character varying(50) NOT NULL,
    nombre character varying(100) NOT NULL,
    descripcion character varying(255) NOT NULL,
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_rol_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE usuario.rol OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.rol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.rol_id_seq OWNER TO postgres;

--
-- Name: rol_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.rol_id_seq OWNED BY usuario.rol.id;


--
-- Name: session; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.session (
    id character varying(255) NOT NULL,
    expired_at bigint NOT NULL,
    json text NOT NULL,
    destroyed_at timestamp with time zone
);


ALTER TABLE usuario.session OWNER TO postgres;

--
-- Name: usuario; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.usuario (
    id bigint NOT NULL,
    usuario character varying(50) NOT NULL,
    contrasena character varying(255) NOT NULL,
    ciudadania_digital boolean DEFAULT false NOT NULL,
    correo_electronico character varying,
    intentos integer DEFAULT 0 NOT NULL,
    codigo_desbloqueo character varying(100),
    codigo_recuperacion character varying(100),
    codigo_transaccion character varying(100),
    codigo_activacion character varying(100),
    fecha_bloqueo timestamp without time zone,
    url_foto character varying,
    nombre_app character varying(200),
    telefono_celular character varying(20),
    telefono_corporativo character varying(20),
    id_grado integer,
    id_grupo integer,
    id_persona bigint NOT NULL,
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_usuario_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying, 'CREADO'::character varying, 'PENDIENTE'::character varying])::text[])))
);


ALTER TABLE usuario.usuario OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.usuario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.usuario_id_seq OWNER TO postgres;

--
-- Name: usuario_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.usuario_id_seq OWNED BY usuario.usuario.id;


--
-- Name: usuario_rol; Type: TABLE; Schema: usuario; Owner: postgres
--

CREATE TABLE usuario.usuario_rol (
    id bigint NOT NULL,
    id_rol bigint NOT NULL,
    id_usuario bigint NOT NULL,
    _estado character varying(30) NOT NULL,
    _transaccion character varying(30) NOT NULL,
    _usuario_creacion bigint NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion bigint,
    _fecha_modificacion timestamp without time zone,
    CONSTRAINT ck_usuario_rol_estado CHECK (((_estado)::text = ANY ((ARRAY['ACTIVO'::character varying, 'INACTIVO'::character varying])::text[])))
);


ALTER TABLE usuario.usuario_rol OWNER TO postgres;

--
-- Name: usuario_rol_id_seq; Type: SEQUENCE; Schema: usuario; Owner: postgres
--

CREATE SEQUENCE usuario.usuario_rol_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE usuario.usuario_rol_id_seq OWNER TO postgres;

--
-- Name: usuario_rol_id_seq; Type: SEQUENCE OWNED BY; Schema: usuario; Owner: postgres
--

ALTER SEQUENCE usuario.usuario_rol_id_seq OWNED BY usuario.usuario_rol.id;


--
-- Name: distrital id; Type: DEFAULT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.distrital ALTER COLUMN id SET DEFAULT nextval('parametro.distrital_id_seq'::regclass);


--
-- Name: grado id; Type: DEFAULT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.grado ALTER COLUMN id SET DEFAULT nextval('parametro.grado_id_seq'::regclass);


--
-- Name: grupo id; Type: DEFAULT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.grupo ALTER COLUMN id SET DEFAULT nextval('parametro.grupo_id_seq'::regclass);


--
-- Name: parametro id; Type: DEFAULT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.parametro ALTER COLUMN id SET DEFAULT nextval('parametro.parametro_id_seq'::regclass);


--
-- Name: unidad id; Type: DEFAULT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.unidad ALTER COLUMN id SET DEFAULT nextval('parametro.unidad_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: proyecto; Owner: postgres
--

ALTER TABLE ONLY proyecto.migrations ALTER COLUMN id SET DEFAULT nextval('proyecto.migrations_id_seq'::regclass);


--
-- Name: auditoria_cambio id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.auditoria_cambio ALTER COLUMN id SET DEFAULT nextval('usuario.auditoria_cambio_id_seq'::regclass);


--
-- Name: bitacora_login id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.bitacora_login ALTER COLUMN id SET DEFAULT nextval('usuario.bitacora_login_id_seq'::regclass);


--
-- Name: casbin_rule id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.casbin_rule ALTER COLUMN id SET DEFAULT nextval('usuario.casbin_rule_id_seq'::regclass);


--
-- Name: modulo id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.modulo ALTER COLUMN id SET DEFAULT nextval('usuario.modulo_id_seq'::regclass);


--
-- Name: persona id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.persona ALTER COLUMN id SET DEFAULT nextval('usuario.persona_id_seq'::regclass);


--
-- Name: rol id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.rol ALTER COLUMN id SET DEFAULT nextval('usuario.rol_id_seq'::regclass);


--
-- Name: usuario id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario ALTER COLUMN id SET DEFAULT nextval('usuario.usuario_id_seq'::regclass);


--
-- Name: usuario_rol id; Type: DEFAULT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario_rol ALTER COLUMN id SET DEFAULT nextval('usuario.usuario_rol_id_seq'::regclass);


--
-- Data for Name: distrital; Type: TABLE DATA; Schema: parametro; Owner: postgres
--

COPY parametro.distrital (id, id_unidad, descripcion, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	1	Unidad Administrativa Central	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	2	Distrital La Paz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	2	Distrital El Alto	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	3	Distrital Cochabamba	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	3	Distrital Chapare	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	4	Distrital Santa Cruz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	4	Distrital Yapacaní	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	5	Distrital Oruro	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	6	Distrital Potosí	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	7	Distrital Sucre	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
11	8	Distrital Trinidad	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
12	8	Distrital Rurrenabaque	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
13	9	Distrital Cobija	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
14	10	Distrital Tarija	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
15	10	Distrital Yacuiba	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: grado; Type: TABLE DATA; Schema: parametro; Owner: postgres
--

COPY parametro.grado (id, abreviatura, descripcion, orden, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	Gral.	General	1	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	Cnel.	Coronel	2	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	Tcnl.	Teniente Coronel	3	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	My.	Mayor	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	Cap.	Capitán	5	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	Tte.	Teniente	6	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	Sub-Tte.	Sub Teniente	7	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	Sgto. 1ro.	Sargento Primero	8	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	Sgto. 2do.	Sargento Segundo	9	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	Cbte.	Cabo	10	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
11	Ptro.	Patrullero	11	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
12	Adm.	Administrativo	12	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: grupo; Type: TABLE DATA; Schema: parametro; Owner: postgres
--

COPY parametro.grupo (id, id_distrital, descripcion, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	1	Grupo Administrativo Central	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	2	Grupo Operativo La Paz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	2	Grupo de Inteligencia La Paz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	3	Grupo Operativo El Alto	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	4	Grupo Operativo Cochabamba	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	4	Grupo de Inteligencia Cochabamba	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	5	Grupo Operativo Chapare	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	5	Grupo Interdicción Chapare	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	6	Grupo Operativo Santa Cruz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	6	Grupo de Inteligencia Santa Cruz	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
11	7	Grupo Operativo Yapacaní	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
12	8	Grupo Operativo Oruro	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
13	9	Grupo Operativo Potosí	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
14	10	Grupo Operativo Sucre	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
15	11	Grupo Operativo Trinidad	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
16	12	Grupo Operativo Rurrenabaque	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
17	13	Grupo Operativo Cobija	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
18	14	Grupo Operativo Tarija	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
19	15	Grupo Operativo Yacuiba	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: parametro; Type: TABLE DATA; Schema: parametro; Owner: postgres
--

COPY parametro.parametro (id, codigo, nombre, grupo, descripcion, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	TD-CI	Cédula de identidad	TD	Cédula de Identidad	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	TD-CIE	Cédula de identidad de extranjero	TD	Cédula de identidad de extranjero	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	TAPP-B	Backend	TAPP	Backend	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	TAPP-F	Frontend	TAPP	Frontend	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	TACCF-R	read	TACCF	READ	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	TACCF-U	update	TACCF	UPDATE	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	TACCF-C	create	TACCF	CREATE	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	TACCF-D	delete	TACCF	DELETE	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	TACCB-G	GET	TACCB	GET	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	TACCB-U	UPDATE	TACCB	UPDATE	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
11	TACCF-P	PATCH	TACC	PATCH	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
12	TACCB-C	POST	TACCB	POST	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
13	TACCB-D	DELETE	TACCB	DELETE	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: unidad; Type: TABLE DATA; Schema: parametro; Owner: postgres
--

COPY parametro.unidad (id, abreviatura, descripcion, es_operativa_admin, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	DIRN	Dirección Nacional FELCN	f	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	UFLCN-LP	Unidad FELCN La Paz	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	UFLCN-CBBA	Unidad FELCN Cochabamba	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	UFLCN-SC	Unidad FELCN Santa Cruz	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	UFLCN-OR	Unidad FELCN Oruro	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	UFLCN-PT	Unidad FELCN Potosí	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	UFLCN-CH	Unidad FELCN Chuquisaca	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	UFLCN-BE	Unidad FELCN Beni	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	UFLCN-PD	Unidad FELCN Pando	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	UFLCN-TJ	Unidad FELCN Tarija	t	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: proyecto; Owner: postgres
--

COPY proyecto.migrations (id, "timestamp", name) FROM stdin;
1	1708999999999	Init1708999999999
2	1709000001000	CreateFelcnEstructura1709000001000
3	1709000002000	ExtendUsuarioFelcn1709000002000
4	1611171041790	usuario1611171041790
5	1611497480901	modulo1611497480901
6	1611498173795	rol1611498173795
7	1611516017924	usuarioRol1611516017924
8	1617712857472	insertCasbinRules1617712857472
9	1617820337609	insertsParametros1617820337609
10	1709000001000	grados1709000001000
11	1709000002000	estructuraOrganizacional1709000002000
12	1709000003000	casbinEstructura1709000003000
13	1709000004000	modulosEstructura1709000004000
\.


--
-- Data for Name: auditoria_cambio; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.auditoria_cambio (id, base_datos, schema_afectado, tabla_afectada, accion, contenido_anterior, contenido_actual, id_registro, usuario, id_usuario, fecha_hora) FROM stdin;
\.


--
-- Data for Name: bitacora_login; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.bitacora_login (id, id_usuario, usuario, ip_origen, user_agent, metodo_autenticacion, exitoso, motivo_fallo, session_id, dispositivo, fecha_hora) FROM stdin;
\.


--
-- Data for Name: casbin_rule; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.casbin_rule (id, ptype, v0, v1, v2, v3, v4, v5, v6) FROM stdin;
1	p	ADMINISTRADOR	/admin/usuarios	read|update|create|delete	frontend	\N	\N	\N
2	p	TECNICO	/admin/usuarios	read	frontend	\N	\N	\N
3	p	ADMINISTRADOR	/admin/parametros	read|update|create	frontend	\N	\N	\N
4	p	TECNICO	/admin/parametros	read	frontend	\N	\N	\N
5	p	ADMINISTRADOR	/admin/modulos	read|update|create	frontend	\N	\N	\N
6	p	ADMINISTRADOR	/admin/politicas	create|read|update|delete	frontend	\N	\N	\N
7	p	ADMINISTRADOR	/admin/perfil	read|update	frontend	\N	\N	\N
8	p	TECNICO	/admin/perfil	read|update	frontend	\N	\N	\N
9	p	USUARIO	/admin/perfil	read|update	frontend	\N	\N	\N
10	p	ADMINISTRADOR	/admin/home	read	frontend	\N	\N	\N
11	p	TECNICO	/admin/home	read	frontend	\N	\N	\N
12	p	USUARIO	/admin/home	read	frontend	\N	\N	\N
13	p	ADMINISTRADOR	/admin/roles	read|create|update|delete	frontend	\N	\N	\N
14	p	ADMINISTRADOR	/api/autorizacion/politicas	GET|POST|DELETE|PATCH	backend	\N	\N	\N
15	p	ADMINISTRADOR	/api/autorizacion/modulos	GET|POST|DELETE|PATCH	backend	\N	\N	\N
16	p	TECNICO	/api/autorizacion/modulos	GET	backend	\N	\N	\N
17	p	ADMINISTRADOR	/api/autorizacion/modulos/:id	PATCH	backend	\N	\N	\N
18	p	ADMINISTRADOR	/api/autorizacion/modulos/:id/activacion	GET|POST|DELETE|PATCH	backend	\N	\N	\N
19	p	ADMINISTRADOR	/api/autorizacion/modulos/:id/inactivacion	GET|POST|DELETE|PATCH	backend	\N	\N	\N
20	p	ADMINISTRADOR	/api/autorizacion/roles	GET|POST	backend	\N	\N	\N
21	p	TECNICO	/api/autorizacion/roles	GET	backend	\N	\N	\N
22	p	ADMINISTRADOR	/api/autorizacion/roles/todos	GET|POST	backend	\N	\N	\N
23	p	ADMINISTRADOR	/api/autorizacion/roles/:id	PATCH	backend	\N	\N	\N
24	p	ADMINISTRADOR	/api/autorizacion/roles/:id/activacion	PATCH	backend	\N	\N	\N
25	p	ADMINISTRADOR	/api/autorizacion/roles/:id/inactivacion	PATCH	backend	\N	\N	\N
26	p	ADMINISTRADOR	/api/usuarios	GET|POST	backend	\N	\N	\N
27	p	TECNICO	/api/usuarios	GET	backend	\N	\N	\N
28	p	ADMINISTRADOR	/api/usuarios/:id	PATCH|GET	backend	\N	\N	\N
29	p	ADMINISTRADOR	/api/usuarios/cuenta/ciudadania	POST	backend	\N	\N	\N
30	p	ADMINISTRADOR	/api/usuarios/:id/activacion	PATCH	backend	\N	\N	\N
31	p	ADMINISTRADOR	/api/usuarios/:id/inactivacion	PATCH	backend	\N	\N	\N
32	p	ADMINISTRADOR	/api/usuarios/:id/restauracion	PATCH	backend	\N	\N	\N
33	p	ADMINISTRADOR	/api/usuarios/:id/reenviar	PATCH	backend	\N	\N	\N
34	p	ADMINISTRADOR	/api/parametros	GET|POST	backend	\N	\N	\N
35	p	TECNICO	/api/parametros	GET|POST	backend	\N	\N	\N
36	p	ADMINISTRADOR	/api/parametros/:id	PATCH	backend	\N	\N	\N
37	p	ADMINISTRADOR	/api/parametros/:id/activacion	PATCH	backend	\N	\N	\N
38	p	ADMINISTRADOR	/api/parametros/:id/inactivacion	PATCH	backend	\N	\N	\N
39	p	*	/api/parametros/:grupo/listado	GET	backend	\N	\N	\N
40	p	*	/api/autorizacion/permisos	GET	backend	\N	\N	\N
41	p	*	/api/usuarios/cuenta/perfil	GET|PATCH	backend	\N	\N	\N
42	p	*	/api/usuarios/cuenta/foto	PATCH	backend	\N	\N	\N
43	p	*	/api/usuarios/cuenta/contrasena	PATCH	backend	\N	\N	\N
44	p	ADMINISTRADOR	/admin/estructura/grados	read|create|update	frontend	\N	\N	\N
45	p	TECNICO	/admin/estructura/grados	read	frontend	\N	\N	\N
46	p	ADMINISTRADOR	/admin/estructura/unidades	read|create|update	frontend	\N	\N	\N
47	p	TECNICO	/admin/estructura/unidades	read	frontend	\N	\N	\N
48	p	ADMINISTRADOR	/admin/estructura/distritales	read|create|update	frontend	\N	\N	\N
49	p	TECNICO	/admin/estructura/distritales	read	frontend	\N	\N	\N
50	p	ADMINISTRADOR	/admin/estructura/grupos	read|create|update	frontend	\N	\N	\N
51	p	TECNICO	/admin/estructura/grupos	read	frontend	\N	\N	\N
52	p	ADMINISTRADOR	/api/estructura/grados	GET|POST	backend	\N	\N	\N
53	p	TECNICO	/api/estructura/grados	GET	backend	\N	\N	\N
54	p	*	/api/estructura/grados/listado	GET	backend	\N	\N	\N
55	p	ADMINISTRADOR	/api/estructura/grados/:id	PATCH	backend	\N	\N	\N
56	p	ADMINISTRADOR	/api/estructura/grados/:id/activacion	PATCH	backend	\N	\N	\N
57	p	ADMINISTRADOR	/api/estructura/grados/:id/inactivacion	PATCH	backend	\N	\N	\N
58	p	ADMINISTRADOR	/api/estructura/unidades	GET|POST	backend	\N	\N	\N
59	p	TECNICO	/api/estructura/unidades	GET	backend	\N	\N	\N
60	p	*	/api/estructura/unidades/listado	GET	backend	\N	\N	\N
61	p	ADMINISTRADOR	/api/estructura/unidades/:id	PATCH	backend	\N	\N	\N
62	p	ADMINISTRADOR	/api/estructura/unidades/:id/activacion	PATCH	backend	\N	\N	\N
63	p	ADMINISTRADOR	/api/estructura/unidades/:id/inactivacion	PATCH	backend	\N	\N	\N
64	p	ADMINISTRADOR	/api/estructura/distritales	GET|POST	backend	\N	\N	\N
65	p	TECNICO	/api/estructura/distritales	GET	backend	\N	\N	\N
66	p	*	/api/estructura/distritales/listado	GET	backend	\N	\N	\N
67	p	ADMINISTRADOR	/api/estructura/distritales/:id	PATCH	backend	\N	\N	\N
68	p	ADMINISTRADOR	/api/estructura/distritales/:id/activacion	PATCH	backend	\N	\N	\N
69	p	ADMINISTRADOR	/api/estructura/distritales/:id/inactivacion	PATCH	backend	\N	\N	\N
70	p	ADMINISTRADOR	/api/estructura/grupos	GET|POST	backend	\N	\N	\N
71	p	TECNICO	/api/estructura/grupos	GET	backend	\N	\N	\N
72	p	*	/api/estructura/grupos/listado	GET	backend	\N	\N	\N
73	p	ADMINISTRADOR	/api/estructura/grupos/:id	PATCH	backend	\N	\N	\N
74	p	ADMINISTRADOR	/api/estructura/grupos/:id/activacion	PATCH	backend	\N	\N	\N
75	p	ADMINISTRADOR	/api/estructura/grupos/:id/inactivacion	PATCH	backend	\N	\N	\N
\.


--
-- Data for Name: modulo; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.modulo (id, label, url, nombre, propiedades, id_modulo, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	Principal	/principal	Principal	{"orden": 1, "descripcion": "Sección principal"}	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	Inicio	/admin/home	inicio	{"icono": "home", "orden": 1, "descripcion": "Vista de bienvenida con características del sistema"}	1	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	Perfil	/admin/perfil	perfil	{"icono": "person", "orden": 2, "descripcion": "Información del perfil de usuario que inicio sesión"}	1	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	Configuración	/configuraciones	configuraciones	{"orden": 2, "descripcion": "Sección de configuraciones"}	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
5	Usuarios	/admin/usuarios	usuarios	{"icono": "manage_accounts", "orden": 1, "descripcion": "Control de usuarios del sistema"}	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
6	Parámetros	/admin/parametros	parametros	{"icono": "tune", "orden": 2, "descripcion": "Parámetros generales del sistema"}	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
7	Módulos	/admin/modulos	modulos	{"icono": "widgets", "orden": 3, "descripcion": "Gestión de módulos"}	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
8	Políticas	/admin/politicas	politicas	{"icono": "verified_user", "orden": 4, "descripcion": "Control de permisos para los usuarios"}	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
9	Roles	/admin/roles	rol	{"icono": "admin_panel_settings", "orden": 5, "descripcion": "Control de roles para los usuarios"}	4	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
10	Estructura	/estructura	estructura	{"orden": 3, "descripcion": "Sección de estructura organizacional FELCN"}	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
11	Grados	/admin/estructura/grados	grados	{"icono": "military_tech", "orden": 1, "descripcion": "Gestión de grados militares y policiales"}	10	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
12	Unidades	/admin/estructura/unidades	unidades	{"icono": "account_tree", "orden": 2, "descripcion": "Gestión de unidades regionales FELCN"}	10	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
13	Distritales	/admin/estructura/distritales	distritales	{"icono": "location_on", "orden": 3, "descripcion": "Gestión de distritales por unidad"}	10	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
14	Grupos	/admin/estructura/grupos	grupos	{"icono": "groups", "orden": 4, "descripcion": "Gestión de grupos operacionales"}	10	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: persona; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.persona (id, uuid_ciudadano, nombres, primer_apellido, segundo_apellido, tipo_documento, tipo_documento_otro, nro_documento, fecha_nacimiento, telefono, genero, observacion, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	\N	YASMIN	RODRIGUEZ	ROMERO	CI	\N	9270815	2001-12-16	\N	F	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	\N	ALBANO	ROJAS	AGUADA	CI	\N	1765251	1967-05-28	\N	M	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	\N	JESUS	ROJAS	ZABALA	CI	\N	6114767	2009-02-28	\N	M	\N	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: refresh_token; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.refresh_token (id, grant_id, iat, expires_at, is_revoked, data) FROM stdin;
\.


--
-- Data for Name: rol; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.rol (id, rol, nombre, descripcion, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	ADMINISTRADOR	Administrador	Responsable de la gestión y supervisión general del sistema.	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	TECNICO	Técnico	Responsable de herramientas y funciones específicas del sistema.	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	USUARIO	Usuario	Individuo que utiliza el sistema.	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.session (id, expired_at, json, destroyed_at) FROM stdin;
\.


--
-- Data for Name: usuario; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.usuario (id, usuario, contrasena, ciudadania_digital, correo_electronico, intentos, codigo_desbloqueo, codigo_recuperacion, codigo_transaccion, codigo_activacion, fecha_bloqueo, url_foto, nombre_app, telefono_celular, telefono_corporativo, id_grado, id_grupo, id_persona, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
2	ADMINISTRADOR-TECNICO	$2b$15$1WZclTx7DI46bJLR8iAXHeotCLtI9gA18EYeULggKBJ1JTxWm8mCC	f	agepic-1765251@yopmail.com	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	TECNICO	$2b$15$1WZclTx7DI46bJLR8iAXHeotCLtI9gA18EYeULggKBJ1JTxWm8mCC	f	agepic-6114767@yopmail.com	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	3	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
1	ADMINISTRADOR	$2b$15$XDM.gyMxeumSpk8n0L9xT./EEpzmF99Zl29zmgtwqiK.QW9D07jUS	f	agepic-9270815@yopmail.com	0	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	1	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	2026-02-28 22:24:36.971764
\.


--
-- Data for Name: usuario_rol; Type: TABLE DATA; Schema: usuario; Owner: postgres
--

COPY usuario.usuario_rol (id, id_rol, id_usuario, _estado, _transaccion, _usuario_creacion, _fecha_creacion, _usuario_modificacion, _fecha_modificacion) FROM stdin;
1	1	1	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
2	1	2	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
3	2	2	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
4	2	3	ACTIVO	SEEDS	1	2026-02-28 22:15:09.481256	\N	\N
\.


--
-- Name: distrital_id_seq; Type: SEQUENCE SET; Schema: parametro; Owner: postgres
--

SELECT pg_catalog.setval('parametro.distrital_id_seq', 15, true);


--
-- Name: grado_id_seq; Type: SEQUENCE SET; Schema: parametro; Owner: postgres
--

SELECT pg_catalog.setval('parametro.grado_id_seq', 12, true);


--
-- Name: grupo_id_seq; Type: SEQUENCE SET; Schema: parametro; Owner: postgres
--

SELECT pg_catalog.setval('parametro.grupo_id_seq', 19, true);


--
-- Name: parametro_id_seq; Type: SEQUENCE SET; Schema: parametro; Owner: postgres
--

SELECT pg_catalog.setval('parametro.parametro_id_seq', 13, true);


--
-- Name: unidad_id_seq; Type: SEQUENCE SET; Schema: parametro; Owner: postgres
--

SELECT pg_catalog.setval('parametro.unidad_id_seq', 10, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: proyecto; Owner: postgres
--

SELECT pg_catalog.setval('proyecto.migrations_id_seq', 13, true);


--
-- Name: auditoria_cambio_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.auditoria_cambio_id_seq', 1, false);


--
-- Name: bitacora_login_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.bitacora_login_id_seq', 1, false);


--
-- Name: casbin_rule_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.casbin_rule_id_seq', 75, true);


--
-- Name: modulo_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.modulo_id_seq', 14, true);


--
-- Name: persona_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.persona_id_seq', 3, true);


--
-- Name: rol_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.rol_id_seq', 3, true);


--
-- Name: usuario_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.usuario_id_seq', 3, true);


--
-- Name: usuario_rol_id_seq; Type: SEQUENCE SET; Schema: usuario; Owner: postgres
--

SELECT pg_catalog.setval('usuario.usuario_rol_id_seq', 4, true);


--
-- Name: distrital distrital_pkey; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.distrital
    ADD CONSTRAINT distrital_pkey PRIMARY KEY (id);


--
-- Name: grado grado_pkey; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.grado
    ADD CONSTRAINT grado_pkey PRIMARY KEY (id);


--
-- Name: grupo grupo_pkey; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.grupo
    ADD CONSTRAINT grupo_pkey PRIMARY KEY (id);


--
-- Name: parametro parametro_codigo_key; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.parametro
    ADD CONSTRAINT parametro_codigo_key UNIQUE (codigo);


--
-- Name: parametro parametro_pkey; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.parametro
    ADD CONSTRAINT parametro_pkey PRIMARY KEY (id);


--
-- Name: unidad unidad_pkey; Type: CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.unidad
    ADD CONSTRAINT unidad_pkey PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: proyecto; Owner: postgres
--

ALTER TABLE ONLY proyecto.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: auditoria_cambio auditoria_cambio_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.auditoria_cambio
    ADD CONSTRAINT auditoria_cambio_pkey PRIMARY KEY (id);


--
-- Name: bitacora_login bitacora_login_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.bitacora_login
    ADD CONSTRAINT bitacora_login_pkey PRIMARY KEY (id);


--
-- Name: casbin_rule casbin_rule_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.casbin_rule
    ADD CONSTRAINT casbin_rule_pkey PRIMARY KEY (id);


--
-- Name: modulo modulo_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.modulo
    ADD CONSTRAINT modulo_pkey PRIMARY KEY (id);


--
-- Name: modulo modulo_url_key; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.modulo
    ADD CONSTRAINT modulo_url_key UNIQUE (url);


--
-- Name: persona persona_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.persona
    ADD CONSTRAINT persona_pkey PRIMARY KEY (id);


--
-- Name: persona persona_uuid_ciudadano_key; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.persona
    ADD CONSTRAINT persona_uuid_ciudadano_key UNIQUE (uuid_ciudadano);


--
-- Name: refresh_token refresh_token_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.refresh_token
    ADD CONSTRAINT refresh_token_pkey PRIMARY KEY (id);


--
-- Name: rol rol_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.rol
    ADD CONSTRAINT rol_pkey PRIMARY KEY (id);


--
-- Name: rol rol_rol_key; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.rol
    ADD CONSTRAINT rol_rol_key UNIQUE (rol);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: usuario_rol usuario_rol_pkey; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario_rol
    ADD CONSTRAINT usuario_rol_pkey PRIMARY KEY (id);


--
-- Name: usuario usuario_usuario_key; Type: CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario
    ADD CONSTRAINT usuario_usuario_key UNIQUE (usuario);


--
-- Name: idx_distrital_id_unidad; Type: INDEX; Schema: parametro; Owner: postgres
--

CREATE INDEX idx_distrital_id_unidad ON parametro.distrital USING btree (id_unidad);


--
-- Name: idx_grupo_id_distrital; Type: INDEX; Schema: parametro; Owner: postgres
--

CREATE INDEX idx_grupo_id_distrital ON parametro.grupo USING btree (id_distrital);


--
-- Name: idx_auditoria_cambio_base_datos; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_auditoria_cambio_base_datos ON usuario.auditoria_cambio USING btree (base_datos);


--
-- Name: idx_auditoria_cambio_fecha_hora; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_auditoria_cambio_fecha_hora ON usuario.auditoria_cambio USING btree (fecha_hora);


--
-- Name: idx_auditoria_cambio_schema_afectado; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_auditoria_cambio_schema_afectado ON usuario.auditoria_cambio USING btree (schema_afectado);


--
-- Name: idx_auditoria_cambio_tabla_afectada; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_auditoria_cambio_tabla_afectada ON usuario.auditoria_cambio USING btree (tabla_afectada);


--
-- Name: idx_auditoria_cambio_usuario; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_auditoria_cambio_usuario ON usuario.auditoria_cambio USING btree (usuario);


--
-- Name: idx_bitacora_login_fecha_hora; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_bitacora_login_fecha_hora ON usuario.bitacora_login USING btree (fecha_hora);


--
-- Name: idx_bitacora_login_id_usuario; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_bitacora_login_id_usuario ON usuario.bitacora_login USING btree (id_usuario);


--
-- Name: idx_bitacora_login_ip_origen; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_bitacora_login_ip_origen ON usuario.bitacora_login USING btree (ip_origen);


--
-- Name: idx_session_expired_at; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_session_expired_at ON usuario.session USING btree (expired_at);


--
-- Name: idx_usuario_codigo_activacion; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_codigo_activacion ON usuario.usuario USING btree (codigo_activacion);


--
-- Name: idx_usuario_codigo_desbloqueo; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_codigo_desbloqueo ON usuario.usuario USING btree (codigo_desbloqueo);


--
-- Name: idx_usuario_codigo_recuperacion; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_codigo_recuperacion ON usuario.usuario USING btree (codigo_recuperacion);


--
-- Name: idx_usuario_codigo_transaccion; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_codigo_transaccion ON usuario.usuario USING btree (codigo_transaccion);


--
-- Name: idx_usuario_id_grado; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_id_grado ON usuario.usuario USING btree (id_grado);


--
-- Name: idx_usuario_id_grupo_org; Type: INDEX; Schema: usuario; Owner: postgres
--

CREATE INDEX idx_usuario_id_grupo_org ON usuario.usuario USING btree (id_grupo);


--
-- Name: distrital fk_distrital_unidad; Type: FK CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.distrital
    ADD CONSTRAINT fk_distrital_unidad FOREIGN KEY (id_unidad) REFERENCES parametro.unidad(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: grupo fk_grupo_distrital; Type: FK CONSTRAINT; Schema: parametro; Owner: postgres
--

ALTER TABLE ONLY parametro.grupo
    ADD CONSTRAINT fk_grupo_distrital FOREIGN KEY (id_distrital) REFERENCES parametro.distrital(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: modulo fk_modulo_modulo_padre; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.modulo
    ADD CONSTRAINT fk_modulo_modulo_padre FOREIGN KEY (id_modulo) REFERENCES usuario.modulo(id);


--
-- Name: usuario fk_usuario_grado; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario
    ADD CONSTRAINT fk_usuario_grado FOREIGN KEY (id_grado) REFERENCES parametro.grado(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: usuario fk_usuario_grupo; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario
    ADD CONSTRAINT fk_usuario_grupo FOREIGN KEY (id_grupo) REFERENCES parametro.grupo(id);


--
-- Name: usuario fk_usuario_persona; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario
    ADD CONSTRAINT fk_usuario_persona FOREIGN KEY (id_persona) REFERENCES usuario.persona(id);


--
-- Name: usuario_rol fk_usuario_rol_rol; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario_rol
    ADD CONSTRAINT fk_usuario_rol_rol FOREIGN KEY (id_rol) REFERENCES usuario.rol(id);


--
-- Name: usuario_rol fk_usuario_rol_usuario; Type: FK CONSTRAINT; Schema: usuario; Owner: postgres
--

ALTER TABLE ONLY usuario.usuario_rol
    ADD CONSTRAINT fk_usuario_rol_usuario FOREIGN KEY (id_usuario) REFERENCES usuario.usuario(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict hKDDWnMPFvJhzo7nNxRjQw2Nr5vnvLz7RkAkZzy9q633wanUc5vPK2m3bRhAXe6

