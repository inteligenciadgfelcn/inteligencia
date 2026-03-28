import { BaseService } from '@/common/base/base-service'
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { GradoRepository } from '../repository/grado.repository'
import { CrearGradoDto, ActualizarGradoDto } from '../dto/grado.dto'
import { Messages } from '@/common/constants/response-messages'
import { GradoEstado } from '../constant'

@Injectable()
export class GradoService extends BaseService {
  constructor(
    @Inject(GradoRepository)
    private gradoRepositorio: GradoRepository
  ) {
    super()
  }

  async listar() {
    return await this.gradoRepositorio.listar()
  }

  async listarTodos() {
    return await this.gradoRepositorio.listarTodos()
  }

  async crear(dto: CrearGradoDto, usuarioAuditoria: string) {
    return await this.gradoRepositorio.crear(dto, usuarioAuditoria)
  }

  async actualizar(id: number, dto: ActualizarGradoDto, usuarioAuditoria: string) {
    const grado = await this.gradoRepositorio.buscarPorId(id)
    if (!grado) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.gradoRepositorio.actualizar(id, dto, usuarioAuditoria)
    return { id }
  }

  async activar(id: number, usuarioAuditoria: string) {
    const grado = await this.gradoRepositorio.buscarPorId(id)
    if (!grado) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.gradoRepositorio.actualizar(
      id,
      { estado: GradoEstado.ACTIVE } as unknown as ActualizarGradoDto,
      usuarioAuditoria
    )
    return { id, estado: GradoEstado.ACTIVE }
  }

  async inactivar(id: number, usuarioAuditoria: string) {
    const grado = await this.gradoRepositorio.buscarPorId(id)
    if (!grado) {
      throw new NotFoundException(Messages.EXCEPTION_DEFAULT)
    }
    await this.gradoRepositorio.actualizar(
      id,
      { estado: GradoEstado.INACTIVE } as unknown as ActualizarGradoDto,
      usuarioAuditoria
    )
    return { id, estado: GradoEstado.INACTIVE }
  }
}
