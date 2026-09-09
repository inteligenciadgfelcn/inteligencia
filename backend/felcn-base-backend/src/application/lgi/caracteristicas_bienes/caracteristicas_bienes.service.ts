import { Injectable } from '@nestjs/common'
import { CreateCaracteristicasBieneDto } from './dto/create-caracteristicas_biene.dto'
import { UpdateCaracteristicasBieneDto } from './dto/update-caracteristicas_biene.dto'
import { CaracteristicasBiene } from './entities/caracteristicas_biene.entity'
import { CaracteristicasBienesRepository } from './repository/caracteristicas_bienes.repository'

@Injectable()
export class CaracteristicasBienesService {
  constructor(private readonly repository: CaracteristicasBienesRepository) {}

  create(
    createDto: CreateCaracteristicasBieneDto
  ): Promise<CaracteristicasBiene> {
    return this.repository.create(createDto)
  }

  findAll(): Promise<CaracteristicasBiene[]> {
    return this.repository.findAll()
  }

  findByBien(itembiensecId: number): Promise<CaracteristicasBiene[]> {
    return this.repository.findByBien(itembiensecId)
  }

  findOne(id: number): Promise<CaracteristicasBiene> {
    return this.repository.findOne(id)
  }

  update(
    id: number,
    updateDto: UpdateCaracteristicasBieneDto
  ): Promise<CaracteristicasBiene> {
    return this.repository.update(id, updateDto)
  }

  async remove(
  id: number,
): Promise<{
  mensaje: string
}> {
  await this.repository
    .remove(id)

  return {
    mensaje:
      'La característica fue inactivada correctamente',
  }
}
}
