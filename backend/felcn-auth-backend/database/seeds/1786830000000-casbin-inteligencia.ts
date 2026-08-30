import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Políticas Casbin del rol INTELIGENCIA — ya existían en la base real
 * (creadas a mano, nunca versionadas), tomadas tal cual de `servertest`
 * (14 políticas, todas de frontend — no hay políticas de backend para este
 * rol hoy). Mismo patrón que `1786700000000-casbin-roles-f1.ts`.
 */
export class casbinInteligencia1786830000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/casos_x/consulta': { [RolEnum.INTELIGENCIA]: 'read' },
      '/casos_x/listado': { [RolEnum.INTELIGENCIA]: 'read' },
      '/casos_x/registro': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/filiacion/parentesco': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/filiacion/registro': { [RolEnum.INTELIGENCIA]: 'create|update|read' },
      '/filiacion/tarjeta_prontuaria': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/inteligencia/actualizacion': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/inteligencia/antecedentes': { [RolEnum.INTELIGENCIA]: 'read' },
      '/inteligencia/buscar_operativo': { [RolEnum.INTELIGENCIA]: 'read' },
      '/inteligencia/creacion': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/inteligencia/registro': { [RolEnum.INTELIGENCIA]: 'create|update|read' },
      '/inteligencia/servicio': { [RolEnum.INTELIGENCIA]: 'create|read|update' },
      '/interoperabilidad/inra': { [RolEnum.INTELIGENCIA]: 'read' },
      '/interoperabilidad/itv': { [RolEnum.INTELIGENCIA]: 'read' },
    }

    for (const routePath of Object.keys(frontendRoutes)) {
      for (const rolName of Object.keys(frontendRoutes[routePath])) {
        const datosRegistro = new CasbinRule({
          ptype: 'p',
          v0: rolName,
          v1: routePath,
          v2: frontendRoutes[routePath][rolName],
          v3: 'frontend',
        })
        await queryRunner.manager.save(datosRegistro)
      }
    }
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
