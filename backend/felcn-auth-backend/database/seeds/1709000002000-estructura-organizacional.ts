import { Distrital } from '@/core/estructura/entity/distrital.entity'
import { Grupo } from '@/core/estructura/entity/grupo.entity'
import { Unidad } from '@/core/estructura/entity/unidad.entity'
import { USUARIO_SISTEMA } from '@/common/constants'
import { MigrationInterface, QueryRunner } from 'typeorm'

/**
 * Seed: Estructura organizacional FELCN Bolivia
 * Datos representativos de la jerarquía: Unidad → Distrital → Grupo
 */
export class estructuraOrganizacional1709000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Unidades regionales (una por departamento + Dirección Nacional)
    const unidadesData = [
      { abreviatura: 'DIRN', descripcion: 'Dirección Nacional FELCN', esOperativaAdmin: false },
      { abreviatura: 'UFLCN-LP', descripcion: 'Unidad FELCN La Paz', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-CBBA', descripcion: 'Unidad FELCN Cochabamba', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-SC', descripcion: 'Unidad FELCN Santa Cruz', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-OR', descripcion: 'Unidad FELCN Oruro', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-PT', descripcion: 'Unidad FELCN Potosí', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-CH', descripcion: 'Unidad FELCN Chuquisaca', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-BE', descripcion: 'Unidad FELCN Beni', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-PD', descripcion: 'Unidad FELCN Pando', esOperativaAdmin: true },
      { abreviatura: 'UFLCN-TJ', descripcion: 'Unidad FELCN Tarija', esOperativaAdmin: true },
    ]

    const unidades = await queryRunner.manager.save(
      unidadesData.map(
        (u) =>
          new Unidad({
            ...u,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
      )
    )

    const u = (abv: string) => unidades.find((x) => x.abreviatura === abv)!

    // 2. Distritales (divisiones territoriales dentro de cada unidad)
    const distritalesData = [
      // Dirección Nacional
      { idUnidad: u('DIRN').id, descripcion: 'Unidad Administrativa Central' },
      // La Paz (dos distritos: ciudad y El Alto)
      { idUnidad: u('UFLCN-LP').id, descripcion: 'Distrital La Paz' },
      { idUnidad: u('UFLCN-LP').id, descripcion: 'Distrital El Alto' },
      // Cochabamba (ciudad y zona Chapare)
      { idUnidad: u('UFLCN-CBBA').id, descripcion: 'Distrital Cochabamba' },
      { idUnidad: u('UFLCN-CBBA').id, descripcion: 'Distrital Chapare' },
      // Santa Cruz (ciudad y corredor Yapacaní)
      { idUnidad: u('UFLCN-SC').id, descripcion: 'Distrital Santa Cruz' },
      { idUnidad: u('UFLCN-SC').id, descripcion: 'Distrital Yapacaní' },
      // Resto: un distrital por unidad
      { idUnidad: u('UFLCN-OR').id, descripcion: 'Distrital Oruro' },
      { idUnidad: u('UFLCN-PT').id, descripcion: 'Distrital Potosí' },
      { idUnidad: u('UFLCN-CH').id, descripcion: 'Distrital Sucre' },
      { idUnidad: u('UFLCN-BE').id, descripcion: 'Distrital Trinidad' },
      { idUnidad: u('UFLCN-BE').id, descripcion: 'Distrital Rurrenabaque' },
      { idUnidad: u('UFLCN-PD').id, descripcion: 'Distrital Cobija' },
      { idUnidad: u('UFLCN-TJ').id, descripcion: 'Distrital Tarija' },
      { idUnidad: u('UFLCN-TJ').id, descripcion: 'Distrital Yacuiba' },
    ]

    const distritales = await queryRunner.manager.save(
      distritalesData.map(
        (d) =>
          new Distrital({
            ...d,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
      )
    )

    const d = (desc: string) => distritales.find((x) => x.descripcion === desc)!

    // 3. Grupos operacionales (equipos de trabajo dentro de cada distrital)
    const gruposData = [
      // Dirección Nacional
      { idDistrital: d('Unidad Administrativa Central').id, descripcion: 'Grupo Administrativo Central' },
      // La Paz
      { idDistrital: d('Distrital La Paz').id, descripcion: 'Grupo Operativo La Paz' },
      { idDistrital: d('Distrital La Paz').id, descripcion: 'Grupo de Inteligencia La Paz' },
      { idDistrital: d('Distrital El Alto').id, descripcion: 'Grupo Operativo El Alto' },
      // Cochabamba
      { idDistrital: d('Distrital Cochabamba').id, descripcion: 'Grupo Operativo Cochabamba' },
      { idDistrital: d('Distrital Cochabamba').id, descripcion: 'Grupo de Inteligencia Cochabamba' },
      { idDistrital: d('Distrital Chapare').id, descripcion: 'Grupo Operativo Chapare' },
      { idDistrital: d('Distrital Chapare').id, descripcion: 'Grupo Interdicción Chapare' },
      // Santa Cruz
      { idDistrital: d('Distrital Santa Cruz').id, descripcion: 'Grupo Operativo Santa Cruz' },
      { idDistrital: d('Distrital Santa Cruz').id, descripcion: 'Grupo de Inteligencia Santa Cruz' },
      { idDistrital: d('Distrital Yapacaní').id, descripcion: 'Grupo Operativo Yapacaní' },
      // Resto
      { idDistrital: d('Distrital Oruro').id, descripcion: 'Grupo Operativo Oruro' },
      { idDistrital: d('Distrital Potosí').id, descripcion: 'Grupo Operativo Potosí' },
      { idDistrital: d('Distrital Sucre').id, descripcion: 'Grupo Operativo Sucre' },
      { idDistrital: d('Distrital Trinidad').id, descripcion: 'Grupo Operativo Trinidad' },
      { idDistrital: d('Distrital Rurrenabaque').id, descripcion: 'Grupo Operativo Rurrenabaque' },
      { idDistrital: d('Distrital Cobija').id, descripcion: 'Grupo Operativo Cobija' },
      { idDistrital: d('Distrital Tarija').id, descripcion: 'Grupo Operativo Tarija' },
      { idDistrital: d('Distrital Yacuiba').id, descripcion: 'Grupo Operativo Yacuiba' },
    ]

    await queryRunner.manager.save(
      gruposData.map(
        (g) =>
          new Grupo({
            ...g,
            estado: 'ACTIVO',
            transaccion: 'SEEDS',
            usuarioCreacion: USUARIO_SISTEMA,
          })
      )
    )
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
