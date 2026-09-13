import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * El submenu "Parámetros" (Configuración > Parámetros, url /admin/parametros)
 * quedó sin funcionalidad real -- se reportó que no hace nada al ingresar.
 * Se inactiva el registro en `modulo` (mismo mecanismo que usa el CRUD de
 * Módulos vía ModuloService.inactivar) en vez de borrarlo, para no perder
 * el histórico ni romper una FK si en algún ambiente llegó a referenciarse.
 * El listado del sidebar filtra por estado = ACTIVO, así que esto alcanza
 * para que deje de mostrarse.
 */
export class inactivarModuloParametros1789100000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE usuario.modulo
      SET _estado = 'INACTIVO',
          _transaccion = 'ACTUALIZAR',
          _usuario_modificacion = '1',
          _fecha_modificacion = now()
      WHERE nombre = 'parametros' AND url = '/admin/parametros';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE usuario.modulo
      SET _estado = 'ACTIVO',
          _transaccion = 'ACTUALIZAR',
          _usuario_modificacion = '1',
          _fecha_modificacion = now()
      WHERE nombre = 'parametros' AND url = '/admin/parametros';
    `)
  }
}
