import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { TipoPersonaLgiRepository } from './repository/tipo-persona.repository'
import { CreateTipoPersonaDto } from './dto/create-tipo-persona.dto'
import { UpdateTipoPersonaDto } from './dto/update-tipo-persona.dto'


@Injectable()
export class TipoPersonaLgiService {
  constructor(
    private readonly repository: TipoPersonaLgiRepository,
  ) {}

  async create(dto: CreateTipoPersonaDto) {
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
    const data =
      await this.repository.findActiveById(id)

    if (!data) {
      throw new NotFoundException(
        'Registro no encontrada',
      )
    }

    return data
  }

  async update(
    id: number,
    dto: UpdateTipoPersonaDto,
  ) {
    const data =
      await this.repository.findActiveById(id)

    if (!data) {
      throw new NotFoundException(
        'Registro no encontrada',
      )
    }

    Object.assign(data, dto)

    await this.repository.save(data)

    return {
      message: 'Registro actualizado correctamente',
    }
  }

}