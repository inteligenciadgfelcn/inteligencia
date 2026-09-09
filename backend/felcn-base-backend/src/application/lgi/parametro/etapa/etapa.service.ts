import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { EtapaLgiRepository } from './repository/etapa.repository'
import { CreateEtapaDto } from './dto/create-etapa.dto'
import { UpdateEtapaDto } from './dto/update-etapa.dto'


@Injectable()
export class EtapaLgiService {
  constructor(
    private readonly repository: EtapaLgiRepository,
  ) {}

  async create(dto: CreateEtapaDto) {
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
    dto: UpdateEtapaDto,
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