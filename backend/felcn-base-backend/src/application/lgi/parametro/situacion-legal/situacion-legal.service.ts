import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { SituacionLegalLgiRepository } from './repository/situacion-legal.repository'
import { CreateSituacionLegalDto } from './dto/create-situacion-legal.dto'
import { UpdateSituacionLegalDto } from './dto/update-situacion-legal.dto'


@Injectable()
export class SituacionLegalLgiService {
  constructor(
    private readonly repository: SituacionLegalLgiRepository,
  ) {}

  async create(dto: CreateSituacionLegalDto) {
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
    dto: UpdateSituacionLegalDto,
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