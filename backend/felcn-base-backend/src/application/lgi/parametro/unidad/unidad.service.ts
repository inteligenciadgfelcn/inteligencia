import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { UnidadLgiRepository } from './repository/unidad.repository'
import { CreateUnidadDto } from './dto/create-unidad.dto'
import { UpdateUnidadDto } from './dto/update-unidad.dto'

@Injectable()
export class UnidadLgiService {
  constructor(
    private readonly unidadRepository: UnidadLgiRepository,
  ) {}

  async create(dto: CreateUnidadDto) {
    const unidad = this.unidadRepository.create(dto)

    await this.unidadRepository.save(unidad)

    return {
      message: 'Unidad registrada correctamente',
    }
  }

  async findAll() {
    return await this.unidadRepository.findAllOrdered()
  }

  async findOne(id: number) {
    const unidad =
      await this.unidadRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException(
        'Unidad no encontrada',
      )
    }

    return unidad
  }

  async update(
    id: number,
    dto: UpdateUnidadDto,
  ) {
    const unidad =
      await this.unidadRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException(
        'Unidad no encontrada',
      )
    }

    Object.assign(unidad, dto)

    await this.unidadRepository.save(unidad)

    return {
      message: 'Unidad actualizada correctamente',
    }
  }

}