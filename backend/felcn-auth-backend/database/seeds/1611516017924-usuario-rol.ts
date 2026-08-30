import { UsuarioRol } from '@/core/authorization/entity/usuario-rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

export class usuarioRol1611516017924 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Solo ADMINISTRADOR — ADMINISTRADOR ya incluye todo lo que tiene USUARIO
    // (/admin/home, /admin/perfil), asignarle también USUARIO era redundante.
    const items = [
      {
        id: '2',
        rol: '2',
        usuario: '1',
      },
    ]
    const usuariosRoles = items.map((item) => {
      return new UsuarioRol({
        idRol: item.rol,
        idUsuario: item.usuario,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(usuariosRoles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
