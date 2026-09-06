import { Injectable } from '@nestjs/common'

import { CreateSituacionJuridicaBienDto } from './dto/create-principal.dto'

import { UpdateSituacionJuridicaBienDto } from './dto/update-situacion_juridica_bien.dto'
import { SituacionJuridicaBienRepository } from './repository/situacion-juridica-bien.repository'

@Injectable()
export class SituacionJuridicaBienService {
  constructor(private readonly repository: SituacionJuridicaBienRepository) {}

  create(dto: CreateSituacionJuridicaBienDto) {
    return this.repository.create(dto)
  }

  findAll() {
    return this.repository.findAll()
  }


  findByBien(itembiensecId: number) {
    return this.repository.findByBien(itembiensecId)
  }

  findOne(itembiensecId: number) {
    return this.repository.findOne(itembiensecId)
  }

  update(
    idTipo: number,
    idRegistro: number,
    dto: UpdateSituacionJuridicaBienDto
  ) {
    return this.repository.update(idTipo, idRegistro, dto)
  }

  async remove(idTipo: number, idRegistro: number) {
    await this.repository.remove(idTipo, idRegistro)

    return {
      mensaje: 'Situación jurídica eliminada correctamente',
    }
  }
}
