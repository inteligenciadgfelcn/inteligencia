import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Seed: Políticas Casbin para el módulo de Estructura Organizacional FELCN
 * Cubre: grados, unidades, distritales, grupos
 */
export class casbinEstructura1709000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rutas frontend
    const frontendRoutes: CasbinValue = {
      '/admin/estructura/grados': {
        [RolEnum.ADMINISTRADOR]: 'read|create|update',
      },
      '/admin/estructura/unidades': {
        [RolEnum.ADMINISTRADOR]: 'read|create|update',
      },
      '/admin/estructura/distritales': {
        [RolEnum.ADMINISTRADOR]: 'read|create|update',
      },
      '/admin/estructura/grupos': {
        [RolEnum.ADMINISTRADOR]: 'read|create|update',
      },
    }

    // Rutas backend
    const backendRoutes: CasbinValue = {
      // Grados
      '/api/estructura/grados': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/estructura/grados/listado': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/estructura/grados/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/grados/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/grados/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      // Unidades
      '/api/estructura/unidades': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/estructura/unidades/listado': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/estructura/unidades/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/unidades/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/unidades/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      // Distritales
      '/api/estructura/distritales': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/estructura/distritales/listado': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/estructura/distritales/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/distritales/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/distritales/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },

      // Grupos
      '/api/estructura/grupos': {
        [RolEnum.ADMINISTRADOR]: 'GET|POST',
      },
      '/api/estructura/grupos/listado': {
        [RolEnum.TODOS]: 'GET',
      },
      '/api/estructura/grupos/:id': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/grupos/:id/activacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
      '/api/estructura/grupos/:id/inactivacion': {
        [RolEnum.ADMINISTRADOR]: 'PATCH',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
    ) => {
      for (const routePath of Object.keys(valoresCasbin)) {
        const rolNameList = Object.keys(valoresCasbin[routePath])
        for (const rolName of rolNameList) {
          const action = valoresCasbin[routePath][rolName]
          const datosRegistro = new CasbinRule({
            ptype: 'p',
            v0: rolName,
            v1: routePath,
            v2: action,
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
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
