import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iConductor } from '../entity/conductor.entity'

@Injectable()
export class ConductorRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  async buscarPorDocumento(
    numeroDocumento: string
  ): Promise<S2iConductor | null> {
    return this.dataSource
      .getRepository(S2iConductor)
      .findOne({ where: { numeroDocumento } })
  }

  async crear(conductor: S2iConductor): Promise<S2iConductor> {
    return this.dataSource.getRepository(S2iConductor).save(conductor)
  }
}
