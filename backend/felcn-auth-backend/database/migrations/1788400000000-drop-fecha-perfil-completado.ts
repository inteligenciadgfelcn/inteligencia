import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Revierte 1787900000000-fecha-perfil-completado: el mecanismo de "completar
 * perfil una sola vez" se elimina — Grado/Grupo/Número de Pase ahora se
 * asignan al aprobar una solicitud de registro (ver solicitud_registro),
 * no por autogestión del usuario.
 */
export class dropFechaPerfilCompletado1788400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE usuario.usuario DROP COLUMN IF EXISTS fecha_perfil_completado;`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE usuario.usuario ADD COLUMN fecha_perfil_completado timestamp NULL;`
    )
  }
}
