import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_AUTH } from '@/core/config/database/database.module'

@Injectable()
export class DistritalLgiRepository {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  private readonly baseQuery = `
    SELECT
      d.id,
      d.descripcion,
      d._estado AS "estado",
      u.id AS "idUnidad",
      u.descripcion AS "unidad"
    FROM parametro.distrital d
    INNER JOIN parametro.unidad u
      ON d.id_unidad = u.id
    WHERE d._estado = 'ACTIVO'
      AND u._estado = 'ACTIVO'
      AND u.es_operativa_admin = true
  `

  private buildQuery(
    extraWhere = ''
  ): string {
    return `
      ${this.baseQuery}
      ${extraWhere}
      ORDER BY d.descripcion ASC
    `
  }

  async findAllGeneral(
    idUsuario: number
  ): Promise<any[]> {
    return await this.dataSource.query(
      this.buildQuery(`
        AND d.id_unidad = (
          SELECT d_usuario.id_unidad
          FROM usuario.usuario us
          INNER JOIN parametro.grupo g
            ON us.id_grupo = g.id
          INNER JOIN parametro.distrital d_usuario
            ON g.id_distrital = d_usuario.id
          WHERE us.id = $1
          LIMIT 1
        )
      `),
      [idUsuario]
    )
  }

  async findAllUnidad(
    idUnidad: number
  ): Promise<any[]> {
    return await this.dataSource.query(
      this.buildQuery(
        'AND d.id_unidad = $1'
      ),
      [idUnidad]
    )
  }

  async findOne(
    id: number
  ): Promise<any | null> {
    const result =
      await this.dataSource.query(
        this.buildQuery(
          'AND d.id = $1'
        ),
        [id]
      )

    return result[0] ?? null
  }
}