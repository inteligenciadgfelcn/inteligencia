import { Injectable } from '@nestjs/common'

import { CreateSituacionJuridicaPdDto } from './dto/create-situacion_juridica_pd.dto'
import { UpdateSituacionJuridicaPdDto } from './dto/update-situacion_juridica_pd.dto'
import { SituacionJuridicaPdRepository } from './repository/situacion_juridica_pd.repository'

@Injectable()
export class SituacionJuridicaPdService {
  constructor(
    private readonly repository: SituacionJuridicaPdRepository
  ) {}

  create(
    dto: CreateSituacionJuridicaPdDto,
    usuarioAuditoria?: string
  ) {
    return this.repository.create(dto, usuarioAuditoria)
  }

  findAll() {
    return this.repository.findAll()
  }

  findByBien(itemBienSecId: string) {
    return this.repository.findByBien(itemBienSecId)
  }

  findOne(id: string) {
    return this.repository.findOne(id)
  }

  update(id: string, dto: UpdateSituacionJuridicaPdDto) {
    return this.repository.update(id, dto)
  }

  remove(id: string) {
    return this.repository.remove(id)
  }
}