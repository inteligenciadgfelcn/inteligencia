--
-- PostgreSQL database dump
--

\restrict m8Cze790qnXaQEybNkL9OWewOIgrGp3bMtUhr8xvC4czd3bXSrNKHVEAVmXSxV2

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: clase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clase (
    id_clase integer NOT NULL,
    nombre text NOT NULL,
    estado integer NOT NULL,
    id_user integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.clase OWNER TO postgres;

--
-- Name: color; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.color (
    id_color integer NOT NULL,
    nombre text NOT NULL,
    estado integer NOT NULL,
    id_user integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.color OWNER TO postgres;

--
-- Name: departamentos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departamentos (
    id_departamento integer NOT NULL,
    nombre text NOT NULL,
    abreviacion text NOT NULL,
    estado integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    latitud double precision,
    longitud double precision,
    zoom integer
);


ALTER TABLE public.departamentos OWNER TO postgres;

--
-- Name: marca; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.marca (
    id_marca integer NOT NULL,
    nombre text NOT NULL,
    estado integer NOT NULL,
    id_user integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.marca OWNER TO postgres;

--
-- Name: modelo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.modelo (
    id_modelo integer NOT NULL,
    nombre text NOT NULL,
    estado integer NOT NULL,
    id_user integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.modelo OWNER TO postgres;

--
-- Name: municipios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.municipios (
    id_municipio integer NOT NULL,
    id_provincia integer,
    nombre text,
    estado integer,
    created_at text,
    updated_at text
);


ALTER TABLE public.municipios OWNER TO postgres;

--
-- Name: pais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pais (
    id_pais integer,
    nombre text,
    estado integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.pais OWNER TO postgres;

--
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    id_persona integer NOT NULL,
    apellido_paterno text,
    apellido_materno text,
    nombre text,
    sexo text,
    ocupacion text,
    id_tipo_documento integer,
    nro_documento text,
    id_expedido integer,
    domicilio text,
    id_pais integer,
    fecha_nacimiento timestamp with time zone,
    id_municipio integer,
    localidad text,
    id_estado_civil integer,
    telefono_fijo text,
    celular text,
    email text,
    id_categoria_licencia integer,
    id_user integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    documento_complemento text,
    fuente_dato text,
    verificado text,
    fotografia_per text,
    tipo_persona text
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- Name: provincias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.provincias (
    id_provincia integer NOT NULL,
    id_departamento integer,
    nombre text,
    estado integer,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.provincias OWNER TO postgres;

--
-- Name: vehiculo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculo (
    id_vehiculo integer NOT NULL,
    tipo_placa text,
    placa text,
    nro_copia integer,
    motor text NOT NULL,
    nro_crpva text,
    chasis text NOT NULL,
    cilindrada text NOT NULL,
    procedencia integer,
    radicatoria integer,
    servicio text NOT NULL,
    id_pais integer,
    id_marca integer NOT NULL,
    id_modelo integer NOT NULL,
    id_clase integer NOT NULL,
    id_persona integer,
    tipo_vehiculo text,
    estado integer NOT NULL,
    id_user integer NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    id_color integer,
    fotografia text,
    tipo_combustible text,
    id_mun_radicatoria bigint,
    cod_roseta text,
    poliza text,
    capacidad_carga text,
    numero_puertas text,
    medida_llantas text,
    numero_asientos text,
    ano_fabricacion text
);


ALTER TABLE public.vehiculo OWNER TO postgres;

--
-- Name: clase idx_52038_clase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clase
    ADD CONSTRAINT idx_52038_clase_pkey PRIMARY KEY (id_clase);


--
-- Name: color idx_52043_color_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.color
    ADD CONSTRAINT idx_52043_color_pkey PRIMARY KEY (id_color);


--
-- Name: departamentos idx_52048_departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departamentos
    ADD CONSTRAINT idx_52048_departamentos_pkey PRIMARY KEY (id_departamento);


--
-- Name: marca idx_52053_marca_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.marca
    ADD CONSTRAINT idx_52053_marca_pkey PRIMARY KEY (id_marca);


--
-- Name: modelo idx_52058_modelo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.modelo
    ADD CONSTRAINT idx_52058_modelo_pkey PRIMARY KEY (id_modelo);


--
-- Name: municipios idx_52063_pk_municipios; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT idx_52063_pk_municipios PRIMARY KEY (id_municipio);


--
-- Name: personas idx_52073_pk_personas; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personas
    ADD CONSTRAINT idx_52073_pk_personas PRIMARY KEY (id_persona);


--
-- Name: provincias idx_52078_pk_provincias; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT idx_52078_pk_provincias PRIMARY KEY (id_provincia);


--
-- Name: vehiculo idx_52090_vehiculo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT idx_52090_vehiculo_pkey PRIMARY KEY (id_vehiculo);


--
-- Name: municipios fk_municipios_provincias; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.municipios
    ADD CONSTRAINT fk_municipios_provincias FOREIGN KEY (id_provincia) REFERENCES public.provincias(id_provincia);


--
-- Name: provincias fk_provincias_departamentos; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.provincias
    ADD CONSTRAINT fk_provincias_departamentos FOREIGN KEY (id_departamento) REFERENCES public.departamentos(id_departamento);


--
-- Name: vehiculo fk_vehiculo_personas; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT fk_vehiculo_personas FOREIGN KEY (id_persona) REFERENCES public.personas(id_persona) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: vehiculo vehiculo_id_clase_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_clase_foreign FOREIGN KEY (id_clase) REFERENCES public.clase(id_clase);


--
-- Name: vehiculo vehiculo_id_color_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_color_foreign FOREIGN KEY (id_color) REFERENCES public.color(id_color);


--
-- Name: vehiculo vehiculo_id_marca_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_marca_foreign FOREIGN KEY (id_marca) REFERENCES public.marca(id_marca);


--
-- Name: vehiculo vehiculo_id_modelo_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculo
    ADD CONSTRAINT vehiculo_id_modelo_foreign FOREIGN KEY (id_modelo) REFERENCES public.modelo(id_modelo);


--
-- PostgreSQL database dump complete
--

\unrestrict m8Cze790qnXaQEybNkL9OWewOIgrGp3bMtUhr8xvC4czd3bXSrNKHVEAVmXSxV2

