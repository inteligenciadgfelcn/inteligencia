import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateCatalogoDto } from '../catalogo-clase/dto/update-catalogo-clase.dto'
import { CreateTipoVinculoDto } from './dto/create-tipo-vinculo.dto'
import { TipoVinculoLgiRepository } from './repository/tipo-vinculo.repository'
import { BieneSecuestradoLgi } from '../../bienes_secuestrados/entities/bienes_secuestrado.entity'
import { TipoVinculoLgi } from './entities/tipo-vinculo.entity'

@Injectable()
export class TipoVinculoLgiService {
  constructor(private readonly repository: TipoVinculoLgiRepository) {}

  async create(dto: CreateTipoVinculoDto) {
    const data = this.repository.create(dto)

    await this.repository.save(data)

    return {
      message: 'Registro registrado correctamente',
    }
  }

  async findAll() {
    return await this.repository.findAllOrdered()
  }

  async findOne(id: number) {
    const data = await this.repository.findActiveById(id)

    if (!data) {
      throw new NotFoundException('Registro no encontrada')
    }

    return data
  }

  async update(id: number, dto: UpdateCatalogoDto) {
    const data = await this.repository.findActiveById(id)

    if (!data) {
      throw new NotFoundException('Registro no encontrada')
    }

    Object.assign(data, dto)

    await this.repository.save(data)

    return {
      message: 'Registro actualizado correctamente',
    }
  }
  findAllByTipoVinculo(idVinculo: number): Promise<TipoVinculoLgi[]> {
    return this.repository.findAllByTipoVinculo(idVinculo)
  }
}
