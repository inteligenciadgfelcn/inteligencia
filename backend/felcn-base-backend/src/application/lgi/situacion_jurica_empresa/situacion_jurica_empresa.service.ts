import { Injectable } from '@nestjs/common'
import { CreateSituacionJuridicaEmpresaDto } from './dto/create-situacion_jurica_empresa.dto'
import { SituacionJuridicaEmpresaRepository } from './repository/situacion_juridica_empresa.repository'

@Injectable()
export class SituacionJuridicaEmpresaService {
  constructor(
    private readonly repository: SituacionJuridicaEmpresaRepository
  ) {}

  create(dto: CreateSituacionJuridicaEmpresaDto) {
    return this.repository.create(dto)
  }

  findAll() {
    return this.repository.findAll()
  }

  findByEmpresa(idEmpresa: number) {
    return this.repository.findByEmpresa(idEmpresa)
  }

  findOne(id: number) {
    return this.repository.findOne(id)
  }

  update(id: number, dto: CreateSituacionJuridicaEmpresaDto) {
    return this.repository.update(id, dto)
  }

  async remove(id: number) {
    await this.repository.remove(id)

    return {
      mensaje: 'Situación jurídica eliminada correctamente',
    }
  }

  findTipos() {
    return this.repository.findTipos()
  }
}
