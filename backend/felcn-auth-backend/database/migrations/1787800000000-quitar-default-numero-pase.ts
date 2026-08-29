import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * `usuario.usuario.numero_pase` tenía en la base real un `DEFAULT 'ABC-0001'`
 * y `NOT NULL` aplicados directamente en la BD (fuera de cualquier migración
 * de TypeORM) — desalineado de la entidad, que ya lo define `nullable: true`
 * sin default. Efecto: toda cuenta creada desde el autorregistro público
 * (`POST /usuarios/crear-cuenta`, que nunca envía `numeroPase`) quedaba con
 * el placeholder `'ABC-0001'` como si fuera un número de pase real.
 *
 * Se limpia el placeholder existente (bug conocido, no un valor real) y se
 * quita el default/NOT NULL para que el campo quede vacío hasta que un
 * administrador o el propio usuario lo complete.
 */
export class quitarDefaultNumeroPase1787800000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ALTER COLUMN numero_pase DROP DEFAULT,
        ALTER COLUMN numero_pase DROP NOT NULL;
    `)

    await queryRunner.query(`
      UPDATE usuario.usuario
      SET numero_pase = NULL
      WHERE numero_pase = 'ABC-0001';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ALTER COLUMN numero_pase SET DEFAULT 'ABC-0001';
    `)

    await queryRunner.query(`
      UPDATE usuario.usuario
      SET numero_pase = 'ABC-0001'
      WHERE numero_pase IS NULL;
    `)

    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ALTER COLUMN numero_pase SET NOT NULL;
    `)
  }
}
