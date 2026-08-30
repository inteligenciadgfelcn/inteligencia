import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iTransporte } from '../entity/transporte.entity'

@Injectable()
export class TransporteRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  async buscarPorCodigo(
    codigoTransporte: string
  ): Promise<S2iTransporte | null> {
    return this.dataSource
      .getRepository(S2iTransporte)
      .findOne({ where: { codigoTransporte } })
  }

  async crear(transporte: S2iTransporte): Promise<S2iTransporte> {
    return this.dataSource.getRepository(S2iTransporte).save(transporte)
  }
}
