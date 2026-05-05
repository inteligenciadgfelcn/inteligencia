import { Injectable } from '@nestjs/common'
import { CasosParalelosRepository } from '../repository/casos-paralelos.repository'

@Injectable()
export class CasosParalelosService {
  constructor(
    private readonly repository: CasosParalelosRepository
  ) { }

  async buscarCasos(unidad: string, numeroCaso: string) {
    return this.repository.buscarPorUnidadYNumeroCaso(unidad, numeroCaso)
  }
}
