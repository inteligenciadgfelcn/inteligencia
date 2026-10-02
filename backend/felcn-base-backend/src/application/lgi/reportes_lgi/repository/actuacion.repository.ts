import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'

import { OperativoLgi } from '../../actuaciones/entities/operativoLgi.entity'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { AsignacionLgi } from '../../asignacion_lgi/entities/asignacion_lgi.entity'
import { PersonasImplicada } from '../../personas_implicadas/entities/personas_implicada.entity'

import { DistritalLgiRepository } from '../../parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '../../parametro/parametricas_lgi/repository/grupo.repository'

@Injectable()
export class ActuacionReporteRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,

    private readonly distritalLgiRepository: DistritalLgiRepository,
    private readonly grupoLgiRepository: GrupoLgiRepository,
  ) {}

  private get operativoRepository(): Repository<OperativoLgi> {
    return this.dataSource.getRepository(OperativoLgi)
  }

  private get bienesRepository(): Repository<BieneSecuestradoLgi> {
    return this.dataSource.getRepository(BieneSecuestradoLgi)
  }

  private get personasRepository(): Repository<PersonasImplicada> {
    return this.dataSource.getRepository(PersonasImplicada)
  }

  async obtenerDatosPrincipales(opId: number): Promise<any | null> {
    const datos = await this.operativoRepository
      .createQueryBuilder('o')
      .innerJoin(
        AsignacionLgi,
        'a',
        `
          a.casos_id = o.casos_id
          AND a.estado = :estado
        `
      )
      .leftJoin(
  '(SELECT * FROM parametricas.etapainvest)',
  'etapa',
  'etapa.eta_inv = a.eta_inv'
)
      .select([
        // Reporte: tabla operativo.
        'o.op_id AS "opId"',
        'o.casos_id AS "casosId"',
        'o.op_nrooper AS "numeroReporte"',
        'o.op_fechainf AS "fechaInforme"',
        'o.fechahoraing AS "fechaCreacionActuacion"',
        'o.id_tipo_informe AS "idTipoInforme"',
        'o.otro_informe AS "otroInforme"',

        // Correlativo por caso, conservando tu cálculo actual.
        `(
          SELECT COUNT(*)
          FROM operativo contador
          WHERE contador.casos_id = o.casos_id
            AND (
              contador.fechahoraing < o.fechahoraing
              OR (
                contador.fechahoraing = o.fechahoraing
                AND contador.op_id <= o.op_id
              )
            )
        )::int AS "numeroActuacion"`,

        `EXTRACT(
          YEAR FROM o.fechahoraing
        )::int AS "gestionActuacion"`,

        // Datos generales: tabla asignacion.
        'a.nombrecaso AS "nombreCaso"',
        'a.fechainicio AS "fechaInicio"',
        'a.nrocasofis AS "numeroCasoFiscalia"',
        'a.nrocasogiaef AS "numeroCasoGiaef"',
        'a.nrocaso AS "numeroCaso"',
        'a.cudifp AS "cudIfp"',
        'a.perddom AS "perdidaDominio"',
        'a.nrocasoperdom AS "numeroCasoPerdidaDominio"',
        'a.ianus AS "ianus"',
        'a.conformea AS "investigadorPrincipal"',
        'a.remitefiscal AS "fiscalAsignado"',
        'a.uni_abrev AS "unidadAbreviada"',
        'a.dis_id AS "disId"',
        'a.id_grupo AS "idGrupo"',
        'a.dptoav_id AS "dptoId"',
        'a.control_juridiccional AS "controlJurisdiccional"',

        // Actuación: tabla operativo.
        'o.op_lugar AS "lugarInvestigacion"',
        'o.op_descripcion AS "sintesis"',

        // Última etapa: tabla asignacion.
        'a.eta_inv AS "idEtapa"',
        'etapa.descripcion AS "etapaDescripcion"',
        'a.id_estado AS "idEstado"',
        'a.dias_otorgados AS "diasOtorgados"',

        /*
         * Lectura opcional de campos no confirmados en las capturas.
         * Si la columna no existe en asignacion, devuelve null.
         */
        `(to_jsonb(a) ->> 'tipocaso') AS "tipoAccion"`,
        `(to_jsonb(a) ->> 'inicio_caso') AS "formaInicio"`,
        `(to_jsonb(a) ->> 'fecha_recepcion_fiscalia')
          AS "fechaRecepcionFiscalia"`,

        `(to_jsonb(a) ->> 'tipologias_identificadas')
          AS "tipologiasIdentificadas"`,

        `(to_jsonb(a) ->> 'verbos_rectores')
          AS "verbosRectores"`,

        `(to_jsonb(a) ->> 'etapas_ciclo_lgi')
          AS "etapasCicloLgi"`,
      ])
      .where('o.op_id = :opId', { opId })
      .andWhere('o.estado = :estado')
      .setParameter('estado', 'ACTIVO')
      .getRawOne()

    if (!datos) {
      return null
    }

    // Descripciones institucionales mediante la conexión DB_AUTH.
    const [distrital, grupo] = await Promise.all([
      datos.disId != null
        ? this.distritalLgiRepository.findOne(Number(datos.disId))
        : Promise.resolve(null),

      datos.idGrupo != null
        ? this.grupoLgiRepository.findOne(Number(datos.idGrupo))
        : Promise.resolve(null),
    ])

    return {
      ...datos,

      regional: distrital?.descripcion ?? null,
      unidad: distrital?.unidad ?? null,
      idUnidad: distrital?.idUnidad ?? null,

      descripcionGrupo: grupo?.descripcion ?? null,
      puesto: grupo?.descripcion ?? null,

      // División regional tomada de la descripción de la distrital.
      divisionRegional: distrital?.descripcion ?? null,
    }
  }

  async obtenerBienes(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.bienesRepository
      .createQueryBuilder('bien')
      .leftJoinAndSelect('bien.categoriaTipo', 'categoriaTipo')
      .leftJoinAndSelect('bien.tipoVinculo', 'tipoVinculo')
      .leftJoinAndSelect('bien.caracteristicas', 'caracteristica')
      .leftJoinAndSelect(
        'bien.fotografias',
        'fotografia',
        'fotografia.estado = :estado'
      )
      .where('bien.opId = :opId', { opId })
      .andWhere('bien.estado = :estado', {
        estado: 'ACTIVO',
      })
      .orderBy('bien.itembiensecId', 'ASC')
      .addOrderBy('fotografia.fotobienId', 'ASC')
      .getMany()
  }

  async obtenerPersonasAfectadas(
    casosId: number | string
  ): Promise<PersonasImplicada[]> {
    return this.personasRepository
      .createQueryBuilder('persona')
      .where('persona.caso_id = :casosId', { casosId })
      .andWhere('persona.estado = :estado', {
        estado: true,
      })
      .orderBy('persona.de_id', 'ASC')
      .getMany()
  }

  async obtenerNumerosCasosPrecedentes(
    opId: number
  ): Promise<string[]> {
    const filas: { numeroCaso: string }[] =
      await this.dataSource.query(
        `
          SELECT DISTINCT
            UPPER(TRIM(p.nrocasopre)) AS "numeroCaso"
          FROM public.operativo o
          INNER JOIN public.presedencia p
            ON p.casos_id = o.casos_id
          WHERE o.op_id = $1
            AND o.estado = 'ACTIVO'
            AND p.estado = 'ACTIVO'
            AND NULLIF(TRIM(p.nrocasopre), '') IS NOT NULL
        `,
        [opId]
      )

    return filas.map((fila) => fila.numeroCaso)
  }

  async obtenerReporteCompleto(opId: number) {
    const datosPrincipales =
      await this.obtenerDatosPrincipales(opId)

    if (!datosPrincipales) {
      return null
    }

    // Conservar bigint como string evita pérdida de precisión.
    const casosId = String(datosPrincipales.casosId)

    const [bienes, personasAfectadas] = await Promise.all([
      this.obtenerBienes(opId),
      this.obtenerPersonasAfectadas(casosId),
    ])

    return {
      datosPrincipales,
      bienes,
      personasAfectadas,
    }
  }
}