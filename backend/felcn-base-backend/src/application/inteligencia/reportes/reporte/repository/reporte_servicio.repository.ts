import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_SIII } from '@/core/config/database/database.module'

@Injectable()
export class ReporteServicioRepository {
  constructor(
    @InjectDataSource(DB_SIII)
    private readonly dataSource: DataSource
  ) {}

  /*
   * Obtiene una fila por cada operativo
   * perteneciente al código de servicio.
   */
  async obtenerResultados(idServicio: string): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          o.id_operativo
            AS "idOperativo",

         COALESCE(
  TO_CHAR(
    COALESCE(
      o.fecha_operativo,
      o.fecha_hora_ingreso,
      a.fecha_hora_ingreso
    ),
    'DD/MM/YYYY HH12:MI:SS AM'
  ),
  ''
) AS "fechaHora",

          COALESCE(
            NULLIF(
              TRIM(a.numero_caso),
              ''
            ),
            NULLIF(
              TRIM(a.numero_caso_per_dom),
              ''
            ),
            ''
          ) AS "numeroCaso",

          CONCAT_WS(
            ' - ',

            NULLIF(
              UPPER(
                TRIM(
                  COALESCE(
                    u.abreviatura_reporte,
                    u.abreviatura,
                    a.abreviatura_unidad
                  )
                )
              ),
              ''
            ),

            NULLIF(
              UPPER(
                TRIM(dis.descripcion)
              ),
              ''
            ),

            NULLIF(
              UPPER(
                TRIM(g.descripcion)
              ),
              ''
            )
          ) AS "unidad",

          CONCAT_WS(
            ' - ',

            NULLIF(
              UPPER(
                TRIM(dep.descripcion)
              ),
              ''
            ),

            NULLIF(
              UPPER(
                TRIM(pro.descripcion)
              ),
              ''
            ),

            NULLIF(
              UPPER(
                TRIM(loc.descripcion)
              ),
              ''
            ),

            NULLIF(
              UPPER(
                TRIM(o.lugar)
              ),
              ''
            )
          ) AS "lugarOperativo",

