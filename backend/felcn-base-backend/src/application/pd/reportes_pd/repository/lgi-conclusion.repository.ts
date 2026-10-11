import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'
import { BienSecuestradoLgiRepository } from '@/application/lgi/bienes_secuestrados/repository/bien_secuestrado_lgi.repository'

@Injectable()
export class ConclusionReporteRepository {
    constructor(
        @InjectDataSource(DB_LGI) private readonly dataSource: DataSource,
        private readonly bienesRepository: BienSecuestradoLgiRepository,
    ) { }

    async obtenerActuacion(opId: number) {
        const filas = await this.dataSource.query(`SELECT casos_id::text AS "casoId"
      FROM public.operativo WHERE op_id = $1 AND UPPER(TRIM(estado)) = 'ACTIVO'`, [opId])
        return filas[0] ?? null
    }

    obtenerResumenBienes(opId: number): Promise<any[]> {
        return this.dataSource.query(`
      SELECT b.cattipo_id AS "tipoId", COALESCE(t.descripcion, 'Sin categoría') AS categoria,
        COUNT(*)::int AS registros,
        SUM(COALESCE(b.cantidadbien, 1))::text AS cantidad,
        COUNT(b.costoaprox)::int AS "conValor",
        SUM(b.costoaprox)::text AS total
      FROM itembiensecuestrado b
      LEFT JOIN parametricas.catalogotipo t ON t.cattipo_id = b.cattipo_id
      WHERE b.op_id = $1 AND UPPER(TRIM(b.estado)) = 'ACTIVO'
      GROUP BY b.cattipo_id, t.descripcion
      ORDER BY categoria, b.cattipo_id`, [opId])
    }

    async obtenerBienesConFotos(opId: number): Promise<any[]> {
        const registros =
            await this.bienesRepository.findAllByOperativo(opId)

        const resultados: any[] = []

        for (const bien of registros) {
            const detalle = await this.bienesRepository.findOne(
                Number(bien.itembiensecId),
            )

            if (detalle) {
                resultados.push(detalle)
            }
        }

        return resultados
    }
    obtenerEmpresas(opId: number): Promise<any[]> {
        return this.dataSource.query(`SELECT e.emp_id AS "empId", e.nombre, e.nit,
      e.matricula, e.representante, e.capital_social AS "capitalSocial", e.direccion,
      e.obs AS observaciones, e.imagen, v.descripcion AS vinculo
      FROM empresas e LEFT JOIN parametricas.vinculo v ON v.id_vinculo = e.id_vinculo
      WHERE e.op_id = $1 ORDER BY e.emp_id ASC`, [opId])
    }

    async obtenerSelecciones(casoId: string) {
        const grupos = [
            ['ciclos', 'caso_ciclo', 'id_ciclo', 'ciclo'],
            ['verbosRectores', 'caso_verbo_rector', 'id_verbo_rector', 'verbo_rector'],
            ['tipologias', 'caso_tipologia', 'id_tipologia', 'tipologia'],
        ] as const
        const resultado: Record<string, any[]> = {}
        for (const [nombre, tabla, id, catalogo] of grupos) {
            resultado[nombre] = await this.dataSource.query(`
        SELECT DISTINCT c.${id}, c.descripcion
        FROM public.${tabla} r
        INNER JOIN parametricas.${catalogo} c ON c.${id} = r.${id}
        WHERE r.casos_id = $1 AND UPPER(TRIM(r.estado)) = 'ACTIVO'
        ORDER BY c.${id}`, [casoId])
        }
        return resultado
    }
}
