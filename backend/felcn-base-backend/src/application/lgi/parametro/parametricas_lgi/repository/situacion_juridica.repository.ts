import { DB_LGI } from '@/core/config/database/database.module'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

export class SituacionJuridicaRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}

  private readonly baseQuery = `
    SELECT s.*
    FROM tipopersona s
  `

  private buildQuery(extraWhere = ''): string {
    return `
      ${this.baseQuery}`
  }

  async findAllGeneral(): Promise<any[]> {
    return await this.dataSource.query(this.buildQuery())
  }
}
