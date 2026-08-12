import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateAsignacionLgiDto } from './dto/create-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from './dto/update-asignacion_lgi.dto'
import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgiRepository } from './repository/asignacion_lgi.repository'
import { DistritalLgiRepository } from '../parametro/parametricas_lgi/repository/distrito.repository'

@Injectable()
export class AsignacionLgiService {
  constructor(
    private readonly asignacionLgiRepository: AsignacionLgiRepository,
    private readonly distritalLgiRepository: DistritalLgiRepository
  ) {}

  async create(dto: CreateAsignacionLgiDto) {
    const unidad = await this.distritalLgiRepository.findUnidadByDistrito(
      dto.disId
    )

    if (!unidad) {
      throw new NotFoundException(
        'No se encontró la unidad correspondiente a la distrital seleccionada'
      )
    }

    const uniAbrev = String(unidad.uniAbrev).trim().toUpperCase()

    if (!uniAbrev) {
      throw new BadRequestException(
        'La unidad no tiene una abreviatura configurada'
      )
    }

    if (uniAbrev.length > 3) {
      throw new BadRequestException(
        'La abreviatura de la unidad no puede superar los 3 caracteres'
      )
    }

    const { disId, idGrupo, controlJurisdiccional, ...datos } = dto

    const asignacion = this.asignacionLgiRepository.create({
      ...datos,
      disId: disId,
      uniAbrev,
    })

    await this.asignacionLgiRepository.save(asignacion)

    return {
      message: 'Datos generales registrados correctamente',
      id: asignacion.casosId,
    }
  }

  async update(id: number, dto: UpdateAsignacionLgiDto) {
    const asignacion = await this.asignacionLgiRepository.findOneById(id)

    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada')
    }

    const { disId, idGrupo, controlJurisdiccional, ...datos } = dto

    if (disId !== undefined) {
      const unidad =
        await this.distritalLgiRepository.findUnidadByDistrito(disId)

      if (!unidad) {
        throw new NotFoundException(
          'No se encontró la unidad correspondiente a la distrital seleccionada'
        )
      }

      const uniAbrev = String(unidad.uniAbrev).trim().toUpperCase()

      if (!uniAbrev) {
        throw new BadRequestException(
          'La unidad no tiene una abreviatura configurada'
        )
      }

      if (uniAbrev.length > 3) {
        throw new BadRequestException(
          'La abreviatura de la unidad no puede superar los 3 caracteres'
        )
      }

      asignacion.disId = disId
      asignacion.uniAbrev = uniAbrev
    }

    Object.assign(asignacion, datos)

    await this.asignacionLgiRepository.save(asignacion)

    return {
      message: 'Datos generales actualizados correctamente',
    }
  }

  async findAllPaginado(pagination: PaginacionQueryDto) {
    return await this.asignacionLgiRepository.findAllPaginado(pagination)
  }

  findOne(id: number) {
    return `This action returns a #${id} asignacionLgi`
  }

  remove(id: number) {
    return `This action removes a #${id} asignacionLgi`
  }
}
