import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { EstructuraRepository } from '../repository/estructura.repository'
import { Grado } from '../entity/grado.entity'
import { Unidad } from '../entity/unidad.entity'
import { Distrital } from '../entity/distrital.entity'
import { Grupo } from '../entity/grupo.entity'

@Injectable()
export class EstructuraService extends BaseService {
  constructor(private readonly estructuraRepository: EstructuraRepository) {
    super()
  }

  async listarGrados(): Promise<Grado[]> {
    return this.estructuraRepository.listarGrados()
  }

  async listarUnidades(): Promise<Unidad[]> {
    return this.estructuraRepository.listarUnidades()
  }

  async listarDistritales(): Promise<Distrital[]> {
    return this.estructuraRepository.listarDistritales()
  }

  async listarDistritalesPorUnidad(idUnidad: number): Promise<Distrital[]> {
    return this.estructuraRepository.listarDistritalesPorUnidad(idUnidad)
  }

  async listarGrupos(): Promise<Grupo[]> {
    return this.estructuraRepository.listarGrupos()
  }

  async listarGruposPorDistrital(idDistrital: number): Promise<Grupo[]> {
    return this.estructuraRepository.listarGruposPorDistrital(idDistrital)
  }
}
