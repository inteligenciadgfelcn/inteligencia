import { Injectable } from '@nestjs/common';
import { CreateSituacionJuridicaBienDto } from './dto/create-situacion_juridica_bien.dto';
import { UpdateSituacionJuridicaBienDto } from './dto/update-situacion_juridica_bien.dto';
import { PaginacionQueryDto } from '@/common/dto';
import { SituacionJuridicaBienRepository } from './repository/situacion-juridica-bien.repository';

@Injectable()
export class SituacionJuridicaBienService {
  constructor(
    private readonly repository:
      SituacionJuridicaBienRepository,
  ) {}

  create(
    dto: CreateSituacionJuridicaBienDto,
  ) {
    return this.repository.create(dto)
  }

  findAll() {
    return this.repository.findAll()
  }
  
  findByBien(
    itembiensecId: number,
  ) {
    return this.repository
      .findByBien(itembiensecId)
  }

  findOne(id: number) {
    return this.repository.findOne(id)
  }

  update(
    id: number,
    dto: UpdateSituacionJuridicaBienDto,
  ) {
    return this.repository.update(
      id,
      dto,
    )
  }

  async remove(id: number) {
    await this.repository.remove(id)

    return {
      mensaje:
        'Situación jurídica inactivada correctamente',
    }
  }
}
