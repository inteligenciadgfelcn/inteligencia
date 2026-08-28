import { Modulo, Propiedades } from '@/core/authorization/entity/modulo.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Agrega "Solicitudes de registro" como submenú de Configuración (mismo
 * padre que "Usuarios"), sin el cual la política casbin de
 * 1788300000000-casbin-solicitudes-registro no alcanza para que el ítem
 * aparezca en el sidebar — obtenerPermisosPorRol filtra el árbol de
 * `modulo` por url, y sin esta fila la url no existe ahí.
 */
export class moduloSolicitudesRegistro1788500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const moduloPadre = await queryRunner.manager.findOneByOrFail(Modulo, {
      url: '/configuraciones',
    })

    const propiedades: Propiedades = {
      icono: 'supervisor_account',
      descripcion: 'Revisión de solicitudes de autorregistro',
      orden: 6,
    }

    await queryRunner.manager.save(
      new Modulo({
        nombre: 'solicitudes-registro',
        url: '/admin/usuarios/solicitudes-registro',
        label: 'Solicitudes de registro',
        idModulo: moduloPadre.id,
        propiedades,
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    )
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
