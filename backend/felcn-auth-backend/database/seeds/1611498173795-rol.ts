import { RolEnum } from '@/core/authorization/rol.enum'
import { Rol } from '@/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

export class rol1611498173795 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.USUARIO,
        nombre: 'USUARIO',
        descripcion: 'Individuo que utiliza el sistema.',
      },
      {
        rol: RolEnum.ADMINISTRADOR,
        nombre: 'ADMINISTRADOR',
        descripcion:
          'Responsable de la gestión y supervisión general del sistema.',
      },
    ]
    const roles = items.map((item) => {
      return new Rol({
        rol: item.rol,
        nombre: item.nombre,
        descripcion: item.descripcion,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    })
    await queryRunner.manager.save(roles)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
