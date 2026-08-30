import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * El enlace de activación de cuenta (`codigo_activacion`) nunca vencía —
 * quedaba válido indefinidamente hasta usarse. Se agrega `codigo_activacion_expira`
 * (72hs desde su emisión o reenvío) para que un enlace viejo deje de servir.
 */
export class codigoActivacionExpira1788000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ADD COLUMN codigo_activacion_expira timestamp NULL;
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        DROP COLUMN IF EXISTS codigo_activacion_expira;
    `)
  }
}
