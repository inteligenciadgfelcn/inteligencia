import { Injectable } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto'

import { CreateVinculoBienLgiDto } from './dto/create-vinculo_bien_lgi.dto'
import { UpdateVinculoBienLgiDto } from './dto/update-vinculo_bien_lgi.dto'
import { VinculoBienLgiRepository } from './repository/vinculo_bien_lgi.repository'

@Injectable()
export class VinculoBienLgiService {
  constructor(
    private readonly vinculoBienLgiRepository: VinculoBienLgiRepository
  ) {}

  create(dto: CreateVinculoBienLgiDto) {
    return this.vinculoBienLgiRepository.create(dto)
  }

  findAll() {
    return this.vinculoBienLgiRepository.findAll()
  }

  findAllPaginado(pagination: PaginacionQueryDto) {
    return this.vinculoBienLgiRepository.findAllPaginado(pagination)
  }

  findByBien(itemBienSecId: string) {
    return this.vinculoBienLgiRepository.findByBien(itemBienSecId)
  }

  findOne(id: string) {
    return this.vinculoBienLgiRepository.findOne(id)
  }

  update(id: string, dto: UpdateVinculoBienLgiDto) {
    return this.vinculoBienLgiRepository.update(id, dto)
  }

  remove(id: string) {
    return this.vinculoBienLgiRepository.remove(id)
  }
}