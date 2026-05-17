import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_SIII } from '../../../shared/constants'
import { ResultadoCruzada } from './interfaces/cruzada-filtro.interface'

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
