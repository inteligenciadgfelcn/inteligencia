import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { BaseService } from '@/common/base'
import { Asignacion } from '../entity/asignacion.entity'
import { AsignacionRepository } from '../repository/asignacion.repository'
import {
  CrearAsignacionDto,
  ActualizarAsignacionDto,
  FiltrosAsignacionDto,
} from '../dto'

/**
 * Servicio para gestión de asignaciones de casos
 * Base de datos: felcn_asignacion_caso
 * Tabla: asignacion
 */
@Injectable()
export class AsignacionService extends BaseService {
  constructor(private readonly asignacionRepository: AsignacionRepository) {
    super()
  }

  async crear(dto: CrearAsignacionDto, usuarioLogin: string): Promise<Asignacion> {
    // Verificar si ya existe un caso con el mismo número (si tiene número)
    if (dto.numeroCaso && dto.numeroCaso.trim() !== '') {
      const existente = await this.asignacionRepository.buscarPorNumeroCaso(
        dto.numeroCaso,
      )
      if (existente) {
        throw new ConflictException(
          `Ya existe una asignación con el número de caso: ${dto.numeroCaso}`,
        )
      }
    }

    const asignacion = new Asignacion({
      ...dto,
      usuarioLogin,
      fechaOperativo: dto.fechaOperativo
        ? new Date(dto.fechaOperativo)
        : undefined,
    })

    return this.asignacionRepository.crear(asignacion)
  }

  async listar(filtros: FiltrosAsignacionDto): Promise<[Asignacion[], number]> {
    return this.asignacionRepository.listar(filtros)
  }

  async buscarPorId(idAsignacion: string): Promise<Asignacion> {
    const asignacion = await this.asignacionRepository.buscarPorId(idAsignacion)
    if (!asignacion) {
      throw new NotFoundException(`Asignación con ID ${idAsignacion} no encontrada`)
    }
    return asignacion
  }

  async buscarPorUsuarioLogin(usuarioLogin: string): Promise<Asignacion[]> {
    return this.asignacionRepository.buscarPorUsuarioLogin(usuarioLogin)
  }

  /**
   * Buscar casos no aprobados (donde numero_caso está vacío)
   * Implementa la funcionalidad de muestranoaprob() del FRM-OP-ING.aspx.cs
   */
  async buscarNoAprobadosPorUsuario(usuarioLogin: string): Promise<Asignacion[]> {
    return this.asignacionRepository.buscarNoAprobadosPorUsuario(usuarioLogin)
  }

  async buscarPorNumeroCaso(numeroCaso: string): Promise<Asignacion> {
    const asignacion =
      await this.asignacionRepository.buscarPorNumeroCaso(numeroCaso)
    if (!asignacion) {
      throw new NotFoundException(
        `Asignación con número de caso ${numeroCaso} no encontrada`,
      )
    }
    return asignacion
  }

  async buscarPorNumeroOperativo(numeroOperativo: string): Promise<Asignacion> {
    const asignacion =
      await this.asignacionRepository.buscarPorNumeroOperativo(numeroOperativo)
    if (!asignacion) {
      throw new NotFoundException(
        `Asignación con número de operativo ${numeroOperativo} no encontrada`,
      )
    }
    return asignacion
  }

  async actualizar(
    idAsignacion: string,
    dto: ActualizarAsignacionDto,
  ): Promise<Asignacion> {
    const asignacion = await this.buscarPorId(idAsignacion)

    Object.assign(asignacion, {
      ...dto,
      fechaOperativo: dto.fechaOperativo
        ? new Date(dto.fechaOperativo)
        : asignacion.fechaOperativo,
    })

    return this.asignacionRepository.actualizar(asignacion)
  }

  async eliminar(idAsignacion: string): Promise<void> {
    const asignacion = await this.buscarPorId(idAsignacion)
    await this.asignacionRepository.eliminar(asignacion.idAsignacion)
  }
}
