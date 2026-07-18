import { Injectable } from '@nestjs/common'
import { FlujoTransporteService } from '../../flujo-transporte/service/flujo-transporte.service'
import type {
  FiltroFlujoTransporte,
  FlujoTransporteReporteRow,
} from '../../flujo-transporte/repository/flujo-transporte.repository'

/**
 * Servicio de agregación de datos para el reporte de Flujo de Transporte.
 * Delega en FlujoTransporteService (módulo S2I) el listado con conductor,
 * transporte, lugar y color ya resueltos.
 */
@Injectable()
export class ReporteFlujoTransporteService {
  constructor(private readonly flujoTransporteService: FlujoTransporteService) {}

  async listar(
    filtro: FiltroFlujoTransporte
  ): Promise<FlujoTransporteReporteRow[]> {
    return this.flujoTransporteService.listar(filtro)
  }
}
