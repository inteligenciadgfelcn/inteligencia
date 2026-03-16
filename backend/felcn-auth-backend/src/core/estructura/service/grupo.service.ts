import { BaseService } from '@/common/base/base-service'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { GrupoRepository } from '../repository/grupo.repository'
import { CrearGrupoDto, ActualizarGrupoDto } from '../dto/grupo.dto'
import { Messages } from '@/common/constants/response-messages'
import { GrupoEstado } from '../constant'

@Injectable()
export class GrupoService extends BaseService {
  constructor(
    @Inject(GrupoRepository)
    private grupoRepositorio: GrupoRepository
  ) {
    super()
  }

  async listar(idDistrital?: number) {
    return await this.grupoRepositorio.listar(idDistrital)
  }

  async listarTodos() {
    return await this.grupoRepositorio.listarTodos()
  }

  async crear(dto: CrearGrupoDto, usuarioAuditoria: string) {
    return await this.grupoRepositorio.crear(dto, usuarioAuditoria)
  }

  async actualizar(id: number, dto: ActualizarGrupoDto, usuarioAuditoria: string) {
    const grupo = await this.grupoRepositorio.buscarPorId(id)
    if (!grupo) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.grupoRepositorio.actualizar(id, dto, usuarioAuditoria)
    return { id }
  }

  async activar(id: number, usuarioAuditoria: string) {
    const grupo = await this.grupoRepositorio.buscarPorId(id)
    if (!grupo) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.grupoRepositorio.actualizar(
      id,
      { estado: GrupoEstado.ACTIVE } as unknown as ActualizarGrupoDto,
      usuarioAuditoria
    )
    return { id, estado: GrupoEstado.ACTIVE }
  }

  async inactivar(id: number, usuarioAuditoria: string) {
    const grupo = await this.grupoRepositorio.buscarPorId(id)
    if (!grupo) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.grupoRepositorio.actualizar(
      id,
      { estado: GrupoEstado.INACTIVE } as unknown as ActualizarGrupoDto,
      usuarioAuditoria
    )
    return { id, estado: GrupoEstado.INACTIVE }
  }
}
