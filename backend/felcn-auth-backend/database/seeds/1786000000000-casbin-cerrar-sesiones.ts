import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Política backend para el nuevo endpoint de autogestión de sesiones
 * (DELETE /api/usuarios/cuenta/sesiones) — sin esto, CasbinGuard rechaza la
 * ruta con 403 para todos los roles, porque no existe ninguna política que
 * la cubra todavía. Mismo patrón que el resto de acciones de "cuenta"
 * (perfil, foto, contraseña): disponible para cualquier usuario autenticado.
 */
export class casbinCerrarSesiones1786000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const backendRoutes: CasbinValue = {
      '/api/usuarios/cuenta/sesiones': {
        [RolEnum.TODOS]: 'DELETE',
      },
    }

    for (const routePath of Object.keys(backendRoutes)) {
      for (const rolName of Object.keys(backendRoutes[routePath])) {
        const datosRegistro = new CasbinRule({
          ptype: 'p',
          v0: rolName,
          v1: routePath,
          v2: backendRoutes[routePath][rolName],
          v3: 'backend',
        })
        await queryRunner.manager.save(datosRegistro)
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
