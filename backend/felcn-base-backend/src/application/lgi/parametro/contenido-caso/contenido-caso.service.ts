import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ContenidoCasoLgiRepository } from './repository/contenido-caso.repository'
import { CreateContenidoCasoDto } from './dto/create-contenido-caso.dto'
import { UpdateContenidoCasoDto } from './dto/update-contenido-caso.dto'


@Injectable()
export class ContenidoCasoLgiService {
  constructor(
    private readonly repository: ContenidoCasoLgiRepository,
  ) {}

  async create(dto: CreateContenidoCasoDto) {
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
    dto: UpdateContenidoCasoDto,
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