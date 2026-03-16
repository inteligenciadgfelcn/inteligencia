import { Grado } from '@/core/estructura/entity/grado.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Seed: Grados militares/policiales FELCN
 * Incluye la jerarquía estándar de la Policía Boliviana
 */
export class grados1709000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const items = [
      { abreviatura: 'Gral.', descripcion: 'General', orden: 1 },
      { abreviatura: 'Cnel.', descripcion: 'Coronel', orden: 2 },
      { abreviatura: 'Tcnl.', descripcion: 'Teniente Coronel', orden: 3 },
      { abreviatura: 'My.', descripcion: 'Mayor', orden: 4 },
      { abreviatura: 'Cap.', descripcion: 'Capitán', orden: 5 },
      { abreviatura: 'Tte.', descripcion: 'Teniente', orden: 6 },
      { abreviatura: 'Sub-Tte.', descripcion: 'Sub Teniente', orden: 7 },
      { abreviatura: 'Sgto. 1ro.', descripcion: 'Sargento Primero', orden: 8 },
      { abreviatura: 'Sgto. 2do.', descripcion: 'Sargento Segundo', orden: 9 },
      { abreviatura: 'Cbte.', descripcion: 'Cabo', orden: 10 },
      { abreviatura: 'Ptro.', descripcion: 'Patrullero', orden: 11 },
      { abreviatura: 'Adm.', descripcion: 'Administrativo', orden: 12 },
    ]

    const grados = items.map(
      (item) =>
        new Grado({
          abreviatura: item.abreviatura,
          descripcion: item.descripcion,
          orden: item.orden,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
    )

    await queryRunner.manager.save(grados)
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
