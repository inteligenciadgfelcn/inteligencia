import { Injectable, NotFoundException } from '@nestjs/common'
import { ReporteServicioRepository } from '../repository/reporte_servicio.repository'

@Injectable()
export class ReporteServicioService {
  constructor(
    private readonly reporteServicioRepository: ReporteServicioRepository
  ) {}

  async generar(idServicio: string) {
    const codigoServicio = idServicio.trim()

    const [resultados, drogas, sustancias, fabricas, personas, operativos] =
      await Promise.all([
        this.reporteServicioRepository.obtenerResultados(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesDrogas(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesSustancias(codigoServicio),
        this.reporteServicioRepository.obtenerTotalesFabricas(codigoServicio),
        this.reporteServicioRepository.obtenerResumenPersonas(codigoServicio),
        this.reporteServicioRepository.obtenerOperativosMapa(codigoServicio),
      ])

    if (!resultados.length) {
      throw new NotFoundException(
        `No se encontraron resultados para el servicio ${codigoServicio}`
      )
    }

    return {
      servicio: {
        idServicio: codigoServicio,
      },
      resultados,
      totalesSustancias: [...drogas, ...sustancias, ...fabricas],
      resumenPersonas: {
        aprehendidos: Number(personas?.aprehendidos ?? 0),
        arrestados: Number(personas?.arrestados ?? 0),
      },

      operativos,
    }
  }
}
