import { Injectable, NotFoundException } from '@nestjs/common'
import { UpdateSituacionJuridicaDto } from './dto/update-situacion_juridica.dto'
import { CreateSituacionJuridicaDto } from './dto/create-situacion_juridica.dto'
import { SituacionJuridicaRepository } from './repository/situacion_juridica.repository'
import { SituacionJuridica } from './entities/situacion_juridica.entity'
import { DeleteSituacionJuridicaDto } from './dto/delete-situacion_juridica.dto'

@Injectable()
export class SituacionJuridicaService {
  constructor(private readonly repository: SituacionJuridicaRepository) {}

  async registrarSituacionJuridica(dto: CreateSituacionJuridicaDto): Promise<{
    message: string
    id: number
  }> {
    const situacion = await this.repository.registrarSituacionJuridica(dto)

    return {
      message: 'Situación jurídica registrada exitosamente',
      id: situacion.situacionId,
    }
  }

  async findAll(): Promise<SituacionJuridica[]> {
    return this.repository.findAll()
  }

  async findOne(situacionId: number): Promise<SituacionJuridica> {
    const situacion = await this.repository.findOne(situacionId)

    if (!situacion) {
      throw new NotFoundException(
        `No se encontró la situación jurídica con id ${situacionId}`
      )
    }

    return situacion
  }

  async update(
    situacionId: number,
    dto: UpdateSituacionJuridicaDto
  ): Promise<{
    message: string
    id: number
  }> {
    const situacion = await this.repository.update(situacionId, dto)

    if (!situacion) {
      throw new NotFoundException(
        `No se encontró la situación jurídica con id ${situacionId}`
      )
    }

    return {
      message: 'Situación jurídica actualizada exitosamente',
      id: situacion.situacionId,
    }
  }

  async remove(
    situacionId: number,
    dto: DeleteSituacionJuridicaDto
  ): Promise<{
    message: string
    id: number
  }> {
    const situacion = await this.repository.remove(situacionId, dto)

    if (!situacion) {
      throw new NotFoundException(
        `No se encontró la situación jurídica activa con id ${situacionId}`
      )
    }

    return {
      message: 'Situación jurídica eliminada exitosamente',
      id: situacion.situacionId,
    }
  }
}
