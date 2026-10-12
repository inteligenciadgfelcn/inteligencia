import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { BienSecuestradoLgiRepository } from '../../bienes_secuestrados/repository/bien_secuestrado_lgi.repository'

@Injectable()
export class ConclusionReporteRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource,

    private readonly bienesRepository: BienSecuestradoLgiRepository
  ) {}

  obtenerActuacionesPorCaso(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          o.op_id AS "opId",
          o.casos_id::text AS "casoId"
        FROM public.operativo o
        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'
        ORDER BY o.op_id ASC
      `,
      [casosId]
    )
  }

  obtenerResumenBienes(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          b.cattipo_id AS "tipoId",
          COALESCE(t.descripcion, 'Sin categoría') AS categoria,
          COUNT(*)::int AS registros,
          SUM(COALESCE(b.cantidadbien, 1))::text AS cantidad,
          COUNT(b.costoaprox)::int AS "conValor",
          SUM(b.costoaprox)::text AS total
        FROM public.itembiensecuestrado b

        INNER JOIN public.operativo o
          ON o.op_id = b.op_id

        LEFT JOIN parametricas.catalogotipo t
          ON t.cattipo_id = b.cattipo_id

        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'
          AND UPPER(TRIM(b.estado)) = 'ACTIVO'

        GROUP BY b.cattipo_id, t.descripcion
        ORDER BY categoria, b.cattipo_id
      `,
      [casosId]
    )
  }

  async obtenerBienesConFotos(casosId: number): Promise<any[]> {
    const actuaciones = await this.obtenerActuacionesPorCaso(casosId)

    const resultados: any[] = []
    const procesados = new Set<number>()

    for (const actuacion of actuaciones) {
      const registros = await this.bienesRepository.findAllByOperativo(
        Number(actuacion.opId)
      )

      for (const bien of registros) {
        const itemBienSecId = Number(bien.itembiensecId)

        if (procesados.has(itemBienSecId)) continue

        procesados.add(itemBienSecId)

        const detalle = await this.bienesRepository.findOne(itemBienSecId)

        if (detalle) {
          resultados.push({
            ...detalle,
            opId: Number(actuacion.opId),
          })
        }
      }
    }

    return resultados
  }

  obtenerEmpresas(casosId: number): Promise<any[]> {
    return this.dataSource.query(
      `
        SELECT
          e.emp_id AS "empId",
          e.op_id AS "opId",
          e.nombre,
          e.nit,
          e.matricula,
          e.representante,
          e.capital_social AS "capitalSocial",
          e.direccion,
          e.obs AS observaciones,
          e.imagen,
          v.descripcion AS vinculo

        FROM public.empresas e

        INNER JOIN public.operativo o
          ON o.op_id = e.op_id

        LEFT JOIN parametricas.vinculo v
          ON v.id_vinculo = e.id_vinculo

        WHERE o.casos_id = $1
          AND UPPER(TRIM(o.estado)) = 'ACTIVO'

        ORDER BY e.op_id ASC, e.emp_id ASC
      `,
      [casosId]
    )
  }

  async obtenerSelecciones(casosId: number) {
    const grupos = [
      ['ciclos', 'caso_ciclo', 'id_ciclo', 'ciclo'],
      [
        'verbosRectores',
        'caso_verbo_rector',
        'id_verbo_rector',
        'verbo_rector',
      ],
      ['tipologias', 'caso_tipologia', 'id_tipologia', 'tipologia'],
    ] as const

    const resultado: Record<string, any[]> = {}

    for (const [nombre, tabla, id, catalogo] of grupos) {
      resultado[nombre] = await this.dataSource.query(
        `
          SELECT DISTINCT
            c.${id},
            c.descripcion
          FROM public.${tabla} r

          INNER JOIN parametricas.${catalogo} c
            ON c.${id} = r.${id}

          WHERE r.casos_id = $1
            AND UPPER(TRIM(r.estado)) = 'ACTIVO'

          ORDER BY c.${id}
        `,
        [casosId]
      )
    }

    return resultado
  }
}
