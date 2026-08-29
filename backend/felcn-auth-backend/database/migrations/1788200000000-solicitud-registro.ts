import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Autoregistro rediseñado en 2 pasos, casi todo sin estado:
 * 1) Pedir acceso (solo correo) — no escribe nada acá, genera un JWT con el
 *    correo sellado y expiración corta.
 * 2) Completar el formulario detallado con ese link — recién si no hay
 *    conflicto con una cuenta real existente (mismo documento o correo) se
 *    crea la fila en esta tabla, completa, en PENDIENTE_APROBACION.
 *
 * No hay fila en `usuario` hasta que un admin aprueba explícitamente —
 * antes de esto, un autorregistro activado quedaba con cuenta real y rol
 * USUARIO sin que ningún admin interviniera.
 */
export class solicitudRegistro1788200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE usuario.solicitud_registro (
        id uuid NOT NULL DEFAULT gen_random_uuid(),
        estado varchar(20) NOT NULL DEFAULT 'PENDIENTE_APROBACION',
        nombres varchar(100) NOT NULL,
        primer_apellido varchar(100) NULL,
        segundo_apellido varchar(100) NULL,
        nro_documento varchar(50) NOT NULL,
        fecha_nacimiento date NOT NULL,
        correo_electronico varchar(255) NOT NULL,
        telefono varchar(20) NOT NULL,
        id_grado integer NOT NULL,
        numero_pase varchar(20) NOT NULL,
        fecha_resolucion timestamp NULL,
        id_admin_resolutor bigint NULL,
        comentario_rechazo varchar(500) NULL,
        id_usuario_creado bigint NULL,
        fecha_creacion timestamp NOT NULL DEFAULT now(),
        CONSTRAINT solicitud_registro_pkey PRIMARY KEY (id)
      );
    `)

    await queryRunner.query(`
      CREATE INDEX idx_solicitud_registro_estado
        ON usuario.solicitud_registro (estado);
    `)
    await queryRunner.query(`
      ALTER TABLE usuario.solicitud_registro OWNER TO postgres;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS usuario.solicitud_registro;`)
  }
}
