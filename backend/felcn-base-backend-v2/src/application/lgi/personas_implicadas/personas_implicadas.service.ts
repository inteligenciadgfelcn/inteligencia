import { Injectable, NotFoundException } from '@nestjs/common'
import { CreatePersonaImplicadaDto } from './dto/create-personas_implicada.dto'
import { UpdatePersonasImplicadaDto } from './dto/update-personas_implicada.dto'
import { PersonasImplicadasLgiRepository } from './repository/personas_implicadas.repository'
import { PersonasImplicada } from './entities/personas_implicada.entity'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'

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

  update(id: number, updatePersonasImplicadaDto: UpdatePersonasImplicadaDto) {
    return `This action updates a #${id} personasImplicada`
  }

  remove(id: number) {
    return `This action removes a #${id} personasImplicada`
  }
}
