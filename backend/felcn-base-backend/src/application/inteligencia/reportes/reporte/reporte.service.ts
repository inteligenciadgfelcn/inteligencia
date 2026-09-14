import { Injectable } from '@nestjs/common'

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

import { FiltrosVariablesCruzadasDto } from './dto/filtros-variables-cruzadas.dto'
import { ReporteServicioService } from './services/reporte-servicio.service'
import { TarjetaProntuariaService } from './services/tarjeta-prontuaria.service'
import { VariablesCruzadasService } from './services/variables-cruzadas.service'

@Injectable()
export class ReporteService {
  constructor(
    private readonly tarjetaProntuariaService: TarjetaProntuariaService,
    private readonly reporteServicioService: ReporteServicioService,
    private readonly variablesCruzadasService: VariablesCruzadasService
  ) {}

  async GenerarPDF(idDetenido: number) {
    return this.tarjetaProntuariaService.generar(idDetenido)
  }

  async GenerarPDFServicio(idServicio: string) {
    return this.reporteServicioService.generar(idServicio)
  }

  async buscarVariablesCruzadas(
    filtros: FiltrosVariablesCruzadasDto,
    pagination: PaginacionQueryDto
  ): Promise<[any[], number]> {
    return this.variablesCruzadasService.buscar(filtros, pagination)
  }
}
