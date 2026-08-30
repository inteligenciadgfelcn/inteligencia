import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * `numero_pase` existía en la base real (agregada a mano, fuera de cualquier
 * migración) antes de que `quitarDefaultNumeroPase1787800000000` le sacara un
 * default/NOT NULL espurio. Un servidor que arranque desde un schema vacío y
 * corra las migraciones en orden nunca la había creado — esta migración
 * cierra ese hueco, creándola ya en el estado final que espera la entidad
 * (`usuario.entity.ts`: nullable, sin default), para que la migración
 * siguiente (que solo le saca el default/NOT NULL) corra como no-op.
 */
export class agregarNumeroPase1787700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ADD COLUMN IF NOT EXISTS numero_pase VARCHAR(20) NULL;
    `)

    await queryRunner.query(`
      COMMENT ON COLUMN usuario.usuario.numero_pase IS 'Número de pase del usuario';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        DROP COLUMN IF EXISTS numero_pase;
    `)
  }
}
