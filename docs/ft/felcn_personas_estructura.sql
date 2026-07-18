--
-- PostgreSQL database dump
--

\restrict L5bfYxU9ldoDzf2XA9S4rOmGR33sRNqc7awgf0GgzDQGXfCnih7MlYkgfmHv2rk

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
-- Name: personas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personas (
    nombres text NOT NULL,
    paterno text NOT NULL,
    materno text NOT NULL,
    esposo text NOT NULL,
    documento text NOT NULL,
    nomdep text NOT NULL,
    nomprov text NOT NULL,
    nommun text NOT NULL,
    fechanac timestamp with time zone NOT NULL,
    sexo text NOT NULL,
    ocupacion text NOT NULL,
    dir1 text NOT NULL,
    dir2 text NOT NULL
);


ALTER TABLE public.personas OWNER TO postgres;

--
-- PostgreSQL database dump complete
--

\unrestrict L5bfYxU9ldoDzf2XA9S4rOmGR33sRNqc7awgf0GgzDQGXfCnih7MlYkgfmHv2rk

