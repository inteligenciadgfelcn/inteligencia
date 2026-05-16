import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '../../../../shared/constants'
import { PaginacionQueryDto } from '@/common/dto'
import { BuscarAsignacionLgiQueryDto } from '../dto/buscar-asignacion-lgi-query.dto'
/**
 * Repository LGI — consultas nativas sobre felcn_lgi
 * Origen: sistema legacy GIAEF — pg.sql (docs/migrations/pg.sql)
 * Tablas: asignacion, operativo, investigador, departamentosc, distritales, localidad, provincias
 */
@Injectable()
export class LgiRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private dataSource: DataSource
  ) { }

  /**
   * Busca los casos asignados a un usuario específico (Investigador).
   * Origen: LGI-MEN2.aspx.cs — Muestracasos()
   * Tablas: asignacion, investigador, distritales, departamentosc
   */
  async buscarMisCasos(
    usuario: string,
    filtros: BuscarAsignacionLgiQueryDto,
    paginacion: PaginacionQueryDto
  ): Promise<[Record<string, unknown>[], number]> {
    const params: unknown[] = [usuario.trim().toUpperCase()]
    const condiciones: string[] = [`TRIM(i.usuario) = $1`]

    if (filtros.uniAbrev) {
      params.push(filtros.uniAbrev.trim().toUpperCase())
      condiciones.push(`TRIM(a.uni_abrev) = TRIM($${params.length})`)
    }
    if (filtros.nroCaso) {
      params.push(filtros.nroCaso.trim().toUpperCase())
      condiciones.push(`TRIM(a.nrocaso) = TRIM($${params.length})`)
    }
    if (filtros.nombreCaso) {
      params.push(`%${filtros.nombreCaso.trim().toUpperCase()}%`)
      condiciones.push(`a.nombrecaso ILIKE $${params.length}`)
    }

    const joins = `
      INNER JOIN public.investigador i ON a.casos_id = i.casos_id
      INNER JOIN public.distritales  di ON a.dis_id = di.dis_id
      INNER JOIN public.departamentosc de ON a.dptoav_id = de.dptoav_id`

    const selectFields = `
      a.casos_id           AS "casosId",
      TRIM(de.descripcion) AS "departamento",
      TRIM(di.dis_descripcion) AS "distrital",
      TRIM(a.nombrecaso)   AS "nombreCaso",
      TRIM(a.nrocasogiaef) AS "nroCasoGiaef",
      TRIM(a.nrocaso)      AS "nroCaso",
      TRIM(a.nrocasofis)   AS "nroCasoFis",
      TRIM(a.nrocasoperdom) AS "nroCasoPerDom",
      TRIM(a.ianus)        AS "ianus",
      TRIM(a.remitefiscal) AS "remiteFiscal",
      a.remitefecha        AS "remiteFecha",
      TRIM(a.conformea)    AS "conformeA"`

    const where = `WHERE ${condiciones.join(' AND ')}`

    const countSql = `SELECT COUNT(*) AS total FROM public.asignacion a ${joins} ${where}`
    const [{ total }] = await this.dataSource.query(countSql, params)

    params.push(paginacion.limite, paginacion.saltar)
    const sql = `
      SELECT ${selectFields}
      FROM public.asignacion a
      ${joins}
      ${where}
      ORDER BY a.casos_id DESC
      LIMIT $${params.length - 1} OFFSET $${params.length}`

    const datos = await this.dataSource.query(sql, params)
    return [datos, Number(total)]
  }

  // ==================== OPERATIVO ====================

  /**
   * Lista operativos de un caso con join a paramétricas locales.
   * Origen: LGI-MEN3.aspx.cs — MuestraOperativos()
   * Tablas: operativo, departamentosc, provincias, localidad, unidades, distritales
   */
  async listarOperativosPorCaso(casosId: string): Promise<Record<string, unknown>[]> {
    const sql = `
      SELECT
        o.op_id              AS "opId",
        TRIM(o.op_nrooper)   AS "opNroOper",
        o.op_fechainf        AS "opFechaInf",
        -- Ubicación concatenada (Legacy Op4)
        CONCAT_WS(' ', 
          TRIM(d.descripcion), 
          TRIM(p.descripcion), 
          TRIM(l.descripcion), 
          TRIM(o.op_lugar)
        ) AS "ubicacion",
        -- Unidad/Distrital (Legacy Op5)
        CONCAT_WS(' ', 
          TRIM(u.uni_descripcion), 
          TRIM(di.dis_descripcion)
        ) AS "unidadDistrital",
        o.op_descripcion     AS "opDescripcion",
        o.fechahoraing       AS "fechaHoraIng"
      FROM public.operativo o
      LEFT JOIN public.departamentosc d ON o.dpto_id::text = d.dptoav_id -- Ajuste de tipos si dpto_id es numeric y dptoav_id es char
      LEFT JOIN public.provincias     p ON o.prov_id = p.prov_id
      LEFT JOIN public.localidad      l ON o.loc_id  = l.loc_id
      LEFT JOIN public.unidades       u ON o.uni_id  = u.uni_id
      LEFT JOIN public.distritales    di ON o.dis_id = di.dis_id
      WHERE o.casos_id = $1
      ORDER BY o.op_fechainf DESC`
    return this.dataSource.query(sql, [casosId])
  }
}
