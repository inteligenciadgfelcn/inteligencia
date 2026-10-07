import { Injectable } from '@nestjs/common'
import { CreateConclusionPdDto } from './dto/create-conclusion_caso.dto'
import { UpdateConclusionPdDto } from './dto/update-conclusion_caso.dto'
import { ConclusionPdRepository, ConclusionPdResultado } from './repository/conclusion_caso.repository'

@Injectable()
export class ConclusionPdService {
  constructor(
    private readonly repository: ConclusionPdRepository
  ) {}

  async create(
    dto: CreateConclusionPdDto,
    usuario: string
  ): Promise<ConclusionPdResultado> {
    return this.repository.create(dto, usuario)
  }

  async findByCaso(
    casosId: number
  ): Promise<ConclusionPdResultado> {
    return this.repository.findByCaso(casosId)
  }

  async update(
    casosId: number,
    dto: UpdateConclusionPdDto,
    usuario: string
  ): Promise<ConclusionPdResultado> {
    return this.repository.update(casosId, dto, usuario)
  }

  async removeSeleccion(
    casosId: number,
    tipo: string,
    seleccionId: number
  ): Promise<{ message: string }> {
    return this.repository.removeSeleccion(
      casosId,
      tipo,
      seleccionId
    )
  }

  async remove(
    casosId: number
  ): Promise<{ message: string }> {
    return this.repository.remove(casosId)
  }
}