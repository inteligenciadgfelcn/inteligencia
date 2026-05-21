import { Injectable } from '@nestjs/common'
import { CruzadasRepository } from './cruzados.repository'
import { ResultadoCruzada } from './interfaces/cruzada-filtro.interface'
import { ConsultaAvanzadaQueryDto, RespuestaAvanzadaCompleta } from './interfaces/consulta-avanzada-filtro.interface'

/**
 * Servicio CruzadasService
 * Capa de aplicación para las consultas cruzadas de operativos SIII.
 * Delega directamente al repositorio sin transformaciones adicionales.
 */
@Injectable()
export class CruzadasService {
  constructor(private readonly cruzadasRepository: CruzadasRepository) { }

  /** Operativos en un rango de fechas. */
  buscarPorFecha(fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorFecha(fechaInicio, fechaFin)
  }

  /** Operativos cuyo número de caso contiene el texto indicado. */
  buscarPorCaso(numeroCaso: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorCaso(numeroCaso)
  }

  /** Operativos que tienen droga del tipo indicado, en el rango de fechas. */
  buscarPorTipoDroga(idTipoDroga: number, fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorTipoDroga(idTipoDroga, fechaInicio, fechaFin)
  }

  /** Operativos que tienen droga con el estado indicado, en el rango de fechas. */
  buscarPorEstadoDroga(idEstadoDroga: number, fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorEstadoDroga(idEstadoDroga, fechaInicio, fechaFin)
  }

  /** Operativos del tipo de operación indicado, en el rango de fechas. */
  buscarPorTipoOperativo(idTipoOperacion: number, fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorTipoOperativo(idTipoOperacion, fechaInicio, fechaFin)
  }

  /** Operativos con el tipo de relevancia indicado, en el rango de fechas. */
  buscarPorRelevancia(idTipoRelevancia: number, fechaInicio: string, fechaFin: string): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorRelevancia(idTipoRelevancia, fechaInicio, fechaFin)
  }

  /** Operativos que contienen una persona aprehendida con el nombre indicado. */
  buscarPorAprehendido(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorAprehendido(nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo)
  }

  /** Búsqueda avanzada con 42 filtros todos opcionales. */
  buscarAvanzado(filtro: ConsultaAvanzadaQueryDto): Promise<RespuestaAvanzadaCompleta> {
    return this.cruzadasRepository.buscarAvanzado(filtro)
  }

  /** Operativos que contienen un arrestado con el nombre indicado. */
  buscarPorArrestado(
    nombres: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    apellidoEsposo: string,
  ): Promise<ResultadoCruzada[]> {
    return this.cruzadasRepository.buscarPorArrestado(nombres, apellidoPaterno, apellidoMaterno, apellidoEsposo)
  }
}
