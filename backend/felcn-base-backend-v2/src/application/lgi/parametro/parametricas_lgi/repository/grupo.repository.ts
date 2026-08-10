import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { DB_AUTH } from '@/core/config/database/database.module'

@Injectable()
export class GrupoLgiRepository {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  private readonly baseQuery = `
    SELECT
      g.id,
      g.descripcion,
      g._estado AS "estado",
      g.id_distrital AS "idDistrito",
      d.descripcion AS "distrital"
    FROM parametro.grupo g
    INNER JOIN parametro.distrital d
      ON g.id_distrital = d.id
    WHERE g._estado = 'ACTIVO'
      AND d._estado = 'ACTIVO'
  `

  private buildQuery(
    extraWhere = ''
  ): string {
    return `
      ${this.baseQuery}
      ${extraWhere}
      ORDER BY g.descripcion ASC
    `
  }

  /**
   * Lista todos los grupos activos.
   */
  async findAll(): Promise<any[]> {
    return await this.dataSource.query(
      this.buildQuery()
    )
  }

  /**
   * Lista los grupos de una distrital.
   */
  async findAllDistrito(
    idDistrito: number
  ): Promise<any[]> {
    return await this.dataSource.query(
      this.buildQuery(
        'AND g.id_distrital = $1'
      ),
      [idDistrito]
    )
  }

  /**
   * Busca un grupo por su ID.
   */
  async findOne(
    idGrupo: number
  ): Promise<any | null> {
    const result =
      await this.dataSource.query(
        this.buildQuery(
          'AND g.id = $1'
        ),
        [idGrupo]
      )

    return result[0] ?? null
  }
}