          CONCAT_WS(
            ' - ',

            NULLIF(
              TRIM(a.asignado_caso),
              ''
            ),

            NULLIF(
              TRIM(a.fiscal_asignado_caso),
              ''
            )
          ) AS "asignados",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT_WS(
                    ' ',

                    NULLIF(
                      TRIM(pa.nombres),
                      ''
                    ),

                    NULLIF(
                      TRIM(pa.apellido_paterno),
                      ''
                    ),

                    NULLIF(
                      TRIM(pa.apellido_materno),
                      ''
                    ),

                    NULLIF(
                      TRIM(pa.apellido_esposo),
                      ''
                    ),

                    CASE
                      WHEN p.descripcion IS NOT NULL
                      THEN CONCAT(
                        'Nacionalidad: ',
                        TRIM(p.descripcion)
                      )
                    END,

                    CASE
                      WHEN pa.estado IS NOT NULL
                      THEN CONCAT(
                        'Estado: ',
                        TRIM(pa.estado)
                      )
                    END
                  ),
                  E'\\n'
                  ORDER BY
                    pa.id_persona_auxiliar
                )

              FROM public.persona_auxiliar pa

              LEFT JOIN parametricas.pais p
                ON p.id_pais =
                   pa.id_pais

              WHERE
                pa.id_operativo =
                o.id_operativo

                AND COALESCE(
                  pa._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "personas",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT_WS(
                    ' ',

                    NULLIF(
                      TRIM(td.descripcion),
                      ''
                    ),

                    CASE
                      WHEN ed.descripcion IS NOT NULL
                      THEN CONCAT(
                        'Estado: ',
                        TRIM(ed.descripcion)
                      )
                    END,

                    CONCAT(
                      'Cantidad: ',
                      TO_CHAR(
                        COALESCE(
                          dr.cantidad,
                          0
                        ),
                        'FM999,999,999,990.00'
                      ),
                      ' ',
                      COALESCE(
                        NULLIF(
                          TRIM(ed.medida),
                          ''
                        ),
                        'Grs.'
                      )
                    ),

                    CASE
                      WHEN ft.descripcion IS NOT NULL
                      THEN CONCAT(
                        'Forma de Transporte: ',
                        TRIM(ft.descripcion)
                      )
                    END
                  ),
                  E'\\n'
                  ORDER BY
                    dr.id_droga
                )

              FROM public.droga dr

              LEFT JOIN public.estado_droga ed
                ON ed.id_estado_droga =
                   dr.id_estado_droga

              LEFT JOIN parametricas.tipo_droga td
                ON td.id_tipo_droga =
                   ed.id_tipo_droga

              LEFT JOIN parametricas.forma_transporte ft
                ON ft.id_forma_transporte =
                   dr.id_forma_transporte

              WHERE
                dr.id_operativo =
                o.id_operativo

                AND COALESCE(
                  dr._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "droga",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT(
                    COALESCE(
                      TRIM(ssd.descripcion),
                      'Sustancia sólida'
                    ),
                    ': ',
                    TO_CHAR(
                      COALESCE(
                        ss.cantidad,
                        0
                      ),
                      'FM999,999,999,990.00'
                    ),
                    ' Kls.'
                  ),
                  E'\\n'
                  ORDER BY
                    ss.id_sustancia_solida
                )

              FROM public.sustancia_solida ss

              LEFT JOIN
                parametricas.sustancia_solida_descripcion
                ssd
                ON
                  ssd.id_sustancia_solida_descripcion =
                  ss.id_sustancia_solida_descripcion

              WHERE
                ss.id_operativo =
                o.id_operativo

                AND COALESCE(
                  ss._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "sustanciasSolidas",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT(
                    COALESCE(
                      TRIM(sld.descripcion),
                      'Sustancia líquida'
                    ),
                    ': ',
                    TO_CHAR(
                      COALESCE(
                        sl.cantidad,
                        0
                      ),
                      'FM999,999,999,990.00'
                    ),
                    ' Lts.'
                  ),
                  E'\\n'
                  ORDER BY
                    sl.id_sustancia_liquida
                )

              FROM public.sustancia_liquida sl

              LEFT JOIN
                parametricas.sustancia_liquida_descripcion
                sld
                ON
                  sld.id_sustancia_liquida_descripcion =
                  sl.id_sustancia_liquida_descripcion

              WHERE
                sl.id_operativo =
                o.id_operativo

                AND COALESCE(
                  sl._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "sustanciasLiquidas",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT(
                    COALESCE(
                      TRIM(tf.descripcion),
                      TRIM(fm.descripcion),
                      'Fábrica'
                    ),
                    ': ',
                    COALESCE(
                      f.cantidad,
                      0
                    )
                  ),
                  E'\\n'
                  ORDER BY
                    f.id_fabrica
                )

              FROM public.fabrica f

              LEFT JOIN public.fabrica_modelo fm
                ON fm.id_fabrica_modelo =
                   f.id_fabrica_modelo

              LEFT JOIN parametricas.tipo_fabrica tf
                ON tf.id_tipo_fabrica =
                   fm.id_tipo_fabrica

              WHERE
                f.id_operativo =
                o.id_operativo

                AND COALESCE(
                  f._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "laboratoriosFabricas",

          COALESCE(
            (
              SELECT
                STRING_AGG(
                  CONCAT_WS(
                    ' ',

                    NULLIF(
                      TRIM(ct.descripcion),
                      ''
                    ),

                    CASE
                      WHEN ibs.cantidad_bien IS NOT NULL
                      THEN CONCAT(
                        '- Cantidad: ',
                        ibs.cantidad_bien
                      )
                    END
                  ),
                  E'\\n'
                  ORDER BY
                    ibs.id_item_bien_secuestrado
                )

              FROM public.item_bien_secuestrado ibs

              LEFT JOIN public.catalogo_tipo ct
                ON ct.id_catalogo_tipo =
                   ibs.id_catalogo_tipo

              WHERE
                ibs.id_operativo =
                o.id_operativo

                AND COALESCE(
                  ibs._estado,
                  'ACTIVO'
                ) = 'ACTIVO'
            ),
            ''
          ) AS "bienesSecuestrados",

          COALESCE(
            NULLIF(
              TRIM(top.descripcion),
              ''
            ),
            NULLIF(
              TRIM(io.descripcion),
              ''
            ),
            ''
          ) AS "tipoOperativo",

          COALESCE(
            TRIM(tr.descripcion),
            ''
          ) AS "relevancia",

          COALESCE(
            TRIM(tr.color),
            ''
          ) AS "colorRelevancia",

          CASE
            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) = 'GRAN CANTIDAD DE DROGA'
            THEN 'relevancia-droga'

            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) = 'BIENES SECUESTRADOS SUNTUOSOS'
            THEN 'relevancia-bienes'

            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) IN (
              'RELACION FAMILIAR DE UN NARCOTRAFICANTE',
              'RELACIÓN FAMILIAR DE UN NARCOTRAFICANTE'
            )
            THEN 'relevancia-familiar'

            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) = 'FUNCIONARIOS POLICIALES'
            THEN 'relevancia-policia'

            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) IN (
              'POLITICOS O FAMILIARES',
              'POLÍTICOS O FAMILIARES'
            )
            THEN 'relevancia-politicos'

            WHEN UPPER(
              TRIM(
                COALESCE(
                  tr.descripcion,
                  ''
                )
              )
            ) = 'EMBOSCADA'
            THEN 'relevancia-emboscada'

            ELSE ''
          END AS "claseRelevancia",

          TO_CHAR(
            (
              COALESCE(
                (
                  SELECT
                    SUM(dr.costo)

                  FROM public.droga dr

                  WHERE
                    dr.id_operativo =
                    o.id_operativo

                    AND COALESCE(
                      dr._estado,
                      'ACTIVO'
                    ) = 'ACTIVO'
                ),
                0
              )

              +

              COALESCE(
                (
                  SELECT
                    SUM(ss.costo)

                  FROM public.sustancia_solida ss

                  WHERE
                    ss.id_operativo =
                    o.id_operativo

                    AND COALESCE(
                      ss._estado,
                      'ACTIVO'
                    ) = 'ACTIVO'
                ),
                0
              )

              +

              COALESCE(
                (
                  SELECT
                    SUM(sl.costo)

                  FROM public.sustancia_liquida sl

                  WHERE
                    sl.id_operativo =
                    o.id_operativo

                    AND COALESCE(
                      sl._estado,
                      'ACTIVO'
                    ) = 'ACTIVO'
                ),
                0
              )

              +

              COALESCE(
                (
                  SELECT
                    SUM(
                      COALESCE(
                        ibs.costo_cuantificado,
                        ibs.costo_aproximado,
                        0
                      )
                    )

                  FROM public.item_bien_secuestrado ibs

                  WHERE
                    ibs.id_operativo =
                    o.id_operativo

                    AND COALESCE(
                      ibs._estado,
                      'ACTIVO'
                    ) = 'ACTIVO'
                ),
                0
              )
            ),
            'FM999,999,999,990.00'
          ) AS costo

        FROM public.asignacion a

        INNER JOIN public.operativo o
          ON o.id_caso =
             a.id_caso

        LEFT JOIN parametricas.departamento dep
          ON dep.id_departamento =
             o.id_departamento

        LEFT JOIN parametricas.provincia pro
          ON pro.id_provincia =
             o.id_provincia

        LEFT JOIN parametricas.localidad loc
          ON loc.id_localidad =
             o.id_localidad

        LEFT JOIN public.unidad u
          ON u.id_unidad =
             o.id_unidad

        LEFT JOIN public.distrital dis
          ON dis.id_distrital =
             o.id_distrital

        LEFT JOIN public.grupo g
          ON g.id_grupo =
             o.id_grupo

        LEFT JOIN public.item_operativo io
          ON io.id_item_operativo =
             o.id_item_operativo

        LEFT JOIN parametricas.tipo_operacion top
          ON top.id_tipo_operacion =
             o.id_tipo_operacion

        LEFT JOIN parametricas.tipo_relevancia tr
          ON tr.id_tipo_relevancia =
             o.id_tipo_relevancia

        WHERE
          TRIM(a.codigo_servicio) =
          TRIM($1)

          AND COALESCE(
            a._estado,
            'ACTIVO'
          ) = 'ACTIVO'

          AND COALESCE(
            o._estado,
            'ACTIVO'
          ) = 'ACTIVO'

        ORDER BY
          o.fecha_operativo ASC,
          o.id_operativo ASC
      `,
      [idServicio.trim()]
    )
  }

  /*
   * Totales de droga por código
   * de servicio.
   *
   * Conserva los identificadores
   * utilizados por el sistema anterior:
   *
   * 1 = pasta base de cocaína
   * 2 = clorhidrato de cocaína
   * 4 = marihuana
   * 5 = estado de droga líquida
   */
  async obtenerTotalesDrogas(idServicio: string): Promise<any[]> {
    return this.dataSource.query(
      `
        WITH totales AS (
          SELECT
            COALESCE(
              SUM(d.cantidad)
                FILTER (
                  WHERE
                    ed.id_tipo_droga = 2
                ),
              0
            ) AS clorhidrato,

            COALESCE(
              SUM(d.cantidad)
                FILTER (
                  WHERE
                    ed.id_tipo_droga = 1
                ),
              0
            ) AS "pastaBase",

            COALESCE(
              SUM(d.cantidad)
                FILTER (
                  WHERE
                    ed.id_tipo_droga = 4
                ),
              0
            ) AS marihuana,

            COALESCE(
              SUM(d.cantidad)
                FILTER (
                  WHERE
                    d.id_estado_droga = 5
                ),
              0
            ) AS "drogaLiquida"

          FROM public.asignacion a

          INNER JOIN public.operativo o
            ON o.id_caso =
               a.id_caso

          LEFT JOIN public.droga d
            ON d.id_operativo =
               o.id_operativo

            AND COALESCE(
              d._estado,
              'ACTIVO'
            ) = 'ACTIVO'

          LEFT JOIN public.estado_droga ed
            ON ed.id_estado_droga =
               d.id_estado_droga

          WHERE
            TRIM(a.codigo_servicio) =
            TRIM($1)

            AND COALESCE(
              a._estado,
              'ACTIVO'
            ) = 'ACTIVO'

            AND COALESCE(
              o._estado,
              'ACTIVO'
            ) = 'ACTIVO'
        ),

        otras_drogas AS (
          SELECT
            td.id_tipo_droga,

            UPPER(
              TRIM(td.descripcion)
            ) AS descripcion,

            COALESCE(
              SUM(d.cantidad),
              0
            ) AS cantidad

          FROM public.asignacion a

          INNER JOIN public.operativo o
            ON o.id_caso =
               a.id_caso

          INNER JOIN public.droga d
            ON d.id_operativo =
               o.id_operativo

          INNER JOIN public.estado_droga ed
            ON ed.id_estado_droga =
               d.id_estado_droga

          INNER JOIN parametricas.tipo_droga td
            ON td.id_tipo_droga =
               ed.id_tipo_droga

          WHERE
            TRIM(a.codigo_servicio) =
            TRIM($1)

            AND ed.id_tipo_droga
              NOT IN (
                1,
                2,
                3,
                4
              )

            AND COALESCE(
              a._estado,
              'ACTIVO'
            ) = 'ACTIVO'

            AND COALESCE(
              o._estado,
              'ACTIVO'
            ) = 'ACTIVO'

            AND COALESCE(
              d._estado,
              'ACTIVO'
            ) = 'ACTIVO'

          GROUP BY
            td.id_tipo_droga,
            td.descripcion
        )

        SELECT
          resultado.descripcion,
          resultado.cantidad

        FROM (
          SELECT
            1 AS orden,

            'CLORHIDRATO DE COCAÍNA'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t.clorhidrato,
                'FM999,999,999,990.00'
              ),
              ' Gramos'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            2 AS orden,

            'PASTA BASE DE COCAÍNA'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t."pastaBase",
                'FM999,999,999,990.00'
              ),
              ' Gramos'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            3 AS orden,

            'DROGA LÍQUIDA'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t."drogaLiquida",
                'FM999,999,999,990.00'
              ),
              ' Litros - En gramos: ',
              TO_CHAR(
                (
                  t."drogaLiquida"
                  / 26.44
                ) * 1000,
                'FM999,999,999,990.00'
              )
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            4 AS orden,

            'MARIHUANA'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t.marihuana,
                'FM999,999,999,990.00'
              ),
              ' Gramos'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            5 AS orden,

            'ESTUPEFACIENTES Y PSICOTRÓPICOS'
              AS descripcion,

            '' AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            100 + od.id_tipo_droga
              AS orden,

            od.descripcion,

            CONCAT(
              TO_CHAR(
                od.cantidad,
                'FM999,999,999,990.00'
              ),
              ' Gramos'
            ) AS cantidad

          FROM otras_drogas od
        ) resultado

        ORDER BY
          resultado.orden
      `,
      [idServicio.trim()]
    )
  }

  /*
   * Totales de sustancias sólidas
   * y líquidas.
   *
   * 52 = sólida a determinar.
   * 69 = líquida a determinar.
   */
  async obtenerTotalesSustancias(idServicio: string): Promise<any[]> {
    return this.dataSource.query(
      `
        WITH totales AS (
          SELECT
            COALESCE(
              (
                SELECT
                  SUM(ss.cantidad)

                FROM public.asignacion a1

                INNER JOIN public.operativo o1
                  ON o1.id_caso =
                     a1.id_caso

                INNER JOIN public.sustancia_solida ss
                  ON ss.id_operativo =
                     o1.id_operativo

                WHERE
                  TRIM(a1.codigo_servicio) =
                  TRIM($1)

                  AND
                    ss.id_sustancia_solida_descripcion
                    <> 52

                  AND COALESCE(
                    ss._estado,
                    'ACTIVO'
                  ) = 'ACTIVO'
              ),
              0
            ) AS solidas,

            COALESCE(
              (
                SELECT
                  SUM(ss.cantidad)

                FROM public.asignacion a2

                INNER JOIN public.operativo o2
                  ON o2.id_caso =
                     a2.id_caso

                INNER JOIN public.sustancia_solida ss
                  ON ss.id_operativo =
                     o2.id_operativo

                WHERE
                  TRIM(a2.codigo_servicio) =
                  TRIM($1)

                  AND
                    ss.id_sustancia_solida_descripcion
                    = 52

                  AND COALESCE(
                    ss._estado,
                    'ACTIVO'
                  ) = 'ACTIVO'
              ),
              0
            ) AS "solidasSinDeterminar",

            COALESCE(
              (
                SELECT
                  SUM(sl.cantidad)

                FROM public.asignacion a3

                INNER JOIN public.operativo o3
                  ON o3.id_caso =
                     a3.id_caso

                INNER JOIN public.sustancia_liquida sl
                  ON sl.id_operativo =
                     o3.id_operativo

                WHERE
                  TRIM(a3.codigo_servicio) =
                  TRIM($1)

                  AND
                    sl.id_sustancia_liquida_descripcion
                    <> 69

                  AND COALESCE(
                    sl._estado,
                    'ACTIVO'
                  ) = 'ACTIVO'
              ),
              0
            ) AS liquidas,

            COALESCE(
              (
                SELECT
                  SUM(sl.cantidad)

                FROM public.asignacion a4

                INNER JOIN public.operativo o4
                  ON o4.id_caso =
                     a4.id_caso

                INNER JOIN public.sustancia_liquida sl
                  ON sl.id_operativo =
                     o4.id_operativo

                WHERE
                  TRIM(a4.codigo_servicio) =
                  TRIM($1)

                  AND
                    sl.id_sustancia_liquida_descripcion
                    = 69

                  AND COALESCE(
                    sl._estado,
                    'ACTIVO'
                  ) = 'ACTIVO'
              ),
              0
            ) AS "liquidasSinDeterminar"
        )

        SELECT
          resultado.descripcion,
          resultado.cantidad

        FROM (
          SELECT
            1 AS orden,

            'SUSTANCIAS QUÍMICAS SÓLIDAS'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t.solidas,
                'FM999,999,999,990.00'
              ),
              ' Kilos'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            2 AS orden,

            'SUSTANCIAS SÓLIDAS A DETERMINAR'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t."solidasSinDeterminar",
                'FM999,999,999,990.00'
              ),
              ' Kilos'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            3 AS orden,

            'SUSTANCIAS QUÍMICAS LÍQUIDAS'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t.liquidas,
                'FM999,999,999,990.00'
              ),
              ' Litros'
            ) AS cantidad

          FROM totales t

          UNION ALL

          SELECT
            4 AS orden,

            'SUSTANCIAS LÍQUIDAS A DETERMINAR'
              AS descripcion,

            CONCAT(
              TO_CHAR(
                t."liquidasSinDeterminar",
                'FM999,999,999,990.00'
              ),
              ' Litros'
            ) AS cantidad

          FROM totales t
        ) resultado

        ORDER BY
          resultado.orden
      `,
      [idServicio.trim()]
    )
  }

  /*
   * Totales agrupados por tipo
   * de fábrica.
   */
  async obtenerTotalesFabricas(idServicio: string): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          UPPER(
            CONCAT(
              TRIM(tf.descripcion),
              '(s)'
            )
          ) AS descripcion,

          TO_CHAR(
            COALESCE(
              SUM(f.cantidad),
              0
            ),
            'FM999,999,999,990'
          ) AS cantidad

        FROM public.asignacion a

        INNER JOIN public.operativo o
          ON o.id_caso =
             a.id_caso

        INNER JOIN public.fabrica f
          ON f.id_operativo =
             o.id_operativo

        INNER JOIN public.fabrica_modelo fm
          ON fm.id_fabrica_modelo =
             f.id_fabrica_modelo

        INNER JOIN parametricas.tipo_fabrica tf
          ON tf.id_tipo_fabrica =
             fm.id_tipo_fabrica

        WHERE
          TRIM(a.codigo_servicio) =
          TRIM($1)

          AND COALESCE(
            a._estado,
            'ACTIVO'
          ) = 'ACTIVO'

          AND COALESCE(
            o._estado,
            'ACTIVO'
          ) = 'ACTIVO'

          AND COALESCE(
            f._estado,
            'ACTIVO'
          ) = 'ACTIVO'

        GROUP BY
          tf.id_tipo_fabrica,
          tf.descripcion

        ORDER BY
          tf.descripcion ASC
      `,
      [idServicio.trim()]
    )
  }

  /*
   * Cantidad de personas aprehendidas
   * y arrestadas en el servicio.
   */
  async obtenerResumenPersonas(idServicio: string): Promise<any> {
    const resultado = await this.dataSource.query(
      `
          SELECT
            COUNT(
              pa.id_persona_auxiliar
            ) FILTER (
              WHERE
                UPPER(
                  TRIM(pa.estado)
                ) IN (
                  'PRINCIPAL APREHENDIDO',
                  'APREHENDIDO'
                )
            ) AS aprehendidos,

            COUNT(
              pa.id_persona_auxiliar
            ) FILTER (
              WHERE
                UPPER(
                  TRIM(pa.estado)
                ) = 'ARRESTADO'
            ) AS arrestados

          FROM public.asignacion a

          INNER JOIN public.operativo o
            ON o.id_caso =
               a.id_caso

          LEFT JOIN public.persona_auxiliar pa
            ON pa.id_operativo =
               o.id_operativo

            AND COALESCE(
              pa._estado,
              'ACTIVO'
            ) = 'ACTIVO'

          WHERE
            TRIM(a.codigo_servicio) =
            TRIM($1)

            AND COALESCE(
              a._estado,
              'ACTIVO'
            ) = 'ACTIVO'

            AND COALESCE(
              o._estado,
              'ACTIVO'
            ) = 'ACTIVO'
        `,
      [idServicio.trim()]
    )

    return (
      resultado[0] ?? {
        aprehendidos: 0,
        arrestados: 0,
      }
    )
  }

  /*
   * Coordenadas y enlaces de los
   * operativos del servicio.
   */
  async obtenerOperativosMapa(idServicio: string): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          o.id_operativo
            AS "idOperativo",

          a.numero_caso
            AS "numeroCaso",

          a.numero_operativo
            AS "numeroOperativo",

          o.coord_x
            AS latitud,

          o.coord_y
            AS longitud,

          CASE
            WHEN
              o.coord_x IS NOT NULL
              AND o.coord_y IS NOT NULL
            THEN CONCAT(
              'https://www.google.com/maps?q=',
              o.coord_x,
              ',',
              o.coord_y,
              '&hl=es'
            )
            ELSE ''
          END AS "enlaceMapa"

        FROM public.asignacion a

        INNER JOIN public.operativo o
          ON o.id_caso =
             a.id_caso

        WHERE
          TRIM(a.codigo_servicio) =
          TRIM($1)

          AND COALESCE(
            a._estado,
            'ACTIVO'
          ) = 'ACTIVO'

          AND COALESCE(
            o._estado,
            'ACTIVO'
          ) = 'ACTIVO'

        ORDER BY
          o.fecha_operativo ASC,
          o.id_operativo ASC
      `,
      [idServicio.trim()]
    )
  }
}
