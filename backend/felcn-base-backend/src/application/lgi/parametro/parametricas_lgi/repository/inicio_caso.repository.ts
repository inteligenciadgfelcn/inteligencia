import { DB_LGI } from '@/core/config/database/database.module'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

export class InicioCasoRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  private readonly baseQuery = `
    SELECT i.*
    FROM parametricas.inicio_caso i
  `

  private buildQuery(extraWhere = ''): string {
    return `
      ${this.baseQuery}`
  }

  async findAllGeneral(): Promise<any[]> {
    return await this.dataSource.query(this.buildQuery())
  }
}
