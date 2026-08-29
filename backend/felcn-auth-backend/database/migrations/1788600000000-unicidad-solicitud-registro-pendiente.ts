import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * El chequeo de duplicados en SolicitudRegistroService.completarFormulario es
 * SELECT-luego-INSERT — bajo dos requests concurrentes con el mismo documento
 * o correo, ambas pueden pasar el SELECT antes de que la otra haga commit del
 * INSERT (TOCTOU), colando dos solicitudes pendientes duplicadas. Verificado
 * empíricamente (29/08/2026): dos POST /completar simultáneos con el mismo
 * documento crearon 2 filas.
 *
 * Estos índices únicos parciales son la única barrera real: solo aplican
 * mientras estado = PENDIENTE_APROBACION, así que una vez resuelta una
 * solicitud (aprobada o rechazada) el documento/correo vuelve a estar libre
 * para un intento nuevo, igual que ya hace la validación a nivel de
 * aplicación.
 */
export class unicidadSolicitudRegistroPendiente1788600000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_solicitud_registro_documento_pendiente
        ON usuario.solicitud_registro (nro_documento)
        WHERE estado = 'PENDIENTE_APROBACION';
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX uq_solicitud_registro_correo_pendiente
        ON usuario.solicitud_registro (correo_electronico)
        WHERE estado = 'PENDIENTE_APROBACION';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS usuario.uq_solicitud_registro_documento_pendiente;`
    )
    await queryRunner.query(
      `DROP INDEX IF EXISTS usuario.uq_solicitud_registro_correo_pendiente;`
    )
  }
}
