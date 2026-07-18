import { Injectable, BadRequestException } from '@nestjs/common'
import {
  FlujoTransporteRepository,
  FiltroFlujoTransporte,
  FlujoTransporteReporteRow,
} from '../repository/flujo-transporte.repository'
import { S2iFlujoTransporte } from '../entity/flujo-transporte.entity'
import { CreateFlujoTransporteDto } from '../dto/create-flujo-transporte.dto'

@Injectable()
export class FlujoTransporteService {
  constructor(private readonly repo: FlujoTransporteRepository) {}

  async crear(
    dto: CreateFlujoTransporteDto,
    usuario: string
  ): Promise<S2iFlujoTransporte> {
    const flujo = new S2iFlujoTransporte({
      codigoTransporte: dto.codigoTransporte.trim().toUpperCase(),
      numeroDocumento: dto.numeroDocumento.trim().toUpperCase(),
      idLugar: dto.idLugar,
      idColor: dto.idColor,
      origen: dto.origen.trim().toUpperCase(),
      destino: dto.destino.trim().toUpperCase(),
      carga: dto.carga.trim().toUpperCase(),
      fechaHora: new Date(dto.fechaHora),
      latitud: dto.latitud,
      longitud: dto.longitud,
      usuario: usuario.trim(),
    })

    try {
      return await this.repo.crear(flujo)
    } catch (e: any) {
      if (e?.code === '23503') {
        // FK violation — alguno de los 4 datos ya no existe (se pudo eliminar entre la
        // búsqueda y el registro). Se identifica el campo por el nombre de constraint.
        const detalle: string = e?.detail ?? ''
        if (detalle.includes('fk_flujo_transporte_conductor'))
          throw new BadRequestException(
            'El conductor seleccionado ya no existe, vuelva a buscarlo'
          )
        if (detalle.includes('fk_flujo_transporte_transporte'))
          throw new BadRequestException(
            'El transporte seleccionado ya no existe, vuelva a buscarlo'
          )
        if (detalle.includes('fk_flujo_transporte_lugares'))
          throw new BadRequestException(
            'El lugar seleccionado ya no existe, vuelva a buscarlo/registrarlo'
          )
        if (detalle.includes('fk_flujo_transporte_color'))
          throw new BadRequestException('El color seleccionado ya no existe')
        throw new BadRequestException(
          'Referencia inválida en los datos del flujo de transporte'
        )
      }
      throw e
    }
  }

  async listar(
    filtro: FiltroFlujoTransporte
  ): Promise<FlujoTransporteReporteRow[]> {
    return this.repo.listar(filtro)
  }
}
