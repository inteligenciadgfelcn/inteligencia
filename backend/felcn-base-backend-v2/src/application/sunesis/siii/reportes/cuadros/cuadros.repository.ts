import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import type {
  FilaCuadro,
  OtraDroga,
  ResumenEstadistico,
  ResumenFabrica,
  CoordenadaOp,
  RespuestaCuadro,
} from './interfaces/cuadro-filtro.interface'

/**
 * Repositorio CuadrosRepository
 * Consultas del reporte de servicio SIII.
 * Origen: ReporteServicio.aspx.cs — todos los métodos de la página.
 *
 * Estrategia: 4 métodos privados (buscarFilas, calcularResumen, listarFabricas,
 * listarCoordenadas) reciben el WHERE y los parámetros ya construidos.
 * Los 5 métodos públicos solo construyen el WHERE específico y llaman a los
 * 4 privados con Promise.all() para ejecutarlos en paralelo.
 *
 * Traducciones MSSQL → PostgreSQL:
 *   ISNULL            → COALESCE
 *   STUFF/FOR XML     → STRING_AGG
 *   CONVERT(money,1)  → TO_CHAR(cantidad, 'FM999G999G999D99')
 *   RTRIM             → TRIM
 *   PERSONASAUX       → public.persona_auxiliar (campo estado: varchar 30)
 *   Op_Coordx/y       → o.coord_x / o.coord_y (double precision)
 *   CodServicio       → a.codigo_servicio
 */
