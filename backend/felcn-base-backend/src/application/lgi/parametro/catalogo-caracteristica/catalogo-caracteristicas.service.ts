import {
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CatalogoCaracteristicaLgiRepository } from './repository/catalogo-caracteristicas.repository'
import { CreateCatalogoCaracteristicasDto } from './dto/create-catalogo-caracteristica.dto'
import { UpdateCatalogoCaracteristicaDto } from './dto/update-catalogo-caracteristicas.dto'


@Injectable()
export class CatalogoCaracteristicasLgiService {
  constructor(
    private readonly repository: CatalogoCaracteristicaLgiRepository,
  ) {}

  async create(dto: CreateCatalogoCaracteristicasDto) {
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
    dto: UpdateCatalogoCaracteristicaDto,
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

  findAllCaracteristicaClase(idClase: number): Promise<any[]> {
    return this.repository.findAllByCaracteristicaClase(idClase)
  }

}