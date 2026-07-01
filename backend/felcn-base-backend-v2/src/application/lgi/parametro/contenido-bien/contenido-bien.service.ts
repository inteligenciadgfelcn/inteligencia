import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { ContenidoBienLgiRepository } from './repository/contenido-bien.repository'
import { CreateContenidoBienDto } from './dto/create-contenido-bien.dto'
import { UpdateContenidoBienDto } from './dto/update-contenido-bien.dto'


@Injectable()
export class ContenidoBienLgiService {
  constructor(
    private readonly repository: ContenidoBienLgiRepository,
  ) {}

  async create(dto: CreateContenidoBienDto) {
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
    dto: UpdateContenidoBienDto,
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