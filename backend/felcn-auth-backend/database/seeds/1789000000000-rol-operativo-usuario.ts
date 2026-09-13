import { Rol } from '@/core/authorization/entity/rol.entity'
import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Rol OPERATIVO_USUARIO — control adicional pedido tras detectar que se
 * estaban asignando roles sin ninguna consideración: un usuario con este rol
 * solo puede crear/editar usuarios con los roles USUARIO u OPERATIVO (ver
 * ROLES_ASIGNABLES_OPERATIVO_USUARIO en usuario.service.ts, que rechaza la
 * operación si se intenta asignar cualquier otro rol — validado en el
 * backend, no solo filtrado en el combo del frontend).
 *
 * Acceso: mismo alcance que ADMINISTRADOR sobre el módulo de Usuarios
 * únicamente (listar, crear, editar) — sin roles, políticas, módulos ni
 * parámetros.
 */
export class rolOperativoUsuario1789000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.save(
      new Rol({
        rol: RolEnum.OPERATIVO_USUARIO,
        nombre: 'OPERATIVO DE USUARIOS',
        descripcion:
          'Puede crear y editar usuarios, restringido a asignar únicamente los roles USUARIO y OPERATIVO.',
        estado: 'ACTIVO',
        transaccion: 'SEEDS',
        usuarioCreacion: USUARIO_SISTEMA,
      })
    )

    const frontendRoutes: CasbinValue = {
      '/admin/usuarios': {
        [RolEnum.OPERATIVO_USUARIO]: 'read|create|update',
      },
      '/admin/home': {
        [RolEnum.OPERATIVO_USUARIO]: 'read',
      },
      '/admin/perfil': {
        [RolEnum.OPERATIVO_USUARIO]: 'read|update',
      },
    }

    const backendRoutes: CasbinValue = {
      '/api/usuarios': {
        [RolEnum.OPERATIVO_USUARIO]: 'GET|POST',
      },
      '/api/usuarios/:id': {
        [RolEnum.OPERATIVO_USUARIO]: 'PATCH|GET',
      },
      '/api/autorizacion/roles': {
        [RolEnum.OPERATIVO_USUARIO]: 'GET',
      },
    }

    for (const [routes, tipo] of [
      [frontendRoutes, 'frontend'],
      [backendRoutes, 'backend'],
    ] as const) {
      for (const routePath of Object.keys(routes)) {
        for (const rolName of Object.keys(routes[routePath])) {
          await queryRunner.manager.save(
            new CasbinRule({
              ptype: 'p',
              v0: rolName,
              v1: routePath,
              v2: routes[routePath][rolName],
              v3: tipo,
            })
          )
        }
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
