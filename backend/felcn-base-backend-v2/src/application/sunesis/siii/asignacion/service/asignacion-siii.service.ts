import { Injectable } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { AsignacionSiiiRepository } from '../repository/asignacion-siii.repository'

@Injectable()
export class AsignacionSiiiService extends BaseService {
  constructor(
    private readonly asignacionSiiiRepository: AsignacionSiiiRepository,
  ) {
    super()
  }


  /**
   * Buscar asignación por ID de caso.
   */
  async buscarPorId(idCaso: string) {
    return this.asignacionSiiiRepository.buscarPorId(idCaso)
  }
}
