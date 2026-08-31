import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { GradoLgiRepository } from './repository/grado.repository'
import { CreateGradoDto } from './dto/create-grado.dto'
import { UpdateGradoDto } from './dto/update-grado.dto'


@Injectable()
export class GradoLgiService {
  constructor(
    private readonly repository: GradoLgiRepository,
  ) {}

  async create(dto: CreateGradoDto) {
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
    dto: UpdateGradoDto,
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