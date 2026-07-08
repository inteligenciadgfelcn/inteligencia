-- ─────────────────────────────────────────────────────────────────────────────
-- Tablas de catálogos LGI referenciadas por src/application/lgi/parametro/*
-- Base: felcn_lgi — Schema: public
-- NOTA: el legacy GIAEF aún no migró estos catálogos; se crean vacíos con la
-- estructura de las entidades para que los endpoints respondan. La data se
-- poblará con la migración del legacy o con seeds del área funcional.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bienes (
  bien_id     BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.catalogoclase (
  catclas_id  BIGSERIAL PRIMARY KEY,
  bien_id     BIGINT NOT NULL REFERENCES public.bienes(bien_id),
  descripcion VARCHAR(255) NOT NULL,
  fungible    BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.catalogocaracteristicas (
  catcarac_id BIGSERIAL PRIMARY KEY,
  catclas_id  INTEGER NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.catalogotipo (
  cattipo_id  BIGSERIAL PRIMARY KEY,
  catclas_id  INTEGER NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.catalogojuridica (
  catjur_id   BIGSERIAL PRIMARY KEY,
  catclas_id  INTEGER NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.situacionlegal (
  sl_id       BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.recursos (
  rec_id      BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.etapa (
  et_id       BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.estado (
  est_id      BIGSERIAL PRIMARY KEY,
  et_id       INTEGER NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tipopersona (
  tp_id       BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contenidocaso (
  contcaso_id BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.grados (
  gr_id       BIGSERIAL PRIMARY KEY,
  abrev       VARCHAR(10) NOT NULL,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tamanodoc (
  tamdoc_id   BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL,
  ancho       INTEGER NULL,
  alto        INTEGER NULL
);

CREATE TABLE IF NOT EXISTS public.contenidobien (
  contbien_id BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.calidadbien (
  calb_id     BIGSERIAL PRIMARY KEY,
  descripcion VARCHAR(255) NOT NULL
);
