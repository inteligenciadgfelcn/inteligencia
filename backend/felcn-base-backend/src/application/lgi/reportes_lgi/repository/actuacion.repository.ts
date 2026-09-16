import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { OperativoLgi } from '../../actuaciones/entities/operativoLgi.entity'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { AsignacionLgi } from '../../asignacion_lgi/entities/asignacion_lgi.entity'
import { EtapaLgi } from '../../parametro/etapa/entities/etapa.entity'
import { PersonasImplicada } from '../../personas_implicadas/entities/personas_implicada.entity'

@Injectable()
export class ActuacionReporteRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
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
    return this.operativoRepository
      .createQueryBuilder('o')
      .innerJoin(
        AsignacionLgi,
        'a',
        `
        a.casos_id = o.casos_id
        AND a.estado = :estado
      `
      )
      .leftJoin(EtapaLgi, 'etapa', 'etapa.etId = o.idEtapa')
      .select([
        // Reporte
        'o.op_id AS "opId"',
        'o.casos_id AS "casosId"',
        'o.op_nrooper AS "numeroReporte"',
        'o.op_fechainf AS "fechaInforme"',
        'o.fechahoraing AS "fechaCreacionActuacion"',
        'o.id_tipo_informe AS "idTipoInforme"',
        'o.otro_informe AS "otroInforme"',

        /*
         * Número correlativo de la actuación dentro
         * del mismo caso.
         *
         * No se reinicia cuando cambia el año.
         */
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

        /*
         * Año en el que fue creada la actuación.
         */
        `EXTRACT(
        YEAR FROM o.fechahoraing
      )::int AS "gestionActuacion"`,

        // Acción
        'a.tipocaso AS "tipoAccion"',
        'a.nombrecaso AS "nombreCaso"',
        'a.fechainicio AS "fechaInicio"',
        'a.nrocasofis AS "numeroCasoFiscalia"',
        'a.nrocasogiaef AS "numeroCasoGiaef"',
        'a.nrocaso AS "numeroCaso"',
        'a.nrocasoifp AS "numeroCasoIfp"',
        'a.cudifp AS "cudIfp"',
        'a.perddom AS "perdidaDominio"',
        'a.nrocasoperdom AS "numeroCasoPerdidaDominio"',
        'a.ianus AS "ianus"',
        'a.conformea AS "investigadorPrincipal"',
        'a.remitefiscal AS "fiscalAsignado"',
        'a.remitefiscal AS "fiscalAsignado"',
        'a.descripcion_grupo AS "divisionRegional"',
        'a.uni_abrev AS "unidadAbreviada"',
        'a.dis_id AS "disId"',

        // Actuación o novedad
        'o.op_lugar AS "lugarInvestigacion"',
        'o.op_descripcion AS "sintesis"',
        'o.id_etapa AS "idEtapa"',
        'etapa.descripcion AS "etapaDescripcion"',
        'o.id_estado AS "idEstado"',
        'o.dpto_id AS "dptoId"',
        'o.prov_id AS "provId"',
        'o.loc_id AS "locId"',
        'o.uni_id AS "uniId"',
        'o.dis_id AS "divisionId"',
        'o.dias_otorgados AS "diasOtorgados"',
        'o.fecha_recepcion_fiscalia AS "fechaRecepcionFiscalia"',

        // Conclusiones
        'o.tipologias_identificadas AS "tipologiasIdentificadas"',
        'o.verbos_rectores AS "verbosRectores"',
        'o.etapas_ciclo_lgi AS "etapasCicloLgi"',
      ])
      .where('o.op_id = :opId', { opId })
      .andWhere('o.estado = :estado', {
        estado: 'ACTIVO',
      })
      .getRawOne()
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

  async obtenerReporteCompleto(opId: number) {
  const datosPrincipales =
    await this.obtenerDatosPrincipales(opId)

  if (!datosPrincipales) {
    return null
  }

  const casosId = Number(
    datosPrincipales.casosId
  )

  const [bienes, personasAfectadas] =
    await Promise.all([
      this.obtenerBienes(opId),

      this.obtenerPersonasAfectadas(
        casosId
      ),
    ])

  return {
    datosPrincipales,
    bienes,
    personasAfectadas,
  }
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
}
