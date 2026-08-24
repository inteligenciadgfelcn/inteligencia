import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePersonaImplicadaDto } from './dto/create-personas_implicada.dto'
import { UpdatePersonasImplicadaDto } from './dto/update-personas_implicada.dto'
import { PersonasImplicadasLgiRepository } from './repository/personas_implicadas.repository'
import { PersonasImplicada } from './entities/personas_implicada.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { DeletePersonasImplicadaDto } from './dto/delete-personas_implicadas.dto'

@Injectable()
export class PersonasImplicadasService {
  constructor(private readonly repository: PersonasImplicadasLgiRepository) {}

  async registrarPersona(dto: CreatePersonaImplicadaDto): Promise<{
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
    dto: UpdatePersonasImplicadaDto
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
  dto: DeletePersonasImplicadaDto,
): Promise<{
  message: string;
  id: number;
}> {
  const persona =
    await this.repository.eliminarLogicamente(
      deId,
      dto,
    );

  if (!persona) {
    throw new NotFoundException(
      `No se encontró la persona implicada activa con id ${deId}`,
    );
  }

  return {
    message: 'Persona implicada eliminada exitosamente',
    id: persona.deId,
  };
}
}
