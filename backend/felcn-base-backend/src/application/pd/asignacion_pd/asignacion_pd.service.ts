import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { CreateAsignacionLgiDto } from '@/application/lgi/asignacion_lgi/dto/create-asignacion_lgi.dto'
import { RegistrarEtapaProcesalDto } from '@/application/lgi/asignacion_lgi/dto/etapa-asignacion_lgi.dto'
import { UpdateAsignacionLgiDto } from '@/application/lgi/asignacion_lgi/dto/update-asignacion_lgi.dto'
import { AsignacionLgi } from '@/application/lgi/asignacion_lgi/entities/asignacion_lgi.entity'
import { EtapaProcesalRepository } from '@/application/lgi/asignacion_lgi/repository/etapa-procesal.repository'
import { DistritalLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/distrito.repository'
import { GrupoLgiRepository } from '@/application/lgi/parametro/parametricas_lgi/repository/grupo.repository'
import { PaginacionQueryDto } from '@/common/dto'
import { AsignacionPdRepository } from './repository/asignacion_pd.repository'

@Injectable()
export class AsignacionPdService {
  constructor(
    private readonly asignacionPdRepository: AsignacionPdRepository,
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
      await this.asignacionPdRepository.crearAsignacionDual(
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
    const asignacion = await this.asignacionPdRepository.findOneById(id)

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

    await this.asignacionPdRepository.update(asignacion)

    return {
      message: 'Datos generales actualizados correctamente',
    }
  }

  findAllPaginado(pagination: PaginacionQueryDto) {
    return this.asignacionPdRepository.findAllPaginado(pagination)
  }

  findAllPaginadoInvestigado(
    pagination: PaginacionQueryDto,
    numeroPase: string
  ) {
    return this.asignacionPdRepository.findAllPaginadoInvestigado(
      pagination,
      numeroPase
    )
  }

  async findOne(id: number): Promise<AsignacionLgi> {
    const asignacion = await this.asignacionPdRepository.findOneById(id)

    if (!asignacion) {
      throw new NotFoundException(`No existe la asignación con ID ${id}`)
    }

    return asignacion
  }

  async remove(id: number): Promise<AsignacionLgi> {
    const asignacion = await this.asignacionPdRepository.inactivar(id)

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
    const asignacion = await this.asignacionPdRepository.findOneById(casosId)

    if (!asignacion) {
      throw new NotFoundException(`No existe el caso ${casosId}`)
    }
    return this.repositoryEtapaprocesal.listarPorCaso(casosId)
  }
}
