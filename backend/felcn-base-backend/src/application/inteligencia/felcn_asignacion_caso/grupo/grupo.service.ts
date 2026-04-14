import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DB_AUTH } from '@/core/config/database/database.module'
import { DataSource } from 'typeorm'

@Injectable()
export class GrupoService {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  private baseQuery = `
    SELECT 
      g.id,
      g.descripcion,
      g._estado as "estado",
      d.id as "idDistrital",
      d.descripcion as "distrital",
      u.id as "idUnidad",
      u.descripcion as "unidad"
    FROM parametro.grupo g
    LEFT JOIN parametro.distrital d 
      ON g.id_distrital = d.id
    LEFT JOIN parametro.unidad u 
      ON d.id_unidad = u.id
    WHERE g._estado = 'ACTIVO'
  `
  private buildQuery(extraWhere: string = '') {
    return this.baseQuery + ' ' + extraWhere + ' ORDER BY g.descripcion ASC'
  }

  async findAllGeneral() {
    return this.dataSource.query(this.buildQuery())
  }

  async findAllDistrito(idDistrital?: number) {
    return this.dataSource.query(
      this.buildQuery(idDistrital ? `AND g.id_distrital = $1` : ''),
      idDistrital ? [idDistrital] : []
    )
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      this.buildQuery(`AND g.id = $1`),
      [id]
    )

    if (!result.length) {
      throw new NotFoundException('Grupo no encontrado')
    }

    return result[0]
  }
}
