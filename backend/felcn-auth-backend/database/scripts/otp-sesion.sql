-- ─────────────────────────────────────────────────────────────────────────────
-- Migración: Autenticación de Dos Factores (2FA) con OTP
-- Proyecto : SNI FELCN — felcn-auth-backend
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Columnas OTP en la tabla de usuario
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE usuario.usuario
  ADD COLUMN IF NOT EXISTS otp_habilitado BOOLEAN      NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS otp_canal      VARCHAR(20)           DEFAULT NULL;

COMMENT ON COLUMN usuario.usuario.otp_habilitado IS 'Indica si el usuario tiene habilitada la autenticación de dos factores (2FA/OTP)';
COMMENT ON COLUMN usuario.usuario.otp_canal      IS 'Canal de entrega del OTP por usuario: EMAIL | WHATSAPP | NULL (usa el canal por defecto del sistema)';

-- 2. Tabla de sesiones OTP (efímera)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuario.otp_sesion (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario      BIGINT        NOT NULL REFERENCES usuario.usuario(id) ON DELETE CASCADE,
  codigo_hash     VARCHAR(255)  NOT NULL,
  canal           VARCHAR(20)   NOT NULL,
  destino         VARCHAR(255)  NOT NULL,
  intentos        INTEGER       NOT NULL DEFAULT 0,
  consumido       BOOLEAN       NOT NULL DEFAULT false,
  expiracion      TIMESTAMPTZ   NOT NULL,
  fecha_creacion  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_otp_canal CHECK (canal IN ('EMAIL', 'WHATSAPP'))
);

CREATE INDEX IF NOT EXISTS idx_otp_sesion_usuario     ON usuario.otp_sesion(id_usuario);
CREATE INDEX IF NOT EXISTS idx_otp_sesion_expiracion  ON usuario.otp_sesion(expiracion);

COMMENT ON TABLE  usuario.otp_sesion                  IS 'Sesiones de verificación OTP en curso. Los registros expirados y consumidos se limpian periódicamente.';
COMMENT ON COLUMN usuario.otp_sesion.codigo_hash      IS 'Hash bcrypt del código OTP — nunca se almacena en texto plano';
COMMENT ON COLUMN usuario.otp_sesion.canal            IS 'Canal utilizado para el envío: EMAIL | WHATSAPP';
COMMENT ON COLUMN usuario.otp_sesion.destino          IS 'Dirección de correo o número de teléfono al que se envió el código';
COMMENT ON COLUMN usuario.otp_sesion.intentos         IS 'Contador de intentos fallidos de verificación';
COMMENT ON COLUMN usuario.otp_sesion.consumido        IS 'true cuando el OTP fue verificado correctamente o fue invalidado manualmente';
COMMENT ON COLUMN usuario.otp_sesion.expiracion       IS 'Timestamp UTC en que el OTP deja de ser válido';
