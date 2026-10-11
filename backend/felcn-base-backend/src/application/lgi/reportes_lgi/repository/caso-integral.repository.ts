import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'

@Injectable()
export class CasoIntegralRepository {
  constructor(@InjectDataSource(DB_LGI) private readonly dataSource: DataSource) {}

  async existeCaso(casosId: number): Promise<boolean> {
    const filas = await this.dataSource.query('SELECT 1 FROM public.asignacion WHERE casos_id = $1', [casosId])
    return filas.length > 0
  }

  actuaciones(casosId: number): Promise<any[]> {
    return this.dataSource.query(`SELECT op_id AS "opId", op_fechainf AS fecha
      FROM public.operativo WHERE casos_id = $1 AND UPPER(TRIM(estado)) = 'ACTIVO'
      ORDER BY op_fechainf ASC NULLS LAST, op_id ASC`, [casosId])
  }

  resumen(casosId: number): Promise<any[]> {
    return this.dataSource.query(`SELECT b.cattipo_id AS "tipoId",
      COALESCE(t.descripcion, 'Sin categoría') AS categoria,
      SUM(COALESCE(b.cantidadbien, 1))::text AS cantidad,
      SUM(b.costoaprox)::text AS total,
      COUNT(*) FILTER (WHERE b.costoaprox IS NULL)::int AS faltantes
      FROM itembiensecuestrado b
      INNER JOIN public.operativo o ON o.op_id = b.op_id
      LEFT JOIN parametricas.catalogotipo t ON t.cattipo_id = b.cattipo_id
      WHERE o.casos_id = $1 AND UPPER(TRIM(o.estado)) = 'ACTIVO'
        AND UPPER(TRIM(b.estado)) = 'ACTIVO'
      GROUP BY b.cattipo_id, t.descripcion ORDER BY categoria, b.cattipo_id`, [casosId])
  }
}
