import { Injectable } from '@nestjs/common'

import { CreatePersonasJuridicaDto } from './dto/create-personas_juridica.dto'

import { UpdatePersonasJuridicaDto } from './dto/update-personas_juridica.dto'

import { PersonasJuridicasRepository } from './repository/personas_juridicas.repository'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class PersonasJuridicasService {
  constructor(private readonly repository: PersonasJuridicasRepository) {}

  create(
    dto: CreatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ) {
    return this.repository.create(dto, imagen, documento)
  }

  findByOperativo(opId: number) {
    return this.repository.findByOperativo(opId)
  }

  findOne(empId: number) {
    return this.repository.findOne(empId)
  }

  update(
    empId: number,
    dto: UpdatePersonasJuridicaDto,
    imagen?: Express.Multer.File,
    documento?: Express.Multer.File
  ) {
    return this.repository.update(empId, dto, imagen, documento)
  }

  async remove(empId: number) {
    await this.repository.remove(empId)

    return {
      mensaje: 'Empresa eliminada correctamente',
    }
  }

 findAllPaginadoPorOperativo(
  opId: number,
  pagination: PaginacionQueryDto,
) {
  return this.repository
    .findAllPaginadoPorOperativo(
      opId,
      pagination,
    )
}

findAllPaginadoPorCaso(
  casosId: number,
  pagination: PaginacionQueryDto,
) {
  return this.repository
    .findAllPaginadoPorCaso(
      casosId,
      pagination,
    )
}
}
