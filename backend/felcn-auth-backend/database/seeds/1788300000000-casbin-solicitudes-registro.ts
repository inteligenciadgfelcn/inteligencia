import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Políticas para el nuevo módulo de "Solicitudes de registro" (autorregistro
 * en 2 pasos). Los endpoints de solicitud (acceso/completar) son públicos y
 * no pasan por CasbinGuard; solo la administración (listar/ver/aprobar/
 * rechazar) requiere política, restringida a ADMINISTRADOR.
 */
export class casbinSolicitudesRegistro1788300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/admin/usuarios/solicitudes-registro': {
        [RolEnum.ADMINISTRADOR]: 'read|update',
      },
    }

    const backendRoutes: CasbinValue = {
      '/api/usuarios/solicitudes-registro': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
      '/api/usuarios/solicitudes-registro/:id': {
        [RolEnum.ADMINISTRADOR]: 'GET',
      },
      '/api/usuarios/solicitudes-registro/:id/aprobar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/usuarios/solicitudes-registro/:id/rechazar': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
    }

    const registrarCasbin = async (valoresCasbin: CasbinValue, tipo: string) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        for (const rolName of Object.keys(valoresCasbin[routePath])) {
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: valoresCasbin[routePath][rolName],
            v3: tipo,
          })
          await queryRunner.manager.save(datosRegistro)
        }
      }
    }

    await registrarCasbin(frontendRoutes, 'frontend')
    await registrarCasbin(backendRoutes, 'backend')
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
