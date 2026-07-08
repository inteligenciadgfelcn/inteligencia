-- ─────────────────────────────────────────────────────────────────────────────
-- Migración: Schema fiscalia — recepción de información MP → POL
-- Proyecto : felcn-base-backend-v2
-- Base     : felcn_siii
-- Docs     : docs/fiscalia/REQUERIMIENTO-MP-POL.md
--            docs/fiscalia/ANALISIS-HOMOLOGACION-MP-POL.md
-- Alcance  : Fase A1 — caso (3.1, 3.2) + bitácora de recepción
-- ─────────────────────────────────────────────────────────────────────────────

CREATE SCHEMA IF NOT EXISTS fiscalia;

-- Casos enviados por el Ministerio Público (staging).
-- Patrón híbrido: columnas de correlación indexables + payload JSONB íntegro.
CREATE TABLE IF NOT EXISTS fiscalia.mp_caso (
  pol_caso_id       BIGSERIAL     PRIMARY KEY,
  mp_caso_id        BIGINT        NOT NULL UNIQUE,
  cud               VARCHAR(50)   NOT NULL,
  mp_caso_padre_id  BIGINT        NULL,
  esta_reservado    BOOLEAN       NOT NULL DEFAULT false,
  fecha_fin_reserva TIMESTAMPTZ   NULL,
  estado            SMALLINT      NOT NULL DEFAULT 1,
  homologado        BOOLEAN       NOT NULL DEFAULT false,
  payload           JSONB         NOT NULL,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mp_caso_cud ON fiscalia.mp_caso(cud);
CREATE INDEX IF NOT EXISTS idx_mp_caso_homologado
  ON fiscalia.mp_caso(homologado)
  WHERE homologado = false;

COMMENT ON TABLE  fiscalia.mp_caso              IS 'Staging de casos enviados por el MP (3.1/3.2). El payload JSONB conserva el body completo; la homologación hacia las tablas SIII es diferida (Fase B)';
COMMENT ON COLUMN fiscalia.mp_caso.pol_caso_id  IS 'PK nuestra — se devuelve al MP como polCasoId';
COMMENT ON COLUMN fiscalia.mp_caso.mp_caso_id   IS 'PK del MP (mpCasoId). UNIQUE: garantiza idempotencia en reintentos';
COMMENT ON COLUMN fiscalia.mp_caso.cud          IS 'Código único de denuncia';
COMMENT ON COLUMN fiscalia.mp_caso.estado       IS '1 = activo, 0 = baja lógica';
COMMENT ON COLUMN fiscalia.mp_caso.homologado   IS 'true cuando la Fase B ya volcó este registro a las tablas operativas SIII';
COMMENT ON COLUMN fiscalia.mp_caso.payload      IS 'Body completo recibido; los PATCH hacen merge sobre este objeto';

-- Bitácora de toda petición recibida en los endpoints external/fiscalia.
CREATE TABLE IF NOT EXISTS fiscalia.mp_evento_recepcion (
  id             BIGSERIAL     PRIMARY KEY,
  endpoint       VARCHAR(255)  NOT NULL,
  metodo         VARCHAR(10)   NOT NULL,
  payload        JSONB         NULL,
  respuesta      JSONB         NULL,
  http_status    INTEGER       NOT NULL,
  ip_origen      VARCHAR(64)   NULL,
  api_key_alias  VARCHAR(50)   NULL,
  duracion_ms    INTEGER       NULL,
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mp_evento_recepcion_created
  ON fiscalia.mp_evento_recepcion(created_at);

COMMENT ON TABLE fiscalia.mp_evento_recepcion IS 'Auditoría de todas las peticiones del MP: endpoint, payload, respuesta, key utilizada y duración';

-- ─────────────────────────────────────────────────────────────────────────────
-- Fases 2–4: staging del resto de recursos MP → POL (3.3–3.20)
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_delito (
  pol_caso_delito_id BIGSERIAL    PRIMARY KEY,
  mp_caso_delito_id  BIGINT       NOT NULL UNIQUE,
  pol_caso_id        BIGINT       NOT NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  delito_id          INTEGER      NOT NULL,
  es_principal       BOOLEAN      NULL,
  es_tentativo       BOOLEAN      NULL,
  estado             SMALLINT     NOT NULL DEFAULT 1,
  homologado         BOOLEAN      NOT NULL DEFAULT false,
  payload            JSONB        NOT NULL,
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_delito_caso ON fiscalia.mp_caso_delito(pol_caso_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_sujeto (
  pol_caso_persona_id BIGSERIAL    PRIMARY KEY,
  mp_caso_persona_id  BIGINT       NOT NULL UNIQUE,
  pol_caso_id         BIGINT       NOT NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  tipo_persona        VARCHAR(10)  NOT NULL CHECK (tipo_persona IN ('natural', 'juridica')),
  numero_documento    VARCHAR(30)  NULL,
  nit                 VARCHAR(30)  NULL,
  es_querellante      BOOLEAN      NULL,
  reserva_identidad   BOOLEAN      NULL,
  estado              SMALLINT     NOT NULL DEFAULT 1,
  homologado          BOOLEAN      NOT NULL DEFAULT false,
  payload             JSONB        NOT NULL,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_sujeto_caso ON fiscalia.mp_caso_sujeto(pol_caso_id);
CREATE INDEX IF NOT EXISTS idx_mp_caso_sujeto_documento ON fiscalia.mp_caso_sujeto(numero_documento) WHERE numero_documento IS NOT NULL;

CREATE TABLE IF NOT EXISTS fiscalia.mp_sujeto_abogado (
  pol_caso_persona_abogado_id BIGSERIAL    PRIMARY KEY,
  mp_caso_persona_abogado_id  BIGINT       NOT NULL UNIQUE,
  pol_caso_persona_id         BIGINT       NOT NULL REFERENCES fiscalia.mp_caso_sujeto(pol_caso_persona_id),
  ci                          VARCHAR(30)  NOT NULL,
  codigo_rpa                  VARCHAR(30)  NOT NULL,
  motivo_baja                 VARCHAR(255) NULL,
  estado                      SMALLINT     NOT NULL DEFAULT 1,
  homologado                  BOOLEAN      NOT NULL DEFAULT false,
  payload                     JSONB        NOT NULL,
  created_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_sujeto_abogado_sujeto ON fiscalia.mp_sujeto_abogado(pol_caso_persona_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_sujeto_situacion_juridica (
  pol_caso_persona_situacion_juridica_id BIGSERIAL   PRIMARY KEY,
  mp_caso_persona_situacion_juridica_id  BIGINT      NOT NULL UNIQUE,
  pol_caso_persona_id                    BIGINT      NOT NULL REFERENCES fiscalia.mp_caso_sujeto(pol_caso_persona_id),
  situacion_juridica_id                  INTEGER     NOT NULL,
  fecha_inicio                           TIMESTAMPTZ NOT NULL,
  homologado                             BOOLEAN     NOT NULL DEFAULT false,
  payload                                JSONB       NOT NULL,
  created_at                             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_sujeto_situacion_sujeto ON fiscalia.mp_sujeto_situacion_juridica(pol_caso_persona_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_sujeto_domicilio (
  pol_persona_residencia_id BIGSERIAL    PRIMARY KEY,
  mp_persona_domicilio_id   BIGINT       NOT NULL UNIQUE,
  pol_caso_persona_id       BIGINT       NOT NULL REFERENCES fiscalia.mp_caso_sujeto(pol_caso_persona_id),
  pais_id                   INTEGER      NOT NULL,
  municipio_id              INTEGER      NULL,
  homologado                BOOLEAN      NOT NULL DEFAULT false,
  payload                   JSONB        NOT NULL,
  created_at                TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_sujeto_domicilio_sujeto ON fiscalia.mp_sujeto_domicilio(pol_caso_persona_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_fiscal (
  pol_caso_funcionario_id BIGSERIAL    PRIMARY KEY,
  mp_caso_funcionario_id  BIGINT       NOT NULL UNIQUE,
  pol_caso_id             BIGINT       NOT NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  ci                      VARCHAR(30)  NOT NULL,
  tipo_responsable_id     INTEGER      NOT NULL,
  estado                  SMALLINT     NOT NULL DEFAULT 1,
  homologado              BOOLEAN      NOT NULL DEFAULT false,
  payload                 JSONB        NOT NULL,
  created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_fiscal_caso ON fiscalia.mp_caso_fiscal(pol_caso_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_actividad (
  pol_caso_actividad_id BIGSERIAL    PRIMARY KEY,
  mp_caso_actividad_id  BIGINT       NOT NULL UNIQUE,
  pol_caso_id           BIGINT       NOT NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  actividad_id          INTEGER      NOT NULL,
  archivo_hash          VARCHAR(255) NOT NULL,
  tipo_solicitud_id     INTEGER      NULL,
  estado                SMALLINT     NOT NULL DEFAULT 1,
  homologado            BOOLEAN      NOT NULL DEFAULT false,
  payload               JSONB        NOT NULL,
  created_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_actividad_caso ON fiscalia.mp_caso_actividad(pol_caso_id);
CREATE INDEX IF NOT EXISTS idx_mp_caso_actividad_hash ON fiscalia.mp_caso_actividad(archivo_hash);

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_juzgado (
  id                  BIGSERIAL    PRIMARY KEY,
  pol_caso_id         BIGINT       NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  pol_caso_persona_id BIGINT       NULL REFERENCES fiscalia.mp_caso_sujeto(pol_caso_persona_id),
  juzgado_id          INTEGER      NOT NULL,
  homologado          BOOLEAN      NOT NULL DEFAULT false,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_mp_caso_juzgado_destino CHECK (pol_caso_id IS NOT NULL OR pol_caso_persona_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_juzgado_caso ON fiscalia.mp_caso_juzgado(pol_caso_id) WHERE pol_caso_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS fiscalia.mp_caso_agenda (
  pol_agenda_id           BIGSERIAL    PRIMARY KEY,
  pol_caso_id             BIGINT       NOT NULL REFERENCES fiscalia.mp_caso(pol_caso_id),
  oj_audiencia_id         BIGINT       NOT NULL,
  oj_audiencia_detalle_id BIGINT       NOT NULL UNIQUE,
  juzgado_id              INTEGER      NOT NULL,
  fecha_hora_inicio       TIMESTAMPTZ  NOT NULL,
  fecha_hora_fin          TIMESTAMPTZ  NOT NULL,
  estado                  SMALLINT     NOT NULL DEFAULT 1,
  homologado              BOOLEAN      NOT NULL DEFAULT false,
  payload                 JSONB        NOT NULL,
  created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_caso_agenda_caso ON fiscalia.mp_caso_agenda(pol_caso_id);

CREATE TABLE IF NOT EXISTS fiscalia.mp_reserva (
  pol_reserva_id    BIGSERIAL    PRIMARY KEY,
  tabla             SMALLINT     NOT NULL CHECK (tabla IN (1, 2, 3)),
  tabla_id          BIGINT       NOT NULL,
  estado            INTEGER      NOT NULL,
  fecha_fin_reserva TIMESTAMPTZ  NULL,
  homologado        BOOLEAN      NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_mp_reserva_destino ON fiscalia.mp_reserva(tabla, tabla_id);

COMMENT ON TABLE fiscalia.mp_caso_delito              IS 'Staging de delitos del caso MP (3.3–3.6)';
COMMENT ON TABLE fiscalia.mp_caso_sujeto              IS 'Staging de sujetos del caso MP (3.7/3.8); persona natural o jurídica completa en payload';
COMMENT ON TABLE fiscalia.mp_sujeto_abogado           IS 'Staging de abogados del sujeto MP (3.9/3.10)';
COMMENT ON TABLE fiscalia.mp_sujeto_situacion_juridica IS 'Staging de situaciones jurídicas del sujeto MP (3.11)';
COMMENT ON TABLE fiscalia.mp_sujeto_domicilio         IS 'Staging de domicilios del sujeto MP (3.12)';
COMMENT ON TABLE fiscalia.mp_caso_fiscal              IS 'Staging de fiscales del caso MP (3.13/3.14)';
COMMENT ON TABLE fiscalia.mp_caso_actividad           IS 'Staging de actividades/actos investigativos MP (3.15); meta_data polimórfico en payload';
COMMENT ON TABLE fiscalia.mp_caso_juzgado             IS 'Historial de asignación de juzgado a caso o sujeto (3.17/3.18)';
COMMENT ON TABLE fiscalia.mp_caso_agenda              IS 'Staging de agenda de audiencias MP (3.19/3.20)';
COMMENT ON TABLE fiscalia.mp_reserva                  IS 'Historial de reservas de caso/sujeto/actividad (3.16)';
