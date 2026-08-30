import { RolEnum } from '@/core/authorization/rol.enum'
import { Rol } from '@/core/authorization/entity/rol.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Rol INTELIGENCIA — ya existía en la base real (creado a mano, nunca
 * versionado) con 19 usuarios activos. Es funcionalidad de Fase 2 (sus
 * módulos viven en frontend/(fase_2)/), pero se mantiene y versiona porque
 * hay usuarios reales usándola hoy — decisión explícita del usuario
 * (29/08/2026): "INTELIGENCIA se mantiene y adiciona toda su vinculación de
 * tablas en seeders y migrations".
 */
export class rolInteligencia1786810000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const rol = new Rol({
      rol: RolEnum.INTELIGENCIA,
      nombre: 'Inteligencia',
      descripcion: 'Inteligencia',
      estado: 'ACTIVO',
      transaccion: 'SEEDS',
      usuarioCreacion: USUARIO_SISTEMA,
    })
    await queryRunner.manager.save(rol)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
