import { Injectable, NotFoundException } from '@nestjs/common'
import { VehiculoRepository } from '../repository/vehiculo.repository'
import { S2iVehiculo } from '../entity/vehiculo.entity'
import { CreateVehiculoDto } from '../dto'

@Injectable()
export class VehiculoService {
  constructor(private readonly repo: VehiculoRepository) {}

  async crearVehiculo(
    idCaso: string,
    dto: CreateVehiculoDto,
    usuario: string
  ): Promise<S2iVehiculo> {
    const vehiculo = new S2iVehiculo({
      idCaso,
      propietario: dto.propietario.trim().toUpperCase(),
      placa: dto.placa.trim().toUpperCase(),
      color: dto.color.trim().toUpperCase(),
      marca: dto.marca.trim().toUpperCase(),
      usuario: usuario.trim(),
    })
    return this.repo.crearVehiculo(vehiculo)
  }

  async listarVehiculosPorCaso(idCaso: string): Promise<S2iVehiculo[]> {
    return this.repo.listarVehiculosPorCaso(idCaso)
  }

  async buscarVehiculoPorId(idVehiculo: string): Promise<S2iVehiculo> {
    const vehiculo = await this.repo.buscarVehiculoPorId(idVehiculo)
    if (!vehiculo)
      throw new NotFoundException(`Vehículo ${idVehiculo} no encontrado`)
    return vehiculo
  }

  async eliminarVehiculo(idVehiculo: string): Promise<void> {
    const existe = await this.repo.buscarVehiculoPorId(idVehiculo)
    if (!existe)
      throw new NotFoundException(`Vehículo ${idVehiculo} no encontrado`)
    await this.repo.eliminarVehiculo(idVehiculo)
  }
}
