import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { TipoSituacionLegalBienLgiRepository } from './repository/tipo_situcion_bien.repository'
import { UpdateTipoSituacionLegalBienDto } from './dto/update-tipo_situcion_bien.dto'
import { CreateTipoSituacionLegalBienDto } from './dto/create-tipo_situcion_bien.dto'


@Injectable()
export class TipoSituacionLegalBienLgiService {
  constructor(
    private readonly repository: TipoSituacionLegalBienLgiRepository,
  ) {}

  async create(dto: CreateTipoSituacionLegalBienDto) {
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
    dto: UpdateTipoSituacionLegalBienDto,
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