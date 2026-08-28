import { Grado } from '@/core/estructura/entity/grado.entity'
import { MigrationInterface, QueryRunner } from 'typeorm'
import { USUARIO_SISTEMA } from '@/common/constants'

/**
 * Seed: Grados de la Policía Boliviana / FELCN.
 * Datos tomados tal cual de parametro.grado (BD felcn_auth_v3). Se conservan
 * los ids de origen para que coincidan con el resto de parametrización.
 */
export class grados1709000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA_PARAMETRO

    const items: {
      id: number
      abreviatura: string
      descripcion: string
      orden: number
    }[] = [
      {
        id: 1,
        abreviatura: 'Gral. Sup.',
        descripcion: 'General Superior',
        orden: 1,
      },
      {
        id: 2,
        abreviatura: 'Gral. My.',
        descripcion: 'General Mayor',
        orden: 2,
      },
      {
        id: 3,
        abreviatura: 'Gral. 1ro.',
        descripcion: 'General Primero',
        orden: 3,
      },
      { id: 4, abreviatura: 'Cnl. DESP.', descripcion: 'Coronel', orden: 4 },
      {
        id: 5,
        abreviatura: 'Tcnl. DEAP.',
        descripcion: 'Teniente Coronel',
        orden: 5,
      },
      { id: 6, abreviatura: 'My.', descripcion: 'Mayor', orden: 6 },
      { id: 7, abreviatura: 'Cap.', descripcion: 'Capitan', orden: 7 },
      { id: 8, abreviatura: 'Tte.', descripcion: 'Teniente', orden: 8 },
      { id: 9, abreviatura: 'Sbtte.', descripcion: 'Subteniente', orden: 9 },
      {
        id: 10,
        abreviatura: 'Sof. Sup.',
        descripcion: 'Suboficial Superior',
        orden: 10,
      },
      {
        id: 11,
        abreviatura: 'Sof. My.',
        descripcion: 'Suboficial Mayor',
        orden: 11,
      },
      {
        id: 12,
        abreviatura: 'Sof. 1ro.',
        descripcion: 'Suboficial Primero',
        orden: 12,
      },
      {
        id: 13,
        abreviatura: 'Sof. 2do.',
        descripcion: 'Suboficial Segundo',
        orden: 13,
      },
      {
        id: 14,
        abreviatura: 'Sgto. My.',
        descripcion: 'Sargento Mayor',
        orden: 14,
      },
      {
        id: 15,
        abreviatura: 'Sgto. 1ro.',
        descripcion: 'Sargento Primero',
        orden: 15,
      },
      {
        id: 16,
        abreviatura: 'Sgto. 2do.',
        descripcion: 'Sargento Segundo',
        orden: 16,
      },
      { id: 17, abreviatura: 'Sgto.', descripcion: 'Sargento', orden: 17 },
      {
        id: 18,
        abreviatura: 'Cnl. Serv.',
        descripcion: 'Coronel de Servicios',
        orden: 18,
      },
      {
        id: 19,
        abreviatura: 'Tcnl. Serv.',
        descripcion: 'Teniente Coronel de Servicios',
        orden: 19,
      },
      {
        id: 20,
        abreviatura: 'My. Serv.',
        descripcion: 'Mayor de Servicios',
        orden: 20,
      },
      {
        id: 21,
        abreviatura: 'Cap. Serv.',
        descripcion: 'Capitan de Servicios',
        orden: 21,
      },
      {
        id: 22,
        abreviatura: 'Tte. Serv.',
        descripcion: 'Teniente de Servicios',
        orden: 22,
      },
      {
        id: 23,
        abreviatura: 'Sbtte. Serv.',
        descripcion: 'Subteniente de Servicios',
        orden: 23,
      },
      {
        id: 24,
        abreviatura: 'Sof. Sup. Serv.',
        descripcion: 'Suboficial Superior de Servicios',
        orden: 24,
      },
      {
        id: 25,
        abreviatura: 'Sof. My. Serv.',
        descripcion: 'Suboficial Mayor de Servicios',
        orden: 25,
      },
      {
        id: 26,
        abreviatura: 'Sof. 1ro. Serv.',
        descripcion: 'Suboficial Primero de Servicios',
        orden: 26,
      },
      {
        id: 27,
        abreviatura: 'Sof. 2do. Serv.',
        descripcion: 'Suboficial Segundo de Servicios',
        orden: 27,
      },
      {
        id: 28,
        abreviatura: 'Sgto. My. Serv.',
        descripcion: 'Sargento Mayor de Servicios',
        orden: 28,
      },
      {
        id: 29,
        abreviatura: 'Sgto. 1ro. Serv.',
        descripcion: 'Sargento Primero de Servicios',
        orden: 29,
      },
      {
        id: 30,
        abreviatura: 'Sgto. 2do. Serv.',
        descripcion: 'Sargento Segundo de Servicios',
        orden: 30,
      },
      {
        id: 31,
        abreviatura: 'Sgto. Serv.',
        descripcion: 'Sargento de Servicios',
        orden: 31,
      },
      {
        id: 32,
        abreviatura: 'Jefe de Unidad I',
        descripcion: 'Jefe de Unidad I',
        orden: 32,
      },
      {
        id: 33,
        abreviatura: 'Jefe de Unidad II',
        descripcion: 'Jefe de Unidad II',
        orden: 33,
      },
      {
        id: 34,
        abreviatura: 'Jefe de Unidad III E',
        descripcion: 'Jefe de Unidad III Especialista I',
        orden: 34,
      },
      {
        id: 35,
        abreviatura: 'Jefe de Unidad IV Es',
        descripcion: 'Jefe de Unidad IV Especialista II',
        orden: 35,
      },
      {
        id: 36,
        abreviatura: 'Responsable I Especi',
        descripcion: 'Responsable I Especialista III',
        orden: 36,
      },
      {
        id: 37,
        abreviatura: 'Responsable II Profe',
        descripcion: 'Responsable II Profesional I',
        orden: 37,
      },
      {
        id: 38,
        abreviatura: 'Responsable III Prof',
        descripcion: 'Responsable III Profesional II',
        orden: 38,
      },
      {
        id: 39,
        abreviatura: 'Responsable IV Profe',
        descripcion: 'Responsable IV Profesional III',
        orden: 39,
      },
      {
        id: 40,
        abreviatura: 'Profesional IV',
        descripcion: 'Profesional IV',
        orden: 40,
      },
      {
        id: 41,
        abreviatura: 'Profesional V',
        descripcion: 'Profesional V',
        orden: 41,
      },
      {
        id: 42,
        abreviatura: 'Profesional VI',
        descripcion: 'Profesional VI',
        orden: 42,
      },
      {
        id: 43,
        abreviatura: 'Profesional VII',
        descripcion: 'Profesional VII',
        orden: 43,
      },
      {
        id: 44,
        abreviatura: 'Profesional VIII',
        descripcion: 'Profesional VIII',
        orden: 44,
      },
      {
        id: 45,
        abreviatura: 'Profesional IX',
        descripcion: 'Profesional IX',
        orden: 45,
      },
      { id: 46, abreviatura: 'Tecnico I', descripcion: 'Tecnico I', orden: 46 },
      {
        id: 47,
        abreviatura: 'Tecnico II',
        descripcion: 'Tecnico II',
        orden: 47,
      },
      {
        id: 48,
        abreviatura: 'Tecnico III',
        descripcion: 'Tecnico III',
        orden: 48,
      },
      {
        id: 49,
        abreviatura: 'Tecnico IV',
        descripcion: 'Tecnico IV',
        orden: 49,
      },
      { id: 50, abreviatura: 'Tecnico V', descripcion: 'Tecnico V', orden: 50 },
      {
        id: 51,
        abreviatura: 'Tecnico VI',
        descripcion: 'Tecnico VI',
        orden: 51,
      },
      {
        id: 52,
        abreviatura: 'Administrativo I',
        descripcion: 'Administrativo I',
        orden: 52,
      },
      {
        id: 53,
        abreviatura: 'Administrativo II',
        descripcion: 'Administrativo II',
        orden: 53,
      },
      {
        id: 54,
        abreviatura: 'Administrativo III',
        descripcion: 'Administrativo III',
        orden: 54,
      },
      {
        id: 55,
        abreviatura: 'Administrativo IV',
        descripcion: 'Administrativo IV',
        orden: 55,
      },
      {
        id: 56,
        abreviatura: 'Auxiliar I',
        descripcion: 'Auxiliar I',
        orden: 56,
      },
      {
        id: 57,
        abreviatura: 'Auxiliar II',
        descripcion: 'Auxiliar II',
        orden: 57,
      },
    ]

    const grados = items.map(
      (item) =>
        new Grado({
          id: item.id,
          abreviatura: item.abreviatura,
          descripcion: item.descripcion,
          orden: item.orden,
          estado: 'ACTIVO',
          transaccion: 'SEEDS',
          usuarioCreacion: USUARIO_SISTEMA,
        })
    )

    await queryRunner.manager.save(grados)

    // Alinear la secuencia con el MAX(id) insertado explícitamente
    await queryRunner.query(
      `SELECT setval(pg_get_serial_sequence('${schema}.grado', 'id'), (SELECT MAX(id) FROM ${schema}.grado), true)`
    )
  }

  /* eslint-disable */
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
