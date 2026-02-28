import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { BaseService } from '@/common/base'
import { Servicio } from '../entity/servicio.entity'
import { ServicioRepository } from '../repository/servicio.repository'
import { CrearServicioDto, FiltrosServicioDto } from '../dto'

@Injectable()
export class ServicioService extends BaseService {
  constructor(private readonly servicioRepository: ServicioRepository) {
    super()
  }

  async crear(dto: CrearServicioDto): Promise<Servicio> {
    const existente = await this.servicioRepository.buscarPorCodigo(
      dto.codigoServicio
    )
    if (existente) {
      throw new ConflictException(
        `Ya existe un servicio con el código: ${dto.codigoServicio}`
      )
    }

    const servicio = new Servicio({
      ...dto,
      fechaHoraIngreso: new Date(dto.fechaHoraIngreso),
      fechaHoraSalida: new Date(dto.fechaHoraSalida),
    })

    return this.servicioRepository.crear(servicio)
  }

  async listar(filtros: FiltrosServicioDto): Promise<[Servicio[], number]> {
    return this.servicioRepository.listar(filtros)
  }

  async buscarPorCodigo(codigoServicio: string): Promise<Servicio> {
    const servicio =
      await this.servicioRepository.buscarPorCodigo(codigoServicio)
    if (!servicio) {
      throw new NotFoundException(
        `Servicio con código ${codigoServicio} no encontrado`
      )
    }
    return servicio
  }

  async buscarActivoPorUsuario(usuarioLogin: string): Promise<Servicio | null> {
    return this.servicioRepository.buscarActivoPorUsuario(usuarioLogin)
  }

  async verificarServicioActivo(usuarioLogin: string): Promise<boolean> {
    const servicio =
      await this.servicioRepository.buscarActivoPorUsuario(usuarioLogin)
    return servicio !== null
  }

  async eliminar(codigoServicio: string): Promise<void> {
    const servicio = await this.buscarPorCodigo(codigoServicio)
    await this.servicioRepository.eliminar(servicio.codigoServicio)
  }
}
