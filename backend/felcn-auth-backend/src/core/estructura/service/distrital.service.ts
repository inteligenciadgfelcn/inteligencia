import { BaseService } from '@/common/base/base-service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { DistritaRepository } from '../repository/distrital.repository'
import { CrearDistritaDto, ActualizarDistritaDto } from '../dto/distrital.dto'
import { Messages } from '@/common/constants/response-messages'
import { DistritaEstado } from '../constant'

@Injectable()
export class DistritaService extends BaseService {
  constructor(
    @Inject(DistritaRepository)
    private distritaRepositorio: DistritaRepository
  ) {
    super()
  }

  async listar(idUnidad?: number) {
    return await this.distritaRepositorio.listar(idUnidad)
  }

  async listarTodos() {
    return await this.distritaRepositorio.listarTodos()
  }

  async crear(dto: CrearDistritaDto, usuarioAuditoria: string) {
    return await this.distritaRepositorio.crear(dto, usuarioAuditoria)
  }

  async actualizar(id: number, dto: ActualizarDistritaDto, usuarioAuditoria: string) {
    const distrital = await this.distritaRepositorio.buscarPorId(id)
    if (!distrital) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.distritaRepositorio.actualizar(id, dto, usuarioAuditoria)
    return { id }
  }

  async activar(id: number, usuarioAuditoria: string) {
    const distrital = await this.distritaRepositorio.buscarPorId(id)
    if (!distrital) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.distritaRepositorio.actualizar(
      id,
      { estado: DistritaEstado.ACTIVE } as unknown as ActualizarDistritaDto,
      usuarioAuditoria
    )
    return { id, estado: DistritaEstado.ACTIVE }
  }

  async inactivar(id: number, usuarioAuditoria: string) {
    const distrital = await this.distritaRepositorio.buscarPorId(id)
    if (!distrital) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.distritaRepositorio.actualizar(
      id,
      { estado: DistritaEstado.INACTIVE } as unknown as ActualizarDistritaDto,
      usuarioAuditoria
    )
    return { id, estado: DistritaEstado.INACTIVE }
  }
}
