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
import { RegistrarEtapaProcesalDto } from './dto/etapa-asignacion_lgi.dto'
import { EtapaProcesalRepository } from './repository/etapa-procesal.repository'

@Injectable()
export class AsignacionLgiService {
  constructor(
    private readonly asignacionLgiRepository: AsignacionLgiRepository,
    private readonly repositoryEtapaprocesal: EtapaProcesalRepository,
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

      asignacion.idGrupo = grupo.id
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

  findAllPaginadoInvestigado(
    pagination: PaginacionQueryDto,
    numeroPase: string
  ) {
    return this.asignacionLgiRepository.findAllPaginadoInvestigado(
      pagination,
      numeroPase
    )
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

  async registrar(
    casosId: number,
    dto: RegistrarEtapaProcesalDto,
    usuario: string,
    documento?: Express.Multer.File
  ) {
    if (documento) {
      if (!documento.buffer?.length) {
        throw new BadRequestException('El documento está vacío')
      }

      const esPdf =
        documento.mimetype === 'application/pdf' &&
        documento.buffer.subarray(0, 5).toString() === '%PDF-'

      if (!esPdf) {
        throw new BadRequestException('Solo se permite adjuntar un PDF')
      }

      if (!dto.descripcionDocumento?.trim()) {
        throw new BadRequestException('Ingrese la descripción del documento')
      }
    }

    return this.repositoryEtapaprocesal.registrar(
      casosId,
      dto,
      usuario,
      documento
    )
  }

  async listarPorCaso(casosId: number) {
    const asignacion = await this.asignacionLgiRepository.findOneById(casosId)

    if (!asignacion) {
      throw new NotFoundException(`No existe el caso ${casosId}`)
    }
    return this.repositoryEtapaprocesal.listarPorCaso(casosId)
  }

}
