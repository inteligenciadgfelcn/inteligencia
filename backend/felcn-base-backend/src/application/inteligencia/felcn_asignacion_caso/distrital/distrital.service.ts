import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_AUTH } from '@/core/config/database/database.module'

@Injectable()
export class DistritalService {
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  private baseQuery = `
    SELECT 
      d.id,
      d.descripcion,
      d._estado as "estado",
      u.id as "idUnidad",
      u.descripcion as "unidad"
    FROM parametro.distrital d
    INNER JOIN parametro.unidad u ON d.id_unidad = u.id
    WHERE d._estado = 'ACTIVO'
  `

  private buildQuery(extraWhere: string = '') {
    return this.baseQuery + ' ' + extraWhere + ' ORDER BY d.descripcion ASC'
  }

  async findAllGeneral() {
    return this.dataSource.query(this.buildQuery())
  }

  async findAllUnidad(idUnidad?: number) {
    return this.dataSource.query(
      this.buildQuery(idUnidad ? `AND d.id_unidad = $1` : ''),
      idUnidad ? [idUnidad] : []
    )
  }

  async findOne(id: number) {
    const result = await this.dataSource.query(
      this.buildQuery(`AND d.id = $1`),
      [id]
    )

    if (!result.length) {
      throw new NotFoundException('Distrital no encontrado')
    }

    return result[0]
  }
}