import { Injectable, NotFoundException } from '@nestjs/common'
import { VinculoLgiRepository } from './repository/vinculo.repository'
import { CreateVinculoDto } from './dto/create-vinculo.dto'
import { UpdateVinculoDto } from './dto/update-vinculo.dto'

@Injectable()
export class VinculoService {
  constructor(private readonly vinculoRepository: VinculoLgiRepository) {}

  async create(dto: CreateVinculoDto) {
    const unidad = this.vinculoRepository.create(dto)

    await this.vinculoRepository.save(unidad)

    return {
      message: 'Vinculo registrada correctamente',
    }
  }

  async findAll() {
    return await this.vinculoRepository.findAllOrdered()
  }

  async findOne(id: number) {
    const unidad = await this.vinculoRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException('Vinculo no encontrada')
    }

    return unidad
  }

  async update(id: number, dto: UpdateVinculoDto) {
    const unidad = await this.vinculoRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException('Vinculo no encontrada')
    }

    Object.assign(unidad, dto)

    await this.vinculoRepository.save(unidad)

    return {
      message: 'Vinculo actualizado correctamente',
    }
  }
}
