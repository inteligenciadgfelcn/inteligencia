import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePersonasIdentificadaDto } from './dto/create-personas_identificada.dto'
import { UpdatePersonasIdentificadaDto } from './dto/update-personas_identificada.dto'
import { PersonasImplicada } from '@/application/lgi/personas_implicadas/entities/personas_implicada.entity'
import { PaginacionQueryDto } from '@/common/dto'
import { DeletePersonasIdentificadaDto } from './dto/delete-personas_identificada.dto'
import { PersonasIdentificadaRepository } from './repository/personas_identificadas.repository'

@Injectable()
export class PersonasIdentificadasService {
  constructor(private readonly repository: PersonasIdentificadaRepository) {}

  async registrarPersona(dto: CreatePersonasIdentificadaDto): Promise<{
    message: string
    id: number
  }> {
    const detenido = await this.repository.registrarPersona(dto)

    return {
      message: 'Registro de implicado exitoso',
      id: detenido.deId,
    }
  }

  async findAll(
    casoId: number,
    pagination: PaginacionQueryDto
  ): Promise<[PersonasImplicada[], number]> {
    return this.repository.findAll(casoId, pagination)
  }

  async findOne(deId: number): Promise<PersonasImplicada> {
    const persona = await this.repository.findOne(deId)

    if (!persona) {
      throw new NotFoundException(
        `No se encontró la persona implicada con id ${deId}`
      )
    }

    return persona
  }

  async update(
    deId: number,
    dto: UpdatePersonasIdentificadaDto
  ): Promise<{
    message: string
    id: number
  }> {
    const persona = await this.repository.update(deId, dto)

    if (!persona) {
      throw new NotFoundException(
        `No se encontró la persona implicada con id ${deId}`
      )
    }

    return {
      message: 'Persona implicada actualizada exitosamente',
      id: persona.deId,
    }
  }

  async eliminarLogicamente(
    deId: number,
    dto: DeletePersonasIdentificadaDto
  ): Promise<{
    message: string
    id: number
  }> {
    const persona = await this.repository.eliminarLogicamente(deId, dto)

    if (!persona) {
      throw new NotFoundException(
        `No se encontró la persona implicada activa con id ${deId}`
      )
    }

    return {
      message: 'Persona implicada eliminada exitosamente',
      id: persona.deId,
    }
  }
}
