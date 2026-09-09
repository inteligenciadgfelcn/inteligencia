import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_VLS } from '../../shared/constants'
import { VlsVehiculo } from '../entity/vehiculo.entity'

@Injectable()
export class VlsVehiculoRepository {
  constructor(
    @InjectDataSource(DB_VLS)
    private dataSource: DataSource
  ) {}

  async buscarPorPlaca(placa: string): Promise<VlsVehiculo | null> {
    return this.dataSource.getRepository(VlsVehiculo).findOne({
      where: { placa },
      relations: ['marca', 'modelo', 'clase', 'color'],
    })
  }
}
