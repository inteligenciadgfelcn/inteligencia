import { BadRequestException, Injectable } from '@nestjs/common'
import { AsignacionesIngresoRepository } from '../repository/asignaciones-ingreso.repository'
import { BuscarIngresoDto } from '../dto/buscar-ingreso.dto'

/**
 * Servicio AsignacionesIngresoService
 * Lógica de negocio para el listado de asignaciones por estado de ingreso.
 * Origen: FRM-INF-ING.aspx.cs
 */
@Injectable()
export class AsignacionesIngresoService {
  constructor(private readonly repository: AsignacionesIngresoRepository) {}

  /**
   * Lista asignaciones SIN operativo ingresado para el distrital del usuario.
   * Origen: muestraoperativos() + Gridcasosing — FRM-INF-ING.aspx.cs
   */
  async listarSinRegistrar(dto: BuscarIngresoDto) {
    return this.repository.findSinRegistrar(dto)
  }

  /**
   * Lista asignaciones CON operativo ingresado, buscando por número de caso.
   * Origen: muestraoperativosnumero() + Gridcasosact — FRM-INF-ING.aspx.cs
   */
  async listarRegistradosPorNumero(dto: BuscarIngresoDto) {
    if (!dto.nroCaso) throw new BadRequestException('El campo nroCaso es requerido')
    return this.repository.findRegistradosPorNumero(dto)
  }

  /**
   * Lista asignaciones CON operativo ingresado, buscando por nombre de caso.
   * Origen: muestraoperativosnnombres() + Gridcasosact — FRM-INF-ING.aspx.cs
   */
  async listarRegistradosPorNombre(dto: BuscarIngresoDto) {
    if (!dto.nombreCaso) throw new BadRequestException('El campo nombreCaso es requerido')
    return this.repository.findRegistradosPorNombre(dto)
  }

  /**
   * Lista asignaciones CON operativo ingresado, filtradas por rango de fecha.
   * Origen: muestraoperativosfechas() + Gridcasosact — FRM-INF-ING.aspx.cs
   */
  async listarRegistradosPorFecha(dto: BuscarIngresoDto) {
    if (!dto.desde || !dto.hasta) {
      throw new BadRequestException('Los campos desde y hasta son requeridos')
    }
    return this.repository.findRegistradosPorFecha(dto)
  }
}
