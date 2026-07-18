--
-- PostgreSQL database dump
--

\restrict UY3jbo2VmMlB8BtNMpXhDyyQz59o9liN0fmIuYnvXNxCztQxtp9KTEqMdLozjkf

-- Dumped from database version 17.10 (Debian 17.10-0+deb13u1)
-- Dumped by pg_dump version 17.10 (Debian 17.10-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: parametricas; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA parametricas;


ALTER SCHEMA parametricas OWNER TO postgres;

--
-- Name: postgres_fdw; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgres_fdw WITH SCHEMA public;


--
-- Name: EXTENSION postgres_fdw; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgres_fdw IS 'foreign-data wrapper for remote PostgreSQL servers';


--
-- Name: fn_persona_color_rojo(character varying); Type: FUNCTION; Schema: parametricas; Owner: postgres
--

CREATE FUNCTION parametricas.fn_persona_color_rojo(p_numero_documento character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_existe boolean;
BEGIN

    SELECT EXISTS (
        SELECT 1
        FROM public.blanco b
        WHERE b.numero_documento = p_numero_documento
    )
    INTO v_existe;

    RETURN v_existe;

END;
$$;


ALTER FUNCTION parametricas.fn_persona_color_rojo(p_numero_documento character varying) OWNER TO postgres;

--
-- Name: fn_vehiculo_color_rojo(character varying); Type: FUNCTION; Schema: parametricas; Owner: postgres
--

CREATE FUNCTION parametricas.fn_vehiculo_color_rojo(p_numero_matricula character varying) RETURNS boolean
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_existe boolean;
BEGIN

    SELECT EXISTS (
        SELECT 1
        FROM public.item_bien_caracteristica ic
        WHERE ic.id_catalogo_caracteristica IN (4, 9) --PLACA, CP
			AND UPPER(ic.descripcion) = UPPER(p_numero_matricula)
    )
    INTO v_existe;

    RETURN v_existe;

END;
$$;


ALTER FUNCTION parametricas.fn_vehiculo_color_rojo(p_numero_matricula character varying) OWNER TO postgres;

--
-- Name: fn_auditoria_before_insert(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_auditoria_before_insert() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_usuario varchar(50);
BEGIN
  -- Leer nombre de usuario fijado por el interceptor de la API
  BEGIN
    v_usuario := nullif(trim(current_setting('app.usuario_nombre', true)), '');
  EXCEPTION WHEN OTHERS THEN
    v_usuario := NULL;
  END;

  -- Si la API no fijó el nombre, usar el usuario PostgreSQL de la conexión actual
  v_usuario := COALESCE(v_usuario, current_user);

  NEW._fecha_creacion   := NOW();
  NEW._estado           := COALESCE(NULLIF(NEW._estado, ''),      'ACTIVO');
  NEW._transaccion      := COALESCE(NULLIF(NEW._transaccion, ''), 'CREAR');
  NEW._usuario_creacion := v_usuario;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_auditoria_before_insert() OWNER TO postgres;

--
-- Name: fn_auditoria_before_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fn_auditoria_before_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  v_usuario varchar(50);
BEGIN
  BEGIN
    v_usuario := nullif(trim(current_setting('app.usuario_nombre', true)), '');
  EXCEPTION WHEN OTHERS THEN
    v_usuario := NULL;
  END;

  v_usuario := COALESCE(v_usuario, current_user);

  NEW._fecha_modificacion   := NOW();
  NEW._transaccion          := 'ACTUALIZAR';
  NEW._usuario_modificacion := v_usuario;

  -- Preservar campos de creación (nunca se sobreescriben en un UPDATE)
  NEW._fecha_creacion   := OLD._fecha_creacion;
  NEW._usuario_creacion := OLD._usuario_creacion;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.fn_auditoria_before_update() OWNER TO postgres;

--
-- Name: siii_param_remoto; Type: SERVER; Schema: -; Owner: postgres
--

CREATE SERVER siii_param_remoto FOREIGN DATA WRAPPER postgres_fdw OPTIONS (
    dbname 'f_siii',
    host '72.60.156.246',
    port '5432'
);


ALTER SERVER siii_param_remoto OWNER TO postgres;

--
-- Name: USER MAPPING postgres SERVER siii_param_remoto; Type: USER MAPPING; Schema: -; Owner: postgres
--

CREATE USER MAPPING FOR postgres SERVER siii_param_remoto OPTIONS (
    password 'Mdft6106209',
    "user" 'postgres'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bien; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.bien (
    id_bien integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    archivo character varying(150),
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.bien OWNER TO postgres;

--
-- Name: bienes_id_bien_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.bien ALTER COLUMN id_bien ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.bienes_id_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: catalogo_caracteristica; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.catalogo_caracteristica (
    id_catalogo_caracteristica integer NOT NULL,
    id_catalogo_clase integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.catalogo_caracteristica OWNER TO postgres;

--
-- Name: catalogo_clase; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.catalogo_clase (
    id_catalogo_clase integer NOT NULL,
    id_bien integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    es_fungible boolean NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.catalogo_clase OWNER TO postgres;

--
-- Name: catalogo_tipo; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.catalogo_tipo (
    id_catalogo_tipo integer NOT NULL,
    id_catalogo_clase integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.catalogo_tipo OWNER TO postgres;

--
-- Name: color; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.color (
    id_color smallint NOT NULL,
    descripcion character varying(50) NOT NULL,
    color character varying(15) NOT NULL,
    hexadecimal character varying(10) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.color OWNER TO postgres;

--
-- Name: color_id_color_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.color ALTER COLUMN id_color ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME parametricas.color_id_color_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: contenido_caso; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.contenido_caso (
    id_contenido_caso bigint NOT NULL,
    descripcion character varying(100) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.contenido_caso OWNER TO postgres;

--
-- Name: contenido_caso_id_contenido_caso_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.contenido_caso ALTER COLUMN id_contenido_caso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.contenido_caso_id_contenido_caso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: continente; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.continente (
    id_continente integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.continente OWNER TO postgres;

--
-- Name: continente_id_continente_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.continente ALTER COLUMN id_continente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.continente_id_continente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: estado_caso; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.estado_caso (
    id_estado_caso integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.estado_caso OWNER TO postgres;

--
-- Name: estado_caso_id_estado_caso_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.estado_caso ALTER COLUMN id_estado_caso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.estado_caso_id_estado_caso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: etapa_investigacion; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.etapa_investigacion (
    id_etapa_investigacion bigint NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.etapa_investigacion OWNER TO postgres;

--
-- Name: etapa_investigacion_id_etapa_investigacion_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.etapa_investigacion ALTER COLUMN id_etapa_investigacion ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME parametricas.etapa_investigacion_id_etapa_investigacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pais; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.pais (
    id_pais integer NOT NULL,
    id_continente integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.pais OWNER TO postgres;

--
-- Name: pais_id_pais_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.pais ALTER COLUMN id_pais ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.pais_id_pais_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: regla_color; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.regla_color (
    id_regla_color smallint NOT NULL,
    id_color smallint NOT NULL,
    persona_database character varying(30),
    persona_funcion character varying(30),
    vehiculo_database character varying(30),
    vehiculo_funcion character varying(30),
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.regla_color OWNER TO postgres;

--
-- Name: regla_color_id_regla_color_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.regla_color ALTER COLUMN id_regla_color ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.regla_color_id_regla_color_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_activo; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.tipo_activo (
    id_tipo_activo smallint NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.tipo_activo OWNER TO postgres;

--
-- Name: tipo_activo_id_tipo_activo_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.tipo_activo ALTER COLUMN id_tipo_activo ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME parametricas.tipo_activo_id_tipo_activo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_delito; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.tipo_delito (
    id_tipo_delito bigint NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.tipo_delito OWNER TO postgres;

--
-- Name: tipo_delito_id_tipo_delito_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.tipo_delito ALTER COLUMN id_tipo_delito ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME parametricas.tipo_delito_id_tipo_delito_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_investigacion_bien; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.tipo_investigacion_bien (
    id_tipo_investigacion_bien integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.tipo_investigacion_bien OWNER TO postgres;

--
-- Name: tipo_investigacion_bien_id_tipo_investigacion_bien_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.tipo_investigacion_bien ALTER COLUMN id_tipo_investigacion_bien ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.tipo_investigacion_bien_id_tipo_investigacion_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tipo_organizacion; Type: TABLE; Schema: parametricas; Owner: postgres
--

CREATE TABLE parametricas.tipo_organizacion (
    id_tipo_organizacion integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE parametricas.tipo_organizacion OWNER TO postgres;

--
-- Name: tipo_organizacion_id_tipo_organizacion_seq; Type: SEQUENCE; Schema: parametricas; Owner: postgres
--

ALTER TABLE parametricas.tipo_organizacion ALTER COLUMN id_tipo_organizacion ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME parametricas.tipo_organizacion_id_tipo_organizacion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: activo_patrimonial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activo_patrimonial (
    id_activo_patrimonial bigint NOT NULL,
    id_blanco bigint NOT NULL,
    id_tipo_activo smallint NOT NULL,
    gestion character varying(4) NOT NULL,
    contenido text NOT NULL,
    archivo bytea NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.activo_patrimonial OWNER TO postgres;

--
-- Name: activo_patrimonial_id_activo_patrimonial_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.activo_patrimonial ALTER COLUMN id_activo_patrimonial ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.activo_patrimonial_id_activo_patrimonial_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: antecedente_blanco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedente_blanco (
    id_antecedente bigint NOT NULL,
    id_blanco bigint NOT NULL,
    id_tipo_delito integer NOT NULL,
    id_pais integer NOT NULL,
    lugar_hecho character varying(100) NOT NULL,
    nro_caso character varying(20) NOT NULL,
    fecha_hecho timestamp(6) without time zone NOT NULL,
    hecho text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.antecedente_blanco OWNER TO postgres;

--
-- Name: antecedente_blanco_id_antecedente_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedente_blanco_id_antecedente_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedente_blanco_id_antecedente_seq OWNER TO postgres;

--
-- Name: antecedente_blanco_id_antecedente_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedente_blanco_id_antecedente_seq OWNED BY public.antecedente_blanco.id_antecedente;


--
-- Name: antecedente_blanco_id_antecedente_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedente_blanco_id_antecedente_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedente_blanco_id_antecedente_seq1 OWNER TO postgres;

--
-- Name: antecedente_blanco_id_antecedente_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedente_blanco_id_antecedente_seq1 OWNED BY public.antecedente_blanco.id_antecedente;


--
-- Name: antecedente_blanco_id_antecedente_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.antecedente_blanco ALTER COLUMN id_antecedente ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.antecedente_blanco_id_antecedente_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: archivos_bien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos_bien (
    id_archivo_bien bigint NOT NULL,
    id_item_bien_secundario bigint NOT NULL,
    id_contenido_caso bigint NOT NULL,
    tipo character varying(15) NOT NULL,
    nombre character varying(150) NOT NULL,
    nombre_archivo character varying(150) NOT NULL,
    data bytea NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.archivos_bien OWNER TO postgres;

--
-- Name: archivos_bien_id_archivo_bien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_bien_id_archivo_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_bien_id_archivo_bien_seq OWNER TO postgres;

--
-- Name: archivos_bien_id_archivo_bien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_bien_id_archivo_bien_seq OWNED BY public.archivos_bien.id_archivo_bien;


--
-- Name: archivos_bien_id_archivo_bien_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.archivos_bien ALTER COLUMN id_archivo_bien ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.archivos_bien_id_archivo_bien_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: archivos_bienes_id_archivo_bien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_bienes_id_archivo_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_bienes_id_archivo_bien_seq OWNER TO postgres;

--
-- Name: archivos_bienes_id_archivo_bien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_bienes_id_archivo_bien_seq OWNED BY public.archivos_bien.id_archivo_bien;


--
-- Name: archivos_blanco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos_blanco (
    id_archivo bigint NOT NULL,
    id_blanco bigint NOT NULL,
    id_contenido_caso bigint NOT NULL,
    tipo character varying(15) NOT NULL,
    nombre character varying(150) NOT NULL,
    nombre_archivo character varying(150) NOT NULL,
    data bytea NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.archivos_blanco OWNER TO postgres;

--
-- Name: archivos_blanco_id_archivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_blanco_id_archivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_blanco_id_archivo_seq OWNER TO postgres;

--
-- Name: archivos_blanco_id_archivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_blanco_id_archivo_seq OWNED BY public.archivos_blanco.id_archivo;


--
-- Name: archivos_blanco_id_archivo_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_blanco_id_archivo_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_blanco_id_archivo_seq1 OWNER TO postgres;

--
-- Name: archivos_blanco_id_archivo_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_blanco_id_archivo_seq1 OWNED BY public.archivos_blanco.id_archivo;


--
-- Name: archivos_blanco_id_archivo_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.archivos_blanco ALTER COLUMN id_archivo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.archivos_blanco_id_archivo_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: archivos_organizacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.archivos_organizacion (
    id_archivo bigint NOT NULL,
    id_empresa bigint NOT NULL,
    id_contenido_caso bigint NOT NULL,
    tipo character varying(15) NOT NULL,
    nombre character varying(150) NOT NULL,
    nombre_archivo character varying(150) NOT NULL,
    data bytea NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.archivos_organizacion OWNER TO postgres;

--
-- Name: archivos_organizacion_id_archivo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_organizacion_id_archivo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_organizacion_id_archivo_seq OWNER TO postgres;

--
-- Name: archivos_organizacion_id_archivo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_organizacion_id_archivo_seq OWNED BY public.archivos_organizacion.id_archivo;


--
-- Name: archivos_organizacion_id_archivo_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.archivos_organizacion_id_archivo_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.archivos_organizacion_id_archivo_seq1 OWNER TO postgres;

--
-- Name: archivos_organizacion_id_archivo_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.archivos_organizacion_id_archivo_seq1 OWNED BY public.archivos_organizacion.id_archivo;


--
-- Name: archivos_organizacion_id_archivo_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.archivos_organizacion ALTER COLUMN id_archivo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.archivos_organizacion_id_archivo_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: asignacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.asignacion (
    id_caso bigint NOT NULL,
    id_pais integer NOT NULL,
    lugar character varying(50) NOT NULL,
    nombre_caso character varying(50) NOT NULL,
    palabra_clave character varying(20) NOT NULL,
    id_estado_caso integer NOT NULL,
    nro_caso_cer character varying(20) NOT NULL,
    id_etapa_investigacion integer NOT NULL,
    fecha_inicio timestamp(6) without time zone NOT NULL,
    antecedentes text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.asignacion OWNER TO postgres;

--
-- Name: asignacion_id_caso_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asignacion_id_caso_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignacion_id_caso_seq OWNER TO postgres;

--
-- Name: asignacion_id_caso_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asignacion_id_caso_seq OWNED BY public.asignacion.id_caso;


--
-- Name: asignacion_id_caso_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.asignacion_id_caso_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.asignacion_id_caso_seq1 OWNER TO postgres;

--
-- Name: asignacion_id_caso_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.asignacion_id_caso_seq1 OWNED BY public.asignacion.id_caso;


--
-- Name: asignacion_id_caso_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.asignacion ALTER COLUMN id_caso ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.asignacion_id_caso_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: blanco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blanco (
    id_blanco bigint NOT NULL,
    id_caso bigint NOT NULL,
    de_nombres character varying(75) NOT NULL,
    de_paterno character varying(50) NOT NULL,
    de_materno character varying(50) NOT NULL,
    de_esposo character varying(50) NOT NULL,
    id_pais integer NOT NULL,
    alias character varying(20) NOT NULL,
    foto bytea,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone,
    numero_documento character varying(20) NOT NULL
);


ALTER TABLE public.blanco OWNER TO postgres;

--
-- Name: blanco_id_blanco_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blanco_id_blanco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blanco_id_blanco_seq OWNER TO postgres;

--
-- Name: blanco_id_blanco_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blanco_id_blanco_seq OWNED BY public.blanco.id_blanco;


--
-- Name: blanco_id_blanco_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.blanco ALTER COLUMN id_blanco ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.blanco_id_blanco_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: blancos_id_blanco_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blancos_id_blanco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blancos_id_blanco_seq OWNER TO postgres;

--
-- Name: blancos_id_blanco_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blancos_id_blanco_seq OWNED BY public.blanco.id_blanco;


--
-- Name: conductor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.conductor (
    numero_documento character varying(10) NOT NULL,
    nombres character varying(75) NOT NULL,
    paterno character varying(50) NOT NULL,
    materno character varying(50) NOT NULL,
    esposo character varying(50) NOT NULL,
    id_pais integer NOT NULL,
    sexo character varying(1) NOT NULL,
    ocupacion character varying(50) NOT NULL,
    direccion character varying(150) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.conductor OWNER TO postgres;

--
-- Name: empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.empresa (
    id_empresa bigint NOT NULL,
    id_caso bigint NOT NULL,
    id_tipo_organizacion integer NOT NULL,
    nombre character varying(100) NOT NULL,
    nit character varying(30) NOT NULL,
    matricula character varying(30) NOT NULL,
    representante character varying(100) NOT NULL,
    observaciones text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.empresa OWNER TO postgres;

--
-- Name: empresa_id_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresa_id_empresa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresa_id_empresa_seq OWNER TO postgres;

--
-- Name: empresa_id_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresa_id_empresa_seq OWNED BY public.empresa.id_empresa;


--
-- Name: empresa_id_empresa_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.empresa ALTER COLUMN id_empresa ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.empresa_id_empresa_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: empresas_id_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.empresas_id_empresa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.empresas_id_empresa_seq OWNER TO postgres;

--
-- Name: empresas_id_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.empresas_id_empresa_seq OWNED BY public.empresa.id_empresa;


--
-- Name: flujo_fiscalia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flujo_fiscalia (
    id_flujo_fiscalia bigint NOT NULL,
    id_flujo bigint NOT NULL,
    servicio character varying(15) NOT NULL,
    registro character varying(50) NOT NULL,
    numero_a character varying(15) NOT NULL,
    imei_a character varying(50) NOT NULL,
    rbs_a character varying(25) NOT NULL,
    celda_a character varying(10) NOT NULL,
    lat_a double precision NOT NULL,
    lon_a double precision NOT NULL,
    numero_b character varying(15) NOT NULL,
    titular character varying(80) NOT NULL,
    imei_b character varying(50) NOT NULL,
    rbs_b character varying(25) NOT NULL,
    celda_b character varying(10) NOT NULL,
    lat_b double precision NOT NULL,
    lon_b double precision NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    duracion character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.flujo_fiscalia OWNER TO postgres;

--
-- Name: flujo_fiscalia_id_flujo_fiscalia_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.flujo_fiscalia ALTER COLUMN id_flujo_fiscalia ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flujo_fiscalia_id_flujo_fiscalia_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: flujo_telefonico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flujo_telefonico (
    id_flujo bigint NOT NULL,
    id_blanco bigint NOT NULL,
    empresa character varying(15) NOT NULL,
    direccion character varying(50) NOT NULL,
    numero character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.flujo_telefonico OWNER TO postgres;

--
-- Name: flujo_telefonico_id_flujo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.flujo_telefonico ALTER COLUMN id_flujo ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flujo_telefonico_id_flujo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: flujo_transporte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flujo_transporte (
    id_flujo_transporte bigint NOT NULL,
    codigo_transporte character varying(10) NOT NULL,
    numero_documento character varying(10) NOT NULL,
    id_lugar smallint NOT NULL,
    origen character varying(50) NOT NULL,
    destino character varying(50) NOT NULL,
    carga character varying(30) NOT NULL,
    fecha_hora timestamp without time zone NOT NULL,
    id_color smallint NOT NULL,
    latitud double precision NOT NULL,
    longitud double precision NOT NULL,
    fecha_hora_ingreso timestamp without time zone NOT NULL,
    usuario character(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.flujo_transporte OWNER TO postgres;

--
-- Name: flujo_transporte_id_flujo_transporte_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.flujo_transporte ALTER COLUMN id_flujo_transporte ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.flujo_transporte_id_flujo_transporte_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: item_bien_caracteristica; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_bien_caracteristica (
    id_item_bien_caracteristica integer NOT NULL,
    id_item_bien_secundario bigint NOT NULL,
    id_catalogo_caracteristica integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.item_bien_caracteristica OWNER TO postgres;

--
-- Name: item_bien_caracteristica_id_item_bien_caracteristica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_bien_caracteristica_id_item_bien_caracteristica_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.item_bien_caracteristica_id_item_bien_caracteristica_seq OWNER TO postgres;

--
-- Name: item_bien_caracteristica_id_item_bien_caracteristica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_bien_caracteristica_id_item_bien_caracteristica_seq OWNED BY public.item_bien_caracteristica.id_item_bien_caracteristica;


--
-- Name: item_bien_caracteristica_id_item_bien_caracteristica_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.item_bien_caracteristica ALTER COLUMN id_item_bien_caracteristica ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.item_bien_caracteristica_id_item_bien_caracteristica_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: item_bien_caracteristicas_id_item_bien_caracteristica_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_bien_caracteristicas_id_item_bien_caracteristica_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 2147483647
    CACHE 1;


ALTER SEQUENCE public.item_bien_caracteristicas_id_item_bien_caracteristica_seq OWNER TO postgres;

--
-- Name: item_bien_caracteristicas_id_item_bien_caracteristica_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_bien_caracteristicas_id_item_bien_caracteristica_seq OWNED BY public.item_bien_caracteristica.id_item_bien_caracteristica;


--
-- Name: item_bien_investigado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_bien_investigado (
    id_item_bien_secundario bigint NOT NULL,
    id_caso bigint NOT NULL,
    id_catalogo_tipo integer NOT NULL,
    id_tipo_investigacion_bien integer NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.item_bien_investigado OWNER TO postgres;

--
-- Name: item_bien_investigado_id_item_bien_secundario_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq OWNER TO postgres;

--
-- Name: item_bien_investigado_id_item_bien_secundario_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq OWNED BY public.item_bien_investigado.id_item_bien_secundario;


--
-- Name: item_bien_investigado_id_item_bien_secundario_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq1 OWNER TO postgres;

--
-- Name: item_bien_investigado_id_item_bien_secundario_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.item_bien_investigado_id_item_bien_secundario_seq1 OWNED BY public.item_bien_investigado.id_item_bien_secundario;


--
-- Name: item_bien_investigado_id_item_bien_secundario_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.item_bien_investigado ALTER COLUMN id_item_bien_secundario ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.item_bien_investigado_id_item_bien_secundario_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lugar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar (
    id_lugar smallint NOT NULL,
    descripcion character(100) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.lugar OWNER TO postgres;

--
-- Name: lugar_bien; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar_bien (
    id_lugar_bien bigint NOT NULL,
    id_item_bien_secundario bigint NOT NULL,
    descripcion character varying(150) NOT NULL,
    coordenas_x double precision NOT NULL,
    coordenas_y double precision NOT NULL,
    contenido text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.lugar_bien OWNER TO postgres;

--
-- Name: lugar_bien_id_lugar_bien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_bien_id_lugar_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_bien_id_lugar_bien_seq OWNER TO postgres;

--
-- Name: lugar_bien_id_lugar_bien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_bien_id_lugar_bien_seq OWNED BY public.lugar_bien.id_lugar_bien;


--
-- Name: lugar_bien_id_lugar_bien_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lugar_bien ALTER COLUMN id_lugar_bien ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lugar_bien_id_lugar_bien_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lugar_bienes_id_lugar_bien_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_bienes_id_lugar_bien_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_bienes_id_lugar_bien_seq OWNER TO postgres;

--
-- Name: lugar_bienes_id_lugar_bien_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_bienes_id_lugar_bien_seq OWNED BY public.lugar_bien.id_lugar_bien;


--
-- Name: lugar_blanco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar_blanco (
    id_lugar_blanco bigint NOT NULL,
    id_blanco bigint NOT NULL,
    descripcion character varying(150) NOT NULL,
    coordenas_x double precision NOT NULL,
    coordenas_y double precision NOT NULL,
    contenido text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.lugar_blanco OWNER TO postgres;

--
-- Name: lugar_blanco_id_lugar_blanco_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_blanco_id_lugar_blanco_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_blanco_id_lugar_blanco_seq OWNER TO postgres;

--
-- Name: lugar_blanco_id_lugar_blanco_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_blanco_id_lugar_blanco_seq OWNED BY public.lugar_blanco.id_lugar_blanco;


--
-- Name: lugar_blanco_id_lugar_blanco_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_blanco_id_lugar_blanco_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_blanco_id_lugar_blanco_seq1 OWNER TO postgres;

--
-- Name: lugar_blanco_id_lugar_blanco_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_blanco_id_lugar_blanco_seq1 OWNED BY public.lugar_blanco.id_lugar_blanco;


--
-- Name: lugar_blanco_id_lugar_blanco_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lugar_blanco ALTER COLUMN id_lugar_blanco ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lugar_blanco_id_lugar_blanco_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lugar_empresa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lugar_empresa (
    id_lugar_empresa bigint NOT NULL,
    id_empresa bigint NOT NULL,
    descripcion character varying(150) NOT NULL,
    coordenas_x double precision NOT NULL,
    coordenas_y double precision NOT NULL,
    contenido text NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.lugar_empresa OWNER TO postgres;

--
-- Name: lugar_empresa_id_lugar_empresa_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_empresa_id_lugar_empresa_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_empresa_id_lugar_empresa_seq OWNER TO postgres;

--
-- Name: lugar_empresa_id_lugar_empresa_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_empresa_id_lugar_empresa_seq OWNED BY public.lugar_empresa.id_lugar_empresa;


--
-- Name: lugar_empresa_id_lugar_empresa_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lugar_empresa_id_lugar_empresa_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lugar_empresa_id_lugar_empresa_seq1 OWNER TO postgres;

--
-- Name: lugar_empresa_id_lugar_empresa_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lugar_empresa_id_lugar_empresa_seq1 OWNED BY public.lugar_empresa.id_lugar_empresa;


--
-- Name: lugar_empresa_id_lugar_empresa_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lugar_empresa ALTER COLUMN id_lugar_empresa ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.lugar_empresa_id_lugar_empresa_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: lugares_id_lugar_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.lugar ALTER COLUMN id_lugar ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.lugares_id_lugar_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ovise; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ovise (
    id_ovise bigint NOT NULL,
    id_blanco bigint NOT NULL,
    lugar character varying(50) NOT NULL,
    latitud double precision NOT NULL,
    longitud double precision NOT NULL,
    reporte text NOT NULL,
    accion character varying(20) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone,
    archivo bytea
);


ALTER TABLE public.ovise OWNER TO postgres;

--
-- Name: ovise_id_ovise_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.ovise ALTER COLUMN id_ovise ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.ovise_id_ovise_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: red_social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.red_social (
    id_red_social bigint NOT NULL,
    id_blanco bigint NOT NULL,
    tipo_red character varying(50) NOT NULL,
    direccion character varying(200) NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.red_social OWNER TO postgres;

--
-- Name: red_social_id_red_social_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.red_social_id_red_social_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.red_social_id_red_social_seq OWNER TO postgres;

--
-- Name: red_social_id_red_social_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.red_social_id_red_social_seq OWNED BY public.red_social.id_red_social;


--
-- Name: red_social_id_red_social_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.red_social_id_red_social_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.red_social_id_red_social_seq1 OWNER TO postgres;

--
-- Name: red_social_id_red_social_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.red_social_id_red_social_seq1 OWNED BY public.red_social.id_red_social;


--
-- Name: red_social_id_red_social_seq2; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.red_social ALTER COLUMN id_red_social ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.red_social_id_red_social_seq2
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: telefono; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telefono (
    id_telefono bigint NOT NULL,
    id_caso bigint NOT NULL,
    numero_1 character varying(20) NOT NULL,
    propietario_1 character varying(150) NOT NULL,
    mensaje text NOT NULL,
    numero_2 character varying(20) NOT NULL,
    propietario_2 character varying(150) NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.telefono OWNER TO postgres;

--
-- Name: telefono_id_telefono_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telefono_id_telefono_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telefono_id_telefono_seq OWNER TO postgres;

--
-- Name: telefono_id_telefono_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telefono_id_telefono_seq OWNED BY public.telefono.id_telefono;


--
-- Name: telefono_id_telefono_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.telefono ALTER COLUMN id_telefono ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.telefono_id_telefono_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: transporte; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transporte (
    codigo_transporte character varying(10) NOT NULL,
    tipo character varying(10) NOT NULL,
    marca character varying(50) NOT NULL,
    modelo character varying(4) NOT NULL,
    clase character varying(15) NOT NULL,
    tipo_transporte character varying(20) NOT NULL,
    color character varying(20) NOT NULL,
    chasis character varying(30) NOT NULL,
    motor character varying(30) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.transporte OWNER TO postgres;

--
-- Name: vehiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculo (
    id_vehiculo bigint NOT NULL,
    id_caso bigint NOT NULL,
    propietario character varying(150) NOT NULL,
    placa character varying(10) NOT NULL,
    color character varying(20) NOT NULL,
    marca character varying(20) NOT NULL,
    fecha_hora_ingreso timestamp(6) without time zone NOT NULL,
    usuario character varying(15) NOT NULL,
    _estado character varying(30) DEFAULT 'ACTIVO'::character varying NOT NULL,
    _transaccion character varying(30) DEFAULT 'CREAR'::character varying NOT NULL,
    _usuario_creacion character varying(50) DEFAULT CURRENT_USER NOT NULL,
    _fecha_creacion timestamp without time zone DEFAULT now() NOT NULL,
    _usuario_modificacion character varying(50),
    _fecha_modificacion timestamp without time zone
);


ALTER TABLE public.vehiculo OWNER TO postgres;

--
-- Name: vehiculo_id_vehiculo_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vehiculo_id_vehiculo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehiculo_id_vehiculo_seq OWNER TO postgres;

--
-- Name: vehiculo_id_vehiculo_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vehiculo_id_vehiculo_seq OWNED BY public.vehiculo.id_vehiculo;


--
-- Name: vehiculo_id_vehiculo_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.vehiculo ALTER COLUMN id_vehiculo ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.vehiculo_id_vehiculo_seq1
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: bien bienes_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.bien
    ADD CONSTRAINT bienes_pkey PRIMARY KEY (id_bien);


--
-- Name: catalogo_caracteristica catalogo_caracteristicas_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_caracteristica
    ADD CONSTRAINT catalogo_caracteristicas_pkey PRIMARY KEY (id_catalogo_caracteristica);


--
-- Name: catalogo_clase catalogo_clase_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_clase
    ADD CONSTRAINT catalogo_clase_pkey PRIMARY KEY (id_catalogo_clase);


--
-- Name: catalogo_tipo catalogo_tipo_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_tipo
    ADD CONSTRAINT catalogo_tipo_pkey PRIMARY KEY (id_catalogo_tipo);


--
-- Name: contenido_caso contenido_caso_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.contenido_caso
    ADD CONSTRAINT contenido_caso_pkey PRIMARY KEY (id_contenido_caso);


--
-- Name: continente continente_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.continente
    ADD CONSTRAINT continente_pkey PRIMARY KEY (id_continente);


--
-- Name: estado_caso estado_caso_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.estado_caso
    ADD CONSTRAINT estado_caso_pkey PRIMARY KEY (id_estado_caso);


--
-- Name: etapa_investigacion etapa_investigacion_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.etapa_investigacion
    ADD CONSTRAINT etapa_investigacion_pkey PRIMARY KEY (id_etapa_investigacion);


--
-- Name: pais pais_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.pais
    ADD CONSTRAINT pais_pkey PRIMARY KEY (id_pais);


--
-- Name: color pk_color; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.color
    ADD CONSTRAINT pk_color PRIMARY KEY (id_color);


--
-- Name: tipo_activo pk_tipo_activo; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.tipo_activo
    ADD CONSTRAINT pk_tipo_activo PRIMARY KEY (id_tipo_activo);


--
-- Name: tipo_delito tipo_delito_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.tipo_delito
    ADD CONSTRAINT tipo_delito_pkey PRIMARY KEY (id_tipo_delito);


--
-- Name: tipo_investigacion_bien tipo_investigacion_bien_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.tipo_investigacion_bien
    ADD CONSTRAINT tipo_investigacion_bien_pkey PRIMARY KEY (id_tipo_investigacion_bien);


--
-- Name: tipo_organizacion tipo_organizacion_pkey; Type: CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.tipo_organizacion
    ADD CONSTRAINT tipo_organizacion_pkey PRIMARY KEY (id_tipo_organizacion);


--
-- Name: antecedente_blanco antecedente_blanco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedente_blanco
    ADD CONSTRAINT antecedente_blanco_pkey PRIMARY KEY (id_antecedente);


--
-- Name: archivos_bien archivos_bienes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_bien
    ADD CONSTRAINT archivos_bienes_pkey PRIMARY KEY (id_archivo_bien);


--
-- Name: archivos_blanco archivos_blanco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_blanco
    ADD CONSTRAINT archivos_blanco_pkey PRIMARY KEY (id_archivo);


--
-- Name: archivos_organizacion archivos_organizacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_organizacion
    ADD CONSTRAINT archivos_organizacion_pkey PRIMARY KEY (id_archivo);


--
-- Name: asignacion asignacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion
    ADD CONSTRAINT asignacion_pkey PRIMARY KEY (id_caso);


--
-- Name: blanco blancos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blanco
    ADD CONSTRAINT blancos_pkey PRIMARY KEY (id_blanco);


--
-- Name: empresa empresas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT empresas_pkey PRIMARY KEY (id_empresa);


--
-- Name: item_bien_caracteristica item_bien_caracteristicas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_caracteristica
    ADD CONSTRAINT item_bien_caracteristicas_pkey PRIMARY KEY (id_item_bien_caracteristica);


--
-- Name: item_bien_investigado item_bien_investigado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_investigado
    ADD CONSTRAINT item_bien_investigado_pkey PRIMARY KEY (id_item_bien_secundario);


--
-- Name: lugar_bien lugar_bienes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_bien
    ADD CONSTRAINT lugar_bienes_pkey PRIMARY KEY (id_lugar_bien);


--
-- Name: lugar_blanco lugar_blanco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_blanco
    ADD CONSTRAINT lugar_blanco_pkey PRIMARY KEY (id_lugar_blanco);


--
-- Name: lugar_empresa lugar_empresa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_empresa
    ADD CONSTRAINT lugar_empresa_pkey PRIMARY KEY (id_lugar_empresa);


--
-- Name: activo_patrimonial pk_activo_patrimonial; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activo_patrimonial
    ADD CONSTRAINT pk_activo_patrimonial PRIMARY KEY (id_activo_patrimonial);


--
-- Name: conductor pk_conductor; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conductor
    ADD CONSTRAINT pk_conductor PRIMARY KEY (numero_documento);


--
-- Name: flujo_fiscalia pk_flujo_fiscalia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_fiscalia
    ADD CONSTRAINT pk_flujo_fiscalia PRIMARY KEY (id_flujo_fiscalia);


--
-- Name: flujo_telefonico pk_flujo_telefonico; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_telefonico
    ADD CONSTRAINT pk_flujo_telefonico PRIMARY KEY (id_flujo);


--
-- Name: flujo_transporte pk_flujo_transporte; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_transporte
    ADD CONSTRAINT pk_flujo_transporte PRIMARY KEY (id_flujo_transporte);


--
-- Name: lugar pk_lugares; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar
    ADD CONSTRAINT pk_lugares PRIMARY KEY (id_lugar);


--
-- Name: ovise pk_ovise; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ovise
    ADD CONSTRAINT pk_ovise PRIMARY KEY (id_ovise);


--
-- Name: transporte pk_transporte; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transporte
    ADD CONSTRAINT pk_transporte PRIMARY KEY (codigo_transporte);


--
-- Name: red_social red_social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.red_social
    ADD CONSTRAINT red_social_pkey PRIMARY KEY (id_red_social);


--
-- Name: telefono telefono_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT telefono_pkey PRIMARY KEY (id_telefono);


--
-- Name: vehiculo vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_pkey PRIMARY KEY (id_vehiculo);


--
-- Name: idx_antecedente_blanco_id_blanco; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_antecedente_blanco_id_blanco ON public.antecedente_blanco USING btree (id_blanco);


--
-- Name: idx_archivos_bienes_id_item_bien; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_archivos_bienes_id_item_bien ON public.archivos_bien USING btree (id_item_bien_secundario);


--
-- Name: idx_archivos_blanco_id_blanco; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_archivos_blanco_id_blanco ON public.archivos_blanco USING btree (id_blanco);


--
-- Name: idx_archivos_organizacion_id_empresa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_archivos_organizacion_id_empresa ON public.archivos_organizacion USING btree (id_empresa);


--
-- Name: idx_asignacion_id_pais; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_asignacion_id_pais ON public.asignacion USING btree (id_pais);


--
-- Name: idx_blancos_id_caso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_blancos_id_caso ON public.blanco USING btree (id_caso);


--
-- Name: idx_empresas_id_caso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_empresas_id_caso ON public.empresa USING btree (id_caso);


--
-- Name: idx_item_bien_investigado_id_operativo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_item_bien_investigado_id_operativo ON public.item_bien_investigado USING btree (id_caso);


--
-- Name: idx_telefonos_id_caso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_telefonos_id_caso ON public.telefono USING btree (id_caso);


--
-- Name: idx_vehiculos_id_caso; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehiculos_id_caso ON public.vehiculo USING btree (id_caso);


--
-- Name: bien trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: catalogo_caracteristica trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.catalogo_caracteristica FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: catalogo_clase trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.catalogo_clase FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: catalogo_tipo trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.catalogo_tipo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: color trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.color FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: contenido_caso trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.contenido_caso FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: continente trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.continente FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: estado_caso trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.estado_caso FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: etapa_investigacion trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.etapa_investigacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: pais trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.pais FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: regla_color trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.regla_color FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: tipo_activo trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.tipo_activo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: tipo_delito trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.tipo_delito FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: tipo_investigacion_bien trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.tipo_investigacion_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: tipo_organizacion trg_auditoria_insert; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON parametricas.tipo_organizacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: bien trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: catalogo_caracteristica trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.catalogo_caracteristica FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: catalogo_clase trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.catalogo_clase FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: catalogo_tipo trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.catalogo_tipo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: color trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.color FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: contenido_caso trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.contenido_caso FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: continente trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.continente FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: estado_caso trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.estado_caso FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: etapa_investigacion trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.etapa_investigacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: pais trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.pais FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: regla_color trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.regla_color FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: tipo_activo trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.tipo_activo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: tipo_delito trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.tipo_delito FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: tipo_investigacion_bien trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.tipo_investigacion_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: tipo_organizacion trg_auditoria_update; Type: TRIGGER; Schema: parametricas; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON parametricas.tipo_organizacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: activo_patrimonial trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.activo_patrimonial FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: antecedente_blanco trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.antecedente_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: archivos_bien trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.archivos_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: archivos_blanco trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.archivos_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: archivos_organizacion trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.archivos_organizacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: asignacion trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.asignacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: blanco trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: conductor trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.conductor FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: empresa trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.empresa FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: flujo_fiscalia trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.flujo_fiscalia FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: flujo_telefonico trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.flujo_telefonico FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: flujo_transporte trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.flujo_transporte FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: item_bien_caracteristica trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.item_bien_caracteristica FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: item_bien_investigado trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.item_bien_investigado FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: lugar trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.lugar FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: lugar_bien trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.lugar_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: lugar_blanco trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.lugar_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: lugar_empresa trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.lugar_empresa FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: ovise trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.ovise FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: red_social trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.red_social FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: telefono trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.telefono FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: transporte trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.transporte FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: vehiculo trg_auditoria_insert; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_insert BEFORE INSERT ON public.vehiculo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_insert();


--
-- Name: activo_patrimonial trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.activo_patrimonial FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: antecedente_blanco trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.antecedente_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: archivos_bien trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.archivos_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: archivos_blanco trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.archivos_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: archivos_organizacion trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.archivos_organizacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: asignacion trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.asignacion FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: blanco trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: conductor trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.conductor FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: empresa trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.empresa FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: flujo_fiscalia trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.flujo_fiscalia FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: flujo_telefonico trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.flujo_telefonico FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: flujo_transporte trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.flujo_transporte FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: item_bien_caracteristica trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.item_bien_caracteristica FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: item_bien_investigado trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.item_bien_investigado FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: lugar trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.lugar FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: lugar_bien trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.lugar_bien FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: lugar_blanco trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.lugar_blanco FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: lugar_empresa trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.lugar_empresa FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: ovise trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.ovise FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: red_social trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.red_social FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: telefono trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.telefono FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: transporte trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.transporte FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: vehiculo trg_auditoria_update; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_auditoria_update BEFORE UPDATE ON public.vehiculo FOR EACH ROW EXECUTE FUNCTION public.fn_auditoria_before_update();


--
-- Name: catalogo_caracteristica fk_catalogo_caracteristicas_catalogo_clase; Type: FK CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_caracteristica
    ADD CONSTRAINT fk_catalogo_caracteristicas_catalogo_clase FOREIGN KEY (id_catalogo_clase) REFERENCES parametricas.catalogo_clase(id_catalogo_clase);


--
-- Name: catalogo_clase fk_catalogo_clase_bienes; Type: FK CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_clase
    ADD CONSTRAINT fk_catalogo_clase_bienes FOREIGN KEY (id_bien) REFERENCES parametricas.bien(id_bien) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: catalogo_tipo fk_catalogo_tipo_catalogo_clase; Type: FK CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.catalogo_tipo
    ADD CONSTRAINT fk_catalogo_tipo_catalogo_clase FOREIGN KEY (id_catalogo_clase) REFERENCES parametricas.catalogo_clase(id_catalogo_clase);


--
-- Name: pais fk_pais_continente; Type: FK CONSTRAINT; Schema: parametricas; Owner: postgres
--

ALTER TABLE ONLY parametricas.pais
    ADD CONSTRAINT fk_pais_continente FOREIGN KEY (id_continente) REFERENCES parametricas.continente(id_continente);


--
-- Name: conductor conductor_pais_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.conductor
    ADD CONSTRAINT conductor_pais_fk FOREIGN KEY (id_pais) REFERENCES parametricas.pais(id_pais);


--
-- Name: activo_patrimonial fk_activo_patrimonial_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activo_patrimonial
    ADD CONSTRAINT fk_activo_patrimonial_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco);


--
-- Name: activo_patrimonial fk_activo_patrimonial_tipo_activo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activo_patrimonial
    ADD CONSTRAINT fk_activo_patrimonial_tipo_activo FOREIGN KEY (id_tipo_activo) REFERENCES parametricas.tipo_activo(id_tipo_activo);


--
-- Name: antecedente_blanco fk_antecedente_blanco_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedente_blanco
    ADD CONSTRAINT fk_antecedente_blanco_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: antecedente_blanco fk_antecedente_blanco_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedente_blanco
    ADD CONSTRAINT fk_antecedente_blanco_pais FOREIGN KEY (id_pais) REFERENCES parametricas.pais(id_pais);


--
-- Name: antecedente_blanco fk_antecedente_blanco_tipo_delito; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedente_blanco
    ADD CONSTRAINT fk_antecedente_blanco_tipo_delito FOREIGN KEY (id_tipo_delito) REFERENCES parametricas.tipo_delito(id_tipo_delito);


--
-- Name: archivos_bien fk_archivos_bienes_contenido_caso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_bien
    ADD CONSTRAINT fk_archivos_bienes_contenido_caso FOREIGN KEY (id_contenido_caso) REFERENCES parametricas.contenido_caso(id_contenido_caso);


--
-- Name: archivos_bien fk_archivos_bienes_item_bien_investigado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_bien
    ADD CONSTRAINT fk_archivos_bienes_item_bien_investigado FOREIGN KEY (id_item_bien_secundario) REFERENCES public.item_bien_investigado(id_item_bien_secundario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: archivos_blanco fk_archivos_blanco_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_blanco
    ADD CONSTRAINT fk_archivos_blanco_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: archivos_blanco fk_archivos_blanco_contenido_caso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_blanco
    ADD CONSTRAINT fk_archivos_blanco_contenido_caso FOREIGN KEY (id_contenido_caso) REFERENCES parametricas.contenido_caso(id_contenido_caso);


--
-- Name: archivos_organizacion fk_archivos_organizacion_contenido_caso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_organizacion
    ADD CONSTRAINT fk_archivos_organizacion_contenido_caso FOREIGN KEY (id_contenido_caso) REFERENCES parametricas.contenido_caso(id_contenido_caso);


--
-- Name: archivos_organizacion fk_archivos_organizacion_empresas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.archivos_organizacion
    ADD CONSTRAINT fk_archivos_organizacion_empresas FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: asignacion fk_asignacion_estado_caso; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion
    ADD CONSTRAINT fk_asignacion_estado_caso FOREIGN KEY (id_estado_caso) REFERENCES parametricas.estado_caso(id_estado_caso);


--
-- Name: asignacion fk_asignacion_etapa_investigacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion
    ADD CONSTRAINT fk_asignacion_etapa_investigacion FOREIGN KEY (id_etapa_investigacion) REFERENCES parametricas.etapa_investigacion(id_etapa_investigacion);


--
-- Name: asignacion fk_asignacion_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.asignacion
    ADD CONSTRAINT fk_asignacion_pais FOREIGN KEY (id_pais) REFERENCES parametricas.pais(id_pais);


--
-- Name: blanco fk_blancos_asignacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blanco
    ADD CONSTRAINT fk_blancos_asignacion FOREIGN KEY (id_caso) REFERENCES public.asignacion(id_caso) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: blanco fk_blancos_pais; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blanco
    ADD CONSTRAINT fk_blancos_pais FOREIGN KEY (id_pais) REFERENCES parametricas.pais(id_pais);


--
-- Name: empresa fk_empresas_asignacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresas_asignacion FOREIGN KEY (id_caso) REFERENCES public.asignacion(id_caso) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: empresa fk_empresas_tipo_organizacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.empresa
    ADD CONSTRAINT fk_empresas_tipo_organizacion FOREIGN KEY (id_tipo_organizacion) REFERENCES parametricas.tipo_organizacion(id_tipo_organizacion);


--
-- Name: flujo_fiscalia fk_flujo_fiscalia_flujo_telefonico; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_fiscalia
    ADD CONSTRAINT fk_flujo_fiscalia_flujo_telefonico FOREIGN KEY (id_flujo) REFERENCES public.flujo_telefonico(id_flujo);


--
-- Name: flujo_telefonico fk_flujo_telefonico_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_telefonico
    ADD CONSTRAINT fk_flujo_telefonico_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco);


--
-- Name: flujo_transporte fk_flujo_transporte_color; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_transporte
    ADD CONSTRAINT fk_flujo_transporte_color FOREIGN KEY (id_color) REFERENCES parametricas.color(id_color);


--
-- Name: flujo_transporte fk_flujo_transporte_conductor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_transporte
    ADD CONSTRAINT fk_flujo_transporte_conductor FOREIGN KEY (numero_documento) REFERENCES public.conductor(numero_documento);


--
-- Name: flujo_transporte fk_flujo_transporte_lugares; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_transporte
    ADD CONSTRAINT fk_flujo_transporte_lugares FOREIGN KEY (id_lugar) REFERENCES public.lugar(id_lugar);


--
-- Name: flujo_transporte fk_flujo_transporte_transporte; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flujo_transporte
    ADD CONSTRAINT fk_flujo_transporte_transporte FOREIGN KEY (codigo_transporte) REFERENCES public.transporte(codigo_transporte);


--
-- Name: item_bien_caracteristica fk_item_bien_caracteristicas_catalogo_caracteristicas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_caracteristica
    ADD CONSTRAINT fk_item_bien_caracteristicas_catalogo_caracteristicas FOREIGN KEY (id_catalogo_caracteristica) REFERENCES parametricas.catalogo_caracteristica(id_catalogo_caracteristica);


--
-- Name: item_bien_caracteristica fk_item_bien_caracteristicas_item_bien_investigado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_caracteristica
    ADD CONSTRAINT fk_item_bien_caracteristicas_item_bien_investigado FOREIGN KEY (id_item_bien_secundario) REFERENCES public.item_bien_investigado(id_item_bien_secundario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_bien_investigado fk_item_bien_investigado_catalogo_tipo; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_investigado
    ADD CONSTRAINT fk_item_bien_investigado_catalogo_tipo FOREIGN KEY (id_catalogo_tipo) REFERENCES parametricas.catalogo_tipo(id_catalogo_tipo) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_bien_investigado fk_item_bien_investigado_tipo_inv_bien; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_investigado
    ADD CONSTRAINT fk_item_bien_investigado_tipo_inv_bien FOREIGN KEY (id_tipo_investigacion_bien) REFERENCES parametricas.tipo_investigacion_bien(id_tipo_investigacion_bien);


--
-- Name: lugar_bien fk_lugar_bienes_item_bien_investigado; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_bien
    ADD CONSTRAINT fk_lugar_bienes_item_bien_investigado FOREIGN KEY (id_item_bien_secundario) REFERENCES public.item_bien_investigado(id_item_bien_secundario) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lugar_blanco fk_lugar_blanco_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_blanco
    ADD CONSTRAINT fk_lugar_blanco_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lugar_empresa fk_lugar_empresa_empresas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lugar_empresa
    ADD CONSTRAINT fk_lugar_empresa_empresas FOREIGN KEY (id_empresa) REFERENCES public.empresa(id_empresa) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ovise fk_ovise_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ovise
    ADD CONSTRAINT fk_ovise_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco);


--
-- Name: red_social fk_redes_sociales_blancos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.red_social
    ADD CONSTRAINT fk_redes_sociales_blancos FOREIGN KEY (id_blanco) REFERENCES public.blanco(id_blanco) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: telefono fk_telefonos_asignacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telefono
    ADD CONSTRAINT fk_telefonos_asignacion FOREIGN KEY (id_caso) REFERENCES public.asignacion(id_caso) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehiculo fk_vehiculos_asignacion; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT fk_vehiculos_asignacion FOREIGN KEY (id_caso) REFERENCES public.asignacion(id_caso) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: item_bien_investigado item_bien_investigado_asignacion_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_bien_investigado
    ADD CONSTRAINT item_bien_investigado_asignacion_fk FOREIGN KEY (id_caso) REFERENCES public.asignacion(id_caso);


--
-- PostgreSQL database dump complete
--

\unrestrict UY3jbo2VmMlB8BtNMpXhDyyQz59o9liN0fmIuYnvXNxCztQxtp9KTEqMdLozjkf

