import { Injectable } from '@nestjs/common'
import { PaginacionQueryDto } from '@/common/dto'
import { CreateVinculoBienDto } from './dto/create-vinculo_bien_pd.dto'
import { UpdateVinculoBienDto } from './dto/update-vinculo_bien_pd.dto'
import { VinculoBienRepository } from './repository/vinculo_bien.repository'


@Injectable()
export class VinculoBienService {
  constructor(
    private readonly vinculoBienRepository: VinculoBienRepository
  ) {}

  create(dto: CreateVinculoBienDto) {
    return this.vinculoBienRepository.create(dto)
  }

  findAll() {
    return this.vinculoBienRepository.findAll()
  }

  findAllPaginado(pagination: PaginacionQueryDto) {
    return this.vinculoBienRepository.findAllPaginado(pagination)
  }

  findByBien(itemBienSecId: string) {
    return this.vinculoBienRepository.findByBien(itemBienSecId)
  }

  findOne(id: string) {
    return this.vinculoBienRepository.findOne(id)
  }

  update(id: string, dto: UpdateVinculoBienDto) {
    return this.vinculoBienRepository.update(id, dto)
  }

  remove(id: string) {
    return this.vinculoBienRepository.remove(id)
  }
}