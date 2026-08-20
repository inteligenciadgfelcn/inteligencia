import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { AsignarInvestigadoresDto } from './dto/asignar-investigador.dto'
import { InvestigadorLgiRepository } from './repository/investigador.repository'

@Injectable()
export class InvestigadorLgiService {
  constructor(
    private readonly investigadorRepository: InvestigadorLgiRepository
  ) {}

  async asignarInvestigadores(
    casoId: number,
    dto: AsignarInvestigadoresDto
  ) {
    const investigadores =
      await this.investigadorRepository.asignarInvestigadores(
        casoId,
        dto
      )

    return {
      message: 'Investigadores asignados correctamente',
      casoId,
      cantidadAsignada: investigadores.length,
      investigadores,
    }
  }

  async findByCaso(casoId: number) {
    const investigadores =
      await this.investigadorRepository.findByCaso(casoId)

    if (!investigadores.length) {
      throw new NotFoundException(
        `No existen investigadores asignados al caso ${casoId}`
      )
    }

    return investigadores
  }

  async findActualesByCaso(casoId: number) {
    const investigadores =
      await this.investigadorRepository.findActualesByCaso(
        casoId
      )

    if (!investigadores.length) {
      throw new NotFoundException(
        `El caso ${casoId} no tiene investigadores actualmente asignados`
      )
    }

    return investigadores
  }
}