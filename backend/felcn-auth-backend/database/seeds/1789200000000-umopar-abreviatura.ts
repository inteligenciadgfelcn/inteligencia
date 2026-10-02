import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * parametro.unidad: corrige la abreviatura de la fila id=1, "Unidad Movil
 * de Patrullaje Rural", de "UM" a "UMOPAR" -- la sigla real usada en
 * Bolivia para esta unidad. No se crea fila nueva (hubiera quedado
 * duplicada en el combo del formulario de operativo, que filtra por
 * es_operativa_admin = true -- ya en true en esta fila, no hace falta
 * tocarlo).
 *
 * Esta tabla también se lee desde felcn_siii vía FDW (auth_fdw.unidad),
 * así que este único UPDATE alcanza para ambas bases -- no hay nada que
 * sincronizar aparte.
 */
export class umoparAbreviatura1789200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE parametro.unidad
      SET abreviatura = 'UMOPAR',
          _transaccion = 'ACTUALIZAR',
          _usuario_modificacion = '1',
          _fecha_modificacion = now()
      WHERE id = 1 AND abreviatura = 'UM';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE parametro.unidad
      SET abreviatura = 'UM',
          _transaccion = 'ACTUALIZAR',
          _usuario_modificacion = '1',
          _fecha_modificacion = now()
      WHERE id = 1 AND abreviatura = 'UMOPAR';
    `)
  }
}
