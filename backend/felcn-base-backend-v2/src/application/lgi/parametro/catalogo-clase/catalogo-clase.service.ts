import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CatalogoClaseLgiRepository } from './repository/catalogo-clase.repository'
import { CreateCatalogoClaseDto } from './dto/create-catalogo-clase.dto'
import { UpdateCatalogoDto } from './dto/update-catalogo-clase.dto'


@Injectable()
export class CatalogoClaseLgiService {
  constructor(
    private readonly repository: CatalogoClaseLgiRepository,
  ) {}

  async create(dto: CreateCatalogoClaseDto) {
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
    dto: UpdateCatalogoDto,
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