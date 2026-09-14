import { Injectable } from '@nestjs/common';

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto';

import { FiltrosVariablesCruzadasDto } from './dto/filtros-variables-cruzadas.dto';
import { ReporteServicioService } from './services/reporte-servicio.service';
import { TarjetaProntuariaService } from './services/tarjeta-prontuaria.service';
import { VariablesCruzadasService } from './services/variables-cruzadas.service';

@Injectable()
export class ReporteService {
  constructor(
    private readonly tarjetaProntuariaService:
      TarjetaProntuariaService,

    private readonly reporteServicioService:
      ReporteServicioService,

    private readonly variablesCruzadasService:
      VariablesCruzadasService,
  ) {}

  /**
   * Genera la información necesaria para
   * la tarjeta prontuaria de un detenido.
   */
  async GenerarPDF(idDetenido: number) {
    return this.tarjetaProntuariaService.generar(
      idDetenido,
    );
  }

  /**
   * Genera la información correspondiente
   * al reporte de servicio.
   */
  async GenerarPDFServicio(
    idServicio: string,
  ) {
    return this.reporteServicioService.generar(
      idServicio,
    );
  }

  /**
   * Consulta las personas mediante variables
   * cruzadas entre SIII y SII.
   */
  async buscarVariablesCruzadas(
    filtros: FiltrosVariablesCruzadasDto,
    pagination: PaginacionQueryDto,
  ): Promise<[any[], number]> {
    return this.variablesCruzadasService.buscar(
      filtros,
      pagination,
    );
  }
}