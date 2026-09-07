import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { PaginacionQueryDto } from '@/common/dto/paginacion-query.dto'
import { AsignacionLgi } from './entities/asignacion_lgi.entity'
import { AsignacionLgiRepository } from './repository/asignacion_lgi.repository'
import { DistritalLgiRepository } from '../parametro/parametricas_lgi/repository/distrito.repository'
import { CreateAsignacionLgiDto } from './dto/create-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from './dto/update-asignacion_lgi.dto'
import { GrupoLgiRepository } from '../parametro/parametricas_lgi/repository/grupo.repository'

@Injectable()
export class AsignacionLgiService {
  constructor(
    private readonly asignacionLgiRepository: AsignacionLgiRepository,

    private readonly distritalLgiRepository: DistritalLgiRepository,
    private readonly grupoLgiRepository: GrupoLgiRepository
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

    const uniAbrev = String(unidad.uniAbrev).trim()

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

    const grupo = await this.grupoLgiRepository.findOne(dto.idGrupo)

    if (!grupo) {
      throw new NotFoundException('No se encontró el grupo seleccionado')
    }

    const descripcionGrupo = String(grupo.descripcion).trim()

    if (!descripcionGrupo) {
      throw new BadRequestException(
        'El grupo no tiene una descripción configurada'
      )
    }

    const asignacionGuardada =
      await this.asignacionLgiRepository.crearAsignacionDual(
        dto,
        uniAbrev,
        descripcionGrupo
      )

    return {
      message: 'Datos generales registrados correctamente',
      id: asignacionGuardada.casosId,
    }
  }

  async update(id: number, dto: UpdateAsignacionLgiDto) {
    const asignacion = await this.asignacionLgiRepository.findOneById(id)

    if (!asignacion) {
      throw new NotFoundException(`No existe la asignación con ID ${id}`)
    }

    const { disId, idGrupo, controlJurisdiccional, ...datos } = dto

    // Actualizar distrital y unidad
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
          'La abreviatura no puede superar los 3 caracteres'
        )
      }

      asignacion.disId = disId
      asignacion.uniAbrev = uniAbrev
    }

    // Actualizar descripción del grupo
    if (idGrupo !== undefined) {
      const grupo = await this.grupoLgiRepository.findOne(idGrupo)

      if (!grupo) {
        throw new NotFoundException('No se encontró el grupo seleccionado')
      }

      const descripcionGrupo = String(grupo.descripcion).trim()

      if (!descripcionGrupo) {
        throw new BadRequestException(
          'El grupo no tiene una descripción configurada'
        )
      }

      asignacion.descripcionGrupo = descripcionGrupo
    }

    Object.assign(asignacion, datos)

    await this.asignacionLgiRepository.update(asignacion)

    return {
      message: 'Datos generales actualizados correctamente',
    }
  }

  findAllPaginado(pagination: PaginacionQueryDto) {
    return this.asignacionLgiRepository.findAllPaginado(pagination)
  }

  async findOne(id: number): Promise<AsignacionLgi> {
    const asignacion = await this.asignacionLgiRepository.findOneById(id)

    if (!asignacion) {
      throw new NotFoundException(`No existe la asignación con ID ${id}`)
    }

    return asignacion
  }

  async remove(id: number): Promise<AsignacionLgi> {
    const asignacion = await this.asignacionLgiRepository.inactivar(id)

    if (!asignacion) {
      throw new NotFoundException(`No existe la asignación activa con ID ${id}`)
    }

    return asignacion
  }
}
