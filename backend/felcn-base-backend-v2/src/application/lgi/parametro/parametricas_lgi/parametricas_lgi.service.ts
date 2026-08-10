import { Injectable } from '@nestjs/common'
import { DistritalLgiRepository } from './repository/distrito.repository'
import { GrupoLgiRepository } from './repository/grupo.repository'
import { DepartamentoLgiRepository } from './repository/departamento.repository'

@Injectable()
export class ParametricasLgiService {
  constructor(
    private readonly distritoRepository: DistritalLgiRepository,
    private readonly grupoLgiRepository: GrupoLgiRepository,
    private readonly departamentoRepository: DepartamentoLgiRepository,
  ) {}

  findAllDistrito(idUsuario: number) {
    return this.distritoRepository.findAllGeneral(idUsuario)
  }

  findOne(id: number) {
    return this.distritoRepository.findOne(id)
  }

  async findAllGrupo(idDistrito: number) {
    return await this.grupoLgiRepository.findAllDistrito(idDistrito)
  }

  findAllDepartamento() {
    return this.departamentoRepository.findAllGeneral();
  }

}
