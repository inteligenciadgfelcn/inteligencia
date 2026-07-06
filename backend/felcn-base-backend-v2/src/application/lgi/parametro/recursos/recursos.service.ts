import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { RecursosLgiRepository } from './repository/recursos.repository'
import { CreateRecursosDto } from './dto/create-recursos.dto'
import { UpdateRecursosDto } from './dto/update-recursos.dto'


@Injectable()
export class RecursosLgiService {
  constructor(
    private readonly repository: RecursosLgiRepository,
  ) {}

  async create(dto: CreateRecursosDto) {
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
    dto: UpdateRecursosDto,
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