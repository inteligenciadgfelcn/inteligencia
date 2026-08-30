import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Marca de tiempo usada para invalidar de un saque cualquier "dispositivo de
 * confianza" (cookie OTP) emitido antes de este momento — se actualiza en el
 * mismo lugar donde ya se revocan los refresh tokens (revocarSesionesActivas),
 * así ambos mecanismos de sesión quedan revocados juntos.
 */
export class sesionesRevocadasDesde1788100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ADD COLUMN sesiones_revocadas_desde timestamp NULL;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        DROP COLUMN IF EXISTS sesiones_revocadas_desde;
    `)
  }
}
