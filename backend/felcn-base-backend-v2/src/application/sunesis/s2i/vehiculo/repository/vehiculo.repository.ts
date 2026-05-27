import { Injectable } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { DB_S2I } from '../../../shared/constants'
import { S2iVehiculo } from '../entity/vehiculo.entity'

@Injectable()
export class VehiculoRepository {
  constructor(
    @InjectDataSource(DB_S2I)
    private dataSource: DataSource
  ) {}

  async crearVehiculo(vehiculo: S2iVehiculo): Promise<S2iVehiculo> {
    return this.dataSource.getRepository(S2iVehiculo).save(vehiculo)
  }

  async buscarVehiculoPorId(idVehiculo: string): Promise<S2iVehiculo | null> {
    return this.dataSource
      .getRepository(S2iVehiculo)
      .findOne({ where: { idVehiculo } })
  }

  async listarVehiculosPorCaso(idCaso: string): Promise<S2iVehiculo[]> {
    return this.dataSource
      .getRepository(S2iVehiculo)
      .find({ where: { idCaso } })
  }

  async eliminarVehiculo(idVehiculo: string): Promise<void> {
    await this.dataSource.getRepository(S2iVehiculo).delete(idVehiculo)
  }
}
