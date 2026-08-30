import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../../shared/constants'
import { BuscarIngresoDto } from '../dto/buscar-ingreso.dto'

/**
 * Repositorio AsignacionesIngresoRepository
 * Consultas para el listado de asignaciones ingresadas / sin ingresar por distrital.
 * Origen: FRM-INF-ING.aspx.cs
 */
@Injectable()
export class AsignacionesIngresoRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) { }

  private readonly SELECT_BASE = `
    SELECT
      a.id_caso               AS "idCaso",
      u.descripcion           AS "unidad",
      d.descripcion           AS "distrital",
      g.descripcion           AS "grupo",
      a.numero_caso           AS "numeroCaso",
      a.numero_caso_per_dom   AS "numeroCasoPerDom",
      a.numero_operativo      AS "nroOperativo",
      a.nombre_caso           AS "nombreCaso",
      o.fecha_operativo       AS "fechaOperativo",
      a.asignado_caso         AS "asignadoCaso",
      a.fiscal_asignado_caso  AS "fiscalAsignadoCaso"
    FROM public.asignacion a
    INNER JOIN public.operativo  o ON a.id_caso     = o.id_caso
    INNER JOIN public.distrital  d ON a.id_distrital = d.id_distrital
    INNER JOIN public.grupo      g ON a.id_grupo     = g.id_grupo
    INNER JOIN public.unidad     u ON d.id_unidad    = u.id_unidad
  `

  private readonly FROM_BASE = `
    FROM public.asignacion a
    INNER JOIN public.operativo  o ON a.id_caso     = o.id_caso
    INNER JOIN public.distrital  d ON a.id_distrital = d.id_distrital
    INNER JOIN public.grupo      g ON a.id_grupo     = g.id_grupo
    INNER JOIN public.unidad     u ON d.id_unidad    = u.id_unidad
  `

  private async paginar(
    whereSql: string,
    params: unknown[],
    limite: number,
    saltar: number
  ): Promise<[unknown[], number]> {
    const data = await this.dataSource.query(
      `${this.SELECT_BASE} ${whereSql} ORDER BY a.id_caso DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limite, saltar]
    )
    const [{ total }] = await this.dataSource.query(
      `SELECT COUNT(*) AS total ${this.FROM_BASE} ${whereSql}`,
      params
    )
    return [data, Number(total)]
  }

  /**
   * Casos SIN operativo ingresado (descripcion vacía) para un distrital.
   * Origen: muestraoperativos() — FRM-INF-ING.aspx.cs
   */
  async findSinRegistrar(dto: BuscarIngresoDto): Promise<[unknown[], number]> {
    const where = `WHERE a.id_distrital = $1 AND COALESCE(o.descripcion, '') = ''`
    return this.paginar(where, [dto.idDistrital], dto.limite, dto.saltar)
  }

  /**
   * Casos CON operativo ingresado, filtrados por número de caso exacto.
   * Origen: muestraoperativosnumero() — FRM-INF-ING.aspx.cs
   */
  async findRegistradosPorNumero(dto: BuscarIngresoDto): Promise<[unknown[], number]> {
    const where = `WHERE a.id_distrital = $1 AND a.numero_caso = $2 AND COALESCE(o.descripcion, '') != ''`
    return this.paginar(where, [dto.idDistrital, dto.nroCaso], dto.limite, dto.saltar)
  }

  /**
   * Casos CON operativo ingresado, filtrados por nombre de caso (insensible a mayúsculas).
   * Origen: muestraoperativosnnombres() — FRM-INF-ING.aspx.cs
   */
  async findRegistradosPorNombre(dto: BuscarIngresoDto): Promise<[unknown[], number]> {
    const where = `WHERE a.id_distrital = $1 AND UPPER(a.nombre_caso) = UPPER($2) AND COALESCE(o.descripcion, '') != ''`
    return this.paginar(where, [dto.idDistrital, dto.nombreCaso], dto.limite, dto.saltar)
  }

  /**
   * Casos CON operativo ingresado, filtrados por rango de fecha del operativo.
   * Origen: muestraoperativosfechas() — FRM-INF-ING.aspx.cs
   */
  async findRegistradosPorFecha(dto: BuscarIngresoDto): Promise<[unknown[], number]> {
    const where = `
      WHERE a.id_distrital = $1
      AND o.fecha_operativo BETWEEN $2::timestamp AND ($3::date + INTERVAL '1 day' - INTERVAL '1 millisecond')::timestamp
      AND COALESCE(o.descripcion, '') != ''
    `
    return this.paginar(where, [dto.idDistrital, dto.desde, dto.hasta], dto.limite, dto.saltar)
  }
}
