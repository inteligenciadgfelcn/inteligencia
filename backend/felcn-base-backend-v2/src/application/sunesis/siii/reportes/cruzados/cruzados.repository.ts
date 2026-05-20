import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { ResultadoCruzada } from './interfaces/cruzada-filtro.interface'
import { ConsultaAvanzadaQueryDto, ResultadoConsultaAvanzada } from './interfaces/consulta-avanzada-filtro.interface'

/**
 * Repositorio CruzadasRepository
 * Consultas cruzadas de operativos SIII.
 * Origen: SEG-CAS-04.aspx.cs — todos los botones de búsqueda del formulario.
 *
 * Todas las consultas devuelven las mismas 16 columnas (op1–op16):
 *   op1  id_operativo
 *   op2  numero_operativo
 *   op3  numero_caso
 *   op4  nombre_caso
 *   op5  asignado_caso
 *   op6  fecha_operativo (DD/MM/YYYY)
 *   op7  departamento-provincia-localidad-lugar
 *   op8  unidad-distrital-grupo
 *   op9  hoja_coca (suma)
 *   op10 drogas (agregado)
 *   op11 sustancias sólidas (agregado)
 *   op12 sustancias líquidas (agregado)
 *   op13 fábricas/laboratorios (agregado)
 *   op14 arrestados (agregado)
 *   op15 personas/detenidos (agregado)
 *   op16 bienes secuestrados (agregado)
 */
