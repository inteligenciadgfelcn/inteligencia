import { BaseService } from '@/common/base/base-service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UnidadRepository } from '../repository/unidad.repository'
import { CrearUnidadDto, ActualizarUnidadDto } from '../dto/unidad.dto'
import { Messages } from '@/common/constants/response-messages'
import { UnidadEstado } from '../constant'

@Injectable()
export class UnidadService extends BaseService {
  constructor(
    @Inject(UnidadRepository)
    private unidadRepositorio: UnidadRepository
  ) {
    super()
  }

  async listar() {
    return await this.unidadRepositorio.listar()
  }

  async listarTodos() {
    return await this.unidadRepositorio.listarTodos()
  }

  async crear(dto: CrearUnidadDto, usuarioAuditoria: string) {
    return await this.unidadRepositorio.crear(dto, usuarioAuditoria)
  }

  async actualizar(id: number, dto: ActualizarUnidadDto, usuarioAuditoria: string) {
    const unidad = await this.unidadRepositorio.buscarPorId(id)
    if (!unidad) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.unidadRepositorio.actualizar(id, dto, usuarioAuditoria)
    return { id }
  }

  async activar(id: number, usuarioAuditoria: string) {
    const unidad = await this.unidadRepositorio.buscarPorId(id)
    if (!unidad) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.unidadRepositorio.actualizar(
      id,
      { estado: UnidadEstado.ACTIVE } as unknown as ActualizarUnidadDto,
      usuarioAuditoria
    )
    return { id, estado: UnidadEstado.ACTIVE }
  }

  async inactivar(id: number, usuarioAuditoria: string) {
    const unidad = await this.unidadRepositorio.buscarPorId(id)
    if (!unidad) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.unidadRepositorio.actualizar(
      id,
      { estado: UnidadEstado.INACTIVE } as unknown as ActualizarUnidadDto,
      usuarioAuditoria
    )
    return { id, estado: UnidadEstado.INACTIVE }
  }
}
