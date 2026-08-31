import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBienDto } from './dto/create-biene.dto';
import { UpdateBieneDto } from './dto/update-biene.dto';
import { BienesLgiRepository } from './repository/bienes.repository';

@Injectable()
export class BienesService {
  constructor(
    private readonly bienesRepository: BienesLgiRepository,
  ) {}

  async create(dto: CreateBienDto) {
    const unidad = this.bienesRepository.create(dto)

    await this.bienesRepository.save(unidad)

    return {
      message: 'Bien registrada correctamente',
    }
  }

  async findAll() {
    return await this.bienesRepository.findAllOrdered()
  }

  async findOne(id: number) {
    const unidad =
      await this.bienesRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException(
        'Bien no encontrada',
      )
    }

    return unidad
  }

  async update(
    id: number,
    dto: UpdateBieneDto,
  ) {
    const unidad =
      await this.bienesRepository.findActiveById(id)

    if (!unidad) {
      throw new NotFoundException(
        'Bien no encontrada',
      )
    }

    Object.assign(unidad, dto)

    await this.bienesRepository.save(unidad)

    return {
      message: 'Bien actualizado correctamente',
    }
  }
}
