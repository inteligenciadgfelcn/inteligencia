import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EstadoLgiRepository } from './repository/estado.repository'
import { CreateEstadoDto } from './dto/create-estado.dto'
import { UpdateEstadoDto } from './dto/update-estado.dto'


@Injectable()
export class EstadoLgiService {
  constructor(
    private readonly repository: EstadoLgiRepository,
  ) {}

  async create(dto: CreateEstadoDto) {
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
    dto: UpdateEstadoDto,
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