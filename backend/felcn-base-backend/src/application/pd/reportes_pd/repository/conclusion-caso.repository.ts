import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_LGI } from '@/core/config/database/database.module'
import { BienSecuestradoLgiRepository } from '@/application/lgi/bienes_secuestrados/repository/bien_secuestrado_lgi.repository'

@Injectable()
export class ConclusionReporteRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,

    private readonly bienesRepository: BienSecuestradoLgiRepository,
  ) {}

  async obtenerCaso(casosId: number): Promise<any> {
    const filas = await this.dataSource.query(
      `
        SELECT a.*
        FROM public.asignacion a
        WHERE a.casos_id = $1
          AND UPPER(TRIM(a.estado)) = 'ACTIVO'
      `,
      [casosId],
    )

    return filas[0] ?? null
  }

  obtenerActuaciones(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          o.op_id AS "opId",
          o.op_nrooper AS "numeroInforme",
          o.op_fechainf AS "fechaInforme",
          o.op_lugar AS "lugar",
          o.op_descripcion AS "sintesis"

        FROM public.operativo o

        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'

        ORDER BY
          o.op_fechainf DESC NULLS LAST,
          o.fechahoraing DESC NULLS LAST,
          o.op_id DESC
      `,
      [casosId],
    )
  }

  obtenerResumenBienes(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          b.cattipo_id AS "tipoId",
          COALESCE(t.descripcion, 'Sin categoría') AS "categoria",

          COUNT(*)::int AS "registros",

          SUM(
            COALESCE(b.cantidadbien, 1)
          )::text AS "cantidad",

          COUNT(b.costoaprox)::int AS "conValor",
          SUM(b.costoaprox)::text AS "total",

          COUNT(b.costocuant)::int AS "conValorCuantificado",
          SUM(b.costocuant)::text AS "totalCuantificado"

        FROM public.itembiensecuestrado b

        INNER JOIN public.operativo o
          ON o.op_id = b.op_id

        LEFT JOIN parametricas.catalogotipo t
          ON t.cattipo_id = b.cattipo_id

        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'
          AND UPPER(TRIM(b.estado)) = 'ACTIVO'

        GROUP BY b.cattipo_id, t.descripcion

        ORDER BY "categoria", b.cattipo_id
      `,
      [casosId],
    )
  }

  async obtenerBienesConFotos(
    casosId: number,
  ): Promise<any[]> {
    const filas: Array<{ idBien: string }> =
      await this.dataSource.query(
        `
          SELECT b.itembiensec_id::text AS "idBien"

          FROM public.itembiensecuestrado b

          INNER JOIN public.operativo o
            ON o.op_id = b.op_id

          WHERE o.casos_id = $1
            AND UPPER(TRIM(o.estado)) = 'ACTIVO'
            AND UPPER(TRIM(b.estado)) = 'ACTIVO'

          ORDER BY b.itembiensec_id ASC
        `,
        [casosId],
      )

    const bienes: any[] = []

    for (const fila of filas) {
      const idBien = Number(fila.idBien)

      if (!Number.isSafeInteger(idBien)) {
        throw new Error(
          'El identificador del bien supera el rango numérico admitido por el repositorio',
        )
      }

      const detalle =
        await this.bienesRepository.findOne(idBien)

      if (detalle) {
        bienes.push(detalle)
      }
    }

    return bienes
  }

  obtenerEmpresas(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          e.emp_id AS "empId",
          e.nombre,
          e.nit,
          e.matricula,
          e.representante,
          e.capital_social AS "capitalSocial",
          e.direccion,
          e.obs AS "observaciones",
          e.imagen,
          v.descripcion AS "vinculo"

        FROM public.empresas e

        INNER JOIN public.operativo o
          ON o.op_id = e.op_id

        LEFT JOIN parametricas.vinculo v
          ON v.id_vinculo = e.id_vinculo

        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'

        ORDER BY e.emp_id ASC
      `,
      [casosId],
    )
  }

  async obtenerSelecciones(casosId: number) {
    const [bienesSujetosPd, sentencias] = await Promise.all([
      this.dataSource.query(
        `
          SELECT
            c.id_bien_sujeto_pd AS "id",
            c.descripcion

          FROM public.caso_bien_sujeto_pd r

          INNER JOIN parametricas.bien_sujeto_pd c
            ON c.id_bien_sujeto_pd = r.id_bien_sujeto_pd

          WHERE r.casos_id = $1

          ORDER BY c.id_bien_sujeto_pd ASC
        `,
        [casosId],
      ),

      this.dataSource.query(
        `
          SELECT
            c.id_sentencia AS "id",
            c.descripcion

          FROM public.caso_sentencia r

          INNER JOIN parametricas.sentencia c
            ON c.id_sentencia = r.id_sentencia

          WHERE r.casos_id = $1

          ORDER BY c.id_sentencia ASC
        `,
        [casosId],
      ),
    ])

    return {
      bienesSujetosPd,
      sentencias,
    }
  }
}