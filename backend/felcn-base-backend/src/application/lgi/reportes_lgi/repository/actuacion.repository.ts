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
import {
  DatosPrincipalesReporte,
  obtenerSeccionEncabezado,
  obtenerSeccionDependencia,
  obtenerSeccionDatosCaso,
  obtenerSeccionResponsables,
  obtenerSeccionActuacion,
  obtenerSeccionEtapaProcesal,
  obtenerSeccionConclusiones,
} from '../mapper/reporte-secciones.mapper'
import { InvestigadorLgiRepository } from '../../investigadores/repository/investigador.repository'

@Injectable()
export class ActuacionReporteRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,
    private readonly distritalLgiRepository: DistritalLgiRepository,
    private readonly grupoLgiRepository: GrupoLgiRepository,
    private readonly investigadorLgiRepository: InvestigadorLgiRepository
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

  async obtenerDatosPrincipales(
    opId: number
  ): Promise<DatosPrincipalesReporte | null> {
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
      .leftJoin(
        '(SELECT * FROM parametricas.tipo_informe)',
        'ti',
        'ti.id = o.id_tipo_informe'
      )
      .select([
        // Identificación del reporte.
        'o.op_id AS "opId"',
        'o.casos_id AS "casosId"',
        'o.op_nrooper AS "numeroReporte"',
        'o.op_fechainf AS "fechaInforme"',
        'o.fechahoraing AS "fechaCreacionActuacion"',
        'o.id_tipo_informe AS "idTipoInforme"',
        'o.otro_informe AS "otroInforme"',

        // Correlativo de actuación por caso.
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

        // Datos generales del caso.
        'a.nombrecaso AS "nombreCaso"',
        'a.fechainicio AS "fechaInicio"',
        'a.nrocasofis AS "numeroCasoFiscalia"',
        'a.nrocasogiaef AS "numeroCasoGiaef"',
        'a.nrocaso AS "numeroCaso"',
        'a.cudifp AS "cudIfp"',
        'a.perddom AS "perdidaDominio"',
        'a.nrocasoperdom AS "numeroCasoPerdidaDominio"',
        'a.ianus AS "ianus"',

        // Responsables.
        'a.conformea AS "formaInicio"',
        'a.remitefiscal AS "fiscalAsignado"',
        'a.control_juridiccional AS "controlJurisdiccional"',

        // Dependencia institucional.
        'a.uni_abrev AS "unidadAbreviada"',
        'a.dis_id AS "disId"',
        'a.id_grupo AS "idGrupo"',

        // Ubicación y síntesis de la actuación.
        'a.dptoav_id AS "dptoId"',
        'o.op_lugar AS "lugarInvestigacion"',
        'o.op_descripcion AS "sintesis"',

        // Última etapa registrada en el caso.
        'a.eta_inv AS "idEtapa"',
        'etapa.descripcion AS "etapaDescripcion"',
        'a.id_estado AS "idEstado"',
        'a.dias_otorgados AS "diasOtorgados"',
        'ti.descripcion AS "tipoInformeDescripcion"',

        /*
         * Campos opcionales.
         * Si la clave no existe en la fila de asignacion,
         * devuelve null.
         *
         * ->> devuelve texto.
         */
        `(to_jsonb(a) ->> 'tipocaso')
          AS "tipoAccion"`,

        `(to_jsonb(a) ->> 'fecha_recepcion_fiscalia')
          AS "fechaRecepcionFiscalia"`,

        // Conclusiones.
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
      .getRawOne<DatosPrincipalesReporte>()

    if (!datos) {
      return null
    }

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

      divisionRegional: distrital?.descripcion ?? null,
    }
  }

  async obtenerInvestigadores(casosId: number | string): Promise<string[]> {
    const filas: { usuarioAsignado: string }[] = await this.dataSource.query(
      `
        SELECT DISTINCT
          TRIM(i.usuario_asignado) AS "usuarioAsignado"

        FROM public.investigador i

        WHERE i.casos_id = $1
          AND i.actual = true
          AND i.estado_investigador = 'ASIGNADO'
          AND NULLIF(TRIM(i.usuario_asignado), '') IS NOT NULL

        ORDER BY "usuarioAsignado"
      `,
      [casosId]
    )

    const pases = filas.map((fila) => fila.usuarioAsignado)

    return this.investigadorLgiRepository.obtenerNombresPorPases(pases)
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
      .where('persona.caso_id = :casosId', {
        casosId,
      })
      .andWhere('persona.estado = :estado', {
        estado: true,
      })
      .orderBy('persona.de_id', 'ASC')
      .getMany()
  }

  async obtenerNumerosCasosPrecedentes(opId: number): Promise<string[]> {
    const filas: { numeroCaso: string }[] = await this.dataSource.query(
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
          ORDER BY "numeroCaso"
        `,
      [opId]
    )

    return filas.map((fila) => fila.numeroCaso)
  }

  async obtenerReporteCompleto(opId: number) {
    const datos = await this.obtenerDatosPrincipales(opId)

    if (!datos) {
      return null
    }

    const casosId = String(datos.casosId)

    const [bienes, personasAfectadas, numerosCasosPrecedentes, investigadores, empresas] =
      await Promise.all([
        this.obtenerBienes(opId),
        this.obtenerPersonasAfectadas(casosId),
        this.obtenerNumerosCasosPrecedentes(opId),
        this.obtenerInvestigadores(casosId),
        this.obtenerEmpresas(opId),
      ])

    return {
      datosPrincipales: datos,
      encabezado: obtenerSeccionEncabezado(datos),
      dependenciaInstitucional: obtenerSeccionDependencia(datos),
      datosCaso: {
        ...obtenerSeccionDatosCaso(datos),
        numerosCasosPrecedentes,
      },
      responsables: obtenerSeccionResponsables({
        ...datos,
        investigadores,
      }),
      actuacion: obtenerSeccionActuacion(datos),
      etapaProcesal: obtenerSeccionEtapaProcesal(datos),
      personasAfectadas,
      bienes,
      empresas,
      conclusiones: obtenerSeccionConclusiones(datos),
    }
  }

  async obtenerReporteConclusiones(opId: number) {
    const datos = await this.obtenerDatosPrincipales(opId)

    if (!datos) {
      return null
    }

    return {
      encabezado: obtenerSeccionEncabezado(datos),

      datosCaso: obtenerSeccionDatosCaso(datos),

      conclusiones: obtenerSeccionConclusiones(datos),
    }
  }

  async obtenerEmpresas(opId: number): Promise<
  Array<{
    id: string
    nombre: string
    capitalSocial: string | null
  }>
> {
  return this.dataSource.query(
    `
      SELECT
        e.emp_id::text AS "id",
        e.nombre AS "nombre",
        e.capital_social AS "capitalSocial"
      FROM public.empresas e
      WHERE e.op_id = $1
      ORDER BY e.emp_id ASC
    `,
    [opId]
  )
}
}
