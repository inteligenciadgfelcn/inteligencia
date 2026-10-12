import { Injectable } from '@nestjs/common'

import { CreateSituacionJuridicaPdDto } from './dto/create-situacion_juridica_pd.dto'
import { UpdateSituacionJuridicaPdDto } from './dto/update-situacion_juridica_pd.dto'

import {
  SituacionJuridicaConRelaciones,
  SituacionJuridicaPdRepository,
} from './repository/situacion_juridica_pd.repository'

@Injectable()
export class SituacionJuridicaPdService {
  constructor(
    private readonly repository: SituacionJuridicaPdRepository,
  ) {}

  create(
    dto: CreateSituacionJuridicaPdDto,
    usuarioAuditoria?: string,
  ): Promise<SituacionJuridicaConRelaciones> {
    return this.repository.create(
      dto,
      usuarioAuditoria,
    )
  }

  findAll(): Promise<SituacionJuridicaConRelaciones[]> {
    return this.repository.findAll()
  }

  findByBien(
    itemBienSecId: string,
  ): Promise<SituacionJuridicaConRelaciones[]> {
    return this.repository.findByBien(itemBienSecId)
  }

  findOne(
    id: string,
  ): Promise<SituacionJuridicaConRelaciones> {
    return this.repository.findOne(id)
  }

  update(
    id: string,
    dto: UpdateSituacionJuridicaPdDto,
  ): Promise<SituacionJuridicaConRelaciones> {
    return this.repository.update(id, dto)
  }

  remove(
    id: string,
  ): Promise<{
    mensaje: string
    perdomId: string
  }> {
    return this.repository.remove(id)
  }
}