@Injectable()
export class CruzadasRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource,
  ) { }

  /**
   * Columnas SELECT compartidas por los 8 filtros.
   * Traducción de MSSQL a PostgreSQL:
   *   ISNULL          → COALESCE
   *   STUFF/FOR XML   → STRING_AGG
   *   CONVERT(103)    → TO_CHAR(date, 'DD/MM/YYYY')
   *   RTRIM           → TRIM
   *   DETENIDOSAUX    → public.persona_auxiliar (nombre en nuevo esquema)
   */
  private readonly SELECT_BASE = `
    SELECT
      o.id_operativo::text                                                             AS "idOperativo",
      a.numero_operativo                                                               AS "numeroOperativo",
      a.numero_caso                                                                    AS "numeroCaso",
      a.nombre_caso                                                                    AS "nombreCaso",
      a.asignado_caso                                                                  AS "asignadoCaso",
      TO_CHAR(o.fecha_operativo, 'DD/MM/YYYY')                                        AS "fechaOperativo",
       /* Ubicación Geografía */
      dep.descripcion || ' - ' ||
      prov.descripcion || ' - ' ||
      loc.descripcion || ' - ' ||
      o.lugar AS "ubicacionGeografica",
     
      /* Ubicacion Institucional*/
      uni.descripcion || ' - ' ||
      dis.descripcion || ' - ' ||
      grp.descripcion  AS "ubicacionInstitucional",

      /* Hoja de coca: suma total de cantidades */
      COALESCE((
        SELECT TO_CHAR(SUM(hc.coca_cantidad), 'FM999G999G999')
        FROM public.hoja_coca hc
        WHERE hc.id_operativo = o.id_operativo
      ), '') AS "totalHojaCoca",

      /* Drogas: tipo + estado + cantidad + forma de transporte */
      COALESCE((
        SELECT STRING_AGG(
            '- ' || td.descripcion
            || E'\n   Estado: ' || ed.descripcion
            || E'\n   Cantidad: ' || TO_CHAR(dr.cantidad, 'FM999G999G999D99') || ' Grs.'
            || E'\n   Forma de Transporte: ' || ft.descripcion,
            ' | '
        )
        FROM public.droga dr
        JOIN public.estado_droga             ed  ON dr.id_estado_droga              = ed.id_estado_droga
        JOIN parametricas.tipo_droga         td  ON ed.id_tipo_droga                = td.id_tipo_droga
        JOIN parametricas.forma_transporte   ft  ON dr.id_forma_transporte          = ft.id_forma_transporte
        WHERE dr.id_operativo = o.id_operativo
      ), '') AS "drogasDecomisadas",

      /* Sustancias precursoras sólidas */
      COALESCE((
        SELECT STRING_AGG(
          '- ' || ssd.descripcion || ': ' || TO_CHAR(ss.cantidad, 'FM999G999G999D99') || ' Grs.',
          ' | '
        )
        FROM public.sustancia_solida ss
        JOIN parametricas.sustancia_solida_descripcion ssd
          ON ss.id_sustancia_solida_descripcion = ssd.id_sustancia_solida_descripcion
        WHERE ss.id_operativo = o.id_operativo
      ), '') AS "sustanciasSolidas",

      /* Sustancias precursoras líquidas */
      COALESCE((
        SELECT STRING_AGG(
          '- ' || sld.descripcion || ': ' || TO_CHAR(sl.cantidad, 'FM999G999G999D99') || ' Grs.',
          ' | '
        )
        FROM public.sustancia_liquida sl
        JOIN parametricas.sustancia_liquida_descripcion sld
          ON sl.id_sustancia_liquida_descripcion = sld.id_sustancia_liquida_descripcion
        WHERE sl.id_operativo = o.id_operativo
      ), '') AS "sustanciasLiquidas",

      /* Laboratorios y fábricas */
      COALESCE((
        SELECT STRING_AGG('- ' || tf.descripcion || ': ' || f.cantidad::text, ' | ')
        FROM public.fabrica f
        JOIN public.fabrica_modelo       fm  ON f.id_fabrica_modelo   = fm.id_fabrica_modelo
        JOIN parametricas.tipo_fabrica   tf  ON fm.id_tipo_fabrica    = tf.id_tipo_fabrica
        WHERE f.id_operativo = o.id_operativo
      ), '') AS "laboratoriosFabricas",

      /* Arrestados: nombre completo + nacionalidad */
      COALESCE((
        SELECT STRING_AGG(
          '- ' || TRIM(arr.nombres)          || ' ' || TRIM(arr.apellido_paterno) || ' '
            || TRIM(arr.apellido_materno) || ' ' || TRIM(arr.apellido_esposo)
            || E'\n   Nac.: ' || pa_arr.descripcion
            || E'\n   Estado: Arrestado',
          ' | '
        )
        FROM public.arrestado_auxiliar arr
        JOIN parametricas.pais pa_arr ON arr.id_pais = pa_arr.id_pais
        WHERE arr.id_operativo = o.id_operativo
      ), '') AS "arrestados",

      /* Personas implicadas (DETENIDOSAUX → public.persona_auxiliar) */
      COALESCE((
        SELECT STRING_AGG(
          '- ' || TRIM(per.nombres)          || ' ' || TRIM(per.apellido_paterno) || ' '
            || TRIM(per.apellido_materno) || ' ' || TRIM(per.apellido_esposo)
            || E'\n   Nac.: ' || pa_per.descripcion
            || E'\n   Estado: ' || per.estado,
          ' | '
        )
        FROM public.persona_auxiliar per
        JOIN parametricas.pais pa_per ON per.id_pais = pa_per.id_pais
        WHERE per.id_operativo = o.id_operativo
      ), '') AS "personasImplicadas",

      /* Bienes incautados */
      COALESCE((
        SELECT STRING_AGG('- ' || ct.descripcion, ' | ')
        FROM public.item_bien_secuestrado ibs
        JOIN public.catalogo_tipo ct ON ibs.id_catalogo_tipo = ct.id_catalogo_tipo
        WHERE ibs.id_operativo = o.id_operativo
      ), '') AS "bienesIncautados"
  `

  /**
   * JOINs base usados en todos los filtros.
   * unidad/distrital/grupo son LEFT JOIN porque los registros legacy pueden
   * tener IDs que no existan en las tablas paramétricas.
   */
  private readonly FROM_BASE = `
    FROM public.asignacion a
    JOIN  public.operativo             o    ON a.id_caso          = o.id_caso
    JOIN  parametricas.departamento    dep  ON o.id_departamento  = dep.id_departamento
    JOIN  parametricas.provincia       prov ON o.id_provincia     = prov.id_provincia
    JOIN  parametricas.localidad       loc  ON o.id_localidad     = loc.id_localidad
    LEFT JOIN public.unidad            uni  ON o.id_unidad        = uni.id_unidad
    LEFT JOIN public.distrital         dis  ON o.id_distrital     = dis.id_distrital
    LEFT JOIN public.grupo             grp  ON o.id_grupo         = grp.id_grupo
  `

  /**
   * Busca operativos en un rango de fechas.
   * Origen: btnfecha_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorFecha(fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       WHERE o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
       ORDER BY o.fecha_operativo DESC`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`],
    )
  }

  /**
   * Busca operativos cuyo número de caso contiene el texto indicado.
   * Origen: btncaso_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorCaso(numeroCaso: string): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       WHERE a.numero_caso ILIKE '%' || $1 || '%'
       ORDER BY o.id_operativo DESC`,
      [numeroCaso.trim().toUpperCase()],
    )
  }

  /**
   * Busca operativos por tipo de droga en un rango de fechas.
   * Requiere JOIN adicional a droga/estado_droga para filtrar por id_tipo_droga.
   * Origen: tntipodroga_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorTipoDroga(
    idTipoDroga: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       JOIN public.droga        dr2 ON o.id_operativo      = dr2.id_operativo
       JOIN public.estado_droga ed2 ON dr2.id_estado_droga = ed2.id_estado_droga
       WHERE o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
         AND ed2.id_tipo_droga = $3
       ORDER BY o.id_operativo DESC`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoDroga],
    )
  }

  /**
   * Busca operativos por estado de droga en un rango de fechas.
   * Origen: btnestadroga_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorEstadoDroga(
    idEstadoDroga: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       JOIN public.droga dr2 ON o.id_operativo = dr2.id_operativo
       WHERE o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
         AND dr2.id_estado_droga = $3
       ORDER BY o.id_operativo DESC`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idEstadoDroga],
    )
  }

  /**
   * Busca operativos por tipo de operación en un rango de fechas.
   * Origen: btntipooper_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorTipoOperativo(
    idTipoOperacion: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       WHERE o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
         AND o.id_tipo_operacion = $3
       ORDER BY o.id_operativo DESC`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoOperacion],
    )
  }

  /**
   * Busca operativos por tipo de relevancia en un rango de fechas.
   * Origen: btnrelev_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorRelevancia(
    idTipoRelevancia: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       WHERE o.fecha_operativo BETWEEN $1::timestamp AND $2::timestamp
         AND o.id_tipo_relevancia = $3
       ORDER BY o.id_operativo DESC`,
      [`${fechaInicio} 00:00:00`, `${fechaFin} 23:59:59`, idTipoRelevancia],
    )
  }

  /**
   * Busca operativos que contengan una persona aprehendida (detenida) con el nombre indicado.
   * DETENIDOSAUX en el sistema legacy → public.persona_auxiliar en el nuevo esquema.
   * Origen: btnaprehen_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorAprehendido(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       JOIN public.persona_auxiliar per2 ON o.id_operativo = per2.id_operativo
       WHERE per2.nombres          ILIKE '%' || $1 || '%'
         AND per2.apellido_paterno ILIKE '%' || $2 || '%'
         AND per2.apellido_materno ILIKE '%' || $3 || '%'
         AND per2.apellido_esposo  ILIKE '%' || $4 || '%'
       ORDER BY o.id_operativo DESC`,
      [nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo],
    )
  }

  // ── Consulta avanzada (42 filtros opcionales) ────────────────────────────

  private readonly SQL_AVANZADO = `
SELECT
  o.id_operativo::text                                          AS "idOperativo",
  TO_CHAR(o.fecha_operativo, 'DD/MM/YYYY HH24:MI')             AS "fechaOperativo",
  a.numero_caso                                                 AS "numeroCaso",
  a.numero_operativo                                            AS "numeroOperativo",
  o.numero_informe                                              AS "numeroInforme",
  --COALESCE(TRIM(uni.descripcion), '')
  --  || ' - ' || COALESCE(TRIM(dis.descripcion), '')
  --  || ' - ' || COALESCE(TRIM(grp.descripcion), '')            AS "ubicacionInstitucional",
  COALESCE(TRIM(uni.abreviatura), '')
    || ' - ' || COALESCE(TRIM(dis.descripcion), '')              AS "ubicacionInstitucional",
  dep.descripcion
    || ' - ' || prov.descripcion
    || ' - ' || UPPER(loc.descripcion)
    || ' - ' || UPPER(TRIM(o.lugar))                           AS "ubicacionGeografica",
  a.nombre_caso                                                 AS "nombreCaso",
  a.ianus                                                       AS "ianus",
  TRIM(a.fiscal_solicitud)                                      AS "fiscalSolicitud",
  TRIM(a.asignado_caso)                                         AS "asignado",
  TRIM(a.fiscal_asignado_caso)                                  AS "asignadoFiscal",
  top.descripcion                                               AS "tipoOperativo",
  tr.descripcion                                                AS "tipoRelevancia",
  COALESCE(tr.color, '')                                        AS "colorRelevancia",
  cat.descripcion                                               AS "categoriaOperativo",
  po.nombre                                                     AS "planOperacion",
  tden.descripcion                                              AS "tipoDenuncia",
  tpen.descripcion                                              AS "tipoPenal",
  TRIM(o.organizacion)                                          AS "organizacion",
  TRIM(o.mando)                                                 AS "alMandoDe",
  TRIM(o.clan_familiar)                                         AS "clanFamiliar",
  o.es_positivo                                                 AS "esPositivo",
  o.es_aprehendido                                              AS "esAprehendido",
  o.es_arrestado                                                AS "esArrestado",
  o.es_icia                                                     AS "esIcia",
  o.es_parte_diario                                             AS "esParteDiario",
  o.es_revisado                                                 AS "esRevisado",
  o.coord_x                                                     AS "coordX",
  o.coord_y                                                     AS "coordY",
  COALESCE((
    SELECT STRING_AGG(
      TRIM(per.nombres) || ' ' || TRIM(per.apellido_paterno)
        || ' ' || TRIM(per.apellido_materno)
        || ' ' || TRIM(per.apellido_esposo)
        || E'\\n   Doc.: '    || TRIM(per.nro_documento)
        || E'\\n   Nac.: '    || pa_per.descripcion
        || E'\\n   Estado: '  || per.estado,
      ' | '
    )
    FROM public.persona_auxiliar per
    JOIN parametricas.pais pa_per ON per.id_pais = pa_per.id_pais
    WHERE per.id_operativo = o.id_operativo
  ), '')                                                        AS "personasImplicadas",
  COALESCE((
    SELECT STRING_AGG(
      td.descripcion
        || E'\\n   Estado: '      || ed.descripcion
        || E'\\n   Cantidad: '    || TO_CHAR(dr.cantidad, 'FM999G999G999D99') || ' ' || ed.medida
        || E'\\n   Transporte: '  || ft.descripcion
        || E'\\n   Procedencia: ' || pa_orig.descripcion
        || E'\\n   Destino: '     || pa_dest.descripcion
        || E'\\n   Costo Bs: '    || TO_CHAR(dr.costo, 'FM999G999G999D99'),
      ' | '
    )
    FROM public.droga dr
    JOIN public.estado_droga               ed      ON dr.id_estado_droga     = ed.id_estado_droga
    JOIN parametricas.tipo_droga           td      ON ed.id_tipo_droga       = td.id_tipo_droga
    JOIN parametricas.forma_transporte     ft      ON dr.id_forma_transporte = ft.id_forma_transporte
    JOIN parametricas.pais                 pa_orig ON dr.id_pais             = pa_orig.id_pais
    JOIN parametricas.pais                 pa_dest ON dr.id_pais_destino     = pa_dest.id_pais
    WHERE dr.id_operativo = o.id_operativo
  ), '')                                                        AS "drogas",
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
  ), '')                                                        AS "sustanciasSolidas",
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
  ), '')                                                        AS "sustanciasLiquidas",
  COALESCE((
    SELECT STRING_AGG(
      tf.descripcion || ': '
        || REPLACE(TO_CHAR(f.cantidad::numeric, 'FM999G999G999'), '.00', ''),
      ' | '
    )
    FROM public.fabrica f
    JOIN public.fabrica_modelo     fm ON f.id_fabrica_modelo = fm.id_fabrica_modelo
    JOIN parametricas.tipo_fabrica tf ON fm.id_tipo_fabrica  = tf.id_tipo_fabrica
    WHERE f.id_operativo = o.id_operativo
  ), '')                                                        AS "laboratoriosFabricas",
  COALESCE((
    SELECT STRING_AGG(
      sub.descripcion || ': ' || sub.cantidad,
      ' | '
      ORDER BY sub.descripcion
    )
    FROM (
      SELECT ct.descripcion, COUNT(*)::int AS cantidad
      FROM public.item_bien_secuestrado ibs
      JOIN public.catalogo_tipo ct ON ibs.id_catalogo_tipo = ct.id_catalogo_tipo
      WHERE ibs.id_operativo = o.id_operativo
      GROUP BY ct.id_catalogo_tipo, ct.descripcion
    ) sub
  ), '')                                                        AS "bienesIncautados",
  TO_CHAR(
    COALESCE((SELECT SUM(dr2.costo)             FROM public.droga                  dr2  WHERE dr2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ss2.costo)             FROM public.sustancia_solida       ss2  WHERE ss2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(sl2.costo)             FROM public.sustancia_liquida      sl2  WHERE sl2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ibs2.costo_aproximado) FROM public.item_bien_secuestrado ibs2  WHERE ibs2.id_operativo = o.id_operativo), 0),
    'FM999G999G999D99'
  )                                                             AS "totalCosto"

FROM public.asignacion                  a
JOIN  public.operativo                  o    ON a.id_caso               = o.id_caso
JOIN  parametricas.departamento         dep  ON o.id_departamento       = dep.id_departamento
JOIN  parametricas.provincia            prov ON o.id_provincia          = prov.id_provincia
JOIN  parametricas.localidad            loc  ON o.id_localidad          = loc.id_localidad
JOIN  parametricas.tipo_operacion       top  ON o.id_tipo_operacion     = top.id_tipo_operacion
JOIN  parametricas.tipo_relevancia      tr   ON o.id_tipo_relevancia    = tr.id_tipo_relevancia
JOIN  parametricas.plan_operaciones     po   ON o.id_plan_operacion     = po.id_plan_operacion
JOIN  parametricas.categoria_operativo  cat  ON o.id_categoria_operativo= cat.id_categoria_operativo
LEFT JOIN public.unidad                 uni  ON o.id_unidad             = uni.id_unidad
LEFT JOIN public.distrital              dis  ON o.id_distrital          = dis.id_distrital
LEFT JOIN public.grupo                  grp  ON o.id_grupo              = grp.id_grupo
LEFT JOIN parametricas.tipo_denuncia    tden ON o.id_tipo_denuncia      = tden.id_tipo_denuncia
LEFT JOIN parametricas.tipo_penal       tpen ON o.id_tipo_penal         = tpen.id_tipo_penal

WHERE
  ($1::text    IS NULL OR a.codigo_servicio      ILIKE '%' || $1  || '%')
  AND ($2::date    IS NULL OR o.fecha_operativo  >= $2::timestamp)
  AND ($3::date    IS NULL OR o.fecha_operativo  <= ($3::timestamp + INTERVAL '23:59:59'))
  AND ($4::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.droga dr
    JOIN public.estado_droga ed ON dr.id_estado_droga = ed.id_estado_droga
    WHERE dr.id_operativo = o.id_operativo AND ed.id_tipo_droga = $4
  ))
  AND ($5::integer IS NULL OR o.id_tipo_operacion    = $5)
  AND ($6::integer IS NULL OR o.id_tipo_relevancia   = $6)
  AND ($7::integer IS NULL OR o.id_departamento      = $7)
  AND ($8::integer IS NULL OR o.id_provincia         = $8)
  AND ($9::integer IS NULL OR o.id_localidad         = $9)
  AND ($10::text   IS NULL OR o.lugar ILIKE '%' || $10 || '%')
  AND ($11::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.item_bien_secuestrado ibs
    WHERE ibs.id_operativo = o.id_operativo AND ibs.id_catalogo_tipo = $11
  ))
  AND ($12::text   IS NULL OR a.numero_caso          ILIKE '%' || $12 || '%')
  AND ($13::integer IS NULL OR o.id_unidad           = $13)
  AND ($14::text   IS NULL OR a.fiscal_asignado_caso ILIKE '%' || $14 || '%')
  AND ($15::integer IS NULL OR o.id_plan_operacion   = $15)
  AND ($16::text   IS NULL OR o.organizacion         ILIKE '%' || $16 || '%')
  AND ($17::boolean IS NULL OR o.es_positivo         = $17)
  AND ($18::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.droga dr
    WHERE dr.id_operativo = o.id_operativo AND dr.id_estado_droga = $18
  ))
  AND ($19::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.droga dr
    WHERE dr.id_operativo = o.id_operativo AND dr.id_pais = $19
  ))
  AND ($20::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.droga dr
    WHERE dr.id_operativo = o.id_operativo AND dr.id_pais_destino = $20
  ))
  AND ($21::numeric IS NULL OR
    COALESCE((SELECT SUM(dr2.costo) FROM public.droga dr2 WHERE dr2.id_operativo = o.id_operativo), 0) >= $21
  )
  AND ($22::numeric IS NULL OR
    COALESCE((SELECT SUM(dr2.costo) FROM public.droga dr2 WHERE dr2.id_operativo = o.id_operativo), 0) <= $22
  )
  AND ($23::text IS NULL OR EXISTS (
    SELECT 1 FROM public.persona_auxiliar per
    WHERE per.id_operativo = o.id_operativo AND per.nombres ILIKE '%' || $23 || '%'
  ))
  AND ($24::text IS NULL OR EXISTS (
    SELECT 1 FROM public.persona_auxiliar per
    WHERE per.id_operativo = o.id_operativo AND per.apellido_paterno ILIKE '%' || $24 || '%'
  ))
  AND ($25::text IS NULL OR EXISTS (
    SELECT 1 FROM public.persona_auxiliar per
    WHERE per.id_operativo = o.id_operativo AND per.apellido_materno ILIKE '%' || $25 || '%'
  ))
  AND ($26::text IS NULL OR EXISTS (
    SELECT 1 FROM public.persona_auxiliar per
    WHERE per.id_operativo = o.id_operativo AND per.nro_documento ILIKE '%' || $26 || '%'
  ))
  AND ($27::integer IS NULL OR EXISTS (
    SELECT 1 FROM public.persona_auxiliar per
    WHERE per.id_operativo = o.id_operativo AND per.id_pais = $27
  ))
  AND ($28::numeric IS NULL OR (
    COALESCE((SELECT SUM(dr2.costo)             FROM public.droga                  dr2  WHERE dr2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ss2.costo)             FROM public.sustancia_solida       ss2  WHERE ss2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(sl2.costo)             FROM public.sustancia_liquida      sl2  WHERE sl2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ibs2.costo_aproximado) FROM public.item_bien_secuestrado ibs2  WHERE ibs2.id_operativo = o.id_operativo), 0)
  ) >= $28)
  AND ($29::numeric IS NULL OR (
    COALESCE((SELECT SUM(dr2.costo)             FROM public.droga                  dr2  WHERE dr2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ss2.costo)             FROM public.sustancia_solida       ss2  WHERE ss2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(sl2.costo)             FROM public.sustancia_liquida      sl2  WHERE sl2.id_operativo  = o.id_operativo), 0) +
    COALESCE((SELECT SUM(ibs2.costo_aproximado) FROM public.item_bien_secuestrado ibs2  WHERE ibs2.id_operativo = o.id_operativo), 0)
  ) <= $29)
  AND ($30::integer IS NULL OR o.id_tipo_denuncia      = $30)
  AND ($31::integer IS NULL OR o.id_tipo_penal         = $31)
  AND ($32::integer IS NULL OR o.id_categoria_operativo= $32)
  AND ($33::boolean IS NULL OR o.es_aprehendido        = $33)
  AND ($34::boolean IS NULL OR o.es_arrestado          = $34)
  AND ($35::boolean IS NULL OR o.es_icia               = $35)
  AND ($36::boolean IS NULL OR o.es_parte_diario       = $36)
  AND ($37::boolean IS NULL OR o.es_revisado           = $37)
  AND ($38::text IS NULL OR a.nombre_caso       ILIKE '%' || $38 || '%')
  AND ($39::text IS NULL OR a.numero_operativo  ILIKE '%' || $39 || '%')
  AND ($40::text IS NULL OR a.ianus             ILIKE '%' || $40 || '%')
  AND ($41::text IS NULL OR a.fiscal_solicitud  ILIKE '%' || $41 || '%')
  AND ($42::text IS NULL OR a.asignado_caso     ILIKE '%' || $42 || '%')

ORDER BY o.fecha_operativo DESC
`

  async buscarAvanzado(filtro: ConsultaAvanzadaQueryDto): Promise<ResultadoConsultaAvanzada[]> {
    const s = (v?: string) => (v == null || v === '' ? null : v)
    const n = (v?: string) => (v == null || v === '' ? null : Number(v))
    const b = (v?: string) => (v == null || v === '' ? null : v === 'true')

    const params = [
      s(filtro.codigoServicio),       // $1
      s(filtro.fechaInicio),          // $2
      s(filtro.fechaFin),             // $3
      n(filtro.idTipoDroga),          // $4
      n(filtro.idTipoOperacion),      // $5
      n(filtro.idTipoRelevancia),     // $6
      n(filtro.idDepartamento),       // $7
      n(filtro.idProvincia),          // $8
      n(filtro.idLocalidad),          // $9
      s(filtro.lugar),                // $10
      n(filtro.idCatalogoTipo),       // $11
      s(filtro.numeroCaso),           // $12
      n(filtro.idUnidad),             // $13
      s(filtro.fiscal),               // $14
      n(filtro.idPlanOperacion),      // $15
      s(filtro.organizacion),         // $16
      b(filtro.esPositivo),           // $17
      n(filtro.idEstadoDroga),        // $18
      n(filtro.idPaisProcedencia),    // $19
      n(filtro.idPaisDestino),        // $20
      n(filtro.costoDrogaMin),        // $21
      n(filtro.costoDrogaMax),        // $22
      s(filtro.nombresPersona),       // $23
      s(filtro.apellidoPaterno),      // $24
      s(filtro.apellidoMaterno),      // $25
      s(filtro.nroDocumento),         // $26
      n(filtro.idPaisPersona),        // $27
      n(filtro.costoTotalMin),        // $28
      n(filtro.costoTotalMax),        // $29
      n(filtro.idTipoDenuncia),       // $30
      n(filtro.idTipoPenal),          // $31
      n(filtro.idCategoriaOperativo), // $32
      b(filtro.esAprehendido),        // $33
      b(filtro.esArrestado),          // $34
      b(filtro.esIcia),               // $35
      b(filtro.esParteDiario),        // $36
      b(filtro.esRevisado),           // $37
      s(filtro.nombreCaso),           // $38
      s(filtro.numeroOperativo),      // $39
      s(filtro.ianus),                // $40
      s(filtro.fiscalSolicitud),      // $41
      s(filtro.asignadoCaso),         // $42
    ]

    return this.dataSource.query(this.SQL_AVANZADO, params)
  }

  /**
   * Busca operativos que contengan un arrestado con el nombre indicado.
   * Origen: btnarrestado_Click — SEG-CAS-04.aspx.cs
   */
  async buscarPorArrestado(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<ResultadoCruzada[]> {
    return this.dataSource.query(
      `${this.SELECT_BASE}
       ${this.FROM_BASE}
       JOIN public.arrestado_auxiliar arr2 ON o.id_operativo = arr2.id_operativo
       WHERE arr2.nombres          ILIKE '%' || $1 || '%'
         AND arr2.apellido_paterno ILIKE '%' || $2 || '%'
         AND arr2.apellido_materno ILIKE '%' || $3 || '%'
         AND arr2.apellido_esposo  ILIKE '%' || $4 || '%'
       ORDER BY o.id_operativo DESC`,
      [nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo],
    )
  }
}
