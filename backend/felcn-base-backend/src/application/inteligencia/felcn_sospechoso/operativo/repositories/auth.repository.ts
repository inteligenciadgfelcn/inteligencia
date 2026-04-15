import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_AUTH } from '@/core/config/database/database.module'

@Injectable()
export class AuthRepository {
  getDepartamentoByAbreviatura(abrev: any) {
    throw new Error('Method not implemented.')
  }
  constructor(
    @InjectDataSource(DB_AUTH)
    private readonly dataSource: DataSource
  ) {}

  async getEstructura(id_unidad: number, id_distrital: number, id_grupo: number) {
    const result = await this.dataSource.query(
      `
      SELECT 
        u.id as id_unidad, u.descripcion as unidad,
        d.id as id_distrital, d.descripcion as distrital,
        g.id as id_grupo, g.descripcion as grupo
      FROM parametro.unidad u
      LEFT JOIN parametro.distrital d ON d.id = $2
      LEFT JOIN parametro.grupo g ON g.id = $3
      WHERE u.id = $1
      `,
      [id_unidad, id_distrital, id_grupo]
    )

    return result[0] || {}
  }
}