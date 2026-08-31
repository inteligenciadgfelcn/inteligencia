import { Injectable } from '@nestjs/common'
import { UpdateBieneSecuestradoLgiDto } from './dto/update-bienes_secuestrado.dto'
import { BieneSecuestradoLgi } from './entities/bienes_secuestrado.entity'
import { CreateBienesSecuestradoDto } from './dto/create-bienes_secuestrado.dto'
import { BienSecuestradoLgiRepository } from './repository/bien_secuestrado_lgi.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class BieneSecuestradoLgiService {
  constructor(
    private readonly bieneSecuestradoRepository: BienSecuestradoLgiRepository
  ) {}

  create(dto: CreateBienesSecuestradoDto): Promise<BieneSecuestradoLgi> {
    return this.bieneSecuestradoRepository.create(dto)
  }

  findAll(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.bieneSecuestradoRepository.findAll(opId)
  }

  findAllPaginado(
    opId: number,
    pagination: PaginacionQueryDto
  ): Promise<[BieneSecuestradoLgi[], number]> {
    return this.bieneSecuestradoRepository.findAllPaginado(opId, pagination)
  }

  findAllByOperativo(opId: number): Promise<BieneSecuestradoLgi[]> {
    return this.bieneSecuestradoRepository.findAllByOperativo(opId)
  }

  findOne(id: number): Promise<BieneSecuestradoLgi> {
    return this.bieneSecuestradoRepository.findOne(id)
  }

  update(
    id: number,
    dto: UpdateBieneSecuestradoLgiDto
  ): Promise<BieneSecuestradoLgi> {
    return this.bieneSecuestradoRepository.update(id, dto)
  }

  async eliminar(id: number): Promise<{
    message: string
  }> {
    await this.bieneSecuestradoRepository.inactivar(id)

    return {
      message: 'Bien secuestrado inactivado correctamente',
    }
  }
}
