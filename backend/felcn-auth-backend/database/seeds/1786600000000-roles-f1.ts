/**
 * Sistema Nacional de Inteligencia de la FELCN — Fase 1
 * Autoría: Ing. Erika Carmiña Camargo Salvatierra · Ing. Eitner Montero
 * Proyecto BOLEU1 (UNODC) — DG-FELCN
 */
import { RolEnum } from '@/core/authorization/rol.enum'
import { Rol } from '@/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Seed exclusivo para los roles de acceso por módulo. Se mantiene separado
 * del seed base de roles (1611498173795-rol.ts) para poder versionar y
 * ampliar estos roles sin tocar los roles base del sistema.
 */
export class rolesModulos1786600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      {
        rol: RolEnum.OPERATIVO,
        nombre: 'LISTADO DE OPERATIVOS',
        descripcion: 'Acceso al módulo de Listado de Operativos',
      },
      {
        rol: RolEnum.INVESTIGADOR,
        nombre: 'INVESTIGADOR',
        descripcion: 'Personal encargado de las tareas de investigación.',
      },
      {
        rol: RolEnum.SEGUIMIENTO_JURIDICO,
        nombre: 'SEGUIMIENTO DE CASOS JURIDICO',
        descripcion: 'Acceso al Seguimiento de Casos Jurídico.',
      },
      {
        rol: RolEnum.SEGUIMIENTO_CASOS,
        nombre: 'SEGUIMIENTO DE CASOS',
        descripcion: 'Acceso a Seguimiento de Casos.',
      },
      {
        rol: RolEnum.INVESTIGADOR_FINANCIERO,
        nombre: 'INVESTIGADOR FINANCIERO',
        descripcion: 'Acceso a Investigador Financiero. Paralelo',
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
  public async down(queryRunner: QueryRunner): Promise<void> { }
}
