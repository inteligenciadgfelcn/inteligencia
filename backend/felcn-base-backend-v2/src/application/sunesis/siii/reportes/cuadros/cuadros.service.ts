import { Injectable } from '@nestjs/common'
import { CuadrosRepository } from './cuadros.repository'
import type { RespuestaCuadro } from './interfaces/cuadro-filtro.interface'

/**
 * Servicio CuadrosService
 * Capa de aplicación para el reporte de cuadros de operativos SIII.
 * Delega directamente al repositorio sin transformaciones adicionales.
 * Origen: ReporteServicio.aspx.cs
 */
@Injectable()
export class CuadrosService {
  constructor(private readonly cuadrosRepository: CuadrosRepository) { }

  /** Reporte por código de servicio (filtro original del formulario). */
  buscarPorServicio(codServicio: string): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorServicio(codServicio)
  }

  /** Reporte de operativos en un rango de fechas. */
  buscarPorFecha(fechaInicio: string, fechaFin: string): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorFecha(fechaInicio, fechaFin)
  }

  /** Reporte de operativos que contienen drogas del tipo indicado. */
  buscarPorTipoDroga(
    idTipoDroga: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorTipoDroga(idTipoDroga, fechaInicio, fechaFin)
  }

  /** Reporte de operativos por tipo de operación. */
  buscarPorTipoOperativo(
    idTipoOperacion: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorTipoOperativo(idTipoOperacion, fechaInicio, fechaFin)
  }

  /** Reporte de operativos por tipo de relevancia. */
  buscarPorRelevancia(
    idTipoRelevancia: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorRelevancia(idTipoRelevancia, fechaInicio, fechaFin)
  }

  /** Reporte de operativos por nombre de persona implicada. */
  buscarPorPersona(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<RespuestaCuadro> {
    return this.cuadrosRepository.buscarPorPersona(nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo)
  }
}
