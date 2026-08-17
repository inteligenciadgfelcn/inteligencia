import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_LGI } from '@/core/config/database/database.module'

@Injectable()
export class ProfesionLgiRepository {
  constructor(
    @InjectDataSource(DB_LGI)
    private readonly dataSource: DataSource
  ) {}
  
    private readonly baseQuery = `
      SELECT d.*
      FROM public.profesion d
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
  
    async findAllGeneral( ){
      return await this.dataSource.query(
        this.buildQuery()
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