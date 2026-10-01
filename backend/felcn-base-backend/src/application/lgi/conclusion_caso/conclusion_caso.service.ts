import {
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { CreateConclusionCasoDto } from './dto/create-conclusion_caso.dto'
import { UpdateConclusionCasoDto } from './dto/update-conclusion_caso.dto'
import {
  ConclusionCasoRepository,
  ConclusionCasoResultado,
} from './repository/conclusion_caso.repository'

interface RequestConAuditoria extends Request {
  usuarioAuditoria?: string
}

@Injectable({ scope: Scope.REQUEST })
export class ConclusionCasoService {
  constructor(
    private readonly repository: ConclusionCasoRepository,
    @Inject(REQUEST)
    private readonly request: RequestConAuditoria
  ) {}

  private obtenerUsuarioAuditoria(): string {
    const usuario = this.request.usuarioAuditoria?.trim()

    if (!usuario) {
      throw new UnauthorizedException(
        'No se encontró el usuario para registrar la auditoría'
      )
    }

    return usuario
  }

  async create(dto: CreateConclusionCasoDto): Promise<ConclusionCasoResultado> {
    return this.repository.create(dto, this.obtenerUsuarioAuditoria())
  }

  async findByCaso(casoId: string): Promise<ConclusionCasoResultado> {
    return this.repository.findByCaso(casoId)
  }

  async update(
    casoId: string,
    dto: UpdateConclusionCasoDto
  ): Promise<ConclusionCasoResultado> {
    return this.repository.update(casoId, dto, this.obtenerUsuarioAuditoria())
  }

  async removeSeleccion(
    casoId: string,
    tipo: string,
    seleccionId: string
  ): Promise<{ message: string }> {
    return this.repository.removeSeleccion(casoId, tipo, seleccionId)
  }

  async remove(casoId: string): Promise<{ message: string }> {
    return this.repository.remove(casoId)
  }
}
