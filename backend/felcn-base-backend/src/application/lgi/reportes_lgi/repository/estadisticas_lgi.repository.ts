import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import type {
  ItemEtiqueta,
  ItemBienCatalogo,
  ItemTipoInforme,
  FilaSerieMensual,
  SeriePorEtapa,
  ItemTipoSituacionLegal,
  ItemTopBeneficiario,
} from '../estadisticas-lgi.interfaces'

/**
 * Repositorio de estadísticas LGI (felcn_lgi).
 *
 * Todos los métodos reciben fechas normalizadas (YYYY-MM-DD) y parámetros
 * posicionales ($1 .. $n). Los rangos son inclusivos.
 */
@Injectable()
export class EstadisticasLgiRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,
  ) {}

  // ─── Estado del caso ──────────────────────────────────────────────────────

  async kpiEstadoCaso(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
        (SELECT COUNT(*) FROM public.asignacion a
          WHERE a.estado = 'ACTIVO'
            AND a.fechainicio BETWEEN $1 AND $2)::int                              AS "casosIniciados",

        COALESCE(ROUND(AVG(t.dias)::numeric), 0)::int                              AS "tiempoPromedioDias",

        (SELECT COUNT(DISTINCT o.casos_id) FROM public.operativo o
          JOIN public.asignacion a ON a.casos_id = o.casos_id AND a.estado = 'ACTIVO'
          WHERE o.estado = 'ACTIVO' AND o.id_tipo_informe = 11
            AND a.fechainicio BETWEEN $1 AND $2)::int                              AS "conInformeConclusivo",

        (SELECT COUNT(DISTINCT o.casos_id) FROM public.operativo o
          JOIN public.asignacion a ON a.casos_id = o.casos_id AND a.estado = 'ACTIVO'
          WHERE o.estado = 'ACTIVO' AND o.id_estado IN (19, 20)
            AND a.fechainicio BETWEEN $1 AND $2)::int                              AS "conSentencia",

        (SELECT COUNT(DISTINCT o.casos_id) FROM public.operativo o
          JOIN public.asignacion a ON a.casos_id = o.casos_id AND a.estado = 'ACTIVO'
          WHERE o.estado = 'ACTIVO' AND (o.id_estado IN (3, 10) OR o.id_tipo_informe = 15)
            AND a.fechainicio BETWEEN $1 AND $2)::int                              AS "rechazados",

        (SELECT COUNT(*) FROM public.asignacion a
          WHERE a.estado = 'ACTIVO' AND a.perddom = true
            AND a.fechainicio BETWEEN $1 AND $2)::int                              AS "apd",

        (SELECT COUNT(*) FROM public.operativo o
          JOIN public.asignacion a ON a.casos_id = o.casos_id AND a.estado = 'ACTIVO'
          WHERE o.estado = 'ACTIVO'
            AND o.fechahoraing BETWEEN $1 AND $2)::int                             AS "totalOperativos"

      FROM (SELECT $1::timestamptz AS f1, $2::timestamptz AS f2) r
      LEFT JOIN LATERAL (
        SELECT AVG(EXTRACT(EPOCH FROM (NOW() - a.fechainicio)) / 86400.0) AS dias
        FROM public.asignacion a
        WHERE a.estado = 'ACTIVO'
          AND a.fechainicio BETWEEN $1 AND $2
      ) t ON true`,
      [desde, hasta],
    )

    return {
      casosIniciados: Number(row?.casosIniciados ?? 0),
      conInformeConclusivo: Number(row?.conInformeConclusivo ?? 0),
      conSentencia: Number(row?.conSentencia ?? 0),
      rechazados: Number(row?.rechazados ?? 0),
      apd: Number(row?.apd ?? 0),
      totalOperativos: Number(row?.totalOperativos ?? 0),
      tiempoPromedioDias: Number(row?.tiempoPromedioDias ?? 0),
    }
  }

  /** Etapa actual de cada caso = etapa del último operativo activo o eta_inv. */
  async estadoCasoPorEtapaActual(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         COALESCE(u.id_etapa, a.eta_inv)::int          AS "id",
         COALESCE(e.descripcion, 'Sin etapa')           AS "descripcion",
         COUNT(*)::int                                  AS "cantidad"
       FROM public.asignacion a
       LEFT JOIN LATERAL (
         SELECT o2.id_etapa
         FROM public.operativo o2
         WHERE o2.casos_id = a.casos_id AND o2.estado = 'ACTIVO'
         ORDER BY o2.fechahoraing DESC NULLS LAST, o2.op_id DESC
         LIMIT 1
       ) u ON true
       LEFT JOIN parametricas.etapa e ON e.et_id = COALESCE(u.id_etapa, a.eta_inv)
       WHERE a.estado = 'ACTIVO'
         AND a.fechainicio BETWEEN $1 AND $2
       GROUP BY 1, 2
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  /** Operativos (con estado) agrupados por estado/etapa del ciclo procesal. */
  async estadoCasoPorEstadoCiclo(desde: string, hasta: string) {
    return this.dataSource.query(
      `SELECT
         s.est_id::int                                AS "estadoId",
         s.descripcion                                AS "estado",
         e.et_id::int                                 AS "etapaId",
         e.descripcion                                AS "etapa",
         COUNT(DISTINCT o.casos_id)::int              AS "cantidad"
       FROM public.operativo o
       JOIN public.estado s ON s.est_id = o.id_estado
       JOIN parametricas.etapa e ON e.et_id = o.id_etapa
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1, 2, 3, 4
       ORDER BY 3, 1`,
      [desde, hasta],
    )
  }

  async estadoCasoPorUnidad(desde: string, hasta: string): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         0::int                                                       AS "id",
         COALESCE(NULLIF(a.uni_abrev, ''), 'Sin unidad') AS "descripcion",
         COUNT(*)::int                 AS "cantidad"
       FROM public.asignacion a
       WHERE a.estado = 'ACTIVO'
         AND a.fechainicio BETWEEN $1 AND $2
       GROUP BY 2
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  async estadoCasoPorDistrito(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         0::int                                                       AS "id",
         COALESCE(NULLIF(a.descripcion_grupo, ''), 'Sin distrito')     AS "descripcion",
         COUNT(*)::int                                                 AS "cantidad"
       FROM public.asignacion a
       WHERE a.estado = 'ACTIVO'
         AND a.fechainicio BETWEEN $1 AND $2
       GROUP BY 2
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  /** Serie mensual de casos iniciados (por fechainicio). */
  async estadoCasoSerieIniciados(
    desde: string,
    hasta: string,
  ): Promise<Record<string, number>> {
    const filas = await this.dataSource.query<{ yy: string; n: number }[]>(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', a.fechainicio), 'YYYY-MM') AS "yy",
         COUNT(*)::int                                          AS "n"
       FROM public.asignacion a
       WHERE a.estado = 'ACTIVO'
         AND a.fechainicio BETWEEN $1 AND $2
       GROUP BY 1`,
      [desde, hasta],
    )
    const mapa: Record<string, number> = {}
    filas.forEach((f) => (mapa[f.yy] = Number(f.n)))
    return mapa
  }

  /** Serie mensual de operativos (total, conclusivo, sentencia, rechazados). */
  async estadoCasoSerieOperativos(
    desde: string,
    hasta: string,
  ): Promise<FilaSerieMensual[]> {
    return this.dataSource.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS "yy",
         COUNT(*)::int                                           AS "operativos",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 11)::int     AS "conclusivo",
         COUNT(*) FILTER (WHERE o.id_estado IN (19, 20))::int    AS "sentencia",
         COUNT(*) FILTER (WHERE o.id_estado IN (3, 10)
                             OR o.id_tipo_informe = 15)::int     AS "rechazados"
       FROM public.operativo o
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  /** Serie mensual de operativos por etapa (barras apiladas). */
  async estadoCasoSeriePorEtapa(
    desde: string,
    hasta: string,
    meses: string[],
  ): Promise<SeriePorEtapa[]> {
    const filas = await this.dataSource.query<
      { yy: string; idEtapa: number; etapa: string; n: number }[]
    >(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS "yy",
         e.et_id::int                                            AS "idEtapa",
         e.descripcion                                           AS "etapa",
         COUNT(*)::int                                           AS "n"
       FROM public.operativo o
       JOIN parametricas.etapa e ON e.et_id = o.id_etapa
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1, e.et_id, e.descripcion
       ORDER BY e.et_id, 1`,
      [desde, hasta],
    )

    const etapas = Array.from(
      new Map(
        filas
          .slice()
          .sort((x, y) => x.idEtapa - y.idEtapa)
          .map((f) => [f.idEtapa, f.etapa]),
      ).values(),
    )

    const porMes = new Map(filas.map((f) => [`${f.etapa}|${f.yy}`, Number(f.n)]))

    return etapas.map((etapa) => ({
      etapa,
      data: meses.map((mes) => porMes.get(`${etapa}|${mes}`) ?? 0),
    }))
  }

  // ─── Operativos ────────────────────────────────────────────────────────────

  async kpiOperativos(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
         COUNT(*)::int                                                          AS "totalOperativos",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 6)::int                     AS "allanamientos",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 4)::int                     AS "solicitudesAllanamiento",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 8)::int                     AS "trabajosDeCampo",
         COALESCE(ROUND(AVG(o.dias_otorgados)::numeric), 0)::int                AS "promedioDiasOtorgados",
         COUNT(DISTINCT o.casos_id)::int                                        AS "casosImplicados"
       FROM public.operativo o
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2`,
      [desde, hasta],
    )

    return {
      totalOperativos: Number(row?.totalOperativos ?? 0),
      allanamientos: Number(row?.allanamientos ?? 0),
      solicitudesAllanamiento: Number(row?.solicitudesAllanamiento ?? 0),
      trabajosDeCampo: Number(row?.trabajosDeCampo ?? 0),
      promedioDiasOtorgados: Number(row?.promedioDiasOtorgados ?? 0),
      casosImplicados: Number(row?.casosImplicados ?? 0),
    }
  }

  async operativosPorTipoInforme(
    desde: string,
    hasta: string,
  ): Promise<ItemTipoInforme[]> {
    return this.dataSource.query(
      `SELECT
         ti.id::int                    AS "tipoInformeId",
         ti.descripcion                AS "tipoInforme",
         COUNT(o.op_id)::int           AS "cantidad"
       FROM parametricas.tipo_informe ti
       LEFT JOIN public.operativo o
         ON o.id_tipo_informe = ti.id
        AND o.estado = 'ACTIVO'
        AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY ti.id, ti.descripcion
       ORDER BY ti.id`,
      [desde, hasta],
    )
  }

  async operativosPorEtapa(desde: string, hasta: string): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         e.et_id::int          AS "id",
         e.descripcion         AS "descripcion",
         COUNT(o.op_id)::int   AS "cantidad"
       FROM parametricas.etapa e
       LEFT JOIN public.operativo o
         ON o.id_etapa = e.et_id
        AND o.estado = 'ACTIVO'
        AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY e.et_id, e.descripcion
       ORDER BY e.et_id`,
      [desde, hasta],
    )
  }

  async operativosPorUnidad(desde: string, hasta: string): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         0::int                                    AS "id",
         COALESCE(NULLIF(a.uni_abrev, ''), 'Sin unidad') AS "descripcion",
         COUNT(o.op_id)::int                        AS "cantidad"
       FROM public.operativo o
       JOIN public.asignacion a ON a.casos_id = o.casos_id
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 2
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  async operativosPorEstadoCiclo(desde: string, hasta: string) {
    return this.dataSource.query(
      `SELECT
         s.est_id::int                                AS "estadoId",
         s.descripcion                                AS "estado",
         e.et_id::int                                 AS "etapaId",
         e.descripcion                                AS "etapa",
         COUNT(o.op_id)::int                          AS "cantidad"
       FROM public.operativo o
       JOIN public.estado s ON s.est_id = o.id_estado
       JOIN parametricas.etapa e ON e.et_id = o.id_etapa
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1, 2, 3, 4
       ORDER BY 3, 1`,
      [desde, hasta],
    )
  }

  async operativosSerie(
    desde: string,
    hasta: string,
  ): Promise<{ yy: string; n: number; allanamientos: number; trabajosDeCampo: number }[]> {
    return this.dataSource.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS "yy",
         COUNT(*)::int                                           AS "n",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 6)::int      AS "allanamientos",
         COUNT(*) FILTER (WHERE o.id_tipo_informe = 8)::int      AS "trabajosDeCampo"
       FROM public.operativo o
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  async operativosSeriePorEtapa(
    desde: string,
    hasta: string,
    meses: string[],
  ): Promise<SeriePorEtapa[]> {
    return this.estadoCasoSeriePorEtapa(desde, hasta, meses)
  }

  // ─── Bienes secuestrados ───────────────────────────────────────────────────

  async kpiBienes(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
         COUNT(ib.itembiensec_id)::int                  AS "totalItems",
         COALESCE(SUM(ib.cantidadbien), 0)::int         AS "cantidadTotal",
         COALESCE(SUM(COALESCE(ib.costocuant, ib.costoaprox)), 0)::numeric AS "costoTotal",
         COUNT(DISTINCT o.casos_id)::int                AS "casosImplicados",
         COUNT(DISTINCT o.op_id)::int                   AS "operativosImplicados"
       FROM public.itembiensecuestrado ib
       JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
       WHERE ib.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2`,
      [desde, hasta],
    )

    return {
      totalItems: Number(row?.totalItems ?? 0),
      cantidadTotal: Number(row?.cantidadTotal ?? 0),
      costoTotal: Number(row?.costoTotal ?? '0'),
      casosImplicados: Number(row?.casosImplicados ?? 0),
      operativosImplicados: Number(row?.operativosImplicados ?? 0),
    }
  }

  /** Detalle por categoría del catálogo (bienes, nivel superior). */
  async bienesPorCatalogo(
    desde: string,
    hasta: string,
  ): Promise<ItemBienCatalogo[]> {
    return this.dataSource.query(
      `SELECT
         b.bien_id::int                                    AS "bienId",
         COALESCE(b.descripcion, 'Sin clasificar')         AS "bien",
         COUNT(ib.itembiensec_id)::int                     AS "items",
         COALESCE(SUM(ib.cantidadbien), 0)::int            AS "cantidad",
         COALESCE(SUM(COALESCE(ib.costocuant, ib.costoaprox)), 0)::numeric AS "costo"
       FROM public.itembiensecuestrado ib
       JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
       LEFT JOIN parametricas.catalogotipo ct ON ct.cattipo_id = ib.cattipo_id
       LEFT JOIN parametricas.catalogoclase cc ON cc.catclas_id = ct.catclas_id
       LEFT JOIN parametricas.bienes b ON b.bien_id = cc.bien_id
       WHERE ib.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY b.bien_id, b.descripcion
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  /** Serie mensual de cantidad secuestrada por bucket (muebles/inmuebles/dineros/otros). */
  async bienesSerieMensual(desde: string, hasta: string) {
    return this.dataSource.query<{ yy: string; categoria: string; cantidad: number }[]>(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS "yy",
         CASE
           WHEN b.bien_id = 2      THEN 'inmuebles'
           WHEN b.bien_id = 5      THEN 'dineros'
           WHEN b.bien_id IN (1,3,4) THEN 'muebles'
           ELSE 'otros'
         END                                                   AS "categoria",
         COALESCE(SUM(ib.cantidadbien), 0)::int                AS "cantidad"
       FROM public.itembiensecuestrado ib
       JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
       LEFT JOIN parametricas.catalogotipo ct ON ct.cattipo_id = ib.cattipo_id
       LEFT JOIN parametricas.catalogoclase cc ON cc.catclas_id = ct.catclas_id
       LEFT JOIN parametricas.bienes b ON b.bien_id = cc.bien_id
       WHERE ib.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1, 2
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  // ─── Situación legal de bienes ─────────────────────────────────────────────

  async kpiSituacionLegal(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
         COUNT(ib.itembiensec_id)::int                  AS "totalItems",
         COALESCE(SUM(ib.cantidadbien), 0)::int         AS "cantidadTotal",
         COALESCE(SUM(COALESCE(ib.costocuant, ib.costoaprox)), 0)::numeric AS "costoTotal",
         COUNT(DISTINCT o.casos_id)::int                AS "casosImplicados",
         COUNT(DISTINCT o.op_id)::int                   AS "operativosImplicados"
       FROM public.itembiensecuestrado ib
       JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
       WHERE ib.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2`,
      [desde, hasta],
    )

    return {
      totalItems: Number(row?.totalItems ?? 0),
      cantidadTotal: Number(row?.cantidadTotal ?? 0),
      costoTotal: Number(row?.costoTotal ?? '0'),
      casosImplicados: Number(row?.casosImplicados ?? 0),
      operativosImplicados: Number(row?.operativosImplicados ?? 0),
    }
  }

  /** Registros de situación legal (bienessecuestrados/incautados/confiscados/situacionbienes). */
  async situacionLegalPorTipo(
    desde: string,
    hasta: string,
  ): Promise<ItemTipoSituacionLegal[]> {
    return this.dataSource.query(
      `SELECT
         x.tipo_id::int                                  AS "tipoId",
         x.tipo,
         COUNT(*)::int                                   AS "registros",
         COUNT(DISTINCT x.itembiensec_id)::int           AS "items",
         COALESCE(SUM(x.cantidad), 0)::int               AS "cantidad",
         COALESCE(SUM(x.costo), 0)::numeric              AS "costo"
       FROM (
         ${this.sqlRegistrosSituacionLegal('$1', '$2')}
       ) x
       GROUP BY 1, 2
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  /** Serie mensual de cantidad por tipo de situación legal. */
  async situacionLegalSerie(
    desde: string,
    hasta: string,
  ): Promise<{ yy: string; tipoId: number; tipo: string; cantidad: number }[]> {
    return this.dataSource.query(
      `SELECT
         x.yy,
         x.tipo_id::int                        AS "tipoId",
         x.tipo,
         COALESCE(SUM(x.cantidad), 0)::int     AS "cantidad"
       FROM (
         ${this.sqlRegistrosSituacionLegal('$1', '$2')}
       ) x
       GROUP BY 1, 2, 3
       ORDER BY 1, 2`,
      [desde, hasta],
    )
  }

  /**
   * UNION de los registros de situación legal por bien.
   * 1=Secuestrado, 2=Incautado, 3=Confiscado/Decomisado,
   * 4=Entrega a DIRCABI (institucion ~ DIRCABI), 5=Devolución (resto de entregas).
   */
  private sqlRegistrosSituacionLegal(desde: string, hasta: string): string {
    return `
      SELECT
        sec.itembiensec_id,
        ib.op_id,
        TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS yy,
        1           AS tipo_id,
        'Secuestrado' AS tipo,
        ib.cantidadbien AS cantidad,
        COALESCE(ib.costocuant, ib.costoaprox) AS costo
      FROM public.bienessecuestados sec
      JOIN public.itembiensecuestrado ib
        ON ib.itembiensec_id = sec.itembiensec_id AND ib.estado = 'ACTIVO'
      JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
      WHERE o.fechahoraing BETWEEN ${desde} AND ${hasta}

      UNION ALL

      SELECT
        inc.itembiensec_id,
        ib.op_id,
        TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS yy,
        2           AS tipo_id,
        'Incautado' AS tipo,
        ib.cantidadbien AS cantidad,
        COALESCE(ib.costocuant, ib.costoaprox) AS costo
      FROM public.bienesincautados inc
      JOIN public.itembiensecuestrado ib
        ON ib.itembiensec_id = inc.itembiensec_id AND ib.estado = 'ACTIVO'
      JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
      WHERE o.fechahoraing BETWEEN ${desde} AND ${hasta}

      UNION ALL

      SELECT
        con.itembiensec_id,
        ib.op_id,
        TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS yy,
        3           AS tipo_id,
        'Confiscado/Decomisado' AS tipo,
        ib.cantidadbien AS cantidad,
        COALESCE(ib.costocuant, ib.costoaprox) AS costo
      FROM public.bienesconfiscados con
      JOIN public.itembiensecuestrado ib
        ON ib.itembiensec_id = con.itembiensec_id AND ib.estado = 'ACTIVO'
      JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
      WHERE o.fechahoraing BETWEEN ${desde} AND ${hasta}

      UNION ALL

      SELECT
        sit.itembiensec_id,
        ib.op_id,
        TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS yy,
        4           AS tipo_id,
        'Entrega a DIRCABI' AS tipo,
        ib.cantidadbien AS cantidad,
        COALESCE(ib.costocuant, ib.costoaprox) AS costo
      FROM public.situacionbienes sit
      JOIN public.itembiensecuestrado ib
        ON ib.itembiensec_id = sit.itembiensec_id AND ib.estado = 'ACTIVO'
      JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
      WHERE UPPER(COALESCE(sit.institucion, '')) LIKE '%DIRCABI%'
        AND o.fechahoraing BETWEEN ${desde} AND ${hasta}

      UNION ALL

      SELECT
        sit.itembiensec_id,
        ib.op_id,
        TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS yy,
        5           AS tipo_id,
        'Devolución' AS tipo,
        ib.cantidadbien AS cantidad,
        COALESCE(ib.costocuant, ib.costoaprox) AS costo
      FROM public.situacionbienes sit
      JOIN public.itembiensecuestrado ib
        ON ib.itembiensec_id = sit.itembiensec_id AND ib.estado = 'ACTIVO'
      JOIN public.operativo o ON o.op_id = ib.op_id AND o.estado = 'ACTIVO'
      WHERE NOT (UPPER(COALESCE(sit.institucion, '')) LIKE '%DIRCABI%')
        AND o.fechahoraing BETWEEN ${desde} AND ${hasta}
    `
  }

  // ─── Personas investigadas ─────────────────────────────────────────────────

  async kpiPersonasInvestigadas(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
         COUNT(DISTINCT p.de_id)::int         AS "totalPersonas",
         COUNT(DISTINCT p.caso_id)::int       AS "casosImplicados",
         COUNT(DISTINCT p.de_id) FILTER (WHERE EXISTS (
           SELECT 1 FROM public.situacion s WHERE s.de_id = p.de_id
         ))::int                              AS "conSituacionJuridica"
       FROM public.detenidosaux p
       JOIN public.asignacion a ON a.casos_id = p.caso_id AND a.estado = 'ACTIVO'
       WHERE p.estado = true
         AND a.fechainicio BETWEEN $1 AND $2`,
      [desde, hasta],
    )

    const total = Number(row?.totalPersonas ?? 0)
    const conSituacion = Number(row?.conSituacionJuridica ?? 0)

    return {
      totalPersonas: total,
      casosImplicados: Number(row?.casosImplicados ?? 0),
      conSituacionJuridica: conSituacion,
      sinSituacionJuridica: Math.max(total - conSituacion, 0),
    }
  }

  /** Personas por su última situación jurídica (situacionlegal). */
  async personasInvestigadasPorSituacionLegal(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         t.sl_id::int                AS "id",
         sl.descripcion              AS "descripcion",
         COUNT(*)::int               AS "cantidad"
       FROM (
         SELECT
           p.de_id,
           (SELECT s.sl_id FROM public.situacion s
             WHERE s.de_id = p.de_id
             ORDER BY s.fecha DESC NULLS LAST, s.sit_id DESC NULLS LAST
             LIMIT 1) AS sl_id
         FROM public.detenidosaux p
         JOIN public.asignacion a ON a.casos_id = p.caso_id AND a.estado = 'ACTIVO'
         WHERE p.estado = true
           AND a.fechainicio BETWEEN $1 AND $2
       ) t
       JOIN public.situacionlegal sl ON sl.sl_id = t.sl_id
       GROUP BY 1, 2
       ORDER BY 3 DESC, 1`,
      [desde, hasta],
    )
  }

  /** Situaciones registradas por mes y tipo de situación legal. */
  async personasInvestigadasSerie(
    desde: string,
    hasta: string,
  ): Promise<{ yy: string; situacion: string; cantidad: number }[]> {
    return this.dataSource.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', s.fecha), 'YYYY-MM') AS "yy",
         sl.descripcion                                   AS "situacion",
         COUNT(*)::int                                    AS "cantidad"
       FROM public.situacion s
       JOIN public.detenidosaux p ON p.de_id = s.de_id AND p.estado = true
       JOIN public.asignacion a ON a.casos_id = p.caso_id AND a.estado = 'ACTIVO'
       JOIN public.situacionlegal sl ON sl.sl_id = s.sl_id
       WHERE s.fecha BETWEEN $1 AND $2
       GROUP BY 1, 2
       ORDER BY 1, 2`,
      [desde, hasta],
    )
  }

  // ─── Personas jurídicas ────────────────────────────────────────────────────

  async kpiPersonasJuridicas(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `WITH emp AS (
         SELECT
           e.emp_id,
           e.beneficiarios_finales,
           e.pericia,
           (COALESCE(NULLIF(btrim(e.resultado), ''), '') <> '') AS tiene_resultado,
           o.casos_id
         FROM public.empresas e
         JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
         WHERE o.fechahoraing BETWEEN $1 AND $2
       )
       SELECT
         COUNT(*)::int                                             AS "totalEmpresas",
         COUNT(*) FILTER (
           WHERE pericia OR tiene_resultado
         )::int                                                    AS "identificadasIntervenidas",
         COUNT(DISTINCT casos_id)::int                             AS "casosImplicados",
         COALESCE(SUM(
           (SELECT COUNT(*) FROM (
              SELECT btrim(t) AS x
              FROM regexp_split_to_table(
                CASE
                  WHEN btrim(COALESCE(beneficiarios_finales, '')) = '' THEN NULL
                  ELSE btrim(COALESCE(beneficiarios_finales, ''))
                END,
                ','
              ) t
           ) q WHERE q.x <> '' AND q.x IS NOT NULL)
         ), 0)::int                                                AS "totalBeneficiarios"
       FROM emp`,
      [desde, hasta],
    )

    return {
      totalEmpresas: Number(row?.totalEmpresas ?? 0),
      identificadasIntervenidas: Number(row?.identificadasIntervenidas ?? 0),
      casosImplicados: Number(row?.casosImplicados ?? 0),
      totalBeneficiarios: Number(row?.totalBeneficiarios ?? 0),
    }
  }

  /** Empresas por tipo de sociedad deducido de la razón social. */
  async personasJuridicasPorTipoSociedad(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         0::int AS "id",
         CASE
           WHEN UPPER(e.nombre) LIKE '%S.R.L.%' OR UPPER(e.nombre) LIKE '%SRL%' THEN 'S.R.L.'
           WHEN UPPER(e.nombre) LIKE '%S.A.M.%' OR UPPER(e.nombre) LIKE '%S A M%' THEN 'S.A.M.'
           WHEN UPPER(e.nombre) LIKE '%S.A.%' OR UPPER(e.nombre) LIKE '% SOCIEDAD ANONIMA%' THEN 'S.A.'
           WHEN UPPER(e.nombre) LIKE '%LTDA.%' OR UPPER(e.nombre) LIKE '%LTDA%' OR UPPER(e.nombre) LIKE '%LIMITADA%' THEN 'Ltda.'
           ELSE 'Otra / Sin dato'
         END                                                       AS "descripcion",
         COUNT(*)::int                                             AS "cantidad"
       FROM public.empresas e
       JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
       WHERE o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 2
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  /** Empresas por su última situación jurídica (tipo_situacion_juridica). */
  async personasJuridicasPorSituacionJuridica(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         t.id_tipo_situacion_juridica::int AS "id",
         COALESCE(t.descripcion, 'Sin dato') AS "descripcion",
         COUNT(*)::int                       AS "cantidad"
       FROM (
         SELECT DISTINCT ON (e.emp_id)
           e.emp_id,
           sje.id_tipo_situacion_juridica
         FROM public.empresas e
         JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
         JOIN public.situacion_juridica_empresa sje
           ON sje.id_empresa::bigint = e.emp_id
         WHERE o.fechahoraing BETWEEN $1 AND $2
         ORDER BY e.emp_id, sje.fechahoraing DESC NULLS LAST, sje.id_situacion_juridica_empresa DESC
       ) x
       JOIN parametricas.tipo_situacion_juridica t
         ON t.id_tipo_situacion_juridica::int = x.id_tipo_situacion_juridica
       GROUP BY 1, 2
       ORDER BY 3 DESC, 1`,
      [desde, hasta],
    )
  }

  /** Empresas por tipo de vínculo. */
  async personasJuridicasPorVinculo(
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    return this.dataSource.query(
      `SELECT
         COALESCE(tv.id_tipo_vinculo::int, 0)          AS "id",
         COALESCE(NULLIF(tv.descripcion, ''), 'Sin vínculo') AS "descripcion",
         COUNT(*)::int                                 AS "cantidad"
       FROM public.empresas e
       JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
       LEFT JOIN parametricas.tipo_vinculo tv
         ON tv.id_tipo_vinculo = NULLIF(e.id_tipo_vinculo, '')::bigint
       WHERE o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1, 2
       ORDER BY 3 DESC`,
      [desde, hasta],
    )
  }

  /** Empresas con mayor cantidad de beneficiarios finales. */
  async personasJuridicasTopBeneficiarios(
    desde: string,
    hasta: string,
  ): Promise<ItemTopBeneficiario[]> {
    return this.dataSource.query(
      `SELECT
         e.nombre AS "empresa",
         COALESCE((
           SELECT COUNT(*) FROM (
             SELECT btrim(t) AS x
             FROM regexp_split_to_table(
               CASE
                 WHEN btrim(COALESCE(e.beneficiarios_finales, '')) = '' THEN NULL
                 ELSE btrim(COALESCE(e.beneficiarios_finales, ''))
               END,
               ','
             ) t
           ) q WHERE q.x <> '' AND q.x IS NOT NULL
         ), 0)::int AS "beneficiarios"
       FROM public.empresas e
       JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
       WHERE o.fechahoraing BETWEEN $1 AND $2
         AND btrim(COALESCE(e.beneficiarios_finales, '')) <> ''
       ORDER BY 2 DESC, 1
       LIMIT 10`,
      [desde, hasta],
    )
  }

  /** Serie mensual de empresas registradas. */
  async personasJuridicasSerie(
    desde: string,
    hasta: string,
  ): Promise<{ yy: string; n: number }[]> {
    return this.dataSource.query(
      `SELECT
         TO_CHAR(DATE_TRUNC('month', o.fechahoraing), 'YYYY-MM') AS "yy",
         COUNT(*)::int                                           AS "n"
       FROM public.empresas e
       JOIN public.operativo o ON o.op_id = e.op_id::bigint AND o.estado = 'ACTIVO'
       WHERE o.fechahoraing BETWEEN $1 AND $2
       GROUP BY 1
       ORDER BY 1`,
      [desde, hasta],
    )
  }

  // ─── Otros datos (tipologías, verbos rectores, etapas/ciclo) ───────────────

  async kpiOtrosDatos(desde: string, hasta: string) {
    const [row] = await this.dataSource.query<Record<string, unknown>[]>(
      `SELECT
         COUNT(*)::int AS "totalOperativos",
         COUNT(*) FILTER (
           WHERE btrim(COALESCE(o.tipologias_identificadas, '')) <> ''
         )::int       AS "conTipologia",
         COUNT(*) FILTER (
           WHERE btrim(COALESCE(o.verbos_rectores, '')) <> ''
         )::int       AS "conVerboRector",
         COUNT(*) FILTER (
           WHERE btrim(COALESCE(o.etapas_ciclo_lgi, '')) <> ''
         )::int       AS "conEtapaCiclo"
       FROM public.operativo o
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2`,
      [desde, hasta],
    )

    return {
      totalOperativos: Number(row?.totalOperativos ?? 0),
      conTipologia: Number(row?.conTipologia ?? 0),
      conVerboRector: Number(row?.conVerboRector ?? 0),
      conEtapaCiclo: Number(row?.conEtapaCiclo ?? 0),
    }
  }

  /** Frecuencia de tokens de un campo de texto libre de public.operativo. */
  async otrosDatosTokens(
    campo: 'tipologias_identificadas' | 'verbos_rectores' | 'etapas_ciclo_lgi',
    desde: string,
    hasta: string,
  ): Promise<ItemEtiqueta[]> {
    const columnas: Record<string, string> = {
      tipologias_identificadas: 'o.tipologias_identificadas',
      verbos_rectores: 'o.verbos_rectores',
      etapas_ciclo_lgi: 'o.etapas_ciclo_lgi',
    }
    const columna = columnas[campo]

    const filas = await this.dataSource.query<
      { descripcion: string; cantidad: number }[]
    >(
      `SELECT
         lower(btrim(t))                    AS "descripcion",
         COUNT(*)::int                      AS "cantidad"
       FROM public.operativo o,
         LATERAL regexp_split_to_table(
           CASE
             WHEN btrim(COALESCE(${columna}, '')) = '' THEN NULL
             ELSE btrim(COALESCE(${columna}, ''))
           END,
           '[\\n,;]+'
         ) t
       WHERE o.estado = 'ACTIVO'
         AND o.fechahoraing BETWEEN $1 AND $2
         AND btrim(t) <> ''
       GROUP BY 1
       ORDER BY 2 DESC, 1`,
      [desde, hasta],
    )

    return filas.map((f, i) => ({
      id: i + 1,
      descripcion: f.descripcion,
      cantidad: Number(f.cantidad),
    }))
  }
}