@Injectable()
export class CuadrosRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource,
  ) { }

  // ─── SELECT del grid principal ─────────────────────────────────────────────

  /**
   * 14 columnas del SELECT principal (MuestraResultados → GridView1).
   * Alias descriptivos en lugar de op0–op14.
   * Se combina con FROM_BASE + cláusula WHERE en cada método público.
   */
  private readonly SELECT_FILAS = `
    SELECT
      o.id_operativo::text                                    AS "idOperativo",
      TO_CHAR(o.fecha_operativo, 'DD/MM/YYYY')               AS "fechaOperativo",
      a.numero_caso                                           AS "numeroCaso",

      /* op3: Unidad - Distrital - Grupo (ubicación institucional) */
      COALESCE(TRIM(uni.descripcion), '')
        || ' - ' || COALESCE(TRIM(dis.descripcion), '')
        || ' - ' || COALESCE(TRIM(grp.descripcion), '')      AS "ubicacionInstitucional",

      /* op4: Departamento - Provincia - Localidad - Lugar */
      dep.descripcion || ' - ' || prov.descripcion
        || ' - ' || UPPER(loc.descripcion)
        || ' - ' || UPPER(TRIM(o.lugar))                     AS "ubicacionGeografica",

      /* op5: Asignado + Fiscal asignado (origen: AsigCaso + FiscalAsigCaso) */
      COALESCE(TRIM(a.asignado_caso), '')
        || ' - ' || COALESCE(TRIM(a.fiscal_asignado_caso), '') AS "asignadoFiscal",

      /* op6: Todas las personas implicadas (PERSONASAUX sin filtro de estado)
              Incluye aprehendidos + arrestados + otros registrados en el operativo. */
      COALESCE((
        SELECT STRING_AGG(
          TRIM(per.nombres) || ' ' || TRIM(per.apellido_paterno) || ' '
            || TRIM(per.apellido_materno) || ' ' || TRIM(per.apellido_esposo)
            || E'\n   Nac.: ' || pa.descripcion
            || E'\n   Estado: ' || per.estado,
          ' | '
        )
        FROM public.persona_auxiliar per
        JOIN parametricas.pais pa ON per.id_pais = pa.id_pais
        WHERE per.id_operativo = o.id_operativo
      ), '') AS "personasImplicadas",

      /* op7: Drogas — tipo + estado + cantidad + forma de transporte */
      COALESCE((
        SELECT STRING_AGG(
          td.descripcion
            || E'\n   Estado: ' || ed.descripcion
            || E'\n   Cantidad: ' || TO_CHAR(dr.cantidad, 'FM999G999G999D99')
            || ' ' || ed.medida
            || E'\n   Forma de Transporte: ' || ft.descripcion,
          ' | '
        )
        FROM public.droga dr
        JOIN public.estado_droga           ed  ON dr.id_estado_droga   = ed.id_estado_droga
        JOIN parametricas.tipo_droga       td  ON ed.id_tipo_droga     = td.id_tipo_droga
        JOIN parametricas.forma_transporte ft  ON dr.id_forma_transporte = ft.id_forma_transporte
        WHERE dr.id_operativo = o.id_operativo
      ), '') AS "drogas",

      /* op8: Sustancias precursoras sólidas */
      COALESCE((
        SELECT STRING_AGG(
          ssd.descripcion || ': '
            || TO_CHAR(ss.cantidad, 'FM999G999G999D99') || ' Kgs.',
          ' | '
        )
        FROM public.sustancia_solida ss
        JOIN parametricas.sustancia_solida_descripcion ssd
          ON ss.id_sustancia_solida_descripcion = ssd.id_sustancia_solida_descripcion
        WHERE ss.id_operativo = o.id_operativo
      ), '') AS "sustanciasSolidas",

      /* op9: Sustancias precursoras líquidas */
      COALESCE((
        SELECT STRING_AGG(
          sld.descripcion || ': '
            || TO_CHAR(sl.cantidad, 'FM999G999G999D99') || ' Lts.',
          ' | '
        )
        FROM public.sustancia_liquida sl
        JOIN parametricas.sustancia_liquida_descripcion sld
          ON sl.id_sustancia_liquida_descripcion = sld.id_sustancia_liquida_descripcion
        WHERE sl.id_operativo = o.id_operativo
      ), '') AS "sustanciasLiquidas",

      /* op10: Laboratorios y fábricas — tipo + cantidad */
      COALESCE((
        SELECT STRING_AGG(
          tf.descripcion || ': '
            || REPLACE(TO_CHAR(f.cantidad::numeric, 'FM999G999G999'), '.00', ''),
          ' | '
        )
        FROM public.fabrica f
        JOIN public.fabrica_modelo     fm ON f.id_fabrica_modelo  = fm.id_fabrica_modelo
        JOIN parametricas.tipo_fabrica tf ON fm.id_tipo_fabrica   = tf.id_tipo_fabrica
        WHERE f.id_operativo = o.id_operativo
      ), '') AS "laboratoriosFabricas",

      /* op11: Bienes incautados — tipo de catálogo */
      COALESCE((
        SELECT STRING_AGG(ct.descripcion, ' | ')
        FROM public.item_bien_secuestrado ibs
        JOIN public.catalogo_tipo ct ON ibs.id_catalogo_tipo = ct.id_catalogo_tipo
        WHERE ibs.id_operativo = o.id_operativo
      ), '') AS "bienesIncautados",

      /* op12: Tipo de operativo */
      top.descripcion AS "tipoOperativo",

      /* op13: Tipo de relevancia */
      tr.descripcion  AS "tipoRelevancia",

      /* op14: Costo total = SUM de todos los elementos del operativo
               Origen: subconsulta escalar de MuestraResultados */
      TO_CHAR(
        COALESCE((SELECT SUM(dr2.costo) FROM public.droga dr2           WHERE dr2.id_operativo = o.id_operativo), 0) +
        COALESCE((SELECT SUM(ss2.costo) FROM public.sustancia_solida ss2 WHERE ss2.id_operativo = o.id_operativo), 0) +
        COALESCE((SELECT SUM(sl2.costo) FROM public.sustancia_liquida sl2 WHERE sl2.id_operativo = o.id_operativo), 0) +
        COALESCE((SELECT SUM(ibs2.costo_aproximado) FROM public.item_bien_secuestrado ibs2 WHERE ibs2.id_operativo = o.id_operativo), 0),
        'FM999G999G999D99'
      ) AS "totalCosto"
  `

  // ─── FROM + JOINs base ─────────────────────────────────────────────────────

  /**
   * JOINs compartidos por todos los filtros.
   * tipo_operacion y tipo_relevancia son INNER JOIN porque todo operativo
   * debe tener ambos campos asignados.
   * unidad/distrital/grupo son LEFT JOIN por registros legacy sin esos datos.
   */
  private readonly FROM_BASE = `
    FROM public.asignacion a
    JOIN  public.operativo                  o    ON a.id_caso           = o.id_caso
    JOIN  parametricas.departamento         dep  ON o.id_departamento   = dep.id_departamento
    JOIN  parametricas.provincia            prov ON o.id_provincia      = prov.id_provincia
    JOIN  parametricas.localidad            loc  ON o.id_localidad      = loc.id_localidad
    JOIN  parametricas.tipo_operacion       top  ON o.id_tipo_operacion = top.id_tipo_operacion
    JOIN  parametricas.tipo_relevancia      tr   ON o.id_tipo_relevancia= tr.id_tipo_relevancia
    LEFT JOIN public.unidad                 uni  ON o.id_unidad         = uni.id_unidad
    LEFT JOIN public.distrital              dis  ON o.id_distrital      = dis.id_distrital
    LEFT JOIN public.grupo                  grp  ON o.id_grupo          = grp.id_grupo
  `

  // ─── Métodos privados (reutilizados por los 5 filtros públicos) ────────────

  /**
   * Grid principal (MuestraResultados).
   * @param where  cláusula WHERE sin la palabra WHERE
   * @param params parámetros posicionales $1, $2, ...
   */
  private async buscarFilas(where: string, params: unknown[]): Promise<FilaCuadro[]> {
    return this.dataSource.query(
      `${this.SELECT_FILAS}
       ${this.FROM_BASE}
       WHERE ${where}
       ORDER BY o.fecha_operativo DESC`,
      params,
    )
  }

  /**
   * Totales estadísticos consolidados (13 métodos NumXxx del formulario + listadrogas).
   * Usa un único JOIN base para todos los subqueries escalares.
   * @param where  cláusula WHERE sin la palabra WHERE
   * @param params parámetros posicionales $1, $2, ...
   */
  private async calcularResumen(where: string, params: unknown[]): Promise<ResumenEstadistico> {
    // Subquery base de operativos que cumplan el filtro — se reutiliza en cada suma
    const subOp = `
      SELECT o2.id_operativo
      FROM public.asignacion a2
      JOIN public.operativo o2 ON a2.id_caso = o2.id_caso
      WHERE ${where.replace(/\ba\./g, 'a2.').replace(/\bo\./g, 'o2.')}
    `

    const totalesSQL = `
      SELECT
        /* NumCocaina (Td_Id=1) — Cocaína Base / Pasta Base */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
          WHERE ed.id_tipo_droga = 1 AND dr.id_operativo IN (${subOp})
        ), 0) AS "cocainaBasePasta",

        /* NumClorhidrato (Td_Id=2) — Clorhidrato de Cocaína */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
          WHERE ed.id_tipo_droga = 2 AND dr.id_operativo IN (${subOp})
        ), 0) AS "clorhidratoCocaina",

        /* NumMarihuana (Td_Id=4, Medida=Gramos) */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
          WHERE ed.id_tipo_droga = 4 AND ed.medida = 'Gramos' AND dr.id_operativo IN (${subOp})
        ), 0) AS "marihuanaGramos",

        /* NumMarihuanaLiq (Td_Id=4, Medida=Litros) */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
          WHERE ed.id_tipo_droga = 4 AND ed.medida = 'Litros' AND dr.id_operativo IN (${subOp})
        ), 0) AS "marihuanaLitros",

        /* NumDrogasLiquidas (EstDg_Id=321) — en litros */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          WHERE dr.id_estado_droga = 321 AND dr.id_operativo IN (${subOp})
        ), 0) AS "drogasLiquidasLitros",

        /* NumCocainaLiquida (EstDg_Id=5) — en litros */
        COALESCE((
          SELECT SUM(dr.cantidad) FROM public.droga dr
          WHERE dr.id_estado_droga = 5 AND dr.id_operativo IN (${subOp})
        ), 0) AS "cocainaLiquidaLitros",

        /* numvSusSol — sustancias sólidas (excluye "Sin Determinar" Ssd_Id=52) */
        COALESCE((
          SELECT SUM(ss.cantidad) FROM public.sustancia_solida ss
          WHERE ss.id_sustancia_solida_descripcion <> 52 AND ss.id_operativo IN (${subOp})
        ), 0) AS "sustanciasSolidasKg",

        /* numvSusSolSinDet — sustancias sólidas "Sin Determinar" (Ssd_Id=52) */
        COALESCE((
          SELECT SUM(ss.cantidad) FROM public.sustancia_solida ss
          WHERE ss.id_sustancia_solida_descripcion = 52 AND ss.id_operativo IN (${subOp})
        ), 0) AS "sustanciasSolidasSinDet",

        /* numvSusLiq — sustancias líquidas (excluye "Sin Determinar" Sld_Id=69) */
        COALESCE((
          SELECT SUM(sl.cantidad) FROM public.sustancia_liquida sl
          WHERE sl.id_sustancia_liquida_descripcion <> 69 AND sl.id_operativo IN (${subOp})
        ), 0) AS "sustanciasLiquidasLt",

        /* numvSusLiqSinDet — sustancias líquidas "Sin Determinar" (Sld_Id=69) */
        COALESCE((
          SELECT SUM(sl.cantidad) FROM public.sustancia_liquida sl
          WHERE sl.id_sustancia_liquida_descripcion = 69 AND sl.id_operativo IN (${subOp})
        ), 0) AS "sustanciasLiquidasSinDet",

        /* numaprehendidos — personas con estado Aprehendido en el operativo */
        (
          SELECT COUNT(*) FROM public.persona_auxiliar per
          WHERE per.estado IN ('Aprehendido', 'Principal Aprehendido')
            AND per.id_operativo IN (${subOp})
        ) AS "totalAprehendidos",

        /* numarrestados — personas con estado Arrestado */
        (
          SELECT COUNT(*) FROM public.persona_auxiliar per
          WHERE per.estado = 'Arrestado'
            AND per.id_operativo IN (${subOp})
        ) AS "totalArrestados"
    `

    const [totalesRow, otrasDrogas] = await Promise.all([
      this.dataSource.query<Record<string, string>[]>(totalesSQL, params),
      // listadrogas — otras drogas (excluye Td_Id IN (1,2,3,4,206))
      this.dataSource.query<OtraDroga[]>(
        `SELECT
           td.descripcion  AS "descripcionTipo",
           ed.descripcion  AS "descripcionEstado",
           TO_CHAR(SUM(dr.cantidad), 'FM999G999G999D99') AS "cantidad",
           ed.medida       AS "medida"
         FROM public.droga dr
         JOIN public.estado_droga       ed ON dr.id_estado_droga = ed.id_estado_droga
         JOIN parametricas.tipo_droga   td ON ed.id_tipo_droga   = td.id_tipo_droga
         WHERE ed.id_tipo_droga NOT IN (1, 2, 3, 4, 206)
           AND dr.id_operativo IN (${subOp})
         GROUP BY dr.id_estado_droga, td.descripcion, ed.descripcion, ed.medida
         ORDER BY dr.id_estado_droga`,
        params,
      ),
    ])

    const t = totalesRow[0] ?? {}
    const litrosDrogasLiq = parseFloat(t.drogasLiquidasLitros ?? '0')
    const litrosCocainaLiq = parseFloat(t.cocainaLiquidaLitros ?? '0')

    return {
      cocainaBasePasta: t.cocainaBasePasta ?? '0',
      clorhidratoCocaina: t.clorhidratoCocaina ?? '0',
      marihuanaGramos: t.marihuanaGramos ?? '0',
      marihuanaLitros: t.marihuanaLitros ?? '0',
      drogasLiquidasLitros: t.drogasLiquidasLitros ?? '0',
      drogasLiquidasGramos: ((litrosDrogasLiq / 26.44) * 1000).toFixed(2),
      cocainaLiquidaLitros: t.cocainaLiquidaLitros ?? '0',
      cocainaLiquidaGramos: ((litrosCocainaLiq / 10) * 1000).toFixed(2),
      sustanciasSolidasKg: t.sustanciasSolidasKg ?? '0',
      sustanciasSolidasSinDet: t.sustanciasSolidasSinDet ?? '0',
      sustanciasLiquidasLt: t.sustanciasLiquidasLt ?? '0',
      sustanciasLiquidasSinDet: t.sustanciasLiquidasSinDet ?? '0',
      totalAprehendidos: parseInt(t.totalAprehendidos ?? '0', 10),
      totalArrestados: parseInt(t.totalArrestados ?? '0', 10),
      otrasDrogas,
    }
  }

  /**
   * Grid de fábricas por tipo (listaFabricas → DGFP).
   */
  private async listarFabricas(where: string, params: unknown[]): Promise<ResumenFabrica[]> {
    return this.dataSource.query(
      `SELECT
         tf.id_tipo_fabrica                         AS "idTipoFabrica",
         tf.descripcion || '(s)'                    AS "descripcion",
         SUM(f.cantidad)                            AS "totalCantidad"
       FROM public.fabrica f
       JOIN public.fabrica_modelo     fm ON f.id_fabrica_modelo  = fm.id_fabrica_modelo
       JOIN parametricas.tipo_fabrica tf ON fm.id_tipo_fabrica   = tf.id_tipo_fabrica
       JOIN public.operativo          o  ON f.id_operativo       = o.id_operativo
       JOIN public.asignacion         a  ON o.id_caso            = a.id_caso
       WHERE ${where}
       GROUP BY tf.id_tipo_fabrica, tf.descripcion
       ORDER BY tf.id_tipo_fabrica`,
      params,
    )
  }

  /**
   * Operativos con coordenadas GPS (operativos → gvresultados).
   * La URL de Google Maps se construye en el frontend con coord_x y coord_y.
   */
  private async listarCoordenadas(where: string, params: unknown[]): Promise<CoordenadaOp[]> {
    return this.dataSource.query(
      `SELECT
         o.id_operativo::text  AS "idOperativo",
         a.numero_caso         AS "numeroCaso",
         a.numero_operativo    AS "numeroOperativo",
         o.coord_x             AS "coordX",
         o.coord_y             AS "coordY"
       FROM public.asignacion a
       JOIN public.operativo  o ON a.id_caso = o.id_caso
       WHERE ${where}
       ORDER BY o.fecha_operativo`,
      params,
    )
  }

  // ─── Helper para ejecutar los 4 métodos en paralelo ───────────────────────

  private async ejecutar(where: string, params: unknown[]): Promise<RespuestaCuadro> {
    const [filas, resumen, fabricas, coordenadas] = await Promise.all([
      this.buscarFilas(where, params),
      this.calcularResumen(where, params),
      this.listarFabricas(where, params),
      this.listarCoordenadas(where, params),
    ])
    return { filas, resumen, fabricas, coordenadas }
  }

  // ─── Métodos públicos (5 filtros) ─────────────────────────────────────────

  /**
   * Reporte por código de servicio.
   * Origen: filtro original de ReporteServicio.aspx.cs (Request.QueryString["id"]).
   * Equivale al único parámetro del formulario original.
   */
  async buscarPorServicio(codServicio: string): Promise<RespuestaCuadro> {
    return this.ejecutar(`a.codigo_servicio ILIKE $1`, [`%${codServicio.trim()}%`])
  }

  /**
   * Reporte por rango de fechas.
   * Análogo a btnfecha_Click de cruzadas.
   */
  async buscarPorFecha(fechaInicio: string, fechaFin: string): Promise<RespuestaCuadro> {
    return this.ejecutar(
      `o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`],
    )
  }

  /**
   * Reporte de operativos que contienen drogas del tipo indicado, en rango de fechas.
   * Requiere JOIN adicional a droga/estado_droga para filtrar por id_tipo_droga.
   * Análogo a tntipodroga_Click de cruzadas.
   */
  async buscarPorTipoDroga(
    idTipoDroga: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    // WHERE construido a mano porque necesita subquery con el filtro de tipo_droga
    const where = `
      o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
      AND EXISTS (
        SELECT 1 FROM public.droga dr
        JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
        WHERE dr.id_operativo = o.id_operativo AND ed.id_tipo_droga = $3
      )`
    return this.ejecutar(where, [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoDroga])
  }

  /**
   * Reporte de operativos por tipo de operación, en rango de fechas.
   * Análogo a btntipooper_Click de cruzadas.
   */
  async buscarPorTipoOperativo(
    idTipoOperacion: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    return this.ejecutar(
      `o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp AND o.id_tipo_operacion = $3`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoOperacion],
    )
  }

  /**
   * Reporte de operativos por tipo de relevancia, en rango de fechas.
   * Análogo a btnrelev_Click de cruzadas.
   */
  async buscarPorRelevancia(
    idTipoRelevancia: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    return this.ejecutar(
      `o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp AND o.id_tipo_relevancia = $3`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoRelevancia],
    )
  }

  /**
   * Reporte de operativos que contienen una persona en la tabla public.persona_auxiliar
   * con el nombre indicado.
   */
  async buscarPorPersona(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<RespuestaCuadro> {
    const where = `
      EXISTS (
        SELECT 1 FROM public.persona_auxiliar per2
        WHERE per2.id_operativo = o.id_operativo
          AND per2.nombres          ILIKE '%' || $1 || '%'
          AND per2.apellido_paterno ILIKE '%' || $2 || '%'
          AND per2.apellido_materno ILIKE '%' || $3 || '%'
          AND per2.apellido_esposo  ILIKE '%' || $4 || '%'
      )
    `
    return this.ejecutar(where, [nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo])
  }
}
