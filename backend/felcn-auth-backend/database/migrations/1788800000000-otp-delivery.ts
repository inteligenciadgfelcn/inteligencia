import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Trazabilidad de entregas OTP por WhatsApp (Cloud API de Meta) — ya existía
 * en la base real de `servertest` (aplicado a mano desde
 * `database/scripts/otp-delivery.sql`, nunca versionado como migración
 * TypeORM). Coincide con
 * `external-services/mensajeria/whatsapp/entity/otp-delivery.entity.ts`.
 * Vive en el schema `proyecto`, no en `usuario` (a diferencia de
 * `otp_sesion`).
 */
export class otpDelivery1788800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS proyecto.otp_delivery (
        id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id      BIGINT        NULL,
        channel      VARCHAR(30)   NOT NULL DEFAULT 'whatsapp',
        message_id   VARCHAR(255)  NULL UNIQUE,
        recipient    VARCHAR(30)   NOT NULL,
        status       VARCHAR(20)   NOT NULL DEFAULT 'requested',
        error_detail TEXT          NULL,
        created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
        updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

        CONSTRAINT chk_otp_delivery_status
          CHECK (status IN ('requested', 'sent', 'delivered', 'read', 'failed')),
        CONSTRAINT chk_otp_delivery_channel
          CHECK (channel IN ('whatsapp'))
      );
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_otp_delivery_message_id
        ON proyecto.otp_delivery(message_id)
        WHERE message_id IS NOT NULL;
    `)

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_otp_delivery_user_id
        ON proyecto.otp_delivery(user_id)
        WHERE user_id IS NOT NULL;
    `)

    await queryRunner.query(`
      COMMENT ON TABLE  proyecto.otp_delivery              IS 'Trazabilidad de entregas OTP por canal WhatsApp (Cloud API de Meta)';
      COMMENT ON COLUMN proyecto.otp_delivery.message_id   IS 'ID devuelto por Meta al enviar el mensaje (wamid.XXX); se usa para correlacionar los webhooks de estado';
      COMMENT ON COLUMN proyecto.otp_delivery.recipient    IS 'Número de teléfono en formato E.164 al que se envió el OTP';
      COMMENT ON COLUMN proyecto.otp_delivery.status       IS 'Estado del envío: requested → sent → delivered → read | failed';
      COMMENT ON COLUMN proyecto.otp_delivery.error_detail IS 'Detalle del error de Meta (solo cuando status = failed)';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS proyecto.otp_delivery;`)
  }
}
