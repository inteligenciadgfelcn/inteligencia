import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Autogestión de perfil (Estructura FELCN): el usuario recién registrado
 * (rol USUARIO, sin Unidad/Distrital/Grupo/Grado/Número de Pase) completa
 * esa información una única vez desde su perfil. `fecha_perfil_completado`
 * marca ese momento — mientras sea NULL, el frontend obliga a completar el
 * perfil antes de usar el resto del sistema; una vez seteada, esos campos
 * quedan de solo lectura para el usuario (solo un administrador puede
 * modificarlos desde /admin/usuarios).
 */
export class fechaPerfilCompletado1787900000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        ADD COLUMN fecha_perfil_completado timestamp NULL;
    `)

    await queryRunner.query(`
      COMMENT ON COLUMN usuario.usuario.fecha_perfil_completado IS
        'Fecha en que el usuario completó por única vez su Estructura FELCN desde su perfil. NULL = pendiente.';
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE usuario.usuario
        DROP COLUMN IF EXISTS fecha_perfil_completado;
    `)
  }
}
