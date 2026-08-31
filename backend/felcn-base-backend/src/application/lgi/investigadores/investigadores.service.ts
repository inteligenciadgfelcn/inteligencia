import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InvestigadorLgiRepository } from './repository/investigador.repository'
import { AsignarInvestigadorDto } from './dto/asignar-investigador.dto'
import { EstadoInvestigador } from './enum/estado-investigador.enum'
import { SepararInvestigadorDto } from './dto/separar-investigador.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

@Injectable()
export class InvestigadorLgiService {
  constructor(
    private readonly investigadorRepository: InvestigadorLgiRepository
  ) {}

  async findAllGeneralInvestigadores(idGrupo: number): Promise<any[]> {
    return this.investigadorRepository.findAllGeneralInvestigadores(idGrupo)
  }

  async asignarInvestigador(casoId: number, dto: AsignarInvestigadorDto) {
    const numeroPase = dto.numeroPase.trim().toUpperCase()

    const asignacionActual =
      await this.investigadorRepository.findAsignacionActual(casoId, numeroPase)

    if (asignacionActual) {
      throw new ConflictException(
        'El investigador ya se encuentra asignado actualmente a este caso'
      )
    }

    const fueAsignadoAnteriormente =
      await this.investigadorRepository.tieneHistorial(casoId, numeroPase)

    const investigador = this.investigadorRepository.create({
      ...dto,
      casoId,
      numeroPase,
      memo: dto.memo.trim(),
      fechaAsignacion: new Date(dto.fechaAsignacion),
      fechaSeparacion: null,
      estadoInvestigador: EstadoInvestigador.ASIGNADO,
      actual: true,
      informacionActualizada: fueAsignadoAnteriormente
        ? 'REASIGNACIÓN DE INVESTIGADOR'
        : 'REGISTRO DE ASIGNACIÓN',
    })

    await this.investigadorRepository.save(investigador)

    return {
      message: fueAsignadoAnteriormente
        ? 'Investigador reasignado correctamente'
        : 'Investigador asignado correctamente',
      id: investigador.investigadorId,
    }
  }

  async separarInvestigador(
    investigadorId: number,
    dto: SepararInvestigadorDto
  ) {
    const investigador =
      await this.investigadorRepository.findOneById(investigadorId)

    if (!investigador) {
      throw new NotFoundException(
        'No se encontró la asignación del investigador'
      )
    }

    if (!investigador.actual) {
      throw new ConflictException('El investigador ya fue separado del caso')
    }

    investigador.estadoInvestigador = EstadoInvestigador.SEPARADO
    investigador.actual = false
    investigador.fechaSeparacion = new Date(dto.fechaSeparacion)
    investigador.usuarioActualizacion = dto.usuarioActualizacion
    investigador.informacionActualizada = 'SEPARACIÓN DE INVESTIGADOR'

    await this.investigadorRepository.save(investigador)

    return {
      message: 'Investigador separado correctamente',
      investigadorId: investigador.investigadorId,
    }
  }

  async findInvestigadoresByCaso(casoId: number) {
    const investigadores =
      await this.investigadorRepository.findHistorialByCaso(casoId)

    if (!investigadores.length) {
      throw new NotFoundException(
        `No existen investigadores registrados en el caso ${casoId}`
      )
    }

    return {
      casoId,
      total: investigadores.length,
      investigadores,
    }
  }

  async findAllGeneralInvestigador(pagination: PaginacionQueryDto) {
    return await this.investigadorRepository.findAllGeneralInvestigador(
      pagination
    )
  }
}
