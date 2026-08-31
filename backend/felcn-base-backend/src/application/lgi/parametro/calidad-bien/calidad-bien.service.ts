import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CalidadBienLgiRepository } from './repository/calidad-bien.repository'
import { CreateCalidadBienDto } from './dto/create-calidad-bien.dto'
import { UpdateCalidadBienDto } from './dto/update-calidad-bien.dto'


@Injectable()
export class CalidadBienLgiService {
  constructor(
    private readonly repository: CalidadBienLgiRepository,
  ) {}

  async create(dto: CreateCalidadBienDto) {
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
    dto: UpdateCalidadBienDto,
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