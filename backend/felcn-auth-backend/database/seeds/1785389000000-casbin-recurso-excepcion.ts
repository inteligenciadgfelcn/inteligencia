import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Política backend para el nuevo endpoint de gestión de excepciones de
 * recurso (GET /api/autorizacion/recursos) — sin esto, CasbinGuard rechaza
 * la ruta con 403 aunque el rol sea ADMINISTRADOR, porque no existe ninguna
 * política que la cubra todavía.
 */
export class casbinRecursoExcepcion1785389000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const backendRoutes: CasbinValue = {
      '/api/autorizacion/recursos': {
        [RolEnum.ADMINISTRADOR]: 'GET',
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
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
