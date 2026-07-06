import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { TamanoDocLgiRepository } from './repository/tamano-doc.repository'
import { CreateTamanoDocDto } from './dto/create-tamano-doc.dto'
import { UpdateTamanoDocDto } from './dto/update-tamano-doc.dto'

@Injectable()
export class TamanoDocLgiService {
  constructor(
    private readonly unidadRepository: TamanoDocLgiRepository,
  ) {}

  async create(dto: CreateTamanoDocDto) {
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
    dto: UpdateTamanoDocDto,
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