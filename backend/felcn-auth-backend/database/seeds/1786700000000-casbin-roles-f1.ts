/**
 * Sistema Nacional de Inteligencia de la FELCN — Fase 1
 * Autoría: Ing. Erika Carmiña Camargo Salvatierra · Ing. Eitner Montero
 * Proyecto BOLEU1 (UNODC) — DG-FELCN
 */
import { CasbinRule } from '@/core/authorization/entity/casbin.entity'
import { RolEnum } from '@/core/authorization/rol.enum'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { CasbinValue } from './1617712857472-insert-casbin-rules'

/**
 * Seed: Políticas Casbin para los roles de la Fase 1
 * (INVESTIGADOR, OPERATIVO, SEGUIMIENTO_JURIDICO, SEGUIMIENTO_CASOS,
 * INVESTIGADOR_FINANCIERO).
 *
 * Basado en docs/roles_f1.sql. Los ids de ese script son solo de referencia:
 * aquí la PK (casbin_rule.id) la genera la secuencia — igual que el resto de
 * seeds Casbin (1617712857472, 1709000003000, ...), no se inserta a mano.
 * El resto de columnas (ptype, v0..v3) se respetan tal cual el script.
 */
export class casbinRolesFaseUno1786700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frontendRoutes: CasbinValue = {
      '/analisis/casos': {
        [RolEnum.INVESTIGADOR]: 'create|read|update|delete',
      },
      '/analisis/reportes': {
        [RolEnum.INVESTIGADOR]: 'read',
      },
      '/analisis/transporte': {
        [RolEnum.INVESTIGADOR]: 'create|read|delete|update',
      },
      '/analisis/transporte/reportes': {
        [RolEnum.INVESTIGADOR]: 'read',
      },
      '/analisis/reportes/vinculos': {
        [RolEnum.INVESTIGADOR]: 'read',
      },
      '/operativos/listado': {
        [RolEnum.OPERATIVO]: 'create|read|update|delete',
      },
      '/seguimientos/listado': {
        [RolEnum.SEGUIMIENTO_JURIDICO]: 'create|read|update|delete',
      },
      '/reportes/cuadros': {
        [RolEnum.SEGUIMIENTO_CASOS]: 'read',
      },
      '/reportes/cruzados': {
        [RolEnum.SEGUIMIENTO_CASOS]: 'read',
      },
      '/reportes/cruzados-all': {
        [RolEnum.SEGUIMIENTO_CASOS]: 'read',
      },
      'user-profile.jpeg': {
        [RolEnum.SEGUIMIENTO_CASOS]: 'read|update',
      },
      '/investigaciones/paralelo': {
        [RolEnum.INVESTIGADOR_FINANCIERO]: 'create|read',
      },
      '/investigaciones/lgi': {
        [RolEnum.INVESTIGADOR_FINANCIERO]: 'read',
      },
    }

    const backendRoutes: CasbinValue = {
      '/api/operativos/casos/unidad/:abreviaturaUnidad': {
        [RolEnum.OPERATIVO]: 'GET',
      },
      '/api/casos-paralelos': {
        [RolEnum.INVESTIGADOR_FINANCIERO]: 'POST',
      },
      '/api/casos-paralelos/buscar-por-unidad-resultado': {
        [RolEnum.INVESTIGADOR_FINANCIERO]: 'POST',
      },
    }

    const registrarCasbin = async (
      valoresCasbin: CasbinValue,
      tipo: string
    ) => {
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
